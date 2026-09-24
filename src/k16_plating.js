
/* ---------- plating: neat noodles · broth · bowl styles · drips · plating mode · hero shot ---------- */
/* udon: thick noodles that wander in loops and fill the bowl */
function udonFill(n,R,mess){mess=mess===undefined?.5:mess;const S=n.strands,cnt=S.length,L0=n.sl;
  S.forEach((s,k)=>{const P=s.pts,m=P.length,T=[];const a0=rand(0,TAU),r0=R*Math.sqrt(rand(0,.85));let x=Math.cos(a0)*r0,y=Math.sin(a0)*r0,th=rand(0,TAU),kap=rand(-.07,.07);
    for(let j=0;j<m;j++){T.push([x,y]);kap=clamp(kap+rand(-.018,.018),-.075,.075);if(Math.random()<.025)kap*=-.6;th+=kap*L0;
      const nx=x+Math.cos(th)*L0,ny=y+Math.sin(th)*L0;if(Math.hypot(nx,ny)>R*.9){const inward=Math.atan2(-y,-x);let d=inward-th;while(d>PI)d-=TAU;while(d<-PI)d+=TAU;th+=d*.55;}
      x+=Math.cos(th)*L0;y+=Math.sin(th)*L0;const r=Math.hypot(x,y);if(r>R*.93){x*=R*.93/r;y*=R*.93/r;}}
    s.nt=T;const sc=1+.35*mess,ox=rand(-14,14)*mess,oy=rand(-14,14)*mess;
    P.forEach((p,j)=>{p.x=T[j][0]*sc+ox+rand(-2,2)*mess;p.y=T[j][1]*sc+oy+rand(-2,2)*mess;p.ox=p.x;p.oy=p.y;});});}
function noodleFill(v){const R=v.r*.8,G2=14;let cells=0,hit=0;const set=new Set();for(const n of v.noodles)for(const s of n.strands)for(const p of s.pts)set.add(Math.floor(p.x/G2)+','+Math.floor(p.y/G2));
  for(let x=-R;x<=R;x+=G2)for(let y=-R;y<=R;y+=G2){if(x*x+y*y>R*R)continue;cells++;if(set.has(Math.floor(x/G2)+','+Math.floor(y/G2)))hit++;}return cells?hit/cells:0;}
function noodleCoil(n){const [cx,cy]=noodleCenter(n);let sum=0,L2=0,rad=0,np=0;for(const s of n.strands){const P=s.pts;for(let i=0;i<P.length-1;i++){const dx=P[i+1].x-P[i].x,dy=P[i+1].y-P[i].y,l=Math.hypot(dx,dy),rx=(P[i].x+P[i+1].x)/2-cx,ry=(P[i].y+P[i+1].y)/2-cy,rr=Math.hypot(rx,ry);
    if(l<.5||rr<10)continue;sum+=Math.abs(dx*ry-dy*rx)/(l*rr)*l;L2+=l;}for(const p of P){rad+=Math.hypot(p.x-cx,p.y-cy);np++;}}return{coil:L2?sum/L2:0,spread:np?rad/np:0,cx,cy};}
function combNoodles(v,lx,ly,moved){let hit=0;for(const n of v.noodles)for(const s of n.strands){if(!s.nt)continue;s.pts.forEach((p,j)=>{const w=clamp(1-Math.hypot(p.x-lx,p.y-ly)/70,0,1)*Math.min(1,moved/90);if(w<=0)return;hit++;p.x+=(s.nt[j][0]-p.x)*w;p.y+=(s.nt[j][1]-p.y)*w;p.ox=p.x;p.oy=p.y;});}return hit;}

/* broth film over noodles: makes them sit IN the soup, with tops catching light */
function drawBrothFilm(g,c,q,R){const vol=q.vol,cap=520,d=Math.min(1,vol/cap),rr2=R*(.5+.5*Math.sqrt(d)),col=liqCol(q),t=G?G.t:0;
  g.save();g.beginPath();g.arc(0,0,rr2,0,TAU);g.clip();
  const thick=c.noodles.some(n=>n.type==='udon'||n.type==='ramen'||n.type==='ramyeon');if(!thick){g.fillStyle=rgba(col,.1+Math.min(.1,liqDark(q)*.15));g.fillRect(-rr2,-rr2,rr2*2,rr2*2);}
  const R2=mulberry((c.id||7)*31+3),nd=thick?0:q.fat>2?26:10;for(let i=0;i<nd;i++){const a=R2()*TAU+t*.02,r=Math.sqrt(R2())*rr2*.9,s=R2()*(q.fat>2?3.2:1.8)+.8,x=Math.cos(a)*r,y=Math.sin(a)*r;
    g.fillStyle='rgba(255,214,120,.28)';g.beginPath();g.arc(x,y,s,0,TAU);g.fill();g.strokeStyle='rgba(255,246,210,.5)';g.lineWidth=.7;g.beginPath();g.arc(x,y,s,PI*1.1,PI*1.7);g.stroke();}
  const sp=g.createRadialGradient(-rr2*.42,-rr2*.46,2,-rr2*.42,-rr2*.46,rr2*.55);sp.addColorStop(0,'rgba(255,255,255,.2)');sp.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=sp;g.fillRect(-rr2,-rr2,rr2*2,rr2*2);
  g.restore();g.strokeStyle='rgba(255,255,255,.4)';g.lineWidth=1.6;g.beginPath();g.arc(0,0,rr2,0,TAU);g.stroke();}

