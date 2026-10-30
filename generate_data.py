import json, math, pathlib
BASE=pathlib.Path(__file__).resolve().parent
old=json.load(open(BASE/'old-data.json',encoding='utf-8'))
C=math.comb
TOPICS=[
 {'id':'anh-xa','name':'Ánh xạ và tính toàn ánh','short':'Ánh xạ','description':'Miền xác định, miền đích và điều kiện mọi giá trị y đều có tiền ảnh.'},
 {'id':'stars','name':'Đếm nghiệm nguyên và Stars and Bars','short':'Stars and Bars','description':'Chuyển các cận dưới về 0, đếm phương trình hoặc bất phương trình.'},
 {'id':'venn','name':'Tập hợp và biểu đồ Venn','short':'Tập hợp – Venn','description':'Phép hợp, giao, hiệu và nguyên lý bù trừ.'},
 {'id':'nhithuc','name':'Nhị thức Newton và hệ số đa thức','short':'Khai triển','description':'Chọn số mũ, tính hệ số và chú ý dấu.'},
 {'id':'quytac','name':'Quy tắc cộng và quy tắc nhân','short':'Quy tắc đếm','description':'Lựa chọn loại trừ nhau, công việc nhiều giai đoạn và đường đi.'},
 {'id':'fibo','name':'Đệ quy và Fibonacci','short':'Fibonacci','description':'Số lời gọi hàm và quan hệ truy hồi.'},
 {'id':'tohop','name':'Tổ hợp và chọn đối tượng','short':'Tổ hợp','description':'Chọn không xét thứ tự và chọn ở nhiều nhóm phân biệt.'},
 {'id':'chiadoituong','name':'Phân chia đối tượng phân biệt','short':'Chia đối tượng','description':'Chọn tuần tự, chia nhóm cho các người nhận được phân biệt.'},
]
# Formula entries: Unicode plain + MathML HTML (trusted, stored with source). Native MathML renders offline on current browsers.
def mm(s):return '<math xmlns="http://www.w3.org/1998/Math/MathML" display="block">'+s+'</math>'
def idm(s):return f'<mi>{s}</mi>'
def op(s):return f'<mo>{s}</mo>'
def num(s):return f'<mn>{s}</mn>'
def row(*args):return '<mrow>'+''.join(args)+'</mrow>'
def sub(a,b):return '<msub>'+a+b+'</msub>'
def sup(a,b):return '<msup>'+a+b+'</msup>'
def frac(a,b):return '<mfrac>'+a+b+'</mfrac>'
def sb(a,b):return '<msubsup>'+a+b[0]+b[1]+'</msubsup>'
def binom(n,k):return '<mrow><mo>(</mo><mfrac linethickness="0">'+n+k+'</mfrac><mo>)</mo></mrow>'
M={
 'toan-anh':mm(row(op('∀'),idm('y'),op('∈'),idm('B'),op(','),op('∃'),idm('x'),op('∈'),idm('A'),op(':'),idm('f'),op('('),idm('x'),op(')'),op('='),idm('y'))),
 'bac-nhat':mm(row(idm('f'),op('('),idm('x'),op(')'),op('='),idm('a'),idm('x'),op('+'),idm('b'),op(','),idm('a'),op('≠'),num(0))),
 'bac-hai':mm(row(idm('f'),op('('),idm('x'),op(')'),op('='),idm('a'),sup(idm('x'),num(2)),op('+'),idm('b'),idm('x'),op('+'),idm('c'))),
 'stars-eq':mm(row(idm('N'),op('='),binom(row(idm('n'),op('+'),idm('k'),op('−'),num(1)),row(idm('k'),op('−'),num(1))))),
 'stars-le':mm(row(idm('N'),op('='),binom(row(idm('n'),op('+'),idm('k')),idm('k')))),
 'shift':mm(row(sub(idm('y'),idm('i')),op('='),sub(idm('x'),idm('i')),op('−'),sub(idm('a'),idm('i')),op('≥'),num(0))),
 'positive':mm(row(sub(idm('y'),idm('i')),op('='),sub(idm('x'),idm('i')),op('−'),num(1),op('≥'),num(0))),
 'or':mm(row(op('|'),idm('A'),op('∪'),idm('B'),op('|'),op('='),op('|'),idm('A'),op('|'),op('+'),op('|'),idm('B'),op('|'),op('−'),op('|'),idm('A'),op('∩'),idm('B'),op('|'))),
 'venn3':mm(row(op('|'),idm('A'),op('∪'),idm('B'),op('∪'),idm('C'),op('|'),op('='),op('|'),idm('A'),op('|'),op('+'),op('|'),idm('B'),op('|'),op('+'),op('|'),idm('C'),op('|'),op('−'),op('|'),idm('A'),op('∩'),idm('B'),op('|'),op('−'),op('|'),idm('A'),op('∩'),idm('C'),op('|'),op('−'),op('|'),idm('B'),op('∩'),idm('C'),op('|'),op('+'),op('|'),idm('A'),op('∩'),idm('B'),op('∩'),idm('C'),op('|'))),
 'venn-ex':mm(row(op('|'),op('('),idm('A'),op('∪'),idm('B'),op(')'),op('∖'),idm('C'),op('|'))),
 'newton':mm(row(binom(idm('n'),idm('k')),sup(idm('a'),row(idm('n'),op('−'),idm('k'))),sup(idm('b'),idm('k')))),
 'multinomial':mm(row(frac(row(idm('n'),op('!')),row(sub(idm('k'),num(1)),op('!'),sub(idm('k'),num(2)),op('!'),op('⋯'),sub(idm('k'),idm('m')),op('!'))),sup(sub(idm('a'),num(1)),sub(idm('k'),num(1))),sup(sub(idm('a'),num(2)),sub(idm('k'),num(2))),op('⋯'),sup(sub(idm('a'),idm('m')),sub(idm('k'),idm('m'))))),
 'plus':mm(row(idm('N'),op('='),sub(idm('n'),num(1)),op('+'),sub(idm('n'),num(2)),op('+'),op('⋯'),op('+'),sub(idm('n'),idm('k')))),
 'product':mm(row(idm('N'),op('='),sub(idm('n'),num(1)),op('×'),sub(idm('n'),num(2)),op('×'),op('⋯'),op('×'),sub(idm('n'),idm('k')))),
 'comb':mm(row(idm('C'),op('('),idm('n'),op(','),idm('k'),op(')'),op('='),frac(row(idm('n'),op('!')),row(idm('k'),op('!'),op('('),idm('n'),op('−'),idm('k'),op(')'),op('!'))))),
 'selection':mm(row(idm('N'),op('='),idm('C'),op('('),sub(idm('n'),num(1)),op(','),sub(idm('r'),num(1)),op(')'),op('×'),idm('C'),op('('),sub(idm('n'),num(2)),op(','),sub(idm('r'),num(2)),op(')'))),
 'fibo-one':mm(row(idm('T'),op('('),idm('n'),op(')'),op('='),idm('T'),op('('),idm('n'),op('−'),num(1),op(')'),op('+'),idm('T'),op('('),idm('n'),op('−'),num(2),op(')'))),
 'fibo-total':mm(row(idm('L'),op('('),idm('n'),op(')'),op('='),num(1),op('+'),idm('L'),op('('),idm('n'),op('−'),num(1),op(')'),op('+'),idm('L'),op('('),idm('n'),op('−'),num(2),op(')'))),
 'partition':mm(row(idm('N'),op('='),frac(row(idm('n'),op('!')),row(sub(idm('r'),num(1)),op('!'),sub(idm('r'),num(2)),op('!'),op('⋯'),sub(idm('r'),idm('m')),op('!'))))),
 'roundtrip':mm(row(idm('N'),op('='),idm('a'),op('×'),idm('b'),op('×'),op('('),idm('b'),op('−'),num(1),op(')'),op('×'),op('('),idm('a'),op('−'),num(1),op(')'))),
}
formula=[]
def f(id,topic,title,general,where,process,example,gotcha):
 formula.append({'id':id,'topic':topic,'title':title,'mathml':M[id],'general':general,'when':where,'apply':process,'example':example,'mistake':gotcha})
