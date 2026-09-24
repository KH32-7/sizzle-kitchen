
/* ---------- pouring & sprinkling ---------- */
const BROTHY=new Set(['water','anchovy','kbroth','rstock','dashi','pastaw']);
const liqKey=id=>id;
function deliverAt(key,x,y,m,vx,vy,T){let c=contAt(x,y);if(c&&c.kind==='steamer')c=c.on;if(c&&(c.kind==='bowl'||c.kind==='plate')&&LQ[key]){const dd=Math.hypot(x-c.x,y-c.y);if(dd>c.r*.7&&Math.random()<m*.035*(dd/c.r))addDrip(c,Math.atan2(y-c.y,x-c.x),LQ[key].col);}if(c&&c.flav&&key==='vinegar')c.flav.sour=(c.flav.sour||0)+m;
  if(!c){if(inSink(x,y))return;addFluid(G.counter,key,m,x,y,vx*.3,vy*.3,T);return;}
  if(c.kind==='mix'){c.water+=m*(LQ[key].wat?1:.6);if(LQ[key].salt)c.salt=(c.salt||0)+m*LQ[key].salt;if(Math.random()<.2)spawn({k:'ring',x,y,r:3,max:.5});return;}
  if(c.kind==='strainer'){for(const n of c.noodles)n.rinse=Math.min(1,n.rinse+m*.002);return;}
  const liquidMode=(c.liq&&c.liq.vol>15)||c.kind==='pot'||c.kind==='sauce'||(c.kind==='bowl'&&(BROTHY.has(key)||(c.liq&&c.liq.vol>30)))||(c.kind==='pan'&&BROTHY.has(key)&&m>0&&(c.liq&&c.liq.vol>5));
  if(liquidMode){const before=c.liq?c.liq.T:20;liqAdd(c,key,m,T===undefined?(key==='water'?14:6):T);if(key==='water'&&c.foam>0)c.foam=Math.max(0,c.foam-m/50);
    if(Math.random()<.35)spawn({k:'ring',x,y,r:3,max:.6});if(before>95&&Math.random()<.1)AU.splash(.08,c.x);return;}
  addFluid(c,key,m,x,y,vx*.4,vy*.4,T);if(c.T>140&&LQ[key].wat>.3&&Math.random()<.3)splatter(x,y,1);}
function updateHeld(dt){const h=G.held;if(!h)return;
  if(h.kind==='bottle'||h.kind==='powder'){const tg=h.active?1:0;h.tilt+=(tg-h.tilt)*Math.min(1,dt*(h.active?7:9));
    if(h.tilt>.6){const base=h.kind==='powder'?35:BOT[h.id].rate;h.pourT=h.active?(h.pourT||0)+dt:0;const boost=base>=30?1+clamp((h.pourT-.5)/1,0,1)*2.3:1;const rate=base*boost*(h.tilt-.6)/.4;let amt=rate*dt;
      if(h.stock){const left=G.stock[h.id]||0;if(G.mode!=='practice'){amt=Math.min(amt,left);G.stock[h.id]=left-amt;if(G.stock[h.id]<=0.5){floatText('다 썼어요',M.x,M.y-60,'#ffd0b0',20);}}}
      h.poured+=amt;h.flow=rate;if(amt>0){if(h.kind==='powder')pourPowder(M.x,M.y,amt);else{const k=liqKey(h.id),n=Math.max(1,Math.round(amt/1.2));for(let i=0;i<n;i++)spawn({k:'pd',x0:M.x+8,y0:M.y-38,x1:M.x+rand(-2.5,2.5),y1:M.y+rand(-2.5,2.5),key:k,m:amt/n,max:.12+rand(0,.03),vx:M.vx*.3,vy:M.vy*.3});}}}else h.flow=0;}
  else if(h.kind==='shaker'){if(h.active){const sp=Math.min(1600,Math.hypot(M.vx,M.vy));h.shake=lerp(h.shake,sp/1600,.3);const amt=sp/1600*SHK[h.id].rate*dt;
      if(amt>.0005){h.poured+=amt;for(let i=0;i<3;i++)spawn({k:'flake',type:h.id,x:M.x+rand(-10,10),y:M.y+rand(-10,10),z:28+rand(0,8),vz:rand(-40,0),amt:amt/3,rot:rand(0,TAU),max:3});}
      if(sp>500&&G.t-(h.rt||0)>.12){h.rt=G.t;AU.rattle();}}else h.shake*=.8;}}
