<script setup lang="ts">
import { CommonForm, CommonButton } from '~/components';
import type { CommonSearchEmits, CommonSearchProps } from './Search.types';
import { commonKeysMap, componentDefaultPropsMap } from '../../CreateComponent/src/comMap.ts';
import { computed, getCurrentInstance, ref, inject } from 'vue';
import { ElCol, ElFormItem } from 'element-plus';

defineOptions({
  name: 'CommonSearch',
  inheritAttrs: false,
});

const emits = defineEmits<CommonSearchEmits>();
const vm = getCurrentInstance();
const props = defineProps<CommonSearchProps>();
const searchProps = computed(() => {
  const cleaned = Object.fromEntries(
    Object.entries(props).filter(([_, v]) => {
      return v !== undefined;
    }),
  );
  return {
    ...componentDefaultPropsMap.CommonSearch,
    ...cleaned,
  };
});
const queryParams: any = defineModel();
const search: Function | null = inject<(() => void) | null>('search', null);
/**
 * 查询方法
 * */
function queryHandler() {
  //判断是否传入了search事件
  const vnode: any = vm?.vnode || {};
  if (vnode['props']?.onSearch) {
    emits('search');
  } else {
    search && search();
  }
}
/**
 * 重置所有参数
 * */
function resetAllParams() {
  for (let key in queryParams.value) {
    if (![commonKeysMap.page, commonKeysMap.size].includes(key)) {
      delete queryParams.value[key];
    }
  }
}
/**
 * 重置方法
 * */
function resetHandler() {
  if (searchProps.value.resetAll) {
    resetAllParams();
  } else {
    queryForm.value.resetFields();
  }
  emits('reset');
  if (!searchProps.value.resetWithoutSearch) {
    queryHandler();
  }
}

const queryForm = ref();
function collectFormRef(instance: any) {
  if (vm) {
    queryForm.value =
      vm.exposeProxy =
      vm.exposed =
        {
          ...(instance || {}),
        };
  }
}
</script>

<template>
  <CommonForm
    v-bind="searchProps"
    :ref="collectFormRef"
    v-model="queryParams"
    class="commonSearch"
  >
    <template #moreCol>
      <el-col
        style="display: flex; align-items: center; min-width: 140px"
        :span="componentDefaultPropsMap.CommonSearch.actionCol"
      >
        <el-form-item>
          <CommonButton
            type="primary"
            @click="queryHandler"
          >
            搜索
          </CommonButton>
          <CommonButton
            type="normal"
            style="margin-left: 12px"
            plain
            @click="resetHandler"
          >
            重置
          </CommonButton>
        </el-form-item>
      </el-col>
    </template>
  </CommonForm>
</template>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
