import { CACHE_TYPE, Cache } from '../cache';

type CacheState = {
  resolve: ((res: any) => void)[];
  reject: ((err: any) => void)[];
  isPending: boolean;
};

export function asyncCache(
  asyncFun: (...args: any[]) => Promise<any>,
  {
    expireTime = 0,
    cacheKey = asyncFun.name,
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
  return (...args: any[]) => {
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
}
