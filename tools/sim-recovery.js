// node tools/sim-recovery.js : kiểm thử vòng Learning Recovery mới (jsdom).
// Scenario 1: Chưa hiểu -> phân loại -> reference -> tiny check -> câu mới -> evidence.
// Scenario 2: Đoán + đúng KHÔNG được tính như hiểu (lucky persist, chỉ qua sau câu thêm).
// Scenario 3: đọc reference nhưng tiny check sai -> được regress (học lại / kiểm tra nền).
// Scenario 4: vòng solo mà "Chưa hiểu" -> trượt (không câu cứu), đóng lỗ hổng double-notebook.
// Scenario 5: pass độc lập (không hỗ trợ) vẫn được tính "Vững" bình thường.
// Evidence: profile phân biệt independent / assisted / lucky.
const { JSDOM } = require('jsdom'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..') + '/';
const html = fs.readFileSync(root + 'index.html', 'utf8').replace(/<link[^>]*>/g, '').replace(/<script src="[^"]*"><\/script>/g, '');
const w = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' }).window; w.setTimeout = f => { f(); return 0 };
for (const f of [...fs.readFileSync(root + 'index.html', 'utf8').matchAll(/<script src="([^"]+)"/g)].map(m => m[1])) { const el = w.document.createElement('script'); el.textContent = fs.readFileSync(root + f, 'utf8'); w.document.body.appendChild(el) }
w.eval('window.__x={LES,PRB,P,STAGES,ids,unlocked,probe,notebook,road,hub,TINY,TINY_FOR,tinyFor,tinyCheck,pyRef}');
const X = w.__x, $ = s => w.document.querySelector(s), $$ = s => [...w.document.querySelectorAll(s)];
let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log('FAIL:', m) } };
const txt = h => { const d = w.document.createElement('div'); d.innerHTML = h; return d.textContent };
const ORDER = X.STAGES.flatMap(s => s.L);
let last = null; for (const id of Object.keys(X.PRB)) for (const s of Object.keys(X.PRB[id])) { const f = X.PRB[id][s]; X.PRB[id][s] = () => (last = f()) }
function reset() { X.P.done = {}; ORDER.forEach(i => X.P.done[i] = 1); X.P.weak = {}; X.P.pr = {}; X.P.shaky = {}; X.P.hab = {}; X.P.lt = {}; X.P.hc = { seen: {}, fail: {} }; w.__fakeToday = null; Object.values(X.LES).forEach(l => { l.pd = 0 }) }
const answerRight = () => { const opts = $$('.opts button'); if (opts.length) { const q = last, right = $('#wq') ? q.why.o[q.why.a] : q.o[q.a]; const b = opts.find(b => b.textContent == txt(right)); if (!b) { bad++; console.log('KHÔNG THẤY ĐÁP ÁN ĐÚNG'); return } b.click() } else { $('#v').value = last.a; $('#ok').click() } };
const answerWrong = () => { const opts = $$('.opts button'); if (opts.length) { const q = last, right = $('#wq') ? q.why.o[q.why.a] : q.o[q.a]; const b = opts.find(b => b.textContent != txt(right)); b.click() } else { $('#v').value = last.a + 1; $('#ok').click() } };
function drive(stop, conf = 2, mode = 'right') {
  let g = 0;
  while (g++ < 400) {
    if ($(stop)) return true;
    const cb = $$('[data-c]'); if (cb.length) { cb.find(b => b.dataset.c == conf).click(); continue }
    const nx = $('#nx2'); if (nx) { nx.click(); continue }
    const tcn = $('#tcn2'); if (tcn) { tcn.click(); continue }
    const tinB = $$('#tin .opts button');
    if (tinB.length) { const tq = w.__tinyQ, b = tinB.find(b => b.textContent == txt(tq.o[tq.a])); if (!b) { bad++; console.log('KHÔNG THẤY ĐÁP ÁN ĐÚNG (tiny)'); return false } b.click(); continue }
    const tinI = $('#tin #v'); if (tinI) { tinI.value = w.__tinyQ.a; $('#tok').click(); continue }
    if (mode == 'right') answerRight(); else answerWrong(); continue;
  }
  bad++; console.log('VÒNG LẶP QUÁ DÀI'); return false;
}
// tiny check: trả lời đúng hết (dùng cho flow recovery)
const tinyOk = () => { for (let t = 0; t < 8 && $('#tin'); t++) { const q = w.__tinyQ, tb = $$('#tin .opts button'); if (tb.length) { const b = tb.find(b => b.textContent == txt(q.o[q.a])); if (!b) return false; b.click() } else { const vi = $('#tin #v'); if (!vi) return false; vi.value = q.a; $('#tok').click() } const nx = $('#tcn2'); if (nx) nx.click(); else return false } return !$('#tin') };

