// Ngân hàng probe đệ quy (r1-r3): port verbatim từ main:probe-adv.js.
// Mỗi bank gồm 5 dạng same/flip/new/verdict/read; 3 dạng sau gộp bằng variantOf
// (port của bank("r1","new"|"verdict"|"read", [...]) cộng thêm vào PRB.r1...).
// Quy ước: không any/unknown/!, mọi chỉ số mảng qua at().

import type { ProbeBank } from '../../types';
import { aNum, aPick, aPy, at, kv, pre, randRange, tNum, variantOf } from '../builders';

const DEM = "def dem(n):\n    if n == 0:\n        return 0\n    return n + dem(n - 1)\n";
const DD = "def dd(n):\n    if n == 0:\n        print(\"xong\")\n        return\n    print(n)\n    dd(n - 1)\n";
const EE = "def e(n):\n    if n == 0:\n        return\n    e(n - 1)\n    print(n)\n";

/** Helper giữ nguyên từ probe-adv.js: trả về code gốc (tham số fnCall gốc không dùng tới). */
function aDepth(code: string): string {
  return code;
}

const r1NewExtra = () => {
  const n = randRange(2, 5);
  const c = `def luy(n):\n    if n == 0:\n        return 1\n    return 2 * luy(n - 1)\nprint(luy(${n}))`;
  return aPy(tNum(`${pre(c)}In ra mấy? (chú ý ca cơ sở trả về mấy)`, 2 ** n, `luy(0) = 1, mỗi tầng nhân 2: 2^${n} = ${2 ** n}.`), c, [String(2 ** n)]);
};
const r1VerdictExtra = kv(
  "Nam nói: 'dem(3) không cần biết dem(2), nó tự tính được một mình'. Nam nói đúng hay sai?",
  "Nam nói: 'muốn có dem(3) thì phải có dem(2) trước'. Nam nói đúng hay sai?",
  'dem(3) được xây từ kết quả của bài nhỏ hơn',
  'Mỗi lần gọi độc lập hoàn toàn',
  'dem(3) bằng dem(2)',
  'Sai: dem(3) = 3 + dem(2).',
);
const r1ReadExtra = () => {
  const n = randRange(2, 5);
  const t = (n * (n + 1)) / 2;
  const c = `def dem(n):\n    if n == 0:\n        return 1\n    return n + dem(n - 1)\nprint(dem(${n}))`;
  return aPy(
    aNum(`${pre(c)}Nhìn giống dem đã học nhưng đọc kỹ: in ra mấy?`, t + 1, `Ca cơ sở đổi thành return 1, nên kết quả hơn bài cũ 1: ${t + 1}.`, [t, t + 2]),
    c,
    [String(t + 1)],
  );
};

