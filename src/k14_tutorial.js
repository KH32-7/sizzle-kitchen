
/* ---------- tutorial & kitchen tour ---------- */
const CWN=['냄비','편수냄비','큰 팬','작은 팬'];
const TUT={on:false,kind:'',steps:[],i:0};
function tgtOf(h){const R=(x,y,w,hh)=>({x,y,w,h:hh,rect:1});switch(h.k){
  case'fridge':return R(L.fridge.x+L.fridge.w/2,L.fridge.y+L.fridge.h/2,L.fridge.w+12,L.fridge.h+12);
  case'shelf1':return R(695,96,1100,110);case'shelf2':return R(450,186,610,64);
  case'pantry':{const p=PANTRY.find(q=>q.id===h.id);return p.row===1?{x:p.x,y:94,r:44}:{x:p.x,y:186,r:30};}
  case'rack':{if(!h.id)return R(L.rack.x+L.rack.w/2,L.rack.y+30,L.rack.w+8,L.rack.h+8);const t=RACKT.find(q=>q.id===h.id);return R((t.x0+t.x1)/2,L.rack.y+30,t.x1-t.x0+6,L.rack.h+4);}
  case'board':return R(L.board.x+L.board.w/2,L.board.y+L.board.h/2,L.board.w+10,L.board.h+10);
  case'prep':return{x:L.prep[0].x,y:(L.prep[0].y+L.prep[1].y)/2,r:120};
  case'cw':{const c=G.cw[h.i];return{x:c.x,y:c.y,r:c.r+16};}
  case'knob':return{x:KNOBX[h.i],y:KNOBY,r:36};case'knobs':return R(900,KNOBY,520,86);
  case'handle':{const c=h.i==='s'?G.strainer:G.cw[h.i],s=handleSeg(c);return{x:(s[0]+s[2])/2,y:(s[1]+s[3])/2,r:26};}
  case'mix':return{x:G.mix.x,y:G.mix.y,r:L.mix.r+8};case'sink':return R(L.sink.x+L.sink.w/2,L.sink.y+L.sink.h/2,L.sink.w+8,L.sink.h+8);
  case'faucet':return{x:L.sink.tx,y:L.sink.ty,r:24};case'strainer':return{x:G.strainer.x,y:G.strainer.y,r:G.strainer.r+12};
  case'plate':return{x:L.plate.x,y:L.plate.y,r:L.plate.r+8};case'bowl':return{x:L.bowl.x,y:L.bowl.y,r:L.bowl.r+8};
  case'trash':return{x:L.trash.x,y:L.trash.y,r:L.trash.r+8};case'serve':return R(1423,872,284,70);case'rail':return R(1423,150,344,186);case'temp':{const c=G.cw[h.i||0];return{x:c.x+Math.cos(-.8)*(c.r+6)+25,y:c.y+Math.sin(-.8)*(c.r+6),r:32};}}
  return null;}
function drawTutHL(g){if(!TUT.on)return;const s=TUT.steps[TUT.i];if(!s||!s.hl)return;const t=G.t||performance.now()/1000,p=.5+.5*Math.sin(t*5);
  s.hl.forEach((h,n)=>{const q=tgtOf(h);if(!q)return;g.save();g.lineWidth=4;g.strokeStyle=`rgba(255,190,70,${.55+.4*p})`;g.shadowColor='rgba(255,170,40,.9)';g.shadowBlur=18;g.setLineDash([14,8]);g.lineDashOffset=-t*40;
    if(q.rect){rr(g,q.x-q.w/2,q.y-q.h/2,q.w,q.h,12);g.stroke();}else{g.beginPath();g.arc(q.x,q.y,q.r+p*3,0,TAU);g.stroke();}g.restore();
    const top=q.rect?q.y-q.h/2:q.y-q.r,ay=Math.max(58,top-18-p*8),ax=q.x;g.save();g.fillStyle='#ffb43c';g.strokeStyle='rgba(40,20,5,.7)';g.lineWidth=2.5;g.beginPath();g.moveTo(ax,ay);g.lineTo(ax-14,ay-20);g.lineTo(ax-6,ay-20);g.lineTo(ax-6,ay-36);g.lineTo(ax+6,ay-36);g.lineTo(ax+6,ay-20);g.lineTo(ax+14,ay-20);g.closePath();g.stroke();g.fill();
    if(n===0&&s.tag){g.font='15px "Black Han Sans", sans-serif';const w=g.measureText(s.tag).width+18;g.fillStyle='rgba(30,18,8,.88)';rr(g,ax-w/2,ay-66,w,26,7);g.fill();g.fillStyle='#ffe2a8';g.textAlign='center';g.fillText(s.tag,ax,ay-47);}g.restore();});}