// --- Scenario 1: Chưa hiểu (không hiểu đề) -> rd1 -> tiny check -> câu mới -> pass, evidence yếu được ghi nhận ---
reset(); X.probe('k3', 1);
$('[data-c="0"]').click(); $('[data-fk="0"]').click(); // không hiểu đề
ok(/Sổ tay: Đọc đề/.test($('#panel').textContent), 'S1: phải mở sổ tay đọc đề');
$('#nbb').click(); ok(/Kiểm tra nhanh/.test($('#panel').textContent), 'S1: phải có tiny check đọc đề');
ok(tinyOk(), 'S1: tiny check đọc đề');
ok(drive('#so'), 'S1: chưa tới màn làm lại');
ok(!$('#nbk'), 'S1: vòng solo không có nút sổ tay');
$('#so').click(); ok(drive('#gn'), 'S1: chưa qua bài');
ok(X.P.done.k3 == 1, 'S1: phải qua bài');
ok(X.P.pr.k3.fk.de == 1, 'S1: phải ghi nhận loại không-hiểu-đề');
ok(X.P.pr.k3.asst == 1, 'S1: qua nhờ hỗ trợ phải được ghi nhận');
ok(!(X.P.pr.k3.days || []).includes(X.P.pr.k3.last), 'S1: evidence yếu không được tính vào "Vững"');
ok(X.P.lt.k3 && X.P.lt.k3.box == 1, 'S1: evidence yếu phải xếp ôn sớm (hộp 1)');

// --- Scenario 2: Đoán + đúng -> lucky (persist), chỉ qua sau khi đúng câu thêm ---
reset(); X.probe('k3', 1);
$('[data-c="1"]').click(); answerRight(); // Đoán nhưng đúng
ok(/may mắn/.test($('#panel').textContent), 'S2: phải báo "đúng nhờ may mắn thì chưa phải hiểu"');
$('#nx2').click(); ok(drive('#gn'), 'S2: chưa qua bài sau câu thêm');
ok(X.P.done.k3 == 1, 'S2: đúng câu thêm thì qua');
ok(X.P.pr.k3.lucky == 1, 'S2: lucky phải được persist (không mất dấu)');
ok((X.P.pr.k3.days || []).includes(X.P.pr.k3.last), 'S2: qua sau 1 lần lucky + câu thêm đúng vẫn tính ngày (đã chứng minh lại)');

// --- Scenario 3: đọc reference nhưng tiny check SAI -> được regress, và bấm thử từng đường ---
function tinyFail(tag) {
  reset(); X.probe('k3', 1);
  $('#nbk').click(); $('#nbb').click(); ok(/Kiểm tra nhanh/.test($('#panel').textContent), tag + ': phải có tiny check');
  for (let t = 0; t < 8 && $('#tin'); t++) { const q = w.__tinyQ, tb = $$('#tin .opts button'); if (tb.length) { tb.find(b => b.textContent != txt(q.o[q.a])).click() } else { $('#tin #v').value = q.a + 100; $('#tok').click() } $('#tcn2').click(); }
  ok(/chưa chắc/.test($('#panel').textContent), tag + ': tiny sai phải báo chưa chắc');
  ok($('#tcr') && $('#tcn'), tag + ': phải có đường regress (học lại / kiểm tra nền)');
}
tinyFail('S3a');
$('#tcr').click();
ok(X.LES.k3.pd === 0 && /Thứ tự/.test($('#panel').textContent), 'S3a: bấm học lại phải reset bài về bước đầu (start chạy thật)');
tinyFail('S3b');
$('#tcn').click();
ok(/Kiểm tra nền/.test($('#panel').textContent), 'S3b: bấm kiểm tra nền phải sang màn kiểm tra nền (rootcheck chạy thật)');

// --- Scenario 4: vòng solo mà "Chưa hiểu" -> trượt, không câu cứu ---
reset(); X.probe('k3', 1);
$('#nbk').click(); $('#nbb').click(); ok(tinyOk(), 'S4: tiny check');
ok(drive('#so'), 'S4: chưa tới màn làm lại');
$('#so').click(); // vòng solo, 1 câu
$('[data-c="0"]').click(); // Chưa hiểu ở vòng solo
ok(!X.P.done.k3 && (X.P.pr.k3.f || 0) >= 1, 'S4: solo mà chưa hiểu phải trượt (rút dấu xong)');
ok(!(X.P.hab || {}).unknown, 'S4: "chưa hiểu" không được tính là thói quen xấu');

// --- Scenario 5: pass độc lập -> Vững bình thường, không bị hạ hộp ôn ---
reset(); X.P.lt.k3 = { box: 3, due: '2999-01-01', n: 5, lapse: 0, cl: 0, ls: "new", seen: "2000-01-01" };
X.probe('k3', 1);
ok(drive('#gn'), 'S5: chưa qua bài');
ok(X.P.done.k3 == 1, 'S5: phải qua bài');
ok(!X.P.pr.k3.asst, 'S5: pass độc lập không được ghi assisted');
ok((X.P.pr.k3.days || []).includes(X.P.pr.k3.last), 'S5: pass độc lập được tính vào "Vững"');
ok(X.P.lt.k3.box == 3, 'S5: pass độc lập không được hạ hộp ôn của bài');

