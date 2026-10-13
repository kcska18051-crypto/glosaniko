import json,re
from pathlib import Path
from html import escape
root=Path.cwd(); colors=json.loads(Path('data/colors.json').read_text(encoding='utf-8')); positions=json.loads(Path('data/enamel-client-positions.json').read_text(encoding='utf-8')); template=Path('scripts/shade-product-template.html').read_text(encoding='utf-8')
norm=lambda s:re.sub(r'[^a-zа-я0-9]','',s.lower().replace('ё','е'))
matched=0;unmatched=[]
for c in colors:
 name,code=c['name'],c.get('code');label=' '.join(filter(None,[name,code])); candidates=[p for p in positions if norm(p['name'])==norm(label)]
 if not candidates and code: candidates=[p for p in positions if norm(code)==norm(p['name'])]
 if not candidates and code and code.isdigit(): candidates=[p for p in positions if re.search(r'(?<!\d)'+re.escape(code)+r'(?!\d)',p['name']) and 'матов' not in p['name'].lower()]
 if not candidates: candidates=[p for p in positions if norm(name)==norm(re.sub(r'\s+\d+$','',p['name']))]
 overrides={'extra-006':'BCPRO2072','extra-008':'BCPRO2076','extra-013':'BCPRO2067'}
 if c['id'] in overrides:candidates=[p for p in positions if p['sku']==overrides[c['id']]]
 pos=candidates[0] if len(candidates)==1 else None
 c['sku']=pos['sku'] if pos else None;c['barcode']=pos['barcode'] if pos else None
 matched+=bool(pos)
 if not pos:unmatched.append(label)
 s=template.replace('Оранжевый 295',escape(label)).replace('<h1>Оранжевый <span>295</span></h1>','<h1>'+escape(name)+(f' <span>{escape(code)}</span>' if code else '')+'</h1>').replace('<strong>Оранжевый</strong>',f'<strong>{escape(name)}</strong>').replace('<dd>Оранжевый</dd>',f'<dd>{escape(name)}</dd>').replace('Код цвета: 295','Код цвета: '+escape(code or '')).replace('<dd>295</dd>','<dd>'+escape(code or '')+'</dd>')
 if not code:s=s.replace('<span class="selected-shade-code">Код цвета: </span>','').replace('<div><dt>Код цвета</dt><dd></dd></div>','')
 if pos:s=s.replace('BCPRO2006',pos['sku']).replace('4673747343363',pos['barcode'])
 else:s=s.replace('<span class="selected-shade-code">Артикул: BCPRO2006</span>','');s=re.sub(r'<div><dt>(Артикул|Штрихкод)</dt><dd>.*?</dd></div>','',s)
 s=s.replace('<body class="shade-product-preview',f'<body style="--product-shade:{c["hex"]}" class="shade-product-preview').replace('shade-product-preview.css?v=1','shade-product-preview.css?v=2')
 if 'матов' in name.lower():s=s.replace('Образует ровное глянцевое покрытие','Образует ровное покрытие').replace('<h3>Глянцевое покрытие</h3>','<h3>Покрытие</h3>')
 (root/c['path']/'index.html').write_text(s,encoding='utf-8')
Path('data/colors.json').write_text(json.dumps(colors,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print('Generated',len(colors),'matched',matched,'unmatched IDs',[c['id'] for c in colors if not c['sku']])