/* recipe guide */
const any=(t)=>allItems().some(o=>o.type===t);
const cwHas=(i,t)=>G.cw[i].items.some(o=>o.type===t);
const vHas=(v,t)=>v.items.some(o=>o.type===t);
const liq=i=>G.cw[i].liq;
const St=(t,d,hl,ok,tag)=>({t,d,hl,ok,tag});
const OPT=(c,sec)=>{const f=()=>{try{if(c())return true;}catch(e){}return G.t-(TUT.t0||0)>(sec||10);};f.opt=1;return f;};
const T_=(w,a,b)=>josa(w,a,b);
const tFridge=(id,name)=>St(`냉장고에서 ${T_(name,'을','를')} 꺼내요`,'왼쪽 위 냉장고를 클릭하면 문이 열려요. 칸을 누르면 손에 들려요.',[{k:'fridge'}],()=>(G.held&&G.held.id===id)||any(id)||ALLC().some(c=>c.noodles.some(n=>n.type===id)),'냉장고');
const tBoard=(id,name)=>St(`${T_(name,'을','를')} 도마에 올려요`,'도마 위 아무 곳이나 클릭하면 내려놓아요.',[{k:'board'}],()=>any(id)&&!(G.held&&G.held.id===id),'여기에 클릭');
const tKnife=()=>St('식칼을 집어요','도마 아래 도구 거치대에서 식칼을 클릭해요. 칼을 들면 칼날 윗면만 보여서, 하얀 선이 정확히 잘리는 자리예요.',[{k:'rack',id:'knife'}],()=>G.tool==='knife','식칼');
const tHand=()=>St('도구를 내려놓아요','거치대를 한 번 더 클릭하면 도구를 내려놓고 빈손이 돼요. 재료를 옮기거나 병을 집을 땐 빈손이 편해요.',[{k:'rack'}],()=>G.tool==='hand','거치대 클릭');
const tTool=(id,d)=>St(`${T_(TOOLN[id],'을','를')} 집어요`,d,[{k:'rack',id}],()=>G.tool===id,TOOLN[id]);
const tFire=(i,strong)=>St(`${CWN[i]} 불을 켜요`,`${['첫','두','세','네'][i]} 번째 노브예요 (노브 아래 점 그림에서 주황 점이 이 화구). 클릭하면 중불, ${strong?'위로 끝까지 드래그하면 센불이에요.':'위아래로 드래그해 세기를 조절해요.'}`,[{k:'knob',i},{k:'cw',i}],()=>G.burners[i].lit&&(!strong||G.burners[i].level>.8),'노브');
const tPour=(pid,hl,title,ok,d)=>St(title,d||'선반에서 병을 클릭해 집고, 붓고 싶은 곳 위에서 마우스를 누르고 있으면 부어져요. 움직이며 부으면 넓게 둘러져요. 다 부었으면 오른쪽 클릭으로 제자리에.',[{k:'pantry',id:pid},...hl],ok,'선반');
const tShake=(id,hl,title,ok)=>St(title,'선반 아래 칸의 양념통을 집고, 위에서 마우스를 누른 채 좌우로 흔들면 솔솔 뿌려져요.',[{k:'pantry',id},...hl],ok,'양념통');
const tDump=(hl,title,ok)=>St(title,'도마의 빈 곳이나 가장자리를 잡고 끌어다 놓으면 도마 위 재료가 한꺼번에 털려 들어가요. (재료를 잡고 끌면 한 줌씩)',[{k:'board'},...hl],ok,'도마째 끌기');
const tServe=()=>St('서빙해요!','오른쪽 아래 “서빙” 버튼을 누르면 손님께 나가고 채점돼요.',[{k:'serve'}],()=>false,'서빙');
const tDice=(id,name,n,maxA)=>St(`${T_(name,'을','를')} 깍둑썰기`,'칼을 옮기며 클릭할 때마다 한 번 썰려요. 한 방향으로 다 썰었으면 오른쪽 클릭(또는 R)으로 도마를 90° 돌려 다시 썰어요.',[{k:'board'}],()=>cutN(id,maxA||1300)>=n,'탁탁탁');
const tSlice=(id,name,n,maxA,d)=>St(`${T_(name,'을','를')} 썰어요`,d||'칼을 조금씩 옮기며 얇게 탁탁탁. 마우스 휠로 칼을 기울이면 어슷썰기가 돼요.',[{k:'board'}],()=>cutN(id,maxA)>=n,'썰기');
const tWater=(i,ml)=>tPour('water',[{k:'cw',i}],`${CWN[i]}에 물 ${ml}ml 붓기`,()=>liq(i)&&liq(i).vol>=ml*.9,`물 주전자를 집고 ${CWN[i]} 위에서 누르고 있어요. 냄비 옆에 물의 양(ml)이 표시돼요.`);
const tBoil=(i)=>St('물이 끓을 때까지 기다려요','냄비 옆 온도가 100°C가 되면 보글보글 끓어요. 그동안 다른 재료를 손질해도 돼요.',[{k:'cw',i}],()=>liq(i)&&liq(i).T>=99,'100°C');
const tNoodlePantry=(pid,name,i)=>[St(`선반에서 ${T_(name,'을','를')} 집어요`,'선반 위 칸의 면 포장을 클릭해요.',[{k:'pantry',id:pid}],()=>(G.held&&G.held.id===pid)||ALLC().some(c=>c.noodles.some(n=>n.type===PANTRY.find(p=>p.id===pid).nt)),'면'),
  St(`끓는 ${CWN[i]}에 넣어요`,`${CWN[i]} 위를 클릭하면 면이 들어가요.`,[{k:'cw',i}],()=>G.cw[i].noodles.length>0,'클릭')];
const tNoodleFridge=(id,name,i)=>[tFridge(id,name),St(`끓는 ${CWN[i]}에 넣어요`,`${CWN[i]} 위를 클릭하면 면이 들어가요.`,[{k:'cw',i}],()=>ALLC().some(c=>c.noodles.some(n=>n.type===id)),'클릭')];
const tStirNoodle=(i)=>[tTool('chop','긴 젓가락은 면을 풀고 섞는 도구예요.'),St('면을 저어 풀어요','냄비 안을 누른 채 원을 그리듯 저어요. 넣자마자 저어야 면끼리 달라붙지 않아요.',[{k:'cw',i}],()=>G.cw[i].noodles.every(n=>n.stick<.35),'저어요')];
const tNoodleDone=(i,lo,t)=>St(t||'면이 익을 때까지 기다려요','거품이 냄비 가득 차오르면 물 주전자로 찬물을 조금 부어요. 안 그러면 넘쳐서 불이 꺼져요!',[{k:'cw',i}],()=>G.cw[i].noodles.some(n=>n.done>=lo),'보글보글');
const tDrain=(i)=>[St('냄비째 싱크대 체에 쏟아요','냄비 양옆 손잡이를 잡고 싱크대로 끌어다 놓으면 물은 빠지고 면만 체에 남아요.',[{k:'handle',i},{k:'strainer'}],()=>G.strainer.noodles.length>0,'손잡이 잡고 끌기'),
  St('찬물로 헹궈요','수도꼭지를 클릭하면 찬물이 나와요. 면이 차갑고 탱글해질 때까지 헹궈요.',[{k:'faucet'}],()=>G.strainer.noodles.some(n=>n.rinse>.6),'수도')];
