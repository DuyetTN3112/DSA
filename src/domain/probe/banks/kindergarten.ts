// Ngân hàng probe k1..k9 — port từ main:probe-kinder.js (k1,k3,k4,k6,k7), main:probe-more.js (k2,k5,k8,k9),
// extras trong main:probe-extra.js (k2,k3,k4,k5,k6,k7,k8,k9).
import type { ProbeBank } from '../../types';
import { aNum, aPick, aPy, at, kv, others, pre, randRange, shuffled, tChoice, tNum, variantOf } from '../builders';

const k1Same = () => {
  const n = randRange(3, 9);
  return tNum(`Có bao nhiêu quả táo? ${'🍎'.repeat(n)}`, n, `Chạm từng quả; số cuối cùng đọc ra là ${n}.`);
};
const k1Flip = () => {
  const n = randRange(5, 9), m = randRange(1, 4);
  return tNum(`Em cần đủ ${n} quả táo và đã có ${m} quả. Cần thêm mấy quả?`, n - m, `${n} - ${m} = ${n - m}.`);
};
const k1New = () => {
  const a = randRange(2, 6), b = randRange(2, 6);
  return tNum(`Có ${'🍎'.repeat(a)} và ${'🍌'.repeat(b)}. Tất cả có bao nhiêu quả?`, a + b, `Đếm tiếp qua cả hai nhóm: ${a + b}.`);
};
const k1Verdict = kv("Nam đếm 🍎🍎🍎🍎 và đọc 'một, hai, ba, bốn', rồi nói: 'có 3 quả vì lúc đầu em đọc ba'. Nam nói đúng hay sai?", "Nam đếm 🍎🍎🍎🍎 và đọc 'một, hai, ba, bốn', rồi nói: 'có 4 quả vì số cuối em đọc là bốn'. Nam nói đúng hay sai?", 'Số cuối cùng đọc ra chính là tổng số', 'Số đọc đầu tiên mới là tổng số', 'Số đọc ở giữa mới là tổng số', 'Sai: tổng là số cuối cùng, bốn.');
const k1Read = () => {
  let a = 0, b = 0;
  do { a = randRange(3, 6); b = randRange(2, 5); } while (a === b);
  return tChoice(`${'🍎'.repeat(a)} ${'🍌'.repeat(b)}  Có bao nhiêu quả TÁO?`, [`${a}`, `${a + b}`, `${b}`], 'Đề hỏi riêng táo, không phải tất cả.');
};

const k2Same = () => {
  const a = randRange(1, 7), b = randRange(1, 7), ans = a > b ? 'Bên trái nhiều hơn' : a < b ? 'Bên phải nhiều hơn' : 'Bằng nhau';
  return tChoice(`${'🍎'.repeat(a)}  và  ${'🍎'.repeat(b)}. Bên nào nhiều hơn?`, others(['Bên trái nhiều hơn', 'Bên phải nhiều hơn', 'Bằng nhau'], ans), 'Đếm từng bên rồi so số.');
};
const k2Flip = () => {
  const a = randRange(4, 8);
  return tNum(`Bên trái có ${a} quả. Bên phải có ÍT hơn ${a} quả, nhưng có NHIỀU hơn ${a - 2} quả (so với con số ${a - 2}, không phải so với bên trái). Bên phải có mấy quả?`, a - 1, `Cần số nhỏ hơn ${a} và lớn hơn ${a - 2}. Chỉ có ${a - 1}.`);
};
const k2New0 = () => {
  const a = randRange(2, 9), b = randRange(2, 9), s = a === b ? b + 1 : b, r = a < s ? 'Lan' : 'Mai';
  return tChoice(`Lan có ${a} kẹo, Mai có ${s} kẹo. Ai có ÍT kẹo hơn?`, [r, r === 'Lan' ? 'Mai' : 'Lan', 'Bằng nhau'], 'Số nhỏ hơn là ít hơn.');
};
const k2New1 = () => {
  const a = randRange(2, 9), b = Math.random() < 0.3 ? a : randRange(2, 9), r = a > b ? 'Hà' : a < b ? 'Nam' : 'Bằng nhau';
  return tChoice(`Hà có ${a} viên bi, Nam có ${b} viên bi. Ai có NHIỀU bi hơn?`, [r, ...['Hà', 'Nam', 'Bằng nhau'].filter((x) => x !== r)], a === b ? 'Hai số bằng nhau thì không ai nhiều hơn.' : 'Số lớn hơn là nhiều hơn.');
};
const k2Verdict = kv("Hà nói: 'nhóm có đồ vật to hơn thì có nhiều hơn'. Hà nói đúng hay sai?", "Hà nói: 'nhiều hay ít chỉ phụ thuộc số lượng, không phụ thuộc to hay nhỏ'. Hà nói đúng hay sai?", 'Nhiều hay ít chỉ phụ thuộc số lượng', 'Vật to thì luôn nhiều hơn', 'Vật nhỏ thì luôn nhiều hơn', 'Sai: so sánh bằng số lượng.');
const k2Read = () => {
  const a = randRange(4, 7), b = randRange(1, 3);
  return tChoice(`${'🍎'.repeat(a)}  và  ${'🍌'.repeat(b)}. Bên nào ÍT hơn?`, ['Bên chuối', 'Bên táo', 'Bằng nhau'], 'Đề hỏi ÍT hơn, không phải nhiều hơn.');
};

