import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { problems, publicProblems } from './problems.js';
import { evaluate } from './judge.js';

const root=path.dirname(fileURLToPath(import.meta.url));
const files={'/':'index.html','/index.html':'index.html','/style.css':'style.css','/app.js':'app.js','/problems-data.js':'problems-data.js'};
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8'};
const port=Number(process.env.PORT || 3000);
const host=process.env.HOST || '127.0.0.1';
let active=0;
const recent=new Map();

function json(res,status,value) {
  res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
  res.end(JSON.stringify(value));
}
async function body(req) {
  if(!req.headers['content-type']?.startsWith('application/json')) throw Object.assign(new Error('Yêu cầu phải là JSON.'),{status:415});
  let size=0,buffers=[];
  for await (const chunk of req) {size+=chunk.length;if(size>44000) throw Object.assign(new Error('Dữ liệu gửi lên quá lớn.'),{status:413}); buffers.push(chunk);}
  try{return JSON.parse(Buffer.concat(buffers).toString('utf8'));}catch{throw Object.assign(new Error('JSON không hợp lệ.'),{status:400});}
}

const server=http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    if(req.method==='GET' && url.pathname==='/api/problems') return json(res,200,publicProblems);
    if(req.method==='POST' && (url.pathname==='/api/run'||url.pathname==='/api/submit')) {
      if(req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) return json(res,403,{error:'Nguồn truy cập không hợp lệ.'});
      const key=req.socket.remoteAddress;
      const now=Date.now(); const log=(recent.get(key)||[]).filter(t=>now-t<60000);
      if(log.length>=20) return json(res,429,{error:'Thao tác quá nhanh, vui lòng đợi một phút.'});
      log.push(now);recent.set(key,log);
      if(active>=2) return json(res,429,{error:'Máy chấm đang bận, hãy thử lại sau.'});
      const payload=await body(req);
      const problem=problems.find(p=>p.id===payload.problemId);
      if(!problem || typeof payload.code!=='string' || !payload.code.trim()) return json(res,400,{error:'Hãy chọn bài và nhập code C.'});
      if(Buffer.byteLength(payload.code)>32768) return json(res,413,{error:'Code vượt quá 32 KiB.'});
      const custom=url.pathname==='/api/run';
      if(custom && (typeof payload.input!=='string'||Buffer.byteLength(payload.input)>8192)) return json(res,400,{error:'Input chạy thử phải là văn bản không quá 8 KiB.'});
      active++;
      try {return json(res,200,await evaluate(payload.code,problem,custom?payload.input:undefined));}
      finally {active--;}
    }
    if(req.method==='GET' && files[url.pathname]) {
      const filename=files[url.pathname];
      const data=await readFile(path.join(root,filename));
      res.writeHead(200,{'Content-Type':mime[path.extname(filename)],'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff',
        'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; form-action 'none'"});
      return res.end(data);
    }
    json(res,404,{error:'Không tìm thấy đường dẫn.'});
  }catch(e){
    console.error(e);
    if(!res.headersSent) json(res,e.status||500,{error:e.status?e.message:'Máy chủ gặp lỗi. Vui lòng xem cửa sổ Terminal.'});
  }
});

if (process.env.NODE_ENV !== 'test') server.listen(port,host,()=>console.log(`C Lab: http://${host}:${port}`));
export {server};
