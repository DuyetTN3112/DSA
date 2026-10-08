// Ngân hàng probe lõi (a2, a3, cn, p4, d1, d2, stk, que, bs) — port từ main:probe-core.js
// cộng extras trong main:probe-extra.js. Mỗi shape có extra được gộp qua variantOf.
import type { ProbeBank, ProbeGenerator } from '../../types';
import { aNum, aPick, aPy, at, distinct, distinct3, kv, pJ, pre, randRange, shuffled, tChoice, tNum, variantOf, xArr, xSort } from '../builders';

/** Danh sách tên dùng trong câu hỏi xếp hàng (verbatim main:probe-adv.js) */
const aNm = ['An', 'Binh', 'Chi', 'Dung', 'Ha', 'Khoa', 'Lan'];

/* ---------- a2: chỉ số mảng ---------- */
const a2Same: ProbeGenerator = () => {
  const a = distinct3(), k = randRange(0, 2);
  return tNum(`${pre(`a = [${a.join(',')}]\nprint(a[${k}])`)}In ra số mấy?`, at(a, k), `Hộp chỉ số ${k} chứa ${at(a, k)}.`);
};
const a2Flip: ProbeGenerator = () => {
  const a = distinct3(), k = randRange(0, 2);
  return tNum(`${pre(`a = [${a.join(',')}]\nprint(a[?])`)}Chương trình in ra ${at(a, k)}. Dấu ? là số nào?`, k, `${at(a, k)} nằm ở chỉ số ${k}.`);
};
const a2New0: ProbeGenerator = () => {
  const a = distinct3();
  return tNum(`${pre(`a = [${a.join(',')}]\nprint(a[len(a) - 1])`)}In ra số mấy?`, at(a, 2), 'len(a) - 1 luôn là chỉ số hộp cuối.');
};
const a2New1: ProbeGenerator = () => {
  const a = xArr(5, 1, 9), c = `a = ${pJ(a)}\nprint(a[2] + a[0])`;
  return aPy(tNum(`${pre(c)}In ra số mấy?`, at(a, 2) + at(a, 0), `a[2] = ${at(a, 2)}, a[0] = ${at(a, 0)}: ${at(a, 2) + at(a, 0)}.`), c, [String(at(a, 2) + at(a, 0))]);
};
const a2Verdict0 = kv("Nam nói: 'mảng a có 5 phần tử thì a[5] là phần tử cuối'. Nam nói đúng hay sai?", "Nam nói: 'mảng a có 5 phần tử thì a[4] là phần tử cuối'. Nam nói đúng hay sai?", 'Chỉ số bắt đầu từ 0 nên hộp cuối là chỉ số 4', 'Chỉ số bắt đầu từ 1', 'Mảng không có hộp cuối', 'Sai: a[5] không tồn tại.');
const a2Verdict1 = kv("Hà nói: 'mảng có 5 hộp thì chỉ số hợp lệ là 1 đến 5'. Hà nói đúng hay sai?", "Hà nói: 'mảng có 5 hộp thì chỉ số hợp lệ là 0 đến 4'. Hà nói đúng hay sai?", 'Chỉ số đầu là 0, chỉ số cuối là số hộp trừ 1', 'Chỉ số bắt đầu từ 1', 'Chỉ số cuối bằng số hộp', 'Sai: chỉ số hợp lệ là 0 đến 4.');
const a2Read0: ProbeGenerator = () => tChoice(`${pre('a = [4, 8, 1]\nprint(a[3])')}Chuyện gì xảy ra?`, ['Báo lỗi IndexError: không có hộp chỉ số 3', 'In ra 1', 'In ra 0'], 'Mảng 3 hộp chỉ có chỉ số 0, 1, 2.');
const a2Read1: ProbeGenerator = () => {
  const a = xArr(3, 1, 9), c = `a = ${pJ(a)}\nprint(a[len(a)])`;
  return aPy(tChoice(`${pre(c)}Đọc kỹ chỉ số trong ngoặc vuông. Chuyện gì xảy ra?`, ['Báo lỗi IndexError: len(a) là 3, nhưng chỉ số lớn nhất chỉ là 2', `In ra ${at(a, 2)}`, 'In ra 0'], 'len(a) bằng số hộp, còn chỉ số cuối là len(a) - 1.'), c, [], 'IndexError');
};

