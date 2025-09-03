<script setup lang="ts">
import { ref } from 'vue';
const fieldConfig = [
  {
    label: '字段1',
    field: 'label',
    table: true,
    search: {
      component: 'commonSelect',
      props: {
        bindOptions: [
          {
            label: 'label1',
            value: 'label1',
          },
          {
            label: 'value2',
            value: 'value2',
          },
        ],
      },
    },
  },
  {
    label: '字段2',
    field: 'value',
    table: true,
    search: {
      component: 'commonSelect',
      props: {
        bindOptions: [
          {
            label: 'label1',
            value: 'value1',
          },
          {
            label: 'label2',
            value: 'value2',
          },
        ],
      },
    },
  },
];

// const options = [
//   {
//     label: 'label1',
//     value: 'value1',
//   },
//   {
//     label: 'label2',
//     value: 'value2',
//   },
// ];
function createData(number) {
  let arr = [];
  for (let i = 0; i < number; i++) {
    arr.push({
      label: 'label' + (i + 1),
      value: 'value' + (i + 1),
    });
  }
  return arr;
}
function getOptions(data: any) {
  console.log(data);
  return new Promise((resolve) => {
    resolve({
      list: createData(10),
      total: 15,
    });
  });
}

const model = ref('');
const modelLabel = ref('');
const queryValue = ref('');

function changeFun(...args: any) {
  console.log('change', args);
}

function changeObjFun(...args: any) {
  console.log('changeObj', args);
}
function beforeConfirmFun(selections, _labelSelections) {
  if (selections.length === 0) {
    alert('请选择');
    return Promise.reject();
  } else {
    return Promise.resolve();
  }
}
</script>

<template>
  <el-button @click="() => (queryValue = 'label2')">
    选择
  </el-button>
  {{ model }}{{ modelLabel }}
  <CommonSelectOrDialog
    v-model:label="modelLabel"
    v-model="model"
    multiple
    join-split=","
    :dialog-fields-config="fieldConfig"
    :api="getOptions"
    :dialog-props="{
      title: '选择数据',
      width: '80%',
    }"
    :before-confirm="beforeConfirmFun"
    @change="changeFun"
    @change-obj="changeObjFun"
  />
</template>

<style scoped></style>
