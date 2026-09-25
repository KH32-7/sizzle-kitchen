
/* ---------- 1.3: guests · regulars · shop level · interior · daily goals ---------- */
const GUEST={
  kim:{n:'김 대리',img:'c0',reg:1,from:1,fav:['kfr','ramyeon','bibim','kjeon','squidfry','kmari'],pref:'spicy',
    intro:'길 건너 회사에 다니는 직장인. 점심시간마다 뛰어와요.',hi:'“이 맛에 야근합니다!”',lo:'“오늘은 좀… 바빠서 그러셨죠?”',
    lines:['“사장님, 저 기억하시죠? 매일 오잖아요.”','“팀 사람들한테 여기 소개했어요!”','“회식 장소는 무조건 여기예요.”','“제 자리는 창가 쪽 3번이죠?”','“저 승진했어요! 사장님 덕분이에요.”'],
    gift:[{money:5000,t:'잔돈은 됐대요'},{rep:.2,t:'회사 단톡방에 가게를 소개했어요'},{money:15000,t:'팀 회식 예약금을 미리 줬어요'},{rep:.3,t:'“매운맛 성지” 리뷰를 올렸어요'},{money:30000,t:'승진 턱을 가게에서 쐈어요'}]},
  jung:{n:'정 할머니',img:'c1',reg:1,from:2,fav:['janchi','udon','jjim','pajeon','mandu','efr','kmari'],pref:'mild',
    intro:'시장 골목에서 40년째 사신 할머니. 짠 건 질색이에요.',hi:'“아이고, 우리 손주 해 준 것보다 맛있네.”',lo:'“간이 좀 세구먼… 다음엔 싱겁게 해 줘.”',
    lines:['“젊은 사장이 손이 야무지네.”','“내가 담근 김치 좀 가져왔어.”','“동네 노인정에 소문 다 냈어.”','“우리 영감이랑 같이 올게.”','“이 집은 내가 지켜야지. 오래오래 해.”'],
    gift:[{stock:{kimchi:4},t:'직접 담근 김치를 가져왔어요'},{rep:.2,t:'노인정에 소문을 냈어요'},{stock:{scallion:4,onion:4},t:'텃밭 채소를 한 보따리 줬어요'},{rep:.3,t:'동네 어르신들이 단체로 와요'},{money:20000,t:'“장사 잘돼라” 복돈을 줬어요'}]},
  choi:{n:'최 학생',img:'c2',reg:1,from:3,fav:['kfr','efr','ramyeon','yaki','bibim','udon','janchi','shoyu'],pref:'big',
    intro:'근처 고등학교 3학년. 늘 배가 고파요.',hi:'“와 대박… 여기 진짜 맛집이다!”',lo:'“음… 편의점 갈 걸 그랬나.”',
    lines:['“사장님 곱빼기 최고예요!”','“친구들 데려왔어요!”','“모의고사 끝나고 제일 먼저 왔어요.”','“여기 SNS에 올렸는데 좋아요 300개!”','“수능 끝나면 여기서 알바하고 싶어요.”'],
    gift:[{rep:.1,t:'친구들한테 가게를 자랑했어요'},{money:8000,t:'용돈을 모아 친구들 밥을 샀어요'},{rep:.25,t:'SNS에 가게 사진을 올렸어요'},{money:12000,t:'반 친구들이 단체로 왔어요'},{rep:.35,t:'학교 맛집 지도 1위가 됐어요'}]},
  yoon:{n:'윤 작가',img:'c3',reg:1,from:4,fav:['shoyu','aglio','pomo','steak','udon','yachae','katsu','buchu','jjim'],pref:'pretty',
    intro:'푸드 에세이를 쓰는 작가. 지저분한 그릇은 못 참아요.',hi:'“이 한 그릇, 다음 에세이에 꼭 쓸게요.”',lo:'“맛은 있는데… 사진이 안 나오네요.”',
    lines:['“오늘 빛이 좋아서 사진이 잘 나와요.”','“연재 칼럼에 가게를 살짝 넣었어요.”','“출판사 편집자님도 모시고 왔어요.”','“책 표지에 이 가게 요리를 쓰고 싶어요.”','“신간이 나왔어요. 이 가게 이야기가 한 챕터예요.”'],
    gift:[{rep:.15,t:'블로그에 사진을 올렸어요'},{money:10000,t:'원고료 기념으로 한턱 냈어요'},{rep:.3,t:'칼럼에 가게가 실렸어요'},{money:20000,t:'출판사 회식을 예약했어요'},{rep:.4,t:'신간에 가게 이야기가 실렸어요'}]},
  seo:{n:'서 학생',img:'c4'},kang:{n:'강 기사님',img:'c5'},jo:{n:'조 반장님',img:'c6'},han:{n:'한 선생님',img:'c7'},
  bae:{n:'배 교수님',img:'c8'},moon:{n:'문 라이더',img:'c9'},oh:{n:'오 팀장님',img:'c10'},
  critic:{n:'미식가 노 선생',img:'c11',critic:1,hi:'“…이 가게, 제 리뷰에 별 다섯 개입니다.”',lo:'“기대 이하군요. 리뷰는 솔직하게 쓰겠습니다.”'},
};
const GEN=['seo','kang','jo','han','bae','moon','oh'];
const aiOn=()=>SET.ai!==false;
const gImg=(id,m)=>{const g=GUEST[id];if(!g)return'';return aiOn()?GIMG[g.img]:AVA[g.img+(m||'h')];};
const moodK=f=>f>.5?'h':f>.25?'n':'a',scoreK=s=>s>=75?'h':s>=55?'n':'a';
const PREF={
  spicy:{t:'고춧가루 팍팍',need:['chili'],ok:v=>gv(v,'chili')>=.5,good:'고춧가루를 팍팍! 김 대리 입맛에 딱이에요.',bad:'“오늘은 좀 안 맵네요…” 고춧가루를 더 뿌려 주세요.'},
  mild:{t:'싱겁게',ok:(v,res)=>!res.notes.some(n=>/짜/.test(n.s)),good:'할머니 입맛대로 싱겁게 맞췄어요.',bad:'“아이고 짜다…” 할머니는 싱거운 걸 좋아해요.'},
  big:{t:'곱빼기 (+30%)',ok:v=>v.items.filter(o=>o.kind==='grain').length>=720||v.noodles.reduce((s,n)=>s+(n.g||0),0)>=1.6*((NT[(v.noodles[0]||{}).type]||{}).g||1e9),good:'곱빼기로 푸짐하게! 값도 30% 더 받았어요.',bad:'“곱빼기 시켰는데 양이 그대로예요…” 밥이나 면을 두 번 넣어 주세요.'},
  pretty:{t:'테두리 깨끗하게',ok:(v,res)=>!!res.clean,good:'테두리까지 깔끔해서 사진이 잘 나와요!',bad:'“테두리에 국물이… 사진이 안 나오네요.” 행주로 닦아 주세요.'},
};
function regOf(id){SAVE.reg=SAVE.reg||{};return SAVE.reg[id]=SAVE.reg[id]||{aff:0,visits:0};}
const hearts=id=>Math.floor(regOf(id).aff/20);
const heartStr=n=>'♥'.repeat(n)+'♡'.repeat(5-n);

