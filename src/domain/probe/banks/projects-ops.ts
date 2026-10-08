// Ngân hàng probe vận hành: rl1 (rate limiter), ap1 (cache), ap2 (job queue), ap3 (stack Undo/ngoặc).
// Port từ main:probe-last.js. Helpers local (typed): zRl, zRlPy, zTimes, zRule, zSeq, zJobs, zBr, zBrPy, zBrR, zBrGen.

import type { ProbeBank } from '../../types';
import { randRange, shuffled, at, pre, pJ, tNum, tChoice, kv, aPick, aPy, aNum, aStr, variantOf } from '../builders';

/** Mô phỏng rate limiter: 1 = chấp nhận, 0 = từ chối (port của zRl) */
function zRl(times: number[], L: number, W: number): number[] {
  const q: number[] = [], acc: number[] = [];
  for (const t of times) {
    while (q.length && at(q, 0) <= t - W) q.shift();
    if (q.length < L) { q.push(t); acc.push(1); } else acc.push(0);
  }
  return acc;
}

/** Code Python mô phỏng rate limiter (verbatim, port của zRlPy) */
const zRlPy = `def sim(times, L, W):
    q = []; out = []
    for t in times:
        while q and q[0] <= t - W:
            q.pop(0)
        if len(q) < L:
            q.append(t); out.append(1)
        else:
            out.append(0)
    return out
`;

/** Các thời điểm yêu cầu đến, tăng dần (port của zTimes) */
function zTimes(n: number): number[] {
  let t = 0;
  return Array.from({ length: n }, () => (t += randRange(0, 2)));
}

/** Diễn giải quy tắc rate limiter (port của zRule) */
function zRule(L: number, W: number): string {
  return `Giới hạn: tối đa ${L} yêu cầu trong mỗi ${W} giây. Với yêu cầu đến lúc t, chỉ các thời điểm đã chấp nhận LỚN HƠN t - ${W} còn được tính. Yêu cầu bị từ chối không được ghi lại.`;
}

/** Dãy khóa cache ngẫu nhiên (port của zSeq) */
function zSeq(n: number): string[] {
  return Array.from({ length: n }, () => aPick(['A', 'B', 'C', 'D']));
}

/** Một thao tác hàng đợi công việc (port của phần tử trong zJobs) */
interface JobOp { op: 'add' | 'run'; name: string }

/** Sinh dãy thao tác add/run ngẫu nhiên, luôn kết thúc bằng run (port của zJobs) */
function zJobs(): JobOp[] {
  const names = shuffled(['A', 'B', 'C', 'D', 'E']);
  let i = 0;
  const n = randRange(4, 5), seq: JobOp[] = [];
  for (let k = 0; k < n; k++) {
    const nm = at(names, i); i++;
    seq.push({ op: 'add', name: nm });
    if (k >= 1 && Math.random() < 0.6) seq.push({ op: 'run', name: '' });
  }
  seq.push({ op: 'run', name: '' });
  return seq;
}

/** Mã kết quả kiểm ngoặc: OK hợp lệ, R1/R2/R3 là ba kiểu lỗi (port của zBr) */
type BrCode = 'OK' | 'R1' | 'R2' | 'R3';
function zBr(s: string): BrCode {
  const st: string[] = [];
  const m: Record<string, string> = { ')': '(', ']': '[' };
  for (const ch of s) {
    if ('(['.includes(ch)) st.push(ch);
    else {
      if (st.length === 0) return 'R2';
      if (st.pop() !== m[ch]) return 'R3';
    }
  }
  return st.length ? 'R1' : 'OK';
}

/** Code Python kiểm ngoặc (verbatim, port của zBrPy) */
const zBrPy = `def chk(s):
    st = []
    m = {')': '(', ']': '['}
    for ch in s:
        if ch in '([':
            st.append(ch)
        else:
            if not st:
                return 'R2'
            if st.pop() != m[ch]:
                return 'R3'
    return 'R1' if st else 'OK'
`;

