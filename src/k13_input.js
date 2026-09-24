
/* ---------- tools & held ---------- */
function setTool(t){if(G.held&&t!==G.tool&&t!=='hand')returnHeld();if(t===G.tool)return;const prev=G.tool;if(prev!=='hand')G.lastTool=prev;G.tool=t;G.spat.down=false;if(t!=='ladle')G.ladle=null;
  if(t==='knife')AU.nz({f:5000,f2:9000,type:'highpass',a:.02,d:.22,v:.18});else if(t!=='hand')AU.tone({f:300,f2:220,d:.06,v:.12});else if(prev==='knife'){AU.tone({f:1900,d:.25,v:.05});AU.nz({f:3500,d:.03,v:.12});}else AU.place();updateCursor();}
function returnHeld(){const h=G.held;if(!h)return;if(h.kind==='custard'&&G.steamer.on){G.steamer.custard=h.cu;G.held=null;AU.place();return;}if(G.mode!=='practice'){if(h.src==='fridge'||h.src==='pantry'){G.stock[h.id]=(G.stock[h.id]||0)+1;if(h.lotD!==undefined&&h.lotD!==null)putLot(h.id,h.lotD);}}G.held=null;AU.pick();}
function pickPantry(p){if(p.kind==='steamer'){if(!ingOpen('steamer')){floatText('🔒 '+lockMsg('steamer'),p.x,196,'#ffd0b0',20);return;}if(G.steamer.on){floatText('이미 냄비 위에 있어요',p.x,196,'#ffd0b0',20);return;}if(G.held)returnHeld();setTool('hand');G.held={kind:'steamerItem'};AU.pick();return;}if(!ingOpen(p.id)){floatText('🔒 '+lockMsg(p.id),p.x,p.row===1?120:196,'#ffd0b0',20);AU.knock&&AU.knock();return;}if(G.held)returnHeld();setTool('hand');
  if(p.kind==='noodle'){if(G.mode!=='practice'&&(G.stock[p.id]||0)<=0){floatText('재고가 없어요 — 장보기',p.x,120,'#ffd0b0',20);return;}if(G.mode!=='practice')G.stock[p.id]--;G.held={kind:'noodle',id:p.id,nt:p.nt,src:'pantry'};}
  else if(p.kind==='bottle')G.held={kind:'bottle',id:p.id,tilt:0,active:false,poured:0,flow:0};
  else if(p.kind==='powder')G.held={kind:'powder',id:p.id,tilt:0,active:false,poured:0,flow:0};
  else if(p.kind==='shaker')G.held={kind:'shaker',id:p.id,active:false,poured:0,shake:0};
  else if(p.kind==='nori')G.held={kind:'nori',id:'nori'};AU.pick();}
function dropFx(c,wet,x,y){if(c.cook&&!(c.liq&&c.liq.vol>15)&&c.T>120){const I=Math.min(1,wet/25)*clamp((c.T-100)/150,0,1);AU.sizzleBurst(.2+I*.6,x);if(c.T>150)floatText(pick(['치이익!','촤아악!','지글지글']),x,y-34,'#ffe3b0');if(c.oilAmt>1)splatter(x,y,Math.min(30,wet*1.2|0));}
  else if(c.liq&&c.liq.vol>15){AU.splash(.25,x);for(let i=0;i<4;i++)spawn({k:'ring',x:x+rand(-10,10),y:y+rand(-10,10),r:3,max:.6});}else AU.place();}
