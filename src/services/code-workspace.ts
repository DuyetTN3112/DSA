// Nháp code/tests của học viên theo từng bài (trong bộ nhớ, reset khi đổi bài).
// Port WS của vanilla: WS = { tests: L.ts, code: L.cs } khi bắt đầu bài.

export interface CodeDraft {
  tests: string;
  code: string;
}

const drafts = new Map<string, CodeDraft>();

export function getDraft(lessonId: string, ts: string, cs: string): CodeDraft {
  let d = drafts.get(lessonId);
  if (!d) {
    d = { tests: ts, code: cs };
    drafts.set(lessonId, d);
  }
  return d;
}

export function setDraftTests(lessonId: string, tests: string): void {
  const d = drafts.get(lessonId);
  if (d) d.tests = tests;
}

export function setDraftCode(lessonId: string, code: string): void {
  const d = drafts.get(lessonId);
  if (d) d.code = code;
}

export function resetDraft(lessonId: string): void {
  drafts.delete(lessonId);
}
