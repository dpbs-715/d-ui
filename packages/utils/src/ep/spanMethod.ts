/**
 * ElementPlus Table span-method 配置接口
 */
export interface SpanMethodConfig {
  /** 需要合并的列的 prop 名称数组，按优先级排序 */
  mergeColumns: string[];
  /** 数据数组 */
  data: any[];
  /** 是否启用缓存（默认 true） */
  cache?: boolean;
}

/**
 * ElementPlus Table span-method 参数接口
 */
export interface SpanMethodProps {
  row: any;
  column: any;
  rowIndex: number;
  columnIndex: number;
}

/**
 * 单元格合并信息缓存
 */
interface SpanCache {
  [key: string]: { rowspan: number; colspan: number };
}

/**
 * 创建通用的 ElementPlus Table span-method
 *
 * @description 支持多列按优先级合并相同值的单元格
 *
 * @example
 * ```ts
 * const tableData = [
 *   { province: '浙江', city: '杭州', area: '西湖区' },
 *   { province: '浙江', city: '杭州', area: '滨江区' },
 *   { province: '浙江', city: '宁波', area: '鄞州区' },
 * ];
 *
 * const spanMethod = createSpanMethod({
 *   mergeColumns: ['province', 'city'],
 *   data: tableData
 * });
 * ```
 *
 * @param config - 合并配置
 * @returns span-method 函数
 */
export function createSpanMethod(config: SpanMethodConfig) {
  const { mergeColumns, data, cache = true } = config;

  if (!mergeColumns.length || !data.length) {
    return () => ({ rowspan: 1, colspan: 1 });
  }

  let spanCache: SpanCache | null = null;

  /**
   * 计算合并信息
   */
  function calculateSpans(): SpanCache {
    const spans: SpanCache = {};
    const mergeInfo: Map<string, { start: number; count: number }[]> = new Map();

    // 为每个需要合并的列初始化合并信息
    mergeColumns.forEach((col) => mergeInfo.set(col, []));

    // 遍历数据计算合并区域
    for (let i = 0; i < data.length; i++) {
      mergeColumns.forEach((col, colIndex) => {
        const currentValue = data[i][col];
        const colMergeInfo = mergeInfo.get(col)!;

        // 检查是否可以与上一个合并区域合并
        let canMerge = false;

        if (i > 0) {
          const prevValue = data[i - 1][col];
          canMerge = currentValue === prevValue;

          // 如果是非第一列，还需要检查前面的列是否在同一个合并区域内
          if (canMerge && colIndex > 0) {
            for (let prevColIndex = 0; prevColIndex < colIndex; prevColIndex++) {
              const prevCol = mergeColumns[prevColIndex];
              const prevColMergeInfo = mergeInfo.get(prevCol)!;
              const currentMergeArea = prevColMergeInfo.find(
                (area) => i >= area.start && i < area.start + area.count,
              );
              const prevMergeArea = prevColMergeInfo.find(
                (area) => i - 1 >= area.start && i - 1 < area.start + area.count,
              );

              if (currentMergeArea !== prevMergeArea) {
                canMerge = false;
                break;
              }
            }
          }
        }

        if (canMerge && colMergeInfo.length > 0) {
          // 扩展现有合并区域
          colMergeInfo[colMergeInfo.length - 1].count++;
        } else {
          // 创建新的合并区域
          colMergeInfo.push({ start: i, count: 1 });
        }
      });
    }

    // 根据合并信息生成缓存
    mergeColumns.forEach((col) => {
      const colMergeInfo = mergeInfo.get(col)!;

      colMergeInfo.forEach((area) => {
        for (let i = 0; i < area.count; i++) {
          const rowIndex = area.start + i;
          const key = `${rowIndex}-${col}`;

          if (i === 0) {
            // 合并区域的第一行
            spans[key] = { rowspan: area.count, colspan: 1 };
          } else {
            // 合并区域的其他行
            spans[key] = { rowspan: 0, colspan: 0 };
          }
        }
      });
    });

    return spans;
  }

  /**
   * span-method 函数
   */
  return function spanMethod({ column, rowIndex }: SpanMethodProps) {
    const columnProp = column.property;

    // 如果该列不需要合并，返回默认值
    if (!mergeColumns.includes(columnProp)) {
      return { rowspan: 1, colspan: 1 };
    }

    // 使用缓存或计算合并信息
    if (cache) {
      if (!spanCache) {
        spanCache = calculateSpans();
      }
    } else {
      spanCache = calculateSpans();
    }

    const key = `${rowIndex}-${columnProp}`;
    return spanCache[key] || { rowspan: 1, colspan: 1 };
  };
}

/**
 * 简单的单列合并（性能更优）
 *
 * @example
 * ```ts
 * const spanMethod = createSimpleSpanMethod({
 *   mergeColumn: 'category',
 *   data: tableData
 * });
 * ```
 */
export function createSimpleSpanMethod(config: {
  mergeColumn: string;
  data: any[];
  cache?: boolean;
}) {
  return createSpanMethod({
    mergeColumns: [config.mergeColumn],
    data: config.data,
    cache: config.cache,
  });
}
