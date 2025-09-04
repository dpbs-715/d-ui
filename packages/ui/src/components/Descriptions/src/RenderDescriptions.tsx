import { computed, ComputedRef, toValue } from 'vue';
import { componentDefaultPropsMap, CreateComponent } from '~/components';
import { ElDescriptions, ElDescriptionsItem } from 'element-plus';
import { CommonDescriptionsProps, DescriptionsConfig } from './Descriptions.types';

export class RenderDescriptions {
  props: ComputedRef<CommonDescriptionsProps>;
  slots: any;
  constructor(props, slots, attrs) {
    this.slots = slots;
    this.props = computed(() => {
      const cleaned = Object.fromEntries(
        Object.entries(props).filter(([_, v]) => {
          return v !== undefined;
        }),
      );
      delete cleaned.config;
      return {
        ...componentDefaultPropsMap.CommonDescriptions,
        ...attrs,
        ...cleaned,
      };
    });
  }

  renderItem(item: DescriptionsConfig) {
    if (item.component) {
      return (
        <ElDescriptionsItem {...item}>
          <CreateComponent config={item}></CreateComponent>
        </ElDescriptionsItem>
      );
    } else {
      return <ElDescriptionsItem {...item}></ElDescriptionsItem>;
    }
  }
  renderSlots(config: DescriptionsConfig[]) {
    if (config && config.length > 0) {
      return config.map((item) => {
        return <ElDescriptionsItem {...item}>{this.renderItem(item)}</ElDescriptionsItem>;
      });
    } else {
      return {
        ...this.slots,
      };
    }
  }

  render() {
    const { ...props, config } = toValue(this.props);
    return <ElDescriptions {...props}>{this.renderSlots(config)}</ElDescriptions>;
  }
}
