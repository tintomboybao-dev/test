"""Verify solutions against the definitions, using only Python's standard library."""
import itertools, json
from pathlib import Path
BASE=Path(__file__).resolve().parents[1]
CASES=json.loads((BASE/'tests/db-cases.json').read_text())

def powerset(s):
    s=sorted(s)
    return [frozenset(x) for n in range(len(s)+1) for x in itertools.combinations(s,n)]
def close(attrs,deps):
    current=frozenset(attrs)
    while True:
        result=current.union(*(set(right) for left,right in deps if set(left)<=current))
        if result==current:return current
        current=result

def candidate_keys(U,F):
    return [x for x in powerset(U) if close(x,F)==set(U) and all(close(x-{a},F)!=set(U) for a in x)]
def projected(R,F):
    return [(x,{a}) for x in powerset(R) for a in (close(x,F)&set(R))-x]
def lossless(U,F,parts):
    cols=list(U)
    rows=[[('a',j) if a in r else ('b',i,j) for j,a in enumerate(cols)] for i,r in enumerate(parts)]
    parent={x:x for row in rows for x in row}
    def find(x):
        if parent[x]!=x:parent[x]=find(parent[x])
        return parent[x]
    def union(x,y):
        x,y=find(x),find(y)
        if x==y:return False
        if x[0]!='a' and (y[0]=='a' or y<x):x,y=y,x
        parent[y]=x
        return True
    while True:
        changed=False
        for left,right in F:
            for a,b in itertools.combinations(rows,2):
                if all(find(a[cols.index(k)])==find(b[cols.index(k)]) for k in left):
                    for k in right:changed=union(a[cols.index(k)],b[cols.index(k)]) or changed
        if not changed:break
    return any(all(find(row[j])==find(('a',j)) for j in range(len(cols))) for row in rows)
def natural_join(tables):
    result=[{}]
    for table in tables:
        result=[dict(a,**b) for a in result for b in table if all(a[k]==b[k] for k in a.keys()&b.keys())]
    return result

def normal_form(U,F):
    keys=candidate_keys(U,F);prime=set().union(*keys)
    two=all(not ((close(x,F)-x)&(set(U)-prime)) for k in keys for x in powerset(k) if x<k)
    three=True;bcnf=True
    for x in powerset(U):
        c=close(x,F)
        if c!=set(U):
            if c-x:bcnf=False
            if (c-x)-prime:three=False
    return 'BCNF' if bcnf else '3NF' if three else '2NF' if two else '1NF'

for case in CASES:
    label=case['label'];U=case['U'];F=case['F']
    assert all(set(a+b)<=set(U) for a,b in F),(label,'unknown attributes')
    if 'closures' in case:
        for x,result in case['closures'].items():assert close(x,F)==set(result),(label,x,result)
    if 'keys' in case:
        actual={''.join(sorted(k)) for k in candidate_keys(U,F)}
        assert actual=={''.join(sorted(k)) for k in case['keys']},(label,actual)
    if 'normal_form' in case:assert normal_form(U,F)==case['normal_form'],(label,normal_form(U,F))
    for field in ['minimal','equivalent']:
        if field not in case:continue
        G=case[field]
        for x in powerset(U):assert close(x,F)==close(x,G),(label,'not equivalent',x)
        if field=='minimal':
            for i,(x,y) in enumerate(G):
                assert len(y)==1,(label,'RHS not singleton')
                assert not set(y)<=close(x,G[:i]+G[i+1:]),(label,'redundant FD',x,y)
                for a in x:assert not set(y)<=close(set(x)-{a},G),(label,'redundant LHS',x,y,a)
    if 'decomposition' in case:
        parts=case['decomposition'];G=[f for R in parts for f in projected(R,F)]
        preserves=all(set(y)<=close(x,G) for x,y in F)
        assert preserves==case['preserves'],(label,'preservation',preserves)
        assert lossless(U,F,parts)==case['lossless'],(label,'lossless chase')
        assert set().union(*map(set,parts))==set(U),(label,'missing attributes')
        for R in parts:
            if case['lossless'] and case['preserves']:
                assert normal_form(R,projected(R,F)) in ['3NF','BCNF'],(label,R,'not 3NF')
        if 'witness' in case:
            rows=[dict(zip(U,row)) for row in case['witness']]
            for x,y in F:
                for a,b in itertools.combinations(rows,2):
                    if all(a[k]==b[k] for k in x):assert all(a[k]==b[k] for k in y),(label,'witness violates F')
            joined=natural_join([[{k:row[k] for k in R} for row in rows] for R in parts])
            assert any(row not in rows for row in joined),(label,'no spurious tuple')

# Independently specified answers for the source key exercises.
key_answers=[('ABCDEG',[('AB','GD'),('CE','D'),('C','A'),('DG','C'),('G','A'),('G','B')],{'EG','ABE','BCE'}),('ABCDEF',[('BC','A'),('C','DF'),('BE','C'),('D','F')],{'BE'}),('ABCDE',[('ABD','E'),('D','C'),('C','D'),('CD','E')],{'ABC','ABD'}),('ABCDEH',[('BC','E'),('D','A'),('C','A'),('AE','D'),('BE','CH')],{'BC','BE'})]
for U,F,answers in key_answers:
    assert {''.join(sorted(k)) for k in candidate_keys(U,F)}==answers,(U,'hand checked key answer')

# Both tabular-FD exercises: exhaust every row pair, not just the examples cited.
for rows,truth in [(
 [[1,1,0,1,0],[0,0,1,0,1],[1,0,1,0,0],[0,1,0,1,1],[1,1,1,1,1]],
 [('AB','DE',False),('B','D',True),('CE','BD',False),('CDE','A',True)]),(
 [[1,1,1,1,1],[1,1,1,2,1],[1,2,2,2,2],[2,1,1,1,2],[2,2,2,2,2]],
 [('AB','C',True),('AB','D',False),('B','C',True),('C','E',False),('DE','A',False)])]:
    for x,y,expected in truth:
        good=all(not all(a['ABCDE'.index(k)]==b['ABCDE'.index(k)] for k in x) or all(a['ABCDE'.index(k)]==b['ABCDE'.index(k)] for k in y) for a,b in itertools.combinations(rows,2))
        assert good==expected,(x,y,expected)

# Relational algebra edge cases: repeated enrollment, a student with no enrollment,
# a missing required course, and division by an empty set.
enroll={('S1','M1',1,8),('S1','M1',2,10),('S1','M2',1,9),('S2','M1',1,6),('S3','M2',1,7)}
students={'S1','S2','S3','S4'}
S1={s for s,m,h,d in enroll if m=='M1'};S2={s for s,m,h,d in enroll if m=='M2'}
assert S1&S2=={'S1'} and S1-S2=={'S2'} and students-S1=={'S3','S4'}
pairs={(s,m) for s,m,h,d in enroll}
def division(pairs,required,candidates):return {s for s in candidates if all((s,m) in pairs for m in required)}
assert division(pairs,{'M1','M2'},students)=={'S1'}
assert division(pairs,set(),students)==students
assert division(pairs,set(),{s for s,m in pairs})=={'S1','S2','S3'}
assert len({s for s,m,h,d in enroll if m=='M1'})==2
assert sum(d for s,m,h,d in enroll if m=='M1')/sum(m=='M1' for s,m,h,d in enroll)==8
print(f'PASS: {len(CASES)} FD/closure/key/normal-form/decomposition cases; exhaustive equivalence, lossless chase, table counterexamples and relational-algebra edge cases.')
