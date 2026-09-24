
/* ---------- economy data ---------- */
const FRIDGE=[['kimchi','김치',1200,'ing'],['onion','양파 반쪽',400,'ing'],['ham','통조림 햄',1800,'ing'],['scallion','대파',500,'ing'],['jjokpa','쪽파 한 줌',900,'ing'],['buchu','부추 한 줌',900,'ing'],
  ['zucchini','애호박',700,'ing'],['carrot','당근',400,'ing'],['cucumber','오이',700,'ing'],['cabbage','양배추',900,'ing'],['pork','삼겹살 슬라이스',2500,'ing'],['chashu','차슈',2800,'ing'],
  ['naruto','어묵',800,'ing'],['squid','오징어',2200,'ing'],['garlic','마늘',200,'ing'],['beef','소고기 등심',9000,'ing'],['egg','계란',300,'egg'],['rice','찬밥 한 공기',500,'rice'],
  ['butter','버터',600,'butter'],['udon','냉동 우동',900,'noodle'],['ramen','생라멘',1000,'noodle'],['yakisoba','야키소바면',900,'noodle'],
  ['anchovy','멸치육수',800,'bottle'],['kbroth','김치말이 육수',1000,'bottle'],['rstock','라멘 육수',1500,'bottle'],['dashi','가쓰오 다시',900,'bottle'],['ice','얼음',300,'ice']];
const PANTRY_STOCK=[['somyeon','소면 1인분',400],['ramyeon','라면',900],['spaghetti','스파게티 1인분',600]];
const PRICE={};for(const f of FRIDGE)PRICE[f[0]]=f[2];for(const p of PANTRY_STOCK)PRICE[p[0]]=p[2];
const UNIT=id=>BOT[id]?500:1;
const NAMES=['김 대리','이 선생님','박 사장님','최 학생','정 할머니','한 과장','윤 작가','강 기사님','조 선수','배 교수','서 주무관','문 셰프'];
const RENT=22000,SEASON=5000,DAYLEN=600;
let SAVE=null;
function starterStock(){const s={};for(const f of FRIDGE)s[f[0]]=f[3]==='bottle'?1500:f[0]==='beef'?2:f[0]==='egg'?10:f[0]==='rice'?4:4;for(const p of PANTRY_STOCK)s[p[0]]=5;return s;}
function loadSave(){try{const r=localStorage.getItem('sizzle-kitchen-v2');if(r){SAVE=JSON.parse(r);}}catch(e){}if(!SAVE||!SAVE.stock)SAVE={day:1,money:60000,rep:3,stock:starterStock(),dlc:{base:true,noodle:true,jeon:true,jp:true,west:true},best:{},served:0};for(const k in starterStock())if(SAVE.stock[k]===undefined)SAVE.stock[k]=0;SAVE.up=SAVE.up||{};SAVE.ach=SAVE.ach||{};UPG=SAVE.up;syncLots();}
function writeSave(){try{localStorage.setItem('sizzle-kitchen-v2',JSON.stringify(SAVE));}catch(e){}}

/* ---------- sessions ---------- */
function resetKitchen(mode){G=makeState(mode);if(UPG.burner)for(const b of G.burners)b.P*=1.2;G.stock=mode==='practice'?new Proxy({},{get:()=>999,set:()=>true}):SAVE.stock;MX.clearRect(0,0,L.board.w,L.board.h);STX.clearRect(0,0,W,H);}
function startCareer(){tutStop();resetKitchen('career');const m=SAVE.mid&&SAVE.mid.day===SAVE.day?SAVE.mid:null;G.day={n:SAVE.day,t:0,rev:0,tips:0,spend:0,served:0,fail:0,scores:[],gasStart:0};G.started=true;G.nextOrder=6;
  if(m){Object.assign(G.day,{t:m.t,rev:m.rev,tips:m.tips,spend:m.spend,served:m.served,fail:m.fail,scores:m.scores||[],special:m.special});G.gas=m.gas||0;G.combo=m.combo||0;G.closeCap=m.closeCap;G.orders=(m.orders||[]).map(o=>Object.assign({},o,{id:G.oid++,t0:G.t,steps:{}}));G.sel=G.orders[0]?G.orders[0].id:null;G.nextOrder=8;}
  else{G.day.special=pickSpecial();midSave();}
  hideAll();$('#top').hidden=false;renderTickets();hudTick();AU.door();if(!SAVE.toured)askTour(()=>dayBanner(!!m));else dayBanner(!!m);}
function startPractice(rid,guide){tutStop();resetKitchen('practice');G.started=true;hideAll();$('#top').hidden=false;const R=RID[rid];G.orders=[{id:G.oid++,rid,t0:0,pat:Infinity,left:Infinity,opt:R.opts?pick(R.opts):null,name:'연습',table:0,steps:{}}];G.sel=G.orders[0].id;renderTickets();hudTick();
  if(guide){if(!SAVE.toured){G.pendingGuide=rid;tourStart();}else tutStart(rid);}else{$('#recipePop').hidden=false;renderSteps();}}
