
/* ---------- tools ---------- */
function drawKnifeSide(g,x,y,dn){const path=(ox,oy)=>{g.beginPath();g.moveTo(ox,oy+KN_DN);g.lineTo(ox,oy-KN_UP+30);g.quadraticCurveTo(ox,oy-KN_UP,ox+6,oy-KN_UP);g.quadraticCurveTo(ox+17,oy-KN_UP+40,ox+18,oy-KN_UP+80);g.lineTo(ox+18,oy+KN_DN);g.closePath();};
  g.fillStyle='rgba(0,0,0,.22)';path(x+4,y+5);g.fill();path(x,y);const gr=g.createLinearGradient(x,0,x+18,0);gr.addColorStop(0,'#f1f4f7');gr.addColorStop(.3,'#bcc3ca');gr.addColorStop(1,'#858c93');g.fillStyle=gr;g.fill();
  g.fillStyle='#cfd3d8';g.fillRect(x-1,y+KN_DN,20,9);rr(g,x,y+KN_DN+8,19,108,8);const hg=g.createLinearGradient(x,0,x+19,0);hg.addColorStop(0,'#4a3326');hg.addColorStop(1,'#20150f');g.fillStyle=hg;g.fill();g.fillStyle='#dfe3e6';for(const k of [26,58,90]){g.beginPath();g.arc(x+9.5,y+KN_DN+8+k,2.6,0,TAU);g.fill();}}
function drawKnifeTop(g,x,y,ang,dn){g.save();g.translate(x,y);g.rotate(ang);
  const lift=(1-dn)*14+2;g.save();g.translate(lift*.7,lift*.9);g.fillStyle='rgba(0,0,0,.16)';g.beginPath();g.moveTo(0,-KN_UP+10);g.lineTo(18*(1-dn*.6),-KN_UP+70);g.lineTo(18*(1-dn*.6),KN_DN);g.lineTo(0,KN_DN);g.closePath();g.fill();rr(g,-6,KN_DN+8,20,108,8);g.fill();g.restore();
  g.translate(0,dn*3);
  g.beginPath();g.moveTo(-.2,-KN_UP);g.quadraticCurveTo(3.4,-KN_UP+30,3.6,-KN_UP+80);g.lineTo(3.6,KN_DN);g.lineTo(-.8,KN_DN);g.lineTo(-.8,-KN_UP+20);g.closePath();
  const gr=g.createLinearGradient(-1,0,4,0);gr.addColorStop(0,'#ffffff');gr.addColorStop(.3,'#c9d0d6');gr.addColorStop(1,'#7e858c');g.fillStyle=gr;g.fill();
  g.strokeStyle='rgba(255,255,255,.95)';g.lineWidth=1;g.beginPath();g.moveTo(0,-KN_UP+6);g.lineTo(0,KN_DN);g.stroke();
  g.fillStyle='#aeb4ba';rr(g,-4,KN_DN-2,12,12,3);g.fill();
  rr(g,-6.5,KN_DN+8,17,108,7);const hg=g.createLinearGradient(-6,0,11,0);hg.addColorStop(0,'#5a3e2e');hg.addColorStop(.5,'#3a271c');hg.addColorStop(1,'#1f150f');g.fillStyle=hg;g.fill();
  g.fillStyle='#e3e6e9';for(const k of [28,60,92]){g.beginPath();g.arc(2,KN_DN+8+k,2.2,0,TAU);g.fill();}
  g.restore();}
function drawSpatula(g,x,y,ang,down,sc){let sg=Math.sin(ang+PI/2)<0?-1:1;const lift=down?2:10;
  const dr=(ox,oy,sh)=>{g.save();g.translate(ox,oy);g.rotate(ang);g.scale(sc||1,(sc||1)*sg);rr(g,-38,-3,76,44,8);if(sh){g.fillStyle='rgba(0,0,0,.25)';g.fill();rr(g,-8,38,16,140,7);g.fill();g.restore();return;}
    g.fillStyle='#26272a';g.fill();g.strokeStyle='rgba(255,255,255,.14)';g.lineWidth=1.5;g.beginPath();g.moveTo(-36,-1);g.lineTo(36,-1);g.stroke();g.fillStyle='#111214';for(const sx of [-20,0,20]){rr(g,sx-3,8,6,24,3);g.fill();}
    g.fillStyle='#8f9398';g.fillRect(-7,38,14,12);rr(g,-8,48,16,130,7);const hg=g.createLinearGradient(-8,0,8,0);hg.addColorStop(0,'#b58456');hg.addColorStop(1,'#7b5431');g.fillStyle=hg;g.fill();g.restore();};
  dr(x+lift,y+lift*1.2,true);dr(x,y,false);}
function drawChop(g,x,y,down,rot){g.save();g.translate(x,y);g.rotate(rot||-.5);const l=down?1:6;g.fillStyle='rgba(0,0,0,.2)';g.beginPath();g.moveTo(l+1,l);g.lineTo(l+10,l+200);g.lineTo(l+16,l+200);g.lineTo(l+3,l);g.fill();
  for(const o of [[0,0,1],[7,4,-1]]){g.save();g.translate(o[0],o[1]);g.rotate(o[2]*.03);const gr=g.createLinearGradient(-3,0,3,0);gr.addColorStop(0,'#d7b384');gr.addColorStop(1,'#9a7446');g.fillStyle=gr;g.beginPath();g.moveTo(-1.2,0);g.lineTo(1.2,0);g.lineTo(3.2,200);g.lineTo(-3.2,200);g.closePath();g.fill();g.fillStyle='#b5322a';g.fillRect(-3.2,150,6.4,6);g.restore();}g.restore();}
