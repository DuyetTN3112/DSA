import type { RichLesson } from './lesson-types';

export const W5_LESSONS: RichLesson[] = [
{
    id: "w5",
    t: "Code 5: two_sum (mức vừa)",
    steps: [
      {
        k: "choice",
        ph: "Khởi động: nhắc lại bài cũ (nhắc lại nhiều lần mới nhớ lâu)",
        q: "Cách vét cạn hai vòng lặp có độ phức tạp?",
        o: ["O(n)","O(n^2)","O(1)"],
        a: 1,
        h: "Mỗi số so với gần hết các số còn lại.",
        s: "Ôn lại: O(n^2)"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Với [3,2,4] và target=6, đáp án đúng là gì?",
        o: ["[1, 2] (2 + 4)","[0, 0] (3 + 3)","[0, 2]"],
        a: 0,
        h: "Không dùng cùng một phần tử hai lần. 3 + 3 cần hai số 3 khác chỗ.",
        s: "Chốt: [1, 2] (2 + 4)"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Bảng tra nên có key là gì và value là gì?",
        o: ["key là số đã gặp, value là chỉ số của nó","key là chỉ số, value là số","key là target"],
        a: 0,
        h: "Ta cần tra 'số y đã gặp chưa' rồi lấy ra chỉ số.",
        s: "Chốt: key là số đã gặp, value là chỉ số của nó"
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
        q: "Sắp xếp các việc nhỏ theo thứ tự thực hiện. Mình chỉ hỏi khi bạn chọn chưa đúng.",
        s: "Đã chia nhỏ đúng thứ tự",
        items: [
          ["Tạo bảng tra rỗng","Cần nhớ gì về số đã đi qua?"],
          ["Duyệt từng số cùng chỉ số","Muốn có cả chỉ số lẫn giá trị thì dùng gì?"],
          ["Tính số cần tìm y = target - x","Số còn lại phải bằng bao nhiêu?"],
          ["Nếu y đã có trong bảng thì trả về cặp chỉ số","Tra bảng: đã gặp y chưa?"],
          ["Chưa có thì lưu x và chỉ số","Lưu gì để lần sau còn tra?"],
          ["Hết vòng mà không thấy thì báo lỗi","Duyệt hết mà không có cặp thì sao?"]
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
          "Nhìn lại bài 4: bạn đã điền khung này rồi. Lần này tự gõ các dòng.",
          "Khung gợi ý (điền chỗ ___):\ndef two_sum(nums, target):\n    seen = ___\n    for i, x in enumerate(nums):\n        y = ___\n        if y in seen:\n            return ___\n        seen[x] = ___\n    raise ValueError(\"khong co cap\")",
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
          "Dùng được vào việc thật: đối chiếu sổ sách: tìm hai khoản cộng lại đúng bằng số tiền cần khớp",
          "Chỉ dùng trong bài thi lập trình",
          "Không dùng ở đâu cả"
        ],
        a: 0,
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
    brief: "Viết hàm two_sum(nums, target) trả về [i, j] là chỉ số của hai số có tổng bằng target (i nhỏ hơn j). Nếu không có cặp nào thì báo ValueError.<br><small>Mức dẫn dắt: Vừa (có khung comment, tự điền code)</small>",
    cs: "def two_sum(nums, target):\n    # việc 1: tạo bảng tra rỗng\n    # việc 2: duyệt từng (chỉ số, số)\n    # việc 3: y = số cần tìm; nếu y đã trong bảng thì trả về [chỉ số của y, chỉ số hiện tại]\n    # việc 4: chưa có thì lưu số hiện tại với chỉ số của nó\n    # việc 5: hết vòng thì raise ValueError\n    pass\n",
    ts: "# Mình cho sẵn 1 test mẫu. Bạn viết thêm ít nhất 2 test nữa.\ndef raises(exc, f, *a):\n    try:\n        f(*a)\n    except exc:\n        return True\n    return False\n\nassert two_sum([2,7,11,15], 9) == [0, 1]   # ví dụ có sẵn\n# ca hai số giống nhau: ?\n# ca không có cặp: ?\n# ca số âm: ?\n",
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
    lvl: 2
  }
];
