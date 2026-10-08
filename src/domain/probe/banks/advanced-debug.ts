// Ngân hàng câu hỏi probe: phòng debug — e1 (đọc thông báo lỗi), e2 (lệch một),
// e3 (giá trị khởi tạo sai), e4 (lỗi logic, không báo lỗi).
// Port từ main:probe-adv.js (đoạn sau t2). Nội dung tiếng Việt + code Python verbatim.

import type { ProbeBank } from '../../types';
import {
  aInt, aNum, aPick, aPy, aStr, at, kv, pJ, pre, randRange, tChoice, tNum, variantOf,
} from '../builders';

/** Các loại lỗi Python dùng trong e1 */
const ERRS: string[] = ['IndexError', 'KeyError', 'NameError', 'TypeError'];

/** Sinh một ca lỗi ngẫu nhiên: c = code, e = tên lỗi đúng */
function eCase(): { c: string; e: string } {
  const t = aPick(['I', 'K', 'N']);
  if (t === 'I') { const m = randRange(3, 5), a = Array.from({ length: m }, () => randRange(1, 9) * 10), k = m + randRange(0, 2), c = `nums = ${pJ(a)}\nprint(nums[${k}])`; return { c, e: 'IndexError' } }
  if (t === 'K') { const k = aPick(['c', 'd', 'z']), c = `d = {"a": 1, "b": 2}\nprint(d["${k}"])`; return { c, e: 'KeyError' } }
  const nm = aPick(['tong', 'dem', 'kq']), c = `x = 5\nprint(${nm})`;
  return { c, e: 'NameError' };
}

/** Code cộng dồn lỗi lệch một: bỏ sót phần tử cuối */
function e2c(a: number[]): string {
  return `nums = ${pJ(a)}\ntotal = 0\nfor i in range(len(nums) - 1):\n    total += nums[i]\nprint(total)`;
}

/* ===== e1: đọc thông báo lỗi ===== */
const e1: ProbeBank = {
  same: () => { const s = eCase(); return aPy(aStr(`${pre(s.c)}Chạy đoạn này sẽ gặp lỗi gì?`, s.e, ERRS, `Tên lỗi cho biết loại sự cố: ${s.e}.`), s.c, [], s.e) },
  flip: () => { const n = randRange(3, 8); return tNum(`Một danh sách có ${n} phần tử. Chỉ số NHỎ NHẤT mà truy cập vào sẽ gây IndexError là mấy?`, n, `Chỉ số hợp lệ là 0 đến ${n - 1}, nên ${n} là chỉ số đầu tiên vượt quá.`) },
  new: variantOf([
    () => { const k = aPick(['cam', 'xoai', 'mit']), c = `gia = {"tao": 10, "le": 12}\nprint(gia["${k}"])`; return aPy(aStr(`${pre(c)}Chạy đoạn này gặp lỗi gì?`, 'KeyError', ERRS, `Tra khóa "${k}" chưa có trong dictionary: KeyError.`), c, [], 'KeyError') },
    () => { const m = randRange(3, 5), a = Array.from({ length: m }, () => randRange(1, 9)), c = `a = ${pJ(a)}\nfor i in range(len(a)):\n    print(a[i + 1])`, py = `a = ${pJ(a)}\ntry:\n    for i in range(len(a)):\n        a[i + 1]\nexcept IndexError:\n    print(i)`; return aPy(tNum(`${pre(c)}Chương trình dừng với IndexError. Lúc đó biến i bằng mấy?`, m - 1, `i = ${m - 1} là lần cuối, a[${m}] không tồn tại.`), py, [String(m - 1)]) },
  ]),
  verdict: variantOf([
    kv("Hà nói: 'NameError là lỗi chỉ số vượt quá độ dài danh sách'. Hà nói đúng hay sai?", "Hà nói: 'NameError nghĩa là Python chưa biết một cái tên, thường do dùng biến chưa tạo'. Hà nói đúng hay sai?", 'Tên lỗi cho biết loại sự cố', 'NameError là chỉ số sai', 'NameError là chia cho 0', 'Sai: chỉ số vượt quá là IndexError.'),
    kv("Nam nói: 'đọc thông báo lỗi là mất thời gian vì nó chẳng cho biết gì'. Nam nói đúng hay sai?", "Nam nói: 'tên lỗi và số dòng cho biết loại sự cố và nơi xảy ra'. Nam nói đúng hay sai?", 'Thông báo lỗi là bản đồ chỉ chỗ cần xem', 'Thông báo lỗi vô nghĩa', 'Chỉ cần đoán', 'Sai: thông báo lỗi cho manh mối cụ thể.'),
  ]),
  read: variantOf([
    () => { const k = randRange(4, 8), c = `print("a")\nprint("b")\nnums = [1, 2, 3]\nprint(nums[${k}])\nprint("c")`; return aPy(aNum(`${pre(c)}Đọc kỹ: trước khi gặp lỗi, màn hình đã in ra bao nhiêu dòng?`, 2, `Hai dòng "a" và "b" chạy bình thường, tới nums[${k}] thì dừng, "c" không bao giờ in.`, [0, 3]), c, ['a', 'b'], 'IndexError') },
    () => { const c = `nums = [1, 2, 3]\nif len(nums) > 5:\n    print(nums[7])\nprint("xong")`; return aPy(tChoice(`${pre(c)}Đọc kỹ: chạy đoạn này chuyện gì xảy ra?`, ['Không lỗi, in xong, vì dòng nums[7] không được chạy', 'IndexError', 'NameError'], 'Điều kiện len(nums) > 5 sai nên nhánh chứa nums[7] bị bỏ qua.'), c, ['xong']) },
  ]),
};

