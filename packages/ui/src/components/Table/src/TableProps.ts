import type { PropType } from 'vue';
import { CommonTableConfig, DataType } from './Table.types';

export const CommonTableProviderProps = {
  config: {
    type: Array as PropType<CommonTableConfig[]>,
    default: () => [],
  },
  v2: {
    type: Boolean,
    default: undefined,
  },
  useIndex: {
    type: Boolean,
    default: false,
  },
  useSelection: {
    type: Boolean,
    default: false,
  },
  singleSelection: {
    type: Boolean,
    default: false,
  },
  emptyText: {
    type: String,
    default: '',
  },
  data: {
    type: Array as PropType<DataType>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: () => false,
  },

  rowKey: {
    type: [String, Function, Number, Symbol] as PropType<string | Function | symbol | number>,
  },
  size: {
    type: String,
  },
  height: {
    type: [Number, String],
  },
  width: {
    type: [Number, String],
  },
  maxHeight: {
    type: [Number, String],
  },
  stripe: {
    type: Boolean,
    default: undefined,
  },
  border: {
    type: Boolean,
    default: undefined,
  },
  fit: {
    type: Boolean,
    default: undefined,
  },
  showHeader: {
    type: Boolean,
    default: undefined,
  },
  highlightCurrentRow: {
    type: Boolean,
    default: undefined,
  },
  currentRowKey: {
    type: [String, Number],
  },
  rowClassName: {
    type: [String, Function] as PropType<string | Function>,
  },
  rowStyle: {
    type: [Object, Function] as PropType<object | Function>,
  },
  cellClassName: {
    type: [String, Function] as PropType<string | Function>,
  },
  cellStyle: {
    type: [Object, Function] as PropType<object | Function>,
  },
  headerRowClassName: {
    type: [String, Function] as PropType<string | Function>,
  },
  headerRowStyle: {
    type: [Object, Function] as PropType<object | Function>,
  },
  headerCellClassName: {
    type: [String, Function] as PropType<string | Function>,
  },
  headerCellStyle: {
    type: [Object, Function] as PropType<object | Function>,
  },
  defaultExpandAll: {
    type: Boolean,
    default: undefined,
  },
  expandRowKeys: {
    type: Array as PropType<Array<string | number>>,
  },
  tooltipEffect: {
    type: String as PropType<'dark' | 'light'>,
  },
  tooltipOption: {
    type: Object,
  },
  showSummary: {
    type: Boolean,
    default: undefined,
  },
  sumText: {
    type: String,
  },
  summaryMethod: {
    type: Function,
  },
  spanMethod: {
    type: Function,
  },
  selectOnIndeterminate: {
    type: Boolean,
    default: undefined,
  },
  indent: {
    type: Number,
  },
  lazy: {
    type: Boolean,
    default: undefined,
  },
  load: {
    type: Function,
  },
  treeProps: {
    type: Object,
  },
  tableLayout: {
    type: String,
  },
  scrollbarAlwaysOn: {
    type: Boolean,
    default: undefined,
  },
  showOverflowTooltip: {
    type: Boolean,
    default: undefined,
  },
  flexible: {
    type: Boolean,
    default: undefined,
  },
  defaultColMinWidth: {
    type: Number,
  },
  column: {
    type: Object,
  },
  cache: {
    type: Number,
  },
  estimatedRowHeight: {
    type: Number,
  },
  headerClass: {
    type: [String, Function] as PropType<string | Function>,
  },
  headerProps: {
    type: [Object, Function] as PropType<object | Function>,
  },
  headerCellProps: {
    type: [Object, Function] as PropType<object | Function>,
  },
  headerHeight: {
    type: [Number, Array] as PropType<number | number[]>,
  },
  footerHeight: {
    type: Number,
  },
  rowClass: {
    type: [String, Function] as PropType<string | Function>,
  },
  rowProps: {
    type: [Object, Function] as PropType<object | Function>,
  },
  rowHeight: {
    type: Number,
  },
  cellProps: {
    type: [Object, Function] as PropType<object | Function>,
  },
  columns: {
    type: Array,
  },
  dataGetter: {
    type: Function,
  },
  fixedData: {
    type: Array as PropType<any[]>,
  },
  expandedRowKeys: {
    type: Array as PropType<Array<string | number>>,
  },
  defaultExpandedRowKeys: {
    type: Array as PropType<Array<string | number>>,
  },
  class: {
    type: [String, Array, Object] as PropType<string | any[] | Record<string, any>>,
  },
  fixed: {
    type: Boolean,
    default: undefined,
  },
  hScrollbarSize: {
    type: Number,
  },
  vScrollbarSize: {
    type: Number,
  },
  sortBy: {
    type: Object,
  },
  sortState: {
    type: Object,
  },
};