const k3Same = () => {
  const n = randRange(4, 8), m = randRange(1, n);
  return tNum(`${n} bạn xếp hàng. Lan đứng thứ ${m} (bạn đầu hàng là thứ 1). Có bao nhiêu người đứng TRƯỚC Lan?`, m - 1, `Thứ ${m} thì có ${m - 1} người đứng trước.`);
};
const k3Flip = () => {
  const k = randRange(0, 6);
  return tNum(`Có ${k} người đứng trước Lan. Lan đứng thứ mấy (bạn đầu hàng là thứ 1)?`, k + 1, `${k} người đứng trước nên Lan thứ ${k + 1}.`);
};
const k3New0 = () => {
  const n = randRange(3, 8);
  return tNum(`Máy đếm từ 0. ${n} bạn xếp hàng, máy gán số lần lượt cho từng bạn. Bạn cuối hàng được gán số mấy?`, n - 1, `Từ 0 đến ${n - 1}.`);
};
const k3New1 = () => {
  const n = randRange(4, 9), m = randRange(2, n);
  return tNum(`Máy đếm từ 0. ${n} bạn xếp hàng. Bạn đứng thứ ${m} (bạn đầu hàng là thứ 1) được máy gán số mấy?`, m - 1, `Thứ ${m} thì có ${m - 1} người đứng trước, và máy gán đúng số người đứng trước.`);
};
const k3Verdict0 = kv("Nam nói: 'bạn đứng thứ nhất có 1 người đứng trước'. Nam nói đúng hay sai?", "Nam nói: 'bạn đứng thứ nhất có 0 người đứng trước'. Nam nói đúng hay sai?", 'Bạn đứng đầu hàng không có ai đứng trước', 'Bạn đứng đầu hàng luôn có 1 người đứng trước', 'Không ai được đứng đầu hàng', 'Sai: không có ai đứng trước.');
const k3Verdict1 = kv("Nam nói: 'máy đếm từ 0 nên bạn đầu hàng được gán số 1'. Nam nói đúng hay sai?", "Nam nói: 'bạn đầu hàng được gán số 0 vì chưa có ai đứng trước'. Nam nói đúng hay sai?", 'Số máy gán bằng số người đứng trước', 'Máy gán số thứ tự bắt đầu từ 1', 'Máy gán ngẫu nhiên', 'Sai: bạn đầu hàng được gán 0.');
const k3Read0 = () => {
  const n = randRange(4, 8);
  return tChoice(`Hàng có ${n} bạn. Bạn đứng thứ ${n} (cuối hàng) có mấy người đứng TRƯỚC?`, [`${n - 1}`, `${n}`, `${n + 1}`], `Trước bạn cuối là ${n - 1} người.`);
};
const k3Read1 = () => {
  const n = randRange(3, 9);
  return aNum(`Hàng có ${n} bạn, máy đếm từ 0. Số LỚN NHẤT máy gán là mấy?`, n - 1, `Từ 0 đến ${n - 1}: ${n} số, số lớn nhất là ${n - 1}.`, [n, n + 1]);
};

