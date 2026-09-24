
/* ---------- meta: unlocks · specials · requests · freshness · upgrades · achievements · mid-day save ---------- */
let UPG={};
const UNLOCK={kfr:1,efr:1,ramyeon:1,kjeon:2,janchi:2,pajeon:3,bibim:3,udon:3,kmari:4,buchu:4,yaki:4,shoyu:5,steak:5,aglio:5,pomo:5};
const unlocked=r=>SAVE.day>=(UNLOCK[r.id]||1);
function menuPool(){const on=REC.filter(r=>SAVE.dlc[r.dlc]!==false),p=on.filter(unlocked);return p.length?p:on;}
const SPECIAL_MUL=1.3;
function orderPrice(o){return Math.round(RID[o.rid].price*(o.special?SPECIAL_MUL:1)/100)*100;}
function pickSpecial(){const p=menuPool();return p.length?pick(p).id:null;}

/* customer requests */
const vPieces=v=>[...v.items.filter(o=>o.kind==='piece'),...v.jeons.flatMap(j=>j.lens||[])];
const gv=(v,k)=>(v.garn&&v.garn[k])||0;
const REQS={
  noscal:{t:'파 빼주세요',for:['janchi','ramyeon','udon','shoyu'],ok:v=>!vPieces(v).some(o=>o.type==='scallion'||o.type==='jjokpa'),good:'요청대로 파를 뺐어요.',bad:'파 빼달라고 했는데 파가 들어 있어요!'},
  sesame:{t:'깨 듬뿍',for:['kfr','efr','kmari','bibim'],ok:v=>gv(v,'sesame')>=1,good:'깨를 듬뿍 뿌려 고소해요.',bad:'깨 듬뿍 부탁했는데 조금밖에 없어요.'},
  sweet:{t:'새콤달콤하게',for:['bibim','kmari'],ok:v=>(v.flav.sweet||0)>=1.2&&(v.flav.sour||0)>=4,good:'설탕·식초로 새콤달콤하게 맞췄어요!',bad:'새콤달콤하게 해달랬는데 밋밋해요. (설탕 + 식초)'},
  pepper:{t:'후추 넉넉히',for:['steak'],ok:v=>gv(v,'pepper')>=.35,good:'후추를 넉넉히 갈아 향이 좋아요.',bad:'후추 넉넉히 부탁했는데 부족해요.'},
  cheese:{t:'치즈 듬뿍',for:['aglio','pomo'],ok:v=>gv(v,'parm')>=.9,good:'파마산 치즈가 듬뿍!',bad:'치즈 듬뿍 부탁했는데 조금이에요.'},
  nochili:{t:'안 맵게',for:['aglio'],ok:v=>gv(v,'chili')<=0,good:'요청대로 맵지 않게 만들었어요.',bad:'안 맵게 해달랬는데 고춧가루가 보여요.'},
  noao:{t:'아오노리 빼주세요',for:['yaki'],ok:v=>gv(v,'aonori')<=0,good:'요청대로 아오노리를 뺐어요.',bad:'아오노리 빼달라고 했는데…'},
};
function pickReq(R){const c=Object.keys(REQS).filter(k=>REQS[k].for.includes(R.id));return c.length&&Math.random()<.38?pick(c):null;}

/* freshness (FIFO lots per fridge ingredient) */
const SHELF={kimchi:30,onion:8,ham:20,scallion:5,jjokpa:5,buchu:4,zucchini:5,carrot:8,cucumber:5,cabbage:6,pork:4,chashu:5,naruto:6,squid:3,garlic:10,beef:5};
const tracked=id=>SHELF[id]!==undefined;
function syncLots(){SAVE.lots=SAVE.lots||{};for(const id in SHELF){const L2=SAVE.lots[id]=SAVE.lots[id]||[],st=Math.max(0,Math.round(SAVE.stock[id]||0));let sum=L2.reduce((s,l)=>s+l.n,0);
    if(sum<st)L2.push({d:SAVE.day,n:st-sum});while(sum>st&&L2.length){const x=Math.min(L2[0].n,sum-st);L2[0].n-=x;sum-=x;if(L2[0].n<=0)L2.shift();}}}
