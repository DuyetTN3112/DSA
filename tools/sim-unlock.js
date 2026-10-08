// node tools/sim-unlock.js : hoàn thành tuần tự theo lộ trình; bài nào cũng phải được mở khóa đúng lúc, và bị khóa khi thiếu tiền đề.
const { JSDOM } = require('jsdom'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..') + '/';
const html = fs.readFileSync(root + 'index.html', 'utf8').replace(/<link[^>]*>/g, '').replace(/<script src="[^"]*"><\/script>/g, '');
const w = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' }).window; w.setTimeout = f => { f(); return 0 };
for (const f of [...fs.readFileSync(root + 'index.html', 'utf8').matchAll(/<script src="([^"]+)"/g)].map(m => m[1])) { const el = w.document.createElement('script'); el.textContent = fs.readFileSync(root + f, 'utf8'); w.document.body.appendChild(el) }
w.eval('window.__x={LES,P,STAGES,PREQ,PRB,unlocked,okPre}');
const X = w.__x, order = X.STAGES.flatMap(s => s.L); let bad = 0;
X.P.done = {};
order.forEach((id, i) => {
  if (!X.unlocked(id)) { bad++; console.log('BỊ KẸT: bài', id, 'chưa mở dù đã xong mọi bài đứng trước') }
  // thiếu một tiền đề trực tiếp có PRB thì phải bị khóa
  const miss = (X.PREQ[id] || []).filter(p => X.PRB[p]);
  if (miss.length) { const saved = X.P.done[miss[0]]; delete X.P.done[miss[0]]; if (X.unlocked(id)) { bad++; console.log('KHÔNG KHÓA khi thiếu tiền đề', miss[0], 'của', id) } if (saved) X.P.done[miss[0]] = saved }
  X.P.done[id] = 1;
});
console.log('lộ trình', order.length, 'bài, bad', bad); process.exit(bad ? 1 : 0)
