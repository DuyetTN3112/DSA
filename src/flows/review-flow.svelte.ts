// ReviewFlow: ôn cách quãng (Leitner), diagnose khi trượt nhiều, hồ sơ học.
// Port từ review.js: reviewSpaced, diagnose, withdraw, dueList.
// Health check tách ở healthcheck-flow.svelte.ts;
// vòng recovery tách ở recovery-flow.svelte.ts;
// chấm Leitner tách ở probe-evidence.ts (gradeSpacedItem).
import { SvelteSet } from 'svelte/reactivity';
import type {
  ProbeShape,
  ProgressState,
  ProgressStorage,
} from '../domain/types';
import {
  ensureLeitnerBox,
  isRealExplanation,
  noop,
  normalizeProgress,
  systemDates,
  type DateProvider,
  type DomainPorts,
} from './ports';
import { SHAPE_SHORT, isProbeShape } from './labels';
import {
  dueLeitnerList,
  eligibleForReview,
  pickReviewShape,
  testable as testableFor,
} from './graph';
import { ProbeFlow } from './probe-flow.svelte';
import type { ProbeEndInfo } from './probe-types';
import { RecoveryFlow } from './recovery-flow.svelte';
import { gradeSpacedItem, withdrawFromReview } from './probe-evidence';
import type { SpacedGradeResult } from './probe-evidence';
import { computeProfileStats, type ProfileStats } from './profile-stats';

export type { SpacedGrade, SpacedGradeResult as SpacedItemResult } from './probe-evidence';

export type ReviewPhase =
  | 'idle'
  | 'spaced-intro'
  | 'spaced-asking'
  | 'spaced-summary'
  | 'spaced-empty'
  | 'spaced-nothing-due';

export interface ReviewFlowCallbacks {
  onOpenLesson: (lessonId: string) => void;
  onOpenRootcheck: (lessonId: string) => void;
  /** "Chứng minh lại" — mở probe fromHub cho bài shaky. */
  onReprove: (lessonId: string) => void;
  onExit: () => void;
}

export interface ReviewFlowOptions {
  storage: ProgressStorage;
  ports: DomainPorts;
  dates?: DateProvider;
  callbacks?: Partial<ReviewFlowCallbacks>;
}

export interface DiagnoseInfo {
  lessonId: string;
  title: string;
  weakCount: number;
  missBreakdown: { shape: string; label: string; count: number }[];
  tip: string;
  canRootcheck: boolean;
}

const MAX_SPACED_PER_DAY = 6;

export class ReviewFlow {
  private storage: ProgressStorage;
  private ports: DomainPorts;
  private dates: DateProvider;
  private cb: ReviewFlowCallbacks;
  private diagnoseSeen = new SvelteSet<string>();

  progress = $state<ProgressState>({} as ProgressState);
  phase = $state<ReviewPhase>('idle');
  queue = $state<string[]>([]);
  queueIndex = $state(0);
  activeProbe = $state<ProbeFlow | null>(null);
  results = $state<SpacedGradeResult[]>([]);
  /** Vòng recovery đang mở từ màn summary (null = không có). */
  recovery = $state<RecoveryFlow | null>(null);
  /** Bài đang chờ diagnose (null = không có). */
  diagnoseId = $state<string | null>(null);

  /** Tổng số bài đến hạn (hiện ở nút "Ôn cách quãng"). */
  get dueCount(): number {
    return dueLeitnerList(this.ports, this.progress, this.dates).length;
  }

  /** Kết quả "chưa nhớ" ở summary -> nút giở sổ tay. */
  summaryUnknowns = $derived(
    this.results.filter((r) => r.res === 'unknown'),
  );
  /** Kết quả trượt + bị shaky -> nút "chứng minh lại". */
  summaryShakies = $derived(
    this.results.filter(
      (r) => r.res === 'down' && this.progress.shaky[r.id] === 1,
    ),
  );
  /** Sai liên tiếp và có bài nền testable -> nút kiểm tra nền. */
  summaryRegress = $derived(
    this.results.filter(
      (r) =>
        r.res === 'down' &&
        r.cl >= 2 &&
        testableFor(this.ports, this.progress, r.id).length > 0,
    ),
  );

