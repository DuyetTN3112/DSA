// Lộ trình học: STAGES (bản cuối, port từ main:app.js), PREQ, ALL_IDS, isUnlocked.
// Pure functions — không DOM, không Date.now.

import type { ProgressState, Stage } from './types';
import { STAGES } from './lessons/order';

/** Re-export: single source of truth cho lộ trình (đã gồm rd1 sau k3 + Q-bank refs) */
export { STAGES };
export type { Stage };

/**
 * Đồ thị tiền đề: single source of truth nằm ở probe/prereq.ts
 * (đã merge theo load order: file sau thắng khi trùng key).
 */
import { PREQ } from './probe/prereq';
export { PREQ };

/** Toàn bộ id bài học theo đúng thứ tự lộ trình (77 bài, gồm rd1) */
export const ALL_IDS: string[] = STAGES.flatMap((s) => s.L);

/** Mọi bài tiền đề (trực tiếp + gián tiếp) của một bài */
export function ancestors(id: string, prereqs: Record<string, string[]> = PREQ): string[] {
  const out: string[] = [];
  const visit = (x: string): void => {
    for (const y of prereqs[x] ?? []) {
      visit(y);
      if (!out.includes(y)) out.push(y);
    }
  };
  visit(id);
  return out;
}

/**
 * Bài có được mở không: đã done → mở; chưa done → phải là bài đầu tiên
 * hoặc bài ngay trước đã done, và mọi bài tiền đề đã done.
 * (port từ unlocked() trong app.js, okPre dùng ancestors)
 */
export function isUnlocked(
  id: string,
  progress: ProgressState,
  prereqs: Record<string, string[]> = PREQ,
): boolean {
  if (progress.done[id] === 1) return true;
  const idx = ALL_IDS.indexOf(id);
  if (idx === -1) return false;
  if (idx > 0) {
    const prev = ALL_IDS[idx - 1];
    if (prev === undefined || progress.done[prev] !== 1) return false;
  }
  return ancestors(id, prereqs).every((r) => progress.done[r] === 1);
}
