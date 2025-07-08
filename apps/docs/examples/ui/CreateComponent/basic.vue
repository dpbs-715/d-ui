<script setup lang="ts">
import { ref } from 'vue';
import { CreateComponent, type Config } from 'dlib-ui';
const config = ref<Config>({
  component: 'button',
});
</script>

<template>
  <CreateComponent :config="config">
    测试
  </CreateComponent>
</template>

<style scoped></style>
