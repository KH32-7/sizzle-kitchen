
/* ---------- 1.4 screens: the kitchen stays as it is; everything else is its own full screen ---------- */
ICO.pot='<path d="M4 10h16v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M2 10h20M9 7c0-1.5 1.2-2.5 3-2.5S15 5.5 15 7"/>';ICO.table='<path d="M3 9h18M6 9l-1 10M18 9l1 10M9 9V5h6v4"/>';
const SCR={cur:'kitchen',list:{}};
function screenEl(id,cls){let d=$('#scr-'+id);if(!d){d=document.createElement('div');d.id='scr-'+id;d.className='screen '+(cls||'');d.hidden=true;$('#stage').insertBefore(d,$('#top'));}SCR.list[id]=d;return d;}
function setScreen(s){if(s!=='kitchen'&&(!G||!G.started))return;if(s==='hall'&&G.mode!=='career')return;const prev=SCR.cur;SCR.cur=s;
  const fn=SCR['show_'+s];if(fn)fn();
  for(const k in SCR.list)SCR.list[k].hidden=k!==s;$('#stage').classList.toggle('off-kitchen',s!=='kitchen');navSync();if(prev!==s&&AU.pick)AU.pick();}
function navSync(){const n=$('#scrNav');if(!n)return;const car=G&&G.started&&G.mode==='career';n.hidden=!car;n.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b.dataset.s===SCR.cur));}
(function(){if($('#scrNav'))return;const n=document.createElement('div');n.id='scrNav';n.hidden=true;
  n.innerHTML=`<button type="button" data-s="kitchen" title="주방 (H)">${svgI('pot')}주방</button><button type="button" data-s="hall" title="홀 (H)">${svgI('table')}홀<i class="nb" hidden></i></button>`;
  $('#hint').before(n);n.querySelectorAll('button').forEach(b=>b.onclick=()=>setScreen(b.dataset.s));})();
addEventListener('keydown',e=>{if(e.code!=='KeyH'||e.repeat||!G||!G.started||G.mode!=='career')return;if($$('.overlay').some(o=>!o.hidden&&o.id!=='pauseOv'))return;setScreen(SCR.cur==='hall'?'kitchen':'hall');});
/* leaving a shift (title, settlement, practice) always lands back in the kitchen view */
toTitle=(orig=>function(){SCR.cur!=='kitchen'&&setScreen('kitchen');orig();navSync();})(toTitle);
startPractice=(orig=>function(r,g){setScreen('kitchen');orig(r,g);navSync();})(startPractice);
startCareer=(orig=>function(){SCR.cur='kitchen';for(const k in SCR.list)SCR.list[k].hidden=true;$('#stage').classList.remove('off-kitchen');orig();navSync();})(startCareer);
endDay=(orig=>function(){if(SCR.cur!=='kitchen')setScreen('kitchen');orig();navSync();})(endDay);
