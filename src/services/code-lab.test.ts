import { describe, expect, it } from 'vitest';
import {
  buildEmptyRun,
  buildGuardProbe,
  buildHiddenTests,
  errChk,
  guardRef,
  guardStart,
  mergeCore,
  parseGuardHits,
  validateTests,
} from './code-lab';

const REF = `def find_max(nums):
    if not isinstance(nums, list):
        raise TypeError("nums phai la list")
    if len(nums) == 0:
        raise ValueError("list rong")
    best = nums[0]
    for x in nums:
        if x > best:
            best = x
    return best
`;

describe('validateTests', () => {
  it('đòi ít nhất 3 assert', () => {
    expect(validateTests('assert f(1) == 1\nassert f(2) == 2')).toContain('3 dòng assert');
  });
  it('đòi ca biên', () => {
    const t = 'assert f([1]) == 1\nassert f([2]) == 2\nassert f([3]) == 3';
    expect(validateTests(t)).toContain('ca biên');
  });
  it('từ chối ___', () => {
    const t = 'assert f([]) == ___\nassert f([1]) == 1\nassert f(None) == None';
    expect(validateTests(t)).toContain('___');
  });
  it('đạt khi đủ 3 assert + ca biên', () => {
    const t = 'assert f([]) == 0\nassert f([1]) == 1\nassert f(None) == 0';
    expect(validateTests(t)).toBeNull();
  });
});

describe('guard helpers', () => {
  it('guardRef trích phần hàng rào', () => {
    const g = guardRef(REF);
    expect(g).toContain('raise TypeError');
    expect(g).toContain('raise ValueError');
    expect(g).toContain('return None');
    expect(g).not.toContain('best = nums[0]');
  });
  it('guardStart tạo khung guard', () => {
    const s = guardStart('def find_max(nums):\n    pass\n');
    expect(s).toContain('def find_max(nums):');
    expect(s).toContain('Hàng rào');
  });
  it('parseGuardHits đọc G|', () => {
    expect(parseGuardHits('x\nG|0\nG|2\n')).toEqual([0, 2]);
    expect(parseGuardHits('nothing')).toEqual([]);
  });
  it('errChk dựng code kiểm tra', () => {
    const errs: [string, string][] = [['find_max([])', 'ValueError']];
    const s = errChk(errs, [0]);
    expect(s).toContain('find_max([])');
    expect(s).toContain('except ValueError');
  });
  it('buildHiddenTests có DO: khi sai', () => {
    const hid: [string, string][] = [['find_max([1,2])', '2']];
    const s = buildHiddenTests('def find_max(nums):\n    return 0', hid, [], 'happy');
    expect(s).toContain('DO:');
    expect(s).toContain('r = find_max([1,2])');
  });
  it('buildEmptyRun tạo hàm rỗng', () => {
    const s = buildEmptyRun('find_max', 'assert True');
    expect(s).toContain('def find_max(*a):');
    expect(s).toContain('return None');
  });
  it('buildGuardProbe in G| cho ca raise đúng', () => {
    const errs: [string, string][] = [['find_max([])', 'ValueError']];
    const s = buildGuardProbe(REF, errs);
    expect(s).toContain('print("G|0")');
  });
  it('mergeCore gộp guard với thân', () => {
    const user = 'def find_max(nums):\n    if not isinstance(nums, list):\n        raise TypeError("x")\n    pass\n';
    const cs = 'def find_max(nums):\n    # comment\n    best = nums[0]\n    return best\n';
    const m = mergeCore(user, cs);
    expect(m).toContain('raise TypeError');
    expect(m).toContain('best = nums[0]');
  });
});
