# Kế hoạch: Hỗ Trợ Hiểu Câu Hỏi Toàn App (Universal Comprehension Support)

> Trạng thái: PLAN — chưa implement. Implement sau khi duyệt.
> Phiên bản: 2.0 (mở rộng chi tiết theo yêu cầu)

## 1. Vấn đề và mục tiêu

### Vấn đề đã verify

App dạy CODE nhưng mặc định người học ĐỌC HIỂU được đề. Audit 12 bài code-lab cho thấy:
- 2 câu "Hợp đồng" là template chết — lặp nguyên văn cả 12 bài, 0% phân tích cụ thể
- Không bài nào bắt **chạy tay ví dụ mẫu** trước khi code
- Đề càng phức tạp (w12 rate limiter, w10 topo sort, w11 bracket) càng thiếu phân tích
- Người học vấp từ ngữ chuyên môn mà không có chỗ tra ngay trong câu hỏi

### Mục tiêu

Xây **cơ chế nền tảng** (không phải content từng bài) giúp người học hiểu mọi câu hỏi,
mọi đề bài, mọi lý thuyết trong toàn bộ 82 bài. Ba tầng độc lập, triển khai dần:

```
Tầng 1: Từ vựng (tự động)     — gạch chân thuật ngữ, bấm hiện nghĩa
Tầng 2: Khung tự hỏi (chung)  — nút "Chưa hiểu câu hỏi" → 3 câu hỏi vàng
Tầng 3: Mổ xẻ viết tay (dần)  — phân tích câu từ cho câu hỏi khó
```

### Nguyên tắc thiết kế

1. **Optional, không chặn flow**: mọi hỗ trợ đều là mở rộng, người hiểu rồi thì bỏ qua
2. **Không kind step mới**: chỉ thêm UI component, không sửa state machine
3. **Tái dùng tối đa**: glossary dùng cho cả 3 tầng; panel dùng lại GlossaryText
4. **Làm 1 lần, phủ toàn app**: Tầng 1+2 là kỹ thuật thuần túy, không cần content riêng

---

## 2. Tầng 1 — Từ điển thuật ngữ tự động

### 2.1. Danh sách thuật ngữ (70 terms, chia 6 nhóm)

#### Nhóm A — Khái niệm lập trình cơ bản (18)

| Thuật ngữ | Định nghĩa (≤2 câu) | Bài liên quan |
|-----------|---------------------|---------------|
| hàm | Khối code đặt tên, nhận đầu vào và trả về kết quả. | p1 |
| biến | Tên gọi cho một ô nhớ chứa giá trị, có thể thay đổi. | p1 |
| tham số | Tên biến trong định nghĩa hàm (lúc viết hàm). | p2 |
| đối số | Giá trị thật truyền vào khi gọi hàm. | p2 |
| trả về | Đưa kết quả ra khỏi hàm bằng `return`; khác với in ra. | p1 |
| danh sách | Dãy có thứ tự, truy cập bằng chỉ số, viết trong `[]`. | l1 |
| chỉ số | Vị trí của phần tử, đếm từ 0. | k3 |
| phần tử | Một mục đơn trong danh sách/tập hợp. | l1 |
| mảng | Danh sách có kích thước cố định (trong Python dùng list). | l1 |
| vòng lặp | Lặp lại khối code: `for` (biết trước số lần), `while` (theo điều kiện). | l3 |
| điều kiện | Biểu thức đúng/sai sau `if`/`while`, quyết định rẽ nhánh. | a2 |
| rẽ nhánh | Chọn 1 trong 2 đường đi bằng `if/else`. | a2 |
| kiểu dữ liệu | Loại giá trị: số nguyên, chuỗi, danh sách, dict... | p3 |
| chuỗi | Dãy ký tự trong ngoặc kép, vd `"abc"`. | a1 |
| dict | Ánh xạ khóa→giá trị, tra cứu O(1) trung bình. | h1 |
| None | Giá trị "không có gì" trong Python. | p4 |
| in ra | Hiện lên màn hình bằng `print`; khác với trả về. | p1 |
| gán | Đặt giá trị vào biến bằng dấu `=`. | p1 |

