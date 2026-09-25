(()=>{
'use strict';
const W=1600,H=1000,TAU=Math.PI*2,PI=Math.PI;
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const rand=(a,b)=>a+Math.random()*(b-a),clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t;
const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const rgba=(c,a)=>'rgba('+(c[0]|0)+','+(c[1]|0)+','+(c[2]|0)+','+a+')';
const pick=a=>a[(Math.random()*a.length)|0];
const dist=(ax,ay,bx,by)=>Math.hypot(ax-bx,ay-by);
const won=n=>Math.round(n).toLocaleString('ko-KR')+'원';
const ease=t=>t*t*(3-2*t);
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=Math.max(1,Math.round(w));c.height=Math.max(1,Math.round(h));return c;};
/* canvas labels in the UI-pack style: cream (or tinted) pill, darker lip, brown outline */
function uiPill(g,x,y,w,h,fill,lip,edge){rr(g,x,y,w,h,Math.min(h/2,12));g.fillStyle=fill||'#fffeeb';g.fill();g.save();g.clip();g.fillStyle=lip||'#fbd9cd';g.fillRect(x,y+h-4,w,4);g.restore();rr(g,x,y,w,h,Math.min(h/2,12));g.lineWidth=2.5;g.strokeStyle=edge||'#97513e';g.stroke();}
const tempColD=T=>T<60?'#1f93bd':T<100?'#2f8f3f':T<180?'#c77d00':T<235?'#d9531a':'#c81e3c';
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function josa(w,a,b){const c=w.charCodeAt(w.length-1);if(c<0xAC00||c>0xD7A3)return w+a;return w+((c-0xAC00)%28?a:b);}
const stage=$('#stage'),cv=$('#c');let ctx=cv.getContext('2d');
let S=1,DPR=1,PX=1;

/* ---------- layout ---------- */
const L={
  fridge:{x:12,y:52,w:128,h:172},
  board:{x:28,y:240,w:432,h:330},
  rack:{x:28,y:582,w:552,h:60},
  prep:[{x:522,y:318,r:46},{x:522,y:478,r:46}],
  mix:{x:128,y:782,r:86},
  sink:{x:246,y:660,w:334,h:240,sx:420,sy:792,sr:70,tx:420,ty:672},
  trash:{x:60,y:946,r:34},
  stove:{x:596,y:236,w:640,h:754},
  plate:{x:1420,y:396,r:124},
  bowl:{x:1420,y:688,r:118},
};
const BURN=[{x:760,y:420,rb:58,P:1,name:'뒤 왼쪽'},{x:1075,y:410,rb:44,P:.74,name:'뒤 오른쪽'},{x:760,y:706,rb:62,P:1,name:'앞 왼쪽'},{x:1082,y:706,rb:46,P:.76,name:'앞 오른쪽'}];
const KNOBX=[690,830,970,1110],KNOBY=950;
const KN_UP=150,KN_DN=58,LAT=1700,LATW=2400;

/* ---------- liquids ---------- */
// salt: g per ml; film: px^2 of spread per ml (thin = large); vis: viscosity damping; wat: fraction that evaporates
const LQ={
  vinegar:{n:'식초',salt:0,col:[236,228,196],a:.16,film:520,vis:2,wat:1,sour:4},
  water:{n:'물',salt:0,col:[190,210,225],a:.28,film:520,vis:2.2,wat:1},
  pastaw:{n:'면수',salt:.006,col:[222,222,205],a:.4,film:480,vis:2.6,wat:1,starch:1},
  anchovy:{n:'멸치육수',salt:.004,col:[228,190,104],a:.4,film:500,vis:2.4,wat:1,umami:.8},
  kbroth:{n:'김치말이 육수',salt:.011,col:[228,136,106],a:.5,film:500,vis:2.4,wat:1,umami:.4,sour:.8,spicy:.2},
  rstock:{n:'라멘 육수',salt:.004,col:[226,194,146],a:.62,film:470,vis:2.6,wat:1,umami:1,fat:.6},
  dashi:{n:'가쓰오 다시',salt:.003,col:[222,190,118],a:.38,film:500,vis:2.4,wat:1,umami:.9},
  soy:{n:'진간장',salt:.16,col:[62,30,12],a:.88,film:330,vis:3,wat:.7,dark:1},
  tsuyu:{n:'쯔유',salt:.1,col:[92,50,20],a:.85,film:340,vis:3,wat:.7,dark:.8,umami:.6,sweet:.5},
  shoyu:{n:'쇼유 타레',salt:.14,col:[72,36,15],a:.9,film:320,vis:3.2,wat:.6,dark:1,umami:.4},
  ysauce:{n:'야키소바 소스',salt:.07,col:[86,42,20],a:.95,film:170,vis:6,wat:.3,dark:.9,sweet:.6,sauce:1},
  bibim:{n:'비빔장',salt:.06,col:[192,42,22],a:.97,film:120,vis:8,wat:.2,spicy:1,sweet:.6,sauce:1},
  tomato:{n:'토마토 소스',salt:.008,col:[186,40,24],a:.97,film:150,vis:7,wat:.5,sauce:1,sweet:.3},
  oil:{n:'식용유',salt:0,col:[255,224,140],a:.22,film:1150,vis:1.6,wat:0,oil:1},
  olive:{n:'올리브유',salt:0,col:[232,214,110],a:.28,film:1100,vis:1.8,wat:0,oil:1},
  ses:{n:'참기름',salt:0,col:[190,118,40],a:.5,film:900,vis:1.9,wat:0,oil:1,aroma:1},
  butter:{n:'버터',salt:.012,col:[246,214,120],a:.62,film:800,vis:2.4,wat:.15,oil:1,aroma:.6},
  emul:{n:'유화 소스',salt:.004,col:[236,222,180],a:.7,film:300,vis:4,wat:.4,sauce:1},
  juice:{n:'육즙',salt:.004,col:[150,40,36],a:.75,film:420,vis:2.6,wat:1},
};
function newLiq(){return{vol:0,T:22,salt:0,umami:0,spicy:0,sweet:0,sour:0,fat:0,starch:0,col:[200,210,220],aroma:0,dark:0};}
function liqAdd(c,key,ml,T){if(ml<=0)return;if(!c.liq)c.liq=newLiq();c.liq.addT=(typeof G!=='undefined'&&G)?G.t:0;const q=c.liq,d=LQ[key]||LQ.water,nv=q.vol+ml;
  q.T=(q.T*q.vol+(T===undefined?20:T)*ml)/nv;q.col=mix(q.col,d.col,Math.min(1,ml/nv));
  q.salt+=ml*d.salt;q.umami+=ml*(d.umami||0);q.spicy+=ml*(d.spicy||0);q.sweet+=ml*(d.sweet||0);q.sour+=ml*(d.sour||0);q.fat+=ml*(d.fat||0)+(d.oil?ml:0);q.aroma+=ml*(d.aroma||0);q.dark+=ml*(d.dark||0);q.starch+=ml*(d.starch||0)*.02;q.vol=nv;}
function liqTake(q,f){const o=newLiq();for(const k of ['vol','salt','umami','spicy','sweet','sour','fat','starch','aroma','dark']){o[k]=q[k]*f;q[k]-=o[k];}o.T=q.T;o.col=[...q.col];return o;}
function liqMerge(c,o){if(!o||o.vol<=0)return;if(!c.liq){c.liq=o;return;}const q=c.liq,nv=q.vol+o.vol;q.T=(q.T*q.vol+o.T*o.vol)/nv;q.col=mix(q.col,o.col,o.vol/nv);for(const k of ['salt','umami','spicy','sweet','sour','fat','starch','aroma','dark'])q[k]+=o[k];q.vol=nv;}
function liqCol(q){const v=Math.max(q.vol,1);let c=q.col;c=mix(c,[98,52,20],clamp(q.dark/v*9,0,.82));c=mix(c,[204,64,30],clamp(q.spicy/v*22,0,.7));if(q.fat/v>.05)c=mix(c,[236,200,140],clamp(q.fat/v,0,.3));return c;}
const liqDark=q=>clamp(q.dark/Math.max(q.vol,1)*9+q.spicy/Math.max(q.vol,1)*15,0,1);
const saltPct=q=>q&&q.vol>1?q.salt/q.vol*100:0;

/* ---------- noodles ---------- */
const NT={
  somyeon:{n:'소면',cook:38,col:[247,242,228],w:2.4,len:190,cnt:72,starch:1.3,g:100,wave:0},
  ramyeon:{n:'라면 사리',cook:44,col:[238,202,122],w:3.3,len:150,cnt:54,starch:1.2,g:120,wave:1},
  udon:{n:'우동면',cook:28,col:[246,240,224],w:8.5,len:170,cnt:28,seg:20,starch:.5,g:230,wave:0,frozen:1},
  ramen:{n:'생라멘',cook:20,col:[242,216,140],w:3.2,len:160,cnt:50,starch:.7,g:130,wave:.5},
  yakisoba:{n:'야키소바면',cook:40,col:[214,172,96],w:3.2,len:120,cnt:44,starch:.2,g:150,wave:.8,pre:1},
  spaghetti:{n:'스파게티',cook:52,col:[240,208,120],w:3.2,len:200,cnt:60,starch:.45,g:100,wave:0},
};

/* ---------- ingredients ---------- */
const ING={
  kimchi:{n:'김치',tw:260,th:180,sh:()=>blob(104,62,30,.12,.07),moist:1,T0:6,cookRate:.07,brownRate:.03,hk:1,tint:[120,24,10,.3],brown:[105,38,14],edge:'rgba(110,20,6,.35)',chili:1.2,salt:.04},
  onion:{n:'양파',tw:170,th:140,sh:()=>blob(68,54,30,.03,.02),moist:.9,T0:16,cookRate:.06,brownRate:.035,hk:1,tint:[222,186,112,.5],brown:[150,92,38],edge:'rgba(160,140,95,.55)'},
  ham:{n:'햄',tw:190,th:120,sh:()=>rrPoly(168,94,9,3),moist:.32,T0:8,cookRate:.1,brownRate:.05,hk:.9,tint:[200,110,90,.22],brown:[150,74,34],edge:'rgba(150,72,60,.5)',salt:.02},
  scallion:{n:'대파',tw:400,th:34,sh:()=>rrPoly(380,24,11.5,5),moist:.6,T0:10,cookRate:.12,brownRate:.04,hk:1.2,tint:[96,128,52,.35],brown:[120,95,40],edge:'rgba(80,110,50,.5)',cyl:'ring'},
  jjokpa:{n:'쪽파',tw:380,th:22,sh:()=>rrPoly(360,11,5.4,4),moist:.6,T0:10,cookRate:.13,brownRate:.045,hk:1.3,tint:[80,120,40,.35],brown:[110,90,40],edge:'rgba(70,110,40,.5)',cyl:'ring'},
  buchu:{n:'부추',tw:320,th:40,sh:()=>rrPoly(300,30,4,2),moist:.55,T0:10,cookRate:.14,brownRate:.05,hk:1.3,tint:[50,90,30,.3],brown:[90,80,30],edge:'rgba(40,80,25,.5)'},
  zucchini:{n:'애호박',tw:250,th:80,sh:()=>rrPoly(230,62,26,5),moist:.85,T0:12,cookRate:.08,brownRate:.04,hk:1,tint:[190,200,110,.35],brown:[150,120,50],edge:'rgba(60,100,30,.5)',cyl:'zuc'},
  carrot:{n:'당근',tw:230,th:60,sh:carrotShape,moist:.7,T0:12,cookRate:.05,brownRate:.035,hk:.9,tint:[230,120,40,.25],brown:[150,70,20],edge:'rgba(170,80,20,.5)',cyl:'carrot'},
  cucumber:{n:'오이',tw:270,th:60,sh:()=>rrPoly(250,44,20,5),moist:.95,T0:8,cookRate:.07,brownRate:.03,hk:1,tint:[150,190,110,.3],brown:[120,110,50],edge:'rgba(40,80,30,.55)',cyl:'cuc'},
  cabbage:{n:'양배추',tw:230,th:180,sh:()=>blob(98,74,26,.08,.05),moist:.9,T0:8,cookRate:.06,brownRate:.04,hk:1.1,tint:[200,210,140,.35],brown:[160,120,50],edge:'rgba(150,180,110,.55)'},
  pork:{n:'삼겹살',tw:240,th:84,sh:()=>rrPoly(220,64,6,3),moist:.4,T0:4,cookRate:.08,brownRate:.055,hk:.9,tint:[235,215,200,.55],brown:[160,90,40],edge:'rgba(170,90,80,.5)'},
  chashu:{n:'차슈',tw:200,th:104,sh:()=>rrPoly(150,66,26,6),moist:.3,T0:6,cookRate:.1,brownRate:.06,hk:.8,tint:[180,110,80,.15],brown:[120,60,25],edge:'rgba(110,60,30,.5)',cyl:'chashu',salt:.02},
  naruto:{n:'어묵',tw:220,th:52,sh:()=>rrPoly(200,40,16,5),moist:.5,T0:6,cookRate:.12,brownRate:.05,hk:1,tint:[250,240,230,.2],brown:[180,130,70],edge:'rgba(200,170,170,.6)',cyl:'naruto',salt:.02},
  squid:{n:'오징어',tw:230,th:110,sh:()=>rrPoly(200,70,30,5),moist:.7,T0:4,cookRate:.12,brownRate:.04,hk:1,tint:[255,250,240,.45],brown:[170,110,60],edge:'rgba(150,100,110,.5)',cyl:'sring'},
  garlic:{n:'마늘',tw:80,th:56,sh:()=>blob(20,12,18,.05,.03),moist:.6,T0:12,cookRate:.12,brownRate:.11,hk:1.4,tint:[240,225,170,.3],brown:[176,112,38],edge:'rgba(190,170,120,.6)',cyl:'garlic'},
  beef:{n:'소고기 등심',tw:220,th:170,sh:()=>blob(88,66,28,.05,.03),moist:.35,T0:5,cookRate:0,brownRate:.02,hk:.8,tint:[0,0,0,0],brown:[92,48,24],edge:'rgba(90,20,20,.5)',steak:1},
  begg:{n:'삶은 계란',tw:90,th:72,sh:()=>blob(33,25,26,0,0),moist:.2,T0:20,cookRate:0,brownRate:0,hk:1,tint:[0,0,0,0],brown:[0,0,0],edge:'rgba(200,190,170,.7)',custom:'begg'},
  curd:{n:'스크램블',tw:60,th:60,sh:()=>blob(rand(7,11),rand(6,9),12,.2,.12),moist:.3,T0:60,cookRate:.12,brownRate:.05,hk:1.6,tint:[0,0,0,0],brown:[170,110,40],edge:'rgba(210,170,60,.6)',custom:'curd'},
};
function carrotShape(){const P=[];const n=14;for(let i=0;i<=n;i++){const x=-104+i/n*204,h=lerp(24,8,(x+104)/204);P.push([x,-h]);}for(let i=0;i<=6;i++){const a=-PI/2+i/6*PI;P.push([100+Math.cos(a)*8,Math.sin(a)*8]);}for(let i=n;i>=0;i--){const x=-104+i/n*204,h=lerp(24,8,(x+104)/204);P.push([x,h]);}return P;}

/* ---------- textures ---------- */
const TS=2,TEX={},PAT={};let SCAL={};
function texCanvas(w,h,fn){const c=mk(w*TS,h*TS),g=c.getContext('2d');g.scale(TS,TS);fn(g,w,h);c.lw=w;c.lh=h;return c;}
function specks(g,w,h,n,cols,s0,s1){for(let i=0;i<n;i++){g.fillStyle=pick(cols);const s=rand(s0,s1);g.fillRect(rand(0,w),rand(0,h),s,s*rand(.6,1));}}
function vgrad(g,w,h,stops){const gr=g.createLinearGradient(0,0,0,h);for(const s of stops)gr.addColorStop(s[0],s[1]);g.fillStyle=gr;g.fillRect(0,0,w,h);}
const TEXF={
  kimchi(g,w,h){const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,'#b52f18');gr.addColorStop(.5,'#cc4822');gr.addColorStop(1,'#a3281a');g.fillStyle=gr;g.fillRect(0,0,w,h);g.lineCap='round';
    for(let i=0;i<8;i++){const y0=rand(8,h-8),amp=rand(3,10),wd=rand(7,18),ph=rand(0,TAU);g.beginPath();for(let x=-10;x<=w+10;x+=8){const y=y0+Math.sin(x*.025+ph)*amp;x===-10?g.moveTo(x,y):g.lineTo(x,y);}g.strokeStyle=`rgba(242,208,160,${rand(.4,.65)})`;g.lineWidth=wd;g.stroke();g.strokeStyle='rgba(255,238,210,.35)';g.lineWidth=wd*.3;g.stroke();}
    g.globalAlpha=.3;for(let i=0;i<14;i++){g.fillStyle=Math.random()<.5?'#5f7a24':'#7d8a2c';g.beginPath();g.ellipse(rand(w*.72,w),rand(0,h),rand(10,26),rand(6,14),rand(0,3),0,TAU);g.fill();}g.globalAlpha=1;
    specks(g,w,h,700,['rgba(140,18,8,.8)','rgba(235,95,40,.7)','rgba(120,14,6,.6)'],.8,2.6);},
  onion(g,w,h){const cx=w/2,cy=h/2+34,gr=g.createRadialGradient(cx,cy,4,cx,cy,110);gr.addColorStop(0,'#e3e6b8');gr.addColorStop(.35,'#f1ecd6');gr.addColorStop(1,'#f6f1e1');g.fillStyle=gr;g.fillRect(0,0,w,h);
    for(let k=1;k<15;k++){g.strokeStyle=`rgba(188,176,128,${.3+.18*(k%2)})`;g.lineWidth=1.3;g.beginPath();g.ellipse(cx,cy,k*7,k*6.2,0,0,TAU);g.stroke();g.strokeStyle='rgba(255,255,250,.55)';g.lineWidth=.8;g.beginPath();g.ellipse(cx,cy,k*7+2.3,k*6.2+2.1,0,0,TAU);g.stroke();}},
  ham(g,w,h){vgrad(g,w,h,[[0,'#eeb2a5'],[1,'#df9284']]);specks(g,w,h,1100,['rgba(250,215,205,.5)','rgba(185,105,95,.35)'],.6,1.8);},
  scallion(g,w,h){const gr=g.createLinearGradient(10,0,w-10,0);[[0,'#eee9d6'],[.08,'#f6f4e8'],[.42,'#edf1d6'],[.56,'#bcd98e'],[.7,'#77ae4a'],[1,'#4e8b2f']].forEach(s=>gr.addColorStop(s[0],s[1]));g.fillStyle=gr;g.fillRect(0,0,w,h);
    for(let i=0;i<10;i++){const y=h/2-12+i*2.7;g.strokeStyle=i%2?'rgba(255,255,255,.2)':'rgba(60,90,30,.12)';g.lineWidth=.7;g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
    const v=g.createLinearGradient(0,h/2-12,0,h/2+12);v.addColorStop(0,'rgba(0,0,0,.14)');v.addColorStop(.45,'rgba(255,255,255,.12)');v.addColorStop(1,'rgba(0,0,0,.16)');g.fillStyle=v;g.fillRect(0,0,w,h);g.fillStyle='rgba(168,146,104,.9)';g.fillRect(8,0,9,h);},
  jjokpa(g,w,h){const gr=g.createLinearGradient(10,0,w-10,0);[[0,'#efeede'],[.1,'#f2f4e4'],[.24,'#cfe6a8'],[.36,'#7cb24a'],[1,'#3f7d25']].forEach(s=>gr.addColorStop(s[0],s[1]));g.fillStyle=gr;g.fillRect(0,0,w,h);
    const v=g.createLinearGradient(0,h/2-6,0,h/2+6);v.addColorStop(0,'rgba(0,0,0,.18)');v.addColorStop(.45,'rgba(255,255,255,.18)');v.addColorStop(1,'rgba(0,0,0,.2)');g.fillStyle=v;g.fillRect(0,0,w,h);g.fillStyle='rgba(168,146,104,.9)';g.fillRect(9,0,6,h);},
  buchu(g,w,h){g.fillStyle='#3d6e25';g.fillRect(0,0,w,h);for(let i=0;i<8;i++){const y=h/2-14+i*4;g.strokeStyle=pick(['#4f8a2e','#5d9a36','#3f7524','#6aa640']);g.lineWidth=3.6;g.beginPath();g.moveTo(0,y);g.quadraticCurveTo(w/2,y+rand(-1.5,1.5),w,y+rand(-1,1));g.stroke();g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=.8;g.stroke();}
    const gr=g.createLinearGradient(0,0,40,0);gr.addColorStop(0,'rgba(240,240,220,.95)');gr.addColorStop(1,'rgba(240,240,220,0)');g.fillStyle=gr;g.fillRect(0,0,40,h);},
  zucchini(g,w,h){vgrad(g,w,h,[[0,'#3a6424'],[.2,'#86ad52'],[.32,'#e1e9bc'],[.68,'#e1e9bc'],[.8,'#86ad52'],[1,'#3a6424']]);specks(g,w,h,260,['rgba(210,230,170,.6)','rgba(40,80,20,.4)'],.8,2);
    g.fillStyle='rgba(120,100,50,.8)';g.fillRect(4,h/2-6,8,12);},
  carrot(g,w,h){vgrad(g,w,h,[[0,'#c85a10'],[.3,'#ef8a2e'],[.5,'#f7a24a'],[.7,'#ef8a2e'],[1,'#c85a10']]);for(let x=8;x<w;x+=rand(6,12)){g.strokeStyle='rgba(150,60,10,.22)';g.lineWidth=.8;g.beginPath();g.moveTo(x,rand(0,h*.3));g.lineTo(x+rand(-2,2),h-rand(0,h*.3));g.stroke();}},
  cucumber(g,w,h){vgrad(g,w,h,[[0,'#26481a'],[.3,'#4d7c30'],[.5,'#6b9844'],[.7,'#4d7c30'],[1,'#26481a']]);for(let i=0;i<160;i++){const x=rand(0,w),y=rand(0,h);g.fillStyle='rgba(190,215,150,.55)';g.beginPath();g.arc(x,y,rand(.8,1.6),0,TAU);g.fill();g.fillStyle='rgba(20,40,10,.6)';g.fillRect(x-.3,y-.3,.7,.7);}},
  cabbage(g,w,h){const gr=g.createRadialGradient(w*.2,h/2,4,w/2,h/2,w*.6);gr.addColorStop(0,'#eef4d6');gr.addColorStop(1,'#b7d68a');g.fillStyle=gr;g.fillRect(0,0,w,h);g.lineCap='round';
    for(let i=0;i<11;i++){const a=-1.1+i*.22,L2=rand(w*.55,w*.9);g.strokeStyle='rgba(250,252,235,.75)';g.lineWidth=3.2;g.beginPath();g.moveTo(w*.08,h/2);g.quadraticCurveTo(w*.08+Math.cos(a)*L2*.5,h/2+Math.sin(a)*L2*.35,w*.08+Math.cos(a)*L2,h/2+Math.sin(a)*L2*.6);g.stroke();g.lineWidth=1;g.strokeStyle='rgba(160,190,120,.5)';g.stroke();}},
  pork(g,w,h){let y=0;while(y<h){const fat=Math.random()<.4,t=fat?rand(4,10):rand(8,16);g.fillStyle=fat?'#f4e8de':pick(['#d98c86','#d47f7a','#e09a92']);g.fillRect(0,y,w,t+1);y+=t;}specks(g,w,h,500,['rgba(255,240,235,.35)','rgba(170,80,70,.25)'],.6,1.6);},
  chashu(g,w,h){vgrad(g,w,h,[[0,'#5a2c14'],[.14,'#8a4a24'],[.26,'#d59886'],[.74,'#d59886'],[.86,'#8a4a24'],[1,'#5a2c14']]);g.strokeStyle='rgba(250,236,220,.7)';g.lineWidth=2.2;for(let i=0;i<5;i++){g.beginPath();const y=h*.3+i*h*.1;g.moveTo(0,y);for(let x=0;x<=w;x+=20)g.lineTo(x,y+Math.sin(x*.05+i)*3);g.stroke();}},
  naruto(g,w,h){vgrad(g,w,h,[[0,'#e8ddd4'],[.2,'#fbf8f2'],[.8,'#fbf8f2'],[1,'#e8ddd4']]);g.strokeStyle='rgba(215,120,150,.5)';g.lineWidth=1.5;g.beginPath();g.moveTo(0,h/2);g.lineTo(w,h/2);g.stroke();for(let x=0;x<w;x+=5){g.fillStyle='rgba(200,190,180,.5)';g.fillRect(x,h/2-21,2,3);g.fillRect(x,h/2+18,2,3);}},
  squid(g,w,h){vgrad(g,w,h,[[0,'#efe3d6'],[1,'#f8f0e6']]);for(let i=0;i<500;i++){const y=rand(0,h*.55);g.fillStyle=`rgba(${pick(['130,60,80','160,80,90','110,50,70'])},${rand(.2,.6)})`;g.beginPath();g.arc(rand(0,w),y,rand(.6,2),0,TAU);g.fill();}},
  garlic(g,w,h){vgrad(g,w,h,[[0,'#e9dcc0'],[.5,'#f7f0de'],[1,'#e2d2b0']]);g.strokeStyle='rgba(200,180,140,.5)';g.lineWidth=.8;for(let i=0;i<5;i++){g.beginPath();g.moveTo(8,h/2+(i-2)*6);g.quadraticCurveTo(w/2,h/2+(i-2)*9,w-8,h/2+(i-2)*6);g.stroke();}},
  beef(g,w,h){vgrad(g,w,h,[[0,'#f2e4d2'],[.1,'#eed8c4'],[.14,'#a82e2e'],[1,'#921f24']]);g.lineCap='round';for(let i=0;i<22;i++){g.strokeStyle=`rgba(250,232,222,${rand(.35,.7)})`;g.lineWidth=rand(.6,2.2);g.beginPath();let x=rand(0,w),y=rand(h*.15,h);g.moveTo(x,y);for(let k=0;k<4;k++){x+=rand(-18,18);y+=rand(-10,10);g.lineTo(x,y);}g.stroke();}specks(g,w,h,600,['rgba(120,10,20,.4)','rgba(200,70,70,.3)'],.8,2);},
  begg(g,w,h){g.fillStyle='#fbf7ee';g.fillRect(0,0,w,h);},
  curd(g,w,h){g.fillStyle='#f4d45c';g.fillRect(0,0,w,h);},
};
function buildTextures(){for(const k in ING){TEX[k]=texCanvas(ING[k].tw,ING[k].th,TEXF[k]);PAT[k]=ctx.createPattern(TEX[k],'no-repeat');}
  for(const k of ['scallion','jjokpa']){const t=TEX[k],d=t.getContext('2d').getImageData(0,Math.round(t.height/2)+2,t.width,1).data;SCAL[k]=[];for(let x=0;x<t.lw;x++){const i=x*TS*4;SCAL[k].push([d[i],d[i+1],d[i+2]]);}}}
function puff(col){const c=mk(64,64),g=c.getContext('2d');const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,`rgba(${col},1)`);gr.addColorStop(.45,`rgba(${col},.45)`);gr.addColorStop(1,`rgba(${col},0)`);g.fillStyle=gr;g.fillRect(0,0,64,64);return c;}
const SP={steam:puff('255,255,255'),smoke:puff('62,58,56'),flame:puff('255,140,40'),glow:puff('255,215,130')};
// browning spot texture for jeon/steak
const SPOTS=(()=>{const c=mk(256,256),g=c.getContext('2d'),R=mulberry(11);for(let i=0;i<900;i++){const r=R()*9+1;g.fillStyle=`rgba(${90+R()*50|0},${45+R()*25|0},${12+R()*12|0},${R()*.5+.2})`;g.beginPath();g.ellipse(R()*256,R()*256,r,r*(.5+R()*.5),R()*3,0,TAU);g.fill();}return c;})();

