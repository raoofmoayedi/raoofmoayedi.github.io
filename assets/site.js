(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    let count = 0;
    document.querySelectorAll('.pub-list .pub').forEach(p => { p.hidden = filter !== 'all' && p.dataset.type !== filter; if (!p.hidden) count++; });
    const status = document.getElementById('filter-status'); if (status) status.textContent = `${count} papers shown`;
  }));
  document.querySelectorAll('[data-print]').forEach(b => b.addEventListener('click', () => window.print()));
  const point = (x, y, z, angle, w, h) => {
    const c = Math.cos(angle), s = Math.sin(angle);
    const xx = x*c+z*s, zz = -x*s+z*c;
    return [w/2+xx*w*.32, h*.5+(y*.76-zz*.34)*h*.35, zz];
  };
  const canvases = [];
  document.querySelectorAll('canvas[data-scene]').forEach(canvas => {
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const range = document.getElementById(canvas.dataset.control || '');
    const scene = canvas.dataset.scene;
    const state = { angle: range ? Number(range.value)*Math.PI/180 : .65, width: 0, height: 0, phase: 0 };
    const draw = () => {
      const w = state.width, h = state.height; if (!w || !h) return;
      ctx.clearRect(0,0,w,h);
      if (scene === 'geometry') {
        const vertices = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
        const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
        ctx.strokeStyle='#ccd4e4';ctx.lineWidth=1;
        edges.forEach(([a,b]) => {const p=point(...vertices[a],state.angle,w,h),q=point(...vertices[b],state.angle,w,h);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();});
        const dots=[];
        for(let i=0;i<34;i++)for(let j=0;j<14;j++){
          const u=(i/33-.5)*1.7,v=(j/13-.5)*1.5;
          const y=.5*Math.sin(u*2.5)+.14*v*v;
          const p=point(u,y,v,state.angle,w,h);dots.push(p);
        }
        dots.sort((a,b)=>a[2]-b[2]);dots.forEach(p=>{ctx.fillStyle=`rgba(36,75,227,${.42+(p[2]+1.6)/5})`;ctx.beginPath();ctx.arc(p[0],p[1],Math.max(1.5,w/210)+(p[2]+1)*.2,0,Math.PI*2);ctx.fill();});
      } else if (scene === 'robustness') {
        const strength = range ? Number(range.value)/100 : .55;
        const margin=w*.12;
        ctx.strokeStyle='#c6cee2';ctx.lineWidth=1;
        ctx.beginPath();ctx.moveTo(margin,h*.85);ctx.lineTo(w-margin,h*.85);ctx.moveTo(margin,h*.15);ctx.lineTo(margin,h*.85);ctx.stroke();
        // A geometric illustration only: two classes and a movable linear boundary.
        const boundary = x => h*.5+(x-w/2)*(.65*strength-.325);
        ctx.strokeStyle='#172232';ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(margin,boundary(margin));ctx.lineTo(w-margin,boundary(w-margin));ctx.stroke();ctx.setLineDash([]);
        for(let i=0;i<74;i++){
          const cls=i%2;const t=((i*47)%97)/97; const jitter=Math.sin(i*6.8)*.1;
          const x=margin+(w-2*margin)*(.08+.84*t);
          const y=h*(cls?.68:.32)+jitter*h;
          ctx.fillStyle=cls?'#244be3':'#e98c5a';ctx.beginPath();
          if(cls)ctx.arc(x,y,3.2,0,Math.PI*2);else ctx.rect(x-3,y-3,6,6);ctx.fill();
        }
      } else if (scene === 'mesh') {
        const phase=range?Number(range.value)*Math.PI/50:state.phase;
        const nx=16,ny=10;const nodes=[];
        for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
          const x=w*.07+i*w*.86/(nx-1),y=h*.15+j*h*.7/(ny-1);
          const z=Math.sin(i*.44-phase)*Math.cos(j*.5)*.5+.5;nodes.push({x,y,z});
        }
        ctx.strokeStyle='#bac9e6';ctx.lineWidth=.75;
        nodes.forEach((p,k)=>{[k%nx<nx-1?k+1:-1,k<nx*(ny-1)?k+nx:-1].filter(v=>v>=0).forEach(v=>{const q=nodes[v];ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();});});
        nodes.forEach(p=>{ctx.fillStyle=`hsl(${226-p.z*35} 76% ${73-p.z*33}%)`;ctx.beginPath();ctx.arc(p.x,p.y,2.5+p.z*2,0,Math.PI*2);ctx.fill();});
      }
    };
    const resize=()=>{const rect=canvas.getBoundingClientRect();state.width=rect.width;state.height=rect.height;const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();};
    if(range)range.addEventListener('input',()=>{state.angle=Number(range.value)*Math.PI/180;const out=document.querySelector(`output[for="${range.id}"]`);if(out)out.textContent=scene==='geometry'?`${range.value}°`:range.value;draw();});
    new ResizeObserver(resize).observe(canvas);resize();canvases.push({draw,state,scene});
  });
})();