#### Nhóm B — Xử lý lỗi và test (10)

| Thuật ngữ | Định nghĩa | Bài liên quan |
|-----------|------------|---------------|
| raise | Ném lỗi ra ngoài để báo "có chuyện", thay vì trả về số giả. | w1 |
| exception | Đối tượng lỗi: `ValueError`, `TypeError`, `IndexError`... | w1 |
| ValueError | Lỗi khi giá trị không hợp lệ (vd list rỗng mà đòi tìm max). | w1 |
| TypeError | Lỗi khi sai kiểu (vd cộng chuỗi với số). | w1 |
| IndexError | Lỗi khi chỉ số vượt quá độ dài list. | k3 |
| KeyError | Lỗi khi dict không có khóa đó. | h1 |
| test | Đoạn code kiểm tra hàm chạy đúng: `assert f(...) == ...`. | w1 |
| assert | Câu lệnh "khẳng định phải đúng, sai thì báo lỗi". | w1 |
| ca biên | Trường hợp "lạ": rỗng, 1 phần tử, None, số âm. | w1 |
| TDD | Viết test trước, code sau: đỏ → xanh → refactor. | w1 |

#### Nhóm C — Độ phức tạp (8)

| Thuật ngữ | Định nghĩa | Bài liên quan |
|-----------|------------|---------------|
| Big-O | Cách gọi tên đà tăng của số bước theo n. | bo |
| O(n) | Số bước tăng theo n (duyệt hết). | bo |
| O(log n) | Số bước tăng theo log n (chia đôi mỗi lần). | bo |
| O(n²) | Số bước tăng theo n² (vòng lặp lồng nhau). | bo |
| O(n log n) | Số bước tăng theo n·log n (sắp xếp nhanh). | bo |
| worst-case | Trường hợp tệ nhất — Big-O luôn tính theo nó. | bo |
| hằng số | Hệ số bị Big-O bỏ qua: O(2n) = O(n). | bo |
| tuyến tính | Duyệt từng phần tử một, O(n). | l2 |

#### Nhóm D — Cấu trúc dữ liệu (16)

| Thuật ngữ | Định nghĩa | Bài liên quan |
|-----------|------------|---------------|
| stack | Ngăn xếp: vào sau ra trước (LIFO), như chồng đĩa. | stk |
| queue | Hàng đợi: vào trước ra trước (FIFO), như xếp hàng. | que |
| heap | Cây mà cha luôn nhỏ hơn con; gốc là số nhỏ nhất. | hep |
| cây | Cấu trúc phân nhánh: gốc, nút cha/con, lá. | t1 |
| nút | Một điểm trong cây/đồ thị, chứa giá trị. | t1 |
| lá | Nút không có con. | t1 |
| gốc | Nút trên cùng của cây. | t1 |
| linked list | Dãy nối bằng con trỏ next, không cần mảng liên tục. | n1 |
| con trỏ | Biến trỏ tới nút khác (qua `.next`, `.left`). | n1 |
| đồ thị | Tập đỉnh nối bằng cạnh. | g1 |
| đỉnh | Một điểm trong đồ thị. | g1 |
| cạnh | Đường nối 2 đỉnh. | g1 |
| BFS | Duyệt theo tầng: gần trước, xa sau (dùng queue). | g2 |
| DFS | Duyệt theo nhánh: đi sâu hết mới quay lại. | g3 |
| hash | Hàm băm biến khóa thành chỉ số, tra O(1). | h1 |
| tuple | Dãy không đổi được, viết trong `()`. | cn |

#### Nhóm E — Thuật toán (12)

