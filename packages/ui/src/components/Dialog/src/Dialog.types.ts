export interface DialogProps {
  title?: string;
  width?: string | number;
  fullscreen?: boolean;
  top?: string;
  modalClass?: string;
  appendToBody?: boolean;
  draggable?: boolean;
  destroyOnClose?: boolean;
  center?: boolean;
  alignCenter?: boolean;
}

export interface DialogEmits {
  (e: 'close'): void;
  (e: 'confirm', close: () => void): void;
}
