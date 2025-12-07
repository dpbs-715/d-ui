import { beforeEach, describe, expect, it } from 'vitest';
import { ComMap } from '../src/comMap';
import { defineComponent, h } from 'vue';

describe('ComMap', () => {
  let comMap: ComMap;

  beforeEach(() => {
    comMap = ComMap.getInstance();
    // Clear any previously registered components
    comMap.clear();
  });

  describe('Singleton pattern', () => {
    it('should return the same instance', () => {
      const instance1 = ComMap.getInstance();
      const instance2 = ComMap.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('register()', () => {
    it('should register a single component', () => {
      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup() {
          return () => h('div', 'Test');
        },
      });

      comMap.register('TestComponent', TestComponent);

      expect(comMap.has('TestComponent')).toBe(true);
    });

    it('should throw error for invalid key', () => {
      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup() {
          return () => h('div', 'Test');
        },
      });

      expect(() => comMap.register('', TestComponent)).toThrow(
        'Component key must be a non-empty string',
      );

      expect(() => comMap.register(null as any, TestComponent)).toThrow(
        'Component key must be a non-empty string',
      );
    });

    it('should overwrite existing component with same key', () => {
      const Component1 = defineComponent({
        name: 'Component1',
        setup() {
          return () => h('div', 'Component 1');
        },
      });

      const Component2 = defineComponent({
        name: 'Component2',
        setup() {
          return () => h('div', 'Component 2');
        },
      });

      comMap.register('TestComponent', Component1);
      comMap.register('TestComponent', Component2);

      expect(comMap.get('TestComponent')).toBe(Component2);
    });
  });

  describe('registerBatch()', () => {
    it('should register multiple components', () => {
      const Component1 = defineComponent({
        name: 'Component1',
        setup() {
          return () => h('div', 'Component 1');
        },
      });

      const Component2 = defineComponent({
        name: 'Component2',
        setup() {
          return () => h('div', 'Component 2');
        },
      });

      comMap.registerBatch({
        Component1,
        Component2,
      });

      expect(comMap.has('Component1')).toBe(true);
      expect(comMap.has('Component2')).toBe(true);
    });

    it('should handle empty object', () => {
      expect(() => comMap.registerBatch({})).not.toThrow();
    });
  });

  describe('get()', () => {
    it('should get registered component by string key', () => {
      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup() {
          return () => h('div', 'Test');
        },
      });

      comMap.register('TestComponent', TestComponent);

      expect(comMap.get('TestComponent')).toBe(TestComponent);
    });

    it('should return undefined for unregistered component', () => {
      expect(comMap.get('UnregisteredComponent')).toBeUndefined();
    });

    it('should handle component function', () => {
      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup() {
          return () => h('div', 'Test');
        },
      });

      comMap.register('TestComponent', TestComponent);

      const componentFunction = () => 'TestComponent';
      expect(comMap.get(componentFunction)).toBe(TestComponent);
    });

    it('should handle direct component reference', () => {
      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup() {
          return () => h('div', 'Test');
        },
      });

      expect(comMap.get(TestComponent)).toBe(TestComponent);
    });

    it('should recognize HTML tags', () => {
      expect(comMap.get('div')).toBe('div');
      expect(comMap.get('span')).toBe('span');
      expect(comMap.get('button')).toBe('button');
    });

    it('should return undefined for invalid HTML tags', () => {
      expect(comMap.get('invalidtag')).toBeUndefined();
    });

    it('should handle function that returns component', () => {
      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup() {
          return () => h('div', 'Test');
        },
      });

      const componentFunction = () => TestComponent;
      expect(comMap.get(componentFunction)).toBe(TestComponent);
    });

    it('should handle function that returns HTML tag', () => {
      const tagFunction = () => 'div';
      expect(comMap.get(tagFunction)).toBe('div');
    });
  });

  describe('has()', () => {
    it('should return true for registered component', () => {
      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup() {
          return () => h('div', 'Test');
        },
      });

      comMap.register('TestComponent', TestComponent);

      expect(comMap.has('TestComponent')).toBe(true);
    });

    it('should return false for unregistered component', () => {
      expect(comMap.has('UnregisteredComponent')).toBe(false);
    });
  });

  describe('unregister()', () => {
    it('should unregister a single component', () => {
      const TestComponent = defineComponent({
        name: 'TestComponent',
        setup() {
          return () => h('div', 'Test');
        },
      });

      comMap.register('TestComponent', TestComponent);
      expect(comMap.has('TestComponent')).toBe(true);

      comMap.unregister('TestComponent');
      expect(comMap.has('TestComponent')).toBe(false);
    });

    it('should handle unregistering non-existent component', () => {
      expect(() => comMap.unregister('NonExistent')).not.toThrow();
    });
  });

  describe('unregisterBatch()', () => {
    it('should unregister multiple components', () => {
      const Component1 = defineComponent({
        name: 'Component1',
        setup() {
          return () => h('div', 'Component 1');
        },
      });

      const Component2 = defineComponent({
        name: 'Component2',
        setup() {
          return () => h('div', 'Component 2');
        },
      });

      comMap.registerBatch({
        Component1,
        Component2,
      });

      expect(comMap.has('Component1')).toBe(true);
      expect(comMap.has('Component2')).toBe(true);

      comMap.unregisterBatch(['Component1', 'Component2']);

      expect(comMap.has('Component1')).toBe(false);
      expect(comMap.has('Component2')).toBe(false);
    });

    it('should handle empty array', () => {
      expect(() => comMap.unregisterBatch([])).not.toThrow();
    });

    it('should handle unregistering non-existent components', () => {
      expect(() => comMap.unregisterBatch(['NonExistent1', 'NonExistent2'])).not.toThrow();
    });
  });

  describe('clear()', () => {
    it('should clear all registered components', () => {
      const Component1 = defineComponent({
        name: 'Component1',
        setup() {
          return () => h('div', 'Component 1');
        },
      });

      const Component2 = defineComponent({
        name: 'Component2',
        setup() {
          return () => h('div', 'Component 2');
        },
      });

      comMap.registerBatch({
        Component1,
        Component2,
      });

      expect(comMap.has('Component1')).toBe(true);
      expect(comMap.has('Component2')).toBe(true);

      comMap.clear();

      expect(comMap.has('Component1')).toBe(false);
      expect(comMap.has('Component2')).toBe(false);
    });

    it('should handle clearing empty map', () => {
      expect(() => comMap.clear()).not.toThrow();
    });
  });

  describe('BaseMap initialization', () => {
    it('should have HTML tags registered by default', () => {
      const freshComMap = ComMap.getInstance();

      // Check some common HTML tags
      expect(freshComMap.get('div')).toBe('div');
      expect(freshComMap.get('span')).toBe('span');
      expect(freshComMap.get('button')).toBe('button');
      expect(freshComMap.get('input')).toBe('input');
    });
  });

  describe('Complex scenarios', () => {
    it('should handle async components', () => {
      const AsyncComponent = defineComponent({
        name: 'AsyncComponent',
        async setup() {
          return () => h('div', 'Async Component');
        },
      });

      comMap.register('AsyncComponent', AsyncComponent);

      expect(comMap.has('AsyncComponent')).toBe(true);
      expect(comMap.get('AsyncComponent')).toBe(AsyncComponent);
    });

    it('should handle multiple registrations and unregistrations', () => {
      const Component1 = defineComponent({ name: 'Component1' });
      const Component2 = defineComponent({ name: 'Component2' });
      const Component3 = defineComponent({ name: 'Component3' });

      // Register
      comMap.register('Comp1', Component1);
      comMap.register('Comp2', Component2);
      comMap.register('Comp3', Component3);

      expect(comMap.has('Comp1')).toBe(true);
      expect(comMap.has('Comp2')).toBe(true);
      expect(comMap.has('Comp3')).toBe(true);

      // Unregister one
      comMap.unregister('Comp2');

      expect(comMap.has('Comp1')).toBe(true);
      expect(comMap.has('Comp2')).toBe(false);
      expect(comMap.has('Comp3')).toBe(true);

      // Clear all
      comMap.clear();

      expect(comMap.has('Comp1')).toBe(false);
      expect(comMap.has('Comp3')).toBe(false);
    });
  });
});