| Thuật ngữ | Định nghĩa | Bài liên quan |
|-----------|------------|---------------|
| đệ quy | Hàm tự gọi chính nó để giải bài nhỏ hơn giống hệt. | r1 |
| ca cơ sở | Trường hợp dừng của đệ quy (không gọi tiếp). | r1 |
| chia để trị | Chia bài lớn thành bài nhỏ, giải rồi gộp lại. | mrg |
| tìm nhị phân | Chia đôi mảng đã sắp xếp mỗi lần, O(log n). | bs |
| sắp xếp nổi bọt | So cặp kề nhau, đẩy số lớn về cuối, O(n²). | bub |
| merge sort | Chia đôi, sắp xếp, trộn lại. O(n log n). | mrg |
| quicksort | Chọn chốt, phân hoạch, đệ quy 2 bên. O(n log n) trung bình. | qck |
| heap sort | Đổ vào heap, lấy dần số nhỏ nhất. O(n log n) tại chỗ. | hps |
| hai con trỏ | Dùng 2 chỉ số đi từ 2 đầu (hoặc cùng chiều) vào. | tp |
| sliding window | Cửa sổ trượt trên mảng để xét đoạn liên tiếp. | w12 |
| memoization | Nhớ kết quả đã tính để không tính lại (DP). | dp1 |
| topo sort | Sắp xếp đỉnh sao cho trước-sau theo phụ thuộc. | w10 |

#### Nhóm F — Từ dễ nhầm (6)

| Thuật ngữ | Định nghĩa | Bài liên quan |
|-----------|------------|---------------|
| chỉ số vs giá trị | Chỉ số là vị trí (0,1,2...), giá trị là nội dung trong hộp. | k3 |
| tham số vs đối số | Tham số lúc định nghĩa, đối số lúc gọi. | p2 |
| in ra vs trả về | `print` hiện màn hình; `return` đưa giá trị cho code khác dùng. | p1 |
| nông vs sâu | Copy nông chia sẻ bên trong; copy sâu tách hẳn. | cn |
| ổn định (stable) | Sắp xếp ổn định giữ thứ tự cũ của phần tử bằng nhau. | hps |
| tại chỗ | Sắp xếp ngay trên mảng gốc, không cần mảng phụ. | qck |

### 2.2. Thuật toán matching (chi tiết)

```ts
// src/domain/glossary.ts

export function findTerms(text: string): Array<{ term: string; index: number; length: number }> {
  // 1. Tách text thành các đoạn: trong <code>...</code> vs ngoài
  //    → chỉ match ngoài <code>
  // 2. Sắp xếp GLOSSARY theo độ dài term giảm dần ("tìm kiếm nhị phân" trước "tìm kiếm")
  // 3. Với mỗi term, tìm tất cả vị trí xuất hiện (case-insensitive chữ đầu)
  // 4. Loại vị trí đã bị term dài hơn chiếm (không lồng nhau)
  // 5. Mỗi term chỉ lấy vị trí ĐẦU TIÊN (tránh rối mắt)
  // 6. Trả về sắp xếp theo index tăng dần để render
}
```

**Xử lý tiếng Việt:**
- Không phân biệt hoa/thường ở ký tự đầu ("Đệ quy" = "đệ quy")
- Giữ nguyên dấu (không normalize, vì "hoa" vs "hòa" khác nghĩa)
- Từ ghép có dấu cách được ưu tiên ("cây nhị phân" trước "cây")

**Hiệu năng:**
- 70 terms × câu hỏi ~200 ký tự = không đáng kể, chạy mỗi lần render
- Cache kết quả theo text (Map, vì cùng câu hỏi render nhiều lần)

### 2.3. Component GlossaryText (spec chi tiết)

**File:** `src/components/GlossaryText.svelte` (~120 dòng)

