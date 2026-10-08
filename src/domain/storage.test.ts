import { beforeEach, describe, expect, it } from 'vitest';
import { createDefaultProgress } from './progress';
import { LocalProgressStorage, STORAGE_KEY } from './storage';

/** localStorage mock trong môi trường node (vite.config chưa set test environment) */
function installLocalStorageMock(): Map<string, string> {
  const store = new Map<string, string>();
  const mock = {
    getItem: (key: string): string | null => store.get(key) ?? null,
    setItem: (key: string, value: string): void => {
      store.set(key, value);
    },
    removeItem: (key: string): void => {
      store.delete(key);
    },
    clear: (): void => {
      store.clear();
    },
    key: (index: number): string | null => [...store.keys()][index] ?? null,
    get length(): number {
      return store.size;
    },
  };
  Object.defineProperty(globalThis, 'localStorage', { value: mock, configurable: true, writable: true });
  return store;
}

describe('LocalProgressStorage', () => {
  let store: Map<string, string>;
  let storage: LocalProgressStorage;

  beforeEach(() => {
    store = installLocalStorageMock();
    storage = new LocalProgressStorage();
  });

  it('load khi chưa có gì trả về default', () => {
    expect(storage.load()).toEqual(createDefaultProgress());
  });

  it('load dữ liệu hợp lệ: giữ giá trị, thiếu field thì default', () => {
    store.set(
      STORAGE_KEY,
      '{"done":{"k1":1},"pr":{"k1":{"p":2,"f":0,"miss":{},"last":"2026-10-01","days":["2026-10-01"]}}}',
    );
    const s = storage.load();
    expect(s.done['k1']).toBe(1);
    expect(s.pr['k1']?.p).toBe(2);
    expect(s.weak).toEqual({});
    expect(s.hc).toEqual({ seen: {}, fail: {} });
    expect(s.lt).toEqual({});
  });

  it('load JSON hỏng trả về default, không crash', () => {
    store.set(STORAGE_KEY, '{khong-phai-json');
    expect(storage.load()).toEqual(createDefaultProgress());
  });

  it('load chuỗi "null" trả về default', () => {
    store.set(STORAGE_KEY, 'null');
    expect(storage.load()).toEqual(createDefaultProgress());
  });

  it('load khi getItem ném lỗi trả về default', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: (): string | null => {
          throw new Error('blocked');
        },
        setItem: (): void => {},
      },
      configurable: true,
      writable: true,
    });
    expect(storage.load()).toEqual(createDefaultProgress());
  });

  it('save ghi JSON đúng key "dsa"', () => {
    const s = { ...createDefaultProgress(), done: { k1: 1 as const } };
    storage.save(s);
    const raw = store.get(STORAGE_KEY);
    expect(raw).toBeDefined();
    const parsed = JSON.parse(raw ?? '') as { done: Record<string, number> };
    expect(parsed.done).toEqual({ k1: 1 });
  });

  it('save/load roundtrip giữ nguyên dữ liệu', () => {
    const s = { ...createDefaultProgress(), done: { k1: 1 as const, k2: 1 as const } };
    storage.save(s);
    expect(storage.load().done).toEqual({ k1: 1, k2: 1 });
  });

  it('save không ném khi setItem lỗi (storage đầy)', () => {
    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: (): string | null => null,
        setItem: (): void => {
          throw new Error('full');
        },
      },
      configurable: true,
      writable: true,
    });
    expect(() => {
      storage.save(createDefaultProgress());
    }).not.toThrow();
  });
});