function drawLadle(g,x,y,down,cont){g.save();g.translate(x,y);const l=down?2:9;g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.arc(l,l*1.2,22,0,TAU);g.fill();g.save();g.translate(l,l*1.2);g.rotate(-.7);g.fillRect(-3,20,6,150);g.restore();
  const gr=g.createRadialGradient(-6,-7,2,0,0,23);gr.addColorStop(0,'#f2f4f6');gr.addColorStop(1,'#7c838a');g.fillStyle=gr;g.beginPath();g.arc(0,0,22,0,TAU);g.fill();
  if(cont){g.fillStyle=cont.col;g.beginPath();g.arc(0,0,17,0,TAU);g.fill();if(cont.begg)drawBegg(g,cont.begg,0,0);g.fillStyle='rgba(255,255,255,.3)';g.beginPath();g.ellipse(-6,-6,6,3,-.6,0,TAU);g.fill();}
  else{g.fillStyle='#9aa2a9';g.beginPath();g.arc(0,0,17,0,TAU);g.fill();}
  g.rotate(-.7);const hg=g.createLinearGradient(-3,0,3,0);hg.addColorStop(0,'#e3e6e9');hg.addColorStop(1,'#80878e');g.fillStyle=hg;rr(g,-3.5,20,7,150,3);g.fill();g.restore();}
function drawProbe(g,x,y,val){g.save();g.translate(x,y);g.fillStyle='rgba(0,0,0,.2)';g.fillRect(4,6,2,70);g.strokeStyle='#cfd4d9';g.lineWidth=2;g.beginPath();g.moveTo(0,0);g.lineTo(0,70);g.stroke();rr(g,-16,70,32,44,6);g.fillStyle='#e0412a';g.fill();rr(g,-12,76,24,16,3);g.fillStyle='#16201a';g.fill();
  g.fillStyle='#7cf29a';g.font='600 10px "IBM Plex Mono", monospace';g.textAlign='center';g.fillText(val===null?'--':Math.round(val)+'°',0,88);g.restore();}
function drawRackTools(){const g=ctx,rh=G.started&&!G.held&&!G.drag?rackAt(M.x,M.y):null,cy=L.rack.y+30;
  for(const t of RACKT){if(G.tool===t.id){g.strokeStyle='rgba(255,255,255,.2)';g.setLineDash([5,5]);g.lineWidth=1.5;rr(g,t.x0,L.rack.y+6,t.x1-t.x0,L.rack.h-12,8);g.stroke();g.setLineDash([]);continue;}
    const lift=rh===t.id?3:0,x0=t.x0+6,x1=t.x1-6,y=cy-lift;g.save();
    if(t.id==='knife'){g.translate(t.cx,y);g.rotate(-PI/2);g.scale(.56,.56);drawKnifeSide(g,-9,-13,.7);}
    else if(t.id==='spatula'){g.fillStyle='rgba(0,0,0,.3)';rr(g,x0+2,y-9,34,22,5);g.fill();rr(g,x0,y-11,34,22,5);g.fillStyle='#26272a';g.fill();g.fillStyle='#111214';for(let k=0;k<3;k++)g.fillRect(x0+8+k*8,y-6,3,12);g.fillStyle='#8f9398';g.fillRect(x0+34,y-3,6,6);const hg=g.createLinearGradient(0,y-4,0,y+4);hg.addColorStop(0,'#c08e5e');hg.addColorStop(1,'#7b5431');g.fillStyle=hg;rr(g,x0+40,y-4,x1-x0-40,8,4);g.fill();}
    else if(t.id==='chop'){for(const o of [-4,4]){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(x0+2,y+o+2,x1-x0,3);const hg=g.createLinearGradient(x0,0,x1,0);hg.addColorStop(0,'#9a7446');hg.addColorStop(1,'#d7b384');g.fillStyle=hg;g.beginPath();g.moveTo(x0,y+o-1);g.lineTo(x1,y+o-2);g.lineTo(x1,y+o+2);g.lineTo(x0,y+o+1);g.closePath();g.fill();g.fillStyle='#b5322a';g.fillRect(x1-18,y+o-2,4,4);}}
    else if(t.id==='ladle'){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.arc(x0+16,y+3,14,0,TAU);g.fill();steelDisc(g,x0+14,y,14);g.fillStyle='#9aa2a9';g.beginPath();g.arc(x0+14,y,10,0,TAU);g.fill();const hg=g.createLinearGradient(0,y-3,0,y+3);hg.addColorStop(0,'#e3e6e9');hg.addColorStop(1,'#80878e');g.fillStyle=hg;rr(g,x0+26,y-3,x1-x0-26,6,3);g.fill();}
    else if(t.id==='probe'){g.strokeStyle='#cfd4d9';g.lineWidth=2;g.beginPath();g.moveTo(x0,y);g.lineTo(x0+24,y);g.stroke();rr(g,x0+22,y-9,x1-x0-22,18,5);g.fillStyle='#e0412a';g.fill();g.fillStyle='#16201a';rr(g,x0+26,y-5,14,10,2);g.fill();}
    g.restore();}
  g.font='600 10px "IBM Plex Mono", monospace';g.textAlign='left';RACKT.forEach((t,i)=>{g.fillStyle='rgba(0,0,0,.5)';rr(g,t.x0+2,L.rack.y+3,14,13,3);g.fill();g.fillStyle='rgba(255,225,190,.85)';g.fillText(String(i+2),t.x0+6,L.rack.y+13);});g.fillStyle='rgba(255,225,190,.45)';g.fillText('Q 도구↔손',L.rack.x+L.rack.w-70,L.rack.y+L.rack.h-5);}

