// Ngân hàng probe cây nhị phân (t1-t2): port verbatim từ main:probe-adv.js.
// Mỗi bank gồm 5 dạng same/flip/new/verdict/read; 3 dạng sau gộp bằng variantOf
// (port của bank("t1","new"|"verdict"|"read", [...]) cộng thêm vào PRB.t1...).
// Quy ước: không any/unknown/!, mọi chỉ số mảng qua at().

import type { ProbeBank } from '../../types';
import { aNum, aPick, aPy, aStr, at, distinct, kv, pre, randRange, tChoice, tNum, variantOf } from '../builders';

const ACAY = 'class Cay:\n    def __init__(self, v):\n        self.v = v\n        self.left = None\n        self.right = None\n';

/** Một nút trong cây sinh ngẫu nhiên: v=giá trị, path=đường đi từ gốc, l/r=chỉ số con */
interface TreeNode {
  v: number;
  path: string;
  l: number;
  r: number;
}

/** Cây sinh ngẫu nhiên: danh sách nút + code Python dựng cây */
interface TreeGen {
  nodes: TreeNode[];
  code: string;
}

/** Sinh cây nhị phân ngẫu nhiên có k nút, giá trị phân biệt 1..9 */
function tGen(k: number): TreeGen {
  const vals = distinct(k, 9);
  const nodes: TreeNode[] = [{ v: at(vals, 0), path: 'r', l: -1, r: -1 }];
  const lines: string[] = [`r = Cay(${at(vals, 0)})`];
  for (let i = 1; i < k; i++) {
    const sl: Array<[number, string]> = [];
    nodes.forEach((n, j) => {
      if (n.l < 0) sl.push([j, 'left']);
      if (n.r < 0) sl.push([j, 'right']);
    });
    const [j, sd] = aPick(sl);
    const parent = at(nodes, j);
    const nn: TreeNode = { v: at(vals, i), path: `${parent.path}.${sd}`, l: -1, r: -1 };
    if (sd === 'left') parent.l = i;
    else parent.r = i;
    nodes.push(nn);
    lines.push(`${nn.path} = Cay(${nn.v})`);
  }
  return { nodes, code: ACAY + lines.join('\n') + '\n' };
}

/** Chỉ số của nút có đường đi p trong T.nodes */
function tIdx(T: TreeGen, p: string): number {
  return T.nodes.findIndex((n) => n.path === p);
}

/** Duyệt tiền thứ tự (pre-order) từ nút i */
function tPre(T: TreeGen, i: number): number[] {
  if (i < 0) return [];
  const n = at(T.nodes, i);
  return [n.v, ...tPre(T, n.l), ...tPre(T, n.r)];
}

/** Duyệt hậu thứ tự (post-order) từ nút i */
function tPost(T: TreeGen, i: number): number[] {
  if (i < 0) return [];
  const n = at(T.nodes, i);
  return [...tPost(T, n.l), ...tPost(T, n.r), n.v];
}

/** Chiều cao (số tầng) của cây con gốc tại nút i */
function tH(T: TreeGen, i: number): number {
  if (i < 0) return 0;
  const n = at(T.nodes, i);
  return 1 + Math.max(tH(T, n.l), tH(T, n.r));
}

/** Số lá (nút không có con nào) trong cây */
function tLeaf(T: TreeGen): number {
  return T.nodes.filter((n) => n.l < 0 && n.r < 0).length;
}

const tLeafPy = 'def la(n):\n    if n is None:\n        return 0\n    if n.left is None and n.right is None:\n        return 1\n    return la(n.left) + la(n.right)\n';
const DEMC = 'def dem(nut):\n    if nut is None:\n        return 0\n    return 1 + dem(nut.left) + dem(nut.right)\n';
const PREP = 'def p(nut):\n    if nut is None:\n        return\n    print(nut.v)\n    p(nut.left)\n    p(nut.right)\n';
const POSTP = 'def p(nut):\n    if nut is None:\n        return\n    p(nut.left)\n    p(nut.right)\n    print(nut.v)\n';

