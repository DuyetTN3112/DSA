// Ngân hàng probe bx0, p1, p2, p3, sm — port từ main:probe-foundation.js + extras "Các bài nền" trong main:probe-extra.js.
import type { ProbeBank } from '../../types';
import { aNum, aPick, aPy, at, distinct, kv, pJ, pre, randRange, tChoice, tNum, variantOf, verdictFalse, xArr } from '../builders';

const bx0Same = () => {
  const a = randRange(1, 4), b = randRange(1, 4);
  return tChoice(`Chọn cách viết ĐÚNG THỨ TỰ cho "${a} cộng ${b} bằng ${a + b}":`, [`${a} + ${b} = ${a + b}`, `${a} ${b} + = ${a + b}`, `+ ${a} ${b} = ${a + b}`], 'Thứ tự quen thuộc: số, dấu, số, dấu bằng, kết quả.');
};
const bx0Flip = () => {
  const a = randRange(4, 8), b = randRange(1, 3);
  return tChoice(`Chọn cách viết đúng cho "${a} trừ ${b} bằng ${a - b}":`, [`${a} - ${b} = ${a - b}`, `${a} = ${b} - ${a - b}`, `${b} - ${a} = ${a - b}`], 'Số bị trừ đứng trước dấu trừ, kết quả đứng sau dấu bằng.');
};
const bx0New0 = () => {
  const n = randRange(2, 9);
  return tChoice(`Trong Python, viết "bỏ số ${n} vào hộp tên y":`, [`y = ${n}`, `${n} = y`, `y ${n} =`], 'Tên hộp bên trái, dấu =, giá trị bên phải.');
};
const bx0New1 = () => {
  const n = aPick(['z', 'kq', 'dem']), v = randRange(2, 9);
  return tChoice(`Trong Python, viết "bỏ số ${v} vào hộp tên ${n}":`, [`${n} = ${v}`, `${v} = ${n}`, `${n} ${v} =`], 'Tên hộp bên trái, dấu =, giá trị bên phải.');
};
const bx0Verdict = verdictFalse("Lan viết 1 + 1 = 3 và nói: 'mình viết đúng thứ tự nên là đúng'. Lan nói đúng hay sai?", "Lan viết 2 + 2 = 4 và nói: 'vừa viết đúng thứ tự, vừa tính đúng'. Lan nói đúng hay sai?", 'Đúng thứ tự viết khác với đúng kết quả: 1 + 1 phải bằng 2', 'Cả cách viết lẫn phép tính đều đúng', 'Viết đúng thứ tự thì kết quả luôn đúng', 'Kết quả không quan trọng', 'Sai: viết đúng thứ tự chưa chắc đúng kết quả.', 'Đúng: viết đúng và tính đúng.');
const bx0Read0 = () => tChoice(`Một bạn viết "${randRange(2, 4)} + 3 = 9". Bạn ấy đã sai ở đâu?`, ['Thứ tự viết đúng, nhưng kết quả sai', 'Thứ tự viết sai', 'Cả hai đều sai'], 'Hình thức đúng nhưng ý nghĩa sai: phải kiểm tra cả hai.');
const bx0Read1 = () => {
  const a = randRange(1, 4), b = randRange(1, 4);
  return tChoice(`Một bạn viết "${a} ${b} + = ${a + b}". Bạn ấy đã sai ở đâu?`, ['Kết quả đúng, nhưng thứ tự viết sai', 'Thứ tự viết đúng, nhưng kết quả sai', 'Cả hai đều đúng'], `${a} + ${b} thật sự bằng ${a + b}, nhưng cách viết phải là ${a} + ${b} = ${a + b}: đúng ý chưa chắc đúng cách viết.`);
};