function useHeld(x,y){const h=G.held,c=contAt(x,y);
  if(inTrash(x,y)&&h.kind!=='bottle'&&h.kind!=='shaker'&&h.kind!=='powder'){AU.trash();G.held=null;return;}
  switch(h.kind){
  case'steamerItem':placeSteamer(c&&c.kind==='steamer'?c.on:c,x,y);return;
  case'mandu':dropMandu(c,x,y);return;
  case'custard':placeCustard(c,x,y);return;
  case'ing':{const pc=h.piece;if(inBoard(x,y)){pc.x=clamp(x,L.board.x+30,L.board.x+L.board.w-30);pc.y=clamp(y,L.board.y+30,L.board.y+L.board.h-30);G.board.pieces.push(pc);AU.place();G.held=null;}
    else if(c&&c.kind!=='mix'){addItem(c,pc,x,y,true);dropFx(c,pc.mass*pc.moist,x,y);G.held=null;}else if(c&&c.kind==='mix'){addItem(c,pc,x,y);G.held=null;AU.place();}return;}
  case'rice':if(c&&c.kind!=='mix'){const gs=makeGrains(480,x-c.x,y-c.y,Math.min(58,c.r*.5),8);for(const g2 of gs){if(!c.cook)g2.z=0;if(c.cook)g2.cooked=true;c.items.push(g2);}if(c.t0<0)c.t0=G.t;AU.thud();if(c.cook&&c.T>120){AU.sizzleBurst(.5,x);floatText('촤악!',x,y-40,'#ffe3b0');}G.held=null;}return;
  case'egg':if(!c)return;{const lx=x-c.x,ly=y-c.y;
    if(c.kind==='mix'){c.egg+=1;c.mixv*=.6;AU.crack();G.held=null;return;}
    if(c.liq&&c.liq.vol>15){if(Math.hypot(lx,ly)>c.r*.62){const e=newEgg(lx*.45,ly*.45);e.poach=true;c.eggs.push(e);AU.crack();setTimeout(()=>AU.splash(.2,x),100);floatText('톡!',x,y-30,'#ffe9a0',24);}else{c.beggs.push(newBegg(lx,ly));AU.splash(.2,x);floatText('껍질째 퐁당',x,y-30,'#ffe9a0',22);}G.held=null;return;}
    if(c.cook){if(c.eggs.length>=2){floatText('계란은 두 개까지',x,y-30,'#ffd0b0',20);return;}const d=Math.hypot(lx,ly),lim=Math.max(0,c.r-62),e=newEgg(d>lim?lx*lim/d:lx,d>lim?ly*lim/d:ly);c.eggs.push(e);AU.crack();if(c.T>110){setTimeout(()=>AU.sizzleBurst(.35+.35*clamp((c.T-110)/100,0,1),c.x),120);floatText('치익—',x,y-44,'#ffe3b0');}G.held=null;return;}}return;
  case'begg':{if(inBoard(x,y)){const p=newPiece('begg',x,y);p.yolk=h.egg.yolk;p.white=h.egg.white;p.T=h.egg.T;G.board.pieces.push(p);AU.place();floatText('껍질을 까서 올렸어요',x,y-40,'#ffe9a0',20);G.held=null;}else if(c){c.beggs.push(Object.assign(h.egg,{x:x-c.x,y:y-c.y}));G.held=null;AU.place();}return;}
  case'noodle':if(c&&c.kind!=='mix'&&c.kind!=='prep'){const n=newNoodle(h.nt,x-c.x,y-c.y);c.noodles.push(n);if(c.t0<0)c.t0=G.t;if(c.liq&&c.liq.vol>15){AU.splash(.3,x);c.liq.T-=n.g*.02*(NT[h.nt].frozen?6:1)*1000/Math.max(200,c.liq.vol);}else AU.thud();
    G.held=h.nt==='ramyeon'?{kind:'packet',id:'packet'}:null;}return;
  case'noodleObj':if(c){const n=h.n;const cx=x-c.x,cy=y-c.y;if(c.kind==='bowl'&&(n.type==='udon'||n.type==='ramyeon'||n.type==='ramen')){udonFill(n,c.r*(n.type==='udon'?.64:.8),n.type==='udon'?.6:.35);if(Math.random()<.5)addDrip(c,Math.atan2(cy,cx)+rand(-.6,.6),c.liq?liqCol(c.liq):[200,190,160]);}else if(c.kind==='bowl'||c.kind==='plate'||c.kind==='strainer'){nestNoodle(n,c.r*(c.kind==='plate'?.62:c.kind==='bowl'?.76:.66),cx*.2,cy*.2);if(c.kind==='bowl'&&Math.random()<.5)addDrip(c,Math.atan2(cy,cx)+rand(-.6,.6),c.liq?liqCol(c.liq):[200,190,160]);}else nestNoodle(n,c.r*.7,cx*.3,cy*.3);c.noodles.push(n);if(c.t0<0)c.t0=G.t;AU.splash(.15,x);G.held=null;}return;
  case'packet':if(c&&c.liq&&c.liq.vol>15){const q=c.liq;q.salt+=4.8;q.spicy+=6;q.umami+=3;q.col=mix(q.col,[222,92,30],.78);q.fat+=6;AU.nz({f:3000,type:'highpass',d:.3,v:.12});for(let i=0;i<14;i++)spawn({k:'flake',type:'chili',x:x+rand(-14,14),y:y+rand(-14,14),z:20,vz:0,amt:0,rot:0,max:2});G.held=null;}else floatText('물이 담긴 냄비에 넣어요',x,y-30,'#ffd0b0',20);return;
  case'ice':if(c){for(let i=0;i<5;i++)c.ice.push({x:x-c.x+rand(-18,18),y:y-c.y+rand(-18,18),m:9,rot:rand(0,1)});if(c.liq)c.liq.T=Math.max(0,c.liq.T-3);AU.clink();G.held=null;}return;
  case'nori':if(c&&(c.kind==='bowl'||c.kind==='plate')){const lx=x-c.x,ly=y-c.y,d=Math.hypot(lx,ly)||1,r=Math.min(d,c.r*.7);c.seeds.push({type:'nori',x:lx/d*r,y:ly/d*r,rot:Math.atan2(ly,lx)+PI/2});AU.place();G.held=null;}return;
  case'butter':if(c&&c.cook){addFluid(c,'butter',12,x,y,0,0,20);AU.sizzleBurst(.25,x);G.held=null;}else if(c){c.seeds.push({type:'butterpat',x:x-c.x,y:y-c.y,rot:0});c.garn=c.garn||{};c.garn.butter=1;G.held=null;AU.place();}return;
  default:h.active=true;}}