function oldestAge(id){const L2=SAVE.lots&&SAVE.lots[id];return L2&&L2.length?SAVE.day-L2[0].d:null;}
function takeLot(id){syncLots();const L2=SAVE.lots[id];if(!L2||!L2.length)return SAVE.day;const d=L2[0].d;L2[0].n--;if(L2[0].n<=0)L2.shift();return d;}
function putLot(id,d){SAVE.lots=SAVE.lots||{};const L2=SAVE.lots[id]=SAVE.lots[id]||[];if(L2.length&&L2[0].d===d)L2[0].n++;else L2.unshift({d,n:1});}
function spoilLots(){syncLots();const out=[];for(const id in SHELF){const L2=SAVE.lots[id];let n=0;while(L2.length&&SAVE.day-L2[0].d>SHELF[id]+2){n+=L2[0].n;L2.shift();}if(n){SAVE.stock[id]=Math.max(0,(SAVE.stock[id]||0)-n);out.push([id,n]);}}return out;}
function freshTag(id){if(!tracked(id)||G.mode==='practice')return'';const a=oldestAge(id);if(a===null||!(G.stock[id]>0))return'';const sh=SHELF[id];
  return a>sh?`<i class="fr-f bad">시들었어요 D+${a}</i>`:a===sh?`<i class="fr-f warn">오늘까지</i>`:a===0?`<i class="fr-f ok">오늘 입고</i>`:`<i class="fr-f">D+${a}</i>`;}

/* extras applied to a served dish */
function applyExtras(o,v,res){const R=RID[o.rid];
  if(o.req){const q=REQS[o.req];if(q.ok(v)){if(res.total>=35)res.total=Math.min(100,res.total+6);res.notes.unshift({t:'good',s:q.good});if(G.mode==='career'){SAVE.reqOk=(SAVE.reqOk||0)+1;}}else{res.total=Math.max(0,res.total-8);res.notes.unshift({t:'meh',s:q.bad});}}
  const ps=vPieces(v),tm=ps.reduce((s,p)=>s+(p.mass||1),0),sm=ps.filter(p=>p.stale).reduce((s,p)=>s+(p.mass||1),0);
  if(sm>0&&tm>0){const pen=Math.round(4+sm/tm*16);res.total=Math.max(0,res.total-pen);res.notes.unshift({t:'bad',s:'신선하지 않은 재료 맛이 나요. 냉장고 재고 날짜를 확인하세요.'});}}

/* upgrades */
const UPGS=[['burner','고화력 버너','모든 화구 화력 +20%. 물이 빨리 끓어요.',40000],['nonstick','코팅 프라이팬','기름이 적어도 덜 눌어붙고, 타는 속도가 느려져요.',25000],['fan','업소용 후드','연기가 금방 빠져서 경보가 잘 안 울려요.',30000],['knife','장인 식칼','칼질이 더 빠르고 손떨림이 적어요.',20000]];
function renderUpgrades(list){const h=document.createElement('div');h.className='up-box';h.innerHTML='<h4>주방 업그레이드 <small>한 번 사면 계속 적용돼요</small></h4>';
  for(const [id,n,d,price] of UPGS){const own=!!SAVE.up[id],row=document.createElement('div');row.className='up-row'+(own?' own':'');
    row.innerHTML=`<b>${n}</b><span>${d}</span><em>${own?'보유 중':won(price)}</em><button type="button" ${own||SAVE.money<price?'disabled':''}>${own?'✓':'구매'}</button>`;
    row.querySelector('button').onclick=()=>{if(own||SAVE.money<price)return;SAVE.money-=price;SAVE.up[id]=true;if(G&&G.day)G.day.spend+=price;if(id==='burner'&&G)for(const b of G.burners)b.P=BURN[b.i].P*1.2;writeSave();AU.cash();toast('🔧',`${n} 설치 완료!`,d);openMarket();hudTick();};h.appendChild(row);}
  list.appendChild(h);}