/* ---------- a3: gán phần tử mảng ---------- */
const a3Same: ProbeGenerator = () => {
  const a = distinct3(), k = randRange(0, 2), v = randRange(10, 19);
  return tNum(`${pre(`a = [${a.join(',')}]\na[${k}] = ${v}\nprint(a[${k}])`)}In ra số mấy?`, v, `Hộp ${k} bị ghi đè bằng ${v}.`);
};
const a3Flip: ProbeGenerator = () => {
  const a = distinct3(), k = randRange(0, 2), v = randRange(10, 19), b = a.slice();
  b[k] = v;
  return tNum(`${pre(`a = [${a.join(',')}]\na[?] = ${v}\nprint(a)`)}Chương trình in ra [${b.join(',')}]. Dấu ? là số nào?`, k, `${v} xuất hiện ở chỉ số ${k}.`);
};
const a3New0: ProbeGenerator = () => {
  const a = distinct3(), k = randRange(0, 2), b = randRange(2, 6);
  return tNum(`${pre(`a = [${a.join(',')}]\na[${k}] = a[${k}] + ${b}\nprint(a[${k}])`)}In ra số mấy?`, at(a, k) + b, `Lấy ${at(a, k)} cũ cộng ${b}, rồi bỏ lại vào hộp.`);
};
const a3New1: ProbeGenerator = () => {
  const a = xArr(3, 1, 9), c = `a = ${pJ(a)}\na[1] = a[1] * 2\nprint(a[1])`;
  return aPy(tNum(`${pre(c)}In ra số mấy?`, at(a, 1) * 2, `Lấy ${at(a, 1)}, nhân 2, bỏ lại vào hộp 1: ${at(a, 1) * 2}.`), c, [String(at(a, 1) * 2)]);
};
const a3Verdict0 = kv("Hà nói: 'a[1] = 5 chèn thêm một hộp mới vào mảng'. Hà nói đúng hay sai?", "Hà nói: 'a[1] = 5 ghi đè hộp số 1, số hộp không đổi'. Hà nói đúng hay sai?", 'Gán vào chỉ số có sẵn là ghi đè, không thêm hộp', 'Gán luôn thêm hộp mới', 'Gán xóa cả mảng', 'Sai: số hộp không đổi.');
const a3Read0: ProbeGenerator = () => tChoice(`${pre('a = [4, 8, 1]\na[0] = 9\nprint(a)')}In ra gì?`, ['[9, 8, 1]', '[4, 9, 8, 1]', '[9]'], 'Chỉ hộp 0 bị ghi đè.');
const a3Read1: ProbeGenerator = () => {
  const a = xArr(3, 1, 9), c = `a = ${pJ(a)}\na[3] = 9\nprint(a)`;
  return aPy(tChoice(`${pre(c)}Mảng chỉ có 3 hộp. Chuyện gì xảy ra?`, ['Báo lỗi IndexError: không có hộp chỉ số 3 để ghi đè', `In ra ${pJ([...a, 9])}`, `In ra ${pJ(a)}`], 'Ghi đè chỉ làm được với hộp đã tồn tại.'), c, [], 'IndexError');
};