const tStrainerTo=(k,title)=>St(title,'체 손잡이를 잡고 그릇·팬으로 끌어다 놓아요.',[{k:'handle',i:'s'},{k}],()=>(k==='bowl'?G.bowl:k==='plate'?G.plate:G.cw[2]).noodles.length>0,'체 손잡이');
const tPanTo=(i,k,title,ok)=>St(title,`${CWN[i]} 손잡이를 잡고 ${k==='bowl'?'그릇':'접시'}으로 끌어다 놓으면 쏟아져요.`,[{k:'handle',i},{k}],ok,'손잡이 잡고 끌기');
const tWait=(i,title,d,ok,tag)=>St(title,d,[{k:'cw',i}],ok,tag);
const tSpatStir=(i,title,ok)=>[tTool('spatula','뒤집개는 팬 요리용이에요. 팬 안을 누른 채 저으면 볶아지고, 짧게 클릭하면 그 자리를 뒤집어요.'),St(title,'팬 안을 누른 채 휘저어요. 팬 손잡이를 탁 클릭하면 팬을 튕겨 한 번에 뒤집을 수 있어요.',[{k:'cw',i}],ok,'휘젓기')];
const TUTS={
  kfr:()=>[tFridge('kimchi','김치'),tBoard('kimchi','김치'),tKnife(),tDice('kimchi','김치',8),tHand(),tFridge('onion','양파'),tBoard('onion','양파'),tKnife(),tDice('onion','양파',8),tHand(),
    tFire(2),tPour('oil',[{k:'cw',i:2}],'큰 팬에 식용유 두르기',()=>G.cw[2].oilAmt>=4),tWait(2,'팬이 160°C까지 달궈질 때까지','팬 옆 온도를 보세요. 기름이 일렁이면 준비 완료.',()=>G.cw[2].T>=160,'160°C'),
    tDump([{k:'cw',i:2}],'썬 재료를 팬에 털어 넣어요',()=>cwHas(2,'kimchi')),...tSpatStir(2,'김치가 익을 때까지 볶아요',()=>G.cw[2].items.some(o=>o.type==='kimchi'&&o.cook>.7)),tHand(),
    tPour('soy',[{k:'cw',i:2}],'간장을 팬 빈 곳에 둘러요',()=>G.cw[2].items.some(o=>o.coat.dark>.004||o.fire>.005),'재료 위가 아니라 뜨거운 팬 바닥에 부으면 치익— 하고 눌어 불향이 나요. 1큰술(15ml) 정도.'),
    tFridge('rice','찬밥'),St('밥을 팬에 부어요','큰 팬 위를 클릭하면 밥이 쏟아져요.',[{k:'cw',i:2}],()=>G.cw[2].items.filter(o=>o.kind==='grain').length>100,'클릭'),
    ...tSpatStir(2,'밥 덩어리를 풀어가며 볶아요',()=>{const g=G.cw[2].items.filter(o=>o.kind==='grain');return g.length&&g.reduce((s,o)=>s+o.stick,0)/g.length<.35;}),tHand(),
    tFire(3),tPour('oil',[{k:'cw',i:3}],'작은 팬에도 기름 조금',()=>G.cw[3].oilAmt>=2),tFridge('egg','계란'),St('작은 팬에 계란을 톡 깨 넣어요','작은 팬 위를 클릭해요.',[{k:'cw',i:3}],()=>G.cw[3].eggs.length>0,'클릭'),
    tWait(3,'흰자가 하얗게 익을 때까지','노른자는 말랑한 반숙이 좋아요. 너무 오래 두면 바닥이 타요.',()=>G.cw[3].eggs.some(e=>e.set>.95),'흰자'),
    tPanTo(2,'plate','볶음밥을 접시에 담아요',()=>G.plate.items.some(o=>o.kind==='grain')),tPanTo(3,'plate','계란후라이를 올려요',()=>G.plate.eggs.length>0),
    tShake('sesame',[{k:'plate'}],'통깨를 솔솔 (선택)',()=>(G.plate.garn||{}).sesame>.2),tServe()],
  efr:()=>[tFridge('scallion','대파'),tBoard('scallion','대파'),tKnife(),tSlice('scallion','대파',8,460,'대파를 칼을 조금씩 옮기며 얇게 송송 썰어요.'),tHand(),
    tFire(2),tPour('oil',[{k:'cw',i:2}],'큰 팬에 식용유 넉넉히',()=>G.cw[2].oilAmt>=6),tWait(2,'팬을 달궈요 (150°C)','',()=>G.cw[2].T>=150,'150°C'),
    tDump([{k:'cw',i:2}],'파를 넣어 파기름을 내요',()=>cwHas(2,'scallion')),tWait(2,'파 향이 날 때까지 볶아요','파가 기름에서 지글거리며 향이 배어 나와요. (약 5초)',()=>G.cw[2].flav.scal>4,'파기름'),
    tFridge('egg','계란'),St('계란을 팬에 깨 넣어요','큰 팬 위를 클릭해요.',[{k:'cw',i:2}],()=>G.cw[2].eggs.length>0||any('curd'),'클릭'),
    ...tSpatStir(2,'뒤집개로 휘저어 스크램블',()=>any('curd')),tHand(),tFridge('rice','찬밥'),St('밥을 팬에 부어요','큰 팬 위를 클릭해요.',[{k:'cw',i:2}],()=>G.cw[2].items.filter(o=>o.kind==='grain').length>100,'클릭'),
    ...tSpatStir(2,'밥을 풀어가며 볶아요',()=>{const g=G.cw[2].items.filter(o=>o.kind==='grain');return g.length&&g.reduce((s,o)=>s+o.stick,0)/g.length<.35;}),tHand(),
    tShake('salt',[{k:'cw',i:2}],'소금으로 간해요',()=>G.cw[2].items.some(o=>o.kind==='grain'&&o.coat.salt>.003)),...tSpatStir(2,'한 번 더 골고루 볶아요',OPT(()=>false,5)),tHand(),
    tPanTo(2,'plate','접시에 담아요',()=>G.plate.items.some(o=>o.kind==='grain')),tServe()],
  janchi:()=>[tWater(0,900),tFire(0,true),tFridge('zucchini','애호박'),tBoard('zucchini','애호박'),tKnife(),tSlice('zucchini','애호박',6,900,'애호박을 도마에서 오른쪽 클릭으로 세로로 돌린 뒤 길게 얇게(채) 썰어요.'),tHand(),
    tFridge('anchovy','멸치육수'),St('멸치육수를 편수냄비에 부어요','편수냄비(손잡이 긴 작은 냄비) 위에서 누르고 있어요. 다 부었으면 오른쪽 클릭으로 냉장고에 넣어요.',[{k:'cw',i:1}],()=>liq(1)&&liq(1).vol>=300,'편수냄비'),
    tFire(1),tPour('soy',[{k:'cw',i:1}],'간장으로 국물 간하기',()=>liq(1)&&saltPct(liq(1))>.65,'진간장을 편수냄비에 조금씩. 너무 많이 넣으면 짜요.'),tDump([{k:'cw',i:1}],'애호박을 국물에 넣어 익혀요',()=>cwHas(1,'zucchini')),
    tBoil(0),...tNoodlePantry('somyeon','소면',0),...tStirNoodle(0),tHand(),tNoodleDone(0,.93),...tDrain(0),tStrainerTo('bowl','면을 그릇에 담아요'),
    tPanTo(1,'bowl','뜨거운 국물을 부어요',()=>G.bowl.liq&&G.bowl.liq.vol>150),tShake('gim',[{k:'bowl'}],'김가루를 솔솔',()=>(G.bowl.garn||{}).gim>.2),tServe()],
  kmari:()=>[tWater(0,900),tFire(0,true),tFridge('kimchi','김치'),tBoard('kimchi','김치'),tKnife(),tDice('kimchi','김치',6,700),tHand(),tFridge('cucumber','오이'),tBoard('cucumber','오이'),tKnife(),tSlice('cucumber','오이',4,900,'오른쪽 클릭으로 도마를 돌려 오이를 길게 채 썰어요.'),tHand(),
    tBoil(0),...tNoodlePantry('somyeon','소면',0),...tStirNoodle(0),tHand(),tNoodleDone(0,.93),...tDrain(0),St('면이 차가워질 때까지 헹궈요','찬물을 계속 틀어 두면 면 온도가 뚝 떨어져요.',[{k:'strainer'}],()=>G.strainer.noodles.some(n=>n.T<16),'차갑게'),
    tStrainerTo('bowl','면을 그릇에 담아요'),tFridge('kbroth','김치말이 육수'),St('육수를 그릇에 부어요','그릇 위에서 누르고 있어요.',[{k:'bowl'}],()=>G.bowl.liq&&G.bowl.liq.vol>=200,'그릇'),
    tFridge('ice','얼음'),St('얼음을 넣어요','그릇을 클릭해요. 살얼음처럼 시원해야 해요.',[{k:'bowl'}],()=>G.bowl.ice.length>0,'얼음'),tDump([{k:'bowl'}],'김치와 오이를 올려요',()=>vHas(G.bowl,'kimchi')),
    tPour('ses',[{k:'bowl'}],'참기름 한 방울 (선택)',OPT(()=>G.bowl.fluid.some(q=>q.k==='ses'))),tShake('sugar',[{k:'bowl'}],'설탕 한 꼬집 (선택)',OPT(()=>(G.bowl.flav.sweet||0)>.8)),tPour('vinegar',[{k:'bowl'}],'식초 조금 — 새콤하게 (선택)',OPT(()=>(G.bowl.flav.sour||0)>3)),tServe()],
  bibim:()=>[tWater(0,900),tFire(0,true),tFridge('cucumber','오이'),tBoard('cucumber','오이'),tKnife(),tSlice('cucumber','오이',4,900,'오른쪽 클릭으로 도마를 돌려 오이를 길게 채 썰어요.'),tHand(),
    tBoil(0),tFridge('egg','계란'),St('계란을 껍질째 냄비 가운데에','냄비 가운데를 클릭하면 껍질째 퐁당. (가장자리를 클릭하면 깨져 들어가요)',[{k:'cw',i:0}],()=>G.cw[0].beggs.length>0,'가운데'),
    ...tNoodlePantry('somyeon','소면',0),...tStirNoodle(0),tHand(),tNoodleDone(0,.93),...tDrain(0),
    St('체에서 계란을 집어 도마에','빈손으로 체 안의 계란을 클릭하면 집혀요. 도마를 클릭하면 껍질이 까져서 올라가요.',[{k:'strainer'},{k:'board'}],()=>G.board.pieces.some(p=>p.type==='begg'),'계란'),tKnife(),St('계란을 반으로 잘라요','칼로 계란 가운데를 한 번 클릭.',[{k:'board'}],()=>allItems().some(o=>o.type==='begg'&&o.area<o.orig*.8),'반으로'),tHand(),
    tStrainerTo('bowl','면을 그릇에 담아요'),tPour('bibim',[{k:'bowl'}],'비빔장 40ml 정도',()=>G.bowl.fluid.some(q=>q.k==='bibim')||G.bowl.noodles.some(n=>n.coat.sauce>5)),
    tTool('chop','긴 젓가락으로 비벼요.'),St('골고루 비벼요','그릇 안을 누른 채 휘저어요. 면이 빨갛게 고루 물들 때까지!',[{k:'bowl'}],()=>G.bowl.noodles.some(n=>n.mixEven>.6),'비비기'),tHand(),
    tDump([{k:'bowl'}],'오이와 계란을 올려요',()=>vHas(G.bowl,'cucumber')),tShake('sesame',[{k:'bowl'}],'통깨 솔솔',()=>(G.bowl.garn||{}).sesame>.2),tShake('sugar',[{k:'bowl'}],'설탕 한 꼬집 (선택)',OPT(()=>(G.bowl.flav.sweet||0)>.8)),tPour('vinegar',[{k:'bowl'}],'식초 조금 — 새콤달콤하게 (선택)',OPT(()=>(G.bowl.flav.sour||0)>3)),tServe()],
  ramyeon:()=>[tWater(0,550),tFire(0,true),tFridge('scallion','대파'),tBoard('scallion','대파'),tKnife(),tSlice('scallion','대파',5,460),tHand(),tBoil(0),...tNoodlePantry('ramyeon','라면',0),
    St('스프를 넣어요','면을 넣으면 손에 스프 봉지가 들려요. 냄비를 클릭해요.',[{k:'cw',i:0}],()=>liq(0)&&liq(0).spicy>3,'스프'),...tStirNoodle(0),tHand(),
    tFridge('egg','계란'),St('계란을 냄비 가장자리에 톡','냄비 가장자리를 클릭하면 깨져서 들어가요.',[{k:'cw',i:0}],()=>G.cw[0].eggs.length>0,'가장자리'),tDump([{k:'cw',i:0}],'파를 넣어요',()=>cwHas(0,'scallion')),
    St('면이 알맞게 익을 때까지','주문표의 “꼬들하게/보통으로”를 확인하세요. 꼬들하면 조금 일찍!',[{k:'cw',i:0},{k:'rail'}],()=>{const o=selOrder();const lo=o&&o.opt?o.opt[1][0]:.88;return G.cw[0].noodles.some(n=>n.done>=lo);},'주문 확인'),
    tPanTo(0,'bowl','냄비째 그릇에 부어요',()=>G.bowl.noodles.length>0),tServe()],
  kjeon:()=>jeonTut('kimchi','김치',()=>[tDice('kimchi','김치',8,900)]),
  pajeon:()=>jeonTut('jjokpa','쪽파',()=>[St('쪽파를 6~10cm 길이로 썰어요','칼을 크게크게 옮기며 3~4번만 썰어요.',[{k:'board'}],()=>cutN('jjokpa',2000)>=6,'길게')],true),
  buchu:()=>jeonTut('buchu','부추',()=>[St('부추를 4~7cm 길이로 썰어요','칼을 큼직큼직하게 옮기며 썰어요.',[{k:'board'}],()=>cutN('buchu',2000)>=5,'썰기')],true),
  udon:()=>[tWater(0,900),tFire(0,true),tFridge('dashi','가쓰오 다시'),St('다시를 편수냄비에 부어요','편수냄비(손잡이 긴 작은 냄비) 위에서 누르고 있어요.',[{k:'cw',i:1}],()=>liq(1)&&liq(1).vol>=300,'편수냄비'),
    tPour('tsuyu',[{k:'cw',i:1}],'쯔유로 간해요',()=>liq(1)&&saltPct(liq(1))>1),tFire(1),tFridge('scallion','대파'),tBoard('scallion','대파'),tKnife(),tSlice('scallion','대파',4,460),tHand(),
    tFridge('naruto','어묵'),tBoard('naruto','어묵'),tKnife(),tSlice('naruto','어묵',3,400,'어묵을 얇게 썰면 단면에 분홍 소용돌이가 보여요.'),tHand(),tBoil(0),...tNoodleFridge('udon','냉동 우동',0),...tStirNoodle(0),
    tNoodleDone(0,.92,'면이 익을 때까지 (냉동이라 조금 걸려요)'),St('젓가락으로 면을 건져 그릇에','긴 젓가락으로 면을 짧게 클릭하면 집혀요. 그다음 그릇을 클릭해요.',[{k:'cw',i:0},{k:'bowl'}],()=>G.bowl.noodles.length>0,'건지기'),tHand(),
    tPanTo(1,'bowl','국물을 부어요',()=>G.bowl.liq&&G.bowl.liq.vol>150),tDump([{k:'bowl'}],'파와 어묵을 올려요',()=>vHas(G.bowl,'naruto')),tShake('shichimi',[{k:'bowl'}],'시치미 솔솔 (선택)',OPT(()=>((G.bowl.garn||{}).shichimi||0)>.05)),tServe()],
  shoyu:()=>[tWater(0,900),tFire(0,true),tBoil(0),tFridge('egg','계란'),St('계란을 껍질째 냄비 가운데에','냄비 가운데를 클릭해요.',[{k:'cw',i:0}],()=>G.cw[0].beggs.length>0,'가운데'),
    tFridge('rstock','라멘 육수'),St('라멘 육수를 편수냄비에','편수냄비 위에서 누르고 있어요.',[{k:'cw',i:1}],()=>liq(1)&&liq(1).vol>=300,'편수냄비'),tPour('shoyu',[{k:'cw',i:1}],'쇼유 타레로 간해요',()=>liq(1)&&saltPct(liq(1))>1.1),tFire(1),
    tFridge('chashu','차슈'),tBoard('chashu','차슈'),tKnife(),tSlice('chashu','차슈',2,2000,'차슈를 1cm 두께로 도톰하게.'),tHand(),
    tWait(0,'계란이 반숙이 될 때까지 (약 50초)','노른자가 쫀득하게 익는 시간이에요.',()=>G.cw[0].beggs.some(b=>b.yolk>.42),'50초'),tTool('chop','긴 젓가락으로 계란을 건져요.'),
    St('계란을 건져 도마에','젓가락으로 계란을 짧게 클릭하면 집혀요. 도마를 클릭해요.',[{k:'cw',i:0},{k:'board'}],()=>G.board.pieces.some(p=>p.type==='begg'),'계란'),tKnife(),St('계란을 반으로','칼로 한 번.',[{k:'board'}],()=>allItems().some(o=>o.type==='begg'&&o.area<o.orig*.8),'반으로'),tHand(),
    ...tNoodleFridge('ramen','생라멘',0),...tStirNoodle(0),tNoodleDone(0,.9,'생면은 금방 익어요 (약 20초)'),St('젓가락으로 면을 건져 그릇에','면을 짧게 클릭해 집고 그릇을 클릭.',[{k:'cw',i:0},{k:'bowl'}],()=>G.bowl.noodles.length>0,'건지기'),tHand(),
    tPanTo(1,'bowl','국물을 부어요',()=>G.bowl.liq&&G.bowl.liq.vol>150),tDump([{k:'bowl'}],'차슈·계란을 올려요',()=>vHas(G.bowl,'chashu')),St('김 한 장을 세워요','선반의 김을 집어 그릇 가장자리를 클릭.',[{k:'pantry',id:'nori'},{k:'bowl'}],()=>G.bowl.seeds.some(s=>s.type==='nori'),'김'),tServe()],
  yaki:()=>[tFridge('pork','삼겹살'),tBoard('pork','삼겹살'),tKnife(),tDice('pork','삼겹살',4,2000),tHand(),tFridge('cabbage','양배추'),tBoard('cabbage','양배추'),tKnife(),tDice('cabbage','양배추',6,2500),tHand(),
    tFire(2),tPour('oil',[{k:'cw',i:2}],'큰 팬에 기름',()=>G.cw[2].oilAmt>=4),tWait(2,'팬을 달궈요 (170°C)','',()=>G.cw[2].T>=170,'170°C'),tDump([{k:'cw',i:2}],'고기와 양배추를 넣어요',()=>cwHas(2,'pork')),
    ...tSpatStir(2,'고기가 익을 때까지 볶아요',()=>G.cw[2].items.some(o=>o.type==='pork'&&o.cook>.7)),tHand(),tFridge('yakisoba','야키소바면'),St('면을 팬에 넣어요','큰 팬을 클릭해요.',[{k:'cw',i:2}],()=>G.cw[2].noodles.length>0,'클릭'),
    tPour('water',[{k:'cw',i:2}],'물을 조금 부어 면을 풀어요',()=>G.cw[2].noodles.some(n=>n.stick<.6),'물 주전자로 1~2초만.'),...tSpatStir(2,'면을 풀어가며 볶아요',()=>G.cw[2].noodles.every(n=>n.stick<.3)),tHand(),
    tPour('ysauce',[{k:'cw',i:2}],'야키소바 소스를 둘러요',()=>G.cw[2].noodles.some(n=>n.coat.sauce>8)),...tSpatStir(2,'소스가 고루 묻게 볶아요',()=>G.cw[2].noodles.some(n=>n.coat.sauce>20)),tHand(),
    tPanTo(2,'plate','접시에 담아요',()=>G.plate.noodles.length>0),tShake('aonori',[{k:'plate'}],'아오노리 솔솔',()=>(G.plate.garn||{}).aonori>.1),tServe()],
  steak:()=>[tFridge('beef','소고기 등심'),tBoard('beef','소고기'),tShake('salt',[{k:'board'}],'고기에 소금을 뿌려요',()=>allItems().some(o=>o.type==='beef'&&o.coat.salt>.005)),tShake('pepper',[{k:'board'}],'후추도 솔솔 (선택)',OPT(()=>allItems().some(o=>o.type==='beef'&&o.spice>0))),
    tFire(2,true),tPour('oil',[{k:'cw',i:2}],'큰 팬에 기름',()=>G.cw[2].oilAmt>=2),tWait(2,'팬을 뜨겁게 (200°C)','연기가 살짝 날 만큼 뜨거워야 크러스트가 생겨요.',()=>G.cw[2].T>=200,'200°C'),
    St('고기를 손으로 잡아 팬에','빈손으로 도마 위 고기를 잡고 큰 팬으로 끌어다 놓아요.',[{k:'board'},{k:'cw',i:2}],()=>cwHas(2,'beef'),'끌기'),
    tWait(2,'아랫면에 갈색 크러스트가 생길 때까지','',()=>G.cw[2].items.some(o=>o.type==='beef'&&o.face[o.down]>.6),'크러스트'),tTool('spatula','뒤집개로 뒤집어요.'),
    St('고기를 뒤집어요','고기를 짧게 클릭하면 뒤집혀요. 30초마다 뒤집어 주세요.',[{k:'cw',i:2}],()=>G.cw[2].items.some(o=>o.type==='beef'&&o.face[0]>.6&&o.face[1]>.3),'클릭'),
    tTool('probe','온도계를 고기 위에 대면 속 온도가 보여요.'),St('주문 굽기보다 5°C 낮을 때까지','크러스트가 생겼으면 불을 중불로 줄여요. 레스팅하는 동안 속 온도가 5°C쯤 더 올라가요. 중간중간 뒤집개로 뒤집어요.',[{k:'cw',i:2},{k:'rail'}],()=>{const o=selOrder(),lo=o&&o.opt?o.opt[1][0]:54;return G.cw[2].items.some(b=>b.type==='beef'&&b.T>=lo-5);},'온도 확인'),
    tTool('chop','긴 젓가락(집게)으로 고기를 옮겨요.'),St('고기를 집어 도마로','젓가락으로 고기를 짧게 클릭해 집고 도마를 클릭해요.',[{k:'cw',i:2},{k:'board'}],()=>G.board.pieces.some(p=>p.type==='beef'),'도마'),
    St('25초 레스팅','바로 썰면 육즙이 흘러나와요. 잠깐 기다려요.',[{k:'board'}],()=>G.board.pieces.some(p=>p.type==='beef'&&G.t-(p.offT||0)>25),'기다려요'),tKnife(),tSlice('beef','고기',4,99999,'1.5cm 간격으로 썰면 단면의 익은 정도가 보여요.'),tHand(),
    tDump([{k:'plate'}],'접시에 담아요',()=>vHas(G.plate,'beef')),tServe()],
  aglio:()=>pastaTut(false),pomo:()=>pastaTut(true),
};
function jeonTut(id,name,cut,press){return[tFridge(id,name),tBoard(id,name),tKnife(),...cut(),tHand(),
  St('부침가루를 반죽 볼에 부어요','선반의 부침가루를 집고 반죽 볼 위에서 누르고 있어요. 100g 정도 (볼 아래 숫자).',[{k:'pantry',id:'flour'},{k:'mix'}],()=>G.mix.flour>=80,'부침가루'),
  St('물을 부어요 (가루의 1.3배)','물 주전자로 약 130ml. 너무 적으면 두껍고, 많으면 찢어져요.',[{k:'pantry',id:'water'},{k:'mix'}],()=>G.mix.water>=100,'물'),
  tDump([{k:'mix'}],`${T_(name,'을','를')} 반죽 볼에 넣어요`,()=>G.mix.items.some(o=>o.type===id)),tTool('chop','긴 젓가락으로 반죽을 섞어요.'),St('날가루가 없어지게 섞어요','반죽 볼 안을 누른 채 휘저어요.',[{k:'mix'}],()=>G.mix.mixv>.8,'섞기'),tHand(),
  tFire(2),tPour('oil',[{k:'cw',i:2}],'큰 팬에 기름 넉넉히',()=>G.cw[2].oilAmt>=8,'전은 기름이 넉넉해야 가장자리가 바삭해요.'),tWait(2,'팬을 달궈요 (170°C)','',()=>G.cw[2].T>=170,'170°C'),
  St('반죽을 팬에 부어요','반죽 볼 가장자리를 잡고 큰 팬으로 끌어다 놓아요.',[{k:'mix'},{k:'cw',i:2}],()=>G.cw[2].jeons.length>0,'볼 가장자리'),
  ...(press?[tTool('spatula','뒤집개로 꾹 눌러요.'),St('뒤집개로 꾹 눌러 얇게','전 위를 누른 채 가만히 있으면 얇게 펴져요.',[{k:'cw',i:2}],()=>G.cw[2].jeons.some(j=>j.thick<j.thick0*.9),'꾹')]:[tTool('spatula','뒤집개로 전을 뒤집어요.')]),
  tWait(2,'아랫면이 노릇해질 때까지','윗면 반죽이 굳어 가고 가장자리가 갈색이 되면 뒤집을 때예요. 너무 일찍 뒤집으면 찢어져요.',()=>G.cw[2].jeons.some(j=>j.fb[0]>.5&&j.set>.5),'노릇'),
  St('뒤집어요','전을 짧게 클릭하면 뒤집혀요. (팬 손잡이를 탁 클릭하는 공중 뒤집기도 가능!)',[{k:'cw',i:2}],()=>G.cw[2].jeons.some(j=>j.down===1),'뒤집기'),tHand(),
  tPour('oil',[{k:'cw',i:2}],'가장자리에 기름을 한 번 더 (선택)',OPT(()=>false,8)),tWait(2,'반대쪽도 노릇하게','',()=>G.cw[2].jeons.some(j=>j.fb[1]>.5),'노릇'),tPanTo(2,'plate','접시에 담아요',()=>G.plate.jeons.length>0),tServe()];}
