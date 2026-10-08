// node tools/sim-probe.js : giả lập người học làm kiểm tra hiểu thật qua giao diện (jsdom).
// Cần: npm i jsdom (ở thư mục bất kỳ), đặt NODE_PATH tới node_modules đó nếu cần.
const { JSDOM } = require('jsdom'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..') + '/';
const html = fs.readFileSync(root + 'index.html', 'utf8').replace(/<link[^>]*>/g, '').replace(/<script src="[^"]*"><\/script>/g, '');
const dom = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' }); const w = dom.window; w.setTimeout = f => { f(); return 0 };
const scripts = [...fs.readFileSync(root + 'index.html', 'utf8').matchAll(/<script src="([^"]+)"/g)].map(m => m[1]);
// Skulpt/CDN không có ở đây; app.js chỉ cần khi chạy code, không cần cho phần kiểm tra hiểu thật.
for (const f of scripts) { const el = w.document.createElement('script'); el.textContent = fs.readFileSync(root + f, 'utf8'); w.document.body.appendChild(el) }
w.eval('window.__x={LES,PRB,P,probe,road,STAGES}');
const X = w.__x, $ = s => w.document.querySelector(s), $$ = s => [...w.document.querySelectorAll(s)];
let bad = 0, ran = 0; const txt = h => { const d = w.document.createElement('div'); d.innerHTML = h; return d.textContent };
const IDS = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(X.PRB);
for (const id of IDS) for (const mode of ['right', 'wrong']) {
  X.P.done = {}; X.STAGES.flatMap(s => s.L).forEach(i => { if (i != id) X.P.done[i] = 1 }); X.P.weak = {}; X.P.pr = {}; X.P.shaky = {}; X.P.hab = {};
  let last = null; const G = X.PRB[id], orig = {}; for (const s of Object.keys(G)) { orig[s] = G[s]; G[s] = () => (last = orig[s]()) }
  try {
    X.probe(id); let guard = 0;
    while (guard++ < 30) {
      if ($('#gn') || $('#rl') || $('#rcb') || /Kiểm tra nền/.test($('#panel').textContent)) break;
      const conf = $$('[data-c]'); if (conf.length) { conf.find(b => b.dataset.c == '3').click(); continue }
      const nx = $('#nx2'); if (nx) { nx.click(); continue }
      const opts = $$('.opts button');
      if (opts.length) { const texts = opts.map(b => b.innerHTML);
        const q = last; const inWhy = !!$('#wq');
        if (inWhy) { const t = q.why.o[q.why.a], b = opts.find(b => b.textContent == txt(t)); (mode == 'right' ? b : opts[0]).click() }
        else { const t = q.o[q.a]; let b = opts.find(b => b.textContent == txt(t)); if (!b) { bad++; console.log('KHÔNG THẤY LỰA CHỌN ĐÚNG', id, JSON.stringify(t), texts); break } if (mode == 'wrong') b = opts.find(x => x !== b); b.click() }
        continue }
      const inp = $('#v'); if (inp) { inp.value = mode == 'right' ? last.a : last.a + 1; $('#ok').click(); continue }
      bad++; console.log('KẸT GIAO DIỆN', id, mode, $('#panel').textContent.slice(0, 120)); break;
    }
    ran++;
    if (mode == 'right' && !X.P.done[id]) { bad++; console.log('ĐÚNG MÀ KHÔNG QUA', id, $('#panel').textContent.slice(0, 160)) }
    if (mode == 'wrong' && X.P.done[id]) { bad++; console.log('SAI MÀ VẪN QUA', id) }
  } catch (e) { bad++; console.log('LỖI SCRIPT', id, mode, e.message) }
  Object.assign(G, orig);
}
console.log('giả lập', ran, 'lượt kiểm tra trên giao diện, bad', bad); process.exit(bad ? 1 : 0)