f('toan-anh','anh-xa','Định nghĩa tính toàn ánh','f: A → B toàn ánh ⇔ với mọi y ∈ B, tồn tại x ∈ A sao cho f(x) = y.','Khi câu hỏi hỏi hàm có toàn ánh hay không.','Bước 1: Cho y bất kỳ trong tập đích B. Bước 2: Giải f(x)=y. Bước 3: Chứng minh tồn tại x thuộc A với mọi y.','Ví dụ: f(x)=x+2 (R→R). y=x+2 ⇒ x=y−2 ∈ R, nên toàn ánh.','Phải kiểm tra đúng tập đích. Chỉ cần tìm một y không có tiền ảnh là đủ kết luận không toàn ánh.')
f('bac-nhat','anh-xa','Hàm bậc nhất từ R đến R','f(x)=ax+b, a≠0 ⇒ toàn ánh R→R.','Nhận diện hàm bậc nhất có hệ số a khác 0.','Cho y; giải x=(y−b)/a. Vì a khác 0 nên x luôn là số thực.','Ví dụ: 5x−3. Với y bất kỳ có x=(y+3)/5.','Nếu a=0, hàm hằng không thể toàn ánh từ R đến R.')
f('bac-hai','anh-xa','Hàm bậc hai từ R đến R','f(x)=ax²+bx+c, a≠0 ⇒ không toàn ánh R→R.','Nhận diện hàm bậc hai có đỉnh, tập giá trị bị chặn một phía.','Hoàn thành bình phương f(x)=a(x+b/(2a))²+c−b²/(4a); có giá trị cực trị.','Ví dụ: x²−6x+8=(x−3)²−1 ≥ −1, không nhận được y=−2.','Khẳng định này đúng với tập đích R; nếu tập đích là [0,+∞) thì f(x)=x² lại toàn ánh.')
f('stars-eq','stars','Stars and Bars: tổng đúng bằng n','x1+…+xk=n, xi≥0 ⇒ N=C(n+k−1,k−1).','Đếm nghiệm nguyên không âm của phương trình hoặc phân phối vật giống nhau.','Xác định n và số biến k. Đảm bảo mọi biến ≥0 rồi áp dụng công thức.','Ví dụ: a+b+c=5, a,b,c≥0 ⇒ C(7,2)=21 nghiệm.','Cần đếm số biến chính xác; tổng n phải không âm.')
f('stars-le','stars','Stars and Bars: tổng không vượt quá n','x1+…+xk≤n, xi≥0 ⇒ N=C(n+k,k).','Đếm nghiệm nguyên không âm của bất phương trình với dấu ≤.','Thêm biến phụ t=n−(x1+…+xk)≥0, đưa về k+1 biến tổng bằng n.','Ví dụ: a+b≤4 ⇒ C(6,2)=15 nghiệm.','Không dùng công thức dấu = cho dấu ≤ khi chưa thêm biến phụ.')
f('shift','stars','Đổi biến theo cận dưới','Nếu xi≥ai, đặt yi=xi−ai≥0 và tổng mới bằng n−(a1+…+ak).','Phương trình có xi≥1, xi≥3 hoặc xi≥−1, ...','Đặt yi=xi−ai cho từng biến, tính tổng các cận dưới rồi áp dụng Stars and Bars.','Ví dụ: x1+x2=9, x1≥2, x2≥3 ⇒ y1+y2=4 ⇒ C(5,1)=5.','Nếu xi≥−1 thì phải đặt yi=xi+1; cẩn thận dấu âm.')
f('positive','stars','Phân phối ít nhất một vật mỗi thùng','x1+…+xk=n, xi≥1 ⇒ N=C(n−1,k−1), nếu n≥k.','Các vật giống nhau, hộp phân biệt và mỗi hộp ít nhất 1 vật.','Phát trước 1 vật cho mỗi thùng, còn n−k vật; dùng công thức tổng bằng.','Ví dụ: 9 kẹo giống nhau vào 3 hộp, mỗi hộp ≥1 ⇒ C(8,2)=28.','Nếu n<k thì không thể phân phối, số cách bằng 0.')
f('or','venn','Nguyên lý bù trừ cho hai tập','|A∪B|=|A|+|B|−|A∩B|.','Đề yêu cầu A HOẶC B, bao gồm trường hợp cả hai đúng.','Tính riêng số trường hợp thuộc A, thuộc B và thuộc cả hai; trừ phần trùng một lần.','Ví dụ: 20 biết A, 15 biết B, 6 biết cả hai ⇒ 20+15−6=29.','HOẶC trong toán rời rạc thường là hoặc bao hàm, trừ khi đề nói chỉ một trong hai.')
f('venn3','venn','Nguyên lý bù trừ cho ba tập','|A∪B∪C|=|A|+|B|+|C|−|A∩B|−|A∩C|−|B∩C|+|A∩B∩C|.','Đếm ít nhất một trong ba kỹ năng hoặc tập hợp.','Cộng ba tập, trừ các giao đôi, cộng lại giao ba.','Ví dụ: 12+10+9−4−3−2+1=23 phần tử thuộc ít nhất một tập.','Số liệu giao đôi tính cả những phần tử thuộc cả ba.')
f('venn-ex','venn','A hoặc B nhưng không thuộc C','|(A∪B)∖C| = |A|+|B|−|A∩B|−|A∩C|−|B∩C|+|A∩B∩C|.','Tìm người biết A hoặc B, không biết C.','Lấy số người biết A hoặc B, trừ phần thuộc C bằng công thức bù trừ.','Ví dụ: A=32, B=28, AB=12, AC=9, BC=7, ABC=4 ⇒ 32+28−12−9−7+4=36.','Đừng cộng chỉ A + chỉ B rồi quên nhóm AB mà không thuộc C.')
f('newton','nhithuc','Nhị thức Newton: hệ số một số hạng','(a+b)^n: số hạng ứng với k là C(n,k)·a^(n−k)·b^k.','Khai triển có hai hạng tử, cần hệ số x^p·y^q.','Xác định n, p, q (p+q=n). Chọn k=q; nhân C(n,k) với hệ số lũy thừa.','Ví dụ: hệ số x²y trong (2x−y)³ = C(3,1)·2²·(−1)=−12.','Đừng quên hệ số âm và lũy thừa của hệ số đi kèm x, y.')
f('multinomial','nhithuc','Định lý đa thức tổng quát','Trong (a₁x₁ + … + aₘxₘ)ⁿ, hệ số của x₁^k₁…xₘ^kₘ là [n!/(k₁!…kₘ!)]·a₁^k₁…aₘ^kₘ, với k₁+…+kₘ=n.','Khai triển có ít nhất ba hạng tử hoặc chia đối tượng vào nhóm phân biệt.','Xác định số mũ ki, kiểm tra tổng bằng n. Nhân thêm các hệ số số học lũy thừa ki.','Ví dụ: hệ số x²yz trong (x+2y−z)^4 = 4!/(2!1!1!)·2·(−1)=−24.','Các số mũ bằng 0 vẫn có 0!=1; không bỏ dấu hệ số âm.')
f('plus','quytac','Quy tắc cộng','Nếu chọn đúng một phương án trong các nhóm rời nhau có n1,…,nk cách, tổng N=n1+…+nk.','Câu hỏi chọn 1 đề, 1 sách, 1 thang máy hoặc thang bộ.','Kiểm tra các nhóm lựa chọn loại trừ nhau; cộng số cách từng nhóm.','Ví dụ: 4 xe buýt hoặc 3 tàu ⇒ 4+3=7 cách.','Nếu nhóm có phần giao, phải dùng nguyên lý bù trừ.')
f('product','quytac','Quy tắc nhân','Một công việc gồm k bước, có lần lượt n1,…,nk lựa chọn ⇒ N=n1×…×nk.','Chọn theo từng giai đoạn, chuyến đi nối chặng, chọn nhiều loại vật.','Đếm số lựa chọn ở bước 1, bước 2, ...; nhân nếu mỗi chuỗi lựa chọn là một phương án riêng.','Ví dụ: 3 đường A−B, 4 đường B−C ⇒ 3×4=12 cách.','Không cộng số cách các chặng khi phải thực hiện tất cả các chặng.')
f('comb','tohop','Tổ hợp chập k của n','C(n,k)=n!/[k!(n−k)!], với 0≤k≤n.','Chọn k đối tượng phân biệt trong n, không xét thứ tự.','Xác định n số đối tượng và k số cần chọn. Tính C(n,k).','Ví dụ: chọn 3 trong 8 viên bi đánh số ⇒ C(8,3)=56.','Màu giống nhau không có nghĩa viên bi giống nhau khi chúng đã được đánh số.')
f('selection','tohop','Chọn đủ từ nhiều nhóm','Nếu chọn r1 trong n1 và r2 trong n2 thì N=C(n1,r1)×C(n2,r2).','Chọn bò, heo, gà hoặc nhiều màu bi có số lượng yêu cầu.','Tính tổ hợp riêng từng nhóm, rồi nhân các số cách.','Ví dụ: chọn 2 bi đỏ từ 5 và 2 bi trắng từ 6 ⇒ C(5,2)C(6,2)=150.','Không cộng vì phải thỏa đồng thời yêu cầu ở từng nhóm.')
f('fibo-one','fibo','Đếm số lần gọi fibo(1)','T(0)=0; T(1)=1; T(n)=T(n−1)+T(n−2) với n≥2.','Hàm Fibonacci đệ quy thuần, hỏi có bao nhiêu lần gọi đối số bằng 1.','Lập bảng từ n=0 đến n cần tìm theo truy hồi; không tính fibo(0) như fibo(1).','Ví dụ: T(2)=1, T(3)=2, T(4)=3, T(5)=5, T(6)=8.','Số lần gọi fibo(1) không phải tổng mọi lời gọi hàm.')
f('fibo-total','fibo','Tổng số lời gọi đệ quy Fibonacci','L(0)=L(1)=1; L(n)=1+L(n−1)+L(n−2) với n≥2.','Câu hỏi đếm tổng cộng bao nhiêu lần hàm được gọi, gồm cả lời gọi ban đầu.','Mỗi lời gọi fibo(n) với n≥2 sinh ra hai lời gọi con và tính thêm chính nó.','Ví dụ: L(2)=3, L(3)=5, L(4)=9, L(5)=15.','Phải tính 1 cho lời gọi fibo(n) ở chính nút đang xét.')
f('partition','chiadoituong','Chia n đối tượng phân biệt vào các nhóm','N=n!/(r1!r2!…rm!), với r1+…+rm=n và các nhóm được phân biệt.','Chia quân bài, sách hoặc người vào nhóm có kích thước cố định.','Tính số vật ở mỗi người nhận và số dư. Chia n! cho tích giai thừa kích thước từng nhóm.','Ví dụ: 6 quân, A nhận 2, B nhận 2, dư 2 ⇒ 6!/(2!2!2!)=90.','Không chia thêm cho số người! nếu người nhận đã có danh tính khác nhau.')
f('roundtrip','quytac','Chuyến đi và về không lặp tuyến','Nếu A–B có a tuyến, B–C có b tuyến, không lặp tuyến trên lượt về: N=a×b×(b−1)×(a−1).','Đi A→B→C→B→A, đề cấm dùng lại tuyến của lượt đi.','Chọn lượt đi a×b; trên lượt về mỗi chặng cùng đoạn còn giảm đi một lựa chọn.','Ví dụ: a=4, b=3 ⇒ 4×3×2×3=72 cách.','Cần nêu giả định các tuyến đi được hai chiều và không lặp là so với lượt đi.')
# 19 original sample exercises, preserving detailed explanations + formula priority.
SAMPLES=[]
formula_for_topic={'anh-xa':'toan-anh','stars':'stars-eq','venn':'venn-ex','nhithuc':'multinomial','quytac':'product','fibo':'fibo-one','tohop':'comb','chiadoituong':'partition'}
for p in old['P']:
 t={'khai-trien':'nhithuc','quy-tac':'quytac','de-quy':'fibo','to-hop':'tohop','phan-chia':'chiadoituong'}.get(p['topic'],p['topic']);
 if t not in formula_for_topic: raise ValueError(t)
 fid=formula_for_topic[t]
 if p['id']==3: fid='stars-le'
 if p['id']==5: fid='or'
 if p['id']==7: fid='positive'
 if p['id']==9: fid='newton'
 if p['id'] in [11,12,13]: fid='plus'
 if p['id']==16: fid='selection'
 if p['id']==14: fid='roundtrip'
 SAMPLES.append({
 'id':p['id'],'topic':t,'title':p['title'],'statement':p['statement'],
 'recognize':p['recognize'],'method':p['approach'],'why':p['why'],
 'formulaId':fid,'generalFormula':p['formula'],'steps':p['steps'],
 'answer':p['answer'],'verify':p['check'],'mistake':p['mistake'],'level':p.get('level','Vừa')
 })
