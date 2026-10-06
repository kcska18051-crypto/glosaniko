const artHeader = document.querySelector('.header');
const artReduce = matchMedia('(prefers-reduced-motion: reduce)');
const artTrack = document.createElement('div');
artTrack.className = 'page-progress';
artTrack.setAttribute('aria-hidden','true');
artTrack.innerHTML = '<span></span>';
artHeader.append(artTrack);
let artFrame = false;
let artTravel = 1;
let artCompact;
function measureArtPage(){artTravel=Math.max(1,document.documentElement.scrollHeight-innerHeight);scheduleArtHeader();}
function updateArtHeader(){
 artFrame=false;
 const compact=scrollY>70;
 if(compact!==artCompact){artHeader.classList.toggle('is-scrolled',compact);artCompact=compact;}
 artTrack.firstElementChild.style.transform=`scaleX(${Math.min(1,Math.max(0,scrollY/artTravel))})`;
}
function scheduleArtHeader(){if(!artFrame){artFrame=true;requestAnimationFrame(updateArtHeader);}}
addEventListener('scroll',scheduleArtHeader,{passive:true});
addEventListener('resize',measureArtPage);
if('ResizeObserver' in window)new ResizeObserver(measureArtPage).observe(document.querySelector('main'));
if(!artReduce.matches && 'IntersectionObserver' in window){
 document.body.classList.add('motion-ready');
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.06});
 document.querySelectorAll('main section:not(:first-child) h2,.product-card,.shade-placeholder,.brand-values-grid article,.related-card,.markets>div,.brand-photo-placeholder,.guide-step details,.tech-placeholders>div').forEach((element,index)=>{
  element.classList.add('site-reveal');element.style.setProperty('--reveal-delay',`${index%3*60}ms`);observer.observe(element);
 });
}
artReduce.addEventListener('change',()=>{if(artReduce.matches)document.body.classList.remove('motion-ready');});
measureArtPage();
