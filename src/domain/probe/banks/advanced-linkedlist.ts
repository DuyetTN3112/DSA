// Ngân hàng probe linked list (n1-n3): port verbatim từ main:probe-adv.js.
// Mỗi bank gồm 5 dạng same/flip/new/verdict/read; 3 dạng sau gộp bằng variantOf
// (port của bank("n1","new"|"verdict"|"read", [...]) cộng thêm vào PRB.n1...).
// Quy ước: không any/unknown/!, mọi chỉ số mảng qua at().

import type { ProbeBank } from '../../types';
import { aNum, aPy, aStr, at, distinct, kv, pre, randRange, tChoice, tNum, variantOf } from '../builders';

const ANUT = 'class Nut:\n    def __init__(self, v):\n        self.v = v\n        self.next = None\n';

/** Dựng chuỗi a/b/c... nối next thành một hàng (mỗi nút một dòng) */
function nChain(vals: number[]): string {
  const nm = ['a', 'b', 'c', 'd', 'e'].slice(0, vals.length);
  return (
    nm.map((x, i) => `${x} = Nut(${at(vals, i)})`).join('\n') +
    '\n' +
    nm
      .slice(0, -1)
      .map((x, i) => `${x}.next = ${at(nm, i + 1)}`)
      .join('\n') +
    '\n'
  );
}

/** Biểu thức a.next...next.v với k mũi tên */
function nExpr(k: number): string {
  return 'a' + '.next'.repeat(k) + '.v';
}

const nLoop = 'cur = a\nwhile cur is not None:\n    print(cur.v)\n    cur = cur.next';

/** Dựng chuỗi a/b/c... nối next thành một hàng (gọn, dùng dấu ;) */
function nLine(vals: number[]): string {
  const nm = ['a', 'b', 'c', 'd', 'e'].slice(0, vals.length);
  return (
    nm.map((x, i) => `${x} = Nut(${at(vals, i)})`).join('; ') +
    '\n' +
    nm
      .slice(0, -1)
      .map((x, i) => `${x}.next = ${at(nm, i + 1)}`)
      .join('; ') +
    '\n'
  );
}

/** 3 số phân biệt 1..9 dưới dạng tuple (tránh noUncheckedIndexedAccess khi destructure) */
function d3(): [number, number, number] {
  const d = distinct(3, 9);
  return [at(d, 0), at(d, 1), at(d, 2)];
}

const n1NewExtra = () => {
  const k = randRange(4, 9);
  return tNum(
    `Một hàng người xếp liền nhau, mỗi người chỉ biết người đứng ngay sau mình. Muốn tới người thứ ${k} (người đầu tiên là thứ 1) bắt đầu từ người đầu, cần đi qua mấy lần .next?`,
    k - 1,
    `Người thứ 1 đã ở sẵn, mỗi bước .next tiến thêm một người: ${k - 1} bước.`,
  );
};
const n1VerdictExtra = kv(
  "Nam nói: 'nút cuối của linked list có next trỏ về nút đầu tiên'. Nam nói đúng hay sai?",
  "Nam nói: 'nút cuối của linked list có next là None'. Nam nói đúng hay sai?",
  'None đánh dấu không còn nút nào phía sau',
  'Nút cuối trỏ về đầu',
  'next của nút cuối là 0',
  'Sai: nút cuối có next là None.',
);
const n1ReadExtra = () => {
  const v = distinct(3, 9);
  const c = ANUT + nChain(v) + 'print(c.next.v)';
  return aPy(
    tChoice(`${pre(c)}Đọc kỹ dòng print. Chuyện gì xảy ra?`, ['Báo lỗi AttributeError, vì c.next là None nên không có .v', String(at(v, 0)), String(at(v, 1))], 'c là nút cuối, c.next là None. None không có thuộc tính v.'),
    c,
    [],
    'AttributeError',
  );
};

