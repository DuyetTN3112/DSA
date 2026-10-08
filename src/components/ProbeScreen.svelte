<script lang="ts">
  import type { Lesson, StuckKind } from '../domain/types';
  import type { ProbeFlow } from '../flows/probe-flow.svelte';
  import { HAB_LABELS, SHAPE_LABELS } from '../flows/labels';
  import NotebookView from './NotebookView.svelte';
  import StuckPicker from './StuckPicker.svelte';
  import TinyCheckScreen from './TinyCheckScreen.svelte';

  // Render toàn bộ phase machine của ProbeFlow:
  // confidence -> question -> why -> feedback -> stuck-pick ->
  // reference (sổ tay) -> tiny -> solo-intro -> finished.
  // Mọi logic (chấm điểm, evidence, solo, regress) nằm trong flow.
  interface Props {
    flow: ProbeFlow;
    lessons: Record<string, Lesson>;
    titles: Record<string, string>;
    /** Tiêu đề màn hình; mặc định "Kiểm tra hiểu thật: <tên bài>". */
    title?: string;
  }
  const { flow, lessons, titles, title }: Props = $props();

  let inputVal = $state('');
  let lastQ = $state<string | null>(null);
  $effect(() => {
    const key = flow.current?.q ?? null;
    if (key !== lastQ) {
      lastQ = key;
      inputVal = '';
    }
  });

  const heading = $derived(title ?? `Kiểm tra hiểu thật: ${flow.lessonTitle}`);
  const shapeLabel = $derived.by(() => {
    const shape = flow.shapeNow;
    const tag = flow.extra
      ? 'Câu thêm để chắc chắn'
      : `Câu ${flow.index + 1}/${flow.list.length}`;
    return shape ? `${tag} · ${SHAPE_LABELS[shape]}` : tag;
  });
  const q = $derived(flow.current);
  const options = $derived.by(() => {
    const qq = q;
    if (!qq?.o) return null;
    return flow.optionOrder.map((oi) => ({
      text: qq.o?.[oi] ?? '',
      display: oi,
    }));
  });
  const whyQ = $derived(flow.whyQuestion);
  const whyOptions = $derived.by(() => {
    const wq = whyQ;
    if (!wq) return null;
    return flow.optionOrder.map((oi) => ({
      text: wq.o[oi] ?? '',
      display: oi,
    }));
  });
  const refLessonId = $derived(
    flow.stuckRecovery?.notebook?.view?.lessonId ?? null,
  );
  const refLesson = $derived(
    refLessonId ? (lessons[refLessonId] ?? null) : null,
  );
  const tinyFlow = $derived(
    flow.stuckRecovery?.notebook?.tiny ?? null,
  );

  function submitInput(): void {
    if (inputVal.trim() === '') return;
    flow.answerNumeric(Number(inputVal));
  }

  function handleStuckPick(kind: StuckKind | null): void {
    if (kind === null) flow.backFromStuckPick();
    else flow.pickStuckKind(kind);
  }
</script>

