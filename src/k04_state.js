
/* ---------- state ---------- */
const M={x:800,y:500,px:800,py:500,vx:0,vy:0,down:false,inside:false};
let G,FC=0;
const deg=d=>d*PI/180;
function mkCW(){return[
  mkCont('pot',BURN[0].x,BURN[0].y,110,{id:0,name:'냄비',burner:0,C:300,loops:1,ha:0,hl:30}),
  mkCont('sauce',BURN[1].x,BURN[1].y,82,{id:1,name:'편수냄비',burner:1,C:220,ha:deg(-35),hl:104}),
  mkCont('pan',BURN[2].x,BURN[2].y,146,{id:2,name:'큰 팬',burner:2,C:170,ha:deg(125),hl:150}),
  mkCont('pan',BURN[3].x,BURN[3].y,98,{id:3,name:'작은 팬',burner:3,C:80,ha:deg(50),hl:110})].map(c=>Object.assign(c,{
  sprite:c.kind==='pan'?panSprite(c.r):potSprite(c.r),drag:false,ret:false,tossT:0,ax:0,ay:0,lx:c.x,ly:c.y,pvx:0,pvy:0,evapNow:0,evapRate:0,smokeNow:0,smokeRate:0,steamB:0,boil:0,onBurner:true,oilAmt:0,residue:[],flare:0,cook:true}));}
function makeState(mode){
  const s={mode,t:0,started:false,paused:false,modal:null,tool:'hand',held:null,drag:null,ladle:null,
    board:{pieces:[],spin:0,scx:0,scy:0,ox:0,oy:0,lift:0},
    burners:BURN.map((b,i)=>({x:b.x,y:b.y,rb:b.rb,P:b.P,name:b.name,i,level:0,lit:false,ign:0})),
    cw:mkCW(),
    mix:mkCont('mix',L.mix.x,L.mix.y,L.mix.r-10,{flour:0,water:0,egg:0,mixv:0,lumps:0}),
    prep:L.prep.map(p=>mkCont('prep',p.x,p.y,p.r*.78)),
    strainer:mkCont('strainer',L.sink.sx,L.sink.sy,L.sink.sr,{ha:PI,hl:74}),
    plate:mkCont('plate',L.plate.x,L.plate.y,L.plate.r*.8),
    bowl:mkCont('bowl',L.bowl.x,L.bowl.y,L.bowl.r*.84),
    counter:mkCont('counter',0,0,99999),
    sink:{tap:false},
    parts:[],texts:[],smoke:0,alarmT:0,alarmOn:false,hideCursor:false,landSnd:0,gas:0,
    knife:{down:0,last:-1,ang:0},spat:{x:800,y:500,vx:0,vy:0,ang:0,down:false,c:null,pressT:0,moved:0,still:0},
    stats:{},orders:[],sel:null,nextOrder:4,oid:1,served:[],day:null,combo:0};
  return s;}
