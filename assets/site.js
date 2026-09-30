(() => {
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const theme=$('.theme-button');
 function themeLabel(){theme.setAttribute('aria-label',`Switch to ${document.documentElement.dataset.theme==='light'?'dark':'light'} theme`)}
 themeLabel();theme.addEventListener('click',()=>{let t=document.documentElement.dataset.theme==='light'?'dark':'light';document.documentElement.dataset.theme=t;try{localStorage.setItem('theme',t)}catch{}themeLabel()});
 const menu=$('.menu-button');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);$('#navigation').classList.toggle('open',open)});
 $$('#navigation a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');$('#navigation').classList.remove('open')}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');$('#navigation').classList.remove('open')}});
 const progress=()=>{$('.progress').style.width=`${100*scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)}%`};addEventListener('scroll',progress,{passive:true});progress();
 if(!reduced.matches&&'IntersectionObserver'in window){document.documentElement.classList.add('js-motion');const ob=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');ob.unobserve(e.target)}}),{threshold:.08});$$('.reveal').forEach(el=>ob.observe(el))}
 let toastTimer;function toast(t){const el=$('.toast');el.textContent=t;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),2800)}
 async function copy(text){try{await navigator.clipboard.writeText(text);toast('Copied to clipboard')}catch{toast('Copy unavailable. Select and copy the text directly.')}}
 $$('[data-copy]').forEach(b=>b.addEventListener('click',()=>copy(b.dataset.copy)));
 $$('.copy-citation').forEach(b=>b.addEventListener('click',()=>copy(b.parentElement.querySelector('pre').textContent)));
 $$('[data-print]').forEach(b=>b.addEventListener('click',()=>window.print()));
 const search=$('#paper-search');let selected='all';
 function filter(){const q=search.value.trim().toLowerCase();let n=0;$$('.library-paper').forEach(p=>{p.hidden=!((selected==='all'||p.dataset.topic===selected)&&p.textContent.toLowerCase().includes(q));if(!p.hidden)n++});$('#result-count').textContent=`${n} publication${n===1?'':'s'}`;$('#empty-state').hidden=n!==0}
 if(search){search.addEventListener('input',filter);$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.filter;$$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',x===b));filter()}));$('#reset-search').addEventListener('click',()=>{search.value='';$('[data-filter="all"]').click();search.focus()})}
 const interestButtons=$$('[data-landscape]');
 function selectInterest(button){
   interestButtons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
   $('#art-description').textContent=button.dataset.description;
   $('#interest-count').textContent=`${String(interestButtons.indexOf(button)+1).padStart(2,'0')} / ${String(interestButtons.length).padStart(2,'0')}`;
   $('.sketch-panel').dataset.interest=button.dataset.landscape;
   $$('[data-sketch]').forEach(img=>{img.hidden=img.dataset.sketch!==button.dataset.landscape});
 }
 interestButtons.forEach((button,index)=>{
   button.addEventListener('click',()=>selectInterest(button));
   button.addEventListener('keydown',event=>{
     let next;
     if(event.key==='ArrowRight')next=(index+1)%interestButtons.length;
     if(event.key==='ArrowLeft')next=(index-1+interestButtons.length)%interestButtons.length;
     if(event.key==='Home')next=0;
     if(event.key==='End')next=interestButtons.length-1;
     if(next===undefined)return;
     event.preventDefault();interestButtons[next].focus();selectInterest(interestButtons[next]);
   });
 });
})();