/** Diễn giải mã lỗi ngoặc (port của zBrR) */
const zBrR: Record<string, string> = { R1: 'còn ngoặc mở chưa được đóng', R2: 'gặp ngoặc đóng khi chưa có ngoặc mở nào', R3: 'ngoặc đóng không khớp với ngoặc mở gần nhất' };

/** Sinh chuỗi ngoặc ngẫu nhiên (port của zBrGen) */
function zBrGen(): string {
  return Array.from({ length: randRange(3, 6) }, () => aPick(['(', ')', '[', ']'])).join('');
}

/* ===== rl1: rate limiter ===== */
const rl1: ProbeBank = {
  same: () => {
    const L = randRange(1, 3), W = randRange(3, 5), T = zTimes(randRange(6, 8)), a = zRl(T, L, W), n = a.reduce((x, y) => x + y, 0);
    return aPy(tNum(`${zRule(L, W)} Các yêu cầu đến lúc: ${pJ(T)}. Có bao nhiêu yêu cầu được chấp nhận?`, n, `Dò từng yêu cầu: kết quả (1 là chấp nhận) ${a.join(', ')}.`), `${zRlPy}print(sum(sim(${pJ(T)}, ${L}, ${W})))`, [String(n)]);
  },
  flip: () => {
    const W = randRange(3, 6), t1 = randRange(1, 3), t2 = t1 + randRange(1, 2);
    return aPy(tNum(`${zRule(2, W)} Hàng đợi đang giữ [${t1}, ${t2}]. Yêu cầu mới sớm nhất đến lúc giây thứ mấy thì được chấp nhận? (Giây là số nguyên.)`, t1 + W, `Thời điểm ${t1} chỉ hết hạn khi t - ${W} >= ${t1}, tức t >= ${t1 + W}. Đến lúc đó hàng còn 1 chỗ trống.`), `${zRlPy}t = ${t2}\nwhile sim([${t1}, ${t2}, t], 2, ${W})[2] == 0:\n    t += 1\nprint(t)`, [String(t1 + W)]);
  },
  new: () => {
    const T2 = zTimes(randRange(6, 8)).map((x) => x * 2), b = zRl(T2, 3, 10), r2 = b.filter((x) => !x).length;
    return aPy(tNum(`Tối đa 3 lần đăng nhập sai trong mỗi 10 phút (cùng quy tắc: chỉ tính thời điểm lớn hơn t - 10, lần bị từ chối không ghi). Các lần thử đến lúc (phút): ${pJ(T2)}. Có bao nhiêu lần thử bị TỪ CHỐI?`, r2, `Dò từng lần: ${b.join(', ')} (0 là bị từ chối).`), `${zRlPy}print(sim(${pJ(T2)}, 3, 10).count(0))`, [String(r2)]);
  },
  verdict: kv(
    "Hà nói: 'yêu cầu bị từ chối cũng phải ghi vào hàng đợi, nếu không người dùng sẽ gửi dồn dập mãi'. Hà nói đúng hay sai (với giả định đã chọn: chỉ ghi yêu cầu được chấp nhận)?",
    "Hà nói: 'với giả định đã chọn, yêu cầu bị từ chối không làm hàng đợi dài thêm'. Hà nói đúng hay sai?",
    'Chỉ yêu cầu được chấp nhận mới chiếm chỗ trong cửa sổ', 'Mọi yêu cầu đều chiếm chỗ', 'Hàng đợi luôn đầy',
    'Sai: theo giả định đã chọn, chỉ ghi yêu cầu được chấp nhận.',
  ),
  read: () => {
    const W = randRange(3, 5), a = randRange(1, 3), b = a + 1, edge = Math.random() < 0.5, t = a + W - (edge ? 0 : 1), acc = at(zRl([a, b, t], 2, W), 2);
    return aPy(tChoice(`${zRule(2, W)} Hàng đợi đang giữ [${a}, ${b}]. Yêu cầu mới đến lúc ${t}. Chấp nhận hay từ chối?`, acc ? ['Chấp nhận', 'Từ chối', 'Không đủ thông tin'] : ['Từ chối', 'Chấp nhận', 'Không đủ thông tin'], acc ? `${a} > ${t} - ${W} = ${t - W}? Không (${a} <= ${t - W}), nên ${a} đã hết hạn. Còn chỗ: chấp nhận.` : `${a} > ${t} - ${W} = ${t - W}? Có, nên ${a} vẫn còn tính. Cả hai chỗ đã đầy: từ chối.`), `${zRlPy}print(sim([${a}, ${b}, ${t}], 2, ${W})[2])`, [String(acc)]);
  },
};
rl1.verdict = variantOf([rl1.verdict, kv(
  "Nam nói: 'thời điểm cũ nhất nằm ở cuối hàng đợi'. Nam nói đúng hay sai?",
  "Nam nói: 'thời điểm cũ nhất nằm ở đầu hàng đợi và hết hạn trước'. Nam nói đúng hay sai?",
  'Vào trước thì ra trước: queue', 'Vào sau thì ra trước', 'Thứ tự không quan trọng',
  'Sai: cũ nhất ở đầu hàng.',
)]);
rl1.read = variantOf([rl1.read, () => {
  const W = randRange(3, 5), L = 3, t = 4 + W - 1, cnt = [1, 2, 3].filter((x) => x > t - W).length;
  return aPy(aNum(`${zRule(L, W)} Hàng đợi đang giữ [1, 2, 3]. Yêu cầu mới đến lúc ${t}. Trước khi quyết định, còn BAO NHIÊU thời điểm trong cửa sổ (lớn hơn ${t - W})?`, cnt, `Giữ lại các thời điểm > ${t - W}: ${cnt} cái.`, [3 - cnt, 3]), `print(len([x for x in [1, 2, 3] if x > ${t - W}]))`, [String(cnt)]);
}]);