  constructor(opts: ReviewFlowOptions) {
    this.storage = opts.storage;
    this.ports = opts.ports;
    this.dates = opts.dates ?? systemDates;
    this.cb = {
      onOpenLesson: opts.callbacks?.onOpenLesson ?? noop,
      onOpenRootcheck: opts.callbacks?.onOpenRootcheck ?? noop,
      onReprove: opts.callbacks?.onReprove ?? noop,
      onExit: opts.callbacks?.onExit ?? noop,
    };
    this.progress = normalizeProgress(this.storage.load());
  }

  private save(): void {
    this.storage.save(this.progress);
  }

  /** Bắt đầu buổi ôn cách quãng. */
  startSpacedReview(): void {
    if (eligibleForReview(this.ports, this.progress).length === 0) {
      this.phase = 'spaced-empty';
      return;
    }
    const due = dueLeitnerList(this.ports, this.progress, this.dates).slice(
      0,
      MAX_SPACED_PER_DAY,
    );
    if (due.length === 0) {
      this.phase = 'spaced-nothing-due';
      return;
    }
    this.queue = due;
    this.queueIndex = 0;
    this.results = [];
    this.phase = 'spaced-intro';
  }

  /** Bấm "Bắt đầu" ở màn giới thiệu buổi ôn. */
  beginSpacedItems(): void {
    if (this.phase !== 'spaced-intro') return;
    this.nextSpacedItem();
  }

  private nextSpacedItem(): void {
    if (this.queueIndex >= this.queue.length) {
      this.activeProbe = null;
      this.phase = 'spaced-summary';
      return;
    }
    const id = this.queue[this.queueIndex] as string;
    const sh = pickReviewShape(this.ports, this.progress, id);
    ensureLeitnerBox(this.progress, id, this.dates).ls = sh;
    this.save();
    this.activeProbe = new ProbeFlow({
      storage: this.storage,
      ports: this.ports,
      dates: this.dates,
      lessonId: id,
      run: {
        shapes: [sh],
        title: 'Ôn cách quãng',
        tag: `Bài ${this.queueIndex + 1}/${this.queue.length}`,
        onEnd: (ok, info) => {
          this.finishSpacedItem(id, sh, ok, info);
        },
      },
    });
    this.phase = 'spaced-asking';
  }

  private finishSpacedItem(
    id: string,
    sh: ProbeShape,
    ok: boolean,
    info: ProbeEndInfo,
  ): void {
    const graded = gradeSpacedItem(
      this.ports,
      this.progress,
      this.dates,
      id,
      sh,
      ok,
      info.flags[sh] ?? '',
    );
    this.results = [...this.results, graded];
    this.save();
    this.queueIndex += 1;
    this.nextSpacedItem();
  }

  /** Rút dấu xong có bằng chứng (port từ withdraw()). */
  withdraw(id: string): void {
    withdrawFromReview(this.ports, this.progress, id);
    this.save();
  }

  /**
   * Kiểm tra trước khi mở bài: trượt >= 2 lần -> cần diagnose trước.
   * Trả về true nếu đã chuyển sang màn diagnose.
   */
  checkStartLesson(lessonId: string): boolean {
    const weak = this.progress.weak[lessonId] ?? 0;
    const key = `${lessonId}:${weak}`;
    if (
      this.ports.lessons[lessonId] !== undefined &&
      this.ports.probeBanks[lessonId] !== undefined &&
      weak >= 2 &&
      !this.diagnoseSeen.has(key)
    ) {
      this.diagnoseSeen.add(key);
      this.diagnoseId = lessonId;
      return true;
    }
    return false;
  }

