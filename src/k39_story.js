
/* ---------- 2.0 story: four chapters from a back-alley shop to a star in the food guide · weekly report · ending ---------- */
const bestN=n=>Object.values(SAVE.best||{}).filter(v=>v>=n).length;
const critMax=()=>Math.max(0,...(SAVE.critic||[]).map(c=>c.stars));
const regMax=()=>Math.max(0,...Object.keys(GUEST).filter(k=>GUEST[k].reg).map(k=>hearts(k)));
const CH=[
  {n:'1장 · 동네 식당',sub:'골목 끝 작은 가게, 첫 손님을 기다려요.',reward:100000,goals:[
    ['손님 30팀 대접하기',()=>[SAVE.served||0,30]],['가게 Lv3 “동네 맛집”',()=>[shopLv(),3]],['잔고 30만원 모으기',()=>[SAVE.money,300000]]]},
  {n:'2장 · 입소문',sub:'“거기 맛있더라” — 동네에 소문이 돌기 시작했어요.',reward:200000,goals:[
    ['손님 120팀 대접하기',()=>[SAVE.served||0,120]],['단골 한 명과 하트 3개',()=>[regMax(),3]],['평판 ★3.5',()=>[Math.round((SAVE.rep||0)*10)/10,3.5]]]},
  {n:'3장 · 방송 출연',sub:'맛집 프로그램에서 섭외 전화가 왔어요!',reward:300000,goals:[
    ['평론가에게 ★4 받기',()=>[critMax(),4]],['가게 Lv6 “방송 탄 집”',()=>[shopLv(),6]],['가게를 꾸미거나 넓히기',()=>[Object.keys((SAVE.theme||{}).own||{}).length-1+((SAVE.expand||0)>0?1:0),1]]]},
  {n:'4장 · 미식 가이드',sub:'이제 목표는 미식 가이드의 별 하나.',reward:500000,goals:[
    ['평론가에게 ★4.5 받기',()=>[critMax(),4.5]],['가게 Lv8 “셰프의 식당”',()=>[shopLv(),8]],['90점 넘긴 요리 10가지',()=>[bestN(90),10]]]}];
function storySt(){SAVE.story=SAVE.story||{ch:0,week:0,clear:null,ended:false};return SAVE.story;}
const chDone=i=>CH[i].goals.every(([,f])=>{const [v,t]=f();return v>=t;});
/* one line per closed day, for the weekly report */
endDay=(orig=>function(){if(!G||G.mode!=='career')return orig();const D=G.day,gas=Math.round(G.gas/10)*10,rentD=D.n<=3?12000:RENT,wage=typeof staffWage==='function'?staffWage():0;
  const avg=D.scores.length?Math.round(D.scores.reduce((a,b)=>a+b,0)/D.scores.length):0,sales={};for(const k in (D.sales||{}))sales[k]=D.sales[k].n;
  SAVE.hist=(SAVE.hist||[]).concat([{d:D.n,rev:D.rev+D.tips,profit:D.rev+D.tips-D.spend-rentD-SEASON-gas-wage,served:D.served,fail:D.fail,avg,sales}]).slice(-28);
  orig();const st=storySt();if(D.n%7===0)st.week=D.n/7;if(!st.ended&&st.clear===null&&st.ch<CH.length&&chDone(st.ch))st.clear=st.ch;writeSave();
  if(st.clear!==null)$('#settleBody').insertAdjacentHTML('afterbegin',`<div class="st-ch">🎉 ${CH[st.clear].n} 목표 달성! 다음 날로 넘어가면 이야기가 이어져요.</div>`);})(endDay);
/* between days: weekly report → chapter card → (ending) → next shift */
function storyEl(){let d=$('#story');if(!d){d=document.createElement('div');d.id='story';d.hidden=true;$('#stage').appendChild(d);}return d;}
function storyShow(html,btn,next){const d=storyEl();d.innerHTML=`<div class="sy-card">${html}<button type="button" class="big-btn" id="syNext">${btn}</button></div>`;d.hidden=false;$('#top').hidden=true;
  const go=()=>{removeEventListener('keydown',kd,true);d.hidden=true;next();},kd=e=>{if(e.code==='Enter'||e.code==='Space'){e.preventDefault();e.stopImmediatePropagation();go();}};$('#syNext').onclick=go;setTimeout(()=>addEventListener('keydown',kd,true),300);AU.pick&&AU.pick();}
