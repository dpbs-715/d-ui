import { describe, expect, it } from 'vitest';
import { omit } from '../omit';

describe('omit', () => {
  it('should omit simple properties', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = omit(obj, ['b']);
    expect(result).toEqual({ a: 1, c: 3 });
  });

  it('should omit multiple properties', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    const result = omit(obj, ['a', 'c']);
    expect(result).toEqual({ b: 2, d: 4 });
  });

  it('should omit nested properties', () => {
    const obj = { a: { b: { c: 3 } }, d: 4 };
    const result = omit(obj, ['a.b.c']);
    expect(result).toEqual({ a: { b: {} }, d: 4 });
  });

  it('should handle array paths', () => {
    const obj = { a: { b: { c: 3 } } };
    const result = omit(obj, [['a', 'b', 'c']]);
    expect(result).toEqual({ a: { b: {} } });
  });

  it('should omit array elements', () => {
    const obj = { arr: [1, 2, 3] };
    const result = omit(obj, ['arr[1]']);
    expect(result.arr![0]).toBe(1);
    expect(result.arr![1]).toBeUndefined();
    expect(result.arr![2]).toBe(3);
  });

  it('should handle non-existent paths gracefully', () => {
    const obj = { a: 1, b: 2 };
    const result = omit(obj, ['c', 'd']);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should handle empty paths array', () => {
    const obj = { a: 1, b: 2 };
    const result = omit(obj, []);
    expect(result).toEqual({ a: 1, b: 2 });
  });

  it('should not mutate original object', () => {
    const obj = { a: { b: 1 }, c: 2 };
    const result = omit(obj, ['a.b']);
    result.c = 999;
    expect(obj.c).toBe(2); // Original unchanged
    expect(obj.a.b).toBe(1); // Nested original unchanged
  });

  it('should deep clone the object', () => {
    const obj = { a: { b: 1 }, c: 2 };
    const result = omit(obj, ['c']);
    result.a!.b = 999;
    expect(obj.a.b).toBe(1); // Original unchanged
  });

  it('should omit multiple nested paths', () => {
    const obj = {
      user: {
        name: 'Alice',
        age: 30,
        address: {
          city: 'NYC',
          zip: '10001',
        },
      },
      status: 'active',
    };
    const result = omit(obj, ['user.age', 'user.address.zip']);
    expect(result).toEqual({
      user: {
        name: 'Alice',
        address: {
          city: 'NYC',
        },
      },
      status: 'active',
    });
  });

  it('should handle complex nested structures', () => {
    const obj = {
      users: [
        { name: 'Alice', age: 30, email: 'alice@example.com' },
        { name: 'Bob', age: 25, email: 'bob@example.com' },
      ],
    };
    const result = omit(obj, ['users[0].email', 'users[1].age']);
    expect(result.users![0].name).toBe('Alice');
    expect(result.users![0].email).toBeUndefined();
    expect(result.users![1].age).toBeUndefined();
  });

  it('should preserve special types during cloning', () => {
    const date = new Date('2024-01-01');
    const regex = /test/gi;
    const obj = { date, regex, num: 42 };
    const result = omit(obj, ['num']);
    expect(result.date).toBeInstanceOf(Date);
    expect(result.date!.getTime()).toBe(date.getTime());
    expect(result.regex).toBeInstanceOf(RegExp);
    expect(result.regex!.source).toBe(regex.source);
  });

  it('should handle Map and Set during cloning', () => {
    const map = new Map([['key', 'value']]);
    const set = new Set([1, 2, 3]);
    const obj = { map, set, other: 'data' };
    const result = omit(obj, ['other']);
    expect(result.map).toBeInstanceOf(Map);
    expect(result.map!.get('key')).toBe('value');
    expect(result.set).toBeInstanceOf(Set);
    expect(result.set!.has(2)).toBe(true);
  });

  it('should handle circular references', () => {
    const obj: any = { a: 1, b: 2 };
    obj.self = obj;
    const result = omit(obj, ['b']);
    expect(result.a).toBe(1);
    expect(result.self).toBe(result);
  });

  it('should work with mixed path formats', () => {
    const obj = { a: { b: [1, 2, 3] } };
    const result = omit(obj, ['a.b[1]', ['a', 'b', 2]]);
    expect(result.a!.b[0]).toBe(1);
    expect(result.a!.b[1]).toBeUndefined();
    expect(result.a!.b[2]).toBeUndefined();
  });

  it('should omit all properties when all paths are specified', () => {
    const obj = { a: 1, b: 2, c: 3 };
    const result = omit(obj, ['a', 'b', 'c']);
    expect(result).toEqual({});
  });
});
