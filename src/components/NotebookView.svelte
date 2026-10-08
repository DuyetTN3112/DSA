<script lang="ts">
  import type { Lesson } from '../domain/types';

  // Sổ tay bài học: ưu tiên mini-textbook 10 mục (nbk), rồi note viết tay,
  // cuối cùng là các ý chính tự rút ra từ bước học.
  // onNavigate(id): mở sổ tay bài nền / concept liên quan (flow cha lo).
  interface Props {
    lesson: Lesson;
    /** tên hiển thị cho các id liên quan; thiếu thì hiện id */
    titles?: Record<string, string>;
    /** nhãn nút quay lại; mặc định "Quay lại" */
    backLabel?: string;
    onBack: () => void;
    onNavigate: (id: string) => void;
  }
  const { lesson, titles = {}, backLabel = 'Quay lại', onBack, onNavigate }: Props = $props();

  const nbk = $derived(lesson.nbk);

  // Các ý chính tự rút ra khi học (bỏ qua kind không hợp: order/tests/code...).
  const keyPoints = $derived.by(() => {
    const skip = new Set(['order', 'tests', 'code', 'reflect', 'open', 'build']);
    const pts: string[] = [];
    for (const st of lesson.steps) {
      const s = st.s;
      if (
        s &&
        !skip.has(st.k) &&
        !/^(Đã |Ôn lại|Test )/.test(s) &&
        s.length >= 30 &&
        !pts.includes(s)
      ) {
        pts.push(s);
      }
    }
    return pts;
  });

  function titleOf(id: string): string {
    return titles[id] ?? id;
  }

  type TextSection =
    | 'model'
    | 'rule'
    | 'ex'
    | 'trace'
    | 'anti'
    | 'pitfalls'
    | 'selfcheck'
    | 'link';
  const sections: { label: string; key: TextSection }[] = [
    { label: 'Mental model', key: 'model' },
    { label: 'Quy tắc dùng ngay', key: 'rule' },
    { label: 'Ví dụ nhỏ', key: 'ex' },
    { label: 'Chạy tay từng bước', key: 'trace' },
    { label: 'Ví dụ ngược (cái KHÔNG phải)', key: 'anti' },
    { label: 'Lỗi thường gặp', key: 'pitfalls' },
    { label: 'Cách tự kiểm tra', key: 'selfcheck' },
    { label: 'Liên hệ với bài đang làm', key: 'link' },
  ];
</script>

<h2>📖 Sổ tay: {lesson.t}</h2>
<p class="sub">
  Giở lại lý thuyết khi chưa hiểu là cách học đúng, giống mở sách giáo khoa khi
  làm bài tập. Điền bừa thì không.
</p>

{#if nbk}
  <div class="fb ok">
    <b>Ý tưởng:</b> {@html nbk.idea}<br /><b>Vì sao cần nó:</b> {@html nbk.why}
  </div>
  {#each sections as sec (sec.key)}
    <p><b>{sec.label}:</b> {@html nbk[sec.key]}</p>
  {/each}
  {#if nbk.pre && nbk.pre.length > 0}
    <p>
      <b>Hổng chỗ này? Về lại nền:</b>
      {#each nbk.pre as id (id)}
        <button class="ghost" onclick={() => { onNavigate(id); }}>📖 {titleOf(id)}</button>
      {/each}
    </p>
  {/if}
  {#if nbk.links && nbk.links.length > 0}
    <p>
      <b>Xem thêm:</b>
      {#each nbk.links as id (id)}
        <button class="ghost" onclick={() => { onNavigate(id); }}>📖 {titleOf(id)}</button>
      {/each}
    </p>
  {/if}
{:else if lesson.note}
  <div class="fb ok">{@html lesson.note}</div>
{:else}
  <p class="sub">
    Bài này chưa có trang sổ tay viết tay; dưới đây là các ý chính bạn đã rút ra
    khi học.
  </p>
{/if}

{#if keyPoints.length > 0}
  {#if nbk || lesson.note}
    <details>
      <summary>Các ý bạn đã tự rút ra khi học bài này</summary>
      <ul>
        {#each keyPoints as pt, i (i)}
          <li>{@html pt}</li>
        {/each}
      </ul>
    </details>
  {:else}
    <p><b>Các ý chính của bài:</b></p>
    <ul>
      {#each keyPoints as pt, i (i)}
        <li>{@html pt}</li>
      {/each}
    </ul>
  {/if}
{/if}

<p><button class="go" onclick={onBack}>{backLabel}</button></p>
