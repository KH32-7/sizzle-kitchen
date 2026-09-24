
/* ---------- pantry & bottles ---------- */
const BOT={
  oil:{w:42,body:'rgba(240,196,70,.9)',cap:'#e8a21a',label:'식용유',lab:'#fff4d6',ink:'#8a5a0a',rate:45},
  olive:{w:34,body:'rgba(64,86,26,.95)',cap:'#1e2a14',label:'올리브',lab:'#efe8c8',ink:'#3a4a10',rate:12},
  soy:{w:40,body:'#2b1a10',cap:'#c3281a',label:'진간장',lab:'#f0e2c0',ink:'#7a1c10',rate:9},
  ses:{w:34,body:'rgba(140,72,18,.94)',cap:'#caa04a',label:'참기름',lab:'#f5e6c4',ink:'#6a3a10',rate:5},
  tsuyu:{w:38,body:'#3a2414',cap:'#e8e0d0',label:'쯔유',lab:'#f3ead6',ink:'#402010',rate:8},
  shoyu:{w:38,body:'#1c120c',cap:'#a01818',label:'쇼유',lab:'#efe4d0',ink:'#801010',rate:8},
  ysauce:{w:40,body:'#4a2616',cap:'#f0c030',label:'야키소바',lab:'#f8e8b0',ink:'#4a2616',rate:7,sq:1},
  bibim:{w:40,body:'#b8261a',cap:'#2a2a2a',label:'비빔장',lab:'#fbe6d0',ink:'#8a1a10',rate:6,sq:1},
  tomato:{w:48,body:'#a82418',cap:'#d8d0c0',label:'토마토',lab:'#f7ecd8',ink:'#8a1a10',rate:8,jar:1},
  water:{w:50,body:'rgba(190,222,242,.5)',cap:'#6aa0d0',label:'물',lab:'rgba(255,255,255,.7)',ink:'#2a5a80',rate:45,pitcher:1},
  anchovy:{w:46,body:'#f1e6c8',cap:'#3a6ab0',label:'멸치육수',lab:'#3a6ab0',ink:'#fff',rate:30,carton:1},
  kbroth:{w:46,body:'#f4e2d8',cap:'#c03020',label:'김치말이',lab:'#c03020',ink:'#fff',rate:30,carton:1},
  rstock:{w:46,body:'#efe2cc',cap:'#7a3a18',label:'라멘육수',lab:'#7a3a18',ink:'#fff',rate:30,carton:1},
  vinegar:{w:34,body:'rgba(238,230,196,.78)',cap:'#3a8a3a',label:'식초',lab:'#f4f2e2',ink:'#2a6a2a',rate:6},
  dashi:{w:46,body:'#f3ecd8',cap:'#2a2a2a',label:'다시',lab:'#2a2a2a',ink:'#f3ecd8',rate:30,carton:1},
};
const SHK={chili:{n:'고춧가루',fill:'#b52a18',dot:'#e0552c',rate:2.2},salt:{n:'소금',fill:'#f4f4f0',dot:'#d8d8d8',rate:4},pepper:{n:'후추',fill:'#3a3430',dot:'#6a605a',rate:.8},
  sesame:{n:'통깨',fill:'#e6d3a0',dot:'#fff4d8',rate:1.6},gim:{n:'김가루',fill:'#1f2a1c',dot:'#3f5a36',rate:1.5},shichimi:{n:'시치미',fill:'#c0501c',dot:'#2a2a2a',rate:1.2},
  aonori:{n:'아오노리',fill:'#3a6a2a',dot:'#6a9a4a',rate:1.2},parm:{n:'파마산',fill:'#f2e6b8',dot:'#d8c890',rate:2},parsley:{n:'파슬리',fill:'#3a7a2a',dot:'#6aaa4a',rate:1},sugar:{n:'설탕',fill:'#fbfaf4',dot:'#ffffff',rate:3}};
