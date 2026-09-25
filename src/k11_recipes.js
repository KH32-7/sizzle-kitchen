
/* ---------- state queries for recipe steps ---------- */
const ALLC=()=>[...G.cw,G.mix,...G.prep,G.strainer,G.plate,G.bowl,...(G.steamer?[G.steamer]:[])];
function allItems(){const a=[...G.board.pieces];for(const c of ALLC())a.push(...c.items);for(const j of ALLC().flatMap(c=>c.jeons))a.push(...j.pieces);if(G.drag&&G.drag.kind==='handful')a.push(...G.drag.pieces);return a;}
const cutN=(t,max)=>allItems().filter(p=>p.type===t&&p.area<max&&p.area<p.orig*.9).length;
const anyN=(t,f)=>ALLC().some(c=>c.noodles.some(n=>n.type===t&&f(n,c)));
const hotPanOil=()=>G.cw.some(c=>c.kind==='pan'&&c.oilAmt>=4&&c.T>=160);
const panWith=(t,f)=>G.cw.some(c=>c.items.some(o=>o.type===t&&(!f||f(o))));
const vesselOf=R=>R.vessel==='bowl'?G.bowl:G.plate;
const liqWith=(f)=>ALLC().some(c=>c.liq&&c.liq.vol>30&&f(c.liq,c));

