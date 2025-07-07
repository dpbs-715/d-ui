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
  disabled?: boolean;
  round?: boolean;
  plain?: boolean;
  icon?: any;
}

export interface ButtonEmits {
  (e: 'click', event: MouseEvent): void;
}