function pastaTut(tom){return[tWater(0,900),tShake('salt',[{k:'cw',i:0}],'물에 소금을 넉넉히 (약 1%)',()=>liq(0)&&saltPct(liq(0))>.6),tFire(0,true),tFridge('garlic','마늘'),tBoard('garlic','마늘'),tKnife(),tSlice('garlic','마늘',5,400,'마늘을 얇게 편 썰기.'),tHand(),
  ...(tom?[tFridge('onion','양파'),tBoard('onion','양파'),tKnife(),tDice('onion','양파',6,700),tHand()]:[]),
  tBoil(0),...tNoodlePantry('spaghetti','스파게티',0),...tStirNoodle(0),tHand(),tFire(2),tPour('olive',[{k:'cw',i:2}],'큰 팬에 올리브유',()=>G.cw[2].oilAmt>=4),
  tDump([{k:'cw',i:2}],tom?'마늘·양파를 팬에':'마늘을 팬에',()=>cwHas(2,'garlic')),tWait(2,'마늘이 노릇해질 때까지','너무 센불이면 마늘이 금방 타서 써져요.',()=>G.cw[2].items.some(o=>o.type==='garlic'&&Math.max(o.face[0],o.face[1])>.25),'노릇'),
  ...(tom?[tPour('tomato',[{k:'cw',i:2}],'토마토 소스를 부어요',()=>G.cw[2].fluid.some(q=>q.k==='tomato'))]:[]),
  tNoodleDone(0,.85,'면이 알 덴테가 될 때까지 (약 50초)'),tTool('ladle','국자로 면수를 떠요.'),St('면수를 한 국자 팬에','국자로 냄비를 짧게 클릭하면 떠지고, 팬을 클릭하면 부어요.',[{k:'cw',i:0},{k:'cw',i:2}],()=>G.cw[2].fluid.some(q=>q.k==='pastaw'||q.k==='emul')||G.cw[2].liq,'국자'),
  tTool('chop','긴 젓가락으로 면을 옮겨요.'),St('면을 건져 팬으로','면을 짧게 클릭해 집고 큰 팬을 클릭해요.',[{k:'cw',i:0},{k:'cw',i:2}],()=>G.cw[2].noodles.length>0,'건지기'),tHand(),
  St('팬 손잡이를 탁탁 쳐서 버무려요','손잡이를 여러 번 짧게 클릭하면 팬이 튀겨지며 면수와 기름이 섞여 소스가 돼요.',[{k:'handle',i:2}],()=>G.cw[2].noodles.some(n=>n.coat.sauce>(tom?15:5)),'탁탁'),
  tPanTo(2,'plate','접시에 담아요',()=>G.plate.noodles.length>0),tShake(tom?'parm':'parsley',[{k:'plate'}],tom?'파마산 솔솔':'파슬리 솔솔',OPT(()=>((G.plate.garn||{})[tom?'parm':'parsley']||0)>.05)),tServe()];}