const n1: ProbeBank = {
  same: () => {
    const v = distinct(3, 9);
    const k = randRange(0, 2);
    const c = ANUT + nChain(v) + `print(${nExpr(k)})`;
    return aPy(tNum(`${pre(c)}In ra số mấy?`, at(v, k), `${nExpr(k)}: đi theo mũi tên ${k} lần từ a, lấy .v của nút đó = ${at(v, k)}.`), c, [String(at(v, k))]);
  },
  flip: () => {
    const v = distinct(3, 9);
    const t = randRange(0, 2);
    const c = ANUT + nChain(v);
    return aPy(
      aStr(`${pre(c)}Muốn in ra số ${at(v, t)}, dùng print của biểu thức nào?`, nExpr(t), [nExpr(0), nExpr(1), nExpr(2)], `Số ${at(v, t)} nằm ở nút cách a ${t} mũi tên: ${nExpr(t)}.`),
      c + `print(${nExpr(t)})`,
      [String(at(v, t))],
    );
  },
  new: variantOf([
    () => {
      const v = distinct(4, 9);
      const k = randRange(2, 3);
      const c = ANUT + nChain(v) + `print(${nExpr(k)})`;
      return aPy(tNum(`${pre(c)}Bốn toa tàu nối nhau. In ra số mấy?`, at(v, k), `Đi ${k} mũi tên từ a: ${at(v, k)}.`), c, [String(at(v, k))]);
    },
    n1NewExtra,
  ]),
  verdict: variantOf([
    kv(
      "Hà nói: 'từ nút đầu có thể nhảy thẳng tới nút thứ 100 trong một bước, giống nums[99]'. Hà nói đúng hay sai?",
      "Hà nói: 'muốn tới nút thứ 100 phải đi theo từng mũi tên next, từng nút một'. Hà nói đúng hay sai?",
      'Mỗi nút chỉ biết nút kế tiếp của nó',
      'Linked list có chỉ số như mảng',
      'Có một bảng tra vị trí',
      'Sai: không có chỉ số, phải đi từng nút.',
    ),
    n1VerdictExtra,
  ]),
  read: variantOf([
    () => {
      const v = distinct(3, 9);
      const c = ANUT + `a = Nut(${at(v, 0)}); b = Nut(${at(v, 1)}); c = Nut(${at(v, 2)})\na.next = c\nb.next = c\nprint(a.next.v)`;
      return aPy(
        aNum(`${pre(c)}Đọc kỹ các dòng nối. In ra số mấy?`, at(v, 2), `a.next được nối thẳng tới c (bỏ qua b), nên a.next.v = ${at(v, 2)}.`, [at(v, 1), at(v, 0)]),
        c,
        [String(at(v, 2))],
      );
    },
    n1ReadExtra,
  ]),
};

const n2NewExtra = () => {
  const m = randRange(4, 5);
  const v = Array.from({ length: m }, () => randRange(1, 9));
  const t = randRange(3, 6);
  const cnt = v.filter((x) => x > t).length;
  const c = ANUT + nLine(v) + `n = 0\ncur = a\nwhile cur is not None:\n    if cur.v > ${t}:\n        n += 1\n    cur = cur.next\nprint(n)`;
  return aPy(tNum(`${pre(c)}In ra mấy?`, cnt, `Giá trị: ${v.join(', ')}. Có ${cnt} giá trị lớn hơn ${t}.`), c, [String(cnt)]);
};
const n2VerdictExtra = kv(
  "Nam nói: 'duyệt hết linked list n nút chỉ mất một bước'. Nam nói đúng hay sai?",
  "Nam nói: 'duyệt hết linked list n nút cần n bước, tức O(n)'. Nam nói đúng hay sai?",
  'Mỗi nút cần một bước nhảy',
  'Chỉ cần nhảy tới nút cuối',
  'Số bước là n bình phương',
  'Sai: mỗi nút một bước, tổng n bước.',
);
const n2ReadExtra = () => {
  const m = randRange(3, 5);
  const v = distinct(m, 9);
  const c = ANUT + nLine(v) + 'cur = a.next\nwhile cur is not None:\n    print(cur.v)\n    cur = cur.next';
  return aPy(
    aNum(`${pre(c)}Đọc kỹ dòng cur = ... đầu tiên. Dòng ĐẦU TIÊN in ra số mấy?`, at(v, 1), `Vòng bắt đầu từ a.next, tức nút thứ hai: ${at(v, 1)}.`, [at(v, 0), at(v, 2)]),
    c,
    v.slice(1).map(String),
  );
};

