"""Build shade pages from the approved detail layout and client palette."""
import json
import re
from pathlib import Path
from html import escape

ROOT = Path(__file__).resolve().parents[1]
colors = json.loads((ROOT / 'data/colors.json').read_text(encoding='utf-8'))
template = (ROOT / 'colors/eggplant-107/index.html').read_text(encoding='utf-8')
catalog_path = ROOT / 'colors/index.html'
catalog = catalog_path.read_text(encoding='utf-8')
home_path = ROOT / 'index.html'
home = home_path.read_text(encoding='utf-8')
for color in colors:
    slug = 'eggplant-107' if color['id'] == 'base-001' else color['id']
    color['path'] = f'colors/{slug}/'
    label = escape(' '.join(filter(None, [color['name'], color['code']])))
    if color['id'] != 'base-001':
        page = template.replace('Баклажановый 107', label)
        page = page.replace('Баклажановый<br>107', label)
        page = page.replace('<dd>Баклажановый</dd>', f'<dd>{escape(color["name"])}</dd>')
        page = page.replace('<div><dt>Код</dt><dd>107</dd></div>', f'<div><dt>Код</dt><dd>{escape(color["code"])}</dd></div>' if color['code'] else '')
        page = re.sub(r'<div><dt>(Артикул|Штрихкод)</dt><dd>.*?</dd></div>', '', page)
        if color.get('sku'):
            page = page.replace('<dt>Материал</dt>', f'<dt>Артикул</dt><dd>{escape(color["sku"])}</dd></div><div><dt>Материал</dt>')
        page = page.replace('<img src="../../assets/color-example.png" alt="Клиентский слайд оттенка '+label+'">', f'<div class="detail-shade" style="--shade:{color["hex"]}" role="img" aria-label="Образец оттенка {label}"></div>')
        page = page.replace('Изображение предоставлено клиентом. ', '')
        page = page.replace('</head>', '<link rel="stylesheet" href="../../assets/color-details.css?v=1"></head>')
        folder = ROOT / color['path']
        folder.mkdir(parents=True, exist_ok=True)
        (folder / 'index.html').write_text(page, encoding='utf-8')
    pattern = r'<(?:article|a) class="shade-card" id="shade-'+re.escape(color['id'])+r'"[^>]*>(.*?)</(?:article|a)>'
    def link_card(match):
        content = re.sub(r'<a\b[^>]*>.*?</a>', '', match[1])
        return f'<a class="shade-card" id="shade-{color["id"]}" href="./{slug}/" aria-label="Эмаль Glosaniko — {label}">{content}</a>'
    catalog = re.sub(pattern, link_card, catalog, flags=re.S)
    home = home.replace(f'./colors/#shade-{color["id"]}', f'./{color["path"]}')
if '../assets/color-details.css?v=1' not in catalog:
    catalog = catalog.replace('</head>', '<link rel="stylesheet" href="../assets/color-details.css?v=1"></head>')
catalog_path.write_text(catalog, encoding='utf-8')
home_path.write_text(home, encoding='utf-8')
(ROOT / 'data/colors.json').write_text(json.dumps(colors, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
print(f'Built {len(colors)} linked shade pages')