// --- Scenario 6: qua nhờ sổ tay khi bài đang ở hộp cao -> hạ về hộp 1, ôn sớm ---
reset(); X.P.lt.k3 = { box: 3, due: '2999-01-01', n: 5, lapse: 0, cl: 0, ls: "new", seen: "2000-01-01" };
X.probe('k3', 1); $('#nbk').click(); $('#nbb').click(); ok(tinyOk(), 'S6: tiny check');
ok(drive('#so'), 'S6: chưa tới màn làm lại'); $('#so').click(); ok(drive('#gn'), 'S6: chưa qua bài');
ok(X.P.lt.k3.box == 1, 'S6: qua nhờ sổ tay phải hạ về hộp 1 để ôn sớm');

// --- Evidence trên hồ sơ: phân biệt independent / assisted / lucky ---
reset();
X.P.pr = { k3: { p: 2, f: 0, miss: {}, last: '2000-01-01', days: ['2000-01-01'], asst: 1, lucky: 2, fk: { de: 1, concept: 2 }, unk: 1 } };
X.road(); $('#lpf').click();
ok(/đoán đúng/.test($('#panel').textContent) && /2/.test($('#panel').textContent), 'HS: phải hiện số lần đoán đúng');
ok(/không hiểu đề/.test($('#panel').textContent), 'HS: phải hiện breakdown loại vướng mắc');

// --- lucky phải hiện ngay cả khi chưa từng assisted (bug: từng nằm trong conditional asst) ---
reset();
X.P.pr = { k3: { p: 1, f: 0, miss: {}, last: '2000-01-01', days: ['2000-01-01'], lucky: 3, fk: {} } };
X.road(); $('#lpf').click();
ok(/đoán đúng/.test($('#panel').textContent) && /3/.test($('#panel').textContent), 'HS2: lucky phải hiện ngay cả khi chưa từng assisted');
ok(!/nhờ sổ tay/.test($('#panel').textContent), 'HS2: chưa assisted thì không được hiện dòng nhờ sổ tay');

// --- notebook k3 dạng mini-textbook: đủ 10 mục + link nền ---
X.notebook('k3', () => { }, 'Quay lại');
ok(/Mental model/.test($('#panel').textContent) && /Ví dụ ngược/.test($('#panel').textContent), 'NB: k3 phải render dạng mini-textbook');
ok(/Cách tự kiểm tra/.test($('#panel').textContent) && /Quy tắc dùng ngay/.test($('#panel').textContent), 'NB: k3 phải có quy tắc + tự kiểm tra');
ok($('[data-nb2]'), 'NB: k3 phải có link về bài nền / concept liên quan');

// --- Config integrity: mọi id trong TINY_FOR / pyRef / nbk links phải tồn tại trong LES ---
// (regression guard: từng xóa nhầm vì grep bỏ sót object NEW trong app.js)
for (const id of Object.keys(X.TINY_FOR)) ok(X.LES[id], 'TINY_FOR.' + id + ' phải tồn tại trong LES');
ok(X.tinyFor('a2') === 'k3' && X.tinyFor('a3') === 'k3' && X.tinyFor('bs') === 'k3', 'tinyFor(a2/a3/bs) phải về bank k3, không được null');
ok(X.LES.k3.nbk.links.every(l => X.LES[l]), 'mọi link trong nbk k3 phải tồn tại trong LES');
ok(X.pyRef('sm') !== 'sm' && X.LES[X.pyRef('sm')], 'pyRef(sm) phải về bài Python gần nhất, không được trả về chính nó');

// --- rd1 đủ sâu: >= 13 bước (10 cũ + 5 mới: input/output, động từ, đối tượng, edge case) ---
ok(X.LES.rd1.steps.length >= 13, 'rd1 phải có >= 13 bước, hiện là ' + X.LES.rd1.steps.length);

// --- Q-bank: đề có đường về sổ tay bài liên quan ---
reset(); X.road();
const qb = $('[data-q]'); ok(qb, 'Q: phải có nút đề Q-bank');
qb.click(); ok($('#hpb'), 'Q: đề phải có nút giở sổ tay bài liên quan');
$('#hpb').click(); ok(/Sổ tay/.test($('#panel').textContent), 'Q: phải mở sổ tay bài liên quan');
$('#nbb').click(); ok($('#hpb'), 'Q: phải quay lại đề sau khi đọc sổ tay');

console.log('sim-recovery xong, bad', bad); process.exit(bad ? 1 : 0);
