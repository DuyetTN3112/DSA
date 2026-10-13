<script lang="ts">
  import type { OpenStep as OpenStepData } from '../../domain/types';
  import ArrayView from './ArrayView.svelte';

  // Step "open": mở từng hộp để tìm (step.a là chỉ số hộp cần tìm).
  // Mở sai thì hộp cứ mở ra (không phạt); mở đúng hộp thì qua.
  interface Props {
    step: OpenStepData;
    values: (string | number)[];
    showIndex?: boolean;
    onAnswer: (correct: boolean) => void;
  }
  const { step, values, showIndex = true, onAnswer }: Props = $props();
  // indices đã mở; opened suy ra từ đó. Component được remount mỗi bước
  // (StepView bọc {#key}) nên không cần reset khi values đổi.
  let picked = $state<number[]>([]);
  const opened = $derived(values.map((_, idx) => picked.includes(idx)));

  function pick(i: number): void {
    if (picked.includes(i)) return;
    picked = [...picked, i];
    if (typeof step.a === 'number' && i === step.a) onAnswer(true);
  }
</script>

<ArrayView values={values} opened={opened} clickable={true} {showIndex} onPick={pick} />
<div class="q">{@html step.q}</div>
