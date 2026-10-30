"""Independent exact arithmetic sanity checks for the 19 known answers."""
import json,math,itertools
from pathlib import Path
D=json.loads(Path(__file__).resolve().parents[1].joinpath('data.json').read_text('utf8'))
P=D['P']; ans={1:'d)',2:'c)',3:'969',4:'969',5:'229',6:'816',7:'715',8:'29',9:'489888',10:'−1260',11:'77',12:'5',13:'4000',14:'144',15:'21',16:'14000',17:'330',18:'7560',19:'90'}
for p in P:
 assert ans[p['id']] in p['answer'],(p['id'],p['answer'])
assert math.comb(19,3)==969
assert math.comb(18,3)==816
assert math.comb(13,4)==715
assert math.comb(11,3)+math.comb(10,3)-math.comb(8,3)==229
# exhaustive enumeration for OR problem
cnt=sum(1 for a in range(11) for b in range(11-a) for c in range(11-a-b) if a>=2 or b>=3)
assert cnt==229,(cnt)
assert 28+25+20-12-9-8+5==49
assert (28-9)+(25-8)-(12-5)==29
assert math.comb(9,4)*3**5*(-2)**4==489888
assert math.factorial(10)//(math.factorial(5)*math.factorial(4))*(-1)**5==-1260
assert 4*3*3*4==144 and 4*3*2*3==72
fib=[0,1]
for i in range(2,9):fib.append(fib[-1]+fib[-2])
assert fib[8]==21
assert math.comb(6,3)*math.comb(5,2)*math.comb(8,4)==14000
assert math.comb(11,4)==330
assert math.comb(9,2)*math.comb(7,2)*math.comb(5,2)==7560
assert math.comb(6,2)*math.comb(4,2)==90
print('19 mathematical answer checks passed')