function hideAll(){for(const id of ['title','dlcPanel','practice','fridge','market','result','settle','menu'])$('#'+id).hidden=true;}
function toTitle(){midSave();tutStop();if(G)G.started=false;hideAll();$('#top').hidden=true;$('#recipePop').hidden=true;$('#served').hidden=true;renderTitle();$('#title').hidden=false;}

/* ---------- orders ---------- */
const selOrder=()=>G.orders.find(o=>o.id===G.sel)||null;
function spawnOrder(){const pool=menuPool();if(!pool.length)return;let R=pick(pool);if(G.day&&G.day.special&&RID[G.day.special]&&Math.random()<.22)R=RID[G.day.special];const pat=(R.time*1.9+70)*1.35;
  const o={id:G.oid++,rid:R.id,t0:G.t,pat,left:pat,opt:R.opts?pick(R.opts):null,name:pick(NAMES),table:1+((Math.random()*8)|0),steps:{},special:!!(G.day&&G.day.special===R.id),req:pickReq(R)};G.orders.push(o);if(!selOrder())G.sel=o.id;
  AU.bell();floatText('새 주문!',1420,120,'#ffe9a0',30);renderTickets();}
function gameTick(dt){if(G.mode!=='career')return;const D=G.day;D.t+=dt;G.midT=(G.midT||0)+dt;if(G.midT>10){G.midT=0;midSave();}const open=D.t<DAYLEN;
  if(open){G.nextOrder-=dt;const maxO=seats();if(G.nextOrder<=0&&G.orders.length<maxO){spawnOrder();G.nextOrder=rand(57,96)/(.85+SAVE.rep*.05)*(SAVE.day<=3?1.2:1)*paceOf().mul*(1+.45*Math.max(0,G.orders.length-1));}if(!G.orders.length&&G.nextOrder>12)G.nextOrder=Math.min(G.nextOrder,12);}
  if(!open&&!G.closeCap){G.closeCap=true;for(const o of G.orders)o.left=Math.min(o.left,150);}
  for(let i=G.orders.length-1;i>=0;i--){const o=G.orders[i];o.left-=dt;if(o.left<=0){G.orders.splice(i,1);D.fail++;SAVE.rep=clamp(SAVE.rep-.06,0,5);guestLeft(o);floatText(`${o.name} 손님이 기다리다 떠났어요`,1420,150,'#ffb38a',22);AU.door();if(G.sel===o.id)G.sel=G.orders[0]?G.orders[0].id:null;renderTickets();}}
  if(!open&&!G.orders.length&&!G.dayEnded){G.dayEnded=true;setTimeout(endDay,800);}}
function renderTickets(){const rail=$('#rail');rail.innerHTML='';
  if(!G.orders.length){const d=document.createElement('div');d.className='tk-empty';d.textContent=G.mode==='career'&&G.day.t>=DAYLEN?'영업 종료 — 마지막 손님까지 끝났어요':'주문을 기다리는 중…';rail.appendChild(d);return;}
  for(const o of G.orders){const R=RID[o.rid],b=document.createElement('button');b.type='button';b.className='tk'+(o.id===G.sel?' sel':'');b.dataset.id=o.id;
    b.innerHTML=`<span class="tk-no">#${String(o.id).padStart(3,'0')}${o.table?' · '+o.table+'번':''}</span><b>${R.n}</b>${o.special?'<i class="tk-sp">특선</i>':''}${o.opt?`<em>${o.opt[0]}</em>`:''}${o.req?`<em class="tk-rq">${REQS[o.req].t}</em>`:''}<span class="tk-p">${won(orderPrice(o))}</span><span class="tk-bar"><i></i></span><span class="tk-who">${o.name}</span>`;
    b.addEventListener('click',()=>{if(G.sel===o.id){$('#recipePop').hidden=!$('#recipePop').hidden;}else{G.sel=o.id;renderTickets();}renderSteps();hudTick();});rail.appendChild(b);}updateTicketBars();}
function updateTicketBars(){for(const el of $$('#rail .tk')){const o=G.orders.find(q=>q.id==el.dataset.id);if(!o)continue;const f=o.pat===Infinity?1:clamp(o.left/o.pat,0,1),i=el.querySelector('.tk-bar i');i.style.width=(f*100).toFixed(1)+'%';i.style.background=f>.5?'#6fbf73':f>.25?'#f0ae3a':'#e0412a';el.classList.toggle('late',f<.25);}}
function renderSteps(){const o=selOrder(),pop=$('#recipePop');if(!o){pop.hidden=true;return;}const R=RID[o.rid];$('#rpTitle').textContent=R.n;{const im=$('#rpImg');if(typeof RIMG!=='undefined'&&RIMG[R.id]){im.src=RIMG[R.id];im.hidden=false;}else im.hidden=true;}$('#rpSub').textContent=(o.req?'요청: '+REQS[o.req].t+' · ':'')+(o.opt?o.opt[0]+' · ':'')+R.sub;
  const ol=$('#steps');ol.innerHTML='';let cur=false;R.steps.forEach((s,i)=>{const li=document.createElement('li');li.textContent=s[0];const d=!!o.steps[i];li.className=d?'done':!cur?'cur':'';if(!d&&!cur)cur=true;ol.appendChild(li);});}
