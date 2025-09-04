<script lang="tsx">
import { defineComponent } from 'vue';
import type { CommonDescriptionsProps } from './Descriptions.types';
import { CommonDescriptionsProviderProps } from './DescriptionsProps.ts';
import { RenderDescriptions } from '~/components/Descriptions/src/RenderDescriptions.tsx';

export default defineComponent<CommonDescriptionsProps>({
  name: 'CommonDescriptions',
  inheritAttrs: false,
  props: CommonDescriptionsProviderProps,
  setup(props, { slots, attrs }) {
    const renderDescriptions = new RenderDescriptions(props, slots, attrs);
    return () => renderDescriptions.render();
  },
});
</script>
<style lang="scss" scoped></style>
