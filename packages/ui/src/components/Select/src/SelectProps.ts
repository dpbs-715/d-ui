import type { PropType } from 'vue';

export const CommonSelectProviderProps = {
  //请求api
  api: {
    type: Function,
  },
  //字典名称
  dict: {
    type: [String, Array<string>],
  },
  //请求参数
  query: {
    type: Function,
    default: () => ({}),
  },
  //值字段对照
  valueField: {
    type: String,
    default: 'value',
  },
  //文本字段对照
  labelField: {
    type: String,
    default: 'label',
  },
  //转化请求结果
  parseData: {
    type: Function,
  },
  //只有一条数据时自动选中
  autoSelectFirst: {
    type: Boolean,
    default: false,
  },
  //是否多选
  multiple: {
    type: Boolean,
    default: false,
  },
  //是否需要所有查询参数
  needAllQueryParams: {
    type: Boolean,
    default: false,
  },
  //追加选项
  appendOptions: {
    type: [Array<Record<any, any>>, Function],
  },
  //值类型
  valueType: {
    type: String as PropType<'string' | 'String' | 'int' | 'Int'>,
  },
  //绑定选项
  bindOptions: {
    type: Array<Record<any, any>>,
    default: () => [],
  },
  //忽略的标签
  ignoreByLabel: {
    type: Array<string>,
    default: () => [],
  },
  //组件类型
  componentType: {
    type: String as PropType<'ElSelectV2' | 'ElSelect' | 'ElTreeSelect'>,
  },
  //多选时将结果合并的拼接符
  joinSplit: {
    type: String,
  },
  //排序字段
  orderBy: {
    type: String,
  },
  //排序方式
  orderType: {
    type: String as PropType<'asc' | 'desc'>,
    default: 'asc',
  },
  //字典获取options
  getDictOptions: {
    type: Function,
    default: () => [],
  },
};
