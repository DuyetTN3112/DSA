// Ngân hàng probe code w1–w7: thuật toán cơ bản (port của probe-code.js, nhánh main).
// w5 và w6 là bản sao của w4 (code cũ: PRB.w5 = Object.assign({}, PRB.w4)).
import type { ProbeBank } from '../../types';
import type { PyCheckedQuestion } from '../builders';
import {
  LESSON_REFS, aPick, aPy, at, distinct, kv, num, opt, pre, randRange,
  shuffled, tChoice, tNum, variantOf, xArr,
} from '../builders';

/** JSON.stringify có dấu cách sau , và : (port của J trong probe-code.js) */
function J(x: object): string {
  return JSON.stringify(x).replace(/,/g, ', ').replace(/:/g, ': ');
}

/** ref code Python của bài học; throw khi thiếu (port của LES.w1.ref) */
function refOf(id: string): string {
  const r = LESSON_REFS[id];
  if (r === undefined) throw new Error(`refOf: thiếu ref bài ${id}`);
  return r;
}

/** Trắc nghiệm True/False có gắn code kiểm chứng (port của boolQ) */
function boolQ(q: string, v: boolean, w: string, src: string, body: string): PyCheckedQuestion {
  return aPy(tChoice(q, [v ? 'True' : 'False', v ? 'False' : 'True', 'Báo lỗi'], w), src + body, [v ? 'True' : 'False']);
}

const FM = `def find_max(nums):\n    best = nums[0]\n    for x in nums:\n        if x > best:\n            best = x\n    return best\n`;
const LS = `def linear_search(nums, target):\n    for i in range(len(nums)):\n        if nums[i] == target:\n            return i\n    return -1\n`;
const SM = `def second_max(nums):\n    uniq = set(nums)\n    uniq.remove(max(uniq))\n    return max(uniq)\n`;
const TS = `def two_sum(nums, target):\n    seen = {}\n    for i, x in enumerate(nums):\n        y = target - x\n        if y in seen:\n            return [seen[y], i]\n        seen[x] = i\n    raise ValueError("khong co cap")\n`;
const HD = `def has_duplicate(nums):\n    seen = set()\n    for x in nums:\n        if x in seen:\n            return True\n        seen.add(x)\n    return False\n`;

/** Mô phỏng two_sum bằng Map (port của tsJs) */
function tsJs(n: number[], t: number): [number, number] | null {
  const s = new Map<number, number>();
  for (let i = 0; i < n.length; i++) {
    const x = at(n, i);
    const y = t - x;
    const got = s.get(y);
    if (got !== undefined) return [got, i];
    s.set(x, i);
  }
  return null;
}

const w1: ProbeBank = {
  same: () => {
    const a = xArr(randRange(4, 6), -4, 9);
    const m = Math.max(...a);
    return num(FM, `print(find_max(${J(a)}))`, m, `Lớn nhất của ${J(a)} là ${m}: best bị ghi đè mỗi khi gặp số lớn hơn.`);
  },
  flip: () => {
    const a = distinct(5, 9);
    const m = Math.max(...a);
    const mi = a.indexOf(m);
    return num(FM, `nums = ${J(a)}\nprint(nums.index(find_max(nums)))`, mi, `find_max trả ${m}. Số ${m} nằm ở chỉ số ${mi} (đếm từ 0).`, 'In ra mấy? (chú ý: đây là CHỈ SỐ của kết quả, không phải kết quả)');
  },
  new: () => {
    const a = xArr(randRange(5, 7), 1, 9);
    const t = randRange(3, 6);
    const c = a.filter((x) => x > t).length;
    return num(`def count_more(nums, t):\n    c = 0\n    for x in nums:\n        if x > t:\n            c += 1\n    return c\n`, `print(count_more(${J(a)}, ${t}))`, c, `Cùng cách đi hết dãy với một biến nhớ, nhưng biến nhớ lần này là bộ đếm: có ${c} số lớn hơn ${t}.`);
  },
  verdict: kv(
    "Hà nói: 'find_max đặt best = 0 ở đầu thì đúng với mọi danh sách'. Hà nói đúng hay sai?",
    "Hà nói: 'find_max nên đặt best = nums[0] để đúng cả với danh sách toàn số âm'. Hà nói đúng hay sai?",
    'Với danh sách toàn số âm thì 0 lớn hơn mọi số trong đó, kết quả sẽ sai',
    'Python bắt buộc best bằng 0',
    'Số âm không so sánh được với nhau',
    'Sai: [-3, -1, -7] sẽ trả 0, mà 0 không có trong danh sách.',
  ),
  read: variantOf([
    () => opt(refOf('w1'), 'print(find_max([]))', 'Báo lỗi ValueError vì danh sách rỗng', ['In ra 0', 'In ra None'], [], 'ValueError', 'Hàm có dòng kiểm tra ở đầu: danh sách rỗng bị chặn trước khi tìm số lớn nhất. Đọc kỹ các dòng bảo vệ trước khi dự đoán.'),
    () => opt(refOf('w1'), 'print(find_max("abc"))', 'Báo lỗi TypeError vì không phải list', ['In ra c', 'In ra 0'], [], 'TypeError', "Dòng đầu kiểm tra isinstance(nums, list): một chuỗi không phải list nên bị chặn bằng TypeError, dù chuỗi cũng 'duyệt được'."),
  ]),
};

