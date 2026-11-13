/* ---------- island hotspots (only the 3 real islands) ---------- */
const ISLE_NAMES={1:'Porto da Aurora',2:'Ilha do Ouro Perdido',3:'Ilha das Raízes Antigas',4:'Ilha da Serpente',5:'Fortaleza Congelada'};
const SPOTS={
 1:[
  [24,72,'Doca',`O navio atraca na doca de madeira, ainda úmida de orvalho. O pirata amarra os cabos com cuidado: dali em diante, cada porto será uma pista.`],
  [63,64,'Vila',`Entre telhados vermelhos e a bandeira da caveira, um velho marinheiro reconhece o símbolo do mapa. “Seu pai passou por aqui”, diz ele, “e nunca parou de falar das cinco ilhas.”`],
  [86,32,'Farol',`No alto do farol, o guardião deixou um diário aberto. As páginas traçam a rota: o vulcão, a selva, a serpente e o gelo e, só depois, o caminho de volta.`]
 ],
 2:[
  [14,66,'Naufrágio',`Os destroços são do navio do seu pai. O símbolo pintado no casco é o mesmo do mapa e, na cabine, um bilhete resiste ao sal: “Continue. A resposta está nas raízes.”`],
  [64,22,'Vulcão',`O vulcão ruge sobre ruínas cobertas de ouro esquecido. Nas pedras, gravações antigas avisam que a lava guarda o que o mar não conseguiu levar.`],
  [71,42,'Caverna do Tesouro',`Um baú brilha no coração da caverna, protegido pelo calor da lava. Dentro não há moedas, só o segundo pedaço do mapa, embrulhado em couro.`]
 ],
 3:[
  [27,68,'Rosto de Pedra',`Um totem entalhado na rocha vigia a entrada da ilha há séculos. Seus olhos vazios apontam para a cachoeira, como se soubessem aonde o pirata iria.`],
  [41,42,'Cachoeira',`Atrás da queda d'água, uma passagem estreita leva a uma câmara esquecida. Nas paredes, desenhos mostram um navio, um farol e um pirata de costas.`],
  [57,22,'Templo',`No topo da escadaria, o terceiro pedaço do mapa repousa sobre o altar, ao lado de um aviso: nem todo ouro é riqueza. Ao juntá-lo aos outros, uma nova marca surge no papel: uma serpente enrolada em uma ilha ao sul.`]
 ],
 4:[
  [26.2,79.4,'Naufrágio',`Outro navio pirata encalhado na areia, com as velas negras rasgadas. Quem veio antes do pirata também seguiu o mapa, e as cordas soltas sugerem que a tripulação fugiu às pressas.`],
  [10.4,54.0,'Caveira de Pedra',`Uma caveira enorme, abraçada por cipós, marca o território da serpente. Aos seus pés há pegadas de botas, ainda frescas, que sobem em direção às ruínas.`],
  [60.8,37.2,'Boca da Serpente',`A entrada é a boca aberta de uma serpente de pedra, com presas do tamanho de mastros. Entre tochas acesas, o quarto pedaço do mapa repousa sobre um altar. O pirata atravessa sem desviar o olhar.`]
 ],
 5:[
  [21.1,65.1,'Baú Esquecido',`Um baú aberto, cheio de moedas, jaz sob a neve. Sobre elas, um bilhete congelado: «O ouro é só isca. Siga o mapa.»`],
  [41.4,47.8,'Cabana',`Uma fogueira acesa e janelas amareladas. Lá dentro, anotações na letra do seu pai: ele passou um inverno inteiro aqui, juntando as mesmas peças que o pirata agora carrega.`],
  [62.2,38.2,'Caveira de Gelo',`A boca da caveira de gelo esconde uma caverna iluminada por tochas. No centro, a quinta e última peça. Com ela, as cinco partes se encaixam e o mapa aponta para casa.`]
 ]
};

function makeRipple(host,x,y){
  const r=document.createElement('span');
  r.className='ripple';
  r.style.left=x+'px';r.style.top=y+'px';
  host.appendChild(r);
  r.addEventListener('animationend',()=>r.remove());
}