function ladleClick(c,x,y){const lx=x-c.x,ly=y-c.y,Ld=G.ladle;
  if(Ld){if(Ld.liq){if(c.liq&&c.liq.vol>15||c.kind==='pot'||c.kind==='sauce'||c.kind==='bowl')liqMerge(c,Ld.liq);else if(c.kind==='mix'){c.water+=Ld.liq.vol;}else addFluid(c,Ld.liq.starch>.05?'pastaw':'water',Ld.liq.vol,x,y,0,0,Ld.liq.T);AU.splash(.3,x);}
    else if(Ld.batter){if(c.kind==='pan'){const j=c.jeons.find(q=>dist(q.x,q.y,lx,ly)<avgRad(q)&&q.set<.5);if(j)mergeJeon(j,Ld.batter);else makeJeon(c,lx,ly,Ld.batter);}else if(c.kind==='mix'){c.flour+=Ld.batter.flour;c.water+=Ld.batter.water;c.egg+=Ld.batter.egg;c.items.push(...Ld.batter.items);}else{floatText('반죽은 팬에 부어요',x,y-30,'#ffd0b0',20);return;}}
    else if(Ld.begg){c.beggs.push(Object.assign(Ld.begg,{x:lx,y:ly}));AU.place();}
    else if(Ld.fluid){let hit=null;for(const o of c.items)if(o.L&&pointInPiece({...o,x:c.x+o.x,y:c.y+o.y},x,y)){hit=o;break;}
      if(hit){const m=Ld.fluid.reduce((s,q)=>s+q.m,0),T=c.T;hit.baste=Math.min(90,(hit.baste||0)+Math.max(0,T-30)*.9);hit.aroma+=Ld.fluid.some(q=>q.k==='butter')?m*.4:m*.1;AU.sizzleBurst(.4,x);floatText('촤르르—',x,y-30,'#ffe3b0',24);}
      for(const q of Ld.fluid){q.x=lx+rand(-8,8);q.y=ly+rand(-8,8);if(c.fluid)c.fluid.push(q);}}
    G.ladle=null;return;}
  if(c.liq&&c.liq.vol>20){const be=c.beggs.find(b=>dist(b.x,b.y,lx,ly)<26);if(be){c.beggs.splice(c.beggs.indexOf(be),1);G.ladle={begg:be,col:rgba(c.liq.col,.8)};AU.splash(.15,x);return;}
    const take=Math.min(120,c.liq.vol),part=liqTake(c.liq,take/c.liq.vol);G.ladle={liq:part,col:rgba(part.col,.9)};AU.splash(.2,x);return;}
  if(c.kind==='mix'&&batterVol(c)>20){const f=Math.min(1,160/batterVol(c)),col=rgba(batterColor(c,c.items),1);G.ladle={batter:takeBatter(c,f),col};return;}
  if(c.fluid.length){const got=c.fluid.filter(q=>dist(q.x,q.y,lx,ly)<44);if(got.length){c.fluid=c.fluid.filter(q=>!got.includes(q));G.ladle={fluid:got,col:rgba(LQ[got[0].k].col,.9)};AU.splash(.1,x);}}}

