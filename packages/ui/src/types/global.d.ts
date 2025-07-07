// // For this project development
// import 'vue';
import { CommonSelect } from '../components';

/**
 * 用作给全局引入的UI组件类型提示：
 * tsconfig.json 需要添加配置："types": ["@DLib/ui/global.d.ts"]
 *
 * 或者
 * 一个全局的类型声明文件.d.ts写入：/// <reference types="@DLib/ui/global.d.ts" />
 * 类似于：/// <reference types="vite/client" /> 具体可参考playground下的env.d.ts
 */
declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    CommonButton: (typeof import('@DLib/ui'))['CommonButton'];
    CommonDialog: (typeof import('@DLib/ui'))['CommonDialog'];
    CreateComponent: (typeof import('@DLib/ui'))['CreateComponent'];
    CommonForm: (typeof import('@DLib/ui'))['CommonForm'];
    CommonSearch: (typeof import('@DLib/ui'))['CommonSearch'];
    CommonTable: (typeof import('@DLib/ui'))['CommonTable'];
    CommonPagination: (typeof import('@DLib/ui'))['CommonPagination'];
    CommonTableLayout: (typeof import('@DLib/ui'))['CommonTableLayout'];
    CommonTableFieldsConfig: (typeof import('@DLib/ui'))['CommonTableFieldsConfig'];
    CommonSelect: (typeof import('@DLib/ui'))['CommonSelect'];
  }
}

export {};
