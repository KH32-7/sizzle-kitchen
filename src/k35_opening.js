
/* ---------- opening: a cut-paper stop-motion about opening the little restaurant ---------- */
const OPN={on:false,t:0,S:1,cache:{},g:null,done:null,raf:0,last:0,cues:{}};
/* paper grain: speckles + fibres, laid over every piece with source-atop */
let PGRAIN=null;
function paperGrain(){if(PGRAIN)return PGRAIN;const c=mk(256,256),g=c.getContext('2d'),R=mulberry(11);
  for(let i=0;i<2600;i++){const v=R()<.5?0:255;g.fillStyle=`rgba(${v},${v},${v},${.03+R()*.07})`;const s=.6+R()*1.6;g.fillRect(R()*256,R()*256,s,s);}
  g.lineCap='round';for(let i=0;i<70;i++){g.strokeStyle=`rgba(${R()<.5?'90,70,50':'255,255,255'},${.05+R()*.07})`;g.lineWidth=.4+R()*.8;g.beginPath();let x=R()*256,y=R()*256;g.moveTo(x,y);for(let k=0;k<4;k++){x+=(R()-.5)*26;y+=(R()-.5)*26;g.lineTo(x,y);}g.stroke();}
  return PGRAIN=c;}
/* shapes as point lists; tear() roughens every edge like hand-cut paper */
const Pp={rect:(x,y,w,h)=>[[x,y],[x+w,y],[x+w,y+h],[x,y+h]],
  ell:(cx,cy,rx,ry,n)=>{n=n||44;const a=[];for(let i=0;i<n;i++){const t=i/n*TAU;a.push([cx+Math.cos(t)*rx,cy+Math.sin(t)*ry]);}return a;},
  blob:(cx,cy,r,seed,irr)=>{const R=mulberry(seed),a=[],n=24;irr=irr||.2;for(let i=0;i<n;i++){const t=i/n*TAU,k=1+(R()-.5)*irr+Math.sin(t*2+seed)*irr*.5;a.push([cx+Math.cos(t)*r*k,cy+Math.sin(t)*r*k]);}return a;},
  star:(cx,cy,r)=>{const a=[];for(let i=0;i<10;i++){const rr=i%2?r*.45:r,t=i/10*TAU-PI/2;a.push([cx+Math.cos(t)*rr,cy+Math.sin(t)*rr]);}return a;},
  flame:(cx,by,w,h)=>{const out=[];for(let i=0;i<=28;i++){const ang=i/28*TAU,r=Math.pow(Math.abs(Math.sin(ang/2)),1.3);out.push([cx+Math.sin(ang)*w*.5*r*1.4,by-h*.5+Math.cos(ang)*h*.5]);}return out;},
  heart:(cx,cy,s)=>{const a=[];for(let i=0;i<40;i++){const t=i/40*TAU;a.push([cx+s*16*Math.pow(Math.sin(t),3)/16,cy-s*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/16]);}return a;}};
function tear(pts,seed,amp){const R=mulberry(seed),out=[];amp=amp===undefined?2.2:amp;
  for(let i=0;i<pts.length;i++){const [x0,y0]=pts[i],[x1,y1]=pts[(i+1)%pts.length],len=Math.hypot(x1-x0,y1-y0),n=Math.max(1,Math.round(len/7)),nx=-(y1-y0)/(len||1),ny=(x1-x0)/(len||1);
    for(let k=0;k<n;k++){const t=k/n,j=(R()-.5)*amp*2+(R()<.06?(R()-.5)*amp*3:0);out.push([x0+(x1-x0)*t+nx*j,y0+(y1-y0)*t+ny*j]);}}return out;}
