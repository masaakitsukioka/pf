const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const ROOT=document.body.dataset.root||'';
const paper={home:'#ffffff',design:'#1b1c20',illustration:'#1f5fd1',character:'#ffc21a',about:'#ffffff',contact:'#ffffff'};
const wipe=document.getElementById('wipe');
let current=document.body.dataset.world;



/* ---------- scroll-driven works: each work pins in place and its idea advances with your scroll ---------- */
const clamp=(x)=>x<0?0:x>1?1:x;
const seg=(p,a,b)=>{const t=clamp((p-a)/(b-a));return t*t*(3-2*t);};
const $=(el,q)=>el.querySelector(q);
const draw={
  sumo(el,p){
    const a=seg(p,.06,.3),b=seg(p,.38,.56),c=seg(p,.68,.88);
    const r=$(el,'.k-ryoku'),k=$(el,'.k-kaku');
    r.style.opacity=1-a;r.style.transform='translateX('+(40*a)+'%)';k.style.transform='translateX('+(50*a)+'%)';
    const lk=$(el,'.l-kanji');lk.style.opacity=1-b;lk.style.transform='scale('+(1+.15*b)+')';
    $(el,'.l-mark').style.opacity=b*(1-c);
    const ring=$(el,'.l-ring');ring.style.opacity=c;ring.style.transform='scale('+(1.06-.06*c)+')';
  },
  xxx(el,p){
    const z=seg(p,.08,.55),r=seg(p,.55,.78);
    const zm=$(el,'.zoom');zm.style.transform='translate(-50%,-50%) translate('+(.251*zm.offsetWidth*z)+'px,'+(.111*zm.offsetHeight*z)+'px) scale('+(1+3.1*z)+')';
    $(el,'.ph').style.filter='saturate('+(1-.55*r)+') brightness('+(1+.04*r)+')';
    $(el,'.red').style.opacity=r;
    const a=$(el,'.read .a'),b=$(el,'.read .b');
    a.style.opacity=seg(p,.22,.36)*(1-seg(p,.5,.62));b.style.opacity=seg(p,.66,.84);b.style.transform='translateY('+(8*(1-seg(p,.66,.84)))+'px)';
  },
  tsubaki(el,p){
    const out=t=>1-Math.pow(1-t,3);                 /* a brush starts fast and eases off: momentum */
    $(el,'.m-ji').setAttribute('opacity',seg(p,.02,.1));
    el.querySelectorAll('.m-hair path').forEach((q,i)=>{const L=q._L||(q._L=q.getTotalLength()+30);q.style.strokeDasharray=L+' '+L;const s0=.1+i*.042;q.style.strokeDashoffset=L*(1-out(clamp((p-s0)/.085)));});
    $(el,'.m-foot').setAttribute('opacity',seg(p,.8,.9));$(el,'.m-all').setAttribute('opacity',seg(p,.88,.98));
  },
  wacoal(el,p){
    /* the card opens bottom to top: the cover's lower edge lifts on its top hinge, and the pop-up inside rises from the bottom */
    const a=seg(p,.1,.55),c=$(el,'.l-closed img'),o=$(el,'.l-open img');
    c.style.transform='rotateX('+(-88*a)+'deg)';$(el,'.l-closed').style.opacity=1-seg(p,.45,.6);
    const f=seg(p,.35,.8);$(el,'.l-open').style.opacity=seg(p,.3,.42);
    o.style.clipPath='inset('+((1-f)*100).toFixed(1)+'% 0 0 0)';o.style.transform='scale('+(.97+.03*f)+')';
  },
  eraser(el,p){
    /* each eraser car drives in from the horizon; the pencil behind it is rubbed out, leaving no trace */
    const ease=t=>t*t*(3-2*t),plan=[['fl',.02,.2],['tr',.06,.42],['l',.14,.52],['mr',.24,.66],['b',.34,.88]];
    plan.forEach(([k,a,b])=>{
      const path=$(el,'.rv-'+k),L=path._L||(path._L=path.getTotalLength()),t=clamp((p-a)/(b-a)),e=ease(t),head=e*L;
      const car=$(el,'.car-'+k),rev=car?Math.max(0,head-8):head;
      path.style.strokeDasharray=L+' '+(L+80);path.style.strokeDashoffset=L-rev;path.style.opacity=rev>.5?1:0;
      if(!car)return;
      const ang=d=>{const q=path.getPointAtLength(Math.min(L,d+1)),r=path.getPointAtLength(Math.max(0,d-1));return Math.atan2(q.y-r.y,q.x-r.x)*180/Math.PI;};
      if(path._A==null)path._A=ang(L);
      const pt=path.getPointAtLength(head),s=.3+.7*e;
      car.setAttribute('transform','translate('+pt.x.toFixed(1)+','+pt.y.toFixed(1)+') rotate('+(ang(head)-path._A).toFixed(1)+') scale('+s.toFixed(3)+')');
      car.style.opacity=seg(t,0,.06);
      $(el,'.fin-'+k).setAttribute('opacity',t>=.995?1:0);
    });
  },
  misawa(el,p){
    /* each object tries on roof after roof, puzzling over what a good home is, then settles on its own */
    const mps=el.querySelectorAll('.mp'),n=mps.length;
    mps.forEach((m,i)=>{
      const a=i/n,b=(i+1)/n,vis=(i?seg(p,a-.03,a+.01):1)*(i<n-1?1-seg(p,b-.03,b+.01):1);
      m.style.opacity=vis;m.style.visibility=vis>0?'visible':'hidden';
      const q=clamp((p-a)/(b-a));$(m,'.real').style.opacity=seg(q,.74,.86);
      m.querySelectorAll('.d').forEach((d,j)=>{
        const s0=.05+j*.22,t=clamp((q-s0)/.12),tq=clamp((q-s0-.11)/.04),out=seg(q,s0+.18,s0+.215);
        d.querySelectorAll('.ln,.ln2').forEach(l=>{const L=l._L||(l._L=l.getTotalLength()+2);l.style.strokeDasharray=L+' '+L;l.style.strokeDashoffset=L*(1-t);});
        const k=$(d,'.q'),Lq=k._L||(k._L=k.getTotalLength()+2);k.style.strokeDasharray=Lq+' '+Lq;k.style.strokeDashoffset=Lq*(1-tq);
        d.style.opacity=(t>0?1:0)*(1-out);
      });
    });
  },
  isetan(el,p){
    /* the shopping-bag tartan folds down into one small square, then everyday scenes change around it */
    const k=seg(p,.03,.32),r=$(el,'.tc');
    r.setAttribute('x',218*k);r.setAttribute('y',606*k);r.setAttribute('width',536-436*k);r.setAttribute('height',720-620*k);
    $(el,'.tt').style.opacity=1-seg(p,.32,.37);
    const sc=el.querySelectorAll('.sc');[.42,.6,.78].forEach((s0,i)=>{sc[i+1].style.opacity=seg(p,s0,s0+.08);});
  },
  kasai(el,p){
    /* the logotype is written in, top to bottom, then the view drifts back to the whole poster */
    const w=seg(p,.03,.48),lg=$(el,'.logo'),X=-14+118*w;
    lg.style.webkitMaskImage=lg.style.maskImage='linear-gradient(to bottom,#000 '+X.toFixed(1)+'%,transparent '+(X+14).toFixed(1)+'%)';
    lg.style.opacity=seg(p,.01,.06);
    const z=1-seg(p,.52,.92),S=1+1.38*z,kz=$(el,'.kz'),W=kz.offsetWidth,H=kz.offsetHeight;
    kz.style.transform='translate(-50%,-50%) translate('+(-(.737-.5)*W*S*z).toFixed(1)+'px,'+(-(.298-.5)*H*S*z).toFixed(1)+'px) scale('+S.toFixed(3)+')';
  },
  toyo(el,p){
    /* a slow, close look along the ruling pen, from its worn nib to the top, then the whole page */
    const pan=seg(p,.05,.64),out=seg(p,.68,.95),fy=.68-.39*pan,z=1-out,S=1+1.7*z,tz=$(el,'.tz'),W=tz.offsetWidth,H=tz.offsetHeight;
    tz.style.transform='translate(-50%,-50%) translate('+(-(.496-.5)*W*S*z).toFixed(1)+'px,'+(-(fy-.5)*H*S*z).toFixed(1)+'px) scale('+S.toFixed(3)+')';
  },
  tosho(el,p){
    const ls=el.querySelectorAll('.layer'),f1=seg(p,.26,.4),f2=seg(p,.6,.74);
    const op=[1-f1,f1*(1-f2),f2];
    ls.forEach((l,i)=>{l.style.opacity=op[i];l.style.transform='scale('+(.97+.03*op[i])+')';});
    const i=p<.33?0:p<.67?1:2,say=$(el,'.say');
    if(say.dataset.i!==String(i)){say.dataset.i=i;say.textContent=['！','？','♡'][i];}
    say.style.opacity=Math.max(...op)>.9?1:0;
  },
  book(el,p){if(FB&&!reduce)FB.scrub(p*FB.last());},
  chat(el,p){
    const ms=[...el.querySelectorAll('.msg')],n=ms.length,feed=$(el,'.feed');
    let reach=0;
    ms.forEach((m,i)=>{
      const q=clamp(p*n-i+.15),b=seg(q,.02,.25),c=seg(q,.4,.7);
      const bu=$(m,'.bubble'),cat=$(m,'.cat');
      bu.style.opacity=b*(1-seg(q,.62,.72));bu.style.transform='scale('+(.6+.4*b)+')';
      cat.style.opacity=Math.min(1,c*4);cat.style.transform='translateY('+(-70*(1-c))+'%)';
      if(q>0)reach=Math.max(reach,m.offsetTop+m.offsetHeight*Math.min(1,q*4));
    });
    const H=el.clientHeight-22;feed.style.transform='translateY('+(-Math.max(0,reach-H))+'px)';
  }
};
const scrubs=()=>[...document.querySelectorAll('#'+current+' .scrub')];
function barH(){if(current!=='design')return 0;const b=document.querySelector('#design .bar');return b?b.offsetHeight:0;}
function layoutScrub(){
  const top0=barH();
  scrubs().forEach(sc=>{
    const pin=sc.querySelector('.pin'),run=sc.querySelector('.run');
    if(reduce){run.style.height='0px';pin.style.position='static';return;}
    const h=pin.offsetHeight,avail=innerHeight-top0;
    const top=h<=avail?top0+(avail-h)/2:innerHeight-h;
    pin.style.top=top+'px';sc.dataset.top=top;
    run.style.height=Math.round(+sc.dataset.run*innerHeight/100)+'px';
  });
}
function progress(sc){
  const pin=sc.querySelector('.pin'),run=sc.querySelector('.run');
  if(reduce||!run.offsetHeight)return 1;
  return clamp((+sc.dataset.top+pin.offsetHeight-run.getBoundingClientRect().top)/run.offsetHeight);
}
function scrubAll(){
  if(!current)return;
  scrubs().forEach(sc=>{const el=sc.querySelector('[data-seq]');if(!el)return;const p=progress(sc);
    if(sc._p===p)return;sc._p=p;draw[el.dataset.seq](el,p);});
}
/* jump the scroll so a given work sits at progress p */
function scrollToProgress(sc,p){
  const pin=sc.querySelector('.pin'),run=sc.querySelector('.run');
  const runTop=run.getBoundingClientRect().top+scrollY;
  window.scrollTo({top:runTop-(+sc.dataset.top)-pin.offsetHeight+p*run.offsetHeight,behavior:reduce?'auto':'smooth'});
}
/* staging: blocks below the first frame enter in their world's manner */
const rio=('IntersectionObserver' in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.remove('pre');rio.unobserve(e.target);}}),{threshold:.12}):null;
function arm(v){
  document.querySelectorAll('#'+v+' .rvt').forEach(t=>{[...t.children].forEach((c,i)=>c.style.transitionDelay=(i*0.05).toFixed(2)+'s');});
  if(reduce||!rio)return;
  document.querySelectorAll('#'+v+' .dw, #'+v+' .band, #'+v+' .csec, #'+v+' .rvt').forEach(el=>{
    el.classList.add('rv');
    if(el.getBoundingClientRect().top>innerHeight*.9){el.classList.add('pre');rio.observe(el);}else el.classList.remove('pre');
  });
}

