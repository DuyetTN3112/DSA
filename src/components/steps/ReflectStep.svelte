<script lang="ts">
  import type { LessonStep } from '../../domain/types';

  // Step "reflect": viết suy nghĩ bằng lời của mình.
  // okR: đủ dài, đủ từ khác nhau, không lặp ký tự — chống gõ bừa.
  interface Props {
    step: LessonStep;
    onAnswer: (correct: boolean) => void;
  }
  const { step, onAnswer }: Props = $props();
  let text = $state('');
  let error = $state<string | null>(null);

  function okR(v: string): boolean {
    const t = v.trim();
    const words = new Set(
      t.toLowerCase().split(/\s+/).filter((x) => x.length >= 2 && /\p{L}/u.test(x)),
    );
    return (
      t.length >= 15 &&
      words.size >= 4 &&
      new Set(t.toLowerCase()).size >= 8 &&
      !/(.)\1{3,}/.test(t)
    );
  }

  function submit(): void {
    if (!okR(text)) {
      error = 'Hãy viết bằng lời của bạn: ít nhất vài từ khác nhau, không lặp ký tự.';
      return;
    }
    error = null;
    onAnswer(true);
  }
</script>

<div class="q">{@html step.q}</div>
<textarea
  aria-label="Viết suy nghĩ của bạn"
  placeholder="Viết ra suy nghĩ của bạn..."
  bind:value={text}
></textarea>
{#if error}<div class="fb">{error}</div>{/if}
<p><button class="go" onclick={submit}>Tôi đã viết xong</button></p>