function tutStart(rid){const f=TUTS[rid];if(!f)return;TUT.on=true;TUT.kind='recipe';TUT.steps=f();TUT.i=0;$('#rail').hidden=true;$('#recipePop').hidden=true;renderTut();}
function tutStop(){TUT.on=false;$('#tut').hidden=true;$('#tour').hidden=true;$('#rail').hidden=false;}
function tutTick(){if(!TUT.on||TUT.kind!=='recipe')return;const s=TUT.steps[TUT.i];if(!s)return;if(TUT.ti!==TUT.i){TUT.ti=TUT.i;TUT.t0=G.t;}let ok=false;try{ok=s.ok();}catch(e){}
  if(ok){const q=s.hl&&s.hl.length?tgtOf(s.hl[s.hl.length-1]):null;TUT.i++;AU.ding();if(q)floatText(pick(['좋아요!','잘했어요!','완벽해요!','그렇죠!']),q.x,q.y-40,'#ffe9a0',26);renderTut();}}
function renderTut(){const el=$('#tut');if(!TUT.on||TUT.kind!=='recipe'){el.hidden=true;return;}const s=TUT.steps[TUT.i],n=TUT.steps.length;
  el.innerHTML=`<div class="tt-h"><span>가이드 ${Math.min(TUT.i+1,n)} / ${n}</span><span class="tt-b"><button type="button" id="ttPrev">이전</button><button type="button" id="ttNext">건너뛰기</button><button type="button" id="ttOff">끄기</button></span></div>
    <div class="tt-bar"><i style="width:${(TUT.i/n*100).toFixed(0)}%"></i></div><b>${s?s.t:'완성!'}</b><p>${s?s.d:''}${s&&s.ok&&s.ok.opt?'<br><small style="opacity:.7">해도 되고 안 해도 돼요 — 잠시 뒤 자동으로 넘어가요.</small>':''}</p>`;el.hidden=false;
  $('#ttPrev').onclick=()=>{TUT.i=Math.max(0,TUT.i-1);renderTut();};$('#ttNext').onclick=()=>{TUT.i=Math.min(n-1,TUT.i+1);renderTut();};$('#ttOff').onclick=()=>{tutStop();$('#recipePop').hidden=false;renderSteps();};}

