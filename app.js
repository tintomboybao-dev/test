const $=id=>document.getElementById(id);
const starter='#include <stdio.h>\n\nint main(void) {\n    // Viết lời giải của bạn tại đây\n    \n    return 0;\n}\n';
let problems=[],current=1,busy=false;
const load=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)) ?? fallback;}catch{return fallback;}};
const save=(key,value)=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{}};
const drafts=load('clab-drafts',{}), history=load('clab-history',[]);
const statuses=load('clab-statuses',{});
const pretty={Accepted:'Đã chấp nhận', 'Wrong Answer':'Sai kết quả', 'Compilation Error':'Lỗi biên dịch', 'Runtime Error':'Lỗi khi chạy', 'Time Limit Exceeded':'Quá thời gian', 'Output Limit Exceeded':'In quá nhiều dữ liệu', 'Judge Unavailable':'Máy chấm chưa sẵn sàng'};

function updateProgress(){const done=Object.values(statuses).filter(Boolean).length;$('progress-count').textContent=`${done} / ${problems.length}`;$('progress-bar').style.width=`${done/problems.length*100}%`;}
function list(){
 const query=$('search').value.trim().toLocaleLowerCase('vi');
 const nav=$('problem-list');nav.replaceChildren();
 for(const [group,label] of [['C cơ bản','PHẦN 01 — CƠ BẢN'],['Toán tử điều kiện','TOÁN TỬ ĐIỀU KIỆN'],['If / For','PHẦN 02 — IF & FOR']]){
  const filtered=problems.filter(p=>p.category===group && (`${p.title} ${p.id}`).toLocaleLowerCase('vi').includes(query));
  if(!filtered.length)continue;
  const heading=document.createElement('div');heading.className='group-title';heading.textContent=label;nav.append(heading);
  for(const p of filtered){const button=document.createElement('button');button.type='button';button.className='problem-link'+(current===p.id?' selected':'');
    const number=document.createElement('span');number.className='number';number.textContent=String(p.id).padStart(2,'0');
    const title=document.createElement('span');title.className='problem-name';title.textContent=p.title;button.append(number,title);
    if(statuses[p.id]){const check=document.createElement('span');check.className='check';check.textContent='✓';button.append(check);}
    button.addEventListener('click',()=>choose(p.id));nav.append(button);
  }
 }
}
function choose(id){
 if(busy)return;current=id;save('clab-current',id);
 const p=problems.find(p=>p.id===id);if(!p)return;
 $('crumb').textContent=`Bài ${String(id).padStart(2,'0')}`;
 $('problem-index').textContent=`${String(id).padStart(2,'0')} / ${problems.length}`;
 $('category-tag').textContent=p.category;$('problem-title').textContent=p.title;
 $('statement-text').textContent=p.statement.replace(/^\*?Bài\s+\d+[.:]\s*/i,'');
 $('format-text').textContent=p.format;$('sample-input').textContent=p.example[0] || '(Không có input)';$('sample-output').textContent=p.example[1];
 $('code').value=drafts[id] ?? starter;$('custom-input').value='';
 $('save-status').textContent='Đã lưu tự động';$('action-status').textContent='Sẵn sàng để bắt đầu';
 $('pane-result').replaceChildren();const empty=document.createElement('div');empty.className='empty-result';empty.textContent='Chưa có kết quả. Hãy chạy thử hoặc nộp bài.';$('pane-result').append(empty);
 updateLines();renderHistory();showTab('test');list();
}
function updateLines(){const code=$('code');let count=code.value.split('\n').length;$('line-numbers').textContent=Array.from({length:count},(_,i)=>i+1).join('\n');$('line-numbers').scrollTop=code.scrollTop;
 const prefix=code.value.slice(0,code.selectionStart),line=prefix.split('\n');$('line-info').textContent=`Dòng ${line.length}, cột ${line.at(-1).length+1}`;}