/* bowl styles (per recipe) */
const BOWLSTY={udon:{rim:'#e4d6bc',rim2:'#fbf5ea',edge:'#9a6a3e',in:'#fbf6ec',in2:'#e6d8bd',speck:1,body:['#d8c7a8','#fbf6ec','#e6d8bd','#b89c74'],foot:'#8a5f38',name:'우동 그릇'}};
function bowlStyleFor(v){if(v.kind!=='bowl')return null;const o=typeof selOrder==='function'&&G&&G.orders?selOrder():null,R=o&&RID[o.rid];return R&&R.bowl?BOWLSTY[R.bowl]:null;}
function drawBowlStyle(g,x,y,st,c){const Ro=L.bowl.r,Ri=c.r;
  let gr=g.createRadialGradient(x-Ro*.35,y-Ro*.4,Ro*.1,x,y,Ro);gr.addColorStop(0,st.rim2);gr.addColorStop(1,st.rim);g.fillStyle=gr;g.beginPath();g.arc(x,y,Ro,0,TAU);g.fill();
  g.strokeStyle='rgba(255,236,210,.28)';g.lineWidth=3.5;g.lineCap='round';g.beginPath();g.arc(x,y,Ro-5,PI*1.08,PI*1.52);g.stroke();g.strokeStyle='rgba(255,236,210,.1)';g.beginPath();g.arc(x,y,Ro-5,PI*.1,PI*.35);g.stroke();
  if(st.edge){g.strokeStyle=st.edge;g.lineWidth=4.5;g.beginPath();g.arc(x,y,Ro-2.2,0,TAU);g.stroke();}
  if(st.band){g.strokeStyle=st.band;g.lineWidth=2.2;g.beginPath();g.arc(x,y,(Ro+Ri)/2+1,0,TAU);g.stroke();}
  gr=g.createRadialGradient(x+Ri*.25,y+Ri*.3,Ri*.1,x,y,Ri+2);gr.addColorStop(0,st.in);gr.addColorStop(1,st.in2);g.fillStyle=gr;g.beginPath();g.arc(x,y,Ri+2,0,TAU);g.fill();
  g.save();g.beginPath();g.arc(x,y,Ri+2,0,TAU);g.clip();const sh=g.createLinearGradient(x-Ri,y-Ri,x+Ri*.3,y+Ri*.3);sh.addColorStop(0,'rgba(40,20,10,.3)');sh.addColorStop(.55,'rgba(40,20,10,0)');g.fillStyle=sh;g.fillRect(x-Ri-2,y-Ri-2,Ri*2+4,Ri*2+4);g.restore();
  g.strokeStyle=st.speck?'rgba(120,90,50,.28)':'rgba(20,10,5,.45)';g.lineWidth=1.5;g.beginPath();g.arc(x,y,Ri+2,0,TAU);g.stroke();
  if(st.speck){const R2=mulberry(41);for(let i=0;i<260;i++){const a=R2()*TAU,r=Math.sqrt(R2())*Ro*.99;g.fillStyle=`rgba(${90+R2()*40|0},${60+R2()*30|0},${30+R2()*20|0},${.25+R2()*.35})`;g.beginPath();g.arc(x+Math.cos(a)*r,y+Math.sin(a)*r,.4+R2()*.9,0,TAU);g.fill();}}}

/* drips on the rim */
function addDrip(c,a,col){if(!c.drips)c.drips=[];if(c.drips.length>14)return;c.drips.push({a:a===undefined?rand(0,TAU):a,f:rand(.2,.8),s:rand(.7,1.3),col:col||[150,100,50],rot:rand(-.4,.4)});}
function dripR(c){const Ro=c.kind==='bowl'?L.bowl.r:L.plate.r;return[c.r+3,Ro-5];}
function drawDrips(g,c,x,y){if(!c.drips||!c.drips.length)return;const [r0,r1]=dripR(c);
  for(const d of c.drips){const r=lerp(r0,r1,d.f),px=x+Math.cos(d.a)*r,py=y+Math.sin(d.a)*r;g.save();g.translate(px,py);g.rotate(d.a+PI/2+d.rot);
    g.fillStyle=rgba(d.col,.72);g.beginPath();g.ellipse(0,0,6*d.s,3.4*d.s,0,0,TAU);g.fill();g.beginPath();g.ellipse(2*d.s,2.6*d.s,2.4*d.s,1.6*d.s,.4,0,TAU);g.fill();
    g.fillStyle='rgba(255,255,255,.5)';g.beginPath();g.ellipse(-2*d.s,-1*d.s,1.8*d.s,.8*d.s,0,0,TAU);g.fill();g.restore();}}

/* slicing helper (for reference plates) */
function makeSlices(type,n,th,skip){const p=newPiece(type,0,0);p.rot=0;const xs=p.poly.map(q=>q[0]);let x=Math.min(...xs)+(skip||th*1.5),rest=p.poly;const out=[];
  for(let i=0;i<=n;i++){const lid=CUTID++,A=clipPoly(rest,1,0,x,-1,lid),B=clipPoly(rest,1,0,x,1,lid);if(A.length<3||B.length<3)break;if(i>0){const s=clonePiece(p,A);finalize(s);out.push(s);}rest=B;x+=th;}return out;}

