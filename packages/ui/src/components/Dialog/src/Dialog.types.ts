export interface DialogProps {
  title?: string;
}

export interface DialogEmits {
  (e: 'close'): void;
  (e: 'confirm', close: () => void): void;
}
