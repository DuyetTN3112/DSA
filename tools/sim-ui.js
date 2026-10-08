const {JSDOM}=require('jsdom'),fs=require('fs');
const root=require('path').join(__dirname,'..')+'/';
const html=fs.readFileSync(root+'index.html','utf8').replace(/<link[^>]*>/g,'').replace('<script src="app.js"></script>','');
const dom=new JSDOM(html,{runScripts:'outside-only',url:'http://localhost/'});
const w=dom.window;w.setTimeout=f=>{f();return 0};
w.eval(fs.readFileSync(root+'app.js','utf8')+';window.__x={LES,si:()=>si,P,road};');
const $=s=>w.document.querySelector(s),$$=s=>[...w.document.querySelectorAll(s)];
const log=(...a)=>console.log(...a);
const road=()=>$$('#road .lb[data-id]').map(b=>b.dataset.id+(b.disabled?'🔒':''));
log('first 11 in roadmap:',road().slice(0,11).join(' '));
const open=id=>$(`#road .lb[data-id="${id}"]`).click();
const ans=v=>{$('#v').value=v;$('#ok').click()};
const pick=i=>$$('.opts button')[i].click();
open('k1');
log('k1 step1:',$('.q').textContent.slice(0,50),'| tap buttons:',$$('.arr button').length);
$$('.arr button').forEach(b=>0);
// tap 3 apples one by one (DOM re-renders each tap)
for(let i=0;i<3;i++){ $$('.arr button')[i].click(); log(' after tap',i+1,'labels:',$$('.idx').map(x=>x.textContent).join(','));}
log('k1 step2:',$('.q').textContent.slice(0,40),'| idx labels hidden:',$$('.idx').every(x=>x.textContent===''));
ans(2);log(' wrong 2 ->',$('#fb').textContent.slice(0,40));ans(3);
// walk through remaining k1 steps
const L=w.__x.LES;
function walk(id){let guard=0;while($('.q')&&guard++<40){const st=L[id].steps[w.__x.si()];if(!st)break;
 if(st.k=='tap'){$$('.arr button').slice(0,0);for(let i=0;i<st.arr.length;i++)$$('.arr button')[i].click()}
 else if(st.k=='input')ans(st.a);else if(st.k=='choice')pick(st.a);
 else if(st.k=='click')$$('.arr button')[st.a].click();
 else if(st.k=='build'){for(const t of st.ans){const b=$$('[data-t]').find(x=>x.textContent===t);b.click()}$('#ck').click()}
 else if(st.k=='reflect'){$('#r').value='viết thử một đoạn khá dài';$('#ok').click()}
 else if(st.k=='order'){for(let n=0;n<st.items.length;n++){$(`[data-i="${n}"]`).click()}$('#nx2').click()}
 else {log('unhandled',st.k);break}}}
walk('k1');
log('after k1 walk, panel:',$('#panel').textContent.slice(0,60).replace(/\n/g,' '));
// drill appears next (dem)
log('drill title:',($('h2')||{}).textContent,'| has pre:',!!$('#cc'));
for(let i=0;i<5;i++){const t=$('#cc').textContent.trim().split(/\s+/).length;ans(t)}
log('after drill:',$('#panel').textContent.slice(0,70));$('#b1').click();
log('k1 done, k2 unlocked:',road().slice(0,3).join(' '));
for(const id of ['k2','k3','k4','k5','k6','k7','k8','k9','bx0','p1','b1','p2','b2','p3','b3','p4','b4','l1','a2','a3','b5']){open(id);walk(id);
 // drill if present
 let g=0;while($('#cc')&&g++<5||(L[id].dr&&$('.sub')&&/Câu \d/.test($('.sub').textContent)&&g++<5)){const q=$('.q').textContent;const m=q.match(/Hàng có (\d+) bạn.*thứ (\d+)/);if($('#cc'))ans($('#cc').textContent.trim().split(/\s+/).length);else if(m)ans(+m[2]-1);else break}
 if($('#b1'))$('#b1').click();
 if(!w.__x.P.done[id]&&!['k2','k3','k4','k5','k6','k7','k8','k9','bx0'].includes(id)){log('  (drill skipped for',id+')');w.__x.P.done[id]=1;w.__x.road()}
 log(id,'->',w.__x.P.done[id]?'done':'NOT DONE', '| next unlocked:',road().filter(x=>!x.includes('🔒')).length)}
log('p1 unlocked after k9:',!road().find(x=>x.startsWith('p1')).includes('🔒'));
// ---- targeted checks
const X=w.__x,idsAll=w.eval?null:null;
const ordr=X.LES;
X.P.done={};["k1","k2","k3","k4","k5","k6","k7","k8","k9"].forEach(i=>X.P.done[i]=1);X.road();
open('bx0');
const click=t=>$$('[data-t]').find(x=>x.textContent===t).click();
// wrong: "1 1 + = 2"
["1","1","+","=","2"].forEach(click);$('#ck').click();
log('wrong feedback:',$('#fb').textContent);
log('answer leaked?',/1 \+ 1 = 2/.test($('#fb').textContent));
$('#un').click();log('after undo, filled slots:',$$('.slot.f').length);
$('#rs').click();log('after reset, filled slots:',$$('.slot.f').length);
for(let k=0;k<2;k++){["1","1","+","=","2"].forEach(click);$('#ck').click();$('#rs').click()}
["1","1","+","=","2"].forEach(click);$('#ck').click();
log('3rd wrong -> reveal button:',!!$('#rv'));$('#rv').click();log('reveal text:',$('#fb').textContent.slice(0,40));
log('step advanced:',X.si());
// unguided build must not show roles after wrong
['b6'].forEach(i=>{X.P.done={};['k1','k2','k3','k4','k5','k6','k7','k8','k9','bx0','p1','b1','p2','b2','p3','b3','p4','b4','l1','a2','a3','b5','sm','l2','l3','cn'].forEach(j=>X.P.done[j]=1);X.road();open(i);walk(i);log(i,'->',X.P.done[i]?'done':'NOT DONE (drill/none?)',$('#panel').textContent.slice(0,50))});
