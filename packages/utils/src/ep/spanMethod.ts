import { MaybeRef, toValue } from 'vue';

/**
 * ElementPlus Table span-method 配置接口
 */
export interface SpanMethodConfig {
  /** 需要合并的列的 prop 名称数组，按优先级排序 */
  mergeColumns: string[];
  /** 数据数组 */
  data: MaybeRef<any[]>;
  /** 是否启用缓存（默认 true） */
  cache?: boolean;
  /**
   * 缓存键（可选）
   * - 提供时：数据变化时更新此值即可精确控制缓存失效（性能最优）
   * - 不提供时：自动检测合并列数据变化（智能模式）
   * @example
   * ```ts
   * const version = ref(0)
   * const spanMethod = createSpanMethod({
   *   mergeColumns: ['province'],
   *   data: tableData,
   *   cacheKey: version  // 数据变化时 version.value++
   * })
   * ```
   */
  cacheKey?: MaybeRef<string | number>;
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
  const { mergeColumns, cache = true } = config;

  let spanCache: SpanCache | null = null;
  let lastCacheKey: string | number | undefined = undefined;
  let cachedFingerprint = '';

  // 渲染周期内的临时指纹缓存（避免重复计算）
  let tempFingerprint = '';
  let tempFingerprintValid = false;

  /**
   * 计算合并列数据的指纹
   * 仅计算需要合并的列，减少计算量
   */
  function calculateFingerprint(data: any[]): string {
    return data.map((row) => mergeColumns.map((col) => String(row[col] ?? '')).join('|')).join(',');
  }

  /**
   * 计算合并信息
   */
  function calculateSpans(data: any[]): SpanCache {
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
    // 每次调用时获取最新数据
    const data = toValue(config.data);

    // 如果没有合并列或数据为空，返回默认值
    if (!mergeColumns.length || !data.length) {
      return { rowspan: 1, colspan: 1 };
    }

    const columnProp = column.property;

    // 如果该列不需要合并，返回默认值
    if (!mergeColumns.includes(columnProp)) {
      return { rowspan: 1, colspan: 1 };
    }

    // 检测数据是否变化，决定是否失效缓存
    if (cache) {
      // 策略1：优先使用用户提供的 cacheKey（性能最优）
      if (config.cacheKey !== undefined) {
        const currentCacheKey = toValue(config.cacheKey);
        if (currentCacheKey !== lastCacheKey) {
          spanCache = null;
          lastCacheKey = currentCacheKey;
          // 重置指纹缓存
          cachedFingerprint = '';
          tempFingerprintValid = false;
        }
      }
      // 策略2：自动检测合并列数据变化（智能模式）
      else {
        // 同一渲染周期内复用指纹计算结果（避免重复计算）
        if (!tempFingerprintValid) {
          tempFingerprint = calculateFingerprint(data);
          tempFingerprintValid = true;

          // 使用微任务清除临时缓存，确保下一次渲染重新计算
          queueMicrotask(() => {
            tempFingerprintValid = false;
          });
        }

        // 比较指纹，数据变化时失效缓存
        if (tempFingerprint !== cachedFingerprint) {
          spanCache = null;
          cachedFingerprint = tempFingerprint;
        }
      }
    }

    // 使用缓存或重新计算合并信息
    if (cache) {
      if (!spanCache) {
        spanCache = calculateSpans(data);
      }
    } else {
      spanCache = calculateSpans(data);
    }

    const key = `${rowIndex}-${columnProp}`;
    return spanCache[key] || { rowspan: 1, colspan: 1 };
  };
}

/**
 * 合并组配置
 */
export type MergeGroup = string[]; // 列名数组：['a', 'b', 'c']

/**
 * 列合并配置接口
 */
export interface ColSpanMethodConfig {
  /** 需要合并的行（索引数组 或 判断函数） */
  rows: boolean | number[] | ((rowIndex: number, row: any) => boolean);

  /**
   * 合并分组配置
   * 支持：
   * 1. 静态配置数组
   * 2. 函数动态返回（根据行数据决定合并规则）
   */
  mergeGroups: MergeGroup[] | ((rowIndex: number, row: any) => MergeGroup[]);

  /** 数据数组（用于条件判断时获取 row 数据） */
  data?: MaybeRef<any[]>;

  /** 是否启用缓存（默认 true） */
  cache?: boolean;

  /** 缓存键 */
  cacheKey?: MaybeRef<string | number>;
}

/**
 * 列合并信息缓存
 */
interface ColSpanCache {
  [rowIndex: number]: {
    [columnProp: string]: { rowspan: number; colspan: number };
  };
}