/* ===== ap1: cache ===== */
const ap1: ProbeBank = {
  same: () => {
    const s = zSeq(randRange(6, 8)), seen = new Set<string>();
    let h = 0;
    s.forEach((k) => { if (seen.has(k)) h++; else seen.add(k); });
    const c = `seen = set()\nhits = 0\nfor k in ${pJ(s)}:\n    if k in seen:\n        hits += 1\n    else:\n        seen.add(k)\nprint(hits)`;
    return aPy(tNum(`${pre(c)}Đoạn này mô phỏng cache: gặp lại khóa đã thấy là trúng (hit). In ra mấy?`, h, `Chỉ ${seen.size} khóa khác nhau nên ${seen.size} lần trượt, còn lại ${h} lần trúng.`), c, [String(h)]);
  },
  flip: () => {
    const n = randRange(6, 10), h = randRange(2, n - 2), T = 100 * (n - h) + h;
    return tNum(`Hỏi cơ sở dữ liệu (trượt cache) mất 100ms, tra cache (trúng) mất 1ms. ${n} lần gọi tốn tổng cộng ${T}ms. Có bao nhiêu lần trúng cache?`, h, `Nếu h lần trúng: 100 x (${n} - h) + h = ${T}, suy ra h = ${h}.`);
  },
  new: () => {
    const ttl = randRange(3, 8), q = randRange(1, ttl + 3), old = q < ttl;
    return tChoice(`Cache giữ giá sản phẩm trong ${ttl} phút kể từ lúc lưu (phút 0). Ở phút 1, giá thật trong cơ sở dữ liệu đổi. Ở phút ${q}, người dùng hỏi giá. Họ thấy giá nào? (Hết hạn đúng phút ${ttl}: lúc đó cache đã hết hạn.)`, old ? ['Giá cũ (cache chưa hết hạn)', 'Giá mới', 'Không thấy giá nào'] : ['Giá mới (cache đã hết hạn, hỏi lại cơ sở dữ liệu)', 'Giá cũ', 'Không thấy giá nào'], old ? `Phút ${q} < ${ttl}: cache còn hạn nên trả giá cũ (dữ liệu cũ, stale).` : `Phút ${q} >= ${ttl}: cache hết hạn, phải hỏi lại và lấy giá mới.`);
  },
  verdict: kv(
    "Hà nói: 'cache luôn cho dữ liệu mới nhất'. Hà nói đúng hay sai?",
    "Hà nói: 'cache có thể giữ dữ liệu cũ, nên cần hạn dùng hoặc cách làm mới'. Hà nói đúng hay sai?",
    'Cache không tự biết dữ liệu gốc đã đổi', 'Cache luôn đồng bộ', 'Cache tự cập nhật',
    'Sai: cache có thể cũ (stale).',
  ),
  read: () => {
    const s = zSeq(randRange(6, 8)), d = new Set(s).size, h = s.length - d;
    const c = `print(len(set(${pJ(s)})))`;
    return aPy(aNum(`Các khóa gọi lần lượt: ${pJ(s)}. Cache rỗng lúc đầu. Đề hỏi: có bao nhiêu lần TRƯỢT cache (không hỏi trúng)?`, d, `Mỗi khóa trượt đúng lần đầu gặp: ${d} khóa khác nhau nên ${d} lần trượt. ${h} là số lần trúng.`, [h, s.length]), c, [String(d)]);
  },
};
ap1.new = variantOf([ap1.new, () => {
  const n = randRange(2, 5) * 4, h = (n / 4) * randRange(1, 3), pct = (h * 100) / n;
  return tNum(`Một cache được gọi ${n} lần, trúng ${h} lần. Tỉ lệ trúng (hit rate) là bao nhiêu phần trăm?`, pct, `${h} / ${n} x 100 = ${pct}%.`);
}]);
ap1.verdict = variantOf([ap1.verdict, kv(
  "Nam nói: 'cache dùng list vì list tra nhanh nhất'. Nam nói đúng hay sai?",
  "Nam nói: 'cache dùng dictionary vì tra theo khóa gần như một bước'. Nam nói đúng hay sai?",
  'Dictionary tra theo khóa là O(1)', 'List tra theo khóa là O(1)', 'Cache không cần cấu trúc dữ liệu',
  'Sai: list phải duyệt từng phần tử.',
)]);
ap1.read = variantOf([ap1.read, () => {
  const s = zSeq(randRange(6, 8)), first = at(s, 0);
  return aPy(tChoice(`Cache rỗng. Các khóa gọi lần lượt: ${pJ(s)}. Lần gọi ĐẦU TIÊN (khóa ${first}) là trúng hay trượt?`, ['Trượt, vì cache còn rỗng', 'Trúng', 'Không đủ thông tin'], 'Chưa có gì trong cache thì lần đầu luôn phải hỏi nguồn gốc.'), 'print(0)', ['0']);
}]);