const COOKS=()=>G.cw;
const CONTS=()=>[...(G.steamer&&G.steamer.on?[G.steamer]:[]),...G.cw,G.mix,...G.prep,G.strainer,G.plate,G.bowl];
const isCook=c=>c&&c.cook;
function boardPieceAt(x,y){for(let i=G.board.pieces.length-1;i>=0;i--)if(pointInPiece(G.board.pieces[i],x,y))return G.board.pieces[i];return null;}
const inBoard=(x,y)=>x>L.board.x+8&&x<L.board.x+L.board.w-8&&y>L.board.y+8&&y<L.board.y+L.board.h-8;
const inTrash=(x,y)=>dist(x,y,L.trash.x,L.trash.y)<L.trash.r+8;
const inSink=(x,y)=>x>L.sink.x&&x<L.sink.x+L.sink.w&&y>L.sink.y&&y<L.sink.y+L.sink.h;
const inFridge=(x,y)=>x>L.fridge.x&&x<L.fridge.x+L.fridge.w&&y>L.fridge.y&&y<L.fridge.y+L.fridge.h;
function contAt(x,y,exclude){const c0=contAt0(x,y,exclude);return c0&&G.steamer&&G.steamer.on===c0&&exclude!==G.steamer&&!G.steamer.drag?G.steamer:c0;}
function contAt0(x,y,exclude){let best=null,bd=1e9;for(const c of CONTS()){if(c===exclude||c.drag)continue;const R=c.kind==='plate'?L.plate.r:c.kind==='bowl'?L.bowl.r:c.kind==='mix'?L.mix.r:c.kind==='prep'?c.r/.78:c.r+8;const d=dist(x,y,c.x,c.y);if(d<R&&d/R<bd){bd=d/R;best=c;}}return best;}
function shelfAt(x,y){if(y<46||y>226||x<150)return null;const row=y<152?1:2;for(const p of PANTRY){if(p.row!==row)continue;if(Math.abs(x-p.x)<(p.kind==='shaker'?26:p.kind==='bottle'?24:34))return p;}return null;}
function knobAt(x,y){for(let i=0;i<4;i++)if(dist(x,y,KNOBX[i],KNOBY)<32)return G.burners[i];return null;}
function segDist(px,py,ax,ay,bx,by){const ex=bx-ax,ey=by-ay;let t=((px-ax)*ex+(py-ay)*ey)/(ex*ex+ey*ey||1);t=clamp(t,0,1);return Math.hypot(px-(ax+ex*t),py-(ay+ey*t));}
function handleSeg(c){const s=Math.sin(c.ha),co=Math.cos(c.ha);return[c.x+co*(c.r+(c.loops?6:30)),c.y+s*(c.r+(c.loops?6:30)),c.x+co*(c.r+8+c.hl),c.y+s*(c.r+8+c.hl)];}
function handleAt(x,y){for(const c of [...G.cw,G.strainer]){const h=handleSeg(c);if(segDist(x,y,h[0],h[1],h[2],h[3])<18)return c;if(c.loops){const h2=[2*c.x-h[0],2*c.y-h[1],2*c.x-h[2],2*c.y-h[3]];if(segDist(x,y,h2[0],h2[1],h2[2],h2[3])<18)return c;}}return null;}
function rimAt(x,y){for(const c of [G.mix,...G.prep,G.plate,G.bowl]){const R=c.kind==='plate'?L.plate.r:c.kind==='bowl'?L.bowl.r:c.kind==='mix'?L.mix.r:c.r/.78;const d=dist(x,y,c.x,c.y);if(d>R-14&&d<R+8)return c;}return null;}
function faucetAt(x,y){return dist(x,y,L.sink.tx,L.sink.ty)<24;}
function rackAt(x,y){const K=L.rack;if(y<K.y||y>K.y+K.h||x<K.x||x>K.x+K.w)return null;for(const t of RACKT)if(x>=t.x0&&x<=t.x1)return t.id;return'rack';}
const RACKT=[{id:'knife',x0:34,x1:222,cx:128},{id:'spatula',x0:226,x1:334,cx:288},{id:'chop',x0:338,x1:420,cx:380},{id:'ladle',x0:424,x1:514,cx:470},{id:'probe',x0:518,x1:576,cx:548}];
const TOOLN={hand:'손',knife:'식칼',spatula:'뒤집개',chop:'긴 젓가락',ladle:'국자',probe:'온도계'};

/* ---------- effects ---------- */
function spawn(o){if(G.parts.length<1500){o.life=0;G.parts.push(o);}}
function floatText(text,x,y,col,size){G.texts.push({text,x,y,life:0,max:1.1,col:col||'#fff4e0',size:size||30,rot:rand(-.08,.08)});}
function splatter(wx,wy,n){for(let i=0;i<n;i++)spawn({k:'drop',x:wx+rand(-20,20),y:wy+rand(-20,20),z:4,vx:rand(-170,170),vy:rand(-170,170),vz:rand(140,330),max:3});}

/* ---------- fluid particles ---------- */
function addFluid(c,key,ml,wx,wy,vx,vy,T){if(ml<=0)return;const lx=wx-c.x,ly=wy-c.y;
  for(const q of c.fluid){if(q.k===key&&q.m<2.2&&(q.x-lx)**2+(q.y-ly)**2<196){const t=q.m+ml;q.x=(q.x*q.m+lx*ml)/t;q.y=(q.y*q.m+ly*ml)/t;q.vx+=(vx||0)*ml/t+rand(-8,8);q.vy+=(vy||0)*ml/t+rand(-8,8);q.w=(q.w*q.m+LQ[key].wat*ml)/t;q.m=t;return;}}
  const n=Math.max(1,Math.round(ml/1.6)),m=ml/n;
  for(let i=0;i<n;i++){const a=rand(0,TAU),sp=rand(5,22);c.fluid.push({k:key,m,x:lx+rand(-3,3),y:ly+rand(-3,3),vx:(vx||0)+Math.cos(a)*sp,vy:(vy||0)+Math.sin(a)*sp,T:T===undefined?20:T,w:LQ[key].wat,burn:0,sear:0,age:0});}
  if(c.t0<0&&c.kind!=='counter')c.t0=G.t;
  while(c.fluid.length>130){let bi=-1,bj=-1,bd=1e9;const F=c.fluid,n2=Math.min(F.length,60);for(let i=0;i<n2;i++)for(let j=i+1;j<n2;j++){if(F[i].k!==F[j].k)continue;const d=(F[i].x-F[j].x)**2+(F[i].y-F[j].y)**2;if(d<bd){bd=d;bi=i;bj=j;}}
    if(bi<0)break;const a=F[bi],b=F[bj],t=a.m+b.m;a.x=(a.x*a.m+b.x*b.m)/t;a.y=(a.y*a.m+b.y*b.m)/t;a.w=(a.w*a.m+b.w*b.m)/t;a.m=t;F.splice(bj,1);}}
