# cache

## Cache

> 使用缓存

```text
cacheType->缓存类型
  localStorage local
  sessionStorage session
  memory 运行时内存
cacheKey->缓存关键词 字符串
version->版本号 字符串
expireTime->获取时间 时间戳  可选
```

```ts
const c = new Cache(cacheType, cacheKey, version, expireTime);
//设置数据
c.set(data);
//获取数据
c.get();
//删除cacheKey当前版本数据
c.remove();
//删除cacheKey所有数据
c.removeAll();
//清空所有
c.clear();
```
