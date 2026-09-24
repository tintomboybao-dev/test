(() => {
  const {compounds, reactions} = window.CHEM_DATA;
  const byFormula = new Map(compounds.map(c => [c.f, c]));

  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const amount = v => Object.values(v.contents || {}).reduce((a,b)=>a+b,0);

  function hexToRgb(hex){
    const h=hex.replace('#','');
    if(h.length===3) return [parseInt(h[0]+h[0],16),parseInt(h[1]+h[1],16),parseInt(h[2]+h[2],16)];
    return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)];
  }
  function mixColor(vessel){
    let total=0,r=0,g=0,b=0;
    Object.entries(vessel.contents||{}).forEach(([f,q])=>{
      const c=byFormula.get(f);
      if(!c || c.phase==='s' || c.phase==='g') return;
      const [rr,gg,bb]=hexToRgb(c.color||'#9bdfff');
      total+=q;r+=rr*q;g+=gg*q;b+=bb*q;
    });
    if(!total) return 'rgba(110,205,235,.12)';
    return `rgba(${Math.round(r/total)},${Math.round(g/total)},${Math.round(b/total)},.78)`;
  }
  function estimatePH(vessel){
    let acid=0,base=0,neutral=0;
    for(const [f,q] of Object.entries(vessel.contents||{})){
      const c=byFormula.get(f);
      if(!c) continue;
      if(c.ph <= 3) acid += q*(7-c.ph);
      else if(c.ph >= 11) base += q*(c.ph-7);
      else neutral += q;
    }
    if(acid>base){ const dominance=(acid-base)/(acid+base+neutral+0.01); return clamp(7-6*dominance,0,7); }
    if(base>acid){ const dominance=(base-acid)/(acid+base+neutral+0.01); return clamp(7+6*dominance,7,14); }
    return 7;
  }
  function has(v,f,n){return (v.contents[f]||0)>=n-1e-6}
  function conditionOK(v,r){
    if(!r.requiresAny || !r.requiresAny.length) return true;
    return r.requiresAny.some(cond => cond==='heat' ? v.temperature>=58 : has(v,cond,.15));
  }
  function canRun(v,r){return conditionOK(v,r)&&Object.entries(r.r).every(([f,n])=>has(v,f,n));}
  function maxExtent(v,r){
    let x=Infinity;
    Object.entries(r.r).forEach(([f,n])=>{x=Math.min(x,(v.contents[f]||0)/n)});
    return Math.max(0,Math.min(1,x));
  }
  function consume(v,map,extent){
    for(const [f,n] of Object.entries(map)){
      v.contents[f]=(v.contents[f]||0)-n*extent;
      if(v.contents[f]<.002) delete v.contents[f];
    }
  }
  function produce(v,map,extent){
    for(const [f,n] of Object.entries(map)){
      v.contents[f]=(v.contents[f]||0)+n*extent;
    }
  }
  function applyReaction(v,r){
    const extent=maxExtent(v,r);
    if(extent<.12) return null;
    consume(v,r.r,extent); produce(v,r.p,extent);
    if(r.heat) v.temperature=clamp(v.temperature+r.heat*extent,20,180);
    v.reactionPulse=1;
    if(r.precip){
      v.precipitates ||= [];
      v.precipitates.push({formula:r.precip,color:r.precipColor||'#eee',amount:extent,age:0});
    }
    if(r.deposit){
      v.deposits ||= [];
      v.deposits.push({formula:r.deposit,color:r.depositColor||'#ddd',amount:extent,age:0});
    }
    if(r.gas){v.gasRelease={type:r.gas,intensity:Math.min(1.6,.55+extent),ttl:3.5}}
    if(r.kind==='violent') v.violentPulse=Math.max(v.violentPulse||0,1);
    return {reaction:r,extent};
  }
  function run(v){
    const events=[]; let guard=0,changed=true;
    while(changed && guard++<8){
      changed=false;
      for(const r of reactions){
        if(canRun(v,r)){
          const event=applyReaction(v,r);
          if(event){events.push(event);changed=true;break;}
        }
      }
    }
    v.ph=estimatePH(v);
    return events;
  }
  function add(v,formula,q=.7){
    v.contents[formula]=(v.contents[formula]||0)+q;
    v.ph=estimatePH(v);
    return run(v);
  }
  function transfer(from,to,q){
    const total=amount(from); if(total<=0) return [];
    const fraction=clamp(q/total,0,1);
    for(const [f,a] of Object.entries(from.contents)){
      const d=a*fraction;
      from.contents[f]-=d; if(from.contents[f]<.002) delete from.contents[f];
      to.contents[f]=(to.contents[f]||0)+d;
    }
    const thermal=(to.temperature*(amount(to)-q)+from.temperature*q)/Math.max(.001,amount(to));
    to.temperature=isFinite(thermal)?thermal:to.temperature;
    from.ph=estimatePH(from);to.ph=estimatePH(to);
    return run(to);
  }


  window.ChemEngine={byFormula,amount,mixColor,estimatePH,run,add,transfer,clamp};
})();
