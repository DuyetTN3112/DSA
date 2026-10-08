// Ngân hàng probe hệ thống: ap4 (phụ thuộc gói/đồ thị), ap5 (thư mục/cây đệ quy), ap6 (chọn cấu trúc dữ liệu).
// Port từ main:probe-last.js. Helpers local (typed): zDag, zTopo, zValidOrd, zDepLit, zClosure,
// zFs, zFsLit, zFsTot, zFsCnt, zFsDepth, zFsFn, zDS, zSc, zScTrap.

import type { ProbeBank } from '../../types';
import { randRange, shuffled, at, pre, pJ, tNum, tChoice, kv, aPick, aPy, aNum, aStr, variantOf } from '../builders';

/** Đồ thị phụ thuộc gói: nm = tên gói, deps[x] = các gói x CẦN (port của zDag) */
interface Dag { nm: string[]; deps: Record<string, string[]> }
function zDag(n: number): Dag {
  const nm = shuffled(['app', 'web', 'lib', 'log', 'core', 'db', 'ui']).slice(0, n);
  const deps: Record<string, string[]> = {};
  nm.forEach((x) => { deps[x] = []; });
  for (let i = 0; i < n - 1; i++) {
    const k = randRange(1, Math.min(2, n - 1 - i));
    deps[at(nm, i)] = shuffled(nm.slice(i + 1)).slice(0, k);
  }
  return { nm, deps };
}

/** Thứ tự topo: gói không cần ai đứng trước (port của zTopo) */
function zTopo(deps: Record<string, string[]>): string[] {
  const out: string[] = [], seen = new Set<string>();
  const f = (x: string): void => {
    if (seen.has(x)) return;
    seen.add(x);
    const ds: string[] | undefined = deps[x];
    if (ds !== undefined) ds.forEach(f);
    out.push(x);
  };
  Object.keys(deps).forEach(f);
  return out;
}

/** Kiểm tra thứ tự cài có tôn trọng mọi phụ thuộc không (port của zValidOrd) */
function zValidOrd(o: string[], deps: Record<string, string[]>): boolean {
  const pos: Record<string, number> = {};
  o.forEach((x, i) => { pos[x] = i; });
  return Object.keys(deps).every((x) => {
    const ds: string[] | undefined = deps[x];
    if (ds === undefined) return true;
    return ds.every((y) => {
      const py: number | undefined = pos[y], px: number | undefined = pos[x];
      return py !== undefined && px !== undefined && py < px;
    });
  });
}

/** Biểu diễn deps kiểu Python: deps = {"app": ["lib"], ...} (port của zDepLit) */
function zDepLit(d: Record<string, string[]>): string {
  return 'deps = {' + Object.keys(d).map((x) => `"${x}": [${(d[x] ?? []).map((y) => `"${y}"`).join(', ')}]`).join(', ') + '}';
}

/** Số gói cần cài để có gói s (kể cả s): đóng bao hàm phụ thuộc (port của zClosure) */
function zClosure(deps: Record<string, string[]>, s: string): number {
  const seen = new Set<string>();
  const f = (x: string): void => {
    if (seen.has(x)) return;
    seen.add(x);
    const ds: string[] | undefined = deps[x];
    if (ds !== undefined) ds.forEach(f);
  };
  f(s);
  return seen.size;
}

/** Nút cây thư mục: size = dung lượng tệp, thư mục có size 0 (port của zFs) */
interface FsNode { size: number; children: FsNode[] }
function zFs(sizeRoot: number): FsNode {
  const leaf = (): FsNode => ({ size: randRange(1, 9), children: [] });
  const dir = (): FsNode => ({ size: 0, children: [leaf(), leaf()].slice(0, randRange(1, 2)) });
  const root: FsNode = { size: sizeRoot, children: [leaf(), dir()] };
  if (Math.random() < 0.5) root.children.push(leaf());
  return root;
}

/** Biểu diễn cây kiểu Python dict (port của zFsLit) */
function zFsLit(n: FsNode): string {
  return `{"size": ${n.size}, "children": [${n.children.map(zFsLit).join(', ')}]}`;
}

/** Tổng dung lượng mọi nút (port của zFsTot) */
function zFsTot(n: FsNode): number {
  return n.size + n.children.reduce((s, c) => s + zFsTot(c), 0);
}

/** Đếm mọi nút trong cây (port của zFsCnt) */
function zFsCnt(n: FsNode): number {
  return 1 + n.children.reduce((s, c) => s + zFsCnt(c), 0);
}