function checkSteps(){const o=selOrder();if(!o)return;const R=RID[o.rid];let ch=false;R.steps.forEach((s,i)=>{if(!o.steps[i]){let ok=false;try{ok=s[1]();}catch(e){}if(ok){o.steps[i]=true;ch=true;AU.ding();}}});if(ch)renderSteps();}

/* ---------- serving ---------- */
function captureVessel(v){const c=$('#dish'),g=c.getContext('2d'),R=(v.kind==='bowl'?L.bowl.r:L.plate.r)+18,s=c.width/(R*2);g.setTransform(1,0,0,1,0,0);
  const bg=g.createRadialGradient(c.width/2,c.height/2,c.width*.2,c.width/2,c.height/2,c.width*.75);bg.addColorStop(0,'#4a3526');bg.addColorStop(1,'#241a14');g.fillStyle=bg;g.fillRect(0,0,c.width,c.height);
  const old=ctx;try{ctx=g;g.setTransform(s,0,0,s,-(v.x-R)*s,-(v.y-R)*s);g.save();if(dist(v.x,v.y,v.hx,v.hy)<=1){g.translate(v.x-v.hx,v.y-v.hy);drawPlateBowl(g);}g.restore();drawVessel(v);}catch(e){g.setTransform(1,0,0,1,0,0);g.drawImage(cv,(v.x-R)*PX,(v.y-R)*PX,R*2*PX,R*2*PX,0,0,c.width,c.height);}finally{ctx=old;g.setTransform(1,0,0,1,0,0);}
  return c.toDataURL('image/jpeg',.9);}
function serve(){const o=selOrder();if(!o){floatText('먼저 주문표를 선택하세요',1420,860,'#ffd0b0',22);return;}const R=RID[o.rid];let v=vesselOf(R),other=v===G.plate?G.bowl:G.plate,wrong=false;
  if(contEmpty(v)&&!contEmpty(other)){v=other;wrong=true;}if(contEmpty(v)){floatText('그릇이 비어 있어요',v.x,v.y,'#ffd0b0',24);return;}
  G.hideCursor=true;render();G.hideCursor=false;const hero=heroShot(v,R),img=hero||captureVessel(v);const res=evaluate(R,v,o);if(wrong){res.total=Math.max(0,res.total-5);res.notes.push({t:'meh',s:R.vessel==='bowl'?'그릇이 아니라 접시에 나왔네요.':'접시가 아니라 그릇에 나왔네요.'});}
  applyExtras(o,v,res);{const n=(v.drips||[]).length;res.plating=n?Math.max(0,100-n*18):100;res.clean=!n;if(n){res.total=Math.max(0,Math.round(res.total-Math.min(10,n*2.5)));res.cats.push(['깔끔함',res.plating]);res.notes.push({t:'meh',s:'그릇 테두리에 국물이 묻어 있어요. 행주로 닦고 내주세요.'});}else if(v.wiped)res.notes.push({t:'good',s:'테두리까지 깨끗하게 닦아 냈어요.'});}guestApply(o,v,res);const sc=res.total,q=clamp(sc/85,.25,1.15);let pay=Math.round(orderPrice(o)*q*(G.mode==='career'?(o.payMul||1)*(1+decoBonus('pmul')):1)/100)*100,tip=0;
  if(G.mode==='career'){const speed=o.pat===Infinity?0:clamp(o.left/o.pat,0,1);if(sc>=70)tip=Math.round(R.price*(.06+.14*speed)*(sc/100)/100)*100;G.combo=sc>=80?G.combo+1:0;if(G.combo>1)tip+=Math.round(R.price*Math.min(.25,G.combo*.05)/100)*100;
    tip=guestTip(o,tip);SAVE.money+=pay+tip;G.day.rev+=pay;G.day.tips+=tip;G.day.served++;G.day.scores.push(sc);SAVE.rep=clamp(SAVE.rep+(sc-65)/350,0,5);SAVE.served++;guestAfter(o,sc);}
  SAVE.best[R.id]=Math.max(SAVE.best[R.id]||0,sc);writeSave();if(G.mode==='career')midSave();checkAch(sc,{dlc:R.dlc,plating:res.plating,steak:R.id==='steak'&&res.notes.some(n=>n.t==='good'&&n.s.includes('정확히'))});
  clearCont(v);AU.cash();G.orders=G.orders.filter(q=>q!==o);G.sel=G.orders[0]?G.orders[0].id:null;renderTickets();renderSteps();
  const pack={R,res,img,pay,tip,o,hero:!!hero};G.lastServe=pack;if(G.mode==='practice')showResult(pack);else showToast(pack);hudTick();}
