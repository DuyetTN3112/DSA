// Chạy code Python trong trình duyệt bằng Skulpt 1.2.0.
// Lazy-load ở lần đầu dùng (967KB), mỗi lần chạy là namespace mới,
// vòng lặp vô hạn bị chặn bởi execLimit.
import type { SkulptApi, SkulptError } from './skulpt-types';
import { mapSkulptError } from './skulpt-errors';

export interface RunResult {
  ok: boolean;
  out: string;
  /** Lỗi đã dịch sang tiếng Việt (rỗng khi ok). */
  err: string;
  /** Tên loại lỗi gốc, vd "NameError" (rỗng khi ok). */
  errKind: string;
  /** Dòng lỗi trong code học viên (null khi không xác định). */
  line: number | null;
}

const EXEC_LIMIT_MS = 4000;

let sk: SkulptApi | null = null;
let loading: Promise<SkulptApi> | null = null;
let buffer = '';
// Hàng đợi các lần chạy: Skulpt dùng global chung nên không chạy song song.
let queue: Promise<void> = Promise.resolve();

function readGlobalSk(): SkulptApi | null {
  return globalThis.Sk ?? null;
}

async function loadSkulpt(): Promise<SkulptApi> {
  if (sk) return sk;
  if (!loading) {
    loading = (async (): Promise<SkulptApi> => {
      // Side-effect import: file IIFE gán Sk lên globalThis.
      await import('skulpt/dist/skulpt.min.js');
      await import('skulpt/dist/skulpt-stdlib.js');
      const api = readGlobalSk();
      if (!api) throw new Error('Không tải được trình chạy Python.');
      api.configure({
        output: (text: string) => {
          buffer += text;
        },
        read: (filename: string) => {
          const file = api.builtinFiles.files[filename];
          if (file === undefined) throw new Error(`File not found: '${filename}'`);
          return file;
        },
        execLimit: EXEC_LIMIT_MS,
      });
      return api;
    })();
  }
  sk = await loading;
  return sk;
}

async function runOnce(code: string): Promise<RunResult> {
  const api = await loadSkulpt();
  buffer = '';
  try {
    await api.misceval.asyncToPromise(() => api.importMainWithBody('<stdin>', false, code, true));
    return { ok: true, out: buffer, err: '', errKind: '', line: null };
  } catch (raw) {
    const mapped = mapSkulptError(raw as SkulptError, code);
    return { ok: false, out: buffer, err: mapped.message, errKind: mapped.kind, line: mapped.line };
  }
}

/** Chạy code Python, trả về stdout hoặc lỗi tiếng Việt. An toàn khi gọi dồn dập. */
export function runPython(code: string): Promise<RunResult> {
  const next = queue.then(() => runOnce(code));
  // Giữ chuỗi hàng đợi sống ngay cả khi lần chạy lỗi.
  queue = next.then(
    () => undefined,
    () => undefined,
  );
  return next;
}