/* ===== e2: lệch một ===== */
const e2: ProbeBank = {
  same: () => { const m = randRange(3, 5), a = Array.from({ length: m }, () => randRange(1, 9)), s = a.slice(0, -1).reduce((x, y) => x + y, 0), c = e2c(a); return aPy(tNum(`${pre(c)}In ra mấy? Dò từng vòng bằng tay.`, s, `Chỉ cộng ${m - 1} phần tử đầu: ${s}. Phần tử cuối ${at(a, m - 1)} bị bỏ sót.`), c, [String(s)]) },
  flip: () => { const x = randRange(1, 9), s = randRange(3, 15); return tNum(`Một vòng lặp lỗi lệch một in ra tổng ${s}, trong khi tổng đúng là ${s + x}. Nó bỏ sót phần tử cuối. Phần tử cuối có giá trị mấy?`, x, `${s + x} - ${s} = ${x}.`) },
  new: variantOf([
    () => { const m = randRange(3, 5), a = Array.from({ length: m }, () => randRange(1, 9)), s = a.slice(1).reduce((x, y) => x + y, 0), c = `nums = ${pJ(a)}\ntotal = 0\nfor i in range(1, len(nums)):\n    total += nums[i]\nprint(total)`; return aPy(tNum(`${pre(c)}In ra mấy?`, s, `range(1, len) bắt đầu từ chỉ số 1, bỏ qua phần tử đầu ${at(a, 0)}: tổng ${s}.`), c, [String(s)]) },
    () => { const m = randRange(4, 5), a = Array.from({ length: m }, () => randRange(1, 5)); a[m - 1] = 9; const b = Math.max(...a.slice(0, -1)), c = `a = ${pJ(a)}\nbest = a[0]\ni = 1\nwhile i < len(a) - 1:\n    if a[i] > best:\n        best = a[i]\n    i += 1\nprint(best)`; return aPy(tNum(`${pre(c)}In ra mấy?`, b, `Vòng while dừng trước phần tử cuối (9), nên 9 không bao giờ được so sánh: ${b}.`), c, [String(b)]) },
  ]),
  verdict: variantOf([
    kv("Hà nói: 'range(len(nums) - 1) duyệt hết mọi phần tử của nums'. Hà nói đúng hay sai?", "Hà nói: 'range(len(nums)) cho ra 0 đến len - 1, vừa đủ mọi phần tử'. Hà nói đúng hay sai?", 'range(n) dừng ở n - 1', 'range(n) dừng ở n', 'range(n) bắt đầu từ 1', 'Sai: trừ thêm 1 là bỏ sót phần tử cuối.'),
    kv("Nam nói: 'lỗi lệch một luôn khiến Python báo IndexError'. Nam nói đúng hay sai?", "Nam nói: 'lỗi lệch một có thể không báo lỗi gì, chỉ cho kết quả sai'. Nam nói đúng hay sai?", 'Bỏ sót phần tử vẫn chạy được', 'Luôn báo lỗi', 'Python tự sửa', 'Sai: ví dụ trên chạy bình thường nhưng sai kết quả.'),
  ]),
  read: variantOf([
    () => { const x = randRange(2, 9), c = e2c([x]); return aPy(tChoice(`${pre(c)}Danh sách chỉ có MỘT phần tử. Đọc kỹ: in ra gì?`, ['0', String(x), 'Báo lỗi'], 'range(0) không chạy vòng nào, total giữ 0. Không có lỗi, chỉ có kết quả sai.'), c, ['0']) },
    () => { const m = randRange(3, 5), a = Array.from({ length: m }, () => randRange(1, 9)), s = a.reduce((x, y) => x + y, 0), c = `nums = ${pJ(a)}\ntotal = 0\nfor i in range(len(nums)):\n    total += nums[i]\nprint(total)`; return aPy(aNum(`${pre(c)}Đoạn này có đúng không? In ra mấy?`, s, `Code này ĐÚNG (không có -1): tổng đầy đủ ${s}.`, [s - at(a, m - 1), s + 1]), c, [String(s)]) },
  ]),
};

