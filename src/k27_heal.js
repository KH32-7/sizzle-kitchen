
/* ---------- 1.3.1: noodle gauge · easier market · announced critic visit ---------- */
/* noodle doneness gauge above every pot of boiling noodles (like the jeon underside ring) */
const NZ=[[0,.72,'덜 익음',[150,140,130]],[.72,.9,'꼬들',[240,200,90]],[.9,1.08,'보통',[120,200,90]],[1.08,1.4,'퍼짐',[220,90,60]]];
const nzName=d=>(NZ.find(z=>d>=z[0]&&d<z[1])||NZ[3])[2];
function noodleTarget(n){const o=selOrder&&G.orders&&selOrder();if(!o)return null;const R=RID[o.rid],ns=R&&R.spec&&R.spec.noodle;if(!ns||ns.type!==n.type)return null;return ns.done==='opt'?(o.opt?o.opt[1]:[.88,1.08]):ns.done;}
function drawNoodleGauge(g,c){const n=c.noodles.reduce((a,b)=>!a||b.g>a.g?b:a,null);if(!n||!c.liq||c.liq.vol<30)return;
  const W2=176,x0=c.x-W2/2,y0=c.y-c.r-34,lo=.5,hi=1.3,X=d=>x0+clamp((d-lo)/(hi-lo),0,1)*W2,tg=noodleTarget(n),d=n.done,inT=tg&&d>=tg[0]&&d<=tg[1];
  g.save();g.fillStyle='rgba(15,10,8,.86)';rr(g,x0-8,y0-22,W2+16,40,9);g.fill();
  for(const z of NZ){const a=X(Math.max(z[0],lo)),b=X(z[1]);g.fillStyle=rgba(z[3],.8);g.fillRect(a,y0,b-a,7);}
  if(tg){g.strokeStyle=inT?'#9df09a':'rgba(255,255,255,.85)';g.lineWidth=2;g.setLineDash(inT?[]:[3,3]);g.strokeRect(X(tg[0])-1,y0-3,X(tg[1])-X(tg[0])+2,13);g.setLineDash([]);}
  const mx=X(d);g.fillStyle='#fff';g.beginPath();g.moveTo(mx,y0-2);g.lineTo(mx-6,y0-10);g.lineTo(mx+6,y0-10);g.closePath();g.fill();
  g.font='600 12px "Gowun Dodum", sans-serif';g.textAlign='left';g.fillStyle='#f3ead8';g.fillText(`${NT[n.type].n} · ${n.T<80?'물이 끓으면 익어요':nzName(d)}`,x0,y0-8);
  g.textAlign='right';g.fillStyle=inT?'#9df09a':d>1.08?'#ff9a7a':'#cdb994';g.fillText(inT?'지금 건지세요!':tg&&d<tg[0]?'조금 더':tg&&d>tg[1]?'넘었어요':'',x0+W2,y0-8);g.restore();
  if(inT&&!n._gOk){n._gOk=1;AU.ding&&AU.ding();floatText('딱 좋아요!',c.x,y0-26,'#b8f0a0',22);for(let i=0;i<10;i++){const a=rand(0,TAU);spawn({k:'spark',x:mx,y:y0,vx:Math.cos(a)*60,vy:Math.sin(a)*60-20,max:rand(.4,.7),r:rand(2,4)});}}}
render=(orig=>function(){orig();if(!G||!G.started||G.hideCursor)return;const g=ctx;g.setTransform(PX,0,0,PX,0,0);for(const c of G.cw)if(c.noodles&&c.noodles.length&&!c.drag)drawNoodleGauge(g,c);})(render);

/* market: categories, low-stock highlight, one-click restock for today's menu */
const MKCAT=[['all','전체'],['veg','채소'],['meat','고기·해산물'],['base','밥·면·계란'],['broth','육수'],['low','부족한 것']];
const catOf=id=>BOT[id]?'broth':['rice','egg','butter','ice','udon','ramen','yakisoba','somyeon','ramyeon','spaghetti','mandu'].includes(id)?'base':['ham','pork','chashu','naruto','squid','beef','loin'].includes(id)?'meat':'veg';
let MKF='all';
function menuIngs(){const u=recipeUses(),s=new Set();for(const r of menuPool())for(const id of (u[r.id]||[]))s.add(id);return s;}
function wantOf(id){return BOT[id]?1500:id==='egg'?10:id==='rice'?6:4;}
const lowOf=(id,need)=>need.has(id)&&(SAVE.stock[id]||0)<wantOf(id)*(BOT[id]?1:.5);
function fillCart(){const need=menuIngs();CART={};let left=SAVE.money-15000;
  for(const [id,,price] of [...FRIDGE,...PANTRY_STOCK]){if(!need.has(id)||!ingOpen(id))continue;const unit=UNIT(id),have=SAVE.stock[id]||0,n=Math.max(0,Math.ceil((wantOf(id)-have)/unit));const k=Math.min(n,Math.floor(left/price));if(k>0){CART[id]=k;left-=k*price;}}
  renderMarketRows();mkTotal();toast('🧺','오늘 메뉴에 필요한 재료를 담았어요',Object.keys(CART).length?`${Object.keys(CART).length}가지 · 확인하고 주문하기를 눌러요`:'이미 넉넉해요!');}
