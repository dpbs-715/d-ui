import { describe, expect, it } from 'vitest';
import { relation } from '../relation';

describe('parse utils', () => {
  describe('relation - parse nodes to structured array', () => {
    const nodes = [
      { id: 1, name: 'Node 1' },
      { id: 2, name: 'Node 2' },
      { id: 3, name: 'Node 3' },
      { id: 4, name: 'Node 4' },
    ];

    it('should parse simple "and" relation', () => {
      const result = relation(nodes, '1 and 2');
      expect(result).toEqual([
        { id: 1, name: 'Node 1', relation: 'and' },
        { id: 2, name: 'Node 2' },
      ]);
    });

    it('should parse simple "or" relation', () => {
      const result = relation(nodes, '1 or 2');
      expect(result).toEqual([
        { id: 1, name: 'Node 1', relation: 'or' },
        { id: 2, name: 'Node 2' },
      ]);
    });

    it('should parse multiple relations', () => {
      const result = relation(nodes, '1 and 2 or 3');
      expect(result).toEqual([
        { id: 1, name: 'Node 1', relation: 'and' },
        { id: 2, name: 'Node 2', relation: 'or' },
        { id: 3, name: 'Node 3' },
      ]);
    });

    it('should parse grouped relations with parentheses', () => {
      const result = relation(nodes, '(1 and 2) or 3');
      expect(result).toEqual([
        {
          content: [
            { id: 1, name: 'Node 1', relation: 'and' },
            { id: 2, name: 'Node 2' },
          ],
          relation: 'or',
        },
        { id: 3, name: 'Node 3' },
      ]);
    });

    it('should parse nested groups', () => {
      const result = relation(nodes, '((1 and 2) or 3) and 4');
      expect(result[0]).toHaveProperty('content');
      expect(result[0].relation).toBe('and');
      expect(result[1]).toEqual({ id: 4, name: 'Node 4' });
    });

    it('should handle single node', () => {
      const result = relation(nodes, '1');
      expect(result).toEqual([{ id: 1, name: 'Node 1' }]);
    });

    it('should handle spaces in expression', () => {
      const result = relation(nodes, '  1   and   2  ');
      expect(result).toEqual([
        { id: 1, name: 'Node 1', relation: 'and' },
        { id: 2, name: 'Node 2' },
      ]);
    });

    it('should parse complex nested structure', () => {
      const result = relation(nodes, '1 and (2 or (3 and 4))');
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ id: 1, name: 'Node 1', relation: 'and' });
      expect(result[1]).toHaveProperty('content');
    });
  });

  describe('relation - serialize structured array to string', () => {
    it('should serialize simple "and" relation', () => {
      const structured = [
        { id: 1, name: 'Node 1', relation: 'and' },
        { id: 2, name: 'Node 2' },
      ];
      const result = relation(structured);
      expect(result).toEqual({
        relation: '1and2',
        nodes: [
          { id: 1, name: 'Node 1' },
          { id: 2, name: 'Node 2' },
        ],
      });
    });

    it('should serialize simple "or" relation', () => {
      const structured = [
        { id: 1, name: 'Node 1', relation: 'or' },
        { id: 2, name: 'Node 2' },
      ];
      const result = relation(structured);
      expect(result).toEqual({
        relation: '1or2',
        nodes: [
          { id: 1, name: 'Node 1' },
          { id: 2, name: 'Node 2' },
        ],
      });
    });

    it('should serialize multiple relations', () => {
      const structured = [
        { id: 1, name: 'Node 1', relation: 'and' },
        { id: 2, name: 'Node 2', relation: 'or' },
        { id: 3, name: 'Node 3' },
      ];
      const result = relation(structured);
      expect(result).toEqual({
        relation: '1and2or3',
        nodes: [
          { id: 1, name: 'Node 1' },
          { id: 2, name: 'Node 2' },
          { id: 3, name: 'Node 3' },
        ],
      });
    });

    it('should serialize grouped relations', () => {
      const structured = [
        {
          content: [
            { id: 1, name: 'Node 1', relation: 'and' },
            { id: 2, name: 'Node 2' },
          ],
          relation: 'or',
        },
        { id: 3, name: 'Node 3' },
      ];
      const result = relation(structured);
      expect(result).toEqual({
        relation: '(1and2)or3',
        nodes: [
          { id: 1, name: 'Node 1' },
          { id: 2, name: 'Node 2' },
          { id: 3, name: 'Node 3' },
        ],
      });
    });

    it('should deduplicate nodes in serialization', () => {
      const structured = [
        { id: 1, name: 'Node 1', relation: 'and' },
        { id: 2, name: 'Node 2', relation: 'or' },
        { id: 1, name: 'Node 1' }, // 重复节点
      ];
      const result = relation(structured);
      expect(result.nodes).toHaveLength(2);
      expect(result.nodes).toEqual([
        { id: 1, name: 'Node 1' },
        { id: 2, name: 'Node 2' },
      ]);
    });

    it('should handle single node serialization', () => {
      const structured = [{ id: 1, name: 'Node 1' }];
      const result = relation(structured);
      expect(result).toEqual({
        relation: '1',
        nodes: [{ id: 1, name: 'Node 1' }],
      });
    });

    it('should serialize nested structures', () => {
      const structured = [
        { id: 1, name: 'Node 1', relation: 'and' },
        {
          content: [
            { id: 2, name: 'Node 2', relation: 'or' },
            {
              content: [
                { id: 3, name: 'Node 3', relation: 'and' },
                { id: 4, name: 'Node 4' },
              ],
            },
          ],
        },
      ];
      const result = relation(structured);
      expect(result.relation).toBe('1and(2or(3and4))');
      expect(result.nodes).toHaveLength(4);
    });
  });

  describe('relation - roundtrip test', () => {
    it('should support parse -> serialize roundtrip', () => {
      const nodes = [
        { id: 1, name: 'Node 1' },
        { id: 2, name: 'Node 2' },
        { id: 3, name: 'Node 3' },
      ];
      const relationStr = '1 and (2 or 3)';

      // Parse
      const structured = relation(nodes, relationStr);

      // Serialize
      const serialized = relation(structured);

      // 验证
      expect(serialized.relation).toBe('1and(2or3)');
      expect(serialized.nodes).toEqual(nodes);
    });
  });

  describe('relation - error handling', () => {
    it('should throw error for invalid arguments', () => {
      expect(() => {
        // @ts-ignore - 测试错误输入
        relation('invalid');
      }).toThrow('Invalid arguments for parse()');
    });

    it('should not throw error when second arg is number (treated as undefined)', () => {
      const nodes = [{ id: 1, name: 'Node 1' }];
      // 当第二个参数不是 string 时，会被当作 undefined 处理，走序列化分支
      // @ts-ignore - 测试边界输入
      const result = relation(nodes, 123);
      expect(result).toHaveProperty('relation');
      expect(result).toHaveProperty('nodes');
    });
  });
});
