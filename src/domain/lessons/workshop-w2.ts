import type { RichLesson } from './lesson-types';

export const W2_LESSONS: RichLesson[] = [
{
    id: "w2",
    t: "Code 2: linear_search (tìm chỉ số)",
    steps: [
      {
        k: "choice",
        ph: "Khởi động: nhắc lại bài cũ (nhắc lại nhiều lần mới nhớ lâu)",
        q: "Duyệt tìm số trong n hộp, trường hợp xấu nhất mở bao nhiêu hộp?",
        o: ["1","n","n*n"],
        a: 1,
        h: "Xấu nhất là số cần tìm nằm ở hộp cuối, hoặc không có.",
        s: "Ôn lại: n"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Danh sách [2,2], tìm 2. Trả về chỉ số nào?",
        o: ["Đề chưa nói: ta chọn chỉ số đầu tiên và ghi rõ giả định","Chỉ số cuối","Cả hai chỉ số"],
        a: 0,
        h: "Đề mơ hồ thì phải hỏi lại hoặc ghi giả định. Chọn chỉ số đầu giống hàm str.find quen thuộc.",
        s: "Chốt: Đề chưa nói: ta chọn chỉ số đầu tiên và ghi rõ giả định"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Không tìm thấy thì trả về gì?",
        o: ["0","-1, vì chỉ số hợp lệ không bao giờ âm","Không trả về gì"],
        a: 1,
        h: "0 là chỉ số hợp lệ nên sẽ gây nhầm lẫn với 'tìm thấy ở đầu'.",
        s: "Chốt: -1, vì chỉ số hợp lệ không bao giờ âm"
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
          ["Đi từng vị trí i từ đầu danh sách","Muốn gặp số cần tìm sớm nhất, nên bắt đầu từ đâu?"],
          ["Nếu nums[i] bằng target thì trả về i","Gặp đúng số cần tìm thì làm gì?"],
          [
            "Duyệt hết mà không thấy thì trả về -1",
            "Đi hết vòng mà chưa trả về gì thì kết luận gì?"
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
          "Cú pháp: assert linear_search(...) == kết_quả_mong_đợi\nLỗi: assert raises(ValueError, linear_search, [])"
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
          "Lời giải tham khảo:\ndef linear_search(nums, target):\n    if not isinstance(nums, list):\n        raise TypeError(\"nums phai la list\")\n    for i in range(len(nums)):\n        if nums[i] == target:\n            return i\n    return -1\n"
        ]
      },
      {
        k: "code",
        ph: "Bước 5: Giải đề: thuật toán đơn giản nhất để qua test (pha xanh)",
        q: "Hàng rào đã có sẵn bên dưới. Giờ mới giải đề. Chỉ cần xanh, code xấu, lặp lại đều được. Chưa cần đẹp.",
        s: "Test xanh với code đơn giản",
        mode: "happy",
        hp: [
          "Nhìn lại bài tờ giấy nhớ: cũng duyệt từng hộp. Lần này thay vì ghi đè, ta so sánh với target.",
          "Khung gợi ý (điền chỗ ___):\ndef linear_search(nums, target):\n    for i in range(len(nums)):\n        if nums[i] ___ target:\n            return ___\n    return ___",
          "Lời giải tham khảo. Hãy tự gõ lại bằng tay, đừng copy, gõ lại giúp não nhớ hơn:\ndef linear_search(nums, target):\n    if not isinstance(nums, list):\n        raise TypeError(\"nums phai la list\")\n    for i in range(len(nums)):\n        if nums[i] == target:\n            return i\n    return -1\n"
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
          "Dùng được vào việc thật: tra một mã sản phẩm trong danh sách nhỏ chưa sắp xếp",
          "Chỉ dùng trong bài thi lập trình",
          "Không dùng ở đâu cả"
        ],
        a: 0,
        h: "Nghĩ tới hệ thống thật có dữ liệu thật.",
        s: "Chốt: tra một mã sản phẩm trong danh sách nhỏ chưa sắp xếp."
      },
      {
        k: "reflect",
        ph: "Bước 8: Ứng dụng, không chỉ giải đề",
        q: "Viết nhận xét code review cho CHÍNH code của bạn: một điểm tốt, một điều bạn sẽ cải thiện, và một ca test bạn thấy còn thiếu. Rồi nghĩ thêm một chỗ khác trong công việc thật mà bạn có thể dùng đúng ý tưởng này.",
        s: "Đã tự review và nối với thực tế"
      }
    ],
    ws: 1,
    fn: "linear_search",
    brief: "Viết hàm linear_search(nums, target) trả về chỉ số của target trong nums, hoặc -1 nếu không có.<br><small>Mức dẫn dắt: Vừa (có khung comment, tự điền code)</small>",
    cs: "def linear_search(nums, target):\n    # việc 1: đi từng vị trí i từ đầu\n    # việc 2: nếu nums[i] bằng target thì trả về i\n    # việc 3: đi hết mà không thấy thì trả về ?\n    pass\n",
    ts: "# Mình cho sẵn 1 test mẫu. Bạn viết thêm ít nhất 2 test nữa.\ndef raises(exc, f, *a):\n    try:\n        f(*a)\n    except exc:\n        return True\n    return False\n\nassert linear_search([5,8,2,9,1], 9) == 3   # ví dụ có sẵn\n# ca không tìm thấy: ?\n# ca danh sách rỗng: ?\n# ca số trùng: ?\n",
    ref: "def linear_search(nums, target):\n    if not isinstance(nums, list):\n        raise TypeError(\"nums phai la list\")\n    for i in range(len(nums)):\n        if nums[i] == target:\n            return i\n    return -1\n",
    hid: [
      ["linear_search([5,8,2,9,1],9)","3"],
      ["linear_search([5,8],7)","-1"],
      ["linear_search([],1)","-1"],
      ["linear_search([2,2],2)","0"]
    ],
    errs: [
      ["linear_search(None,1)","TypeError"]
    ],
    lvl: 2
  }
];
