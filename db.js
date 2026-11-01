'use strict';
const DB_DESCRIPTIONS = [
 'Dữ liệu và DBMS, kiến trúc ba mức, mô hình ER, bảng, khóa và toàn vẹn.',
 'Chọn, chiếu, tập hợp, kết, đổi tên, chia, gom nhóm và kiểm tra truy vấn.',
 'Phụ thuộc hàm, Armstrong, bao đóng, phủ tối thiểu và tìm tất cả khóa.',
 '1NF, 2NF, 3NF, BCNF; phân rã, bảo toàn thông tin và phụ thuộc hàm.'
];
const DB_FILTERS = {knowledge:{query:'',chapter:'0',status:'all'},practice:{query:'',chapter:'0',status:'all'}};
const dbEsc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dbNorm = value => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/đ/g,'d');
function dbReadStore(key,fallback) {try {return JSON.parse(localStorage.getItem(key)||'null') ?? fallback;}catch{return fallback;}}
function dbProgress() {
 const old=dbReadStore('sui-db-done',[]),raw=dbReadStore('sui-db-progress',null);
 const data=raw && typeof raw==='object' && !Array.isArray(raw)?raw:{samples:old};
 const valid=(a,test)=>[...new Set(Array.isArray(a)?a.filter(test):[])];
 return {
  samples:valid(data.samples,n=>DB_PROBLEMS.some(p=>p.id===n)),
  knowledge:valid(data.knowledge,n=>Number.isInteger(n)&&n>=0&&n<DB_KNOWLEDGE.length),
  practice:valid(data.practice,id=>DB_PRACTICE.some(p=>p.id===id))
 };
}
function dbToggle(kind,id) {
 const data=dbProgress();
 const valid=kind==='knowledge'?Number.isInteger(id)&&id>=0&&id<DB_KNOWLEDGE.length:kind==='samples'?DB_PROBLEMS.some(p=>p.id===id):kind==='practice'&&DB_PRACTICE.some(p=>p.id===id);
 if(!valid)return false;
 data[kind]=data[kind].includes(id)?data[kind].filter(n=>n!==id):data[kind].concat(id);
 try {localStorage.setItem('sui-db-progress',JSON.stringify(data));return true;}catch{return false;}
}
function dbTitle(t,d) {return `<div class="page-intro"><div class="eyebrow">MÔN HỌC 02 / CƠ SỞ DỮ LIỆU</div><h1 class="page-title">${dbEsc(t)}</h1><p class="page-description">${dbEsc(d)}</p></div>`;}
function dbSource(chapter,location='') {return `<a class="db-source-link" href="#/db/sources/${chapter}">Nguồn: chủ đề ${chapter}${location?' · '+dbEsc(location):''} →</a>`;}
function dbDoneButton(kind,id) {
 const done=dbProgress()[kind].includes(id);
 return `<button type="button" class="btn ${done?'success':'soft'}" data-db-kind="${kind}" data-db-id="${id}" aria-pressed="${done}">${done?'Đã nắm — bỏ đánh dấu':'Đánh dấu đã nắm'}</button>`;
}
function dbToolbar(kind,chapter=0) {
 const state=DB_FILTERS[kind];if(chapter)state.chapter=String(chapter);
 return `<div class="toolbar db-toolbar"><input class="search" id="db-search" type="search" placeholder="${kind==='practice'?'Tìm bài tập, phương pháp, từ khóa…':'Tìm kiến thức, công thức…'}" aria-label="Tìm trong ${kind==='practice'?'bài tập':'kiến thức'}" value="${dbEsc(state.query)}"><select class="select" id="db-topic-filter" aria-label="Lọc chủ đề"><option value="0">Tất cả 4 chủ đề</option>${DB_CHAPTERS.map(c=>`<option value="${c.id}" ${state.chapter===String(c.id)?'selected':''}>${c.id}. ${dbEsc(c.title)}</option>`).join('')}</select><select class="select db-status-filter" id="db-status-filter" aria-label="Lọc tiến độ">${[['all','Tất cả tiến độ'],['pending','Chưa đánh dấu'],['done','Đã nắm']].map(([value,label])=>`<option value="${value}" ${state.status===value?'selected':''}>${label}</option>`).join('')}</select></div><p class="toolbar-meta" id="db-filter-count" role="status" aria-live="polite"></p>`;
}
function dbReading(body,prefix) {
 let i=0;const toc=[];
 const html=body.replace(/<h2>(.*?)<\/h2>/g,(_,label)=>{const id=prefix+'-part-'+(++i);toc.push([id,label]);return `<h2 id="${id}" tabindex="-1">${label}</h2>`;});
 return `<nav class="db-toc" aria-label="Mục lục lời giải"><strong>Đi đến phần cần học</strong><div>${toc.map(([id,label])=>`<button type="button" data-db-jump="${id}">${label}</button>`).join('')}</div></nav>${html}`;
}
function dbDetail(item,kind) {
 const sample=kind==='samples',collection=sample?DB_PROBLEMS:DB_PRACTICE,index=collection.indexOf(item),previous=collection[index-1],next=collection[index+1];
 const src=sample?`Đề ôn tập giữa kỳ · Bài ${item.id} · De_On_Tap_Giua_Ky_CSDL_v2.docx`: `Chủ đề ${item.chapter} · ${item.source.location}`;
 let body=dbTitle((sample?'Bài '+item.id+'. ':'')+item.title,src)+`<a class="backlink" href="#/db/${kind}">← ${sample?'Danh sách đề mẫu':'Danh sách bài ôn tập'}</a><div class="db-reading"><section class="reading-card"><div class="card-kicker">01 / ĐỌC ĐỀ</div><h2>Đề bài</h2><p class="db-text">${dbEsc(item.statement)}</p>${sample?'':dbSource(item.chapter,item.source.location)}</section>`;
 if(sample){
  if(item.note)body+=`<div class="warning"><strong>Lưu ý khi đối chiếu lời giải</strong>${dbEsc(item.note)}</div>`;
  body+=dbReading(item.body,'sample-'+item.id);
 }else{
  body+=`<details class="db-disclosure"><summary>02 / Mở gợi ý cách làm</summary><div class="db-disclosure-body"><p>${dbEsc(item.hint)}</p><a class="backlink" href="#/db/knowledge/${item.chapter}">Ôn kiến thức chủ đề ${item.chapter} →</a></div></details><details class="db-disclosure db-solution"><summary>03 / Mở lời giải từng bước</summary><div class="db-solution-body">${dbReading(item.body,'practice-'+item.id)}</div></details>`;
 }
 body+=`<section class="reading-card"><div class="card-kicker">TỰ KIỂM TRA</div><h2>Sủi đã tự trình bày được chưa?</h2><p>${dbEsc(item.check)}</p><p class="muted-note">Đánh dấu khi có thể tự làm lại mà không cần xem đáp án. Tiến độ được lưu riêng trên trình duyệt này.</p><div class="detail-actions">${dbDoneButton(kind,item.id)}<a class="btn" href="#/db/${kind}">Về danh sách</a></div><p class="db-save-status" role="status" aria-live="polite"></p></section><div class="footer-buttons">${previous?`<a class="btn" href="#/db/${kind}/${previous.id}">← Bài trước</a>`:'<span></span>'}${next?`<a class="btn" href="#/db/${kind}/${next.id}">Bài tiếp →</a>`:'<span></span>'}</div></div>`;
 return body;
}
function dbHome() {
 const progress=dbProgress(),done=progress.knowledge.length+progress.samples.length+progress.practice.length;
 return `<div class="intro-card"><div><div class="eyebrow">SỔ TAY HỌC TẬP / MÔN HỌC 02</div><h1>Hiểu dữ liệu.<br><span class="highlight">Tự tin giải bài.</span></h1><p>Nắm kiến thức bằng ví dụ dễ hiểu, theo dõi lời giải giữa kỳ từng bước, rồi tự luyện bài tập từ cả bốn chủ đề trong bài giảng.</p><div class="actions"><a class="btn primary" href="#/db/knowledge">Bắt đầu từ kiến thức</a><a class="btn" href="#/db/practice">Đến ${DB_PRACTICE.length} bài ôn tập</a></div></div><div class="intro-aside"><div><div class="big-number">${DB_KNOWLEDGE.length}</div><div class="stat-label">mục kiến thức giải thích chi tiết</div></div><div><div class="big-number">${DB_PROBLEMS.length}</div><div class="stat-label">bài giữa kỳ, đầy đủ từng ý</div></div><div><div class="big-number">${DB_PRACTICE.length}</div><div class="stat-label">bài và bộ bài ôn tập có lời giải</div></div></div></div>
 <div class="section-head"><h2>Lộ trình học đề xuất</h2><p>Ba bước từ hiểu đến vận dụng</p></div><div class="path-grid">${[['knowledge','01 / NẮM VỮNG','Kiến thức và công thức','Đọc ý nghĩa, các bước áp dụng, ví dụ và lỗi dễ nhầm.'],['samples','02 / HIỂU PHƯƠNG PHÁP','Đề mẫu và lời giải','Bài 3–7: đọc đề, giải từng ý, chứng minh và kiểm tra kết quả.'],['practice','03 / TỰ VẬN DỤNG','Ôn tập từ bài giảng','Tự làm trước, mở gợi ý khi cần rồi đối chiếu lời giải chi tiết.']].map(([r,k,t,d])=>`<a class="path-card" href="#/db/${r}"><div class="path-index">BƯỚC ${k}</div><h3>${t}</h3><p>${d}</p><span class="link-text">Mở nội dung →</span></a>`).join('')}</div>
 <div class="section-head"><h2>Tổng quan 4 chủ đề</h2><p>${done} / ${DB_KNOWLEDGE.length+DB_PROBLEMS.length+DB_PRACTICE.length} nội dung đã nắm</p></div><div class="topic-mini-grid">${DB_CHAPTERS.map((c,i)=>`<article class="topic-mini"><div class="eyebrow">CHỦ ĐỀ ${c.id}</div><h3>${dbEsc(c.title)}</h3><p>${DB_DESCRIPTIONS[i]}</p><div class="db-topic-links"><a href="#/db/knowledge/${c.id}">${DB_KNOWLEDGE.filter(k=>k.chapter===c.id).length} mục kiến thức →</a><a href="#/db/practice/topic/${c.id}">${DB_PRACTICE.filter(p=>p.chapter===c.id).length} bài ôn tập →</a></div></article>`).join('')}</div>
 ${studyProgressPanel(progress.knowledge.length,DB_KNOWLEDGE.length,progress.samples.length,DB_PROBLEMS.length,'db')}
 <section class="reading-card db-source-note"><h2>Học cùng tài liệu gốc</h2><p>Bài ôn tập có ghi trang hoặc slide của từng tài liệu. Với bài mở, lời giải nêu rõ giả thiết và dữ liệu minh họa. Số slide là vị trí trong tệp PowerPoint; số in ở chân slide có thể khác.</p><a class="backlink" href="#/db/sources">Đối chiếu bài giảng theo chủ đề →</a></section>`;
}
function dbKnowledge(chapter) {
 const progress=dbProgress();
 return dbTitle('Kiến thức và tổng hợp công thức','Hiểu bằng lời → các bước áp dụng → ví dụ → tự kiểm tra. Mở phần giải thích của mục đang học, rồi đánh dấu khi đã nắm.')+dbToolbar('knowledge',chapter)+DB_KNOWLEDGE.map((k,i)=>`<article class="formula-item db-knowledge db-filter-item" data-chapter="${k.chapter}" data-db-item="${i}"><div class="formula-top"><h2>${dbEsc(k.title)}</h2><span class="formula-num">CHỦ ĐỀ ${k.chapter}</span></div><div class="db-equation">${dbEsc(k.formula)}</div><p>${dbEsc(k.explain)}</p><details class="db-disclosure db-knowledge-detail"><summary>Giải thích, cách làm và ví dụ</summary><div class="db-disclosure-body">${k.detail}</div></details><details class="db-disclosure db-selfcheck"><summary>Tự kiểm tra: ${dbEsc(k.selfTest.question)}</summary><div class="db-disclosure-body"><p>${dbEsc(k.selfTest.answer)}</p></div></details><div class="db-related"><strong>Luyện ngay:</strong>${k.practice.map(id=>{const p=DB_PRACTICE.find(x=>x.id===id);return p?`<a href="#/db/practice/${p.id}">${dbEsc(p.title)} →</a>`:'';}).join('')}</div>${dbSource(k.chapter)}<div class="detail-actions">${dbDoneButton('knowledge',i)}</div></article>`).join('')+'<p class="empty" id="db-empty" hidden>Không có mục phù hợp. Thử đổi từ khóa, chủ đề hoặc trạng thái tiến độ.</p>';
}
function dbPracticeList(chapter) {
 const progress=dbProgress();
 return dbTitle('Ôn tập vận dụng','39 bài và bộ bài từ các mục bài tập của 4 tài liệu bài học. Mỗi bài có đề, nguồn, gợi ý, lời giải chi tiết và câu tự kiểm tra.')+dbToolbar('practice',chapter)+`<div class="list-stack">${DB_PRACTICE.map((p,i)=>`<article class="problem-row db-filter-item" data-chapter="${p.chapter}" data-db-item="${p.id}"><div class="row-no">${String(i+1).padStart(2,'0')}</div><div class="row-content"><h2>${dbEsc(p.title)}</h2><p>${dbEsc(p.statement)}</p><div class="row-meta"><span class="tag">Chủ đề ${p.chapter}</span><span class="tag">${dbEsc(p.level)}</span>${progress.practice.includes(p.id)?'<span class="tag done">Đã nắm</span>':''}</div><div class="db-row-source">${dbEsc(p.source.location)}</div></div><div class="row-action"><a class="btn small" href="#/db/practice/${p.id}">Tự làm bài →</a></div></article>`).join('')}</div><p class="empty" id="db-empty" hidden>Không có bài phù hợp. Thử đổi từ khóa, chủ đề hoặc trạng thái tiến độ.</p>`;
}
window.dbRender=function() {
 const path=location.hash.split('/'),page=path[2]||'home',id=path[3]||'',chapter=Number(id),view=document.getElementById('view');
 let body='',filterKind='';
 if(page==='home')body=dbHome();
 else if(page==='knowledge'){body=dbKnowledge(chapter>=1&&chapter<=4?chapter:0);filterKind='knowledge';}
 else if(page==='practice'&&(!id||id==='topic')){body=dbPracticeList(Number(path[4])>=1&&Number(path[4])<=4?Number(path[4]):0);filterKind='practice';}
 else if(page==='practice'||page==='samples'&&id){
  const item=(page==='practice'?DB_PRACTICE:DB_PROBLEMS).find(p=>String(p.id)===id);
  body=item?dbDetail(item,page):dbTitle('Không tìm thấy bài','Bài này không có trong bộ nội dung hiện tại.')+`<a class="btn" href="#/db/${page}">Về danh sách bài</a>`;
 }else if(page==='samples'){
  const progress=dbProgress();
  body=dbTitle('Đề mẫu giữa kỳ và lời giải','Bài 3–7 của đề Word, giải thích từng ý và giữ cách trình bày bảng bao đóng, phủ tối thiểu, khóa theo tài liệu hướng dẫn.')+`<p class="toolbar-meta">${progress.samples.length} / ${DB_PROBLEMS.length} bài đã nắm</p><div class="list-stack">${DB_PROBLEMS.map(p=>`<article class="problem-row"><div class="row-no">${p.id}</div><div class="row-content"><h2>${dbEsc(p.title)}</h2><p>${dbEsc(p.statement)}</p><div class="row-meta"><span class="tag">Đề giữa kỳ · Bài ${p.id}</span>${progress.samples.includes(p.id)?'<span class="tag done">Đã nắm</span>':''}</div></div><div class="row-action"><a class="btn small" href="#/db/samples/${p.id}">Đọc lời giải →</a></div></article>`).join('')}</div>`;
 }else if(page==='sources'){
  body=dbTitle('Bài giảng theo 4 chủ đề','Bản trích chữ từ các tài liệu PDF và PowerPoint đã cung cấp. Bài tập và lời giải được biên soạn ở mục Ôn tập vận dụng; nội dung dưới đây dùng để đối chiếu nguồn.')+DB_CHAPTERS.map(c=>`<details class="reading-card" ${chapter===c.id?'open':''}><summary>Chủ đề ${c.id}. ${dbEsc(c.title)}</summary><pre class="db-source">${dbEsc(c.text)}</pre></details>`).join('');
 }else body=dbTitle('Không tìm thấy trang','Chọn một danh mục Cơ sở dữ liệu để tiếp tục.')+'<a class="btn" href="#/db/home">Về tổng quan</a>';
 view.innerHTML=body;
 document.title=(({home:'Tổng quan',knowledge:'Kiến thức',samples:'Đề giữa kỳ',practice:'Ôn tập',sources:'Bài giảng'})[page]||'Học tập')+' Cơ sở dữ liệu | Sủi Study Lab';
 document.getElementById('top-section').textContent=({home:'TỔNG QUAN',knowledge:'KIẾN THỨC VÀ CÔNG THỨC',samples:'ĐỀ MẪU',practice:'ÔN TẬP VẬN DỤNG',sources:'BÀI GIẢNG'})[page]||'CƠ SỞ DỮ LIỆU';
 const input=document.getElementById('db-search'),topic=document.getElementById('db-topic-filter'),status=document.getElementById('db-status-filter');
 function applyFilter(){
  if(!filterKind||!input||!topic||!status)return;
  const state=DB_FILTERS[filterKind];state.query=input.value;state.chapter=topic.value;state.status=status.value;
  const progress=dbProgress(),done=progress[filterKind],total=filterKind==='knowledge'?DB_KNOWLEDGE.length:DB_PRACTICE.length;let count=0;
  document.querySelectorAll('.db-filter-item').forEach(el=>{
   const key=filterKind==='knowledge'?Number(el.dataset.dbItem):el.dataset.dbItem,isDone=done.includes(key);
   el.hidden=!(topic.value==='0'||el.dataset.chapter===topic.value)||!dbNorm(el.textContent).includes(dbNorm(input.value))||(status.value==='done'&&!isDone)||(status.value==='pending'&&isDone);
   if(!el.hidden)count++;
  });
  document.getElementById('db-filter-count').textContent=`Đang hiển thị ${count} / ${total} ${filterKind==='knowledge'?'mục kiến thức':'bài ôn tập'} · ${done.length} đã nắm`;
  document.getElementById('db-empty').hidden=count>0;
 }
 if(input&&topic&&status){input.oninput=applyFilter;topic.onchange=applyFilter;status.onchange=applyFilter;applyFilter();}
 document.querySelectorAll('[data-db-kind]').forEach(button=>{button.onclick=()=>{
  const kind=button.dataset.dbKind,key=kind==='practice'?button.dataset.dbId:Number(button.dataset.dbId);
  const saved=dbToggle(kind,key),label=document.querySelector('.db-save-status');
  if(label)label.textContent=saved?'Tiến độ đã được lưu.':'Chưa lưu được tiến độ. Trình duyệt đang chặn lưu trữ.';
  if(!saved){const toast=document.getElementById('toast');if(toast){toast.textContent='Chưa lưu được tiến độ. Trình duyệt đang chặn lưu trữ.';toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),4000);}return;}
  const done=dbProgress()[kind].includes(key);button.textContent=done?'Đã nắm — bỏ đánh dấu':'Đánh dấu đã nắm';button.classList.toggle('success',done);button.classList.toggle('soft',!done);button.setAttribute('aria-pressed',String(done));syncCourseShell();applyFilter();
 }});
 document.querySelectorAll('[data-db-jump]').forEach(button=>{button.onclick=()=>{const heading=document.getElementById(button.dataset.dbJump);if(heading){heading.scrollIntoView({block:'start',behavior:'auto'});heading.focus({preventScroll:true});}};});
 syncCourseShell();
};
window.syncCourseShell=function(){
 const db=location.hash.startsWith('#/db'),page=(db?location.hash.split('/')[2]:location.hash.replace(/^#\/?/,'').split('/')[0])||'home';
 document.querySelectorAll('[data-course]').forEach(a=>{const active=a.dataset.course===(db?'db':'math');a.classList.toggle('selected',active);if(active)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});
 const items=db?[['home','Tổng quan',''],['knowledge','Kiến thức và công thức',DB_KNOWLEDGE.length],['samples','Đề mẫu và lời giải',DB_PROBLEMS.length],['practice','Ôn tập vận dụng',DB_PRACTICE.length],['sources','Bài giảng theo chủ đề',DB_CHAPTERS.length]]:[['home','Tổng quan',''],['formulas','Tổng hợp công thức',20],['samples','Đề mẫu và lời giải',19],['practice','Ôn tập vận dụng',50]];
 const href=r=>db?'#/db/'+r:'#/'+r;
 document.getElementById('sidebar-nav').innerHTML=items.map(([r,t,n],i)=>`<a data-route="${r}" href="${href(r)}" class="${r===page?'active':''}" ${r===page?'aria-current="page"':''}><span>0${i+1}</span> ${t} ${n?`<em>${n}</em>`:''}</a>`).join('');
 document.querySelector('.mobile-nav').innerHTML=items.map(([r,t])=>`<a data-route="${r}" href="${href(r)}" class="${r===page?'active':''}" ${r===page?'aria-current="page"':''}>${t}</a>`).join('');
 document.getElementById('top-course').textContent=db?'CƠ SỞ DỮ LIỆU':'TOÁN RỜI RẠC';
 if(db){const p=dbProgress(),done=p.samples.length+p.knowledge.length+p.practice.length,total=DB_PROBLEMS.length+DB_KNOWLEDGE.length+DB_PRACTICE.length;document.getElementById('side-progress-label').textContent=`${done} / ${total} nội dung · ${Math.round(done*100/total)}%`;document.getElementById('side-progress-bar').style.width=(done*100/total)+'%';}
 document.querySelector('.progress-title').textContent='Tiến độ '+(db?'Cơ sở dữ liệu':'Toán rời rạc');
};
function studyProgressPanel(first,firstTotal,second,secondTotal,course){
 const db=course==='db',metrics=db?[['Kiến thức đã nắm',first,firstTotal],['Bài giữa kỳ đã nắm',second,secondTotal],['Bài ôn tập đã nắm',dbProgress().practice.length,DB_PRACTICE.length]]:[['Đề mẫu đã nắm',first,firstTotal],['Bài ôn tập đã nắm',second,secondTotal]];
 const done=metrics.reduce((n,m)=>n+m[1],0),total=metrics.reduce((n,m)=>n+m[2],0),percent=Math.round(done*100/total);
 return `<section class="learning-progress" aria-label="Tiến độ ${db?'Cơ sở dữ liệu':'Toán rời rạc'}"><div class="progress-overview"><div class="eyebrow">TIẾN ĐỘ CỦA BẠN</div><h2>Từng bước vững kiến thức</h2><p>Mỗi nội dung đã nắm là một bước tiến.</p><div class="progress-total"><strong>${percent}<span>%</span></strong><span>${done} / ${total} nội dung hoàn thành</span></div></div><div class="progress-breakdown">${metrics.map(([name,n,t])=>`<div class="progress-metric"><div class="metric-label"><strong>${name}</strong><span>${n} <small>/ ${t}</small></span></div><progress value="${n}" max="${t}" aria-label="${name}">${n} / ${t}</progress></div>`).join('')}<div class="progress-footnote">Đánh dấu “Đã nắm” khi bạn có thể tự trình bày lại. Tiến độ được lưu trên trình duyệt này.</div></div></section>`;
}

document.addEventListener('keydown',event=>{
 if(!location.hash.startsWith('#/db'))return;
 const input=document.getElementById('db-search');if(!input)return;
 if(event.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!event.ctrlKey&&!event.metaKey){event.preventDefault();input.focus();}
 if(event.key==='Escape'&&document.activeElement===input){input.value='';input.oninput?.();}
});