```svelte
<script lang="ts">
  import { findTerms, GLOSSARY } from '../domain/glossary';

  interface Props {
    /** HTML của câu hỏi (có thể chứa <code>, <pre>) */
    text: string;
    /** class CSS thêm cho container */
    cls?: string;
  }
  const { text, cls = '' }: Props = $props();

  // Tách text thành segments: { kind: 'text' | 'term', content: string, def?: string }
  const segments = $derived(buildSegments(text));

  let activeTerm: string | null = $state(null);

  function buildSegments(html: string) {
    // 1. Parse HTML thành cây đơn giản (chỉ cần xử lý <code>, <pre>, text)
    // 2. Với text nodes: chạy findTerms, chèn <button class="gl-term">
    // 3. Với <code>/<pre>: giữ nguyên, không match
  }
</script>

<div class={cls}>
  {#each segments as seg}
    {#if seg.kind === 'term'}
      <button
        class="gl-term"
        class:active={activeTerm === seg.term}
        onclick={() => activeTerm = activeTerm === seg.term ? null : seg.term}
      >{seg.content}</button>
      {#if activeTerm === seg.term}
        <span class="gl-popup">
          <b>{seg.term}</b>: {seg.def}
          {#if seg.lessonId}
            <button onclick={() => openNotebook(seg.lessonId)}>Đọc thêm →</button>
          {/if}
        </span>
      {/if}
    {:else}
      {@html seg.content}
    {/if}
  {/each}
</div>

<style>
  .gl-term {
    border-bottom: 1px dotted var(--accent);
    background: none; border-top: none; border-left: none; border-right: none;
    color: inherit; font: inherit; cursor: help; padding: 0;
  }
  .gl-popup {
    display: block; /* hoặc absolute tùy layout */
    background: var(--card); border: 1px solid var(--border);
    border-radius: 8px; padding: 8px 12px; margin: 4px 0;
    font-size: 0.9em;
  }
</style>
```

**Hành vi chi tiết:**
- Bấm term → popup hiện ngay dưới từ (inline, không che câu hỏi)
- Bấm lại hoặc bấm term khác → đóng/chuyển
- Nút "Đọc thêm →" mở notebook của bài liên quan (dùng NotebookView có sẵn)
- Không có term nào → render `{@html text}` nguyên như cũ (zero thay đổi visual)

### 2.4. Tích hợp (code diff cụ thể)

**1. `src/components/steps/StepView.svelte`:**

```diff
- <div class="q">{@html step.q}</div>
+ <div class="q"><GlossaryText text={step.q} /></div>
```

Áp dụng cho mọi branch step (click, input, choice, order, reflect, build, code, tests).
Các field khác có câu hỏi (step.h, items[i][1]) giữ nguyên — chỉ highlight câu hỏi chính.

**2. `src/components/ProbeScreen.svelte`:**
- Câu hỏi probe chính: `{@html flow.current.q}` → `<GlossaryText>`
- Câu hỏi "vì sao": tương tự
- Đáp án (options): KHÔNG highlight (tránh rối, đáp án ngắn)

**3. `src/components/TinyCheckScreen.svelte`:**
- Tương tự ProbeScreen

**4. `src/components/NotebookView.svelte`:**
- KHÔNG cần (notebook đã là giải thích, không cần highlight đệ quy)

### 2.5. Edge cases

| Case | Xử lý |
|------|-------|
| Term trong `<code>print("đệ quy")</code>` | Bỏ qua (đang nói về code, không phải khái niệm) |
| "Hàm" xuất hiện 5 lần trong câu | Chỉ highlight lần đầu |
| Term là tiền tố của từ khác ("hàm" trong "hàm số") | Match whole-word (có ranh giới từ 2 bên) |
| Câu hỏi không có term nào | Render như cũ, không thêm DOM |
| Popup tràn màn hình mobile | `max-width: 90vw`, wrap text |

### 2.6. Test

**File:** `src/domain/glossary.test.ts`
- Ưu tiên cụm dài: "tìm kiếm nhị phân" match trước "tìm kiếm"
- Bỏ qua trong `<code>`
- 1 lần/câu dù xuất hiện nhiều lần
- Case-insensitive chữ đầu
- Không match khi là một phần của từ khác

---

## 3. Tầng 2 — Khung tự hỏi (Thinking Routine Panel)

### 3.1. Wording chính xác của 3 câu hỏi vàng

**Câu 1 — Diễn đạt lại:**
> "Câu này đang hỏi gì? Viết lại bằng lời của bạn (1-2 câu)."
> Hint nhỏ: "Nếu không viết lại được thì bạn chưa hiểu thật — đó là bình thường, cứ thử."

**Câu 2 — Từ chưa rõ:**
> "Từ nào bạn không chắc nghĩa? Bấm vào từ được gạch chân trong câu hỏi."
> (Tái dùng highlight từ Tầng 1, không cần UI riêng)

