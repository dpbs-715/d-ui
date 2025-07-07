/**
 * 同时多次重复调用时 截断后面请求 在首次请求完成后 使用resolve, reject
 * @return {Boolean}
 * @param cb api接口  return Promise对象
 * @param expireTime 缓存时间
 */
export function asyncOnce(cb: (...args: any[]) => Promise<any>, expireTime = 0) {
  const map: Record<
    string,
    {
      resolve: ((res: any) => void)[];
      reject: ((err: any) => void)[];
      isPending: boolean;
    } | null
  > = {};
  const cacheMap: Record<
    string,
    {
      success: null;
      error: null;
    } | null
  > = {};
  return (...args: any[]) => {
    return new Promise((resolve, reject) => {
      const key = JSON.stringify(args);
      if (!map[key]) {
        map[key] = {
          resolve: [],
          reject: [],
          isPending: false,
        };
      }
      if (!cacheMap[key]) {
        cacheMap[key] = {
          success: null,
          error: null,
        };
      } else {
        if (cacheMap[key]?.success) {
          resolve(cacheMap[key]?.success);
        } else if (cacheMap[key]?.error) {
          reject(cacheMap[key]?.error);
        }
      }
      const state: any = map[key];
      const cacheState: any = cacheMap[key];
      state?.resolve.push(resolve);
      state?.reject.push(reject);
      if (state.isPending) return;
      state.isPending = true;
      cb(...args)
        .then((res) => {
          cacheState.success = res;
          state?.resolve.forEach((resolve: Function) => resolve(res));
        })
        .catch((err) => {
          cacheState.error = err;
          state?.reject.forEach((reject: Function) => reject(err));
        })
        .finally(() => {
          delete map[key];
          setTimeout(() => {
            delete cacheMap[key];
          }, expireTime);
        });
    });
  };
}