const r1: ProbeBank = {
  same: () => {
    const n = randRange(2, 6);
    const t = (n * (n + 1)) / 2;
    const c = DEM + `print(dem(${n}))`;
    return aPy(tNum(`${pre(c)}In ra mấy?`, t, `dem(${n}) = ${n} + dem(${n - 1}) = ... cộng từ 1 đến ${n}.`), c, [String(t)]);
  },
  flip: () => {
    const n = randRange(2, 6);
    const t = (n * (n + 1)) / 2;
    return tNum(`Với dem(n) = n + dem(n - 1) và dem(0) = 0, biết dem(?) = ${t}. Dấu ? là mấy?`, n, `dem(1)=1, dem(2)=3, dem(3)=6, ... dem(${n})=${t}.`);
  },
  new: variantOf([
    () => {
      const n = randRange(2, 6);
      const c = `def gap(n):\n    if n == 0:\n        return 0\n    return 2 + gap(n - 1)\nprint(gap(${n}))`;
      return aPy(tNum(`${pre(c)}In ra mấy?`, 2 * n, `Mỗi tầng cộng 2, có ${n} tầng, gốc là 0: ${2 * n}.`), c, [String(2 * n)]);
    },
    r1NewExtra,
  ]),
  verdict: variantOf([
    kv(
      "Hà nói: 'hàm đệ quy cứ gọi lại chính nó với đúng cùng n thì sẽ giải được dần'. Hà nói đúng hay sai?",
      "Hà nói: 'mỗi lần gọi đệ quy bài toán phải nhỏ đi một chút để cuối cùng chạm ca cơ sở'. Hà nói đúng hay sai?",
      'Bài phải nhỏ dần để chạm được ca cơ sở',
      'Bài càng lớn dần càng tốt',
      'Không cần quan tâm n',
      'Sai: không nhỏ đi thì không bao giờ tới ca cơ sở.',
    ),
    r1VerdictExtra,
  ]),
  read: variantOf([
    () => {
      const n = randRange(3, 6);
      const t = (n * (n + 1)) / 2;
      return aNum(
        `${pre(DEM)}Đề hỏi: khi gọi dem(${n}), hàm dem được GỌI tổng cộng bao nhiêu lần (kể cả lần đầu)? Đề KHÔNG hỏi giá trị trả về.`,
        n + 1,
        `Đếm số lần gọi: dem(${n}) xuống dem(0) là ${n + 1} lần. ${t} là giá trị trả về, không phải số lần gọi.`,
        [t, n],
      );
    },
    r1ReadExtra,
  ]),
};

const r2NewExtra = () => {
  const n = randRange(2, 3);
  const k = randRange(1, 2 * n);
  const seq: number[] = [];
  const s = (m: number): void => {
    if (m === 0) return;
    seq.push(m);
    s(m - 1);
    seq.push(m);
  };
  s(n);
  const c = `def s(n):\n    if n == 0:\n        return\n    print(n)\n    s(n - 1)\n    print(n)\ns(${n})`;
  return aPy(
    tNum(`${pre(c)}Dòng thứ ${k} in ra số mấy?`, at(seq, k - 1), `Thứ tự: ${seq.join(', ')}. Đi xuống in một lần, quay về in thêm một lần.`),
    c,
    seq.map(String),
  );
};
const r2VerdictExtra = kv(
  "Hà nói: 'hàm đệ quy thiếu ca cơ sở vẫn tự dừng bình thường'. Hà nói đúng hay sai?",
  "Hà nói: 'hàm đệ quy thiếu ca cơ sở sẽ gọi mãi và Python báo RecursionError'. Hà nói đúng hay sai?",
  'Không có điểm dừng thì không gì ngăn việc gọi tiếp',
  'Python tự biết chỗ dừng',
  'Hàm trả về 0',
  'Sai: thiếu ca cơ sở là lỗi đệ quy phổ biến nhất.',
);
const r2ReadExtra = () => {
  const n = randRange(2, 5);
  const c = DD + `dd(${n})`;
  const out: string[] = [];
  for (let i = n; i >= 1; i--) out.push(String(i));
  out.push('xong');
  return aPy(
    aNum(`${pre(c)}Gọi dd(${n}). Có bao nhiêu DÒNG được in ra màn hình (kể cả dòng "xong")?`, n + 1, `${n} dòng số và 1 dòng "xong" = ${n + 1}.`, [n, n + 2]),
    c,
    out,
  );
};