function stars(s){const st=Math.round(s/20*2)/2;let h='';for(let i=1;i<=5;i++)h+=`<span class="${st>=i?'f':st>=i-.5?'h':'e'}">★</span>`;return h;}
function quoteFor(s){return s>=90?'“사장님, 이거 레시피 좀 알려주세요!”':s>=75?'“이 집 잘하네요. 또 올게요.”':s>=60?'“무난하게 맛있어요.”':s>=40?'“음… 배는 부르네요.”':'“이건… 다시 만들어 주실 수 있나요?”';}
function showToast(P){const t=$('#served');t.innerHTML=`<div class="sv-h"><b>${P.R.n}</b><span>${P.o.name}</span></div><div class="sv-s"><span class="sv-n">${P.res.total}</span><span class="stars">${stars(P.res.total)}</span></div>
  <div class="sv-m">+${won(P.pay)}${P.tip?` <i>팁 +${won(P.tip)}</i>`:''}${G.combo>1?` <i class="cb">${G.combo}연속 호평!</i>`:''}</div><ul>${P.res.notes.slice(0,3).map(n=>`<li class="${n.t}">${n.s}</li>`).join('')}</ul><button type="button" id="svMore">자세히 보기</button>`;
  t.hidden=false;t.classList.remove('in');void t.offsetWidth;t.classList.add('in');$('#svMore').onclick=e=>{e.stopPropagation();t.hidden=true;showResult(P);};t.onclick=()=>{t.hidden=true;};t.title='클릭하면 닫혀요';clearTimeout(t._tm);t._tm=setTimeout(()=>{t.hidden=true;},8000);}
function showResult(P){const s=P.res.total;$('#resImg').src=P.img;$('#resImg').classList.toggle('hero',!!P.hero);$('#scoreNum').textContent=s;$('#stamp').textContent=s>=90?'셰프의 한 접시':s>=75?'단골 예약':s>=60?'합격':s>=40?'배는 불러요':'다시 도전';
  $('#stars').innerHTML=stars(s);$('#resName').textContent=P.R.n+(P.o.opt?` · ${P.o.opt[0]}`:'');$('#quote').textContent=quoteFor(s);
  $('#bars').innerHTML=P.res.cats.map(([k,v])=>`<span>${k}</span><div class="tr"><div class="fi" style="width:${clamp(v,0,100).toFixed(0)}%"></div></div><span class="v">${Math.round(v)}</span>`).join('');
  $('#notes').innerHTML=P.res.notes.map(n=>`<li class="${n.t}">${n.s}</li>`).join('');
  $('#resFoot').textContent=G.mode==='career'?`받은 돈 ${won(P.pay)}${P.tip?' + 팁 '+won(P.tip):''}`:`최고 기록 ${SAVE.best[P.R.id]||s}점`;
  $('#resAgain').textContent=G.mode==='practice'?'다른 요리 연습':'계속 영업';$('#result').hidden=false;G.paused=true;if(G.mode==='practice')tutStop();}
$('#resAgain').addEventListener('click',()=>{$('#result').hidden=true;G.paused=false;if(G.mode==='practice'){openPractice();}});

/* ---------- end of day ---------- */
function endDay(){if(G.mode!=='career')return;const D=G.day,gas=Math.round(G.gas/10)*10,avg=D.scores.length?Math.round(D.scores.reduce((a,b)=>a+b,0)/D.scores.length):0;
  const rentD=D.n<=3?12000:RENT;SAVE.money-=rentD+SEASON+gas;const profit=D.rev+D.tips-D.spend-rentD-SEASON-gas;SAVE.day++;SAVE.mid=null;const spoiled=spoilLots();writeSave();G.started=false;setTimeout(()=>checkAch(0),600);
  $('#settleBody').innerHTML=`<div class="st-row"><span>매출</span><b>${won(D.rev)}</b></div><div class="st-row"><span>팁</span><b>${won(D.tips)}</b></div><div class="st-row neg"><span>재료 구입</span><b>${D.spend?'−':''}${won(D.spend)}</b></div>
    <div class="st-row neg"><span>가스비</span><b>${gas?'−':''}${won(gas)}</b></div><div class="st-row neg"><span>임대료${rentD<RENT?' <small>(오픈 할인)</small>':''}</span><b>−${won(rentD)}</b></div><div class="st-row neg"><span>양념·소모품</span><b>−${won(SEASON)}</b></div>
    <div class="st-row tot ${profit<0?'neg':''}"><span>오늘 순이익</span><b>${profit<0?'−':''}${won(Math.abs(profit))}</b></div>
    <div class="st-meta"><span>서빙 ${D.served}건 · 놓친 주문 ${D.fail}건 · 평균 ${avg}점</span><span>평판 <span class="stars">${stars(SAVE.rep*20)}</span></span><span>잔고 ${won(SAVE.money)}</span></div>${spoiled.length?`<div class="st-spoil">버린 재료 (유통기한 지남): ${spoiled.map(([id,n])=>ING[id].n+' '+n).join(', ')}</div>`:''}${REC.some(r=>SAVE.dlc[r.dlc]!==false&&(UNLOCK[r.id]||1)===SAVE.day)?`<div class="st-new">내일 새 메뉴: ${REC.filter(r=>SAVE.dlc[r.dlc]!==false&&(UNLOCK[r.id]||1)===SAVE.day).map(r=>r.n).join(' · ')}</div>`:''}`;
  $('#settleDay').textContent=`DAY ${D.n} 마감`;$('#settle').hidden=false;$('#top').hidden=true;$('#recipePop').hidden=true;}
