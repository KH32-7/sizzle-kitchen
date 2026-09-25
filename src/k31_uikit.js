
/* ---------- 1.4 UI kit: one close button style + Esc for every panel · goals live in a top-bar chip ---------- */
const PANEL_CLOSE={fridge:()=>{$('#fridge').hidden=true;AU.door&&AU.door();},market:()=>{$('#market').hidden=true;},dlcPanel:()=>{$('#dlcPanel').hidden=true;renderTitle();},practice:()=>toTitle(),
  setPanel:()=>closeSettings(),achPanel:()=>{$('#achPanel').hidden=true;},shopPanel:()=>closeShop(),rbook:()=>rbToggle(false)};
function addCloseX(){for(const id in PANEL_CLOSE){const o=$('#'+id);if(!o)continue;const card=o.firstElementChild;if(!card||card.querySelector(':scope>.x-close'))continue;
    const b=document.createElement('button');b.type='button';b.className='x-close';b.title='닫기 (Esc)';b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    b.onclick=e=>{e.stopPropagation();PANEL_CLOSE[id]();};card.style.position=card.style.position||'relative';card.appendChild(b);}}
/* panels re-render their innerHTML, so re-attach the button whenever one opens */
setInterval(addCloseX,300);addCloseX();
closeTopPanel=(orig=>function(){if(orig())return true;for(const id of ['market','fridge']){const e=$('#'+id);if(e&&!e.hidden){PANEL_CLOSE[id]();return true;}}return false;})(closeTopPanel);
/* goals: a compact chip in the top bar (click for the list) instead of a panel on the counter */
renderGoals=(orig=>function(){orig();const box=$('#goals');let c=$('#goalChip');if(!c){c=document.createElement('button');c.type='button';c.id='goalChip';$('#top .st').appendChild(c);c.onclick=e=>{e.stopPropagation();$('#goals').classList.toggle('open');};}
  const on=box&&!box.hidden;c.hidden=!on;if(!on){box&&box.classList.remove('open');return;}const L=SAVE.goals.list,d=L.filter(q=>q.done).length;c.innerHTML=`🎯 목표 <b>${d}/${L.length}</b>`;c.classList.toggle('all',d===L.length);})(renderGoals);
addEventListener('pointerdown',e=>{const g=$('#goals');if(g&&g.classList.contains('open')&&!g.contains(e.target)&&e.target.id!=='goalChip')g.classList.remove('open');});
