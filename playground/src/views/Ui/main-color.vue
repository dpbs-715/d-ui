<script lang="ts" setup>
import { useCssVar } from '@vueuse/core';

const primary = useCssVar('--el-color-primary');
const colorLevel = [1, 3, 7, 8, 9].map((i) => `light-${i}`);
colorLevel.unshift('dark-2');
</script>

<template>
  <el-row :gutter="12">
    <el-col
      :span="10"
      :xs="{ span: 12 }"
    >
      <div
        class="demo-color-box"
        :style="{ background: primary }"
      >
        Brand Color
        <div
          class="value"
          text="xs"
        >
          {{ primary.toUpperCase() }}
        </div>
        <div
          class="bg-color-sub"
          :style="{ background: primary }"
        >
          <div
            v-for="level in colorLevel"
            :key="level"
            class="bg-blue-sub-item cursor-pointer hover:shadow"
            :style="{
              textAlign: 'center',
              width: `${100 / 6}%`,
              background: 'var(--el-color-primary-' + level + ')',
            }"
          >
            <!--            {{ useCssVar('&#45;&#45;el-color-primary-' + level) }}-->
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<style lang="scss" scoped>
.demo-color-box {
  position: relative;
  box-sizing: border-box;
  height: 112px;
  padding: 20px;
  margin: 8px 0;
  font-size: 14px;
  color: var(--el-color-white);
  border-radius: 4px;

  .bg-color-sub {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;

    .bg-blue-sub-item {
      display: inline-block;
      height: 100%;

      &:first-child {
        border-radius: 0;
      }
    }

    .bg-secondary-sub-item {
      display: inline-block;
      height: 100%;

      &:first-child {
        border-radius: 0 0 0 var(--el-border-radius-base);
      }
    }
  }

  .value {
    margin-top: 2px;
  }
}

.demo-color-box-lite {
  color: var(--el-text-color-primary);
}
</style>