  /** Thông tin cho màn diagnose. */
  diagnoseInfo = $derived.by<DiagnoseInfo | null>(() => {
    const id = this.diagnoseId;
    if (!id) return null;
    const miss = this.progress.pr[id]?.miss ?? {};
    const breakdown = Object.entries(miss)
      .filter((entry): entry is [ProbeShape, number] => isProbeShape(entry[0]))
      .sort((a, b) => b[1] - a[1])
      .map(([s, c]) => ({
        shape: s,
        label: SHAPE_SHORT[s],
        count: c,
      }));
    const top = breakdown[0]?.shape;
    const tips: Record<string, string> = {
      same: 'Bạn sai cả ở dạng cơ bản nhất (đổi số). Lần này học chậm lại: ở mỗi bước, tự dự đoán đáp án TRƯỚC khi bấm.',
      flip: 'Bạn làm được chiều xuôi nhưng sai khi đi ngược. Lần này sau mỗi ví dụ, tự hỏi: nếu đề cho KẾT QUẢ thì suy ra ĐẦU VÀO thế nào?',
      new: 'Bạn sai khi đổi bối cảnh. Lần này sau mỗi ví dụ, tự nghĩ thêm một ví dụ khác ngoài đời.',
      verdict:
        'Bạn khó tự phán đúng/sai và nói vì sao. Lần này hãy nói thành lời lý do của mỗi đáp án.',
      read: 'Bạn hay sai ở câu bẫy đọc đề. Lần này trước mỗi câu, gạch dưới điều đề HỎI và điều đề CHO.',
    };
    return {
      lessonId: id,
      title: this.ports.lessons[id]?.t ?? id,
      weakCount: this.progress.weak[id] ?? 0,
      missBreakdown: breakdown,
      tip:
        (top ? tips[top] : undefined) ??
        'Học chậm lại, mỗi bước tự dự đoán trước khi bấm.',
      canRootcheck:
        testableFor(this.ports, this.progress, id).length > 0,
    };
  });

  /**
   * Gửi giải thích ở màn diagnose. Hợp lệ -> mở bài học lại.
   * (P.diag của code cũ chỉ ghi không đọc nên không persist.)
   */
  submitDiagnoseExplanation(text: string): boolean {
    const id = this.diagnoseId;
    if (!id || !isRealExplanation(text)) return false;
    this.diagnoseId = null;
    this.cb.onOpenLesson(id);
    return true;
  }

  /** Mở kiểm tra nền từ màn diagnose. */
  diagnoseRootcheck(): void {
    const id = this.diagnoseId;
    if (!id) return;
    this.diagnoseId = null;
    this.cb.onOpenRootcheck(id);
  }

  /** Số liệu hồ sơ học (component tự render). */
  getProfileStats(): ProfileStats {
    return computeProfileStats(this.progress, this.ports, this.dates);
  }

  /** Mở recovery (sổ tay -> tiny -> câu mới) từ màn summary. */
  startRecovery(lessonId: string): void {
    this.recovery = new RecoveryFlow({
      storage: this.storage,
      ports: this.ports,
      dates: this.dates,
      lessonId,
      onBack: () => {
        this.recovery = null;
      },
      onRequestRestart: (rid) => {
        this.cb.onOpenLesson(rid);
      },
      onRequestRootcheck: (rid) => {
        this.cb.onOpenRootcheck(rid);
      },
    });
  }

  /** "Chứng minh lại" bài shaky từ màn summary. */
  reprove(lessonId: string): void {
    this.cb.onReprove(lessonId);
  }

  /** "Kiểm tra nền" cho bài sai liên tiếp từ màn summary. */
  rootcheckFor(lessonId: string): void {
    this.cb.onOpenRootcheck(lessonId);
  }

  /** Thoát buổi ôn / màn hình hiện tại. */
  exit(): void {
    this.cb.onExit();
  }
}
