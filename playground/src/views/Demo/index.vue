<script setup lang="ts">
import { CommonFoma } from '~/dlib-ui';
import { ref } from 'vue';
const model = ref('a');
function errorFun(e) {
  console.log(e);
}
</script>

<template>
  <CommonFoma v-model="model" :variables="[{ name: 'a' }, { name: 'b' }]" @error="errorFun" />
</template>

<style scoped></style>
