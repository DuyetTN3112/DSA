// ProbeFlow: "kiểm tra hiểu thật" (port từ probe() trong probe.js).
// Implement đầy đủ spec tools/sim-recovery.js:
// - 5 dạng câu (shapes), cược độ chắc chắn, "Chưa hiểu" -> phân loại 6 loại
// - reference -> tiny-check -> quay lại ĐÚNG câu cũ; tiny sai -> regress
// - "đoán đúng" -> lucky (không tính); vòng solo (câu mới, cấm sổ tay)
// - evidence: asst/lucky/days/Leitner box theo đúng spec.
// Phân xử/evidence tách ở probe-evidence.ts + probe-rules.ts;
// sub-flow "Chưa hiểu" tách ở probe-stuck.svelte.ts; types ở probe-types.ts.
import type {
  ProbeBank,
  ProbeQuestion,
  ProbeShape,
  ProgressState,
  ProgressStorage,
  StuckKind,
} from '../domain/types';
import {
  at,
  ensureLessonProgress,
  noop,
  normalizeProgress,
  systemDates,
  type DateProvider,
  type DomainPorts,
} from './ports';
import { nearestPythonLesson, shuffledOptionOrder } from './graph';
import { adjudicateAnswer, decideProbeEnd } from './probe-rules';
import { applyProbeEndDecision } from './probe-evidence';
import { StuckRecovery, createRecovery, type RecoveryHost } from './probe-stuck.svelte';
import {
  DEFAULT_SHAPES,
  type ProbeFlowCallbacks,
  type ProbeFlowOptions,
  type ProbePhase,
  type ProbeQuestionWithWhy,
} from './probe-types';

export class ProbeFlow {
  readonly lessonId: string;
  readonly shapes: readonly ProbeShape[];
  private readonly run: ProbeFlowOptions['run'];
  private readonly cb: ProbeFlowCallbacks;
  private storage: ProgressStorage;
  private ports: DomainPorts;
  private dates: DateProvider;

  progress = $state<ProgressState>({} as ProgressState);
  phase = $state<ProbePhase>('confidence');
  list = $state<ProbeShape[]>([]);
  index = $state(0);
  res = $state<Record<string, boolean>>({});
  flags = $state<Record<string, string>>({});
  assisted = $state<Record<string, boolean>>({});
  confidence = $state<0 | 1 | 2 | 3>(0);
  current = $state<ProbeQuestion | null>(null);
  optionOrder = $state<number[]>([]);
  questionStartedAt = $state(0);
  extra = $state(false);
  solo = $state(false);
  viaAssist = $state(false);
  feedbackText = $state('');
  feedbackOk = $state(false);
  outcome = $state<'passed' | 'failed' | null>(null);
  /** Qua nhưng evidence yếu (nhờ sổ tay/solo) — component hiện chú thích. */
  weakPass = $state(false);
  failHabits = $state<string[]>([]);
  soloShapes = $state<ProbeShape[]>([]);
  /** Sub-flow "Chưa hiểu" đang chạy (sổ tay + tiny). null khi không có. */
  stuckRecovery = $state<StuckRecovery | null>(null);
  private whyQ: { q: string; o: string[]; a: number } | null = null;

  /** Vòng solo retest / chế độ ôn: cấm giở sổ tay giữa câu hỏi. */
  get canUseNotebook(): boolean { return this.run === undefined && !this.solo; }
  /** Câu hỏi phụ "Vì sao?" ở phase 'why' (null khi không ở phase đó). */
  get whyQuestion(): { q: string; o: string[]; a: number } | null {
    return this.phase === 'why' ? this.whyQ : null;
  }
  shapeNow = $derived<ProbeShape | null>(at(this.list, this.index) ?? null);
  get lessonTitle(): string { return this.ports.lessons[this.lessonId]?.t ?? this.lessonId; }

  constructor(opts: ProbeFlowOptions) {
    this.lessonId = opts.lessonId;
    this.run = opts.run;
    this.storage = opts.storage;
    this.ports = opts.ports;
    this.dates = opts.dates ?? systemDates;
    this.cb = {
      onOpenLesson: opts.callbacks?.onOpenLesson ?? noop,
      onOpenRootcheck: opts.callbacks?.onOpenRootcheck ?? noop,
      onContinue: opts.callbacks?.onContinue ?? noop,
    };
    this.shapes = opts.run?.shapes ?? DEFAULT_SHAPES;
    this.progress = normalizeProgress(this.storage.load());
    this.list = [...this.shapes];
    this.startNextQuestion();
  }

