import { computed, onUnmounted, Reactive, reactive } from 'vue';

export interface useConfigsResultType<T> {
  config: T[];
  getConfigByField: (field: string) => T;
  setHidden: (fields: string[], state: boolean) => void;
}
export function useConfigs<T>(configData: T[]): useConfigsResultType<T> {
  const config: Reactive<T[]> = reactive(configData);
  const configMap = computed(() => {
    return new Map(config.map((item: any) => [item.field, item]));
  });
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
   * 使用key获取字段config对象
   * */
  function getConfigByField(key: string) {
    return configMap.value.get(key) || {};
  }

  onUnmounted(() => {
    config.splice(0);
    configMap.value.clear();
  });

  return {
    getConfigByField,
    setHidden,
    config,
  } as useConfigsResultType<T>;
}