/* ---------- cn: đếm ---------- */
const cnSame: ProbeGenerator = () => {
  const a = Array.from({ length: 5 }, () => randRange(1, 3)), n = a.filter((x) => x === 2).length;
  return tNum(`${pre(`a = [${a.join(',')}]\nc = 0\nfor x in a:\n    if x == 2:\n        c = c + 1\nprint(c)`)}In ra số mấy?`, n, `Có ${n} số 2.`);
};
const cnFlip: ProbeGenerator = () => {
  const x = randRange(2, 6);
  return tNum(`Mảng [${x}, ?, ${x}, 9]. Đếm số lần xuất hiện của ${x} cho kết quả 3. Dấu ? là số nào?`, x, `Cần thêm một số ${x} nữa.`);
};
const cnNew0: ProbeGenerator = () => {
  const a = Array.from({ length: 5 }, () => randRange(1, 9)), n = a.filter((x) => x % 2 === 0).length;
  return tNum(`${pre(`a = [${a.join(',')}]\nc = 0\nfor x in a:\n    if x % 2 == 0:\n        c = c + 1\nprint(c)`)}In ra số mấy? (x % 2 == 0 nghĩa là x chẵn)`, n, `Có ${n} số chẵn.`);
};
const cnNew1: ProbeGenerator = () => {
  const a = xArr(randRange(4, 6), 1, 9), t = randRange(3, 6), v = a.filter((x) => x > t).length, c = `a = ${pJ(a)}\nc = 0\nfor x in a:\n    if x > ${t}:\n        c = c + 1\nprint(c)`;
  return aPy(tNum(`${pre(c)}In ra số mấy?`, v, `Đếm các số lớn hơn ${t}: ${v}.`), c, [String(v)]);
};
const cnVerdict = kv("Dũng nói: 'muốn đếm số lần gặp thì nên đặt c = 1 lúc đầu'. Dũng nói đúng hay sai?", "Dũng nói: 'muốn đếm số lần gặp thì đặt c = 0 lúc đầu vì chưa gặp lần nào'. Dũng nói đúng hay sai?", 'Chưa gặp lần nào thì số đếm là 0', 'Đếm phải bắt đầu từ 1', 'Giá trị đầu không ảnh hưởng', 'Sai: c = 1 làm kết quả lớn hơn đúng 1.');
const cnRead0: ProbeGenerator = () => tChoice('Mảng [2, 5, 2, 7]. Có bao nhiêu số KHÁC 2?', ['2', '4', '3'], 'Số khác 2 là 5 và 7.');
const cnRead1: ProbeGenerator = () => {
  const t = randRange(3, 6);
  const a = shuffled([t, t, ...xArr(3, 1, 9).filter((x) => x !== t)]).slice(0, 5);
  const gt = a.filter((x) => x > t).length, ge = a.filter((x) => x >= t).length;
  if (gt === ge || gt === a.length || ge === a.length) return cnBank.read();
  return aNum(`Mảng ${pJ(a)}. Có bao nhiêu số LỚN HƠN ${t} (không tính số bằng ${t})?`, gt, `Chỉ đếm số > ${t}: ${gt}. Nếu tính cả số bằng ${t} thì là ${ge}, một câu hỏi khác.`, [ge, a.length]);
};
const cnBank: ProbeBank = {
  same: cnSame, flip: cnFlip, new: variantOf([cnNew0, cnNew1]), verdict: cnVerdict, read: variantOf([cnRead0, cnRead1]),
};

/* ---------- p4: hàm ---------- */
const p4Same: ProbeGenerator = () => {
  const k = randRange(2, 5), a = randRange(1, 6);
  return tNum(`${pre(`def f(x):\n    return x * ${k}\nprint(f(${a}))`)}In ra số mấy?`, a * k, `${a} × ${k}.`);
};
const p4Flip: ProbeGenerator = () => {
  const k = randRange(2, 5), a = randRange(1, 6);
  return tNum(`${pre(`def f(x):\n    return x + ${k}\nprint(f(?))`)}In ra ${a + k}. Dấu ? là số nào?`, a, `${a + k} - ${k} = ${a}.`);
};
const p4New0: ProbeGenerator = () => tChoice(`${pre('def f(x):\n    x * 2\nprint(f(3))')}In ra gì?`, ['None: hàm không trả gì ra', '6', '3'], 'Thiếu return thì hàm trả về None.');
const p4New1: ProbeGenerator = () => {
  const k = randRange(1, 5), a = randRange(1, 5), b = randRange(1, 5), c = `def f(x):\n    return x + ${k}\nprint(f(${a}) + f(${b}))`;
  return aPy(tNum(`${pre(c)}In ra số mấy?`, a + b + 2 * k, `f(${a}) = ${a + k}, f(${b}) = ${b + k}: tổng ${a + b + 2 * k}.`), c, [String(a + b + 2 * k)]);
};
const p4Verdict = kv("Lan nói: 'print và return giống nhau, đều đưa giá trị ra để dùng tiếp'. Lan nói đúng hay sai?", "Lan nói: 'return đưa giá trị ra để dùng tiếp, còn print chỉ hiển thị'. Lan nói đúng hay sai?", 'Chỉ return mới trả giá trị cho nơi gọi hàm dùng tiếp', 'print cũng trả giá trị về', 'return chỉ để hiển thị', 'Sai: print chỉ hiển thị.');
const p4Read0: ProbeGenerator = () => tChoice(`${pre('def f(x):\n    return x * 2\n    print("xong")\nf(3)')}Có in chữ xong không?`, ['Không, vì return đã kết thúc hàm', 'Có', 'Có, hai lần'], 'Dòng sau return không bao giờ chạy.');
const p4Read1: ProbeGenerator = () => {
  const a = randRange(2, 6), c = `def g(x):\n    return x * 2\ng(${a})\nprint("xong")`;
  return aPy(tChoice(`${pre(c)}Đọc kỹ: màn hình in ra gì?`, ['Chỉ chữ "xong"', `${2 * a} rồi xong`, String(2 * a)], `g(${a}) trả về ${2 * a} nhưng không có lệnh print nào in giá trị đó. return không phải in.`), c, ['xong']);
};

