(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.imageSmoothingEnabled = false;
  const W = canvas.width, H = canvas.height;
  const FLOOR = 184;

  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
  const rand = (a,b)=>a+Math.random()*(b-a);
  const chance = p => Math.random() < p;
  const nowStamp = () => `D${Math.floor(world.time/24)+1} ${String(Math.floor(world.time%24)).padStart(2,'0')}:00`;

  const palette = {
    sky:'#08191f', water:'#124350', water2:'#0e3643', glass:'#8dc3bd', sand:'#b99b5a', soil:'#70513a', stone:'#53666b',
    plant:'#4eaa69', plant2:'#76c878', algae:'#769b49', fish:'#f0c566', fish2:'#e58a65', shrimp:'#ef938a', snail:'#bd9870',
    bubble:'#b9ebe0', waste:'#725644', light:'#eed77f', dead:'#8c7f71'
  };

  const items = [
    {id:'water', name:'Nước', icon:'💧', cost:'nền sống', key:'1'},
    {id:'sand', name:'Cát', icon:'▧', cost:'giữ rễ', key:'2'},
    {id:'soil', name:'Đất nền', icon:'▰', cost:'+ dinh dưỡng', key:'3'},
    {id:'stone', name:'Đá', icon:'◆', cost:'trú ẩn', key:'4'},
    {id:'plant', name:'Rong', icon:'♒', cost:'+ O₂ / hấp N', key:'5'},
    {id:'algae', name:'Tảo', icon:'✦', cost:'thức ăn nền', key:'6'},
    {id:'fish', name:'Cá', icon:'><>', cost:'ăn O₂ / thải', key:'7'},
    {id:'shrimp', name:'Tép', icon:'⌁', cost:'ăn vụn', key:'8'},
    {id:'snail', name:'Ốc', icon:'@', cost:'dọn tảo', key:'9'},
    {id:'food', name:'Thức ăn', icon:'·:·', cost:'dễ dư thừa', key:'0'},
    {id:'aerator', name:'Sủi khí', icon:'○°', cost:'+ O₂ / - CO₂', key:'Q'},
    {id:'heater', name:'Sưởi', icon:'≈', cost:'ổn định nhiệt', key:'W'},
    {id:'lamp', name:'Đèn', icon:'☼', cost:'quang hợp', key:'E'},
    {id:'erase', name:'Xóa', icon:'⌫', cost:'dọn vật thể', key:'X'}
  ];

  const world = {
    time: 8, speed: 1, paused: false, selected:'water', stability: 0,
    env:{ oxygen:62, co2:35, ammonia:8, nitrate:18, temp:25, ph:7.1, clarity:82 },
    terrain:[], entities:[], particles:[], devices:{aerator:0,heater:0,lamp:0},
    lastLog:-99, simAccumulator:0, drawTicks:0
  };

  const terrainCols = 160;
  for(let i=0;i<terrainCols;i++) world.terrain[i] = {sand: rand(4,8), soil:0, stone:0};

  function addEntity(type,x,y, extra={}){
    const base = {type,x,y,vx:rand(-8,8),vy:rand(-2,2),age:0,energy:rand(55,85),health:100,dir:chance(.5)?1:-1,...extra};
    if(type==='plant') Object.assign(base,{height:rand(8,18),phase:rand(0,6.28)});
    if(type==='algae') Object.assign(base,{size:rand(1,2)});
    if(type==='fish') Object.assign(base,{size:chance(.3)?2:1,hunger:rand(10,35),species:chance(.5)?0:1});
    if(type==='shrimp') Object.assign(base,{hunger:rand(5,25)});
    if(type==='snail') Object.assign(base,{vx:chance(.5)?2:-2,hunger:rand(5,25)});
    if(type==='food') Object.assign(base,{vy:5,life:100});
    if(type==='waste') Object.assign(base,{vy:3,life:100});
    world.entities.push(base);
  }

  function floorAt(x){
    const i=clamp(Math.floor(x/2),0,terrainCols-1), t=world.terrain[i];
    return FLOOR - t.sand - t.soil - t.stone;
  }

  function seedWorld(){
    world.entities.length=0; world.devices={aerator:0,heater:0,lamp:0};
    for(let i=0;i<terrainCols;i++) world.terrain[i]={sand:rand(4,8),soil:(i>30&&i<130?rand(0,4):0),stone:0};
    for(let i=0;i<11;i++) addEntity('plant',rand(45,275),floorAt(rand(45,275))-2);
    for(let i=0;i<18;i++) addEntity('algae',rand(30,290),rand(115,176));
    for(let i=0;i<5;i++) addEntity('fish',rand(70,250),rand(65,145));
    for(let i=0;i<7;i++) addEntity('shrimp',rand(45,280),rand(145,176));
    for(let i=0;i<4;i++) addEntity('snail',rand(40,280),rand(145,177));
    Object.assign(world.env,{oxygen:68,co2:32,ammonia:5,nitrate:20,temp:25,ph:7.1,clarity:88});
    world.time=8; world.stability=65; world.lastLog=-99;
    logs.length=0;
    log('Hệ sinh thái khởi động. Rong đã bén rễ và đàn cá đang thăm dò hồ.','good');
  }

  const logs=[];
  function log(text,type=''){
    logs.unshift({time:nowStamp(),text,type});
    if(logs.length>28) logs.pop();
    renderLog();
  }

  function renderToolbar(){
    const el=document.getElementById('toolbar');
    el.innerHTML=items.map(it=>`<button class="tool ${world.selected===it.id?'active':''}" data-id="${it.id}"><span class="kbd">${it.key}</span><span class="icon">${it.icon}</span>${it.name}<span class="cost">${it.cost}</span></button>`).join('');
    el.querySelectorAll('.tool').forEach(b=>b.onclick=()=>{world.selected=b.dataset.id;renderToolbar();toast('Đã chọn: '+items.find(i=>i.id===world.selected).name)});
  }

  const meterDefs=[
    ['oxygen','Oxy','%'],['co2','CO₂','%'],['ammonia','Amoniac','ppm'],['nitrate','Nitrat','ppm'],['temp','Nhiệt độ','°C'],['ph','pH',''],['clarity','Độ trong','%']
  ];
  function meterRange(k,v){
    if(k==='temp') return clamp((v-15)/18*100,0,100);
    if(k==='ph') return clamp((v-5)/4*100,0,100);
    if(k==='ammonia') return clamp(v/35*100,0,100);
    if(k==='nitrate') return clamp(v/80*100,0,100);
    return clamp(v,0,100);
  }
  function renderMeters(){
    document.getElementById('meters').innerHTML=meterDefs.map(([k,n,u])=>{
      const v=world.env[k], pct=meterRange(k,v);
      return `<div class="meter-row"><div class="meter-label">${n}</div><div class="meter-track"><div class="meter-fill" style="width:${pct}%"></div></div><div class="meter-value">${v.toFixed(k==='ph'?1:0)}${u}</div></div>`;
    }).join('');
  }

  function count(type){return world.entities.filter(e=>e.type===type&&e.health>0).length}
  function renderPopulation(){
    const rows=[['Cá','fish'],['Tép','shrimp'],['Ốc','snail'],['Rong','plant'],['Tảo','algae'],['Thức ăn dư','food']];
    document.getElementById('population').innerHTML=rows.map(([n,t])=>`<div class="pop-item"><span>${n}</span><b>${count(t)}</b></div>`).join('');
  }
  function renderLog(){
    document.getElementById('log').innerHTML=logs.map(l=>`<div class="log-entry ${l.type}"><b>${l.time}</b> · ${l.text}</div>`).join('');
  }

  function assess(){
    const e=world.env;
    const scores=[
      100-Math.abs(e.oxygen-70)*2.2,
      100-Math.max(0,e.ammonia-4)*5,
      100-Math.max(0,e.nitrate-30)*1.8,
      100-Math.abs(e.temp-25)*8,
      100-Math.abs(e.ph-7.1)*24,
      e.clarity
    ];
    world.stability=clamp(scores.reduce((a,b)=>a+clamp(b,0,100),0)/scores.length,0,100);
    let msg='';
    if(e.oxygen<35) msg='<strong>Thiếu oxy.</strong> Cá sẽ nhanh kiệt sức. Thêm rong, sủi khí hoặc giảm mật độ sinh vật.';
    else if(e.ammonia>15) msg='<strong>Độc tố tăng.</strong> Thức ăn/chất thải đang vượt khả năng xử lý. Giảm cho ăn và tăng cây.';
    else if(e.temp<21||e.temp>29) msg='<strong>Nhiệt độ lệch.</strong> Chuyển hóa sinh vật bị stress; dùng sưởi nếu quá lạnh và giảm đèn nếu quá nóng.';
    else if(e.nitrate>55) msg='<strong>Nitrat tích tụ.</strong> Cây chưa hấp thụ kịp sản phẩm cuối của chu trình nitơ.';
    else if(count('algae')>55) msg='<strong>Tảo đang thắng thế.</strong> Ánh sáng/dinh dưỡng đang dư; ốc và tép có thể giúp kiềm chế.';
    else if(count('fish')===0) msg='<strong>Hệ đang yên nhưng thiếu động vật.</strong> Hãy ổn định oxy trước rồi thả cá.';
    else msg='<strong>Hệ đang khá cân bằng.</strong> Quan sát vài ngày mô phỏng trước khi thêm sinh vật mới.';
    document.getElementById('analysisText').innerHTML=msg;
    document.getElementById('balanceFill').style.width=world.stability+'%';
    document.getElementById('scoreLabel').textContent=`Điểm ổn định ${Math.round(world.stability)}%`;
    const dot=document.getElementById('healthDot'), text=document.getElementById('healthText');
    if(world.stability>72){dot.style.background='#7fe1a4';text.textContent='Đang cân bằng'}
    else if(world.stability>45){dot.style.background='#e4c76a';text.textContent='Đang dao động'}
    else{dot.style.background='#ed7b72';text.textContent='Hệ đang nguy hiểm'}
  }

  function updateEnvironment(dt){
    const e=world.env;
    const plants=count('plant'), algae=count('algae'), fish=count('fish'), shrimp=count('shrimp'), snail=count('snail');
    const dayLight = Math.max(0,Math.sin((world.time-6)/24*Math.PI*2));
    const artificial = world.devices.lamp ? 0.65 : 0;
    const light=clamp(dayLight+artificial,0,1.35);
    const living=fish*1.0+shrimp*.35+snail*.18;
    const photos=(plants*.17+algae*.035)*light;
    e.oxygen += (photos - living*.09 - .015 + world.devices.aerator*.38)*dt;
    e.co2 += (living*.07 - photos*.65 - world.devices.aerator*.16)*dt;
    const waste=count('waste') + count('food')*.5;
    e.ammonia += (living*.018 + waste*.016 - (plants*.006+algae*.002))*dt;
    const bacteria=Math.max(0,(e.oxygen/100))*0.045;
    const converted=Math.min(e.ammonia,bacteria*dt*3.5);
    e.ammonia -= converted;
    e.nitrate += converted*.82 - plants*.006*light*dt;
    const target=world.devices.heater?25.5:22.8 + dayLight*3.3 + world.devices.lamp*.6;
    e.temp += (target-e.temp)*.013*dt;
    e.ph += ((7.2 - e.ph) - e.co2*.002 + plants*.0008)*.01*dt;
    e.clarity += (93-e.clarity)*.003*dt - (count('food')*.02+waste*.006+algae*.003)*dt;
    for(const k of ['oxygen','co2','ammonia','nitrate','clarity']) e[k]=clamp(e[k],0,100);
    e.temp=clamp(e.temp,15,34);e.ph=clamp(e.ph,5.2,8.8);
  }

  function nearest(type,x,y,r){
    let best=null, bd=r*r;
    for(const o of world.entities){if(o.type!==type||o.health<=0)continue; const d=(o.x-x)**2+(o.y-y)**2;if(d<bd){bd=d;best=o}}
    return best;
  }

  function updateEntities(dt){
    const e=world.env;
    const daylight=Math.max(0,Math.sin((world.time-6)/24*Math.PI*2));
    for(const a of world.entities){
      a.age+=dt/60;
      if(a.health<=0) continue;
      if(a.type==='plant'){
        a.phase+=dt*.03;
        const nutrition=clamp((e.nitrate+15)/45,0.2,1.5);
        if((daylight||world.devices.lamp) && chance(.0008*dt*nutrition) && world.entities.length<300){
          addEntity('plant',clamp(a.x+rand(-9,9),10,W-10),floorAt(a.x)-1,{height:5});
        }
        if(e.nitrate<2) a.health-=dt*.03;
      }
      else if(a.type==='algae'){
        if((daylight||world.devices.lamp)&&e.nitrate>10&&chance(.0015*dt)&&count('algae')<90) addEntity('algae',clamp(a.x+rand(-8,8),8,W-8),clamp(a.y+rand(-7,7),50,FLOOR-3));
        if(e.nitrate<1) a.health-=dt*.02;
      }
      else if(a.type==='fish'){
        a.hunger+=dt*.07; a.energy-=dt*.012;
        let target=null;
        if(a.hunger>35) target=nearest('food',a.x,a.y,65)||nearest('algae',a.x,a.y,40);
        if(target){const dx=target.x-a.x,dy=target.y-a.y,d=Math.hypot(dx,dy)||1;a.vx+=dx/d*.9*dt;a.vy+=dy/d*.5*dt;if(d<5){target.health=0;a.hunger=Math.max(0,a.hunger-42);a.energy=clamp(a.energy+25,0,100)}}
        else {a.vx+=rand(-.25,.25)*dt;a.vy+=rand(-.12,.12)*dt;}
        const stress=(e.oxygen<32?(.5+(32-e.oxygen)*.03):0)+(e.ammonia>12?(e.ammonia-12)*.025:0)+(Math.abs(e.temp-25)>5?.25:0);
        a.health-=stress*dt*.16;
        a.energy-=stress*dt*.05;
        if(a.hunger>95)a.health-=dt*.09;
        if(chance(.00065*dt)) addEntity('waste',a.x,a.y+2);
        if(a.health>72&&a.hunger<45&&world.stability>72&&count('fish')<18&&chance(.00008*dt)) {addEntity('fish',a.x+3,a.y+2,{size:1,health:78,energy:60,hunger:20});log('Một cá con xuất hiện — điều kiện sinh sản đang tốt.','good')}
        const max=18;a.vx=clamp(a.vx,-max,max);a.vy=clamp(a.vy,-9,9);a.x+=a.vx*dt*.08;a.y+=a.vy*dt*.08;a.vx*=.985;a.vy*=.97;
        if(a.x<8||a.x>W-8){a.vx*=-1;a.dir*=-1;a.x=clamp(a.x,8,W-8)}
        const fy=floorAt(a.x)-5;if(a.y<25){a.y=25;a.vy=Math.abs(a.vy)}if(a.y>fy){a.y=fy;a.vy=-Math.abs(a.vy)*.6}
        if(Math.abs(a.vx)>.5)a.dir=Math.sign(a.vx);
      }
      else if(a.type==='shrimp'){
        a.hunger+=dt*.045; const t=nearest('waste',a.x,a.y,38)||nearest('food',a.x,a.y,26)||nearest('algae',a.x,a.y,22);
        if(t){a.x+=(t.x-a.x)*.006*dt;a.y+=(t.y-a.y)*.006*dt;if(Math.hypot(t.x-a.x,t.y-a.y)<3){t.health=0;a.hunger=Math.max(0,a.hunger-35)}}
        else a.x=clamp(a.x+rand(-.25,.25)*dt,8,W-8);
        a.y=Math.min(floorAt(a.x)-1,a.y+dt*.25);if(e.oxygen<24)a.health-=dt*.08;
      }
      else if(a.type==='snail'){
        a.hunger+=dt*.025;const t=nearest('algae',a.x,a.y,25);if(t){a.x+=(t.x-a.x)*.0028*dt;a.y+=(t.y-a.y)*.0028*dt;if(Math.hypot(t.x-a.x,t.y-a.y)<3){t.health=0;a.hunger=Math.max(0,a.hunger-25)}}else a.x+=a.vx*dt*.018;
        if(a.x<8||a.x>W-8)a.vx*=-1;a.x=clamp(a.x,8,W-8);a.y=Math.min(floorAt(a.x)-1,a.y+dt*.2);if(e.oxygen<18)a.health-=dt*.04;
      }
      else if(a.type==='food'||a.type==='waste'){
        a.life-=dt*.03;a.y+=a.vy*dt*.03;a.vy=Math.min(a.vy+.02*dt,6);const f=floorAt(a.x)-1;if(a.y>f){a.y=f;a.vy=0}if(a.life<=0){a.health=0;world.env.ammonia+=a.type==='food'?1.4:.7}
      }
      if(a.health<=0 && ['fish','shrimp','snail'].includes(a.type)){addEntity('waste',a.x,a.y);addEntity('waste',a.x+2,a.y);log(`${a.type==='fish'?'Một con cá':a.type==='shrimp'?'Một con tép':'Một con ốc'} đã chết. Hãy kiểm tra oxy, độc tố và thức ăn.`,'alert')}
    }
    world.entities=world.entities.filter(a=>a.health>0 || a.age<.1);
  }

  function tick(dt){
    if(world.paused)return;
    dt*=world.speed;
    world.time+=dt/18;
    updateEnvironment(dt); updateEntities(dt);
    if(world.time-world.lastLog>7){
      world.lastLog=world.time;
      if(world.env.oxygen<35) log('Oxy tụt thấp. Sinh vật bơi chậm và lên gần mặt nước.','alert');
      else if(world.env.ammonia>14) log('Amoniac đang tích tụ vì chất thải phân hủy nhanh hơn hệ xử lý.','alert');
      else if(world.stability>78) log('Hồ đang tự cân bằng tốt. Đây là lúc phù hợp để quan sát thay vì thêm đồ.','good');
    }
  }

  function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.floor(x),Math.floor(y),Math.ceil(w),Math.ceil(h))}
  function draw(){
    world.drawTicks++;
    const hour=world.time%24;const daylight=Math.max(0,Math.sin((hour-6)/24*Math.PI*2));
    rect(0,0,W,H,palette.sky);
    // outside glow
    const glow=Math.floor(12+daylight*26);ctx.fillStyle=`rgb(${9+glow},${22+glow},${28+glow})`;ctx.fillRect(0,0,W,42);
    // glass tank
    rect(8,18,W-16,FLOOR-12,'#0a2a34');
    for(let y=24;y<FLOOR;y+=8){ctx.fillStyle=(Math.floor(y/8)%2?'#103e4a':'#0d3844');ctx.fillRect(10,y,W-20,8)}
    if(daylight>0||world.devices.lamp){ctx.globalAlpha=.055+.05*daylight;ctx.fillStyle=palette.light;for(let x=28;x<W-20;x+=44)ctx.fillRect(x,25,18,FLOOR-30);ctx.globalAlpha=1}
    // water motes
    ctx.fillStyle='#287184';for(let i=0;i<24;i++){let x=(i*47+world.drawTicks*.08*(i%3+1))%(W-24)+12;let y=30+(i*31)%140;ctx.fillRect(x|0,y,1,1)}
    // terrain columns
    for(let i=0;i<terrainCols;i++){const x=i*2,t=world.terrain[i];let y=FLOOR; if(t.sand){rect(x,y-t.sand,2,t.sand,palette.sand);y-=t.sand} if(t.soil){rect(x,y-t.soil,2,t.soil,palette.soil);y-=t.soil} if(t.stone){rect(x,y-t.stone,2,t.stone,palette.stone)}}
    // devices
    if(world.devices.aerator){rect(24,FLOOR-8,11,5,'#78858a');for(let i=0;i<10;i++){const yy=FLOOR-12-((world.drawTicks*.35+i*17)%120);rect(28+(i%3)*2,yy,1,2,palette.bubble)}}
    if(world.devices.heater){rect(W-25,72,4,88,'#9c6d5a');rect(W-24,82,2,58,'#dc8b64')}
    if(world.devices.lamp){rect(128,9,64,5,'#c7aa5f');rect(146,14,28,2,'#f2da7c')}

    const ents=[...world.entities].sort((a,b)=>a.y-b.y);
    for(const a of ents){
      if(a.health<=0)continue; const x=a.x|0,y=a.y|0;
      if(a.type==='plant'){
        ctx.fillStyle=palette.plant2;const sway=Math.round(Math.sin(a.phase+world.drawTicks*.025)*2);for(let h=0;h<a.height;h+=3){ctx.fillRect(x+sway*Math.sin(h*.3),y-h,2,3);if(h%6===0)ctx.fillRect(x-2+sway,y-h,2,1)}
      } else if(a.type==='algae'){rect(x-1,y-1,a.size+1,a.size,palette.algae)}
      else if(a.type==='fish'){
        ctx.save();ctx.translate(x,y);ctx.scale(a.dir,1);ctx.fillStyle=a.species?palette.fish2:palette.fish;ctx.fillRect(-4,-2,7,4);ctx.fillRect(3,-1,2,2);ctx.fillStyle='#0b1d24';ctx.fillRect(1,-1,1,1);ctx.fillStyle=a.species?'#b66759':'#c79d49';ctx.fillRect(-6,-1,2,2);ctx.restore();
      } else if(a.type==='shrimp'){ctx.fillStyle=palette.shrimp;ctx.fillRect(x-2,y-1,4,2);ctx.fillRect(x+2,y-2,1,2);ctx.fillRect(x-3,y,1,1)}
      else if(a.type==='snail'){ctx.fillStyle=palette.snail;ctx.fillRect(x-1,y-2,3,2);ctx.fillStyle='#785d45';ctx.fillRect(x,y-2,1,1);ctx.fillStyle='#c9ad80';ctx.fillRect(x-2,y,5,1)}
      else if(a.type==='food'){ctx.fillStyle='#d9a25f';ctx.fillRect(x,y,1,1);if(a.life>70)ctx.fillRect(x+1,y-1,1,1)}
      else if(a.type==='waste'){ctx.fillStyle=palette.waste;ctx.fillRect(x,y,2,1)}
    }
    // glass highlights and border
    ctx.globalAlpha=.28;rect(12,25,2,FLOOR-35,palette.glass);rect(W-14,25,1,FLOOR-35,palette.glass);ctx.globalAlpha=1;
    rect(6,16,W-12,2,'#6f9698');rect(6,FLOOR,W-12,3,'#31464a');rect(6,16,3,FLOOR-13,'#526f73');rect(W-9,16,3,FLOOR-13,'#526f73');
    // surface shimmer
    for(let x=12;x<W-12;x+=9){ctx.fillStyle=(x/9+world.drawTicks/18|0)%2?'#7db5b4':'#4e8e92';ctx.fillRect(x,24,5,1)}
  }

  let toastTimer;function toast(t){const el=document.getElementById('toast');el.textContent=t;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),1300)}

  function placeAt(clientX,clientY,erase=false){
    const r=canvas.getBoundingClientRect(), x=(clientX-r.left)/r.width*W, y=(clientY-r.top)/r.height*H;
    const type=erase?'erase':world.selected;
    if(type==='erase'){
      let best=-1,bd=90;world.entities.forEach((a,i)=>{const d=(a.x-x)**2+(a.y-y)**2;if(d<bd){bd=d;best=i}});if(best>=0)world.entities.splice(best,1);return;
    }
    if(['sand','soil','stone'].includes(type)){
      const center=Math.floor(x/2);for(let di=-2;di<=2;di++){const i=clamp(center+di,0,terrainCols-1),t=world.terrain[i],add=Math.max(0,3-Math.abs(di));t[type]=clamp(t[type]+add,0,type==='stone'?24:30)}return;
    }
    if(type==='water'){world.env.clarity=clamp(world.env.clarity+4,0,100);world.env.ammonia*=.92;world.env.nitrate*=.94;toast('Đã thêm nước sạch · pha loãng độc tố');return}
    if(['aerator','heater','lamp'].includes(type)){world.devices[type]=world.devices[type]?0:1;toast(`${items.find(i=>i.id===type).name}: ${world.devices[type]?'BẬT':'TẮT'}`);return}
    const fy=floorAt(x)-2;
    if(type==='plant') addEntity(type,x,Math.min(y,fy));
    else if(type==='algae') addEntity(type,x,clamp(y,35,fy));
    else if(type==='fish') addEntity(type,x,clamp(y,35,fy-8));
    else if(type==='shrimp'||type==='snail') addEntity(type,x,Math.min(y,fy));
    else if(type==='food'){for(let i=0;i<4;i++)addEntity('food',x+rand(-5,5),clamp(y+rand(-4,4),28,fy));}
  }

  let dragging=false,lastPlace=0;
  canvas.addEventListener('pointerdown',e=>{dragging=true;canvas.setPointerCapture(e.pointerId);placeAt(e.clientX,e.clientY,e.button===2);lastPlace=performance.now()});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;if(performance.now()-lastPlace>75){placeAt(e.clientX,e.clientY,false);lastPlace=performance.now()}});
  canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointercancel',()=>dragging=false);canvas.addEventListener('contextmenu',e=>{e.preventDefault();placeAt(e.clientX,e.clientY,true)});

  document.addEventListener('keydown',e=>{const it=items.find(i=>i.key.toLowerCase()===e.key.toLowerCase());if(it){world.selected=it.id;renderToolbar()}});
  document.getElementById('pauseBtn').onclick=()=>{world.paused=!world.paused;document.getElementById('pauseBtn').textContent=world.paused?'▶ Tiếp tục':'⏸ Tạm dừng'};
  document.getElementById('speedBtn').onclick=()=>{world.speed=world.speed===1?3:world.speed===3?8:1;document.getElementById('speedBtn').textContent='▶ x'+world.speed;toast('Tốc độ mô phỏng x'+world.speed)};
  document.getElementById('resetBtn').onclick=()=>{if(confirm('Làm lại toàn bộ hệ sinh thái?'))seedWorld()};
  document.getElementById('saveBtn').onclick=()=>{localStorage.setItem('aquapixel-save',JSON.stringify({world:{time:world.time,env:world.env,terrain:world.terrain,entities:world.entities,devices:world.devices}}));toast('Đã lưu hồ vào trình duyệt 💾')};

  function load(){
    const raw=localStorage.getItem('aquapixel-save');if(!raw)return false;
    try{const s=JSON.parse(raw).world;world.time=s.time;world.env=s.env;world.terrain=s.terrain;world.entities=s.entities;world.devices=s.devices||{aerator:0,heater:0,lamp:0};log('Đã mở lại hồ từ lần lưu trước.','good');return true}catch{return false}
  }

  let last=performance.now(), uiTimer=0;
  function loop(t){
    const dt=Math.min(2.5,(t-last)/16.6667);last=t;tick(dt);draw();uiTimer+=dt;
    if(uiTimer>12){uiTimer=0;assess();renderMeters();renderPopulation();document.getElementById('dayLabel').textContent=`Ngày ${Math.floor(world.time/24)+1} · ${String(Math.floor(world.time%24)).padStart(2,'0')}:00`}
    requestAnimationFrame(loop);
  }

  renderToolbar();
  if(!load()) seedWorld();
  renderMeters();renderPopulation();renderLog();assess();
  requestAnimationFrame(loop);
})();