/* ---------- plating evaluation ---------- */
function vPiecesOf(v,t){return v.items.filter(o=>o.kind==='piece'&&(!t||o.type===t));}
function circSpread(list){if(!list.length)return{R:0,ang:0,r:0};let C=0,S2=0,r=0;for(const o of list){const a=Math.atan2(o.y,o.x);C+=Math.cos(a);S2+=Math.sin(a);r+=Math.hypot(o.x,o.y);}return{R:Math.hypot(C,S2)/list.length,ang:Math.atan2(S2,C),r:r/list.length};}
function centroid(list){let x=0,y=0;for(const o of list){x+=o.x;y+=o.y;}return[x/list.length,y/list.length];}
function mainNoodle(v){return v.noodles.reduce((a,b)=>!a||b.g>a.g?b:a,null);}
function grainInfo(v){const gs=v.items.filter(o=>o.kind==='grain');if(!gs.length)return null;const [cx,cy]=centroid(gs);return{n:gs.length,cx,cy,inside:gs.filter(o=>Math.hypot(o.x,o.y)<v.r*.82).length/gs.length};}
function groupOf(v,types){return v.items.filter(o=>o.kind==='piece'&&types.includes(o.type));}
function compactAt(list,x,y,maxD,maxSpread){if(!list.length)return false;const [cx,cy]=centroid(list),sp=list.reduce((s,o)=>s+Math.hypot(o.x-cx,o.y-cy),0)/list.length;return Math.hypot(cx-x,cy-y)<maxD&&sp<maxSpread;}
function platingEval(R,v){const checks=[],add=(ok,t,hint)=>checks.push({ok:!!ok,t,hint});
  const pcs=vPiecesOf(v),lim=v.r,r=v.r,gv2=k=>(v.garn&&v.garn[k])||0,id=R.id;
  const n=mainNoodle(v),nc=n?noodleCoil(n):null,ncx=nc?nc.cx:0,ncy=nc?nc.cy:0;
  const noodleCentered=(sp,label)=>add(nc&&Math.hypot(nc.cx,nc.cy)<r*.2&&nc.spread<r*sp,label||'면이 가운데 소복이 모였어요','젓가락으로 면을 가운데로 모아요');
  const topCenter=(types,label,hint)=>add(compactAt(groupOf(v,types),ncx,ncy,r*.35,r*.34),label,hint);
  const side=(types,label,hint)=>{const L3=groupOf(v,types);let ok=false;if(L3.length>=2){const [cx,cy]=centroid(L3),ca=Math.atan2(cy,cx),inSide=L3.filter(o=>{let d=Math.abs(Math.atan2(o.y,o.x)-ca);if(d>PI)d=TAU-d;return d<1.15&&Math.hypot(o.x,o.y)>r*.2;}).length/L3.length;ok=Math.hypot(cx,cy)>r*.3&&inSide>=.8;}add(ok,label,hint);};
  if(id==='udon'){
    noodleCentered(.4);
    let tot=0,cov=0;for(const nd of v.noodles)for(const s2 of nd.strands)for(let j=0;j<s2.pts.length;j+=2){const p=s2.pts[j];tot++;if(pcs.some(o=>Math.hypot(o.x-p.x,o.y-p.y)<o.r*.9))cov++;}
    add(n&&tot&&cov/tot<=.3,'면이 잘 보여요','토핑이 면을 너무 많이 덮었어요 — 한쪽으로 모아요');
    const nar=vPiecesOf(v,'naruto'),sc=vPiecesOf(v,'scallion').concat(vPiecesOf(v,'jjokpa'));const ns=circSpread(nar);
    add(nar.length>=2&&ns.R>.8&&ns.r>r*.38,'어묵이 한쪽에 부채꼴로 모였어요','어묵을 그릇 한쪽 가장자리에 겹쳐 놓아요');
    let scOk=false;if(sc.length>=3){const [sx,sy]=centroid(sc),comp=sc.reduce((s2,o)=>s2+Math.hypot(o.x-sx,o.y-sy),0)/sc.length;let sep=true;if(nar.length){const [nx,ny]=centroid(nar);sep=Math.hypot(nx-sx,ny-sy)>r*.45;}scOk=comp<r*.28&&sep;}
    add(scOk,'파는 반대편에 소복이','송송 썬 파를 어묵 반대쪽에 한데 모아요');}
  else if(id==='kfr'||id==='efr'){const gi=grainInfo(v);
    add(gi&&Math.hypot(gi.cx,gi.cy)<r*.15&&gi.inside>.93,'밥을 가운데 둥글게 담았어요','주걱(젓가락·주걱 도구)으로 밥을 가운데로 모아요');
    if(id==='kfr'){const e=v.eggs[0];add(e&&gi&&Math.hypot(e.x-gi.cx,e.y-gi.cy)<r*.28,'계란후라이를 밥 가운데 위에','핀셋으로 계란후라이를 밥 한가운데로 옮겨요');}
    add(gv2('sesame')>.05||groupOf(v,['scallion','jjokpa']).length>2,'깨·파로 마무리했어요','통깨를 뿌리거나 송송 썬 파를 올려요');}
  else if(id==='janchi'){noodleCentered(.45);topCenter(['zucchini'],'애호박 고명을 면 위 가운데','채 썬 애호박을 면 한가운데에 모아 올려요');add(gv2('gim')>.05,'김가루를 솔솔','김가루를 뿌려요');}
  else if(id==='kmari'){noodleCentered(.45);topCenter(['kimchi','cucumber'],'김치·오이를 면 위 가운데','김치와 오이를 면 한가운데에 모아 올려요');add(v.ice.length>0,'얼음이 동동','얼음을 넣어요');}
  else if(id==='bibim'){noodleCentered(.56);topCenter(['cucumber'],'오이채를 면 위 가운데','오이채를 면 한가운데에 모아 올려요');add(pcs.some(o=>o.type==='begg'&&Math.hypot(o.x-ncx,o.y-ncy)<r*.4),'삶은 계란 반쪽을 위에','계란 반쪽을 면 위에 올려요');}
  else if(id==='ramyeon'){noodleCentered(.62,'면이 그릇에 고루 담겼어요');const e=v.eggs[0];add(e&&!pcs.some(o=>Math.hypot(o.x-e.x,o.y-e.y)<14),'계란이 잘 보여요','계란 위를 덮은 재료를 옆으로 옮겨요');add(groupOf(v,['scallion']).length>2,'파를 올렸어요','송송 썬 파를 올려요');}
  else if(id==='shoyu'){noodleCentered(.62,'면이 그릇에 고루 담겼어요');side(['chashu'],'차슈를 한쪽에 가지런히','차슈를 그릇 한쪽에 겹쳐 놓아요');add(pcs.some(o=>o.type==='begg'),'반숙 계란 반쪽','계란 반쪽을 올려요');add(v.seeds.some(q=>q.type==='nori'&&Math.hypot(q.x,q.y)>r*.45),'김을 가장자리에 세웠어요','김을 그릇 가장자리에 꽂아요');}
  else if(id==='kjeon'||id==='pajeon'||id==='buchu'){const j=v.jeons[0];add(j&&Math.hypot(j.x,j.y)<r*.15,'전이 접시 가운데','핀셋으로 전을 접시 가운데로 옮겨요');add(j&&j.cuts&&j.cuts.length>=3,'먹기 좋게 6조각으로 썰었어요','칼 도구로 전을 가로질러 세 번 그어요');}
  else if(id==='steak'){const b=groupOf(v,['beef']);let ok=false,fan=false;
    if(b.length>=3){const ang=o=>o.rot+(o.minA||0),a0=ang(b[0]);ok=b.every(o=>{const d=Math.abs((((ang(o)-a0)%PI)+PI*1.5)%PI-PI/2);return d<.35;});const c=Math.cos(a0),s2=Math.sin(a0),along=b.map(o=>-o.x*s2+o.y*c),across=b.map(o=>o.x*c+o.y*s2).sort((x,y)=>x-y);let gap=0;for(let i=1;i<across.length;i++)gap+=across[i]-across[i-1];gap/=across.length-1;fan=gap<19||Math.max(...along)-Math.min(...along)>26;}
    add(b.length>=3&&ok,'고기 조각을 가지런히','핀셋으로 조각 방향을 나란히 맞춰요');add(fan,'살짝 겹쳐 펼쳤어요','조각을 조금씩 겹치게 비스듬히 펼쳐요');add(gv2('pepper')>.02||gv2('parsley')>.02||gv2('butter'),'후추·파슬리로 마무리','후추나 파슬리를 뿌려요');}
  else if(id==='aglio'||id==='pomo'){add(nc&&Math.hypot(nc.cx,nc.cy)<r*.2&&nc.coil>=.7&&nc.spread<r*.5,'면을 둥지처럼 돌돌 말았어요','젓가락으로 면을 가운데로 돌돌 모아요');add(gv2('parsley')>.02||gv2('parm')>.05,'파슬리·치즈로 마무리','파슬리나 파마산을 뿌려요');}
  else if(id==='yaki'){noodleCentered(.5);add(gv2('aonori')>.02,'아오노리를 솔솔','아오노리를 뿌려요');}
  else if(PLATE_DLC[id])PLATE_DLC[id](v,add,r);
  else if(n)noodleCentered(.5);
  const out=pcs.filter(o=>Math.hypot(o.x,o.y)+itemExt(o)*.4>lim);add(!out.length,'재료가 그릇 안에 있어요','테두리에 걸친 재료를 안으로 옮겨요');
  add(!(v.drips&&v.drips.length),'그릇 테두리가 깨끗해요','행주로 테두리에 튄 국물을 닦아요');
  const score=Math.round(checks.filter(c=>c.ok).length/checks.length*100);return{score,checks};}

