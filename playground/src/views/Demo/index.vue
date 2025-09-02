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

function getOptions(data: any) {
  console.log(data);
  return new Promise((resolve) => {
    if (data.label == 'label1') {
      return resolve([
        {
          label: 'label1',
          value: 'value1',
        },
      ]);
    } else if (data.label == 'label2') {
      return resolve([
        {
          label: 'label2',
          value: 'value2',
        },
      ]);
    } else {
      resolve([
        {
          label: 'label1',
          value: 'value1',
        },
        {
          label: 'label2',
          value: 'value2',
        },
      ]);
    }
  });
}

const model = ref('');
const modelLabel = ref('');
const queryValue = ref('');
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
  />
</template>

<style scoped></style>
