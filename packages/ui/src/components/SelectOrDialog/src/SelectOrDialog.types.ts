import { DataHandlerType } from '~/_utils/dataHandlerClass.ts';
import { CommonTableLayoutConfig } from '../../TableLayout';
import { DialogProps } from '../../Dialog';

export interface SelectOrDialogProps extends DataHandlerType {
  //只有一条数据时自动选中
  autoSelectFirst?: boolean;
  //是否多选
  multiple?: boolean;
  //组件类型
  componentType?: 'ElSelectV2' | 'ElSelect' | 'ElTreeSelect';
  onChange?: Function;
  onChangeObj?: Function;

  dialogProps?: DialogProps;

  dialogFieldsConfig?: CommonTableLayoutConfig[];

  beforeConfirm?: (selections: any[], labelSelections: any[]) => Promise<any>;

  disabled?: boolean | undefined;
}