/* ---------- character turnarounds ---------- */
document.querySelectorAll('[data-turn]').forEach(t=>{
  const imgs=[...t.querySelectorAll('img')];const bs=[...t.parentElement.querySelectorAll('.views button')];
  bs.forEach((b,i)=>b.addEventListener('click',()=>{imgs.forEach((im,j)=>im.classList.toggle('on',j===i));bs.forEach((x,j)=>x.setAttribute('aria-pressed',String(j===i)));}));
});

/* ---------- illustration: page takes the ground color of the painting in view ---------- */
const ill=document.getElementById('illustration');const bands=[...document.querySelectorAll('#illustration .band')];
let ticking=false;
addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{onScroll();scrubAll();});ticking=true;}},{passive:true});
let lastW=innerWidth;addEventListener('resize',()=>{if(innerWidth!==lastW){lastW=innerWidth;layoutScrub();}scrubAll();});
function onScroll(){
  ticking=false;if(current!=='illustration'||!ill)return;
  const mid=innerHeight*.55;let pick=null;
  bands.forEach(b=>{const r=b.getBoundingClientRect();if(r.top<mid&&r.bottom>mid)pick=b;});
  const bg=pick?pick.dataset.bg:'#1f5fd1',fg=pick?pick.dataset.fg:'#ffffff';
  ill.style.backgroundColor=bg;ill.style.color=fg;document.body.style.background=bg;
}


