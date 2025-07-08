import { useConfigs, useConfigsResultType } from '../useConfigs';
import { CommonFormConfig, CommonTableConfig, CommonTableLayoutConfig } from 'dlib-ui';

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
        o[k].push({
          ...item,
          ...item[k],
          table: null,
          form: null,
          search: null,
        });
      }
    }
  });

  return {
    table: useConfigs(o.table),
    search: useConfigs(o.search),
    form: useConfigs(o.form),
  } as mixResultType;
}
