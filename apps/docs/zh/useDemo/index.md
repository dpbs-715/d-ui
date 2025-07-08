### 使用样例

#### 生成一个带查询条件的分页列表 右上角点击新增 弹出表单

> index.vue列表

```html
<script setup lang="ts">
  import { reactive, ref } from 'vue';
  import { useMixConfig } from 'dlib-hooks';
  import { config } from './config.data';
  import dataForm from './dataForm.vue';
  const queryParams = reactive({
    pageNo: 1,
    pageSize: 10,
  });
  const dataFormRef = ref();
  const total = ref(0);
  const tableData = reactive([{}]);
  const loading = ref(false);
  const { search, table } = useMixConfig(config);
  function searchFun() {}
  function addHandler() {
    dataFormRef.value.open('create');
  }
</script>

<template>
  <CommonTableLayout>
    <template #search>
      <CommonSearch v-model="queryParams" :config="search.config" @search="searchFun" />
    </template>

    <template #operation-right>
      <CommonTableFieldsConfig :config="table.config" />
      <CommonButton type="create" @click="addHandler"> 新增 </CommonButton>
    </template>
    <template #table="{ tableHeight }">
      <CommonTable
        :height="tableHeight"
        use-index
        empty-text="/"
        :data="tableData"
        :loading="loading"
        :config="table.config"
      />
    </template>
    <template #pagination>
      <CommonPagination
        v-model:page="queryParams.pageNo"
        v-model:limit="queryParams.pageSize"
        :total="total"
        @pagination="searchFun"
      />
    </template>
  </CommonTableLayout>
  <dataForm ref="dataFormRef" />
</template>

<style scoped></style>
```

> dataForm.vue表单

```html
<script setup lang="ts">
  import { useMixConfig, useRefCollect } from 'dlib-hooks';
  import { CommonForm } from 'dlib-ui'; //因为和这项目组件名重了 在这指定下
  import { config } from './config.data';
  const { t } = useI18n();

  const formData = reactive({});
  const { form } = useMixConfig(config);

  const formLoading = ref(false);
  const visible = ref(false);
  const formType = ref('');
  const title = ref('');

  const { handleRef, getRefsValidateArr } = useRefCollect();

  const open = async (type: string, id?: number) => {
    visible.value = true;
    title.value = t('action.' + type);
    formType.value = type;
    if (id) {
      formLoading.value = true;
      try {
        //TODO 查询详情接口
      } finally {
        formLoading.value = false;
      }
    }
  };

  function submit() {
    getRefsValidateArr().then((res) => {
      alert(res);
    });
  }

  defineExpose({ open });
</script>

<template>
  <CommonDialog v-model="visible" :title="title" :width="800" :footer-hide="true" @confirm="submit">
    <template #default>
      <CommonForm :ref="(e) => handleRef(e, 'formRef')" v-model="formData" :config="form.config" />
    </template>
  </CommonDialog>
</template>

<style scoped></style>
```

> config.data.ts配置文件

```ts
import { CommonTableLayoutConfig } from 'dlib-ui';
import { DICT_TYPE, getIntDictOptions } from '@/utils/dict';

export const config: CommonTableLayoutConfig[] = [
  {
    field: 'formulaCode',
    label: '公式编号',
    search: {
      props: {
        clearable: true, //后期通过公共配置  默认上
      },
    },
    table: true,
    form: {
      span: 12,
      props: {
        disabled: true,
        placeholder: '自动生成',
      },
    },
  },
  {
    field: 'formulaName',
    label: '公式名称',
    search: {
      props: {
        clearable: true, //后期通过公共配置  默认上
      },
    },
    table: true,
    form: {
      span: 12,
    },
  },
  {
    field: 'calcFormula',
    label: '计算公式',
    table: true,
    form: {
      span: 12,
      component: 'select',
      props: {
        options: getIntDictOptions(DICT_TYPE.FEE_CALC_FORMULA),
      },
    },
  },
  {
    field: 'setName',
    label: '制定人',
    search: {
      props: {
        clearable: true, //后期通过公共配置  默认上
      },
    },
    table: true,
    form: {
      span: 12,
      props: {
        disabled: true,
        placeholder: '自动生成',
      },
    },
  },
  {
    field: 'setTime',
    label: '制定时间',
    search: {
      component: 'datePicker', //后期可以通过公共配置 制定下props 这个key 就直接读模板
      props: {
        format: 'YYYY-MM-DD', //后期通过公共配置  默认上
        clearable: true, //后期通过公共配置  默认上
      },
    },
    table: true,
    form: {
      span: 12,
      props: {
        disabled: true,
        placeholder: '自动生成',
      },
    },
  },
  {
    field: 'remark',
    label: '备注',
    form: {
      span: 24,
      props: {
        type: 'textarea',
      },
    },
  },
];
```
