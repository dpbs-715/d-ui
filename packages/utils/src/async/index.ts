import { CACHE_TYPE, Cache } from '../cache';

type CacheState = {
  resolve: ((res: any) => void)[];
  reject: ((err: any) => void)[];
  isPending: boolean;
};

//函数包装记录
const asyncCacheHistory = new Map<string, any>();

/**
 * asyncCache是包装一次闭包存贮状态
 * 如果有情况是需要多次包装 需要检查包装记录使用下面方法
 * */
export function asyncCacheWithHistory(asyncFn: any, ...args: any) {
  const cache = asyncCacheHistory.get(getFunctionHash(asyncFn));
  if (cache) {
    return cache;
  } else {
    let fn = asyncCache(asyncFn, ...args);
    asyncCacheHistory.set(getFunctionHash(asyncFn), fn);
    return fn;
  }
}

export function asyncCache(
  asyncFun: (...args: any[]) => Promise<any>,
  {
    expireTime = 0,
    cacheKey = getFunctionHash(asyncFun),
    version = 'v1.0.0',
    cacheType = undefined,
  }: {
    expireTime?: number;
    cacheKey?: string;
    version?: string;
    cacheType?: CACHE_TYPE | undefined;
  } = {},
) {
  const map: Record<string, CacheState | null> = {};

  const fn = (...args: any[]) => {
    return new Promise((resolve, reject) => {
      const argsKey = JSON.stringify(args);

      if (!map[argsKey]) {
        map[argsKey] = {
          resolve: [],
          reject: [],
          isPending: false,
        };
      }
      let state = map[argsKey];
      state?.resolve.push(resolve);
      state?.reject.push(reject);
      if (state.isPending) return;
      state.isPending = true;

      let cache: Cache | undefined;
      if (cacheType) {
        cache = new Cache(cacheType, `${cacheKey}-${argsKey}`, version, expireTime);
      }
      const result = cache?.get();
      if (result) {
        resolve(result);
        return;
      }

      asyncFun(...args)
        .then((res) => {
          cache?.set(res);
          state?.resolve.forEach((resolve: Function) => resolve(res));
        })
        .catch((err) => {
          state?.reject.forEach((reject: Function) => reject(err));
        })
        .finally(() => {
          delete map[argsKey];
        });
    });
  };

  fn.__D__ = true;
  fn.__DT__ = 'asyncCache';

  return fn;
}

function normalizeFunctionString(fnStr: string) {
  return fnStr
    .replace(/\s+/g, ' ') // 多个空白变成单个空格
    .trim(); // 去掉首尾空格
}
function strToHash(str: string) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return Math.abs(hash).toString(36); // 或者 .toString(16)
}
function getFunctionHash(fn: Function) {
  const rawFnStr = fn.toString();
  const normalizedFnStr = normalizeFunctionString(rawFnStr);
  return strToHash(normalizedFnStr);
}
