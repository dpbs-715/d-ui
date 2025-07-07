<template>
  <!-- 全局引入测试 -->
  <CommonButton>按钮</CommonButton>
  <CommonButton
    type="primary"
    plain
  >
    按钮
  </CommonButton>
  <CommonButton type="success">
    按钮
  </CommonButton>
  <CommonButton type="warning">
    按钮
  </CommonButton>
  <CommonButton type="danger">
    按钮
  </CommonButton>
  <CommonButton type="info">
    按钮
  </CommonButton>
</template>

<script setup lang="ts">
// import { VButton } from '~/@DLib/ui'; // 本地实时调试，组件修改代码，立马能看到效果，不需要打包
// import { VButton } from '@DLib/ui'; // 从node_modules/@DLib/ui/dist/es里面引入的，需要打包ui库
// 导出类型测试
// import type { ButtonProps } from '@DLib/ui';
// const buttonProps: ButtonProps = {
//   type: 'primary',
// };
</script>
