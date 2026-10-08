import type { RichLesson } from './lesson-types';

export const CODE_LABS_2_LESSONS: RichLesson[] = [
{
    id: "b4",
    t: "Ghép hàm: def, return, và lúc gọi hàm",
    steps: [
      {
        k: "build",
        q: "Ghép dòng 'tạo hàm tên gap_doi, nhận vào x'.",
        h: "Đọc to câu bằng lời trước, rồi đặt từng mảnh vào đúng chỗ. Mỗi chỗ có một vai trò riêng.",
        s: "Đã ghép đúng: def gap_doi ( x ) :",
        tok: [":","x","(",")","gap_doi","def"],
        ans: ["def","gap_doi","(","x",")",":"],
        roles: ["từ khóa 'tạo hàm'","tên hàm","mở ngoặc","tên đầu vào","đóng ngoặc","dấu hai chấm"],
        guided: 1,
        say: "tạo hàm gap_doi nhận x",
        show: "def gap_doi ( x ) :"
      },
      {
        k: "build",
        q: "Ghép dòng 'trả ra x nhân 2'.",
        h: "Đọc to câu bằng lời trước, rồi đặt từng mảnh vào đúng chỗ. Mỗi chỗ có một vai trò riêng.",
        s: "Đã ghép đúng: return x * 2",
        tok: ["2","*","x","return"],
        ans: ["return","x","*","2"],
        roles: ["trả kết quả ra","thứ đem tính","phép nhân","số nhân"],
        guided: 1,
        say: "trả ra x nhân 2",
        show: "return x * 2"
      },
      {
        k: "order",
        ph: "Ghép cả chương trình, từng dòng",
        q: "Chọn dòng tiếp theo. Nhớ: tạo hàm trước, rồi mới gọi hàm.",
        s: "Đã ghép đúng: tạo hàm, rồi gọi hàm",
        items: [
          ["<code>def gap_doi(x):</code>","Phải tạo cái máy trước khi dùng. Dòng nào tạo máy?"],
          [
            "<code>&nbsp;&nbsp;&nbsp;&nbsp;return x * 2</code>",
            "Cái máy làm gì với x? Dòng này thuộc về hàm."
          ],
          ["<code>print(gap_doi(4))</code>","Máy làm xong thì dùng nó. Dòng này nằm ngoài hàm."]
        ]
      },
      {
        k: "choice",
        q: "Dòng print(gap_doi(4)) không thụt vào. Vì sao?",
        o: ["Nó nằm ngoài hàm: đây là lúc GỌI hàm, không phải bên trong hàm","Quên thụt"],
        a: 0,
        h: "Dòng nào thuộc về hàm thì thụt vào.",
        s: "Phần định nghĩa hàm thụt vào, còn việc dùng hàm nằm ngoài."
      }
    ],
    note: "<b>Hàm: tạo hàm, trả kết quả, rồi gọi hàm.</b><pre>def gap_doi(x):\n    return x * 2\n\nprint(gap_doi(4))</pre>• <code>def gap_doi(x):</code> <b>tạo</b> hàm tên <code>gap_doi</code>, nhận vào <code>x</code>. Tạo xong thì hàm chưa chạy.<br>• <code>return x * 2</code> là việc hàm <b>trả ra</b> cho nơi gọi nó. Dòng này thụt vào vì thuộc về hàm.<br>• <code>print(gap_doi(4))</code> thẳng hàng với <code>def</code> vì nó nằm <b>ngoài hàm</b>: đây là lúc <b>gọi</b> hàm, với <code>x = 4</code>. In ra 8.<br><b>Thứ tự:</b> tạo hàm trước, gọi hàm sau. Gọi một hàm chưa được tạo thì Python báo <code>NameError</code>.<br><b>Lỗi hay gặp:</b> tưởng thụt dòng là quên; thật ra thụt = bên trong hàm, không thụt = bên ngoài. Nhầm <code>print</code> với <code>return</code>: <code>return</code> trả kết quả cho code đang gọi, còn <code>print</code> chỉ hiện lên màn hình."
  },
{
    id: "b5",
    t: "Ghép ký hiệu của list",
    steps: [
      {
        k: "build",
        q: "Ghép 'lấy hộp số 0 của hàng hộp a'.",
        h: "Đọc to câu bằng lời trước, rồi đặt từng mảnh vào đúng chỗ. Mỗi chỗ có một vai trò riêng.",
        s: "Đã ghép đúng: a [ 0 ]",
        tok: ["]","0","[","a"],
        ans: ["a","[","0","]"],
        roles: ["tên hàng hộp","mở ngoặc vuông","chỉ số","đóng ngoặc vuông"],
        guided: 1,
        say: "hộp số 0 của a",
        show: "a [ 0 ]"
      },
      {
        k: "build",
        q: "Ghép 'bỏ số 9 vào hộp số 1 của a'.",
        h: "Đọc to câu bằng lời trước, rồi đặt từng mảnh vào đúng chỗ. Mỗi chỗ có một vai trò riêng.",
        s: "Đã ghép đúng: a [ 1 ] = 9",
        tok: ["9","=","]","1","[","a"],
        ans: ["a","[","1","]","=","9"],
        roles: ["tên hàng hộp","mở ngoặc vuông","chỉ số","đóng ngoặc vuông","dấu gán","giá trị"],
        guided: 1,
        say: "bỏ 9 vào hộp số 1 của a",
        show: "a [ 1 ] = 9"
      },
      {
        k: "build",
        q: "Ghép 'đếm có bao nhiêu hộp trong a'.",
        h: "Đọc to câu bằng lời trước, rồi đặt từng mảnh vào đúng chỗ. Mỗi chỗ có một vai trò riêng.",
        s: "Đã ghép đúng: len ( a )",
        tok: ["(",")","a","len"],
        ans: ["len","(","a",")"],
        roles: null,
        guided: 0,
        say: "độ dài của a",
        show: "len ( a )"
      },
      {
        k: "build",
        q: "Ghép 'lặp qua từng số x trong hàng a'.",
        h: "Đọc to câu bằng lời trước, rồi đặt từng mảnh vào đúng chỗ. Mỗi chỗ có một vai trò riêng.",
        s: "Đã ghép đúng: for x in a :",
        tok: [":","a","in","x","for"],
        ans: ["for","x","in","a",":"],
        roles: ["từ khóa 'lặp'","tên cho mỗi số","từ khóa 'trong'","hàng hộp","dấu hai chấm"],
        guided: 1,
        say: "lặp, x là từng số trong a",
        show: "for x in a :"
      },
      {
        k: "choice",
        q: "for x in a: khác for i in range(len(a)): ở chỗ nào?",
        o: ["x là chính số trong hộp, còn i là số thứ tự của hộp","Giống hệt nhau"],
        a: 0,
        h: "Một cái đưa ra thứ bên trong hộp, một cái đưa ra số thứ tự.",
        s: "x là giá trị, i là chỉ số. Chọn cái nào tùy việc cần làm."
      }
    ],
    note: "<b>Bốn mẩu viết liên quan đến list, đều dùng ví dụ hàng hộp <code>a</code>.</b><pre>a[0]          # lấy hộp số 0\na[1] = 9      # bỏ số 9 vào hộp số 1\nlen(a)        # đếm có bao nhiêu hộp\nfor x in a:   # lặp qua từng số x trong a</pre>• Dấu <b>ngoặc vuông</b> <code>[ ]</code> chứa <b>chỉ số</b>. Có <code>=</code> ở sau thì là <b>đặt vào</b> hộp đó, không có thì là <b>lấy ra</b>.<br>• <code>len(a)</code> cho <b>số hộp</b>, nên chỉ số cuối cùng là <code>len(a) - 1</code> (nhớ bài thứ tự, máy đếm từ 0).<br>• <code>for x in a:</code> cho <b>chính số trong hộp</b>; <code>for i in range(len(a)):</code> cho <b>số thứ tự của hộp</b> (chỉ số). Cần giá trị thì dùng <code>x</code>; cần biết hộp thứ mấy thì dùng <code>i</code> (rồi <code>a[i]</code> để lấy giá trị).<br><b>Lỗi hay gặp:</b> viết <code>a(0)</code> thay vì <code>a[0]</code>; dùng <code>a[len(a)]</code> (vượt hộp cuối, <code>IndexError</code>).<br><b>Mẹo:</b> trước khi viết, hỏi \"mình cần giá trị hay cần chỉ số?\""
  },
{
    id: "b6",
    t: "Từ tờ giấy nhớ đến từng dòng code",
    steps: [
      {
        k: "choice",
        q: "Bài 'tờ giấy nhớ' ghi số lớn nhất đã thấy. Trong code, tờ giấy đó là gì?",
        o: ["Một biến, ví dụ best","Một hàm","Một vòng lặp"],
        a: 0,
        h: "Nhớ bài cái tên và cái hộp: thứ giữ giá trị và đổi được là gì?",
        s: "Tờ giấy là một biến."
      },
      {
        k: "order",
        ph: "Ghép cả hàm, từng dòng",
        q: "Chọn dòng tiếp theo của hàm find_max. Hãy đối chiếu với bài tờ giấy nhớ.",
        s: "Đã ghép đúng cả hàm find_max",
        items: [
          ["<code>def find_max(nums):</code>","Phải tạo hàm trước. Dòng nào tạo hàm?"],
          ["<code>&nbsp;&nbsp;&nbsp;&nbsp;best = nums[0]</code>","Tờ giấy ghi gì lúc đầu?"],
          [
            "<code>&nbsp;&nbsp;&nbsp;&nbsp;for x in nums:</code>",
            "Có tờ giấy rồi thì làm gì với từng hộp?"
          ],
          [
            "<code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if x &gt; best:</code>",
            "Với mỗi hộp, hỏi câu gì?"
          ],
          [
            "<code>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;best = x</code>",
            "Hộp lớn hơn thì làm gì với tờ giấy?"
          ],
          ["<code>&nbsp;&nbsp;&nbsp;&nbsp;return best</code>","Xét hết hộp rồi thì đưa ra gì?"]
        ]
      },
      {
        k: "choice",
        q: "<pre class=\"out\">def find_max(nums):\n    best = nums[0]\n    for x in nums:</pre>Hàm đang viết dở. Dòng TIẾP THEO (thụt thêm 4 dấu cách) nên làm gì?",
        o: ["So x với best","return best","Tạo hàm mới"],
        a: 0,
        h: "Ở trong vòng lặp, mỗi lần x là một hộp. Ta làm gì với hộp?",
        s: "Bên trong vòng lặp là việc làm với từng hộp: so sánh x với best."
      },
      {
        k: "choice",
        q: "Em quên thụt dòng best = x vào trong if (nó nằm thẳng hàng với if). Chuyện gì xảy ra?",
        o: [
          "best bị ghi đè ở MỌI vòng lặp, kết quả là số cuối cùng chứ không phải số lớn nhất",
          "Vẫn chạy đúng như cũ"
        ],
        a: 0,
        h: "Dòng không thụt thì thuộc về khối nào?",
        s: "Độ thụt quyết định dòng đó chạy khi nào. Thụt sai là lỗi logic, Python không báo gì cả."
      },
      {
        k: "build",
        q: "Ghép dòng 'nếu x lớn hơn best thì'. Lần này không có ghi chú.",
        h: "Đọc to câu bằng lời trước, rồi đặt từng mảnh vào đúng chỗ. Mỗi chỗ có một vai trò riêng.",
        s: "Đã ghép đúng: if x &gt; best :",
        tok: [":","best",">","x","if"],
        ans: ["if","x",">","best",":"],
        roles: null,
        guided: 0,
        say: "nếu x lớn hơn best thì",
        show: "if x > best :"
      },
      {
        k: "reflect",
        ph: "Tự giải thích bằng lời của bạn (không có đáp án đúng sai, quan trọng là bạn nói được)",
        q: "Tự kể bằng lời: khi viết một hàm, em làm theo thứ tự nào, dòng nào trước, dòng nào sau, và vì sao dòng best = nums[0] phải đứng trước vòng for? (Không có đáp án đúng sai, quan trọng là em nói được thứ tự và lý do.)",
        s: "Đã tự giải thích"
      }
    ],
    note: "<b>Từ tờ giấy nhớ đến từng dòng code.</b> Bài \"tìm số lớn nhất\" có tờ giấy nhớ; trong code, tờ giấy đó là <b>một biến</b> (ở đây tên <code>best</code>).<pre>def find_max(nums):\n    best = nums[0]\n    for x in nums:\n        if x &gt; best:\n            best = x\n    return best</pre>Đối chiếu từng dòng với tờ giấy nhớ:<br>• <code>best = nums[0]</code>: ghi số ở hộp đầu lên giấy. Phải đứng <b>trước</b> vòng for, vì việc chuẩn bị làm một lần.<br>• <code>for x in nums:</code>: lần lượt xem từng hộp.<br>• <code>if x &gt; best:</code> rồi <code>best = x</code>: nếu số mới lớn hơn số trên giấy thì xóa, ghi số mới.<br>• <code>return best</code>: thẳng hàng với <code>for</code>, nên chỉ chạy <b>sau khi</b> vòng đã xong.<br><b>Độ thụt quyết định dòng chạy khi nào.</b> Nếu <code>best = x</code> thẳng hàng với <code>if</code> (quên thụt), nó chạy ở <b>mọi</b> vòng và ghi đè hết, kết quả là số cuối cùng chứ không phải số lớn nhất. Python <b>không báo lỗi</b> trường hợp này; chỉ test mới bắt được.<br><b>Mẹo:</b> khi viết dở, hỏi \"dòng tiếp theo làm gì với MỘT hộp?\" Việc đó nằm bên trong vòng lặp."
  }
];
