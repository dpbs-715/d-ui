import { computed, ComputedRef, Ref, SlotsType, ref, toValue, watch } from 'vue';
import { CommonSelectProps } from './Select.types.ts';
import { componentDefaultPropsMap, commonKeysMap } from '../../CreateComponent/src/comMap.ts';
import { isArray, isEmpty, isFunction } from 'dlib-utils';
import { ElSelect, ElSelectV2, ElTreeSelect, ElOption } from 'element-plus';

export class RenderSelectClass {
  props: ComputedRef<CommonSelectProps>;
  slots: any;
  ref: any;
  useComponent = ref('ElSelect');
  model: any;
  label: any;
  emits: any;
  options: Ref<Record<any, any>> = ref([]);
  loading: Ref<Boolean> = ref(false);
  /**
   * 渲染选择器
   * */
  renderSelect(Com: any) {
    const loading = toValue(this.loading);
    let props = toValue(this.props);
    return (
      <Com
        ref={(instance: any) => (this.ref = instance)}
        onChange={(value: any) => this.changeSelect(value)}
        loading={loading}
        {...props}
        vModel={this.model.value}
      >
        {{
          default: () => {
            return this.options.value.map((item: any) => {
              return <ElOption label={item[props.labelField]} value={item[props.valueField]} />;
            });
          },
        }}
      </Com>
    );
  }
  /**
   * 渲染虚拟化选择器
   * */
  renderSelectV2(Com: any) {
    let props = toValue(this.props);
    return (
      <Com
        ref={(instance: any) => (this.ref = instance)}
        onChange={(value: any) => this.changeSelect(value)}
        options={this.options.value}
        props={{
          value: props.valueField,
          label: props.labelField,
        }}
        {...props}
        vModel={this.model.value}
      />
    );
  }
  /**
   * 渲染树形选择器
   * */
  renderTreeSelect(Com: any) {
    let props = toValue(this.props);
    return (
      <Com
        ref={(instance: any) => (this.ref = instance)}
        props={{
          label: props.labelField,
        }}
        highlightCurrent={true}
        nodeKey={props.valueField}
        data={this.options.value}
        {...props}
        vModel={this.model.value}
      />
    );
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
      return (
        localOptions?.filter((o: any) => props.ignoreByLabel.indexOf(o[props.labelField]) === -1) ||
        []
      );
    }
    return (
      localOptions?.filter((o: any) => {
        if (props.ignoreByLabel.indexOf(o[props.labelField]) !== -1) {
          return false;
        }
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
   * 确认组件类型
   * */
  determineComponentType(localOptions: Record<any, any>) {
    let props = toValue(this.props);
    if (props.componentType) {
      this.useComponent.value = props.componentType;
    } else {
      this.useComponent.value = localOptions?.length > 50 ? 'ElSelectV2' : 'ElSelect';
    }
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
            o[props.valueField] &&
            filteredOptions.findIndex((z: any) => z[props.labelField] == o[props.labelField]) === -1
          );
        })
        .map((o: any) => ({
          ...o,
          appendData: true,
        })) || [];
    return [...filteredOptions, ...processedAppendOptions];
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
          [props.valueField]: String(o[props.valueField]),
        }));
      } else if (props.valueType === 'int' || props.valueType === 'Int') {
        options.value = localOptions.map((o: any) => ({
          ...o,
          [props.valueField]: Number(o[props.valueField]),
        }));
      }
    } else {
      options.value = localOptions;
    }
  }
  /**
   * 当数据只有一条时默认选中
   * */
  selectFirst() {
    let props = toValue(this.props);
    let options = this.options;

    if (options.value?.length === 1 && props.autoSelectFirst) {
      const firstOption = options.value[0];
      const firstValue = firstOption[props.valueField];

      this.model.value = firstValue;

      this.changeSelect(firstValue);

      if (props.onChange) {
        if (Array.isArray(props.onChange)) {
          props.onChange.forEach((changeFun: any) => {
            changeFun(firstValue);
          });
        } else {
          props.onChange(firstValue);
        }
      }
    }
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
        let api = props.api;
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
        localOptions = localOptions?.filter(
          (o: any) => props.ignoreByLabel.indexOf(o[props.labelField]) === -1,
        );
      } else if (props.dict && props.getDictOptions) {
        // 通过字典获取选项数据
        localOptions = await props.getDictOptions(props.dict);
      } else if (props.bindOptions?.length) {
        // 使用绑定的选项数据
        localOptions = [...props.bindOptions];
      }
      this.parseOptions(localOptions);
    } catch (err) {
      console.error(err);
      options.value = [{ [props.labelField]: '未知数据', [props.valueField]: 0 }];
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
    this.determineComponentType(options);
    this.sortOptions(options);
    this.processValueType(options);
    this.selectFirst();
    this.emits('optionsReady', options);
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
    if (isArray(queryData)) {
      for (let i = 0; i < queryData.length; i++) {
        if (isEmpty(queryData[i])) {
          options.value = [];
          return false;
        }
      }
    } else {
      const keys = Object.keys(queryData);
      for (let i = 0; i < keys.length; i++) {
        if (isEmpty(queryData[keys[i]])) {
          options.value = [];
          return false;
        }
      }
    }
    return true;
  }
  /**
   * 初始化前置操作
   * */
  preInit() {
    if (this.checkAllQuery()) {
      this.initOptions();
    }
  }
  /**
   * 选项改变操作
   * */
  changeSelect(value: any) {
    if (this.props.value.multiple) {
      this.label.value = value.map((v: any) => {
        return this.options.value.find((item: any) => item[this.props.value.valueField] === v)?.[
          this.props.value.labelField
        ];
      });
    } else {
      const obj = this.options.value.find(
        (item: any) => item[this.props.value.valueField] === value,
      );
      this.label.value = obj && obj[this.props.value.labelField];
      this.emits('changeObj', obj);
    }
  }
  constructor(
    props: CommonSelectProps,
    slots: SlotsType,
    emits: any,
    {
      model,
      label,
    }: {
      model: any;
      label: any;
    },
  ) {
    this.emits = emits;
    this.model = model;
    this.label = label;
    this.props = computed(() => {
      const cleaned = Object.fromEntries(
        Object.entries(props).filter(([_, v]) => {
          return v !== undefined;
        }),
      );
      return {
        ...componentDefaultPropsMap.CommonSelect,
        ...cleaned,
      } as CommonSelectProps;
    });
    this.slots = slots;

    this.preInit();
    this.watchState();
  }
  /**
   * 获取Ref实例
   * */
  getRef() {
    return this.ref;
  }
  /**
   * 状态监听
   * */
  watchState() {
    watch(
      () => this.props.value.dict,
      () => {
        this.preInit();
      },
    );
    watch(this.props.value.query, () => {
      this.preInit();
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
   * 渲染入口
   * */
  render() {
    switch (this.useComponent.value) {
      case 'ElSelect':
        return this.renderSelect(ElSelect);
      case 'ElSelectV2':
        return this.renderSelectV2(ElSelectV2);
      case 'ElTreeSelect':
        return this.renderTreeSelect(ElTreeSelect);
      default:
        return this.renderSelect(ElSelect);
    }
  }
}
