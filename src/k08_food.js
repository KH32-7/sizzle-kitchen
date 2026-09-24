
/* ---------- drawing food ---------- */
function tracePoly(g,P){g.beginPath();g.moveTo(P[0][0],P[0][1]);for(let i=1;i<P.length;i++)g.lineTo(P[i][0],P[i][1]);g.closePath();}
function overlays(g,p,d){const c=Math.min(1,p.cook);if(c>.02&&d.tint[3]){g.fillStyle=rgba(d.tint,d.tint[3]*c);g.fill();}
  const v=p.face[1-p.down];if(v>.03){g.fillStyle=rgba(d.brown,Math.min(1,v)*.62);g.fill();if(v>1){g.fillStyle=`rgba(28,16,8,${Math.min(.88,(v-1)*1.4)})`;g.fill();}}
  if(p.coat.dark>.004){g.fillStyle=`rgba(92,46,14,${Math.min(.5,p.coat.dark*5)})`;g.fill();}
  if(p.type!=='kimchi'&&p.type!=='garlic'&&p.coat.chili>.02){g.fillStyle=`rgba(190,45,18,${Math.min(.55,p.coat.chili*.8)})`;g.fill();}
  if(p.coat.sauce>.01){g.fillStyle=`rgba(120,50,24,${Math.min(.45,p.coat.sauce*2)})`;g.fill();}}
const VOL={kimchi:{th:3,cut:[232,130,96],skin:[140,26,12]},onion:{th:9,cut:[246,242,226],skin:[214,200,150],dome:1},ham:{th:11,cut:[238,168,156],skin:[190,104,92]},
  scallion:{th:7,cut:[236,242,222],skin:[82,130,52],cyl:1},jjokpa:{th:4,cut:[230,240,215],skin:[70,120,40],cyl:1},buchu:{th:2.5,cut:[150,190,110],skin:[40,80,24]},
  zucchini:{th:11,cut:[226,234,190],skin:[60,100,34],cyl:1},carrot:{th:9,cut:[250,152,62],skin:[196,88,20],cyl:1},cucumber:{th:9,cut:[208,230,178],skin:[36,70,26],cyl:1},
  cabbage:{th:3,cut:[236,242,214],skin:[170,200,130]},pork:{th:3,cut:[242,206,196],skin:[206,126,116]},chashu:{th:13,cut:[222,164,146],skin:[96,48,22],cyl:1},
  naruto:{th:9,cut:[252,248,242],skin:[212,202,192],cyl:1},squid:{th:3,cut:[252,248,242],skin:[196,166,166]},garlic:{th:6,cut:[250,244,226],skin:[216,200,166],dome:1},
  beef:{th:15,cut:[170,40,45],skin:[104,22,26]},begg:{th:10,cut:[252,250,244],skin:[222,214,196],dome:1},curd:{th:4,cut:[252,228,130],skin:[226,186,78]}};
const SHR={onion:.1,scallion:.14,jjokpa:.18,buchu:.22,zucchini:.12,cabbage:.22,pork:.14,kimchi:.06,carrot:.06,squid:.2,curd:.05,chashu:.03,naruto:.04};
function volOf(p){const v=VOL[p.type]||{th:4,cut:[230,230,220],skin:[150,150,140]};const c=Math.min(1,p.cook||0);let th=v.th*(1-c*(SHR[p.type]?.45:.1));if(p.L)th*=1-clamp((p.Tmax-40)/60,0,1)*.12;return{v,th,sc:1-c*(SHR[p.type]||0)-(p.L?clamp((p.Tmax-40)/60,0,1)*.08:0)};}
function wallCol(p,v,cut){let c=cut?v.cut:v.skin;const d=ING[p.type];if(cut&&p.L)c=doneCol(Math.max(p.Lm[5],p.Lm[6]));else if(cut&&d.tint[3]&&p.cook>.05)c=mix(c,d.tint,Math.min(1,p.cook)*d.tint[3]);
  const b=Math.max(p.face[0],p.face[1]);if(!cut&&b>.3)c=mix(c,d.brown,Math.min(.8,b*.6));if(p.coat.dark>.01)c=mix(c,[92,46,14],Math.min(.5,p.coat.dark*5));return c;}
function drawWalls(g,p,th,v){if(th<.8)return;const P=p.poly,n=P.length,s=Math.sin(p.rot),co=Math.cos(p.rot),ox=s*th,oy=co*th;let A=0;for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n];A+=a[0]*b[1]-b[0]*a[1];}const sg=A>0?1:-1;
  const buckets=[[],[],[],[]];// skinL, skinR, cutL, cutR
  for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=sg*dy/l,ny=-sg*dx/l,wy=s*nx+co*ny,wx=co*nx-s*ny;if(wy<.02)continue;const cut=!!commonIds(a,b);buckets[(cut?2:0)+(wx>.25?1:0)].push(a,b);}
  const col0=wallCol(p,v,false),col1=wallCol(p,v,true);
  buckets.forEach((E,k)=>{if(!E.length)return;g.beginPath();for(let i=0;i<E.length;i+=2){const a=E[i],b=E[i+1];g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.lineTo(b[0]+ox,b[1]+oy);g.lineTo(a[0]+ox,a[1]+oy);g.closePath();}
    const base=k<2?col0:col1,shade=k%2?.68:.86;g.fillStyle=rgba(mix(base,[0,0,0],1-shade),1);g.fill();if(k>=2&&p.L){g.strokeStyle=rgba(mix(col0,[60,30,15],.5),.9);g.lineWidth=1.6;g.stroke();}});}
function drawBevel(g,p){const P=p.poly,n=P.length,s=Math.sin(p.rot),co=Math.cos(p.rot);let A=0;for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n];A+=a[0]*b[1]-b[0]*a[1];}const sg=A>0?1:-1;
  g.beginPath();let any=false;const dk=[];for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,nx=sg*dy/l,ny=-sg*dx/l,wx=co*nx-s*ny,wy=s*nx+co*ny,lit=-.6*wx-.8*wy;if(lit>.25){g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);any=true;}else if(lit<-.3)dk.push(a,b);}
  if(any){g.strokeStyle='rgba(255,255,250,.38)';g.lineWidth=1.3;g.stroke();}if(dk.length){g.beginPath();for(let i=0;i<dk.length;i+=2){g.moveTo(dk[i][0],dk[i][1]);g.lineTo(dk[i+1][0],dk[i+1][1]);}g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=1;g.stroke();}}
