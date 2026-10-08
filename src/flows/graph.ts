// Pure helpers trên đồ thị bài học: tiền đề, bài Python gần nhất, chọn dạng câu ôn.
// Không dùng $state — toàn hàm thuần, dễ test.
import type { ProbeShape, ProgressState } from '../domain/types';
import {
  at,
  ensureLeitnerBox,
  shuffle,
  type DateProvider,
  type DomainPorts,
} from './ports';

/**
 * Mọi bài nền (trực tiếp + gián tiếp) của id, theo thứ tự từ gốc lên.
 * Port từ anc(): DFS qua preq, không trùng.
 */
export function ancestors(ports: DomainPorts, id: string): string[] {
  const out: string[] = [];
  const visit = (x: string): void => {
    const pres = ports.preq[x] ?? [];
    for (const y of pres) {
      visit(y);
      if (!out.includes(y)) out.push(y);
    }
  };
  visit(id);
  return out;
}

/** Mọi bài dựa trên id (ngược lại của ancestors). Port từ deps(). */
export function descendants(ports: DomainPorts, id: string): string[] {
  return Object.keys(ports.lessons).filter((x) =>
    ancestors(ports, x).includes(id),
  );
}

/** Các bài nền có thể kiểm tra được: có bank probe và đã done. Port từ testable(). */
export function testable(
  ports: DomainPorts,
  state: ProgressState,
  id: string,
): string[] {
  return ancestors(ports, id).filter(
    (y) => ports.probeBanks[y] !== undefined && state.done[y] === 1,
  );
}

const PYTHON_CHAIN: readonly string[] = [
  'p1',
  'p2',
  'p3',
  'p4',
  'b1',
  'b2',
  'b3',
  'b4',
];

/**
 * Bài Python cơ bản gần nhất trong chuỗi tiền đề (dùng khi "hiểu ý
 * nhưng không biết viết Python"). Port từ pyRef().
 */
export function nearestPythonLesson(
  ports: DomainPorts,
  id: string,
): string {
  const chain = ancestors(ports, id).filter(
    (x) => PYTHON_CHAIN.includes(x) && ports.lessons[x] !== undefined,
  );
  const last = at(chain, chain.length - 1);
  return last ?? id;
}

/** Các bài đủ điều kiện ôn: có bank probe, đã done, tồn tại trong lessons. */
export function eligibleForReview(
  ports: DomainPorts,
  state: ProgressState,
): string[] {
  return Object.keys(ports.probeBanks).filter(
    (id) => state.done[id] === 1 && ports.lessons[id] !== undefined,
  );
}

export type GradeFlag = '' | 'lucky' | 'unknown' | 'careless' | 'misread' | 'overconfident' | 'assisted';

/**
 * Chọn dạng câu cho buổi ôn: ưu tiên dạng hay sai (miss), tránh lặp dạng lần trước,
 * dạng 'same' trọng số thấp hơn. Port từ pickShape().
 */
export function pickReviewShape(
  ports: DomainPorts,
  state: ProgressState,
  id: string,
  allow?: readonly ProbeShape[],
): ProbeShape {
  const bank = ports.probeBanks[id];
  const wanted = allow ?? (['same', 'flip', 'new', 'verdict', 'read'] as const);
  const shapes: ProbeShape[] = bank === undefined ? [] : [...wanted];
  if (shapes.length === 0) return 'same';
  const miss = state.pr[id]?.miss ?? {};
  const lastShape = state.lt[id]?.ls ?? '';
  let pool = shapes;
  if (pool.length > 1 && lastShape !== '') {
    const filtered = pool.filter((s) => s !== lastShape);
    if (filtered.length > 0) pool = filtered;
  }
  const weights = pool.map((s) => (s === 'same' ? 0.5 : 1) + 2 * (miss[s] ?? 0));
  const total = weights.reduce((a, b) => a + b, 0);
  let x = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    const w = at(weights, i) ?? 0;
    x -= w;
    if (x < 0) {
      const picked = at(pool, i);
      if (picked !== undefined) return picked;
    }
  }
  const fallback = at(pool, pool.length - 1);
  return fallback ?? 'same';
}

/** Xáo thứ tự hiển thị các options, giữ nguyên index gốc. */
export function shuffledOptionOrder(length: number): number[] {
  return shuffle(
    Array.from({ length }, (_, i) => i),
  );
}

/**
 * Danh sách bài đến hạn ôn Leitner, đã sắp xếp (port từ dueList()):
 * shaky trước, rồi đến hạn sớm nhất, rồi hộp thấp nhất.
 */
export function dueLeitnerList(
  ports: DomainPorts,
  state: ProgressState,
  dates: DateProvider,
): string[] {
  const t = dates.today();
  const rows = eligibleForReview(ports, state).map((id) => ({
    id,
    box: ensureLeitnerBox(state, id, dates),
    shaky: state.shaky[id] === 1,
  }));
  return rows
    .filter((r) => r.box.seen !== t && (r.box.due <= t || r.shaky))
    .sort(
      (a, b) =>
        (b.shaky ? 1 : 0) - (a.shaky ? 1 : 0) ||
        a.box.due.localeCompare(b.box.due) ||
        a.box.box - b.box.box,
    )
    .map((r) => r.id);
}
