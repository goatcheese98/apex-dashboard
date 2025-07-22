# Testing Manual for Your Vue Application with Vitest

Welcome to your testing manual! This guide is designed for beginners and will walk you through everything you need to know to start writing effective tests for your Vue.js application using Vitest.

## 1. Core Testing Concepts: The "Why" and "How"

### What is Software Testing?

Software testing is the process of checking your code to ensure it does what it's supposed to do, and that it doesn't have any unintended side effects (bugs).

### Why is Testing Important?

*   **Confidence:** Tests act as a safety net. When you make changes or add new features, you can run your tests to instantly see if you've broken anything. This gives you the confidence to refactor and improve your code without fear.
*   **Quality:** A well-tested application is a higher-quality application. It has fewer bugs, leading to a better experience for your users.
*   **Documentation:** Tests describe how your code is supposed to behave. A new developer can read the tests for a component to understand its functionality.

### Types of Tests

1.  **Unit Tests:** These are small, focused tests that check a single, isolated piece of your code (a "unit"). This could be a single function or a component. They are fast and form the foundation of a good testing strategy.
2.  **Component Tests:** In a Vue application, these tests focus on a single component. You'll "mount" the component in a test environment and then interact with it just like a user would (e.g., clicking buttons, checking that text appears).
3.  **End-to-End (E2E) Tests:** These tests simulate a full user journey through your application. They are slower and more complex but are essential for verifying that all the different parts of your app work together correctly. Your project is set up with Playwright for this.

### The "Arrange, Act, Assert" (AAA) Pattern

This is a simple and powerful pattern for structuring your tests:

1.  **Arrange:** Set up everything your test needs. This might involve creating a component, defining some initial data, or setting up a mock.
2.  **Act:** Perform the action you want to test. This could be calling a function, clicking a button, or dispatching a state management action.
3.  **Assert:** Check that the result is what you expected. Did the function return the correct value? Did the component update its display correctly?

## 2. Your Testing Toolkit: Vitest

Your project uses **Vitest**, a modern test runner designed specifically for Vite projects. It's fast, simple, and has great support for Vue.js.

### How to Run Your Tests

You have three main commands for running tests, defined in your `package.json`:

*   `pnpm test`: Runs all tests in your project in the terminal.
*   `pnpm test:ui`: Starts Vitest in a special "UI mode" in your browser. This is highly recommended for beginners, as it gives you a visual interface to see your tests, re-run them individually, and debug them.
*   `pnpm coverage`: Runs your tests and then generates a report showing how much of your code is covered by them.

## 3. Writing Your First Component Test

Let's write a test for your `src/components/ui/Icon.vue` component.

### Step 1: Install Dependencies

Before you can mount your components for testing, you need to install the official Vue Test Utils library. Run the following command in your terminal:

```bash
pnpm add -D @vue/test-utils
```

This adds the necessary tools to your project's development dependencies.

### Step 2: Create the Test File

First, create a new file right next to your `Icon.vue` component. Name it `Icon.spec.ts`. The `.spec.ts` extension is a convention that Vitest recognizes as a test file.

Your directory structure should look like this:

```
src/
└── components/
    └── ui/
        ├── Icon.vue
        └── Icon.spec.ts  <-- Your new test file
```

### Step 3: Write the Test Code

Now that you've created the file, open `Icon.spec.ts` and add the following code. This version is based on the actual structure of your `Icon.vue` component.

```typescript
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Icon from './Icon.vue';

describe('Icon.vue', () => {
  it('renders the sun icon when name is "sun"', () => {
    // Arrange: Mount the component with the "sun" prop
    const wrapper = mount(Icon, {
      props: {
        name: 'sun'
      }
    });
    // Act: Find the <svg> element
    const svgElement = wrapper.find('svg');

    // Assert: Check that the <svg> element exists
    expect(svgElement.exists()).toBe(true);
  });

  it('applies custom classes when a class prop is provided', () => {
    // Arrange: Mount the component with a custom class
    const wrapper = mount(Icon, {
      props: {
        name: 'palette',
        class: 'custom-class'
      }
    });

    // Assert: Check that the root element's class list contains the custom class
    expect(wrapper.classes()).toContain('custom-class');
  });

  it('does not render any svg when the name prop is invalid', () => {
    // Arrange: Mount the component with an invalid name
    const wrapper = mount(Icon, {
        props: {
            name: 'an-invalid-icon-name'
        }
    });

    // Assert: Check that no <svg> element exists
    expect(wrapper.find('svg').exists()).toBe(false);
  });
});
```

### Breakdown of the Correct Test Code:

*   **`import { describe, it, expect } from 'vitest';`**: These are the core functions from Vitest.
*   **`import { mount } from '@vue/test-utils';`**: This utility lets us mount our component in an isolated test environment.
*   **`const wrapper = mount(Icon, ...)`**: This is the "Arrange" step. We create a `wrapper` around the `Icon` component, passing it the necessary `props`.
*   **`wrapper.find('svg')`**: This is how we find elements within our mounted component. Since your component renders `<svg>` tags for icons, this is the correct selector to use.
*   **`expect(svgElement.exists()).toBe(true)`**: This is the "Assert" step. We check that the `find` operation successfully located an `<svg>` element.
*   **`wrapper.classes()`**: This method returns an array of the classes on the component's root element (the `<span>`). We can then assert that our expected class is present.

### Step 4: Run the Test

Now, open your terminal and run:

```bash
pnpm test:ui
```

This will open a new tab in your browser. You should see your `Icon.spec.ts` file and the three tests within it, all passing with green checkmarks. Congratulations, you've just written your first *working* component tests!

## 4. Advanced Concepts for Scaling

### Mocking

Sometimes, your components will have dependencies on external things, like an API call or a Pinia store. In a unit test, you want to isolate the component, so you don't want to make a real API call. This is where **mocking** comes in.

Mocking is the process of creating a "fake" version of a dependency that you can control in your test.

**Example:** If a component fetches data from an API when it's created, you can mock that API call to instantly return fake data. This makes your test faster and more reliable.

Vitest has powerful mocking capabilities built-in. You can use `vi.mock` to replace a module with your own fake implementation.

### Testing Pinia Stores

You can also test your Pinia stores directly. You would import the store, set its initial state, call its actions, and then assert that the state has changed as you expect.

### Best Practices

*   **Organize Your Tests:** Keep your test files next to the files they are testing. This makes them easy to find.
*   **Write Descriptive Names:** `it('should do this when that happens')` is much better than `it('test 1')`. Your test names should clearly explain the scenario.
*   **One Assertion Per Test:** Try to stick to one `expect` call per test. This makes it easier to see exactly what failed if a test breaks.
*   **Test Behavior, Not Implementation:** Don't test *how* a component does something, test *what* it does from a user's perspective. For example, instead of checking that a `data` property has a certain value, check that the correct text is rendered on the screen.

This manual should give you a strong foundation. The best way to learn is by doing, so I encourage you to try writing tests for your other components. Start simple, and don't be afraid to experiment!
