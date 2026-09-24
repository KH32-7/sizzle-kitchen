
/* ---------- physics shared ---------- */
function avgRad(e){let s=0;for(const r of e.rad)s+=r;return s/e.rad.length;}
function mixCoat(a,b,t){const ma=a.mass,mb=b.mass,s=ma+mb,ca=a.coat,cb=b.coat;for(const k of ['salt','dark','chili','oil','sauce']){const q=(ca[k]-cb[k])*t;ca[k]-=q*mb/s;cb[k]+=q*ma/s;}
  const f=(a.fire-b.fire)*t;a.fire-=f*mb/s;b.fire+=f*ma/s;}
function collide(a,b,dt){if((a.z>2)!==(b.z>2))return;
  const dx=b.x-a.x,dy=b.y-a.y,d2=dx*dx+dy*dy,rs=(a.r+b.r)*(a.kind==='grain'&&b.kind==='grain'?.9:.72);
  const sticky=a.kind==='grain'&&b.kind==='grain'&&a.stick>.2&&b.stick>.2,rc=sticky?rs*1.7:rs;if(d2>=rc*rc||d2<1e-6)return;
  const d=Math.sqrt(d2),nx=dx/d,ny=dy/d;
  if(d<rs){const ov=(rs-d)*.5,wa=b.mass/(a.mass+b.mass),wb=1-wa;a.x-=nx*ov*wa;a.y-=ny*ov*wa;b.x+=nx*ov*wb;b.y+=ny*ov*wb;a.nc++;b.nc++;
    const vn=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(vn<0){const im=vn*.6;a.vx+=im*nx*wa;a.vy+=im*ny*wa;b.vx-=im*nx*wb;b.vy-=im*ny*wb;}
    const mv=Math.abs(a.vx)+Math.abs(a.vy)+Math.abs(b.vx)+Math.abs(b.vy);if(mv>25)mixCoat(a,b,Math.min(.4,dt*Math.min(1,mv/300)*7));}
  if(sticky){const s=Math.min(a.stick,b.stick)*.5,mvx=(a.vx+b.vx)/2,mvy=(a.vy+b.vy)/2;a.vx+=(mvx-a.vx)*s;a.vy+=(mvy-a.vy)*s;b.vx+=(mvx-b.vx)*s;b.vy+=(mvy-b.vy)*s;if(d>rs){const pl=(d-rs)*.08*s;a.x+=nx*pl;a.y+=ny*pl;b.x-=nx*pl;b.y-=ny*pl;}}}
