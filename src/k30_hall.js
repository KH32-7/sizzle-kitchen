
/* ---------- 1.4 hall: guests sit at a table, order, eat what you cooked, pay and leave ---------- */
// tables on the hall art (screen coords under the top bar): centre, far edge of the top, the two chairs behind it, figure size
const TROW=[{y:385,edge:350,sz:142},{y:630,edge:578,sz:172}];
const TSPOT=[{x:800,r:0,seats:[754,854]},{x:800,r:1,seats:[746,869]},{x:437,r:0,seats:[412,509]},{x:1172,r:0,seats:[1106,1207]},{x:337,r:1,seats:[307,426]},{x:1266,r:1,seats:[1188,1309]}];
const TBL=TSPOT.map(t=>Object.assign({},t,TROW[t.r]));
const EAT_T=16,DIRTY_AUTO=45;
function newHall(){return TBL.map((p,i)=>({i,state:'free',oid:null,cust:null,comp:null,t0:0,dish:null,sc:0,mood:'h'}));}
const hallOn=()=>G&&G.started&&G.mode==='career'&&G.hall;
const activeTables=()=>G.hall.slice(0,seats());
const freeTable=()=>hallOn()?activeTables().find(t=>t.state==='free'):true;
function pickCompanion(o){if(o.critic)return null;const g=GUEST[o.cust],p=g&&g.reg?.4:.65;if(Math.random()>p)return null;const used=new Set(G.hall.flatMap(t=>[t.cust,t.comp]));const c=GEN.filter(k=>k!==o.cust&&!used.has(k));return c.length?pick(c):null;}
function hallSeat(o){if(!hallOn())return;const t=activeTables().find(t=>t.state==='free');if(!t)return;const used=new Set(G.hall.flatMap(q=>[q.cust,q.comp]).filter(Boolean));if(used.has(o.cust)&&GUEST[o.cust]&&!GUEST[o.cust].reg&&!o.critic){const c=GEN.filter(k=>!used.has(k));if(c.length){o.cust=pick(c);o.name=GUEST[o.cust].n;}}Object.assign(t,{state:'wait',oid:o.id,cust:o.cust,comp:pickCompanion(o),t0:G.t,dish:o.rid});o.table=t.i+1;hallDirty=true;}
let hallDirty=true;
/* no free (clean) table → nobody new walks in */
spawnOrder=(orig=>function(){if(G.mode==='career'&&G.hall&&!freeTable())return;orig();})(spawnOrder);
assignGuest=(orig=>function(o){orig(o);hallSeat(o);})(assignGuest);
/* serving hands the dish to the table */
serve=(orig=>function(){const o=selOrder();orig();if(!hallOn()||!o||G.orders.includes(o))return;const t=G.hall.find(t=>t.oid===o.id);if(!t)return;
  const P=G.lastServe,sc=P&&P.o===o?P.res.total:70;Object.assign(t,{state:'eat',t0:G.t,sc,mood:scoreK(sc),pay:P?P.pay+P.tip:0});hallDirty=true;hallBadge();})(serve);
function hallTick(dt){if(!hallOn())return;for(const t of G.hall){
    if(t.state==='wait'&&!G.orders.some(o=>o.id===t.oid)){t.state='leave';t.t0=G.t;t.mood='a';hallDirty=true;}
    else if(t.state==='eat'&&G.t-t.t0>EAT_T){t.state='pay';t.t0=G.t;hallDirty=true;if(SCR.cur==='hall'){floatHall(t,'💰 계산 완료','#ffd07a');AU.cash&&AU.cash();}}
    else if(t.state==='pay'&&G.t-t.t0>1.8){t.state='dirty';t.t0=G.t;t.cust=t.comp=null;hallDirty=true;hallBadge();}
    else if(t.state==='leave'&&G.t-t.t0>1.6){t.state='free';t.oid=t.cust=t.comp=null;hallDirty=true;}
    else if(t.state==='dirty'&&G.t-t.t0>(hallAuto()?4:DIRTY_AUTO))clearTable(t,true);}
  G._hr=(G._hr||0)+dt;if(hallDirty||(SCR.cur==='hall'&&G._hr>.2)){G._hr=0;renderHall();}}