/* ---------- recipes ---------- */
const DLC={base:{n:'기본 메뉴',d:'한식 밥 요리',price:0},noodle:{n:'면 요리 팩',d:'삶고, 헹구고, 말아 내는 국수',price:0},jeon:{n:'전 팩',d:'반죽하고 부치는 바삭한 전',price:0},jp:{n:'일본 요리 팩',d:'우동 · 라멘 · 야키소바',price:0},west:{n:'양식 팩',d:'스테이크와 파스타',price:0}};
const REC=[
 {id:'kfr',n:'김치볶음밥',dlc:'base',price:9000,vessel:'plate',time:210,sub:'+ 반숙 계란후라이',
  steps:[['김치·양파·햄 한입 크기로 썰기',()=>cutN('kimchi',1300)>=8],['큰 팬 달구고 식용유 두르기 (160°C↑)',hotPanOil],['파 → 햄·양파 → 김치 순으로 볶기',()=>panWith('kimchi',o=>o.cook>.7)],
    ['간장을 뜨거운 팬 바닥에 눌리기',()=>G.cw.some(c=>c.items.some(o=>o.fire>.01))],['찬밥 넣고 뒤집개로 풀어가며 볶기',()=>G.cw.some(c=>{const g=c.items.filter(o=>o.kind==='grain');return g.length>100&&g.reduce((s,o)=>s+o.stick,0)/g.length<.35;})],
    ['작은 팬에 반숙 계란후라이',()=>ALLC().some(c=>c.eggs.some(e=>e.set>.95&&!e.poach))],['접시에 담고 참기름·깨·파로 마무리',()=>G.plate.items.some(o=>o.kind==='grain')&&G.plate.eggs.length>0]],
  spec:{knife:{kimchi:['dice',.5,5],onion:['dice',.35,3.6],ham:['dice',.35,3.6],scallion:['disc',.15,.9]},cook:{kimchi:.8,onion:1,ham:.7},brown:{ham:[.3,1.05]},rice:1,salt:[.8,1.5],mixRice:1,egg:'fried',garn:{sesame:.3,scallion:1,sesoil:1},fl:{fire:1,scal:1},
   req:[['rice','밥이 없는 김치볶음밥이라니요…'],['kimchi','김치가 안 들어갔어요!']],w:{knife:.12,cook:.24,season:.16,mix:.14,egg:.16,finish:.18}}},
 {id:'efr',n:'계란볶음밥',dlc:'base',price:8000,vessel:'plate',time:160,sub:'파기름 향 가득',
  steps:[['대파 송송 썰기',()=>cutN('scallion',460)>=8],['큰 팬에 기름 두르고 파기름 내기',()=>G.cw.some(c=>c.flav.scal>4)],['계란을 깨 넣고 뒤집개로 휘저어 스크램블',()=>allItems().some(o=>o.type==='curd')],
    ['찬밥 넣고 풀어가며 볶기',()=>G.cw.some(c=>c.items.filter(o=>o.kind==='grain').length>100)],['소금·간장으로 간하기',()=>G.cw.some(c=>c.items.some(o=>o.kind==='grain'&&o.coat.salt>.003))],['접시에 담기',()=>G.plate.items.some(o=>o.kind==='grain')]],
  spec:{knife:{scallion:['disc',.15,.9],ham:['dice',.3,3],carrot:['dice',.2,2]},cook:{scallion:.6,curd:.7},rice:1,salt:[.7,1.3],mixRice:1,curd:1,garn:{sesame:.3,sesoil:1},fl:{scal:1.4,fire:.6},req:[['rice','밥이 빠졌어요'],['curd','계란이 없어요']],w:{knife:.1,cook:.26,season:.2,mix:.2,finish:.24}}},
 {id:'janchi',n:'잔치국수',dlc:'noodle',price:8000,vessel:'bowl',time:230,sub:'멸치육수 · 애호박 고명',
  steps:[['애호박 채썰기',()=>cutN('zucchini',900)>=6],['냄비에 물 끓이기 (100°C)',()=>G.cw.some(c=>c.liq&&c.liq.T>=99)],['편수냄비에 멸치육수 데우고 간장으로 간',()=>liqWith(q=>q.umami>80&&q.T>70)],
    ['소면 삶기 — 끓어 넘치면 찬물 한 컵',()=>anyN('somyeon',n=>n.done>.9)],['체에 붓고 찬물로 헹구기 (수도 클릭)',()=>anyN('somyeon',n=>n.rinse>.5)],['그릇에 면 → 뜨거운 육수 → 고명(애호박·김가루·파)',()=>G.bowl.noodles.length>0&&G.bowl.liq&&G.bowl.liq.vol>150]],
  spec:{knife:{zucchini:['jul',.6,3,8],scallion:['disc',.15,.9]},cook:{zucchini:.5},noodle:{type:'somyeon',done:[.92,1.12],rinse:1},broth:{umami:.5,salt:[.7,1.25],T:'hot',vol:[280,650]},garn:{gim:.3,scallion:1,zucchini:1},req:[['noodle','면이 없어요!'],['broth','국물이 없어요']],w:{knife:.1,noodle:.3,broth:.3,finish:.3}}},
 {id:'kmari',n:'김치말이국수',dlc:'noodle',price:9000,vessel:'bowl',time:200,sub:'살얼음 동동 · 식초·설탕 약간',
  steps:[['김치 잘게 썰고 오이 채썰기',()=>cutN('kimchi',700)>=6&&cutN('cucumber',900)>=4],['소면 삶기',()=>anyN('somyeon',n=>n.done>.9)],['찬물에 박박 헹궈 차갑게',()=>anyN('somyeon',n=>n.rinse>.6&&n.T<18)],
    ['그릇에 면 + 김치말이 육수 + 얼음',()=>G.bowl.liq&&G.bowl.liq.vol>150&&G.bowl.ice.length>0],['김치·오이·깨·참기름 올리기',()=>G.bowl.items.length>4]],
  spec:{knife:{kimchi:['dice',.3,3],cucumber:['jul',.5,3,8]},noodle:{type:'somyeon',done:[.92,1.12],rinse:1,cold:1},broth:{kb:1,salt:[.9,1.6],T:'cold',vol:[250,600]},garn:{sesame:.3,sesoil:1,kimchi:1,cucumber:1},req:[['noodle','면이 없어요!'],['broth','육수가 없어요']],w:{knife:.12,noodle:.3,broth:.3,finish:.28}}},
 {id:'bibim',n:'비빔국수',dlc:'noodle',price:9000,vessel:'bowl',time:190,sub:'새콤달콤 매콤하게 · 설탕·식초 약간',
  steps:[['오이 채썰기, 김치 잘게 썰기',()=>cutN('cucumber',900)>=4],['계란 삶기 (껍질째 냄비 가운데에)',()=>ALLC().some(c=>c.beggs.length)||allItems().some(o=>o.type==='begg')],['소면 삶아 찬물에 헹구기',()=>anyN('somyeon',n=>n.rinse>.6)],
    ['그릇에 면 + 비빔장 (40ml 안팎)',()=>G.bowl.noodles.length&&(G.bowl.fluid.some(q=>q.k==='bibim')||G.bowl.noodles.some(n=>n.coat.sauce>5))],['젓가락으로 골고루 비비기',()=>G.bowl.noodles.some(n=>n.mixEven>.6)],['오이·김치·삶은 계란 반쪽·깨 올리기',()=>G.bowl.items.length>3]],
  spec:{knife:{cucumber:['jul',.5,3,8],kimchi:['dice',.3,3]},noodle:{type:'somyeon',done:[.92,1.12],rinse:1,cold:1,sauce:[.25,.7],mixEven:.6},begg:[.6,1.2],garn:{sesame:.3,sesoil:1,cucumber:1},req:[['noodle','면이 없어요!']],w:{knife:.12,noodle:.34,egg:.14,finish:.4}}},
 {id:'ramyeon',n:'라면',dlc:'noodle',price:5500,vessel:'bowl',time:150,sub:'물 550ml · 파 · 계란',opts:[['꼬들하게',[.72,.95]],['보통으로',[.88,1.08]]],
  steps:[['냄비에 물 550ml (물 주전자)',()=>G.cw.some(c=>c.liq&&c.liq.vol>450)],['물이 끓으면 면 + 스프 넣기',()=>anyN('ramyeon',n=>n.done>.2)],['파 송송, 계란 깨 넣기 (냄비 가장자리 클릭)',()=>G.cw.some(c=>c.eggs.length)],['면이 익으면 냄비째 그릇에 붓기',()=>G.bowl.noodles.some(n=>n.type==='ramyeon')]],
  spec:{knife:{scallion:['disc',.2,1.2]},noodle:{type:'ramyeon',done:'opt'},broth:{soup:1,salt:[.75,1.35],T:'hot',vol:[350,650]},pegg:1,garn:{scallion:1},req:[['noodle','면이 없어요!'],['broth','국물이 없어요']],w:{knife:.08,noodle:.35,broth:.3,egg:.1,finish:.17}}},
 {id:'kjeon',n:'김치전',dlc:'jeon',price:12000,vessel:'plate',time:200,sub:'가장자리 바삭하게',
  steps:[['김치 잘게 썰기',()=>cutN('kimchi',900)>=8],['반죽 볼에 부침가루 + 물 (1 : 1.3)',()=>G.mix.flour>40&&G.mix.water>40],['김치 넣고 젓가락으로 섞기',()=>G.mix.mixv>.7&&G.mix.items.length>4||G.cw.some(c=>c.jeons.length)],
    ['팬에 기름 넉넉히, 달궈지면 반죽 붓기',()=>G.cw.some(c=>c.jeons.length)],['바닥이 노릇해지면 뒤집기',()=>G.cw.some(c=>c.jeons.some(j=>j.down===1))],['기름 한 번 더, 양면 바삭하게 → 접시',()=>G.plate.jeons.length>0]],
  spec:{jeon:{main:'kimchi',mainSpec:['dice',.4,4],mainMin:.15},knife:{kimchi:['dice',.4,4],onion:['dice',.2,3]},garn:{},req:[['jeon','전이 없어요!']],w:{knife:.15,jeon:.7,finish:.15}}},
 {id:'pajeon',n:'파전',dlc:'jeon',price:14000,vessel:'plate',time:220,sub:'쪽파 가득, 오징어 약간',
  steps:[['쪽파를 6~10cm 길이로 썰기',()=>cutN('jjokpa',2000)>=8],['(선택) 오징어 썰기',()=>true],['부침가루 + 물 반죽, 쪽파 넣고 섞기',()=>G.mix.items.some(o=>o.type==='jjokpa')||G.cw.some(c=>c.jeons.some(j=>j.comp.jjokpa))],
    ['기름 두른 팬에 넓게 붓기',()=>G.cw.some(c=>c.jeons.length)],['뒤집개로 꾹꾹 눌러 얇게, 뒤집기',()=>G.cw.some(c=>c.jeons.some(j=>j.down===1))],['접시에 담기',()=>G.plate.jeons.length>0]],
  spec:{jeon:{main:'jjokpa',mainSpec:['len',5,11],mainMin:.12},knife:{jjokpa:['len',5,11],squid:['dice',.4,4]},garn:{},req:[['jeon','전이 없어요!']],w:{knife:.18,jeon:.7,finish:.12}}},
 {id:'buchu',n:'부추전',dlc:'jeon',price:12000,vessel:'plate',time:200,sub:'얇고 바삭하게',
  steps:[['부추를 4~7cm로 썰기',()=>cutN('buchu',2000)>=6],['반죽에 부추(와 양파·당근) 넣고 섞기',()=>G.mix.items.some(o=>o.type==='buchu')||G.cw.some(c=>c.jeons.some(j=>j.comp.buchu))],['기름 넉넉히 두른 팬에 얇게 펴기',()=>G.cw.some(c=>c.jeons.length)],['노릇하게 뒤집어 양면 굽기',()=>G.cw.some(c=>c.jeons.some(j=>j.down===1))],['접시에 담기',()=>G.plate.jeons.length>0]],
  spec:{jeon:{main:'buchu',mainSpec:['len',3.5,7.5],mainMin:.12},knife:{buchu:['len',3.5,7.5],onion:['jul',.5,2,6],carrot:['jul',.5,2,6]},garn:{},req:[['jeon','전이 없어요!']],w:{knife:.18,jeon:.7,finish:.12}}},
 {id:'udon',n:'우동',dlc:'jp',price:9000,vessel:'bowl',bowl:'udon',plating:'udon',time:180,sub:'가쓰오 다시 · 쯔유',
  steps:[['대파 송송, 어묵 얇게 썰기',()=>cutN('scallion',460)>=5&&cutN('naruto',400)>=3],['편수냄비에 다시 + 쯔유 데우기',()=>liqWith(q=>q.umami>80&&q.salt>2&&q.T>75)],['냄비에 물 끓여 냉동 우동 삶기 (젓가락으로 풀기)',()=>anyN('udon',n=>n.done>.9)],
    ['면 건져 그릇에 → 국물 붓기',()=>G.bowl.noodles.some(n=>n.type==='udon')&&G.bowl.liq&&G.bowl.liq.vol>150],['파·어묵 올리고 시치미 솔솔',()=>G.bowl.items.length>3]],
  spec:{knife:{scallion:['disc',.15,.9],naruto:['disc',.25,.9]},noodle:{type:'udon',done:[.9,1.15]},broth:{umami:.5,salt:[1,1.6],T:'hot',vol:[280,620]},garn:{scallion:1,naruto:1,shichimi:.2},req:[['noodle','면이 없어요!'],['broth','국물이 없어요']],w:{knife:.12,noodle:.3,broth:.32,finish:.26}}},
 {id:'shoyu',n:'쇼유라멘',dlc:'jp',price:13000,vessel:'bowl',time:260,sub:'차슈 · 아지타마 · 김',
  steps:[['계란 삶기 (반숙 ≈ 50초) → 찬물 → 반으로 자르기',()=>allItems().some(o=>o.type==='begg'&&o.area<o.orig*.8)],['차슈 도톰하게 썰기, 파 송송',()=>cutN('chashu',2000)>=2],['편수냄비에 라멘 육수 + 쇼유 타레 데우기',()=>liqWith(q=>q.fat>40&&q.salt>3&&q.T>80)],
    ['생라멘은 금방 익어요 — 20초 안팎',()=>anyN('ramen',n=>n.done>.9)],['그릇에 면 → 국물 → 차슈·계란·파·김',()=>G.bowl.noodles.some(n=>n.type==='ramen')&&G.bowl.items.length>3]],
  spec:{knife:{chashu:['disc',.4,1.3],scallion:['disc',.15,.9],naruto:['disc',.25,.9]},noodle:{type:'ramen',done:[.88,1.08]},broth:{fat:.3,salt:[1.1,1.9],T:'hot',vol:[280,620]},begg:[.35,.8],garn:{chashu:1,scallion:1,nori:1,naruto:.5},req:[['noodle','면이 없어요!'],['broth','국물이 없어요']],w:{knife:.1,noodle:.28,broth:.28,egg:.14,finish:.2}}},
 {id:'yaki',n:'야키소바',dlc:'jp',price:11000,vessel:'plate',time:200,sub:'소스 듬뿍, 아오노리',
  steps:[['양배추·삼겹살 한입 크기로',()=>cutN('cabbage',2500)>=6&&cutN('pork',2000)>=4],['큰 팬에 기름, 고기부터 노릇하게',()=>panWith('pork',o=>o.cook>.5)],['양배추 넣고 숨 죽이기',()=>panWith('cabbage',o=>o.cook>.4)],
    ['면 넣고 물 약간 → 뒤집개로 풀기',()=>G.cw.some(c=>c.noodles.some(n=>n.type==='yakisoba'&&n.stick<.4))],['야키소바 소스 두르고 볶기',()=>G.cw.some(c=>c.noodles.some(n=>n.coat.sauce>8))],['접시에 담고 아오노리',()=>G.plate.noodles.length>0]],
  spec:{knife:{cabbage:['dice',1,8],pork:['dice',1,8],onion:['jul',.5,2,7],carrot:['jul',.5,2,7]},cook:{pork:.8,cabbage:.6},brown:{pork:[.2,1.05]},noodle:{type:'yakisoba',done:[.85,1.3],loose:1,sauce:[.15,.5]},garn:{aonori:.2},fl:{fire:.6},req:[['noodle','면이 없어요!']],w:{knife:.12,cook:.24,noodle:.34,finish:.3}}},
 {id:'steak',n:'등심 스테이크',dlc:'west',price:24000,vessel:'plate',time:240,sub:'원하는 굽기로',opts:[['레어',[49,53]],['미디엄 레어',[54,58]],['미디엄',[59,64]],['미디엄 웰',[65,69]]],
  steps:[['고기에 소금·후추 뿌리기',()=>allItems().some(o=>o.type==='beef'&&o.coat.salt>.005)],['큰 팬을 연기 날 듯 달구고 기름',()=>G.cw.some(c=>c.kind==='pan'&&c.T>200&&c.oilAmt>2)],['한 면씩 갈색 크러스트 만들기',()=>allItems().some(o=>o.type==='beef'&&o.face[0]>.5&&o.face[1]>.5)],
    ['버터 넣고 국자로 끼얹기 (선택)',()=>true],['온도계로 심부 온도 확인',()=>allItems().some(o=>o.type==='beef'&&o.Tmax>45)],['도마에서 레스팅 후 썰기 (25초↑)',()=>G.plate.items.some(o=>o.type==='beef')]],
  spec:{steak:1,knife:{garlic:['disc',.1,.5]},garn:{pepper:.1,parsley:.1},req:[['beef','고기가 없어요!']],w:{steak:.8,finish:.2}}},
 {id:'aglio',n:'알리오 올리오',dlc:'west',price:14000,vessel:'plate',time:220,sub:'마늘 · 올리브유 · 면수 유화',
  steps:[['마늘 얇게 편 썰기',()=>cutN('garlic',400)>=5],['냄비 물에 소금 넉넉히 (1%) 끓이기',()=>G.cw.some(c=>c.liq&&saltPct(c.liq)>.6&&c.liq.T>95)],['스파게티 삶기 (알 덴테)',()=>anyN('spaghetti',n=>n.done>.85)],
    ['팬에 올리브유 + 마늘 약불로 노릇하게',()=>panWith('garlic',o=>o.face[o.down]>.25||o.face[1-o.down]>.25)],['면 + 국자로 면수 넣고 팬 흔들어 유화',()=>G.cw.some(c=>c.fluid.some(q=>q.k==='emul'))],['접시에 담고 파슬리',()=>G.plate.noodles.length>0]],
  spec:{knife:{garlic:['disc',.1,.5]},noodle:{type:'spaghetti',done:[.88,1.04],salted:[.3,1.6],sauce:[.08,.5],emul:1},garlic:1,garn:{parsley:.1,parm:.2,chili:.1},req:[['noodle','면이 없어요!']],w:{knife:.12,noodle:.44,garlic:.16,finish:.28}}},
 {id:'pomo',n:'토마토 스파게티',dlc:'west',price:15000,vessel:'plate',time:230,sub:'파마산 · 파슬리',
  steps:[['마늘 편 썰기, 양파 잘게',()=>cutN('garlic',400)>=4],['소금물에 스파게티 삶기',()=>anyN('spaghetti',n=>n.done>.85)],['팬에 올리브유 · 마늘 · 양파 볶고 토마토 소스',()=>G.cw.some(c=>c.fluid.some(q=>q.k==='tomato'))],
    ['소스가 살짝 졸면 면 넣고 버무리기',()=>G.cw.some(c=>c.noodles.some(n=>n.coat.sauce>15))],['접시에 담고 파마산·파슬리',()=>G.plate.noodles.length>0]],
  spec:{knife:{garlic:['disc',.1,.6],onion:['dice',.1,1.5]},cook:{onion:1},noodle:{type:'spaghetti',done:[.88,1.06],salted:[.3,1.6],sauce:[.28,.9]},garlic:1,garn:{parm:.3,parsley:.1},req:[['noodle','면이 없어요!']],w:{knife:.1,cook:.1,noodle:.46,garlic:.1,finish:.24}}},
];
const RID={};for(const r of REC)RID[r.id]=r;

