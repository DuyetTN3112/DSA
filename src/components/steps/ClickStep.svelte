<script lang="ts">
  import type { ClickStep as ClickStepData } from '../../domain/types';
  import ArrayView from './ArrayView.svelte';

  // Step "click": bấm vào đúng hộp (step.a là chỉ số).
  // Props giữ nguyên contract LessonStep; LessonRunner lo feedback + log.
  interface Props {
    step: ClickStepData;
    values: number[];
    onAnswer: (correct: boolean) => void;
  }
  const { step, values, onAnswer }: Props = $props();

  function pick(i: number): void {
    onAnswer(typeof step.a === 'number' && i === step.a);
  }
</script>

<div class="q">{@html step.q}</div>
<ArrayView values={values} opened={values.map(() => true)} clickable={true} onPick={pick} />
