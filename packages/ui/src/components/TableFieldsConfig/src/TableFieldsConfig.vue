<script setup lang="ts">
import { ref } from 'vue';
import { CommonButton } from '../../Button';
import type { CommonTableFieldsConfigProps } from './TableFieldsConfig.types';
import { ElCheckbox, ElPopover, ElTooltip } from 'element-plus';
import { Menu } from '@element-plus/icons-vue';
import { vDraggable } from 'vue-draggable-plus';

defineOptions({
  name: 'CommonTableFieldsConfig',
  inheritAttrs: false,
});
const props = withDefaults(defineProps<CommonTableFieldsConfigProps>(), {});

const buttonRef = ref();
</script>

<template>
  <el-tooltip
    content="字段配置"
    placement="top"
  >
    <CommonButton
      ref="buttonRef"
      circle
      plain
      type="primary"
      :icon="Menu"
    />
  </el-tooltip>

  <el-popover
    trigger="click"
    :virtual-ref="buttonRef"
    virtual-triggering
    popper-class="TableHeaderConfig"
    width="auto"
  >
    <div v-draggable="[props.config, { animation: 150 }]">
      <div
        v-for="(item, index) in props.config"
        :key="item.field + index"
        class="item"
      >
        <el-checkbox
          :model-value="!item.hidden"
          :label="item.label"
          @click="item.hidden = !item.hidden"
        />
      </div>
    </div>
  </el-popover>
</template>

<style scoped lang="scss"></style>
