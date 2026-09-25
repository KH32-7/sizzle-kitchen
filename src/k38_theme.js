
/* ---------- 2.0 shop themes + expansion: restyle the hall, lean the menu toward a cuisine, add tables ---------- */
const THEMES={
  home:{n:'동네 식당',lv:1,cost:0,dishes:[],perk:'특별한 효과 없이 모든 메뉴가 고르게 팔려요.',tag:'기본'},
  bunsik:{n:'분식천국',lv:3,cost:60000,dishes:['kfr','efr','ramyeon','bibim','janchi','kjeon','mandu','yachae','squidfry'],perk:'분식 메뉴를 더 많이 찾아요 · 손님이 15% 더 느긋하게 기다려요',tag:'분식'},
  izakaya:{n:'이자카야',lv:5,cost:150000,dishes:['udon','shoyu','yaki','katsu','squidfry','yachae','jjim','mandu'],perk:'일식 메뉴를 더 많이 찾아요 · 팁이 25% 늘어요',tag:'일식'},
  bistro:{n:'비스트로',lv:6,cost:220000,dishes:['steak','aglio','pomo','yachae'],perk:'양식 메뉴를 더 많이 찾아요 · 테마 메뉴 가격 +15%',tag:'양식'}};
const EXPAND=[{n:'창가 자리 증축',lv:4,cost:120000,desc:'벽을 트고 테이블을 하나 더 놓아요.'},{n:'안쪽 자리 증축',lv:7,cost:300000,desc:'안쪽 창고를 비워 테이블을 하나 더 놓아요.'}];
function themeSt(){SAVE.theme=SAVE.theme||{cur:'home',own:{home:1}};return SAVE.theme;}
const themeCur=()=>(SAVE&&SAVE.theme&&THEMES[SAVE.theme.cur])?SAVE.theme.cur:'home';
const themeOn=()=>G&&G.mode==='career'&&SAVE;
const themeDish=rid=>THEMES[themeCur()].dishes.includes(rid);
const themeImg=k=>k==='home'?GIMG.hall:THEMEIMG[k];
const expandN=()=>Math.min(EXPAND.length,(SAVE&&SAVE.expand)||0);
/* tables: the level and the chosen pace set the base, each expansion adds one on top of both */
const lvCap=l=>l>=6?4:l>=3?3:2;
seats=(orig=>function(){if(!SAVE)return orig();const ex=expandN();return Math.min(6,paceOf().cap+ex,lvCap(shopLv())+ex);})(seats);
/* the theme's dishes get ordered about twice as often */
menuPool=(orig=>function(){const p=orig();if(!themeOn()||themeCur()==='home')return p;const extra=p.filter(r=>themeDish(r.id));return extra.length&&extra.length<p.length?p.concat(extra):p;})(menuPool);
assignGuest=(orig=>function(o){orig(o);if(themeOn()&&themeCur()==='bunsik'&&o.pat!==Infinity){o.pat*=1.15;o.left*=1.15;}})(assignGuest);
guestTip=(orig=>function(o,tip){const t=orig(o,tip);return themeOn()&&themeCur()==='izakaya'?t*1.25:t;})(guestTip);
orderPrice=(orig=>function(o){const b=orig(o);return themeOn()&&themeCur()==='bistro'&&themeDish(o.rid)?Math.round(b*1.15/100)*100:b;})(orderPrice);
/* hall picture follows the theme; locked tables say what opens them */
renderHall=(orig=>function(){orig();const d=$('#scr-hall');if(!d||!G||!G.hall)return;const bg=d.querySelector('.hl-bg'),k=themeCur();
  if(bg&&bg.dataset.th!==k){bg.dataset.th=k;bg.style.backgroundImage=`url(${themeImg(k)})`;}
  const act=seats(),ex=expandN(),l=shopLv();d.querySelectorAll('.ht').forEach((e,i)=>{if(i<act)return;const lk=e.querySelector('.ht-lock');
    lk.textContent=i>=4+ex?'🔨 확장 공사로 열려요':i>=lvCap(l)+ex?`가게 Lv${i-ex>=3?6:3}에 열려요`:'손님 속도 “바쁘게”에서 열려요';});
  let sn=d.querySelector('.hl-sign');if(!sn){sn=document.createElement('div');sn.className='hl-sign';d.appendChild(sn);}sn.textContent=THEMES[k].n;})(renderHall);
