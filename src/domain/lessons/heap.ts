// Bài mới: heap, heap sort (Stage 7: Linked list, cây).
import type { RichLesson } from './lesson-types';

export const HEAP_LESSONS: RichLesson[] = [
  {
    id: "hep",
    t: "Heap: cây luôn biết số nhỏ nhất",
    steps: [
      {
        k: "choice",
        q: "Heap là cây nhị phân mà cha luôn nhỏ hơn con (min-heap). Số nhỏ nhất của cả cây nằm ở đâu?",
        o: ["Ở gốc cây", "Ở lá nào đó", "Không biết"],
        a: 0,
        h: "Cha nhỏ hơn con, mà gốc là cha của tất cả.",
        s: "Gốc heap luôn là số nhỏ nhất."
      },
      {
        k: "choice",
        q: "Thêm số 1 vào min-heap [2, 5, 3]. Số 1 'nổi' lên đâu?",
        o: ["Lên gốc (đổi chỗ với cha cho đến khi đúng)", "Ở yên cuối mảng", "Xóa số 2"],
        a: 0,
        h: "1 nhỏ hơn cha nó thì đổi chỗ, lặp lại.",
        s: "Nổi lên (bubble up) đến khi cha nhỏ hơn nó."
      },
      {
        k: "choice",
        q: "Lấy số nhỏ nhất ra khỏi heap (pop). Ai thay vào gốc?",
        o: ["Phần tử cuối mảng, rồi 'chìm' xuống", "Xóa luôn gốc", "Lấy ngẫu nhiên"],
        a: 0,
        h: "Cần lấp chỗ trống ở gốc trước.",
        s: "Đưa cuối mảng lên gốc, rồi chìm xuống đúng chỗ."
      },
      {
        k: "input",
        q: "Heap lưu trong mảng: con trái của chỉ số i ở 2*i+1, con phải ở 2*i+2. Nút chỉ số 1 có con trái ở chỉ số mấy?",
        a: 3,
        h: "2*1+1.",
        s: "Heap trong mảng: không cần con trỏ."
      },
      {
        k: "choice",
        q: "Thêm và lấy ra khỏi heap n phần tử, mỗi thao tác O(log n). Tổng là O gì?",
        o: ["O(n log n)", "O(n²)", "O(n)"],
        a: 0,
        h: "n lần × log n mỗi lần.",
        s: "n thao tác heap = O(n log n)."
      },
      {
        k: "choice",
        q: "Python có sẵn heap trong module nào?",
        o: ["heapq", "heaplib", "pyheap"],
        a: 0,
        h: "heap + queue.",
        s: "heapq: heappush, heappop."
      }
    ],
    note: "<b>Heap (min-heap): cây nhị phân mà cha luôn ≤ con.</b><br>• <b>Gốc luôn là số nhỏ nhất</b> — lấy ra chỉ O(1) để xem, O(log n) để lấy.<br>• Thêm: đặt cuối mảng, <b>nổi lên</b> (đổi với cha) đến đúng chỗ.<br>• Lấy ra: đưa phần tử cuối lên gốc, <b>chìm xuống</b> (đổi với con nhỏ hơn).<br>• Lưu trong mảng: con của i là <code>2*i+1</code> và <code>2*i+2</code>.<br>• Python: <code>import heapq</code> — <code>heappush(h, x)</code>, <code>heappop(h)</code>.<br><b>Lỗi hay gặp:</b> Python chỉ có min-heap (muốn max-heap thì đẩy số âm); quên heap không sắp xếp toàn bộ, chỉ đảm bảo gốc nhỏ nhất.<br><b>LeetCode 215</b> (Kth Largest): giữ min-heap cỡ k."
  },
  {
    id: "hps",
    t: "Sắp xếp vun đống: heap sort",
    steps: [
      {
        k: "choice",
        q: "Heap sort: đổ n số vào heap, rồi lấy ra từng số nhỏ nhất. Kết quả thế nào?",
        o: ["Mảng đã sắp xếp tăng dần", "Mảng ngẫu nhiên", "Heap rỗng"],
        a: 0,
        h: "Mỗi lần lấy ra số nhỏ nhất còn lại.",
        s: "Lấy dần số nhỏ nhất = sắp xếp."
      },
      {
        k: "choice",
        q: "Độ phức tạp của heap sort?",
        o: ["O(n log n)", "O(n²)", "O(n)"],
        a: 0,
        h: "n lần đẩy + n lần lấy, mỗi lần O(log n).",
        s: "O(n log n) — ngang merge/quick sort."
      },
      {
        k: "choice",
        q: "So với merge sort, heap sort hơn ở điểm gì?",
        o: ["Không cần mảng phụ O(n)", "Nhanh hơn", "Ổn định hơn"],
        a: 0,
        h: "Heap sort vun ngay trên mảng gốc.",
        s: "Tại chỗ O(1) — không tốn mảng phụ như merge."
      },
      {
        k: "order",
        q: "Xếp 3 thuật toán O(n log n) theo bộ nhớ phụ tăng dần:",
        s: "So sánh bộ nhớ phụ.",
        items: [
          ["Quicksort O(1) — tại chỗ", "Ai không cần mảng phụ?"],
          ["Heap sort O(1) — tại chỗ", "Ai cũng tại chỗ?"],
          ["Merge sort O(n) — cần mảng trộn", "Ai cần mảng phụ?"]
        ]
      },
      {
        k: "choice",
        q: "LeetCode 912 (Sort an Array) chấp nhận cả 3. Bài này trong thực tế người ta hay cài cách nào nhất?",
        o: ["Tùy ngôn ngữ (Python dùng Timsort)", "Luôn merge sort", "Luôn heap sort"],
        a: 0,
        h: "Python: sorted() dùng Timsort (lai merge + insertion).",
        s: "Thực tế dùng thuật toán lai của ngôn ngữ."
      }
    ],
    note: "<b>Heap sort: đổ vào heap, lấy ra dần = sắp xếp.</b><br>• <b>O(n log n)</b> mọi trường hợp (không có worst-case như quicksort).<br>• <b>Tại chỗ O(1)</b>: vun đống ngay trên mảng gốc, không cần mảng phụ.<br>• Không ổn định (stable): phần tử bằng nhau có thể đổi thứ tự.<br><b>So sánh bộ 3 O(n log n):</b> quicksort nhanh thực tế nhất; merge sort ổn định + cần O(n) nhớ; heap sort tại chỗ + đảm bảo worst-case.<br><b>LeetCode 912</b>: thử cài cả 3 cách."
  }
];
