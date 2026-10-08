/* notes-apps.js: trang sổ tay VIẾT TAY đợt 5: mini project (m1 đến m3), giới hạn tốc độ (rl1), ứng dụng thực tế (ap1 đến ap4, ap6).
   Khuôn mỗi trang: ý chính, ví dụ chạy tay từng bước, lỗi hay gặp, mẹo tự kiểm tra. Dùng đúng ví dụ và thuật ngữ trong bài học.
   Mọi đoạn code trong <pre> được tools/verify-notes.js chạy bằng Python thật để đối chiếu kết quả ghi bên cạnh. Nạp sau notes-debug.js. */
(() => {
  const N = {
    m1: `<b>Yêu cầu thật luôn là một câu ngắn, còn chi tiết nằm trong đầu người viết ra nó.</b><br>
\"Hệ thống tính số dư từ danh sách giao dịch\" nghe đủ rõ, nhưng thử hỏi: giao dịch trông như thế nào? Rút nhiều hơn số dư thì sao? Nhiều người sẽ code ngay rồi mới phát hiện mình đã hiểu khác khách. Việc đầu tiên là <b>hỏi</b>, chưa phải viết.<br>
Ba nhóm câu hỏi làm rõ, dùng được cho mọi đề:<br>
• <b>Dữ liệu vào:</b> có những trường nào, trường nào bắt buộc (ở bài này: <code>id</code>, <code>type</code>, <code>amount</code>, đủ cả 3)? Danh sách rỗng thì sao?<br>
• <b>Quy tắc ở chỗ biên:</b> số dư có được âm không? <code>amount</code> bằng 0 hay âm thì sao? Hai giao dịch trùng <code>id</code> thì sao?<br>
• <b>Kết quả ra:</b> trả một con số, hay báo lỗi khi dữ liệu xấu?<br>
<b>Ví dụ chạy tay: cùng một dữ liệu, hai cách hiểu, hai kết quả.</b> Nạp 100 rồi rút 150:<pre>def so_du(lo, cho_am):
    s = 0
    for loai, tien in lo:
        s = s + tien if loai == "nap" else s - tien
        if s &lt; 0 and not cho_am:
            raise ValueError("so du am")
    return s
print(so_du([("nap", 100), ("rut", 150)], True))    # -50</pre>
• Nếu khách chọn \"cho âm\" thì kết quả là <b>-50</b>. Nếu khách chọn \"không cho âm\" thì cũng đúng dữ liệu này nhưng hàm phải <b>báo lỗi</b> <code>ValueError</code>. Cả hai chương trình đều \"đúng\", chỉ khác là bạn đang trả lời câu hỏi nào. Code không thể tự biết, nên người viết phải hỏi.<br>
• Khách im lặng thì <b>đừng im lặng theo</b>: tự chọn một cách, <b>ghi giả định ra</b> (ví dụ \"không cho số dư âm\") và gửi lại để họ xác nhận.<br>
<b>Lỗi hay gặp:</b> mở editor ngay vì \"bài dễ\"; tự chọn giả định rồi không nói với ai; hỏi chung chung kiểu \"anh còn yêu cầu gì không?\" (người nghe không biết trả lời gì) thay vì hỏi cụ thể \"rút quá số dư thì cho âm hay từ chối?\".<br>
<b>Mẹo:</b> trước khi code, viết ra 3 giả định và 2 ví dụ vào-ra. Nếu không viết nổi một ví dụ cụ thể thì chưa hiểu đủ để code. Một câu hỏi tốt thường có dạng \"nếu... thì...?\".`,

    m2: `<b>Liệt kê những dữ liệu xấu có thể xảy ra TRƯỚC khi code, vì chính danh sách đó sẽ thành các ca test.</b><br>
Danh sách 5 giao dịch trong bài:<br>
• <code>{id 1, deposit, 100}</code> hợp lệ.<br>
• <code>{id 2, withdraw, 30}</code> hợp lệ.<br>
• <code>{id 2, deposit, 10}</code> <b>trùng id</b> với dòng trên → lỗi 1.<br>
• <code>{id 3, gift, 5}</code> <b>loại lạ</b>, không phải <code>deposit</code> hay <code>withdraw</code> → lỗi 2.<br>
• <code>{id 4, deposit, -20}</code> <b>số tiền âm</b> → lỗi 3.<br>
Vậy có <b>3</b> giao dịch không hợp lệ (đếm giao dịch id 2 thứ hai, không đếm cái đầu). Chạy lại bằng code:<pre>txs = [{"id": 1, "type": "deposit", "amount": 100}, {"id": 2, "type": "withdraw", "amount": 30}, {"id": 2, "type": "deposit", "amount": 10}, {"id": 3, "type": "gift", "amount": 5}, {"id": 4, "type": "deposit", "amount": -20}]
seen = set()
loi = 0
for t in txs:
    if t["id"] in seen or t["type"] not in ("deposit", "withdraw") or t["amount"] &lt; 0:
        loi += 1
    seen.add(t["id"])
print(loi)    # 3</pre>
<b>Hai loại lỗi, hai cách xử lý:</b><br>
• <b>Lỗi dự đoán được</b> (người dùng nhập <code>amount = -50</code>): ta biết trước nên <b>kiểm tra rồi báo</b> bằng <code>raise ValueError(...)</code> với thông điệp rõ nghĩa.<br>
• <b>Lỗi bất ngờ</b> (hết bộ nhớ, mất kết nối giữa chừng): không biết trước, chỉ bắt được ở tầng ngoài, ghi log và báo cho người vận hành.<br>
<b>Vì sao kiểm tra hết rồi mới tính?</b> Nếu vừa tính vừa kiểm tra mà giao dịch thứ 900 mới hỏng, bạn đã tính (và có thể đã ghi) 899 giao dịch trước nó: kết quả dở dang, khó biết đã làm tới đâu. Kiểm tra toàn bộ trước thì hoặc cả lô được xử lý, hoặc không động tới gì.<br>
<b>Với tiền, im lặng bỏ qua dữ liệu xấu là nguy hiểm.</b> Bỏ giao dịch hỏng mà không báo thì số dư sai mà không ai biết. Hãy báo rõ <i>giao dịch nào</i> sai và vì sao.<br>
<b>Lỗi hay gặp:</b> chỉ nghĩ tới dữ liệu đẹp; đếm nhầm (đếm cả hai giao dịch id 2); nhét <code>try/except</code> bao hết để \"cho chạy\" rồi nuốt lỗi.<br>
<b>Mẹo:</b> với mỗi trường, hỏi ba câu: <i>Thiếu thì sao? Sai kiểu thì sao? Sai giá trị thì sao?</i> Mỗi câu trả lời là một ca test.`,

    m3: `<b>Chia việc thành đường ống: kiểm tra đầu vào → tính → trả kết quả.</b> Mỗi khâu làm một việc, và biết lỗi của mình là gì.<br>
<b>Chạy tay phần tính.</b> Giao dịch <code>[100, -30, -50]</code> (dương là nạp, âm là rút):<pre>t = [100, -30, -50]
total = 0
for x in t:
    total += x
print(total)    # 20</pre>
• 0 + 100 = 100; 100 - 30 = 70; 70 - 50 = <b>20</b>. Rút thêm 80 từ số dư 20 thì được 20 - 80 = <b>-60</b>: âm, mà ta đã giả định không cho âm, nên đây là chỗ phải báo lỗi.<br>
<b>Vì sao kiểm tra số dư ngay sau mỗi lần rút, không chờ đến cuối?</b> Thử thứ tự rút 80 trước, nạp 100 sau:<pre>so_du = 0
thap_nhat = 0
for x in [-80, 100]:
    so_du += x
    thap_nhat = min(thap_nhat, so_du)
print(so_du, thap_nhat)    # 20 -80</pre>
• Cuối cùng số dư là +20 (trông ổn) nhưng giữa chừng đã xuống <b>-80</b>. Tài khoản thật không cho phép điều đó. Số dư phải hợp lệ <b>ở mọi thời điểm</b>, không chỉ ở cuối.<br>
<b>Đường ống đầy đủ:</b><pre>def xu_ly(lo):
    for x in lo:
        if not isinstance(x, int):
            raise TypeError("moi giao dich phai la so nguyen")
    so_du = 0
    for x in lo:
        so_du += x
        if so_du &lt; 0:
            raise ValueError("so du am")
    return so_du
print(xu_ly([100, -30, -50]))    # 20</pre>
<b>Chỗ dễ nhầm với bài trước:</b> bài \"liệt kê giao dịch không hợp lệ\" nói kiểm tra <i>hết đầu vào trước khi tính</i>, còn ở đây kiểm tra số dư <i>trong lúc tính</i>. Hai điều không mâu thuẫn. <b>Hình dạng dữ liệu</b> (đủ trường, đúng kiểu, không trùng id) kiểm tra được ngay từ danh sách nên làm trước. <b>Quy tắc phụ thuộc trạng thái</b> (số dư âm) chỉ biết được khi đã tính tới đó nên phải kiểm tra từng bước.<br>
<b>Lỗi hay gặp:</b> tính trước rồi mới kiểm tra (tính trên dữ liệu hỏng thì kết quả vô nghĩa); chỉ kiểm tra số dư ở cuối; trộn cả ba khâu vào một đống lệnh nên lỗi ở đâu cũng khó tìm.<br>
<b>Mẹo:</b> với mỗi khâu, tự trả lời \"khâu này nhận gì, trả gì, lỗi nào có thể xảy ra, khi đó hàm làm gì?\". Chưa trả lời được cho một khâu thì khâu đó chưa sẵn sàng để code.`,

    rl1: `<b>Giới hạn tốc độ: \"tối đa 2 yêu cầu trong mỗi 3 giây\". Hàng đợi giữ thời điểm các yêu cầu đã được chấp nhận.</b><br>
Muốn biết \"trong 3 giây gần nhất có mấy yêu cầu\" thì phải nhớ <b>thời điểm</b> của chúng, nhớ tên người gọi không giúp được gì. Quy tắc cho một yêu cầu mới lúc <code>t</code>:<br>
1. Bỏ khỏi đầu hàng mọi thời điểm <b>quá cũ</b>, tức nhỏ hơn hoặc bằng <code>t - 3</code>. Còn giữ lại những thời điểm <b>lớn hơn</b> <code>t - 3</code>.<br>
2. Nếu hàng còn ít hơn 2 thời điểm thì <b>chấp nhận</b> và ghi <code>t</code> vào cuối hàng. Hết chỗ thì <b>từ chối</b>.<br>
<b>Chạy tay với các yêu cầu lúc 1, 2, 3, 4</b> (giới hạn 2, cửa sổ 3):<br>
• <b>t = 1:</b> hàng rỗng, chấp nhận → hàng <code>[1]</code>.<br>
• <b>t = 2:</b> bỏ thời điểm <code>&lt;= -1</code>: không có. Hàng có 1 &lt; 2, chấp nhận → <code>[1, 2]</code>.<br>
• <b>t = 3:</b> bỏ thời điểm <code>&lt;= 0</code>: không có (1 và 2 đều lớn hơn 0). Hàng có 2, đủ rồi → <b>từ chối</b>, hàng giữ nguyên.<br>
• <b>t = 4:</b> bỏ thời điểm <code>&lt;= 1</code>: thời điểm 1 bị bỏ → <code>[2]</code>. Có 1 &lt; 2, chấp nhận → <code>[2, 4]</code>.<pre>q = []
res = []
for t in [1, 2, 3, 4]:
    while q and q[0] &lt;= t - 3:
        q.pop(0)
    if len(q) &lt; 2:
        q.append(t)
        res.append(True)
    else:
        res.append(False)
print(res)    # [True, True, False, True]</pre>
<b>Vì sao queue?</b> Yêu cầu đến sớm nhất cũng hết hạn đầu tiên, và nó nằm ở <b>đầu hàng</b>: vào trước, ra trước. Muốn bỏ cái cũ chỉ cần nhìn đầu hàng, không phải tìm khắp nơi. Vì có thể nhiều thời điểm cùng hết hạn một lúc nên dùng <code>while</code>, không dùng <code>if</code>.<br>
<b>Một quyết định nghiệp vụ phải ghi ra:</b> yêu cầu bị từ chối <b>không</b> được ghi vào hàng. Nếu ghi, người gửi dồn dập sẽ bị tính mãi và bị khóa vĩnh viễn. Thử ghi cả yêu cầu bị từ chối ở ví dụ trên thì kết quả đổi thành <code>[True, True, False, False]</code>: cùng dữ liệu, khác kết quả, nên quyết định này cần có test bảo vệ.<br>
<b>Lỗi hay gặp:</b> viết <code>&lt;</code> thay <code>&lt;=</code> khi bỏ thời điểm cũ (thời điểm 1 ở t = 4 không bị bỏ, kết quả cũng ra <code>[True, True, False, False]</code>); ghi cả yêu cầu bị từ chối; dùng stack nên bỏ nhầm thời điểm mới nhất.<br>
<b>Mẹo:</b> luôn thử đúng ca \"vừa chạm biên\" (ở đây là t = 4, đúng lúc thời điểm 1 hết hạn). Sai biên một đơn vị là lỗi phổ biến nhất của bài này.`,

    ap1: `<b>Cache: nhớ kết quả đã hỏi để khỏi hỏi lại chỗ chậm.</b><br>
Ý tưởng giống Two Sum: nhớ cái đã gặp để tra nhanh sau này. Ví dụ trong bài:<pre>seen = set()
hits = 0
for k in ["A", "B", "A", "A", "C", "B"]:
    if k in seen:
        hits += 1
    else:
        seen.add(k)
print(hits)    # 3</pre>
• Dò từng khóa: A mới, B mới, A trùng (trúng), A trùng (trúng), C mới, B trùng (trúng) → <b>3 lần trúng</b>, 3 lần trượt.<br>
• <b>Tiết kiệm bao nhiêu?</b> Hỏi cơ sở dữ liệu mất 100 ms, tra cache mất 1 ms. Có cache: 3 × 100 + 3 × 1 = <b>303 ms</b>. Không cache: 6 × 100 = 600 ms.<br>
Cache thật còn phải nhớ <b>giá trị</b>, nên dùng dictionary chứ không chỉ set:<pre>cache = {}
goi_db = 0
def gia(ma):
    global goi_db
    if ma not in cache:
        goi_db += 1
        cache[ma] = ma * 10
    return cache[ma]
for m in [1, 2, 1, 1, 3, 2]:
    gia(m)
print(goi_db)    # 3</pre>
• Sáu lần hỏi nhưng chỉ <b>3 lần</b> chạm cơ sở dữ liệu (cho mã 1, 2, 3). Dictionary tra theo khóa gần như một bước, đúng bài hash map.<br>
<b>Cái giá của cache: dữ liệu cũ (stale).</b><pre>db = {"A": 10}
cache = {}
cache["A"] = db["A"]
db["A"] = 12
print(cache["A"], db["A"])    # 10 12</pre>
• Giá gốc đã đổi thành 12 nhưng cache vẫn trả 10. Cache nhanh nhưng <b>không tự biết</b> dữ liệu gốc đã đổi. Vì thế hệ thống thật luôn nghĩ tới <b>hết hạn</b> (TTL) hoặc xóa cache khi dữ liệu đổi.<br>
<b>Lỗi hay gặp:</b> tưởng cache luôn có lợi (dữ liệu đổi liên tục thì cache hầu như toàn trượt, chỉ tốn thêm bộ nhớ); quên rằng cache có thể sai; lẫn \"trúng\" với \"trượt\".<br>
<b>Mẹo:</b> khi nghĩ tới cache, hỏi hai câu: <i>cùng một câu hỏi có lặp lại nhiều không?</i> và <i>câu trả lời cũ có thể sai trong bao lâu mà chấp nhận được?</i> Cả hai đều có đáp án tốt thì cache mới đáng dùng.`,

    ap2: `<b>Hàng đợi công việc (job queue): việc nào đến trước thì làm trước.</b><br>
Máy in, gửi email, xử lý đơn hàng đều có lúc việc đến dồn dập hơn khả năng làm. Cho việc <b>xếp hàng</b> và làm dần, thay vì từ chối hoặc làm hết cùng lúc (có thể làm sập máy).<br>
<b>Chạy tay.</b> Ba việc A, B, C xếp hàng, sau đó lấy ra hai lần:<pre>q = []
q.append("A")
q.append("B")
q.append("C")
q.pop(0)
q.pop(0)
print(q)    # ['C']</pre>
• <code>append</code> đưa việc vào <b>cuối</b> hàng: <code>[A, B, C]</code>. <code>pop(0)</code> lấy việc ở <b>đầu</b> hàng: lần một lấy A, lần hai lấy B. Còn lại <code>['C']</code>, tức <b>1</b> việc.<br>
• Việc làm đầu tiên là <b>A</b>: vào trước, ra trước (FIFO).<br>
<b>Vì sao không dùng stack?</b> Với stack, việc đến sau chen lên trước:<pre>s = ["A", "B", "C"]
print(s.pop())    # C</pre>
• Stack lấy ra <b>C</b> trước. Khi việc liên tục đến, A có thể chờ mãi vì luôn có việc mới chen lên trên. Queue công bằng và dự đoán được thứ tự, đó là lý do hàng chờ dùng queue.<br>
<b>Lỗi hay gặp:</b> nhầm <code>pop()</code> (lấy cuối, kiểu stack) với <code>pop(0)</code> (lấy đầu, kiểu queue); lấy ra từ hàng rỗng (<code>[].pop(0)</code> báo <code>IndexError</code>), nên cần kiểm tra hàng còn việc không trước khi lấy.<br>
<b>Lưu ý:</b> <code>pop(0)</code> trên list phải dời mọi phần tử còn lại, chậm khi hàng dài. Hệ thống thật dùng <code>deque</code> (như bài hàng đợi). Ở đây dùng list cho dễ nhìn.<br>
<b>Mẹo:</b> khi đọc đề, tìm câu hỏi \"ai được phục vụ trước?\". Đáp án \"người đến trước\" là queue, \"việc mới nhất\" là stack.`,

    ap3: `<b>Stack trong đời thật: Undo, và kiểm tra ngoặc.</b> Cả hai đều theo nguyên tắc <b>vào sau, ra trước</b>.<br>
<b>Undo.</b> Mỗi thao tác soạn thảo được đẩy vào stack, mỗi lần Undo lấy ra thao tác trên cùng:<pre>history = []
history.append("a")
history.append("b")
history.append("c")
history.pop()
history.pop()
print(history)    # ['a']</pre>
• Ba thao tác, hai lần Undo (hoàn tác c rồi b), còn lại <b>thao tác a</b>. Undo lần đầu hoàn tác thao tác <b>gần nhất</b>, đúng như khi bạn nhấn Ctrl+Z ngay sau khi gõ.<br>
<b>Kiểm tra ngoặc.</b> Ngoặc mở nào chưa được đóng thì nằm trong stack; ngoặc <b>mở gần nhất</b> phải được đóng <b>trước</b>:<pre>def hop_le(s):
    cap = {")": "(", "]": "["}
    st = []
    for ch in s:
        if ch in "([":
            st.append(ch)
        elif ch in ")]":
            if not st or st.pop() != cap[ch]:
                return False
    return not st
print(hop_le("([])"))    # True
print(hop_le("([)]"))    # False
print(hop_le("(("))    # False
print(hop_le(")("))    # False</pre>
• <code>"([)]"</code>: gặp <code>(</code> rồi <code>[</code>, stack là <code>[(, []</code>. Gặp <code>)</code> thì lấy ra đỉnh là <code>[</code>, mà <code>)</code> cần <code>(</code>, không khớp → <b>không hợp lệ</b>. Dù mỗi loại ngoặc đều đủ cặp, thứ tự lồng nhau sai.<br>
• Hai ca biên: <code>"(("</code> hết chuỗi mà stack còn ngoặc mở nên sai (vì thế cuối hàm kiểm tra <code>not st</code>); <code>")("</code> gặp ngoặc đóng khi stack rỗng nên sai (vì thế có <code>not st</code> trước <code>st.pop()</code>).<br>
• Trình soạn thảo code và trình biên dịch dùng đúng ý tưởng này để báo lỗi ngoặc.<br>
<b>Lỗi hay gặp:</b> chỉ đếm số ngoặc mở và đóng bằng nhau là đủ (bị đánh lừa bởi <code>"([)]"</code>); quên kiểm tra stack rỗng trước khi lấy ra (gây <code>IndexError</code>); quên kiểm tra stack phải rỗng ở cuối.<br>
<b>Mẹo:</b> cấu trúc <b>lồng nhau</b> (ngoặc, thẻ HTML, gọi hàm trong hàm) gần như luôn gợi ý stack. Tự hỏi \"cái nào mở sau thì phải đóng trước?\".`,

    ap4: `<b>Phụ thuộc giữa các gói phần mềm là một đồ thị: mũi tên nghĩa là \"cần cái này trước\".</b><br>
Bảng phụ thuộc trong bài:<pre>deps = {"app": ["lib", "log"], "lib": ["core"], "log": ["core"], "core": []}
print(len(deps))    # 4</pre>
• Có <b>4</b> gói (4 khóa): <code>app</code> cần <code>lib</code> và <code>log</code>; <code>lib</code> và <code>log</code> đều cần <code>core</code>; <code>core</code> không cần gì.<br>
• Gói cài <b>đầu tiên</b> là <code>core</code>, vì nó không phụ thuộc gói nào: phải cài thứ người khác dựa vào trước.<br>
<b>Tìm thứ tự cài (sắp xếp topo).</b> Với mỗi gói: cài hết các gói nó cần trước, rồi mới cài nó. Đây chính là duyệt DFS:<pre>da_cai = []
def cai(g):
    if g in da_cai:
        return
    for x in deps[g]:
        cai(x)
    da_cai.append(g)
cai("app")
print(da_cai)    # ['core', 'lib', 'log', 'app']</pre>
• <code>cai("app")</code> đi xuống <code>lib</code>, rồi <code>core</code>: <code>core</code> không cần gì nên cài đầu tiên, rồi <code>lib</code>. Sang <code>log</code>: <code>core</code> đã cài nên bỏ qua, cài <code>log</code>. Cuối cùng cài <code>app</code>.<br>
• <b>Thứ tự hợp lệ không duy nhất:</b> <code>core, log, lib, app</code> cũng đúng. Thứ tự <code>app, lib, log, core</code> thì sai vì cài <code>app</code> khi chưa có gì để nó dựa vào.<br>
<b>Phụ thuộc vòng.</b> Nếu <code>lib</code> cần <code>log</code> và <code>log</code> cần <code>lib</code> thì <b>không có thứ tự nào hợp lệ</b>: gói nào cũng phải chờ gói kia. Với đoạn code trên, vòng này làm hàm gọi nhau mãi và báo <code>RecursionError</code>. Chương trình thật phải <b>phát hiện vòng và báo lỗi rõ ràng</b> thay vì treo.<br>
<b>Lỗi hay gặp:</b> đọc ngược chiều mũi tên (nhầm \"A cần B\" thành \"B cần A\"); tưởng chỉ có một thứ tự đúng; quên rằng vòng là một dạng dữ liệu xấu phải xử lý.<br>
<b>Mẹo:</b> khi thấy \"phải xong A trước khi làm B\" (công việc dự án, môn học tiên quyết, các bước build), hãy nghĩ tới đồ thị có hướng. Hỏi: <i>có thể có vòng không? Nếu có thì làm gì?</i>`,

    ap6: `<b>Chọn cấu trúc dữ liệu: bắt đầu từ việc bạn cần làm nhiều nhất, không phải từ cấu trúc bạn quen.</b><br>
Ba câu hỏi giúp chọn:<br>
1. <b>Thao tác chính là gì?</b> Tra theo khóa, thêm vào, lấy ra, hay kiểm tra \"đã có chưa\"?<br>
2. <b>Thứ tự có quan trọng không?</b> Vào sau ra trước, hay vào trước ra trước?<br>
3. <b>Dữ liệu có quan hệ nối giữa các phần tử không?</b> (người quen người, gói cần gói)<br>
<b>Áp vào năm tình huống trong bài:</b><br>
• Tìm khách theo số điện thoại trong 10 triệu bản ghi → <b>dictionary</b>, khóa là số điện thoại:<pre>khach = {"0901": "An", "0902": "Binh"}
print(khach["0902"])    # Binh</pre>
 Với list thì phải duyệt từng người, tệ nhất là 10 triệu bước; dictionary tra trung bình gần như một bước.<br>
• Hoàn tác (Undo) → <b>stack</b>: hoàn tác thao tác gần nhất trước.<br>
• Xử lý yêu cầu theo thứ tự đến → <b>queue</b>: ai đến trước phục vụ trước.<br>
• \"Hai người có quan hệ gián tiếp qua bạn bè không?\" → <b>đồ thị</b> (người là nút, quan hệ là đường nối), rồi duyệt BFS hoặc DFS. BFS còn cho biết khoảng cách ngắn nhất.<br>
• Loại email trùng → <b>set</b>:<pre>emails = ["a@x.com", "b@x.com", "a@x.com"]
print(len(set(emails)))    # 2
print(list(dict.fromkeys(emails)))    # ['a@x.com', 'b@x.com']</pre>
 <code>set</code> loại trùng nhưng <b>không đảm bảo thứ tự</b>. Nếu cần giữ thứ tự xuất hiện đầu tiên thì dùng <code>dict.fromkeys</code> như trên.<br>
<b>Lỗi hay gặp:</b> chọn cấu trúc \"nghe xịn\" thay vì khớp với thao tác chính; quên rằng với dữ liệu nhỏ thì list đơn giản vẫn đủ tốt (đúng và dễ hiểu trước, tối ưu sau); chỉ nhìn tốc độ mà quên cái giá (dictionary tốn thêm bộ nhớ, stack và queue không cho tra tùy ý).<br>
<b>Capstone:</b> với mỗi chức năng của hệ thống bạn chọn, viết một câu theo mẫu \"Chức năng X cần [thao tác], nên dùng [cấu trúc] vì [lý do]\". Không viết được phần \"vì\" nghĩa là bạn chưa chắc về lựa chọn đó.<br>
<b>Mẹo:</b> nếu hai cấu trúc cùng có vẻ hợp, viết cách đơn giản nhất cho đúng trước, đo xem có chậm thật không, rồi mới đổi.`
  };
  for (const id in N) if (LES[id] && !LES[id].note) LES[id].note = N[id];
})();