function weekHtml(w){const H=(SAVE.hist||[]).filter(h=>h.d>(w-1)*7&&h.d<=w*7),mx=Math.max(1,...H.map(h=>Math.max(h.rev,Math.abs(h.profit)))),sum=k=>H.reduce((s,h)=>s+h[k],0);
  const sales={};for(const h of H)for(const k in h.sales)sales[k]=(sales[k]||0)+h.sales[k];const top=Object.entries(sales).sort((a,b)=>b[1]-a[1]).slice(0,3);
  const sc=H.filter(h=>h.avg),avg=sc.length?Math.round(sc.reduce((s,h)=>s+h.avg,0)/sc.length):0,prev=(SAVE.hist||[]).filter(h=>h.d>(w-2)*7&&h.d<=(w-1)*7),pp=prev.reduce((s,h)=>s+h.profit,0);
  const note=sum('profit')>pp&&prev.length?'지난주보다 벌이가 늘었어요. 이 기세 그대로!':avg>=85?'손님들이 맛있다고 입을 모아요.':sum('fail')>sum('served')*.3?'기다리다 돌아간 손님이 조금 많았어요. 손님 속도를 “여유롭게”로 두거나 밑준비를 해 보세요.':'차근차근, 가게가 자리를 잡아 가고 있어요.';
  const st=storySt(),ch=CH[Math.min(st.ch,CH.length-1)];
  return`<small class="sy-k">WEEK ${w} · 영업 보고서</small><h2>${w}주차 장사, 수고했어요!</h2>
    <div class="wk-chart">${H.map(h=>`<div class="wk-col"><div class="wk-bars"><i class="rev" style="height:${h.rev/mx*100}%"></i><i class="${h.profit<0?'loss':'pro'}" style="height:${Math.abs(h.profit)/mx*100}%"></i></div><span>DAY ${h.d}</span></div>`).join('')}</div>
    <p class="wk-leg"><i class="rev"></i>매출+팁 <i class="pro"></i>순이익 <i class="loss"></i>손실</p>
    <div class="wk-stats"><div><b>${won(sum('rev'))}</b><span>한 주 매출</span></div><div><b class="${sum('profit')<0?'neg':''}">${won(sum('profit'))}</b><span>한 주 순이익</span></div><div><b>${sum('served')}팀</b><span>대접한 손님</span></div><div><b>${avg}점</b><span>평균 점수</span></div></div>
    ${top.length?`<div class="wk-top"><b>이번 주 인기 메뉴</b>${top.map(([id,n],i)=>`<span>${['🥇','🥈','🥉'][i]} ${RID[id]?RID[id].n:id} ${n}그릇</span>`).join('')}</div>`:''}
    <p class="wk-note">${note}</p>${st.ended?'':`<div class="wk-ch"><b>${ch.n}</b>${chGoals(ch)}</div>`}`;}
function chGoals(ch){return`<ul class="ch-goals">${ch.goals.map(([t,f])=>{const [v,g]=f(),ok=v>=g,p=clamp(v/g,0,1);return`<li class="${ok?'ok':''}"><span>${ok?'✔':'○'} ${t}</span><i><s style="width:${p*100}%"></s></i><em>${g>=10000?`${Math.floor(Math.min(v,g)/10000)}만 / ${g/10000}만원`:`${Math.min(v,g)} / ${g}`}</em></li>`;}).join('')}</ul>`;}
function chapterHtml(i){const c=CH[i],n=CH[i+1];return`<small class="sy-k">CHAPTER CLEAR</small><h2>${c.n} — 완료!</h2><p class="ch-sub">${c.sub}</p><div class="ch-rew">🎁 축하금 <b>+${won(c.reward)}</b></div>
  ${n?`<div class="ch-next"><small>다음 이야기</small><b>${n.n}</b><p>${n.sub}</p>${chGoals(n)}</div>`:'<div class="ch-next"><b>마지막 이야기가 기다리고 있어요…</b></div>'}`;}