const p1Same = () => {
  const a = randRange(1, 9), b = randRange(1, 9);
  return tNum(`${pre(`x = ${a}\nx = ${b}\nprint(x)`)}In ra số mấy?`, b, `Dòng sau ghi đè dòng trước: hộp x giờ chứa ${b}.`);
};
const p1Flip = () => {
  const k = randRange(2, 6);
  return tNum(`${pre('x = 3\nx = x + ?\nprint(x)')}Chương trình in ra ${3 + k}. Dấu ? là số nào?`, k, `3 + ${k} = ${3 + k}.`);
};
const p1New0 = () => {
  const a = randRange(1, 4), b = randRange(5, 9);
  return tNum(`${pre(`x = ${a}\ny = x\nx = ${b}\nprint(y)`)}In ra số mấy?`, a, `y chép giá trị của x lúc đó (${a}); x đổi sau này không làm y đổi.`);
};
const p1New1 = () => {
  const a = randRange(1, 5), y = randRange(1, 5), z = randRange(6, 9), c = `a = ${a}\nb = a + ${y}\na = ${z}\nprint(b)`;
  return aPy(tNum(`${pre(c)}In ra số mấy?`, a + y, `b tính xong lúc a còn ${a}: ${a + y}. a đổi sau đó không làm b đổi.`), c, [String(a + y)]);
};
const p1Verdict = verdictFalse("Nam nói: 'x = x + 1 là vô lý vì x không thể bằng x + 1'. Nam nói đúng hay sai?", "Nam nói: 'dòng x = 5 nghĩa là bỏ số 5 vào hộp tên x'. Nam nói đúng hay sai?", 'Dấu = trong lập trình là bỏ giá trị vào hộp, không phải so sánh', 'Dấu = trong lập trình là bỏ giá trị vào hộp', 'Mọi dòng có dấu = đều là phương trình toán', 'Hộp x không thể đổi giá trị', 'Sai: x = x + 1 nghĩa là lấy x hiện tại, cộng 1, rồi bỏ lại vào x.', 'Đúng.');
const p1Read0 = () => tChoice(`${pre(`x = ${randRange(2, 9)}\nprint("x")`)}Dòng print in ra gì?`, ['Chữ x', 'Số đang nằm trong hộp x', 'Lỗi'], 'Có dấu ngoặc kép thì đó là chữ "x", không phải hộp x.');
const p1Read1 = () => {
  const a = randRange(1, 4), b = randRange(5, 9), c = `x = ${a}\ny = x\ny = ${b}\nprint(x)`;
  return aPy(aNum(`${pre(c)}Đọc kỹ: in ra giá trị của x. Mấy?`, a, `x vẫn giữ ${a}. Chỉ hộp y bị đổi thành ${b}.`, [b, a + b]), c, [String(a)]);
};

const p2Same = () => {
  const a = randRange(1, 9), b = randRange(1, 9);
  return tChoice(`${pre(`if ${a} > ${b}:\n    print("A")\nelse:\n    print("B")`)}In ra chữ nào?`, a > b ? ['A', 'B', 'Không in gì'] : ['B', 'A', 'Không in gì'], `${a} > ${b} là ${a > b ? 'đúng nên in A' : 'sai nên in B'}.`);
};
const p2Flip = () => {
  const b = randRange(2, 8);
  return tNum(`${pre(`a = ?\nif a > ${b}:\n    print("A")`)}Số nguyên nhỏ nhất của ? để in ra A là mấy?`, b + 1, `Phải lớn hơn ${b} thật sự, nên nhỏ nhất là ${b + 1}.`);
};
const p2New0 = () => {
  const d = at([4, 5, 6], randRange(0, 2)), ok = d >= 5;
  return tChoice(`Luật: nếu điểm >= 5 thì "Đạt", nếu không thì "Trượt". Điểm ${d} thì kết quả là gì?`, ok ? ['Đạt', 'Trượt', 'Không đủ thông tin'] : ['Trượt', 'Đạt', 'Không đủ thông tin'], `${d} ${ok ? 'đạt' : 'chưa đạt'} điều kiện >= 5.`);
};
const p2New1 = () => {
  const t = randRange(3, 8), v = aPick([t - 1, t, t + 1]), r = v >= t ? 'Lớn' : 'Nhỏ';
  return tChoice(`Luật: nếu tuổi >= ${t} thì "Lớn", nếu không thì "Nhỏ". Tuổi ${v} thì kết quả là gì?`, [r, ...['Lớn', 'Nhỏ', 'Không đủ thông tin'].filter((x) => x !== r)], v >= t ? `${v} >= ${t} đúng.` : `${v} >= ${t} sai.`);
};
const p2Verdict = verdictFalse("Hà nói: 'if a > b và if a >= b luôn cho kết quả giống nhau'. Hà nói đúng hay sai?", "Hà nói: 'if a > b và if a >= b cho kết quả khác nhau khi a bằng b'. Hà nói đúng hay sai?", 'Khi a bằng b, > là sai còn >= là đúng', 'Khi a bằng b, > là sai còn >= là đúng', 'Chúng luôn giống nhau', 'Chúng khác nhau với mọi giá trị', 'Sai: khác nhau đúng ở trường hợp bằng nhau.', 'Đúng.');
const p2Read0 = () => tChoice(`${pre('if 2 > 5:\n    print("A")\nprint("B")')}In ra gì?`, ['B', 'A rồi B', 'A'], 'Dòng print("B") không thụt vào nên nó không thuộc if: luôn chạy.');
const p2Read1 = () => {
  const a = randRange(1, 9), b = randRange(1, 9), yes = a > b, c = `if ${a} > ${b}:\n    print("X")\nprint("Y")`;
  return aPy(tChoice(`${pre(c)}Dòng print("Y") không thụt vào. Màn hình in ra gì?`, yes ? ['X rồi Y', 'Y', 'X'] : ['Y', 'X rồi Y', 'X'], yes ? 'Điều kiện đúng nên in X, rồi Y luôn chạy.' : 'Điều kiện sai nên bỏ qua X, nhưng Y không thuộc if nên vẫn chạy.'), c, yes ? ['X', 'Y'] : ['Y']);
};

