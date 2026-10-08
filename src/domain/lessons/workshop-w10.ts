import type { RichLesson } from './lesson-types';

export const W10_LESSONS: RichLesson[] = [
{
    id: "w10",
    t: "Mini project 2, Code 10: install_order (thứ tự cài các gói)",
    steps: [
      {
        k: "choice",
        ph: "Khởi động: nhắc lại bài cũ (nhắc lại nhiều lần mới nhớ lâu)",
        q: "Gặp lại một nút đang được thăm trong DFS nghĩa là gì?",
        o: ["Có vòng","Hết đồ thị","Đây là nút lá"],
        a: 0,
        h: "Đường đi quay về đúng nơi nó đang đi từ đó.",
        s: "Ôn lại: Có vòng"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Gói app cần lib, lib cần core. Thứ tự cài đúng là gì?",
        o: ["core, lib, app","app, lib, core","lib, core, app"],
        a: 0,
        h: "Cái được cần phải có mặt trước.",
        s: "Chốt: core, lib, app"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Gói app cần X nhưng X không có trong deps. Hàm nên làm gì?",
        o: ["Báo ValueError: thiếu gói, không cài được","Bỏ qua X và cài tiếp","Tự thêm X"],
        a: 0,
        h: "Cài một gói thiếu phụ thuộc thì hệ thống thật sẽ ra sao?",
        s: "Chốt: Báo ValueError: thiếu gói, không cài được"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Nếu a cần b và b cần a, hàm nên làm gì?",
        o: ["Báo ValueError: phụ thuộc vòng, không có thứ tự hợp lệ","Cài a trước rồi b","Bỏ qua"],
        a: 0,
        h: "Gói nào cài trước? Nhớ bài ap4.",
        s: "Chốt: Báo ValueError: phụ thuộc vòng, không có thứ tự hợp lệ"
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
            "Kiểm tra deps là dict, tên gói là chuỗi, phụ thuộc là list",
            "Đầu vào xấu thì chặn ở đâu?"
          ],
          [
            "Kiểm tra mọi gói được nhắc tới đều có trong deps",
            "Cần một gói không tồn tại thì cài được không?"
          ],
          [
            "Với mỗi gói, thăm các gói nó cần trước (đệ quy)",
            "Gói cần phải xong trước gói đang xét."
          ],
          [
            "Đánh dấu gói đang thăm, gặp lại gói đang thăm nghĩa là có vòng",
            "Thăm lại đúng gói mình đang đi từ đó, nghĩa là gì?"
          ],
          ["Thăm xong thì thêm gói vào kết quả","Khi nào thì gói chắc chắn đã sẵn sàng cài?"],
          ["Trả về danh sách thứ tự","Duyệt hết mọi gói rồi thì có gì?"]
        ]
      },
      {
        k: "tests",
        ph: "Bước 3: Viết test trước (TDD, pha đỏ)",
        q: "Chưa có code nào cả. Viết ít nhất 3 assert: một ca đơn giản nhất, một ca thường, một ca biên, và ít nhất một ca đầu vào xấu phải raise (assert raises(...)). Hợp đồng và test viết TRƯỚC, code sau. Bấm chạy: hàm rỗng PHẢI thất bại.",
        s: "Test viết xong, đã thấy đỏ",
        hp: [
          "Nghĩ ba ca: nhỏ nhất, bình thường, và ca biên (danh sách rỗng).",
          "Cú pháp: assert install_order(...) == kết_quả_mong_đợi\nLỗi: assert raises(ValueError, install_order, [])"
        ]
      },
      {
        k: "code",
        ph: "Bước 4: Hàng rào trước (exception và đầu vào xấu), CHƯA giải đề",
        q: "Làm như đội hệ thống thật: bảo vệ hàm trước. Chỉ viết phần chặn đầu vào xấu và raise đúng loại lỗi kèm thông điệp rõ. Chưa cần tính gì cả.",
        s: "Hàng rào đã chặn đủ các ca đầu vào xấu",
        mode: "guard",
        hp: [
          "Liệt kê các ca xấu trong test của bạn: đầu vào không phải dict, tên không phải chuỗi, phụ thuộc không phải list, gói được nhắc tới mà không có. Mỗi ca cần một dòng if rồi raise.",
          "Mẫu:\nif not isinstance(deps, dict):\n    raise TypeError(\"deps phai la dict\")\nCác ca còn lại dùng any([... for ...]) rồi raise ValueError.",
          "Lời giải tham khảo:\ndef install_order(deps):\n    if not isinstance(deps, dict):\n        raise TypeError(\"deps phai la dict\")\n    if any([not isinstance(k, str) for k in deps]):\n        raise ValueError(\"ten goi phai la chuoi\")\n    if any([not isinstance(v, list) for v in deps.values()]):\n        raise ValueError(\"phu thuoc phai la list\")\n    if any([d not in deps for v in deps.values() for d in v]):\n        raise ValueError(\"phu thuoc khong ton tai\")\n    order = []\n    state = {}\n    def visit(x):\n        if state.get(x) == \"done\":\n            return\n        if state.get(x) == \"doing\":\n            raise ValueError(\"phu thuoc vong\")\n        state[x] = \"doing\"\n        for d in deps[x]:\n            visit(d)\n        state[x] = \"done\"\n        order.append(x)\n    for name in sorted(deps):\n        visit(name)\n    return order\n"
        ]
      },
      {
        k: "code",
        ph: "Bước 5: Giải đề: thuật toán đơn giản nhất để qua test (pha xanh)",
        q: "Hàng rào đã có sẵn bên dưới. Giờ mới giải đề. Chỉ cần xanh, code xấu, lặp lại đều được. Chưa cần đẹp.",
        s: "Test xanh với code đơn giản",
        mode: "happy",
        hp: [
          "Đây là DFS trên đồ thị phụ thuộc: bài ap4 và bài g3 gộp lại. Gói có ba trạng thái: chưa thăm, đang thăm, xong.",
          "Khung gợi ý (điền chỗ ___):\ndef install_order(deps):\n    order = []\n    state = {}\n    def visit(x):\n        if state.get(x) == \"done\":\n            return\n        if state.get(x) == \"___\":\n            raise ValueError(\"phu thuoc vong\")\n        state[x] = \"doing\"\n        for d in deps[x]:\n            visit(___)\n        state[x] = \"done\"\n        order.___(x)\n    for name in sorted(deps):\n        visit(name)\n    return order",
          "Lời giải tham khảo. Hãy tự gõ lại bằng tay, đừng copy, gõ lại giúp não nhớ hơn:\ndef install_order(deps):\n    if not isinstance(deps, dict):\n        raise TypeError(\"deps phai la dict\")\n    if any([not isinstance(k, str) for k in deps]):\n        raise ValueError(\"ten goi phai la chuoi\")\n    if any([not isinstance(v, list) for v in deps.values()]):\n        raise ValueError(\"phu thuoc phai la list\")\n    if any([d not in deps for v in deps.values() for d in v]):\n        raise ValueError(\"phu thuoc khong ton tai\")\n    order = []\n    state = {}\n    def visit(x):\n        if state.get(x) == \"done\":\n            return\n        if state.get(x) == \"doing\":\n            raise ValueError(\"phu thuoc vong\")\n        state[x] = \"doing\"\n        for d in deps[x]:\n            visit(d)\n        state[x] = \"done\"\n        order.append(x)\n    for name in sorted(deps):\n        visit(name)\n    return order\n"
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
        o: ["O(V + E), tức tuyến tính theo số gói cộng số mối phụ thuộc","O(n²)","O(1)"],
        a: 0,
        h: "Đếm xem mỗi phần tử bị chạm tới bao nhiêu lần.",
        s: "Chốt: O(V + E), tức tuyến tính theo số gói cộng số mối phụ thuộc, mỗi phần tử xử lý một số lần cố định."
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
          "Dùng được vào việc thật: trình quản lý gói (pip, npm), hệ thống build, thứ tự học các môn tiên quyết",
          "Chỉ dùng trong bài thi lập trình"
        ],
        a: 1,
        h: "Nghĩ tới hệ thống thật có dữ liệu thật.",
        s: "Chốt: trình quản lý gói (pip, npm), hệ thống build, thứ tự học các môn tiên quyết."
      },
      {
        k: "reflect",
        ph: "Bước 8: Ứng dụng, không chỉ giải đề",
        q: "Viết nhận xét code review cho CHÍNH code của bạn: một điểm tốt, một điều bạn sẽ cải thiện, và một ca test bạn thấy còn thiếu. Rồi nghĩ thêm một chỗ khác trong công việc thật mà bạn có thể dùng đúng ý tưởng này.",
        s: "Đã tự review và nối với thực tế"
      }
    ],
    ws: 1,
    fn: "install_order",
    brief: "Viết hàm install_order(deps). deps là dict: tên gói, giá trị là list các gói nó cần. Trả về list thứ tự cài sao cho mỗi gói đứng SAU các gói nó cần. Khi nhiều thứ tự đều đúng, duyệt tên gói theo thứ tự chữ cái. Gói cần một gói không có trong deps, hoặc có phụ thuộc vòng, thì báo ValueError.<br><small>Mức dẫn dắt: Vừa (có khung comment, tự viết hàng rào và logic)</small>",
    cs: "def install_order(deps):\n    # việc 1: chặn đầu vào xấu (dict, tên là chuỗi, phụ thuộc là list)\n    # việc 2: chặn gói được nhắc tới mà không có trong deps\n    # việc 3: với mỗi gói theo thứ tự chữ cái, thăm các phụ thuộc trước (đệ quy)\n    # việc 4: đang thăm mà gặp lại thì báo vòng\n    # việc 5: thăm xong thì thêm vào kết quả\n    pass\n",
    ts: "# Mình cho sẵn 1 test mẫu. Bạn viết thêm test cho: không có gói nào, chuỗi phụ thuộc nối dài, hai gói độc lập, đầu vào None, gói thiếu, phụ thuộc vòng.\ndef raises(exc, f, *a):\n    try:\n        f(*a)\n    except exc:\n        return True\n    return False\n\nassert install_order({'app': ['lib'], 'lib': []}) == ['lib', 'app']   # ví dụ có sẵn\n",
    ref: "def install_order(deps):\n    if not isinstance(deps, dict):\n        raise TypeError(\"deps phai la dict\")\n    if any([not isinstance(k, str) for k in deps]):\n        raise ValueError(\"ten goi phai la chuoi\")\n    if any([not isinstance(v, list) for v in deps.values()]):\n        raise ValueError(\"phu thuoc phai la list\")\n    if any([d not in deps for v in deps.values() for d in v]):\n        raise ValueError(\"phu thuoc khong ton tai\")\n    order = []\n    state = {}\n    def visit(x):\n        if state.get(x) == \"done\":\n            return\n        if state.get(x) == \"doing\":\n            raise ValueError(\"phu thuoc vong\")\n        state[x] = \"doing\"\n        for d in deps[x]:\n            visit(d)\n        state[x] = \"done\"\n        order.append(x)\n    for name in sorted(deps):\n        visit(name)\n    return order\n",
    hid: [
      ["install_order({})","[]"],
      ["install_order({'app': ['lib'], 'lib': []})","['lib', 'app']"],
      ["install_order({'a': [], 'b': []})","['a', 'b']"],
      [
        "install_order({'app': ['lib', 'log'], 'lib': ['core'], 'log': ['core'], 'core': []})",
        "['core', 'lib', 'log', 'app']"
      ]
    ],
    errs: [
      ["install_order(None)","TypeError"],
      ["install_order({1: []})","ValueError"],
      ["install_order({'a': 'b'})","ValueError"],
      ["install_order({'a': ['x']})","ValueError"],
      ["install_order({'a': ['b'], 'b': ['a']})","ValueError"],
      ["install_order({'a': ['a']})","ValueError"]
    ],
    lvl: 2
  }
];
