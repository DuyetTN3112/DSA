<script lang="ts">
  import type { LessonStep } from '../../domain/types';
  import ArrayView from './ArrayView.svelte';

  // Step "tap": bấm mở HẾT các hộp (thứ tự tùy ý) thì qua.
  interface Props {
    step: LessonStep;
    values: number[];
    onAnswer: (correct: boolean) => void;
  }
  const { step, values, onAnswer }: Props = $props();
  // indices đã mở; opened suy ra từ đó. Component được remount mỗi bước
  // (StepView bọc {#key}) nên không cần reset khi values đổi.
  let picked = $state<number[]>([]);
  const opened = $derived(values.map((_, idx) => picked.includes(idx)));

  function pick(i: number): void {
    if (picked.includes(i)) return;
    const next = [...picked, i];
    picked = next;
    if (next.length === values.length) onAnswer(true);
  }
</script>

<div class="q">{@html step.q}</div>
<ArrayView values={values} opened={opened} clickable={true} onPick={pick} />
