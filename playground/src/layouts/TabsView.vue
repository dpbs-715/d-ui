<template>
  <div :class="`${name}-demo`">
    <el-tabs
      v-model="activeKey"
      type="card"
    >
      <el-tab-pane
        v-for="item in renderCmp"
        :key="item.index"
        :label="item.name"
      />
    </el-tabs>
    <component :is="renderCmp[activeKey]?.component" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  name: string;
}

const props = defineProps<Props>();
const activeKey = ref(0);

const components = import.meta.glob('../views/**/**.vue', {
  eager: true,
  import: 'default',
});

const renderCmp = Object.entries(components)
  .filter(([path]) =>
    path.includes(`/${props.name.charAt(0).toUpperCase() + props.name.slice(1)}/`),
  )
  .map(([path, component], index) => {
    const name = path.match(/[^/]+(?=\.vue$)/)?.[0] || 'error';
    return {
      name,
      component,
      index,
    };
  });
</script>

<style scoped>
/* 可根据需要添加样式 */
</style>