/* one paper piece = torn polygons filled with colour, grain on top, pale cut rim */
function piece(key,w,h,build,variant){const id=key+'#'+(variant||0);if(OPN.cache[id])return OPN.cache[id];const S=OPN.S,pad=8,c=mk(Math.ceil((w+pad*2)*S),Math.ceil((h+pad*2)*S)),g=c.getContext('2d');
  g.scale(S,S);g.translate(pad,pad);let seed=7+hashId(key)%9000+(variant||0)*131;
  const layer=(pts,col,amp,rim)=>{const P=amp===0?pts:tear(pts,seed++,amp);g.save();g.beginPath();P.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();g.fillStyle=col;g.fill();
    g.clip();g.fillStyle=g.createPattern(paperGrain(),'repeat');g.fillRect(-pad,-pad,w+pad*2,h+pad*2);
    if(rim!==false){g.strokeStyle='rgba(255,255,255,.34)';g.lineWidth=2.6;g.stroke();}g.restore();};
  build(layer,g);c.w=w;c.h=h;c.pad=pad;return OPN.cache[id]=c;}
const boil=()=>Math.floor(OPN.t*7)%3;// stop-motion edge wobble
function put(p,x,y,o){o=o||{};const g=OPN.g,S=OPN.S;g.save();g.translate(x,y);if(o.rot)g.rotate(o.rot);if(o.sx!==undefined||o.sy!==undefined)g.scale(o.sx===undefined?1:o.sx,o.sy===undefined?(o.sx===undefined?1:o.sx):o.sy);g.globalAlpha=o.a===undefined?1:o.a;
  const d=o.d===undefined?2:o.d;if(d>0){g.shadowColor=`rgba(60,34,14,${.26+d*.03})`;g.shadowBlur=d*4*S;g.shadowOffsetX=d*1.2*S;g.shadowOffsetY=d*2*S;}
  const ax=o.ax===undefined?.5:o.ax,ay=o.ay===undefined?.5:o.ay;g.drawImage(p,-(p.w*ax)-p.pad,-(p.h*ay)-p.pad,p.width/S,p.height/S);g.restore();}
function sticker(key,text,size,fill,edge,font){const id='T'+key;if(OPN.cache[id])return OPN.cache[id];const S=OPN.S,m=mk(10,10).getContext('2d');m.font=`${size}px ${font||'"Black Han Sans"'}`;
  const w=Math.ceil(m.measureText(text).width)+size*.5,h=Math.ceil(size*1.35),pad=12,c=mk(Math.ceil((w+pad*2)*S),Math.ceil((h+pad*2)*S)),g=c.getContext('2d');g.scale(S,S);g.translate(pad,pad);
  g.font=m.font;g.textBaseline='middle';g.lineJoin='round';g.strokeStyle=edge;g.lineWidth=size*.24;g.strokeText(text,size*.25,h/2);g.fillStyle=fill;g.fillText(text,size*.25,h/2);
  g.globalCompositeOperation='source-atop';g.fillStyle=g.createPattern(paperGrain(),'repeat');g.fillRect(-pad,-pad,w+pad*2,h+pad*2);c.w=w;c.h=h;c.pad=pad;return OPN.cache[id]=c;}
const eo=t=>1-Math.pow(1-clamp(t,0,1),3),eio=t=>{t=clamp(t,0,1);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2},
  bounce=t=>{t=clamp(t,0,1);const n=7.5625,d=2.75;return t<1/d?n*t*t:t<2/d?n*(t-=1.5/d)*t+.75:t<2.5/d?n*(t-=2.25/d)*t+.9375:n*(t-=2.625/d)*t+.984375;},
  back=t=>{t=clamp(t,0,1);const c=1.9;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2);};
function cue(k,fn){if(OPN.cues[k])return;OPN.cues[k]=1;if(AU.on&&!AU.muted)try{fn();}catch(e){}}
/* ---- props ---- */
const PAL={cream:'#f3e8d2',kraft:'#cfa77b',wood:'#8b5a35',red:'#c23a1b',navy:'#2c3a5c',night:'#1d2742',gold:'#f0b64a',green:'#4f8a4a',skin:'#f1c9a0',white:'#fbf8f1',ink:'#3a2410'};
const pSky=(k,col)=>piece('sky'+k,1640,780,L=>L(Pp.rect(0,0,1640,780),col,0));
function pBld(i,night){const B=[[80,420,260,340],[330,470,200,290],[1080,440,230,320],[1320,390,300,370]][i],w=B[2],h=B[3];
  return piece('bld'+i+night,w,h,L=>{L(Pp.rect(0,0,w,h),night?PAL.night:'#b98b64');for(let r=0;r<3;r++)for(let c=0;c<3;c++)if((r+c+i)%3)L(Pp.rect(24+c*(w-60)/3,30+r*80,30,40),night?'#f3d27a':'#fff1c9',1.2);},boil());}