{#if flow.phase === 'confidence'}
  <h2>{heading}</h2>
  <p class="sub">
    {shapeLabel}. Làm đúng bài vừa học chưa chắc là hiểu, nên mình đổi số, đổi
    chiều, đổi bối cảnh.
  </p>
  <p class="sub">Trước khi trả lời: bạn chắc đến mức nào?</p>
  <div class="opts">
    <button onclick={() => { flow.pickConfidence(3); }}>Chắc chắn</button>
    <button onclick={() => { flow.pickConfidence(2); }}>Hơi chắc</button>
    <button onclick={() => { flow.pickConfidence(1); }}>Đoán</button>
    <button class="ghost" onclick={() => { flow.pickConfidence(0); }}>
      Chưa hiểu / chưa nhớ
    </button>
  </div>
  <p class="sub">
    Không hiểu thì đừng điền bừa. Bấm «Chưa hiểu / chưa nhớ»: nói thật không bị
    tính là sai.
  </p>
  {#if flow.canUseNotebook}
    <p>
      <button class="ghost" onclick={() => { flow.openNotebookVoluntary(); }}>
        📖 Giở sổ tay xem lại lý thuyết
      </button>
    </p>
  {/if}
{:else if flow.phase === 'question' && q}
  <h2>{heading}</h2>
  <p class="sub">{shapeLabel}.</p>
  <div class="q">{@html q.q}</div>
  {#if options}
    <div class="opts">
      {#each options as opt (opt.display)}
        <button onclick={() => { flow.answerChoice(opt.display); }}>
          {@html opt.text}
        </button>
      {/each}
    </div>
  {:else}
    <input
      type="number"
      aria-label="Câu trả lời"
      bind:value={inputVal}
      onkeydown={(e) => {
        if (e.key === 'Enter') submitInput();
      }}
    />
    <button class="go" onclick={submitInput}>Kiểm tra</button>
  {/if}
{:else if flow.phase === 'why' && whyQ && whyOptions}
  <h2>{heading}</h2>
  <p class="sub">Khoan — nói được «vì sao» mới tính là hiểu:</p>
  <div class="q">{@html whyQ.q}</div>
  <div class="opts">
    {#each whyOptions as opt (opt.display)}
      <button onclick={() => { flow.answerWhy(opt.display); }}>
        {@html opt.text}
      </button>
    {/each}
  </div>
{:else if flow.phase === 'feedback'}
  <h2>{heading}</h2>
  <div class={'fb' + (flow.feedbackOk ? ' ok' : '')}>{flow.feedbackText}</div>
  <p><button class="go" onclick={() => { flow.continueFromFeedback(); }}>Tiếp</button></p>
{:else if flow.phase === 'stuck-pick'}
  <h2>{flow.lessonTitle}</h2>
  <StuckPicker onPick={handleStuckPick} />
{:else if flow.phase === 'reference' && refLesson}
  {@const nb = flow.stuckRecovery?.notebook}
  {#if nb}
    <NotebookView
      lesson={refLesson}
      {titles}
      backLabel="Đã đọc, kiểm tra nhanh"
      onBack={() => { nb.pressBack(); }}
      onNavigate={(id: string) => { nb.openLinked(id); }}
    />
  {/if}
{:else if flow.phase === 'tiny' && tinyFlow}
  <TinyCheckScreen flow={tinyFlow} />
{:else if flow.phase === 'solo-intro'}
  <h2>{heading}: vòng solo</h2>
  <div class="fb">
    Bạn đã giở sổ tay nên câu vừa rồi chưa tính là tự làm được. Giờ làm lại
    {flow.soloShapes.length} câu <b>mới hoàn toàn, không được giở sổ tay</b> —
    qua hết mới tính là hiểu thật.
  </div>
  <p><button class="go" onclick={() => { flow.startSoloQuestions(); }}>Bắt đầu vòng solo</button></p>
{:else if flow.phase === 'finished'}
  {#if flow.outcome === 'passed'}
    <h2>{flow.lessonTitle}</h2>
    <div class="fb ok">
      <b>Qua kiểm tra hiểu thật.</b> Bạn làm đúng cả khi đổi số, đổi chiều, đổi
      bối cảnh và tự phán đúng/sai. Đó là hiểu, không phải nhớ máy móc.
      {#if flow.weakPass}
        <br />Chú thích: lần này có câu qua nhờ giở sổ tay / vòng solo — hãy
        chắc là bạn tự làm lại được khi không có sách.
      {/if}
    </div>
    <p><button class="go" onclick={() => { flow.continueAfterPass(); }}>Tiếp tục</button></p>
  {:else}
    <h2>{flow.lessonTitle}</h2>
    <div class="fb">
      <b>Chưa qua.</b> Không sao — trượt bây giờ rẻ hơn trượt lúc cần dùng.
      {#if flow.failHabits.length > 0}
        Thói quen cần sửa: {flow.failHabits
          .map((h) => HAB_LABELS[h] ?? h)
          .join('; ')}.
      {/if}
    </div>
    <p><button class="go" onclick={() => { flow.restartLesson(); }}>Học lại từ đầu</button></p>
  {/if}
{/if}