/* shop level */
const SHOPLV=[[0,'포장마차'],[60,'골목 식당'],[160,'동네 맛집'],[320,'입소문 맛집'],[520,'줄 서는 집'],[780,'방송 탄 집'],[1100,'미식가의 단골집'],[1500,'셰프의 식당'],[2000,'전설의 주방'],[2600,'지글지글 본점']];
const LVUP={2:'정리 알바 · 인테리어 추가',3:'좌석 3개 · 메뉴판 4칸 · 평론가 방문 · 분식천국 테마',4:'주방 보조 · 창가 자리 증축',5:'메뉴판 5칸 · 이자카야 테마',6:'좌석 4개 · 비스트로 테마',7:'메뉴판 6칸 · 안쪽 자리 증축'};
function shopInit(){if(!SAVE)return;if(!SAVE.shop)SAVE.shop={xp:Math.min(900,(SAVE.served||0)*6),own:{},eq:{}};}
function shopLv(){shopInit();let l=1;SHOPLV.forEach((s,i)=>{if(SAVE.shop.xp>=s[0])l=i+1;});return l;}
const PACE={relax:{n:'여유롭게',mul:1.4,cap:3},normal:{n:'보통',mul:1.1,cap:3},busy:{n:'바쁘게',mul:.85,cap:4}};
const paceOf=()=>PACE[(typeof SET!=='undefined'&&SET.pace)||'relax']||PACE.relax;
function seats(){const l=shopLv();return Math.min(paceOf().cap,l>=6?4:l>=3?3:2);}
function addXP(n){const a=shopLv();SAVE.shop.xp+=Math.max(0,Math.round(n));const b=shopLv();if(b>a){toast('🏮',`가게 등급 UP! Lv${b} ${SHOPLV[b-1][1]}`,LVUP[b]||'가게가 점점 유명해져요','long ach');AU.ding&&AU.ding();}}
function xpBar(){const l=shopLv(),a=SHOPLV[l-1][0],b=SHOPLV[l]?SHOPLV[l][0]:a;return{l,n:SHOPLV[l-1][1],f:b>a?clamp((SAVE.shop.xp-a)/(b-a),0,1):1,need:b>a?b-SAVE.shop.xp:0};}