function flip(o){if(o.kind==='grain'){o.down=1-o.down;return;}if(o.flipT>0)return;o.flipT=1;o.pend=true;}
function itemExt(o){if(o.kind==='grain')return 4;if(o.ex)return Math.max(o.r,Math.hypot(o.ex,o.ey)*.42);return o.r*.8;}
function physics(c,dt,liquid){const it=c.items,n=it.length;if(!n){c.gH=null;return;}
  const R=c.r,oil=c.oilAmt>2,damp=Math.exp(-(liquid?1.2:oil?3:5.5)*dt),dampA=Math.exp(-.4*dt),ax=c.ax||0,ay=c.ay||0;
  const flow=liquid?c.boil*40:0;
  for(let i=0;i<n;i++){const o=it[i];
    if(o.z>0||o.vz>0){o.vz-=1500*dt;o.z+=o.vz*dt;if(o.z<=0){o.z=0;if(o.vz<-120){if(o.kind==='grain')o.stick*=.8;if(o.willFlip){flip(o);o.willFlip=false;}if(o.kind==='piece')G.landSnd++;}o.vz=0;}}
    o.vx-=ax*dt*.55;o.vy-=ay*dt*.55;
    if(liquid){const d=Math.hypot(o.x,o.y)+1;o.vx+=(-o.y/d*flow+rand(-1,1)*flow*2)*dt;o.vy+=(o.x/d*flow+rand(-1,1)*flow*2)*dt;}
    const dm=o.z>0?dampA:damp;o.vx*=dm;o.vy*=dm;o.x+=o.vx*dt;o.y+=o.vy*dt;if(o.av){o.rot+=o.av*dt;o.av*=Math.exp(-5*dt);}
    if(o.flipT>0){o.flipT=Math.max(0,o.flipT-dt*4);if(o.pend&&o.flipT<=.5){o.down=1-o.down;o.pend=false;}}
    const lim=R-(Math.min(itemExt(o),R*.72)+3),d2=o.x*o.x+o.y*o.y;if(d2>lim*lim){const d=Math.sqrt(d2),nx=o.x/d,ny=o.y/d;o.x=nx*lim;o.y=ny*lim;const vn=o.vx*nx+o.vy*ny;if(vn>0){o.vx-=vn*nx*1.3;o.vy-=vn*ny*1.3;}}o.nc=0;}
  const cs=24,cols=Math.ceil(2*R/cs)+1,head=new Int32Array(cols*cols).fill(-1),next=new Int32Array(n),big=[];
  for(let i=0;i<n;i++){const o=it[i];if(o.r>cs*.7){big.push(i);continue;}const cx=clamp(((o.x+R)/cs)|0,0,cols-1),cy=clamp(((o.y+R)/cs)|0,0,cols-1);o.cx=cx;o.cy=cy;const k=cx+cy*cols;next[i]=head[k];head[k]=i;}
  for(let i=0;i<n;i++){const a=it[i];if(a.r>cs*.7)continue;for(let oy=-1;oy<=1;oy++){const yy=a.cy+oy;if(yy<0||yy>=cols)continue;for(let ox=-1;ox<=1;ox++){const xx=a.cx+ox;if(xx<0||xx>=cols)continue;for(let j=head[xx+yy*cols];j!==-1;j=next[j])if(j>i)collide(a,it[j],dt);}}}
  for(const bi of big){const a=it[bi];for(let j=0;j<n;j++){if(j===bi)continue;const b=it[j];if(b.r>cs*.7&&j<bi)continue;collide(a,b,dt);}}
  for(let i=0;i<n;i++){const o=it[i];o.crowd+=(o.nc-o.crowd)*Math.min(1,dt*6);const lim=R-(Math.min(itemExt(o),R*.72)+2),d=Math.hypot(o.x,o.y);if(d>lim){o.x*=lim/d;o.y*=lim/d;}}
  c.gH=head;c.gN=next;c.gC=cols;c.gS=cs;c.gBig=big;}
function nearItems(c,lx,ly,r,fn){const it=c.items;if(!c.gH){for(const o of it)if((o.x-lx)**2+(o.y-ly)**2<(r+o.r*.6)**2)fn(o);return;}
  const cs=c.gS,cols=c.gC,R=c.r,x0=clamp(((lx-r+R)/cs)|0,0,cols-1),x1=clamp(((lx+r+R)/cs)|0,0,cols-1),y0=clamp(((ly-r+R)/cs)|0,0,cols-1),y1=clamp(((ly+r+R)/cs)|0,0,cols-1);
  for(let yy=y0;yy<=y1;yy++)for(let xx=x0;xx<=x1;xx++)for(let j=c.gH[xx+yy*cols];j!==-1;j=c.gN[j]){const o=it[j];if(o&&(o.x-lx)**2+(o.y-ly)**2<(r+o.r*.6)**2)fn(o);}
  for(const bi of c.gBig){const o=it[bi];if(o&&(o.x-lx)**2+(o.y-ly)**2<(r+o.r*.6)**2)fn(o);}}

