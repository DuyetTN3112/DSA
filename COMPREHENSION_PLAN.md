# Kế hoạch: Hỗ Trợ Hiểu Câu Hỏi Toàn App (Universal Comprehension Support)

> Trạng thái: PLAN — chưa implement. Implement sau khi duyệt.

## Vấn đề

App dạy CODE nhưng mặc định người học ĐỌC HIỂU được đề. Thực tế với người mới:
- Không tách được "đề cho gì" vs "đề hỏi gì"
- Vấp từ ngữ chuyên môn (đệ quy, heap, Big-O...) mà không dám hỏi
- Đọc lướt câu hỏi dài, bỏ sót mệnh đề quan trọng (vd w12: "lớn hơn" vs "lớn hơn hoặc bằng")
- Không biết liên hệ với bài đã học

Tính năng này là **cơ chế nền tảng** áp dụng cho toàn bộ 82 bài (lý thuyết, bài tập,
code-lab, probe) — không phải content viết riêng từng bài.

---

## Kiến trúc 3 tầng

```
Tầng 1: Từ vựng (tự động)     — gạch chân thuật ngữ, bấm hiện nghĩa
Tầng 2: Khung tự hỏi (chung)  — nút "Chưa hiểu câu hỏi" → 3 câu hỏi vàng
Tầng 3: Mổ xẻ viết tay (dần)  — phân tích câu từ cho câu hỏi khó
```

---

## Tầng 1 — Từ điển thuật ngữ tự động (Glossary Auto-link)

### Mục tiêu
Mọi thuật ngữ chuyên môn xuất hiện trong bất kỳ câu hỏi nào đều được gạch chân;
bấm vào hiện định nghĩa ngắn từ sổ tay. Làm 1 lần, phủ toàn app.

### Dữ liệu

**File mới:** `src/domain/glossary.ts`

```ts
export interface GlossaryTerm {
  /** từ khóa, vd "đệ quy" */
  term: string;
  /** định nghĩa 1-2 câu, tiếng Việt đơn giản */
  def: string;
  /** id bài học giải thích kỹ (để link "đọc thêm") */
  lessonId?: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  { term: "đệ quy", def: "Hàm tự gọi chính nó để giải bài nhỏ hơn giống hệt.", lessonId: "r1" },
  { term: "Big-O", def: "Cách gọi tên đà tăng của số bước theo n.", lessonId: "bo" },
  { term: "heap", def: "Cây mà cha luôn nhỏ hơn con; gốc là số nhỏ nhất.", lessonId: "hep" },
  // ... ~60-80 thuật ngữ
];
```

**Nguồn xây dựng từ điển:**
1. Quét `note`/`nbk` của 82 bài, trích các thuật ngữ được định nghĩa
2. Bổ sung tay các từ hay gây nhầm (chỉ số vs giá trị, tham số vs đối số...)
3. Mỗi term ≤ 2 câu định nghĩa, không thuật ngữ lồng nhau

### Matching

- Khớp **cụm từ dài trước** ("tìm kiếm nhị phân" trước "tìm kiếm")
- Không phân biệt hoa/thường ở chữ đầu
- Bỏ qua term đã nằm trong thẻ `<code>` (không highlight code)
- Mỗi term chỉ highlight **lần đầu** xuất hiện trong một câu hỏi (tránh rối)

### UI

**File mới:** `src/components/GlossaryText.svelte`

```svelte
<!-- Props: text: string (HTML), onLookup?: (term) => void -->
<!-- Render text, bọc thuật ngữ trong <button class="glossary-term"> -->
```

- Thuật ngữ: gạch chân chấm (`border-bottom: 1px dotted`), màu khác nhẹ
- Bấm vào → popup/tooltip hiện `def` + link "Đọc thêm ở bài X" (nếu có lessonId)
- Không chặn tương tác hiện tại của câu hỏi

### Tích hợp

Thay `{@html step.q}` bằng `<GlossaryText text={step.q} />` tại:
- `src/components/steps/StepView.svelte` (mọi loại step)
- `src/components/ProbeScreen.svelte` (câu hỏi probe)
- `src/components/TinyCheckScreen.svelte` (câu hỏi tiny-check)

### Test

- `glossary.test.ts`: matching ưu tiên cụm dài, bỏ qua `<code>`, 1 lần/câu
- Không vỡ render khi text không có thuật ngữ nào

---

## Tầng 2 — Khung tự hỏi (Thinking Routine Panel)

### Mục tiêu
Nút "Chưa hiểu câu hỏi" trên mọi step. Bấm vào mở panel dẫn dắt người học
**tự phân tích** bằng 3 câu hỏi vàng — không cần content viết riêng.

### 3 câu hỏi vàng

| # | Câu hỏi | Mục đích | Tương tác |
|---|---------|----------|-----------|
| 1 | "Câu này đang hỏi gì? Viết lại bằng lời của bạn." | Buộc diễn đạt lại (EiPE) | Textarea, lưu nháp |
| 2 | "Từ nào bạn không chắc nghĩa? Bấm vào từ được gạch chân." | Dẫn tới Tầng 1 | Highlight glossary terms trong câu hỏi |
| 3 | "Nó giống bài nào bạn đã học?" | Kích hoạt liên kết kiến thức | Gợi ý 2-3 bài liên quan (từ PREQ/related) |