/* ---------- flip book: real spreads; the right page turns over as you scroll ---------- */
const FB=document.getElementById('flip')&&(function(){
  const pages=[{cover:ROOT+'img/yu-cover.jpg'}].concat(['yu03','yu04','yu05','yu06','yu07','yu08','yu09'].map(n=>ROOT+'img/'+n+'.jpg'));
  const n=pages.length-1;
  const L=document.getElementById('fbL'),R=document.getElementById('fbR'),base=document.getElementById('fbBase'),
        leaf=document.getElementById('fbLeaf'),front=document.getElementById('fbFront'),back=document.getElementById('fbBack'),
        prevB=document.getElementById('fbPrev'),nextB=document.getElementById('fbNext'),count=document.getElementById('fbCount');
  let key='',shown=0,started=false;
  function paint(el,p,side){
    el.classList.remove('cover','blank');el.style.backgroundImage='';el.style.backgroundSize='';el.style.backgroundPosition='';
    if(p===null||(typeof p==='object'&&side==='L')){el.classList.add('blank');return;}
    if(typeof p==='object'){el.classList.add('cover');el.style.backgroundImage='url('+p.cover+')';return;}
    el.style.backgroundImage='url('+p+')';el.style.backgroundSize='200% 100%';el.style.backgroundPosition=(side==='L'?'left':'right')+' center';
  }
  const flip=document.getElementById('flip');
  function label(k){if(k===shown&&count.textContent)return;shown=k;count.textContent=k===0?'Cover':'Spread '+k+' / '+n;prevB.disabled=k===0;nextB.disabled=k===n;
    flip.setAttribute('aria-label','Yu and the Little Train, '+(k===0?'cover':'spread '+k+' of '+n));}
  function setStatic(k){if(key!=='s'+k){key='s'+k;paint(L,pages[k],'L');paint(R,pages[k],'R');base.classList.toggle('closed',k===0);leaf.className='leaf';leaf.style.transform='';}label(k);}
  function preload(){if(started)return;started=true;pages.slice(1).forEach(u=>{const im=new Image();im.src=u;});}
  /* t runs 0..n; each spread rests, then its right page turns */
  function scrub(t){
    if(t>0)preload();
    t=Math.max(0,Math.min(n,t));let k=Math.floor(t),f=t-k;if(k===n){k=n-1;f=1;}
    let g=Math.max(0,Math.min(1,(f-.25)/.6));g=g*g*(3-2*g);
    if(g<=0){setStatic(k);return;}if(g>=1){setStatic(k+1);return;}
    if(key!=='t'+k){key='t'+k;leaf.className='leaf turning next';
      paint(front,pages[k],'R');paint(back,pages[k+1],'L');paint(R,pages[k+1],'R');
      if(k===0){base.classList.remove('closed');paint(L,null,'L');}else paint(L,pages[k],'L');}
    leaf.style.transform='rotateY('+(-180*g)+'deg)';leaf.style.setProperty('--sh',Math.sin(Math.PI*g).toFixed(3));
    label(g<.5?k:k+1);
  }
  /* buttons move the scroll, so the page and the book never disagree */
  const sc=()=>document.getElementById('flip').closest('.scrub');
  const at=k=>k<=0?0:k>=n?1:(k+.1)/n;
  /* with reduced motion there is no scroll-driven turning, so the arrows change the spread directly */
  prevB.addEventListener('click',()=>{if(reduce){setStatic(Math.max(0,shown-1));return;}scrollToProgress(sc(),at(shown-1));});
  nextB.addEventListener('click',()=>{if(reduce){preload();setStatic(Math.min(n,shown+1));return;}scrollToProgress(sc(),at(shown+1));});
  if(reduce){const how=document.getElementById('fbHow');if(how)how.textContent='Use the arrows to turn the pages.';}
  setStatic(0);
  return{scrub,last(){return n;}};
})();

