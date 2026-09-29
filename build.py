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
    research_current = ' aria-current="page"' if path.startswith('research/') else ''
    publications_current = ' aria-current="page"' if path == 'publications.html' else ''
    cv_current = ' aria-current="page"' if path == 'cv.html' else ''
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{escape(title)}</title><meta name="description" content="{escape(description, quote=True)}">
<meta name="theme-color" content="#111618"><meta name="color-scheme" content="dark"><link rel="canonical" href="{ORIGIN}/{path}">
<meta property="og:title" content="{escape(title, quote=True)}"><meta property="og:description" content="{escape(description, quote=True)}"><meta property="og:type" content="website">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 40'%3E%3Crect width='40' height='40' rx='20' fill='%23bdd3b4'/%3E%3Ctext x='20' y='29' fill='%23111618' font-size='29' text-anchor='middle' font-family='sans-serif'%3Er%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="{prefix}assets/site.css"><script src="{prefix}assets/site.js" defer></script></head><body>
<a class="skip" href="#main">Skip to content</a><header class="header"><nav class="nav wrap" aria-label="Main navigation">
<a class="brand" href="{prefix}index.html" aria-label="Raoof Zare Moayedi, home">Raoof Zare Moayedi</a>
<div class="nav-links"><a{research_current} href="{prefix}index.html#research">Research</a><a{publications_current} href="{prefix}publications.html">Publications</a><a href="{prefix}index.html#experience">Experience</a><a{cv_current} href="{prefix}cv.html">CV</a></div>
</nav></header>'''

def footer(prefix=''):
    return f'''<footer class="footer"><div class="wrap"><span>Raoof Zare Moayedi</span><span>Last updated September 2026</span></div></footer></body></html>'''

def bibtex(p):
    kind='article' if p['type']=='article' else 'misc' if p.get('arxiv') else 'unpublished'
    names=p['bib_authors']
    fields={'title':'{'+p['title']+'}', 'author':' and '.join(names),'year':str(p['year'])}
    if p.get('venue'): fields['journal']=p['venue']
    if p.get('doi'): fields['doi']=p['doi']
    if p.get('arxiv'): fields.update(eprint=p['arxiv'],archivePrefix='arXiv')
    if p['type']!='article': fields['note']=p['status'].replace(' · ','; ')
    return '@'+kind+'{'+p['id']+',\n'+',\n'.join('  '+k+' = {'+v+'}' for k,v in fields.items())+'\n}'

def publication(p, prefix='', level=3, selected=False, include_project=True):
    names=[]
    for a in p['authors']:
        text=escape(a.replace('*',''))
        if 'Zare Moayedi' in a: text='<strong>'+text+'</strong>'
        if '*' in a: text+='<sup aria-label="equal contribution">*</sup>'
        names.append(text)
    authors=', '.join(names[:-1])+' and '+names[-1]
    title=escape(p['title'])
    title_url = prefix+p['project'] if selected else p.get('url')
    if title_url: title=f'<a href="{title_url}">{title}</a>'
    meta=f'<span class="venue">{escape(p["venue"])}</span>' if p['venue'] else escape(p['status'])
    links=''
    if p.get('url'): links+=f'<a href="{p["url"]}">'+('arXiv' if p.get('arxiv') else 'Paper')+'</a>'
    if p.get('project') and not selected and include_project: links+=f'<a href="{prefix}{p["project"]}">Research details</a>'
    summary=''
    label=f'<span class="pub-year">{p["year"]}</span>'
    if selected:
        topic,explanation=SELECTED[p['id']]
        label=f'<span class="work-topic">{topic}</span><span class="pub-year">{p["year"]}</span>'
        summary=f'<p class="pub-summary">{explanation}</p>'
    citation='' if selected else f'<details><summary>BibTeX</summary><pre>{escape(bibtex(p))}</pre></details>'
    return f'''<article class="pub{' selected-work' if selected else ''}" data-type="{'article' if p['type']=='article' else 'manuscript'}"><div class="pub-label">{label}</div><div class="pub-content"><h{level}>{title}</h{level}><p class="pub-authors">{authors}</p><p class="pub-meta">{meta}</p>{summary}<div class="pub-actions">{links}{citation}</div></div></article>'''


positions=[
 ('August 2026 – present','EPFL','Research Intern · E3 Program','Prof. Olga Fink','Working on GNNs for long-term prediction of fluid dynamics, with the aim of reducing the cost of simulation.'),
 ('June 2025 – March 2026','University of Cambridge','Remote Research Assistant','Dr. Amir-Reza Asadi','Developed a differentially private synthetic data algorithm whose error bounds depend on the geometry of the data.'),
 ('January – June 2025','Nanyang Technological University','Funded Visiting Research Student','Prof. Yew-Soon Ong','Worked on robust knowledge distillation, superalignment, and task arithmetic. The distillation work led to a paper in IEEE TPAMI.'),
 ('June 2023 – June 2024','Imperial College London','Remote Research Assistant','Dr. Seyed-Mohsen Moosavi-Dezfooli','Studied how data pruning and input-space geometry affect robustness across model architectures.')]

SELECTED={
    'raoof_synthetic': ('Differential privacy', 'Private synthetic data on [0,1]<sup>d</sup>, with error guarantees that reflect the geometry of the data.'),
    'Junhao_raoof': ('Robust learning', 'Using inverse adversarial examples to transfer robustness from a teacher model to a student.'),
    'raoofzareCU': ('Scientific ML', 'Improving physics-informed neural networks by penalizing curvature in the equation residual.')
}

home=head(NAME+' | Machine Learning Research','Fundamental questions in machine learning: privacy, robustness, and machine unlearning.')
home+=f'''<main id="main" class="wrap">
<header class="intro" id="about">
<p class="eyebrow">Machine learning research</p><h1>{NAME}</h1>
<p class="intro-lead">I study fundamental questions in machine learning, with a focus on <strong>privacy</strong> and <strong>robustness</strong>. I am also interested in <strong>machine unlearning</strong>.</p>
<p class="intro-description">My work asks how the structure of data and the dynamics of training affect what learning algorithms can guarantee.</p>
<p class="affiliation"><span class="degree">M.Sc. student in Computer Science</span><span class="affiliation-divider" aria-hidden="true">·</span><span>Sharif University of Technology</span></p>
<div class="intro-links"><a href="mailto:{EMAIL}">Email</a><a href="{GITHUB}">GitHub</a><a href="cv.html">Curriculum vitae</a></div>
</header>
<section id="research" class="section"><div class="section-heading"><h2>Selected research</h2><a class="text-link" href="publications.html">All publications</a></div>
<div class="selected-list">'''
for key in SELECTED:
    home+=publication(next(p for p in PAPERS if p['id']==key),selected=True)
home+='''</div></section><section id="experience" class="section"><div class="section-heading"><h2>Research experience</h2></div><div class="experience-list">'''
for date,school,role,supervisor,description in positions:
    home+=f'''<article class="institution-row"><div class="institution-heading"><h3>{school}</h3><p class="position-role">{role}</p><p class="position-date">{date}</p></div><div class="institution-description"><p>{description}</p><p class="supervisor">With {supervisor}</p></div></article>'''
home+='''</div></section><section id="education" class="section"><div class="section-heading"><h2>Education</h2><a class="text-link" href="cv.html">Full CV</a></div><div class="education-list">
<article class="education-row"><div><h3>Sharif University of Technology</h3><p>M.Sc. in Computer Science</p></div><p class="position-date">2024 – present</p></article>
<article class="education-row"><div><h3>Amirkabir University of Technology</h3><p>B.Sc. in Computer Science · B.Sc. in Mathematics</p></div><p class="position-date">2018 – 2023</p></article>
</div></section>
<section class="contact"><h2>Contact</h2><a href="mailto:'''+EMAIL+f'">{EMAIL}</a></section></main>'+footer()
(ROOT/'index.html').write_text(home)

