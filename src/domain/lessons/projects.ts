import type { RichLesson } from './lesson-types';

export const PROJECTS_LESSONS: RichLesson[] = [
{
    id: "m1",
    t: "Mini project 1: yêu cầu thật thì luôn thiếu chi tiết",
    steps: [
      {
        k: "choice",
        q: "Khách hàng nói: 'Hệ thống tính số dư tài khoản từ danh sách giao dịch.' Việc đầu tiên một lập trình viên giỏi làm là gì?",
        o: [
          "Hỏi lại những chỗ chưa rõ trước khi viết dòng code nào",
          "Mở editor và code ngay",
          "Chờ khách tự bổ sung"
        ],
        a: 0,
        h: "Câu yêu cầu có nói giao dịch trông như thế nào không?",
        s: "Đoán sai yêu cầu thì code đẹp đến mấy cũng vô ích."
      },
      {
        k: "choice",
        q: "Câu hỏi nào về yêu cầu quan trọng nhất ở đây?",
        o: ["Rút nhiều hơn số dư thì sao: cho âm hay từ chối?","Dùng font nào","Viết bằng máy nào"],
        a: 0,
        h: "Điều này ảnh hưởng đến tiền thật.",
        s: "Quy tắc nghiệp vụ như vậy phải được khách xác nhận."
      },
      {
        k: "choice",
        q: "Khách im lặng không trả lời. Bạn nên làm gì?",
        o: [
          "Ghi rõ giả định mình chọn (ví dụ: không cho số dư âm) và gửi lại để họ xác nhận",
          "Tự chọn và không nói ai biết",
          "Bỏ dự án"
        ],
        a: 0,
        h: "Giả định không ghi ra sẽ thành bất ngờ sau này.",
        s: "Ghi giả định ra giấy trắng mực đen, để ai cũng đọc được."
      },
      {
        k: "input",
        q: "Một giao dịch gồm 3 trường: id, type, amount. Mỗi giao dịch cần có bao nhiêu trường bắt buộc?",
        a: 3,
        h: "Đếm các trường vừa nêu.",
        s: "3 trường. Thiếu một trường là dữ liệu hỏng."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Viết 3 giả định bạn sẽ gửi cho khách xác nhận trước khi code (ví dụ về số dư âm, loại giao dịch, id trùng).",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Yêu cầu thật luôn là một câu ngắn, còn chi tiết nằm trong đầu người viết ra nó.</b><br>\n\"Hệ thống tính số dư từ danh sách giao dịch\" nghe đủ rõ, nhưng thử hỏi: giao dịch trông như thế nào? Rút nhiều hơn số dư thì sao? Nhiều người sẽ code ngay rồi mới phát hiện mình đã hiểu khác khách. Việc đầu tiên là <b>hỏi</b>, chưa phải viết.<br>\nBa nhóm câu hỏi làm rõ, dùng được cho mọi đề:<br>\n• <b>Dữ liệu vào:</b> có những trường nào, trường nào bắt buộc (ở bài này: <code>id</code>, <code>type</code>, <code>amount</code>, đủ cả 3)? Danh sách rỗng thì sao?<br>\n• <b>Quy tắc ở chỗ biên:</b> số dư có được âm không? <code>amount</code> bằng 0 hay âm thì sao? Hai giao dịch trùng <code>id</code> thì sao?<br>\n• <b>Kết quả ra:</b> trả một con số, hay báo lỗi khi dữ liệu xấu?<br>\n<b>Ví dụ chạy tay: cùng một dữ liệu, hai cách hiểu, hai kết quả.</b> Nạp 100 rồi rút 150:<pre>def so_du(lo, cho_am):\n    s = 0\n    for loai, tien in lo:\n        s = s + tien if loai == \"nap\" else s - tien\n        if s &lt; 0 and not cho_am:\n            raise ValueError(\"so du am\")\n    return s\nprint(so_du([(\"nap\", 100), (\"rut\", 150)], True))    # -50</pre>\n• Nếu khách chọn \"cho âm\" thì kết quả là <b>-50</b>. Nếu khách chọn \"không cho âm\" thì cũng đúng dữ liệu này nhưng hàm phải <b>báo lỗi</b> <code>ValueError</code>. Cả hai chương trình đều \"đúng\", chỉ khác là bạn đang trả lời câu hỏi nào. Code không thể tự biết, nên người viết phải hỏi.<br>\n• Khách im lặng thì <b>đừng im lặng theo</b>: tự chọn một cách, <b>ghi giả định ra</b> (ví dụ \"không cho số dư âm\") và gửi lại để họ xác nhận.<br>\n<b>Lỗi hay gặp:</b> mở editor ngay vì \"bài dễ\"; tự chọn giả định rồi không nói với ai; hỏi chung chung kiểu \"anh còn yêu cầu gì không?\" (người nghe không biết trả lời gì) thay vì hỏi cụ thể \"rút quá số dư thì cho âm hay từ chối?\".<br>\n<b>Mẹo:</b> trước khi code, viết ra 3 giả định và 2 ví dụ vào-ra. Nếu không viết nổi một ví dụ cụ thể thì chưa hiểu đủ để code. Một câu hỏi tốt thường có dạng \"nếu... thì...?\"."
  },
{
    id: "m2",
    t: "Liệt kê giao dịch không hợp lệ TRƯỚC khi code",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">txs = [{'id': 1, 'type': 'deposit', 'amount': 100}, {'id': 2, 'type': 'withdraw', 'amount': 30}, {'id': 2, 'type': 'deposit', 'amount': 10}, {'id': 3, 'type': 'gift', 'amount': 5}, {'id': 4, 'type': 'deposit', 'amount': -20}]\nprint(len(txs))</pre>Danh sách có 5 giao dịch. Trong đó có bao nhiêu giao dịch KHÔNG hợp lệ? (id 2 xuất hiện hai lần, loại 'gift' không phải deposit hay withdraw, và một khoản nạp âm. Đếm giao dịch id 2 thứ hai là một lỗi.)",
        a: 3,
        h: "Liệt kê: trùng id, loại lạ, số tiền âm.",
        s: "3 lỗi: trùng id, type lạ, amount âm."
      },
      {
        k: "choice",
        q: "Có một giao dịch xấu trong danh sách 1000 giao dịch. Nên làm gì với tiền của khách?",
        o: [
          "Từ chối cả lô và báo rõ giao dịch nào sai, để người phụ trách sửa",
          "Bỏ giao dịch xấu và cứ tính tiếp, không báo ai",
          "Tính hết rồi đoán"
        ],
        a: 0,
        h: "Số dư sai do lặng lẽ bỏ qua có thể hại ai?",
        s: "Với tiền, im lặng bỏ qua dữ liệu là nguy hiểm. Báo lỗi rõ ràng, dễ truy vết."
      },
      {
        k: "choice",
        q: "amount = -50 do người dùng nhập sai thuộc loại lỗi nào?",
        o: [
          "Lỗi dữ liệu đầu vào dự đoán được: kiểm tra rồi raise ValueError",
          "Lỗi bất ngờ của hệ thống",
          "Không phải lỗi"
        ],
        a: 0,
        h: "Ta biết trước người dùng có thể nhập sai.",
        s: "Lỗi dự đoán được thì kiểm tra trước và báo bằng exception rõ nghĩa."
      },
      {
        k: "choice",
        q: "Loại lỗi nào ta KHÔNG thể biết trước và chỉ có thể bắt ở tầng ngoài, ghi log?",
        o: ["Hết bộ nhớ, mất kết nối đột ngột","Thiếu trường amount","amount âm"],
        a: 0,
        h: "Hai cái còn lại ta kiểm tra được ngay từ dữ liệu.",
        s: "Lỗi bất ngờ: bắt ở tầng ngoài, ghi lại, báo cho người vận hành."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Tự giải thích: vì sao ta kiểm tra toàn bộ đầu vào trước khi tính, thay vì vừa tính vừa kiểm tra?",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Liệt kê những dữ liệu xấu có thể xảy ra TRƯỚC khi code, vì chính danh sách đó sẽ thành các ca test.</b><br>\nDanh sách 5 giao dịch trong bài:<br>\n• <code>{id 1, deposit, 100}</code> hợp lệ.<br>\n• <code>{id 2, withdraw, 30}</code> hợp lệ.<br>\n• <code>{id 2, deposit, 10}</code> <b>trùng id</b> với dòng trên → lỗi 1.<br>\n• <code>{id 3, gift, 5}</code> <b>loại lạ</b>, không phải <code>deposit</code> hay <code>withdraw</code> → lỗi 2.<br>\n• <code>{id 4, deposit, -20}</code> <b>số tiền âm</b> → lỗi 3.<br>\nVậy có <b>3</b> giao dịch không hợp lệ (đếm giao dịch id 2 thứ hai, không đếm cái đầu). Chạy lại bằng code:<pre>txs = [{\"id\": 1, \"type\": \"deposit\", \"amount\": 100}, {\"id\": 2, \"type\": \"withdraw\", \"amount\": 30}, {\"id\": 2, \"type\": \"deposit\", \"amount\": 10}, {\"id\": 3, \"type\": \"gift\", \"amount\": 5}, {\"id\": 4, \"type\": \"deposit\", \"amount\": -20}]\nseen = set()\nloi = 0\nfor t in txs:\n    if t[\"id\"] in seen or t[\"type\"] not in (\"deposit\", \"withdraw\") or t[\"amount\"] &lt; 0:\n        loi += 1\n    seen.add(t[\"id\"])\nprint(loi)    # 3</pre>\n<b>Hai loại lỗi, hai cách xử lý:</b><br>\n• <b>Lỗi dự đoán được</b> (người dùng nhập <code>amount = -50</code>): ta biết trước nên <b>kiểm tra rồi báo</b> bằng <code>raise ValueError(...)</code> với thông điệp rõ nghĩa.<br>\n• <b>Lỗi bất ngờ</b> (hết bộ nhớ, mất kết nối giữa chừng): không biết trước, chỉ bắt được ở tầng ngoài, ghi log và báo cho người vận hành.<br>\n<b>Vì sao kiểm tra hết rồi mới tính?</b> Nếu vừa tính vừa kiểm tra mà giao dịch thứ 900 mới hỏng, bạn đã tính (và có thể đã ghi) 899 giao dịch trước nó: kết quả dở dang, khó biết đã làm tới đâu. Kiểm tra toàn bộ trước thì hoặc cả lô được xử lý, hoặc không động tới gì.<br>\n<b>Với tiền, im lặng bỏ qua dữ liệu xấu là nguy hiểm.</b> Bỏ giao dịch hỏng mà không báo thì số dư sai mà không ai biết. Hãy báo rõ <i>giao dịch nào</i> sai và vì sao.<br>\n<b>Lỗi hay gặp:</b> chỉ nghĩ tới dữ liệu đẹp; đếm nhầm (đếm cả hai giao dịch id 2); nhét <code>try/except</code> bao hết để \"cho chạy\" rồi nuốt lỗi.<br>\n<b>Mẹo:</b> với mỗi trường, hỏi ba câu: <i>Thiếu thì sao? Sai kiểu thì sao? Sai giá trị thì sao?</i> Mỗi câu trả lời là một ca test."
  },
{
    id: "m3",
    t: "Chia nhỏ thành đường ống: kiểm tra, tính, trả",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">t = [100, -30, -50]\ntotal = 0\nfor x in t:\n    total += x\nprint(total)</pre>(+ là nạp, - là rút) In ra mấy?",
        a: 20,
        h: "100 - 30 - 50.",
        s: "100 - 30 = 70, 70 - 50 = 20."
      },
      {
        k: "input",
        q: "Rút thêm 80 từ số dư 20 thì số dư sẽ là bao nhiêu?",
        a: -60,
        h: "20 - 80.",
        s: "-60. Theo giả định không cho âm thì phải báo lỗi."
      },
      {
        k: "choice",
        q: "Kiểm tra số dư âm nên làm khi nào?",
        o: ["Ngay sau mỗi giao dịch rút","Chỉ ở cuối","Không cần"],
        a: 0,
        h: "Nếu thứ tự là rút 80 trước rồi mới nạp 100 thì ở cuối số dư dương nhưng giữa chừng đã âm.",
        s: "Số dư phải hợp lệ ở mọi thời điểm."
      },
      {
        k: "choice",
        q: "Thứ tự đúng của đường ống là gì?",
        o: ["Kiểm tra đầu vào, tính, trả kết quả","Tính, kiểm tra, trả","Trả, kiểm tra, tính"],
        a: 0,
        h: "Dữ liệu hỏng thì tính có ý nghĩa gì?",
        s: "Kiểm tra trước, tính sau, rồi mới trả."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Vẽ bằng lời đường ống: nhận dữ liệu, kiểm tra, tính, trả. Ở mỗi bước, lỗi nào có thể xảy ra và hàm sẽ làm gì?",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Chia việc thành đường ống: kiểm tra đầu vào → tính → trả kết quả.</b> Mỗi khâu làm một việc, và biết lỗi của mình là gì.<br>\n<b>Chạy tay phần tính.</b> Giao dịch <code>[100, -30, -50]</code> (dương là nạp, âm là rút):<pre>t = [100, -30, -50]\ntotal = 0\nfor x in t:\n    total += x\nprint(total)    # 20</pre>\n• 0 + 100 = 100; 100 - 30 = 70; 70 - 50 = <b>20</b>. Rút thêm 80 từ số dư 20 thì được 20 - 80 = <b>-60</b>: âm, mà ta đã giả định không cho âm, nên đây là chỗ phải báo lỗi.<br>\n<b>Vì sao kiểm tra số dư ngay sau mỗi lần rút, không chờ đến cuối?</b> Thử thứ tự rút 80 trước, nạp 100 sau:<pre>so_du = 0\nthap_nhat = 0\nfor x in [-80, 100]:\n    so_du += x\n    thap_nhat = min(thap_nhat, so_du)\nprint(so_du, thap_nhat)    # 20 -80</pre>\n• Cuối cùng số dư là +20 (trông ổn) nhưng giữa chừng đã xuống <b>-80</b>. Tài khoản thật không cho phép điều đó. Số dư phải hợp lệ <b>ở mọi thời điểm</b>, không chỉ ở cuối.<br>\n<b>Đường ống đầy đủ:</b><pre>def xu_ly(lo):\n    for x in lo:\n        if not isinstance(x, int):\n            raise TypeError(\"moi giao dich phai la so nguyen\")\n    so_du = 0\n    for x in lo:\n        so_du += x\n        if so_du &lt; 0:\n            raise ValueError(\"so du am\")\n    return so_du\nprint(xu_ly([100, -30, -50]))    # 20</pre>\n<b>Chỗ dễ nhầm với bài trước:</b> bài \"liệt kê giao dịch không hợp lệ\" nói kiểm tra <i>hết đầu vào trước khi tính</i>, còn ở đây kiểm tra số dư <i>trong lúc tính</i>. Hai điều không mâu thuẫn. <b>Hình dạng dữ liệu</b> (đủ trường, đúng kiểu, không trùng id) kiểm tra được ngay từ danh sách nên làm trước. <b>Quy tắc phụ thuộc trạng thái</b> (số dư âm) chỉ biết được khi đã tính tới đó nên phải kiểm tra từng bước.<br>\n<b>Lỗi hay gặp:</b> tính trước rồi mới kiểm tra (tính trên dữ liệu hỏng thì kết quả vô nghĩa); chỉ kiểm tra số dư ở cuối; trộn cả ba khâu vào một đống lệnh nên lỗi ở đâu cũng khó tìm.<br>\n<b>Mẹo:</b> với mỗi khâu, tự trả lời \"khâu này nhận gì, trả gì, lỗi nào có thể xảy ra, khi đó hàm làm gì?\". Chưa trả lời được cho một khâu thì khâu đó chưa sẵn sàng để code."
  }
];
