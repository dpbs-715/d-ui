export type ButtonType =
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'link'
  | 'create'
  | 'export'
  | 'import'
  | 'delete'
  | 'normal';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  type?: ButtonType;
  size?: ButtonSize;
  disabled?: boolean | undefined;
  round?: boolean;
  plain?: boolean;
  icon?: any;
  circle?: boolean;
  loading?: boolean | undefined;
  onClick?: (event: MouseEvent) => PromiseLike<void> | void;
}
