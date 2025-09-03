export interface DialogProps {
  title?: string;
  width?: string | number;
  fullscreen?: Boolean;
  top?: string;
  modalClass?: string;
  appendToBody?: Boolean;
  draggable?: Boolean;
  destroyOnClose?: Boolean;
  center?: Boolean;
  alignCenter?: Boolean;
}

export interface DialogEmits {
  (e: 'close'): void;
  (e: 'confirm', close: () => void): void;
}
