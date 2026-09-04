(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d', { alpha: false });
  ctx.imageSmoothingEnabled = false;

  const W = canvas.width;
  const H = canvas.height;
  const WATER_TOP = 26;
  const FLOOR = 220;
  const TERRAIN_COLS = W / 2;
  const SAVE_KEY = 'aquapixel-v2-save';

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rand = (a, b) => a + Math.random() * (b - a);
  const choice = arr => arr[Math.floor(Math.random() * arr.length)];
  const chance = p => Math.random() < p;
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const hash = s => {
    let h = 2166136261;
    for (let i = 0; i < String(s).length; i++) h = Math.imul(h ^ String(s).charCodeAt(i), 16777619);
    return h >>> 0;
  };

  const palette = {
    sky: '#07161d', skyNight: '#050b13', water: '#0d3541', water2: '#0a2c37', waterNight: '#071c29',
    glass: '#8fc1ba', sand: '#b99a58', soil: '#6f5038', stone: '#526368', plant: '#61b776', plant2: '#7bc57b',
    algae: '#799849', shrimp: '#ef938a', snail: '#c1a079', bubble: '#bcece2', waste: '#765745', food: '#dca75f',
    light: '#efd779', gold: '#e5c66c'
  };

  const fishSpecies = {
    guppy: {name:'Guppy', icon:'><>', base:'#e7c25e', idealTemp:25, social:0.75, rarity:'Phổ biến'},
    medaka:{name:'Medaka', icon:'><>', base:'#d98968', idealTemp:24, social:0.6, rarity:'Phổ biến'},
    tetra: {name:'Neon Tetra', icon:'><>', base:'#67b8d7', idealTemp:25, social:0.9, rarity:'Không thường'},
    rasbora:{name:'Chili Rasbora', icon:'><>', base:'#e26b5f', idealTemp:26, social:0.85, rarity:'Hiếm'}
  };

  const plantSpecies = {
    elodea:{name:'Rong đuôi chó', icon:'♒', rarity:'Phổ biến'},
    java:{name:'Dương xỉ Java', icon:'♜', rarity:'Phổ biến'},
    crypt:{name:'Cryptocoryne', icon:'♨', rarity:'Không thường'},
    star:{name:'Rong Sao', icon:'✣', rarity:'Hiếm'}
  };

  const colors = {
    amber:'#e8c561', coral:'#e78269', sky:'#70b8cc', white:'#d9ded1', ink:'#54636c', violet:'#a982c3'
  };
  const colorNames = {amber:'Hổ phách',coral:'San hô',sky:'Xanh trời',white:'Trắng',ink:'Mực',violet:'Tím'};
  const patterns = ['solid','stripe','spots','koi'];
  const patternNames = {solid:'Trơn',stripe:'Sọc',spots:'Đốm',koi:'Koi'};
  const mutations = {
    galaxy:{name:'Galaxy', rarity:'0.2%', tint:'#9b87dd'},
    albino:{name:'Albino', rarity:'0.2%', tint:'#f0d6c8'},
    gold:{name:'Gold', rarity:'0.2%', tint:'#f0d063'},
    glass:{name:'Glass', rarity:'0.2%', tint:'#b9d6d2'},
    neon:{name:'Neon', rarity:'0.2%', tint:'#64d7cf'}
  };

  const names = ['Mochi','Bơ','Bắp','Cam','Sữa','Mây','Mầm','Nori','Đậu','Mơ','Mận','Bánh','Cốm','Tép','Miu','Lá','Mưa','Nắng','Kẹo','Gạo','Dừa','Mật','Rêu','Bông'];
  const personalities = ['Nhút nhát','Tò mò','Hòa đồng','Ham ăn','Điềm tĩnh','Hiếu động'];

  const items = [
    {id:'water',name:'Nước',icon:'💧',key:'1'}, {id:'sand',name:'Cát',icon:'▧',key:'2'}, {id:'soil',name:'Đất',icon:'▰',key:'3'},
    {id:'stone',name:'Đá',icon:'◆',key:'4'}, {id:'plant',name:'Cây',icon:'♒',key:'5'}, {id:'algae',name:'Tảo',icon:'✦',key:'6'},
    {id:'fish',name:'Cá',icon:'><>',key:'7'}, {id:'shrimp',name:'Tép',icon:'⌁',key:'8'}, {id:'snail',name:'Ốc',icon:'@',key:'9'},
    {id:'food',name:'Thức ăn',icon:'·:·',key:'0'}, {id:'aerator',name:'Sủi khí',icon:'○°',key:'Q'}, {id:'filter',name:'Lọc',icon:'↻',key:'R'},
    {id:'heater',name:'Sưởi',icon:'≈',key:'W'}, {id:'lamp',name:'Đèn',icon:'☼',key:'E'}, {id:'erase',name:'Xóa',icon:'⌫',key:'X'}
  ];

  const world = {
    version:2, time:8, speed:1, paused:false, selected:'water', stability:70, nextId:1,
    env:{oxygen:68,co2:31,ammonia:4,nitrate:18,temp:25,ph:7.1,clarity:90},
    terrain:[], entities:[], devices:{aerator:0,heater:0,lamp:0,filter:1},
    event:null, nextEventAt:28, overlay:null, drawTicks:0, cursor:{x:190,y:100,inside:false},
    discovered:new Set(), selectedFishId:null, lastStoryAt:-100, lastHour:-1, births:0, deaths:0
  };
  const logs = [];

  function nowStamp(){
    return `D${Math.floor(world.time/24)+1} ${String(Math.floor(world.time%24)).padStart(2,'0')}:00`;
  }

  function log(text, type=''){
    logs.unshift({time:nowStamp(), text, type});
    if (logs.length > 80) logs.length = 80;
    renderJournal();
  }

  function discover(key, text){
    if (world.discovered.has(key)) return;
    world.discovered.add(key);
    if (text) log(`Aquadex: ${text}`, 'rare');
    renderAquadex();
  }

  function uniqueName(){
    const used = new Set(world.entities.filter(e=>e.type==='fish').map(e=>e.name));
    const base = choice(names);
    if (!used.has(base)) return base;
    let i = 2;
    while (used.has(`${base} ${i}`)) i++;
    return `${base} ${i}`;
  }

  function makeGenes(parents=null){
    let color = choice(Object.keys(colors));
    let pattern = choice(patterns);
    let mutation = null;
    if (parents) {
      color = chance(.5) ? parents[0].genes.color : parents[1].genes.color;
      pattern = chance(.5) ? parents[0].genes.pattern : parents[1].genes.pattern;
      if (chance(.002)) mutation = choice(Object.keys(mutations));
    } else if (chance(.012)) mutation = choice(Object.keys(mutations));
    return {color,pattern,mutation};
  }

  function speciesForNewFish(){
    const r = Math.random();
    if (r < .57) return 'guppy';
    if (r < .89) return 'medaka';
    if (r < .98) return 'tetra';
    return 'rasbora';
  }

  function addEntity(type, x, y, extra={}){
    const base = {id:world.nextId++,type,x,y,vx:rand(-8,8),vy:rand(-2,2),age:0,health:100,dir:chance(.5)?1:-1,...extra};
    if(type==='plant'){
      const species = extra.species || (chance(.08)?'crypt':choice(['elodea','java']));
      Object.assign(base,{species,height:extra.height||rand(8,15),maxHeight:rand(22,38),phase:rand(0,6.28),branches:1,growth:0});
      discover(`plant:${species}`, plantSpecies[species].name);
    }
    if(type==='algae') Object.assign(base,{size:rand(1,2),life:999});
    if(type==='fish'){
      const species = extra.species || speciesForNewFish();
      const genes = extra.genes || makeGenes(extra.parents || null);
      Object.assign(base,{
        species, genes, name:extra.name||uniqueName(), gender:extra.gender||choice(['♂','♀']), personality:extra.personality||choice(personalities),
        hunger:extra.hunger ?? rand(8,28), energy:extra.energy ?? rand(65,90), mood:'Bình yên', bornAt:extra.bornAt ?? world.time,
        bondId:extra.bondId||null, mateId:extra.mateId||null, breedCooldown:extra.breedCooldown ?? world.time+rand(18,40), size:extra.size||1,
        juvenile:extra.juvenile||false, generation:extra.generation||1, favoriteSpot:{x:rand(55,W-55), y:rand(65,160)}
      });
      discover(`fish:${species}`, fishSpecies[species].name);
      discover(`color:${genes.color}`, `Màu ${colorNames[genes.color]}`);
      discover(`pattern:${genes.pattern}`, `Hoa văn ${patternNames[genes.pattern]}`);
      if(genes.mutation) discover(`mutation:${genes.mutation}`, `Đột biến ${mutations[genes.mutation].name}!`);
    }
    if(type==='shrimp'){
      Object.assign(base,{hunger:rand(5,25),name:extra.name||choice(['Tí','Tách','Đỏ','Bé Tôm','Hạt Tiêu'])});
      discover('animal:shrimp','Tép Cherry');
    }
    if(type==='snail'){
      Object.assign(base,{vx:chance(.5)?2:-2,hunger:rand(5,25),name:extra.name||choice(['Ốc Mỡ','Tròn','Chấm','Nút'])});
      discover('animal:snail','Ốc Nerite');
    }
    if(type==='food') Object.assign(base,{vy:4,life:100,kind:extra.kind||'flake'});
    if(type==='waste') Object.assign(base,{vy:2,life:100});
    if(type==='egg') Object.assign(base,{health:100,hatchAt:extra.hatchAt||world.time+12,parents:extra.parents||[],species:extra.species||'guppy'});
    world.entities.push(base);
    return base;
  }

  function floorAt(x){
    const i=clamp(Math.floor(x/2),0,TERRAIN_COLS-1);
    const t=world.terrain[i];
    return FLOOR - t.sand - t.soil - t.stone;
  }

  function count(type){ return world.entities.filter(e=>e.type===type && e.health>0).length; }
  function byId(id){ return world.entities.find(e=>e.id===id && e.health>0); }

  function seedWorld(){
    world.entities = [];
    world.terrain = [];
    world.devices = {aerator:0,heater:0,lamp:0,filter:1};
    world.discovered = new Set();
    world.nextId = 1;
    world.births = 0; world.deaths = 0;
    world.event = null; world.nextEventAt = 30; world.overlay = null;
    for(let i=0;i<TERRAIN_COLS;i++){
      const hump = Math.max(0, 6-Math.abs(i-TERRAIN_COLS*.55)/12);
      world.terrain[i]={sand:rand(4,7),soil:(i>28&&i<164?rand(1,4)+hump*.2:0),stone:0};
    }
    for(let i=0;i<13;i++){
      const x=rand(38,W-38); addEntity('plant',x,floorAt(x)-2);
    }
    for(let i=0;i<15;i++) addEntity('algae',rand(28,W-28),rand(145,205));
    const starterSpecies=['guppy','guppy','medaka','medaka','tetra'];
    starterSpecies.forEach((species,i)=>addEntity('fish',70+i*47+rand(-8,8),rand(72,145),{species,gender:i%2?'♀':'♂'}));
    for(let i=0;i<6;i++){ const x=rand(40,W-40); addEntity('shrimp',x,floorAt(x)-1); }
    for(let i=0;i<3;i++){ const x=rand(40,W-40); addEntity('snail',x,floorAt(x)-1); }
    Object.assign(world.env,{oxygen:69,co2:31,ammonia:4,nitrate:18,temp:25,ph:7.1,clarity:91});
    world.time=8; world.speed=1; world.paused=false; world.stability=72; world.lastStoryAt=-100; world.lastHour=-1;
    logs.length=0;
    log('Hồ Mầm Xanh thức dậy. Năm chú cá đang thăm dò từng góc nước.','good');
    log('Mẹo: click trực tiếp lên một con cá để xem tên, tính cách và cuộc đời của nó.');
    renderAllUI();
  }

  function daylight(){ return Math.max(0,Math.sin((world.time%24-6)/24*Math.PI*2)); }
  function isNight(){ const h=world.time%24; return h<6 || h>19; }

  function currentField(x,y){
    if(!world.devices.filter) return {x:0,y:0,strength:0};
    const top = y < (WATER_TOP+FLOOR)*.52;
    let vx = top ? .85 : -.55;
    let vy = 0;
    if(x>W-60) vy = .35;
    else if(x<60) vy = -.22;
    const edge = clamp((y-WATER_TOP)/(FLOOR-WATER_TOP),0,1);
    const strength = .55 + Math.abs(.5-edge)*.5;
    return {x:vx*strength,y:vy*strength,strength};
  }

  function nearbyCount(type,x,y,r){
    let n=0;
    const rr=r*r;
    for(const e of world.entities){
      if(e.type!==type||e.health<=0) continue;
      const dx=e.x-x,dy=e.y-y;
      if(dx*dx+dy*dy<rr)n++;
    }
    return n;
  }

  function localEnv(x,y){
    const e=world.env;
    const surfaceBonus = (1-clamp((y-WATER_TOP)/(FLOOR-WATER_TOP),0,1))*7;
    const plants = nearbyCount('plant',x,y,36);
    const wastes = nearbyCount('waste',x,y,30)+nearbyCount('food',x,y,22)*.5;
    const aerator = world.devices.aerator ? Math.max(0,1-Math.hypot(x-35,y-(FLOOR-20))/105) : 0;
    const heater = world.devices.heater ? Math.max(0,1-Math.abs(x-(W-25))/100) : 0;
    const flow = currentField(x,y).strength;
    const lightDepth = clamp(1-(y-WATER_TOP)/(FLOOR-WATER_TOP)*.72,0.2,1);
    const light = clamp((daylight()+world.devices.lamp*.65)*lightDepth,0,1.35);
    let tempMod=0;
    if(world.event?.type==='heat') tempMod=2.8;
    if(world.event?.type==='cold') tempMod=-2.2;
    return {
      oxygen:clamp(e.oxygen+surfaceBonus+plants*1.6*light+aerator*20+flow*2-wastes*1.5,0,100),
      ammonia:clamp(e.ammonia+wastes*2.1+(y>FLOOR-45?2.2:0)-flow*1.5,0,100),
      temp:clamp(e.temp+heater*1.3+tempMod,15,34),
      light, flow
    };
  }

  function nearest(type,x,y,r,predicate=null){
    let best=null,bd=r*r;
    for(const o of world.entities){
      if(o.type!==type||o.health<=0||(predicate&&!predicate(o))) continue;
      const d=(o.x-x)**2+(o.y-y)**2;
      if(d<bd){bd=d;best=o;}
    }
    return best;
  }

  function startEvent(type){
    const defs={
      heat:{name:'☀ ĐỢT NẮNG NÓNG',duration:18,text:'Nhiệt độ nước đang tăng. Cá sẽ tìm vùng mát và giàu oxy.'},
      cold:{name:'🌧 MƯA LẠNH',duration:15,text:'Nước lạnh đi và trong hơn, nhưng chuyển hóa của sinh vật chậm lại.'},
      algae:{name:'🦠 ALGAE BLOOM',duration:12,text:'Dinh dưỡng dư thừa làm tảo bùng phát ở các vùng sáng.'},
      larvae:{name:'🦟 ẤU TRÙNG MUỖI',duration:8,text:'Một nguồn thức ăn tự nhiên vừa xuất hiện trên mặt nước.'},
      seed:{name:'🌱 MYSTERY SEED',duration:10,text:'Một mầm cây lạ vừa bén rễ trong hồ.'},
      visitor:{name:'✦ VỊ KHÁCH HIẾM',duration:10,text:'Một chú Chili Rasbora lạc vào hệ sinh thái!'}
    };
    const d=defs[type];
    world.event={type,name:d.name,until:world.time+d.duration};
    if(type==='algae') for(let i=0;i<12;i++) addEntity('algae',rand(25,W-25),rand(80,205));
    if(type==='larvae') for(let i=0;i<12;i++) addEntity('food',rand(30,W-30),rand(34,50),{kind:'larva',life:150});
    if(type==='seed'){
      const x=rand(50,W-50); addEntity('plant',x,floorAt(x)-2,{species:chance(.3)?'star':'crypt',height:5});
    }
    if(type==='visitor') addEntity('fish',W-34,rand(70,140),{species:'rasbora',personality:'Tò mò'});
    log(`${d.name}: ${d.text}`, type==='visitor'||type==='seed'?'rare':'alert');
    showEvent(`${d.name}\n${d.text}`);
  }

  function maybeEvent(){
    if(world.event && world.time>=world.event.until){
      log(`${world.event.name} đã qua. Hệ sinh thái bắt đầu trở lại nhịp bình thường.`,'good');
      world.event=null;
    }
    if(!world.event && world.time>=world.nextEventAt){
      const options=['heat','cold','algae','larvae','seed'];
      if(world.time>72 && count('fish')<16) options.push('visitor');
      startEvent(choice(options));
      world.nextEventAt=world.time+rand(30,55);
    }
  }

  function updateEnvironment(dt){
    const e=world.env;
    const light=clamp(daylight()+world.devices.lamp*.65,0,1.3);
    const plants=count('plant'), algae=count('algae'), fish=count('fish'), shrimp=count('shrimp'), snail=count('snail');
    const living=fish+shrimp*.32+snail*.18;
    const photos=(plants*.13+algae*.026)*light;
    const filterBonus=world.devices.filter?.07:0;
    e.oxygen += (photos-living*.072-.012+world.devices.aerator*.28+filterBonus)*dt;
    e.co2 += (living*.055-photos*.6-world.devices.aerator*.1)*dt;
    const waste=count('waste')+count('food')*.5;
    e.ammonia += (living*.013+waste*.014-plants*.004)*dt;
    const bacterial=.032*(e.oxygen/100)*(world.devices.filter?1.7:1);
    const converted=Math.min(e.ammonia,bacterial*dt*3.1);
    e.ammonia-=converted;
    e.nitrate+=converted*.78-plants*.0045*light*dt;
    let target=22.8+daylight()*3.1+world.devices.lamp*.45;
    if(world.devices.heater)target=25.4;
    if(world.event?.type==='heat')target+=3.5;
    if(world.event?.type==='cold')target-=2.6;
    e.temp+=(target-e.temp)*.012*dt;
    e.ph+=((7.15-e.ph)-e.co2*.0015)*.008*dt;
    e.clarity+=(92-e.clarity)*(.0028+(world.devices.filter?.003:0))*dt-(waste*.005+algae*.0024)*dt;
    if(world.event?.type==='cold')e.clarity+=.02*dt;
    for(const k of ['oxygen','co2','ammonia','nitrate','clarity'])e[k]=clamp(e[k],0,100);
    e.temp=clamp(e.temp,15,34);e.ph=clamp(e.ph,5.2,8.8);
  }

  function fishStress(f,l){
    const spec=fishSpecies[f.species];
    return clamp((35-l.oxygen)*.018+Math.max(0,l.ammonia-8)*.015+Math.abs(l.temp-spec.idealTemp)*.055+(f.hunger>85?.35:0),0,1.8);
  }

  function ensureBond(f,dt){
    if(f.bondId && byId(f.bondId)) return;
    const friend=nearest('fish',f.x,f.y,22,o=>o.id!==f.id&&o.species===f.species);
    if(friend && chance(.0008*dt)){
      f.bondId=friend.id;
      if(!friend.bondId)friend.bondId=f.id;
      log(`${f.name} và ${friend.name} bắt đầu thường xuyên bơi cạnh nhau.`,'good');
    }
  }

  function tryBreed(f,dt){
    if(f.gender!=='♀'||f.juvenile||world.time<f.breedCooldown||world.stability<70||f.hunger>48||f.health<76) return;
    const ageH=world.time-f.bornAt;
    if(ageH<48) return;
    const male=nearest('fish',f.x,f.y,28,o=>o.gender==='♂'&&!o.juvenile&&o.species===f.species&&(world.time-o.bornAt)>48&&o.health>72&&o.hunger<55);
    if(!male||world.time<male.breedCooldown) return;
    if(!chance(.00022*dt)) return;
    f.mateId=male.id; male.mateId=f.id;
    f.breedCooldown=world.time+rand(42,70); male.breedCooldown=world.time+rand(28,50);
    const eggs=1+(chance(.55)?1:0)+(chance(.2)?1:0);
    for(let i=0;i<eggs;i++) addEntity('egg',f.x+rand(-3,3),floorAt(f.x)-rand(2,8),{species:f.species,parents:[f.id,male.id],hatchAt:world.time+rand(9,15)});
    log(`🥚 ${f.name} và ${male.name} đã để lại ${eggs} trứng ${fishSpecies[f.species].name} dưới nền cây.`,'good');
  }

  function updateFish(f,dt){
    const l=localEnv(f.x,f.y);
    const stress=fishStress(f,l);
    f.hunger=clamp(f.hunger+dt*.037,0,110);
    f.energy=clamp(f.energy+(isNight()?.028:.012)*dt-stress*.04*dt,0,100);
    f.health=clamp(f.health-stress*.07*dt+(stress<.18&&f.hunger<65?.012*dt:0),0,100);
    f.juvenile=(world.time-f.bornAt)<28;
    f.size=f.juvenile?clamp(.55+(world.time-f.bornAt)/60,.55,1):1;

    const food=nearest('food',f.x,f.y,f.personality==='Ham ăn'?80:58);
    if(food){
      const d=dist(f,food); f.vx+=(food.x-f.x)/Math.max(d,1)*.42*dt; f.vy+=(food.y-f.y)/Math.max(d,1)*.27*dt;
      if(d<4){food.health=0;f.hunger=Math.max(0,f.hunger-(food.kind==='larva'?42:30));f.energy=clamp(f.energy+8,0,100);}
    }else{
      let target=f.favoriteSpot;
      if(f.personality==='Nhút nhát'){
        const p=nearest('plant',f.x,f.y,90); if(p)target=p;
      }else if(f.personality==='Tò mò'&&world.cursor.inside){target=world.cursor;}
      else if(f.personality==='Hòa đồng'){
        const friend=nearest('fish',f.x,f.y,90,o=>o.id!==f.id&&o.species===f.species);if(friend)target=friend;
      }else if(f.personality==='Hiếu động'&&chance(.003*dt)){
        f.favoriteSpot={x:rand(30,W-30),y:rand(45,170)};target=f.favoriteSpot;
      }
      if(target){
        const dx=target.x-f.x,dy=target.y-f.y,d=Math.hypot(dx,dy)||1;
        const urge=f.personality==='Điềm tĩnh'?.035:.065;
        if(d>12){f.vx+=dx/d*urge*dt;f.vy+=dy/d*urge*.7*dt;}
      }
      f.vx+=rand(-.18,.18)*dt; f.vy+=rand(-.1,.1)*dt;
    }

    if(l.oxygen<32) f.vy-=.16*dt;
    if(l.ammonia>12){
      const flow=currentField(f.x,f.y);f.vx+=flow.x*.08*dt;f.vy+=flow.y*.08*dt;
    }
    const flow=currentField(f.x,f.y);f.vx+=flow.x*.03*dt;f.vy+=flow.y*.03*dt;
    const nightFactor=isNight()?.52:1;
    const max=(f.personality==='Hiếu động'?21:f.personality==='Điềm tĩnh'?13:17)*nightFactor;
    f.vx=clamp(f.vx,-max,max);f.vy=clamp(f.vy,-9*nightFactor,9*nightFactor);
    f.x+=f.vx*dt*.08;f.y+=f.vy*dt*.08;f.vx*=.985;f.vy*=.972;
    if(f.x<12||f.x>W-12){f.vx*=-1;f.x=clamp(f.x,12,W-12);}
    const fy=floorAt(f.x)-6;
    if(f.y<WATER_TOP+8){f.y=WATER_TOP+8;f.vy=Math.abs(f.vy);}
    if(f.y>fy){f.y=fy;f.vy=-Math.abs(f.vy)*.65;}
    if(Math.abs(f.vx)>.25)f.dir=Math.sign(f.vx);

    if(chance(.0005*dt))addEntity('waste',f.x,f.y+3);
    ensureBond(f,dt); tryBreed(f,dt);
    if(stress>.75)f.mood='Căng thẳng';
    else if(f.hunger>70)f.mood='Đang đói';
    else if(isNight())f.mood='Buồn ngủ';
    else if(f.bondId&&byId(f.bondId)&&dist(f,byId(f.bondId))<30)f.mood='Vui vẻ';
    else f.mood='Bình yên';
  }

  function updateEntities(dt){
    const daylightNow=daylight();
    for(const a of [...world.entities]){
      a.age+=dt/60;
      if(a.health<=0)continue;
      if(a.type==='plant'){
        const l=localEnv(a.x,Math.max(WATER_TOP,a.y-a.height/2));
        const nutrition=clamp((world.env.nitrate+8)/35,.2,1.4);
        const growth=l.light*nutrition*(world.env.ammonia<22?1:.5);
        a.growth+=growth*dt*.012;
        if(a.growth>1&&a.height<a.maxHeight){a.growth=0;a.height+=1;if(a.height>16&&chance(.2))a.branches=clamp(a.branches+1,1,4);}
        if(world.env.nitrate<1||l.ammonia>30)a.health-=dt*.02;
        if(a.health>65&&a.height>17&&chance(.00035*dt*growth)&&count('plant')<45){
          const x=clamp(a.x+rand(-12,12),12,W-12);addEntity('plant',x,floorAt(x)-1,{height:5,species:a.species});
        }
      }else if(a.type==='algae'){
        const l=localEnv(a.x,a.y);
        if(l.light>.35&&world.env.nitrate>12&&chance(.0005*dt) && count('algae')<95) addEntity('algae',clamp(a.x+rand(-8,8),10,W-10),clamp(a.y+rand(-8,8),45,FLOOR-5));
        if(world.env.nitrate<3)a.health-=dt*.018;
      }else if(a.type==='fish') updateFish(a,dt);
      else if(a.type==='shrimp'){
        a.hunger+=dt*.032;
        const t=nearest('waste',a.x,a.y,45)||nearest('food',a.x,a.y,36)||nearest('algae',a.x,a.y,26);
        const activity=isNight()?1.5:.65;
        if(t){a.x+=(t.x-a.x)*.0045*dt*activity;a.y+=(t.y-a.y)*.0045*dt*activity;if(dist(a,t)<3){t.health=0;a.hunger=Math.max(0,a.hunger-30);}}
        else a.x=clamp(a.x+rand(-.2,.2)*dt*activity,10,W-10);
        a.y=Math.min(floorAt(a.x)-1,a.y+dt*.22);
        if(localEnv(a.x,a.y).oxygen<23)a.health-=dt*.05;
      }else if(a.type==='snail'){
        a.hunger+=dt*.02;
        const t=nearest('algae',a.x,a.y,35);
        const activity=isNight()?1.35:.7;
        if(t){a.x+=(t.x-a.x)*.0025*dt*activity;a.y+=(t.y-a.y)*.0025*dt*activity;if(dist(a,t)<3){t.health=0;a.hunger=Math.max(0,a.hunger-25);}}
        else a.x+=a.vx*dt*.012*activity;
        if(a.x<10||a.x>W-10)a.vx*=-1;a.x=clamp(a.x,10,W-10);a.y=Math.min(floorAt(a.x)-1,a.y+dt*.18);
      }else if(a.type==='food'||a.type==='waste'){
        a.life-=dt*(a.type==='food'?.027:.018);
        const f=currentField(a.x,a.y);
        a.x=clamp(a.x+f.x*dt*.045,10,W-10);a.y+=a.vy*dt*.027+f.y*dt*.02;a.vy=Math.min(a.vy+.018*dt,5);
        const floor=floorAt(a.x)-1;if(a.y>floor){a.y=floor;a.vy=0;}
        if(a.life<=0){a.health=0;world.env.ammonia+=a.type==='food'?1.1:.65;}
      }else if(a.type==='egg'){
        a.y=Math.min(a.y+dt*.03,floorAt(a.x)-2);
        if(world.time>=a.hatchAt){
          const parents=a.parents.map(byId).filter(Boolean);
          const babies=1+(chance(.35)?1:0);
          for(let i=0;i<babies;i++){
            const genes=parents.length===2?makeGenes(parents):makeGenes();
            const baby=addEntity('fish',a.x+rand(-4,4),a.y-rand(3,7),{species:a.species,genes,juvenile:true,bornAt:world.time,generation:parents.length?Math.max(...parents.map(p=>p.generation))+1:1,parents});
            world.births++;
            if(genes.mutation)log(`✨ ${baby.name} vừa nở với đột biến ${mutations[genes.mutation].name}!`,'rare');
          }
          a.health=0;
          log(`🐣 Trứng ${fishSpecies[a.species].name} đã nở. Một thế hệ mới bắt đầu.`,'good');
        }
      }

      if(a.health<=0 && ['fish','shrimp','snail'].includes(a.type)){
        addEntity('waste',a.x,a.y);addEntity('waste',a.x+2,a.y);
        world.deaths++;
        const who=a.type==='fish'?`${a.name} (${fishSpecies[a.species].name})`:a.type==='shrimp'?'Một chú tép':'Một chú ốc';
        log(`💧 ${who} đã chết. Hãy kiểm tra oxy, nhiệt độ và độc tố.`,'alert');
        if(world.selectedFishId===a.id)closeSide();
      }
    }
    world.entities=world.entities.filter(a=>a.health>0);
  }

  function assess(){
    const e=world.env;
    const scores=[100-Math.abs(e.oxygen-70)*2,100-Math.max(0,e.ammonia-4)*5,100-Math.max(0,e.nitrate-32)*1.7,100-Math.abs(e.temp-25)*8,100-Math.abs(e.ph-7.1)*22,e.clarity];
    world.stability=clamp(scores.reduce((s,v)=>s+clamp(v,0,100),0)/scores.length,0,100);
    const dot=document.getElementById('healthDot'),text=document.getElementById('healthText');
    if(world.stability>75){dot.style.background='#84dca0';text.textContent='Hệ đang yên';}
    else if(world.stability>50){dot.style.background='#e6c86e';text.textContent='Đang dao động';}
    else{dot.style.background='#ed7c72';text.textContent='Cần chăm sóc';}
  }

  function hourlyStories(){
    const hour=Math.floor(world.time);
    if(hour===world.lastHour)return;
    world.lastHour=hour;
    if(hour-world.lastStoryAt<7)return;
    world.lastStoryAt=hour;
    if(world.env.oxygen<34)log('Cá bắt đầu dạt lên vùng gần mặt nước vì oxy thấp.','alert');
    else if(world.env.ammonia>13)log('Đáy hồ đang tích độc tố. Dòng lọc và cây chưa xử lý kịp chất thải.','alert');
    else if(isNight()&&count('shrimp')>0)log('Khi đèn tắt, đàn tép rời chỗ trú và bắt đầu dọn nền.');
    else if(world.stability>80){
      const f=choice(world.entities.filter(e=>e.type==='fish'));
      if(f)log(`${f.name} có vẻ rất thoải mái; ${f.personality.toLowerCase()} nhưng hôm nay bơi khắp hồ.`,'good');
    }
  }

  function tick(dt){
    if(world.paused)return;
    dt*=world.speed;
    world.time+=dt/18;
    maybeEvent();
    updateEnvironment(dt);
    updateEntities(dt);
    assess();
    hourlyStories();
  }

  function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.floor(x),Math.floor(y),Math.ceil(w),Math.ceil(h));}

  function fishColor(f){
    if(f.genes.mutation)return mutations[f.genes.mutation].tint;
    return colors[f.genes.color]||fishSpecies[f.species].base;
  }

  function drawFishSprite(c,f,x,y,scale=1,dir=f.dir||1){
    c.save();c.translate(Math.round(x),Math.round(y));c.scale(dir*scale,scale);
    const body=fishColor(f);
    c.fillStyle=body;c.fillRect(-5,-2,8,4);c.fillRect(-3,-3,4,1);c.fillRect(-3,2,4,1);
    c.fillStyle=fishSpecies[f.species].base;c.fillRect(-7,-1,2,2);
    c.fillStyle='#0b171c';c.fillRect(1,-1,1,1);
    if(f.genes.pattern==='stripe'){c.fillStyle='#3d5156';c.fillRect(-3,-2,1,4);c.fillRect(-1,-2,1,4);}
    if(f.genes.pattern==='spots'){c.fillStyle='#4b5455';c.fillRect(-3,-1,1,1);c.fillRect(-1,1,1,1);}
    if(f.genes.pattern==='koi'){c.fillStyle='#f0e2c4';c.fillRect(-4,-2,2,2);c.fillRect(0,0,2,2);}
    if(f.genes.mutation==='galaxy'){c.fillStyle='#e7dc83';c.fillRect(-3,-1,1,1);c.fillRect(0,1,1,1);}
    if(f.genes.mutation==='neon'){c.fillStyle='#d8fff2';c.fillRect(-4,0,6,1);}
    c.restore();
  }

  function drawPlant(a){
    const sway=Math.sin(a.phase+world.drawTicks*.025)*1.6;
    const baseX=a.x|0,baseY=a.y|0;
    const col=a.health<45?'#8f8c54':a.species==='crypt'?'#6fa56b':a.species==='star'?'#86c88b':palette.plant2;
    ctx.fillStyle=col;
    if(a.species==='java'){
      for(let b=0;b<a.branches;b++){
        const off=(b-(a.branches-1)/2)*3;
        for(let h=0;h<a.height;h+=4){ctx.fillRect((baseX+off+sway*(h/a.height))|0,baseY-h,2,4);if(h%8===0)ctx.fillRect((baseX+off-2+sway*(h/a.height))|0,baseY-h,2,2);}
      }
    }else if(a.species==='crypt'){
      for(let b=0;b<Math.max(3,a.branches+2);b++){
        const ang=(b-2)*.22;for(let h=0;h<a.height*.7;h+=3)ctx.fillRect((baseX+Math.sin(ang)*h+sway*.3)|0,baseY-h,2,3);
      }
    }else{
      for(let h=0;h<a.height;h+=3){const sx=(baseX+sway*(h/a.height))|0;ctx.fillRect(sx,baseY-h,2,3);if(h%6===0){ctx.fillRect(sx-2,baseY-h,2,1);ctx.fillRect(sx+2,baseY-h-1,2,1);}}
      if(a.species==='star'&&a.height>12){ctx.fillStyle='#a9d989';ctx.fillRect(baseX-2,baseY-a.height-1,6,2);}
    }
  }

  function drawOverlay(){
    if(!world.overlay)return;
    const cols=12,rows=6,cw=(W-20)/cols,ch=(FLOOR-WATER_TOP)/rows;
    ctx.save();ctx.globalAlpha=.24;
    for(let gy=0;gy<rows;gy++)for(let gx=0;gx<cols;gx++){
      const x=10+gx*cw+cw/2,y=WATER_TOP+gy*ch+ch/2,l=localEnv(x,y);
      let val=0,c='#70d1d0';
      if(world.overlay==='oxygen'){val=l.oxygen;c=l.oxygen<35?'#e76f67':l.oxygen<55?'#e1bd62':'#6ed1bd';}
      if(world.overlay==='ammonia'){val=l.ammonia;c=l.ammonia>14?'#e56f69':l.ammonia>7?'#d8b15d':'#72c99e';}
      if(world.overlay==='temp'){val=l.temp;c=Math.abs(l.temp-25)>3?'#e47a69':'#7cc8b1';}
      if(world.overlay==='flow'){val=l.flow*100;c='#79c9d0';}
      ctx.fillStyle=c;ctx.fillRect(10+gx*cw,WATER_TOP+gy*ch,cw-1,ch-1);
      if(world.overlay!=='flow'){ctx.globalAlpha=.5;ctx.fillStyle='#061014';ctx.fillRect(11+gx*cw,WATER_TOP+gy*ch+1,14,5);ctx.globalAlpha=.8;ctx.fillStyle='#d8f0dd';ctx.font='5px monospace';ctx.fillText(String(Math.round(val)),12+gx*cw,WATER_TOP+gy*ch+5);ctx.globalAlpha=.24;}
    }
    ctx.restore();
  }

  function draw(){
    world.drawTicks++;
    const dl=daylight();
    const night=isNight();
    const topGlow=night?8:Math.floor(16+dl*24);
    rect(0,0,W,H,night?palette.skyNight:palette.sky);
    ctx.fillStyle=`rgb(${7+topGlow},${19+topGlow},${24+topGlow})`;ctx.fillRect(0,0,W,45);

    rect(8,18,W-16,FLOOR-9,night?palette.waterNight:palette.water);
    for(let y=WATER_TOP;y<FLOOR;y+=10){ctx.fillStyle=(Math.floor(y/10)%2?(night?'#092331':'#103d48'):(night?'#081f2c':'#0d3540'));ctx.fillRect(10,y,W-20,10);}

    if(dl>0||world.devices.lamp){ctx.globalAlpha=.035+.06*dl+.035*world.devices.lamp;ctx.fillStyle=palette.light;for(let x=22;x<W-15;x+=48)ctx.fillRect(x,25,20,FLOOR-30);ctx.globalAlpha=1;}
    if(night){ctx.globalAlpha=.12;ctx.fillStyle='#0a1024';ctx.fillRect(10,WATER_TOP,W-20,FLOOR-WATER_TOP);ctx.globalAlpha=1;}

    for(let i=0;i<34;i++){
      const y=35+(i*37)%170;const flow=currentField((i*61)%W,y);let x=(i*43+world.drawTicks*.06*(i%3+1)+flow.x*world.drawTicks*.35)%(W-28)+14;
      ctx.fillStyle=night?'#164a5c':'#2d7382';ctx.fillRect(x|0,y,1,1);
    }

    for(let i=0;i<TERRAIN_COLS;i++){
      const x=i*2,t=world.terrain[i];let y=FLOOR;
      if(t.sand){rect(x,y-t.sand,2,t.sand,palette.sand);y-=t.sand;}
      if(t.soil){rect(x,y-t.soil,2,t.soil,palette.soil);y-=t.soil;}
      if(t.stone){rect(x,y-t.stone,2,t.stone,palette.stone);}
    }

    if(world.devices.aerator){rect(25,FLOOR-9,13,5,'#76868a');for(let i=0;i<13;i++){const yy=FLOOR-14-((world.drawTicks*.38+i*17)%165);rect(29+(i%4)*2,yy,1,2,palette.bubble);}}
    if(world.devices.heater){rect(W-25,75,4,112,'#9e6958');rect(W-24,85,2,72,'#db8c65');}
    if(world.devices.lamp){rect(151,9,82,5,'#bda455');rect(171,14,42,2,'#efd679');}
    if(world.devices.filter){rect(W-31,32,16,20,'#314d55');rect(W-29,35,12,14,'#172f38');rect(W-33,49,5,4,'#657c7f');for(let i=0;i<4;i++){const x=W-38-i*7;rect(x,51+(i%2),4,1,'#66a4a9');}}

    const ents=[...world.entities].sort((a,b)=>a.y-b.y);
    for(const a of ents){
      const x=a.x|0,y=a.y|0;
      if(a.type==='plant')drawPlant(a);
      else if(a.type==='algae')rect(x-1,y-1,a.size+1,a.size,palette.algae);
      else if(a.type==='fish'){
        drawFishSprite(ctx,a,x,y,a.size,a.dir);
        if(a.id===world.selectedFishId){ctx.strokeStyle='#f0d878';ctx.lineWidth=1;ctx.strokeRect(x-9,y-7,18,14);}
        if(a.mood==='Buồn ngủ'&&world.drawTicks%120<55){ctx.fillStyle='#9ab4bc';ctx.font='6px monospace';ctx.fillText('z',x+5,y-5);}
      }
      else if(a.type==='shrimp'){ctx.fillStyle=palette.shrimp;ctx.fillRect(x-2,y-1,4,2);ctx.fillRect(x+2,y-2,1,2);ctx.fillRect(x-3,y,1,1);}
      else if(a.type==='snail'){ctx.fillStyle=palette.snail;ctx.fillRect(x-1,y-2,3,2);ctx.fillStyle='#715b45';ctx.fillRect(x,y-2,1,1);ctx.fillStyle='#c9ad80';ctx.fillRect(x-2,y,5,1);}
      else if(a.type==='food'){ctx.fillStyle=a.kind==='larva'?'#c7d38a':palette.food;ctx.fillRect(x,y,1,1);if(a.life>70)ctx.fillRect(x+1,y-1,1,1);}
      else if(a.type==='waste'){ctx.fillStyle=palette.waste;ctx.fillRect(x,y,2,1);}
      else if(a.type==='egg'){ctx.fillStyle='#e6d9b5';ctx.fillRect(x,y,2,2);ctx.fillStyle='#8aa69c';ctx.fillRect(x+1,y,1,1);}
    }

    drawOverlay();
    ctx.globalAlpha=.27;rect(12,25,2,FLOOR-32,palette.glass);rect(W-14,25,1,FLOOR-32,palette.glass);ctx.globalAlpha=1;
    rect(6,16,W-12,2,'#6f9698');rect(6,FLOOR,W-12,3,'#30454a');rect(6,16,3,FLOOR-13,'#506d72');rect(W-9,16,3,FLOOR-13,'#506d72');
    for(let x=12;x<W-12;x+=10){ctx.fillStyle=(x/10+world.drawTicks/18|0)%2?'#7db5b4':'#4e8e92';ctx.fillRect(x,WATER_TOP,6,1);}
  }

  function renderToolbar(){
    const el=document.getElementById('toolbar');
    el.innerHTML=items.map(it=>`<button class="tool ${world.selected===it.id?'active':''}" data-id="${it.id}" title="${it.name}"><span class="kbd">${it.key}</span><span class="icon">${it.icon}</span>${it.name}</button>`).join('');
    el.querySelectorAll('.tool').forEach(b=>b.onclick=()=>{world.selected=b.dataset.id;renderToolbar();toast(`Đã chọn: ${items.find(i=>i.id===world.selected).name}`);});
  }

  const meterDefs=[['oxygen','Oxy','%'],['co2','CO₂','%'],['ammonia','Amoniac',' ppm'],['nitrate','Nitrat',' ppm'],['temp','Nhiệt độ','°C'],['ph','pH',''],['clarity','Độ trong','%']];
  function meterPct(k,v){if(k==='temp')return clamp((v-16)/17*100,0,100);if(k==='ph')return clamp((v-5.5)/3*100,0,100);if(k==='ammonia')return clamp(v/30*100,0,100);if(k==='nitrate')return clamp(v/70*100,0,100);return clamp(v,0,100);}
  function metersHTML(){
    return `<div class="meters">${meterDefs.map(([k,n,u])=>`<div class="meter-row"><span>${n}</span><div class="meter-track"><div class="meter-fill" style="width:${meterPct(k,world.env[k])}%"></div></div><span class="meter-value">${world.env[k].toFixed(k==='ph'?1:0)}${u}</span></div>`).join('')}</div>`;
  }

  function openWaterTest(){
    world.selectedFishId=null;
    const content=document.getElementById('sideContent');
    content.innerHTML=`<div class="eyebrow">WATER LAB</div><h2 class="side-title">Bộ kiểm tra nước</h2><div class="side-sub">Chỉ số toàn hồ + bản đồ môi trường theo từng vùng.</div>${metersHTML()}<div class="section-label">BẢN ĐỒ CỤC BỘ</div><p class="test-note">Màu phủ trên hồ là phép đo mô phỏng theo vị trí. Gần mặt nước, cây, máy sủi và dòng lọc sẽ tạo ra những vùng khác nhau.</p><div class="profile-grid"><button class="pixel-btn" data-overlay="oxygen">O₂</button><button class="pixel-btn" data-overlay="ammonia">NH₃</button><button class="pixel-btn" data-overlay="temp">Nhiệt</button><button class="pixel-btn" data-overlay="flow">Dòng nước</button></div><div class="section-label">ĐỌC NHANH</div><div id="zoneReadings"></div>`;
    content.querySelectorAll('[data-overlay]').forEach(b=>b.onclick=()=>{world.overlay=world.overlay===b.dataset.overlay?null:b.dataset.overlay;toast(world.overlay?`Overlay: ${b.textContent}`:'Đã tắt overlay');});
    openSide(); renderZoneReadings();
  }

  function renderZoneReadings(){
    const box=document.getElementById('zoneReadings');if(!box)return;
    const zones=[['Mặt nước',W*.5,45],['Bụi cây trái',W*.27,155],['Trung tâm',W*.5,120],['Gần lọc',W*.82,70],['Đáy hồ',W*.55,FLOOR-18]];
    box.innerHTML=zones.map(([n,x,y])=>{const l=localEnv(x,y);return `<div class="zone-card"><strong>${n}</strong><br>O₂ ${Math.round(l.oxygen)}% · NH₃ ${l.ammonia.toFixed(1)} · ${l.temp.toFixed(1)}°C · dòng ${Math.round(l.flow*100)}%</div>`;}).join('');
  }

  function fishAgeText(f){
    const h=Math.max(0,world.time-f.bornAt),d=Math.floor(h/24),hh=Math.floor(h%24);
    return d>0?`${d} ngày ${hh} giờ`:`${hh} giờ`;
  }

  function openFishProfile(f){
    if(!f)return;
    world.selectedFishId=f.id;world.overlay=null;
    const friend=byId(f.bondId),mate=byId(f.mateId),l=localEnv(f.x,f.y);
    const mut=f.genes.mutation?`<span class="mini-badge rare-badge">✨ ${mutations[f.genes.mutation].name}</span>`:'';
    const content=document.getElementById('sideContent');
    content.innerHTML=`<div class="eyebrow">CREATURE PROFILE</div><h2 class="side-title">${f.name} ${f.gender}</h2><div class="side-sub">${fishSpecies[f.species].name} · Thế hệ ${f.generation} ${mut}</div><div class="portrait-card"><canvas id="portrait" class="fish-portrait" width="84" height="64"></canvas><div class="profile-grid"><div class="profile-stat">Tuổi<b>${fishAgeText(f)}</b></div><div class="profile-stat">Tính cách<b>${f.personality}</b></div><div class="profile-stat">Màu<b>${colorNames[f.genes.color]}</b></div><div class="profile-stat">Hoa văn<b>${patternNames[f.genes.pattern]}</b></div></div></div><div class="section-label">TRẠNG THÁI</div>${needHTML('❤️ Sức khỏe',f.health)}${needHTML('🍤 No bụng',100-f.hunger)}${needHTML('⚡ Năng lượng',f.energy)}<div class="zone-card"><strong>${f.mood}</strong><br>Vùng đang bơi: O₂ ${Math.round(l.oxygen)}% · NH₃ ${l.ammonia.toFixed(1)} · ${l.temp.toFixed(1)}°C</div><div class="section-label">QUAN HỆ</div><div class="relationship">${friend?`💚 Hay bơi cùng <b>${friend.name}</b>.`:'Chưa có một người bạn đặc biệt.'}<br>${mate?`💕 Đã ghép đôi với <b>${mate.name}</b>.`:'Chưa có bạn đời.'}</div><div class="section-label">SINH HỌC</div><div class="zone-card">${f.juvenile?'Cá con — chưa trưởng thành.':'Đã trưởng thành.'}<br>Điều kiện sinh sản: cùng loài, khác giới, hồ ổn định &gt; 70%, khỏe và không quá đói.</div>`;
    openSide();
    const pc=document.getElementById('portrait'),pctx=pc.getContext('2d');pctx.imageSmoothingEnabled=false;pctx.fillStyle='#092d38';pctx.fillRect(0,0,84,64);for(let i=0;i<18;i++){pctx.fillStyle='#15505b';pctx.fillRect((i*17)%80,8+(i*13)%48,1,1);}drawFishSprite(pctx,f,43,33,3,1);
  }

  function needHTML(name,value){return `<div class="need-row"><span>${name}</span><div class="need-track"><div class="need-fill" style="width:${clamp(value,0,100)}%"></div></div><span>${Math.round(value)}%</span></div>`;}

  function openSide(){document.getElementById('sidePanel').classList.add('open');document.getElementById('sidePanel').setAttribute('aria-hidden','false');document.getElementById('panelShade').classList.add('show');}
  function closeSide(){document.getElementById('sidePanel').classList.remove('open');document.getElementById('sidePanel').setAttribute('aria-hidden','true');document.getElementById('panelShade').classList.remove('show');world.selectedFishId=null;world.overlay=null;}

  const dexCatalog=[
    ['fish:guppy','🐟','Guppy','Loài cá dễ thích nghi và sinh sản nhanh.'],['fish:medaka','🐟','Medaka','Điềm tĩnh, chịu dao động nhiệt tốt.'],['fish:tetra','✦','Neon Tetra','Cá đàn thích vùng nước sạch và giàu oxy.'],['fish:rasbora','♦','Chili Rasbora','Nhỏ, đỏ rực và hiếm gặp.'],
    ['animal:shrimp','⌁','Tép Cherry','Hoạt động mạnh về đêm, dọn vụn thức ăn.'],['animal:snail','@','Ốc Nerite','Chậm rãi nhưng rất chăm ăn tảo.'],
    ['plant:elodea','♒','Rong đuôi chó','Phát triển nhanh khi đủ sáng và nitrat.'],['plant:java','♜','Dương xỉ Java','Cây khỏe, tạo vùng trú cho cá nhút nhát.'],['plant:crypt','♨','Cryptocoryne','Ưa nền giàu dinh dưỡng.'],['plant:star','✣','Rong Sao','Một cây hiếm từ Mystery Seed.'],
    ...Object.entries(mutations).map(([k,v])=>[`mutation:${k}`,'✨',v.name,`Đột biến hiếm khoảng ${v.rarity} khi sinh sản.`])
  ];

  function renderAquadex(){
    const grid=document.getElementById('aquadexGrid'),stats=document.getElementById('aquadexStats');if(!grid||!stats)return;
    const found=dexCatalog.filter(d=>world.discovered.has(d[0])).length;
    stats.textContent=`Đã khám phá ${found}/${dexCatalog.length} mục · ${world.births} cá sinh ra · ${world.deaths} sinh vật đã mất`;
    grid.innerHTML=dexCatalog.map(([key,icon,name,desc])=>{const ok=world.discovered.has(key);return `<div class="dex-card ${ok?'':'locked'}"><div class="dex-icon">${ok?icon:'?'}</div><strong>${ok?name:'???'}</strong><em>${ok?'Đã ghi nhận':'Chưa khám phá'}</em><p>${ok?desc:'Hãy quan sát, sinh sản và để hệ sinh thái tự tạo bất ngờ.'}</p></div>`;}).join('');
  }

  function renderJournal(){
    const el=document.getElementById('journal');if(!el)return;
    el.innerHTML=logs.length?logs.map(l=>`<div class="journal-entry ${l.type}"><b>${l.time}</b> · ${l.text}</div>`).join(''):'<div class="empty-state">Hồ vẫn chưa có câu chuyện nào.</div>';
  }

  function renderHeader(){
    const day=Math.floor(world.time/24)+1,h=Math.floor(world.time%24);
    document.getElementById('dayLabel').textContent=`Ngày ${day} · ${String(h).padStart(2,'0')}:00`;
    document.getElementById('tempMini').textContent=`${world.env.temp.toFixed(1)}°C`;
    let icon='☀',txt='Trời dịu';
    if(isNight()){icon='☾';txt='Đêm yên';}
    if(world.event?.type==='heat'){icon='☀';txt='Nắng nóng';}
    if(world.event?.type==='cold'){icon='☂';txt='Mưa lạnh';}
    if(world.event?.type==='algae'){icon='✦';txt='Tảo nở';}
    document.getElementById('weatherIcon').textContent=icon;document.getElementById('weatherText').textContent=txt;
    const story=document.getElementById('storyHint');
    const fish=world.entities.filter(e=>e.type==='fish');
    const sleepy=fish.filter(f=>f.mood==='Buồn ngủ').length;
    story.textContent=isNight()&&sleepy?`${sleepy} chú cá đang chậm lại để nghỉ đêm.`:`${fish.length} cá thể · ${count('plant')} cây · độ cân bằng ${Math.round(world.stability)}%`;
  }

  function renderAllUI(){renderToolbar();renderHeader();renderAquadex();renderJournal();assess();}

  let toastTimer,eventTimer;
  function toast(t){const el=document.getElementById('toast');el.textContent=t;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),1400);}
  function showEvent(t){const el=document.getElementById('eventBanner');el.textContent=t;el.classList.add('show');clearTimeout(eventTimer);eventTimer=setTimeout(()=>el.classList.remove('show'),4400);}

  function findFishAt(x,y){
    let best=null,bd=8*8;
    for(const f of world.entities){if(f.type!=='fish'||f.health<=0)continue;const d=(f.x-x)**2+(f.y-y)**2;if(d<bd){bd=d;best=f;}}
    return best;
  }

  function placeAt(clientX,clientY,erase=false,allowInspect=true){
    const r=canvas.getBoundingClientRect(),x=(clientX-r.left)/r.width*W,y=(clientY-r.top)/r.height*H;
    if(allowInspect&&!erase){const f=findFishAt(x,y);if(f){openFishProfile(f);return 'inspect';}}
    const type=erase?'erase':world.selected;
    if(type==='erase'){
      let best=-1,bd=80;world.entities.forEach((a,i)=>{const d=(a.x-x)**2+(a.y-y)**2;if(d<bd){bd=d;best=i;}});if(best>=0){world.entities.splice(best,1);toast('Đã dọn một vật thể');}return 'place';
    }
    if(['sand','soil','stone'].includes(type)){
      const center=Math.floor(x/2);for(let di=-3;di<=3;di++){const i=clamp(center+di,0,TERRAIN_COLS-1),t=world.terrain[i],add=Math.max(0,4-Math.abs(di));t[type]=clamp(t[type]+add,0,type==='stone'?25:32);}return 'place';
    }
    if(type==='water'){world.env.clarity=clamp(world.env.clarity+5,0,100);world.env.ammonia*=.88;world.env.nitrate*=.93;toast('Thay một phần nước · độc tố được pha loãng');return 'place';}
    if(['aerator','heater','lamp','filter'].includes(type)){world.devices[type]=world.devices[type]?0:1;toast(`${items.find(i=>i.id===type).name}: ${world.devices[type]?'BẬT':'TẮT'}`);return 'place';}
    const fy=floorAt(x)-2;
    if(type==='plant')addEntity('plant',x,Math.min(y,fy));
    else if(type==='algae')addEntity('algae',x,clamp(y,42,fy));
    else if(type==='fish'){
      const f=addEntity('fish',x,clamp(y,42,fy-7));log(`${f.name} (${fishSpecies[f.species].name}) vừa được thả vào hồ.`,'good');
    }
    else if(type==='shrimp'||type==='snail')addEntity(type,x,Math.min(y,fy));
    else if(type==='food'){for(let i=0;i<5;i++)addEntity('food',x+rand(-6,6),clamp(y+rand(-4,4),WATER_TOP+5,fy));}
    return 'place';
  }

  let dragging=false,lastPlace=0,dragPlaced=false;
  canvas.addEventListener('pointerdown',e=>{
    dragging=true;dragPlaced=false;canvas.setPointerCapture(e.pointerId);
    const result=placeAt(e.clientX,e.clientY,e.button===2,true);dragPlaced=result==='place';lastPlace=performance.now();
  });
  canvas.addEventListener('pointermove',e=>{
    const r=canvas.getBoundingClientRect();world.cursor.x=(e.clientX-r.left)/r.width*W;world.cursor.y=(e.clientY-r.top)/r.height*H;world.cursor.inside=true;
    if(!dragging)return;if(performance.now()-lastPlace>90){placeAt(e.clientX,e.clientY,false,false);dragPlaced=true;lastPlace=performance.now();}
  });
  canvas.addEventListener('pointerleave',()=>world.cursor.inside=false);
  canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointercancel',()=>dragging=false);
  canvas.addEventListener('contextmenu',e=>{e.preventDefault();placeAt(e.clientX,e.clientY,true,false);});

  document.addEventListener('keydown',e=>{
    if(['INPUT','TEXTAREA'].includes(document.activeElement?.tagName))return;
    const it=items.find(i=>i.key.toLowerCase()===e.key.toLowerCase());if(it){world.selected=it.id;renderToolbar();}
  });

  document.getElementById('pauseBtn').onclick=()=>{world.paused=!world.paused;document.getElementById('pauseBtn').textContent=world.paused?'▶':'⏸';toast(world.paused?'Đã tạm dừng hồ':'Hồ tiếp tục chuyển động');};
  document.getElementById('speedBtn').onclick=()=>{world.speed=world.speed===1?3:world.speed===3?8:1;document.getElementById('speedBtn').textContent='▶ x'+world.speed;toast('Tốc độ mô phỏng x'+world.speed);};
  document.getElementById('waterTestBtn').onclick=openWaterTest;
  document.getElementById('aquadexBtn').onclick=()=>{renderAquadex();document.getElementById('aquadexDialog').showModal();};
  document.getElementById('journalBtn').onclick=()=>{renderJournal();document.getElementById('journalDialog').showModal();};
  document.getElementById('closeSideBtn').onclick=closeSide;document.getElementById('panelShade').onclick=closeSide;
  document.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>document.getElementById(b.dataset.close).close());
  document.getElementById('resetBtn').onclick=()=>{if(confirm('Làm lại toàn bộ hệ sinh thái V2?')){localStorage.removeItem(SAVE_KEY);seedWorld();}};
  document.getElementById('saveBtn').onclick=save;

  function serialize(){
    return {version:2,time:world.time,speed:world.speed,env:world.env,terrain:world.terrain,entities:world.entities,devices:world.devices,event:world.event,nextEventAt:world.nextEventAt,nextId:world.nextId,discovered:[...world.discovered],births:world.births,deaths:world.deaths,logs};
  }
  function save(){localStorage.setItem(SAVE_KEY,JSON.stringify(serialize()));toast('Đã lưu cả cuộc đời của hồ 💾');}
  function load(){
    const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;
    try{
      const s=JSON.parse(raw);if(s.version!==2)return false;
      world.time=s.time;world.speed=s.speed||1;world.env=s.env;world.terrain=s.terrain;world.entities=s.entities;world.devices=s.devices||{aerator:0,heater:0,lamp:0,filter:1};world.event=s.event||null;world.nextEventAt=s.nextEventAt||world.time+30;world.nextId=s.nextId||Math.max(1,...world.entities.map(e=>e.id+1));world.discovered=new Set(s.discovered||[]);world.births=s.births||0;world.deaths=s.deaths||0;
      logs.length=0;(s.logs||[]).forEach(l=>logs.push(l));
      for(const f of world.entities.filter(e=>e.type==='fish')){
        f.name=f.name||uniqueName();f.personality=f.personality||choice(personalities);f.genes=f.genes||makeGenes();f.bornAt=f.bornAt??world.time-rand(24,80);f.generation=f.generation||1;f.favoriteSpot=f.favoriteSpot||{x:rand(50,W-50),y:rand(60,160)};
      }
      log('Đã mở lại hồ V2 từ lần lưu trước.','good');return true;
    }catch(err){console.warn(err);return false;}
  }

  let last=performance.now(),uiTimer=0,autoSaveTimer=0;
  function loop(t){
    const dt=Math.min(2.5,(t-last)/16.6667);last=t;tick(dt);draw();uiTimer+=dt;autoSaveTimer+=dt;
    if(uiTimer>10){uiTimer=0;renderHeader();if(document.getElementById('sidePanel').classList.contains('open')){if(world.selectedFishId){const f=byId(world.selectedFishId);if(f)openFishProfile(f);}else renderZoneReadings();}}
    if(autoSaveTimer>1800){autoSaveTimer=0;localStorage.setItem(SAVE_KEY,JSON.stringify(serialize()));}
    requestAnimationFrame(loop);
  }

  renderToolbar();
  if(!load())seedWorld();else renderAllUI();
  document.getElementById('speedBtn').textContent='▶ x'+world.speed;
  requestAnimationFrame(loop);
})();