publications=head('Publications | '+NAME,'Journal articles, preprints, and manuscripts by Raoof Zare Moayedi.',path='publications.html')
publications+='''<main id="main" class="wrap publication-page"><header class="page-hero"><p class="eyebrow">Research</p><h1>Publications</h1><p>Journal articles, preprints, and work under review.</p></header><div data-publications><div class="publication-tools"><div class="filters" role="group" aria-label="Filter publications"><button class="filter" data-filter="all" aria-pressed="true">All</button><button class="filter" data-filter="article" aria-pressed="false">Published</button><button class="filter" data-filter="manuscript" aria-pressed="false">Preprints &amp; manuscripts</button></div><a class="text-link bib-download" href="papers.bib" download>Download BibTeX</a></div><p class="sr-only" data-filter-status aria-live="polite">7 papers shown</p><div class="pub-list">'''
for kind,label in [('article','Journal articles'),('manuscript','Preprints & manuscripts')]:
    publications+=f'<section class="pub-group" data-publication-group="{kind}"><h2 class="pub-group-heading">{escape(label)}</h2>'
    publications+=''.join(publication(p) for p in PAPERS if (p['type']=='article')==(kind=='article'))
    publications+='</section>'
publications+='</div><p class="pub-footer">* Equal contribution.</p></div></main>'+footer()
(ROOT/'publications.html').write_text(publications)

