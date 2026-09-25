
/* ---------- main render ---------- */
let BOARDIMG=null;
function buildBoardImg(){const B=L.board;BOARDIMG=mk((B.w+50)*PX,(B.h+50)*PX);const g=BOARDIMG.getContext('2d');g.scale(PX,PX);g.translate(25-B.x,25-B.y);drawBoardTo(g);}
function drawBoard(ox,oy,lift){const g=ctx,B=L.board;g.save();g.translate(ox,oy);
  if(lift){g.fillStyle='rgba(0,0,0,.25)';rr(g,B.x+22,B.y+28,B.w,B.h,18);g.fill();}
  g.drawImage(BOARDIMG,B.x-25,B.y-25,B.w+50,B.h+50);g.drawImage(MARKS,B.x,B.y,B.w,B.h);
  const Bd=G.board;g.save();if(Bd.spin>0){const e=ease(Bd.spin);g.translate(Bd.scx,Bd.scy);g.rotate(-e*PI/2*(Bd.sdir||1));g.translate(-Bd.scx,-Bd.scy);}
  for(const p of Bd.pieces)pieceShadow(g,p,p.x,p.y,2,.16);for(const p of Bd.pieces)drawPiece(g,p,p.x,p.y);g.restore();g.restore();}
function drawDragged(c){const g=ctx;if(c.cook)drawCW(c);else if(c.kind==='strainer')drawStrainer(g,c,c.x,c.y,true);else if(c.kind==='mix'){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.arc(c.x+18,c.y+22,L.mix.r,0,TAU);g.fill();steelDisc(g,c.x,c.y,L.mix.r);drawMix(g,c,c.x,c.y);}else drawVessel(c);}
function render(){const g=ctx;g.setTransform(PX,0,0,PX,0,0);FC||0;
  g.drawImage(BG,0,0,W,H);g.drawImage(STAIN,0,0,W,H);drawFluid(g,G.counter,0,0);drawTowelSpot(g);
  const canHover=G.started&&!G.held&&!G.drag,sh=canHover?shelfAt(M.x,M.y):null;
  for(const p of PANTRY){const lk=!ingOpen(p.id);g.save();if(sh===p&&!lk)g.translate(0,-4);if(lk)g.globalAlpha=sh===p?.4:.1;drawPantryItem(g,p,p.row===1?140:214);g.restore();
    if(lk){if(sh===p){g.font='12px sans-serif';g.textAlign='center';g.fillStyle='rgba(255,240,220,.85)';g.fillText('🔒',p.x,p.row===1?112:192);}continue;}
    g.font='600 11px "Gowun Dodum", sans-serif';g.textAlign='center';g.fillStyle='rgba(246,234,214,.9)';g.fillText(p.n,p.x,p.row===1?150:224);
    if(p.kind==='noodle'&&G.mode!=='practice'){const n=G.stock[p.id]||0;g.font='11px "Jua", sans-serif';g.fillStyle=n?'rgba(240,174,58,.95)':'rgba(220,120,100,.9)';g.fillText(n?'×'+n:'품절',p.x+26,p.row===1?92:170);}}
  if(canHover&&inFridge(M.x,M.y)){g.strokeStyle='rgba(255,220,150,.8)';g.lineWidth=3;rr(g,L.fridge.x-2,L.fridge.y-2,L.fridge.w+4,L.fridge.h+4,12);g.stroke();}
  const bd=G.drag&&G.drag.kind==='board';if(!bd)drawBoard(0,0,false);
  drawRackTools();
  const dragC=G.drag&&G.drag.kind==='cont'&&G.drag.moved?G.drag.c:null;
  for(const p of G.prep)if(p!==dragC){g.save();g.translate(p.x,p.y);drawContents(g,p);g.restore();}
  if(G.mix!==dragC)drawMix(g,G.mix,G.mix.x,G.mix.y);
  drawSink();
  for(const b of G.burners)drawFlame(b);g.drawImage(GRATE,0,0,W,H);for(const c of G.cw)drawGlow(c);for(const c of G.cw)if(c!==dragC)drawCW(c);drawSteamer();
  drawKnobs();
  for(const v of [G.plate,G.bowl])if(v!==dragC)drawVessel(v);
  for(const q of G.parts){switch(q.k){
    case'drop':g.fillStyle='rgba(255,238,175,.85)';g.beginPath();g.arc(q.x,q.y-q.z,1.3+q.z/70,0,TAU);g.fill();break;
    case'juice':g.fillStyle=rgba(q.col,.8);g.beginPath();g.arc(q.x,q.y-q.z,1.6,0,TAU);g.fill();break;
    case'flake':if(q.type==='flour'){g.fillStyle='rgba(255,255,250,.8)';g.beginPath();g.arc(q.x,q.y-q.z,2,0,TAU);g.fill();}else drawSeed(g,q,q.x,q.y-q.z);break;
    case'bub':{const a=q.life/q.max;g.strokeStyle=(q.col||'rgba(255,255,255,')+((1-a)*.7)+')';g.lineWidth=1;g.beginPath();g.arc(q.x,q.y,q.r*(.6+a*.6),0,TAU);g.stroke();break;}
    case'spark':{const a=q.life/q.max,r=q.r*(1-a*.5);g.save();g.translate(q.x,q.y);g.rotate(q.life*4);g.fillStyle=`rgba(255,226,120,${1-a})`;g.beginPath();for(let i=0;i<8;i++){const rr3=i%2?r*.35:r;g.lineTo(Math.cos(i*PI/4)*rr3,Math.sin(i*PI/4)*rr3);}g.closePath();g.fill();g.restore();break;}
    case'ring':{const a=q.life/q.max;g.strokeStyle=`rgba(235,245,255,${(1-a)*.5})`;g.lineWidth=1;g.beginPath();g.ellipse(q.x,q.y,q.r+a*10,(q.r+a*10)*.8,0,0,TAU);g.stroke();break;}
    case'pd':{const t=q.life/q.max,x=lerp(q.x0,q.x1,t),y=lerp(q.y0,q.y1,t*t),col=LQ[q.key].col;g.fillStyle=rgba(col,q.key==='water'?.55:.9);g.beginPath();g.arc(x,y,1.6+q.m*1.5,0,TAU);g.fill();break;}}}
  if(dragC)drawDragged(dragC);if(bd)drawBoard(G.board.ox,G.board.oy,true);
  for(const q of G.parts){if(q.k==='steam'||q.k==='smoke'){const a=q.life/q.max;g.globalAlpha=q.a*(1-a)*Math.min(1,q.life/.2);g.drawImage(q.k==='steam'?SP.steam:SP.smoke,q.x-q.r,q.y-q.r,q.r*2,q.r*2);}}
  g.globalAlpha=1;g.save();g.globalCompositeOperation='lighter';for(const q of G.parts){if(q.k==='fire'){const a=q.life/q.max;g.globalAlpha=(1-a)*.85;g.drawImage(SP.flame,q.x-q.r,q.y-q.r,q.r*2,q.r*2);}}g.restore();g.globalAlpha=1;
  if(G.smoke>1){g.fillStyle=`rgba(125,120,115,${Math.min(UPG.fan?.18:.32,(G.smoke-1)*(UPG.fan?.018:.035))})`;g.fillRect(0,0,W,H);}
  drawTutHL(g);
  if(G.drag&&G.drag.kind==='handful'){for(const p of G.drag.pieces)pieceShadow(g,p,M.x+p.ox*.8,M.y+p.oy*.8,12,.22);for(const p of G.drag.pieces)drawPiece(g,p,M.x+p.ox*.8,M.y+p.oy*.8);}
  if(!G.hideCursor&&G.started){drawHeld();if(G.held||G.ladle){const h=G.held,nm=!h?'국자에 담음':h.kind==='ing'?ING[h.piece.type].n:h.kind==='bottle'?BOT[h.id].label:h.kind==='shaker'?SHK[h.id].n:h.kind==='powder'?'부침가루':h.kind==='noodle'?NT[h.nt].n:h.kind==='noodleObj'?'면':({rice:'찬밥',egg:'계란',begg:'삶은 계란',packet:'라면 스프',ice:'얼음',nori:'김',butter:'버터',custard:'계란찜',steamerItem:'찜기'})[h.kind]||'';const t2=`${nm} · 우클릭=${h&&h.kind!=='packet'?'제자리':'내려놓기'}`;g.font='13px "Jua", sans-serif';const w=g.measureText(t2).width+16;uiPill(g,M.x-w/2,M.y+38,w,23);g.fillStyle='#5a2e22';g.textAlign='center';g.fillText(t2,M.x,M.y+54);}
    const overUI=knobAt(M.x,M.y)||shelfAt(M.x,M.y)||rackAt(M.x,M.y)||handleAt(M.x,M.y)||inFridge(M.x,M.y);
    if(!G.held&&!(G.drag&&G.drag.kind!=='spat')&&!overUI&&M.inside){const s=G.spat;
      if(G.tool==='knife'){if(inBoard(M.x,M.y)&&G.knife.down<.2){g.save();g.translate(M.x,M.y);g.rotate(G.knife.ang);g.strokeStyle='rgba(255,255,255,.45)';g.setLineDash([4,6]);g.lineWidth=1;g.beginPath();g.moveTo(0,-KN_UP-40);g.lineTo(0,KN_DN+10);g.stroke();g.setLineDash([]);g.restore();}drawKnifeTop(g,M.x,M.y,G.knife.ang,G.knife.down);
        if(Math.abs(G.knife.ang)>.03){g.fillStyle='rgba(20,14,10,.7)';g.font='12px "Jua", sans-serif';g.textAlign='left';g.fillText(Math.round(G.knife.ang*180/PI)+'°',M.x+14,M.y+KN_DN+26);}}
      else if(G.tool==='spatula')drawSpatula(g,s.x,s.y,s.ang,s.down);
      else if(G.tool==='chop')drawChop(g,M.x,M.y,s.down,-.45);
      else if(G.tool==='ladle')drawLadle(g,M.x,M.y,s.down,G.ladle);
      else if(G.tool==='probe'){const [pv,lines]=probeInfo(M.x,M.y);drawProbe(g,M.x,M.y,pv);if(lines.length){g.font='600 13px "Gowun Dodum", sans-serif';const w=Math.max(...lines.map(l=>g.measureText(l).width))+18;g.fillStyle='rgba(12,20,14,.9)';rr(g,M.x+22,M.y+62,w,lines.length*19+10,7);g.fill();g.fillStyle='#bff5c8';g.textAlign='left';lines.forEach((l,i)=>g.fillText(l,M.x+31,M.y+80+i*19));}}}}
  for(const t of G.texts){const a=t.life/t.max;g.save();g.translate(t.x,t.y-a*34);g.rotate(t.rot);g.globalAlpha=a<.7?1:1-(a-.7)/.3;g.font=`${t.size}px "Black Han Sans", sans-serif`;g.textAlign='center';g.lineWidth=6;g.strokeStyle='rgba(30,15,8,.65)';g.lineJoin='round';g.strokeText(t.text,0,0);g.fillStyle=t.col;g.fillText(t.text,0,0);g.restore();}}