/* ---------- d1: dictionary cơ bản ---------- */
const d1Same: ProbeGenerator = () => {
  const x = randRange(1, 9), y = randRange(1, 9);
  return tNum(`${pre(`d = {"a": ${x}, "b": ${y}}\nprint(d["b"])`)}In ra số mấy?`, y, `Khóa "b" ứng với ${y}.`);
};
const d1Flip: ProbeGenerator = () => {
  const x = randRange(1, 4), y = randRange(5, 9);
  return tChoice(`${pre(`d = {"a": ${x}, "b": ${y}}\nprint(d[?])`)}Chương trình in ra ${x}. Dấu ? là gì?`, ['"a"', '"b"', `${x}`], `${x} thuộc khóa "a".`);
};
const d1New0: ProbeGenerator = () => {
  const v = randRange(10, 99);
  return tNum(`${pre(`d = {"a": 3}\nd["c"] = ${v}\nprint(d["c"])`)}In ra số mấy?`, v, 'Gán vào khóa chưa có sẽ tạo mục mới.');
};
const d1New1: ProbeGenerator = () => {
  const a = randRange(2, 9), b = randRange(2, 9), k = aPick(['a', 'b']), c = `d = {"a": ${a}, "b": ${b}}\nprint(d["${k}"] * 2)`;
  return aPy(tNum(`${pre(c)}In ra số mấy?`, (k === 'a' ? a : b) * 2, `d["${k}"] là ${k === 'a' ? a : b}, nhân 2.`), c, [String((k === 'a' ? a : b) * 2)]);
};
const d1New2: ProbeGenerator = () => {
  const a = randRange(2, 9), c = `d = {"x": ${a}}\nprint(len(d))`;
  return aPy(tNum(`${pre(c)}In ra số mấy?`, 1, `len(d) đếm số MỤC (số khóa), không phải giá trị ${a}.`), c, ['1']);
};
const d1Verdict = kv("Hà nói: 'd[1] lấy mục thứ hai của dict'. Hà nói đúng hay sai?", "Hà nói: 'dict tra theo khóa chứ không theo vị trí'. Hà nói đúng hay sai?", 'Dict tìm theo khóa, không theo vị trí', 'Dict tìm theo vị trí như list', 'Dict không có khóa', 'Sai: dict tra bằng khóa.');
const d1Read0: ProbeGenerator = () => tChoice(`${pre('d = {"a": 3}\nprint(d["b"])')}Chuyện gì xảy ra?`, ['Báo lỗi KeyError: không có khóa b', 'In ra 0', 'In ra None'], 'Khóa "b" chưa tồn tại.');
const d1Read1: ProbeGenerator = () => {
  const a = randRange(2, 9), b = randRange(2, 9), c = `d = {"a": ${a}, "b": ${b}}\nprint(d["b"])`;
  return aPy(aNum(`${pre(c)}Đọc kỹ: in ra giá trị ứng với khóa "b". Mấy?`, b, `Tra theo khóa, không theo thứ tự: d["b"] = ${b}.`, [a, a + b]), c, [String(b)]);
};
const d1Read2: ProbeGenerator = () => {
  const a = randRange(2, 9), c = `d = {"a": ${a}}\nprint(d[${a}])`;
  return aPy(tChoice(`${pre(c)}Đọc kỹ dòng print (tra bằng số ${a}). Chuyện gì xảy ra?`, [`Báo lỗi KeyError: ${a} không phải khóa, khóa là "a"`, `In ra ${a}`, 'In ra None'], `Khóa là chữ "a" (có nháy), còn ${a} là một giá trị. Tra theo ${a} thì không thấy.`), c, [], 'KeyError');
};

