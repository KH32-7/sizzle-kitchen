
/* ---------- noodle strands ---------- */
function noodleCenter(n){let x=0,y=0;for(const s of n.strands){x+=s.pts[6].x;y+=s.pts[6].y;}return[x/n.strands.length,y/n.strands.length];}
function stepStrands(c,n,dt){const d=NT[n.type],liquid=c.liq&&c.liq.vol>20;
  const soft=n.T<0?0:clamp(n.done*1.5,0,1),stiff=lerp(.85,.04,soft),L0=n.sl*(1+n.mush*.12);
  const sz=clamp(c.r/110,.6,1),damp=(liquid?.82:c.kind==='pan'?.72:.8)-(1-sz)*.45,bo=liquid?(c.boil||0):0,jit=(bo*22+(liquid&&c.liq.T>85?(c.liq.T-85)/15*4:0))*sz*sz,tt=G.t;
  const [cx,cy]=noodleCenter(n),clump=n.stick*(n.T<0?.2:.05);if(n.air>0)n.air-=dt;
  const ax=(c.ax||0)*dt*dt*.5,ay=(c.ay||0)*dt*dt*.5,R=c.r-10,Rs=c.r*((liquid?.72:.8)+(1-sz)*.45);
  for(const s of n.strands){const P=s.pts;
    for(const p of P){const vx=(p.x-p.ox)*damp,vy=(p.y-p.oy)*damp;p.ox=p.x;p.oy=p.y;let fx=0,fy=0;
      if(jit){const k=p.x*.03+p.y*.02;fx+=Math.sin(tt*4.2+s.ph+k)*jit;fy+=Math.cos(tt*3.7+s.ph*1.7-k)*jit;}
      fx+=(cx-p.x)*clump;fy+=(cy-p.y)*clump;const pr=Math.hypot(p.x,p.y);if(pr>Rs){const k=(pr-Rs)*(liquid?7:4)/pr;fx-=p.x*k;fy-=p.y*k;}p.x+=vx+fx*dt-ax;p.y+=vy+fy*dt-ay;}
    const kc=liquid?clamp((1-sz)*3.5,0,.9):0,bx=kc?P.map(p=>p.x):null,by=kc?P.map(p=>p.y):null;
    for(let it=0;it<2;it++){for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],dx=b.x-a.x,dy=b.y-a.y,dd=Math.hypot(dx,dy)||1,df=(dd-L0)/dd*.5;a.x+=dx*df;a.y+=dy*df;b.x-=dx*df;b.y-=dy*df;}
      if(stiff>.05)for(let i=1;i<P.length-1;i++){const a=P[i-1],b=P[i+1],m=P[i];const mx=(a.x+b.x)/2,my=(a.y+b.y)/2;m.x+=(mx-m.x)*stiff*.5;m.y+=(my-m.y)*stiff*.5;}
      for(const p of P){const r=Math.hypot(p.x,p.y);if(r>R){const f=R/r;p.x*=f;p.y*=f;p.ox=p.ox*f+(p.x-p.ox*f)*.5;p.oy=p.oy*f+(p.y-p.oy*f)*.5;}}}
    if(kc)for(let i=0;i<P.length;i++){P[i].ox+=(P[i].x-bx[i])*kc;P[i].oy+=(P[i].y-by[i])*kc;}}
  if(liquid&&!c.agit){let Lm=0,I=0;for(const s of n.strands)for(const p of s.pts){Lm+=p.x*(p.y-p.oy)-p.y*(p.x-p.ox);I+=p.x*p.x+p.y*p.y;}const w=I?Lm/I*(.35+(1-sz)*.9):0;if(w)for(const s of n.strands)for(const p of s.pts){p.ox-=p.y*w;p.oy+=p.x*w;}}}
function nestNoodle(n,R,cx,cy){const cnt=n.strands.length;n.strands.forEach((s,i)=>{const a0=i/cnt*TAU+rand(-.3,.3),r0=R*Math.sqrt(rand(.004,1))*.85,dir=i%2?1:-1;let a=a0;s.pts.forEach((p,k)=>{const r=Math.max(6,r0+Math.sin(k*.9+s.ph)*R*.07);p.x=(cx||0)+Math.cos(a)*r;p.y=(cy||0)+Math.sin(a)*r*.92;p.ox=p.x;p.oy=p.y;a+=dir*n.sl*.92/Math.max(12,r);});s.nt=s.pts.map(p=>[p.x,p.y]);});}
function strandPush(n,lx,ly,vx,vy,rad,dt,c){let hit=0;for(const s of n.strands)for(const p of s.pts){const d2=(p.x-lx)**2+(p.y-ly)**2;if(d2<rad*rad){const f=1-Math.sqrt(d2)/rad;p.x+=vx*dt*.7*f;p.y+=vy*dt*.7*f;hit++;}}
  if(hit&&Math.hypot(vx,vy)>40){n.stick=Math.max(0,n.stick-dt*1.4*(n.T<0?.3:1));n.stirT=1;n.mixEven=Math.min(1,n.mixEven+dt*Math.min(1,Math.hypot(vx,vy)/600)*.45);}}

