import { baseConfig } from '~/components';

export type DescriptionsConfig = Omit<baseConfig, 'component'> & {
  component?: any;
  formatter?: Function;
  //标签文本
  label?: string;
  //列数
  span?: number;
  //列宽
  width?: string | number;
  //最小列宽
  minWidth?: string | number;
  //列内容的对齐方式
  align?: 'left' | 'center' | 'right';
  //标签的文本对齐方式
  labelAlign?: 'left' | 'center' | 'right';
  //列的内容自定义类名
  className?: string;
  //标签的类名
  labelClassName?: string;
};

export interface CommonDescriptionsProps {
  border?: Boolean;
  column?: number;
  direction?: string;
  size?: string;
  title?: string;
  extra?: string;
  config?: DescriptionsConfig[];
}