/* ---------- lightbox: any piece opens large; a series scrolls, one piece per screen ---------- */
(function(){
  const lb=document.getElementById('lb');if(!lb||!lb.showModal)return;
  const old=lb.querySelector(':scope > img');if(old)old.remove();
  const track=document.createElement('div');track.className='lb-track';lb.prepend(track);
  const c=lb.querySelector('.lb-c'),P=lb.querySelector('.lb-p'),N=lb.querySelector('.lb-n');
  P.textContent='↑';N.textContent='↓';
  let set=[],i=0;
  function build(){
    track.innerHTML='';
    set.forEach((s,k)=>{const f=document.createElement('figure');f.className='lb-f';const im=document.createElement('img');
      im.alt=s.alt;im.decoding='async';if(Math.abs(k-i)>1)im.loading='lazy';im.src=s.src;f.appendChild(im);track.appendChild(f);});
    P.hidden=N.hidden=set.length<2;lb.classList.toggle('multi',set.length>1);
  }
  /* each character has its own ground; between two, the colors blend with the scroll */
  const hex=h=>[1,3,5].map(k=>parseInt(h.slice(k,k+2),16));
  function paint(){
    if(!set.length||!set.every(s=>s.bg)){track.style.background='';return;}
    const x=Math.max(0,Math.min(set.length-1,track.scrollTop/Math.max(1,track.clientHeight)));
    const a=Math.floor(x),b=Math.min(set.length-1,a+1),t=x-a,A=hex(set[a].bg),B=hex(set[b].bg);
    track.style.background='rgb('+A.map((v,k)=>Math.round(v+(B[k]-v)*t)).join(',')+')';
  }
  function count(){c.textContent=set.length>1?(i+1)+' / '+set.length:'';P.disabled=i===0;N.disabled=i===set.length-1;}
  function goTo(k,smooth){i=Math.max(0,Math.min(set.length-1,k));const f=track.children[i];
    if(f)track.scrollTo({top:f.offsetTop,behavior:smooth&&!reduce?'smooth':'auto'});count();}
  track.addEventListener('scroll',()=>{paint();const k=Math.round(track.scrollTop/Math.max(1,track.clientHeight));if(k!==i&&k<set.length){i=k;count();}},{passive:true});
  document.addEventListener('click',e=>{const b=e.target.closest('.pc');if(!b||lb.contains(b))return;
    if(b.dataset.set){set=b.dataset.set.split(';').map(x=>{const [src,alt]=x.split('|');return{src,alt,bg:b.dataset.bg};});i=0;}
    else{const sib=[...b.parentElement.querySelectorAll('.pc:not(.set)')];set=sib.map(x=>({src:x.dataset.src,alt:x.querySelector('img').alt,bg:x.dataset.bg}));i=Math.max(0,sib.indexOf(b));}
    build();lb.showModal();requestAnimationFrame(()=>{goTo(i,false);paint();});});
  P.onclick=e=>{e.stopPropagation();goTo(i-1,true);};
  N.onclick=e=>{e.stopPropagation();goTo(i+1,true);};
  lb.addEventListener('click',e=>{const t=e.target;if(t===lb||t.classList.contains('lb-x')||t.classList.contains('lb-f')||t===track)lb.close();});
  lb.addEventListener('keydown',e=>{
    if(e.key==='ArrowLeft'||e.key==='ArrowUp'||e.key==='PageUp'){e.preventDefault();goTo(i-1,true);}
    if(e.key==='ArrowRight'||e.key==='ArrowDown'||e.key==='PageDown'||e.key===' '){e.preventDefault();goTo(i+1,true);}});
  lb.addEventListener('close',()=>{track.innerHTML='';track.style.background='';});
})();

