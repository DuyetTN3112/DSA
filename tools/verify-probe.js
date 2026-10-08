// node tools/verify-probe.js  : kiểm tra mọi PRB sinh đúng cấu trúc, đáp án nhất quán
const fs=require('fs'),vm=require('vm');
const stub=()=>new Proxy(function(){},{get:(t,k)=>k==='length'?0:(k===Symbol.toPrimitive?()=>'':stub()),set:()=>true,apply:()=>stub()});
const ctx={document:{querySelector:stub,querySelectorAll:()=>[],createElement:stub,head:stub(),body:stub()},localStorage:{getItem:()=>"",setItem(){}},window:{},console,setTimeout:()=>0,JSON,Math,Date,Set,Object,Array,Number,String};
vm.createContext(ctx);
const a=fs.readFileSync(__dirname+'/../app.js','utf8').replace(/\nroad\(\);draw\(\);\s*$/,"\n"),b=fs.readFileSync(__dirname+'/../probe.js','utf8')+'\n'+fs.readFileSync(__dirname+'/../probe-foundation.js','utf8')+'\n'+fs.readFileSync(__dirname+'/../probe-kinder.js','utf8')+'\n'+fs.readFileSync(__dirname+'/../probe-core.js','utf8')+'\n'+fs.readFileSync(__dirname+'/../probe-more.js','utf8')+'\n'+fs.readFileSync(__dirname+'/../probe-adv.js','utf8')+'\n'+fs.readFileSync(__dirname+'/../probe-extra.js','utf8')+'\n'+fs.readFileSync(__dirname+'/../probe-last.js','utf8')+'\n'+fs.readFileSync(__dirname+'/../probe-code.js','utf8')+'\n'+fs.readFileSync(__dirname+'/../notebook.js','utf8');
vm.runInContext(a+"\n"+b+"\n;globalThis.__T={PRB,LES};",ctx);
const {PRB,LES}=ctx.__T;let bad=0,n=0;
for(const id of Object.keys(PRB)){const seen={};for(let k=0;k<200;k++)for(const s of['new','verdict','read'])seen[s]=(seen[s]||new Set()).add(PRB[id][s]().q.replace(/\d+/g,'N').replace(/\[.*?\]/g,'[]'));for(const s in seen)if(seen[s].size<2){if(['l1','l2','l3'].includes(id)){bad++;console.log('ONE TEMPLATE',id,s)}else console.log('warn: 1 mẫu',id,s)}if(!LES[id]){console.log("NO LESSON",id);bad++}
 for(const s of ['same','flip','new','verdict','read'])for(let k=0;k<400;k++){n++;const q=PRB[id][s]();
  if(q.o&&new Set(q.o).size!==q.o.length){bad++;console.log('DUP OPTION',id,s,JSON.stringify(q.o));break}
  const okA=q.o?(Number.isInteger(q.a)&&q.a>=0&&q.a<q.o.length):Number.isFinite(q.a);
  const needO=(s=='verdict'||s=='read'),badV=needO&&!q.o,badW=s=='verdict'&&!(q.why&&q.why.a<q.why.o.length);
  if(!q.q||!q.w||!okA||badV||badW){bad++;console.log("BAD",id,s,JSON.stringify(q));break}
  if(id=='l1'&&s=='flip'){const arr=JSON.parse(q.q.match(/\[.*?\]/)[0]),v=+q.q.match(/Số (\d+)/)[1];if(arr.indexOf(v)!==q.a){bad++;console.log("WRONG l1 flip",q.q,q.a);break}}
  if(id=='l1'&&s=='same'){const arr=JSON.parse(q.q.match(/\[.*?\]/)[0]),k2=+q.q.match(/chỉ số (\d+)/)[1];if(arr[k2]!==q.a){bad++;console.log("WRONG l1 same",q.q,q.a);break}}
  if(id=='l3'&&s=='flip'){const arr=JSON.parse(q.q.match(/\[.*?\]/)[0]),k2=+q.q.match(/chỉ số (\d+)/)[1];if(Math.min(...arr.slice(0,k2+1))!==q.a){bad++;console.log("WRONG l3 flip",q.q,q.a);break}}
 }}
// Bản gốc (chưa có ngân hàng mẫu bổ sung) để kiểm tra đáp án theo từng mẫu cũ
const ctx0={document:{querySelector:stub,querySelectorAll:()=>[],createElement:stub,head:stub(),body:stub()},localStorage:{getItem:()=>"",setItem(){}},window:{},console,setTimeout:()=>0,JSON,Math,Date,Set,Object,Array,Number,String};
vm.createContext(ctx0);
const oldFiles=['probe.js','probe-foundation.js','probe-kinder.js','probe-core.js','probe-more.js'].map(f=>fs.readFileSync(__dirname+'/../'+f,'utf8')).join('\n');
vm.runInContext(a+"\n"+oldFiles+"\n;globalThis.__T={PRB};",ctx0);const PO=ctx0.__T.PRB;
for(let k=0;k<400;k++){let q=PO.p3.same();let n=+q.q.match(/range\((\d+)\)/)[1];if(q.a!==n-1){bad++;console.log('WRONG p3.same',q.q,q.a);break}
 q=PO.sm.same();let arr=JSON.parse(q.q.match(/a = (\[.*?\])/)[1]);if(arr.reduce((x,y)=>x+y,0)!==q.a){bad++;console.log('WRONG sm.same');break}
 q=PO.sm.new();arr=JSON.parse(q.q.match(/a = (\[.*?\])/)[1]);if(10+arr.reduce((x,y)=>x+y,0)!==q.a){bad++;console.log('WRONG sm.new');break}
 q=PO.p1.new();const m=q.q.match(/x = (\d+)/);if(+m[1]!==q.a){bad++;console.log('WRONG p1.new');break}
 q=PO.p2.same();const mm=q.q.match(/if (\d+) > (\d+)/);if((q.o[0]==='A')!==(+mm[1]>+mm[2])){bad++;console.log('WRONG p2.same');break}}