**Câu 3 — Liên hệ bài cũ:**
> "Nó giống bài nào bạn đã học?"
> Hiển thị tối đa 3 bài: lấy từ PREQ của bài hiện tại, lọc bài đã done.
> Mỗi bài: tên + nút "Mở sổ tay".

### 3.2. Component ComprehensionPanel (spec chi tiết)

**File:** `src/components/ComprehensionPanel.svelte` (~150 dòng)

```svelte
<script lang="ts">
  import GlossaryText from './GlossaryText.svelte';
  import { getDraft, saveDraft } from '../services/comprehension-drafts';

  interface Props {
    stepId: string;      // vd "w12-s3" để lưu nháp riêng
    stepText: string;    // câu hỏi gốc (HTML)
    lessonId: string;   // để tìm bài liên quan
  }
  const { stepId, stepText, lessonId }: Props = $props();

  let open = $state(false);
  let restatement = $state(getDraft(stepId) ?? '');
  let saved = $state(false);

  // Bài liên quan: PREQ[lessonId] ∩ done, tối đa 3
  const related = $derived(getRelatedLessons(lessonId).slice(0, 3));

  function save() {
    saveDraft(stepId, restatement);
    saved = true;
    setTimeout(() => saved = false, 2000);
  }
</script>

<button class="comp-toggle" onclick={() => open = !open}>
  {open ? 'Đóng' : 'Chưa hiểu câu hỏi 🤔'}
</button>

{#if open}
  <div class="comp-panel">
    <div class="comp-q">
      <b>1. Câu này đang hỏi gì?</b>
      <p class="comp-hint">Viết lại bằng lời của bạn (1-2 câu).</p>
      <textarea bind:value={restatement} rows="2"
        placeholder="Vd: Hàm nhận vào..., cần trả về..."></textarea>
      <button onclick={save}>Lưu nháp</button>
      {#if saved}<span class="comp-saved">Đã lưu ✓</span>{/if}
    </div>

    <div class="comp-q">
      <b>2. Từ nào bạn không chắc nghĩa?</b>
      <p class="comp-hint">Bấm vào từ được gạch chân trong câu hỏi:</p>
      <GlossaryText text={stepText} />
    </div>

    <div class="comp-q">
      <b>3. Nó giống bài nào bạn đã học?</b>
      {#if related.length === 0}
        <p class="comp-hint">Chưa có bài liên quan đã học. Cứ thử làm, sai cũng được.</p>
      {:else}
        {#each related as r}
          <button onclick={() => openNotebook(r.id)}>{r.title} →</button>
        {/each}
      {/if}
    </div>

    <button class="comp-done" onclick={() => open = false}>
      Tôi hiểu rồi, làm tiếp →
    </button>
  </div>
{/if}
```

### 3.3. Lưu nháp (localStorage schema)

**File:** `src/services/comprehension-drafts.ts` (~40 dòng)

```ts
const KEY = 'dsa-comprehension-drafts';

interface DraftMap { [stepId: string]: string }

export function getDraft(stepId: string): string | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as DraftMap;
    return map[stepId] ?? null;
  } catch { return null; }
}

export function saveDraft(stepId: string, text: string): void {
  try {
    const raw = localStorage.getItem(KEY);
    const map: DraftMap = raw ? JSON.parse(raw) as DraftMap : {};
    if (text.trim()) map[stepId] = text.trim();
    else delete map[stepId];
    localStorage.setItem(KEY, JSON.stringify(map));
  } catch { /* bỏ qua khi đầy/khóa */ }
}
```

- Key riêng, không lẫn vào `dsa` (progress chính)
- stepId format: `{lessonId}-{stepIndex}` vd `"w12-3"`
- Không giới hạn số lượng (text ngắn, không đáng kể)

### 3.4. Tích hợp

**`src/components/steps/StepView.svelte`:**

```diff
  <div class="q"><GlossaryText text={step.q} /></div>
+ <ComprehensionPanel stepId={lessonId + '-' + stepIndex} stepText={step.q} lessonId={lessonId} />
```

