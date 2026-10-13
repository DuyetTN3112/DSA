// @vitest-environment jsdom
// Test thao tác như người học thật: gõ số vào ô rồi bấm "Kiểm tra".
// Chặn lỗi `val.trim is not a function` (bind:value trên type=number gán số, không phải chuỗi)
// làm hỏng mọi câu nhập số mà các test gọi thẳng flow.answerNumeric() không thấy.
import { flushSync, mount, unmount } from 'svelte';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createDomainPorts } from '../domain/domain-ports';
import { ALL_LESSONS } from '../domain/lessons';
import { normalizeProgress } from '../flows/ports';
import { TinyCheckFlow } from '../flows/notebook-flow.svelte';
import { ProbeFlow } from '../flows/probe-flow.svelte';
import type { ProgressState, ProgressStorage } from '../domain/types';
import LessonRunner from './LessonRunner.svelte';
import ProbeScreen from './ProbeScreen.svelte';
import TinyCheckScreen from './TinyCheckScreen.svelte';

function memStorage(): ProgressStorage {
  let state: ProgressState = normalizeProgress({});
  return { load: () => state, save: (s) => { state = s; } };
}

/** Đọc phase qua hàm để TS không thu hẹp kiểu sau khi flow đã đổi trạng thái. */
const phaseOf = (f: ProbeFlow): string => f.phase;

let host: HTMLElement | undefined;
let app: ReturnType<typeof mount> | undefined;
let errors: string[] = [];
const onError = (e: ErrorEvent): void => {
  errors.push(e.message);
  e.preventDefault();
};

beforeEach(() => {
  errors = [];
  window.addEventListener('error', onError);
});
afterEach(() => {
  window.removeEventListener('error', onError);
  if (app) void unmount(app);
  host?.remove();
  app = undefined;
  host = undefined;
});

function target(): HTMLElement {
  host = document.createElement('div');
  document.body.appendChild(host);
  return host;
}

/** Gõ giá trị vào ô số như người dùng (sự kiện input) rồi bấm nút "Kiểm tra". */
function typeAndCheck(root: HTMLElement, value: string): void {
  const input = root.querySelector<HTMLInputElement>('input[type="number"]');
  if (!input) throw new Error('không có ô nhập số');
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  flushSync();
  const btn = [...root.querySelectorAll<HTMLButtonElement>('button')].find((b) =>
    b.textContent.includes('Kiểm tra'),
  );
  if (!btn) throw new Error('không có nút Kiểm tra');
  btn.click();
  flushSync();
}

describe('InputStep (bài học)', () => {
  const openK1AtInput = (): HTMLElement => {
    const lesson = ALL_LESSONS.find((l) => l.id === 'k1');
    if (!lesson) throw new Error('thiếu k1');
    const root = target();
    // cắt bài để bước đầu là câu nhập số "Có tất cả mấy quả táo?"
    const at = lesson.steps.findIndex((s) => s.k === 'input');
    app = mount(LessonRunner, {
      target: root,
      props: { lesson: { ...lesson, steps: lesson.steps.slice(at) }, onDone: () => undefined },
    });
    flushSync();
    return root;
  };

  it('gõ đáp án đúng rồi bấm Kiểm tra: không lỗi, sang bước sau', () => {
    const root = openK1AtInput();
    expect(root.textContent).toContain('Có tất cả mấy quả táo');
    typeAndCheck(root, '3');
    expect(errors).toEqual([]);
    expect(root.textContent).toContain('Bây giờ là các ngôi sao');
  });

  it('gõ đáp án sai: báo "Chưa đúng", không lỗi, vẫn ở bước cũ', () => {
    const root = openK1AtInput();
    typeAndCheck(root, '2');
    expect(errors).toEqual([]);
    expect(root.textContent).toContain('Chưa đúng');
    expect(root.textContent).toContain('Có tất cả mấy quả táo');
  });

  it('bấm Kiểm tra khi ô còn trống: không lỗi, không làm gì', () => {
    const root = openK1AtInput();
    typeAndCheck(root, '');
    expect(errors).toEqual([]);
    expect(root.textContent).toContain('Có tất cả mấy quả táo');
    expect(root.textContent).not.toContain('Chưa đúng');
  });
});

describe('ProbeScreen (kiểm tra hiểu thật)', () => {
  it('câu nhập số: gõ đáp án đúng rồi bấm Kiểm tra -> không lỗi, sang phản hồi', () => {
    const ports = createDomainPorts();
    const titles = Object.fromEntries(Object.entries(ports.lessons).map(([id, l]) => [id, l.t]));
    let tried = 0;
    for (const lesson of ALL_LESSONS) {
      for (let k = 0; k < 6; k++) {
        const flow = new ProbeFlow({ storage: memStorage(), ports, lessonId: lesson.id, callbacks: {} });
        if (flow.phase !== 'confidence') continue;
        flow.pickConfidence(3);
        const q = flow.current;
        if (phaseOf(flow) !== 'question' || !q || q.o) continue;
        const root = target();
        app = mount(ProbeScreen, { target: root, props: { flow, lessons: ports.lessons, titles } });
        flushSync();
        typeAndCheck(root, String(q.a));
        tried++;
        expect(errors, `bài ${lesson.id}`).toEqual([]);
        expect(flow.phase).not.toBe('question');
        void unmount(app);
        root.remove();
        app = undefined;
        host = undefined;
        if (tried >= 5) return;
      }
    }
    expect(tried, 'phải tìm được ít nhất 1 câu probe nhập số').toBeGreaterThan(0);
  });
});

describe('TinyCheckScreen (kiểm tra ngắn)', () => {
  it('câu nhập số: gõ đáp án đúng rồi bấm Kiểm tra -> không lỗi', () => {
    const ports = createDomainPorts();
    let tried = 0;
    for (const bankName of Object.keys(ports.tinyBanks)) {
      for (let k = 0; k < 6; k++) {
        const flow = new TinyCheckFlow({
          storage: memStorage(),
          ports,
          bankName,
          backId: bankName,
          onDone: () => undefined,
          onRequestRestart: () => undefined,
          onRequestRootcheck: () => undefined,
        });
        const q = flow.current;
        if (flow.phase !== 'asking' || !q || q.o) continue;
        const root = target();
        app = mount(TinyCheckScreen, { target: root, props: { flow } });
        flushSync();
        typeAndCheck(root, String(q.a));
        tried++;
        expect(errors, `bank ${bankName}`).toEqual([]);
        expect(flow.phase).not.toBe('asking');
        void unmount(app);
        root.remove();
        app = undefined;
        host = undefined;
        if (tried >= 3) return;
      }
    }
    expect(tried, 'phải tìm được ít nhất 1 câu tiny nhập số').toBeGreaterThan(0);
  });
});
