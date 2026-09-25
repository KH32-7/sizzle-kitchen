
/* ---------- 2.1 package-game feel: pack cursor, no browser behaviours, screen wipes, boot screen, fullscreen ---------- */
(()=>{const R=document.documentElement.style;R.setProperty('--ui-x',`url(${UIART.x})`);R.setProperty('--ui-ck0',`url(${UIART.ck0})`);R.setProperty('--ui-ck1',`url(${UIART.ck1})`);
  const st=document.createElement('style');st.textContent=`*{cursor:url(${UIART.cur}) 3 2,auto}html.mdown *{cursor:url(${UIART.curDown}) 3 2,auto}button:disabled{cursor:url(${UIART.cur}) 3 2,not-allowed}`;document.head.appendChild(st);})();
addEventListener('pointerdown',()=>document.documentElement.classList.add('mdown'),true);
addEventListener('pointerup',()=>document.documentElement.classList.remove('mdown'),true);
/* the kitchen canvas picks its own cursor; plain arrow / pointer become the pack arrow */
const CUR_A=`url(${UIART.cur}) 3 2,default`;
updateCursor=(orig=>function(){orig();const c=cv.style.cursor;if(c==='default'||c==='pointer'||c==='')cv.style.cursor=CUR_A;})(updateCursor);
/* a game window, not a web page: no context menu, no page zoom, no dragging pictures or selecting text */
addEventListener('contextmenu',e=>{if(!(e.target&&e.target.closest&&e.target.closest('input,textarea')))e.preventDefault();});
addEventListener('wheel',e=>{if(e.ctrlKey)e.preventDefault();},{passive:false});
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&['Equal','Minus','NumpadAdd','NumpadSubtract','Digit0','KeyS','KeyP','KeyF','KeyU'].includes(e.code))e.preventDefault();},true);
addEventListener('dragstart',e=>e.preventDefault());
addEventListener('selectstart',e=>{if(!(e.target&&e.target.closest&&e.target.closest('input,textarea')))e.preventDefault();});
/* moving between rooms: a quick warm fade hides the cut */
setScreen=(orig=>function(s){const p=SCR.cur;orig(s);if(p!==SCR.cur){let w=$('#uiWipe');if(!w){w=document.createElement('div');w.id='uiWipe';$('#stage').appendChild(w);}w.classList.remove('on');void w.offsetWidth;w.classList.add('on');}})(setScreen);
/* fullscreen from the title (F11 works too) */
function fsToggle(){try{if(document.fullscreenElement)document.exitFullscreen();else document.documentElement.requestFullscreen({navigationUI:'hide'});}catch(e){}}
(()=>{const t=$('#title');if(!t||$('#fsBtn'))return;const b=document.createElement('button');b.type='button';b.id='fsBtn';b.title='전체 화면';
  b.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';b.onclick=e=>{e.stopPropagation();fsToggle();};t.appendChild(b);})();
/* boot screen: logo while fonts and art decode, then "click to start" (which also unlocks sound) */
(()=>{if(/test2/.test(location.pathname))return;const d=document.createElement('div');d.id='boot';
  d.innerHTML='<div class="bt-logo">지글지글<span>키친</span><em>2nd SEASON</em></div><div class="bt-bar"><i></i></div><div class="bt-go" hidden>화면을 누르면 시작해요</div><div class="bt-cr">UI art: Cozy UI Pack by dobo_ui</div>';$('#stage').appendChild(d);
  const bar=d.querySelector('.bt-bar i'),go=d.querySelector('.bt-go');let p=0;const tick=setInterval(()=>{p=Math.min(p+.07+Math.random()*.08,.9);bar.style.width=p*100+'%';},90);
  const imgs=[GIMG.hall,GIMG.key].filter(Boolean).map(u=>{const i=new Image();i.src=u;return i.decode?i.decode().catch(()=>{}):Promise.resolve();});
  Promise.race([Promise.all([document.fonts?document.fonts.ready:0,...imgs,new Promise(r=>setTimeout(r,900))]),new Promise(r=>setTimeout(r,5000))]).then(()=>{clearInterval(tick);bar.style.width='100%';
    setTimeout(()=>{d.querySelector('.bt-bar').hidden=true;go.hidden=false;const start=()=>{d.classList.add('out');removeEventListener('keydown',key,true);AU.init&&AU.init();setTimeout(()=>d.remove(),600);},key=e=>{e.preventDefault();e.stopImmediatePropagation();start();};
      d.addEventListener('pointerdown',start,{once:true});addEventListener('keydown',key,true);},300);});})();
/* every on-screen button answers with a soft wooden "tok" */
AU.ui=function(){this.tone({f:560,f2:390,d:.06,v:.12});this.nz({f:1900,q:1,d:.018,v:.045});};
let uiTokT=0;addEventListener('pointerdown',e=>{const b=e.target&&e.target.closest&&e.target.closest('button');if(!b||b.disabled||!AU.on)return;const n=performance.now();if(n-uiTokT<45)return;uiTokT=n;try{AU.ui();}catch(err){}},true);
