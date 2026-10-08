import type { RichLesson } from './lesson-types';

export const RECURSION_LESSONS: RichLesson[] = [
{
    id: "r1",
    t: "Đệ quy: bài nhỏ hơn giống hệt bài lớn",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">def dem(n):\n    if n == 0:\n        return 0\n    return n + dem(n - 1)</pre>dem(0) trả về mấy?",
        a: 0,
        h: "Nhìn dòng if đầu tiên.",
        s: "n bằng 0 thì trả 0, không gọi tiếp."
      },
      {
        k: "input",
        q: "dem(1) = 1 + dem(0). Vậy dem(1) bằng mấy?",
        a: 1,
        h: "Thay dem(0) bằng kết quả bạn vừa tìm.",
        s: "1 + 0 = 1."
      },
      {
        k: "input",
        q: "dem(2) = 2 + dem(1). Vậy dem(2) bằng mấy?",
        a: 3,
        h: "Dùng kết quả dem(1).",
        s: "2 + 1 = 3."
      },
      {
        k: "input",
        q: "dem(3) = 3 + dem(2). Vậy dem(3) bằng mấy?",
        a: 6,
        h: "Dùng kết quả dem(2).",
        s: "3 + 3 = 6. Bài lớn được giải nhờ bài nhỏ hơn giống hệt."
      },
      {
        k: "choice",
        q: "Câu nào mô tả đệ quy đúng nhất?",
        o: ["Hàm tự gọi chính nó với bài toán nhỏ hơn","Hàm lặp bằng for","Hàm gọi hàm khác bất kỳ"],
        a: 0,
        h: "Nhìn lại dem(n) gọi dem(n - 1).",
        s: "Đệ quy: tự gọi mình với bài nhỏ hơn."
      }
    ],
    note: "<b>Đệ quy: một bài lớn được giải nhờ chính bài đó ở cỡ nhỏ hơn.</b><pre>def dem(n):\n    if n == 0:\n        return 0\n    return n + dem(n - 1)\nprint(dem(0))   # 0\nprint(dem(1))   # 1\nprint(dem(2))   # 3\nprint(dem(3))   # 6</pre>\n• Hàm gồm <b>hai phần</b>. <b>Ca cơ sở</b>: <code>n == 0</code> thì trả 0 ngay, không gọi tiếp. <b>Bước đệ quy</b>: <code>n + dem(n - 1)</code>, giao phần còn lại cho chính hàm với bài nhỏ hơn.<br>\n• Chạy tay từ nhỏ lên lớn: <code>dem(0) = 0</code>. <code>dem(1) = 1 + dem(0) = 1 + 0 = 1</code>. <code>dem(2) = 2 + dem(1) = 2 + 1 = 3</code>. <code>dem(3) = 3 + dem(2) = 3 + 3 = 6</code>.<br>\n• Ý tưởng cốt lõi: <b>tin rằng bài nhỏ hơn đã được giải đúng</b>, rồi chỉ cần nói cách ghép nó với phần của mình.<br>\n<b>Lỗi hay gặp:</b> không có ca cơ sở (xem bài sau); gọi lại hàm với bài <b>không nhỏ hơn</b> (<code>dem(n)</code> thay vì <code>dem(n - 1)</code>); quên <code>return</code> trước lời gọi đệ quy nên hàm trả về <code>None</code>.<br>\n<b>Mẹo:</b> viết ra bảng giá trị của vài bài nhỏ nhất (0, 1, 2) trước. Khi thấy mỗi giá trị được tính từ giá trị ngay trước nó, bạn đã thấy bước đệ quy."
  },
{
    id: "r2",
    t: "Ca cơ sở và thứ tự in ra",
    steps: [
      {
        k: "choice",
        q: "Nếu xóa dòng if n == 0 trong dem, chuyện gì xảy ra?",
        o: ["Gọi mãi không dừng, Python báo RecursionError","Trả về 0","Chạy bình thường"],
        a: 0,
        h: "Không có điểm dừng thì ai ngăn việc gọi tiếp?",
        s: "Thiếu ca cơ sở là lỗi đệ quy phổ biến nhất."
      },
      {
        k: "input",
        q: "<pre class=\"out\">def dd(n):\n    if n == 0:\n        print(\"xong\")\n        return\n    print(n)\n    dd(n - 1)</pre>Gọi dd(3). Dòng thứ 3 in ra số mấy?",
        a: 1,
        h: "In lần lượt: 3, 2, ...",
        s: "In ra 3, 2, 1, xong. Dòng 3 là 1."
      },
      {
        k: "input",
        q: "<pre class=\"out\">def e(n):\n    if n == 0:\n        return\n    e(n - 1)\n    print(n)</pre>Gọi e(3). Dòng đầu tiên in ra số mấy?",
        a: 1,
        h: "print nằm SAU lời gọi e(n - 1): phải chạy xuống tận đáy trước.",
        s: "In ra 1, 2, 3. print sau lời gọi thì in lúc quay về."
      },
      {
        k: "choice",
        q: "Hai hàm dd và e khác nhau ở đâu?",
        o: ["Chỗ đặt print: trước hay sau lời gọi đệ quy","Tên hàm","Không khác gì"],
        a: 0,
        h: "So sánh vị trí dòng print.",
        s: "Print trước: in lúc đi xuống. Print sau: in lúc đi lên."
      }
    ],
    note: "<b>Ca cơ sở là chỗ dừng; vị trí của print quyết định thứ tự in.</b><pre>def dd(n):\n    if n == 0:\n        print(\"xong\")\n        return\n    print(n)\n    dd(n - 1)\n\ndef e(n):\n    if n == 0:\n        return\n    e(n - 1)\n    print(n)\n\ndd(3)    # in ra: 3, 2, 1, xong\ne(3)     # in ra: 1, 2, 3</pre>\n• <b>Thiếu ca cơ sở</b> (xóa dòng <code>if n == 0</code>): hàm gọi mãi không dừng, đến khi Python báo <code>RecursionError</code>. Đây là lỗi đệ quy phổ biến nhất.<br>\n• <code>dd</code>: <b>print đứng trước</b> lời gọi nên in lúc đi xuống: 3, 2, 1, rồi \"xong\". Dòng thứ 3 là 1.<br>\n• <code>e</code>: <b>print đứng sau</b> lời gọi nên các lời gọi phải xuống tận đáy trước, rồi in lúc <b>quay về</b>: 1, 2, 3.<br>\n<b>Lỗi hay gặp:</b> tưởng hai hàm in giống nhau vì chỉ khác vị trí một dòng; quên <code>return</code> sau ca cơ sở nên hàm chạy tiếp xuống phần dưới.<br>\n<b>Mẹo:</b> với mỗi lời gọi, hỏi hai điều: \"việc gì làm TRƯỚC khi gọi xuống?\" và \"việc gì làm SAU khi quay về?\" Rồi chạy tay theo thứ tự đó."
  },
{
    id: "r3",
    t: "Mỗi lần gọi là một tầng",
    steps: [
      {
        k: "input",
        q: "dem(3) gọi dem(2), gọi dem(1), gọi dem(0). Tổng cộng có bao nhiêu lần gọi hàm (kể cả dem(3))?",
        a: 4,
        h: "Đếm: dem(3), dem(2), dem(1), dem(0).",
        s: "4 lần gọi, mỗi lần chiếm một tầng bộ nhớ."
      },
      {
        k: "input",
        q: "Gọi dem(1000) thì cần khoảng bao nhiêu tầng cùng lúc?",
        a: 1001,
        h: "n + 1 tầng: từ n xuống 0.",
        s: "n + 1 tầng. Tốn bộ nhớ O(n)."
      },
      {
        k: "choice",
        q: "Python mặc định giới hạn độ sâu đệ quy khoảng bao nhiêu?",
        o: ["Khoảng 1000","Vô hạn","Khoảng 10"],
        a: 0,
        h: "Gọi dem(100000) bạn nghĩ sẽ ra sao?",
        s: "Giới hạn mặc định khoảng 1000, vượt thì RecursionError."
      },
      {
        k: "choice",
        q: "Tính tổng 1..n, cách nào tiết kiệm bộ nhớ hơn?",
        o: ["Vòng for với một biến tổng","Đệ quy","Như nhau"],
        a: 0,
        h: "Vòng for có cần nhớ nhiều tầng không?",
        s: "Vòng lặp O(1) bộ nhớ. Đệ quy hữu ích khi bài toán tự chia nhỏ (cây, tổ hợp)."
      }
    ],
    note: "<b>Mỗi lần gọi là một tầng, và các tầng chồng lên nhau.</b><pre>def dem(n):\n    if n == 0:\n        return 0\n    return n + dem(n - 1)\nprint(dem(900))    # 405450</pre>\n• <code>dem(3)</code> gọi <code>dem(2)</code>, gọi <code>dem(1)</code>, gọi <code>dem(0)</code>: tổng cộng <b>4 lần gọi</b>, và cả 4 đang chờ cùng lúc (mỗi lần chiếm một tầng bộ nhớ). <code>dem(0)</code> trả về trước, rồi các tầng trên lần lượt hoàn thành.<br>\n• Gọi <code>dem(1000)</code> thì cần <b>1001 tầng</b> cùng lúc (n + 1). Bộ nhớ tăng theo n, tức O(n).<br>\n• Python giới hạn độ sâu đệ quy, thường là <b>khoảng 1000</b>. Vượt quá thì báo <code>RecursionError</code>. Vì vậy <code>dem(1000)</code> bị lỗi, còn <code>dem(900)</code> chạy được.<br>\n• Tính tổng 1..n bằng <b>vòng lặp</b> chỉ cần vài biến, tức O(1) bộ nhớ, tiết kiệm hơn. Đệ quy đáng dùng khi bài toán <b>tự chia nhỏ</b> (cây, thư mục, tổ hợp).<br>\n<b>Lỗi hay gặp:</b> dùng đệ quy cho bài chỉ cần vòng lặp rồi gặp <code>RecursionError</code> với n lớn; đếm thiếu một tầng (quên <code>dem(0)</code> cũng là một lần gọi).<br>\n<b>Mẹo:</b> số lần gọi = n + 1, không phải n. Giới hạn chính xác có thể khác tùy bản Python, nên đừng dựa vào con số 1000 để thiết kế."
  }
];
