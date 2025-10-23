import { computed, ComputedRef, onUnmounted, Reactive, reactive } from 'vue';
import { baseConfig } from 'dlib-ui';

export interface useConfigsResultType<T> {
  config: Reactive<T[]>;
  getConfigByField: (field: string) => T | undefined;
  setPropsByField: (key: string, setProps: any) => void;
  setHidden: (fields: string[], state: boolean) => void;
  setDisabled: (fields: string[], state: boolean) => void;
  setDisabledAll: (state?: boolean) => void;
}
export function useConfigs<T extends baseConfig>(configData: T[]): useConfigsResultType<T> {
  const config: Reactive<T[]> = reactive(configData);
  const configMap: ComputedRef<Map<string, any>> = computed(() => {
    return new Map(config.map((item: any) => [item.field, item]));
  });
  const alwaysDisableFields = new Set();
  /**
   * 根据key设置隐藏显示
   * @param fields 字段key数组
   * @param state  隐藏隐藏状态
   * */
  function setHidden(fields: string[], state: boolean) {
    fields.forEach((field) => {
      const item: any = configMap.value.get(field);
      if (item) {
        item.hidden = state;
      }
    });
  }
  /**
   * 根据key设置字段禁用
   * @param fields 字段key数组
   * @param state  禁用状态
   * */
  function setDisabled(fields: string[], state: boolean) {
    fields.forEach((field) => {
      let alwaysDisableField = false;
      if (field.startsWith('*')) {
        alwaysDisableField = true;
        field = field.substring(1);
      }
      const item: any = configMap.value.get(field);
      if (item) {
        if (!item.props) {
          item.props = {};
        }
        if (alwaysDisableField) {
          if (state) {
            alwaysDisableFields.add(field);
          } else {
            alwaysDisableFields.delete(field);
          }
        }
        item.props.disabled = state;
      }
    });
  }
  /**
   * 设置全部字段禁用
   * @param state  隐藏隐藏状态
   * */
  function setDisabledAll(state?: boolean = true) {
    Array.from(configMap.value.values()).forEach((item) => {
      if (item) {
        if (!item.props) {
          item.props = {};
        }
        if (!alwaysDisableFields.has(item.field)) {
          item.props.disabled = state;
        }
      }
    });
  }

  /**
   * 使用key设置字段props
   * @param key  关键字
   * @param setProps  设置字段的props
   * */
  function setPropsByField(key: string, setProps: Record<any, any>) {
    const item: any = configMap.value.get(key);
    if (!item['props']) {
      item.props = {};
    }
    for (const propsKey in setProps) {
      item.props[propsKey] = setProps[propsKey];
    }
  }

  /**
   * 使用key获取字段config对象
   * */
  function getConfigByField(key: string) {
    return configMap.value.get(key);
  }

  onUnmounted(() => {
    config.splice(0);
    configMap.value.clear();
  });

  return {
    setPropsByField,
    getConfigByField,
    setHidden,
    setDisabled,
    setDisabledAll,
    config,
  } as useConfigsResultType<T>;
}