/* ---------- fluid particles ---------- */
function stepFluid(c,dt){const F=c.fluid;if(!F.length){c.oilAmt=0;return;}const T=c.kind==='counter'?22:(c.T||22);let oil=0;
  const ax=c.ax||0,ay=c.ay||0,wall=c.kind!=='counter';
  for(const q of F){const d=LQ[q.k];q.age+=dt;q.r=fR(q,T);if(d.oil)oil+=q.m;
    const dm=Math.exp(-(c.kind==='counter'?7:d.vis*(1-clamp((T-20)/400,0,.5)))*dt);q.vx=(q.vx-ax*dt*.8)*dm;q.vy=(q.vy-ay*dt*.8)*dm;q.x+=q.vx*dt;q.y+=q.vy*dt;
    if(wall){const lim=Math.max(2,c.r-q.r*.35),dd=Math.hypot(q.x,q.y);if(dd>lim){q.x*=lim/dd;q.y*=lim/dd;q.vx*=-.3;q.vy*=-.3;}}
    q.T+=(T-q.T)*Math.min(1,dt*3);}
  for(let i=0;i<F.length;i++){const a=F[i];for(let j=i+1;j<F.length;j++){const b=F[j],dx=b.x-a.x,dy=b.y-a.y,d2=dx*dx+dy*dy,rs=a.r+b.r;if(d2>rs*rs*3.2||d2<1e-6)continue;
    const d=Math.sqrt(d2),nx=dx/d,ny=dy/d,rest=rs*.62,wa=b.m/(a.m+b.m),wb=1-wa;
    if(d<rest){const f=(rest-d)*(a.k===b.k?14:30)*dt;a.vx-=nx*f*wa*10;a.vy-=ny*f*wa*10;b.vx+=nx*f*wb*10;b.vy+=ny*f*wb*10;}
    else if(a.k===b.k&&d>rest*1.12){const f=(d-rest*1.12)*(LQ[a.k].oil?5:8)*dt;a.vx+=nx*f*wa*10;a.vy+=ny*f*wa*10;b.vx-=nx*f*wb*10;b.vy-=ny*f*wb*10;}}}
  // evaporation / searing / burning
  for(let i=F.length-1;i>=0;i--){const q=F[i],d=LQ[q.k];
    if(c.kind==='counter'){q.m-=dt*.004;if(q.age>50){q.m-=dt*.05;}if(q.m<=.02){STX.fillStyle=rgba(d.col,.06);STX.beginPath();STX.arc(q.x,q.y,q.r||4,0,TAU);STX.fill();F.splice(i,1);}continue;}
    if(q.w>0&&T>100){const e=Math.min(q.w,dt*(T-100)/(d.oil?300:90));q.w-=e;const m=e*q.m*(d.wat||1);if(q.m>0)q.m-=m;c.evapNow+=m*.9;if(T>170){q.sear=Math.min(1,q.sear+e*1.6);}}
    if(q.w<=.02&&T>200&&!d.oil){q.burn+=dt*(T-200)/110;if(q.burn>.4)c.smokeNow+=q.m*q.burn*.03*dt*60;}
    if(d.oil&&T>(q.k==='butter'?150:q.k==='ses'?180:235)){q.burn+=dt*(T-(q.k==='butter'?150:235))/200;if(T>235||(q.k==='butter'&&T>185))c.smokeNow+=(T-230)/40*q.m*.02*dt*60;}
    if(q.m<.03)F.splice(i,1);}
  c.oilAmt=oil;}
