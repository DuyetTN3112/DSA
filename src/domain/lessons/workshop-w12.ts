import type { RichLesson } from './lesson-types';

export const W12_LESSONS: RichLesson[] = [
{
    id: "w12",
    t: "Mini project 3, Code 12: allowed_requests (giới hạn tốc độ của API)",
    steps: [
      {
        k: "choice",
        ph: "Khởi động: nhắc lại bài cũ (nhắc lại nhiều lần mới nhớ lâu)",
        q: "Queue lấy phần tử nào ra trước?",
        o: ["Phần tử vào trước nhất","Phần tử vào sau cùng","Phần tử lớn nhất"],
        a: 0,
        h: "Nhớ xếp hàng mua vé.",
        s: "Ôn lại: Phần tử vào trước nhất"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Đề chưa nói: yêu cầu bị từ chối có tính vào giới hạn không?",
        o: [
          "Không tính. Ta ghi giả định rõ ràng rồi hỏi lại người đặt yêu cầu",
          "Chắc chắn có tính",
          "Không cần quan tâm"
        ],
        a: 0,
        h: "Hai cách hiểu cho ra kết quả khác nhau, nên phải ghi giả định ra.",
        s: "Chốt: Không tính. Ta ghi giả định rõ ràng rồi hỏi lại người đặt yêu cầu"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "times = [3, 1] (thời gian đảo ngược). Hàm nên làm gì?",
        o: [
          "Báo ValueError: dữ liệu thời gian sai thứ tự",
          "Âm thầm sắp xếp lại",
          "Bỏ qua yêu cầu thứ hai"
        ],
        a: 0,
        h: "Log bị đảo thứ tự thường là dấu hiệu hệ thống đang hỏng. Che đi thì rất khó tìm nguyên nhân.",
        s: "Chốt: Báo ValueError: dữ liệu thời gian sai thứ tự"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Vì sao dùng queue thay vì stack để giữ các thời điểm?",
        o: [
          "Cần bỏ thời điểm cũ nhất, tức vào trước thì ra trước",
          "Cần bỏ thời điểm mới nhất",
          "Không có khác biệt"
        ],
        a: 0,
        h: "Thời điểm nào hết hạn trước?",
        s: "Chốt: Cần bỏ thời điểm cũ nhất, tức vào trước thì ra trước"
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
          [
            "Chặn đầu vào xấu: times là list, limit và window là số nguyên dương, thời gian không giảm",
            "Dữ liệu nào làm hàm chạy sai hoặc chạy ra kết quả vô nghĩa?"
          ],
          [
            "Tạo hàng đợi rỗng chứa thời điểm các yêu cầu đã được chấp nhận",
            "Cần nhớ gì về quá khứ?"
          ],
          [
            "Với mỗi yêu cầu, bỏ các thời điểm quá cũ ở đầu hàng",
            "Thời điểm nào không còn nằm trong cửa sổ?"
          ],
          [
            "Còn chỗ trong hàng thì chấp nhận và ghi thời điểm vào hàng",
            "Số thời điểm trong hàng so với limit?"
          ],
          [
            "Hết chỗ thì từ chối, KHÔNG ghi vào hàng",
            "Yêu cầu bị từ chối có tính không? Nhớ giả định đã ghi."
          ],
          ["Trả về danh sách kết quả","Mỗi yêu cầu cho ra một giá trị gì?"]
        ]
      },
      {
        k: "tests",
        ph: "Bước 3: Viết test trước (TDD, pha đỏ)",
        q: "Chưa có code nào cả. Viết ít nhất 3 assert: một ca đơn giản nhất, một ca thường, một ca biên, và ít nhất một ca đầu vào xấu phải raise (assert raises(...)). Hợp đồng và test viết TRƯỚC, code sau. Bấm chạy: hàm rỗng PHẢI thất bại.",
        s: "Test viết xong, đã thấy đỏ",
        hp: [
          "Nghĩ ba ca: nhỏ nhất, bình thường, và ca biên (danh sách rỗng).",
          "Cú pháp: assert allowed_requests(...) == kết_quả_mong_đợi\nLỗi: assert raises(ValueError, allowed_requests, [])"
        ]
      },
      {
        k: "code",
        ph: "Bước 4: Hàng rào trước (exception và đầu vào xấu), CHƯA giải đề",
        q: "Làm như đội hệ thống thật: bảo vệ hàm trước. Chỉ viết phần chặn đầu vào xấu và raise đúng loại lỗi kèm thông điệp rõ. Chưa cần tính gì cả.",
        s: "Hàng rào đã chặn đủ các ca đầu vào xấu",
        mode: "guard",
        hp: [
          "Liệt kê các ca xấu bạn đã viết test: times không phải list, limit hoặc window không dương hoặc không phải số nguyên, phần tử không phải số nguyên, thời gian giảm dần. Mỗi ca cần một dòng if rồi raise.",
          "Mẫu:\nif not isinstance(times, list):\n    raise TypeError(\"times phai la list\")\nif not isinstance(limit, int) or not isinstance(window, int) or limit <= 0 or window <= 0:\n    raise ValueError(\"limit va window phai la so nguyen duong\")",
          "Lời giải tham khảo (phần hàng rào):\ndef allowed_requests(times, limit, window):\n    if not isinstance(times, list):\n        raise TypeError(\"times phai la list\")\n    if not isinstance(limit, int) or not isinstance(window, int) or limit <= 0 or window <= 0:\n        raise ValueError(\"limit va window phai la so nguyen duong\")\n    if any([not isinstance(t, int) for t in times]):\n        raise ValueError(\"moi moc thoi gian phai la so nguyen\")\n    if any([times[i] > times[i + 1] for i in range(len(times) - 1)]):\n        raise ValueError(\"thoi gian phai khong giam\")\n"
        ]
      },
      {
        k: "code",
        ph: "Bước 5: Giải đề: thuật toán đơn giản nhất để qua test (pha xanh)",
        q: "Hàng rào đã có sẵn bên dưới. Giờ mới giải đề. Chỉ cần xanh, code xấu, lặp lại đều được. Chưa cần đẹp.",
        s: "Test xanh với code đơn giản",
        mode: "happy",
        hp: [
          "Nhớ bài rl1: hàng đợi giữ các thời điểm đã chấp nhận. Trước mỗi yêu cầu, bỏ các thời điểm quá cũ ở đầu hàng.",
          "Khung gợi ý (điền chỗ ___):\ndef allowed_requests(times, limit, window):\n    q = []\n    result = []\n    for t in times:\n        while q and q[0] <= t - ___:\n            q.pop(___)\n        if len(q) < ___:\n            q.append(t)\n            result.append(___)\n        else:\n            result.append(___)\n    return result",
          "Lời giải tham khảo. Hãy tự gõ lại bằng tay, đừng copy, gõ lại giúp não nhớ hơn:\ndef allowed_requests(times, limit, window):\n    if not isinstance(times, list):\n        raise TypeError(\"times phai la list\")\n    if not isinstance(limit, int) or not isinstance(window, int) or limit <= 0 or window <= 0:\n        raise ValueError(\"limit va window phai la so nguyen duong\")\n    if any([not isinstance(t, int) for t in times]):\n        raise ValueError(\"moi moc thoi gian phai la so nguyen\")\n    if any([times[i] > times[i + 1] for i in range(len(times) - 1)]):\n        raise ValueError(\"thoi gian phai khong giam\")\n    q = []\n    result = []\n    for t in times:\n        while q and q[0] <= t - window:\n            q.pop(0)\n        if len(q) < limit:\n            q.append(t)\n            result.append(True)\n        else:\n            result.append(False)\n    return result\n"
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
        o: ["O(1)","O(n), mỗi yêu cầu vào hàng đợi và ra khỏi hàng đợi nhiều nhất một lần","O(n²)"],
        a: 1,
        h: "Đếm xem mỗi phần tử bị chạm tới bao nhiêu lần.",
        s: "Chốt: O(n), mỗi yêu cầu vào hàng đợi và ra khỏi hàng đợi nhiều nhất một lần, mỗi phần tử xử lý một số lần cố định."
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
          "Dùng được vào việc thật: giới hạn tốc độ của API, chống đoán mật khẩu liên tục, chống spam tin nhắn"
        ],
        a: 2,
        h: "Nghĩ tới hệ thống thật có dữ liệu thật.",
        s: "Chốt: giới hạn tốc độ của API, chống đoán mật khẩu liên tục, chống spam tin nhắn."
      },
      {
        k: "reflect",
        ph: "Bước 8: Ứng dụng, không chỉ giải đề",
        q: "Viết nhận xét code review cho CHÍNH code của bạn: một điểm tốt, một điều bạn sẽ cải thiện, và một ca test bạn thấy còn thiếu. Rồi nghĩ thêm một chỗ khác trong công việc thật mà bạn có thể dùng đúng ý tưởng này.",
        s: "Đã tự review và nối với thực tế"
      }
    ],
    ws: 1,
    fn: "allowed_requests",
    brief: "Viết hàm allowed_requests(times, limit, window). times là list các thời điểm (số nguyên giây) của các yêu cầu, không giảm dần. Một yêu cầu tại thời điểm t được chấp nhận nếu số yêu cầu ĐÃ ĐƯỢC CHẤP NHẬN trước đó có thời điểm lớn hơn t - window ít hơn limit. Trả về list True/False cho từng yêu cầu. times không phải list thì báo TypeError. limit hoặc window không phải số nguyên dương, hoặc times chứa phần tử không phải số nguyên, hoặc times giảm dần thì báo ValueError.<br><small>Mức dẫn dắt: Ít (tự làm, mình chỉ hỗ trợ khi bạn bấm Cần giúp)</small>",
    cs: "def allowed_requests(times, limit, window):\n    pass\n",
    ts: "# Lần này test do bạn tự viết. Nhớ test các ca xấu và ca yêu cầu bị từ chối không bị tính. Cần giúp thì bấm nút.\ndef raises(exc, f, *a):\n    try:\n        f(*a)\n    except exc:\n        return True\n    return False\n\n",
    ref: "def allowed_requests(times, limit, window):\n    if not isinstance(times, list):\n        raise TypeError(\"times phai la list\")\n    if not isinstance(limit, int) or not isinstance(window, int) or limit <= 0 or window <= 0:\n        raise ValueError(\"limit va window phai la so nguyen duong\")\n    if any([not isinstance(t, int) for t in times]):\n        raise ValueError(\"moi moc thoi gian phai la so nguyen\")\n    if any([times[i] > times[i + 1] for i in range(len(times) - 1)]):\n        raise ValueError(\"thoi gian phai khong giam\")\n    q = []\n    result = []\n    for t in times:\n        while q and q[0] <= t - window:\n            q.pop(0)\n        if len(q) < limit:\n            q.append(t)\n            result.append(True)\n        else:\n            result.append(False)\n    return result\n",
    hid: [
      ["allowed_requests([], 2, 3)","[]"],
      ["allowed_requests([1], 1, 5)","[True]"],
      ["allowed_requests([1, 2, 3, 4], 2, 3)","[True, True, False, True]"],
      ["allowed_requests([5, 5, 5], 2, 10)","[True, True, False]"],
      ["allowed_requests([1, 10], 1, 5)","[True, True]"],
      ["allowed_requests([1, 2, 3], 1, 2)","[True, False, True]"]
    ],
    errs: [
      ["allowed_requests(None, 1, 1)","TypeError"],
      ["allowed_requests('x', 1, 1)","TypeError"],
      ["allowed_requests([1], 0, 5)","ValueError"],
      ["allowed_requests([1], 1, -1)","ValueError"],
      ["allowed_requests([1], 'a', 1)","ValueError"],
      ["allowed_requests([3, 1], 1, 5)","ValueError"],
      ["allowed_requests(['a'], 1, 5)","ValueError"]
    ],
    lvl: 3
  }
];
