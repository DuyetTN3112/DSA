<script lang="ts">
  import type { StuckKind } from '../domain/types';

  // Màn phân loại vướng mắc khi bấm "Chưa hiểu".
  // "Chưa hiểu" là learning signal, không phải sai: hỏi rõ vướng ở đâu
  // để flow cha mở đúng reference. onPick(null) = Quay lại = sinh câu mới.
  interface Props {
    onPick: (kind: StuckKind | null) => void;
  }
  const { onPick }: Props = $props();

  const kinds: { kind: StuckKind; label: string }[] = [
    { kind: 'de', label: 'Tôi không hiểu đề đang hỏi gì' },
    { kind: 'concept', label: 'Tôi không hiểu từ / khái niệm trong đề' },
    { kind: 'start', label: 'Tôi hiểu đề nhưng không biết bắt đầu từ đâu' },
    { kind: 'python', label: 'Tôi hiểu ý nhưng không biết viết Python' },
    { kind: 'theory', label: 'Tôi không hiểu lý thuyết phía sau' },
    { kind: 'unsure', label: 'Tôi chỉ không chắc đáp án' },
  ];
</script>

<p class="sub">
  Bạn đang vướng ở đâu? Nói đúng chỗ thì mình mở đúng trang sách — không cần
  đoán mò.
</p>
<div class="opts">
  {#each kinds as k (k.kind)}
    <button onclick={() => { onPick(k.kind); }}>{k.label}</button>
  {/each}
</div>
<p><button class="ghost" onclick={() => { onPick(null); }}>Quay lại</button></p>
