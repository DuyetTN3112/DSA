<script lang="ts">
  import type { BuildStep as BuildStepData } from '../../domain/types';

  // Step "build": đặt từng mảnh token vào đúng ô theo vai trò.
  // ans[i] là token đúng cho ô i; roles[i] là vai trò của ô (khi guided).
  interface Props {
    step: BuildStepData;
    onAnswer: (correct: boolean) => void;
  }
  const { step, onAnswer }: Props = $props();
  const data = $derived(step);
  const toks = $derived(data.tok);
  const ans = $derived(data.ans);

  let got = $state<number[]>([]);
  let bad = $state(0);
  let msg = $state<string | null>(null);
  let revealed = $state(false);

  const used = $derived(new Set(got));
  const full = $derived(got.length === ans.length);
  const slotIndexes = $derived(ans.map((_, i) => i));

  function undo(): void {
    got = got.slice(0, -1);
    msg = null;
  }
  function reset(): void {
    got = [];
    msg = null;
  }
  function check(): void {
    const seq = got.map((i) => toks[i]);
    const j = seq.findIndex((t, i) => t !== ans[i]);
    if (j < 0) {
      msg = null;
      onAnswer(true);
      return;
    }
    bad += 1;
    const roleHint =
      data.roles && data.guided ? ` Chỗ này cần: ${data.roles[j]}.` : '';
    msg =
      `Chưa đúng. Chỗ thứ ${j + 1} chưa hợp lý.${roleHint} ` +
      `Đọc cả dòng thành lời xem có nghĩa không, rồi thử đổi chỗ.`;
  }
  function reveal(): void {
    revealed = true;
  }
</script>

<div class="q">{@html step.q}</div>
<div class="bline">
  {#each slotIndexes as i (i)}
    <div class="slotw">
      <span class={'slot' + (got[i] !== undefined ? ' f' : '')}>
        {got[i] !== undefined ? toks[got[i] ?? -1] : ' '}
      </span>
      <small>{data.roles && data.guided ? data.roles[i] : ''}</small>
    </div>
  {/each}
</div>
<div class="opts">
  {#each toks as t, i (i)}
    {#if !used.has(i)}
      <button
        class="tk"
        onclick={() => {
          if (got.length < ans.length) {
            got = [...got, i];
            msg = null;
          }
        }}>{t}</button>
    {/if}
  {/each}
</div>
<p>
  <button class="ghost" onclick={undo}>Xóa mảnh cuối</button>
  <button class="ghost" onclick={reset}>Làm lại</button>
  <button class="go" disabled={!full} onclick={check}>Kiểm tra</button>
</p>
{#if msg}<div class="fb">{@html msg}</div>{/if}
{#if bad >= 3 && !revealed}
  <p><button class="ghost" onclick={reveal}>Xem đáp án</button></p>
{/if}
{#if revealed}
  <div class="fb ok">
    Đáp án: <code>{data.show}</code>. Hãy tự ghép lại một lần nữa cho nhớ.
    {#if data.say}<br /><i>Đọc to lên: "{data.say}".</i>{/if}
  </div>
  <p><button class="go" onclick={() => { onAnswer(true); }}>Tôi đã ghép lại được</button></p>
{/if}