function underState(v){return v<.35?0:v<.5?1:v<=1.05?2:3;}
const UCOL=[[235,225,200],[240,200,90],[120,210,90],[225,60,35]];
function drawUnder(g,x,y,R,v,label){const st=underState(v),t=G.t,c=UCOL[st];
  g.save();g.strokeStyle=rgba(st===0?[240,230,205]:st===1?[240,200,90]:st===2?[226,160,50]:[210,50,30],st===3?.55+.35*Math.sin(t*12):st===0?.3:.6);g.lineWidth=st>=2?4:2.5;g.setLineDash(st===0?[4,6]:[]);g.beginPath();g.arc(x,y,R+4,0,TAU);g.stroke();g.restore();
  const gx=x+R*.72+8,gy=y-R*.72-8,pulse=st===2?1+.12*Math.sin(t*8):1;g.save();g.translate(gx,gy);g.scale(pulse,pulse);
  g.fillStyle='rgba(15,10,8,.88)';g.beginPath();g.arc(0,0,15,0,TAU);g.fill();g.strokeStyle='rgba(255,255,255,.15)';g.lineWidth=4;g.beginPath();g.arc(0,0,10,0,TAU);g.stroke();
  g.strokeStyle=rgba(c,1);g.lineWidth=4;g.lineCap='round';g.beginPath();g.arc(0,0,10,-PI/2,-PI/2+TAU*clamp(v/1.05,.02,1));g.stroke();
  g.fillStyle=rgba(c,1);g.font='700 12px "IBM Plex Mono", monospace';g.textAlign='center';g.fillText(st===2?'✓':st===3?'!':Math.round(clamp(v/.5,0,1)*100)+'',0,4);g.restore();
  if(label){const txt=st===2?'뒤집기 OK':st===3?'타요!':st===1?'거의 됐어요':'아랫면 익는 중';g.font='600 12px "Gowun Dodum", sans-serif';const w=g.measureText(txt).width+12;g.fillStyle=st===3?'rgba(160,30,15,.9)':st===2?'rgba(40,90,30,.9)':'rgba(15,10,8,.78)';rr(g,gx-w/2,gy+18,w,20,8);g.fill();g.fillStyle='#fff';g.textAlign='center';g.fillText(txt,gx,gy+32);}}
function underFx(c){if(c.liq&&c.liq.vol>15)return;const list=[];for(const j of c.jeons)list.push([j,j.fb[j.down],avgRad(j),'jeon']);for(const e of c.eggs)if(!e.poach&&e.pour>.8)list.push([e,e.fb[e.down],avgRad(e),'egg']);for(const o of c.items)if(o.L&&o.z<1)list.push([o,o.face[o.down],o.r,'beef']);
  for(const [o,v,R,k] of list){const st=underState(v),key='_us'+o.down,prev=o[key]||0;
    if(st>prev){if(st===2){for(let i=0;i<16;i++){const a=rand(0,TAU);spawn({k:'spark',x:c.x+o.x+Math.cos(a)*R,y:c.y+o.y+Math.sin(a)*R,vx:Math.cos(a)*50,vy:Math.sin(a)*50-25,max:rand(.5,.9),r:rand(2.5,4.5)});}
        floatText(k==='egg'?'바닥이 노릇해요':'노릇노릇! 뒤집을 때',c.x+o.x,c.y+o.y-R-24,'#ffe39a',24);AU.tone({f:1568,d:.25,v:.05});AU.tone({f:2093,d:.3,v:.04,delay:.07});}
      else if(st===3){floatText('타요! 뒤집거나 불을 줄여요',c.x+o.x,c.y+o.y-R-24,'#ff8a6a',24);AU.tone({f:440,f2:300,d:.25,v:.06});}}
    o[key]=st;}}
/* ---------- stove & cookware ---------- */
function drawFlame(b){if(!b.lit||b.level<=0)return;const g=ctx,L2=b.level,n=b.rb>50?30:22;g.save();g.globalCompositeOperation='lighter';
  const gr=g.createRadialGradient(b.x,b.y,b.rb-6,b.x,b.y,b.rb+10+L2*48);gr.addColorStop(0,'rgba(90,160,255,.95)');gr.addColorStop(.55,'rgba(70,110,255,.6)');gr.addColorStop(.85,L2>.75?'rgba(255,150,70,.35)':'rgba(110,90,255,.25)');gr.addColorStop(1,'rgba(90,60,255,0)');g.fillStyle=gr;g.beginPath();
  for(let i=0;i<n;i++){const a=i/n*TAU,fl=.72+.2*Math.sin(G.t*23+i*1.7)+.08*Math.sin(G.t*41+i*3.1),len=(8+L2*44)*fl,c=Math.cos(a),s=Math.sin(a),w=.1;
    g.moveTo(b.x+Math.cos(a-w)*b.rb,b.y+Math.sin(a-w)*b.rb);g.quadraticCurveTo(b.x+c*(b.rb+len*.6)-s*4,b.y+s*(b.rb+len*.6)+c*4,b.x+c*(b.rb+len),b.y+s*(b.rb+len));g.quadraticCurveTo(b.x+c*(b.rb+len*.6)+s*4,b.y+s*(b.rb+len*.6)-c*4,b.x+Math.cos(a+w)*b.rb,b.y+Math.sin(a+w)*b.rb);g.closePath();}
  g.fill();g.globalAlpha=.25+L2*.2;g.drawImage(SP.glow,b.x-b.rb-20,b.y-b.rb-20,(b.rb+20)*2,(b.rb+20)*2);g.restore();}
