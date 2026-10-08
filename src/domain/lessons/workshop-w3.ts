import type { RichLesson } from './lesson-types';

export const W3_LESSONS: RichLesson[] = [
{
    id: "w3",
    t: "Code 3: second_max (lớn thứ hai, đề mơ hồ)",
    steps: [
      {
        k: "choice",
        ph: "Khởi động: nhắc lại bài cũ (nhắc lại nhiều lần mới nhớ lâu)",
        q: "Khi tìm số lớn nhất, tờ giấy nhớ ban đầu nên ghi gì?",
        o: ["Số 0","Phần tử đầu tiên","Để trống"],
        a: 1,
        h: "Số 0 sai nếu toàn số âm.",
        s: "Ôn lại: Phần tử đầu tiên"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Với [5,5,3], số lớn thứ hai là 5 hay 3?",
        o: [
          "Đề mơ hồ: ta giả định là 3 (khác biệt) và ghi lại để hỏi người ra đề",
          "Chắc chắn là 5",
          "Chắc chắn là 3, không cần hỏi"
        ],
        a: 0,
        h: "Trong công việc thật, giả định chưa được xác nhận phải được ghi ra, không giấu trong code.",
        s: "Chốt: Đề mơ hồ: ta giả định là 3 (khác biệt) và ghi lại để hỏi người ra đề"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "[2,2] không có giá trị lớn thứ hai khác biệt. Nên làm gì?",
        o: ["Báo ValueError","Trả về 2","Trả về 0"],
        a: 0,
        h: "Trả giá trị giả sẽ che giấu việc dữ liệu không đủ.",
        s: "Chốt: Báo ValueError"
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
        q: "Sắp xếp các việc nhỏ theo thứ tự thực hiện. Tự thử trước, cần thì bấm Cần giúp.",
        s: "Đã chia nhỏ đúng thứ tự",
        items: [
          ["Loại các giá trị trùng nhau","[5,5,3] thì 5 được tính mấy lần?"],
          ["Nếu còn dưới 2 giá trị thì báo ValueError","Còn 1 giá trị thì có hạng hai không?"],
          ["Bỏ giá trị lớn nhất đi","Muốn tìm hạng hai, bỏ hạng nhất rồi thì còn gì?"],
          ["Trả về giá trị lớn nhất của phần còn lại","Phần còn lại, cái lớn nhất là hạng mấy?"]
        ]
      },
      {
        k: "tests",
        ph: "Bước 3: Viết test trước (TDD, pha đỏ)",
        q: "Chưa có code nào cả. Viết ít nhất 3 assert: một ca đơn giản nhất, một ca thường, một ca biên, và ít nhất một ca đầu vào xấu phải raise (assert raises(...)). Hợp đồng và test viết TRƯỚC, code sau. Bấm chạy: hàm rỗng PHẢI thất bại.",
        s: "Test viết xong, đã thấy đỏ",
        hp: [
          "Nghĩ ba ca: nhỏ nhất, bình thường, và ca biên (danh sách rỗng).",
          "Cú pháp: assert second_max(...) == kết_quả_mong_đợi\nLỗi: assert raises(ValueError, second_max, [])"
        ]
      },
      {
        k: "code",
        ph: "Bước 4: Hàng rào trước (exception và đầu vào xấu), CHƯA giải đề",
        q: "Làm như đội hệ thống thật: bảo vệ hàm trước. Chỉ viết phần chặn đầu vào xấu và raise đúng loại lỗi kèm thông điệp rõ. Chưa cần tính gì cả.",
        s: "Hàng rào đã chặn đủ các ca đầu vào xấu",
        mode: "guard",
        hp: [
          "Hàm có thể nhận None hoặc kiểu khác list. Dòng đầu tiên của hàm nên làm gì?",
          "Mẫu:\nif not isinstance(nums, list):\n    raise TypeError(\"nums phai la list\")",
          "Lời giải tham khảo:\ndef second_max(nums):\n    if not isinstance(nums, list):\n        raise TypeError(\"nums phai la list\")\n    uniq = set(nums)\n    if len(uniq) < 2:\n        raise ValueError(\"can it nhat 2 gia tri khac nhau\")\n    uniq.remove(max(uniq))\n    return max(uniq)\n"
        ]
      },
      {
        k: "code",
        ph: "Bước 5: Giải đề: thuật toán đơn giản nhất để qua test (pha xanh)",
        q: "Hàng rào đã có sẵn bên dưới. Giờ mới giải đề. Chỉ cần xanh, code xấu, lặp lại đều được. Chưa cần đẹp.",
        s: "Test xanh với code đơn giản",
        mode: "happy",
        hp: [
          "Thử nghĩ: nếu bỏ hết số trùng và bỏ số lớn nhất thì cái lớn nhất của phần còn lại là gì?",
          "Khung gợi ý (điền chỗ ___):\ndef second_max(nums):\n    uniq = set(nums)\n    if len(uniq) < ___:\n        raise ValueError(\"can it nhat 2 gia tri khac nhau\")\n    uniq.remove(max(uniq))\n    return ___(uniq)",
          "Lời giải tham khảo. Hãy tự gõ lại bằng tay, đừng copy, gõ lại giúp não nhớ hơn:\ndef second_max(nums):\n    if not isinstance(nums, list):\n        raise TypeError(\"nums phai la list\")\n    uniq = set(nums)\n    if len(uniq) < 2:\n        raise ValueError(\"can it nhat 2 gia tri khac nhau\")\n    uniq.remove(max(uniq))\n    return max(uniq)\n"
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
        o: ["O(1)","O(n)","O(n²)"],
        a: 1,
        h: "Đếm xem mỗi phần tử bị chạm tới bao nhiêu lần.",
        s: "Chốt: O(n), mỗi phần tử xử lý một số lần cố định."
      },
      {
        k: "choice",
        ph: "Bước 7: Code review (bây giờ bạn là người review)",
        q: "Vì sao hàm tách phần chặn đầu vào xấu ra khỏi phần tính chính?",
        o: [
          "Dễ đọc, dễ test, và lỗi lộ ra sớm trước khi tính dở dang",
          "Cho code dài hơn",
          "Vì quy định bắt buộc"
        ],
        a: 0,
        h: "Hãy nghĩ đến người đọc code sau bạn, và người viết test.",
        s: "Chốt: tách hàng rào giúp đọc, test và phát hiện lỗi sớm."
      },
      {
        k: "choice",
        ph: "Bước 8: Ứng dụng, không chỉ giải đề",
        q: "Ý tưởng cốt lõi bạn vừa luyện dùng vào đâu ngoài đời?",
        o: [
          "Chỉ dùng trong bài thi lập trình",
          "Không dùng ở đâu cả",
          "Dùng được vào việc thật: lấy người về nhì trong bảng xếp hạng"
        ],
        a: 2,
        h: "Nghĩ tới hệ thống thật có dữ liệu thật.",
        s: "Chốt: lấy người về nhì trong bảng xếp hạng."
      },
      {
        k: "reflect",
        ph: "Bước 8: Ứng dụng, không chỉ giải đề",
        q: "Viết nhận xét code review cho CHÍNH code của bạn: một điểm tốt, một điều bạn sẽ cải thiện, và một ca test bạn thấy còn thiếu. Rồi nghĩ thêm một chỗ khác trong công việc thật mà bạn có thể dùng đúng ý tưởng này.",
        s: "Đã tự review và nối với thực tế"
      }
    ],
    ws: 1,
    fn: "second_max",
    brief: "Viết hàm second_max(nums) trả về số lớn thứ hai trong danh sách nums.<br><small>Mức dẫn dắt: Ít (tự làm, mình chỉ hỗ trợ khi bạn bấm Cần giúp)</small>",
    cs: "def second_max(nums):\n    pass\n",
    ts: "# Lần này test do bạn tự viết. Cần giúp thì bấm nút.\ndef raises(exc, f, *a):\n    try:\n        f(*a)\n    except exc:\n        return True\n    return False\n\n",
    ref: "def second_max(nums):\n    if not isinstance(nums, list):\n        raise TypeError(\"nums phai la list\")\n    uniq = set(nums)\n    if len(uniq) < 2:\n        raise ValueError(\"can it nhat 2 gia tri khac nhau\")\n    uniq.remove(max(uniq))\n    return max(uniq)\n",
    hid: [
      ["second_max([4,9,2,7])","7"],
      ["second_max([5,5,3])","3"],
      ["second_max([-1,-2])","-2"]
    ],
    errs: [
      ["second_max([1])","ValueError"],
      ["second_max([2,2])","ValueError"],
      ["second_max(None)","TypeError"]
    ],
    lvl: 3
  }
];
