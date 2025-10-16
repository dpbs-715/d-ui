import ResizeObserver from 'resize-observer-polyfill';
/**
 * v-trunced 指令用于检测元素内容是否溢出（被截断）
 *
 * 用法:
 * 1. 基本用法: <div v-trunced="isTruncated">内容</div>
 *    - isTruncated 是组件 data 中的变量，当内容溢出时会被设置为 true
 *
 * 2. 使用参数: <div v-trunced:value="truncedData">内容</div>
 *    - truncedData.value 会被设置为布尔值表示是否溢出
 *
 * 3. 使用 parent 修饰符: <div v-trunced.parent="isTruncated">内容</div>
 *    - 检测父元素而不是元素本身是否溢出
 *
 * 注意: 需要配合 CSS 的 overflow: hidden 或类似属性使用才能产生截断效果
 */

const syncVariable = (node: HTMLElement, binding: any, vnode: any) => {
  const isTruncated = node.offsetHeight < node.scrollHeight || node.offsetWidth < node.scrollWidth;

  if (binding.arg) {
    binding.value[binding.arg] = isTruncated;
  }
  //   else {
  //     binding.value.value = isTruncated;
  //   }
};
const trunced = {
  directName: 'trunced',
  mounted: function (el: HTMLElement, binding: any, vnode: any) {
    const node = binding.modifiers.parent ? (el.parentNode as HTMLElement) : el;
    syncVariable(node, binding, vnode);

    const ro = new ResizeObserver((entries) => {
      if (entries[0].target) {
        syncVariable(node, binding, vnode);
      }
    });
    ro.observe(node);
  },
  updated: function (el: HTMLElement, binding: any, vnode: any) {
    const node = binding.modifiers.parent ? (el.parentNode as HTMLElement) : el;
    syncVariable(node, binding, vnode);
  },
};

export default trunced;
