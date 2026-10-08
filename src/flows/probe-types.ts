// Types dùng chung cho probe flows (tách khỏi probe-flow.svelte.ts để giữ <=300 dòng).
import type {
  ProbeQuestion,
  ProbeShape,
  ProgressStorage,
} from '../domain/types';
import type { DateProvider, DomainPorts } from './ports';

export const DEFAULT_SHAPES: readonly ProbeShape[] = [
  'same',
  'flip',
  'new',
  'verdict',
  'read',
];

/** Câu hỏi verdict có thêm câu hỏi phụ "Vì sao?" (domain types chưa có field này). */
export interface ProbeQuestionWithWhy extends ProbeQuestion {
  why?: { q: string; o: string[]; a: number };
}

export type ProbePhase =
  | 'confidence'
  | 'question'
  | 'why'
  | 'feedback'
  | 'stuck-pick'
  | 'reference'
  | 'tiny'
  | 'solo-intro'
  | 'finished';

export interface ProbeEndInfo {
  flags: Record<string, string>;
  bad: ProbeShape[];
  shapes: ProbeShape[];
}

export interface ProbeRunOptions {
  shapes?: ProbeShape[];
  title?: string;
  tag?: string;
  /** Formative: không ghi rec() (dùng cho retestOne). */
  noRec?: boolean;
  fromHub?: boolean;
  onEnd?: (ok: boolean, info: ProbeEndInfo) => void;
}

export interface ProbeFlowCallbacks {
  /** Mở lại bài từ đầu (nút "Học lại", regress tcr). */
  onOpenLesson: (lessonId: string) => void;
  /** Mở kiểm tra nền (regress tcn, trượt có testable). */
  onOpenRootcheck: (lessonId: string) => void;
  /** Bấm "Tiếp tục" sau khi qua. */
  onContinue: (lessonId: string, fromHub: boolean) => void;
}

export interface ProbeFlowOptions {
  storage: ProgressStorage;
  ports: DomainPorts;
  lessonId: string;
  dates?: DateProvider;
  run?: ProbeRunOptions;
  callbacks?: Partial<ProbeFlowCallbacks>;
}
