import { CommonFormBaseProps, CommonFormConfig } from '~/components';
import { Ref } from 'vue';

export interface CommonSearchProps extends CommonFormBaseProps {
  config?: CommonFormConfig[];
  col?: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  //会把默认值也清空
  resetAll?: boolean;
  //重置时不查询
  resetWithoutSearch?: boolean;
  //加载
  loading?: Boolean | Ref<Boolean>;
}

export interface CommonSearchEmits {
  //重置的回调
  (e: 'reset'): void;
  (e: 'search'): void;
}
