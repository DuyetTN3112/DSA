import type { RichLesson } from './lesson-types';

export const W11_LESSONS: RichLesson[] = [
{
    id: "w11",
    t: "Mini project 3, Code 11: bracket_error (tìm lỗi ngoặc như trình soạn thảo)",
    steps: [
      {
        k: "choice",
        ph: "Khởi động: nhắc lại bài cũ (nhắc lại nhiều lần mới nhớ lâu)",
        q: "Stack lấy phần tử nào ra trước?",
        o: ["Phần tử đặt vào sau cùng","Phần tử đặt vào đầu tiên","Phần tử nhỏ nhất"],
        a: 0,
        h: "Nhớ chồng đĩa: đĩa trên cùng.",
        s: "Ôn lại: Phần tử đặt vào sau cùng"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Chuỗi 'x = (1 + 2' có lỗi không, và lỗi ở chỉ số mấy?",
        o: ["Có: ngoặc mở ở chỉ số 4 chưa được đóng","Không có lỗi","Lỗi ở chỉ số 0"],
        a: 0,
        h: "Đếm chỉ số từng ký tự kể cả dấu cách. Ngoặc mở nằm ở đâu?",
        s: "Chốt: Có: ngoặc mở ở chỉ số 4 chưa được đóng"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Chuỗi '(]': gặp ] khi ngoặc đang chờ đóng là (. Báo lỗi ở đâu?",
        o: ["Chỉ số 1: ngoặc đóng sai loại","Chỉ số 0","Không có lỗi"],
        a: 0,
        h: "Người dùng cần biết CHỖ SAI, nên ta trả về chỉ số của ngoặc đóng sai.",
        s: "Chốt: Chỉ số 1: ngoặc đóng sai loại"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Chuỗi '{[}]' có đủ 2 cặp ngoặc. Chỉ đếm số ngoặc mở và đóng có đủ để kết luận đúng không?",
        o: [
          "Không đủ: phải nhớ ngoặc nào mở sau cùng thì phải đóng trước (stack)",
          "Đủ, vì số lượng bằng nhau",
          "Không cần nhớ gì"
        ],
        a: 0,
        h: "Thử với '{[}]': số lượng bằng nhau nhưng thứ tự đóng đã sai.",
        s: "Chốt: Không đủ: phải nhớ ngoặc nào mở sau cùng thì phải đóng trước (stack)"
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
          [
            "Chặn đầu vào xấu: s không phải chuỗi thì báo TypeError",
            "Hàm nhận về một con số thì sao?"
          ],
          [
            "Tạo stack rỗng để nhớ chỉ số các ngoặc mở chưa đóng",
            "Cần nhớ những gì đang chờ được đóng?"
          ],
          ["Duyệt từng ký tự: ngoặc mở thì đẩy chỉ số vào stack","Gặp ngoặc mở thì làm gì?"],
          [
            "Gặp ngoặc đóng: stack rỗng hoặc đỉnh không khớp thì trả về chỉ số hiện tại, ngược lại lấy đỉnh ra",
            "Ngoặc đóng này phải gặp ngoặc mở nào?"
          ],
          [
            "Hết chuỗi mà stack còn phần tử thì trả về chỉ số ở đỉnh",
            "Còn ngoặc mở nào chưa được đóng?"
          ],
          ["Còn lại thì trả về -1","Không có lỗi nào thì báo gì?"]
        ]
      },
      {
        k: "tests",
        ph: "Bước 3: Viết test trước (TDD, pha đỏ)",
        q: "Chưa có code nào cả. Viết ít nhất 3 assert: một ca đơn giản nhất, một ca thường, một ca biên, và ít nhất một ca đầu vào xấu phải raise (assert raises(...)). Hợp đồng và test viết TRƯỚC, code sau. Bấm chạy: hàm rỗng PHẢI thất bại.",
        s: "Test viết xong, đã thấy đỏ",
        hp: [
          "Nghĩ ba ca: nhỏ nhất, bình thường, và ca biên (danh sách rỗng).",
          "Cú pháp: assert bracket_error(...) == kết_quả_mong_đợi\nLỗi: assert raises(ValueError, bracket_error, [])"
        ]
      },
      {
        k: "code",
        ph: "Bước 4: Hàng rào trước (exception và đầu vào xấu), CHƯA giải đề",
        q: "Làm như đội hệ thống thật: bảo vệ hàm trước. Chỉ viết phần chặn đầu vào xấu và raise đúng loại lỗi kèm thông điệp rõ. Chưa cần tính gì cả.",
        s: "Hàng rào đã chặn đủ các ca đầu vào xấu",
        mode: "guard",
        hp: [
          "Liệt kê ca xấu trong test của bạn: chỉ có một ca, đầu vào không phải chuỗi. Dòng đầu tiên của hàm nên làm gì?",
          "Mẫu:\nif not isinstance(s, str):\n    raise TypeError(\"s phai la chuoi\")",
          "Lời giải tham khảo (phần hàng rào):\nif not isinstance(s, str):\n    raise TypeError(\"s phai la chuoi\")"
        ]
      },
      {
        k: "code",
        ph: "Bước 5: Giải đề: thuật toán đơn giản nhất để qua test (pha xanh)",
        q: "Hàng rào đã có sẵn bên dưới. Giờ mới giải đề. Chỉ cần xanh, code xấu, lặp lại đều được. Chưa cần đẹp.",
        s: "Test xanh với code đơn giản",
        mode: "happy",
        hp: [
          "Nhớ bài stack: vào sau thì ra trước. Cái ngoặc mở nằm trên đỉnh phải là cái được đóng đầu tiên.",
          "Khung gợi ý (điền chỗ ___):\ndef bracket_error(s):\n    pairs = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\n    stack = []\n    for i in range(len(s)):\n        c = s[i]\n        if c in \"([{\":\n            stack.___(i)\n        elif c in pairs:\n            if len(stack) == 0 or s[stack[___]] != pairs[c]:\n                return ___\n            stack.pop()\n    if len(stack) > 0:\n        return stack[-1]\n    return ___",
          "Lời giải tham khảo. Hãy tự gõ lại bằng tay, đừng copy, gõ lại giúp não nhớ hơn:\ndef bracket_error(s):\n    if not isinstance(s, str):\n        raise TypeError(\"s phai la chuoi\")\n    pairs = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\n    stack = []\n    for i in range(len(s)):\n        c = s[i]\n        if c in \"([{\":\n            stack.append(i)\n        elif c in pairs:\n            if len(stack) == 0 or s[stack[-1]] != pairs[c]:\n                return i\n            stack.pop()\n    if len(stack) > 0:\n        return stack[-1]\n    return -1\n"
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
        o: ["O(n²)","O(1)","O(n), mỗi ký tự được xét một lần"],
        a: 2,
        h: "Đếm xem mỗi phần tử bị chạm tới bao nhiêu lần.",
        s: "Chốt: O(n), mỗi ký tự được xét một lần, mỗi phần tử xử lý một số lần cố định."
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
          "Dùng được vào việc thật: trình soạn thảo gạch chân ngoặc thiếu, công cụ kiểm tra JSON và file cấu hình, máy tính biểu thức",
          "Chỉ dùng trong bài thi lập trình",
          "Không dùng ở đâu cả"
        ],
        a: 0,
        h: "Nghĩ tới hệ thống thật có dữ liệu thật.",
        s: "Chốt: trình soạn thảo gạch chân ngoặc thiếu, công cụ kiểm tra JSON và file cấu hình, máy tính biểu thức."
      },
      {
        k: "reflect",
        ph: "Bước 8: Ứng dụng, không chỉ giải đề",
        q: "Viết nhận xét code review cho CHÍNH code của bạn: một điểm tốt, một điều bạn sẽ cải thiện, và một ca test bạn thấy còn thiếu. Rồi nghĩ thêm một chỗ khác trong công việc thật mà bạn có thể dùng đúng ý tưởng này.",
        s: "Đã tự review và nối với thực tế"
      }
    ],
    ws: 1,
    fn: "bracket_error",
    brief: "Viết hàm bracket_error(s). s là chuỗi mã hoặc cấu hình có ngoặc ( ) [ ] { } lẫn các ký tự khác (ký tự khác bỏ qua). Trả về -1 nếu mọi ngoặc đúng. Nếu có lỗi, trả về chỉ số (đếm từ 0) của ngoặc lỗi đầu tiên: ngoặc đóng thừa hoặc sai loại. Nếu hết chuỗi mà còn ngoặc mở chưa đóng, trả về chỉ số của ngoặc mở chưa đóng nằm gần cuối nhất. s không phải chuỗi thì báo TypeError.<br><small>Mức dẫn dắt: Vừa (có khung comment, tự viết hàng rào và logic)</small>",
    cs: "def bracket_error(s):\n    # việc 1: chặn đầu vào xấu (không phải chuỗi thì raise TypeError)\n    # việc 2: tạo stack rỗng (chứa CHỈ SỐ các ngoặc mở)\n    # việc 3: duyệt từng chỉ số i, ngoặc mở thì đẩy i vào stack\n    # việc 4: ngoặc đóng mà stack rỗng hoặc đỉnh không khớp thì trả về i, ngược lại lấy đỉnh ra\n    # việc 5: hết chuỗi mà stack còn phần tử thì trả về chỉ số ở đỉnh\n    # việc 6: không lỗi thì trả về -1\n    pass\n",
    ts: "# Mình cho sẵn 1 test mẫu. Bạn viết thêm test cho: chuỗi rỗng, ngoặc đóng thừa, ngoặc thiếu đóng, ngoặc đan xen sai thứ tự, chuỗi có chữ lẫn ngoặc, và đầu vào không phải chuỗi.\ndef raises(exc, f, *a):\n    try:\n        f(*a)\n    except exc:\n        return True\n    return False\n\nassert bracket_error('(]') == 1   # ví dụ có sẵn\n",
    ref: "def bracket_error(s):\n    if not isinstance(s, str):\n        raise TypeError(\"s phai la chuoi\")\n    pairs = {\")\": \"(\", \"]\": \"[\", \"}\": \"{\"}\n    stack = []\n    for i in range(len(s)):\n        c = s[i]\n        if c in \"([{\":\n            stack.append(i)\n        elif c in pairs:\n            if len(stack) == 0 or s[stack[-1]] != pairs[c]:\n                return i\n            stack.pop()\n    if len(stack) > 0:\n        return stack[-1]\n    return -1\n",
    hid: [
      ["bracket_error('')","-1"],
      ["bracket_error('()')","-1"],
      ["bracket_error('a(b)[c]{d}')","-1"],
      ["bracket_error('(]')","1"],
      ["bracket_error(')')","0"],
      ["bracket_error('((')","1"],
      ["bracket_error('{[}]')","2"],
      ["bracket_error('x = (1 + 2')","4"]
    ],
    errs: [
      ["bracket_error(None)","TypeError"],
      ["bracket_error(5)","TypeError"],
      ["bracket_error(['('])","TypeError"]
    ],
    lvl: 2
  }
];
