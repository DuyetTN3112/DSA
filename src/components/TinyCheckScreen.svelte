<script lang="ts">
  import type { TinyCheckFlow } from '../flows/notebook-flow.svelte';

  // Render TinyCheckFlow: asking -> feedback -> regress -> done.
  // Flow tự gọi onDone khi xong; component chỉ render state hiện tại.
  interface Props {
    flow: TinyCheckFlow;
  }
  const { flow }: Props = $props();

  let inputVal = $state('');
  let lastQ = $state<string | null>(null);
  $effect(() => {
    const key = flow.current?.q ?? null;
    if (key !== lastQ) {
      lastQ = key;
      inputVal = '';
    }
  });

  const q = $derived(flow.current);
  const options = $derived.by(() => {
    const qq = q;
    if (!qq?.o) return null;
    return flow.optionOrder.map((oi) => ({
      text: qq.o?.[oi] ?? '',
      display: oi,
    }));
  });

  function submitInput(): void {
    if (inputVal.trim() === '') return;
    flow.answerNumeric(Number(inputVal));
  }
</script>

{#if flow.phase === 'asking' && q}
  <h2>Kiểm tra nhanh ({flow.index + 1}/{flow.questions.length})</h2>
  <p class="sub">
    Trả lời đúng các câu rất ngắn này thì mình tin là bạn đã hiểu phần vừa đọc.
  </p>
  <div class="q">{@html q.q}</div>
  {#if options}
    <div class="opts">
      {#each options as opt (opt.display)}
        <button onclick={() => { flow.answerChoice(opt.display); }}>
          {@html opt.text}
        </button>
      {/each}
    </div>
  {:else}
    <input
      type="number"
      aria-label="Câu trả lời"
      bind:value={inputVal}
      onkeydown={(e) => {
        if (e.key === 'Enter') submitInput();
      }}
    />
    <button class="go" onclick={submitInput}>Kiểm tra</button>
  {/if}
{:else if flow.phase === 'feedback'}
  <div class={'fb' + (flow.feedbackOk ? ' ok' : '')}>{flow.feedback}</div>
  <p><button class="go" onclick={() => { flow.continue(); }}>Tiếp</button></p>
{:else if flow.phase === 'regress'}
  <h2>Kiểm tra nhanh: chưa chắc</h2>
  <div class="fb">
    Bạn sai {flow.wrong}/{flow.questions.length} câu kiểm tra nhanh. Đọc thêm
    một lượt nữa chưa đủ — nên quay về chỗ bị hổng.
  </div>
  <p>
    <button class="go" onclick={() => { flow.regressRestart(); }}>
      Học lại bài từ đầu
    </button>
    <button class="ghost" onclick={() => { flow.regressRootcheck(); }}>
      Kiểm tra xem nền có hổng không
    </button>
    <button class="ghost" onclick={() => { flow.retry(); }}>
      Thử lại kiểm tra nhanh
    </button>
  </p>
{/if}
