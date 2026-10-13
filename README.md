# DSA từng bước nhỏ

Ứng dụng web giúp **hiểu thật** cấu trúc dữ liệu và giải thuật (DSA) bằng tiếng Việt, học từng bước nhỏ, bắt đầu từ con số không.

Mục tiêu của dự án **không phải** là giải được nhiều bài hay giải nhanh. Mục tiêu là người học thực sự hiểu: vì sao thuật toán chạy đúng, vì sao nó tốn bấy nhiêu, và đọc một đề bài thì cần tự hỏi những gì. Mọi thiết kế trong repo xoay quanh việc **phát hiện và vá chỗ hổng hiểu biết**, không phải chỉ cho người học "qua bài".

Ứng dụng chạy hoàn toàn trong trình duyệt: không cần server, không cần tài khoản, không gửi dữ liệu đi đâu.

## Dành cho ai

Người chưa biết lập trình hoặc mới biết chút Python, muốn học DSA một cách chắc chắn. Lộ trình bắt đầu từ "mẫu giáo" (đếm, so sánh, thứ tự, làm theo từng bước) trước khi chạm vào Python.

## Học như thế nào

**Lộ trình 14 giai đoạn, 82 bài.** Bài sau chỉ mở khi bài trước và các bài nền tảng của nó đã xong. Nội dung đi qua:

- Mẫu giáo: đếm, so sánh, thứ tự, quy luật, điều kiện, lặp
- Python cơ bản: biến, điều kiện, vòng lặp, hàm
- Mảng, phòng đọc lỗi và debug, bảng tra (dictionary)
- Hai con trỏ, stack và queue
- Tìm kiếm và sắp xếp (nổi bọt, merge sort, quicksort, Big-O), đệ quy
- Linked list, cây, heap
- Đồ thị, quy hoạch động
- Ứng dụng thực tế và các mini project

**Nhiều dạng bước trong một bài:** chọn đáp án, nhập số, sắp xếp các mảnh (kể cả mảnh code, kiểu Parsons), ghép từ khoá, tự viết lời giải thích, và **viết code Python thật**.

**Code lab (workshop).** Các bài code lab mô phỏng quy trình làm việc thật: đọc đề, viết test trước (TDD), viết hàng rào kiểm tra đầu vào (exception), giải đề, rồi dọn dẹp. Python chạy ngay trong trình duyệt bằng [Skulpt](https://skulpt.org/), lỗi được dịch sang tiếng Việt.

**Kiểm tra hiểu thật (probe).** Sau mỗi bài, app hỏi lại bằng câu hỏi **sinh ngẫu nhiên** theo 5 dạng: câu tương tự, câu đi ngược chiều, câu mới, câu phán đoán đúng/sai, câu đọc code. Người học cược độ chắc chắn trước khi trả lời, nên đoán mò đúng không được tính là hiểu.

**Khi chưa hiểu.** Bấm "Chưa hiểu" để phân loại vướng mắc, mở sổ tay của bài tham chiếu, làm câu kiểm tra ngắn, rồi quay lại đúng câu đang hỏi.

**Ôn cách quãng (Leitner).** Bài đã học được ôn lại theo hộp 1, 3, 7, 14, 30 ngày. Kiểm tra nền tảng định kỳ phát hiện bài nền bị hổng; hổng thì bài dựa trên nó bị đánh dấu "lung lay" và có thể phải học lại.

Tiến độ lưu trong `localStorage` của trình duyệt (khoá `dsa`). Xoá dữ liệu trình duyệt là mất tiến độ.

## Chạy thử

Yêu cầu: Node.js `^20.19.0` hoặc `>=22.12.0` (theo yêu cầu của Vite) và npm.

```bash
npm install
npm run dev        # chạy dev server
```

Các lệnh khác:

```bash
npm test           # chạy toàn bộ test (vitest)
npm run lint       # eslint
npm run check      # svelte-check + tsc
npm run build      # build tĩnh vào dist/
npm run preview    # xem bản build
```

Trước khi mở PR nên chạy đủ `lint`, `check`, `test`, `build`.

## Công nghệ

Svelte 5, TypeScript, Vite, Vitest, ESLint. Python trong trình duyệt bằng Skulpt (tải lười ở lần chạy code đầu tiên). Ứng dụng là SPA tĩnh, host được ở bất kỳ nơi nào phục vụ file tĩnh.

## Cấu trúc thư mục

```
src/
  domain/            Logic thuần, không đụng DOM
    lessons/         Nội dung bài học (82 bài, mỗi bài là một danh sách bước)
    probe/           Ngân hàng câu hỏi kiểm tra (banks/), tiền đề giữa các bài (prereq.ts)
    curriculum.ts    Lộ trình, luật mở khoá bài
    leitner.ts       Ôn cách quãng
    progress.ts      Trạng thái tiến độ
    storage.ts       Lưu/đọc tiến độ (localStorage)
    types.ts         Kiểu dữ liệu dùng chung
  flows/             Máy trạng thái của từng luồng: probe, ôn tập, kiểm tra nền tảng,
                     truy tìm gốc hổng, sổ tay, hồi phục
  components/        Giao diện Svelte; components/steps/ là từng loại bước
  services/          Chạy Python (Skulpt), dịch lỗi, dựng test cho code lab
```

Ý tưởng kiến trúc: logic nằm trong `domain/` và `flows/` (kiểm thử được, không phụ thuộc giao diện); component Svelte chỉ hiển thị và chuyển sự kiện.

## Thêm hoặc sửa bài học

1. Thêm bài vào một file trong `src/domain/lessons/` và đăng ký trong `lessons/index.ts`.
2. Đặt bài vào giai đoạn phù hợp trong `lessons/order.ts`.
3. Khai báo bài nền tảng của nó trong `probe/prereq.ts`. **Bài nền phải đứng trước bài phụ thuộc trong lộ trình**, nếu không người học sẽ bị kẹt.
4. Thêm ngân hàng câu hỏi trong `probe/banks/` (5 dạng câu, sinh ngẫu nhiên).
5. Chạy `npm test`.

## Tình trạng và hướng phát triển

Dự án đang phát triển. Điểm yếu đã biết: phần **dạy phân tích và hiểu đề bài** còn mỏng, và một số cơ chế còn cho phép "qua bài mà không hiểu". Audit và kế hoạch cải thiện nằm ở PR #8 (`docs/COMPREHENSION_AUDIT_AND_PLAN.md`); các bản sửa lỗi đã biết nằm ở PR #7.

## Đóng góp

Mở issue hoặc pull request. Với nội dung bài học, ưu tiên câu hỏi buộc người học **tự suy nghĩ** thay vì có thể đoán bằng vị trí hay độ dài đáp án.
