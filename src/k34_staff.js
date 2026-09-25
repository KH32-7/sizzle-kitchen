
/* ---------- 1.6 staff: part-timers who take small jobs off your hands; they get a little better every few days ---------- */
const STAFF={hall:{n:'지우',role:'홀 알바',wage:8000,lv:1,desc:'다 먹은 자리를 바로 치우고, 손님을 반갑게 맞아서 조금 더 느긋하게 기다려 줘요.'},
  dish:{n:'민호',role:'정리 알바',wage:6000,lv:2,desc:'조리대 얼룩과 그릇 테두리 국물을 틈틈이 닦아 줘요.'},
  prep:{n:'수아',role:'주방 보조',wage:12000,lv:4,desc:'영업을 시작할 때 오늘 메뉴 재료를 썰어서 작은 그릇에 담아 둬요.'}};
const staffSt=k=>{SAVE.staff=SAVE.staff||{};return SAVE.staff[k]=SAVE.staff[k]||{hired:false,days:0};};
function staffOn(k){return !!(G&&G.mode==='career'&&SAVE&&SAVE.staff&&SAVE.staff[k]&&SAVE.staff[k].hired);}
const staffLv=k=>1+Math.min(2,Math.floor(staffSt(k).days/5));
function staffWage(){let w=0;for(const k in STAFF)if(staffSt(k).hired)w+=STAFF[k].wage;return w;}
/* hall: friendlier welcome = a bit more patience */
assignGuest=(orig=>function(o){orig(o);if(staffOn('hall')&&o.pat!==Infinity){const m=1+.08*staffLv('hall');o.pat*=m;o.left*=m;}})(assignGuest);
/* dish: wipes up every so often during service */
gameTick=(orig=>function(dt){orig(dt);if(!staffOn('dish')||G.preOpen)return;G._dish=(G._dish||0)+dt;if(G._dish<30/staffLv('dish'))return;G._dish=0;
  let did=false;if(G.counter.fluid.length){G.counter.fluid=[];did=true;}try{STX.clearRect(0,0,W,H);}catch(e){}for(const v of [G.plate,G.bowl])if(v.drips&&v.drips.length){v.drips=[];v.wiped=true;did=true;}
  if(did)floatText('민호: 싹싹!',L.plate.x,L.plate.y-L.plate.r-30,'#cfe8ff',20);})(gameTick);
/* prep: cuts today's most-used ingredients into the little bowls when the doors open */
function staffCut(type,bowl){const spec=[];for(const id of menuItems()){const k=((RID[id].spec||{}).knife||{})[type];if(k)spec.push(k);}const mode=(spec[0]||['dice'])[0];
  if(G.stock[type]<=0)return false;if(tracked(type))takeLot(type);G.stock[type]--;
  const keep=G.board.pieces,B=L.board,p=newPiece(type,B.x+B.w/2,B.y+B.h/2);G.board.pieces=[p];const a0=G.knife.ang,sc=AU.chop,sk=AU.knock;AU.chop=AU.knock=()=>{};G.knife.ang=0;
  const pass=s=>{const P=G.board.pieces;let x0=1e9,x1=-1e9;for(const q of P){x0=Math.min(x0,q.x-q.rb);x1=Math.max(x1,q.x+q.rb);}
    for(let x=x0+s;x<x1;x+=s){const ys=[...new Set(G.board.pieces.filter(q=>Math.abs(q.x-x)<q.rb+2).map(q=>Math.round(q.y/10)*10))];for(const y of ys){G.knife.last=-9;chop(x,y);}}};
  try{if(mode==='dice'){pass(22);rotateBoard();pass(22);}else if(mode==='jul'){pass(7);rotateBoard();pass(70);}else pass(mode==='disc'?10:16);}finally{AU.chop=sc;AU.knock=sk;G.knife.ang=a0;G.knife.down=0;}
  for(const q of G.board.pieces){q.x=bowl.x+rand(-bowl.r*.4,bowl.r*.4);q.y=bowl.y+rand(-bowl.r*.4,bowl.r*.4);addItem(bowl,q,q.x,q.y);}G.board.pieces=keep;G.board.spin=0;return true;}
function staffPrep(){if(!staffOn('prep'))return;const need={};for(const id of menuItems()){const k=(RID[id].spec||{}).knife||{};for(const t in k)if(ING[t])need[t]=(need[t]||0)+1;}
  const list=Object.keys(need).sort((a,b)=>need[b]-need[a]).filter(t=>(G.stock[t]||0)>0&&ingOpen(t)),bowls=G.prep.filter(b=>contEmpty(b)),done=[];
  const n=Math.min(bowls.length,list.length,staffLv('prep')+1);for(let i=0;i<n;i++)if(staffCut(list[i],bowls[i]))done.push(ING[list[i]].n);
  if(done.length)toast(`<img alt="" src="${STAFFIMG.prep}">`,'수아가 밑준비를 해 뒀어요',done.join(' · ')+' — 작은 그릇에 썰어 담았어요','long');}
openDoors=(orig=>function(){const was=G&&G.preOpen;orig();if(was)staffPrep();})(openDoors);
/* wages are paid at closing; everyone hired gains a day of experience */
endDay=(orig=>function(){if(G&&G.mode==='career')for(const k in STAFF){const s=staffSt(k);if(s.hired)s.days++;}orig();})(endDay);
/* hall helper stands by the entrance */
renderHall=(orig=>function(){orig();const d=$('#scr-hall');if(!d)return;let s=d.querySelector('.hl-staff');if(!s){s=document.createElement('div');s.className='hl-staff';s.innerHTML=`<img alt="" src="${STAFFIMG.hall}"><span>지우</span>`;d.appendChild(s);}s.hidden=!staffOn('hall');})(renderHall);
PREP_TABS.push(['staff','직원']);
PREP_RENDER.staff=body=>{const L2=shopLv();body.innerHTML=`<div class="sf"><p class="sf-lead">직원은 일당을 받고(영업 마감 때 정산), 5일마다 조금씩 손이 빨라져요. 언제든 쉬게 할 수 있어요.</p><div class="sf-grid">${Object.entries(STAFF).map(([k,s])=>{const st=staffSt(k),lock=L2<s.lv;
    return`<div class="sf-card${st.hired?' on':''}${lock?' lock':''}"><img alt="" src="${STAFFIMG[k]}"><div class="sf-b"><b>${s.n} <small>${s.role}</small></b><p>${s.desc}</p><p class="sf-m">일당 ${won(s.wage)} · 숙련 Lv${staffLv(k)} (${st.days}일 근무)</p></div>
      <button type="button" class="${st.hired?'btn2':'big-btn'}" data-k="${k}" ${lock?'disabled':''}>${lock?`🔒 가게 Lv${s.lv}`:st.hired?'쉬게 하기':'고용하기'}</button></div>`;}).join('')}</div>
    <p class="sf-sum">오늘 인건비 합계 <b>${won(staffWage())}</b></p></div>`;
  body.querySelectorAll('.sf-card button').forEach(b=>b.onclick=()=>{const k=b.dataset.k,st=staffSt(k);st.hired=!st.hired;writeSave();AU.pick&&AU.pick();toast(`<img alt="" src="${STAFFIMG[k]}">`,st.hired?`${STAFF[k].n}을(를) 고용했어요`:`${STAFF[k].n}은(는) 오늘 쉬어요`,st.hired?STAFF[k].desc:'');renderPrep();});};