const k4Same = () => {
  const a = randRange(1, 5), b = randRange(1, 5);
  return tNum(`Hộp "kẹo" chứa ${a} viên. Em bỏ thêm ${b} viên vào hộp "kẹo". Hộp "kẹo" chứa mấy viên?`, a + b, `${a} + ${b} = ${a + b}.`);
};
const k4Flip = () => {
  const a = randRange(1, 4), b = randRange(2, 5);
  return tNum(`Sau khi bỏ thêm ${b} viên, hộp "kẹo" chứa ${a + b} viên. Trước khi bỏ thêm, hộp chứa mấy viên?`, a, `${a + b} - ${b} = ${a}.`);
};
const k4New0 = () => {
  const a = randRange(1, 4), b = randRange(5, 9);
  return tNum(`Hộp "a" chứa ${a}, hộp "b" chứa ${b}. Em chép giá trị của hộp "b" bỏ vào hộp "a" (hộp "b" vẫn giữ nguyên). Hộp "a" giờ chứa mấy?`, b, `Hộp a nhận giá trị ${b}.`);
};
const k4New1 = () => {
  const x = randRange(2, 6), y = randRange(1, 4);
  return tNum(`Hộp "a" chứa ${x}. Em bỏ thêm ${y} vào hộp "a". Hộp "a" giờ chứa mấy?`, x + y, `${x} + ${y} = ${x + y}.`);
};
const k4Verdict = kv("Hà nói: 'đổi thứ bên trong hộp thì tên hộp cũng đổi theo'. Hà nói đúng hay sai?", "Hà nói: 'đổi thứ bên trong hộp thì tên hộp vẫn giữ nguyên'. Hà nói đúng hay sai?", 'Tên là nhãn dán bên ngoài, không đổi khi đổi đồ bên trong', 'Tên và thứ bên trong là một', 'Hộp không có tên', 'Sai: tên hộp giữ nguyên.');
const k4Read0 = () => {
  const v = randRange(2, 9);
  return tChoice(`Hộp có nhãn "kẹo" đang chứa ${v} viên. TÊN của hộp là gì?`, ['kẹo', `${v}`, 'viên'], 'Tên là nhãn dán bên ngoài.');
};
const k4Read1 = () => {
  const n = aPick(['bi', 'keo', 'sach']), v = randRange(3, 9);
  return tChoice(`Hộp có nhãn "${n}" đang chứa ${v}. Đề hỏi: GIÁ TRỊ nằm trong hộp là gì?`, [String(v), n, 'hộp'], `Giá trị là thứ nằm TRONG hộp (${v}); "${n}" là tên dán bên ngoài.`);
};

