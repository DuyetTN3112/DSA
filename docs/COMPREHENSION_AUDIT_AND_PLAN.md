# Audit và kế hoạch: rèn khả năng phân tích, hiểu đề bài

> Trạng thái: **AUDIT + PLAN, chưa triển khai tính năng nào.** Phần "lỗi" đã có bản sửa ở PR riêng (PR B).
> Ngày audit: 2026-10-13. Commit nền: `368fdcc` (main).
> Mục tiêu của repo (theo chủ repo): **hiểu DSA thật**, đặc biệt là phân tích yêu cầu, đọc và hiểu đề. Không phải giải nhanh, giải nhiều, hay giải tối ưu.

Quy ước độ tin cậy trong tài liệu này:

- **[ĐO]**: số liệu do chính mình chạy script/test trên repo ở phiên này.
- **[ĐỌC CODE]**: kết luận từ đọc code, chưa chạy tái hiện.
- **[LÝ THUYẾT]**: dựa trên tài liệu giáo dục, xem mục 6 về mức độ đã kiểm chứng.

---

## 1. Tóm tắt điều hành

1. **Hạ tầng kỹ thuật sạch.** Lint 0 lỗi, `svelte-check` 0 lỗi, build thành công, 76 test xanh ban đầu [ĐO]. Vấn đề không nằm ở code mà ở **nội dung và thiết kế sư phạm**.
2. **Có một lỗi chặn toàn bộ lộ trình.** Người học đi đúng thứ tự chỉ mở được **57/82 bài**. 25 bài (30%) không bao giờ mở khoá, gồm merge/quick sort, toàn bộ đệ quy, linked list, cây, heap, đồ thị, DP, ứng dụng thực tế và mini project 2 [ĐO]. Nguyên nhân là tiền đề vòng: `mrg → r2 → r1 → qck → mrg`. Test hiện có không bắt được. **Đã sửa ở PR B** (hoán đổi hai giai đoạn), mô phỏng lại cho 82/82.
3. **Dạy phân tích đề gần như bằng không.** Chỉ 1/82 bài (`rd1`) dạy đọc đề, ở mức mẫu giáo, toàn trắc nghiệm, đáp án đúng luôn ở vị trí đầu, không có ngân hàng probe. Trong 12 code lab, phần "Đọc đề" chủ yếu là câu trắc nghiệm có đáp án viết sẵn; 3 câu bị sao chép nguyên văn vào cả 12 bài [ĐO]. Người học **không bao giờ phải tự làm** việc phân tích: tác giả làm hộ.
4. **Dễ "qua bài mà không hiểu".** Đáp án đúng ở vị trí đầu ở 79% số câu choice, đáp án dài nhất thường là đúng, gợi ý hiện ngay lần sai đầu, các mảnh trong `order` luôn hiện theo thứ tự đảo ngược [ĐO / ĐỌC CODE]. Một người học chọn "đáp án đầu tiên" hoặc "đáp án dài nhất" sẽ qua phần lớn bài.
5. **Hướng đề xuất:** biến "phân tích đề" từ *đọc câu trả lời viết sẵn* thành *làm ra sản phẩm phân tích rồi được máy chấm tự động* (không dùng LLM): tự nêu ví dụ và bị chấm bằng đột biến lời giải sai, tự tìm đầu vào làm lộ chỗ mơ hồ, gạch đề, đổi ràng buộc thành ngân sách thuật toán, phân loại bài theo cấu trúc sâu. Hỗ trợ giảm dần theo năng lực người học.
6. **Chia 2 PR:** PR A (tài liệu này) và PR B (sửa lỗi + test chống tái phát, đã chạy đủ lint/check/test/build).

---

## 2. Phương pháp audit

- Clone repo, chạy `npm ci`, `npm test`, `npm run lint`, `npm run check`, `npm run build`.
- Viết script (chạy trong vitest, đã xoá sau khi dùng) để **mô phỏng lộ trình học** và **đo thống kê nội dung** trên dữ liệu bài thật.
- Đọc code các thành phần liên quan: `curriculum.ts`, `probe/prereq.ts`, `services/code-lab.ts`, `CodeStep.svelte`, `OrderStep.svelte`, `ReflectStep.svelte`, `probe/banks/sorting.ts`.
- Với mỗi lỗi: tái hiện được thì ghi [ĐO]; chỉ đọc code thì ghi [ĐỌC CODE].
- Đối chiếu với một bản audit trước đó (do chủ repo cung cấp) và **tự đo lại** các số chính. Chỗ nào số của mình khác thì ghi rõ.

Chưa làm: chạy app trên trình duyệt thật bằng tay, đo hiệu năng Skulpt trên máy người học, đọc từng câu chữ của toàn bộ 82 bài (mới đọc mẫu và đo thống kê).

---

## 3. Kết quả audit

### 3.1 Hạ tầng (không vấn đề)