/* ---------- world switch: the frame marks where you are, slides to where you could go,
   and takes that world's shape (hairline rule / bold stroke / round pill) ---------- */
(function(){
  const navs=[...document.querySelectorAll('.switch')];
  const W=a=>a.classList.contains('s-d')?'d':a.classList.contains('s-i')?'i':'c';
  navs.forEach(nav=>{
    const ind=document.createElement('span');ind.className='sw-ind';ind.setAttribute('aria-hidden','true');nav.prepend(ind);
    const links=[...nav.querySelectorAll('a')];
    const home=()=>nav.querySelector('a[aria-current]');
    function to(a,instant){
      if(!a){ind.classList.remove('on');return;}
      if(instant){const t=ind.style.transition;ind.style.transition='none';place(a);void ind.offsetWidth;ind.style.transition=t;}else place(a);
      ind.classList.add('on');
    }
    function place(a){ind.style.left=a.offsetLeft+'px';ind.style.top=a.offsetTop+'px';ind.style.width=a.offsetWidth+'px';ind.style.height=a.offsetHeight+'px';
      const w=W(a);ind.style.borderRadius=(w==='c'?a.offsetHeight/2:w==='d'?2:0)+'px';
      ind.classList.remove('w-d','w-i','w-c');ind.classList.add('w-'+W(a));}
    links.forEach(a=>{
      if(matchMedia('(hover:hover)').matches){a.addEventListener('mouseenter',()=>to(a));a.addEventListener('focus',()=>to(a));}
      a.addEventListener('click',()=>{nav.dataset.going='1';window._swAt=Date.now();to(a);});
    });
    nav.addEventListener('mouseleave',()=>{if(!nav.dataset.going)to(home());});
    nav._enter=()=>{delete nav.dataset.going;const h=home();if(!h){ind.classList.remove('on');return;}
      to(h,true);if(!reduce){ind.classList.remove('enter');void ind.offsetWidth;ind.classList.add('enter');}};
    nav._fit=()=>{const h=home();if(h&&!nav.dataset.going)to(h,true);};
    ind.addEventListener('animationend',()=>ind.classList.remove('enter'));
  });
  /* the frame has already travelled before the page changes, so on arrival it simply sits there */
  window.switchEnter=v=>navs.forEach(n=>{if(n.closest('.view').id===v){delete n.dataset.going;n._fit();}});
  addEventListener('resize',()=>navs.forEach(n=>n._fit()));
  document.fonts&&document.fonts.ready.then(()=>navs.forEach(n=>n._fit()));
})();

