import type { RichLesson } from './lesson-types';

export const APPS_2_LESSONS: RichLesson[] = [
{
    id: "ap4",
    t: "Ứng dụng 4: phụ thuộc giữa các gói là đồ thị",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">deps = {\"app\": [\"lib\", \"log\"], \"lib\": [\"core\"], \"log\": [\"core\"], \"core\": []}\nprint(len(deps))</pre>Để chạy app, cần cài các gói trong bảng phụ thuộc. Có tất cả bao nhiêu gói (kể cả app)?",
        a: 4,
        h: "Đếm số khóa của bảng.",
        s: "4 gói: app, lib, log, core."
      },
      {
        k: "choice",
        q: "Gói nào phải cài ĐẦU TIÊN?",
        o: ["core, vì không cần gói nào khác","app","lib"],
        a: 0,
        h: "Gói nào không có phụ thuộc?",
        s: "Phải cài thứ mà người khác dựa vào trước."
      },
      {
        k: "choice",
        q: "Thứ tự cài nào hợp lệ?",
        o: ["core, lib, log, app","app, lib, log, core","lib, app, core, log"],
        a: 0,
        h: "Mỗi gói chỉ được cài khi các gói nó cần đã có.",
        s: "Thứ tự này gọi là sắp xếp topo."
      },
      {
        k: "choice",
        q: "Nếu lib cần log và log cần lib, chuyện gì xảy ra?",
        o: [
          "Không có thứ tự nào hợp lệ: phụ thuộc vòng, hệ thống phải báo lỗi",
          "Cài song song là xong",
          "Bỏ qua một gói"
        ],
        a: 0,
        h: "Gói nào cài trước?",
        s: "Phát hiện vòng là việc rất thật của trình quản lý gói và hệ thống build."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Ứng dụng: kể một việc khác có thể vẽ thành các mũi tên 'phải xong A trước khi làm B' (công việc dự án, môn học tiên quyết...). Có thể gặp vòng không?",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Phụ thuộc giữa các gói phần mềm là một đồ thị: mũi tên nghĩa là \"cần cái này trước\".</b><br>\nBảng phụ thuộc trong bài:<pre>deps = {\"app\": [\"lib\", \"log\"], \"lib\": [\"core\"], \"log\": [\"core\"], \"core\": []}\nprint(len(deps))    # 4</pre>\n• Có <b>4</b> gói (4 khóa): <code>app</code> cần <code>lib</code> và <code>log</code>; <code>lib</code> và <code>log</code> đều cần <code>core</code>; <code>core</code> không cần gì.<br>\n• Gói cài <b>đầu tiên</b> là <code>core</code>, vì nó không phụ thuộc gói nào: phải cài thứ người khác dựa vào trước.<br>\n<b>Tìm thứ tự cài (sắp xếp topo).</b> Với mỗi gói: cài hết các gói nó cần trước, rồi mới cài nó. Đây chính là duyệt DFS:<pre>da_cai = []\ndef cai(g):\n    if g in da_cai:\n        return\n    for x in deps[g]:\n        cai(x)\n    da_cai.append(g)\ncai(\"app\")\nprint(da_cai)    # ['core', 'lib', 'log', 'app']</pre>\n• <code>cai(\"app\")</code> đi xuống <code>lib</code>, rồi <code>core</code>: <code>core</code> không cần gì nên cài đầu tiên, rồi <code>lib</code>. Sang <code>log</code>: <code>core</code> đã cài nên bỏ qua, cài <code>log</code>. Cuối cùng cài <code>app</code>.<br>\n• <b>Thứ tự hợp lệ không duy nhất:</b> <code>core, log, lib, app</code> cũng đúng. Thứ tự <code>app, lib, log, core</code> thì sai vì cài <code>app</code> khi chưa có gì để nó dựa vào.<br>\n<b>Phụ thuộc vòng.</b> Nếu <code>lib</code> cần <code>log</code> và <code>log</code> cần <code>lib</code> thì <b>không có thứ tự nào hợp lệ</b>: gói nào cũng phải chờ gói kia. Với đoạn code trên, vòng này làm hàm gọi nhau mãi và báo <code>RecursionError</code>. Chương trình thật phải <b>phát hiện vòng và báo lỗi rõ ràng</b> thay vì treo.<br>\n<b>Lỗi hay gặp:</b> đọc ngược chiều mũi tên (nhầm \"A cần B\" thành \"B cần A\"); tưởng chỉ có một thứ tự đúng; quên rằng vòng là một dạng dữ liệu xấu phải xử lý.<br>\n<b>Mẹo:</b> khi thấy \"phải xong A trước khi làm B\" (công việc dự án, môn học tiên quyết, các bước build), hãy nghĩ tới đồ thị có hướng. Hỏi: <i>có thể có vòng không? Nếu có thì làm gì?</i>"
  },
{
    id: "ap5",
    t: "Ứng dụng 5: thư mục là cây, tính dung lượng bằng đệ quy",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">tree = {\"size\": 0, \"children\": [{\"size\": 5, \"children\": []}, {\"size\": 0, \"children\": [{\"size\": 7, \"children\": []}, {\"size\": 3, \"children\": []}]}]}\ndef total(n):\n    s = n[\"size\"]\n    for c in n[\"children\"]:\n        s += total(c)\n    return s\nprint(total(tree[\"children\"][1]))</pre>Mỗi nút là tệp hoặc thư mục. In ra mấy? (Nút con thứ hai là một thư mục chứa hai tệp 7 và 3.)",
        a: 10,
        h: "Thư mục này có size 0, cộng total của hai tệp con.",
        s: "0 + 7 + 3 = 10."
      },
      {
        k: "input",
        q: "Gọi total(tree), tức tính toàn bộ cây, ra mấy?",
        a: 15,
        h: "Cộng tệp 5 với thư mục vừa tính.",
        s: "5 + 10 = 15."
      },
      {
        k: "choice",
        q: "Ca cơ sở của hàm total là gì?",
        o: [
          "Nút không có con: vòng for không chạy, trả về size của chính nó",
          "Nút có nhiều con",
          "Cây rỗng"
        ],
        a: 0,
        h: "Khi children là danh sách rỗng, điều gì xảy ra?",
        s: "Nút lá không gọi tiếp. Đúng ý bài đệ quy."
      },
      {
        k: "choice",
        q: "Lệnh du hay trình quản lý tệp hiển thị dung lượng thư mục dựa trên ý tưởng nào?",
        o: ["Duyệt cây, cộng dung lượng từ lá lên","Đoán","Đọc một con số có sẵn"],
        a: 0,
        h: "Thư mục không tự có dung lượng, nó chứa các thứ khác.",
        s: "Giống hệt hàm total."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Ứng dụng: ngoài thư mục, còn thứ gì ngoài đời có hình cây (sơ đồ công ty, mục lục, bình luận trả lời bình luận)? Bạn sẽ tính gì trên cây đó?",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Thư mục là một cây; dung lượng thư mục = dung lượng chính nó + dung lượng các thư mục con.</b><pre>def total(n):\n    s = n[\"size\"]\n    for c in n[\"children\"]:\n        s += total(c)\n    return s</pre>• Mỗi nút là tệp hoặc thư mục, ghi <code>size</code> và danh sách <code>children</code>. Thư mục có thể có <code>size</code> 0 vì dung lượng nằm ở các tệp con.<br>• <b>Ca cơ sở</b>: nút <b>không có con</b>. Vòng <code>for</code> không chạy lần nào, hàm trả về <code>size</code> của chính nó. Không cần viết <code>if</code> riêng.<br>• <b>Bước đệ quy</b>: cộng <code>total(c)</code> của từng con vào <code>s</code>.<br>• Với thư mục chứa hai tệp 7 và 3 (bản thân nó 0): 0 + 7 + 3 = <b>10</b>. Cả cây: 5 + 10 = <b>15</b>.<br>• Đây chính là ý tưởng của lệnh <code>du</code> và trình quản lý tệp khi hiện dung lượng thư mục: duyệt cây, cộng từ lá lên.<br><b>Lỗi hay gặp:</b> quên cộng <code>size</code> của chính nút; nhầm <code>total(c)</code> với <code>c[\"size\"]</code> nên bỏ sót các tầng sâu hơn.<br><b>Mẹo:</b> các thứ ngoài đời hình cây (sơ đồ công ty, mục lục, bình luận trả lời bình luận) đều tính được bằng cùng khuôn: lấy giá trị của nút + kết quả của các con."
  },
{
    id: "ap6",
    t: "Ứng dụng 6: chọn cấu trúc dữ liệu cho yêu cầu thật",
    steps: [
      {
        k: "choice",
        q: "Tìm khách hàng theo số điện thoại trong 10 triệu bản ghi, nhanh. Nên dùng gì?",
        o: ["Dictionary (hash map): tra theo khóa","List và duyệt từng người","Stack"],
        a: 0,
        h: "Cần tra theo một khóa, gần như một bước.",
        s: "Hash map: khóa là số điện thoại."
      },
      {
        k: "choice",
        q: "Chức năng hoàn tác (Undo) khi chỉnh sửa tài liệu nên dùng gì?",
        o: ["Stack","Queue","Set"],
        a: 0,
        h: "Hoàn tác thao tác nào trước?",
        s: "Vào sau ra trước."
      },
      {
        k: "choice",
        q: "Xử lý các yêu cầu gửi đến server theo đúng thứ tự đến. Nên dùng gì?",
        o: ["Queue","Stack","Dictionary"],
        a: 0,
        h: "Ai đến trước thì được phục vụ trước.",
        s: "Vào trước ra trước."
      },
      {
        k: "choice",
        q: "Hỏi 'hai người có quan hệ gián tiếp qua bạn bè không' trong mạng xã hội. Nên mô hình hóa thành gì?",
        o: ["Đồ thị, rồi duyệt BFS hoặc DFS","Một con số","Một chuỗi"],
        a: 0,
        h: "Người là nút, quan hệ là đường nối.",
        s: "Đồ thị, và BFS cho biết khoảng cách ngắn nhất."
      },
      {
        k: "choice",
        q: "Loại bỏ các email trùng trong danh sách gửi tin. Nên dùng gì?",
        o: ["Set","Stack","Cây"],
        a: 0,
        h: "Cần biết một phần tử đã có chưa và không giữ bản sao.",
        s: "Set: mỗi giá trị xuất hiện một lần, tra nhanh."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Capstone: chọn một hệ thống bạn muốn xây (ứng dụng ghi chi tiêu, quản lý công việc, tìm kiếm sản phẩm...). Liệt kê ít nhất 3 chức năng, với mỗi chức năng chọn một cấu trúc dữ liệu và giải thích vì sao bằng một câu.",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Chọn cấu trúc dữ liệu: bắt đầu từ việc bạn cần làm nhiều nhất, không phải từ cấu trúc bạn quen.</b><br>\nBa câu hỏi giúp chọn:<br>\n1. <b>Thao tác chính là gì?</b> Tra theo khóa, thêm vào, lấy ra, hay kiểm tra \"đã có chưa\"?<br>\n2. <b>Thứ tự có quan trọng không?</b> Vào sau ra trước, hay vào trước ra trước?<br>\n3. <b>Dữ liệu có quan hệ nối giữa các phần tử không?</b> (người quen người, gói cần gói)<br>\n<b>Áp vào năm tình huống trong bài:</b><br>\n• Tìm khách theo số điện thoại trong 10 triệu bản ghi → <b>dictionary</b>, khóa là số điện thoại:<pre>khach = {\"0901\": \"An\", \"0902\": \"Binh\"}\nprint(khach[\"0902\"])    # Binh</pre>\n Với list thì phải duyệt từng người, tệ nhất là 10 triệu bước; dictionary tra trung bình gần như một bước.<br>\n• Hoàn tác (Undo) → <b>stack</b>: hoàn tác thao tác gần nhất trước.<br>\n• Xử lý yêu cầu theo thứ tự đến → <b>queue</b>: ai đến trước phục vụ trước.<br>\n• \"Hai người có quan hệ gián tiếp qua bạn bè không?\" → <b>đồ thị</b> (người là nút, quan hệ là đường nối), rồi duyệt BFS hoặc DFS. BFS còn cho biết khoảng cách ngắn nhất.<br>\n• Loại email trùng → <b>set</b>:<pre>emails = [\"a@x.com\", \"b@x.com\", \"a@x.com\"]\nprint(len(set(emails)))    # 2\nprint(list(dict.fromkeys(emails)))    # ['a@x.com', 'b@x.com']</pre>\n <code>set</code> loại trùng nhưng <b>không đảm bảo thứ tự</b>. Nếu cần giữ thứ tự xuất hiện đầu tiên thì dùng <code>dict.fromkeys</code> như trên.<br>\n<b>Lỗi hay gặp:</b> chọn cấu trúc \"nghe xịn\" thay vì khớp với thao tác chính; quên rằng với dữ liệu nhỏ thì list đơn giản vẫn đủ tốt (đúng và dễ hiểu trước, tối ưu sau); chỉ nhìn tốc độ mà quên cái giá (dictionary tốn thêm bộ nhớ, stack và queue không cho tra tùy ý).<br>\n<b>Capstone:</b> với mỗi chức năng của hệ thống bạn chọn, viết một câu theo mẫu \"Chức năng X cần [thao tác], nên dùng [cấu trúc] vì [lý do]\". Không viết được phần \"vì\" nghĩa là bạn chưa chắc về lựa chọn đó.<br>\n<b>Mẹo:</b> nếu hai cấu trúc cùng có vẻ hợp, viết cách đơn giản nhất cho đúng trước, đo xem có chậm thật không, rồi mới đổi."
  },
{
    id: "rl1",
    t: "Giới hạn tốc độ (rate limiter): hàng đợi giữ các thời điểm",
    steps: [
      {
        k: "choice",
        q: "Một API cho phép tối đa 2 yêu cầu trong mỗi 3 giây. Để quyết định chấp nhận hay từ chối một yêu cầu mới, hệ thống cần nhớ gì về các yêu cầu đã được chấp nhận?",
        o: ["Thời điểm của chúng","Tên người gọi","Không cần nhớ gì"],
        a: 0,
        h: "Muốn biết 'trong 3 giây gần nhất có mấy yêu cầu', ta cần biết chúng xảy ra lúc nào.",
        s: "Cần nhớ thời điểm các yêu cầu đã chấp nhận."
      },
      {
        k: "input",
        q: "Hàng đợi đang giữ các thời điểm [1, 2]. Yêu cầu mới đến lúc giây 3, cửa sổ 3 giây, nên chỉ tính các thời điểm lớn hơn 3 - 3 = 0. Còn mấy thời điểm nằm trong cửa sổ?",
        a: 2,
        h: "1 và 2 có lớn hơn 0 không?",
        s: "Cả hai đều lớn hơn 0 nên còn 2. Đã đủ giới hạn 2, yêu cầu này bị từ chối."
      },
      {
        k: "input",
        q: "Vẫn hàng đợi [1, 2]. Yêu cầu mới đến lúc giây 4, chỉ tính các thời điểm lớn hơn 4 - 3 = 1. Còn mấy thời điểm trong cửa sổ?",
        a: 1,
        h: "Thời điểm 1 có lớn hơn 1 không?",
        s: "Chỉ còn 2. Thời điểm 1 đã quá cũ, bị bỏ đi. Còn chỗ, yêu cầu được chấp nhận."
      },
      {
        k: "choice",
        q: "Thời điểm quá cũ nằm ở đâu trong hàng đợi, và vì sao đó là chỗ dễ loại bỏ?",
        o: ["Ở đầu hàng: vào trước nên cũng hết hạn trước (queue)","Ở cuối hàng","Ở giữa hàng"],
        a: 0,
        h: "Yêu cầu nào đến sớm nhất thì hết hạn đầu tiên.",
        s: "Queue vào trước ra trước, khớp đúng với bài toán này."
      },
      {
        k: "choice",
        q: "Yêu cầu bị TỪ CHỐI có được ghi vào hàng đợi không? Đề không nói, đây là một quyết định nghiệp vụ.",
        o: [
          "Không: chỉ ghi các yêu cầu đã được chấp nhận, và ta ghi giả định này ra",
          "Có: mọi yêu cầu đều ghi",
          "Tùy hứng"
        ],
        a: 0,
        h: "Nếu yêu cầu bị từ chối vẫn bị tính, người dùng gửi dồn dập sẽ bị khóa mãi mãi.",
        s: "Ta chọn: chỉ tính yêu cầu đã chấp nhận. Quan trọng là giả định được ghi ra và có test bảo vệ."
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Tự giải thích bằng lời: vì sao rate limiter dùng queue? Và vì sao thời điểm cũ phải bị bỏ khỏi hàng?",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Giới hạn tốc độ: \"tối đa 2 yêu cầu trong mỗi 3 giây\". Hàng đợi giữ thời điểm các yêu cầu đã được chấp nhận.</b><br>\nMuốn biết \"trong 3 giây gần nhất có mấy yêu cầu\" thì phải nhớ <b>thời điểm</b> của chúng, nhớ tên người gọi không giúp được gì. Quy tắc cho một yêu cầu mới lúc <code>t</code>:<br>\n1. Bỏ khỏi đầu hàng mọi thời điểm <b>quá cũ</b>, tức nhỏ hơn hoặc bằng <code>t - 3</code>. Còn giữ lại những thời điểm <b>lớn hơn</b> <code>t - 3</code>.<br>\n2. Nếu hàng còn ít hơn 2 thời điểm thì <b>chấp nhận</b> và ghi <code>t</code> vào cuối hàng. Hết chỗ thì <b>từ chối</b>.<br>\n<b>Chạy tay với các yêu cầu lúc 1, 2, 3, 4</b> (giới hạn 2, cửa sổ 3):<br>\n• <b>t = 1:</b> hàng rỗng, chấp nhận → hàng <code>[1]</code>.<br>\n• <b>t = 2:</b> bỏ thời điểm <code>&lt;= -1</code>: không có. Hàng có 1 &lt; 2, chấp nhận → <code>[1, 2]</code>.<br>\n• <b>t = 3:</b> bỏ thời điểm <code>&lt;= 0</code>: không có (1 và 2 đều lớn hơn 0). Hàng có 2, đủ rồi → <b>từ chối</b>, hàng giữ nguyên.<br>\n• <b>t = 4:</b> bỏ thời điểm <code>&lt;= 1</code>: thời điểm 1 bị bỏ → <code>[2]</code>. Có 1 &lt; 2, chấp nhận → <code>[2, 4]</code>.<pre>q = []\nres = []\nfor t in [1, 2, 3, 4]:\n    while q and q[0] &lt;= t - 3:\n        q.pop(0)\n    if len(q) &lt; 2:\n        q.append(t)\n        res.append(True)\n    else:\n        res.append(False)\nprint(res)    # [True, True, False, True]</pre>\n<b>Vì sao queue?</b> Yêu cầu đến sớm nhất cũng hết hạn đầu tiên, và nó nằm ở <b>đầu hàng</b>: vào trước, ra trước. Muốn bỏ cái cũ chỉ cần nhìn đầu hàng, không phải tìm khắp nơi. Vì có thể nhiều thời điểm cùng hết hạn một lúc nên dùng <code>while</code>, không dùng <code>if</code>.<br>\n<b>Một quyết định nghiệp vụ phải ghi ra:</b> yêu cầu bị từ chối <b>không</b> được ghi vào hàng. Nếu ghi, người gửi dồn dập sẽ bị tính mãi và bị khóa vĩnh viễn. Thử ghi cả yêu cầu bị từ chối ở ví dụ trên thì kết quả đổi thành <code>[True, True, False, False]</code>: cùng dữ liệu, khác kết quả, nên quyết định này cần có test bảo vệ.<br>\n<b>Lỗi hay gặp:</b> viết <code>&lt;</code> thay <code>&lt;=</code> khi bỏ thời điểm cũ (thời điểm 1 ở t = 4 không bị bỏ, kết quả cũng ra <code>[True, True, False, False]</code>); ghi cả yêu cầu bị từ chối; dùng stack nên bỏ nhầm thời điểm mới nhất.<br>\n<b>Mẹo:</b> luôn thử đúng ca \"vừa chạm biên\" (ở đây là t = 4, đúng lúc thời điểm 1 hết hạn). Sai biên một đơn vị là lỗi phổ biến nhất của bài này."
  }
];
