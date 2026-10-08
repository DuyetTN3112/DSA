// Sub-flow "Chưa hiểu" của probe: phân loại xong -> mở sổ tay bài tham chiếu
// -> tiny check -> quay lại đúng câu đang hỏi (port từ failKind() + lookupRef()).
// Tách khỏi probe-flow.svelte.ts để file flow không quá 300 dòng.
import type {
  ProbeShape,
  ProgressState,
  ProgressStorage,
  StuckKind,
} from '../domain/types';
import { ensureLessonProgress, type DomainPorts } from './ports';
import { NotebookFlow } from './notebook-flow.svelte';

export type StuckStage = 'reference' | 'tiny';

export interface StuckRecoveryOptions {
  storage: ProgressStorage;
  ports: DomainPorts;
  /** Object progress DÙNG CHUNG với ProbeFlow (không load riêng để khỏi stale). */
  progress: ProgressState;
  save: () => void;
  /** Record assisted DÙNG CHUNG với ProbeFlow. */
  assisted: Record<string, boolean>;
  lessonId: string;
  shape: ProbeShape;
  /** Loại vướng mắc; null = giở sổ tay tự nguyện (không phân loại, không ghi fk). */
  kind: Exclude<StuckKind, 'unsure'> | null;
  refId: string;
  onStage: (stage: StuckStage | 'done') => void;
  onOpenLesson: (id: string) => void;
  onOpenRootcheck: (id: string) => void;
}

/**
 * Điều phối: giở sổ tay (nút "Đã đọc, kiểm tra nhanh") -> tiny check
 * -> báo 'done' để ProbeFlow hỏi lại đúng câu cũ.
 */
export class StuckRecovery {
  notebook = $state<NotebookFlow | null>(null);
  private readonly opts: StuckRecoveryOptions;

  constructor(opts: StuckRecoveryOptions) {
    this.opts = opts;
    // Port failKind(): ghi nhận đã tra cứu + phân loại vướng mắc.
    opts.assisted[opts.shape] = true;
    const r = ensureLessonProgress(opts.progress, opts.lessonId);
    r.unk = (r.unk ?? 0) + 1;
    if (opts.kind !== null) {
      r.fk = r.fk ?? {};
      r.fk[opts.kind] = (r.fk[opts.kind] ?? 0) + 1;
    }
    opts.save();
    const notebook = new NotebookFlow({
      storage: opts.storage,
      ports: opts.ports,
      onBack: () => {
        this.beginTiny();
      },
      onRequestRestart: (id) => {
        opts.onOpenLesson(id);
      },
    });
    notebook.open(opts.refId, 'Đã đọc, kiểm tra nhanh');
    this.notebook = notebook;
    opts.onStage('reference');
  }

  /** Port lookupRef(): sau khi đọc xong -> tiny check bài tham chiếu. */
  private beginTiny(): void {
    const bank = this.opts.ports.tinyFor(this.opts.lessonId, this.opts.kind ?? undefined) ?? '';
    const nb = this.notebook;
    const started =
      nb !== null &&
      bank !== '' &&
      nb.startTinyCheck(bank, this.opts.lessonId, {
        onDone: () => {
          this.opts.onStage('done');
        },
        onRequestRestart: (id) => {
          this.opts.onOpenLesson(id);
        },
        onRequestRootcheck: (id) => {
          this.opts.onOpenRootcheck(id);
        },
      });
    this.opts.onStage(started ? 'tiny' : 'done');
  }
}

/** Dữ liệu ProbeFlow cung cấp để dựng StuckRecovery (tránh truyền rời rạc). */
export interface RecoveryHost {
  storage: ProgressStorage;
  ports: DomainPorts;
  /** Object progress DÙNG CHUNG (không load riêng để khỏi stale). */
  progress: ProgressState;
  save: () => void;
  /** Record assisted DÙNG CHUNG với ProbeFlow. */
  assisted: Record<string, boolean>;
  lessonId: string;
  onOpenLesson: (id: string) => void;
  onOpenRootcheck: (id: string) => void;
}

/**
 * Dựng StuckRecovery cho cả hai đường: "Chưa hiểu" (kind cụ thể, có refId
 * riêng) và "giở sổ tay tự nguyện" (kind=null, refId là bài đang làm).
 * Gom một chỗ để probe-flow không phình quá 300 dòng.
 */
export function createRecovery(
  host: RecoveryHost,
  shape: ProbeShape,
  kind: Exclude<StuckKind, 'unsure'> | null,
  refId: string,
  onDone: () => void,
  onStage: (stage: StuckStage) => void,
): StuckRecovery {
  return new StuckRecovery({
    storage: host.storage,
    ports: host.ports,
    progress: host.progress,
    save: host.save,
    assisted: host.assisted,
    lessonId: host.lessonId,
    shape,
    kind,
    refId,
    onStage: (stage) => {
      if (stage === 'done') onDone();
      else onStage(stage);
    },
    onOpenLesson: host.onOpenLesson,
    onOpenRootcheck: host.onOpenRootcheck,
  });
}
