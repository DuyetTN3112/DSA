// Integration test: lái ProbeFlow + StuckRecovery + TinyCheckFlow bằng dữ liệu
// thật (82 bài, 81 banks) qua đúng các đường mà ProbeScreen/App dùng.
// Không DOM — chỉ kiểm tra wiring logic giữa domain data và flows.
import { describe, expect, it } from 'vitest';
import type { ProgressState, ProgressStorage } from '../domain/types';
import { createDomainPorts } from '../domain/domain-ports';
import { normalizeProgress } from '../flows/ports';
import { ProbeFlow } from '../flows/probe-flow.svelte';
import type { TinyCheckFlow } from '../flows/notebook-flow.svelte';

function memStorage(): ProgressStorage {
  let state: ProgressState = normalizeProgress({});
  return {
    load: () => state,
    save: (s) => {
      state = s;
    },
  };
}

/** Trả lời đúng câu hỏi hiện tại của probe (kể cả câu "vì sao"). */
function answerCorrectly(flow: ProbeFlow): void {
  const q = flow.current;
  if (!q) throw new Error('no current question');
  if (q.o) {
    const display = flow.optionOrder.findIndex((oi) => oi === q.a);
    flow.answerChoice(display);
  } else {
    flow.answerNumeric(q.a);
  }
  if (flow.phase === 'why') {
    const wq = flow.whyQuestion;
    if (!wq) throw new Error('no why question');
    const display = flow.optionOrder.findIndex((oi) => oi === wq.a);
    flow.answerWhy(display);
  }
}

/** Trả lời đúng toàn bộ câu hỏi của một TinyCheckFlow. */
function passTiny(tiny: TinyCheckFlow): void {
  for (let guard = 0; guard < 10; guard++) {
    if (tiny.phase === 'done') return;
    const q = tiny.current;
    if (!q) throw new Error('no tiny question');
    if (tiny.phase === 'asking') {
      if (q.o) {
        const display = tiny.optionOrder.findIndex((oi) => oi === q.a);
        tiny.answerChoice(display);
      } else {
        tiny.answerNumeric(q.a);
      }
    } else if (tiny.phase === 'feedback') {
      tiny.continue();
    } else {
      throw new Error(`unexpected tiny phase ${tiny.phase}`);
    }
  }
  throw new Error('tiny did not finish');
}

function makeProbe(lessonId: string): ProbeFlow {
  const ports = createDomainPorts();
  return new ProbeFlow({
    storage: memStorage(),
    ports,
    lessonId,
    callbacks: {},
  });
}

describe('createDomainPorts', () => {
  it('nối đủ dữ liệu thật', () => {
    const ports = createDomainPorts();
    expect(Object.keys(ports.lessons)).toHaveLength(82);
    expect(Object.keys(ports.probeBanks)).toHaveLength(81);
    expect(ports.probeBanks['rd1']).toBeUndefined();
    expect(ports.stages.length).toBeGreaterThan(0);
    expect(ports.tinyFor('l1')).toBe('k3');
    expect(ports.tinyFor('nope')).toBeNull();
    const tiny = ports.tinyBanks['k3'];
    expect(tiny).toBeDefined();
    expect(tiny?.().length).toBeGreaterThan(0);
  });
});

describe('ProbeFlow full pass', () => {
  it('k1: 5 câu đúng hết -> passed', () => {
    const flow = makeProbe('k1');
    for (let guard = 0; guard < 20; guard++) {
      if (flow.phase === 'finished') break;
      if (flow.phase === 'confidence') flow.pickConfidence(3);
      else if (flow.phase === 'question') answerCorrectly(flow);
      else if (flow.phase === 'feedback') flow.continueFromFeedback();
      else throw new Error(`unexpected phase ${flow.phase}`);
    }
    expect(flow.phase).toBe('finished');
    expect(flow.outcome).toBe('passed');
    expect(flow.progress.done['k1']).toBe(1);
  });
});

describe('ProbeFlow stuck -> tiny -> resume', () => {
  it('l1: Chưa hiểu -> concept -> sổ tay -> tiny -> quay lại đúng câu', () => {
    const flow = makeProbe('l1');
    expect(flow.phase).toBe('confidence');
    const qBefore = flow.current;
    flow.pickConfidence(0);
    expect(flow.phase).toBe('stuck-pick');
    flow.pickStuckKind('concept');
    expect(flow.phase).toBe('reference');
    const nb = flow.stuckRecovery?.notebook;
    expect(nb?.view?.lessonId).toBe('l1');
    nb?.pressBack();
    // tinyFor('l1') = 'k3' -> có bank nên chạy tiny
    expect(flow.phase).toBe('tiny');
    const tiny = flow.stuckRecovery?.notebook?.tiny;
    if (!tiny) throw new Error('no tiny flow');
    passTiny(tiny);
    // tiny xong -> quay lại ĐÚNG câu cũ, cược lại từ đầu
    expect(flow.phase).toBe('confidence');
    expect(flow.current).toBe(qBefore);
    expect(flow.assisted[flow.shapeNow ?? '']).toBe(true);
  });

  it('l1: Chưa hiểu vì đọc đề -> bank rd1', () => {
    const flow = makeProbe('l1');
    flow.pickConfidence(0);
    flow.pickStuckKind('de');
    expect(flow.phase).toBe('reference');
    expect(flow.stuckRecovery?.notebook?.view?.lessonId).toBe('rd1');
    flow.stuckRecovery?.notebook?.pressBack();
    expect(flow.phase).toBe('tiny');
    const tiny = flow.stuckRecovery?.notebook?.tiny;
    if (!tiny) throw new Error('no tiny flow');
    passTiny(tiny);
    expect(flow.phase).toBe('confidence');
  });

  it('k1: không có tiny bank -> bỏ qua tiny, về thẳng câu hỏi', () => {
    const flow = makeProbe('k1');
    flow.pickConfidence(0);
    flow.pickStuckKind('concept');
    flow.stuckRecovery?.notebook?.pressBack();
    // tinyFor('k1') = null -> khớp vanilla: if (!tk || !TINY[tk]) return done()
    expect(flow.phase).toBe('confidence');
  });

  it('l1: giở sổ tay tự nguyện -> tiny -> resume, không ghi fk', () => {
    const flow = makeProbe('l1');
    flow.openNotebookVoluntary();
    expect(flow.phase).toBe('reference');
    flow.stuckRecovery?.notebook?.pressBack();
    expect(flow.phase).toBe('tiny');
    const tiny = flow.stuckRecovery?.notebook?.tiny;
    if (!tiny) throw new Error('no tiny flow');
    passTiny(tiny);
    expect(flow.phase).toBe('confidence');
    const fk = flow.progress.pr['l1']?.fk ?? {};
    expect(Object.keys(fk)).toHaveLength(0);
  });
});
