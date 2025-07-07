<template>
  <CommonDialog v-model:open="open">
    <div>弹窗测试2222</div>
  </CommonDialog>
  <el-button @click="open = true">
    弹窗
  </el-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const open = ref(false);
</script>