/* ---------- d2: đếm bằng dictionary ---------- */
const d2Same: ProbeGenerator = () => {
  const s = Array.from({ length: 5 }, () => at(['a', 'b'], randRange(0, 1))).join(''), n = s.split('').filter((c) => c === 'a').length;
  return tNum(`${pre(`d = {}\nfor ch in "${s}":\n    d[ch] = d.get(ch, 0) + 1\nprint(d.get("a", 0))`)}In ra số mấy?`, n, `Có ${n} chữ a.`);
};
const d2Flip: ProbeGenerator = () => {
  const k = randRange(1, 4), m = randRange(1, 4);
  return tNum(`Sau khi đếm một chuỗi chỉ gồm a và b, d["a"] là ${k} và d["b"] là ${m}. Chuỗi có tất cả bao nhiêu ký tự?`, k + m, `${k} + ${m}.`);
};
const d2New0: ProbeGenerator = () => {
  const v = randRange(2, 9);
  return tNum(`${pre(`d = {}\nprint(d.get("z", ${v}))`)}In ra số mấy?`, v, 'Khóa z chưa có nên get trả giá trị mặc định.');
};
const d2New1: ProbeGenerator = () => {
  const w = aPick(['banana', 'mama', 'abba', 'aabca']), n = w.split('').filter((x) => x === 'a').length, c = `d = {}\nfor ch in "${w}":\n    d[ch] = d.get(ch, 0) + 1\nprint(d["a"])`;
  return aPy(tNum(`${pre(c)}In ra số mấy?`, n, `Đếm chữ "a" trong "${w}".`), c, [String(n)]);
};
const d2Verdict = kv('Hà nói: \'d.get("a", 0) báo lỗi nếu chưa có khóa a\'. Hà nói đúng hay sai?', 'Hà nói: \'d.get("a", 0) trả về 0 nếu chưa có khóa a\'. Hà nói đúng hay sai?', 'get có giá trị mặc định nên không báo lỗi', 'get luôn báo lỗi khi thiếu khóa', 'get xóa khóa', 'Sai: nó trả về 0.');
const d2Read0: ProbeGenerator = () => tChoice(`${pre('d = {}\nd["a"] = d.get("a", 0) + 1\nd["a"] = d.get("a", 0) + 1\nprint(d["a"])')}In ra số mấy?`, ['2', '1', '0'], 'Hai lần cộng 1.');
const d2Read1: ProbeGenerator = () => {
  const seq = Array.from({ length: randRange(3, 5) }, () => aPick(['a', 'b']));
  if (!seq.includes('a')) seq[0] = 'a';
  const na = seq.filter((x) => x === 'a').length, nb = seq.length - na, c = 'd = {}\n' + seq.map((x) => `d["${x}"] = d.get("${x}", 0) + 1`).join('\n') + '\nprint(d["a"])';
  return aPy(aNum(`${pre(c)}Đọc kỹ: d["a"] (không phải d["b"]) bằng mấy?`, na, `Chỉ các dòng có khóa "a" mới cộng vào d["a"]: ${na} lần. Còn ${nb} dòng thuộc khóa "b".`, [seq.length, nb]), c, [String(na)]);
};