REVIEWS=[]
def add(topic,title,statement,formulaId,recognize,idea,steps,answer,example='',level='Cơ bản',mistake=''):
 n=len(REVIEWS)+1
 assert steps and isinstance(steps[0],(list,tuple)) and len(steps[0])==2
 REVIEWS.append({'id':n,'topic':topic,'title':title,'statement':statement,'formulaId':formulaId,'recognize':recognize,'idea':idea,
   'steps':[{'title':t,'detail':d} for t,d in steps],'answer':str(answer),'example':example,'level':level,'mistake':mistake})
# A. 6 problems: surjectivity
mapping=[
('f(x) = 3x − 7', 'f: R → R, f(x)=3x−7. Chứng minh f có toàn ánh không.','bac-nhat', [('Cho y tùy ý','Lấy y∈R bất kỳ và giải y=3x−7.'),('Tìm tiền ảnh','3x=y+7 ⇒ x=(y+7)/3, luôn thuộc R.'),('Kết luận','Mọi y thực đều có tiền ảnh x∈R nên f toàn ánh.')],'Có, toàn ánh'),
('f(x) = x² − 6x + 8','f: R → R, f(x)=x²−6x+8. Xét tính toàn ánh.','bac-hai',[('Hoàn thành bình phương','x²−6x+8=(x−3)²−1.'),('Tìm khoảng giá trị','Vì (x−3)²≥0 nên f(x)≥−1.'),('Phản ví dụ','y=−2 thuộc R nhưng không tồn tại x thực làm f(x)=−2.')],'Không toàn ánh'),
('f(x) = x³ + 4','f: R → R, f(x)=x³+4. Chứng minh hoặc bác bỏ tính toàn ánh.','toan-anh',[('Lấy giá trị đích','Cho y∈R bất kỳ.'),('Giải phương trình','y=x³+4 ⇒ x=∛(y−4).'),('Kết luận','Căn bậc ba của mọi số thực tồn tại trong R ⇒ f toàn ánh.')],'Có, toàn ánh'),
('f(x) = 5x² + 2','f: R → R, f(x)=5x²+2. Xét tính toàn ánh.','bac-hai',[('Xét dấu','x²≥0 nên 5x²+2≥2.'),('Chọn phản ví dụ','y=1 là số thực nhưng không có x nào để f(x)=1.'),('Kết luận','Tập giá trị là [2,+∞), không phủ hết R.')],'Không toàn ánh'),
('Đổi tập đích của f(x) = x²','Cho f: R → [0,+∞), f(x)=x². Xét tính toàn ánh đối với tập đích được cho.','toan-anh',[('Xác định đúng tập đích','Ở đây y chỉ cần chạy trên [0,+∞), không phải toàn R.'),('Giải f(x)=y','Với y≥0, chọn x=√y; khi đó x∈R và x²=y.'),('Kết luận','Mọi y trong [0,+∞) đều có tiền ảnh nên toàn ánh.')],'Có, toàn ánh'),
('f(x) = −2x² + 8','Cho f: R → R, f(x)=−2x²+8. Hàm có toàn ánh không?','bac-hai',[('Đánh giá biểu thức','−2x²≤0 nên f(x)≤8.'),('Phản ví dụ','y=9 thuộc R nhưng phương trình −2x²+8=9 vô nghiệm thực.'),('Kết luận','Không đạt được mọi y thực ⇒ không toàn ánh.')],'Không toàn ánh')]
for title,stm,fid,steps,ans in mapping:
 add('anh-xa',title,stm,fid,'Nhận ra yêu cầu kiểm tra tính toàn ánh và tập đích trong đề.','Dùng định nghĩa ∀y∈B, ∃x∈A sao cho f(x)=y; chứng minh bằng giải phương trình hoặc phản ví dụ.',steps,ans,'Xét f(x)=x+1 từ R đến R: y=x+1 ⇒ x=y−1.',mistake='Luôn xét đúng tập đích; không được mặc định mọi hàm bình phương đều không toàn ánh.')