/* ---------- plating mode ---------- */
const PL={on:false,v:null,R:null,tool:'tweez',drag:null,hover:null,last:null,raf:0};
function plBuildDom(){if($('#plating'))return;const d=document.createElement('div');d.id='plating';d.className='overlay';d.hidden=true;
  d.innerHTML=`<div class="pl-wrap"><div class="pl-left"><h2>플레이팅</h2><p class="pl-sub" id="plSub"></p><div class="pl-ref"><canvas id="plRef" width="440" height="440"></canvas><span>모범 플레이팅</span></div><ul id="plChecks"></ul></div>
    <div class="pl-mid"><canvas id="plCv" width="1080" height="1080"></canvas></div>
    <div class="pl-right"><div class="pl-tools"><button type="button" data-t="tweez" class="pl-t">핀셋<small>토핑·면 집어 옮기기<br>휠·우클릭으로 돌리기</small></button><button type="button" data-t="comb" class="pl-t">젓가락·주걱<small>면·밥을 문질러 가운데로 모으기</small></button><button type="button" data-t="knife" class="pl-t">칼<small>전을 가로질러 그어 썰기</small></button><button type="button" data-t="towel" class="pl-t">행주<small>테두리 국물 닦기</small></button></div>
      <div class="pl-score"><b id="plScore">0</b><span>플레이팅 점수</span></div><button type="button" id="plServe" class="big-btn">서빙하기</button><button type="button" id="plBack" class="btn2">주방으로 돌아가기</button></div></div>`;
  $('#stage').appendChild(d);
  d.querySelectorAll('.pl-t').forEach(b=>b.onclick=()=>{PL.tool=b.dataset.t;plSyncTools();AU.pick();});
  $('#plServe').onclick=()=>{plClose();serve();};$('#plBack').onclick=()=>plClose();
  const cv2=$('#plCv');cv2.addEventListener('pointerdown',plDown);cv2.addEventListener('pointermove',plMove);addEventListener('pointerup',plUp);cv2.addEventListener('wheel',e=>{e.preventDefault();plRotate(e.deltaY>0?.18:-.18);},{passive:false});
  cv2.addEventListener('contextmenu',e=>{e.preventDefault();plRotate(.4);});addEventListener('keydown',e=>{if(PL.on&&e.code==='Escape')plClose();});}