/* ---------- pointer ---------- */
function toLocal(e){const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*W,y:(e.clientY-r.top)/r.height*H};}
cv.addEventListener('pointerdown',e=>{if(!G||!G.started||G.paused)return;AU.init();try{cv.setPointerCapture(e.pointerId);}catch(_){}
  const q=toLocal(e),x=q.x,y=q.y;M.x=M.px=x;M.y=M.py=y;M.down=true;M.inside=true;e.preventDefault();G.spat.x=x;G.spat.y=y;
  if(e.button===2){if(G.held)returnHeld();else if(G.ladle)G.ladle=null;else if(G.tool!=='hand')setTool('hand');else rotateBoard();return;}
  if(e.button===1){e.preventDefault();if(G.tool==='hand')setTool(G.lastTool||'knife');else setTool('hand');return;}
  const kb=knobAt(x,y);if(kb){G.drag={kind:'knob',b:kb,sy:y,sl:kb.level,moved:false};return;}
  if(!G.held&&inFridge(x,y)){openFridge();return;}
  const rk=!G.held?rackAt(x,y):null;if(rk){if(rk==='rack'||rk===G.tool)setTool('hand');else setTool(rk);return;}
  const sh=shelfAt(x,y);if(sh){if(G.held)returnHeld();else pickPantry(sh);return;}
  if(!G.held&&faucetAt(x,y)){G.sink.tap=!G.sink.tap;AU.click();return;}
  if(G.held){useHeld(x,y);return;}
  const hc=(G.tool!=='knife'||!inBoard(x,y))?handleAt(x,y):null;if(hc){G.drag={kind:'cont',c:hc,ox:hc.x-x,oy:hc.y-y,sx:x,sy:y,t0:G.t,moved:false};return;}
  const t=G.tool,c=contAt(x,y);
  if(t==='hand'&&steamerHandClick(x,y))return;
  if(t==='hand'){const rc=rimAt(x,y);if(rc){G.drag={kind:'cont',c:rc,ox:rc.x-x,oy:rc.y-y,sx:x,sy:y,t0:G.t,moved:false};return;}
    if(x>L.board.x&&x<L.board.x+L.board.w&&y>L.board.y&&y<L.board.y+L.board.h){if(boardGrabbable(x,y)&&G.board.pieces.length){G.drag={kind:'board',sx:x,sy:y};AU.slide();return;}const got=grabBoard(x,y);if(got){G.drag={kind:'handful',pieces:got};AU.pick();}return;}
    if(!c&&!inSink(x,y)&&y>230){G.drag={kind:'wipe'};wipeAt(x,y);return;}
    if(c){const hot=c.cook&&(c.T>55||(c.liq&&c.liq.T>55));const be=c.beggs.find(b=>dist(b.x,b.y,x-c.x,y-c.y)<24);if(be&&!hot){c.beggs.splice(c.beggs.indexOf(be),1);G.held={kind:'begg',egg:be};AU.pick();return;}
      if(hot){floatText('앗, 뜨거!',x,y-24,'#ffb38a',26);AU.hot();return;}
      const got=c.items.filter(o=>o.kind==='piece'&&dist(o.x,o.y,x-c.x,y-c.y)<40);if(got.length&&(c.kind==='prep'||c.kind==='strainer'||c.kind==='plate'||c.kind==='bowl'||c.cook)){c.items=c.items.filter(o=>!got.includes(o));for(const o of got){o.x+=c.x;o.y+=c.y;o.ox=o.x-x;o.oy=o.y-y;}G.drag={kind:'handful',pieces:got};AU.pick();}}}
  else if(t==='knife'){if(inBoard(x,y)){chop(x,y);G.knife.lx=x;}}
  else if(t==='spatula'||t==='chop'||t==='ladle'){if(c){const s=G.spat;s.down=true;s.c=c;s.pressT=G.t;s.moved=0;G.drag={kind:'spat'};}
    else if(t==='ladle'&&G.ladle&&G.ladle.begg&&inBoard(x,y)){const p=newPiece('begg',x,y);p.yolk=G.ladle.begg.yolk;p.T=G.ladle.begg.T;G.board.pieces.push(p);G.ladle=null;AU.place();}}});
