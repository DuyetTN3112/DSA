// Ngân hàng câu hỏi probe: đồ thị — g1 (nút và đường nối), g2 (BFS), g3 (DFS).
// Port từ main:probe-adv.js (đoạn sau t2). Nội dung tiếng Việt + code Python verbatim.

import type { ProbeBank } from '../../types';
import {
  aNum, aPick, aPy, aStr, at, kv, pre, randRange, shuffled, tChoice, tNum, variantOf,
} from '../builders';

/** Đồ thị vô hướng sinh ngẫu nhiên: ns = nút, adj = danh sách bạn, lit = code Python */
export interface Graph {
  ns: string[];
  adj: Record<string, string[]>;
  lit: string;
}

const aNm: string[] = ['An', 'Binh', 'Chi', 'Dung', 'Ha', 'Khoa', 'Lan'];

/** Lấy danh sách bạn của x; throw khi thiếu (đồ thị do code tự sinh nên thiếu là bug) */
function adjOf(adj: Record<string, string[]>, x: string): string[] {
  const v = adj[x];
  if (v === undefined) throw new Error(`adjOf: thiếu danh sách bạn của ${x}`);
  return v;
}

/** Sinh đồ thị liên thông n nút rồi thêm extra đường nối phụ */
function gGen(n: number, extra: number): Graph {
  const ns = shuffled(aNm).slice(0, n);
  const adj: Record<string, string[]> = {};
  for (const x of ns) adj[x] = [];
  const add = (a: string, b: string): void => { adjOf(adj, a).push(b); adjOf(adj, b).push(a) };
  for (let i = 1; i < n; i++) add(at(ns, i), at(ns, randRange(0, i - 1)));
  let left = extra, tries = 0;
  while (left > 0 && tries < 60) {
    tries += 1;
    const a = aPick(ns), b = aPick(ns);
    if (a !== b && !adjOf(adj, a).includes(b)) { add(a, b); left -= 1 }
  }
  return { ns, adj, lit: gLit(ns, adj) };
}

/** Render dictionary Python của đồ thị */
function gLit(ns: string[], adj: Record<string, string[]>): string {
  return 'ban = {\n' + ns.map((x) => `    "${x}": [${adjOf(adj, x).map((y) => `"${y}"`).join(', ')}]`).join(',\n') + '\n}\n';
}

/** Số đường nối = tổng độ dài các danh sách chia 2 */
function gEdges(adj: Record<string, string[]>): number {
  return Object.values(adj).reduce((s, l) => s + l.length, 0) / 2;
}

/** BFS từ s; popLast=true thì lấy phần tử cuối hàng đợi (giống stack) */
function gBfs(adj: Record<string, string[]>, s: string, popLast = false): string[] {
  const q: string[] = [s], seen = new Set<string>([s]), out: string[] = [];
  while (q.length > 0) {
    const x = at(q, popLast ? q.length - 1 : 0);
    q.splice(popLast ? q.length - 1 : 0, 1);
    out.push(x);
    for (const y of adjOf(adj, x)) if (!seen.has(y)) { seen.add(y); q.push(y) }
  }
  return out;
}

/** DFS đệ quy, in trước khi đi sâu */
function gDfs(adj: Record<string, string[]>, s: string): string[] {
  const seen = new Set<string>(), out: string[] = [];
  const f = (x: string): void => { seen.add(x); out.push(x); for (const y of adjOf(adj, x)) if (!seen.has(y)) f(y) };
  f(s);
  return out;
}

/** DFS in sau khi quay về (post-order) */
function gDfsPost(adj: Record<string, string[]>, s: string): string[] {
  const seen = new Set<string>(), out: string[] = [];
  const f = (x: string): void => { seen.add(x); for (const y of adjOf(adj, x)) if (!seen.has(y)) f(y); out.push(x) };
  f(s);
  return out;
}

/** Khoảng cách BFS (số đường nối ít nhất) từ s tới t */
function gDist(adj: Record<string, string[]>, s: string, t: string): number {
  const d: Record<string, number> = { [s]: 0 }, q: string[] = [s];
  while (q.length > 0) {
    const x = at(q, 0);
    q.splice(0, 1);
    const dx = d[x];
    if (dx === undefined) throw new Error(`gDist: không có khoảng cách của ${x}`);
    for (const y of adjOf(adj, x)) if (!(y in d)) { d[y] = dx + 1; q.push(y) }
  }
  const r = d[t];
  if (r === undefined) throw new Error(`gDist: không tới được ${t} từ ${s}`);
  return r;
}

/** Code BFS mẫu: in từng nút theo thứ tự hàng đợi */
const BFSC = (s: string): string =>
  `q = ["${s}"]\nseen = {"${s}"}\nwhile q:\n    x = q.pop(0)\n    print(x)\n    for y in ban[x]:\n        if y not in seen:\n            seen.add(y)\n            q.append(y)`;