const PANTRY=[
  {id:'oil',x:182,row:1,kind:'bottle'},{id:'olive',x:246,row:1,kind:'bottle'},{id:'soy',x:308,row:1,kind:'bottle'},{id:'ses',x:368,row:1,kind:'bottle'},
  {id:'tsuyu',x:428,row:1,kind:'bottle'},{id:'shoyu',x:488,row:1,kind:'bottle'},{id:'ysauce',x:550,row:1,kind:'bottle'},{id:'bibim',x:612,row:1,kind:'bottle'},
  {id:'tomato',x:676,row:1,kind:'bottle'},{id:'water',x:746,row:1,kind:'bottle'},
  {id:'flour',x:828,row:1,kind:'powder',n:'부침가루'},{id:'somyeon',x:912,row:1,kind:'noodle',nt:'somyeon',n:'소면'},{id:'ramyeon',x:996,row:1,kind:'noodle',nt:'ramyeon',n:'라면'},
  {id:'spaghetti',x:1080,row:1,kind:'noodle',nt:'spaghetti',n:'스파게티'},{id:'nori',x:1164,row:1,kind:'nori',n:'김'},
  ...['chili','salt','pepper','sesame','gim','shichimi','aonori','parm','parsley','sugar'].map((id,i)=>({id,x:182+i*66,row:2,kind:'shaker'})),{id:'vinegar',x:852,row:2,kind:'bottle'},
];
for(const p of PANTRY){if(p.kind==='bottle')p.n=BOT[p.id].label.replace('야키소바','야키소바 소스');if(p.kind==='shaker')p.n=SHK[p.id].n;}