/* ---------- liquid-mode cookware ---------- */
function newBegg(lx,ly){return{kind:'begg',x:lx,y:ly,vx:0,vy:0,white:0,yolk:0,T:6,rot:rand(0,TAU),cool:0};}
function stepLiquid(c,dt){const q=c.liq,b=G.burners[c.burner];if(q.fat>q.vol*.6){stepOil(c,dt);return;}
  const power=(c.onBurner&&b.lit)?b.level*b.P*4200:0,cap=c.C+q.vol,loss=(q.T-22)*(6+q.vol*.004);let dT=(power-loss)/cap*dt;
  if(q.T>=99.5&&dT>0){const e=(power-loss)*dt/LATW;q.vol=Math.max(0,q.vol-e);c.evapNow+=e*1.4;q.T=100;c.boil=lerp(c.boil,clamp((power-loss)/3000,0,1),dt*3);}
  else{q.T+=dT;c.boil=lerp(c.boil,q.T>88?(q.T-88)/12*.35:0,dt*2);if(q.T>70)c.evapNow+=(q.T-70)/30*.3*dt*60*.02;}
  c.T=q.T;const conc=q.vol>1?q.salt/q.vol:0;
  // foam & boil-over
  if(q.T>=99&&c.boil>.3)c.foam+=dt*((q.starch/Math.max(.25,q.vol/1000))*.28*c.boil-.4);else c.foam-=dt*.6;c.foam=clamp(c.foam,0,1.3);
  if(c.foam>1&&c.onBurner){q.vol=Math.max(0,q.vol-35);c.foam=.3;b.level=Math.min(b.level,.4);G.stats.boilOver=(G.stats.boilOver||0)+1;AU.splash(.6,c.x);AU.hot();
    floatText('보글보글 넘칠 뻔! 불을 살짝 줄였어요',c.x,c.y-c.r-10,'#ffb38a',26);for(let i=0;i<30;i++){const a=rand(0,TAU);STX.fillStyle='rgba(240,236,220,.12)';STX.beginPath();STX.arc(c.x+Math.cos(a)*(c.r+rand(0,30)),c.y+Math.sin(a)*(c.r+rand(0,30)),rand(3,9),0,TAU);STX.fill();}}
  physics(c,dt,true);
  for(const o of c.items){const k=o.kind==='grain'?.5:.6*clamp(22/Math.sqrt(o.area||40),.35,1.6);o.T+=(q.T-o.T)*k*dt;if(o.T>o.Tmax)o.Tmax=o.T;
    const d=o.kind==='grain'?{cookRate:.12}:ING[o.type];if(o.T>55)o.cook+=(o.T-55)/45*(d.cookRate||.08)*dt;o.coat.salt+=(conc*.5-o.coat.salt)*dt*.04;o.cooked=true;if(o.L)steakStep(o,q.T,q.T,dt,1.5,1.5);}
  for(const n of c.noodles){const nd=NT[n.type];n.T+=(q.T-n.T)*dt*(n.T<0?.25:1.6);if(n.T>n.Tmax)n.Tmax=n.T;
    if(n.T>82){const r=(n.T-82)/18/nd.cook*(n.done>.84?.36:1);n.done+=r*dt*(n.stick>.6?.75:1);if(n.stick>.5)n.uneven=(n.uneven||0)+dt*n.stick*.02;}
    if(n.done>1.12)n.mush=Math.min(1.5,n.mush+dt*(n.done-1.12)*.5);
    if(n.T>90){q.starch+=dt*nd.starch*.012;n.starch+=dt*.02;}
    n.stirT=Math.max(0,n.stirT-dt*.5);if(n.T<0)n.stick=Math.max(.3,n.stick-dt*.004);else if(n.done<.4&&n.stirT<=0&&q.T>90&&!nd.pre)n.stick=Math.min(.95,n.stick+dt*.018);else if(n.T>60)n.stick=Math.max(0,n.stick-dt*.004*(1+c.boil*3));
    n.coat.salt+=(conc*n.g*.12-n.coat.salt)*dt*.08;n.saltW=Math.max(n.saltW||0,conc*100);stepStrands(c,n,dt);}
  for(const e of c.beggs){e.T+=(q.T-e.T)*dt*.5;if(e.T>80)e.white=Math.min(1.3,e.white+dt*(e.T-80)/20/12);if(e.T>68)e.yolk=Math.min(1.4,e.yolk+dt*(e.T-68)/32/88);
    const r=Math.hypot(e.x,e.y)+1,fl=c.boil*40;e.vx+=(-e.y/r*fl+rand(-30,30)*c.boil)*dt;e.vy+=(e.x/r*fl+rand(-30,30)*c.boil)*dt;e.vx*=.96;e.vy*=.96;e.x+=e.vx*dt;e.y+=e.vy*dt;const lim=c.r-22;if(r>lim){e.x*=lim/r;e.y*=lim/r;}e.rot+=e.vx*dt*.02;
    if(c.boil>.6&&Math.random()<dt*.3){e.crack=1;}}
  for(const e of c.eggs){e.pour=Math.min(1,e.pour+dt*1.5);e.crack=Math.max(0,e.crack-dt*2);for(let i=0;i<e.rad.length;i++)e.rad[i]+=(e.tr[i]*.8*e.pour-e.rad[i])*Math.min(1,dt*2*(1-Math.min(1,e.set)));
    if(q.T>70){e.set=Math.min(1.3,e.set+dt*(q.T-70)/30/14);e.yolk+=dt*(q.T-72)/28/60;}e.T=q.T;e.poach=true;
    const r=Math.hypot(e.x,e.y)+1,w=c.boil*12*dt/r,cw=Math.cos(w),sw=Math.sin(w),nx=e.x*cw-e.y*sw;e.y=e.x*sw+e.y*cw;e.x=nx;
    const ER=avgRad(e),lim=Math.max(0,c.r-ER-6),d=Math.hypot(e.x,e.y);if(d>lim){e.x*=lim/d;e.y*=lim/d;}
    for(let i=0;i<e.rad.length;i++){const a=i/e.rad.length*TAU,px=e.x+Math.cos(a)*e.rad[i],py=e.y+Math.sin(a)*e.rad[i],dd=Math.hypot(px,py),l2=c.r-6;if(dd>l2)e.rad[i]=Math.max(10,e.rad[i]-(dd-l2));}}
  for(const f of c.fluid){liqAdd(c,f.k,f.m,f.T);}c.fluid=[];
  if(q.vol<8){c.liq=null;c.boil=0;c.foam=0;}}

