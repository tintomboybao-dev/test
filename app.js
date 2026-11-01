(() => {
  'use strict';
  const DATA = JSON.parse(document.getElementById('study-data').textContent);
  const viewEl = document.getElementById('view');
  const sideLabel = document.getElementById('side-progress-label');
  const sideBar = document.getElementById('side-progress-bar');
  const topSection = document.getElementById('top-section');
  const formulaById = Object.fromEntries(DATA.formulas.map(f => [f.id, f]));
  const topicById = Object.fromEntries(DATA.topics.map(t => [t.id, t]));
  const STORE = 'sui-study-lab-v3-progress';
  const state = {doneSamples:new Set(), donePractice:new Set(), theme:'light', scale:1, query:'', topic:'all', hintOpen:{}, solutionOpen:{}};
  function esc(s) {return String(s ?? '').replace(/[&<>"']/g,c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
  function multiline(s) {return esc(s).replace(/\n/g,'<br>');}
  function formattedMath(s){return esc(s).replace(/\^(\d+)/g,'<sup>$1</sup>');}
  function safeSave() {
    try {localStorage.setItem(STORE, JSON.stringify({s:[...state.doneSamples],p:[...state.donePractice],theme:state.theme,scale:state.scale}));} catch(e) {}
  }
  function load() {
    try {
      const data=JSON.parse(localStorage.getItem(STORE)||'{}');
      if(Array.isArray(data.s)) state.doneSamples=new Set(data.s.filter(n=>Number.isInteger(n)&&n>=1&&n<=19));
      if(Array.isArray(data.p)) state.donePractice=new Set(data.p.filter(n=>Number.isInteger(n)&&n>=1&&n<=50));
      if(data.theme==='dark'||data.theme==='light') state.theme=data.theme;
      if(typeof data.scale==='number'&&data.scale>=.9&&data.scale<=1.3) state.scale=data.scale;
    } catch(e) {}
    setAppearance();
  }
  function setAppearance() {
    document.documentElement.dataset.theme=state.theme;
    document.documentElement.style.setProperty('--scale',String(state.scale));
    document.getElementById('theme-toggle').textContent=state.theme==='light'?'Chế độ tối':'Chế độ sáng';
  }
  function progress() {
    const n=state.doneSamples.size+state.donePractice.size;
    sideLabel.textContent=`${n} / 69 bài`;
    sideBar.style.width=`${100*n/69}%`;
  }
  function route() {
    let path=location.hash.replace(/^#\/?/,'').split('/').filter(Boolean);
    if(!['home','formulas','samples','practice'].includes(path[0])) path=['home'];
    if((path[0]==='samples'&&path[1]&&!DATA.samples.some(p=>p.id===Number(path[1])))||(path[0]==='practice'&&path[1]&&!DATA.reviews.some(p=>p.id===Number(path[1]))))path=path.slice(0,1);
    return {page:path[0],id:path[1]?Number(path[1]):null};
  }
  function link(page,id) {return '#/'+page+(id?'/'+id:'');}
  function topicName(id) {return topicById[id]?.short||id;}
  function setNav(page) {
    document.querySelectorAll('[data-route]').forEach(a=>{let active=a.dataset.route===page;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    topSection.textContent=({home:'TỔNG QUAN',formulas:'CÔNG THỨC',samples:'ĐỀ MẪU',practice:'ÔN TẬP'})[page];
  }
  function title(kicker,title,description) {
    return `<div class="page-intro"><div class="eyebrow">${esc(kicker)}</div><h1 class="page-title">${esc(title)}</h1><p class="page-description">${esc(description)}</p></div>`;
  }
  function math(formula) {return `<div class="math-display" aria-label="${esc(formula.general)}">${formula.mathml}</div>`;}
  function formulaSmall(f) {return `<div class="formula-ref"><h3>Công thức tổng quát</h3>${math(f)}<p class="formula-inline">${esc(f.general)}</p></div>`;}
  function completionTag(page,id) {return (page==='samples'?state.doneSamples:state.donePractice).has(id)?'<span class="tag done">Đã hoàn thành</span>':'';}
  function home() {
    const done=state.doneSamples.size+state.donePractice.size;
    return `<div class="intro-card"><div><div class="eyebrow">SỔ TAY HỌC TẬP / MÔN 01</div><h1>Học công thức.<br><span class="highlight">Hiểu từng bước.</span></h1><p>Trang học Toán rời rạc theo đúng trình tự: nắm công thức tổng quát, đối chiếu bài mẫu có lời giải, sau đó tự vận dụng qua 50 câu luyện tập. Mỗi phần đều có hướng dẫn để Sủi dễ theo dõi và tự học.</p><div class="actions"><a class="btn primary" href="#/formulas">Bắt đầu từ công thức</a><a class="btn" href="#/practice">Đến 50 bài ôn tập</a></div></div><div class="intro-aside"><div><div class="big-number">20</div><div class="stat-label">công thức trọng tâm</div></div><div><div class="big-number">19</div><div class="stat-label">bài mẫu đã giải</div></div><div><div class="big-number">50</div><div class="stat-label">bài luyện tập mới</div></div></div></div>
    <div class="section-head"><h2>Lộ trình học đề xuất</h2><p>Ba bước từ hiểu đến vận dụng</p></div><div class="path-grid">
      <a class="path-card" href="#/formulas"><div class="path-index">BƯỚC 01 / NẮM VỮNG</div><h3>Tổng hợp công thức</h3><p>20 công thức có điều kiện áp dụng, cách sử dụng, ví dụ và lỗi thường gặp.</p><span class="link-text">Mở sổ tay công thức →</span></a>
      <a class="path-card" href="#/samples"><div class="path-index">BƯỚC 02 / HIỂU PHƯƠNG PHÁP</div><h3>19 đề mẫu giải chi tiết</h3><p>Mỗi bài đi từ nhận dạng đề, công thức tổng quát đến các bước thay số và kết luận.</p><span class="link-text">Xem đề mẫu →</span></a>
      <a class="path-card" href="#/practice"><div class="path-index">BƯỚC 03 / TỰ VẬN DỤNG</div><h3>50 bài ôn tập</h3><p>Tự làm trước, mở gợi ý để xem công thức và ví dụ, cuối cùng mới xem lời giải.</p><span class="link-text">Bắt đầu ôn tập →</span></a></div>
      <div class="section-head"><h2>Tổng quan 8 chủ đề</h2><p>${done} / 69 bài đã hoàn thành</p></div><div class="topic-mini-grid">${DATA.topics.map(t=>`<a class="topic-mini" href="#/formulas"><h3>${esc(t.name)}</h3><p>${esc(t.description)}</p></a>`).join('')}</div>
      ${studyProgressPanel(state.doneSamples.size,19,state.donePractice.size,50,'math')}<div class="reminder"><strong>Về đề gốc:</strong> Câu 8 trong bộ 19 đề mẫu sử dụng số liệu biểu đồ Venn minh họa do Sủi không nhớ dữ kiện ban đầu. Câu 14 phân tích cả hai trường hợp có và không được lặp tuyến. Đây là trang học offline, không cần tài khoản hay thư viện bên ngoài.</div>`;
  }
  function toolbar(placeholder) {
    return `<div class="toolbar"><input id="search-box" class="search" type="search" placeholder="${esc(placeholder)}" aria-label="Tìm kiếm" autocomplete="off" value="${esc(state.query)}"><select class="select" id="topic-filter" aria-label="Lọc theo chủ đề"><option value="all">Tất cả 8 chủ đề</option>${DATA.topics.map(t=>`<option value="${esc(t.id)}" ${state.topic===t.id?'selected':''}>${esc(t.short)}</option>`).join('')}</select></div>`;
  }
  function filterItems(items) {
    const query=state.query.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase();
    return items.filter(p=>state.topic==='all'||p.topic===state.topic).filter(p=>[p.title,p.statement,p.name,p.general,p.when,p.example].some(s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').toLowerCase().includes(query)));
  }
  function formulaCard(f,index) {
    return `<article class="formula-item" id="formula-${esc(f.id)}"><div class="formula-top"><h3>${esc(f.title)}</h3><span class="formula-num">CT ${String(index+1).padStart(2,'0')}</span></div>${math(f)}<p class="formula-inline">${esc(f.general)}</p><div class="facts"><div class="fact"><strong>Khi nào sử dụng?</strong><p>${esc(f.when)}</p></div><div class="fact"><strong>Cách áp dụng</strong><p>${esc(f.apply)}</p></div></div><div class="formula-example"><strong>VÍ DỤ MẪU</strong>${esc(f.example)}</div><div class="warning"><strong>Lỗi thường gặp</strong>${esc(f.mistake)}</div></article>`;
  }
  function formulas() {
    const list=filterItems(DATA.formulas);
    let groups='';let position=0;
    for(const topic of DATA.topics){const arr=list.filter(x=>x.topic===topic.id);if(!arr.length)continue;groups+=`<section class="formula-group" aria-label="${esc(topic.name)}"><h2 class="formula-group-title">${esc(topic.name)}</h2>${arr.map(f=>formulaCard(f,DATA.formulas.indexOf(f))).join('')}</section>`;position+=arr.length;}
    return title('BƯỚC 01 / SỔ TAY CÔNG THỨC','Tổng hợp công thức Toán rời rạc','Mỗi công thức đi kèm điều kiện dùng, quy trình thế vào đề, một ví dụ tính toán và lỗi cần tránh. Công thức được hiển thị bằng MathML và hoạt động cả khi offline.')+toolbar('Tìm công thức, điều kiện sử dụng, ví dụ...')+`<div class="toolbar-meta">Đang hiển thị <strong>${list.length}</strong> / ${DATA.formulas.length} công thức</div>`+(groups||'<div class="empty">Không tìm thấy công thức. Hãy thử từ khóa khác.</div>');
  }
  function listItems(page) {
    const sample=page==='samples',data=sample?DATA.samples:DATA.reviews,items=filterItems(data);
    const top=sample?title('BƯỚC 02 / ĐỀ MẪU','19 đề mẫu và lời giải','Mở từng đề để xem công thức tổng quát, nhận dạng bài, giải thích lý do chọn phương pháp, từng bước tính, đáp án và lỗi dễ mắc.'):
      title('BƯỚC 03 / LUYỆN TẬP','50 bài vận dụng có gợi ý','Đề bài được viết đầy đủ dữ kiện. Hãy thử làm trước, dùng nút “Xem gợi ý / ví dụ” khi bí, rồi chỉ mở lời giải khi muốn đối chiếu.');
    return top+toolbar('Tìm theo tên đề, dữ kiện hoặc chủ đề...')+`<div class="toolbar-meta">Hiển thị <strong>${items.length}</strong> / ${data.length} bài · ${sample?state.doneSamples.size:state.donePractice.size} bài đã hoàn thành</div>`+`<div class="list-stack">${items.map(p=>`<article class="problem-row"><div class="row-no">${String(p.id).padStart(2,'0')}</div><div class="row-content"><h3>${esc(p.title)}</h3><p>${esc(p.statement)}</p><div class="row-meta"><span class="tag">${esc(topicName(p.topic))}</span><span class="tag">${esc(p.level)}</span>${completionTag(page,p.id)}</div></div><div class="row-action"><a href="${link(page,p.id)}" class="btn small ${sample?'':'soft'}">${sample?'Xem lời giải':'Làm bài'} →</a></div></article>`).join('')}</div>`+(items.length?'':'<div class="empty">Không tìm thấy bài nào với bộ lọc hiện tại.</div>');
  }
  function stepsHTML(steps) {
    return `<ol class="steps">${steps.map((s,i)=>{let title,detail;if(Array.isArray(s)){title=s[0];detail=s[1];}else{title=s.title;detail=s.detail;}return `<li><span class="step-index">${i+1}</span><div class="step-content"><strong>${esc(title)}</strong><p>${formattedMath(detail)}</p></div></li>`;}).join('')}</ol>`;
  }
  function detail(page,id) {
    const sample=page==='samples',p=(sample?DATA.samples:DATA.reviews).find(t=>t.id===id),f=formulaById[p.formulaId],done=(sample?state.doneSamples:state.donePractice).has(id);
    const previous=id>1?id-1:null,next=id<(sample?19:50)?id+1:null;
    let html=`<div class="breadcrumb"><a href="#/home">Toán rời rạc</a><span>/</span><a href="${link(page)}">${sample?'Đề mẫu':'Ôn tập 50 bài'}</a><span>/</span><span>Câu ${id}</span></div><div class="detail-heading"><div class="eyebrow">${sample?'ĐỀ MẪU':'BÀI ÔN TẬP'} ${String(id).padStart(2,'0')} / ${sample?19:50} · ${esc(topicName(p.topic))}</div><h1 class="page-title">${esc(p.title)}</h1><div class="row-meta"><span class="tag">${esc(p.level)}</span>${completionTag(page,id)}</div></div>
    <div class="detail-layout"><div class="reading-stack"><section class="reading-card"><div class="card-kicker">01 / Đề bài</div><div class="statement">${formattedMath(p.statement)}</div></section>`;
    if(sample){
      html+=`<section class="reading-card"><div class="card-kicker">02 / Nhận dạng</div><h2>Đề đang yêu cầu gì?</h2><p class="paragraph">${esc(p.recognize)}</p><div class="focus-block"><strong>Ý tưởng:</strong> ${esc(p.method)}</div><p class="paragraph" style="margin-top:14px"><strong>Vì sao dùng cách này?</strong> ${esc(p.why)}</p></section>
      <section class="reading-card"><div class="card-kicker">03 / Công thức tổng quát</div><h2>${esc(f.title)}</h2>${formulaSmall(f)}<p class="muted-note"><strong>Áp dụng vào bài:</strong> ${esc(p.generalFormula)}</p><p class="muted-note"><strong>Điều kiện:</strong> ${esc(f.when)}</p></section>
      <section class="reading-card"><div class="card-kicker">04 / Lời giải</div><h2>Giải từng bước</h2>${stepsHTML(p.steps)}<div class="answer"><small>Đáp án cuối cùng</small>${esc(p.answer)}</div></section>
      <section class="reading-card"><div class="card-kicker">05 / Ghi nhớ</div><h2>Kiểm tra và tránh nhầm lẫn</h2><p class="paragraph"><strong>Kiểm tra lại:</strong> ${esc(p.verify)}</p><div class="warning"><strong>Lỗi thường gặp</strong>${esc(p.mistake)}</div></section>`;
    } else {
      const hint=!!state.hintOpen[id],sol=!!state.solutionOpen[id];
      html+=`<section class="hint-zone"><div class="heading-row"><div><h2>02 / Hướng dẫn và ví dụ</h2><p>Mở phần này để biết nên dùng công thức nào mà chưa lộ đáp án.</p></div><button class="btn small soft" type="button" data-toggle="hint" data-id="${id}" aria-expanded="${hint}">${hint?'Ẩn gợi ý':'Xem gợi ý / ví dụ'}</button></div>${hint?`<div class="hint-reveal"><h3>Nhận dạng</h3><p>${esc(p.recognize)}</p><h3>Công thức nên dùng</h3>${formulaSmall(f)}<h3>Ví dụ tương tự</h3><p>${esc(p.example||f.example)}</p><h3>Gợi ý áp dụng</h3><p>${esc(p.idea)}</p></div>`:''}</section>
      <section class="hint-zone"><div class="heading-row"><div><h2>03 / Lời giải chi tiết</h2><p>Chỉ mở khi Sủi muốn đối chiếu đáp án và các bước tính.</p></div><button class="btn small ${sol?'soft':'primary'}" type="button" data-toggle="solution" data-id="${id}" aria-expanded="${sol}">${sol?'Ẩn lời giải':'Xem lời giải'}</button></div>${sol?`<div class="sol-reveal"><div class="focus-block"><strong>Phương pháp:</strong> ${esc(p.idea)}</div><div class="lab" style="margin:18px 0 6px;font-weight:800;font-size:.83rem">Tính toán theo từng bước</div>${stepsHTML(p.steps)}<div class="answer"><small>Đáp án cuối cùng</small>${esc(p.answer)}</div>${p.mistake?`<div class="warning"><strong>Lỗi dễ mắc</strong>${esc(p.mistake)}</div>`:''}</div>`:''}</section>`;
    }
    html+=`<section class="reading-card"><div class="card-kicker">HOÀN THÀNH</div><h2>Sủi đã hiểu cách làm chưa?</h2><p class="paragraph">Đánh dấu khi có thể tự giải lại bài này mà không xem đáp án. Tiến độ được lưu trên trình duyệt.</p><div class="detail-actions"><button class="btn ${done?'success':'primary'}" type="button" data-done="${sample?'samples':'practice'}" data-id="${id}">${done?'Đã nắm — bỏ đánh dấu':'Đánh dấu đã nắm'}</button><a class="btn" href="${link(page)}">Danh sách bài</a></div></section>
    <div class="footer-buttons"><span>${previous?`<a class="backlink" href="${link(page,previous)}">← Bài ${previous}</a>`:''}</span><span>${next?`<a class="backlink" href="${link(page,next)}">Bài ${next} →</a>`:'<a class="backlink" href="'+link(page)+'">Xem danh sách →</a>'}</span></div></div>
    <aside class="context-card"><div class="card-kicker">LIÊN KẾT KIẾN THỨC</div><h3>${esc(f.title)}</h3><p>${esc(f.general)}</p><p><strong>Chủ đề:</strong> ${esc(topicName(p.topic))}</p><a class="btn small" href="#/formulas">Xem sổ tay công thức</a><div class="study-tip">${sample?'Đọc theo thứ tự công thức → cách áp dụng → các bước giải.':'Mẹo học: tự làm 3–5 phút trước khi mở gợi ý; chỉ mở lời giải sau khi đã thử.'}</div></aside></div>`;
    return html;
  }
  function render(restore=false) {
    window.syncCourseShell();
    if(location.hash.startsWith('#/oop')){window.oopRender();if(!restore)window.scrollTo(0,0);return;}
    if(location.hash.startsWith('#/db')){window.dbRender();if(!restore)window.scrollTo(0,0);return;}
    const r=route(); setNav(r.page);progress();
    if(r.page==='home')viewEl.innerHTML=home();
    else if(r.page==='formulas')viewEl.innerHTML=formulas();
    else if((r.page==='samples'||r.page==='practice')&&r.id)viewEl.innerHTML=detail(r.page,r.id);
    else viewEl.innerHTML=listItems(r.page);
    document.title=(r.page==='home'?'Tổng quan':r.page==='formulas'?'Công thức':r.page==='samples'?'Đề mẫu':'Ôn tập 50 bài')+' | Sủi Study Lab';
    if(!restore)window.scrollTo({top:0,behavior:'instant'});
  }
  function toast(text) {
    const el=document.getElementById('toast');el.textContent=text;el.classList.add('show');
    clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove('show'),2500);
  }
  function liveFilter() {
    const el=document.getElementById('search-box');if(!el)return;
    const start=el.selectionStart, end=el.selectionEnd;
    render(true);
    const next=document.getElementById('search-box');if(next){next.focus();try{next.setSelectionRange(start,end)}catch(e){}}
  }
  document.addEventListener('input',event=>{
    if(event.target.id==='search-box'){state.query=event.target.value;liveFilter();}
  });
  document.addEventListener('change',event=>{
    if(event.target.id==='topic-filter'){state.topic=event.target.value;render(true);}
  });
  document.addEventListener('click',event=>{
    const b=event.target.closest('button');if(!b)return;
    if(b.dataset.toggle){const id=Number(b.dataset.id),target=b.dataset.toggle==='hint'?state.hintOpen:state.solutionOpen;target[id]=!target[id];render(true);return;}
    if(b.dataset.done){const target=b.dataset.done==='samples'?state.doneSamples:state.donePractice,id=Number(b.dataset.id);if(target.has(id))target.delete(id);else target.add(id);safeSave();render(true);toast(target.has(id)?'Đã đánh dấu hoàn thành.':'Đã bỏ dấu hoàn thành.');return;}
    if(b.id==='theme-toggle'){state.theme=state.theme==='dark'?'light':'dark';setAppearance();safeSave();return;}
    if(b.id==='font-up'||b.id==='font-down'){state.scale=Math.max(.9,Math.min(1.3,Math.round((state.scale+(b.id==='font-up'?.1:-.1))*10)/10));setAppearance();safeSave();return;}
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='/'&& !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!event.ctrlKey&&!event.metaKey){const search=document.getElementById('search-box');if(search){event.preventDefault();search.focus();}}
    if(event.key==='Escape'&&document.activeElement.id==='search-box'){state.query='';liveFilter();}
  });
  window.addEventListener('hashchange',()=>{state.query='';state.topic='all';render();});
  load();render();
})();
