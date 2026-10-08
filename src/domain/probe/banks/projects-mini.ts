// Ngân hàng probe mini project: m1 (yêu cầu thiếu chi tiết), m2 (liệt kê giao dịch xấu), m3 (đường ống).
// Port từ main:probe-last.js. Helpers local (typed): zRepr, zValid, zTxs, zPyValid, zM1Doms, zBal.

import type { ProbeBank } from '../../types';
import { randRange, shuffled, at, pre, pJ, tNum, tChoice, kv, aPick, aPy, aNum, variantOf } from '../builders';

/** Giao dịch: trường có thể vắng mặt khi dữ liệu hỏng (dạng object của zRepr/zValid/zTxs) */
interface Tx { id?: number | undefined; type?: string | undefined; amount?: number | undefined }

/** Bản ghi người dùng (email/tuổi) trong câu hỏi m2.new (port từ main:probe-last.js) */
interface UserRec { email: string; age: number }

/** Biểu diễn mảng object kiểu Python: [{'id': 1, 'type': 'deposit', 'amount': 20}] (port của zRepr) */
function zRepr(L: Tx[] | UserRec[]): string {
  const fmt = (v: string | number | undefined): string => (typeof v == 'string' ? `'${v}'` : String(v ?? ''));
  return '[' + L.map((t) => '{' + (Object.entries(t) as Array<[string, string | number | undefined]>).map(([k, v]) => `'${k}': ${fmt(v)}`).join(', ') + '}').join(', ') + ']';
}

/** Đếm giao dịch KHÔNG hợp lệ: trùng id, type lạ, amount âm (port của zValid) */
function zValid(L: Tx[]): number {
  const seen = new Set<number>();
  let bad = 0;
  for (const t of L) {
    const id = t.id;
    const dup = id !== undefined && seen.has(id);
    if (id !== undefined) seen.add(id);
    if (dup || (t.type !== 'deposit' && t.type !== 'withdraw') || (t.amount ?? 0) < 0) bad++;
  }
  return bad;
}

/** Sinh n giao dịch rồi gieo lỗi theo faults: dup/type/neg (port của zTxs) */
function zTxs(n: number, faults: string[]): Tx[] {
  const L: Tx[] = Array.from({ length: n }, (_, i) => ({ id: i + 1, type: aPick(['deposit', 'withdraw']), amount: randRange(2, 9) * 10 }));
  const pos = shuffled(Array.from({ length: n - 1 }, (_, i) => i + 1));
  faults.forEach((f, i) => {
    const p = at(pos, i), tx = at(L, p);
    if (f == 'dup') tx.id = at(L, p - 1).id;
    else if (f == 'type') tx.type = aPick(['gift', 'refund']);
    else tx.amount = -(typeof tx.amount === 'number' ? tx.amount : 0);
  });
  return L;
}

/** Code Python đếm giao dịch hỏng (verbatim, port của zPyValid) */
const zPyValid = `def bad(L):
    seen = set(); n = 0
    for t in L:
        dup = t['id'] in seen
        seen.add(t['id'])
        if dup or t['type'] not in ('deposit', 'withdraw') or t['amount'] < 0:
            n += 1
    return n
`;

/** Cặp (yêu cầu mơ hồ, câu hỏi làm rõ) của m1 (port của zM1Doms) */
const zM1Doms: string[][] = [
  ["Yêu cầu: 'tính tổng tiền của giỏ hàng'.", 'Giá khuyến mãi, thuế và phí ship có tính vào tổng không?'],
  ["Yêu cầu: 'tính điểm trung bình của học sinh'.", 'Ô điểm bỏ trống khác điểm 0 không, có tính vào trung bình không?'],
  ["Yêu cầu: 'tính tuổi từ ngày sinh'.", 'Tính theo ngày hôm nay hay ngày cố định, và ngày sinh ở tương lai thì xử lý sao?'],
  ["Yêu cầu: 'tính số ngày nghỉ phép còn lại của nhân viên'.", 'Ngày nghỉ nửa buổi và ngày lễ trùng ngày nghỉ có tính không?'],
];