function drawVolumeShade(g,p,v){const d=ING[p.type];if(v.cyl&&d.shH){const H=d.shH,gr=g.createLinearGradient(0,-H/2-p.ty,0,H/2-p.ty);gr.addColorStop(0,'rgba(0,0,0,.26)');gr.addColorStop(.28,'rgba(255,255,255,.2)');gr.addColorStop(.5,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(0,0,0,.34)');g.fillStyle=gr;g.fill();}
  else if(v.dome){const R=Math.max(d.shH||40,40)*.7,gr=g.createRadialGradient(-p.tx-R*.3,-p.ty-R*.35,R*.1,-p.tx,-p.ty,R*1.2);gr.addColorStop(0,'rgba(255,255,255,.3)');gr.addColorStop(.6,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(0,0,0,.28)');g.fillStyle=gr;g.fill();}
  else{const R=Math.max(20,p.rb),gr=g.createLinearGradient(-R,-R,R,R);gr.addColorStop(0,'rgba(255,255,255,.12)');gr.addColorStop(.5,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(0,0,0,.1)');g.fillStyle=gr;g.fill();}}
const DONE_COL=[[20,[140,24,36]],[45,[152,28,40]],[50,[184,46,60]],[55,[212,92,100]],[60,[214,132,124]],[65,[190,150,136]],[72,[160,126,106]],[90,[132,100,80]]];
function doneCol(T){if(T<=DONE_COL[0][0])return DONE_COL[0][1];for(let i=1;i<DONE_COL.length;i++){if(T<=DONE_COL[i][0]){const a=DONE_COL[i-1],b=DONE_COL[i];return mix(a[1],b[1],(T-a[0])/(b[0]-a[0]));}}return DONE_COL[DONE_COL.length-1][1];}
function drawDisc(g,p,d){const r=p.dr,cy=d.cyl,v=VOL[p.type]||{skin:[150,150,140]},t=Math.min(5,Math.max(2,p.ex*.4)),s=Math.sin(p.rot),co=Math.cos(p.rot);
  g.save();g.translate(s*t,co*t);g.beginPath();g.ellipse(0,0,r,r*.92,0,0,TAU);g.fillStyle=rgba(mix(wallCol(p,v,false),[0,0,0],.2),1);g.fill();g.restore();
  if(cy==='ring'||cy==='sring'){const R=r,ri=r*(cy==='sring'?.62:.54);g.beginPath();g.ellipse(0,0,R,R*.9,0,0,TAU);g.moveTo(ri,0);g.ellipse(0,0,ri,ri*.85,0,0,TAU,true);g.fillStyle=cy==='sring'?'#f6eee4':rgba(p.ringCol||[230,240,200],1);g.fill();overlays(g,p,d);
    g.strokeStyle=cy==='sring'?'rgba(170,120,120,.5)':'rgba(70,100,40,.5)';g.lineWidth=1;g.stroke();g.strokeStyle='rgba(255,255,255,.35)';g.beginPath();g.ellipse(0,0,R-1,R*.9-1,0,3.4,4.9);g.stroke();return;}
  g.beginPath();g.ellipse(0,0,r,r*.94,0,0,TAU);
  if(cy==='zuc'){g.fillStyle='#e6ecc4';g.fill();overlays(g,p,d);g.strokeStyle='#4a7a2c';g.lineWidth=Math.max(1.5,r*.12);g.stroke();g.fillStyle='rgba(200,210,150,.8)';for(let i=0;i<8;i++){const a=i/8*TAU;g.beginPath();g.ellipse(Math.cos(a)*r*.38,Math.sin(a)*r*.38,r*.1,r*.05,a,0,TAU);g.fill();}}
  else if(cy==='carrot'){g.fillStyle='#f08a2a';g.fill();overlays(g,p,d);g.fillStyle='rgba(255,190,110,.6)';g.beginPath();g.arc(0,0,r*.5,0,TAU);g.fill();g.strokeStyle='rgba(180,70,10,.5)';g.lineWidth=1;g.beginPath();g.ellipse(0,0,r,r*.94,0,0,TAU);g.stroke();}
  else if(cy==='cuc'){g.fillStyle='#d6e8b4';g.fill();overlays(g,p,d);g.strokeStyle='#2c5220';g.lineWidth=Math.max(1.5,r*.14);g.stroke();g.fillStyle='rgba(240,248,220,.9)';for(let i=0;i<3;i++){const a=i/3*TAU+.5;g.beginPath();g.ellipse(Math.cos(a)*r*.3,Math.sin(a)*r*.3,r*.22,r*.12,a,0,TAU);g.fill();}}
  else if(cy==='chashu'){g.fillStyle='#ecc3a6';g.fill();overlays(g,p,d);g.strokeStyle='#8a4a24';g.lineWidth=r*.12;g.stroke();g.strokeStyle='rgba(255,246,236,.9)';g.lineWidth=2.2;g.beginPath();for(let t2=0;t2<14;t2++){const a=t2*.9,rr2=r*.7*(1-t2/16);g.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2);}g.stroke();}
  else if(cy==='naruto'){g.fillStyle='#fbf7f0';g.fill();overlays(g,p,d);g.strokeStyle='#e0799a';g.lineWidth=2.4;g.beginPath();for(let t2=0;t2<40;t2++){const a=t2*.35,rr2=r*.7*(t2/40);g.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2);}g.stroke();g.strokeStyle='rgba(200,190,180,.7)';g.lineWidth=1;g.beginPath();for(let t2=0;t2<=48;t2++){const a=t2/48*TAU,rr2=r*(1+(t2%2?.06:-.02));g.lineTo(Math.cos(a)*rr2,Math.sin(a)*rr2*.94);}g.stroke();}
  else if(cy==='garlic'){g.fillStyle='#f6eed6';g.fill();overlays(g,p,d);g.strokeStyle='rgba(200,180,130,.7)';g.lineWidth=1;g.stroke();g.beginPath();g.moveTo(-r*.5,0);g.lineTo(r*.5,0);g.stroke();}
  const hl=g.createRadialGradient(-r*.35,-r*.4,1,0,0,r);hl.addColorStop(0,'rgba(255,255,255,.28)');hl.addColorStop(.6,'rgba(255,255,255,0)');hl.addColorStop(1,'rgba(0,0,0,.12)');g.fillStyle=hl;g.beginPath();g.ellipse(0,0,r,r*.94,0,0,TAU);g.fill();}
function drawSlab(g,p){const len=p.minL||Math.max(p.ey,p.ex),w=24,L2=p.Lm,n=L2.length,s=Math.sin(p.rot),co=Math.cos(p.rot),t=2.5;
  g.fillStyle='rgba(60,20,15,.55)';g.save();g.translate(s*t,co*t);rr(g,-w/2,-len/2,w,len,w*.45);g.fill();g.restore();
  const gr=g.createLinearGradient(-w/2,0,w/2,0),av=(a,b)=>{let t=0;for(let i=a;i<=b;i++)t+=L2[i];return t/(b-a+1);},h2=n>>1;[[0,av(0,0)],[.14,av(1,2)],[.32,av(3,h2-1)],[.5,av(h2-1,h2)],[.68,av(h2,n-4)],[.86,av(n-3,n-2)],[1,av(n-1,n-1)]].forEach(([t,T2])=>gr.addColorStop(t,rgba(doneCol(T2),1)));
  const f0=p.face[0],f1=p.face[1];rr(g,-w/2,-len/2,w,len,w*.45);g.fillStyle=gr;g.fill();g.save();rr(g,-w/2,-len/2,w,len,w*.45);g.clip();g.lineWidth=5;g.strokeStyle=rgba(mix([120,58,30],[50,24,12],clamp(Math.max(f0,f1)-.8,0,1)),.95);rr(g,-w/2,-len/2,w,len,w*.45);g.stroke();g.restore();
  
  const gl=g.createLinearGradient(0,-len/2,0,len/2);gl.addColorStop(0,'rgba(255,255,255,.2)');gl.addColorStop(.4,'rgba(255,255,255,0)');gl.addColorStop(1,'rgba(0,0,0,.12)');g.fillStyle=gl;rr(g,-w/2,-len/2,w,len,w*.45);g.fill();
  if(!p.juiceLost){g.fillStyle='rgba(255,255,255,.22)';g.fillRect(-w/2+4,-len/2+3,3,len-6);}}
function drawPiece(g,p,x,y,sc,flat){const d=ING[p.type];g.save();g.translate(x,y);g.rotate(p.rot);const V=volOf(p),k=(sc||1)*V.sc;if(k!==1)g.scale(k,k);if(p.flipT>0)g.scale(Math.max(.12,Math.abs(2*p.flipT-1)),1);
  if(p.disc){drawDisc(g,p,d);g.restore();return;}
  if(p.L&&p.area<p.orig*.75&&(p.minW||Math.min(p.ex,p.ey))<36){if(p.minW!==undefined)g.rotate(p.minA);else if(p.ex>p.ey)g.rotate(PI/2);drawSlab(g,p);g.restore();return;}
  const mw=p.minW||Math.min(p.ex,p.ey),ml=p.minL||Math.max(p.ex,p.ey),strip=mw<9&&ml>mw*3;if(!flat)drawWalls(g,p,Math.min(V.th,mw*(strip?.35:.75))/k,V.v);
  tracePoly(g,p.poly);
  if(d.custom==='begg'){g.fillStyle='#fbf8f0';g.fill();if(p.area<p.orig*.8){g.save();g.clip();const y2=p.yolk||0,c=y2<.35?[246,150,18]:y2<.8?mix([236,138,30],[240,190,80],(y2-.35)/.45):mix([246,214,120],[200,200,120],clamp(y2-1.1,0,1)*2);
      g.fillStyle=rgba(c,1);g.beginPath();g.arc(-p.tx,-p.ty,13,0,TAU);g.fill();if(y2<.5){g.fillStyle='rgba(255,255,255,.5)';g.beginPath();g.ellipse(-p.tx-4,-p.ty-4,4,2.5,-.5,0,TAU);g.fill();}g.restore();}
    else{tracePoly(g,p.poly);drawVolumeShade(g,p,V.v);}tracePoly(g,p.poly);g.strokeStyle=d.edge;g.lineWidth=1;g.stroke();if(!flat)drawBevel(g,p);g.restore();return;}
  if(d.custom==='curd'){g.fillStyle=rgba(mix([255,248,210],[248,210,70],p.yolkMix||.7),1);g.fill();overlays(g,p,d);drawVolumeShade(g,p,V.v);g.strokeStyle='rgba(255,255,240,.6)';g.lineWidth=1;g.stroke();g.restore();return;}
  const tex=TEX[p.type],pat=PAT[p.type];pat.setTransform(new DOMMatrix([1/TS,0,0,1/TS,-p.tx-tex.lw/2,-p.ty-tex.lh/2]));g.fillStyle=pat;g.fill();
  if(p.L){const vv=p.face[1-p.down];if(vv>.05){g.save();g.clip();g.globalAlpha=Math.min(1,vv*.9);g.fillStyle='rgba(120,62,30,.85)';g.fill();g.drawImage(SPOTS,-128,-128,256,256);if(vv>1.1){g.globalAlpha=Math.min(.85,(vv-1.1)*1.3);g.fillStyle='#1c1008';g.fill();}g.restore();}if(p.baste>0){g.fillStyle='rgba(255,230,160,.25)';g.fill();}}
  else overlays(g,p,d);
  if(strip&&VOL[p.type]&&VOL[p.type].cyl){g.fillStyle=rgba(VOL[p.type].skin,.5);g.fill();}
  if(p.stale){g.fillStyle='rgba(120,110,80,.22)';g.fill();}
  drawVolumeShade(g,p,V.v);
  g.lineWidth=1;g.strokeStyle=d.edge;g.stroke();const hid=p.face[p.down],vis=p.face[1-p.down];
  if(hid>.9&&hid>vis+.3){g.lineWidth=2;g.strokeStyle=`rgba(35,18,8,${Math.min(.7,(hid-.9)*1.2)})`;g.stroke();}
  if(!flat)drawBevel(g,p);
  if(p.coat.oil>.03||(p.moist>.7&&p.cooked)){const r=Math.min(p.r,20);g.strokeStyle='rgba(255,250,232,.38)';g.lineWidth=1.2;g.beginPath();g.moveTo(-r*.45,-r*.25);g.quadraticCurveTo(-r*.1,-r*.5,r*.25,-r*.4);g.stroke();}
  g.restore();}
function pieceShadow(g,p,x,y,off,a){const th=Math.min((VOL[p.type]||{th:4}).th,p.ex?Math.min(p.ex,p.ey)*.75:99);g.save();g.translate(x+off*.6+th*.25,y+off+th*.9);g.rotate(p.rot);const k=volOf(p).sc;if(k!==1)g.scale(k,k);if(p.disc){g.beginPath();g.arc(0,0,p.dr,0,TAU);}else tracePoly(g,p.poly);g.fillStyle=`rgba(0,0,0,${a})`;g.fill();g.restore();}
const RICE=[247,244,234];
function grainCol(o){let c=RICE;const ch=Math.min(1,o.coat.chili*3.2);if(ch>.01)c=mix(c,[216,84,40],ch*.85);const so=Math.min(1,o.coat.dark*7);if(so>.01)c=mix(c,[150,92,48],so*.55);
  const b=o.face[1-o.down];if(b>.05)c=mix(c,[178,112,52],Math.min(1,b)*.7);if(b>1)c=mix(c,[40,26,14],Math.min(.9,(b-1)*1.4));if(o.coat.oil>.05)c=mix(c,[255,250,225],.08);return rgba(c.map(v=>Math.round(v/5)*5),1);}
const GSPR=new Map(),GSS=3;
function grainSpr(col){let c=GSPR.get(col);if(c)return c;c=mk(16*GSS,10*GSS);const g=c.getContext('2d');g.scale(GSS,GSS);g.translate(7.5,4.6);g.fillStyle='rgba(0,0,0,.24)';g.beginPath();g.ellipse(1,1.6,5.2,2.9,0,0,TAU);g.fill();
  g.fillStyle=col;g.beginPath();g.ellipse(0,0,5,2.6,0,0,TAU);g.fill();g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(-1,-.9,2.4,.9,0,0,TAU);g.fill();if(GSPR.size>600)GSPR.clear();GSPR.set(col,c);return c;}
function drawGrains(g,list,ox,oy){if(!list.length)return;const m=g.getTransform();
  for(const o of list){if(!o.col||((FC+o.ci)&7)===0)o.col=grainCol(o);if(o._r!==o.rot){o._r=o.rot;o._c=Math.cos(o.rot);o._s=Math.sin(o.rot);}const c=o._c,s=o._s,x=ox+o.dx,y=oy+o.dy;
    g.setTransform(m.a*c+m.c*s,m.b*c+m.d*s,-m.a*s+m.c*c,-m.b*s+m.d*c,m.a*x+m.c*y+m.e,m.b*x+m.d*y+m.f);g.drawImage(grainSpr(o.col),-7.5,-4.6,16,10);}
  g.setTransform(m);}
function eggPath(g,e){const N=e.rad.length,pts=[];for(let i=0;i<N;i++){const a=i/N*TAU;pts.push([Math.cos(a)*e.rad[i],Math.sin(a)*e.rad[i]]);}
  g.beginPath();const l=pts[N-1],f=pts[0];g.moveTo((l[0]+f[0])/2,(l[1]+f[1])/2);for(let i=0;i<N;i++){const a=pts[i],b=pts[(i+1)%N];g.quadraticCurveTo(a[0],a[1],(a[0]+b[0])/2,(a[1]+b[1])/2);}g.closePath();}
function drawEgg(g,e,x,y){g.save();g.translate(x,y);if(e.flipA>0)g.scale(1,Math.max(.1,Math.abs(2*e.flipA-1)));
  if(e.ribbon){g.strokeStyle='rgba(250,238,190,.9)';g.lineCap='round';for(let i=0;i<9;i++){g.lineWidth=rand(2,4);g.beginPath();const a=i*.7+G.t*.2;g.arc(Math.cos(a)*14,Math.sin(a)*14,20+i*3,a,a+1.2);g.stroke();}g.strokeStyle='rgba(245,190,60,.85)';for(let i=0;i<5;i++){g.lineWidth=2.5;g.beginPath();const a=i*1.3+G.t*.2;g.arc(0,0,10+i*5,a,a+.9);g.stroke();}g.restore();return;}
  {const th=e.set>.3?2.5:1.2;g.save();g.translate(0,th);eggPath(g,e);g.fillStyle=`rgba(200,190,170,${.25+.35*clamp(e.set,0,1)})`;g.fill();g.restore();}
  eggPath(g,e);const s=clamp(e.set,0,1);
  if(e.down===0){g.fillStyle=`rgba(${lerp(222,252,s)|0},${lerp(230,249,s)|0},${lerp(220,241,s)|0},${.3+.66*s})`;g.fill();if(s<.8){g.strokeStyle=`rgba(255,255,255,${(.8-s)*.55})`;g.lineWidth=1.5;g.stroke();}}else{g.fillStyle='rgba(250,246,236,.97)';g.fill();}
  const vb=e.fb[1-e.down];if(vb>.03){g.fillStyle=`rgba(196,128,52,${Math.min(1,vb)*.62})`;g.fill();if(vb>1){g.fillStyle=`rgba(40,24,10,${Math.min(.85,(vb-1)*1.5)})`;g.fill();}}
  if(e.edge>.05&&!e.poach){g.lineWidth=2+Math.min(1.4,e.edge)*6;g.strokeStyle=`rgba(176,110,40,${Math.min(.9,e.edge*.8)})`;g.stroke();const N=e.rad.length;g.fillStyle=`rgba(160,95,35,${Math.min(.8,e.edge*.7)})`;for(let i=0;i<N;i++){const a=i/N*TAU+.07,r=e.rad[i]-3-((i*37)%5);g.beginPath();g.arc(Math.cos(a)*r,Math.sin(a)*r,1.2+((i*13)%3)*.6,0,TAU);g.fill();}}
  if(e.down===0){g.fillStyle=`rgba(255,255,255,${.1+.25*s})`;g.beginPath();g.ellipse(e.yx,e.yy,32,29,0,0,TAU);g.fill();
    if(!e.broken){const gr=g.createRadialGradient(e.yx-5,e.yy-6,2,e.yx,e.yy,17);gr.addColorStop(0,'#ffd257');gr.addColorStop(.6,'#f5a21b');gr.addColorStop(1,'#e07d0a');g.fillStyle=gr;g.beginPath();g.arc(e.yx,e.yy,17,0,TAU);g.fill();
      if(e.yolk>.05||e.poach){g.fillStyle=`rgba(255,236,196,${Math.min(.75,e.yolk*.6+(e.poach?s*.5:0))})`;g.fill();}g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(e.yx-6,e.yy-7,5,3,-.6,0,TAU);g.fill();}
    else{g.fillStyle=`rgba(240,150,20,${.9-e.yolk*.3})`;g.beginPath();g.ellipse(e.yx,e.yy,23,15,.4,0,TAU);g.fill();g.beginPath();g.ellipse(e.yx+15,e.yy+9,13,6,.6,0,TAU);g.fill();}}
  else{const gr=g.createRadialGradient(e.yx,e.yy,2,e.yx,e.yy,24);gr.addColorStop(0,'rgba(255,238,200,.55)');gr.addColorStop(1,'rgba(255,238,200,0)');g.fillStyle=gr;g.beginPath();g.arc(e.yx,e.yy,24,0,TAU);g.fill();}
  g.restore();
  if(e.crack>0){g.save();g.globalAlpha=Math.min(1,e.crack*1.5);const o=(1-e.crack)*26;for(const sd of [-1,1]){g.save();g.translate(x+sd*(10+o),y-20-o*.6);g.rotate(sd*(.6+(1-e.crack)));g.fillStyle='#f3e3c6';g.beginPath();g.ellipse(0,0,13,9,0,sd>0?PI:0,sd>0?TAU:PI);g.fill();g.strokeStyle='rgba(150,120,80,.6)';g.stroke();g.restore();}g.restore();}}
function drawBegg(g,b,x,y){g.save();g.translate(x,y);g.rotate(b.rot);g.fillStyle='rgba(0,0,0,.2)';g.beginPath();g.ellipse(2,3,17,21,0,0,TAU);g.fill();const gr=g.createRadialGradient(-5,-7,2,0,0,22);gr.addColorStop(0,'#fbf1df');gr.addColorStop(1,'#d8bd96');g.fillStyle=gr;g.beginPath();g.ellipse(0,0,16,20,0,0,TAU);g.fill();
  if(b.crack){g.strokeStyle='rgba(120,90,60,.6)';g.lineWidth=1;g.beginPath();g.moveTo(-8,-4);g.lineTo(-2,-1);g.lineTo(3,-6);g.lineTo(9,-2);g.stroke();}g.fillStyle='rgba(255,255,255,.45)';g.beginPath();g.ellipse(-5,-8,3.5,5,-.4,0,TAU);g.fill();g.restore();}
function drawJeon(g,j,x,y){g.save();g.translate(x,y);if(j.flipA>0)g.scale(1,Math.max(.08,Math.abs(2*j.flipA-1)));const th=clamp(j.thick*3.2,2.5,7);g.save();g.translate(0,th);eggPath(g,j);g.fillStyle=rgba(mix(j.col,[120,70,20],clamp(Math.max(j.fb[0],j.fb[1])*.5,0,.7)),1);g.fill();g.restore();eggPath(g,j);
  const vis=j.fb[1-j.down],top=j.down===0,base=j.col;
  g.fillStyle=rgba(top?mix(base,[250,240,215],(1-Math.min(1,j.set))*.25):mix(base,[226,176,96],.3),1);g.fill();
  g.save();g.clip();
  for(const p of j.pieces){drawPiece(g,p,p.x,p.y,.9,true);}
  if(top){g.fillStyle=rgba(base,.34-Math.min(.2,j.set*.18));g.fillRect(-200,-200,400,400);if(j.lumps>.3){g.fillStyle='rgba(255,255,248,.8)';const R=mulberry(j.pieces.length+7);for(let i=0;i<j.lumps*30;i++){g.beginPath();g.arc((R()-.5)*avgRad(j)*1.6,(R()-.5)*avgRad(j)*1.6,R()*2.5+1,0,TAU);g.fill();}}}
  if(vis>.05){g.globalAlpha=Math.min(.7,vis*.6);g.fillStyle=rgba(mix(j.col,[150,78,26],.42),.55);g.fillRect(-200,-200,400,400);g.globalAlpha=Math.min(.45,vis*.4);g.drawImage(SPOTS,-110,-110,220,220);g.globalAlpha=Math.min(.82,vis*.75);for(const p of j.pieces)drawPiece(g,p,p.x,p.y,.9,true);g.globalAlpha=Math.min(.95,vis*.85);if(vis>1.05){g.globalAlpha=Math.min(.85,(vis-1.05)*1.4);g.fillStyle='#1a0e06';g.fillRect(-200,-200,400,400);}g.globalAlpha=1;}
  if(top&&j.set<.9){const gl=g.createRadialGradient(-avgRad(j)*.3,-avgRad(j)*.4,4,0,0,avgRad(j));gl.addColorStop(0,`rgba(255,255,255,${.3*(1-j.set)})`);gl.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gl;g.fillRect(-200,-200,400,400);}
  if(j.cuts&&j.cuts.length){const R=avgRad(j)+4;for(const a of j.cuts){const c=Math.cos(a),s=Math.sin(a);g.strokeStyle='rgba(70,36,12,.55)';g.lineWidth=3.2;g.beginPath();g.moveTo(-c*R,-s*R);g.lineTo(c*R,s*R);g.stroke();g.strokeStyle='rgba(255,236,190,.35)';g.lineWidth=1;g.beginPath();g.moveTo(-c*R+s*2,-s*R-c*2);g.lineTo(c*R+s*2,s*R-c*2);g.stroke();}}
  if(j.broken>0){g.strokeStyle='rgba(90,50,20,.7)';g.lineWidth=2.5;const R=mulberry(j.pieces.length+j.broken);for(let k=0;k<j.broken*2;k++){g.beginPath();let px=(R()-.5)*40,py=(R()-.5)*40;g.moveTo(px,py);for(let s=0;s<4;s++){px+=(R()-.5)*40;py+=(R()-.5)*40;g.lineTo(px,py);}g.stroke();}}
  g.restore();
  if(j.edge>.25){const R3=mulberry(j.tr.length*7+3),N3=j.rad.length,e2=Math.min(1.2,j.edge);g.fillStyle=`rgba(${196-e2*40|0},${128-e2*40|0},${46-e2*10|0},${Math.min(.9,e2*.8)})`;for(let i=0;i<N3*3;i++){const a=i/(N3*3)*TAU,k2=(a/TAU)*N3,i0=Math.floor(k2)%N3,rad=j.rad[i0]*(1+(R3()-.5)*.05)+R3()*3-1;g.beginPath();g.arc(Math.cos(a)*rad,Math.sin(a)*rad,1.6+R3()*2.6*e2,0,TAU);g.fill();}}
  if(j.edge>.05){g.lineWidth=3+Math.min(1.4,j.edge)*6;g.strokeStyle=`rgba(170,100,34,${Math.min(.95,j.edge*.8)})`;g.stroke();if(j.edge>1.3){g.strokeStyle=`rgba(40,22,8,${Math.min(.8,(j.edge-1.3)*1.2)})`;g.lineWidth=3;g.stroke();}
    const N=j.rad.length;g.fillStyle=`rgba(150,86,28,${Math.min(.85,j.edge*.7)})`;for(let i=0;i<N*2;i++){const a=i/(N*2)*TAU,r=j.rad[i>>1]-2-((i*29)%6);g.beginPath();g.arc(Math.cos(a)*r,Math.sin(a)*r,1.4+((i*11)%3)*.7,0,TAU);g.fill();}}
  if(j.oil>.5||top){g.strokeStyle=`rgba(255,248,220,${top?.3:.22})`;g.lineWidth=2.2;g.beginPath();g.arc(0,0,avgRad(j)*.72,3.5,4.7);g.stroke();}g.restore();}
function noodleCol(n){const d=NT[n.type];let c=d.col;const pale=n.type==='somyeon'||n.type==='udon';if(n.done>.4)c=mix(c,[252,248,236],Math.min(pale?.25:.06,(n.done-.4)*.4));if(n.coat.oil>1&&!n.coat.sauce)c=mix(c,[248,204,90],Math.min(.3,n.coat.oil/(n.g*.25)));
  const dk=Math.min(1,n.coat.dark/(n.g*.12));if(dk>.02)c=mix(c,[140,82,40],dk*.7);const ch=Math.min(1,n.coat.chili/(n.g*.12));if(ch>.02)c=mix(c,[206,58,30],ch*.8);
  if(n.coat.sauce>1&&n.sauceCol)c=mix(c,n.sauceCol,Math.min(.85,n.coat.sauce/(n.g*.35)));if(n.brown>.1)c=mix(c,[170,110,50],Math.min(.6,n.brown*.6));return c;}
function drawNoodle(g,n,ox,oy,mass){const d=NT[n.type],c=noodleCol(n),w=d.w*(1+Math.min(n.mush,1.2)*.22)*(n.T<0?1.1:1);g.lineCap='round';g.lineJoin='round';
  const addPath=(s,dx,dy)=>{const P=s.pts;g.moveTo(ox+dx+P[0].x,oy+dy+P[0].y);for(let i=1;i<P.length-1;i++){const mx=(P[i].x+P[i+1].x)/2,my=(P[i].y+P[i+1].y)/2;let px=P[i].x,py=P[i].y;if(d.wave){const nx=-(P[i+1].y-P[i-1].y),ny=P[i+1].x-P[i-1].x,l=Math.hypot(nx,ny)||1,o=Math.sin(i*2.1+s.ph)*d.wave*2.6;px+=nx/l*o;py+=ny/l*o;}g.quadraticCurveTo(ox+dx+px,oy+dy+py,ox+dx+mx,oy+dy+my);}g.lineTo(ox+dx+P[P.length-1].x,oy+dy+P[P.length-1].y);};
  if(mass&&n.type!=='udon'){g.beginPath();for(const s of n.strands)addPath(s,0,0);g.strokeStyle=rgba(mix(c,[90,60,20],.18),1);g.lineWidth=w*2.7;g.stroke();g.strokeStyle=rgba(mix(c,[255,250,235],.05),1);g.lineWidth=w*1.6;g.stroke();}
  if(n.type==='udon'){const edge=rgba(mix(c,[176,140,84],.5),1),body=rgba(mix(c,[255,250,238],.2),1),mid=rgba(c,1);
    for(const s of n.strands){g.beginPath();addPath(s,1.2,2.2);g.strokeStyle='rgba(60,36,10,.22)';g.lineWidth=w+2.5;g.stroke();
      g.beginPath();addPath(s,0,0);g.strokeStyle=edge;g.lineWidth=w;g.stroke();g.strokeStyle=mid;g.lineWidth=w*.8;g.stroke();
      g.beginPath();addPath(s,-w*.08,-w*.1);g.strokeStyle=body;g.lineWidth=w*.5;g.stroke();
      g.beginPath();addPath(s,-w*.2,-w*.22);g.strokeStyle='rgba(255,255,255,.62)';g.lineWidth=Math.max(1,w*.16);g.stroke();}return;}
  g.beginPath();for(const s of n.strands)addPath(s,.8,1.4);g.strokeStyle='rgba(0,0,0,.24)';g.lineWidth=w+1.4;g.stroke();
  g.beginPath();for(const s of n.strands)addPath(s,0,0);g.strokeStyle=rgba(mix(c,[0,0,0],.12),1);g.lineWidth=w;g.stroke();g.strokeStyle=rgba(c,1);g.lineWidth=w*.72;g.stroke();
  g.beginPath();for(let i=0;i<n.strands.length;i+=2)addPath(n.strands[i],-w*.18,-w*.2);g.strokeStyle=`rgba(255,255,255,${n.coat.oil>2||n.coat.sauce>2?.55:.3})`;g.lineWidth=Math.max(.8,w*.28);g.stroke();}
function drawLiquid(g,c,q,x,y,R,am){const vol=q.vol,cap=c.kind==='bowl'?520:c.kind==='pan'?160:c.kind==='sauce'?700:1600,d=Math.min(1,vol/cap);let a=clamp(.2+d*.42+liqDark(q)*.45+Math.min(.45,q.spicy/Math.max(1,q.vol)*30),.2,.92)*(am||1),QC=mix(liqCol(q),[70,120,150],clamp(1-(q.umami+q.dark*3+q.spicy+q.fat+q.sour)/Math.max(1,q.vol)*4,0,1)*(1-liqDark(q))*d*.45);if(q.fat>q.vol*.6){QC=mix([246,204,100],[214,150,48],Math.min(1,d*1.3));a=Math.max(a,.55);}const rr2=R*(.5+.5*Math.sqrt(d));
  if(c.kind!=='pan'&&c.kind!=='bowl'){g.save();g.beginPath();g.arc(x,y,R,0,TAU);g.arc(x,y,rr2,0,TAU,true);g.fillStyle='rgba(20,24,30,.16)';g.fill('evenodd');g.restore();}
  const tt0=(typeof G!=='undefined'&&G)?G.t:0;
  const sp=q.spicy/Math.max(1,q.vol);if(c.kind==='bowl'&&q.umami>q.vol*.2)a=Math.max(a,.8+Math.min(.15,liqDark(q)));const gr=g.createRadialGradient(x-rr2*.3,y-rr2*.3,rr2*.1,x,y,rr2);if(c.kind==='bowl'&&sp>.004){const RC=mix(QC,[228,98,34],Math.min(.85,sp*60));gr.addColorStop(0,rgba(mix(RC,[255,190,120],.25),.92));gr.addColorStop(1,rgba(mix(RC,[140,40,10],.25),.96));}else if(c.kind==='bowl'&&q.umami>q.vol*.2){const dk=Math.min(1,liqDark(q)*2.5),am2=Math.min(.6,q.dark/Math.max(1,q.vol)*8),GC=mix(mix(QC,[232,176,82],.35*(1-dk)*(1-am2)),[184,106,38],am2);gr.addColorStop(0,rgba(mix(GC,[255,236,170],.3*(1-dk*.7)),a*(.7+dk*.25)));gr.addColorStop(1,rgba(mix(GC,[150,90,30],.25),Math.min(.92,a*1.05)));}else{gr.addColorStop(0,rgba(mix(QC,[255,255,255],.15),a*.85));gr.addColorStop(1,rgba(mix(QC,[0,0,0],.2),Math.min(.95,a*1.15)));}g.fillStyle=gr;g.beginPath();g.arc(x,y,rr2,0,TAU);g.fill();
  if(q.fat>5){const R2=mulberry(c.id||3);g.fillStyle='rgba(255,220,140,.35)';for(let i=0;i<Math.min(40,q.fat/2);i++){const a2=R2()*TAU,r=Math.sqrt(R2())*rr2*.85,s=R2()*4+1.5;g.beginPath();g.arc(x+Math.cos(a2+G.t*.05)*r,y+Math.sin(a2+G.t*.05)*r,s,0,TAU);g.fill();}}
  const b=c.boil||0;if(b>.05){g.strokeStyle=`rgba(255,255,255,${.2+b*.4})`;g.lineWidth=1;const n=(b*30)|0;for(let i=0;i<n;i++){const a2=rand(0,TAU),r=Math.sqrt(Math.random())*rr2*.9;g.beginPath();g.arc(x+Math.cos(a2)*r,y+Math.sin(a2)*r,rand(1.5,4+b*5),0,TAU);g.stroke();}}
  else if(q.T>70){g.fillStyle='rgba(255,255,255,.3)';for(let i=0;i<(q.T-70)/4;i++){g.beginPath();g.arc(x+rand(-.7,.7)*rr2,y+rand(-.7,.7)*rr2,rand(.8,1.8),0,TAU);g.fill();}}
  g.strokeStyle='rgba(255,255,255,.12)';g.lineWidth=6;g.beginPath();g.arc(x,y,rr2-6,PI*1.05,PI*1.45);g.stroke();
  g.strokeStyle='rgba(255,255,255,.7)';g.lineWidth=2.2;g.beginPath();g.arc(x,y,rr2,0,TAU);g.stroke();g.strokeStyle='rgba(0,0,0,.28)';g.lineWidth=3.5;g.beginPath();g.arc(x,y,rr2+3,0,TAU);g.stroke();
  if(q.addT!==undefined&&tt0-q.addT<.35){const w=(tt0*6)%1;g.strokeStyle=`rgba(255,255,255,${.5*(1-w)})`;g.lineWidth=1.5;g.beginPath();g.arc(x,y,rr2*(.2+.75*w),0,TAU);g.stroke();}
  const tt=(typeof G!=='undefined'&&G)?G.t:0;g.lineWidth=2.5;for(let i=0;i<3;i++){const an=tt*.25+i*2.1,rad=rr2*(.28+.2*i);g.strokeStyle=`rgba(255,255,255,${.07+.05*Math.sin(tt*1.7+i)})`;g.beginPath();g.arc(x+Math.cos(tt*.3+i)*4,y+Math.sin(tt*.27+i)*3,rad,an,an+.7);g.stroke();}}
function drawSheen(g,c,q,R){g.fillStyle=rgba(liqCol(q),.2+liqDark(q)*.25);g.beginPath();g.arc(0,0,R*.97,0,TAU);g.fill();const gr=g.createLinearGradient(-R,-R,R*.3,R*.3);gr.addColorStop(0,'rgba(255,255,255,.16)');gr.addColorStop(.5,'rgba(255,255,255,0)');g.fillStyle=gr;g.beginPath();g.arc(0,0,R*.97,0,TAU);g.fill();}
function drawFoam(g,c,x,y){if(c.foam<.12)return;const R=c.r,f=c.foam;g.fillStyle=`rgba(252,250,242,${Math.min(.92,f*.9)})`;const R2=mulberry(c.id*13+1);
  for(let i=0;i<f*140;i++){const a=R2()*TAU+G.t*.3,r=R*(1-Math.pow(R2(),.6)*f*.95);g.beginPath();g.arc(x+Math.cos(a)*r,y+Math.sin(a)*r,R2()*6+2+f*3,0,TAU);g.fill();}}
function drawIce(g,ic,x,y){const s=Math.cbrt(ic.m)*6.5;g.save();g.translate(x,y);g.rotate(ic.rot||0);rr(g,-s/2,-s/2,s,s,s*.25);g.fillStyle='rgba(230,245,255,.55)';g.fill();g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=1.2;g.stroke();g.fillStyle='rgba(255,255,255,.7)';g.fillRect(-s*.3,-s*.3,s*.25,s*.12);g.restore();}
function drawSeed(g,q,x,y){switch(q.type){
  case'chili':g.fillStyle='#c42a18';g.save();g.translate(x,y);g.rotate(q.rot);g.fillRect(-1.6,-1,3.2,2);g.restore();break;
  case'pepper':g.fillStyle='#2a2420';g.fillRect(x-.8,y-.8,1.6,1.6);break;
  case'sesame':g.save();g.translate(x,y);g.rotate(q.rot);g.fillStyle='#efdcaa';g.beginPath();g.ellipse(0,0,2.4,1.4,0,0,TAU);g.fill();g.restore();break;
  case'gim':g.save();g.translate(x,y);g.rotate(q.rot);g.fillStyle='#1c2a1a';g.fillRect(-3.5,-1,7,2);g.restore();break;
  case'aonori':g.fillStyle='#3f7a2c';g.beginPath();g.arc(x,y,1.3,0,TAU);g.fill();break;
  case'parsley':{g.save();g.translate(x,y);g.rotate(q.rot);g.fillStyle='#2f8a2a';for(let k=0;k<3;k++){g.beginPath();g.ellipse(Math.cos(k*2.1)*1.6,Math.sin(k*2.1)*1.6,1.9,1.3,k*2.1,0,TAU);g.fill();}g.restore();break;}
  case'parm':g.fillStyle='#f6eec8';g.save();g.translate(x,y);g.rotate(q.rot);g.fillRect(-2.2,-1,4.4,2);g.restore();break;
  case'shichimi':g.fillStyle=pick(['#c0501c','#e07a20','#2a2a2a','#a02810']);g.fillRect(x-.9,y-.9,1.8,1.8);break;
  case'nori':g.save();g.translate(x,y);g.rotate(q.rot);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(-26,-34,56,72);g.fillStyle=q.soak?'#243322':'#1e2a1c';rr(g,-28,-36,56,72,3);g.fill();g.fillStyle='rgba(120,160,110,.18)';for(let i=0;i<20;i++)g.fillRect(-24+((i*37)%48),-30+((i*53)%60),1.6,1.6);g.restore();break;
  case'butterpat':g.fillStyle='#f6de8a';rr(g,x-9,y-6,18,12,3);g.fill();break;}}
/* fluid particle layer */
let FLC=null,FLX=null;
function drawFluid(g,c,ox,oy){const F=c.fluid;if(!F.length)return;
  if(c.kind==='counter'){for(const q of F){const d=LQ[q.k];g.fillStyle=rgba(d.col,d.a*.9);g.beginPath();g.arc(q.x,q.y,(q.r||fR(q,22))*.9,0,TAU);g.fill();}return;}
  const R=c.r+30,size=Math.ceil(R*2*PX);if(!FLC||FLC.width<size){FLC=mk(size,size);FLX=FLC.getContext('2d');}
  const groups={};for(const q of F){const key=q.k+(q.chili>1?'c':'')+(q.burn>.6?'b':'');(groups[key]=groups[key]||[]).push(q);}
  for(const key in groups){const arr=groups[key],q0=arr[0],d=LQ[q0.k];let col=d.col;if(q0.chili>1)col=mix(col,[210,50,20],.7);if(q0.burn>.6)col=mix(col,[40,24,12],.7);if(q0.k==='butter'&&c.T>140)col=mix(col,[200,130,50],clamp((c.T-140)/60,0,1));
    FLX.setTransform(1,0,0,1,0,0);FLX.clearRect(0,0,size,size);FLX.setTransform(PX,0,0,PX,R*PX,R*PX);
    FLX.fillStyle=rgba(d.oil?mix(col,[255,255,240],.4):mix(col,[0,0,0],.18),1);for(const q of arr){const r=(q.r||fR(q,c.T))*1.1;FLX.beginPath();FLX.arc(q.x,q.y,r+1.2,0,TAU);FLX.fill();}
    FLX.fillStyle=rgba(col,1);for(const q of arr){const r=(q.r||fR(q,c.T))*1.1;FLX.beginPath();FLX.arc(q.x,q.y,r,0,TAU);FLX.fill();}
    g.save();g.globalAlpha=d.a;g.drawImage(FLC,0,0,size,size,ox-R,oy-R,R*2,R*2);g.restore();
    g.fillStyle=`rgba(255,255,255,${d.oil?.4:.22})`;for(const q of arr){const r=q.r||8;if(r<5)continue;g.beginPath();g.ellipse(ox+q.x-r*.3,oy+q.y-r*.35,r*.28,r*.12,-.6,0,TAU);g.fill();}
    if(q0.k==='butter'&&c.T>105){g.fillStyle='rgba(255,250,230,.7)';for(const q of arr){if(Math.random()<.5){g.beginPath();g.arc(ox+q.x+rand(-q.r,q.r)*.6,oy+q.y+rand(-q.r,q.r)*.6,rand(1,2.6),0,TAU);g.fill();}}}
    if(d.oil&&c.T>140){const A=Math.min(1,(Math.min(c.T,260)-140)/120);g.lineWidth=1;for(let i=0;i<arr.length;i+=3){const q=arr[i],r=q.r||8,an=G.t*(1+i*.07)+i;g.strokeStyle=`rgba(255,246,215,${A*.28*(.5+.5*Math.sin(G.t*9+i*2))})`;g.beginPath();g.arc(ox+q.x,oy+q.y,r*.6,an,an+.6);g.stroke();}}}}
