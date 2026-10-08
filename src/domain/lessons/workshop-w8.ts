import type { RichLesson } from './lesson-types';

export const W8_LESSONS: RichLesson[] = [
{
    id: "w8",
    t: "Code 8: factorial (đệ quy)",
    steps: [
      {
        k: "choice",
        ph: "Khởi động: nhắc lại bài cũ (nhắc lại nhiều lần mới nhớ lâu)",
        q: "Thiếu ca cơ sở trong hàm đệ quy thì gặp lỗi gì?",
        o: ["RecursionError","SyntaxError","KeyError"],
        a: 0,
        h: "Gọi mãi không dừng.",
        s: "Ôn lại: RecursionError"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "factorial(4) bằng bài nhỏ hơn nào?",
        o: ["4 * factorial(3)","4 + factorial(3)","factorial(5)"],
        a: 0,
        h: "4! = 4 * 3 * 2 * 1.",
        s: "Chốt: 4 * factorial(3)"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Ca cơ sở (điểm dừng) hợp lý nhất?",
        o: ["n bằng 0 hoặc 1 thì trả về 1","n bằng 10 thì dừng","Không cần điểm dừng"],
        a: 0,
        h: "Nhớ bài dem: phải có chỗ không gọi tiếp.",
        s: "Chốt: n bằng 0 hoặc 1 thì trả về 1"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Điều gì xảy ra nếu gọi factorial(-1) mà không kiểm tra?",
        o: ["Gọi mãi, RecursionError","Trả về 1","Trả về 0"],
        a: 0,
        h: "-1 không bao giờ chạm tới 0 hay 1 khi giảm.",
        s: "Chốt: Gọi mãi, RecursionError"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Theo TDD, nên viết test nào đầu tiên?",
        o: [
          "Danh sách 1 triệu phần tử",
          "Ca nhỏ, đơn giản nhất, đáp án nhìn là biết",
          "Ca ngẫu nhiên"
        ],
        a: 1,
        h: "Ca nhỏ nhất cho bạn điểm xuất phát chắc chắn.",
        s: "Chốt: Ca nhỏ, đơn giản nhất, đáp án nhìn là biết"
      },
      {
        k: "choice",
        ph: "Bước 1: Hợp đồng của hàm (cách nghĩ ở doanh nghiệp)",
        q: "Ở công ty, trước khi viết hàm, đồng nghiệp cần biết gì để dùng hàm của bạn mà không phải đọc code?",
        o: [
          "Đầu vào hợp lệ là gì, đầu ra là gì, và đầu vào xấu thì hàm báo lỗi gì",
          "Chỉ cần tên hàm",
          "Chỉ cần chạy được trên máy của bạn"
        ],
        a: 0,
        h: "Người khác chỉ thấy 'hợp đồng' bên ngoài, không thấy bên trong.",
        s: "Chốt: hợp đồng gồm đầu vào, đầu ra, và hành vi khi đầu vào xấu."
      },
      {
        k: "choice",
        ph: "Bước 1: Hợp đồng của hàm (cách nghĩ ở doanh nghiệp)",
        q: "Hàm nhận dữ liệu xấu. Vì sao báo lỗi rõ ràng (raise) tốt hơn trả về một giá trị 'đại khái' như 0 hay None?",
        o: [
          "Người gọi biết ngay có chuyện, không âm thầm dùng dữ liệu sai đi tiếp",
          "Vì code ngắn hơn",
          "Không có khác biệt"
        ],
        a: 0,
        h: "Nếu hệ thống tính tiền nhận về 0 thay vì lỗi, chuyện gì xảy ra?",
        s: "Chốt: lỗi lộ ra sớm, rõ ràng thì rẻ. Lỗi bị che đi thì đắt hơn nhiều."
      },
      {
        k: "order",
        ph: "Bước 2: Chia nhỏ bài toán",
        q: "Sắp xếp các việc nhỏ theo thứ tự thực hiện. Mỗi lần mình sẽ hỏi một câu để bạn nghĩ.",
        s: "Đã chia nhỏ đúng thứ tự",
        items: [
          ["Kiểm tra n âm thì báo ValueError","n âm thì có giai thừa không?"],
          ["Ca cơ sở: n nhỏ hơn hoặc bằng 1 thì trả về 1","Khi nào thì không cần gọi tiếp?"],
          ["Còn lại: trả về n nhân factorial(n - 1)","Bài nhỏ hơn là bài nào?"]
        ]
      },
      {
        k: "tests",
        ph: "Bước 3: Viết test trước (TDD, pha đỏ)",
        q: "Chưa có code nào cả. Viết ít nhất 3 assert: một ca đơn giản nhất, một ca thường, một ca biên, và ít nhất một ca đầu vào xấu phải raise (assert raises(...)). Hợp đồng và test viết TRƯỚC, code sau. Bấm chạy: hàm rỗng PHẢI thất bại.",
        s: "Test viết xong, đã thấy đỏ",
        hp: [
          "Nghĩ ba ca: nhỏ nhất, bình thường, và ca biên (danh sách rỗng).",
          "Cú pháp: assert factorial(...) == kết_quả_mong_đợi\nLỗi: assert raises(ValueError, factorial, [])"
        ]
      },
      {
        k: "code",
        ph: "Bước 4: Hàng rào trước (exception và đầu vào xấu), CHƯA giải đề",
        q: "Làm như đội hệ thống thật: bảo vệ hàm trước. Chỉ viết phần chặn đầu vào xấu và raise đúng loại lỗi kèm thông điệp rõ. Chưa cần tính gì cả.",
        s: "Hàng rào đã chặn đủ các ca đầu vào xấu",
        mode: "guard",
        hp: [
          "Hàm có thể nhận chữ hoặc số âm. Hai dòng đầu của hàm nên làm gì?",
          "Mẫu:\nif not isinstance(n, int):\n    raise TypeError(\"n phai la so nguyen\")\nif n < 0:\n    raise ValueError(\"n khong am\")",
          "Lời giải tham khảo:\ndef factorial(n):\n    if not isinstance(n, int):\n        raise TypeError(\"n phai la so nguyen\")\n    if n < 0:\n        raise ValueError(\"n khong am\")\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n"
        ]
      },
      {
        k: "code",
        ph: "Bước 5: Giải đề: thuật toán đơn giản nhất để qua test (pha xanh)",
        q: "Hàng rào đã có sẵn bên dưới. Giờ mới giải đề. Chỉ cần xanh, code xấu, lặp lại đều được. Chưa cần đẹp.",
        s: "Test xanh với code đơn giản",
        mode: "happy",
        hp: [
          "Nhớ bài dem: điểm dừng trước, rồi mới gọi bài nhỏ hơn.",
          "Khung gợi ý (điền chỗ ___):\ndef factorial(n):\n    if n < 0:\n        raise ValueError(\"n khong am\")\n    if n <= ___:\n        return ___\n    return n * factorial(n - ___)",
          "Lời giải tham khảo. Hãy tự gõ lại bằng tay, đừng copy, gõ lại giúp não nhớ hơn:\ndef factorial(n):\n    if not isinstance(n, int):\n        raise TypeError(\"n phai la so nguyen\")\n    if n < 0:\n        raise ValueError(\"n khong am\")\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n"
        ]
      },
      {
        k: "code",
        ph: "Bước 6: Dọn dẹp (refactor)",
        q: "Giờ mới làm đẹp: đặt tên biến rõ nghĩa, bỏ đoạn thừa, thêm docstring. Chạy lại: vẫn xanh nghĩa là bạn không làm hỏng gì. Đây là lý do phải có test.",
        s: "Refactor an toàn nhờ test",
        mode: "err",
        hp: [
          "Đọc lại từng tên biến: một người lạ đọc có hiểu không?",
          "Thêm 1 dòng docstring dưới def, đổi tên biến ngắn thành tên có nghĩa, rồi chạy lại."
        ]
      },
      {
        k: "choice",
        ph: "Bước 7: Code review (bây giờ bạn là người review)",
        q: "Reviewer hỏi: độ phức tạp thời gian của hàm này theo n (độ dài đầu vào) là gì?",
        o: ["O(n²)","O(1)","O(n)"],
        a: 2,
        h: "Đếm xem mỗi phần tử bị chạm tới bao nhiêu lần.",
        s: "Chốt: O(n), mỗi phần tử xử lý một số lần cố định."
      },
      {
        k: "choice",
        ph: "Bước 7: Code review (bây giờ bạn là người review)",
        q: "Vì sao hàm tách phần chặn đầu vào xấu ra khỏi phần tính chính?",
        o: [
          "Vì quy định bắt buộc",
          "Dễ đọc, dễ test, và lỗi lộ ra sớm trước khi tính dở dang",
          "Cho code dài hơn"
        ],
        a: 1,
        h: "Hãy nghĩ đến người đọc code sau bạn, và người viết test.",
        s: "Chốt: tách hàng rào giúp đọc, test và phát hiện lỗi sớm."
      },
      {
        k: "choice",
        ph: "Bước 8: Ứng dụng, không chỉ giải đề",
        q: "Ý tưởng cốt lõi bạn vừa luyện dùng vào đâu ngoài đời?",
        o: [
          "Dùng được vào việc thật: duyệt dữ liệu lồng nhau như thư mục, bình luận trả lời bình luận",
          "Chỉ dùng trong bài thi lập trình",
          "Không dùng ở đâu cả"
        ],
        a: 0,
        h: "Nghĩ tới hệ thống thật có dữ liệu thật.",
        s: "Chốt: duyệt dữ liệu lồng nhau như thư mục, bình luận trả lời bình luận."
      },
      {
        k: "reflect",
        ph: "Bước 8: Ứng dụng, không chỉ giải đề",
        q: "Viết nhận xét code review cho CHÍNH code của bạn: một điểm tốt, một điều bạn sẽ cải thiện, và một ca test bạn thấy còn thiếu. Rồi nghĩ thêm một chỗ khác trong công việc thật mà bạn có thể dùng đúng ý tưởng này.",
        s: "Đã tự review và nối với thực tế"
      }
    ],
    ws: 1,
    fn: "factorial",
    brief: "Viết hàm đệ quy factorial(n) trả về n! = n * (n-1) * ... * 1. Quy ước 0! = 1. n âm thì báo ValueError, n không phải số nguyên thì báo TypeError.<br><small>Mức dẫn dắt: Nhiều (mình hỏi và điền chỗ trống cùng bạn)</small>",
    cs: "def factorial(n):\n    if not isinstance(n, int):\n        raise TypeError(\"n phai la so nguyen\")\n    if n < 0:\n        raise ValueError(\"n khong am\")\n    # ca cơ sở: n nhỏ hơn hoặc bằng ___ thì trả về ___\n    if n <= ___:\n        return ___\n    # bài nhỏ hơn: factorial của n trừ ___\n    return n * factorial(n - ___)\n",
    ts: "# Mình viết sẵn khung. Bạn điền các chỗ ___ bằng kết quả mong đợi, rồi chạy.\ndef raises(exc, f, *a):\n    try:\n        f(*a)\n    except exc:\n        return True\n    return False\n\nassert factorial(0) == ___   # quy ước\nassert factorial(3) == ___   # 3 * 2 * 1\nassert factorial(5) == ___   # 5 * 4 * 3 * 2 * 1\nassert raises(ValueError, factorial, -1)\n",
    ref: "def factorial(n):\n    if not isinstance(n, int):\n        raise TypeError(\"n phai la so nguyen\")\n    if n < 0:\n        raise ValueError(\"n khong am\")\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n",
    hid: [
      ["factorial(0)","1"],
      ["factorial(1)","1"],
      ["factorial(3)","6"],
      ["factorial(5)","120"]
    ],
    errs: [
      ["factorial(-1)","ValueError"],
      ["factorial('a')","TypeError"]
    ],
    lvl: 1
  }
];
