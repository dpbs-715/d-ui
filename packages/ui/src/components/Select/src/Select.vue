<script setup lang="ts">
import { useAttrs, ref, watch } from 'vue';
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

// 用于触发自定义事件
const emits = defineEmits(['changeObj', 'optionsReady']);

// 获取组件的其他属性
const attrs: any = useAttrs();

// 用于存储选项数据的响应式引用
const options = ref<any[]>([]);

// 定义组件的数据模型，用于存储选中的值和标签
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

const loading = ref(false);

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
 * @param {any} value - 当前选中的值，对于多选来说是被选中的值的数组
 * @returns {Object|Array|null} - 返回找到的选项对象或数组，如果没有找到则返回null
 */
function getSelectData(value?: any) {
  // 如果不是多选，直接使用当前选中的值或model.value来查找选项
  if (!props.multiple) {
    return (
      options.value.find((item: any) => item[props.valueField] === (value || model.value)) || null
    );
  } else {
    return (
      options.value.filter((item: any) => {
        return model.value?.indexOf(item[props.valueField]) > -1;
      }) || []
    );
  }
}

// 如果属性对象中提供了onWatchChange回调函数
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
      immediate: true,
    },
  );
}

/**
 * 对选项进行排序
 * @param options 选项数组
 */
function sortOptions(options: any[]) {
  const { orderBy, orderType } = props;
  if (orderBy) {
    options.sort((a: any, b: any) => {
      const compareValue = a[orderBy] - b[orderBy];
      return orderType === 'desc' ? -compareValue : compareValue;
    });
  }
}

/**
 * 根据查询条件过滤选项
 * @param localOptions 选项数组
 * @returns 过滤后的选项数组
 */
function filterByQuery(localOptions: any[]) {
  let query: any = {};
  if (props.query) {
    query = props.query();
  }

  // 如果没有查询条件，直接返回过滤掉忽略项的选项
  const keys = Object.keys(query);
  if (keys.length === 0) {
    return (
      localOptions?.filter((o: any) => props.ignoreByLabel.indexOf(o[props.labelField]) === -1) ||
      []
    );
  }

  return (
    localOptions?.filter((o: any) => {
      // 检查是否在忽略列表中
      if (props.ignoreByLabel.indexOf(o[props.labelField]) !== -1) {
        return false;
      }

      // 检查查询条件
      for (const key of keys) {
        let queryValueArr: any[] = [];
        if (Array.isArray(query[key])) {
          queryValueArr = query[key];
        } else if (typeof query[key] === 'string') {
          queryValueArr = query[key]?.split(',') || [];
        }

        let optionsValueArr: any[] = [];
        if (Array.isArray(o[key])) {
          optionsValueArr = o[key];
        } else if (typeof o[key] === 'string') {
          optionsValueArr = o[key]?.split(',') || [];
        }

        const has = optionsValueArr.some((item) => queryValueArr.includes(item));
        if (!has) {
          return false;
        }
      }

      return true;
    }) || []
  );
}

/**
 * 初始化选项数据
 */
async function initOptions() {
  try {
    loading.value = true;

    let localOptions: any[] = [];

    if (props.api) {
      // 通过API获取选项数据
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

      const res: any = await queryApi;

      // 根据响应数据更新选项数据
      if (props.parseData) {
        localOptions = props.parseData(res);
      } else {
        localOptions = res;
      }
      localOptions = localOptions?.filter(
        (o: any) => props.ignoreByLabel.indexOf(o[props.labelField]) === -1,
      );
    } else {
      if (props.dict && props.getDictOptions) {
        // 通过字典获取选项数据
        localOptions = await props.getDictOptions(props.dict);
      } else if (props.bindOptions?.length) {
        // 使用绑定的选项数据
        localOptions = [...props.bindOptions];
      }

      // 处理选项数据
      localOptions = filterByQuery(localOptions);
    }

    sortOptions(localOptions);

    // 确定使用的组件类型
    determineComponentType(localOptions);

    // 处理追加选项
    localOptions = handleAppendOptions(localOptions);

    // 处理值类型转换
    processValueType(localOptions);

    // 自动选择第一个选项
    selectFirst();

    emits('optionsReady', localOptions);
  } catch (err) {
    console.error(err);
    // 如果请求失败，设置默认的选项数据
    options.value = [{ [props.labelField]: '未知数据', [props.valueField]: 0 }];
  } finally {
    loading.value = false;
  }
}