  private save(): void {
    this.storage.save(this.progress);
  }

  /** Câu tiếp theo (hoặc end() khi hết list). */
  startNextQuestion(): void {
    if (this.index >= this.list.length) {
      this.end();
      return;
    }
    const shape = at(this.list, this.index);
    const bank: ProbeBank | undefined = this.ports.probeBanks[this.lessonId];
    const gen = shape && bank ? bank[shape] : undefined;
    if (!shape || !gen) {
      this.index += 1;
      this.startNextQuestion();
      return;
    }
    this.current = gen();
    this.optionOrder = shuffledOptionOrder(this.current.o?.length ?? 0);
    this.confidence = 0;
    this.questionStartedAt = Date.now();
    this.phase = 'confidence';
  }

  /** Chọn độ chắc chắn trước mỗi câu (0 = "Chưa hiểu"). */
  pickConfidence(c: 0 | 1 | 2 | 3): void {
    if (this.phase !== 'confidence') return;
    const shape = this.shapeNow;
    if (!shape) return;
    if (c === 0) {
      if (!this.canUseNotebook) {
        // Vòng solo / chế độ ôn: "chưa hiểu" = trượt câu này, không câu cứu.
        this.flags[shape] = 'unknown';
        this.res[shape] = false;
        const r = ensureLessonProgress(this.progress, this.lessonId);
        r.unk = (r.unk ?? 0) + 1;
        this.save();
        this.index += 1;
        this.startNextQuestion();
        return;
      }
      this.phase = 'stuck-pick';
      return;
    }
    this.confidence = c;
    this.phase = 'question';
  }

  /** Trả lời câu trắc nghiệm (index theo thứ tự hiển thị). */
  answerChoice(displayIndex: number): void {
    if (this.phase !== 'question') return;
    const q = this.current;
    const shape = this.shapeNow;
    if (!q || !q.o || !shape) return;
    const original = at(this.optionOrder, displayIndex);
    if (original === undefined) return;
    let c = original;
    const correctText = at(q.o, q.a);
    if (correctText !== undefined && q.o[c] === correctText) c = q.a;
    if (c !== q.a) {
      this.submitAnswer(false, q.w);
      return;
    }
    const why = (q as ProbeQuestionWithWhy).why ?? null;
    if (!why) {
      this.submitAnswer(true, q.w);
      return;
    }
    this.whyQ = why;
    this.optionOrder = shuffledOptionOrder(why.o.length);
    this.phase = 'why';
  }

  /** Trả lời câu hỏi phụ "Vì sao?" của dạng verdict. */
  answerWhy(displayIndex: number): void {
    if (this.phase !== 'why') return;
    const q = this.current;
    const why = this.whyQ;
    if (!q || !why) return;
    const original = at(this.optionOrder, displayIndex);
    if (original === undefined) return;
    const correctWhy = at(why.o, why.a) ?? '';
    this.submitAnswer(original === why.a, `${q.w} ${correctWhy}.`);
  }

  /** Trả lời câu nhập số. */
  answerNumeric(value: number): void {
    if (this.phase !== 'question') return;
    const q = this.current;
    if (!q || q.o) return;
    this.submitAnswer(value === q.a, q.w);
  }

  private submitAnswer(ok0: boolean, message: string): void {
    const shape = this.shapeNow;
    if (!shape) return;
    const verdict = adjudicateAnswer({
      shape,
      ok0,
      confidence: this.confidence,
      assisted: this.assisted[shape] ?? false,
      elapsedMs: Date.now() - this.questionStartedAt,
    });
    if (verdict.lucky) {
      const r = ensureLessonProgress(this.progress, this.lessonId);
      r.lucky = (r.lucky ?? 0) + 1;
    }
    this.flags[shape] = verdict.flag;
    this.res[shape] = verdict.ok;
    this.feedbackText = `${ok0 ? 'Đúng. ' : 'Chưa đúng. '}${message}${verdict.tag}`;
    this.feedbackOk = verdict.ok;
    this.phase = 'feedback';
    this.save();
  }

  /** Bấm "Tiếp" sau feedback. */
  continueFromFeedback(): void {
    if (this.phase !== 'feedback') return;
    this.index += 1;
    this.startNextQuestion();
  }

