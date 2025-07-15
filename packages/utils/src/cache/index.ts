export enum CACHE_TYPE {
  localStorage = 'localStorage',
  sessionStorage = 'sessionStorage',
  memory = 'memory',
}
export const _memoryCache = new Map();

export class Cache {
  storage: any;
  constructor(
    type: CACHE_TYPE,
    private cacheKey: string,
    private version: string,
    private expireTime: number,
  ) {
    this.storage = this.getCacheSource(type);
  }

  set(data: any) {
    const cache = this.storage.getItem(this.cacheKey);
    let o;
    if (cache) {
      const cacheData = JSON.parse(cache);
      o = {
        ...cacheData,
        [this.version]: {
          data,
          expireTime: this.expireTime,
          time: Date.now(),
        },
      };
    } else {
      o = {
        [this.version]: {
          data,
          expireTime: this.expireTime,
          time: Date.now(),
        },
      };
    }
    this.storage.setItem(this.cacheKey, JSON.stringify(o));
  }
  get(): any {
    const cache = this.storage.getItem(this.cacheKey);
    if (!cache) {
      return null;
    }
    const cacheData = JSON.parse(cache);
    if (!cacheData[this.version]) {
      return null;
    }
    const { data, expireTime, time } = cacheData[this.version];
    if (expireTime != this.expireTime) {
      this.remove();
      return null;
    }
    if (expireTime && time + expireTime < Date.now()) {
      this.remove();
      return null;
    } else {
      return data;
    }
  }
  remove() {
    const cache = this.storage.getItem(this.cacheKey);
    if (!cache) {
      return;
    }
    const cacheData = JSON.parse(cache);
    delete cacheData[this.version];
    if (Object.keys(cacheData).length === 0) {
      this.storage.removeItem(this.cacheKey);
    } else {
      this.storage.setItem(this.cacheKey, JSON.stringify(cacheData));
    }
  }
  removeAll() {
    this.storage.removeItem(this.cacheKey);
  }
  clear() {
    this.storage.clear();
  }

  getCacheSource(type: CACHE_TYPE) {
    switch (type) {
      case CACHE_TYPE.localStorage:
      case CACHE_TYPE.sessionStorage:
        if (typeof window !== 'undefined') {
          return window[type];
        } else {
          throw new Error('window is not defined');
        }
      case CACHE_TYPE.memory:
        return {
          getItem: (key: string) => {
            return _memoryCache.get(key);
          },
          setItem: (key: string, value: any) => {
            _memoryCache.set(key, value);
          },
          removeItem: (key: string) => {
            _memoryCache.delete(key);
          },
          clear: () => {
            _memoryCache.clear();
          },
        };
    }
  }
}
