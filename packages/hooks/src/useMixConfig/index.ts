import { useConfigs, useConfigsResultType } from '../useConfigs';
import { CommonFormConfig, CommonTableConfig, CommonTableLayoutConfig } from 'dlib-ui';
import { deepClone } from 'dlib-utils';

export interface mixResultType {
  table: useConfigsResultType<CommonTableConfig>;
  form: useConfigsResultType<CommonFormConfig>;
  search: useConfigsResultType<CommonFormConfig>;
}
export function useMixConfig(configData: CommonTableLayoutConfig[]): mixResultType {
  const o: any = {
    table: [],
    form: [],
    search: [],
  };

  configData.forEach((item: any) => {
    for (let k in o) {
      if (item[k]) {
        const obj = {
          ...deepClone(item),
          ...item[k],
        };
        delete obj.table;
        delete obj.form;
        delete obj.search;
        o[k].push(obj);
      }
    }
  });

  return {
    table: useConfigs(o.table),
    search: useConfigs(o.search),
    form: useConfigs(o.form),
  } as mixResultType;
}