function pourPowder(x,y,g){const c=contAt(x,y);for(let i=0;i<2;i++)spawn({k:'flake',type:'flour',x:x+rand(-6,6),y:y+rand(-6,6),z:30,vz:rand(-30,0),amt:0,rot:0,max:2});
  if(c&&c.kind==='mix'){c.flour+=g;c.mixv*=Math.max(0,1-g/Math.max(20,c.flour));}else{STX.fillStyle='rgba(250,248,240,.25)';STX.beginPath();STX.arc(x+rand(-8,8),y+rand(-8,8),rand(2,5),0,TAU);STX.fill();}}
function landFlake(f){if(f.type==='flour')return;if(f.type==='panko'&&pankoLand(f))return;const c=contAt(f.x,f.y);
  if(!c){const bp=inBoard(f.x,f.y)?boardPieceAt(f.x,f.y):null;if(bp){if(f.type==='salt')bp.coat.salt+=f.amt/bp.mass;else if(f.type==='chili')bp.coat.chili+=f.amt*6/bp.mass;else bp.spice=(bp.spice||0)+f.amt;return;}
    STX.fillStyle=f.type==='chili'?'rgba(170,40,20,.5)':'rgba(230,210,160,.5)';STX.fillRect(f.x,f.y,1.6,1.3);return;}
  const lx=f.x-c.x,ly=f.y-c.y,liq=c.liq&&c.liq.vol>30;
  if(f.type==='salt'){if(liq){c.liq.salt+=f.amt;return;}let hit=null,bd=1e9;for(const o of c.items){const d=(o.x-lx)**2+(o.y-ly)**2;if(d<bd){bd=d;hit=o;}}
    if(c.noodles.length&&(!hit||bd>900)){c.noodles[0].coat.salt+=f.amt;return;}if(hit)hit.coat.salt+=f.amt/hit.mass;else if(c.kind==='mix')c.salt=(c.salt||0)+f.amt;return;}
  if(f.type==='chili'){if(liq){c.liq.spicy+=f.amt*.6;c.liq.col=mix(c.liq.col,[200,60,30],.02);return;}let hit=null;for(const o of c.items){if(o.z<1&&(o.x-lx)**2+(o.y-ly)**2<(o.r+3)**2){hit=o;break;}}
    if(hit)hit.coat.chili+=f.amt*6/hit.mass;else{let oq=null;for(const q of c.fluid)if(LQ[q.k].oil&&(q.x-lx)**2+(q.y-ly)**2<(q.r||8)**2){oq=q;break;}
      if(oq){oq.chili=(oq.chili||0)+f.amt*6;if(c.T>195){c.flav.bitter+=f.amt*(c.T-195)/100;if(Math.random()<.3)spawn({k:'smoke',x:f.x,y:f.y,vx:rand(-8,8),vy:rand(-30,-15),r:8,gr:24,a:.3,max:1.6,seed:rand(0,9)});}else if(c.T>110)c.flav.chiliOil+=f.amt;}
      else if(c.noodles.length)c.noodles[0].coat.chili+=f.amt*4;}}
  if(f.type==='sugar'){if(c.flav)c.flav.sweet=(c.flav.sweet||0)+f.amt;if(liq)c.liq.sweet+=f.amt;return;}
  if(liq&&f.type!=='gim'&&f.type!=='sesame'&&f.type!=='aonori'&&f.type!=='parsley'&&f.type!=='shichimi'&&f.type!=='pepper'&&f.type!=='parm')return;
  if(c.seeds.length<500)c.seeds.push({x:lx,y:ly,type:f.type,rot:f.rot,a:1});c.garn=c.garn||{};c.garn[f.type]=(c.garn[f.type]||0)+f.amt;}

