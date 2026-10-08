// Ports: các cổng DI mà flows cần. Agent domain sẽ cung cấp bản thật;
// component agent chỉ việc truyền vào constructor của flow.
// Không any/unknown — mọi port đều có type cụ thể.
import type {
  Lesson,
  LessonProgress,
  LeitnerBox,
  ProbeBank,
  ProgressState,
  ProgressStorage,
  Stage,
  StuckKind,
  TinyQuestion,
} from '../domain/types';

/** Dữ liệu domain do agent khác cung cấp (LESSON_MAP, PROBE_BANKS, TINY, tinyFor...). */
export interface DomainPorts {
  /** Toàn bộ bài học theo id (thay cho global LES). */
  lessons: Record<string, Lesson>;
  /** Ngân hàng câu hỏi probe theo id (thay cho global PRB). */
  probeBanks: Record<string, ProbeBank>;
  /** Ngân hàng tiny-check: tên bank -> hàm sinh danh sách câu hỏi. */
  tinyBanks: Record<string, () => TinyQuestion[]>;
  /** Bank tiny-check cho bài id (null = không có). */
  tinyFor: (id: string, stuckKind?: StuckKind) => string | null;
  /** Lộ trình các giai đoạn (thay cho global STAGES). */
  stages: Stage[];
  /** Đồ thị tiền đề: id -> các id nền trực tiếp (thay cho global PREQ). */
  preq: Record<string, string[]>;
}

/** Cung cấp ngày hiện tại — inject được để test (thay cho window.__fakeToday). */
export interface DateProvider {
  /** 'YYYY-MM-DD' hôm nay (UTC, khớp toISOString của code cũ). */
  today(): string;
  /** 'YYYY-MM-DD' ngày mai. */
  tomorrow(): string;
}

function isoDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** DateProvider dùng giờ hệ thống. */
export const systemDates: DateProvider = {
  today(): string {
    return isoDay(new Date());
  },
  tomorrow(): string {
    return isoDay(new Date(Date.now() + 86400000));
  },
};

/** Cộng n ngày vào chuỗi 'YYYY-MM-DD'. */
export function addDays(day: string, n: number): string {
  const t = new Date(day + 'T00:00:00Z');
  t.setUTCDate(t.getUTCDate() + n);
  return isoDay(t);
}

function blankLessonProgress(): LessonProgress {
  return { p: 0, f: 0, miss: {}, last: '', days: [] };
}

function blankLeitner(due: string): LeitnerBox {
  return { box: 1, due, n: 0, lapse: 0, cl: 0, ls: '', seen: '' };
}

/**
 * Chuẩn hóa state đọc từ storage: storage có thể trả về object thiếu field
 * (dữ liệu cũ). Luôn trả về ProgressState đầy đủ, không throw.
 */
export function normalizeProgress(raw: Partial<ProgressState>): ProgressState {
  return {
    done: raw.done ?? {},
    pr: raw.pr ?? {},
    weak: raw.weak ?? {},
    shaky: raw.shaky ?? {},
    hab: raw.hab ?? {},
    lt: raw.lt ?? {},
    hc: raw.hc ?? { seen: {}, fail: {} },
    g: raw.g ?? {},
    u: raw.u ?? {},
  };
}

/** Đảm bảo có LessonProgress cho id (tạo mới nếu chưa có). */
export function ensureLessonProgress(
  state: ProgressState,
  id: string,
): LessonProgress {
  const existing = state.pr[id];
  const r = existing ?? blankLessonProgress();
  state.pr[id] = r;
  return normalizeLessonProgress(r);
}

/**
 * Chuẩn hóa một LessonProgress đọc từ storage: dữ liệu cũ có thể thiếu
 * các field lồng nhau (miss/days). Dùng Partial để linter không báo
 * no-unnecessary-condition.
 */
export function normalizeLessonProgress(r: LessonProgress): LessonProgress {
  const p = r as Partial<LessonProgress>;
  if (!p.miss) p.miss = {};
  if (!p.days) p.days = [];
  return r;
}

/**
 * Xóa key khỏi record mà không dùng `delete` động
 * (tránh @typescript-eslint/no-dynamic-delete).
 */
export function dropKey<T>(
  record: Record<string, T>,
  key: string,
): Record<string, T> {
  const rest: Record<string, T> = {};
  for (const k of Object.keys(record)) {
    if (k !== key) rest[k] = record[k] as T;
  }
  return rest;
}

/** Hàm rỗng dùng làm callback mặc định. */
export const noop: () => void = () => undefined;

/** Đảm bảo có LeitnerBox cho id (tạo mới nếu chưa có). */
export function ensureLeitnerBox(
  state: ProgressState,
  id: string,
  dates: DateProvider,
): LeitnerBox {
  const existing = state.lt[id];
  if (existing) return existing;
  const last = state.pr[id]?.last ?? dates.today();
  const created = blankLeitner(addDays(last, 1));
  state.lt[id] = created;
  return created;
}

/**
 * Kiểm tra câu tự giải thích có "thật" không (port từ okR):
 * đủ dài, đủ từ khác nhau, không lặp ký tự.
 */
export function isRealExplanation(v: string): boolean {
  const t = v.trim();
  const words = new Set(
    t
      .toLowerCase()
      .split(/\s+/)
      .filter((x) => x.length >= 2 && /\p{L}/u.test(x)),
  );
  return (
    t.length >= 15 &&
    words.size >= 4 &&
    new Set(t.toLowerCase()).size >= 8 &&
    !/(.)\1{3,}/.test(t)
  );
}

/** Xáo trộn mảng (Fisher-Yates), không mutate mảng gốc. */
export function shuffle<T>(arr: readonly T[]): T[] {
  const c = arr.slice();
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = c[i];
    const b = c[j];
    if (a === undefined || b === undefined) continue;
    c[i] = b;
    c[j] = a;
  }
  return c;
}

/** Lấy phần tử an toàn (trả undefined thay vì throw khi out-of-range). */
export function at<T>(arr: readonly T[], i: number): T | undefined {
  return i >= 0 && i < arr.length ? arr[i] : undefined;
}

export type { ProgressStorage };
