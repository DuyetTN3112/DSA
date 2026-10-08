// Ngân hàng probe code w8–w12: đệ quy, dict, DFS, stack, hàng đợi (port của probe-code.js, nhánh main).
import type { ProbeBank } from '../../types';
import {
  LESSON_REFS, aPick, aPy, at, kv, num, opt, pre, randRange,
  shuffled, tChoice, tNum, variantOf,
} from '../builders';

/** JSON.stringify có dấu cách sau , và : (port của J trong probe-code.js) */
function J(x: object): string {
  return JSON.stringify(x).replace(/,/g, ', ').replace(/:/g, ': ');
}

/** ref code Python của bài học; throw khi thiếu (port của LES.w8.ref) */
function refOf(id: string): string {
  const r = LESSON_REFS[id];
  if (r === undefined) throw new Error(`refOf: thiếu ref bài ${id}`);
  return r;
}

/** Ký tự tại vị trí i; throw nếu ngoài biên (at()-style cho string) */
function chAt(s: string, i: number): string {
  const c = s[i];
  if (c === undefined) throw new Error(`chAt: chỉ số ${i} ngoài biên`);
  return c;
}

/** "['True', 'False']" kiểu Python (port của pyBL) */
function pyBL(a: boolean[]): string {
  return `[${a.map((b) => (b ? 'True' : 'False')).join(', ')}]`;
}

const FA = `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n`;
/** Giai thừa đệ quy (port của fact) */
function fact(n: number): number { return n <= 1 ? 1 : n * fact(n - 1); }

const FB = `def final_balance(txs):\n    total = 0\n    for t in txs:\n        if t["type"] == "deposit":\n            total += t["amount"]\n        else:\n            total -= t["amount"]\n        if total < 0:\n            raise ValueError("so du khong du")\n    return total\n`;

/** Một giao dịch nạp/rút */
interface Tx { id: number; type: string; amount: number }

/** Sinh dãy giao dịch không bao giờ âm số dư (port của txGen) */
function txGen(n: number): { L: Tx[]; bal: number } {
  let bal = 0;
  const L: Tx[] = [];
  for (let i = 1; i <= n; i++) {
    if (bal === 0 || Math.random() < 0.55) { const a = 10 * randRange(1, 5); L.push({ id: i, type: 'deposit', amount: a }); bal += a; }
    else { const a = 10 * randRange(1, bal / 10); L.push({ id: i, type: 'withdraw', amount: a }); bal -= a; }
  }
  return { L, bal };
}

const IO = `def install_order(deps):\n    order, state = [], {}\n    def visit(x):\n        if state.get(x) == "done":\n            return\n        if state.get(x) == "doing":\n            raise ValueError("vong")\n        state[x] = "doing"\n        for d in deps[x]:\n            visit(d)\n        state[x] = "done"\n        order.append(x)\n    for name in sorted(deps):\n        visit(name)\n    return order\n`;

/** Mô phỏng install_order (port của iOrd) */
function iOrd(deps: Record<string, string[]>): string[] {
  const o: string[] = [];
  const st: Record<string, string> = {};
  const v = (x: string): void => {
    if (st[x] === 'done') return;
    st[x] = 'doing';
    const ds = deps[x];
    if (ds === undefined) throw new Error(`iOrd: thiếu deps của ${x}`);
    ds.forEach(v);
    st[x] = 'done';
    o.push(x);
  };
  Object.keys(deps).sort().forEach(v);
  return o;
}

/** Sinh đồ thị phụ thuộc ngẫu nhiên không vòng (port của dGen) */
function dGen(n: number): Record<string, string[]> {
  const names = shuffled(['app', 'db', 'web', 'log', 'net', 'ui', 'api', 'cache']).slice(0, n);
  const d: Record<string, string[]> = {};
  names.forEach((x, k) => { d[x] = shuffled(names.slice(0, k)).slice(0, randRange(0, Math.min(k, 2))); });
  return d;
}

const BE = `def bracket_error(s):\n    pairs = {")": "(", "]": "[", "}": "{"}\n    stack = []\n    for i in range(len(s)):\n        c = s[i]\n        if c in "([{":\n            stack.append(i)\n        elif c in pairs:\n            if len(stack) == 0 or s[stack[-1]] != pairs[c]:\n                return i\n            stack.pop()\n    if len(stack) > 0:\n        return stack[-1]\n    return -1\n`;

