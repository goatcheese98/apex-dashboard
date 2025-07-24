# API Mocking Guide for Your Vue Application

Welcome to the API Mocking guide! This is one of the most powerful concepts in testing. Mastering it will give you the ability to test your components in a fast, predictable, and reliable way, no matter what the network or your backend servers are doing.

## 1. The Concept: What is API Mocking?

**The Vibe:** Imagine your component needs to display data from a server. In a real-world scenario, it makes an API call. But in a test, we don't want to do that. Why?

*   **It's Slow:** Real network requests take time.
*   **It's Unreliable:** The server could be down, the network could be flaky, or the data could change. This makes your tests fail for reasons that have nothing to do with your component's code.
*   **It's Hard to Test Edge Cases:** How do you test what your component does when the API call fails? Or when it returns empty data? You can't just ask the server to fail for you.

**API Mocking is the solution.** It's the process of replacing your real API client (in your case, the `mcpClient`) with a "fake" or "mock" version during a test. This fake version doesn't make any real network calls. Instead, you tell it exactly what data to return, when to return it, and how to behave.

## 2. Your Mocking Toolkit: `vi.mock`

Vitest, your test runner, has a built-in function called `vi.mock` that makes this incredibly easy. It intercepts any attempt to import a specific module and gives you a fake version instead.

We will use it to mock your `src/services/mcpClient.ts` file.

## 3. How to Mock Your `mcpClient`

Let's imagine you have a component, `TournamentList.vue`, that imports `mcpClient` and calls `getTournaments()` to display a list of tournaments.

Here’s how you would write a test for it.

### Step 1: The Test File Setup

In your test file (e.g., `TournamentList.spec.ts`), the first thing you do is call `vi.mock`.

```typescript
import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TournamentList from './TournamentList.vue'; // The component we are testing

// This is the magic part!
// Tell Vitest that whenever any code imports mcpClient, it should get our fake version instead.
vi.mock('@/services/mcpClient', () => ({
  mcpClient: {
    getTournaments: vi.fn(), // We are mocking the getTournaments function
    getTournamentDetails: vi.fn(), // It's good practice to mock all methods
  }
}));

// We need to import the real mcpClient *after* the mock is set up.
import { mcpClient } from '@/services/mcpClient';
```

**Key Points:**

*   `vi.mock` takes the path to the module you want to fake.
*   We provide a factory function that returns an object. This object is our mock. It needs to have the same shape as the real module.
*   `vi.fn()` creates a special mock function that we can control and spy on.

### Step 2: Writing the Tests

Now you can write tests for different scenarios by controlling what the mocked `getTournaments` function does.

#### Scenario 1: The API call is successful

```typescript
describe('TournamentList.vue', () => {

  it('displays a list of tournaments when the API call is successful', async () => {
    // Arrange: Define our fake data
    const mockTournaments = [
      { id: 't1', name: 'Apex Invitational' },
      { id: 't2', name: 'Vibe Coders Championship' }
    ];

    // Arrange: Tell our mock function what to return
    // We use mockResolvedValueOnce because the function is async (it returns a Promise)
    vi.mocked(mcpClient.getTournaments).mockResolvedValueOnce(mockTournaments);

    // Act: Mount the component. It will call getTournaments in its setup.
    const wrapper = mount(TournamentList);

    // We need to wait for the component to update after the promise resolves.
    // await flushPromises(); // You might need a helper for this

    // Assert: Check that the component has rendered the tournament names.
    const text = wrapper.text();
    expect(text).toContain('Apex Invitational');
    expect(text).toContain('Vibe Coders Championship');
  });

});
```

#### Scenario 2: The API call fails

```typescript
  it('displays an error message when the API call fails', async () => {
    // Arrange: Tell the mock function to reject with an error
    vi.mocked(mcpClient.getTournaments).mockRejectedValueOnce(new Error('Network Error'));

    // Act
    const wrapper = mount(TournamentList);
    // await flushPromises();

    // Assert: Check that an error message is shown
    expect(wrapper.find('.error-message').exists()).toBe(true);
    expect(wrapper.text()).toContain('Sorry, something went wrong.');
  });
```

## 4. Key Takeaways & Best Practices

*   **Mock at the Top:** Always call `vi.mock` at the very top of your test file, before any imports.
*   **Control, Don't Assume:** In each test, explicitly define what your mocked functions should return. This makes your tests clear and predictable.
*   **Test All States:** For any component that fetches data, you should have at least three tests:
    1.  The "happy path" when the data loads successfully.
    2.  The loading state (e.g., does it show a spinner?).
    3.  The error state when the API call fails.
*   **`vi.mocked(...)`:** This is a helper that gives you type-safe access to the mock implementation (like `.mockResolvedValueOnce`).

By following this guide, you can now test any component that relies on your `mcpClient` service with confidence. You have complete control over the API, allowing you to create a stable and robust test suite.