/* ---------- pieces ---------- */
function blob(rx,ry,n,a1,a2){const p1=rand(0,TAU),p2=rand(0,TAU),P=[];for(let i=0;i<n;i++){const a=i/n*TAU,k=1+a1*Math.sin(3*a+p1)+a2*Math.sin(5*a+p2)+rand(-.015,.015);P.push([Math.cos(a)*rx*k,Math.sin(a)*ry*k]);}return P;}
function rrPoly(w,h,r,n){const P=[],cx=[w/2-r,-w/2+r,-w/2+r,w/2-r],cy=[h/2-r,h/2-r,-h/2+r,-h/2+r];for(let k=0;k<4;k++)for(let i=0;i<=n;i++){const a=k*PI/2+i/n*PI/2;P.push([cx[k]+Math.cos(a)*r,cy[k]+Math.sin(a)*r]);}return P;}
let PID=1;
const newCoat=d=>({salt:d.salt||0,dark:0,chili:d.chili||0,oil:0,sauce:0});
function newPiece(type,x,y){const d=ING[type];const p={id:PID++,kind:'piece',type,poly:d.sh(),tx:0,ty:0,x,y,rot:(type==='scallion'||type==='jjokpa'||type==='buchu')?rand(-.06,.06):rand(-.25,.25),
  vx:0,vy:0,z:0,vz:0,av:0,T:d.T0,Tmax:d.T0,moist:d.moist,cook:0,face:[0,0],down:0,coat:newCoat(d),crowd:0,nc:0,flipT:0,pend:false,aroma:0,fire:0,bitter:0,cooked:false,stick:0};
  if(d.steak){p.L=new Array(12).fill(d.T0);p.Lm=new Array(12).fill(d.T0);p.offT=-1;p.rest=0;}
  finalize(p);if(!d.shH)d.shH=p.ey;p.orig=p.area;return p;}