Cần truyền thêm `lessonId` và `stepIndex` vào StepView (hiện chỉ có step).
Vị trí: ngay dưới câu hỏi, trên phần tương tác (input/buttons).

**Không tích hợp vào:**
- ProbeScreen: probe là kiểm tra, không nên có scaffolding (làm sai lệch đánh giá)
- TinyCheckScreen: tương tự

### 3.5. Test

- Panel mở/đóng, không vỡ khi stepText rỗng
- Draft lưu/load đúng stepId, xóa khi text rỗng
- related rỗng → hiện thông báo phù hợp
- Không ảnh hưởng flow trả lời (panel độc lập)

---

## 4. Tầng 3 — Mổ xẻ viết tay (Curated Dissections)

### 4.1. Data model

```ts
// Thêm vào StepBase trong src/domain/types.ts
export interface Dissection {
  /** trích đúng câu từ trong đề (để người học đối chiếu) */
  quote: string;
  /** giải thích mệnh đề này nói gì + bẫy ngôn ngữ ở đâu */
  explain: string;
}

interface StepBase {
  // ... existing fields
  /** mổ xẻ câu từ — optional, chỉ thêm cho câu hỏi khó */
  dissect?: Dissection[];
}
```

### 4.2. UI

**Trong StepView.svelte**, sau ComprehensionPanel:

```svelte
{#if step.dissect && step.dissect.length > 0}
  <details class="dissect">
    <summary>Mổ xẻ câu hỏi 🔍 ({step.dissect.length} điểm)</summary>
    {#each step.dissect as d}
      <blockquote>"{d.quote}"</blockquote>
      <p>{d.explain}</p>
    {/each}
  </details>
{/if}
```

Dùng `<details>` native: không cần state, accessible, gọn.

### 4.3. Content mẫu đầy đủ — Đợt 1

#### w12 — allowed_requests (rate limiter)

Đề: *"Viết hàm allowed_requests(times, t, limit, window) kiểm tra yêu cầu tại
thời điểm t có được chấp nhận không. Đếm số yêu cầu ĐÃ ĐƯỢC CHẤP NHẬN trước đó
có thời điểm lớn hơn t - window; nếu ít hơn limit thì chấp nhận."*

```ts
dissect: [
  {
    quote: "số yêu cầu ĐÃ ĐƯỢC CHẤP NHẬN trước đó",
    explain: "Chỉ đếm yêu cầu đã qua (accepted). Yêu cầu bị từ chối trước đó KHÔNG tính. Đây là bẫy số 1: nhiều người đếm hết mọi yêu cầu trong times."
  },
  {
    quote: "có thời điểm lớn hơn t - window",
    explain: "Dấu > nghiêm ngặt, không phải >=. Yêu cầu đúng bằng t - window đã hết hạn, không tính. Ví dụ: t=10, window=5 → chỉ tính yêu cầu có thời điểm > 5."
  },
  {
    quote: "nếu ít hơn limit thì chấp nhận",
    explain: "So sánh số đếm được với limit. Ít hơn (< limit) thì cho qua và GHI NHẬN yêu cầu này vào danh sách đã chấp nhận để lần sau đếm."
  },
  {
    quote: "times không giảm dần",
    explain: "Đề không đảm bảo thời gian tăng dần. Đừng giả định times đã sắp xếp — nhưng với bài này ta chỉ cần đếm, không cần sắp xếp."
  }
]
```

#### w10 — install_order (topological sort)

Đề: *"Viết hàm install_order(packages) trả về thứ tự cài đặt. Mỗi gói có danh
sách phụ thuộc. Khi nhiều thứ tự đúng, chọn theo thứ tự chữ cái. Gói thiếu hoặc
phụ thuộc vòng thì báo ValueError."*