function drawGlow(c){const b=G.burners[c.burner];if(!c.onBurner||!b.lit||b.level<=0)return;const g=ctx,gr=g.createRadialGradient(c.x,c.y,c.r+8,c.x,c.y,c.r+46);gr.addColorStop(0,`rgba(110,150,255,${.22*b.level})`);gr.addColorStop(.5,`rgba(${b.level>.7?'255,140,60':'90,120,255'},${.1*b.level})`);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.beginPath();g.arc(c.x,c.y,c.r+46,0,TAU);g.fill();}
function drawHandle(g,c,x,y,lift){const co=Math.cos(c.ha),s=Math.sin(c.ha),hov=!G.drag&&!G.held&&handleAt(M.x,M.y)===c;g.lineCap='round';
  const one=(sg)=>{const x0=x+sg*co*(c.r+(c.loops?4:8)),y0=y+sg*s*(c.r+(c.loops?4:8)),x1=x+sg*co*(c.r+8+c.hl),y1=y+sg*s*(c.r+8+c.hl);const so=lift?22:7;
    g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=c.loops?12:22;g.beginPath();g.moveTo(x0+so*.6,y0+so);g.lineTo(x1+so*.6,y1+so);g.stroke();
    if(c.loops){g.strokeStyle=hov?'#e8ecef':'#b8bec4';g.lineWidth=8;g.beginPath();const px=-s*14,py=co*14;g.moveTo(x0+px,y0+py);g.quadraticCurveTo(x1+px*1.4+sg*co*6,y1+py*1.4+sg*s*6,x1,y1);g.quadraticCurveTo(x1-px*1.4+sg*co*6,y1-py*1.4+sg*s*6,x0-px,y0-py);g.stroke();return;}
    const xm=x0+co*30,ym=y0+s*30;g.strokeStyle='#8a8e94';g.lineWidth=12;g.beginPath();g.moveTo(x0,y0);g.lineTo(xm,ym);g.stroke();
    g.strokeStyle=c.kind==='sauce'?(hov?'#7a5436':'#5a3c26'):(hov?'#34363b':'#1e1f22');g.lineWidth=c.kind==='sauce'?16:20;g.beginPath();g.moveTo(xm-co*4,ym-s*4);g.lineTo(x1,y1);g.stroke();
    g.strokeStyle='rgba(255,255,255,.14)';g.lineWidth=3;g.beginPath();g.moveTo(xm-s*5,ym+co*5-2);g.lineTo(x1-s*5-co*6,y1+co*5-s*6-2);g.stroke();g.fillStyle='#0c0c0e';g.beginPath();g.arc(x1-co*12,y1-s*12,3.5,0,TAU);g.fill();};
  one(1);if(c.loops)one(-1);}
