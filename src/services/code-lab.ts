// Logic TDD thuần cho code-lab (không DOM, không Skulpt).
// Port từ app.js vanilla: runTests / runGuard / runCode / hid / guard*.

export interface CodeLabData {
  fn: string;
  ref: string;
  hid: [string, string][];
  errs: [string, string][];
  cs: string;
  ts: string;
}

/** Validate test của học viên. Trả về lỗi tiếng Việt, null nếu đạt. */
export function validateTests(tests: string): string | null {
  const asserts = tests.split('\n').filter((l) => /^assert /.test(l.trim()));
  if (asserts.length < 3) {
    return 'Cần ít nhất 3 dòng assert (bỏ dấu # đầu dòng và viết thêm).';
  }
  if (!/\[\]|None/.test(tests)) {
    return 'Chưa có test ca biên (danh sách rỗng hoặc đầu vào None). Dân chuyên nghiệp luôn test biên.';
  }
  if (/___/.test(tests)) {
    return 'Còn chỗ ___ chưa điền. Hãy thay bằng giá trị bạn nghĩ là đúng.';
  }
  return null;
}

/** Code chạy test của học viên với lời giải chuẩn (phải qua). */
export function buildRefRun(ref: string, tests: string): string {
  return ref + '\n' + tests;
}

/** Code chạy test với hàm rỗng (phải ĐỎ — test phải bắt được). */
export function buildEmptyRun(fn: string, tests: string): string {
  return `def ${fn}(*a):\n    return None\n` + tests;
}

/** Dựng code test ẩn: chạy code học viên với các ca hid + (mode err) errs. */
export function buildHiddenTests(
  userCode: string,
  hid: [string, string][],
  errs: [string, string][],
  mode: string,
): string {
  let s = userCode + '\n';
  for (const [c, e] of hid) {
    s +=
      `try:\n    r = ${c}\n` +
      `    if r != ${e}:\n        print("DO: ${c} tra ve " + str(r) + ", can ${e}")\n` +
      `except Exception as e:\n    print("DO: ${c} bi crash " + type(e).__name__)\n`;
  }
  if (mode === 'err') {
    for (const [c, x] of errs) {
      s +=
        `try:\n    ${c}\n    print("DO: ${c} phai raise ${x}")\n` +
        `except ${x}:\n    pass\n` +
        `except Exception as e:\n    print("DO: ${c} raise sai loai: " + type(e).__name__ + ", can ${x}")\n`;
    }
  }
  return s;
}

// --- Guard helpers (port gscan/guardRef/guardStart/mergeCore/errChk) ---

function gsplit(c: string): string[] {
  return c.replace(/\s+$/, '').split('\n');
}

function isGuardAt(lines: string[], j: number): boolean {
  return /^ {4}if /.test(lines[j] ?? '') && /^ {8}raise/.test(lines[j + 1] ?? '');
}

/** Tìm dòng kết thúc phần hàng rào trong ref (bỏ qua comment). */
function gscan(lines: string[]): number {
  let i = 1;
  for (;;) {
    let j = i;
    while (j < lines.length && /^\s*#/.test(lines[j] ?? '')) j++;
    if (isGuardAt(lines, j)) {
      i = j + 2;
      while (i < lines.length && /^ {8}/.test(lines[i] ?? '')) i++;
    } else {
      return i;
    }
  }
}

/** Lấy phần hàng rào từ ref chuẩn + stub return None. */
export function guardRef(ref: string): string {
  const lines = gsplit(ref);
  return lines.slice(0, gscan(lines)).join('\n') + '\n    return None\n';
}

/** Code khởi đầu cho bước guard: khung hàm + comment hướng dẫn. */
export function guardStart(cs: string): string {
  const first = cs.split('\n')[0] ?? '';
  return first + '\n    # Hàng rào: chặn đầu vào xấu bằng raise đúng loại lỗi. CHƯA giải đề.\n    pass\n';
}

/** Gộp hàng rào học viên viết với phần thân từ cs (bỏ pass/return None thừa). */
export function mergeCore(userCode: string, cs: string): string {
  const a = gsplit(userCode);
  while (a.length > 1 && /^\s*(pass|return None)\s*$|^\s*#/.test(a[a.length - 1] ?? '')) {
    a.pop();
  }
  const c = gsplit(cs);
  return a.join('\n') + '\n' + c.slice(gscan(c)).join('\n') + '\n';
}

/** Dựng code kiểm tra hàng rào học viên với các ca errs[idx]. */
export function errChk(errs: [string, string][], idx: number[]): string {
  let s = '';
  for (const i of idx) {
    const pair = errs[i];
    if (!pair) continue;
    const [c, x] = pair;
    s +=
      `try:\n    ${c}\n    print("DO: ${c} phai raise ${x}")\n` +
      `except ${x}:\n    pass\n` +
      `except Exception as e:\n    print("DO: ${c} raise sai loai: " + type(e).__name__ + ", can ${x}")\n`;
  }
  return s;
}

/** Dựng code dò: chạy ref-guard với từng ca errs, in G|<i> nếu ref raise đúng. */
export function buildGuardProbe(ref: string, errs: [string, string][]): string {
  let s = guardRef(ref) + '\n';
  errs.forEach(([c, x], i) => {
    s += `try:\n    ${c}\nexcept ${x}:\n    print("G|${i}")\nexcept Exception:\n    pass\n`;
  });
  return s;
}

/** Đọc các dòng G|<i> từ output thành danh sách index. */
export function parseGuardHits(out: string): number[] {
  return out
    .split('\n')
    .filter((l) => l.startsWith('G|'))
    .map((l) => Number(l.slice(2)))
    .filter((n) => Number.isInteger(n));
}
