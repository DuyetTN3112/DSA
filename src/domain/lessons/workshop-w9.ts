import type { RichLesson } from './lesson-types';

export const W9_LESSONS: RichLesson[] = [
{
    id: "w9",
    t: "Mini project 1, Code 9: final_balance (số dư sau các giao dịch)",
    steps: [
      {
        k: "choice",
        ph: "Khởi động: nhắc lại bài cũ (nhắc lại nhiều lần mới nhớ lâu)",
        q: "Đầu vào xấu nên bị chặn ở đâu?",
        o: ["Ngay đầu hàm, trước khi tính","Ở cuối hàm","Không cần chặn"],
        a: 0,
        h: "Nhớ đường ống: kiểm tra, tính, trả.",
        s: "Ôn lại: Ngay đầu hàm, trước khi tính"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Giao dịch thiếu trường amount. Hàm nên làm gì?",
        o: ["Báo ValueError, vì dữ liệu hỏng","Coi như amount bằng 0","Bỏ qua im lặng"],
        a: 0,
        h: "Số tiền bị mất nghĩa là gì với kế toán?",
        s: "Chốt: Báo ValueError, vì dữ liệu hỏng"
      },
      {
        k: "choice",
        ph: "Bước 1: Đọc đề như đi làm thật (yêu cầu, ví dụ, rủi ro)",
        q: "Rút 50 khi số dư đang là 20. Hàm nên làm gì?",
        o: ["Báo ValueError: số dư không đủ","Cho số dư âm","Trả về 0"],
        a: 0,
        h: "Nhớ giả định đã ghi: không cho số dư âm.",
        s: "Chốt: Báo ValueError: số dư không đủ"
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
          ["Kiểm tra txs là list, nếu không thì báo TypeError","Hàm nhận được None thì sao?"],
          [
            "Kiểm tra từng giao dịch: là dict, có id, type hợp lệ, amount là số dương",
            "Một giao dịch thiếu trường hoặc sai loại thì hệ thống tiền bạc nên làm gì?"
          ],
          ["Kiểm tra id không trùng","Hai giao dịch cùng id có thể là gì trong thực tế?"],
          ["Duyệt giao dịch: nạp thì cộng, rút thì trừ","Số dư bắt đầu từ đâu?"],
          ["Sau mỗi giao dịch, số dư âm thì báo ValueError","Khi nào số dư bị phép trừ làm âm?"],
          ["Trả về số dư cuối","Duyệt xong rồi, kết quả là gì?"]
        ]
      },
      {
        k: "tests",
        ph: "Bước 3: Viết test trước (TDD, pha đỏ)",
        q: "Chưa có code nào cả. Viết ít nhất 3 assert: một ca đơn giản nhất, một ca thường, một ca biên, và ít nhất một ca đầu vào xấu phải raise (assert raises(...)). Hợp đồng và test viết TRƯỚC, code sau. Bấm chạy: hàm rỗng PHẢI thất bại.",
        s: "Test viết xong, đã thấy đỏ",
        hp: [
          "Nghĩ ba ca: nhỏ nhất, bình thường, và ca biên (danh sách rỗng).",
          "Cú pháp: assert final_balance(...) == kết_quả_mong_đợi\nLỗi: assert raises(ValueError, final_balance, [])"
        ]
      },
      {
        k: "code",
        ph: "Bước 4: Hàng rào trước (exception và đầu vào xấu), CHƯA giải đề",
        q: "Làm như đội hệ thống thật: bảo vệ hàm trước. Chỉ viết phần chặn đầu vào xấu và raise đúng loại lỗi kèm thông điệp rõ. Chưa cần tính gì cả.",
        s: "Hàng rào đã chặn đủ các ca đầu vào xấu",
        mode: "guard",
        hp: [
          "Hãy liệt kê lại các ca xấu bạn đã viết trong test. Mỗi ca cần một dòng if rồi raise.",
          "Mẫu một hàng rào:\nif not isinstance(txs, list):\n    raise TypeError(\"txs phai la list\")\nVới danh sách, any([... for t in txs]) cho biết có giao dịch nào thỏa điều kiện xấu.",
          "Lời giải tham khảo:\ndef final_balance(txs):\n    if not isinstance(txs, list):\n        raise TypeError(\"txs phai la list\")\n    if any([not isinstance(t, dict) for t in txs]):\n        raise ValueError(\"moi giao dich phai la dict\")\n    if any([t.get(\"id\") is None for t in txs]):\n        raise ValueError(\"thieu id\")\n    if any([t.get(\"type\") not in (\"deposit\", \"withdraw\") for t in txs]):\n        raise ValueError(\"type khong hop le\")\n    if any([not isinstance(t.get(\"amount\"), (int, float)) or t.get(\"amount\") <= 0 for t in txs]):\n        raise ValueError(\"amount phai la so duong\")\n    if len(set([t.get(\"id\") for t in txs])) != len(txs):\n        raise ValueError(\"trung id\")\n    total = 0\n    for t in txs:\n        if t[\"type\"] == \"deposit\":\n            total += t[\"amount\"]\n        else:\n            total -= t[\"amount\"]\n        if total < 0:\n            raise ValueError(\"so du khong du\")\n    return total\n"
        ]
      },
      {
        k: "code",
        ph: "Bước 5: Giải đề: thuật toán đơn giản nhất để qua test (pha xanh)",
        q: "Hàng rào đã có sẵn bên dưới. Giờ mới giải đề. Chỉ cần xanh, code xấu, lặp lại đều được. Chưa cần đẹp.",
        s: "Test xanh với code đơn giản",
        mode: "happy",
        hp: [
          "Nhìn lại cấu trúc bài trước: hàng rào chặn dữ liệu xấu, rồi vòng lặp tính, rồi kiểm tra điều kiện nghiệp vụ.",
          "Khung gợi ý (điền chỗ ___):\ndef final_balance(txs):\n    total = ___\n    for t in txs:\n        if t[\"type\"] == \"deposit\":\n            total += t[\"amount\"]\n        else:\n            total -= ___\n        if total ___ 0:\n            raise ValueError(\"so du khong du\")\n    return total",
          "Lời giải tham khảo. Hãy tự gõ lại bằng tay, đừng copy, gõ lại giúp não nhớ hơn:\ndef final_balance(txs):\n    if not isinstance(txs, list):\n        raise TypeError(\"txs phai la list\")\n    if any([not isinstance(t, dict) for t in txs]):\n        raise ValueError(\"moi giao dich phai la dict\")\n    if any([t.get(\"id\") is None for t in txs]):\n        raise ValueError(\"thieu id\")\n    if any([t.get(\"type\") not in (\"deposit\", \"withdraw\") for t in txs]):\n        raise ValueError(\"type khong hop le\")\n    if any([not isinstance(t.get(\"amount\"), (int, float)) or t.get(\"amount\") <= 0 for t in txs]):\n        raise ValueError(\"amount phai la so duong\")\n    if len(set([t.get(\"id\") for t in txs])) != len(txs):\n        raise ValueError(\"trung id\")\n    total = 0\n    for t in txs:\n        if t[\"type\"] == \"deposit\":\n            total += t[\"amount\"]\n        else:\n            total -= t[\"amount\"]\n        if total < 0:\n            raise ValueError(\"so du khong du\")\n    return total\n"
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
          "Dùng được vào việc thật: sổ cái của ví điện tử hoặc ngân hàng, nơi mọi lỗi dữ liệu phải lộ ra rõ ràng"
        ],
        a: 2,
        h: "Nghĩ tới hệ thống thật có dữ liệu thật.",
        s: "Chốt: sổ cái của ví điện tử hoặc ngân hàng, nơi mọi lỗi dữ liệu phải lộ ra rõ ràng."
      },
      {
        k: "reflect",
        ph: "Bước 8: Ứng dụng, không chỉ giải đề",
        q: "Viết nhận xét code review cho CHÍNH code của bạn: một điểm tốt, một điều bạn sẽ cải thiện, và một ca test bạn thấy còn thiếu. Rồi nghĩ thêm một chỗ khác trong công việc thật mà bạn có thể dùng đúng ý tưởng này.",
        s: "Đã tự review và nối với thực tế"
      }
    ],
    ws: 1,
    fn: "final_balance",
    brief: "Viết hàm final_balance(txs). Mỗi giao dịch là dict có id, type ('deposit' nạp hoặc 'withdraw' rút), amount (số dương). Trả về số dư cuối, bắt đầu từ 0. Số dư không được âm ở bất kỳ thời điểm nào. Dữ liệu sai thì báo lỗi rõ ràng, không đoán.<br><small>Mức dẫn dắt: Vừa (có khung comment, tự viết hàng rào và logic)</small>",
    cs: "def final_balance(txs):\n    # việc 1: kiểm tra txs là list\n    # việc 2: kiểm tra từng giao dịch (dict, id, type, amount dương)\n    # việc 3: kiểm tra id không trùng\n    # việc 4: duyệt, nạp thì cộng, rút thì trừ\n    # việc 5: số dư âm thì báo ValueError\n    # việc 6: trả về số dư\n    pass\n",
    ts: "# Mình cho sẵn 1 test mẫu. Bạn viết thêm test cho: danh sách trống, nạp rồi rút, đầu vào None, giao dịch xấu, rút quá số dư.\ndef raises(exc, f, *a):\n    try:\n        f(*a)\n    except exc:\n        return True\n    return False\n\nassert final_balance([{'id': 1, 'type': 'deposit', 'amount': 100}]) == 100   # ví dụ có sẵn\n",
    ref: "def final_balance(txs):\n    if not isinstance(txs, list):\n        raise TypeError(\"txs phai la list\")\n    if any([not isinstance(t, dict) for t in txs]):\n        raise ValueError(\"moi giao dich phai la dict\")\n    if any([t.get(\"id\") is None for t in txs]):\n        raise ValueError(\"thieu id\")\n    if any([t.get(\"type\") not in (\"deposit\", \"withdraw\") for t in txs]):\n        raise ValueError(\"type khong hop le\")\n    if any([not isinstance(t.get(\"amount\"), (int, float)) or t.get(\"amount\") <= 0 for t in txs]):\n        raise ValueError(\"amount phai la so duong\")\n    if len(set([t.get(\"id\") for t in txs])) != len(txs):\n        raise ValueError(\"trung id\")\n    total = 0\n    for t in txs:\n        if t[\"type\"] == \"deposit\":\n            total += t[\"amount\"]\n        else:\n            total -= t[\"amount\"]\n        if total < 0:\n            raise ValueError(\"so du khong du\")\n    return total\n",
    hid: [
      ["final_balance([])","0"],
      ["final_balance([{'id': 1, 'type': 'deposit', 'amount': 100}])","100"],
      [
        "final_balance([{'id': 1, 'type': 'deposit', 'amount': 100}, {'id': 2, 'type': 'withdraw', 'amount': 30}])",
        "70"
      ],
      [
        "final_balance([{'id': 1, 'type': 'deposit', 'amount': 50}, {'id': 2, 'type': 'withdraw', 'amount': 50}])",
        "0"
      ]
    ],
    errs: [
      ["final_balance(None)","TypeError"],
      ["final_balance([5])","ValueError"],
      ["final_balance([{'id': 1, 'type': 'gift', 'amount': 5}])","ValueError"],
      ["final_balance([{'id': 1, 'type': 'deposit', 'amount': -5}])","ValueError"],
      ["final_balance([{'id': 1, 'type': 'deposit'}])","ValueError"],
      [
        "final_balance([{'id': 1, 'type': 'deposit', 'amount': 5}, {'id': 1, 'type': 'deposit', 'amount': 7}])",
        "ValueError"
      ],
      ["final_balance([{'id': 1, 'type': 'withdraw', 'amount': 5}])","ValueError"]
    ],
    lvl: 2
  }
];