/** Số tầng của cây, gốc tính là 1 (port của zFsDepth) */
function zFsDepth(n: FsNode): number {
  return 1 + Math.max(0, ...n.children.map(zFsDepth));
}

/** Code Python hàm total đệ quy (verbatim, port của zFsFn) */
const zFsFn = `def total(n):
    s = n["size"]
    for c in n["children"]:
        s += total(c)
    return s
`;

/** Các cấu trúc dữ liệu ứng viên (port của zDS) */
const zDS: string[] = ['Dictionary (hash map)', 'Stack', 'Queue', 'Set', 'Đồ thị (BFS/DFS)', 'Cây (đệ quy)', 'List'];

/** Cặp (tình huống, chỉ số cấu trúc đúng trong zDS) (port của zSc) */
const zSc: Array<[string, number]> = [
  ['Tìm khách hàng theo số điện thoại trong 10 triệu bản ghi, thật nhanh', 0],
  ['Chức năng hoàn tác (Undo) khi chỉnh sửa tài liệu', 1],
  ['Xử lý các yêu cầu gửi đến server theo đúng thứ tự đến', 2],
  ['Loại các email trùng khỏi danh sách gửi tin', 3],
  ['Hỏi hai người có quan hệ gián tiếp qua bạn bè không', 4],
  ['Tính tổng dung lượng của một thư mục lồng nhiều tầng', 5],
  ['Tra giá sản phẩm từ mã sản phẩm', 0],
  ['Kiểm tra dấu ngoặc trong một đoạn code có khớp không', 1],
  ['Hàng chờ in: tài liệu gửi trước in trước', 2],
  ['Kiểm tra mã giảm giá đã được dùng chưa', 3],
  ['Tìm đường đi ít trạm nhất giữa hai ga tàu', 4],
  ['Mục lục sách có chương, mục, tiểu mục', 5],
  ['Đếm số lần mỗi từ xuất hiện trong một văn bản dài', 0],
  ['Nút Back của trình duyệt', 1],
  ['Phân việc cho nhân viên theo lượt, ai đến trước phục vụ trước', 2],
];

/** Tình huống bẫy tên gọi: hành vi thật khác tên gọi (port của zScTrap) */
const zScTrap: Array<[string, number]> = [
  ["Một 'hàng đợi' đĩa bẩn chồng lên nhau: luôn lấy cái ở TRÊN cùng ra rửa trước", 1],
  ["Một 'danh sách' mã đơn hàng chỉ cần biết mã đã xử lý hay chưa, không bao giờ có hai mã giống nhau", 3],
  ["Một 'bảng' tra tên viết tắt ra tên đầy đủ", 0],
  ["Một 'hàng' người nhưng quy định người đến SAU được phục vụ trước", 1],
  ['Xếp hàng ở quầy: ai đến trước được phục vụ trước', 2],
];