const p3Same = () => {
  const n = randRange(3, 8);
  return tNum(`${pre(`for i in range(${n}):\n    print(i)`)}Dòng cuối cùng in ra số mấy?`, n - 1, `range(${n}) chạy 0 đến ${n - 1}.`);
};
const p3Flip = () => {
  const k = randRange(2, 6);
  return tNum(`Muốn in các số 0, 1, ..., ${k} thì viết range(?). Dấu ? là số nào?`, k + 1, `range dừng TRƯỚC số cuối, nên cần ${k + 1}.`);
};
const p3New0 = () => {
  const n = randRange(2, 6), m = randRange(2, 5);
  return tNum(`${pre(`t = 0\nfor i in range(${n}):\n    t = t + ${m}\nprint(t)`)}In ra số mấy?`, n * m, `Lặp ${n} lần, mỗi lần thêm ${m}: ${n * m}.`);
};
const p3New1 = () => {
  const s = randRange(0, 5), n = randRange(2, 5), k = randRange(2, 4), c = `t = ${s}\nfor i in range(${n}):\n    t = t + ${k}\nprint(t)`;
  return aPy(tNum(`${pre(c)}In ra số mấy?`, s + n * k, `Bắt đầu ${s}, lặp ${n} lần cộng ${k}: ${s + n * k}.`), c, [String(s + n * k)]);
};
const p3Verdict0 = verdictFalse("Dũng nói: 'range(5) in ra các số từ 1 đến 5'. Dũng nói đúng hay sai?", "Dũng nói: 'range(5) in ra các số từ 0 đến 4'. Dũng nói đúng hay sai?", 'range(5) bắt đầu từ 0 và dừng trước 5', 'range(5) bắt đầu từ 0 và dừng trước 5', 'range(5) bắt đầu từ 1', 'range(5) dừng đúng ở 5', 'Sai: là 0, 1, 2, 3, 4.', 'Đúng.');
const p3Verdict1 = kv("Hà nói: 'range(5) cho ra các số 1, 2, 3, 4, 5'. Hà nói đúng hay sai?", "Hà nói: 'range(5) cho ra 0, 1, 2, 3, 4: năm số, bắt đầu từ 0'. Hà nói đúng hay sai?", 'range(n) bắt đầu từ 0 và dừng trước n', 'range(n) bắt đầu từ 1', 'range(n) dừng ở n', 'Sai: range(5) bắt đầu từ 0 và không có 5.');
const p3Read0 = () => tChoice(`${pre('for i in range(3):\n    print("i")')}Dòng đầu tiên in ra gì?`, ['Chữ i', '0', '1'], 'Có ngoặc kép nên in đúng chữ "i", ba lần.');
const p3Read1 = () => {
  const n = randRange(3, 6), c = `for i in range(${n}):\n    print(i)`;
  return aPy(aNum(`${pre(c)}Dòng CUỐI CÙNG in ra số mấy?`, n - 1, `Các số in ra là 0 đến ${n - 1}; số ${n} không xuất hiện.`, [n, n + 1]), c, Array.from({ length: n }, (_, i) => String(i)));
};

