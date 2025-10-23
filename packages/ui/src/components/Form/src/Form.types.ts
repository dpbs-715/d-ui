import { baseConfig, ComponentFunctionType, ComponentType } from '~/components';
import { Arrayable } from 'element-plus/es/utils';
import { FormItemRule, FormRules } from 'element-plus';
import { Ref, ComputedRef } from 'vue';

type hiddenFunType = (params: Record<string, any>) => boolean;
type rulesFunType = (params: Record<string, any>) => Arrayable<FormItemRule>;

export type CommonFormConfig = Omit<baseConfig, 'component'> & {
  readField?: string;
  component?: string | ComponentFunctionType | ComponentType;
  span?: number;
  hidden?: boolean | hiddenFunType | Ref | ComputedRef;
  isDisabled?: Function;
  labelField?: string;
  formItemProps?: {
    labelWidth?: string;
    [key: string]: any;
  };
  rules?: Arrayable<FormItemRule> | rulesFunType;
  [key: string]: any;
};

export interface CommonFormBaseProps {
  rules?: FormRules;
  inline?: Boolean;
  inlineMessage?: Boolean;
  labelPosition?: '' | 'left' | 'right' | 'top';
  labelWidth?: string | null;
  labelSuffix?: string;
  size?: '' | 'large' | 'default' | 'small';
  requireAsteriskPosition?: Boolean;
  statusIcon?: Boolean;
  showMessage?: Boolean;
  validateOnRuleChange?: Boolean;
  hideRequiredAsterisk?: Boolean;
  loading?: Boolean;
}

export interface CommonFormProps extends CommonFormBaseProps {
  config?: CommonFormConfig[];
  readonly?: Boolean;
  col?: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}
