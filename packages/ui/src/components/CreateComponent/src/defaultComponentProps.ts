export default {
  input: {
    placeholder: '请输入{label}',
  },
  inputNumber: {
    placeholder: '请输入{label}',
  },
  select: {
    placeholder: '请选择{label}',
  },
  commonSelect: {
    placeholder: '请选择{label}',
  },
  datePicker: {
    placeholder: '请选择{label}',
  },
  treeSelect: {
    placeholder: '请选择{label}',
  },
  //表单配置
  CommonForm: {
    labelWidth: 'auto',
    col: {
      sm: 24,
      md: 12,
      lg: 8,
      xl: 6,
    },
  },
  //查询配置
  CommonSearch: {
    col: {
      sm: 24,
      md: 12,
      lg: 6,
      xl: 6,
    },
    actionCol: 4,
  },
  //表格配置
  CommonTable: {
    emptyText: '暂无数据',
    ignoreHeight: 332,
    sortOrders: ['ascending', 'descending'],
    sortable: false,
    showOverflowTooltip: true,
    border: true,
    stripe: true,
    defaultColMinWidth: 150,
    column: {
      align: 'center',
      headerAlign: 'center',
    },
  },
};
