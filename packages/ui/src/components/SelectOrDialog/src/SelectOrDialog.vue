<script setup lang="ts">
import { CommonSelect } from '~/components';
import { defineModel } from 'vue';
defineOptions({
  name: 'CommonSelectOrDialog',
  inheritAttrs: false,
});
const model = defineModel();
const label = defineModel('label');
</script>

<template>
  <CommonSelect
    v-model="model"
    v-model:label="label"
  />
</template>

<style scoped></style>
