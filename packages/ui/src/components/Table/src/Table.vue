<script lang="tsx">
import { defineComponent, ref, h, nextTick } from 'vue';
import { CommonTableProviderProps } from './TableProps.ts';
import type { CommonTableProps } from './Table.types';
import { ElForm } from 'element-plus';
import { RenderTableClass } from './renderTable.tsx';

export default defineComponent<CommonTableProps>({
  name: 'CommonTable',
  inheritAttrs: false,
  props: CommonTableProviderProps,
  emits: ['dragEnd', 'selectionChange'],
  setup(props, { slots, expose, attrs, emit }) {
    const formRef: any = ref(null);
    // const tableRef: any = ref(null);
    const renderTable: RenderTableClass = new RenderTableClass(props, attrs, slots, emit);
    //使用校验方法 并定位到错误位置
    function validateForm(fieldArr: string[]) {
      return new Promise((resolve: any, reject: any) => {
        // 调用表单组件的validateField方法，对所有表单字段进行验证
        if (formRef.value) {
          formRef.value
            .validateField(fieldArr)
            .then(() => {
              resolve();
            })
            .catch((error: any) => {
              moveToErr();
              reject(error);
            });
        } else {
          resolve();
        }
      });
    }
    //定位错误
    function moveToErr() {
      nextTick(() => {
        let isError = document.getElementsByClassName('is-error');
        if (isError.length) {
          isError[0].scrollIntoView({
            block: 'center',
            behavior: 'smooth',
            inline: 'center',
          });
        }
      });
    }

    expose(
      new Proxy(
        {
          validateForm,
        },
        {
          get(target: any, key: string) {
            //首先寻找组件提供的方法
            if (key in target) {
              return target[key];
            }
            const tableRef = renderTable.getTableRef();
            //如果组件没有提供方法，则寻找table提供的方法
            if (tableRef && key in (tableRef || {})) {
              return tableRef?.[key];
            }
            //寻找form提供的方法
            if (key in (formRef.value || {})) {
              return formRef.value?.[key];
            }
            return null;
          },
          has(target, key) {
            const tableRef = renderTable.getTableRef();

            //判断是否存在
            return key in target || key in (tableRef || {}) || key in (formRef.value || {});
          },
        },
      ),
    );
    return () =>
      h(
        ElForm,
        {
          showMessage: !props.v2,
          ref: formRef,
          model: props.data,
          style: {
            width: '100%',
          },
        },
        {
          default: () => [renderTable.render()],
        },
      );
  },
});
</script>
<style lang="scss" scoped>
@use './index.scss' as *;
</style>