cv.addEventListener('pointermove',e=>{const q=toLocal(e);M.x=q.x;M.y=q.y;M.inside=true;if(!G||!G.started)return;const d=G.drag;
  if(d){if(d.kind==='knob'){if(Math.abs(q.y-d.sy)>3)d.moved=true;if(d.moved)setLevel(d.b,d.sl+(d.sy-q.y)/140);}
    else if(d.kind==='cont'){const c=d.c;if(!d.moved&&dist(q.x,q.y,d.sx,d.sy)>7){d.moved=true;c.drag=true;c.ret=false;c.lx=c.x;c.ly=c.y;c.pvx=c.pvy=0;AU.nz({f:2500,d:.05,v:.1});}if(d.moved){c.x=clamp(q.x+d.ox,40,W-40);c.y=clamp(q.y+d.oy,40,H-40);}}
    else if(d.kind==='board'){G.board.ox=q.x-d.sx;G.board.oy=q.y-d.sy;}
    else if(d.kind==='wipe')wipeAt(q.x,q.y);
    else if(d.kind==='spat'&&G.tool==='knife'){}}
  if(G.tool==='knife'&&M.down&&!G.drag&&!G.held&&inBoard(q.x,q.y)&&Math.abs(q.x-(G.knife.lx||-99))>=9){const sp=Math.hypot(M.vx,M.vy),jit=(Math.random()-.5)*Math.min(8,sp/220)*((SAVE.up||{}).knife?.4:1);chop(q.x+jit,q.y);G.knife.lx=q.x;}
  updateCursor();});
