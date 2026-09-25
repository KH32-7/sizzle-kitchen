
/* ---------- 2.1.2 fixes: no debt spiral · soy step · panels left open from the title ---------- */
/* a healing game never puts you in the red: whatever the till can't cover at closing, the landlady lets slide */
let GRACE=0;
endDay=(orig=>function(){GRACE=0;if(G&&G.mode==='career'&&G.day){const D=G.day,gas=Math.round(G.gas/10)*10,rentD=D.n<=3?12000:RENT,wage=typeof staffWage==='function'?staffWage():0,need=rentD+SEASON+gas+wage;
    if(SAVE.money<need){GRACE=need-SAVE.money;SAVE.money+=GRACE;G._profit=D.rev+D.tips-D.spend-need;}}
  orig();if(GRACE>0){const b=$('#settleBody');if(b)b.insertAdjacentHTML('afterbegin',`<div class="st-ch">🏠 오늘은 벌이가 적어서, 건물주 할머니가 <b>${won(GRACE)}</b>은 안 받겠대요. “장사가 다 그렇지. 내일 또 힘내!”</div>`);
    const tot=b&&b.querySelector('.st-row.tot');if(tot){tot.insertAdjacentHTML('beforebegin',`<div class="st-row"><span>🏠 건물주 할머니 인심</span><b style="color:#3f8a2a">+${won(GRACE)}</b></div>`);const p=G._profit+GRACE;tot.classList.toggle('neg',p<0);tot.querySelector('b').textContent=(p<0?'−':'')+won(Math.abs(p));}
    const m=b&&b.querySelector('.st-meta');if(m)m.innerHTML=m.innerHTML.replace(/잔고 [^<]*/,'잔고 '+won(SAVE.money));writeSave();}})(endDay);
/* saves from before this fix may already be below zero */
startCareer=(orig=>function(){if(SAVE&&SAVE.money<0){SAVE.money=0;writeSave();setTimeout(()=>toast('🏠','밀린 외상을 정리했어요','건물주 할머니가 지난 빚은 없던 걸로 해 주셨어요.','long'),1200);}orig();})(startCareer);
/* "press the soy onto the hot pan": pouring soy onto a pan that is properly hot counts, even before it scorches */
addFluid=(orig=>function(c,key,ml,wx,wy,vx,vy,T){orig(c,key,ml,wx,wy,vx,vy,T);if(G&&c&&c.kind==='pan'&&(key==='soy'||key==='dsoy')&&c.T>=150)G.soyHotT=G.t;})(addFluid);
/* panels opened from the title stay behind the game otherwise */
const TITLE_PANELS=['#achPanel','#shopPanel','#dlcPanel','#practice','#rbook','#setPanel'];
const closeTitlePanels=()=>{for(const s of TITLE_PANELS){const e=$(s);if(e)e.hidden=true;}};
startCareer=(orig=>function(){closeTitlePanels();orig();})(startCareer);
startPractice=(orig=>function(...a){closeTitlePanels();return orig(...a);})(startPractice);