# B. 15 Stars and Bars
cases=[
(7,'Ba biến tổng 18 có cận dưới','x1+x2+x3=18, x1≥2, x2≥3, x3≥1.',18,[2,3,1],False,'stars-eq'),
(8,'Bốn biến tổng 30 có cận dưới','x1+x2+x3+x4=30, x1≥2, x2≥1, x3≥3, x4≥4.',30,[2,1,3,4],False,'stars-eq'),
(9,'Ba biến có tổng không vượt 20','x1+x2+x3≤20, x1≥1, x2≥2, x3≥3.',20,[1,2,3],True,'stars-le'),
(10,'Bốn biến có tổng không vượt 16','x1+x2+x3+x4≤16, x1≥0, x2≥1, x3≥2, x4≥1.',16,[0,1,2,1],True,'stars-le'),
(11,'Năm biến nguyên dương tổng 16','x1+x2+x3+x4+x5=16, mọi xi≥1.',16,[1]*5,False,'positive'),
(12,'Bốn số nguyên dương tổng 12','x1+x2+x3+x4=12, xi≥1 với mọi i.',12,[1]*4,False,'positive'),
(13,'Ba biến có một cận âm','x1+x2+x3=12, x1≥−2, x2≥2, x3≥1.',12,[-2,2,1],False,'shift'),
(14,'Bốn biến tổng 14','x1+x2+x3+x4=14, x1≥2, x2≥0, x3≥1, x4≥0.',14,[2,0,1,0],False,'stars-eq'),
(15,'Ba biến tổng không vượt 12','x1+x2+x3≤12, x1≥1, x2≥1, x3≥1.',12,[1]*3,True,'stars-le'),
(16,'6 viên kẹo vào 3 hộp','Phân phối hết 6 viên kẹo giống nhau vào 3 hộp phân biệt, các hộp có thể rỗng.',6,[0]*3,False,'stars-eq'),
(17,'17 viên bi, mỗi hộp ít nhất 2','Phân phối hết 17 viên bi giống nhau vào 4 hộp phân biệt; mỗi hộp ít nhất 2 viên.',17,[2]*4,False,'shift'),
(18,'22 quả bóng, mỗi thùng ít nhất 1','Phân phối hết 22 quả bóng giống nhau vào 6 thùng phân biệt; mỗi thùng ít nhất 1 quả.',22,[1]*6,False,'positive')]
for number,title,statement,n,lows,is_le,fid in cases:
 assert len(REVIEWS)+1==number
 k=len(lows); nnew=n-sum(lows); assert nnew>=0
 result=C(nnew+k,k) if is_le else C(nnew+k-1,k-1)
 var=', '.join(f'y{i}=x{i}−({lo})' if lo<0 else f'y{i}=x{i}−{lo}' for i,lo in enumerate(lows,1))
 plus=' + '.join('y'+str(i) for i in range(1,k+1))
 relation='≤' if is_le else '='
 steps=[('Đổi biến về không âm',f'Đặt {var}; tất cả yi≥0. Tổng các cận dưới = {sum(lows)}.'),('Tính tổng mới',f'{plus} {relation} {n}−({sum(lows)}) = {nnew}.')]
 if is_le:
  steps.append(('Thêm biến phụ',f'Đặt t={nnew}−({plus})≥0. Khi đó {plus}+t={nnew}, có {k+1} biến không âm.'))
  steps.append(('Áp dụng công thức',f'C(n+k,k)=C({nnew}+{k},{k})=C({nnew+k},{k})={result}.'))
 else:
  steps.append(('Áp dụng công thức',f'C(n+k−1,k−1)=C({nnew}+{k}−1,{k}−1)=C({nnew+k-1},{k-1})={result}.'))
 premise='Đếm nghiệm hoặc phân phối vật giống nhau qua các biến đếm không âm.'
 add('stars',title,statement+(' Hỏi có bao nhiêu cách phân phối?' if number>=16 else ' Tìm số bộ số nguyên thỏa mãn các điều kiện trên.'),fid,premise,'Bước đầu đổi biến về không âm; phân biệt tổng bằng và tổng không vượt.',steps,f'{result} cách' if number>=16 else f'{result} nghiệm','Ví dụ: a+b+c=5 với a,b,c≥0 ⇒ C(7,2)=21.',level='Cơ bản' if number in (7,11,12,16) else 'Vận dụng',mistake='Dấu ≤ cần thêm một biến phụ; các cận dưới phải được trừ đúng dấu.')