/** Cộng dồn; first = vị trí (đếm từ 1) đầu tiên làm số dư âm, 0 nếu không có (port của zBal) */
function zBal(a: number[]): { s: number; first: number } {
  let s = 0, first = 0;
  a.forEach((x, i) => { s += x; if (s < 0 && !first) first = i + 1; });
  return { s, first };
}

/* ===== m1: yêu cầu thật luôn thiếu chi tiết ===== */
const m1: ProbeBank = {
  same: () => {
    const n = randRange(4, 6);
    const badSet = new Set(shuffled(Array.from({ length: n }, (_, i) => i)).slice(0, randRange(1, 2)));
    const L: Tx[] = Array.from({ length: n }, (_, i) => {
      const t: Tx = { id: i + 1, type: 'deposit', amount: randRange(2, 9) * 10 };
      if (!badSet.has(i)) return t;
      const drop = aPick(['id', 'type', 'amount'] as const);
      const kept: Tx = { id: t.id, type: t.type, amount: t.amount };
      if (drop === 'id') delete kept.id;
      else if (drop === 'type') delete kept.type;
      else delete kept.amount;
      return kept;
    });
    const ok = L.filter((t) => 'id' in t && 'type' in t && 'amount' in t).length;
    const c = `txs = ${zRepr(L)}\nprint(sum(1 for t in txs if 'id' in t and 'type' in t and 'amount' in t))`;
    return aPy(tNum(`Mỗi giao dịch BẮT BUỘC có đủ 3 trường: id, type, amount. Thiếu một trường là dữ liệu hỏng.${pre(`txs = ${zRepr(L)}`)}Có bao nhiêu giao dịch đủ cả 3 trường?`, ok, `Đếm giao dịch có đủ id, type, amount: ${ok}. ${n - ok} giao dịch thiếu trường.`), c, [String(ok)]);
  },
  flip: () => {
    const n = randRange(6, 12), t = randRange(1, 3);
    return tNum(`Một lô có ${n} giao dịch. Mỗi giao dịch hỏng thiếu đúng 1 trường, và tổng cộng thiếu ${t} trường. Có bao nhiêu giao dịch đủ trường?`, n - t, `${t} giao dịch hỏng (mỗi cái thiếu 1 trường): ${n} - ${t} = ${n - t}.`);
  },
  new: () => {
    const d = aPick(zM1Doms);
    return tChoice(`${at(d, 0)} Câu hỏi làm rõ nào quan trọng nhất TRƯỚC khi viết code?`, [at(d, 1), 'Dùng màu nào để hiển thị kết quả?', 'Viết bằng laptop hãng nào?'], 'Câu hỏi ảnh hưởng tới kết quả thật (tiền, điểm, ngày) phải được làm rõ trước. Giao diện, máy móc thì tính sau.');
  },
  verdict: kv(
    "Hà nói: 'khách chưa trả lời thì cứ tự chọn một cách rồi làm, không cần báo ai'. Hà nói đúng hay sai?",
    "Hà nói: 'khách chưa trả lời thì ghi rõ giả định mình chọn và gửi để họ xác nhận'. Hà nói đúng hay sai?",
    'Giả định không ghi ra sẽ thành bất ngờ sau này', 'Tự chọn là đủ', 'Không cần làm gì',
    'Sai: giả định phải được ghi ra giấy trắng mực đen.',
  ),
  read: () => {
    const bal = randRange(2, 5) * 10, w = bal + randRange(1, 4) * 10;
    return tChoice(`Khách đã xác nhận: "số dư KHÔNG BAO GIỜ được âm". Số dư đang là ${bal}, có yêu cầu rút ${w}. Hệ thống nên làm gì?`, ['Từ chối giao dịch và báo rõ lý do (rút quá số dư)', `Cho phép, số dư thành ${bal - w}`, 'Bỏ qua im lặng, coi như chưa có yêu cầu'], `Số dư sau khi rút là ${bal - w}, vi phạm yêu cầu đã chốt. Phải từ chối và nói rõ, không được im lặng.`);
  },
};
m1.verdict = variantOf([m1.verdict, kv(
  "Nam nói: 'yêu cầu ngắn gọn thì đã đủ rõ, không cần hỏi lại'. Nam nói đúng hay sai?",
  "Nam nói: 'yêu cầu ngắn thường thiếu chi tiết, nên cần hỏi lại trước khi code'. Nam nói đúng hay sai?",
  'Đoán sai yêu cầu thì code đẹp cũng vô ích', 'Ngắn nghĩa là đủ', 'Code xong rồi hỏi sau',
  'Sai: yêu cầu ngắn là chỗ dễ hiểu sai nhất.',
)]);
m1.read = variantOf([m1.read, () => tChoice(
  'Khách đã xác nhận: "giao dịch có amount bằng 0 là HỢP LỆ". Có một giao dịch amount = 0. Hệ thống nên làm gì?',
  ['Chấp nhận, vì yêu cầu đã chốt là hợp lệ', 'Từ chối, vì 0 trông vô nghĩa', 'Bỏ qua im lặng'],
  'Quy tắc nghiệp vụ do khách chốt, không phải do mình thấy hợp lý hay không. Đọc kỹ yêu cầu.',
)]);