/* ---------- containers (non-heated) ---------- */
function stepPassive(c,dt){const q=c.liq;
  if(q){q.T+=(22-q.T)*dt*(c.kind==='bowl'?.0045:.02);
    for(let i=c.ice.length-1;i>=0;i--){const ic=c.ice[i];const dm=Math.min(ic.m,dt*Math.max(0,q.T+1)*.035);ic.m-=dm;q.T-=dm*80/Math.max(20,q.vol);q.vol+=dm;if(q.T<0)q.T=0;ic.x+=Math.sin(G.t+i)*dt*3;if(ic.m<=.2)c.ice.splice(i,1);}
    if(q.vol<2)c.liq=null;}
  else for(let i=c.ice.length-1;i>=0;i--){const ic=c.ice[i];ic.m-=dt*.05;if(ic.m<=.2)c.ice.splice(i,1);}
  const tgt=q?q.T:22;
  for(const o of c.items){if(o.anim){o.anim.t+=dt;if(o.anim.t>=o.anim.dur+o.anim.delay)o.anim=null;}o.T+=(tgt-o.T)*dt*(q?.1:.006);if(o.L&&!o.anim)steakStep(o,24,24,dt,.7,.7);}
  for(const e of [...c.eggs,...c.jeons]){if(e.anim){e.anim.t+=dt;if(e.anim.t>=e.anim.dur+e.anim.delay){e.anim=null;if(c.kind==='plate'||c.kind==='bowl')AU.flop();}}}
  for(const n of c.noodles){n.T+=(tgt-n.T)*dt*(q?.25:.02);if(n.T>70){n.done+=dt*(n.T-70)/30/NT[n.type].cook*.35;if(n.done>1.12)n.mush=Math.min(1.5,n.mush+dt*(n.done-1.12)*.5);}
    if(q&&q.vol>30)n.coat.salt+=((q.salt/q.vol)*n.g*.1-n.coat.salt)*dt*.02;stepStrands(c,n,dt);}
  for(const b of c.beggs){b.T+=(tgt-b.T)*dt*.05;if(b.T>70)b.yolk=Math.min(1.4,b.yolk+dt*(b.T-70)/30/120);}
  if(c.kind==='strainer'&&G.sink.tap){for(const o of c.items)o.T+=(12-o.T)*dt*1.2;for(const n of c.noodles){n.T+=(11-n.T)*dt*1.4;n.rinse=Math.min(1,n.rinse+dt*.5);n.stick=Math.max(0,n.stick-dt*.25);n.starch=Math.max(0,n.starch-dt*.05);}for(const b of c.beggs){b.T+=(12-b.T)*dt*.8;b.cool=Math.min(1,b.cool+dt*.2);}}
  stepFluid(c,dt);absorbFluid(c,dt);
  if(c.kind==='bowl'||c.kind==='plate')for(const f of [...c.fluid])if(q&&q.vol>30){liqAdd(c,f.k,f.m,f.T);c.fluid.splice(c.fluid.indexOf(f),1);}}