const n2: ProbeBank = {
  same: () => {
    const m = randRange(3, 5);
    const v = distinct(m, 9);
    const k = randRange(1, m);
    const c = ANUT + nLine(v) + nLoop;
    return aPy(tNum(`${pre(c)}Dòng thứ ${k} in ra số mấy?`, at(v, k - 1), `In lần lượt ${v.join(', ')}.`), c, v.map(String));
  },
  flip: () => {
    const v = distinct(3, 9);
    const s = at(v, 0) + at(v, 1) + at(v, 2);
    return tNum(
      `Danh sách có 3 nút, giá trị lần lượt ${at(v, 0)}, ${at(v, 1)} và một nút cuối chưa biết. Vòng while cộng dồn giá trị mọi nút vào s rồi in ra ${s}. Nút cuối có giá trị mấy?`,
      at(v, 2),
      `${s} - ${at(v, 0)} - ${at(v, 1)} = ${at(v, 2)}.`,
    );
  },
  new: variantOf([
    () => {
      const m = randRange(3, 5);
      const v = distinct(m, 9);
      const c = ANUT + nLine(v) + 'n = 0\ncur = a\nwhile cur is not None:\n    n += 1\n    cur = cur.next\nprint(n)';
      return aPy(tNum(`${pre(c)}In ra mấy?`, m, `Mỗi nút cộng 1 vào n: ${m} nút.`), c, [String(m)]);
    },
    n2NewExtra,
  ]),
  verdict: variantOf([
    kv(
      "Hà nói: 'vòng while duyệt linked list phải biết trước danh sách dài bao nhiêu'. Hà nói đúng hay sai?",
      "Hà nói: 'vòng while duyệt linked list tự dừng khi cur trở thành None'. Hà nói đúng hay sai?",
      'Sau nút cuối cur trở thành None',
      'Phải đếm trước độ dài',
      'Vòng while dừng sau 10 vòng',
      'Sai: dừng nhờ None, không cần biết trước độ dài.',
    ),
    n2VerdictExtra,
  ]),
  read: variantOf([
    () => {
      const m = randRange(3, 5);
      const v = distinct(m, 9);
      const c = ANUT + nLine(v) + 'cur = a\nwhile cur.next is not None:\n    print(cur.v)\n    cur = cur.next';
      return aPy(
        aNum(`${pre(c)}Nhìn giống vòng duyệt đã học. Đọc kỹ điều kiện while: có bao nhiêu dòng được in?`, m - 1, `Khi cur ở nút cuối, cur.next là None nên vòng dừng TRƯỚC khi in nút cuối: ${m - 1} dòng.`, [m, m + 1]),
        c,
        v.slice(0, -1).map(String),
      );
    },
    n2ReadExtra,
  ]),
};

const n3NewExtra = () => {
  const n = randRange(5, 9);
  return aNum(`Một mảng có ${n} phần tử. Chèn một số mới vào ĐẦU mảng thì phải dịch bao nhiêu phần tử sang phải một ô?`, n, `Mọi phần tử đều phải dịch: ${n}. Với linked list chỉ đổi hai mũi tên.`, [1, 2]);
};
const n3VerdictExtra = kv(
  "Nam nói: 'chèn vào đầu linked list 1 triệu nút phải đi qua cả triệu nút'. Nam nói đúng hay sai?",
  "Nam nói: 'chèn vào đầu linked list chỉ đổi hai mũi tên, không phụ thuộc độ dài'. Nam nói đúng hay sai?",
  'Không cần đi qua các nút phía sau',
  'Phải đi hết danh sách',
  'Chèn đầu là O(n)',
  'Sai: chèn đầu là O(1).',
);
const n3ReadExtra = () => {
  const [x, y, z] = d3();
  const c = ANUT + `a = Nut(${x}); b = Nut(${y})\na.next = b\nhead = a\nnew = Nut(${z})\nb.next = new\nprint(head.next.next.v)`;
  return aPy(aNum(`${pre(c)}Nút mới được gắn vào đâu? In ra số mấy?`, z, `new được gắn SAU b (cuối danh sách), không phải đầu: ${x}, ${y}, ${z}.`, [y, x]), c, [String(z)]);
};

