# DSA từng bước nhỏ

Công cụ học cấu trúc dữ liệu và giải thuật theo kiểu hỏi từng bước, giảm dần dẫn dắt, có luyện lặp lại.

## Chạy
Mở `index.html` bằng trình duyệt (cần Internet để tải font và trình chạy Python Skulpt từ cdnjs).
Hoặc chạy server nội bộ: `python3 -m http.server 8000` rồi mở http://localhost:8000

## Cấu trúc
- `index.html`: khung trang
- `style.css`: giao diện
- `app.js`: toàn bộ logic
  - `STAGES`: lộ trình 8 giai đoạn
  - `LES`: các bài (l1-l3 bài hiểu, w1-w3 bài code Python)
  - `mk` và `scaf`: tạo bài code và chỉnh mức dẫn dắt (nhiều, vừa, ít)
  - `SK`: các bài tập lặp lại trong Phòng tập; mốc `MS` = 3, 10, 30, 100, 300, 1000
  - `py`, `hid`: chạy Python bằng Skulpt và test ẩn

## Thêm bài code mới
Gọi `mk(...)` rồi `scaf(...)` giống w1, w2, w3, rồi thêm id vào `STAGES[..].L`.

Tiến độ lưu trong localStorage của trình duyệt.

## Cập nhật
- Giai đoạn 2 có thêm h1, h2, h3 (bảng tra, đếm, hash map) và w4 (Code 4: two_sum, mức dẫn dắt nhiều).
- Two Sum thêm mức vừa (w5), mức ít (w6) và biến thể has_duplicate (w7, dùng set).
- Giai đoạn 6 (Đệ quy): r1, r2, r3 (bài hiểu) và w8 (factorial, mức nhiều).
- Giai đoạn 7: n1, n2, n3 (linked list), t1, t2 (cây). Mỗi bài có câu tự giải thích bằng lời.
- Giai đoạn 8: g1, g2, g3 (đồ thị, BFS, DFS), dp1, dp2 (ghi nhớ, bảng quy hoạch động). Mọi giai đoạn đã có nội dung.
- Phòng đọc lỗi và debug (e1 đến e4), và Error Explainer: khi code chạy báo lỗi, app tự giải thích bằng tiếng Việt đơn giản (hàm explain), không chỉ ra dòng cần sửa.
- Quy trình bài code đổi thành tư duy hệ thống: Hợp đồng của hàm, test trước (có ca raise), HÀNG RÀO exception trước (mode guard), rồi mới giải đề, rồi refactor.
- Mini project 1 (xử lý giao dịch): m1, m2, m3 (yêu cầu, ca không hợp lệ, đường ống) và w9 (final_balance, mức vừa).
- Code Review mode (bước 7) và bước Ứng dụng (bước 8) ở cuối mọi bài code w1 đến w9.
- Giai đoạn "Ứng dụng thực tế" (ap1 đến ap6): cache, job queue, undo/ngoặc, phụ thuộc gói, thư mục, chọn cấu trúc dữ liệu.
- Mini project 2 (w10): install_order, xếp thứ tự cài gói bằng DFS, phát hiện vòng phụ thuộc, đủ quy trình hợp đồng, test, hàng rào, giải đề, review.
- Giai đoạn 4 (Stack và Queue) có thêm Mini project 3, đi theo đúng quy trình doanh nghiệp (hợp đồng, test trước, hàng rào exception, giải đề, refactor, review, ứng dụng):
  - w11 `bracket_error`: tìm chỗ lỗi ngoặc như trình soạn thảo/linter, dùng stack lưu chỉ số (mức dẫn dắt vừa).
  - rl1 (bài hiểu) rồi w12 `allowed_requests`: giới hạn tốc độ của API bằng hàng đợi các thời điểm, có quyết định nghiệp vụ "yêu cầu bị từ chối có tính không" phải ghi thành giả định và có test bảo vệ (mức dẫn dắt ít).