function renderMarketRows(){const list=$('#mkList');list.innerHTML='';const need=menuIngs();
  const bar=document.createElement('div');bar.className='mk-bar';bar.innerHTML=MKCAT.map(([k,n])=>`<button type="button" data-k="${k}" class="${MKF===k?'on':''}">${n}</button>`).join('')+`<button type="button" class="mk-fill">🧺 오늘 메뉴 재료 채우기</button>`;
  bar.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{MKF=b.dataset.k;renderMarketRows();});bar.querySelector('.mk-fill').onclick=fillCart;list.appendChild(bar);
  const items=[...FRIDGE,...PANTRY_STOCK].filter(([id])=>ingOpen(id)&&(MKF==='all'||(MKF==='low'?lowOf(id,need):catOf(id)===MKF)));
  items.sort((a,b)=>(need.has(b[0])-need.has(a[0]))||(lowOf(b[0],need)-lowOf(a[0],need)));
  if(!items.length){const e=document.createElement('p');e.className='mk-empty';e.textContent=MKF==='low'?'부족한 재료가 없어요. 오늘 장사 준비 끝!':'이 분류의 재료가 아직 없어요.';list.appendChild(e);}
  for(const [id,n,price] of items){const unit=UNIT(id),row=document.createElement('div'),low=lowOf(id,need);row.className='mk-row'+(low?' low':'')+(need.has(id)?'':' dim');
    row.innerHTML=`<img alt="" src="${itemIcon(id)}"><span class="mk-n">${n}${SHELF[id]!==undefined?` <small>유통 ${SHELF[id]}일</small>`:''}${unit>1?' <small>500ml</small>':''}${need.has(id)?'':' <small>지금 메뉴엔 안 써요</small>'}</span><span class="mk-s">${low?'⚠ ':''}재고 ${unit>1?(SAVE.stock[id]||0)+'ml':(SAVE.stock[id]||0)}</span><span class="mk-p">${won(price)}</span><span class="mk-q"><button type="button" data-d="-1">−</button><b>${CART[id]||0}</b><button type="button" data-d="1">+</button><button type="button" data-d="5">+5</button></span>`;
    row.querySelectorAll('button').forEach(b=>b.onclick=()=>{CART[id]=Math.max(0,(CART[id]||0)+Number(b.dataset.d));row.querySelector('b').textContent=CART[id];mkTotal();});
    row.querySelector('img').onclick=()=>{CART[id]=(CART[id]||0)+1;row.querySelector('b').textContent=CART[id];mkTotal();};list.appendChild(row);}
  const lk=[...FRIDGE,...PANTRY_STOCK].filter(([id])=>!ingOpen(id));if(lk.length&&MKF==='all'){const d=document.createElement('p');d.className='mk-locked';d.textContent=`🔒 아직 안 파는 재료 ${lk.length}가지 — 새 메뉴가 열리면 함께 들어와요.`;list.appendChild(d);}if(MKF==='all')renderUpgrades(list);}
openMarket=function(){CART={};MKF='all';renderMarketRows();mkTotal();$('#market').hidden=false;};

/* ---------- critic: announced visit, reviewed like a newspaper column ---------- */
function criticPlan(){if(G.mode!=='career'||shopLv()<3)return;if(SAVE.critDay&&SAVE.critDay.day===SAVE.day){G.day.criticAt=SAVE.critDay.at;G.day.criticDone=SAVE.critDay.done;return;}const last=SAVE.criticLast||0;if(SAVE.day-last<3)return;const R=mulberry(SAVE.day*131+7);if(R()>.6)return;
  G.day.criticAt=DAYLEN*(.3+R()*.3);SAVE.critDay={day:SAVE.day,at:G.day.criticAt,done:false};const hh=11+Math.floor(G.day.criticAt/DAYLEN*10);
  setTimeout(()=>{if(G&&G.started)toast('📰','오늘 미식 평론가 방문 예정!',`${hh}시쯤 들러요. 맛·속도·청결·분위기를 보고 칼럼을 써요.`,'long ach');},2600);}
