import { describe, expect, it } from 'vitest';
import { ALL_IDS, PREQ, STAGES, ancestors, isUnlocked } from './curriculum';
import { createDefaultProgress, markLessonDone } from './progress';

describe('STAGES (bản cuối, port từ main:app.js)', () => {
  it('có 14 stage', () => {
    expect(STAGES).toHaveLength(14);
  });

  it('stage đầu là mẫu giáo, stage cuối là mini project 2', () => {
    const first = STAGES[0];
    const last = STAGES[STAGES.length - 1];
    expect(first?.n).toContain('Mẫu giáo');
    expect(first?.L[0]).toBe('k1');
    expect(last?.L).toEqual(['w10']);
  });

  it('mọi stage đều có tên, mô tả và danh sách bài', () => {
    for (const s of STAGES) {
      expect(s.n.length).toBeGreaterThan(0);
      expect(s.d.length).toBeGreaterThan(0);
      expect(s.L.length).toBeGreaterThan(0);
    }
  });
});

describe('ALL_IDS', () => {
  it('đủ 82 bài theo đúng thứ tự lộ trình (gồm rd1 sau k3)', () => {
    expect(ALL_IDS).toHaveLength(82);
    expect(ALL_IDS[0]).toBe('k1');
    expect(ALL_IDS[ALL_IDS.length - 1]).toBe('w10');
    expect(ALL_IDS.indexOf('rd1')).toBe(ALL_IDS.indexOf('k3') + 1);
  });

  it('là flatten của STAGES theo thứ tự', () => {
    expect(ALL_IDS).toEqual(STAGES.flatMap((s) => s.L));
  });

  it('không trùng id', () => {
    expect(new Set(ALL_IDS).size).toBe(ALL_IDS.length);
  });
});

describe('PREQ', () => {
  it('mọi bài tiền đề đều tồn tại trong ALL_IDS', () => {
    for (const [id, reqs] of Object.entries(PREQ)) {
      expect(ALL_IDS, id).toContain(id);
      for (const r of reqs) expect(ALL_IDS, `${id} -> ${r}`).toContain(r);
    }
  });
});

describe('ancestors', () => {
  it('trả về tiền đề trực tiếp và gián tiếp', () => {
    // a3 -> a2 -> l1 -> k3 -> k1
    expect(ancestors('a3')).toEqual(expect.arrayContaining(['a2', 'l1', 'k3', 'k1']));
  });

  it('không trùng lặp', () => {
    const a = ancestors('b6');
    expect(new Set(a).size).toBe(a.length);
  });

  it('bài không có tiền đề trả về mảng rỗng', () => {
    expect(ancestors('k1')).toEqual([]);
  });
});

describe('isUnlocked', () => {
  it('bài đầu tiên luôn mở khi chưa học gì', () => {
    expect(isUnlocked('k1', createDefaultProgress())).toBe(true);
  });

  it('bài thứ hai khóa khi bài đầu chưa xong', () => {
    expect(isUnlocked('k2', createDefaultProgress())).toBe(false);
  });

  it('bài thứ hai mở khi bài trước đã xong', () => {
    const s = markLessonDone(createDefaultProgress(), 'k1');
    expect(isUnlocked('k2', s)).toBe(true);
  });

  it('bài đã done luôn mở', () => {
    const s = markLessonDone(createDefaultProgress(), 'l3');
    expect(isUnlocked('l3', s)).toBe(true);
  });

  it('id lạ trả về false', () => {
    expect(isUnlocked('khong-ton-tai', createDefaultProgress())).toBe(false);
  });

  it('tiền đề chưa xong thì khóa dù bài trước đã xong (l3 cần sm)', () => {
    const idxL3 = ALL_IDS.indexOf('l3');
    const before = ALL_IDS.slice(0, idxL3).filter((id) => id !== 'sm');
    let s = createDefaultProgress();
    for (const id of before) s = markLessonDone(s, id);
    expect(isUnlocked('l3', s)).toBe(false); // bài trước (l2) đã xong nhưng thiếu sm
    s = markLessonDone(s, 'sm');
    expect(isUnlocked('l3', s)).toBe(true);
  });
});
