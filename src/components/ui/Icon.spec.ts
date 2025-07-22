import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Icon from './Icon.vue';

describe('Icon.vue', () => {
  it('renders the sun icon when name is "sun"', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'sun'
      }
    });
    // Check if the svg for the sun icon is rendered
    expect(wrapper.find('svg').exists()).toBe(true);
    // You could add a more specific check here if you add a data-testid to your svg
  });

  it('renders the moon icon when name is "moon"', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'moon'
      }
    });
    expect(wrapper.find('svg').exists()).toBe(true);
  });

  it('applies default classes when no class prop is provided', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'gaming'
      }
    });
    expect(wrapper.classes()).toContain('w-4');
    expect(wrapper.classes()).toContain('h-4');
  });

  it('applies custom classes when a class prop is provided', () => {
    const wrapper = mount(Icon, {
      props: {
        name: 'palette',
        class: 'custom-class'
      }
    });
    expect(wrapper.classes()).toContain('custom-class');
  });

  it('does not render any svg when the name prop is not a valid icon name', () => {
    const wrapper = mount(Icon, {
        props: {
            name: 'an-invalid-icon-name'
        }
    });
    expect(wrapper.find('svg').exists()).toBe(false);
  });
});