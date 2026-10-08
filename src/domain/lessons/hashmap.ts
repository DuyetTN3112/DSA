import type { RichLesson } from './lesson-types';

export const HASHMAP_LESSONS: RichLesson[] = [
{
    id: "h1",
    t: "Bảng tra: tên đi với giá trị",
    steps: [
      {
        k: "choice",
        q: "<pre class=\"out\">tuoi = {\"An\": 10, \"Binh\": 12}\nprint(tuoi[\"An\"])</pre>Dòng print in ra gì?",
        o: ["10","12","An"],
        a: 0,
        h: "Trong dấu [ ] là chìa khóa (key). Chìa khóa An mở ra giá trị nào?",
        s: "tuoi[\"An\"] lấy giá trị đi với key An: 10."
      },
      {
        k: "input",
        q: "<pre class=\"out\">tuoi = {\"An\": 10, \"Binh\": 12}\nprint(tuoi[\"Binh\"])</pre>In ra số mấy?",
        a: 12,
        h: "Tìm key Binh trong bảng.",
        s: "Key Binh đi với 12."
      },
      {
        k: "choice",
        q: "Dictionary khác list ở điểm nào?",
        o: ["Tra bằng key có nghĩa, không phải số thứ tự","Chỉ chứa số","Luôn sắp từ nhỏ đến lớn"],
        a: 0,
        h: "List tra bằng chỉ số 0, 1, 2. Còn dictionary?",
        s: "Dictionary tra bằng key tự chọn."
      },
      {
        k: "input",
        q: "<pre class=\"out\">tuoi = {\"An\": 10}\ntuoi[\"Binh\"] = 12\nprint(len(tuoi))</pre>In ra mấy?",
        a: 2,
        h: "Dòng thứ hai thêm một cặp mới.",
        s: "Thêm key mới làm bảng có 2 cặp."
      }
    ],
    note: "<b>Dictionary: tra bằng key (khóa), không tra bằng số thứ tự.</b><pre>tuoi = {\"An\": 10, \"Binh\": 12}\nprint(tuoi[\"An\"])       # 10\ntuoi = {\"An\": 10}\ntuoi[\"Binh\"] = 12\nprint(len(tuoi))        # 2\nprint(tuoi[\"Binh\"])     # 12</pre>\n• Mỗi mục là một cặp <b>key: value</b> (khóa: giá trị). Giống bảng tra: tra tên \"An\", ra tuổi 10.<br>\n• <code>tuoi[\"An\"]</code> <b>đọc</b> giá trị đi với key \"An\". <code>tuoi[\"Binh\"] = 12</code> <b>ghi</b>: key chưa có thì thêm cặp mới (bảng có 2 cặp), key đã có thì thay giá trị. Ví dụ ghi <code>tuoi[\"An\"] = 11</code> thì bảng vẫn 2 cặp, chỉ giá trị của An đổi.<br>\n• Khác list: list tra bằng số thứ tự (<code>a[0]</code>), dictionary tra bằng <b>key do bạn tự chọn</b>.<br>\n<b>Lỗi hay gặp:</b> nhầm key với value (tra bằng 10 để lấy tên là sai chiều); quên rằng thêm key mới làm bảng lớn lên còn ghi key cũ thì không; quên dấu ngoặc kép khi key là chữ (<code>tuoi[An]</code> sẽ tìm một biến tên An).<br>\n<b>Mẹo:</b> trước khi tra, hỏi \"mình đang cầm key hay đang cầm value?\". Tra luôn đi từ key sang value."
  },
{
    id: "h2",
    t: "Đếm bằng bảng tra",
    steps: [
      {
        k: "input",
        q: "<pre class=\"out\">d = {}\nd[\"a\"] = 1\nd[\"a\"] = d[\"a\"] + 1\nprint(d[\"a\"])</pre>In ra mấy?",
        a: 2,
        h: "Dòng 3 lấy giá trị cũ rồi cộng 1.",
        s: "Đếm: giá trị cũ cộng thêm 1 mỗi lần gặp."
      },
      {
        k: "choice",
        q: "<pre class=\"out\">d = {}\nprint(d[\"x\"])</pre>Chuyện gì xảy ra?",
        o: ["In ra 0","Báo KeyError vì chưa có key x","In ra None"],
        a: 1,
        h: "Bảng đang rỗng, key x chưa tồn tại.",
        s: "Key chưa có thì tra sẽ lỗi KeyError."
      },
      {
        k: "choice",
        q: "Cách an toàn để cộng đếm khi chưa chắc key đã có?",
        o: ["d[k] = d.get(k, 0) + 1","d[k] = d[k] + 1","d[k] + 1"],
        a: 0,
        h: "get(k, 0) trả 0 nếu chưa có key.",
        s: "d.get(k, 0) cho mặc định 0, tránh KeyError."
      },
      {
        k: "input",
        q: "Đếm chữ trong \"abca\": a xuất hiện mấy lần?",
        a: 2,
        h: "Đếm từng chữ a.",
        s: "a xuất hiện 2 lần."
      }
    ],
    note: "<b>Đếm bằng bảng tra: đọc số cũ, cộng 1, ghi lại.</b><pre>d = {}\nd[\"a\"] = 1\nd[\"a\"] = d[\"a\"] + 1\nprint(d[\"a\"])               # 2\nd = {}\nfor ch in \"abca\":\n    d[ch] = d.get(ch, 0) + 1\nprint(d[\"a\"])               # 2\nprint(d.get(\"z\", 0))        # 0</pre>\n• Mỗi lần gặp một chữ, làm đúng ba việc: <b>đọc</b> số lần cũ, <b>cộng 1</b>, <b>ghi lại</b> vào cùng key.<br>\n• Tra một key <b>chưa có</b> bằng <code>d[\"x\"]</code> thì Python báo <code>KeyError</code>: không trả 0, không bỏ qua.<br>\n• <code>d.get(k, 0)</code> nghĩa là: \"tra key k; nếu chưa có thì cho tôi 0\". Nhờ vậy lần đầu gặp một chữ, số cũ là 0, cộng 1 thành 1, không lỗi.<br>\n• Chạy tay \"abca\": a → {a:1}; b → {a:1, b:1}; c → {a:1, b:1, c:1}; a → {a:2, b:1, c:1}. Nên a xuất hiện 2 lần.<br>\n<b>Lỗi hay gặp:</b> viết <code>d[ch] = d[ch] + 1</code> khi key chưa có (lỗi ngay ở chữ đầu tiên); quên \"+ 1\" nên chỉ ghi lại số cũ; đặt <code>d = {}</code> bên trong vòng lặp nên bảng bị xóa mỗi vòng.<br>\n<b>Mẹo:</b> tự hỏi \"lần đầu gặp chữ này thì số cũ là mấy?\" Câu trả lời đúng là 0, và <code>d.get(ch, 0)</code> chính là cách nói điều đó."
  },
{
    id: "h3",
    t: "Hash map: đổi bộ nhớ lấy tốc độ",
    steps: [
      {
        k: "input",
        q: "Tìm một số trong list 1000 phần tử phải mở tối đa mấy hộp?",
        a: 1000,
        h: "Bài tìm tuyến tính trước đó.",
        s: "List: tối đa n bước."
      },
      {
        k: "choice",
        q: "Tra một key trong dictionary 1000 cặp, mất khoảng bao nhiêu bước?",
        o: ["Khoảng 1 bước","Khoảng 1000 bước","Khoảng 500 bước"],
        a: 0,
        h: "Dictionary nhảy thẳng tới chỗ chứa key, không mở từng hộp.",
        s: "Tra dictionary trung bình O(1)."
      },
      {
        k: "choice",
        q: "Two Sum: thấy số x, cần tìm số y = target - x đã gặp chưa. Nên lưu gì vào dictionary?",
        o: ["Các số đã gặp (key) và chỉ số của chúng","Chỉ target","Tổng tất cả"],
        a: 0,
        h: "Cần tra nhanh 'đã gặp y chưa'.",
        s: "Lưu số đã gặp: một lượt duyệt là đủ, O(n)."
      },
      {
        k: "input",
        q: "<pre class=\"out\">nums = [2, 7, 11]\ntarget = 9\nseen = {}\nfor i, x in enumerate(nums):\n    y = target - x\n    if y in seen:\n        print(seen[y], i)\n    seen[x] = i</pre>In ra hai số nào? Nhập chữ số ghép, ví dụ 0 và 1 thì nhập 1.",
        a: 1,
        h: "i=0: x=2, y=7 chưa thấy, lưu seen[2]=0. i=1: x=7, y=2 đã thấy ở chỉ số 0.",
        s: "In ra 0 1: nhập 1 (chỉ số hiện tại)."
      }
    ],
    note: "<b>Hash map: đổi một ít bộ nhớ lấy tốc độ.</b><br>\n• Tìm một số trong list 1000 phần tử, tệ nhất phải mở <b>1000 hộp</b> (n bước). Tra một key trong dictionary 1000 cặp, trung bình chỉ khoảng <b>1 bước</b> (gọi là O(1) trung bình). Bạn không phải duyệt cả bảng.<br>\n• Cái giá: dictionary phải <b>lưu thêm dữ liệu</b> (bộ nhớ). Đây là sự đánh đổi: tốn bộ nhớ để nhanh hơn.<br>\n<b>Two Sum</b>: tìm hai số có tổng bằng target. Mỗi lần thấy số x, cần số <code>y = target - x</code>. Hỏi \"y đã gặp chưa?\" bằng cách tra dictionary <code>seen</code> (key là số đã gặp, value là chỉ số của nó):<pre>nums = [2, 7, 11]\ntarget = 9\nseen = {}\nfor i, x in enumerate(nums):\n    y = target - x\n    if y in seen:\n        print(seen[y], i)     # 0 1\n    seen[x] = i</pre>\n• Chạy tay: i = 0, x = 2, y = 7, chưa có trong seen; ghi seen = {2: 0}. i = 1, x = 7, y = 2, <b>có</b> trong seen, value là 0; in <code>0 1</code>.<br>\n• Chỉ cần <b>một lượt duyệt</b> (O(n)) thay vì thử mọi cặp.<br>\n<b>Lỗi hay gặp:</b> ghi <code>seen[x] = i</code> <b>trước</b> khi kiểm tra: số có thể ghép với chính nó. Ví dụ <code>nums = [3]</code>, <code>target = 6</code>: ghi trước thì thấy y = 3 đã \"có\" và báo một cặp (0, 0) không có thật. Thứ tự đúng: <b>kiểm tra rồi mới ghi</b>.<br>\n<b>Mẹo:</b> \"O(1) trung bình\" là trung bình, không phải lời hứa mọi lần. Điều bạn cần nhớ là cách nghĩ: thay việc \"tìm lại từ đầu\" bằng \"nhớ sẵn rồi tra\"."
  }
];