/* ---------- stk: stack ---------- */
const stkSame: ProbeGenerator = () => {
  const a = distinct3();
  return tNum(`${pre(`push(${at(a, 0)})\npush(${at(a, 1)})\npush(${at(a, 2)})\npop()`)}pop() trả về số mấy?`, at(a, 2), 'Vào sau ra trước: lấy số vừa push sau cùng.');
};
const stkFlip: ProbeGenerator = () => {
  const a = distinct3();
  return tNum(`Có 3 số được push, rồi pop() ba lần liên tiếp trả về ${at(a, 2)}, ${at(a, 1)}, ${at(a, 0)}. Số nào được push ĐẦU TIÊN?`, at(a, 0), 'Số ra sau cùng là số vào đầu tiên.');
};
const stkNew0: ProbeGenerator = () => tChoice('Soạn văn bản: gõ "A", gõ "B", gõ "C". Bấm Undo một lần. Thao tác nào bị hoàn tác?', ['Gõ "C"', 'Gõ "A"', 'Gõ "B"'], 'Undo hoàn tác thao tác gần nhất: stack.');
const stkNew1: ProbeGenerator = () => {
  const n = randRange(3, 4), L = ['A', 'B', 'C', 'D'].slice(0, n), k = randRange(1, n - 1), gone = at(L, n - k);
  return tChoice(`Soạn văn bản: gõ lần lượt ${L.map((x) => `"${x}"`).join(', ')}. Bấm Undo ${k} lần. Thao tác ${k > 1 ? `CUỐI CÙNG bị hoàn tác (lần Undo thứ ${k})` : 'bị hoàn tác'} là gõ chữ nào?`, [`"${gone}"`, ...L.filter((x) => x !== gone).slice(0, 2).map((x) => `"${x}"`)], 'Undo hoàn tác thao tác gần nhất trước: vào sau, ra trước (stack).');
};
const stkVerdict = kv("Nam nói: 'stack lấy ra phần tử vào ĐẦU TIÊN trước'. Nam nói đúng hay sai?", "Nam nói: 'stack lấy ra phần tử vào SAU CÙNG trước'. Nam nói đúng hay sai?", 'Stack vào sau ra trước, như chồng đĩa', 'Stack vào trước ra trước', 'Stack lấy ngẫu nhiên', 'Sai: vào sau ra trước.');
const stkRead0: ProbeGenerator = () => tChoice('push(1), push(2), pop(), push(3). Bây giờ phần tử trên cùng của stack là gì?', ['3', '2', '1'], 'Sau pop còn 1, push 3 thì 3 nằm trên cùng.');
const stkRead1: ProbeGenerator = () => {
  let a: number[];
  let top: number;
  let popped: number;
  let st: number[];
  let ops: string[];
  do {
    const v = distinct(5, 9);
    st = [];
    ops = [];
    ops.push(`push(${at(v, 0)})`); st.push(at(v, 0));
    ops.push(`push(${at(v, 1)})`); st.push(at(v, 1));
    ops.push(`push(${at(v, 2)})`); st.push(at(v, 2));
    ops.push('pop()');
    const p = st.pop();
    if (p === undefined) throw new Error('stk read: stack rỗng ngoài dự kiến');
    popped = p;
    ops.push(`push(${at(v, 3)})`); st.push(at(v, 3));
    top = at(st, st.length - 1);
    a = [top, popped, at(st, 0)];
  } while (new Set(a).size < 3);
  return tChoice(`${ops.join(', ')}. Bây giờ phần tử trên cùng của stack là gì?`, a.map(String), `Sau pop còn ${st.slice(0, -1).join(', ')}, rồi push ${top} nằm trên cùng. ${popped} đã bị lấy ra.`);
};