| Hạng mục | Kết quả |
|---|---|
| `npm test` | 76 test xanh (7 file) trước khi sửa [ĐO] |
| `npm run lint` | 0 lỗi [ĐO] |
| `npm run check` | 0 lỗi, 0 cảnh báo [ĐO] |
| `npm run build` | thành công [ĐO] |

Ghi chú nhỏ:

- Build cảnh báo chunk > 500 kB (do Skulpt). Chưa phải lỗi, nhưng nên tách bằng dynamic import khi tối ưu tải trang lần đầu.
- `README.md` vẫn là **bản mẫu của template Vite + Svelte**, không nói gì về dự án. Người mới vào repo không biết repo làm gì. (Việc này nằm trong đề xuất PR sau, mục 8.)

### 3.2 Lỗi chặn lộ trình (NGHIÊM TRỌNG, đã có bản sửa)

**Hiện tượng.** Mô phỏng người học luôn làm bài kế tiếp đang mở khoá, đúng thứ tự lộ trình [ĐO]:

```
LEARNED 57 / 82
STUCK  mrg,qck,r1,r2,r3,w8,n1,n2,n3,t1,t2,hep,hps,g1,g2,g3,dp1,dp2,ap1..ap6,w10
```

**Nguyên nhân.** `isUnlocked` yêu cầu (a) bài ngay trước đã xong và (b) mọi tiền đề (gián tiếp) đã xong. Giai đoạn "Tìm kiếm và sắp xếp" (`bs,bub,bo,mrg,qck`) đứng **trước** "Đệ quy" (`r1,r2,r3,w8`), nhưng `PREQ.mrg = [bub, bo, r2]`. Tức `mrg` cần `r2` (xếp sau), mà `r1` lại cần bài liền trước là `qck`, và `qck` cần `mrg`. Vòng kín, không ai mở được.

**Cách sửa (PR B).** Hoán đổi hai giai đoạn: "Đệ quy" lên trước, "Tìm kiếm và sắp xếp" xuống sau, đổi số trong tên giai đoạn (5 ↔ 6). Mọi tiền đề khác đã nhất quán. Số giai đoạn vẫn 14. Mô phỏng lại: **82/82** [ĐO]. Cũng đã kiểm tra test mới **đỏ** nếu bỏ bản sửa.

**Vì sao test cũ không bắt được.** Test cũ kiểm tra "tiền đề tồn tại" nhưng không kiểm tra "tiền đề có đứng trước trong lộ trình" và không mô phỏng việc học thật. PR B thêm 3 test: mô phỏng đầy đủ, tiền đề phải đứng trước, đồ thị tiền đề không vòng.

### 3.3 Khoảng trống về phân tích đề (vấn đề cốt lõi theo mục tiêu repo)

**Phân bổ các loại bước trong 82 bài** [ĐO]: choice 279, input 120, reflect 43, code 36, order 23, build 15, tests 12, click 3, tap 2, open 1.
Nghĩa là **~70% bước là chọn hoặc nhập số**; chỉ 36 bước code và 12 bước tests đòi người học tạo ra thứ gì đó.

**(a) `rd1` là bài duy nhất dạy đọc đề.**
- Nằm ngay sau `k3`, toàn đề mẫu giáo (kẹo, táo).
- 12/12 câu choice có đáp án đúng ở vị trí 0 [ĐO].
- Bước cuối là `reflect` (tự khai), không được chấm.
- Không có ngân hàng probe nên "xong là qua" (`App.svelte:102`) [ĐỌC CODE].
- Mẹo "tìm chữ hỏi, mấy" thuộc nhóm chiến lược dựa trên từ khoá. Nghiên cứu của Hegarty, Mayer & Monk (1995) mô tả đây là đặc trưng của người giải kém, còn người giải tốt dựng **mô hình tình huống** [LÝ THUYẾT, đã tự kiểm nguồn, xem mục 6].

**(b) Code lab: phần "Đọc đề" là kịch bản viết sẵn.**
- 12 workshop có 15–16 bước mỗi bài [ĐO].
- Trong các bước thuộc pha "Đọc đề" và "Hợp đồng": 66 bước, chỉ **31 câu khác nhau**. Ba câu lặp nguyên văn đúng 12 lần (mỗi bài một lần): "Theo TDD, nên viết test nào đầu tiên?", "Ở công ty, trước khi viết hàm, đồng nghiệp cần biết gì…", "Hàm nhận dữ liệu xấu. Vì sao báo lỗi rõ ràng (raise) tốt hơn…" [ĐO]. Tức 36/66 bước là bản sao.
- Pha "Đọc đề như đi làm thật" tổng cộng 42 bước trên 12 bài, **chủ yếu trắc nghiệm có đáp án viết sẵn**.

