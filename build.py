import json
from pathlib import Path
p=Path(__file__).resolve().parent
html=(p/'template.html').read_text(encoding='utf-8')
html=html.replace('/* INLINE_STYLE */',(p/'styles.css').read_text(encoding='utf-8'))
html=html.replace('/* INLINE_JS */',(p/'app.js').read_text(encoding='utf-8'))
embedded=json.dumps(json.loads((p/'data.json').read_text(encoding='utf-8')),ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
html=html.replace('/* INLINE_DATA */',embedded)
(p/'index.html').write_text(html,encoding='utf-8')
print('Built',p/'index.html',round(len(html)/1024,1),'KiB')
