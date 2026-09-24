
/* ================= DLC: 튀김 팩 (deep frying) · 찜 팩 (steaming) ================= */
/* ---------- new ingredients ---------- */
function spudShape(){const P=[],n=18;for(let i=0;i<n;i++){const a=i/n*TAU,k=1+.06*Math.sin(3*a+.7);P.push([Math.cos(a)*98*k,Math.sin(a)*(30-Math.abs(Math.cos(a))*6)*k]);}return P;}
function manduShape(){const P=[],R=30;for(let i=0;i<=16;i++){const a=PI+i/16*PI;P.push([Math.cos(a)*R,Math.sin(a)*R*.72+6]);}for(let i=0;i<=8;i++){P.push([R-i/8*2*R,6+(i%2?3.5:0)]);}return P;}
Object.assign(ING,{
  sweetpotato:{n:'고구마',tw:210,th:70,sh:spudShape,moist:.6,T0:12,cookRate:.045,brownRate:.04,hk:.9,tint:[250,200,100,.25],brown:[170,90,30],edge:'rgba(120,40,60,.55)',cyl:'sweet'},
  loin:{n:'돼지 등심',tw:170,th:116,sh:()=>rrPoly(144,94,22,5),moist:.5,T0:4,cookRate:.06,brownRate:.05,hk:.8,tint:[236,214,200,.55],brown:[170,100,50],edge:'rgba(180,110,100,.5)'},
  mandu:{n:'만두',tw:70,th:56,sh:manduShape,moist:.6,T0:-10,cookRate:.07,brownRate:.05,hk:1,tint:[255,250,240,.2],brown:[190,130,60],edge:'rgba(170,150,120,.6)'},
});
Object.assign(TEXF,{
  sweetpotato(g,w,h){vgrad(g,w,h,[[0,'#7a2a3c'],[.3,'#a8455a'],[.5,'#b95668'],[.7,'#a8455a'],[1,'#7a2a3c']]);for(let i=0;i<40;i++){g.strokeStyle='rgba(70,20,30,.25)';g.lineWidth=rand(.5,1.4);g.beginPath();const x=rand(0,w),y=rand(0,h);g.moveTo(x,y);g.lineTo(x+rand(6,16),y+rand(-2,2));g.stroke();}},
  loin(g,w,h){vgrad(g,w,h,[[0,'#f6ece2'],[.16,'#f1e0d2'],[.22,'#e7a9a0'],[1,'#dc948c']]);specks(g,w,h,500,['rgba(255,240,235,.35)','rgba(190,100,95,.3)'],.6,1.8);},
  mandu(g,w,h){vgrad(g,w,h,[[0,'#f3ede0'],[.5,'#fbf8f0'],[1,'#ece4d4']]);g.strokeStyle='rgba(190,175,150,.55)';g.lineWidth=1.2;for(let i=0;i<7;i++){const x=w*.2+i*w*.1;g.beginPath();g.moveTo(x,h*.5);g.quadraticCurveTo(x+3,h*.62,x+1,h*.72);g.stroke();}},
});
Object.assign(VOL,{sweetpotato:{th:12,cut:[248,214,118],skin:[150,54,76],cyl:1},loin:{th:14,cut:[232,170,160],skin:[246,236,226]},mandu:{th:9,cut:[250,246,236],skin:[236,228,212],dome:1}});
SHELF.sweetpotato=9;SHELF.loin=4;
FRIDGE.push(['sweetpotato','고구마',900,'ing'],['loin','돈카츠용 등심',3500,'ing'],['mandu','냉동 만두 6개',2800,'mandu']);
for(const f of FRIDGE.slice(-3))PRICE[f[0]]=f[2];
LQ.katsu={n:'돈카츠 소스',salt:.05,col:[74,36,16],a:.92,film:320,vis:3.6,wat:.35,dark:.6,sweet:.3,sauce:1};
BOT.katsu={w:36,body:'#4a2414',cap:'#e0b030',label:'돈카츠',lab:'#f6e2b0',ink:'#4a2414',rate:6,sq:1};
SHK.panko={n:'빵가루',fill:'#f0d59a',dot:'#e0b870',rate:3};
PANTRY.push({id:'panko',x:918,row:2,kind:'shaker',n:'빵가루'},{id:'katsu',x:984,row:2,kind:'bottle',n:'돈카츠 소스'},{id:'steamer',x:1082,row:2,kind:'steamer',n:'찜기'});

