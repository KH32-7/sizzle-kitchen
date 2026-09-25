
/* ---------- 1.5 opening prep: every shift starts on its own screen — menu board, prices, then prep in the kitchen ---------- */
const menuSlots=()=>{const l=shopLv();return l>=7?6:l>=5?5:l>=3?4:3;};
const PSTEP=[.8,.85,.9,.95,1,1.05,1.1,1.15,1.2,1.25,1.3];
function menuState(){SAVE.menu=SAVE.menu||{items:null,price:{}};return SAVE.menu;}
const unlockedRecs=()=>REC.filter(r=>SAVE.dlc[r.dlc]!==false&&unlocked(r));
function menuItems(){const M=menuState(),all=unlockedRecs().map(r=>r.id);let it=(M.items||[]).filter(id=>all.includes(id));
  if(!it.length)it=[...all].sort((a,b)=>(SAVE.best[b]||0)-(SAVE.best[a]||0)||all.indexOf(b)-all.indexOf(a)).slice(0,menuSlots());
  for(const id of all)if(it.length<menuSlots()&&!it.includes(id)&&!(M.seen||[]).includes(id))it.push(id);// brand-new recipes join while there is room
  M.seen=all;return M.items=it.slice(0,menuSlots());}
const priceRatio=rid=>(menuState().price[rid])||1;
/* rough ingredient cost of one portion, for the board */
const PORTION={egg:1,rice:1,kimchi:.35,onion:.5,ham:.35,scallion:.3,jjokpa:.5,buchu:.5,zucchini:.4,carrot:.3,cucumber:.4,cabbage:.25,pork:.5,chashu:.5,naruto:.4,squid:.5,garlic:.3,beef:1,butter:.2,udon:1,ramen:1,yakisoba:1,somyeon:1,ramyeon:1,spaghetti:1,mandu:1,loin:1,sweetpotato:.4,ice:.3};
function costOf(rid){const u=recipeUses()[rid];let c=0;if(!u)return 0;for(const id of u){if(!PRICE[id])continue;c+=BOT[id]?PRICE[id]*.2:PRICE[id]*(PORTION[id]||.4);}return Math.round(c/100)*100;}
const demandW=rid=>Math.max(1,Math.round(3*Math.pow(priceRatio(rid),-2.5)));
/* only today's board is on offer; cheaper dishes get ordered more */
menuPool=(orig=>function(){const base=orig();if(!G||G.mode!=='career'||!SAVE)return base;const on=new Set(menuItems());const p=base.filter(r=>on.has(r.id));if(!p.length)return base;const out=[];for(const r of p)for(let k=0;k<demandW(r.id);k++)out.push(r);return out;})(menuPool);
orderPrice=(orig=>function(o){const b=orig(o);return G&&G.mode==='career'?Math.round(b*priceRatio(o.rid)/100)*100:b;})(orderPrice);
guestTip=(orig=>function(o,tip){const r=priceRatio(o.rid);return orig(o,tip)*(r<=.9?1.3:r>=1.2?.6:r>=1.1?.85:1);})(guestTip);
applyExtras=(orig=>function(o,v,res){orig(o,v,res);if(G.mode!=='career')return;const r=priceRatio(o.rid);
  if(r<=.9&&res.total>=70)res.notes.push({t:'good',s:'이 가격에 이 맛이라니, 가성비 최고!'});else if(r>=1.2&&res.total<80){res.total=Math.max(0,res.total-3);res.notes.push({t:'meh',s:'맛은 괜찮은데 가격이 조금 세요.'});}})(applyExtras);

/* ---- prep phase: the clock waits until you open the doors ---- */
gameTick=(orig=>function(dt){if(G&&G.preOpen)return;orig(dt);})(gameTick);
startCareer=(orig=>function(){const resumed=!!(SAVE.mid&&SAVE.mid.day===SAVE.day);orig();if(resumed||!G||G.mode!=='career')return;
  G.preOpen=true;G.orders=[];renderTickets();menuItems();if(G.day.special&&!menuItems().includes(G.day.special))G.day.special=pick(menuItems());PREP.tab='menu';setScreen('prep');})(startCareer);
function openDoors(){if(!G||!G.preOpen)return;G.preOpen=false;G.nextOrder=5;if(G.day.special&&!menuItems().includes(G.day.special))G.day.special=pick(menuItems());writeSave();midSave();
  setScreen('kitchen');AU.door&&AU.door();toast('🔔','영업 시작!',`오늘의 메뉴 ${menuItems().length}가지 · ${menuItems().map(id=>RID[id].n).join(', ')}`,'long');hudTick();}
