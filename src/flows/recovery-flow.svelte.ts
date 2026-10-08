// RecoveryFlow: vòng recovery sau "Chưa nhớ" (port từ recover/retestOne trong review.js).
// notebook -> tiny-check -> MỘT câu hỏi mới (formative: noRec, không chạm Leitner).
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
import { pickReviewShape } from './graph';
import { NotebookFlow } from './notebook-flow.svelte';
import { ProbeFlow } from './probe-flow.svelte';

export type RecoveryPhase = 'notebook' | 'retest' | 'retest-done';

export interface RecoveryFlowOptions {
  storage: ProgressStorage;
  ports: DomainPorts;
  lessonId: string;
  dates?: DateProvider;
  /** Về lại màn hình đã mở recovery (buổi ôn / kiểm tra nền tảng). */
  onBack: () => void;
  onRequestRestart?: (lessonId: string) => void;
  onRequestRootcheck?: (lessonId: string) => void;
}


export class RecoveryFlow {
  readonly lessonId: string;
  private storage: ProgressStorage;
  private ports: DomainPorts;
  private dates: DateProvider;
  private onBack: () => void;
  private onRequestRestart: (lessonId: string) => void;
  private onRequestRootcheck: (lessonId: string) => void;

  progress = $state<ProgressState>({} as ProgressState);
  phase = $state<RecoveryPhase>('notebook');
  notebook = $state<NotebookFlow | null>(null);
  retestProbe = $state<ProbeFlow | null>(null);
  retestShape = $state<ProbeShape>('same');
  retestOk = $state<boolean | null>(null);
  retestFlag = $state('');

  constructor(opts: RecoveryFlowOptions) {
    this.lessonId = opts.lessonId;
    this.storage = opts.storage;
    this.ports = opts.ports;
    this.dates = opts.dates ?? systemDates;
    this.onBack = opts.onBack;
    this.onRequestRestart = opts.onRequestRestart ?? noop;
    this.onRequestRootcheck = opts.onRequestRootcheck ?? noop;
    this.progress = normalizeProgress(this.storage.load());
    const notebook = new NotebookFlow({
      storage: this.storage,
      ports: this.ports,
      onBack: () => {
        this.beginTiny();
      },
      onRequestRestart: (id) => {
        this.onRequestRestart(id);
      },
    });
    notebook.open(this.lessonId, 'Đã đọc, kiểm tra nhanh');
    this.notebook = notebook;
  }

  private beginTiny(): void {
    const notebook = this.notebook;
    if (!notebook) {
      this.beginRetest();
      return;
    }
    const started = notebook.startTinyCheck(
      this.ports.tinyFor(this.lessonId),
      this.lessonId,
      {
        onDone: () => {
          this.beginRetest();
        },
        onRequestRestart: (id) => {
        this.onRequestRestart(id);
      },
        onRequestRootcheck: (id) => {
          this.onRequestRootcheck(id);
        },
      },
    );
    if (!started) this.beginRetest();
  }

  private beginRetest(): void {
    const sh = pickReviewShape(this.ports, this.progress, this.lessonId);
    this.retestShape = sh;
    this.retestProbe = new ProbeFlow({
      storage: this.storage,
      ports: this.ports,
      dates: this.dates,
      lessonId: this.lessonId,
      run: {
        shapes: [sh],
        noRec: true,
        title: 'Ôn lại sau khi đọc',
        onEnd: (ok, info) => {
          this.retestOk = ok;
          this.retestFlag = info.flags[sh] ?? '';
          this.retestProbe = null;
          this.phase = 'retest-done';
        },
      },
    });
    this.phase = 'retest';
  }

  /** Bấm "Học lại" khi retest vẫn chưa đúng (và không phải chưa nhớ). */
  restartLesson(): void {
    if (this.phase === 'retest-done' && this.retestOk === false) {
      this.onRequestRestart(this.lessonId);
    }
  }

  /** Về buổi ôn. */
  goBack(): void {
    this.onBack();
  }
}
