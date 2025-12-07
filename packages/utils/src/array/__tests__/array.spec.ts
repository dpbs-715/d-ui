import { describe, expect, it } from 'vitest';
import { unique, chunk } from '../index';

describe('array utils', () => {
  describe('unique', () => {
    it('should remove duplicate values from array', () => {
      const input = [1, 2, 2, 3, 4, 4, 5];
      const result = unique(input);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return empty array when input is empty', () => {
      const result = unique([]);
      expect(result).toEqual([]);
    });

    it('should handle array with no duplicates', () => {
      const input = [1, 2, 3, 4, 5];
      const result = unique(input);
      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should work with string array', () => {
      const input = ['a', 'b', 'b', 'c', 'a'];
      const result = unique(input);
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should work with objects (by reference)', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const input = [obj1, obj2, obj1];
      const result = unique(input);
      expect(result).toEqual([obj1, obj2]);
    });
  });

  describe('chunk', () => {
    it('should split array into chunks of specified size', () => {
      const input = [1, 2, 3, 4, 5];
      const result = chunk(input, 2);
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('should return empty array when input is empty', () => {
      const result = chunk([], 2);
      expect(result).toEqual([]);
    });

    it('should handle chunk size larger than array length', () => {
      const input = [1, 2];
      const result = chunk(input, 5);
      expect(result).toEqual([[1, 2]]);
    });

    it('should handle chunk size of 1', () => {
      const input = [1, 2, 3];
      const result = chunk(input, 1);
      expect(result).toEqual([[1], [2], [3]]);
    });

    it('should handle chunk size equal to array length', () => {
      const input = [1, 2, 3, 4];
      const result = chunk(input, 4);
      expect(result).toEqual([[1, 2, 3, 4]]);
    });
  });
});