const w2: ProbeBank = {
  same: () => {
    const a = xArr(randRange(5, 7), 1, 5);
    const t = randRange(1, 6);
    const r = a.indexOf(t);
    return num(LS, `print(linear_search(${J(a)}, ${t}))`, r, r < 0 ? `Không có ${t} trong dãy nên trả -1.` : `${t} gặp đầu tiên ở chỉ số ${r}; hàm trả về ngay, không xét tiếp.`);
  },
  flip: () => {
    const a = distinct(6, 12);
    const r = randRange(1, 5);
    const t = at(a, r);
    return aPy(tNum(`${pre(LS)}nums = ${J(a)}. Muốn linear_search(nums, ?) trả về ${r}, dấu ? phải là số mấy?`, t, `Hàm trả CHỈ SỐ ${r}, nên số cần tìm là nums[${r}] = ${t}.`), LS + `print(linear_search(${J(a)}, ${t}))`, [String(r)]);
  },
  new: () => {
    const a = xArr(randRange(5, 7), 1, 9).map((x, i) => (i === 3 ? -x : x));
    const r = a.findIndex((x) => x < 0);
    return num(`def first_negative(nums):\n    for i in range(len(nums)):\n        if nums[i] < 0:\n            return i\n    return -1\n`, `print(first_negative(${J(a)}))`, r, `Cùng khung tìm tuyến tính, chỉ đổi điều kiện thành 'nhỏ hơn 0': số âm đầu tiên ở chỉ số ${r}.`);
  },
  verdict: kv(
    "Hà nói: 'linear_search đặt return -1 BÊN TRONG vòng for cho gọn thì vẫn đúng'. Hà nói đúng hay sai?",
    "Hà nói: 'return -1 phải nằm ngoài vòng for, vì chỉ kết luận không có sau khi đã mở hết hộp'. Hà nói đúng hay sai?",
    "Chỉ kết luận 'không có' sau khi đã xét hết mọi hộp",
    'Python không cho return trong vòng for',
    'return -1 chạy nhanh hơn khi nằm trong vòng for',
    "Sai: đặt trong vòng for thì hàm kết luận 'không có' ngay sau hộp đầu tiên không khớp.",
  ),
  read: variantOf([
    () => {
      const a = distinct(4, 9);
      const k = randRange(1, 3);
      return opt(LS, `print(linear_search(${J(a)}, ${at(a, k)}))`, `${k}: đây là chỉ số của ${at(a, k)}`, [`${at(a, k)}: chính số cần tìm`, '-1'], [String(k)], '', `Hàm trả về VỊ TRÍ (chỉ số) của số cần tìm, không phải chính số đó. Số ${at(a, k)} đứng ở chỉ số ${k}.`);
    },
    () => {
      const v = randRange(1, 5);
      return opt(refOf('w2'), `print(linear_search([${v}, 9, ${v}, 7], ${v}))`, '0: gặp lần đầu thì trả về luôn', ['2: lần xuất hiện cuối', '[0, 2]: cả hai vị trí'], ['0'], '', `${v} xuất hiện ở chỉ số 0 và 2, nhưng return dừng hàm ngay lần gặp đầu tiên nên trả 0.`);
    },
  ]),
};