**(c) Đề (brief) quá ngắn, thiếu những thứ người đọc đề giỏi phải tự hỏi.**
- Độ dài brief (bỏ HTML): w1 120, w2 144, w3 131, w4 197, w5 190, w6 203, w7 175, w8 200, w9 302, w10 353, w11 434, w12 533 ký tự [ĐO].
- Không brief nào chứa ví dụ vào/ra, không brief nào nêu giới hạn kích thước `n` [ĐO, dùng regex thô: cần xác nhận lại bằng đọc tay khi triển khai].
- Khung code `cs` đã chứa các "việc 1..5" chính là lời giải dạng comment (ví dụ w10). Người học chỉ điền, không phân tích.

**(d) Đề "mơ hồ" lộ đáp án.** Ở `w3`, câu "Với [5,5,3], số lớn thứ hai là 5 hay 3?" có sẵn đáp án đúng là *"Đề mơ hồ: ta giả định là 3 (khác biệt) và ghi lại để hỏi người ra đề"* [ĐO]. Người học không phải tự phát hiện sự mơ hồ, họ chỉ chọn câu có chữ "Đề mơ hồ".

**(e) Mơ hồ vô tình ở `w10`.** Đề viết "duyệt tên gói theo thứ tự chữ cái" khi nhiều thứ tự đúng, lời giải tham khảo dùng `sorted(deps)` rồi DFS. Câu này cho hai kết quả khác nhau tuỳ cách hiểu (ví dụ `['c','b','a']` so với `['b','c','a']`) và test ẩn không phân biệt được hai cách hiểu [ĐỌC CODE, từ audit trước, mình xác nhận brief và lời giải đúng như mô tả; chưa chạy mô phỏng hai cách hiểu]. Đây là kiểu lỗi mà chính một bài dạy "phát hiện mơ hồ" không được phép mắc phải.

**(f) Test ẩn không đo thứ đề yêu cầu.** Theo audit trước, lời giải vét cạn O(n²) của `two_sum` vẫn xanh ở w4–w6, nên cả giai đoạn "đổi bộ nhớ lấy tốc độ" không được kiểm chứng [chưa tái đo ở phiên này; kiến trúc `buildHiddenTests` chỉ so giá trị trả về nên kết luận hợp lý].

**(g) Nút "không hiểu đề" luôn mở `rd1`.** `tiny.ts:105` trả về `'rd1'` cho mọi bài khi `stuckKind === 'de'`, kể cả khi người học đang kẹt ở `bracket_error` hay đồ thị [ĐỌC CODE]. Hỗ trợ đúng chỗ phải dựa trên **đề đang đọc**.

### 3.4 Dễ "qua bài mà không hiểu"

| Hiện tượng | Số đo / bằng chứng |
|---|---|
| Đáp án đúng ở vị trí 0 (mọi câu choice) | 221/279 = **79,2%** (vị trí 1: 44, vị trí 2: 14) [ĐO] |
| Đáp án đúng ở vị trí 0 (câu 3 lựa chọn) | 190/245 = **77,6%** [ĐO] |
| Đáp án là lựa chọn dài nhất (duy nhất) | 189/245 = **77,1%** [ĐO]; audit trước ghi 75,6% (khác cách đếm) |
| Bài học không xáo lựa chọn | Chỉ probe mới xáo [ĐỌC CODE] |
| Gợi ý hiện ngay lần sai đầu | Làm mất cơ hội nghĩ lại [ĐỌC CODE] |
| `OrderStep` luôn hiện các mảnh theo thứ tự đảo ngược | `OrderStep.svelte:13` dùng `.reverse()`; mảnh đúng tiếp theo luôn là nút dưới cùng [ĐO/ĐỌC CODE] |
| `ReflectStep` chỉ kiểm tra độ dài ≥ 15 và ≥ 8 ký tự khác nhau, rồi bỏ văn bản | `ReflectStep.svelte` [ĐỌC CODE] |
| `validateTests` chấp nhận chữ `[]`/`None` trong comment | Regex chạy trên toàn văn, kể cả `# ...` [ĐO, đã có test tái hiện, **đã sửa ở PR B**] |

Kết hợp: một người học **không đọc đề** vẫn có thể qua phần lớn bài bằng chiến lược "chọn đáp án đầu" hoặc "chọn đáp án dài nhất". Đó chính là điều repo muốn ngăn.

### 3.5 Lỗi nhỏ đã xác minh