function tongsInteract(c,dt){const s=G.spat;if(!s.down||s.c!==c)return;const lx=s.x-c.x,ly=s.y-c.y,spd=Math.hypot(s.vx,s.vy);if(Math.hypot(lx,ly)>c.r+6)return;
  for(const n of c.noodles)strandPush(n,lx,ly,s.vx,s.vy,G.tool==='ladle'?30:26,dt,c);
  for(const o of c.items){const d=dist(o.x,o.y,lx,ly);if(d<20+o.r*.5&&spd>30){o.vx+=(s.vx-o.vx)*.25;o.vy+=(s.vy-o.vy)*.25;if(o.kind==='grain')o.stick=Math.max(0,o.stick-dt*3);}}
  for(const b of c.beggs){if(dist(b.x,b.y,lx,ly)<24){b.vx+=s.vx*.02;b.vy+=s.vy*.02;}}
  for(const e of c.eggs){if(e.poach&&!e.ribbon&&e.set<.6&&dist(e.x,e.y,lx,ly)<avgRad(e)&&spd>80){e.ribbon=true;floatText('계란을 풀었어요',c.x+e.x,c.y+e.y-30,'#ffe9a0',20);}}
  for(const q of c.fluid){if(dist(q.x,q.y,lx,ly)<40){q.vx+=(s.vx-q.vx)*.25;q.vy+=(s.vy-q.vy)*.25;if(c.noodles.length&&spd>60){const n=c.noodles[0],a=Math.min(q.m,dt*spd*.004);q.m-=a;const d=LQ[q.k];n.coat.salt+=a*d.salt;if(d.sauce){n.coat.sauce+=a;n.sauceCol=d.col;}if(d.spicy)n.coat.chili+=a*d.spicy;if(d.oil)n.coat.oil+=a;if(d.aroma)n.aroma=(n.aroma||0)+a;}}}
  if(c.kind==='mix'&&spd>40&&c.water>0&&(c.flour>0||c.egg>0)){c.mixv=Math.min(1,c.mixv+dt*spd*.0009);for(const o of c.items){const r=Math.hypot(o.x,o.y)+1;o.x+=-o.y/r*spd*dt*.08;o.y+=o.x/r*spd*dt*.08;}}
  if(c.liq&&spd>40&&c.liq.T<90){/* stirring cools slightly */c.liq.T-=dt*.2;}
  c.agit=Math.min(1.5,(c.agit||0)+spd*dt*.003);}
function emulsify(c,dt){if(!c.fluid.length)return;c.agit=Math.max(0,(c.agit||0)-dt*1.2);const F=c.fluid;
  if(c.agit>.2){const oils=F.filter(q=>LQ[q.k].oil&&q.k!=='butter'),wats=F.filter(q=>q.k==='pastaw'||q.k==='water');
    if(oils.length&&wats.length){const a=oils[(Math.random()*oils.length)|0];let b=null,bd=1e9;for(const w of wats){const d=dist(a.x,a.y,w.x,w.y);if(d<bd){bd=d;b=w;}}
      if(b&&bd<70){const amt=Math.min(a.m,b.m,dt*c.agit*1.6*(b.k==='pastaw'?1:.35));a.m-=amt;b.m-=amt;F.push({k:'emul',m:amt*2,x:(a.x+b.x)/2,y:(a.y+b.y)/2,vx:0,vy:0,T:c.T,w:.4,burn:0,sear:0,age:0,starch:b.k==='pastaw'?1:.3});}}}
  if(c.T>165){for(const q of F)if(q.k==='emul'&&q.w<.1){q.k='olive';c.flav.broken=(c.flav.broken||0)+q.m;}}}