/* ===== m2: liệt kê giao dịch không hợp lệ trước khi code ===== */
const m2: ProbeBank = {
  same: () => {
    const L = zTxs(randRange(5, 6), shuffled(['dup', 'type', 'neg', 'dup', 'neg']).slice(0, randRange(2, 3))), bad = zValid(L);
    const c = `${zPyValid}print(bad(${zRepr(L)}))`;
    return aPy(tNum(`Quy tắc: mỗi id chỉ xuất hiện một lần (lần đầu hợp lệ, các lần lặp lại là lỗi); type chỉ là 'deposit' hoặc 'withdraw'; amount không được âm.${pre(`txs = ${zRepr(L)}`)}Có bao nhiêu giao dịch KHÔNG hợp lệ?`, bad, `Dò từng giao dịch theo ba quy tắc: ${bad} giao dịch vi phạm.`), c, [String(bad)]);
  },
  flip: () => {
    const a = randRange(1, 3), b = randRange(1, 3), r = randRange(1, 3);
    return tNum(`Một lô có ${a + b + r} giao dịch lỗi (mỗi cái chỉ vi phạm một quy tắc): ${a} cái trùng id, ${b} cái sai type, còn lại là amount âm. Có bao nhiêu giao dịch amount âm?`, r, `${a + b + r} - ${a} - ${b} = ${r}.`);
  },
  new: () => {
    const emails = ['a@x.com', 'b@x.com', 'c@x.com', 'd@x.com', 'e@x.com'];
    const u: UserRec[] = Array.from({ length: randRange(4, 5) }, (_, i) => ({ email: at(emails, i), age: randRange(18, 60) }));
    const pos = shuffled(u.map((_, i) => i));
    if (u.length > 1) { const u0 = at(u, at(pos, 0)); u0.email = u0.email.replace('@', ''); }
    at(u, at(pos, 1)).age = aPick([-3, 150]);
    if (Math.random() < 0.6) { const p2 = at(pos, 2); at(u, p2).email = at(u, p2 === 0 ? 1 : 0).email; }
    const seen = new Set<string>();
    let bad = 0;
    for (const t of u) { const dup = seen.has(t.email); seen.add(t.email); if (!t.email.includes('@') || t.age < 0 || t.age > 120 || dup) bad++; }
    const c = `def bad(L):\n    seen = set(); n = 0\n    for t in L:\n        dup = t['email'] in seen\n        seen.add(t['email'])\n        if '@' not in t['email'] or t['age'] < 0 or t['age'] > 120 or dup:\n            n += 1\n    return n\nprint(bad(${zRepr(u)}))`;
    return aPy(tNum(`Quy tắc đăng ký: email phải có dấu @; email chỉ đăng ký một lần (lần đầu hợp lệ); tuổi từ 0 đến 120.${pre(`users = ${zRepr(u)}`)}Có bao nhiêu bản ghi không hợp lệ?`, bad, `Đếm bản ghi vi phạm ít nhất một quy tắc: ${bad}.`), c, [String(bad)]);
  },
  verdict: kv(
    "Hà nói: 'gặp một giao dịch xấu thì bỏ nó đi, im lặng tính tiếp là an toàn nhất'. Hà nói đúng hay sai?",
    "Hà nói: 'với tiền, nên từ chối cả lô và báo rõ giao dịch nào sai'. Hà nói đúng hay sai?",
    'Im lặng bỏ qua làm số dư sai mà không ai biết', 'Bỏ qua im lặng luôn an toàn', 'Báo lỗi làm chậm hệ thống',
    'Sai: im lặng bỏ qua dữ liệu xấu rất nguy hiểm.',
  ),
  read: () => {
    const k = randRange(3, 4), seq: string[] = [], rep = randRange(2, 3);
    for (let i = 0; i < rep; i++) seq.push('A');
    seq.push('B');
    while (seq.length < k + 1) seq.push('C');
    const sh = shuffled(seq), dup = sh.length - new Set(sh).size;
    const c = `ids = ${pJ(sh)}\nprint(len(ids) - len(set(ids)))`;
    return aPy(aNum(`Quy ước: giao dịch đầu tiên của một id là hợp lệ, các lần lặp lại sau là lỗi. Danh sách id: ${pJ(sh)}. Có bao nhiêu giao dịch lỗi do trùng id?`, dup, `Chỉ tính các lần lặp lại sau lần đầu: ${dup}. Không tính lần xuất hiện đầu tiên.`, [dup + 1, sh.length - dup]), c, [String(dup)]);
  },
};
m2.verdict = variantOf([m2.verdict, kv(
  "Nam nói: 'amount âm do người dùng nhập sai là lỗi bất ngờ của hệ thống'. Nam nói đúng hay sai?",
  "Nam nói: 'amount âm là lỗi đầu vào dự đoán được: kiểm tra trước rồi raise ValueError'. Nam nói đúng hay sai?",
  'Ta biết trước người dùng có thể nhập sai', 'Không ai đoán được', 'Phải bắt bằng try ở tầng ngoài',
  'Sai: đó là lỗi dự đoán được.',
)]);
m2.read = variantOf([m2.read, () => {
  const c = `${zPyValid}print(bad([{'id': 1, 'type': 'gift', 'amount': -5}, {'id': 2, 'type': 'deposit', 'amount': 10}]))`;
  return aPy(aNum(`${pre("txs = [{'id': 1, 'type': 'gift', 'amount': -5}, {'id': 2, 'type': 'deposit', 'amount': 10}]")}Giao dịch đầu vừa sai type vừa amount âm. Có bao nhiêu GIAO DỊCH không hợp lệ (không phải số quy tắc bị vi phạm)?`, 1, 'Đề hỏi số giao dịch: giao dịch đầu chỉ tính một lần dù vi phạm hai quy tắc.', [2, 3]), c, ['1']);
}]);

