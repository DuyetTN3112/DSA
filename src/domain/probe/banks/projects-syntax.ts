// Ngân hàng probe xưởng ghép cú pháp: b1 (gán), b2 (if/else), b3 (for), b4 (def/return), b5 (list), b6 (find_max).
// Port từ main:probe-last.js. Helper local (typed): zMax. Mọi bank dùng zSyn(fC(...), [[code, đúng?]]) —
// zSyn trả về SynCheckedQuestion, assign được cho ProbeGenerator.

import type { ProbeBank } from '../../types';
import { randRange, distinct, at, pre, pJ, tNum, tChoice, kv, aPick, aPy, aNum, xArr, zSyn, variantOf } from '../builders';

/** Khung hàm tìm max/min viết dở, v = '>' hoặc '<' (port của zMax) */
function zMax(n: string, v: string): string {
  return `def find_${n}(nums):\n    best = nums[0]\n    for x in nums:\n        if x ${v} best:\n            best = x\n    return best\n`;
}

/* ===== b1: gán là bỏ vào hộp ===== */
const b1: ProbeBank = {
  same: () => {
    const v = aPick(['x', 'y', 'kq', 'dem']), n = randRange(2, 9);
    return zSyn(tChoice(`Dòng nào Python hiểu là "bỏ số ${n} vào hộp tên ${v}"?`, [`${v} = ${n}`, `${n} = ${v}`, `${v} ${n} =`], 'Tên hộp bên trái, dấu =, giá trị bên phải.'), [[`${v} = ${n}`, true], [`${n} = ${v}`, false], [`${v} ${n} =`, false]]);
  },
  flip: () => {
    const k = randRange(2, 9);
    return tChoice(`Đọc dòng "y = x + ${k}" bằng lời:`, [`Lấy x cộng ${k}, bỏ kết quả vào hộp y`, `Lấy y cộng ${k}, bỏ kết quả vào hộp x`, `So sánh y với x cộng ${k}`], 'Bên phải được tính trước, rồi bỏ vào hộp tên ở bên trái.');
  },
  new: () => {
    const k = randRange(2, 9);
    return zSyn(tChoice(`Dòng nào làm hộp x TĂNG thêm ${k} (lấy x cộng ${k}, bỏ lại vào chính hộp x)?`, [`x = x + ${k}`, `x + ${k} = x`, `${k} = x + x`], 'Tên hộp nhận kết quả đứng bên trái dấu =.'), [[`x = x + ${k}`, true], [`x + ${k} = x`, false], [`${k} = x + x`, false]]);
  },
  verdict: kv(
    "Hà nói: 'x = x + 1 vô lý vì x không thể bằng chính nó cộng 1'. Hà nói đúng hay sai?",
    "Hà nói: 'x = x + 1 nghĩa là lấy x cộng 1 rồi bỏ lại vào hộp x'. Hà nói đúng hay sai?",
    'Dấu = trong Python là bỏ vào hộp, không phải so sánh bằng nhau', 'Dấu = luôn là so sánh', 'Python không cho phép',
    'Sai: = là phép gán.',
  ),
  read: () => zSyn(tChoice('Dòng nào KHÔNG gây SyntaxError?', ['print(x)', 'print(x', 'print x)'], 'Mỗi ngoặc mở cần một ngoặc đóng, và ngoặc mở đứng ngay sau print.'), [['print(x)', true], ['print(x', false], ['print x)', false]]),
};
b1.read = variantOf([b1.read, () => tChoice(
  'Muốn in GIÁ TRỊ trong hộp x (không phải chữ x). Chọn dòng đúng:',
  ['print(x)', 'print("x")', 'Print(x)'],
  'Ngoặc kép biến x thành chữ. Và Python phân biệt chữ hoa chữ thường: print, không phải Print.',
)]);

