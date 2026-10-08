// Nhãn tiếng Việt dùng chung cho các flow (tách khỏi logic để dễ review).
import type { ProbeShape, StuckKind } from '../domain/types';

/** Tên 5 dạng câu probe. */
export const SHAPE_LABELS: Record<ProbeShape, string> = {
  same: 'áp dụng với số khác',
  flip: 'đi ngược chiều (từ kết quả suy ra vị trí)',
  new: 'đem ý tưởng sang bối cảnh khác',
  verdict: 'tự phán đúng/sai và nói được vì sao',
  read: 'đọc kỹ đề trước khi tính',
};

/** Tên ngắn 5 dạng câu (dùng ở màn ôn). */
export const SHAPE_SHORT: Record<ProbeShape, string> = {
  same: 'đổi số',
  flip: 'đi ngược chiều',
  new: 'bối cảnh mới',
  verdict: 'tự phán đúng/sai',
  read: 'đọc kỹ đề',
};

/** Kiểm tra một chuỗi có phải ProbeShape hợp lệ (dùng khi lọc miss record). */
export function isProbeShape(s: string): s is ProbeShape {
  return Object.keys(SHAPE_SHORT).includes(s);
}

/** 6 loại vướng mắc khi bấm "Chưa hiểu". */
export const STUCK_KINDS: { kind: StuckKind; label: string }[] = [
  { kind: 'de', label: 'Tôi không hiểu đề đang hỏi gì' },
  { kind: 'concept', label: 'Tôi không hiểu từ / khái niệm trong đề' },
  { kind: 'start', label: 'Tôi hiểu đề nhưng không biết bắt đầu từ đâu' },
  { kind: 'python', label: 'Tôi hiểu ý nhưng không biết viết Python' },
  { kind: 'theory', label: 'Tôi không hiểu lý thuyết phía sau' },
  { kind: 'unsure', label: 'Tôi chỉ không chắc đáp án' },
];

/** Tên hiển thị của loại vướng mắc (dùng ở hồ sơ). */
export const STUCK_LABELS: Record<StuckKind, string> = {
  de: 'không hiểu đề',
  concept: 'không hiểu khái niệm',
  start: 'không biết bắt đầu',
  python: 'không biết viết Python',
  theory: 'không hiểu lý thuyết',
  unsure: 'không chắc đáp án',
};

/** Kiểm tra một chuỗi có phải StuckKind hợp lệ. */
export function isStuckKind(s: string): s is StuckKind {
  return Object.keys(STUCK_LABELS).includes(s);
}

/** Thói quen xấu (hab). */
export const HAB_LABELS: Record<string, string> = {
  careless: 'Cẩu thả (sai trong chưa đầy 4 giây)',
  misread: 'Đọc sai đề',
  overconfident: 'Chắc chắn mà vẫn sai',
};

/** Gợi ý đổi cách học theo dạng câu hay sai nhất (FIX). */
export const FIX_TIPS: Record<string, string> = {
  same: 'Bạn sai cả ở dạng cơ bản nhất (đổi số). Lần này học chậm lại: ở mỗi bước, tự dự đoán đáp án TRƯỚC khi bấm.',
  flip: 'Bạn làm được chiều xuôi nhưng sai khi đi ngược. Tức là mới nhớ cách làm, chưa hiểu quan hệ hai chiều. Lần này sau mỗi ví dụ, tự hỏi: nếu đề cho KẾT QUẢ thì suy ra ĐẦU VÀO thế nào?',
  new: 'Bạn sai khi đổi bối cảnh. Tức là mới nhớ ví dụ, chưa nhìn ra ý tưởng chung. Lần này sau mỗi ví dụ, tự nghĩ thêm một ví dụ khác ngoài đời.',
  verdict:
    'Bạn khó tự phán đúng/sai và nói vì sao. Lần này hãy nói thành lời lý do của mỗi đáp án, không chỉ chọn.',
  read: 'Bạn hay sai ở câu bẫy đọc đề. Lần này trước mỗi câu, gạch dưới điều đề HỎI và điều đề CHO, rồi mới tính.',
};

/** Các bài nền tảng cho kiểm tra sức khỏe (FOUND). */
export const FOUNDATION_IDS: string[] = [
  'k1',
  'k3',
  'k4',
  'k6',
  'k7',
  'bx0',
  'p1',
  'p2',
  'p3',
  'p4',
  'a2',
  'a3',
  'sm',
];

/** Khoảng cách ôn Leitner theo hộp (ngày). */
export const LEITNER_DAYS: readonly number[] = [1, 3, 7, 14, 30];

/** Ngưỡng trả lời "quá nhanh" bị coi là cẩu thả (ms). */
export const CARELESS_MS = 4000;
