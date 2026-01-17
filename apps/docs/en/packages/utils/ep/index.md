# ElementPlus Utilities

## createSpanMethod

> Create an intelligent cell merging function for ElementPlus Table component, supporting multi-column priority-based merging of cells with identical values.

### Basic Usage

The simplest usage - just specify the columns to merge:

```ts
import { createSpanMethod } from 'dlib-utils';

const tableData = ref([
  { province: 'Zhejiang', city: 'Hangzhou', area: 'Xihu' },
  { province: 'Zhejiang', city: 'Hangzhou', area: 'Binjiang' },
  { province: 'Zhejiang', city: 'Ningbo', area: 'Yinzhou' },
  { province: 'Jiangsu', city: 'Nanjing', area: 'Xuanwu' },
]);

const spanMethod = createSpanMethod({
  mergeColumns: ['province', 'city'],
  data: tableData,
});
```

```vue
<template>
  <el-table :data="tableData" :span-method="spanMethod">
    <el-table-column prop="province" label="Province" />
    <el-table-column prop="city" label="City" />
    <el-table-column prop="area" label="Area" />
  </el-table>
</template>
```

### Multi-Column Priority Merging

Columns in the `mergeColumns` array are merged based on their priority order. A column will only be merged if its value is the same and all higher-priority columns are within the same merge area.

```ts
const tableData = ref([
  { dept: 'Tech', team: 'Frontend', name: 'Alice', age: 25 },
  { dept: 'Tech', team: 'Frontend', name: 'Bob', age: 26 },
  { dept: 'Tech', team: 'Backend', name: 'Charlie', age: 27 },
  { dept: 'Marketing', team: 'Promotion', name: 'David', age: 28 },
]);

const spanMethod = createSpanMethod({
  mergeColumns: ['dept', 'team'], // dept has highest priority, team is second
  data: tableData,
});
```

In this example:

- Rows 1-3 "Tech" will be merged (same dept value)
- Rows 1-2 "Frontend" will be merged (both dept and team are the same)
- Row 3 "Backend" won't merge with previous rows (different team value)

### Cache Optimization

By default, `createSpanMethod` enables intelligent caching to optimize performance. Caching avoids recalculating merge information on every render.

#### Default Smart Cache

Smart caching is enabled by default and automatically detects changes in merge column data:

```ts
const spanMethod = createSpanMethod({
  mergeColumns: ['province', 'city'],
  data: tableData,
  cache: true, // default value, can be omitted
});
```

#### Manual Cache Control (Recommended)

For large datasets, it's recommended to use `cacheKey` for manual cache invalidation - this provides optimal performance:

```ts
const version = ref(0);
const tableData = ref([...]);

const spanMethod = createSpanMethod({
  mergeColumns: ['province', 'city'],
  data: tableData,
  cacheKey: version, // provide cache key
});

// When data changes, manually update the cache key
function updateData(newData) {
  tableData.value = newData;
  version.value++; // increment version to trigger cache update
}
```

#### Disable Cache

If data changes very frequently, you can disable caching:

```ts
const spanMethod = createSpanMethod({
  mergeColumns: ['province', 'city'],
  data: tableData,
  cache: false, // disable cache, recalculate every time
});
```

### Reactive Data

Both `data` and `cacheKey` parameters support reactive data (ref/computed) and will be automatically unwrapped:

```ts
const tableData = ref([...]);
const cacheKey = ref(0);

const spanMethod = createSpanMethod({
  mergeColumns: ['province'],
  data: tableData, // supports ref
  cacheKey: cacheKey, // supports ref
});
```

### Complete Example

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { createSpanMethod } from 'dlib-utils';

const version = ref(0);
const tableData = ref([
  { province: 'Zhejiang', city: 'Hangzhou', area: 'Xihu', population: 100 },
  { province: 'Zhejiang', city: 'Hangzhou', area: 'Binjiang', population: 120 },
  { province: 'Zhejiang', city: 'Ningbo', area: 'Yinzhou', population: 90 },
  { province: 'Jiangsu', city: 'Nanjing', area: 'Xuanwu', population: 80 },
]);

const spanMethod = createSpanMethod({
  mergeColumns: ['province', 'city'],
  data: tableData,
  cacheKey: version,
});

// Add new row
function addRow() {
  tableData.value.push({
    province: 'Zhejiang',
    city: 'Hangzhou',
    area: 'Gongshu',
    population: 110,
  });
  version.value++; // update cache key
}

// Update row
function updateRow(index: number) {
  tableData.value[index].city = 'Wenzhou';
  version.value++; // update cache key
}
</script>

<template>
  <div>
    <el-button @click="addRow">Add Row</el-button>
    <el-button @click="updateRow(0)">Update First Row</el-button>

    <el-table :data="tableData" :span-method="spanMethod" border>
      <el-table-column prop="province" label="Province" width="120" />
      <el-table-column prop="city" label="City" width="120" />
      <el-table-column prop="area" label="Area" width="120" />
      <el-table-column prop="population" label="Population (10k)" width="120" />
    </el-table>
  </div>
</template>
```

### API

#### createSpanMethod(config)

Create a span-method function for ElementPlus Table.

**Parameters:**

| Name           | Type                         | Required | Default | Description                                                    |
| -------------- | ---------------------------- | -------- | ------- | -------------------------------------------------------------- |
| `mergeColumns` | `string[]`                   | Yes      | -       | Array of column prop names to merge, sorted by priority        |
| `data`         | `MaybeRef<any[]>`            | Yes      | -       | Table data array, supports ref/computed                        |
| `cache`        | `boolean`                    | No       | `true`  | Enable cache optimization                                      |
| `cacheKey`     | `MaybeRef<string \| number>` | No       | -       | Cache key for manual cache invalidation. Supports ref/computed |

**Returns:**

Returns a function that matches the ElementPlus Table `span-method` signature:

```ts
(params: { row: any; column: any; rowIndex: number; columnIndex: number }) => {
  rowspan: number;
  colspan: number;
};
```

### Performance Optimization Tips

1. **Large Datasets**: Use `cacheKey` for manual cache control to avoid automatic detection overhead
2. **Frequent Updates**: If data changes very frequently and requires recalculation each time, consider disabling cache (`cache: false`)
3. **Number of Merge Columns**: Minimize the number of columns in `mergeColumns`, only merge necessary columns
4. **Data Sorting**: Ensure data is sorted by merge columns - rows with identical values must be consecutive for proper merging

### Important Notes

1. Table data must be sorted by merge columns - rows with identical values should be consecutive
2. Column names in `mergeColumns` must match the `prop` attribute of `el-table-column`
3. When using `cacheKey`, you must manually update the `cacheKey` value after data changes
4. Merging only affects visual presentation and doesn't modify the underlying data
