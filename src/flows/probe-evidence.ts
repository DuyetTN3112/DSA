// Evidence thuần túy của probe + Leitner grading cho ôn cách quãng.
// Tách khỏi probe-flow.svelte.ts để file flow không quá 300 dòng.
// Toàn hàm thuần (nhận state, mutate, không tự save — caller save).
import type { ProbeShape, ProgressState } from '../domain/types';
import {
  addDays,
  dropKey,
  ensureLeitnerBox,
  ensureLessonProgress,
  type DateProvider,
  type DomainPorts,
} from './ports';
import { LEITNER_DAYS } from './labels';
import { descendants, testable } from './graph';
import type { ProbeEndDecision } from './probe-rules';
import type { ProbeEndInfo, ProbePhase } from './probe-types';

/**
 * Ghi nhận một lượt kiểm tra (port từ rec()).
 * weakEvidence=true (qua nhờ sổ tay/solo): không cộng ngày "Vững".
 */
export function recordProbeAttempt(
  state: ProgressState,
  lessonId: string,
  ok: boolean,
  badShapes: readonly ProbeShape[],
  dates: DateProvider,
  weakEvidence: boolean,
): void {
  const r = ensureLessonProgress(state, lessonId);
  if (ok) r.p += 1;
  else r.f += 1;
  if (!ok) {
    for (const s of badShapes) {
      r.miss[s] = (r.miss[s] ?? 0) + 1;
    }
  }
  r.last = dates.today();
  if (ok && !weakEvidence && !r.days.includes(r.last)) {
    r.days.push(r.last);
  }
}

/**
 * Evidence khi qua nhưng có hỗ trợ (port đoạn weakEv trong end()):
 * asst++, Leitner hạ về hộp 1, hẹn ôn ngày mai.
 */
export function applyAssistedPassEvidence(
  state: ProgressState,
  lessonId: string,
  dates: DateProvider,
): void {
  const r = ensureLessonProgress(state, lessonId);
  r.asst = (r.asst ?? 0) + 1;
  const it = ensureLeitnerBox(state, lessonId, dates);
  it.box = 1;
  it.due = dates.tomorrow();
}

/** Đánh dấu qua probe: done=1, xóa cờ shaky. */
export function applyProbePass(state: ProgressState, lessonId: string): void {
  state.done[lessonId] = 1;
  state.shaky = dropKey(state.shaky, lessonId);
}

/**
 * Ghi nhận trượt probe (port đoạn fail trong end()):
 * thói quen xấu, rút dấu done, weak++.
 */
export function applyProbeFail(
  state: ProgressState,
  lessonId: string,
  habits: readonly string[],
): void {
  for (const h of habits) {
    state.hab[h] = (state.hab[h] ?? 0) + 1;
  }
  state.done = dropKey(state.done, lessonId);
  state.weak[lessonId] = (state.weak[lessonId] ?? 0) + 1;
}

/**
 * Rút một bài khỏi vòng ôn (port từ withdraw()): rút done, weak++,
 * xóa Leitner/shaky của nó, đánh dấu shaky cho các bài con đã done.
 */
export function withdrawFromReview(
  ports: DomainPorts,
  state: ProgressState,
  id: string,
): void {
  state.done = dropKey(state.done, id);
  state.weak[id] = (state.weak[id] ?? 0) + 1;
  state.lt = dropKey(state.lt, id);
  state.shaky = dropKey(state.shaky, id);
  for (const z of descendants(ports, id)) {
    if (state.done[z] === 1) state.shaky[z] = 1;
  }
}

export type SpacedGrade = 'up' | 'down' | 'lucky' | 'unknown' | 'withdrawn';

export interface SpacedGradeResult {
  id: string;
  shape: ProbeShape;
  res: SpacedGrade;
  box: number;
  due: string;
  wasBox: number;
  flag: string;
  cl: number;
}

/**
 * Chấm một câu ôn và cập nhật hộp Leitner (port từ grade() trong review.js).
 * Không tự save — caller save sau khi xử lý xong item.
 */
