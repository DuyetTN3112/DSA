<script lang="ts">
  import type { Lesson } from '../domain/types';
  import type { ReviewFlow } from '../flows/review-flow.svelte';
  import type { ProfileStats } from '../flows/profile-stats';
  import ProbeScreen from './ProbeScreen.svelte';
  import RecoveryPane from './RecoveryPane.svelte';
  import ReviewView from './ReviewView.svelte';

  // Màn ôn tập + hồ sơ học, gắn với ReviewFlow.
  // - idle: hồ sơ (ReviewView) + nút hành động
  // - spaced-*: buổi ôn cách quãng (dùng lại ProbeScreen)
  // - diagnose: hỏi "vì sao trượt" trước khi cho học lại
  // - recovery: sổ tay -> tiny -> câu mới (từ màn summary)
  interface Props {
    flow: ReviewFlow;
    lessons: Record<string, Lesson>;
    titles: Record<string, string>;
    onHealthCheck: () => void;
  }
  const { flow, lessons, titles, onHealthCheck }: Props = $props();

  let diagText = $state('');
  let diagError = $state(false);

  // Không annotate return type ReviewStats ở đây: type import từ file .svelte
  // làm eslint type-aware mất type-info (svelte-check vẫn kiểm tra ở prop).
  function toReviewStats(s: ProfileStats) {
    const nextStep =
      s.nextAction.kind === 'reprove'
        ? `Có bài cần chứng minh lại: ${s.nextAction.titles.join('; ')}.`
        : s.nextAction.kind === 'review-due'
          ? `Có ${s.nextAction.count} bài đến hạn ôn.`
          : s.nextAction.kind === 'healthcheck-due'
            ? 'Đã lâu chưa kiểm tra nền tảng.'
            : s.nextAction.kind === 'unstable'
              ? `Có ${s.nextAction.count} bài mới qua 1 ngày, chưa vững.`
              : 'Học bài tiếp theo trên lộ trình.';
    return {
      totalLessons: s.totalProbeLessons,
      doneCount: s.doneCount,
      stableCount: s.stableCount,
      unstableCount: s.unstableCount,
      shakyTitles: s.shakyTitles,
      weakLessons: s.weakList,
      missShapes: s.missShapes.map((x) => ({ label: x.label, count: x.count })),
      habits: s.habits.map((x) => ({ label: x.label, count: x.count })),
      notebookLessons: s.notebookHeavy,
      assistedCount: s.assistedTotal,
      luckyCount: s.luckyTotal,
      stuckKinds: s.stuckBreakdown.map((x) => ({
        label: x.label,
        count: x.count,
      })),
      leitnerBoxes: s.boxes,
      dueToday: s.dueCount,
      healthCheckLast: s.lastHealthCheck,
      nextStep,
    };
  }

  const stats = $derived.by(() => toReviewStats(flow.getProfileStats()));
  const diag = $derived(flow.diagnoseInfo);
  const recovery = $derived(flow.recovery);
</script>