```ts
dissect: [
  {
    quote: "Khi nhiều thứ tự đúng, chọn theo thứ tự chữ cái",
    explain: "Tie-break: trong các gói 'sẵn sàng cài' (đủ phụ thuộc), luôn chọn tên alphabet trước. Ví dụ: a và b đều sẵn sàng → cài a trước."
  },
  {
    quote: "Gói thiếu hoặc phụ thuộc vòng thì báo ValueError",
    explain: "Hai lỗi khác nguyên nhân nhưng cùng loại ValueError. 'Thiếu' = đề cập gói không tồn tại. 'Vòng' = a cần b, b cần a (không thể cài)."
  },
  {
    quote: "thứ tự cài đặt",
    explain: "Trả về DANH SÁCH tên gói theo thứ tự cài, không phải True/False. Gói phụ thuộc phải đứng TRƯỚC gói cần nó."
  }
]
```

#### w11 — bracket_error

Đề: *"Viết hàm bracket_error(s) kiểm tra chuỗi ngoặc. Trả về chỉ số ngoặc mở
chưa đóng nằm gần cuối nhất; -1 nếu hợp lệ; raise ValueError nếu có ngoặc đóng
thừa hoặc sai loại."*

```ts
dissect: [
  {
    quote: "ngoặc mở chưa đóng nằm gần cuối nhất",
    explain: "Innermost, không phải outermost. Ví dụ '({[' → trả về chỉ số của '[', không phải '('."
  },
  {
    quote: "trả về chỉ số ... ; -1 nếu hợp lệ",
    explain: "Hai loại output: số nguyên (chỉ số lỗi) hoặc -1 (không lỗi). Đừng nhầm với True/False."
  },
  {
    quote: "raise ValueError nếu có ngoặc đóng thừa hoặc sai loại",
    explain: "Ba loại lỗi khác nhau: (1) đóng thừa '}' → raise ngay; (2) sai loại '([)]' → raise; (3) mở chưa đóng → TRẢ VỀ chỉ số (không raise)."
  }
]
```

### 4.4. Quy trình viết content đợt tiếp theo

1. Chọn bài theo độ ưu tiên (đề dài + nhiều mệnh đề điều kiện)
2. Đọc đề, gạch chân từng mệnh đề có thể gây hiểu nhầm
3. Mỗi dissection: 1 quote (≤20 từ) + 1 explain (≤3 câu, nêu bẫy cụ thể)
4. Tối đa 4 dissections/câu (hơn thì đề cần viết lại, không phải mổ xẻ)

---

## 5. Lộ trình implement chi tiết

### Phase 1 — Tầng 1: Glossary (dự kiến 2-3 ngày)

| Bước | Việc | File |
|------|------|------|
| 1.1 | Viết `GLOSSARY` 70 terms (theo bảng mục 2.1) | `src/domain/glossary.ts` (mới) |
| 1.2 | Viết `findTerms()` + cache | cùng file |
| 1.3 | Viết `GlossaryText.svelte` (render + popup) | `src/components/GlossaryText.svelte` (mới) |
| 1.4 | Tích hợp vào StepView (mọi branch step) | `src/components/steps/StepView.svelte` (sửa) |
| 1.5 | Tích hợp vào ProbeScreen, TinyCheckScreen | 2 files (sửa) |
| 1.6 | Viết `glossary.test.ts` (5 test cases mục 2.6) | `src/domain/glossary.test.ts` (mới) |
| 1.7 | Chạy full gate: lint, check, test, build | — |

### Phase 2 — Tầng 2: Panel (dự kiến 2 ngày)

| Bước | Việc | File |
|------|------|------|
| 2.1 | Viết `comprehension-drafts.ts` (localStorage) | `src/services/comprehension-drafts.ts` (mới) |
| 2.2 | Viết `ComprehensionPanel.svelte` (3 câu hỏi) | `src/components/ComprehensionPanel.svelte` (mới) |
| 2.3 | Truyền `lessonId`+`stepIndex` vào StepView | `StepView.svelte`, `LessonRunner.svelte` (sửa) |
| 2.4 | Thêm panel dưới câu hỏi mỗi step | `StepView.svelte` (sửa) |
| 2.5 | Test panel + drafts | `comprehension-panel.test.ts` (mới) |
| 2.6 | Full gate | — |

### Phase 3 — Tầng 3: Dissections (dự kiến 3-4 ngày, làm dần)