/** Code DFS mẫu: in từng nút theo đệ quy */
const DFSC = (s: string): string =>
  `seen = set()\ndef dfs(x):\n    seen.add(x)\n    print(x)\n    for y in ban[x]:\n        if y not in seen:\n            dfs(y)\ndfs("${s}")`;

/** Nút duy nhất có bậc cực trị theo f (min/max); null nếu không duy nhất */
function gUniq(adj: Record<string, string[]>, f: (...xs: number[]) => number): string | null {
  const deg = Object.keys(adj).map((x): [string, number] => [x, adjOf(adj, x).length]);
  const m = f(...deg.map(([, dd]) => dd));
  const w = deg.filter(([, dd]) => dd === m);
  return w.length === 1 ? at(w, 0)[0] : null;
}

/* ===== g1: đồ thị, nút và đường nối ===== */
const g1: ProbeBank = {
  same: () => { const G = gGen(5, randRange(0, 2)), x = aPick(G.ns), d = adjOf(G.adj, x).length, c = G.lit + `print(len(ban["${x}"]))`; return aPy(tNum(`${pre(c)}In ra mấy?`, d, `${x} có ${d} bạn trong danh sách.`), c, [String(d)]) },
  flip: () => { const e = randRange(3, 7); return tNum(`Một đồ thị vô hướng có ${e} đường nối (mỗi đường chỉ đếm một lần), ghi bằng dictionary như bài học. Nếu cộng độ dài của TẤT CẢ các danh sách bạn trong dictionary, ra mấy?`, 2 * e, `Mỗi đường nối được ghi hai lần (một lần ở mỗi đầu): ${e} x 2 = ${2 * e}.`) },
  new: variantOf([
    () => { const G = gGen(5, randRange(0, 2)), x = aPick(G.ns), d = adjOf(G.adj, x).length, c = G.lit.replace('ban', 'duong') + `print(len(duong["${x}"]))`; return aPy(tNum(`${pre(c)}Mỗi khóa là một thành phố, danh sách là các thành phố có đường nối trực tiếp. Từ ${x} có bao nhiêu đường đi thẳng ra ngoài?`, d, `Đếm các thành phố trong danh sách của ${x}.`), c, [String(d)]) },
    () => { const G = gGen(5, randRange(0, 2)), e = gEdges(G.adj), c = G.lit + 'n = 0\nfor x in ban:\n    n += len(ban[x])\nprint(n // 2)'; return aPy(tNum(`${pre(c)}Đoạn code này đếm số đường nối. In ra mấy?`, e, 'Tổng độ dài các danh sách chia 2: mỗi đường nối được ghi hai lần.'), c, [String(e)]) },
  ]),
  verdict: variantOf([
    kv("Hà nói: 'đồ thị vô hướng chỉ cần ghi mỗi đường nối ở MỘT phía của dictionary'. Hà nói đúng hay sai?", "Hà nói: 'đồ thị vô hướng phải ghi mỗi đường nối ở CẢ HAI phía'. Hà nói đúng hay sai?", 'Nếu An là bạn của Binh thì Binh cũng là bạn của An', 'Ghi một phía là đủ', 'Phía còn lại Python tự thêm', 'Sai: phải ghi cả hai phía.'),
    kv("Nam nói: 'trong đồ thị mỗi nút chỉ được nối với đúng hai nút khác'. Nam nói đúng hay sai?", "Nam nói: 'trong đồ thị một nút có thể nối với số nút bất kỳ'. Nam nói đúng hay sai?", 'Danh sách bạn của mỗi nút có độ dài tùy ý', 'Mỗi nút đúng 2 bạn', 'Mỗi nút đúng 1 bạn', 'Sai: số bạn tùy từng nút.'),
  ]),
  read: variantOf([
    () => { let G: Graph, w: string | null; do { G = gGen(5, 2); w = gUniq(G.adj, Math.min) } while (w === null); return aStr(`${pre(G.lit)}Đọc kỹ: ai có ÍT bạn nhất?`, w, G.ns, `${w} có ${adjOf(G.adj, w).length} bạn, ít nhất (không phải nhiều nhất).`) },
    () => { const G = gGen(5, randRange(0, 2)), n = G.ns.length, e = gEdges(G.adj); return aNum(`${pre(G.lit)}Đọc kỹ đề: dictionary này có bao nhiêu NGƯỜI (khóa)? Không hỏi số đường nối.`, n, `Đếm các khóa: ${n} người. Số đường nối là ${e}, một câu hỏi khác.`, [e, 2 * e]) },
  ]),
};

