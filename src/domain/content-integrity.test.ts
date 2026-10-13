// Test toàn vẹn nội dung: chặn các lỗi "lặng lẽ" mà test đơn lẻ không bắt được.
// (Lộ trình kẹt vĩnh viễn, tiền đề vòng, lựa chọn trùng nhau, đáp án ngoài phạm vi...)
import { describe, expect, it } from 'vitest';
import { ALL_IDS, PREQ, isUnlocked } from './curriculum';
import { createDefaultProgress } from './progress';
import { ALL_LESSONS } from './lessons';
import { PROBE_BANKS } from './probe';
import type { ProbeShape } from './types';

const SHAPES: ProbeShape[] = ['same', 'flip', 'new', 'verdict', 'read'];

describe('lộ trình học không bị kẹt', () => {
  it('học đúng thứ tự lộ trình thì mở khoá được TOÀN BỘ bài (không deadlock)', () => {
    const p = createDefaultProgress();
    for (let i = 0; i < ALL_IDS.length + 5; i++) {
      const next = ALL_IDS.find((id) => p.done[id] !== 1 && isUnlocked(id, p));
      if (!next) break;
      p.done[next] = 1;
    }
    const stuck = ALL_IDS.filter((id) => p.done[id] !== 1);
    expect(stuck, `bài không bao giờ mở khoá: ${stuck.join(',')}`).toEqual([]);
  });

  it('mọi tiền đề nằm TRƯỚC bài phụ thuộc trong lộ trình (không tham chiếu tương lai)', () => {
    for (const [id, reqs] of Object.entries(PREQ)) {
      for (const r of reqs) {
        expect(ALL_IDS.indexOf(r), `${id} cần ${r} nhưng ${r} đứng sau`).toBeLessThan(
          ALL_IDS.indexOf(id),
        );
      }
    }
  });

  it('đồ thị tiền đề không có vòng', () => {
    const state = new Map<string, 1 | 2>();
    const visit = (id: string, path: string[]): void => {
      if (state.get(id) === 2) return;
      expect(state.get(id), `vòng: ${[...path, id].join(' -> ')}`).not.toBe(1);
      state.set(id, 1);
      for (const r of PREQ[id] ?? []) visit(r, [...path, id]);
      state.set(id, 2);
    };
    for (const id of Object.keys(PREQ)) visit(id, []);
  });
});

describe('bài học: lựa chọn hợp lệ', () => {
  it('mỗi câu choice: đáp án nằm trong phạm vi và các lựa chọn không trùng nhau', () => {
    for (const l of ALL_LESSONS) {
      l.steps.forEach((s, i) => {
        if (s.k !== 'choice') return;
        expect(s.a, `${l.id}[${i}] đáp án ngoài phạm vi`).toBeLessThan(s.o.length);
        expect(new Set(s.o).size, `${l.id}[${i}] có lựa chọn trùng: ${s.o.join(' | ')}`).toBe(
          s.o.length,
        );
      });
    }
  });
});

describe('probe: câu sinh ngẫu nhiên không trùng lựa chọn', () => {
  it('chạy mỗi generator 200 lần: options không trùng, đáp án nằm trong phạm vi', () => {
    for (const [id, bank] of Object.entries(PROBE_BANKS)) {
      for (const shape of SHAPES) {
        for (let i = 0; i < 200; i++) {
          const q = bank[shape]();
          if (!q.o) continue;
          expect(new Set(q.o).size, `${id}.${shape}: "${q.q}" -> ${q.o.join(' | ')}`).toBe(
            q.o.length,
          );
          expect(q.a, `${id}.${shape}: đáp án ngoài phạm vi`).toBeLessThan(q.o.length);
        }
      }
    }
  });
});