# cases 19 20 OR, 21 AND
for n,title,statement,k,total,a,b in [
 (19,'Ba biến: x1≥3 hoặc x2≥2','x1+x2+x3=12, các xi nguyên không âm; yêu cầu x1≥3 HOẶC x2≥2 (kể cả cùng đúng).',3,12,3,2),
 (20,'Bốn biến: x1≥4 hoặc x2≥3','x1+x2+x3+x4=16, các xi nguyên không âm; yêu cầu x1≥4 HOẶC x2≥3 (kể cả cùng đúng).',4,16,4,3)]:
 assert len(REVIEWS)+1==n
 A=C(total-a+k-1,k-1);B=C(total-b+k-1,k-1);I=C(total-a-b+k-1,k-1)
 add('stars',title,statement,'or','Điều kiện HOẶC có thể trùng nhau.','Gọi A là nghiệm x1≥a và B là nghiệm x2≥b; tính từng phần bằng Stars and Bars rồi dùng bù trừ.',[
  ('Tính số nghiệm thuộc A',f'Đặt y1=x1−{a}. Tổng mới {total}−{a}={total-a}; |A|=C({total-a+k-1},{k-1})={A}.'),
  ('Tính số nghiệm thuộc B',f'Đặt y2=x2−{b}. Tổng mới {total}−{b}={total-b}; |B|=C({total-b+k-1},{k-1})={B}.'),
  ('Tính giao A∩B',f'Cả hai cận cùng đúng: tổng mới {total}−{a}−{b}={total-a-b}; |A∩B|=C({total-a-b+k-1},{k-1})={I}.'),
  ('Bù trừ',f'|A∪B|={A}+{B}−{I}={A+B-I}.')],f'{A+B-I} nghiệm','Ví dụ: |A|=8, |B|=9, |A∩B|=3 ⇒ |A∪B|=14.',level='Vận dụng',mistake='Không đếm phần giao hai lần. Trong điều kiện HOẶC, cả hai điều kiện cùng đúng vẫn được tính.')
assert len(REVIEWS)+1==21
add('stars','Ba biến: hai điều kiện đồng thời','x1+x2+x3=10, xi nguyên không âm, đồng thời x1≥2 VÀ x2≥3. Có bao nhiêu nghiệm?','shift','Điều kiện VÀ là cận dưới đồng thời, không phải hợp hai tập.','Đổi biến x1 và x2 cùng lúc.',[
 ('Đổi biến','Đặt a=x1−2≥0 và b=x2−3≥0.'),('Tổng mới','a+b+x3=10−2−3=5.'),('Stars and Bars','C(5+3−1,3−1)=C(7,2)=21.')],'21 nghiệm','Ví dụ: với x1≥1 VÀ x2≥1 thì trừ cả hai cận dưới.',mistake='Không dùng cộng trừ tập hợp khi đề bắt buộc cả hai điều kiện đồng thời.')