| Lỗi | Trạng thái |
|---|---|
| `mrg.flip` (probe) sinh hai lựa chọn giống nhau ("5" và "5") khi hai đầu mảng bằng nhau, xác suất 1/5 = 20% mỗi lượt [ĐỌC CODE + test tái hiện] | **Đã sửa ở PR B** |
| Bấm "Chạy test" lại trong 1,6s sau khi thắng làm `onAnswer(true)` gọi 2 lần, có thể nhảy cóc 1 bước [ĐỌC CODE: `running` về `false` ngay khi `run()` xong, còn `setTimeout` vẫn chờ] | **Đã sửa ở PR B** (cờ `advancing`; component remount mỗi bước nên cờ không rò) |
| Câu giải thích Big-O bị nối thừa cụm "mỗi phần tử xử lý một số lần cố định" | Xuất hiện **12 lần** [ĐO]; chưa sửa (nội dung, để PR sau) |
| Đáp án `O(V+E)` của w10 không đúng hẳn vì lời giải tham khảo gọi `sorted` | Brief/lời giải xác nhận có `sorted` [ĐO]; chưa sửa (nội dung) |
| Comment "77 bài / 76 bank" lỗi thời | Thực tế 82 bài, 81 bank [ĐO]. **Đã sửa ở PR B** |
| `Stage.Q` (13 mã ngân hàng bài từ bản vanilla) | Dữ liệu chết: `grep` toàn `src` chỉ thấy khai báo ở `order.ts`, **không có nơi nào đọc** [ĐO]. Chưa xoá (để P5 thay bằng ngân hàng đề mới) |

### 3.6 Đã kiểm tra, KHÔNG phải lỗi (báo động giả)

Ghi lại để lần sau không mất công:

- Các lựa chọn `print(x)` và `Print(x)` ở `b1.read` là **mồi nhử có chủ ý**, không phải trùng.
- Chuỗi `<` thô hiển thị bình thường theo HTML5.
- `InputStep` với đáp án chuỗi không xảy ra ở bài nào.
- Cả 12 lời giải tham khảo xanh trên Skulpt (môi trường chạy thật của trình duyệt).
- Test probe: sau PR B, chạy mỗi generator 200 lần không còn câu nào trùng lựa chọn hay đáp án ngoài phạm vi [ĐO].

### 3.7 Chưa tái hiện

- Kịch bản bấm "Chạy test" hai lần trong 1,6s: kết luận từ đọc code, **chưa** tái hiện bằng test giao diện. Bản sửa là phòng thủ vô hại.
- Các câu chữ, đề bài của từng bài khác (ngoài w3, w4, w10 và rd1) **chưa** đọc kỹ từng chữ. Nên làm trong giai đoạn nội dung (mục 7, P5).

---

## 4. Đánh giá kế hoạch cũ (PR #5, `docs/comprehension-plan`)

- PR #5 đã đóng, không merge, không nhận xét. Nhánh còn file `COMPREHENSION_PLAN.md` (653 dòng).
- Hướng của nó: **hỗ trợ hiểu** (từ điển 70 thuật ngữ, nút "chưa hiểu" với 3 câu hỏi vàng, mổ xẻ viết tay). Đó là *giúp người học hiểu đề*, chưa phải *rèn người học tự phân tích đề*. Hai thứ này khác nhau: hỗ trợ cố định có thể làm hại người đã khá (xem 6.3).
- Ba "content mẫu" trong kế hoạch **mâu thuẫn với đề thật**, không nên triển khai nguyên văn (theo audit trước, cần đối chiếu lại trước khi dùng):
  - `bracket_error` thực tế trả về chỉ số, không raise `ValueError` cho ngoặc thừa hay sai loại (chỉ `TypeError` khi đầu vào không phải chuỗi).
  - Chữ ký `allowed_requests` trong kế hoạch có tham số `t` không tồn tại.
  - Đề w12 đảm bảo `times` không giảm, kế hoạch nói ngược lại.
- Có thể **tái dùng**: ý tưởng từ điển thuật ngữ (làm sau, ưu tiên thấp), nút "chưa hiểu" (nhưng đổi cách định tuyến, 3.3g).

---

## 5. Mục tiêu năng lực (kết quả học tập)

Thay vì "hỗ trợ hiểu", ta định nghĩa **những việc người học phải tự làm được** trước khi code. Mỗi mục là một kỹ năng có thể đo và chấm tự động.

| Mã | Kỹ năng | Bằng chứng quan sát được |
|---|---|---|
| PC1 | Nói lại đề: đầu vào, đầu ra, quan hệ giữa chúng | Chọn/ghép đúng mệnh đề; phân biệt paraphrase đúng với paraphrase đổi một điều kiện |
| PC2 | Trích ràng buộc và ước lượng quy mô | Gạch đúng cụm ràng buộc; chọn đúng ngân sách thuật toán |
| PC3 | Tự nêu ví dụ và chạy tay | Ví dụ tự nêu đúng theo lời giải chuẩn, và **bắt được** các lời giải sai |
| PC4 | Phát hiện chỗ đề chưa nói / mơ hồ | Tìm được đầu vào làm hai cách hiểu cho kết quả khác nhau |
| PC5 | Nghĩ ca biên | Ví dụ phủ các lớp: rỗng, một phần tử, trùng lặp, âm, cực trị |
| PC6 | Cách ngây thơ và chi phí của nó | Nêu được cách vét cạn, chọn đúng độ phức tạp, thấy nó "chết" ở `n` lớn |
| PC7 | Nhận dạng dạng bài theo **cấu trúc sâu**, không theo vỏ bọc | Nhóm đúng các đề cùng cấu trúc dù khác chủ đề |
| PC8 | Đối chiếu lại đề sau khi code | Chỉ ra điều khoản của đề mà lời giải gần đúng vi phạm |

