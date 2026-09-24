
/* ---------- 1.3.2 polish: icon top bar · calmer toasts · opt-in kitchen tour ---------- */
const ICO={
  fridge:'<path d="M6 3h12v18H6z"/><path d="M6 9h12M9 5.5v2M9 11.5v4"/>',
  book:'<path d="M5 4h6a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H5z"/><path d="M19 4h-4a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h4z"/>',
  cart:'<path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8H18l2-7H6.2"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>',
  sound:'<path d="M4 10h3l5-4v12l-5-4H4z"/><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a7.5 7.5 0 0 1 0 11"/>',
  pause:'<path d="M8 5v14M16 5v14"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',drop:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  shop:'<path d="M4 9l1.5-5h13L20 9M4 9h16v11H4zM9 20v-6h6v6"/>'};
const svgI=k=>`<svg class="ico" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICO[k]}</svg>`;
(function(){const set=(id,k,tip)=>{const b=$('#'+id);if(!b)return;b.insertAdjacentHTML('beforeend',svgI(k));b.title=tip||'';};
  set('btnFridge','fridge','냉장고 열기 (F)');set('btnRecipe','book','지금 주문 레시피');set('btnMarket','cart','장보기');set('btnMute','sound','소리 켜기/끄기 (M)');set('btnPause','pause','잠깐 멈춤 (P)');set('btnMenu','menu','메뉴 (Esc)');set('btnDrop','drop','들고 있는 것 내려놓기 (우클릭)');
  const r=$('#btnRot');if(r)r.remove();
  const clock=$('#clock');if(clock&&!$('#dayBar')){const w=document.createElement('span');w.id='clockBox';clock.before(w);w.appendChild(clock);w.insertAdjacentHTML('beforeend','<i id="dayBar"><b></b></i>');}})();
hudTick=(orig=>function(){orig();if(!G)return;const b=$('#dayBar b');if(b)b.style.width=G.mode==='career'&&G.day?Math.min(100,G.day.t/DAYLEN*100).toFixed(1)+'%':'0';const box=$('#clockBox');if(box)box.classList.toggle('practice',G.mode!=='career');})(hudTick);
/* toasts: at most three on screen, the rest wait their turn; hold them while the tour is talking */
const TQ=[];
toast=(orig=>function(...a){const box=$('#toasts'),busy=(box&&box.querySelectorAll('.toast:not(.out)').length>=3)||(TUT.on&&TUT.kind==='tour');if(busy){TQ.push(a);return;}orig(...a);})(toast);
setInterval(()=>{if(!TQ.length||(TUT.on&&TUT.kind==='tour'))return;const box=$('#toasts');if(box&&box.querySelectorAll('.toast:not(.out)').length>=3)return;const a=TQ.shift();toast(...a);},700);
/* first day: ask before starting the 22-step tour */
function askTour(then){let d=$('#askTour');if(!d){d=document.createElement('div');d.id='askTour';d.className='overlay';$('#stage').appendChild(d);}
  d.innerHTML=`<div class="ask paper"><h2>어서 오세요, 사장님!</h2><p>오늘이 첫 영업이에요. 주방을 한 바퀴 둘러보고 시작할까요?<br><small>냉장고·도구·화구·서빙까지 하나씩 짚어 드려요. 나중에 메뉴에서도 볼 수 있어요.</small></p><div class="ask-b"><button type="button" class="btn2" id="atSkip">바로 영업하기</button><button type="button" class="big-btn" id="atGo">둘러보기 (약 2분)</button></div></div>`;
  d.hidden=false;if(G)G.paused=true;$('#atGo').onclick=()=>{d.hidden=true;tourStart();};$('#atSkip').onclick=()=>{d.hidden=true;SAVE.toured=true;writeSave();if(G)G.paused=false;then&&then();};}
/* recipe card steps aside while you carry food to the pass */
hudTick=(orig=>function(){orig();const p=$('#recipePop');if(!p||!G)return;const carry=M.x>1244&&(G.held||G.ladle||(G.drag&&G.drag.kind!=='knob')||G.tool==='towel');p.classList.toggle('peek',!!carry);})(hudTick);
/* first order of a shift opens its recipe card by itself */
renderTickets=(orig=>function(){const had=G._lastSel;orig();if(!G||!G.started)return;if(G.sel&&G.sel!==had&&!had&&$('#recipePop').hidden&&!G.held&&!(TUT.on)){$('#recipePop').hidden=false;renderSteps();}G._lastSel=G.sel;})(renderTickets);
/* pause menu: one big resume, a 2x2 grid of the useful things, quiet links for the rest */
(function(){const m=$('#menu .menu');if(!m||m.dataset.v2)return;m.dataset.v2=1;const g=document.createElement('div');g.className='menu-grid';const f=document.createElement('div');f.className='menu-foot';
  for(const id of ['menuBook','menuGuide','menuShop','menuSet'])if($('#'+id))g.appendChild($('#'+id));for(const id of ['menuTour','menuEnd','menuTitle'])if($('#'+id))f.appendChild($('#'+id));
  const keys=m.querySelector('.menu-keys');$('#menuResume').after(g);g.after(f);if(keys)m.appendChild(keys);})();
hideAll=(orig=>function(){orig();const b=$('#bubble');if(b)b.hidden=true;})(hideAll);
