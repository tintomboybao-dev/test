(() => {
  const DATA = window.CHEM_DATA;
  const Chem = window.ChemEngine;
  const canvas = document.getElementById('labCanvas');
  const ctx = canvas.getContext('2d');
  const wrap = document.getElementById('canvasWrap');
  const DPR = Math.min(window.devicePixelRatio || 1, 2);

  let W=900,H=700,last=performance.now(),accum=0,fps=60,frameCount=0,fpsClock=performance.now();
  let idSeq=1, objects=[], particles=[], selected=null, drag=null, activeFilter='all', soundOn=true;
  let shakeEnergy=0, cameraX=0, cameraY=0, selectedElement=DATA.elements[0];
  const ambient=24;

  const AudioFX = (()=>{
    let ac=null;
    function ensure(){ if(!soundOn) return null; if(!ac) ac=new (window.AudioContext||window.webkitAudioContext)(); if(ac.state==='suspended') ac.resume(); return ac; }
    function tone(freq=300,dur=.08,type='sine',gain=.035,slide=1){const a=ensure();if(!a)return;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(freq,a.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(30,freq*slide),a.currentTime+dur);g.gain.setValueAtTime(gain,a.currentTime);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+dur);o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+dur)}
    function noise(dur=.2,gain=.04){const a=ensure();if(!a)return;const len=Math.floor(a.sampleRate*dur),buf=a.createBuffer(1,len,a.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);const s=a.createBufferSource(),g=a.createGain();s.buffer=buf;g.gain.setValueAtTime(gain,a.currentTime);g.gain.exponentialRampToValueAtTime(.0001,a.currentTime+dur);s.connect(g);g.connect(a.destination);s.start()}
    return {
      click(){tone(520,.04,'sine',.018,.86)},
      drop(){tone(240,.06,'triangle',.03,1.4)},
      bubble(){tone(520+Math.random()*180,.05,'sine',.012,.72)},
      pour(){tone(260,.08,'sine',.012,1.14)},
      reaction(){tone(430,.09,'triangle',.025,1.4)},
      explosion(){noise(.55,.12);tone(85,.5,'sawtooth',.08,.35)},
      burner(on){tone(on?260:180,.09,'triangle',.02,on?1.5:.7)}
    };
  })();

  function resize(){
    const r=wrap.getBoundingClientRect();W=Math.max(400,r.width);H=Math.max(500,r.height);
    canvas.width=Math.round(W*DPR);canvas.height=Math.round(H*DPR);ctx.setTransform(DPR,0,0,DPR,0,0);
    objects.forEach(o=>{o.x=Chem.clamp(o.x,40,W-40);o.y=Chem.clamp(o.y,90,H-50)});
  }
  window.addEventListener('resize',resize);resize();

  function vesselDims(type){
    if(type==='testtube') return {w:54,h:150,capacity:5,label:'Ống nghiệm'};
    if(type==='beaker') return {w:92,h:116,capacity:12,label:'Cốc thủy tinh'};
    return {w:100,h:145,capacity:10,label:'Bình tam giác'};
  }
  function createVessel(type='testtube',x=W*.50,y=H*.62){
    const d=vesselDims(type); const o={id:idSeq++,kind:'vessel',type,x,y,w:d.w,h:d.h,capacity:d.capacity,label:d.label,angle:0,contents:{},temperature:ambient,ph:7,precipitates:[],deposits:[],wobble:0,reactionPulse:0,violentPulse:0,gasRelease:null};
    objects.push(o);selected=o;updateInspector();return o;
  }
  function createBurner(x=W*.62,y=H*.76){const o={id:idSeq++,kind:'burner',type:'burner',x,y,w:90,h:120,on:true,label:'Đèn Bunsen'};objects.push(o);selected=o;updateInspector();return o}
  function metaForFormula(f){return DATA.compounds.find(c=>c.f===f)||{f,name:DATA.elements.find(e=>e[1]===f)?.[2]||f,kind:'element',color:'#cad6dc',phase:'s',ph:7}}
  function createBottle(formula,x=W*.20+Math.random()*90,y=H*.66+Math.random()*30){const m=metaForFormula(formula);const o={id:idSeq++,kind:'bottle',type:'bottle',formula,x,y,w:64,h:92,label:m.name,color:m.color||'#bfefff',doses:6};objects.push(o);selected=o;updateInspector();return o}
  function addDemo(formulas){
    const baseX=Math.max(100,W*.17), y=H*.66;
    formulas.forEach((f,i)=>createBottle(f,baseX+i*78,y+(i%2)*18));
    if(!objects.some(o=>o.kind==='vessel')) createVessel('beaker',W*.52,H*.60);
    showToast('Đã chuẩn bị hóa chất','Kéo các chai vào dụng cụ và tự thực hiện thí nghiệm.');
  }

  function selectedName(o){
    if(!o) return 'Chưa chọn vật thể';
    if(o.kind==='vessel') return `${o.label} #${o.id}`;
    if(o.kind==='bottle') return `${o.formula} · ${o.label}`;
    return 'Đèn Bunsen';
  }

  function addLog(text,cls=''){
    const log=document.getElementById('reactionLog'),row=document.createElement('div');row.className='log-row '+cls;row.textContent=text;log.prepend(row);while(log.children.length>16)log.lastChild.remove();
  }
  function showToast(title,sub=''){
    const t=document.getElementById('reactionToast');t.innerHTML=`<b>${title}</b>${sub?`<span>${sub}</span>`:''}`;t.classList.add('show');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>t.classList.remove('show'),2600);
  }
  function handleEvents(v,events){
    for(const e of events){
      const r=e.reaction;
      const card=document.getElementById('latestReaction');card.className='reaction-card';card.innerHTML=`<b>${r.eq}</b><span>${r.note||''}</span>`;
      addLog(r.eq,'rx');showToast(r.eq,r.note||'');AudioFX.reaction();
      for(let i=0;i<12;i++) spawnParticle('spark',v.x+(Math.random()-.5)*28,v.y-v.h*.18,{color:r.precipColor||'#9defff',speed:.65});
      if(r.kind==='precip'||r.kind==='deposit') for(let i=0;i<16;i++) spawnParticle('precip',v.x+(Math.random()-.5)*35,v.y+20,{color:r.precipColor||r.depositColor||'#eee'});
      if(r.kind==='gas') for(let i=0;i<18;i++) spawnBubble(v);
      if(r.kind==='heat') for(let i=0;i<8;i++) spawnSteam(v,.5);
      if(r.kind==='violent') explode(v);
    }
    updateInspector();
  }

  function explode(v){
    shakeEnergy=Math.max(shakeEnergy,15);AudioFX.explosion();
    const overlay=document.getElementById('dangerOverlay');overlay.style.setProperty('--x',`${v.x/W*100}%`);overlay.style.setProperty('--y',`${v.y/H*100}%`);overlay.classList.remove('flash');void overlay.offsetWidth;overlay.classList.add('flash');
    for(let i=0;i<80;i++)spawnParticle(i%5===0?'smoke':'spark',v.x,v.y-v.h*.25,{color:i%3===0?'#fff4c2':i%3===1?'#ff9b4c':'#ff5c62',speed:2.5+Math.random()*3});
    addLog('Phản ứng mạnh: hiệu ứng an toàn trong mô phỏng.','warn');
  }

  function spawnParticle(type,x,y,opt={}){
    const life=opt.life ?? (type==='steam'?1.7:type==='smoke'?1.4:type==='bubble'?1.2:.8);
    let a=Math.random()*Math.PI*2,s=opt.speed??1;
    let vx=Math.cos(a)*s,vy=Math.sin(a)*s;
    if(type==='steam'){vx=(Math.random()-.5)*.35;vy=-.45-Math.random()*.45}
    if(type==='bubble'){vx=(Math.random()-.5)*.18;vy=-.35-Math.random()*.45}
    if(type==='precip'){vx=(Math.random()-.5)*.12;vy=.18+Math.random()*.25}
    if(type==='smoke'){vx=(Math.random()-.5)*.5;vy=-.4-Math.random()*.6}
    particles.push({type,x,y,vx,vy,life,max:life,size:opt.size??(2+Math.random()*5),color:opt.color||'#dffaff'});
  }
  function spawnBubble(v){spawnParticle('bubble',v.x+(Math.random()-.5)*v.w*.45,v.y+v.h*.16-Math.random()*v.h*.25,{size:3+Math.random()*5})}
  function spawnSteam(v,strength=1){spawnParticle('steam',v.x+(Math.random()-.5)*v.w*.4,v.y-v.h*.46,{size:(8+Math.random()*10)*strength,color:'#dbf7ff'})}

  function worldPoint(o,lx,ly){const a=o.angle||0,c=Math.cos(a),s=Math.sin(a);return {x:o.x+lx*c-ly*s,y:o.y+lx*s+ly*c}}
  function mouthPoint(o){
    if(o.type==='beaker') return worldPoint(o,(o.angle>=0?1:-1)*o.w*.45,-o.h*.43);
    return worldPoint(o,0,-o.h*.48);
  }
  function targetRim(o){return worldPoint(o,0,-o.h*.42)}
  function hitObject(x,y){
    for(let i=objects.length-1;i>=0;i--){const o=objects[i];const dx=x-o.x,dy=y-o.y; if(Math.abs(dx)<=o.w*.6+12 && Math.abs(dy)<=o.h*.58+12)return o}return null;
  }
  function nearestReceiving(source){
    const m=mouthPoint(source);let best=null,bd=Infinity;
    for(const o of objects){if(o===source||o.kind!=='vessel')continue;const r=targetRim(o),d=Math.hypot(m.x-r.x,m.y-r.y);if(d<bd){bd=d;best=o}}
    return bd<95?best:null;
  }
  function nearestVesselToBottle(b){
    let best=null,bd=Infinity;for(const o of objects){if(o.kind!=='vessel')continue;const r=targetRim(o),d=Math.hypot(b.x-r.x,b.y-r.y);if(d<bd){bd=d;best=o}}return bd<100?best:null;
  }

  function update(dt){
    cameraX*=.84;cameraY*=.84;if(shakeEnergy>.2){shakeEnergy*=.88;cameraX=(Math.random()-.5)*shakeEnergy;cameraY=(Math.random()-.5)*shakeEnergy}else shakeEnergy=0;
    for(const o of objects){
      if(o.kind==='vessel'){
        const nearBurner=objects.find(b=>b.kind==='burner'&&b.on&&Math.hypot(o.x-b.x,(o.y+o.h*.35)-(b.y-45))<105);
        const prevTemp=o.temperature;
        if(nearBurner){
          o.temperature=Math.min(175,o.temperature+22*dt);
          if((prevTemp<58&&o.temperature>=58)||Math.random()<dt*.7){const hev=Chem.run(o);if(hev.length)handleEvents(o,hev);}
        }else o.temperature+=(ambient-o.temperature)*Math.min(1,.045*dt);
        if(o.temperature>72 && Chem.amount(o)>.05 && Math.random()<dt*(o.temperature-60)*.045)spawnSteam(o,Math.min(1.4,(o.temperature-60)/55));
        if(o.temperature>92 && Math.random()<dt*4)spawnBubble(o);
        if(o.gasRelease){o.gasRelease.ttl-=dt;if(Math.random()<dt*10*o.gasRelease.intensity)spawnBubble(o);if(o.gasRelease.ttl<=0)o.gasRelease=null;}
        o.wobble*=Math.pow(.04,dt);o.reactionPulse=Math.max(0,(o.reactionPulse||0)-dt*1.5);o.violentPulse=Math.max(0,(o.violentPulse||0)-dt*1.2);
        (o.precipitates||[]).forEach(p=>p.age+=dt);(o.deposits||[]).forEach(p=>p.age+=dt);
        if(Math.abs(o.angle)>.62 && Chem.amount(o)>.02){
          const target=nearestReceiving(o);if(target){
            const rate=Math.min(.38*dt,Chem.amount(o));const ev=Chem.transfer(o,target,rate);handleEvents(target,ev);
            const a=mouthPoint(o),b=targetRim(target);for(let i=0;i<2;i++){const t=Math.random();spawnParticle('droplet',a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,{color:Chem.mixColor(o),size:2.2,life:.28,speed:.05})}if(Math.random()<dt*6)AudioFX.pour();
          }
        }
      }
    }
    for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;if(p.life<=0){particles.splice(i,1);continue}p.x+=p.vx*60*dt;p.y+=p.vy*60*dt;if(p.type==='spark')p.vy+=.08*60*dt;if(p.type==='precip')p.vy+=.01*60*dt;p.vx*=Math.pow(.88,dt*60);}
  }

  function drawBackground(){
    const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'#102735');g.addColorStop(.54,'#0b1b27');g.addColorStop(.541,'#8d8e89');g.addColorStop(.58,'#5c5f5c');g.addColorStop(.78,'#3d4141');g.addColorStop(.781,'#232625');g.addColorStop(1,'#151817');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    // wall tiles
    ctx.save();ctx.globalAlpha=.15;ctx.strokeStyle='#79b1c5';ctx.lineWidth=1;const tile=64;for(let x=0;x<W;x+=tile){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H*.54);ctx.stroke()}for(let y=18;y<H*.54;y+=tile*.72){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}ctx.restore();
    // rear shelf
    ctx.fillStyle='rgba(2,8,12,.32)';ctx.fillRect(30,H*.14,W-60,5);ctx.fillStyle='rgba(121,174,195,.14)';ctx.fillRect(30,H*.14-2,W-60,1);
    for(let i=0;i<12;i++){const x=60+i*(W-120)/11,h=35+(i%4)*8;ctx.fillStyle=`rgba(${55+i*4},${98+i*2},${112+i},.22)`;roundRect(x-12,H*.14-h,24,h,5,true,false)}
    // bench highlight
    const bg=ctx.createLinearGradient(0,H*.54,0,H*.80);bg.addColorStop(0,'rgba(255,255,255,.15)');bg.addColorStop(.16,'rgba(255,255,255,.025)');bg.addColorStop(1,'rgba(0,0,0,.18)');ctx.fillStyle=bg;ctx.fillRect(0,H*.54,W,H*.26);
    ctx.strokeStyle='rgba(227,248,255,.13)';ctx.beginPath();ctx.moveTo(0,H*.54);ctx.lineTo(W,H*.54);ctx.stroke();
    // soft lamps
    for(const lx of [W*.28,W*.72]){const rg=ctx.createRadialGradient(lx,H*.10,0,lx,H*.2,180);rg.addColorStop(0,'rgba(189,236,248,.10)');rg.addColorStop(1,'rgba(189,236,248,0)');ctx.fillStyle=rg;ctx.fillRect(lx-190,0,380,H*.5)}
  }
  function roundRect(x,y,w,h,r,fill=true,stroke=false){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill)ctx.fill();if(stroke)ctx.stroke()}
  function drawShadow(o,scale=1){ctx.save();ctx.translate(o.x,o.y+o.h*.48);ctx.scale(1,.28);const g=ctx.createRadialGradient(0,0,3,0,0,o.w*.7);g.addColorStop(0,'rgba(0,0,0,.45)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,o.w*.72*scale,0,Math.PI*2);ctx.fill();ctx.restore()}

  function glassGradient(x1,x2){const g=ctx.createLinearGradient(x1,0,x2,0);g.addColorStop(0,'rgba(219,248,255,.11)');g.addColorStop(.18,'rgba(255,255,255,.26)');g.addColorStop(.38,'rgba(120,202,224,.04)');g.addColorStop(.78,'rgba(255,255,255,.11)');g.addColorStop(1,'rgba(197,239,250,.18)');return g}
  function vesselPath(o){
    const w=o.w,h=o.h;ctx.beginPath();
    if(o.type==='testtube'){ctx.moveTo(-w*.28,-h*.47);ctx.lineTo(-w*.28,h*.30);ctx.bezierCurveTo(-w*.28,h*.52,w*.28,h*.52,w*.28,h*.30);ctx.lineTo(w*.28,-h*.47);ctx.closePath()}
    else if(o.type==='beaker'){ctx.moveTo(-w*.44,-h*.42);ctx.lineTo(-w*.38,h*.43);ctx.quadraticCurveTo(0,h*.49,w*.38,h*.43);ctx.lineTo(w*.44,-h*.42);ctx.closePath()}
    else{ctx.moveTo(-w*.12,-h*.48);ctx.lineTo(-w*.12,-h*.17);ctx.lineTo(-w*.44,h*.34);ctx.quadraticCurveTo(-w*.48,h*.47,0,h*.48);ctx.quadraticCurveTo(w*.48,h*.47,w*.44,h*.34);ctx.lineTo(w*.12,-h*.17);ctx.lineTo(w*.12,-h*.48);ctx.closePath()}
  }
  function drawVessel(o){
    drawShadow(o,1.05);ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.angle+(o.wobble||0)*Math.sin(performance.now()*.04));
    const pulse=o.reactionPulse||0;if(pulse){ctx.shadowColor='#7ce8ff';ctx.shadowBlur=18*pulse}
    vesselPath(o);ctx.fillStyle=glassGradient(-o.w*.5,o.w*.5);ctx.fill();ctx.clip();
    const fillRatio=Chem.clamp(Chem.amount(o)/o.capacity,0,.92);const liquidTop=o.h*.45-o.h*.82*fillRatio;
    ctx.fillStyle=Chem.mixColor(o);ctx.fillRect(-o.w*.55,liquidTop,o.w*1.1,o.h);
    const surf=ctx.createLinearGradient(0,liquidTop-3,0,liquidTop+6);surf.addColorStop(0,'rgba(255,255,255,.5)');surf.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=surf;ctx.fillRect(-o.w*.6,liquidTop-3,o.w*1.2,8);
    // sediment
    let sy=o.h*.42;for(const p of (o.precipitates||[]).slice(-3)){const hh=Math.min(13,4+p.amount*7);ctx.fillStyle=p.color;ctx.globalAlpha=.72;ctx.fillRect(-o.w*.38,sy-hh,o.w*.76,hh);sy-=hh*.65}ctx.globalAlpha=1;
    // metallic deposits
    for(const p of (o.deposits||[]).slice(-2)){ctx.strokeStyle=p.color;ctx.globalAlpha=.78;ctx.lineWidth=2;for(let i=0;i<8;i++){ctx.beginPath();const xx=-o.w*.28+Math.random()*o.w*.56;ctx.moveTo(xx,o.h*.30);ctx.lineTo(xx+(Math.random()-.5)*8,o.h*.15+Math.random()*10);ctx.stroke()}}ctx.globalAlpha=1;
    ctx.restore();
    ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.angle+(o.wobble||0)*Math.sin(performance.now()*.04));vesselPath(o);ctx.strokeStyle=selected===o?'rgba(115,232,255,.95)':'rgba(215,247,255,.72)';ctx.lineWidth=selected===o?2.2:1.4;ctx.shadowColor='rgba(121,226,247,.24)';ctx.shadowBlur=selected===o?10:5;ctx.stroke();
    // rim
    ctx.strokeStyle='rgba(232,252,255,.9)';ctx.lineWidth=2;if(o.type==='beaker'){ctx.beginPath();ctx.moveTo(-o.w*.47,-o.h*.42);ctx.lineTo(o.w*.47,-o.h*.42);ctx.stroke()}else{ctx.beginPath();ctx.ellipse(0,-o.h*.48,o.w*(o.type==='testtube'?.31:.14),4,0,0,Math.PI*2);ctx.stroke()}
    // glass highlight
    ctx.strokeStyle='rgba(255,255,255,.34)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-o.w*.18,-o.h*.34);ctx.lineTo(-o.w*.16,o.h*.18);ctx.stroke();ctx.restore();
    // temperature badge
    ctx.save();ctx.font='600 9px Inter,system-ui';ctx.textAlign='center';ctx.fillStyle=o.temperature>70?'#ffd78a':'#a9c7d5';ctx.fillText(`${Math.round(o.temperature)}°C`,o.x,o.y+o.h*.62);ctx.restore();
  }
  function drawBottle(o){
    drawShadow(o,.8);ctx.save();ctx.translate(o.x,o.y);const w=o.w,h=o.h;ctx.fillStyle='#1c2a35';roundRect(-w*.20,-h*.48,w*.4,15,4,true,false);ctx.strokeStyle='rgba(199,238,249,.7)';ctx.lineWidth=1.4;ctx.fillStyle=glassGradient(-w*.5,w*.5);roundRect(-w*.37,-h*.34,w*.74,h*.70,10,true,true);ctx.fillStyle=o.color;ctx.globalAlpha=.58;roundRect(-w*.33,h*.05,w*.66,h*.27,7,true,false);ctx.globalAlpha=1;ctx.fillStyle='#eaf4f7';roundRect(-w*.30,-h*.08,w*.60,h*.25,4,true,false);ctx.fillStyle='#14232c';ctx.textAlign='center';ctx.font='800 10px Inter,system-ui';ctx.fillText(o.formula,0,h*.035);ctx.font='600 6px Inter,system-ui';ctx.fillStyle='#516673';const nm=o.label.length>14?o.label.slice(0,13)+'…':o.label;ctx.fillText(nm,0,h*.115);ctx.fillStyle='#8da8b7';ctx.font='700 7px Inter,system-ui';ctx.fillText(`${o.doses} liều`,0,h*.52);if(selected===o){ctx.strokeStyle='#73e5fb';ctx.lineWidth=2;roundRect(-w*.43,-h*.54,w*.86,h*1.08,13,false,true)}ctx.restore();
  }
  function drawBurner(o){
    drawShadow(o,.9);ctx.save();ctx.translate(o.x,o.y);ctx.fillStyle='#394a55';ctx.strokeStyle='#9cb6c5';ctx.lineWidth=1.5;roundRect(-31,22,62,20,8,true,true);ctx.fillStyle='#526976';roundRect(-10,-28,20,54,5,true,true);if(o.on){const t=performance.now()*.01;const flameH=56+Math.sin(t)*4;const gr=ctx.createLinearGradient(0,-85,0,-30);gr.addColorStop(0,'rgba(111,238,255,.15)');gr.addColorStop(.45,'#55d8ff');gr.addColorStop(1,'#1f66ff');ctx.fillStyle=gr;ctx.shadowColor='#46bcff';ctx.shadowBlur=20;ctx.beginPath();ctx.moveTo(0,-28);ctx.bezierCurveTo(-23,-50,-12,-63,0,-28-flameH);ctx.bezierCurveTo(12,-63,23,-50,0,-28);ctx.fill();ctx.shadowBlur=0;ctx.fillStyle='rgba(235,252,255,.95)';ctx.beginPath();ctx.moveTo(0,-30);ctx.bezierCurveTo(-8,-46,-4,-56,0,-65);ctx.bezierCurveTo(5,-56,9,-46,0,-30);ctx.fill()}if(selected===o){ctx.strokeStyle='#73e5fb';ctx.lineWidth=2;roundRect(-42,-98,84,145,14,false,true)}ctx.restore();
  }
  function drawParticles(){
    for(const p of particles){const k=p.life/p.max;ctx.save();ctx.globalAlpha=Math.min(1,k*1.4);if(p.type==='bubble'){ctx.strokeStyle='rgba(235,254,255,.86)';ctx.lineWidth=1;ctx.beginPath();ctx.arc(p.x,p.y,p.size*(1.15-k*.2),0,Math.PI*2);ctx.stroke();ctx.fillStyle='rgba(166,230,245,.08)';ctx.fill()}
      else if(p.type==='steam'||p.type==='smoke'){const r=p.size*(1+(1-k)*1.5),g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r);g.addColorStop(0,p.type==='steam'?'rgba(224,248,255,.34)':'rgba(65,74,79,.48)');g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill()}
      else if(p.type==='droplet'){ctx.fillStyle=p.color;ctx.beginPath();ctx.ellipse(p.x,p.y,p.size*.7,p.size*1.5,0,0,Math.PI*2);ctx.fill()}
      else{ctx.fillStyle=p.color;ctx.shadowColor=p.color;ctx.shadowBlur=p.type==='spark'?7:0;ctx.beginPath();ctx.arc(p.x,p.y,p.size*k,0,Math.PI*2);ctx.fill()}ctx.restore()}
  }
  function drawPourStreams(){
    for(const o of objects){if(o.kind!=='vessel'||Math.abs(o.angle)<=.62||Chem.amount(o)<=.02)continue;const target=nearestReceiving(o);if(!target)continue;const a=mouthPoint(o),b=targetRim(target),g=ctx.createLinearGradient(a.x,a.y,b.x,b.y);g.addColorStop(0,Chem.mixColor(o));g.addColorStop(1,'rgba(196,240,250,.18)');ctx.strokeStyle=g;ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.quadraticCurveTo((a.x+b.x)/2+12,(a.y+b.y)/2+18,b.x,b.y);ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.3)';ctx.lineWidth=1;ctx.stroke()}
  }
  function render(){
    ctx.clearRect(0,0,W,H);ctx.save();ctx.translate(cameraX,cameraY);drawBackground();for(const o of objects){if(o.kind==='burner')drawBurner(o);else if(o.kind==='bottle')drawBottle(o);else drawVessel(o)}drawPourStreams();drawParticles();ctx.restore();
  }
  function loop(t){const dt=Math.min(.04,(t-last)/1000);last=t;update(dt);render();frameCount++;if(t-fpsClock>700){fps=Math.round(frameCount*1000/(t-fpsClock));frameCount=0;fpsClock=t;document.getElementById('fpsLabel').textContent=`${fps} FPS`}requestAnimationFrame(loop)}requestAnimationFrame(loop);

  function pointerPos(e){const r=canvas.getBoundingClientRect();return {x:e.clientX-r.left-cameraX,y:e.clientY-r.top-cameraY}}
  canvas.addEventListener('pointerdown',e=>{AudioFX.click();const p=pointerPos(e),o=hitObject(p.x,p.y);selected=o;if(o){objects=objects.filter(x=>x!==o);objects.push(o);drag={o,dx:p.x-o.x,dy:p.y-o.y,moved:false};canvas.setPointerCapture(e.pointerId)}updateInspector()});
  canvas.addEventListener('pointermove',e=>{if(!drag)return;const p=pointerPos(e);drag.o.x=Chem.clamp(p.x-drag.dx,28,W-28);drag.o.y=Chem.clamp(p.y-drag.dy,70,H-38);drag.moved=true});
  canvas.addEventListener('pointerup',e=>{if(!drag)return;const o=drag.o;if(o.kind==='bottle'){const v=nearestVesselToBottle(o);if(v){const ev=Chem.add(v,o.formula,1.0);o.doses--;for(let i=0;i<13;i++){const a={x:o.x,y:o.y-o.h*.3},b=targetRim(v),t=Math.random();spawnParticle('droplet',a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,{color:o.color,size:2.5,life:.3,speed:.1})}AudioFX.drop();addLog(`${o.formula} → ${v.label} #${v.id}`);handleEvents(v,ev);if(o.doses<=0){objects=objects.filter(x=>x!==o);selected=v}}}else if(o.kind==='burner'&&!drag.moved){o.on=!o.on;AudioFX.burner(o.on);showToast(o.on?'Đèn Bunsen đã bật':'Đèn Bunsen đã tắt')}drag=null;updateInspector()});
  canvas.addEventListener('dblclick',e=>{const p=pointerPos(e),o=hitObject(p.x,p.y);if(o?.kind==='burner'){o.on=!o.on;AudioFX.burner(o.on);updateInspector()}});
  canvas.addEventListener('wheel',e=>{const p=pointerPos(e),o=hitObject(p.x,p.y);if(o?.kind==='vessel'){e.preventDefault();selected=o;o.angle=Chem.clamp(o.angle+Math.sign(e.deltaY)*.10,-1.48,1.48);updateInspector()}},{passive:false});

  function rotateSelected(d){if(selected?.kind==='vessel'){selected.angle=Chem.clamp(selected.angle+d,-1.48,1.48);updateInspector()}}
  function shakeSelected(){if(selected?.kind==='vessel'){selected.wobble=.12;for(let i=0;i<7;i++)spawnBubble(selected);handleEvents(selected,Chem.run(selected));AudioFX.bubble()}}
  function deleteSelected(){if(!selected)return;objects=objects.filter(o=>o!==selected);selected=null;updateInspector()}
  window.addEventListener('keydown',e=>{if(['INPUT','TEXTAREA'].includes(e.target.tagName))return;if(e.key.toLowerCase()==='q')rotateSelected(-.10);if(e.key.toLowerCase()==='e')rotateSelected(.10);if(e.code==='Space'){e.preventDefault();shakeSelected()}if(e.key==='Delete'||e.key==='Backspace')deleteSelected()});

  function updateInspector(){
    const title=document.getElementById('selectedTitle'),badge=document.getElementById('selectedBadge'),grid=document.getElementById('propertyGrid'),temp=document.getElementById('tempLabel'),tf=document.getElementById('tempFill'),ph=document.getElementById('phLabel'),pc=document.getElementById('phCursor'),list=document.getElementById('contentList'),visual=document.getElementById('selectedVisual');
    title.textContent=selectedName(selected);grid.innerHTML='';list.innerHTML='';
    if(!selected){badge.textContent='—';temp.textContent='—';tf.style.width='0%';ph.textContent='—';pc.style.left='50%';visual.classList.add('empty');visual.innerHTML='<div class="visual-glow"></div><span>Chọn một dụng cụ trên bàn</span>';grid.innerHTML='';list.innerHTML='';return}
    visual.classList.remove('empty');
    if(selected.kind==='vessel'){
      badge.textContent=selected.type.toUpperCase();const vol=Chem.amount(selected);temp.textContent=`${Math.round(selected.temperature)} °C`;tf.style.width=`${Chem.clamp((selected.temperature-20)/140*100,0,100)}%`;ph.textContent=selected.ph.toFixed(1);pc.style.left=`calc(${Chem.clamp(selected.ph/14*100,0,100)}% - 1px)`;
      grid.innerHTML=`<div class="property"><span>Thể tích mô phỏng</span><b>${vol.toFixed(2)} / ${selected.capacity}</b></div><div class="property"><span>Góc nghiêng</span><b>${Math.round(selected.angle*180/Math.PI)}°</b></div>`;
      Object.entries(selected.contents).filter(([,q])=>q>.002).forEach(([f,q])=>{const c=document.createElement('span');c.className='content-chip';c.textContent=`${f} · ${q.toFixed(2)}`;list.appendChild(c)});if(!list.children.length)list.innerHTML='<span class="content-chip">Bình đang trống</span>';
      visual.innerHTML='<div class="visual-glow"></div><span>Glassware · direct manipulation</span>';
    }else if(selected.kind==='bottle'){
      badge.textContent='REAGENT';temp.textContent='24 °C';tf.style.width='3%';ph.textContent=(metaForFormula(selected.formula).ph??7).toFixed(1);pc.style.left=`calc(${(metaForFormula(selected.formula).ph??7)/14*100}% - 1px)`;grid.innerHTML=`<div class="property"><span>Công thức</span><b>${selected.formula}</b></div><div class="property"><span>Còn lại</span><b>${selected.doses} liều</b></div>`;list.innerHTML=`<span class="content-chip">Kéo chai tới miệng bình để thêm chất</span>`;visual.innerHTML=`<div class="visual-glow"></div><span>${selected.label}</span>`;
    }else{badge.textContent='HEAT';temp.textContent=selected.on?'≈ 1200 °C':'Tắt';tf.style.width=selected.on?'95%':'0%';ph.textContent='—';pc.style.left='50%';grid.innerHTML=`<div class="property"><span>Trạng thái</span><b>${selected.on?'Đang cháy':'Đã tắt'}</b></div><div class="property"><span>Tương tác</span><b>Kéo dưới bình</b></div>`;list.innerHTML='<span class="content-chip">Click để bật/tắt · kéo để di chuyển</span>';visual.innerHTML='<div class="visual-glow"></div><span>Nguồn nhiệt Bunsen</span>'}
  }
  setInterval(()=>{if(selected?.kind==='vessel')updateInspector()},350);

  // Sidebar tabs
  document.querySelectorAll('.seg').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.seg').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));document.getElementById(`tab-${b.dataset.tab}`).classList.add('active')}));
  function renderChemicalList(){
    const q=document.getElementById('chemicalSearch').value.trim().toLowerCase(),box=document.getElementById('chemicalList');box.innerHTML='';DATA.compounds.filter(c=>(activeFilter==='all'||c.kind===activeFilter)&&(c.f.toLowerCase().includes(q)||c.name.toLowerCase().includes(q))).forEach(c=>{const b=document.createElement('button');b.className='chemical-item';b.innerHTML=`<i class="chemical-dot" style="background:${c.color};color:${c.color}"></i><b>${c.f}</b><span>${c.name}</span><small>${c.kind}</small>`;b.addEventListener('click',()=>{createBottle(c.f);AudioFX.click();showToast(`${c.f} đã được đặt lên bàn`,'Kéo chai tới dụng cụ để sử dụng.')});box.appendChild(b)})
  }
  document.getElementById('chemicalSearch').addEventListener('input',renderChemicalList);document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');activeFilter=b.dataset.kind;renderChemicalList()}));renderChemicalList();
  const demoBox=document.getElementById('demoList');DATA.demos.forEach(d=>{const b=document.createElement('button');b.className='demo-card';b.innerHTML=`<b>${d.title}</b><span>${d.desc}</span><em>${d.spawn.join(' + ')}</em>`;b.onclick=()=>addDemo(d.spawn);demoBox.appendChild(b)});
  document.querySelectorAll('.apparatus-card').forEach(b=>b.onclick=()=>{const t=b.dataset.tool;if(t==='burner')createBurner();else createVessel(t);AudioFX.click()});
  document.getElementById('addTube').onclick=()=>createVessel('testtube');document.getElementById('addBeaker').onclick=()=>createVessel('beaker');document.getElementById('addFlask').onclick=()=>createVessel('flask');document.getElementById('addBurner').onclick=()=>createBurner();document.getElementById('rotateLeft').onclick=()=>rotateSelected(-.12);document.getElementById('rotateRight').onclick=()=>rotateSelected(.12);document.getElementById('shakeBtn').onclick=shakeSelected;document.getElementById('deleteBtn').onclick=deleteSelected;
  document.getElementById('soundToggle').onclick=()=>{soundOn=!soundOn;document.getElementById('soundToggle').textContent=soundOn?'🔊':'🔇'};
  document.getElementById('resetLab').onclick=()=>resetLab();

  // Periodic table
  const modal=document.getElementById('periodicModal'),table=document.getElementById('periodicTable'),detail=document.getElementById('elementDetail');
  function categoryName(c){return ({alkali:'Kim loại kiềm',alkaline:'Kim loại kiềm thổ',transition:'Kim loại chuyển tiếp',post:'Kim loại hậu chuyển tiếp',metalloid:'Á kim',nonmetal:'Phi kim',halogen:'Halogen',noble:'Khí hiếm',lanth:'Họ Lantan',act:'Họ Actini'})[c]||c}
  function renderPeriodic(){table.innerHTML='';const q=document.getElementById('elementSearch').value.trim().toLowerCase();DATA.elements.forEach(el=>{const [z,s,n,row,col,cat]=el,b=document.createElement('button');b.className=`element-cell ${cat}${selectedElement===el?' selected':''}`;b.style.gridRow=row;b.style.gridColumn=col;b.style.opacity=!q||String(z)===q||s.toLowerCase().includes(q)||n.toLowerCase().includes(q)?'1':'.14';b.innerHTML=`<span class="z">${z}</span><div class="sym">${s}</div><div class="nm">${n}</div>`;b.onclick=()=>{selectedElement=el;renderPeriodic();renderElementDetail()};table.appendChild(b)})}
  function renderElementDetail(){const [z,s,n,, ,cat]=selectedElement;detail.querySelector('.element-big').textContent=s;detail.querySelector('b').textContent=n;detail.querySelector('span').textContent=`Nguyên tử số ${z} · ${categoryName(cat)}`}
  document.getElementById('elementSearch').addEventListener('input',renderPeriodic);document.getElementById('openPeriodic').onclick=()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');renderPeriodic();renderElementDetail()};document.getElementById('closePeriodic').onclick=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')};modal.addEventListener('click',e=>{if(e.target===modal)document.getElementById('closePeriodic').click()});document.getElementById('spawnElement').onclick=()=>{createBottle(selectedElement[1]);modal.classList.remove('open');showToast(`${selectedElement[1]} · ${selectedElement[2]}`,'Mẫu nguyên tố đã được đặt lên bàn lab.')};renderPeriodic();renderElementDetail();

  function resetLab(){objects=[];particles=[];selected=null;idSeq=1;createVessel('beaker',W*.48,H*.61);createVessel('testtube',W*.61,H*.62);createBurner(W*.72,H*.72);createBottle('HCl',W*.20,H*.67);createBottle('NaOH',W*.29,H*.67);selected=null;document.getElementById('latestReaction').className='reaction-card idle';document.getElementById('latestReaction').innerHTML='<b>Chưa có phản ứng</b><span>Hãy trộn hai chất có khả năng phản ứng.</span>';document.getElementById('reactionLog').innerHTML='';updateInspector();showToast('Lab đã sẵn sàng','Kéo hóa chất, dụng cụ và bắt đầu thử nghiệm.')}
  resetLab();
})();
