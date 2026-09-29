"""Build the static research website. Standard-library Python only."""
from pathlib import Path
from html import escape
import json

ROOT = Path(__file__).parent
PAPERS = json.loads((ROOT / 'publications.json').read_text())
NAME = 'Raoof Zare Moayedi'
EMAIL = 'Raoofmoayedi2000@gmail.com'
GITHUB = 'https://github.com/raoofmoayedi'
ORIGIN = 'https://raoofmoayedi.github.io'

def head(title, description, prefix='', path=''):
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)}</title><meta name="description" content="{escape(description, quote=True)}">
<meta name="theme-color" content="#f8f9fc"><link rel="canonical" href="{ORIGIN}/{path}">
<meta property="og:title" content="{escape(title, quote=True)}"><meta property="og:description" content="{escape(description, quote=True)}"><meta property="og:type" content="website">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='20' fill='%23244be3'/%3E%3Ctext x='20' y='29' fill='white' font-size='29' text-anchor='middle' font-family='Georgia'%3Er%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="{prefix}assets/site.css"><script src="{prefix}assets/site.js" defer></script></head><body>
<a class="skip" href="#main">Skip to content</a><header class="header"><nav class="nav wrap" aria-label="Main navigation">
<a class="brand" href="{prefix}index.html" aria-label="Raoof Zare Moayedi, home"><span class="brand-mark" aria-hidden="true">r</span><span class="brand-name">Raoof Zare Moayedi</span></a>
<div class="nav-links"><a href="{prefix}index.html#research">Research</a><a href="{prefix}index.html#publications">Papers</a><a href="{prefix}index.html#about">About</a><a class="nav-cv" href="{prefix}cv.html">CV</a></div>
</nav></header>'''

def footer(prefix=''):
    return f'''<footer class="footer"><div class="wrap"><span>Raoof Zare Moayedi · {2026}</span><span><a href="{GITHUB}">GitHub</a> &nbsp; / &nbsp; <a href="mailto:{EMAIL}">Email</a> &nbsp; / &nbsp; <a href="{prefix}cv.html">CV</a></span></div></footer></body></html>'''

def bibtex(p):
    kind='article' if p['type']=='article' else 'misc' if p.get('arxiv') else 'unpublished'
    names=[a.replace('*','') for a in p['authors']]
    fields={'title':'{'+p['title']+'}', 'author':' and '.join(names),'year':str(p['year'])}
    if p.get('venue'): fields['journal']=p['venue']
    if p.get('doi'): fields['doi']=p['doi']
    if p.get('arxiv'): fields.update(eprint=p['arxiv'],archivePrefix='arXiv')
    if p['type']!='article': fields['note']=p['status'].replace(' · ','; ')
    return '@'+kind+'{'+p['id']+',\n'+',\n'.join('  '+k+' = {'+v+'}' for k,v in fields.items())+'\n}'

def publication(p, prefix=''):
    names=[]
    for a in p['authors']:
        text=escape(a.replace('*',''))
        if 'Zare Moayedi' in a: text='<strong>'+text+'</strong>'
        if '*' in a: text+='<sup aria-label="equal contribution">*</sup>'
        names.append(text)
    authors=', '.join(names[:-1])+' and '+names[-1]
    title=escape(p['title'])
    if p.get('url'): title=f'<a href="{p["url"]}" target="_blank" rel="noopener noreferrer">{title}</a>'
    meta=f'<span class="venue">{escape(p["venue"])}</span>' if p['venue'] else escape(p['status'])
    links=''
    if p.get('url'): links+=f'<a href="{p["url"]}" target="_blank" rel="noopener noreferrer">'+('arXiv' if p.get('arxiv') else 'Paper')+'</a>'
    if p.get('project'): links+=f'<a href="{prefix}{p["project"]}">Research notes</a>'
    return f'''<article class="pub" data-type="{'article' if p['type']=='article' else 'manuscript'}"><div class="pub-year">{p['year']}</div><div><h3>{title}</h3><p class="pub-authors">{authors}</p><p class="pub-meta">{meta}</p><div class="pub-links">{links}</div><details><summary>BibTeX</summary><pre>{escape(bibtex(p))}</pre></details></div></article>'''

def figure(scene, id, label, caption, heading='', small=False):
    control=''
    if not small:
        lo,hi,value,output=(0,180,38,'38°') if scene=='geometry' else (0,100,50,'50')
        control=f'<div class="figure-controls"><label for="{id}-control">{label}</label><input type="range" id="{id}-control" min="{lo}" max="{hi}" value="{value}"><output for="{id}-control">{output}</output></div>'
    return f'''<canvas class="{'geometry-canvas' if not small else ''}" data-scene="{scene}" data-control="{id}-control" aria-label="{escape(caption,quote=True)}" role="img">{escape(caption)}</canvas>{control}'''

def card(category,title,description,scene,url):
    return f'''<a class="research-card" href="{url}"><div class="research-art">{figure(scene,'card-'+scene,'','Conceptual '+category+' illustration',small=True)}</div><div class="research-content"><span class="eyebrow">{category}</span><h3>{title}</h3><p>{description}</p><span class="card-link">Explore the research</span></div></a>'''

positions=[
 ('August 2026 – present','EPFL','Research Intern · E3 Program','Prof. Olga Fink','Working on GNNs for long-term prediction of fluid dynamics, using physical knowledge to reduce computational cost.'),
 ('June 2025 – March 2026','University of Cambridge','Remote Research Assistant','Dr. Amir-Reza Asadi','Developed a private synthetic data algorithm with utility guarantees that adapt to the geometry of the data.'),
 ('January – June 2025','Nanyang Technological University','Funded Visiting Research Student','Prof. Yew-Soon Ong','Worked on robust knowledge distillation, superalignment, and task arithmetic. The distillation work led to a paper in IEEE TPAMI.'),
 ('June 2023 – June 2024','Imperial College London','Remote Research Assistant','Dr. Seyed-Mohsen Moosavi-Dezfooli','Studied data pruning and input-space geometry across model architectures, testing how selective pruning affects robustness.')]

home=head(NAME+' | Machine Learning Research','Research in differential privacy, robust machine learning, and graph neural networks for physical systems.')
home+='''<main id="main"><div class="wrap"><section class="hero" aria-labelledby="intro"><div><p class="eyebrow blue">Mathematics &amp; machine learning</p><h1 id="intro">Raoof<br>Zare <em>Moayedi.</em></h1><p class="hero-intro">I study privacy and robustness in machine learning, and how the geometry of data shapes what we can learn.</p><p class="hero-affiliation">M.Sc. student at Sharif University of Technology.<br>Currently an E3 research intern at EPFL.</p><div class="hero-links"><a class="pill" href="#research">Explore my work</a><a class="text-link" href="cv.html">Curriculum vitae</a><a class="text-link" href="mailto:'''+EMAIL+'''">Get in touch</a></div></div><div class="hero-figure"><div class="figure-top"><span class="eyebrow">The geometry of data</span><span class="figure-number">01 / Interactive illustration</span></div>'''
home+=figure('geometry','hero','Rotate the view','A two-dimensional curved surface embedded in a three-dimensional box. The dots illustrate a low-dimensional support; they are not experimental data.')
home+='''<p class="figure-caption"><strong>A surface in a larger space.</strong> Rotate to see how data can have a simpler structure than the space around it. Illustrative data.</p></div></section><div class="affiliation-strip"><span class="eyebrow">Research experience</span><span>EPFL</span><span>Cambridge</span><span>NTU Singapore</span><span>Imperial College London</span></div><section id="research" class="section"><div class="section-heading"><div><p class="eyebrow">Research directions</p><h2>Questions I work on.</h2></div><p>From theoretical guarantees to the behavior of learning algorithms.</p></div><div class="research-grid">'''
home+=card('Differential privacy','Private data.<br>Useful structure.','How can private synthetic data generation adapt to the geometry of its support?','geometry','research/private-data.html')
home+=card('Robust learning','Learning that<br>holds up.','Understanding model robustness, from knowledge distillation to spurious correlations.','robustness','research/robust-learning.html')
home+=card('Scientific machine learning','Learning physical<br>systems.','Graph neural networks for fluid dynamics and physics-informed neural networks.','mesh','research/scientific-learning.html')
home+='''</div></section></div><section id="publications" class="section pub-section"><div class="wrap"><div class="section-heading"><div><p class="eyebrow">Publications &amp; manuscripts</p><h2>On paper.</h2></div><p>Journal articles, preprints, and work under review.</p></div><div class="filters" role="group" aria-label="Filter publications"><button class="filter" data-filter="all" aria-pressed="true">All work</button><button class="filter" data-filter="article" aria-pressed="false">Journal articles</button><button class="filter" data-filter="manuscript" aria-pressed="false">Preprints &amp; manuscripts</button></div><p class="sr-only" id="filter-status" aria-live="polite">7 papers shown</p><div class="pub-list">'''
home+=''.join(publication(p) for p in PAPERS)
home+='''</div><p class="pub-footer">* Equal contribution. Publication and review statuses last updated September 2026.</p></div></section><div class="wrap"><section id="about" class="section about-grid"><div class="about-intro"><p class="eyebrow">A little background</p><h2>Mathematics first.<br>Research across fields.</h2><p>I studied mathematics and computer science at Amirkabir University of Technology and am now completing my master's in computer science at Sharif University of Technology.</p><p>My research has taken me from differential privacy and learning theory to robust models and scientific machine learning.</p><a class="text-link" href="cv.html">Education, teaching &amp; full CV</a></div><div class="timeline">'''
for date,school,role,supervisor,description in positions:
    home+=f'<article class="position"><span class="position-date">{date}</span><h3>{school}</h3><span class="position-role">{role}</span><p>{description}</p></article>'