/* interior */
const DECO=[
  {id:'oak',slot:'pass',n:'오크 서빙대',d:'밝은 원목 서빙대',b:'팁 +5%',lv:2,price:15000,tip:.05},
  {id:'mint',slot:'pass',n:'민트 타일 서빙대',d:'레트로 타일 서빙대',b:'팁 +8%',lv:4,price:28000,tip:.08},
  {id:'walnut',slot:'shelf',n:'월넛 선반',d:'짙은 월넛 벽 선반',b:'손님 인내심 +5%',lv:2,price:12000,pat:.05},
  {id:'birch',slot:'shelf',n:'자작나무 선반',d:'밝은 자작나무 선반',b:'손님 인내심 +8%',lv:5,price:24000,pat:.08},
  {id:'marble',slot:'counter',n:'대리석 조리대',d:'하얀 대리석 조리대',b:'요리 값 +3%',lv:3,price:30000,pmul:.03},
  {id:'terrazzo',slot:'counter',n:'테라조 조리대',d:'알록달록 테라조',b:'요리 값 +5%',lv:6,price:45000,pmul:.05},
  {id:'lamp',slot:'light',n:'펜던트 조명',d:'서빙대 위 따뜻한 조명',b:'단골 호감도 +20%',lv:3,price:18000,aff:.2},
  {id:'plant',slot:'green',n:'몬스테라 화분',d:'조리대 구석 초록 화분',b:'손님 인내심 +5%',lv:2,price:9000,pat:.05},
];
const SLOTN={pass:'서빙대',shelf:'벽 선반',counter:'조리대',light:'조명',green:'화분'};
const decoEq=()=>(SAVE&&SAVE.shop&&SAVE.shop.eq)||{};
const decoOn=id=>{const d=DECO.find(x=>x.id===id);return !!d&&decoEq()[d.slot]===id;};
function decoBonus(k){let s=0;for(const d of DECO)if(decoOn(d.id)&&d[k])s+=d[k];return s;}
let decoSig='';
function decoRefresh(){const s=JSON.stringify(decoEq());if(s!==decoSig){decoSig=s;if(typeof buildStatic==='function')try{buildStatic();}catch(e){}}}
function decoCounter(){return decoOn('marble')?'#eceae5':decoOn('terrazzo')?'#e3d8c8':'#d5cfc3';}
function decoPass(){return decoOn('oak')?['#9a7048','#86603c']:decoOn('mint')?['#7fb3a6','#6fa396']:['#3a2b22','#2e231c'];}
function decoShelf(){return decoOn('walnut')?['#3a2418','#4a2e1e']:decoOn('birch')?['#b08a60','#c39c70']:['#4a3122','#5d4030'];}
function decoCounterFx(g,R){
  if(decoOn('marble')){g.lineCap='round';for(let i=0;i<22;i++){g.strokeStyle=`rgba(120,120,130,${.08+R()*.12})`;g.lineWidth=.6+R()*1.8;g.beginPath();let x=R()*W,y=R()*H;g.moveTo(x,y);for(let k=0;k<7;k++){x+=(R()-.35)*160;y+=(R()-.5)*120;g.lineTo(x,y);}g.stroke();}}
  if(decoOn('terrazzo')){const C=['#c9573a','#e2a13a','#6f9a7a','#4d6f8f','#f4f1ea','#8a6a52'];for(let i=0;i<1400;i++){g.fillStyle=C[(R()*C.length)|0];g.globalAlpha=.55+R()*.4;g.save();g.translate(R()*W,R()*H);g.rotate(R()*TAU);const s=2+R()*7;g.beginPath();g.moveTo(-s,-s*.5);g.lineTo(s*.8,-s*.7);g.lineTo(s,s*.6);g.lineTo(-s*.6,s*.8);g.closePath();g.fill();g.restore();}g.globalAlpha=1;}}
function decoPassFx(g){if(!decoOn('mint'))return;g.strokeStyle='rgba(255,255,255,.28)';g.lineWidth=2;for(let y=44;y<H;y+=44){g.beginPath();g.moveTo(1248,y);g.lineTo(1600,y);g.stroke();}for(let x=1248;x<1600;x+=44){g.beginPath();g.moveTo(x,44);g.lineTo(x,H);g.stroke();}}
function decoTop(g){
  if(decoOn('lamp')){const gr=g.createRadialGradient(1422,300,20,1422,420,520);gr.addColorStop(0,'rgba(255,196,110,.22)');gr.addColorStop(1,'rgba(255,196,110,0)');g.fillStyle=gr;g.fillRect(1244,44,356,H-44);
    for(const x of [1330,1514]){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x+4,82,22,9,0,0,TAU);g.fill();const lg=g.createRadialGradient(x-6,72,2,x,76,24);lg.addColorStop(0,'#fff3cf');lg.addColorStop(.35,'#f0b85a');lg.addColorStop(1,'#8a5a24');g.fillStyle=lg;g.beginPath();g.arc(x,76,20,0,TAU);g.fill();}}
  if(decoOn('plant')){const px=300,py=958;g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.arc(px+6,py+8,34,0,TAU);g.fill();g.fillStyle='#b8643c';g.beginPath();g.arc(px,py,32,0,TAU);g.fill();g.fillStyle='#5a3a24';g.beginPath();g.arc(px,py,26,0,TAU);g.fill();
    const R=mulberry(33);for(let i=0;i<9;i++){const a=i/9*TAU+R()*.4,l=40+R()*26;g.save();g.translate(px+Math.cos(a)*10,py+Math.sin(a)*10);g.rotate(a);g.fillStyle=i%2?'#3f7a44':'#4f9152';g.beginPath();g.ellipse(l*.55,0,l*.55,l*.3,0,0,TAU);g.fill();g.strokeStyle='rgba(20,50,20,.5)';g.lineWidth=1.4;g.beginPath();g.moveTo(4,0);g.lineTo(l,0);g.stroke();
      g.fillStyle=decoCounter();for(let k=1;k<4;k++){g.beginPath();g.ellipse(l*.25*k,l*.18*(k%2?1:-1),3,1.5,0,0,TAU);g.fill();}g.restore();}}}
function drawBGDeco(g){try{decoTop(g);}catch(e){}}

/* daily goals */
const GOALS={
  serve:{t:n=>`요리 ${n}그릇 서빙하기`,n:l=>3+Math.min(6,l),v:()=>G.day.served},
  s90:{t:()=>'90점 이상 받기',n:()=>1,v:()=>G.day.scores.filter(s=>s>=90).length},
  s80:{t:n=>`80점 이상 ${n}번 받기`,n:l=>1+Math.min(3,Math.floor(l/2)),v:()=>G.day.scores.filter(s=>s>=80).length},
  req:{t:n=>`손님 요청 ${n}번 들어주기`,n:()=>2,v:()=>GP().req||0},
  reg:{t:()=>'단골 손님 만족시키기 (70점+)',n:()=>1,v:()=>GP().reg||0},
  rev:{t:n=>`매출 ${won(n)} 올리기`,n:l=>25000+l*7000,v:()=>G.day.rev+G.day.tips},
  combo:{t:n=>`${n}연속 호평 받기`,n:()=>3,v:()=>GP().combo||0},
  sp:{t:n=>`오늘의 특선 ${n}번 서빙하기`,n:()=>2,v:()=>GP().sp||0},
  nomiss:{t:()=>'놓친 주문 없이 마감하기',n:()=>1,v:()=>G.dayEnded&&!G.day.fail?1:0,final:1},
};
const GP=()=>(SAVE.goals&&SAVE.goals.p)||{};
function goalsFor(day){if(SAVE.goals&&SAVE.goals.day===day)return SAVE.goals;const l=shopLv();let keys;
  if(day===1)keys=['serve','s80','reg'];else{const R=mulberry(day*97+13),pool=['serve','s90','s80','req','reg','rev','combo','sp','nomiss'];keys=[];while(keys.length<3){const k=pool[(R()*pool.length)|0];if(!keys.includes(k))keys.push(k);}}
  SAVE.goals={day,p:{req:0,reg:0,combo:0,sp:0},list:keys.map(k=>({k,n:GOALS[k].n(l),done:false}))};return SAVE.goals;}