$('#stNext').addEventListener('click',()=>{hideAll();startCareer();});$('#stMarket').addEventListener('click',()=>openMarket());$('#stTitle').addEventListener('click',()=>toTitle());

/* ---------- item icons ---------- */
const ICON={};
function itemIcon(id){if(ICON[id])return ICON[id];const c=mk(144,144),g=c.getContext('2d');g.scale(2,2);g.translate(36,36);
  if(ING[id]){const p=newPiece(id,0,0);const s=Math.min(1,56/Math.max(p.ex,p.ey));g.scale(s,s);p.rot=id==='scallion'||id==='jjokpa'||id==='buchu'||id==='cucumber'||id==='zucchini'||id==='carrot'?-.6:0;drawPiece(g,p,0,0);}
  else if(id==='egg')drawBegg(g,{rot:.3},0,0);else if(id==='rice'){g.fillStyle='#fff';g.beginPath();g.arc(0,0,26,0,TAU);g.fill();g.fillStyle='#f4f0e3';g.beginPath();g.arc(0,0,20,0,TAU);g.fill();}
  else if(id==='butter'){g.fillStyle='#f6de8a';rr(g,-18,-12,36,24,4);g.fill();g.fillStyle='#fff';g.fillRect(-18,-4,36,8);}
  else if(NT[id]){g.fillStyle='rgba(255,255,255,.5)';rr(g,-28,-24,56,48,6);g.fill();const n=newNoodlePreview(id);drawNoodle(g,n,0,0);}
  else if(BOT[id]){g.scale(.42,.42);g.translate(0,-60);drawBottle(g,id);}
  else if(SHK[id]){g.fillStyle='rgba(0,0,0,.2)';rr(g,-15,-19,34,44,7);g.fill();g.fillStyle='#e8eef2';rr(g,-17,-22,34,44,7);g.fill();g.fillStyle=SHK[id].fill;rr(g,-14,-8,28,28,5);g.fill();g.fillStyle='#9aa4ac';rr(g,-17,-24,34,9,3);g.fill();}
  else if(id==='flour'){g.fillStyle='#f4f0e6';rr(g,-18,-22,36,44,5);g.fill();g.fillStyle='#d8412c';g.fillRect(-18,-6,36,12);}
  else if(id==='nori'){g.fillStyle='#1f2a1c';rr(g,-20,-20,40,40,3);g.fill();}
  else if(id==='steamer'){g.fillStyle='#c9995a';g.beginPath();g.arc(0,0,24,0,TAU);g.fill();g.strokeStyle='#8a5a28';g.lineWidth=2;g.beginPath();g.arc(0,0,20,0,TAU);g.stroke();}
  else if(id==='ice'){for(let i=0;i<4;i++)drawIce(g,{m:10,rot:i},(i%2)*18-9,(i>1?18:0)-9);}
  else if(id==='somyeon'||id==='ramyeon'||id==='spaghetti'){g.scale(.6,.6);drawPack(g,id);}
  return ICON[id]=c.toDataURL();}

/* ---------- fridge ---------- */
function openFridge(){if(!G.started)return;AU.door();if(G.mode!=='practice')syncLots();const grid=$('#fridgeGrid');grid.innerHTML='';
  const FR=[...FRIDGE].sort((a,b)=>(ingOpen(a[0])?0:1)-(ingOpen(b[0])?0:1));
  let nLock=0;for(const [id,n,,kind] of FR){if(!ingOpen(id)){nLock++;continue;}const stock=G.mode==='practice'?'∞':kind==='bottle'?(G.stock[id]||0)+'ml':(G.stock[id]||0);const out=G.mode!=='practice'&&(G.stock[id]||0)<=0;
    const b=document.createElement('button');b.type='button';b.className='fr-it'+(out?' out':'');b.innerHTML=`<img alt="" src="${itemIcon(id)}"><span>${n}</span><em>${out?'품절':stock}</em>${out?'':freshTag(id)}`;b.disabled=out;b.onclick=()=>{takeFridge(id,kind);$('#fridge').hidden=true;};grid.appendChild(b);}
  if(nLock){const p=document.createElement('p');p.className='fr-lock';p.textContent=`🔒 나머지 ${nLock}가지 재료는 새 메뉴가 열리면 함께 들어와요.`;grid.appendChild(p);}
  $('#frMarket').hidden=G.mode==='practice';$('#fridge').hidden=false;}
