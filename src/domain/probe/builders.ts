// Helpers dùng chung cho mọi ngân hàng câu hỏi probe.
// Port từ probe.js / probe-foundation.js / probe-adv.js / probe-extra.js (nhánh main).
// Quy ước: không any/unknown/!, mọi truy cập chỉ số mảng qua at().

import type { ProbeGenerator, ProbeQuestion } from '../types';

/** Số nguyên ngẫu nhiên 1..n (port của R) */
export function rand1(n: number): number {
  return 1 + Math.floor(Math.random() * n);
}

/** Số nguyên ngẫu nhiên lo..hi (port của fR) */
export function randRange(lo: number, hi: number): number {
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

/** Xáo trộn mảng, trả về mảng mới (port của pShuf) */
export function shuffled<T>(arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = at(a, i);
    a[i] = at(a, j);
    a[j] = t;
  }
  return a;
}

/** n số nguyên phân biệt trong 1..m, đã xáo (port của pDistinct) */
export function distinct(n: number, m: number): number[] {
  return shuffled(Array.from({ length: m }, (_, i) => i + 1)).slice(0, n);
}

/**
 * Lấy phần tử theo chỉ số; throw nếu ngoài biên.
 * Dùng cho mọi chỗ code cũ viết a[i] — các invariant nội bộ đảm bảo chỉ số hợp lệ,
 * throw ở đây là fail-fast thay vì lan truyền undefined/NaN lặng lẽ.
 */
export function at<T>(arr: readonly T[], i: number): T {
  const v = arr[i];
  if (v === undefined) throw new Error(`at: chỉ số ${i} ngoài biên`);
  return v;
}

/** ["Đúng", "Sai"] (port của pYN) */
export const YN: string[] = ['Đúng', 'Sai'];

/** Bọc code Python trong thẻ <pre> (port của fPre) */
export function pre(code: string): string {
  return `<pre>${code}</pre>`;
}

/** JSON.stringify — dùng trong template đề bài (port của pJ) */
export const pJ = JSON.stringify;

/** Câu hỏi tự luận số (port của fT) */
export function tNum(q: string, a: number, w: string): ProbeQuestion {
  return { q, a, w };
}

/** Câu hỏi trắc nghiệm, đáp án đúng ở o[0] (port của fC) */
export function tChoice(q: string, o: string[], w: string): ProbeQuestion {
  return { q, o, a: 0, w };
}

/** Câu hỏi phụ "Vì sao?" cho dạng verdict */
export interface WhyFollowup {
  q: string;
  o: string[];
  a: number;
}

export function why(a: string, b: string, c: string): WhyFollowup {
  return { q: 'Vì sao?', o: [a, b, c], a: 0 };
}

/** Câu verdict có đính kèm why (structural subtype của ProbeQuestion) */
export interface VerdictQuestion extends ProbeQuestion {
  why: WhyFollowup;
}

/** Verdict: mệnh đề đúng/sai ngẫu nhiên (port của fV) */
export function verdictFalse(
  f: string,
  t: string,
  rf: string,
  rt: string,
  d1: string,
  d2: string,
  wf: string,
  wt: string,
): () => VerdictQuestion {
  return () =>
    Math.random() < 0.5
      ? { q: t, o: YN, a: 0, w: wt, why: why(rt, d1, d2) }
      : { q: f, o: YN, a: 1, w: wf, why: why(rf, d1, d2) };
}

/** Verdict luôn là mệnh đề ĐÚNG (port của fVT) */
export function verdictTrue(
  t: string,
  rt: string,
  d1: string,
  d2: string,
  wt: string,
): () => VerdictQuestion {
  return () => ({ q: t, o: YN, a: 0, w: wt, why: why(rt, d1, d2) });
}

/** Verdict với nhánh đúng cố định "Đúng." (port của KV) */
export function kv(
  f: string,
  t: string,
  rf: string,
  d1: string,
  d2: string,
  wf: string,
): () => VerdictQuestion {
  return verdictFalse(f, t, rf, rf, d1, d2, wf, 'Đúng.');
}

/** Chọn ngẫu nhiên một phần tử (port của aPick) */
export function aPick<T>(arr: readonly T[]): T {
  return at(arr, Math.floor(Math.random() * arr.length));
}

/** Metadata kiểm chứng Python gắn vào câu hỏi (chỉ dùng cho test/dev) */
export interface PyMeta {
  code: string;
  out: string[];
  err: string;
}

export interface PyCheckedQuestion extends ProbeQuestion {
  _py: PyMeta;
}

/** Gắn metadata _py vào câu hỏi (port của aPy) */
export function aPy(q: ProbeQuestion, code: string, out: string[] = [], err = ''): PyCheckedQuestion {
  return { ...q, _py: { code, out, err } };
}

/** Trắc nghiệm số: đáp án đúng + đáp án nhiễu (port của aNum) */
export function aNum(q: string, right: number, w: string, wr?: number[]): ProbeQuestion {
  const o: string[] = [String(right)];
  const cands = (wr ?? []).concat([right + 1, right - 1, right + 2, right - 2, right * 2]);
  for (const x of cands) {
    if (o.length >= 3) break;
    if (x >= 0 && !o.includes(String(x))) o.push(String(x));
  }
  return tChoice(q, o, w);
}

