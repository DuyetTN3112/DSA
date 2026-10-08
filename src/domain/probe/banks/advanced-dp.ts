// Ngân hàng câu hỏi probe: quy hoạch động — dp1 (fib, đừng tính lại), dp2 (leo cầu thang).
// Port từ main:probe-adv.js (đoạn sau t2). Nội dung tiếng Việt + code Python verbatim.

import type { ProbeBank } from '../../types';
import { aNum, aPy, at, kv, pre, randRange, tNum, variantOf } from '../builders';

/** Code fib đệ quy thuần (không ghi nhớ) */
const FIB = 'def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\n';

/** Giá trị fib(n) với fib(0) = 0, fib(1) = 1 */
function fibv(n: number): number {
  return n < 2 ? n : fibv(n - 1) + fibv(n - 2);
}

/** Đếm số lần fib(t) bị gọi khi tính fib(n) bằng cách thuần */
function fibCalls(n: number, t: number): number {
  let c = 0;
  const f = (m: number): void => {
    if (m === t) c += 1;
    if (m < 2) return;
    f(m - 1);
    f(m - 2);
  };
  f(n);
  return c;
}

/** Số cách lên bậc n khi mỗi bước đi một trong các bước steps; cách(0) = 1 */
function stairs(n: number, steps: number[]): number {
  const w: number[] = [1];
  for (let i = 1; i <= n; i++) {
    let s = 0;
    for (const st of steps) {
      if (i - st >= 0) s += at(w, i - st);
    }
    w[i] = s;
  }
  return at(w, n);
}