/* ---------- que: queue ---------- */
const queSame: ProbeGenerator = () => {
  const a = distinct3();
  return tNum(`${pre(`enqueue(${at(a, 0)})\nenqueue(${at(a, 1)})\nenqueue(${at(a, 2)})\ndequeue()`)}dequeue() trả về số mấy?`, at(a, 0), 'Vào trước ra trước.');
};
const queFlip: ProbeGenerator = () => {
  const a = distinct3();
  return tNum(`Có 3 số được enqueue, rồi dequeue() ba lần liên tiếp trả về ${at(a, 0)}, ${at(a, 1)}, ${at(a, 2)}. Số nào được enqueue SAU CÙNG?`, at(a, 2), 'Số ra sau cùng là số vào sau cùng.');
};
const queNew0: ProbeGenerator = () => tChoice('Xếp hàng mua vé: An, Bình, Chi đến lần lượt. Ai được phục vụ trước?', ['An', 'Chi', 'Bình'], 'Queue: ai đến trước phục vụ trước.');
const queNew1: ProbeGenerator = () => {
  const names = shuffled(aNm).slice(0, 3);
  return tChoice(`Ở quầy vé, ${at(names, 0)}, ${at(names, 1)}, ${at(names, 2)} xếp hàng theo đúng thứ tự đó (${at(names, 0)} đứng đầu). Người mới đến phải xếp ở đâu, và ai được phục vụ trước?`, [`Người mới xếp cuối hàng; ${at(names, 0)} được phục vụ trước`, `Người mới xếp đầu hàng; ${at(names, 2)} được phục vụ trước`, `Người mới xếp cuối hàng; ${at(names, 2)} được phục vụ trước`], 'Queue: vào ở cuối, ra ở đầu (vào trước, ra trước).');
};
const queNew2: ProbeGenerator = () => {
  const k = randRange(3, 7), m = randRange(1, k - 1);
  return tNum(`Hàng đợi đang có ${k} người. Phục vụ xong ${m} người (mỗi lần lấy người ở đầu hàng), và không ai mới đến. Còn mấy người trong hàng?`, k - m, `${k} - ${m} = ${k - m}.`);
};
const queVerdict = kv("Nam nói: 'queue lấy ra phần tử vào SAU CÙNG trước'. Nam nói đúng hay sai?", "Nam nói: 'queue lấy ra phần tử vào ĐẦU TIÊN trước'. Nam nói đúng hay sai?", 'Queue vào trước ra trước, như xếp hàng', 'Queue vào sau ra trước', 'Queue lấy ngẫu nhiên', 'Sai: vào trước ra trước.');
const queRead0: ProbeGenerator = () => tChoice('enqueue(1), enqueue(2), dequeue(), enqueue(3). Phần tử sẽ ra TIẾP THEO là gì?', ['2', '3', '1'], 'Sau dequeue còn 2, rồi 3 xếp sau 2.');
const queRead1: ProbeGenerator = () => {
  let a: number[];
  let front: number;
  let q: number[];
  let ops: string[];
  do {
    const v = distinct(6, 9);
    q = [];
    ops = [];
    let i = 0;
    const removed: number[] = [];
    ops.push(`enqueue(${at(v, i)})`); q.push(at(v, i)); i += 1;
    ops.push(`enqueue(${at(v, i)})`); q.push(at(v, i)); i += 1;
    ops.push('dequeue()');
    const s = q.shift();
    if (s === undefined) throw new Error('que read: hàng đợi rỗng ngoài dự kiến');
    removed.push(s);
    ops.push(`enqueue(${at(v, i)})`); q.push(at(v, i)); i += 1;
    ops.push(`enqueue(${at(v, i)})`); q.push(at(v, i)); i += 1;
    front = at(q, 0);
    a = [front, at(q, q.length - 1), at(removed, 0)];
  } while (new Set(a).size < 3);
  return tChoice(`${ops.join(', ')}. Phần tử sẽ ra TIẾP THEO (lần dequeue kế tiếp) là gì?`, a.map(String), `Hàng đợi hiện còn ${q.join(', ')} (đầu hàng là ${front}). Ra trước là người đứng đầu, không phải người vào cuối.`);
};

