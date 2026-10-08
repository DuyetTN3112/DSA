import { describe, expect, it } from 'vitest';
import {
  createDefaultProgress,
  markLessonDone,
  recordAssistedPass,
  recordAttempt,
  recordFail,
  recordLucky,
  recordStuckKind,
} from './progress';

const T1 = '2026-10-08';
const T2 = '2026-10-09';

describe('createDefaultProgress', () => {
  it('trả về state rỗng đúng shape', () => {
    expect(createDefaultProgress()).toEqual({
      done: {},
      pr: {},
      weak: {},
      shaky: {},
      hab: {},
      lt: {},
      hc: { seen: {}, fail: {} },
      g: {},
      u: {},
    });
  });
});

describe('recordAttempt', () => {
  it('pass: p++, last=today, cộng ngày vào days', () => {
    const s = recordAttempt(createDefaultProgress(), 'k1', { passed: true, today: T1 });
    const r = s.pr['k1'];
    expect(r?.p).toBe(1);
    expect(r?.f).toBe(0);
    expect(r?.last).toBe(T1);
    expect(r?.days).toEqual([T1]);
  });

  it('pass 2 lần cùng ngày: days chỉ có 1 mốc', () => {
    let s = createDefaultProgress();
    s = recordAttempt(s, 'k1', { passed: true, today: T1 });
    s = recordAttempt(s, 'k1', { passed: true, today: T1 });
    expect(s.pr['k1']?.p).toBe(2);
    expect(s.pr['k1']?.days).toEqual([T1]);
  });

  it('pass 2 ngày khác nhau: days có 2 mốc (điều kiện "Vững")', () => {
    let s = createDefaultProgress();
    s = recordAttempt(s, 'k1', { passed: true, today: T1 });
    s = recordAttempt(s, 'k1', { passed: true, today: T2 });
    expect(s.pr['k1']?.days).toEqual([T1, T2]);
  });

  it('fail: f++, miss theo dạng câu, không cộng days', () => {
    const s = recordAttempt(createDefaultProgress(), 'k1', {
      passed: false,
      missedShapes: ['flip', 'flip', 'new'],
      today: T1,
    });
    const r = s.pr['k1'];
    expect(r?.f).toBe(1);
    expect(r?.miss).toEqual({ flip: 2, new: 1 });
    expect(r?.days).toEqual([]);
  });

  it('pass nhưng weakEvidence: p++ nhưng KHÔNG cộng days', () => {
    const s = recordAttempt(createDefaultProgress(), 'k1', { passed: true, weakEvidence: true, today: T1 });
    expect(s.pr['k1']?.p).toBe(1);
    expect(s.pr['k1']?.days).toEqual([]);
  });

  it('không mutate state gốc (immutable)', () => {
    const before = createDefaultProgress();
    recordAttempt(before, 'k1', { passed: true, today: T1 });
    expect(before.pr['k1']).toBeUndefined();
  });
});

describe('recordAssistedPass (evidence yếu)', () => {
  it('asst++, KHÔNG cộng ngày vào days, Leitner về hộp 1 + due ngày mai', () => {
    const s = recordAssistedPass(createDefaultProgress(), 'k3', T1);
    const r = s.pr['k3'];
    expect(r?.p).toBe(1);
    expect(r?.asst).toBe(1);
    expect(r?.days).toEqual([]);
    expect(s.lt['k3']?.box).toBe(1);
    expect(s.lt['k3']?.due).toBe(T2);
  });

  it('gọi 2 lần: asst=2, vẫn không có ngày nào trong days', () => {
    let s = createDefaultProgress();
    s = recordAssistedPass(s, 'k3', T1);
    s = recordAssistedPass(s, 'k3', T2);
    expect(s.pr['k3']?.asst).toBe(2);
    expect(s.pr['k3']?.days).toEqual([]);
  });

  it('giữ nguyên các field Leitner khác (n, lapse...) khi reset', () => {
    let s = createDefaultProgress();
    s = { ...s, lt: { k3: { box: 3, due: '2026-11-01', n: 5, lapse: 1, cl: 0, ls: 'flip', seen: T1 } } };
    s = recordAssistedPass(s, 'k3', T1);
    expect(s.lt['k3']?.box).toBe(1);
    expect(s.lt['k3']?.due).toBe(T2);
    expect(s.lt['k3']?.n).toBe(5);
    expect(s.lt['k3']?.ls).toBe('flip');
  });
});

describe('recordLucky', () => {
  it('lucky++ và persist, không động vào days', () => {
    let s = createDefaultProgress();
    s = recordLucky(s, 'k3', T1);
    s = recordLucky(s, 'k3', T1);
    expect(s.pr['k3']?.lucky).toBe(2);
    expect(s.pr['k3']?.days).toEqual([]);
    expect(s.pr['k3']?.p).toBe(0);
  });
});

describe('recordStuckKind', () => {
  it('đếm loại vướng mắc theo kind', () => {
    let s = createDefaultProgress();
    s = recordStuckKind(s, 'k3', 'de', T1);
    s = recordStuckKind(s, 'k3', 'de', T1);
    s = recordStuckKind(s, 'k3', 'concept', T1);
    expect(s.pr['k3']?.fk).toEqual({ de: 2, concept: 1 });
  });
});

describe('markLessonDone / recordFail', () => {
  it('markLessonDone: done=1 và xóa cờ shaky', () => {
    let s = createDefaultProgress();
    s = { ...s, shaky: { k1: 1 as const } };
    s = markLessonDone(s, 'k1');
    expect(s.done['k1']).toBe(1);
    expect(s.shaky['k1']).toBeUndefined();
  });

  it('recordFail: rút dấu done, weak++', () => {
    let s = markLessonDone(createDefaultProgress(), 'k1');
    s = recordFail(s, 'k1');
    expect(s.done['k1']).toBeUndefined();
    expect(s.weak['k1']).toBe(1);
  });
});