function absorbFluid(c,dt){const F=c.fluid;if(!F.length)return;
  for(const q of F){const d=LQ[q.k],r=q.r||fR(q,c.T);
    nearItems(c,q.x,q.y,r,o=>{if(q.m<=0||o.z>1)return;const spd=Math.hypot(o.vx,o.vy);let a=q.m*dt*(.2+spd*.01)*(d.oil?.04:1)*Math.min(1,o.r/r+.3);a=Math.min(a,q.m);q.m-=a;const mm=o.mass;
      o.coat.salt+=a*d.salt/mm;if(d.dark)o.coat.dark+=a*d.dark/mm;if(d.oil)o.coat.oil+=a/mm;if(d.sauce)o.coat.sauce+=a/mm;if(d.spicy)o.coat.chili+=a*d.spicy*.5/mm;if(q.chili)o.coat.chili+=a/q.m*q.chili;
      if(q.sear>.2)o.fire+=a*q.sear*.06/mm;if(q.burn>.5)o.bitter+=a*(q.burn-.5)*.2/mm;if(d.aroma)o.aroma+=a*d.aroma;});
    for(const n of c.noodles){let a=0;const pts=n.strands;for(let s=0;s<pts.length;s+=3){const p=pts[s].pts[6];if((p.x-q.x)**2+(p.y-q.y)**2<r*r){a+=q.m*dt*.3*(d.oil?.5:1);}}
      a=Math.min(a,q.m);if(a>0){q.m-=a;n.coat.salt+=a*d.salt;if(d.dark)n.coat.dark+=a*d.dark;if(d.oil)n.coat.oil+=a;if(d.sauce){n.coat.sauce+=a;n.sauceCol=d.col;}if(d.spicy)n.coat.chili+=a*d.spicy;if(q.sear>.2)n.fire=(n.fire||0)+a*q.sear*.05;if(d.aroma)n.aroma=(n.aroma||0)+a;if(q.k==='pastaw'||q.k==='water')n.stick=Math.max(0,n.stick-a*.05);}}}}

/* ---------- fried egg & scramble ---------- */
function newEgg(lx,ly){const N=40,base=rand(48,54),p1=rand(0,TAU),p2=rand(0,TAU);const e={kind:'egg',x:lx,y:ly,rad:new Array(N).fill(6),tr:[],set:0,edge:0,fb:[0,0],down:0,yolk:0,broken:false,yx:rand(-8,4),yy:rand(-8,4),pour:0,flipA:0,pend:false,T:8,moist:1,crack:1,smear:0,mass:10};
  for(let i=0;i<N;i++){const a=i/N*TAU;e.tr.push(base*(1+.1*Math.sin(2*a+p1)+.06*Math.sin(5*a+p2)));}return e;}
function stepEgg(c,e,dt){const T=c.T;let evap=0,smoke=0;e.pour=Math.min(1,e.pour+dt*1.8);e.crack=Math.max(0,e.crack-dt*2);
  const sp=1-Math.min(1,e.set),rate=Math.min(1,dt*2.4*sp*sp),N=e.rad.length;
  for(let i=0;i<N;i++){const a=i/N*TAU,t=e.tr[i]*e.pour;e.rad[i]+=(t-e.rad[i])*rate*(e.rad[i]<t?1:.3);const px=e.x+Math.cos(a)*e.rad[i],py=e.y+Math.sin(a)*e.rad[i],d=Math.hypot(px,py),lim=c.r-5;if(d>lim)e.rad[i]=Math.max(10,e.rad[i]-(d-lim));}
  const oil=c.oilAmt>1;if(T>68)e.set=Math.min(1.2,e.set+(T-68)/90*.05*(oil?1:.85)*dt);if(T>150)e.edge+=(T-150)/100*.07*(oil?1:1.4)*dt;
  if(T>125&&e.pour>.5)e.fb[e.down]+=(T-125)/100*.04*(oil||UPG.nonstick?1:1.5)*(UPG.nonstick&&e.fb[e.down]>1?.7:1)*dt;if(T>75)e.yolk+=(T-75)/100*(e.down===1?.1:.011)*dt;e.T=lerp(e.T,Math.min(T,100),dt*.5);
  if(T>100&&e.moist>.1){const x=(T-100)/150*((1-Math.min(1,e.set))*.6+.15)*dt*.5;e.moist-=x*.2;evap+=x*8;}
  if(e.fb[e.down]>1.15)smoke+=(e.fb[e.down]-1.15)*6;
  if(T>150&&e.set>.12&&e.set<.95&&Math.random()<dt*6*(T-150)/100){const a=rand(0,TAU),r=rand(15,avgRad(e)-6);spawn({k:'bub',x:c.x+e.x+Math.cos(a)*r,y:c.y+e.y+Math.sin(a)*r,r:rand(2,4.5),max:rand(.3,.7),pop:true});}
  if(e.flipA>0){e.flipA=Math.max(0,e.flipA-dt*3.2);if(e.pend&&e.flipA<=.5){e.down=1-e.down;e.pend=false;}}return{evap,smoke};}