document.querySelectorAll('.isle').forEach(div=>{
 const n=div.dataset.isle,img=div.dataset.img;
 const box=document.createElement('div');box.className='imgbox';box.style.width='100%';box.style.height='100%';
 const im=document.createElement('img');
 im.src=img;im.alt='Ilustração em pixel art: '+(div.parentElement.querySelector('h2')?.textContent||'ilha');im.loading='lazy';im.decoding='async';
 im.onerror=function(){this.classList.add('broken')};
 const fb=document.createElement('div');fb.className='img-fallback';fb.style.height='100%';fb.textContent='🏝️ imagem indisponível';
 box.appendChild(im);box.appendChild(fb);
 div.appendChild(box);
 (SPOTS[n]||[]).forEach((s,idx)=>{
   const h=document.createElement('div');h.className='hot';h.style.left=s[0]+'%';h.style.top=s[1]+'%';
   h.innerHTML=`<span>${s[2]}</span>`;h.setAttribute('role','button');h.tabIndex=0;h.setAttribute('aria-label',s[2]);h.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openModal(n,idx)}});
   h.addEventListener('click',(e)=>{
     const rect=div.getBoundingClientRect();
     makeRipple(div,e.clientX-rect.left,e.clientY-rect.top);
     openModal(n,idx);
   });
   div.appendChild(h);
 });
});

const modal=document.getElementById('modal'),mt=document.getElementById('mtitle'),mx=document.getElementById('mtext'),mk=document.getElementById('mkicker'),mc=document.getElementById('mcount'),mbody=document.getElementById('mbody'),mdots=document.getElementById('mdots'),mprev=document.getElementById('mprev'),mnext=document.getElementById('mnext');
let curIsle=1,curIdx=0,lastFocus=null;
function renderModal(){
 const list=SPOTS[curIsle],s=list[curIdx];
 mk.textContent=ISLE_NAMES[curIsle];mc.textContent=`${curIdx+1} de ${list.length}`;
 mt.textContent=s[2];mx.textContent=s[3];
 mdots.innerHTML='';
 list.forEach((_,i)=>{const b=document.createElement('button');b.className=i===curIdx?'on':'';b.setAttribute('aria-label','Ponto '+(i+1));b.onclick=()=>{curIdx=i;renderModal()};mdots.appendChild(b)});
 mprev.disabled=curIdx===0;
 mnext.textContent=curIdx===list.length-1?'Concluir':'Próximo';
 mbody.classList.remove('mfade');void mbody.offsetWidth;mbody.classList.add('mfade');
 renderPhoto();
}
const mphoto=document.getElementById('mphoto'),ASP={1:1000/833,2:1000/833,3:1000/833,4:4/3,5:4/3};let lastPhotoSrc='';
function renderPhoto(){
 const s=SPOTS[curIsle][curIdx],isle=document.querySelector('.isle[data-isle="'+curIsle+'"]'),img=isle&&isle.querySelector('img');
 if(!img||!img.src)return;
 const bw=mphoto.clientWidth,bh=mphoto.clientHeight;if(!bw||!bh)return;
 const a=ASP[curIsle],A=(isle.clientWidth&&isle.clientHeight)?isle.clientWidth/isle.clientHeight:5/3.6,px=s[0]/100,py=s[1]/100;
 let x=px,y=py;if(a<A)y=.5+(py-.5)*(a/A);else x=.5+(px-.5)*(A/a);
 const Wd=Math.max(bw,bh*a)*2.2,Hd=Wd/a,cl=(v,m)=>Math.min(Math.max(v,0),m);
 const ox=cl(x*Wd-bw/2,Wd-bw),oy=cl(y*Hd-bh/2,Hd-bh);
 if(lastPhotoSrc!==img.src){mphoto.style.backgroundImage='url("'+img.src+'")';lastPhotoSrc=img.src}
 mphoto.style.backgroundSize=Wd+'px '+Hd+'px';mphoto.style.backgroundPosition=(-ox)+'px '+(-oy)+'px';
 mphoto.setAttribute('aria-label',s[2]+' — '+ISLE_NAMES[curIsle]);
 mphoto.classList.remove('mfade');void mphoto.offsetWidth;mphoto.classList.add('mfade');
}
window.addEventListener('resize',()=>{if(modal.classList.contains('show'))renderPhoto()});
function openModal(n,i){curIsle=n;curIdx=i;lastFocus=document.activeElement;renderModal();modal.classList.add('show');mnext.focus({preventScroll:true})}
function closeModal(){modal.classList.remove('show');if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true})}
mnext.onclick=()=>{if(curIdx<SPOTS[curIsle].length-1){curIdx++;renderModal()}else closeModal()};
mprev.onclick=()=>{if(curIdx>0){curIdx--;renderModal()}};
document.getElementById('close').onclick=closeModal;
modal.onclick=e=>{if(e.target===modal)closeModal()};
document.addEventListener('keydown',e=>{
 if(!modal.classList.contains('show'))return;
 if(e.key==='Escape')closeModal();
 else if(e.key==='ArrowRight')mnext.click();
 else if(e.key==='ArrowLeft')mprev.click();
});

