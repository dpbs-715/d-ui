import { describe, expect, it } from 'vitest';
import { capitalize, camelToKebab } from '../index';

describe('string utils', () => {
  describe('capitalize', () => {
    it('should capitalize first letter of string', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle already capitalized string', () => {
      expect(capitalize('Hello')).toBe('Hello');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).toBe('');
    });

    it('should only capitalize first letter', () => {
      expect(capitalize('hello world')).toBe('Hello world');
    });

    it('should handle string with numbers', () => {
      expect(capitalize('123abc')).toBe('123abc');
    });
  });

  describe('camelToKebab', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(camelToKebab('camelCase')).toBe('camel-case');
    });

    it('should convert PascalCase to kebab-case', () => {
      expect(camelToKebab('PascalCase')).toBe('pascal-case');
    });

    it('should handle multiple capital letters', () => {
      expect(camelToKebab('myHTMLString')).toBe('my-h-t-m-l-string');
    });

    it('should handle string without capitals', () => {
      expect(camelToKebab('lowercase')).toBe('lowercase');
    });

    it('should handle empty string', () => {
      expect(camelToKebab('')).toBe('');
    });

    it('should handle single capital letter', () => {
      expect(camelToKebab('A')).toBe('a');
    });

    it('should handle complex component names', () => {
      expect(camelToKebab('CommonButton')).toBe('common-button');
      expect(camelToKebab('myAwesomeComponent')).toBe('my-awesome-component');
    });
    it('should use underscores as separators', () => {
      expect(camelToKebab('ButtonGroup', '_')).toBe('button_group');
      expect(camelToKebab('myComponent', '_')).toBe('my_component');
      expect(camelToKebab('XMLHttpRequest', '_')).toBe('x_m_l_http_request');
    });
  });
});
