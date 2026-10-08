import type { RichLesson } from './lesson-types';

export const KINDERGARTEN_2_LESSONS: RichLesson[] = [
{
    id: "k6",
    t: "Nếu... thì...",
    steps: [
      {
        k: "choice",
        q: "Luật: nếu trời mưa thì mang ô. Hôm nay trời mưa. Em làm gì?",
        o: ["Mang ô","Không mang ô"],
        a: 0,
        h: "Điều kiện 'trời mưa' có xảy ra không?",
        s: "Điều kiện đúng thì làm việc đó."
      },
      {
        k: "choice",
        q: "Luật mới: nếu trời mưa thì mang ô, nếu không thì đội mũ. Hôm nay trời nắng. Em làm gì?",
        o: ["Đội mũ","Mang ô"],
        a: 0,
        h: "Trời mưa không? Vậy chạy vế nào?",
        s: "Điều kiện sai thì chạy vế 'nếu không'. Sau này gọi là if và else."
      },
      {
        k: "choice",
        q: "Luật: nếu điểm lớn hơn 5 thì 'đạt', nếu không thì 'chưa đạt'. Điểm là 8. Kết quả?",
        o: ["đạt","chưa đạt"],
        a: 0,
        h: "8 lớn hơn 5 không?",
        s: "Đạt."
      },
      {
        k: "choice",
        q: "Cùng luật đó, điểm là 5. Kết quả?",
        o: ["chưa đạt, vì 5 không lớn hơn 5","đạt"],
        a: 0,
        h: "Nhớ bài trước: 5 > 5 đúng hay sai?",
        s: "Đây là ca biên: đúng bằng ngưỡng. Luật 'lớn hơn' khác với 'lớn hơn hoặc bằng'."
      },
      {
        k: "choice",
        q: "Luật sửa lại: nếu điểm lớn hơn hoặc bằng 5 thì 'đạt'. Điểm 5 thì sao?",
        o: ["đạt","chưa đạt"],
        a: 0,
        h: "Bằng 5 có thỏa 'lớn hơn hoặc bằng 5' không?",
        s: "Đạt. Một chữ trong luật đổi thì kết quả đổi."
      }
    ],
    note: "<b>Nếu... thì...</b>: máy kiểm tra một điều kiện rồi chọn việc để làm.<br>• Điều kiện <b>đúng</b> → làm việc ở vế \"thì\".<br>• Điều kiện <b>sai</b> → làm việc ở vế \"nếu không\". (Sau này gọi là <code>if</code> và <code>else</code>.)<br><b>Ca biên:</b> khi giá trị đúng bằng ngưỡng. \"Lớn hơn 5\" khác \"lớn hơn hoặc bằng 5\": với đúng 5, câu đầu sai, câu sau đúng. Một chữ trong luật đổi thì kết quả đổi."
  },
{
    id: "k7",
    t: "Lặp lại, và phải biết dừng",
    steps: [
      {
        k: "input",
        q: "Em vỗ tay 3 lần. Tổng cộng em vỗ tay mấy cái?",
        a: 3,
        h: "Mỗi lần một cái.",
        s: "3 cái."
      },
      {
        k: "input",
        q: "Lặp 4 lần việc: 'thêm 2 viên bi vào hộp'. Hộp ban đầu rỗng. Cuối cùng có mấy viên bi?",
        a: 8,
        h: "2, rồi 4, rồi 6, rồi...",
        s: "2 + 2 + 2 + 2 = 8."
      },
      {
        k: "choice",
        q: "Lặp việc 'cắn một miếng bánh' cho đến khi hết bánh. Bánh có 5 miếng. Em cắn mấy lần?",
        o: ["5 lần","1 lần","Mãi mãi"],
        a: 0,
        h: "Mỗi lần mất một miếng.",
        s: "Cắn 5 lần thì hết."
      },
      {
        k: "choice",
        q: "Cái bánh thần kỳ: cắn một miếng thì nó mọc lại miếng mới. Em lặp 'cắn cho đến khi hết bánh' thì sao?",
        o: ["Lặp mãi không dừng","Dừng sau 5 lần"],
        a: 0,
        h: "Bánh có bao giờ hết không?",
        s: "Việc lặp phải làm cho điều kiện dừng tiến lại gần. Nếu không thì lặp vô hạn."
      },
      {
        k: "input",
        q: "Em đi từ số 1 lên số 6 bằng cách lặp 'cộng thêm 1'. Phải lặp mấy lần?",
        a: 5,
        h: "1 sang 2 là lần 1. Đếm tiếp tới 6.",
        s: "5 lần. Số lần lặp không phải lúc nào cũng bằng số cuối."
      }
    ],
    note: "<b>Lặp lại</b>: làm một việc nhiều lần, nhưng <b>phải biết dừng</b>.<br>• Mỗi vòng phải làm điều kiện dừng <b>tiến lại gần</b> hơn (ví dụ: bớt đi một quả táo, đếm thêm một lần). Nếu không thì lặp mãi không dừng.<br>• Số lần lặp không phải lúc nào cũng bằng \"số cuối\": đếm từ 1 đến 5 là lặp 5 lần, nhưng đếm 0, 1, 2 là lặp 3 lần.<br><b>Mẹo:</b> hỏi \"việc nào làm cho vòng lặp sắp dừng?\". Không trả lời được thì vòng lặp có nguy cơ vô hạn."
  },
{
    id: "k8",
    t: "Tìm quy luật",
    steps: [
      {
        k: "choice",
        q: "🔴 🔵 🔴 🔵 🔴 ?  Hình tiếp theo là gì?",
        o: ["🔵","🔴"],
        a: 0,
        h: "Nhìn xem điều gì lặp lại.",
        s: "Đỏ, xanh, đỏ, xanh... tiếp theo là xanh."
      },
      {
        k: "choice",
        q: "⭐ ⭐ 🌙 ⭐ ⭐ 🌙 ⭐ ⭐ ?  Hình tiếp theo?",
        o: ["🌙","⭐"],
        a: 0,
        h: "Cụm nào đang lặp lại?",
        s: "Cụm ⭐⭐🌙 lặp lại. Sau hai sao là trăng."
      },
      {
        k: "input",
        q: "2, 4, 6, 8, ?  Số tiếp theo?",
        a: 10,
        h: "Mỗi số hơn số trước bao nhiêu?",
        s: "Mỗi lần cộng 2."
      },
      {
        k: "input",
        q: "1, 2, 4, 8, ?  Số tiếp theo?",
        a: 16,
        h: "Mỗi số gấp mấy lần số trước?",
        s: "Mỗi lần nhân đôi."
      },
      {
        k: "choice",
        q: "Em 'tìm ra quy luật' khi nào?",
        o: ["Khi nhìn ra điều giống nhau lặp lại mỗi lần","Khi đoán may mắn"],
        a: 0,
        h: "Đoán đúng một lần thì có chắc là hiểu không?",
        s: "Thấy được cái lặp lại là bước đầu để viết thành lệnh cho máy."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Tự đặt một dãy có quy luật để bạn mình đoán. Viết dãy đó và viết ra quy luật của nó.",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Tìm quy luật: tìm cái lặp lại.</b><br>\n• Với hình: 🔴 🔵 🔴 🔵 🔴 ? → đỏ, xanh lặp lại nên tiếp theo là <b>xanh</b>. Với ⭐ ⭐ 🌙 ⭐ ⭐ 🌙 ⭐ ⭐ ? thì cả cụm \"hai sao, một trăng\" lặp lại, nên tiếp theo là <b>trăng</b>.<br>\n• Với số, hỏi: \"từ số này sang số kế, thêm bao nhiêu hoặc gấp mấy lần?\" Dãy 2, 4, 6, 8: mỗi lần <b>cộng 2</b> nên tiếp theo là 10. Dãy 1, 2, 4, 8: mỗi lần <b>nhân đôi</b> nên tiếp theo là 16.<br>\n• Quy luật tốt phải <b>đúng với mọi cặp liền nhau</b>, không chỉ cặp đầu.<br>\n<b>Lỗi hay gặp:</b> chốt quy luật khi mới nhìn hai số. Dãy 1, 2, 4 có thể là \"nhân đôi\" (tiếp theo là 8) hoặc \"cộng 1, rồi cộng 2, rồi cộng 3\" (tiếp theo là 7). Chỉ khi có thêm số mới biết cách nào đúng.<br>\n<b>Vì sao học bài này?</b> Thấy được cái lặp lại là bước đầu để viết thành lệnh cho máy: một việc lặp lại chính là một vòng lặp.<br>\n<b>Mẹo:</b> viết khoảng cách giữa các số liền nhau ra bên dưới (2, 2, 2 hoặc 1, 2, 4) rồi mới đoán."
  },
{
    id: "k9",
    t: "Cầu nối: nói chuyện với máy",
    steps: [
      {
        k: "choice",
        q: "Máy viết: x = 5.  Theo em, câu này đọc là gì?",
        o: ["Hộp tên x đang chứa số 5","x và 5 là hai bạn","Xóa x đi"],
        a: 0,
        h: "Nhớ bài cái tên và cái hộp.",
        s: "Máy dùng dấu = để bỏ một giá trị vào hộp có tên."
      },
      {
        k: "choice",
        q: "Máy viết: print(x).  'print' nghĩa là 'in ra cho em xem'. Máy sẽ làm gì?",
        o: ["Cho em xem thứ đang nằm trong hộp x","Xóa hộp x"],
        a: 0,
        h: "In ra là cho nhìn thấy.",
        s: "Máy cho ta xem giá trị trong hộp."
      },
      {
        k: "input",
        q: "Máy viết: x = 5, rồi dòng sau: x = 9.  Hộp x giờ chứa mấy?",
        a: 9,
        h: "Dòng sau đè lên dòng trước.",
        s: "Hộp giữ nguyên tên, thứ bên trong bị thay bằng 9."
      },
      {
        k: "choice",
        q: "Máy viết: a[0]. Nhớ bài thứ tự: số trong ngoặc là số người đứng trước. Vậy a[2] là bạn thứ mấy khi đếm như thường ngày?",
        o: ["Thứ ba","Thứ hai"],
        a: 0,
        h: "Có 2 bạn đứng trước thì mình là thứ mấy?",
        s: "a[2] là phần tử thứ ba. Giờ em đã sẵn sàng sang Python thật."
      }
    ],
    note: "<b>Cầu nối: máy viết gì thì đọc ra lời thường như thế.</b><pre>x = 5\nprint(x)        # 5\nx = 9\nprint(x)        # 9\na = [10, 20, 30]\nprint(a[2])     # 30</pre>\n• <code>x = 5</code> đọc là <b>\"bỏ số 5 vào hộp tên x\"</b>. Dấu <code>=</code> ở đây là một <b>lệnh bỏ vào</b>, không phải câu khẳng định \"x bằng 5\" như trong toán.<br>\n• <code>print(x)</code> nghĩa là \"in ra cho em xem thứ đang nằm trong hộp x\". Nó không đổi gì trong hộp.<br>\n• Dòng sau <code>x = 9</code> <b>thay thế</b> số cũ. Hộp x giờ chứa 9, số 5 không còn.<br>\n• <code>a[2]</code>: số trong ngoặc là <b>số người đứng trước</b> (xem bài thứ tự). Có 2 người đứng trước nên đó là phần tử <b>thứ ba</b> khi đếm thường ngày, ở đây là 30.<br>\n<b>Lỗi hay gặp:</b> tưởng hộp x giữ cả 5 lẫn 9; đọc <code>a[2]</code> thành \"phần tử thứ hai\"; tưởng <code>print(x)</code> làm x mất đi.<br>\n<b>Mẹo:</b> đọc từng dòng thành lời bằng đúng các từ \"bỏ vào hộp\", \"in ra\", \"đứng trước\". Đọc ra nghĩa thì mới viết và đọc được code."
  },
{
    id: "bx0",
    t: "Viết cũng có thứ tự: từ 1 + 1 = 2",
    steps: [
      {
        k: "build",
        q: "Em biết 'một cộng một bằng hai'. Giờ hãy VIẾT nó ra. Có 5 mảnh, mỗi chỗ có một vai trò (ghi dưới ô). Đặt từng mảnh vào ô.",
        h: "Đọc to câu bằng lời trước, rồi đặt từng mảnh vào đúng chỗ. Mỗi chỗ có một vai trò riêng.",
        s: "Đã ghép đúng: 1 + 1 = 2",
        tok: ["=","1","2","+","1"],
        ans: ["1","+","1","=","2"],
        roles: ["số thứ nhất","dấu phép tính","số thứ hai","dấu bằng","kết quả"],
        guided: 1,
        say: "một cộng một bằng hai",
        show: "1 + 1 = 2"
      },
      {
        k: "choice",
        q: "Ba bạn cùng viết 'một cộng một bằng hai'. Bạn nào viết đúng?",
        o: ["+ 1 + = 2","1 1 + = 2","1 + 1 = 2"],
        a: 2,
        h: "Đọc to từng dòng. Dòng nào đọc ra 'một cộng một bằng hai'?",
        s: "Cả ba bạn đều dùng đúng các mảnh, nhưng chỉ một dòng đúng thứ tự. Biết mảnh chưa đủ: còn phải biết mỗi chỗ cần mảnh gì."
      },
      {
        k: "build",
        q: "Lần này không có ghi chú vai trò. Tự đặt các mảnh để viết 'ba cộng bốn bằng bảy'. Có một mảnh thừa.",
        h: "Đọc to câu bằng lời trước, rồi đặt từng mảnh vào đúng chỗ. Mỗi chỗ có một vai trò riêng.",
        s: "Đã ghép đúng: 3 + 4 = 7",
        tok: ["7","=","-","4","3","+"],
        ans: ["3","+","4","=","7"],
        roles: null,
        guided: 0,
        say: "ba cộng bốn bằng bảy",
        show: "3 + 4 = 7"
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Tự nghĩ và viết ra: vì sao một bạn biết đủ các mảnh 1, +, =, 2 mà vẫn có thể viết sai? Để viết đúng, bạn ấy cần biết thêm những gì? (Đây cũng chính là điều bạn cần khi viết code.)",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Biết các mảnh chưa đủ, còn phải biết mỗi chỗ cần mảnh gì.</b><br>Viết \"một cộng một bằng hai\" cần đúng 5 mảnh theo đúng thứ tự: <code>số</code> <code>phép tính</code> <code>số</code> <code>dấu bằng</code> <code>kết quả</code>.<pre>1 + 1 = 2     đúng: số, phép tính, số, bằng, kết quả\n1 + = 2       thiếu một số ở chỗ thứ ba\n1 1 + = 2     hai số đứng cạnh nhau, chưa có phép tính ở giữa</pre>• Ba dòng dùng <b>cùng các mảnh</b>, nhưng chỉ dòng đầu đúng. Lỗi nằm ở <b>thứ tự và vai trò</b>, không phải ở việc thiếu mảnh.<br>• Khi có mảnh thừa, đó là bẫy: hỏi \"chỗ nào còn trống, chỗ đó cần loại mảnh gì?\" rồi mới chọn.<br><b>Vì sao học bài này?</b> Code cũng vậy. Bạn hiểu \"cộng dồn vào tổng\" nhưng vẫn có thể viết sai thứ tự các mảnh. Từ đây trở đi, mỗi lần viết một dòng, hãy hỏi: mỗi chỗ trong dòng này giữ vai trò gì?<br><b>Mẹo:</b> đọc to dòng vừa viết bằng lời thường. Đọc không ra nghĩa thì thứ tự đang sai."
  }
];