function plSyncTools(){for(const b of $$('#plating .pl-t'))b.classList.toggle('on',b.dataset.t===PL.tool);$('#plCv').style.cursor=PL.tool==='towel'?'grab':'crosshair';}
function platingWanted(){const o=selOrder();if(!o)return false;const R=RID[o.rid];const v=vesselOf(R);return !contEmpty(v);}
function plOpen(){plBuildDom();const o=selOrder(),R=RID[o.rid],v=vesselOf(R);PL.on=true;PL.v=v;PL.R=R;PL.tool='tweez';PL.drag=null;
  $('#plSub').textContent=`${R.n} — 모범 플레이팅처럼 담아 보세요. 체크 항목이 점수에 들어가요.`;plDrawRef(R);plSyncTools();$('#plating').hidden=false;$('#tut').hidden=true;AU.pick();
  const loop=()=>{if(!PL.on)return;renderPlating();PL.raf=requestAnimationFrame(loop);};cancelAnimationFrame(PL.raf);loop();}
function plClose(){PL.on=false;cancelAnimationFrame(PL.raf);if($('#plating'))$('#plating').hidden=true;if(TUT.on&&TUT.kind==='recipe')$('#tut').hidden=false;}
function plK(){const v=PL.v,Rv=(v.kind==='bowl'?L.bowl.r:L.plate.r)+26,BW=$('#plCv').width;return{k:BW/(2*Rv),BW};}
function plLocal(e){const c=$('#plCv'),r=c.getBoundingClientRect(),{k,BW}=plK(),px=(e.clientX-r.left)/r.width*BW,py=(e.clientY-r.top)/r.height*BW;return[(px-BW/2)/k,(py-BW/2)/k];}
function plPick(v,lx,ly){for(let i=v.items.length-1;i>=0;i--){const o=v.items[i];if(o.kind!=='piece'||o.anim)continue;if(Math.hypot(o.x-lx,o.y-ly)<Math.max(9,Math.min(o.r*.85,40)))return{t:'item',o};}
  for(const e of [...v.eggs,...v.jeons])if(Math.hypot(e.x-lx,e.y-ly)<avgRad(e)*.8)return{t:'item',o:e};
  for(const b of v.beggs)if(Math.hypot(b.x-lx,b.y-ly)<16)return{t:'item',o:b};
  for(const n of v.noodles)for(const s of n.strands)for(const p of s.pts)if(Math.hypot(p.x-lx,p.y-ly)<7)return{t:'noodle',o:n};return null;}
function plDown(e){if(!PL.on)return;e.preventDefault();const [lx,ly]=plLocal(e);PL.last=[lx,ly];
  if(e.button===2)return;if(PL.tool==='tweez'){const h=plPick(PL.v,lx,ly);if(h){PL.drag=h;AU.pick();}}else PL.drag={t:PL.tool,sx:lx,sy:ly};}
function plMove(e){if(!PL.on)return;const [lx,ly]=plLocal(e);const v=PL.v;PL.cur=[lx,ly];if(!PL.drag){PL.hover=PL.tool==='tweez'?plPick(v,lx,ly):null;PL.last=[lx,ly];return;}
  const [ox,oy]=PL.last,dx=lx-ox,dy=ly-oy,mv=Math.hypot(dx,dy);PL.last=[lx,ly];const d=PL.drag;
  if(d.t==='item'){d.o.x+=dx;d.o.y+=dy;}
  else if(d.t==='noodle'){for(const s of d.o.strands){for(const p of s.pts){p.x+=dx;p.y+=dy;p.ox=p.x;p.oy=p.y;}if(s.nt)for(const q of s.nt){q[0]+=dx;q[1]+=dy;}}}
  else if(d.t==='comb'){let h=combNoodles(v,lx,ly,mv);for(const o of v.items){if(o.kind!=='grain')continue;const rr3=Math.hypot(o.x,o.y),w=clamp(1-Math.hypot(o.x-lx,o.y-ly)/40,0,1)*Math.min(1,mv/60)*clamp((rr3-v.r*.6)/(v.r*.2),0,1);if(w>0){o.x-=o.x*w*.3;o.y-=o.y*w*.3;h++;}}if(h&&Math.random()<.15)AU.pick();}
  else if(d.t==='towel'&&v.drips){const [r0,r1]=dripR(v);const n0=v.drips.length;v.drips=v.drips.filter(q=>{const r=lerp(r0,r1,q.f);return Math.hypot(Math.cos(q.a)*r-lx,Math.sin(q.a)*r-ly)>16;});if(v.drips.length<n0)AU.pick();}}