const goalReward=()=>3000+shopLv()*700;
function goalsCheck(final){if(!G||G.mode!=='career'||!G.day||!SAVE.goals||SAVE.goals.day!==G.day.n)return;let ch=false;
  for(const q of SAVE.goals.list){if(q.done)continue;const D=GOALS[q.k];if(D.final&&!final)continue;let v=0;try{v=D.v();}catch(e){}if(v>=q.n){q.done=true;ch=true;const m=goalReward();SAVE.money+=m;addXP(20);toast('🎯','오늘의 목표 달성!',`${D.t(q.n)} · +${won(m)}`,'ach');AU.ding&&AU.ding();}}
  if(ch){writeSave();renderGoals();}}
function renderGoals(){let box=$('#goals');if(!box){box=document.createElement('div');box.id='goals';$('#stage').appendChild(box);}
  const on=G&&G.started&&G.mode==='career'&&SAVE.goals&&G.day&&SAVE.goals.day===G.day.n;box.hidden=!on;if(!on)return;
  box.innerHTML=`<b>오늘의 목표 <small>${SAVE.goals.list.filter(q=>q.done).length}/3</small></b>`+SAVE.goals.list.map(q=>{const D=GOALS[q.k];let v=0;try{v=Math.min(q.n,D.v());}catch(e){}
    return`<div class="gl${q.done?' done':''}"><i>${q.done?'✓':''}</i><span>${D.t(q.n)}</span><em>${q.done?'완료':D.final?'마감 때':q.k==='rev'?Math.round(v/q.n*100)+'%':v+'/'+q.n}</em></div>`;}).join('');}

/* who orders */
function assignGuest(o){if(G.mode!=='career')return;const pool=menuPool().map(r=>r.id),day=SAVE.day,P=GP();P.seen=P.seen||{};
  const busy=new Set(G.orders.map(q=>q.cust));
  if(o.critic){o.cust='critic';}
  else{const regs=Object.keys(GUEST).filter(k=>{const g=GUEST[k];return g.reg&&day>=g.from&&!busy.has(k)&&(P.seen[k]||0)<2&&g.fav.some(f=>pool.includes(f));});
    if(regs.length&&Math.random()<.34){const k=pick(regs),g=GUEST[k];o.cust=k;P.seen[k]=(P.seen[k]||0)+1;o.rid=pick(g.fav.filter(f=>pool.includes(f)));o.special=!!(G.day.special===o.rid);o.opt=RID[o.rid].opts?pick(RID[o.rid].opts):null;
      const pf=PREF[g.pref];if(pf&&(!pf.need||pf.need.every(i=>ingOpen(i)))&&Math.random()<.75){o.pref=g.pref;o.req=null;}else o.req=pickReq(RID[o.rid]);}
    else{const free=GEN.filter(k=>!busy.has(k));o.cust=pick(free.length?free:GEN);}}
  o.name=GUEST[o.cust].n;const R=RID[o.rid];o.pat=o.left=(R.time*1.9+70)*1.35*(1+decoBonus('pat'))*(o.critic?.9:1);}
function guestApply(o,v,res){o._prefOk=undefined;o._reqOk=!!(o.req&&REQS[o.req]&&REQS[o.req].ok(v));if(G.mode!=='career')return;
  if(o.pref){const P=PREF[o.pref];let ok=false;try{ok=P.ok(v,res);}catch(e){}o._prefOk=ok;
    if(ok){res.total=Math.min(100,res.total+6+(o.pref==='mild'&&res.notes.some(n=>/싱거/.test(n.s))?6:0));res.notes.unshift({t:'good',s:P.good});if(o.pref==='big')o.payMul=1.3;}
    else{res.total=Math.max(0,res.total-5);res.notes.unshift({t:'meh',s:P.bad});}}
  if(o.critic)o.payMul=res.total>=85?2:1;}
function guestTip(o,tip){const g=GUEST[o.cust];let m=1+decoBonus('tip');if(g&&g.reg)m+=.1*hearts(o.cust);return Math.round(tip*m/100)*100;}
function affAdd(id,d){const r=regOf(id),h0=hearts(id);r.aff=clamp(r.aff+d,0,100);const h1=hearts(id),g=GUEST[id];
  for(let h=h0+1;h<=h1;h++){const gf=g.gift[h-1];if(!gf)continue;if(gf.money)SAVE.money+=gf.money;if(gf.rep)SAVE.rep=clamp(SAVE.rep+gf.rep,0,5);if(gf.stock)for(const k in gf.stock)SAVE.stock[k]=(SAVE.stock[k]||0)+gf.stock[k];
    r.got=h;setTimeout(()=>toast(`<img alt="" src="${gImg(id)}">`,`${g.n} ${heartStr(h)}`,`${g.lines[h-1]} — ${gf.t}${gf.money?` (+${won(gf.money)})`:''}`,'long ach'),900);}}
