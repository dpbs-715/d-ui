import { createApp } from 'vue';

import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
// 引入@DLib/ui
import dlibUI from '~/@DLib/ui';
// import '@DLib/ui/style.css';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
const app = createApp(App);
app.use(ElementPlus, { locale: zhCn });
app.use(dlibUI); // 全局引入@DLib/ui组件
app.use(router);
app.mount('#app');
