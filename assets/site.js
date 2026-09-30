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
 // A small decorative companion follows mouse input; all normal cursors remain intact.
 const pointerButton=$('.pointer-option');
 const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
 let playful=true;
 try{playful=localStorage.getItem('playful-pointer')!=='off'}catch{}
 let companion,frame=0,tracking=false;
 const target={x:0,y:0},point={x:0,y:0};
 const sparks=new Set();
 const editable='input,textarea,select,[contenteditable="true"],[role="textbox"],pre,code';
 const pointerAllowed=()=>finePointer.matches&&!reduced.matches&&playful;
 function hidePointer(){
   tracking=false;
   if(frame){cancelAnimationFrame(frame);frame=0}
   if(companion)companion.classList.remove('is-visible');
 }
 function syncPointer(){
   pointerButton.hidden=!finePointer.matches||reduced.matches;
   pointerButton.setAttribute('aria-pressed',String(playful));
   pointerButton.querySelector('[data-pointer-state]').textContent=playful?'On':'Off';
   if(!pointerAllowed()){hidePointer();sparks.forEach(s=>s.remove());sparks.clear()}
 }
 function drawPointer(){
   frame=0;if(!tracking||!pointerAllowed())return;
   point.x+=(target.x-point.x)*.28;point.y+=(target.y-point.y)*.28;
   const tilt=Math.max(-12,Math.min(12,(target.x-point.x)*.2));
   companion.style.transform=`translate3d(${point.x}px,${point.y}px,0) rotate(${tilt}deg)`;
   if(Math.abs(target.x-point.x)+Math.abs(target.y-point.y)>.3)frame=requestAnimationFrame(drawPointer);
 }
 pointerButton.addEventListener('click',()=>{
   playful=!playful;try{localStorage.setItem('playful-pointer',playful?'on':'off')}catch{}
   syncPointer();
 });
 finePointer.addEventListener('change',syncPointer);reduced.addEventListener('change',syncPointer);syncPointer();
 document.addEventListener('pointermove',event=>{
   if(event.pointerType!=='mouse'||!pointerAllowed()||event.target.closest(editable)){hidePointer();return}
   if(!companion){
     companion=document.createElement('div');companion.className='pointer-companion';companion.setAttribute('aria-hidden','true');
     companion.innerHTML='<span class="pointer-orbit"></span><span class="pointer-eyes"></span>';document.body.append(companion);
   }
   target.x=Math.min(innerWidth-30,event.clientX+19);target.y=Math.min(innerHeight-30,event.clientY+19);
   if(!tracking){point.x=target.x;point.y=target.y;tracking=true}
   companion.dataset.interactive=String(!!event.target.closest('a,button,summary,[role="button"],label'));
   companion.classList.add('is-visible');
   if(!frame)frame=requestAnimationFrame(drawPointer);
 },{passive:true});
 document.addEventListener('pointerdown',event=>{
   if(event.pointerType!=='mouse'||event.button!==0||!pointerAllowed()||event.target.closest(editable))return;
   if(sparks.size>16)return;
   for(let i=0;i<4;i++){
     const spark=document.createElement('span');spark.className='pointer-spark';spark.setAttribute('aria-hidden','true');
     const angle=Math.PI/2*i+.35,dx=Math.cos(angle)*22,dy=Math.sin(angle)*22;
     const x=event.clientX+17,y=event.clientY+17;
     document.body.append(spark);sparks.add(spark);
     const animation=spark.animate([{transform:`translate(${x}px,${y}px) scale(.5)`,opacity:.8},{transform:`translate(${x+dx}px,${y+dy}px) rotate(55deg) scale(0)`,opacity:0}],{duration:360,easing:'ease-out'});
     animation.onfinish=()=>{spark.remove();sparks.delete(spark)};
   }
 },{passive:true});
 document.addEventListener('pointerout',event=>{if(!event.relatedTarget)hidePointer()});
 document.addEventListener('keydown',hidePointer);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)hidePointer()});
 addEventListener('blur',hidePointer);
})();
