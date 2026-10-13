// @vitest-environment jsdom
// Ở bước hỏi "bạn chắc đến mức nào?" người học phải THẤY câu hỏi trước,
// nếu không thì không có gì để tự đánh giá (lỗi port từ bản vanilla).
import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { createDomainPorts } from '../domain/domain-ports';
import { ALL_LESSONS } from '../domain/lessons';
import { normalizeProgress } from '../flows/ports';
import { ProbeFlow } from '../flows/probe-flow.svelte';
import type { ProgressState, ProgressStorage } from '../domain/types';
import ProbeScreen from './ProbeScreen.svelte';

function memStorage(): ProgressStorage {
  let state: ProgressState = normalizeProgress({});
  return { load: () => state, save: (s) => { state = s; } };
}

let host: HTMLElement | undefined;
let app: ReturnType<typeof mount> | undefined;
afterEach(() => {
  if (app) void unmount(app);
  host?.remove();
  app = undefined;
  host = undefined;
});

const plain = (html: string): string => {
  const d = document.createElement('div');
  d.innerHTML = html;
  return d.textContent.trim();
};

describe('ProbeScreen: pha hỏi mức chắc chắn', () => {
  it('hiện nguyên văn câu hỏi, kèm 4 nút mức chắc chắn, và chưa lộ ô nhập/đáp án', () => {
    const ports = createDomainPorts();
    const titles = Object.fromEntries(Object.entries(ports.lessons).map(([id, l]) => [id, l.t]));
    let checked = 0;
    for (const lesson of ALL_LESSONS) {
      if (!ports.probeBanks[lesson.id]) continue;
      const flow = new ProbeFlow({ storage: memStorage(), ports, lessonId: lesson.id, callbacks: {} });
      const q = flow.current;
      if (flow.phase !== 'confidence' || !q) continue;
      host = document.createElement('div');
      document.body.appendChild(host);
      app = mount(ProbeScreen, { target: host, props: { flow, lessons: ports.lessons, titles } });
      flushSync();
      const shown = host.querySelector('.q')?.textContent.trim();
      expect(shown, `bài ${lesson.id}: không thấy câu hỏi`).toBe(plain(q.q));
      expect(host.textContent).toContain('bạn chắc đến mức nào');
      expect(host.querySelector('input[type="number"]'), `bài ${lesson.id}`).toBeNull();
      expect(host.querySelectorAll('.opts button'), `bài ${lesson.id}`).toHaveLength(4);
      void unmount(app);
      host.remove();
      app = undefined;
      host = undefined;
      checked++;
    }
    expect(checked).toBeGreaterThan(50);
  });
});