# C Venn 5
add('venn','Hai ngôn ngữ lập trình','Trong lớp có 30 người biết C++, 24 người biết Python và 10 người biết cả hai. Hỏi bao nhiêu người biết ít nhất một trong hai ngôn ngữ?','or','Ít nhất một ngôn ngữ là phép hợp của hai tập.','Áp dụng công thức hai tập |A∪B|.',[
 ('Đặt tập','A: biết C++; B: biết Python.'),('Xác định giao','|A|=30, |B|=24, |A∩B|=10.'),('Tính hợp','|A∪B|=30+24−10=44.')],'44 người','Ví dụ: 12 biết A, 8 biết B, 5 biết cả hai ⇒ 15 người.',mistake='Giao hai tập phải trừ đi một lần.')
add('venn','Biết A hoặc B nhưng không biết C','Có 32 người biết C++, 28 biết Python, 20 biết Pascal; 12 biết C++ và Python, 9 biết C++ và Pascal, 7 biết Python và Pascal, 4 biết cả ba. Hỏi bao nhiêu người biết C++ hoặc Python nhưng không biết Pascal?','venn-ex','Hỏi phần (A∪B)∖C.','Dùng công thức bù trừ cho hợp hai tập loại bỏ C.',[
 ('Đặt tập','A=C++, B=Python, C=Pascal.'),('Chỉ A','32−12−9+4=15.'),('Chỉ B và giao AB ngoài C','Chỉ B=28−12−7+4=13; chỉ AB=12−4=8.'),('Cộng vùng hợp lệ','15+13+8=36. Kiểm tra bằng công thức trực tiếp: 32+28−12−9−7+4=36.')],'36 người','Ví dụ: biết A hoặc B nhưng không C là không tính bất kỳ vùng nào thuộc C.',level='Vận dụng',mistake='Dữ kiện giao đôi đã bao gồm cả giao ba.')
add('venn','Chỉ biết C++','Trong một khảo sát, 40 người biết C++, 16 biết cả C++ và Python, 14 biết cả C++ và Pascal, 6 biết cả ba. Hỏi bao nhiêu người chỉ biết C++?','venn-ex','Chỉ A = A không thuộc B và không thuộc C.','Trừ hai giao đôi rồi cộng lại giao ba.',[
 ('Xác định tập','A=C++, B=Python, C=Pascal.'),('Bù trừ trong tập A','Chỉ A=|A|−|A∩B|−|A∩C|+|A∩B∩C|.'),('Thay số','40−16−14+6=16.')],'16 người','Ví dụ: chỉ A khác với A và B nhưng không C.',mistake='Không quên cộng lại giao ba đã bị trừ hai lần.')
add('venn','Biết đúng hai trong ba ngôn ngữ','Có 14 người biết cả C++ và Python, 11 người biết cả C++ và Pascal, 9 người biết cả Python và Pascal, 5 người biết cả ba ngôn ngữ. Hỏi bao nhiêu người biết đúng hai ngôn ngữ?','venn3','Đúng hai nghĩa là loại các phần tử thuộc cả ba khỏi từng giao đôi.','Tính từng vùng giao đôi trừ giao ba.',[
 ('Giao C++ và Python, không Pascal','14−5=9.'),('Giao C++ và Pascal, không Python','11−5=6.'),('Giao Python và Pascal, không C++','9−5=4.'),('Cộng ba vùng rời nhau','9+6+4=19.')],'19 người','Ví dụ: nếu AB=7, ABC=2 thì chỉ AB=5.',mistake='Cộng AB+AC+BC trực tiếp sẽ đếm người biết cả ba tới 3 lần.')
add('venn','Ít nhất một trong ba kỹ năng','Khảo sát ba kỹ năng: |A|=25, |B|=22, |C|=18, |A∩B|=8, |A∩C|=6, |B∩C|=7, |A∩B∩C|=3. Hỏi có bao nhiêu người có ít nhất một kỹ năng?','venn3','Ít nhất một trong ba là hợp ba tập.','Cộng ba tập, trừ ba giao đôi, cộng lại giao ba.',[
 ('Viết công thức','|A∪B∪C|=|A|+|B|+|C|−|AB|−|AC|−|BC|+|ABC|.'),('Thay dữ kiện','25+22+18−8−6−7+3.'),('Tính','65−21+3=47.')],'47 người','Ví dụ: biết ít nhất 1 là thuộc A∪B∪C, không phải đúng 1.',mistake='Cộng giao ba một lần ở cuối, vì phần này đã bị trừ quá mức.')
# D Multi 6
multicases=[
 ('Hệ số x³y² của (2x+y)⁵','Tìm hệ số của x³y² trong khai triển (2x+y)⁵.', 'newton', [('Xác định số mũ','n=5; x có mũ 3, y có mũ 2, tổng 5.'),('Số hạng cần tìm','C(5,2)(2x)³(y)².'),('Tính hệ số','C(5,2)×2³=10×8=80.')],80),
 ('Hệ số x²y⁴ của (x−3y)⁶','Tìm hệ số của x²y⁴ trong khai triển (x−3y)⁶.','newton',[('Số mũ mục tiêu','n=6, k=4 vì cần y⁴.'),('Hệ số tổ hợp','C(6,4)=15.'),('Nhân hệ số','15×1²×(−3)⁴=15×81=1215.')],1215),
 ('Hệ số x⁴y³ của (−2x+y)⁷','Tìm hệ số x⁴y³ trong (−2x+y)⁷.','newton',[('Số mũ','n=7; x:4, y:3, nên k=3.'),('Hệ số','C(7,3)(−2)⁴×1³.'),('Tính','35×16=560.')],560),
 ('Hệ số x²yz của (x+2y−z)⁴','Tìm hệ số x²yz trong (x+2y−z)⁴.','multinomial',[('Chọn số mũ','kx=2, ky=1, kz=1; tổng bằng 4.'),('Hệ số đa thức','4!/(2!1!1!)=12.'),('Nhân hệ số gốc','12×1²×2¹×(−1)¹=−24.')],-24),
 ('Hệ số x³y²t trong đa thức bốn hạng','Tìm hệ số x³y²t trong (−x+3y+2z+t)⁶.','multinomial',[('Xác định số mũ','kx=3, ky=2, kz=0, kt=1; tổng 6.'),('Hệ số tổ hợp','6!/(3!2!0!1!)=60.'),('Nhân hệ số','60×(−1)³×3²×2⁰×1=−540.')],-540),
 ('Hệ số x²y²z² trong (x+y−2z)⁶','Tìm hệ số x²y²z² trong (x+y−2z)⁶.','multinomial',[('Xác định số mũ','2+2+2=6, phù hợp bậc đa thức.'),('Hệ số đa thức','6!/(2!2!2!)=90.'),('Nhân hệ số','90×1²×1²×(−2)²=360.')],360)]
