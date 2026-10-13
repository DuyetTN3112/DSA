// @vitest-environment jsdom
// Test hiển thị thật (jsdom): chặn lỗi "đề nói 'đây là mấy quả táo' mà không có quả táo nào".
import { flushSync, mount, unmount } from 'svelte';
import { afterEach, describe, expect, it } from 'vitest';
import { ALL_LESSONS } from '../domain/lessons';
import type { Lesson } from '../domain/types';
import LessonRunner from './LessonRunner.svelte';

const lessonOf = (id: string): Lesson => {
  const l = ALL_LESSONS.find((x) => x.id === id);
  if (!l) throw new Error(`thiếu bài ${id}`);
  return l;
};

let host: HTMLElement | undefined;
let app: ReturnType<typeof mount> | undefined;

function open(id: string): HTMLElement {
  host = document.createElement('div');
  document.body.appendChild(host);
  app = mount(LessonRunner, { target: host, props: { lesson: lessonOf(id), onDone: () => undefined } });
  flushSync();
  return host;
}

afterEach(() => {
  if (app) void unmount(app);
  host?.remove();
  app = undefined;
  host = undefined;
});

const boxTexts = (root: HTMLElement): string[] =>
  [...root.querySelectorAll('.arr .box')].map((b) => b.textContent.trim());
const idxTexts = (root: HTMLElement): string[] =>
  [...root.querySelectorAll('.arr .idx')].map((b) => b.textContent.trim());

describe('k1: đếm quả táo', () => {
  it('bước đầu hiện đúng 3 quả táo (không phải dấu ?), chưa có số đếm', () => {
    const root = open('k1');
    expect(boxTexts(root)).toEqual(['🍎', '🍎', '🍎']);
    expect(idxTexts(root)).toEqual(['', '', '']);
  });

  it('chạm lần lượt: số đếm 1,2,3 hiện dưới đúng vật vừa chạm, rồi qua bước sau', () => {
    const root = open('k1');
    const boxes = (): HTMLButtonElement[] => [...root.querySelectorAll<HTMLButtonElement>('.arr button.box')];
    boxes()[2]?.click();
    flushSync();
    expect(idxTexts(root)).toEqual(['', '', '1']);
    boxes()[0]?.click();
    flushSync();
    expect(idxTexts(root)).toEqual(['2', '', '1']);
    boxes()[1]?.click();
    flushSync();
    // đã chạm hết: sang bước input "Có tất cả mấy quả táo?", vẫn thấy 3 quả táo, không có chỉ số 0,1,2
    expect(root.textContent).toContain('Có tất cả mấy quả táo');
    expect(boxTexts(root)).toEqual(['🍎', '🍎', '🍎']);
    expect(idxTexts(root)).toEqual([]);
  });
});

describe('mảng minh hoạ ở bước không phải click/tap', () => {
  it('l3: bước input vẽ mảng của bài và tô sáng đúng hộp hi', () => {
    const l = lessonOf('l3');
    const hiIdx = l.steps.findIndex((s) => s.k === 'input' && s.hi !== undefined);
    const step = l.steps[hiIdx];
    expect(step?.k === 'input' ? step.hi : undefined).toBeDefined();
    // cắt bài để bước có hi là bước đầu tiên
    host = document.createElement('div');
    document.body.appendChild(host);
    app = mount(LessonRunner, {
      target: host,
      props: { lesson: { ...l, steps: l.steps.slice(hiIdx) }, onDone: () => undefined },
    });
    flushSync();
    expect(boxTexts(host)).toEqual((l.arr ?? []).map(String));
    const lit = [...host.querySelectorAll('.arr .box')].flatMap((b, i) => (b.classList.contains('hi') ? [i] : []));
    expect(lit).toEqual([step?.k === 'input' ? (step.hi ?? -1) : -1]);
  });

  it('mọi bài có mảng (bài hoặc bước đầu) đều vẽ ra đủ số hộp ở bước đầu tiên', () => {
    for (const l of ALL_LESSONS) {
      const first = l.steps[0];
      if (!first || first.k === 'code' || first.k === 'tests') continue;
      const expected = 'arr' in first ? first.arr : (l.arr ?? []);
      const root = open(l.id);
      expect(boxTexts(root), `bài ${l.id}`).toHaveLength(expected.length);
      if (app) void unmount(app);
      host?.remove();
      app = undefined;
      host = undefined;
    }
  });
});

describe('đề (brief) và nhãn pha ở bước trắc nghiệm của code lab', () => {
  it('bước đầu của mọi workshop có brief hiện ra cùng câu hỏi', () => {
    for (const l of ALL_LESSONS.filter((x) => x.ws === 1 && x.brief !== undefined)) {
      const first = l.steps[0];
      if (!first || first.k === 'code' || first.k === 'tests') continue;
      const root = open(l.id);
      expect(root.querySelector('.sub')?.textContent, `bài ${l.id}`).toContain('Đề:');
      if (app) void unmount(app);
      host?.remove();
      app = undefined;
      host = undefined;
    }
  });
});
