// Ngân hàng tiny-check: câu hỏi siêu ngắn sau khi giở reference.
// Port verbatim từ main:notebook.js (object TINY, TINY_FOR, tinyFor).
// Quy ước: đáp án đúng luôn ở o[0]; UI tự xáo trộn khi hiện.

import type { StuckKind, TinyQuestion } from '../types';
import { at, rand1, shuffled } from './builders';

/** Một mẫu câu tiny-check */
export type TinyGenerator = () => TinyQuestion;

function tkPick<T>(arr: readonly T[], n: number): T[] {
  return shuffled(arr).slice(0, n);
}

/** Ngân hàng tiny-check theo concept */
export const TINY: Record<string, TinyGenerator[]> = {
  k3: [
    () => {
      const ns = tkPick(['An', 'Bình', 'Chi', 'Dũng', 'Minh', 'Lan', 'Nam', 'Hoa'], 4);
      const t = at(ns, 2);
      return {
        q: `Hàng có 4 bạn: ${ns.join(', ')}. Bạn ${t} đứng thứ mấy?`,
        a: 3,
        w: 'Đếm từ 1: thứ nhất, thứ hai, thứ ba.',
      };
    },
    () => {
      const ns = tkPick(['An', 'Bình', 'Chi', 'Dũng', 'Minh', 'Lan', 'Nam', 'Hoa'], 4);
      const t = at(ns, 2);
      return {
        q: `Hàng: ${ns.join(', ')}. Bạn ${t} có bao nhiêu người đứng TRƯỚC?`,
        a: 2,
        w: `${at(ns, 0)} và ${at(ns, 1)} đứng trước ${t}.`,
      };
    },
    () => {
      const ns = tkPick(['An', 'Bình', 'Chi', 'Dũng', 'Minh', 'Lan', 'Nam', 'Hoa'], 4);
      const t = at(ns, 2);
      return {
        q: `Hàng: ${ns.join(', ')}. Chỉ số (index) của bạn ${t} là mấy?`,
        a: 2,
        w: 'Chỉ số = số người đứng trước.',
      };
    },
    () => {
      const k = rand1(3);
      return {
        q: `Một bạn có chỉ số là ${k} thì đứng thứ mấy?`,
        a: k + 1,
        w: 'Thứ tự = chỉ số + 1.',
      };
    },
    () => ({
      q: '<pre>numbers = [10, 20, 30, 40]</pre>Phần tử đứng thứ 3 có chỉ số là mấy?',
      a: 2,
      w: 'Đứng thứ 3 → có 2 phần tử đứng trước → chỉ số 2.',
    }),
    () => ({
      q: '<pre>numbers = [10, 20, 30, 40]</pre><code>numbers[2]</code> là phần tử đứng thứ mấy?',
      a: 3,
      w: 'Chỉ số 2 nghĩa là có 2 phần tử đứng trước, nên đó là phần tử thứ 3.',
    }),
  ],
  rd1: [
    () => ({
      q: 'Đề: «Cho một danh sách số. Hãy tìm số lớn nhất.» Đề CHO ta cái gì?',
      o: ['Một danh sách số', 'Số lớn nhất', 'Cách tìm ra số lớn nhất'],
      a: 0,
      w: 'CHO là dữ kiện đề đã cho sẵn, chưa phải điều phải tìm.',
    }),
    () => ({
      q: 'Vẫn đề đó. Đề HỎI điều gì?',
      o: ['Giá trị lớn nhất (một con số)', 'Vị trí của số lớn nhất', 'Danh sách các số'],
      a: 0,
      w: "Đề hỏi 'tìm số lớn nhất' — trả về giá trị, không phải vị trí.",
    }),
    () => ({
      q: 'Đề: «Cho một danh sách số. Hãy tìm số lớn nhất.» Đầu vào và đầu ra là gì?',
      o: ['Vào: danh sách số; Ra: một con số', 'Vào: một con số; Ra: danh sách số', 'Vào: danh sách số; Ra: danh sách số'],
      a: 0,
      w: 'Đầu vào là thứ đề đưa cho ta; đầu ra là thứ đề muốn ta trả về.',
    }),
    () => ({
      q: 'Đề: «Cho dãy [4, 9, 9, 2]. Tìm số lớn nhất, trả về VỊ TRÍ đầu tiên, đếm từ 0.» Cụm nào là ràng buộc phải gạch chân?',
      o: ['VỊ TRÍ + đếm từ 0 + ĐẦU TIÊN', 'Dãy có 4 số', 'Số lớn nhất là 9'],
      a: 0,
      w: 'Mỗi cụm nhỏ là một yêu cầu: hỏi vị trí (không phải giá trị), đếm từ 0, lấy cái đầu tiên.',
    }),
  ],
};

/**
 * Bài nào dùng ngân hàng tiny-check nào khi không có bank riêng.
 * LƯU Ý: a2/a3/bs CÓ tồn tại (định nghĩa trong NEW ở app.js) — đừng xóa.
 */
export const TINY_FOR: Record<string, string> = { l1: 'k3', a2: 'k3', a3: 'k3', b5: 'k3', bs: 'k3' };

/**
 * Chọn bank tiny-check cho một bài học.
 * - vướng ở đọc đề ('de') → bank rd1
 * - bài có bank riêng (TINY[lessonId]) → dùng bank đó
 * - còn lại tra TINY_FOR, không có → null (bỏ qua tiny-check)
 */
export function tinyFor(lessonId: string, stuckKind?: StuckKind): string | null {
  if (stuckKind === 'de') return 'rd1';
  if (TINY[lessonId] !== undefined) return lessonId;
  return TINY_FOR[lessonId] ?? null;
}