function tempCol(T){return T<60?'#7fd1ff':T<100?'#9fe8c0':T<180?'#ffcc4d':T<235?'#ff8a3d':'#ff4d3d';}
function drawCW(c){const g=ctx;let x=c.x,y=c.y;if(c.tossT>0){const pr=1-c.tossT/.45,o=Math.sin(pr*PI)*18;x-=Math.cos(c.ha)*o;y-=Math.sin(c.ha)*o;}
  const lift=c.drag||c.ret,R=c.r+(c.kind==='pan'?14:12);g.fillStyle=`rgba(0,0,0,${lift?.28:.45})`;const so=lift?26:8;g.beginPath();g.ellipse(x+so*.6,y+so,R,R*.97,0,0,TAU);g.fill();
  drawHandle(g,c,x,y,lift);g.drawImage(c.sprite,x-R,y-R,R*2,R*2);g.save();g.translate(x,y);
  for(const r of c.residue){g.fillStyle=`rgba(30,16,8,${r.a})`;g.beginPath();g.arc(r.x,r.y,r.r,0,TAU);g.fill();}
  const liquid=c.liq&&c.liq.vol>15;
  if(c.kind==='pot'||c.kind==='sauce'){const cap=c.kind==='sauce'?700:1600;g.font='600 9px "IBM Plex Mono", monospace';g.textAlign='center';for(const ml of (c.kind==='sauce'?[200,400,600]:[250,500,1000,1500])){const r=c.r*(.5+.5*Math.sqrt(ml/cap));g.strokeStyle='rgba(40,50,60,.35)';g.lineWidth=1;g.beginPath();g.arc(0,0,r,-PI*.62,-PI*.38);g.stroke();g.fillStyle='rgba(40,50,60,.55)';g.fillText(ml>=1000?(ml/1000)+'L':ml,0,-r+10);}}
  if(liquid){drawLiquid(g,c,c.liq,0,0,c.r,.75);for(const n of c.noodles)drawNoodle(g,n,0,0);if(c.noodles.length)drawSheen(g,c,c.liq,c.r);for(const b of c.beggs)drawBegg(g,b,b.x,b.y);const gr=[],pc=[];for(const o of c.items){if(o.kind==='grain'){o.dx=o.x;o.dy=o.y;gr.push(o);}else pc.push(o);}drawGrains(g,gr,0,0);for(const o of pc)drawPiece(g,o,o.x,o.y);for(const e of c.eggs)drawEgg(g,e,e.x,e.y);drawFoam(g,c,0,0);if(isOil(c))drawFryFx(g,c);}
  else{drawFluid(g,c,0,0);if(c.liq)drawLiquid(g,c,c.liq,0,0,c.r*.6);for(const q of c.seeds){g.globalAlpha=Math.max(0,q.a||1);drawSeed(g,q,q.x,q.y);}g.globalAlpha=1;
    const gr=[],pc=[],air=[];for(const o of c.items){if(o.z>2)air.push(o);else if(o.kind==='grain'){o.dx=o.x;o.dy=o.y;gr.push(o);}else pc.push(o);}
    drawGrains(g,gr,0,0);for(const n of c.noodles)drawNoodle(g,n,0,0);for(const o of pc)drawPiece(g,o,o.x,o.y);for(const j of c.jeons)drawJeon(g,j,j.x,j.y);for(const e of c.eggs)drawEgg(g,e,e.x,e.y);
    if(!lift){for(const j of c.jeons)if(j.pour>.6)drawUnder(g,j.x,j.y,avgRad(j),j.fb[j.down],true);for(const e of c.eggs)if(!e.poach&&e.pour>.8)drawUnder(g,e.x,e.y,avgRad(e),e.fb[e.down],false);for(const o of c.items)if(o.L&&o.z<1)drawUnder(g,o.x,o.y,o.r*1.05,o.face[o.down],true);}
    for(const o of air){const sc=1+o.z/320;g.fillStyle='rgba(0,0,0,.2)';g.beginPath();g.arc(o.x+o.z*.15,o.y+o.z*.25,Math.min(o.r,14)*.8,0,TAU);g.fill();if(o.kind==='grain'){g.fillStyle=o.col||'#fff';g.beginPath();g.ellipse(o.x,o.y-o.z*.35,5*sc,2.6*sc,o.rot,0,TAU);g.fill();}else drawPiece(g,o,o.x,o.y-o.z*.35,sc);}}
  g.strokeStyle='rgba(255,255,255,.05)';g.lineWidth=10;g.beginPath();g.arc(0,0,c.r-12,PI*1.05,PI*1.45);g.stroke();g.restore();
  if(!lift&&c.liq&&c.liq.addT!==undefined&&G.t-c.liq.addT<1.4&&c.kind!=='bowl'){const al=Math.min(1,(1.4-(G.t-c.liq.addT))*2),tx=Math.round(c.liq.vol)+' ml';g.globalAlpha=al;g.font='700 18px "IBM Plex Mono", monospace';const w=g.measureText(tx).width+20;rr(g,x-w/2,y-c.r*.18-15,w,28,14);g.fillStyle='rgba(14,40,64,.82)';g.fill();g.fillStyle='#bfe6ff';g.textAlign='center';g.fillText(tx,x,y-c.r*.18+5);g.globalAlpha=1;}
  if(c.foam>.42&&!lift){const p=.5+.5*Math.sin(G.t*10);g.font='15px "Black Han Sans", sans-serif';const tx='넘치기 직전! 찬물 · 불 줄이기',w=g.measureText(tx).width+22;g.fillStyle=`rgba(200,40,20,${.75+.2*p})`;rr(g,x-w/2,y-c.r-44,w,28,14);g.fill();g.fillStyle='#fff';g.textAlign='center';g.fillText(tx,x,y-c.r-25);}
  if(!lift){const la=c.kind==='pan'?(c.id===2?2.2:2.5):c.id===0?PI/2:2.4,lx2=x+Math.cos(la)*(c.r+(c.id===0?20:14)),ly2=y+Math.sin(la)*(c.r+(c.id===0?20:14));g.font='600 12px "Gowun Dodum", sans-serif';const nm=c.name,tw=g.measureText(nm).width+14;g.fillStyle='rgba(8,9,10,.7)';rr(g,lx2-tw/2,ly2-10,tw,20,10);g.fill();g.fillStyle='rgba(240,228,210,.9)';g.textAlign='center';g.fillText(nm,lx2,ly2+4);}
  if(!lift&&((G.burners[c.burner]&&G.burners[c.burner].lit)||Math.abs((c.liq&&c.liq.vol>15?c.liq.T:c.T)-22)>6)){const T=c.liq&&c.liq.vol>15?c.liq.T:c.T,tx=x+Math.cos(-.8)*(c.r+6),ty=y+Math.sin(-.8)*(c.r+6);rr(g,tx-4,ty-12,58,22,6);g.fillStyle='rgba(8,9,10,.85)';g.fill();g.fillStyle=(T>=235&&(G.t%.5)<.25)?'#7a2a1a':tempCol(T);g.font='600 13px "IBM Plex Mono", monospace';g.textAlign='left';g.fillText(Math.round(T)+'°C',tx+2,ty+4);
    if(c.liq&&c.liq.vol>15){g.fillStyle='rgba(180,210,240,.8)';g.font='500 10px "IBM Plex Mono", monospace';g.fillText(Math.round(c.liq.vol)+'ml',tx+2,ty+20);}}}
function drawKnobs(){const g=ctx;G.burners.forEach((b,i)=>{const x=KNOBX[i],y=KNOBY;
  for(let k=0;k<=10;k++){const a=-PI/2+k/10*PI*1.4,c=mix([80,150,255],[255,120,50],k/10);g.strokeStyle=rgba(c,k/10<=b.level&&b.level>0?.95:.25);g.lineWidth=k%5?2:3;g.beginPath();g.moveTo(x+Math.cos(a)*33,y+Math.sin(a)*33);g.lineTo(x+Math.cos(a)*39,y+Math.sin(a)*39);g.stroke();}
  g.fillStyle='rgba(0,0,0,.45)';g.beginPath();g.arc(x+2,y+4,27,0,TAU);g.fill();const gr=g.createRadialGradient(x-9,y-10,3,x,y,27);gr.addColorStop(0,'#e4e7ea');gr.addColorStop(1,'#71757b');g.fillStyle=gr;g.beginPath();g.arc(x,y,27,0,TAU);g.fill();
  const a=-PI/2+b.level*PI*1.4;g.strokeStyle=b.lit?'#ff6a2a':'#2b2c30';g.lineWidth=5;g.lineCap='round';g.beginPath();g.moveTo(x+Math.cos(a)*4,y+Math.sin(a)*4);g.lineTo(x+Math.cos(a)*21,y+Math.sin(a)*21);g.stroke();});}