const t1NewExtra = () => {
  const T = tGen(randRange(4, 6));
  const c = T.code + tLeafPy + 'print(la(r))';
  return aPy(tNum(`${pre(T.code)}Nút không có con nào là LÁ. Cây trên có bao nhiêu lá?`, tLeaf(T), `Lá là nút có left và right đều None: ${tLeaf(T)} nút.`), c, [String(tLeaf(T))]);
};
const t1VerdictExtra = kv(
  "Nam nói: 'cây và linked list giống hệt nhau, mỗi nút một mũi tên đi ra'. Nam nói đúng hay sai?",
  "Nam nói: 'trong cây nhị phân mỗi nút có thể có tới hai mũi tên đi ra: left và right'. Nam nói đúng hay sai?",
  'Cây nhị phân có thể rẽ trái hoặc phải',
  'Mỗi nút có đúng một mũi tên',
  'Cây không có mũi tên',
  'Sai: cây có thể rẽ nhánh, linked list thì không.',
);
const t1ReadExtra = () => {
  const T = tGen(4);
  const p = aPick(T.nodes.map((n) => n.path).filter((x) => x !== 'r'));
  const n = at(T.nodes, tIdx(T, p));
  const c = T.code + `print(${p}.v)`;
  const others = T.nodes.filter((x) => x.v !== n.v).map((x) => String(x.v));
  return aPy(tChoice(`${pre(T.code)}Đọc kỹ: print(${p}.v) in ra số mấy?`, [String(n.v), ...others.slice(0, 2)], `${p} là nút có giá trị ${n.v}.`), c, [String(n.v)]);
};

const t1: ProbeBank = {
  same: () => {
    const T = tGen(4);
    const p = aPick(T.nodes.map((n) => n.path));
    const n = at(T.nodes, tIdx(T, p));
    const c = T.code + `print(${p}.v)`;
    return aPy(tNum(`${pre(c)}In ra số mấy?`, n.v, `${p} là nút ở đường đi đó, giá trị ${n.v}.`), c, [String(n.v)]);
  },
  flip: () => {
    const T = tGen(4);
    const t = aPick(T.nodes.map((n) => n.path));
    const v = at(T.nodes, tIdx(T, t)).v;
    return aPy(
      aStr(`${pre(T.code)}Muốn in ra số ${v}, dùng print của biểu thức nào?`, `${t}.v`, T.nodes.map((p) => `${p.path}.v`), `Số ${v} nằm ở nút ${t}.`),
      T.code + `print(${t}.v)`,
      [String(v)],
    );
  },
  new: variantOf([
    () => {
      const T = tGen(randRange(5, 6));
      const k = T.nodes.length - 1;
      return tNum(
        `Thư mục gốc r có sẵn. Mỗi dòng "... = Cay(...)" dưới đây thêm đúng một thư mục con.${pre(T.code)}Tổng cộng cây thư mục có bao nhiêu nút (kể cả gốc r)?`,
        k + 1,
        `1 gốc + ${k} dòng thêm = ${k + 1}.`,
      );
    },
    t1NewExtra,
  ]),
  verdict: variantOf([
    kv(
      "Hà nói: 'mọi nút trong cây đều có đúng hai nút con'. Hà nói đúng hay sai?",
      "Hà nói: 'nút không có con gọi là lá, left và right của nó đều là None'. Hà nói đúng hay sai?",
      'Nhiều nút có 0 hoặc 1 con',
      'Mọi nút đều có hai con',
      'Nút lá luôn có hai con',
      'Sai: lá không có con.',
    ),
    t1VerdictExtra,
  ]),
  read: variantOf([
    () => {
      const T = tGen(4);
      const miss = T.nodes
        .map((n) => n.path)
        .flatMap((p) => [`${p}.left`, `${p}.right`])
        .filter((p) => tIdx(T, p) < 0);
      const p = aPick(miss);
      const c = T.code + `print(${p}.v)`;
      return aPy(
        tChoice(`${pre(T.code)}Đọc kỹ cây vừa dựng. Chạy print(${p}.v) thì sao?`, [`Báo lỗi AttributeError, vì ${p} là None`, String(at(T.nodes, 0).v), String(at(T.nodes, 1).v)], `${p} chưa được gán nên là None, None không có .v.`),
        c,
        [],
        'AttributeError',
      );
    },
    t1ReadExtra,
  ]),
};