const k5Same = () => {
  const a = randRange(1, 5), b = randRange(1, 5);
  return tNum(`Người máy làm đúng từng lệnh theo thứ tự: "đi ${a} bước", "quay phải", "đi ${b} bước". Tổng cộng máy đã đi bao nhiêu bước?`, a + b, `${a} + ${b}; quay phải không phải là bước đi.`);
};
const k5Flip = () => {
  const a = randRange(1, 5), b = randRange(1, 5);
  return tNum(`Người máy đi tổng cộng ${a + b} bước. Lệnh 1: đi ${a} bước. Lệnh 2: quay phải. Lệnh 3: đi ? bước. Dấu ? là mấy?`, b, `${a + b} - ${a} = ${b}.`);
};
const k5New0 = () => {
  const x = randRange(3, 6);
  return tNum(`Hộp chứa ${x}. Lệnh 1: bỏ thêm 3. Lệnh 2: lấy ra 2. Lệnh 3: bỏ thêm 4. Sau lệnh 3 hộp chứa mấy?`, x + 5, `${x} + 3 - 2 + 4 = ${x + 5}.`);
};
const k5New1 = () => {
  const x = randRange(5, 9), a = randRange(1, 4), b = randRange(1, 4), c = randRange(1, 4);
  return tNum(`Hộp chứa ${x}. Lệnh 1: lấy ra ${a}. Lệnh 2: bỏ thêm ${b}. Lệnh 3: bỏ thêm ${c}. Sau lệnh 3 hộp chứa mấy?`, x - a + b + c, `${x} - ${a} + ${b} + ${c} = ${x - a + b + c}.`);
};
const k5Verdict = kv("Nam nói: 'người máy tự hiểu ý em dù lệnh thiếu chi tiết'. Nam nói đúng hay sai?", "Nam nói: 'người máy chỉ làm đúng từng lệnh em đưa'. Nam nói đúng hay sai?", 'Máy không đoán ý, chỉ làm đúng chữ trong lệnh', 'Máy luôn đoán được ý', 'Máy làm nhiều hơn lệnh', 'Sai: máy chỉ làm đúng lệnh.');
const k5Read0 = () => tChoice('Lệnh 1: đi 2 bước. Lệnh 2: quay phải. Ngay sau khi làm xong lệnh 1, máy đã quay phải chưa?', ['Chưa, quay phải là lệnh sau', 'Rồi', 'Không đủ thông tin'], 'Máy làm từng lệnh theo thứ tự.');
const k5Read1 = () => {
  const x = randRange(3, 6), a = randRange(2, 4), b = randRange(1, 2);
  return aNum(`Hộp chứa ${x}. Lệnh 1: bỏ thêm ${a}. Lệnh 2: lấy ra ${b}. NGAY SAU lệnh 1 (lệnh 2 chưa chạy), hộp chứa mấy?`, x + a, `Mới chạy lệnh 1: ${x} + ${a} = ${x + a}. ${x + a - b} là kết quả sau lệnh 2.`, [x + a - b, x]);
};

const k6Same = () => {
  const m = Math.random() < 0.5;
  return tChoice(`Luật: nếu trời mưa thì mang ô, nếu không thì đội mũ. Hôm nay trời ${m ? 'mưa' : 'không mưa'}. Em làm gì?`, m ? ['Mang ô', 'Đội mũ', 'Làm cả hai'] : ['Đội mũ', 'Mang ô', 'Làm cả hai'], 'Chỉ một nhánh của luật được làm.');
};
const k6Flip = () => tChoice('Luật: nếu trời mưa thì mang ô, nếu không thì đội mũ. Em thấy bạn đội mũ. Hôm nay trời thế nào?', ['Không mưa', 'Mưa', 'Không đoán được'], 'Chỉ khi không mưa mới đội mũ.');
const k6New0 = () => {
  const d = randRange(1, 9);
  return tChoice(`Luật: nếu số lớn hơn 5 thì tô đỏ, nếu không thì tô xanh. Số ${d} được tô màu gì?`, d > 5 ? ['Đỏ', 'Xanh', 'Cả hai'] : ['Xanh', 'Đỏ', 'Cả hai'], `${d} ${d > 5 ? 'lớn hơn' : 'không lớn hơn'} 5.`);
};
const k6New1 = () => {
  const t = randRange(3, 7), v = aPick([t - 1, t, t + 1]), r = v > t ? 'Đỏ' : 'Xanh';
  return tChoice(`Luật: nếu số lớn hơn ${t} thì tô đỏ, nếu không thì tô xanh. Số ${v} được tô màu gì?`, [r, ...['Đỏ', 'Xanh', 'Cả hai'].filter((x) => x !== r)], v > t ? `${v} lớn hơn ${t}.` : `${v} không lớn hơn ${t}.`);
};
const k6Verdict = kv("Hà nói: 'luật nếu-thì-nếu-không chạy cả hai nhánh mỗi lần'. Hà nói đúng hay sai?", "Hà nói: 'luật nếu-thì-nếu-không mỗi lần chỉ chạy đúng một nhánh'. Hà nói đúng hay sai?", 'Điều kiện chỉ có thể đúng hoặc sai, nên chỉ một nhánh chạy', 'Cả hai nhánh luôn chạy', 'Không nhánh nào chạy', 'Sai: chỉ một nhánh chạy.');
const k6Read0 = () => tChoice('Luật: nếu số NHỎ hơn 5 thì tô đỏ. Số 5 có được tô đỏ không?', ['Không, vì 5 không nhỏ hơn 5', 'Có', 'Không đủ thông tin'], '5 bằng 5, chứ không nhỏ hơn 5.');
const k6Read1 = () => {
  const t = randRange(3, 8);
  return tChoice(`Luật: nếu số LỚN HƠN HOẶC BẰNG ${t} thì tô đỏ. Số ${t} có được tô đỏ không?`, [`Có, vì ${t} bằng ${t}`, 'Không', 'Không đủ thông tin'], `"Hoặc bằng" nghĩa là gặp đúng ${t} cũng thỏa.`);
};

