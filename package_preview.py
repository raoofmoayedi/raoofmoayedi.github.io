"""Validate the generated site and build its downloadable offline preview."""

from base64 import b64encode
from html import escape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import mimetypes
import posixpath
import re
import zipfile

ROOT = Path(__file__).resolve().parent
BASE = ROOT.parent
ROUTES = [
    'index.html',
    'publications.html',
    'research/private-data.html',
    'research/private-sampling.html',
    'research/private-covariance.html',
    'research/robust-learning.html',
    'research/sgd-robustness.html',
    'research/scientific-learning.html',
    'cv.html',
]


def is_site_file(file):
    relative = file.relative_to(ROOT)
    return file.is_file() and relative.name != 'preview.html' and not any(
        part in {'.git', '__pycache__', 'dist'} for part in relative.parts
    )


class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.links = []
        self.references = []
        self.titles = 0
        self.h1 = 0
        self.title = ''
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        for key in ('href', 'src'):
            if key in attrs:
                self.links.append(attrs[key])
        for key in ('for', 'aria-labelledby', 'aria-describedby', 'aria-controls'):
            if attrs.get(key):
                self.references.extend(attrs[key].split())
        if tag == 'title':
            self.titles += 1
            self.in_title = True
        if tag == 'h1':
            self.h1 += 1

    def handle_endtag(self, tag):
        if tag == 'title':
            self.in_title = False

    def handle_data(self, data):
        if self.in_title:
            self.title += data


docs = {}
for file in ROOT.rglob('*.html'):
    if not is_site_file(file):
        continue
    parser = Parser()
    parser.feed(file.read_text())
    docs[file.resolve()] = parser

errors = []
for file, parser in docs.items():
    if len(parser.ids) != len(set(parser.ids)):
        errors.append(f'duplicate id: {file}')
    if parser.titles != 1 or parser.h1 != 1:
        errors.append(f'title/h1 error: {file}')
    for reference in parser.references:
        if reference not in parser.ids:
            errors.append(f'{file.name}: missing control or label ID {reference}')
    for link in parser.links:
        url = urlsplit(link)
        if url.scheme or url.netloc or link == '/':
            continue
        target = (file.parent / unquote(url.path)).resolve() if url.path else file
        if not target.exists():
            errors.append(f'{file.name}: missing {link}')
        elif url.fragment and target in docs and unquote(url.fragment) not in docs[target].ids:
            errors.append(f'{file.name}: missing anchor {link}')
for route in ROUTES:
    if not (ROOT / route).exists():
        errors.append(f'missing preview route: {route}')
if errors:
    raise RuntimeError(errors)
print(f'Validated {len(docs)} HTML documents: files, links, anchors, labels, titles and unique IDs.')


def data_uri(path):
    mime = 'application/x-bibtex' if path.suffix == '.bib' else mimetypes.guess_type(path.name)[0]
    return 'data:' + (mime or 'application/octet-stream') + ';base64,' + b64encode(path.read_bytes()).decode('ascii')


class PreviewPage(HTMLParser):
    """Keep each page's navigation while isolating labels and interactive controls."""

    IDREFS = {'for', 'form', 'list', 'headers', 'aria-labelledby', 'aria-describedby',
              'aria-controls', 'aria-owns', 'aria-activedescendant', 'data-control'}

    def __init__(self, route, page_index, ids):
        super().__init__(convert_charrefs=False)
        self.route = route
        self.ids = {id: f'p{page_index}-{id}' for id in ids}
        self.parts = []

    def local_target(self, value):
        url = urlsplit(value)
        if url.scheme or url.netloc:
            return None, url
        if not url.path:
            return self.route, url
        if url.path.startswith('/'):
            target = posixpath.normpath(unquote(url.path)).lstrip('/')
        else:
            target = posixpath.normpath(posixpath.join(posixpath.dirname(self.route), unquote(url.path)))
        if target in ('', '.'):
            target = 'index.html'
        return target, url

    def render_tag(self, tag, attrs, closed=False):
        result = []
        download = None
        for key, value in attrs:
            if value is None:
                result.append(key)
                continue
            if key == 'id':
                value = self.ids.get(value, value)
            elif key in self.IDREFS:
                value = ' '.join(self.ids.get(id, id) for id in value.split())
            elif key in ('href', 'src', 'poster'):
                target, url = self.local_target(value)
                if target is not None:
                    file = ROOT / target
                    if key == 'href' and tag != 'a' and value.startswith('#'):
                        value = '#' + self.ids.get(url.fragment, url.fragment)
                    elif key == 'href' and target in ROUTES:
                        value = '#' + target + ('#' + url.fragment if url.fragment else '')
                    elif file.is_file():
                        value = data_uri(file)
                        if key == 'href':
                            download = file.name
            value = re.sub(r'url\(#([^)]+)\)', lambda match: 'url(#' + self.ids.get(match.group(1), match.group(1)) + ')', value)
            result.append(f'{key}="{escape(value, quote=True)}"')
        if download and not any(key == 'download' for key, _ in attrs):
            result.append(f'download="{escape(download, quote=True)}"')
        suffix = ' /' if closed else ''
        self.parts.append('<' + tag + (' ' + ' '.join(result) if result else '') + suffix + '>')

    def handle_starttag(self, tag, attrs):
        self.render_tag(tag, attrs)

    def handle_startendtag(self, tag, attrs):
        self.render_tag(tag, attrs, closed=True)

    def handle_endtag(self, tag):
        self.parts.append(f'</{tag}>')

    def handle_data(self, data):
        self.parts.append(data)

    def handle_entityref(self, name):
        self.parts.append(f'&{name};')

    def handle_charref(self, name):
        self.parts.append(f'&#{name};')

    def handle_comment(self, data):
        self.parts.append('<!--' + data + '-->')