/* ---------- pirate route: caminho visível e o pirata caminha sobre ele ---------- */
const sections=[...document.querySelectorAll('section')],navLinks=[...document.querySelectorAll('#navlinks a')];
const routeSvg=document.getElementById('routeSvg'),routeGhost=document.getElementById('routeGhost'),routeDone=document.getElementById('routeDone'),pirate=document.getElementById('pirate');
let isleBoxes=[],boatMode=true,swapT=0,pathLen=0,tbl=[],curL=0,targetL=0,raf=null,lastDir=1,lastT=0;

function buildRoute(){
 const W=innerWidth,H=document.body.scrollHeight;
 const isles=[...document.querySelectorAll('.isle')];
 const sec=document.getElementById('intro'),hw=document.getElementById('heroWrap');
 const hx=sec.offsetLeft+hw.offsetLeft+hw.offsetWidth/2, hy=sec.offsetTop+hw.offsetTop+hw.offsetHeight-6;
 const pts=[[hx,hy]];
 isles.forEach((isle,i)=>{
   const r=isle.getBoundingClientRect(),cx=r.left+r.width/2;isleBoxes[i]=[cx,r.top+scrollY+r.height/2,r.width,r.height];
   const x=cx+(i%2?1:-1)*r.width*.32, y=r.top+scrollY+r.height*.66;
   pts.push([x,y]);
 });
 const end=document.getElementById('end').getBoundingClientRect();
 pts.push([W*.5,end.top+scrollY+Math.min(end.height*.18,130)]);
 let d=`M ${pts[0][0]} ${pts[0][1]}`;
 for(let i=1;i<pts.length;i++){
   const [x0,y0]=pts[i-1],[x1,y1]=pts[i],m=(y1-y0)/2;
   d+=` C ${x0} ${y0+m} ${x1} ${y1-m} ${x1} ${y1}`;
 }
 routeSvg.setAttribute('width',W);routeSvg.setAttribute('height',H);
 routeSvg.setAttribute('viewBox',`0 0 ${W} ${H}`);
 routeGhost.setAttribute('d',d);routeDone.setAttribute('d',d);document.getElementById('routeShade').setAttribute('d',d);
}
function initRoute(){
 buildRoute();
 pathLen=routeGhost.getTotalLength();
 tbl=[];const N=600;
 for(let i=0;i<=N;i++){const l=pathLen*i/N,p=routeGhost.getPointAtLength(l);tbl.push([l,p.y])}
 routeDone.style.strokeDasharray=`0 ${pathLen}`;
 const h=document.body.scrollHeight-innerHeight;
 curL=targetL=lengthForScroll();place(0);updateIntro();
}
function lengthForScroll(){
 if(!tbl.length)return 0;
 const ty=scrollY+innerHeight*.55;
 if(ty<=tbl[0][1])return 0;
 if(ty>=tbl[tbl.length-1][1])return pathLen;
 let lo=0,hi=tbl.length-1;
 while(hi-lo>1){const mid=(lo+hi)>>1;if(tbl[mid][1]<ty)lo=mid;else hi=mid}
 const a=tbl[lo],b=tbl[hi],t=(ty-a[1])/Math.max(.001,b[1]-a[1]);
 return a[0]+(b[0]-a[0])*t;
}
function setBoat(b){boatMode=b;pirate.classList.add('swap');clearTimeout(swapT);swapT=setTimeout(()=>{pirate.classList.toggle('boat',b);pirate.classList.remove('swap')},170)}
pirate.classList.add('boat');
function place(moveSign){
 const pt=routeGhost.getPointAtLength(curL),pt2=routeGhost.getPointAtLength(Math.min(pathLen,curL+4)),pt0=routeGhost.getPointAtLength(Math.max(0,curL-4));
 const dx=pt2.x-pt0.x;
 if(Math.abs(dx)>.3)lastDir=(moveSign<0?-1:1)*(dx<0?-1:1);
 const onIsle=isleBoxes.some(b=>(((pt.x-b[0])/(b[2]*.42))**2+((pt.y-b[1])/(b[3]*.36))**2)<(boatMode?1:1.15));
 if(onIsle===boatMode)setBoat(!onIsle);
 const w=pirate.offsetWidth,h=pirate.offsetHeight;
 pirate.style.left=(pt.x-w/2)+'px';pirate.style.top=(pt.y-h+h*.06)+'px';
 pirate.style.setProperty('--dir',lastDir);
 if(!pirate.classList.contains('arrived'))pirate.style.transform=`scaleX(${lastDir})`;
 routeDone.style.strokeDasharray=`${curL} ${pathLen}`;
}
function tick(now){
 const dt=Math.min(100,lastT?now-lastT:16);lastT=now;
 const diff=targetL-curL;
 if(Math.abs(diff)<.5){curL=targetL;place(Math.sign(diff)||1);raf=null;lastT=0;
   pirate.classList.remove('moving');pirate.classList.add('idle');return}
 curL+=diff*(matchMedia('(prefers-reduced-motion:reduce)').matches?1:1-Math.exp(-dt/110));
 place(Math.sign(diff));
 pirate.classList.remove('idle');pirate.classList.add('moving');
 raf=requestAnimationFrame(tick);
}