Khung quy trình người học tự hỏi trước khi gõ (gộp PC1–PC6, PC7 là bước nhận dạng):

> **Bảy câu hỏi trước khi gõ:** (1) Nói lại bằng lời mình: vào gì, ra gì? (2) Giới hạn của dữ liệu? (3) Một ví dụ cụ thể, kết quả là gì? (4) Những ca biên nào? (5) Đề chưa nói điều gì? (6) Cách ngây thơ là gì, tốn bao nhiêu? (7) Dạng bài này giống bài nào đã gặp, giống ở cấu trúc nào?
> **Sau khi gõ:** đọc lại đề một lần nữa và đối chiếu từng mệnh đề (PC8).

---

## 6. Cơ sở khoa học và mức độ đã kiểm chứng

| Nguồn | Điều dùng | Mức kiểm chứng |
|---|---|---|
| Hegarty, Mayer & Monk (1995), *J. Educational Psychology* 87(1): 18–32 | Người giải kém dịch trực tiếp từ số và từ khoá; người giải tốt dựng mô hình tình huống | **Đã tự kiểm ở phiên này** (nhiều nguồn thứ cấp khớp nhau). Lưu ý: nghiên cứu là về **bài toán số học** với sinh viên đại học; áp sang lập trình là **ngoại suy hợp lý, chưa phải kết quả trực tiếp** |
| Chi, Feltovich & Glaser (1981), *Cognitive Science* 5: 121–152 | Chuyên gia phân loại bài vật lý theo nguyên lý sâu, người mới theo bề mặt | Theo audit trước đã kiểm; **chưa tự kiểm lại ở phiên này**. Kết quả nhạy với bộ bài chọn: bài phân loại phải thiết kế có chủ đích (PC7) |
| Kalyuga, Ayres, Chandler & Sweller (2003), *Educational Psychologist* 38(1): 23–31 | Hiệu ứng đảo ngược chuyên môn: hỗ trợ có lợi cho người mới có thể gây hại cho người đã khá | Theo audit trước đã kiểm; **chưa tự kiểm lại** |
| Lister et al. (2004), *SIGCSE Bulletin* 36(4): 119–150 | Nhiều người mới lập trình không đọc/chạy tay được code ngắn | Theo audit trước đã kiểm; **chưa tự kiểm lại** |
| Pólya (1945); Schoenfeld; Chi (1989, tự giải thích); Parsons (2006, Parsons problems); Rohrer & Taylor (2007, học xen kẽ) | Khung giải bài toán, tự giải thích, bài sắp xếp mảnh code, luyện xen kẽ | Trích từ **hiểu biết chung**, chưa tra lại. **Hãy kiểm tra trước khi trích dẫn công khai.** |

### 6.1 Ngoại suy cần thận trọng

Phần lớn bằng chứng đến từ toán và vật lý. Kế hoạch này **không giả định** chúng đúng nguyên vẹn với lập trình; nó dùng chúng để đặt giả thuyết thiết kế, và mục 9 đề xuất đo hiệu quả thật.

### 6.2 Hệ quả thiết kế

1. Người học phải **tạo ra** sản phẩm phân tích (ví dụ, ca biên, giả định), không chỉ nhận ra đáp án (lý do 3.3b).
2. Chấm bằng **hành vi thật của code** (chạy ví dụ, chạy lời giải sai) thay vì bằng so khớp văn bản, để không lặp lại lỗi "đáp án viết sẵn".
3. Học xen kẽ (nhiều dạng đề, cấu trúc sâu) tốt hơn học theo khối cùng dạng.

### 6.3 Hỗ trợ giảm dần (fading)

Hỗ trợ cố định có thể giúp người mới nhưng làm hại người đã khá. Vì vậy hỗ trợ phải **giảm theo bằng chứng năng lực**, không theo số bài đã qua (mục 7.3).

---

## 7. Thiết kế đề xuất

Nguyên tắc: **không dùng LLM để chấm**, chấm bằng thực thi code trên Skulpt (đã có `runPython`, `buildRefRun`, `buildEmptyRun`, `buildHiddenTests`) và so khớp có cấu trúc.

### 7.1 Mô hình dữ liệu đề bài: `ProblemSpec`

Một đề là một bản ghi có cấu trúc, không còn là một chuỗi HTML:

```ts
interface ProblemSpec {
  id: string;                    // vd 'two_sum'
  statement: string;             // đề gốc (có chủ đích, kể cả chỗ mơ hồ nếu có)
  fn: string;
  io: { input: string; output: string };       // đáp án chuẩn cho PC1
  constraints: { text: string; n?: number }[]; // PC2
  examples: { in: string; out: string; why?: string }[];
  /** Mơ hồ CÓ CHỦ ĐÍCH: mỗi cách hiểu có một ref chạy được */
  ambiguities: { id: string; readings: { label: string; ref: string }[] }[];
  /** Cụm trong đề, gắn nhãn vai trò (PC2) */
  spans: { text: string; role: 'input' | 'output' | 'constraint' | 'error' | 'order' | 'noise' }[];
  /** Lời giải sai có sẵn để chấm ví dụ của người học (PC3, PC5) */
  mutants: { id: string; code: string; bugClass: BugClass; note: string }[];
  /** Cách ngây thơ + ref có đếm thao tác để minh hoạ ngân sách (PC6) */
  naive: { code: string; cost: string; opCounter: string };
  deepStructure: string;         // vd 'tra-cuu-bang-bam' (PC7)
  surface: string;               // vd 'giao dịch ngân hàng'
}
type BugClass = 'empty' | 'single' | 'duplicate' | 'negative' | 'off_by_one' | 'order' | 'extreme';
```

Lợi ích: một nguồn sự thật cho đề; sinh được biến thể (đổi `surface`, giữ `deepStructure`); kiểm tra chất lượng tự động (7.5).

### 7.2 Các loại bước mới (đều chấm tự động)

Mỗi loại là một biến thể mới trong `LessonStep` (hiện có 10, `types.ts`), kèm component và test.

1. **`restate` (nói lại đề).** Người học ghép/chọn mệnh đề mô tả vào/ra. Đáp án sai là **paraphrase đổi một điều kiện** (ví dụ "i < j" thành "i ≤ j"), không phải câu vô nghĩa. Lựa chọn bị xáo, độ dài cân bằng. Chấm: so khớp với `io`.
2. **`examples` (tự nêu ví dụ).** Người học gõ ví dụ vào/ra cho đề. Máy: (a) chạy `ref` với đầu vào đó, xem đầu ra có khớp; (b) chạy từng `mutant` trên các ví dụ của người học, đếm số mutant bị **bắt**; (c) xem ví dụ phủ những `bugClass` nào. Điểm = số mutant bị bắt, phản hồi nói rõ "ví dụ của bạn chưa phân biệt được lời giải sai #k (bỏ sót ca trùng lặp)". Đây là mở rộng trực tiếp của luồng "test phải bắt được hàm rỗng" đang có trong `CodeStep.svelte`.
3. **`ambiguity` (làm lộ chỗ mơ hồ).** Đề có ≥ 2 cách hiểu. Người học nhập một đầu vào sao cho `readingA(x) ≠ readingB(x)`; máy chạy hai `ref` và hiển thị hai kết quả. Sau đó người học chọn giả định và ghi lại (chọn từ danh sách). Điều kiện chất lượng: đề không có mơ hồ vô tình (7.5).
4. **`markup` (gạch đề).** Người học chọn các cụm trong đề theo vai trò (vào, ra, ràng buộc, lỗi, thứ tự). Chấm theo `spans`, có cụm `noise` để tránh bôi hết.
5. **`budget` (ràng buộc thành ngân sách).** Cho `n` tối đa, người học chọn độ phức tạp chấp nhận được, rồi **thấy** `naive` chạy ở `n` lớn. **Đo bằng số thao tác đếm được (`opCounter`), không đo thời gian thực**, vì Skulpt chậm và thời gian thay đổi theo máy.
6. **`classify` (phân loại cấu trúc sâu).** Một tập 6–8 đề xen kẽ: cùng vỏ khác cấu trúc, cùng cấu trúc khác vỏ. Người học nhóm theo "giải giống nhau". Chấm theo `deepStructure`. Tập bài phải thiết kế có chủ đích (6, Chi 1981).
7. **`reread` (đọc lại đề sau khi code).** Đưa lời giải gần đúng (một `mutant`), người học chỉ ra mệnh đề nào của đề bị vi phạm bằng cách nhập đầu vào làm nó sai. Chấm: chạy `mutant` và `ref`.

Các bước cũ (`choice`, `input`...) vẫn giữ cho phần kiến thức; chỉ **không còn dùng để kiểm tra phân tích đề**.

### 7.3 Hỗ trợ giảm dần (fading) và đo năng lực

Mỗi kỹ năng PC1..PC8 có mức hỗ trợ:

| Mức | Hình thức |
|---|---|
| L0 | Ví dụ làm sẵn (worked example): người học giải thích từng bước |
| L1 | Điền 1–2 chỗ trống |
| L2 | Câu hỏi dẫn dắt |
| L3 | Tự làm với checklist "bảy câu hỏi" |
| L4 | Tự làm, đề mới, không checklist |

Quy tắc chuyển mức (đề xuất, cần chỉnh sau khi có dữ liệu): đúng ở lần đầu 2 lần liền → lên mức; sai 2 lần liền → xuống mức. Trạng thái lưu trong tiến độ: `comprehension: Record<PCId, { level; streak; evidence[] }>`, cần migration ở `storage.ts` (đã có test `storage.test.ts`). Tái dùng **Leitner** (`leitner.ts`) để ôn lại kỹ năng theo thời gian, tránh học dồn.

