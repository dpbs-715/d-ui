import { getByPath, setByPath, type Path } from './path';

/**
 * 从对象中选取指定路径的属性
 * @param obj 源对象
 * @param paths 要选取的路径数组
 * @returns 包含选取属性的新对象
 * @example
 * const obj = { a: 1, b: { c: 2 }, d: 3 };
 * pick(obj, ['a', 'b.c']) // { a: 1, b: { c: 2 } }
 */
export function pick<T extends object>(obj: T, paths: readonly Path[]): Partial<T> {
  const result: any = {};

  for (const path of paths) {
    const value = getByPath(obj, path);
    if (value !== undefined) {
      setByPath(result, path, value);
    }
  }

  return result;
}