const r2: ProbeBank = {
  same: () => {
    const n = randRange(3, 6);
    const k = randRange(2, n);
    const c = DD + `dd(${n})`;
    const out: string[] = [];
    for (let i = n; i >= 1; i--) out.push(String(i));
    out.push('xong');
    return aPy(tNum(`${pre(c)}Dòng thứ ${k} in ra số mấy?`, n - k + 1, `In ra ${out.join(', ')}. Dòng ${k} là ${n - k + 1}.`), c, out);
  },
  flip: () => {
    const n = randRange(3, 6);
    return tNum(`${pre(EE)}Gọi e(?) thì màn hình in ra lần lượt 1, 2, ..., ${n} (dòng cuối là ${n}). Dấu ? là mấy?`, n, `e(n) in 1 đến n, dòng cuối là n.`);
  },
  new: variantOf([
    () => {
      const n = randRange(2, 5);
      const c = `def u(n):\n    if n == 0:\n        return\n    u(n - 1)\n    print(n * 10)\nu(${n})`;
      return aPy(
        tNum(`${pre(c)}Dòng CUỐI CÙNG in ra số mấy?`, n * 10, `print nằm sau lời gọi, in từ nhỏ đến lớn: 10, 20, ..., ${n * 10}.`),
        c,
        Array.from({ length: n }, (_, i) => String((i + 1) * 10)),
      );
    },
    r2NewExtra,
  ]),
  verdict: variantOf([
    kv(
      "Nam nói: 'print đặt SAU lời gọi đệ quy thì in từ lớn xuống nhỏ'. Nam nói đúng hay sai?",
      "Nam nói: 'print đặt TRƯỚC lời gọi đệ quy in lúc đi xuống, đặt SAU thì in lúc quay về'. Nam nói đúng hay sai?",
      'Print sau lời gọi phải đợi các tầng sâu hơn xong',
      'Print luôn chạy trước',
      'Vị trí print không ảnh hưởng',
      'Sai: print sau lời gọi in lúc quay về, tức từ nhỏ lên lớn.',
    ),
    r2VerdictExtra,
  ]),
  read: variantOf([
    () => {
      const n = randRange(3, 6);
      const c = `def e(n):\n    if n == 0:\n        return\n    print(n)\n    e(n - 1)\ne(${n})`;
      return aPy(
        aNum(`${pre(c)}Nhìn giống hàm e đã học nhưng đọc kỹ code. Dòng ĐẦU TIÊN in ra số mấy?`, n, `Lần này print nằm TRƯỚC lời gọi, nên dòng đầu là ${n}.`, [1, 0]),
        c,
        Array.from({ length: n }, (_, i) => String(n - i)),
      );
    },
    r2ReadExtra,
  ]),
};

const r3NewExtra = () => {
  const m = randRange(3, 7);
  const a = Array.from({ length: m }, () => randRange(1, 9));
  const vis = `def tong(a, i):\n    if i == len(a):\n        return 0\n    return a[i] + tong(a, i + 1)\nprint(tong(${JSON.stringify(a)}, 0))`;
  const c = `d = 0\nbest = 0\ndef tong(a, i):\n    global d, best\n    d += 1\n    best = max(best, d)\n    r = 0 if i == len(a) else a[i] + tong(a, i + 1)\n    d -= 1\n    return r\ntong(${JSON.stringify(a)}, 0)\nprint(best)`;
  return aPy(tNum(`${pre(vis)}Danh sách có ${m} phần tử. Tối đa bao nhiêu tầng gọi tong tồn tại cùng lúc?`, m + 1, `Từ i = 0 đến i = ${m}: ${m + 1} tầng.`), c, [String(m + 1)]);
};
const r3VerdictExtra = kv(
  "Nam nói: 'Python cho phép đệ quy sâu vô hạn'. Nam nói đúng hay sai?",
  "Nam nói: 'Python giới hạn độ sâu đệ quy (mặc định khoảng 1000), vượt thì RecursionError'. Nam nói đúng hay sai?",
  'Mỗi tầng tốn bộ nhớ nên phải có giới hạn',
  'Bộ nhớ vô hạn',
  'Giới hạn là 10',
  'Sai: có giới hạn, khoảng 1000 mặc định.',
);
const r3ReadExtra = () =>
  aPy(
    aNum(`${pre(aDepth(DEM))}Gọi dem(0). Hàm dem được gọi bao nhiêu lần?`, 1, 'Chỉ lần gọi đầu tiên, rồi gặp ca cơ sở và dừng.', [0, 2]),
    'c = 0\ndef dem(n):\n    global c\n    c += 1\n    if n == 0:\n        return 0\n    return n + dem(n - 1)\ndem(0)\nprint(c)',
    ['1'],
  );

