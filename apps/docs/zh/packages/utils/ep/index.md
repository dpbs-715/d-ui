# ElementPlus 工具函数

## createSpanMethod

> 为 ElementPlus Table 组件创建智能单元格合并函数，支持多列按优先级合并相同值的单元格。

### 基础用法

最简单的使用方式，指定需要合并的列即可：

```ts
import { createSpanMethod } from 'dlib-utils';

const tableData = ref([
  { province: '浙江', city: '杭州', area: '西湖区' },
  { province: '浙江', city: '杭州', area: '滨江区' },
  { province: '浙江', city: '宁波', area: '鄞州区' },
  { province: '江苏', city: '南京', area: '玄武区' },
]);

const spanMethod = createSpanMethod({
  mergeColumns: ['province', 'city'],
  data: tableData,
});
```

```vue
<template>
  <el-table :data="tableData" :span-method="spanMethod">
    <el-table-column prop="province" label="省份" />
    <el-table-column prop="city" label="城市" />
    <el-table-column prop="area" label="区域" />
  </el-table>
</template>
```

### 多列优先级合并

`mergeColumns` 数组中的列会按照优先级顺序进行合并。只有当前列的值相同，且所有优先级更高的列都在同一个合并区域内时，当前列才会被合并。

```ts
const tableData = ref([
  { dept: '技术部', team: '前端组', name: '张三', age: 25 },
  { dept: '技术部', team: '前端组', name: '李四', age: 26 },
  { dept: '技术部', team: '后端组', name: '王五', age: 27 },
  { dept: '市场部', team: '推广组', name: '赵六', age: 28 },
]);

const spanMethod = createSpanMethod({
  mergeColumns: ['dept', 'team'], // dept 优先级最高，team 次之
  data: tableData,
});
```

在这个例子中：

- 第 1-3 行的 "技术部" 会被合并（因为 dept 值相同）
- 第 1-2 行的 "前端组" 会被合并（因为 dept 和 team 都相同）
- 第 3 行的 "后端组" 不会与前两行合并（因为 team 值不同）

### 缓存优化

默认情况下，`createSpanMethod` 会启用智能缓存来优化性能。缓存可以避免在每次渲染时重新计算合并信息。

#### 默认智能缓存

默认启用智能缓存，会自动检测合并列的数据变化：

```ts
const spanMethod = createSpanMethod({
  mergeColumns: ['province', 'city'],
  data: tableData,
  cache: true, // 默认值，可省略
});
```

#### 手动控制缓存（推荐）

对于大数据量场景，推荐使用 `cacheKey` 手动控制缓存失效，性能最优：

```ts
const version = ref(0);
const tableData = ref([...]);

const spanMethod = createSpanMethod({
  mergeColumns: ['province', 'city'],
  data: tableData,
  cacheKey: version, // 提供缓存键
});

// 当数据变化时，手动更新缓存键
function updateData(newData) {
  tableData.value = newData;
  version.value++; // 增加版本号，触发缓存更新
}
```

#### 禁用缓存

如果数据变化非常频繁，也可以选择禁用缓存：

```ts
const spanMethod = createSpanMethod({
  mergeColumns: ['province', 'city'],
  data: tableData,
  cache: false, // 禁用缓存，每次都重新计算
});
```

### 响应式数据

`data` 和 `cacheKey` 参数都支持响应式数据（ref/computed），会自动解包：

```ts
const tableData = ref([...]);
const cacheKey = ref(0);

const spanMethod = createSpanMethod({
  mergeColumns: ['province'],
  data: tableData, // 支持 ref
  cacheKey: cacheKey, // 支持 ref
});
```

### 完整示例

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { createSpanMethod } from 'dlib-utils';

const version = ref(0);
const tableData = ref([
  { province: '浙江', city: '杭州', area: '西湖区', population: 100 },
  { province: '浙江', city: '杭州', area: '滨江区', population: 120 },
  { province: '浙江', city: '宁波', area: '鄞州区', population: 90 },
  { province: '江苏', city: '南京', area: '玄武区', population: 80 },
]);

const spanMethod = createSpanMethod({
  mergeColumns: ['province', 'city'],
  data: tableData,
  cacheKey: version,
});

// 添加新数据
function addRow() {
  tableData.value.push({
    province: '浙江',
    city: '杭州',
    area: '拱墅区',
    population: 110,
  });
  version.value++; // 更新缓存键
}

// 修改数据
function updateRow(index: number) {
  tableData.value[index].city = '温州';
  version.value++; // 更新缓存键
}
</script>

<template>
  <div>
    <el-button @click="addRow">添加行</el-button>
    <el-button @click="updateRow(0)">修改第一行</el-button>

    <el-table :data="tableData" :span-method="spanMethod" border>
      <el-table-column prop="province" label="省份" width="120" />
      <el-table-column prop="city" label="城市" width="120" />
      <el-table-column prop="area" label="区域" width="120" />
      <el-table-column prop="population" label="人口（万）" width="120" />
    </el-table>
  </div>
</template>
```

### API

#### createSpanMethod(config)

创建 ElementPlus Table 的 span-method 函数。

**参数：**

| 参数名         | 类型                         | 必填 | 默认值 | 说明                                            |
| -------------- | ---------------------------- | ---- | ------ | ----------------------------------------------- |
| `mergeColumns` | `string[]`                   | 是   | -      | 需要合并的列的 prop 名称数组，按优先级排序      |
| `data`         | `MaybeRef<any[]>`            | 是   | -      | 表格数据数组，支持 ref/computed                 |
| `cache`        | `boolean`                    | 否   | `true` | 是否启用缓存优化                                |
| `cacheKey`     | `MaybeRef<string \| number>` | 否   | -      | 缓存键，用于手动控制缓存失效。支持 ref/computed |

**返回值：**

返回一个符合 ElementPlus Table `span-method` 签名的函数：

```ts
(params: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  rowspan: number;
  colspan: number;
};
```

### 性能优化建议

1. **大数据量场景**：使用 `cacheKey` 手动控制缓存，避免自动检测的性能开销
2. **频繁更新场景**：如果数据变化非常频繁且每次变化都需要重新计算，可以考虑禁用缓存（`cache: false`）
3. **合并列数量**：尽量减少 `mergeColumns` 中的列数，只合并必要的列
4. **数据排序**：确保数据已按合并列排序，相同值的行连续排列才能正确合并

### 注意事项

1. 表格数据必须已经按照合并列排序，相同值的行应该连续排列
2. `mergeColumns` 中的列名必须与 `el-table-column` 的 `prop` 属性一致
3. 当使用 `cacheKey` 时，必须在数据变化后手动更新 `cacheKey` 的值
4. 合并只影响视觉呈现，不影响数据本身
