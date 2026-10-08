<script lang="ts">
  import type { LessonStep } from '../../domain/types';
  import BuildStep from './BuildStep.svelte';
  import ChoiceStep from './ChoiceStep.svelte';
  import ClickStep from './ClickStep.svelte';
  import CodeStep from './CodeStep.svelte';
  import InputStep from './InputStep.svelte';
  import OpenStep from './OpenStep.svelte';
  import OrderStep from './OrderStep.svelte';
  import ReflectStep from './ReflectStep.svelte';
  import TapStep from './TapStep.svelte';

  // Dispatcher: chọn component tương tác theo step.k.
  // LessonRunner bọc ngoài, lo feedback / gợi ý / log / chuyển bước.
  interface Props {
    step: LessonStep;
    /** mảng minh họa của bài (cho click/open/tap); rỗng nếu bài không có */
    values: number[];
    onAnswer: (correct: boolean) => void;
  }
  const { step, values, onAnswer }: Props = $props();
</script>

{#if step.k === 'click'}
  <ClickStep {step} {values} {onAnswer} />
{:else if step.k === 'input'}
  <InputStep {step} {onAnswer} />
{:else if step.k === 'choice'}
  <ChoiceStep {step} {onAnswer} />
{:else if step.k === 'open'}
  <OpenStep {step} {values} {onAnswer} />
{:else if step.k === 'tap'}
  <TapStep {step} {values} {onAnswer} />
{:else if step.k === 'order'}
  <OrderStep {step} {onAnswer} />
{:else if step.k === 'reflect'}
  <ReflectStep {step} {onAnswer} />
{:else if step.k === 'build'}
  <BuildStep {step} {onAnswer} />
{:else}
  <!-- code / tests: stub chờ engine -->
  <CodeStep {step} {onAnswer} />
{/if}
