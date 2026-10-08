// Probe banks cho bài mới: bo, mrg, qck.
import type { ProbeBank, ProbeGenerator } from '../../types';
import { kv, randRange, tChoice, tNum, variantOf, xSort } from '../builders';

/* ---------- bo: Big-O ---------- */
const boSame: ProbeGenerator = () => {
  const k = randRange(3, 10);
  return tNum(`2^${k} = ${2 ** k}. Tìm nhị phân trong ${2 ** k} hộp cần khoảng mấy lần nhìn?`, k, `2^${k} = ${2 ** k}: chia đôi ${k} lần.`);
};
const boFlip: ProbeGenerator = () => {
  const k = randRange(3, 6);
  return tNum(`Tìm nhị phân cần khoảng ${k} lần nhìn thì xử lý được cỡ mấy hộp? (2^${k} = ?)`, 2 ** k, `2^${k} = ${2 ** k} hộp.`);
};
const boNew0: ProbeGenerator = () => tChoice('Đoạn code có 2 vòng lặp lồng nhau, mỗi vòng chạy n lần. Độ phức tạp là gì?', ['O(n²)', 'O(n)', 'O(log n)'], 'n × n = n².');
const boNew1: ProbeGenerator = () => tChoice('Thuật toán A cần 1000n bước, B cần n² bước. n = 1 triệu thì ai nhanh hơn?', ['A (O(n))', 'B (O(n²))', 'Ngang nhau'], 'n lớn thì kiểu tăng quyết định, không phải hằng số.');
const boVerdict = kv("Nam nói: 'Big-O cho biết số bước chính xác của thuật toán'. Nam nói đúng hay sai?", "Nam nói: 'Big-O mô tả đà tăng của số bước theo n'. Nam nói đúng hay sai?", 'Big-O chỉ giữ kiểu tăng trưởng', 'Big-O đếm chính xác từng bước', 'Big-O chỉ đúng với n nhỏ', 'Sai: Big-O bỏ hằng số, không đếm chính xác.');
const boRead0: ProbeGenerator = () => tChoice('Sắp xếp nổi bọt: n phần tử, mỗi phần tử so với n phần tử khác. Độ phức tạp?', ['O(n²)', 'O(n)', 'O(n log n)'], 'Vòng lặp lồng nhau: n × n.');
const boRead1: ProbeGenerator = () => tChoice('A: O(n), B: O(n²). n = 10 thì B có thể nhanh hơn A không?', ['Có thể, nếu hằng số của B nhỏ', 'Không bao giờ', 'Chưa đủ dữ liệu'], 'Big-O nói về khi n lớn. n nhỏ thì hằng số quyết định.');

/* ---------- mrg: merge sort ---------- */
const mrgSame: ProbeGenerator = () => tChoice('Trộn [1, 4] và [2, 3] (đã sắp xếp). Số đầu tiên lấy ra là mấy?', ['1', '2', '4'], 'So đầu hai mảng: 1 < 2 nên lấy 1.');
const mrgFlip: ProbeGenerator = () => {
  const sa = xSort([randRange(1, 5), randRange(6, 9)]);
  const sb = xSort([randRange(1, 5), randRange(6, 9)]);
  const lo = Math.min(sa[0] ?? 0, sb[0] ?? 0);
  const hi = Math.max(sa[0] ?? 0, sb[0] ?? 0);
  return tChoice(`Trộn [${sa.join(',')}] và [${sb.join(',')}] (đã sắp xếp). Số đầu tiên lấy ra là mấy?`, [String(lo), String(hi)], 'So hai đầu, lấy số nhỏ hơn.');
};
const mrgNew0: ProbeGenerator = () => tChoice('Merge sort có log n tầng, mỗi tầng trộn n phần tử. Độ phức tạp?', ['O(n log n)', 'O(n²)', 'O(n)'], 'log n × n.');
const mrgNew1: ProbeGenerator = () => tChoice('Merge sort cần thêm bộ nhớ bao nhiêu để trộn?', ['O(n)', 'O(1)', 'O(log n)'], 'Cần mảng phụ chứa kết quả trộn.');
const mrgVerdict = kv("Lan nói: 'trộn hai mảng đã sắp xếp cần O(n²)'. Lan nói đúng hay sai?", "Lan nói: 'trộn hai mảng đã sắp xếp chỉ cần một lượt duyệt O(n)'. Lan nói đúng hay sai?", 'Mỗi phần tử chỉ so một lần', 'Trộn cần so mọi cặp', 'Trộn cần sắp xếp lại', 'Sai: một lượt duyệt là đủ.');
const mrgRead0: ProbeGenerator = () => tChoice('merge([1,4],[2,3]): đã lấy 1, 2. Còn [4] và [3]. Lấy tiếp số mấy?', ['3', '4', '1'], 'So 4 với 3: lấy 3.');
const mrgRead1: ProbeGenerator = () => tChoice('Sau vòng while trộn, một mảng còn thừa [5, 6]. Làm gì?', ['Nối hết phần thừa vào kết quả', 'Bỏ đi', 'Trộn lại từ đầu'], 'Phần thừa đã sắp xếp, nối vào là xong.');