/* ---------- phones: swipe sideways to move between worlds; the frame travels under your thumb ---------- */
(function(){
  const order=['design','illustration','character'],cls={design:'s-d',illustration:'s-i',character:'s-c'};
  const radius=(a)=>a.classList.contains('s-c')?a.offsetHeight/2:a.classList.contains('s-d')?2:0;
  const bw=(a)=>a.classList.contains('s-i')?2.5:a.classList.contains('s-c')?2:1;
  const lerp=(a,b,t)=>a+(b-a)*t;
  let sx=0,sy=0,mode=null,nav=null,ind=null,from=null,to=null,dir=0,t=0;
  addEventListener('touchstart',e=>{
    if(e.touches.length!==1||!order.includes(current)||document.querySelector('dialog[open]'))return;
    sx=e.touches[0].clientX;sy=e.touches[0].clientY;mode=null;if(sx<20||sx>innerWidth-20){mode='v';}
  },{passive:true});
  addEventListener('touchmove',e=>{
    if(mode==='v'||!order.includes(current))return;
    const dx=e.touches[0].clientX-sx,dy=e.touches[0].clientY-sy;
    if(!mode){if(Math.abs(dx)<14&&Math.abs(dy)<14)return;mode=Math.abs(dx)>Math.abs(dy)*1.6?'h':'v';if(mode==='v')return;
      nav=document.querySelector('#'+current+' .switch');ind=nav&&nav.querySelector('.sw-ind');from=nav&&nav.querySelector('a[aria-current]');if(!ind||!from){mode='v';return;}}
    dir=dx<0?1:-1;const i=order.indexOf(current)+dir;
    to=(i>=0&&i<order.length)?nav.querySelector('.'+cls[order[i]]):null;
    t=Math.min(1,Math.abs(dx)/(innerWidth*.45));if(!to)t=Math.min(.12,t*.25);
    const b=to||from;ind.classList.add('dragging','on');
    ind.style.left=lerp(from.offsetLeft,to?b.offsetLeft:from.offsetLeft+(dx<0?12:-12),t)+'px';
    ind.style.width=lerp(from.offsetWidth,b.offsetWidth,t)+'px';
    ind.style.borderRadius=lerp(radius(from),radius(b),t)+'px';
    ind.style.borderWidth=lerp(bw(from),bw(b),t)+'px';
  },{passive:true});
  addEventListener('touchend',()=>{
    if(mode!=='h'||!ind)return;mode=null;ind.classList.remove('dragging');ind.style.borderWidth='';
    if(to&&t>.4){nav.dataset.going='1';ind.style.left=to.offsetLeft+'px';ind.style.width=to.offsetWidth+'px';ind.style.borderRadius=radius(to)+'px';
      ind.classList.remove('w-d','w-i','w-c');ind.classList.add('w-'+cls[order[order.indexOf(current)+dir]].slice(2));
      const w=order[order.indexOf(current)+dir];setTimeout(()=>go(ROOT+w+'/',w),300);}
    else nav._fit();
  });
})();

