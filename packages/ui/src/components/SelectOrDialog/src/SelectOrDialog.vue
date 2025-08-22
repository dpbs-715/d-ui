<script setup lang="ts">
import { CommonSelect } from '~/components';
import { defineModel, useAttrs } from 'vue';
defineOptions({
  name: 'CommonSelectOrDialog',
  inheritAttrs: false,
});
const model = defineModel();
const label = defineModel('label');

const attrs = useAttrs();
</script>

<template>
  <CommonSelect
    v-model="model"
    v-model:label="label"
    v-bind="attrs"
  />
</template>

<style scoped></style>
