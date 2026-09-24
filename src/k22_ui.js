
/* ---------- 1.3 UI: recipe book (Tab) · pause menu (Esc) ---------- */
const RB={open:false,sel:null,wasPaused:false};
function recipeUnlocked(r){if(!SAVE)loadSave();return SAVE.dlc[r.dlc]!==false&&SAVE.day>=(UNLOCK[r.id]||1);}
function rbBuild(){if($('#rbook'))return;const d=document.createElement('div');d.id='rbook';d.className='overlay';d.hidden=true;
  d.innerHTML=`<div class="rb paper"><div class="rb-h"><h2>레시피 북</h2><span id="rbCount"></span><button type="button" id="rbClose" class="btn2">닫기 <kbd>Tab</kbd></button></div><div class="rb-body"><div id="rbList" class="rb-list"></div><div id="rbDetail" class="rb-detail"></div></div></div>`;
  $('#stage').appendChild(d);$('#rbClose').onclick=()=>rbToggle(false);d.addEventListener('click',e=>{if(e.target===d)rbToggle(false);});}
function rbToggle(on){rbBuild();if(on===undefined)on=!RB.open;if(on===RB.open)return;RB.open=on;$('#rbook').hidden=!on;
  if(on){RB.wasPaused=!!(G&&G.paused);if(G&&G.started)G.paused=true;const o=G&&G.started&&typeof selOrder==='function'?selOrder():null;RB.sel=RB.sel||(o&&o.rid)||REC.find(recipeUnlocked).id;rbRender();AU.pick&&AU.pick();}
  else if(G&&G.started)G.paused=RB.wasPaused;}
function rbRender(){const list=$('#rbList');list.innerHTML='';let n=0,tot=0;
  for(const k in DLC){if(SAVE.dlc[k]===false)continue;const rs=REC.filter(r=>r.dlc===k);if(!rs.length)continue;const h=document.createElement('h4');h.textContent=DLC[k].n;list.appendChild(h);
    for(const r of rs){tot++;const un=recipeUnlocked(r);if(un)n++;const b=document.createElement('button');b.type='button';b.className='rb-card'+(un?'':' locked')+(RB.sel===r.id?' sel':'');
      b.innerHTML=`${RIMG[r.id]?`<img alt="" src="${RIMG[r.id]}">`:''}<b>${r.n}</b><em>${un?(SAVE.best[r.id]?`최고 ${SAVE.best[r.id]}점`:'도전 전'):`🔒 DAY ${UNLOCK[r.id]||1}`}</em>`;
      b.onclick=()=>{RB.sel=r.id;rbRender();};list.appendChild(b);}}
  $('#rbCount').textContent=`해금 ${n} / ${tot}`;const R=RID[RB.sel];if(!R)return;const un=recipeUnlocked(R),det=$('#rbDetail');
  const ings=[...recipeUses()[R.id]].filter(id=>!ING_BASE.has(id)||['egg','flour'].includes(id));
  det.innerHTML=`<div class="rb-hero">${RIMG[R.id]?`<img alt="" src="${RIMG[R.id]}">`:''}${un?'':'<div class="rb-lock">🔒 영업 DAY '+(UNLOCK[R.id]||1)+'에 해금돼요</div>'}</div>
    <h3>${R.n}</h3><p class="rb-sub">${R.sub} · ${R.vessel==='bowl'?'그릇':'접시'} · ${won(R.price)}</p>
    <div class="rb-sec">재료</div><div class="rb-ings">${ings.map(id=>{let nm=(FRIDGE.find(f=>f[0]===id)||[])[1]||(PANTRY.find(p=>p.id===id)||{}).n||id;return`<span><img alt="" src="${itemIcon(id)}">${nm}</span>`;}).join('')}</div>
    <div class="rb-sec">순서</div><ol class="rb-steps">${R.steps.map(s=>`<li>${s[0]}</li>`).join('')}</ol>
    <div class="rb-foot"><span>${SAVE.best[R.id]?`<span class="stars">${stars(SAVE.best[R.id])}</span> 최고 ${SAVE.best[R.id]}점`:'아직 만들어 보지 않았어요'}</span>${!(G&&G.started)&&un?`<button type="button" class="big-btn" id="rbPractice">가이드로 연습하기</button>`:''}</div>`;
  const pb=$('#rbPractice');if(pb)pb.onclick=()=>{rbToggle(false);AU.init();startPractice(R.id,true);};}
/* pause menu: Esc opens it, with a way back to the title */
function openPauseMenu(){if(!G||!G.started)return;if(!$('#result').hidden)return;$('#pauseOv').hidden=true;G.paused=true;$('#menuEnd').textContent=G.mode==='career'?'오늘 영업 마감하기':'연습 끝내기';$('#menu').hidden=false;}
function closePauseMenu(){$('#menu').hidden=true;if(G)G.paused=false;}
addEventListener('keydown',e=>{
  if(e.code==='Tab'&&!e.shiftKey){if(!$('#title').hidden||G&&G.started){e.preventDefault();if(typeof PL!=='undefined'&&PL.on)return;rbToggle();}return;}
  if(e.code==='Escape'){if(typeof closeTopPanel==='function'&&closeTopPanel()){e.preventDefault();return;}if(RB.open){e.preventDefault();rbToggle(false);return;}if(typeof PL!=='undefined'&&PL.on)return;if(!G||!G.started)return;e.preventDefault();if(!$('#menu').hidden)closePauseMenu();else openPauseMenu();}
},true);
(function(){const m=$('#menu .menu');if(!m||$('#menuTitle'))return;const b=document.createElement('button');b.type='button';b.id='menuTitle';b.className='btn2';b.textContent='타이틀로 (진행 저장)';m.appendChild(b);
  const r=document.createElement('button');r.type='button';r.id='menuBook';r.className='btn2';r.innerHTML='레시피 북 <kbd>Tab</kbd>';m.insertBefore(r,$('#menuGuide'));
  b.onclick=()=>{$('#menu').hidden=true;if(G.mode==='career')midSave();G.paused=false;toTitle();};r.onclick=()=>{$('#menu').hidden=true;G.paused=false;rbToggle(true);};
  const h=document.createElement('p');h.className='menu-keys';h.innerHTML='<kbd>Esc</kbd> 일시정지 · <kbd>Tab</kbd> 레시피 북 · <kbd>P</kbd> 잠깐 멈춤';m.appendChild(h);})();
