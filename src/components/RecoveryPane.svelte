<script lang="ts">
  import type { Lesson } from '../domain/types';
  import type { RecoveryFlow } from '../flows/recovery-flow.svelte';
  import NotebookView from './NotebookView.svelte';
  import ProbeScreen from './ProbeScreen.svelte';
  import TinyCheckScreen from './TinyCheckScreen.svelte';

  // Khôi phục kiến thức: sổ tay -> tiny-check -> câu hỏi mới (retest).
  // Dùng chung cho ReviewScreen và HealthCheckScreen.
  interface Props {
    recovery: RecoveryFlow;
    lessons: Record<string, Lesson>;
    titles: Record<string, string>;
  }
  const { recovery, lessons, titles }: Props = $props();

  const lesson = $derived(lessons[recovery.lessonId] ?? null);
</script>

{#if recovery.phase === 'notebook' && recovery.notebook}
  {@const nb = recovery.notebook}
  {#if lesson}
    <NotebookView
      {lesson}
      {titles}
      backLabel="Đã đọc, kiểm tra nhanh"
      onBack={() => { nb.pressBack(); }}
      onNavigate={(id: string) => { nb.openLinked(id); }}
    />
  {/if}
  {#if nb.tiny}
    <TinyCheckScreen flow={nb.tiny} />
  {/if}
{:else if recovery.phase === 'retest' && recovery.retestProbe}
  <ProbeScreen
    flow={recovery.retestProbe}
    {lessons}
    {titles}
    title="Ôn lại sau khi đọc"
  />
{:else if recovery.phase === 'retest-done'}
  {#if recovery.retestOk}
    <div class="fb ok"><b>Lấy lại được rồi.</b> Câu mới làm đúng — kiến thức đã về.</div>
  {:else}
    <div class="fb"><b>Vẫn chưa đúng.</b> Đừng cố nhồi — học lại từ đầu sẽ rẻ hơn.</div>
    <p>
      <button class="go" onclick={() => { recovery.restartLesson(); }}>
        Học lại bài từ đầu
      </button>
    </p>
  {/if}
  <p><button class="ghost" onclick={() => { recovery.goBack(); }}>Quay lại</button></p>
{/if}
