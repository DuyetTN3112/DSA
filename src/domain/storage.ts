// Storage abstraction: đọc/ghi ProgressState. Hiện tại là localStorage,
// sau này có thể thay bằng DB/API mà không sửa logic gọi.
// Key "dsa" giữ nguyên để tương thích dữ liệu bản vanilla JS cũ.

import type { LeitnerBox, LessonProgress, ProgressState, ProgressStorage } from './types';
import { createDefaultProgress } from './progress';

export const STORAGE_KEY = 'dsa';

/** JSON value đệ quy: đủ để validate dữ liệu đọc từ storage mà không cần unknown */
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };
type JsonObject = { [key: string]: JsonValue };

function isJsonObject(v: JsonValue): v is JsonObject {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Lấy field con là object; sai kiểu hoặc thiếu thì trả {} */
function childObject(parent: JsonObject, key: string): JsonObject {
  const v: JsonValue | undefined = parent[key];
  return v !== undefined && isJsonObject(v) ? v : {};
}

function toOne(v: JsonValue): 1 | undefined {
  return v === 1 ? 1 : undefined;
}

function toNumber(v: JsonValue): number | undefined {
  return typeof v === 'number' ? v : undefined;
}

/** Chuỗi ngày (YYYY-MM-DD) — dùng cho hc.seen / hc.last theo đúng spec cũ. */
function toDateString(v: JsonValue): string | undefined {
  return typeof v === 'string' ? v : undefined;
}

function toStringArray(v: JsonValue): string[] | undefined {
  if (!Array.isArray(v)) return undefined;
  if (!v.every((d): d is string => typeof d === 'string')) return undefined;
  return [...v];
}

function toNumberRecord(v: JsonValue): Record<string, number> | undefined {
  if (!isJsonObject(v)) return undefined;
  return recordOf(v, toNumber);
}

function toLessonProgress(v: JsonValue): LessonProgress | undefined {
  if (!isJsonObject(v)) return undefined;
  const p = v['p'];
  const f = v['f'];
  const last = v['last'];
  const miss = v['miss'];
  const days = v['days'];
  if (typeof p !== 'number' || typeof f !== 'number' || typeof last !== 'string') return undefined;
  if (miss === undefined || days === undefined) return undefined;
  const missRec = toNumberRecord(miss);
  const daysArr = toStringArray(days);
  if (missRec === undefined || daysArr === undefined) return undefined;
  const r: LessonProgress = { p, f, miss: missRec, last, days: daysArr };
  const asst = v['asst'];
  if (typeof asst === 'number') r.asst = asst;
  const lucky = v['lucky'];
  if (typeof lucky === 'number') r.lucky = lucky;
  const unk = v['unk'];
  if (typeof unk === 'number') r.unk = unk;
  const fk = v['fk'];
  if (fk !== undefined) {
    const fkRec = toNumberRecord(fk);
    if (fkRec !== undefined) r.fk = fkRec;
  }
  return r;
}

function toLeitnerBox(v: JsonValue): LeitnerBox | undefined {
  if (!isJsonObject(v)) return undefined;
  const box = v['box'];
  const due = v['due'];
  const n = v['n'];
  const lapse = v['lapse'];
  const cl = v['cl'];
  const ls = v['ls'];
  const seen = v['seen'];
  const validBox = box === 1 || box === 2 || box === 3 || box === 4 || box === 5;
  if (!validBox || typeof due !== 'string') return undefined;
  if (typeof n !== 'number' || typeof lapse !== 'number' || typeof cl !== 'number') return undefined;
  if (typeof ls !== 'string' || typeof seen !== 'string') return undefined;
  return { box, due, n, lapse, cl, ls, seen };
}

/** Dựng Record<string, T> từ JsonObject, chỉ giữ entry convert được */
function recordOf<T>(obj: JsonObject, convert: (v: JsonValue) => T | undefined): Record<string, T> {
  const out: Record<string, T> = {};
  for (const [k, v] of Object.entries(obj)) {
    const t = convert(v);
    if (t !== undefined) out[k] = t;
  }
  return out;
}

/** Chuẩn hóa dữ liệu đọc từ storage: thiếu/sai kiểu thì bỏ entry đó, giữ default */
function normalize(parsed: JsonValue): ProgressState {
  if (!isJsonObject(parsed)) return createDefaultProgress();
  const hc = childObject(parsed, 'hc');
  return {
    done: recordOf(childObject(parsed, 'done'), toOne),
    pr: recordOf(childObject(parsed, 'pr'), toLessonProgress),
    weak: recordOf(childObject(parsed, 'weak'), toNumber),
    shaky: recordOf(childObject(parsed, 'shaky'), toOne),
    hab: recordOf(childObject(parsed, 'hab'), toNumber),
    lt: recordOf(childObject(parsed, 'lt'), toLeitnerBox),
    hc: {
      seen: recordOf(childObject(hc, 'seen'), toDateString),
      fail: recordOf(childObject(hc, 'fail'), toNumber),
      ...(typeof hc['last'] === 'string' ? { last: hc['last'] } : {}),
    },
    g: recordOf(childObject(parsed, 'g'), (v): { n: number } | undefined => {
      if (!isJsonObject(v)) return undefined;
      const n = v['n'];
      return typeof n === 'number' ? { n } : undefined;
    }),
    u: recordOf(childObject(parsed, 'u'), toNumber),
  };
}

export class LocalProgressStorage implements ProgressStorage {
  load(): ProgressState {
    const fallback = createDefaultProgress();
    let raw: string | null = null;
    try {
      raw = globalThis.localStorage.getItem(STORAGE_KEY);
    } catch {
      // storage bị chặn (private mode...): dùng default, app vẫn chạy
      return fallback;
    }
    if (raw === null || raw === '') return fallback;
    try {
      const parsed = JSON.parse(raw) as JsonValue;
      return normalize(parsed);
    } catch {
      // JSON hỏng: dùng default, không crash app
      return fallback;
    }
  }

  save(state: ProgressState): void {
    try {
      globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // storage đầy hoặc bị chặn: bỏ qua lặng lẽ, tiến độ giữ trong RAM
    }
  }
}