const critHH=()=>G.day&&G.day.criticAt?11+Math.floor(G.day.criticAt/DAYLEN*10):null;
assignGuest=(orig=>function(o){if(G.forceCritic){o.critic=true;G.forceCritic=false;}orig(o);})(assignGuest);
gameTick=(orig=>function(dt){orig(dt);if(G.mode!=='career'||!G.day||!G.day.criticAt||G.day.criticDone)return;
  if(G.day.t>=G.day.criticAt&&G.day.t<DAYLEN&&G.orders.length<seats()){G.day.criticDone=true;if(SAVE.critDay)SAVE.critDay.done=true;G.forceCritic=true;spawnOrder();}})(gameTick);
function criticReview(o,sc){SAVE.criticLast=SAVE.day;const P=o;let taste=0,speed=0,clean=0,mood=0;
  if(sc!==null){taste=sc;speed=clamp(P.left/P.pat,0,1)*100;const drips=(G.plate.drips||[]).length+(G.bowl.drips||[]).length;clean=clamp(100-G.counter.fluid.length*1.5-(G.stats.alarm?25:0)-drips*10,20,100);
    mood=clamp(45+Object.values(decoEq()).filter(Boolean).length*11+shopLv()*2,0,100);}
  const sum=sc===null?25:taste*.5+speed*.2+clean*.15+mood*.15,stars=clamp(Math.round(sum/20*2)/2,1,5);
  const rw=stars>=5?{rep:.5,money:30000}:stars>=4?{rep:.3,money:15000}:stars>=3?{rep:.1,money:5000}:{rep:-.15,money:0};
  SAVE.rep=clamp(SAVE.rep+rw.rep,0,5);SAVE.money+=rw.money;(SAVE.critic=SAVE.critic||[]).push({day:SAVE.day,stars});writeSave();
  const title=stars>=4.5?'골목에서 찾은 보석 같은 한 그릇':stars>=3.5?'정성이 느껴지는 동네 식당':stars>=2.5?'가능성이 보이는 작은 주방':'다음을 기대해 보겠다';
  const line=sc===null?'“한참을 기다렸지만 음식은 끝내 나오지 않았다. 다음 방문을 기약한다.”':stars>=4.5?'“한 입 먹자마자 수첩을 덮었다. 설명이 필요 없는 맛이다.”':stars>=3.5?'“기본에 충실한 맛. 다시 찾고 싶은 집이다.”':'“재료는 좋았다. 조금만 더 다듬으면 좋겠다.”';
  setTimeout(()=>showReview({stars,title,line,rw,cats:sc===null?null:[['맛',taste],['속도',speed],['청결',clean],['분위기',mood]],R:RID[o.rid]}),sc===null?300:1200);}
function showReview(V){let d=$('#review');if(!d){d=document.createElement('div');d.id='review';d.className='overlay';$('#stage').appendChild(d);}
  const st='★'.repeat(Math.floor(V.stars))+(V.stars%1?'½':'')+'☆'.repeat(5-Math.ceil(V.stars));
  d.innerHTML=`<div class="rv"><div class="rv-mast"><b>지글지글 일보</b><span>DAY ${SAVE.day} · 미식 칼럼</span></div><div class="rv-body"><img alt="" src="${gImg('critic',V.stars>=3.5?'h':V.stars>=2.5?'n':'a')}"><div><h3>${V.title}</h3><div class="rv-st">${st}<small>${V.stars.toFixed(1)}</small></div><p>${V.line}</p>
    ${V.cats?`<div class="rv-cats">${V.cats.map(([k,v])=>`<span>${k}</span><div class="xp"><i style="width:${Math.round(v)}%"></i></div>`).join('')}</div>`:''}<p class="rv-rw">${V.rw.rep>=0?`평판 +${V.rw.rep}`:`평판 ${V.rw.rep}`}${V.rw.money?` · 칼럼 소개 효과 +${won(V.rw.money)}`:''}</p></div></div><button type="button" class="big-btn" id="rvOk">계속 영업</button></div>`;
  G.paused=true;d.hidden=false;AU.ding&&AU.ding();$('#rvOk').onclick=()=>{d.hidden=true;G.paused=false;hudTick();};}
startCareer=(orig=>function(){orig();if(G&&G.day)criticPlan();})(startCareer);
/* critic chip in the HUD while a visit is expected */
hudTick=(orig=>function(){orig();if(!G||G.mode!=='career'||!G.day)return;let c=$('#critChip');const on=G.day.criticAt&&!G.day.criticDone;
  if(on&&!c){c=document.createElement('span');c.id='critChip';$('#top .st').appendChild(c);}if(c){c.hidden=!on;if(on)c.textContent=`📰 평론가 ${critHH()}시쯤`;}})(hudTick);
