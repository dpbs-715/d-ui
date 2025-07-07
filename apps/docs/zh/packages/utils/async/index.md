# async异步包装器

## asyncOnce

> 包装异步任务,在时间范围内只执行一次。

```ts
import { asyncOnce } from '@DLib/utils';

export function getApi(query) {
  return axios({
    url: '',
    method: 'get',
    params: query,
  });
}
// 参数1 异步方法  参数2 缓存时间
export const oncegetApi = asyncOnce(getApi, 3000);
```
