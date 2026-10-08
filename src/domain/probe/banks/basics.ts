// Ngân hàng probe l1, l2, l3 — port từ main:probe.js (block PRB) + extras cuối file + verdict extras từ main:probe-foundation.js.
import type { ProbeBank } from '../../types';
import { at, distinct, pJ, rand1, tChoice, tNum, variantOf, verdictTrue, why, YN } from '../builders';

const l1Same = () => {
  const a = distinct(5, 9), k = rand1(5) - 1;
  return tNum(`Mảng ${pJ(a)}. Hộp có chỉ số ${k} chứa số mấy?`, at(a, k), `Chỉ số ${k} là hộp thứ ${k + 1} tính từ trái, chứa ${at(a, k)}.`);
};
const l1Flip = () => {
  const a = distinct(5, 9), k = rand1(5) - 1;
  return tNum(`Mảng ${pJ(a)}. Số ${at(a, k)} nằm ở hộp có chỉ số mấy?`, k, `Đếm từ 0: ${at(a, k)} đứng sau ${k} hộp nên chỉ số là ${k}.`);
};
const l1New0 = () => {
  const n = rand1(6) + 3, m = rand1(n - 1);
  return tNum(`${n} bạn xếp hàng, đánh số bắt đầu từ 0. Có đúng ${m} bạn đứng trước Lan. Chỉ số của Lan là mấy?`, m, `Chỉ số = số người đứng trước = ${m}.`);
};
const l1New1 = () => {
  const n = rand1(5) + 4, k = rand1(n - 1);
  return tNum(`Một dãy ${n} ghế đánh số từ 0. Nam ngồi ghế số ${k}. Có bao nhiêu ghế ở TRƯỚC Nam?`, k, `Ghế số ${k} đứng sau ${k} ghế (số 0 đến ${k - 1}).`);
};
const l1Read0 = () => {
  const n = rand1(6) + 3;
  return { q: `Mảng có ${n} hộp. Hộp có chỉ số ${n} chứa số mấy?`, o: [`Số nằm ở hộp thứ ${n}`, `Không có hộp nào như vậy: chỉ số lớn nhất chỉ là ${n - 1}`, '0'], a: 1, w: `Đề hỏi chỉ số ${n}, nhưng ${n} hộp thì chỉ số lớn nhất là ${n - 1}. Phải đọc kỹ con số trong đề trước khi tính.` };
};
const l1Read1 = () => {
  const a = distinct(4, 9);
  return tChoice(`Mảng ${pJ(a)}. Phần tử ở chỉ số 1 là số nào?`, [`${at(a, 1)}`, `${at(a, 0)}`, `${at(a, 2)}`], `Chỉ số 1 là hộp thứ hai: ${at(a, 1)}, không phải ${at(a, 0)}.`);
};
const l1Verdict0 = () => {
  const n = rand1(6) + 3;
  return { q: `An nói: "Mảng có ${n} hộp thì các chỉ số là 1, 2, ..., ${n}". An nói đúng hay sai?`, o: YN, a: 1, w: `Sai: máy đếm từ 0, nên chỉ số là 0 đến ${n - 1}.`, why: why(`Máy đếm từ 0 nên chỉ số là 0 đến ${n - 1}`, 'Chỉ số phải bằng số hộp', 'Mảng không có chỉ số') };
};
const l1Verdict1 = () => {
  const n = rand1(6) + 3;
  return { q: `Mai nói: "Mảng có ${n} hộp thì hộp cuối có chỉ số ${n}". Mai nói đúng hay sai?`, o: YN, a: 1, w: `Sai: hộp cuối có chỉ số ${n - 1}.`, why: why(`Chỉ số bắt đầu từ 0 nên hộp cuối là ${n - 1}`, 'Hộp cuối không có chỉ số', 'Chỉ số cuối luôn là 1') };
};
const l1Verdict2 = verdictTrue('Mai nói: "Mảng 6 hộp có các chỉ số từ 0 đến 5". Mai nói đúng hay sai?', 'Máy đếm từ 0 nên hộp cuối có chỉ số 5', 'Chỉ số bắt đầu từ 1', 'Mảng không có chỉ số', 'Đúng.');