{#if flow.phase === 'idle'}
  <p>
    <button class="go" onclick={() => { flow.startSpacedReview(); }}>
      Ôn cách quãng ({flow.dueCount} đến hạn)
    </button>
    <button class="ghost" onclick={onHealthCheck}>Kiểm tra nền tảng</button>
    <button class="ghost" onclick={() => { flow.exit(); }}>Về lộ trình</button>
  </p>
  {#if diag}
    <h2>Khoan đã — vì sao trượt?</h2>
    <p class="sub">
      Bài <b>{diag.title}</b> đã trượt {diag.weakCount} lần. Viết bằng lời của
      bạn: lần trước bạn sai ở chỗ nào, lần này sẽ làm khác điều gì?
    </p>
    {#if diag.missBreakdown.length > 0}
      <p class="sub">
        Dạng hay sai: {diag.missBreakdown
          .map((b) => `${b.label} (${b.count})`)
          .join('; ')}.
      </p>
    {/if}
    <p class="sub"><i>Gợi ý: {diag.tip}</i></p>
    <textarea
      aria-label="Giải thích vì sao trượt"
      bind:value={diagText}
      placeholder="Viết vài câu thật lòng..."
    ></textarea>
    <p>
      <button
        class="go"
        onclick={() => {
          if (!flow.submitDiagnoseExplanation(diagText)) {
            diagError = true;
          } else {
            diagError = false;
            diagText = '';
          }
        }}
      >
        Tôi đã hiểu vì sao — học lại
      </button>
      {#if diag.canRootcheck}
        <button class="ghost" onclick={() => { flow.diagnoseRootcheck(); diagText = ''; diagError = false; }}>
          Kiểm tra nền trước
        </button>
      {/if}
    </p>
    {#if diagError}
      <div class="fb">Hãy viết cụ thể hơn: ít nhất vài từ khác nhau, không lặp ký tự.</div>
    {/if}
  {:else}
    <ReviewView {stats} />
  {/if}
{:else if flow.phase === 'spaced-intro'}
  <h2>Ôn cách quãng</h2>
  <p class="sub">
    {flow.queue.length} bài đến hạn. Mỗi bài một câu hỏi mới — đúng thì hộp
    lên, sai thì hộp rớt về 1 và ôn sớm.
  </p>
  <p><button class="go" onclick={() => { flow.beginSpacedItems(); }}>Bắt đầu</button></p>
{:else if flow.phase === 'spaced-asking' && flow.activeProbe}
  <ProbeScreen
    flow={flow.activeProbe}
    {lessons}
    {titles}
    title="Ôn cách quãng"
  />
{:else if flow.phase === 'spaced-summary'}
  <h2>Xong buổi ôn</h2>
  <ul class="log">
    {#each flow.results as r (r.id)}
      <li>
        {titles[r.id] ?? r.id}: {r.res === 'up'
          ? `lên hộp ${r.box}`
          : r.res === 'down'
            ? `rớt về hộp ${r.box}`
            : r.res === 'lucky'
              ? 'đoán đúng (không tính)'
              : r.res === 'unknown'
                ? 'chưa nhớ'
                : 'đã rút'}
      </li>
    {/each}
  </ul>
  {#if recovery}
    <RecoveryPane {recovery} {lessons} {titles} />
  {:else}
    {#if flow.summaryUnknowns.length > 0}
      <p class="sub">Chưa nhớ:</p>
      <div class="opts">
        {#each flow.summaryUnknowns as r (r.id)}
          <button class="ghost" onclick={() => { flow.startRecovery(r.id); }}>
            📖 {titles[r.id] ?? r.id}
          </button>
        {/each}
      </div>
    {/if}
    {#if flow.summaryShakies.length > 0}
      <p class="sub">Cần chứng minh lại:</p>
      <div class="opts">
        {#each flow.summaryShakies as r (r.id)}
          <button class="ghost" onclick={() => { flow.reprove(r.id); }}>
            Chứng minh lại: {titles[r.id] ?? r.id}
          </button>
        {/each}
      </div>
    {/if}
    {#if flow.summaryRegress.length > 0}
      <p class="sub">Sai liên tiếp — kiểm tra nền:</p>
      <div class="opts">
        {#each flow.summaryRegress as r (r.id)}
          <button class="ghost" onclick={() => { flow.rootcheckFor(r.id); }}>
            Kiểm tra nền: {titles[r.id] ?? r.id}
          </button>
        {/each}
      </div>
    {/if}
    <p><button class="go" onclick={() => { flow.exit(); }}>Xong</button></p>
  {/if}
{:else if flow.phase === 'spaced-empty'}
  <h2>Ôn cách quãng</h2>
  <p class="sub">Chưa có bài nào đủ điều kiện ôn. Học xong vài bài rồi quay lại.</p>
  <p><button class="go" onclick={() => { flow.exit(); }}>Về</button></p>
{:else if flow.phase === 'spaced-nothing-due'}
  <h2>Ôn cách quãng</h2>
  <p class="sub">Hôm nay không có bài nào đến hạn. Não cần khoảng nghỉ để nhớ lâu.</p>
  <p><button class="go" onclick={() => { flow.exit(); }}>Về</button></p>
{/if}
