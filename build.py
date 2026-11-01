import json
from pathlib import Path
p=Path(__file__).resolve().parent
html=(p/'template.html').read_text(encoding='utf-8')
html=html.replace('/* INLINE_STYLE */',(p/'styles.css').read_text(encoding='utf-8'))
db='\n'.join('const '+name+'='+json.dumps(json.loads((p/file).read_text()),ensure_ascii=False).replace('</','<\\/')+';' for name,file in [('DB_PROBLEMS','db-data.json'),('DB_CHAPTERS','db-chapters.json'),('DB_KNOWLEDGE','db-knowledge.json')])
html=html.replace('/* INLINE_JS */',db+'\n'+(p/'db.js').read_text()+'\n'+(p/'app.js').read_text(encoding='utf-8'))
embedded=json.dumps(json.loads((p/'data.json').read_text(encoding='utf-8')),ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
html=html.replace('/* INLINE_DATA */',embedded)
(p/'index.html').write_text(html,encoding='utf-8')
print('Built',p/'index.html',round(len(html)/1024,1),'KiB')
