
/* ---------- audio (all synthesized) ---------- */
const AU={on:false};
AU.init=function(){
  if(this.on){if(this.C.state==='suspended')this.C.resume();return;}
  let C;try{C=new (window.AudioContext||window.webkitAudioContext)();}catch(e){return;}
  this.C=C;const comp=C.createDynamicsCompressor();comp.threshold.value=-16;comp.knee.value=12;comp.ratio.value=5;comp.attack.value=.004;comp.release.value=.2;
  this.master=C.createGain();this.master.gain.value=this.gv?this.gv():this.muted?0:.85;this.master.connect(comp);comp.connect(C.destination);
  const sr=C.sampleRate;
  const nb=C.createBuffer(1,sr*2,sr),nd=nb.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;this.nbuf=nb;
  const cb=C.createBuffer(1,sr*3,sr),cd=cb.getChannelData(0);for(let i=0;i<cd.length;i++){if(Math.random()<.0022){const amp=Math.pow(Math.random(),2)*.9+.05,len=(15+Math.random()*90)|0,dec=3+Math.random()*12;for(let j=0;j<len&&i+j<cd.length;j++)cd[i+j]+=amp*(Math.random()*2-1)*Math.exp(-j/dec);}}this.cbuf=cb;
  const bb=C.createBuffer(1,sr*2,sr),bd=bb.getChannelData(0);let last=0;for(let i=0;i<bd.length;i++){last=(last+.02*(Math.random()*2-1))/1.02;bd[i]=last*3.5;}this.bbuf=bb;
  // bubble buffer: decaying sine chirps
  const ub=C.createBuffer(1,sr*3,sr),ud=ub.getChannelData(0);for(let i=0;i<ud.length;i++){if(Math.random()<.0009){const f=300+Math.random()*900,len=(sr*.03)|0,amp=.2+Math.random()*.5;for(let j=0;j<len&&i+j<ud.length;j++){const t=j/sr;ud[i+j]+=amp*Math.sin(TAU*f*(1+t*14)*t)*Math.exp(-t*90);}}}this.ubuf=ub;
  this.sz=[0,1,2,3].map(()=>({hiss:this.loop(nb,'bandpass',5200,.6),crack:this.loop(cb,'highpass',900,.7),fry:this.loop(cb,'lowpass',2600,.6),boil:this.loop(ub,'lowpass',1800,.5),roll:this.loop(bb,'lowpass',500,.7)}));
  this.rum=[0,1,2,3].map(()=>this.loop(bb,'lowpass',320,.7));
  this.scr=this.loop(nb,'bandpass',1800,2.4);this.pour=this.loop(nb,'bandpass',800,5);this.tap=this.loop(nb,'bandpass',1500,.8);
  const o=C.createOscillator();o.type='square';o.frequency.value=3150;const af=C.createBiquadFilter();af.type='lowpass';af.frequency.value=5000;const ag=C.createGain();ag.gain.value=0;o.connect(af);af.connect(ag);ag.connect(this.master);o.start();this.alarm=ag;
  this.on=true;if(C.state==='suspended')C.resume();};
