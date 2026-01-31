import { ref } from 'vue';
import { createSpanMethod } from './index';

// ==================== 场景1: 简单的行合并 ====================
const simpleData = ref([
  { province: '浙江', city: '杭州', area: '西湖区' },
  { province: '浙江', city: '杭州', area: '滨江区' },
  { province: '浙江', city: '宁波', area: '鄞州区' },
]);

const simpleSpanMethod = createSpanMethod()
  .withData(simpleData)
  .mergeRows(['province', 'city']) // 省市联动合并
  .build();

// ==================== 场景2: 多组独立的行合并（解决前后依赖问题）====================
const multiGroupData = ref([
  { province: '浙江', city: '杭州', status: 'active', category: 'A', subcategory: 'A1' },
  { province: '浙江', city: '杭州', status: 'active', category: 'A', subcategory: 'A2' },
  { province: '浙江', city: '宁波', status: 'inactive', category: 'B', subcategory: 'B1' },
  { province: '江苏', city: '南京', status: 'active', category: 'B', subcategory: 'B1' },
]);

// 之前的问题：status 必须等 province 和 city 都在同一区域才能合并
// 现在的解决方案：通过多次调用 mergeRows 创建独立的合并组
const multiGroupSpanMethod = createSpanMethod()
  .withData(multiGroupData)
  .mergeRows(['province', 'city']) // 第1组：省市联动
  .mergeRows(['status']) // 第2组：状态独立合并（不受省市影响）
  .mergeRows(['category', 'subcategory']) // 第3组：分类联动
  .build();

// ==================== 场景3: 行合并 + 列合并 ====================
const mixedData = ref([
  { name: '表头', q1: '第一季度', q2: '第二季度', q3: '第三季度', q4: '第四季度' },
  { name: '浙江', q1: 100, q2: 200, q3: 300, q4: 400 },
  { name: '浙江', q1: 150, q2: 250, q3: 350, q4: 450 },
  { name: '江苏', q1: 120, q2: 220, q3: 320, q4: 420 },
  { name: '小计', q1: 370, q2: 670, q3: 970, q4: 1270 },
]);

const mixedSpanMethod = createSpanMethod()
  .withData(mixedData)
  // 行合并：name 列相同值合并
  .mergeRows(['name'])
  // 列合并：第一行（表头）合并 q1-q4
  .mergeCols({
    rows: [0],
    groups: [['q1', 'q2', 'q3', 'q4']],
  })
  // 列合并：最后一行（小计）合并 q1-q2 和 q3-q4
  .mergeCols({
    rows: [4],
    groups: [
      ['q1', 'q2'],
      ['q3', 'q4'],
    ],
  })
  .build();

// ==================== 场景4: 动态列合并规则 ====================
const dynamicData = ref([
  { type: 'header', name: '标题', a: 'A', b: 'B', c: 'C', d: 'D' },
  { type: 'data', name: '数据1', a: 1, b: 2, c: 3, d: 4 },
  { type: 'summary', name: '小计', a: 100, b: 200, c: 300, d: 400 },
  { type: 'total', name: '总计', a: 1000, b: 2000, c: 3000, d: 4000 },
]);

const dynamicSpanMethod = createSpanMethod()
  .withData(dynamicData)
  // 条件判断：header 行合并 a-d
  .mergeCols({
    rows: (idx: any, row: any) => row.type === 'header',
    groups: [['a', 'b', 'c', 'd']],
  })
  // 条件判断：summary 行合并 a-b 和 c-d
  .mergeCols({
    rows: (idx: any, row: any) => row.type === 'summary',
    groups: [
      ['a', 'b'],
      ['c', 'd'],
    ],
  })
  // 条件判断：total 行合并所有列
  .mergeCols({
    rows: (idx: any, row: any) => row.type === 'total',
    groups: [['name', 'a', 'b', 'c', 'd']],
  })
  .build();

// ==================== 场景5: 缓存控制 ====================

// 方式1：使用自定义缓存键（性能最优）
const version = ref(0);
const cachedSpanMethod = createSpanMethod()
  .withData(simpleData)
  .withCacheKey(version) // 提供缓存键
  .mergeRows(['province', 'city'])
  .build();

// 数据变化时手动更新缓存键
function updateData() {
  simpleData.value.push({ province: '江苏', city: '南京', area: '玄武区' });
  version.value++; // 刷新缓存
}

// 方式2：禁用缓存（数据频繁变化的场景）
const noCacheSpanMethod = createSpanMethod()
  .withData(simpleData)
  .noCache() // 禁用缓存
  .mergeRows(['province', 'city'])
  .build();

// 方式3：智能模式（默认，自动检测数据变化）
const autoSpanMethod = createSpanMethod()
  .withData(simpleData)
  .mergeRows(['province', 'city'])
  .build(); // 自动检测合并列数据变化

// ==================== Vue 组件中使用 ====================

/*
<script setup lang="ts">
import { ref } from 'vue'
import { createSpanMethod } from 'dlib-utils/ep'

const tableData = ref([
  { province: '浙江', city: '杭州', area: '西湖区' },
  { province: '浙江', city: '杭州', area: '滨江区' },
  { province: '浙江', city: '宁波', area: '鄞州区' },
])

const spanMethod = createSpanMethod()
  .withData(tableData)
  .mergeRows(['province', 'city'])
  .build()
</script>

<template>
  <el-table :data="tableData" :span-method="spanMethod" border>
    <el-table-column prop="province" label="省份" />
    <el-table-column prop="city" label="城市" />
    <el-table-column prop="area" label="区域" />
  </el-table>
</template>
*/

// ==================== API 对比总结 ====================

// ❌ 旧方式（繁琐）
/*
import { createSpanMethod, createColSpanMethod, composeSpanMethods } from './spanMethod'

const oldSpanMethod = composeSpanMethods(
  createSpanMethod({
    mergeColumns: ['province', 'city'],
    data: tableData,
    cacheKey: version
  }),
  createSpanMethod({
    mergeColumns: ['status'],
    data: tableData,
    cacheKey: version
  }),
  createColSpanMethod({
    rows: [0],
    mergeGroups: [['q1', 'q2']],
    data: tableData,
    cacheKey: version
  })
)
*/

// ✅ 新方式（优雅）
const newSpanMethod = createSpanMethod()
  .withData(multiGroupData)
  .withCacheKey(version)
  .mergeRows(['province', 'city']) // 省市联动
  .mergeRows(['status']) // 状态独立
  .mergeCols({ rows: [0], groups: [['q1', 'q2']] }) // 表头合并
  .build();

export {
  simpleSpanMethod,
  multiGroupSpanMethod,
  mixedSpanMethod,
  dynamicSpanMethod,
  cachedSpanMethod,
  noCacheSpanMethod,
  autoSpanMethod,
  newSpanMethod,
  updateData,
};