function scramble(c,e){const R=avgRad(e),n=Math.round(10+R/6);c.eggs=c.eggs.filter(q=>q!==e);
  for(let i=0;i<n;i++){const a=rand(0,TAU),r=Math.sqrt(Math.random())*R*.8;const p=newPiece('curd',0,0);p.x=e.x+Math.cos(a)*r;p.y=e.y+Math.sin(a)*r;p.cook=e.set*.8;p.T=e.T;p.yolkMix=e.broken?1:rand(.4,1);p.cooked=true;p.face=[e.fb[0]*.5,0];p.vx=rand(-40,40);p.vy=rand(-40,40);c.items.push(p);}
  AU.sizzleBurst(.3,c.x);floatText('스크램블!',c.x+e.x,c.y+e.y-40,'#ffe9a0',24);}
function flipEgg(c,e,quiet){if(e.flipA>0)return;if(e.set<.5){e.broken=true;e.smear=Math.min(1,e.smear+.4);if(!quiet)floatText('흰자가 아직 안 익었어요!',c.x+e.x,c.y+e.y-50,'#ffd0b0',22);AU.flop();return;}
  if(c.oilAmt<.8&&e.fb[e.down]>.25&&Math.random()<.6){e.broken=true;floatText('팬에 들러붙었어요…',c.x+e.x,c.y+e.y-50,'#ffd0b0',22);}e.flipA=1;e.pend=true;AU.flop();if(c.T>120)setTimeout(()=>AU.sizzleBurst(.3,c.x),140);}

/* ---------- jeon (Korean pancake) ---------- */
function stepJeon(c,j,dt){const T=c.T;let evap=0,smoke=0;j.pour=Math.min(1,j.pour+dt*1.4);const N=j.rad.length,sp=1-Math.min(1,j.set);
  for(let i=0;i<N;i++){const a=i/N*TAU,t=j.tr[i]*j.pour;j.rad[i]+=(t-j.rad[i])*Math.min(1,dt*2*sp*sp+.001);const px=j.x+Math.cos(a)*j.rad[i],py=j.y+Math.sin(a)*j.rad[i],d=Math.hypot(px,py),lim=c.r-6;if(d>lim)j.rad[i]=Math.max(10,j.rad[i]-(d-lim));}
  const oilUnder=c.oilAmt>1.5,thick=clamp(j.thick,.4,3);
  if(T>80)j.set=Math.min(1.4,j.set+(T-80)/80*.045/thick*dt*(j.down===1?1.4:1));
  if(T>118)j.fb[j.down]+=(T-118)/100*.042*(oilUnder||UPG.nonstick?1:1.7)*(UPG.nonstick&&j.fb[j.down]>1?.7:1)*dt;if(T>150)j.edge+=(T-150)/100*.07*(c.oilAmt>4?1.4:c.oilAmt>1?1:.4)*dt;
  if(c.oilAmt>.3){for(const q of c.fluid)if(LQ[q.k].oil&&q.m>0){const a=Math.min(q.m,dt*.03);q.m-=a;j.oil+=a;}}
  if(T>100&&j.set<1){const x=(T-100)/120*(1-j.set*.7)*dt*.6;evap+=x*6;}
  if(j.fb[j.down]>1.2)smoke+=(j.fb[j.down]-1.2)*8;
  if(j.press>0){j.thick=Math.max(j.thick0*.55,j.thick-dt*.5);for(let i=0;i<N;i++)j.tr[i]*=1+dt*.06;j.press-=dt;}
  if(T>140&&j.set>.1&&j.set<.85&&j.down===0&&Math.random()<dt*5){const a=rand(0,TAU),r=rand(10,avgRad(j)-8);spawn({k:'bub',x:c.x+j.x+Math.cos(a)*r,y:c.y+j.y+Math.sin(a)*r,r:rand(1.5,3.2),max:rand(.4,.9),pop:true,col:'rgba(255,240,200,'});}
  if(j.flipA>0){j.flipA=Math.max(0,j.flipA-dt*2.6);if(j.pend&&j.flipA<=.5){j.down=1-j.down;j.pend=false;}}return{evap,smoke};}