/* ---------- 튀김: deep-fry oil in a pot ---------- */
const isOil=c=>!!(c&&c.liq&&c.liq.vol>15&&c.liq.fat>c.liq.vol*.6);
function stepOil(c,dt){const q=c.liq,b=G.burners[c.burner];
  const power=(c.onBurner&&b.lit)?b.level*b.P*4200:0,cap=c.C+q.vol*.5,loss=(q.T-22)*(6+q.vol*.004);q.T+=(power-loss)/cap*dt;if(q.T<15)q.T=15;
  c.T=q.T;c.boil=0;c.foam=0;if(q.T>205)c.smokeNow+=(q.T-205)/18*dt*60*.05;
  physics(c,dt,true);let sizzle=0;
  for(const o of c.items){if(o.kind!=='piece')continue;
    if(!o._inOil){o._inOil=1;q.T-=Math.min(22,(o.mass||1)*1.3*600/Math.max(150,q.vol));if(q.T>140)AU.sizzleBurst(.35,c.x);}
    const k=.6*clamp(14/Math.sqrt(o.area||40),.08,1.2),tgt=Math.min(q.T,100+Math.max(0,q.T-100)*.05);o.T+=(tgt-o.T)*k*dt;if(o.T>o.Tmax)o.Tmax=o.T;
    const d=ING[o.type]||{};if(o.T>55)o.cook+=(o.T-55)/45*(d.cookRate||.06)*dt;o.cooked=true;o.moist=Math.max(0,o.moist-dt*.004*Math.max(0,q.T-100)/60);
    if(o.bat){if(q.T>130)o.bat.fry+=(q.T-130)/45*.025*dt;if(q.T<145&&o.bat.fry<.8)o.bat.greasy+=dt*(145-q.T)/40*.05;sizzle+=o.moist;}
    else if(q.T>140)o.face[0]=o.face[1]=Math.min(2,Math.max(o.face[0],o.face[1])+dt*(q.T-140)/60*.02);}
  if(sizzle&&q.T>140&&Math.random()<dt*2)AU.sizzleBurst(Math.min(.25,.05+sizzle*.04),c.x);
  for(const f of c.fluid)liqAdd(c,f.k,f.m,f.T);c.fluid=[];}
function coatBatter(m,p){if(m.flour<=2||m.water<=2){floatText('반죽이 없어요 — 부침가루와 물',p.x,p.y-30,'#ffd0b0',20);return;}
  const ratio=m.water/m.flour;p.bat={fry:0,greasy:0,ratio,panko:0,egg:m.egg>0?1:0,lumps:Math.max(0,1-m.mixv)};
  const use=Math.min(.35,(p.area||500)/9000);m.flour*=1-use*.3;m.water*=1-use*.3;floatText('튀김옷 입히기',p.x,p.y-30,'#fff2cc',18);}
function pankoLand(f){let hit=null;const bp=inBoard(f.x,f.y)?boardPieceAt(f.x,f.y):null;if(bp)hit=bp;else{const c=contAt(f.x,f.y);if(c)for(const o of c.items){if(o.kind==='piece'&&dist(o.x+c.x,o.y+c.y,f.x,f.y)<Math.max(14,o.r)){hit=o;break;}}}
  if(hit&&hit.bat){hit.bat.panko=Math.min(1.6,hit.bat.panko+f.amt*9000/Math.max(300,hit.area||300));return true;}return false;}
