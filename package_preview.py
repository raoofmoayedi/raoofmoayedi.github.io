"""Validate public pages and build a self-contained offline preview."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import base64,json,mimetypes,posixpath,re,zipfile
ROOT=Path(__file__).resolve().parent
ROUTES=['index.html','publications.html','research/private-data.html','research/private-sampling.html','research/private-covariance.html','research/robust-learning.html','research/sgd-robustness.html','research/scientific-learning.html','projects/robust-data-pruning.html','projects/input-space-geometry.html','cv.html']
class Parser(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.links=[];self.refs=[]
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if 'id' in d:self.ids.append(d['id'])
  for k in ('href','src'):
   if k in d:self.links.append(d[k])
  for k in ('for','aria-controls','aria-labelledby','aria-describedby'):
   self.refs.extend(d.get(k,'').split())
docs={}
for route in ROUTES+['404.html']:
 p=ROOT/route;d=Parser();d.feed(p.read_text());docs[p.resolve()]=d
for p,d in docs.items():
 assert len(set(d.ids))==len(d.ids),f'Duplicate ids: {p}'
 assert all(x in d.ids for x in d.refs),f'Missing control/label: {p}'
 for link in d.links:
  u=urlsplit(link)
  if u.scheme or u.netloc:continue
  target=(ROOT/u.path.lstrip('/') if u.path.startswith('/') else p.parent/u.path).resolve() if u.path else p
  assert target.exists(),f'Missing {p}: {link}'
  if u.fragment and target in docs:assert unquote(u.fragment) in docs[target].ids,f'Missing anchor {link}'
def uri(p):
 mime=mimetypes.guess_type(p.name)[0] or 'application/octet-stream'
 return 'data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()
# Each page runs its normal scripts in an isolated frame, preserving all interactions.
bridge='''<script>document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(!a)return;const raw=a.getAttribute('href');if(raw.startsWith('data:')||/^[a-z]+:/i.test(raw)||raw.startsWith('//'))return;const u=new URL(raw,new URL(PAGE_ROUTE,'https://offline.invalid/'));if(!u.pathname.endsWith('.html'))return;e.preventDefault();parent.postMessage({type:'portfolio-route',route:u.pathname.slice(1),anchor:u.hash},'*')});</script>'''
pages={}
for route in ROUTES:
 raw=(ROOT/route).read_text();parent=(ROOT/route).parent
 raw=re.sub(r'<link rel="stylesheet" href="([^"]+)">',lambda m:'<style>'+ (parent/urlsplit(m[1]).path).read_text()+'</style>',raw)
 raw=re.sub(r'<script src="([^"]+)" defer></script>',lambda m:'<script>'+ (parent/urlsplit(m[1]).path).read_text()+'</script>',raw)
 raw=re.sub(r'src="(assets/[^\"]+\.webp)"',lambda m:'src="'+uri(parent/m[1])+'"',raw)
 raw=raw.replace('href="papers.bib"', 'href="'+uri(ROOT/'papers.bib')+'"')
 raw=raw.replace('</body>',bridge.replace('PAGE_ROUTE',json.dumps(route))+'</body>')
 pages[route]=raw
payload=json.dumps(pages).replace('<','\\u003c')
preview='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Raoof Zare Moayedi — offline preview</title><style>html,body{margin:0;height:100%;background:#0b0e14}iframe{display:block;width:100%;height:100%;border:0}</style></head><body><iframe id="portfolio" title="Raoof Zare Moayedi research website"></iframe><script>const pages=PAYLOAD;const f=document.getElementById('portfolio');function show(){const h=location.hash.slice(1),i=h.indexOf('#'),r=(i<0?h:h.slice(0,i))||'index.html',a=i<0?'':h.slice(i+1);f.onload=()=>{if(a)f.contentDocument.getElementById(decodeURIComponent(a))?.scrollIntoView();document.title=f.contentDocument.title};f.srcdoc=pages[r]||pages['index.html']}addEventListener('message',e=>{if(e.source!==f.contentWindow||e.data?.type!=='portfolio-route'||!pages[e.data.route])return;const hash=e.data.route+(e.data.anchor||'');if(location.hash.slice(1)===hash)show();else location.hash=hash});addEventListener('hashchange',show);show();</script></body></html>'''.replace('PAYLOAD',payload)
(ROOT/'preview.html').write_text(preview)
out=ROOT/'dist';out.mkdir(exist_ok=True);(out/'raoof-website-preview.html').write_text(preview)
with zipfile.ZipFile(out/'raoof-website.zip','w',zipfile.ZIP_DEFLATED) as z:
 for route in ROUTES+['404.html','papers.bib','.nojekyll']:z.write(ROOT/route,route)
 for p in (ROOT/'assets').iterdir():
  if p.is_file():z.write(p,p.relative_to(ROOT))
print(f'Validated {len(ROUTES)+1} public pages and built the self-contained offline preview.')
