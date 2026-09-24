
/* ---------- day-based ingredient unlocks (career only) ---------- */
// always on the shelf: basics every kitchen has
const ING_BASE=new Set(['water','oil','salt','pepper','soy','ses','sesame','sugar']);
// ingredients a recipe needs that its step/guide code doesn't name directly
const ING_EXTRA={mandu:['steamer'],jjim:['steamer','egg'],yachae:['flour','oil'],squidfry:['flour','oil'],katsu:['flour','oil','egg','panko','katsu','cabbage'],kjeon:['flour','egg'],pajeon:['flour','egg'],buchu:['flour','egg'],ramyeon:['egg'],steak:['butter','olive'],aglio:['olive'],pomo:['olive']};
let USES=null;
function recipeUses(){if(USES)return USES;USES={};const ids=[...new Set([...FRIDGE.map(f=>f[0]),...PANTRY.map(p=>p.id)])];
  for(const r of REC){let t=JSON.stringify(r.spec||{})+(r.steps||[]).map(s=>s[0]+String(s[1])).join('|');if(typeof TUTS!=='undefined'&&TUTS[r.id])t+=String(TUTS[r.id]);
    const set=new Set(ING_EXTRA[r.id]||[]);for(const id of ids)if(t.includes("'"+id+"'")||t.includes('"'+id+'"'))set.add(id);USES[r.id]=set;}
  return USES;}
function ingUnlockDay(id){if(ING_BASE.has(id))return 1;const U=recipeUses();let d=99;for(const r of REC){if(SAVE.dlc[r.dlc]===false)continue;if(U[r.id].has(id))d=Math.min(d,UNLOCK[r.id]||1);}return d;}
function ingOpen(id){if(!G||G.mode!=='career'||!SAVE)return true;return SAVE.day>=ingUnlockDay(id);}
function lockMsg(id){const d=ingUnlockDay(id);return d>=99?'이번 메뉴엔 안 써요':`DAY ${d}에 해금돼요`;}
function newlyOpenIngs(){if(!SAVE||SAVE.day<=1)return[];const out=[];for(const [id,n] of FRIDGE)if(ingUnlockDay(id)===SAVE.day)out.push(n);for(const p of PANTRY)if(!ING_BASE.has(p.id)&&ingUnlockDay(p.id)===SAVE.day)out.push(p.n);return out;}