function flipJeon(c,j,toss){if(j.flipA>0)return;const ok=j.set>(toss?.62:.48)&&j.fb[j.down]>.2&&(!toss||c.oilAmt>.8||j.oil>1);
  if(!ok){j.broken+=1;floatText(j.set<.4?'아직 반죽이 안 익었어요!':'전이 찢어졌어요…',c.x+j.x,c.y+j.y-50,'#ffd0b0',22);for(let i=0;i<j.rad.length;i+=3)j.tr[i]*=rand(.85,1.05);}
  else if(toss)floatText('탁! 뒤집기 성공',c.x+j.x,c.y+j.y-60,'#ffe9a0',24);
  j.flipA=1;j.pend=true;AU.flop();if(c.T>120)setTimeout(()=>AU.sizzleBurst(.45,c.x),160);}

/* ---------- steak heat (1D layers) ---------- */
function steakStep(p,bottom,top,dt,hB,hT){const L2=p.L,n=L2.length,a=.085;const lo=p.down===0?0:n-1,hi=n-1-lo;
  const nw=L2.slice();for(let i=0;i<n;i++){const l=i>0?L2[i-1]:L2[i],r=i<n-1?L2[i+1]:L2[i];nw[i]+=a*(l-2*L2[i]+r)*dt;}
  nw[lo]+=(bottom-nw[lo])*hB*dt;nw[hi]+=(top-nw[hi])*hT*dt;for(let i=0;i<n;i++){L2[i]=nw[i];if(nw[i]>p.Lm[i])p.Lm[i]=nw[i];}
  p.T=(L2[5]+L2[6])/2;p.core=p.T;if(p.T>p.Tmax)p.Tmax=p.T;}

