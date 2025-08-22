import { computed, ComputedRef, Ref, ref, toValue, watch } from 'vue';
import {
  commonKeysMap,
  componentDefaultPropsMap,
} from '../components/CreateComponent/src/comMap.ts';
import { asyncCacheWithHistory, CACHE_TYPE, isEmpty, isFunction } from 'dlib-utils';

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
  options: Ref<Record<any, any>> = ref([]);
  loading: Ref<Boolean> = ref(false);
  constructor(props: T) {
    this.props = computed(() => {
      const cleaned = Object.fromEntries(
        Object.entries(props).filter(([_, v]) => {
          return v !== undefined;
        }),
      );
      return {
        ...componentDefaultPropsMap.CommonSelect,
        ...cleaned,
      } as T;
    });
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
  /**
   * 状态监听
   * */
  watchState() {
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
      let localOptions: Record<any, any> = [];
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
            queryApi = api({ ...queryData, ...o });
          }
        } else {
          queryApi = api(queryData);
        }
        const res: any = await queryApi;
        if (props.parseData) {
          localOptions = props.parseData(res);
        } else {
          localOptions = res;
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
  parseOptions(options: Record<any, any>) {
    if (!this.props.value.api) {
      options = this.filterByQuery(options);
    }
    options = this.handleAppendOptions(options);
    this.sortOptions(options);
    this.processValueType(options);
    this.afterInit(options);
  }

  /**
   * 根据query参数过滤options
   * */
  filterByQuery(localOptions: Record<any, any>) {
    let props = toValue(this.props);
    let query: any = {};
    if (props.query) {
      query = props.query();
    }
    const keys = Object.keys(query);
    if (keys.length === 0) {
      return localOptions || [];
    }
    return (
      localOptions?.filter((o: any) => {
        for (const key of keys) {
          let queryValueArr: Record<any, any> = [];
          if (Array.isArray(query[key])) {
            queryValueArr = query[key];
          } else if (typeof query[key] === 'string') {
            queryValueArr = query[key]?.split(',') || [];
          }
          let optionsValueArr: Record<any, any> = [];
          if (Array.isArray(o[key])) {
            optionsValueArr = o[key];
          } else if (typeof o[key] === 'string') {
            optionsValueArr = o[key]?.split(',') || [];
          }
          const has = optionsValueArr.some((item: any) => queryValueArr.includes(item));
          if (!has) {
            return false;
          }
        }
        return true;
      }) || []
    );
  }

  /**
   * 追加options
   * */
  handleAppendOptions(localOptions: Record<any, any>) {
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
  processValueType(localOptions: Record<any, any>) {
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