const hallAuto=()=>typeof staffOn==='function'&&staffOn('hall');
function clearTable(t,auto){if(t.state!=='dirty')return;Object.assign(t,{state:'free',oid:null,cust:null,comp:null,dish:null});hallDirty=true;
  if(!auto){AU.place&&AU.place();const lucky=Math.random()<.3;if(lucky){SAVE.money+=300;G.day&&(G.day.tips+=300);}floatHall(t,lucky?'+300원 · 놓고 간 팁':'반짝!',lucky?'#9fe0a0':'#fff3cf');}
  hallBadge();}
gameTick=(orig=>function(dt){orig(dt);hallTick(dt);})(gameTick);
startCareer=(orig=>function(){orig();G.hall=newHall();for(const o of G.orders)hallSeat(o);hallDirty=true;})(startCareer);
/* sitting figure: frameless portrait whose lower body disappears behind the tabletop */
const DISHC={};function dishImg(id,cb){if(DISHC[id])return DISHC[id];const src=RIMG[id];if(!src)return'';const im=new Image();im.onload=()=>{const c=mk(240,150),g=c.getContext('2d');g.save();g.beginPath();g.ellipse(120,78,110,62,0,0,TAU);g.clip();g.drawImage(im,120-im.width*.36,78-im.height*.36*.58,im.width*.72,im.height*.72*.58);g.restore();
  g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=2;g.beginPath();g.ellipse(120,78,108,60,0,0,TAU);g.stroke();DISHC[id]=c.toDataURL();hallDirty=true;cb&&cb();};im.src=src;return'';}
const seatImg=(id,m)=>{const g=GUEST[id];if(!g)return'';return aiOn()?GIMG[g.img]:AVA2[g.img+(m||'h')];};
/* ---- drawing (DOM) ---- */
function hallRoot(){const d=screenEl('hall','hall');if(!d.dataset.built){d.dataset.built=1;
  d.innerHTML=`<div class="hl-bg"></div><div class="hl-tables"></div><div class="hl-bar"><div class="hl-stat" id="hlStat"></div><span class="hl-tip">주문을 기다리는 손님을 누르면 그 요리로 주방에 가요 · 빈 그릇은 눌러서 치워요 · <kbd>H</kbd> 주방/홀</span><button type="button" class="big-btn" id="hlBack">주방으로</button></div>`;
  d.querySelector('.hl-bg').style.backgroundImage=`url(${GIMG.hall})`;$('#hlBack').onclick=()=>setScreen('kitchen');
  const tl=d.querySelector('.hl-tables');TBL.forEach((p,i)=>{const e=document.createElement('div');e.className='ht';e.dataset.i=i;
    const h=Math.round(p.sz*.86),seat=(sx,k)=>`<div class="hs hs-${k}" style="left:${sx-p.sz/2}px;top:${p.edge-h}px;width:${p.sz}px;height:${h}px"><img alt="" style="width:${p.sz}px;height:${p.sz}px"></div>`;
    e.innerHTML=seat(p.seats[0],'a')+seat(p.seats[1],'b')+`<div class="ht-say" style="left:${p.seats[1]+p.sz*.42}px;top:${p.edge-h*.62}px"><b></b><i><s></s></i></div>
      <img class="ht-dish" alt="" style="left:${p.x-p.sz*.5}px;top:${p.y-p.sz*.36}px;width:${p.sz}px;height:${p.sz*.62}px"><div class="ht-plate" style="left:${p.x-34}px;top:${p.y-20}px"></div>
      <div class="ht-lock" style="left:${p.x}px;top:${p.y-10}px"></div><div class="ht-hit" style="left:${p.seats[0]-p.sz/2}px;top:${p.edge-h}px;width:${p.seats[1]-p.seats[0]+p.sz}px;height:${p.y-p.edge+h+30}px"></div>`;
    e.querySelector('.ht-hit').onclick=()=>hallClick(i);tl.appendChild(e);});}return d;}