const t2NewExtra = () => {
  const T = tGen(randRange(3, 6));
  const h = tH(T, 0);
  const c = T.code + 'def cao(nut):\n    if nut is None:\n        return 0\n    return 1 + max(cao(nut.left), cao(nut.right))\nprint(cao(r))';
  return aPy(tNum(`${pre(c)}Hàm cao tính số tầng của cây. In ra mấy?`, h, `Đường dài nhất từ gốc xuống lá có ${h} nút.`), c, [String(h)]);
};
const t2VerdictExtra = kv(
  "Nam nói: 'dem(None) phải trả về số nút của cả cây'. Nam nói đúng hay sai?",
  "Nam nói: 'dem(None) trả về 0 vì cây rỗng không có nút nào'. Nam nói đúng hay sai?",
  'Ca cơ sở: cây rỗng có 0 nút',
  'None là cả cây',
  'dem(None) báo lỗi',
  'Sai: cây rỗng có 0 nút.',
);
const t2ReadExtra = () => {
  const T = tGen(randRange(4, 6));
  const c = T.code + PREP + 'p(r)';
  const out = tPre(T, 0);
  const n = T.nodes.length;
  return aPy(aNum(`${pre(c)}Gọi p(r). Có bao nhiêu dòng được in ra?`, n, `Mỗi nút in đúng một lần; None không in gì: ${n} dòng.`, [n + 1, n - 1]), c, out.map(String));
};

const t2: ProbeBank = {
  same: () => {
    const k = randRange(3, 6);
    const T = tGen(k);
    const c = T.code + DEMC + 'print(dem(r))';
    return aPy(tNum(`${pre(c.replace(/\n$/, ''))}In ra mấy?`, k, `dem đếm mỗi nút một lần: ${k} nút.`), c, [String(k)]);
  },
  flip: () => {
    const a = randRange(2, 5);
    const b = randRange(1, 4);
    return tNum(`Biết dem(r) = 1 + dem(r.left) + dem(r.right). Với một cây có dem(r) = ${a + b + 1} và dem(r.left) = ${a}, thì dem(r.right) bằng mấy?`, b, `${a + b + 1} - 1 - ${a} = ${b}.`);
  },
  new: variantOf([
    () => {
      const T = tGen(randRange(3, 5));
      const s = T.nodes.reduce((x, n) => x + n.v, 0);
      const c = T.code + 'def tong(nut):\n    if nut is None:\n        return 0\n    return nut.v + tong(nut.left) + tong(nut.right)\nprint(tong(r))';
      return aPy(tNum(`${pre(c)}In ra mấy?`, s, `Cộng giá trị mọi nút: ${T.nodes.map((n) => n.v).join(' + ')} = ${s}.`), c, [String(s)]);
    },
    t2NewExtra,
  ]),
  verdict: variantOf([
    kv(
      "Hà nói: 'hàm dem trên cây cần vòng for để đi qua từng nút'. Hà nói đúng hay sai?",
      "Hà nói: 'hàm dem trên cây dừng nhờ ca cơ sở: gặp None thì trả về 0'. Hà nói đúng hay sai?",
      'Bài nhỏ hơn là cây con trái và cây con phải',
      'Cây cần vòng for',
      'dem không có ca cơ sở',
      'Sai: đệ quy đã tự đi qua mọi nút, không cần for.',
    ),
    t2VerdictExtra,
  ]),
  read: variantOf([
    () => {
      const T = tGen(randRange(4, 6));
      const c = T.code + POSTP + 'p(r)';
      const out = tPost(T, 0);
      const first = at(out, 0);
      const pool = T.nodes.map((n) => String(n.v));
      return aPy(
        aStr(
          `${pre(c)}Nhìn giống hàm p đã học nhưng đọc kỹ vị trí print. Dòng ĐẦU TIÊN in ra số mấy?`,
          String(first),
          pool,
          `print nằm SAU hai lời gọi, nên in lúc quay về: nút sâu nhất bên trái in trước (${first}), gốc in cuối.`,
        ),
        c,
        out.map(String),
      );
    },
    t2ReadExtra,
  ]),
};

/** Ngân hàng probe cây: t1 (cha/con), t2 (duyệt cây bằng đệ quy). */
export const treeBanks: Record<string, ProbeBank> = { t1, t2 };