/* ===== e3: giá trị khởi tạo sai ===== */
const e3: ProbeBank = {
  same: () => { const m = randRange(3, 5), a = Array.from({ length: m }, () => randRange(1, 9)), k = randRange(1, 5), s = a.reduce((x, y) => x + y, 0), c = `nums = ${pJ(a)}\ntotal = ${k}\nfor x in nums:\n    total += x\nprint(total)`; return aPy(tNum(`${pre(c)}In ra mấy?`, s + k, `total bắt đầu ${k}, cộng thêm ${s}: ${s + k}. Tổng đúng là ${s}.`), c, [String(s + k)]) },
  flip: () => { const a = [randRange(1, 9), randRange(1, 9), randRange(1, 9)], s = at(a, 0) + at(a, 1) + at(a, 2), k = randRange(1, 5); return tNum(`nums = ${pJ(a)}. Một đoạn code cộng dồn bắt đầu từ total = ? rồi in ra ${s + k}. Giá trị khởi tạo đó là mấy?`, k, `Tổng thật là ${s}, in ra ${s + k}, nên khởi tạo là ${s + k} - ${s} = ${k}.`) },
  new: variantOf([
    () => { const a = Array.from({ length: randRange(3, 4) }, () => -randRange(1, 9)), c = `nums = ${pJ(a)}\nbest = 0\nfor x in nums:\n    if x > best:\n        best = x\nprint(best)`; return aPy(tNum(`${pre(c)}Đoạn tìm số lớn nhất này in ra mấy?`, 0, 'Mọi số đều âm nên không số nào lớn hơn 0: in 0, dù 0 không có trong danh sách.'), c, ['0']) },
    () => { const a = Array.from({ length: randRange(3, 4) }, () => randRange(2, 5)), prod = a.reduce((x, y) => x * y, 1), c = `nums = ${pJ(a)}\ntich = 0\nfor x in nums:\n    tich = tich * x\nprint(tich)`; return aPy(aNum(`${pre(c)}Đoạn này định tính tích các số. In ra mấy?`, 0, 'tich bắt đầu 0, nhân gì cũng ra 0. Phần tử trung hòa của phép nhân là 1.', [prod, 1]), c, ['0']) },
  ]),
  verdict: variantOf([
    kv("Hà nói: 'best = 0 an toàn cho mọi danh sách khi tìm số lớn nhất'. Hà nói đúng hay sai?", "Hà nói: 'lấy phần tử đầu tiên làm mốc luôn đúng với danh sách không rỗng'. Hà nói đúng hay sai?", 'Mốc là phần tử thật của danh sách', '0 luôn nhỏ hơn mọi số', 'Mốc nào cũng được', 'Sai: danh sách toàn số âm sẽ cho kết quả sai.'),
    kv("Nam nói: 'giá trị khởi tạo đúng cho phép nhân dồn là 0'. Nam nói đúng hay sai?", "Nam nói: 'giá trị khởi tạo đúng cho phép nhân dồn là 1, vì nhân 1 không làm đổi gì'. Nam nói đúng hay sai?", 'Số nhân vào mà không đổi kết quả là 1', '0 nhân gì cũng ra chính nó', 'Khởi tạo nào cũng được', 'Sai: 0 nhân gì cũng ra 0.'),
  ]),
  read: variantOf([
    () => { const a = [-randRange(1, 9), randRange(1, 9), -randRange(1, 9)], mid = at(a, 1), c = `nums = ${pJ(a)}\nbest = 0\nfor x in nums:\n    if x > best:\n        best = x\nprint(best)`; return aPy(aInt(`${pre(c)}Nhìn giống đoạn bị lỗi best = 0. Đọc kỹ danh sách: in ra mấy?`, mid, `Có một số dương ${mid} lớn hơn 0, nên lần này vẫn ra đúng. Lỗi chỉ lộ khi mọi số đều âm.`, [0, -at(a, 0)]), c, [String(mid)]) },
    () => { const a = [-randRange(1, 9), -randRange(1, 9), -randRange(1, 9)], m = Math.max(...a), c = `nums = ${pJ(a)}\nbest = nums[0]\nfor x in nums:\n    if x > best:\n        best = x\nprint(best)`, wrong = at(a, 0) === m ? at(a, 1) : at(a, 0); return aPy(aInt(`${pre(c)}Lần này mốc là nums[0]. Danh sách toàn số âm: in ra mấy?`, m, `Mốc là phần tử thật nên kết quả đúng: ${m}. Đây là cách khởi tạo an toàn.`, [0, wrong]), c, [String(m)]) },
  ]),
};

