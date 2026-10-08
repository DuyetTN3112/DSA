// Domain types dùng chung cho toàn bộ app. Mọi agent/port đều build trên file này.
// Quy ước: không any/unknown, mọi field optional phải có lý do rõ ràng.

/** Các loại bước trong một bài học */
export type StepKind =
  | 'click'
  | 'input'
  | 'choice'
  | 'open'
  | 'order'
  | 'reflect'
  | 'build'
  | 'code'
  | 'tap'
  | 'tests';

interface StepBase {
  k: StepKind;
  q: string;
  s?: string;
  h?: string;
  /** nhãn phase hiển thị, vd "Bước 4: Hàng rào trước" */
  ph?: string;
}

export interface InputStep extends StepBase {
  k: 'input';
  a: number | string;
  h: string;
  s: string;
  /** index của hộp cần highlight (bài l3) */
  hi?: number;
  /** mảng minh họa (bài k1) */
  arr?: (string | number)[];
  noidx?: number;
}

export interface ChoiceStep extends StepBase {
  k: 'choice';
  a: number;
  h: string;
  s: string;
  o: string[];
}

export interface ClickStep extends StepBase {
  k: 'click';
  a: number;
  h: string;
  s: string;
  /** mảng minh họa (bài k3 dùng emoji) */
  arr?: (string | number)[];
  noidx?: number;
}

export interface OpenStep extends StepBase {
  k: 'open';
  a: number;
  h: string;
  s: string;
}

export interface OrderStep extends StepBase {
  k: 'order';
  s: string;
  /** [nội dung, gợi ý] từng mảnh cần sắp xếp */
  items: [string, string][];
}

export interface ReflectStep extends StepBase {
  k: 'reflect';
}

export interface TestsStep extends StepBase {
  k: 'tests';
  s: string;
  /** các mẩu gợi ý giúp làm bài */
  hp?: string[];
}

export type CodeMode = 'guard' | 'happy' | 'err';

export interface CodeStep extends StepBase {
  k: 'code';
  s: string;
  mode?: CodeMode;
  hp?: string[];
}

export interface TapStep extends StepBase {
  k: 'tap';
  s: string;
  h: string;
  arr?: (string | number)[];
  noidx?: number;
}

export interface BuildStep extends StepBase {
  k: 'build';
  s: string;
  h: string;
  /** các mảnh token để ghép */
  tok: string[];
  /** đáp án đúng (thứ tự token) */
  ans: string[];
  roles?: string[] | null;
  guided?: number;
  say?: string;
  show?: string;
}

/** Một bước học — discriminated union theo k (10 biến thể từ dữ liệu thật) */
export type LessonStep =
  | InputStep
  | ChoiceStep
  | ClickStep
  | OpenStep
  | OrderStep
  | ReflectStep
  | TestsStep
  | CodeStep
  | TapStep
  | BuildStep;

/** Định nghĩa một bài học */
export interface Lesson {
  id: string;
  t: string;
  steps: LessonStep[];
  /** drill rút gọn: "idx" | "lin" | "max" | ... */
  dr?: string;
  /** mảng minh họa (vd [7,3,9,4]) */
  arr?: number[];
  hide?: boolean;
  /** sổ tay viết tay (HTML cũ) */
  note?: string;
  /** mini-textbook có cấu trúc */
  nbk?: NotebookEntry;
  /** workshop code-lab */
  ws?: 1;
  fn?: string;
  args?: string;
  brief?: string;
  cs?: string;
  ts?: string;
  ref?: string;
  /** các ca test ẩn: [code, kết quả mong đợi][] */
  hid?: [string, string][];
  errs?: [string, string][];
  lvl?: 1 | 2 | 3;
}

/** Sổ tay mini-textbook: 10 mục chuẩn */
export interface NotebookEntry {
  idea: string;
  why: string;
  model: string;
  rule: string;
  ex: string;
  trace: string;
  anti: string;
  pitfalls: string;
  selfcheck: string;
  link: string;
  pre?: string[];
  links?: string[];
}

/** Câu hỏi kiểm tra hiểu thật (probe) */
export interface ProbeQuestion {
  q: string;
  /** index đáp án đúng trong o, hoặc giá trị số khi không có options */
  a: number;
  w: string;
  o?: string[];
}

/** Hàm sinh câu hỏi probe (mỗi lần gọi ra biến thể mới) */
export type ProbeGenerator = () => ProbeQuestion;

/** 5 dạng câu probe cho mỗi bài */
export interface ProbeBank {
  same: ProbeGenerator;
  flip: ProbeGenerator;
  new: ProbeGenerator;
  verdict: ProbeGenerator;
  read: ProbeGenerator;
}

export type ProbeShape = keyof ProbeBank;

/** Câu hỏi tiny-check sau khi giở sổ tay */
export interface TinyQuestion {
  q: string;
  a: number;
  w: string;
  o?: string[];
}

/** Loại vướng mắc khi bấm "Chưa hiểu" */
export type StuckKind =
  | 'de'
  | 'concept'
  | 'start'
  | 'python'
  | 'theory'
  | 'unsure';

/** Tiến độ một bài trong P.pr[id] */
export interface LessonProgress {
  p: number;
  f: number;
  miss: Record<string, number>;
  last: string;
  days: string[];
  asst?: number;
  lucky?: number;
  fk?: Partial<Record<StuckKind, number>>;
  unk?: number;
}

/** Hộp ôn cách quãng Leitner */
export interface LeitnerBox {
  box: 1 | 2 | 3 | 4 | 5;
  due: string;
  n: number;
  lapse: number;
  cl: number;
  ls: string;
  seen: string;
}

/** Toàn bộ state persist (localStorage key "dsa") */
export interface ProgressState {
  done: Record<string, 1>;
  pr: Record<string, LessonProgress>;
  weak: Record<string, number>;
  shaky: Record<string, 1>;
  hab: Record<string, number>;
  lt: Record<string, LeitnerBox>;
  hc: { seen: Record<string, string>; fail: Record<string, number>; last?: string };
  g: Record<string, { n: number }>;
  u: Record<string, number>;
}

/** Một stage trong lộ trình */
export interface Stage {
  n: string;
  d: string;
  L: string[];
}

/** Storage abstraction: hiện tại là localStorage, sau này có thể thay bằng DB/API */
export interface ProgressStorage {
  load(): ProgressState;
  save(state: ProgressState): void;
}