startCareer=(orig=>function(){const st=storySt();if(SAVE.mid&&SAVE.mid.day===SAVE.day)return orig();
  const steps=[];if(st.week){const w=st.week;steps.push(nx=>{st.week=0;writeSave();storyShow(weekHtml(w),'새로운 한 주 시작 ▸',nx);});}
  if(st.clear!==null){const i=st.clear;steps.push(nx=>{st.clear=null;st.ch=i+1;SAVE.money+=CH[i].reward;writeSave();AU.cash&&AU.cash();storyShow(chapterHtml(i),i+1<CH.length?'다음 이야기로 ▸':'엔딩 보기 ▸',nx);});
    if(i+1>=CH.length)steps.push(nx=>{st.ended=true;writeSave();hideAll();$('#title').hidden=true;playOpening(()=>storyShow(`<small class="sy-k">THE END · 그리고</small><h2>고마워요, 사장님!</h2><p class="ch-sub">지글지글 키친의 이야기는 여기까지지만, 가게는 내일도 문을 열어요.<br>이제부터는 자유 영업! 좋아하는 메뉴로, 좋아하는 속도로.</p>`,'내일도 영업하기 ▸',nx),endScenes());});}
  if(!steps.length)return orig();hideAll();$('#title').hidden=true;let k=0;const run=()=>k<steps.length?steps[k++](run):orig();run();})(startCareer);
/* prep tab: where the story is at */
PREP_TABS.push(['story','이야기']);
PREP_RENDER.story=body=>{const st=storySt();body.innerHTML=`<div class="sy-tab"><div class="sy-list">${CH.map((c,i)=>`<div class="sy-ch${i<st.ch?' done':i===st.ch?' cur':' lock'}"><b>${c.n}</b><p>${i<=st.ch?c.sub:'???'}</p>${i<st.ch?'<em>✔ 완료</em>':i===st.ch?chGoals(c):''}</div>`).join('')}</div>
  ${st.ended?'<p class="sf-lead">🌟 미식 가이드의 별을 받았어요. 지금은 자유 영업 중! <button type="button" class="btn2" id="syEnd">🎬 엔딩 다시 보기</button></p>':''}</div>`;
  const b=$('#syEnd');if(b)b.onclick=()=>playOpening(()=>setScreen('prep'),endScenes());};
