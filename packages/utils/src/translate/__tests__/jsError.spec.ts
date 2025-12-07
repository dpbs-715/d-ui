import { describe, expect, it } from 'vitest';
import { translateJsError } from '../jsError';

describe('translate utils', () => {
  describe('translateJsError', () => {
    it('should translate unary operator missing argument error', () => {
      const error = new Error('missing unaryOp argument at character 5');
      const result = translateJsError(error);
      expect(result).toBe('语法错误：一元运算符缺少操作数（位置：第 5 个字符）');
    });

    it('should translate missing expression after symbol error', () => {
      const error = new Error('Expected expression after + at character 10');
      const result = translateJsError(error);
      expect(result).toBe("语法错误：在符号 '+' 后面缺少表达式（位置：第 10 个字符）");
    });

    it('should translate missing symbol error', () => {
      const error = new Error('Expected ) at character 9');
      const result = translateJsError(error);
      expect(result).toBe("语法错误：缺少 ')' （位置：第 9 个字符）");
    });

    it('should translate variable name starting with number error', () => {
      const error = new Error('Variable names cannot start with a number (13v) at character 2');
      const result = translateJsError(error);
      expect(result).toBe('语法错误：变量名不能以数字开头（非法变量名：13v，位置：第 2 个字符）');
    });

    it('should translate unexpected symbol error', () => {
      const error = new Error('Unexpected } at character 15');
      const result = translateJsError(error);
      expect(result).toBe("语法错误：在第 15 个字符处遇到意外的 '}' 符号");
    });

    it('should translate unclosed quote error', () => {
      const error = new Error('Unclosed quote after "hello" at character 20');
      const result = translateJsError(error);
      expect(result).toBe("语法错误：在第 20 个字符处遇到 'hello' 字符串的引号没有闭合");
    });

    it('should translate unclosed bracket error', () => {
      const error = new Error('Unclosed ( at character 8');
      const result = translateJsError(error);
      expect(result).toBe("语法错误：在第 8 个字符处 '(' 没有闭合");
    });

    it('should translate unexpected token error', () => {
      const error = new Error('Unexpected token');
      const result = translateJsError(error);
      expect(result).toBe('语法错误：遇到意外的字符或符号');
    });

    it('should translate unexpected end of input error', () => {
      const error = new Error('Unexpected end of input');
      const result = translateJsError(error);
      expect(result).toBe('语法错误：输入意外结束，可能缺少括号或花括号');
    });

    it('should translate unexpected string error', () => {
      const error = new Error('Unexpected string');
      const result = translateJsError(error);
      expect(result).toBe('语法错误：字符串不完整或不符合语法');
    });

    it('should translate unexpected number error', () => {
      const error = new Error('Unexpected number');
      const result = translateJsError(error);
      expect(result).toBe('语法错误：数字格式不正确或不符合语法');
    });

    it('should translate invalid or unexpected token error', () => {
      const error = new Error('Invalid or unexpected token');
      const result = translateJsError(error);
      expect(result).toBe('语法错误：无效或意外的字符');
    });

    it('should translate undefined reference error', () => {
      const error = new Error('foo is not defined');
      const result = translateJsError(error);
      expect(result).toBe('引用错误：变量未定义');
    });

    it('should translate cannot access before initialization error', () => {
      const error = new Error('cannot access variable before initialization');
      const result = translateJsError(error);
      expect(result).toBe('引用错误：在变量初始化之前访问了该变量');
    });

    it('should translate undefined is not a function error', () => {
      const error = new Error('undefined is not a function');
      const result = translateJsError(error);
      expect(result).toBe('类型错误：调用了未定义的函数');
    });

    it('should translate cannot read property of undefined error', () => {
      const error = new Error("Cannot read property 'name' of undefined");
      const result = translateJsError(error);
      expect(result).toBe('类型错误：尝试读取 undefined 的属性');
    });

    it('should translate cannot set property of undefined error', () => {
      const error = new Error("Cannot set property 'value' of undefined");
      const result = translateJsError(error);
      expect(result).toBe('类型错误：尝试给 undefined 设置属性');
    });

    it('should return original message for unknown error', () => {
      const error = new Error('Some unknown error message');
      const result = translateJsError(error);
      expect(result).toBe('Some unknown error message');
    });
  });
});
