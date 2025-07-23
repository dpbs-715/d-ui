<script setup lang="ts">
import { useAttrs, ref, watch, nextTick } from 'vue';
import { ElSelect, ElSelectV2, ElTreeSelect, ElOption } from 'element-plus';
import type { CommonSelectProps } from './Select.types';
import { isArray, isEmpty, isFunction } from 'dlib-utils';
import { commonKeysMap } from '../../CreateComponent/src/comMap.ts';
// 定义组件选项，包括组件的名称
defineOptions({ name: 'CommonSelect' });
const useComponent = ref('ElSelect');

const props = withDefaults(defineProps<CommonSelectProps>(), {
  valueField: 'value',
  labelField: 'label',
  autoSelectFirst: false,
  multiple: false,
  needAllQueryParams: false,
  orderType: 'asc',
  ignoreByLabel: () => [],
  query: () => ({}),
  bindOptions: () => [],
});
// 于触发自定义事件
const emits = defineEmits(['changeObj', 'optionsReady']);

// 获取组件的其他属性
const attrs: any = useAttrs();

// 用于存储选项数据的响应式引用
const options: any = ref([]);

// 定义组件的数据模型，用于存储选中的值
const model = defineModel({
  get(value: any) {
    if (props.joinSplit && props.multiple) {
      return value?.split(props.joinSplit).filter((item: any) => item.trim() !== '');
    } else {
      return value;
    }
  },
  set(value: any) {
    if (props.joinSplit && props.multiple) {
      return value?.join(props.joinSplit);
    } else {
      return value;
    }
  },
});
// 定义组件的数据模型，用于存储选中的标签
const label = defineModel('label', {
  get(value: any) {
    if (props.joinSplit && props.multiple) {
      return value?.split(props.joinSplit);
    } else {
      return value;
    }
  },
  set(value: any) {
    if (props.joinSplit && props.multiple) {
      return value?.join(props.joinSplit);
    } else {
      return value;
    }
  },
});

/**
 * 处理选择变化的函数
 * 根据选择的值更新显示的标签，并在多选情况下将选择的多个值转换为对应的标签
 * 在单选情况下，找到对应的选择项并更新显示的标签，同时触发变更事件
 *
 * @param {string | string[]} value - 用户选择的值，可以是单个值或多个值（在多选情况下）
 */
function changeSelect(value: any[]) {
  // 如果是多选情况下，将选择的每个值转换为对应的标签
  if (props.multiple) {
    // 使用map遍历每个选择的值，找到对应的选项，并获取其标签
    label.value = value.map((v: any) => {
      return options.value.find((item: any) => item[props.valueField] === v)?.[props.labelField];
    });
  } else {
    // 在单选情况下，找到对应的选择项并更新显示的标签
    const obj = options.value.find((item: any) => item[props.valueField] === value);
    label.value = obj && obj[props.labelField];
    // 触发变更事件，传递选择的选项
    emits('changeObj', obj);
  }
}
/**
 * 根据选中的值获取对应的选项数据
 *
 * 此函数旨在从选项集中找出被选中的项它通过比较选项的值和给定的选中值来完成这一点
 * 如果是多选情况下，需要手动传递value值，因为在多选时，model.value本身是被选中的值的数组
 *
 * @param {any} value - 当前选中的值，对于多选来说是被选中的值的数组
 * @returns {Object|null} - 返回找到的选项对象，如果没有找到则返回null
 */
function getSelectData(value?: any) {
  // 如果不是多选，直接使用当前选中的值或model.value（针对单选和未选中的情况）来查找选项
  if (!props.multiple) {
    return (
      options.value.find((item: any) => item[props.valueField] === (value || model.value)) || {}
    );
  } else {
    return (
      options.value.filter((item: any) => {
        return model.value.indexOf(item[props.valueField]) > -1;
      }) || []
    );
  }
}

// 如果属性对象中提供了onWatchChange回调函数  会有详情覆盖问题 注意可能会引起无限循环问题
if (attrs.onWatchChange) {
  // 监听model.value的变化
  watch(
    () => [model.value, options.value],
    () => {
      if (options.value.length > 0) {
        // 当model.value发生变化时，调用onWatchChange回调函数，并传递当前选中的数据
        attrs.onWatchChange(getSelectData());
      }
    },
    {
      immediate: true, // 在组件首次创建后立即执行
    },
  );
}

function optionsSort(obj: any) {
  const orderBy = props.orderBy;
  if (orderBy) {
    obj.sort((a: any, b: any) => {
      if (props.orderType === 'desc') {
        return b[orderBy] - a[orderBy];
      } else {
        return a[orderBy] - b[orderBy];
      }
    });
  }
}

