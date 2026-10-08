// HealthCheckFlow: kiểm tra nền tảng định kỳ (port từ healthCheck() trong review.js).
// Mỗi bài nền một câu mới (dạng flip/read/new). Sai 1 lần -> shaky;
// sai 2 lần kiểm tra liên tiếp -> rút dấu, học lại.
import type {
  ProbeShape,
  ProgressState,
  ProgressStorage,
} from '../domain/types';
import {
  noop,
  normalizeProgress,
  systemDates,
  type DateProvider,
  type DomainPorts,
} from './ports';
import { pickReviewShape, testable } from './graph';
import { ProbeFlow } from './probe-flow.svelte';
import type { ProbeEndInfo } from './probe-types';
import { RecoveryFlow } from './recovery-flow.svelte';
import { withdrawFromReview } from './probe-evidence';
import { FOUNDATION_IDS } from './labels';

export type HealthPhase = 'intro' | 'asking' | 'result' | 'empty';

export type HealthItemRes = 'ok' | 'lucky' | 'unknown' | 'shaky' | 'withdrawn';

export interface HealthItemResult {
  id: string;
  res: HealthItemRes;
}

export interface HealthCheckCallbacks {
  onOpenLesson: (lessonId: string) => void;
  onOpenRootcheck: (lessonId: string) => void;
  onReprove: (lessonId: string) => void;
  onExit: () => void;
}

export interface HealthCheckOptions {
  storage: ProgressStorage;
  ports: DomainPorts;
  dates?: DateProvider;
  callbacks?: Partial<HealthCheckCallbacks>;
}

const MAX_HEALTH_PER_RUN = 6;

export class HealthCheckFlow {
  private storage: ProgressStorage;
  private ports: DomainPorts;
  private dates: DateProvider;
  private cb: HealthCheckCallbacks;

  progress = $state<ProgressState>({} as ProgressState);
  phase = $state<HealthPhase>('intro');
  queue = $state<string[]>([]);
  queueIndex = $state(0);
  activeProbe = $state<ProbeFlow | null>(null);
  results = $state<HealthItemResult[]>([]);
  recovery = $state<RecoveryFlow | null>(null);

  unknowns = $derived<HealthItemResult[]>(
    this.results.filter((r) => r.res === 'unknown'),
  );
  bads = $derived<HealthItemResult[]>(
    this.results.filter((r) => r.res === 'shaky' || r.res === 'withdrawn'),
  );

  constructor(opts: HealthCheckOptions) {
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

  private hc(): ProgressState['hc'] {
    return this.progress.hc;
  }

  /** Các bài nền tảng đã done (port từ foundDone()). */
  private foundationDone(): string[] {
    return FOUNDATION_IDS.filter(
      (i) =>
        this.progress.done[i] === 1 &&
        this.ports.probeBanks[i] !== undefined &&
        this.ports.lessons[i] !== undefined,
    );
  }

  /** Bắt đầu: chọn tối đa 6 bài nền (shaky trước, lâu chưa kiểm tra trước). */
  start(): void {
    const f = this.foundationDone();
    if (f.length < 3) {
      this.phase = 'empty';
      return;
    }
    const h = this.hc();
    this.queue = f
      .sort(
        (a, b) =>
          (this.progress.shaky[b] === 1 ? 1 : 0) -
            (this.progress.shaky[a] === 1 ? 1 : 0) ||
          (h.seen[a] ?? '').localeCompare(h.seen[b] ?? ''),
      )
      .slice(0, MAX_HEALTH_PER_RUN);
    this.queueIndex = 0;
    this.results = [];
    this.phase = 'intro';
  }

  /** Bấm "Bắt đầu". */
  beginItems(): void {
    if (this.phase !== 'intro') return;
    this.nextItem();
  }

  private nextItem(): void {
    if (this.queueIndex >= this.queue.length) {
      this.hc().last = this.dates.today();
      this.save();
      this.activeProbe = null;
      this.phase = 'result';
      return;
    }
    const id = this.queue[this.queueIndex] as string;
    const sh = pickReviewShape(this.ports, this.progress, id, [
      'flip',
      'read',
      'new',
    ]);
    this.activeProbe = new ProbeFlow({
      storage: this.storage,
      ports: this.ports,
      dates: this.dates,
      lessonId: id,
      run: {
        shapes: [sh],
        title: 'Kiểm tra nền tảng',
        onEnd: (ok, info) => {
          this.finishItem(id, sh, ok, info);
        },
      },
    });
  }

  private finishItem(
    id: string,
    sh: ProbeShape,
    ok: boolean,
    info: ProbeEndInfo,
  ): void {
    const h = this.hc();
    const flag = info.flags[sh] ?? '';
    const t = this.dates.today();
    let res: HealthItemRes;
    if (ok) {
      h.seen[id] = t;
      h.fail[id] = 0;
      res = 'ok';
    } else if (flag === 'lucky' || flag === 'unknown') {
      res = flag === 'unknown' ? 'unknown' : 'lucky';
    } else {
      h.fail[id] = (h.fail[id] ?? 0) + 1;
      if (flag !== '')
        this.progress.hab[flag] = (this.progress.hab[flag] ?? 0) + 1;
      if (h.fail[id] >= 2) {
        this.withdrawFoundation(id);
        h.fail[id] = 0;
        res = 'withdrawn';
      } else {
        this.progress.shaky[id] = 1;
        res = 'shaky';
      }
    }
    this.results = [...this.results, { id, res }];
    this.save();
    this.queueIndex += 1;
    this.nextItem();
  }

  /** Rút dấu bài nền sau 2 lần kiểm tra liên tiếp trượt (dùng chung withdraw). */
  private withdrawFoundation(id: string): void {
    withdrawFromReview(this.ports, this.progress, id);
  }

  /** Mở recovery (sổ tay -> tiny -> câu mới) cho bài "chưa nhớ". */
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

  /** "Chứng minh lại" bài shaky. */
  reprove(lessonId: string): void {
    this.cb.onReprove(lessonId);
  }

  /** "Học lại" bài bị withdrawn. */
  restartLesson(lessonId: string): void {
    this.cb.onOpenLesson(lessonId);
  }

  /** "Kiểm tra bài nền của nó" (chỉ khi có testable). */
  rootcheckFor(lessonId: string): void {
    if (testable(this.ports, this.progress, lessonId).length > 0) {
      this.cb.onOpenRootcheck(lessonId);
    }
  }

  exit(): void {
    this.cb.onExit();
  }
}
