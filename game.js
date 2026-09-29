(()=>{
const W=960,H=540,GY=420,cv=document.getElementById('c'),g=cv.getContext('2d');
const T=[
['Mayureshwar','मयूरेश्वर','मयूरेश्वर','Morgaon','मोरगाव','Pune'],
['Siddhivinayak','सिद्धिविनायक','सिद्धिविनायक','Siddhatek','सिद्धटेक','Ahmednagar'],
['Ballaleshwar','बल्लाळेश्वर','बल्लालेश्वर','Pali','पाली','Raigad'],
['Varadvinayak','वरदविनायक','वरदविनायक','Mahad','महाड','Raigad'],
['Chintamani','चिंतामणी','चिंतामणि','Theur','थेऊर','Pune'],
['Girijatmaj','गिरिजात्मज','गिरिजात्मज','Lenyadri','लेण्याद्री','Pune'],
['Vighnahar','विघ्नहर','विघ्नहर','Ozar','ओझर','Pune'],
['Mahaganapati','महागणपती','महागणपति','Ranjangaon','रांजणगाव','Pune']];
const DL=['Pune / पुणे','Ahmednagar / अहमदनगर','Raigad / रायगड'],DN=['Pune','Ahmednagar','Raigad'];
const TH=[['#ffd59a','#fff3d6','#6a9a3c'],['#9ad0ec','#f1ecd8','#a08a5a'],['#7cc6a4','#d8f0c8','#2f7d3a'],['#7fb8e8','#dff2f7','#4d8f52'],['#ffc98a','#ffeecf','#7a9a44'],['#6d7fb0','#c9c1d8','#6b6a5a'],['#8fc9d9','#f0f4d0','#5f9a45'],['#e8875a','#ffd9a0','#7b8a3a'],['#ffb347','#fff0b8','#6a9a3c']];
const K={};let S='menu',lives=3,score=0,prog=0,sel=0,cur=0,at=0,ans=-1,msg='',mk={x:0,y:0},A=null,P=null,LV=null,cam=0,tick=0;
const N=[...Array(8)].map((_,k)=>{const a=-Math.PI/2+k*Math.PI/4;return{x:480+340*Math.cos(a),y:295+170*Math.sin(a)}});
const exp=()=>prog<8?prog:0;
const hit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const rnd=s=>()=>(s=(s*16807)%2147483647)/2147483647;

function build(n){
 const r=rnd(n*977+13),segs=[],pl=[],rocks=[],coins=[],WW=n==8?1800:2400+n*260,gap=n?70+Math.min(n,7)*7:0;
 let x=0;
 while(x<WW){
  let len=x==0?520:380+r()*200;
  if(x+len>WW-450)len=WW-x;
  const first=x==0,last=x+len>=WW;
  segs.push({x,y:GY,w:len,h:H-GY+50,g:1});
  if(!first&&!last){
   const hasR=n>0&&r()<.5+n*.05,rr=r()*(len-400),hasP=r()<.6,py=GY-100-r()*20;
   let px=x+len*.25;
   if(hasP)pl.push({x:px,y:py,w:120,h:16});
   if(hasR){
    let rx=x+210+rr;
    if(hasP&&rx>px-80&&rx<px+200)rx=px+200;
    if(rx+30<x+len-120)rocks.push({x:rx,y:GY-30,w:30,h:30});
   }
   for(let i=0;i<4;i++)coins.push({x:x+30+i*40,y:GY-26,w:14,h:14});
  }
  x+=len;
  if(x<WW){ if(gap)for(let i=0;i<3;i++)coins.push({x:x+gap*(i+.5)/3-7,y:GY-110+Math.abs(i-1)*20,w:14,h:14}); x+=gap; }
 }
 return{n,W:WW,segs,pl,rocks,coins,gate:WW-130,solids:[...segs,...pl]};
}
function startLevel(n){cur=n;LV=build(n);P={x:60,y:GY-44,w:26,h:44,vx:0,vy:0,on:true,face:1,inv:0,safe:20};cam=0;S='play'}
function reset(){lives=3;score=0;prog=0;sel=0;at=0;mk={x:N[0].x,y:N[0].y};A=null;msg='';S='map'}
function hurt(pit){
 lives--;
 if(lives<=0){S='over';return}
 P.inv=90;
 if(pit){P.x=P.safe;P.y=GY-P.h;P.vy=0}else P.vy=-6;
}
function levelDone(){
 if(cur<8){score+=100;ans=-1;S='card'}else{score+=200;S='win'}
}
function step(){
 tick++;
 if(S==='map'&&A){
  A.t+=1/40;const e=Math.min(A.t,1);
  mk.x=A.fx+(A.tx-A.fx)*e;mk.y=A.fy+(A.ty-A.fy)*e;
  if(A.t>=1){const f=A.fn;A=null;f()}
  return;
 }
 if(S!=='play')return;
 const p=P,a=(K.ArrowRight||K.d?1:0)-(K.ArrowLeft||K.a?1:0);
 p.vx=a*4;if(a)p.face=a;
 if((K[' ']||K.ArrowUp||K.w)&&p.on){p.vy=-11.5;p.on=false}
 p.vy=Math.min(p.vy+.5,14);
 p.x+=p.vx;
 if(p.x<0)p.x=0;
 for(const s of LV.solids)if(hit(p,s)){if(p.vx>0)p.x=s.x-p.w;else if(p.vx<0)p.x=s.x+s.w}
 p.y+=p.vy;p.on=false;
 for(const s of LV.solids)if(hit(p,s)){
  if(p.vy>0){p.y=s.y-p.h;p.on=true;if(s.g)p.safe=s.x+20}else p.y=s.y+s.h;
  p.vy=0;
 }
 if(p.inv>0)p.inv--;
 if(p.y>H+40){hurt(true);return}
 if(p.inv===0)for(const r of LV.rocks)if(hit(p,r)){hurt(false);if(S!=='play')return;break}
 for(const c of LV.coins)if(!c.got&&hit(p,c)){c.got=1;score+=25}
 if(p.x+p.w>LV.gate+20)levelDone();
 cam=Math.max(0,Math.min(LV.W-W,p.x-W/2+60));
}
function press(k){
 if(S==='menu'){if(k==='Enter')reset();return}
 if(S==='over'||S==='win'){if(k==='Enter')S='menu';return}
 if(S==='map'){
  if(A)return;
  if(k==='ArrowRight')sel=(sel+1)%8;
  else if(k==='ArrowLeft')sel=(sel+7)%8;
  else if(k==='Enter'||k===' '){
   const t=N[sel];
   A={fx:mk.x,fy:mk.y,tx:t.x,ty:t.y,t:0,fn:()=>{
    if(sel===exp()){at=sel;msg='';startLevel(prog<8?prog:8)}
    else{
     lives--;msg='wrong';
     if(lives<=0){S='over';return}
     A={fx:mk.x,fy:mk.y,tx:N[at].x,ty:N[at].y,t:0,fn:()=>{}};
    }
   }};
  }
  return;
 }
 if(S==='card'){
  if(ans<0&&(k==='1'||k==='2'||k==='3')){
   ans=+k-1;
   if(DN[ans]===T[cur][5])score+=50;else score=Math.max(0,score-20);
  }else if(ans>=0&&k==='Enter'){prog++;sel=exp();msg='';S='map'}
 }
}
addEventListener('keydown',e=>{
 const k=e.key.length==1?e.key.toLowerCase():e.key;
 if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(k))e.preventDefault();
 if(!K[k])press(k);K[k]=1;
});
addEventListener('keyup',e=>{K[e.key.length==1?e.key.toLowerCase():e.key]=0});
addEventListener('blur',()=>{for(const k in K)K[k]=0});

/* ---------- drawing ---------- */
const FF='"Noto Sans Devanagari","Nirmala UI",Mangal,Georgia,serif';
function txt(s,x,y,sz,col,al,b){g.font=(b?'bold ':'')+sz+'px '+FF;g.fillStyle=col||'#fff';g.textAlign=al||'center';g.textBaseline='middle';g.fillText(s,x,y)}
function panel(x,y,w,h,c){g.fillStyle=c||'rgba(30,16,6,.86)';g.fillRect(x,y,w,h);g.strokeStyle='#e2a03a';g.lineWidth=3;g.strokeRect(x,y,w,h)}
function hearts(){txt('♥'.repeat(Math.max(lives,0)),20,26,26,'#e0332f','left')}
function bgGrad(a,b){const q=g.createLinearGradient(0,0,0,H);q.addColorStop(0,a);q.addColorStop(1,b);g.fillStyle=q;g.fillRect(0,0,W,H)}
function shikhara(x,y,w,h){g.fillStyle='#d9c9a8';g.fillRect(x,y,w,h);g.fillStyle='#c8611e';g.beginPath();g.moveTo(x-6,y);g.lineTo(x+w/2,y-h*.9);g.lineTo(x+w+6,y);g.fill();g.fillStyle='#f2c14e';g.fillRect(x+w/2-2,y-h*.9-14,4,14);g.fillStyle='#5a2c0e';g.fillRect(x+w/2-9,y+h-30,18,30)}

function drawMenu(){
 bgGrad('#ffb347','#ffe9b0');
 shikhara(430,250,100,100);
 txt('Ashtavinayak Yatra',480,90,54,'#5a2c0e','center',1);
 txt('अष्टविनायक यात्रा',480,150,40,'#8a2f0a','center',1);
 txt('Walk the eight Ganesha temples in the traditional order, then return to Morgaon.',480,410,18,'#3a2410');
 txt('आठ गणपती मंदिरे क्रमाने फिरा आणि मोरगावला परत या · अष्ट गणपति मंदिर क्रम से घूमें',480,438,16,'#3a2410');
 txt('Press Enter to begin / सुरू करण्यासाठी Enter / शुरू करने के लिए Enter',480,490,20,'#8a2f0a','center',1);
}
function drawMap(){
 bgGrad('#f3dfb3','#e2c48a');
 hearts();txt('Score / गुण / अंक: '+score,W-20,26,20,'#3a2410','right',1);
 txt('Choose the next temple / पुढील मंदिर निवडा / अगला मंदिर चुनें',480,26,18,'#3a2410','center',1);
 for(let k=0;k<8;k++){
  const a=N[k],b=N[(k+1)%8];
  g.strokeStyle=prog>k?'#b5541a':'#8a6a4a';g.lineWidth=prog>k?5:3;g.setLineDash(prog>k?[]:[8,8]);
  g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();
 }
 g.setLineDash([]);
 for(let k=0;k<8;k++){
  const n=N[k],up=n.y<295;
  g.beginPath();g.arc(n.x,n.y,16,0,7);g.fillStyle=k<prog?'#4a9a3c':'#f2c14e';g.fill();
  g.strokeStyle='#5a2c0e';g.lineWidth=2;g.stroke();
  txt(''+(k+1),n.x,n.y,14,'#3a2410','center',1);
  if(k===sel){g.beginPath();g.arc(n.x,n.y,23,0,7);g.strokeStyle='#d7261e';g.lineWidth=4;g.stroke()}
  txt(T[k][0],n.x,n.y+(up?-40:32),14,'#3a2410','center',1);
  txt(T[k][1],n.x,n.y+(up?-24:48),13,'#5a2c0e');
 }
 const t=T[sel];
 txt(t[0],480,235,28,'#3a2410','center',1);
 txt(t[1]+' / '+t[2],480,270,22,'#8a2f0a');
 txt(t[3]+' · '+t[4],480,302,18,'#3a2410');
 txt('← → select · Enter walk / निवडा · चुनें',480,335,15,'#5a2c0e');
 g.beginPath();g.arc(mk.x,mk.y-30,9,0,7);g.fillStyle='#e8b98a';g.fill();
 g.fillStyle='#e8781e';g.fillRect(mk.x-8,mk.y-21,16,22);
 const hint=prog<8?'Temple '+(prog+1)+' of 8 · Hint: the next darshan is in '+T[prog][5]+' district':'All eight done! Return to Mayureshwar, Morgaon, where you began. / मोरगावला परत या';
 panel(60,490,840,40);txt(hint,480,510,16,'#ffe9b0');
 if(msg==='wrong'){txt('Not the next temple. Follow the traditional order. / क्रम पाळा / क्रम का पालन करें',480,56,17,'#b3211b','center',1)}
}
function drawLevel(){
 const n=LV.n,th=TH[n];
 bgGrad(th[0],th[1]);
 for(let l=0;l<2;l++){
  g.fillStyle=l?'rgba(40,60,40,.22)':'rgba(60,70,90,.16)';
  g.beginPath();g.moveTo(0,H);
  const amp=n==5?110:50,f=l?.4:.2;
  for(let x=0;x<=W;x+=20)g.lineTo(x,GY-40-l*30-amp*(Math.sin((x+cam*f)/(l?120:200))+1)/2);
  g.lineTo(W,H);g.fill();
 }
 g.fillStyle=(n==2||n==3)?'#3a86c8':'#1a1208';g.fillRect(0,GY,W,H-GY);
 if(n==2||n==3){g.fillStyle='rgba(255,255,255,.25)';for(let x=0;x<W;x+=40)g.fillRect(x+(tick%40),GY+12,18,3)}
 for(const s of LV.segs){
  if(s.x+s.w<cam||s.x>cam+W)continue;
  g.fillStyle='#6b4a2b';g.fillRect(s.x-cam,GY,s.w,H-GY);
  g.fillStyle=th[2];g.fillRect(s.x-cam,GY,s.w,10);
 }
 for(const s of LV.pl){g.fillStyle='#7a5230';g.fillRect(s.x-cam,s.y,s.w,s.h);g.fillStyle=th[2];g.fillRect(s.x-cam,s.y,s.w,5)}
 for(const r of LV.rocks){g.fillStyle='#6f6a66';g.beginPath();g.moveTo(r.x-cam,r.y+r.h);g.lineTo(r.x-cam+8,r.y+4);g.lineTo(r.x-cam+20,r.y);g.lineTo(r.x-cam+r.w,r.y+r.h);g.fill()}
 for(const c of LV.coins)if(!c.got){g.fillStyle='#f08a1c';g.beginPath();g.arc(c.x-cam+7,c.y+7+Math.sin(tick/12+c.x)*3,7,0,7);g.fill()}
 shikhara(LV.gate-cam,GY-90,90,90);
 txt(T[n<8?n:0][0]+' · '+T[n<8?n:0][1],LV.gate-cam+45,GY-170,16,'#3a2410','center',1);
 const p=P;
 if(!(p.inv>0&&Math.floor(p.inv/6)%2)){
  const px=p.x-cam,sw=p.vx&&p.on?Math.sin(tick*.3)*7:0;
  g.strokeStyle='#5a2c0e';g.lineWidth=5;
  g.beginPath();g.moveTo(px+13,p.y+38);g.lineTo(px+13+sw,p.y+p.h);g.moveTo(px+13,p.y+38);g.lineTo(px+13-sw,p.y+p.h);g.stroke();
  g.fillStyle='#e8781e';g.fillRect(px+3,p.y+16,20,24);
  g.beginPath();g.arc(px+13,p.y+9,9,0,7);g.fillStyle='#e8b98a';g.fill();
  g.fillStyle='#fff';g.fillRect(px+3,p.y-1,20,5);
  g.fillStyle='#d7261e';g.fillRect(px+13+p.face*3,p.y+8,3,3);
  g.strokeStyle='#8a5a2b';g.lineWidth=3;g.beginPath();g.moveTo(px+13+p.face*14,p.y+8);g.lineTo(px+13+p.face*14,p.y+p.h);g.stroke();
 }
 hearts();txt('Score / गुण: '+score,W-20,26,20,'#3a2410','right',1);
 const t=T[n<8?n:0];
 txt(n<8?(n+1)+'/8  '+t[0]+' ('+t[3]+')':'Return to Mayureshwar, Morgaon',480,24,20,'#3a2410','center',1);
 txt(n<8?t[1]+' ('+t[4]+') / '+t[2]:'मयूरेश्वराकडे परत / मयूरेश्वर वापसी',480,50,16,'#3a2410');
}
function drawCard(){
 drawLevel();
 const t=T[cur];
 panel(130,60,700,420);
 txt('Darshan complete! +100 / दर्शन पूर्ण!',480,95,24,'#f2c14e','center',1);
 txt(t[0]+' · '+t[3],480,140,26,'#fff','center',1);
 txt(t[1]+' ('+t[4]+') · '+t[2],480,175,20,'#ffe9b0');
 txt('Which district is '+t[3]+' in?',480,225,20,'#fff');
 txt(t[4]+' कोणत्या जिल्ह्यात आहे? / किस जिले में है?',480,255,18,'#ffe9b0');
 for(let i=0;i<3;i++){
  const c=DN[i]===t[5];let col='#fff';
  if(ans>=0)col=c?'#7be07b':(i===ans?'#ff8a80':'#bbb');
  txt((i+1)+'.  '+DL[i],480,305+i*38,22,col,'center',1);
 }
 if(ans<0)txt('Press 1, 2 or 3 / १, २ किंवा ३ दाबा',480,440,16,'#ffe9b0');
 else txt((DN[ans]===t[5]?'Correct! +50 / बरोबर!':'Not quite. -20 / चुकले.')+'  Enter: continue / पुढे',480,440,18,'#ffe9b0','center',1);
}
function drawEnd(win){
 bgGrad(win?'#ffb347':'#3a2a2a',win?'#fff0b8':'#1a1010');
 txt(win?'Yatra Completed!':'Game Over',480,150,54,win?'#5a2c0e':'#fff','center',1);
 txt(win?'यात्रा पूर्ण! गणपती बाप्पा मोरया!':'खेळ संपला / खेल समाप्त',480,215,34,win?'#8a2f0a':'#ffd9a0','center',1);
 txt('Score / गुण / अंक: '+score,480,300,28,win?'#3a2410':'#fff','center',1);
 if(win)txt('You visited all eight temples in order and returned to Morgaon.',480,350,18,'#3a2410');
 txt('Press Enter / Enter दाबा',480,450,22,win?'#8a2f0a':'#ffd9a0','center',1);
}
function draw(){
 g.clearRect(0,0,W,H);
 if(S==='menu')drawMenu();else if(S==='map')drawMap();else if(S==='play')drawLevel();
 else if(S==='card')drawCard();else drawEnd(S==='win');
}
let last=0,acc=0;
function loop(t){acc+=Math.min(t-last,50);last=t;while(acc>=16.67){step();acc-=16.67}draw();requestAnimationFrame(loop)}
requestAnimationFrame(loop);
window.__g={st:()=>({S,lives,score,prog,sel,cur,at,ans,P,LV,A}),step,press,start:startLevel,draw,K,N,setLives:v=>{lives=v}};
})();
