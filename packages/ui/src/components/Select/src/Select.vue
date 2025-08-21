<script lang="tsx">
import { computed, defineComponent } from 'vue';
import type { CommonSelectProps, CommonSelectRealProps } from './Select.types';
import { CommonSelectProviderProps } from './SelectProps.ts';
import { isString } from 'dlib-utils';
import { RenderSelectClass } from './RenderSelectClass.tsx';

export default defineComponent<CommonSelectProps>({
  name: 'CommonSelect',
  props: CommonSelectProviderProps,
  emits: ['update:modelValue', 'update:label', 'changeObj', 'optionsReady'],
  setup(props, { slots, expose, emit, attrs }) {
    const model = computed({
      get() {
        if (props.joinSplit && props.multiple) {
          if (isString(attrs.modelValue)) {
            return attrs.modelValue
              ?.split(props.joinSplit)
              .filter((item: any) => item.trim() !== '');
          } else {
            return attrs.modelValue;
          }
        } else {
          return attrs.modelValue;
        }
      },
      set(value: any) {
        if (props.joinSplit && props.multiple) {
          emit('update:modelValue', value?.join(props.joinSplit));
        } else {
          emit('update:modelValue', value);
        }
      },
    });

    const label = computed({
      get() {
        if (props.joinSplit && props.multiple) {
          if (isString(attrs.label)) {
            return attrs.label?.split(props.joinSplit);
          } else {
            return attrs.label;
          }
        } else {
          return attrs.label;
        }
      },
      set(value: any) {
        if (props.joinSplit && props.multiple) {
          emit('update:label', value?.join(props.joinSplit));
        } else {
          emit('update:label', value);
        }
      },
    });

    const renderSelect: RenderSelectClass = new RenderSelectClass(
      props as CommonSelectRealProps,
      slots,
      emit,
      attrs,
      {
        model,
        label,
      },
    );

    expose(
      new Proxy(
        {},
        {
          get(target: any, key: string) {
            //首先寻找组件提供的方法
            if (key in target) {
              return target[key];
            }
            const selectRef = renderSelect.getRef();
            //如果组件没有提供方法，则寻找table提供的方法
            if (selectRef && key in (selectRef || {})) {
              return selectRef?.[key];
            }
            return null;
          },
          has(target, key) {
            const selectRef = renderSelect.getRef();
            //判断是否存在
            return key in target || key in (selectRef || {});
          },
        },
      ),
    );
    return () => renderSelect.render();
  },
});
</script>
<style lang="scss" scoped>
@use './index.scss' as *;
</style>