/* ===== b2: if/else và thụt dòng ===== */
const b2: ProbeBank = {
  same: () => {
    const k = randRange(2, 9);
    return zSyn(tChoice(`Dòng viết đúng cho "nếu n lớn hơn ${k} thì":`, [`if n > ${k}:`, `if n > ${k}`, `n > ${k}: if`], 'Dòng if luôn bắt đầu bằng if và kết thúc bằng dấu hai chấm.'), [[`if n > ${k}:\n    pass`, true], [`if n > ${k}\n    pass`, false], [`n > ${k}: if\n    pass`, false]]);
  },
  flip: () => {
    const k = randRange(2, 9);
    return tChoice(`Đọc dòng "if n > ${k}:" bằng lời:`, [`Nếu n lớn hơn ${k} thì (làm các dòng thụt vào bên dưới)`, `Gán ${k} cho n`, `In n khi n bằng ${k}`], 'Dòng if đặt câu hỏi; các dòng thụt vào là việc làm khi câu trả lời là đúng.');
  },
  new: () => {
    const v = randRange(1, 9), k = randRange(1, 9), r = v > k ? 'A' : 'B';
    const c = `n = ${v}\nif n > ${k}:\n    print("A")\nelse:\n    print("B")`;
    return aPy(tChoice(`${pre(c)}Màn hình in ra gì?`, [r, r === 'A' ? 'B' : 'A', 'A rồi B'], v > k ? `${v} > ${k} đúng: vế if.` : `${v} > ${k} sai: vế else.`), c, [r]);
  },
  verdict: kv(
    "Hà nói: 'thụt dòng chỉ để cho đẹp mắt, bỏ đi Python vẫn hiểu như cũ'. Hà nói đúng hay sai?",
    "Hà nói: 'thụt dòng cho Python biết dòng nào thuộc khối nào'. Hà nói đúng hay sai?",
    'Độ thụt là một phần của cú pháp', 'Thụt chỉ để đẹp', 'Python bỏ qua khoảng trắng',
    'Sai: thụt dòng quyết định dòng nào thuộc if.',
  ),
  read: () => aPy(tChoice(`${pre('print("A")\nif 3 > 1\n    print("B")')}Dòng if thiếu dấu hai chấm. Chạy chương trình thì sao?`, ['Không in gì cả: Python báo SyntaxError trước khi chạy bất kỳ dòng nào', 'In A rồi mới báo lỗi', 'In A rồi B'], 'Python đọc cả chương trình trước; lỗi cú pháp ở bất kỳ đâu thì không dòng nào được chạy.'), 'print("A")\nif 3 > 1\n    print("B")', [], 'SyntaxError'),
};
b2.read = variantOf([b2.read, () => zSyn(tChoice('Dòng else: đặt ở đâu so với dòng if tương ứng?', ['Thẳng hàng với if (cùng độ thụt)', 'Thụt vào bên trong khối if', 'Thụt vào sâu hơn một cấp nữa'], 'if và else là hai vế của cùng một câu hỏi nên cùng cấp.'), [['if 1 > 2:\n    pass\nelse:\n    pass', true], ['if 1 > 2:\n    pass\n    else:\n        pass', false]])]);

