import { computed, ComputedRef, getCurrentInstance, onUnmounted, Reactive, reactive } from 'vue';
import type { baseConfig } from 'dlib-ui';

export interface useConfigsResultType<T extends Omit<baseConfig, 'component'>>
  extends UseConfigsTuple<T> {
  config: Reactive<T[]>;
  setHidden: (fields: string[], state: boolean) => void;
  setDisabled: (fields: string[], state: boolean) => void;
  setDisabledAll: (state?: boolean) => void;
  setPropsByField: (field: string, props: Record<string, any>) => void;
  getConfigByField: (field: string) => T | undefined;
  filterConfigs: (predicate: (item: T) => boolean) => Reactive<T[]>;
  cleanup: () => void;
}
type UseConfigsTuple<T> = [
  Reactive<T[]>,
  (fields: string[], state: boolean) => void,
  (fields: string[], state: boolean) => void,
  (state?: boolean) => void,
  (field: string, props: Record<string, any>) => void,
  (field: string) => T | undefined,
  (predicate: (item: T) => boolean) => T[],
  () => void,
];
export function useConfigs<T extends Omit<baseConfig, 'component'>>(
  initialConfig: T[],
  autoCleanup = true,
): useConfigsResultType<T> {
  const config = reactive(initialConfig as unknown as T[]) as Reactive<T[]>;

  const configMap: ComputedRef<Map<string, T>> = computed(() => {
    return new Map<string, any>(config.map((item) => [item.field as string, item as any]));
  });

  const alwaysDisabled = new Set<string>();
  /**
   * 根据key设置隐藏显示
   * @param fields 字段key数组
   * @param hidden  隐藏隐藏状态
   * */
  const setHidden: useConfigsResultType<T>['setHidden'] = (fields, hidden) => {
    fields.forEach((field) => {
      const item: any = configMap.value.get(field);
      if (item) item.hidden = hidden;
    });
  };
  /**
   * 根据key设置字段禁用
   * @param fields 字段key数组
   * @param disabled  禁用状态
   * */
  const setDisabled: useConfigsResultType<T>['setDisabled'] = (fields, disabled) => {
    fields.forEach((key) => {
      // key 可能以 '*' 开头表示永久禁用/解除
      let field = key as string;
      const isAlways = key.toString().startsWith('*');
      if (isAlways) field = key.toString().slice(1) as string;

      const item = configMap.value.get(field);
      if (!item) return;

      // ensure props object exists
      item.props ||= {};
      item.props.disabled = disabled;

      if (isAlways) {
        disabled ? alwaysDisabled.add(field) : alwaysDisabled.delete(field);
      }
    });
  };
  /**
   * 设置全部字段禁用
   * @param disabled  隐藏隐藏状态
   * */
  const setDisabledAll: useConfigsResultType<T>['setDisabledAll'] = (disabled = true) => {
    Array.from(configMap.value.values()).forEach((item) => {
      if (item) {
        item.props ||= {};
        if (!alwaysDisabled.has(item.field)) {
          item.props.disabled = disabled;
        }
      }
    });
  };
  /**
   * 使用key设置字段props
   * @param field  关键字
   * @param props  设置字段的props
   * */
  const setPropsByField: useConfigsResultType<T>['setPropsByField'] = (field, props) => {
    const item = configMap.value.get(field);
    if (!item) return;
    item.props ||= {};
    Object.assign(item.props, props);
  };
  /**
   * 使用key获取字段config对象
   * */
  const getConfigByField: useConfigsResultType<T>['getConfigByField'] = (field) =>
    configMap.value.get(field);

  const filterConfigs: useConfigsResultType<T>['filterConfigs'] = (predicate) => {
    const filtered = config.filter(predicate as any);
    return reactive(filtered) as Reactive<T[]>;
  };

  const cleanup: useConfigsResultType<T>['cleanup'] = () => config.splice(0);

  if (autoCleanup && getCurrentInstance()) {
    onUnmounted(cleanup);
  }

  return Object.assign(
    [
      config,
      setHidden,
      setDisabled,
      setDisabledAll,
      setPropsByField,
      getConfigByField,
      filterConfigs,
      cleanup,
    ],
    {
      config,
      setHidden,
      setDisabled,
      setDisabledAll,
      setPropsByField,
      getConfigByField,
      filterConfigs,
      cleanup,
    },
  ) as unknown as useConfigsResultType<T>;
}
