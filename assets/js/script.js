/* ═══ LOADER ═══ */
// Build checkerboard
const lf = document.getElementById('loaderFlag');
for(let i=0;i<16;i++){const c=document.createElement('div');c.style.cssText=`width:22px;height:22px;background:${(Math.floor(i/4)+i)%2===0?'#fff':'#111'}`;lf.appendChild(c);}

const loaderTxt = document.getElementById('loaderTxt');
let lp = 0;
const li = setInterval(()=>{
  lp = Math.min(lp + Math.random()*14, 99);
  loaderTxt.textContent = `${Math.floor(lp)}% Yükleniyor...`;
}, 120);
window.addEventListener('load',()=>{
  clearInterval(li);
  loaderTxt.textContent = '100% Hazır';
  setTimeout(()=>document.getElementById('loader').classList.add('out'), 1900);
});

// Build success flag
const sf = document.getElementById('successFlag');
for(let i=0;i<18;i++){const c=document.createElement('div');c.className='sf-cell';sf.appendChild(c);}

/* ═══ SPEED LINES ═══ */
const sl = document.getElementById('speedLines');
for(let i=0;i<8;i++){
  const line = document.createElement('div');
  line.className = 'speed-line';
  const top = 20 + Math.random() * 60;
  const delay = Math.random() * 5;
  const dur = 2 + Math.random() * 3;
  const width = 80 + Math.random() * 200;
  line.style.cssText = `top:${top}%;width:${width}px;animation-delay:${delay}s;animation-duration:${dur}s;left:${Math.random()*40}%`;
  sl.appendChild(line);
}

/* ═══ THEME ═══ */
const themeBtn = document.getElementById('themeBtn');
const themeInd = document.getElementById('themeInd');
themeBtn.addEventListener('click',()=>{
  const html = document.documentElement;
  const isDark = html.dataset.theme === 'dark';
  html.dataset.theme = isDark ? 'light' : 'dark';
  themeInd.textContent = isDark ? 'LIGHT' : 'DARK';
  toast(isDark ? '☀️ Açık tema aktif' : '🌑 Koyu tema aktif', isDark ? '☀️' : '🌑');
});

/* ═══ CURSOR ═══ */
const cur = document.getElementById('cursor');
const cross = document.getElementById('cursorCross');
let mx=0,my=0,cx=0,cy=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
});
document.addEventListener('mousedown',()=>cur.style.transform='translate(-50%,-50%) scale(0.4)');
document.addEventListener('mouseup',()=>cur.style.transform='translate(-50%,-50%) scale(1)');
(function loop(){
  cx+=(mx-cx)*.12; cy+=(my-cy)*.12;
  cross.style.left=cx+'px'; cross.style.top=cy+'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a,button,.car-card,.extra,.ftab,.city-card,.t-card,.theme-btn,.cmp-nav-btn').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cur.classList.add('hover');cross.classList.add('hover');});
  el.addEventListener('mouseleave',()=>{cur.classList.remove('hover');cross.classList.remove('hover');});
});

/* ═══ SCROLL ═══ */
window.addEventListener('scroll',()=>{
  const sy = scrollY;
  document.getElementById('navbar').classList.toggle('scrolled', sy > 50);
  document.getElementById('btt').classList.toggle('show', sy > 400);
  const pct = sy / (document.documentElement.scrollHeight - innerHeight) * 100;
  document.getElementById('prog-fill').style.width = pct + '%';
});

/* ═══ SMOOTH ═══ */
function smoothTo(id){ document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); }

/* ═══ COUNTER ═══ */
function animCount(el){
  const t=+el.dataset.count, dur=2000; let s=null;
  (function step(ts){
    if(!s) s=ts;
    const p = Math.min((ts-s)/dur,1);
    const e = p<.5?2*p*p:-1+(4-2*p)*p;
    el.textContent = Math.floor(e*t);
    if(p<1) requestAnimationFrame(step); else el.textContent=t;
  })(performance.now());
}

/* ═══ INTERSECTION ═══ */
const io = new IntersectionObserver(ents=>{
  ents.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('vis');
      if(e.target.dataset.count) animCount(e.target);
    }
  });
},{threshold:.1});
document.querySelectorAll('.rev,.car-card,.feat-row,[data-count]').forEach(el=>io.observe(el));
document.querySelectorAll('.car-card').forEach((c,i)=>c.style.transitionDelay=(i*.07)+'s');
document.querySelectorAll('.feat-row').forEach((c,i)=>c.style.transitionDelay=(i*.1)+'s');

