
/* ---------- cutting board: keep pieces on the board · rotate both ways with on-board buttons ---------- */
function pieceBox(p){const c=Math.cos(p.rot||0),s=Math.sin(p.rot||0);let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
  if(p.poly&&p.poly.length){const k=(typeof volOf==='function'?volOf(p).sc:1)||1;for(const q of p.poly){const X=(q[0]*c-q[1]*s)*k,Y=(q[0]*s+q[1]*c)*k;if(X<x0)x0=X;if(X>x1)x1=X;if(Y<y0)y0=Y;if(Y>y1)y1=Y;}}
  else{const r=Math.min(p.rb||p.r||20,60)*.7;x0=y0=-r;x1=y1=r;}return[x0,x1,y0,y1];}
function boardContain(dt){const Bd=L.board,m=14,f=Math.min(1,dt*14);
  for(const p of G.board.pieces){const [x0,x1,y0,y1]=pieceBox(p),lo=Bd.x+m,hi=Bd.x+Bd.w-m,to=Bd.y+m,bo=Bd.y+Bd.h-m;let sx=0,sy=0;
    if(x1-x0>hi-lo)sx=(lo+hi)/2-(p.x+(x0+x1)/2);else if(p.x+x0<lo)sx=lo-(p.x+x0);else if(p.x+x1>hi)sx=hi-(p.x+x1);
    if(y1-y0>bo-to)sy=(to+bo)/2-(p.y+(y0+y1)/2);else if(p.y+y0<to)sy=to-(p.y+y0);else if(p.y+y1>bo)sy=bo-(p.y+y1);
    if(sx||sy){const big=Math.abs(sx)>60||Math.abs(sy)>60;p.x+=big?sx:sx*f;p.y+=big?sy:sy*f;}}}
update=(orig=>function(dt){orig(dt);if(G&&G.started&&!(G.drag&&G.drag.kind==='board'))boardContain(dt);})(update);
/* rotate: dir 1 = clockwise, -1 = counter-clockwise; the whole group turns about its centre */
rotateBoard=function(dir){dir=dir===-1?-1:1;const B=G.board.pieces;if(!B.length)return;let cx=0,cy=0,m=0;for(const p of B){cx+=p.x*p.area;cy+=p.y*p.area;m+=p.area;}cx/=m;cy/=m;
  for(const p of B){const dx=p.x-cx,dy=p.y-cy;if(dir>0){p.x=cx-dy;p.y=cy+dx;}else{p.x=cx+dy;p.y=cy-dx;}p.rot+=dir*PI/2;}
  let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const p of B){const b=pieceBox(p);x0=Math.min(x0,p.x+b[0]);x1=Math.max(x1,p.x+b[1]);y0=Math.min(y0,p.y+b[2]);y1=Math.max(y1,p.y+b[3]);}
  const Bd=L.board,M2=16;let sx=0,sy=0;if(x1-x0>Bd.w-2*M2)sx=Bd.x+Bd.w/2-(x0+x1)/2;else if(x0<Bd.x+M2)sx=Bd.x+M2-x0;else if(x1>Bd.x+Bd.w-M2)sx=Bd.x+Bd.w-M2-x1;
  if(y1-y0>Bd.h-2*M2)sy=Bd.y+Bd.h/2-(y0+y1)/2;else if(y0<Bd.y+M2)sy=Bd.y+M2-y0;else if(y1>Bd.y+Bd.h-M2)sy=Bd.y+Bd.h-M2-y1;
  for(const p of B){p.x+=sx;p.y+=sy;}G.board.spin=1;G.board.sdir=dir;G.board.scx=cx+sx;G.board.scy=cy+sy;AU.slide();};
const RBTN=()=>{const B=L.board;return[{dir:-1,x:B.x+B.w-72,y:B.y+B.h-28},{dir:1,x:B.x+B.w-30,y:B.y+B.h-28}];};
const rbtnAt=(x,y)=>RBTN().find(b=>Math.hypot(x-b.x,y-b.y)<18)||null;
drawBoard=(orig=>function(ox,oy,lift){orig(ox,oy,lift);if(!G||!G.started||!G.board.pieces.length)return;const g=ctx,hv=!G.held&&!G.drag?rbtnAt(M.x,M.y):null;g.save();g.translate(ox,oy);
  for(const b of RBTN()){const on=hv===b;g.fillStyle=on?'rgba(40,24,12,.85)':'rgba(40,24,12,.5)';g.beginPath();g.arc(b.x,b.y,on?17:15,0,TAU);g.fill();
    g.strokeStyle='#fff3dc';g.lineWidth=2.4;g.lineCap='round';g.beginPath();const a0=b.dir>0?-PI*.85:-PI*.15,a1=b.dir>0?PI*.35:PI*1.15-TAU;g.arc(b.x,b.y,7,a0,a1,b.dir<0);g.stroke();
    const ex=b.x+Math.cos(a1)*7,ey=b.y+Math.sin(a1)*7,ta=a1+b.dir*PI/2;g.fillStyle='#fff3dc';g.beginPath();g.moveTo(ex+Math.cos(ta)*5,ey+Math.sin(ta)*5);g.lineTo(ex+Math.cos(ta+2.3)*5,ey+Math.sin(ta+2.3)*5);g.lineTo(ex+Math.cos(ta-2.3)*5,ey+Math.sin(ta-2.3)*5);g.closePath();g.fill();}
  g.restore();})(drawBoard);
cv.addEventListener('pointerdown',e=>{if(!G||!G.started||G.paused||e.button!==0||G.held||!G.board.pieces.length)return;const q=toLocal(e),b=rbtnAt(q.x,q.y);if(!b)return;e.stopImmediatePropagation();AU.init();rotateBoard(b.dir);},true);
addEventListener('keydown',e=>{if(!G||!G.started||G.paused||e.code!=='KeyE'||e.repeat)return;rotateBoard(-1);});
updateCursor=(orig=>function(){orig();if(G&&!G.held&&G.board.pieces.length&&rbtnAt(M.x,M.y))cv.style.cursor='pointer';})(updateCursor);