- Sửa lỗi: test của w8 dùng dấu nháy kép làm chuỗi in bị SyntaxError khi chấm. Quy ước: trong ca test ẩn chỉ dùng nháy đơn.
- `tools/verify.js`: chạy `node tools/verify.js app.js` (cần node và python3). Với mọi bài code, kiểm tra lời giải chuẩn qua hết test ẩn và ca raise, và hàm rỗng phải bị test bắt đỏ.
- Giai đoạn đầu mới: "Mẫu giáo: trước khi có máy tính" (k1 đến k9), không giả định người học biết gì: đếm (chạm từng vật, máy đọc 1, 2, 3...), nhiều hơn/ít hơn/bằng nhau (và dấu >), thứ tự và vì sao máy đếm từ 0 (chỉ số = số người đứng trước), cái tên và cái hộp (nền của biến), máy chỉ làm đúng từng lệnh (nền của thuật toán), nếu...thì (ca biên "lớn hơn" và "lớn hơn hoặc bằng"), lặp lại và phải biết dừng, tìm quy luật, rồi cầu nối sang `x = 5` và `a[2]`. Mỗi bài là một khái niệm nền cho thứ sẽ gặp trong code.
- Kiểu bước mới `tap` (chạm từng vật để đếm); mỗi bước có thể có hình riêng (`arr`) và ẩn nhãn chỉ số (`noidx`). Bài luyện lặp mới: `dem`, `tt`.
- `tools/sim-ui.js`: giả lập người học bấm qua giao diện bằng jsdom (`npm i jsdom`, rồi sửa đường dẫn `root` trong file nếu cần).
- Xưởng ghép câu lệnh (bx0, b1 đến b6): lấp khoảng trống giữa "hiểu" và "viết được". Giống đứa trẻ biết các mảnh 1, +, =, 2 mà vẫn viết `1 1 + = 2`, người học cần biết THỨ TỰ và VAI TRÒ từng chỗ. Bậc thang: ghép mảnh có ghi vai trò từng ô, rồi ghép không ghi chú (có mảnh thừa), rồi ghép từng dòng của cả chương trình (độ thụt dòng hiện sẵn), rồi câu hỏi "dòng tiếp theo nên làm gì" và "thụt sai thì chuyện gì xảy ra".
  - bx0: 1 + 1 = 2 (đúng ví dụ ba cách viết). b1: `x = 5`, `y = x + 2`, `x = x + 1`, `print(x)`. b2: `if n > 3:` và khối if/else. b3: `for i in range(3):` và chương trình tính tổng. b4: `def`, `return`, lúc gọi hàm. b5: `a[0]`, `a[1] = 9`, `len(a)`, `for x in a:`. b6: ghép cả hàm `find_max` từ tờ giấy nhớ, đặt ngay trước w1.
  - Kiểu bước mới `build` (`BD(...)`): ghép từng mảnh vào ô; sai thì chỉ nói chỗ nào chưa hợp lý và vai trò của chỗ đó, không lộ đáp án; sau 3 lần sai mới có "Xem đáp án".
