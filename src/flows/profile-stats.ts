// computeProfileStats: mọi con số của "Hồ sơ học" (port từ profile() trong review.js).
// Hàm thuần — không mutate state, component tự render.
import type {
  LeitnerBox,
  ProbeShape,
  ProgressState,
  StuckKind,
} from '../domain/types';
import {
  addDays,
  normalizeLessonProgress,
  type DateProvider,
} from './ports';
import type { DomainPorts } from './ports';
import { eligibleForReview } from './graph';
import { STUCK_LABELS, isStuckKind } from './labels';

export interface ProfileStats {
  totalProbeLessons: number;
  doneCount: number;
  stableCount: number;
  unstableCount: number;
  shakyCount: number;
  shakyTitles: string[];
  /** Top 5 bài phải học lại nhiều nhất. */
  weakList: { id: string; title: string; count: number }[];
  /** Top 3 dạng câu hay sai nhất. */
  missShapes: { shape: ProbeShape; label: string; count: number }[];
  /** Thói quen cần sửa (mọi mục > 0). */
  habits: { key: string; label: string; count: number }[];
  /** Top 5 bài hay phải giở sổ tay. */
  notebookHeavy: { id: string; title: string; count: number }[];
  assistedTotal: number;
  luckyTotal: number;
  stuckBreakdown: { kind: StuckKind; label: string; count: number }[];
  /** Số bài trong từng hộp Leitner 1..5. */
  boxes: [number, number, number, number, number];
  dueCount: number;
  lastHealthCheck: string | null;
  nextAction:
    | { kind: 'reprove'; titles: string[] }
    | { kind: 'review-due'; count: number }
    | { kind: 'healthcheck-due' }
    | { kind: 'unstable'; count: number }
    | { kind: 'continue' };
}

const SHAPE_SHORT: Record<string, string> = {
  same: 'đổi số',
  flip: 'đi ngược chiều',
  new: 'bối cảnh mới',
  verdict: 'tự phán đúng/sai',
  read: 'đọc kỹ đề',
};

const HAB_LABELS: Record<string, string> = {
  careless: 'Cẩu thả (sai trong chưa đầy 4 giây)',
  misread: 'Đọc sai đề',
  overconfident: 'Chắc chắn mà vẫn sai',
};

function titleOf(ports: DomainPorts, id: string): string {
  return ports.lessons[id]?.t ?? id;
}

/** LeitnerBox hiện tại, không mutate (khác item() của code cũ). */
function boxOf(state: ProgressState, dates: DateProvider, id: string): LeitnerBox {
  const existing = state.lt[id];
  if (existing) return existing;
  const last = state.pr[id]?.last ?? dates.today();
  return {
    box: 1,
    due: addDays(last, 1),
    n: 0,
    lapse: 0,
    cl: 0,
    ls: '',
    seen: '',
  };
}

function isDue(
  state: ProgressState,
  dates: DateProvider,
  id: string,
): boolean {
  const t = dates.today();
  const it = boxOf(state, dates, id);
  return it.seen !== t && (it.due <= t || state.shaky[id] === 1);
}

