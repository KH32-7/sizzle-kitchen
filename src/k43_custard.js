
/* ---------- 2.1.3 egg bowl you can see: cracked eggs sit as yolks in their whites, water pools around them,
   stirring breaks the yolks into swirls until the whole bowl turns one smooth pale yellow ---------- */
/* cracked eggs (white + yolk) drifting in the bowl; beating breaks the yolks into streaks */
function drawEggBits(g,c,fr,m,sw){const eggs=Math.round(c.egg);
  const R2=mulberry(31);for(let i=0;i<eggs;i++){const a0=R2()*TAU,r0=(.15+R2()*.45)*fr,a=a0+sw*(.6+i*.07),x=Math.cos(a)*r0*(1-m*.4),y=Math.sin(a)*r0*(1-m*.4);
    const wa=Math.max(0,.85-m*1.3);if(wa>0){g.fillStyle=`rgba(252,250,238,${wa})`;g.beginPath();for(let k=0;k<=18;k++){const t=k/18*TAU,rr2=22*(1+.18*Math.sin(t*3+i*1.7))*(1+m*.6);g.lineTo(x+Math.cos(t)*rr2,y+Math.sin(t)*rr2*.9);}g.closePath();g.fill();}
    const ya=Math.max(0,1-m*1.6),yr=11*(1-m*.5);if(ya>0){g.globalAlpha=ya;const yg=g.createRadialGradient(x-3,y-3,1,x,y,yr);yg.addColorStop(0,'#ffd257');yg.addColorStop(1,'#ef9a12');g.fillStyle=yg;g.beginPath();g.arc(x,y,yr,0,TAU);g.fill();
      g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(x-yr*.35,y-yr*.4,yr*.32,yr*.2,-.6,0,TAU);g.fill();g.globalAlpha=1;}
    // broken yolk trails curling after the whisk
    if(m>.12&&m<.9){const ta=Math.sin((m-.12)/.78*PI)*.85;g.strokeStyle=`rgba(242,166,30,${ta})`;g.lineCap='round';for(let k=0;k<3;k++){g.lineWidth=5-k*1.3;const rr3=r0*(.4+k*.25);g.beginPath();g.arc(0,0,Math.max(6,rr3),a+k*.9,a+k*.9+1.3+m);g.stroke();}}}
}
function drawEggWater(g,c){const R=c.r,m=clamp(c.mixv||0,0,1),eggs=Math.round(c.egg),vol=c.water+c.egg*50,fr=Math.min(R-6,20+Math.sqrt(vol)*2.1);
  c._sw=(c._sw||0)+Math.max(0,m-(c._pm||0))*18;c._pm=m;const sw=c._sw;
  // the liquid: clear-ish water that turns custard yellow as the eggs are beaten in
  if(c.water>0||m>.05){const base=mix([232,236,228],[247,211,110],Math.min(1,m*1.05+(eggs&&c.water<30?.35:0)));
    const gr=g.createRadialGradient(-fr*.3,-fr*.35,4,0,0,fr);gr.addColorStop(0,rgba(mix(base,[255,252,236],.35),.95));gr.addColorStop(1,rgba(mix(base,[200,170,90],.12),.95));
    g.fillStyle=gr;g.beginPath();g.arc(0,0,fr,0,TAU);g.fill();g.strokeStyle=`rgba(255,255,255,${.35+.2*(1-m)})`;g.lineWidth=2;g.beginPath();g.arc(0,0,fr-3,PI*1.1,PI*1.55);g.stroke();}
  drawEggBits(g,c,fr,m,sw);
  // a beaten bowl gets a fine froth on top
  if(m>.45&&eggs){const R3=mulberry(77),n=Math.round((m-.45)*70);for(let i=0;i<n;i++){const a=R3()*TAU+sw*.2,r=(.55+R3()*.42)*fr;g.fillStyle=`rgba(255,253,240,${.5+R3()*.4})`;g.beginPath();g.arc(Math.cos(a)*r,Math.sin(a)*r,1+R3()*2.4,0,TAU);g.fill();}}
  if(c.salt>0){const R4=mulberry(5);g.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<Math.min(25,c.salt*20);i++){const a=R4()*TAU,r=R4()*fr*.8;g.fillRect(Math.cos(a)*r,Math.sin(a)*r,1.5,1.5);}}}