const w3: ProbeBank = {
  same: () => {
    const hi = randRange(6, 9);
    const lo = randRange(1, 4);
    const mid = randRange(lo + 1, hi - 1);
    const a = shuffled([hi, hi, mid, lo, mid]);
    return num(SM, `print(second_max(${J(a)}))`, mid, `set bỏ trùng còn {${lo}, ${mid}, ${hi}}, bỏ ${hi} còn lại lớn nhất là ${mid}. Số ${hi} xuất hiện hai lần vẫn chỉ là MỘT giá trị.`);
  },
  flip: () => {
    const hi = randRange(7, 9);
    const lo = randRange(1, 3);
    const mid = randRange(lo + 1, hi - 1);
    return aPy(tNum(`${pre(SM)}Biết second_max([${hi}, ${lo}, ?]) trả về ${mid}. Dấu ? là số mấy? (? khác ${hi} và ${lo})`, mid, `Tập giá trị là {${hi}, ${lo}, ?}. Để lớn thứ hai là ${mid}, mà ${lo} < ${mid} < ${hi} thì ? phải là ${mid}.`), SM + `print(second_max([${hi}, ${lo}, ${mid}]))`, [String(mid)]);
  },
  new: () => {
    const a = xArr(randRange(6, 8), 1, 5);
    const r = new Set(a).size;
    return num(`def count_distinct(nums):\n    return len(set(nums))\n`, `print(count_distinct(${J(a)}))`, r, `set giữ mỗi giá trị đúng một lần: ${J(a)} có ${r} giá trị khác nhau.`, 'In ra mấy? (cùng công cụ set, bài toán khác)');
  },
  verdict: kv(
    "Hà nói: 'second_max([7, 7, 3]) trả 7, vì số 7 xuất hiện hai lần nên có hai số lớn nhất'. Hà nói đúng hay sai?",
    "Hà nói: 'second_max([7, 7, 3]) trả 3, vì hai số 7 chỉ là một giá trị lớn nhất'. Hà nói đúng hay sai?",
    'set bỏ trùng nên 7 chỉ còn một lần; lớn thứ hai là 3',
    'Python luôn giữ số trùng trong set',
    'Lớn thứ hai luôn bằng lớn nhất',
    "Sai: đề đã chốt 'lớn thứ hai' là theo GIÁ TRỊ khác nhau, không phải theo vị trí.",
  ),
  read: variantOf([
    () => {
      const v = randRange(1, 9);
      return opt(refOf('w3'), `print(second_max([${v}, ${v}, ${v}]))`, 'Báo lỗi ValueError vì chỉ có 1 giá trị khác nhau', [`In ra ${v}`, 'In ra 0'], [], 'ValueError', "Sau khi bỏ trùng chỉ còn một giá trị, không có 'lớn thứ hai', nên hàm chủ động báo ValueError.");
    },
    () => opt(refOf('w3'), 'print(second_max([5]))', 'Báo lỗi ValueError vì cần ít nhất 2 giá trị khác nhau', ['In ra 5', 'In ra None'], [], 'ValueError', 'Một phần tử thì không có lớn thứ hai: ca biên này đề đã chốt là lỗi.'),
  ]),
};

