// Adapter: nối dữ liệu domain thật vào DomainPorts mà flows cần.
// - lessons: LESSON_MAP (77 bài)
// - probeBanks: PROBE_BANKS (76 banks; rd1 không có bank — đúng behavior bản cũ)
// - tinyBanks: mỗi bank name -> hàm trả về toàn bộ câu hỏi (flow tự shuffle/lấy 3)
// - tinyFor: (id, stuckKind?) => bank name | null (quy tắc 'de' -> 'rd1' nằm ở đây)
// - stages: STAGES (single source of truth)
// - preq: PREQ (đã merge theo load order)
import type { DomainPorts } from '../flows/ports';
import type { StuckKind, TinyQuestion } from './types';
import { LESSON_MAP } from './lessons/index';
import { STAGES } from './lessons/order';
import { PREQ, PROBE_BANKS, TINY, tinyFor } from './probe/index';

/** Đóng gói một tiny bank thành hàm sinh mảng câu hỏi cho flow. */
function tinyBank(name: string): () => TinyQuestion[] {
  return () => {
    const gens = TINY[name] ?? [];
    return gens.map((g) => g());
  };
}

function buildTinyBanks(): Record<string, () => TinyQuestion[]> {
  const out: Record<string, () => TinyQuestion[]> = {};
  for (const name of Object.keys(TINY)) {
    out[name] = tinyBank(name);
  }
  return out;
}

/** DomainPorts dùng dữ liệu thật của app. */
export function createDomainPorts(): DomainPorts {
  return {
    lessons: LESSON_MAP,
    probeBanks: PROBE_BANKS,
    tinyBanks: buildTinyBanks(),
    tinyFor: (id: string, stuckKind?: StuckKind) => tinyFor(id, stuckKind),
    stages: STAGES,
    preq: PREQ,
  };
}
