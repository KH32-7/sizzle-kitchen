
/* ---------- 1.4 hall: guests take a table, order, eat what you cooked, pay and leave ---------- */
// table spots on the hall art (stage coords), in the order they open up with shop level
const TBL=[{x:800,y:356},{x:796,y:582},{x:444,y:356},{x:1156,y:356},{x:344,y:582},{x:1250,y:582}];
const EAT_T=16,DIRTY_AUTO=45;
function newHall(){return TBL.map((p,i)=>({i,x:p.x,y:p.y,state:'free',oid:null,cust:null,t0:0,dish:null,sc:0,mood:'h'}));}
const hallOn=()=>G&&G.started&&G.mode==='career'&&G.hall;
const activeTables=()=>G.hall.slice(0,seats());
const freeTable=()=>hallOn()?activeTables().find(t=>t.state==='free'):true;
function hallSeat(o){if(!hallOn())return;const t=activeTables().find(t=>t.state==='free');if(!t)return;t.state='wait';t.oid=o.id;t.cust=o.cust;t.t0=G.t;t.dish=o.rid;o.table=t.i+1;hallDirty=true;}
let hallDirty=true;
/* no free (clean) table → nobody new walks in */
spawnOrder=(orig=>function(){if(G.mode==='career'&&G.hall&&!freeTable())return;orig();})(spawnOrder);
assignGuest=(orig=>function(o){orig(o);hallSeat(o);})(assignGuest);
/* serving hands the dish to the table */
serve=(orig=>function(){const o=selOrder();orig();if(!hallOn()||!o||G.orders.includes(o))return;const t=G.hall.find(t=>t.oid===o.id);if(!t)return;
  const P=G.lastServe,sc=P&&P.o===o?P.res.total:70;t.state='eat';t.t0=G.t;t.sc=sc;t.mood=scoreK(sc);t.pay=P?P.pay+P.tip:0;hallDirty=true;hallPing();})(serve);
function hallTick(dt){if(!hallOn())return;for(const t of G.hall){
    if(t.state==='wait'&&!G.orders.some(o=>o.id===t.oid)){t.state='leave';t.t0=G.t;t.mood='a';hallDirty=true;}
    else if(t.state==='eat'&&G.t-t.t0>EAT_T){t.state='pay';t.t0=G.t;hallDirty=true;if(SCR.cur==='hall')hallCoin(t);}
    else if(t.state==='pay'&&G.t-t.t0>1.6){t.state='dirty';t.t0=G.t;t.cust=null;hallDirty=true;hallPing();}
    else if(t.state==='leave'&&G.t-t.t0>1.4){t.state='free';t.oid=t.cust=null;hallDirty=true;}
    else if(t.state==='dirty'&&G.t-t.t0>(hallAuto()?4:DIRTY_AUTO)){clearTable(t,true);}}
  G._hr=(G._hr||0)+dt;if(hallDirty||(SCR.cur==='hall'&&G._hr>.2)){G._hr=0;renderHall();}}
const hallAuto=()=>typeof staffOn==='function'&&staffOn('hall');
function clearTable(t,auto){if(t.state!=='dirty')return;t.state='free';t.oid=t.cust=t.dish=null;hallDirty=true;
  if(!auto){AU.place&&AU.place();const lucky=Math.random()<.3;if(lucky){SAVE.money+=300;G.day&&(G.day.tips+=300);}floatHall(t,lucky?'+300원 · 놓고 간 팁':'반짝!',lucky?'#9fe0a0':'#fff3cf');}
  hallPing();}
gameTick=(orig=>function(dt){orig(dt);hallTick(dt);})(gameTick);
startCareer=(orig=>function(){orig();G.hall=newHall();for(const o of G.orders)hallSeat(o);hallDirty=true;})(startCareer);
/* ---- drawing (DOM) ---- */
function hallRoot(){const d=screenEl('hall','hall');if(!d.dataset.built){d.dataset.built=1;
  d.innerHTML=`<div class="hl-bg"></div><div class="hl-tables"></div><div class="hl-bar"><div class="hl-stat" id="hlStat"></div><span class="hl-tip">손님을 누르면 그 주문으로 주방에 가요 · 빈 그릇은 눌러서 치워요 · <kbd>H</kbd> 주방/홀</span><button type="button" class="big-btn" id="hlBack">주방으로</button></div>`;
  d.querySelector('.hl-bg').style.backgroundImage=`url(${GIMG.hall})`;$('#hlBack').onclick=()=>setScreen('kitchen');
  const tl=d.querySelector('.hl-tables');for(const p of TBL){const e=document.createElement('div');e.className='ht';e.style.left=p.x+'px';e.style.top=p.y+'px';
    e.innerHTML=`<div class="ht-g"><img alt=""><svg viewBox="0 0 100 100"><circle class="bg" cx="50" cy="50" r="46"/><circle class="fg" cx="50" cy="50" r="46"/></svg><i class="ht-e"></i></div><div class="ht-say"></div><img class="ht-dish" alt=""><div class="ht-plate"></div><div class="ht-tag"></div><div class="ht-lock"></div>`;
    e.onclick=()=>hallClick(TBL.indexOf(p));tl.appendChild(e);}}return d;}
