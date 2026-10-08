// Ngân hàng probe cấu trúc (tp, bub, h1, h2, h3) — port từ main:probe-more.js (đoạn sau PRB.k9)
// cộng extras trong main:probe-extra.js. Mỗi shape có extra được gộp qua variantOf.
import type { ProbeBank, ProbeGenerator } from '../../types';
import { aNum, aPick, aPy, at, bubPass, distinct, kv, pJ, pre, randRange, tChoice, tNum, variantOf, xSort } from '../builders';

/* ---------- tp: hai con trỏ ---------- */
const tpSame: ProbeGenerator = () => {
  const n = randRange(4, 8);
  return tNum(`Mảng a có ${n} hộp. i = 0, j = len(a) - 1. j bằng mấy?`, n - 1, `len(a) - 1 = ${n - 1}.`);
};
const tpFlip: ProbeGenerator = () => {
  const j = randRange(3, 8);
  return tNum(`j = len(a) - 1 và j bằng ${j}. Mảng a có bao nhiêu hộp?`, j + 1, `${j} + 1.`);
};
const tpNew0: ProbeGenerator = () => {
  const a = distinct(4, 9);
  return tNum(`${pre(`a = [${a.join(',')}]\ni = 0\nj = 3\na[i], a[j] = a[j], a[i]\nprint(a[i])`)}In ra số mấy?`, at(a, 3), 'Sau khi đổi chỗ, hộp 0 chứa số cũ của hộp 3.');
};
const tpNew1: ProbeGenerator = () => {
  const a = distinct(4, 9), c = `a = ${pJ(a)}\ni = 1\nj = 2\na[i], a[j] = a[j], a[i]\nprint(a[j])`;
  return aPy(tNum(`Hai hộp ở giữa đổi chỗ cho nhau.${pre(c)}Sau khi đổi, hộp j chứa số mấy?`, at(a, 1), `Hai hộp 1 và 2 đổi chỗ cho nhau: hộp 2 giờ chứa số cũ của hộp 1, tức ${at(a, 1)}.`), c, [String(at(a, 1))]);
};
const tpVerdict = kv("Nam nói: 'hai con trỏ i và j luôn cùng đi sang phải'. Nam nói đúng hay sai?", "Nam nói: 'trong bài trái-phải, i đi sang phải còn j đi sang trái rồi gặp nhau ở giữa'. Nam nói đúng hay sai?", 'i bắt đầu từ đầu đi sang phải, j bắt đầu từ cuối đi sang trái', 'Cả hai luôn đi sang phải', 'Cả hai đứng yên', 'Sai: chúng đi ngược chiều.');
const tpRead0: ProbeGenerator = () => tChoice('Mảng có 5 hộp. i = 0, j = 4. Sau một bước (i tăng 1, j giảm 1) thì i và j bằng bao nhiêu?', ['i = 1, j = 3', 'i = 1, j = 5', 'i = 0, j = 3'], 'i: 0 thành 1; j: 4 thành 3.');
const tpRead1: ProbeGenerator = () => {
  const n = randRange(5, 9), k = randRange(1, 3), R = `i = ${k}, j = ${n - 1 - k}`;
  return tChoice(`Mảng có ${n} hộp. Ban đầu i = 0, j = ${n - 1}. Sau ${k} bước (mỗi bước i tăng 1, j giảm 1) thì i và j bằng bao nhiêu?`, [R, `i = ${k}, j = ${n - k}`, `i = 0, j = ${n - 1 - k}`], `i: 0 thành ${k}; j: ${n - 1} thành ${n - 1 - k}.`);
};

