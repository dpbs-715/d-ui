import { DataHandlerType } from '~/_utils/dataHandlerClass.ts';

export interface CommonSelectProps extends DataHandlerType {
  //只有一条数据时自动选中
  autoSelectFirst?: boolean;
  //是否多选
  multiple?: boolean;
  //组件类型
  componentType?: 'ElSelectV2' | 'ElSelect' | 'ElTreeSelect';
  onChange?: Function | Array<Function>;
  modelValue?: any;
  label?: any;
}