for(let k=0;k<400;k++){let q=PO.k3.same();let m=+q.q.match(/thứ (\d+) \(/)[1];if(q.a!==m-1){bad++;console.log('WRONG k3.same');break}
 q=PO.k4.flip();const mb=q.q.match(/thêm (\d+) viên, hộp "kẹo" chứa (\d+)/);if(q.a!==+mb[2]-+mb[1]){bad++;console.log('WRONG k4.flip');break}
 q=PO.k7.read();const mr=q.q.match(/có (\d+) viên\. Lặp (\d+) lần việc "thêm (\d+)/);if(+q.o[0]!==+mr[1]+ +mr[2]* +mr[3]){bad++;console.log('WRONG k7.read');break}
 q=PO.k1.flip();const mf=q.q.match(/đủ (\d+) quả táo và đã có (\d+)/);if(q.a!==+mf[1]-+mf[2]){bad++;console.log('WRONG k1.flip');break}}
for(let k=0;k<400;k++){let q=PO.a3.flip();let m=q.q.match(/a = \[(.*?)\]\na\[\?\] = (\d+)/),r2=q.q.match(/in ra \[(.*?)\]/);const o=m[1].split(',').map(Number),n=r2[1].split(',').map(Number);if(n[q.a]!==+m[2]||o.some((x,i)=>i!==q.a&&x!==n[i])){bad++;console.log('WRONG a3.flip',q.q);break}
 q=PO.cn.same();const ca=JSON.parse(q.q.match(/a = (\[.*?\])/)[1]);if(ca.filter(x=>x==2).length!==q.a){bad++;console.log('WRONG cn.same');break}
 q=PO.cn.new();const cb=JSON.parse(q.q.match(/a = (\[.*?\])/)[1]);if(cb.filter(x=>x%2==0).length!==q.a){bad++;console.log('WRONG cn.new');break}
 q=PO.d2.same();const s=q.q.match(/for ch in "(.*?)"/)[1];if([...s].filter(c=>c=='a').length!==q.a){bad++;console.log('WRONG d2.same');break}
 q=PO.bs.same();const b2=q.q.match(/từ (\d+) đến (\d+)/);if(Math.floor((+b2[1]+ +b2[2])/2)!==q.a){bad++;console.log('WRONG bs.same');break}
 q=PO.a3.new();const an=q.q.match(/a = \[(.*?)\]\na\[(\d)\] = a\[\d\] \+ (\d+)/);if(+an[1].split(',')[+an[2]]+ +an[3]!==q.a){bad++;console.log('WRONG a3.new');break}}
for(let k=0;k<400;k++){let q=PO.k8.new();const nums=q.q.match(/\d+/g).map(Number);if(nums[4]!==undefined){} if(q.a!==nums[3]+(nums[3]-nums[2])){bad++;console.log('WRONG k8.new',q.q);break}
 q=PO.k5.new();if(/bỏ thêm 3\. Lệnh 2: lấy ra 2/.test(q.q)){const x=+q.q.match(/chứa (\d+)\./)[1];if(q.a!==x+5){bad++;console.log('WRONG k5.new');break}}else{const mm5=q.q.match(/chứa (\d+)\. Lệnh 1: lấy ra (\d+)\. Lệnh 2: bỏ thêm (\d+)\. Lệnh 3: bỏ thêm (\d+)/);if(!mm5||q.a!==+mm5[1]-+mm5[2]+ +mm5[3]+ +mm5[4]){bad++;console.log('WRONG k5.new (mẫu 2)');break}}
 q=PO.bub.new();const ba=JSON.parse(q.q.match(/a = (\[.*?\])/)[1]);const pa=ba.slice();for(let i=0;i<2;i++)if(pa[i]>pa[i+1])[pa[i],pa[i+1]]=[pa[i+1],pa[i]];if(pa[/CUỐI CÙNG/.test(q.q)?2:0]!==q.a){bad++;console.log('WRONG bub.new');break}
 q=PO.bub.same();const bs2=JSON.parse(q.q.match(/a = (\[.*?\])/)[1]);const pb=bs2.slice();for(let i=0;i<2;i++)if(pb[i]>pb[i+1])[pb[i],pb[i+1]]=[pb[i+1],pb[i]];if(pb[2]!==q.a){bad++;console.log('WRONG bub.same');break}
 q=PO.h2.same();const hn=(q.q.match(/d\["a"\] = d\["a"\] \+ 1/g)||[]).length+1;if(hn!==q.a){bad++;console.log('WRONG h2.same');break}
 q=PO.tp.new();const ta=JSON.parse(q.q.match(/a = (\[.*?\])/)[1]);if(ta[/Hai hộp ở giữa/.test(q.q)?1:3]!==q.a){bad++;console.log('WRONG tp.new');break}
 q=PO.k2.new();const kk=q.q.match(/Lan có (\d+) kẹo, Mai có (\d+)/);if(q.o[0]!==(+kk[1]<+kk[2]?'Lan':'Mai')){bad++;console.log('WRONG k2.new',q.q);break}
 q=PO.k8.same();}
console.log("checked",n,"bad",bad);process.exit(bad?1:0)
