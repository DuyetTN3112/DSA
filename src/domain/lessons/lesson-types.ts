// Re-export từ contract chung ../types.ts (single source of truth).
// File này tồn tại để các file lessons/*.ts không phải sửa import;
// RichLesson/RichStep nay chính là Lesson/LessonStep trong types.ts.
export type {
  Lesson as RichLesson,
  LessonStep as RichStep,
  NotebookEntry,
  StepKind,
  InputStep,
  ChoiceStep,
  ClickStep,
  OpenStep,
  OrderStep,
  ReflectStep,
  TestsStep,
  CodeStep,
  CodeMode,
  TapStep,
  BuildStep,
} from '../types';