function guestAfter(o,sc){const P=GP(),g=GUEST[o.cust];
  addXP(sc/10+(g&&g.reg?3:0)+(o.critic?10:0));if(o._reqOk)P.req=(P.req||0)+1;if(o.special)P.sp=(P.sp||0)+1;P.combo=Math.max(P.combo||0,G.combo||0);
  if(g&&g.reg){const r=regOf(o.cust);r.visits++;let d=(sc>=85?12:sc>=70?8:sc>=55?3:-6)+(o._prefOk===true?5:o._prefOk===false?-4:0);if(d>0)d=Math.round(d*(1+decoBonus('aff')));o._affD=d;affAdd(o.cust,d);if(sc>=70)P.reg=(P.reg||0)+1;}
  if(o.critic)criticReview(o,sc);
  goalsCheck();}
function guestLeft(o){const g=GUEST[o.cust];if(!g)return;if(g.reg){affAdd(o.cust,-5);toast(`<img alt="" src="${gImg(o.cust,'a')}">`,`${g.n}님이 바빠서 먼저 갔어요`,'다음엔 조금 더 빨리! 호감도 −5','long');}else if(o.critic)criticReview(o,null);}
function guestQuote(P){const g=GUEST[P.o.cust],s=P.res.total;if(g&&g.hi)return s>=75?g.hi:s<55?g.lo:quoteFor(s);return quoteFor(s);}
const MOOD=f=>f>.5?'😊':f>.25?'😐':'😤';

/* order bubble */
function orderBubble(o){if(G.mode!=='career'||SET.bubble===false)return;const g=GUEST[o.cust];if(!g)return;let b=$('#bubble');if(!b){b=document.createElement('div');b.id='bubble';$('#stage').appendChild(b);}
  const R=RID[o.rid],hi=g.reg&&regOf(o.cust).visits?`${heartStr(hearts(o.cust))} `:'';
  b.innerHTML=`<img alt="" src="${gImg(o.cust)}"><div><b>${g.n} <small>${hi}${o.table}번 테이블</small></b><span>“${R.n}${o.opt?' '+o.opt[0]:''} ${o.pref?'— '+PREF[o.pref].t+'!':o.req?'— '+REQS[o.req].t+'!':'주세요!'}”</span></div>`;
  b.className=o.critic?'critic':'';b.hidden=false;b.classList.remove('in');void b.offsetWidth;b.classList.add('in');clearTimeout(b._t);b._t=setTimeout(()=>b.hidden=true,3600);}

/* wrappers on the order / serve flow */
spawnOrder=(orig=>function(){const n=G.orders.length;orig();const o=G.orders[G.orders.length-1];if(!o||G.orders.length===n)return;assignGuest(o);renderTickets();renderSteps();hudTick();orderBubble(o);})(spawnOrder);
renderTickets=(orig=>function(){orig();for(const el of $$('#rail .tk')){const o=G.orders.find(q=>q.id==el.dataset.id);if(!o||!GUEST[o.cust])continue;const g=GUEST[o.cust];
  el.classList.toggle('critic',!!o.critic);el.classList.toggle('reg',!!g.reg);const nn=el.querySelector('.tk-no');if(nn)nn.textContent=`#${String(o.id).padStart(3,'0')}`;const w=el.querySelector('.tk-who');if(w)w.innerHTML=`${g.n}${g.reg?` <i class="tk-h">${'♥'.repeat(hearts(o.cust))||'♡'}</i>`:''}${o.table?` <small>${o.table}번</small>`:''}`;
  const a=document.createElement('span');a.className='tk-av';a.innerHTML=`<img alt="" src="${gImg(o.cust)}"><i></i>`;el.appendChild(a);
  if(o.pref){const e=document.createElement('em');e.className='tk-pf';e.textContent='♥ '+PREF[o.pref].t;const p=el.querySelector('.tk-p');el.insertBefore(e,p);}}
  updateTicketBars();const hs=$$('#rail .tk').map(e=>e.offsetHeight);$('#stage').style.setProperty('--railB',(66+Math.max(96,...hs)+14)+'px');})(renderTickets);
updateTicketBars=(orig=>function(){orig();for(const el of $$('#rail .tk')){const o=G.orders.find(q=>q.id==el.dataset.id),i=el.querySelector('.tk-av i');if(!o||!i)continue;const f=o.pat===Infinity?1:clamp(o.left/o.pat,0,1),m=MOOD(f);if(i.textContent!==m){i.textContent=m;const im=el.querySelector('.tk-av img');if(im)im.src=gImg(o.cust,moodK(f));}}})(updateTicketBars);
renderSteps=(orig=>function(){orig();{const im=$('#rpImg');let d=$('#rpArt');if(!d){d=document.createElement('div');d.id='rpArt';im.after(d);}d.hidden=im.hidden;if(!im.hidden)d.style.backgroundImage=`url(${im.src})`;im.style.display='none';}const o=selOrder();if(o&&o.pref){$('#rpSub').textContent=`${GUEST[o.cust].n}: ${PREF[o.pref].t} · `+$('#rpSub').textContent;}})(renderSteps);
showToast=(orig=>function(P){orig(P);const g=GUEST[P.o.cust],t=$('#served');if(!g)return;const h=t.querySelector('.sv-h');
  const im=document.createElement('img');im.className='sv-av';im.alt='';im.src=gImg(P.o.cust,scoreK(P.res.total));h.prepend(im);
  const q=document.createElement('p');q.className='sv-q';q.textContent=guestQuote(P);t.querySelector('.sv-s').after(q);
  if(g.reg&&P.o._affD!==undefined){const a=document.createElement('div');a.className='sv-aff';a.innerHTML=`<span>${heartStr(hearts(P.o.cust))}</span> 호감도 ${P.o._affD>=0?'+':''}${P.o._affD}`;q.after(a);}})(showToast);