/** Mô phỏng bracket_error (port của beJs) */
function beJs(s: string): number {
  const p: Record<string, string> = { ')': '(', ']': '[', '}': '{' };
  const st: number[] = [];
  for (let i = 0; i < s.length; i++) {
    const c = chAt(s, i);
    if ('([{'.includes(c)) { st.push(i); continue; }
    const pc = p[c];
    if (pc === undefined) continue;
    if (st.length === 0 || chAt(s, at(st, st.length - 1)) !== pc) return i;
    st.pop();
  }
  return st.length > 0 ? at(st, st.length - 1) : -1;
}

/** Sinh chuỗi ngoặc có thể đúng hoặc sai (port của bStr) */
function bStr(): string {
  const o = ['(', '[', '{'];
  const c: Record<string, string> = { '(': ')', '[': ']', '{': '}' };
  const close = (b: string): string => {
    const r = c[b];
    if (r === undefined) throw new Error(`bStr: ngoặc lạ ${b}`);
    return r;
  };
  let s = '';
  for (let k = 0; k < randRange(2, 3); k++) { const b = aPick(o); s += b + 'x' + close(b); }
  const r = Math.random();
  if (r < 0.35) return s + aPick([')', ']', '}']);
  if (r < 0.7) return aPick(o) + s;
  if (r < 0.85) { const b = aPick(o); return b + aPick(o.filter((z) => z !== b).map(close)) + s; }
  return s;
}

const AL = `def allowed_requests(times, limit, window):\n    q = []\n    result = []\n    for t in times:\n        while q and q[0] <= t - window:\n            q.pop(0)\n        if len(q) < limit:\n            q.append(t)\n            result.append(True)\n        else:\n            result.append(False)\n    return result\n`;

/** Mô phỏng allowed_requests (port của alJs) */
function alJs(ts: number[], L: number, W: number): boolean[] {
  const q: number[] = [];
  const r: boolean[] = [];
  for (const t of ts) {
    while (q.length > 0 && at(q, 0) <= t - W) q.shift();
    if (q.length < L) { q.push(t); r.push(true); } else { r.push(false); }
  }
  return r;
}

const w8: ProbeBank = {
  same: () => { const n = randRange(3, 6); return num(FA, `print(factorial(${n}))`, fact(n), `factorial(${n}) = ${Array.from({ length: n }, (_, i) => n - i).join(' x ')} = ${fact(n)}.`); },
  flip: () => { const n = randRange(3, 6); return aPy(tNum(`${pre(FA)}Biết factorial(?) trả về ${fact(n)}. Dấu ? là số mấy?`, n, `1, 2, 6, 24, 120, 720: ${fact(n)} là factorial(${n}).`), FA + `print(factorial(${n}))`, [String(fact(n))]); },
  new: variantOf([
    () => { const n = randRange(3, 7); const k = randRange(2, 4); return num(`def total_steps(n):\n    if n == 0:\n        return 0\n    return ${k} + total_steps(n - 1)\n`, `print(total_steps(${n}))`, k * n, `Mỗi tầng cộng ${k}, có ${n} tầng, ca cơ sở là 0: ${k} x ${n} = ${k * n}. Cùng khung đệ quy, chỉ đổi phép kết hợp.`); },
    () => { const a = randRange(2, 4); const n = randRange(2, 5); return num(`def power(a, n):\n    if n == 0:\n        return 1\n    return a * power(a, n - 1)\n`, `print(power(${a}, ${n}))`, a ** n, `Ca cơ sở n = 0 trả 1; mỗi tầng nhân thêm ${a}: ${a} nhân ${n} lần = ${a ** n}. Cùng khung đệ quy với factorial.`); },
  ]),
  verdict: kv(
    "Hà nói: 'factorial(0) phải bằng 0 vì không có số nào để nhân'. Hà nói đúng hay sai?",
    "Hà nói: 'factorial(0) = 1 vì đó là ca cơ sở, và nhân với 1 không làm đổi kết quả'. Hà nói đúng hay sai?",
    'Ca cơ sở trả 1 để phép nhân dây chuyền không bị về 0', 'Python tự quy định factorial(0) là 0', 'Ca cơ sở có thể bỏ đi',
    'Sai: nếu ca cơ sở trả 0 thì mọi giai thừa đều thành 0.',
  ),
  read: variantOf([
    () => { const n = randRange(1, 5); return opt(refOf('w8'), `print(factorial(-${n}))`, 'Báo lỗi ValueError vì n âm', ['In ra 1', `In ra -${n}`], [], 'ValueError', 'Dòng bảo vệ n < 0 chặn trước khi tới ca cơ sở. Nếu không có dòng này, n âm sẽ trả 1 một cách sai lặng lẽ.'); },
    () => opt(refOf('w8'), 'print(factorial(3.0))', 'Báo lỗi TypeError vì 3.0 không phải int', ['In ra 6', 'In ra 6.0'], [], 'TypeError', '3.0 trông như số 3 nhưng là float; hàm bắt buộc int nên chặn bằng TypeError.'),
  ]),
};