function plUp(){if(!PL.on||!PL.drag)return;const d=PL.drag,v=PL.v;PL.drag=null;
  if(d.t==='knife'&&PL.cur){const [ex,ey]=PL.cur,dx=ex-d.sx,dy=ey-d.sy,len=Math.hypot(dx,dy);for(const j of v.jeons){const R2=avgRad(j),dist=Math.abs((j.x-d.sx)*dy-(j.y-d.sy)*dx)/(len||1);if(len>R2&&dist<R2*.35){const a=((Math.atan2(dy,dx)%PI)+PI)%PI;j.cuts=j.cuts||[];if(!j.cuts.some(c=>Math.abs(c-a)<.25||Math.abs(c-a)>PI-.25)){j.cuts.push(a);AU.chop('kimchi',v.x);}}}}
  if(d.t==='item'){const o=d.o,ext=o.kind==='piece'?itemExt(o)*.45:o.kind==='begg'?10:avgRad(o)*.8,lim=Math.max(0,v.r-ext),r=Math.hypot(o.x,o.y);if(r>lim){o.x*=lim/r;o.y*=lim/r;}AU.place();}
  if(d.t==='noodle')AU.place();}
function plRotate(a){const h=PL.drag&&PL.drag.t==='item'?PL.drag.o:PL.hover&&PL.hover.t==='item'?PL.hover.o:null;if(h&&h.rot!==undefined)h.rot+=a;}
function plTable(g,W2,H2){const gr=g.createLinearGradient(0,0,W2,H2);gr.addColorStop(0,'#6b4a31');gr.addColorStop(1,'#3e2a1c');g.fillStyle=gr;g.fillRect(0,0,W2,H2);
  const R2=mulberry(77);for(let i=0;i<9;i++){const x=i*W2/8+R2()*20;g.fillStyle=`rgba(0,0,0,${.06+R2()*.06})`;g.fillRect(x,0,2,H2);g.strokeStyle='rgba(255,220,180,.05)';g.lineWidth=1;for(let k=0;k<6;k++){g.beginPath();const y0=R2()*H2;g.moveTo(x+6,y0);g.bezierCurveTo(x+W2/16,y0+30,x+W2/10,y0-30,x+W2/8-6,y0+10);g.stroke();}}
  const vg=g.createRadialGradient(W2/2,H2/2,W2*.25,W2/2,H2/2,W2*.75);vg.addColorStop(0,'rgba(255,220,170,.12)');vg.addColorStop(1,'rgba(0,0,0,.45)');g.fillStyle=vg;g.fillRect(0,0,W2,H2);}
function drawVesselAt(g,v,k,cx,cy,style){g.setTransform(k,0,0,k,cx-v.x*k,cy-v.y*k);const old=ctx;try{ctx=g;const Rb=(v.kind==='bowl'?L.bowl.r:L.plate.r);
    g.save();g.beginPath();g.arc(v.x,v.y,Rb+18,0,TAU);g.clip();g.translate(v.x-v.hx,v.y-v.hy);drawPlateBowl(g);g.restore();
    if(style)drawBowlStyle(g,v.x,v.y,style,v);g.save();g.translate(v.x,v.y);drawContents(g,v);g.restore();drawDrips(g,v,v.x,v.y);}finally{ctx=old;}}
function renderPlating(){if(!PL.on)return;const c=$('#plCv'),g=c.getContext('2d'),{k,BW}=plK(),v=PL.v;g.setTransform(1,0,0,1,0,0);plTable(g,BW,BW);
  drawVesselAt(g,v,k,BW/2,BW/2,bowlStyleFor(v));
  g.setTransform(k,0,0,k,BW/2,BW/2);const h=PL.drag&&PL.drag.t==='item'?PL.drag:PL.hover;
  if(h&&PL.tool==='tweez'){g.strokeStyle='rgba(255,210,120,.9)';g.lineWidth=1.6/k*1.6;g.setLineDash([4,3]);g.beginPath();if(h.t==='item'){const o=h.o,r=o.kind==='piece'?Math.min(o.r*.9,40):o.kind==='begg'?16:avgRad(o);g.arc(o.x,o.y,r+4,0,TAU);}else{const [x,y]=noodleCenter(h.o);g.arc(x,y,30,0,TAU);}g.stroke();g.setLineDash([]);}
  if(PL.cur){const [x,y]=PL.cur;g.lineCap='round';if(PL.tool==='tweez'){g.strokeStyle='#c9ced4';g.lineWidth=2.2;g.beginPath();g.moveTo(x-2,y-2);g.lineTo(x+40,y-46);g.moveTo(x+2,y+1);g.lineTo(x+46,y-40);g.stroke();}
    else if(PL.tool==='comb'){g.strokeStyle='#caa46a';g.lineWidth=3;g.beginPath();g.moveTo(x-3,y);g.lineTo(x+50,y-50);g.moveTo(x+3,y+3);g.lineTo(x+56,y-44);g.stroke();g.strokeStyle='rgba(255,230,160,.35)';g.lineWidth=1;g.beginPath();g.arc(x,y,70,0,TAU);g.stroke();}
    else if(PL.tool==='knife'){if(PL.drag&&PL.drag.t==='knife'){g.strokeStyle='rgba(255,240,200,.8)';g.lineWidth=2;g.setLineDash([6,4]);g.beginPath();g.moveTo(PL.drag.sx,PL.drag.sy);g.lineTo(x,y);g.stroke();g.setLineDash([]);}g.fillStyle='#d9dde2';g.beginPath();g.moveTo(x,y);g.lineTo(x+44,y-30);g.lineTo(x+50,y-22);g.lineTo(x+8,y+4);g.closePath();g.fill();g.fillStyle='#2a1c14';rr(g,x+44,y-34,26,10,3);g.fill();}
    else{g.fillStyle='rgba(240,236,226,.95)';rr(g,x-16,y-11,32,22,6);g.fill();g.strokeStyle='rgba(120,160,190,.7)';g.lineWidth=1.5;g.beginPath();g.moveTo(x-12,y-4);g.lineTo(x+12,y-4);g.moveTo(x-12,y+3);g.lineTo(x+12,y+3);g.stroke();}}
  g.setTransform(1,0,0,1,0,0);
  if(!PL.evT||performance.now()-PL.evT>200){PL.evT=performance.now();const ev=platingEval(PL.R,v);$('#plScore').textContent=ev.score;$('#plChecks').innerHTML=ev.checks.map(c=>`<li class="${c.ok?'ok':''}"><i>${c.ok?'✓':'·'}</i><span>${c.t}${c.ok?'':`<small>${c.hint}</small>`}</span></li>`).join('');}}