const l2Same = () => {
  const n = rand1(90) + 10;
  return tNum(`Mảng ${n} hộp, số cần tìm nằm ở hộp cuối. Mở từ trái sang phải, phải mở bao nhiêu hộp?`, n, `Phải mở cả ${n} hộp.`);
};
const l2Flip = () => {
  const k = rand1(40) + 2;
  return tNum(`Số cần tìm nằm ở hộp có chỉ số ${k}. Mở từ trái sang phải, phải mở bao nhiêu hộp mới thấy nó?`, k + 1, `Chỉ số ${k} là hộp thứ ${k + 1} (vì chỉ số bắt đầu từ 0).`);
};
const l2New0 = () => {
  const n = rand1(900) + 100;
  return tNum(`Danh bạ có ${n} người, chưa sắp xếp. Tên "Minh" không có trong đó. Phải xem bao nhiêu người mới CHẮC CHẮN là không có?`, n, `Chỉ khi xem hết ${n} người mới dám kết luận không có.`);
};
const l2New1 = () => {
  const n = rand1(40) + 10;
  return tNum(`${n} chiếc chìa khóa, chỉ một chiếc mở được cửa, bạn thử lần lượt. Tệ nhất phải thử bao nhiêu chiếc?`, n, `Tệ nhất chiếc đúng nằm cuối: thử ${n} chiếc.`);
};
const l2Read0 = () => {
  const n = rand1(90) + 10;
  return tChoice(`Mảng ${n} hộp. Số cần tìm nằm ở hộp ĐẦU TIÊN. Tìm từ trái sang phải, phải mở bao nhiêu hộp?`, ['1', `${n}`, `${Math.floor(n / 2)}`], 'Đề nói số đó nằm ở hộp đầu, không phải trường hợp xấu nhất. Đọc đúng điều kiện trước khi dùng công thức quen.');
};
const l2Read1 = () => {
  const n = rand1(90) + 10;
  return tChoice(`Mảng ${n} hộp. Số cần tìm KHÔNG có trong mảng. Phải mở bao nhiêu hộp để chắc chắn?`, [`${n}`, '1', `${n - 1}`], `Muốn chắc là không có thì phải mở hết ${n} hộp.`);
};
const l2Verdict0 = () => ({
  q: 'Nam nói: "Mảng 1000 hộp chưa sắp xếp. Mở 10 hộp đầu không thấy số 9 thì chắc chắn mảng không có số 9". Nam nói đúng hay sai?',
  o: YN, a: 1, w: 'Sai: còn 990 hộp chưa mở.',
  why: why('Còn 990 hộp chưa mở, số 9 có thể nằm ở đó', 'Mảng 1000 hộp luôn có số 9', 'Mở 10 hộp là quá nhiều'),
});
const l2Verdict1 = () => ({
  q: 'Linh nói: "Mảng 50 hộp, tôi mở hộp đầu đã thấy số cần tìm, vậy tìm tuyến tính luôn nhanh". Linh nói đúng hay sai?',
  o: YN, a: 1, w: 'Sai: may mắn một lần không đại diện cho trường hợp xấu nhất.',
  why: why('Số có thể nằm ở hộp cuối hoặc không có, khi đó phải mở cả 50 hộp', 'Mở hộp đầu luôn thấy', 'Tìm tuyến tính luôn mất đúng 1 bước'),
});
const l2Verdict2 = verdictTrue('Tuấn nói: "Mảng chưa sắp xếp, muốn chắc là không có số 9 thì phải mở hết các hộp". Tuấn nói đúng hay sai?', 'Hộp chưa mở vẫn có thể chứa số 9', 'Mở nửa số hộp là đủ', 'Không cần mở hộp nào', 'Đúng.');