const w9: ProbeBank = {
  same: () => { const { L, bal } = txGen(randRange(3, 5)); return num(FB, `print(final_balance(${J(L)}))`, bal, `Cộng deposit, trừ withdraw lần lượt: số dư cuối là ${bal}, và không lúc nào âm.`); },
  flip: () => { const b = 10 * randRange(3, 9); const w = 10 * randRange(1, 2); return tNum(`final_balance của một dãy giao dịch trả về ${b}. Giao dịch cuối cùng là withdraw ${w}. Số dư ngay TRƯỚC giao dịch cuối là bao nhiêu?`, b + w, `Rút ${w} xong còn ${b}, nên trước đó là ${b} + ${w} = ${b + w}.`); },
  new: variantOf([
    () => { const k = ['win', 'lose']; const ev = Array.from({ length: randRange(4, 6) }, () => ({ kind: aPick(k), pts: randRange(1, 5) })); const s = ev.reduce((t, e) => t + (e.kind === 'win' ? e.pts : -e.pts), 0); return num(`def score(events):\n    s = 0\n    for e in events:\n        if e["kind"] == "win":\n            s += e["pts"]\n        else:\n            s -= e["pts"]\n    return s\n`, `print(score(${J(ev)}))`, s, `Cùng cách xử lý danh sách dict: win cộng, lose trừ. Tổng là ${s}.`); },
    () => { const k = ['deposit', 'withdraw']; const L: Tx[] = Array.from({ length: randRange(4, 6) }, (_, i) => ({ id: i + 1, type: aPick(k), amount: 10 * randRange(1, 5) })); const t = aPick(k); const c = L.filter((x) => x.type === t).length; return num(`def count_type(txs, kind):\n    c = 0\n    for t in txs:\n        if t["type"] == kind:\n            c += 1\n    return c\n`, `print(count_type(${J(L)}, "${t}"))`, c, `Đếm giao dịch có type là ${t}: ${c}. Cùng cách đọc từng dict rồi lọc theo một trường.`); },
  ]),
  verdict: kv(
    "Hà nói: 'số dư xuống âm giữa chừng nhưng cuối cùng dương thì vẫn chấp nhận được, chỉ cần kiểm tra số dư cuối'. Hà nói đúng hay sai?",
    "Hà nói: 'phải kiểm tra số dư sau MỖI giao dịch, không chỉ ở cuối'. Hà nói đúng hay sai?",
    'Số dư âm giữa chừng nghĩa là có lúc rút quá số tiền đang có', 'Chỉ số dư cuối mới quan trọng', 'Kiểm tra mỗi giao dịch làm chương trình sai',
    'Sai: rút quá số tiền đang có là lỗi dù về sau nạp bù.',
  ),
  read: variantOf([
    () => { const D = 10 * randRange(2, 4); const W = D + 10 * randRange(1, 3); const E = W + 10 * randRange(1, 3); const L: Tx[] = [{ id: 1, type: 'deposit', amount: D }, { id: 2, type: 'withdraw', amount: W }, { id: 3, type: 'deposit', amount: E }]; return opt(FB, `print(final_balance(${J(L)}))`, 'Báo ValueError: số dư âm ngay sau giao dịch thứ hai', [`In ra ${D - W + E}`, `In ra ${D - W}`], [], 'ValueError', `Số dư cuối nếu cộng hết là ${D - W + E} (dương), nhưng sau giao dịch 2 số dư là ${D - W} (âm) nên hàm báo lỗi ngay. Phải kiểm tra từng bước, không chỉ kết quả cuối.`); },
    () => opt(FB, 'print(final_balance([]))', '0: không có giao dịch thì số dư là 0', ['Báo ValueError vì danh sách rỗng', 'In ra None'], ['0'], '', 'Danh sách rỗng là ca hợp lệ: total vẫn là 0 và được trả về.'),
  ]),
};

