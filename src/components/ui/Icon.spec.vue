import { describe, it, expect } from 'vitest'; import { mount } from
'@vue/test-utils'; import Icon from './Icon.vue'; Group related tests with
`describe` describe('Icon.vue', () => { // 3. Write a specific test with `it`
it('renders the correct icon when a name prop is passed', () => { // Arrange:
Mount the component with a prop const wrapper = mount(Icon, { props: { name:
'test-icon' } }); // Act: Find the `
<i></i>