for title,stm,fid,st,ans in multicases:
 add('nhithuc',title,stm,fid,'Từ khóa “hệ số của” trong một khai triển lũy thừa.','Xác định các số mũ, dùng nhị thức Newton nếu 2 hạng tử hoặc đa thức tổng quát nếu nhiều hơn.',st,ans,'Ví dụ: hệ số xy² trong (x+y)³ là C(3,2)=3.',level='Vận dụng',mistake='Nhân thêm hệ số của từng hạng tử theo lũy thừa và kiểm tra dấu.')
# E 5 count
add('quytac','Chọn một quyển sách','Có 120 sách toán, 80 sách văn học và 65 sách lịch sử, các quyển đều khác nhau. Chọn đúng một quyển sách. Có bao nhiêu cách?','plus','Chọn một cuốn từ một trong ba nhóm không giao nhau.','Dùng quy tắc cộng.',[('Xác định loại lựa chọn','Chọn Toán HOẶC Văn học HOẶC Lịch sử.'),('Áp dụng','120+80+65=265.')],'265 cách','Ví dụ: 4 lựa chọn A hoặc 3 lựa chọn B ⇒ 7 cách.',mistake='Không nhân ba số lượng vì chỉ chọn một cuốn.')
add('quytac','Chọn đường lên tầng','Một tòa nhà có 4 thang bộ, 2 thang máy và 1 thang cuốn, mỗi loại dẫn từ tầng 1 lên tầng 3. Chọn một cách đi.','plus','Chọn một trong ba phương án rời nhau.','Cộng số lựa chọn.',[('Phân tích phương án','4 thang bộ HOẶC 2 thang máy HOẶC 1 thang cuốn.'),('Tính','4+2+1=7.')],'7 cách','Ví dụ: 2 thang bộ + 3 thang máy = 5 lựa chọn.',mistake='Chỉ có một công đoạn nên không sử dụng quy tắc nhân.')
add('quytac','Tuyến đường A đến C qua B','Từ A đến B có 5 tuyến xe, từ B đến C có 4 tuyến xe. Một người đi từ A đến C qua B. Hỏi có bao nhiêu hành trình?','product','Hai chặng bắt buộc phải thực hiện liên tiếp.','Nhân số cách chọn từng chặng.',[('Chặng A→B','Có 5 tuyến có thể chọn.'),('Chặng B→C','Với mỗi tuyến A→B, có 4 tuyến B→C.'),('Quy tắc nhân','5×4=20.')],'20 hành trình','Ví dụ: A→B có 2, B→C có 3 ⇒ 6 hành trình.',mistake='Không cộng số tuyến ở hai chặng.')
add('quytac','Đi về được lặp tuyến','Từ A đến B có 3 tuyến, từ B đến C có 4 tuyến, các tuyến đi hai chiều. Người đi A→B→C→B→A và được sử dụng lại tuyến cũ. Có bao nhiêu cách?','product','Chuyến đi gồm bốn chặng với quyền chọn lại ở lượt về.','Nhân từng số cách từ đầu đến cuối.',[('Lượt đi','A→B: 3; B→C: 4. Lượt đi có 3×4=12 cách.'),('Lượt về','C→B: 4; B→A: 3. Lượt về có 4×3=12 cách.'),('Tổng','12×12=144.')],'144 cách','Ví dụ: 4 và 3 tuyến, được lặp ⇒ 4×3×3×4=144.',level='Vận dụng',mistake='Đừng trừ số tuyến đã dùng nếu đề cho phép sử dụng lại.')
add('quytac','Đi về không lặp tuyến','Từ A đến B có 5 tuyến, từ B đến C có 3 tuyến, tất cả đi được hai chiều. Đi A→B→C rồi về C→B→A, không được dùng lại tuyến đã sử dụng ở lượt đi. Có bao nhiêu cách?','roundtrip','Lượt về mỗi đoạn giảm một lựa chọn.','Tính đi và về đồng thời theo bốn chặng.',[('Chọn lượt đi','A→B: 5; B→C: 3.'),('Chọn lượt về','C→B không được chọn tuyến vừa đi: 3−1=2; B→A còn 5−1=4.'),('Quy tắc nhân','5×3×2×4=120.')],'120 cách','Ví dụ: 4 tuyến A−B, 3 tuyến B−C ⇒ 4×3×2×3=72.',level='Vận dụng',mistake='Cấm lặp so với tuyến đã chọn, không phải cấm toàn bộ các tuyến từng sử dụng bởi người khác.')
# F 3 Fibonacci
for n,title,kind in [(6,'Đếm fibo(1) trong fibo(6)','one'),(9,'Đếm fibo(1) trong fibo(9)','one'),(5,'Đếm tổng lời gọi fibo(5)','total')]:
 seq=[0,1] if kind=='one' else [1,1]
 for i in range(2,n+1):seq.append(seq[-1]+seq[-2]+(1 if kind=='total' else 0))
 ans=seq[n]; idform='fibo-one' if kind=='one' else 'fibo-total'
 stmt=f'Cho fibo(0)=0, fibo(1)=1 và fibo(k)=fibo(k−1)+fibo(k−2) khi k≥2. Khi tính fibo({n}) bằng đệ quy thuần, '+ ('hàm fibo(1) được gọi bao nhiêu lần?' if kind=='one' else 'tổng cộng hàm fibo được gọi bao nhiêu lần, kể cả lời gọi đầu tiên?')
 steps=[('Định nghĩa hàm đếm', 'Đặt T(k) là số lần xuất hiện fibo(1); T(0)=0, T(1)=1.' if kind=='one' else 'Đặt L(k) là tổng số lời gọi; L(0)=L(1)=1.'),('Lập truy hồi', 'T(k)=T(k−1)+T(k−2) vì hai nhánh sinh các lời gọi con.' if kind=='one' else 'L(k)=1+L(k−1)+L(k−2), cộng thêm lời gọi tại nút đang xét.'),('Tính lần lượt',', '.join(f'{"T" if kind=="one" else "L"}({i})={v}' for i,v in enumerate(seq))),('Trả lời',f'Kết quả tại n={n} bằng {ans}.')]
 add('fibo',title,stmt,idform,'Đếm số nút trong cây đệ quy, không phải giá trị hàm fibo.','Dùng truy hồi phù hợp yêu cầu: số lần gọi một đối số hay tổng mọi lời gọi.',steps,f'{ans} lần','Ví dụ: fibo(4) gọi fibo(1) ba lần; tổng số lời gọi fibo(4) bằng 9.',level='Vận dụng',mistake='Số lần gọi fibo(1) và tổng số lời gọi hàm là hai đại lượng khác nhau.')
