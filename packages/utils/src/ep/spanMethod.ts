import { MaybeRef, toValue } from 'vue';

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
 * Span-method 函数类型
 */
export type SpanMethod = (props: SpanMethodProps) => { rowspan: number; colspan: number };

/**
 * 合并组配置（用于列合并）
 */
export type MergeGroup = string[];

/**
 * 单元格合并信息缓存
 */
interface SpanCache {
  [key: string]: { rowspan: number; colspan: number };
}

/**
 * 列合并信息缓存
 */
interface ColSpanCache {
  [rowIndex: number]: {
    [columnProp: string]: { rowspan: number; colspan: number };
  };
}

// ==================== 私有工具函数 ====================

/**
 * 计算行合并的指纹（用于智能缓存）
 */
function calculateRowMergeFingerprint(data: any[], columns: string[]): string {
  return data.map((row) => columns.map((col) => String(row[col] ?? '')).join('|')).join(',');
}

/**
 * 计算行合并信息
 */
function calculateRowSpans(data: any[], mergeColumns: string[]): SpanCache {
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
 * 计算列合并的指纹（用于智能缓存）
 */
function calculateColMergeFingerprint(
  data: any[],
  shouldMergeRow: (rowIndex: number, row: any) => boolean,
  getMergeGroups: (rowIndex: number, row: any) => MergeGroup[],
): string {
  return data
    .map((row, idx) => {
      if (!shouldMergeRow(idx, row)) return '';
      const groups = getMergeGroups(idx, row);
      return groups.map((g) => g.join('|')).join(';');
    })
    .join(',');
}

/**
 * 计算列合并信息
 */
function calculateColSpans(
  data: any[],
  shouldMergeRow: (rowIndex: number, row: any) => boolean,
  getMergeGroups: (rowIndex: number, row: any) => MergeGroup[],
): ColSpanCache {
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

// ==================== 行合并 SpanMethod 创建器 ====================

/**
 * 创建行合并的 span-method（内部使用）
 */
function createRowSpanMethod(
  mergeColumns: string[],
  data: MaybeRef<any[]>,
  enableCache: boolean,
  cacheKey?: MaybeRef<string | number>,
): SpanMethod {
  let spanCache: SpanCache | null = null;
  let lastCacheKey: string | number | undefined = undefined;
  let cachedFingerprint = '';

  // 渲染周期内的临时指纹缓存
  let tempFingerprint = '';
  let tempFingerprintValid = false;

  return function spanMethod({ column, rowIndex }: SpanMethodProps) {
    const currentData = toValue(data);

    if (!mergeColumns.length || !currentData.length) {
      return { rowspan: 1, colspan: 1 };
    }

    const columnProp = column.property;

    // column.property 可能为 undefined（例如操作列）
    if (!columnProp || !mergeColumns.includes(columnProp)) {
      return { rowspan: 1, colspan: 1 };
    }

    // 缓存失效检测
    if (enableCache) {
      if (cacheKey !== undefined) {
        // 策略1：使用用户提供的 cacheKey
        const currentCacheKey = toValue(cacheKey);
        if (currentCacheKey !== lastCacheKey) {
          spanCache = null;
          lastCacheKey = currentCacheKey;
          cachedFingerprint = '';
          tempFingerprintValid = false;
        }
      } else {
        // 策略2：自动检测数据变化
        if (!tempFingerprintValid) {
          tempFingerprint = calculateRowMergeFingerprint(currentData, mergeColumns);
          tempFingerprintValid = true;

          queueMicrotask(() => {
            tempFingerprintValid = false;
          });
        }

        if (tempFingerprint !== cachedFingerprint) {
          spanCache = null;
          cachedFingerprint = tempFingerprint;
        }
      }
    }

    // 计算或使用缓存
    if (!enableCache || !spanCache) {
      spanCache = calculateRowSpans(currentData, mergeColumns);
    }

    const key = `${rowIndex}-${columnProp}`;
    return spanCache[key] || { rowspan: 1, colspan: 1 };
  };
}

// ==================== 列合并 SpanMethod 创建器 ====================

/**
 * 创建列合并的 span-method（内部使用）
 */
function createColSpanMethod(
  rows: boolean | number[] | ((rowIndex: number, row: any) => boolean),
  mergeGroups: MergeGroup[] | ((rowIndex: number, row: any) => MergeGroup[]),
  data: MaybeRef<any[]>,
  enableCache: boolean,
  cacheKey?: MaybeRef<string | number>,
): SpanMethod {
  let colSpanCache: ColSpanCache | null = null;
  let lastCacheKey: string | number | undefined = undefined;
  let cachedFingerprint = '';

  // 渲染周期内的临时指纹缓存
  let tempFingerprint = '';
  let tempFingerprintValid = false;

  function shouldMergeRow(rowIndex: number, row: any): boolean {
    if (typeof rows === 'boolean') {
      return rows;
    } else if (Array.isArray(rows)) {
      return rows.includes(rowIndex);
    }
    return rows(rowIndex, row);
  }

  function getMergeGroups(rowIndex: number, row: any): MergeGroup[] {
    if (typeof mergeGroups === 'function') {
      return mergeGroups(rowIndex, row);
    }
    return mergeGroups;
  }

  return function spanMethod({ row, column, rowIndex }: SpanMethodProps) {
    const columnProp = column.property;
    const currentData = toValue(data);

    // column.property 可能为 undefined（例如操作列）
    if (!columnProp) {
      return { rowspan: 1, colspan: 1 };
    }

    // 提前检查：如果该行不需要合并，直接返回（避免不必要的缓存计算）
    if (currentData.length > 0 && !shouldMergeRow(rowIndex, row)) {
      return { rowspan: 1, colspan: 1 };
    }

    // 缓存失效检测
    if (enableCache) {
      if (cacheKey !== undefined) {
        // 策略1：使用用户提供的 cacheKey
        const currentCacheKey = toValue(cacheKey);
        if (currentCacheKey !== lastCacheKey) {
          colSpanCache = null;
          lastCacheKey = currentCacheKey;
          cachedFingerprint = '';
          tempFingerprintValid = false;
        }
      } else {
        // 策略2：自动检测数据变化
        if (!tempFingerprintValid) {
          tempFingerprint = calculateColMergeFingerprint(
            currentData.length > 0 ? currentData : [row],
            shouldMergeRow,
            getMergeGroups,
          );
          tempFingerprintValid = true;

          queueMicrotask(() => {
            tempFingerprintValid = false;
          });
        }

        if (tempFingerprint !== cachedFingerprint) {
          colSpanCache = null;
          cachedFingerprint = tempFingerprint;
        }
      }
    }

    // 计算或使用缓存
    if (!enableCache || !colSpanCache) {
      colSpanCache = calculateColSpans(
        currentData.length > 0 ? currentData : [row],
        shouldMergeRow,
        getMergeGroups,
      );
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

    return { rowspan: 1, colspan: 1 };
  };
}

// ==================== 组合多个 SpanMethod ====================

/**
 * 组合多个 span-method 函数
 */
function composeSpanMethods(...methods: SpanMethod[]): SpanMethod {
  return (props: SpanMethodProps) => {
    for (const method of methods) {
      const result = method(props);

      if (result.rowspan !== 1 || result.colspan !== 1) {
        return result;
      }
    }

    return { rowspan: 1, colspan: 1 };
  };
}

// ==================== 公开的链式 API ====================

/**
 * 链式构建器接口
 */
export interface TableSpanBuilder {
  /**
   * 设置数据源（必须）
   *
   * @param data - 表格数据数组
   *
   * @example
   * ```ts
   * const tableData = ref([...])
   * createTableSpan().withData(tableData)
   * ```
   */
  withData(data: MaybeRef<any[]>): this;

  /**
   * 添加一组行合并规则（纵向合并）
   *
   * @description
   * - 可以多次调用，每次调用创建一个独立的合并组
   * - 同一组内的列按优先级依次合并（有前后依赖关系）
   * - 不同组之间互不干扰（无依赖关系）
   *
   * @param columns - 需要合并的列名数组，按优先级排序
   *
   * @example
   * ```ts
   * createTableSpan()
   *   .mergeRows(['province', 'city'])  // 第1组：省市联动合并
   *   .mergeRows(['status'])            // 第2组：状态独立合并
   * ```
   */
  mergeRows(columns: string[]): this;

  /**
   * 添加列合并规则（横向合并）
   *
   * @description
   * - 可以多次调用，支持不同行有不同的合并规则
   * - 每次调用可以指定不同的行条件和合并分组
   *
   * @param config - 列合并配置
   * @param config.rows - 需要合并的行（布尔值、索引数组或判断函数）
   * @param config.groups - 合并分组（数组或函数）
   *
   * @example
   * ```ts
   * createTableSpan()
   *   // 表头行合并
   *   .mergeCols({
   *     rows: [0],
   *     groups: [['q1', 'q2', 'q3']]
   *   })
   *   // 汇总行合并
   *   .mergeCols({
   *     rows: (idx, row) => row.type === 'summary',
   *     groups: [['total', 'count']]
   *   })
   * ```
   */
  mergeCols(config: {
    rows: boolean | number[] | ((rowIndex: number, row: any) => boolean);
    groups: MergeGroup[] | ((rowIndex: number, row: any) => MergeGroup[]);
  }): this;

  /**
   * 禁用缓存（默认启用）
   *
   * @description
   * 禁用后每次渲染都会重新计算合并信息
   */
  noCache(): this;

  /**
   * 设置缓存键（用于精确控制缓存失效）
   *
   * @param key - 缓存键，可以是响应式引用
   *
   * @example
   * ```ts
   * const version = ref(0)
   * createTableSpan()
   *   .withCacheKey(version)
   * // 数据变化时：version.value++
   * ```
   */
  withCacheKey(key: MaybeRef<string | number>): this;

  /**
   * 构建最终的 span-method 函数
   *
   * @returns ElementPlus Table 的 span-method 函数
   */
  build(): SpanMethod;
}

/**
 * TableSpanBuilder 实现类
 */
class TableSpanBuilderImpl implements TableSpanBuilder {
  private data: MaybeRef<any[]> | null = null;
  private rowMergeGroups: string[][] = [];
  private colMergeRules: Array<{
    rows: boolean | number[] | ((rowIndex: number, row: any) => boolean);
    groups: MergeGroup[] | ((rowIndex: number, row: any) => MergeGroup[]);
  }> = [];
  private enableCache = true;
  private cacheKey?: MaybeRef<string | number>;

  withData(data: MaybeRef<any[]>): this {
    this.data = data;
    return this;
  }

  mergeRows(columns: string[]): this {
    if (columns.length > 0) {
      this.rowMergeGroups.push(columns);
    }
    return this;
  }

  mergeCols(config: {
    rows: boolean | number[] | ((rowIndex: number, row: any) => boolean);
    groups: MergeGroup[] | ((rowIndex: number, row: any) => MergeGroup[]);
  }): this {
    this.colMergeRules.push(config);
    return this;
  }

  noCache(): this {
    this.enableCache = false;
    return this;
  }

  withCacheKey(key: MaybeRef<string | number>): this {
    this.cacheKey = key;
    return this;
  }

  build(): SpanMethod {
    if (!this.data) {
      throw new Error('[TableSpanBuilder] data is required. Please call withData() first.');
    }

    const methods: SpanMethod[] = [];

    // 为每组行合并创建独立的 spanMethod
    this.rowMergeGroups.forEach((columns) => {
      const method = createRowSpanMethod(columns, this.data!, this.enableCache, this.cacheKey);
      methods.push(method);
    });

    // 为每个列合并规则创建独立的 spanMethod
    this.colMergeRules.forEach((rule) => {
      const method = createColSpanMethod(
        rule.rows,
        rule.groups,
        this.data!,
        this.enableCache,
        this.cacheKey,
      );
      methods.push(method);
    });

    // 如果没有任何合并规则，返回默认函数
    if (methods.length === 0) {
      return () => ({ rowspan: 1, colspan: 1 });
    }

    // 组合所有规则
    return composeSpanMethods(...methods);
  }
}

/**
 * 创建链式表格合并构建器
 *
 * @description
 * 提供流畅的链式 API 来配置 ElementPlus Table 的单元格合并规则
 *
 * @example
 * ```ts
 * // 场景1: 多组独立的行合并
 * const spanMethod = createTableSpan()
 *   .withData(tableData)
 *   .mergeRows(['province', 'city'])      // 第1组：省市联动
 *   .mergeRows(['status'])                 // 第2组：状态独立合并
 *   .mergeRows(['category', 'subcategory']) // 第3组：分类联动
 *   .build()
 *
 * // 场景2: 行合并 + 列合并
 * const spanMethod = createTableSpan()
 *   .withData(tableData)
 *   .mergeRows(['province', 'city'])
 *   .mergeCols({
 *     rows: [0],  // 表头行
 *     groups: [['q1', 'q2', 'q3']]
 *   })
 *   .mergeCols({
 *     rows: (idx, row) => row.type === 'summary',  // 汇总行
 *     groups: [['total', 'count']]
 *   })
 *   .build()
 *
 * // 场景3: 简单场景
 * const spanMethod = createTableSpan()
 *   .withData(tableData)
 *   .mergeRows(['province'])
 *   .build()
 *
 * // 场景4: 自定义缓存键
 * const version = ref(0)
 * const spanMethod = createTableSpan()
 *   .withData(tableData)
 *   .withCacheKey(version)
 *   .mergeRows(['province'])
 *   .build()
 * // 数据变化时：version.value++
 * ```
 *
 * @returns TableSpanBuilder 实例
 */
export function createTableSpan(): TableSpanBuilder {
  return new TableSpanBuilderImpl();
}