home+=f'''</div></section><section class="contact"><div><p class="eyebrow">Contact</p><h2>Let’s talk research.</h2></div><a href="mailto:{EMAIL}">{EMAIL}</a></section></div></main>'''+footer()
(ROOT/'index.html').write_text(home)

projects=[
 {'slug':'private-data','category':'Differential privacy','title':'Private data. Useful structure.','lead':'Understanding how the geometry of a dataset can make private synthetic data generation more accurate.','role':'Research with Dr. Amir-Reza Asadi','setting':'University of Cambridge · Remote','scene':'geometry','control':'Rotate the view','caption':'Conceptual illustration: a two-dimensional surface inside a three-dimensional space. These points illustrate intrinsic versus ambient dimension; they are not paper results.','body':'''<h2>The question</h2><p>High-dimensional data may lie near a much simpler structure. Can a private synthetic data mechanism benefit from that structure while maintaining its privacy guarantee?</p><h2>The approach</h2><p>Our work on <em>Geometry-Adaptive Mechanisms for Private Synthetic Data</em> studies data on [0,1]<sup>d</sup>. The mechanism privately selects a resolution and builds a pruned spatial hierarchy.</p><p>Under the paper’s geometric assumptions, the Wasserstein error rate depends on a packing-growth dimension of the support, rather than only on the ambient dimension. The paper also establishes a corresponding lower bound within this framework.</p><h2>My work</h2><p>During my research with Dr. Amir-Reza Asadi, I developed an algorithm for differentially private synthetic data generation with improved utility guarantees.</p>''','paper':'raoof_synthetic','after':'''<h2>Related questions</h2><p>I also work on private covariance estimation under vertical partitioning and private multi-sampling from Gaussian distributions. The latter is the subject of my master’s thesis.</p>'''},
 {'slug':'robust-learning','category':'Robust machine learning','title':'Learning that holds up.','lead':'Studying how models behave under perturbations, and how to transfer robustness from one model to another.','role':'Research with Prof. Yew-Soon Ong','setting':'Nanyang Technological University','scene':'robustness','control':'Boundary tilt','caption':'Conceptual illustration: two synthetic classes and a movable linear decision boundary. This is a geometric sketch, not an adversarial attack or an experimental result from the paper.','body':'''<h2>The question</h2><p>A smaller model can inherit a teacher’s mistakes as well as its strengths. How can knowledge distillation transfer adversarial robustness more reliably?</p><h2>The paper</h2><p><em>Allies Teach Better Than Enemies</em> uses inverse adversarial examples: inputs adjusted in the opposite direction to adversarial perturbations. The method combines these examples with gradient matching and changes in weight space to align the teacher and student.</p><p>The experiments evaluate both ordinary classification accuracy and performance under attack. The paper was published in IEEE Transactions on Pattern Analysis and Machine Intelligence in 2026.</p><h2>My work</h2><p>At NTU, I worked on robust knowledge distillation, superalignment, and task arithmetic. I co-authored the TPAMI paper with Junhao Dong, Yew-Soon Ong, and Seyed-Mohsen Moosavi-Dezfooli.</p>''','paper':'Junhao_raoof','after':'''<h2>Other work on robustness</h2><p>At Imperial College London, I investigated data pruning and input-space geometry across model architectures. I am also a co-author of a manuscript on transient implicit regularization in SGD and robustness to spurious correlations.</p>'''},
 {'slug':'scientific-learning','category':'Scientific machine learning','title':'Learning physical systems.','lead':'Using physical knowledge and graph structure to study models for differential equations and fluid dynamics.','role':'E3 Research Intern · Prof. Olga Fink','setting':'EPFL · August 2026 – present','scene':'mesh','control':'Illustrative time step','caption':'Conceptual illustration: a prescribed wave-like signal on a rectangular graph. Move the slider to change the signal. This is not a fluid simulation, trained GNN output, or project result.','body':'''<h2>Current work at EPFL</h2><p>I am working on graph neural networks (GNNs) to predict how fluid systems behave over long periods. The goal is to incorporate physical knowledge into these models to reduce computational cost compared with traditional simulations.</p><p>The project is ongoing. A graph provides a way to represent locations and their connections, with information exchanged along its edges.</p><h2>Earlier work: CuPINN</h2><p>Physics-informed neural networks learn solutions to differential equations by reducing the equation residual. Our CuPINN work also penalizes curvature in the residual surface, encouraging smoother behavior across the input domain.</p><p>The paper studies this approach on linear and nonlinear differential equations. The reported results are specific to its benchmark problems and comparisons. CuPINN was published in <em>Computer Methods in Applied Mechanics and Engineering</em> in 2025.</p>''','paper':'raoofzareCU','after':''}
]
for project in projects:
    page=head(project['title']+' | '+NAME,project['lead'],'../','research/'+project['slug']+'.html')
    page+=f'''<main id="main" class="wrap"><header class="project-hero"><a class="back" href="../index.html#research">All research</a><p class="eyebrow blue">{project['category']}</p><h1>{project['title']}</h1><p class="lead">{project['lead']}</p></header><div class="project-body"><aside class="project-aside"><div><h2>Research context</h2><p>{project['setting']}</p></div><div><h2>Role &amp; supervision</h2><p>{project['role']}</p></div></aside><article class="project-copy">{project['body']}<figure class="project-figure">'''
    page+=figure(project['scene'],'project',project['control'],project['caption'])
    page+=f'''<figcaption>{project['caption']}</figcaption></figure>{project['after']}<h2>Read the paper</h2>'''+publication(next(p for p in PAPERS if p['id']==project['paper']),'../')+'</article></div></main>'+footer('../')
    (ROOT/'research'/f'{project["slug"]}.html').write_text(page)