/* ===== dp1: quy hoạch động, đừng tính lại ===== */
const dp1: ProbeBank = {
  same: () => {
    const n = randRange(4, 8);
    const c = FIB + `print(fib(${n}))`;
    const v = fibv(n);
    return aPy(
      tNum(`${pre(c)}In ra mấy? (fib(0) = 0, fib(1) = 1)`, v, `Dãy: 0, 1, 1, 2, 3, 5, 8, 13, 21: fib(${n}) = ${v}.`),
      c,
      [String(v)],
    );
  },
  flip: () => {
    const n = randRange(3, 8);
    const v = fibv(n);
    return tNum(
      `Với fib(0) = 0, fib(1) = 1, fib(n) = fib(n - 1) + fib(n - 2), biết fib(?) = ${v}. Dấu ? là mấy?`,
      n,
      `Dãy 0, 1, 1, 2, 3, 5, 8, 13, 21: ${v} đứng ở vị trí ${n}.`,
    );
  },
  new: variantOf([
    () => {
      const n = randRange(4, 7);
      const calls = fibCalls(n, 2);
      const c = `c = 0\ndef fib(n):\n    global c\n    if n == 2:\n        c += 1\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\nfib(${n})\nprint(c)`;
      return aPy(
        tNum(
          `${pre(FIB)}Tính fib(${n}) bằng cách thuần này (không ghi nhớ). Hàm fib(2) bị gọi bao nhiêu lần?`,
          calls,
          `Đếm các lời gọi fib(2) trong cây gọi: ${calls}.`,
        ),
        c,
        [String(calls)],
      );
    },
    () => {
      const n = randRange(3, 6);
      let tot = 0;
      const f = (k: number): void => {
        tot += 1;
        if (k < 2) return;
        f(k - 1);
        f(k - 2);
      };
      f(n);
      const c = `c = 0\ndef fib(n):\n    global c\n    c += 1\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\nfib(${n})\nprint(c)`;
      return aPy(
        tNum(
          `${pre(FIB)}Tính fib(${n}) bằng cách thuần này. Tổng cộng hàm fib được gọi bao nhiêu lần (kể cả lần đầu)?`,
          tot,
          `Đếm mọi lời gọi trong cây: ${tot}.`,
        ),
        c,
        [String(tot)],
      );
    },
  ]),
  verdict: variantOf([
    kv(
      "Hà nói: 'ghi nhớ kết quả (memo) làm kết quả của fib khác đi so với tính thuần'. Hà nói đúng hay sai?",
      "Hà nói: 'memo giữ nguyên kết quả, chỉ bỏ việc tính lại những bài con đã tính'. Hà nói đúng hay sai?",
      'Mỗi bài con chỉ tính một lần rồi tra lại',
      'Kết quả bị sai khác',
      'Memo chỉ làm đẹp code',
      'Sai: kết quả giữ nguyên, chỉ nhanh hơn.',
    ),
    kv(
      "Nam nói: 'tính fib(50) bằng cách thuần vẫn nhanh vì máy tính mạnh'. Nam nói đúng hay sai?",
      "Nam nói: 'mỗi bậc số lần gọi tăng gần gấp đôi nên fib(50) thuần rất chậm'. Nam nói đúng hay sai?",
      'Cùng một bài con bị tính đi tính lại rất nhiều lần',
      'Máy mạnh thì mọi thứ đều nhanh',
      'fib(50) chỉ gọi 50 lần',
      'Sai: số lần gọi tăng theo cấp số nhân.',
    ),
  ]),
  read: variantOf([
    () => {
      const n = randRange(4, 6);
      const one = fibCalls(n, 1);
      const two = fibCalls(n, 2);
      const zero = fibCalls(n, 0);
      const c = `c = 0\ndef fib(n):\n    global c\n    if n == 1:\n        c += 1\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\nfib(${n})\nprint(c)`;
      return aPy(
        aNum(
          `${pre(FIB)}Đọc kỹ đề: khi tính fib(${n}), hàm fib(1) (KHÔNG phải fib(2)) bị gọi bao nhiêu lần?`,
          one,
          `Đếm riêng fib(1): ${one} lần. fib(2) bị gọi ${two} lần, một câu hỏi khác.`,
          [two, zero],
        ),
        c,
        [String(one)],
      );
    },
    () => {
      const n = randRange(2, 5);
      const f = (k: number): number => (k < 2 ? 1 : f(k - 1) + f(k - 2));
      const v = f(n);
      const c = `def fib(n):\n    if n < 2:\n        return 1\n    return fib(n - 1) + fib(n - 2)\nprint(fib(${n}))`;
      return aPy(
        aNum(
          `${pre(c)}Nhìn giống fib đã học nhưng đọc kỹ ca cơ sở. In ra mấy?`,
          v,
          `Ca cơ sở đổi thành return 1 nên số lớn hơn fib thường. Kết quả ${v}, không phải ${fibv(n)}.`,
          [fibv(n), v + 1],
        ),
        c,
        [String(v)],
      );
    },
  ]),
};

