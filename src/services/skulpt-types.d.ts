// Type tối thiểu cho Skulpt 1.2.0 (không có @types/skulpt).
// Chỉ khai báo đúng những gì python-runner dùng — không any/unknown.

export interface SkulptTracebackFrame {
  lineno: number;
  colno?: number;
  filename: string;
}

export interface SkulptError extends Error {
  tp$name: string;
  tp$str(): { v: string };
  traceback?: SkulptTracebackFrame[];
}

export interface SkulptConfigureOptions {
  output: (text: string) => void;
  read: (filename: string) => string;
  execLimit?: number;
}

/** Đối tượng suspension Skulpt trả về — chỉ dùng nội bộ, không cần chi tiết. */
export interface SkulptSuspension {
  readonly __skulptSuspension: unique symbol;
}

export interface SkulptApi {
  configure(options: SkulptConfigureOptions): void;
  misceval: {
    asyncToPromise(fn: () => SkulptSuspension): Promise<SkulptSuspension>;
  };
  importMainWithBody(
    name: string,
    dumpJs: boolean,
    code: string,
    canSuspend: boolean,
  ): SkulptSuspension;
  builtinFiles: {
    files: Record<string, string>;
  };
}

declare global {
  // Skulpt IIFE gán Sk lên globalThis khi load.
  var Sk: SkulptApi | undefined;
}
