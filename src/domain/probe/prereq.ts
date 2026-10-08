// Đồ thị tiền đề: bài nào dựa trên bài nào.
// Port từ main:probe.js (PREQ, anc) + mọi Object.assign(PREQ, ...) trong
// probe-foundation/kinder/core/more/adv/last/code.js — file sau thắng khi trùng key:
//   l3: ["l1","l2","sm"] (foundation thắng probe.js), w1: ["l3","b6"], w2: ["l2","b6"],
//   w3: ["l3","w1"] (code thắng probe.js), p2: ["p1","k6"], p3: ["p2","k7"] (kinder thắng
//   foundation), sm: ["p3","a2"] (core thắng foundation), bx0: ["k4","k9"] (more thắng kinder).

/** Tiền đề trực tiếp của mỗi bài (đã merge cuối cùng) */
export const PREQ: Record<string, string[]> = {
  l2: ['l1'],
  l3: ['l1', 'l2', 'sm'],
  w1: ['l3', 'b6'],
  w2: ['l2', 'b6'],
  w3: ['l3', 'w1'],
  p1: ['bx0'],
  p2: ['p1', 'k6'],
  p3: ['p2', 'k7'],
  sm: ['p3', 'a2'],
  k3: ['k1'],
  k7: ['k6'],
  bx0: ['k4', 'k9'],
  l1: ['k3'],
  p4: ['p1'],
  a2: ['l1'],
  a3: ['a2'],
  cn: ['p2', 'p3', 'a2'],
  d1: ['a3'],
  d2: ['d1', 'cn'],
  stk: ['a3'],
  que: ['stk'],
  bs: ['l2', 'a2'],
  k2: ['k1'],
  k5: ['k4'],
  k8: ['k2'],
  k9: ['k5', 'k4'],
  tp: ['a3', 'p3'],
  bub: ['a3', 'p2'],
  bo: ['bs', 'l3'],
  mrg: ['bub', 'bo', 'r2'],
  qck: ['mrg'],
  h1: ['d1'],
  h2: ['h1', 'd2'],
  h3: ['h2', 'l2'],
  r1: ['p4', 'p2'],
  r2: ['r1'],
  r3: ['r2'],
  n1: ['a3', 'p4'],
  n2: ['n1', 'p3'],
  n3: ['n2'],
  t1: ['n1'],
  t2: ['t1', 'r2'],
  hep: ['t2', 'que'],
  hps: ['hep', 'bub'],
  g1: ['d1', 'a3'],
  g2: ['g1', 'que', 'd2'],
  g3: ['g2', 'r2'],
  dp1: ['r2', 'd1'],
  dp2: ['dp1', 'a3', 'p3'],
  e1: ['a3'],
  e2: ['sm'],
  e3: ['e2', 'sm'],
  e4: ['e3', 'cn'],
  b1: ['p1'],
  b2: ['p2', 'b1'],
  b3: ['p3', 'b2'],
  b4: ['p4', 'b3'],
  b5: ['a3', 'b3'],
  b6: ['b5', 'b4', 'l3', 'sm'],
  m1: ['d2', 'e4'],
  m2: ['m1'],
  m3: ['m2', 'e3'],
  rl1: ['que', 'm2'],
  ap1: ['d2', 'h3'],
  ap2: ['que'],
  ap3: ['stk'],
  ap4: ['g2', 'g1'],
  ap5: ['t2'],
  ap6: ['ap1', 'ap2', 'ap3', 'ap4', 'ap5'],
  w4: ['h3', 'w2'],
  w5: ['w4'],
  w6: ['w5'],
  w7: ['w6'],
  w8: ['r3'],
  w9: ['m3', 'w4'],
  w10: ['g3', 'w9'],
  w11: ['stk', 'w2'],
  w12: ['rl1', 'w11'],
};

/**
 * Chuỗi tiền đề đầy đủ của một bài (từ gốc đến gần nhất), không trùng.
 * Port của anc().
 */
export function ancestors(id: string): string[] {
  const out: string[] = [];
  const visit = (x: string): void => {
    for (const y of PREQ[x] ?? []) {
      visit(y);
      if (!out.includes(y)) out.push(y);
    }
  };
  visit(id);
  return out;
}

/** Các bài Python trong chuỗi tiền đề, theo thứ tự ưu tiên */
const PY_IDS: readonly string[] = ['p1', 'p2', 'p3', 'p4', 'b1', 'b2', 'b3', 'b4'];

/**
 * Bài Python cơ bản gần nhất trong chuỗi tiền đề — dùng khi người học
 * "hiểu ý nhưng không biết viết Python". Port của pyRef().
 * @param hasLesson kiểm tra bài có tồn tại trong registry (thay cho LES[x] ở bản cũ)
 */
export function pyRef(id: string, hasLesson: (lessonId: string) => boolean): string {
  const chain = ancestors(id).filter((x) => PY_IDS.includes(x) && hasLesson(x));
  const nearest = chain[chain.length - 1];
  return nearest ?? id;
}
