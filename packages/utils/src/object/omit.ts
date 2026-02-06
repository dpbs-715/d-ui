import { unsetByPath, type Path } from './path';
import { deepClone } from '../clone';

/**
 * 从对象中排除指定路径的属性
 * @param obj 源对象
 * @param paths 要排除的路径数组
 * @returns 排除指定属性后的新对象
 * @example
 * const obj = { a: 1, b: { c: 2 }, d: 3 };
 * omit(obj, ['a', 'b.c']) // { b: {}, d: 3 }
 */
export function omit<T extends object>(obj: T, paths: readonly Path[]): Partial<T> {
  const result = deepClone(obj);

  for (const path of paths) {
    unsetByPath(result, path);
  }

  return result;
}