hudTick=(orig=>function(){orig();if(!G||G.mode!=='career')return;let b=$('#btnOpen');if(!b){b=document.createElement('button');b.type='button';b.id='btnOpen';b.innerHTML='🔔 영업 시작';b.onclick=openDoors;$('#scrNav').after(b);}
  b.hidden=!G.preOpen;if(G.preOpen)$('#clock').textContent=`DAY ${G.day.n} · 오픈 준비`;})(hudTick);
/* nav: "준비" instead of "홀" before opening */
navSync=(orig=>function(){orig();const n=$('#scrNav');if(!n)return;let p=n.querySelector('[data-s="prep"]');if(!p){p=document.createElement('button');p.type='button';p.dataset.s='prep';p.innerHTML=`${svgI('book')}오픈 준비`;p.onclick=()=>setScreen('prep');n.prepend(p);}
  const pre=!!(G&&G.preOpen);p.hidden=!pre;n.querySelector('[data-s="hall"]').hidden=pre;p.classList.toggle('on',SCR.cur==='prep');})(navSync);
setScreen=(orig=>function(s){if(s==='prep'&&!(G&&G.preOpen))return;if(s==='hall'&&G&&G.preOpen)return;orig(s);})(setScreen);

/* ---- the prep screen ---- */
const PREP={tab:'menu',sel:null};
SCR.show_prep=()=>renderPrep();
function renderPrep(){const d=screenEl('prep','prep');const items=menuItems(),slots=menuSlots(),all=unlockedRecs();PREP.sel=PREP.sel&&RID[PREP.sel]?PREP.sel:items[0];
  const tabs=[['menu','메뉴판'],['market','장보기'],['shop','우리 가게'],...(typeof PREP_TABS!=='undefined'?PREP_TABS:[])];
  d.innerHTML=`<div class="pp-head"><div><small>DAY ${SAVE.day} · 오픈 전</small><h2>오늘 장사 준비</h2></div><nav class="pp-tabs">${tabs.map(([k,n])=>`<button type="button" data-t="${k}" class="${PREP.tab===k?'on':''}">${n}</button>`).join('')}</nav></div>
    <div class="pp-body" id="ppBody"></div>
    <div class="pp-foot"><span class="pp-hint">문을 열기 전에는 시간이 흐르지 않아요. 주방에서 채소를 미리 썰어 두거나 육수를 끓여 두면 영업이 편해요.</span><button type="button" class="btn2" id="ppKitchen">주방에서 밑준비 →</button><button type="button" class="big-btn" id="ppOpen">🔔 영업 시작</button></div>`;
  d.querySelectorAll('.pp-tabs button').forEach(b=>b.onclick=()=>{const t=b.dataset.t;if(t==='market'){openMarket();return;}if(t==='shop'){openShop();return;}PREP.tab=t;renderPrep();});
  $('#ppKitchen').onclick=()=>setScreen('kitchen');$('#ppOpen').onclick=openDoors;
  const body=$('#ppBody');if(PREP.tab==='menu')renderMenuBoard(body,items,slots,all);else if(typeof PREP_RENDER!=='undefined'&&PREP_RENDER[PREP.tab])PREP_RENDER[PREP.tab](body);}