/* ===== g2: BFS ===== */
const g2: ProbeBank = {
  same: () => { const G = gGen(5, randRange(0, 2)), s = aPick(G.ns), o = gBfs(G.adj, s), k = randRange(2, 5), c = G.lit + BFSC(s); return aPy(aStr(`${pre(c)}Dòng thứ ${k} in ra tên ai?`, at(o, k - 1), G.ns, `Thứ tự BFS: ${o.join(', ')}.`), c, o) },
  flip: () => { const d = randRange(2, 4); return tNum(`BFS xuất phát từ S, in S ở dòng 1. S có đúng ${d} bạn trực tiếp. Mọi bạn trực tiếp của S đều được in trước bất kỳ bạn-của-bạn nào. Vậy các bạn trực tiếp của S được in ở các dòng từ 2 đến dòng số mấy?`, d + 1, `${d} bạn trực tiếp chiếm các dòng 2 đến ${d + 1}, vì BFS xét hết lớp gần trước rồi mới sang lớp xa.`) },
  new: variantOf([
    () => { const G = gGen(5, randRange(0, 2)), sh = shuffled(G.ns), s = at(sh, 0), t = at(sh, 1), d = gDist(G.adj, s, t), c = G.lit + `from collections import deque\nd = {"${s}": 0}\nq = deque(["${s}"])\nwhile q:\n    x = q.popleft()\n    for y in ban[x]:\n        if y not in d:\n            d[y] = d[x] + 1\n            q.append(y)\nprint(d["${t}"])`; return aPy(tNum(`${pre(G.lit)}Mỗi khóa là một ga tàu, danh sách là các ga nối trực tiếp. Đi từ ga ${s} tới ga ${t}, ít nhất phải qua bao nhiêu đường nối?`, d, `Đi từng lớp từ ${s}: ga ở lớp ${d} là ${t}.`), c, [String(d)]) },
    () => { const k = randRange(3, 6), c = `q = [1]\nfor i in range(${k}):\n    x = q.pop(0)\n    q.append(x * 2)\n    q.append(x * 2 + 1)\nprint(x)`; return aPy(tNum(`${pre(c)}In ra mấy?`, k, `Mỗi lần lấy phần tử ĐẦU hàng đợi, các số được lấy ra theo thứ tự 1, 2, 3, ...: lần thứ ${k} là ${k}.`), c, [String(k)]) },
  ]),
  verdict: variantOf([
    kv("Hà nói: 'BFS dùng stack (vào sau ra trước)'. Hà nói đúng hay sai?", "Hà nói: 'BFS dùng queue (vào trước ra trước) nên xét hết nút gần rồi mới tới nút xa'. Hà nói đúng hay sai?", 'Vào trước ra trước giữ nguyên thứ tự từng lớp', 'Vào sau ra trước', 'Không cần cấu trúc nào', 'Sai: BFS dùng queue.'),
    kv("Nam nói: 'BFS không cần tập seen vì đồ thị không có đường vòng'. Nam nói đúng hay sai?", "Nam nói: 'BFS cần tập seen để không xét lại một nút nhiều lần'. Nam nói đúng hay sai?", 'An là bạn Binh, Binh là bạn An nên dễ quay vòng', 'Đồ thị không bao giờ quay vòng', 'seen chỉ để cho đẹp', 'Sai: đường nối hai chiều tự tạo vòng quay lại.'),
  ]),
  read: variantOf([
    () => { let G: Graph, s: string, o: string[], p: string[]; do { G = gGen(5, randRange(1, 2)); s = aPick(G.ns); o = gBfs(G.adj, s); p = gBfs(G.adj, s, true) } while (at(o, 2) === at(p, 2)); const c = G.lit + BFSC(s).replace('q.pop(0)', 'q.pop()'); return aPy(aStr(`${pre(c)}Nhìn giống BFS nhưng đọc kỹ dòng x = q.pop(). Dòng thứ 3 in ra tên ai?`, at(p, 2), G.ns, `q.pop() lấy phần tử CUỐI (như stack), thứ tự là ${p.join(', ')}, không phải thứ tự BFS ${o.join(', ')}.`), c, p) },
    () => { let G: Graph, s: string; do { G = gGen(5, randRange(0, 2)); s = aPick(G.ns) } while (s === at(G.ns, 0)); const c = G.lit + BFSC(s); return aPy(aStr(`${pre(c)}Đọc kỹ dòng q = [...] đầu tiên. Dòng ĐẦU TIÊN in ra tên ai?`, s, G.ns, `BFS bắt đầu từ ${s} (không phải khóa đầu tiên trong dictionary).`), c, gBfs(G.adj, s)) },
  ]),
};

