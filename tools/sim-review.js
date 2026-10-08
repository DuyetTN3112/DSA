// node tools/sim-review.js : giả lập người học (jsdom) cho review.js:
// lịch Leitner, lên/xuống hộp, đoán may, thoái lui có bằng chứng, kiểm tra nền tảng, đổi cách dạy khi trượt lần 2, hồ sơ học.
const { JSDOM } = require('jsdom'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..') + '/';
const html = fs.readFileSync(root + 'index.html', 'utf8').replace(/<link[^>]*>/g, '').replace(/<script src="[^"]*"><\/script>/g, '');
const w = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' }).window; w.setTimeout = f => { f(); return 0 };
for (const f of [...fs.readFileSync(root + 'index.html', 'utf8').matchAll(/<script src="([^"]+)"/g)].map(m => m[1])) { const el = w.document.createElement('script'); el.textContent = fs.readFileSync(root + f, 'utf8'); w.document.body.appendChild(el) }
w.eval('window.__x={LES,PRB,P,STAGES,start,road,unlocked,draw}');
const X = w.__x, R = w.REV, $ = s => w.document.querySelector(s), $$ = s => [...w.document.querySelectorAll(s)];
let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log('FAIL:', m) } };
const txt = h => { const d = w.document.createElement('div'); d.innerHTML = h; return d.textContent };
const ORDER = X.STAGES.flatMap(s => s.L);
// bắt đề mới nhất để biết đáp án
let last = null; for (const id of Object.keys(X.PRB)) for (const s of Object.keys(X.PRB[id])) { const f = X.PRB[id][s]; X.PRB[id][s] = () => (last = f()) }
function reset(doneAll = true) { X.P.done = {}; if (doneAll) ORDER.forEach(i => X.P.done[i] = 1); X.P.weak = {}; X.P.pr = {}; X.P.shaky = {}; X.P.hab = {}; X.P.lt = {}; X.P.hc = { seen: {}, fail: {} }; X.P.diag = {}; w.__fakeToday = null }
// lái giao diện: modeFn(k) -> 'right' | 'wrong'; conf: 1 đoán, 2 hơi chắc, 3 chắc chắn; dừng khi thấy selector stop
function drive(stop, modeFn, conf = 2) {
  let k = -1, g = 0, asked = 0;
  while (g++ < 300) {
    if ($(stop)) return asked;
    const cb = $$('[data-c]'); if (cb.length) { k++; cb.find(b => b.dataset.c == conf).click(); asked++; continue }
    const nx = $('#nx2'); if (nx) { nx.click(); continue }
    const opts = $$('.opts button'), mode = modeFn(k);
    if (opts.length) { const q = last; const right = $('#wq') ? q.why.o[q.why.a] : q.o[q.a]; let b = opts.find(b => b.textContent == txt(right)); if (!b) { bad++; console.log('KHÔNG THẤY LỰA CHỌN ĐÚNG'); return -1 } if (mode == 'wrong') b = opts.find(x => x !== b); b.click(); continue }
    const inp = $('#v'); if (inp) { inp.value = mode == 'right' ? last.a : last.a + 1; $('#ok').click(); continue }
    bad++; console.log('KẸT GIAO DIỆN', $('#panel').textContent.slice(0, 150)); return -1;
  }
  bad++; console.log('VÒNG LẶP QUÁ DÀI'); return -1;
}
const day = n => R.addD(new Date().toISOString().slice(0, 10), n);

// 1. nút điều hướng
reset(); X.road();
ok($('#lrv') && $('#lhc') && $('#lpf'), 'thiếu ba nút Ôn cách quãng / Kiểm tra nền tảng / Hồ sơ học');

