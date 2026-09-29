(() => {
  document.querySelectorAll('[data-publications]').forEach(scope => {
    scope.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      scope.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      scope.querySelectorAll('[data-publication-group]').forEach(group => {
        group.hidden = filter !== 'all' && group.dataset.publicationGroup !== filter;
      });
      let count = 0;
      scope.querySelectorAll('.pub-list .pub').forEach(paper => {
        paper.hidden = filter !== 'all' && paper.dataset.type !== filter;
        if (!paper.hidden) count++;
      });
      const status = scope.querySelector('[data-filter-status]');
      if (status) status.textContent = `${count} ${count === 1 ? 'paper' : 'papers'} shown`;
    }));
  });
  document.querySelectorAll('[data-print]').forEach(b => b.addEventListener('click', () => window.print()));
  const point = (x, y, z, angle, w, h) => {
    const c = Math.cos(angle), s = Math.sin(angle);
    const xx = x*c+z*s, zz = -x*s+z*c;
    return [w/2+xx*w*.32, h*.5+(y*.76-zz*.34)*h*.35, zz];
  };
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
        ctx.strokeStyle='#36434e';ctx.lineWidth=1;
        edges.forEach(([a,b]) => {const p=point(...vertices[a],state.angle,w,h),q=point(...vertices[b],state.angle,w,h);ctx.beginPath();ctx.moveTo(p[0],p[1]);ctx.lineTo(q[0],q[1]);ctx.stroke();});
        const dots=[];
        for(let i=0;i<34;i++)for(let j=0;j<14;j++){
          const u=(i/33-.5)*1.7,v=(j/13-.5)*1.5;
          const y=.5*Math.sin(u*2.5)+.14*v*v;
          const p=point(u,y,v,state.angle,w,h);dots.push(p);
        }
        dots.sort((a,b)=>a[2]-b[2]);dots.forEach(p=>{ctx.fillStyle=`rgba(153,184,255,${.52+(p[2]+1.6)/6})`;ctx.beginPath();ctx.arc(p[0],p[1],Math.max(1.5,w/210)+(p[2]+1)*.2,0,Math.PI*2);ctx.fill();});
      } else if (scene === 'robustness') {
        // Conceptual directions for one input, not model output or an experiment.
        // Both perturbations have the same size; the decision boundary stays fixed.
        const strength = range ? Math.max(0,Math.min(1,Number(range.value)/100)) : .55;
        const left=w*.05, right=w*.95, boundary=w*.60, input=w*.45;
        const top=h*.23, bottom=h*.70, y=h*.47, distance=w*.31*strength;
        const inverse='#99b8ff', adversarial='#e4ae84';
        ctx.fillStyle='rgba(153,184,255,.045)';ctx.fillRect(left,top,boundary-left,bottom-top);
        ctx.fillStyle='rgba(228,174,132,.045)';ctx.fillRect(boundary,top,right-boundary,bottom-top);
        ctx.strokeStyle='#82919f';ctx.lineWidth=1;ctx.setLineDash([5,5]);
        ctx.beginPath();ctx.moveTo(boundary,top);ctx.lineTo(boundary,bottom);ctx.stroke();ctx.setLineDash([]);

        ctx.font='12px system-ui, sans-serif';ctx.fillStyle='#b6c0cb';ctx.textAlign='center';
        ctx.fillText('Decision boundary',boundary,h*.15);
        ctx.textAlign='left';ctx.fillText('Class A',left+9,top+21);
        ctx.textAlign='right';ctx.fillText('Class B',right-9,top+21);

        const arrow = (end, color) => {
          // At zero there is only the unperturbed input; short arrows scale cleanly.
          const length=Math.abs(end-input);if(length<1)return;
          const direction=Math.sign(end-input),head=Math.min(7,length*.4);
          ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=2;
          ctx.beginPath();ctx.moveTo(input,y);ctx.lineTo(end,y);ctx.stroke();
          ctx.beginPath();ctx.moveTo(end,y);ctx.lineTo(end-direction*head,y-head*.55);
          ctx.lineTo(end-direction*head,y+head*.55);ctx.closePath();ctx.fill();
        };
        arrow(input-distance,inverse);arrow(input+distance,adversarial);
        ctx.fillStyle='#eef2f6';ctx.beginPath();ctx.arc(input,y,5,0,Math.PI*2);ctx.fill();
        ctx.font='12px system-ui, sans-serif';ctx.textAlign='center';ctx.fillText('Input',input,y+24);

        // Fixed labels remain readable when arrows shrink or the view is narrow.
        ctx.font='600 12px system-ui, sans-serif';ctx.textAlign='left';ctx.fillStyle=inverse;
        ctx.fillText('Inverse adversarial',left,h*.84);
        ctx.textAlign='right';ctx.fillStyle=adversarial;ctx.fillText('Adversarial',right,h*.84);
        ctx.font='12px system-ui, sans-serif';ctx.fillStyle='#b6c0cb';
        ctx.textAlign='left';ctx.fillText('Away from boundary',left,h*.84+19);
        ctx.textAlign='right';ctx.fillText('Toward boundary',right,h*.84+19);
      } else if (scene === 'mesh') {
        const phase=range?Number(range.value)*Math.PI/50:state.phase;
        const nx=16,ny=10;const nodes=[];
        for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){
          const x=w*.07+i*w*.86/(nx-1),y=h*.15+j*h*.7/(ny-1);
          const z=Math.sin(i*.44-phase)*Math.cos(j*.5)*.5+.5;nodes.push({x,y,z});
        }
        ctx.strokeStyle='#36434e';ctx.lineWidth=.75;
        nodes.forEach((p,k)=>{[k%nx<nx-1?k+1:-1,k<nx*(ny-1)?k+nx:-1].filter(v=>v>=0).forEach(v=>{const q=nodes[v];ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();});});
        nodes.forEach(p=>{ctx.fillStyle=`rgba(153,184,255,${.46+p.z*.54})`;ctx.beginPath();ctx.arc(p.x,p.y,2.5+p.z*2,0,Math.PI*2);ctx.fill();});
      }
    };
    const resize=()=>{const rect=canvas.getBoundingClientRect();state.width=rect.width;state.height=rect.height;const dpr=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();};
    if(range)range.addEventListener('input',()=>{state.angle=Number(range.value)*Math.PI/180;const out=document.querySelector(`output[for="${range.id}"]`);if(out)out.textContent=scene==='geometry'?`${range.value}°`:range.value;draw();});
    new ResizeObserver(resize).observe(canvas);resize();
  });
})();