const loading = ref(false);
/**
 * 初始化选项数据
 * 该函数根据是否提供了API接口或字典类型来异步获取并处理选项数据
 */
async function initOptions() {
  // 如果提供了API接口，则通过API获取选项数据
  let localOptions: any = [];

  if (props.api) {
    let queryApi;
    let queryData = {
      [commonKeysMap.page]: 1,
      [commonKeysMap.size]: 100,
    };
    if (props.query) {
      const o = props.query();
      if (Array.isArray(o)) {
        queryApi = props.api(...o);
      } else {
        queryApi = props.api({ ...queryData, ...o });
      }
    } else {
      queryApi = props.api(queryData);
    }
    loading.value = true;
    // 调用API接口，传入默认参数和查询条件，获取响应数据
    queryApi
      .then((res: any) => {
        // 根据响应数据更新选项数据
        if (props.parseData) {
          localOptions = props.parseData(res);
        } else {
          localOptions = res;
        }
        localOptions = localOptions?.filter(
          (o: any) => props.ignoreByLabel.indexOf(o[props.labelField]) === -1,
        );
        optionsSort(localOptions);
        if (!props.componentType) {
          if (localOptions?.length > 50) {
            useComponent.value = 'ElSelectV2';
          } else {
            useComponent.value = 'ElSelect';
          }
        } else {
          useComponent.value = props.componentType;
        }
        nextTick(() => {
          options.value = localOptions;
          parseOptions();
          // 调用selectFirst函数，选择第一个选项
          selectFirst();

          emits('optionsReady', localOptions);
        });
      })
      .finally(() => {
        loading.value = false;
      })
      .catch((err: any) => {
        console.error(err);
        // 如果API请求失败，设置默认的选项数据
        options.value = [{ [props.labelField]: '未知数据', [props.valueField]: 0 }];
      });
  } else if (props.dict && props.getDictOptions) {
    // 如果没有提供API接口，但提供了字典类型，则通过字典管理功能获取选项数据
    const res = await props.getDictOptions(props.dict);
    // 根据字典类型获取的选项数据更新options值
    optionsSort(res);
    options.value = filterByQuery(res);
    if (!props.componentType) {
      if (localOptions?.length > 50) {
        useComponent.value = 'ElSelectV2';
      } else {
        useComponent.value = 'ElSelect';
      }
    } else {
      useComponent.value = props.componentType;
    }

    parseOptions();
    // 调用selectFirst函数，选择第一个选项
    selectFirst();

    emits('optionsReady', res);
  }
}

function filterByQuery(localOptions: any[]) {
  let query: any = {};
  if (props.query) {
    query = props.query();
  }
  const keys = Object.keys(query);
  return (
    localOptions?.filter((o: any) => {
      let queryCheck = true;
      if (keys.length > 0) {
        for (let i = 0; i < keys.length; i++) {
          const key: any = keys[i];
          let queryValueArr: any = [];
          if (Array.isArray(query[key])) {
            queryValueArr = query[key];
          } else if (typeof query[key] === 'string') {
            queryValueArr = query[key]?.split(',') || [];
          }
          let optionsValueArr = [];
          if (Array.isArray(o[key])) {
            optionsValueArr = o[key];
          } else if (typeof o[key] === 'string') {
            optionsValueArr = o[key]?.split(',') || [];
          }
          const has = optionsValueArr.some((item) => queryValueArr.includes(item));
          if (!has) {
            queryCheck = false;
            break;
          }
        }
      }
      return props.ignoreByLabel.indexOf(o[props.labelField]) === -1 && queryCheck;
    }) || []
  );
}

/**
 * 自动选择第一个选项
 * 当选项数量为一个且配置了自动选择第一个选项时，直接选择该选项
 */
function selectFirst() {
  // 判断选项存在且数量为一个，并且配置了自动选择第一个选项
  if (options.value && options.value.length === 1 && props.autoSelectFirst) {
    // 设置模型的值为第一个选项的值
    model.value = options.value[0][props.valueField];
    // 触发选择事件，传递第一个选项的值
    changeSelect(options.value[0][props.valueField]);
    if (attrs.onChange && Array.isArray(attrs.onChange)) {
      attrs.onChange.forEach((changeFun: any) => {
        changeFun(options.value[0][props.valueField]);
      });
    } else {
      attrs.onChange?.(options.value[0][props.valueField]);
    }
  }
}