const fR=(q,T)=>Math.sqrt(q.m*LQ[q.k].film*(LQ[q.k].oil?1+clamp((T-20)/220,0,1):1)/PI);
function fluidTotal(c,pred){let s=0;for(const q of c.fluid)if(!pred||pred(q))s+=q.m;return s;}

/* ---------- board ---------- */
function chop(kx,ky){
  if(G.t-G.knife.last<((SAVE&&SAVE.up&&SAVE.up.knife)?.045:.07))return;G.knife.last=G.t;G.knife.down=1;
  const a=G.knife.ang,nx=Math.cos(a),ny=Math.sin(a),dx=Math.sin(a),dy=-Math.cos(a);
  const B=G.board.pieces,add=[],rem=new Set();let hit=null;
  for(const p of B){const px=p.x-kx,py=p.y-ky,dn=px*nx+py*ny,dd=px*dx+py*dy;if(Math.abs(dn)>p.rb||dd>KN_UP+p.rb||dd<-KN_DN-p.rb)continue;
    const c=Math.cos(p.rot),s=Math.sin(p.rot),lnx=c*nx+s*ny,lny=-s*nx+c*ny,d=(kx-p.x)*nx+(ky-p.y)*ny;
    const lid=CUTID++,A=clipPoly(p.poly,lnx,lny,d,-1,lid),Bp=clipPoly(p.poly,lnx,lny,d,1,lid);if(A.length<3||Bp.length<3)continue;
    const aA=polyArea(A),aB=polyArea(Bp);if(aA<1||aB<1)continue;hit=hit||p.type;if(aA<6||aB<6)continue;
    const pa=clonePiece(p,A),pb=clonePiece(p,Bp);finalize(pa);finalize(pb);pa.x-=nx;pa.y-=ny;pb.x+=nx*2.4;pb.y+=ny*2.4;pb.rot+=rand(-.02,.02);
    if(p.type==='beef'&&p.cooked&&!p.juiceLost){const rest=G.t-(p.offT||0);if(p.offT>0&&rest<25){pa.juiceLost=pb.juiceLost=true;for(let i=0;i<8;i++){MX.fillStyle='rgba(150,30,30,.18)';MX.beginPath();MX.arc(kx-L.board.x+rand(-30,30),ky-L.board.y+rand(-30,30),rand(3,9),0,TAU);MX.fill();}floatText('육즙이 흘러나와요…',kx,ky-60,'#ffb0a0',22);}}
    rem.add(p);add.push(pa,pb);}
  if(rem.size)G.board.pieces=B.filter(p=>!rem.has(p)).concat(add);
  if(inBoard(kx,ky)){MX.strokeStyle=`rgba(80,45,20,${rand(.05,.12)})`;MX.lineWidth=.8;MX.beginPath();MX.moveTo(kx-L.board.x+dx*40,ky-L.board.y+dy*40);MX.lineTo(kx-L.board.x-dx*30,ky-L.board.y-dy*30);MX.stroke();}
  if(hit){AU.chop(hit,kx);const col=hit==='kimchi'?[180,30,15]:hit==='beef'?[150,30,30]:hit==='carrot'?[240,130,40]:[220,230,200];
    for(let i=0;i<(hit==='kimchi'?5:2);i++)spawn({k:'juice',x:kx,y:ky+rand(-40,40),z:2,vx:rand(-90,90),vy:rand(-60,60),vz:rand(60,160),col,max:2});}else AU.knock();}