### Dữ liệu

Không cần data mới, tái dùng:
- Câu hỏi hiện tại (đã có)
- Glossary (Tầng 1) cho câu 2
- `PREQ` + bài đã học (`progress.done`) cho câu 3: gợi ý các bài là prerequisite
  của bài hiện tại mà người học đã qua

### UI

**File mới:** `src/components/ComprehensionPanel.svelte`

```svelte
<!-- Props: stepText: string, lessonId: string -->
<!-- State nội bộ: open/closed, draftAnswer: string -->
```

- Nút nhỏ "Chưa hiểu câu hỏi 🤔" đặt cạnh nút "Cần giúp" hiện có
- Panel mở rộng ngay dưới câu hỏi, không che nội dung
- Câu 1: textarea + nút "Lưu nháp" (lưu vào localStorage theo stepId, xem lại được)
- Câu 2: render lại câu hỏi với glossary highlight (tái dùng GlossaryText)
- Câu 3: list 2-3 bài đã học liên quan, bấm → mở notebook bài đó
- Nút "Tôi hiểu rồi, làm tiếp" đóng panel

### Tích hợp

- `StepView.svelte`: thêm nút + panel dưới mỗi step
- Không ảnh hưởng flow trả lời hiện tại (panel là optional, không chặn)

### Test

- Panel mở/đóng đúng, không vỡ khi step không có text
- Draft lưu/load đúng theo stepId

---

## Tầng 3 — Mổ xẻ viết tay (Curated Dissections)

### Mục tiêu
Với các câu hỏi khó (được đánh dấu), có sẵn phần "Mổ xẻ" do người soạn viết:
tách từng mệnh đề, giải thích câu từ, chỉ ra bẫy ngôn ngữ.

### Dữ liệu

**Mở rộng type** trong `src/domain/types.ts`:

```ts
export interface Dissection {
  /** trích đúng câu từ trong đề */
  quote: string;
  /** giải thích mệnh đề này nói gì, bẫy ở đâu */
  explain: string;
}

interface StepBase {
  // ... các field hiện có
  /** mổ xẻ câu từ (optional, chỉ câu khó) */
  dissect?: Dissection[];
}
```

### UI

- Nút "Mổ xẻ câu hỏi 🔍" chỉ hiện khi `step.dissect` tồn tại
- Mở rộng dạng accordion dưới câu hỏi: từng `quote` (in nghiêng) + `explain`
- Tái dùng style của hint hiện có

### Ưu tiên content (làm dần, không chặn kỹ thuật)

| Đợt | Bài | Lý do |
|-----|-----|-------|
| 1 | w12 (rate limiter) | Đề dày nhất, bẫy "lớn hơn" vs ">=" |
| 1 | w10 (topo sort) | Tie-break chữ cái, cycle vs thiếu gói |
| 1 | w11 (bracket) | "ngoặc mở gần cuối nhất" (innermost) |
| 2 | w4/w5/w6 (two_sum) | 3 mức dẫn dắt, so sánh cách đọc đề |
| 3 | Các bài còn lại theo phản hồi người học thật |

### Ví dụ (w12)

```ts
dissect: [
  {
    quote: "số yêu cầu ĐÃ ĐƯỢC CHẤP NHẬN trước đó",
    explain: "Chỉ đếm yêu cầu đã qua (accepted), KHÔNG đếm yêu cầu bị từ chối. Đây là bẫy phổ biến nhất."
  },
  {
    quote: "có thời điểm lớn hơn t - window",
    explain: "Dấu > nghiêm ngặt, không phải >=. Yêu cầu đúng bằng t - window đã hết hạn, không tính."
  }
]
```

---

## Lộ trình implement

### Phase 1 — Tầng 1 (Glossary)
1. `src/domain/glossary.ts`: ~60-80 terms (quét notebook + bổ sung tay)
2. `src/components/GlossaryText.svelte`: render + highlight + popup
3. Tích hợp vào StepView, ProbeScreen, TinyCheckScreen
4. `glossary.test.ts`

### Phase 2 — Tầng 2 (Panel)
1. `src/components/ComprehensionPanel.svelte`
2. Tích hợp vào StepView (nút + panel)
3. Lưu nháp diễn đạt lại vào localStorage
4. Test mở/đóng + lưu nháp

### Phase 3 — Tầng 3 (Dissections)
1. Thêm `dissect?: Dissection[]` vào `StepBase`
2. UI accordion trong StepView
3. Viết content đợt 1 (w12, w10, w11)

## Quy tắc kỹ thuật (giữ nguyên)

- Không file quá 300 dòng
- TS strict, cấm `any`/`unknown`/`!`
- Không kind step mới — chỉ thêm UI optional
- Mọi thay đổi qua PR, **không push thẳng main**

## Tiêu chí nghiệm thu

- [ ] Thuật ngữ được highlight đúng trong mọi loại câu hỏi
- [ ] Bấm term hiện nghĩa + link bài liên quan
- [ ] Nút "Chưa hiểu câu hỏi" mở panel 3 câu hỏi trên mọi step
- [ ] Nháp diễn đạt lại được lưu và xem lại
- [ ] `dissect` hiện accordion chỉ khi có dữ liệu
- [ ] Gate xanh: lint, check, test, build
- [ ] Không vỡ flow học hiện tại (panel/dissect đều optional)
