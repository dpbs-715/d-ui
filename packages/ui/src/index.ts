import type { App } from 'vue';
import {
  CreateComponent,
  CommonForm,
  CommonSearch,
  CommonPagination,
  CommonTable,
  CommonTableLayout,
  CommonTableFieldsConfig,
  CommonButton,
  CommonDialog,
  CommonSelect,
} from './components';

export { version } from './version';

/**
 * 组件全量导入配置
 * */
const components = [
  CreateComponent,
  CommonForm,
  CommonSearch,
  CommonTable,
  CommonPagination,
  CommonTableLayout,
  CommonTableFieldsConfig,
  CommonButton,
  CommonDialog,
  CommonSelect,
];

/**
 * 组件全量导入
 * */
function install(app: App) {
  components.forEach((component) => {
    app.use(component);
  });
}

export { install };

export * from './components';
export * from './libExports';
export * from './resolver';
import './styles/common-variables.scss';
export default {
  install,
};
