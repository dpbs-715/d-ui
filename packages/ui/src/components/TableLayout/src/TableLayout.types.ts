import { ComponentType, baseConfig, CommonFormConfig, CommonTableConfig } from '~/components';

export interface TableLayoutTypes {}

export type MixComponentType = Omit<CommonFormConfig, 'field'> & {
  component?: string | ComponentType;
  field?: string;
};
export type MixCommonTableConfig = Omit<CommonTableConfig, 'field'> & {
  component?: string | ComponentType;
  field?: string;
};
export type CommonTableLayoutConfig = Omit<baseConfig, 'component'> & {
  component?: string | ComponentType;
  search?: MixComponentType | boolean;
  table?: MixCommonTableConfig | boolean;
  form?: MixComponentType | boolean;
  [key: string]: any;
};