/* ===== ap2: job queue ===== */
const ap2: ProbeBank = {
  same: () => {
    const seq = zJobs(), q: string[] = [], ran: string[] = [];
    seq.forEach((o) => {
      if (o.op === 'add') q.push(o.name);
      else if (q.length) { ran.push(at(q, 0)); q.shift(); }
    });
    const c = 'q = []\nran = []\n' + seq.map((o) => (o.op === 'add' ? `q.append("${o.name}")` : 'ran.append(q.pop(0))')).join('\n') + '\nprint(len(q))';
    return aPy(tNum(`${pre(c)}Công việc xếp hàng chờ xử lý (append là thêm việc, pop(0) lấy việc ra làm). Cuối cùng còn bao nhiêu việc đang chờ?`, q.length, `Đã làm ${ran.length} việc (${ran.join(', ')}), còn ${q.length} việc.`), c, [String(q.length)]);
  },
  flip: () => {
    const done = randRange(2, 5), left = randRange(1, 4);
    return tNum(`Hàng đợi công việc đã xử lý xong ${done} việc và còn ${left} việc chờ. Không có việc nào bị bỏ. Ban đầu có tổng cộng bao nhiêu việc?`, done + left, `${done} + ${left} = ${done + left}.`);
  },
  new: () => {
    const m = randRange(3, 9), k = randRange(2, 4);
    return tNum(`Máy xử lý đúng 1 việc mỗi lần, mỗi việc mất ${k} giây, theo thứ tự đến. ${m + 3} việc đến cùng lúc. Việc thứ ${m} (đếm từ 1) phải chờ bao nhiêu giây trước khi BẮT ĐẦU?`, (m - 1) * k, `Phải chờ ${m - 1} việc đứng trước, mỗi việc ${k} giây: ${(m - 1) * k}.`);
  },
  verdict: kv(
    "Hà nói: 'hàng chờ in dùng stack cho công bằng'. Hà nói đúng hay sai?",
    "Hà nói: 'hàng chờ in dùng queue vì việc đến trước được làm trước'. Hà nói đúng hay sai?",
    'Stack làm việc đến sau chen lên trước', 'Stack công bằng hơn', 'Không khác nhau',
    'Sai: stack khiến việc đến trước phải chờ mãi.',
  ),
  read: () => {
    const n = shuffled(['A', 'B', 'C', 'D']).slice(0, 3);
    const c = `q = []\n${n.map((x) => `q.append("${x}")`).join('\n')}\nprint(q.pop())`;
    return aPy(aStr(`${pre(c)}Hàng chờ xử lý việc, nhưng đọc kỹ lệnh lấy việc ra: print(q.pop()) (không có số 0). Việc nào được lấy ra?`, at(n, 2), n, `pop() lấy phần tử CUỐI (như stack), tức ${at(n, 2)}, không phải việc đến đầu tiên (${at(n, 0)}). Hàng chờ đúng phải dùng pop(0).`), c, [at(n, 2)]);
  },
};
ap2.verdict = variantOf([ap2.verdict, kv(
  "Nam nói: 'khi việc dồn lên đột ngột, tốt nhất là xử lý hết cùng lúc'. Nam nói đúng hay sai?",
  "Nam nói: 'cho việc vào hàng đợi và xử lý dần theo khả năng giúp hệ thống không quá tải'. Nam nói đúng hay sai?",
  'Làm hết cùng lúc có thể làm sập máy', 'Xử lý cùng lúc luôn nhanh hơn', 'Từ chối mọi việc',
  'Sai: dồn cùng lúc dễ quá tải.',
)]);
ap2.read = variantOf([ap2.read, () => {
  const a = randRange(2, 5), b = randRange(1, a - 1 || 1);
  const c = `q = []\nfor i in range(${a}):\n    q.append(i)\nfor i in range(${b}):\n    q.pop(0)\nprint(q[0])`;
  return aPy(aNum(`${pre(c)}Đọc kỹ: in ra phần tử ĐẦU hàng còn lại. Mấy?`, b, `Đã lấy ra ${b} việc đầu (0 đến ${b - 1}), việc đầu hàng giờ là ${b}.`, [a - 1, 0]), c, [String(b)]);
}]);

