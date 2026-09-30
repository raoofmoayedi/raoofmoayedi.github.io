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
 const interestSelect=$('#interest-select');
 if(interestSelect){
   const options=[...interestSelect.options],stage=$('.interest-stage');
   let current=interestSelect.selectedIndex;
   function selectInterest(index){
     current=(index+options.length)%options.length;
     interestSelect.selectedIndex=current;
     const option=options[current];
     $('#art-description').textContent=option.dataset.description;
     $('#interest-count').textContent=`${String(current+1).padStart(2,'0')} / ${String(options.length).padStart(2,'0')}`;
     $('#interests').dataset.interest=option.value;
     $$('[data-sketch]').forEach(img=>{img.hidden=img.dataset.sketch!==option.value});
     $('#interest-status').textContent=`${option.textContent}, ${current+1} of ${options.length}. ${option.dataset.description}`;
   }
   interestSelect.addEventListener('change',()=>selectInterest(interestSelect.selectedIndex));
   $$('[data-interest-step]').forEach(button=>button.addEventListener('click',()=>selectInterest(current+Number(button.dataset.interestStep))));
   // Touch gestures leave vertical page scrolling to the browser.
   let touchStart;
   stage.addEventListener('touchstart',event=>{
     if(event.touches.length!==1||event.target.closest('button')){touchStart=null;return}
     const touch=event.touches[0];touchStart={x:touch.clientX,y:touch.clientY};
   },{passive:true});
   stage.addEventListener('touchend',event=>{
     if(!touchStart||!event.changedTouches.length)return;
     const touch=event.changedTouches[0],dx=touch.clientX-touchStart.x,dy=touch.clientY-touchStart.y;
     touchStart=null;
     if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)selectInterest(current+(dx<0?1:-1));
   },{passive:true});
   stage.addEventListener('touchcancel',()=>{touchStart=null},{passive:true});
 }
})();
