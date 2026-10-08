<script lang="ts">
  import type { OrderStep as OrderStepData } from '../../domain/types';

  // Step "order": sắp xếp các việc nhỏ theo đúng thứ tự thực hiện.
  // items[i] = [tên việc, câu hỏi gợi ý khi chọn sai ở vị trí i].
  interface Props {
    step: OrderStepData;
    onAnswer: (correct: boolean) => void;
  }
  const { step, onAnswer }: Props = $props();
  const data = $derived(step);
  const items = $derived(data.items);
  const reversed: number[] = $derived(items.map((_, i) => i).reverse());
  // Thứ tự đúng = các mảnh không phải distractor, theo đúng index.
  const distractors: number[] = $derived(data.distractors ?? []);
  const expected: number[] = $derived(
    items.map((_, i) => i).filter((i) => !distractors.includes(i)),
  );

  let got = $state<number[]>([]);
  let hint = $state<string | null>(null);

  function pick(i: number): void {
    if (distractors.includes(i)) {
      // Mảnh thừa: giải thích vì sao thừa, không tính tiến độ.
      hint = 'Mảnh này thừa. ' + (items[i]?.[1] ?? '');
      return;
    }
    if (i === expected[got.length]) {
      got = [...got, i];
      hint = null;
      if (got.length === expected.length) onAnswer(true);
    } else {
      const h = items[expected[got.length] ?? -1];
      hint = h ? h[1] : null;
    }
  }
</script>

{#if data.ph}<p class="ph">{data.ph}</p>{/if}
<div class="q">{@html step.q}</div>
<ol>
  {#each got as gi (gi)}
    <li>{#if data.code}<code>{items[gi]?.[0]}</code>{:else}{items[gi]?.[0]}{/if}</li>
  {/each}
</ol>
{#if got.length < expected.length}
  {#if hint}<div class="fb ok">Hãy nghĩ: {hint}</div>{/if}
  <div class="opts" style="flex-direction:column;align-items:flex-start;margin-top:8px">
    {#each reversed.filter((i) => !got.includes(i)) as i (i)}
      <button onclick={() => { pick(i); }}>
        {#if data.code}<code>{items[i]?.[0]}</code>{:else}{items[i]?.[0]}{/if}
      </button>
    {/each}
  </div>
{:else}
  <div class="fb ok">Đúng thứ tự rồi. Đây cũng chính là dàn ý của code.</div>
{/if}

<style>
  code {
    font-family: ui-monospace, monospace;
    white-space: pre;
  }
</style>
