
/* ---------- guides for the 튀김 / 찜 packs ---------- */
const tBatter=(egg)=>[
  St('반죽 볼에 부침가루를 넣어요','선반의 부침가루를 집고 반죽 볼 위에서 누르고 있어요.',[{k:'pantry',id:'flour'},{k:'mix'}],()=>G.mix.flour>=60,'부침가루'),
  ...(egg?[tFridge('egg','계란'),St('계란을 반죽 볼에 톡',"반죽 볼을 클릭하면 깨져 들어가요.",[{k:'mix'}],()=>G.mix.egg>=1,'톡')]:[]),
  tPour('water',[{k:'mix'}],'찬물을 부어요 (가루 : 물 = 1 : 1.3)',()=>G.mix.water>=G.mix.flour*1.1,'물은 차가울수록 튀김옷이 바삭해요. 너무 많으면 묽어져요.'),
  tTool('chop','젓가락으로 반죽을 저어요.'),St('반죽을 고루 저어요','반죽 볼 안을 누른 채 휘저어요. 날가루가 조금 남아도 괜찮아요.',[{k:'mix'}],()=>G.mix.mixv>.55,'젓기'),tHand()];
const tOil=(i,T,ml)=>[
  tPour('oil',[{k:'cw',i}],`${CWN[i]}에 식용유를 넉넉히 (${ml}ml 이상)`,()=>isOil(G.cw[i])&&G.cw[i].liq.vol>=ml*.9,'기름이 재료가 잠길 만큼 있어야 해요. 물이 남아 있으면 안 돼요!'),
  tFire(i),tWait(i,`기름을 ${T}°C까지 달궈요`,`냄비 옆 온도가 ${T}°C 근처가 되면 넣을 때예요. 넘으면 노브를 내려 불을 줄여요.`,()=>isOil(G.cw[i])&&G.cw[i].liq.T>=T-5,`${T}°C`)];
const tFryIn=(i,n,title)=>[tTool('chop','젓가락으로 재료를 하나씩 집어요.'),
  St(title||'반죽 묻힌 재료를 기름에 넣어요','반죽 볼 속 재료를 젓가락으로 짧게 클릭해 집고(튀김옷이 입혀져요), 냄비를 클릭해 넣어요. 넣을 때마다 기름 온도가 뚝 떨어져요.',[{k:'mix'},{k:'cw',i}],()=>G.cw[i].items.filter(o=>o.bat).length>=n,'튀기기')];
const tFryOut=(i,n,k)=>[tWait(i,'노릇해질 때까지 튀겨요','튀김옷이 황금색이 되면 건질 때예요. 온도가 150°C 아래로 떨어지면 불을 올려요 — 낮으면 기름을 먹어 눅눅해져요.',()=>G.cw[i].items.some(o=>o.bat&&o.bat.fry>.65),'노릇하게'),
  St(`젓가락으로 건져 ${k==='plate'?'접시':'그릇'}에`,'튀김을 짧게 클릭해 집고 접시를 클릭해요. 하나씩 옮겨요.',[{k:'cw',i},{k}],()=>G[k].items.filter(o=>o.bat).length>=n,'건지기'),tHand()];
const tSteamerOn=(i)=>[St('선반에서 찜기를 집어요','선반 아래 칸의 대나무 찜기를 클릭해요.',[{k:'pantry',id:'steamer'}],()=>(G.held&&G.held.kind==='steamerItem')||!!G.steamer.on,'찜기'),
  St('찜기를 냄비 위에 올려요','물이 담긴 냄비를 클릭하면 찜기가 올라가요. 물이 끓으면 김이 올라와요.',[{k:'cw',i}],()=>G.steamer.on===G.cw[i],'냄비 위')];