function batCol(b){const f=b.fry;let c=f<.55?mix([246,238,212],[238,196,110],f/.55):f<1.05?mix([238,196,110],[206,138,54],(f-.55)/.5):f<1.5?mix([206,138,54],[132,74,28],(f-1.05)/.45):mix([132,74,28],[48,28,14],Math.min(1,(f-1.5)/.5));if(b.greasy>.3)c=mix(c,[190,160,90],Math.min(.35,b.greasy*.4));return c;}
function drawCoat(g,p,sc){const b=p.bat,V=volOf(p),k=(sc||1)*V.sc,c=batCol(b),R2=mulberry(p.id||3);g.save();g.rotate(p.rot);g.scale(k,k);
  const ring=p.disc&&(ING[p.type]||{}).cyl==='sring',path=()=>{if(p.disc){g.beginPath();g.ellipse(0,0,p.dr,p.dr*.94,0,0,TAU);if(ring){g.moveTo(p.dr*.5,0);g.ellipse(0,0,p.dr*.5,p.dr*.47,0,0,TAU,true);}}else tracePoly(g,p.poly);};
  path();g.lineJoin='round';g.strokeStyle=rgba(mix(c,[90,50,20],.12),1);g.lineWidth=b.panko>.3?9:7;g.stroke();g.fillStyle=rgba(c,b.fry<.2?.9:1);g.fill('evenodd');
  // lumpy crust: bumps along the edge and crisp specks inside
  const pts=[];if(p.disc){for(let i=0;i<22;i++){const a=i/22*TAU;pts.push([Math.cos(a)*p.dr,Math.sin(a)*p.dr*.94]);}}else for(let i=0;i<p.poly.length;i++){const a=p.poly[i],bb=p.poly[(i+1)%p.poly.length];pts.push([a[0],a[1]],[(a[0]+bb[0])/2,(a[1]+bb[1])/2]);}
  for(const [x,y] of pts){g.fillStyle=rgba(mix(c,[255,245,220],.18),1);g.beginPath();g.arc(x+(R2()-.5)*3,y+(R2()-.5)*3,2+R2()*2.6,0,TAU);g.fill();}
  g.save();path();g.clip();const bb2=p.disc?p.dr:Math.max(p.ex,p.ey)/2+6;
  if(b.panko>.05){const n=Math.min(260,(b.panko*.7)*(bb2*bb2)/14);for(let i=0;i<n;i++){const cc=mix(c,R2()<.5?[255,236,180]:[150,90,36],.35+R2()*.25);g.fillStyle=rgba(cc,1);g.strokeStyle=rgba(mix(cc,[90,50,20],.4),.7);g.lineWidth=.6;g.save();g.translate((R2()*2-1)*bb2,(R2()*2-1)*bb2);g.rotate(R2()*3);g.beginPath();g.rect(-2.6,-1.4,5.2,2.8);g.fill();g.stroke();g.restore();}}
  else for(let i=0;i<Math.min(90,bb2*bb2/30);i++){g.fillStyle=rgba(mix(c,[150,90,30],.25),.6);g.beginPath();g.arc((R2()*2-1)*bb2,(R2()*2-1)*bb2,.8+R2()*1.4,0,TAU);g.fill();}
  const hl=g.createLinearGradient(-bb2,-bb2,bb2*.4,bb2*.4);hl.addColorStop(0,'rgba(255,255,240,.3)');hl.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=hl;g.fillRect(-bb2-8,-bb2-8,bb2*2+16,bb2*2+16);g.restore();g.restore();}
drawPiece=(orig=>function(g,p,x,y,sc,flat){orig(g,p,x,y,sc,flat);
  if(p.type==='mandu'){g.save();g.translate(x,y);g.rotate(p.rot);const k=(sc||1)*volOf(p).sc;g.scale(k,k);tracePoly(g,p.poly);
    if(p.T<0){g.fillStyle='rgba(255,255,255,.45)';g.fill();g.fillStyle='rgba(255,255,255,.8)';const R2=mulberry(p.id);for(let i=0;i<14;i++)g.fillRect((R2()-.5)*48,(R2()-.3)*28,1.5,1.5);}
    else if(p.cook>.5){const a=Math.min(1,(p.cook-.5)*1.6);g.fillStyle=`rgba(160,120,110,${.16*a})`;g.save();g.clip();g.beginPath();g.ellipse(0,-2,17,9,0,0,TAU);g.fill();g.restore();g.strokeStyle=`rgba(255,255,255,${.55*a})`;g.lineWidth=2.4;g.beginPath();g.arc(-4,-4,16,PI*1.1,PI*1.55);g.stroke();}g.restore();}
  if(p.bat){g.save();g.translate(x,y);drawCoat(g,p,sc);g.restore();}})(drawPiece);
// sweet potato cut face (for the disc renderer)
drawDisc=(orig=>function(g,p,d){if(d.cyl==='sweet'){const r=p.dr;g.beginPath();g.ellipse(0,0,r,r*.94,0,0,TAU);g.fillStyle='#f4cf6a';g.fill();overlays(g,p,d);g.strokeStyle='#8e3048';g.lineWidth=Math.max(1.6,r*.1);g.stroke();g.fillStyle='rgba(255,236,170,.5)';g.beginPath();g.arc(-r*.2,-r*.2,r*.45,0,TAU);g.fill();return;}orig(g,p,d);})(drawDisc);
function drawFryFx(g,c){const q=c.liq,t=G.t;if(q.T<120)return;const hot=clamp((q.T-120)/60,0,1.3);
  for(const o of c.items){if(o.kind!=='piece')continue;const n=Math.round((o.bat?4:2)+o.moist*8*hot),R0=(o.disc?o.dr:Math.max(o.ex||20,o.ey||20)/2)+4;
    for(let i=0;i<n;i++){const a=(i/n)*TAU+t*(1.3+i*.07)+(o.id||0),rr3=R0+((t*40+i*13)%12),s=1+((i*7+Math.floor(t*9))%3);g.strokeStyle=`rgba(255,250,230,${.55-((t*40+i*13)%12)/28})`;g.lineWidth=1;g.beginPath();g.arc(o.x+Math.cos(a)*rr3,o.y+Math.sin(a)*rr3*.94,s,0,TAU);g.stroke();}}
  if(q.T>205){g.fillStyle=`rgba(90,80,70,${Math.min(.25,(q.T-205)/60)})`;g.beginPath();g.arc(0,0,c.r*.9,0,TAU);g.fill();}}

