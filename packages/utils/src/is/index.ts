export const is = (val: unknown, type: string) => {
  return toString.call(val) === `[object ${type}]`;
};
export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, 'Object');
};
export const isArray = (val: any): val is Array<any> => {
  return val && Array.isArray(val);
};
export const isFunction = (val: unknown): val is Function => {
  return typeof val === 'function';
};

export const isNumber = (val: unknown): val is number => {
  return is(val, 'Number');
};

export const isString = (val: unknown): val is string => {
  return is(val, 'String');
};

export const isEmpty = <T = unknown>(val: T): val is T => {
  if (val === null || val === undefined) {
    return true;
  }
  if (isArray(val) || isString(val)) {
    return val.length === 0;
  }
  if (val instanceof Map || val instanceof Set) {
    return val.size === 0;
  }
  if (isObject(val)) {
    return Object.keys(val).length === 0;
  }
  return false;
};
