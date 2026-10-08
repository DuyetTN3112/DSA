// LessonFlow: chạy từng bước của một bài học (port từ draw/check/pass trong app.js).
// Component UI render dựa trên state; flow chỉ giữ logic.
import { SvelteSet } from 'svelte/reactivity';
import type {
  ChoiceStep,
  ClickStep,
  InputStep,
  Lesson,
  LessonStep,
  ProgressState,
  ProgressStorage,
} from '../domain/types';
import {
  at,
  isRealExplanation,
  normalizeProgress,
  type DomainPorts,
} from './ports';

export type LessonPhase = 'step' | 'steps-complete';

export interface LessonFlowOptions {
  storage: ProgressStorage;
  ports: DomainPorts;
  lessonId: string;
  /** Gọi khi học xong bước cuối (coordinator quyết định: drill hay probe tiếp). */
  onStepsComplete?: (lessonId: string) => void;
}

/**
 * State machine cho một lượt học bài.
 * - answerNumeric/answerChoice/answerBox: trả lời các step trắc nghiệm/nhập số/bấm hộp
 * - submitReflect: step tự viết (validate độ "thật" của câu trả lời)
 * - completeStep: các step tương tác phức tạp (order/build/tests/code) do component báo xong
 * - revealAnswer + passAfterReveal: xem đáp án sau 3 lần sai
 */
export class LessonFlow {
  readonly lessonId: string;
  private storage: ProgressStorage;
  private ports: DomainPorts;
  private onStepsComplete: (lessonId: string) => void;

  progress = $state<ProgressState>({} as ProgressState);
  stepIndex = $state(0);
  tries = $state(0);
  feedback = $state<string | null>(null);
  feedbackOk = $state(false);
  canReveal = $state(false);
  revealArmed = $state(false);
  openedBoxes = $state<SvelteSet<number>>(new SvelteSet());
  log = $state<string[]>([]);
  drillDone = $state(false);

  phase = $derived<LessonPhase>(
    this.stepIndex >= this.lesson.steps.length ? 'steps-complete' : 'step',
  );
  get lesson(): Lesson {
    return this.ports.lessons[this.lessonId] as Lesson;
  }
  get currentStep(): LessonStep | null {
    return at(this.lesson.steps, this.stepIndex) ?? null;
  }
  /** Bài có drill rút gọn và chưa drill trong lượt này. */
  needsDrill = $derived<boolean>(
    this.phase === 'steps-complete' &&
      this.lesson.dr !== undefined &&
      !this.drillDone,
  );

  constructor(opts: LessonFlowOptions) {
    this.lessonId = opts.lessonId;
    this.storage = opts.storage;
    this.ports = opts.ports;
    this.onStepsComplete = opts.onStepsComplete ?? (() => undefined);
    this.progress = normalizeProgress(this.storage.load());
    this.restart();
  }

  private save(): void {
    this.storage.save(this.progress);
  }

  /** Bắt đầu/học lại bài từ đầu (port từ start()). */
  restart(): void {
    this.stepIndex = 0;
    this.tries = 0;
    this.feedback = null;
    this.feedbackOk = false;
    this.canReveal = false;
    this.revealArmed = false;
    this.openedBoxes = new SvelteSet();
    this.log = [];
    this.drillDone = false;
  }

  /** Trả lời step dạng nhập số. */
  answerNumeric(value: number): void {
    const st = this.currentStep;
    if (!st || st.k !== 'input') return;
    this.check(st, value);
  }

  /** Trả lời step dạng chọn đáp án (index trong mảng gốc). */
  answerChoice(index: number): void {
    const st = this.currentStep;
    if (!st || st.k !== 'choice') return;
    this.check(st, index);
  }

  /**
   * Bấm hộp (step click/open). Kind 'click': so đáp án như check thường.
   * Kind 'open': tự khám phá — đúng thì qua, sai thì chỉ ghi nhận đã mở.
   */
  answerBox(index: number): void {
    const st = this.currentStep;
    if (!st) return;
    if (st.k === 'click') {
      this.check(st, index);
      return;
    }
    if (st.k === 'open') {
      const next = new SvelteSet(this.openedBoxes);
      next.add(index);
      this.openedBoxes = next;
      if (index === st.a) this.pass();
    }
  }

  /** Báo đã mở đủ hộp ở step 'tap' (component theo dõi openedBoxes). */
  notifyTapOpened(index: number): void {
    const st = this.currentStep;
    if (!st || st.k !== 'tap') return;
    const next = new SvelteSet(this.openedBoxes);
    next.add(index);
    this.openedBoxes = next;
    const total = this.lesson.arr?.length ?? 0;
    if (total > 0 && next.size >= total) this.pass();
  }

  /** Step 'reflect': viết tự giải thích, phải đạt chuẩn isRealExplanation. */
  submitReflect(text: string): boolean {
    const st = this.currentStep;
    if (!st || st.k !== 'reflect') return false;
    if (!isRealExplanation(text)) {
      this.feedback =
        'Hãy viết bằng lời của bạn: ít nhất vài từ khác nhau, không lặp ký tự.';
      this.feedbackOk = false;
      return false;
    }
    this.pass();
    return true;
  }

  /** Các step tương tác phức tạp (order/build/tests/code): component báo đã xong. */
  completeStep(): void {
    const st = this.currentStep;
    if (!st) return;
    if (
      st.k === 'order' ||
      st.k === 'build' ||
      st.k === 'tests' ||
      st.k === 'code'
    ) {
      this.pass();
    }
  }

  /** Lùi lại một bước. */
  prevStep(): void {
    if (this.stepIndex > 0) {
      this.stepIndex -= 1;
      this.tries = 0;
      this.feedback = null;
      this.feedbackOk = false;
      this.canReveal = false;
      this.revealArmed = false;
    }
  }

  /** Xem đáp án sau 3 lần sai (chỉ khi canReveal). */
  revealAnswer(): void {
    const st = this.currentStep;
    if (!st || !this.canReveal || this.revealArmed) return;
    this.revealArmed = true;
    this.feedback = `Đáp án: ${st.s} Hãy tự giải thích lại vì sao trước khi đi tiếp.`;
    this.feedbackOk = true;
  }

  /** Sau khi xem đáp án và tự giải thích, đi tiếp (peek=true: không tính là tự làm). */
  passAfterReveal(): void {
    if (!this.revealArmed) return;
    this.revealArmed = false;
    this.pass();
  }

  /** Đánh dấu đã drill xong trong lượt này. */
  markDrillDone(): void {
    this.drillDone = true;
  }

  private check(st: ChoiceStep | ClickStep | InputStep, value: number): void {
    if (value === st.a) {
      this.pass();
      return;
    }
    this.tries += 1;
    let msg = `Chưa đúng, không sao, sai là cách não học. Gợi ý: ${st.h}`;
    if (this.tries >= 3) {
      this.canReveal = true;
      msg += ' (đã sai 3 lần — có thể xem đáp án)';
    }
    this.feedback = msg;
    this.feedbackOk = false;
  }

  private pass(): void {
    const st = this.currentStep;
    if (!st) return;
    this.log = [...this.log, st.s || 'Đã làm'];
    this.stepIndex += 1;
    this.tries = 0;
    this.feedback = null;
    this.feedbackOk = false;
    this.canReveal = false;
    this.revealArmed = false;
    this.openedBoxes = new SvelteSet();
    if (this.stepIndex >= this.lesson.steps.length) {
      this.save();
      this.onStepsComplete(this.lessonId);
    }
  }
}