/* ---------- painéis laterais ---------- */
const HUD_IDS=['intro','i1','i2','i3','i4','i5','return','end'];
const HUD_PLACE={intro:['Início da jornada','Partida'],i1:['Porto da Aurora','Ilha 1 de 5'],i2:['Ilha do Ouro Perdido','Ilha 2 de 5'],i3:['Ilha das Raízes Antigas','Ilha 3 de 5'],i4:['Ilha da Serpente','Ilha 4 de 5'],i5:['Fortaleza Congelada','Ilha 5 de 5'],return:['Rumo ao porto','Volta para casa'],end:['Fim da jornada','Lenda completa']};
const hudEls=[...document.querySelectorAll('.hud,.hudm')],hudDots=[...document.querySelectorAll('#hudM i')],hudMText=document.getElementById('hudMText'),pieceLis=[...document.querySelectorAll('.pieces li')],hudCount=document.getElementById('hudCount'),hudPlace=document.getElementById('hudPlace'),hudStep=document.getElementById('hudStep'),needle=document.getElementById('needle');
function setHud(id){
 const idx=HUD_IDS.indexOf(id);if(idx<0)return;
 const n=Math.min(5,idx);
 pieceLis.forEach((li,i)=>li.classList.toggle('on',i<n));
 hudCount.textContent=n;hudDots.forEach((d,i)=>d.classList.toggle('on',i<n));hudMText.textContent=HUD_PLACE[id][0];
 hudPlace.textContent=HUD_PLACE[id][0];hudStep.textContent=HUD_PLACE[id][1];
}
const heroWrap=document.getElementById('heroWrap');
function updateIntro(){
 const t=Math.max(0,Math.min(1,scrollY/(innerHeight*.45)));
 const e0=Math.max(0,Math.min(1,scrollY/(innerHeight*.75))),e=e0*e0*(3-2*e0),rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
 heroWrap.style.opacity=Math.max(0,1-e*1.15);
 heroWrap.style.transform=rm?'none':`translate3d(0,${-e*7}vh,0) scale(${1-.38*e})`;
 const hv=document.querySelector('.heroVideo');if(hv)hv.style.borderRadius=(28+e*26)+'px';
 const hr=document.querySelector('#intro .introright');if(hr){hr.style.opacity=Math.max(0,1-e*1.4);hr.style.transform=rm?'none':`translate3d(0,${-e*60}px,0)`}
 const hb=document.getElementById('heroBg');if(hb)hb.style.opacity=1-e;
 pirate.style.opacity=t;routeSvg.style.opacity=t;
 hudEls.forEach(h=>h.style.opacity=Math.max(0,(t-.85)/.15));
 const fab=document.getElementById('arBtn');if(innerWidth<=640){fab.style.opacity=t;fab.style.pointerEvents=t>.3?'auto':'none'}else{fab.style.opacity='';fab.style.pointerEvents=''}
 needle.style.transform=`rotate(${scrollY/Math.max(1,document.body.scrollHeight-innerHeight)*720}deg)`;
}
function onScroll(){
 updateIntro();
 if(!pathLen)return;
 targetL=lengthForScroll();
 if(!raf)raf=requestAnimationFrame(tick);
}
window.addEventListener('load',()=>{initRoute();onScroll()});
window.addEventListener('resize',()=>{initRoute();onScroll()});
let scT=0;window.addEventListener('scroll',()=>{if(scT)return;scT=requestAnimationFrame(()=>{scT=0;onScroll()})},{passive:true});

