import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { ElForm, ElFormItem, ElRow, ElCol } from 'element-plus';

// Mock CreateComponent to avoid circular dependency issues
vi.mock('~/components/CreateComponent', () => ({
  CreateComponent: defineComponent({
    name: 'MockCreateComponent',
    props: {
      config: Object,
      modelValue: [String, Number, Boolean, Object, Array],
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
      return () =>
        h('input', {
          value: props.modelValue,
          onChange: (e: any) => emit('update:modelValue', e.target.value),
          class: 'mock-create-component',
        });
    },
  }),
  componentDefaultPropsMap: {
    CommonForm: {
      labelWidth: 'auto',
      col: { sm: 24, md: 12, lg: 8, xl: 6 },
    },
  },
}));

// Mock utility functions
vi.mock('~/_utils/componentUtils.ts', () => ({
  configIterator: vi.fn(),
  getRules: vi.fn((item) => item.rules || []),
  isHidden: vi.fn((item) => {
    if (typeof item.hidden === 'function') {
      return item.hidden({ formData: {} });
    }
    return !!item.hidden;
  }),
}));

// Mock DataHandlerClass
vi.mock('~/_utils/dataHandlerClass.ts', () => ({
  DataHandlerClass: class {
    afterInit = () => {};
    initOptions = () => {};
    getLabelByValue = () => '';
  },
}));

import Form from '../src/Form.vue';
import type { CommonFormConfig } from '../src/Form.types';