/* ---------- qck: quicksort ---------- */
const qckSame: ProbeGenerator = () => tChoice('Quicksort trung bình là O gì?', ['O(n log n)', 'O(n²)', 'O(n)'], 'Như merge sort khi chia đều.');
const qckFlip: ProbeGenerator = () => tChoice('Quicksort xui nhất (chốt luôn lệch) là O gì?', ['O(n²)', 'O(n log n)', 'O(n)'], 'Mỗi lần chỉ loại 1 phần tử: n tầng × n bước.');
const qckNew0: ProbeGenerator = () => tChoice('Để tránh worst-case O(n²), người ta thường làm gì?', ['Chọn chốt ngẫu nhiên', 'Luôn chọn phần tử đầu', 'Sắp xếp mảng trước'], 'Ngẫu nhiên thì khó xui liên tục.');
const qckNew1: ProbeGenerator = () => tChoice('Chốt sau phân hoạch thì sao?', ['Đã đúng vị trí cuối cùng', 'Cần sắp xếp tiếp', 'Là số lớn nhất'], 'Trái nhỏ hơn, phải lớn hơn: chốt đóng đinh.');
const qckVerdict = kv("Minh nói: 'quicksort luôn nhanh hơn merge sort'. Minh nói đúng hay sai?", "Minh nói: 'quicksort trung bình O(n log n) nhưng xui nhất O(n²)'. Minh nói đúng hay sai?", 'Trung bình nhanh, xui nhất chậm', 'Luôn nhanh hơn mọi thuật toán', 'Luôn chậm hơn merge sort', 'Sai: còn tùy trường hợp.');
const qckRead0: ProbeGenerator = () => tChoice('a = [3, 1, 2], chốt = 2 (cuối). Phân hoạch: số nào sang trái chốt?', ['1', '3', '2'], '1 < 2 nên sang trái; 3 > 2 ở phải.');
const qckRead1: ProbeGenerator = () => tChoice('Quickselect (tìm số lớn thứ k) khác quicksort ở điểm gì?', ['Chỉ đệ quy một bên chứa k', 'Không cần chốt', 'Chậm hơn'], 'Không cần sắp xếp hết, chỉ cần một bên.');

export const sortingBanks: Record<string, ProbeBank> = {
  bo: { same: boSame, flip: boFlip, new: variantOf([boNew0, boNew1]), verdict: boVerdict, read: variantOf([boRead0, boRead1]) },
  mrg: { same: mrgSame, flip: mrgFlip, new: variantOf([mrgNew0, mrgNew1]), verdict: mrgVerdict, read: variantOf([mrgRead0, mrgRead1]) },
  qck: { same: qckSame, flip: qckFlip, new: variantOf([qckNew0, qckNew1]), verdict: qckVerdict, read: variantOf([qckRead0, qckRead1]) },
};
