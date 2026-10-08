import { describe, expect, it } from 'vitest';
import { addDays, defaultLeitnerBox, isDue, nextBox, nextDue, today, tomorrow } from './leitner';

describe('nextBox', () => {
  it('đúng → lên 1 hộp', () => {
    expect(nextBox(true, 1)).toBe(2);
    expect(nextBox(true, 3)).toBe(4);
  });

  it('đúng ở hộp 5 → vẫn hộp 5 (trần)', () => {
    expect(nextBox(true, 5)).toBe(5);
  });

  it('sai → rớt về hộp 1 kể cả đang ở hộp cao', () => {
    expect(nextBox(false, 4)).toBe(1);
    expect(nextBox(false, 1)).toBe(1);
  });
});

describe('addDays / tomorrow', () => {
  it('cộng ngày thường', () => {
    expect(addDays('2026-10-08', 1)).toBe('2026-10-09');
    expect(addDays('2026-10-08', 30)).toBe('2026-11-07');
  });

  it('qua tháng', () => {
    expect(tomorrow('2026-01-31')).toBe('2026-02-01');
  });

  it('qua năm', () => {
    expect(tomorrow('2026-12-31')).toBe('2027-01-01');
  });

  it('năm nhuận: 2024-02-28 + 1 = 2024-02-29', () => {
    expect(tomorrow('2024-02-28')).toBe('2024-02-29');
  });

  it('không nhuận: 2026-02-28 + 1 = 2026-03-01', () => {
    expect(tomorrow('2026-02-28')).toBe('2026-03-01');
  });
});

describe('nextDue', () => {
  it('khoảng ôn: hộp 1→1 ngày, 2→3, 3→7, 4→14, 5→30', () => {
    const t = '2026-10-08';
    expect(nextDue(1, t)).toBe('2026-10-09');
    expect(nextDue(2, t)).toBe('2026-10-11');
    expect(nextDue(3, t)).toBe('2026-10-15');
    expect(nextDue(4, t)).toBe('2026-10-22');
    expect(nextDue(5, t)).toBe('2026-11-07');
  });
});

describe('isDue', () => {
  it('due <= today → đến hạn', () => {
    expect(isDue({ ...defaultLeitnerBox(), due: '2026-10-08' }, '2026-10-08')).toBe(true);
    expect(isDue({ ...defaultLeitnerBox(), due: '2026-10-01' }, '2026-10-08')).toBe(true);
  });

  it('due > today → chưa đến hạn', () => {
    expect(isDue({ ...defaultLeitnerBox(), due: '2026-10-09' }, '2026-10-08')).toBe(false);
  });
});

describe('today', () => {
  it('trả về định dạng YYYY-MM-DD (UTC)', () => {
    expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('khớp với new Date().toISOString như code cũ', () => {
    expect(today()).toBe(new Date().toISOString().slice(0, 10));
  });
});

describe('defaultLeitnerBox', () => {
  it('hộp 1, các đếm bằng 0', () => {
    expect(defaultLeitnerBox()).toEqual({ box: 1, due: '', n: 0, lapse: 0, cl: 0, ls: '', seen: '' });
  });
});