/* ---------- fry-mode cookware ---------- */
function stepFry(c,dt){const b=G.burners[c.burner];
  const power=(c.onBurner&&b.lit)?b.level*58*b.P:0;let heatOut=0,evap=0,smoke=0,hasK=false,hasSc=false;
  const oilF=c.oilAmt>3?1:c.oilAmt>.8?.82:.6;
  physics(c,dt,false);
  for(const it of c.items){
    if(it.kind==='piece'){if(it.type==='kimchi')hasK=true;if(it.type==='scallion'||it.type==='jjokpa')hasSc=true;}
    if(it.z>.5){it.T+=(30-it.T)*.3*dt;continue;}
    const d=it.kind==='grain'?{cookRate:.12,brownRate:.03,hk:1}:ING[it.type],contact=oilF/(1+it.crowd*.32);
    if(it.L){const cap=150+(1-Math.min(1,it.moist/.35))*70;steakStep(it,Math.min(c.T,cap),30+(it.baste||0),dt,2.2*contact+.4,.35);it.baste=Math.max(0,(it.baste||0)-dt*40);heatOut+=(c.T-it.L[it.down===0?0:11])*.15*it.mass*dt;
      if(c.T>125){const mb=it.moist>.3?.2:1;it.face[it.down]+=d.brownRate*(c.T-125)/110*mb*(c.oilAmt>1||UPG.nonstick?1:1.3)*dt;}if(c.T>100)it.moist=Math.max(0,it.moist-dt*.003*(c.T-100)/100);
      if(c.T>130&&Math.random()<dt*2)evap+=.8;if(it.face[it.down]>1.3)smoke+=(it.face[it.down]-1.3)*it.mass;it.offT=G.t;continue;}
    const k=it.kind==='grain'?.3:d.hk*clamp(22/Math.sqrt(it.area),.35,1.6);
    if(it.moist>.02&&it.T>=99.5){const q=Math.max(0,c.T-100)*k*contact,e=q*dt/LAT;it.moist=Math.max(0,it.moist-e);evap+=e*it.mass;heatOut+=q*dt*it.mass;it.T=100;}
    else{const dq=(c.T-it.T)*k*contact*dt;it.T+=dq;heatOut+=dq*it.mass;if(it.moist>.02&&it.T>100)it.T=100;}
    if(it.T>it.Tmax)it.Tmax=it.T;if(it.T>55)it.cook+=(it.T-55)/45*d.cookRate*dt;
    if(c.T>125){const m=it.moist,mb=m>.3?.1:m>.12?.45:1;it.face[it.down]+=d.brownRate*(c.T-125)/110*mb*(c.oilAmt>1.5||UPG.nonstick?1:1.5)*(UPG.nonstick&&it.face[it.down]>1?.7:1)/(1+it.crowd*.2)*dt;const f=it.face[it.down];if(f>1.05)smoke+=(f-1.05)*it.mass*1.5;}
    if(it.kind==='grain'&&it.T>60)it.stick=Math.max(0,it.stick-dt*.035);
    if(it.type==='garlic'&&it.face[it.down]>.3)c.flav.garlic+=dt*.1;}
  for(const e of [...c.eggs]){const r=stepEgg(c,e,dt);evap+=r.evap;smoke+=r.smoke;}
  for(const j of c.jeons){const r=stepJeon(c,j,dt);evap+=r.evap;smoke+=r.smoke;heatOut+=(c.T-80)*.03*j.vol*dt*(j.set<1?1:.45);}
  for(const n of c.noodles){n.T+=(c.T*.85-n.T)*dt*1.5;if(n.T>80)n.done+=(n.T-80)/20/NT[n.type].cook*dt*.15;if(n.T>60&&c.fluid.some(q=>q.k==='water'||q.k==='pastaw'))n.stick=Math.max(0,n.stick-dt*.08);if(c.T>150&&n.coat.oil>.5)n.brown=(n.brown||0)+dt*(c.T-150)/100*.03;
    if(n.brown>1.1)smoke+=.6;heatOut+=(c.T-n.T)*.02*n.g*dt*.05;if(n.T>n.Tmax)n.Tmax=n.T;stepStrands(c,n,dt);}
  if(c.flav){if(c.id===2&&hasSc&&!hasK&&c.oilAmt>2&&c.T>110&&c.T<235)c.flav.scal+=dt;}
  if(!c.items.length&&!c.eggs.length&&!c.jeons.length&&c.oilAmt<.3&&c.T>300)smoke+=(c.T-300)/60;
  c.T+=(power-(c.T-22)*.15)*dt-heatOut/c.C;if(c.T<18)c.T=18;c.evapNow+=evap;c.smokeNow+=smoke*dt;}