function takeFridge(id,kind){if(G.held)returnHeld();setTool('hand');let lotD=null;if(G.mode!=='practice'&&kind!=='bottle'){if(tracked(id))lotD=takeLot(id);G.stock[id]--;}
  if(kind==='ing')G.held={kind:'ing',id,piece:newPiece(id,M.x,M.y),src:'fridge'};else if(kind==='bottle')G.held={kind:'bottle',id,stock:true,tilt:0,active:false,poured:0,flow:0};
  else if(kind==='noodle')G.held={kind:'noodle',id,nt:id,src:'fridge'};else G.held={kind,id,src:'fridge'};if(lotD!==null){G.held.lotD=lotD;if(G.held.piece&&SAVE.day-lotD>SHELF[id]){G.held.piece.stale=true;floatText('시든 재료예요…',M.x,M.y-50,'#d8c890',20);}}AU.pick();}
$('#frClose').addEventListener('click',()=>{$('#fridge').hidden=true;AU.door();});$('#frMarket').addEventListener('click',()=>{$('#fridge').hidden=true;openMarket();});

/* ---------- market ---------- */
let CART={};
function openMarket(){CART={};const list=$('#mkList');list.innerHTML='';renderUpgrades(list);
  for(const [id,n,price] of [...FRIDGE,...PANTRY_STOCK].sort((a,b)=>(ingOpen(a[0])?0:1)-(ingOpen(b[0])?0:1))){if(!ingOpen(id)){const row=document.createElement('div');row.className='mk-row locked';row.innerHTML=`<img alt="" src="${itemIcon(id)}"><span class="mk-n">${n}</span><span class="mk-s">🔒</span><span class="mk-p"></span><span class="mk-q">${lockMsg(id)}</span>`;list.appendChild(row);continue;}const unit=UNIT(id),row=document.createElement('div');row.className='mk-row';
    row.innerHTML=`<img alt="" src="${itemIcon(id)}"><span class="mk-n">${n}${SHELF[id]!==undefined?` <small>유통 ${SHELF[id]}일</small>`:''}${unit>1?' <small>500ml</small>':''}</span><span class="mk-s">재고 ${unit>1?(SAVE.stock[id]||0)+'ml':(SAVE.stock[id]||0)}</span><span class="mk-p">${won(price)}</span><span class="mk-q"><button type="button" data-d="-1">−</button><b>0</b><button type="button" data-d="1">+</button><button type="button" data-d="5">+5</button></span>`;
    row.querySelectorAll('button').forEach(b=>b.onclick=()=>{CART[id]=Math.max(0,(CART[id]||0)+Number(b.dataset.d));row.querySelector('b').textContent=CART[id];mkTotal();});list.appendChild(row);}
  mkTotal();$('#market').hidden=false;}
function mkTotal(){let t=0;for(const id in CART)t+=CART[id]*PRICE[id];$('#mkTotal').textContent=won(t);$('#mkMoney').textContent=won(SAVE.money);$('#mkBuy').disabled=t<=0||t>SAVE.money;}
$('#mkBuy').addEventListener('click',()=>{let t=0;for(const id in CART)t+=CART[id]*PRICE[id];if(t>SAVE.money||t<=0)return;SAVE.money-=t;for(const id in CART)SAVE.stock[id]=(SAVE.stock[id]||0)+CART[id]*UNIT(id);if(G&&G.day)G.day.spend+=t;writeSave();AU.cash();openMarket();hudTick();});
$('#mkClose').addEventListener('click',()=>{$('#market').hidden=true;});

