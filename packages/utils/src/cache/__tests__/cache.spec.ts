import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Cache, CACHE_TYPE, _memoryCache } from '../index';

describe('cache utils', () => {
  beforeEach(() => {
    _memoryCache.clear();
  });

  describe('Cache with memory storage', () => {
    it('should set and get data from memory cache', () => {
      const cache = new Cache(CACHE_TYPE.memory, 'test-key', 'v1.0.0');
      const testData = { name: 'test', value: 123 };

      cache.set(testData);
      const result = cache.get();

      expect(result).toEqual(testData);
    });

    it('should return null for non-existent key', () => {
      const cache = new Cache(CACHE_TYPE.memory, 'non-existent', 'v1.0.0');
      expect(cache.get()).toBeNull();
    });

    it('should handle multiple versions', () => {
      const cache1 = new Cache(CACHE_TYPE.memory, 'test-key', 'v1.0.0');
      const cache2 = new Cache(CACHE_TYPE.memory, 'test-key', 'v2.0.0');

      cache1.set({ version: 1 });
      expect(cache1.get()).toEqual({ version: 1 });

      cache2.set({ version: 2 });

      expect(cache1.get()).toEqual({ version: 1 });
      expect(cache2.get()).toEqual({ version: 2 });
    });

    it('should remove specific version', () => {
      const cache1 = new Cache(CACHE_TYPE.memory, 'test-key', 'v1.0.0');
      const cache2 = new Cache(CACHE_TYPE.memory, 'test-key', 'v2.0.0');

      cache1.set({ version: 1 });
      cache2.set({ version: 2 });

      cache1.remove();

      expect(cache1.get()).toBeNull();
      expect(cache2.get()).toEqual({ version: 2 });
    });

    it('should remove all versions with removeAll', () => {
      const cache1 = new Cache(CACHE_TYPE.memory, 'test-key', 'v1.0.0');
      const cache2 = new Cache(CACHE_TYPE.memory, 'test-key', 'v2.0.0');

      cache1.set({ version: 1 });
      cache2.set({ version: 2 });

      cache1.removeAll();

      expect(cache1.get()).toBeNull();
      expect(cache2.get()).toBeNull();
    });

    it('should clear all cache', () => {
      const cache1 = new Cache(CACHE_TYPE.memory, 'key1', 'v1.0.0');
      const cache2 = new Cache(CACHE_TYPE.memory, 'key2', 'v1.0.0');

      cache1.set({ data: 1 });
      cache2.set({ data: 2 });

      cache1.clear();

      expect(cache1.get()).toBeNull();
      expect(cache2.get()).toBeNull();
    });
  });

  describe('Cache expiration', () => {
    it('should return null for expired cache', () => {
      const startTime = 1700000000000;
      const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(startTime);

      const cache = new Cache(CACHE_TYPE.memory, 'test-key', 'v1.0.0', 1000); // 1秒过期

      cache.set({ data: 'test' });

      // 未过期时应该能获取
      expect(cache.get()).toEqual({ data: 'test' });

      // 前进时间 1.5 秒
      dateNowSpy.mockReturnValue(startTime + 1500);

      // 已过期，应该返回 null
      expect(cache.get()).toBeNull();

      dateNowSpy.mockRestore();
    });

    it('should not expire if expireTime is 0', () => {
      const startTime = 1700000000000;
      const dateNowSpy = vi.spyOn(Date, 'now').mockReturnValue(startTime);

      const cache = new Cache(CACHE_TYPE.memory, 'test-key', 'v1.0.0', 0); // 不过期

      cache.set({ data: 'test' });

      // 前进很长时间
      dateNowSpy.mockReturnValue(startTime + 999999999);

      // 不应该过期
      expect(cache.get()).toEqual({ data: 'test' });

      dateNowSpy.mockRestore();
    });

    it('should return null if expireTime changed', () => {
      const cache1 = new Cache(CACHE_TYPE.memory, 'test-key', 'v1.0.0', 1000);
      cache1.set({ data: 'test' });

      // 使用不同的 expireTime 读取
      const cache2 = new Cache(CACHE_TYPE.memory, 'test-key', 'v1.0.0', 2000);
      expect(cache2.get()).toBeNull();
    });
  });

  describe('Cache with different storage types', () => {
    it('should throw error for localStorage in non-browser environment', () => {
      expect(() => {
        new Cache(CACHE_TYPE.localStorage, 'test-key', 'v1.0.0');
      }).toThrow('window is not defined');
    });

    it('should throw error for sessionStorage in non-browser environment', () => {
      expect(() => {
        new Cache(CACHE_TYPE.sessionStorage, 'test-key', 'v1.0.0');
      }).toThrow('window is not defined');
    });
  });

  describe('Cache data types', () => {
    it('should handle string data', () => {
      const cache = new Cache(CACHE_TYPE.memory, 'test-key', 'v1.0.0');
      cache.set('hello world');
      expect(cache.get()).toBe('hello world');
    });

    it('should handle number data', () => {
      const cache = new Cache(CACHE_TYPE.memory, 'test-key', 'v1.0.0');
      cache.set(42);
      expect(cache.get()).toBe(42);
    });

    it('should handle boolean data', () => {
      const cache = new Cache(CACHE_TYPE.memory, 'test-key', 'v1.0.0');
      cache.set(true);
      expect(cache.get()).toBe(true);
    });

    it('should handle array data', () => {
      const cache = new Cache(CACHE_TYPE.memory, 'test-key', 'v1.0.0');
      const arr = [1, 2, 3, 4];
      cache.set(arr);
      expect(cache.get()).toEqual(arr);
    });

    it('should handle complex object data', () => {
      const cache = new Cache(CACHE_TYPE.memory, 'test-key', 'v1.0.0');
      const data = {
        name: 'test',
        nested: {
          value: 123,
          array: [1, 2, 3],
        },
      };
      cache.set(data);
      expect(cache.get()).toEqual(data);
    });
  });
});