const l3Same = () => {
  const a = Array.from({ length: 5 }, () => rand1(9)), k = rand1(4), m = Math.max(...a.slice(0, k + 1));
  return tNum(`Mảng ${pJ(a)}. Sau khi xét xong hộp chỉ số ${k}, tờ giấy "lớn nhất đã thấy" ghi số mấy?`, m, `Lớn nhất của ${pJ(a.slice(0, k + 1))} là ${m}.`);
};
const l3Flip = () => {
  const a = Array.from({ length: 5 }, () => rand1(9)), k = rand1(4), m = Math.min(...a.slice(0, k + 1));
  return tNum(`Lần này giấy ghi "số NHỎ nhất đã thấy". Mảng ${pJ(a)}. Sau khi xét xong hộp chỉ số ${k}, giấy ghi số mấy?`, m, `Nhỏ nhất của ${pJ(a.slice(0, k + 1))} là ${m}. Cùng cách nghĩ, chỉ đổi chiều so sánh.`);
};
const l3New0 = () => {
  const a = distinct(3, 9).map((x) => -x);
  return tNum(`Mảng ${pJ(a)}. Bạn ghi số 0 lên giấy từ đầu, rồi so từng hộp theo luật "lớn hơn thì ghi đè". Cuối cùng giấy ghi số mấy?`, 0, 'Không hộp nào lớn hơn 0 nên giấy giữ 0, dù 0 không có trong mảng. Vì vậy phải lấy hộp đầu làm mốc.');
};
const l3New1 = () => {
  const a = distinct(4, 9), t = a.reduce((x, y) => x + y, 0);
  return tNum(`Giấy ghi tổng đang có. Bắt đầu từ 0, cộng lần lượt các số của ${pJ(a)}. Cuối cùng giấy ghi số mấy?`, t, `Cùng cách nghĩ "giữ một giá trị đang có rồi cập nhật": tổng là ${t}.`);
};
const l3Read0 = () => {
  const a = distinct(3, 9).map((x) => -x), mx = Math.max(...a), mn = Math.min(...a), md = at(a.filter((x) => x !== mx && x !== mn), 0);
  return tChoice(`Mảng ${pJ(a)}. Số LỚN nhất trong mảng là số nào?`, [`${mx}`, `${mn}`, `${md}`], `Với số âm, ${mx} lớn hơn ${md} và ${mn}: lớn nhất là số gần 0 nhất, không phải số trông "to" nhất.`);
};
const l3Read1 = () => {
  let a: number[] = [], m = 0, k = 0;
  do { a = distinct(4, 9); m = Math.max(...a); k = a.indexOf(m); } while (m === k || m === k + 1);
  return tChoice(`Mảng ${pJ(a)}. VỊ TRÍ (chỉ số) của số lớn nhất là mấy?`, [`${k}`, `${m}`, `${k + 1}`], `Đề hỏi chỉ số, không phải giá trị: số lớn nhất là ${m}, nằm ở chỉ số ${k}.`);
};
const l3Verdict0 = () => ({
  q: 'Hoa nói: "Tìm số lớn nhất của 1000 hộp thì chỉ cần so hộp đầu với hộp cuối". Hoa nói đúng hay sai?',
  o: YN, a: 1, w: 'Sai: số lớn nhất có thể nằm ở bất kỳ hộp nào.',
  why: why('Số lớn nhất có thể nằm ở hộp giữa, phải xem hết', 'Hộp đầu luôn lớn nhất', 'Hộp cuối luôn lớn nhất'),
});
const l3Verdict1 = () => ({
  q: 'Bình nói: "Tôi đặt giấy bằng 0 rồi tìm số lớn nhất, vậy là luôn đúng". Bình nói đúng hay sai?',
  o: YN, a: 1, w: 'Sai: nếu mọi số đều âm thì 0 thắng sai.',
  why: why('Với mảng toàn số âm thì 0 lớn hơn mọi số trong mảng', '0 luôn là số lớn nhất', 'Giấy không thể bằng 0'),
});
const l3Verdict2 = verdictTrue('Hà nói: "Nên lấy hộp đầu tiên làm mốc cho giấy nhớ, rồi so với các hộp còn lại". Hà nói đúng hay sai?', 'Hộp đầu là số có thật trong mảng nên không bao giờ sai mốc', 'Mốc luôn phải bằng 0', 'Mốc không quan trọng', 'Đúng.');

export const basicsBanks: Record<string, ProbeBank> = {
  l1: { same: l1Same, flip: l1Flip, new: variantOf([l1New0, l1New1]), verdict: variantOf([l1Verdict0, l1Verdict1, l1Verdict2]), read: variantOf([l1Read0, l1Read1]) },
  l2: { same: l2Same, flip: l2Flip, new: variantOf([l2New0, l2New1]), verdict: variantOf([l2Verdict0, l2Verdict1, l2Verdict2]), read: variantOf([l2Read0, l2Read1]) },
  l3: { same: l3Same, flip: l3Flip, new: variantOf([l3New0, l3New1]), verdict: variantOf([l3Verdict0, l3Verdict1, l3Verdict2]), read: variantOf([l3Read0, l3Read1]) },
};