/**
 * 确定使用的组件类型
 * @param localOptions 选项数组
 */
function determineComponentType(localOptions: any[]) {
  if (props.componentType) {
    useComponent.value = props.componentType;
  } else {
    useComponent.value = localOptions?.length > 50 ? 'ElSelectV2' : 'ElSelect';
  }
}

/**
 * 处理值类型转换
 * @param localOptions 选项数组
 */
function processValueType(localOptions: any[]) {
  if (props.valueType || props.joinSplit) {
    if (props.valueType === 'string' || props.valueType === 'String' || props.joinSplit) {
      options.value = localOptions.map((o: any) => ({
        ...o,
        [props.valueField]: String(o[props.valueField]),
      }));
    } else if (props.valueType === 'int' || props.valueType === 'Int') {
      options.value = localOptions.map((o: any) => ({
        ...o,
        [props.valueField]: Number(o[props.valueField]),
      }));
    } else {
      options.value = localOptions;
    }
  } else {
    options.value = localOptions;
  }
}

/**
 * 处理追加选项
 * @param localOptions 当前选项数组
 * @returns 处理后的选项数组
 */
function handleAppendOptions(localOptions: any[]) {
  if (!props.appendOptions) {
    return localOptions;
  }

  // 过滤掉已标记为追加的数据
  const filteredOptions = localOptions.filter((o: any) => !o.appendData);

  // 获取要追加的选项
  let appendOptions: any[] = [];
  if (isFunction(props.appendOptions)) {
    appendOptions = props.appendOptions();
  } else {
    appendOptions = props.appendOptions || [];
  }

  // 过滤并标记追加的选项
  const processedAppendOptions =
    appendOptions
      .filter((o: any) => {
        return (
          o[props.valueField] &&
          filteredOptions.findIndex((z: any) => z[props.labelField] == o[props.labelField]) === -1
        );
      })
      .map((o: any) => ({
        ...o,
        appendData: true,
      })) || [];

  // 合并选项
  return [...filteredOptions, ...processedAppendOptions];
}

/**
 * 自动选择第一个选项
 */
function selectFirst() {
  // 判断选项存在且数量为一个，并且配置了自动选择第一个选项
  if (options.value?.length === 1 && props.autoSelectFirst) {
    const firstOption = options.value[0];
    const firstValue = firstOption[props.valueField];

    // 设置模型的值为第一个选项的值
    model.value = firstValue;

    // 触发选择事件，传递第一个选项的值
    changeSelect(firstValue);

    if (attrs.onChange) {
      if (Array.isArray(attrs.onChange)) {
        attrs.onChange.forEach((changeFun: any) => {
          changeFun(firstValue);
        });
      } else {
        attrs.onChange(firstValue);
      }
    }
  }
}

/**
 * 检查是否所有查询参数都已提供
 * @returns {boolean} 是否所有查询参数都已提供
 */
function checkAllQuery(): boolean {
  if (!props.needAllQueryParams) {
    return true;
  }

  const queryData = props.query?.() || {};

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

  return true;
}

/**
 * 监听初始化函数
 */
function watchInitFun() {
  if (checkAllQuery()) {
    initOptions();
  }
}

function treeNodeClick(node: any) {
  if ((!props.multiple && !node.children) || node.children?.length === 0) {
    model.value = node[props.valueField];
    label.value = node[props.labelField];
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

// 监听字典变化
watch(
  () => props.dict,
  () => {
    watchInitFun();
  },
);

// 监听追加选项变化
watch(
  () => props.appendOptions,
  () => {
    if (options.value.length > 0) {
      options.value = handleAppendOptions(options.value);
    }
  },
  {
    deep: true,
  },
);

// 监听绑定选项变化
watch(
  () => props.bindOptions,
  () => {
    if (props.bindOptions?.length) {
      options.value = filterByQuery(props.bindOptions);
      processValueType(options.value);
      options.value = handleAppendOptions(options.value);
    } else {
      options.value = [];
    }
  },
  {
    deep: true,
  },
);

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