/* ---------- 찜: bamboo steamer on the pot ---------- */
function newSteamer(){return mkCont('steamer',0,0,86,{on:null,T:22,custard:null,steam:0,hx:0,hy:0,garn:{},drips:[]});}
makeState=(orig=>function(m){const s=orig(m);s.steamer=newSteamer();return s;})(makeState);
function placeSteamer(c,x,y){if(c&&(c.kind==='pot'||c.kind==='sauce')&&!c.drag){G.steamer.on=c;G.steamer.r=Math.min(96,c.r-8);G.steamer.x=c.x;G.steamer.y=c.y;G.held=null;AU.clank();floatText('찜기를 올렸어요',c.x,c.y-c.r-10,'#ffe9a0',22);}else{G.held=null;AU.place();floatText('찜기는 냄비 위에 올려요',x,y-30,'#ffd0b0',20);}}
function steamerHandClick(x,y){const S=G.steamer;if(!S.on)return false;const lx=x-S.x,ly=y-S.y;if(Math.hypot(lx,ly)>S.r*.95)return false;
  if(S.custard&&Math.hypot(lx,ly)<48){G.held={kind:'custard',cu:S.custard};S.custard=null;AU.pick();return true;}
  if(!S.items.length&&!S.custard){S.on=null;AU.clank();floatText('찜기를 치웠어요',x,y-30,'#ffe9a0',20);return true;}
  floatText('젓가락으로 하나씩 꺼내요',x,y-30,'#ffd0b0',20);return true;}
function placeCustard(c,x,y){const cu=G.held.cu;if(c&&(c.kind==='bowl'||c.kind==='plate')){c.custard=cu;G.held=null;AU.place();}else if(G.steamer.on&&dist(x,y,G.steamer.x,G.steamer.y)<G.steamer.r){G.steamer.custard=cu;G.held=null;AU.place();}else floatText('그릇에 옮겨 담아요',x,y-30,'#ffd0b0',20);}
function pourCustard(m,dst){if(m.egg<=0){floatText('계란물이 없어요',dst.x,dst.y-40,'#ffd0b0',22);return;}if(dst.custard){floatText('이미 계란찜이 있어요',dst.x,dst.y-40,'#ffd0b0',22);return;}
  dst.custard={egg:m.egg,water:m.water,salt:m.salt||0,mixv:m.mixv,flour:m.flour,set:0,holes:0,T:20};m.egg=0;m.water=0;m.salt=0;m.flour=0;m.mixv=0;AU.splash(.2,dst.x);floatText('계란물 붓기',dst.x,dst.y-40,'#ffe9a0',22);}
function dropMandu(c,x,y){const make=()=>{const a=[];for(let i=0;i<6;i++){a.push(newPiece('mandu',0,0));}return a;};
  if(c&&c.kind!=='mix'){const L2=make();L2.forEach((p,i)=>{const a=i/6*TAU,r=c.kind==='steamer'?c.r*.5:24;p.rot=a+PI/2;addItem(c,p,c.x+Math.cos(a)*r+(x-c.x)*.1,c.y+Math.sin(a)*r+(y-c.y)*.1,c.cook);});G.held=null;AU.place();return;}
  if(inBoard(x,y)){make().forEach((p,i)=>{p.x=clamp(x+(i%3-1)*52,L.board.x+30,L.board.x+L.board.w-30);p.y=clamp(y+(i<3?-26:26),L.board.y+30,L.board.y+L.board.h-30);G.board.pieces.push(p);});G.held=null;AU.place();}}
function stepSteamer(dt){const S=G.steamer;if(!S)return;if(!S.on){S.steam=0;S.T+=(22-S.T)*dt*.2;return;}
  if(!G.cw.includes(S.on)){S.on=null;return;}S.x=S.on.x;S.y=S.on.y;const q=S.on.liq;
  const st=(q&&q.vol>30&&q.fat<q.vol*.5&&q.T>=98)?clamp(.25+S.on.boil*1.1,0,1):0;S.steam=lerp(S.steam,st,dt*2);
  if(st&&q){q.vol=Math.max(0,q.vol-dt*S.steam*1.6);}S.T+=((st?100:Math.max(22,S.T-20))-S.T)*dt*(st?.6:.1);
  for(const o of S.items){o.T+=(S.T-o.T)*.35*dt;if(o.T>o.Tmax)o.Tmax=o.T;const d=ING[o.type]||{};if(o.T>55)o.cook+=(o.T-55)/45*(d.cookRate||.06)*dt*1.2;o.cooked=true;}
  const cu=S.custard;if(cu){cu.T+=(S.T-cu.T)*.3*dt;if(cu.T>70)cu.set+=dt*(cu.T-70)/30*.035;if(cu.set>.2&&cu.set<1.1)cu.holes+=dt*Math.max(0,S.steam-.6)*.08;}
  if(S.steam>.1&&Math.random()<dt*S.steam*6){const a=rand(0,TAU),r=rand(0,S.r*.8);spawn({k:'steam',x:S.x+Math.cos(a)*r,y:S.y+Math.sin(a)*r,vx:rand(-8,8),vy:rand(-50,-25),r:rand(12,20),gr:rand(24,40),a:rand(.18,.32),max:rand(1.2,2.2),seed:rand(0,9)});}}