/* ---------- moving between pages: the same wipe as before, split across two page loads ---------- */
function local(u){return location.protocol==='file:'&&/\/(#.*)?$/.test(u)?u.replace(/\/(#.*)?$/,'/index.html$1'):u;}
function go(url,w){
  url=local(url);
  if(reduce||!wipe){location.href=url;return;}
  wipe.style.background=paper[w]||'#ffffff';wipe.classList.remove('uncover','covered');void wipe.offsetWidth;wipe.classList.add('cover');
  try{sessionStorage.setItem('wipe',w);}catch(e){}
  setTimeout(()=>{location.href=url;},380);
}
document.addEventListener('click',e=>{
  const a=e.target.closest('a[data-w]');if(!a||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const w=a.dataset.w;
  if(w===current&&!a.hash){e.preventDefault();window.scrollTo({top:0,behavior:reduce?'auto':'smooth'});return;}
  e.preventDefault();
  const fromSwitch=!!a.closest('.switch');
  setTimeout(()=>go(a.href,w),fromSwitch&&!reduce?300:0);
});
if(location.protocol==='file:')document.querySelectorAll('a[href]').forEach(a=>{const h=a.getAttribute('href');if(!/^(mailto:|https?:|#)/.test(h))a.setAttribute('href',local(h));});
addEventListener('pageshow',e=>{if(e.persisted&&wipe)wipe.classList.remove('cover','covered','uncover');});

function init(){
  const v=current;
  if(v==='illustration'&&ill){ill.style.backgroundColor='#1f5fd1';ill.style.color='#fff';}
  let arrived=null;try{arrived=sessionStorage.getItem('wipe');sessionStorage.removeItem('wipe');}catch(e){}
  if(arrived&&!reduce&&wipe){wipe.style.background=paper[arrived]||'#ffffff';wipe.classList.add('covered');
    document.documentElement.removeAttribute('data-wipe');
    requestAnimationFrame(()=>requestAnimationFrame(()=>{wipe.classList.remove('covered');wipe.classList.add('uncover');}));}
  else document.documentElement.removeAttribute('data-wipe');
  const sec=document.getElementById(v);if(sec&&!reduce)sec.classList.add('entered');
  if(document.querySelector('#'+v+' .switch'))arm(v);
  layoutScrub();scrubAll();if(window.switchEnter)switchEnter(v);
  if(location.hash){const t=document.getElementById(location.hash.slice(1));if(t)setTimeout(()=>t.scrollIntoView(),60);}
  /* touch screens: the design door shows its trick once when it is in view */
  const door=document.querySelector('.d-design');
  if(door&&!matchMedia('(hover:hover)').matches&&!reduce&&'IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting&&en.intersectionRatio>.6){setTimeout(()=>door.classList.add('play'),400);io.disconnect();}}),{threshold:[.6]});io.observe(door);}
  /* contact: copy address, and turn the brief into an email */
  document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>{
    const s=b.parentElement.querySelector('.copied');
    (navigator.clipboard?navigator.clipboard.writeText(b.dataset.copy):Promise.reject()).then(()=>{s.textContent='Copied';},()=>{s.textContent='Select the address to copy it';});
    setTimeout(()=>{s.textContent='';},2400);}));
  const f=document.getElementById('brief');
  if(f)f.addEventListener('submit',e=>{
    e.preventDefault();const d=new FormData(f),g=k=>(d.get(k)||'').toString().trim();
    let err=f.querySelector('.err');
    if(!g('details')){if(!err){err=document.createElement('p');err.className='err';err.setAttribute('role','alert');f.querySelector('.btn').before(err);}err.textContent='Please tell me a little about the project.';f.details.focus();return;}
    if(err)err.remove();
    const subject=g('service')+' inquiry'+(g('name')?' from '+g('name'):'');
    const body=['Hello Masaaki,','',g('details'),'','Service: '+g('service'),'Deadline: '+(g('deadline')||'-'),'Budget (USD): '+(g('budget')||'-'),'References: '+(g('refs')||'-'),'',g('name')].join('\n');
    location.href='mailto:betterbydesign@icloud.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
}
init();