/**
 * 创建列合并的 span-method
 *
 * @description 支持同一行内多组独立的列合并
 *
 * @example
 * ```ts
 * // 简单用法：第一行合并两组列
 * const spanMethod = createColSpanMethod({
 *   rows: [0],
 *   mergeGroups: [
 *     ['q1', 'q2'],      // 第一组
 *     ['q3', 'q4']       // 第二组
 *   ]
 * })
 *
 * // 条件判断：小计行合并列
 * const spanMethod = createColSpanMethod({
 *   rows: (rowIndex, row) => row.type === '小计',
 *   mergeGroups: [
 *     ['a', 'b'],           // AB组
 *     ['c', 'd', 'e']       // CDE组
 *   ]
 * })
 *
 * // 动态配置：根据行数据决定合并规则
 * const spanMethod = createColSpanMethod({
 *   rows: [0, 5, 10],
 *   mergeGroups: (rowIndex, row) => {
 *     if (rowIndex === 0) return [['a', 'b'], ['c', 'd']]
 *     if (rowIndex === 5) return [['a', 'b', 'c']]
 *     return [['d', 'e']]
 *   }
 * })
 * ```
 *
 * @param config - 列合并配置
 * @returns span-method 函数
 */
export function createColSpanMethod(config: ColSpanMethodConfig) {
  const { rows, mergeGroups, cache = true } = config;

  let colSpanCache: ColSpanCache | null = null;
  let lastCacheKey: string | number | undefined = undefined;

  /**
   * 检查指定行是否需要合并
   */
  function shouldMergeRow(rowIndex: number, row: any): boolean {
    if (typeof rows === 'boolean') {
      return rows;
    } else if (Array.isArray(rows)) {
      return rows.includes(rowIndex);
    }
    return rows(rowIndex, row);
  }

  /**
   * 获取指定行的合并组配置
   */
  function getMergeGroups(rowIndex: number, row: any): MergeGroup[] {
    if (typeof mergeGroups === 'function') {
      return mergeGroups(rowIndex, row);
    }
    return mergeGroups;
  }

  /**
   * 计算列合并信息
   */
  function calculateColSpans(data: any[]): ColSpanCache {
    const spans: ColSpanCache = {};

    data.forEach((row, rowIndex) => {
      // 检查该行是否需要合并
      if (!shouldMergeRow(rowIndex, row)) {
        return;
      }

      // 获取该行的合并组配置
      const groups = getMergeGroups(rowIndex, row);

      // 初始化该行的缓存
      spans[rowIndex] = {};

      groups.forEach((columns) => {
        // 至少需要2列才合并
        if (columns.length < 2) {
          return;
        }

        // 第一列：设置 colspan
        const firstCol = columns[0];
        spans[rowIndex][firstCol] = {
          rowspan: 1,
          colspan: columns.length,
        };

        // 其他列：设置为 0（隐藏）
        for (let i = 1; i < columns.length; i++) {
          spans[rowIndex][columns[i]] = {
            rowspan: 0,
            colspan: 0,
          };
        }
      });
    });

    return spans;
  }

  /**
   * span-method 函数
   */
  return function spanMethod({ row, column, rowIndex }: SpanMethodProps) {
    const columnProp = column.property;

    // 检测缓存失效
    if (cache && config.cacheKey !== undefined) {
      const currentCacheKey = toValue(config.cacheKey);
      if (currentCacheKey !== lastCacheKey) {
        colSpanCache = null;
        lastCacheKey = currentCacheKey;
      }
    }

    // 获取数据
    const data = config.data ? toValue(config.data) : [];

    // 如果该行不需要合并，返回默认值
    if (data.length > 0 && !shouldMergeRow(rowIndex, row)) {
      return { rowspan: 1, colspan: 1 };
    }

    // 使用缓存或重新计算
    if (cache) {
      if (!colSpanCache) {
        colSpanCache = calculateColSpans(data.length > 0 ? data : [row]);
      }
    } else {
      colSpanCache = calculateColSpans(data.length > 0 ? data : [row]);
    }

    // 查找该单元格的合并信息
    const rowSpans = colSpanCache[rowIndex];
    if (rowSpans && rowSpans[columnProp]) {
      const spanInfo = rowSpans[columnProp];
      return {
        rowspan: spanInfo.rowspan,
        colspan: spanInfo.colspan,
      };
    }

    // 默认不合并
    return { rowspan: 1, colspan: 1 };
  };
}

/**
 * Span-method 函数类型
 */
export type SpanMethod = (props: SpanMethodProps) => { rowspan: number; colspan: number };

/**
 * 组合多个 span-method 函数
 *
 * @description
 * 允许同时使用多个合并规则（如行合并 + 列合并）
 * 按顺序执行，第一个返回非默认值的结果将被使用
 *
 * @example
 * ```ts
 * const spanMethod = composeSpanMethods(
 *   // 行合并：省份列纵向合并
 *   createSpanMethod({
 *     mergeColumns: ['province'],
 *     data: tableData
 *   }),
 *
 *   // 列合并：第一行横向合并
 *   createColSpanMethod({
 *     rows: [0],
 *     mergeGroups: [['q1', 'q2', 'q3']]
 *   })
 * )
 * ```
 *
 * @param methods - span-method 函数数组
 * @returns 组合后的 span-method 函数
 */
export function composeSpanMethods(...methods: SpanMethod[]): SpanMethod {
  return (props: SpanMethodProps) => {
    for (const method of methods) {
      const result = method(props);

      // 如果某个方法返回了合并（rowspan !== 1 或 colspan !== 1），使用该结果
      if (result.rowspan !== 1 || result.colspan !== 1) {
        return result;
      }
    }

    // 所有方法都返回默认值，返回默认值
    return { rowspan: 1, colspan: 1 };
  };
}