function rotateBoard(){const B=G.board.pieces;if(!B.length)return;let cx=0,cy=0,m=0;for(const p of B){cx+=p.x*p.area;cy+=p.y*p.area;m+=p.area;}cx/=m;cy/=m;
  for(const p of B){const dx=p.x-cx,dy=p.y-cy;p.x=cx-dy;p.y=cy+dx;p.rot+=PI/2;}
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of B){const r=Math.min(p.rb,60)*.6;x0=Math.min(x0,p.x-r);x1=Math.max(x1,p.x+r);y0=Math.min(y0,p.y-r);y1=Math.max(y1,p.y+r);}
  const Bd=L.board;let sx=0,sy=0;if(x0<Bd.x+14)sx=Bd.x+14-x0;else if(x1>Bd.x+Bd.w-14)sx=Bd.x+Bd.w-14-x1;if(y0<Bd.y+14)sy=Bd.y+14-y0;else if(y1>Bd.y+Bd.h-14)sy=Bd.y+Bd.h-14-y1;
  for(const p of B){p.x+=sx;p.y+=sy;}G.board.spin=1;G.board.scx=cx+sx;G.board.scy=cy+sy;AU.slide();}
function grabBoard(x,y){const B=G.board.pieces;let direct=null;for(let i=B.length-1;i>=0;i--){if(pointInPiece(B[i],x,y)){direct=B[i];break;}}
  let got=[];if(direct&&direct.area>2200)got=[direct];else for(const p of B){if(p===direct||(p.area<=2200&&dist(p.x,p.y,x,y)<40))got.push(p);}
  if(!got.length)return null;const set=new Set(got);G.board.pieces=B.filter(p=>!set.has(p));for(const p of got){p.ox=p.x-x;p.oy=p.y-y;}return got;}
function boardGrabbable(x,y){if(!inBoard(x,y)&&!(x>L.board.x&&x<L.board.x+L.board.w&&y>L.board.y&&y<L.board.y+L.board.h))return false;
  const edge=Math.min(x-L.board.x,L.board.x+L.board.w-x,y-L.board.y,L.board.y+L.board.h-y)<22;if(edge)return true;return!G.board.pieces.some(p=>dist(p.x,p.y,x,y)<Math.max(42,p.r));}

/* ---------- transfers ---------- */
function addItem(c,o,wx,wy,fall){if(o.cooked&&(c.kind==='plate'||c.kind==='bowl'))c.tHot=G.t;let lx=wx-c.x,ly=wy-c.y;const lim=Math.max(4,c.r-Math.min(o.r||4,20)*.6-4),d=Math.hypot(lx,ly);if(d>lim){lx*=lim/d;ly*=lim/d;}
  o.x=lx;o.y=ly;o.vx=rand(-20,20);o.vy=rand(-20,20);o.z=fall&&isCook(c)?rand(14,34):0;o.vz=0;o.anim=null;o.flipT=0;if(isCook(c))o.cooked=true;c.items.push(o);if(c.t0<0)c.t0=G.t;}