const w10: ProbeBank = {
  same: () => { const d = dGen(4); const o = iOrd(d); const x = aPick(Object.keys(d)); return num(IO, `print(install_order(${J(d)}).index("${x}"))`, o.indexOf(x), `Kết quả là ${J(o)}: mỗi gói đứng SAU mọi gói nó cần. «${x}» ở vị trí ${o.indexOf(x)} (đếm từ 0).`, `In ra mấy? (vị trí của "${x}" trong kết quả, đếm từ 0)`); },
  flip: () => tChoice('Với một deps hợp lệ bất kỳ, gói đứng ĐẦU TIÊN trong kết quả của install_order phải là gói như thế nào?', ['Gói không phụ thuộc gói nào', 'Gói có nhiều phụ thuộc nhất', 'Gói có tên đứng đầu bảng chữ cái'], 'Một gói chỉ được ghi vào order sau khi mọi phụ thuộc của nó đã được ghi. Gói đầu tiên chưa có gói nào đứng trước nên nó không được phụ thuộc gì.'),
  new: () => {
    const d = dGen(5);
    const x = aPick(Object.keys(d));
    const dp = (nn: string): number => { const dn = d[nn]; if (dn === undefined) throw new Error(`w10.new: thiếu deps của ${nn}`); return dn.length > 0 ? 1 + Math.max(...dn.map(dp)) : 0; };
    return num(`def depth(deps, x):\n    if not deps[x]:\n        return 0\n    return 1 + max(depth(deps, d) for d in deps[x])\n`, `print(depth(${J(d)}, "${x}"))`, dp(x), `Cùng ý đệ quy trên phụ thuộc: độ sâu của «${x}» là chuỗi phụ thuộc dài nhất dưới nó, bằng ${dp(x)}.`, `In ra mấy? (độ sâu của "${x}")`);
  },
  verdict: kv(
    "Hà nói: 'a cần b và b cần a thì vẫn cài được, cứ cài cái nào trước cũng được'. Hà nói đúng hay sai?",
    "Hà nói: 'a cần b và b cần a là vòng phụ thuộc, không có thứ tự cài hợp lệ nào'. Hà nói đúng hay sai?",
    'Mỗi gói phải đứng sau gói nó cần: a sau b và b sau a là mâu thuẫn', 'Python tự chọn thứ tự cho vòng phụ thuộc', 'Vòng phụ thuộc chỉ gây cảnh báo',
    'Sai: không thể có a sau b mà đồng thời b sau a.',
  ),
  read: variantOf([
    () => { const xy = shuffled(['app', 'db', 'web', 'log']).slice(0, 2); const x = at(xy, 0); const y = at(xy, 1); return opt(IO, `print(install_order({"${x}": ["${y}"], "${y}": ["${x}"]}))`, 'Báo lỗi ValueError vì có vòng phụ thuộc', [`['${x}', '${y}']`, `['${y}', '${x}']`], [], 'ValueError', `Đi vào «${x}» rồi «${y}», rồi lại gặp «${x}» khi nó vẫn đang 'doing': đó là vòng, hàm báo ValueError.`); },
    () => opt(IO, 'print(install_order({}))', '[]: không có gói nào thì không cần cài gì', ['Báo ValueError vì deps rỗng', 'None'], ['[]'], '', 'deps rỗng là ca hợp lệ: vòng for không chạy, trả danh sách rỗng.'),
  ]),
};

