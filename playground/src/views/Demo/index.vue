<template>
  <ElInput v-model="data" />
  {{ flg }}<br>
  {{ obj.flg }}
  <div ref="divRef" v-trunced="flg" class="test">
    {{ data }}
  </div>
</template>

<script setup lang="ts">
import { vTrunced } from 'dlib-directives';
import { ref } from 'vue';
const flg = ref(false);
const obj = ref({
  flg: false,
});
const data = ref('');
const divRef = ref();
</script>
<style scoped>
.test {
  width: 100px;
  height: 100px;
  overflow: hidden;
}
</style>
