import type { RichLesson } from './lesson-types';

export const PYTHON_BASICS_LESSONS: RichLesson[] = [
{
    id: "p1",
    t: "Biến là cái hộp có tên",
    steps: [
      {
        k: "input",
        q: "Python chạy từng dòng từ trên xuống. Dòng đầu tạo hộp tên x và bỏ số 5 vào.<pre class=\"out\">x = 5\ny = x + 2</pre>y bằng mấy?",
        a: 7,
        h: "Lấy số trong hộp x rồi cộng 2.",
        s: "y = 5 + 2 = 7."
      },
      {
        k: "input",
        q: "<pre class=\"out\">x = 5\nx = 8</pre>Bây giờ hộp x chứa số mấy?",
        a: 8,
        h: "Dòng sau đè lên dòng trước.",
        s: "Gán lại thì giá trị cũ bị thay."
      },
      {
        k: "choice",
        q: "Dấu = trong Python nghĩa là gì?",
        o: [
          "Hai bên bằng nhau như trong toán",
          "Bỏ giá trị bên phải vào hộp bên trái",
          "So sánh hai số"
        ],
        a: 1,
        h: "Nhớ hộp x và số 5: số được bỏ vào hộp.",
        s: "= là phép gán."
      }
    ],
    dr: "asg",
    note: "<b>Biến là cái hộp có tên.</b><pre>x = 5      # đặt 5 vào hộp tên x\ny = x + 2  # lấy số đang ở hộp x, cộng 2, đặt vào hộp y\nx = 9      # gán lại: số cũ trong hộp x bị thay</pre>• <code>=</code> là <b>phép gán</b>, đọc là \"đặt vào\", không phải \"bằng nhau\" như trong toán.<br>• Vế phải được tính xong trước, rồi mới đặt vào hộp bên trái.<br>• Gán lại thì giá trị cũ <b>mất</b>.<br><b>Mẹo:</b> sau mỗi dòng, viết ra giá trị của mọi hộp. Dòng 3 ở trên: x = 9, y vẫn là 7 (y không tự đổi theo x)."
  },
{
    id: "p2",
    t: "Điều kiện if / else",
    steps: [
      {
        k: "choice",
        q: "<pre class=\"out\">if 7 > 5:\n    print(\"A\")\nelse:\n    print(\"B\")</pre>In ra chữ nào?",
        o: ["A","B","Cả hai"],
        a: 0,
        h: "7 có lớn hơn 5 không? Đúng thì chạy phần if.",
        s: "7 > 5 đúng nên in A."
      },
      {
        k: "choice",
        q: "<pre class=\"out\">if 3 > 5:\n    print(\"A\")\nelse:\n    print(\"B\")</pre>In ra chữ nào?",
        o: ["A","B","Cả hai"],
        a: 1,
        h: "3 có lớn hơn 5 không?",
        s: "Sai nên chạy else: in B."
      },
      {
        k: "choice",
        q: "Dòng thụt vào 4 dấu cách thuộc về đâu?",
        o: ["Thuộc if ngay phía trên","Luôn luôn chạy","Bị bỏ qua"],
        a: 0,
        h: "Python dùng thụt dòng để biết dòng nào nằm trong if.",
        s: "Thụt dòng cho biết nó nằm trong khối if."
      }
    ],
    dr: "cond",
    note: "<b>if / else</b>: chọn một trong hai đường.<pre>if n > 5:\n    print(\"A\")\nelse:\n    print(\"B\")</pre>• Điều kiện đúng → chạy khối <code>if</code>; sai → chạy khối <code>else</code>. Chỉ một khối chạy.<br>• <b>Thụt dòng</b> (4 dấu cách) cho biết dòng nào nằm trong khối. Dấu <code>:</code> cuối dòng <code>if</code> và <code>else</code> là bắt buộc.<br>• So sánh: <code>&gt;</code> lớn hơn, <code>&gt;=</code> lớn hơn hoặc bằng, <code>==</code> bằng nhau (hai dấu bằng; một dấu bằng là phép gán).<br><b>Ca biên:</b> luôn thử đúng bằng ngưỡng."
  },
{
    id: "p3",
    t: "Vòng lặp for",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">for i in range(3):\n    print(i)</pre>Có bao nhiêu dòng được in ra?",
        a: 3,
        h: "range(3) cho ra 3 số: 0, 1, 2.",
        s: "Lặp 3 lần."
      },
      {
        k: "input",
        q: "Dòng cuối cùng in ra số mấy?",
        a: 2,
        h: "Các số là 0, 1, 2. Số nào là cuối?",
        s: "range(3) là 0, 1, 2 (không có 3)."
      },
      {
        k: "input",
        q: "<pre class=\"out\">t = 0\nfor i in range(4):\n    t = t + i</pre>Cuối cùng t bằng mấy?",
        a: 6,
        h: "i là 0, 1, 2, 3. Cộng dần.",
        s: "0 + 1 + 2 + 3 = 6."
      }
    ],
    dr: "loop",
    note: "<b>Vòng lặp for</b>: chạy lại một khối lệnh nhiều lần.<pre>for i in range(3):\n    print(i)      # in 0, 1, 2</pre>• <code>range(3)</code> cho ra <b>0, 1, 2</b> (không có 3): <code>range(n)</code> là n số, từ 0 đến n - 1.<br>• Các dòng <b>thụt vào</b> dưới <code>for</code> là việc làm lại mỗi vòng. Dòng không thụt chạy một lần sau khi vòng lặp kết thúc.<br>• Mỗi vòng, <code>i</code> là hộp mang giá trị tiếp theo.<br><b>Mẹo:</b> kẻ bảng: vòng 1: i = 0, vòng 2: i = 1... rồi ghi giá trị các biến ở cuối mỗi vòng."
  },
{
    id: "p4",
    t: "Hàm và return",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">def gap_doi(x):\n    return x * 2\nprint(gap_doi(4))</pre>In ra số mấy?",
        a: 8,
        h: "x nhận giá trị 4.",
        s: "4 * 2 = 8."
      },
      {
        k: "choice",
        q: "return làm gì?",
        o: ["Trả kết quả ra và dừng hàm","In ra màn hình","Lặp lại hàm"],
        a: 0,
        h: "Hàm là cái máy: bỏ vào, nhận ra.",
        s: "return đưa kết quả ra ngoài."
      },
      {
        k: "input",
        q: "<pre class=\"out\">def f(a, b):\n    return a - b\nprint(f(9, 4))</pre>In ra số mấy?",
        a: 5,
        h: "a = 9, b = 4.",
        s: "9 - 4 = 5."
      }
    ],
    dr: "fn",
    note: "<b>Hàm</b> là một đoạn lệnh có tên, nhận đầu vào và trả đầu ra.<pre>def gap_doi(x):\n    return x * 2\n\nprint(gap_doi(4))   # 8</pre>• <code>def</code> định nghĩa hàm; <code>x</code> là chỗ nhận đầu vào.<br>• <b><code>return</code> đưa kết quả ra ngoài</b> cho nơi gọi hàm, và kết thúc hàm ngay. Dòng nào nằm sau <code>return</code> sẽ không chạy.<br>• <code>print</code> chỉ hiện chữ lên màn hình, <b>không</b> đưa giá trị cho nơi gọi hàm. Muốn dùng kết quả tiếp thì phải <code>return</code>.<br>• Gọi hàm: <code>gap_doi(4)</code> chạy hàm với x = 4 và trả về 8."
  }
];
