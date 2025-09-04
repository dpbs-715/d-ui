<script lang="tsx">
import { computed, defineComponent } from 'vue';
import type { CommonDescriptionsProps } from './Descriptions.types';
import { CommonDescriptionsProviderProps } from './DescriptionsProps.ts';
import { RenderDescriptions } from '~/components/Descriptions/src/RenderDescriptions.tsx';

export default defineComponent<CommonDescriptionsProps>({
  name: 'CommonDescriptions',
  inheritAttrs: false,
  props: CommonDescriptionsProviderProps,
  emits: ['update:modelValue'],
  setup(props, { slots, attrs, emit }) {
    const model = computed({
      get() {
        return attrs.modelValue;
      },
      set(value) {
        emit('update:modelValue', value);
      },
    });
    const renderDescriptions = new RenderDescriptions(props, slots, attrs, model);

    return () => renderDescriptions.render();
  },
});
</script>
<style lang="scss" scoped></style>