/* ---------- bs: tìm nhị phân ---------- */
const bsSame: ProbeGenerator = () => {
  const lo = randRange(0, 3), hi = randRange(6, 12);
  return tNum(`Mảng đã sắp xếp, chỉ số từ ${lo} đến ${hi}. Hộp giữa có chỉ số (${lo} + ${hi}) // 2 bằng mấy?`, Math.floor((lo + hi) / 2), '// là chia lấy phần nguyên.');
};
const bsFlip: ProbeGenerator = () => {
  const m = randRange(2, 6);
  return tNum(`Khoảng chỉ số từ 0 đến hi (hi chẵn) có hộp giữa là chỉ số ${m}. hi bằng mấy?`, 2 * m, `(0 + ${2 * m}) // 2 = ${m}.`);
};
const bsNew0: ProbeGenerator = () => {
  const k = randRange(2, 5);
  return tNum(`Mỗi lần so sánh loại bỏ một nửa số hộp. Từ ${2 ** k} hộp, sau ${k} lần so sánh còn mấy hộp?`, 1, 'Chia đôi liên tục thì rất nhanh: log2 của số hộp.');
};
const bsNew1: ProbeGenerator = () => {
  const m = randRange(2, 4), n = 2 ** m, k = randRange(1, m - 1);
  return tNum(`Mỗi lần so sánh loại bỏ đúng một nửa số hộp. Từ ${n} hộp, sau ${k} lần so sánh còn mấy hộp?`, n / 2 ** k, `${n} chia 2, ${k} lần: ${n / 2 ** k}.`);
};
const bsNew2: ProbeGenerator = () => {
  const m = randRange(3, 10);
  return tNum(`Có ${2 ** m} hộp. Cần chia đôi tối thiểu mấy lần để chỉ còn đúng 1 hộp?`, m, `2^${m} = ${2 ** m}: chia đôi ${m} lần thì còn 1.`);
};
const bsVerdict = kv("Nam nói: 'tìm nhị phân dùng được trên mảng chưa sắp xếp'. Nam nói đúng hay sai?", "Nam nói: 'tìm nhị phân chỉ đúng khi mảng đã sắp xếp'. Nam nói đúng hay sai?", 'Bỏ một nửa chỉ an toàn khi biết thứ tự', 'Thứ tự không quan trọng', 'Nhị phân tự sắp xếp mảng', 'Sai: cần mảng đã sắp xếp.');
const bsRead0: ProbeGenerator = () => tChoice('Mảng [1, 3, 5, 7, 9, 11, 13] đã sắp xếp. Tìm 11. Hộp giữa chứa 7. Bỏ nửa nào?', ['Bỏ nửa trái, vì 11 lớn hơn 7', 'Bỏ nửa phải', 'Không bỏ nửa nào'], '11 > 7 nên 11 chỉ có thể ở bên phải.');
const bsRead1: ProbeGenerator = () => {
  const a = xSort(distinct(7, 30)), mid = at(a, 3);
  const t = Math.random() < 0.25 ? mid : aPick(a.filter((x) => x !== mid));
  const L = `Bỏ nửa TRÁI (${t} lớn hơn ${mid})`, R = `Bỏ nửa PHẢI (${t} nhỏ hơn ${mid})`, F = `Dừng: hộp giữa ${mid} chính là số cần tìm`, right = t === mid ? F : t > mid ? L : R;
  return tChoice(`Mảng ${pJ(a)} đã sắp xếp. Tìm ${t}. Hộp giữa (chỉ số 3) chứa ${mid}. Bước tiếp theo là gì?`, [right, ...[L, R, F].filter((x) => x !== right)], t === mid ? 'Gặp đúng số cần tìm thì dừng.' : t > mid ? 'Mảng tăng dần: số lớn hơn hộp giữa chỉ có thể nằm bên phải.' : 'Mảng tăng dần: số nhỏ hơn hộp giữa chỉ có thể nằm bên trái.');
};
const bsRead2: ProbeGenerator = () => {
  let a = distinct(6, 30);
  const ok = Math.random() < 0.5;
  if (!ok) {
    do { a = shuffled(a); } while (pJ(a) === pJ(xSort(a)));
  } else {
    a = xSort(a);
  }
  const Y = 'Dùng được: mảng đã sắp xếp', N = 'Chưa dùng được: mảng chưa sắp xếp, phải sắp xếp trước (hoặc tìm tuần tự)', D = 'Dùng được với mọi mảng';
  return tChoice(`Mảng ${pJ(a)}. Có thể áp dụng ngay tìm nhị phân (chia đôi) để tìm một số không?`, ok ? [Y, N, D] : [N, Y, D], ok ? 'Tìm nhị phân cần mảng đã sắp xếp, và mảng này đã đúng thứ tự.' : 'Chia đôi chỉ đúng khi mảng có thứ tự, nếu không bỏ nửa nào cũng có thể bỏ mất số cần tìm.');
};

export const coreBanks: Record<string, ProbeBank> = {
  a2: { same: a2Same, flip: a2Flip, new: variantOf([a2New0, a2New1]), verdict: variantOf([a2Verdict0, a2Verdict1]), read: variantOf([a2Read0, a2Read1]) },
  a3: { same: a3Same, flip: a3Flip, new: variantOf([a3New0, a3New1]), verdict: a3Verdict0, read: variantOf([a3Read0, a3Read1]) },
  cn: cnBank,
  p4: { same: p4Same, flip: p4Flip, new: variantOf([p4New0, p4New1]), verdict: p4Verdict, read: variantOf([p4Read0, p4Read1]) },
  d1: { same: d1Same, flip: d1Flip, new: variantOf([d1New0, d1New1, d1New2]), verdict: d1Verdict, read: variantOf([d1Read0, d1Read1, d1Read2]) },
  d2: { same: d2Same, flip: d2Flip, new: variantOf([d2New0, d2New1]), verdict: d2Verdict, read: variantOf([d2Read0, d2Read1]) },
  stk: { same: stkSame, flip: stkFlip, new: variantOf([stkNew0, stkNew1]), verdict: stkVerdict, read: variantOf([stkRead0, stkRead1]) },
  que: { same: queSame, flip: queFlip, new: variantOf([queNew0, queNew1, queNew2]), verdict: queVerdict, read: variantOf([queRead0, queRead1]) },
  bs: { same: bsSame, flip: bsFlip, new: variantOf([bsNew0, bsNew1, bsNew2]), verdict: bsVerdict, read: variantOf([bsRead0, bsRead1, bsRead2]) },
};