const k7Same = () => {
  const n = randRange(2, 6), m = randRange(2, 4);
  return tNum(`Lặp ${n} lần việc "thêm ${m} viên bi vào hộp". Hộp ban đầu rỗng. Cuối cùng có mấy viên?`, n * m, `${n} lần × ${m} = ${n * m}.`);
};
const k7Flip = () => {
  const n = randRange(2, 5), m = randRange(2, 4);
  return tNum(`Lặp ${n} lần việc "thêm một số viên bằng nhau". Hộp ban đầu rỗng, cuối cùng có ${n * m} viên. Mỗi lần thêm mấy viên?`, m, `${n * m} chia ${n} = ${m}.`);
};
const k7New0 = () => {
  const a = randRange(0, 3);
  return tNum(`Việc "thêm 1 viên" được lặp cho đến khi hộp có đúng 6 viên. Hộp đang có ${a} viên. Phải lặp mấy lần?`, 6 - a, `6 - ${a} = ${6 - a}.`);
};
const k7New1 = () => {
  const k = randRange(2, 4), n = randRange(2, 5), s = randRange(1, 4), g = s + k * n;
  return tNum(`Việc "thêm ${k} viên" được lặp cho đến khi hộp có đúng ${g} viên. Hộp đang có ${s} viên. Phải lặp mấy lần?`, n, `(${g} - ${s}) / ${k} = ${n}.`);
};
const k7Verdict = kv("Nam nói: 'việc lặp mà không có điều kiện dừng thì vẫn tự dừng'. Nam nói đúng hay sai?", "Nam nói: 'việc lặp mà không có điều kiện dừng thì chạy mãi'. Nam nói đúng hay sai?", 'Không có điều kiện dừng thì không gì làm nó dừng', 'Máy tự biết lúc nào nên dừng', 'Máy luôn dừng sau 10 lần', 'Sai: nó lặp mãi.');
const k7Read0 = () => {
  let n = 0, m = 0, s = 0;
  do { n = randRange(2, 4); m = randRange(2, 3); s = randRange(3, 6); } while (n * m === s);
  return tChoice(`Hộp đang có ${s} viên. Lặp ${n} lần việc "thêm ${m} viên". Cuối cùng hộp có bao nhiêu viên?`, [`${s + n * m}`, `${n * m}`, `${s}`], `Đừng quên ${s} viên có sẵn: ${s} + ${n * m}.`);
};
const k7Read1 = () => {
  const s = randRange(3, 9);
  return aNum(`Hộp đang có ${s} viên. Lặp 0 lần việc "thêm 2 viên". Hộp có bao nhiêu viên?`, s, `Lặp 0 lần nghĩa là không làm gì: vẫn ${s}.`, [s + 2, 0]);
};