/* ===== dp2: bảng quy hoạch động, leo cầu thang ===== */
const dp2: ProbeBank = {
  same: () => {
    const n = randRange(3, 7);
    const v = stairs(n, [1, 2]);
    const code = `w = [1, 1, 2]\nfor i in range(3, ${n + 1}):\n    w.append(w[i - 1] + w[i - 2])\nprint(w[${n}])`;
    return aPy(
      tNum(
        `Mỗi lần bước 1 hoặc 2 bậc. Lên bậc ${n} có bao nhiêu cách? (bậc 1: 1 cách, bậc 2: 2 cách)`,
        v,
        'Mỗi bậc bằng tổng hai bậc ngay trước: 1, 2, 3, 5, 8, 13, 21 ...',
      ),
      code,
      [String(v)],
    );
  },
  flip: () => {
    const k = randRange(1, 4);
    const a = stairs(k + 2, [1, 2]);
    const b = stairs(k + 1, [1, 2]);
    return tNum(
      `Mỗi lần bước 1 hoặc 2 bậc. Lên bậc ${k + 2} có ${a} cách, lên bậc ${k + 1} có ${b} cách. Lên bậc ${k} có bao nhiêu cách?`,
      a - b,
      `cách(${k + 2}) = cách(${k + 1}) + cách(${k}), nên cách(${k}) = ${a} - ${b} = ${a - b}.`,
    );
  },
  new: variantOf([
    () => {
      const n = randRange(4, 7);
      const v = stairs(n, [1, 3]);
      const c = `def dem(n):\n    if n < 0:\n        return 0\n    if n == 0:\n        return 1\n    return dem(n - 1) + dem(n - 3)\nprint(dem(${n}))`;
      return aPy(
        tNum(
          `Lần này mỗi bước đi 1 hoặc 3 bậc (không còn 2). Lên bậc ${n} có bao nhiêu cách? Hãy tự nghĩ: bước cuối cùng đến từ những bậc nào?`,
          v,
          `cách(n) = cách(n - 1) + cách(n - 3), tính từ cách(0) = 1 lên dần: kết quả ${v}.`,
        ),
        c,
        [String(v)],
      );
    },
    () => {
      const n = randRange(3, 8);
      const v = stairs(n, [1, 2]);
      return tNum(
        `Xếp một dải dài ${n} ô bằng các viên gạch dài 1 ô và dài 2 ô (xếp liền nhau, không chồng). Có bao nhiêu cách xếp khác nhau?`,
        v,
        `Viên gạch cuối là dài 1 (còn ${n - 1} ô) hoặc dài 2 (còn ${n - 2} ô): cùng công thức với leo cầu thang, kết quả ${v}.`,
      );
    },
  ]),
  verdict: variantOf([
    kv(
      "Hà nói: 'cách(n) = cách(n - 1) x cách(n - 2)'. Hà nói đúng hay sai?",
      "Hà nói: 'cách(n) = cách(n - 1) + cách(n - 2)'. Hà nói đúng hay sai?",
      'Bước cuối là một trong hai khả năng khác nhau, các cách cộng lại',
      'Hai khả năng nhân với nhau',
      'Chỉ có một khả năng',
      'Sai: hai nhóm cách khác nhau thì cộng, không nhân.',
    ),
    kv(
      "Nam nói: 'mỗi khi cần dp[i] phải tính lại từ đầu mọi ô trước'. Nam nói đúng hay sai?",
      "Nam nói: 'dp[i] chỉ cần đọc lại hai ô trước đã được tính sẵn'. Nam nói đúng hay sai?",
      'Các ô trước đã nằm sẵn trong bảng',
      'Phải tính lại từ đầu',
      'Bảng không lưu gì',
      'Sai: bảng lưu kết quả để khỏi tính lại.',
    ),
  ]),
  read: variantOf([
    () => {
      const k = randRange(1, 4);
      const w = [1, 2, 3, 5, 8];
      return aNum(
        `dp = [${w.join(', ')}] là bảng số cách leo cầu thang, dp[0] ứng với BẬC 1. Đọc kỹ: dp[${k}] là số cách lên bậc mấy?`,
        k + 1,
        `dp[0] là bậc 1 nên dp[${k}] là bậc ${k + 1}. Chỉ số lệch một so với số bậc.`,
        [k, k + 2],
      );
    },
    () => {
      const n = randRange(3, 6);
      const w: number[] = [1, 1];
      for (let i = 2; i <= n; i++) w.push(at(w, i - 1) + at(w, i - 2));
      const v = at(w, n);
      const c = `dp = [1, 1]\nfor i in range(2, ${n + 1}):\n    dp.append(dp[i - 1] + dp[i - 2])\nprint(dp[${n}])`;
      const lesson = stairs(n + 1, [1, 2]);
      return aPy(
        aNum(
          `${pre(c)}Nhìn giống bảng leo cầu thang nhưng đọc kỹ giá trị khởi đầu. In ra mấy?`,
          v,
          `Khởi đầu [1, 1] cho ra 1, 1, 2, 3, 5, ...: dp[${n}] = ${v}.`,
          [lesson, v + 1],
        ),
        c,
        [String(v)],
      );
    },
  ]),
};

export const dpBanks: Record<string, ProbeBank> = { dp1, dp2 };
