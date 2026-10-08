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

  let got = $state<number[]>([]);
  let hint = $state<string | null>(null);

  function pick(i: number): void {
    if (i === got.length) {
      got = [...got, i];
      hint = null;
      if (got.length === items.length) onAnswer(true);
    } else {
      const h = items[got.length];
      hint = h ? h[1] : null;
    }
  }
</script>

{#if data.ph}<p class="ph">{data.ph}</p>{/if}
<div class="q">{@html step.q}</div>
<ol>
  {#each got as gi (gi)}
    <li>{items[gi]?.[0]}</li>
  {/each}
</ol>
{#if got.length < items.length}
  {#if hint}<div class="fb ok">Hãy nghĩ: {hint}</div>{/if}
  <div class="opts" style="flex-direction:column;align-items:flex-start;margin-top:8px">
    {#each reversed.filter((i) => !got.includes(i)) as i (i)}
      <button onclick={() => { pick(i); }}>{items[i]?.[0]}</button>
    {/each}
  </div>
{:else}
  <div class="fb ok">Đúng thứ tự rồi. Đây cũng chính là dàn ý của code.</div>
{/if}