function drawCustard(g,cu,R,cup){const col=cu.set<.5?mix([244,196,70],[250,212,110],cu.set*2):mix([250,214,120],[240,200,110],Math.min(1,(cu.set-1)*2));
  if(cup){g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.arc(3,5,R+6,0,TAU);g.fill();const cg=g.createRadialGradient(-R*.3,-R*.35,2,0,0,R+6);cg.addColorStop(0,'#ffffff');cg.addColorStop(1,'#d8d2c6');g.fillStyle=cg;g.beginPath();g.arc(0,0,R+6,0,TAU);g.fill();}
  const gr=g.createRadialGradient(-R*.25,-R*.3,2,0,0,R);gr.addColorStop(0,rgba(mix(col,[255,244,200],.4),1));gr.addColorStop(1,rgba(mix(col,[200,150,60],.18),1));g.fillStyle=gr;g.beginPath();g.arc(0,0,R,0,TAU);g.fill();
  if(cu.set<.8){g.strokeStyle=`rgba(255,255,255,${.5*(1-cu.set)})`;g.lineWidth=2;g.beginPath();g.arc(-R*.2,-R*.25,R*.5,PI*1.1,PI*1.6);g.stroke();}
  else{const R2=mulberry(7);g.fillStyle='rgba(255,250,225,.35)';g.beginPath();g.arc(-R*.25,-R*.3,R*.35,0,TAU);g.fill();const n=Math.round(cu.holes*60);for(let i=0;i<n;i++){const a=R2()*TAU,r=Math.sqrt(R2())*R*.85;g.fillStyle='rgba(170,120,40,.55)';g.beginPath();g.arc(Math.cos(a)*r,Math.sin(a)*r,1+R2()*2.2,0,TAU);g.fill();}}}
drawContents=(orig=>function(g,c){if(c.custard&&c.kind!=='steamer')drawCustard(g,c.custard,c.r*(c.kind==='bowl'?.78:.55),false);orig(g,c);})(drawContents);
function drawSteamer(){const S=G.steamer;if(!S||!S.on)return;const g=ctx,x=S.x,y=S.y,R=S.r+10;
  g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.arc(x+6,y+9,R+2,0,TAU);g.fill();
  const rg=g.createRadialGradient(x-R*.3,y-R*.35,R*.2,x,y,R);rg.addColorStop(0,'#e6c28a');rg.addColorStop(1,'#a8783e');g.fillStyle=rg;g.beginPath();g.arc(x,y,R,0,TAU);g.fill();
  g.strokeStyle='rgba(90,56,20,.55)';g.lineWidth=1.4;for(let i=0;i<3;i++){g.beginPath();g.arc(x,y,R-3-i*3.2,0,TAU);g.stroke();}
  g.save();g.beginPath();g.arc(x,y,S.r,0,TAU);g.clip();g.fillStyle='#d6b27a';g.fillRect(x-S.r,y-S.r,S.r*2,S.r*2);g.strokeStyle='rgba(120,80,30,.35)';g.lineWidth=5;for(let k=-S.r;k<S.r;k+=11){g.beginPath();g.moveTo(x+k,y-S.r);g.lineTo(x+k,y+S.r);g.stroke();}g.strokeStyle='rgba(255,240,200,.25)';g.lineWidth=1;for(let k=-S.r+2;k<S.r;k+=11){g.beginPath();g.moveTo(x+k,y-S.r);g.lineTo(x+k,y+S.r);g.stroke();}g.restore();
  g.save();g.translate(x,y);if(S.custard)drawCustard(g,S.custard,40,true);drawContents(g,S);g.restore();
  if(S.steam>.05){for(let i=0;i<5;i++){const t=G.t*.6+i*1.3,a=i*1.26,px=x+Math.cos(a)*S.r*.45+Math.sin(t*2)*8,py=y+Math.sin(a)*S.r*.45-((t*30)%40);g.fillStyle=`rgba(255,255,255,${.12*S.steam})`;g.beginPath();g.arc(px,py,14+((t*20)%12),0,TAU);g.fill();}}
  const tag=S.steam>.15?'김이 모락모락':'물이 끓어야 쪄져요';g.font='600 12px "Gowun Dodum", sans-serif';const w=g.measureText(tag).width+16;rr(g,x-w/2,y+R+4,w,20,8);g.fillStyle='rgba(20,16,12,.8)';g.fill();g.fillStyle=S.steam>.15?'#bfe6ff':'#ffd0b0';g.textAlign='center';g.fillText(tag,x,y+R+18);}
