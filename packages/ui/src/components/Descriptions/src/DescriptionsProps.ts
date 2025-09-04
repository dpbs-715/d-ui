import type { PropType } from 'vue';
import { DescriptionsConfig } from './Descriptions.types.ts';

export const CommonDescriptionsProviderProps = {
  border: {
    type: Boolean,
  },
  column: {
    type: Number,
  },
  direction: {
    type: String as PropType<'vertical' | 'horizontal'>,
  },
  size: {
    type: String as PropType<'large' | 'default' | 'small '>,
  },
  title: {
    type: String,
  },
  extra: {
    type: String,
  },
  config: {
    type: Array as PropType<Array<DescriptionsConfig>>,
  },
};
