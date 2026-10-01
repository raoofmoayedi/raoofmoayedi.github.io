(() => {
 const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const theme=$('.theme-button'),appearance=$('.appearance-picker');
 function syncAppearance(){
   const next=document.documentElement.dataset.theme==='light'?'dark':'light';
   theme.setAttribute('aria-label',`Switch to ${next} theme`);
   theme.querySelector('[data-theme-label]').textContent=`Switch to ${next} mode`;
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
 document.addEventListener('click',event=>{if(appearance.open&&!appearance.contains(event.target))appearance.open=false});
 document.addEventListener('keydown',event=>{
   if(event.key==='Escape'&&appearance.open){appearance.open=false;appearance.querySelector('summary').focus()}
 });
 const menu=$('.menu-button'),navigation=$('#navigation'),header=$('.header');
 function closeNavigation(){menu.setAttribute('aria-expanded','false');navigation.classList.remove('open')}
 menu.addEventListener('click',()=>{
   const open=menu.getAttribute('aria-expanded')!=='true';
   if(open)appearance.open=false;
   menu.setAttribute('aria-expanded',String(open));navigation.classList.toggle('open',open);
 });
 appearance.addEventListener('toggle',()=>{if(appearance.open)closeNavigation()});
 $$('#navigation a').forEach(a=>a.addEventListener('click',closeNavigation));
 document.addEventListener('click',event=>{if(!navigation.contains(event.target)&&!menu.contains(event.target))closeNavigation()});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeNavigation();menu.focus()}});
 const updateHeaderSize=()=>document.documentElement.style.setProperty('--header-height',`${Math.ceil(header.getBoundingClientRect().height)}px`);
 updateHeaderSize();
 if('ResizeObserver'in window)new ResizeObserver(updateHeaderSize).observe(header);
 else addEventListener('resize',updateHeaderSize,{passive:true});
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
 const covarianceButtons=$$('[data-covariance-block]');
 covarianceButtons.forEach(button=>button.addEventListener('click',()=>{
   covarianceButtons.forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
   const panel=$('#covariance-explanation');
   panel.querySelector('.covariance-category').textContent=button.dataset.category;
   panel.querySelector('h3').textContent=button.dataset.title;
   panel.querySelector('.covariance-copy').textContent=button.dataset.description;
 }));
 // Research interests advance automatically while the gallery is visible.
 const interestButtons=$$('[data-landscape]');
 if(interestButtons.length){
   const stage=$('.interest-stage'),gallery=$('#interests');
   const rotationDelay=3000;
   let current=0,rotationTimer=0,inView=false;
   function queueInterestRotation(){
     clearTimeout(rotationTimer);rotationTimer=0;
     const running=inView&&!document.hidden;
     gallery.dataset.rotating=String(running);
     if(running)rotationTimer=setTimeout(()=>selectInterest(current+1,false),rotationDelay);
   }
   function selectInterest(index,announce=true){
     current=(index+interestButtons.length)%interestButtons.length;
     const button=interestButtons[current];
     interestButtons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===current)));
     $('#interest-title').textContent=button.dataset.label;
     $('#art-description').textContent=button.dataset.description;
     $('#interest-count').textContent=`${String(current+1).padStart(2,'0')} / ${String(interestButtons.length).padStart(2,'0')}`;
     gallery.dataset.interest=button.dataset.landscape;
     $$('[data-sketch]').forEach(img=>{img.hidden=img.dataset.sketch!==button.dataset.landscape});
     // Automatic changes stay quiet for screen readers; manual choices are announced.
     $('#interest-status').textContent=announce?`${button.dataset.label}, ${current+1} of ${interestButtons.length}. ${button.dataset.description}`:'';
     queueInterestRotation();
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
   document.addEventListener('visibilitychange',queueInterestRotation);
   if('IntersectionObserver'in window){
     new IntersectionObserver(entries=>{
       const entry=entries[0];inView=entry.isIntersecting&&entry.intersectionRatio>=.35;queueInterestRotation();
     },{threshold:[0,.35]}).observe(gallery);
   }else{inView=true}
   queueInterestRotation();
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
 // Sketches unfold within the paper being explored; there is no separate control.
 const paperCards=$$('.paper-card');
 const sketchHover=matchMedia('(hover: hover) and (pointer: fine)');
 const paperTimers=new Map();
 function setPaperSketch(card,open){
   clearTimeout(paperTimers.get(card));
   card.dataset.sketchOpen=String(open);
   card.querySelector('.paper-art-reveal').setAttribute('aria-hidden',String(!open));
 }
 function closePaperSketches(){paperCards.forEach(card=>setPaperSketch(card,false))}
 function revealPaperSketch(card){
   if(sketchHover.matches)paperCards.forEach(other=>{if(other!==card)setPaperSketch(other,false)});
   setPaperSketch(card,true);
 }
 paperCards.forEach(card=>{
   card.addEventListener('pointerenter',event=>{
     if(event.pointerType!=='mouse'||!sketchHover.matches)return;
     clearTimeout(paperTimers.get(card));
     paperTimers.set(card,setTimeout(()=>revealPaperSketch(card),90));
   });
   card.addEventListener('pointerleave',()=>{
     clearTimeout(paperTimers.get(card));
     if(sketchHover.matches&&!card.contains(document.activeElement))paperTimers.set(card,setTimeout(()=>setPaperSketch(card,false),160));
   });
   card.addEventListener('focusin',()=>revealPaperSketch(card));
   card.addEventListener('focusout',event=>{
     if(!card.contains(event.relatedTarget)&&sketchHover.matches&&!card.matches(':hover'))setPaperSketch(card,false);
   });
 });
 // Touch visitors see each sketch as they reach its card. Revealing once avoids
 // repeatedly opening and closing cards while someone is scrolling past them.
 let paperObserver;
 function observeTouchPapers(){
   paperObserver?.disconnect();
   if(sketchHover.matches)return;
   if(!('IntersectionObserver'in window)){paperCards.forEach(revealPaperSketch);return}
   paperObserver=new IntersectionObserver(entries=>{
     entries.forEach(entry=>{
       if(entry.isIntersecting){revealPaperSketch(entry.target);paperObserver.unobserve(entry.target)}
     });
   },{rootMargin:'0px 0px -18% 0px',threshold:.2});
   paperCards.forEach(card=>paperObserver.observe(card));
 }
 observeTouchPapers();
 document.addEventListener('keydown',event=>{if(event.key==='Escape')closePaperSketches()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&sketchHover.matches)closePaperSketches()});
 sketchHover.addEventListener('change',()=>{closePaperSketches();observeTouchPapers()});
 // Mouse capability stays established across focus and visibility changes.
 const pointerButton=$('.pointer-option');
 const finePointer=matchMedia('(any-hover: hover) and (any-pointer: fine)');
 let mouseDetected=finePointer.matches;
 // Always start disabled, including for visitors with an older saved On setting.
 let playful=false;
 try{localStorage.removeItem('playful-pointer')}catch{}
 let companion,core,eyes,frame=0,idleTimer=0,lastFrame=0,tracking=false,lastMouse=null,pressAnimation,blinkAnimation;
 let positioned=false,resumeOnFocus=false;
 const target={x:0,y:0},point={x:0,y:0};
 const editable='input,textarea,select,[contenteditable="true"],[role="textbox"]';
 const pointerAllowed=()=>mouseDetected&&playful&&!document.hidden;
 function hidePointer(){
   tracking=false;lastFrame=0;
   clearTimeout(idleTimer);
   if(frame){cancelAnimationFrame(frame);frame=0}
   companion?.classList.remove('is-visible','is-moving');
 }
 function syncPointer(){
   // The control is always available, even if the browser temporarily reports no mouse.
   pointerButton.hidden=false;
   pointerButton.setAttribute('aria-pressed',String(playful));
   pointerButton.querySelector('[data-pointer-state]').textContent=playful?'On':'Off';
   if(!pointerAllowed()){if(document.hidden)suspendPointer();else hidePointer()}
   if(!pointerAllowed()||reduced.matches){pressAnimation?.cancel();blinkAnimation?.cancel()}
 }
 function drawPointer(now){
   frame=0;if(!tracking||!pointerAllowed())return;
   const dt=lastFrame?Math.min(now-lastFrame,40):16.67;
   lastFrame=now;
   // The same response at 60 Hz and 120 Hz, without velocity-driven tilting.
   const ease=reduced.matches?1:1-Math.exp(-dt/100);
   point.x+=(target.x-point.x)*ease;point.y+=(target.y-point.y)*ease;
   const settled=Math.hypot(target.x-point.x,target.y-point.y)<.15;
   if(settled){point.x=target.x;point.y=target.y}
   companion.style.transform=`translate3d(${point.x}px,${point.y}px,0)`;
   companion.style.setProperty('--look-x',`${Math.max(-.9,Math.min(.9,(target.x-point.x)/28))}px`);
   companion.style.setProperty('--look-y',`${Math.max(-.7,Math.min(.7,(target.y-point.y)/28))}px`);
   if(!settled)frame=requestAnimationFrame(drawPointer);else lastFrame=0;
 }
 pointerButton.addEventListener('click',event=>{
   playful=!playful;
   syncPointer();
   if(playful)showPointer(event);
 });
 finePointer.addEventListener('change',()=>{mouseDetected=mouseDetected||finePointer.matches;syncPointer()});reduced.addEventListener('change',syncPointer);syncPointer();
 function showPointer(event){
   const mouseInput=event.pointerType==='mouse'||(!event.pointerType&&event.type==='click'&&event.detail>0);
   if(!mouseInput){if(event.pointerType==='touch')hidePointer();return}
   // An actual mouse event is more reliable than media queries on hybrid devices.
   if(!mouseDetected){mouseDetected=true;syncPointer()}
   if(!pointerAllowed()||event.target.closest(editable)){hidePointer();return}
   // Ignore input jitter once the companion is visible.
   if(tracking&&event.type==='pointermove'&&lastMouse&&Math.hypot(event.clientX-lastMouse.x,event.clientY-lastMouse.y)<1)return;
   lastMouse={x:event.clientX,y:event.clientY};
   if(!companion){
     companion=document.createElement('div');companion.className='pointer-companion';companion.setAttribute('aria-hidden','true');
     companion.innerHTML='<span class="pointer-halo"></span><span class="pointer-satellite"></span><span class="pointer-core"><span class="pointer-face"><span class="pointer-eyes"></span><span class="pointer-smile"></span></span></span>';
     document.body.append(companion);core=companion.querySelector('.pointer-core');eyes=companion.querySelector('.pointer-eyes');
   }
   target.x=Math.max(10,Math.min(innerWidth-32,event.clientX+20));
   target.y=Math.max(10,Math.min(innerHeight-32,event.clientY+22));
   if(!positioned){point.x=target.x;point.y=target.y;positioned=true}
   tracking=true;resumeOnFocus=false;
   companion.style.transform=`translate3d(${point.x}px,${point.y}px,0)`;
   const interactive=String(!!event.target.closest('a,button,summary,[role="button"],label'));
   if(companion.dataset.interactive!==interactive)companion.dataset.interactive=interactive;
   companion.classList.add('is-visible','is-moving');
   clearTimeout(idleTimer);idleTimer=setTimeout(()=>companion.classList.remove('is-moving'),220);
   if(!frame)frame=requestAnimationFrame(drawPointer);
 }
 document.addEventListener('pointermove',showPointer,{passive:true});
 document.addEventListener('pointerdown',event=>{
   if(event.button===0)showPointer(event);
   if(event.pointerType!=='mouse'||event.button!==0||reduced.matches||!pointerAllowed()||!tracking||event.target.closest(editable))return;
   pressAnimation?.cancel();blinkAnimation?.cancel();
   blinkAnimation=eyes.animate([{transform:"scaleY(1)"},{transform:"scaleY(.15)",offset:.35},{transform:"scaleY(1)"}],{duration:280,easing:"ease-out"});
   pressAnimation=core.animate([{transform:'scale(1)'},{transform:'scale(.86)',offset:.3},{transform:'scale(1)'}],{duration:260,easing:'ease-out'});
 },{passive:true});
 function suspendPointer(){
   resumeOnFocus=resumeOnFocus||tracking;
   hidePointer();
 }
 function restorePointer(){
   syncPointer();
   if(document.hidden||!playful||!resumeOnFocus||!lastMouse)return;
   const element=document.elementFromPoint(lastMouse.x,lastMouse.y);
   if(!element||element.closest(editable))return;
   showPointer({type:'resume',pointerType:'mouse',clientX:lastMouse.x,clientY:lastMouse.y,target:element});
 }
 document.addEventListener('pointerout',event=>{if(!event.relatedTarget)suspendPointer()});
 document.addEventListener('keydown',event=>{
   if(event.key==='Tab'&&!event.ctrlKey&&!event.metaKey&&!event.altKey){resumeOnFocus=false;hidePointer()}
 });
 document.addEventListener('visibilitychange',()=>{if(document.hidden)suspendPointer();else restorePointer()});
 addEventListener('blur',suspendPointer);
 addEventListener('focus',restorePointer);
 addEventListener('pageshow',restorePointer);
})();