  /** Gom các dependency dùng chung khi dựng StuckRecovery. */
  private recoveryHost(): RecoveryHost {
    return {
      storage: this.storage,
      ports: this.ports,
      progress: this.progress,
      save: () => {
        this.save();
      },
      assisted: this.assisted,
      lessonId: this.lessonId,
      onOpenLesson: (id) => {
        this.cb.onOpenLesson(id);
      },
      onOpenRootcheck: (id) => {
        this.cb.onOpenRootcheck(id);
      },
    };
  }

  /** Chọn loại vướng mắc ở màn "Chưa hiểu" (port failKind()). */
  pickStuckKind(kind: StuckKind): void {
    if (this.phase !== 'stuck-pick') return;
    if (kind === 'unsure') {
      // Chỉ không chắc đáp án -> câu hỏi mới (chống học thuộc lòng).
      this.startNextQuestion();
      return;
    }
    const shape = this.shapeNow;
    if (!shape) return;
    const refId =
      kind === 'de'
        ? 'rd1'
        : kind === 'python'
          ? nearestPythonLesson(this.ports, this.lessonId)
          : this.lessonId;
    this.stuckRecovery = createRecovery(
      this.recoveryHost(),
      shape,
      kind,
      refId,
      () => {
        this.resumeAfterTiny();
      },
      (stage) => {
        this.phase = stage;
      },
    );
  }

  /** Bấm "Quay lại" ở màn phân loại -> câu hỏi mới. */
  backFromStuckPick(): void {
    if (this.phase !== 'stuck-pick') return;
    this.startNextQuestion();
  }

  /**
   * Bấm "Giở sổ tay" khi đang ở màn cược độ chắc chắn (tự nguyện, port từ
   * lookup() trong probe.js): đánh dấu assisted, mở sổ tay bài này, tiny-check
   * xong thì hỏi lại ĐÚNG câu cũ. Khác đường "Chưa hiểu" ở chỗ không phân loại
   * vướng mắc (kind=null: không ghi fk).
   */
  openNotebookVoluntary(): void {
    if (this.phase !== 'confidence' || !this.canUseNotebook) return;
    const shape = this.shapeNow;
    if (!shape) return;
    this.stuckRecovery = createRecovery(
      this.recoveryHost(),
      shape,
      null,
      this.lessonId,
      () => {
        this.resumeAfterTiny();
      },
      (stage) => {
        this.phase = stage;
      },
    );
  }

  /** Tiny-check xong -> quay lại ĐÚNG câu cũ, cược lại độ chắc chắn. */
  private resumeAfterTiny(): void {
    this.stuckRecovery = null;
    this.optionOrder = shuffledOptionOrder(this.current?.o?.length ?? 0);
    this.questionStartedAt = Date.now();
    this.phase = 'confidence';
  }

  /** Bắt đầu vòng solo (component gọi sau khi user bấm "Làm lại"). */
  startSoloQuestions(): void {
    if (this.phase !== 'solo-intro') return;
    this.startNextQuestion();
  }

  /** Bấm "Tiếp tục" ở màn qua. */
  continueAfterPass(): void {
    if (this.phase !== 'finished' || this.outcome !== 'passed') return;
    this.cb.onContinue(this.lessonId, this.run?.fromHub ?? false);
  }

  /** Bấm "Học lại từ đầu" ở màn trượt. */
  restartLesson(): void {
    if (this.phase !== 'finished' || this.outcome !== 'failed') return;
    this.cb.onOpenLesson(this.lessonId);
  }

  private end(): void {
    const decision = decideProbeEnd({
      shapes: this.shapes,
      res: this.res,
      flags: this.flags,
      extra: this.extra,
      solo: this.solo,
      viaAssist: this.viaAssist,
      isOptMode: this.run !== undefined,
    });
    const effect = applyProbeEndDecision({
      ports: this.ports,
      state: this.progress,
      dates: this.dates,
      lessonId: this.lessonId,
      decision,
      m: this,
      onEnd: this.run?.onEnd,
      noRec: this.run?.noRec,
    });
    if (effect.kind === 'ask-next') {
      this.startNextQuestion();
      return;
    }
    if (effect.save) this.save();
    if (effect.rootcheck) this.cb.onOpenRootcheck(effect.rootcheck);
  }
}