const w4: ProbeBank = {
  same: () => {
    let a: number[] = [];
    let t = 0;
    let r: [number, number] | null = null;
    do {
      a = distinct(5, 14);
      const i = randRange(0, 3);
      const j = randRange(i + 1, 4);
      t = at(a, i) + at(a, j);
      r = tsJs(a, t);
    } while (r === null);
    const r0 = at(r, 0);
    const r1 = at(r, 1);
    return num(TS, `i, j = two_sum(${J(a)}, ${t})\nprint(j)`, r1, `Hàm dừng ở lần đầu một số có 'bạn cùng cặp' đã được ghi trong seen: trả [${r0}, ${r1}], nên j = ${r1}.`, 'In ra mấy? (chỉ số j của cặp tìm thấy)');
  },
  flip: () => {
    let a: number[] | null = null;
    let t = 0;
    for (let k = 0; k < 300 && a === null; k++) {
      const c = distinct(4, 12);
      t = at(c, 1) + at(c, 3);
      const rr = tsJs(c, t);
      if (rr !== null && at(rr, 0) === 1 && at(rr, 1) === 3) a = c;
    }
    if (a === null) { a = [1, 6, 2, 5]; t = 11; }
    const x = at(a, 3);
    return aPy(tNum(`${pre(TS)}nums = [${at(a, 0)}, ${at(a, 1)}, ${at(a, 2)}, ?], target = ${t}. Biết two_sum(nums, ${t}) trả về [1, 3]. Dấu ? là số mấy?`, x, `Cặp là nums[1] + nums[3] = ${t}, nên nums[3] = ${t} - ${at(a, 1)} = ${x}.`), TS + `print(two_sum(${J(a)}, ${t}))`, ['[1, 3]']);
  },
  new: variantOf([
    () => {
      const a = xArr(randRange(6, 8), 1, 6);
      let r = -1;
      const s = new Set<number>();
      for (const x of a) { if (s.has(x)) { r = x; break; } s.add(x); }
      return num(`def first_repeat(nums):\n    seen = set()\n    for x in nums:\n        if x in seen:\n            return x\n        seen.add(x)\n    return -1\n`, `print(first_repeat(${J(a)}))`, r, `Cùng ý 'ghi lại những gì đã thấy rồi tra': số đầu tiên xuất hiện lần thứ hai là ${r}.`);
    },
    () => {
      const a = xArr(randRange(5, 7), 1, 6);
      const t = randRange(5, 8);
      const s = new Set(a);
      const c = a.filter((x) => s.has(t - x)).length;
      return num(`def count_with_partner(nums, t):\n    s = set(nums)\n    c = 0\n    for x in nums:\n        if t - x in s:\n            c += 1\n    return c\n`, `print(count_with_partner(${J(a)}, ${t}))`, c, `Với mỗi số x, hỏi 'bạn cùng cặp ${t} - x có trong tập không': có ${c} số như vậy (một số có thể tự ghép với chính nó).`);
    },
  ]),
  verdict: kv(
    "Hà nói: 'two_sum dùng hai vòng for lồng nhau thì nhanh hơn dùng dict, vì dict tốn thêm bộ nhớ'. Hà nói đúng hay sai?",
    "Hà nói: 'two_sum dùng dict để mỗi số chỉ cần xét một lần, đổi lại tốn thêm bộ nhớ'. Hà nói đúng hay sai?",
    "Dict cho biết 'y đã thấy chưa' trong một bước, nên chỉ quét dãy một lần; đổi lại tốn bộ nhớ",
    'Hai vòng lồng nhau luôn nhanh hơn',
    'Dict chậm hơn danh sách khi tra cứu',
    'Sai: hai vòng lồng nhau phải so sánh rất nhiều cặp; dict đổi bộ nhớ lấy tốc độ.',
  ),
  read: variantOf([
    () => {
      const v = randRange(2, 9);
      return opt(TS, `print(two_sum([${v}, ${v}], ${2 * v}))`, '[0, 1]: số thứ hai tìm thấy bản sao đã lưu', ['Báo ValueError vì hai số giống nhau', '[0, 0]'], ['[0, 1]'], '', `Ở i = 0, seen còn rỗng nên chưa có cặp; sau đó lưu ${v} -> 0. Ở i = 1, y = ${v} đã có trong seen, trả [0, 1]. Kiểm tra TRƯỚC khi lưu nên một số không ghép với chính nó.`);
    },
    () => {
      const a = [randRange(1, 3), randRange(4, 6), randRange(7, 9)];
      return opt(TS, `print(two_sum(${J(a)}, 100))`, 'Báo lỗi ValueError vì không có cặp nào', ['[0, 1]', 'In ra -1'], [], 'ValueError', 'Duyệt hết mà không cặp nào có tổng 100 thì chạy tới dòng raise ValueError. Hàm này không trả -1.');
    },
  ]),
};