/* ---------- frame update ---------- */
function update(dt){G.t+=dt;FC++;
  M.vx=lerp(M.vx,(M.x-M.px)/dt,.5);M.vy=lerp(M.vy,(M.y-M.py)/dt,.5);M.px=M.x;M.py=M.y;
  const s=G.spat,svx=(M.x-s.x)/dt,svy=(M.y-s.y)/dt;s.vx=lerp(s.vx,svx,.5);s.vy=lerp(s.vy,svy,.5);s.moved+=Math.hypot(M.x-s.x,M.y-s.y);s.x=M.x;s.y=M.y;
  const sspd=Math.hypot(s.vx,s.vy);s.still=sspd<25&&s.down?s.still+dt:0;if(sspd>70){const tg=Math.atan2(s.vy,s.vx)+PI/2;let d=tg-s.ang;d=((d+PI/2)%PI+PI)%PI-PI/2;s.ang+=d*Math.min(1,dt*14);}
  if(s.down){const c=contAt(s.x,s.y);if(c)s.c=c;}
  updateHeld(dt);
  for(const b of G.burners){if(b.ign>0){b.ign-=dt;if(b.ign<=0&&b.level>0)b.lit=true;}if(b.lit)G.gas+=b.level*b.P*dt*4;}
  const drag=G.drag&&G.drag.kind==='cont'&&G.drag.moved?G.drag.c:null;
  for(const c of [...G.cw,G.strainer,G.mix,...G.prep,G.plate,G.bowl]){
    if(c===drag){const vx=(c.x-c.lx)/dt,vy=(c.y-c.ly)/dt;c.ax=lerp(c.ax||0,clamp((vx-(c.pvx||0))/dt,-6000,6000),.5);c.ay=lerp(c.ay||0,clamp((vy-(c.pvy||0))/dt,-6000,6000),.5);
      if(c.cook&&vy<-1500&&c.tossT<=0&&c.kind==='pan'&&(c.items.length||c.eggs.length||c.jeons.length||c.noodles.length))toss(c);c.pvx=vx;c.pvy=vy;c.lx=c.x;c.ly=c.y;
      if(G.sink.tap&&inSink(c.x,c.y)&&c.cook&&c.kind!=='pan'){liqAdd(c,'water',dt*90,14);if(Math.random()<.2)spawn({k:'ring',x:c.x+rand(-20,20),y:c.y+rand(-20,20),r:3,max:.6});}}
    else{c.ax=c.ay=0;c.pvx=c.pvy=0;if(c.ret){c.x+=(c.hx-c.x)*Math.min(1,dt*12);c.y+=(c.hy-c.y)*Math.min(1,dt*12);if(dist(c.x,c.y,c.hx,c.hy)<1){c.x=c.hx;c.y=c.hy;c.ret=false;if(c.cook)AU.clank();else AU.place();}c.lx=c.x;c.ly=c.y;}}
    if(c.tossT>0)c.tossT=Math.max(0,c.tossT-dt);}
  for(const c of G.cw){c.onBurner=!c.drag&&!c.ret&&Math.abs(c.x-c.hx)<3&&Math.abs(c.y-c.hy)<3;}
  const sub=2;for(let i=0;i<sub;i++)for(const c of G.cw){if(c.liq&&c.liq.vol>15)stepLiquid(c,dt/sub);else{c.boil=0;c.foam=0;stepFry(c,dt/sub);spatulaInteract(c,dt/sub);}if(G.tool==='chop'||G.tool==='ladle')tongsInteract(c,dt/sub);}
  for(const c of G.cw){if(!(c.liq&&c.liq.vol>15)){stepFluid(c,dt);absorbFluid(c,dt);emulsify(c,dt);}else stepFluid(c,dt);}
  stepSteamer(dt);
  for(const c of [G.mix,...G.prep,G.strainer,G.plate,G.bowl]){stepPassive(c,dt);if(G.tool==='chop'||G.tool==='ladle'||G.tool==='spatula')tongsInteract(c,dt);}
  stepFluid(G.counter,dt);
  for(const p of G.board.pieces)if(p.L)steakStep(p,24,24,dt,.7,.7);if(G.held&&G.held.piece&&G.held.piece.L)steakStep(G.held.piece,24,24,dt,.7,.7);
  let smokeTot=0;
  for(const c of G.cw){c.evapRate=lerp(c.evapRate,c.evapNow/dt,.25);c.evapNow=0;c.smokeRate=lerp(c.smokeRate,c.smokeNow/dt,.2);c.smokeNow=0;smokeTot+=c.smokeRate;
    const st=c.evapRate*dt*9+(c.boil||0)*dt*14+(c.liq&&c.liq.T>72?(c.liq.T-72)/28*dt*5:0);c.steamB+=st;let tries=0;
    while(c.steamB>1&&tries<8){c.steamB--;tries++;let px=rand(-.6,.6)*c.r,py=rand(-.6,.6)*c.r;if(!c.liq&&c.items.length){const o=c.items[(Math.random()*c.items.length)|0];px=o.x;py=o.y;}
      spawn({k:'steam',x:c.x+px,y:c.y+py,vx:rand(-10,10),vy:rand(-42,-20),r:rand(8,15),gr:rand(18,32),a:rand(.12,.24)*(c.liq?1.2:1),max:rand(1.2,2.3),seed:rand(0,9)});}
    if(c.steamB>6)c.steamB=0;
    if(Math.random()<c.smokeRate*dt*2){const a=rand(0,TAU),r=rand(0,c.r*.6);spawn({k:'smoke',x:c.x+Math.cos(a)*r,y:c.y+Math.sin(a)*r,vx:rand(-10,10),vy:rand(-40,-20),r:rand(14,22),gr:rand(24,40),a:rand(.25,.4),max:rand(2,3.2),seed:rand(0,9)});}
    if(c.oilAmt>2&&c.T>160&&c.evapRate>1&&Math.random()<dt*c.evapRate*.6)splatter(c.x+rand(-.6,.6)*c.r,c.y+rand(-.6,.6)*c.r,1+(Math.random()*2|0));
    if(c.boil>.4&&Math.random()<dt*c.boil*3)spawn({k:'ring',x:c.x+rand(-.7,.7)*c.r,y:c.y+rand(-.7,.7)*c.r,r:rand(2,5),max:.4});
    if(c.flare>0){c.flare=Math.max(0,c.flare-dt*1.1);for(let i=0;i<5*c.flare;i++){const a=rand(0,TAU),r=rand(0,c.r*.8);spawn({k:'fire',x:c.x+Math.cos(a)*r,y:c.y+Math.sin(a)*r,vx:rand(-20,20),vy:rand(-120,-50),r:rand(16,34)*(.5+c.flare),max:rand(.3,.6)});}}}
  for(const c of G.cw)underFx(c);
  for(const v of [G.plate,G.bowl]){const hotL=v.liq&&v.liq.T>55,hotI=v.items.some(o=>o.T>60)||v.noodles.some(n=>n.T>60);if((hotL||hotI)&&Math.random()<dt*(hotL?5:2)){spawn({k:'steam',x:v.x+rand(-.5,.5)*v.r,y:v.y+rand(-.5,.5)*v.r,vx:rand(-6,6),vy:rand(-30,-15),r:rand(8,12),gr:rand(14,24),a:rand(.08,.16),max:rand(1.4,2.4),seed:rand(0,9)});}}
  if(G.landSnd>0){if(G.landSnd>3){AU.thud();const c=G.cw.find(q=>q.tossT>0);if(c&&c.T>130)AU.sizzleBurst(.35,c.x);}G.landSnd=0;}
  G.smoke=lerp(G.smoke,smokeTot,Math.min(1,dt*1.5));if(G.smoke>(UPG.fan?16:8))G.alarmT+=dt;else G.alarmT=Math.max(0,G.alarmT-dt*1.5);
  if(G.alarmT>3){if(!G.alarmOn){G.alarmOn=true;G.stats.alarm=(G.stats.alarm||0)+1;}}else if(G.alarmT<=0)G.alarmOn=false;
  const PT=G.parts;
  for(let i=PT.length-1;i>=0;i--){const q=PT[i];q.life+=dt;let dead=q.life>=q.max;
    if(q.k==='steam'||q.k==='smoke'){q.x+=q.vx*dt;q.y+=q.vy*dt;q.r+=q.gr*dt;q.vx+=Math.sin(G.t*2+q.seed)*8*dt;}
    else if(q.k==='fire'){q.x+=q.vx*dt;q.y+=q.vy*dt;q.r*=1+dt*.8;}
    else if(q.k==='spark'){q.x+=q.vx*dt;q.y+=q.vy*dt;q.vx*=.94;q.vy*=.94;}
    else if(q.k==='pd'){if(dead)deliverAt(q.key,q.x1,q.y1,q.m,q.vx+rand(-80,80),q.vy+rand(-80,80));}
    else if(q.k==='drop'||q.k==='juice'){q.vz-=900*dt;q.z+=q.vz*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;if(q.z<=0){dead=true;
        if(q.k==='juice'&&inBoard(q.x,q.y)){MX.fillStyle=rgba(q.col,.12);MX.beginPath();MX.arc(q.x-L.board.x,q.y-L.board.y,rand(1,2.5),0,TAU);MX.fill();}
        else if(q.k==='drop'&&!contAt(q.x,q.y)){STX.fillStyle='rgba(255,244,210,.13)';STX.beginPath();STX.arc(q.x,q.y,rand(1.2,2.8),0,TAU);STX.fill();}}}
    else if(q.k==='flake'){q.vz-=700*dt;q.z+=q.vz*dt;if(q.z<=0){dead=true;landFlake(q);}}
    else if(q.k==='bub'&&dead&&q.pop&&Math.random()<.4)AU.pop();
    if(dead){PT[i]=PT[PT.length-1];PT.pop();}}
  if(G.sink.tap&&Math.random()<dt*20)spawn({k:'ring',x:L.sink.sx+rand(-20,20),y:L.sink.sy+rand(-20,20),r:2,max:.5});
  for(let i=G.texts.length-1;i>=0;i--){const t=G.texts[i];t.life+=dt;if(t.life>t.max)G.texts.splice(i,1);}
  if(G.board.spin>0)G.board.spin=Math.max(0,G.board.spin-dt/.18);if(G.knife.down>0)G.knife.down=Math.max(0,G.knife.down-dt/.12);
  gameTick(dt);AU.update();if((FC%12)===0)hudTick();}