// 2. lịch: vừa qua kiểm tra thì chưa đến hạn; ngày mai thì đến hạn; mỗi buổi tối đa 6 bài
reset(); X.P.pr = {}; ORDER.forEach(i => { if (X.PRB[i]) X.P.pr[i] = { p: 1, f: 0, miss: {}, last: day(0), days: [day(0)] } });
ok(R.dueList().length == 0, 'bài vừa kiểm tra xong không được đến hạn ngay');
w.__fakeToday = day(1); const n64 = R.dueList().length; ok(n64 == Object.keys(X.PRB).length, 'ngày mai phải đến hạn hết, có ' + n64);
$('#lrv').click(); X.road(); $('#lrv').click(); $('#rvs').click();
let asked = drive('#rvx', () => 'right'); ok(asked == 6, 'một buổi ôn phải đúng 6 câu, có ' + asked);
const up = Object.values(R.LT()).filter(i => i.box == 2); ok(up.length == 6, 'làm đúng cả 6 phải lên hộp 2, có ' + up.length);
ok(up.every(i => i.due == R.addD(day(1), 3)), 'hộp 2 phải hẹn sau 3 ngày');
ok(R.dueList().length == n64 - 6, 'sau buổi ôn, 6 bài không còn đến hạn cùng ngày');

// 3. đoán may: đúng nhưng chọn Đoán thì không lên hộp
reset(); w.__fakeToday = day(1); X.P.pr = { l1: { p: 1, f: 0, miss: {}, last: day(0), days: [day(0)] } }; Object.keys(X.P.done).forEach(i => { if (i != 'l1') delete X.P.done[i] });
$('#lrv').click(); $('#rvs').click(); drive('#rvx', () => 'right', 1);
ok(R.item('l1').box == 1 && /Đoán/.test($('#panel').textContent), 'đúng mà đoán không được lên hộp');
ok(R.item('l1').due == R.addD(day(1), 1), 'đoán may: mai ôn lại');

// 4. sai: về hộp 1; sai 1 lần do cẩu thả ở hộp cao KHÔNG bị ⚠; tự tin mà sai thì ⚠
reset(); w.__fakeToday = day(1); X.P.pr = { l1: { p: 1, f: 0, miss: {}, last: day(0), days: [day(0)] } }; Object.keys(X.P.done).forEach(i => { if (i != 'l1') delete X.P.done[i] });
R.item('l1').box = 4; R.item('l1').due = day(1); const rnd0 = w.Math.random; w.Math.random = () => 0; // cố định: chọn dạng 'same' (không phải câu bẫy đọc đề)
$('#lrv').click(); $('#rvs').click(); drive('#rvx', () => 'wrong', 2);
ok(R.item('l1').box == 1 && R.item('l1').cl == 1, 'sai phải về hộp 1');
ok(!X.P.shaky.l1 && X.P.done.l1, 'sai cẩu thả một lần ở hộp cao không được phá mastery (chỉ về hộp 1)');
ok((X.P.hab || {}).careless == 1, 'phải ghi nhận thói quen cẩu thả');
w.__fakeToday = day(2); $('#lrv').click(); $('#rvs').click(); drive('#rvx', () => 'wrong', 3);
ok(X.P.shaky.l1 && X.P.done.l1, 'sai 2 lần liên tiếp (một lần tự tin mà sai) phải bị ⚠ nhưng chưa mất dấu xong');
ok((X.P.hab || {}).overconfident == 1, 'phải ghi nhận tự tin mà sai');
ok($('[data-pf]'), 'phải có nút chứng minh lại');

w.Math.random = rnd0;
// 5. sai 3 lần liên tiếp: rút dấu xong, bài phụ thuộc bị ⚠
w.__fakeToday = day(3); $('#lrv').click(); $('#rvs').click(); drive('#rvx', () => 'wrong', 2);
ok(!X.P.done.l1 && X.P.weak.l1 == 1, 'sai 3 lần liên tiếp phải rút dấu xong');
ok(/3 lần liên tiếp/.test($('#panel').textContent), 'phải giải thích lý do rút dấu xong');
ok(!R.LT().l1, 'bài bị rút phải bị bỏ khỏi lịch ôn');