/* reference plate: a synthetic ideal dish drawn with the same renderer */
const REFIMG={};
function idealDish(R){if(R.plating!=='udon')return null;const c=mkCont('bowl',G.bowl.x,G.bowl.y,G.bowl.r);c.hx=c.x;c.hy=c.y;c.id=99;c.garn={};c.drips=[];
  liqAdd(c,'dashi',380,82);liqAdd(c,'tsuyu',40,82);const n=newNoodle('udon',0,0);n.done=1;n.T=80;udonFill(n,c.r*.64,0);c.noodles.push(n);
  const nar=makeSlices('naruto',3,7);nar.forEach((s,i)=>{s.x=Math.cos(-.7+i*.32)*c.r*.52;s.y=Math.sin(-.7+i*.32)*c.r*.52;s.rot=rand(0,TAU);c.items.push(s);});
  const sc=makeSlices('scallion',12,4);sc.forEach((s,i)=>{const a=2.5+rand(-.25,.25),r=c.r*.5+rand(-12,12);s.x=Math.cos(a)*r;s.y=Math.sin(a)*r;s.rot=rand(0,TAU);c.items.push(s);});
  for(let i=0;i<24;i++)c.seeds.push({x:Math.cos(2.5)*c.r*.5+rand(-16,16),y:Math.sin(2.5)*c.r*.5+rand(-16,16),type:'shichimi',rot:rand(0,6),a:1});return c;}
function plDrawRef(R){const cv3=$('#plRef'),g=cv3.getContext('2d');g.setTransform(1,0,0,1,0,0);plTable(g,cv3.width,cv3.height);if(typeof RIMG!=='undefined'&&RIMG[R.id]){const im=new Image();im.onload=()=>{const W2=cv3.width,s2=Math.max(W2/im.width,W2/im.height),w=im.width*s2,h=im.height*s2;g.drawImage(im,(W2-w)/2,(W2-h)/2,w,h);};im.src=RIMG[R.id];return;}const c=idealDish(R);
  if(!c){g.fillStyle='#f3ead8';g.font='22px "Gowun Dodum", sans-serif';g.textAlign='center';g.fillText('자유롭게 담아 보세요',cv3.width/2,cv3.height/2);return;}
  const k=cv3.width/(2*(L.bowl.r+26));drawVesselAt(g,c,k,cv3.width/2,cv3.height/2,BOWLSTY[R.bowl]);g.setTransform(1,0,0,1,0,0);}

