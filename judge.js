import { spawn } from 'node:child_process';
import { mkdtemp, rm, chmod } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { compare } from './problems.js';

const IMAGE = 'gcc:14';
const text = b => b.toString('utf8').slice(0,8192);

function docker(args, timeout, input = '') {
  return new Promise(resolve => {
    const child=spawn('docker',args,{windowsHide:true,stdio:['pipe','pipe','pipe']});
    const out=[],err=[]; let total=0, exceeded=false, timedOut=false, spawnError=null;
    const timer=setTimeout(()=>{ timedOut=true;child.kill('SIGKILL'); },timeout);
    const capture=(list,buf)=>{ total+=buf.length; if(total>65536){exceeded=true; child.kill('SIGKILL');} else list.push(buf); };
    child.stdout.on('data',buf=>capture(out,buf));
    child.stderr.on('data',buf=>capture(err,buf));
    child.on('error',error=>{spawnError=error;});
    child.on('close',code=>{clearTimeout(timer);resolve({code,error:spawnError,stdout:Buffer.concat(out),stderr:Buffer.concat(err),exceeded,timedOut});});
    child.stdin.on('error',()=>{});
    child.stdin.end(input);
  });
}

async function container(args, timeout, input='', command=[]) {
  const name = 'clab-' + randomUUID();
  try {
    return await docker(['run','--name',name,'--rm','--pull','never','--network','none','--read-only',
      '--cap-drop','ALL','--security-opt','no-new-privileges','--pids-limit','64',
      '--memory','128m','--memory-swap','128m','--cpus','0.5','--user','65534:65534',
      '--tmpfs','/tmp:rw,nosuid,nodev,size=32m',...args,IMAGE,...command],timeout,input);
  } finally {
    // A timed-out Docker CLI can leave a container running. Remove by opaque name.
    await docker(['rm','-f',name],3000);
  }
}

function classify(result, phase) {
  const stderr=text(result.stderr);
  if (result.error?.code === 'ENOENT') return {verdict:'Judge Unavailable',message:'Chưa cài Docker hoặc lệnh docker chưa có trong PATH. Xem README.md.'};
  if (/Cannot connect to the Docker daemon|error during connect|open \/\/\.\/pipe\//i.test(stderr)) return {verdict:'Judge Unavailable',message:'Docker Desktop chưa chạy. Hãy mở Docker Desktop rồi thử lại.'};
  if (/Unable to find image|pull access denied|No such image|network is unreachable/i.test(stderr)) return {verdict:'Judge Unavailable',message:'Chưa có image gcc:14. Chạy docker pull gcc:14 rồi thử lại.'};
  if (result.timedOut) return {verdict:'Time Limit Exceeded',message:`${phase} quá thời gian cho phép.`};
  if (result.exceeded) return {verdict:'Output Limit Exceeded',message:'Chương trình in quá nhiều dữ liệu.'};
  if (result.code !== 0 || result.error) return {verdict:phase === 'Biên dịch' ? 'Compilation Error':'Runtime Error',message:stderr || result.error?.message || `Exit code ${result.code}`};
  return null;
}

export async function evaluate(code, problem, customInput) {
  const workspace = await mkdtemp(path.join(tmpdir(),'clab-'));
  try {
    const { writeFile, mkdir } = await import('node:fs/promises');
    const source=path.join(workspace,'main.c');
    const output=path.join(workspace,'bin');
    await mkdir(output,{mode:0o777});
    await chmod(output,0o777);
    await writeFile(source,code,{mode:0o644});
    const started=Date.now();
    const compile=await container(['--mount',`type=bind,src=${source},dst=/src/main.c,readonly`,
      '--mount',`type=bind,src=${output},dst=/work`],15000,'',
      ['gcc','-std=c11','-O2','-Wall','-Wextra','/src/main.c','-o','/work/main']);
    const failure=classify(compile,'Biên dịch');
    if (failure) return {...failure,detail:text(compile.stderr),elapsedMs:Date.now()-started};
    const tests = customInput === undefined ? problem.tests : [{input:customInput,expected:null}];
    const results=[];
    for (const [index,test] of tests.entries()) {
      const result=await container(['-i','--mount',`type=bind,src=${output},dst=/work,readonly`,
        '--entrypoint','/work/main'],4000,test.input);
      const failed=classify(result,'Chạy chương trình');
      const passed=!failed && (test.expected===null || compare(problem,result.stdout,Buffer.isBuffer(test.expected)?test.expected:Buffer.from(test.expected)));
      results.push({index:index+1,passed,verdict:failed?.verdict || (passed?'Accepted':'Wrong Answer'),
        input:test.input,expected:test.expected===null?null:problem.raw?'[223 byte mã 33–255]':String(test.expected),
        actual:problem.raw?`[${result.stdout.length} byte] HEX: ${result.stdout.subarray(0,40).toString('hex').match(/../g)?.join(' ')||'(rỗng)'}${result.stdout.length>40?' …':''}`:text(result.stdout),
        stderr:text(result.stderr),message:failed?.message});
      if (failed?.verdict==='Judge Unavailable') return {...failed,results,elapsedMs:Date.now()-started};
    }
    const passed=results.filter(r=>r.passed).length;
    return {verdict:customInput===undefined?(passed===results.length?'Accepted':results.find(r=>!r.passed).verdict):results[0].verdict,
      passed,total:results.length,results,elapsedMs:Date.now()-started};
  } finally { await rm(workspace,{recursive:true,force:true}); }
}