function wipeAt(x,y){let n=0;G.counter.fluid=G.counter.fluid.filter(q=>{if(dist(q.x,q.y,x,y)<38){n++;return false;}return true;});STX.save();STX.globalCompositeOperation='destination-out';STX.fillStyle='rgba(0,0,0,.25)';STX.beginPath();STX.arc(x,y,26,0,TAU);STX.fill();STX.restore();if(n&&Math.random()<.3){AU.nz({f:2200,d:.08,v:.06});}if(n&&Math.random()<.08)floatText('뽀득',x,y-20,'#e8f4ff',18);}
function setLevel(b,v){const was=b.level>.001;b.level=clamp(v,0,1);const now=b.level>.001;if(!was&&now){b.ign=.3;b.lit=false;AU.ignite();}if(was&&!now){b.lit=false;b.ign=0;AU.click();b.level=0;}}
const KEEPLAY={beef:1,chashu:1,ham:1,loin:1};
function splitLong(o,maxL){if(o.kind!=='piece'||o.L||o.disc||o.bat||KEEPLAY[o.type])return[o];let bw=1e9,ba=0,bl=0,blo=0;for(let k=0;k<18;k++){const a=k/18*PI,c=Math.cos(a),s=Math.sin(a);let lo=1e9,hi=-1e9,lo2=1e9,hi2=-1e9;for(const q of o.poly){const u=q[0]*c+q[1]*s,w=-q[0]*s+q[1]*c;if(u<lo)lo=u;if(u>hi)hi=u;if(w<lo2)lo2=w;if(w>hi2)hi2=w;}if(hi-lo<bw){bw=hi-lo;ba=a;bl=hi2-lo2;blo=lo2;}}
  if(bl<=maxL||bw>30||bl<bw*2.5)return[o];const n=Math.ceil(bl/maxL),step=bl/n,nx=-Math.sin(ba),ny=Math.cos(ba),out=[];let rest=o.poly;
  for(let i=1;i<n;i++){const cut=blo+step*i,lid=CUTID++,A=clipPoly(rest,nx,ny,cut,-1,lid),B=clipPoly(rest,nx,ny,cut,1,lid);if(A.length<3||B.length<3)break;const p=clonePiece(o,A);finalize(p);out.push(p);rest=B;}const last=clonePiece(o,rest);finalize(last);out.push(last);return out;}
function dropPieces(L2,x,y,spread,fromBoard){const c=contAt(x,y);if(c&&(c.kind==='bowl'||c.kind==='plate'))L2=L2.flatMap(o=>splitLong(o,c.r*.5));
  if(c&&(c.kind==='bowl'||c.kind==='plate')&&L2.length>1&&L2.every(o=>o.type===L2[0].type&&KEEPLAY[o.type])){const cx=c.x+(x-c.x)*.3,cy=c.y+(y-c.y)*.3;for(const o of L2)addItem(c,o,cx+(o.ox||0),cy+(o.oy||0));AU.place();return true;}
  if(c&&(c.kind==='bowl'||c.kind==='plate'||c.kind==='prep')){const R=Math.min(c.r*.55,14+Math.sqrt(L2.length)*9),cx=c.x+(x-c.x)*.45,cy=c.y+(y-c.y)*.45;for(const o of L2){const a=rand(0,TAU),r=Math.sqrt(Math.random())*R;o.rot=rand(0,TAU);addItem(c,o,cx+Math.cos(a)*r,cy+Math.sin(a)*r);}AU.place();return true;}
  if(c){let wet=0;for(const o of L2){const px=x+(o.ox||0)*spread,py=y+(o.oy||0)*spread;if(c.kind==='mix'){addItem(c,o,px,py);}else addItem(c,o,px,py,true);wet+=o.mass*o.moist;}dropFx(c,wet,x,y);return true;}
  if(inTrash(x,y)){AU.trash();return true;}return false;}