describe('CommonForm', () => {
  describe('Basic rendering', () => {
    it('should render form with default props', () => {
      const wrapper = mount(Form, {
        props: {
          config: [],
          modelValue: {},
        },
      });

      expect(wrapper.find('.commonForm').exists()).toBe(true);
      expect(wrapper.findComponent(ElForm).exists()).toBe(true);
    });

    it('should render form with basic config', () => {
      const config: CommonFormConfig[] = [
        {
          field: 'username',
          label: 'Username',
          component: 'input',
        },
        {
          field: 'email',
          label: 'Email',
          component: 'input',
        },
      ];

      const wrapper = mount(Form, {
        props: {
          config,
          modelValue: {},
        },
      });

      const formItems = wrapper.findAllComponents(ElFormItem);
      expect(formItems.length).toBeGreaterThanOrEqual(2);
    });

    it('should apply form props correctly', () => {
      const wrapper = mount(Form, {
        props: {
          config: [],
          modelValue: {},
          labelPosition: 'top',
          labelWidth: '120px',
          size: 'large',
        },
      });

      const elForm = wrapper.findComponent(ElForm);
      expect(elForm.props('labelPosition')).toBe('top');
      expect(elForm.props('labelWidth')).toBe('120px');
      expect(elForm.props('size')).toBe('large');
    });
  });

  describe('Form data binding', () => {
    it('should bind modelValue to form data', () => {
      const config: CommonFormConfig[] = [
        {
          field: 'name',
          label: 'Name',
          component: 'input',
        },
      ];

      const modelValue = { name: 'John' };

      const wrapper = mount(Form, {
        props: {
          config,
          modelValue,
        },
      });

      const elForm = wrapper.findComponent(ElForm);
      expect(elForm.props('model')).toEqual({ name: 'John' });
    });
  });

  describe('Form validation', () => {
    it('should apply validation rules to form items', () => {
      const config: CommonFormConfig[] = [
        {
          field: 'email',
          label: 'Email',
          component: 'input',
          rules: [
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email format' },
          ],
        },
      ];

      const wrapper = mount(Form, {
        props: {
          config,
          modelValue: {},
        },
      });

      const formItem = wrapper.findComponent(ElFormItem);
      expect(formItem.exists()).toBe(true);
      // Rules are applied, we can check if the form item has rules prop
      expect(formItem.props('rules')).toBeDefined();
    });
  });

  describe('Responsive layout', () => {
    it('should apply default col configuration', () => {
      const config: CommonFormConfig[] = [
        {
          field: 'name',
          label: 'Name',
          component: 'input',
        },
      ];

      const wrapper = mount(Form, {
        props: {
          config,
          modelValue: {},
          col: {
            sm: 24,
            md: 12,
            lg: 8,
            xl: 6,
          },
        },
      });

      const elCol = wrapper.findComponent(ElCol);
      expect(elCol.exists()).toBe(true);
      expect(elCol.props('sm')).toBe(24);
      expect(elCol.props('md')).toBe(12);
      expect(elCol.props('lg')).toBe(8);
      expect(elCol.props('xl')).toBe(6);
    });

    it('should override col span with item-specific span', () => {
      const config: CommonFormConfig[] = [
        {
          field: 'fullWidth',
          label: 'Full Width',
          component: 'input',
          span: 24,
        },
      ];

      const wrapper = mount(Form, {
        props: {
          config,
          modelValue: {},
          col: {
            sm: 12,
            md: 12,
            lg: 12,
            xl: 12,
          },
        },
      });

      const elCol = wrapper.findComponent(ElCol);
      // xl should use the item's span
      expect(elCol.props('xl')).toBe(24);
    });
  });

  describe('Hidden fields', () => {
    it('should hide field when hidden is true', () => {
      const config: CommonFormConfig[] = [
        {
          field: 'visible',
          label: 'Visible',
          component: 'input',
        },
        {
          field: 'hidden',
          label: 'Hidden',
          component: 'input',
          hidden: true,
        },
      ];

      const wrapper = mount(Form, {
        props: {
          config,
          modelValue: {},
        },
      });

      const cols = wrapper.findAllComponents(ElCol);
      // Only visible field should be rendered
      expect(cols.length).toBe(1);
    });
  });

  describe('Loading state', () => {
    it('should show skeleton when loading', () => {
      const config: CommonFormConfig[] = [
        {
          field: 'name',
          label: 'Name',
          component: 'input',
        },
      ];

      const wrapper = mount(Form, {
        props: {
          config,
          modelValue: {},
          loading: true,
        },
      });

      const skeleton = wrapper.find('.el-skeleton');
      expect(skeleton.exists()).toBe(true);
    });

    it('should not show skeleton when not loading', () => {
      const config: CommonFormConfig[] = [
        {
          field: 'name',
          label: 'Name',
          component: 'input',
        },
      ];

      const wrapper = mount(Form, {
        props: {
          config,
          modelValue: {},
          loading: false,
        },
      });

      const skeleton = wrapper.find('.el-skeleton');
      expect(skeleton.exists()).toBe(false);
    });
  });

  describe('Slots', () => {
    it('should render custom field slot', () => {
      const config: CommonFormConfig[] = [
        {
          field: 'customField',
          label: 'Custom Field',
          component: 'input',
        },
      ];

      const wrapper = mount(Form, {
        props: {
          config,
          modelValue: {},
        },
        slots: {
          customField: '<div class="custom-slot">Custom Content</div>',
        },
      });

      expect(wrapper.find('.custom-slot').exists()).toBe(true);
      expect(wrapper.find('.custom-slot').text()).toBe('Custom Content');
    });

    it('should render moreCol slot for additional columns', () => {
      const config: CommonFormConfig[] = [
        {
          field: 'name',
          label: 'Name',
          component: 'input',
        },
      ];

      const wrapper = mount(Form, {
        props: {
          config,
          modelValue: {},
        },
        slots: {
          moreCol: '<div class="extra-col">Extra Column</div>',
        },
      });

      expect(wrapper.find('.extra-col').exists()).toBe(true);
    });
  });

  describe('FormItem props', () => {
    it('should apply custom formItemProps', () => {
      const config: CommonFormConfig[] = [
        {
          field: 'name',
          label: 'Name',
          component: 'input',
          formItemProps: {
            labelWidth: '150px',
            required: true,
          },
        },
      ];

      const wrapper = mount(Form, {
        props: {
          config,
          modelValue: {},
        },
      });

      const formItem = wrapper.findComponent(ElFormItem);
      expect(formItem.props('labelWidth')).toBe('150px');
      expect(formItem.props('required')).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty config array', () => {
      const wrapper = mount(Form, {
        props: {
          config: [],
          modelValue: {},
        },
      });

      expect(wrapper.findComponent(ElForm).exists()).toBe(true);
      expect(wrapper.findAllComponents(ElFormItem)).toHaveLength(0);
    });

    it('should handle undefined config', () => {
      const wrapper = mount(Form, {
        props: {
          modelValue: {},
        },
      });

      expect(wrapper.findComponent(ElForm).exists()).toBe(true);
    });

    it('should handle modelValue without config', () => {
      const wrapper = mount(Form, {
        props: {
          config: [],
          modelValue: { name: 'Test', email: 'test@example.com' },
        },
      });

      const elForm = wrapper.findComponent(ElForm);
      expect(elForm.props('model')).toEqual({ name: 'Test', email: 'test@example.com' });
    });
  });

  describe('Label rendering', () => {
    it('should render labels with colon suffix', () => {
      const config: CommonFormConfig[] = [
        {
          field: 'name',
          label: 'Name',
          component: 'input',
        },
      ];

      const wrapper = mount(Form, {
        props: {
          config,
          modelValue: {},
        },
      });

      const formItem = wrapper.findComponent(ElFormItem);
      expect(formItem.props('label')).toBe('Name:');
    });
  });

  describe('Integration', () => {
    it('should render complete form with multiple fields', () => {
      const config: CommonFormConfig[] = [
        {
          field: 'username',
          label: 'Username',
          component: 'input',
          rules: [{ required: true, message: 'Username is required' }],
        },
        {
          field: 'email',
          label: 'Email',
          component: 'input',
          rules: [
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Invalid email' },
          ],
        },
        {
          field: 'age',
          label: 'Age',
          component: 'input',
        },
      ];

      const modelValue = {
        username: '',
        email: '',
        age: '',
      };

      const wrapper = mount(Form, {
        props: {
          config,
          modelValue,
          labelPosition: 'top',
          col: {
            sm: 24,
            md: 12,
            lg: 8,
            xl: 6,
          },
        },
      });

      // Should render 3 fields
      const cols = wrapper.findAllComponents(ElCol);
      expect(cols.length).toBe(3);

      // Should have proper form structure
      expect(wrapper.findComponent(ElForm).exists()).toBe(true);
      expect(wrapper.findComponent(ElRow).exists()).toBe(true);
    });
  });
});