/* ---------- tasting ---------- */
function snapDish(v){const it=v.items,pcs=it.filter(o=>o.kind==='piece'),grs=it.filter(o=>o.kind==='grain');
  const food=pcs.reduce((s,o)=>s+o.mass*2,0)+grs.length*.66+v.noodles.reduce((s,n)=>s+n.g*2.2,0)+v.eggs.length*50;
  let T=0,m=0;for(const o of it){T+=o.T*o.mass;m+=o.mass;}for(const n of v.noodles){T+=n.T*n.g*.1;m+=n.g*.1;}if(v.liq&&v.liq.vol>30){T+=v.liq.T*v.liq.vol*.1;m+=v.liq.vol*.1;}
  return{v,pcs,grs,cooked:pcs.filter(o=>o.cooked),garn:pcs.filter(o=>!o.cooked),food,T:m?T/m:22,sesoil:v.fluid.filter(q=>q.k==='ses').reduce((s,q)=>s+q.m,0)+(v.liq?v.liq.aroma:0)+it.reduce((s,o)=>s+(o.aroma||0),0)};}
function sizeOf(p,mode){if(mode==='dice')return p.area/256;if(mode==='disc')return p.ex/16;if(mode==='len')return Math.max(p.ex,p.ey)/16;if(mode==='jul')return[Math.min(p.ex,p.ey)/16,Math.max(p.ex,p.ey)/16];return 0;}
function knifeScore(arr,spec){let s=0,w=0;const bad=[];for(const t in spec){const a=arr.filter(o=>o.type===t);if(!a.length)continue;const [mode,lo,hi,hi2]=spec[t];let good=0,tot=0,huge=false;
  for(const o of a){tot+=o.mass;if(mode==='jul'){const [th,ln]=sizeOf(o,'jul');const okT=th<=lo,okL=ln>=hi&&ln<=hi2;good+=o.mass*(okT&&okL?1:okT||okL?.5:.15);if(ln>14)huge=true;}
    else{const v=sizeOf(o,mode);if(v>=lo&&v<=hi)good+=o.mass;else if(v<lo)good+=o.mass*(v>=lo*.5?.6:.3);else good+=o.mass*(v<=hi*2?.45:.1);if(mode==='dice'&&v>18||mode!=='dice'&&v>hi*3)huge=true;}}
  if(huge)bad.push(ING[t].n);s+=good/tot*100*tot;w+=tot;}return w?{v:s/w,bad}:null;}
