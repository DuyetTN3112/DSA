// node tools/verify-adv.js : chạy Python THẬT cho mọi câu hỏi có _py và so với đáp án của app.
// Kiểm tra thêm: đáp án hợp lệ, không trùng lựa chọn, đáp án đúng nằm trong lựa chọn, các quan hệ không có code.
const fs = require('fs'), vm = require('vm'), cp = require('child_process');
const stub = () => new Proxy(function () { }, { get: (t, k) => k === 'length' ? 0 : (k === Symbol.toPrimitive ? () => '' : stub()), set: () => true, apply: () => stub() });
const ctx = { document: { querySelector: stub, querySelectorAll: () => [], createElement: stub, head: stub(), body: stub() }, localStorage: { getItem: () => "", setItem() { } }, window: {}, console, setTimeout: () => 0, JSON, Math, Date, Set, Object, Array, Number, String };
vm.createContext(ctx);
const D = __dirname + '/../', rd = f => fs.readFileSync(D + f, 'utf8');
const app = rd('app.js').replace(/\nroad\(\);draw\(\);\s*$/, "\n");
const files = ['probe.js', 'probe-foundation.js', 'probe-kinder.js', 'probe-core.js', 'probe-more.js', 'probe-adv.js', 'probe-extra.js', 'probe-last.js', 'probe-code.js', 'notebook.js'].filter(f => fs.existsSync(D + f)).map(rd).join('\n');
vm.runInContext(app + "\n" + files + "\n;globalThis.__T={PRB,LES,PREQ,STAGES};", ctx);
const { PRB, LES, PREQ, STAGES } = ctx.__T; ctx.__X = vm.runInContext("({gGen,gBfs,gDfs,stairs})", ctx); Object.assign(ctx, ctx.__X);
const IDS = process.argv.slice(2).length ? process.argv.slice(2) : ['r1', 'r2', 'r3', 'n1', 'n2', 'n3', 't1', 't2', 'g1', 'g2', 'g3', 'dp1', 'dp2', 'e1', 'e2', 'e3', 'e4', 'que', 'bs', 'k2', 'k5', 'k8', 'k9', 'tp', 'bub', 'h1', 'h2', 'h3', 'd1', 'd2', 'stk', 'bx0', 'p1', 'p2', 'p3', 'sm', 'k3', 'k4', 'k6', 'k7', 'a2', 'a3', 'cn', 'p4', 'l1', 'l2', 'l3', 'k1', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'm1', 'm2', 'm3', 'rl1', 'ap1', 'ap2', 'ap3', 'ap4', 'ap5', 'ap6', 'w1', 'w2', 'w3', 'w4', 'w5', 'w6', 'w7', 'w8', 'w9', 'w10', 'w11', 'w12', 'rd1'];
const N = +process.env.N || 60; let bad = 0, total = 0; const jobs = [];
for (const id of IDS) for (const s of ['same', 'flip', 'new', 'verdict', 'read']) for (let k = 0; k < N; k++) {
  const q = PRB[id][s](); total++;
  const o = q.o;
  if (o) { if (new Set(o).size != o.length) { bad++; console.log('DUP OPTION', id, s, JSON.stringify(o)) } if (!(q.a >= 0 && q.a < o.length)) { bad++; console.log('BAD INDEX', id, s) } } else if (!Number.isFinite(q.a)) { bad++; console.log('BAD NUM', id, s) }
  if ((s == 'verdict' || s == 'read') && !o) { bad++; console.log('NEEDS OPTIONS', id, s) }
  if (s == 'read' && o && o.length != 3) { bad++; console.log('READ OPTS', id, o.length) }
  if (q._syn) for (const [code, ok] of q._syn) jobs.push({ id, s, q: q.q.slice(0, 80), kind: 'syn', code, ok });
  if (q._py && q._py.code) jobs.push({ id, s, q: q.q.slice(0, 80), code: q._py.code, out: q._py.out, err: q._py.err, ans: q.o ? q.o[q.a] : q.a });
}
const py = `
import sys, json, io, contextlib, signal
jobs = json.load(open(sys.argv[1]))
res = []
def tmo(*a): raise TimeoutError()
signal.signal(signal.SIGALRM, tmo)
for j in jobs:
    if j.get('kind') == 'syn':
        try:
            compile(j['code'], 'x', 'exec'); okc = True
        except SyntaxError:
            okc = False
        res.append({'syn': okc}); continue
    buf = io.StringIO(); err = ''
    signal.alarm(3)
    try:
        with contextlib.redirect_stdout(buf):
            exec(j['code'], {'__name__': '__main__'})
    except BaseException as e:
        err = type(e).__name__
    signal.alarm(0)
    res.append({'out': buf.getvalue().split('\\n')[:-1] if buf.getvalue() else [], 'err': err})
json.dump(res, open(sys.argv[2], 'w'))
`;
fs.writeFileSync('/tmp/jobs.json', JSON.stringify(jobs)); fs.writeFileSync('/tmp/run.py', py);
const r = cp.spawnSync('python3', ['/tmp/run.py', '/tmp/jobs.json', '/tmp/res.json'], { encoding: 'utf8', timeout: 180000 });
if (r.status !== 0) { console.log('python failed', r.stderr.slice(-400)); process.exit(1) }
const res = JSON.parse(fs.readFileSync('/tmp/res.json', 'utf8'));
jobs.forEach((j, i) => { const g = res[i]; if (j.kind == 'syn') { if (g.syn !== j.ok) { bad++; if (bad < 25) console.log('SYNTAX MISMATCH', j.id, JSON.stringify(j.code), 'expect ok =', j.ok) } return } const okOut = JSON.stringify(g.out) == JSON.stringify(j.out), okErr = g.err == j.err; if (!okOut || !okErr) { bad++; if (bad < 25) console.log('MISMATCH', j.id, j.s, '\n  expect', JSON.stringify(j.out), j.err, '\n  python', JSON.stringify(g.out), g.err, '\n  ', j.q) } });
// quan hệ không có code
for (let k = 0; k < 300; k++) {
  const G = ctx.gGen(fR2(5, 5), 1); const s = G.ns[0], d = G.adj[s].length, o = ctx.gBfs(G.adj, s);
  const set = new Set(G.adj[s]); for (let i = 1; i <= d; i++) if (!set.has(o[i])) { bad++; console.log('g2.flip sai: bạn trực tiếp không đứng liền sau S'); break }
  const df = ctx.gDfs(G.adj, s); if (df.length > 1 && !set.has(df[1])) { bad++; console.log('g3.flip sai: dòng 2 của DFS không phải bạn của S'); break }
}
function fR2(a, b) { return a + Math.floor(Math.random() * (b - a + 1)) }
// dp2 'new' đối chiếu vét cạn
const brute = (n, st) => { if (n == 0) return 1; let c = 0; for (const s of st) if (n - s >= 0) c += brute(n - s, st); return c };
for (let n = 1; n <= 9; n++) for (const st of [[1, 2], [1, 3]]) if (ctx.stairs(n, st) !== brute(n, st)) { bad++; console.log('stairs sai', n, st) }
// chuỗi tiền đề: không vòng, tiền đề luôn đứng TRƯỚC trong lộ trình
const order = STAGES.flatMap(s => s.L), pos = Object.fromEntries(order.map((x, i) => [x, i]));
for (const id of Object.keys(PREQ)) for (const p of PREQ[id]) { if (!(p in pos) || !(id in pos)) { bad++; console.log('PREQ lạ', id, p); continue } if (pos[p] >= pos[id]) { bad++; console.log('TIỀN ĐỀ ĐỨNG SAU (sẽ kẹt khi học tuần tự):', id, '<-', p) } }
console.log('checked', total, 'câu;', jobs.length, 'đoạn Python đã chạy thật; bad', bad); process.exit(bad ? 1 : 0)
