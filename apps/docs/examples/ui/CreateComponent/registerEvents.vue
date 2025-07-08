<script setup lang="ts">
import { ref } from 'vue';
import { CreateComponent, type Config, registerComponentDefaultEventsMap } from 'dlib-ui';
registerComponentDefaultEventsMap({
  input: {
    onClick: () => {
      console.log('click');
    },
  },
});
const config = ref<Config>({
  component: 'input',
});
</script>

<template>
  <CreateComponent :config="config" />
</template>

<style scoped></style>