/* ---------- bub: nổi bọt ---------- */
const bubSame: ProbeGenerator = () => {
  const a = distinct(3, 9), m = Math.max(...a);
  return tNum(`${pre(`a = [${a.join(',')}]  # một lượt nổi bọt: so sánh cặp (0,1), rồi (1,2), nếu trái lớn hơn phải thì đổi chỗ`)}Sau một lượt, hộp cuối cùng chứa số mấy?`, m, 'Số lớn nhất bị đẩy dần về cuối.');
};
const bubFlip: ProbeGenerator = () => {
  const m = randRange(5, 9);
  return tNum(`Sau một lượt nổi bọt, hộp cuối chứa ${m}. Số lớn nhất của mảng ban đầu là mấy?`, m, 'Một lượt luôn đẩy số lớn nhất về cuối.');
};
const bubNew0: ProbeGenerator = () => {
  const a = distinct(3, 9), r = bubPass(a);
  return tNum(`${pre(`a = [${a.join(',')}]  # một lượt nổi bọt: so sánh cặp (0,1), rồi (1,2), nếu trái lớn hơn phải thì đổi chỗ`)}Sau một lượt, hộp đầu tiên chứa số mấy?`, at(r, 0), `Kết quả sau một lượt là [${r.join(',')}].`);
};
const bubNew1: ProbeGenerator = () => {
  const a = distinct(3, 9), p = bubPass(a);
  return tNum(`${pre(`a = ${pJ(a)}  # một lượt nổi bọt: so sánh cặp (0,1), rồi (1,2), nếu trái lớn hơn phải thì đổi chỗ`)}Sau một lượt, hộp CUỐI CÙNG chứa số mấy?`, at(p, 2), `Số lớn nhất nổi dần về cuối: ${at(p, 2)}.`);
};
const bubVerdict = kv("Hà nói: 'sau một lượt nổi bọt, cả mảng đã sắp xếp xong'. Hà nói đúng hay sai?", "Hà nói: 'sau một lượt nổi bọt, số lớn nhất chắc chắn ở cuối nhưng mảng chưa chắc đã xong'. Hà nói đúng hay sai?", 'Một lượt chỉ đảm bảo số lớn nhất về cuối', 'Một lượt luôn đủ để sắp xếp cả mảng', 'Một lượt xóa các số nhỏ', 'Sai: mới chắc chắn số lớn nhất về cuối.');
const bubRead0: ProbeGenerator = () => tChoice('a = [3, 1, 2]. So sánh hai hộp đầu: 3 > 1 nên đổi chỗ. Ngay bây giờ mảng là gì?', ['[1, 3, 2]', '[3, 1, 2]', '[1, 2, 3]'], 'Mới đổi một cặp, chưa làm hết lượt.');
const bubRead1: ProbeGenerator = () => {
  const a = distinct(3, 9), sw = a.slice();
  if (at(sw, 0) > at(sw, 1)) {
    const t0 = at(sw, 0);
    sw[0] = at(sw, 1);
    sw[1] = t0;
  }
  const forced = a.slice(), u0 = at(forced, 0);
  forced[0] = at(forced, 1);
  forced[1] = u0;
  const cand = [...new Set([pJ(sw), pJ(a), pJ(forced), pJ(xSort(a)), pJ(a.slice().reverse())])], right = pJ(sw);
  return tChoice(`a = ${pJ(a)}. So sánh hai hộp đầu: ${at(a, 0)} ${at(a, 0) > at(a, 1) ? '>' : '<'} ${at(a, 1)}. Làm đúng quy tắc (trái lớn hơn phải thì đổi chỗ). Ngay bây giờ mảng là gì?`, [right, ...cand.filter((x) => x !== right).slice(0, 2)], at(a, 0) > at(a, 1) ? 'Trái lớn hơn phải nên đổi chỗ; mới xử lý một cặp.' : 'Trái nhỏ hơn phải nên KHÔNG đổi chỗ; mảng giữ nguyên.');
};

/* ---------- h1: dictionary với khóa tên ---------- */
const h1Same: ProbeGenerator = () => {
  const a = randRange(8, 15), b = randRange(8, 15);
  return tNum(`${pre(`tuoi = {"An": ${a}, "Binh": ${b}}\nprint(tuoi["Binh"])`)}In ra số mấy?`, b, `Khóa "Binh" ứng với ${b}.`);
};
const h1Flip: ProbeGenerator = () => {
  const a = randRange(8, 11), b = randRange(12, 15);
  return tChoice(`${pre(`tuoi = {"An": ${a}, "Binh": ${b}}\nprint(tuoi[?])`)}In ra ${a}. Dấu ? là gì?`, ['"An"', '"Binh"', `${a}`], `${a} thuộc khóa "An".`);
};
const h1New0: ProbeGenerator = () => {
  const a = randRange(8, 15);
  return tNum(`${pre(`tuoi = {"An": ${a}}\ntuoi["An"] = tuoi["An"] + 1\nprint(tuoi["An"])`)}In ra số mấy?`, a + 1, `Lấy ${a}, cộng 1, bỏ lại vào khóa "An".`);
};
const h1New1: ProbeGenerator = () => {
  const a = randRange(10, 20), b = randRange(10, 20), c = `tuoi = {"An": ${a}}\ntuoi["Binh"] = ${b}\nprint(tuoi["An"] + tuoi["Binh"])`;
  return aPy(tNum(`${pre(c)}In ra số mấy?`, a + b, `Thêm khóa "Binh", rồi cộng hai giá trị: ${a + b}.`), c, [String(a + b)]);
};
const h1Verdict = kv("Hà nói: 'tuoi[\"An\"] lấy mục đầu tiên của dict'. Hà nói đúng hay sai?", "Hà nói: 'dict tra bằng khóa chứ không bằng vị trí'. Hà nói đúng hay sai?", 'Dict tìm theo khóa, không theo vị trí', 'Dict tìm theo vị trí', 'Dict không có khóa', 'Sai: tra bằng khóa.');
const h1Read0: ProbeGenerator = () => tChoice(`${pre('tuoi = {"An": 10}\nprint(tuoi["an"])')}Chuyện gì xảy ra?`, ['Báo lỗi KeyError: khóa phân biệt chữ hoa, chữ thường', 'In ra 10', 'In ra None'], '"an" và "An" là hai khóa khác nhau.');
const h1Read1: ProbeGenerator = () => {
  const a = randRange(1, 5), b = randRange(6, 9), c = `d = {"a": ${a}}\nd["a"] = ${b}\nprint(d["a"])`;
  return aPy(aNum(`${pre(c)}Đọc kỹ: in ra mấy?`, b, `Gán vào khóa đã có thì GHI ĐÈ giá trị cũ: ${b}.`, [a, a + b]), c, [String(b)]);
};

/* ---------- h2: đếm bằng dict/get ---------- */
const h2Same: ProbeGenerator = () => {
  const n = randRange(2, 5);
  return tNum(`${pre(`d = {}\nd["a"] = 1\n${'d["a"] = d["a"] + 1\n'.repeat(n - 1)}print(d["a"])`)}In ra số mấy?`, n, `Bắt đầu 1, cộng ${n - 1} lần.`);
};
const h2Flip: ProbeGenerator = () => {
  const n = randRange(2, 6);
  return tNum(`Một chữ xuất hiện ${n} lần trong chuỗi. Đếm bằng d[ch] = d.get(ch, 0) + 1 cho mỗi lần gặp. Cuối cùng d[ch] bằng mấy?`, n, `Mỗi lần gặp cộng 1: ${n}.`);
};
const h2New: ProbeGenerator = () => {
  const k = at(['x', 'y', 'z'], randRange(0, 2));
  return tNum(`${pre(`d = {}\nd["${k}"] = d.get("${k}", 0) + 1\nprint(d["${k}"])`)}In ra số mấy?`, 1, 'Chưa có khóa nên get trả 0, rồi cộng 1.');
};
const h2Verdict = kv('Hà nói: \'d["x"] = d["x"] + 1 chạy được cả khi chưa có khóa x\'. Hà nói đúng hay sai?', 'Hà nói: \'d["x"] = d["x"] + 1 báo lỗi nếu chưa có khóa x\'. Hà nói đúng hay sai?', 'Phải có khóa x trước thì d["x"] mới lấy ra được', 'Khóa tự được tạo khi đọc', 'Python tự đặt bằng 0', 'Sai: báo lỗi KeyError.');
const h2Read0: ProbeGenerator = () => tChoice(`${pre('d = {}\nprint(d["x"])')}Chuyện gì xảy ra?`, ['Báo lỗi KeyError', 'In ra 0', 'In ra None'], 'Đọc khóa chưa có thì báo lỗi.');
const h2Read1: ProbeGenerator = () => {
  const c = 'd = {}\nprint(d.get("x", 0))';
  return aPy(tChoice(`${pre(c)}Chuyện gì xảy ra?`, ['In ra 0', 'Báo lỗi KeyError', 'In ra None'], 'get trả về giá trị mặc định (0) khi chưa có khóa, không báo lỗi.'), c, ['0']);
};

/* ---------- h3: khi nào dùng dict/set ---------- */
const h3Same: ProbeGenerator = () => {
  const n = randRange(10, 99) * 10;
  return tNum(`Tìm một số trong list ${n} phần tử (chưa sắp xếp). Tệ nhất phải mở tối đa bao nhiêu hộp?`, n, 'Phải duyệt hết.');
};
const h3Flip: ProbeGenerator = () => {
  const n = randRange(10, 99) * 10;
  return tNum(`Tra một khóa trong dict có ${n} cặp mất khoảng bao nhiêu bước (xấp xỉ, không phụ thuộc số cặp)?`, 1, 'Dict tra gần như một bước.');
};
const h3New0: ProbeGenerator = () => tChoice("Muốn kiểm tra 'đã gặp số này chưa' nhanh nhất cho 1 triệu số, nên dùng gì?", ['Set hoặc dict', 'List và duyệt từng phần tử', 'Sắp xếp lại mỗi lần'], 'Tra bằng bảng băm gần như một bước.');
const h3New1: ProbeGenerator = () => tChoice('Muốn đếm xem mỗi từ xuất hiện bao nhiêu lần trong 1 triệu từ, nên dùng gì?', ['Dictionary: khóa là từ, giá trị là số lần', 'List các cặp, mỗi lần tìm lại từ đầu', 'Set (không lưu được số lần)'], 'Dictionary vừa tra nhanh vừa lưu được số đếm.');
const h3New2: ProbeGenerator = () => tChoice("Cần kiểm tra 'mã đơn hàng này đã xử lý chưa' cho hàng triệu đơn, nhanh nhất là dùng gì?", ['Set các mã đã xử lý', 'List các mã, duyệt từng phần tử', 'Sắp xếp lại list mỗi lần'], 'Set tra gần như một bước, không phụ thuộc số lượng.');
const h3Verdict = kv("Hà nói: 'dict nhanh hơn list và không tốn thêm bộ nhớ'. Hà nói đúng hay sai?", "Hà nói: 'dict nhanh hơn nhưng đổi lại tốn thêm bộ nhớ'. Hà nói đúng hay sai?", 'Tốc độ có được là nhờ bỏ thêm bộ nhớ để nhớ vị trí', 'Dict không tốn bộ nhớ', 'List tốn nhiều bộ nhớ hơn dict', 'Sai: đổi bộ nhớ lấy tốc độ.');
const h3Read0: ProbeGenerator = () => tChoice('Danh sách chỉ có 5 phần tử. Duyệt hết list hay tra dict, cái nào nhanh hơn rõ rệt?', ['Gần như không khác nhau, vì n quá nhỏ', 'Dict nhanh hơn gấp nhiều lần', 'List nhanh hơn nhiều'], 'Khác biệt chỉ rõ khi n lớn.');
const h3Read1: ProbeGenerator = () => {
  const n = aPick([50, 200, 1000]);
  return tChoice(`Chỉ cần tra ĐÚNG MỘT lần trong một list có sẵn ${n} phần tử. Có đáng dựng dictionary rồi mới tra không?`, ['Không: dựng dictionary cũng phải duyệt n phần tử, không lợi cho một lần tra', 'Có, dictionary luôn nhanh hơn', 'Có, vì list không tra được'], 'Dựng bảng băm tốn cỡ n bước. Chỉ có lợi khi tra nhiều lần.');
};

export const structuresBanks: Record<string, ProbeBank> = {
  tp: { same: tpSame, flip: tpFlip, new: variantOf([tpNew0, tpNew1]), verdict: tpVerdict, read: variantOf([tpRead0, tpRead1]) },
  bub: { same: bubSame, flip: bubFlip, new: variantOf([bubNew0, bubNew1]), verdict: bubVerdict, read: variantOf([bubRead0, bubRead1]) },
  h1: { same: h1Same, flip: h1Flip, new: variantOf([h1New0, h1New1]), verdict: h1Verdict, read: variantOf([h1Read0, h1Read1]) },
  h2: { same: h2Same, flip: h2Flip, new: h2New, verdict: h2Verdict, read: variantOf([h2Read0, h2Read1]) },
  h3: { same: h3Same, flip: h3Flip, new: variantOf([h3New0, h3New1, h3New2]), verdict: h3Verdict, read: variantOf([h3Read0, h3Read1]) },
};