projects=[{'slug': 'private-data',
  'category': 'Differential privacy',
  'title': 'Private data and its geometry',
  'lead': 'How can the structure of a dataset improve the accuracy of differentially private synthetic data?',
  'role': 'Research with Dr. Amir-Reza Asadi',
  'setting': 'University of Cambridge · Remote',
  'body': '<h2>Adapting to data geometry</h2><p>Data in a high-dimensional space often lie on a much '
          'simpler, lower-dimensional set. We use this structure to generate synthetic data on '
          '[0,1]<sup>d</sup> under pure differential privacy. Our method privately selects the resolution of '
          'a spatial hierarchy and prunes it to adapt to the data’s geometry.</p><p>Under multiscale '
          'geometric assumptions, the expected Wasserstein error decreases at a rate governed by the '
          'support’s intrinsic dimension rather than only the ambient dimension. We also prove a lower bound '
          'showing that the dimension-dependent exponent is sharp under a corresponding geometric '
          'condition.</p>',
  'paper': 'raoof_synthetic',
  'after': '<h2>Other work on differential privacy</h2><p>I also study <a class="text-link" '
           'href="private-covariance.html">covariance estimation across separate data holders</a> and <a '
           'class="text-link" href="private-sampling.html">private Gaussian sampling</a>. The latter is the '
           'subject of my master’s thesis.</p>',
  'insight': '<section class="paper-insight" aria-labelledby="geometry-result"><h2 id="geometry-result">How '
             'geometry changes the error rate</h2><div class="rate-comparison"><div><span>Worst-case ambient '
             'dimension <i>d</i></span><p '
             'class="result-math">(εn)<sup>−1/d</sup></p></div><div><span>Packing-growth dimension '
             '<i>k</i></span><p class="result-math">(εn)<sup>−1/k</sup></p></div></div><p '
             'class="insight-note">Asymptotic expected 1-Wasserstein error, for <i>d</i> ≥ 2, fixed positive '
             'privacy budget, and fixed geometry. The second rate requires <i>k</i> &gt; 1 and the paper’s '
             'multiscale packing-growth assumptions; <i>n</i> is the number of input records.</p></section>'},
 {'slug': 'robust-learning',
  'category': 'Robust machine learning',
  'title': 'Transferring robustness',
  'lead': 'How can a student model retain a teacher’s adversarial robustness during knowledge distillation?',
  'role': 'Research with Prof. Yew-Soon Ong',
  'setting': 'Nanyang Technological University',
  'body': '<h2>Learning from inverse adversarial examples</h2><p>We study how to transfer adversarial '
          'robustness from a large teacher model to a smaller student. Simply copying the teacher’s '
          'predictions can pass on its mistakes. Our method trains the student using inverse adversarial '
          'examples, formed by reversing the direction of adversarial '
          'perturbations.</p><h2>Results</h2><p>Across the evaluated datasets, the method improves both '
          'accuracy on clean inputs and robustness under attack compared with the tested distillation '
          'methods. The paper also examines gains from generated training data and extensions to multimodal '
          'models.</p>',
  'paper': 'Junhao_raoof',
  'after': '<h2>Data and training dynamics</h2><p>At Imperial College London, I investigated data pruning '
           'and input-space geometry across model architectures. In separate work, we study <a '
           'class="text-link" href="sgd-robustness.html">when SGD reduces reliance on spurious '
           'correlations</a> and how a short small-batch warmup can improve worst-group accuracy.</p>',
  'insight': '<section class="paper-insight" aria-labelledby="distillation-method"><h2 '
             'id="distillation-method">What passes from teacher to student</h2><dl '
             'class="method-facts"><div><dt>Training inputs</dt><dd>Inverse adversarial examples, obtained '
             'by reversing adversarial perturbations.</dd></div><div><dt>Model alignment</dt><dd>Match '
             'input-gradient information between the robust teacher and the smaller '
             'student.</dd></div><div><dt>Weight perturbations</dt><dd>Jointly perturb both models to find '
             'directions that improve robustness transfer.</dd></div></dl></section>'},
 {'slug': 'scientific-learning',
  'category': 'Scientific machine learning',
  'title': 'CuPINN: learning smoother residuals',
  'lead': 'Improving physics-informed neural networks by controlling the curvature of the equation residual.',
  'role': 'With Mostafa Abbaszadeh and Mehdi Dehghan',
  'setting': 'Computer Methods in Applied Mechanics and Engineering · 2025',
  'body': '<h2>Controlling the residual’s curvature</h2><p>Physics-informed neural networks learn solutions '
          'to differential equations by penalizing violations of those equations. In this work, we also '
          'penalize the curvature of that residual across the input domain. CuPINN and its variants '
          'encourage a flatter residual surface. We also combine this approach with gradient-enhanced '
          'PINNs.</p><h2>Results</h2><p>Across seven PDE benchmarks, including linear and nonlinear '
          'problems, the methods improve solution accuracy and residual error over the tested PINN and GPINN '
          'baselines. The experiments also show benefits when relatively few training points are '
          'available.</p><h2>Current work at EPFL</h2><p>As an E3 research intern with Prof. Olga Fink, I am '
          'working on graph neural networks to predict how fluid systems behave over long periods. The goal '
          'is to incorporate physical knowledge into these models to reduce computational cost compared with '
          'traditional simulations.</p>',
  'paper': 'raoofzareCU',
  'after': '',
  'insight': '<section class="paper-insight" aria-labelledby="cupinn-method"><h2 id="cupinn-method">What '
             'CuPINN adds to training</h2><dl class="method-facts"><div><dt>Equation '
             'residual</dt><dd>Penalize violations of the differential equation.</dd></div><div><dt>Residual '
             'curvature</dt><dd>Also discourage sharp changes in the residual across the input '
             'domain.</dd></div><div><dt>Computation</dt><dd>Use trace estimation and finite differences '
             'without constructing the full Hessian.</dd></div></dl><p class="insight-note">The curvature is '
             'measured with respect to the inputs, not the model parameters.</p></section>'},
 {'slug': 'private-sampling',
  'category': 'Differential privacy',
  'title': 'Private Gaussian sampling',
  'lead': 'How much data is needed to privately generate several samples from an unknown Gaussian '
          'distribution?',
  'paper': 'raoof_private_sampling',
  'body': '<h2>A guarantee for the whole batch</h2><p>We study this question without imposing bounds on the '
          'mean or positive definite covariance. The guarantee concerns the whole batch: its joint '
          'distribution must be close to that of independent Gaussian draws, even though the released '
          'samples may be dependent.</p><p>Under approximate differential privacy, we determine the required '
          'input size up to logarithmic factors for any fixed error level between zero and one. Our '
          'algorithm and matching lower bound show when generating a batch from shared data is more '
          'efficient than running separate private samplers.</p>',
  'after': '',
  'insight': '<section class="paper-insight" aria-labelledby="sampling-result"><h2 '
             'id="sampling-result">Optimal input size, up to logarithmic factors</h2><div '
             'class="equation-scroll"><math display="block" aria-label="n equals soft Theta sub alpha of m '
             'plus the minimum of d square root m over epsilon plus delta, and m over '
             'delta"><mrow><mi>n</mi><mo>=</mo><msub><mover><mi>Θ</mi><mo>~</mo></mover><mi>α</mi></msub><mo>(</mo><mi>m</mi><mo>+</mo><mi '
             'mathvariant="normal">min</mi><mo>{</mo><mfrac><mrow><mi>d</mi><msqrt><mi>m</mi></msqrt></mrow><mrow><mi>ε</mi><mo>+</mo><mi>δ</mi></mrow></mfrac><mo>,</mo><mfrac><mi>m</mi><mi>δ</mi></mfrac><mo>}</mo><mo>)</mo></mrow></math></div><p '
             'class="insight-note"><i>n</i> input records, dimension <i>d</i>, and batch size <i>m</i>. For '
             'fixed 0 &lt; α &lt; 1, 0 ≤ ε ≤ 1, and 0 &lt; δ &lt; 1. Here α is the total-variation error '
             'tolerance. The hidden constants may depend on α.</p><p class="result-takeaway">Accuracy is '
             'measured for the whole batch against <i>m</i> independent Gaussian draws.</p></section>'},
 {'slug': 'private-covariance',
  'category': 'Differential privacy',
  'title': 'Private covariance estimation across separate data holders',
  'lead': 'Estimating how features vary together when no single party sees a complete record.',
  'paper': 'raoof_private_splt',
  'body': '<h2>Different features, matched observations</h2><p>We study covariance estimation when two '
          'parties hold different features of the same observations. Neither party sees complete records, '
          'making relationships between their features difficult to estimate. We design separate releases '
          'satisfying pure differential privacy that allow an analyst to estimate the full covariance matrix '
          'without interaction between the parties.</p><p>For mean-zero sub-Gaussian data, we prove matching '
          'upper and lower error bounds up to logarithmic factors among noninteractive protocols. The bounds '
          'identify each party’s privacy cost and remain sharp when the parties hold very different numbers '
          'of features or use different privacy budgets.</p>',
  'after': '',
  'insight': '<section class="paper-insight" aria-labelledby="covariance-difficulty"><h2 '
             'id="covariance-difficulty">The information neither party observes alone</h2><div '
             'class="covariance-blocks" role="group" aria-label="Blocks of the full covariance '
             'matrix"><div><strong>Σ<sub>XX</sub></strong><span>Features held by X</span></div><div '
             'class="cross-block"><strong>Σ<sub>XY</sub></strong><span>Cross-party '
             'covariance</span></div><div '
             'class="cross-block"><strong>Σ<sub>YX</sub></strong><span>Cross-party '
             'covariance</span></div><div><strong>Σ<sub>YY</sub></strong><span>Features held by '
             'Y</span></div></div><p class="insight-note">Both parties hold the same matched records, split '
             'by features. Neither can form the matched cross-products alone. An analyst estimates all four '
             'blocks from their separate pure-DP releases.</p></section>'},
 {'slug': 'sgd-robustness',
  'category': 'Robust machine learning',
  'title': 'When SGD reduces reliance on spurious correlations',
  'lead': 'Understanding the early training dynamics behind SGD’s robustness benefits.',
  'paper': 'raoof_spurious',
  'body': '<h2>Robustness early in training</h2><p>We study when stochastic gradient descent helps models '
          'avoid shortcuts that work during training but fail when the data change. Our finite-time analysis '
          'shows that, under the conditions we study, SGD’s implicit regularization is strongest early in '
          'training and then weakens. Its strength depends on the learning-rate-to-batch-size '
          'ratio.</p><h2>Small-batch warmup</h2><p>This motivates small-batch warmup: begin training with '
          'small batches, then switch to larger ones. Across several benchmarks and architectures, this '
          'improves worst-group accuracy, often recovering much of the robustness of full small-batch '
          'training while retaining most of the efficiency of large-batch training.</p>',
  'after': '',
  'insight': '<section class="paper-insight" aria-labelledby="warmup-schedule"><h2 '
             'id="warmup-schedule">Small-batch warmup</h2><ol class="training-schedule"><li><span '
             'class="phase-label">Early training</span><strong>Use small batches</strong><p>At a fixed '
             'learning rate, smaller batches increase the learning-rate-to-batch-size '
             'ratio.</p></li><li><span class="phase-label">After warmup</span><strong>Switch to larger '
             'batches</strong><p>Continue with standard large-batch optimization to retain its computational '
             'efficiency.</p></li></ol><p class="insight-note">The schedule targets the early period when '
             'implicit regularization is strongest in the paper’s analysis.</p></section>'}]