function showTab(name){for(const tab of ['test','result','history']){$('tab-'+tab).classList.toggle('active',tab===name);$('pane-'+tab).classList.toggle('hidden',tab!==name);}}
function item(tag,className,value){const el=document.createElement(tag);if(className)el.className=className;if(value!==undefined)el.textContent=value;return el;}
function renderResult(result,trial){const pane=$('pane-result');pane.replaceChildren();
 const good=result.verdict==='Accepted';pane.append(item('div',`verdict ${good?'ok':'bad'}`,trial&&good?'Chạy xong (chưa chấm)':pretty[result.verdict]||result.verdict));
 pane.append(item('div','result-summary',trial?`Chạy thử · ${result.elapsedMs ?? '—'} ms`:`${result.passed ?? 0}/${result.total ?? 0} test đạt · ${result.elapsedMs ?? '—'} ms`));
 if(result.message)pane.append(item('pre','error-output',result.message));
 if(result.detail && result.detail!==result.message)pane.append(item('pre','error-output',result.detail));
 for(const r of result.results||[]){const details=item('details','test-row');if(!r.passed)details.open=true;
 const summary=item('summary');summary.append(item('span',r.passed?'passed':'failed','●'),item('b','',trial?'Input chạy thử':`Test ${String(r.index).padStart(2,'0')}`),item('span','',trial&&r.passed?'Chạy xong':pretty[r.verdict]||r.verdict));details.append(summary);
 const grid=item('div','test-details');
 for(const [title,value] of [['INPUT',r.input||'(rỗng)'],['OUTPUT CỦA BẠN',r.actual||'(rỗng)'],...(r.expected===null?[]:[['KẾT QUẢ ĐÚNG',r.expected]])]){const box=item('div');box.append(item('strong','',title),item('pre','',value));grid.append(box);}
 details.append(grid);if(r.message)details.append(item('pre','error-output',r.message));pane.append(details);
 }
 showTab('result');
}
function renderHistory(){const pane=$('pane-history');pane.replaceChildren();const submissions=history.filter(h=>h.problemId===current).slice(0,15);
 if(!submissions.length){pane.append(item('div','empty-result','Chưa có lượt nộp bài nào trên trình duyệt này.'));return;}
 for(const h of submissions){const row=item('div','history-row');row.append(item('span','',new Date(h.date).toLocaleString('vi-VN')),item('span','',`${h.passed}/${h.total} test`),item('strong',h.verdict==='Accepted'?'':'bad',pretty[h.verdict]||h.verdict));pane.append(row);}
}
async function judge(trial){if(busy)return;const code=$('code').value;
 if(!code.trim()){alert('Hãy nhập code C trước khi chạy.');return;}
 busy=true;$('run').disabled=true;$('submit').disabled=true;$('action-status').textContent=trial?'Đang chạy thử...':'Đang chấm bài...';
 try{const response=await fetch(trial?'/api/run':'/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({problemId:current,code,input:$('custom-input').value})});const result=await response.json();if(!response.ok)throw new Error(result.error||'Không gửi được bài.');
 renderResult(result,trial);$('action-status').textContent=trial&&result.verdict==='Accepted'?'Chạy xong':pretty[result.verdict]||result.verdict;
 if(!trial && result.verdict!=='Judge Unavailable'){
   history.unshift({problemId:current,date:Date.now(),verdict:result.verdict,passed:result.passed??0,total:result.total??0});history.splice(100);save('clab-history',history);
   if(result.verdict==='Accepted'){statuses[current]=true;save('clab-statuses',statuses);updateProgress();list();}
   renderHistory();
 }
 }catch(e){renderResult({verdict:'Judge Unavailable',message:e.message,results:[]},trial);$('action-status').textContent='Có lỗi kết nối';}
 finally{busy=false;$('run').disabled=false;$('submit').disabled=false;}
}
$('code').addEventListener('input',()=>{drafts[current]=$('code').value;save('clab-drafts',drafts);$('save-status').textContent='Đã lưu tự động';updateLines();});
$('code').addEventListener('scroll',()=>{$('line-numbers').scrollTop=$('code').scrollTop;});
$('code').addEventListener('click',updateLines);$('code').addEventListener('keyup',updateLines);
$('code').addEventListener('keydown',e=>{if(e.key!=='Tab')return;e.preventDefault();const input=$('code'),start=input.selectionStart,end=input.selectionEnd;input.setRangeText('    ',start,end,'end');input.dispatchEvent(new Event('input'));});
document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='Enter'){e.preventDefault();judge(true);}if(e.key==='/' && document.activeElement!==$('code') && document.activeElement!==$('custom-input') && document.activeElement!==$('search')){e.preventDefault();$('search').focus();}});
for(const name of ['test','result','history'])$('tab-'+name).addEventListener('click',()=>showTab(name));
$('search').addEventListener('input',list);$('run').addEventListener('click',()=>judge(true));$('submit').addEventListener('click',()=>judge(false));
$('fill-example').addEventListener('click',()=>{$('custom-input').value=problems[current-1].example[0];$('custom-input').focus();});
fetch('/api/problems').then(r=>{if(!r.ok)throw Error('Không tải được danh sách bài.');return r.json();}).then(data=>{problems=data;choose(problems.some(p=>p.id===load('clab-current',1))?load('clab-current',1):1);updateProgress();}).catch(e=>{$('problem-title').textContent=e.message;});