/* ---------- prep area ---------- */
function drawSink(){const g=ctx,S2=L.sink,st=G.strainer;
  if(!st.drag&&!st.ret){}
  const dragS=st.drag;if(!dragS)drawStrainer(g,st,st.x,st.y,false);
  // faucet
  g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(S2.tx+6,S2.ty+8,18,10,0,0,TAU);g.fill();steelDisc(g,S2.tx,S2.ty-8,14);g.strokeStyle='#c7ccd1';g.lineWidth=10;g.lineCap='round';g.beginPath();g.moveTo(S2.tx,S2.ty-8);g.lineTo(S2.tx,S2.ty+22);g.stroke();g.strokeStyle='rgba(255,255,255,.6)';g.lineWidth=2;g.beginPath();g.moveTo(S2.tx-2,S2.ty-6);g.lineTo(S2.tx-2,S2.ty+20);g.stroke();
  rr(g,S2.tx+14,S2.ty-16,30,10,4);g.fillStyle=G.sink.tap?'#3a8ad0':'#9aa2a9';g.fill();
  if(G.sink.tap){const gr=g.createLinearGradient(S2.tx-5,0,S2.tx+5,0);gr.addColorStop(0,'rgba(190,225,255,.3)');gr.addColorStop(.5,'rgba(235,248,255,.85)');gr.addColorStop(1,'rgba(190,225,255,.3)');g.fillStyle=gr;g.fillRect(S2.tx-4+Math.sin(G.t*40)*.6,S2.ty+22,8,S2.sy-S2.ty-40);
    g.strokeStyle='rgba(235,248,255,.6)';g.lineWidth=1.2;for(let i=0;i<3;i++){const r=((G.t*60+i*9)%26)+4;g.beginPath();g.ellipse(S2.tx,S2.sy-16,r,r*.5,0,0,TAU);g.stroke();}}}
function drawStrainer(g,c,x,y,lift){g.fillStyle=`rgba(0,0,0,${lift?.22:.3})`;g.beginPath();g.arc(x+(lift?16:5),y+(lift?20:7),c.r+6,0,TAU);g.fill();
  const co=Math.cos(c.ha),s=Math.sin(c.ha);g.strokeStyle='#9aa2a9';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(x+co*(c.r+2),y+s*(c.r+2));g.lineTo(x+co*(c.r+c.hl),y+s*(c.r+c.hl));g.stroke();
  steelDisc(g,x,y,c.r+6);g.fillStyle='#50565c';g.beginPath();g.arc(x,y,c.r,0,TAU);g.fill();g.save();g.beginPath();g.arc(x,y,c.r,0,TAU);g.clip();g.strokeStyle='rgba(200,206,212,.35)';g.lineWidth=.8;for(let i=-c.r;i<=c.r;i+=4){g.beginPath();g.moveTo(x+i,y-c.r);g.lineTo(x+i,y+c.r);g.stroke();g.beginPath();g.moveTo(x-c.r,y+i);g.lineTo(x+c.r,y+i);g.stroke();}g.restore();
  g.save();g.translate(x,y);drawContents(g,c);g.restore();}
function drawMix(g,c,x,y){g.save();g.translate(x,y);const R=c.r;const vol=batterVol(c);
  if(c.flour>0||c.water>0){const fr=Math.min(R-4,Math.sqrt(vol*30)+10);
    if(c.water<5){g.fillStyle='#f7f4ec';g.beginPath();g.arc(0,0,Math.min(R-6,Math.sqrt(c.flour)*5+8),0,TAU);g.fill();g.fillStyle='rgba(220,214,200,.6)';for(let i=0;i<30;i++){g.beginPath();g.arc(rand(-1,1)*fr*.5,rand(-1,1)*fr*.5,1.2,0,TAU);g.fill();}}
    else{const col=mix([248,244,232],batterColor(c,c.items),.35+c.mixv*.65);const ratio=c.flour?c.water/c.flour:9;g.fillStyle=rgba(ratio>2?mix(col,[220,220,210],.3):col,1);g.beginPath();g.arc(0,0,fr,0,TAU);g.fill();
      for(const o of c.items)drawPiece(g,o,o.x,o.y,.9,true);g.fillStyle=rgba(col,.45*c.mixv+.1);g.beginPath();g.arc(0,0,fr,0,TAU);g.fill();
      const lump=c.flour>0?1-c.mixv:0;if(lump>.15&&c.flour>5){g.fillStyle='rgba(255,255,250,.9)';const R2=mulberry(7);for(let i=0;i<lump*40;i++){g.beginPath();g.arc((R2()-.5)*fr*1.5,(R2()-.5)*fr*1.5,R2()*3+1,0,TAU);g.fill();}}
      if(c.egg>=1&&c.mixv<.3){g.fillStyle='#f5a21b';for(let i=0;i<Math.round(c.egg);i++){g.beginPath();g.arc(-10+i*18,-6,9,0,TAU);g.fill();}}
      g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=2;g.beginPath();g.arc(0,0,fr*.7,3.6,4.4);g.stroke();}}
  if(!(c.water>=5))for(const o of c.items)drawPiece(g,o,o.x,o.y,.9);
  if(vol>0){g.fillStyle='rgba(40,30,20,.75)';g.font='600 10px "IBM Plex Mono", monospace';g.textAlign='center';g.fillText(`가루 ${Math.round(c.flour)}g · 물 ${Math.round(c.water)}ml`,0,R+34);}
  g.restore();}
