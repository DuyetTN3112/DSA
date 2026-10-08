import type { RichLesson } from './lesson-types';

export const W4_LESSONS: RichLesson[] = [
{
    id: "w4",
    t: "Code 4: two_sum (tìm cặp có tổng bằng target)",
    steps: [
      {
        k: "choice",
        ph: "Khởi động: nhắc lại bài cũ (nhắc lại nhiều lần mới nhớ lâu)",
        q: "Tra một key trong dictionary mất khoảng bao nhiêu bước?",
        o: ["O(1)","O(n)","O(n^2)"],
        a: 0,
        h: "Dictionary nhảy thẳng tới chỗ chứa key.",
        s: "Ôn lại: O(1)"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Đề cho nums=[2,7,11] và target=9. Cặp nào đúng?",
        o: ["2 và 7 (chỉ số 0 và 1)","7 và 11","2 và 11"],
        a: 0,
        h: "2+7 bằng bao nhiêu?",
        s: "Chốt: 2 và 7 (chỉ số 0 và 1)"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Cách vét cạn (hai vòng lặp lồng nhau) với 1000 số mất khoảng bao nhiêu bước?",
        o: ["Khoảng 1000","Khoảng 1.000.000","Khoảng 10"],
        a: 1,
        h: "Mỗi số so với gần hết 1000 số còn lại.",
        s: "Chốt: Khoảng 1.000.000"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Đang xét số x. Cần tìm số y nào đã gặp?",
        o: ["y = target - x","y = target + x","y = x"],
        a: 0,
        h: "x + y phải bằng target.",
        s: "Chốt: y = target - x"
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
          ["Tạo bảng tra rỗng để nhớ các số đã gặp","Cần nhớ gì về những số đã đi qua?"],
          ["Duyệt từng số cùng chỉ số của nó","Muốn biết chỉ số thì duyệt kiểu gì?"],
          ["Tính số cần tìm y = target - x","Với x hiện tại, số kia phải bằng bao nhiêu?"],
          ["Nếu y đã có trong bảng thì trả về [chỉ số của y, i]","Tra bảng: đã gặp y chưa?"],
          ["Chưa có thì lưu x vào bảng","Nếu chưa gặp thì làm gì để lần sau còn tra?"],
          [
            "Hết vòng lặp mà không thấy thì báo ValueError",
            "Duyệt hết mà không có cặp, kết quả là gì?"
          ]
        ]
      },
      {
        k: "tests",
        ph: "Bước 3: Viết test trước (TDD, pha đỏ)",
        q: "Chưa có code nào cả. Viết ít nhất 3 assert: một ca đơn giản nhất, một ca thường, một ca biên, và ít nhất một ca đầu vào xấu phải raise (assert raises(...)). Hợp đồng và test viết TRƯỚC, code sau. Bấm chạy: hàm rỗng PHẢI thất bại.",
        s: "Test viết xong, đã thấy đỏ",
        hp: [
          "Nghĩ ba ca: nhỏ nhất, bình thường, và ca biên (danh sách rỗng).",
          "Cú pháp: assert two_sum(...) == kết_quả_mong_đợi\nLỗi: assert raises(ValueError, two_sum, [])"
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
          "Lời giải tham khảo:\ndef two_sum(nums, target):\n    if not isinstance(nums, list):\n        raise TypeError(\"nums phai la list\")\n    seen = {}\n    for i, x in enumerate(nums):\n        y = target - x\n        if y in seen:\n            return [seen[y], i]\n        seen[x] = i\n    raise ValueError(\"khong co cap\")\n"
        ]
      },
      {
        k: "code",
        ph: "Bước 5: Giải đề: thuật toán đơn giản nhất để qua test (pha xanh)",
        q: "Hàng rào đã có sẵn bên dưới. Giờ mới giải đề. Chỉ cần xanh, code xấu, lặp lại đều được. Chưa cần đẹp.",
        s: "Test xanh với code đơn giản",
        mode: "happy",
        hp: [
          "Đọc comment từng dòng và điền ___. Nhớ bài đếm bằng bảng tra.",
          "Khung gợi ý (điền chỗ ___):\ndef two_sum(nums, target):\n    seen = ___\n    for i, x in enumerate(nums):\n        y = target - ___\n        if y ___ seen:\n            return [seen[y], ___]\n        seen[x] = ___\n    raise ValueError(\"khong co cap\")",
          "Lời giải tham khảo. Hãy tự gõ lại bằng tay, đừng copy, gõ lại giúp não nhớ hơn:\ndef two_sum(nums, target):\n    if not isinstance(nums, list):\n        raise TypeError(\"nums phai la list\")\n    seen = {}\n    for i, x in enumerate(nums):\n        y = target - x\n        if y in seen:\n            return [seen[y], i]\n        seen[x] = i\n    raise ValueError(\"khong co cap\")\n"
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
        o: ["O(n)","O(n²)","O(1)"],
        a: 0,
        h: "Đếm xem mỗi phần tử bị chạm tới bao nhiêu lần.",
        s: "Chốt: O(n), mỗi phần tử xử lý một số lần cố định."
      },
      {
        k: "choice",
        ph: "Bước 7: Code review (bây giờ bạn là người review)",
        q: "Vì sao hàm tách phần chặn đầu vào xấu ra khỏi phần tính chính?",
        o: [
          "Cho code dài hơn",
          "Vì quy định bắt buộc",
          "Dễ đọc, dễ test, và lỗi lộ ra sớm trước khi tính dở dang"
        ],
        a: 2,
        h: "Hãy nghĩ đến người đọc code sau bạn, và người viết test.",
        s: "Chốt: tách hàng rào giúp đọc, test và phát hiện lỗi sớm."
      },
      {
        k: "choice",
        ph: "Bước 8: Ứng dụng, không chỉ giải đề",
        q: "Ý tưởng cốt lõi bạn vừa luyện dùng vào đâu ngoài đời?",
        o: [
          "Không dùng ở đâu cả",
          "Dùng được vào việc thật: đối chiếu sổ sách: tìm hai khoản cộng lại đúng bằng số tiền cần khớp",
          "Chỉ dùng trong bài thi lập trình"
        ],
        a: 1,
        h: "Nghĩ tới hệ thống thật có dữ liệu thật.",
        s: "Chốt: đối chiếu sổ sách: tìm hai khoản cộng lại đúng bằng số tiền cần khớp."
      },
      {
        k: "reflect",
        ph: "Bước 8: Ứng dụng, không chỉ giải đề",
        q: "Viết nhận xét code review cho CHÍNH code của bạn: một điểm tốt, một điều bạn sẽ cải thiện, và một ca test bạn thấy còn thiếu. Rồi nghĩ thêm một chỗ khác trong công việc thật mà bạn có thể dùng đúng ý tưởng này.",
        s: "Đã tự review và nối với thực tế"
      }
    ],
    ws: 1,
    fn: "two_sum",
    brief: "Viết hàm two_sum(nums, target) trả về [i, j] là chỉ số của hai số có tổng bằng target (i nhỏ hơn j). Nếu không có cặp nào thì báo ValueError.<br><small>Mức dẫn dắt: Nhiều (mình hỏi và điền chỗ trống cùng bạn)</small>",
    cs: "def two_sum(nums, target):\n    # 1) bảng tra rỗng (dictionary) viết là ___ ?\n    seen = ___\n    for i, x in enumerate(nums):\n        # 2) số cần tìm\n        y = target - ___\n        # 3) y đã có trong bảng chưa? dùng từ khóa ___\n        if y ___ seen:\n            return [seen[y], ___]\n        # 4) lưu x với chỉ số hiện tại\n        seen[x] = ___\n    raise ValueError(\"khong co cap\")\n",
    ts: "# Mình viết sẵn khung. Bạn điền các chỗ ___ bằng kết quả mong đợi, rồi chạy.\ndef raises(exc, f, *a):\n    try:\n        f(*a)\n    except exc:\n        return True\n    return False\n\nassert two_sum([2,7,11,15], 9) == ___   # 2 + 7 = 9, chỉ số nào?\nassert two_sum([3,3], 6) == ___          # hai số giống nhau\nassert raises(ValueError, two_sum, [1,2], 10)  # không có cặp\n",
    ref: "def two_sum(nums, target):\n    if not isinstance(nums, list):\n        raise TypeError(\"nums phai la list\")\n    seen = {}\n    for i, x in enumerate(nums):\n        y = target - x\n        if y in seen:\n            return [seen[y], i]\n        seen[x] = i\n    raise ValueError(\"khong co cap\")\n",
    hid: [
      ["two_sum([2,7,11,15],9)","[0, 1]"],
      ["two_sum([3,2,4],6)","[1, 2]"],
      ["two_sum([3,3],6)","[0, 1]"],
      ["two_sum([-1,5,8],7)","[0, 2]"]
    ],
    errs: [
      ["two_sum([1,2],10)","ValueError"],
      ["two_sum(None,3)","TypeError"]
    ],
    lvl: 1
  }
];
