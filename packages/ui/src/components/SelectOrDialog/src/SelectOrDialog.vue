<script setup lang="ts">
import { CommonSelect } from '../../Select';
import { CommonDialog } from '../../Dialog';
import { CommonButton } from '../../Button';
import { CommonTableLayout } from '../../TableLayout';
import { CommonSearch } from '../../Search';
import { CommonTable } from '../../Table';
import { CommonPagination } from '../../Pagination';
import { defineModel, ref } from 'vue';
import type { SelectOrDialogProps } from './SelectOrDialog.types';
import { useMixConfig } from 'dlib-hooks';
import {
  DataHandlerClass,
  DEFAULT_LABEL_FIELD,
  DEFAULT_VALUE_FIELD,
} from '~/_utils/dataHandlerClass.ts';
import { commonKeysMap } from '../../CreateComponent';
defineOptions({
  name: 'CommonSelectOrDialog',
  inheritAttrs: false,
});
const props = withDefaults(defineProps<SelectOrDialogProps>(), {});

const model = defineModel();
const label = defineModel('label');

const visible = ref(false);
const dataHandler = new DataHandlerClass(props);

function open() {
  visible.value = true;
  searchFun();
}

function searchFun() {
  if (!props.api) {
    dataHandler.init();
  }
}

const { search, table, data } = useMixConfig(props.dialogFieldsConfig);
const { queryParams, tableData, total } = data;

dataHandler.afterInit = (options: any[]) => {
  if (!props.api) {
    tableData.splice(0, tableData.length, ...options);
  }
};
const tableRef = ref();
function confirmHandler(close: Function) {
  const rows = tableRef.value.getSelectionRows();
  if (props.multiple) {
    let m = rows.map((item: Record<any, any>) => item[DEFAULT_VALUE_FIELD]),
      l = rows.map((item: Record<any, any>) => item[DEFAULT_LABEL_FIELD]);
    if (props.joinSplit) {
      model.value = m.join(props.joinSplit);
      label.value = l.join(props.joinSplit);
    } else {
      model.value = m;
      label.value = l;
    }
  } else {
    model.value = rows[0]?.[DEFAULT_VALUE_FIELD];
    label.value = rows[0]?.[DEFAULT_LABEL_FIELD];
  }
  close();
}
</script>

<template>
  <div style="display: flex; flex-direction: row; align-items: center">
    <CommonSelect
      v-model="model"
      v-model:label="label"
      v-bind="props"
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
            :col="{
              sm: 24,
              md: 24,
              lg: 12,
              xl: 12,
            }"
            :config="search.config"
          />
        </template>
        <template #table>
          <CommonTable
            ref="tableRef"
            v-model="tableData"
            reserve-selection
            use-index
            use-selection
            :row-key="props.valueField || DEFAULT_VALUE_FIELD"
            :single-selection="!props.multiple"
            :config="table.config"
            :data="tableData"
          />
        </template>
        <template #pagination>
          <CommonPagination
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
