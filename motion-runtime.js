const scene = document.querySelector('.concept-scroll');
const heroSequence = document.querySelector('.hero-sequence');
const conceptHeader = document.querySelector('.header');
const aboutSection = document.querySelector('.about');
const paletteSection = document.querySelector('.palette');
const productCards = [...document.querySelectorAll('#products .product-card')];
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const clamp = value => Math.max(0, Math.min(1, value));
const progressTrack = document.createElement('div');
progressTrack.className = 'page-progress';
progressTrack.setAttribute('aria-hidden', 'true');
progressTrack.innerHTML = '<span></span>';
conceptHeader.append(progressTrack);
const progressBar = progressTrack.firstElementChild;
const sceneBar = document.querySelector('.scene-progress span');
let framePending = false;
let geometryPending = false;
let lastSceneIndex = -1;
let lastCompact = null;
let geometry;
// Read layout only after size changes. Scroll frames only use cached positions.
function documentTop(element) {
 let top = 0;
 for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
 return top;
}
function measureGeometry() {
 geometryPending = false;
 const width = innerWidth;
 const height = innerHeight;
 geometry = {
  width, height, header: width <= 800 ? 78 : 94,
  travel: Math.max(1, document.documentElement.scrollHeight - height),
  hero: { top: documentTop(heroSequence), height: heroSequence.offsetHeight },
  scene: { top: documentTop(scene), height: scene.offsetHeight },
  about: { top: documentTop(aboutSection), height: aboutSection.offsetHeight },
  palette: { top: documentTop(paletteSection), height: paletteSection.offsetHeight },
  cards: productCards.map(card => ({ top: documentTop(card), height: card.offsetHeight }))
 };
 scheduleFrame();
}
function scheduleMeasure() {
 if (!geometryPending) { geometryPending = true; requestAnimationFrame(measureGeometry); }
}
function inView(box, y, height) { return box.top < y + height + 100 && box.top + box.height > y - 100; }
const stats = { frames: 0, maxHandlerMs: 0, totalHandlerMs: 0 };
window.glosanikoMotionStats = stats;
function updateFrame() {
 framePending = false;
 if (!geometry) return;
 const started = performance.now();
 const y = scrollY;
 const g = geometry;
 const compact = y > 70;
 if (compact !== lastCompact) { conceptHeader.classList.toggle('is-scrolled', compact); lastCompact = compact; }
 progressBar.style.transform = `scaleX(${clamp(y / g.travel)})`;
 if (!reduceMotion.matches) {
  if (inView(g.about, y, g.height)) aboutSection.style.setProperty('--ribbon-shift', `${((g.about.top - y - g.height) * .16).toFixed(1)}px`);
  g.cards.forEach((box, index) => {
   if (!inView(box, y, g.height)) return;
   const p = Math.max(-1, Math.min(1, (box.top - y + box.height * .5 - g.height * .5) / g.height));
   productCards[index].style.setProperty('--jar-shift', `${(p * (g.width <= 700 ? 20 : 50)).toFixed(1)}px`);
   productCards[index].style.setProperty('--jar-turn', `${(p * (index % 2 ? -7 : 7)).toFixed(2)}deg`);
  });
  if (inView(g.palette, y, g.height)) paletteSection.style.setProperty('--palette-shift', `${Math.max(-60, Math.min(60, (g.palette.top - y - g.height * .5) * .1)).toFixed(1)}px`);
  if (g.width > 700 && inView(g.scene, y, g.height)) {
   const progress = clamp((y + g.header - g.scene.top) / Math.max(1, g.scene.height - (g.height - g.header)));
   sceneBar.style.transform = `scaleX(${progress})`;
   scene.style.setProperty('--scene-progress-number', progress.toFixed(3));
   const index = Math.min(2, Math.floor(progress * 3));
   if (index !== lastSceneIndex) {
    selectComponent(index);
    componentCards.forEach((card, i) => card.classList.toggle('scene-passed', i < index));
    lastSceneIndex = index;
   }
  }
 }
 const elapsed = performance.now() - started;
 stats.frames++; stats.totalHandlerMs += elapsed; stats.maxHandlerMs = Math.max(stats.maxHandlerMs, elapsed);
}
function scheduleFrame() { if (!framePending) { framePending = true; requestAnimationFrame(updateFrame); } }
addEventListener('scroll', scheduleFrame, { passive: true });
addEventListener('resize', scheduleMeasure);
reduceMotion.addEventListener('change', () => {
 if (reduceMotion.matches) document.body.classList.remove('motion-ready');
 scheduleMeasure();
});
document.fonts?.ready.then(scheduleMeasure);
document.querySelectorAll('img').forEach(img => { if (!img.complete) img.addEventListener('load', scheduleMeasure, { once: true }); });
if ('ResizeObserver' in window) new ResizeObserver(scheduleMeasure).observe(document.querySelector('main'));
const revealTargets = [...document.querySelectorAll('.section .section-heading,.about-grid,.brand-values,.product-card,.facts article,.how-grid>div:first-child,.steps li,.review-placeholder,.markets>div,.dealer-line,.partner-grid>div,.contact-grid>div,.contact-grid form')];
if (!reduceMotion.matches && 'IntersectionObserver' in window) {
 document.body.classList.add('motion-ready');
 const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('motion-visible'); observer.unobserve(entry.target); }
 }), { threshold: .08 });
 revealTargets.forEach((element, index) => {
  element.classList.add('motion-reveal');
  element.style.setProperty('--reveal-delay', `${(index % 3) * 90}ms`);
  observer.observe(element);
 });
}
scheduleMeasure();