AU.loop=function(buf,type,f,q){const C=this.C,s=C.createBufferSource();s.buffer=buf;s.loop=true;const fl=C.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=C.createGain();g.gain.value=0;const pn=C.createStereoPanner?C.createStereoPanner():null;s.connect(fl);fl.connect(g);if(pn){g.connect(pn);pn.connect(this.master);}else g.connect(this.master);s.start(0,Math.random()*buf.duration*.9);return{s,fl,g,pn};};
AU.muted=false;try{AU.muted=localStorage.getItem('sizzle-mute')==='1';}catch(e){}
AU.setMute=function(m){this.muted=m;try{localStorage.setItem('sizzle-mute',m?'1':'0');}catch(e){}if(this.on)this.master.gain.setTargetAtTime(this.gv?this.gv():m?0:.85,this.C.currentTime,.05);};
AU.set=function(p,v,tc){p.setTargetAtTime(v,this.C.currentTime,tc||.06);};
AU.panOf=x=>clamp((x/W)*2-1,-1,1)*.6;
AU.out=function(node,pan){if(pan&&this.C.createStereoPanner){const p=this.C.createStereoPanner();p.pan.value=pan;node.connect(p);p.connect(this.master);}else node.connect(this.master);};
AU.tone=function(o){if(!this.on)return;const C=this.C,t=C.currentTime+(o.delay||0),a=o.a||.003;const os=C.createOscillator();os.type=o.type||'sine';os.frequency.setValueAtTime(o.f,t);if(o.f2)os.frequency.exponentialRampToValueAtTime(o.f2,t+a+o.d);const g=C.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(o.v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+o.d);os.connect(g);this.out(g,o.pan);os.start(t);os.stop(t+a+o.d+.05);};
AU.nz=function(o){if(!this.on)return;const C=this.C,t=C.currentTime+(o.delay||0),a=o.a||.002;const s=C.createBufferSource();s.buffer=o.buf||this.nbuf;if(o.rate)s.playbackRate.value=o.rate;const f=C.createBiquadFilter();f.type=o.type||'bandpass';f.frequency.setValueAtTime(o.f,t);if(o.f2)f.frequency.exponentialRampToValueAtTime(o.f2,t+a+o.d);f.Q.value=o.q||1;const g=C.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(o.v,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+o.d);s.connect(f);f.connect(g);this.out(g,o.pan);s.start(t,Math.random()*Math.max(0,s.buffer.duration-a-o.d-.2));s.stop(t+a+o.d+.05);};
const CRUNCH={kimchi:[1500,.9,.35,.07],onion:[2800,1.4,.5,.05],ham:[700,1,.22,.05],scallion:[3600,1.8,.45,.04],jjokpa:[3800,1.8,.35,.035],buchu:[3200,1.5,.3,.04],zucchini:[2200,1.2,.4,.05],carrot:[3000,1.6,.55,.05],cucumber:[2600,1.3,.5,.05],cabbage:[2400,1,.5,.06],pork:[600,1,.18,.05],chashu:[500,1,.15,.05],naruto:[900,1,.2,.04],squid:[800,1,.2,.05],garlic:[3400,1.6,.35,.03],beef:[500,1,.18,.06],begg:[700,1,.1,.03],curd:[600,1,.1,.03]};
AU.chop=function(type,x){const pan=this.panOf(x);this.tone({f:160,f2:60,d:.09,v:.45,pan});this.nz({f:900,q:1.5,d:.03,v:.28,pan});const m=CRUNCH[type];if(m){this.nz({f:m[0],q:m[1],d:m[3],v:m[2],pan});this.nz({f:m[0]*1.3,q:m[1],d:m[3]*.6,v:m[2]*.6,pan,delay:.012});}};
AU.knock=function(){this.tone({f:230,f2:140,d:.05,v:.22});this.nz({f:1200,d:.02,v:.14});};
AU.pick=function(){this.nz({f:2500,q:.7,d:.04,v:.1});};
AU.place=function(){this.tone({f:120,f2:80,d:.08,v:.22});this.nz({f:600,d:.05,v:.12});};
AU.slide=function(){this.nz({f:900,f2:1400,q:.8,a:.02,d:.18,v:.12});};
AU.crack=function(){for(const d of [0,.035,.07])this.nz({f:3000,type:'highpass',d:.022,v:.45,delay:d});this.tone({f:900,f2:500,d:.03,v:.08,delay:.02});};
AU.ignite=function(){for(const d of [0,.09,.18])this.nz({f:4200,type:'highpass',d:.01,v:.35,delay:d});this.nz({f:300,f2:1600,type:'lowpass',a:.05,d:.45,v:.3,delay:.22});};
AU.click=function(){this.nz({f:4000,type:'highpass',d:.008,v:.25});};
AU.whoosh=function(){this.nz({f:500,f2:1400,q:.8,a:.06,d:.28,v:.28});};
AU.flare=function(){this.nz({f:400,f2:1800,type:'lowpass',a:.03,d:.9,v:.6});this.tone({f:55,d:.6,v:.25});};
AU.flop=function(){this.tone({f:180,f2:90,d:.07,v:.25});this.nz({f:1500,d:.05,v:.15});};
AU.clank=function(){this.tone({f:520,type:'triangle',d:.25,v:.08});this.tone({f:1370,d:.18,v:.04});this.nz({f:3000,d:.03,v:.15});};
AU.clink=function(){this.tone({f:2100,d:.5,v:.06});this.tone({f:3350,d:.35,v:.04});this.tone({f:5200,d:.2,v:.03});};
AU.thud=function(){this.tone({f:90,f2:50,d:.12,v:.35});this.nz({f:400,type:'lowpass',d:.08,v:.2});};
AU.pop=function(){this.tone({f:1200,f2:500,d:.025,v:.04});};
AU.rattle=function(){this.nz({f:3500,type:'highpass',d:.025,v:.12});this.nz({f:4200,type:'highpass',d:.02,v:.08,delay:.03});};
AU.ding=function(){this.tone({f:1318,d:.6,v:.07});this.tone({f:1760,d:.7,v:.05,delay:.09});};
AU.bell=function(){this.tone({f:2637,d:1.2,v:.09});this.tone({f:3951,d:.9,v:.04});this.tone({f:2637,d:1,v:.06,delay:.18});};
AU.cash=function(){this.nz({f:3000,type:'highpass',d:.05,v:.25});this.tone({f:2400,d:.5,v:.08,delay:.06});this.tone({f:3200,d:.6,v:.07,delay:.1});this.nz({f:5000,type:'highpass',d:.3,v:.08,delay:.12,buf:this.cbuf,rate:2});};
AU.door=function(){this.tone({f:80,f2:60,d:.2,v:.2});this.nz({f:600,type:'lowpass',a:.05,d:.4,v:.12});};
AU.trash=function(){this.thud();this.nz({f:800,d:.2,v:.15});};
AU.hot=function(){this.nz({f:3000,type:'highpass',d:.25,v:.12});};
AU.splash=function(v,x){this.nz({f:900,f2:400,type:'lowpass',a:.005,d:.35,v:Math.min(.4,v),pan:this.panOf(x||W/2)});this.nz({buf:this.ubuf,f:2000,type:'lowpass',d:.5,v:Math.min(.6,v*1.4),rate:1.4,pan:this.panOf(x||W/2)});};
AU.sizzleBurst=function(v,x){const pan=this.panOf(x||W/2);this.nz({f:2600,type:'highpass',a:.01,d:.7,v:Math.min(.4,v*.6),pan});this.nz({buf:this.cbuf,f:1200,type:'highpass',a:.01,d:.9,v:Math.min(1,v*1.6),rate:1.3,pan});};
AU.update=function(){if(!this.on)return;
  G.cw.forEach((p,i)=>{const s=this.sz[i];const I=1-Math.exp(-(p.evapRate||0)/2.2);const oh=(p.oilAmt>1&&p.T>150)?Math.min(1,(p.T-150)/140):0;const pan=this.panOf(p.x);
    const bl=p.liq&&p.liq.vol>20?p.boil:0;
    this.set(s.hiss.g.gain,Math.min(.16,I*.13+oh*.02));this.set(s.crack.g.gain,Math.min(1.1,I*.9+oh*.22));this.set(s.crack.s.playbackRate,.7+I*.75+oh*.2,.15);this.set(s.fry.g.gain,Math.min(.55,I*.45+oh*.08));
    this.set(s.boil.g.gain,Math.min(.22,bl*.18+(p.liq&&p.liq.T>70?(p.liq.T-70)/30*.03:0)));this.set(s.boil.s.playbackRate,.55+bl*.45,.2);this.set(s.roll.g.gain,bl*bl*.03);
    for(const k in s)if(s[k].pn)s[k].pn.pan.value=pan;});
  G.burners.forEach((b,i)=>{const r=this.rum[i];this.set(r.g.gain,b.lit?.04+b.level*.13:0,.1);r.fl.frequency.value=180+b.level*260;if(r.pn)r.pn.pan.value=this.panOf(b.x);});
  const sp=G.spat,spd=Math.hypot(sp.vx,sp.vy);const sc=(sp.down&&sp.c&&sp.c.kind==='pan')?Math.min(1,spd/900):0;this.set(this.scr.g.gain,sc*.22,.03);this.scr.fl.frequency.value=1300+Math.min(spd,2000)*.6;
  const h=G.held,pr=(h&&(h.kind==='bottle'||h.kind==='powder')&&h.flow>0)?1:0;this.set(this.pour.g.gain,pr*(h&&h.id==='water'?.22:.14),.05);if(pr)this.pour.fl.frequency.value=(h.id==='water'?900:500)+Math.random()*700;
  this.set(this.tap.g.gain,G.sink.tap?.2:0,.08);
  this.set(this.alarm.gain,(G.alarmOn&&(G.t%.6)<.3)?.035:0,.005);};
