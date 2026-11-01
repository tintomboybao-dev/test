// No external dependencies. Exercises rendering and event logic in a small DOM harness.
// This is a functional check, not a substitute for browser layout inspection.
const fs=require('fs'),vm=require('vm'),assert=require('assert'),path=require('path');
const base=path.resolve(__dirname,'..');
const decode=s=>String(s).replace(/&(amp|lt|gt|quot|#39|#x27);/g,(_,x)=>({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'",'#x27':"'"}[x]));
class Element {
 constructor(tag='div',attrs={},text=''){this.tagName=tag.toUpperCase();this.attrs={...attrs};this.children=[];this.parentElement=null;this.dataset={};this.hidden='hidden'in attrs;this.value=attrs.value||'';this.text=text;this.style={setProperty(k,v){this[k]=v;}};this.selectionStart=0;this.selectionEnd=0;for(const [k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,a)=>a.toUpperCase())]=v;
  this.classList={contains:c=>(this.attrs.class||'').split(/\s+/).includes(c),add:(...cs)=>{this.attrs.class=[...new Set((this.attrs.class||'').split(/\s+/).concat(cs))].join(' ').trim();},remove:c=>{this.attrs.class=(this.attrs.class||'').split(/\s+/).filter(x=>x!==c).join(' ');},toggle:(c,on)=>{on=on===undefined?!this.classList.contains(c):on;if(on)this.classList.add(c);else this.classList.remove(c);return on;}};
 }
 get id(){return this.attrs.id||'';}setAttribute(k,v){this.attrs[k]=String(v);}removeAttribute(k){delete this.attrs[k];}getAttribute(k){return this.attrs[k]??null;}
 get textContent(){return this.text+this.children.map(c=>c.textContent).join('');}set textContent(v){this.text=String(v);this.children=[];}
 set innerHTML(html){this._html=html;this.text='';this.children=parse(html);for(const c of this.children)c.parentElement=this;}
 get innerHTML(){return this._html||'';}
 focus(){document.activeElement=this;}scrollIntoView(){this.scrolled=true;}setSelectionRange(a,b){this.selectionStart=a;this.selectionEnd=b;}
 closest(sel){for(let el=this;el;el=el.parentElement)if(matches(el,sel))return el;return null;}
}
function parse(html){const root=new Element('root');let current=root;const voids=new Set(['input','meta','link','br','hr','img']);
 for(const token of html.match(/<!--[\s\S]*?-->|<![^>]*>|<[^>]*>|[^<]+/g)||[]){
  if(token.startsWith('<!'))continue;
  if(token.startsWith('</')){const tag=token.slice(2,-1).trim().toUpperCase();let q=current;while(q!==root&&q.tagName!==tag)q=q.parentElement;if(q!==root)current=q.parentElement;continue;}
  if(token.startsWith('<')){const match=token.match(/^<([\w-]+)([\s\S]*?)\/?\s*>$/);if(!match)continue;const attrs={};for(const a of match[2].matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))attrs[a[1]]=decode(a[2]??a[3]??a[4]??'');const el=new Element(match[1],attrs);el.parentElement=current;current.children.push(el);if(!voids.has(match[1])&&!token.endsWith('/>'))current=el;
  }else{const text=new Element('#text',{},decode(token));text.parentElement=current;current.children.push(text);}
 }
 const all=[];walk(root,all);for(const el of all)if(el.tagName==='SELECT'){const opts=el.children.filter(x=>x.tagName==='OPTION');el.value=(opts.find(x=>'selected'in x.attrs)||opts[0])?.attrs.value||'';}
 return root.children;
}
function walk(node,out){for(const c of node.children){out.push(c);walk(c,out);}}
function matches(el,sel){if(sel[0]==='#')return el.id===sel.slice(1);if(sel[0]==='.')return el.classList.contains(sel.slice(1));if(sel[0]==='['){const m=sel.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/);return m&&m[1]in el.attrs&&(m[2]===undefined||el.attrs[m[1]]===m[2]);}return el.tagName===sel.toUpperCase();}
const root=new Element('root');root.innerHTML=fs.readFileSync(path.join(base,'template.html'),'utf8');
const handlers={};const document={activeElement:new Element(),title:'',querySelectorAll(sel){const nodes=[];walk(root,nodes);return nodes.filter(n=>matches(n,sel));},querySelector(sel){return this.querySelectorAll(sel)[0]||null;},getElementById(id){return this.querySelector('#'+id);},addEventListener(type,fn){(handlers[type]??=[]).push(fn);}};
document.documentElement=document.querySelector('html');
document.getElementById('study-data').textContent=fs.readFileSync(path.join(base,'data.json'),'utf8');
const saved=new Map([['sui-db-done','[3,5]'],['sui-study-lab-v3-progress',JSON.stringify({s:[1],p:[2],theme:'light',scale:1})]]);
let failStorage=false;
const c={console,document,location:{hash:'#/db/home'},localStorage:{getItem:k=>saved.get(k)||null,setItem(k,v){if(failStorage)throw new Error('denied');saved.set(k,v);}},setTimeout:()=>0,clearTimeout(){},scrollTo(){},addEventListener(type,fn){(handlers[type]??=[]).push(fn);}};c.window=c;vm.createContext(c);
let code='';for(const [name,file]of [['DB_PROBLEMS','db-data.json'],['DB_KNOWLEDGE','db-knowledge.json'],['DB_PRACTICE','db-practice.json'],['DB_CHAPTERS','db-chapters.json']])code+=`const ${name}=${fs.readFileSync(path.join(base,file),'utf8')};\n`;
code+=fs.readFileSync(path.join(base,'db.js'),'utf8')+'\n'+fs.readFileSync(path.join(base,'app.js'),'utf8');vm.runInContext(code,c);
const run=s=>vm.runInContext(s,c),get=id=>document.getElementById(id),qs=s=>document.querySelector(s),all=s=>document.querySelectorAll(s);
function route(hash){c.location.hash=hash;for(const f of handlers.hashchange||[])f({});}
function click(el){assert(el,'missing click target');el.onclick?.({target:el});for(const f of handlers.click||[])f({target:el});}
function input(id,value,event='input'){const el=get(id);assert(el,id);el.value=value;el['on'+event]?.({target:el});}
assert.equal(run('dbProgress().samples.length'),2);assert(get('side-progress-label').textContent.includes('2 / 66'));
const practice=JSON.parse(fs.readFileSync(path.join(base,'db-practice.json')));
for(const p of practice){route('#/db/practice/'+p.id);assert(get('view').innerHTML.includes(p.title));assert.equal(all('.db-solution').length,1);assert(!('open'in qs('.db-solution').attrs));assert(all('[data-db-jump]').length>0);assert(get('view').innerHTML.includes(p.source.location));}
for(let id=3;id<=7;id++){route('#/db/samples/'+id);assert(all('[data-db-jump]').length>=4);click(all('[data-db-jump]')[0]);assert(document.activeElement.scrolled);}
route('#/db/practice');assert.equal(all('.db-filter-item').length,39);assert(get('db-filter-count').textContent.includes('39 / 39'));
input('db-topic-filter','3','change');assert.equal(all('.db-filter-item').filter(n=>!n.hidden).length,15);
input('db-search','phu toi thieu');assert.equal(all('.db-filter-item').filter(n=>!n.hidden).length,5);
input('db-search','no-such-topic-xyz');assert.equal(get('db-empty').hidden,false);
route('#/db/practice/c3-02-1');const button=qs('[data-db-kind]');click(button);assert.equal(button.getAttribute('aria-pressed'),'true');assert(run("dbProgress().practice.includes('c3-02-1')"));assert(get('side-progress-label').textContent.includes('3 / 66'));
route('#/db/practice');input('db-search','');input('db-topic-filter','0','change');input('db-status-filter','done','change');assert.equal(all('.db-filter-item').filter(n=>!n.hidden).length,1);
route('#/db/knowledge/2');assert.equal(all('.db-filter-item').filter(n=>!n.hidden).length,6);input('db-search','phep chia');assert.equal(all('.db-filter-item').filter(n=>!n.hidden).length,1);
input('db-search','');const knowledgeButton=all('[data-db-kind]').find(b=>b.dataset.dbId==='5');click(knowledgeButton);assert(run('dbProgress().knowledge.includes(5)'));
route('#/db/home');assert(get('view').innerHTML.includes('4 / 66'));assert.equal(all('progress').length,3);
route('#/db/sources/3');assert(all('details').some(n=>'open'in n.attrs&&n.textContent.includes('Chủ đề 3')));
route('#/db/practice/invalid');assert(get('view').textContent.includes('Không tìm thấy bài'));
route('#/home');assert(get('top-course').textContent==='TOÁN RỜI RẠC');assert(get('side-progress-label').textContent.includes('2 / 69'));assert.equal(all('progress').length,2);assert(!get('sidebar-nav').innerHTML.includes('#/db/'));
click(get('theme-toggle'));assert.equal(document.documentElement.dataset.theme,'dark');assert.equal(JSON.parse(saved.get('sui-study-lab-v3-progress')).s[0],1);
route('#/db/practice/c3-02-1');assert.equal(qs('[data-db-kind]').getAttribute('aria-pressed'),'true');failStorage=true;click(qs('[data-db-kind]'));assert(get('view').textContent.includes('Chưa lưu được tiến độ'));assert(run("dbProgress().practice.includes('c3-02-1')"));failStorage=false;
saved.set('sui-db-progress',JSON.stringify({samples:[3,3,88],knowledge:[0,0,21,22,'4'],practice:['c1-01','c1-01','missing']}));assert.equal(run('dbProgress().samples.length'),1);assert.equal(run('dbProgress().knowledge.length'),2);assert.equal(run('dbProgress().practice.length'),1);
saved.set('sui-db-progress','{bad json');assert.equal(run('dbProgress().samples.length'),2);
const html=fs.readFileSync(path.join(base,'index.html'),'utf8');assert(html.includes('const DB_PRACTICE='));assert(!html.includes('/* INLINE_'));
console.log('PASS: 39 practice routes, 5 midterm routes, 4 topics, search/filter/empty states, section navigation, 3 progress metrics, legacy migration, storage failure, subject switching, math progress and theme controls.');