# G 6 combination
combo_specs=[
 ('Chọn 3 trong 9 viên bi','Một hộp có 9 viên bi đều đánh số khác nhau. Chọn 3 viên cùng lúc, không xét thứ tự.','comb', [('Tổng số và số cần chọn','n=9, k=3.'),('Dùng tổ hợp','C(9,3)=9!/(3!6!)=84.')],84),
 ('Chọn 2 bò và 3 heo','Một trang trại có 7 con bò và 6 con heo, tất cả con vật phân biệt. Chọn 2 bò và 3 heo. Hỏi có bao nhiêu cách chọn?','selection',[('Nhóm bò','C(7,2)=21.'),('Nhóm heo','C(6,3)=20.'),('Kết hợp','21×20=420.')],420),
 ('Chọn đúng hai màu bi','Có 5 bi đỏ và 6 bi trắng, mọi bi đều đánh số riêng. Chọn đúng 2 bi đỏ và đúng 2 bi trắng, không xét thứ tự. Hỏi có bao nhiêu cách chọn?','selection',[('Chọn bi đỏ','C(5,2)=10.'),('Chọn bi trắng','C(6,2)=15.'),('Nhân hai công đoạn','10×15=150.')],150),
 ('Chọn ban đại diện','Có 10 học sinh phân biệt, cần chọn 4 người vào một ban, không phân biệt chức vụ. Có bao nhiêu cách?','comb',[('Nhận dạng','Chọn 4 người trong 10, không gán vị trí.'),('Tổ hợp','C(10,4)=10!/(4!6!)=210.')],210),
 ('Chọn một bút mỗi màu','Một hộp có 4 bút xanh và 5 bút đỏ, từng chiếc bút phân biệt. Chọn 1 bút xanh và 1 bút đỏ. Hỏi có bao nhiêu cách chọn?','selection',[('Chọn bút xanh','C(4,1)=4.'),('Chọn bút đỏ','C(5,1)=5.'),('Kết hợp','4×5=20.')],20),
 ('Chọn 5 lá bài đánh số','Có 12 lá bài phân biệt được đánh số từ 1 đến 12. Rút đồng thời 5 lá, không xét thứ tự. Có bao nhiêu kết quả?','comb',[('Xác định phương pháp','Chọn tập con gồm 5 lá từ 12 lá.'),('Tổ hợp','C(12,5)=12!/(5!7!)=792.')],792)]
for title,stm,fid,steps,ans in combo_specs:
 add('tohop',title,stm,fid,'Chọn các vật phân biệt, không quan tâm thứ tự.','Nếu có nhiều loại cần chọn đồng thời, dùng tích các tổ hợp; nếu chọn tự do, dùng một tổ hợp.',steps,f'{ans} cách','Ví dụ: Chọn 2 trong 6 vật phân biệt ⇒ C(6,2)=15.',mistake='Khi không xét thứ tự, không dùng chỉnh hợp.')
# H 4 group distributions
partition_cases=[
 ('8 quân bài cho hai người','Có 8 quân bài phân biệt. Người A nhận đúng 2 quân, người B đúng 2 quân, 4 quân còn lại không chia. Hỏi có bao nhiêu cách?',8,[2,2,4]),
 ('10 quân bài cho ba người','Có 10 quân bài phân biệt. Ba người A, B, C mỗi người nhận đúng 2 quân, còn lại 4 quân không chia. Hỏi có bao nhiêu cách?',10,[2,2,2,4]),
 ('7 món quà cho hai người','Có 7 món quà phân biệt. A nhận đúng 3 món, B nhận đúng 2 món, hai món còn lại không trao. Hỏi có bao nhiêu cách?',7,[3,2,2]),
 ('9 sách cho ba học sinh','Có 9 quyển sách phân biệt. Ba học sinh A, B, C mỗi người nhận đúng 3 quyển. Hỏi có bao nhiêu cách chia, không xét thứ tự sách mỗi người nhận?',9,[3,3,3])]
for title,stm,n,sizes in partition_cases:
 assert sum(sizes)==n
 answer=math.factorial(n)
 for r in sizes:answer//=1 # do exact division after product
 answer=math.factorial(n)//math.prod(math.factorial(r) for r in sizes)
 a=0; sts=[]; v=1
 for i,r in enumerate(sizes[:-1]):
  ways=C(n-a,r);v*=ways
  sts.append((f'Chọn cho người {chr(65+i)}',f'C({n-a},{r})={ways}. Sau đó còn {n-a-r} đối tượng.'))
  a+=r
 sts.append(('Phần dư hoặc nhóm cuối',f'Nhóm còn lại có {sizes[-1]} đối tượng, được xác định tự động.' if len(sizes)>2 and sizes[-1]!=sizes[-2] else f'Nhóm cuối còn {sizes[-1]} đối tượng, được xác định tự động.'))
 denom='×'.join(str(r)+'!' for r in sizes)
 sts.append(('Công thức tổng quát',f'N={n}!/({denom})={answer}. Cũng bằng tích các tổ hợp liên tiếp.'))
 assert v==answer,(title,v,answer)
 add('chiadoituong',title,stm,'partition','Người nhận phân biệt, mỗi nhóm được ấn định kích thước.','Chọn tuần tự cho từng người hoặc dùng công thức đa thức n!/(r1!…rm!).',sts,f'{answer} cách','Ví dụ: 6 quân, A nhận 2, B nhận 2, dư 2 ⇒ 6!/(2!2!2!)=90.',level='Vận dụng',mistake='Không chia thêm cho số hoán vị người nhận vì A, B, C là những người khác nhau.')
assert len(SAMPLES)==19
assert len(REVIEWS)==50,len(REVIEWS)
assert [x['id'] for x in REVIEWS]==list(range(1,51))
assert [x['id'] for x in SAMPLES]==list(range(1,20))
D={'meta':{'title':'Sủi Study Lab','version':'3.0','course':'Toán rời rạc'},'topics':TOPICS,'formulas':formula,'samples':SAMPLES,'reviews':REVIEWS}
with open(BASE/'data.json','w',encoding='utf-8') as fd:json.dump(D,fd,ensure_ascii=False,indent=2)
print('Generated',len(formula),'formulas,',len(SAMPLES),'samples,',len(REVIEWS),'review problems')
for p in REVIEWS:print(f"{p['id']:02d} {p['topic']:15} {p['answer']:>15} {p['title']}")