function pShop(){return piece('shop',500,470,L=>{L(Pp.rect(20,90,460,380),PAL.kraft);L(Pp.rect(0,40,500,72),PAL.wood);
    const sc=[];for(let i=0;i<10;i++)sc.push([i*50+50,110],[i*50+25,142]);L([[0,70],[500,70],[500,110],...sc.reverse().map(p=>p),[0,110]],PAL.red);
    for(let i=0;i<10;i+=2)L([[i*50,70],[i*50+50,70],[i*50+50,110],[i*50+25,142],[i*50,110]],PAL.cream);
    L(Pp.rect(40,162,420,308),'#3b2a20');},boil());}
function pInterior(){return piece('inside',410,300,(L,g)=>{L(Pp.rect(0,0,410,300),'#f6d58b',1.4);L(Pp.rect(0,200,410,100),PAL.wood,1.4);for(let i=0;i<5;i++)L(Pp.rect(30+i*72,0,56,78),i%2?'#2f4a7a':'#35578f',1.2);
    L(Pp.ell(110,190,46,14),PAL.white);L(Pp.ell(290,190,46,14),PAL.white);g.fillStyle='rgba(255,240,200,.35)';g.fillRect(0,0,410,300);},boil());}
function pShutter(){return piece('shutter',410,300,(L,g)=>{L(Pp.rect(0,0,410,300),'#9aa0a6',1.2);g.strokeStyle='rgba(40,40,40,.28)';g.lineWidth=2.4;for(let y=14;y<300;y+=18){g.beginPath();g.moveTo(4,y);g.lineTo(406,y);g.stroke();}},boil());}
function pNote(){return piece('note',110,80,(L,g)=>{L(Pp.rect(0,0,110,80),PAL.white);g.fillStyle='#b8321c';g.font='34px "Black Han Sans"';g.textAlign='center';g.fillText('임대',55,52);},boil());}
function pFigure(key,coat,hat){return piece('fig'+key,120,236,(L,g)=>{L([[22,112],[98,112],[112,236],[8,236]],coat);if(hat!=='chef')L([[44,112],[76,112],[70,170],[50,170]],'#fff3e0',1.2);
    L(Pp.ell(60,80,34,36),PAL.skin);if(hat==='chef'){L(Pp.rect(34,14,52,32),PAL.white);L(Pp.blob(60,16,30,hashId(key),.14),PAL.white);}else L(Pp.ell(60,56,36,18),hat||'#3a2a20');
    g.fillStyle=PAL.ink;g.beginPath();g.arc(48,82,3.4,0,TAU);g.arc(72,82,3.4,0,TAU);g.fill();g.strokeStyle=PAL.ink;g.lineWidth=2.6;g.lineCap='round';g.beginPath();g.arc(60,90,9,.25,PI-.25);g.stroke();
    g.fillStyle='rgba(230,120,110,.45)';g.beginPath();g.arc(42,94,6,0,TAU);g.arc(78,94,6,0,TAU);g.fill();},boil());}
function figure(key,coat,hat,x,y,o){o=o||{};const bob=o.walk?-Math.abs(Math.sin(OPN.t*8))*9:0;
  if(o.wave!==undefined)put(piece('arm'+key,24,74,L=>L(Pp.rect(0,0,24,74),coat),boil()),x+42,y-122+bob,{ax:.5,ay:.08,rot:-2.4+Math.sin(o.wave*9)*.45,d:2});
  put(pFigure(key,coat,hat),x,y+bob,{ay:1,d:3,rot:o.walk?Math.sin(OPN.t*8)*.05:0,sx:o.flip?-1:1,sy:1});}
