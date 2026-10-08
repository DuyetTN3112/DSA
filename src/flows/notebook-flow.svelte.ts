// NotebookFlow: sổ tay bài học + tiny-check (port từ notebook.js).
// - Ưu tiên nbk (mini-textbook có cấu trúc), fallback note (HTML viết tay),
//   cuối cùng là các ý "rút ra" tự gom từ steps.
// - TinyCheckFlow: tối đa 3 câu siêu ngắn sau khi đọc; sai -> regress.
import type {
  Lesson,
  LessonStep,
  NotebookEntry,
  ProgressState,
  ProgressStorage,
  TinyQuestion,
} from '../domain/types';
import { at, normalizeProgress, shuffle, type DomainPorts } from './ports';
import { shuffledOptionOrder } from './graph';

/** Bài code có thêm ref (lời giải chuẩn) — field này domain types chưa có. */
interface LessonWithRef extends Lesson {
  ref?: string;
}

const SKIP_STEP_KINDS: readonly string[] = [
  'order',
  'tests',
  'code',
  'reflect',
  'open',
  'build',
];

/** Dữ liệu view cho component render sổ tay (đã lọc, không chứa logic). */
export interface NotebookView {
  lessonId: string;
  title: string;
  nbk: NotebookEntry | null;
  noteHtml: string | null;
  keyPoints: string[];
  stepReviews: { q: string; s: string }[];
  refCode: string | null;
  unkCount: number;
  /** unk>=2: gợi ý học lại mạnh hơn nút quay lại. */
  suggestRestart: boolean;
  preLinks: { id: string; title: string }[];
  conceptLinks: { id: string; title: string }[];
}

export interface NotebookFlowOptions {
  storage: ProgressStorage;
  ports: DomainPorts;
  /** Bấm nút quay lại (nbb). ProbeFlow thường gắn: bắt đầu tiny-check. */
  onBack?: () => void;
  /** Bấm "Học lại bài từ đầu" (nbr). */
  onRequestRestart?: (lessonId: string) => void;
}

function buildView(
  ports: DomainPorts,
  state: ProgressState,
  lessonId: string,
): NotebookView | null {
  const lesson = ports.lessons[lessonId] as LessonWithRef | undefined;
  if (!lesson) return null;
  const steps: LessonStep[] = lesson.steps;
  const keyPoints: string[] = [];
  for (const st of steps) {
    if (
      st.s &&
      !SKIP_STEP_KINDS.includes(st.k) &&
      !/^(Đã |Ôn lại|Test )/.test(st.s) &&
      st.s.length >= 30 &&
      !keyPoints.includes(st.s)
    ) {
      keyPoints.push(st.s);
    }
  }
  const stepReviews = steps
    .filter(
      (st): st is LessonStep & { s: string } =>
        !!st.q && !!st.s && !SKIP_STEP_KINDS.includes(st.k),
    )
    .map((st) => ({ q: st.q, s: st.s }));
  const linkOf = (id: string): { id: string; title: string } | null => {
    const l = ports.lessons[id];
    return l ? { id, title: l.t } : null;
  };
  const preLinks = (lesson.nbk?.pre ?? [])
    .map(linkOf)
    .filter((x): x is { id: string; title: string } => x !== null);
  const conceptLinks = (lesson.nbk?.links ?? [])
    .map(linkOf)
    .filter((x): x is { id: string; title: string } => x !== null);
  const unkCount = state.pr[lessonId]?.unk ?? 0;
  return {
    lessonId,
    title: lesson.t,
    nbk: lesson.nbk ?? null,
    noteHtml: lesson.note ?? null,
    keyPoints,
    stepReviews,
    refCode: lesson.ref ?? null,
    unkCount,
    suggestRestart: unkCount >= 2,
    preLinks,
    conceptLinks,
  };
}

export class NotebookFlow {
  private storage: ProgressStorage;
  private ports: DomainPorts;
  private onBack: () => void;
  private onRequestRestart: (lessonId: string) => void;
  private history: string[] = [];

  progress = $state<ProgressState>({} as ProgressState);
  view = $state<NotebookView | null>(null);
  backLabel = $state('Quay lại');
  /** Tiny-check đang chạy (null = chưa bắt đầu / đã xong). */
  tiny = $state<TinyCheckFlow | null>(null);

  constructor(opts: NotebookFlowOptions) {
    this.storage = opts.storage;
    this.ports = opts.ports;
    this.onBack = opts.onBack ?? (() => undefined);
    this.onRequestRestart =
      opts.onRequestRestart ?? (() => undefined);
    this.progress = normalizeProgress(this.storage.load());
  }

  /** Mở sổ tay của bài. */
  open(lessonId: string, backLabel?: string): void {
    this.view = buildView(this.ports, this.progress, lessonId);
    if (backLabel !== undefined) this.backLabel = backLabel;
    this.tiny = null;
  }

  /** Mở sổ tay bài liên quan (data-nb2), quay lại được về bài hiện tại. */
  openLinked(lessonId: string): void {
    const cur = this.view?.lessonId;
    if (cur && cur !== lessonId) this.history.push(cur);
    this.open(lessonId, 'Về bài trước');
  }