SCR.show_hall=()=>{hallRoot();hallDirty=true;renderHall();};
function renderHall(){if(!G||!G.hall)return;const d=hallRoot();if(SCR.cur!=='hall'){hallBadge();return;}hallDirty=false;const els=d.querySelectorAll('.ht'),act=seats();
  G.hall.forEach((t,i)=>{const e=els[i],o=G.orders.find(q=>q.id===t.oid),R=t.dish&&RID[t.dish];e.className='ht s-'+t.state+(i>=act?' locked':'')+(t.comp?' two':'');
    const f=o&&o.pat!==Infinity?clamp(o.left/o.pat,0,1):1,m=t.state==='wait'?moodK(f):t.state==='leave'?'a':t.mood;
    for(const [k,id] of [['a',t.cust],['b',t.comp]]){const im=e.querySelector('.hs-'+k+' img');const src=id?seatImg(id,m):'';if(src&&im.getAttribute('src')!==src)im.src=src;}
    const say=e.querySelector('.ht-say');say.querySelector('b').textContent=t.state==='wait'?(R?R.n+(o&&o.opt?' · '+o.opt[0]:''):''):t.state==='eat'?(t.sc>=85?'“맛있다!” 😋':t.sc>=65?'“냠냠” 🙂':'“음…” 😐'):t.state==='pay'?`💰 +${won(t.pay||0)}`:t.state==='leave'?'“너무 오래 걸려요…” 💢':'';
    const bar=say.querySelector('s');bar.style.width=(t.state==='wait'?f:t.state==='eat'?1-(G.t-t.t0)/EAT_T:0)*100+'%';bar.style.background=t.state==='wait'?(f>.5?'#6fbf73':f>.25?'#f0ae3a':'#e0412a'):'#f0ae3a';
    const di=e.querySelector('.ht-dish');if((t.state==='eat'||t.state==='pay')&&R){const ds=dishImg(R.id);if(ds&&di.getAttribute('src')!==ds)di.src=ds;}
    e.querySelector('.ht-lock').textContent=i>=act?(i===2?'가게 Lv3에 열려요':i===3?'Lv6 · 손님 속도 “바쁘게”':'가게 확장 예정'):'';});
  const w=G.hall.filter(t=>t.state==='wait').length,e2=G.hall.filter(t=>t.state==='eat').length,dt2=G.hall.filter(t=>t.state==='dirty').length;
  $('#hlStat').innerHTML=`<b>DAY ${G.day.n}</b><span>주문 기다림 ${w}</span><span>식사 중 ${e2}</span><span class="${dt2?'warn':''}">치울 자리 ${dt2}</span><span>오늘 손님 ${G.day.served+G.day.fail}팀</span>`;hallBadge();}
function hallBadge(){const b=$('#scrNav .nb');if(!b||!G||!G.hall)return;const n=G.hall.filter(t=>t.state==='dirty').length;b.hidden=!n||SCR.cur==='hall';b.textContent=n;}
function hallClick(i){const t=G.hall[i];if(!t)return;if(t.state==='dirty'){clearTable(t);renderHall();return;}
  if(t.state==='wait'){const o=G.orders.find(q=>q.id===t.oid);if(o){G.sel=o.id;renderTickets();$('#recipePop').hidden=false;renderSteps();hudTick();setScreen('kitchen');}}}
function floatHall(t,txt,col){const p=TBL[t.i],d=hallRoot(),f=document.createElement('div');f.className='hl-float';f.textContent=txt;f.style.left=p.x+'px';f.style.top=(p.edge-p.sz)+'px';f.style.color=col||'#fff';d.appendChild(f);setTimeout(()=>f.remove(),1400);}
