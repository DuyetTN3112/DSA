<script lang="ts">
  import type { Lesson } from '../domain/types';
  import type { HealthCheckFlow } from '../flows/healthcheck-flow.svelte';
  import ProbeScreen from './ProbeScreen.svelte';
  import RecoveryPane from './RecoveryPane.svelte';

  // Màn kiểm tra nền tảng, gắn với HealthCheckFlow.
  // intro -> asking (ProbeScreen) -> result (+ recovery khi cần).
  interface Props {
    flow: HealthCheckFlow;
    lessons: Record<string, Lesson>;
    titles: Record<string, string>;
  }
  const { flow, lessons, titles }: Props = $props();

  const recovery = $derived(flow.recovery);
</script>

{#if flow.phase === 'intro'}
  <h2>Kiểm tra nền tảng</h2>
  <p class="sub">
    {flow.queue.length} bài nền được hỏi lại bằng đề mới (không tính điểm cũ).
    Trượt 2 lần liên tiếp thì bài nền bị rút dấu — phải học lại từ gốc.
  </p>
  <p><button class="go" onclick={() => { flow.beginItems(); }}>Bắt đầu</button></p>
{:else if flow.phase === 'asking' && flow.activeProbe}
  <ProbeScreen
    flow={flow.activeProbe}
    {lessons}
    {titles}
    title="Kiểm tra nền tảng"
  />
{:else if flow.phase === 'result'}
  <h2>Kiểm tra nền tảng: xong</h2>
  <ul class="log">
    {#each flow.results as r (r.id)}
      <li>
        {titles[r.id] ?? r.id}: {r.res === 'ok'
          ? 'vẫn chắc'
          : r.res === 'lucky'
            ? 'đoán đúng (không tính)'
            : r.res === 'unknown'
              ? 'chưa nhớ'
              : r.res === 'shaky'
                ? 'lung lay — cần chứng minh lại'
                : 'bị rút dấu'}
      </li>
    {/each}
  </ul>
  {#if recovery}
    <RecoveryPane {recovery} {lessons} {titles} />
  {:else}
    {#if flow.unknowns.length > 0}
      <p class="sub">Chưa nhớ:</p>
      <div class="opts">
        {#each flow.unknowns as r (r.id)}
          <button class="ghost" onclick={() => { flow.startRecovery(r.id); }}>
            📖 {titles[r.id] ?? r.id}
          </button>
        {/each}
      </div>
    {/if}
    {#if flow.bads.length > 0}
      <p class="sub">Cần xử lý:</p>
      <div class="opts">
        {#each flow.bads as r (r.id)}
          {#if r.res === 'shaky'}
            <button class="ghost" onclick={() => { flow.reprove(r.id); }}>
              Chứng minh lại: {titles[r.id] ?? r.id}
            </button>
          {:else}
            <button class="ghost" onclick={() => { flow.restartLesson(r.id); }}>
              Học lại: {titles[r.id] ?? r.id}
            </button>
          {/if}
        {/each}
      </div>
    {/if}
    <p><button class="go" onclick={() => { flow.exit(); }}>Xong</button></p>
  {/if}
{:else if flow.phase === 'empty'}
  <h2>Kiểm tra nền tảng</h2>
  <p class="sub">
    Cần ít nhất 3 bài nền tảng đã học xong mới kiểm tra được. Học tiếp rồi quay
    lại.
  </p>
  <p><button class="go" onclick={() => { flow.exit(); }}>Về</button></p>
{/if}