/* ═══ FILTER ═══ */
function filterCars(cat,btn){
  document.querySelectorAll('.ftab').forEach(t=>t.classList.remove('on'));
  btn.classList.add('on');
  document.querySelectorAll('.car-card').forEach((card,i)=>{
    const show = cat==='all' || card.dataset.cat===cat;
    if(show){
      card.style.display='';
      card.style.transitionDelay=(i*.05)+'s';
      requestAnimationFrame(()=>{card.style.opacity='1';card.style.transform='translateY(0)';});
    } else {
      card.style.opacity='0'; card.style.transform='translateY(20px)';
      setTimeout(()=>card.style.display='none', 280);
    }
  });
}

/* ═══ SEARCH ═══ */
function doSearch(){
  const f=document.getElementById('sFrom').value, t=document.getElementById('sTo').value;
  if(!f||!t){toast('Lütfen tarih seçin','📅');return;}
  if(new Date(t)<=new Date(f)){toast('İade tarihi teslimden sonra olmalı','⚠️');return;}
  toast('Araçlar listeleniyor...','🔍'); smoothTo('cars');
}

/* ═══ COMPARE ═══ */
let cmpList = [];
function toggleCmp(btn){
  const card = btn.closest('.car-card');
  const name = card.dataset.name;
  const idx = cmpList.findIndex(c=>c.name===name);
  if(idx>-1){
    cmpList.splice(idx,1);
    btn.classList.remove('active'); btn.textContent='⊕';
    toast(name+' çıkarıldı','✕');
  } else {
    if(cmpList.length>=3){toast('Maks. 3 araç karşılaştırılabilir','⚠️');return;}
    cmpList.push({
      name:card.dataset.name, make:card.dataset.make,
      price:card.dataset.price, trans:card.dataset.trans,
      fuel:card.dataset.fuel, seats:card.dataset.seats,
      power:card.dataset.power,
      img:card.querySelector('.car-photo img').src,
    });
    btn.classList.add('active'); btn.textContent='✓';
    toast(name+' eklendi','⊕');
  }
  updateCmpBar();
}
function updateCmpBar(){
  const bar=document.getElementById('cmpBar');
  const nb=document.getElementById('cmpNavBtn');
  const nc=document.getElementById('cmpCount');
  const n=cmpList.length;
  bar.classList.toggle('show',n>0);
  nb.classList.toggle('show',n>0);
  nc.textContent=n;
  for(let i=0;i<3;i++){
    const s=document.getElementById('cslot'+i);
    if(cmpList[i]){
      s.className='cmp-slot filled';
      s.innerHTML=`<button class="cmp-slot-x" onclick="removeCmp(${i})">×</button>${cmpList[i].name}`;
    } else {
      s.className='cmp-slot'; s.textContent='Araç '+(i+1);
    }
  }
}
function removeCmp(idx){
  const name=cmpList[idx].name;
  document.querySelectorAll('.car-card').forEach(c=>{
    if(c.dataset.name===name){
      const b=c.querySelector('.car-cmp-btn');
      b.classList.remove('active'); b.textContent='⊕';
    }
  });
  cmpList.splice(idx,1); updateCmpBar();
}
function clearCmp(){
  cmpList=[];
  document.querySelectorAll('.car-cmp-btn').forEach(b=>{b.classList.remove('active');b.textContent='⊕';});
  updateCmpBar();
}
function openCmpModal(){
  if(cmpList.length<2){toast('En az 2 araç seçin','⚠️');return;}
  const prices=cmpList.map(c=>+c.price);
  const minPrice=Math.min(...prices);
  const rows=[['Kategori/Tür','cat'],['Vites','trans'],['Yakıt','fuel'],['Koltuk','seats'],['Motor Gücü','power'],['Günlük Fiyat','price']];
  let html='<thead><tr><th style="width:130px;background:var(--bg2);"></th>';
  cmpList.forEach(c=>{
    html+=`<th><img src="${c.img}" class="cmp-car-img" alt="${c.name}"><div style="font-family:Barlow Condensed,sans-serif;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--red);margin-bottom:3px;">${c.make}</div><div>${c.name}</div></th>`;
  });
  html+='</tr></thead><tbody>';
  rows.forEach(([label,key])=>{
    html+=`<tr><td class="row-label">${label}</td>`;
    cmpList.forEach(c=>{
      let v = c[key]||'—', cls='';
      if(key==='price'){
        cls = +c.price===minPrice ? 'win' : '';
        v = `<div class="cmp-price-big">₺${Number(c.price).toLocaleString('tr-TR')}</div><div style="font-size:10px;color:var(--text-muted);">/gün</div>`;
      }
      html+=`<td class="${cls}">${v}</td>`;
    });
    html+='</tr>';
  });
  html+='</tbody>';
  document.getElementById('cmpTable').innerHTML=html;
  document.getElementById('cmpModalBg').classList.add('open');
}
function closeCmpModal(){document.getElementById('cmpModalBg').classList.remove('open');}
function cmpModalOut(e){if(e.target===document.getElementById('cmpModalBg'))closeCmpModal();}

