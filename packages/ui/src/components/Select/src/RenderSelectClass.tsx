import { Ref, SlotsType, ref, toValue } from 'vue';
import { CommonSelectProps } from './Select.types.ts';
import { ElSelect, ElSelectV2, ElTreeSelect, ElOption } from 'element-plus';
import {
  DataHandlerClass,
  DEFAULT_LABEL_FIELD,
  DEFAULT_VALUE_FIELD,
} from '~/_utils/dataHandlerClass.ts';

export class RenderSelectClass extends DataHandlerClass<CommonSelectProps> {
  slots: any;
  ref: any;
  useComponent = ref('ElSelect');
  model: any;
  label: any;
  emits: any;
  attrs: any;
  loading: Ref<Boolean> = ref(false);
  constructor(
    props: CommonSelectProps,
    slots: SlotsType,
    emits: any,
    attrs: any,
    {
      model,
      label,
    }: {
      model: any;
      label: any;
    },
  ) {
    super(props);
    this.emits = emits;
    this.model = model;
    this.label = label;
    this.attrs = attrs;
    this.slots = slots;
    this.init();
  }

  afterInit(options: Record<any, any>) {
    this.determineComponentType(options);
    this.selectFirst();
    this.emits('optionsReady', options);
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
   * 当数据只有一条时默认选中
   * */
  selectFirst() {
    let props = toValue(this.props);
    let options = this.options;

    if (options.value?.length === 1 && props.autoSelectFirst) {
      const firstOption = options.value[0];
      const firstValue = firstOption[props.valueField || DEFAULT_VALUE_FIELD];

      this.model.value = firstValue;

      this.changeSelect(firstValue);

      if (this.attrs.onChange) {
        if (Array.isArray(this.attrs.onChange)) {
          this.attrs.onChange.forEach((changeFun: any) => {
            changeFun(firstValue);
          });
        } else {
          this.attrs.onChange(firstValue);
        }
      }
    }
  }
  /**
   * 选项改变操作
   * */
  changeSelect(value: any) {
    if (this.props.value.multiple) {
      this.label.value = value.map((v: any) => {
        return this.options.value.find(
          (item: any) => item[this.props.value.valueField || DEFAULT_VALUE_FIELD] === v,
        )?.[this.props.value.labelField || DEFAULT_LABEL_FIELD];
      });
    } else {
      const obj = this.options.value.find(
        (item: any) => item[this.props.value.valueField || DEFAULT_VALUE_FIELD] === value,
      );
      this.label.value = obj && obj[this.props.value.labelField || DEFAULT_LABEL_FIELD];
      this.emits('changeObj', obj);
    }
  }
  /**
   * 获取Ref实例
   * */
  getRef() {
    return this.ref;
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
              return (
                <ElOption
                  label={item[props.labelField || DEFAULT_LABEL_FIELD]}
                  value={item[props.valueField || DEFAULT_VALUE_FIELD]}
                />
              );
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
}