drawMix=(orig=>function(g,c,x,y){if(!(c.egg>0&&!(c.flour>0))){orig(g,c,x,y);if(c.egg>0&&c.flour>0){const R=c.r,vol=batterVol(c),fr=c.water<5?Math.min(R-6,Math.sqrt(c.flour)*5+8):Math.min(R-4,Math.sqrt(vol*30)+10),m=c.water<5?0:clamp(c.mixv||0,0,1);c._sw=(c._sw||0)+Math.max(0,m-(c._pm||0))*18;c._pm=m;g.save();g.translate(x,y);drawEggBits(g,c,fr,m,c._sw);g.restore();}return;}g.save();g.translate(x,y);drawEggWater(g,c);
  g.fillStyle='rgba(40,30,20,.75)';g.font='11px "Jua", sans-serif';g.textAlign='center';g.fillText(`계란 ${Math.round(c.egg)}개${c.water>0?` · 물 ${Math.round(c.water)}ml`:''}${c.mixv>.6?' · 잘 풀림':c.mixv>.15?' · 푸는 중':''}`,0,c.r+52);g.restore();})(drawMix);
/* things you carry that had no picture under the cursor */
drawHeld=(orig=>function(){orig();const h=G.held;if(!h)return;const g=ctx,x=M.x,y=M.y;
  if(h.kind==='custard'){g.save();g.translate(x,y);drawCustard(g,h.cu,34,true);g.restore();}
  else if(h.kind==='begg'){g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(x+8,y+12,14,11,0,0,TAU);g.fill();drawBegg(g,h.egg,x,y);}
  else if(h.kind==='steamerItem'){g.save();g.translate(x,y);g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.arc(8,12,50,0,TAU);g.fill();g.fillStyle='#c9995a';g.beginPath();g.arc(0,0,50,0,TAU);g.fill();
    g.strokeStyle='#8a5a28';g.lineWidth=3;g.beginPath();g.arc(0,0,44,0,TAU);g.stroke();g.strokeStyle='rgba(120,80,30,.45)';g.lineWidth=1.5;for(let i=-3;i<=3;i++){g.beginPath();g.moveTo(i*11,-40);g.lineTo(i*11,40);g.stroke();g.beginPath();g.moveTo(-40,i*11);g.lineTo(40,i*11);g.stroke();}g.restore();}})(drawHeld);
/* chopsticks: press on a piece in the batter bowl / frying pot and drag it out — it comes with you (quick click still works) */
let CHD=null;
cv.addEventListener('pointerdown',()=>{CHD=G&&G.started&&G.tool==='chop'&&!G.held?{x:M.x,y:M.y,pick:false}:null;},true);
addEventListener('pointermove',()=>{if(!CHD||CHD.pick||!G||G.held||G.tool!=='chop'||!G.drag||G.drag.kind!=='spat')return;const c=G.spat.c;if(!c||!(c.kind==='mix'||c.cook))return;
  if(Math.hypot(M.x-c.x,M.y-c.y)<c.r*1.05)return;const lx=CHD.x-c.x,ly=CHD.y-c.y;let best=null,bd=1e9;for(const o of c.items){if(o.kind!=='piece')continue;const d=Math.hypot(o.x-lx,o.y-ly);if(d<Math.max(32,o.r)&&d<bd){bd=d;best=o;}}
  if(!best)return;c.items.splice(c.items.indexOf(best),1);if(c.kind==='mix')coatBatter(c,best);best.x=M.x;best.y=M.y;best.flipT=0;if(best.L)best.offT=G.t;
  G.held={kind:'ing',id:best.type,piece:best,src:null,tongs:1};G.spat.down=false;G.drag=null;CHD.pick=true;AU.pick();});
addEventListener('pointerup',()=>{if(CHD&&CHD.pick&&G&&G.held){const x=M.x,y=M.y;setTimeout(()=>{if(G.held&&G.held.tongs)useHeld(x,y);},0);}CHD=null;});
/* panko only sticks to something already dipped in batter — say so instead of silently missing */
let PANKO_T=-99;
pankoLand=(orig=>function(f){const r=orig(f);if(r||!G||G.t-PANKO_T<2.5)return r;const bp=inBoard(f.x,f.y)?boardPieceAt(f.x,f.y):null;
  if(bp&&!bp.bat&&ING[bp.type]){PANKO_T=G.t;floatText('튀김옷(반죽)을 먼저 입혀야 빵가루가 붙어요',f.x,f.y-40,'#ffd0b0',20);}return r;})(pankoLand);
