import { MaybeRef } from 'vue';
import {
  composeSpanMethods,
  createColSpanMethod,
  createRowSpanMethod,
  MergeGroup,
  SpanMethod,
} from './methods';

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
   * createSpanMethod().withData(tableData)
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
   * createSpanMethod()
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
   * createSpanMethod()
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
   * createSpanMethod()
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
 * const spanMethod = createSpanMethod()
 *   .withData(tableData)
 *   .mergeRows(['province', 'city'])      // 第1组：省市联动
 *   .mergeRows(['status'])                 // 第2组：状态独立合并
 *   .mergeRows(['category', 'subcategory']) // 第3组：分类联动
 *   .build()
 *
 * // 场景2: 行合并 + 列合并
 * const spanMethod = createSpanMethod()
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
 * const spanMethod = createSpanMethod()
 *   .withData(tableData)
 *   .mergeRows(['province'])
 *   .build()
 *
 * // 场景4: 自定义缓存键
 * const version = ref(0)
 * const spanMethod = createSpanMethod()
 *   .withData(tableData)
 *   .withCacheKey(version)
 *   .mergeRows(['province'])
 *   .build()
 * // 数据变化时：version.value++
 * ```
 *
 * @returns TableSpanBuilder 实例
 */
export function createSpanMethod(): TableSpanBuilder {
  return new TableSpanBuilderImpl();
}