function endPointer(){M.down=false;if(!G||!G.started)return;const d=G.drag,x=M.x,y=M.y;
  if(G.held&&(G.held.kind==='bottle'||G.held.kind==='shaker'||G.held.kind==='powder'))G.held.active=false;
  if(!d)return;G.drag=null;
  if(d.kind==='knob'){if(!d.moved)setLevel(d.b,d.b.level>0?0:.62);}
  else if(d.kind==='cont'){const c=d.c;if(!d.moved){if(c.kind==='pan'&&G.t-d.t0<.4)toss(c);else if(c.cook&&G.t-d.t0<.4){c.agit=1;for(const n of c.noodles)n.stick=Math.max(0,n.stick-.1);AU.splash(.15,c.x);}return;}
    c.drag=false;if(inTrash(x,y))trashCont(c);else if(inBoard(x,y)&&c.items.some(o=>o.kind==='piece')){const ps=c.items.filter(o=>o.kind==='piece');c.items=c.items.filter(o=>o.kind!=='piece');for(const o of ps){o.x=clamp(x+o.x*.5,L.board.x+30,L.board.x+L.board.w-30);o.y=clamp(y+o.y*.5,L.board.y+30,L.board.y+L.board.h-30);o.flipT=0;o.z=0;if(o.L)o.offT=G.t;G.board.pieces.push(o);}AU.place();}else if(c.kind!=='strainer'&&inSink(x,y)&&!(G.sink.tap&&c.cook&&c.kind!=='pan'&&contEmpty(c))){if(!contEmpty(c))pourAll(c,G.strainer);}
    else{const t=contAt(x,y,c);if(t&&t!==c){if(c.cook&&t.cook&&(contEmpty(c)||contEmpty(t))){const b=c.burner;c.burner=t.burner;t.burner=b;[c.hx,t.hx]=[t.hx,c.hx];[c.hy,t.hy]=[t.hy,c.hy];t.ret=true;AU.clank();floatText('화구를 바꿨어요',t.hx,t.hy-40,'#ffe9a0',22);}else if(c.kind==='mix')pourBatter(c,t);else pourAll(c,t);}}c.ret=true;}
  else if(d.kind==='board'){const ox=G.board.ox,oy=G.board.oy,B=G.board.pieces;G.board.ox=G.board.oy=0;if(!B.length||Math.hypot(ox,oy)<30)return;
    let cx=0,cy=0;for(const p of B){cx+=p.x;cy+=p.y;}cx/=B.length;cy/=B.length;for(const p of B){p.ox=p.x-cx;p.oy=p.y-cy;}
    if(dropPieces(B,x,y,.3,true)){G.board.pieces=[];AU.slide();floatText('도마째 탈탈!',x,y-50,'#ffe9a0',24);}}
  else if(d.kind==='handful'){const L2=d.pieces;if(!dropPieces(L2,x,y,.8)){for(const o of L2){o.x=clamp(x+o.ox,L.board.x+16,L.board.x+L.board.w-16);o.y=clamp(y+o.oy,L.board.y+16,L.board.y+L.board.h-16);G.board.pieces.push(o);}AU.place();}}
  else if(d.kind==='spat'){const s=G.spat;const quick=G.t-s.pressT<.3&&s.moved<10&&s.c;
    if(quick&&G.tool==='chop'){const c=s.c,lx=x-c.x,ly=y-c.y;let best=null,bd=1e9;for(const o of c.items){if(o.kind!=='piece')continue;const d=dist(o.x,o.y,lx,ly);if(d<Math.max(26,o.r)&&d<bd){bd=d;best=o;}}
      if(best){c.items.splice(c.items.indexOf(best),1);if(c.kind==='mix')coatBatter(c,best);best.x=x;best.y=y;best.flipT=0;if(best.L)best.offT=G.t;G.held={kind:'ing',id:best.type,piece:best,src:null,tongs:1};AU.pick();}
      else if(c.noodles.length){const n=c.noodles.shift();G.held={kind:'noodleObj',n,from:c};AU.pick();if(c.liq&&c.liq.vol>15)for(let i=0;i<6;i++)spawn({k:'drop',x:x+rand(-10,10),y:y+rand(-10,10),z:12,vx:rand(-30,30),vy:rand(-30,30),vz:rand(20,60),max:2});}
      else if(c.beggs.length){const b=c.beggs.find(q=>dist(q.x,q.y,lx,ly)<26);if(b){c.beggs.splice(c.beggs.indexOf(b),1);G.held={kind:'begg',egg:b};AU.pick();}}}
    else if(quick&&G.tool==='ladle')ladleClick(s.c,x,y);
    else if(quick&&G.tool==='spatula'){const c=s.c,lx=x-c.x,ly=y-c.y;const j=c.jeons.find(q=>dist(q.x,q.y,lx,ly)<avgRad(q)+6),e=c.eggs.find(q=>dist(q.x,q.y,lx,ly)<avgRad(q)+8);
      if(j)flipJeon(c,j,false);else if(e&&!e.poach)flipEgg(c,e);else{let n=0;for(const o of c.items)if(o.z<1&&(o.x-lx)**2+(o.y-ly)**2<32*32){flip(o);n++;}if(n){AU.flop();if(c.T>130)AU.sizzleBurst(Math.min(.4,n*.01),c.x);}}}
    s.down=false;}
  updateCursor();}