const w11: ProbeBank = {
  same: () => {
    const s = bStr();
    const r = beJs(s);
    if (r < 0) return num(BE, `print(bracket_error('${s}'))`, r, 'Mọi ngoặc đều khớp và đóng đủ nên trả -1.', 'In ra mấy? (chỉ số lỗi, hoặc -1 nếu không có lỗi)');
    return num(BE, `print(bracket_error('${s}'))`, r, `Lỗi đầu tiên ở chỉ số ${r}: ký tự '${chAt(s, r)}'.`, 'In ra mấy? (chỉ số lỗi, hoặc -1 nếu không có lỗi)');
  },
  flip: () => {
    let s = '';
    let r = -1;
    do { s = bStr(); r = beJs(s); } while (r < 0);
    const ch = chAt(s, r);
    const pool = Array.from(new Set(s + '()[]{}')).filter((c) => c !== ch);
    return aPy(tChoice(`${pre(`${BE}s = '${s}'\nprint(s[bracket_error(s)])`)}Đoạn code in ra ký tự nào?`, [ch, ...shuffled(pool).slice(0, 2)], `bracket_error trả chỉ số ${r}, và s[${r}] = '${ch}'.`), `${BE}s = '${s}'\nprint(s[bracket_error(s)])`, [ch]);
  },
  new: () => {
    const s = Array.from({ length: randRange(6, 9) }, () => aPick(['(', '(', ')', 'x'])).join('');
    let d = 0;
    let m = 0;
    for (const c of s) { if (c === '(') { d += 1; m = Math.max(m, d); } else if (c === ')') { d -= 1; } }
    return num(`def max_depth(s):\n    d = 0\n    best = 0\n    for c in s:\n        if c == "(":\n            d += 1\n            best = max(best, d)\n        elif c == ")":\n            d -= 1\n    return best\n`, `print(max_depth('${s}'))`, m, `Cùng ý theo dõi trạng thái khi duyệt chuỗi, nhưng chỉ cần một bộ đếm thay vì stack: độ sâu lớn nhất là ${m}.`);
  },
  verdict: kv(
    "Hà nói: 'chỉ cần đếm số ngoặc mở bằng số ngoặc đóng là biết chuỗi ngoặc đúng'. Hà nói đúng hay sai?",
    "Hà nói: 'chuỗi \")(\" có số ngoặc mở bằng số ngoặc đóng nhưng vẫn sai, vì đóng xuất hiện trước mở'. Hà nói đúng hay sai?",
    'Thứ tự và loại ngoặc cũng quan trọng, đếm số lượng thôi chưa đủ', 'Đếm bằng nhau luôn là đúng', 'Thứ tự ngoặc không quan trọng',
    "Sai: \")(\" và \"([)]\" đều có số lượng khớp nhưng vẫn sai.",
  ),
  read: variantOf([
    () => { const a = randRange(0, 1) === 1 ? '(' : '['; const b = a === '(' ? ')' : ']'; const s = `${a}${a === '(' ? '[' : '('}${b}`; const r = beJs(s); return opt(BE, `print(bracket_error('${s}'))`, `${r}: chỉ số của ngoặc đóng sai chỗ`, [r === 0 ? '1' : '0', '-1'], [String(r)], '', `Ngoặc '${chAt(s, r)}' ở chỉ số ${r} không khớp với ngoặc mở đang chờ trên đỉnh stack, nên hàm trả ngay chỉ số đó.`); },
    () => { const n = randRange(1, 3); const s = '('.repeat(n) + 'x' + ')'.repeat(n - 1); return opt(BE, `print(bracket_error('${s}'))`, '0: ngoặc mở đầu tiên chưa được đóng', ['-1: vì không có ngoặc nào sai thứ tự', `${s.length - 1}`], ['0'], '', 'Không có ngoặc đóng nào sai chỗ, nhưng cuối chuỗi stack còn một ngoặc mở chưa đóng: hàm trả chỉ số của nó. Thiếu ngoặc đóng cũng là lỗi.'); },
    () => opt(BE, `print(bracket_error(''))`, '-1: chuỗi rỗng không có lỗi', ['Báo lỗi vì chuỗi rỗng', '0'], ['-1'], '', 'Chuỗi rỗng là ca hợp lệ: không có ngoặc nào, nên không có lỗi.'),
  ]),
};

