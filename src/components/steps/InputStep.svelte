<script lang="ts">
  import type { InputStep as InputStepData } from '../../domain/types';

  // Step "input": điền số rồi bấm Kiểm tra (Enter cũng được).
  interface Props {
    step: InputStepData;
    onAnswer: (correct: boolean) => void;
  }
  const { step, onAnswer }: Props = $props();
  let val = $state('');

  function submit(): void {
    if (val.trim() === '') return;
    if (typeof step.a === 'number') {
      onAnswer(Number(val) === step.a);
    } else {
      onAnswer(val.trim() === step.a);
    }
  }
</script>

<div class="q">{@html step.q}</div>
<input
  type="number"
  inputmode="numeric"
  aria-label="Câu trả lời"
  bind:value={val}
  onkeydown={(e) => {
    if (e.key === 'Enter') submit();
  }}
/>
<button class="go" onclick={submit}>Kiểm tra</button>
