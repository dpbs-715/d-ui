import { withInstall } from '~/_utils';
import Dialog from './src/Dialog.vue';

export const CommonDialog = withInstall(Dialog);
export default CommonDialog;

export * from './src/Dialog.types';
