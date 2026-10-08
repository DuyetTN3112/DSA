// node tools/verify-notes.js : kiểm tra sổ tay viết tay.
// 1) mọi đoạn <pre> chạy được trong sổ tay (gói trong notes-more.js) được CHẠY bằng Python thật; mỗi dòng print(...) # KQ phải ra đúng KQ ghi bên cạnh.
// 2) các ý khẳng định không nằm trong code (tổng, đường nối, số bước chia đôi...) được tính lại độc lập bằng Python.
// Cần: node, python3, jsdom.
const { JSDOM } = require('jsdom'), fs = require('fs'), path = require('path'), cp = require('child_process');
const root = path.join(__dirname, '..') + '/';
const html = fs.readFileSync(root + 'index.html', 'utf8').replace(/<link[^>]*>/g, '').replace(/<script src="[^"]*"><\/script>/g, '');
const w = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' }).window; w.setTimeout = f => { f(); return 0 };
for (const f of [...fs.readFileSync(root + 'index.html', 'utf8').matchAll(/<script src="([^"]+)"/g)].map(m => m[1])) { const el = w.document.createElement('script'); el.textContent = fs.readFileSync(root + f, 'utf8'); w.document.body.appendChild(el) }
w.eval('window.__x={LES}'); const LES = w.__x.LES;
let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log('FAIL:', m) } };
const NEW = 'bx0 b2 b3 b4 b5 b6 d1 d2 tp stk que bs bub t1 t2 g1 dp2 ap5 k1 k2 k4 k8 k9 b1 h1 h2 h3 r1 r2 r3 n1 n2 n3 e1 e2 e3 e4 g2 g3 dp1 m1 m2 m3 rl1 ap1 ap2 ap3 ap4 ap6'.split(' ');
const PRE = { // phần dựng sẵn cho đoạn code không tự đủ
  t1: 'class Cay:\n    def __init__(self, v):\n        self.v = v; self.left = None; self.right = None\n', t2: 'class Cay:\n    def __init__(self, v):\n        self.v = v; self.left = None; self.right = None\nr = Cay(1); r.left = Cay(2); r.right = Cay(3); r.left.left = Cay(4)\n',
  ap5: 'tree = {"size": 0, "children": [{"size": 5, "children": []}, {"size": 0, "children": [{"size": 7, "children": []}, {"size": 3, "children": []}]}]}\n',
  stk: '_s = []\ndef push(x): _s.append(x)\ndef pop(): return _s.pop()\n', que: 'from collections import deque\n_q = deque()\ndef enqueue(x): _q.append(x)\ndef dequeue(): return _q.popleft()\n',
  b2: 'n = 5\n', b3: '', b5: 'a = [4, 5, 6]\n', b6: ''
};
PRE.ap4 = 'deps = {"app": ["lib", "log"], "lib": ["core"], "log": ["core"], "core": []}\n';
const POST = { t2: 'print(dem(r))  # 4\n', ap5: 'print(total(tree))  # 15\nprint(total(tree["children"][1]))  # 10\n', b4: '', b6: 'print(find_max([3, 1, 2]))  # 3\nprint(find_max([-5, -2, -9]))  # -2\n', b5: '' };
const strip = h => { const d = w.document.createElement('div'); d.innerHTML = h; return d.textContent };
let run = 0, skipped = [];
for (const id of NEW) {
  const note = LES[id] && LES[id].note; ok(!!note, 'thiếu note: ' + id); if (!note) continue;
  ok(strip(note).length >= 450, id + ': trang quá ngắn (' + strip(note).length + ' ký tự)');
  ok(/Mẹo|Lỗi hay gặp/.test(strip(note)), id + ': thiếu mục Lỗi hay gặp / Mẹo');
  for (const m of note.matchAll(/<pre>([\s\S]*?)<\/pre>/g)) {
    const code = strip(m[1]); const prog = (PRE[id] || '') + code + '\n' + (POST[id] || '');
    // đoạn pseudo (không phải Python hợp lệ) thì bỏ qua và ghi lại
    const chk = cp.spawnSync('python3', ['-c', 'import sys,ast;ast.parse(sys.stdin.read())'], { input: prog, encoding: 'utf8' });
    if (chk.status) { skipped.push(id + ': ' + code.split('\n')[0].slice(0, 40)); continue }
    // đổi mọi print(...)  # KQ thành so sánh
    const lines = prog.split('\n'); const exp = [];
    const inst = lines.map(l => { const mm = l.match(/^(\s*)print\((.*)\)\s*#\s*(.+)$/); if (mm) { exp.push(mm[3].trim().split(/\s{2,}/)[0]); return `${mm[1]}print(${mm[2]})` } return l }).join('\n');
    const r = cp.spawnSync('python3', ['-c', inst], { encoding: 'utf8', timeout: 10000 }); run++;
    ok(r.status == 0, id + ': code lỗi khi chạy: ' + (r.stderr || '').split('\n').slice(-2)[0]);
    const out = (r.stdout || '').trim().split('\n').filter(x => x != '');
    if (exp.length) ok(out.length >= exp.length, id + ': thiếu dòng in'); 
    exp.forEach((e, i) => ok(out[i] === e, `${id}: print thứ ${i + 1} ra "${out[i]}" nhưng sổ tay ghi "${e}"`));
  }
}
console.log('Đã chạy ' + run + ' đoạn code Python; bỏ qua (pseudo, kiểm tay ở dưới): ' + skipped.length); skipped.forEach(s => console.log('  - ' + s));

// 2) các ý khẳng định tính lại độc lập (Python thật)
const py = s => cp.spawnSync('python3', ['-c', s], { encoding: 'utf8' }).stdout.trim();
// chia đôi
ok(py('a=[1,3,5,7,9,11,13];lo,hi=0,len(a)-1;t=11;p=[]\nwhile lo<=hi:\n m=(lo+hi)//2;p.append((m,a[m]))\n if a[m]==t:break\n lo,hi=(m+1,hi) if a[m]<t else (lo,m-1)\nprint(p)') === '[(3, 7), (5, 11)]', 'bs: đường đi tìm 11 phải là hộp 3 (7) rồi hộp 5 (11)');
ok(py('print((0+6)//2,(4+6)//2,2**20>1000000,2**19<1000000)') === '3 5 True True', 'bs: hộp giữa, và 2^20 ≈ một triệu');
// nổi bọt
ok(py('a=[3,1,2]\nfor i in range(2):\n if a[i]>a[i+1]:a[i],a[i+1]=a[i+1],a[i]\nb=[3,2,1]\nfor i in range(2):\n if b[i]>b[i+1]:b[i],b[i+1]=b[i+1],b[i]\nprint(a,b)') === '[1, 2, 3] [2, 1, 3]', 'bub: một lượt trên [3,1,2] và [3,2,1]');
// hai con trỏ
ok(py('a=[1,2,3,4];i,j=0,3\nr=[]\nwhile i<j:\n a[i],a[j]=a[j],a[i];i+=1;j-=1;r.append(list(a))\nprint(r)') === '[[4, 2, 3, 1], [4, 3, 2, 1]]', 'tp: hai bước đổi chỗ');
// stack / queue
ok(py('s=[];[s.append(x) for x in (3,5,8)];a=s.pop();b=s.pop()\nfrom collections import deque\nq=deque((3,5,8));c=q.popleft();d=q.popleft()\nprint(a,b,s,c,d,list(q))') === '8 5 [3] 3 5 [8]', 'stk/que: 8,5 còn [3]; 3,5 còn [8]');
// đồ thị
ok(py('ban={"An":["Binh","Chi"],"Binh":["An","Dung"],"Chi":["An"],"Dung":["Binh"]}\nprint(ban["Chi"],len(ban["An"]),sum(map(len,ban.values())),sum(map(len,ban.values()))//2)') === "['An'] 2 6 3", 'g1: bạn của Chi, bậc của An, 6 mục / 2 = 3 đường');
// dp
ok(py('dp=[1,2]\nfor i in range(2,5):dp.append(dp[i-1]+dp[i-2])\nprint(dp)\n# kiểm bằng vét cạn\ndef f(n):return 1 if n<=1 else f(n-1)+f(n-2) if n>2 else n\nprint([f(k) for k in range(1,6)])') === '[1, 2, 3, 5, 8]\n[1, 2, 3, 5, 8]', 'dp2: bảng và vét cạn phải khớp');
// d2
ok(py('d={}\nfor ch in "abca":d[ch]=d.get(ch,0)+1\nprint(d)') === "{'a': 2, 'b': 1, 'c': 1}", 'd2: tần suất abca');
// d1: KeyError thật
ok(py('d={"a":3}\ntry:\n d["z"]\nexcept KeyError:print("KeyError")') === 'KeyError', 'd1: tra khóa chưa có phải KeyError');
// b3 / b4 / b5 / b6 chạy ở trên; xác nhận thêm các ý "không báo lỗi" của b6 và NameError của b4
ok(py('def f(nums):\n best=nums[0]\n for x in nums:\n  if x>best:pass\n  best=x\n return best\nprint(f([9,1,2]))') === '2', 'b6: quên thụt best = x cho ra số cuối (2), không lỗi');
ok(py('try:\n g(1)\nexcept NameError:print("NameError")') === 'NameError', 'b4: gọi hàm chưa tạo phải NameError');
// t2 thứ tự in
ok(py('class C:\n def __init__(s,v):s.v=v;s.left=None;s.right=None\nr=C(1);r.left=C(2);r.right=C(3);r.left.left=C(4)\no=[]\ndef p(n):\n if n is None:return\n o.append(n.v);p(n.left);p(n.right)\np(r);print(o)') === '[1, 2, 4, 3]', 't2: thứ tự in 1,2,4,3');
// ===== đợt 3: nhóm nền (k1 k2 k4 k8 k9 b1 h1 h2 h3 r1 r2 r3 n1 n2 n3) =====
// k2: so sánh
ok(py('print(7>4,9>12,5>5,5>=5)') === 'True False False True', 'k2: 7>4 đúng, 9>12 sai, 5>5 sai, 5>=5 đúng');
// k4: tuổi 10 +1 và a+b
ok(py('t=10;t=t+1;a=5;b=3;c=a+b;print(t,c,a,b)') === '11 8 5 3', 'k4: tuổi 11; c = 8; a, b vẫn nguyên');
// k8: quy luật
ok(py('print(8+2,8*2,4*2,4+3)') === '10 16 8 7', 'k8: 2,4,6,8->10; 1,2,4,8->16; 1,2,4 có thể ra 8 hoặc 7');
ok(py('d=[2,4,6,8];e=[1,2,4,8];print({b-a for a,b in zip(d,d[1:])},{b//a for a,b in zip(e,e[1:])})') === '{2} {2}', 'k8: cộng 2 đều và nhân 2 đều');
// k9: x = 5 rồi x = 9; a[2]
ok(py('x=5;x=9;a=[10,20,30];print(x,a[2])') === '9 30', 'k9: x = 9 và a[2] = 30');
// b1: SyntaxError thật
ok(py('for c in ("5 = x","print(x"):\n try:compile(c,"s","exec")\n except SyntaxError:print("SE",end=" ")') === 'SE SE', 'b1: "5 = x" và "print(x" phải là SyntaxError');
ok(py('x=5;y=x+2;x=x+1;print(x,y);x=100;print(y)') === '6 7\n7', 'b1: y không đi theo x về sau');
// h1: ghi đè key cũ không thêm cặp; list tra bằng số
ok(py('d={"An":10,"Binh":12};d["An"]=11;print(len(d),d["An"])') === '2 11', 'h1: ghi key đã có thì vẫn 2 cặp, giá trị đổi');
// h2: KeyError thật; get; vòng lặp xóa bảng nếu d={} để trong vòng
ok(py('d={}\ntry:d["x"]\nexcept KeyError:print("KeyError")') === 'KeyError', 'h2: tra key chưa có phải KeyError');
ok(py('d={}\nfor ch in "abca":d[ch]=d.get(ch,0)+1\nprint(d)\ne={}\nfor ch in "abca":\n e={}\n e[ch]=e.get(ch,0)+1\nprint(e)') === "{'a': 2, 'b': 1, 'c': 1}\n{'a': 1}", 'h2: đặt d = {} trong vòng lặp làm mất số đếm');
// h3: two sum đúng; ghi trước rồi mới kiểm tra thì ghép số với chính nó
ok(py('def ok(nums,t):\n seen={};r=[]\n for i,x in enumerate(nums):\n  y=t-x\n  if y in seen:r.append((seen[y],i))\n  seen[x]=i\n return r\ndef bad(nums,t):\n seen={};r=[]\n for i,x in enumerate(nums):\n  seen[x]=i\n  y=t-x\n  if y in seen:r.append((seen[y],i))\n return r\nprint(ok([2,7,11],9),ok([3],6),bad([3],6))') === '[(0, 1)] [] [(0, 0)]', 'h3: kiểm tra trước rồi mới ghi; ghi trước thì [3], target 6 ra cặp (0, 0) giả');
// r2: thứ tự in và thiếu ca cơ sở
ok(py('import io,contextlib\ndef dd(n):\n if n==0:\n  print("xong");return\n print(n);dd(n-1)\ndef e(n):\n if n==0:return\n e(n-1);print(n)\nb=io.StringIO()\nwith contextlib.redirect_stdout(b):dd(3);e(3)\nprint(b.getvalue().split())') === "['3', '2', '1', 'xong', '1', '2', '3']", 'r2: dd(3) in 3,2,1,xong; e(3) in 1,2,3');
ok(py('def f(n):return n+f(n-1)\ntry:f(3)\nexcept RecursionError:print("RecursionError")') === 'RecursionError', 'r2: thiếu ca cơ sở phải RecursionError');
// r3: số lần gọi, giới hạn độ sâu
ok(py('c=[0]\ndef dem(n):\n c[0]+=1\n return 0 if n==0 else n+dem(n-1)\ndem(3);print(c[0],dem(900))') === '4 405450', 'r3: dem(3) có 4 lần gọi; dem(900) = 405450 (= 900*901/2)');
ok(py('import sys\ndef dem(n):return 0 if n==0 else n+dem(n-1)\nprint(sys.getrecursionlimit())\ntry:dem(1000)\nexcept RecursionError:print("RecursionError")\nprint(sum(range(1001)))') === '1000\nRecursionError\n500500', 'r3: giới hạn mặc định 1000 và dem(1000) lỗi trong môi trường kiểm thử này');
// n1: đi quá nút cuối là AttributeError
ok(py('class N:\n def __init__(s,v):s.v=v;s.next=None\nc=N(2)\ntry:c.next.v\nexcept AttributeError:print("AttributeError")') === 'AttributeError', 'n1: c.next.v phải AttributeError');
// n2: đi hết 5,8,2; điều kiện sai bỏ sót nút cuối; quên cur = cur.next thì không bao giờ dừng
ok(py('class N:\n def __init__(s,v):s.v=v;s.next=None\na=N(5);b=N(8);c=N(2);a.next=b;b.next=c\no=[];cur=a\nwhile cur is not None:\n o.append(cur.v);cur=cur.next\nw=[];cur=a\nwhile cur.next is not None:\n w.append(cur.v);cur=cur.next\nk=0;cur=a\nwhile cur is not None and k<10:\n k+=1\nprint(o,w,k)') === '[5, 8, 2] [5, 8] 10', 'n2: đúng in 5,8,2; cur.next bỏ sót nút cuối; quên dời cur thì không dừng');
// n3: chèn đầu đúng thứ tự; đảo thứ tự làm nút mới chỉ vào chính nó
ok(py('class N:\n def __init__(s,v):s.v=v;s.next=None\na=N(5);b=N(8);a.next=b;head=a\nnew=N(9);new.next=head;head=new\nr=[head.v,head.next.v,head.next.next.v]\na=N(5);b=N(8);a.next=b;head=a\nnew=N(9);head=new;new.next=head\nprint(r,new.next is new,head.next is head)') === '[9, 5, 8] True True', 'n3: chèn đúng ra 9,5,8; đảo thứ tự thì nút mới chỉ vào chính nó');
ok(py('a=[5,8];a.insert(0,9);print(a)') === '[9, 5, 8]', 'n3: chèn đầu mảng dời các phần tử');
// ===== đợt 4: e1 e2 e3 e4 g2 g3 dp1 =====
// e1: tên lỗi và thông điệp thật
ok(py('def t(f):\n try:f()\n except Exception as e:print(type(e).__name__+": "+str(e))\nt(lambda:[10,20,30][3])\nt(lambda:{"a":1}["b"])\nt(lambda:"5"+2)\nt(lambda:tong)') === "IndexError: list index out of range\nKeyError: 'b'\nTypeError: can only concatenate str (not \"int\") to str\nNameError: name 'tong' is not defined", 'e1: tên và thông điệp của IndexError, KeyError, TypeError, NameError');
ok(py('n=3;print(n-1,len(range(n)),list(range(n))[-1])') === '2 3 2', 'e1: n phần tử thì chỉ số lớn nhất là n-1');
// e2: lệch một; ca một phần tử
ok(py('def bad(n):\n t=0\n for i in range(len(n)-1):t+=n[i]\n return t\ndef good(n):\n t=0\n for i in range(len(n)):t+=n[i]\n return t\nprint(bad([1,2,3]),good([1,2,3]),bad([5]),good([5]),list(range(len([1,2,3])-1)))') === '3 6 0 5 [0, 1]', 'e2: bản sai 3, bản đúng 6; ca [5] lộ lỗi (0 so với 5); i chỉ là 0,1');
ok(py('try:\n n=[1,2,3]\n [n[i] for i in range(len(n)+1)]\nexcept IndexError:print("IndexError")') === 'IndexError', 'e2: range(len+1) gây IndexError');
// e3: khởi tạo sai
ok(py('def tot(n,s):\n for x in n:s+=x\n return s\ndef mx(n,b):\n for x in n:\n  if x>b:b=x\n return b\nprint(tot([1,2,3],1),tot([1,2,3],0),tot([],1),mx([-5,-2,-9],0),mx([-5,-2,-9],-5),mx([1,2,3],0),mx([-5,-2,-9],[-5,-2,-9][0]))') === '7 6 1 0 -2 3 -2', 'e3: total=1 ra 7; best=0 với toàn âm ra 0; [1,2,3] vẫn đúng 3');
ok(py('n=[-5,-2,-9];b=n[0]\nfor x in n:\n if x>b:b=x\nprint(b)\ntry:[][0]\nexcept IndexError:print("IndexError")') === '-2\nIndexError', 'e3: sửa bằng phần tử đầu ra -2; danh sách rỗng gây IndexError');
// e4: đếm lẻ thay vì chẵn
ok(py('def bad(n):\n c=0\n for x in n:\n  if x%2==1:c+=1\n return c\ndef good(n):\n c=0\n for x in n:\n  if x%2==0:c+=1\n return c\nprint(bad([2,4,5]),good([2,4,5]),good([]),good([1,3]),good([2,4]))') === '1 2 0 0 2', 'e4: bản sai 1, bản đúng 2');
ok(py('try:compile("if x\\n  pass","s","exec")\nexcept SyntaxError:print("SyntaxError")') === 'SyntaxError', 'e4: lỗi cú pháp báo trước khi chạy');
// g2: BFS thứ tự, khoảng cách; thiếu seen thì không dừng; đánh dấu lúc lấy ra bị xếp trùng; deque cho cùng thứ tự
ok(py('ban={"An":["Binh","Chi"],"Binh":["An","Dung"],"Chi":["An"],"Dung":["Binh"]}\nfrom collections import deque\ndef bfs(s):\n q=[s];seen={s};o=[];d={s:0}\n while q:\n  x=q.pop(0);o.append(x)\n  for y in ban[x]:\n   if y not in seen:seen.add(y);d[y]=d[x]+1;q.append(y)\n return o,d\ndef bfq(s):\n q=deque([s]);seen={s};o=[]\n while q:\n  x=q.popleft();o.append(x)\n  for y in ban[x]:\n   if y not in seen:seen.add(y);q.append(y)\n return o\no,d=bfs("An")\nprint(o,d["Dung"],bfq("An")==o,len(o))') === "['An', 'Binh', 'Chi', 'Dung'] 2 True 4", 'g2: thứ tự An,Binh,Chi,Dung; Dung cách 2; deque cùng thứ tự');
ok(py('ban={"An":["Binh","Chi"],"Binh":["An","Dung"],"Chi":["An"],"Dung":["Binh"]}\nq=["An"];k=0\nwhile q and k<20:\n x=q.pop(0);k+=1\n q+=ban[x]\nprint(k)') === '20', 'g2: thiếu seen thì chạy mãi (chạm trần 20 lượt)');
ok(py('g={"A":["B","C"],"B":["A","D"],"C":["A","D"],"D":["B","C"]}\nq=["A"];seen=set();o=[]\nwhile q:\n x=q.pop(0)\n if x in seen:continue\n seen.add(x);o.append(x)\n for y in g[x]:\n  if y not in seen:q.append(y)\nq2=["A"];s2={"A"};cnt=0;c2=0\nwhile q2:\n x=q2.pop(0)\n for y in g[x]:\n  if y not in s2:s2.add(y);q2.append(y);c2+=1\nq3=["A"];s3=set();pushed=[]\nwhile q3:\n x=q3.pop(0);s3.add(x)\n for y in g[x]:\n  if y not in s3:q3.append(y);pushed.append(y)\nprint(pushed.count("D")>1,c2)') === 'True 3', 'g2: đánh dấu lúc lấy ra làm D bị xếp hàng nhiều lần; đánh dấu lúc xếp hàng thì chỉ 3 lần xếp');
// g3: DFS thứ tự; thiếu seen thì RecursionError
ok(py('ban={"An":["Binh","Chi"],"Binh":["An","Dung"],"Chi":["An"],"Dung":["Binh"]}\nseen=set();o=[]\ndef dfs(x):\n seen.add(x);o.append(x)\n for y in ban[x]:\n  if y not in seen:dfs(y)\ndfs("An")\ndef bad(x):\n for y in ban[x]:bad(y)\ntry:bad("An")\nexcept RecursionError:print(o,len(o),"RecursionError")') === "['An', 'Binh', 'Dung', 'Chi'] 4 RecursionError", 'g3: thứ tự An,Binh,Dung,Chi; thiếu seen thì RecursionError');
// dp1: số lần fib(2) bị tính, tổng số lần gọi, fib(50), số bài con của memo
ok(py('c={}\ndef f(n):\n c[n]=c.get(n,0)+1\n return n if n<2 else f(n-1)+f(n-2)\nprint(f(4),c[2],sum(c.values()))') === '3 2 9', 'dp1: fib(4)=3; fib(2) bị tính 2 lần; tổng 9 lần gọi');
ok(py('def calls(n):\n a,b=1,1\n for _ in range(n-1):a,b=b,1+a+b\n return b if n>=1 else 1\nc=[1,1]\nfor n in range(2,51):c.append(1+c[n-1]+c[n-2])\nprint(c[50]>40*10**9,c[50])') === 'True 40730022147', 'dp1: fib(50) kiểu cũ cần hơn 40 tỷ lần gọi');
ok(py('memo={}\ndef fib(n):\n if n<2:return n\n if n in memo:return memo[n]\n memo[n]=fib(n-1)+fib(n-2)\n return memo[n]\nprint(fib(50),len(memo),min(memo),max(memo))') === '12586269025 49 2 50', 'dp1: memo fib(50) = 12586269025, 49 bài con (2..50)');

// ===== đợt 5: m1 m2 m3 rl1 ap1 ap2 ap3 ap4 ap6 =====
// m1: cùng dữ liệu, hai giả định cho hai kết quả; cho_am=False phải ValueError
ok(py('def f(lo,c):\n s=0\n for l,t in lo:\n  s=s+t if l=="nap" else s-t\n  if s<0 and not c:raise ValueError("x")\n return s\nlo=[("nap",100),("rut",150)]\nr=[f(lo,True)]\ntry:f(lo,False)\nexcept ValueError:r.append("ValueError")\nprint(r)') === "[-50, 'ValueError']", 'm1: cho âm ra -50, không cho âm ra ValueError');
// m2: 3 giao dịch xấu, tính lại độc lập từng lỗi; amount âm raise ValueError
ok(py('t=[(1,"deposit",100),(2,"withdraw",30),(2,"deposit",10),(3,"gift",5),(4,"deposit",-20)]\nids=[x[0] for x in t]\ndup=sum(1 for i,x in enumerate(t) if x[0] in ids[:i])\nodd=sum(1 for x in t if x[1] not in ("deposit","withdraw"))\nneg=sum(1 for x in t if x[2]<0)\nprint(dup,odd,neg,dup+odd+neg)') === '1 1 1 3', 'm2: 1 trùng id + 1 loại lạ + 1 số tiền âm = 3');
ok(py('def k(a):\n if a<0:raise ValueError("amount am")\ntry:k(-50)\nexcept ValueError:print("ValueError")') === 'ValueError', 'm2: amount -50 phải ValueError');
// m3: 100-30-50 = 20; 20-80 = -60; rút trước nạp sau: cuối +20 nhưng giữa chừng -80
ok(py('print(100-30-50,20-80)') === '20 -60', 'm3: 20 và -60');
ok(py('def xl(lo):\n for x in lo:\n  if not isinstance(x,int):raise TypeError("t")\n s=0\n for x in lo:\n  s+=x\n  if s<0:raise ValueError("v")\n return s\nr=[xl([100,-30,-50])]\nfor d in ([-80,100],[1,"a"],[100,-30,-80]):\n try:xl(d)\n except Exception as e:r.append(type(e).__name__)\nprint(r)') === "[20, 'ValueError', 'TypeError', 'ValueError']", 'm3: đường ống: [-80,100] vẫn ValueError dù cuối dương; chữ gây TypeError');
// rl1: bản đúng; bản dùng < thay <=; bản ghi cả yêu cầu bị từ chối; stack bỏ nhầm; trùng với đáp án w12
ok(py('def f(ts,lim,win,le=True,rec=False,stack=False):\n q=[];r=[]\n for t in ts:\n  while q and ((q[0]<=t-win) if le else (q[0]<t-win)):q.pop(0)\n  if len(q)<lim:q.append(t);r.append(True)\n  else:\n   r.append(False)\n   if rec:q.append(t)\n return r\nprint(f([1,2,3,4],2,3),f([1,2,3,4],2,3,le=False),f([1,2,3,4],2,3,rec=True),f([1,2,3],1,2),f([5,5,5],2,10))') === '[True, True, False, True] [True, True, False, False] [True, True, False, False] [True, False, True] [True, True, False]', 'rl1: đúng [T,T,F,T]; dùng < hoặc ghi cả yêu cầu bị từ chối ra [T,T,F,F]; khớp ca của w12');
// ap1: 3 lần trúng, 303 ms và 600 ms, 3 lần chạm db, dữ liệu cũ
ok(py('print(3*100+3*1,6*100)') === '303 600', 'ap1: 303ms có cache, 600ms không cache');
ok(py('cache={};n=[0]\ndef g(m):\n if m not in cache:\n  n[0]+=1;cache[m]=m*10\n return cache[m]\n[g(m) for m in [1,2,1,1,3,2]]\nprint(n[0],len(cache))') === '3 3', 'ap1: 6 lần hỏi, 3 lần chạm db');
// ap2: queue lấy A trước, stack lấy C trước; lấy từ hàng rỗng là IndexError
ok(py('q=["A","B","C"];s=["A","B","C"]\nprint(q.pop(0),s.pop())\ntry:[].pop(0)\nexcept IndexError:print("IndexError")') === 'A C\nIndexError', 'ap2: queue lấy A, stack lấy C, hàng rỗng gây IndexError');
// ap3: ngoặc; chỉ đếm số lượng thì bị đánh lừa bởi "([)]"
ok(py('def h(s):\n cap={")":"(","]":"["};st=[]\n for ch in s:\n  if ch in "([":st.append(ch)\n  elif ch in ")]":\n   if not st or st.pop()!=cap[ch]:return False\n return not st\ndef dem(s):return s.count("(")==s.count(")") and s.count("[")==s.count("]")\nprint([h(x) for x in ["([])","([)]","((",")(","","()[]"]],dem("([)]"))') === '[True, False, False, False, True, True] True', 'ap3: ngoặc hợp lệ; chỉ đếm số lượng thì "([)]" bị coi là đúng');
// ap4: sắp xếp topo; thứ tự khác cũng hợp lệ; thứ tự ngược sai; vòng gây RecursionError
ok(py('deps={"app":["lib","log"],"lib":["core"],"log":["core"],"core":[]}\ndef valid(o):return all(all(o.index(d)<o.index(g) for d in deps[g]) for g in o)\nprint(valid(["core","lib","log","app"]),valid(["core","log","lib","app"]),valid(["app","lib","log","core"]),valid(["lib","app","core","log"]))') === 'True True False False', 'ap4: thứ tự cài hợp lệ không duy nhất; ngược thì sai');
ok(py('deps={"app":["lib"],"lib":["log"],"log":["lib"]}\nd=[]\ndef cai(g):\n if g in d:return\n for x in deps[g]:cai(x)\n d.append(g)\ntry:cai("app")\nexcept RecursionError:print("RecursionError")') === 'RecursionError', 'ap4: phụ thuộc vòng làm code chạy mãi và báo RecursionError');
// ap6: set không đảm bảo thứ tự nhưng dict.fromkeys giữ thứ tự chèn
ok(py('e=["a@x.com","b@x.com","a@x.com"]\nprint(len(set(e)),list(dict.fromkeys(e)))') === "2 ['a@x.com', 'b@x.com']", 'ap6: set còn 2 email; dict.fromkeys giữ thứ tự');

console.log(bad ? 'CÓ ' + bad + ' LỖI' : 'TẤT CẢ ĐẠT'); process.exit(bad ? 1 : 0);
