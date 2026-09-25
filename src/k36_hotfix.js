
/* ---------- 1.6.1 hotfix: nothing may push a "next" button off screen · compact recipe card · "싱겁게" really means less salt ---------- */
/* settlement: Enter always moves on, even if something odd happens to the layout */
addEventListener('keydown',e=>{const s=$('#settle');if(!s||s.hidden||e.repeat)return;if(e.code==='Enter'||e.code==='NumpadEnter'){e.preventDefault();$('#stNext').click();}});
/* recipe card: compact by default (title + current step); expand for the whole list */
function rpCompact(){return SET.rpFull!==true;}
renderSteps=(orig=>function(){orig();const p=$('#recipePop');if(!p)return;p.classList.toggle('compact',rpCompact());let b=$('#rpMore');
  if(!b){b=document.createElement('button');b.type='button';b.id='rpMore';b.onclick=e=>{e.stopPropagation();SET.rpFull=!rpCompact()?false:true;saveOpt();renderSteps();};p.appendChild(b);}
  const lis=$$('#steps li'),cur=lis.findIndex(li=>li.classList.contains('cur')),done=lis.filter(li=>li.classList.contains('done')).length;
  b.innerHTML=rpCompact()?`전체 ${lis.length}단계 보기 ▾ <small>${done}/${lis.length} 완료</small>`:'간단히 ▴';if(cur<0&&rpCompact()&&lis.length){const li=lis[lis.length-1];li.classList.add('cur');}})(renderSteps);
/* "싱겁게 해줘" orders: the salt target drops, so a lighter dish is right, not "싱거워요" */
evaluate=(orig=>function(R,v,o){if(!o||o.pref!=='mild'||!R.spec)return orig(R,v,o);const sp=R.spec,s2=Object.assign({},sp),low=r=>[r[0]*.45,r[1]*.8];
  if(sp.salt)s2.salt=low(sp.salt);if(sp.broth&&sp.broth.salt)s2.broth=Object.assign({},sp.broth,{salt:low(sp.broth.salt)});if(sp.noodle&&sp.noodle.salted)s2.noodle=Object.assign({},sp.noodle,{salted:[sp.noodle.salted[0]*.3,sp.noodle.salted[1]]});
  const res=orig(Object.assign({},R,{spec:s2}),v,o);res.notes=res.notes.filter(n=>!/싱거/.test(n.s));return res;})(evaluate);