const w12: ProbeBank = {
  same: () => { let t = 0; const ts = Array.from({ length: 6 }, () => (t += randRange(0, 4))); const L = randRange(1, 3); const W = randRange(3, 8); const r = alJs(ts, L, W); const ok = r.filter((b) => b).length; return num(AL, `print(sum(allowed_requests(${J(ts)}, ${L}, ${W})))`, ok, `Kết quả là ${pyBL(r)}: có ${ok} yêu cầu được chấp nhận. Yêu cầu bị từ chối không được ghi vào hàng đợi.`, 'In ra mấy? (số yêu cầu được chấp nhận; True tính là 1)'); },
  flip: () => { const W = randRange(4, 9); const a = randRange(0, 3); const b = a + randRange(0, W - 1); const t = a + W; return aPy(tNum(`${pre(AL)}limit = 2, window = ${W}. Hai yêu cầu lúc ${a} và ${b} đều được chấp nhận. Một yêu cầu thứ ba đến lúc t. Thời điểm t SỚM NHẤT (t ≥ ${b}) mà nó được chấp nhận là bao nhiêu?`, t, `Yêu cầu lúc ${a} chỉ rời cửa sổ khi ${a} <= t - ${W}, tức t >= ${a + W}. Trước đó hàng đợi còn đủ 2 nên bị từ chối.`), AL + `print(allowed_requests([${a}, ${b}, ${t - 1}, ${t}], 2, ${W}))`, ['[True, True, False, True]']); },
  new: variantOf([
    () => { const ts: number[] = []; let t = 0; for (let k = 0; k < randRange(6, 8); k++) { t += randRange(0, 3); ts.push(t); } const W = randRange(3, 6); let best = 0; let l = 0; for (let r = 0; r < ts.length; r++) { while (at(ts, r) - at(ts, l) >= W) l += 1; best = Math.max(best, r - l + 1); } return num(`def max_in_window(times, window):\n    best = 0\n    left = 0\n    for right in range(len(times)):\n        while times[right] - times[left] >= window:\n            left += 1\n        best = max(best, right - left + 1)\n    return best\n`, `print(max_in_window(${J(ts)}, ${W}))`, best, `Cùng ý 'cửa sổ trượt': bỏ mốc quá cũ khỏi đầu rồi đếm. Nhiều nhất ${best} mốc nằm trong một cửa sổ ${W}.`); },
    () => { let t = 0; const ts = Array.from({ length: randRange(5, 7) }, () => (t += randRange(0, 3))); const W = randRange(3, 6); const now = at(ts, ts.length - 1) + randRange(0, 2); const c = ts.filter((x) => x > now - W).length; return num(`def count_recent(times, now, window):\n    q = list(times)\n    while q and q[0] <= now - window:\n        q.pop(0)\n    return len(q)\n`, `print(count_recent(${J(ts)}, ${now}, ${W}))`, c, `Bỏ khỏi đầu hàng đợi mọi mốc <= ${now} - ${W} = ${now - W}; còn ${c} mốc. Cùng ý loại mốc quá cũ như allowed_requests.`); },
  ]),
  verdict: kv(
    "Hà nói: 'trong allowed_requests, yêu cầu bị TỪ CHỐI vẫn được thêm vào hàng đợi q'. Hà nói đúng hay sai về code đã học?",
    "Hà nói: 'trong allowed_requests, chỉ yêu cầu được CHẤP NHẬN mới được thêm vào q; đây là một giả định nghiệp vụ phải ghi rõ'. Hà nói đúng hay sai?",
    'Dòng q.append(t) nằm trong nhánh chấp nhận, nhánh từ chối chỉ ghi False', 'Mọi yêu cầu đều vào q', 'Hàm không dùng q để đếm',
    'Sai: nhánh else chỉ thêm False vào result, không đụng tới q.',
  ),
  read: variantOf([
    () => { const W = randRange(3, 9); return opt(AL, `print(allowed_requests([0, ${W}], 1, ${W}))`, `[True, True]: ở thời điểm ${W}, yêu cầu lúc 0 đã ra khỏi cửa sổ`, ['[True, False]', '[False, False]'], ['[True, True]'], '', `Điều kiện bỏ mốc cũ là q[0] <= t - window, tức 0 <= ${W} - ${W} = 0: đúng (có dấu bằng), nên mốc 0 bị bỏ và yêu cầu mới được nhận. Ca biên có dấu bằng quyết định kết quả.`); },
    () => { const W = randRange(5, 9); return opt(AL, `print(allowed_requests([0, 1, ${W - 1}], 2, ${W}))`, '[True, True, False]', ['[True, True, True]', '[True, False, False]'], ['[True, True, False]'], '', `Ở t = ${W - 1}: 0 <= ${W - 1} - ${W} = -1 là sai, nên mốc 0 chưa ra khỏi cửa sổ, hàng đợi còn đủ 2 và yêu cầu bị từ chối.`); },
  ]),
};

export const codeAppsBanks: Record<string, ProbeBank> = { w8, w9, w10, w11, w12 };