drawPantryItem=(orig=>function(g,p,y){if(p.kind==='steamer'){if(G&&G.steamer&&G.steamer.on){g.save();g.globalAlpha=.25;}else g.save();const x=p.x,cy=y-24;g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(x+3,y-4,30,8,0,0,TAU);g.fill();
  const gr=g.createLinearGradient(x-30,0,x+30,0);gr.addColorStop(0,'#a8783e');gr.addColorStop(.4,'#e2bd82');gr.addColorStop(1,'#9a6a34');g.fillStyle=gr;rr(g,x-30,cy-16,60,28,8);g.fill();g.strokeStyle='rgba(90,56,20,.6)';g.lineWidth=1.2;for(let i=0;i<3;i++){g.beginPath();g.moveTo(x-28,cy-10+i*8);g.lineTo(x+28,cy-10+i*8);g.stroke();}
  g.fillStyle='#e8c890';g.beginPath();g.ellipse(x,cy-16,30,7,0,0,TAU);g.fill();g.restore();return;}orig(g,p,y);})(drawPantryItem);

/* ---------- scoring ---------- */
function dlcHas(v){return{fry:v.items.some(o=>o.bat),steam:v.items.some(o=>o.type==='mandu'),custard:!!v.custard};}
function evalDLC(R,v,sp,cats,note){const W=sp.w||{};
  if(sp.fry){const f=sp.fry,L2=v.items.filter(o=>o.kind==='piece'&&f.types.includes(o.type)),co=L2.filter(o=>o.bat);let sc=100;
    if(L2.length<f.min){sc-=30;note('bad',`튀김이 너무 적어요 (${L2.length}/${f.min}조각)`);}
    if(L2.length&&co.length<L2.length){sc-=20;note('meh','튀김옷 없이 튀긴 재료가 있어요.');}
    if(co.length){const fr=co.reduce((s,o)=>s+o.bat.fry,0)/co.length,gr=co.reduce((s,o)=>s+o.bat.greasy,0)/co.length;
      if(fr<.5){sc-=Math.min(45,(.55-fr)*120);note('bad','튀김옷이 허옇게 덜 튀겨졌어요.');}else if(fr>1.3){sc-=Math.min(55,(fr-1.2)*110);note('bad','튀김옷이 탔어요. 기름이 너무 뜨거웠어요.');}else if(fr>1.12){sc-=10;note('meh','색이 조금 진해요.');}
      if(gr>.3){sc-=Math.min(30,gr*40);note('bad','기름을 먹어 눅눅해요. 기름 온도가 낮았어요 (160~180°C).');}
      if(fr>=.5&&fr<=1.12&&gr<=.3)note('good','튀김옷이 바삭바삭 황금빛이에요!');
      if(f.types.includes('loin')){const raw=L2.some(o=>o.cook<.95);if(raw){sc-=45;note('bad','고기 속이 덜 익었어요! 두꺼우면 조금 낮은 온도로 오래.');}else note('good','속까지 촉촉하게 익었어요.');}
      if(f.types.includes('sweetpotato')&&L2.some(o=>o.type==='sweetpotato'&&o.cook<.75)){sc-=18;note('meh','고구마 속이 딱딱해요.');}
      if(f.types.includes('squid')&&L2.some(o=>o.type==='squid'&&o.cook>4.5)){sc-=15;note('meh','오징어가 질겨졌어요.');}
      if(f.panko){const pk=co.reduce((s,o)=>s+o.bat.panko,0)/co.length;if(pk<.35){sc-=20;note('meh','빵가루가 듬성듬성해요.');}else note('good','빵가루 옷이 두툼하게 바삭해요.');}
      if(f.sauce&&!v.fluid.some(q=>q.k===f.sauce)&&!co.some(o=>o.coat.sauce>.01)){sc-=10;note('meh','소스가 빠졌어요.');}}
    cats.push(['튀김',clamp(sc,0,100),W.fry||.7]);}
  if(sp.steam){const L2=v.items.filter(o=>o.type===sp.steam.type);let sc=100;
    if(L2.length<sp.steam.min){sc-=30;note('bad',`만두가 부족해요 (${L2.length}/${sp.steam.min}개)`);}
    if(L2.length){const ck=L2.reduce((s,o)=>s+o.cook,0)/L2.length;if(L2.some(o=>o.Tmax<50)){sc-=50;note('bad','아직 얼어 있어요!');}else if(ck<.9){sc-=Math.min(45,(1-ck)*80);note('bad','만두 속이 덜 익었어요.');}else if(ck>2.4){sc-=20;note('meh','너무 오래 쪄서 피가 퍼졌어요.');}else note('good','피가 투명하게 쪄졌어요. 속이 촉촉해요!');
      const br=L2.reduce((s,o)=>s+Math.max(o.face[0],o.face[1]),0)/L2.length;if(br>.5)note('meh','찐만두 대신 군만두가 됐네요.');}
    cats.push(['찜',clamp(sc,0,100),W.steam||.7]);}
  if(sp.custard){const cu=v.custard;let sc=0;if(!cu)note('bad','계란찜이 없어요!');else{sc=100;
      if(cu.set<.9){sc-=Math.min(55,(1-cu.set)*90);note('bad','덜 익어 흐물흐물해요.');}else if(cu.set>1.45){sc-=Math.min(35,(cu.set-1.4)*60);note('meh','너무 익어서 퍽퍽해요.');}else note('good','몽글몽글 부드럽게 익었어요.');
      if(cu.holes>.3){sc-=Math.min(30,cu.holes*40);note('meh','불이 세서 구멍이 숭숭 났어요. 약불로!');}else if(cu.set>=.9)note('good','표면이 매끈해요.');
      if(cu.mixv<.55){sc-=15;note('meh','계란이 덜 풀려서 흰자가 뭉쳤어요.');}
      const r=cu.water/Math.max(1,cu.egg*50);if(r<.6){sc-=10;note('meh','물이 적어 단단해요.');}else if(r>1.6){sc-=15;note('meh','물이 많아 잘 안 굳어요.');}
      const sl=cu.salt/Math.max(1,cu.egg);if(sl<.12)note('meh','간이 싱거워요.');else if(sl>.9){sc-=15;note('meh','짜요.');}}
    cats.push(['계란찜',clamp(sc,0,100),W.custard||.7]);}}
