import { computed, ComputedRef, Ref, ref, toValue, watch } from 'vue';
import { asyncCacheWithHistory, CACHE_TYPE, isEmpty, isFunction } from 'dlib-utils';
import {
  commonKeysMap,
  componentDefaultPropsMap,
} from '~/components/CreateComponent/src/defaultMap.ts';

interface WrappedFunction extends Function {
  __D__?: boolean; //标记
  __DT__?: string; //标记类型
  (...args: any[]): Promise<any>;
}
export interface DataHandlerType {
  //请求api
  api?: WrappedFunction;
  //字典名称
  dict?: string | string[];
  //转化请求结果
  parseData?: Function;
  //是否需要所有查询参数
  needAllQueryParams?: boolean;
  //追加选项
  appendOptions?: Record<any, any>[] | Function;
  //值类型
  valueType?: 'string' | 'String' | 'int' | 'Int';
  //绑定选项
  bindOptions?: Record<any, any>[];
  //多选时将结果合并的拼接符
  joinSplit?: string;
  //排序字段
  orderBy?: string;
  //排序方式
  orderType?: 'asc' | 'desc';
  //字典获取options
  getDictOptions?: Function;
  //值字段对照
  valueField?: string;
  //文本字段对照
  labelField?: string;
  //忽略的标签
  ignoreByLabel?: string[];
  //请求参数
  query?: Function;
}

export const DEFAULT_LABEL_FIELD = 'label';
export const DEFAULT_VALUE_FIELD = 'value';

export class DataHandlerClass<T extends DataHandlerType = DataHandlerType> {
  props: ComputedRef<T>;
  options: Ref<Record<any, any>[]> = ref([]);
  loading: Ref<Boolean> = ref(false);
  moreQueryParams: Record<any, any> = {};
  total: number = 0;

  constructor(props: T, attrs = {}) {
    this.props = computed(() => {
      const cleaned = Object.fromEntries(
        Object.entries(props).filter(([_, v]) => {
          return v !== undefined;
        }),
      );
      return {
        ...componentDefaultPropsMap.CommonSelect,
        ...attrs,
        ...cleaned,
      } as T;
    });
  }

  setMoreQueryParams(params: Record<any, any>) {
    this.moreQueryParams = params;
  }
  /**
   * 子类可以重写这个方法用于处理后续操作
   * */
  afterInit(_options: Record<any, any>) {}
  /**
   * 初始化函数 子类调用
   * */
  init() {
    this.preInitOptions();
    this.watchState();
  }

  isWatching: boolean = false;
  /**
   * 状态监听
   * */
  watchState() {
    if (this.isWatching) return;
    this.isWatching = true;
    watch(
      () => this.props.value.dict,
      () => {
        this.preInitOptions();
      },
    );
    watch(this.props.value.query ?? (() => ({})), () => {
      this.preInitOptions();
    });
    watch(
      () => this.props.value.appendOptions,
      () => {
        if (this.props.value.appendOptions) {
          this.parseOptions(this.options.value);
        }
      },
    );
    watch(
      () => this.props.value.bindOptions,
      (newBindOptions) => {
        const localOptions = newBindOptions && newBindOptions.length > 0 ? [...newBindOptions] : [];
        this.parseOptions(localOptions);
      },
    );
  }
  /**
   * 初始化前置操作
   * */
  preInitOptions() {
    if (this.checkAllQuery()) {
      this.initOptions();
    }
  }
  /**
   * 检查query种是否所有参数准备完成
   * */
  checkAllQuery(): boolean {
    let props = toValue(this.props);
    let options = this.options;
    if (!props.needAllQueryParams) {
      return true;
    }
    const queryData = props.query?.() || {};
    for (const key in queryData) {
      if (isEmpty(queryData[key])) {
        options.value = [];
        return false;
      }
    }
    return true;
  }
  /**
   * 初步初始化options
   * */
  async initOptions() {
    let loading = this.loading;
    let props = toValue(this.props);
    let options = this.options;
    try {
      loading.value = true;
      let localOptions: Record<any, any>[] = [];
      if (props.api) {
        let queryApi;
        let queryData = {
          [commonKeysMap.page]: 1,
          [commonKeysMap.size]: 100,
        };
        let api;

        if (!props.api.__D__) {
          api = asyncCacheWithHistory(props.api, {
            expireTime: 5 * 1000,
            version: 'v1.0.0',
            cacheType: CACHE_TYPE.memory,
          });
        } else {
          api = props.api;
        }

        if (props.query) {
          const o = props.query();
          if (Array.isArray(o)) {
            queryApi = api(...o);
          } else {
            queryApi = api({ ...queryData, ...o, ...this.moreQueryParams });
          }
        } else {
          queryApi = api({ ...queryData, ...this.moreQueryParams });
        }
        const res: any = await queryApi;
        if (props.parseData) {
          localOptions = props.parseData(res);
        } else {
          localOptions = res[commonKeysMap.list] || res;
          if (res[commonKeysMap.total]) {
            this.total = res[commonKeysMap.total];
          }
        }
      } else if (props.dict && props.getDictOptions) {
        // 通过字典获取选项数据
        localOptions = await props.getDictOptions(props.dict);
      } else if (props.bindOptions?.length) {
        // 使用绑定的选项数据
        localOptions = [...props.bindOptions];
      }

      localOptions = localOptions?.filter(
        (o: any) =>
          (props.ignoreByLabel ?? []).indexOf(o[props.labelField || DEFAULT_LABEL_FIELD]) === -1,
      );
      this.parseOptions(localOptions);
    } catch (err) {
      console.error(err);
      options.value = [
        {
          [props.labelField || DEFAULT_LABEL_FIELD]: '未知数据',
          [props.valueField || DEFAULT_VALUE_FIELD]: 0,
        },
      ];
    } finally {
      loading.value = false;
    }
  }
  /**
   * 处理options
   * */
  parseOptions(options: Record<any, any>[]) {
    if (!this.props.value.api) {
      options = this.filterByQuery(options);
    }
    options = this.handleAppendOptions(options);
    this.sortOptions(options);
    this.processValueType(options);
    this.afterInit(options);
  }