function finalize(p){const P=p.poly;let A=0,cx=0,cy=0;for(let i=0,n=P.length;i<n;i++){const a=P[i],b=P[(i+1)%n];const c=a[0]*b[1]-b[0]*a[1];A+=c;cx+=(a[0]+b[0])*c;cy+=(a[1]+b[1])*c;}A/=2;if(Math.abs(A)<1e-6){cx=P[0][0];cy=P[0][1];}else{cx/=6*A;cy/=6*A;}
  let m=0,x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(const q of P){q[0]-=cx;q[1]-=cy;m=Math.max(m,Math.hypot(q[0],q[1]));x0=Math.min(x0,q[0]);x1=Math.max(x1,q[0]);y0=Math.min(y0,q[1]);y1=Math.max(y1,q[1]);}
  p.tx+=cx;p.ty+=cy;const c=Math.cos(p.rot),s=Math.sin(p.rot);p.x+=c*cx-s*cy;p.y+=s*cx+c*cy;p.area=Math.abs(A);p.r=Math.sqrt(p.area/PI);p.mass=p.area/400;p.rb=m;p.ex=x1-x0;p.ey=y1-y0;{let bw=1e9,ba=0,bl=0;for(let k=0;k<18;k++){const a=k/18*PI,c=Math.cos(a),s=Math.sin(a);let lo=1e9,hi=-1e9,lo2=1e9,hi2=-1e9;for(const q of p.poly){const u=q[0]*c+q[1]*s,w=-q[0]*s+q[1]*c;if(u<lo)lo=u;if(u>hi)hi=u;if(w<lo2)lo2=w;if(w>hi2)hi2=w;}if(hi-lo<bw){bw=hi-lo;ba=a;bl=hi2-lo2;}}p.minW=bw;p.minA=ba;p.minL=bl;}checkDisc(p);}