function animTo(o,fromX,fromY,c){o.anim={fx:fromX-c.x,fy:fromY-c.y,t:0,dur:rand(.28,.5),delay:rand(0,.15)};}
function moveNoodle(n,src,dst,k,ox,oy){for(const s of n.strands)for(const p of s.pts){p.x=p.x*k+ox;p.y=p.y*k+oy;const d=Math.hypot(p.x,p.y),lim=dst.r-4;if(d>lim){p.x*=lim/d;p.y*=lim/d;}p.ox=p.x;p.oy=p.y;}}
function pourAll(src,dst){if(src.cook&&(dst.kind==='plate'||dst.kind==='bowl'))dst.tHot=G.t;if(dst.kind==='bowl'&&src.liq&&src.liq.vol>60){const n=1+(Math.random()*3|0);for(let i=0;i<n;i++)addDrip(dst,undefined,liqCol(src.liq));} // move everything from src to dst
  if(!dst)return;const vessel=dst.kind==='plate'||dst.kind==='bowl';const k=vessel?Math.min(.62,dst.r*.8/src.r):Math.min(1,(dst.r*.85)/src.r);let n=0;
  if(src.kind==='mix'){pourBatter(src,dst);return;}
  for(const o of src.items){const wx=src.x+o.x,wy=src.y+o.y;o.x=o.x*k+rand(-4,4);o.y=o.y*k+rand(-4,4);const d=Math.hypot(o.x,o.y),lim=dst.r*.9;if(d>lim){o.x*=lim/d;o.y*=lim/d;}o.z=isCook(dst)?rand(5,20):0;o.vz=0;o.vx=o.vy=0;o.flipT=0;if(vessel||dst.kind==='strainer'||dst.kind==='prep')animTo(o,wx,wy,dst);if(isCook(dst))o.cooked=true;dst.items.push(o);n++;}
  if(vessel){const gs=dst.items.filter(o=>o.kind==='grain');if(gs.length>40){const Rg=Math.min(dst.r*.78,Math.sqrt(gs.length*48/PI));for(const o of gs){const a=rand(0,TAU),r=Rg*Math.sqrt(Math.random());o.x=Math.cos(a)*r;o.y=Math.sin(a)*r;if(o.anim){o.anim.fx=o.anim.fx;}}}}
  for(const nd of src.noodles){if(dst.kind==='bowl'&&nd.type==='udon')udonFill(nd,dst.r*.64,.6);else if(dst.kind==='bowl'&&(nd.type==='ramyeon'||nd.type==='ramen'))udonFill(nd,dst.r*.8,.35);else if(vessel||dst.kind==='strainer')nestNoodle(nd,dst.r*(dst.kind==='plate'?.72:dst.kind==='strainer'?.8:.76),0,0);else moveNoodle(nd,src,dst,k,0,0);dst.noodles.push(nd);n++;}
  for(const e of src.eggs){const wx=src.x+e.x,wy=src.y+e.y;e.x*=k;e.y*=k;if(vessel)animTo(e,wx,wy,dst);dst.eggs.push(e);n++;}
  for(const j of src.jeons){const wx=src.x+j.x,wy=src.y+j.y;j.x*=k;j.y*=k;if(vessel)animTo(j,wx,wy,dst);const lim=dst.r-avgRad(j)*.7;if(Math.hypot(j.x,j.y)>lim){j.x=j.y=0;}dst.jeons.push(j);n++;}
  for(const b of src.beggs){b.x*=k;b.y*=k;dst.beggs.push(b);n++;}
  for(const ic of src.ice){ic.x*=k;ic.y*=k;dst.ice.push(ic);}
  if(src.liq&&src.liq.vol>0){if(dst.kind==='strainer'){AU.splash(.4,dst.x);for(let i=0;i<14;i++)spawn({k:'steam',x:dst.x+rand(-50,50),y:dst.y+rand(-50,50),vx:rand(-10,10),vy:rand(-50,-25),r:rand(12,20),gr:rand(20,34),a:src.liq.T>70?.25:.08,max:rand(1.2,2),seed:rand(0,9)});}
    else if(dst.kind==='plate'){const q=src.liq;addFluid(dst,'water',Math.min(q.vol,40),dst.x,dst.y,0,0,q.T);}
    else{liqMerge(dst,src.liq);AU.splash(.3,dst.x);}src.liq=null;}
  for(const q of src.fluid){if(dst.kind==='strainer')continue;if(dst.liq&&dst.liq.vol>30){liqAdd(dst,q.k,q.m,q.T);}else{q.x*=k;q.y*=k;dst.fluid.push(q);}}src.fluid=[];
  for(const f in src.flav){dst.flav[f]=(dst.flav[f]||0)+src.flav[f];src.flav[f]=0;}
  if(src.seeds.length&&dst.kind!=='strainer'){for(const s of src.seeds){s.x*=k;s.y*=k;dst.seeds.push(s);}}
  src.items=[];src.noodles=[];src.eggs=[];src.jeons=[];src.beggs=[];src.ice=[];src.seeds=[];src.sauce=0;
  if(dst.t0<0)dst.t0=G.t;if(n&&vessel){AU.slide();setTimeout(()=>AU.clink(),240);}
  if(vessel){const eg=dst.eggs;/* eggs rendered last already */}}
function clearCont(c){c.custard=null;c.items=[];c.noodles=[];c.eggs=[];c.jeons=[];c.beggs=[];c.fluid=[];c.liq=null;c.seeds=[];c.ice=[];c.sauce=0;c.t0=-1;c.garn={};c.drips=[];c.flav={fire:0,bitter:0,scal:0,chiliOil:0,garlic:0};}
function trashCont(c){if(contEmpty(c)&&!(c.kind==='mix'&&(c.flour||c.water)))return false;c.garn={};c.items=[];c.noodles=[];c.eggs=[];c.jeons=[];c.beggs=[];c.fluid=[];c.liq=null;c.seeds=[];c.ice=[];c.sauce=0;c.t0=-1;c.flav={fire:0,bitter:0,scal:0,chiliOil:0,garlic:0};
  if(c.kind==='mix'){c.flour=c.water=c.egg=c.mixv=c.lumps=0;}AU.trash();floatText('버렸어요',L.trash.x+50,L.trash.y-50,'#ffd0b0',22);return true;}
