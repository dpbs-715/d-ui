import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

export default tseslint.config(
  { ignores: ['**/node_modules', '**/dist', '**/*.js'] }, // 忽略 node_modules 和 dist 目录
  eslint.configs.recommended, // 使用 ESLint 的推荐配置
  tseslint.configs.base, // 使用 TypeScript ESLint 的基础配置
  ...pluginVue.configs['flat/recommended'], // 使用 Vue ESLint 的推荐配置
  {
    files: ['**/*.vue'], // 针对所有 .vue 文件
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        parser: '@typescript-eslint/parser', // 关键点：让 vue-eslint-parser 把 TS 代码交给 @typescript-eslint/parser 处理
        project: './tsconfig.json', // 启用类型信息
        extraFileExtensions: ['.vue'], // 支持 .vue 文件
        sourceType: 'module',
      },
    },
  },
  {
    rules: {
      //使用_跳过eslint未使用的变量校验
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // 弱化 @ts-expect-error 和 @ts-ignore 的使用限制（改为警告或关闭）
      '@typescript-eslint/prefer-ts-expect-error': 'warn', // 改为 warn
      //文件命名规范
      'vue/multi-word-component-names': 'off',
      // 允许混合类型导入和副作用导入（改为 warn 或 off）
      '@typescript-eslint/consistent-type-imports': [
        'warn', // 改为 warn
        {
          fixStyle: 'inline-type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      '@typescript-eslint/no-import-type-side-effects': 'warn', // 改为 warn

      // 可选：完全关闭某些 TS 特定规则
      '@typescript-eslint/no-explicit-any': 'warn', // 放宽对 any 的使用限制
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
    },
  },
);
