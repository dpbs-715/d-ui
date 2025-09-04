<script setup lang="ts">
import { ref } from 'vue';
import { useTableHeight } from './useTableHeight.ts';
import { ElRow, ElCol } from 'element-plus';

defineOptions({
  name: 'CommonTableLayout',
  inheritAttrs: false,
});
const searchRef = ref();
const operationRef = ref();
const paginationRef = ref();
const { tableHeight } = useTableHeight([searchRef, operationRef, paginationRef]);
</script>

<template>
  <div class="common-table-layout">
    <div
      ref="searchRef"
      class="layout-search"
    >
      <slot name="search" />
    </div>
    <div class="layout-body">
      <div
        ref="operationRef"
        class="layout-operation"
      >
        <el-row>
          <el-col
            :span="12"
            class="operation-left"
          >
            <slot name="operation-left" />
          </el-col>
          <el-col
            :span="12"
            class="operation-right"
          >
            <slot name="operation-right" />
          </el-col>
        </el-row>
      </div>
      <div class="layout-table">
        <slot
          name="table"
          :table-height="tableHeight"
        />
      </div>
      <div
        ref="paginationRef"
        class="layout-pagination"
      >
        <slot name="pagination" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use './TableLayout.scss' as *;
</style>