/* kitchen tour */
const TOUR=[
  [{k:'fridge'},'냉장고','김치·채소·고기·계란·면·육수 같은 신선 재료가 있어요. 클릭하면 문이 열리고, 재료를 누르면 손에 들려요. (단축키 F)'],
  [{k:'shelf1'},'선반 위 칸','병 양념(식용유·간장·참기름·쯔유·소스…), 물 주전자, 부침가루, 소면·라면·스파게티. 병은 집은 뒤 누르고 있으면 부어져요.'],
  [{k:'shelf2'},'선반 아래 칸','뿌리는 양념통이에요. 집은 뒤 누른 채 좌우로 흔들면 솔솔 뿌려져요.'],
  [{k:'board'},'도마','재료를 올려놓고 썰어요. 오른쪽 클릭(R)으로 도마를 돌리고, 빈 곳이나 가장자리를 잡고 끌면 도마째 털어 넣어요.'],
  [{k:'prep'},'작은 그릇 2개','손질한 재료를 잠시 담아 두는 곳이에요. 도마가 복잡할 때 써요.'],
  [{k:'rack'},'도구 거치대','왼쪽부터 식칼 · 뒤집개 · 긴 젓가락 · 국자 · 온도계. 클릭하면 집고, 다시 클릭하면 내려놓아요. (숫자키 1~6)'],
  [{k:'rack',id:'spatula'},'뒤집개','팬 전용. 누른 채 저으면 볶아지고, 짧게 클릭하면 그 자리를 뒤집어요. 전 위에서 가만히 누르면 얇게 펴져요.'],
  [{k:'rack',id:'chop'},'긴 젓가락','냄비·그릇·반죽 볼을 저어요. 짧게 클릭하면 재료나 면을 집어 옮길 수 있어요 (스테이크, 면 건지기).'],
  [{k:'rack',id:'ladle'},'국자','국물·면수·반죽·녹인 버터를 떠서 옮겨요. 짧게 클릭하면 뜨고, 다른 곳을 클릭하면 부어요.'],
  [{k:'rack',id:'probe'},'온도계','재료나 냄비 위에 대면 온도가 보여요. 스테이크 속 온도를 잴 때 필수!'],
  [{k:'mix'},'반죽 볼','전 반죽을 만드는 곳. 부침가루와 물을 붓고 재료를 넣어 젓가락으로 섞어요. 가장자리를 잡고 팬으로 끌면 부어져요.'],
  [{k:'sink'},'싱크대','수도꼭지를 클릭하면 찬물이 나와요. 냄비를 끌어와 쏟으면 물은 빠지고 면만 체에 남아요. 찬물로 헹구면 면이 탱글해져요.'],
  [{k:'cw',i:0},'냄비 (뒤 왼쪽)','양손잡이 큰 냄비예요. 물을 끓여 면을 삶고, 라면을 끓이고, 계란을 삶아요.'],
  [{k:'cw',i:1},'편수냄비 (뒤 오른쪽)','손잡이가 하나 달린 작은 냄비예요. 멸치육수·다시·라멘 육수처럼 국물을 데우는 데 써요.'],
  [{k:'cw',i:2},'큰 팬 (앞 왼쪽)','볶음밥, 전, 야키소바, 스테이크, 파스타 소스처럼 볶고 굽는 요리를 해요. 손잡이를 탁 클릭하면 팬을 튕겨 뒤집어요.'],
  [{k:'cw',i:3},'작은 팬 (앞 오른쪽)','계란후라이처럼 작은 요리용이에요.'],
  [{k:'knobs'},'화구 노브','노브마다 아래 점 그림에 어느 화구인지 주황 점으로 표시돼요. 클릭=중불, 위아래로 드래그=세기 조절. 조리도구 옆 숫자는 온도예요.'],
  [{k:'rail'},'주문표','손님 주문이 걸려요. 클릭하면 선택되고, 한 번 더 누르면 레시피 순서가 보여요. 아래 막대가 줄어들면 손님이 떠나요.'],
  [{k:'plate'},'접시','볶음밥·전·야키소바·스테이크·파스타는 접시에. 팬 손잡이를 잡고 끌어오면 담겨요.'],
  [{k:'bowl'},'그릇','국수·라면·우동·라멘은 그릇에 담아요.'],
  [{k:'serve'},'서빙','완성되면 눌러요. 맛·익힘·칼질·간을 채점하고 돈을 받아요.'],
  [{k:'trash'},'음식물 쓰레기통','망친 요리는 냄비·팬·그릇째 여기로 끌어다 버려요.'],
];
function tourStart(){TUT.fromTitle=!$('#title').hidden;if(TUT.fromTitle)$('#title').hidden=true;TUT.on=true;TUT.kind='tour';TUT.i=0;TUT.steps=TOUR.map(t=>({hl:[t[0]],t:t[1],d:t[2]}));if(G){G.paused=true;}renderTour();}
function renderTour(){const el=$('#tour'),s=TUT.steps[TUT.i],n=TUT.steps.length,q=tgtOf(s.hl[0]);
  el.innerHTML=`<div class="tt-h"><span>주방 둘러보기 ${TUT.i+1} / ${n}</span></div><b>${s.t}</b><p>${s.d}</p><div class="to-b"><button type="button" id="toPrev">이전</button><button type="button" id="toEnd">닫기</button><button type="button" id="toNext" class="big-btn">${TUT.i<n-1?'다음':'시작하기'}</button></div>`;
  const w=380,left=q.x<800?Math.min(1600-w-16,q.x+(q.rect?q.w/2:q.r)+40):Math.max(16,q.x-(q.rect?q.w/2:q.r)-40-w),top=clamp(q.y-80,60,760);el.style.left=left+'px';el.style.top=top+'px';el.hidden=false;
  $('#toPrev').onclick=()=>{TUT.i=Math.max(0,TUT.i-1);renderTour();};$('#toNext').onclick=()=>{if(TUT.i<n-1){TUT.i++;renderTour();}else tourEnd();};$('#toEnd').onclick=tourEnd;}
function tourEnd(){TUT.on=false;$('#tour').hidden=true;if(TUT.fromTitle){TUT.fromTitle=false;$('#title').hidden=false;}SAVE.toured=true;writeSave();if(G)G.paused=false;if(G&&G.pendingGuide){const r=G.pendingGuide;G.pendingGuide=null;tutStart(r);}}