const w7: ProbeBank = {
  same: () => {
    const a = xArr(randRange(4, 6), 1, 8);
    const v = new Set(a).size < a.length;
    return boolQ(`${pre(`${HD}print(has_duplicate(${J(a)}))`)}In ra gì?`, v, v ? 'Có số xuất hiện hai lần nên trả True.' : 'Mọi số khác nhau nên chạy hết vòng và trả False.', HD, `print(has_duplicate(${J(a)}))`);
  },
  flip: () => {
    const n = randRange(5, 12);
    return tNum(`has_duplicate trả về False cho một danh sách có ${n} phần tử. Danh sách đó có bao nhiêu giá trị khác nhau?`, n, `Không có số trùng nghĩa là ${n} phần tử đều khác nhau: ${n} giá trị khác nhau.`);
  },
  new: variantOf([
    () => {
      const ids = ['u1', 'u2', 'u3', 'u4'];
      const a = Array.from({ length: randRange(6, 8) }, () => aPick(ids));
      let d = 0;
      const s = new Set<string>();
      for (const x of a) { if (s.has(x)) d += 1; else s.add(x); }
      return num(`def duplicate_logins(users):\n    seen = set()\n    dups = 0\n    for u in users:\n        if u in seen:\n            dups += 1\n        else:\n            seen.add(u)\n    return dups\n`, `print(duplicate_logins(${J(a)}))`, d, `Mỗi lần gặp một tài khoản đã có trong seen thì cộng 1: có ${d} lần đăng nhập lặp. Cùng ý, đổi từ số sang tài khoản và từ True/False sang đếm.`);
    },
    () => {
      const a = xArr(randRange(4, 6), 1, 8);
      const t = randRange(6, 11);
      const seen = new Set<number>();
      let v = false;
      for (const x of a) { if (seen.has(t - x)) { v = true; break; } seen.add(x); }
      const src = `def has_pair_sum(nums, t):\n    seen = set()\n    for x in nums:\n        if t - x in seen:\n            return True\n        seen.add(x)\n    return False\n`;
      return boolQ(`${pre(`${src}print(has_pair_sum(${J(a)}, ${t}))`)}In ra gì?`, v, v ? `Có một số mà bạn cùng cặp (${t} - x) đã nằm trong seen nên trả True.` : 'Không số nào có bạn cùng cặp đã được thấy trước đó nên trả False.', src, `print(has_pair_sum(${J(a)}, ${t}))`);
    },
  ]),
  verdict: kv(
    "Hà nói: 'kiểm tra x in seen với seen là LIST thì nhanh y như với seen là SET, cả khi danh sách rất dài'. Hà nói đúng hay sai?",
    "Hà nói: 'dùng set cho seen vì kiểm tra x in seen không phải quét từng phần tử'. Hà nói đúng hay sai?",
    'set tra cứu trực tiếp, list phải quét từng phần tử',
    'list và set tra cứu giống hệt nhau',
    'set luôn tốn ít bộ nhớ hơn list',
    'Sai: với list, mỗi lần x in seen có thể phải quét hết danh sách.',
  ),
  read: variantOf([
    () => opt(HD, 'print(has_duplicate([]))', 'False: rỗng thì không có số nào trùng', ['Báo lỗi vì danh sách rỗng', 'True'], ['False'], '', 'Danh sách rỗng là ca hợp lệ: vòng lặp không chạy lần nào, chạy xuống return False. Không phải mọi ca rỗng đều là lỗi, phải đọc hàm cụ thể.'),
    () => opt(refOf('w7'), 'print(has_duplicate("abca"))', 'Báo lỗi TypeError vì không phải list', ['True vì chữ a lặp lại', 'False'], [], 'TypeError', 'Dòng bảo vệ isinstance(nums, list) chặn chuỗi trước khi duyệt, dù chuỗi có chữ a lặp.'),
  ]),
};

export const codeAlgoBanks: Record<string, ProbeBank> = {
  w1,
  w2,
  w3,
  w4,
  w5: { ...w4 },
  w6: { ...w4 },
  w7,
};