| Bước | Việc | File |
|------|------|------|
| 3.1 | Thêm `Dissection` + `dissect?` vào types | `src/domain/types.ts` (sửa) |
| 3.2 | UI accordion bằng `<details>` trong StepView | `StepView.svelte` (sửa) |
| 3.3 | Viết dissections w12 (4 cái, mẫu mục 4.3) | `workshop-w12.ts` (sửa) |
| 3.4 | Viết dissections w10, w11 | 2 files (sửa) |
| 3.5 | Full gate + review content | — |

**Tổng: ~7-9 ngày làm việc**, có thể song song Phase 1+2 (khác files).

---

## 6. Testing strategy

### Unit tests
- `glossary.test.ts`: 5 cases (cụm dài, bỏ qua code, 1 lần/câu, hoa/thường, whole-word)
- `comprehension-drafts.test.ts`: lưu/load/xóa, key riêng biệt
- Panel: mở/đóng, related rỗng, không vỡ khi thiếu text

### Integration tests
- Render 1 lesson có glossary terms → không vỡ, highlight đúng số lượng
- Panel không ảnh hưởng `onAnswer` flow
- Dissect chỉ hiện khi có data

### Manual QA checklist
- [ ] Đọc 1 bài w12 từ đầu đến cuối với panel mở: có chỗ nào rối không?
- [ ] Bấm 10 terms ngẫu nhiên: popup hiện đúng, không tràn mobile
- [ ] Tắt/mở panel 20 lần: không rò rỉ state
- [ ] Kiểm tra với người học thật (khi có): họ có bấm "Chưa hiểu" không? Có hiểu hơn không?

---

## 7. Rủi ro và giảm thiểu

| Rủi ro | Khả năng | Giảm thiểu |
|--------|----------|------------|
| Highlight sai từ trong câu tiếng Việt | Trung bình | Whole-word match + test với 20 câu thật |
| Popup che nội dung trên mobile | Thấp | Inline (không absolute), max-width 90vw |
| Người học lạm dụng panel thay vì tự nghĩ | Thấp | Panel là optional; câu 1 yêu cầu tự viết trước |
| Glossary thiếu term quan trọng | Cao | Đợt đầu 70 terms, bổ sung khi người học phản hồi "từ này chưa có nghĩa" |
| Performance với 70 terms × render | Thấp | Cache theo text, chỉ match ngoài `<code>` |

---

## 8. Quy tắc kỹ thuật (giữ nguyên toàn dự án)

- Không file quá 300 dòng code
- TypeScript strict tối đa, cấm `any`/`unknown`/`!`
- ESLint nghiêm (hiện tại 0 lỗi)
- Không kind step mới, không sửa state machine flows
- Mọi thay đổi qua nhánh riêng → PR → duyệt → merge. **Không push thẳng main.**

---

## 9. Tiêu chí nghiệm thu (Definition of Done)

### Tầng 1
- [ ] 70 terms có định nghĩa ≤2 câu, đúng chính tả
- [ ] Highlight đúng trong mọi loại step (choice/input/order/build/code/tests)
- [ ] Highlight đúng trong probe và tiny-check
- [ ] Bấm term → popup nghĩa + nút "Đọc thêm" (nếu có lessonId)
- [ ] Không highlight trong `<code>`, mỗi term 1 lần/câu

### Tầng 2
- [ ] Nút "Chưa hiểu câu hỏi" hiện trên mọi step (không hiện ở probe)
- [ ] 3 câu hỏi đúng wording mục 3.1
- [ ] Nháp câu 1 lưu được, tải lại trang vẫn còn
- [ ] Câu 3 gợi ý đúng bài đã học (từ PREQ ∩ done)
- [ ] Đóng panel → làm tiếp bình thường, không mất state bài

### Tầng 3
- [ ] `dissect` render accordion chỉ khi có data
- [ ] w12, w10, w11 có dissections đầy đủ như mẫu
- [ ] Quote trích đúng từng chữ trong đề

### Chung
- [ ] `npm run lint`: 0 lỗi
- [ ] `npm run check`: 0 lỗi, 0 warning
- [ ] Tests xanh (bao gồm tests mới)
- [ ] `npm run build`: thành công
- [ ] Không vỡ flow học hiện tại
