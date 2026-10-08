// node tools/sim-notebook.js : kiểm tra (jsdom) sổ tay, nút «Chưa hiểu» thay cho điền bừa, vòng "đúng nhờ sổ tay thì làm lại bằng đề mới",
// «Chưa nhớ» khi ôn / kiểm tra nền không bị tính là sai, và bài rd1 (đọc đề) nằm đúng chỗ trong lộ trình.
const { JSDOM } = require('jsdom'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..') + '/';
const html = fs.readFileSync(root + 'index.html', 'utf8').replace(/<link[^>]*>/g, '').replace(/<script src="[^"]*"><\/script>/g, '');
const w = new JSDOM(html, { runScripts: 'dangerously', url: 'http://localhost/' }).window; w.setTimeout = f => { f(); return 0 };
for (const f of [...fs.readFileSync(root + 'index.html', 'utf8').matchAll(/<script src="([^"]+)"/g)].map(m => m[1])) { const el = w.document.createElement('script'); el.textContent = fs.readFileSync(root + f, 'utf8'); w.document.body.appendChild(el) }
w.eval('window.__x={LES,PRB,P,STAGES,ids,unlocked,probe,notebook,road,hub,TINY,tinyFor,tinyCheck}');
const X = w.__x, R = w.REV, $ = s => w.document.querySelector(s), $$ = s => [...w.document.querySelectorAll(s)];
let bad = 0; const ok = (c, m) => { if (!c) { bad++; console.log('FAIL:', m) } };
const txt = h => { const d = w.document.createElement('div'); d.innerHTML = h; return d.textContent };
const ORDER = X.STAGES.flatMap(s => s.L);
let last = null; for (const id of Object.keys(X.PRB)) for (const s of Object.keys(X.PRB[id])) { const f = X.PRB[id][s]; X.PRB[id][s] = () => (last = f()) }
function reset(all = true) { X.P.done = {}; if (all) ORDER.forEach(i => X.P.done[i] = 1); X.P.weak = {}; X.P.pr = {}; X.P.shaky = {}; X.P.hab = {}; X.P.lt = {}; X.P.hc = { seen: {}, fail: {} }; w.__fakeToday = null; Object.values(X.LES).forEach(l => { l.pd = 0 }) }
function drive(stop, modeFn = () => 'right', conf = 2) {
  let k = -1, g = 0;
  while (g++ < 300) {
    if ($(stop)) return true;
    const cb = $$('[data-c]'); if (cb.length) { k++; cb.find(b => b.dataset.c == conf).click(); continue }
    const nx = $('#nx2'); if (nx) { nx.click(); continue }
    const tcn = $('#tcn2'); if (tcn) { tcn.click(); continue }
    const tinB = $$('#tin .opts button');
    if (tinB.length) { const tq = w.__tinyQ, b = tinB.find(b => b.textContent == txt(tq.o[tq.a])); if (!b) { bad++; console.log('KHÔNG THẤY LỰA CHỌN ĐÚNG (tiny)'); return false } b.click(); continue }
    const tinI = $('#tin #v'); if (tinI) { tinI.value = w.__tinyQ.a; $('#tok').click(); continue }
    const fks = $$('[data-fk]'); if (fks.length) { fks[1].click(); continue }
    const opts = $$('.opts button'), mode = modeFn(k);
    if (opts.length) { const q = last, right = $('#wq') ? q.why.o[q.why.a] : q.o[q.a]; let b = opts.find(b => b.textContent == txt(right)); if (!b) { bad++; console.log('KHÔNG THẤY LỰA CHỌN ĐÚNG'); return false } if (mode == 'wrong') b = opts.find(x => x !== b); b.click(); continue }
    const inp = $('#v'); if (inp) { inp.value = mode == 'right' ? last.a : last.a + 1; $('#ok').click(); continue }
    bad++; console.log('KẸT GIAO DIỆN', $('#panel').textContent.slice(0, 160)); return false;
  }
  bad++; console.log('VÒNG LẶP QUÁ DÀI'); return false;
}
const qText = () => $('.q') && $('.q').textContent;

// 1. sổ tay hiện được cho MỌI bài, có nội dung và có đường quay lại / học lại
let empty = 0; for (const id of Object.keys(X.LES)) { X.notebook(id, () => { }, 'Quay lại'); const t = $('#panel').textContent; if (!t.includes('Sổ tay') || $$('#panel li').length < 1 && !X.LES[id].note && !$('#panel details')) { empty++; console.log('sổ tay rỗng:', id) } if (!$('#nbb') || !$('#nbr')) { bad++; console.log('thiếu nút:', id) } }
ok(empty == 0, 'có sổ tay rỗng: ' + empty);
X.notebook('k3', () => { }, 'Quay lại'); ok(/chỉ số/.test($('#panel').textContent) && /n - 1/.test($('#panel').textContent), 'sổ tay k3 phải có phần viết tay về chỉ số và n - 1');
X.notebook('w1', () => { }, 'Quay lại'); ok(/def find_max/.test($('#panel').textContent), 'sổ tay bài code phải có lời giải chuẩn');

// 2. bài rd1 nằm đúng chỗ, mở khóa đúng
ok(X.ids.indexOf('rd1') == X.ids.indexOf('k3') + 1 && ORDER.indexOf('rd1') == ORDER.indexOf('k3') + 1, 'rd1 phải đứng ngay sau k3 trong lộ trình');
reset(false); ORDER.slice(0, ORDER.indexOf('rd1')).forEach(i => X.P.done[i] = 1); ok(X.unlocked('rd1') && !X.unlocked('k4'), 'k4 phải khóa cho tới khi xong rd1');
ok(X.LES.rd1.steps.length >= 8 && X.LES.rd1.steps.every(s => s.s), 'rd1 phải có đủ bước, mỗi bước có câu rút ra');

// 3. màn câu hỏi có «Chưa hiểu» và sổ tay
reset(); delete X.P.done.k3; X.probe('k3', 1);
ok($('[data-c="0"]') && $('#nbk'), 'câu hỏi phải có nút «Chưa hiểu» và nút sổ tay');
// 4. giở sổ tay -> tiny check -> quay lại ĐÚNG câu hỏi đó; làm đúng nhờ sổ tay thì phải làm lại bằng đề mới
const tinyOk = () => { for (let t = 0; t < 8 && $('#tin'); t++) { const q = w.__tinyQ, tb = $$('#tin .opts button'); if (tb.length) { const b = tb.find(b => b.textContent == txt(q.o[q.a])); if (!b) return false; b.click() } else { const vi = $('#tin #v'); if (!vi) return false; vi.value = q.a; $('#tok').click() } const nx = $('#tcn2'); if (nx) nx.click(); else return false } return !$('#tin') };
const q1 = qText(); $('#nbk').click(); ok(/Sổ tay/.test($('#panel').textContent), 'phải hiện sổ tay'); ok(X.P.pr.k3.unk == 1, 'phải đếm một lần giở sổ tay');
$('#nbb').click(); ok(/Kiểm tra nhanh/.test($('#panel').textContent), 'sau sổ tay phải có tiny check, không quay lại câu cũ ngay');
ok(tinyOk(), 'tiny check phải làm được'); ok(qText() == q1, 'qua tiny check phải quay lại ĐÚNG câu hỏi cũ');
ok(drive('#so'), 'chưa tới màn làm lại'); ok(/Gần xong rồi/.test($('#panel').textContent) && !X.P.done.k3, 'đúng nhờ sổ tay: chưa được cho qua, phải làm lại bằng đề mới');
ok(!$('#nbk'), 'vòng solo KHÔNG được hiện nút sổ tay (đóng lỗ hổng double-notebook)');
const lastBefore = last; $('#so').click(); ok(qText() && last !== lastBefore, 'câu làm lại phải được sinh mới (không dùng lại đề cũ)');
ok(drive('#gn'), 'chưa tới màn qua bài'); ok(X.P.done.k3 == 1 && /Qua kiểm tra/.test($('#panel').textContent), 'làm lại đúng, không sổ tay: phải qua bài');
ok(X.P.pr.k3.asst == 1, 'qua bài sau khi dùng sổ tay phải được ghi nhận là assisted');
ok(!(X.P.pr.k3.days || []).includes(X.P.pr.k3.last), 'đúng nhờ sổ tay KHÔNG được tính vào số ngày "Vững"');
ok(X.P.lt.k3 && X.P.lt.k3.box == 1, 'đúng nhờ sổ tay phải về hộp ôn số 1 để ôn sớm');

// 5. «Chưa hiểu» là learning signal: hỏi rõ vướng ở đâu rồi mở đúng reference; không phạt
reset(); X.probe('k3', 1); $('[data-c="0"]').click();
ok(/vướng ở đâu/.test($('#panel').textContent), '«Chưa hiểu» phải hỏi rõ vướng ở đâu, không ép đoán');
$('[data-fk="1"]').click(); ok(/Sổ tay/.test($('#panel').textContent), 'chọn loại vướng mắc phải mở sổ tay');
ok(X.P.done.k3 == 1 && !X.P.weak.k3 && !(X.P.pr.k3.f), '«Chưa hiểu» không được bị tính là trượt');
ok(X.P.pr.k3.fk && X.P.pr.k3.fk.concept == 1, 'phải ghi nhận loại vướng mắc (concept)');
ok($('#nbr'), 'phải có đường học lại bài');
// phân loại "không hiểu đề" mở đúng reference đọc đề (rd1), kèm tiny check đọc đề
reset(); X.probe('k3', 1); $('[data-c="0"]').click(); $('[data-fk="0"]').click();
ok(/Sổ tay: Đọc đề/.test($('#panel').textContent), '«không hiểu đề» phải mở sổ tay bài đọc đề (rd1)');
ok(X.P.pr.k3.fk && X.P.pr.k3.fk.de == 1, 'phải ghi nhận loại không-hiểu-đề');
$('#nbb').click(); ok(/Kiểm tra nhanh/.test($('#panel').textContent), 'sau reference đọc đề phải có tiny check đọc đề');
ok(tinyOk(), 'tiny check đọc đề phải làm được');
// "chỉ không chắc đáp án" thì quay lại chọn độ chắc chắn, không mở sổ tay, không tính unk
reset(); X.probe('k3', 1); $('[data-c="0"]').click(); $('[data-fk="5"]').click();
ok($('[data-c="3"]') && !(X.P.pr.k3 || {}).unk, '«chỉ không chắc» phải quay lại màn chắc chắn, không giở sổ tay');
// giở nhiều lần phải khuyên học lại từ đầu
reset(); X.P.pr.k3 = { p: 0, f: 0, miss: {}, unk: 2 }; X.notebook('k3', () => { }, 'Quay lại');
ok(/nên học lại bài từ đầu/.test($('#panel').textContent), 'giở nhiều lần phải khuyên học lại từ đầu');

// 6. sai SAU KHI giở sổ tay: không bị gắn cẩu thả / tự tin sai (đã nỗ lực), vẫn được câu thêm
reset(); X.probe('k3', 1); $('#nbk').click(); $('#nbb').click(); drive('#nx2', () => 'wrong', 3);
ok(!(X.P.hab || {}).careless && !(X.P.hab || {}).overconfident, 'sai sau khi dùng sổ tay không được gắn thói quen xấu'); ok(/Chưa đúng/.test($('#panel').textContent), 'phải báo chưa đúng');

// 7. đáp án sai không thể "bấm đến khi đúng": sai thì sang câu khác, không có nút thử lại cùng câu
reset(); X.probe('k3', 1); drive('#nx2', () => 'wrong', 2); const before = qText(); $('#nx2').click(); ok(!$('[data-o]') || qText() != before, 'sai xong phải sang câu khác');

// 8. ôn cách quãng / kiểm tra nền: «Chưa nhớ» không bị tính là sai
reset(); X.P.pr = { l1: { p: 1, f: 0, miss: {}, last: '2000-01-01', days: ['2000-01-01'] } }; Object.keys(X.P.done).forEach(i => { if (i != 'l1') delete X.P.done[i] }); R.item('l1').box = 3; R.item('l1').due = '2000-01-02';
X.road(); $('#lrv').click(); $('#rvs').click(); ok(!$('#nbk') && $('[data-c="0"]'), 'khi ôn phải đóng sách (không sổ tay) nhưng vẫn có «Chưa nhớ»');
$('[data-c="0"]').click(); ok($('#rvx'), 'phải kết thúc buổi ôn'); ok(R.item('l1').box == 3 && R.item('l1').cl == 0 && X.P.pr.l1.f == 0, '«Chưa nhớ» khi ôn không được hạ hộp hay tính trượt');
ok(/chưa nhớ/.test($('#panel').textContent) && $('[data-nb]'), 'phải nói rõ và mời giở sổ tay'); $('[data-nb]').click(); ok(/Sổ tay/.test($('#panel').textContent), 'nút sổ tay phải mở sổ tay');
$('#nbb').click(); ok(/Kiểm tra nhanh/.test($('#panel').textContent), 'ôn: sau sổ tay phải có tiny check');
ok(tinyOk(), 'ôn: tiny check phải làm được');
ok(/Ôn lại sau khi đọc/.test($('#panel').textContent), 'ôn: phải có MỘT câu hỏi mới sau khi đọc');
const prBefore = JSON.stringify(X.P.pr.l1); ok(drive('#rtb'), 'ôn: chưa tới màn kết quả');
ok(JSON.stringify(X.P.pr.l1) == prBefore, 'ôn: câu hỏi sau khi đọc KHÔNG được tính điểm vào hồ sơ probe');
$('#rtb').click(); ok(/Ôn cách quãng/.test($('#panel').textContent), 'ôn: phải về lại buổi ôn');
reset(); X.P.pr = {}; X.road(); $('#lhc').click(); $('#hcs').click(); drive('#hcx', (k) => 'right', 2);
reset(); X.P.pr = {}; X.road(); $('#lhc').click(); $('#hcs').click(); for (let k = 0; k < 6; k++) $('[data-c="0"]').click(); ok($('#hcx'), 'kiểm tra nền phải kết thúc');
ok(Object.values(R.HC().fail).every(n => !n) && Object.keys(X.P.shaky).length == 0, '«Chưa nhớ» ở kiểm tra nền không được tính là sai hay ⚠'); ok($$('[data-nb]').length == 6, 'phải mời giở sổ tay cho từng bài chưa nhớ');

// 9. hồ sơ hiện bài hay phải giở sổ tay
reset(); X.P.pr = { k3: { p: 1, f: 0, miss: {}, unk: 3, last: '2000-01-01', days: [] } }; X.road(); $('#lpf').click(); ok(/giở sổ tay/.test($('#panel').textContent) && /3 lần/.test($('#panel').textContent), 'hồ sơ phải nêu bài hay giở sổ tay');
// 3b. 15 bài đợt 3 (nhóm nền) có trang viết tay, hiện đúng trong sổ tay và có phần Lỗi hay gặp / Mẹo
for (const id of 'k1 k2 k4 k8 k9 b1 h1 h2 h3 r1 r2 r3 n1 n2 n3'.split(' ')) { X.notebook(id, () => { }, 'Quay lại'); ok(!!X.LES[id].note && $('#panel .fb.ok') && /Mẹo|Lỗi hay gặp/.test($('#panel').textContent), 'sổ tay viết tay đợt 3 không hiện đúng: ' + id) }
// 3c. 7 bài đợt 4 (đọc lỗi, debug, BFS, DFS, DP mở đầu)
for (const id of 'e1 e2 e3 e4 g2 g3 dp1'.split(' ')) { X.notebook(id, () => { }, 'Quay lại'); ok(!!X.LES[id].note && $('#panel .fb.ok') && /Mẹo|Lỗi hay gặp/.test($('#panel').textContent), 'sổ tay viết tay đợt 4 không hiện đúng: ' + id) }
for (const id of 'm1 m2 m3 rl1 ap1 ap2 ap3 ap4 ap6'.split(' ')) { X.notebook(id, () => { }, 'Quay lại'); ok(!!X.LES[id].note && $('#panel .fb.ok') && /Mẹo|Lỗi hay gặp/.test($('#panel').textContent), 'sổ tay viết tay đợt 5 không hiện đúng: ' + id) }
{ const n = Object.keys(X.LES).filter(i => X.LES[i].note).length; ok(n >= 56, 'số bài có trang viết tay phải >= 56, hiện là ' + n); console.log('bài có trang viết tay:', n, '/', Object.keys(X.LES).length) }
// 3. 18 bài đợt 2 có trang viết tay, hiện đúng trong sổ tay và có phần Lỗi hay gặp / Mẹo
for (const id of 'bx0 b2 b3 b4 b5 b6 d1 d2 tp stk que bs bub t1 t2 g1 dp2 ap5'.split(' ')) { X.notebook(id, () => { }, 'Quay lại'); ok(!!X.LES[id].note && $('#panel .fb.ok') && /Mẹo|Lỗi hay gặp/.test($('#panel').textContent), 'sổ tay viết tay đợt 2 không hiện đúng: ' + id) }

console.log('sim-notebook xong, bad', bad); process.exit(bad ? 1 : 0)
