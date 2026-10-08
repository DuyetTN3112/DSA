<script lang="ts">
  import type { Lesson } from '../domain/types';
  import type { RootcheckFlow } from '../flows/rootcheck-flow.svelte';
  import ProbeScreen from './ProbeScreen.svelte';

  // Màn truy tìm gốc hổng, gắn với RootcheckFlow:
  // intro -> probing (ProbeScreen) -> found-root | all-clear.
  interface Props {
    flow: RootcheckFlow;
    lessons: Record<string, Lesson>;
    titles: Record<string, string>;
    onExit: () => void;
  }
  const { flow, lessons, titles, onExit }: Props = $props();
</script>

{#if flow.phase === 'intro'}
  <h2>Truy tìm gốc hổng: {titles[flow.lessonId] ?? flow.lessonId}</h2>
  <p class="sub">
    Trượt nhiều ở bài này thường do hổng từ bài nền. Mình kiểm tra từng bài
    nền bằng đề mới để tìm đúng chỗ gốc.
  </p>
  <p>
    <button class="go" onclick={() => { flow.begin(); }}>Bắt đầu</button>
    <button class="ghost" onclick={onExit}>Để sau</button>
  </p>
{:else if flow.phase === 'probing' && flow.activeProbe}
  <ProbeScreen
    flow={flow.activeProbe}
    {lessons}
    {titles}
    title="Truy tìm gốc hổng"
  />
{:else if flow.phase === 'found-root'}
  <h2>Tìm ra gốc rồi</h2>
  <div class="fb">
    Bài nền <b>{flow.foundRootTitle}</b> chưa vững — đó là gốc khiến bài này
    trượt. Học lại từ gốc sẽ rẻ hơn cố nhồi bài ngọn.
  </div>
  <p>
    <button class="go" onclick={() => { flow.restartAtRoot(); }}>
      Học lại «{flow.foundRootTitle}» từ đầu
    </button>
    <button class="ghost" onclick={onExit}>Để sau</button>
  </p>
{:else if flow.phase === 'all-clear'}
  <h2>Nền vẫn vững</h2>
  <div class="fb ok">
    Các bài nền đều qua được đề mới. Vậy chỗ hổng nằm ở chính bài này — học
    lại từ đầu, chậm hơn, mỗi bước tự dự đoán trước.
  </div>
  <p>
    <button class="go" onclick={() => { flow.restartCurrent(); }}>
      Học lại bài này từ đầu
    </button>
    <button class="ghost" onclick={onExit}>Để sau</button>
  </p>
{/if}
