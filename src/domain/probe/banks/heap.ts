// Probe banks cho bài mới: hep, hps.
import type { ProbeBank, ProbeGenerator } from '../../types';
import { kv, tChoice, tNum, variantOf } from '../builders';

/* ---------- hep: heap ---------- */
const hepSame: ProbeGenerator = () => tChoice('Min-heap: số nhỏ nhất của cả cây nằm ở đâu?', ['Ở gốc cây', 'Ở lá nào đó', 'Không biết'], 'Cha luôn nhỏ hơn con, gốc là cha của tất cả.');
const hepFlip: ProbeGenerator = () => tNum('Heap lưu trong mảng: con trái của chỉ số 1 ở chỉ số mấy? (2*1+1)', 3, 'Con của i là 2*i+1 và 2*i+2.');
const hepNew0: ProbeGenerator = () => tChoice('Thêm và lấy ra khỏi heap n phần tử, mỗi thao tác O(log n). Tổng?', ['O(n log n)', 'O(n²)', 'O(n)'], 'n × log n.');
const hepNew1: ProbeGenerator = () => tChoice('Python dùng module nào cho heap?', ['heapq', 'heaplib', 'pyheap'], 'heap + queue.');
const hepVerdict = kv("An nói: 'heap đã sắp xếp toàn bộ mảng'. An nói đúng hay sai?", "An nói: 'heap chỉ đảm bảo gốc là nhỏ nhất, còn lại chưa sắp xếp'. An nói đúng hay sai?", 'Chỉ gốc được đảm bảo', 'Heap sắp xếp hết', 'Heap không có thứ tự gì', 'Sai: chỉ gốc nhỏ nhất.');
const hepRead0: ProbeGenerator = () => tChoice('Min-heap [2, 5, 3]. Thêm 1: nó đi đâu?', ['Nổi lên gốc', 'Ở yên cuối', 'Xóa số 2'], '1 nhỏ hơn cha thì đổi chỗ liên tục.');
const hepRead1: ProbeGenerator = () => tChoice('Lấy số nhỏ nhất ra khỏi heap. Ai thay vào gốc?', ['Phần tử cuối mảng, rồi chìm xuống', 'Xóa luôn gốc', 'Lấy ngẫu nhiên'], 'Lấp gốc trước, rồi chìm đúng chỗ.');

/* ---------- hps: heap sort ---------- */
const hpsSame: ProbeGenerator = () => tChoice('Heap sort: đổ n số vào heap rồi lấy ra từng số nhỏ nhất. Độ phức tạp?', ['O(n log n)', 'O(n²)', 'O(n)'], 'n lần × O(log n).');
const hpsFlip: ProbeGenerator = () => tChoice('So với merge sort, heap sort hơn ở điểm gì?', ['Không cần mảng phụ O(n)', 'Nhanh hơn', 'Ổn định hơn'], 'Vun ngay trên mảng gốc: O(1).');
const hpsNew0: ProbeGenerator = () => tChoice('Heap sort có worst-case O(n²) như quicksort không?', ['Không, luôn O(n log n)', 'Có', 'Tùy mảng'], 'Heap đảm bảo cân bằng.');
const hpsNew1: ProbeGenerator = () => tChoice('Nhược điểm của heap sort so với merge sort?', ['Không ổn định (stable)', 'Chậm hơn', 'Tốn nhớ hơn'], 'Phần tử bằng nhau có thể đổi thứ tự.');
const hpsVerdict = kv("Bình nói: 'heap sort cần mảng phụ O(n) như merge sort'. Bình nói đúng hay sai?", "Bình nói: 'heap sort sắp xếp tại chỗ O(1)'. Bình nói đúng hay sai?", 'Vun ngay trên mảng gốc', 'Cần mảng phụ', 'Cần đệ quy sâu', 'Sai: tại chỗ O(1).');
const hpsRead0: ProbeGenerator = () => tChoice('Xếp 3 thuật toán O(n log n) theo bộ nhớ phụ tăng dần, ai đầu?', ['Quicksort / heap sort O(1)', 'Merge sort O(n)', 'Ngang nhau'], 'Hai cái tại chỗ đứng trước.');
const hpsRead1: ProbeGenerator = () => tChoice('LeetCode 912 chấp nhận cả 3. Python dùng thuật toán nào trong sorted()?', ['Timsort (lai)', 'Thuần merge sort', 'Thuần quicksort'], 'Timsort lai merge + insertion.');

export const heapBanks: Record<string, ProbeBank> = {
  hep: { same: hepSame, flip: hepFlip, new: variantOf([hepNew0, hepNew1]), verdict: hepVerdict, read: variantOf([hepRead0, hepRead1]) },
  hps: { same: hpsSame, flip: hpsFlip, new: variantOf([hpsNew0, hpsNew1]), verdict: hpsVerdict, read: variantOf([hpsRead0, hpsRead1]) },
};
