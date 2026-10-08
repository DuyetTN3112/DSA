import type { RichLesson } from './lesson-types';

export const ALGORITHMS_LESSONS: RichLesson[] = [
{
    id: "sm",
    t: "Cộng dồn: tính tổng mảng",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">a = [2, 5, 3]\nt = 0\nfor x in a:\n    t = t + x\nprint(t)</pre>In ra số mấy?",
        a: 10,
        h: "Cộng lần lượt 2, rồi 5, rồi 3.",
        s: "2 + 5 + 3 = 10."
      },
      {
        k: "input",
        q: "t bằng mấy sau khi đã xét xong hai hộp đầu (2 và 5)?",
        a: 7,
        h: "t đang cộng dồn.",
        s: "2 + 5 = 7."
      },
      {
        k: "choice",
        q: "Vì sao t bắt đầu bằng 0?",
        o: ["0 không làm đổi tổng","Cho đẹp","Bắt buộc"],
        a: 0,
        h: "Cộng thêm 0 thì tổng có đổi không?",
        s: "0 là số 'không có gì', an toàn để bắt đầu."
      }
    ],
    dr: "sum",
    note: "<b>Cộng dồn</b>: tính tổng bằng một biến nhớ.<pre>total = 0\nfor x in a:\n    total = total + x</pre>• Bắt đầu từ <b>0</b> vì 0 là số \"không có gì\": cộng 0 vào đâu cũng không đổi.<br>• Mỗi vòng: lấy tổng cũ, cộng số mới, đặt lại vào <code>total</code>. Với [2, 5, 3]: 0 → 2 → 7 → 10.<br>• Mảng rỗng: vòng lặp không chạy lần nào, tổng là 0. Hợp lý.<br><b>Mẹo:</b> kẻ bảng hai cột \"x\" và \"total sau vòng này\"."
  },
{
    id: "cn",
    t: "Đếm số lần xuất hiện",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">a = [2, 5, 2, 2]\nc = 0\nfor x in a:\n    if x == 2:\n        c = c + 1\nprint(c)</pre>In ra số mấy?",
        a: 3,
        h: "Đếm xem có bao nhiêu hộp chứa 2.",
        s: "Có 3 hộp chứa 2."
      },
      {
        k: "choice",
        q: "Mỗi lần gặp số cần đếm, ta làm gì với c?",
        o: ["Cộng thêm 1","Đặt c về 0","Trừ 1"],
        a: 0,
        h: "c là số lần đã gặp.",
        s: "Gặp thêm một lần thì c tăng 1."
      },
      {
        k: "choice",
        q: "Vì sao c bắt đầu bằng 0?",
        o: ["Chưa gặp lần nào","Cho đẹp","Bắt buộc"],
        a: 0,
        h: "Trước khi mở hộp nào, đã đếm được mấy lần?",
        s: "Lúc đầu chưa gặp lần nào."
      }
    ],
    dr: "cnt",
    note: "<b>Đếm số lần xuất hiện</b>: dùng một bộ đếm.<pre>c = 0\nfor x in a:\n    if x == 2:\n        c = c + 1</pre>• <code>c = 0</code> vì lúc đầu <b>chưa gặp lần nào</b>.<br>• Mỗi lần gặp đúng giá trị cần đếm thì <code>c</code> tăng 1; không gặp thì để nguyên.<br>• Chú ý <code>==</code> (so sánh) chứ không phải <code>=</code> (gán).<br>• Cuối vòng lặp, <code>c</code> là số lần gặp. Ở ví dụ: có bao nhiêu hộp chứa 2."
  },
{
    id: "d1",
    t: "Dictionary: tra từ điển",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">d = {\"a\": 3, \"b\": 5}\nprint(d[\"b\"])</pre>In ra số mấy?",
        a: 5,
        h: "Tra khóa \"b\" xem ứng với số nào.",
        s: "Khóa b ứng với 5."
      },
      {
        k: "input",
        q: "<pre class=\"out\">d = {\"a\": 3}\nd[\"c\"] = 7\nprint(d[\"c\"])</pre>In ra số mấy?",
        a: 7,
        h: "d[\"c\"] = 7 là thêm một mục mới.",
        s: "Thêm khóa c với giá trị 7."
      },
      {
        k: "choice",
        q: "d[\"z\"] khi chưa có khóa z thì sao?",
        o: ["Báo lỗi KeyError","Trả về 0","Trả về None"],
        a: 0,
        h: "Từ điển không có từ đó thì tra không ra.",
        s: "Khóa không có thì báo KeyError."
      }
    ],
    dr: "dict",
    note: "<b>Dictionary: tra theo khóa, không tra theo vị trí.</b><pre>d = {\"a\": 3, \"b\": 5}\nprint(d[\"b\"])     # 5   (tra khóa \"b\")\nd[\"c\"] = 7         # thêm khóa mới \"c\" với giá trị 7\nprint(d[\"c\"])     # 7</pre>• Mỗi mục có hai phần: <b>khóa</b> (cái để tra, ví dụ <code>\"b\"</code>) và <b>giá trị</b> (cái tra ra, ví dụ <code>5</code>). Giống tra từ điển: tra chữ, ra nghĩa.<br>• <code>d[khóa]</code> <b>đọc</b> giá trị; <code>d[khóa] = giá trị</code> <b>ghi</b> (khóa đã có thì thay giá trị, chưa có thì thêm mới).<br>• Tra một khóa <b>chưa có</b> thì Python báo <code>KeyError</code>: không trả 0, không trả <code>None</code>. Đây là lỗi thật chứ không phải \"không có thì thôi\".<br><b>Khác list:</b> list tra bằng <b>số thứ tự</b> (<code>a[0]</code>); dict tra bằng <b>khóa</b> do bạn chọn.<br><b>Mẹo:</b> trước khi tra, hỏi \"khóa này chắc chắn đã có chưa?\" Chưa chắc thì phải kiểm tra trước (bài sau có cách tra an toàn)."
  },
{
    id: "d2",
    t: "Đếm tần suất bằng dict",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">d = {}\nprint(d.get(\"a\", 0))</pre>In ra số mấy?",
        a: 0,
        h: "get(khóa, 0): không có khóa thì trả 0.",
        s: "Chưa có a nên trả 0."
      },
      {
        k: "choice",
        q: "Muốn đếm số lần mỗi chữ xuất hiện, dict cần nhớ gì?",
        o: ["Chữ là khóa, số lần là giá trị","Chữ là giá trị, vị trí là khóa","Chỉ cần độ dài"],
        a: 0,
        h: "Tra theo chữ thì ra số lần.",
        s: "Khóa là chữ, giá trị là số lần."
      },
      {
        k: "input",
        q: "<pre class=\"out\">s = \"abca\"\nd = {}\nfor ch in s:\n    d[ch] = d.get(ch, 0) + 1\nprint(d[\"a\"])</pre>In ra số mấy?",
        a: 2,
        h: "Chữ a xuất hiện mấy lần trong abca?",
        s: "a xuất hiện 2 lần."
      }
    ],
    dr: "freq",
    note: "<b>Đếm tần suất: chữ là khóa, số lần là giá trị.</b><pre>s = \"abca\"\nd = {}\nfor ch in s:\n    d[ch] = d.get(ch, 0) + 1\nprint(d[\"a\"])    # 2</pre>• <code>d.get(ch, 0)</code> nghĩa là: tra khóa <code>ch</code>; <b>nếu chưa có thì trả 0</b> (không báo lỗi). Đây là chỗ khác <code>d[ch]</code>.<br>• Mỗi lần gặp một chữ: lấy số lần cũ (hoặc 0 nếu lần đầu), <b>cộng 1</b>, ghi lại.<br>• Chạy tay với <code>\"abca\"</code>: a → {a:1}; b → {a:1, b:1}; c → {a:1, b:1, c:1}; a → {a:2, b:1, c:1}. Nên <code>d[\"a\"]</code> là 2.<br><b>Lỗi hay gặp:</b> viết <code>d[ch] = d[ch] + 1</code> hoặc <code>d[ch] += 1</code> khi khóa chưa có: gặp chữ đầu tiên là <code>KeyError</code>. Quên <b>+ 1</b> (chỉ ghi lại số cũ) nên không đếm được gì.<br><b>Mẹo:</b> tự hỏi \"lần đầu gặp chữ này thì d.get(ch, 0) ra mấy?\" Ra 0, cộng 1 thành 1."
  },
{
    id: "tp",
    t: "Hai con trỏ: trái và phải",
    steps: [
      {
        k: "input",
        q: "Mảng có 5 hộp. i = 0 (đầu), j = len(a) - 1 (cuối). j bằng mấy?",
        a: 4,
        h: "len(a) là 5.",
        s: "j = 5 - 1 = 4."
      },
      {
        k: "input",
        q: "<pre class=\"out\">a = [1, 2, 3, 4]\ni = 0\nj = 3\na[i], a[j] = a[j], a[i]\nprint(a[0])</pre>In ra số mấy?",
        a: 4,
        h: "Hai hộp đổi chỗ cho nhau.",
        s: "a[0] và a[3] đổi chỗ nên a[0] = 4."
      },
      {
        k: "choice",
        q: "Đổi chỗ xong, hai con trỏ nên làm gì để xét cặp tiếp theo?",
        o: ["i tăng 1, j giảm 1","i giảm 1, j tăng 1","Giữ nguyên"],
        a: 0,
        h: "Hai con trỏ tiến vào giữa.",
        s: "Hai đầu tiến dần vào giữa."
      }
    ],
    dr: "swap",
    note: "<b>Hai con trỏ: một đứng đầu, một đứng cuối, cùng tiến vào giữa.</b><pre>a = [1, 2, 3, 4]\ni = 0\nj = len(a) - 1             # 3\na[i], a[j] = a[j], a[i]   # đổi chỗ hai hộp\ni = i + 1\nj = j - 1\nprint(a)                  # [4, 2, 3, 1]</pre>• \"Con trỏ\" ở đây chỉ là hai biến lưu <b>chỉ số</b>: <code>i</code> ở đầu (0), <code>j</code> ở cuối (<code>len(a) - 1</code>, không phải <code>len(a)</code>).<br>• <code>a[i], a[j] = a[j], a[i]</code> đổi chỗ hai hộp trong một dòng.<br>• Sau khi xử lý xong một cặp: <b><code>i</code> tăng 1, <code>j</code> giảm 1</b>, hai đầu tiến dần vào giữa.<br>• Làm tiếp với cặp mới: hộp 1 và hộp 2 đổi chỗ, ra <code>[4, 3, 2, 1]</code>. Khi <code>i</code> gặp hoặc vượt <code>j</code> thì dừng (đã đi hết).<br><b>Lỗi hay gặp:</b> đặt <code>j = len(a)</code> (vượt hộp cuối); cho <code>i</code> và <code>j</code> cùng tăng nên không bao giờ gặp nhau; đổi chỗ bằng hai dòng gán liền nhau làm mất một giá trị.<br><b>Mẹo:</b> vẽ hàng hộp, đặt hai ngón tay ở hai đầu, nhích từng bước."
  },
{
    id: "stk",
    t: "Stack: vào sau, ra trước",
    steps: [
      {
        k: "choice",
        q: "Chồng đĩa: đĩa nào được lấy ra trước?",
        o: ["Đĩa đặt vào sau cùng","Đĩa đặt vào đầu tiên"],
        a: 0,
        h: "Bạn lấy đĩa ở trên cùng.",
        s: "Stack lấy phần tử đặt vào sau cùng."
      },
      {
        k: "input",
        q: "<pre class=\"out\">push(3)\npush(5)\npush(8)\npop()</pre>pop() trả về số mấy?",
        a: 8,
        h: "Số nào được đặt vào sau cùng?",
        s: "8 vào sau cùng nên ra trước."
      },
      {
        k: "input",
        q: "<pre class=\"out\">push(3)\npush(5)\npush(8)\npop()\npop()</pre>pop() lần thứ hai trả về số mấy?",
        a: 5,
        h: "Sau lần pop đầu, trên cùng là số nào?",
        s: "Sau khi lấy 8, trên cùng là 5."
      }
    ],
    dr: "stk",
    note: "<b>Stack (chồng): vào sau, ra trước.</b> Giống chồng đĩa: đĩa đặt lên sau cùng nằm trên cùng, nên được lấy ra đầu tiên.<pre>push(3)    # chồng: 3\npush(5)    # chồng: 3, 5\npush(8)    # chồng: 3, 5, 8   (8 ở trên cùng)\npop()      # trả về 8, chồng: 3, 5\npop()      # trả về 5, chồng: 3</pre>• <code>push(x)</code>: đặt <code>x</code> lên <b>trên cùng</b>.<br>• <code>pop()</code>: lấy ra và trả về phần tử <b>trên cùng</b>. Chỉ làm việc ở một đầu.<br>• Quy tắc gọi tắt là <b>LIFO</b> (last in, first out): vào sau cùng, ra đầu tiên.<br><b>Lỗi hay gặp:</b> tưởng <code>pop()</code> lấy phần tử đầu tiên bỏ vào (đó là việc của queue); pop khi chồng đang rỗng (là lỗi).<br><b>Dùng ở đâu:</b> nút \"hoàn tác\" (undo), kiểm tra ngoặc đóng mở khớp nhau.<br><b>Mẹo:</b> hỏi \"cái nào mình đặt vào SAU CÙNG?\" Đó là cái ra trước."
  },
{
    id: "que",
    t: "Queue: vào trước, ra trước",
    steps: [
      {
        k: "choice",
        q: "Xếp hàng mua vé: ai được phục vụ trước?",
        o: ["Người đến trước","Người đến sau cùng"],
        a: 0,
        h: "Người đứng đầu hàng.",
        s: "Queue lấy phần tử vào trước."
      },
      {
        k: "input",
        q: "<pre class=\"out\">enqueue(3)\nenqueue(5)\nenqueue(8)\ndequeue()</pre>dequeue() trả về số mấy?",
        a: 3,
        h: "Ai đứng đầu hàng?",
        s: "3 vào đầu tiên nên ra đầu tiên."
      },
      {
        k: "input",
        q: "<pre class=\"out\">enqueue(3)\nenqueue(5)\nenqueue(8)\ndequeue()\ndequeue()</pre>dequeue() lần thứ hai trả về?",
        a: 5,
        h: "Sau khi 3 đi, ai đứng đầu?",
        s: "Tiếp theo là 5."
      }
    ],
    dr: "que",
    note: "<b>Queue (hàng đợi): vào trước, ra trước.</b> Giống xếp hàng mua vé: ai đến trước thì được phục vụ trước.<pre>enqueue(3)    # hàng: 3\nenqueue(5)    # hàng: 3, 5\nenqueue(8)    # hàng: 3, 5, 8   (3 đứng đầu hàng)\ndequeue()     # trả về 3, hàng: 5, 8\ndequeue()     # trả về 5, hàng: 8</pre>• <code>enqueue(x)</code>: cho <code>x</code> đứng vào <b>cuối</b> hàng.<br>• <code>dequeue()</code>: lấy ra và trả về phần tử <b>đầu</b> hàng.<br>• Quy tắc gọi tắt là <b>FIFO</b> (first in, first out).<br><b>So với stack:</b> cùng dữ liệu 3, 5, 8 thì stack lấy ra 8 trước, queue lấy ra 3 trước. Khác nhau ở <b>đầu nào được lấy</b>.<br><b>Lỗi hay gặp:</b> lẫn <code>dequeue</code> với <code>pop</code> của stack; quên rằng phần tử mới luôn vào cuối.<br><b>Dùng ở đâu:</b> hàng chờ công việc (job queue), giới hạn tốc độ gọi API.<br><b>Mẹo:</b> hỏi \"ai đến sớm nhất mà chưa được phục vụ?\" Đó là người ra trước."
  },
{
    id: "bs",
    t: "Chia đôi (tìm nhị phân)",
    steps: [
      {
        k: "input",
        q: "Mảng đã sắp xếp có 7 hộp, chỉ số 0 đến 6. Hộp giữa có chỉ số (0 + 6) // 2 bằng mấy?",
        a: 3,
        h: "(0 + 6) chia 2.",
        s: "Hộp giữa là chỉ số 3."
      },
      {
        k: "choice",
        q: "a = [1,3,5,7,9,11,13], tìm 11. Hộp giữa chứa 7. Bỏ nửa nào?",
        o: ["Bỏ nửa trái (vì 11 > 7, mảng tăng dần)","Bỏ nửa phải"],
        a: 0,
        h: "Mảng tăng dần: số lớn hơn 7 nằm bên nào?",
        s: "11 lớn hơn 7 nên chỉ có thể ở nửa phải."
      },
      {
        k: "choice",
        q: "Mỗi lần chia đôi, số hộp còn lại thế nào?",
        o: ["Giảm một nửa","Giảm 1","Không đổi"],
        a: 0,
        h: "Bỏ cả một nửa chỉ bằng một lần xem.",
        s: "Mỗi lần bỏ đi một nửa."
      }
    ],
    dr: "bs",
    note: "<b>Chia đôi: mỗi lần nhìn một hộp giữa, bỏ ngay một nửa.</b><br><b>Điều kiện bắt buộc: mảng phải đã sắp xếp.</b> Chia đôi dựa vào việc \"nhỏ hơn thì ở bên trái, lớn hơn thì ở bên phải\".<pre>a = [1, 3, 5, 7, 9, 11, 13]   # chỉ số 0 đến 6, tìm 11\nlo = 0, hi = 6\nmid = (0 + 6) // 2 = 3        # a[3] = 7;  11 &gt; 7  → bỏ nửa trái, lo = 4\nmid = (4 + 6) // 2 = 5        # a[5] = 11; trúng, trả về chỉ số 5</pre>• Hộp giữa của chỉ số <code>lo</code> đến <code>hi</code> là <code>(lo + hi) // 2</code> (<code>//</code> là chia lấy phần nguyên).<br>• So sánh số cần tìm với hộp giữa: nhỏ hơn thì chỉ có thể ở <b>nửa trái</b>, lớn hơn thì chỉ có thể ở <b>nửa phải</b>, bằng thì xong.<br>• Mỗi lần <b>số hộp còn lại giảm một nửa</b>. Đó là lý do nó nhanh: một triệu hộp chỉ cần khoảng 20 lần xem (vì 2<sup>20</sup> ≈ một triệu).<br><b>Lỗi hay gặp:</b> dùng trên mảng chưa sắp xếp (kết quả sai mà không báo lỗi); bỏ nhầm nửa; quên rằng hộp giữa đã xét rồi nên nửa mới phải loại nó ra.<br><b>Mẹo:</b> trước khi bỏ một nửa, hỏi \"số cần tìm chắc chắn KHÔNG nằm ở nửa này vì sao?\""
  },
{
    id: "bub",
    t: "Sắp xếp nổi bọt: một lượt",
    steps: [
      {
        k: "choice",
        q: "Nổi bọt so sánh hai hộp cạnh nhau. Nếu bên trái lớn hơn bên phải thì làm gì?",
        o: ["Đổi chỗ","Giữ nguyên"],
        a: 0,
        h: "Ta muốn số lớn đi về cuối.",
        s: "Trái lớn hơn phải thì đổi chỗ."
      },
      {
        k: "input",
        q: "<pre class=\"out\">a = [3, 1, 2]\nif a[0] > a[1]:\n    a[0], a[1] = a[1], a[0]\nprint(a[0])</pre>In ra số mấy?",
        a: 1,
        h: "3 có lớn hơn 1 không? Nếu có thì đổi chỗ.",
        s: "Đổi chỗ nên a[0] = 1."
      },
      {
        k: "choice",
        q: "Sau một lượt đi hết mảng, số lớn nhất ở đâu?",
        o: ["Ở cuối mảng","Ở đầu mảng","Không biết"],
        a: 0,
        h: "Số lớn cứ bị đẩy sang phải.",
        s: "Số lớn nhất được đẩy về cuối."
      }
    ],
    dr: "bub",
    note: "<b>Nổi bọt: so sánh hai hộp cạnh nhau, trái lớn hơn phải thì đổi chỗ.</b><pre>a = [3, 1, 2]\n# so hộp 0 và hộp 1: 3 &gt; 1 → đổi   → [1, 3, 2]\n# so hộp 1 và hộp 2: 3 &gt; 2 → đổi   → [1, 2, 3]</pre>• Một <b>lượt</b> là đi từ đầu đến cuối mảng, mỗi bước so một cặp cạnh nhau.<br>• Số lớn nhất bị đổi chỗ liên tục nên được <b>đẩy dần về cuối</b> mảng. Sau một lượt, số lớn nhất đã ở đúng chỗ.<br>• Nhưng <b>một lượt chưa chắc sắp xếp xong</b> cả mảng. Ví dụ <code>[3, 2, 1]</code>: sau một lượt là <code>[2, 1, 3]</code>. Số 3 đã đúng chỗ, còn 2 và 1 vẫn lộn. Cần lặp thêm lượt nữa.<br><b>Lỗi hay gặp:</b> đổi chỗ khi hai số bằng nhau (không cần); so hộp cuối với hộp không tồn tại (<code>IndexError</code>); tưởng một lượt là xong.<br><b>Mẹo:</b> chạy tay một lượt trên giấy, ghi lại mảng sau mỗi lần so. Sau một lượt, nhìn xem số lớn nhất đã ở cuối chưa."
  }
];