/* menu board: theme dishes wear a small tag */
renderMenuBoard=(orig=>function(body,items,slots,all){orig(body,items,slots,all);const k=themeCur();if(k==='home')return;
  body.querySelectorAll('.mb-card').forEach(b=>{if(themeDish(b.dataset.id))b.insertAdjacentHTML('beforeend',`<i class="mb-th">${THEMES[k].tag}</i>`);});
  body.querySelectorAll('.mb-frame li').forEach(li=>{if(themeDish(li.dataset.id))li.querySelector('.mb-n').insertAdjacentHTML('beforeend',`<em class="th">${THEMES[k].tag}</em>`);});})(renderMenuBoard);
PREP_TABS.unshift(['theme','가게 꾸미기']);
PREP_RENDER.theme=body=>{const st=themeSt(),l=shopLv(),cur=themeCur(),ex=expandN();
  const tcard=([k,t])=>{const own=!!st.own[k],lock=l<t.lv,on=cur===k;
    return`<div class="th-card${on?' on':''}${lock?' lock':''}"><div class="th-img" style="background-image:url(${themeImg(k)})">${on?'<span>영업 중</span>':''}</div>
      <div class="th-b"><b>${t.n}</b><p>${t.perk}</p>${t.dishes.length?`<p class="th-d">${t.dishes.filter(id=>RID[id]).map(id=>RID[id].n).join(' · ')}</p>`:''}</div>
      <button type="button" class="${on?'btn2':'big-btn'}" data-k="${k}" ${lock||on||(!own&&SAVE.money<t.cost)?'disabled':''}>${lock?`🔒 가게 Lv${t.lv}`:on?'지금 테마':own?'이 테마로 바꾸기':`${won(t.cost)} 인테리어`}</button></div>`;};
  const xcard=(x,i)=>{const done=i<ex,next=i===ex,lock=l<x.lv;
    return`<div class="th-x${done?' on':''}"><b>${x.n}</b><p>${x.desc}</p><button type="button" class="${done?'btn2':'big-btn'}" data-x="${i}" ${done||!next||lock||SAVE.money<x.cost?'disabled':''}>${done?'✓ 완료':lock?`🔒 가게 Lv${x.lv}`:!next?'앞 공사 먼저':`${won(x.cost)} 공사`}</button></div>`;};
  body.innerHTML=`<div class="th"><p class="sf-lead">테마를 바꾸면 홀 인테리어가 바뀌고, 손님들이 그 테마에 어울리는 요리를 더 자주 찾아요. 한 번 산 테마는 언제든 무료로 바꿀 수 있어요.</p>
    <div class="th-grid">${Object.entries(THEMES).map(tcard).join('')}</div>
    <h4 class="th-h">가게 확장 <small>지금 테이블 ${seats()}개 · 손님 속도 설정과 가게 등급에 따라 최대 6개</small></h4><div class="th-xs">${EXPAND.map(xcard).join('')}</div></div>`;
  body.querySelectorAll('.th-card button').forEach(b=>b.onclick=()=>{const k=b.dataset.k,t=THEMES[k];if(!st.own[k]){if(SAVE.money<t.cost)return;SAVE.money-=t.cost;G.day&&(G.day.spend+=t.cost);st.own[k]=1;AU.cash&&AU.cash();}
    st.cur=k;writeSave();hudTick();toast(`<img alt="" src="${themeImg(k)}">`,`오늘부터 ${t.n}!`,t.perk,'long');renderPrep();});
  body.querySelectorAll('.th-x button').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.x),x=EXPAND[i];if(i!==expandN()||SAVE.money<x.cost)return;SAVE.money-=x.cost;G.day&&(G.day.spend+=x.cost);SAVE.expand=i+1;writeSave();AU.cash&&AU.cash();hudTick();
    if(G.hall)hallDirty=true;toast('🔨',`${x.n} 완료!`,`이제 테이블이 최대 ${seats()}개예요.`,'long');renderPrep();});};