/* ===== b3: vòng for và range ===== */
const b3: ProbeBank = {
  same: () => {
    const n = randRange(2, 6);
    return zSyn(tChoice(`Dòng viết đúng cho "lặp ${n} lần, mỗi lần gọi số hiện tại là i":`, [`for i in range(${n}):`, `for i range(${n}):`, `for i in range ${n}:`], 'for, tên biến, in, range(số lần), dấu hai chấm.'), [[`for i in range(${n}):\n    pass`, true], [`for i range(${n}):\n    pass`, false], [`for i in range ${n}:\n    pass`, false]]);
  },
  flip: () => {
    const n = randRange(3, 9);
    return tNum(`Dòng "for i in range(${n}):" làm khối thụt vào bên dưới chạy mấy lần?`, n, `range(${n}) cho ${n} số: 0 đến ${n - 1}.`);
  },
  new: () => {
    const n = randRange(3, 6), c = `for i in range(${n}):\n    total = 0\n    total = total + i\nprint(total)`;
    return aPy(tNum(`${pre(c)}total = 0 nằm TRONG vòng for. In ra số mấy?`, n - 1, `Mỗi vòng đặt total về 0 rồi cộng i, nên mất tổng cũ. Vòng cuối i = ${n - 1}.`), c, [String(n - 1)]);
  },
  verdict: kv(
    "Hà nói: 'total = 0 đặt trong vòng for cũng cho tổng đúng'. Hà nói đúng hay sai?",
    "Hà nói: 'total = 0 phải đặt trước vòng for, nếu không mỗi vòng đặt lại về 0'. Hà nói đúng hay sai?",
    'Việc chuẩn bị làm một lần trước khi lặp', 'Đặt đâu cũng được', 'Python tự nhớ tổng',
    'Sai: đặt trong vòng thì mất tổng đã cộng.',
  ),
  read: () => {
    const n = randRange(3, 5), c = `total = 0\nfor i in range(${n}):\n    total = total + i\n    print(total)`;
    return aPy(aNum(`${pre(c)}Đọc kỹ chỗ thụt của print. Dòng ĐẦU TIÊN in ra số mấy?`, 0, `print nằm trong vòng lặp, vòng đầu i = 0 nên total = 0 rồi in ngay.`, [(n - 1) * n / 2, n]), c, Array.from({ length: n }, (_, i) => String((i * (i + 1)) / 2)));
  },
};
b3.read = variantOf([b3.read, () => {
  const n = randRange(3, 5), s = (n * (n - 1)) / 2;
  const c = `total = 0\nfor i in range(${n}):\n    total = total + i\nprint(total)`;
  return aPy(aNum(`${pre(c)}print không thụt vào. Có bao nhiêu DÒNG được in ra, và dòng đó là số mấy? Chọn số được in.`, s, `print chạy một lần sau vòng lặp, in tổng ${s}.`, [0, n - 1]), c, [String(s)]);
}]);

/* ===== b4: def và return ===== */
const b4: ProbeBank = {
  same: () => {
    const f = aPick(['gap_doi', 'tinh', 'nhan']);
    return zSyn(tChoice(`Dòng viết đúng để "tạo hàm tên ${f}, nhận vào x":`, [`def ${f}(x):`, `${f} def(x):`, `def ${f} x:`], 'def, tên hàm, ngoặc chứa đầu vào, dấu hai chấm.'), [[`def ${f}(x):\n    pass`, true], [`${f} def(x):\n    pass`, false], [`def ${f} x:\n    pass`, false]]);
  },
  flip: () => {
    const k = randRange(2, 5);
    return tChoice(`Dòng "return x * ${k}" nghĩa là gì?`, [`Trả kết quả x nhân ${k} ra cho nơi đã gọi hàm`, `In x nhân ${k} ra màn hình`, `Gán ${k} cho x`], 'return đưa kết quả về cho người gọi, khác với print (in ra màn hình).');
  },
  new: () => {
    const k = randRange(2, 5), v = randRange(2, 9);
    const c = `def gap(x):\n    return x * ${k}\nprint(gap(${v}))`;
    return aPy(tNum(`${pre(c)}In ra số mấy?`, k * v, `gap(${v}) = ${v} x ${k}.`), c, [String(k * v)]);
  },
  verdict: kv(
    "Hà nói: 'dòng print(gap_doi(4)) phải thụt vào vì nó dùng hàm'. Hà nói đúng hay sai?",
    "Hà nói: 'dòng gọi hàm nằm ngoài hàm nên không thụt vào'. Hà nói đúng hay sai?",
    'Chỉ phần định nghĩa hàm mới thụt vào', 'Mọi dòng liên quan đều thụt', 'Thụt tùy ý',
    'Sai: gọi hàm nằm ngoài hàm.',
  ),
  read: () => aPy(tChoice(`${pre('print(f(3))\ndef f(x):\n    return x * 2')}Gọi hàm TRƯỚC khi tạo nó. Chuyện gì xảy ra?`, ['Báo NameError: lúc gọi f, Python chưa biết f', 'In 6', 'In None'], 'Python chạy từ trên xuống: phải tạo hàm trước rồi mới gọi.'), 'print(f(3))\ndef f(x):\n    return x * 2', [], 'NameError'),
};
b4.read = variantOf([b4.read, () => {
  const a = randRange(2, 5);
  const c = `def g(x):\n    print(x)\ny = g(${a})\nprint(y)`;
  return aPy(tChoice(`${pre(c)}Hàm g chỉ print, không return. Hai dòng in ra là gì?`, [`${a} rồi None`, `${a} rồi ${a}`, `None rồi ${a}`], 'Không có return thì hàm trả về None.'), c, [String(a), 'None']);
}]);