function drawBottle(g,id){const b=BOT[id],w=b.w;
  if(b.carton){rr(g,-w/2,-6,w,120,4);g.fillStyle=b.body;g.fill();g.fillStyle='rgba(0,0,0,.08)';g.fillRect(w/2-10,-6,10,120);g.beginPath();g.moveTo(-w/2,-6);g.lineTo(0,-24);g.lineTo(w/2,-6);g.closePath();g.fillStyle='#e8dcc0';g.fill();rr(g,-6,-18,12,8,2);g.fillStyle=b.cap;g.fill();
    g.fillStyle=b.lab;g.fillRect(-w/2,40,w,38);g.fillStyle=b.ink;g.font='12px "Black Han Sans", sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(b.label,0,59);g.textBaseline='alphabetic';return;}
  if(b.pitcher){g.beginPath();g.moveTo(-18,0);g.lineTo(14,0);g.lineTo(26,28);g.lineTo(26,126);g.quadraticCurveTo(26,132,20,132);g.lineTo(-20,132);g.quadraticCurveTo(-26,132,-26,126);g.lineTo(-26,28);g.closePath();g.fillStyle=b.body;g.fill();g.strokeStyle='rgba(120,170,210,.8)';g.lineWidth=2;g.stroke();
    g.fillStyle='rgba(120,180,230,.35)';g.fillRect(-24,50,48,80);g.strokeStyle='rgba(120,170,210,.8)';g.lineWidth=5;g.beginPath();g.moveTo(-26,40);g.quadraticCurveTo(-46,70,-26,104);g.stroke();
    g.fillStyle='rgba(40,90,130,.8)';g.font='600 9px "IBM Plex Mono", monospace';g.textAlign='left';for(let k=0;k<4;k++){g.fillRect(14,60+k*18,8,1.2);}g.textAlign='center';g.fillStyle=b.ink;g.font='13px "Black Han Sans", sans-serif';g.fillText('물',0,44);return;}
  if(b.jar){rr(g,-w/2,10,w,120,12);g.fillStyle=b.body;g.fill();rr(g,-w/2+4,-4,w-8,18,4);g.fillStyle=b.cap;g.fill();g.fillStyle=b.lab;g.fillRect(-w/2,50,w,40);g.fillStyle=b.ink;g.font='12px "Black Han Sans", sans-serif';g.textAlign='center';g.fillText(b.label,0,75);
    const hl=g.createLinearGradient(-w/2,0,w/2,0);hl.addColorStop(.15,'rgba(255,255,255,.3)');hl.addColorStop(.35,'rgba(255,255,255,0)');g.fillStyle=hl;g.fillRect(-w/2,10,w,120);return;}
  const nw=b.sq?9:7;g.beginPath();g.moveTo(-nw,0);g.lineTo(nw,0);g.lineTo(nw,20);g.quadraticCurveTo(w/2,26,w/2,44);g.lineTo(w/2,124);g.quadraticCurveTo(w/2,132,w/2-8,132);g.lineTo(-w/2+8,132);g.quadraticCurveTo(-w/2,132,-w/2,124);g.lineTo(-w/2,44);g.quadraticCurveTo(-w/2,26,-nw,20);g.closePath();
  g.fillStyle=b.body;g.fill();const hl=g.createLinearGradient(-w/2,0,w/2,0);hl.addColorStop(0,'rgba(255,255,255,.08)');hl.addColorStop(.25,'rgba(255,255,255,.4)');hl.addColorStop(.4,'rgba(255,255,255,.06)');hl.addColorStop(1,'rgba(0,0,0,.2)');g.fillStyle=hl;g.fill();
  g.fillStyle=b.lab;g.fillRect(-w/2,62,w,36);g.fillStyle=b.ink;g.font=(b.label.length>3?'11px':'13px')+' "Black Han Sans", sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(b.label,0,80);g.textBaseline='alphabetic';
  if(b.sq){g.beginPath();g.moveTo(-6,-2);g.lineTo(6,-2);g.lineTo(2,-18);g.lineTo(-2,-18);g.closePath();g.fillStyle=b.cap;g.fill();}else{rr(g,-9,-12,18,13,3);g.fillStyle=b.cap;g.fill();}}
function drawShaker(g,id){const s=SHK[id];rr(g,-20,0,40,58,8);g.fillStyle='rgba(235,240,245,.25)';g.fill();
  g.save();rr(g,-18,10,36,46,6);g.clip();g.fillStyle=s.fill;g.fillRect(-18,10,36,46);const R=mulberry(id.length*7);for(let i=0;i<50;i++){g.fillStyle=s.dot;g.fillRect(-18+R()*36,10+R()*46,1.6,1.2);}g.restore();
  rr(g,-20,0,40,58,8);const hl=g.createLinearGradient(-20,0,20,0);hl.addColorStop(.1,'rgba(255,255,255,.35)');hl.addColorStop(.3,'rgba(255,255,255,0)');g.fillStyle=hl;g.fill();
  g.fillStyle='#f3ead8';g.fillRect(-20,28,40,15);g.fillStyle='#4a2a18';g.font=(s.n.length>3?'9px':'10.5px')+' "Black Han Sans", sans-serif';g.textAlign='center';g.fillText(s.n,0,39.5);
  rr(g,-22,-11,44,13,4);g.fillStyle='#8b8f94';g.fill();g.fillStyle='#3a3c40';for(let i=-2;i<=2;i++){g.beginPath();g.arc(i*7,-4.5,1.4,0,TAU);g.fill();}}
function drawPack(g,id){
  if(id==='flour'){g.beginPath();g.moveTo(-30,-40);g.lineTo(30,-40);g.lineTo(34,44);g.lineTo(-34,44);g.closePath();g.fillStyle='#f4efe2';g.fill();g.fillStyle='#d9432a';g.fillRect(-32,-6,64,26);g.fillStyle='#fff';g.font='12px "Black Han Sans", sans-serif';g.textAlign='center';g.fillText('부침가루',0,12);g.fillStyle='#e8dcc4';g.fillRect(-30,-44,60,8);return;}
  if(id==='somyeon'){rr(g,-16,-46,32,92,6);g.fillStyle='#f6f1e4';g.fill();g.strokeStyle='rgba(180,170,150,.5)';for(let i=-12;i<=12;i+=3){g.beginPath();g.moveTo(i,-44);g.lineTo(i,44);g.stroke();}g.fillStyle='#2b5aa0';g.fillRect(-18,-12,36,24);g.fillStyle='#fff';g.font='11px "Black Han Sans", sans-serif';g.textAlign='center';g.fillText('소면',0,4);return;}
  if(id==='ramyeon'){rr(g,-30,-36,60,72,5);g.fillStyle='#e8541e';g.fill();g.fillStyle='#ffd23a';g.font='16px "Black Han Sans", sans-serif';g.textAlign='center';g.fillText('라면',0,2);g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=1.5;for(let i=0;i<3;i++){g.beginPath();g.arc(0,20,6+i*4,PI,TAU);g.stroke();}return;}
  if(id==='spaghetti'){rr(g,-20,-46,40,92,3);g.fillStyle='#1f4fa0';g.fill();g.fillStyle='#f3e2a8';g.fillRect(-14,-30,28,40);g.strokeStyle='#d6b86a';for(let i=-12;i<=12;i+=3){g.beginPath();g.moveTo(i,-28);g.lineTo(i,8);g.stroke();}g.fillStyle='#fff';g.font='9px "Black Han Sans", sans-serif';g.textAlign='center';g.fillText('SPAGHETTI',0,28);return;}
  if(id==='nori'){for(let i=0;i<3;i++){rr(g,-26+i*3,-30+i*4,52,60,2);g.fillStyle=i===2?'#1e2a1c':'#2a3826';g.fill();}g.fillStyle='rgba(120,160,110,.25)';for(let i=0;i<30;i++)g.fillRect(-20+Math.random()*40,-22+Math.random()*50,1.5,1.5);return;}}
function drawPantryItem(g,p,y){g.save();
  if(p.kind==='bottle'){g.translate(p.x,y-78);g.scale(.62,.62*.86);g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(4,134,26,7,0,0,TAU);g.fill();drawBottle(g,p.id);}
  else if(p.kind==='shaker'){g.translate(p.x,y-40);g.scale(.78,.78*.86);g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(3,60,22,6,0,0,TAU);g.fill();drawShaker(g,p.id);}
  else{g.translate(p.x,y-40);g.scale(.86,.86*.86);g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.ellipse(4,46,34,8,0,0,TAU);g.fill();drawPack(g,p.id);}
  g.restore();}

/* ---------- static scene ---------- */
let BG=null,GRATE=null;
const MARKS=mk(L.board.w*2,L.board.h*2),MX=MARKS.getContext('2d');MX.scale(2,2);
const STAIN=mk(W,H),STX=STAIN.getContext('2d');
function steelDisc(g,x,y,r,dark){const gr=g.createRadialGradient(x-r*.3,y-r*.35,r*.1,x,y,r);gr.addColorStop(0,dark?'#6a6e74':'#e4e7ea');gr.addColorStop(1,dark?'#2a2c30':'#8a8f95');g.fillStyle=gr;g.beginPath();g.arc(x,y,r,0,TAU);g.fill();}
function drawBG(g){const R=mulberry(7);
  g.fillStyle=decoCounter();g.fillRect(0,0,W,H);let lg=g.createLinearGradient(0,0,W,H);lg.addColorStop(0,'rgba(255,255,255,.2)');lg.addColorStop(1,'rgba(0,0,0,.14)');g.fillStyle=lg;g.fillRect(0,0,W,H);
  for(let i=0;i<7000;i++){g.fillStyle=R()<.5?`rgba(90,80,70,${R()*.22})`:`rgba(255,255,255,${R()*.35})`;const s=R()*2.2+.3;g.fillRect(R()*W,R()*H,s,s);}
  g.lineCap='round';for(let i=0;i<8;i++){g.strokeStyle=`rgba(140,128,112,${.05+R()*.08})`;g.lineWidth=1+R()*2.5;g.beginPath();let x=R()*W,y=R()*H;g.moveTo(x,y);for(let k=0;k<5;k++){const nx=x+(R()-.3)*380,ny=y+(R()-.5)*260;g.quadraticCurveTo((x+nx)/2+(R()-.5)*120,(y+ny)/2+(R()-.5)*120,nx,ny);x=nx;y=ny;}g.stroke();}decoCounterFx(g,R);
  // right pass (serving counter)
  lg=g.createLinearGradient(1244,0,1600,0);{const PC=decoPass();lg.addColorStop(0,PC[0]);lg.addColorStop(1,PC[1]);}g.fillStyle=lg;g.fillRect(1244,44,356,H);
  for(let i=0;i<40;i++){const x=1244+R()*356;g.strokeStyle=`rgba(${R()<.5?'0,0,0':'255,220,180'},${.04+R()*.06})`;g.lineWidth=1+R()*2;g.beginPath();g.moveTo(x,44);g.lineTo(x+R()*6-3,H);g.stroke();}
  g.fillStyle='rgba(0,0,0,.35)';g.fillRect(1244,44,4,H);decoPassFx(g);
  g.fillStyle='#8b8f94';g.fillRect(1256,58,332,6);g.fillStyle='rgba(255,255,255,.3)';g.fillRect(1256,58,332,1.5);
  // shelf plank (two tiers)
  const sh=228;lg=g.createLinearGradient(0,44,0,sh);{const SC=decoShelf();lg.addColorStop(0,SC[0]);lg.addColorStop(1,SC[1]);}g.fillStyle=lg;g.fillRect(0,44,1244,sh-44);
  for(let i=0;i<70;i++){const y=44+R()*(sh-44);g.strokeStyle=R()<.5?`rgba(25,14,8,${.12+R()*.14})`:`rgba(255,215,170,${.03+R()*.05})`;g.lineWidth=.6+R()*1.6;g.beginPath();g.moveTo(0,y);for(let x=0;x<=1244;x+=80)g.lineTo(x,y+Math.sin(x*.004+i)*4);g.stroke();}
  g.fillStyle='#6d4b35';g.fillRect(150,150,1094,6);g.fillStyle='rgba(255,220,180,.18)';g.fillRect(150,150,1094,1.5);
  g.fillStyle='#6d4b35';g.fillRect(0,sh-10,1244,10);g.fillStyle='rgba(255,220,180,.18)';g.fillRect(0,sh-10,1244,1.5);
  lg=g.createLinearGradient(0,sh,0,sh+22);lg.addColorStop(0,'rgba(0,0,0,.35)');lg.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=lg;g.fillRect(0,sh,1244,22);
  // fridge
  const F=L.fridge;g.save();g.shadowColor='rgba(0,0,0,.45)';g.shadowBlur=16;g.shadowOffsetY=6;rr(g,F.x,F.y,F.w,F.h,10);g.fillStyle='#dfe4e8';g.fill();g.restore();
  lg=g.createLinearGradient(F.x,0,F.x+F.w,0);lg.addColorStop(0,'#f1f4f6');lg.addColorStop(.6,'#d6dce1');lg.addColorStop(1,'#b8c0c7');rr(g,F.x,F.y,F.w,F.h,10);g.fillStyle=lg;g.fill();
  g.strokeStyle='rgba(60,70,80,.35)';g.lineWidth=1.5;g.beginPath();g.moveTo(F.x+6,F.y+62);g.lineTo(F.x+F.w-6,F.y+62);g.stroke();
  rr(g,F.x+F.w-18,F.y+14,7,40,3);g.fillStyle='#8a939b';g.fill();rr(g,F.x+F.w-18,F.y+72,7,80,3);g.fill();
  g.fillStyle='#4a5560';g.font='15px "Black Han Sans", sans-serif';g.textAlign='center';g.fillText('냉장고',F.x+F.w/2-8,F.y+118);
  g.fillStyle='rgba(60,120,180,.8)';g.font='600 10px "IBM Plex Mono", monospace';g.fillText('3°C',F.x+F.w/2-8,F.y+38);
  // rack
  const K=L.rack;g.save();g.shadowColor='rgba(0,0,0,.3)';g.shadowBlur=14;g.shadowOffsetY=6;rr(g,K.x,K.y,K.w,K.h,12);g.fillStyle='#4f3526';g.fill();g.restore();
  lg=g.createLinearGradient(0,K.y,0,K.y+K.h);lg.addColorStop(0,'#6b4a35');lg.addColorStop(1,'#3f2a1e');rr(g,K.x,K.y,K.w,K.h,12);g.fillStyle=lg;g.fill();
  lg=g.createLinearGradient(0,K.y+20,0,K.y+40);lg.addColorStop(0,'#1a1b1d');lg.addColorStop(.5,'#2e3033');lg.addColorStop(1,'#141516');g.fillStyle=lg;rr(g,K.x+12,K.y+20,K.w-24,20,4);g.fill();
  // prep bowls
  for(const p of L.prep){g.fillStyle='rgba(0,0,0,.28)';g.beginPath();g.arc(p.x+4,p.y+7,p.r,0,TAU);g.fill();const gr=g.createRadialGradient(p.x-12,p.y-14,3,p.x,p.y,p.r);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#cfcac0');g.fillStyle=gr;g.beginPath();g.arc(p.x,p.y,p.r,0,TAU);g.fill();g.fillStyle='#ece8e0';g.beginPath();g.arc(p.x,p.y,p.r*.78,0,TAU);g.fill();}
  // mixing bowl
  const Mb=L.mix;g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.arc(Mb.x+6,Mb.y+9,Mb.r+4,0,TAU);g.fill();steelDisc(g,Mb.x,Mb.y,Mb.r+4);
  let gr=g.createRadialGradient(Mb.x+20,Mb.y+24,5,Mb.x,Mb.y,Mb.r);gr.addColorStop(0,'#f2f4f6');gr.addColorStop(.6,'#b8bec4');gr.addColorStop(1,'#7c838a');g.fillStyle=gr;g.beginPath();g.arc(Mb.x,Mb.y,Mb.r-4,0,TAU);g.fill();
  g.fillStyle='rgba(60,50,40,.7)';g.font='600 12px "Gowun Dodum", sans-serif';g.textAlign='center';g.fillText('반죽 볼',Mb.x,Mb.y+Mb.r+20);
  // sink
  const Sk=L.sink;g.save();g.shadowColor='rgba(0,0,0,.3)';g.shadowBlur=10;rr(g,Sk.x,Sk.y,Sk.w,Sk.h,16);g.fillStyle='#b9bec3';g.fill();g.restore();
  gr=g.createLinearGradient(Sk.x,Sk.y,Sk.x,Sk.y+Sk.h);gr.addColorStop(0,'#6d737a');gr.addColorStop(1,'#9aa1a8');rr(g,Sk.x+14,Sk.y+30,Sk.w-28,Sk.h-44,14);g.fillStyle=gr;g.fill();
  g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=2;g.stroke();for(let i=0;i<14;i++){g.strokeStyle='rgba(255,255,255,.04)';g.beginPath();g.moveTo(Sk.x+20,Sk.y+40+i*13);g.lineTo(Sk.x+Sk.w-20,Sk.y+40+i*13);g.stroke();}
  g.fillStyle='#4a4f55';g.beginPath();g.arc(Sk.x+Sk.w-50,Sk.y+Sk.h-40,10,0,TAU);g.fill();
  // stove
  const T=L.stove;g.save();g.shadowColor='rgba(0,0,0,.45)';g.shadowBlur=28;g.shadowOffsetY=12;rr(g,T.x,T.y,T.w,T.h,20);g.fillStyle='#111214';g.fill();g.restore();
  g.save();rr(g,T.x,T.y,T.w,T.h,20);g.clip();lg=g.createLinearGradient(T.x,T.y,T.x+T.w,T.y+T.h);lg.addColorStop(0,'#1c1d20');lg.addColorStop(.42,'#101113');lg.addColorStop(.46,'#1d1f23');lg.addColorStop(.5,'#101113');lg.addColorStop(1,'#0c0c0e');g.fillStyle=lg;g.fillRect(T.x,T.y,T.w,T.h);
  g.fillStyle='rgba(255,255,255,.035)';g.fillRect(T.x,T.y+T.h-96,T.w,96);g.fillStyle='rgba(255,255,255,.08)';g.fillRect(T.x+20,T.y+T.h-96,T.w-40,1);g.restore();
  rr(g,T.x+1.5,T.y+1.5,T.w-3,T.h-3,19);g.strokeStyle='#44474d';g.lineWidth=3;g.stroke();
  BURN.forEach((b,i)=>{g.fillStyle='#1b1c1f';g.beginPath();g.arc(b.x,b.y,b.rb+36,0,TAU);g.fill();g.strokeStyle='#2c2e33';g.lineWidth=2;g.stroke();
    const gr2=g.createRadialGradient(b.x-8,b.y-8,4,b.x,b.y,b.rb+8);gr2.addColorStop(0,'#46474b');gr2.addColorStop(1,'#222326');g.fillStyle=gr2;g.beginPath();g.arc(b.x,b.y,b.rb+8,0,TAU);g.fill();
    g.fillStyle='#08080a';for(let k=0;k<36;k++){const a=k/36*TAU;g.beginPath();g.arc(b.x+Math.cos(a)*b.rb,b.y+Math.sin(a)*b.rb,1.7,0,TAU);g.fill();}
    const cg=g.createRadialGradient(b.x-6,b.y-6,2,b.x,b.y,b.rb-12);cg.addColorStop(0,'#5a4e3e');cg.addColorStop(1,'#2a241d');g.fillStyle=cg;g.beginPath();g.arc(b.x,b.y,b.rb-12,0,TAU);g.fill();
    const kx=KNOBX[i];g.fillStyle='#17181b';g.beginPath();g.arc(kx,KNOBY,40,0,TAU);g.fill();
    // mini map
    const mx=kx-12,my=KNOBY+30;for(let q=0;q<4;q++){g.fillStyle=q===i?'#ff8a3d':'rgba(255,255,255,.18)';g.beginPath();g.arc(mx+(q%2)*24,my+(q>1?10:0),3.2,0,TAU);g.fill();}});
  drawPlateBowl(g);
  // trash
  const Tr=L.trash;g.save();g.shadowColor='rgba(0,0,0,.35)';g.shadowBlur=14;g.shadowOffsetY=6;g.fillStyle='#8d9196';g.beginPath();g.arc(Tr.x,Tr.y,Tr.r,0,TAU);g.fill();g.restore();steelDisc(g,Tr.x,Tr.y,Tr.r);
  g.strokeStyle='rgba(40,42,46,.5)';g.lineWidth=2;g.beginPath();g.moveTo(Tr.x-Tr.r*.8,Tr.y-4);g.lineTo(Tr.x+Tr.r*.8,Tr.y-4);g.stroke();g.fillStyle='rgba(40,42,46,.75)';g.font='600 11px "Gowun Dodum", sans-serif';g.textAlign='center';g.fillText('음식물',Tr.x,Tr.y+16);drawBGDeco(g);
}
function drawPlateBowl(g){let pg;
  // plate
  const P=L.plate;g.save();g.shadowColor='rgba(0,0,0,.4)';g.shadowBlur=26;g.shadowOffsetY=12;g.fillStyle='#f2efe8';g.beginPath();g.arc(P.x,P.y,P.r,0,TAU);g.fill();g.restore();
  pg=g.createRadialGradient(P.x-40,P.y-50,10,P.x,P.y,P.r);pg.addColorStop(0,'#ffffff');pg.addColorStop(1,'#e6e2d9');g.fillStyle=pg;g.beginPath();g.arc(P.x,P.y,P.r,0,TAU);g.fill();
  g.strokeStyle='rgba(70,110,120,.45)';g.lineWidth=2.2;g.beginPath();g.arc(P.x,P.y,P.r*.9,0,TAU);g.stroke();
  pg=g.createRadialGradient(P.x,P.y,P.r*.55,P.x,P.y,P.r*.74);pg.addColorStop(0,'rgba(0,0,0,0)');pg.addColorStop(.85,'rgba(0,0,0,.05)');pg.addColorStop(1,'rgba(255,255,255,.5)');g.fillStyle=pg;g.beginPath();g.arc(P.x,P.y,P.r*.74,0,TAU);g.fill();
  // bowl
  const Bw=L.bowl;g.save();g.shadowColor='rgba(0,0,0,.45)';g.shadowBlur=26;g.shadowOffsetY=12;g.fillStyle='#e9e1d2';g.beginPath();g.arc(Bw.x,Bw.y,Bw.r,0,TAU);g.fill();g.restore();
  pg=g.createRadialGradient(Bw.x-30,Bw.y-40,10,Bw.x,Bw.y,Bw.r);pg.addColorStop(0,'#f7f2e8');pg.addColorStop(1,'#d9cfbd');g.fillStyle=pg;g.beginPath();g.arc(Bw.x,Bw.y,Bw.r,0,TAU);g.fill();
  pg=g.createRadialGradient(Bw.x+18,Bw.y+22,Bw.r*.2,Bw.x,Bw.y,Bw.r*.9);pg.addColorStop(0,'#faf6ee');pg.addColorStop(.7,'#e8dfcf');pg.addColorStop(1,'#b9ad98');g.fillStyle=pg;g.beginPath();g.arc(Bw.x,Bw.y,Bw.r*.9,0,TAU);g.fill();
  g.strokeStyle='rgba(40,70,120,.5)';g.lineWidth=3;g.beginPath();g.arc(Bw.x,Bw.y,Bw.r-5,0,TAU);g.stroke();g.lineWidth=1;g.beginPath();g.arc(Bw.x,Bw.y,Bw.r-11,0,TAU);g.stroke();
}
function drawGrates(g){for(const b of BURN){const R=b.rb+(b.rb>50?80:56),r0=b.rb+14;g.lineCap='round';
  for(const pass of [0,1,2]){g.strokeStyle=pass===0?'rgba(0,0,0,.5)':pass===1?'#2b2c30':'rgba(255,255,255,.1)';g.lineWidth=pass===0?13:pass===1?11:2;const o=pass===0?3:pass===2?-2:0;
    g.beginPath();for(let i=0;i<6;i++){const a=i/6*TAU+.26;g.moveTo(b.x+o+Math.cos(a)*r0,b.y+o*1.3+Math.sin(a)*r0);g.lineTo(b.x+o+Math.cos(a)*R,b.y+o*1.3+Math.sin(a)*R);}g.stroke();g.beginPath();g.arc(b.x+o,b.y+o*1.3,R,0,TAU);g.stroke();}}}
function panSprite(r){const R=r+14,c=mk(R*4,R*4),g=c.getContext('2d');g.scale(2,2);g.translate(R,R);
  let gr=g.createLinearGradient(-R,-R,R,R);gr.addColorStop(0,'#a4a8ae');gr.addColorStop(.5,'#4b4e53');gr.addColorStop(1,'#26282b');g.fillStyle=gr;g.beginPath();g.arc(0,0,R-1,0,TAU);g.fill();
  g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=1.5;g.beginPath();g.arc(0,0,R-2,PI*.95,PI*1.55);g.stroke();
  gr=g.createRadialGradient(0,0,r-4,0,0,R-5);gr.addColorStop(0,'#141517');gr.addColorStop(1,'#3b3d42');g.fillStyle=gr;g.beginPath();g.arc(0,0,R-5,0,TAU);g.fill();
  gr=g.createRadialGradient(-r*.25,-r*.3,5,0,0,r);gr.addColorStop(0,'#35373b');gr.addColorStop(1,'#1a1b1e');g.fillStyle=gr;g.beginPath();g.arc(0,0,r,0,TAU);g.fill();
  for(let k=6;k<r;k+=4){g.strokeStyle=`rgba(255,255,255,${.012+Math.random()*.014})`;g.lineWidth=.8;g.beginPath();g.arc(0,0,k,0,TAU);g.stroke();}return c;}
function potSprite(r){const R=r+12,c=mk(R*4,R*4),g=c.getContext('2d');g.scale(2,2);g.translate(R,R);
  let gr=g.createLinearGradient(-R,-R,R,R);gr.addColorStop(0,'#f2f4f6');gr.addColorStop(.45,'#a9b0b7');gr.addColorStop(1,'#5e656c');g.fillStyle=gr;g.beginPath();g.arc(0,0,R-1,0,TAU);g.fill();
  g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=1.2;g.beginPath();g.arc(0,0,R-2.5,PI*1.05,PI*1.6);g.stroke();
  gr=g.createRadialGradient(r*.2,r*.25,r*.1,0,0,r);gr.addColorStop(0,'#d7dce0');gr.addColorStop(.75,'#9aa2a9');gr.addColorStop(1,'#5b6268');g.fillStyle=gr;g.beginPath();g.arc(0,0,r,0,TAU);g.fill();
  for(let k=8;k<r*.7;k+=5){g.strokeStyle=`rgba(255,255,255,${.04+Math.random()*.04})`;g.lineWidth=.8;g.beginPath();g.arc(0,0,k,0,TAU);g.stroke();}return c;}
function drawBoardTo(g){const R=mulberry(21);let lg;
  // cutting board
  const B=L.board;g.save();g.shadowColor='rgba(0,0,0,.35)';g.shadowBlur=24;g.shadowOffsetY=10;rr(g,B.x,B.y,B.w,B.h,18);g.fillStyle='#c28b58';g.fill();g.restore();
  g.save();rr(g,B.x,B.y,B.w,B.h,18);g.clip();lg=g.createLinearGradient(B.x,B.y,B.x+B.w,B.y+B.h);lg.addColorStop(0,'#cf9a66');lg.addColorStop(1,'#b37a48');g.fillStyle=lg;g.fillRect(B.x,B.y,B.w,B.h);
  for(let i=0;i<110;i++){const y=B.y+R()*B.h;g.strokeStyle=R()<.6?`rgba(120,70,30,${.06+R()*.12})`:`rgba(255,225,180,${.05+R()*.08})`;g.lineWidth=.5+R()*2;g.beginPath();g.moveTo(B.x,y);for(let x=B.x;x<=B.x+B.w;x+=40)g.lineTo(x,y+Math.sin(x*.01+i*.7)*3);g.stroke();}g.restore();
  rr(g,B.x+14,B.y+14,B.w-28,B.h-28,10);g.strokeStyle='rgba(90,50,20,.35)';g.lineWidth=3;g.stroke();
}
function buildStatic(){BG=mk(W*PX,H*PX);let g=BG.getContext('2d');g.scale(PX,PX);drawBG(g);GRATE=mk(W*PX,H*PX);g=GRATE.getContext('2d');g.scale(PX,PX);drawGrates(g);buildBoardImg();}
