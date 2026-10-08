// Tiến độ học: pure functions cập nhật ProgressState (immutable — trả state mới).
// Port logic evidence từ probe.js (rec, lucky, assisted pass), không DOM.

import type { LessonProgress, ProgressState, StuckKind } from './types';
import { defaultLeitnerBox, tomorrow } from './leitner';

export function createDefaultProgress(): ProgressState {
  return { done: {}, pr: {}, weak: {}, shaky: {}, hab: {}, lt: {}, hc: { seen: {}, fail: {} }, g: {}, u: {} };
}

function blankLessonProgress(today: string): LessonProgress {
  return { p: 0, f: 0, miss: {}, last: today, days: [] };
}

function getProgress(state: ProgressState, id: string, today: string): LessonProgress {
  const r = state.pr[id];
  return r === undefined ? blankLessonProgress(today) : { ...r, miss: { ...r.miss }, days: [...r.days] };
}

/** Bản copy của record thiếu key cho trước (thay cho delete dynamic key) */
function omitKey<T>(obj: Record<string, T>, key: string): Record<string, T> {
  return Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key));
}

export interface AttemptInput {
  passed: boolean;
  /** pass nhưng evidence yếu (nhờ sổ tay...): không cộng ngày vào days */
  weakEvidence?: boolean;
  /** các dạng câu bị sai, để đếm vào miss */
  missedShapes?: string[];
  today: string;
}

/**
 * Ghi nhận một lần kiểm tra: p/f++, miss++, last=today,
 * qua "sạch" (không weakEvidence) thì cộng ngày vào days — mốc "Vững".
 * (port rec(ok, weakEv) trong probe.js)
 */
export function recordAttempt(state: ProgressState, id: string, input: AttemptInput): ProgressState {
  const r = getProgress(state, id, input.today);
  if (input.passed) {
    r.p += 1;
  } else {
    r.f += 1;
    for (const s of input.missedShapes ?? []) r.miss[s] = (r.miss[s] ?? 0) + 1;
  }
  r.last = input.today;
  if (input.passed && !input.weakEvidence && !r.days.includes(input.today)) r.days.push(input.today);
  return { ...state, pr: { ...state.pr, [id]: r } };
}

/** Đánh dấu bài đã xong kiểm tra hiểu thật; xóa cờ "cần chứng minh lại" */
export function markLessonDone(state: ProgressState, id: string): ProgressState {
  return { ...state, done: { ...state.done, [id]: 1 }, shaky: omitKey(state.shaky, id) };
}

/**
 * Qua nhờ giở sổ tay (assisted pass): asst++, KHÔNG cộng ngày vào days
 * (không tính như "Vững"), hạ Leitner về hộp 1 và hẹn ôn ngày mai.
 * (port nhánh weakEv trong probe.js end())
 */
export function recordAssistedPass(state: ProgressState, id: string, today: string): ProgressState {
  const after = recordAttempt(state, id, { passed: true, weakEvidence: true, today });
  const r = getProgress(after, id, today);
  r.asst = (r.asst ?? 0) + 1;
  const box = after.lt[id] ?? defaultLeitnerBox();
  const resetBox = { ...box, box: 1 as const, due: tomorrow(today) };
  return {
    ...after,
    pr: { ...after.pr, [id]: r },
    lt: { ...after.lt, [id]: resetBox },
  };
}

/** Đoán đúng (chọn "Đoán" mà trả lời đúng): ghi nhận lucky, persist riêng, không tính như hiểu */
export function recordLucky(state: ProgressState, id: string, today: string): ProgressState {
  const r = getProgress(state, id, today);
  r.lucky = (r.lucky ?? 0) + 1;
  return { ...state, pr: { ...state.pr, [id]: r } };
}

/** Ghi nhận loại vướng mắc khi bấm "Chưa hiểu" (phân loại 6 loại) */
export function recordStuckKind(state: ProgressState, id: string, kind: StuckKind, today: string): ProgressState {
  const r = getProgress(state, id, today);
  const fk = { ...(r.fk ?? {}) };
  fk[kind] = (fk[kind] ?? 0) + 1;
  return { ...state, pr: { ...state.pr, [id]: { ...r, fk } } };
}

/** Trượt kiểm tra: rút dấu xong, tăng đếm học lại */
export function recordFail(state: ProgressState, id: string): ProgressState {
  return { ...state, done: omitKey(state.done, id), weak: { ...state.weak, [id]: (state.weak[id] ?? 0) + 1 } };
}
