import { describe, expect, it } from 'vitest';
import { useCounter } from '../index';

describe('useCounter', () => {
  it('should initialize with default value 0', () => {
    const { count } = useCounter();
    expect(count.value).toBe(0);
  });

  it('should initialize with custom value', () => {
    const { count } = useCounter(10);
    expect(count.value).toBe(10);
  });

  it('should increment count', () => {
    const { count, increment } = useCounter(5);
    increment();
    expect(count.value).toBe(6);
  });

  it('should increment multiple times', () => {
    const { count, increment } = useCounter();
    increment();
    increment();
    increment();
    expect(count.value).toBe(3);
  });

  it('should decrement count', () => {
    const { count, decrement } = useCounter(5);
    decrement();
    expect(count.value).toBe(4);
  });

  it('should decrement multiple times', () => {
    const { count, decrement } = useCounter(10);
    decrement();
    decrement();
    expect(count.value).toBe(8);
  });

  it('should handle both increment and decrement', () => {
    const { count, increment, decrement } = useCounter(0);
    increment();
    increment();
    decrement();
    expect(count.value).toBe(1);
  });

  it('should handle negative values', () => {
    const { count, decrement } = useCounter(0);
    decrement();
    decrement();
    expect(count.value).toBe(-2);
  });

  it('should handle negative initial value', () => {
    const { count, increment } = useCounter(-5);
    expect(count.value).toBe(-5);
    increment();
    expect(count.value).toBe(-4);
  });
});
