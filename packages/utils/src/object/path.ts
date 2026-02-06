/**
 * 路径类型定义
 */
export type PathKey = string | number | symbol;
export type Path = string | readonly PathKey[];

/**
 * 将路径转换为键数组
 * @example
 * toPath('a.b.c') // ['a', 'b', 'c']
 * toPath('a[0].b') // ['a', '0', 'b']
 * toPath(['a', 0, 'b']) // ['a', 0, 'b']
 */
export function toPath(path: Path): PathKey[] {
  if (Array.isArray(path)) return [...path];

  return (path as string)
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);
}

/**
 * 从对象中获取嵌套路径的值
 */
export function getByPath<T = any>(obj: any, path: Path): T | undefined {
  const keys = toPath(path);
  let current = obj;

  for (const key of keys) {
    if (current == null) return undefined;
    current = current[key];
  }

  return current;
}

/**
 * 在对象中设置嵌套路径的值
 */
export function setByPath(obj: any, path: Path, value: any): void {
  const keys = toPath(path);
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];

    current[key] ??= typeof nextKey === 'number' ? [] : {};
    current = current[key];
  }

  const lastKey = keys[keys.length - 1];
  if (lastKey !== undefined) {
    current[lastKey] = value;
  }
}

/**
 * 从对象中删除嵌套路径的值
 */
export function unsetByPath(obj: any, path: Path): void {
  const keys = toPath(path);
  if (keys.length === 0) return;

  const lastKey = keys[keys.length - 1];
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    current = current?.[keys[i]];
    if (current == null) return;
  }

  if (current && lastKey !== undefined) {
    delete current[lastKey];
  }
}