/* ═══ MODELS ═══ */
const modelsData={
  ekonomi:[{name:'Toyota Corolla',price:850},{name:'Volkswagen Polo',price:650},{name:'Honda Civic',price:780}],
  suv:[{name:'Toyota RAV4',price:1250},{name:'Ford Explorer',price:1800},{name:'Jeep Wrangler',price:2100}],
  luks:[{name:'Mercedes E-Class',price:2900},{name:'BMW 5 Serisi',price:3500},{name:'Audi A6',price:3200}],
  elektrik:[{name:'Tesla Model 3',price:2200},{name:'Tesla Model Y',price:2600}]
};
function updateModels(){
  const cat=document.getElementById('f-cat').value;
  document.getElementById('f-model').innerHTML=modelsData[cat].map(m=>`<option value="${m.price}">${m.name} — ₺${m.price.toLocaleString('tr-TR')}/gün</option>`).join('');
  updateLivePrice();
}
function updateLivePrice(){
  const daily=+document.getElementById('f-model').value||850;
  const pu=document.getElementById('f-pu').value, re=document.getElementById('f-re').value;
  const days=(pu&&re&&new Date(re)>new Date(pu))?Math.round((new Date(re)-new Date(pu))/86400000):3;
  const total=daily*days;
  document.getElementById('lpDays').textContent=`${days} gün × ₺${daily.toLocaleString('tr-TR')}`;
  document.getElementById('lpAmount').textContent=`₺${total.toLocaleString('tr-TR')}`;
  const lp=document.getElementById('livePrice');
  lp.classList.add('flash'); setTimeout(()=>lp.classList.remove('flash'),500);
}
updateModels();

/* ═══ EXTRAS ═══ */
function toggleExtra(el){
  el.classList.toggle('on');
  const tot=[...document.querySelectorAll('.extra.on')].reduce((s,e)=>s+(+e.dataset.price||0),0);
  document.getElementById('extras-total').textContent='₺'+tot.toLocaleString('tr-TR');
}

