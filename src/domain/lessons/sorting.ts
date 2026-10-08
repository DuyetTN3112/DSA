// Bài mới: Big-O, merge sort, quicksort (Stage 5: Tìm kiếm và sắp xếp).
import type { RichLesson } from './lesson-types';

export const SORTING_LESSONS: RichLesson[] = [
  {
    id: "bo",
    t: "Big-O: đếm bước theo n",
    steps: [
      {
        k: "input",
        q: "Tìm tuyến tính trong 8 hộp, xui nhất (số ở cuối hoặc không có) phải nhìn mấy hộp?",
        a: 8,
        h: "Xui nhất là phải nhìn hết.",
        s: "Tuyến tính xui nhất: nhìn hết n hộp."
      },
      {
        k: "input",
        q: "Tìm nhị phân trong 8 hộp: 8→4→2→1. Mấy lần nhìn?",
        a: 3,
        h: "2^3 = 8.",
        s: "Nhị phân: 8 hộp chỉ cần 3 lần."
      },
      {
        k: "choice",
        q: "n = 1 triệu hộp. Xui nhất, tuyến tính nhìn mấy lần? Nhị phân mấy lần?",
        o: ["1 triệu vs khoảng 20", "1 triệu vs 500 nghìn", "20 vs 20"],
        a: 0,
        h: "Tuyến tính nhìn hết. Nhị phân: 2^20 ≈ 1 triệu.",
        s: "Chênh lệch khủng khiếp khi n lớn."
      },
      {
        k: "choice",
        q: "Cách gọi tên cho 'số bước tăng theo n' là gì?",
        o: ["Big-O", "Biến n", "Hàm số"],
        a: 0,
        h: "Ký hiệu O(n), O(log n) em đã gặp rải rác.",
        s: "Big-O mô tả đà tăng của số bước theo n."
      },
      {
        k: "choice",
        q: "Big-O tính theo trường hợp nào?",
        o: ["Tệ nhất (worst case) — để đảm bảo", "Trung bình", "Tốt nhất"],
        a: 0,
        h: "Công ty cần đảm bảo, không cần may mắn.",
        s: "Big-O = bảo hiểm cho trường hợp tệ nhất."
      },
      {
        k: "choice",
        q: "Thuật toán A cần 2n bước, B cần n bước. Big-O của cả hai?",
        o: ["Cùng là O(n) — bỏ hằng số 2", "O(2n) và O(n)", "O(n²)"],
        a: 0,
        h: "Khi n = 1 tỉ, chênh 2 lần không đáng kể so với chênh kiểu tăng.",
        s: "Big-O bỏ hằng số, chỉ giữ kiểu tăng trưởng."
      },
      {
        k: "order",
        q: "Xếp từ nhanh đến chậm khi n rất lớn:",
        s: "Thang đo tốc độ chuẩn.",
        items: [
          ["O(1) — một bước", "Cái gì không phụ thuộc n?"],
          ["O(log n) — chia đôi", "Cái gì bỏ một nửa mỗi lần?"],
          ["O(n) — duyệt hết", "Cái gì nhìn từng hộp một lần?"],
          ["O(n log n) — chia đôi rồi duyệt", "Kết hợp hai cái trên?"],
          ["O(n²) — lồng nhau", "Vòng lặp trong vòng lặp?"]
        ]
      },
      {
        k: "choice",
        q: "Sắp xếp nổi bọt: mỗi phần tử so với mọi phần tử khác. O gì?",
        o: ["O(n²)", "O(n)", "O(n log n)"],
        a: 0,
        h: "n phần tử, mỗi cái so n lần.",
        s: "Vòng lặp lồng nhau = n × n."
      },
      {
        k: "reflect",
        q: "Vì sao công ty quan tâm Big-O khi n = 1 tỉ bản ghi?",
        s: "Đã nghĩ về quy mô thật."
      }
    ],
    note: "<b>Big-O: đếm bước theo n, tính trường hợp tệ nhất.</b><br>• Tìm tuyến tính: xui nhất nhìn hết n hộp → <b>O(n)</b>.<br>• Tìm nhị phân: mỗi lần bỏ một nửa → <b>O(log n)</b>. 1 triệu hộp chỉ cần ~20 lần (2<sup>20</sup> ≈ 1 triệu).<br>• Big-O <b>bỏ hằng số</b>: O(2n) = O(n). Chỉ giữ kiểu tăng trưởng.<br>• Thang đo: O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²).<br><b>Lỗi hay gặp:</b> tưởng O(n) nghĩa là đúng n bước; quên Big-O tính worst-case; nghĩ O(n²) luôn chậm hơn O(n) với mọi n (n nhỏ thì hằng số quyết định).<br><b>LeetCode 912</b> (Sort an Array): đọc mục Complexity trong lời giải, đối chiếu O(n log n)."
  },
  {
    id: "mrg",
    t: "Sắp xếp trộn: chia đôi rồi trộn",
    steps: [
      {
        k: "choice",
        q: "Merge sort chia mảng thành hai nửa, sắp xếp từng nửa, rồi trộn lại. Ý tưởng này gọi là gì?",
        o: ["Chia để trị (divide and conquer)", "Tham lam", "Thử sai"],
        a: 0,
        h: "Bài lớn chia thành bài nhỏ giống hệt.",
        s: "Chia để trị: chia nhỏ, giải nhỏ, gộp lại."
      },
      {
        k: "order",
        q: "Sắp xếp các bước của merge sort:",
        s: "Dàn ý của merge sort.",
        items: [
          ["Chia mảng thành hai nửa", "Bước đầu làm gì với mảng lớn?"],
          ["Sắp xếp từng nửa (đệ quy)", "Nửa nhỏ thì xử lý thế nào?"],
          ["Trộn hai nửa đã sắp xếp", "Cuối cùng gộp lại bằng gì?"]
        ]
      },
      {
        k: "choice",
        q: "Trộn [1, 4] và [2, 3] (cả hai đã sắp xếp). So sánh đầu hai mảng, lấy số nhỏ hơn. Số đầu tiên lấy ra là mấy?",
        o: ["1", "2", "4"],
        a: 0,
        h: "Đầu mảng trái là 1, đầu mảng phải là 2.",
        s: "Lấy 1, rồi tiếp tục so 4 với 2."
      },
      {
        k: "choice",
        q: "Mỗi tầng chia đôi xử lý hết n phần tử khi trộn. Có mấy tầng chia?",
        o: ["log n tầng", "n tầng", "2 tầng"],
        a: 0,
        h: "Chia đôi liên tục như tìm nhị phân.",
        s: "log n tầng, mỗi tầng n bước trộn."
      },
      {
        k: "choice",
        q: "Vậy merge sort là O gì?",
        o: ["O(n log n)", "O(n²)", "O(n)"],
        a: 0,
        h: "log n tầng × n bước mỗi tầng.",
        s: "O(n log n) — nhanh hơn hẳn O(n²) của nổi bọt."
      },
      {
        k: "order",
        q: "Ghép code hàm trộn (có 2 dòng THỪA không cần dùng):",
        s: "Ghép đúng thứ tự hàm trộn.",
        code: true,
        distractors: [6, 7],
        items: [
          ["def merge(a, b):", "Dòng đầu của hàm trộn là gì?"],
          ["    i = j = 0", "Cần con trỏ cho hai mảng?"],
          ["    res = []", "Cần mảng chứa kết quả?"],
          ["    while i < len(a) and j < len(b):", "Lặp khi cả hai còn phần tử?"],
          ["        if a[i] < b[j]: res.append(a[i]); i += 1", "Nhỏ hơn thì lấy từ a?"],
          ["        else: res.append(b[j]); j += 1", "Không thì lấy từ b?"],
          ["    print(res)", "In ra có phải là trả về không?"],
          ["    return sorted(a + b)", "Dùng hàm có sẵn thì còn gì là học trộn?"],
          ["    return res + a[i:] + b[j:]", "Nối phần còn lại rồi trả về?"]
        ]
      }
    ],
    note: "<b>Merge sort: chia đôi, sắp xếp từng nửa (đệ quy), trộn lại.</b><pre>merge([1,4], [2,3]):\n  so đầu hai mảng → lấy số nhỏ hơn\n  1 → 2 → 3 → 4  ⇒  [1,2,3,4]</pre>• Trộn hai mảng <b>đã sắp xếp</b> chỉ cần một lượt duyệt: O(n).<br>• Có log n tầng chia, mỗi tầng trộn hết n phần tử → <b>O(n log n)</b>.<br>• Cần thêm bộ nhớ O(n) để chứa kết quả trộn.<br><b>Lỗi hay gặp:</b> quên nối phần còn lại sau vòng while; so sánh sai chiều; không có điểm dừng đệ quy.<br><b>LeetCode 912</b> (Sort an Array): cài merge sort để qua bài này."
  },
  {
    id: "qck",
    t: "Sắp xếp nhanh: chọn chốt rồi phân hoạch",
    steps: [
      {
        k: "choice",
        q: "Quicksort chọn một 'chốt' (pivot), đưa số nhỏ hơn chốt sang trái, lớn hơn sang phải. Sau đó làm gì với hai bên?",
        o: ["Sắp xếp tiếp từng bên (đệ quy)", "Xong luôn", "Đổi chỗ hai bên"],
        a: 0,
        h: "Mỗi bên lại là bài sắp xếp nhỏ hơn.",
        s: "Đệ quy hai bên của chốt."
      },
      {
        k: "choice",
        q: "Chốt đã ở đúng vị trí sau phân hoạch (trái nhỏ hơn, phải lớn hơn). Vì sao không cần đụng tới chốt nữa?",
        o: ["Nó đã đúng chỗ cuối cùng", "Nó là số lớn nhất", "Ngẫu nhiên"],
        a: 0,
        h: "Trái toàn số nhỏ hơn, phải toàn số lớn hơn.",
        s: "Chốt đã 'đóng đinh' đúng vị trí."
      },
      {
        k: "choice",
        q: "Trung bình mỗi lần phân hoạch chia đôi mảng. Độ phức tạp trung bình?",
        o: ["O(n log n)", "O(n²)", "O(n)"],
        a: 0,
        h: "Giống merge sort: log n tầng × n bước.",
        s: "Trung bình O(n log n), nhanh thực tế nhất."
      },
      {
        k: "choice",
        q: "Xui nhất: chốt luôn là số nhỏ nhất (mảng đã sắp xếp, chốt đầu). Mỗi lần chỉ loại được 1 phần tử. Độ phức tạp?",
        o: ["O(n²)", "O(n log n)", "O(n)"],
        a: 0,
        h: "n tầng, mỗi tầng n bước.",
        s: "Worst-case O(n²) — lý do chọn chốt ngẫu nhiên."
      },
      {
        k: "choice",
        q: "Để tránh worst-case, người ta thường làm gì?",
        o: ["Chọn chốt ngẫu nhiên", "Luôn chọn phần tử đầu", "Sắp xếp trước"],
        a: 0,
        h: "Ngẫu nhiên thì khó xui liên tục.",
        s: "Chốt ngẫu nhiên: worst-case gần như không xảy ra."
      },
      {
        k: "order",
        q: "Ghép code phân hoạch (có 1 dòng THỪA):",
        s: "Ghép đúng thứ tự phân hoạch.",
        code: true,
        distractors: [5],
        items: [
          ["def partition(a, lo, hi):", "Dòng đầu của hàm phân hoạch?"],
          ["    pivot = a[hi]", "Chọn chốt là phần tử cuối?"],
          ["    i = lo", "Con trỏ i đánh dấu vùng nhỏ hơn?"],
          ["    for j in range(lo, hi):", "Duyệt từ lo đến trước chốt?"],
          ["        if a[j] < pivot: a[i], a[j] = a[j], a[i]; i += 1", "Nhỏ hơn chốt thì đưa sang trái?"],
          ["    return a", "Trả về cả mảng có đúng không?"],
          ["    a[i], a[hi] = a[hi], a[i]", "Đưa chốt về giữa hai vùng?"],
          ["    return i", "Trả về vị trí chốt?"]
        ]
      }
    ],
    note: "<b>Quicksort: chọn chốt, phân hoạch, đệ quy hai bên.</b><br>• Chốt sau phân hoạch đã <b>đúng vị trí cuối cùng</b>: trái nhỏ hơn, phải lớn hơn.<br>• Trung bình <b>O(n log n)</b> — nhanh nhất thực tế (ít hằng số, tại chỗ).<br>• Xui nhất <b>O(n²)</b> khi chốt luôn lệch hẳn một bên → chọn chốt ngẫu nhiên.<br>• Sắp xếp tại chỗ: O(1) bộ nhớ phụ (không tính đệ quy).<br><b>Lỗi hay gặp:</b> quên đưa chốt về đúng chỗ sau vòng lặp; đệ quy cả hai bên bao gồm cả chốt (vòng vô hạn).<br><b>LeetCode 215</b> (Kth Largest): quickselect là quicksort chỉ đi một bên."
  }
];