/** Như aNum nhưng cho phép đáp án âm và 0 (port của aInt) */
export function aInt(q: string, right: number, w: string, wr?: number[]): ProbeQuestion {
  const o: string[] = [String(right)];
  const cands = (wr ?? []).concat([right - 1, right + 1, right - 2, right + 2, 0]);
  for (const x of cands) {
    if (o.length >= 3) break;
    if (!o.includes(String(x))) o.push(String(x));
  }
  return tChoice(q, o, w);
}

/** Trắc nghiệm chuỗi: đáp án đúng + 2 nhiễu từ pool (port của aStr) */
export function aStr(q: string, right: string, pool: string[], w: string): ProbeQuestion {
  return tChoice(q, [right, ...shuffled(pool.filter((x) => x !== right)).slice(0, 2)], w);
}

export interface SynCheckedQuestion extends ProbeQuestion {
  _syn: Array<[string, boolean]>;
}

/** Gắn metadata kiểm tra cú pháp [[code, đúng?]] (port của zSyn) */
export function zSyn(q: ProbeQuestion, arr: Array<[string, boolean]>): SynCheckedQuestion {
  return { ...q, _syn: arr };
}

/** Đặt đáp án đúng lên đầu, còn lại giữ nguyên thứ tự lọc (port của others) */
export function others(all: string[], right: string): string[] {
  return [right, ...all.filter((x) => x !== right)];
}

/** Mô phỏng một lượt nổi bọt (port của bubPass) */
export function bubPass(a: number[]): number[] {
  const r = a.slice();
  for (let i = 0; i < r.length - 1; i++) {
    if (at(r, i) > at(r, i + 1)) {
      const t = at(r, i);
      r[i] = at(r, i + 1);
      r[i + 1] = t;
    }
  }
  return r;
}

/** Sắp xếp tăng dần, trả mảng mới (port của xSort) */
export function xSort(a: number[]): number[] {
  return a.slice().sort((x, y) => x - y);
}

/** Mảng n số ngẫu nhiên lo..hi (port của xArr) */
export function xArr(n: number, lo: number, hi: number): number[] {
  return Array.from({ length: n }, () => randRange(lo, hi));
}

/** Bí danh của distinct (port của pD) */
export const pD = distinct;

/** 3 số phân biệt 1..9 (port của P3) */
export function distinct3(): number[] {
  return distinct(3, 9);
}

/**
 * Gộp nhiều generator thành một: mỗi lần gọi chọn ngẫu nhiên một biến thể,
 * không lặp lại biến thể vừa dùng ngay (port của bank(id, shape, extra)).
 */
export function variantOf(gens: ProbeGenerator[]): ProbeGenerator {
  if (gens.length === 0) throw new Error('variantOf: cần ít nhất một generator');
  let last = -1;
  return () => {
    let k = Math.floor(Math.random() * gens.length);
    while (gens.length > 1 && k === last) {
      k = Math.floor(Math.random() * gens.length);
    }
    last = k;
    return at(gens, k)();
  };
}

/** Câu hỏi số có code Python đính kèm để kiểm chứng (port của num trong probe-code.js) */
export function num(src: string, body: string, a: number, w: string, lead?: string): PyCheckedQuestion {
  const c = src + body;
  return aPy(tNum(`${pre(c)}${lead ?? 'In ra mấy?'}`, a, w), c, [String(a)]);
}

/** Câu hỏi trắc nghiệm có code Python đính kèm (port của opt trong probe-code.js) */
export function opt(
  src: string,
  body: string,
  right: string,
  wrongs: string[],
  out: string[],
  err: string,
  w: string,
  lead?: string,
): PyCheckedQuestion {
  const c = src + body;
  return aPy(
    tChoice(`${pre(c)}${lead ?? 'Chạy đoạn code trên thì điều gì xảy ra?'}`, [right, ...wrongs], w),
    c,
    out,
    err,
  );
}

/**
 * Code Python tham khảo của các bài w (mirror của lesson registry).
 * Nguồn verbatim: main:app.js các lệnh mk("w1"...), mk("w2"...), mk("w3"...),
 * mk("w7"...), mk("w8"...). Khi registry bài học hoàn thiện, nên đọc từ đó thay vì mirror ở đây.
 */
export const LESSON_REFS: Record<string, string> = {
  w1: `def find_max(nums):\n    if not isinstance(nums, list):\n        raise TypeError("nums phai la list")\n    if len(nums) == 0:\n        raise ValueError("list rong")\n    best = nums[0]\n    for x in nums:\n        if x > best:\n            best = x\n    return best\n`,
  w2: `def linear_search(nums, target):\n    if not isinstance(nums, list):\n        raise TypeError("nums phai la list")\n    for i in range(len(nums)):\n        if nums[i] == target:\n            return i\n    return -1\n`,
  w3: `def second_max(nums):\n    if not isinstance(nums, list):\n        raise TypeError("nums phai la list")\n    uniq = set(nums)\n    if len(uniq) < 2:\n        raise ValueError("can it nhat 2 gia tri khac nhau")\n    uniq.remove(max(uniq))\n    return max(uniq)\n`,
  w7: `def has_duplicate(nums):\n    if not isinstance(nums, list):\n        raise TypeError("nums phai la list")\n    seen = set()\n    for x in nums:\n        if x in seen:\n            return True\n        seen.add(x)\n    return False\n`,
  w8: `def factorial(n):\n    if not isinstance(n, int):\n        raise TypeError("n phai la so nguyen")\n    if n < 0:\n        raise ValueError("n khong am")\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n`,
};
