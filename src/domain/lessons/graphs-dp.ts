import type { RichLesson } from './lesson-types';

export const GRAPHS_DP_LESSONS: RichLesson[] = [
{
    id: "g1",
    t: "Đồ thị: nút và đường nối",
    steps: [
      {
        k: "choice",
        q: "<pre class=\"out\">ban = {\"An\": [\"Binh\", \"Chi\"], \"Binh\": [\"An\", \"Dung\"], \"Chi\": [\"An\"], \"Dung\": [\"Binh\"]}\nprint(ban[\"Chi\"])</pre>In ra gì?",
        o: ["[\"An\"]","[\"Binh\", \"Dung\"]","\"Chi\""],
        a: 0,
        h: "ban[\"Chi\"] là danh sách bạn của Chi.",
        s: "Chi chỉ chơi với An."
      },
      {
        k: "input",
        q: "<pre class=\"out\">ban = {\"An\": [\"Binh\", \"Chi\"], \"Binh\": [\"An\", \"Dung\"], \"Chi\": [\"An\"], \"Dung\": [\"Binh\"]}\nprint(len(ban[\"An\"]))</pre>In ra mấy?",
        a: 2,
        h: "An có bao nhiêu bạn trong danh sách?",
        s: "An có hai bạn: Binh và Chi."
      },
      {
        k: "input",
        q: "Dung là bạn của mấy người?",
        a: 1,
        h: "Tìm tên Dung trong tất cả các danh sách.",
        s: "Chỉ Binh."
      },
      {
        k: "choice",
        q: "Binh có An trong danh sách và An cũng có Binh. Vì sao?",
        o: ["Quan hệ bạn bè hai chiều, nên ghi cả hai phía","Ghi nhầm","Vì Binh đứng trước An"],
        a: 0,
        h: "Nếu An là bạn của Binh thì Binh có là bạn của An không?",
        s: "Đây là đồ thị vô hướng: mỗi đường nối ghi hai lần."
      },
      {
        k: "input",
        q: "Có bao nhiêu đường nối (mỗi đường chỉ đếm một lần)? Đó là An-Binh, An-Chi, ...",
        a: 3,
        h: "Liệt kê từng cặp, đừng đếm trùng chiều ngược lại.",
        s: "An-Binh, An-Chi, Binh-Dung: 3 đường."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Tự giải thích: đồ thị khác cây ở điểm nào? (Gợi ý: một nút có thể nối với bao nhiêu nút? Có đường vòng quay lại không?)",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Đồ thị: các nút và các đường nối giữa chúng.</b> Cách ghi trong bài: mỗi nút ghi danh sách những nút nó nối tới.<pre>ban = {\"An\": [\"Binh\", \"Chi\"],\n       \"Binh\": [\"An\", \"Dung\"],\n       \"Chi\": [\"An\"],\n       \"Dung\": [\"Binh\"]}\nprint(ban[\"Chi\"])         # ['An']\nprint(len(ban[\"An\"]))     # 2</pre>• <code>ban[\"Chi\"]</code> là danh sách bạn của Chi. <code>len(ban[\"An\"])</code> là <b>số bạn</b> của An.<br>• Quan hệ bạn bè là <b>hai chiều</b> (đồ thị vô hướng): An là bạn của Binh thì Binh cũng là bạn của An, nên mỗi đường nối được <b>ghi hai lần</b>, một ở mỗi phía.<br>• Đếm đường nối: mỗi đường chỉ đếm <b>một lần</b>. Ở đây có An-Binh, An-Chi, Binh-Dung: <b>3 đường</b>. Cộng độ dài các danh sách (2 + 2 + 1 + 1 = 6) rồi chia 2 cũng ra 3.<br><b>Khác cây:</b> một nút có thể nối với <b>nhiều</b> nút, và đường nối có thể tạo thành <b>vòng</b> quay lại chỗ cũ; cây thì không có vòng.<br><b>Lỗi hay gặp:</b> đếm đường nối hai lần (ra 6); quên ghi cả hai phía khiến dữ liệu lệch.<br><b>Mẹo:</b> vẽ chấm cho nút và gạch cho đường nối, rồi đối chiếu với dict."
  },
{
    id: "g2",
    t: "BFS: đi từ gần tới xa bằng hàng đợi",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">ban = {\"An\": [\"Binh\", \"Chi\"], \"Binh\": [\"An\", \"Dung\"], \"Chi\": [\"An\"], \"Dung\": [\"Binh\"]}\nq = [\"An\"]\nseen = {\"An\"}\nwhile q:\n    x = q.pop(0)\n    print(x)\n    for y in ban[x]:\n        if y not in seen:\n            seen.add(y)\n            q.append(y)</pre>Có bao nhiêu dòng được in?",
        a: 4,
        h: "Mỗi người được lấy ra khỏi hàng đợi đúng một lần. Có mấy người?",
        s: "4 người, 4 dòng."
      },
      {
        k: "choice",
        q: "Dòng thứ 2 in ra tên ai?",
        o: ["Binh","Dung","Chi"],
        a: 0,
        h: "Sau An, hàng đợi có Binh, rồi Chi (theo thứ tự trong danh sách của An).",
        s: "Hàng đợi: vào trước ra trước. Binh vào trước Chi."
      },
      {
        k: "choice",
        q: "Dòng cuối cùng in ra tên ai?",
        o: ["Dung","Chi","Binh"],
        a: 0,
        h: "Dung chỉ được thêm vào hàng đợi khi Binh được xét.",
        s: "Thứ tự: An, Binh, Chi, Dung."
      },
      {
        k: "choice",
        q: "Vì sao cần tập seen?",
        o: ["Để không xét lại một người nhiều lần, tránh lặp vô hạn","Cho đẹp","Để đếm số người"],
        a: 0,
        h: "An là bạn của Binh, Binh là bạn của An. Không có seen thì sao?",
        s: "Đồ thị có đường vòng, không đánh dấu sẽ quay đi quay lại mãi."
      },
      {
        k: "input",
        q: "Dung cách An mấy bước (mấy đường nối trên đường ngắn nhất)?",
        a: 2,
        h: "An - Binh - Dung.",
        s: "2 bước. BFS xét theo từng lớp: cách 0, cách 1, cách 2."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Tự giải thích: vì sao dùng hàng đợi (vào trước ra trước) thì tự nhiên đi được từ gần tới xa? Nối với bài Queue.",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>BFS: đi từ gần tới xa, từng lớp một, bằng hàng đợi.</b><pre>ban = {\"An\": [\"Binh\", \"Chi\"], \"Binh\": [\"An\", \"Dung\"], \"Chi\": [\"An\"], \"Dung\": [\"Binh\"]}\nq = [\"An\"]\nseen = {\"An\"}\nwhile q:\n    x = q.pop(0)\n    print(x)\n    for y in ban[x]:\n        if y not in seen:\n            seen.add(y)\n            q.append(y)</pre>\n• <code>q</code> là <b>hàng đợi</b>: thêm vào cuối, lấy ra từ đầu (vào trước, ra trước, như bài Queue). <code>seen</code> là tập những người <b>đã được xếp vào hàng</b>.<br>\n• Chạy tay: q = [An]. Lấy An, in An; bạn của An là Binh, Chi, chưa thấy, thêm cả hai: q = [Binh, Chi]. Lấy Binh, in Binh; bạn của Binh là An (đã thấy, bỏ qua) và Dung (mới): q = [Chi, Dung]. Lấy Chi, in Chi. Lấy Dung, in Dung. Hết hàng, dừng.<br>\n• Thứ tự in: <b>An, Binh, Chi, Dung</b>, 4 dòng. Dòng thứ 2 là Binh vì Binh vào hàng trước Chi.<br>\n• Vì hàng đợi trả ra người vào trước, nên <b>mọi người cách An 1 bước đều được lấy ra trước mọi người cách 2 bước</b>. Đó là lý do BFS đi từ gần tới xa. Dung cách An <b>2 bước</b> (An → Binh → Dung).<br>\n• <code>seen</code> cần thiết vì đồ thị có <b>đường vòng</b> (An là bạn của Binh, Binh cũng là bạn của An). Không đánh dấu thì cứ quay đi quay lại mãi.<br>\n<b>Lỗi hay gặp:</b> đánh dấu <code>seen</code> lúc <b>lấy ra</b> thay vì lúc <b>xếp vào hàng</b> nên một người có thể bị xếp nhiều lần; dùng nhầm đầu ra (lấy từ cuối) thì thành DFS, không còn \"gần tới xa\"; quên <code>seen</code> nên chạy mãi.<br>\n<b>Mẹo:</b> bài này dùng list và <code>pop(0)</code> cho dễ đọc. Với dữ liệu lớn nên dùng <code>deque</code> và <code>popleft()</code>, vì <code>pop(0)</code> trên list phải dời mọi phần tử còn lại."
  },
{
    id: "g3",
    t: "DFS: đi sâu hết đường rồi mới quay lại",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">ban = {\"An\": [\"Binh\", \"Chi\"], \"Binh\": [\"An\", \"Dung\"], \"Chi\": [\"An\"], \"Dung\": [\"Binh\"]}\nseen = set()\ndef dfs(x):\n    seen.add(x)\n    print(x)\n    for y in ban[x]:\n        if y not in seen:\n            dfs(y)\ndfs(\"An\")</pre>Có bao nhiêu dòng được in?",
        a: 4,
        h: "Mỗi người được in đúng một lần nhờ seen.",
        s: "4 dòng."
      },
      {
        k: "choice",
        q: "Dòng thứ 3 in ra tên ai? (BFS ở bài trước in Chi ở dòng này)",
        o: ["Dung","Chi","An"],
        a: 0,
        h: "Từ An đi sang Binh, rồi từ Binh còn ai chưa thăm? Đi sâu luôn, chưa quay lại Chi.",
        s: "Thứ tự DFS: An, Binh, Dung, Chi."
      },
      {
        k: "choice",
        q: "Hàm dfs gọi chính nó. Đó là kỹ thuật nào đã học?",
        o: ["Đệ quy","Vòng lặp for","Dictionary"],
        a: 0,
        h: "Nhớ bài dem(n) gọi dem(n - 1).",
        s: "DFS là đệ quy trên đồ thị. Ca cơ sở là khi mọi bạn đã thăm."
      },
      {
        k: "choice",
        q: "Muốn tìm đường đi ít bước nhất giữa hai người, nên dùng cách nào?",
        o: ["BFS, vì xét từ gần tới xa","DFS, vì đi sâu","Cách nào cũng đảm bảo"],
        a: 0,
        h: "DFS có thể đi một đường vòng dài trước.",
        s: "BFS đảm bảo đường ngắn nhất khi mọi đường nối dài như nhau."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Tự giải thích: BFS và DFS khác nhau ở điểm nào về thứ tự thăm? Mỗi cách hợp với loại câu hỏi nào?",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>DFS: đi sâu hết một đường, hết đường mới quay lại.</b><pre>ban = {\"An\": [\"Binh\", \"Chi\"], \"Binh\": [\"An\", \"Dung\"], \"Chi\": [\"An\"], \"Dung\": [\"Binh\"]}\nseen = set()\ndef dfs(x):\n    seen.add(x)\n    print(x)\n    for y in ban[x]:\n        if y not in seen:\n            dfs(y)\ndfs(\"An\")</pre>\n• Chạy tay: <code>dfs(An)</code>: in An. Bạn đầu tiên là Binh (chưa thấy) → <code>dfs(Binh)</code>: in Binh. Bạn của Binh: An (đã thấy), Dung (mới) → <code>dfs(Dung)</code>: in Dung. Bạn của Dung là Binh (đã thấy), hết, <b>quay về</b> Binh, hết, quay về An. Bạn kế của An là Chi (chưa thấy) → <code>dfs(Chi)</code>: in Chi.<br>\n• Thứ tự in: <b>An, Binh, Dung, Chi</b>, 4 dòng. Dòng thứ 3 là Dung (BFS in Chi ở dòng này). Cùng đồ thị, khác thứ tự thăm.<br>\n• <code>dfs</code> <b>gọi chính nó</b>: đây là <b>đệ quy</b> trên đồ thị. Ca cơ sở nằm ngầm: khi mọi bạn đều đã thăm thì vòng <code>for</code> không gọi thêm lần nào, hàm kết thúc.<br>\n<b>BFS hay DFS?</b> Muốn tìm đường đi <b>ít bước nhất</b> thì dùng BFS (đi từng lớp nên gặp đích ở lớp gần nhất trước, khi mọi đường nối coi như dài bằng nhau). DFS hợp với câu hỏi \"có đi tới được không\", \"đếm vùng nối liền\", hoặc khi cần đi sâu hết một nhánh.<br>\n<b>Lỗi hay gặp:</b> quên đánh dấu <code>seen</code> trước khi gọi tiếp (lặp mãi, <code>RecursionError</code>); tưởng DFS cũng cho đường ngắn nhất.<br>\n<b>Mẹo:</b> đồ thị rất sâu thì DFS đệ quy cũng chịu giới hạn độ sâu như bài Mỗi lần gọi là một tầng."
  },
{
    id: "dp1",
    t: "Quy hoạch động: đừng tính lại việc đã tính",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">def fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\nprint(fib(4))</pre>In ra mấy? (fib(0)=0, fib(1)=1, fib(2)=1, fib(3)=2)",
        a: 3,
        h: "fib(4) = fib(3) + fib(2) = 2 + 1.",
        s: "fib(4) = 3."
      },
      {
        k: "input",
        q: "Khi tính fib(4), fib(2) bị tính tất cả mấy lần? (fib(4) gọi fib(3) và fib(2); fib(3) lại gọi fib(2))",
        a: 2,
        h: "Một lần từ fib(4), một lần từ fib(3).",
        s: "2 lần, cùng một việc làm lặp lại."
      },
      {
        k: "choice",
        q: "Nếu tính fib(50) theo cách này, chuyện gì xảy ra?",
        o: [
          "Cực chậm vì cùng một việc bị làm đi làm lại rất nhiều lần",
          "Rất nhanh",
          "Báo lỗi cú pháp"
        ],
        a: 0,
        h: "Mỗi lần gọi tách thành hai lần gọi nữa.",
        s: "Số lần gọi tăng gần gấp đôi mỗi bậc, rất lãng phí."
      },
      {
        k: "choice",
        q: "Cách khắc phục: tính xong fib(k) thì ghi vào dictionary, lần sau tra ra. Kỹ thuật này gọi là gì?",
        o: ["Memoization (ghi nhớ kết quả)","Sorting","Binary search"],
        a: 0,
        h: "Nhớ bài Two Sum: ta cũng dùng dictionary để nhớ.",
        s: "Memo: dùng dictionary để mỗi bài con chỉ tính một lần."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Tự giải thích: 'bài con trùng lặp' nghĩa là gì, và vì sao ghi nhớ kết quả lại tiết kiệm thời gian?",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Quy hoạch động bắt đầu từ một câu hỏi: có đang tính lại cùng một việc không?</b><pre>def fib(n):\n    if n &lt; 2:\n        return n\n    return fib(n - 1) + fib(n - 2)\nprint(fib(4))    # 3</pre>\n• Quy tắc: <code>fib(0) = 0</code>, <code>fib(1) = 1</code>, <code>fib(2) = 1</code>, <code>fib(3) = 2</code>, <code>fib(4) = 3</code> (mỗi số là tổng hai số ngay trước).<br>\n• Khi tính <code>fib(4)</code>: nó gọi <code>fib(3)</code> và <code>fib(2)</code>; mà <code>fib(3)</code> lại gọi <code>fib(2)</code> lần nữa. Vậy <code>fib(2)</code> bị tính <b>2 lần</b>, cùng một việc làm lặp lại. Đây gọi là <b>bài con trùng lặp</b>.<br>\n• Với số lớn thì lãng phí khủng khiếp: số lần gọi tăng gần gấp đôi mỗi khi n tăng 1. Tính <code>fib(50)</code> theo cách này cần hơn 40 tỷ lần gọi.<br>\n• Cách khắc phục: <b>tính xong thì ghi vào dictionary, lần sau tra ra</b>. Kỹ thuật này gọi là <b>memo</b> (ghi nhớ):<pre>memo = {}\ndef fib(n):\n    if n &lt; 2:\n        return n\n    if n in memo:\n        return memo[n]\n    memo[n] = fib(n - 1) + fib(n - 2)\n    return memo[n]\nprint(fib(50))    # 12586269025</pre>\n• Giờ mỗi bài con (<code>fib(2)</code> đến <code>fib(50)</code>, tức 49 bài) chỉ tính <b>đúng một lần</b>, các lần sau chỉ tra bảng.<br>\n<b>Lỗi hay gặp:</b> ghi vào <code>memo</code> nhưng quên <b>tra</b> trước khi tính (nên không tiết kiệm gì); đặt <code>memo = {}</code> bên trong hàm nên bảng bị xóa mỗi lần gọi.<br>\n<b>Mẹo:</b> trước khi tối ưu, tự hỏi hai câu: \"bài con nào bị tính lại?\" và \"kết quả của nó có phụ thuộc vào thứ gì khác ngoài đầu vào của nó không?\" Nếu không phụ thuộc gì khác thì ghi nhớ được."
  },
{
    id: "dp2",
    t: "Bảng quy hoạch động: leo cầu thang",
    steps: [
      {
        k: "input",
        q: "Mỗi lần bước 1 hoặc 2 bậc. Lên bậc 1 có mấy cách?",
        a: 1,
        h: "Chỉ có cách bước 1 bậc từ mặt đất.",
        s: "1 cách."
      },
      {
        k: "input",
        q: "Lên bậc 2 có mấy cách? (1+1 hoặc 2)",
        a: 2,
        h: "Liệt kê hai cách.",
        s: "2 cách."
      },
      {
        k: "choice",
        q: "Muốn đứng ở bậc 3, bước cuối cùng có thể đến từ đâu?",
        o: ["Từ bậc 2 (bước 1) hoặc từ bậc 1 (bước 2)","Chỉ từ bậc 2","Từ bậc 4"],
        a: 0,
        h: "Một bước dài 1 hoặc 2 bậc.",
        s: "cách(3) = cách(2) + cách(1)."
      },
      {
        k: "input",
        q: "Vậy lên bậc 3 có mấy cách?",
        a: 3,
        h: "2 + 1.",
        s: "3 cách."
      },
      {
        k: "input",
        q: "Lên bậc 4 có mấy cách? (cách(4) = cách(3) + cách(2))",
        a: 5,
        h: "3 + 2.",
        s: "5 cách."
      },
      {
        k: "input",
        q: "<pre class=\"out\">dp = [1, 2]\nfor i in range(2, 5):\n    dp.append(dp[i - 1] + dp[i - 2])\nprint(dp[4])</pre>In ra mấy? Chú ý: dp[0] là bậc 1, dp[1] là bậc 2.",
        a: 8,
        h: "Dò từng vòng: dp = [1, 2, 3, 5, 8].",
        s: "dp[4] là bậc 5 nên 8. Chỉ số lệch một so với số bậc: đây là chỗ hay nhầm."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Tự giải thích: 'dp[i] nghĩa là gì' và 'dp[i] được tính từ những ô nào' trong bài này? Vì sao không cần tính lại từ đầu?",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Quy hoạch động: giải bài nhỏ trước, ghi vào bảng, bài lớn lấy từ bảng.</b><br>Leo cầu thang, mỗi lần bước 1 hoặc 2 bậc. Gọi <b>cách(k)</b> là số cách lên bậc k.<br>• cách(1) = 1; cách(2) = 2 (1+1 hoặc 2).<br>• Muốn đứng ở bậc k, bước <b>cuối cùng</b> đến từ bậc k-1 (bước 1) hoặc bậc k-2 (bước 2). Hai nhóm cách này không trùng nhau, nên <b>cách(k) = cách(k-1) + cách(k-2)</b>.<br>• Bảng: cách(3) = 2 + 1 = 3; cách(4) = 3 + 2 = 5; cách(5) = 5 + 3 = 8.<pre>dp = [1, 2]\nfor i in range(2, 5):\n    dp.append(dp[i - 1] + dp[i - 2])\nprint(dp)          # [1, 2, 3, 5, 8]\nprint(dp[4])       # 8</pre><b>Chỗ hay nhầm:</b> trong bài, <code>dp[0]</code> là <b>bậc 1</b>, <code>dp[1]</code> là bậc 2, nên <code>dp[4]</code> là <b>bậc 5</b> (chỉ số lệch một so với số bậc). Hỏi bậc k thì đọc <code>dp[k - 1]</code>.<br><b>Vì sao không tính lại từ đầu?</b> Mỗi ô chỉ cần hai ô liền trước đã có sẵn. Ghi lại kết quả để dùng, khỏi tính lại.<br><b>Mẹo:</b> trước khi code, tự viết hai câu: \"<code>dp[i]</code> nghĩa là gì\" và \"<code>dp[i]</code> tính từ những ô nào\"."
  }
];
