<script lang="tsx">
import { computed, defineComponent } from 'vue';
import type { CommonSelectProps } from './Select.types';
import { CommonSelectProviderProps } from './SelectProps.ts';
import { isString } from 'dlib-utils';
import { RenderSelectClass } from './RenderSelectClass.tsx';

export default defineComponent<CommonSelectProps>({
  name: 'CommonSelect',
  props: CommonSelectProviderProps,
  emits: ['update:modelValue', 'update:label', 'changeObj', 'optionsReady'],
  setup(props, { slots, expose, emit }) {
    const model = computed({
      get() {
        if (props.joinSplit && props.multiple) {
          if (isString(props.modelValue)) {
            return props.modelValue
              ?.split(props.joinSplit)
              .filter((item: any) => item.trim() !== '');
          } else {
            return props.modelValue;
          }
        } else {
          return props.modelValue;
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
          if (isString(props.label)) {
            return props.label?.split(props.joinSplit);
          } else {
            return props.label;
          }
        } else {
          return props.label;
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
    const renderSelect: RenderSelectClass = new RenderSelectClass(props, slots, emit, {
      model,
      label,
    });

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