for project in projects:
    page=head(project['title']+' | '+NAME,project['lead'],'../','research/'+project['slug']+'.html')
    page+=f'''<main id="main" class="wrap"><header class="project-hero"><a class="back" href="../publications.html">Back to publications</a><p class="eyebrow">{project['category']}</p><h1>{project['title']}</h1><p class="lead">{project['lead']}</p></header><div class="project-body">'''
    if project.get('setting'):
        page+=f'''<div class="project-context"><p>{project['setting']}</p><p>{project['role']}</p></div>'''
    body=project['body']
    insight=project.get('insight','')
    if '<h2>Results</h2>' in body:
        body=body.replace('<h2>Results</h2>',insight+'<h2>Results</h2>',1)
    else:
        body+=insight
    page+=f'<article class="project-copy">{body}'
    page+=project['after']+'<h2>Related paper</h2>'+publication(next(p for p in PAPERS if p['id']==project['paper']),'../',include_project=False)+'</article></div></main>'+footer('../')
    (ROOT/'research'/f'{project["slug"]}.html').write_text(page)

cv=head('Curriculum Vitae | '+NAME,'Education, research experience, publications, teaching, and honors.','', 'cv.html')
cv+=f'''<main id="main" class="wrap"><article class="cv"><div class="cv-top"><div><h1>{NAME}</h1><p class="cv-sub">Privacy · Robustness · Machine unlearning</p><p><a href="mailto:{EMAIL}">{EMAIL}</a> · <a href="{GITHUB}">GitHub</a></p></div><button class="pill" data-print>Print / save PDF</button></div><h2>Education</h2><h3>Sharif University of Technology <span class="cv-dates">2024 – present</span></h3><p>M.Sc. in Computer Science · GPA: 19.7/20 · Ranked 1st in class (ongoing).</p><p>Thesis: Minimax-Optimal Private Multi-Sampling from Gaussian Distributions.</p><h3>Amirkabir University of Technology <span class="cv-dates">2019 – 2023</span></h3><p>B.Sc. in Mathematics · GPA: 18.99/20 · Ranked 2nd in graduating class.</p><h3>Amirkabir University of Technology <span class="cv-dates">2018 – 2023</span></h3><p>B.Sc. in Computer Science · GPA: 18.82/20 · Ranked 3rd in graduating class.</p><p>Thesis: A Survey on Differentially Private Algorithms.</p><h2>Research experience</h2>'''
for date,school,role,supervisor,description in positions:
    cv+=f'<h3>{school}<span class="cv-dates">{date}</span></h3><p>{role} · <span class="supervisor">{supervisor}</span></p><p>{description}</p>'