home = (ROOT / 'index.html').read_text()
preview_head = home.split('<body>')[0] + '<body>'
css = (ROOT / 'assets/site.css').read_text()
js = (ROOT / 'assets/site.js').read_text()
preview_head = re.sub(r'<link rel="stylesheet"[^>]+>', lambda _: '<style>' + css + '</style>', preview_head)
preview_head = re.sub(r'<script src="assets/site.js" defer></script>', '', preview_head)
chunks = []
for index, route in enumerate(ROUTES):
    file = (ROOT / route).resolve()
    body = file.read_text().split('<body>', 1)[1].rsplit('</body>', 1)[0]
    page = PreviewPage(route, index, docs[file].ids)
    page.feed(body)
    chunks.append(
        f'<div class="preview-page" data-route="{route}" data-page-index="{index}" '
        f'data-page-title="{escape(docs[file].title, quote=True)}"' + (' hidden' if index else '') + '>'
        + ''.join(page.parts) + '</div>'
    )

router = '''
(() => {
  const pages = [...document.querySelectorAll('.preview-page')];
  let previous = null;
  const route = () => {
    const hash = location.hash.slice(1);
    const separator = hash.indexOf('#');
    const name = separator < 0 ? hash : hash.slice(0, separator);
    let anchor = separator < 0 ? '' : hash.slice(separator + 1);
    try { anchor = decodeURIComponent(anchor); } catch (_) { anchor = ''; }
    const active = pages.find(page => page.dataset.route === (name || 'index.html')) || pages[0];
    const changedPage = previous !== null && previous !== active;
    pages.forEach(page => { page.hidden = page !== active; });
    document.title = active.dataset.pageTitle;
    previous = active;
    requestAnimationFrame(() => {
      const target = anchor ? document.getElementById('p' + active.dataset.pageIndex + '-' + anchor) : null;
      if (target) target.scrollIntoView();
      else window.scrollTo(0, 0);
      if (changedPage) {
        const main = active.querySelector('main');
        if (main) { main.setAttribute('tabindex', '-1'); main.focus({ preventScroll: true }); }
      }
    });
  };
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (link && link.getAttribute('href') === location.hash) {
      event.preventDefault();
      route();
    }
  });
  addEventListener('hashchange', route);
  route();
})();
'''

out = ROOT / 'dist'
out.mkdir(exist_ok=True)
preview = out / 'raoof-website-preview.html'
preview.write_text(
    preview_head
    + '\n<style>.preview-page[hidden]{display:none!important}'
      '@media print{.preview-page[hidden]{display:none!important}.preview-page:not([hidden]){display:block!important}}</style>\n'
    + '\n'.join(chunks) + '\n<script>' + js + '</script>\n<script>' + router + '</script></body></html>'
)

# A combined preview may contain several h1 elements, but every ID must remain unique.
preview_parser = Parser()
preview_parser.feed(preview.read_text())
if len(preview_parser.ids) != len(set(preview_parser.ids)):
    raise RuntimeError('Duplicate IDs in the offline preview.')
if any(reference not in preview_parser.ids for reference in preview_parser.references):
    raise RuntimeError('Unresolved control or label reference in the offline preview.')
(ROOT / 'preview.html').write_text(preview.read_text())
with zipfile.ZipFile(out / 'raoof-website.zip', 'w', zipfile.ZIP_DEFLATED) as archive:
    for file in sorted(ROOT.rglob('*')):
        if is_site_file(file):
            archive.write(file, Path('raoof-website') / file.relative_to(ROOT))
print(f'Packaged the website and {len(ROUTES)}-page interactive preview, with embedded downloads.')