  /**
   * 根据 query 参数过滤 options
   * @param localOptions 待过滤的选项数组，每个选项是一个对象
   * @param queryParams 额外的查询参数，会与组件内的 query 合并
   * @returns 过滤后的选项数组，如果没有匹配项或无 query，则返回空数组
   */
  filterByQuery(localOptions: any, queryParams: Record<any, any> = {}) {
    const props = toValue(this.props);
    // 获取 query：优先使用 props.query()，再合并传入的 queryParams
    let query: Record<string, any> = {};
    if (props.query) {
      query = props.query();
    }
    query = { ...query, ...queryParams };
    const keys = Object.keys(query);
    if (keys.length === 0) {
      // 如果没有有效的查询条件，返回全部或空数组
      return localOptions || [];
    }
    return (
      localOptions?.filter((option: any) => {
        // 对每一个查询 key，检查 option 是否匹配
        return keys.every((key: string) => {
          const queryValue: any = query[key];
          const optionValue: any = option[key];
          // 统一处理：将 query 中的值转为数组
          let queryValueArr: string[] = [];
          if (Array.isArray(queryValue)) {
            queryValueArr = queryValue;
          } else if (typeof queryValue === 'string') {
            queryValueArr = queryValue
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
          }
          // 如果 query 中的值为空数组，不过滤该项（或者可以根据需求调整）
          if (queryValueArr.length === 0) {
            return true;
          }
          // 统一处理：将 option 中的值转为数组
          let optionValueArr: string[] = [];
          if (Array.isArray(optionValue)) {
            optionValueArr = optionValue.map((s) => String(s).trim());
          } else if (typeof optionValue === 'string') {
            optionValueArr = optionValue
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
          } else {
            // 如果不是数组也不是字符串，尝试转为字符串再处理（可选，根据业务需求）
            optionValueArr = [String(optionValue).trim()];
          }
          // 检查 option 的值数组中是否存在任意一个匹配 query 的值
          return optionValueArr.some((item) => queryValueArr.includes(item)); // 只有存在匹配时，才保留该项
        });
      }) || []
    );
  }

  /**
   * 追加options
   * */
  handleAppendOptions(localOptions: Record<any, any>[]) {
    let props = toValue(this.props);
    if (!props.appendOptions) {
      return localOptions;
    }
    const filteredOptions = localOptions.filter((o: any) => !o.appendData);
    let appendOptions: Record<any, any> = [];
    if (isFunction(props.appendOptions)) {
      appendOptions = props.appendOptions();
    } else {
      appendOptions = props.appendOptions || [];
    }
    const processedAppendOptions =
      appendOptions
        .filter((o: any) => {
          return (
            o[props.valueField || DEFAULT_VALUE_FIELD] &&
            filteredOptions.findIndex(
              (z: any) =>
                z[props.labelField || DEFAULT_LABEL_FIELD] ==
                o[props.labelField || DEFAULT_LABEL_FIELD],
            ) === -1
          );
        })
        .map((o: any) => ({
          ...o,
          appendData: true,
        })) || [];
    return [...filteredOptions, ...processedAppendOptions];
  }

  /**
   * 选项排序
   * */
  sortOptions(options: Record<any, any>) {
    let props = toValue(this.props);
    const { orderBy, orderType } = props;
    if (orderBy) {
      options.sort((a: any, b: any) => {
        const compareValue = a[orderBy] - b[orderBy];
        return orderType === 'desc' ? -compareValue : compareValue;
      });
    }
  }

  /**
   * 选项数据格式转化
   * */
  processValueType(localOptions: Record<any, any>[]) {
    let props = toValue(this.props);
    let options = this.options;
    if (props.valueType || props.joinSplit) {
      if (props.valueType === 'string' || props.valueType === 'String' || props.joinSplit) {
        options.value = localOptions.map((o: any) => ({
          ...o,
          [props.valueField || DEFAULT_VALUE_FIELD]: String(
            o[props.valueField || DEFAULT_VALUE_FIELD],
          ),
        }));
      } else if (props.valueType === 'int' || props.valueType === 'Int') {
        options.value = localOptions.map((o: any) => ({
          ...o,
          [props.valueField || DEFAULT_VALUE_FIELD]: Number(
            o[props.valueField || DEFAULT_VALUE_FIELD],
          ),
        }));
      }
    } else {
      options.value = localOptions;
    }
  }
}
