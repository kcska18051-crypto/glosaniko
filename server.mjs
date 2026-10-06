import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
const types = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.webp':'image/webp' };
http.createServer((req,res) => {
  let pathname; try { pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname); } catch { res.writeHead(400).end(); return; }
  const relative = pathname === '/' ? 'index.html' : /^\/concept\/?$/.test(pathname) ? 'concept.html' : /^\/about\/?$/.test(pathname) ? 'about/index.html' : /^\/how-to-paint\/?$/.test(pathname) ? 'how-to-paint/index.html' : /^\/colors\/?$/.test(pathname) ? 'colors/index.html' : /^\/products\/acrylic-enamel\/?$/.test(pathname) ? 'products/acrylic-enamel/index.html' : /^\/products\/?$/.test(pathname) ? 'products/index.html' : pathname.replace(/^\/+/, '');
  const file = path.resolve(root, relative);
  if (!file.startsWith(root + path.sep) || !['index.html','styles.css','glass.css','refinement.css','art-direction.css','product-style.css','catalog.css','colors.css','colors/index.html','guide.css','how-to-paint/index.html','about.css','about/index.html','detail.css','products/acrylic-enamel/index.html','products/index.html','app.js','visual-refresh.css','concept.html','concept.css','concept.js','concept-motion.css','motion-runtime.js','site-art.css','site-art.js','motion-performance.css','homepage-previous.html'].includes(relative) && !relative.startsWith('assets/')) { res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'}).end('Страница пока не создана. Вернитесь на главную.'); return; }
  fs.stat(file,(err, stat) => { if(err || !stat.isFile()){ res.writeHead(404).end('Not found'); return; } res.writeHead(200,{'Content-Type':types[path.extname(file)] || 'application/octet-stream','Cache-Control':'no-cache'}); fs.createReadStream(file).pipe(res); });
}).listen(4187,'127.0.0.1',()=>console.log('Glosaniko local preview: http://127.0.0.1:4187'));