/* ===== ap3: stack Undo và ngoặc ===== */
const ap3: ProbeBank = {
  same: () => {
    const n = randRange(3, 6), u = randRange(1, n - 1);
    const c = 'history = []\n' + Array.from({ length: n }, (_, i) => `history.append("${String.fromCharCode(97 + i)}")`).join('\n') + '\n' + Array.from({ length: u }, () => 'history.pop()').join('\n') + '\nprint(len(history))';
    return aPy(tNum(`${pre(c)}Mỗi append là một thao tác soạn thảo, mỗi pop là một lần Undo. Còn bao nhiêu thao tác trong lịch sử?`, n - u, `${n} thao tác, ${u} lần hoàn tác: ${n - u}.`), c, [String(n - u)]);
  },
  flip: () => {
    const u = randRange(1, 3), r = randRange(1, 4);
    return tNum(`Sau khi bấm Undo ${u} lần, lịch sử còn ${r} thao tác. Ban đầu người dùng đã thực hiện bao nhiêu thao tác?`, u + r, `${r} + ${u} = ${u + r}.`);
  },
  new: () => {
    let s = zBrGen();
    while (zBr(s) === 'OK' && Math.random() < 0.5) s = zBrGen();
    const r = zBr(s), c = `${zBrPy}print(chk('${s}'))`;
    return aPy(tChoice(`Kiểm tra chuỗi ngoặc "${s}" bằng stack (mở thì cất vào, đóng thì lấy ra so khớp). Kết luận?`, r === 'OK' ? ['Hợp lệ', 'Không hợp lệ', 'Không đủ thông tin'] : [`Không hợp lệ: ${zBrR[r]}`, 'Hợp lệ', `Không hợp lệ: ${zBrR[r === 'R1' ? 'R2' : 'R1']}`], r === 'OK' ? 'Mọi ngoặc đóng đều khớp ngoặc mở gần nhất và stack rỗng ở cuối.' : `Dừng theo stack: ${zBrR[r]}.`), c, [r]);
  },
  verdict: kv(
    "Hà nói: 'Undo hoàn tác thao tác đầu tiên mà người dùng đã làm'. Hà nói đúng hay sai?",
    "Hà nói: 'Undo hoàn tác thao tác gần nhất, vì stack vào sau ra trước'. Hà nói đúng hay sai?",
    'Ngoặc/thao tác mới nhất phải được xử lý trước', 'Thao tác cũ nhất ra trước', 'Thứ tự ngẫu nhiên',
    'Sai: Undo hoàn tác thao tác gần nhất.',
  ),
  read: () => {
    const S = ['(()', '())', ')(', '[(])', '(]'], s = aPick(S), r = zBr(s), c = `${zBrPy}print(chk('${s}'))`;
    const eq = s.split('(').length - 1 === s.split(')').length - 1 && !s.includes('[');
    return aPy(tChoice(`Chuỗi "${s}". ${eq ? 'Số ngoặc mở bằng số ngoặc đóng. ' : ''}Có hợp lệ không?`, [`Không hợp lệ: ${zBrR[r]}`, 'Hợp lệ, vì ngoặc đủ cặp', `Không hợp lệ: ${zBrR[r === 'R1' ? 'R2' : 'R1']}`], `Đếm đủ cặp chưa đủ: thứ tự mới quan trọng. Stack báo: ${zBrR[r]}.`), c, [r]);
  },
};
ap3.verdict = variantOf([ap3.verdict, kv(
  "Nam nói: 'chuỗi ([)] hợp lệ vì có đủ ngoặc mở và đóng'. Nam nói đúng hay sai?",
  "Nam nói: 'chuỗi ([)] không hợp lệ vì ] phải đóng [ chứ không phải ('. Nam nói đúng hay sai?",
  'Ngoặc mở gần nhất phải được đóng trước', 'Chỉ cần đủ số lượng', 'Thứ tự không quan trọng',
  'Sai: lồng nhau phải đóng đúng thứ tự.',
)]);
ap3.new = variantOf([ap3.new, () => {
  const n = randRange(3, 5), b = randRange(1, n - 1), pg = ['A', 'B', 'C', 'D', 'E'].slice(0, n);
  return tChoice(`Trình duyệt: mở lần lượt các trang ${pg.join(', ')} (mỗi trang mới đẩy vào lịch sử). Bấm Back ${b} lần. Đang ở trang nào?`, [at(pg, n - 1 - b), ...pg.filter((_, i) => i !== n - 1 - b).slice(0, 2)], `Back lùi về trang trước trong lịch sử: stack, bỏ ${b} trang trên cùng.`);
}]);

export const opsBanks: Record<string, ProbeBank> = { rl1, ap1, ap2, ap3 };
