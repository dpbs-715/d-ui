import { computed, ComputedRef, getCurrentInstance, onUnmounted, Reactive, reactive } from 'vue';
import type { baseConfig } from 'dlib-ui';

type FieldKey<T> = T extends { field: infer F extends string } ? F : never;

export interface UseConfigsResult<Item extends Omit<baseConfig, 'component'>>
  extends UseConfigsTuple<Item> {
  config: Reactive<Item[]>;
  setHidden: (fields: FieldKey<Item>[], state: boolean) => void;
  setDisabled: (fields: (FieldKey<Item> | `*${FieldKey<Item>}`)[], state: boolean) => void;
  setDisabledAll: (state?: boolean) => void;
  setPropsByField: (field: FieldKey<Item>, props: Record<string, any>) => void;
  getConfigByField: (field: FieldKey<Item>) => Item | undefined;
  filterConfigs: (predicate: (item: Item) => boolean) => Item[];
  cleanup: () => void;
}
type UseConfigsTuple<Item> = [
  Reactive<Item[]>,
  (fields: FieldKey<Item>[], state: boolean) => void,
  (fields: (FieldKey<Item> | `*${FieldKey<Item>}`)[], state: boolean) => void,
  (state?: boolean) => void,
  (field: FieldKey<Item>, props: Record<string, any>) => void,
  (field: FieldKey<Item>) => Item | undefined,
  (predicate: (item: Item) => boolean) => Item[],
  () => void,
];
export function useConfigs<const T extends readonly Omit<baseConfig, 'component'>[]>(
  initialConfig: T,
  autoCleanup = true,
): UseConfigsResult<T[number]> {
  type Item = T[number];
  type Field = Item['field'];

  const config = reactive(initialConfig as unknown as Item[]) as Reactive<Item[]>;

  const configMap: ComputedRef<Map<Field, Item>> = computed(() => {
    return new Map<Field, Item>(config.map((item) => [item.field as Field, item]));
  });

  const alwaysDisabled = new Set<Field>();
  /**
   * 根据key设置隐藏显示
   * @param fields 字段key数组
   * @param hidden  隐藏隐藏状态
   * */
  const setHidden: UseConfigsResult<Item>['setHidden'] = (fields, hidden) => {
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
  const setDisabled: UseConfigsResult<Item>['setDisabled'] = (fields, disabled) => {
    fields.forEach((key) => {
      // key 可能以 '*' 开头表示永久禁用/解除
      let field = key as Field;
      const isAlways = key.toString().startsWith('*');
      if (isAlways) field = key.toString().slice(1) as Field;

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
  const setDisabledAll: UseConfigsResult<Item>['setDisabledAll'] = (disabled = true) => {
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
  const setPropsByField: UseConfigsResult<Item>['setPropsByField'] = (field, props) => {
    const item = configMap.value.get(field);
    if (!item) return;
    item.props ||= {};
    Object.assign(item.props, props);
  };
  /**
   * 使用key获取字段config对象
   * */
  const getConfigByField: UseConfigsResult<Item>['getConfigByField'] = (field) =>
    configMap.value.get(field);

  const filterConfigs: UseConfigsResult<Item>['filterConfigs'] = (predicate) => {
    const filtered = config.filter(predicate);
    return reactive(filtered) as Reactive<Item[]>;
  };

  const cleanup: UseConfigsResult<Item>['cleanup'] = () => config.splice(0);

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
  ) as unknown as UseConfigsResult<Item>;
}
