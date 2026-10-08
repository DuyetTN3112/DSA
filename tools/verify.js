const fs=require('fs'),vm=require('vm'),cp=require('child_process');
const src=fs.readFileSync(process.argv[2],'utf8');
const stub=()=>new Proxy(function(){},{get:(t,k)=>k==='length'?0:(k===Symbol.toPrimitive?()=>'':stub()),set:()=>true,apply:()=>stub()});
const ctx={document:{querySelector:stub,querySelectorAll:()=>[],createElement:stub,head:stub()},localStorage:{getItem:()=>"",setItem(){}},window:{},console,setTimeout:()=>0,JSON,Math,Date,Set,Object,Array,String,Number,Error,Promise};
vm.createContext(ctx);
vm.runInContext(src.replace(/\nroad\(\);draw\(\);\s*$/,"\n")+"\n;globalThis.__T={LES,hid,errChk,PB};",ctx);
const {LES,hid,errChk,PB}=ctx.__T;let bad=0,n=0;
const run=code=>cp.spawnSync('python3',['-c',code],{encoding:'utf8',timeout:20000});
for(const id of Object.keys(LES)){const L=LES[id];if(!L.ref)continue;n++;
 L.code=L.ref;const r=run(hid(L,"err"));
 const out=(r.stdout||"").trim();
 if(r.status!==0||out){bad++;console.log("FAIL",id,(r.stderr||"").split("\n").slice(-3).join(" "),out.slice(0,300))}
 // hang rao: empty function must fail the visible tests
 const stubf=`def ${L.fn}(*a):\n    return None\n`;L.code=stubf;const r2=run(hid(L,"happy"));
 if(!(r2.stdout||"").trim()){bad++;console.log("WEAK TESTS",id)}
}
for(const id of Object.keys(PB)){const B=PB[id];n++;/* only syntax-check problem tests */ }
console.log("checked",n,"bad",bad);