cv=head('Curriculum Vitae | '+NAME,'Education, research experience, publications, teaching, and honors.','', 'cv.html')
cv+=f'''<main id="main" class="wrap"><article class="cv"><div class="cv-top"><div><h1>{NAME}</h1><p class="cv-sub">Machine learning · Privacy · Robustness</p><p><a href="mailto:{EMAIL}">{EMAIL}</a> · <a href="{GITHUB}">GitHub</a></p></div><button class="pill" data-print>Print / save PDF</button></div><h2>Education</h2><h3>Sharif University of Technology <span class="cv-dates">2024 – present</span></h3><p>M.Sc. in Computer Science · GPA: 19.7/20 · Ranked 1st in class (ongoing).</p><p>Thesis: Minimax-Optimal Private Multi-Sampling from Gaussian Distributions.</p><h3>Amirkabir University of Technology <span class="cv-dates">2019 – 2023</span></h3><p>B.Sc. in Mathematics · GPA: 18.99/20 · Ranked 2nd in graduating class.</p><h3>Amirkabir University of Technology <span class="cv-dates">2018 – 2023</span></h3><p>B.Sc. in Computer Science · GPA: 18.82/20 · Ranked 3rd in graduating class.</p><p>Thesis: A Survey on Differentially Private Algorithms.</p><h2>Research experience</h2>'''
for date,school,role,supervisor,description in positions:
    cv+=f'<h3>{school}<span class="cv-dates">{date}</span></h3><p>{role} · <span class="supervisor">{supervisor}</span></p><p>{description}</p>'