/* ===== b5: list và chỉ số ===== */
const b5: ProbeBank = {
  same: () => {
    const i = randRange(0, 3);
    return zSyn(tChoice(`Viết "lấy hộp số ${i} của hàng hộp a":`, [`a[${i}]`, `[${i}]a`, `a[${i}`], 'Tên hàng hộp, rồi chỉ số trong ngoặc vuông.'), [[`a[${i}]`, true], [`[${i}]a`, false], [`a[${i}`, false]]);
  },
  flip: () => {
    const n = randRange(3, 9);
    return tNum(`Mảng a có ${n} hộp. len(a) trả về mấy?`, n, `len đếm số hộp: ${n}. Chỉ số cuối là ${n - 1}.`);
  },
  new: () => {
    const a = xArr(randRange(3, 5), 1, 9), c = `a = ${pJ(a)}\nfor i in range(len(a)):\n    last = i\nprint(last)`;
    return aPy(tNum(`${pre(c)}In ra số mấy?`, a.length - 1, `i là SỐ THỨ TỰ của hộp, đi từ 0 đến ${a.length - 1}.`), c, [String(a.length - 1)]);
  },
  verdict: kv(
    "Hà nói: 'for x in a cho ra số thứ tự của từng hộp'. Hà nói đúng hay sai?",
    "Hà nói: 'for x in a cho ra chính giá trị trong từng hộp'. Hà nói đúng hay sai?",
    'x là giá trị, còn i trong range(len(a)) mới là chỉ số', 'x là chỉ số', 'x luôn là 0',
    'Sai: x là giá trị.',
  ),
  read: () => {
    const i = randRange(0, 2);
    return zSyn(tChoice(`Dòng nào BỎ số 9 vào hộp số ${i} của a?`, [`a[${i}] = 9`, `a[${i}] == 9`, `a(${i}) = 9`], '= là bỏ vào (gán), == là hỏi có bằng nhau không. Và hộp dùng ngoặc vuông.'), [[`a = [1, 2, 3]\na[${i}] = 9`, true], [`a(${i}) = 9`, false]]);
  },
};
b5.new = variantOf([b5.new, () => {
  const a = xArr(randRange(3, 5), 1, 9), c = `a = ${pJ(a)}\nfor x in a:\n    last = x\nprint(last)`;
  return aPy(tNum(`${pre(c)}In ra số mấy?`, at(a, a.length - 1), `x là chính giá trị trong từng hộp; vòng cuối x = ${at(a, a.length - 1)}.`), c, [String(at(a, a.length - 1))]);
}]);