/* ---------- hints & hud ---------- */
function hintText(){const h=G.held;if(G.alarmOn)return['warn','삐— 삐— 연기 경보! 불을 줄이고 재료를 뒤집거나 팬을 들어 올려요.'];
  for(const c of G.cw){if(c.foam>.42)return['warn',`${c.name}에 거품이 차올라요! 찬물을 조금 붓거나 불을 줄이세요.`];if(c.smokeRate>2.5)return['warn',`${c.name}에서 연기가 나요. 바닥이 타고 있어요.`];
    const n=c.items.filter(o=>o.kind==='piece'&&o.face[o.down]>.85&&o.face[o.down]>o.face[1-o.down]).length;if(n>3)return['warn','보이지 않는 아랫면이 타기 직전이에요. 뒤집개로 젓거나 손잡이를 탁 쳐서 뒤집어요.'];
    for(const nd of c.noodles)if(c.liq&&nd.done<.35&&nd.stick>.7&&nd.T>60)return['warn','면이 서로 달라붙고 있어요! 긴 젓가락으로 저어 풀어 주세요.'];
    for(const j of c.jeons)if(j.fb[j.down]>1)return['warn','전 아랫면이 타기 직전! 뒤집개로 짧게 클릭해 뒤집어요.'];}
  if(h){const m={bottle:'팬·냄비 위에서 누르고 있으면 부어져요. 움직이며 부으면 넓게 둘러져요. 우클릭하면 제자리에.',powder:'반죽 볼 위에서 누르고 있으면 가루가 쏟아져요.',shaker:'누른 채로 좌우로 흔들어야 뿌려져요.',ing:'도마 위를 클릭해 내려놓아요.',rice:'달군 팬 위를 클릭하면 밥이 쏟아져요.',
    steamerItem:'냄비 위를 클릭해 찜기를 올려요.',mandu:'찜기·팬·접시·도마를 클릭하면 만두 6개를 놓아요.',custard:'그릇을 클릭해 계란찜을 옮겨 담아요.',egg:'팬: 톡 깨 넣기 · 냄비 가장자리: 깨 넣기 · 냄비 가운데: 껍질째 삶기 · 반죽 볼: 반죽에 섞기',noodle:'끓는 물(또는 팬)을 클릭해 면을 넣어요. 넣자마자 젓가락으로 저어야 안 붙어요.',packet:'냄비를 클릭해 스프를 넣어요.',ice:'그릇이나 체를 클릭하면 얼음이 들어가요.',nori:'그릇 가장자리를 클릭해 김을 세워요.',butter:'뜨거운 팬을 클릭해 버터를 넣어요.'};return['',m[h.kind]||''];}
  if(G.tool==='probe')return['','온도계: 재료나 냄비 위에 대면 온도가 보여요. 스테이크는 심부 온도를 재요.'];
  if(G.tool==='ladle')return['',G.ladle?'국자에 담았어요. 그릇·팬을 클릭해 부어요.':'국자: 냄비·편수냄비 국물, 반죽 볼 반죽, 팬의 버터·기름, 냄비 속 계란을 떠요.'];
  if(G.tool==='chop')return['','긴 젓가락: 냄비·그릇·반죽 볼 안을 누른 채 저어요. 면이 풀리고 양념이 비벼져요.'];
  if(G.tool==='knife')return['','클릭하면 한 번 썰려요. 마우스 휠로 칼 각도를 바꾸면 어슷썰기. 도마 모서리 ↺↻ 버튼(또는 E·R)으로 돌리기. 우클릭하면 칼을 내려놓아요.'];
  const o=selOrder();if(o){const R=RID[o.rid],i=R.steps.findIndex((s,k)=>!o.steps[k]);if(i>=0)return['',`${R.n} · ${R.steps[i][0]}`];return['',`${R.n} 완성! 오른쪽 아래 “서빙”을 눌러요.`];}
  if(G.mode==='career'&&G.day.t>=DAYLEN)return['','영업이 끝났어요. 마감 정산을 준비하고 있어요.'];return['','주문이 들어오면 오른쪽 위에 주문표가 걸려요.'];}
let lastHint='';
function hudTick(){if(!G)return;
  if(G.mode==='career'){const t=G.day.t,mins=11*60+Math.floor(Math.min(t,DAYLEN)/DAYLEN*600);$('#clock').textContent=`DAY ${G.day.n} · ${String(Math.floor(mins/60)).padStart(2,'0')}:${String(mins%60).padStart(2,'0')}${t>=DAYLEN?' 마감':''}`;$('#money').textContent=won(SAVE.money);$('#rep').innerHTML=stars(SAVE.rep*20);$('#btnMarket').hidden=false;}
  else{$('#clock').textContent='연습 모드';$('#money').textContent='재료 무제한';$('#rep').innerHTML='';$('#btnMarket').hidden=true;}
  checkSteps();tutTick();updateTicketBars();let [cls,txt]=hintText();if(TUT.on&&TUT.kind==='recipe'&&TUT.steps[TUT.i]&&cls!=='warn')txt=`가이드 ${TUT.i+1}. ${TUT.steps[TUT.i].t}`;if(txt!==lastHint){lastHint=txt;const el=$('#hint');el.textContent=txt;el.className=cls;}
  const o=selOrder(),R=o&&RID[o.rid];$('#serve').disabled=!o;$('#serve').innerHTML=o?`서빙 <small>#${String(o.id).padStart(3,'0')} ${R.n}</small>`:'서빙';$('#alarm').hidden=!G.alarmOn;$('#btnDrop').hidden=!(G.held||G.ladle);}

/* ---------- title, DLC, practice ---------- */
function renderTitle(){loadSave();skeamSync();$('#tlSave').innerHTML=`<span>DAY ${SAVE.day}</span><span>${won(SAVE.money)}</span><span class="stars">${stars(SAVE.rep*20)}</span><span>누적 서빙 ${SAVE.served}그릇</span><span title="${ACH.map(a=>(SAVE.ach[a[0]]?'✓ ':'· ')+a[1]+' — '+a[2]).join('&#10;')}">업적 ${ACH.filter(a=>SAVE.ach[a[0]]).length}/${ACH.length}</span>`;const m=SAVE.mid&&SAVE.mid.day===SAVE.day?SAVE.mid:null;$('#tlStart').innerHTML=m?`이어하기 <small>DAY ${SAVE.day} · ${String(11+Math.floor(m.t/DAYLEN*10)).padStart(2,'0')}:${String(Math.floor(m.t/DAYLEN*600)%60).padStart(2,'0')}</small>`:`영업 시작 <small>DAY ${SAVE.day}</small>`;}
function openDlc(){const box=$('#dlcList');box.innerHTML='';for(const k in DLC){const d=DLC[k],recs=REC.filter(r=>r.dlc===k),on=SAVE.dlc[k]!==false;const el=document.createElement('label');el.className='dlc'+(on?' on':'');
    el.innerHTML=`<input type="checkbox" id="dlc-${k}" ${on?'checked':''} ${k==='base'?'disabled':''}><div><b>${d.n}</b><span>${d.d}</span><em>${recs.map(r=>r.n).join(' · ')}</em></div><i>${k==='base'?'기본':on?'설치됨':'꺼짐'}</i>`;
    el.querySelector('input').onchange=e=>{SAVE.dlc[k]=e.target.checked;writeSave();openDlc();};box.appendChild(el);}$('#dlcPanel').hidden=false;}