showResult=(orig=>function(P){orig(P);const g=GUEST[P.o.cust];$('#quote').textContent=guestQuote(P);const tg=$('.res-tag');tg.innerHTML=g?`<img alt="" src="${gImg(P.o.cust,scoreK(P.res.total))}"> ${g.n}의 한마디`:'손님 한마디';})(showResult);
gameTick=(orig=>function(dt){orig(dt);if(G.mode!=='career')return;G._gt=(G._gt||0)+dt;if(G._gt>1){G._gt=0;goalsCheck();renderGoals();}})(gameTick);
startCareer=(orig=>function(){shopInit();decoRefresh();goalsFor(SAVE.day);orig();renderGoals();hudLv();bgmPlay('day');
  if(SAVE.toured)setTimeout(()=>{if(G&&G.started&&G.mode==='career')toast('🎯',`오늘의 목표 · 보상 각 ${won(goalReward())}`,SAVE.goals.list.map(q=>GOALS[q.k].t(q.n)).join(' · '),'long');},SAVE.toured?1200:0);})(startCareer);
startPractice=(orig=>function(rid,guide){orig(rid,guide);renderGoals();hudLv();bgmPlay('day');})(startPractice);
toTitle=(orig=>function(){orig();renderGoals();})(toTitle);
endDay=(orig=>function(){if(G.mode!=='career'){orig();return;}goalsCheck(true);const gs=SAVE.goals&&SAVE.goals.day===G.day.n?SAVE.goals.list:null;orig();const X=xpBar();
  $('#settleBody').insertAdjacentHTML('beforeend',`${gs?`<div class="st-goals"><b>오늘의 목표 ${gs.filter(q=>q.done).length}/3</b>${gs.map(q=>`<span class="${q.done?'ok':''}">${q.done?'✓':'✗'} ${GOALS[q.k].t(q.n)}</span>`).join('')}</div>`:''}
    <div class="st-shop"><span>🏮 Lv${X.l} ${X.n}</span><div class="xp"><i style="width:${(X.f*100).toFixed(0)}%"></i></div><small>${X.need?`다음 등급까지 ${X.need} XP`:'최고 등급!'}</small></div>`);
  let b=$('#stShop');if(!b){b=document.createElement('button');b.type='button';b.id='stShop';b.className='btn2';b.textContent='우리 가게';$('#stMarket').after(b);b.onclick=()=>openShop();}renderGoals();})(endDay);
function hudLv(){let c=$('#lvChip');if(!c){c=document.createElement('button');c.type='button';c.id='lvChip';$('#top .st').appendChild(c);c.onclick=()=>openShop();}
  const on=G&&G.mode==='career';c.hidden=!on;if(!on)return;const X=xpBar();c.innerHTML=`🏮 Lv${X.l} <small>${X.n}</small><i style="width:${(X.f*100).toFixed(0)}%"></i>`;}
hudTick=(orig=>function(){orig();if(G&&G.mode==='career'){G._hl=(G._hl||0)+1;if(G._hl%20===0)hudLv();}})(hudTick);

/* ---------- 우리 가게 panel: level · interior · regulars ---------- */
const SHOP={tab:'deco'};
function openShop(){if(!SAVE)loadSave();shopInit();let d=$('#shopPanel');if(!d){d=document.createElement('div');d.id='shopPanel';d.className='overlay';$('#stage').appendChild(d);d.addEventListener('click',e=>{if(e.target===d)closeShop();});}
  if(G&&G.started){SHOP.wasPaused=G.paused;G.paused=true;}renderShop();d.hidden=false;}