function caption(text,lt,dur){if(!text)return;const g=OPN.g,n=Math.floor(clamp((lt-.3)/1.6,0,1)*text.length),a=clamp((lt-.2)*3,0,1)*clamp((dur-lt-.2)*3,0,1);if(a<=0)return;
  const w=Math.min(1240,text.length*40+140);put(piece('cap'+w,w,90,L=>L(Pp.rect(0,0,w,90),PAL.cream,3),boil()),800,904,{a,d:3,rot:-.008});
  g.save();g.globalAlpha=a;g.font='54px "Nanum Pen Script", "Gowun Dodum", sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle=PAL.ink;g.fillText(text.slice(0,n),800,906);g.restore();}
function street(night,lt,drift){const z=1+lt*.01;put(pSky(night?'n':'d',night?PAL.navy:'#f6cf8e'),800,390,{d:0,sx:z});return z;}
function lampGlow(x,y,r,a){const g=OPN.g;g.save();g.globalCompositeOperation='lighter';const gr=g.createRadialGradient(x,y,4,x,y,r);gr.addColorStop(0,`rgba(255,200,110,${a})`);gr.addColorStop(1,'rgba(255,200,110,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);g.restore();}
function shopFront(shut,night){put(pShop(),800,565,{d:4});put(pInterior(),800,642,{d:0});
  if(shut>0){const g=OPN.g;g.save();g.beginPath();g.rect(595,492,410,300);g.clip();put(pShutter(),800,642-300*(1-shut),{d:1});g.restore();put(piece('roll',430,26,L=>L(Pp.rect(0,0,430,26),'#6f757c',1),boil()),800,494,{d:2});}
  put(piece('lamp',40,330,(L)=>{L(Pp.rect(16,40,10,290),'#2b2b2e',1);L(Pp.ell(20,30,20,22),night?'#ffe3a0':'#f4ead0');}),440,650,{d:2});if(night)lampGlow(440,488,170,.28+Math.sin(OPN.t*11)*.03);}
/* ---- scenes ---- */
const OSC=[
 {d:6.8,cap:'골목 끝, 오래 비어 있던 작은 가게가 있었어요.',draw:lt=>{
   street(true,lt);for(let i=0;i<16;i++){const R=mulberry(i+3),x=R()*1600,y=30+R()*300;put(piece('star',30,30,L=>L(Pp.star(15,15,14),'#f6e7b0',.8),boil()),x,y,{sx:(.55+R()*.6)*(.8+.2*Math.sin(OPN.t*3+i)),d:0});}
   put(piece('moon',150,150,L=>L(Pp.ell(75,75,70,70),'#f3e3b5'),boil()),1290,190+Math.sin(OPN.t*1.3)*5,{d:2});
   for(let i=0;i<4;i++){const B=[[80,420,260,340],[330,470,200,290],[1080,440,230,320],[1320,390,300,370]][i];put(pBld(i,true),B[0]+B[2]/2+lt*3*(i%2?1:-1),B[1]+B[3]/2,{d:2});}
   put(piece('road',1640,260,L=>L(Pp.rect(0,20,1640,240),'#4a3a34'),boil()),800,880,{d:3});shopFront(1,true);
   put(pNote(),800,600,{rot:-.12+Math.sin(OPN.t*2)*.03,d:2});
   const cat=eo((lt-2.5)/1.2);if(lt>2.5)put(piece('cat',90,60,(L)=>{L(Pp.ell(45,40,40,20),'#2a2320');L(Pp.ell(76,24,16,16),'#2a2320');L([[66,12],[70,0],[76,10]],'#2a2320',.6);L([[80,10],[86,0],[88,12]],'#2a2320',.6);},boil()),1500-cat*420,786,{d:2});}},
 {d:6.8,cap:'오늘, 그 가게의 셔터가 올라가요.',draw:lt=>{
   street(false,lt);const sun=eo(lt/2.2);put(piece('sun',190,190,L=>L(Pp.ell(95,95,90,90),'#f7a23a'),boil()),1250,640-sun*430,{d:1,rot:OPN.t*.2});
   for(let i=0;i<4;i++){const B=[[80,420,260,340],[330,470,200,290],[1080,440,230,320],[1320,390,300,370]][i];put(pBld(i,false),B[0]+B[2]/2,B[1]+B[3]/2,{d:2});}
   put(piece('roadD',1640,260,L=>L(Pp.rect(0,20,1640,240),'#8a6a52'),boil()),800,880,{d:3});
   const up=eio((lt-1.1)/2);if(lt>1.1)cue('shut',()=>{AU.slide&&AU.slide();setTimeout(()=>AU.slide&&AU.slide(),350);});shopFront(1-up,false);
   if(lt<3.6){const f=clamp((lt-1)/2.4,0,1);put(pNote(),800+f*520,600-Math.sin(f*PI)*260+f*f*160,{rot:-.12+f*6,a:1-clamp((lt-3)/.6,0,1),d:3});}
   const w=eo((lt-2.6)/1.8);figure('chef',PAL.white,'chef',-80+w*520,812,{walk:lt>2.6&&lt<4.4,wave:lt>4.4?lt:undefined});}},
 {d:7.2,cap:'썰고, 볶고, 삶고, 부쳐서 — 한 그릇에 정성을 담아요.',draw:lt=>{const g=OPN.g;
   put(piece('tiles',1640,660,(L,gg)=>{L(Pp.rect(0,0,1640,660),'#efe6d3',0);gg.strokeStyle='rgba(150,130,100,.28)';gg.lineWidth=3;for(let x=0;x<1640;x+=82){gg.beginPath();gg.moveTo(x,0);gg.lineTo(x,660);gg.stroke();}for(let y=0;y<660;y+=82){gg.beginPath();gg.moveTo(0,y);gg.lineTo(1640,y);gg.stroke();}}),800,330,{d:0});
   put(piece('counter',1640,380,L=>{L(Pp.rect(0,0,1640,380),PAL.wood,1.5);L(Pp.rect(0,0,1640,26),'#a9744a',1.2);},boil()),800,820,{d:3});
   put(piece('stove',760,150,L=>L(Pp.rect(0,0,760,150),'#2a2a2e',1.5),boil()),800,800,{d:3});
   for(let i=0;i<7;i++){const x=560+i*80,fl=.8+.25*Math.sin(OPN.t*14+i*1.7)+.1*Math.sin(OPN.t*23+i);put(piece('flame'+(i%2),60,110,L=>{L(Pp.flame(30,110,54,108),'#f26b2d',1.4);L(Pp.flame(30,110,28,62),'#ffd54a',1.2);},boil()),x,760,{ay:1,sy:fl,sx:1,d:0});}
   const toss=clamp((lt-4.8)/.9,0,1),hop=Math.sin(toss*PI)*130,tilt=Math.sin(toss*PI)*.08;
   put(piece('pan',520,440,(L)=>{L(Pp.ell(220,220,212,212),'#3a3b40',1.4);L(Pp.ell(220,220,188,188),'#23242a',1.2);L(Pp.rect(410,190,110,60),'#1e1e22',1.2);},boil()),860,560,{d:5,rot:tilt});
   const items=[['kim',-110,-50,.6],['kim',80,-90,.8],['onion',-40,80,1],['kim',130,50,1.2],['sca',-140,50,1.4],['egg',20,-5,1.7],['sca',100,-130,2],['kim',-80,-130,2.2],['sca',160,-20,2.4],['sca',-20,130,2.6]];
   items.forEach(([k,dx,dy,t0],i)=>{if(lt<t0)return;const f=bounce((lt-t0)/.55),y=560+dy-(1-f)*620-hop*(1-Math.abs(dx)/300),x=800+dx;if(f>.95&&lt-t0<.8)cue('drop'+i,()=>AU.sizzleBurst&&AU.sizzleBurst(.45,x*1.6));
     const p=k==='kim'?piece('kim'+(i%3),70,56,L=>{L(Pp.blob(35,28,26,i*7+1,.35),'#c8321e');L(Pp.blob(33,26,14,i*7+2,.4),'#e2653f',1.2);},boil())
       :k==='sca'?piece('sca',46,46,(L,gg)=>{L(Pp.ell(23,23,20,20),'#5aa048');L(Pp.ell(23,23,10,10),'#d8f0b8',1);},boil())
       :k==='onion'?piece('onion',80,50,L=>L(Pp.blob(40,25,24,33,.25),'#f5eecf'),boil())
       :piece('egg',170,150,(L)=>{L(Pp.blob(85,75,66,9,.22),PAL.white);L(Pp.ell(88,72,28,28),'#f2b01e',1.2);},boil());
     put(p,x,y,{rot:(i%2?.3:-.2)+toss*i*.6,d:3,sx:1.45});});
   for(let i=0;i<6;i++){const ph=((lt*.45+i/6)%1),a=Math.sin(ph*PI)*.75*clamp(lt-1,0,1);put(piece('steam',120,90,L=>L(Pp.blob(60,45,40,i+20,.3),'#ffffff',2.4,false),boil()),760+Math.sin(i*2.1+ph*3)*140,420-ph*300,{a,sx:.7+ph*.9,d:0});}
   if(lt>1.3){const s=back((lt-1.3)/.4);put(sticker('ji','지글지글',96,'#ffcf5a','#7a2410'),420,250,{rot:-.14,sx:s,d:4});cue('sz',()=>AU.sizzleBurst&&AU.sizzleBurst(.7,800));}
   if(lt>2.9){const s=back((lt-2.9)/.4);put(sticker('chik','치익!',72,'#ffffff','#c23a1b'),1250,300,{rot:.12,sx:s,d:4});}
   if(lt>5){const s=back((lt-5)/.4);put(sticker('toss','휙!',64,'#fff3dc','#3a5a8a'),1220,560,{rot:-.08,sx:s,d:4});}}},
 {d:7.4,cap:'지글지글 키친, 오늘부터 영업합니다!',draw:lt=>{const g=OPN.g;
   street(false,lt);put(piece('sun',190,190,L=>L(Pp.ell(95,95,90,90),'#f7a23a'),boil()),1250,210,{d:1,rot:OPN.t*.2});
   for(let i=0;i<4;i++){const B=[[80,420,260,340],[330,470,200,290],[1080,440,230,320],[1320,390,300,370]][i];put(pBld(i,false),B[0]+B[2]/2,B[1]+B[3]/2,{d:2});}
   put(piece('roadD',1640,260,L=>L(Pp.rect(0,20,1640,240),'#8a6a52'),boil()),800,880,{d:3});shopFront(0,false);
   const drop=eo((lt-.2)/.9),sw=lt>1.1?.32*Math.exp(-2.4*(lt-1.1))*Math.sin((lt-1.1)*8):0,sy=-220+drop*520;
   g.save();g.strokeStyle='#5a3c27';g.lineWidth=3;g.beginPath();g.moveTo(640,0);g.lineTo(640+Math.sin(sw)*120,sy-10);g.moveTo(960,0);g.lineTo(960+Math.sin(sw)*120,sy-10);g.stroke();g.restore();
   put(piece('sign',440,120,(L,gg)=>{L(Pp.rect(0,0,440,120),'#6b4423',1.6);L(Pp.rect(14,12,412,96),'#80562f',1.2);gg.font='64px "Black Han Sans"';gg.textAlign='center';gg.textBaseline='middle';gg.lineJoin='round';gg.strokeStyle='#3a2410';gg.lineWidth=10;gg.strokeText('지글지글 키친',220,64);gg.fillStyle='#ffe9b0';gg.fillText('지글지글 키친',220,64);},boil()),800,sy+50,{rot:sw,d:5});
   if(lt>1.2){cue('pop',()=>{AU.ding&&AU.ding();});for(let i=0;i<46;i++){const R=mulberry(i+90),tt=lt-1.2,vx=(R()-.5)*900,vy=-300-R()*520,x=800+vx*tt,y=320+vy*tt+520*tt*tt;if(y>1050)continue;
     put(piece('conf'+(i%5),22,14,L=>L(Pp.rect(0,0,22,14),['#e0412a','#f0ae3a','#4f8a4a','#35578f','#fff3dc'][i%5],1),0),x,y,{rot:tt*(R()*14-7),sx:Math.cos(tt*(5+R()*6)),sy:1,d:1});}}
   const fl=clamp((lt-1.9)/.6,0,1),cs=Math.cos(fl*PI);put(cs>0?piece('ready',120,60,(L,gg)=>{L(Pp.rect(0,0,120,60),'#d8d0c0');gg.fillStyle='#5a4a3a';gg.font='30px "Black Han Sans"';gg.textAlign='center';gg.fillText('준비 중',60,42);},0)
     :piece('open',120,60,(L,gg)=>{L(Pp.rect(0,0,120,60),'#fff3dc');gg.fillStyle='#c23a1b';gg.font='30px "Black Han Sans"';gg.textAlign='center';gg.fillText('영업 중',60,42);},0),920,575,{sx:Math.max(.05,Math.abs(cs)),sy:1,d:2});
   figure('chef',PAL.white,'chef',470,812,{wave:lt>2.2?lt:undefined});
   const w=eo((lt-2.4)/2.2);figure('guest','#4f8a4a','#5a3a24',1700-w*800,812,{walk:lt>2.4&&lt<4.6,flip:true});
   if(lt>4.6){cue('bell',()=>AU.bell&&AU.bell());const s=back((lt-4.6)/.35),yy=560-clamp(lt-4.6,0,2)*40;put(piece('heart',70,64,L=>L(Pp.heart(35,32,28),'#e0415a',1.4),boil()),900,yy,{sx:s,a:clamp(6.9-lt,0,1),d:3});}}},
 {d:4.8,cap:'',draw:lt=>{const g=OPN.g;
   put(piece('titlebg',1640,1040,L=>L(Pp.rect(0,0,1640,1040),'#f1e4ca',0)),800,500,{d:0});
   for(let i=0;i<14;i++){const R=mulberry(i+200),x=R()*1600,y=((R()*1000+lt*(40+R()*50))%1100)-50;put(piece('conf'+(i%5),22,14,L=>L(Pp.rect(0,0,22,14),['#e0412a','#f0ae3a','#4f8a4a','#35578f','#fff3dc'][i%5],1),0),x,y,{rot:lt*(R()*4-2),a:.7,d:1});}
   if(lt>.2){const s=1+(1-back((lt-.2)/.45))*.9;put(sticker('logo1','지글지글',170,'#ffcf5a','#7a2410'),760,400,{rot:-.05,sx:s,d:6});cue('stamp1',()=>AU.chop&&AU.chop('kimchi',600));}
   if(lt>.6){const s=1+(1-back((lt-.6)/.45))*.9;put(sticker('logo2','키친',170,'#fff3dc','#7a2410'),880,590,{rot:-.05,sx:s,d:6});cue('stamp2',()=>AU.chop&&AU.chop('kimchi',1000));}
   if(lt>1.1){const s=back((lt-1.1)/.4);put(sticker('season','2nd SEASON',40,'#ffffff','#c23a1b','"IBM Plex Mono"'),960,720,{rot:-.05,sx:s,d:3});}
   if(lt>1.6){g.save();g.globalAlpha=clamp((lt-1.6)*2,0,1);g.font='56px "Nanum Pen Script", "Gowun Dodum", sans-serif';g.textAlign='center';g.fillStyle=PAL.ink;g.fillText('사장님, 영업 준비되셨나요?',800,860);g.restore();}}},
];
const OTOT=OSC.reduce((s,c)=>s+c.d,0);
function opScene(t){let a=0;for(let i=0;i<OSC.length;i++){if(t<a+OSC[i].d)return[i,t-a,a];a+=OSC[i].d;}return[OSC.length-1,OSC[OSC.length-1].d,a];}
function opDraw(){const g=OPN.g,S=OPN.S,t=OPN.t;g.setTransform(S,0,0,S,0,0);g.fillStyle='#f1e4ca';g.fillRect(0,0,1600,1000);
  const [i,lt]=opScene(t);OSC[i].draw(lt);caption(OSC[i].cap,lt,OSC[i].d);
  // paper sweep between scenes
  let a=0;for(let k=0;k<OSC.length-1;k++){a+=OSC[k].d;const p=(t-(a-.5))/1;if(p>0&&p<1){put(piece('wipe',1900,1160,L=>L(Pp.rect(0,0,1900,1160),'#e7d7b8',6),boil()),2600-p*3600,500,{d:8,rot:-.03});}}
  // film: grain + vignette + fade in/out
  g.save();g.globalAlpha=.35;g.fillStyle=g.createPattern(paperGrain(),'repeat');g.fillRect(0,0,1600,1000);g.restore();
  const vg=g.createRadialGradient(800,500,420,800,500,980);vg.addColorStop(0,'rgba(40,20,5,0)');vg.addColorStop(1,'rgba(40,20,5,.38)');g.fillStyle=vg;g.fillRect(0,0,1600,1000);
  const f=Math.max(clamp(1-t/.6,0,1),clamp((t-(OTOT-.7))/.7,0,1));if(f>0){g.fillStyle=`rgba(20,12,8,${f})`;g.fillRect(0,0,1600,1000);}}
function opLoop(now){if(!OPN.on)return;const dt=Math.min(.05,(now-(OPN.last||now))/1000);OPN.last=now;OPN.t+=dt;if(OPN.t>=OTOT){opEnd();return;}opDraw();OPN.raf=requestAnimationFrame(opLoop);}
function playOpening(done){let d=$('#opening');if(!d){d=document.createElement('div');d.id='opening';d.innerHTML='<canvas id="opCv"></canvas><button type="button" id="opSkip">건너뛰기 ▸▸</button><span class="op-hint">클릭하면 다음 장면</span>';$('#stage').appendChild(d);
    $('#opSkip').onclick=e=>{e.stopPropagation();opEnd();};d.addEventListener('click',()=>{if(!OPN.on)return;let a=0;for(const c of OSC){a+=c.d;if(OPN.t<a-.5){OPN.t=a-.5;break;}}});}
  OPN.S=Math.min(2,Math.max(1,devicePixelRatio||1));const cv=$('#opCv');cv.width=1600*OPN.S;cv.height=1000*OPN.S;OPN.g=cv.getContext('2d');
  OPN.on=true;OPN.t=0;OPN.last=0;OPN.cues={};OPN.done=done;d.hidden=false;if(G&&G.started)G.paused=true;
  try{document.fonts&&document.fonts.load('54px "Nanum Pen Script"');}catch(e){}cancelAnimationFrame(OPN.raf);OPN.raf=requestAnimationFrame(opLoop);}
function opEnd(){if(!OPN.on)return;OPN.on=false;cancelAnimationFrame(OPN.raf);const d=$('#opening');if(d)d.hidden=true;if(G&&G.started)G.paused=false;SAVE.openingSeen=true;writeSave();const f=OPN.done;OPN.done=null;f&&f();}
addEventListener('keydown',e=>{if(!OPN.on)return;if(e.code==='Escape'||e.code==='Enter'||e.code==='Space'){e.preventDefault();e.stopImmediatePropagation();opEnd();}},true);
/* first ever shift: play the opening, then open the kitchen */
startCareer=(orig=>function(){if(SAVE&&!SAVE.openingSeen&&!(SAVE.served>0)&&SAVE.day===1&&!SAVE.mid&&!OPN.on){hideAll();$('#title').hidden=true;playOpening(()=>orig());return;}orig();})(startCareer);
/* and it can be watched again from settings */
openSettings=(orig=>function(){orig();const s=$('#setPanel .set-body section:last-child');if(s&&!s.querySelector('#setOpening')){const b=document.createElement('button');b.type='button';b.id='setOpening';b.className='btn2';b.textContent='🎬 오프닝 다시 보기';b.onclick=()=>{closeSettings();playOpening(null);};s.appendChild(b);}})(openSettings);