// 6. kiểm tra nền tảng
reset(); X.P.pr = {}; ok(R.hcDue() == true, 'chưa từng kiểm tra nền tảng thì phải đến hạn');
X.road(); $('#lhc').click(); $('#hcs').click(); asked = drive('#hcx', () => 'right'); ok(asked == 6, 'kiểm tra nền tảng 6 câu, có ' + asked);
ok(R.HC().last && !R.hcDue(), 'vừa kiểm tra xong thì chưa đến hạn lại'); w.__fakeToday = day(8); ok(R.hcDue(), 'sau 7 ngày phải đến hạn lại'); w.__fakeToday = day(8);
X.P.shaky = {}; $('#lhc').click(); $('#hcs').click(); drive('#hcx', () => 'wrong', 2);
const sh1 = Object.keys(X.P.shaky); ok(sh1.length >= 6, 'sai lần 1 phải ⚠ các bài nền đã hỏi, có ' + sh1.length);
const asked1 = Object.keys(R.HC().fail).filter(i => R.HC().fail[i] == 1); ok(asked1.length == 6, 'phải đếm sai lần 1 cho 6 bài');
const doneBefore = Object.keys(X.P.done).length; w.__fakeToday = day(16);
$('#lhc').click(); $('#hcs').click(); drive('#hcx', () => 'wrong', 2);
ok(Object.keys(X.P.done).length < doneBefore, 'sai ở hai lần kiểm tra nền liên tiếp phải rút dấu xong');
ok(/hai lần kiểm tra liên tiếp/.test($('#panel').textContent), 'phải giải thích lý do');

// 7. đổi cách dạy khi trượt lần 2
reset(); X.P.weak.p3 = 2; X.P.pr.p3 = { p: 0, f: 2, miss: { flip: 2, read: 1 }, last: day(0), days: [] }; delete X.P.done.p3; X.road();
X.start('p3'); ok($('#dgt') && $('#dgb').disabled, 'trượt lần 2 phải hiện chẩn đoán và khóa nút');
ok(/đi ngược chiều \(2 lần\)/.test($('#panel').textContent), 'phải nêu dạng sai nhiều nhất');
$('#dgt').value = 'aaaa'; $('#dgt').oninput(); ok($('#dgb').disabled, 'gõ bừa không được mở nút');
$('#dgt').value = 'Vòng lặp chạy lại một việc nhiều lần, mình hay nhầm điểm dừng'; $('#dgt').oninput(); ok(!$('#dgb').disabled, 'viết thật thì mở nút');
$('#dgb').click(); ok(X.P.diag.p3 && X.P.diag.p3.top == 'flip', 'phải lưu chẩn đoán'); ok(!$('#dgt'), 'sau chẩn đoán phải vào bài học');
X.start('p3'); ok(!$('#dgt'), 'cùng một lần trượt không hiện chẩn đoán hai lần');
reset(); X.P.weak.p3 = 1; delete X.P.done.p3; X.start('p3'); ok(!$('#dgt'), 'trượt lần 1 chưa cần chẩn đoán');

// 8. hồ sơ học và dữ liệu cũ thiếu trường
reset(); X.P.shaky.l2 = 1; X.P.weak.l3 = 2; X.P.hab = { careless: 3 }; delete X.P.lt; delete X.P.hc; X.road(); $('#lpf').click();
ok(/Hồ sơ học/.test($('#panel').textContent) && /Bước tiếp theo/.test($('#panel').textContent), 'hồ sơ phải hiện');
ok(/Chứng minh lại/.test($('#panel').textContent), 'có bài ⚠ thì bước tiếp theo phải là chứng minh lại');
reset(); delete X.P.lt; delete X.P.hc; X.road(); $('#lrv').click(); ok(/Hôm nay không còn|Bắt đầu|Chưa có bài/.test($('#panel').textContent), 'dữ liệu cũ thiếu P.lt không được làm hỏng');
reset(false); X.road(); $('#lrv').click(); ok(/Chưa có bài nào để ôn/.test($('#panel').textContent), 'chưa học gì thì báo chưa có bài để ôn');

// 9. không làm hỏng khóa bài
reset(false); const order = ORDER; let stuck = 0; order.forEach(i => { if (!X.unlocked(i)) { stuck++ } X.P.done[i] = 1 }); ok(stuck == 0, 'lộ trình bị kẹt ' + stuck);
console.log('sim-review xong, bad', bad); process.exit(bad ? 1 : 0)