/* ===== ap4: phụ thuộc gói là đồ thị ===== */
const ap4: ProbeBank = {
  same: () => {
    const G = zDag(randRange(4, 5)), s = at(G.nm, 0), n = zClosure(G.deps, s);
    const c = `${zDepLit(G.deps)}\nseen = set()\ndef f(x):\n    if x in seen:\n        return\n    seen.add(x)\n    for y in deps[x]:\n        f(y)\nf("${s}")\nprint(len(seen))`;
    return aPy(tNum(`${pre(zDepLit(G.deps))}Mỗi khóa là một gói, danh sách là các gói nó CẦN. Để cài "${s}" cần cài tổng cộng bao nhiêu gói (kể cả "${s}")?`, n, `Gom "${s}" và mọi gói nó cần, trực tiếp hay gián tiếp: ${n} gói.`), c, [String(n)]);
  },
  flip: () => {
    const k = randRange(2, 4);
    return tNum(`Gói X cần đúng ${k} gói khác, và mỗi gói trong số đó không cần gói nào. Cài X cần tổng cộng bao nhiêu gói (kể cả X)?`, k + 1, `${k} gói nền + X = ${k + 1}.`);
  },
  new: () => {
    const cyc = Math.random() < 0.5, k = randRange(2, 4), nm = shuffled(['Toán A', 'Toán B', 'Lý', 'Hóa', 'Tin']).slice(0, k);
    const d: Record<string, string[]> = {};
    nm.forEach((x, i) => { d[x] = cyc ? [at(nm, (i + 1) % k)] : i < k - 1 ? [at(nm, i + 1)] : []; });
    const ok = !cyc;
    const desc = nm.map((x) => { const dx: string[] = d[x] ?? []; return `"${x}" cần ${dx.length ? `"${at(dx, 0)}"` : 'không môn nào'}`; }).join('; ');
    return tChoice(`Môn học và môn tiên quyết (phải học trước): ${desc}. Có thứ tự học nào hợp lệ không?`, ok ? ['Có', 'Không: phụ thuộc vòng', 'Không đủ thông tin'] : ['Không: phụ thuộc vòng, môn nào cũng phải đợi môn khác', 'Có', 'Không đủ thông tin'], ok ? 'Đi theo chuỗi, môn cuối không cần ai nên học trước, rồi lùi dần.' : 'Mỗi môn đều cần một môn khác trong vòng nên không môn nào học trước được.');
  },
  verdict: kv(
    "Hà nói: 'phụ thuộc vòng thì vẫn luôn tìm được một thứ tự cài hợp lệ'. Hà nói đúng hay sai?",
    "Hà nói: 'phụ thuộc vòng thì không có thứ tự hợp lệ, hệ thống phải báo lỗi'. Hà nói đúng hay sai?",
    'Gói nào cũng phải đợi gói khác', 'Cài song song là xong', 'Bỏ qua một gói',
    'Sai: vòng thì không có điểm xuất phát.',
  ),
  read: () => {
    const a = aPick(['app', 'web']), b = aPick(['lib', 'core']);
    const c = `deps = {"${a}": ["${b}"], "${b}": []}\nprint("${b}")`;
    return aPy(tChoice(`${pre(`deps = {"${a}": ["${b}"], "${b}": []}`)}Danh sách của mỗi khóa là các gói nó CẦN. Gói nào phải cài TRƯỚC?`, [b, a, 'Thứ tự không quan trọng'], `"${a}" cần "${b}", nên "${b}" phải có trước. Mũi tên "cần" chỉ về gói phải cài trước.`), c, [b]);
  },
};
ap4.verdict = variantOf([ap4.verdict, kv(
  "Nam nói: 'cài gói nào trước cũng được, miễn cài đủ'. Nam nói đúng hay sai?",
  "Nam nói: 'gói không cần ai phải được cài trước những gói dựa vào nó'. Nam nói đúng hay sai?",
  'Mỗi gói chỉ cài được khi các gói nó cần đã có', 'Thứ tự không quan trọng', 'Cài ngược cũng được',
  'Sai: thứ tự phải tôn trọng phụ thuộc.',
)]);
ap4.new = variantOf([ap4.new, () => {
  const G = zDag(4), good = zTopo(G.deps);
  let bad = shuffled(good);
  while (zValidOrd(bad, G.deps)) bad = shuffled(good);
  let bad2 = shuffled(good), t = 0;
  do { bad2 = shuffled(good); t++; } while ((zValidOrd(bad2, G.deps) || bad2.join() === bad.join()) && t < 200);
  if (zValidOrd(bad2, G.deps)) bad2 = good.slice().reverse();
  const opts = [good.join(', '), bad.join(', '), bad2.join(', ')];
  // Fallback: gọi bank ap4 đã gộp qua closure (gọi lúc runtime nên an toàn).
  if (new Set(opts).size < 3 || !zValidOrd(good, G.deps) || zValidOrd(bad, G.deps) || zValidOrd(bad2, G.deps)) return ap4.same();
  return aPy(tChoice(`${pre(zDepLit(G.deps))}Thứ tự cài nào HỢP LỆ (mỗi gói chỉ cài khi các gói nó cần đã có)?`, opts, 'Gói nào không cần ai đứng đầu, rồi các gói dựa vào chúng. Hai thứ tự kia có gói đứng trước gói nó cần.'), `${zDepLit(G.deps)}\ndef ok(o):\n    p = {x: i for i, x in enumerate(o)}\n    return all(p[y] < p[x] for x in deps for y in deps[x])\nprint(ok(${pJ(good)}), ok(${pJ(bad)}), ok(${pJ(bad2)}))`, ['True False False']);
}]);
ap4.read = variantOf([ap4.read, () => {
  let G = zDag(5), cnt: Record<string, number> = {}, w: string | null = null;
  do {
    G = zDag(5);
    cnt = {};
    Object.values(G.deps).flat().forEach((y) => { cnt[y] = (cnt[y] ?? 0) + 1; });
    const mx = Math.max(...Object.values(cnt));
    const ws = Object.keys(cnt).filter((k) => cnt[k] === mx);
    w = ws.length === 1 && mx >= 2 ? at(ws, 0) : null;
  } while (w === null);
  const lit = zDepLit(G.deps);
  return aPy(aStr(`${pre(lit)}Đọc kỹ: gói nào được NHIỀU gói khác cần nhất (xuất hiện trong nhiều danh sách nhất)?`, w, G.nm, `"${w}" xuất hiện trong ${cnt[w] ?? 0} danh sách, nhiều nhất. Đề không hỏi gói cần nhiều gói nhất.`), `${lit}\nfrom collections import Counter\nc = Counter(y for x in deps for y in deps[x])\nprint(c.most_common(1)[0][0])`, [w]);
}]);

