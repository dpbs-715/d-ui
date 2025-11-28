# Cache

## Cache

> Cache utility

```text
cacheType -> Cache type
  localStorage local
  sessionStorage session
  memory runtime memory
cacheKey -> Cache key (string)
version -> Version number (string)
expireTime -> Expiration time (timestamp, optional)
```

```ts
const c = new Cache(cacheType, cacheKey, version, expireTime);
// Set data
c.set(data);
// Get data
c.get();
// Remove current version data for cacheKey
c.remove();
// Remove all data for cacheKey
c.removeAll();
// Clear all
c.clear();
```
