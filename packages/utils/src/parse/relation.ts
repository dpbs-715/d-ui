/**
 * 解析节点关系表达式或结构化数据，支持两种调用方式：
 * 1. parse(nodes, relationStr): 根据节点数组和关系字符串生成结构化对象数组。
 * 2. parse(structuredArray): 将结构化对象数组序列化为关系字符串与去重后的节点列表。
 *
 * @param arg1 节点数组（用于第一种情况）或结构化对象数组（用于第二种情况）
 * @param arg2 可选的关系表达式字符串（仅在第一种情况下使用）
 * @returns 第一种情况返回结构化的对象数组；第二种情况返回包含 relation 字符串和 nodes 数组的对象
 */
export function relation(arg1: Record<string, any>[], arg2?: string) {
  // 情况1： parse(nodes, relationStr) -> 结构化数组
  if (Array.isArray(arg1) && typeof arg2 === 'string') {
    const nodesMap = Object.fromEntries(arg1.map((n) => [n.id, { ...n }]));
    const expr = arg2.replace(/\s+/g, '');
    const tokens = expr.match(/\d+|and|or|\(|\)/g) || [];
    // 把 token 列表转换成结构（使用栈管理括号）
    function makeGroup(tokenList: any[]) {
      const output = [];
      for (let t of tokenList) {
        if (t === 'and' || t === 'or') {
          // 将运算符附到前一个输出元素（如果存在）
          if (output.length > 0) {
            output[output.length - 1].relation = t;
          }
        } else if (/^\d+$/.test(t)) {
          output.push({ ...nodesMap[Number(t)] });
        } else if (typeof t === 'object') {
          // 已经是子 group 或 node 对象
          output.push(t);
        }
      }
      // 单一元素直接返回该元素（保持扁平），多个元素用 { content: [...] }
      if (output.length === 1) return output[0];
      return { content: output };
    }

    function build(tokens: string[]) {
      const stack: any[] = [[]];
      for (const t of tokens) {
        if (t === '(') stack.push([]);
        else if (t === ')') {
          const groupList = stack.pop();
          const obj = makeGroup(groupList);
          stack[stack.length - 1].push(obj);
        } else {
          stack[stack.length - 1].push(t);
        }
      }
      const root = makeGroup(stack[0]);
      // 最顶层我们需要返回数组：如果 root 有 content 就返回它的内容，否则把单元素包装成数组
      if (root && root.content) return root.content;
      return [root];
    }

    return build(tokens);
  }

  // 情况2： parse(structuredArray) -> { relation: string, nodes: [...] }
  if (Array.isArray(arg1) && arg1.every((v) => typeof v === 'object')) {
    const nodesData: any[] = [];
    function collect(node: Record<string, any>) {
      if (!node) return;
      if (Array.isArray(node)) node.forEach(collect);
      else if (node.content) node.content.forEach(collect);
      else if (node.id != null) {
        if (!nodesData.some((n) => n.id === node.id)) {
          nodesData.push({ id: node.id, name: node.name });
        }
      }
    }
    arg1.forEach(collect);

    // 序列化：仅在元素不是最后一项时才加上该元素的 relation（避免尾部多余运算符）
    function serializeItems(items: any) {
      return items
        .map((it: Record<string, any>, idx: number) => {
          const last = idx === items.length - 1;
          const body = it && it.content ? '(' + serializeItems(it.content) + ')' : String(it.id);
          return last ? body : it.relation ? body + it.relation : body;
        })
        .join('');
    }

    const relationStr = serializeItems(arg1);
    return { relation: relationStr, nodes: nodesData };
  }

  throw new Error('Invalid arguments for parse()');
}
