<script lang="ts">
  import type { Lesson, ProgressState, Stage } from '../domain/types';

  // Sidebar lộ trình: render theo stage, khóa/mở bài, tiến độ.
  // Không fetch global: trạng thái mở/khóa do flow cha tính (isUnlocked).
  // Layout trang (top/wrap) do App.svelte lo.
  interface Props {
    stages: Stage[];
    lessons: Record<string, Lesson>;
    progress: ProgressState;
    isUnlocked: (id: string) => boolean;
    currentId: string | null;
    onSelect: (id: string) => void;
    onReview: () => void;
  }
  const { stages, lessons, progress, isUnlocked, currentId, onSelect, onReview }: Props =
    $props();

  function titleOf(id: string): string {
    return lessons[id]?.t ?? id;
  }
  function lessonClass(id: string): string {
    const cls = ['lb'];
    if (progress.done[id]) cls.push('done');
    if (currentId === id) cls.push('cur');
    return cls.join(' ');
  }
</script>

<aside id="road">
  <button class="lb g" onclick={onReview}>Ôn hôm nay (trộn các bài đã học)</button>
  {#each stages as st, si (si)}
    <div class={'stage' + (st.L.length ? '' : ' off')}>
      <b>{st.n}</b>
      <small>{st.d}{st.L.length ? '' : ' (sẽ mở sau)'}</small>
      {#each st.L as id (id)}
        <button
          class={lessonClass(id)}
          disabled={!isUnlocked(id)}
          onclick={() => { onSelect(id); }}
        >
          <span>{titleOf(id)}</span>
        </button>
      {/each}
    </div>
  {/each}
  <p class="rule">
    Quy tắc: nghĩ trước khi bấm. Sai thì đọc gợi ý, thử lại. Chỉ sau nhiều lần
    thử mới có nút xem đáp án.
  </p>
</aside>