/* ===== e4: lỗi logic, không báo lỗi ===== */
const e4: ProbeBank = {
  same: () => { const a = Array.from({ length: randRange(3, 5) }, () => randRange(1, 9)), c = `def dem_chan(nums):\n    c = 0\n    for x in nums:\n        if x % 2 == 1:\n            c += 1\n    return c\nprint(dem_chan(${pJ(a)}))`, v = a.filter((x) => x % 2 === 1).length; return aPy(tNum(`${pre(c)}Hàm tên dem_chan (đếm số chẵn). Nó in ra mấy?`, v, `Điều kiện x % 2 == 1 đếm số LẺ: ${v} số lẻ trong danh sách.`), c, [String(v)]) },
  flip: () => { const n = randRange(5, 9), m = randRange(1, n - 1); return tNum(`Hàm dem_chan bị lỗi: nó đếm số LẺ. Với một danh sách ${n} số nguyên, hàm in ra ${m}. Danh sách đó thực sự có bao nhiêu số chẵn?`, n - m, `${n} số, ${m} lẻ, nên ${n - m} chẵn.`) },
  new: variantOf([
    () => { const a = Array.from({ length: randRange(4, 6) }, () => randRange(1, 9)), c = `def dem_lon(nums):\n    # dem so lon hon 5\n    c = 0\n    for x in nums:\n        if x >= 5:\n            c += 1\n    return c\nprint(dem_lon(${pJ(a)}))`, v = a.filter((x) => x >= 5).length, gt5 = a.filter((x) => x > 5).length; return aPy(tNum(`${pre(c)}Hàm định đếm số LỚN HƠN 5. Nó in ra mấy với danh sách trên?`, v, `x >= 5 tính cả số 5 nên có thể đếm thừa. Kết quả thật của code: ${v}. Số lớn hơn 5 đúng là ${gt5}.`), c, [String(v)]) },
    () => { const a = aPick([[3, 4], [5, 2], [7, 8]]), c = `def co_chan(nums):\n    for x in nums:\n        if x % 2 == 0:\n            return True\n        else:\n            return False\n    return False\nprint(co_chan(${pJ(a)}))`, v = at(a, 0) % 2 === 0, hasEven = a.some((x) => x % 2 === 0); return aPy(tChoice(`${pre(c)}Hàm này định kiểm tra xem danh sách có số chẵn nào không. Nó in ra gì?`, [v ? 'True' : 'False', v ? 'False' : 'True', 'Báo lỗi'], `return nằm trong vòng lặp nên hàm kết thúc ngay ở phần tử đầu tiên (${at(a, 0)}). Kết quả ${String(v)}. Đúng ra danh sách ${pJ(a)} ${hasEven ? 'có' : 'không có'} số chẵn.`), c, [v ? 'True' : 'False']) },
  ]),
  verdict: variantOf([
    kv("Hà nói: 'lỗi logic thì Python báo lỗi ngay khi chạy'. Hà nói đúng hay sai?", "Hà nói: 'lỗi logic chạy bình thường nhưng kết quả sai, chỉ test mới lộ ra'. Hà nói đúng hay sai?", 'Python chỉ kiểm tra cú pháp và exception, không kiểm tra ý định của bạn', 'Python hiểu ý định của bạn', 'Lỗi logic luôn là SyntaxError', 'Sai: lỗi logic không báo lỗi gì.'),
    kv("Nam nói: 'khi code chạy sai mà không báo lỗi, cứ đoán rồi sửa bừa là nhanh nhất'. Nam nói đúng hay sai?", "Nam nói: 'nên dò từng bước hoặc in giá trị từng vòng rồi so với kết quả mong đợi'. Nam nói đúng hay sai?", 'Phải thấy máy đang làm gì ở từng bước', 'Đoán nhanh hơn', 'Xóa hết viết lại', 'Sai: sửa bừa dễ gây thêm lỗi.'),
  ]),
  read: variantOf([
    () => { const a = Array.from({ length: randRange(4, 6) }, () => randRange(1, 9)), lo = a.filter((x) => x % 2 === 1).length, ch = a.length - lo, which = Math.random() < 0.5, c = `def dem_chan(nums):\n    c = 0\n    for x in nums:\n        if x % 2 == 1:\n            c += 1\n    return c\nprint(dem_chan(${pJ(a)}))`; return aPy(aNum(`${pre(c)}Đọc kỹ đề, rồi trả lời: hàm trên ${which ? 'THỰC SỰ IN RA' : 'ĐÚNG RA PHẢI IN'} số mấy?`, which ? lo : ch, which ? `Code đếm số lẻ: in ${lo}.` : `Đúng ra phải đếm số chẵn: ${ch}.`, [which ? ch : lo, a.length]), c, [String(lo)]) },
    () => { const a = Array.from({ length: randRange(3, 5) }, () => randRange(1, 9)), v = a.filter((x) => x % 2 === 1).length, c = `def dem_le(nums):\n    c = 0\n    for x in nums:\n        if x % 2 == 1:\n            c += 1\n    return c\nprint(dem_le(${pJ(a)}))`; return aPy(aNum(`${pre(c)}Hàm này tên dem_le và đếm số lẻ. Nó có đúng không? In ra mấy?`, v, `Tên hàm và việc làm khớp nhau: hàm ĐÚNG, in ${v}.`, [a.length - v, a.length]), c, [String(v)]) },
  ]),
};

export const debugBanks: Record<string, ProbeBank> = { e1, e2, e3, e4 };
