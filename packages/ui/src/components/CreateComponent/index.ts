import { withInstall } from '~/_utils';
import createComponent from './src/componentFactory.tsx';

export const CreateComponent = withInstall(createComponent);
export default CreateComponent;

export * from './src/cc.types';
export * from './src/comMap';