const r3: ProbeBank = {
  same: () => {
    const n = randRange(3, 9);
    const c = `c = 0\ndef dem(n):\n    global c\n    c += 1\n    if n == 0:\n        return 0\n    return n + dem(n - 1)\ndem(${n})\nprint(c)`;
    return aPy(tNum(`${pre(DEM)}Gọi dem(${n}). Tổng cộng có bao nhiêu lần gọi hàm dem (kể cả lần đầu)?`, n + 1, `dem(${n}), dem(${n - 1}), ..., dem(0): ${n + 1} lần.`), c, [String(n + 1)]);
  },
  flip: () => {
    const n = randRange(3, 12);
    return tNum(`Gọi dem(?) thì có đúng ${n + 1} tầng gọi chồng nhau (tính cả dem(0)). Dấu ? là mấy?`, n, `n + 1 tầng nên n = ${n}.`);
  },
  new: variantOf([
    () => {
      const n = aPick([4, 6, 8, 10]);
      const cnt = (m: number): number => (m <= 0 ? 1 : 1 + cnt(m - 2));
      const c = `c = 0\ndef ha(n):\n    global c\n    c += 1\n    if n <= 0:\n        return\n    ha(n - 2)\nha(${n})\nprint(c)`;
      const vis = 'def ha(n):\n    if n <= 0:\n        return\n    ha(n - 2)\n';
      return aPy(tNum(`${pre(vis)}Gọi ha(${n}). Tổng cộng có bao nhiêu lần gọi hàm ha (kể cả lần đầu)?`, cnt(n), `${n}, ${n - 2}, ... đến khi n <= 0: ${cnt(n)} lần.`), c, [String(cnt(n))]);
    },
    r3NewExtra,
  ]),
  verdict: variantOf([
    kv(
      "Hà nói: 'đệ quy không tốn thêm bộ nhớ nào so với vòng lặp'. Hà nói đúng hay sai?",
      "Hà nói: 'mỗi lần gọi đệ quy giữ một tầng bộ nhớ cho tới khi quay về'. Hà nói đúng hay sai?",
      'Mỗi lời gọi chưa xong phải được giữ lại',
      'Python xóa ngay mỗi lời gọi',
      'Chỉ tầng đầu tiên được giữ',
      'Sai: dem(n) cần n + 1 tầng cùng lúc.',
    ),
    r3VerdictExtra,
  ]),
  read: variantOf([
    () => {
      const n = randRange(2, 4);
      const c = `d = 0\nbest = 0\ndef k(n):\n    global d, best\n    d += 1\n    best = max(best, d)\n    if n > 0:\n        k(n - 1)\n        k(n - 1)\n    d -= 1\nk(${n})\nprint(best)`;
      const vis = 'def k(n):\n    if n == 0:\n        return\n    k(n - 1)\n    k(n - 1)\n';
      const tot = 2 ** (n + 1) - 1;
      return aPy(
        aNum(`${pre(vis)}Gọi k(${n}). TỐI ĐA bao nhiêu tầng gọi tồn tại CÙNG LÚC? (không hỏi tổng số lần gọi)`, n + 1, `Độ sâu tối đa là ${n + 1}. ${tot} là tổng số lần gọi, một câu hỏi khác.`, [tot, n]),
        c,
        [String(n + 1)],
      );
    },
    r3ReadExtra,
  ]),
};

/** Ngân hàng probe đệ quy: r1 (bài nhỏ hơn), r2 (ca cơ sở), r3 (tầng gọi). */
export const recursionBanks: Record<string, ProbeBank> = { r1, r2, r3 };
