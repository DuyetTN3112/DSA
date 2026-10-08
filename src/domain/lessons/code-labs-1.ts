import type { RichLesson } from './lesson-types';

export const CODE_LABS_1_LESSONS: RichLesson[] = [
{
    id: "b1",
    t: "Ghép câu lệnh: hộp, tính toán, in ra",
    steps: [
      {
        k: "choice",
        q: "Python đọc 'bỏ số 5 vào hộp tên x' và viết là x = 5. Ở bên TRÁI dấu = là gì?",
        o: ["Tên hộp","Số để bỏ vào"],
        a: 0,
        h: "Nhớ bài cái tên và cái hộp: tên nằm ở đâu?",
        s: "Bên trái là tên hộp, bên phải là thứ bỏ vào."
      },
      {
        k: "build",
        q: "Ghép câu lệnh 'bỏ 5 vào hộp x'.",
        h: "Đọc to câu bằng lời trước, rồi đặt từng mảnh vào đúng chỗ. Mỗi chỗ có một vai trò riêng.",
        s: "Đã ghép đúng: x = 5",
        tok: ["5","=","x"],
        ans: ["x","=","5"],
        roles: ["tên hộp","dấu gán (bỏ vào)","giá trị"],
        guided: 1,
        say: "bỏ 5 vào hộp x",
        show: "x = 5"
      },
      {
        k: "choice",
        q: "Dòng nào Python hiểu?",
        o: ["5 = x","x = 5","x 5 ="],
        a: 1,
        h: "Đọc to theo vai trò: bên trái phải là tên hộp.",
        s: "Không thể đặt tên hộp là số 5. Vai trò từng chỗ cố định."
      },
      {
        k: "build",
        q: "Ghép: 'lấy x cộng 2, bỏ vào hộp y'.",
        h: "Đọc to câu bằng lời trước, rồi đặt từng mảnh vào đúng chỗ. Mỗi chỗ có một vai trò riêng.",
        s: "Đã ghép đúng: y = x + 2",
        tok: ["+","2","=","y","x"],
        ans: ["y","=","x","+","2"],
        roles: ["tên hộp nhận kết quả","dấu gán","hộp cần đọc","phép cộng","số cộng thêm"],
        guided: 1,
        say: "bỏ (x cộng 2) vào hộp y",
        show: "y = x + 2"
      },
      {
        k: "build",
        q: "Không còn ghi chú. Ghép: 'tăng hộp x lên 1' (lấy x cộng 1, bỏ lại vào chính hộp x).",
        h: "Đọc to câu bằng lời trước, rồi đặt từng mảnh vào đúng chỗ. Mỗi chỗ có một vai trò riêng.",
        s: "Đã ghép đúng: x = x + 1",
        tok: ["x","=","1","+","x"],
        ans: ["x","=","x","+","1"],
        roles: null,
        guided: 0,
        say: "bỏ (x cộng 1) vào hộp x",
        show: "x = x + 1"
      },
      {
        k: "build",
        q: "Ghép lệnh in giá trị trong hộp x ra màn hình.",
        h: "Đọc to câu bằng lời trước, rồi đặt từng mảnh vào đúng chỗ. Mỗi chỗ có một vai trò riêng.",
        s: "Đã ghép đúng: print ( x )",
        tok: ["(",")","print","x"],
        ans: ["print","(","x",")"],
        roles: ["lệnh 'in ra'","mở ngoặc","thứ muốn in","đóng ngoặc"],
        guided: 1,
        say: "in giá trị của x",
        show: "print ( x )"
      },
      {
        k: "choice",
        q: "Em quên dấu ) cuối dòng print(x. Python làm gì?",
        o: ["Báo SyntaxError: ngoặc mở mà chưa đóng, Python chưa hiểu câu","Vẫn chạy bình thường"],
        a: 0,
        h: "Mở ngoặc thì phải đóng.",
        s: "Mỗi ngoặc mở cần một ngoặc đóng. Thiếu là SyntaxError."
      }
    ],
    note: "<b>Mỗi chỗ trong một dòng lệnh có một vai trò cố định.</b><pre>x = 5\ny = x + 2\nx = x + 1\nprint(x)     # 6\nprint(y)     # 7</pre>\n• Trong <code>x = 5</code>: bên <b>trái</b> dấu <code>=</code> là <b>tên hộp</b>, bên <b>phải</b> là <b>thứ bỏ vào</b>. Không đổi chỗ được: <code>5 = x</code> làm Python báo <code>SyntaxError</code> vì không thể đặt tên hộp là số 5.<br>\n• <code>y = x + 2</code>: lấy x (đang là 5) cộng 2, được 7, bỏ vào hộp y. Hộp x không đổi.<br>\n• <code>x = x + 1</code> trông lạ nhưng đọc được: <b>vế phải tính trước</b> (x cũ là 5, cộng 1 được 6), rồi mới bỏ kết quả vào hộp x. Nên x thành 6, còn y vẫn là 7.<br>\n• <code>print(x)</code>: mỗi ngoặc mở <code>(</code> cần đúng một ngoặc đóng <code>)</code>. Viết <code>print(x</code> thì Python báo <code>SyntaxError</code>.<br>\n<b>Lỗi hay gặp:</b> viết ngược hai vế; tưởng <code>x = x + 1</code> là vô lý như trong toán; tưởng <code>y = x + 2</code> làm y luôn đi theo x về sau (y đã chốt là 7, x đổi thì y không đổi theo).<br>\n<b>Mẹo:</b> trước khi viết, hỏi \"chỗ bên trái cần loại mảnh gì? chỗ bên phải cần loại mảnh gì?\". Viết xong thì đọc to thành lời: \"lấy x cộng 2, bỏ vào hộp y\"."
  },
{
    id: "b2",
    t: "Ghép if / else và vì sao phải thụt dòng",
    steps: [
      {
        k: "build",
        q: "Ghép dòng 'nếu n lớn hơn 3 thì'.",
        h: "Đọc to câu bằng lời trước, rồi đặt từng mảnh vào đúng chỗ. Mỗi chỗ có một vai trò riêng.",
        s: "Đã ghép đúng: if n &gt; 3 :",
        tok: [":","3",">","n","if"],
        ans: ["if","n",">","3",":"],
        roles: [
          "từ khóa 'nếu'",
          "thứ đem ra so",
          "dấu so sánh",
          "thứ để so",
          "dấu hai chấm: mở khối việc cần làm"
        ],
        guided: 1,
        say: "nếu n lớn hơn 3 thì",
        show: "if n > 3 :"
      },
      {
        k: "choice",
        q: "Dòng nào viết đúng?",
        o: ["if n > 3","if n > 3:","n > 3: if"],
        a: 1,
        h: "Cuối dòng if cần có gì?",
        s: "Dòng if luôn kết thúc bằng dấu hai chấm. Thiếu thì SyntaxError."
      },
      {
        k: "order",
        ph: "Ghép cả chương trình, từng dòng",
        q: "Chọn dòng tiếp theo, từ trên xuống. (Độ thụt dòng đã được viết sẵn, nhìn kỹ.)",
        s: "Đã ghép đúng cả khối if/else",
        items: [
          ["<code>if n &gt; 3:</code>","Chương trình bắt đầu bằng việc đặt câu hỏi nào?"],
          [
            "<code>&nbsp;&nbsp;&nbsp;&nbsp;print(\"A\")</code>",
            "Điều kiện đúng thì làm gì? Dòng này thuộc về if."
          ],
          ["<code>else:</code>","Điều kiện sai thì làm vế nào?"],
          ["<code>&nbsp;&nbsp;&nbsp;&nbsp;print(\"B\")</code>","Vế else làm gì?"]
        ]
      },
      {
        k: "choice",
        q: "Dòng print(\"A\") thụt vào 4 dấu cách. Thụt vào để làm gì?",
        o: ["Nói cho Python biết dòng này thuộc về if ở trên","Cho đẹp mắt"],
        a: 0,
        h: "Nếu không thụt, Python biết dòng nào thuộc if bằng cách nào?",
        s: "Python dùng độ thụt để biết dòng nào nằm trong khối nào. Đây là quy định, không chỉ để đẹp."
      }
    ],
    note: "<b>if / else và độ thụt dòng.</b><pre>if n &gt; 3:\n    print(\"A\")\nelse:\n    print(\"B\")</pre>• Dòng <code>if</code> (và <code>else</code>) <b>luôn kết thúc bằng dấu hai chấm</b> <code>:</code>. Thiếu thì Python báo <code>SyntaxError</code>.<br>• Các dòng <b>thụt vào 4 dấu cách</b> là khối việc thuộc về dòng ở ngay trên. Python dùng độ thụt để biết dòng nào nằm trong khối nào. Đây là <b>quy định</b>, không phải để cho đẹp.<br>• Chỉ <b>một</b> trong hai khối chạy: điều kiện đúng thì khối <code>if</code>, sai thì khối <code>else</code>.<br><b>Lỗi hay gặp:</b> quên dấu <code>:</code>; quên thụt dòng (Python báo lỗi); thụt không đều giữa các dòng của cùng một khối.<br><b>Mẹo:</b> nhìn thẳng cột. Hai dòng cùng khối thì thẳng hàng với nhau; dòng thuộc về <code>if</code> thì lùi vào so với <code>if</code>."
  },
{
    id: "b3",
    t: "Ghép vòng lặp và vị trí từng dòng",
    steps: [
      {
        k: "build",
        q: "Ghép dòng 'lặp, mỗi lần gọi số hiện tại là i, qua các số 0, 1, 2'.",
        h: "Đọc to câu bằng lời trước, rồi đặt từng mảnh vào đúng chỗ. Mỗi chỗ có một vai trò riêng.",
        s: "Đã ghép đúng: for i in range ( 3 ) :",
        tok: [":","3","range","(",")","in","i","for"],
        ans: ["for","i","in","range","(","3",")",":"],
        roles: [
          "từ khóa 'lặp'",
          "tên cho mỗi lần lặp",
          "từ khóa 'trong'",
          "tạo dãy số",
          "mở ngoặc",
          "số lần",
          "đóng ngoặc",
          "dấu hai chấm"
        ],
        guided: 1,
        say: "lặp, i đi qua các số từ range(3)",
        show: "for i in range ( 3 ) :"
      },
      {
        k: "order",
        ph: "Ghép cả chương trình, từng dòng",
        q: "Chương trình cộng 0 + 1 + 2 + 3 rồi in tổng. Chọn dòng tiếp theo.",
        s: "Đã ghép đúng chương trình tính tổng",
        items: [
          ["<code>total = 0</code>","Tờ giấy ghi tổng phải có từ lúc nào?"],
          ["<code>for i in range(4):</code>","Có tờ giấy rồi thì làm gì?"],
          [
            "<code>&nbsp;&nbsp;&nbsp;&nbsp;total = total + i</code>",
            "Mỗi vòng làm gì? Dòng này thuộc về for."
          ],
          ["<code>print(total)</code>","Lặp xong thì làm gì?"]
        ]
      },
      {
        k: "choice",
        q: "Vì sao total = 0 nằm TRÊN vòng for, không nằm trong vòng for?",
        o: ["Nếu nằm trong, mỗi vòng lại đặt về 0 và mất tổng đã cộng","Cho đẹp mắt"],
        a: 0,
        h: "Thử chạy vòng 2 nếu mỗi vòng đều đặt total về 0.",
        s: "Việc chuẩn bị làm một lần, trước khi lặp."
      }
    ],
    note: "<b>Vòng lặp: viết đúng dòng và đặt đúng chỗ.</b><pre>total = 0\nfor i in range(3):\n    total = total + i\nprint(total)</pre>• <code>for i in range(3):</code> nghĩa là: lặp lại, mỗi lần gọi số hiện tại là <code>i</code>, qua các số <b>0, 1, 2</b> (3 lần, không có 3).<br>• Dòng nằm <b>thụt vào</b> dưới <code>for</code> chạy ở <b>mỗi vòng</b>; dòng thẳng hàng với <code>for</code> chạy một lần khi vòng đã xong.<br>• Chạy tay: total = 0; i = 0 → 0; i = 1 → 1; i = 2 → 3. In ra 3.<br><b>Vì sao <code>total = 0</code> nằm TRÊN vòng for?</b> Việc chuẩn bị chỉ làm <b>một lần</b>, trước khi lặp. Nếu nằm trong vòng, mỗi vòng lại đặt về 0 và mất tổng đã cộng.<br><b>Mẹo:</b> với mỗi dòng, hỏi \"dòng này chạy một lần hay mỗi vòng?\" Câu trả lời nằm ở độ thụt."
  }
];
