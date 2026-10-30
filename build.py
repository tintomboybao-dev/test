from pathlib import Path
import json
root=Path(__file__).parent
html=(root/'template.html').read_text('utf-8')
styles=(root/'styles.css').read_text('utf-8')
script=(root/'app.js').read_text('utf-8')
data=json.loads((root/'data.json').read_text('utf-8'))
assert len(data['P'])==19 and len(data['TOPICS'])==8 and len(data['QA'])==19
assert [p['id'] for p in data['P']]==list(range(1,20))
for item in data['P']:
 assert item.get('steps') and item.get('answer') and item.get('check') and item.get('recognize')
json_text=json.dumps(data,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')
html=html.replace('/*CSS_INLINE*/',styles).replace('/*DATA_INLINE*/',json_text).replace('/*JS_INLINE*/',script)
output=root/'index.html'
output.write_text(html,'utf-8')
print(f'Built {output} ({output.stat().st_size:,} bytes)')