  /** Quay lại bài trước trong stack, hoặc gọi onBack khi hết stack. */
  goBack(): void {
    const prev = this.history.pop();
    if (prev === undefined) return;
    this.open(prev);
  }

  /** Bấm nút quay lại chính (nbb). */
  pressBack(): void {
    this.onBack();
  }

  /** Bấm "Học lại bài từ đầu" (nbr). */
  requestRestart(): void {
    const id = this.view?.lessonId;
    if (id) this.onRequestRestart(id);
  }

  /**
   * Bắt đầu tiny-check cho bank. Trả về false khi không có bank
   * (caller tự resume, khớp `if (!tk || !TINY[tk]) return done()`).
   */
  startTinyCheck(
    bankName: string | null,
    backId: string,
    opts: {
      onDone: () => void;
      onRequestRestart: (lessonId: string) => void;
      onRequestRootcheck: (lessonId: string) => void;
    },
  ): boolean {
    if (!bankName) return false;
    const gen = this.ports.tinyBanks[bankName];
    if (!gen) return false;
    const tiny = new TinyCheckFlow({
      storage: this.storage,
      ports: this.ports,
      bankName,
      backId,
      onDone: () => {
        this.tiny = null;
        opts.onDone();
      },
      onRequestRestart: opts.onRequestRestart,
      onRequestRootcheck: opts.onRequestRootcheck,
    });
    this.tiny = tiny;
    return true;
  }
}

export type TinyPhase = 'asking' | 'feedback' | 'regress' | 'done';

export interface TinyCheckOptions {
  storage: ProgressStorage;
  ports: DomainPorts;
  bankName: string;
  backId: string;
  onDone: () => void;
  onRequestRestart: (lessonId: string) => void;
  onRequestRootcheck: (lessonId: string) => void;
}

/**
 * Tiny-check: tối đa 3 câu siêu ngắn. Đúng hết -> onDone.
 * Sai -> màn regress: học lại / kiểm tra nền / thử lại.
 */
export class TinyCheckFlow {
  readonly bankName: string;
  readonly backId: string;
  private ports: DomainPorts;
  private onDone: () => void;
  private onRequestRestart: (lessonId: string) => void;
  private onRequestRootcheck: (lessonId: string) => void;

  questions = $state<TinyQuestion[]>([]);
  index = $state(0);
  wrong = $state(0);
  optionOrder = $state<number[]>([]);
  feedback = $state<string | null>(null);
  feedbackOk = $state(false);
  phase = $state<TinyPhase>('asking');

  current = $derived<TinyQuestion | null>(
    at(this.questions, this.index) ?? null,
  );

  constructor(opts: TinyCheckOptions) {
    this.bankName = opts.bankName;
    this.backId = opts.backId;
    this.ports = opts.ports;
    this.onDone = opts.onDone;
    this.onRequestRestart = opts.onRequestRestart;
    this.onRequestRootcheck = opts.onRequestRootcheck;
    this.resetQuestions();
    if (this.questions.length === 0) {
      this.phase = 'done';
      this.onDone();
    }
  }

  private resetQuestions(): void {
    const gen = this.ports.tinyBanks[this.bankName];
    const all = gen ? gen() : [];
    this.questions = shuffle(all).slice(0, Math.min(3, all.length));
    this.index = 0;
    this.wrong = 0;
    this.feedback = null;
    this.optionOrder = shuffledOptionOrder(
      this.current?.o?.length ?? 0,
    );
    this.phase = 'asking';
  }

  /** Trả lời câu trắc nghiệm (index theo thứ tự hiển thị). */
  answerChoice(displayIndex: number): void {
    const q = this.current;
    if (!q || !q.o || this.phase !== 'asking') return;
    const original = at(this.optionOrder, displayIndex);
    if (original === undefined) return;
    this.grade(original === q.a, q.w);
  }

  /** Trả lời câu nhập số. */
  answerNumeric(value: number): void {
    const q = this.current;
    if (!q || q.o || this.phase !== 'asking') return;
    this.grade(value === q.a, q.w);
  }

  private grade(ok: boolean, why: string): void {
    if (!ok) this.wrong += 1;
    this.feedback = `${ok ? 'Đúng.' : 'Chưa đúng.'} ${why}`;
    this.feedbackOk = ok;
    this.phase = 'feedback';
  }

  /** Bấm "Tiếp" sau feedback. */
  continue(): void {
    if (this.phase !== 'feedback') return;
    this.index += 1;
    this.feedback = null;
    if (this.index >= this.questions.length) {
      if (this.wrong === 0) {
        this.phase = 'done';
        this.onDone();
      } else {
        this.phase = 'regress';
      }
      return;
    }
    this.optionOrder = shuffledOptionOrder(
      this.current?.o?.length ?? 0,
    );
    this.phase = 'asking';
  }

  /** Thử lại kiểm tra nhanh từ đầu với bộ câu hỏi mới (tct). */
  retry(): void {
    this.resetQuestions();
  }

  /** Regress: học lại bài từ đầu (tcr). */
  regressRestart(): void {
    this.onRequestRestart(this.backId);
  }

  /** Regress: kiểm tra xem nền có hổng không (tcn). */
  regressRootcheck(): void {
    this.onRequestRootcheck(this.backId);
  }
}
