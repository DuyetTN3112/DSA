import type { RichLesson } from './lesson-types';

export const W7_LESSONS: RichLesson[] = [
{
    id: "w7",
    t: "Code 7: has_duplicate (biến thể: cùng ý tưởng, đề khác)",
    steps: [
      {
        k: "choice",
        ph: "Khởi động: nhắc lại bài cũ (nhắc lại nhiều lần mới nhớ lâu)",
        q: "Vét cạn hai vòng lặp tìm số trùng mất?",
        o: ["O(n)","O(n^2)","O(1)"],
        a: 1,
        h: "Mỗi số so với các số còn lại.",
        s: "Ôn lại: O(n^2)"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Danh sách rỗng có số trùng không?",
        o: ["Không, trả về False","Có, trả về True","Báo lỗi"],
        a: 0,
        h: "Chưa có số nào thì chưa thể có số trùng.",
        s: "Chốt: Không, trả về False"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Đây giống Two Sum ở ý tưởng nào?",
        o: ["Nhớ các số đã gặp để tra nhanh","Sắp xếp danh sách","Dùng đệ quy"],
        a: 0,
        h: "Ở Two Sum ta tra 'đã gặp y chưa'. Ở đây tra 'đã gặp x chưa'.",
        s: "Chốt: Nhớ các số đã gặp để tra nhanh"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Nên dùng cấu trúc nào để nhớ số đã gặp?",
        o: ["set (tập hợp, tra O(1))","list (tra O(n))","chuỗi"],
        a: 0,
        h: "Chỉ cần biết có hay chưa, không cần chỉ số.",
        s: "Chốt: set (tập hợp, tra O(1))"
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
          ["Tạo tập hợp rỗng để nhớ số đã gặp","Cần nhớ gì?"],
          ["Với mỗi số, nếu đã có trong tập hợp thì trả về True","Gặp lại số đã thấy nghĩa là gì?"],
          ["Chưa có thì thêm vào tập hợp","Làm sao để lần sau còn tra?"],
          ["Duyệt hết mà không trùng thì trả về False","Không gặp số nào lặp lại thì sao?"]
        ]
      },
      {
        k: "tests",
        ph: "Bước 3: Viết test trước (TDD, pha đỏ)",
        q: "Chưa có code nào cả. Viết ít nhất 3 assert: một ca đơn giản nhất, một ca thường, một ca biên, và ít nhất một ca đầu vào xấu phải raise (assert raises(...)). Hợp đồng và test viết TRƯỚC, code sau. Bấm chạy: hàm rỗng PHẢI thất bại.",
        s: "Test viết xong, đã thấy đỏ",
        hp: [
          "Nghĩ ba ca: nhỏ nhất, bình thường, và ca biên (danh sách rỗng).",
          "Cú pháp: assert has_duplicate(...) == kết_quả_mong_đợi\nLỗi: assert raises(ValueError, has_duplicate, [])"
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
          "Lời giải tham khảo:\ndef has_duplicate(nums):\n    if not isinstance(nums, list):\n        raise TypeError(\"nums phai la list\")\n    seen = set()\n    for x in nums:\n        if x in seen:\n            return True\n        seen.add(x)\n    return False\n"
        ]
      },
      {
        k: "code",
        ph: "Bước 5: Giải đề: thuật toán đơn giản nhất để qua test (pha xanh)",
        q: "Hàng rào đã có sẵn bên dưới. Giờ mới giải đề. Chỉ cần xanh, code xấu, lặp lại đều được. Chưa cần đẹp.",
        s: "Test xanh với code đơn giản",
        mode: "happy",
        hp: [
          "Giống Two Sum, nhưng chỉ cần set.",
          "Khung gợi ý (điền chỗ ___):\ndef has_duplicate(nums):\n    seen = ___()\n    for x in nums:\n        if x in seen:\n            return ___\n        seen.add(x)\n    return ___",
          "Lời giải tham khảo. Hãy tự gõ lại bằng tay, đừng copy, gõ lại giúp não nhớ hơn:\ndef has_duplicate(nums):\n    if not isinstance(nums, list):\n        raise TypeError(\"nums phai la list\")\n    seen = set()\n    for x in nums:\n        if x in seen:\n            return True\n        seen.add(x)\n    return False\n"
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
          "Dùng được vào việc thật: phát hiện đơn hàng hoặc mã giao dịch bị nhập trùng",
          "Chỉ dùng trong bài thi lập trình"
        ],
        a: 1,
        h: "Nghĩ tới hệ thống thật có dữ liệu thật.",
        s: "Chốt: phát hiện đơn hàng hoặc mã giao dịch bị nhập trùng."
      },
      {
        k: "reflect",
        ph: "Bước 8: Ứng dụng, không chỉ giải đề",
        q: "Viết nhận xét code review cho CHÍNH code của bạn: một điểm tốt, một điều bạn sẽ cải thiện, và một ca test bạn thấy còn thiếu. Rồi nghĩ thêm một chỗ khác trong công việc thật mà bạn có thể dùng đúng ý tưởng này.",
        s: "Đã tự review và nối với thực tế"
      }
    ],
    ws: 1,
    fn: "has_duplicate",
    brief: "Viết hàm has_duplicate(nums) trả về True nếu trong danh sách có số xuất hiện từ hai lần trở lên, ngược lại False.<br><small>Mức dẫn dắt: Ít (tự làm, mình chỉ hỗ trợ khi bạn bấm Cần giúp)</small>",
    cs: "def has_duplicate(nums):\n    pass\n",
    ts: "# Lần này test do bạn tự viết. Cần giúp thì bấm nút.\ndef raises(exc, f, *a):\n    try:\n        f(*a)\n    except exc:\n        return True\n    return False\n\n",
    ref: "def has_duplicate(nums):\n    if not isinstance(nums, list):\n        raise TypeError(\"nums phai la list\")\n    seen = set()\n    for x in nums:\n        if x in seen:\n            return True\n        seen.add(x)\n    return False\n",
    hid: [
      ["has_duplicate([1,2,3])","False"],
      ["has_duplicate([1,2,1])","True"],
      ["has_duplicate([])","False"],
      ["has_duplicate([5,5])","True"]
    ],
    errs: [
      ["has_duplicate(None)","TypeError"]
    ],
    lvl: 3
  }
];