export function gradeSpacedItem(
  ports: DomainPorts,
  state: ProgressState,
  dates: DateProvider,
  id: string,
  sh: ProbeShape,
  ok: boolean,
  flag: string,
): SpacedGradeResult {
  const it = ensureLeitnerBox(state, id, dates);
  const t = dates.today();
  const wasBox = it.box;
  it.seen = t;
  it.n += 1;
  let res: SpacedGrade;
  if (ok) {
    it.box = Math.min(5, it.box + 1) as 1 | 2 | 3 | 4 | 5;
    it.cl = 0;
    it.due = addDays(t, LEITNER_DAYS[it.box - 1] ?? 1);
    res = 'up';
  } else if (flag === 'lucky' || flag === 'unknown') {
    it.due = addDays(t, 1);
    res = flag === 'unknown' ? 'unknown' : 'lucky';
  } else {
    it.lapse += 1;
    it.cl += 1;
    it.box = 1;
    it.due = addDays(t, 1);
    res = 'down';
    if (flag !== '') state.hab[flag] = (state.hab[flag] ?? 0) + 1;
    if (
      flag === 'overconfident' ||
      flag === 'misread' ||
      it.cl >= 2 ||
      (wasBox >= 3 && flag !== 'careless')
    ) {
      state.shaky[id] = 1;
    }
    if (it.cl >= 3) {
      withdrawFromReview(ports, state, id);
      res = 'withdrawn';
    }
  }
  return {
    id,
    shape: sh,
    res,
    box: it.box,
    due: it.due,
    wasBox,
    flag,
    cl: it.cl,
  };
}

/**
 * Phần state của ProbeFlow mà việc apply quyết định cuối lượt được mutate.
 * ProbeFlow truyền chính nó (structural typing) — không circular import.
 */
export interface ProbeEndMutable {
  list: ProbeShape[];
  index: number;
  res: Record<string, boolean>;
  flags: Record<string, string>;
  assisted: Record<string, boolean>;
  extra: boolean;
  solo: boolean;
  viaAssist: boolean;
  outcome: 'passed' | 'failed' | null;
  weakPass: boolean;
  failHabits: string[];
  soloShapes: ProbeShape[];
  phase: ProbePhase;
}

export type ProbeEndEffect =
  | { kind: 'ask-next' }
  | { kind: 'settle'; save: boolean; rootcheck?: string | undefined };

/**
 * Apply một ProbeEndDecision lên state (port thân end()).
 * Trả về effect để ProbeFlow điều khiển luồng tiếp (hỏi câu mới / render / rootcheck).
 */
export function applyProbeEndDecision(args: {
  ports: DomainPorts;
  state: ProgressState;
  dates: DateProvider;
  lessonId: string;
  decision: ProbeEndDecision;
  m: ProbeEndMutable;
  onEnd?: ((ok: boolean, info: ProbeEndInfo) => void) | undefined;
  noRec?: boolean | undefined;
}): ProbeEndEffect {
  const { ports, state, dates, lessonId, decision, m } = args;
  switch (decision.kind) {
    case 'report-opt': {
      const shouldRec =
        decision.ok || m.list.some((s) => (m.flags[s] ?? '') !== 'unknown');
      if (!args.noRec && shouldRec) {
        recordProbeAttempt(
          state,
          lessonId,
          decision.ok,
          decision.bad,
          dates,
          false,
        );
      }
      args.onEnd?.(decision.ok, {
        flags: { ...m.flags },
        bad: [...decision.bad],
        shapes: [...m.list],
      });
      m.outcome = decision.ok ? 'passed' : 'failed';
      m.phase = 'finished';
      return { kind: 'settle', save: true };
    }
    case 'extra-question': {
      // Port đúng spec: THAY list bằng đúng câu thêm (không append).
      m.extra = true;
      m.list = [decision.shape];
      m.index = 0;
      return { kind: 'ask-next' };
    }
    case 'solo-intro': {
      m.solo = true;
      m.viaAssist = true;
      m.soloShapes = decision.shapes;
      m.list = [...decision.shapes];
      m.index = 0;
      m.assisted = {};
      for (const s of decision.shapes) {
        m.res = dropKey(m.res, s);
        m.flags = dropKey(m.flags, s);
      }
      m.phase = 'solo-intro';
      return { kind: 'settle', save: false };
    }
    case 'passed': {
      recordProbeAttempt(
        state,
        lessonId,
        true,
        [],
        dates,
        decision.weakEvidence,
      );
      if (decision.weakEvidence)
        applyAssistedPassEvidence(state, lessonId, dates);
      // done=1 + xóa shaky LUÔN chạy, kể cả khi qua nhờ hỗ trợ.
      applyProbePass(state, lessonId);
      m.outcome = 'passed';
      m.weakPass = decision.weakEvidence;
      m.phase = 'finished';
      return { kind: 'settle', save: true };
    }
    case 'failed': {
      applyProbeFail(state, lessonId, decision.habits);
      recordProbeAttempt(state, lessonId, false, decision.bad, dates, false);
      m.outcome = 'failed';
      m.failHabits = decision.habits;
      m.phase = 'finished';
      const rootcheck =
        testable(ports, state, lessonId).length > 0 ? lessonId : undefined;
      return { kind: 'settle', save: true, rootcheck };
    }
  }
}
