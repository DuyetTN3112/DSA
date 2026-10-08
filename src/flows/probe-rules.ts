// Pure decision logic của probe (không mutate, không $state).
// Tách khỏi probe-flow.svelte.ts để giữ mỗi file <=300 dòng.
import type { ProbeShape } from '../domain/types';
import { CARELESS_MS } from './labels';

export interface AnswerAdjudication {
  ok: boolean;
  flag: string;
  tag: string;
  lucky: boolean;
}

/**
 * Phân xử một câu trả lời (port logic trong nxt()): đoán-đúng -> lucky,
 * đúng sau khi giở sổ tay -> assisted, sai -> phân loại thói quen.
 */
export function adjudicateAnswer(args: {
  shape: ProbeShape;
  ok0: boolean;
  confidence: 0 | 1 | 2 | 3;
  assisted: boolean;
  elapsedMs: number;
}): AnswerAdjudication {
  const { shape, ok0, confidence, assisted, elapsedMs } = args;
  if (ok0 && confidence === 1) {
    return {
      ok: false,
      flag: 'lucky',
      tag: ' Đúng, nhưng bạn chọn «Đoán» nên câu này không được tính: đúng nhờ may mắn thì chưa phải hiểu.',
      lucky: true,
    };
  }
  if (ok0 && assisted) {
    return {
      ok: true,
      flag: 'assisted',
      tag: ' Bạn đã giở sổ tay: đó là cách học đúng. Câu này sẽ được hỏi lại bằng đề MỚI, không có sổ tay, để chắc là bạn tự làm được.',
      lucky: false,
    };
  }
  if (!ok0) {
    let flag = '';
    if (shape === 'read') flag = 'misread';
    else if (assisted) flag = '';
    else if (confidence === 3) flag = 'overconfident';
    else if (elapsedMs < CARELESS_MS) flag = 'careless';
    const tag =
      flag === 'misread'
        ? ' Đây là lỗi ĐỌC SAI ĐỀ: thói quen này phải sửa từ gốc.'
        : flag === 'overconfident'
          ? ' Bạn chọn «Chắc chắn» mà vẫn sai: đây là hiểu lầm sâu, đáng chú ý nhất.'
          : flag === 'careless'
            ? ' Bạn trả lời trong chưa đầy 4 giây và sai: dấu hiệu CẨU THẢ hoặc đoán.'
            : '';
    return { ok: false, flag, tag, lucky: false };
  }
  return { ok: true, flag: '', tag: '', lucky: false };
}

export interface ProbeEndContext {
  shapes: readonly ProbeShape[];
  res: Record<string, boolean>;
  flags: Record<string, string>;
  extra: boolean;
  solo: boolean;
  viaAssist: boolean;
  isOptMode: boolean;
}

export type ProbeEndDecision =
  | { kind: 'report-opt'; ok: boolean; bad: ProbeShape[] }
  | { kind: 'extra-question'; shape: ProbeShape }
  | { kind: 'solo-intro'; shapes: ProbeShape[] }
  | { kind: 'passed'; weakEvidence: boolean }
  | { kind: 'failed'; habits: string[]; bad: ProbeShape[] };

/**
 * Quyết định cuối lượt probe (port logic end()).
 * Pure — ProbeFlow chỉ việc apply decision.
 */
export function decideProbeEnd(ctx: ProbeEndContext): ProbeEndDecision {
  const bad = ctx.shapes.filter((s) => !ctx.res[s]);
  const hab = bad
    .map((s) => ctx.flags[s] ?? '')
    .filter((h) => h !== '' && h !== 'lucky' && h !== 'unknown');
  if (ctx.isOptMode) return { kind: 'report-opt', ok: bad.length === 0, bad };
  if (
    !ctx.extra &&
    bad.length === 1 &&
    hab.length === 0 &&
    !bad.some((s) => (ctx.flags[s] ?? '') === 'unknown')
  ) {
    const only = bad[0];
    if (only) return { kind: 'extra-question', shape: only };
  }
  const asst = ctx.shapes.filter(
    (s) => ctx.res[s] && ctx.flags[s] === 'assisted',
  );
  if (bad.length === 0 && asst.length > 0 && !ctx.solo) {
    return { kind: 'solo-intro', shapes: asst };
  }
  if (bad.length === 0) {
    return { kind: 'passed', weakEvidence: asst.length > 0 || ctx.viaAssist };
  }
  return { kind: 'failed', habits: hab, bad };
}
