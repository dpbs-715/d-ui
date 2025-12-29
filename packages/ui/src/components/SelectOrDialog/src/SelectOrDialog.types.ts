import { DataHandlerType } from '~/_utils/dataHandlerClass.ts';
import { CommonTableLayoutConfig } from '../../TableLayout';
import { DialogProps } from '../../Dialog';
import { CommonTableProps } from '../../Table';

export interface SelectOrDialogProps extends DataHandlerType {
  //只有一条数据时自动选中
  autoSelectFirst?: boolean;
  //是否多选
  multiple?: boolean;
  //组件类型
  componentType?: 'ElSelectV2' | 'ElSelect' | 'ElTreeSelect';

  dialogProps?: DialogProps;
  tableProps?: CommonTableProps;

  dialogFieldsConfig?: CommonTableLayoutConfig[];

  beforeConfirm?: (selections: any[], labelSelections: any[]) => Promise<any>;

  beforeOpen?: () => Promise<any>;

  disabled?: boolean | undefined;
}

export interface SelectOrDialogEmits {
  (e: 'change', selections: any[], labelSelections: any[]): void;
  (e: 'changeObj', selectionRows: any[]): void;

  (e: 'removeRow', row: Record<any, any>, tableData: any[]): void;
  (e: 'addRow', row: Record<any, any>, tableData: any[]): void;
  (e: 'removePageRows', tableData: any[]): void;
  (e: 'addPageRows', tableData: any[]): void;
}
