<script lang="ts">
  import type { LessonStep } from '../../domain/types';
  import ArrayView from './ArrayView.svelte';

  // Step "tap": chạm HẾT các vật (thứ tự tùy ý) thì qua. Vật luôn hiện;
  // mỗi lần chạm, dưới vật hiện số đếm tiếp theo (1, 2, 3...) và vật được tô sáng.
  interface Props {
    step: LessonStep;
    values: (string | number)[];
    onAnswer: (correct: boolean) => void;
  }
  const { step, values, onAnswer }: Props = $props();
  // indices đã mở; opened suy ra từ đó. Component được remount mỗi bước
  // (StepView bọc {#key}) nên không cần reset khi values đổi.
  let picked = $state<number[]>([]);
  const shown = $derived(values.map(() => true));
  const marked = $derived(values.map((_, idx) => picked.includes(idx)));
  const labels = $derived(
    values.map((_, idx) => {
      const order = picked.indexOf(idx);
      return order >= 0 ? order + 1 : '';
    }),
  );

  function pick(i: number): void {
    if (picked.includes(i)) return;
    const next = [...picked, i];
    picked = next;
    if (next.length === values.length) onAnswer(true);
  }
</script>

<ArrayView values={values} opened={shown} {marked} {labels} clickable={true} onPick={pick} />
<div class="q">{@html step.q}</div>
