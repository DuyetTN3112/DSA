// Leitner spaced repetition: pure functions, ngày ở dạng YYYY-MM-DD (UTC).
// Port từ review.js (grade, addD, DAYS) và probe.js (tmr).
// Luật: today() là biên impure DUY NHẤT được phép đọc đồng hồ;
// mọi logic khác nhận today: string để test được.

import type { LeitnerBox } from './types';

export type BoxLevel = 1 | 2 | 3 | 4 | 5;

/** Khoảng ngày ôn lại cho từng hộp: hộp 1→1 ngày, 2→3, 3→7, 4→14, 5→30 */
const INTERVAL_DAYS: readonly [number, number, number, number, number] = [1, 3, 7, 14, 30] as const;

export function defaultLeitnerBox(): LeitnerBox {
  return { box: 1, due: '', n: 0, lapse: 0, cl: 0, ls: '', seen: '' };
}

/** Hôm nay (UTC, YYYY-MM-DD). Biên impure duy nhất của domain. */
export function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Cộng n ngày vào chuỗi ngày YYYY-MM-DD (UTC), trả về YYYY-MM-DD */
export function addDays(dateStr: string, n: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Ngày mai của một ngày cho trước (port tmr() nhưng pure) */
export function tomorrow(dateStr: string): string {
  return addDays(dateStr, 1);
}

/**
 * Hộp tiếp theo sau một lần ôn: đúng → lên 1 hộp (tối đa 5),
 * sai → rớt về hộp 1. (port grade() trong review.js)
 */
export function nextBox(pass: boolean, current: BoxLevel): BoxLevel {
  if (!pass) return 1;
  const up = current + 1;
  return (up > 5 ? 5 : up) as BoxLevel;
}

/** Ngày đến hạn ôn tiếp sau khi ở hộp `box` vào ngày `today` */
export function nextDue(box: BoxLevel, todayStr: string): string {
  const interval = INTERVAL_DAYS[box - 1] ?? 1;
  return addDays(todayStr, interval);
}

/** Bài có đến hạn ôn hôm nay không (due <= today) */
export function isDue(box: LeitnerBox, todayStr: string): boolean {
  return box.due <= todayStr;
}