/* ===== b6: find_max và vị trí dòng ===== */
const b6: ProbeBank = {
  same: () => {
    const mx = Math.random() < 0.5, n = mx ? 'max' : 'min', op = mx ? '>' : '<';
    return tChoice(`${pre(`def find_${n}(nums):\n    best = nums[0]\n    for x in nums:`)}Hàm tìm số ${mx ? 'LỚN' : 'NHỎ'} nhất đang viết dở. Dòng TIẾP THEO (thụt thêm 4 dấu cách) là gì?`, [`if x ${op} best:`, 'return best', `def find_${n}(nums):`], `Trong vòng lặp ta so từng x với best. ${mx ? 'Lớn' : 'Nhỏ'} hơn thì thay.`);
  },
  flip: () => {
    const c = zMax('max', '>') + zMax('max', '>').replace('find_max', 'bad').replace('    return best\n', '        return best\n') + 'print(find_max([3, 9, 2]), bad([3, 9, 2]))';
    return aPy(tChoice('Dòng return best thụt vào TRONG vòng for (cùng độ thụt với if) thay vì thẳng hàng với for. Hàm trả về gì với [3, 9, 2]?', ['3: return chạy ngay ở vòng đầu rồi hàm kết thúc', '9 như bình thường', '2'], 'return nằm trong vòng lặp thì kết thúc hàm ngay ở lần lặp đầu tiên.'), c, ['9 3']);
  },
  new: () => {
    const c = 'def sum_all(nums):\n    total = 0\n    for x in nums:\n        total = total + x\n    return total\nprint(sum_all([1, 2, 3]))';
    return aPy(tChoice(`${pre('def sum_all(nums):\n    total = 0\n    for x in nums:\n        total = total + x\n    return total')}Dòng nào đứng ngay TRƯỚC dòng for x in nums:?`, ['total = 0', 'return total', 'total = total + x'], 'Chuẩn bị tờ giấy ghi tổng trước khi lặp, đúng như best = nums[0] trong find_max.'), c, ['6']);
  },
  verdict: kv(
    "Hà nói: 'best = nums[0] đặt sau vòng for cũng được'. Hà nói đúng hay sai?",
    "Hà nói: 'best = nums[0] phải đứng trước vòng for vì vòng for cần so với best'. Hà nói đúng hay sai?",
    'Phải có tờ giấy trước khi so', 'Thứ tự không quan trọng', 'best tự có',
    'Sai: chưa có best thì không thể so.',
  ),
  read: () => {
    const a = distinct(4, 9);
    let nums = a;
    if (Math.max(...nums) === at(nums, 3)) nums = [at(nums, 3), at(nums, 0), at(nums, 1), at(nums, 2)];
    const last = at(nums, 3), mx = Math.max(...nums);
    const c2 = `def find_max(nums):\n    best = nums[0]\n    for x in nums:\n        if x > best:\n            pass\n        best = x\n    return best\nprint(find_max(${pJ(nums)}))`;
    return aPy(aNum(`${pre(`def find_max(nums):\n    best = nums[0]\n    for x in nums:\n        if x > best:\n            pass\n        best = x\n    return best\nprint(find_max(${pJ(nums)}))`)}Dòng best = x không thụt vào trong if. In ra số mấy?`, last, `best = x chạy ở MỌI vòng, nên cuối cùng best là phần tử cuối (${last}), không phải số lớn nhất (${mx}).`, [mx, at(nums, 0)]), c2, [String(last)]);
  },
};
b6.new = variantOf([b6.new, () => {
  const mx = Math.random() < 0.5, n = mx ? 'max' : 'min', op = mx ? '>' : '<';
  return tChoice(`Hàm tìm số ${mx ? 'lớn' : 'nhỏ'} nhất, đang viết dở:${pre(`def find_${n}(nums):\n    best = nums[0]\n    for x in nums:\n        if x ${op} best:\n            best = x`)}Dòng cuối cùng của hàm là gì, và nó thụt vào đâu?`, ['return best, thẳng hàng với for (ngoài vòng lặp)', 'return best, thụt vào trong if', 'return x, thụt vào trong vòng for'], 'Chỉ trả kết quả sau khi xem hết các hộp, nên return nằm ngoài vòng lặp.');
}]);

export const syntaxBanks: Record<string, ProbeBank> = { b1, b2, b3, b4, b5, b6 };