function openPractice(){const box=$('#prList');box.innerHTML='';for(const k in DLC){if(SAVE.dlc[k]===false)continue;const h=document.createElement('h4');h.textContent=DLC[k].n;box.appendChild(h);const row=document.createElement('div');row.className='pr-row';
    for(const r of REC.filter(r=>r.dlc===k)){const b=document.createElement('button');b.type='button';b.className='pr';b.innerHTML=`${typeof RIMG!=='undefined'&&RIMG[r.id]?`<img class="pr-img" alt="" src="${RIMG[r.id]}">`:''}<b>${r.n}</b><span>${r.sub}</span><em>${SAVE.best[r.id]?`<span class="stars">${stars(SAVE.best[r.id])}</span> 최고 ${SAVE.best[r.id]}점`:'도전 전'}${unlocked(r)?'':` · 영업 DAY ${UNLOCK[r.id]} 메뉴`}</em>`;b.onclick=()=>{AU.init();startPractice(r.id,$('#prGuide').checked);};row.appendChild(b);}box.appendChild(row);}
  hideAll();$('#practice').hidden=false;}
$('#tlStart').addEventListener('click',()=>{AU.init();startCareer();});$('#tlTour').addEventListener('click',()=>{AU.init();tourStart();});$('#menuTour').addEventListener('click',()=>{$('#menu').hidden=true;tourStart();});$('#menuGuide').addEventListener('click',()=>{$('#menu').hidden=true;G.paused=false;const o=selOrder();if(o)tutStart(o.rid);});$('#tlPractice').addEventListener('click',()=>{AU.init();openPractice();});$('#tlDlc').addEventListener('click',openDlc);
$('#dlcClose').addEventListener('click',()=>{$('#dlcPanel').hidden=true;renderTitle();});$('#prBack').addEventListener('click',()=>toTitle());
let resetArm=0;$('#tlReset').addEventListener('click',e=>{const b=e.currentTarget;if(performance.now()-resetArm<2500){try{localStorage.removeItem('sizzle-kitchen-v2');}catch(_){}SAVE=null;loadSave();renderTitle();b.textContent='새 게임';resetArm=0;}else{resetArm=performance.now();b.textContent='한 번 더 누르면 초기화';setTimeout(()=>b.textContent='새 게임',2500);}});
$('#btnRecipe').addEventListener('click',()=>{const p=$('#recipePop');p.hidden=!p.hidden;renderSteps();});
$('#btnMarket').addEventListener('click',()=>openMarket());const muteLbl=()=>{$('#btnMute').firstChild.textContent=AU.muted?'소리 켜기':'소리 끄기';};muteLbl();$('#btnMute').addEventListener('click',()=>{AU.setMute(!AU.muted);muteLbl();});addEventListener('keydown',e=>{if(e.code==='KeyM'){AU.setMute(!AU.muted);muteLbl();}});$('#btnRot').addEventListener('click',()=>rotateBoard());$('#btnDrop').addEventListener('click',()=>{returnHeld();G.ladle=null;});$('#btnFridge').addEventListener('click',()=>openFridge());
function setPause(on){if(!G||!G.started)return;if(!$('#menu').hidden||!$('#result').hidden||(typeof PL!=='undefined'&&PL.on))return;G.paused=on;$('#pauseOv').hidden=!on;if(on)midSave&&G.mode==='career'&&midSave();}
$('#btnPause').addEventListener('click',()=>setPause(!G.paused));$('#pauseOv').addEventListener('click',()=>setPause(false));
addEventListener('keydown',e=>{if(e.code==='KeyP'&&G&&G.started&&!e.repeat){if(!$('#pauseOv').hidden)setPause(false);else if(!G.paused)setPause(true);}});
$('#btnMenu').addEventListener('click',()=>{G.paused=true;$('#menuEnd').textContent=G.mode==='career'?'오늘 영업 마감하기':'연습 끝내기';$('#menu').hidden=false;});
$('#menuResume').addEventListener('click',()=>{$('#menu').hidden=true;G.paused=false;});
$('#menuEnd').addEventListener('click',()=>{$('#menu').hidden=true;G.paused=false;if(G.mode==='career'){G.orders=[];G.day.t=DAYLEN;G.dayEnded=true;endDay();}else toTitle();});
$('#serve').addEventListener('click',()=>{AU.init();serve();});
$('#rpClose').addEventListener('click',()=>{$('#recipePop').hidden=true;});