const smSame = () => {
  const a = [randRange(1, 9), randRange(1, 9), randRange(1, 9)], s = at(a, 0) + at(a, 1) + at(a, 2);
  return tNum(`${pre(`a = [${a.join(',')}]`)}In ra số mấy?`, s, `Cộng dồn ${a.join(' + ')} = ${s}.`);
};
const smFlip = () => {
  const a = randRange(1, 5), c = randRange(1, 5), m = randRange(1, 6);
  return tNum(`${pre(`a = [${a}, ?, ${c}]\nt = 0\nfor x in a:\n    t = t + x\nprint(t)`)}Chương trình in ra ${a + c + m}. Số còn thiếu ? là mấy?`, m, `${a + c + m} - ${a} - ${c} = ${m}.`);
};
const smNew0 = () => {
  const a = [randRange(1, 5), randRange(1, 5), randRange(1, 5)], s = 10 + at(a, 0) + at(a, 1) + at(a, 2);
  return tNum(`${pre(`a = [${a.join(',')}]`)}In ra số mấy?`, s, `Bắt đầu từ 10 chứ không phải 0: ${s}.`);
};
const smNew1 = () => {
  const a = xArr(randRange(3, 4), 1, 9), s = a.reduce((x, y) => x + y, 0), c = `a = ${pJ(a)}\nt = 0\nfor x in a:\n    t = t + x\nprint(t)`;
  return aPy(tNum(`${pre(c)}In ra số mấy?`, s, `${a.join(' + ')} = ${s}.`), c, [String(s)]);
};
const smVerdict = verdictFalse("Dũng nói: 'đặt t = 1 rồi cộng dồn thì vẫn ra tổng đúng'. Dũng nói đúng hay sai?", "Dũng nói: 'đặt t = 0 trước vòng lặp rồi cộng dồn thì ra tổng đúng'. Dũng nói đúng hay sai?", 'Giá trị khởi tạo được cộng vào kết quả, nên phải là 0', 'Giá trị khởi tạo được cộng vào kết quả, nên phải là 0', 't = 1 không ảnh hưởng gì', 'Khởi tạo bằng số nào cũng được', 'Sai: t = 1 làm tổng lớn hơn đúng 1.', 'Đúng.');
const smRead0 = () => {
  const n = randRange(3, 5), arr = Array.from({ length: n }, () => randRange(1, 9));
  return tChoice(`${pre(`a = [${arr.join(',')}]\nt = 0\nfor x in a:\n    t = t + x\n    print(t)`)}Có bao nhiêu dòng được in ra?`, [`${n}`, '1', `${n + 1}`], 'print thụt vào nằm TRONG vòng lặp nên in mỗi lần lặp.');
};
const smRead1 = () => {
  const a = distinct(4, 9), s = a.reduce((x, y) => x + y, 0), c = `a = ${pJ(a)}\nt = 0\nfor x in a:\n    t = x\nprint(t)`;
  return aPy(tChoice(`${pre(c)}Đọc kỹ dòng trong vòng lặp: nó là t = x chứ không phải t = t + x. In ra mấy?`, [String(at(a, 3)), String(s), String(at(a, 0))], `t bị ghi đè mỗi vòng, cuối cùng giữ phần tử cuối: ${at(a, 3)}.`), c, [String(at(a, 3))]);
};

export const foundationBanks: Record<string, ProbeBank> = {
  bx0: { same: bx0Same, flip: bx0Flip, new: variantOf([bx0New0, bx0New1]), verdict: bx0Verdict, read: variantOf([bx0Read0, bx0Read1]) },
  p1: { same: p1Same, flip: p1Flip, new: variantOf([p1New0, p1New1]), verdict: p1Verdict, read: variantOf([p1Read0, p1Read1]) },
  p2: { same: p2Same, flip: p2Flip, new: variantOf([p2New0, p2New1]), verdict: p2Verdict, read: variantOf([p2Read0, p2Read1]) },
  p3: { same: p3Same, flip: p3Flip, new: variantOf([p3New0, p3New1]), verdict: variantOf([p3Verdict0, p3Verdict1]), read: variantOf([p3Read0, p3Read1]) },
  sm: { same: smSame, flip: smFlip, new: variantOf([smNew0, smNew1]), verdict: smVerdict, read: variantOf([smRead0, smRead1]) },
};