/* ===== m3: đường ống kiểm tra, tính, trả ===== */
const m3: ProbeBank = {
  same: () => {
    const a = [randRange(5, 10) * 10, -randRange(1, 4) * 10, -randRange(1, 4) * 10, randRange(1, 3) * 10], s = zBal(a).s;
    const c = `t = ${pJ(a)}\ntotal = 0\nfor x in t:\n    total += x\nprint(total)`;
    return aPy(tNum(`${pre(c)}(số dương là nạp, số âm là rút) In ra mấy?`, s, `${a.join(' ')} cộng dồn = ${s}.`), c, [String(s)]);
  },
  flip: () => {
    const f = randRange(2, 9) * 10, x = randRange(1, 5) * 10;
    return tNum(`Sau giao dịch cuối (nạp ${x}), số dư là ${f}. Ngay trước giao dịch cuối, số dư là bao nhiêu?`, f - x, `${f} - ${x} = ${f - x}.`);
  },
  new: () => {
    const a = [randRange(3, 6) * 10, -randRange(7, 9) * 10, randRange(5, 9) * 10, -randRange(1, 3) * 10], r = zBal(a);
    const steps = ((): string => { let s = 0; return a.map((x) => (s += x)).join(', '); })();
    const c = `t = ${pJ(a)}\ntotal = 0\nfirst = 0\nfor i in range(len(t)):\n    total += t[i]\n    if total < 0 and first == 0:\n        first = i + 1\nprint(first)`;
    return aPy(tNum(`${pre(`t = ${pJ(a)}`)}Số dư bắt đầu từ 0 và KHÔNG được âm. Giao dịch thứ mấy (đếm từ 1) là giao dịch đầu tiên làm số dư âm? (Không có thì ghi 0.)`, r.first, `Cộng dồn từng bước: ${steps}.`), c, [String(r.first)]);
  },
  verdict: kv(
    "Hà nói: 'chỉ cần kiểm tra số dư không âm ở cuối là đủ'. Hà nói đúng hay sai?",
    "Hà nói: 'số dư phải hợp lệ ở mọi thời điểm, nên kiểm tra sau mỗi giao dịch rút'. Hà nói đúng hay sai?",
    'Giữa chừng âm thì đã sai dù cuối cùng dương', 'Chỉ kết quả cuối mới quan trọng', 'Không cần kiểm tra',
    'Sai: số dư âm giữa chừng đã vi phạm.',
  ),
  read: () => {
    const a = randRange(3, 5) * 10, b = a + randRange(2, 4) * 10, c2 = b + randRange(2, 4) * 10, t = [a, -b, c2], k = zBal(t);
    const c = `t = ${pJ(t)}\ntotal = 0\nmin_total = 0\nfor x in t:\n    total += x\n    min_total = min(min_total, total)\nprint(total, min_total)`;
    return aPy(tChoice(`Danh sách giao dịch ${pJ(t)} (dương là nạp, âm là rút), số dư đầu 0. Số dư cuối là ${k.s}, dương. Quy tắc "số dư không bao giờ âm" có bị vi phạm không?`, [`Có, vi phạm ở giao dịch thứ ${k.first}`, 'Không, vì số dư cuối dương', 'Không đủ thông tin'], `Sau giao dịch thứ ${k.first} số dư là ${a - b}, âm, dù cuối cùng lại dương.`), c, [`${k.s} ${a - b}`]);
  },
};
m3.new = variantOf([m3.new, () => {
  const D = [
    ['tính điểm trung bình của lớp từ danh sách điểm', 'Kiểm tra danh sách có rỗng không và điểm có nằm trong 0 đến 10 không'],
    ['tính tổng tiền từ danh sách giá', 'Kiểm tra danh sách có rỗng không và giá có âm không'],
    ['tính nhiệt độ trung bình từ danh sách số đo', 'Kiểm tra danh sách có rỗng không và số đo có hợp lý không'],
  ];
  const d = aPick(D);
  return tChoice(`Hàm cần ${at(d, 0)}. Theo đường ống (kiểm tra, tính, trả), bước làm ĐẦU TIÊN là gì?`, [at(d, 1), 'Chia tổng cho số phần tử', 'Trả kết quả cho người gọi'], 'Kiểm tra đầu vào trước: dữ liệu hỏng thì tính có ý nghĩa gì? Danh sách rỗng còn gây chia cho 0.');
}]);
m3.verdict = variantOf([m3.verdict, kv(
  "Nam nói: 'tính trước rồi kiểm tra sau cũng như kiểm tra trước rồi tính'. Nam nói đúng hay sai?",
  "Nam nói: 'kiểm tra đầu vào trước khi tính'. Nam nói đúng hay sai?",
  'Dữ liệu hỏng thì kết quả tính ra vô nghĩa', 'Thứ tự không quan trọng', 'Chỉ kiểm tra ở cuối',
  'Sai: kiểm tra trước, tính sau.',
)]);
m3.read = variantOf([m3.read, () => {
  const a = randRange(2, 4) * 10, b = randRange(5, 9) * 10, t = [a, -b], k = zBal(t);
  return tChoice(`Số dư đầu 0, giao dịch ${pJ(t)}. Yêu cầu: số dư không âm. Theo đường ống, hàm nên làm gì khi gặp giao dịch thứ 2?`, ['Dừng và báo lỗi rõ ràng (rút quá số dư)', `Tiếp tục và trả ${k.s}`, 'Bỏ qua giao dịch đó, im lặng trả kết quả'], `Sau giao dịch 2 số dư là ${k.s}, âm. Phải báo lỗi chứ không được trả số sai hoặc im lặng bỏ qua.`);
}]);

export const miniBanks: Record<string, ProbeBank> = { m1, m2, m3 };
