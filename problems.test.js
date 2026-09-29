import test from 'node:test';
import assert from 'node:assert/strict';
import { problems, publicProblems, compare } from './problems.js';

test('16 đề gốc có test; API không lộ test chấm',()=>{
 assert.equal(problems.length,16);
 for(const [i,p] of problems.entries()){
  assert.equal(p.id,i+1);
  assert.match(p.statement,new RegExp(`Bài ${i+1}[.:]`));
  assert.ok(p.tests.length>=1);
  assert.equal(publicProblems[i].tests,undefined);
  assert.equal(publicProblems[i].statement,p.statement);
 }
});
test('so sánh số thực, token và output thừa',()=>{
 const p=problems[2];
 assert.ok(compare(p,Buffer.from('16.0000\n 15.00001\n'),Buffer.from('16 15')));
 assert.ok(!compare(p,Buffer.from('16 17'),Buffer.from('16 15')));
 assert.ok(!compare(p,Buffer.from('16 15 17'),Buffer.from('16 15')));
});
test('bài 13 so sánh byte; bài 14 yêu cầu đủ 81 dòng',()=>{
 const p13=problems[12],raw=p13.tests[0].expected;
 assert.equal(raw.length,223);
 assert.ok(compare(p13,Buffer.concat([raw,Buffer.from('\n')]),raw));
 assert.ok(!compare(p13,raw.subarray(0,222),raw));
 const p14=problems[13],table=Buffer.from(p14.tests[0].expected);
 assert.ok(compare(p14,table,table));
 assert.ok(!compare(p14,Buffer.from('1 x 1 = 1'),table));
});
test('tổng bài 16 ở n=1 đúng bốn công thức trong tài liệu',()=>{
 assert.deepEqual(problems[15].tests[0].expected.trim().split(' ').map(Number),[1.25,2/3,0.5,1]);
});
