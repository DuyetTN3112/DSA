/* notes-foundation.js: trang sổ tay VIẾT TAY đợt 3 cho nhóm nền: Mẫu giáo còn thiếu (k1, k2, k4, k8, k9), ghép lệnh b1,
   hash map (h1, h2, h3), đệ quy (r1, r2, r3), linked list (n1, n2, n3). Đây là các bài nền của nhiều bài sau.
   Khuôn mỗi trang: ý chính, ví dụ chạy tay từng bước, lỗi hay gặp, mẹo tự kiểm tra. Dùng đúng ví dụ và thuật ngữ trong bài học.
   Mọi đoạn code trong <pre> được tools/verify-notes.js chạy bằng Python thật để đối chiếu kết quả ghi bên cạnh. Nạp sau notes-more.js. */
(() => {
  const N = {
    k1: `<b>Đếm là gán cho mỗi vật đúng một con số, lần lượt.</b><br>
• Chạm quả táo thứ nhất → "1". Chạm quả thứ hai → "2". Cứ thế. <b>Mỗi vật được chạm đúng một lần.</b><br>
• Chạm xong hết thì <b>số cuối cùng em vừa đọc chính là tổng số vật</b>. Không cần đếm lại từ đầu.<br>
• Nếu không có vật nào thì số là <b>0</b>. "0" nghĩa là "không có gì", và đó vẫn là một câu trả lời đúng. Ví dụ: có 🍎 🍎 mà hỏi "mấy quả chuối?" thì trả lời 0.<br>
<b>Lỗi hay gặp:</b> chạm sót một vật (đếm thiếu), chạm một vật hai lần (đếm thừa), hoặc đếm cả những vật không được hỏi (đề hỏi chuối mà đếm táo).<br>
<b>Vì sao học bài này?</b> Đếm đúng "mỗi vật một lần, không sót, không trùng" sau này gọi là <b>duyệt từng phần tử</b>. Mọi vòng lặp trong code đều làm đúng việc này.<br>
<b>Mẹo:</b> trước khi đếm, đọc kỹ đề hỏi đếm cái gì. Khi đếm, đẩy vật đã đếm sang một bên để khỏi đếm lại.`,

    k2: `<b>So sánh: đếm xong rồi mới so.</b><br>
• Bên nào có số lớn hơn thì <b>nhiều hơn</b>, số nhỏ hơn thì <b>ít hơn</b>, hai số giống nhau thì <b>bằng nhau</b>. Ví dụ ⭐⭐ và 🌙🌙: hai bên đều 2, bằng nhau, dù hình khác nhau.<br>
• Dấu <code>&gt;</code> giống cái miệng cá sấu: <b>miệng luôn há về phía số lớn hơn</b>. 7 &gt; 4 đúng; 9 &gt; 12 sai vì 12 mới là số lớn hơn.<br>
• <b>Bằng nhau thì chưa phải lớn hơn.</b> 5 &gt; 5 là <b>sai</b>.<br>
Về sau, máy hỏi y như vậy và trả lời <code>True</code> (đúng) hoặc <code>False</code> (sai):<pre>print(7 &gt; 4)    # True
print(9 &gt; 12)   # False
print(5 &gt; 5)    # False</pre>
<b>Lỗi hay gặp:</b> so sánh bằng mắt trước khi đếm (bên nào "trông" dày hơn); đọc ngược miệng cá sấu; coi hai số bằng nhau là "lớn hơn". Lỗi cuối cùng này gây rất nhiều bug trong code: <code>x &gt; best</code> khác <code>x &gt;= best</code> đúng ở trường hợp hai số bằng nhau.<br>
<b>Mẹo:</b> gặp hai số bằng nhau, luôn dừng lại hỏi: đề muốn "lớn hơn" hay "lớn hơn hoặc bằng"?`,

    k4: `<b>Cái tên và cái hộp: tên nằm ngoài, đồ nằm trong.</b><br>
• Nhiều hộp giống hệt nhau thì không biết hộp nào đựng gì. Ta dán <b>nhãn</b>. Cái nhãn là <b>tên</b> của hộp.<br>
• Hộp "bút" đang chứa ✏️. Đổi ✏️ thành 🖊️ thì <b>nhãn "bút" vẫn nguyên</b>, chỉ thứ bên trong đổi. Đây chính là <b>biến</b>: tên giữ nguyên, giá trị bên trong có thể đổi.<br>
• Hộp "tuổi" chứa 10. Sang năm cộng 1: <code>10 → 11</code>. Hộp vẫn tên "tuổi", bên trong giờ là 11.<br>
• Hộp "a" chứa 5, hộp "b" chứa 3. Đổ cả hai vào hộp "c": <code>5 + 3 = 8</code>, hộp "c" chứa 8. Hộp "a" và "b" vẫn còn nguyên khi ta chỉ lấy giá trị của chúng ra dùng.<br>
• Hai hộp khác tên vẫn có thể cùng chứa số 4. Tên chỉ để <b>tìm hộp</b>, không nói hộp chứa gì.<br>
<b>Lỗi hay gặp:</b> tưởng đổi đồ trong hộp thì phải đổi cả tên; tưởng hai hộp chứa cùng số thì là cùng một hộp; nhầm tên hộp với thứ bên trong.<br>
<b>Mẹo:</b> khi bí, vẽ các hộp ra giấy: nhãn ở ngoài, số ở trong. Sau mỗi bước, gạch số cũ và viết số mới vào hộp.`,

    k8: `<b>Tìm quy luật: tìm cái lặp lại.</b><br>
• Với hình: 🔴 🔵 🔴 🔵 🔴 ? → đỏ, xanh lặp lại nên tiếp theo là <b>xanh</b>. Với ⭐ ⭐ 🌙 ⭐ ⭐ 🌙 ⭐ ⭐ ? thì cả cụm "hai sao, một trăng" lặp lại, nên tiếp theo là <b>trăng</b>.<br>
• Với số, hỏi: "từ số này sang số kế, thêm bao nhiêu hoặc gấp mấy lần?" Dãy 2, 4, 6, 8: mỗi lần <b>cộng 2</b> nên tiếp theo là 10. Dãy 1, 2, 4, 8: mỗi lần <b>nhân đôi</b> nên tiếp theo là 16.<br>
• Quy luật tốt phải <b>đúng với mọi cặp liền nhau</b>, không chỉ cặp đầu.<br>
<b>Lỗi hay gặp:</b> chốt quy luật khi mới nhìn hai số. Dãy 1, 2, 4 có thể là "nhân đôi" (tiếp theo là 8) hoặc "cộng 1, rồi cộng 2, rồi cộng 3" (tiếp theo là 7). Chỉ khi có thêm số mới biết cách nào đúng.<br>
<b>Vì sao học bài này?</b> Thấy được cái lặp lại là bước đầu để viết thành lệnh cho máy: một việc lặp lại chính là một vòng lặp.<br>
<b>Mẹo:</b> viết khoảng cách giữa các số liền nhau ra bên dưới (2, 2, 2 hoặc 1, 2, 4) rồi mới đoán.`,

    k9: `<b>Cầu nối: máy viết gì thì đọc ra lời thường như thế.</b><pre>x = 5
print(x)        # 5
x = 9
print(x)        # 9
a = [10, 20, 30]
print(a[2])     # 30</pre>
• <code>x = 5</code> đọc là <b>"bỏ số 5 vào hộp tên x"</b>. Dấu <code>=</code> ở đây là một <b>lệnh bỏ vào</b>, không phải câu khẳng định "x bằng 5" như trong toán.<br>
• <code>print(x)</code> nghĩa là "in ra cho em xem thứ đang nằm trong hộp x". Nó không đổi gì trong hộp.<br>
• Dòng sau <code>x = 9</code> <b>thay thế</b> số cũ. Hộp x giờ chứa 9, số 5 không còn.<br>
• <code>a[2]</code>: số trong ngoặc là <b>số người đứng trước</b> (xem bài thứ tự). Có 2 người đứng trước nên đó là phần tử <b>thứ ba</b> khi đếm thường ngày, ở đây là 30.<br>
<b>Lỗi hay gặp:</b> tưởng hộp x giữ cả 5 lẫn 9; đọc <code>a[2]</code> thành "phần tử thứ hai"; tưởng <code>print(x)</code> làm x mất đi.<br>
<b>Mẹo:</b> đọc từng dòng thành lời bằng đúng các từ "bỏ vào hộp", "in ra", "đứng trước". Đọc ra nghĩa thì mới viết và đọc được code.`,

    b1: `<b>Mỗi chỗ trong một dòng lệnh có một vai trò cố định.</b><pre>x = 5
y = x + 2
x = x + 1
print(x)     # 6
print(y)     # 7</pre>
• Trong <code>x = 5</code>: bên <b>trái</b> dấu <code>=</code> là <b>tên hộp</b>, bên <b>phải</b> là <b>thứ bỏ vào</b>. Không đổi chỗ được: <code>5 = x</code> làm Python báo <code>SyntaxError</code> vì không thể đặt tên hộp là số 5.<br>
• <code>y = x + 2</code>: lấy x (đang là 5) cộng 2, được 7, bỏ vào hộp y. Hộp x không đổi.<br>
• <code>x = x + 1</code> trông lạ nhưng đọc được: <b>vế phải tính trước</b> (x cũ là 5, cộng 1 được 6), rồi mới bỏ kết quả vào hộp x. Nên x thành 6, còn y vẫn là 7.<br>
• <code>print(x)</code>: mỗi ngoặc mở <code>(</code> cần đúng một ngoặc đóng <code>)</code>. Viết <code>print(x</code> thì Python báo <code>SyntaxError</code>.<br>
<b>Lỗi hay gặp:</b> viết ngược hai vế; tưởng <code>x = x + 1</code> là vô lý như trong toán; tưởng <code>y = x + 2</code> làm y luôn đi theo x về sau (y đã chốt là 7, x đổi thì y không đổi theo).<br>
<b>Mẹo:</b> trước khi viết, hỏi "chỗ bên trái cần loại mảnh gì? chỗ bên phải cần loại mảnh gì?". Viết xong thì đọc to thành lời: "lấy x cộng 2, bỏ vào hộp y".`,

    h1: `<b>Dictionary: tra bằng key (khóa), không tra bằng số thứ tự.</b><pre>tuoi = {"An": 10, "Binh": 12}
print(tuoi["An"])       # 10
tuoi = {"An": 10}
tuoi["Binh"] = 12
print(len(tuoi))        # 2
print(tuoi["Binh"])     # 12</pre>
• Mỗi mục là một cặp <b>key: value</b> (khóa: giá trị). Giống bảng tra: tra tên "An", ra tuổi 10.<br>
• <code>tuoi["An"]</code> <b>đọc</b> giá trị đi với key "An". <code>tuoi["Binh"] = 12</code> <b>ghi</b>: key chưa có thì thêm cặp mới (bảng có 2 cặp), key đã có thì thay giá trị. Ví dụ ghi <code>tuoi["An"] = 11</code> thì bảng vẫn 2 cặp, chỉ giá trị của An đổi.<br>
• Khác list: list tra bằng số thứ tự (<code>a[0]</code>), dictionary tra bằng <b>key do bạn tự chọn</b>.<br>
<b>Lỗi hay gặp:</b> nhầm key với value (tra bằng 10 để lấy tên là sai chiều); quên rằng thêm key mới làm bảng lớn lên còn ghi key cũ thì không; quên dấu ngoặc kép khi key là chữ (<code>tuoi[An]</code> sẽ tìm một biến tên An).<br>
<b>Mẹo:</b> trước khi tra, hỏi "mình đang cầm key hay đang cầm value?". Tra luôn đi từ key sang value.`,

    h2: `<b>Đếm bằng bảng tra: đọc số cũ, cộng 1, ghi lại.</b><pre>d = {}
d["a"] = 1
d["a"] = d["a"] + 1
print(d["a"])               # 2
d = {}
for ch in "abca":
    d[ch] = d.get(ch, 0) + 1
print(d["a"])               # 2
print(d.get("z", 0))        # 0</pre>
• Mỗi lần gặp một chữ, làm đúng ba việc: <b>đọc</b> số lần cũ, <b>cộng 1</b>, <b>ghi lại</b> vào cùng key.<br>
• Tra một key <b>chưa có</b> bằng <code>d["x"]</code> thì Python báo <code>KeyError</code>: không trả 0, không bỏ qua.<br>
• <code>d.get(k, 0)</code> nghĩa là: "tra key k; nếu chưa có thì cho tôi 0". Nhờ vậy lần đầu gặp một chữ, số cũ là 0, cộng 1 thành 1, không lỗi.<br>
• Chạy tay "abca": a → {a:1}; b → {a:1, b:1}; c → {a:1, b:1, c:1}; a → {a:2, b:1, c:1}. Nên a xuất hiện 2 lần.<br>
<b>Lỗi hay gặp:</b> viết <code>d[ch] = d[ch] + 1</code> khi key chưa có (lỗi ngay ở chữ đầu tiên); quên "+ 1" nên chỉ ghi lại số cũ; đặt <code>d = {}</code> bên trong vòng lặp nên bảng bị xóa mỗi vòng.<br>
<b>Mẹo:</b> tự hỏi "lần đầu gặp chữ này thì số cũ là mấy?" Câu trả lời đúng là 0, và <code>d.get(ch, 0)</code> chính là cách nói điều đó.`,

    h3: `<b>Hash map: đổi một ít bộ nhớ lấy tốc độ.</b><br>
• Tìm một số trong list 1000 phần tử, tệ nhất phải mở <b>1000 hộp</b> (n bước). Tra một key trong dictionary 1000 cặp, trung bình chỉ khoảng <b>1 bước</b> (gọi là O(1) trung bình). Bạn không phải duyệt cả bảng.<br>
• Cái giá: dictionary phải <b>lưu thêm dữ liệu</b> (bộ nhớ). Đây là sự đánh đổi: tốn bộ nhớ để nhanh hơn.<br>
<b>Two Sum</b>: tìm hai số có tổng bằng target. Mỗi lần thấy số x, cần số <code>y = target - x</code>. Hỏi "y đã gặp chưa?" bằng cách tra dictionary <code>seen</code> (key là số đã gặp, value là chỉ số của nó):<pre>nums = [2, 7, 11]
target = 9
seen = {}
for i, x in enumerate(nums):
    y = target - x
    if y in seen:
        print(seen[y], i)     # 0 1
    seen[x] = i</pre>
• Chạy tay: i = 0, x = 2, y = 7, chưa có trong seen; ghi seen = {2: 0}. i = 1, x = 7, y = 2, <b>có</b> trong seen, value là 0; in <code>0 1</code>.<br>
• Chỉ cần <b>một lượt duyệt</b> (O(n)) thay vì thử mọi cặp.<br>
<b>Lỗi hay gặp:</b> ghi <code>seen[x] = i</code> <b>trước</b> khi kiểm tra: số có thể ghép với chính nó. Ví dụ <code>nums = [3]</code>, <code>target = 6</code>: ghi trước thì thấy y = 3 đã "có" và báo một cặp (0, 0) không có thật. Thứ tự đúng: <b>kiểm tra rồi mới ghi</b>.<br>
<b>Mẹo:</b> "O(1) trung bình" là trung bình, không phải lời hứa mọi lần. Điều bạn cần nhớ là cách nghĩ: thay việc "tìm lại từ đầu" bằng "nhớ sẵn rồi tra".`,

    r1: `<b>Đệ quy: một bài lớn được giải nhờ chính bài đó ở cỡ nhỏ hơn.</b><pre>def dem(n):
    if n == 0:
        return 0
    return n + dem(n - 1)
print(dem(0))   # 0
print(dem(1))   # 1
print(dem(2))   # 3
print(dem(3))   # 6</pre>
• Hàm gồm <b>hai phần</b>. <b>Ca cơ sở</b>: <code>n == 0</code> thì trả 0 ngay, không gọi tiếp. <b>Bước đệ quy</b>: <code>n + dem(n - 1)</code>, giao phần còn lại cho chính hàm với bài nhỏ hơn.<br>
• Chạy tay từ nhỏ lên lớn: <code>dem(0) = 0</code>. <code>dem(1) = 1 + dem(0) = 1 + 0 = 1</code>. <code>dem(2) = 2 + dem(1) = 2 + 1 = 3</code>. <code>dem(3) = 3 + dem(2) = 3 + 3 = 6</code>.<br>
• Ý tưởng cốt lõi: <b>tin rằng bài nhỏ hơn đã được giải đúng</b>, rồi chỉ cần nói cách ghép nó với phần của mình.<br>
<b>Lỗi hay gặp:</b> không có ca cơ sở (xem bài sau); gọi lại hàm với bài <b>không nhỏ hơn</b> (<code>dem(n)</code> thay vì <code>dem(n - 1)</code>); quên <code>return</code> trước lời gọi đệ quy nên hàm trả về <code>None</code>.<br>
<b>Mẹo:</b> viết ra bảng giá trị của vài bài nhỏ nhất (0, 1, 2) trước. Khi thấy mỗi giá trị được tính từ giá trị ngay trước nó, bạn đã thấy bước đệ quy.`,

    r2: `<b>Ca cơ sở là chỗ dừng; vị trí của print quyết định thứ tự in.</b><pre>def dd(n):
    if n == 0:
        print("xong")
        return
    print(n)
    dd(n - 1)

def e(n):
    if n == 0:
        return
    e(n - 1)
    print(n)

dd(3)    # in ra: 3, 2, 1, xong
e(3)     # in ra: 1, 2, 3</pre>
• <b>Thiếu ca cơ sở</b> (xóa dòng <code>if n == 0</code>): hàm gọi mãi không dừng, đến khi Python báo <code>RecursionError</code>. Đây là lỗi đệ quy phổ biến nhất.<br>
• <code>dd</code>: <b>print đứng trước</b> lời gọi nên in lúc đi xuống: 3, 2, 1, rồi "xong". Dòng thứ 3 là 1.<br>
• <code>e</code>: <b>print đứng sau</b> lời gọi nên các lời gọi phải xuống tận đáy trước, rồi in lúc <b>quay về</b>: 1, 2, 3.<br>
<b>Lỗi hay gặp:</b> tưởng hai hàm in giống nhau vì chỉ khác vị trí một dòng; quên <code>return</code> sau ca cơ sở nên hàm chạy tiếp xuống phần dưới.<br>
<b>Mẹo:</b> với mỗi lời gọi, hỏi hai điều: "việc gì làm TRƯỚC khi gọi xuống?" và "việc gì làm SAU khi quay về?" Rồi chạy tay theo thứ tự đó.`,

    r3: `<b>Mỗi lần gọi là một tầng, và các tầng chồng lên nhau.</b><pre>def dem(n):
    if n == 0:
        return 0
    return n + dem(n - 1)
print(dem(900))    # 405450</pre>
• <code>dem(3)</code> gọi <code>dem(2)</code>, gọi <code>dem(1)</code>, gọi <code>dem(0)</code>: tổng cộng <b>4 lần gọi</b>, và cả 4 đang chờ cùng lúc (mỗi lần chiếm một tầng bộ nhớ). <code>dem(0)</code> trả về trước, rồi các tầng trên lần lượt hoàn thành.<br>
• Gọi <code>dem(1000)</code> thì cần <b>1001 tầng</b> cùng lúc (n + 1). Bộ nhớ tăng theo n, tức O(n).<br>
• Python giới hạn độ sâu đệ quy, thường là <b>khoảng 1000</b>. Vượt quá thì báo <code>RecursionError</code>. Vì vậy <code>dem(1000)</code> bị lỗi, còn <code>dem(900)</code> chạy được.<br>
• Tính tổng 1..n bằng <b>vòng lặp</b> chỉ cần vài biến, tức O(1) bộ nhớ, tiết kiệm hơn. Đệ quy đáng dùng khi bài toán <b>tự chia nhỏ</b> (cây, thư mục, tổ hợp).<br>
<b>Lỗi hay gặp:</b> dùng đệ quy cho bài chỉ cần vòng lặp rồi gặp <code>RecursionError</code> với n lớn; đếm thiếu một tầng (quên <code>dem(0)</code> cũng là một lần gọi).<br>
<b>Mẹo:</b> số lần gọi = n + 1, không phải n. Giới hạn chính xác có thể khác tùy bản Python, nên đừng dựa vào con số 1000 để thiết kế.`,

    n1: `<b>Linked list: mỗi nút biết nút kế tiếp, và chỉ biết vậy.</b><pre>class Nut:
    def __init__(self, v):
        self.v = v
        self.next = None

a = Nut(5)
b = Nut(8)
c = Nut(2)
a.next = b
b.next = c
print(a.v)              # 5
print(a.next.v)         # 8
print(a.next.next.v)    # 2
print(c.next)           # None</pre>
• Mỗi <b>nút</b> gồm hai phần: <b>giá trị</b> (<code>v</code>) và một <b>mũi tên</b> (<code>next</code>) chỉ tới nút kế tiếp.<br>
• <code>a.next = b</code> nghĩa là "mũi tên của a chỉ vào b". Nên <code>a.next</code> <b>chính là</b> nút b, và <code>a.next.v</code> là <code>b.v</code> = 8. Tương tự <code>a.next.next</code> là nút c, giá trị 2.<br>
• <code>c.next</code> là <code>None</code>: không có nút nào phía sau. <code>None</code> đánh dấu <b>nút cuối</b>.<br>
• Khác mảng: không có chỉ số. Muốn tới nút thứ ba phải đi theo mũi tên từng bước.<br>
<b>Lỗi hay gặp:</b> viết <code>a.v</code> khi muốn giá trị của nút kế (phải là <code>a.next.v</code>); đi quá nút cuối: <code>c.next.v</code> báo <code>AttributeError</code> vì <code>None</code> không có <code>v</code>.<br>
<b>Mẹo:</b> vẽ các hộp nối bằng mũi tên: [5]→[8]→[2]→None. Mỗi chấm <code>.next</code> là một bước đi theo mũi tên.`,

    n2: `<b>Đi dọc danh sách: đứng ở một nút, rồi theo mũi tên.</b><pre>class Nut:
    def __init__(self, v):
        self.v = v
        self.next = None

a = Nut(5); b = Nut(8); c = Nut(2)
a.next = b; b.next = c
cur = a
while cur is not None:
    print(cur.v)
    cur = cur.next</pre>
• <code>cur</code> là "ngón tay" chỉ vào nút đang xét. Mỗi vòng: in giá trị nút đang chỉ, rồi <b>dời ngón tay</b> sang nút kế bằng <code>cur = cur.next</code>.<br>
• Chạy tay: cur = a, in 5 → cur = b, in 8 → cur = c, in 2 → cur = <code>None</code>, điều kiện sai, dừng. Tổng cộng <b>3 dòng</b>, dòng cuối là 2.<br>
• Vòng lặp <b>tự dừng</b> khi gặp <code>None</code>. Bạn không cần biết trước danh sách dài bao nhiêu. Với n nút thì đi hết mất n bước (O(n)), giống duyệt mảng.<br>
<b>Lỗi hay gặp:</b> quên <code>cur = cur.next</code>: ngón tay đứng yên nên <code>cur is not None</code> không bao giờ sai, vòng lặp chạy mãi. Viết điều kiện <code>while cur.next is not None</code>: vòng dừng sớm một nút, bỏ sót nút cuối (chỉ in 5 và 8).<br>
<b>Mẹo:</b> điều kiện hỏi "ngón tay còn đang chỉ vào một nút thật không?", nên viết <code>cur is not None</code>, không phải <code>cur.next</code>.`,

    n3: `<b>Chèn vào đầu: nối nút mới vào danh sách cũ TRƯỚC, rồi mới đổi đầu.</b><pre>class Nut:
    def __init__(self, v):
        self.v = v
        self.next = None

a = Nut(5); b = Nut(8)
a.next = b
head = a
new = Nut(9)
new.next = head
head = new
print(head.v)               # 9
print(head.next.v)          # 5
print(head.next.next.v)     # 8</pre>
• Ban đầu <code>head</code> chỉ vào a: danh sách là 5 → 8.<br>
• <code>new.next = head</code>: mũi tên của nút mới chỉ vào <b>nút đầu cũ</b> (a). Lúc này danh sách cũ vẫn còn nguyên, chỉ có thêm nút mới đứng trước nó.<br>
• <code>head = new</code>: giờ mới đổi "đầu" thành nút mới. Kết quả 9 → 5 → 8.<br>
• <b>Thứ tự hai dòng rất quan trọng.</b> Nếu chạy <code>head = new</code> trước, thì <code>head</code> đã chỉ vào new, và dòng <code>new.next = head</code> khiến nút mới <b>chỉ vào chính nó</b>. Từ <code>head</code> không còn đường nào đi tới 5 và 8 nữa: danh sách <b>bị đứt khỏi đầu</b>. (Trong ví dụ này biến <code>a</code>, <code>b</code> vẫn còn giữ hai nút, nhưng chương trình thật thường không có biến phụ như vậy, và hai nút sẽ mất hẳn.)<br>
• Chèn vào đầu chỉ đổi <b>vài mũi tên</b>, dù danh sách có 1 triệu nút: O(1). Với mảng, chèn vào đầu phải <b>dời mọi phần tử sang phải</b> một ô: O(n). Đó là lý do có linked list.<br>
<b>Lỗi hay gặp:</b> đảo thứ tự hai dòng; quên đổi <code>head</code> nên nút mới được tạo mà không ai tìm thấy.<br>
<b>Mẹo:</b> trước khi đổi một mũi tên, hỏi "mũi tên cũ này đang giữ nút nào? nếu đổi nó thì có nút nào mất không?" Luôn nối cái mới vào trước, đổi cái cũ sau.`
  };
  for (const id in N) if (LES[id] && !LES[id].note) LES[id].note = N[id];
})();
