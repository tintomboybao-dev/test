import statements from './statements.json' with { type: 'json' };

const cases = (pairs) => pairs.map(([input, expected]) => ({ input: String(input) + '\n', expected: String(expected) + '\n' }));
const quarter = m => m < 1 || m > 12 ? 0 : Math.ceil(m / 3);
const isPrime = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
const sum16 = n => {
  let a = 0, b = 0, c = 0, d = 0;
  for (let k = 0; k <= n; k++) a += (2 * k + 1) / (2 * k + 2);
  for (let k = 1; k <= n; k++) {
    b += (2 * k) / (2 * k + 1);
    c += 1 / (k * (k + 1));
    d += 2 / (k * (k + 1));
  }
  return [a, b, c, d].join(' ');
};
const multi = (numbers, fn) => cases(numbers.map(n => [n, fn(n)]));
const table = Array.from({ length: 9 }, (_, i) => Array.from({ length: 9 }, (_, j) => `${i + 1} x ${j + 1} = ${(i + 1) * (j + 1)}`).join('\n')).join('\n');

const definitions = [
  { title: 'Mã ASCII của ký tự', category: 'C cơ bản', format: 'Nhập một ký tự ASCII (không có khoảng trắng). In một số nguyên là mã ASCII.', example: ['A', '65'], tests: cases([['A',65],['z',122],['0',48],['?',63],['@',64]]) },
  { title: 'Đổi chữ hoa sang chữ thường', category: 'C cơ bản', format: 'Nhập một chữ cái in hoa A–Z. In đúng một chữ cái thường.', example: ['A','a'], tests: multi(['A','Z','M','B','Q'], c => c.toLowerCase()) },
  { title: 'Chu vi và diện tích hình chữ nhật', category: 'C cơ bản', format: 'Nhập chiều dài và chiều rộng (hai số thực). In hai số: chu vi rồi diện tích.', example: ['5 3','16 15'], tests: cases([["5 3","16 15"],["2.5 4","13 10"],["1 1","4 1"],["0.5 0.25","1.5 0.125"]]) },
  { title: 'Chu vi và diện tích hình tròn', category: 'C cơ bản', format: 'Nhập bán kính (số thực). Dùng PI = 3.14. In hai số: chu vi rồi diện tích.', example: ['2','12.56 12.56'], tests: multi([1,2,3.5,0.5,10], r => `${2*3.14*r} ${3.14*r*r}`) },
  { title: 'Hoán đổi hai số', category: 'C cơ bản', format: 'Nhập hai số thực a b. In hai giá trị sau hoán đổi: b rồi a.', example: ['35.5 50','50 35.5'], tests: cases([['35.5 50','50 35.5'],['-2 7.25','7.25 -2'],['0 0','0 0'],['4.2 -8','-8 4.2']]) },
  { title: 'Giá trị nhỏ nhất và lớn nhất', category: 'Toán tử điều kiện', format: 'Nhập ba số nguyên. In hai số: nhỏ nhất rồi lớn nhất. Đề yêu cầu dùng toán tử điều kiện ?: (cần tự tuân thủ).', example: ['5 1 9','1 9'], tests: cases([['5 1 9','1 9'],['-3 -8 -1','-8 -1'],['4 4 4','4 4'],['9 5 1','1 9'],['3 3 7','3 7']]) },
  { title: 'Năm nhuận', category: 'Toán tử điều kiện', format: 'Nhập một năm dương. In 1 nếu nhuận, in 0 nếu không nhuận. Đề yêu cầu dùng toán tử điều kiện ?:.', example: ['2000','1'], tests: multi([2000,1900,2024,2023,2100,2400,4,100], y => +(y%400===0 || y%4===0 && y%100!==0)) },
  { title: 'Tháng thuộc quý mấy', category: 'Toán tử điều kiện', format: 'Nhập số tháng. In số quý 1–4; tháng không hợp lệ in 0. Đề yêu cầu dùng toán tử điều kiện ?:.', example: ['8','3'], tests: multi([0,1,3,4,6,7,9,10,12,13,-1], quarter) },
  { title: 'Phân loại ký tự', category: 'If / For', format: 'Nhập một ký tự ASCII không phải khoảng trắng. In chính xác một trong bốn chuỗi của đề: La so / La chu hoa / La chu thuong / Khong la chu cai hay chu so.', example: ['A','La chu hoa'], tests: cases([['0','La so'],['9','La so'],['A','La chu hoa'],['Z','La chu hoa'],['a','La chu thuong'],['z','La chu thuong'],['?','Khong la chu cai hay chu so'],['@','Khong la chu cai hay chu so']]) },
  { title: 'Đổi hoa thường', category: 'If / For', format: 'Nhập một chữ cái A–Z hoặc a–z. In hai ký tự cách nhau bởi khoảng trắng: ký tự ban đầu rồi ký tự sau khi đổi.', example: ['a','a A'], tests: cases([['a','a A'],['Z','Z z'],['B','B b'],['m','m M']]) },
  { title: 'Số ngày trong tháng', category: 'If / For', format: 'Nhập tháng 1–12. In số ngày. Do đề không nhập năm, tháng 2 quy ước 28 ngày. Tháng không hợp lệ in 0.', example: ['2','28'], tests: multi([0,1,2,3,4,6,7,9,11,12,13], m => m<1||m>12 ? 0 : m===2 ? 28 : [4,6,9,11].includes(m) ? 30 : 31) },
  { title: 'Quý của tháng với switch-case', category: 'If / For', format: 'Giống bài 8: nhập tháng; in quý 1–4 hoặc 0 nếu không hợp lệ. Đề yêu cầu dùng switch-case (cần tự tuân thủ).', example: ['12','4'], tests: multi([0,1,2,3,4,5,6,7,8,9,10,11,12,13], quarter) },
  { title: 'Các ký tự mã 33 đến 255', category: 'If / For', format: 'Không có input. In liên tiếp đúng 223 BYTE mã 33, 34, …, 255 theo thứ tự, ví dụ dùng printf("%c", i). Có thể thêm ký tự xuống dòng ở cuối. Byte 128–255 có thể hiển thị không đúng trong trình duyệt do mã hóa; hệ thống so sánh byte.', example: ['', 'Ký tự đầu: !"# … | Ký tự cuối: ýþÿ (hiển thị tùy bảng mã)'], raw: true, tests: [{ input:'', expected: Buffer.from(Array.from({length:223},(_,i)=>i+33)) }] },
  { title: 'Bảng cửu chương 1 đến 9', category: 'If / For', format: 'Không có input. In 81 dòng theo thứ tự bảng 1 đến bảng 9; mỗi bảng nhân lần lượt 1 đến 9. Mỗi dòng: i x j = tích. Có thể thay x bằng *, dấu = là tùy chọn; hệ thống so sánh các số trên từng dòng.', example: ['', '1 x 1 = 1\n1 x 2 = 2\n...\n9 x 9 = 81'], multiplication: true, tests: [{input:'',expected:table+'\n'}] },
  { title: 'Kiểm tra số nguyên tố', category: 'If / For', format: 'Nhập một số nguyên dương n. In 1 nếu là số nguyên tố, 0 nếu không.', example: ['7','1'], tests: multi([1,2,3,4,9,17,25,97,100,9973], n=>+isPrime(n)) },
  { title: 'Bốn tổng phân số', category: 'If / For', format: 'Nhập n > 0. In lần lượt bốn số thực a b c d (có thể mỗi số trên một dòng), sai số cho phép 1e-4. Chú ý tổng a có n+1 số hạng: từ k=0 đến k=n; b, c, d có n số hạng.', example: ['1','1.25 0.666667 0.5 1'], tests: multi([1,2,3,5,10,50],sum16) }
];

