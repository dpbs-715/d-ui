// // For this project development
// import 'vue';

import { CommonSelectOrDialog } from '../components';

/**
 * 用作给全局引入的UI组件类型提示：
 * tsconfig.json 需要添加配置："types": ["dlib-ui/global.d.ts"]
 *
 * 或者
 * 一个全局的类型声明文件.d.ts写入：/// <reference types="dlib-ui/global.d.ts" />
 * 类似于：/// <reference types="vite/client" /> 具体可参考playground下的env.d.ts
 */
declare module 'vue' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    CommonButton: (typeof import('dlib-ui'))['CommonButton'];
    CommonDialog: (typeof import('dlib-ui'))['CommonDialog'];
    CreateComponent: (typeof import('dlib-ui'))['CreateComponent'];
    CommonForm: (typeof import('dlib-ui'))['CommonForm'];
    CommonSearch: (typeof import('dlib-ui'))['CommonSearch'];
    CommonTable: (typeof import('dlib-ui'))['CommonTable'];
    CommonPagination: (typeof import('dlib-ui'))['CommonPagination'];
    CommonTableLayout: (typeof import('dlib-ui'))['CommonTableLayout'];
    CommonTableFieldsConfig: (typeof import('dlib-ui'))['CommonTableFieldsConfig'];
    CommonSelect: (typeof import('dlib-ui'))['CommonSelect'];
    CommonSelectOrDialog: (typeof import('dlib-ui'))['CommonSelectOrDialog'];
  }
}

export {};
