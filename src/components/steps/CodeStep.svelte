<script lang="ts">
  import type { LessonStep } from '../../domain/types';

  // STUB cho kind "code" / "tests": phần chạy Python thật (Skulpt),
  // viết test trước, TDD pipeline thuộc về engine (agent khác).
  // Component này chỉ giữ chỗ để flow bài học không vỡ; KHÔNG tự chạy code.
  interface Props {
    step: LessonStep;
    onAnswer: (correct: boolean) => void;
  }
  const { step, onAnswer }: Props = $props();
</script>

<div class="q">{@html step.q}</div>
<div class="fb ok">
  <b>Bài code tương tác</b> — phần soạn test, chạy Python và chấm sẽ do engine xử lý.
  Tạm thời bấm tiếp tục để đi tiếp flow.
</div>
<p><button class="go" onclick={() => { onAnswer(true); }}>Tiếp tục</button></p>