function checkDisc(p){const d=ING[p.type];p.disc=false;if(!d.cyl||!d.shH)return;if(p.ey>=d.shH*.72&&p.ex<=Math.max(11,p.ey*.95)){p.disc=true;p.dr=p.ey/2;if(d.cyl==='ring'){const arr=SCAL[p.type];p.ringCol=arr[clamp(Math.round(p.tx+d.tw/2),0,arr.length-1)];}p.r=Math.max(p.r,p.dr*.8);}}
function commonIds(a,b){if(!a[2]||!b[2])return null;const r=a[2].filter(x=>b[2].includes(x));return r.length?r:null;}
function clipPoly(P,nx,ny,d,sgn,lid){const out=[],n=P.length;for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n];const fa=(nx*a[0]+ny*a[1]-d)*sgn,fb=(nx*b[0]+ny*b[1]-d)*sgn;if(fa>=0)out.push(a[2]?[a[0],a[1],a[2].slice()]:[a[0],a[1]]);if((fa>=0)!==(fb>=0)){const t=fa/(fa-fb),ids=(commonIds(a,b)||[]).concat(lid===undefined?[]:[lid]);out.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,ids]);}}return out;}
let CUTID=1;
function polyArea(P){let A=0;for(let i=0,n=P.length;i<n;i++){const a=P[i],b=P[(i+1)%n];A+=a[0]*b[1]-b[0]*a[1];}return Math.abs(A/2);}
function clonePiece(p,poly){if(p._under)delete p._under;const o=Object.assign({},p,{id:PID++,poly,coat:{...p.coat},face:[...p.face]});if(p.L){o.L=[...p.L];o.Lm=[...p.Lm];}return o;}
function pointInPiece(p,x,y){const dx=x-p.x,dy=y-p.y,c=Math.cos(p.rot),s=Math.sin(p.rot);const lx=c*dx+s*dy,ly=-s*dx+c*dy;if(p.disc)return lx*lx+ly*ly<p.dr*p.dr*1.2;const P=p.poly;let ins=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a[1]>ly)!==(b[1]>ly)&&lx<(b[0]-a[0])*(ly-a[1])/(b[1]-a[1])+a[0])ins=!ins;}return ins;}
function makeGrains(n,lx,ly,R,T0){const a=[];for(let i=0;i<n;i++){const t=rand(0,TAU),r=Math.sqrt(Math.random())*R;a.push({kind:'grain',ci:i,x:lx+Math.cos(t)*r,y:ly+Math.sin(t)*r*.85,vx:0,vy:0,z:rand(0,22),vz:0,av:0,rot:rand(0,TAU),r:3.6,mass:.33,T:T0,Tmax:T0,moist:.28,cook:0,face:[0,0],down:Math.random()<.5?0:1,coat:{salt:0,dark:0,chili:0,oil:0,sauce:0},stick:1,crowd:6,nc:0,flipT:0,pend:false,aroma:0,fire:0,bitter:0,cooked:false});}return a;}
function newNoodle(type,lx,ly){const d=NT[type],st=[];const cnt=d.cnt,seg=d.seg||12,sl=d.len/seg;
  for(let i=0;i<cnt;i++){const pts=[];let ang,ox,oy;
    if(type==='ramyeon'||type==='udon'||d.pre){ang=rand(0,TAU);ox=lx+rand(-26,26);oy=ly+rand(-26,26);}else{ang=-.5+rand(-.06,.06);ox=lx+rand(-10,10)-Math.cos(ang)*d.len/2;oy=ly+rand(-10,10)-Math.sin(ang)*d.len/2;}
    for(let k=0;k<seg;k++){let x,y;if(type==='ramyeon'||type==='udon'||d.pre){const a2=ang+k*1.3;x=ox+Math.cos(a2)*(8+k*1.6*12/seg)*(type==='udon'?1.4:1);y=oy+Math.sin(a2)*(8+k*1.6*12/seg);}else{x=ox+Math.cos(ang)*sl*k;y=oy+Math.sin(ang)*sl*k;}pts.push({x,y,ox:x,oy:y});}
    st.push({pts,ph:rand(0,TAU)});}
  return{kind:'noodle',type,g:d.g,done:d.pre?.9:0,stick:d.frozen?1:d.pre?.8:.55,rinse:0,T:d.frozen?-8:20,Tmax:20,mush:0,coat:{salt:0,dark:0,chili:0,oil:0,sauce:0},sl,strands:st,brown:0,mixEven:0,starch:0,stirT:0};}
function mkCont(kind,x,y,r,o){return Object.assign({kind,x,y,hx:x,hy:y,r,items:[],noodles:[],eggs:[],jeons:[],beggs:[],fluid:[],seeds:[],liq:null,flav:{fire:0,bitter:0,scal:0,chiliOil:0,garlic:0},T:22,foam:0,ice:[],sauce:0,t0:-1},o||{});}
function contEmpty(c){return!c.custard&&!c.items.length&&!c.noodles.length&&!c.eggs.length&&!c.jeons.length&&!c.beggs.length&&!(c.liq&&c.liq.vol>2)&&!c.fluid.length&&!c.ice.length;}