export function computeProfileStats(
  state: ProgressState,
  ports: DomainPorts,
  dates: DateProvider,
): ProfileStats {
  const all = Object.keys(ports.probeBanks).filter(
    (i) => ports.lessons[i] !== undefined,
  );
  for (const r of Object.values(state.pr)) normalizeLessonProgress(r);
  const done = all.filter((i) => state.done[i] === 1);
  const days = (i: string): number => state.pr[i]?.days.length ?? 0;
  const shaky = done.filter((i) => state.shaky[i] === 1);
  const stable = done.filter((i) => state.shaky[i] !== 1 && days(i) >= 2);
  const unstable = done.filter((i) => state.shaky[i] !== 1 && days(i) < 2);

  const weakList = Object.entries(state.weak)
    .filter(([i, n]) => ports.lessons[i] !== undefined && n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([i, n]) => ({ id: i, title: titleOf(ports, i), count: n }));

  const missAgg: Record<string, number> = {};
  for (const r of Object.values(state.pr)) {
    for (const [s, c] of Object.entries(r.miss)) {
      missAgg[s] = (missAgg[s] ?? 0) + c;
    }
  }
  const missShapes = Object.entries(missAgg)
    .filter(([s]) => SHAPE_SHORT[s] !== undefined)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([s, c]) => ({
      shape: s as ProbeShape,
      label: SHAPE_SHORT[s] as string,
      count: c,
    }));

  const habits = Object.entries(state.hab)
    .filter(([k]) => HAB_LABELS[k] !== undefined)
    .sort((a, b) => b[1] - a[1])
    .map(([k, c]) => ({ key: k, label: HAB_LABELS[k] as string, count: c }));

  const notebookHeavy = Object.keys(state.pr)
    .filter((i) => ports.lessons[i] !== undefined && (state.pr[i]?.unk ?? 0) > 0)
    .map((i) => ({
      id: i,
      title: titleOf(ports, i),
      count: state.pr[i]?.unk ?? 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  let assistedTotal = 0;
  let luckyTotal = 0;
  const stuckAgg: Partial<Record<StuckKind, number>> = {};
  for (const r of Object.values(state.pr)) {
    assistedTotal += r.asst ?? 0;
    luckyTotal += r.lucky ?? 0;
    for (const [k, c] of Object.entries(r.fk ?? {})) {
      const kind = k as StuckKind;
      stuckAgg[kind] = (stuckAgg[kind] ?? 0) + c;
    }
  }
  const stuckBreakdown = Object.entries(stuckAgg)
    .filter(
      (entry): entry is [StuckKind, number] => isStuckKind(entry[0]),
    )
    .sort((a, b) => b[1] - a[1])
    .map(([k, c]) => ({ kind: k, label: STUCK_LABELS[k], count: c }));

  const eligible = eligibleForReview(ports, state);
  const boxes: [number, number, number, number, number] = [0, 0, 0, 0, 0];
  for (const id of eligible) {
    const b = boxOf(state, dates, id).box;
    boxes[b - 1] = (boxes[b - 1] ?? 0) + 1;
  }
  const dueCount = eligible.filter((id) =>
    isDue(state, dates, id),
  ).length;
  const hc = state.hc;
  const lastHealthCheck = hc.last ?? null;

  const nextAction: ProfileStats['nextAction'] =
    shaky.length > 0
      ? {
          kind: 'reprove',
          titles: shaky.slice(0, 3).map((i) => titleOf(ports, i)),
        }
      : dueCount > 0
        ? { kind: 'review-due', count: dueCount }
        : isHealthCheckDue(state, ports, dates)
          ? { kind: 'healthcheck-due' }
          : unstable.length > 0
            ? { kind: 'unstable', count: unstable.length }
            : { kind: 'continue' };

  return {
    totalProbeLessons: all.length,
    doneCount: done.length,
    stableCount: stable.length,
    unstableCount: unstable.length,
    shakyCount: shaky.length,
    shakyTitles: shaky.map((i) => titleOf(ports, i)),
    weakList,
    missShapes,
    habits,
    notebookHeavy,
    assistedTotal,
    luckyTotal,
    stuckBreakdown,
    boxes,
    dueCount,
    lastHealthCheck,
    nextAction,
  };
}

const FOUNDATION_IDS: readonly string[] = [
  'k1',
  'k3',
  'k4',
  'k6',
  'k7',
  'bx0',
  'p1',
  'p2',
  'p3',
  'p4',
  'a2',
  'a3',
  'sm',
];

/** Kiểm tra nền tảng có đến hạn không (port từ hcDue()). */
export function isHealthCheckDue(
  state: ProgressState,
  ports: DomainPorts,
  dates: DateProvider,
): boolean {
  const done = FOUNDATION_IDS.filter(
    (i) =>
      state.done[i] === 1 &&
      ports.probeBanks[i] !== undefined &&
      ports.lessons[i] !== undefined,
  );
  if (done.length < 3) return false;
  const last = state.hc.last;
  return !last || addDays(last, 7) <= dates.today();
}