/* ===== ap5: thư mục là cây, đệ quy ===== */
const ap5: ProbeBank = {
  same: () => {
    const t = zFs(0), tot = zFsTot(t);
    const c = `tree = ${zFsLit(t)}\n${zFsFn}print(total(tree))`;
    return aPy(tNum(`${pre(c.replace('\nprint(total(tree))', ''))}Mỗi nút là tệp (size là dung lượng) hoặc thư mục (size 0, children là các nút con). In ra total(tree) là mấy?`, tot, `Cộng dung lượng mọi nút từ lá lên: ${tot}.`), c, [String(tot)]);
  },
  flip: () => {
    const a = randRange(2, 9), b = randRange(2, 9), x = randRange(2, 9);
    return tNum(`Thư mục gốc (size 0) chứa ba tệp: ${a}, ${b} và một tệp chưa biết. total(gốc) = ${a + b + x}. Tệp chưa biết có dung lượng bao nhiêu?`, x, `${a + b + x} - ${a} - ${b} = ${x}.`);
  },
  new: () => {
    const t = zFs(0), n = zFsCnt(t);
    const c = `tree = ${zFsLit(t)}\ndef dem(n):\n    k = 1\n    for c in n["children"]:\n        k += dem(c)\n    return k\nprint(dem(tree))`;
    return aPy(tNum(`${pre(`tree = ${zFsLit(t)}`)}Sơ đồ công ty: mỗi nút là một nhân sự, children là người họ quản lý. Hàm dem đếm mỗi nút một lần (1 + tổng dem của các con). dem(tree) bằng mấy?`, n, `Đếm mọi nút: ${n}.`), c, [String(n)]);
  },
  verdict: kv(
    "Hà nói: 'thư mục tự có sẵn một con số dung lượng, chỉ cần đọc ra'. Hà nói đúng hay sai?",
    "Hà nói: 'dung lượng thư mục là tổng dung lượng mọi thứ nằm trong nó, tính bằng đệ quy'. Hà nói đúng hay sai?",
    'Thư mục chỉ là cái chứa, dung lượng nằm ở các tệp', 'Thư mục tự biết dung lượng', 'Chỉ cộng tệp cấp ngoài cùng',
    'Sai: phải cộng từ lá lên.',
  ),
  read: () => {
    const s = randRange(2, 4), t = zFs(s), tot = zFsTot(t), kids = tot - s;
    const c = `tree = ${zFsLit(t)}\n${zFsFn}print(total(tree))`;
    return aPy(aNum(`${pre(`tree = ${zFsLit(t)}`)}Hàm total cộng size của chính nút rồi cộng total của các con. Chú ý: nút GỐC này có size ${s}, không phải 0. total(tree) bằng mấy?`, tot, `Phải cộng cả size của gốc (${s}) với phần các con (${kids}): ${tot}.`, [kids, s]), c, [String(tot)]);
  },
};
ap5.new = variantOf([ap5.new, () => {
  const t = zFs(0), d = zFsDepth(t);
  const c = `tree = ${zFsLit(t)}\ndef cao(n):\n    return 1 + max([cao(c) for c in n["children"]] + [0])\nprint(cao(tree))`;
  return aPy(tNum(`${pre(`tree = ${zFsLit(t)}`)}Hàm cao cho biết số tầng của cây thư mục (gốc tính là 1 tầng). cao(tree) bằng mấy?`, d, `Đường dài nhất từ gốc xuống nút sâu nhất có ${d} nút.`), c, [String(d)]);
}]);
ap5.verdict = variantOf([ap5.verdict, kv(
  "Nam nói: 'hàm total không cần ca cơ sở'. Nam nói đúng hay sai?",
  "Nam nói: 'ca cơ sở của total là nút không có con: vòng for không chạy'. Nam nói đúng hay sai?",
  'Không có con thì không gọi đệ quy nữa', 'total luôn gọi tiếp', 'Cây rỗng là ca cơ sở duy nhất',
  'Sai: nút lá chính là chỗ dừng.',
)]);
ap5.read = variantOf([ap5.read, () => {
  const a = randRange(2, 9), b = randRange(2, 9);
  const t: FsNode = { size: 0, children: [{ size: a, children: [] }, { size: 0, children: [{ size: b, children: [] }] }] };
  const c = `tree = ${zFsLit(t)}\n${zFsFn}print(total(tree["children"][1]))`;
  return aPy(aNum(`${pre(`tree = ${zFsLit(t)}`)}Đọc kỹ: gọi total trên nút con thứ HAI (tree["children"][1]), không phải cả cây. In ra mấy?`, b, `Nút con thứ hai là thư mục chứa một tệp ${b}: total = ${b}. Tệp ${a} nằm ở nút con thứ nhất, không tính.`, [a + b, a]), c, [String(b)]);
}]);

