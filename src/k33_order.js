
/* ---------- 1.6 wholesale ordering: cheaper than the corner mart, arrives tomorrow morning; prices move every day ---------- */
const PREP_TABS=[],PREP_RENDER={};
const hashId=s=>{let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))|0;return Math.abs(h);};
const allGoods=()=>[...FRIDGE,...PANTRY_STOCK].map(([id,n,price])=>({id,n,price}));
function dealsOf(day){const R=mulberry(day*977+3),open=allGoods().filter(g=>ingOpen(g.id)),out=new Set();for(let i=0;i<3&&open.length;i++)out.add(open[(R()*open.length)|0].id);return out;}
function wholesale(id,day){const d=day||SAVE.day;if(dealsOf(d).has(id))return Math.round(PRICE[id]*.55/10)*10;const f=.72+mulberry(d*131+hashId(id))()*.36;return Math.round(PRICE[id]*f/10)*10;}
const ORD={cart:{}};
function pendingOrder(){return SAVE.pending&&SAVE.pending.day>SAVE.day?SAVE.pending:null;}
/* morning delivery */
startCareer=(orig=>function(){let got=null;if(SAVE.pending&&SAVE.pending.day<=SAVE.day){got=SAVE.pending.items;for(const id in got)SAVE.stock[id]=(SAVE.stock[id]||0)+got[id]*UNIT(id);SAVE.pending=null;writeSave();}
  orig();if(got){const names=Object.keys(got).map(id=>(allGoods().find(g=>g.id===id)||{n:id}).n);setTimeout(()=>toast('🚚','도매 배송 도착!',names.slice(0,5).join(' · ')+(names.length>5?` 외 ${names.length-5}가지`:''),'long'),900);}})(startCareer);
/* what went to waste */
spoilLots=(orig=>function(){const r=orig();SAVE.waste=(SAVE.waste||[]).concat(r.map(([id,n])=>({day:SAVE.day,id,n}))).slice(-60);return r;})(spoilLots);
PREP_TABS.push(['order','도매 발주']);
PREP_RENDER.order=body=>{const need=menuIngs(),deals=dealsOf(SAVE.day),pend=pendingOrder(),C=ORD.cart;
  const goods=allGoods().filter(g=>ingOpen(g.id)).sort((a,b)=>(deals.has(b.id)-deals.has(a.id))||(need.has(b.id)-need.has(a.id)));
  const total=Object.entries(C).reduce((s,[id,n])=>s+n*wholesale(id),0);
  const waste=(SAVE.waste||[]).filter(w=>SAVE.day-w.day<=7),wsum={};for(const w of waste)wsum[w.id]=(wsum[w.id]||0)+w.n;
  body.innerHTML=`<div class="od"><div class="od-list"><div class="od-h"><b>도매 시장</b><span>오늘 주문하면 <b>내일 아침</b>에 도착해요. 시세는 매일 바뀌어요.</span><button type="button" class="btn2" id="odFill">내일 메뉴 기준으로 채우기</button></div>
      <div class="od-rows">${goods.map(g=>{const p=wholesale(g.id),r=p/g.price,unit=UNIT(g.id),st=SAVE.stock[g.id]||0;return`<div class="od-row${deals.has(g.id)?' deal':''}${need.has(g.id)?'':' dim'}" data-id="${g.id}">
        <img alt="" src="${itemIcon(g.id)}"><span class="od-n">${g.n}${deals.has(g.id)?'<i>오늘의 특가</i>':''}${unit>1?' <small>500ml</small>':''}</span>
        <span class="od-p">${won(p)} <small class="${r<.9?'dn':r>1?'up':''}">${r<1?'▼':'▲'}${Math.abs(Math.round((r-1)*100))}%</small></span><span class="od-s">재고 ${unit>1?st+'ml':st}${SHELF[g.id]!==undefined?` · 유통 ${SHELF[g.id]}일`:''}</span>
        <span class="od-q"><button type="button" data-d="-1">−</button><b>${C[g.id]||0}</b><button type="button" data-d="1">+</button><button type="button" data-d="5">+5</button></span></div>`;}).join('')}</div></div>
    <aside class="od-side"><h4>주문서</h4>${Object.keys(C).filter(id=>C[id]).length?`<ul>${Object.entries(C).filter(([,n])=>n).map(([id,n])=>`<li><span>${allGoods().find(g=>g.id===id).n} ×${n}</span><b>${won(n*wholesale(id))}</b></li>`).join('')}</ul>`:'<p class="od-empty">아직 담은 게 없어요.</p>'}
      <div class="od-tot"><span>합계</span><b>${won(total)}</b></div><div class="od-tot"><span>잔고</span><span>${won(SAVE.money)}</span></div>
      <button type="button" class="big-btn" id="odBuy" ${total<=0||total>SAVE.money||pend?'disabled':''}>${pend?'내일 배송 예약됨':'주문하기 (내일 도착)'}</button>
      ${pend?`<p class="od-pend">🚚 내일 도착: ${Object.entries(pend.items).map(([id,n])=>`${allGoods().find(g=>g.id===id).n} ${n}`).join(', ')}</p>`:''}
      <p class="od-tip">급하게 필요하면 <b>장보기</b>(동네 마트)에서 바로 살 수 있어요. 대신 정가예요.</p>
      <div class="od-waste"><b>지난 7일 버린 재료</b>${Object.keys(wsum).length?Object.entries(wsum).map(([id,n])=>`<span>${(ING[id]||{n:id}).n} ${n}</span>`).join(''):'<span class="ok">없어요, 잘하고 있어요!</span>'}</div></aside></div>`;
  body.querySelectorAll('.od-row').forEach(row=>row.querySelectorAll('button').forEach(b=>b.onclick=()=>{const id=row.dataset.id;C[id]=Math.max(0,(C[id]||0)+Number(b.dataset.d));AU.pick&&AU.pick();renderPrep();}));
  $('#odFill').onclick=()=>{for(const id of need){if(!ingOpen(id)||!PRICE[id])continue;const unit=UNIT(id),want=BOT[id]?1500:id==='egg'?10:id==='rice'?6:4,n=Math.max(0,Math.ceil((want-(SAVE.stock[id]||0))/unit));if(n)C[id]=n;}renderPrep();};
  $('#odBuy').onclick=()=>{if(total<=0||total>SAVE.money||pend)return;SAVE.money-=total;G.day&&(G.day.spend+=total);SAVE.pending={day:SAVE.day+1,items:Object.fromEntries(Object.entries(C).filter(([,n])=>n))};ORD.cart={};writeSave();AU.cash&&AU.cash();toast('🚚','도매 주문 완료','내일 아침에 도착해요.');hudTick();renderPrep();};};
