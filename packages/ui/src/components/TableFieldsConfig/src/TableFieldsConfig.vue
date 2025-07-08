<script setup lang="ts">
import { ref, h } from 'vue';
import { CommonButton } from '~/components';
import type { CommonTableFieldsConfigProps } from './TableFieldsConfig.types';
import { ElCheckbox, ElPopover } from 'element-plus';
import menu from './svgs/menu.svg?raw';
defineOptions({
  name: 'CommonTableFieldsConfig',
  inheritAttrs: false,
});
const props = withDefaults(defineProps<CommonTableFieldsConfigProps>(), {});

const buttonRef = ref();
</script>

<template>
  <CommonButton
    ref="buttonRef"
    type="normal"
    :icon="h('span', { innerHTML: menu })"
  >
    表头配置
  </CommonButton>

  <el-popover
    trigger="click"
    :virtual-ref="buttonRef"
    virtual-triggering
    popper-class="TableHeaderConfig"
    width="auto"
  >
    <div
      v-for="(item, index) in props.config"
      :key="index"
      class="item"
    >
      <el-checkbox
        :model-value="!item.hidden"
        :label="item.label"
        @click="item.hidden = !item.hidden"
      />
    </div>
  </el-popover>
</template>

<style scoped lang="scss"></style>
