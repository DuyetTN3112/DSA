import type { RichLesson } from './lesson-types';

export const DEBUG_LESSONS: RichLesson[] = [
{
    id: "e1",
    t: "Đọc thông báo lỗi: Python đang nói gì với bạn?",
    steps: [
      {
        k: "choice",
        q: "<pre class=\"out\">nums = [10, 20, 30]\nprint(nums[3])</pre>Chạy đoạn này sẽ gặp lỗi gì?",
        o: ["IndexError (vị trí không tồn tại)","KeyError","NameError"],
        a: 0,
        h: "Danh sách có 3 phần tử. Các chỉ số hợp lệ là gì?",
        s: "Chỉ số hợp lệ là 0, 1, 2. Chỉ số 3 không tồn tại."
      },
      {
        k: "input",
        q: "Với danh sách 3 phần tử như trên, chỉ số lớn nhất dùng được là mấy?",
        a: 2,
        h: "Đếm từ 0.",
        s: "n phần tử thì chỉ số lớn nhất là n - 1."
      },
      {
        k: "choice",
        q: "<pre class=\"out\">d = {\"a\": 1}\nprint(d[\"b\"])</pre>Lỗi gì?",
        o: ["KeyError (key chưa có)","IndexError","TypeError"],
        a: 0,
        h: "Dictionary có key nào? Ta tra key nào?",
        s: "Tra key b chưa từng được ghi vào."
      },
      {
        k: "choice",
        q: "<pre class=\"out\">print(\"5\" + 2)</pre>Lỗi gì?",
        o: ["TypeError (cộng chữ với số)","ValueError","SyntaxError"],
        a: 0,
        h: "\"5\" là chữ hay số?",
        s: "Chữ và số không cộng trực tiếp được."
      },
      {
        k: "choice",
        q: "<pre class=\"out\">print(tong)</pre>(chưa có dòng nào tạo biến tong) Lỗi gì?",
        o: ["NameError (chưa biết tên này)","IndexError","ZeroDivisionError"],
        a: 0,
        h: "Python có biết biến tong là gì không?",
        s: "Chưa tạo biến mà đã dùng."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Tự giải thích: khi gặp thông báo lỗi, bạn đọc phần nào trước, và phần đó cho bạn biết điều gì? (Gợi ý: tên lỗi, thông điệp, số dòng.)",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Thông báo lỗi không phải lời mắng. Đó là Python đang nói cho bạn biết chuyện gì xảy ra.</b><br>\nĐọc theo thứ tự này:<br>\n• <b>Dòng cuối cùng</b> trước: có <b>tên lỗi</b> và <b>thông điệp</b>.<br>\n• Rồi tìm <b>số dòng</b> (<code>line N</code>) cho biết lỗi xảy ra ở dòng nào.<br>\n• Rồi nhìn dòng code đó và tự hỏi: \"dòng này đang cần gì mà không có?\"<br>\nBốn lỗi hay gặp nhất, ứng với bốn đoạn trong bài:<br>\n• <code>nums = [10, 20, 30]</code> rồi <code>nums[3]</code> → <code>IndexError: list index out of range</code>. Ba phần tử thì chỉ số hợp lệ là 0, 1, 2. <b>n phần tử thì chỉ số lớn nhất là n - 1.</b><br>\n• <code>d = {\"a\": 1}</code> rồi <code>d[\"b\"]</code> → <code>KeyError: 'b'</code>. Tra một key chưa từng được ghi vào.<br>\n• <code>\"5\" + 2</code> → <code>TypeError</code>. Chữ và số không cộng trực tiếp được.<br>\n• <code>print(tong)</code> khi chưa có dòng nào tạo biến <code>tong</code> → <code>NameError: name 'tong' is not defined</code>. Dùng hộp chưa tạo.<br>\n<b>Lỗi hay gặp:</b> đọc dòng đầu của thông báo rồi hoảng, không đọc dòng cuối; sửa code ở dòng khác với dòng Python chỉ ra; thấy <code>IndexError</code> rồi thêm <code>try/except</code> để \"cho hết đỏ\" thay vì hỏi vì sao chỉ số vượt quá.<br>\n<b>Mẹo:</b> trả lời ba câu rồi mới sửa: <i>Lỗi gì? Ở dòng nào? Dòng đó đang cần gì mà không có?</i> Một thông báo lỗi chỉ ra chỗ gần nhất với nguyên nhân, nhưng nguyên nhân thật đôi khi nằm ở dòng trước đó."
  },
{
    id: "e2",
    t: "Phòng debug 1: thiếu một phần tử",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">nums = [1, 2, 3]\ntotal = 0\nfor i in range(len(nums) - 1):\n    total += nums[i]\nprint(total)</pre>Đoạn này in ra mấy? Hãy dò bằng tay từng vòng.",
        a: 3,
        h: "len(nums) - 1 bằng 2, range(2) cho ra 0, 1.",
        s: "i = 0 và i = 1 nên chỉ cộng 1 + 2 = 3."
      },
      {
        k: "input",
        q: "Kết quả đúng của 1 + 2 + 3 là mấy?",
        a: 6,
        h: "Cộng cả ba số.",
        s: "6. Chương trình không báo lỗi nhưng cho kết quả sai: đây là lỗi logic."
      },
      {
        k: "input",
        q: "Phần tử bị bỏ sót nằm ở chỉ số mấy?",
        a: 2,
        h: "Vòng lặp chỉ chạy i = 0 và 1.",
        s: "Chỉ số 2, tức phần tử cuối."
      },
      {
        k: "choice",
        q: "Vì sao vòng lặp dừng sớm một phần tử?",
        o: [
          "range(len(nums) - 1) chỉ cho ra các số từ 0 đến len - 2",
          "Vì total bắt đầu bằng 0",
          "Vì nums có 3 phần tử"
        ],
        a: 0,
        h: "range(2) cho ra những số nào?",
        s: "Trừ đi 1 là thừa: range(len(nums)) đã dừng ở len - 1 rồi. Đây là lỗi lệch một (off-by-one)."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Tự giải thích: lỗi lệch một xảy ra khi nào? Bạn sẽ kiểm tra thế nào để phát hiện sớm? (Gợi ý: thử danh sách chỉ có 1 phần tử.)",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Lỗi lệch một (off-by-one): vòng lặp dừng sớm hoặc chạy quá một phần tử.</b><pre>nums = [1, 2, 3]\ntotal = 0\nfor i in range(len(nums) - 1):\n    total += nums[i]\nprint(total)    # 3</pre>\n• Chương trình <b>không báo lỗi gì</b> nhưng in 3, trong khi 1 + 2 + 3 = 6. Đây là <b>lỗi logic</b>: Python không biết bạn muốn gì, nên không thể báo.<br>\n• Dò tay từng vòng: <code>len(nums) - 1</code> là 2, nên <code>range(2)</code> cho <code>i = 0, 1</code>. Chỉ cộng <code>nums[0] + nums[1] = 1 + 2 = 3</code>. Phần tử ở chỉ số <b>2</b> (phần tử cuối) bị bỏ sót.<br>\n• Lý do: <code>range(len(nums))</code> <b>đã</b> dừng ở <code>len - 1</code> rồi (nó không bao gồm số cuối). Trừ thêm 1 là thừa.<pre>nums = [1, 2, 3]\ntotal = 0\nfor i in range(len(nums)):\n    total += nums[i]\nprint(total)    # 6</pre>\n<b>Lỗi hay gặp:</b> nhớ \"chỉ số lớn nhất là n - 1\" rồi áp dụng nó hai lần (một lần trong <code>range</code>, một lần nữa bằng tay). Hoặc ngược lại, dùng <code>range(len(nums) + 1)</code> rồi gặp <code>IndexError</code>.<br>\n<b>Mẹo:</b> thử bằng <b>danh sách chỉ có 1 phần tử</b>. Với <code>[5]</code>, bản sai cho tổng 0 vì <code>range(0)</code> không chạy lần nào. Dễ thấy hơn nhiều so với danh sách dài."
  },
{
    id: "e3",
    t: "Phòng debug 2: giá trị khởi tạo sai",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">nums = [1, 2, 3]\ntotal = 1\nfor x in nums:\n    total += x\nprint(total)</pre>Đoạn này in ra mấy?",
        a: 7,
        h: "total bắt đầu bằng 1, rồi cộng 1, 2, 3.",
        s: "1 + 1 + 2 + 3 = 7, trong khi tổng đúng là 6."
      },
      {
        k: "choice",
        q: "Giá trị khởi tạo đúng cho một phép cộng dồn là gì?",
        o: ["0, vì cộng 0 không làm đổi gì","1","Phần tử cuối"],
        a: 0,
        h: "Số nào cộng vào mà kết quả không đổi?",
        s: "Phần tử trung hòa của phép cộng là 0."
      },
      {
        k: "input",
        q: "<pre class=\"out\">nums = [-5, -2, -9]\nbest = 0\nfor x in nums:\n    if x > best:\n        best = x\nprint(best)</pre>Đoạn tìm số lớn nhất này in ra mấy?",
        a: 0,
        h: "Có số nào lớn hơn 0 không?",
        s: "In ra 0, nhưng 0 không nằm trong danh sách. Sai."
      },
      {
        k: "choice",
        q: "Vì sao lại sai?",
        o: [
          "best bắt đầu bằng 0 trong khi mọi số đều âm",
          "Vì có số âm là không hợp lệ",
          "Vì vòng for sai"
        ],
        a: 0,
        h: "Nhớ bài tờ giấy nhớ: ban đầu nên ghi gì?",
        s: "Nên lấy phần tử đầu tiên làm mốc."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Tự giải thích: ca test nào sẽ lộ ra lỗi này ngay lập tức? Vì sao ca test 'bình thường' [1, 2, 3] không phát hiện được?",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Giá trị khởi tạo sai: lỗi nằm ở dòng TRƯỚC vòng lặp.</b><pre>nums = [1, 2, 3]\ntotal = 1\nfor x in nums:\n    total += x\nprint(total)    # 7\nnums = [-5, -2, -9]\nbest = 0\nfor x in nums:\n    if x &gt; best:\n        best = x\nprint(best)     # 0</pre>\n• <b>Cộng dồn:</b> bắt đầu từ <code>total = 1</code> thì 1 thừa bị cộng vào kết quả: 1 + 1 + 2 + 3 = 7, đúng là 6. Giá trị khởi tạo đúng cho phép cộng là <b>0</b> (cộng 0 không làm thay đổi gì).<br>\n• <b>Tìm số lớn nhất:</b> với <code>[-5, -2, -9]</code>, mốc <code>best = 0</code> lớn hơn mọi số trong danh sách, nên không số nào thay được nó. Kết quả là 0, một số <b>không hề có trong danh sách</b>.<br>\n• Cách sửa: lấy <b>phần tử đầu tiên</b> làm mốc: <code>best = nums[0]</code>. Lúc đó kết quả là -2, đúng.<br>\n<b>Vì sao test bình thường không phát hiện?</b> Với <code>[1, 2, 3]</code>, mốc <code>best = 0</code> cho kết quả 3, trùng với đáp án đúng. Chỉ khi <b>mọi số đều âm</b> thì lỗi mới lộ. Test chỉ lộ lỗi khi nó đúng chỗ yếu của code.<br>\n<b>Lỗi hay gặp:</b> chọn đại một số cho tiện (0, 1, hoặc một số \"rất nhỏ\") mà không hỏi \"số đó có phải trung hòa với phép toán này không?\" Phép cộng cần 0, phép nhân cần 1, tìm lớn nhất cần một phần tử có thật.<br>\n<b>Mẹo:</b> luôn thử thêm hai ca: danh sách toàn số âm, và danh sách rỗng (rỗng thì <code>nums[0]</code> báo <code>IndexError</code>, nghĩa là bạn phải quyết định hàm làm gì với đầu vào rỗng)."
  },
{
    id: "e4",
    t: "Phòng debug 3: lỗi logic, không báo lỗi gì cả",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">def dem_chan(nums):\n    c = 0\n    for x in nums:\n        if x % 2 == 1:\n            c += 1\n    return c\nprint(dem_chan([2, 4, 5]))</pre>Hàm tên dem_chan (đếm số chẵn). Nó in ra mấy?",
        a: 1,
        h: "x % 2 == 1 đúng với số nào trong [2, 4, 5]?",
        s: "Chỉ số 5 (lẻ), nên in 1."
      },
      {
        k: "input",
        q: "Đếm số chẵn trong [2, 4, 5] thì đúng phải ra mấy?",
        a: 2,
        h: "Chỉ 2 và 4 là chẵn.",
        s: "2. Hàm đang đếm số lẻ chứ không phải số chẵn."
      },
      {
        k: "choice",
        q: "Lỗi này thuộc loại nào?",
        o: [
          "Lỗi logic: chạy được, không báo lỗi, nhưng kết quả sai",
          "Lỗi cú pháp",
          "Lỗi chạy (exception)"
        ],
        a: 0,
        h: "Python có báo lỗi gì không?",
        s: "Lỗi logic khó nhất vì chỉ có test mới lộ ra."
      },
      {
        k: "choice",
        q: "Cách debug hiệu quả nhất khi code chạy được mà sai là gì?",
        o: [
          "Dò bằng tay hoặc in giá trị từng vòng, so với kết quả mong đợi",
          "Đoán rồi sửa bừa",
          "Xóa hết viết lại"
        ],
        a: 0,
        h: "Bạn cần thấy máy tính đang làm gì ở từng bước.",
        s: "Quan sát từng bước rồi so với kỳ vọng. Sửa bừa dễ gây thêm lỗi."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Tự giải thích: phân biệt ba loại lỗi (cú pháp, exception khi chạy, logic) bằng lời của bạn. Loại nào Python báo cho bạn, loại nào bạn phải tự phát hiện?",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Lỗi logic: code chạy được, không có thông báo nào, nhưng kết quả sai.</b><pre>def dem_chan(nums):\n    c = 0\n    for x in nums:\n        if x % 2 == 1:\n            c += 1\n    return c\nprint(dem_chan([2, 4, 5]))    # 1</pre>\n• Tên hàm là \"đếm số chẵn\", đúng phải ra <b>2</b> (số 2 và 4). Hàm in 1 vì <code>x % 2 == 1</code> là điều kiện của số <b>lẻ</b> (chia 2 dư 1). Hàm đang đếm số lẻ.<br>\n• Sửa: <code>x % 2 == 0</code>. Khi đó <code>dem_chan([2, 4, 5])</code> ra 2.<br>\n<b>Ba loại lỗi, ai phát hiện?</b><br>\n• <b>Lỗi cú pháp</b> (thiếu <code>:</code>, thiếu ngoặc): Python báo <b>trước khi chạy</b>.<br>\n• <b>Lỗi khi chạy</b> (exception như <code>IndexError</code>, <code>KeyError</code>): Python báo <b>giữa chừng</b>, kèm tên lỗi và số dòng.<br>\n• <b>Lỗi logic</b>: Python <b>không biết</b>. Chỉ có bạn (hoặc test) phát hiện được bằng cách so với kết quả mong đợi.<br>\n<b>Cách debug có phương pháp:</b> (1) ghi ra kết quả <b>mong đợi</b> bằng tay; (2) chạy, ghi kết quả <b>thực tế</b>; (3) tìm bước <b>đầu tiên</b> hai bên lệch nhau (in giá trị biến sau từng vòng); (4) sửa <b>một thứ</b> rồi chạy lại.<br>\n<b>Lỗi hay gặp:</b> sửa bừa nhiều chỗ cùng lúc cho tới khi ra đúng một ví dụ; không viết sẵn kết quả mong đợi nên không biết mình đang sai hay đúng.<br>\n<b>Mẹo:</b> một ví dụ đúng không chứng minh code đúng. Thử thêm ca khác: danh sách rỗng, chỉ có số lẻ, chỉ có số chẵn."
  }
];