Object.assign(TUTS,{
  yachae:()=>[tFridge('sweetpotato','고구마'),tBoard('sweetpotato','고구마'),tKnife(),tSlice('sweetpotato','고구마',4,2600,'0.7cm 두께로 동글동글 썰어요. 두꺼우면 속이 안 익어요.'),tHand(),
    tFridge('onion','양파 반쪽'),tBoard('onion','양파'),tKnife(),tSlice('onion','양파',2,3000,'양파는 1cm 두께로 둥글게.'),tHand(),
    ...tBatter(false),...tOil(0,170,400),tDump([{k:'mix'}],'썬 재료를 반죽 볼에 넣어요',()=>G.mix.items.length>=4),...tFryIn(0,4),...tFryOut(0,4,'plate'),tServe()],
  squidfry:()=>[tFridge('squid','오징어'),tBoard('squid','오징어'),tKnife(),tSlice('squid','오징어',5,2000,'몸통을 1cm 폭 링으로 썰어요.'),tHand(),
    ...tBatter(false),...tOil(0,175,400),tDump([{k:'mix'}],'오징어를 반죽 볼에 넣어요',()=>G.mix.items.length>=5),...tFryIn(0,5),...tFryOut(0,5,'plate'),tServe()],
  katsu:()=>[tFridge('loin','돈카츠용 등심'),...tBatter(true),
    St('등심을 반죽 볼에 넣어요','도마에 올리지 말고 냉장고에서 꺼낸 채로 반죽 볼을 클릭해요.',[{k:'mix'}],()=>G.mix.items.some(o=>o.type==='loin')||allItems().some(o=>o.type==='loin'&&o.bat),'반죽 볼'),
    tTool('chop','젓가락으로 등심을 집어요 — 튀김옷이 입혀져요.'),St('튀김옷 입은 등심을 도마에','반죽 볼 속 등심을 짧게 클릭해 집고 도마를 클릭해요.',[{k:'mix'},{k:'board'}],()=>G.board.pieces.some(p=>p.type==='loin'&&p.bat),'도마'),tHand(),
    tShake('panko',[{k:'board'}],'빵가루를 앞뒤로 듬뿍',()=>allItems().some(o=>o.type==='loin'&&o.bat&&o.bat.panko>.5)),
    ...tOil(0,160,500),St('등심을 기름에 넣어요','빈손으로 도마 위 등심을 끌어다 냄비에 놓아요.',[{k:'board'},{k:'cw',i:0}],()=>G.cw[0].items.some(o=>o.type==='loin'&&o.bat),'튀기기'),
    tWait(0,'속까지 익을 때까지 천천히','두꺼워서 오래 걸려요(약 1분). 160~170°C를 유지해요 — 너무 뜨거우면 겉만 타요.',()=>G.cw[0].items.some(o=>o.type==='loin'&&o.cook>.95&&o.bat.fry>.55),'속까지'),
    tTool('chop','젓가락으로 돈카츠를 건져요.'),St('돈카츠를 도마에','냄비 속 돈카츠를 짧게 클릭해 집고 도마를 클릭해요.',[{k:'cw',i:0},{k:'board'}],()=>G.board.pieces.some(p=>p.type==='loin'),'건지기'),
    tKnife(),tSlice('loin','돈카츠',4,8000,'2cm 폭으로 썰어요.'),tHand(),tDump([{k:'plate'}],'썬 돈카츠를 접시에',()=>G.plate.items.filter(o=>o.type==='loin').length>=3),
    tFridge('cabbage','양배추'),tBoard('cabbage','양배추'),tKnife(),St('양배추를 곱게 채 썰어요','도마를 돌려 가며 가늘게 여러 번.',[{k:'board'}],()=>cutN('cabbage',1200)>=6,'채썰기'),tHand(),tDump([{k:'plate'}],'양배추채를 접시 한쪽에',()=>vHas(G.plate,'cabbage')),
    tPour('katsu',[{k:'plate'}],'돈카츠 소스를 뿌려요',()=>G.plate.fluid.some(q=>q.k==='katsu')),tServe()],
  mandu:()=>[tWater(0,900),tFire(0,true),...tSteamerOn(0),tFridge('mandu','냉동 만두'),
    St('찜기에 만두를 넣어요','찜기(냄비 위)를 클릭하면 만두 6개가 둘러 담겨요.',[{k:'cw',i:0}],()=>G.steamer.items.filter(o=>o.type==='mandu').length>=4,'찜기'),
    tBoil(0),tWait(0,'속까지 푹 쪄요','김이 모락모락 나야 익어요. 물이 줄면 조금 더 부어요 (약 40초).',()=>G.steamer.items.some(o=>o.type==='mandu'&&o.cook>1.05),'찌기'),
    tTool('chop','젓가락으로 만두를 하나씩 꺼내요.'),St('만두를 접시에 옮겨요','찜기 속 만두를 짧게 클릭해 집고 접시를 클릭해요.',[{k:'cw',i:0},{k:'plate'}],()=>G.plate.items.filter(o=>o.type==='mandu').length>=5,'접시'),tHand(),tServe()],
  jjim:()=>[tWater(0,900),tFire(0,true),tFridge('egg','계란'),St('계란 3개를 반죽 볼에 톡','냉장고에서 계란을 꺼내 반죽 볼을 클릭 — 세 번 반복해요.',[{k:'fridge'},{k:'mix'}],()=>G.mix.egg>=3,'3개'),
    tPour('water',[{k:'mix'}],'물을 계란과 같은 양 (150ml)',()=>G.mix.water>=120,'물(또는 육수)이 계란과 1:1이면 부드러워요.'),tShake('salt',[{k:'mix'}],'소금 한 꼬집',()=>(G.mix.salt||0)>.3),
    tTool('chop','젓가락으로 계란물을 풀어요.'),St('계란물을 곱게 풀어요','흰자 덩어리가 없도록 충분히 휘저어요.',[{k:'mix'}],()=>G.mix.mixv>.7,'풀기'),tHand(),
    tBoil(0),...tSteamerOn(0),St('반죽 볼을 찜기 위로 끌어다 부어요','반죽 볼 가장자리를 잡고 냄비(찜기) 위에 놓으면 계란물이 찜기 속 그릇에 담겨요.',[{k:'mix'},{k:'cw',i:0}],()=>!!G.steamer.custard,'붓기'),
    St('불을 중약불로 줄여요','불이 세면 계란찜에 구멍이 숭숭 생겨요. 노브를 아래로 끌어 절반 아래로.',[{k:'knob',i:0}],()=>G.burners[0].level<=.45,'약불'),
    tWait(0,'몽글하게 익을 때까지','표면이 탱글하게 굳으면 다 익은 거예요 (약 40초).',()=>G.steamer.custard&&G.steamer.custard.set>=1,'익히기'),
    St('빈손으로 계란찜을 그릇에','찜기 가운데 계란찜을 클릭해 집고 그릇을 클릭해요.',[{k:'cw',i:0},{k:'bowl'}],()=>!!G.bowl.custard,'옮기기'),
    tShake('sesame',[{k:'bowl'}],'통깨 솔솔 (선택)',OPT(()=>((G.bowl.garn||{}).sesame||0)>.05)),tServe()],
});