cv+='<h2>Publications</h2>'+''.join(publication(p) for p in PAPERS if p['type']=='article')
cv+='<h2>Preprints and manuscripts</h2>'+''.join(publication(p) for p in PAPERS if p['type']!='article')
cv+='''<p>* Equal contribution.</p><h2>Honors &amp; funding</h2><ul><li>EPFL Excellence in Engineering (E3) Fellowship, 2026.</li><li>Funded visiting research student position at NTU, 2025.</li><li>Ranked 9th among 5,000 candidates in Iran’s National M.Sc. Computer Science Entrance Exam, 2024.</li></ul><h2>Teaching</h2><p><strong>Graduate courses:</strong> Learning Theory (Fall 2025), Information Theory (Fall 2024), Trustworthy Machine Learning (Fall 2024), Scientific Deep Learning (Fall 2024), Measure Theory and Probability (Fall 2022), Machine Learning (Fall 2022).</p><p><strong>Undergraduate courses:</strong> Real Analysis (Spring 2023), Applied Linear Algebra (Fall 2022), Stochastic Process (Spring 2022), Computational Theory (Fall 2021).</p><h2>Relevant coursework</h2><p><strong>Graduate courses (grades out of 20):</strong> Learning Theory (20), Information Theory (20), Advanced Statistics (20), Advanced Algorithms (18.2), Bandit Learning (20), Generative Models (20), Functional Analysis (17), Measure Theory and Probability (20).</p><p><strong>Graduate-level audited courses:</strong> High-Dimensional Statistics, Convex Optimization.</p><h2>Languages</h2><p>Persian: Native · English: TOEFL iBT 101.</p></article></main>'''+footer()
(ROOT/'cv.html').write_text(cv)
(ROOT/'papers.bib').write_text('\n\n'.join(bibtex(p) for p in PAPERS)+'\n')
(ROOT/'404.html').write_text(head('Page not found | '+NAME,'This page could not be found.')+'<main id="main" class="wrap"><section class="project-hero"><p class="eyebrow">404</p><h1>Page not found.</h1><p>The page may have moved. <a class="text-link" href="https://raoofmoayedi.github.io/">Return to the homepage</a>.</p></section></main>'+footer())
print(f'Built homepage, publications, {len(projects)} research pages, CV, bibliography and 404 page.')
