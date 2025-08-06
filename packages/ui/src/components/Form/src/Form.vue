<script setup lang="ts">
import { componentDefaultPropsMap, type Config, CreateComponent } from '~/components';
import type { CommonFormConfig, CommonFormProps } from './Form.types';
import {
  computed,
  getCurrentInstance,
  toValue,
  ref,
  nextTick,
  h,
  type PropType,
  defineComponent,
} from 'vue';
import { ElForm, ElFormItem, ElRow, ElCol } from 'element-plus';
import { configIterator, getRules, isHidden } from '~/_utils/componentUtils.ts';
defineOptions({
  name: 'CommonForm',
  inheritAttrs: false,
});
const vm = getCurrentInstance();
const props = defineProps<CommonFormProps>();
const formProps = computed(() => {
  const cleaned = Object.fromEntries(
    Object.entries(props).filter(([_, v]) => {
      return v !== undefined;
    }),
  );
  delete cleaned.config;
  return {
    ...componentDefaultPropsMap.CommonForm,
    ...cleaned,
  };
});
const formData: any = defineModel();
const formRef = ref();

/**
 * 表单验证函数
 * 在表单提交前调用此函数，以验证表单是否符合规则
 *
 * @returns {Promise} 返回一个Promise对象，验证通过则resolve，否则reject
 */
function validateForm(fieldArr: string[]) {
  return new Promise((resolve, reject) => {
    // 调用表单组件的validateField方法，对所有表单字段进行验证
    if (formRef.value) {
      formRef.value
        .validateField(fieldArr || [])
        .then(() => {
          resolve(undefined);
        })
        .catch((error: any) => {
          moveToErr();
          reject(error);
        });
    } else {
      resolve(undefined);
    }
  });
}
function moveToErr() {
  nextTick(() => {
    let isError = document.getElementsByClassName('is-error');
    if (isError.length) {
      isError[0].scrollIntoView({
        block: 'center',
        behavior: 'smooth',
        inline: 'center',
      });
    }
  });
}

/**
 * 检查span
 * */
function checkSpan(item: CommonFormConfig, num: number) {
  //可以大不可以小
  return Number(item?.span) > num ? item.span : num;
}

function getConfig(item: CommonFormConfig): Config {
  const cfg = {
    component: 'input',
  };
  configIterator(cfg, {
    config: item,
    writeArgs: { formData: toValue(formData), configItem: item },
  });
  return cfg as Config;
}

function collectFormRef(instance: any) {
  if (vm) {
    formRef.value =
      vm.exposeProxy =
      vm.exposed =
        {
          ...(instance || {}),
          validateForm,
        };
  }
}

const transformModel = defineComponent({
  props: {
    config: {
      type: Object as PropType<CommonFormConfig>,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
  },
  emits: ['update:field'],
  setup: (props: any, { emit }: any) => {
    return () => {
      const modelMap: Record<string, any> = {};
      const model = props.config.model;
      for (const key in model) {
        modelMap[key] = props.formData[model[key]];
        modelMap[`onUpdate:${key}`] = (val: any) => {
          emit('update:field', { field: model[key], value: val });
        };
      }

      return h(CreateComponent, {
        modelValue: props.formData[props.config.field],
        [`onUpdate:modelValue`]: (val: any) => {
          emit('update:field', { field: props.config.field, value: val });
        },
        ...modelMap,
        config: getConfig(props.config),
      });
    };
  },
});
</script>

<template>
  <el-form
    v-bind="formProps"
    :ref="collectFormRef"
    class="commonForm"
    :model="formData"
  >
    <el-row :gutter="20">
      <template
        v-for="item in props.config"
        :key="item.field"
      >
        <el-col
          v-if="!isHidden(item, { formData: toValue(formData) })"
          :sm="checkSpan(item, formProps.col.sm)"
          :md="checkSpan(item, formProps.col.md)"
          :lg="checkSpan(item, formProps.col.lg)"
          :xl="item.span || formProps.col.xl"
        >
          <el-form-item
            style="width: 100%"
            :rules="getRules(item, { formData: toValue(formData) })"
            :prop="item.field"
            :label="item.label"
            v-bind="item.formItemProps"
          >
            <slot
              :name="item.field"
              :config="item"
            >
              <transformModel
                :config="item"
                :form-data="formData"
                @update:field="({ field, value }: Record<string, any>) => (formData[field] = value)"
              />
            </slot>
          </el-form-item>
        </el-col>
      </template>
      <slot name="moreCol" />
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