function spatulaInteract(c,dt){const s=G.spat;if(!s.down||s.c!==c||dist(s.x,s.y,c.x,c.y)>c.r+10)return;
  const lx=s.x-c.x,ly=s.y-c.y,ca=Math.cos(s.ang),sa=Math.sin(s.ang),hl=38,ax=lx-ca*hl,ay=ly-sa*hl,ex=ca*hl*2,ey=sa*hl*2,el=ex*ex+ey*ey,spd=Math.hypot(s.vx,s.vy),nX=-sa,nY=ca;
  for(const o of c.items){if(o.z>3)continue;let t=((o.x-ax)*ex+(o.y-ay)*ey)/el;t=clamp(t,0,1);const cx=ax+ex*t,cy=ay+ey*t,dx=o.x-cx,dy=o.y-cy,d=Math.hypot(dx,dy),r2=Math.min(o.r,16)*.7+5;
    if(d<r2){let nx,ny;if(d>.01){nx=dx/d;ny=dy/d;}else{const sg=(s.vx*nX+s.vy*nY)>=0?1:-1;nx=nX*sg;ny=nY*sg;}o.x=cx+nx*r2;o.y=cy+ny*r2;o.vx+=(s.vx-o.vx)*.45;o.vy+=(s.vy-o.vy)*.45;o.av+=rand(-4,4)*Math.min(1,spd/300);
      if(spd>180&&Math.random()<dt*spd/260)flip(o);if(o.kind==='grain')o.stick=Math.max(0,o.stick-dt*7);}
    if(o.kind==='grain'&&o.stick>0&&(o.x-lx)**2+(o.y-ly)**2<1100)o.stick=Math.max(0,o.stick-dt*3.5);}
  for(const q of c.fluid){const d=dist(q.x,q.y,lx,ly);if(d<44&&spd>30){q.vx+=(s.vx-q.vx)*.2;q.vy+=(s.vy-q.vy)*.2;}}
  c.agit=Math.min(1.5,(c.agit||0)+spd*dt*.004);
  for(const e of [...c.eggs]){const R=avgRad(e);if(spd>40&&dist(lx,ly,e.x,e.y)<R+8){if(e.set<.8&&e.pour>.8){scramble(c,e);continue;}e.x+=s.vx*dt*.85;e.y+=s.vy*dt*.85;const d=Math.hypot(e.x,e.y),lim=Math.max(0,c.r-R*.7);if(d>lim){e.x*=lim/d;e.y*=lim/d;}}}
  for(const j of c.jeons){const R=avgRad(j),d=dist(lx,ly,j.x,j.y);if(d>R+6)continue;if(spd>40){if(j.set>.35){j.x+=s.vx*dt*.8;j.y+=s.vy*dt*.8;const dd=Math.hypot(j.x,j.y),lim=Math.max(0,c.r-R*.8);if(dd>lim){j.x*=lim/dd;j.y*=lim/dd;}}else{const an=Math.atan2(s.vy,s.vx);for(let i=0;i<j.tr.length;i++){const a=i/j.tr.length*TAU;j.tr[i]=clamp(j.tr[i]*(1+Math.cos(a-an)*dt*.5),30,c.r);}}}
    else if(s.still>.25){if(!j.press||j.press<.05){j.press=.1;if(Math.random()<dt*6)AU.sizzleBurst(.12,c.x);}}}
  for(const n of c.noodles){strandPush(n,lx,ly,s.vx,s.vy,55,dt,c);if(spd>80)n.stick=Math.max(0,n.stick-dt*.8);}}
function toss(c){if(!c||c.tossT>0)return;c.tossT=.45;AU.whoosh();
  for(const o of c.items){if(o.z>1)continue;const pw=rand(.75,1.1);o.vz=rand(300,420)*pw;o.vx+=rand(-60,60)-o.x*.35;o.vy+=rand(-60,60)-o.y*.35-40;o.av+=rand(-7,7);o.willFlip=Math.random()<.6;o.z=.5;}
  for(const n of c.noodles){n.stick=Math.max(0,n.stick-.18);n.air=.4;for(const s of n.strands)for(const p of s.pts){p.ox=p.x+rand(-3,3);p.oy=p.y+8;}}
  for(const q of c.fluid){q.vx+=rand(-60,60)-q.x*.5;q.vy+=rand(-60,60)-q.y*.5-80;}c.agit=Math.min(1.5,(c.agit||0)+.6);
  const b=G.burners[c.burner];
  if(c.onBurner&&b.lit&&b.level>.45&&c.T>220&&c.oilAmt>2&&(c.items.length||c.noodles.length)){c.flare=1;c.flav.fire+=.8;for(const o of c.items)o.fire+=.3;for(const n of c.noodles)n.fire=(n.fire||0)+.5;AU.flare();floatText('화르륵!',c.x,c.y-c.r*.45,'#ffb14a',40);}
  for(const e of c.eggs)if(e.set>.7&&Math.random()<.5)flipEgg(c,e,true);
  for(const j of c.jeons)flipJeon(c,j,true);}