function drawContents(g,c){ // vessel-like drawing at local origin
  const gr=[],pc=[],gn=[];for(const o of c.items){let x=o.x,y=o.y;if(o.anim){const a=o.anim,t=clamp((a.t-a.delay)/a.dur,0,1),e=ease(t);x=lerp(a.fx,o.x,e);y=lerp(a.fy,o.y,e)-Math.sin(t*PI)*40;}o.dx=x;o.dy=y;if(o.kind==='grain')gr.push(o);else if(o.cooked||c.kind==='strainer'||c.kind==='prep')pc.push(o);else gn.push(o);}
  const liq=c.liq&&c.liq.vol>8;drawFluid(g,c,0,0);
  const serveV=c.kind==='bowl'||c.kind==='plate';if(serveV&&gr.length>40){let R0=0,G0=0,B0=0;for(const o of gr){const m=/(\d+),(\d+),(\d+)/.exec(o.col||'');if(m){R0+=+m[1];G0+=+m[2];B0+=+m[3];}else{R0+=247;G0+=244;B0+=234;}}const k3=gr.length,bc=[R0/k3,G0/k3,B0/k3];g.fillStyle=rgba(mix(bc,[120,80,40],.1),1);g.beginPath();for(const o of gr){g.moveTo(o.dx+6,o.dy);g.arc(o.dx,o.dy,6,0,TAU);}g.fill();}
  if(c.kind==='bowl'){if(liq)drawLiquid(g,c,c.liq,0,0,c.r,.7);for(const n of c.noodles)drawNoodle(g,n,0,0,true);if(liq&&c.noodles.length)drawBrothFilm(g,c,c.liq,c.r);drawGrains(g,gr,0,0);}
  else{drawGrains(g,gr,0,0);for(const n of c.noodles)drawNoodle(g,n,0,0,c.kind==='plate');if(liq)drawLiquid(g,c,c.liq,0,0,c.r*.8);}
  for(const b of c.beggs)drawBegg(g,b,b.x,b.y);for(const o of pc)drawPiece(g,o,o.dx,o.dy);
  const at=(e)=>{if(!e.anim)return[e.x,e.y];const a=e.anim,t=clamp((a.t-a.delay)/a.dur,0,1),k=ease(t);return[lerp(a.fx,e.x,k),lerp(a.fy,e.y,k)-Math.sin(t*PI)*40];};
  for(const j of c.jeons){const [x,y]=at(j);drawJeon(g,j,x,y);}for(const e of c.eggs){const [x,y]=at(e);drawEgg(g,e,x,y);}
  for(const o of gn)pieceShadow(g,o,o.dx,o.dy,1.5,.14);for(const o of gn)drawPiece(g,o,o.dx,o.dy);for(const ic of c.ice)drawIce(g,ic,ic.x,ic.y);for(const q of c.seeds)drawSeed(g,q,q.x,q.y);}
function drawVessel(c){const g=ctx;let x=c.x,y=c.y;if(c.drag){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.arc(x+18,y+22,(c.kind==='plate'?L.plate.r:L.bowl.r),0,TAU);g.fill();}
  if(c.drag||dist(c.x,c.y,c.hx,c.hy)>1){const R=c.kind==='plate'?L.plate.r:c.kind==='bowl'?L.bowl.r:c.r/.78;const gr=g.createRadialGradient(x-20,y-24,5,x,y,R);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#d8d2c6');g.fillStyle=gr;g.beginPath();g.arc(x,y,R,0,TAU);g.fill();}
  if(c.kind==='bowl'){const st=bowlStyleFor(c);if(st)drawBowlStyle(g,x,y,st,c);}
  g.save();g.translate(x,y);drawContents(g,c);g.restore();drawDrips(g,c,x,y);}

/* ---------- held items ---------- */
function drawHeld(){const h=G.held;if(!h)return;const g=ctx,x=M.x,y=M.y;
  if(h.kind==='ing'){pieceShadow(g,h.piece,x,y,12,.25);drawPiece(g,h.piece,x,y);}
  else if(h.kind==='rice'){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.arc(x+12,y+16,40,0,TAU);g.fill();const gr=g.createRadialGradient(x-14,y-14,4,x,y,40);gr.addColorStop(0,'#fff');gr.addColorStop(1,'#d9d5cc');g.fillStyle=gr;g.beginPath();g.arc(x,y,40,0,TAU);g.fill();g.fillStyle='#f4f0e3';g.beginPath();g.arc(x,y,31,0,TAU);g.fill();for(let i=0;i<40;i++){g.fillStyle='#fbf9f2';g.beginPath();g.ellipse(x+Math.cos(i*2.4)*i*.7,y+Math.sin(i*2.4)*i*.7,3.4,1.7,i,0,TAU);g.fill();}}
  else if(h.kind==='egg'){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x+10,y+14,13,16,0,0,TAU);g.fill();drawBegg(g,{rot:.3},x,y);}
  else if(h.kind==='bottle'||h.kind==='powder'){const t=h.tilt,tx=lerp(x+12,x+8,t),ty=lerp(y-74,y-38,t);
    if(h.flow>0&&h.kind==='bottle'){const col=LQ[h.id]?LQ[h.id].col:[200,200,200],w=1.3+h.flow*.1;g.strokeStyle=rgba(col,h.id==='water'?.5:.85);g.lineWidth=Math.min(6,w);g.lineCap='round';g.beginPath();g.moveTo(tx,ty);const wob=Math.sin(G.t*30)*1.5+M.vx*.004;g.bezierCurveTo(tx-2+wob,ty+10,x+wob*.5,(ty+y)/2,x,y);g.stroke();
      g.strokeStyle=`rgba(255,255,255,${h.id==='water'?.6:.3})`;g.lineWidth=1;g.beginPath();g.moveTo(tx-1,ty+2);g.bezierCurveTo(tx-3,ty+10,x-1,(ty+y)/2,x-1,y-2);g.stroke();}
    g.save();g.translate(tx,ty);g.rotate(-t*2.2);g.scale(.8,.8);if(h.kind==='powder'){g.rotate(PI);drawPack(g,'flour');}else drawBottle(g,h.id);g.restore();
    if(h.poured>.05){const lbl=h.kind==='powder'?`부침가루 ${h.poured.toFixed(0)}g`:`${BOT[h.id].label} ${h.poured.toFixed(h.poured<10?1:0)}ml`;tag(g,x+26,y+6,lbl);}}
  else if(h.kind==='shaker'){const wob=h.active?Math.sin(G.t*40)*h.shake*.35:0;g.save();g.translate(x,y-26);g.rotate((h.active?PI*.85:.25)+wob);drawShaker(g,h.id);g.restore();if(h.poured>.05)tag(g,x+30,y+6,`${SHK[h.id].n} ${h.poured.toFixed(1)}g`);}
  else if(h.kind==='noodle'||h.kind==='packet'){g.save();g.translate(x,y);g.rotate(-.2);g.scale(.8,.8);if(h.kind==='packet'){rr(g,-20,-14,40,28,4);g.fillStyle='#c8321c';g.fill();g.fillStyle='#fff';g.font='11px "Black Han Sans", sans-serif';g.textAlign='center';g.fillText('스프',0,5);}else if(h.nt==='udon'||h.nt==='ramen'||h.nt==='yakisoba'){rr(g,-40,-30,80,60,6);g.fillStyle='rgba(240,240,240,.6)';g.fill();const n=newNoodlePreview(h.nt);drawNoodle(g,n,0,0);}else drawPack(g,h.id);g.restore();}
  else if(h.kind==='noodleObj'){const [cx,cy]=noodleCenter(h.n);g.save();g.translate(x-cx*.6,y-cy*.6);g.scale(.6,.6);drawNoodle(g,h.n,0,0);g.restore();}
  else if(h.kind==='ice'){for(let i=0;i<4;i++)drawIce(g,{m:9,rot:i},x+(i%2)*16-8,y+(i>1?16:0)-8);}
  else if(h.kind==='nori'){drawSeed(g,{type:'nori',rot:.2},x,y);}
  else if(h.kind==='butter'){g.fillStyle='rgba(0,0,0,.2)';rr(g,x-12,y-5,30,20,4);g.fill();g.fillStyle='#f6de8a';rr(g,x-16,y-10,30,20,4);g.fill();g.fillStyle='rgba(255,255,255,.4)';g.fillRect(x-13,y-8,12,3);}}