function parseOptions() {
  if (props.valueType || props.joinSplit) {
    if (props.valueType === 'string' || props.valueType === 'String' || props.joinSplit) {
      options.value = options.value.map((o: any) => {
        return {
          ...o,
          [props.valueField]: o[props.valueField] + '', // 转换为字符串
        };
      });
    } else if (props.valueType === 'int' || props.valueType === 'Int') {
      options.value = options.value.map((o: any) => {
        return {
          ...o,
          [props.valueField]: +o[props.valueField], // 转换为整数
        };
      });
    }
  }
  handleAppendOptions();
}

function handleAppendOptions() {
  if (props.appendOptions) {
    // 过滤掉不需要追加的数据
    options.value = options.value.filter((o: any) => {
      return !o.appendData;
    });
    let localOptions;
    if (isFunction(props.appendOptions)) {
      localOptions = props.appendOptions();
    } else {
      localOptions = props.appendOptions;
    }
    // 将新的追加选项与现有选项合并
    options.value = [
      ...options.value,
      ...((localOptions || [])
        .filter((o: any) => {
          return (
            o[props.valueField] &&
            options.value.findIndex((z: any) => {
              return z[props.labelField] == o[props.labelField];
            }) === -1
          );
        })
        .map((o: any) => {
          return {
            ...o,
            appendData: true,
          };
        }) || []),
    ];
  }
}

// 监听props.appendOptions的变化，当追加选项改变时，更新options值
watch(
  () => props.appendOptions,
  () => {
    parseOptions();
  },
  {
    deep: true,
    immediate: true,
  },
);

watch(
  () => props.bindOptions,
  () => {
    if (props.bindOptions && props.bindOptions.length > 0) {
      options.value = filterByQuery(props.bindOptions);
      parseOptions();
    } else {
      options.value = [];
    }
  },
  {
    deep: true,
    immediate: true,
  },
);

function checkAllQuery() {
  if (props.needAllQueryParams) {
    const queryData = props.query?.();
    if (isArray(queryData)) {
      for (let i = 0; i < queryData.length; i++) {
        if (isEmpty(queryData[i])) {
          options.value = [];
          return false;
        }
      }
    } else {
      const keys = Object.keys(queryData);
      for (let i = 0; i < keys.length; i++) {
        if (isEmpty(queryData[keys[i]])) {
          options.value = [];
          return false;
        }
      }
    }
  }
  return true;
}

function watchInitFun() {
  if (checkAllQuery()) {
    if (props.api || props.dict) {
      initOptions();
    } else {
      if (props.componentType) {
        useComponent.value = props.componentType;
      }
      options.value = filterByQuery(props.bindOptions);
      parseOptions();
    }
  }
}

// 监听props.query的变化，当查询参数改变时，初始化选项配置
watch(
  props.query,
  () => {
    watchInitFun();
  },
  {
    immediate: true,
  },
);

watch(
  () => props.dict,
  () => {
    watchInitFun();
  },
);

function treeNodeClick(node: any) {
  if ((!props.multiple && !node.children) || node.children?.length === 0) {
    model.value = node[props.valueField];
    label.value = node[props.labelField];
  }
}

// 定义暴露的方法，允许外部访问
defineExpose({ getSelectData });
</script>

<template>
  <template v-if="useComponent === 'ElSelect'">
    <!-- 使用Element UI的Select组件，允许清除选择，并且支持过滤 -->
    <el-select
      v-bind="attrs"
      v-model="model"
      :loading="loading"
      :clearable="true"
      collapse-tags
      collapse-tags-tooltip
      filterable
      :multiple="multiple"
      @change="changeSelect"
    >
      <!-- 动态生成选项，每个选项的标识和显示文本由对应字段决定 -->
      <el-option
        v-for="item in options"
        :key="item[props.valueField]"
        :label="item[props.labelField]"
        :value="item[props.valueField]"
      />
    </el-select>
  </template>
  <template v-else-if="useComponent === 'ElTreeSelect'">
    <el-tree-select
      v-bind="attrs"
      v-model="model"
      :node-key="valueField"
      :props="{
        label: labelField,
      }"
      :highlight-current="true"
      :multiple="multiple"
      :data="options"
      @node-click="treeNodeClick"
    />
  </template>
  <template v-else>
    <el-select-v2
      v-bind="attrs"
      v-model="model"
      :clearable="true"
      filterable
      :collapse-tags-tooltip="true"
      popper-class="selectV2Class"
      :options="options"
      :multiple="multiple"
      :props="{
        value: valueField,
        label: labelField,
      }"
      @change="changeSelect"
    />
  </template>
</template>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