/* ===== g3: DFS ===== */
const g3: ProbeBank = {
  same: () => { const G = gGen(5, randRange(0, 2)), s = aPick(G.ns), o = gDfs(G.adj, s), k = randRange(2, 5), c = G.lit + DFSC(s); return aPy(aStr(`${pre(c)}Dòng thứ ${k} in ra tên ai?`, at(o, k - 1), G.ns, `Thứ tự DFS: ${o.join(', ')}.`), c, o) },
  flip: () => aPy(tChoice('DFS in nút S ở dòng 1 và nút X ở dòng 2. X và S có quan hệ nào?', ['X là bạn trực tiếp của S', 'X cách S đúng 2 bước', 'Không có quan hệ nào'], 'Ngay sau khi in S, dfs gọi dfs(y) cho bạn đầu tiên y của S, và y được in ngay.'), '', []),
  new: variantOf([
    () => { const names = shuffled(aNm), a = names.slice(0, 3), b = names.slice(3, 5), adj: Record<string, string[]> = {}; for (const x of a) adj[x] = []; for (const x of b) adj[x] = []; const add = (u: string, v: string): void => { adjOf(adj, u).push(v); adjOf(adj, v).push(u) }; add(at(a, 1), at(a, 0)); add(at(a, 2), at(a, randRange(0, 1))); add(at(b, 1), at(b, 0)); const ns = shuffled(Object.keys(adj)), s = aPick(a), c = gLit(ns, adj) + DFSC(s); return aPy(tNum(`${pre(c)}Có bao nhiêu dòng được in ra?`, 3, `dfs chỉ đi được tới những nút nối với ${s}: nhóm ${a.join(', ')}. Nhóm kia không có đường tới.`), c, gDfs(adj, s)) },
    () => { const names = shuffled(aNm), a = names.slice(0, 3), b = names.slice(3, 5), adj: Record<string, string[]> = {}; for (const x of a.concat(b)) adj[x] = []; const add = (u: string, v: string): void => { adjOf(adj, u).push(v); adjOf(adj, v).push(u) }; add(at(a, 1), at(a, 0)); add(at(a, 2), at(a, randRange(0, 1))); add(at(b, 1), at(b, 0)); const ns = shuffled(Object.keys(adj)), c = gLit(ns, adj) + 'seen = set()\ndef dfs(x):\n    seen.add(x)\n    for y in ban[x]:\n        if y not in seen:\n            dfs(y)\nnhom = 0\nfor x in ban:\n    if x not in seen:\n        dfs(x)\n        nhom += 1\nprint(nhom)'; return aPy(tNum(`${pre(c)}In ra mấy? (mỗi lần dfs chạy xong là đi hết một nhóm bạn nối nhau)`, 2, 'Có hai nhóm tách rời nhau, nên dfs được khởi động từ ngoài đúng 2 lần.'), c, ['2']) },
  ]),
  verdict: variantOf([
    kv("Hà nói: 'DFS luôn tìm được đường đi ít bước nhất'. Hà nói đúng hay sai?", "Hà nói: 'BFS đảm bảo đường ít bước nhất, DFS có thể đi một đường vòng dài trước'. Hà nói đúng hay sai?", 'DFS đi sâu một hướng trước khi thử hướng khác', 'DFS xét từng lớp', 'DFS luôn ngắn nhất', 'Sai: chỉ BFS đảm bảo điều đó.'),
    kv("Nam nói: 'hàm dfs không cần điều kiện dừng'. Nam nói đúng hay sai?", "Nam nói: 'dfs dừng nhờ seen: khi mọi bạn đã được thăm thì không gọi tiếp'. Nam nói đúng hay sai?", 'Điều kiện y not in seen chặn các lời gọi thừa', 'dfs tự dừng', 'dfs gọi vô hạn', 'Sai: thiếu seen thì dfs quay vòng mãi.'),
  ]),
  read: variantOf([
    () => { const G = gGen(5, randRange(0, 2)), s = aPick(G.ns), o = gDfsPost(G.adj, s), c = G.lit + DFSC(s).replace('    print(x)\n', '').replace('            dfs(y)\n', '            dfs(y)\n    print(x)\n'); return aPy(aStr(`${pre(c)}Nhìn giống dfs đã học nhưng đọc kỹ vị trí print. Dòng ĐẦU TIÊN in ra tên ai?`, at(o, 0), G.ns, `print nằm SAU vòng for nên in lúc quay về. Thứ tự: ${o.join(', ')}.`), c, o) },
    () => { const G = gGen(5, randRange(0, 2)), s = aPick(G.ns), c = G.lit + DFSC(s), o = gDfs(G.adj, s); return aPy(aStr(`${pre(c)}Đọc kỹ đề: dòng ĐẦU TIÊN in ra tên ai? (đừng tính trước cả đường đi)`, s, G.ns, `dfs("${s}") in ${s} ngay lập tức, trước mọi lời gọi đệ quy.`), c, o) },
  ]),
};

export const graphBanks: Record<string, ProbeBank> = { g1, g2, g3 };