/* ═══ MULTI-STEP ═══ */
let curStep=1;
function goStep(n){
  if(n>curStep&&!validateStep(curStep)) return;
  const map={1:'fp1',2:'fp2',3:'fp3',4:'fp4'};
  if(map[curStep]) document.getElementById(map[curStep]).classList.remove('on');
  curStep=n;
  if(map[curStep]) document.getElementById(map[curStep]).classList.add('on');
  updateProg();
  if(n===4) calcSum();
  smoothTo('booking');
}
function validateStep(s){
  let ok=true;
  if(s===1){
    [['fg-fn','f-fn',v=>v.trim().length>1],['fg-ln','f-ln',v=>v.trim().length>1],
     ['fg-em','f-em',v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)],['fg-ph','f-ph',v=>v.trim().length>6]]
    .forEach(([g,f,t])=>{
      const fg=document.getElementById(g), fv=document.getElementById(f).value;
      if(!t(fv)){fg.classList.add('err');ok=false;}else fg.classList.remove('err');
    });
  }
  if(s===2){
    const p=document.getElementById('f-pu').value, r=document.getElementById('f-re').value;
    const fp=document.getElementById('fg-pu'), fr=document.getElementById('fg-re');
    fp.classList.remove('err'); fr.classList.remove('err');
    if(!p){fp.classList.add('err');ok=false;}
    if(!r||new Date(r)<=new Date(p)){fr.classList.add('err');ok=false;}
  }
  if(!ok) toast('İşaretli alanları düzeltin','⚠️');
  return ok;
}
function updateProg(){
  for(let i=1;i<=4;i++){
    const pi=document.getElementById('pi'+i);
    pi.classList.remove('cur','done');
    const pc=pi.querySelector('.prog-circle');
    if(i<curStep){pi.classList.add('done');pc.textContent='✓';}
    else if(i===curStep){pi.classList.add('cur');pc.textContent=i;}
    else pc.textContent=i;
  }
}
function calcSum(){
  const ms=document.getElementById('f-model');
  const daily=+ms.value||850;
  const modelName=ms.options[ms.selectedIndex]?.text.split('—')[0].trim()||'Seçili Araç';
  const pu=document.getElementById('f-pu').value, re=document.getElementById('f-re').value;
  const days=(pu&&re)?Math.max(1,Math.round((new Date(re)-new Date(pu))/86400000)):3;
  const extras=[...document.querySelectorAll('.extra.on')].reduce((s,e)=>s+(+e.dataset.price||0),0);
  const base=daily*days, tax=Math.round((base+extras)*0.2), total=base+extras+tax;
  document.getElementById('sum-car').textContent=modelName;
  document.getElementById('sum-days').textContent=days+' Gün';
  document.getElementById('sum-daily').textContent='₺'+daily.toLocaleString('tr-TR');
  document.getElementById('sum-extras').textContent='₺'+extras.toLocaleString('tr-TR');
  document.getElementById('sum-tax').textContent='₺'+tax.toLocaleString('tr-TR');
  document.getElementById('sum-total').textContent='₺'+total.toLocaleString('tr-TR');
}
function submitForm(){
  const cn=document.getElementById('f-ccn').value.replace(/\s/g,'');
  const fg=document.getElementById('fg-ccn'); fg.classList.remove('err');
  if(cn.length<16){fg.classList.add('err');toast('Geçerli kart numarası girin','⚠️');return;}
  ['fp4'].forEach(id=>document.getElementById(id).classList.remove('on'));
  document.getElementById('fp-ok').classList.add('on');
  document.getElementById('res-code').textContent='VLX-'+new Date().getFullYear()+'-'+Math.floor(Math.random()*9999).toString().padStart(4,'0');
  curStep=5; updateProg(); smoothTo('booking');
  toast('🏁 Rezervasyon onaylandı!','✓');
}
function resetForm(){
  document.getElementById('fp-ok').classList.remove('on');
  document.getElementById('fp1').classList.add('on');
  curStep=1; updateProg(); smoothTo('booking');
}

/* ═══ CARD FORMAT ═══ */
function fmtCard(inp){
  let v=inp.value.replace(/\D/g,'').slice(0,16);
  v=v.replace(/(.{4})/g,'$1 ').trim(); inp.value=v;
  document.getElementById('cc-num-d').textContent=v||'•••• •••• •••• ••••';
}
function fmtExp(inp){
  let v=inp.value.replace(/\D/g,'').slice(0,4);
  if(v.length>=2) v=v.slice(0,2)+'/'+v.slice(2);
  inp.value=v;
  document.getElementById('cc-exp-d').textContent=v||'MM/YY';
}

/* ═══ CAR MODAL ═══ */
function openCarModal(btn){
  const c=btn.closest('.car-card');
  document.getElementById('m-img').src=c.querySelector('.car-photo img').src;
  document.getElementById('m-make').textContent=c.dataset.make||'';
  document.getElementById('m-model').textContent=c.dataset.name||'';
  document.getElementById('m-price').textContent='₺'+Number(c.dataset.price).toLocaleString('tr-TR');
  document.getElementById('carModalBg').classList.add('open');
}
function closeCarModal(){document.getElementById('carModalBg').classList.remove('open');}
function carModalOut(e){if(e.target===document.getElementById('carModalBg'))closeCarModal();}
function goToBooking(){closeCarModal();smoothTo('booking');}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCarModal();closeCmpModal();}});

/* ═══ TOAST ═══ */
let tt;
function toast(msg,ico='✓'){
  clearTimeout(tt);
  document.getElementById('t-msg').textContent=msg;
  document.getElementById('t-ico').textContent=ico;
  const el=document.getElementById('toast');
  const prog=document.getElementById('t-prog');
  el.classList.remove('show');
  void el.offsetWidth;
  prog.style.animation='none'; void prog.offsetWidth;
  prog.style.animation='toastP 3.5s linear forwards';
  el.classList.add('show');
  tt=setTimeout(()=>el.classList.remove('show'),3500);
}

/* ═══ DEFAULT DATES ═══ */
const today=new Date();
const tom=new Date(today); tom.setDate(today.getDate()+1);
const nxt=new Date(today); nxt.setDate(today.getDate()+7);
const fmt=d=>d.toISOString().split('T')[0];

/* ═══ HAMBURGER MENU ═══ */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');
if(hamburgerBtn && navLinks) {
  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}