const cookQ=(arr,tg)=>{if(!arr.length)return null;let s=0,m=0;for(const o of arr){s+=o.mass*clamp(o.cook/tg,0,1);m+=o.mass;}return s/m;};
function evaluate(R,v,order){const sp=R.spec,D=snapDish(v),N=[],note=(t,s)=>N.push({t,s}),cats=[];const W=sp.w||{};let pen=0,cap=100;
  const has={rice:D.grs.length>60,kimchi:D.pcs.some(o=>o.type==='kimchi')||v.jeons.some(j=>j.comp.kimchi),noodle:v.noodles.length>0,broth:v.liq&&v.liq.vol>100,jeon:v.jeons.length>0,curd:D.pcs.some(o=>o.type==='curd'),beef:D.pcs.some(o=>o.type==='beef')};
  Object.assign(has,dlcHas(v));
  for(const [k,msg] of sp.req||[])if(!has[k]){cap=Math.min(cap,30);note('bad',msg);}
  // knife
  if(sp.knife){const allP=[...D.pcs,...v.jeons.flatMap(j=>j.lens)],k=knifeScore(allP,sp.knife);if(k){cats.push(['칼질',k.v,W.knife||.12]);
    if(k.bad.length)note('bad',`${josa(k.bad.join('·'),'이','가')} 거의 통째로 들어갔어요.`);else if(k.v>=80)note('good','칼질이 고르고 깔끔해요.');else if(k.v<55)note('meh','썬 크기가 들쭉날쭉해요.');}}
  // cook
  if(sp.cook||sp.rice){let dv=0,dw=0;for(const t in sp.cook||{}){const a=D.cooked.filter(o=>o.type===t),q=cookQ(a,sp.cook[t]);if(q===null)continue;dv+=q*a.reduce((s,o)=>s+o.mass,0);dw+=a.reduce((s,o)=>s+o.mass,0);
      if(q<.6)note('bad',`${josa(ING[t].n,'이','가')} 덜 익었어요.`);else if(q>.95&&t==='onion')note('good','양파가 투명하게 익어 단맛이 올라왔어요.');}
    let done=dw?dv/dw*100:70;const skipCook=!dw&&!(sp.rice&&D.grs.length);if(sp.rice&&D.grs.length){const hot=D.grs.filter(o=>o.Tmax>=70&&o.cook>.35).length/D.grs.length;done=done*.6+hot*100*.4;if(hot<.7)note('bad','밥 덩어리 속이 차가워요.');else if(hot>.9)note('good','밥알 하나하나 뜨겁게 볶아졌어요.');
      const nur=D.grs.filter(o=>{const b=Math.max(o.face[0],o.face[1]);return b>=.35&&b<=1.15;}).length/D.grs.length;if(nur>.08&&nur<.4){done+=6;note('good','바닥이 살짝 눌어 고소해요.');}}
    for(const t in sp.brown||{}){const a=D.cooked.filter(o=>o.type===t);if(!a.length)continue;const b=a.reduce((s,o)=>s+(o.face[0]+o.face[1])/2,0)/a.length,[lo,hi]=sp.brown[t];if(b>=lo&&b<=hi){done+=6;note('good',`${ING[t].n} 겉이 노릇노릇해요.`);}else if(b<lo*.5){done-=6;note('meh',`${josa(ING[t].n,'이','가')} 허옇게 데쳐진 느낌이에요.`);}}
    const allC=[...D.cooked,...D.grs],burnt=allC.length?allC.filter(o=>Math.max(o.face[0],o.face[1])>1.3).reduce((s,o)=>s+o.mass,0)/allC.reduce((s,o)=>s+o.mass,0):0;if(burnt>.06){done-=burnt*160;note('bad','탄 조각이 씹혀요. 쓴맛이 나요.');}
    if(!skipCook)cats.push(['익힘',clamp(done,0,100),W.cook||.24]);}
  // season (dry)
  if(sp.salt){const sg=[...D.pcs,...D.grs].reduce((s,o)=>s+o.coat.salt*o.mass,0),pct=sg/Math.max(1,D.food)*100,[lo,hi]=sp.salt;let sc=pct<lo?100-(lo-pct)*110:pct>hi?100-(pct-hi)*80:100;
    if(pct<lo*.7)note('bad','싱거워요.');else if(pct<lo)note('meh','살짝 싱거워요.');else if(pct>hi*1.35)note('bad','너무 짜요!');else if(pct>hi)note('meh','살짝 짜요.');else note('good','간이 딱 맞아요.');cats.push(['간',clamp(sc,0,100),W.season||.16]);}
  if(sp.mixRice&&D.grs.length){const c=D.grs.map(o=>o.coat.chili+o.coat.dark*5+o.coat.salt*20),m=c.reduce((a,b)=>a+b,0)/c.length,sd=Math.sqrt(c.reduce((a,b)=>a+(b-m)**2,0)/c.length),cvv=m>0?sd/m:2,even=clamp(1-(cvv-.3)/.7,0,1),st=D.grs.reduce((s,o)=>s+o.stick,0)/D.grs.length,loose=clamp(1-(st-.15)/.5,0,1);
    const sc=100*(.55*even+.45*loose);if(loose<.5)note('bad','밥이 덩어리째 뭉쳐 있어요.');else if(even<.5)note('meh','양념이 골고루 섞이지 않았어요.');else if(sc>80)note('good','밥알마다 양념이 고르게 배었어요.');cats.push(['섞임',sc,W.mix||.14]);}
  if(sp.curd){const a=D.pcs.filter(o=>o.type==='curd');if(a.length){const q=cookQ(a,.7),b=a.filter(o=>Math.max(o.face[0],o.face[1])>1.2).length/a.length;if(q>.9&&b<.1)note('good','계란이 몽글몽글 부드럽게 익었어요.');if(b>.2)note('bad','계란이 갈색으로 탔어요.');}}
  // noodle
  if(sp.noodle&&v.noodles.length){const ns=sp.noodle,n=v.noodles.reduce((a,b)=>b.g>a.g?b:a);let rng=ns.done==='opt'?(order&&order.opt?order.opt[1]:[.88,1.08]):ns.done,sc=100;
    if(n.type!==ns.type){sc-=30;note('bad',`${NT[ns.type].n}이 아니라 ${NT[n.type].n}을 썼네요.`);}
    if(n.done<rng[0]){sc-=Math.min(60,(rng[0]-n.done)*220);note(n.done<rng[0]-.15?'bad':'meh','면이 덜 익어 딱딱해요.');}else if(n.done>rng[1]){sc-=Math.min(60,(n.done-rng[1])*200);note(n.done>rng[1]+.15?'bad':'meh','면이 퍼졌어요.');}else note('good',order&&order.opt?`주문대로 ${order.opt[0]} 딱 맞췄어요!`:'면 삶기가 완벽해요, 쫄깃해요.');
    if((n.uneven||0)>.25||n.stick>.45){sc-=15;note('meh','면이 뭉쳐서 고르게 익지 않았어요. 넣자마자 저어 주세요.');}
    if(ns.rinse){if(n.rinse<.4){sc-=20;note('bad','면을 헹구지 않아 전분기로 끈적해요.');}else note('good','찬물에 헹궈 탱글탱글해요.');}
    if(ns.cold&&n.T>18){sc-=15;note('meh','면이 미지근해요. 더 차갑게 헹궈야 해요.');}
    if(ns.loose&&n.stick>.35){sc-=18;note('bad','면이 뭉쳐 있어요. 물을 조금 넣고 풀어요.');}
    if(ns.sauce){const r=n.coat.sauce/n.g;if(r<ns.sauce[0]){sc-=25;note('meh','소스가 부족해 면이 허옇게 보여요.');}else if(r>ns.sauce[1]){sc-=15;note('meh','소스가 너무 많아요.');}else note('good','소스가 면에 착 감겼어요.');}
    if(ns.mixEven&&n.mixEven<ns.mixEven){sc-=18;note('meh','덜 비벼져서 양념이 한쪽에 몰려 있어요.');}
    if(ns.salted){const w=n.saltW||0;if(w<ns.salted[0]){sc-=15;note('meh','면 삶는 물에 소금이 부족해 면이 싱거워요.');}else if(w>ns.salted[1]*1.4){sc-=15;note('meh','면이 짜요.');}}
    if(ns.emul){const e=n.coat.sauce;if(e<n.g*.08){sc-=20;note('meh','면수로 유화하지 않아 기름이 겉돌아요.');}else note('good','면수가 올리브유와 섞여 소스가 크리미해요.');if((v.flav.broken||0)>5){sc-=10;note('meh','소스가 분리되어 기름져요.');}}
    if(n.brown>1.1){sc-=15;note('bad','면이 눌어붙어 탔어요.');}
    cats.push(['면',clamp(sc,0,100),W.noodle||.3]);}
  // broth
  if(sp.broth){const b=sp.broth,q=v.liq;let sc=0;if(q&&q.vol>60){sc=100;const pct=saltPct(q),[lo,hi]=b.salt;if(pct<lo){sc-=Math.min(50,(lo-pct)*90);note(pct<lo*.7?'bad':'meh','국물이 싱거워요.');}else if(pct>hi){sc-=Math.min(50,(pct-hi)*70);note(pct>hi*1.3?'bad':'meh','국물이 짜요.');}else note('good','국물 간이 딱 맞아요.');
    if(b.umami&&q.umami/q.vol<b.umami*.6){sc-=20;note('meh','육수 맛이 약해요. 맹물 맛이 나요.');}if(b.fat&&q.fat/q.vol<b.fat*.4){sc-=12;note('meh','국물이 가벼워요. 라멘 육수가 부족해요.');}if(b.kb&&q.sour<q.vol*.3){sc-=20;note('meh','김치말이 육수의 새콤함이 부족해요.');}if(b.soup&&q.spicy<3){sc-=30;note('bad','스프를 안 넣었어요!');}
    if(b.T==='hot'){if(q.T<60){sc-=25;note('bad','국물이 식었어요.');}else if(q.T>75)note('good','국물이 뜨끈해요.');}else if(b.T==='cold'){if(q.T>12){sc-=Math.min(40,(q.T-12)*4);note('bad','국물이 시원하지 않아요. 얼음이 필요해요.');}else note('good','살얼음처럼 시원해요!');}
    if(q.vol<b.vol[0]){sc-=15;note('meh','국물이 적어요.');}else if(q.vol>b.vol[1]){sc-=10;note('meh','국물이 너무 많아 싱거워 보여요.');}
    if(q.starch>3&&b.T==='hot'&&R.id!=='ramyeon'){sc-=10;note('meh','면을 헹구지 않아 국물이 탁해요.');}}
    cats.push(['국물',clamp(sc,0,100),W.broth||.3]);}
  // jeon
  if(sp.jeon&&v.jeons.length){const j=v.jeons[0],js=sp.jeon;let sc=100;
    if(j.set<.95){sc-=Math.min(45,(1-j.set)*80);note('bad','속이 덜 익어 반죽이 질척해요.');}
    for(const i of [0,1]){const b=j.fb[i];if(b<.35){sc-=12;note('meh',i?'윗면이 허옇게 덜 구워졌어요.':'아랫면이 덜 구워졌어요.');}else if(b>1.25){sc-=25;note('bad','탄 면이 있어요. 쓴맛이 나요.');}}
    if(j.fb[0]>=.45&&j.fb[1]>=.45&&j.fb[0]<=1.1&&j.fb[1]<=1.1)note('good','양면이 노릇노릇 황금색이에요.');
    if(j.edge>=.45&&j.edge<=1.3)note('good','가장자리가 바삭바삭해요!');else if(j.edge<.2){sc-=12;note('meh','가장자리가 눅눅해요. 기름을 더 둘러 보세요.');}
    if(j.broken){sc-=j.broken*15;note('meh','전이 찢어졌어요.');}
    if(j.ratio<.9){sc-=15;note('meh','반죽이 너무 되직해 두꺼워요.');}else if(j.ratio>2){sc-=15;note('meh','반죽이 묽어 잘 부서져요.');}
    if(j.lumps>.5){sc-=10;note('meh','반죽에 날가루가 뭉쳐 있어요.');}
    const tot=Object.values(j.comp).reduce((a,b)=>a+b,0),main=(j.comp[js.main]||0)/Math.max(1,tot+j.vol*.02);if(!j.comp[js.main]){sc-=40;note('bad',`${josa(ING[js.main].n,'이','가')} 안 들어갔어요.`);}else if(main<js.mainMin){sc-=12;note('meh',`${ING[js.main].n}이 적어서 밀가루 맛이 나요.`);}
    if(j.thick>1.3){sc-=10;note('meh','너무 두꺼워요. 뒤집개로 꾹 눌러 주세요.');}else if(j.thick<.8)note('good','얇고 바삭하게 잘 폈어요.');
    cats.push(['전',clamp(sc,0,100),W.jeon||.7]);}
  // egg
  if(sp.egg==='fried'){const e=v.eggs[0];let sc=0;if(!e)note('bad','계란후라이가 빠졌어요!');else{sc=100;if(e.set<.95){sc-=(.95-e.set)*120;note('bad','흰자가 덜 익어 흐물거려요.');}if(e.broken){sc-=25;note('meh','노른자가 터졌어요.');}else if(e.yolk<.55)note('good','노른자가 톡 터지는 완벽한 반숙!');else if(e.yolk<.85)sc-=10;else{sc-=22;note('meh','완숙이네요. 반숙을 부탁했는데…');}
    const mb=Math.max(e.fb[0],e.fb[1]);if(mb>1.25){sc-=30;note('bad','계란 바닥이 탔어요.');}if(e.edge>=.3&&e.edge<=1.2)note('good','가장자리가 레이스처럼 바삭해요.');}cats.push(['계란',clamp(sc,0,100),W.egg||.16]);}
  if(sp.begg){const hs=D.pcs.filter(o=>o.type==='begg');let sc=0;if(!hs.length)note('meh','삶은 계란이 빠졌어요.');else{sc=100;const y=hs[0].yolk||0,[lo,hi]=sp.begg;if(y<lo){sc-=35;note('meh','계란이 너무 덜 익었어요.');}else if(y>hi){sc-=25;note('meh','노른자가 퍽퍽하게 익었어요.');}else note('good',R.id==='shoyu'?'노른자가 쫀득한 아지타마!':'계란이 알맞게 삶아졌어요.');if(hs.every(o=>o.area>o.orig*.8)){sc-=10;note('meh','계란을 반으로 잘라 올려 주세요.');}}cats.push(['계란',sc,W.egg||.14]);}
  if(sp.pegg){const e=v.eggs[0];let sc=40;if(e){sc=e.set>.5?100:60;note(e.set>.5?'good':'meh',e.set>.5?'계란이 몽글하게 익었어요.':'계란이 덜 익었어요.');}cats.push(['계란',sc,W.egg||.1]);}
  // steak
  if(sp.steak){const b=D.pcs.filter(o=>o.type==='beef');let sc=0;if(b.length){sc=100;const core=Math.round(Math.max(...b.map(o=>Math.max(o.Lm[5],o.Lm[6])))),[lo,hi]=order&&order.opt?order.opt[1]:[54,58],nm=order&&order.opt?order.opt[0]:'미디엄 레어';
      if(core<lo){sc-=Math.min(55,(lo-core)*6);note('bad',`${nm}을 원했는데 덜 익었어요 (심부 ${Math.round(core)}°C).`);}else if(core>hi){sc-=Math.min(55,(core-hi)*5);note('bad',`${nm}을 원했는데 너무 익었어요 (심부 ${Math.round(core)}°C).`);}else note('good',`주문대로 정확히 ${nm}! (심부 ${Math.round(core)}°C)`);
      const f0=Math.max(...b.map(o=>o.face[0])),f1=Math.max(...b.map(o=>o.face[1]));if(f0<.5||f1<.5){sc-=15;note('meh','크러스트가 약해요. 더 뜨거운 팬에서 구워요.');}else if(f0>1.35||f1>1.35){sc-=20;note('bad','겉이 탔어요.');}else note('good','겉면에 진한 갈색 크러스트가 생겼어요.');
      if(b.some(o=>o.juiceLost)){sc-=15;note('meh','레스팅 없이 썰어서 육즙이 빠졌어요.');}else if(b.some(o=>o.area<o.orig*.7))note('good','충분히 쉬게 한 뒤 썰어 육즙이 촉촉해요.');
      const salt=b.reduce((s,o)=>s+o.coat.salt*o.mass,0)/b.reduce((s,o)=>s+o.mass*2,0)*100;if(salt<.3){sc-=15;note('meh','간이 안 되어 밍밍해요. 굽기 전에 소금을 뿌려 주세요.');}else if(salt>3){sc-=15;note('meh','짜요.');}else note('good','소금 간이 적당해요.');
      if(b.some(o=>o.aroma>1))note('good','버터 향이 고소하게 배었어요.');}cats.push(['스테이크',clamp(sc,0,100),W.steak||.8]);}
  if(sp.garlic){const g=[...D.pcs,...v.noodles.length?[]:[]].filter(o=>o.type==='garlic');let sc=50;if(g.length){const b=g.reduce((s,o)=>s+Math.max(o.face[0],o.face[1]),0)/g.length;sc=b>1.4?20:b>1.15?75:b>.3?100:70;note(b>1.4?'bad':b>1.15?'meh':b>.3?'good':'meh',b>1.4?'마늘이 타서 써요.':b>1.15?'마늘이 살짝 진하게 볶아졌어요.':b>.3?'마늘이 노릇하게 향을 냈어요.':'마늘이 덜 볶아졌어요.');}else note('meh','마늘이 빠졌어요.');cats.push(['마늘',sc,W.garlic||.14]);}
  evalDLC(R,v,sp,cats,note);
  // finish (garnish + flavor + temperature)
  {let sc=0,poss=0;const gn=v.garn||{},gp=D.garn;for(const k in sp.garn||{}){if(k==='sesoil'){poss+=12;if(D.sesoil>1){sc+=12;note('good','참기름 향이 고소하게 올라와요.');}continue;}
      if(SHK[k]){poss+=12;if((gn[k]||0)>=sp.garn[k]){sc+=12;}continue;}if(k==='nori'){poss+=14;if(v.seeds.some(s=>s.type==='nori')){sc+=14;note('good','김 한 장까지 제대로!');}continue;}
      if(ING[k]){poss+=12;const a=D.pcs.filter(o=>o.type===k);if(a.length){sc+=12;if(k==='scallion'&&a.some(o=>!o.cooked))note('good','송송 썬 파가 싱그러워요.');}}}
    const fl=sp.fl||{},fire=D.pcs.reduce((s,o)=>s+(o.fire||0)*o.mass,0)+D.grs.reduce((s,o)=>s+o.fire*o.mass,0)+v.noodles.reduce((s,n)=>s+(n.fire||0),0)+(v.flav.fire||0);
    if(fl.fire){poss+=18;if(fire>.8){sc+=18;note('good','불향이 확 올라와요!');}}if(fl.scal){poss+=15;if((v.flav.scal||0)>5){sc+=15;note('good','파기름 덕분에 향이 깊어요.');}}
    const bitter=(v.flav.bitter||0)+D.pcs.reduce((s,o)=>s+(o.bitter||0)*o.mass,0);if(bitter>.4){pen+=Math.min(20,bitter*8);note('bad','쓴맛이 나요. 양념이 탔어요.');}
    if(R.id==='bibim'||R.id==='kmari'){poss+=12;const sw=v.flav.sweet||0,so=v.flav.sour||0;if(sw>=1&&sw<=9&&so>=3&&so<=26){sc+=12;note('good','설탕·식초로 새콤달콤 밸런스가 딱 좋아요.');}else if(sw>=1||so>=3)sc+=5;if(sw>12){pen+=6;note('meh','너무 달아요.');}if(so>36){pen+=6;note('meh','너무 셔요.');}}
    const cold=R.id==='kmari'||R.id==='bibim';if(!cold&&R.vessel==='plate'){const ck=[...D.pcs.filter(o=>o.cooked),...D.grs],cm=ck.reduce((s,o)=>s+(o.mass||1),0),cT=cm?ck.reduce((s,o)=>s+o.T*(o.mass||1),0)/cm:null,age=G.t-(v.tHot!==undefined?v.tHot:v.t0>=0?v.t0:G.t);if(age>90&&(cT===null||cT<42)){pen+=6;note('meh','담아 둔 지 오래돼서 조금 식었어요.');}}
    // finish = share of the garnish/aroma this dish asks for; a dish that asks for none is already finished
    const fin=poss?45+55*Math.min(1,sc/poss):92;cats.push(['마무리',clamp(fin,0,100),W.finish||.2]);}
  if(G.stats.alarm)note('meh','연기 경보가 울렸어요… 환기 필수!');
  const wsum=cats.reduce((s,c)=>s+c[2],0)||1;let total=cats.reduce((s,c)=>s+c[1]*c[2],0)/wsum-pen;total=clamp(Math.round(Math.min(total,cap)),0,100);
  const ord={bad:0,meh:1,good:2};N.sort((a,b)=>ord[a.t]-ord[b.t]);return{total,cats:cats.map(c=>[c[0],c[1]]),notes:N.slice(0,9)};}