function renderMenuBoard(body,items,slots,all){const M=menuState();
  const line=id=>{const R=RID[id],r=priceRatio(id),p=Math.round(R.price*r/100)*100,c=costOf(id),rate=Math.round(c/p*100),w=demandW(id);
    return`<li class="${PREP.sel===id?'sel':''}" data-id="${id}"><span class="mb-n">${R.n}${G.day.special===id?'<em>특선</em>':''}</span><span class="mb-dots"></span><span class="mb-p">${won(p)}</span>
      <span class="mb-adj"><button type="button" data-d="-1" ${r<=PSTEP[0]?'disabled':''}>−</button><i>${Math.round(r*100)}%</i><button type="button" data-d="1" ${r>=PSTEP[PSTEP.length-1]?'disabled':''}>+</button></span>
      <span class="mb-sub">재료비 약 ${won(c)} · 원가율 ${rate}% · 인기 ${'●'.repeat(Math.min(5,w))}${'○'.repeat(Math.max(0,5-w))}</span></li>`;};
  const R=RID[PREP.sel];
  body.innerHTML=`<div class="mb-board"><div class="mb-frame"><h3>오늘의 메뉴</h3><p class="mb-slots">${items.length} / ${slots}자리 <small>가게 등급이 오르면 늘어나요</small></p><ul>${items.map(line).join('')}</ul>
      <p class="mb-note">싸게 팔면 손님이 더 자주 시키고 팁을 넉넉히 줘요. 비싸게 팔면 한 그릇당 벌이는 늘지만, 팁이 줄고 맛이 아쉬우면 한소리 들어요.</p></div></div>
    <div class="mb-side"><h4>메뉴에 올릴 요리 <small>눌러서 넣고 빼기</small></h4><div class="mb-grid">${all.map(r=>`<button type="button" class="mb-card${items.includes(r.id)?' on':''}" data-id="${r.id}">${RIMG[r.id]?`<img alt="" src="${RIMG[r.id]}">`:''}<b>${r.n}${(UNLOCK[r.id]||1)===SAVE.day&&SAVE.day>1?'<i class="mb-new">NEW</i>':''}</b><em>${won(r.price)}${SAVE.best[r.id]?` · 최고 ${SAVE.best[r.id]}점`:''}</em></button>`).join('')}</div>
      ${R?`<div class="mb-detail"><img alt="" src="${RIMG[R.id]||''}"><div><b>${R.n}</b><span>${R.sub}</span><span>기본가 ${won(R.price)} · 재료비 약 ${won(costOf(R.id))}</span></div></div>`:''}</div>`;
  body.querySelectorAll('.mb-frame li').forEach(li=>{li.onclick=()=>{PREP.sel=li.dataset.id;renderPrep();};li.querySelectorAll('.mb-adj button').forEach(b=>b.onclick=e=>{e.stopPropagation();const id=li.dataset.id,i=PSTEP.indexOf(PSTEP.reduce((a,x)=>Math.abs(x-priceRatio(id))<Math.abs(a-priceRatio(id))?x:a));const n=PSTEP[clamp(i+Number(b.dataset.d),0,PSTEP.length-1)];M.price[id]=n;writeSave();AU.pick&&AU.pick();renderPrep();});});
  body.querySelectorAll('.mb-card').forEach(b=>b.onclick=()=>{const id=b.dataset.id,cur=menuItems();if(cur.includes(id)){if(cur.length<=1){toast('🍽️','메뉴는 한 가지 이상 있어야 해요','');return;}M.items=cur.filter(x=>x!==id);}else{if(cur.length>=slots){toast('🍽️',`메뉴판은 ${slots}자리예요`,'다른 요리를 빼고 넣어 주세요.');return;}M.items=[...cur,id];}PREP.sel=id;writeSave();AU.pick&&AU.pick();renderPrep();});}
midSave=(orig=>function(){if(G&&G.preOpen)return;orig();})(midSave);
tourStart=(orig=>function(){if(SCR.cur!=='kitchen'&&G&&G.started)setScreen('kitchen');orig();})(tourStart);
hintText=(orig=>function(){const r=orig();if(G&&G.preOpen&&r[0]!=='warn'&&!G.held&&G.tool==='hand')return['','오픈 전 밑준비 시간이에요. 채소를 미리 썰어 두고, 준비되면 위의 🔔 영업 시작을 눌러요.'];return r;})(hintText);
/* per-dish sales for the settlement: did that price work? */
serve=(orig=>function(){const o=selOrder(),n0=G.orders.length;orig();if(!G||G.mode!=='career'||!o||G.orders.includes(o))return;const P=G.lastServe;if(!P||P.o!==o)return;
  const S=G.day.sales=G.day.sales||{},e=S[o.rid]=S[o.rid]||{n:0,rev:0,sc:0};e.n++;e.rev+=P.pay+P.tip;e.sc+=P.res.total;})(serve);
midSave=(orig=>function(){orig();if(SAVE.mid&&G&&G.day)SAVE.mid.sales=G.day.sales||{};})(midSave);
startCareer=(orig=>function(){const m=SAVE.mid&&SAVE.mid.day===SAVE.day?SAVE.mid:null;orig();if(m&&G&&G.day)G.day.sales=m.sales||{};})(startCareer);
endDay=(orig=>function(){const S=G&&G.day&&G.day.sales;orig();if(!S||!Object.keys(S).length)return;const rows=Object.entries(S).sort((a,b)=>b[1].rev-a[1].rev);
  $('#settleBody').insertAdjacentHTML('beforeend',`<div class="st-sales"><b>메뉴별 판매</b><table>${rows.map(([id,e])=>`<tr><td>${RID[id].n} <span class="pr">${Math.round(priceRatio(id)*100)}%</span></td><td>${e.n}그릇</td><td>${won(e.rev)}</td><td>평균 ${Math.round(e.sc/e.n)}점</td></tr>`).join('')}</table></div>`);})(endDay);