function closeShop(){$('#shopPanel').hidden=true;if(G&&G.started)G.paused=!!SHOP.wasPaused;hudLv();}
function renderShop(){const d=$('#shopPanel'),X=xpBar(),eq=decoEq(),own=SAVE.shop.own;
  const deco=Object.keys(SLOTN).map(sl=>`<div class="sp-slot"><h4>${SLOTN[sl]}</h4><div class="sp-row">${[{id:'',n:'기본',d:'처음 그대로',b:'',lv:1,price:0},...DECO.filter(x=>x.slot===sl)].map(x=>{const lock=X.l<x.lv,has=!x.id||own[x.id],on=(eq[sl]||'')===x.id;
    return`<button type="button" class="sp-it${on?' on':''}${lock?' lock':''}" data-id="${x.id}" data-sl="${sl}" ${lock?'disabled':''}><b>${x.n}</b><span>${x.d}</span>${x.b?`<em>${x.b}</em>`:''}<i>${lock?`🔒 Lv${x.lv}`:on?'사용 중':has?'바꾸기':won(x.price)}</i></button>`;}).join('')}</div></div>`).join('');
  const regs=Object.keys(GUEST).filter(k=>GUEST[k].reg).map(k=>{const g=GUEST[k],r=regOf(k),met=r.visits>0,h=hearts(k),nx=g.gift[h];
    return`<div class="sp-reg${met?'':' unmet'}"><img alt="" src="${gImg(k)}"><div><b>${met?g.n:'???'} <span class="hs">${heartStr(h)}</span></b><p>${met?g.intro:`DAY ${g.from}부터 가끔 찾아와요.`}</p>
      ${met?`<p class="pf">좋아하는 것: <b>${PREF[g.pref].t}</b> · 즐겨 먹는 메뉴: ${g.fav.filter(f=>RID[f]).slice(0,4).map(f=>RID[f].n).join(', ')}</p><p class="nx">${nx?`다음 ♥ 보상: ${nx.t}`:'호감도 최대! 늘 고마운 단골이에요.'} · 방문 ${r.visits}번</p><div class="xp"><i style="width:${r.aff}%"></i></div>`:''}</div></div>`;}).join('');
  d.innerHTML=`<div class="sp paper"><div class="sp-h"><div><h2>우리 가게</h2><p class="sub">Lv${X.l} <b>${X.n}</b> · 좌석 ${seats()}개 · 잔고 ${won(SAVE.money)}</p></div><div class="sp-xp"><div class="xp"><i style="width:${(X.f*100).toFixed(0)}%"></i></div><small>${X.need?`다음 등급 “${SHOPLV[X.l][1]}”까지 ${X.need} XP · 요리 점수와 오늘의 목표로 올라요`:'최고 등급!'}</small></div><button type="button" class="btn2" id="spClose">닫기 <kbd>Esc</kbd></button></div>
    <div class="sp-tabs"><button type="button" data-t="deco" class="${SHOP.tab==='deco'?'on':''}">인테리어</button><button type="button" data-t="reg" class="${SHOP.tab==='reg'?'on':''}">단골 손님</button><button type="button" data-t="lv" class="${SHOP.tab==='lv'?'on':''}">가게 등급</button></div>
    <div class="sp-body">${SHOP.tab==='deco'?`<p class="sub">산 인테리어는 주방에 바로 보이고, 효과는 같은 자리에 하나만 적용돼요.</p>${deco}`:SHOP.tab==='reg'?`<p class="sub">단골은 좋아하는 메뉴를 시키고, 취향을 맞추면 호감도가 올라요. ♥가 찰 때마다 선물이 있어요.</p>${regs}`
      :`<ol class="sp-lv">${SHOPLV.map((s,i)=>`<li class="${X.l>i?'ok':''}"><b>Lv${i+1} ${s[1]}</b><span>${s[0]} XP</span><em>${LVUP[i+1]||(i?'':'시작')}</em></li>`).join('')}</ol>`}</div></div>`;
  $('#spClose').onclick=closeShop;d.querySelectorAll('.sp-tabs button').forEach(b=>b.onclick=()=>{SHOP.tab=b.dataset.t;renderShop();});
  d.querySelectorAll('.sp-it').forEach(b=>b.onclick=()=>{const id=b.dataset.id,sl=b.dataset.sl,x=DECO.find(q=>q.id===id);
    if(x&&!own[id]){if(SAVE.money<x.price){toast('💸','잔고가 부족해요',`${won(x.price)} 필요`);return;}SAVE.money-=x.price;own[id]=1;if(G&&G.day&&G.mode==='career')G.day.spend+=x.price;AU.cash&&AU.cash();toast('🛋️',`${x.n} 설치!`,x.b);}
    eq[sl]=id;SAVE.shop.eq=eq;writeSave();decoRefresh();renderShop();hudTick&&G&&G.started&&hudTick();});}

/* ---------- achievements panel ---------- */
function openAch(){if(!SAVE)loadSave();let d=$('#achPanel');if(!d){d=document.createElement('div');d.id='achPanel';d.className='overlay';$('#stage').appendChild(d);d.addEventListener('click',e=>{if(e.target===d)d.hidden=true;});}
  const got=ACH.filter(a=>SAVE.ach[a[0]]).length;
  d.innerHTML=`<div class="achp paper"><div class="sp-h"><div><h2>업적</h2><p class="sub">${got} / ${ACH.length} 달성</p></div><div class="sp-xp"><div class="xp"><i style="width:${got/ACH.length*100}%"></i></div></div><button type="button" class="btn2" id="achClose">닫기 <kbd>Esc</kbd></button></div>
    <div class="ach-list">${ACH.map(a=>{const d2=SAVE.ach[a[0]];return`<div class="ach-it${d2?' on':''}"><i>${d2?'🏆':'🔒'}</i><div><b>${a[1]}</b><span>${a[2]}</span></div><em>${d2?`DAY ${d2}`:''}</em></div>`;}).join('')}</div></div>`;
  $('#achClose').onclick=()=>d.hidden=true;d.hidden=false;}

/* ---------- settings + BGM ---------- */
const SET=(()=>{let o={};try{o=JSON.parse(localStorage.getItem('sizzle-opts')||'{}');}catch(e){}return Object.assign({master:.9,sfx:.9,bgm:.5,bubble:true,calm:false,ai:false,pace:'relax'},o);})();
function saveOpt(){try{localStorage.setItem('sizzle-opts',JSON.stringify(SET));}catch(e){}}
AU.gv=function(){return this.muted?0:.85*SET.master*SET.sfx;};
AU.setMute=(orig=>function(m){orig.call(this,m);bgmVol();})(AU.setMute);
function audioApply(){if(AU.on&&AU.master)AU.master.gain.setTargetAtTime(AU.gv(),AU.C.currentTime,.05);bgmVol();document.body.classList.toggle('calm',!!SET.calm);}
const BGM={el:null,cur:null};
function bgmTarget(){return AU.muted?0:SET.master*SET.bgm*.55;}
function bgmVol(){if(BGM.el)BGM.el.volume=clamp(bgmTarget(),0,1);}
function bgmPlay(name){if(!AU.on||BGM.cur===name)return;BGM.cur=name;const old=BGM.el;if(old){let v=old.volume;const t=setInterval(()=>{v-=.05;if(v<=0){clearInterval(t);old.pause();}else old.volume=v;},60);}
  const a=new Audio();a.loop=true;a.volume=0;a.preload='auto';a.onerror=()=>{if(BGM.el===a)BGM.el=null;};a.src='audio/'+name+'.mp3';BGM.el=a;
  a.play().then(()=>{let v=0;const T=bgmTarget(),t=setInterval(()=>{v+=.03;if(v>=T||BGM.el!==a){clearInterval(t);if(BGM.el===a)a.volume=T;}else a.volume=v;},60);}).catch(()=>{});}