let PREVN={};function newNoodlePreview(t){if(!PREVN[t]){const n=newNoodle(t,0,0);for(const s of n.strands)for(const p of s.pts){p.x*=.35;p.y*=.35;}PREVN[t]=n;}return PREVN[t];}
function tag(g,x,y,t){g.font='600 13px "IBM Plex Mono", monospace';const w=g.measureText(t).width+16;g.fillStyle='rgba(20,14,10,.8)';rr(g,x,y,w,24,5);g.fill();g.fillStyle='#ffe9c2';g.textAlign='left';g.fillText(t,x+8,y+17);}
function donName(T){return T<49?'레어 미만':T<54?'레어':T<59?'미디엄 레어':T<65?'미디엄':T<70?'미디엄 웰':'웰던';}
const pct=v=>Math.round(clamp(v,0,1.5)*100)+'%';
function probeInfo(x,y){const bp=boardPieceAt(x,y);if(bp){if(bp.L)return[Math.max(bp.Lm[5],bp.Lm[6]),[`심부 최고 ${Math.round(Math.max(bp.Lm[5],bp.Lm[6]))}°C`,donName(Math.max(bp.Lm[5],bp.Lm[6]))]];return[bp.T,[`${ING[bp.type].n} ${Math.round(bp.T)}°C`,`익힘 ${pct(bp.cook)}`]];}
  const c=contAt(x,y);if(!c)return[null,[]];const lx=x-c.x,ly=y-c.y;
  for(const j of c.jeons)if(dist(j.x,j.y,lx,ly)<avgRad(j))return[lerp(j.T||c.T,100,Math.min(1,j.set)*.7),[`전 속 익힘 ${pct(j.set)}`,`아랫면 노릇 ${pct(j.fb[j.down]/.7)}`,`윗면(뒤집은 쪽) ${pct(j.fb[1-j.down]/.7)}`]];
  for(const e of c.eggs)if(dist(e.x,e.y,lx,ly)<avgRad(e))return[e.T||c.T,[`흰자 ${pct(e.set)}`,`노른자 ${e.yolk<.35?'주르륵 반숙':e.yolk<.75?'쫀득 반숙':'완숙'}`]];
  let best=null,bd=1e9;for(const o of c.items){if(o.kind!=='piece')continue;const d=dist(o.x,o.y,lx,ly);if(d<Math.max(12,o.r)&&d<bd){bd=d;best=o;}}
  if(best){if(best.L)return[best.T,[`심부 ${Math.round(best.T)}°C`,donName(best.T),`아랫면 크러스트 ${pct(best.face[best.down])}`]];return[best.T,[`${ING[best.type].n} 익힘 ${pct(best.cook)}`,`아랫면 ${pct(best.face[best.down])}`]];}
  for(const n of c.noodles)return[n.T,[`${NT[n.type].n} 익힘 ${pct(n.done)}`,n.done>1.12?'퍼지는 중!':n.done>.9?'딱 좋아요':'덜 익음']];
  for(const b of c.beggs)if(dist(b.x,b.y,lx,ly)<24)return[b.T,[`삶은 계란 노른자 ${b.yolk<.35?'주르륵':b.yolk<.75?'쫀득 반숙':'완숙'}`]];
  if(c.liq&&c.liq.vol>5)return[c.liq.T,[`국물 ${Math.round(c.liq.T)}°C`,`간 ${saltPct(c.liq).toFixed(2)}% · ${Math.round(c.liq.vol)}ml`]];
  return[c.T,[`${c.name||''} ${Math.round(c.T)}°C`]];}
function probeRead(x,y){for(const p of G.board.pieces)if(pointInPiece(p,x,y))return p.L?p.T:p.T;const c=contAt(x,y);if(!c)return null;
  const lx=x-c.x,ly=y-c.y;for(const o of c.items)if(o.kind==='piece'&&dist(o.x,o.y,lx,ly)<Math.max(10,o.r))return o.T;for(const n of c.noodles)return n.T;if(c.liq&&c.liq.vol>5)return c.liq.T;for(const j of c.jeons)return lerp(j.T||c.T,100,Math.min(1,j.set)*.7);return c.T;}
