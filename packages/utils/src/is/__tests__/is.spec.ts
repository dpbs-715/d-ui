import { describe, expect, it } from 'vitest';
import { is, isObject, isArray, isFunction, isNumber, isString, isEmpty } from '../index';

describe('is utils', () => {
  describe('is', () => {
    it('should correctly identify Object type', () => {
      expect(is({}, 'Object')).toBe(true);
      expect(is([], 'Object')).toBe(false);
    });

    it('should correctly identify Array type', () => {
      expect(is([], 'Array')).toBe(true);
      expect(is({}, 'Array')).toBe(false);
    });

    it('should correctly identify String type', () => {
      expect(is('hello', 'String')).toBe(true);
      expect(is(123, 'String')).toBe(false);
    });
  });

  describe('isObject', () => {
    it('should return true for plain objects', () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
    });

    it('should return false for null', () => {
      expect(isObject(null)).toBe(false);
    });

    it('should return false for arrays', () => {
      expect(isObject([])).toBe(false);
    });

    it('should return false for primitives', () => {
      expect(isObject(123)).toBe(false);
      expect(isObject('string')).toBe(false);
      expect(isObject(true)).toBe(false);
    });
  });

  describe('isArray', () => {
    it('should return true for arrays', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
    });

    it('should return false for non-arrays', () => {
      expect(isArray({})).toBe(false);
      expect(isArray('array')).toBe(false);
    });

    it('should return falsy for null and undefined', () => {
      // isArray 实现为 val && Array.isArray(val)，null 会返回 null (falsy)
      expect(isArray(null)).toBeFalsy();
      expect(isArray(undefined)).toBeFalsy();
    });
  });

  describe('isFunction', () => {
    it('should return true for functions', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function () {})).toBe(true);
      expect(isFunction(async () => {})).toBe(true);
    });

    it('should return false for non-functions', () => {
      expect(isFunction({})).toBe(false);
      expect(isFunction([])).toBe(false);
      expect(isFunction('function')).toBe(false);
    });
  });

  describe('isNumber', () => {
    it('should return true for numbers', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber(0)).toBe(true);
      expect(isNumber(-123)).toBe(true);
      expect(isNumber(3.14)).toBe(true);
    });

    it('should return true for NaN (as it is technically a Number type)', () => {
      // NaN 的类型是 Number，Object.prototype.toString.call(NaN) === '[object Number]'
      expect(isNumber(NaN)).toBe(true);
    });

    it('should return false for non-numbers', () => {
      expect(isNumber('123')).toBe(false);
      expect(isNumber(null)).toBe(false);
      expect(isNumber(undefined)).toBe(false);
    });
  });

  describe('isString', () => {
    it('should return true for strings', () => {
      expect(isString('hello')).toBe(true);
      expect(isString('')).toBe(true);
      expect(isString('123')).toBe(true);
    });

    it('should return false for non-strings', () => {
      expect(isString(123)).toBe(false);
      expect(isString(null)).toBe(false);
      expect(isString({})).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true for null and undefined', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should check array length', () => {
      expect(isEmpty([])).toBe(true);
      expect(isEmpty([1, 2, 3])).toBe(false);
    });

    it('should check string length', () => {
      expect(isEmpty('')).toBe(true);
      expect(isEmpty('hello')).toBe(false);
    });

    it('should check Map size', () => {
      expect(isEmpty(new Map())).toBe(true);
      const map = new Map();
      map.set('key', 'value');
      expect(isEmpty(map)).toBe(false);
    });

    it('should check Set size', () => {
      expect(isEmpty(new Set())).toBe(true);
      const set = new Set();
      set.add(1);
      expect(isEmpty(set)).toBe(false);
    });

    it('should check object keys', () => {
      expect(isEmpty({})).toBe(true);
      expect(isEmpty({ a: 1 })).toBe(false);
    });

    it('should return false for non-empty primitives', () => {
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
      expect(isEmpty(123)).toBe(false);
    });
  });
});
