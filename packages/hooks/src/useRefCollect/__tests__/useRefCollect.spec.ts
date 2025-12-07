import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRefCollect } from '../index';

describe('useRefCollect', () => {
  let refCollect: ReturnType<typeof useRefCollect>;

  beforeEach(() => {
    refCollect = useRefCollect();
  });

  it('should collect refs', () => {
    const mockRef = { name: 'test' };
    refCollect.handleRef(mockRef, 'testKey');

    expect(refCollect.refObj.testKey).toStrictEqual(mockRef);
  });

  it('should not collect null refs', () => {
    refCollect.handleRef(null, 'testKey');

    expect(refCollect.refObj.testKey).toBeUndefined();
  });

  it('should collect multiple refs', () => {
    const mockRef1 = { name: 'test1' };
    const mockRef2 = { name: 'test2' };

    refCollect.handleRef(mockRef1, 'key1');
    refCollect.handleRef(mockRef2, 'key2');

    expect(refCollect.refObj.key1).toStrictEqual(mockRef1);
    expect(refCollect.refObj.key2).toStrictEqual(mockRef2);
  });

  it('should validate single ref by string key', async () => {
    const mockValidateForm = vi.fn().mockResolvedValue(true);
    const mockRef = { validateForm: mockValidateForm };

    refCollect.handleRef(mockRef, 'testKey');

    const result = await refCollect.getRefsValidateArr('testKey');

    expect(mockValidateForm).toHaveBeenCalledTimes(1);
    expect(result).toEqual([true]);
  });

  it('should validate multiple refs by array keys', async () => {
    const mockValidateForm1 = vi.fn().mockResolvedValue(true);
    const mockValidateForm2 = vi.fn().mockResolvedValue(true);

    refCollect.handleRef({ validateForm: mockValidateForm1 }, 'key1');
    refCollect.handleRef({ validateForm: mockValidateForm2 }, 'key2');

    const result = await refCollect.getRefsValidateArr(['key1', 'key2']);

    expect(mockValidateForm1).toHaveBeenCalledTimes(1);
    expect(mockValidateForm2).toHaveBeenCalledTimes(1);
    expect(result).toEqual([true, true]);
  });

  it('should validate all refs when no keys provided', async () => {
    const mockValidateForm1 = vi.fn().mockResolvedValue(true);
    const mockValidateForm2 = vi.fn().mockResolvedValue(true);

    refCollect.handleRef({ validateForm: mockValidateForm1 }, 'key1');
    refCollect.handleRef({ validateForm: mockValidateForm2 }, 'key2');

    const result = await refCollect.getRefsValidateArr();

    expect(mockValidateForm1).toHaveBeenCalledTimes(1);
    expect(mockValidateForm2).toHaveBeenCalledTimes(1);
    expect(result).toEqual([true, true]);
  });

  it('should use validateField if validateForm not available', async () => {
    const mockValidateField = vi.fn().mockResolvedValue(true);
    const mockRef = { validateField: mockValidateField };

    refCollect.handleRef(mockRef, 'testKey');

    const result = await refCollect.getRefsValidateArr('testKey');

    expect(mockValidateField).toHaveBeenCalledTimes(1);
    expect(result).toEqual([true]);
  });

  it('should prefer validateForm over validateField', async () => {
    const mockValidateForm = vi.fn().mockResolvedValue(true);
    const mockValidateField = vi.fn().mockResolvedValue(false);
    const mockRef = {
      validateForm: mockValidateForm,
      validateField: mockValidateField,
    };

    refCollect.handleRef(mockRef, 'testKey');

    await refCollect.getRefsValidateArr('testKey');

    expect(mockValidateForm).toHaveBeenCalledTimes(1);
    expect(mockValidateField).not.toHaveBeenCalled();
  });

  it('should clear validation for single ref by string key', () => {
    vi.useFakeTimers();

    const mockClearValidate = vi.fn();
    const mockRef = { clearValidate: mockClearValidate };

    refCollect.handleRef(mockRef, 'testKey');
    refCollect.clearRefsValidate('testKey');

    vi.advanceTimersByTime(20);

    expect(mockClearValidate).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('should clear validation for multiple refs by array keys', () => {
    vi.useFakeTimers();

    const mockClearValidate1 = vi.fn();
    const mockClearValidate2 = vi.fn();

    refCollect.handleRef({ clearValidate: mockClearValidate1 }, 'key1');
    refCollect.handleRef({ clearValidate: mockClearValidate2 }, 'key2');

    refCollect.clearRefsValidate(['key1', 'key2']);

    vi.advanceTimersByTime(20);

    expect(mockClearValidate1).toHaveBeenCalledTimes(1);
    expect(mockClearValidate2).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('should clear validation for all refs when no keys provided', () => {
    vi.useFakeTimers();

    const mockClearValidate1 = vi.fn();
    const mockClearValidate2 = vi.fn();

    refCollect.handleRef({ clearValidate: mockClearValidate1 }, 'key1');
    refCollect.handleRef({ clearValidate: mockClearValidate2 }, 'key2');

    refCollect.clearRefsValidate();

    vi.advanceTimersByTime(20);

    expect(mockClearValidate1).toHaveBeenCalledTimes(1);
    expect(mockClearValidate2).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('should handle refs without clearValidate method', () => {
    vi.useFakeTimers();

    const mockRef = { name: 'test' };

    refCollect.handleRef(mockRef, 'testKey');

    expect(() => {
      refCollect.clearRefsValidate('testKey');
      vi.advanceTimersByTime(20);
    }).not.toThrow();

    vi.useRealTimers();
  });

  it('should skip non-existent keys when validating', async () => {
    const result = await refCollect.getRefsValidateArr('nonExistentKey');
    expect(result).toEqual([]);
  });

  it('should skip non-existent keys when clearing', () => {
    vi.useFakeTimers();

    expect(() => {
      refCollect.clearRefsValidate('nonExistentKey');
      vi.advanceTimersByTime(20);
    }).not.toThrow();

    vi.useRealTimers();
  });
});