AU.init=(orig=>function(){orig.call(this);if(!this.on)return;audioApply();if(!$('#title').hidden)bgmPlay('title');})(AU.init);
function openSettings(){let d=$('#setPanel');if(!d){d=document.createElement('div');d.id='setPanel';d.className='overlay';$('#stage').appendChild(d);d.addEventListener('click',e=>{if(e.target===d)closeSettings();});}
  const sl=(k,n)=>`<label class="set-sl"><span>${n}</span><input type="range" min="0" max="100" value="${Math.round(SET[k]*100)}" data-k="${k}"><b>${Math.round(SET[k]*100)}</b></label>`,ck=(k,n,s)=>`<label class="set-ck"><input type="checkbox" data-k="${k}" ${SET[k]?'checked':''}><span><b>${n}</b>${s}</span></label>`;
  d.innerHTML=`<div class="set paper"><div class="sp-h"><h2>설정</h2><button type="button" class="btn2" id="setClose">닫기 <kbd>Esc</kbd></button></div><div class="set-body"><section><h4>소리</h4>${sl('master','전체 볼륨')}${sl('sfx','효과음')}${sl('bgm','배경 음악')}
    <label class="set-ck"><input type="checkbox" id="setMute" ${AU.muted?'checked':''}><span><b>소리 끄기</b>언제든 <kbd>M</kbd>으로 켜고 꺼요.</span></label><p class="set-note">배경 음악은 게임 폴더의 <code>audio/title.mp3</code> · <code>audio/day.mp3</code>를 재생해요. 파일이 없으면 조용히 넘어가요.</p><p class="set-note">아바타: Avataaars by Pablo Stanley (DiceBear)</p></section>
    <section><h4>손님</h4><div class="seg set-pace">${Object.entries(PACE).map(([k,p])=>`<button type="button" data-p="${k}" class="${(SET.pace||'relax')===k?'on':''}">${p.n}</button>`).join('')}</div><p class="set-note">여유롭게: 손님이 천천히 오고 최대 3명까지. 바쁘게: 더 자주, 최대 4명.</p><h4>화면</h4>${ck('ai','AI 일러스트 초상화','끄면 Avataaars 아바타로 바뀌고, 기다리는 동안 표정이 변해요.')}${ck('bubble','손님 말풍선','주문이 들어올 때 손님이 말을 걸어요.')}${ck('calm','애니메이션 줄이기','흔들림·반짝임 효과를 꺼요.')}<h4>조작키</h4><ul class="set-keys"><li><kbd>Esc</kbd> 일시정지 메뉴</li><li><kbd>Tab</kbd> 레시피 북</li><li><kbd>P</kbd> 잠깐 멈춤</li><li><kbd>F</kbd> 냉장고</li><li><kbd>M</kbd> 소리</li><li><kbd>R</kbd>/<kbd>E</kbd> 도마 돌리기 ↻↺</li><li><kbd>휠</kbd> 칼 각도</li><li><kbd>1</kbd>~<kbd>6</kbd> 도구 · 우클릭 내려놓기</li><li><kbd>T</kbd> 행주</li></ul></section></div></div>`;
  d.querySelectorAll('input[type=range]').forEach(r=>r.oninput=()=>{SET[r.dataset.k]=r.value/100;r.nextElementSibling.textContent=r.value;saveOpt();audioApply();});
  d.querySelectorAll('.set-ck input[data-k]').forEach(c=>c.onchange=()=>{SET[c.dataset.k]=c.checked;saveOpt();audioApply();if(c.dataset.k==='ai')portraitsChanged();});
  d.querySelectorAll('.set-pace button').forEach(b=>b.onclick=()=>{SET.pace=b.dataset.p;saveOpt();d.querySelectorAll('.set-pace button').forEach(x=>x.classList.toggle('on',x===b));});$('#setMute').onchange=e=>{AU.setMute(e.target.checked);if(typeof muteLbl==='function')muteLbl();};$('#setClose').onclick=closeSettings;d.hidden=false;}
function closeSettings(){$('#setPanel').hidden=true;}
document.body.classList.toggle('calm',!!SET.calm);
/* Esc closes the top-most 1.3 panel first */
function closeTopPanel(){for(const [id,fn] of [['setPanel',closeSettings],['achPanel',()=>$('#achPanel').hidden=true],['shopPanel',closeShop],['dlcPanel',()=>{$('#dlcPanel').hidden=true;renderTitle();}],['practice',()=>toTitle()]]){const e=$('#'+id);if(e&&!e.hidden){fn();return true;}}return false;}
(function(){const m=$('#menu .menu');if(!m||$('#menuSet'))return;const s=document.createElement('button');s.type='button';s.id='menuSet';s.className='btn2';s.textContent='설정';const sh=document.createElement('button');sh.type='button';sh.id='menuShop';sh.className='btn2';sh.textContent='우리 가게';
  const t=$('#menuTitle');m.insertBefore(sh,t);m.insertBefore(s,t);s.onclick=()=>openSettings();sh.onclick=()=>openShop();})();
function portraitsChanged(){if(G&&G.started)renderTickets();if(!$('#title').hidden)renderTitle();const sp=$('#shopPanel');if(sp&&!sp.hidden)renderShop();}
function setAI(on){SET.ai=!!on;saveOpt();portraitsChanged();}
