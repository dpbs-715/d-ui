# 类型判断工具

## relation

> 关系数据转化。

合并

```ts
const relationStr = '1 and (2 or 3) and (4 or 5) and (6 or 7) and 8';

const res = relation(nodes, relationStr);
console.log(JSON.stringify(res, null, 2));
/**
 * 结果：
 * [
 *   {
 *     "id": 1,
 *     "name": "Node 1",
 *     "relation": "and"
 *   },
 *   {
 *     "content": [
 *       {
 *         "id": 2,
 *         "name": "Node 2",
 *         "relation": "or"
 *       },
 *       {
 *         "id": 3,
 *         "name": "Node 3"
 *       }
 *     ],
 *     "relation": "and"
 *   },
 *   {
 *     "content": [
 *       {
 *         "id": 4,
 *         "name": "Node 4",
 *         "relation": "or"
 *       },
 *       {
 *         "id": 5,
 *         "name": "Node 5"
 *       }
 *     ],
 *     "relation": "and"
 *   },
 *   {
 *     "content": [
 *       {
 *         "id": 6,
 *         "name": "Node 6",
 *         "relation": "or"
 *       },
 *       {
 *         "id": 7,
 *         "name": "Node 7"
 *       }
 *     ],
 *     "relation": "and"
 *   },
 *   {
 *     "id": 8,
 *     "name": "Node 8"
 *   }
 * ]
 *
 * */
```

拆分

```ts
const re = [
  {
    id: 1,
    name: 'Node 1',
    relation: 'and',
  },
  {
    content: [
      {
        id: 2,
        name: 'Node 2',
        relation: 'or',
      },
      {
        id: 3,
        name: 'Node 3',
      },
    ],
    relation: 'and',
  },
  {
    content: [
      {
        id: 4,
        name: 'Node 4',
        relation: 'or',
      },
      {
        id: 5,
        name: 'Node 5',
      },
    ],
    relation: 'and',
  },
  {
    content: [
      {
        id: 6,
        name: 'Node 6',
        relation: 'or',
      },
      {
        id: 7,
        name: 'Node 7',
      },
    ],
    relation: 'and',
  },
  {
    id: 8,
    name: 'Node 8',
  },
];

const res = relation(re);
console.log(JSON.stringify(res, null, 2));
/*结果
{
  "relation": "1and(2or3)and(4or5)and(6or7)and8",
  "nodes": [
  {
    "id": 1,
    "name": "Node 1"
  },
  {
    "id": 2,
    "name": "Node 2"
  },
  {
    "id": 3,
    "name": "Node 3"
  },
  {
    "id": 4,
    "name": "Node 4"
  },
  {
    "id": 5,
    "name": "Node 5"
  },
  {
    "id": 6,
    "name": "Node 6"
  },
  {
    "id": 7,
    "name": "Node 7"
  },
  {
    "id": 8,
    "name": "Node 8"
  }
]
}*/
```
