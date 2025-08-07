interface WrappedFunction extends Function {
  __D__?: boolean;
  __DT__?: string;
  (...args: any[]): Promise<any>;
}

export interface CommonSelectProps {
  //请求api
  api?: WrappedFunction;
  //字典名称
  dict?: string | string[];
  //请求参数
  query: Function;
  //值字段对照
  valueField: string;
  //文本字段对照
  labelField: string;
  //转化请求结果
  parseData?: Function;
  //只有一条数据时自动选中
  autoSelectFirst?: boolean;
  //是否多选
  multiple?: boolean;
  //是否需要所有查询参数
  needAllQueryParams?: boolean;
  //追加选项
  appendOptions?: Record<any, any>[] | Function;
  //值类型
  valueType?: 'string' | 'String' | 'int' | 'Int';
  //绑定选项
  bindOptions?: Record<any, any>[];
  //忽略的标签
  ignoreByLabel: string[];
  //组件类型
  componentType?: 'ElSelectV2' | 'ElSelect' | 'ElTreeSelect';
  //多选时将结果合并的拼接符
  joinSplit?: string;
  //排序字段
  orderBy?: string;
  //排序方式
  orderType?: 'asc' | 'desc';

  //字典获取options
  getDictOptions?: Function;

  modelValue?: string | number | Array<string | number>;
  label?: string | number | Array<string | number>;
  onChange?: Function | Array<Function>;
}
