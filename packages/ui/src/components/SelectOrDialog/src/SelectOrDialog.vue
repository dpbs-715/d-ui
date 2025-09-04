<script setup lang="ts">
import { CommonSelect } from '../../Select';
import { CommonDialog } from '../../Dialog';
import { CommonButton } from '../../Button';
import { CommonTableLayout } from '../../TableLayout';
import { CommonSearch } from '../../Search';
import { CommonTable } from '../../Table';
import { CommonPagination } from '../../Pagination';
import { defineModel, ref, nextTick, watch, type Ref, useAttrs } from 'vue';
import type { SelectOrDialogProps } from './SelectOrDialog.types';
import { useMixConfig } from 'dlib-hooks';
import {
  DataHandlerClass,
  DEFAULT_LABEL_FIELD,
  DEFAULT_VALUE_FIELD,
} from '~/_utils/dataHandlerClass.ts';
import { commonKeysMap } from '../../CreateComponent';
import { isEmpty } from 'dlib-utils';
defineOptions({
  name: 'CommonSelectOrDialog',
  inheritAttrs: false,
});
const props = withDefaults(defineProps<SelectOrDialogProps>(), {});
const attrs = useAttrs();
const model: any = defineModel();
const label: any = defineModel('label');
const visible = ref(false);
const selections = ref<any>([]);
const labelSelections = ref<any>([]);

const tableRef = ref();

const dataHandler = new DataHandlerClass(props);
const loading: Ref<Boolean> = dataHandler.loading;

function open() {
  visible.value = true;
  if (!isEmpty(model.value)) {
    initSelection();
  }
  searchFun();
}
/**
 * 初始化选中数据
 * */
function initSelection() {
  selections.value = [];
  labelSelections.value = [];
  if (props.multiple) {
    if (props.joinSplit) {
      selections.value = model.value?.split(props.joinSplit);
      labelSelections.value = label.value?.split(props.joinSplit);
    } else {
      selections.value = model.value;
      labelSelections.value = label.value;
    }
  } else {
    selections.value = [model.value];
    labelSelections.value = [label.value];
  }
}
/**
 * 获取数据
 * */
function searchFun() {
  if (!props.api) {
    dataHandler.preInitOptions();
  } else {
    dataHandler.setMoreQueryParams(queryParams);
    dataHandler.preInitOptions();
  }
}

const { search, table, data } = useMixConfig(props.dialogFieldsConfig);
const { queryParams, tableData, total } = data;
queryParams[commonKeysMap.size] = commonKeysMap.defaultSize;
/**
 * 监听query
 * 如果query有值，则设置query参数，并禁用query参数的输入框
 * */
watch(
  props.query ?? (() => ({})),
  () => {
    const queryData = props.query?.() || {};
    search.setDisabledAll(false);
    search.setDisabled(Object.keys(queryData), true);
    for (let key in queryData) {
      queryParams[key] = queryData[key];
      search.setPropsByField(key, {
        placeholder: '自动',
      });
    }
  },
  {
    immediate: true,
  },
);

/**
 * 获取字典数据或者手动绑定的数据结果
 * */
dataHandler.afterInit = (options: any[]) => {
  if (!props.api) {
    tableData.splice(0, tableData.length, ...dataHandler.filterByQuery(options, queryParams));
  } else {
    tableData.splice(0, tableData.length, ...options);
    total.value = dataHandler.total;
  }

  handlerDataSelections();
};

/**
 * 处理数据选中状态
 * */
function handlerDataSelections() {
  nextTick(() => {
    tableRef.value.clearSelection();
  });
  // 处理选中
  tableData.forEach((item) => {
    if (selections.value.includes(item[props.valueField || DEFAULT_VALUE_FIELD])) {
      nextTick(() => {
        tableRef.value.toggleRowSelection(item);
      });
    }
  });
}
/**
 * 根据数组获取选中的值和标签
 * */
function getValuesAndLabels(arr: Record<any, any>) {
  let values: any[] = [],
    labels: any[] = [];
  arr.forEach((item: any) => {
    values.push(item[props.valueField || DEFAULT_VALUE_FIELD]);
    labels.push(item[props.labelField || DEFAULT_LABEL_FIELD]);
  });
  return [values, labels];
}
/**
 * 选中项修改
 * */
function selectChange(selection: any) {
  // 获取选中的值和标签
  const [values, labels] = getValuesAndLabels(tableData);
  //先过滤到当前列表所有数据
  selections.value = selections.value.filter((value: any) => {
    return !values.includes(value);
  });

  //再过滤到当前列表所有标签
  labelSelections.value = labelSelections.value.filter((value: any) => {
    return !labels.includes(value);
  });
  //添加选中数据、标签
  selection.forEach((o: any) => {
    selections.value.push(o[props.valueField || DEFAULT_VALUE_FIELD]);
    labelSelections.value.push(o[props.labelField || DEFAULT_LABEL_FIELD]);
  });
}
/**
 * 确认
 * */
async function confirmHandler(close: Function) {
  //1.beforeConfirm 数据确认前 可能会有校验等操作 中断选中
  await props.beforeConfirm?.(selections.value, labelSelections.value);

  if (props.multiple) {
    if (props.joinSplit) {
      model.value = selections.value.join(props.joinSplit);
      label.value = labelSelections.value.join(props.joinSplit);
    } else {
      model.value = selections.value;
      label.value = labelSelections.value;
    }
  } else {
    model.value = selections.value[selections.value.length - 1];
    label.value = labelSelections.value[labelSelections.value.length - 1];
  }

  //2.执行各种change事件
  props.onChange?.(selections.value, labelSelections.value);
  props.onChangeObj?.(tableRef.value.getSelectionRows());

  close();
}
</script>

<template>
  <div style="display: flex; flex-direction: row; align-items: center">
    <CommonSelect
      v-model="model"
      v-model:label="label"
      v-bind="{ ...props, ...attrs }"
    />
    <CommonButton
      style="margin-left: 5px"
      type="primary"
      plain
      @click="open"
    >
      选择
    </CommonButton>
    <CommonDialog
      v-model="visible"
      title="数据选择"
      v-bind="props.dialogProps"
      @confirm="confirmHandler"
    >
      <CommonTableLayout>
        <template #search>
          <CommonSearch
            v-model="queryParams"
            :loading="loading"
            :col="{
              sm: 24,
              md: 24,
              lg: 12,
              xl: 12,
            }"
            :config="search.config"
            @search="searchFun"
          />
        </template>
        <template #table>
          <CommonTable
            ref="tableRef"
            v-model="tableData"
            :loading="dataHandler.loading"
            reserve-selection
            use-index
            use-selection
            :row-key="props.valueField || DEFAULT_VALUE_FIELD"
            :single-selection="!props.multiple"
            :config="table.config"
            :data="tableData"
            @selection-change="selectChange"
          />
        </template>
        <template #pagination>
          <CommonPagination
            v-if="total"
            v-model:page="queryParams[commonKeysMap.page]"
            v-model:limit="queryParams[commonKeysMap.size]"
            :total="total"
            @pagination="searchFun"
          />
        </template>
      </CommonTableLayout>
    </CommonDialog>
  </div>
</template>

<style scoped></style>