/* ---------- scroll reveal + active nav + island zoom + pirate arrival ---------- */
const io=new IntersectionObserver(es=>es.forEach(e=>{
 const link=document.querySelector(`#navlinks a[href="#${e.target.id}"]`);
 if(e.isIntersecting){
   navLinks.forEach(a=>a.classList.remove('active'));if(link)link.classList.add('active');setHud(e.target.id);
   e.target.querySelectorAll('.reveal,.reveal-left,.reveal-right,.zoom-in,.fade-up').forEach(el=>el.classList.add('in'));
   const isle=e.target.querySelector('.isle');
   if(isle){
     isle.classList.add('zoom');
     pirate.classList.remove('idle');pirate.classList.add('arrived');
     setTimeout(()=>{pirate.classList.remove('arrived');pirate.classList.add('idle')},700);
   }
 } else {
   e.target.querySelector('.isle')?.classList.remove('zoom');
 }
}),{threshold:.45});
sections.forEach(s=>io.observe(s));

navLinks.forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.querySelector(a.getAttribute('href')).scrollIntoView({behavior:'smooth'})}));

(function(){
 const nav=document.getElementById('nav'),btn=document.getElementById('navbtn');
 const set=o=>{nav.classList.toggle('open',o);btn.setAttribute('aria-expanded',o);btn.setAttribute('aria-label',o?'Fechar menu':'Abrir menu')};
 btn.addEventListener('click',()=>set(!nav.classList.contains('open')));
 navLinks.forEach(a=>a.addEventListener('click',()=>set(false)));
 addEventListener('keydown',e=>{if(e.key==='Escape')set(false)});
 ['heroAr','endAr'].forEach(id=>document.getElementById(id).addEventListener('click',()=>document.getElementById('arBtn').click()));
})();
setTimeout(()=>{initRoute();onScroll()},250);document.querySelectorAll('.isle img,#heroImg').forEach(im=>im.addEventListener('load',()=>{initRoute();onScroll()}));window.addEventListener('pageshow',()=>{initRoute();onScroll()});

(function(){
 var b=document.getElementById('arBtn'),done=false;
 function load(){
  if(done)return;done=true;
  ['lazy3dA','lazy3dB'].forEach(function(id){var n=document.getElementById(id),t=document.createElement('script');t.textContent=n.textContent;document.body.appendChild(t);n.textContent=''});
 }
 function first(e){if(done)return;e.stopImmediatePropagation();load();b.removeEventListener('click',first,true);setTimeout(function(){b.click()},0)}
 b.addEventListener('click',first,true);
 ['pointerenter','touchstart','focus'].forEach(function(ev){[b,document.getElementById('heroAr'),document.getElementById('endAr')].forEach(function(el){el&&el.addEventListener(ev,load,{once:true,passive:true})})});
})();

(function(){
const c=document.getElementById('sea'),g=c.getContext('2d'),ov=document.getElementById('ar3d');
let w=0,h=0,t=0,last=0,raf=0;const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function size(){const d=1;w=innerWidth;h=innerHeight;c.width=w*d;c.height=h*d;g.setTransform(d,0,0,d,0,0);draw()}
function draw(){
 g.clearRect(0,0,w,h);
 const sp=58,off=-((scrollY*.3)%sp),rows=Math.ceil(h/sp)+2;
 g.lineWidth=2;
 for(let i=-1;i<rows;i++){
  const y0=i*sp+off,ph=i*1.7+Math.floor((scrollY*.3)/sp)*1.7,a=.035+.05*((i*7+3)%5)/4;
  g.beginPath();
  for(let x=0;x<=w+16;x+=16){const y=y0+Math.sin(x*.011+t*.7+ph)*7+Math.sin(x*.026-t*.5+ph*1.3)*3;x?g.lineTo(x,y):g.moveTo(x,y)}
  g.strokeStyle='rgba(185,232,255,'+a.toFixed(3)+')';g.stroke();
 }
}
let acc=0;
function loop(now){raf=requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000||.016);last=now;if(ov&&ov.classList.contains('show'))return;acc+=dt;if(acc<1/30)return;t+=acc;acc=0;draw()}
size();addEventListener('resize',size);
if(reduce)addEventListener('scroll',draw,{passive:true});else raf=requestAnimationFrame(loop);
})();

