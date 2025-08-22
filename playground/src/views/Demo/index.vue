<script setup lang="ts">
import { ref } from 'vue';

function mockApi() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ label: '选项1', value: '1' }]);
    }, 2000);
  });
}
const model = ref('');
const label = ref('');
</script>

<template>
  {{ model }}
  {{ label }}
  <!--  <CommonSelectOrDialog-->
  <!--    v-model:label="label"-->
  <!--    v-model="model"-->
  <!--    :api="mockApi"/>-->
  <CommonSelect
    v-model="model"
    :api="mockApi"
    auto-select-first
    @options-ready="(res) => console.log(res)"
  />
</template>

<style scoped></style>