/* ===== ap6: chọn cấu trúc dữ liệu ===== */
const ap6: ProbeBank = {
  same: () => {
    const [txt, di] = aPick(zSc.slice(0, 6));
    return tChoice(`Yêu cầu: ${txt}. Nên dùng gì?`, [at(zDS, di), ...shuffled(zDS.filter((_, i) => i !== di)).slice(0, 2)], `Đây là bài toán của ${at(zDS, di)}.`);
  },
  flip: () => {
    const d = aPick([0, 1, 2, 3, 4, 5]), good = aPick(zSc.filter((x) => x[1] === d)), bad = shuffled(zSc.filter((x) => x[1] !== d)).slice(0, 2);
    return tChoice(`${at(zDS, d)} phù hợp nhất cho tình huống nào?`, [good[0], ...bad.map((x) => x[0])], `${at(zDS, d)} sinh ra cho đúng kiểu việc này.`);
  },
  new: () => {
    const [txt2, di2] = aPick(zSc.slice(6));
    return tChoice(`Yêu cầu: ${txt2}. Nên dùng gì?`, [at(zDS, di2), ...shuffled(zDS.filter((_, i) => i !== di2)).slice(0, 2)], `Đây là bài toán của ${at(zDS, di2)}.`);
  },
  verdict: kv(
    "Hà nói: 'dùng list cho mọi thứ là đủ và luôn tốt nhất'. Hà nói đúng hay sai?",
    "Hà nói: 'cùng một dữ liệu, chọn cấu trúc khác nhau cho tốc độ tra cứu khác hẳn'. Hà nói đúng hay sai?",
    'Mỗi cấu trúc mạnh ở một loại thao tác', 'List tốt nhất cho mọi việc', 'Cấu trúc không ảnh hưởng tốc độ',
    'Sai: chọn đúng cấu trúc quyết định tốc độ.',
  ),
  read: () => {
    const [txt3, di3] = aPick(zScTrap);
    return tChoice(`Đọc kỹ cách hoạt động, đừng chỉ nhìn tên gọi: ${txt3}. Cấu trúc nào khớp?`, [at(zDS, di3), ...shuffled(zDS.filter((_, i) => i !== di3)).slice(0, 2)], `Điều quyết định là hành vi thật (${at(zDS, di3)}), không phải từ ngữ trong mô tả.`);
  },
};
ap6.verdict = variantOf([ap6.verdict, kv(
  "Nam nói: 'chọn cấu trúc dữ liệu nên chọn theo cái mình quen nhất'. Nam nói đúng hay sai?",
  "Nam nói: 'nên chọn cấu trúc dữ liệu theo thao tác chính mà bài toán cần'. Nam nói đúng hay sai?",
  'Thao tác chính quyết định cấu trúc phù hợp', 'Cái quen nhất luôn đúng', 'Cấu trúc nào cũng như nhau',
  'Sai: chọn theo thao tác cần làm.',
)]);
ap6.read = variantOf([ap6.read, () => {
  const [txt4] = aPick(zScTrap.filter((x) => x[1] !== 2));
  return tChoice(`Đề viết: ${txt4}. Nếu chọn sai cấu trúc, rủi ro lớn nhất là gì?`, ['Hành vi sai so với yêu cầu hoặc quá chậm khi dữ liệu lớn', 'Chương trình đổi màu', 'Không có rủi ro'], 'Cấu trúc sai thì thao tác chính hoặc chậm hoặc sai thứ tự.');
}]);

export const systemsBanks: Record<string, ProbeBank> = { ap4, ap5, ap6 };
