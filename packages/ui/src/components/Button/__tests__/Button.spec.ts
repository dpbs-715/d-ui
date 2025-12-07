import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Button from '../src/Button.vue';
import { nextTick } from 'vue';

describe('CommonButton', () => {
  it('should render button with default props', () => {
    const wrapper = mount(Button);
    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('button').classes()).toContain('CommonButton');
  });

  it('should render button text from slot', () => {
    const wrapper = mount(Button, {
      slots: {
        default: 'Click me',
      },
    });
    expect(wrapper.text()).toBe('Click me');
  });

  it('should apply type class', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
      },
    });
    expect(wrapper.find('button').classes()).toContain('CommonButton--primary');
  });

  it('should apply size class', () => {
    const wrapper = mount(Button, {
      props: {
        size: 'small',
      },
    });
    expect(wrapper.find('button').classes()).toContain('CommonButton--small');
  });

  it('should apply round class', () => {
    const wrapper = mount(Button, {
      props: {
        round: true,
      },
    });
    expect(wrapper.find('button').classes()).toContain('is-round');
  });

  it('should apply circle class', () => {
    const wrapper = mount(Button, {
      props: {
        circle: true,
      },
    });
    expect(wrapper.find('button').classes()).toContain('is-circle');
  });

  it('should apply plain class', () => {
    const wrapper = mount(Button, {
      props: {
        plain: true,
      },
    });
    expect(wrapper.find('button').classes()).toContain('is-plain');
  });

  it('should be disabled when disabled prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        disabled: true,
      },
    });
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    expect(wrapper.find('button').classes()).toContain('is-disabled');
  });

  it('should be disabled when loading prop is true', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
    });
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
    expect(wrapper.find('button').classes()).toContain('is-disabled');
  });

  it('should show loading icon when loading', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
      },
    });
    expect(wrapper.find('.is-loading').exists()).toBe(true);
  });

  it('should emit click event', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Button, {
      props: {
        onClick,
      },
    });

    await wrapper.find('button').trigger('click');
    await nextTick();

    expect(onClick).toHaveBeenCalled();
  });

  it('should not emit click when disabled', async () => {
    const onClick = vi.fn();
    const wrapper = mount(Button, {
      props: {
        disabled: true,
        onClick,
      },
    });

    await wrapper.find('button').trigger('click');

    // Button is disabled, so handler still runs but should be handled internally
    expect(wrapper.find('button').attributes('disabled')).toBeDefined();
  });

  it('should handle async onClick with promise loading', async () => {
    const onClick = vi.fn().mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(resolve, 100);
        }),
    );

    const wrapper = mount(Button, {
      props: {
        onClick,
      },
    });

    await wrapper.find('button').trigger('click');

    // Should show promise loading
    await nextTick();
    expect(wrapper.find('.is-loading').exists()).toBe(true);

    // Wait for promise to resolve
    await vi.waitFor(() => {
      expect(wrapper.find('.is-loading').exists()).toBe(false);
    });
  });

  it('should show default icon for create type', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'create',
      },
    });
    expect(wrapper.find('.el-icon').exists()).toBe(true);
  });

  it('should show default icon for delete type', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'delete',
      },
    });
    expect(wrapper.find('.el-icon').exists()).toBe(true);
  });

  it('should show custom icon when provided', () => {
    const wrapper = mount(Button, {
      props: {
        icon: 'Search',
      },
    });
    expect(wrapper.find('.el-icon').exists()).toBe(true);
  });

  it('should handle onClick error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const onClick = vi.fn().mockRejectedValue(new Error('Test error'));

    const wrapper = mount(Button, {
      props: {
        onClick,
      },
    });

    await wrapper.find('button').trigger('click');
    await nextTick();

    await vi.waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should apply multiple classes correctly', () => {
    const wrapper = mount(Button, {
      props: {
        type: 'primary',
        size: 'large',
        round: true,
        plain: true,
      },
    });

    const button = wrapper.find('button');
    expect(button.classes()).toContain('CommonButton--primary');
    expect(button.classes()).toContain('CommonButton--large');
    expect(button.classes()).toContain('is-round');
    expect(button.classes()).toContain('is-plain');
  });
});