cv+='<h2>Publications</h2>'+''.join(publication(p) for p in PAPERS if p['type']=='article')
cv+='<h2>Preprints and manuscripts</h2>'+''.join(publication(p) for p in PAPERS if p['type']!='article')
cv+='''<p>* Equal contribution.</p><h2>Honors &amp; funding</h2><ul><li>EPFL Excellence in Engineering (E3) Fellowship, 2026.</li><li>Funded visiting research student position at NTU, 2025.</li><li>Ranked 9th among 5,000 candidates in Iran’s National M.Sc. Computer Science Entrance Exam, 2024.</li></ul><h2>Teaching</h2><p><strong>Graduate courses:</strong> Learning Theory (Fall 2025), Information Theory (Fall 2024), Trustworthy Machine Learning (Fall 2024), Scientific Deep Learning (Fall 2024), Measure Theory and Probability (Fall 2022), Machine Learning (Fall 2022).</p><p><strong>Undergraduate courses:</strong> Real Analysis (Spring 2023), Applied Linear Algebra (Fall 2022), Stochastic Process (Spring 2022), Computational Theory (Fall 2021).</p><h2>Relevant coursework</h2><p><strong>Graduate courses (grades out of 20):</strong> Learning Theory (20), Information Theory (20), Advanced Statistics (20), Advanced Algorithms (18.2), Bandit Learning (20), Generative Models (20), Functional Analysis (17), Measure Theory and Probability (20).</p><p><strong>Graduate-level audited courses:</strong> High-Dimensional Statistics, Convex Optimization.</p><h2>Languages</h2><p>Persian: Native · English: TOEFL iBT 101.</p></article></main>'''+footer()
(ROOT/'cv.html').write_text(cv)
(ROOT/'papers.bib').write_text('\n\n'.join(bibtex(p) for p in PAPERS)+'\n')
(ROOT/'404.html').write_text(head('Page not found | '+NAME,'This page could not be found.')+'<main id="main" class="wrap"><section class="project-hero"><p class="eyebrow">404</p><h1>Page not found.</h1><p>The page may have moved. <a class="text-link" href="https://raoofmoayedi.github.io/">Return to the homepage</a>.</p></section></main>'+footer())
print('Built homepage, three research pages, CV, bibliography and 404 page.')
