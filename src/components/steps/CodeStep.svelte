<script lang="ts">
  import type { CodeStep as CodeStepData, Lesson, TestsStep } from '../../domain/types';
  import { runPython } from '../../services/python-runner';
  import {
    buildEmptyRun,
    buildGuardProbe,
    buildHiddenTests,
    buildRefRun,
    errChk,
    guardStart,
    mergeCore,
    parseGuardHits,
    validateTests,
    type CodeLabData,
  } from '../../services/code-lab';
  import { getDraft, setDraftCode, setDraftTests } from '../../services/code-workspace';

  // Step "tests"/"code": viết test trước (TDD) rồi viết code, chạy Python thật.
  interface Props {
    step: CodeStepData | TestsStep;
    lesson: Lesson;
    onAnswer: (correct: boolean) => void;
  }
  const { step, lesson, onAnswer }: Props = $props();

  // Component remount mỗi step (nhờ {#key stepIndex} ở LessonRunner)
  // nên đọc lesson một lần ở đây là đúng.
  function labData(): CodeLabData {
    return {
      fn: lesson.fn ?? '',
      ref: lesson.ref ?? '',
      hid: lesson.hid ?? [],
      errs: lesson.errs ?? [],
      cs: lesson.cs ?? '',
      ts: lesson.ts ?? '',
    };
  }
  function isTestsStep(): boolean {
    return step.k === 'tests';
  }
  function codeMode(): string {
    return step.k === 'code' ? (step.mode ?? 'happy') : 'happy';
  }
  function initialText(): string {
    const lab = labData();
    const d = getDraft(lesson.id, lab.ts, lab.cs);
    return isTestsStep() ? d.tests : d.code;
  }

  let text = $state(initialText());
  let output = $state('');
  let running = $state(false);

  function onInput(e: Event): void {
    const el = e.target as HTMLTextAreaElement;
    text = el.value;
    if (isTestsStep()) setDraftTests(lesson.id, text);
    else setDraftCode(lesson.id, text);
  }

  function onKeydown(e: KeyboardEvent): void {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = e.target as HTMLTextAreaElement;
    const a = el.selectionStart;
    el.setRangeText('    ', a, el.selectionEnd, 'end');
    text = el.value;
    if (isTestsStep()) setDraftTests(lesson.id, text);
    else setDraftCode(lesson.id, text);
  }

  function done(msg: string): void {
    output = msg;
    globalThis.setTimeout(() => {
      onAnswer(true);
    }, 1600);
  }

  async function runTestsFlow(): Promise<void> {
    const lab = labData();
    const err = validateTests(text);
    if (err) {
      output = err;
      return;
    }
    output = 'Đang chạy (lần đầu tải Python mất vài giây)...';
    const refRun = await runPython(buildRefRun(lab.ref, text));
    if (!refRun.ok) {
      output = 'Test của bạn tự sai (chạy với lời giải chuẩn không qua):\n' + refRun.err;
      return;
    }
    const emptyRun = await runPython(buildEmptyRun(lab.fn, text));
    if (emptyRun.ok) {
      output = 'Test quá yếu: hàm rỗng cũng qua. Thêm assert có kỳ vọng cụ thể.';
      return;
    }
    // Sang bước guard: chuẩn bị khung code hàng rào.
    setDraftCode(lesson.id, guardStart(lab.cs));
    done('ĐỎ ✓ Đúng như TDD: hàm rỗng bị test của bạn bắt được. Sang bước hàng rào (exception) trước khi giải đề.');
  }

  async function runGuardFlow(): Promise<void> {
    const lab = labData();
    const probe = await runPython(buildGuardProbe(lab.ref, lab.errs));
    const hits = parseGuardHits(probe.out);
    if (hits.length > 0) {
      const check = await runPython(text + '\n' + errChk(lab.errs, hits));
      if (!check.ok) {
        output = 'Code lỗi:\n' + check.err;
        return;
      }
      const bad = check.out.split('\n').filter(Boolean);
      if (bad.length > 0) {
        output =
          'Hàng rào chưa đủ:\n' + bad.join('\n') + '\n(Đầu vào xấu phải bị chặn bằng raise TRƯỚC khi tính gì.)';
        return;
      }
    }
    // Gộp hàng rào đã viết với thân bài để sang bước giải đề.
    setDraftCode(lesson.id, mergeCore(text, lab.cs));
    done(
      hits.length > 0
        ? `XANH ✓ Hàng rào chặn đủ ${hits.length} ca đầu vào xấu. Chưa giải đề: đúng cách làm ở doanh nghiệp, bảo vệ trước.`
        : 'Bài này không có ca đầu vào xấu nào chặn được trước khi tính. Sang bước giải đề.',
    );
  }

  async function runCodeFlow(): Promise<void> {
    const lab = labData();
    const mode = codeMode();
    if (/___/.test(text)) {
      output = 'Còn chỗ ___ chưa điền. Đọc comment bên trên mỗi dòng để biết cần điền gì.';
      return;
    }
    if (mode === 'guard') {
      await runGuardFlow();
      return;
    }
    output = 'Đang chạy...';
    const draftNow = getDraft(lesson.id, lab.ts, lab.cs);
    const own = await runPython(text + '\n' + draftNow.tests);
    if (!own.ok) {
      output = 'Test CỦA BẠN chưa qua:\n' + own.err + '\n(Đọc dòng lỗi, tìm assert nào fail rồi sửa code.)';
      return;
    }
    const hidden = await runPython(buildHiddenTests(text, lab.hid, lab.errs, mode));
    if (!hidden.ok) {
      output = 'Code lỗi:\n' + hidden.err;
      return;
    }
    const bad = hidden.out.split('\n').filter(Boolean);
    if (bad.length > 0) {
      output = 'CI báo đỏ:\n' + bad.join('\n');
      return;
    }
    done('XANH ✓ Tất cả test qua.');
  }

  async function run(): Promise<void> {
    if (running) return;
    running = true;
    try {
      if (isTestsStep()) await runTestsFlow();
      else await runCodeFlow();
    } finally {
      running = false;
    }
  }
</script>

{#if step.ph}<p class="ph">{step.ph}</p>{/if}
<div class="q">{@html step.q}</div>
{#if lesson.brief}<p class="brief">{@html lesson.brief}</p>{/if}
<textarea
  class="code"
  spellcheck="false"
  value={text}
  oninput={onInput}
  onkeydown={onKeydown}
  rows="12"
></textarea>
<p>
  <button class="go" onclick={run} disabled={running}>
    {running ? 'Đang chạy...' : isTestsStep() ? 'Chạy test (mong đợi: đỏ)' : 'Chạy test'}
  </button>
</p>
{#if output}<pre class="out">{output}</pre>{/if}
<p class="hint">Luật chơi: Python 3.7 — không dùng <code>:=</code>, <code>match</code>, <code>dataclass</code>. Phím Tab thụt 4 dấu cách.</p>

<style>
  .code {
    width: 100%;
    font-family: ui-monospace, monospace;
    font-size: 14px;
    padding: 8px;
    border: 1px solid var(--border, #ccc);
    border-radius: 6px;
  }
  .out {
    white-space: pre-wrap;
    background: var(--code-bg, #f5f5f5);
    padding: 8px;
    border-radius: 6px;
    max-height: 220px;
    overflow: auto;
  }
  .brief {
    margin: 8px 0;
  }
  .hint {
    font-size: 13px;
    opacity: 0.75;
  }
</style>
