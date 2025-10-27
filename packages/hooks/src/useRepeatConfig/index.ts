import { deepClone } from 'dlib-utils';
import { useConfigs, useConfigsResultType } from '../useConfigs';
import { onUnmounted } from 'vue';
import { baseConfig } from 'dlib-ui';

export function useRepeatConfig<T extends Omit<baseConfig, 'component'>>(configData: T[]) {
  const collectConfigs = new Map<any, useConfigsResultType<T>>();

  function collect(key: any) {
    const has = getConfig(key);
    if (has) {
      return has.config;
    }
    const o = useConfigs<T>(deepClone(configData), false);
    o.config.forEach((item: any) => {
      item.$key = key;
    });
    collectConfigs.set(key, o);
    return o.config;
  }
  function getConfig(key: any) {
    return collectConfigs.get(key);
  }

  onUnmounted(() => {
    collectConfigs.forEach((configInstance) => {
      if (configInstance.cleanup) {
        configInstance.cleanup();
      }
    });
    collectConfigs.clear();
  });

  return {
    collectConfigs,
    collect,
    getConfig,
  };
}
