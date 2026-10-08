<script lang="ts">
  import type { Lesson, LessonStep } from '../domain/types';
  import StepView from './steps/StepView.svelte';

  // Chạy một bài học: tự quản lý stepIndex bằng runes.
  // Nhận props sạch { lesson }; flow cha (agent khác) chỉ cần onDone.
  // Không fetch global: mọi thứ cần đều nằm trong lesson.
  interface Props {
    lesson: Lesson;
    onDone: () => void;
  }
  const { lesson, onDone }: Props = $props();

  interface Feedback {
    text: string;
    ok: boolean;
  }

  let stepIndex = $state(0);
  let tries = $state(0);
  let feedback = $state<Feedback | null>(null);
  let hintOpen = $state(false);
  let log = $state<string[]>([]);

  const step: LessonStep | undefined = $derived(lesson.steps[stepIndex]);
  const values: number[] = $derived(lesson.arr ?? []);
  const needsBoxes = $derived(
    step?.k === 'click' || step?.k === 'open' || step?.k === 'tap',
  );

  function resetStepState(): void {
    tries = 0;
    feedback = null;
    hintOpen = false;
  }

  function advance(): void {
    if (stepIndex + 1 >= lesson.steps.length) {
      onDone();
      return;
    }
    stepIndex += 1;
    resetStepState();
  }

  function handleAnswer(correct: boolean): void {
    const st = step;
    if (!st) return;
    if (correct) {
      log = [...log, st.s || 'Đã làm'];
      advance();
      return;
    }
    tries += 1;
    feedback = {
      text: 'Chưa đúng, không sao, sai là cách não học. Gợi ý: ' + (st.h ?? ''),
      ok: false,
    };
  }

  function askHint(): void {
    hintOpen = true;
  }

  function peekAnswer(): void {
    const st = step;
    if (!st) return;
    log = [...log, st.s || 'Đã làm'];
    feedback = {
      text:
        'Đáp án: ' + (st.s ?? '') + ' Hãy tự giải thích lại vì sao trước khi đi tiếp.',
      ok: true,
    };
  }
</script>

<h2>{lesson.t}</h2>
{#if log.length > 0}
  <ul class="log">
    {#each log as entry, i (i)}
      <li>{entry}</li>
    {/each}
  </ul>
{/if}

{#if step}
  {#key stepIndex}
    <StepView {step} {lesson} values={needsBoxes ? values : []} onAnswer={handleAnswer} />
  {/key}

  {#if feedback}
    <div class={'fb' + (feedback.ok ? ' ok' : '')}>{feedback.text}</div>
  {/if}
  {#if hintOpen && !feedback}
    <pre class="out">Gợi ý: {step.h || 'Đọc lại đề, thử bước nhỏ nhất trước.'}</pre>
  {/if}

  <p>
    {#if !hintOpen}
      <button class="ghost" onclick={askHint}>Cần giúp</button>
    {/if}
    {#if tries >= 3 && !feedback?.ok}
      <button class="ghost" onclick={peekAnswer}>Xem đáp án</button>
    {/if}
    {#if feedback?.ok}
      <button class="go" onclick={advance}>Tiếp tục</button>
    {/if}
  </p>
{:else}
  <div class="fb ok"><b>Xong bài này.</b> Thử nhắm mắt và tự kể lại: bạn vừa học được quy luật gì?</div>
  <p><button class="go" onclick={onDone}>Tiếp tục</button></p>
{/if}