/* ---------- hero shot: 3/4 view of the finished dish ---------- */
function heroShot(v,R){try{const style=bowlStyleFor(v),isB=v.kind==='bowl',Rb=isB?L.bowl.r:L.plate.r;
  const top=mk(Rb*2*3,Rb*2*3),tg=top.getContext('2d');const k=top.width/(Rb*2+4);const old=ctx;
  try{ctx=tg;tg.setTransform(k,0,0,k,top.width/2-v.x*k,top.height/2-v.y*k);tg.save();tg.beginPath();tg.arc(v.x,v.y,Rb,0,TAU);tg.clip();tg.translate(v.x-v.hx,v.y-v.hy);drawPlateBowl(tg);tg.restore();
    tg.save();tg.beginPath();tg.arc(v.x,v.y,Rb+1,0,TAU);tg.clip();if(style)drawBowlStyle(tg,v.x,v.y,style,v);tg.translate(v.x,v.y);drawContents(tg,v);tg.restore();drawDrips(tg,v,v.x,v.y);}finally{ctx=old;}
  const out=mk(840,600),g=out.getContext('2d');plTable(g,840,600);
  // one consistent camera: the rim circle seen at elevation e (ry/rx = sin e); world heights shrink by cos e
  const cx=420,K=.56,CE=Math.sqrt(1-K*K),rx=isB?250:300,ry=rx*K,rimY=isB?205:265;
  const H=isB?rx*.66:rx*.045,FH=isB?rx*.08:0,rF=isB?rx*.44:rx*.74;
  const prof=z=>z>=H?rF:isB?rx-(rx-rF)*(1-Math.cos(Math.pow(z/H,1.15)*PI/2)):rx-(rx-rF)*(z/H),cyz=z=>rimY+z*CE,Z=H+FH,yBot=cyz(Z),rB=prof(Z);
  g.save();g.filter='blur(16px)';g.fillStyle='rgba(0,0,0,.5)';g.beginPath();g.ellipse(cx+30,yBot+10,rB*1.35+(isB?0:10),(rB*1.35+(isB?0:10))*K,0,0,TAU);g.fill();g.restore();
  const N=28,L2=[],R2=[];for(let i=0;i<=N;i++){const z=H*i/N,r=prof(z);L2.push([cx-r,cyz(z)]);R2.push([cx+r,cyz(z)]);}
  const bg=g.createLinearGradient(cx-rx,0,cx+rx,0),bb=style&&style.body;
  if(bb){bg.addColorStop(0,bb[0]);bg.addColorStop(.3,bb[1]);bg.addColorStop(.65,bb[2]);bg.addColorStop(1,bb[3]);}else if(style){bg.addColorStop(0,style.rim);bg.addColorStop(.32,style.rim2);bg.addColorStop(.62,style.rim);bg.addColorStop(1,'#1a0f0a');}else{bg.addColorStop(0,'#cfc8ba');bg.addColorStop(.3,'#fbf8f2');bg.addColorStop(.65,'#e2dccf');bg.addColorStop(1,'#a79f90');}
  if(isB){const fg=g.createLinearGradient(cx-rF,0,cx+rF,0),fc=style?(style.foot||'#1c110b'):'#b8b0a2';fg.addColorStop(0,fc);fg.addColorStop(.35,style&&style.body?style.body[2]:'#e6e0d4');fg.addColorStop(1,fc);g.fillStyle=fg;
    g.beginPath();for(let i=0;i<=8;i++){const y=lerp(cyz(H),yBot,i/8);g.moveTo(cx+rF,y);g.ellipse(cx,y,rF,rF*K,0,0,TAU);}g.fill();}
  g.fillStyle=bg;g.beginPath();for(let i=0;i<=N;i++){const z=H*i/N,r=prof(z);g.moveTo(cx+r,cyz(z));g.ellipse(cx,cyz(z),r,r*K,0,0,TAU);}g.fill();
  if(isB){
    if(!style){g.strokeStyle='rgba(60,90,140,.55)';g.lineWidth=3;const z=H*.28,r=prof(z)*.995;g.beginPath();g.ellipse(cx,cyz(z),r,r*K,0,.12,PI-.12);g.stroke();}
    g.strokeStyle='rgba(255,255,255,.28)';g.lineWidth=6;g.lineCap='round';g.beginPath();for(let i=3;i<=N*.85;i++){const z=H*i/N,r=prof(z),x=cx-r*.8,y=cyz(z)+r*K*.6;if(i===3)g.moveTo(x,y);else g.lineTo(x,y);}g.stroke();}
  else{g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=1.5;g.beginPath();g.ellipse(cx,cyz(H),rF,rF*K,0,.05,PI-.05);g.stroke();}
  const depth=Z;
  // top face (squashed top view)
  g.save();g.beginPath();g.ellipse(cx,rimY,rx,ry,0,0,TAU);g.clip();g.translate(cx,rimY);g.scale(rx/(Rb+2),ry/(Rb+2));g.drawImage(top,-top.width/2/k,-top.height/2/k,top.width/k,top.height/k);g.restore();
  const lg=g.createLinearGradient(cx-rx,rimY-ry,cx+rx,rimY+ry);lg.addColorStop(0,'rgba(255,240,210,.1)');lg.addColorStop(1,'rgba(0,0,0,.14)');g.fillStyle=lg;g.beginPath();g.ellipse(cx,rimY,rx,ry,0,0,TAU);g.fill();
  // steam
  const hot=(v.liq&&v.liq.T>50)||v.items.some(o=>o.T>55)||v.noodles.some(n=>n.T>55)||v.jeons.length;if(hot){g.save();g.filter='blur(6px)';g.lineCap='round';const R3=mulberry(5);
    for(let i=0;i<5;i++){const x0=cx+(R3()-.5)*rx*.9,y0=rimY-ry*.1+R3()*20,sw=(R3()<.5?-1:1)*(30+R3()*30);g.strokeStyle=`rgba(255,255,255,${.06+R3()*.08})`;g.lineWidth=10+R3()*12;g.beginPath();g.moveTo(x0,y0);g.bezierCurveTo(x0+sw,y0-70,x0-sw,y0-130,x0+sw*.6,y0-200-R3()*40);g.stroke();}g.restore();}
  // props: chopsticks / fork
  g.save();const west=R.dlc==='west';g.translate(cx+rx*(isB?.98:.9),yBot+rB*K+(isB?40:50));g.scale(1,K);g.rotate(isB?-.62:-.3);g.fillStyle='rgba(0,0,0,.35)';g.filter='blur(4px)';g.fillRect(-150,14,320,18);g.filter='none';
  if(west){g.fillStyle='#d9dde2';rr(g,-150,-4,220,9,4);g.fill();for(let i=0;i<4;i++){g.fillRect(70+0,-12+i*6,50,3);}}
  else{g.fillStyle='#8a5a34';rr(g,-40,-6,24,20,6);g.fill();const cg=g.createLinearGradient(0,-8,0,10);cg.addColorStop(0,'#caa06c');cg.addColorStop(1,'#8f6436');g.fillStyle=cg;rr(g,-170,-8,330,6,3);g.fill();rr(g,-170,2,330,6,3);g.fill();g.fillStyle='#7a2a1c';g.fillRect(-170,-8,40,6);g.fillRect(-170,2,40,6);}
  g.restore();
  const vg=g.createRadialGradient(cx,300,200,cx,300,560);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.4)');g.fillStyle=vg;g.fillRect(0,0,840,600);
  return out.toDataURL('image/jpeg',.9);}catch(e){console.warn(e);return null;}}