const n3: ProbeBank = {
  same: () => {
    const [x, y, z] = d3();
    const k = randRange(1, 2);
    const e = k === 1 ? 'head.next.v' : 'head.next.next.v';
    const c = ANUT + `a = Nut(${x}); b = Nut(${y})\na.next = b\nhead = a\nnew = Nut(${z})\nnew.next = head\nhead = new\nprint(${e})`;
    const r = k === 1 ? x : y;
    return aPy(tNum(`${pre(c)}In ra số mấy?`, r, `Sau khi chèn, thứ tự là ${z}, ${x}, ${y}. ${e} = ${r}.`), c, [String(r)]);
  },
  flip: () => {
    const [x, y, z] = d3();
    return tNum(`Sau khi chèn một nút vào đầu danh sách, vòng duyệt in ra ${z}, ${x}, ${y} (3 dòng). Trước khi chèn, nút đầu tiên của danh sách có giá trị mấy?`, x, `Nút mới là ${z} (đứng đầu), nên danh sách cũ là ${x}, ${y}, và nó bắt đầu bằng ${x}.`);
  },
  new: variantOf([
    () => {
      const [x, p, q] = d3();
      const k = randRange(1, 2);
      const e = k === 1 ? 'head.next.v' : 'head.next.next.v';
      const c = ANUT + `a = Nut(${x})\nhead = a\nn1 = Nut(${p})\nn1.next = head\nhead = n1\nn2 = Nut(${q})\nn2.next = head\nhead = n2\nprint(${e})`;
      const r = k === 1 ? p : x;
      return aPy(tNum(`${pre(c)}Chèn vào đầu hai lần. In ra số mấy?`, r, `Thứ tự cuối cùng: ${q}, ${p}, ${x}. ${e} = ${r}.`), c, [String(r)]);
    },
    n3NewExtra,
  ]),
  verdict: variantOf([
    kv(
      "Hà nói: 'viết head = new trước rồi new.next = head vẫn nối đúng vào nút cũ'. Hà nói đúng hay sai?",
      "Hà nói: 'phải viết new.next = head trước, rồi mới đổi head = new'. Hà nói đúng hay sai?",
      'Đổi head trước thì mất đường tới nút cũ',
      'Thứ tự hai dòng không quan trọng',
      'Python tự sắp xếp lại',
      'Sai: đổi head trước làm mất nút cũ.',
    ),
    n3VerdictExtra,
  ]),
  read: variantOf([
    () => {
      const [x, y, z] = d3();
      const c = ANUT + `a = Nut(${x}); b = Nut(${y})\na.next = b\nhead = a\nnew = Nut(${z})\nnew.next = head\nprint(head.v)`;
      return aPy(aNum(`${pre(c)}Đọc kỹ từng dòng, đừng đoán theo ý định. In ra số mấy?`, x, `Dòng head = new bị thiếu, nên head vẫn là nút a: ${x}. ${z} chưa phải đầu danh sách.`, [z, y]), c, [String(x)]);
    },
    n3ReadExtra,
  ]),
};

/** Ngân hàng probe linked list: n1 (nút kế tiếp), n2 (đi dọc), n3 (chèn đầu). */
export const linkedlistBanks: Record<string, ProbeBank> = { n1, n2, n3 };
