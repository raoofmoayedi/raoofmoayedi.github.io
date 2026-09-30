(() => {
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const theme=$('.theme-button'),appearance=$('.appearance-picker'),paletteButtons=$$('button[data-palette]');
 function syncAppearance(){
   const next=document.documentElement.dataset.theme==='light'?'dark':'light';
   theme.setAttribute('aria-label',`Switch to ${next} theme`);
   theme.querySelector('[data-theme-label]').textContent=`Switch to ${next} mode`;
   paletteButtons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.palette===(document.documentElement.dataset.palette||'midnight'))));
   const meta=$('meta[name="theme-color"]');
   if(meta)meta.content=getComputedStyle(document.documentElement).getPropertyValue('--paper').trim();
 }
 syncAppearance();
 theme.addEventListener('click',()=>{
   const t=document.documentElement.dataset.theme==='light'?'dark':'light';
   document.documentElement.dataset.theme=t;
   try{localStorage.setItem('theme',t)}catch{}
   syncAppearance();
 });
 paletteButtons.forEach(button=>button.addEventListener('click',()=>{
   document.documentElement.dataset.palette=button.dataset.palette;
   try{localStorage.setItem('palette',button.dataset.palette)}catch{}
   syncAppearance();
 }));
 document.addEventListener('click',event=>{if(appearance.open&&!appearance.contains(event.target))appearance.open=false});
 document.addEventListener('keydown',event=>{
   if(event.key==='Escape'&&appearance.open){appearance.open=false;appearance.querySelector('summary').focus()}
 });
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
 if(interestButtons.length){
   const stage=$('.interest-stage');
   let current=0;
   function selectInterest(index){
     current=(index+interestButtons.length)%interestButtons.length;
     const button=interestButtons[current];
     interestButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===current)));
     $('#interest-title').textContent=button.dataset.label;
     $('#art-description').textContent=button.dataset.description;
     $('#interest-count').textContent=`${String(current+1).padStart(2,'0')} / ${String(interestButtons.length).padStart(2,'0')}`;
     $('#interests').dataset.interest=button.dataset.landscape;
     $$('[data-sketch]').forEach(img=>{img.hidden=img.dataset.sketch!==button.dataset.landscape});
     $('#interest-status').textContent=`${button.dataset.label}, ${current+1} of ${interestButtons.length}. ${button.dataset.description}`;
   }
   interestButtons.forEach((button,index)=>{
     button.addEventListener('click',()=>selectInterest(index));
     button.addEventListener('keydown',event=>{
       if(event.altKey||event.ctrlKey||event.metaKey)return;
       let next;
       if(event.key==='ArrowRight')next=(index+1)%interestButtons.length;
       if(event.key==='ArrowLeft')next=(index-1+interestButtons.length)%interestButtons.length;
       if(event.key==='Home')next=0;
       if(event.key==='End')next=interestButtons.length-1;
       if(next===undefined)return;
       event.preventDefault();interestButtons[next].focus();selectInterest(next);
     });
   });
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
 // A quiet mouse companion: time-based easing, stable hover, and an idle fade.
 const pointerButton=$('.pointer-option');
 const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
 let playful=true;
 try{playful=localStorage.getItem('playful-pointer')!=='off'}catch{}
 let companion,core,frame=0,idleTimer=0,lastFrame=0,tracking=false,lastMouse=null,pressAnimation;
 const target={x:0,y:0},point={x:0,y:0};
 const editable='input,textarea,select,[contenteditable="true"],[role="textbox"],pre,code';
 const pointerAllowed=()=>finePointer.matches&&!reduced.matches&&playful;
 function hidePointer(){
   tracking=false;lastFrame=0;
   clearTimeout(idleTimer);
   if(frame){cancelAnimationFrame(frame);frame=0}
   companion?.classList.remove('is-visible');
 }
 function syncPointer(){
   pointerButton.hidden=!finePointer.matches||reduced.matches;
   pointerButton.setAttribute('aria-pressed',String(playful));
   pointerButton.querySelector('[data-pointer-state]').textContent=playful?'On':'Off';
   if(!pointerAllowed()){hidePointer();pressAnimation?.cancel()}
 }
 function drawPointer(now){
   frame=0;if(!tracking||!pointerAllowed())return;
   const dt=lastFrame?Math.min(now-lastFrame,40):16.67;
   lastFrame=now;
   // The same response at 60 Hz and 120 Hz, without velocity-driven tilting.
   const ease=1-Math.exp(-dt/65);
   point.x+=(target.x-point.x)*ease;point.y+=(target.y-point.y)*ease;
   const settled=Math.hypot(target.x-point.x,target.y-point.y)<.15;
   if(settled){point.x=target.x;point.y=target.y}
   companion.style.transform=`translate3d(${point.x}px,${point.y}px,0)`;
   if(!settled)frame=requestAnimationFrame(drawPointer);else lastFrame=0;
 }
 pointerButton.addEventListener('click',()=>{
   playful=!playful;try{localStorage.setItem('playful-pointer',playful?'on':'off')}catch{}
   syncPointer();
 });
 finePointer.addEventListener('change',syncPointer);reduced.addEventListener('change',syncPointer);syncPointer();
 document.addEventListener('pointermove',event=>{
   if(event.pointerType!=='mouse'||!pointerAllowed()||event.target.closest(editable)){hidePointer();return}
   // Ignore stationary events and sub-pixel input jitter; neither should prevent the idle fade.
   if(lastMouse&&Math.hypot(event.clientX-lastMouse.x,event.clientY-lastMouse.y)<1)return;
   lastMouse={x:event.clientX,y:event.clientY};
   if(!companion){
     companion=document.createElement('div');companion.className='pointer-companion';companion.setAttribute('aria-hidden','true');
     companion.innerHTML='<span class="pointer-halo"></span><span class="pointer-core"><span class="pointer-eyes"></span><span class="pointer-smile"></span></span>';
     document.body.append(companion);core=companion.querySelector('.pointer-core');
   }
   target.x=Math.max(10,Math.min(innerWidth-32,event.clientX+20));
   target.y=Math.max(10,Math.min(innerHeight-32,event.clientY+22));
   if(!tracking){point.x=target.x;point.y=target.y;tracking=true;companion.style.transform=`translate3d(${point.x}px,${point.y}px,0)`}
   const interactive=String(!!event.target.closest('a,button,summary,[role="button"],label'));
   if(companion.dataset.interactive!==interactive)companion.dataset.interactive=interactive;
   companion.classList.add('is-visible');
   clearTimeout(idleTimer);idleTimer=setTimeout(hidePointer,750);
   if(!frame)frame=requestAnimationFrame(drawPointer);
 },{passive:true});
 document.addEventListener('pointerdown',event=>{
   if(event.pointerType!=='mouse'||event.button!==0||!pointerAllowed()||!tracking||event.target.closest(editable))return;
   pressAnimation?.cancel();
   pressAnimation=core.animate([{transform:'scale(1)'},{transform:'scale(.86)',offset:.3},{transform:'scale(1)'}],{duration:260,easing:'ease-out'});
 },{passive:true});
 document.addEventListener('pointerout',event=>{if(!event.relatedTarget)hidePointer()});
 document.addEventListener('keydown',hidePointer);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hidePointer()});
 addEventListener('scroll',hidePointer,{passive:true});
 addEventListener('blur',hidePointer);
})();