### 7.4 Sửa những gì đang có

| Mục | Thay đổi |
|---|---|
| `rd1` | Viết lại thành bài đọc đề **có thật**: đề lập trình ngắn, bước `restate` + `examples`; bỏ mẹo "tìm chữ hỏi, mấy"; thêm ngân hàng probe để không "xong là qua" |
| 12 code lab | Thay pha "Đọc đề" (3 câu sao chép + câu chốt sẵn) bằng chuỗi `restate → markup → examples → ambiguity (nếu có) → budget`, mức hỗ trợ theo 7.3. Mô hình hoá ba câu lặp thành **một bài riêng** về TDD/hợp đồng/raise, không lặp 12 lần |
| `w3` | Bỏ đáp án "Đề mơ hồ: ..." viết sẵn; thay bằng bước `ambiguity` |
| `w10` | Sửa đề cho **rõ** hoặc khai mơ hồ có chủ đích với `ambiguities` và test phân biệt được hai cách hiểu; sửa claim `O(V+E)` |
| Nút "không hiểu đề" | Định tuyến tới scaffold của **đề đang làm** (checklist bảy câu), không về `rd1` |
| Choice | Xáo lựa chọn khi hiển thị; cân bằng vị trí và độ dài đáp án; hiện gợi ý ở lần sai thứ hai (hoặc theo mức fading) |
| `OrderStep` | Xáo thứ tự mảnh thay vì đảo ngược cố định |
| `ReflectStep` | Lưu văn bản, hiện lại ở ôn tập; cho tự đối chiếu với đáp án mẫu (2–3 ô checklist), vẫn không dùng LLM |
| Test ẩn | Thêm `slowRef` cho bài có phase nói về độ phức tạp, test phải **đỏ** với lời giải chậm |
| `Stage.Q` | Xác nhận không ai đọc rồi thay bằng ngân hàng đề mới (7.5) |
| `README.md` | Viết lại: mục tiêu, cách chạy, kiến trúc, cách thêm bài |

### 7.5 Ngân hàng đề mới và kiểm tra chất lượng

Thay `Stage.Q` đã chết bằng ngân hàng `ProblemSpec`. Mỗi đề phải qua **checklist chất lượng tự động** (chạy trong test):

- Mọi `ambiguities[i].readings` phải **phân biệt được** bằng ít nhất một đầu vào (nếu không, mơ hồ là vô nghĩa).
- Đề **không** có mơ hồ nào ngoài khai báo (kiểm tra bằng bộ ví dụ kiểm thử chéo nhiều cách hiểu hợp lý; bắt được lỗi kiểu w10).
- `mutants`: mỗi mutant phải sai ở ít nhất một đầu vào; `ref` phải qua mọi ví dụ.
- `naive` phải thực sự chậm hơn `ref` đủ lớn ở `n` tối đa của `constraints`.
- `spans.text` phải xuất hiện đúng một lần trong `statement`.
- Có sinh **biến thể** (đổi `surface`, giữ `deepStructure`) để luyện xen kẽ.

### 7.6 Bộ test toàn vẹn nội dung

Đã có (PR B): lộ trình không deadlock, tiền đề đứng trước, không vòng, choice không trùng, probe không trùng.
Đề xuất thêm: phân bố vị trí đáp án (không vượt ngưỡng, ví dụ ≤ 45% ở một vị trí cho mỗi bài), không câu nào lặp quá `k` lần giữa các bài, mọi `ProblemSpec` qua checklist 7.5, mọi bài có `reflect` phải có ghi chú đối chiếu.

---

## 8. Lộ trình triển khai (PR nhỏ, mỗi PR đủ lint/check/test/build)

| Giai đoạn | Nội dung | Kích thước | Tiêu chí hoàn thành |
|---|---|---|---|
| **P0 (PR B, đã làm)** | Sửa deadlock, `mrg.flip`, `validateTests`, `advancing`, comment lỗi thời, test toàn vẹn | S | 83 test xanh; test mới đỏ khi bỏ bản sửa |
| **P1** | Lint nội dung: cân bằng vị trí/độ dài đáp án, xáo choice và order, hiện gợi ý lần sai 2, README | S–M | Test phân bố vị trí xanh; chọn "đáp án đầu" không còn qua bài |
| **P2** | `ProblemSpec` + bộ chấm; thí điểm `w4` (two_sum) với `restate`, `examples` (mutants), `budget` | M | Ví dụ thiếu ca trùng lặp bị mutant `duplicate` bắt; có test cho từng bước |
| **P3** | `ambiguity` + thí điểm `w3`, sửa `w10`; checklist chất lượng 7.5 | M | Test xác nhận mọi mơ hồ phân biệt được; w10 hết mơ hồ vô tình |
| **P4** | Fading engine, `comprehension` trong tiến độ, migration `storage`, Leitner cho kỹ năng | M–L | Lên/xuống mức đúng; migration không làm mất tiến độ cũ |
| **P5** | `markup`, `classify`, `reread`; viết lại `rd1`; áp dụng cho w1–w12; thay `Stage.Q`; định tuyến "không hiểu đề" | L | 12 workshop dùng cấu trúc mới; không còn câu sao chép |
| **P6** | Đánh giá hiệu quả (mục 9), điều chỉnh ngưỡng fading | M | Có số liệu trước/sau |

