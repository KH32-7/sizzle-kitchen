
/* ---------- 1.3 title screen ---------- */
(function(){const bg=$('.tl2-bg');if(bg&&typeof GIMG!=='undefined')bg.style.backgroundImage=`url(${GIMG.key})`;})();
renderTitle=(orig=>function(){orig();shopInit();decoRefresh();const X=xpBar(),got=ACH.filter(a=>SAVE.ach[a[0]]).length,m=SAVE.mid&&SAVE.mid.day===SAVE.day;
  $('#tlSave').innerHTML=`<div class="ts-a"><b>DAY ${SAVE.day}</b><span>${won(SAVE.money)}</span><span class="stars">${stars(SAVE.rep*20)}</span></div><div class="ts-b"><span>🏮 Lv${X.l} ${X.n}</span><div class="xp"><i style="width:${(X.f*100).toFixed(0)}%"></i></div></div><div class="ts-p"><span>손님 초상화</span><div class="seg"><button type="button" data-ai="1" class="${aiOn()?'on':''}">AI 일러스트</button><button type="button" data-ai="0" class="${aiOn()?'':'on'}">아바타</button></div><div class="faces">${['kim','jung','choi','yoon'].map(k=>`<img alt="" src="${gImg(k)}">`).join('')}</div></div><div class="ts-c"><span>서빙 ${SAVE.served}그릇</span><span>업적 ${got}/${ACH.length}</span><span>단골 ${Object.keys(GUEST).filter(k=>GUEST[k].reg&&SAVE.reg&&SAVE.reg[k]&&SAVE.reg[k].visits).length}/4</span></div>`;
  $('#tlStart').innerHTML=m?`이어하기 <small>DAY ${SAVE.day} · ${String(11+Math.floor(SAVE.mid.t/DAYLEN*10)).padStart(2,'0')}:${String(Math.floor(SAVE.mid.t/DAYLEN*600)%60).padStart(2,'0')}</small>`:SAVE.served?`영업 시작 <small>DAY ${SAVE.day}</small>`:`새로 시작 <small>DAY 1 · 첫 영업</small>`;
  $$('#tlSave .seg button').forEach(b=>b.onclick=e=>{e.stopPropagation();setAI(b.dataset.ai==='1');});
  bgmPlay('title');})(renderTitle);
$('#tlBook').addEventListener('click',()=>{AU.init();rbToggle(true);});$('#tlShop').addEventListener('click',()=>{AU.init();openShop();});$('#tlAch').addEventListener('click',()=>{AU.init();openAch();});$('#tlSettings').addEventListener('click',()=>{AU.init();openSettings();});
/* keyboard / hover focus like a console menu */
(function(){const items=()=>$$('#title .tl2-menu button');let idx=0;const set=i=>{const a=items();idx=(i+a.length)%a.length;a.forEach((b,k)=>b.classList.toggle('hl',k===idx));};
  items().forEach((b,i)=>b.addEventListener('mouseenter',()=>set(i)));set(0);
  addEventListener('keydown',e=>{if($('#title').hidden||$$('.overlay').some(o=>o!==$('#title')&&!o.hidden))return;if(e.code==='ArrowDown'||e.code==='KeyS'){e.preventDefault();set(idx+1);}else if(e.code==='ArrowUp'||e.code==='KeyW'){e.preventDefault();set(idx-1);}else if(e.code==='Enter'||e.code==='Space'){e.preventDefault();items()[idx].click();}});})();
