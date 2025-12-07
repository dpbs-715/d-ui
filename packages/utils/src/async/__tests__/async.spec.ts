import { beforeEach, describe, expect, it, vi } from 'vitest';
import { asyncCache, asyncCacheWithHistory } from '../index';
import { CACHE_TYPE, _memoryCache } from '../../cache';

describe('async utils', () => {
  beforeEach(() => {
    _memoryCache.clear();
  });

  describe('asyncCache', () => {
    it('should cache async function results', async () => {
      let callCount = 0;
      const asyncFn = async (value: number) => {
        callCount++;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return value * 2;
      };

      const cachedFn = asyncCache(asyncFn);

      const result1 = await cachedFn(5);
      // 等待第一个调用完成后再调用第二次
      await new Promise((resolve) => setTimeout(resolve, 20));
      const result2 = await cachedFn(5);

      expect(result1).toBe(10);
      expect(result2).toBe(10);
      expect(callCount).toBe(2); // 没有持久化缓存时，会调用两次
    });

    it('should handle different arguments separately', async () => {
      let callCount = 0;
      const asyncFn = async (value: number) => {
        callCount++;
        return value * 2;
      };

      const cachedFn = asyncCache(asyncFn);

      await cachedFn(5);
      await cachedFn(10);

      expect(callCount).toBe(2); // 不同参数应该分别调用
    });

    it('should handle multiple concurrent calls with same arguments', async () => {
      let callCount = 0;
      const asyncFn = async (value: number) => {
        callCount++;
        await new Promise((resolve) => setTimeout(resolve, 100));
        return value * 2;
      };

      const cachedFn = asyncCache(asyncFn);

      const [result1, result2, result3] = await Promise.all([
        cachedFn(5),
        cachedFn(5),
        cachedFn(5),
      ]);

      expect(result1).toBe(10);
      expect(result2).toBe(10);
      expect(result3).toBe(10);
      expect(callCount).toBe(1); // 并发调用应该只执行一次
    });

    it('should handle rejected promises', async () => {
      let callCount = 0;
      const asyncFn = async (value: number) => {
        callCount++;
        if (value < 0) {
          throw new Error('Negative value');
        }
        return value * 2;
      };

      const cachedFn = asyncCache(asyncFn);

      await expect(cachedFn(-5)).rejects.toThrow('Negative value');
      expect(callCount).toBe(1);
    });

    it('should have __D__ marker property', () => {
      const asyncFn = async (value: number) => value * 2;
      const cachedFn = asyncCache(asyncFn);

      expect((cachedFn as any).__D__).toBe(true);
      expect((cachedFn as any).__DT__).toBe('asyncCache');
    });
  });

  describe('asyncCache with storage cache', () => {
    it('should use memory cache when cacheType is provided', async () => {
      let callCount = 0;
      const asyncFn = async (value: number) => {
        callCount++;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return value * 2;
      };

      const cachedFn = asyncCache(asyncFn, {
        cacheType: CACHE_TYPE.memory,
        cacheKey: 'test-key',
      });

      const result1 = await cachedFn(5);
      // 等待确保第一次调用完成
      await new Promise((resolve) => setTimeout(resolve, 20));
      const result2 = await cachedFn(5);

      expect(result1).toBe(10);
      expect(result2).toBe(10);
      expect(callCount).toBe(1); // 有缓存时应该只调用一次
    });

    it('should respect cache expiration', async () => {
      let callCount = 0;
      const asyncFn = async (value: number) => {
        callCount++;
        return value * 2;
      };

      const cachedFn = asyncCache(asyncFn, {
        cacheType: CACHE_TYPE.memory,
        cacheKey: 'test-expire-key',
        expireTime: 100, // 100ms过期
      });

      await cachedFn(5);
      expect(callCount).toBe(1);

      // 立即再调用，应该使用缓存
      await cachedFn(5);
      expect(callCount).toBe(1);

      // 等待超过过期时间
      await new Promise((resolve) => setTimeout(resolve, 150));

      // 已过期，应该重新调用
      await cachedFn(5);
      expect(callCount).toBe(2);
    });

    it('should use custom cache key', async () => {
      let callCount = 0;
      const asyncFn = async (value: number) => {
        callCount++;
        return value * 2;
      };

      const cachedFn1 = asyncCache(asyncFn, {
        cacheType: CACHE_TYPE.memory,
        cacheKey: 'key1',
      });

      const cachedFn2 = asyncCache(asyncFn, {
        cacheType: CACHE_TYPE.memory,
        cacheKey: 'key2',
      });

      await cachedFn1(5);
      await cachedFn2(5);

      // 不同的 cacheKey，应该各自缓存
      expect(callCount).toBe(2);
    });

    it('should use version in cache', async () => {
      let callCount = 0;
      const asyncFn = async (value: number) => {
        callCount++;
        return value * 2;
      };

      const cachedFn1 = asyncCache(asyncFn, {
        cacheType: CACHE_TYPE.memory,
        cacheKey: 'test-key',
        version: 'v1.0.0',
      });

      const cachedFn2 = asyncCache(asyncFn, {
        cacheType: CACHE_TYPE.memory,
        cacheKey: 'test-key',
        version: 'v2.0.0',
      });

      await cachedFn1(5);
      await cachedFn2(5);

      // 不同版本应该分别缓存
      expect(callCount).toBe(2);
    });
  });

  describe('asyncCacheWithHistory', () => {
    it('should reuse cached wrapper for same function', () => {
      const asyncFn = async (value: number) => value * 2;

      const cachedFn1 = asyncCacheWithHistory(asyncFn);
      const cachedFn2 = asyncCacheWithHistory(asyncFn);

      // 应该返回同一个包装实例
      expect(cachedFn1).toBe(cachedFn2);
    });

    it('should create different wrappers for different functions', () => {
      const asyncFn1 = async (value: number) => value * 2;
      const asyncFn2 = async (value: number) => value * 3;

      const cachedFn1 = asyncCacheWithHistory(asyncFn1);
      const cachedFn2 = asyncCacheWithHistory(asyncFn2);

      expect(cachedFn1).not.toBe(cachedFn2);
    });

    it('should work correctly with history - concurrent calls', async () => {
      let callCount = 0;
      const asyncFn = async (value: number) => {
        callCount++;
        await new Promise((resolve) => setTimeout(resolve, 50));
        return value * 2;
      };

      const cachedFn1 = asyncCacheWithHistory(asyncFn);
      const cachedFn2 = asyncCacheWithHistory(asyncFn);

      // cachedFn1 和 cachedFn2 应该是同一个实例
      expect(cachedFn1).toBe(cachedFn2);

      // 并发调用 - 应该只执行一次异步函数
      const [result1, result2] = await Promise.all([cachedFn1(5), cachedFn2(5)]);

      expect(result1).toBe(10);
      expect(result2).toBe(10);
      // 并发调用共享同一个 Promise，只执行一次
      expect(callCount).toBe(1);
    });
  });

  describe('asyncCache edge cases', () => {
    it('should handle complex argument types', async () => {
      let callCount = 0;
      const asyncFn = async (obj: { a: number; b: string }) => {
        callCount++;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return obj.a + obj.b.length;
      };

      const cachedFn = asyncCache(asyncFn);

      const arg = { a: 5, b: 'hello' };
      const result1 = await cachedFn(arg);
      await new Promise((resolve) => setTimeout(resolve, 20));
      const result2 = await cachedFn(arg);

      expect(result1).toBe(10);
      expect(result2).toBe(10);
      // 没有持久化缓存时，每次都会重新执行
      expect(callCount).toBe(2);
    });

    it('should handle multiple arguments', async () => {
      let callCount = 0;
      const asyncFn = async (a: number, b: number, c: number) => {
        callCount++;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return a + b + c;
      };

      const cachedFn = asyncCache(asyncFn);

      const result1 = await cachedFn(1, 2, 3);
      await new Promise((resolve) => setTimeout(resolve, 20));
      const result2 = await cachedFn(1, 2, 3);

      expect(result1).toBe(6);
      expect(result2).toBe(6);
      expect(callCount).toBe(2);
    });

    it('should handle no arguments', async () => {
      let callCount = 0;
      const asyncFn = async () => {
        callCount++;
        await new Promise((resolve) => setTimeout(resolve, 10));
        return 'result';
      };

      const cachedFn = asyncCache(asyncFn);

      const result1 = await cachedFn();
      await new Promise((resolve) => setTimeout(resolve, 20));
      const result2 = await cachedFn();

      expect(result1).toBe('result');
      expect(result2).toBe('result');
      expect(callCount).toBe(2);
    });
  });
});
