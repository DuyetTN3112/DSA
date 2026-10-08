import { describe, expect, it } from 'vitest';
import { runPython } from './python-runner';

describe('python-runner (Skulpt)', () => {
  it('chạy print cơ bản', async () => {
    const r = await runPython('print("xin chao")\nprint(1 + 2)');
    expect(r.ok).toBe(true);
    expect(r.out).toBe('xin chao\n3\n');
  });

  it('f-string chạy được', async () => {
    const r = await runPython('name = "An"\nprint(f"Chao {name}, {2 + 3}")');
    expect(r.ok).toBe(true);
    expect(r.out).toContain('Chao An, 5');
  });

  it('NameError map sang tiếng Việt', async () => {
    const r = await runPython('print(x)');
    expect(r.ok).toBe(false);
    expect(r.errKind).toBe('NameError');
    expect(r.err).toContain('x');
    expect(r.line).toBe(1);
  });

  it('thiếu dấu hai chấm được gợi ý', async () => {
    const r = await runPython('for i in range(3)\n    print(i)');
    expect(r.ok).toBe(false);
    expect(r.err).toContain('dấu hai chấm');
  });

  it('vòng lặp vô hạn bị chặn', async () => {
    const r = await runPython('while True:\n    pass');
    expect(r.ok).toBe(false);
    expect(r.errKind).toBe('TimeLimitError');
    expect(r.err).toContain('vòng lặp');
  }, 15000);

  it('hai lần chạy không rò rỉ biến', async () => {
    await runPython('bi_mat = 42');
    const r = await runPython('print(bi_mat)');
    expect(r.ok).toBe(false);
    expect(r.errKind).toBe('NameError');
  });
});
