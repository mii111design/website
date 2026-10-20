(()=>{
const root=document.documentElement,loader=document.querySelector('.site-loader'),image=loader?.querySelector('img');
let revealTimer;
const finish=(reveal=false)=>{clearTimeout(revealTimer);root.classList.remove('site-revealing');if(reveal&&!matchMedia('(prefers-reduced-motion:reduce)').matches){root.classList.add('site-revealing');revealTimer=setTimeout(()=>root.classList.remove('site-revealing'),900);}root.classList.remove('loading-intro','intro-playing');clearTimeout(window.miiIntroSafety);loader?.remove();};
if(root.classList.contains('loading-intro')&&image){const start=()=>{if(!image.naturalWidth){finish();return;}root.classList.add('intro-playing');setTimeout(()=>finish(true),1400);};if(image.complete)start();else{image.addEventListener('load',start,{once:true});image.addEventListener('error',()=>finish(),{once:true});}}else loader?.remove();
addEventListener('pageshow',event=>{if(event.persisted)finish();});
const titles=[...document.querySelectorAll('.section-heading h2,.section-heading h1')].filter(t=>['CONCEPT','SERVICE','FLOW','ABOUT','CONTACT','WORKS','PRICE','CONSULTATION','FAQ'].includes(t.textContent.trim()));titles.forEach(t=>t.classList.add('title-line'));
const reduced=matchMedia('(prefers-reduced-motion:reduce)');
if('IntersectionObserver' in window&&!reduced.matches){
root.classList.add('underline-motion');titles.forEach(t=>getComputedStyle(t,'::after').transform);
const pending=new Map();
const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{
const title=entry.target;if(!entry.isIntersecting){cancelAnimationFrame(pending.get(title));pending.delete(title);return;}
const waitForVisible=()=>{const heading=title.closest('.reveal');if(root.classList.contains('loading-intro')||root.classList.contains('site-revealing')||(heading&&Number(getComputedStyle(heading).opacity)<.99)){pending.set(title,requestAnimationFrame(waitForVisible));return;}
pending.set(title,requestAnimationFrame(()=>{pending.set(title,requestAnimationFrame(()=>{title.classList.add('line-visible');pending.delete(title);observer.unobserve(title);}));}));};
pending.set(title,requestAnimationFrame(waitForVisible));
});},{threshold:.08});titles.forEach(t=>observer.observe(t));
reduced.addEventListener('change',event=>{if(event.matches){root.classList.remove('underline-motion');finish();observer.disconnect();pending.forEach(id=>cancelAnimationFrame(id));pending.clear();}});
}const circles=[...document.querySelectorAll('.consultation-circles li')];
if('IntersectionObserver' in window&&!reduced.matches){root.classList.add('circle-motion');const circleObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('circle-visible');circleObserver.unobserve(entry.target);}});},{threshold:.15});circles.forEach(c=>circleObserver.observe(c));reduced.addEventListener('change',event=>{if(event.matches){root.classList.remove('circle-motion');circleObserver.disconnect();}});}
const faqButtons=[...document.querySelectorAll('.faq-item button')];
const setFaq=(button,open)=>{button.setAttribute('aria-expanded',String(open));button.querySelector('span').textContent=open?'−':'＋';const answer=document.getElementById(button.getAttribute('aria-controls'));answer.inert=!open;answer.classList.toggle('faq-open',open);};
faqButtons.forEach(button=>button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';faqButtons.forEach(other=>setFaq(other,other===button&&open));}));
const circleButtons=[...document.querySelectorAll('.circle-toggle')],switchTimers=new WeakMap();
const setCircle=(button,open)=>{clearTimeout(switchTimers.get(button));const text=button.querySelector('.circle-text');if(!button.dataset.title)button.dataset.title=text.innerHTML;button.setAttribute('aria-pressed',String(open));const next=open?document.getElementById(button.getAttribute('aria-describedby')).innerHTML:button.dataset.title;
const update=()=>{text.innerHTML=next;button.classList.remove('circle-switching');};
if(reduced.matches){update();return;}button.classList.add('circle-switching');switchTimers.set(button,setTimeout(update,175));};
const selectCircle=(button,open)=>circleButtons.forEach(other=>{const next=other===button&&open;if(other.getAttribute('aria-pressed')!==String(next))setCircle(other,next);});
circleButtons.forEach(button=>{button.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')selectCircle(button,true);});button.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse')selectCircle(button,false);});button.addEventListener('click',event=>{if(event.pointerType==='mouse'&&event.detail!==0)return;selectCircle(button,button.getAttribute('aria-pressed')!=='true');});});
const screens=[...document.querySelectorAll('.pc-screen')];let screenIndex=0,screenTimer,screenFadeTimer,screenStartFrame,screenGeneration=0;
const stopScreens=()=>{clearTimeout(screenTimer);clearTimeout(screenFadeTimer);cancelAnimationFrame(screenStartFrame);screenGeneration++;screens.forEach(frame=>[...frame.children].forEach((image,i)=>{image.classList.remove('screen-incoming');image.classList.toggle('screen-active',i===0);}));screenIndex=0;};
const startScreens=()=>{stopScreens();if(!screens.length||reduced.matches)return;const generation=screenGeneration;
const schedule=()=>{screenTimer=setTimeout(async()=>{const next=(screenIndex+1)%3;await Promise.all(screens.map(frame=>frame.children[next].decode().catch(()=>{})));if(reduced.matches||generation!==screenGeneration)return;screens.forEach(frame=>frame.children[next].classList.add('screen-incoming'));screenFadeTimer=setTimeout(()=>{screens.forEach(frame=>{[...frame.children].forEach((image,i)=>image.classList.toggle('screen-active',i===next));frame.children[next].classList.remove('screen-incoming');});screenIndex=next;schedule();},650);},2600);};
const ready=()=>{if(reduced.matches||generation!==screenGeneration)return;if(root.classList.contains('loading-intro')||root.classList.contains('site-revealing')){screenStartFrame=requestAnimationFrame(ready);return;}schedule();};ready();};
startScreens();reduced.addEventListener('change',()=>{if(reduced.matches)stopScreens();else startScreens();});
})();