const k8Same = () => {
  const p = at([['🔴', '🔵'], ['⭐', '🌙'], ['🍎', '🍌']], randRange(0, 2)), L = randRange(3, 6), seq = Array.from({ length: L }, (_, i) => at(p, i % 2)), nx = at(p, L % 2);
  return tChoice(`${seq.join(' ')} ?  Hình tiếp theo là gì?`, [nx, at(p, (L + 1) % 2), 'Không đoán được'], 'Hai hình thay phiên nhau.');
};
const k8Flip = () => {
  const p = at([['🔴', '🔵'], ['⭐', '🌙']], randRange(0, 1)), k = randRange(5, 12), r = at(p, (k - 1) % 2);
  return tChoice(`Dãy lặp ${at(p, 0)} ${at(p, 1)} ${at(p, 0)} ${at(p, 1)} ... Hình thứ ${k} (đếm từ 1) là gì?`, [r, r === at(p, 0) ? at(p, 1) : at(p, 0), 'Không đoán được'], `Vị trí lẻ là ${at(p, 0)}, chẵn là ${at(p, 1)}.`);
};
const k8New0 = () => {
  const a = randRange(1, 5), s = randRange(2, 4);
  return tNum(`Dãy số: ${a}, ${a + s}, ${a + 2 * s}, ${a + 3 * s}, ?  Số tiếp theo là mấy?`, a + 4 * s, `Mỗi số hơn số trước ${s}.`);
};
const k8New1 = () => {
  const s = randRange(2, 4), a = randRange(14, 20);
  return tNum(`Dãy số đang GIẢM dần: ${a}, ${a - s}, ${a - 2 * s}, ${a - 3 * s}, ?  Số tiếp theo là mấy?`, a - 4 * s, `Mỗi số kém số trước ${s}.`);
};
const k8Verdict = kv("Hà nói: 'nhìn 3 hình đầu là chắc chắn biết hết quy luật'. Hà nói đúng hay sai?", "Hà nói: 'nhìn vài hình đầu mới chỉ là đoán quy luật, cần kiểm tra thêm'. Hà nói đúng hay sai?", 'Vài ví dụ chỉ cho ta một phỏng đoán cần kiểm tra', 'Ba ví dụ luôn đủ để chắc chắn', 'Quy luật không tồn tại', 'Sai: đó mới là phỏng đoán.');
const k8Read0 = () => tChoice('⭐ ⭐ 🌙 ⭐ ⭐ 🌙 ⭐ ⭐ ?  Hình tiếp theo là gì?', ['🌙', '⭐', 'Không đoán được'], 'Quy luật lặp lại sau mỗi 3 hình, không phải 2.');
const k8Read1 = () => {
  const E = shuffled(['🔴', '🔵', '⭐', '🌙', '🍎', '🍌']).slice(0, 2), tri = aPick([[at(E, 0), at(E, 1), at(E, 1)], [at(E, 0), at(E, 0), at(E, 1)]]), L = aPick([7, 8, 10]), seq = Array.from({ length: L }, (_, i) => at(tri, i % 3)), nx = at(tri, L % 3);
  return tChoice(`${seq.join(' ')} ?  Hình tiếp theo là gì?`, [nx, ...E.filter((x) => x !== nx), 'Không đoán được'].slice(0, 3), `Cứ ${tri.join(' ')} lặp lại: đây là quy luật lặp sau mỗi 3 hình, hình thứ ${L + 1} là ${nx}.`);
};