/* achievements & toasts */
const ACH=[['first','첫 손님','첫 요리를 서빙했어요'],['s90','셰프의 한 접시','90점 이상 받기'],['combo5','단골 제조기','5연속 호평'],['srv50','바쁜 주방','누적 50그릇 서빙'],['req5','세심한 사장님','손님 요청 5번 들어주기'],['all','메뉴 마스터','모든 메뉴(DLC 포함) 70점 이상'],['rich','부자 사장님','잔고 200,000원 달성'],['day7','일주일 개근','DAY 7 도달'],['plate100','사진 찍고 싶은 한 그릇','테두리까지 깨끗한 그릇으로 90점 이상'],['steakmr','완벽한 굽기','주문한 굽기에 딱 맞춘 스테이크'],['day1','첫 영업 마감','첫 영업일을 마감하기'],['fry90','튀김 장인','튀김 팩 요리로 90점 이상'],['steam90','찜의 달인','찜 팩 요리로 90점 이상']];
// SKEAM platform achievement ids (see skeam/games/sizzle-kitchen/game.yml)
const SKEAM_ID={first:'first_serve',s90:'chef_90',combo5:'combo_5',srv50:'serve_50',req5:'request_5',all:'menu_master',rich:'rich_200k',day7:'day_7',plate100:'perfect_plating',steakmr:'perfect_doneness',day1:'first_day_closed',fry90:'fry_master',steam90:'steam_master'};
function skeamUnlock(k){try{if(window.SKEAM&&SKEAM.unlock&&SKEAM_ID[k])SKEAM.unlock(SKEAM_ID[k]);}catch(e){}}
let skeamSynced=false;function skeamSync(){if(skeamSynced||!SAVE||!SAVE.ach)return;skeamSynced=true;for(const k in SAVE.ach)skeamUnlock(k);}
function toast(ic,t,s,cls){let box=$('#toasts');if(!box){box=document.createElement('div');box.id='toasts';$('#served').parentNode.appendChild(box);}
  const d=document.createElement('div');d.className='toast '+(cls||'');d.innerHTML=`<i>${ic}</i><div><b>${t}</b>${s?`<span>${s}</span>`:''}</div>`;box.appendChild(d);const lg=/long/.test(cls||'');setTimeout(()=>d.classList.add('out'),lg?6500:4200);setTimeout(()=>d.remove(),lg?7000:4700);}
function checkAch(lastScore,x){x=x||{};SAVE.ach=SAVE.ach||{};const A=SAVE.ach,got=[];const on=(k,c)=>{if(!A[k]&&c){A[k]=SAVE.day;got.push(k);}};
  on('plate100',x.plating>=100&&lastScore>=90);on('fry90',x.dlc==='fry'&&lastScore>=90);on('steam90',x.dlc==='steam'&&lastScore>=90);on('steakmr',!!x.steak);on('day1',SAVE.day>=2);
  on('first',SAVE.served>=1);on('s90',lastScore>=90);on('combo5',G&&G.combo>=5);on('srv50',SAVE.served>=50);on('req5',(SAVE.reqOk||0)>=5);on('all',REC.every(r=>(SAVE.best[r.id]||0)>=70));on('rich',SAVE.money>=200000);on('day7',SAVE.day>=7);
  if(got.length){writeSave();for(const k of got){const a=ACH.find(x=>x[0]===k);skeamUnlock(k);toast('🏆','업적 달성 · '+a[1],a[2],'ach');}if(AU.ding)AU.ding();}}
function dayBanner(resumed){const n=SAVE.day,news=REC.filter(r=>SAVE.dlc[r.dlc]!==false&&(UNLOCK[r.id]||1)===n&&n>1);
  if(resumed)toast('↺',`DAY ${n} 이어서 영업`,'조리 중이던 음식은 정리해 두었어요.','long');
  if(news.length&&!resumed)toast('🍽️','새 메뉴 해금!',news.map(r=>r.n).join(' · '),'long');
  {const ni=newlyOpenIngs();if(ni.length&&!resumed)toast('🥬','새 재료 입고',ni.slice(0,6).join(' · ')+(ni.length>6?' 외':''),'long');}
  if(G.day.special){const R=RID[G.day.special];toast('★',`오늘의 특선: ${R.n}`,`주문이 더 자주 들어오고 가격 +30%`,'long');}}

/* mid-day save */
function midSave(){if(!G||G.mode!=='career'||!G.started||G.dayEnded||!G.day)return;const D=G.day;
  SAVE.mid={day:SAVE.day,t:D.t,rev:D.rev,tips:D.tips,spend:D.spend,served:D.served,fail:D.fail,scores:D.scores,special:D.special,gas:G.gas,combo:G.combo,closeCap:!!G.closeCap,
    orders:G.orders.map(o=>({rid:o.rid,left:o.left,pat:o.pat,opt:o.opt,name:o.name,table:o.table,special:o.special,req:o.req,cust:o.cust,pref:o.pref,critic:o.critic}))};writeSave();}
addEventListener('visibilitychange',()=>{if(document.hidden)midSave();});addEventListener('pagehide',midSave);