/* ---------- batter & mixing bowl ---------- */
function batterVol(m){return m.flour*.62+m.water+m.egg*50;}
function batterColor(m,items){let c=[238,218,168];if(m.egg)c=mix(c,[246,206,110],Math.min(.5,m.egg*50/Math.max(1,batterVol(m))*2));let km=0,tot=0;for(const o of items){tot+=o.mass;if(o.type==='kimchi')km+=o.mass;}if(km)c=mix(c,[230,108,44],Math.min(.85,.42+km/(tot+batterVol(m)*.02)*1.2));return c;}
function makeJeon(c,lx,ly,b){const vol=batterVol(b);if(vol<40){floatText('반죽이 너무 적어요',c.x+lx,c.y+ly-30,'#ffd0b0',22);return null;}
  const ratio=b.flour>0?b.water/b.flour:9,pm=b.items.reduce((s,o)=>s+o.mass,0),thick=(ratio<1?1.45:ratio>1.9?.7:ratio>1.5?.85:1)*(1+pm/vol*.6);
  const Rt=Math.min(c.r-12,Math.sqrt((vol+pm*3)*26/thick)),N=40,p1=rand(0,TAU);
  const j={kind:'jeon',x:lx,y:ly,rad:new Array(N).fill(8),tr:[],vol,thick,thick0:thick,set:0,fb:[0,0],edge:0,down:0,flipA:0,pend:false,pour:0,broken:ratio>2.2?1:0,press:0,oil:0,T:15,ratio,mixv:b.mixv,lumps:b.flour>0?1-b.mixv:0,egg:b.egg,col:batterColor(b,b.items),pieces:[],comp:{},lens:[]};
  for(let i=0;i<N;i++){const a=i/N*TAU;j.tr.push(Rt*(1+.05*Math.sin(3*a+p1)+rand(-.03,.03)));}
  for(const o of b.items){j.comp[o.type]=(j.comp[o.type]||0)+o.mass;j.lens.push(o);const a=rand(0,TAU),r=Math.sqrt(Math.random())*Rt*.78;o.x=Math.cos(a)*r;o.y=Math.sin(a)*r;o.rot=rand(0,TAU);j.pieces.push(o);}
  const d=Math.hypot(lx,ly),lim=Math.max(0,c.r-Rt*.9);if(d>lim){j.x*=lim/d;j.y*=lim/d;}
  c.jeons.push(j);if(c.t0<0)c.t0=G.t;if(c.T>130){AU.sizzleBurst(.7,c.x);floatText('치이이익—',c.x+lx,c.y+ly-40,'#ffe3b0',30);}else AU.splash(.2,c.x);return j;}
function mergeJeon(j,b){const vol=batterVol(b);j.vol+=vol;for(let i=0;i<j.tr.length;i++)j.tr[i]*=Math.sqrt((j.vol)/(j.vol-vol));for(const o of b.items){j.comp[o.type]=(j.comp[o.type]||0)+o.mass;j.lens.push(o);const a=rand(0,TAU),r=Math.sqrt(Math.random())*avgRad(j)*.7;o.x=Math.cos(a)*r;o.y=Math.sin(a)*r;j.pieces.push(o);}j.set*=.7;}
function takeBatter(m,f){const b={flour:m.flour*f,water:m.water*f,egg:m.egg*f,mixv:m.mixv,items:[]};m.flour-=b.flour;m.water-=b.water;m.egg-=b.egg;const n=Math.round(m.items.length*f);for(let i=0;i<n;i++)b.items.push(m.items.splice((Math.random()*m.items.length)|0,1)[0]);return b;}
function pourBatter(m,dst){if(dst&&dst.kind==='steamer'){pourCustard(m,dst);return;}if(!isCook(dst)||dst.kind!=='pan'){if(dst.kind==='trash')return;floatText('반죽은 팬에 부어요',dst.x,dst.y-40,'#ffd0b0',22);return;}
  const b=takeBatter(m,1);m.mixv=0;const j=dst.jeons[0];if(j&&j.set<.5)mergeJeon(j,b);else makeJeon(dst,rand(-10,10),rand(-10,10),b);}