const PLATE_DLC={
  yachae(v,add,r){const L2=v.items.filter(o=>o.bat);add(L2.length>=3&&compactAt(L2,0,0,r*.28,r*.46),'튀김을 가운데 소복이 모았어요','튀김을 접시 가운데로 모아 쌓아요');},
  squidfry(v,add,r){const L2=v.items.filter(o=>o.bat);add(L2.length>=3&&compactAt(L2,0,0,r*.28,r*.46),'오징어튀김을 가운데 소복이','튀김을 접시 가운데로 모아요');},
  katsu(v,add,r){const b=v.items.filter(o=>o.type==='loin');let ok=false;if(b.length>=3){const a0=b[0].rot;ok=b.every(o=>{const d=Math.abs((((o.rot-a0)%PI)+PI*1.5)%PI-PI/2);return d<.35;});}
    add(ok,'돈카츠를 썬 모양 그대로 가지런히','썬 조각을 나란히 붙여 놓아요');const cb=v.items.filter(o=>o.type==='cabbage'),cs=circSpread(cb);add(cb.length>=3&&cs.R>.6&&cs.r>r*.25,'양배추채를 한쪽에 소복이','양배추채를 접시 한쪽에 모아요');
    add(v.fluid.some(q=>q.k==='katsu')||b.some(o=>o.coat.sauce>.01),'소스를 뿌렸어요','돈카츠 소스를 뿌려요');},
  mandu(v,add,r){const L2=v.items.filter(o=>o.type==='mandu');let sep=L2.length>=4;for(let i=0;i<L2.length&&sep;i++)for(let j=i+1;j<L2.length;j++)if(dist(L2[i].x,L2[i].y,L2[j].x,L2[j].y)<16){sep=false;break;}add(sep,'만두가 겹치지 않게 담았어요','핀셋으로 만두를 간격 두고 둘러 놓아요');},
  jjim(v,add,r){add(!!v.custard,'계란찜을 그릇에 담았어요','찜기의 계란찜을 그릇으로 옮겨요');add(v.items.some(o=>o.type==='scallion'||o.type==='jjokpa')||((v.garn||{}).sesame||0)>.05,'파·깨로 마무리','송송 썬 파나 깨를 올려요');},
};

