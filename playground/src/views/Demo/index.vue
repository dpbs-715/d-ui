<script setup lang="ts">
import { CommonFoma } from '~/dlib-ui';
import { ref } from 'vue';
const model = ref('a');
</script>

<template>
  <CommonFoma v-model="model" />
</template>

<style scoped></style>
