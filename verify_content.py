"""Independent checks of all delivered question numbers and mathematical categories."""
import json, math, pathlib
from itertools import product
from functools import reduce
p=pathlib.Path(__file__).resolve().parents[1]
d=json.loads((p/'data.json').read_text('utf-8'))
R=d['reviews']; S=d['samples']
assert len(R)==50 and len(S)==19 and len(d['formulas'])==20
want=["Có, toàn ánh","Không toàn ánh","Có, toàn ánh","Không toàn ánh","Có, toàn ánh","Không toàn ánh",91,1771,680,1820,1365,165,78,364,220,28,220,20349,85,795,21,44,36,16,19,47,80,1215,560,-24,-540,360,265,7,20,144,120,8,34,15,84,420,150,210,20,792,420,18900,210,1680]
assert len(want)==50
for row,expected in zip(R,want):
 assert str(expected) in row['answer'],(row['id'],row['answer'],expected)
 assert row['statement'] and row['steps'] and row['formulaId']
 assert row['formulaId'] in {f['id'] for f in d['formulas']}
# Check 12 Stars-and-bars cases with DP (not formula comb):
cas=[(18,[2,3,1],False),(30,[2,1,3,4],False),(20,[1,2,3],True),(16,[0,1,2,1],True),(16,[1]*5,False),(12,[1]*4,False),(12,[-2,2,1],False),(14,[2,0,1,0],False),(12,[1]*3,True),(6,[0]*3,False),(17,[2]*4,False),(22,[1]*6,False)]
def dp(total,lows,is_le):
 total-=sum(lows)
 ways=[1]+[0]*total
 for _ in lows:
  nxt=[0]*(total+1)
  for s in range(total+1):
   nxt[s]=sum(ways[:s+1])
  ways=nxt
 return sum(ways) if is_le else ways[total]
for row,(total,lows,le) in zip(R[6:18],cas):
 assert int(row['answer'].split()[0])==dp(total,lows,le),(row['id'],row['answer'])
# Direct small enumeration for the three OR/AND constraints.
cnt=lambda n,k,check: sum(bool(check(*t)) for t in product(range(n+1),repeat=k) if sum(t)==n)
assert cnt(12,3,lambda a,b,c:a>=3 or b>=2)==85
assert cnt(16,4,lambda a,b,c,d:a>=4 or b>=3)==795
assert cnt(10,3,lambda a,b,c:a>=2 and b>=3)==21
# Independent checks for polynomial coefficients.
from sympy import symbols, expand
x,y,z,t=symbols('x y z t')
checks=[((2*x+y)**5, x**3*y**2,80),((x-3*y)**6,x**2*y**4,1215),((-2*x+y)**7,x**4*y**3,560),((x+2*y-z)**4,x**2*y*z,-24),((-x+3*y+2*z+t)**6,x**3*y**2*t,-540),((x+y-2*z)**6,x**2*y**2*z**2,360)]
for expr,monomial,w in checks:
 assert expand(expr).coeff(monomial)==w,(expr,monomial)
# Existing 19 sample answers; validate expected outputs and order.
answers=['x + 1','x³ − 2','969','969','229','816','715','29','489888','−1260','77','5','4000','144','21','14000','330','7560','90']
for row,w in zip(S,answers):
 assert w in row['answer'],(row['id'],row['answer'],w)
print('OK: 20 formulae, 19 sample answers, 50 practice answers, 12 DP, 3 brute-force, 6 polynomial checks')