/* ---------- recipes ---------- */
Object.assign(DLC,{fry:{n:'튀김 팩',d:'기름 온도를 다루며 바삭하게 튀겨 내는 요리',price:0},steam:{n:'찜 팩',d:'김으로 부드럽게 익히는 요리',price:0}});
const DLC_REC=[
 {id:'yachae',n:'모둠 야채튀김',dlc:'fry',price:9000,vessel:'plate',time:210,sub:'고구마 · 양파 튀김옷 입혀 바삭하게',
  steps:[['고구마·양파 썰기',()=>cutN('sweetpotato',2600)>=3&&cutN('onion',3000)>=2],['반죽 볼에 부침가루 + 물 (1 : 1.3)',()=>G.mix.flour>20&&G.mix.water>20],['냄비에 식용유 붓고 170°C로',()=>G.cw.some(c=>isOil(c)&&c.liq.T>=160)],['튀김옷 입혀 기름에',()=>G.cw.some(c=>isOil(c)&&c.items.some(o=>o.bat))],['노릇하게 튀겨 접시에',()=>G.plate.items.filter(o=>o.bat&&o.bat.fry>.5).length>=3]],
  spec:{fry:{types:['sweetpotato','onion','carrot'],min:4},req:[['fry','튀김이 없어요!']],w:{fry:.8,finish:.2}}},
 {id:'squidfry',n:'오징어튀김',dlc:'fry',price:10000,vessel:'plate',time:200,sub:'링으로 썰어 튀김옷 입혀 바삭하게',
  steps:[['오징어를 링 모양으로 썰기',()=>cutN('squid',2000)>=4],['반죽 볼에 부침가루 + 물',()=>G.mix.flour>20&&G.mix.water>20],['냄비에 식용유 붓고 175°C로',()=>G.cw.some(c=>isOil(c)&&c.liq.T>=165)],['튀김옷 입혀 기름에',()=>G.cw.some(c=>isOil(c)&&c.items.some(o=>o.bat))],['노릇하게 튀겨 접시에',()=>G.plate.items.filter(o=>o.bat&&o.bat.fry>.5).length>=4]],
  spec:{fry:{types:['squid'],min:5},req:[['fry','튀김이 없어요!']],w:{fry:.8,finish:.2}}},
 {id:'katsu',n:'돈카츠',dlc:'fry',price:13000,vessel:'plate',time:260,sub:'계란 반죽 · 빵가루 · 160°C에서 천천히',
  steps:[['반죽 볼에 부침가루 + 물 + 계란',()=>G.mix.flour>20&&G.mix.water>20&&G.mix.egg>=1],['등심에 튀김옷 입혀 도마에',()=>allItems().some(o=>o.type==='loin'&&o.bat)],['빵가루를 골고루 묻히기',()=>allItems().some(o=>o.type==='loin'&&o.bat&&o.bat.panko>.4)],['160°C 기름에 속까지 튀기기',()=>allItems().some(o=>o.type==='loin'&&o.bat&&o.bat.fry>.55&&o.cook>.95)],['썰어서 접시에',()=>G.plate.items.filter(o=>o.type==='loin').length>=3],['양배추채 + 돈카츠 소스',()=>G.plate.items.some(o=>o.type==='cabbage')&&G.plate.fluid.some(q=>q.k==='katsu')]],
  spec:{fry:{types:['loin'],min:3,panko:1,sauce:'katsu'},garn:{cabbage:1},req:[['fry','돈카츠가 없어요!']],w:{fry:.75,finish:.25}}},
 {id:'mandu',n:'찐만두',dlc:'steam',price:7000,vessel:'plate',time:180,sub:'찜기에 촉촉하게',
  steps:[['냄비에 물 끓이기',()=>liqOf(0)&&liqOf(0).T>=99],['찜기를 냄비 위에',()=>!!G.steamer.on],['만두를 찜기에',()=>G.steamer.items.filter(o=>o.type==='mandu').length>=4],['속까지 푹 찌기',()=>G.steamer.items.some(o=>o.type==='mandu'&&o.cook>1)],['접시에 옮기기',()=>G.plate.items.filter(o=>o.type==='mandu').length>=4]],
  spec:{steam:{type:'mandu',min:5},req:[['steam','만두가 없어요!']],w:{steam:.85,finish:.15}}},
 {id:'jjim',n:'계란찜',dlc:'steam',price:6000,vessel:'bowl',time:200,sub:'약불로 매끈하게',
  steps:[['반죽 볼에 계란 3 + 물 + 소금',()=>G.mix.egg>=3&&G.mix.water>=100],['계란물을 곱게 풀기',()=>G.mix.mixv>.6],['찜기에 계란물 붓기',()=>!!G.steamer.custard],['약불로 찌기',()=>G.steamer.custard&&G.steamer.custard.set>=1],['그릇에 옮기고 파·깨',()=>!!G.bowl.custard]],
  spec:{custard:1,garn:{sesame:.2},req:[['custard','계란찜이 없어요!']],w:{custard:.85,finish:.15}}},
];
const liqOf=i=>G.cw[i].liq;
for(const r of DLC_REC){REC.push(r);RID[r.id]=r;}
Object.assign(UNLOCK,{yachae:6,squidfry:6,katsu:7,mandu:8,jjim:8});