- Kiểm tra hiểu thật (`probe.js`, chống học vẹt): cuối mỗi bài có PRB, mình đổi số (same), đổi chiều (flip), đổi bối cảnh (new) và bắt tự phán đúng/sai kèm lý do (verdict). Ví dụ giống đứa trẻ viết đúng 1 + 1 = 2 nhưng không làm được 2 - 1. Qua 4/4 (hoặc 3/4 rồi đúng câu thêm) mới được dấu xong; trượt thì rút dấu xong, ghi vào `P.weak`, và học lại từ bước đầu. Bài đã xong vẫn có nút kiểm tra lại với đề mới; trượt cũng bị rút dấu xong. Hiện có PRB cho l1, l2, l3; thêm bài khác bằng `PRB.<id> = {same, flip, new, verdict}`. Lịch sử lưu ở `P.pr[id] = {p, f, miss, last}`.
- Lỗ hổng nền (`PREQ`, `rootcheck` trong `probe.js`): bài nào cũng khai báo bài nó dựa vào. Trượt kiểm tra hiểu thật ở bài lớn, hoặc sai 3 lần một câu (có nút "kiểm tra nền"), thì app lần ngược từ gốc lên, kiểm tra nhanh từng bài nền đã xong. Bài nền nào trượt thì bị rút dấu xong và mở lại từ đầu (như lớp 9 sai phép cộng thì học lại phép cộng); các bài dựa trên nó được đánh dấu ⚠ (`P.shaky`), không mất tiến độ nhưng phải chứng minh lại bằng nút kiểm tra hiểu thật. Hiện `PREQ` mới khai cho l2, l3, w1, w2, w3; thêm bài khác bằng `PREQ.<id> = [...]`.
- Kỷ luật đọc đề và cẩn thận (`probe.js`): kiểm tra hiểu thật có thêm dạng câu thứ 5 `read` (bẫy đọc đề: nhìn giống bài đã học nhưng đổi một chi tiết, ví dụ hỏi chỉ số không tồn tại, hoặc "lớn nhất" của dãy số âm). Sai nhanh (dưới 4 giây) được gắn nhãn `careless`, sai câu bẫy gắn nhãn `misread`. Hai loại lỗi này trượt ngay, không có câu thêm cứu, rút dấu xong, học lại từ đầu, và được đếm vào `P.hab` (hồ sơ thói quen). Sai chậm (có vẻ lỗi khái niệm) vẫn được một câu thêm. Ngưỡng 4 giây là phỏng đoán, cần chỉnh theo dữ liệu thật.
- `tools/verify-probe.js` kiểm tra cấu trúc và đáp án của mọi câu hỏi kiểm tra hiểu thật.
- Cược độ chắc chắn: trước mỗi câu kiểm tra, chọn Chắc chắn / Hơi chắc / Đoán. Đúng mà chọn "Đoán" thì không tính (`lucky`, vẫn được một câu thêm). Sai mà chọn "Chắc chắn" là hiểu lầm sâu (`overconfident`): trượt ngay, không có câu cứu. Kết hợp với cẩu thả (sai dưới 4 giây) và đọc sai đề.
- Khóa bài theo đồ thị tiền đề: `unlocked()` gọi `okPre()`; bài chưa xong mà tiền đề (có PRB) chưa xong thì bị khóa. Bài đã xong vẫn mở được để chứng minh lại (⚠).
- Ô tự giải thích dùng `okR()`: cần ≥15 ký tự, ≥4 từ khác nhau, ≥8 ký tự khác nhau, không lặp ký tự 4 lần liền.
- Qua kiểm tra là lưu ngay (không đợi bấm Tiếp tục). "Vững" chỉ khi đã qua đề ở ≥2 ngày khác nhau (`P.pr[id].days`).
- Ngân hàng mẫu: `bank(id, dạng, [hàm...])`, không lặp lại mẫu vừa dùng. Hiện l1, l2, l3 có ≥2 mẫu cho new, verdict, read; same và flip mới chỉ đổi số.
- Xuất/Nhập tiến độ (nút góc phải dưới), vùng thông báo aria-live, tôn trọng prefers-reduced-motion.
- Chưa làm: Pyodide thay Skulpt, tách nội dung ra data/*.json, phá code giáo viên (mutation tests), em học trò hay nhầm, chạy từng dòng trực quan, đề nhiễu kiểu ticket, ôn tập Leitner, nội dung Mẫu giáo/Python cơ bản, đổi cách dạy khi trượt lần 2.
- `probe-foundation.js` (nội dung kiểm tra hiểu thật, tách khỏi logic): thêm PRB + PREQ cho bx0 (viết đúng thứ tự: 1 + 1 = 2), p1 (biến), p2 (if), p3 (for), sm (cộng dồn). Chuỗi tiền đề: bx0 → p1 → p2 → p3 → sm → l3. Sai ở bài lớn thì lần ngược xuống tận bx0. Hiện có 8 bài có PRB trên khoảng 80 bài.
- Mệnh đề đúng/sai giờ ngẫu nhiên đúng hoặc sai (trước đây l1 đến l3 luôn là mệnh đề sai, đoán "Sai" là qua).
- Các bài nền mới mới có 1 mẫu cho dạng new và read (chỉ đổi số); l1 đến l3 có ≥2 mẫu.
- Chạy `node tools/verify-probe.js` để kiểm tra: cấu trúc, số mẫu, và đáp án của các bài sinh số (p1, p2, p3, sm).
- `probe-kinder.js`: kiểm tra hiểu thật cho phần Mẫu giáo: k1 (đếm), k3 (thứ tự, từ 0), k4 (tên và hộp), k6 (nếu-thì), k7 (lặp và dừng). Chuỗi gốc: k4 → bx0 → p1; k6 → p2; k7 → p3; k1 → k3 → l1. Trượt p3 thì lần ngược xuống k4 (cái tên và cái hộp). Hiện có 13 bài có PRB trên 76 bài; chưa có k2, k5, k8, k9, p4, a2, a3, cn và các giai đoạn từ hash map trở đi.
- Thứ tự nạp script trong index.html: app.js, probe.js, probe-foundation.js, probe-kinder.js. File sau dùng helper của file trước.
- `probe-core.js`: kiểm tra hiểu thật cho a2, a3 (chỉ số đọc/ghi đè), cn (đếm), p4 (hàm, return), d1, d2 (dictionary), stk, que (stack, queue), bs (tìm nhị phân), kèm tiền đề: a2 ← l1; a3 ← a2; sm ← p3, a2; cn ← p2, p3, a2; d1 ← a3; d2 ← d1, cn; stk ← a3; que ← stk; bs ← l2, a2.
- Hiện 22 trên 76 bài có PRB. Chưa có: k2, k5, k8, k9, tp, bub, e1-e4, h1-h3, w1-w12, m1-m3, r1-r3, n1-n3, t1-t2, g1-g3, dp1-dp2, ap1-ap6, rl1, b1-b6. Thêm bài: tạo PRB.<id> với 5 dạng, rồi khai PREQ. Kiểm tra bằng `node tools/verify-probe.js`.
- Thứ tự nạp: app.js, probe.js, probe-foundation.js, probe-kinder.js, probe-core.js.
- `probe-more.js`: kiểm tra hiểu thật cho k2, k5, k8, k9 (Mẫu giáo còn lại), tp (hai con trỏ), bub (nổi bọt một lượt), h1, h2, h3 (hash map). Tiền đề: k2 ← k1; k5 ← k4; k8 ← k2; k9 ← k5, k4; bx0 ← k4, k9; tp ← a3, p3; bub ← a3, p2; h1 ← d1; h2 ← h1, d2; h3 ← h2, l2.
- Hiện 31 trên 76 bài có PRB. Chưa có: e1-e4, w1-w12, m1-m3, r1-r3, n1-n3, t1-t2, g1-g3, dp1-dp2, ap1-ap6, rl1, b1-b6.
- Thứ tự nạp: app.js, probe.js, probe-foundation.js, probe-kinder.js, probe-core.js, probe-more.js.
- `probe-adv.js`: kiểm tra hiểu thật cho 17 bài: r1, r2, r3 (đệ quy), n1, n2, n3 (linked list), t1, t2 (cây), g1, g2, g3 (đồ thị, BFS, DFS), dp1, dp2 (quy hoạch động), e1 đến e4 (phòng debug). Mỗi bài đủ 5 dạng, đề sinh ngẫu nhiên (cây, đồ thị, danh sách nút, chuỗi lệnh đều sinh mới mỗi lần). Mỗi câu có code đều gắn `_py = {code, out, err}` để công cụ kiểm tra chạy Python thật. Tiền đề mới: r1 ← p4, p2; r2 ← r1; r3 ← r2; n1 ← a3, p4; n2 ← n1, p3; n3 ← n2; t1 ← n1; t2 ← t1, r2; g1 ← d1, a3; g2 ← g1, que, d2; g3 ← g2, r2; dp1 ← r2, d1; dp2 ← dp1, a3, p3; e1 ← a3; e2 ← sm; e3 ← e2, sm; e4 ← e3, cn. Mọi tiền đề đứng TRƯỚC bài đó trong lộ trình (nếu không, người học đi tuần tự sẽ bị khóa).
- `probe-extra.js`: ngân hàm mẫu bổ sung cho 31 bài cũ (que, bs, k2, k5, k8, k9, tp, bub, h1, h2, h3, d1, d2, stk, bx0, p1, p2, p3, sm, k3, k4, k6, k7, a2, a3, cn, p4...) vốn chỉ có 1 mẫu cho dạng "bối cảnh khác" hoặc "đọc đề", nên học thử vài lần là thuộc. Nhiều câu cũ cố định hoàn toàn (ví dụ que.new, bs.read, h3, p4.new) nay có mẫu ngẫu nhiên.
- (Đã lỗi thời, xem mục `probe-last.js` bên dưới: nay 64 bài có PRB.) Thứ tự nạp: app.js, probe.js, probe-foundation.js, probe-kinder.js, probe-core.js, probe-more.js, probe-adv.js, probe-extra.js, probe-last.js (file sau dùng helper của file trước; mọi tên toàn cục chung một phạm vi, trùng tên là cả file không nạp được).
- Sửa lỗi: k1.read có lựa chọn trùng ("3","6","3") nên chọn đúng chữ "3" thứ hai vẫn bị chấm sai; k7.read, l3.read cũng có lúc trùng. Đã sửa ở nguồn, thêm lưới an toàn trong `probe()` (lựa chọn trùng chữ với đáp án đúng đều tính đúng), và `verify-probe.js` kiểm tra lựa chọn trùng.
- Công cụ kiểm tra:
  - `node tools/verify-probe.js`: cấu trúc, trùng lựa chọn, đáp án theo từng mẫu gốc.
  - `node tools/verify-adv.js`: chạy Python thật mọi đoạn code trong câu hỏi (hơn 3000 đoạn mỗi lần), so với đáp án của app; đối chiếu BFS/DFS, vét cạn leo cầu thang; kiểm tra tiền đề đứng trước trong lộ trình.
  - `node tools/sim-probe.js` (cần `npm i jsdom`, đặt NODE_PATH): giả lập người học bấm qua giao diện; với mỗi bài có PRB, làm đúng phải qua, làm sai phải trượt.
- `probe-last.js`: kiểm tra hiểu thật cho 16 bài cuối: b1 đến b6 (xưởng ghép), m1, m2, m3 (mini project giao dịch), rl1 (rate limiter), ap1 đến ap6 (ứng dụng). Giờ 64 trên 76 bài có PRB; 12 bài còn lại là bài code w1 đến w12, được chấm bằng test ẩn. Tức là mọi bài không phải bài code đều có kiểm tra hiểu thật.
  - Phần tư duy doanh nghiệp: đề sinh ngẫu nhiên các lô giao dịch/người dùng có lỗi cài sẵn (trùng id, loại lạ, số tiền âm, thiếu trường), bắt người học đếm đúng theo quy ước ("lần đầu hợp lệ, lần lặp lại là lỗi"; "đếm giao dịch, không đếm số quy tắc vi phạm"), nhận ra số dư âm giữa chừng dù cuối cùng dương, và tôn trọng quy tắc nghiệp vụ khách đã chốt (amount = 0 là hợp lệ).
  - rl1: mô phỏng rate limiter sinh ngẫu nhiên (giới hạn L, cửa sổ W, ca biên "lớn hơn t - W").
  - Xưởng ghép b1 đến b6: câu hỏi cú pháp có `_syn = [[code, ok]]`, kiểm bằng `compile()` của Python thật (dòng nào hợp lệ, dòng nào SyntaxError).
  - Tiền đề mới: b1 ← p1; b2 ← p2, b1; b3 ← p3, b2; b4 ← p4, b3; b5 ← a3, b3; b6 ← b5, b4, l3, sm; m1 ← d2, e4; m2 ← m1; m3 ← m2, e3; rl1 ← que, m2; ap1 ← d2, h3; ap2 ← que; ap3 ← stk; ap4 ← g2, g1; ap5 ← t2; ap6 ← ap1 đến ap5.
- `tools/sim-unlock.js`: hoàn thành tuần tự cả 76 bài, bài nào cũng phải mở khóa đúng lúc; thiếu tiền đề trực tiếp thì phải bị khóa.
- `tools/verify-adv.js` giờ kiểm cả `_syn` (compile) lẫn `_py` (chạy thật), khoảng 7000 đoạn mỗi lần.
- Chưa làm: Pyodide thay Skulpt, tách nội dung ra JSON, bài "phá code giáo viên", chạy từng dòng trực quan, ôn tập Leitner, đổi cách dạy khi trượt lần 2, chạy thử trên trình duyệt thật (Skulpt).
- `review.js` (nạp sau `probe-last.js`; dùng lại `probe()` nên cược độ chắc chắn, bẫy đọc đề, đoán may đều có hiệu lực). Thêm 3 nút ở đầu thanh bên và đổi cách dạy khi trượt lần 2:
  - **Ôn cách quãng (Leitner)**: `P.lt[id] = {box 1..5, due, n, lapse, cl, ls, seen}`. Bài đã qua kiểm tra hiểu thật tự vào hộp 1, hẹn sau 1 ngày; hộp 1 đến 5 hẹn 1, 3, 7, 14, 30 ngày. Mỗi buổi tối đa 6 bài, mỗi bài MỘT câu mới, dạng câu không lặp dạng lần trước và nghiêng về dạng người học hay sai (`P.pr[id].miss`). Đúng: lên hộp. Đúng nhưng chọn «Đoán»: không lên hộp, mai ôn lại. Sai: về hộp 1.
  - **Thoái lui có bằng chứng** (không reset vô lý): sai 1 lần chỉ về hộp 1; chỉ bị ⚠ khi có bằng chứng mạnh (tự tin mà sai, đọc sai đề, bài ở hộp ≥3 sai mà không phải do cẩu thả, hoặc sai liên tiếp). Sai 2 lần liên tiếp: ⚠ và gợi ý lần ngược bài nền (`rootcheck`). Sai 3 lần liên tiếp: rút dấu xong, học lại từ đầu, bài dựa trên nó bị ⚠. Mọi lỗi cẩu thả / đọc sai đề / tự tin sai cộng vào `P.hab`.
  - **Kiểm tra nền tảng** (`FOUND`: k1, k4, k6, k7, bx0, p1, p2, p3, p4, a2, a3, sm): đến hạn khi chưa làm lần nào (và đã xong ≥3 bài nền) hoặc sau 7 ngày. 6 bài nền, mỗi bài một câu dạng flip/read/new (chống học vẹt). Sai một lần: ⚠. Sai ở hai lần kiểm tra liên tiếp (`P.hc.fail`): rút dấu xong, học lại, bài dựa trên nó bị ⚠.
  - **Đổi cách dạy khi trượt lần 2** (`diagnose`): khi `P.weak[id] >= 2`, trước khi học lại phải xem chẩn đoán (dạng câu hay sai nhất từ `P.pr[id].miss`, thói quen từ `P.hab`), nhận cách học riêng cho dạng đó (ví dụ sai `flip`: tự hỏi chiều ngược lại), và tự viết bằng lời bài nói về gì / mình hiểu sai chỗ nào (`okR` chống gõ bừa). Lưu ở `P.diag[id]`. Mỗi lần trượt chỉ hiện một lần.
  - **Hồ sơ học**: vững (qua ở ≥2 ngày) / chưa vững / ⚠, nền yếu (số lần phải học lại), dạng câu hay sai, thói quen cần sửa, phân bố hộp ôn, và MỘT bước tiếp theo rõ ràng.
  - `probe()` có thêm `opt.tag` (dòng phụ đề tùy chỉnh) và `opt.onEnd(ok, {flags, bad, shapes})`.
  - `tools/sim-review.js` (jsdom, cần `npm i jsdom`): lịch hẹn, lên/xuống hộp, đoán may, sai cẩu thả không phá mastery, tự tin sai bị ⚠, sai 3 lần bị rút dấu xong, kiểm tra nền tảng 2 lần sai, chẩn đoán khóa nút khi gõ bừa, hồ sơ, dữ liệu cũ thiếu `P.lt`/`P.hc`.
  - `tools/sim-ui.js` đã sửa đường dẫn cứng thành tương đối.
  - Các con số 6 bài/buổi, 7 ngày, 1/3/7/14/30 ngày, 3 lần sai liên tiếp là GIẢ ĐỊNH, chưa chỉnh theo dữ liệu người học thật.
- Cập nhật "Chưa làm": Pyodide thay Skulpt, tách nội dung ra JSON, phá code giáo viên (mutation tests), chạy từng dòng trực quan, đề nhiễu kiểu ticket, kiểm tra hiểu thật cho 12 bài code w1 đến w12 (hiện chỉ chấm bằng test ẩn), đo số gợi ý đã dùng, chạy thử Skulpt trên trình duyệt thật. Đã làm xong: ôn Leitner, health check nền tảng, đổi cách dạy khi trượt lần 2, hồ sơ học.
- **Kiểm tra hiểu thật cho 12 bài code (`probe-code.js`)**: w1 đến w12 trước đây chỉ chấm bằng test ẩn. Nay mỗi bài có 5 dạng câu (đổi số, đi ngược, bối cảnh mới, tự phán, bẫy đọc đề), có 2 mẫu đề trở lên ở dạng new/read, mọi câu có code đều chạy Python thật (`tools/verify-adv.js`). w5, w6 dùng chung bộ đề với w4 (cùng ý, khác mức dẫn dắt). Có thêm tiền đề `PREQ` cho w1 đến w12 (đều đứng trước trong lộ trình).
- **Không còn ép điền bừa (`probe.js`, `notebook.js`)**:
  - Mỗi câu kiểm tra có nút **«Chưa hiểu / chưa nhớ»** và nút **📖 Giở sổ tay**. «Chưa hiểu» không bị tính là trượt, không mất dấu xong, không tăng `P.weak`.
  - Giở sổ tay rồi quay lại **đúng câu hỏi đó**. Trả lời đúng nhờ sổ tay thì **chưa cho qua**: phải làm lại đúng các câu đó bằng **đề mới**, không sổ tay (`Gần xong rồi`). Sai sau khi dùng sổ tay không bị gắn «cẩu thả / tự tin sai».
  - Giở sổ tay từ 2 lần ở một bài thì khuyên học lại từ đầu. Số lần giở lưu ở `P.pr[id].unk`, số lần qua nhờ sổ tay ở `P.pr[id].asst`, hiện ở Hồ sơ học.
  - Khi **ôn / kiểm tra nền** thì đóng sách (không sổ tay) nhưng vẫn có «Chưa nhớ»: giữ nguyên hộp, hẹn lại mai, mời giở sổ tay.
  - Nút sổ tay cũng có ở trang bài (hub).
- **Sổ tay (`notebook()`)**: trang viết tay (`LES[id].note`) cho 65/77 bài, nằm trong `notebook.js` (k3, rd1), `notes.js` (14 bài nền), `notes-more.js` (18 bài), `notes-foundation.js` (15 bài), `notes-debug.js` (7 bài), `notes-apps.js` (9 bài). 12 bài còn lại chỉ có bản tự gom từ câu "rút ra" của bài (không rỗng, nhưng chưa phải văn viết tay): w1 đến w12 (bài code, có kèm lời giải chuẩn).
- **Bài `rd1` "Đọc đề: đề cho gì, hỏi gì"** (ngay sau k3): đề CHO gì, HỎI gì, điều kiện, nói lại bằng lời, thử ví dụ nhỏ, đề mơ hồ thì hỏi lại; có kiểm tra hiểu thật 5 dạng.
- `tools/sim-notebook.js`: sổ tay cho mọi bài, rd1 đúng chỗ, «Chưa hiểu» không phạt, vòng làm lại bằng đề mới, ôn/kiểm tra nền với «Chưa nhớ», hồ sơ. Chạy 40 lần liên tiếp không chập chờn.
- Còn thiếu / cần làm tiếp: viết tay sổ tay cho 12 bài code w1 đến w12; Pyodide thay Skulpt; tách nội dung ra JSON; bài "phá code giáo viên"; chạy từng dòng trực quan; đề nhiễu kiểu ticket; đo số gợi ý đã dùng khi làm bài code; chạy thử Skulpt trên trình duyệt thật; dạy đọc đề lần hai ở mức nâng cao (đề dài, nhiều điều kiện) và kiểm tra bằng người học thật xem cách dạy đọc đề có hiệu quả không.
- Sổ tay viết tay đợt 2 (`notes-more.js`): thêm trang viết tay cho 18 bài trước đây chỉ có bản tự gom: bx0, b2 đến b6, d1, d2, tp, stk, que, bs, bub, t1, t2, g1, dp2, ap5. Khuôn mỗi trang: ý chính, ví dụ chạy tay từng bước, lỗi hay gặp, mẹo tự kiểm tra, dùng đúng ví dụ và thuật ngữ trong bài. Tổng cộng 34/77 bài có trang viết tay; 43 bài còn lại dùng bản tự gom (mọi bài còn lại có ít nhất 3 ý hoặc có lời giải chuẩn).
- `tools/verify-notes.js`: chạy Python thật cho các đoạn code trong sổ tay đợt 2 và so với kết quả ghi bên cạnh (`print(...)  # KQ`), rồi tính lại độc lập các khẳng định không nằm trong code (đường đi chia đôi, số đường nối đồ thị, bảng dp, thứ tự duyệt cây...). 4 đoạn là hình vẽ/giả mã nên không chạy được (bx0, b5, bs, t1 hình cây); chúng chỉ được kiểm bằng tính lại độc lập hoặc đọc tay.
- Sổ tay viết tay đợt 3 (`notes-foundation.js`): thêm trang viết tay cho 15 bài nền: k1, k2, k4, k8, k9 (Mẫu giáo còn thiếu), b1 (ghép lệnh), h1, h2, h3 (hash map), r1, r2, r3 (đệ quy), n1, n2, n3 (linked list). Cùng khuôn: ý chính, chạy tay, lỗi hay gặp, mẹo. Tổng cộng 49/77 bài có trang viết tay. `tools/verify-notes.js` mở rộng: chạy Python thật 12 đoạn code mới (tổng 27) và tính lại độc lập các khẳng định đi kèm (KeyError, AttributeError, RecursionError, thứ tự in của dd/e, hai điều kiện sai của vòng đi dọc danh sách, đảo thứ tự khi chèn đầu...). Đã thử làm sai ba chỗ cố ý, công cụ báo đỏ đúng chỗ. Lưu ý: các khẳng định tính lại độc lập kiểm tra SỰ THẬT của điều sổ tay nói, không kiểm tra chữ trong sổ tay có khớp; phần chữ chỉ được đọc tay.
- Sổ tay viết tay đợt 4 (`notes-debug.js`): thêm trang viết tay cho e1 đến e4 (đọc thông báo lỗi, lệch một, khởi tạo sai, lỗi logic và ba loại lỗi), g2 (BFS), g3 (DFS), dp1 (bài con trùng lặp và memo). Tổng cộng 56/77 bài có trang viết tay. `tools/verify-notes.js` mở rộng lên 35 đoạn code chạy Python thật, cộng các khẳng định tính lại độc lập: tên và thông điệp lỗi thật (IndexError, KeyError, TypeError, NameError), ca [5] làm lộ lỗi lệch một, best = 0 sai với toàn số âm nhưng vẫn đúng với [1, 2, 3], thứ tự BFS và DFS, thiếu seen thì không dừng, đánh dấu lúc lấy ra làm một nút bị xếp hàng nhiều lần, số lần gọi fib. Đã thử làm sai ba chỗ cố ý, công cụ báo đỏ đúng chỗ. Hạn chế như đợt 3: phần chữ chỉ được đọc tay.
- Sổ tay viết tay đợt 5 (`notes-apps.js`): thêm trang viết tay cho m1, m2, m3 (mini project: làm rõ yêu cầu, liệt kê dữ liệu xấu, đường ống kiểm tra - tính - trả), rl1 (giới hạn tốc độ), ap1 đến ap4 và ap6 (cache, hàng đợi công việc, Undo và ngoặc, phụ thuộc gói, chọn cấu trúc dữ liệu). Tổng cộng 65/77 bài có trang viết tay. Trang m3 nói rõ điểm dễ nhầm giữa m2 (kiểm tra hình dạng dữ liệu trước khi tính) và m3 (kiểm tra số dư trong lúc tính). `tools/verify-notes.js` mở rộng: chạy Python thật các đoạn code mới và tính lại độc lập các khẳng định đi kèm (hai giả định số dư cho hai kết quả, 3 giao dịch xấu, rút trước nạp sau vẫn sai, dùng < thay <= hoặc ghi cả yêu cầu bị từ chối cho ra [True, True, False, False], thứ tự cài gói hợp lệ không duy nhất, phụ thuộc vòng gây RecursionError, đếm số ngoặc bị đánh lừa bởi "([)]"). Đã thử làm sai ba chỗ cố ý, công cụ báo đỏ đúng chỗ. Hạn chế như đợt 3: phần chữ chỉ được đọc tay.