cv.addEventListener('pointerup',endPointer);cv.addEventListener('pointercancel',endPointer);cv.addEventListener('pointerleave',()=>{M.inside=false;});
cv.addEventListener('contextmenu',e=>e.preventDefault());
cv.addEventListener('wheel',e=>{if(!G||!G.started)return;const b=knobAt(M.x,M.y);if(b){e.preventDefault();setLevel(b,b.level+(e.deltaY<0?.05:-.05));return;}
  if(G.tool==='knife'){e.preventDefault();G.knife.ang=clamp(G.knife.ang+(e.deltaY<0?-1:1)*deg(5),deg(-60),deg(60));}},{passive:false});
function updateCursor(){if(!G)return;let c='default';const x=M.x,y=M.y;
  if(G.drag&&(G.drag.kind==='cont'||G.drag.kind==='handful'||G.drag.kind==='board'))c='grabbing';else if(G.held)c='none';
  else if(knobAt(x,y))c='ns-resize';else if(shelfAt(x,y)||rackAt(x,y)||inFridge(x,y)||faucetAt(x,y))c='pointer';else if(handleAt(x,y)||(G.tool==='hand'&&rimAt(x,y)))c='grab';
  else if(G.tool==='hand')c=(inBoard(x,y)&&G.board.pieces.length)?'grab':'default';else c='none';cv.style.cursor=c;}
addEventListener('keydown',e=>{if(!G||!G.started||G.paused)return;const k=e.code,T=['hand','knife','spatula','chop','ladle','probe'];
  if(/^Digit[1-6]$/.test(k))setTool(T[Number(k[5])-1]);else if(k==='KeyR')rotateBoard();else if(k==='Space'){e.preventDefault();const c=contAt(M.x,M.y);toss(c&&c.kind==='pan'?c:G.cw[2]);}
  else if(k==='KeyQ'){if(G.tool==='hand')setTool(G.lastTool||'knife');else setTool('hand');}
  else if(k==='Escape'){returnHeld();G.ladle=null;}else if(k==='KeyF')openFridge();else return;updateCursor();});

/* ---------- boot ---------- */
function fit(){const vw=innerWidth||W,vh=innerHeight||H;S=Math.min(vw/W,vh/H);stage.style.transform=`translate(${(vw-W*S)/2}px,${(vh-H*S)/2}px) scale(${S})`;DPR=Math.min(devicePixelRatio||1,2);PX=Math.max(.5,S*DPR);cv.width=Math.round(W*PX);cv.height=Math.round(H*PX);buildStatic();FLC=null;}
buildTextures();loadSave();G=makeState('idle');G.stock=SAVE.stock;fit();addEventListener('resize',fit);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{buildStatic();for(const k in ICON)delete ICON[k];});
toTitle();
let last=performance.now();
function frame(now){const dt=Math.min(.05,Math.max(.001,(now-last)/1000));last=now;if(G.started&&!G.paused)update(dt);render();requestAnimationFrame(frame);}
requestAnimationFrame(frame);
})();
