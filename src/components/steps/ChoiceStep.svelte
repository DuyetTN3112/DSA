<script lang="ts">
  import type { ChoiceStep as ChoiceStepData } from '../../domain/types';

  // Step "choice": chọn 1 trong các options (step.o).
  interface Props {
    step: ChoiceStepData;
    onAnswer: (correct: boolean) => void;
  }
  const { step, onAnswer }: Props = $props();
  const options = $derived(step.o);
</script>

<div class="q">{@html step.q}</div>
<div class="opts">
  {#each options as opt, i (i)}
    <button onclick={() => { onAnswer(i === step.a); }}>{@html opt}</button>
  {/each}
</div>