/* hero video: pausa fora da tela e respeita movimento reduzido */
(function(){const v=document.getElementById('heroVideo');if(!v)return;
 const rm=matchMedia('(prefers-reduced-motion: reduce)');
 const play=()=>{if(!rm.matches){const p=v.play();if(p&&p.catch)p.catch(()=>{})}};
 if(rm.matches)v.pause();
 if('IntersectionObserver' in window)new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?play():v.pause()),{threshold:.1}).observe(v);
 rm.addEventListener&&rm.addEventListener('change',()=>rm.matches?v.pause():play());
})();

(function(){
 var b=document.getElementById('gameBtn'),s=document.getElementById('lazyGame'),done=false;
 function load(){if(done)return;done=true;var t=document.createElement('script');t.textContent=s.textContent;document.body.appendChild(t);s.textContent=''}
 b.addEventListener('click',function(){load();if(window.PirateGame)window.PirateGame.open()});
 ['pointerenter','touchstart','focus'].forEach(function(ev){b.addEventListener(ev,load,{once:true,passive:true})});
 var ab=document.getElementById('arBtn'),tk=0;
 function sync(){tk=0;if(innerWidth<=640){b.style.opacity=ab.style.opacity;b.style.pointerEvents=ab.style.pointerEvents}else{b.style.opacity='';b.style.pointerEvents=''}}
 function q(){if(!tk)tk=requestAnimationFrame(sync)}
 addEventListener('scroll',q,{passive:true});addEventListener('resize',q);addEventListener('load',function(){setTimeout(sync,300)});
})();

/* Bastidores do Projeto: baús, entrada suave, menu ativo e atalhos para 3D e jogo */
(function(){
 var sec=document.getElementById('bastidores');if(!sec)return;
 sec.classList.add('js');
 var sea=sec.querySelector('.bx-sea');
 /* baús: abrir e fechar */
 sec.querySelectorAll('.bx-chest').forEach(function(b){b.addEventListener('click',function(){
  var c=b.closest('.bx-card'),o=!c.classList.contains('open');c.classList.toggle('open',o);b.setAttribute('aria-expanded',o);
 })});
 /* entrada dos elementos */
 var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.15});
 sec.querySelectorAll('.bx-r').forEach(function(el){io.observe(el)});
 /* navio e ondas só andam quando visíveis */
 if(sea)new IntersectionObserver(function(es){es.forEach(function(e){sea.classList.toggle('on',e.isIntersecting)})}).observe(sea);
 /* menu e painel lateral acompanham a seção */
 if(typeof HUD_IDS!=='undefined'&&typeof HUD_PLACE!=='undefined'){HUD_IDS.push('bastidores');HUD_PLACE.bastidores=['Bastidores do projeto','Por trás da lenda']}
 var link=document.querySelector('#navlinks a[href="#bastidores"]');
 new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;
  if(typeof navLinks!=='undefined')navLinks.forEach(function(a){a.classList.remove('active')});
  if(link)link.classList.add('active');
  if(typeof setHud==='function')setHud('bastidores');
 })},{rootMargin:'-40% 0px -40% 0px'}).observe(sec);
 /* atalhos para as partes que a seção explica */
 var a3=document.getElementById('bxAr'),g=document.getElementById('bxGame');
 if(a3)a3.addEventListener('click',function(){document.getElementById('arBtn').click()});
 if(g)g.addEventListener('click',function(){document.getElementById('gameBtn').click()});
})();

/* Bastidores: abas HTML / CSS / JavaScript */
(function(){
 var sec=document.getElementById('bastidores');if(!sec)return;
 sec.querySelectorAll('.bx-tabs').forEach(function(list){
  var tabs=[].slice.call(list.querySelectorAll('[role=tab]'));
  function show(t){tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;document.getElementById(x.getAttribute('aria-controls')).hidden=!on})}
  tabs.forEach(function(t,i){
   t.addEventListener('click',function(){show(t)});
   t.addEventListener('keydown',function(e){var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(!d)return;var n=(i+d+tabs.length)%tabs.length;e.preventDefault();show(tabs[n]);tabs[n].focus()});
  });
 });
})();