Gợi ý thứ tự thực tế: P1 trước vì rẻ và chặn lối "qua bài không hiểu"; P2–P3 là lõi giá trị; P4 chỉ làm khi đã có ≥ 3 bài dùng bước mới.

---

## 9. Đo hiệu quả

Việc "hiểu đề" khó đo bằng điểm bài tập. Đề xuất, đều **cục bộ trong trình duyệt**, không gửi dữ liệu:

- **Bài kiểm chuyển giao:** đề mới chưa gặp, người học làm bước `restate`/`examples` ở mức L4. Chỉ số: số mutant bị bắt, số lớp `bugClass` phủ.
- **Kiểm tra trì hoãn:** ôn lại kỹ năng sau 3 và 7 ngày bằng Leitner.
- **Chỉ số hành vi:** tỉ lệ "đoán" (đáp án nhanh bất thường, mẫu chọn vị trí 0). Phân bố vị trí đáp án sau P1 cho phép phát hiện người chơi đoán.
- **So sánh trước/sau** trên một nhóm nhỏ (kể cả chỉ chủ repo) nếu có thể.

---

## 10. Rủi ro

| Rủi ro | Giảm thiểu |
|---|---|
| Skulpt chậm, đo thời gian không ổn định | Đếm thao tác (`opCounter`), không đo giây |
| Chấm ví dụ có thể oan (ví dụ hợp lệ nhưng khác ý mutant) | Chấm theo **hành vi** (mutant có bị bắt không); hiển thị lý do; cho người học xem mutant sau khi nộp |
| Lượng nội dung lớn (12 bài × 5+ bước) | Thí điểm 2–3 bài trước (P2, P3), mẫu dữ liệu `ProblemSpec` tái dùng được |
| Ngoại suy từ toán sang lập trình sai | Mục 9 đo thật; không tuyên bố hiệu quả khi chưa đo |
| Quá nhiều giàn giáo làm người khá chán | Fading (7.3), cho phép bỏ qua có ghi nhận |
| Phá tiến độ đã lưu khi đổi schema | Migration + test `storage.test.ts` |
| Hoán đổi giai đoạn ở PR B làm người đang học dở bị lệch | Tiến độ lưu theo **id bài**, không theo vị trí; nhưng nên thử với dữ liệu lưu thật trước khi phát hành |

---

## 11. Câu hỏi cần chủ repo quyết định

1. Đối tượng người học chính là ai (người chưa biết gì, hay người đã biết Python)? Ảnh hưởng mức L khởi điểm.
2. Có đồng ý thêm các loại bước mới vào `LessonStep` (hiện 10 loại)? Đây là thay đổi kiến trúc đáng kể.
3. Ưu tiên P1 (chặn "qua bài không hiểu") trước P2 (lõi phân tích đề) hay làm song song?
4. Đồng ý xoá `Stage.Q` (đã xác nhận không code nào đọc) ngay ở PR sau, hay giữ cho tới khi có ngân hàng đề mới?
5. Lý do đóng PR #5? Nếu có lý do về hướng thiết kế, nên điều chỉnh mục 7 cho phù hợp.

---

## Phụ lục A: nội dung PR B (đã làm, kèm kiểm chứng)

| Thay đổi | File | Kiểm chứng |
|---|---|---|
| Hoán đổi giai đoạn Đệ quy ↔ Tìm kiếm & sắp xếp | `src/domain/lessons/order.ts` | Mô phỏng 57/82 → 82/82 |
| `mrgFlip` sinh lại cho tới khi hai đầu mảng khác nhau | `src/domain/probe/banks/sorting.ts` | Test probe 200 lần × mọi generator |
| `validateTests` bỏ comment trước khi kiểm tra `[]/None/___` | `src/services/code-lab.ts` | 2 test mới |
| Cờ `advancing` chặn `onAnswer(true)` hai lần | `src/components/steps/CodeStep.svelte` | Component remount mỗi bước (`{#key stepIndex}`) |
| Sửa comment 77 → 82 bài, 76 → 81 bank | `order.ts`, `domain-ports.ts`, `curriculum.ts` | |
| Test toàn vẹn nội dung (5 test) | `src/domain/content-integrity.test.ts` | Đỏ khi bỏ bản sửa, xanh khi có |

Kết quả cuối: 83 test xanh, lint 0 lỗi, `svelte-check` 0 lỗi, build thành công.
