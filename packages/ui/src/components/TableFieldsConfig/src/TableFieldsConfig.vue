<script setup lang="ts">
import { ref, h } from 'vue';
import { CommonButton } from '~/components';
import type { CommonTableFieldsConfigProps } from './TableFieldsConfig.types';
import { Top, Bottom } from '@element-plus/icons-vue';
import { ElDrawer, ElIcon, ElCheckbox, ElLink } from 'element-plus';
import menu from './svgs/menu.svg?raw';
defineOptions({
  name: 'CommonTableFieldsConfig',
  inheritAttrs: false,
});
const props = withDefaults(defineProps<CommonTableFieldsConfigProps>(), {
  direction: 'rtl',
});
const drawer = ref(false);

const move = (index: number, actNumber: 1 | -1, list = props.config) => {
  //-1 左移(上移) | 1 右移(下移)
  if (index > 0) {
    [list[index], list[index + 1 * actNumber]] = [list[index + 1 * actNumber], list[index]]; // 交换元素
  }
  return list;
};
// 置顶
const moveToTop = (index: number, list = props.config) => {
  if (index <= list.length - 1) {
    const item = list.splice(index, 1)[0];
    list.unshift(item);
  }
  return list;
};

function open() {
  drawer.value = true;
}
</script>

<template>
  <CommonButton
    type="normal"
    :icon="h('span', { innerHTML: menu })"
    @click="open"
  >
    表头配置
  </CommonButton>

  <el-drawer
    v-model="drawer"
    class="TableHeaderConfig"
    title="表头配置"
    :size="480"
    :direction="props.direction"
  >
    <template
      v-for="(item, index) in props.config"
      :key="index"
    >
      <div class="item">
        <div class="item_label">
          <el-checkbox
            :model-value="!item.hidden"
            :label="item.label"
            @click="item.hidden = !item.hidden"
          />
          <div class="item_right">
            <el-icon
              v-if="index != props.config?.length - 1"
              size="18"
              @click="move(index, 1)"
            >
              <Bottom />
            </el-icon>
            <el-icon
              v-if="index != 0"
              size="18"
              @click="move(index, -1)"
            >
              <Top />
            </el-icon>
            <el-link
              v-if="index != 0"
              type="primary"
              @click="moveToTop(index)"
            >
              置顶
            </el-link>
          </div>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<style scoped lang="scss">
.TableHeaderConfig {
  width: 100%;

  .item {
    .item_label {
      display: flex;
      justify-content: space-between;
      width: 100%;

      .item_right {
        display: flex;
        align-items: center;

        .el-icon {
          margin-right: 10px;
          cursor: pointer;

          &:hover {
            color: rgb(2 84 184 / 100%);
          }
        }
      }
    }

    .item_tag {
      display: flex;
      padding-left: 24px;
    }
  }
}
</style>