const k9Same = () => {
  const a = randRange(1, 9);
  return tNum(`${pre(`x = ${a}\nprint(x)`)}Máy in ra số mấy?`, a, `Hộp x chứa ${a}.`);
};
const k9Flip = () => {
  const a = randRange(1, 9);
  return tNum(`${pre('x = ?\nprint(x)')}Máy in ra ${a}. Dấu ? là số nào?`, a, `Hộp x phải chứa ${a}.`);
};
const k9New0 = () => {
  const a = randRange(1, 5), b = randRange(1, 5);
  return tNum(`${pre(`a = ${a}\nb = ${b}\nprint(a + b)`)}Máy in ra số mấy?`, a + b, `${a} + ${b}.`);
};
const k9New1 = () => {
  const a = randRange(1, 9), b = randRange(1, 9), c = `x = ${a}\ny = ${b}\nx = y\nprint(x)`;
  return aPy(tNum(`${pre(c)}Máy in ra số mấy?`, b, `Dòng x = y đặt hộp x chứa giá trị của y: ${b}.`), c, [String(b)]);
};
const k9New2 = () => {
  const a = randRange(1, 9), b = randRange(1, 9), c = `x = ${a}\nx = x + ${b}\nprint(x)`;
  return aPy(tNum(`${pre(c)}Máy in ra số mấy?`, a + b, `Lấy ${a} trong hộp x, cộng ${b}, bỏ lại vào x: ${a + b}.`), c, [String(a + b)]);
};
const k9Verdict = kv("Nam nói: 'print(x) in ra chữ x'. Nam nói đúng hay sai?", "Nam nói: 'print(x) in ra thứ đang nằm trong hộp x'. Nam nói đúng hay sai?", 'print(x) in thứ đang nằm TRONG hộp tên x', 'print(x) in ra tên hộp', 'print luôn in chữ', 'Sai: in giá trị trong hộp.');
const k9Read0 = () => tChoice(`${pre('n = 4\nprint(n + 1)\nprint(n)')}Dòng thứ hai được in ra là gì?`, ['4', '5', 'n'], 'print(n + 1) chỉ tính tạm, không đổi hộp n.');
const k9Read1 = () => {
  const a = randRange(1, 5), b = randRange(6, 9), c = `x = ${a}\nx = ${b}\nprint(x)`;
  return aPy(aNum(`${pre(c)}Đọc kỹ từng lệnh. Máy in ra số mấy?`, b, `Lệnh sau ghi đè lệnh trước: x chứa ${b}. ${a} đã bị thay thế.`, [a, a + b]), c, [String(b)]);
};

export const kindergartenBanks: Record<string, ProbeBank> = {
  k1: { same: k1Same, flip: k1Flip, new: k1New, verdict: k1Verdict, read: k1Read },
  k2: { same: k2Same, flip: k2Flip, new: variantOf([k2New0, k2New1]), verdict: k2Verdict, read: k2Read },
  k3: { same: k3Same, flip: k3Flip, new: variantOf([k3New0, k3New1]), verdict: variantOf([k3Verdict0, k3Verdict1]), read: variantOf([k3Read0, k3Read1]) },
  k4: { same: k4Same, flip: k4Flip, new: variantOf([k4New0, k4New1]), verdict: k4Verdict, read: variantOf([k4Read0, k4Read1]) },
  k5: { same: k5Same, flip: k5Flip, new: variantOf([k5New0, k5New1]), verdict: k5Verdict, read: variantOf([k5Read0, k5Read1]) },
  k6: { same: k6Same, flip: k6Flip, new: variantOf([k6New0, k6New1]), verdict: k6Verdict, read: variantOf([k6Read0, k6Read1]) },
  k7: { same: k7Same, flip: k7Flip, new: variantOf([k7New0, k7New1]), verdict: k7Verdict, read: variantOf([k7Read0, k7Read1]) },
  k8: { same: k8Same, flip: k8Flip, new: variantOf([k8New0, k8New1]), verdict: k8Verdict, read: variantOf([k8Read0, k8Read1]) },
  k9: { same: k9Same, flip: k9Flip, new: variantOf([k9New0, k9New1, k9New2]), verdict: k9Verdict, read: variantOf([k9Read0, k9Read1]) },
};