SCR.show_hall=()=>{hallRoot();hallDirty=true;renderHall();};
function renderHall(){if(!G||!G.hall)return;const d=hallRoot();if(SCR.cur!=='hall'){hallBadge();return;}hallDirty=false;const els=d.querySelectorAll('.ht'),act=seats();
  G.hall.forEach((t,i)=>{const e=els[i],o=G.orders.find(q=>q.id===t.oid),R=t.dish&&RID[t.dish];e.className='ht s-'+t.state+(i>=act?' locked':'');
    const img=e.querySelector('.ht-g img');const showG=t.state==='wait'||t.state==='eat'||t.state==='pay'||t.state==='leave';
    if(showG&&t.cust){const f=o&&o.pat!==Infinity?clamp(o.left/o.pat,0,1):1,m=t.state==='wait'?moodK(f):t.state==='leave'?'a':t.mood;const src=gImg(t.cust,m);if(img.getAttribute('src')!==src)img.src=src;
      e.querySelector('.fg').style.strokeDashoffset=String(289*(1-(t.state==='wait'?f:t.state==='eat'?1-(G.t-t.t0)/EAT_T:0)));e.querySelector('.fg').style.stroke=t.state==='wait'?(f>.5?'#6fbf73':f>.25?'#f0ae3a':'#e0412a'):'#f0ae3a';
      e.querySelector('.ht-e').textContent=t.state==='wait'?MOOD(f):t.state==='eat'?'😋':t.state==='pay'?'💰':'💢';}
    e.querySelector('.ht-say').textContent=t.state==='wait'?(R?R.n+(o&&o.opt?' '+o.opt[0]:''):''):t.state==='eat'?(t.sc>=85?'“맛있다!”':t.sc>=65?'“냠냠”':'“음…”'):t.state==='pay'?`+${won(t.pay||0)}`:t.state==='leave'?'“너무 오래 걸려요…”':'';
    const di=e.querySelector('.ht-dish');if(t.state==='eat'&&R&&RIMG[R.id]){if(di.getAttribute('src')!==RIMG[R.id])di.src=RIMG[R.id];}
    e.querySelector('.ht-tag').textContent=`${i+1}번`;e.querySelector('.ht-lock').textContent=i>=act?(i===2?'가게 Lv3에 열려요':i===3?'Lv6 · 손님 속도 “바쁘게”':'가게 확장 예정'):'';});
  const w=G.hall.filter(t=>t.state==='wait').length,e2=G.hall.filter(t=>t.state==='eat').length,dt2=G.hall.filter(t=>t.state==='dirty').length;
  $('#hlStat').innerHTML=`<b>DAY ${G.day.n}</b><span>주문 기다림 ${w}</span><span>식사 중 ${e2}</span><span class="${dt2?'warn':''}">치울 자리 ${dt2}</span><span>오늘 손님 ${G.day.served+G.day.fail}명</span>`;hallBadge();}
function hallBadge(){const b=$('#scrNav .nb');if(!b||!G||!G.hall)return;const n=G.hall.filter(t=>t.state==='dirty').length;b.hidden=!n||SCR.cur==='hall';b.textContent=n;}
function hallClick(i){const t=G.hall[i];if(!t)return;if(t.state==='dirty'){clearTable(t);renderHall();return;}
  if(t.state==='wait'){const o=G.orders.find(q=>q.id===t.oid);if(o){G.sel=o.id;renderTickets();$('#recipePop').hidden=false;renderSteps();hudTick();setScreen('kitchen');}}}
function floatHall(t,txt,col){const d=hallRoot(),f=document.createElement('div');f.className='hl-float';f.textContent=txt;f.style.left=t.x+'px';f.style.top=(t.y-150)+'px';f.style.color=col||'#fff';d.appendChild(f);setTimeout(()=>f.remove(),1400);}
function hallCoin(t){floatHall(t,'💰 계산 완료','#ffd07a');AU.cash&&AU.cash();}
function hallPing(){hallBadge();}
