import { ElTable, ElTableV2, ElAutoResizer } from 'element-plus';
import type { CommonTableConfig, CommonTableProps, DataType, RowDataType } from './Table.types';
import { SORT_ORDERS, SORTABLE, sortChange, useTableV2Sort } from './useTableSort.ts';
import { computed, ComputedRef, SlotsType } from 'vue';
import { setDefaultSlotColumnProps } from '~/_utils/componentUtils.ts';
import { RenderColumnsClass } from './renderColumns.tsx';
import { componentDefaultPropsMap } from '~/components';
const defaultColMinWidth = componentDefaultPropsMap.CommonTable.defaultColMinWidth;

export class RenderTableClass {
  props: ComputedRef<CommonTableProps>;
  slots: any;
  tableRef: any;
  data: DataType;
  constructor(props: CommonTableProps, slots: SlotsType) {
    this.props = computed(() => {
      const cleaned = Object.fromEntries(
        Object.entries(props).filter(([_, v]) => {
          return v !== undefined;
        }),
      );
      return {
        ...componentDefaultPropsMap.CommonTable,
        ...cleaned,
      } as CommonTableProps;
    });
    this.data = props.data || [];
    this.slots = slots;
  }
  getTableRef() {
    return this.tableRef;
  }
  /**
   * 渲染主入口
   * */
  render() {
    return this.getComponent();
  }
  /**
   * 获取组件
   * */
  getComponent() {
    if (this.props.value.v2) {
      return this.renderTableV2(ElTableV2);
    } else {
      return this.renderTable(ElTable);
    }
  }
  /**
   * 渲染elementPlus TableV2
   * */
  renderTableV2(Com: any) {
    const { sortState, setSortState } = useTableV2Sort(this.data);
    const renderColumns: RenderColumnsClass = new RenderColumnsClass(this.props, this.slots);

    const v2Props = {
      columns: this.props.value?.config?.map((item: CommonTableConfig, index: number) => {
        return {
          sortable: SORTABLE,
          width: defaultColMinWidth,
          dataKey: item.field,
          title: item.label,
          cellRenderer: (CellRenderProps: any) => renderColumns.renderV2(CellRenderProps, item),
          headerCellRenderer: (CellRenderProps: any) =>
            renderColumns.renderHeader(CellRenderProps, { configItem: item, index }, true),
          ...this.props.value.column,
          ...item,
        };
      }),
    };
    return (
      <ElAutoResizer>
        {{
          default: ({ height, width }: { height: number; width: number }) => {
            return (
              <Com
                class="commonTable"
                ref={(instance: any) => (this.tableRef = instance)}
                v-loading={this.props.value.loading}
                sortBy={sortState.value}
                onColumnSort={setSortState}
                height={height}
                width={width}
                {...v2Props}
                {...this.props.value}
                config={null}
              >
                {this.renderTableV2Slots()}
              </Com>
            );
          },
        }}
      </ElAutoResizer>
    );
  }
  /**
   * 渲染elementPlus Table
   * */
  renderTable(Com: any) {
    return (
      <Com
        ref={(instance: any) => (this.tableRef = instance)}
        class={['commonTable', this.props.value.singleSelection && 'commonTableSingleSelection']}
        v-loading={this.props.value.loading}
        onSortChange={(arg: any) => sortChange(arg, this.data)}
        onRowDblclick={(row: RowDataType) => this.onRowDblclick(row)}
        onSelectionChange={(selection: Record<any, any>[]) =>
          this.handleSelectionChange(selection, this.props.value)
        }
        {...this.props.value}
      >
        {this.renderTableSlots()}
      </Com>
    );
  }
  /**
   * 渲染插槽
   * */
  renderTableSlots() {
    const defaultSlot = this.slots.default?.();
    setDefaultSlotColumnProps(defaultSlot, (props: any) => {
      props.sortOrders = SORT_ORDERS;
      props.sortable = SORTABLE;
    });

    const renderColumns: RenderColumnsClass = new RenderColumnsClass(this.props, this.slots);

    //todo:设置插槽的默认值 empty等
    return {
      ...this.slots,
      default: () => {
        return [
          defaultSlot,
          renderColumns.renderSelection(),
          renderColumns.renderIndex(),
          renderColumns.render(),
        ];
      },
    };
  }
  handleSelectionChange = (selection: Record<any, any>[], props: any) => {
    if (props.singleSelection) {
      if (selection.length > 1) {
        this.tableRef.toggleRowSelection(selection[0], false);
      }
    }
  };
  onRowDblclick(row: RowDataType) {
    const selection = this.tableRef.columns.find((o: any) => o.type === 'selection');
    if (selection?.selectable) {
      if (selection?.selectable(row)) {
        this.tableRef.toggleRowSelection(row);
      }
    } else {
      this.tableRef.toggleRowSelection(row);
    }
  }
  renderTableV2Slots() {
    //todo:设置插槽的默认值 empty等
    return {
      ...this.slots,
    };
  }
}
