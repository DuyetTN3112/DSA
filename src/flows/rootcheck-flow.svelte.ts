// RootcheckFlow: lần ngược tìm bài nền bị hổng (port từ rootcheck() trong probe.js).
// Mỗi bài nền testable được probe 2 dạng (flip, verdict); trượt -> rút dấu
// bài nền, đánh dấu shaky các bài dựa trên nó.
import type {
  ProgressState,
  ProgressStorage,
} from '../domain/types';
import {
  dropKey,
  normalizeProgress,
  systemDates,
  type DateProvider,
  type DomainPorts,
} from './ports';
import { descendants, testable } from './graph';
import { ProbeFlow } from './probe-flow.svelte';

export type RootcheckPhase = 'intro' | 'probing' | 'found-root' | 'all-clear';

export interface RootcheckFlowOptions {
  storage: ProgressStorage;
  ports: DomainPorts;
  /** Bài đang nghi hổng nền. */
  lessonId: string;
  dates?: DateProvider;
  /** Mở lại một bài từ đầu (nút "Học lại"). */
  onRequestRestart?: (lessonId: string) => void;
}

export class RootcheckFlow {
  readonly lessonId: string;
  private storage: ProgressStorage;
  private ports: DomainPorts;
  private dates: DateProvider;
  private onRequestRestart: (lessonId: string) => void;

  progress = $state<ProgressState>({} as ProgressState);
  phase = $state<RootcheckPhase>('intro');
  items = $state<string[]>([]);
  index = $state(0);
  activeProbe = $state<ProbeFlow | null>(null);
  foundRoot = $state<string | null>(null);

  get foundRootTitle(): string {
    return this.foundRoot
      ? (this.ports.lessons[this.foundRoot]?.t ?? this.foundRoot)
      : '';
  }

  constructor(opts: RootcheckFlowOptions) {
    this.lessonId = opts.lessonId;
    this.storage = opts.storage;
    this.ports = opts.ports;
    this.dates = opts.dates ?? systemDates;
    this.onRequestRestart =
      opts.onRequestRestart ?? (() => undefined);
    this.progress = normalizeProgress(this.storage.load());
    this.items = testable(this.ports, this.progress, this.lessonId);
  }

  private save(): void {
    this.storage.save(this.progress);
  }

  /** Bắt đầu kiểm tra từng bài nền. */
  begin(): void {
    if (this.phase !== 'intro') return;
    this.index = 0;
    this.nextItem();
  }

  private nextItem(): void {
    if (this.index >= this.items.length) {
      this.activeProbe = null;
      this.phase = 'all-clear';
      return;
    }
    const y = this.items[this.index] as string;
    this.activeProbe = new ProbeFlow({
      storage: this.storage,
      ports: this.ports,
      dates: this.dates,
      lessonId: y,
      run: {
        shapes: ['flip', 'verdict'],
        title: 'Kiểm tra nền',
        onEnd: (ok) => {
          this.handleItemEnd(y, ok);
        },
      },
    });
    this.phase = 'probing';
  }

  private handleItemEnd(y: string, ok: boolean): void {
    if (ok) {
      this.index += 1;
      this.nextItem();
      return;
    }
    // Tìm ra gốc: rút dấu bài nền, các bài dựa trên nó bị shaky.
    this.progress.done = dropKey(this.progress.done, y);
    this.progress.weak[y] = (this.progress.weak[y] ?? 0) + 1;
    this.progress.done = dropKey(this.progress.done, this.lessonId);
    for (const z of descendants(this.ports, y)) {
      if (this.progress.done[z] === 1) this.progress.shaky[z] = 1;
    }
    this.save();
    this.foundRoot = y;
    this.activeProbe = null;
    this.phase = 'found-root';
  }

  /** Bấm "Học lại «bài nền»" sau khi tìm ra gốc. */
  restartAtRoot(): void {
    if (this.foundRoot) this.onRequestRestart(this.foundRoot);
  }

  /** Bấm "Học lại bài này từ đầu" khi mọi nền đều vững. */
  restartCurrent(): void {
    this.onRequestRestart(this.lessonId);
  }
}
