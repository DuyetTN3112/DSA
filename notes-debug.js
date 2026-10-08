/* notes-debug.js: trang sổ tay VIẾT TAY đợt 4: đọc thông báo lỗi và phòng debug (e1 đến e4), BFS (g2), DFS (g3), quy hoạch động mở đầu (dp1).
   Khuôn mỗi trang: ý chính, ví dụ chạy tay từng bước, lỗi hay gặp, mẹo tự kiểm tra. Dùng đúng ví dụ và thuật ngữ trong bài học.
   Mọi đoạn code trong <pre> được tools/verify-notes.js chạy bằng Python thật để đối chiếu kết quả ghi bên cạnh. Nạp sau notes-foundation.js. */
(() => {
  const N = {
    e1: `<b>Thông báo lỗi không phải lời mắng. Đó là Python đang nói cho bạn biết chuyện gì xảy ra.</b><br>
Đọc theo thứ tự này:<br>
• <b>Dòng cuối cùng</b> trước: có <b>tên lỗi</b> và <b>thông điệp</b>.<br>
• Rồi tìm <b>số dòng</b> (<code>line N</code>) cho biết lỗi xảy ra ở dòng nào.<br>
• Rồi nhìn dòng code đó và tự hỏi: "dòng này đang cần gì mà không có?"<br>
Bốn lỗi hay gặp nhất, ứng với bốn đoạn trong bài:<br>
• <code>nums = [10, 20, 30]</code> rồi <code>nums[3]</code> → <code>IndexError: list index out of range</code>. Ba phần tử thì chỉ số hợp lệ là 0, 1, 2. <b>n phần tử thì chỉ số lớn nhất là n - 1.</b><br>
• <code>d = {"a": 1}</code> rồi <code>d["b"]</code> → <code>KeyError: 'b'</code>. Tra một key chưa từng được ghi vào.<br>
• <code>"5" + 2</code> → <code>TypeError</code>. Chữ và số không cộng trực tiếp được.<br>
• <code>print(tong)</code> khi chưa có dòng nào tạo biến <code>tong</code> → <code>NameError: name 'tong' is not defined</code>. Dùng hộp chưa tạo.<br>
<b>Lỗi hay gặp:</b> đọc dòng đầu của thông báo rồi hoảng, không đọc dòng cuối; sửa code ở dòng khác với dòng Python chỉ ra; thấy <code>IndexError</code> rồi thêm <code>try/except</code> để "cho hết đỏ" thay vì hỏi vì sao chỉ số vượt quá.<br>
<b>Mẹo:</b> trả lời ba câu rồi mới sửa: <i>Lỗi gì? Ở dòng nào? Dòng đó đang cần gì mà không có?</i> Một thông báo lỗi chỉ ra chỗ gần nhất với nguyên nhân, nhưng nguyên nhân thật đôi khi nằm ở dòng trước đó.`,

    e2: `<b>Lỗi lệch một (off-by-one): vòng lặp dừng sớm hoặc chạy quá một phần tử.</b><pre>nums = [1, 2, 3]
total = 0
for i in range(len(nums) - 1):
    total += nums[i]
print(total)    # 3</pre>
• Chương trình <b>không báo lỗi gì</b> nhưng in 3, trong khi 1 + 2 + 3 = 6. Đây là <b>lỗi logic</b>: Python không biết bạn muốn gì, nên không thể báo.<br>
• Dò tay từng vòng: <code>len(nums) - 1</code> là 2, nên <code>range(2)</code> cho <code>i = 0, 1</code>. Chỉ cộng <code>nums[0] + nums[1] = 1 + 2 = 3</code>. Phần tử ở chỉ số <b>2</b> (phần tử cuối) bị bỏ sót.<br>
• Lý do: <code>range(len(nums))</code> <b>đã</b> dừng ở <code>len - 1</code> rồi (nó không bao gồm số cuối). Trừ thêm 1 là thừa.<pre>nums = [1, 2, 3]
total = 0
for i in range(len(nums)):
    total += nums[i]
print(total)    # 6</pre>
<b>Lỗi hay gặp:</b> nhớ "chỉ số lớn nhất là n - 1" rồi áp dụng nó hai lần (một lần trong <code>range</code>, một lần nữa bằng tay). Hoặc ngược lại, dùng <code>range(len(nums) + 1)</code> rồi gặp <code>IndexError</code>.<br>
<b>Mẹo:</b> thử bằng <b>danh sách chỉ có 1 phần tử</b>. Với <code>[5]</code>, bản sai cho tổng 0 vì <code>range(0)</code> không chạy lần nào. Dễ thấy hơn nhiều so với danh sách dài.`,

    e3: `<b>Giá trị khởi tạo sai: lỗi nằm ở dòng TRƯỚC vòng lặp.</b><pre>nums = [1, 2, 3]
total = 1
for x in nums:
    total += x
print(total)    # 7
nums = [-5, -2, -9]
best = 0
for x in nums:
    if x &gt; best:
        best = x
print(best)     # 0</pre>
• <b>Cộng dồn:</b> bắt đầu từ <code>total = 1</code> thì 1 thừa bị cộng vào kết quả: 1 + 1 + 2 + 3 = 7, đúng là 6. Giá trị khởi tạo đúng cho phép cộng là <b>0</b> (cộng 0 không làm thay đổi gì).<br>
• <b>Tìm số lớn nhất:</b> với <code>[-5, -2, -9]</code>, mốc <code>best = 0</code> lớn hơn mọi số trong danh sách, nên không số nào thay được nó. Kết quả là 0, một số <b>không hề có trong danh sách</b>.<br>
• Cách sửa: lấy <b>phần tử đầu tiên</b> làm mốc: <code>best = nums[0]</code>. Lúc đó kết quả là -2, đúng.<br>
<b>Vì sao test bình thường không phát hiện?</b> Với <code>[1, 2, 3]</code>, mốc <code>best = 0</code> cho kết quả 3, trùng với đáp án đúng. Chỉ khi <b>mọi số đều âm</b> thì lỗi mới lộ. Test chỉ lộ lỗi khi nó đúng chỗ yếu của code.<br>
<b>Lỗi hay gặp:</b> chọn đại một số cho tiện (0, 1, hoặc một số "rất nhỏ") mà không hỏi "số đó có phải trung hòa với phép toán này không?" Phép cộng cần 0, phép nhân cần 1, tìm lớn nhất cần một phần tử có thật.<br>
<b>Mẹo:</b> luôn thử thêm hai ca: danh sách toàn số âm, và danh sách rỗng (rỗng thì <code>nums[0]</code> báo <code>IndexError</code>, nghĩa là bạn phải quyết định hàm làm gì với đầu vào rỗng).`,

    e4: `<b>Lỗi logic: code chạy được, không có thông báo nào, nhưng kết quả sai.</b><pre>def dem_chan(nums):
    c = 0
    for x in nums:
        if x % 2 == 1:
            c += 1
    return c
print(dem_chan([2, 4, 5]))    # 1</pre>
• Tên hàm là "đếm số chẵn", đúng phải ra <b>2</b> (số 2 và 4). Hàm in 1 vì <code>x % 2 == 1</code> là điều kiện của số <b>lẻ</b> (chia 2 dư 1). Hàm đang đếm số lẻ.<br>
• Sửa: <code>x % 2 == 0</code>. Khi đó <code>dem_chan([2, 4, 5])</code> ra 2.<br>
<b>Ba loại lỗi, ai phát hiện?</b><br>
• <b>Lỗi cú pháp</b> (thiếu <code>:</code>, thiếu ngoặc): Python báo <b>trước khi chạy</b>.<br>
• <b>Lỗi khi chạy</b> (exception như <code>IndexError</code>, <code>KeyError</code>): Python báo <b>giữa chừng</b>, kèm tên lỗi và số dòng.<br>
• <b>Lỗi logic</b>: Python <b>không biết</b>. Chỉ có bạn (hoặc test) phát hiện được bằng cách so với kết quả mong đợi.<br>
<b>Cách debug có phương pháp:</b> (1) ghi ra kết quả <b>mong đợi</b> bằng tay; (2) chạy, ghi kết quả <b>thực tế</b>; (3) tìm bước <b>đầu tiên</b> hai bên lệch nhau (in giá trị biến sau từng vòng); (4) sửa <b>một thứ</b> rồi chạy lại.<br>
<b>Lỗi hay gặp:</b> sửa bừa nhiều chỗ cùng lúc cho tới khi ra đúng một ví dụ; không viết sẵn kết quả mong đợi nên không biết mình đang sai hay đúng.<br>
<b>Mẹo:</b> một ví dụ đúng không chứng minh code đúng. Thử thêm ca khác: danh sách rỗng, chỉ có số lẻ, chỉ có số chẵn.`,

    g2: `<b>BFS: đi từ gần tới xa, từng lớp một, bằng hàng đợi.</b><pre>ban = {"An": ["Binh", "Chi"], "Binh": ["An", "Dung"], "Chi": ["An"], "Dung": ["Binh"]}
q = ["An"]
seen = {"An"}
while q:
    x = q.pop(0)
    print(x)
    for y in ban[x]:
        if y not in seen:
            seen.add(y)
            q.append(y)</pre>
• <code>q</code> là <b>hàng đợi</b>: thêm vào cuối, lấy ra từ đầu (vào trước, ra trước, như bài Queue). <code>seen</code> là tập những người <b>đã được xếp vào hàng</b>.<br>
• Chạy tay: q = [An]. Lấy An, in An; bạn của An là Binh, Chi, chưa thấy, thêm cả hai: q = [Binh, Chi]. Lấy Binh, in Binh; bạn của Binh là An (đã thấy, bỏ qua) và Dung (mới): q = [Chi, Dung]. Lấy Chi, in Chi. Lấy Dung, in Dung. Hết hàng, dừng.<br>
• Thứ tự in: <b>An, Binh, Chi, Dung</b>, 4 dòng. Dòng thứ 2 là Binh vì Binh vào hàng trước Chi.<br>
• Vì hàng đợi trả ra người vào trước, nên <b>mọi người cách An 1 bước đều được lấy ra trước mọi người cách 2 bước</b>. Đó là lý do BFS đi từ gần tới xa. Dung cách An <b>2 bước</b> (An → Binh → Dung).<br>
• <code>seen</code> cần thiết vì đồ thị có <b>đường vòng</b> (An là bạn của Binh, Binh cũng là bạn của An). Không đánh dấu thì cứ quay đi quay lại mãi.<br>
<b>Lỗi hay gặp:</b> đánh dấu <code>seen</code> lúc <b>lấy ra</b> thay vì lúc <b>xếp vào hàng</b> nên một người có thể bị xếp nhiều lần; dùng nhầm đầu ra (lấy từ cuối) thì thành DFS, không còn "gần tới xa"; quên <code>seen</code> nên chạy mãi.<br>
<b>Mẹo:</b> bài này dùng list và <code>pop(0)</code> cho dễ đọc. Với dữ liệu lớn nên dùng <code>deque</code> và <code>popleft()</code>, vì <code>pop(0)</code> trên list phải dời mọi phần tử còn lại.`,

    g3: `<b>DFS: đi sâu hết một đường, hết đường mới quay lại.</b><pre>ban = {"An": ["Binh", "Chi"], "Binh": ["An", "Dung"], "Chi": ["An"], "Dung": ["Binh"]}
seen = set()
def dfs(x):
    seen.add(x)
    print(x)
    for y in ban[x]:
        if y not in seen:
            dfs(y)
dfs("An")</pre>
• Chạy tay: <code>dfs(An)</code>: in An. Bạn đầu tiên là Binh (chưa thấy) → <code>dfs(Binh)</code>: in Binh. Bạn của Binh: An (đã thấy), Dung (mới) → <code>dfs(Dung)</code>: in Dung. Bạn của Dung là Binh (đã thấy), hết, <b>quay về</b> Binh, hết, quay về An. Bạn kế của An là Chi (chưa thấy) → <code>dfs(Chi)</code>: in Chi.<br>
• Thứ tự in: <b>An, Binh, Dung, Chi</b>, 4 dòng. Dòng thứ 3 là Dung (BFS in Chi ở dòng này). Cùng đồ thị, khác thứ tự thăm.<br>
• <code>dfs</code> <b>gọi chính nó</b>: đây là <b>đệ quy</b> trên đồ thị. Ca cơ sở nằm ngầm: khi mọi bạn đều đã thăm thì vòng <code>for</code> không gọi thêm lần nào, hàm kết thúc.<br>
<b>BFS hay DFS?</b> Muốn tìm đường đi <b>ít bước nhất</b> thì dùng BFS (đi từng lớp nên gặp đích ở lớp gần nhất trước, khi mọi đường nối coi như dài bằng nhau). DFS hợp với câu hỏi "có đi tới được không", "đếm vùng nối liền", hoặc khi cần đi sâu hết một nhánh.<br>
<b>Lỗi hay gặp:</b> quên đánh dấu <code>seen</code> trước khi gọi tiếp (lặp mãi, <code>RecursionError</code>); tưởng DFS cũng cho đường ngắn nhất.<br>
<b>Mẹo:</b> đồ thị rất sâu thì DFS đệ quy cũng chịu giới hạn độ sâu như bài Mỗi lần gọi là một tầng.`,

    dp1: `<b>Quy hoạch động bắt đầu từ một câu hỏi: có đang tính lại cùng một việc không?</b><pre>def fib(n):
    if n &lt; 2:
        return n
    return fib(n - 1) + fib(n - 2)
print(fib(4))    # 3</pre>
• Quy tắc: <code>fib(0) = 0</code>, <code>fib(1) = 1</code>, <code>fib(2) = 1</code>, <code>fib(3) = 2</code>, <code>fib(4) = 3</code> (mỗi số là tổng hai số ngay trước).<br>
• Khi tính <code>fib(4)</code>: nó gọi <code>fib(3)</code> và <code>fib(2)</code>; mà <code>fib(3)</code> lại gọi <code>fib(2)</code> lần nữa. Vậy <code>fib(2)</code> bị tính <b>2 lần</b>, cùng một việc làm lặp lại. Đây gọi là <b>bài con trùng lặp</b>.<br>
• Với số lớn thì lãng phí khủng khiếp: số lần gọi tăng gần gấp đôi mỗi khi n tăng 1. Tính <code>fib(50)</code> theo cách này cần hơn 40 tỷ lần gọi.<br>
• Cách khắc phục: <b>tính xong thì ghi vào dictionary, lần sau tra ra</b>. Kỹ thuật này gọi là <b>memo</b> (ghi nhớ):<pre>memo = {}
def fib(n):
    if n &lt; 2:
        return n
    if n in memo:
        return memo[n]
    memo[n] = fib(n - 1) + fib(n - 2)
    return memo[n]
print(fib(50))    # 12586269025</pre>
• Giờ mỗi bài con (<code>fib(2)</code> đến <code>fib(50)</code>, tức 49 bài) chỉ tính <b>đúng một lần</b>, các lần sau chỉ tra bảng.<br>
<b>Lỗi hay gặp:</b> ghi vào <code>memo</code> nhưng quên <b>tra</b> trước khi tính (nên không tiết kiệm gì); đặt <code>memo = {}</code> bên trong hàm nên bảng bị xóa mỗi lần gọi.<br>
<b>Mẹo:</b> trước khi tối ưu, tự hỏi hai câu: "bài con nào bị tính lại?" và "kết quả của nó có phụ thuộc vào thứ gì khác ngoài đầu vào của nó không?" Nếu không phụ thuộc gì khác thì ghi nhớ được.`
  };
  for (const id in N) if (LES[id] && !LES[id].note) LES[id].note = N[id];
})();