/* ---- the ending, cut paper like the opening ---- */
function endScenes(){const days=SAVE.day||1,guests=SAVE.served||0;return[
 {d:6.6,cap:`처음 셔터를 올린 날로부터 ${days}일.`,draw:lt=>{street(false,lt);put(piece('esun',190,190,L=>L(Pp.ell(95,95,90,90),'#f08a3a'),boil()),1250,330+lt*14,{d:1});
   for(let i=0;i<4;i++){const B=[[80,420,260,340],[330,470,200,290],[1080,440,230,320],[1320,390,300,370]][i];put(pBld(i,false),B[0]+B[2]/2,B[1]+B[3]/2,{d:2});}
   put(piece('roadD',1640,260,L=>L(Pp.rect(0,20,1640,240),'#8a6a52'),boil()),800,880,{d:3});shopFront(0,false);
   const Q=[['#35578f','#3a2a20'],['#c23a1b','#6b4423'],['#4f8a4a','#2a2320'],['#f0b64a','#5a3a24'],['#7a5a9a','#3a2a20'],['#e0819a','#2a2320']];
   Q.forEach(([c,h],i)=>{const tx=1040+i*82,x=Math.max(tx,1760-eo((lt-i*.35)/1.6)*(1760-tx));figure('eq'+i,c,h,x,820,{walk:x>tx+2,flip:true});});
   figure('chef',PAL.white,'chef',470,812,{wave:lt>2?lt:undefined});
   if(lt>3.2){const s=back((lt-3.2)/.4);put(sticker('eline','오늘도 줄 서는 집',56,'#ffcf5a','#7a2410'),1360,520,{rot:.06,sx:s,d:4});}}},
 {d:7,cap:`단골의 웃음, 따끈한 한 그릇. 손님 ${guests}팀을 맞았어요.`,draw:lt=>{
   put(piece('etiles',1640,1040,(L,gg)=>{L(Pp.rect(0,0,1640,1040),'#efe0c4',0);gg.strokeStyle='rgba(150,120,90,.2)';gg.lineWidth=3;for(let x=0;x<1640;x+=90){gg.beginPath();gg.moveTo(x,0);gg.lineTo(x,1040);gg.stroke();}}),800,500,{d:0});
   put(piece('etable',1400,220,L=>{L(Pp.rect(0,0,1400,220),PAL.wood,1.5);L(Pp.rect(0,0,1400,30),'#a9744a',1.2);},boil()),800,880,{d:4});
   const G2=[['#35578f','#3a2a20',260],['#c23a1b','#6b4423',520],['#4f8a4a','#2a2320',1080],['#e0819a','#2a2320',1340]];
   G2.forEach(([c,h,x],i)=>{figure('et'+i,c,h,x,790+Math.sin(OPN.t*3+i)*3,{flip:i>1});const t0=1+i*.9;if(lt>t0){const f=(lt-t0)%2.4,a=clamp(1-f/2.4,0,1);put(piece('eheart',70,64,L=>L(Pp.heart(35,32,28),'#e0415a',1.4),boil()),x+(i>1?-40:40),560-f*90,{a,sx:.6+f*.2,d:2});}});
   [360,640,960,1240].forEach((x,i)=>{put(piece('ebowl'+(i%2),170,90,L=>{L(Pp.ell(85,30,82,26),i%2?'#f3e8d2':'#fbf8f1');L(Pp.ell(85,30,64,18),i%2?'#e2653f':'#f0c05a',1.2);L([[8,34],[162,34],[130,88],[40,88]],i%2?'#35578f':'#c23a1b');},boil()),x,760,{d:3});
     for(let k=0;k<2;k++){const ph=((lt*.5+k/2+i*.25)%1);put(piece('esteam',90,70,L=>L(Pp.blob(45,35,30,i+k+30,.3),'#ffffff',2.4,false),boil()),x+Math.sin(ph*5+i)*30,690-ph*200,{a:Math.sin(ph*PI)*.7,sx:.6+ph*.7,d:0});}});}},
 {d:7.4,cap:'그리고 오늘, 미식 가이드에 작은 별 하나가 실렸어요.',draw:lt=>{const g=OPN.g;
   put(piece('ekraft',1640,1040,L=>L(Pp.rect(0,0,1640,1040),'#d9b889',0)),800,500,{d:0});
   const op=eio(lt/1.4);put(piece('ebook',980,640,L=>{L(Pp.rect(0,0,980,640),'#7a2410',1.6);L(Pp.rect(24,20,456,600),PAL.white,1.4);L(Pp.rect(500,20,456,600),PAL.white,1.4);},boil()),800,500,{d:6,sy:1,sx:.35+op*.65});
   if(op>.95){g.save();g.fillStyle=PAL.ink;g.textAlign='center';g.font='46px "Black Han Sans"';g.fillText('미식 가이드',555,330);g.font='34px "Nanum Pen Script", sans-serif';g.fillText('올해 새로 별을 받은 집',555,390);
     g.font='30px "Nanum Pen Script", sans-serif';g.fillStyle='#8a755a';['“소박하지만 정성이 가득한 한 그릇”','“다시 찾고 싶은 골목 식당”'].forEach((t,i)=>g.fillText(t,555,500+i*50));
     g.font='54px "Black Han Sans"';g.fillStyle=PAL.red;g.fillText('지글지글 키친',1045,330);g.font='32px "Nanum Pen Script", sans-serif';g.fillStyle=PAL.ink;g.fillText(`${days}일째 영업 중 · 골목 끝`,1045,390);g.restore();}
   if(lt>2.4){const s=1+(1-back((lt-2.4)/.45))*1.2;put(piece('estar',220,220,L=>{L(Pp.star(110,110,104),'#f0b64a',1.6);L(Pp.star(110,110,70),'#ffd66b',1.2);},boil()),1045,560,{sx:s,rot:-.1,d:6});cue('star',()=>{AU.ding&&AU.ding();AU.chop&&AU.chop('kimchi',800);});}
   if(lt>3.2){for(let i=0;i<40;i++){const R=mulberry(i+300),tt=lt-3.2,vx=(R()-.5)*1000,vy=-260-R()*500,x=1045+vx*tt,y=520+vy*tt+520*tt*tt;if(y>1050)continue;
     put(piece('conf'+(i%5),22,14,L=>L(Pp.rect(0,0,22,14),['#e0412a','#f0ae3a','#4f8a4a','#35578f','#fff3dc'][i%5],1),0),x,y,{rot:tt*(R()*14-7),sx:Math.cos(tt*(5+R()*6)),sy:1,d:1});}}}},
 {d:6.8,cap:'지글지글 키친은 내일도 문을 엽니다.',draw:lt=>{street(true,lt);
   for(let i=0;i<16;i++){const R=mulberry(i+3),x=R()*1600,y=30+R()*300;put(piece('star',30,30,L=>L(Pp.star(15,15,14),'#f6e7b0',.8),boil()),x,y,{sx:(.55+R()*.6)*(.8+.2*Math.sin(OPN.t*3+i)),d:0});}
   put(piece('moon',150,150,L=>L(Pp.ell(75,75,70,70),'#f3e3b5'),boil()),1290,190,{d:2});
   for(let i=0;i<4;i++){const B=[[80,420,260,340],[330,470,200,290],[1080,440,230,320],[1320,390,300,370]][i];put(pBld(i,true),B[0]+B[2]/2,B[1]+B[3]/2,{d:2});}
   put(piece('road',1640,260,L=>L(Pp.rect(0,20,1640,240),'#4a3a34'),boil()),800,880,{d:3});shopFront(0,true);lampGlow(800,640,320,.22);
   put(piece('esign',440,120,(L,gg)=>{L(Pp.rect(0,0,440,120),'#6b4423',1.6);L(Pp.rect(14,12,412,96),'#80562f',1.2);gg.font='64px "Black Han Sans"';gg.textAlign='center';gg.textBaseline='middle';gg.lineJoin='round';gg.strokeStyle='#3a2410';gg.lineWidth=10;gg.strokeText('지글지글 키친',220,64);gg.fillStyle='#ffe9b0';gg.fillText('지글지글 키친',220,64);},boil()),800,360,{d:5});
   put(piece('estar2',70,70,L=>L(Pp.star(35,35,32),'#f0b64a',1.2),boil()),1010,320,{rot:Math.sin(OPN.t*2)*.1,d:4});
   figure('chef',PAL.white,'chef',470,812,{wave:lt});const w=eo((lt-1)/2.4);figure('eg9','#35578f','#3a2a20',1700-w*820,812,{walk:lt>1&&lt<3.4,flip:true});figure('eg8','#e0819a','#2a2320',1820-w*820,812,{walk:lt>1&&lt<3.4,flip:true});}},
 {d:5.6,cap:'',draw:lt=>{const g=OPN.g;put(piece('titlebg',1640,1040,L=>L(Pp.rect(0,0,1640,1040),'#f1e4ca',0)),800,500,{d:0});
   for(let i=0;i<14;i++){const R=mulberry(i+200),x=R()*1600,y=((R()*1000+lt*(40+R()*50))%1100)-50;put(piece('conf'+(i%5),22,14,L=>L(Pp.rect(0,0,22,14),['#e0412a','#f0ae3a','#4f8a4a','#35578f','#fff3dc'][i%5],1),0),x,y,{rot:lt*(R()*4-2),a:.7,d:1});}
   if(lt>.2){const s=1+(1-back((lt-.2)/.45))*.9;put(sticker('ethx','고마워요, 사장님!',120,'#ffcf5a','#7a2410'),800,430,{rot:-.04,sx:s,d:6});cue('st1',()=>AU.chop&&AU.chop('kimchi',700));}
   if(lt>1){const s=back((lt-1)/.4);put(sticker('eend','THE END',44,'#ffffff','#c23a1b','"IBM Plex Mono"'),800,600,{rot:-.03,sx:s,d:3});}
   if(lt>1.6){g.save();g.globalAlpha=clamp((lt-1.6)*2,0,1);g.font='52px "Nanum Pen Script", "Gowun Dodum", sans-serif';g.textAlign='center';g.fillStyle=PAL.ink;g.fillText('…그리고 영업은 계속됩니다',800,760);g.restore();}}}];}