export const problems = definitions.map((d,i) => ({ ...d, id:i+1, statement:statements[i].statement }));
export const publicProblems = problems.map(({tests,raw,multiplication,...visible}) => visible);

export function compare(problem, actual, expected) {
  if (problem.raw) {
    let a = actual, b = expected;
    while (a.length && (a.at(-1)===10 || a.at(-1)===13)) a=a.subarray(0,-1);
    return a.equals(b);
  }
  const normalized = buffer => buffer.toString('utf8').trim().replace(/\r/g,'');
  if (problem.multiplication) {
    const lines = normalized(actual).split('\n');
    const expectedLines = normalized(expected).split('\n');
    return lines.length === expectedLines.length && lines.every((line,i) => {
      const values = line.match(/\d+/g);
      return values?.join(' ') === expectedLines[i].match(/\d+/g)?.join(' ');
    });
  }
  const tokens = buffer => normalized(buffer).split(/\s+/).filter(Boolean);
  const a=tokens(actual), b=tokens(expected);
  if(a.length!==b.length) return false;
  return a.every((value,i)=> {
    const x=Number(value), y=Number(b[i]);
    if (Number.isFinite(x) && Number.isFinite(y)) return Math.abs(x-y)<=Math.max(1e-4,1e-5*Math.abs(y));
    return value===b[i];
  });
}
