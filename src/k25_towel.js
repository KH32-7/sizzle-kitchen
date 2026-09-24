
/* ---------- 행주: wipe drips off the plate / bowl rim (replaces plating mode) ---------- */
const TOWEL={x:455,y:952,w:92,h:58};
const towelSpotAt=(x,y)=>Math.abs(x-TOWEL.x)<TOWEL.w/2+6&&Math.abs(y-TOWEL.y)<TOWEL.h/2+6;
function drawTowelCloth(g,x,y,rot,sc,press){g.save();g.translate(x,y);g.rotate(rot);g.scale(sc,sc*(press?.92:1));const w=TOWEL.w,h=TOWEL.h;
  g.fillStyle='rgba(0,0,0,.22)';rr(g,-w/2+4,-h/2+6,w,h,9);g.fill();
  g.fillStyle='#f6f1e6';rr(g,-w/2,-h/2,w,h,9);g.fill();g.save();rr(g,-w/2,-h/2,w,h,9);g.clip();
  g.fillStyle='rgba(194,58,27,.78)';for(const yy of [-h/2+9,h/2-15])g.fillRect(-w/2,yy,w,6);g.fillStyle='rgba(194,58,27,.35)';for(const yy of [-h/2+17,h/2-21])g.fillRect(-w/2,yy,w,2);
  g.strokeStyle='rgba(120,100,80,.12)';g.lineWidth=1;for(let i=-w/2;i<w/2;i+=5){g.beginPath();g.moveTo(i,-h/2);g.lineTo(i,h/2);g.stroke();}
  g.fillStyle='rgba(0,0,0,.08)';g.fillRect(-w/2,-2,w,4);g.restore();
  g.strokeStyle='rgba(120,90,60,.35)';g.lineWidth=1.2;rr(g,-w/2,-h/2,w,h,9);g.stroke();g.restore();}
function drawTowelSpot(g){if(!G||!G.started)return;
  if(G.tool!=='towel'){const hv=!G.held&&!G.drag&&towelSpotAt(M.x,M.y);drawTowelCloth(g,TOWEL.x,TOWEL.y-(hv?3:0),-.08,1,false);
    g.fillStyle='rgba(60,50,40,.7)';g.font='600 11px "Gowun Dodum", sans-serif';g.textAlign='center';g.fillText('행주 (T)',TOWEL.x,TOWEL.y+TOWEL.h/2+15);}
  else{g.strokeStyle='rgba(90,70,50,.35)';g.setLineDash([5,5]);g.lineWidth=1.5;rr(g,TOWEL.x-TOWEL.w/2,TOWEL.y-TOWEL.h/2,TOWEL.w,TOWEL.h,9);g.stroke();g.setLineDash([]);}}
function towelWipe(x,y){let n=0;for(const c of [G.plate,G.bowl]){if(!c.drips||!c.drips.length)continue;const [r0,r1]=dripR(c),n0=c.drips.length;
    c.drips=c.drips.filter(d=>{const r=lerp(r0,r1,d.f);return Math.hypot(c.x+Math.cos(d.a)*r-x,c.y+Math.sin(d.a)*r-y)>24;});if(c.drips.length<n0){n+=n0-c.drips.length;c.wiped=true;}}
  if(n){AU.pick();if(Math.random()<.5)floatText(pick(['뽀득','싹싹','깨끗!']),x,y-30,'#fff3cf',20);}
  else if(!contAt(x,y)&&y>230)wipeAt(x,y);}
const hasDrips=c=>!!(c&&c.drips&&c.drips.length);
cv.addEventListener('pointerdown',e=>{if(!G||!G.started||G.paused||e.button!==0||G.held)return;const q=toLocal(e);
  if(towelSpotAt(q.x,q.y)){e.stopImmediatePropagation();AU.init();setTool(G.tool==='towel'?'hand':'towel');return;}
  if(G.tool==='towel'&&!knobAt(q.x,q.y)&&!rackAt(q.x,q.y)&&!shelfAt(q.x,q.y)&&!inFridge(q.x,q.y)){e.stopImmediatePropagation();M.x=q.x;M.y=q.y;M.down=true;G.drag={kind:'towel'};towelWipe(q.x,q.y);}},true);
cv.addEventListener('pointermove',e=>{if(G&&G.drag&&G.drag.kind==='towel'){const q=toLocal(e);towelWipe(q.x,q.y);}},true);
addEventListener('pointerup',()=>{if(G&&G.drag&&G.drag.kind==='towel'){G.drag=null;M.down=false;}});
addEventListener('keydown',e=>{if(!G||!G.started||G.paused||e.code!=='KeyT'||e.repeat)return;if(G.held)returnHeld();setTool(G.tool==='towel'?'hand':'towel');});
render=(orig=>function(){orig();if(!G||!G.started||G.hideCursor||G.tool!=='towel'||G.held||!M.inside)return;const g=ctx;g.setTransform(PX,0,0,PX,0,0);
  const sc=G.drag&&G.drag.kind==='towel';drawTowelCloth(g,M.x+(sc?Math.sin(G.t*40)*3:0),M.y,-.25,.62,sc);})(render);
updateCursor=(orig=>function(){orig();if(!G)return;if(G.tool==='towel'&&!G.held&&!knobAt(M.x,M.y)&&!rackAt(M.x,M.y)&&!shelfAt(M.x,M.y))cv.style.cursor='none';else if(!G.held&&towelSpotAt(M.x,M.y))cv.style.cursor='pointer';})(updateCursor);
clearCont=(orig=>function(c){orig(c);c.drips=[];c.wiped=false;})(clearCont);
hintText=(orig=>function(){const r=orig();if(r[0]==='warn'||G.held)return r;if(G.tool==='towel')return['','행주: 누른 채 그릇·접시 테두리를 문질러 국물 자국을 닦아요. 조리대도 닦여요. 우클릭하면 내려놓아요.'];
  const o=selOrder();if(o){const v=vesselOf(RID[o.rid]);if(hasDrips(v)&&!contEmpty(v))return['','그릇 테두리에 국물이 묻었어요 — 행주(T)로 닦고 내면 깔끔해요.'];}return r;})(hintText);
