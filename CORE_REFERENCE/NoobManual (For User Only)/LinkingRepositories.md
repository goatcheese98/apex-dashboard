# Linking Repositories: Your Guide to ComponentForge

Welcome to the guide on linked repositories! This is a slightly more advanced topic, but it's a powerful pattern used in professional software development. Understanding this will give you insight into how large projects are built and maintained.

## 1. The "Why": Why Have a Separate Repository for Components?

You've noticed that this `apex-dashboard` project is designed to work with another project called `component-forge`. This isn't an accident; it's a deliberate architectural choice.

Imagine you're building not just one, but three different dashboards for three different games. They all need buttons, charts, and menus. You have two options:

1.  **The "Copy-Paste" Method:** You build a really nice button in the first project. When you start the second project, you copy and paste the button's code over. When you start the third, you do it again.
2.  **The "Shared Library" Method:** You build the button once, in a central, shared project (a "component library"). Then, all three of your dashboard projects simply *use* that button from the central library.

The "Shared Library" method is what we're doing with `ComponentForge`.

### The Core Benefits:

*   **Reusability:** You write a component once and use it everywhere. This saves a massive amount of time and effort.
*   **Consistency:** All your projects will have a consistent look and feel because they are all using the exact same set of UI components. A button in the Apex dashboard will look and behave exactly like a button in a theoretical Valorant dashboard.
*   **Independent Development:** A dedicated team (or you, on a different day) can focus solely on improving the components in `ComponentForge` without needing to run the entire `apex-dashboard` application. They can test the components in isolation.
*   **Easier Maintenance:** If you find a bug in your button component, you fix it in *one place* (`ComponentForge`). Once you update the library in your other projects, the fix is applied everywhere. No more hunting down every place you copy-pasted the code!

## 2. The "How": How Does it Work in Your Project?

In a professional setup, `ComponentForge` would be published as a private package (e.g., on npm or GitHub Packages). Your `apex-dashboard` would then install it just like any other dependency (e.g., `pnpm install @your-org/component-forge`).

However, for local development, you can use a feature of your package manager (like `pnpm` or `yarn`) called **workspaces** or **linked packages**. This lets you have both the `apex-dashboard` and `component-forge` projects in the same parent folder on your computer. You can then tell `pnpm` to "link" them.

This way, any changes you make in `component-forge` are *instantly* available in `apex-dashboard` without you needing to publish and reinstall anything.

### Your Router: A Concrete Example

Take a look at your `src/router/index.ts` file:

```typescript
// ... other imports
const devRoutes = [
  // ... other dev routes
  {
    path: '/library',
    name: 'library',
    component: () => import('component-forge/src/views/Library.vue'), // <-- This is the link!
    meta: { isDev: true }
  },
  {
    path: '/lab',
    name: 'lab',
    component: () => import('component-forge/src/views/Lab.vue'), // <-- And another one!
    meta: { isDev: true }
  },
]
// ...
```

This code is directly importing Vue components from a path that looks like it's in `node_modules`. If `component-forge` were linked correctly, `pnpm` would ensure that the path `component-forge/src/views/Library.vue` points directly to the `Library.vue` file in your local `component-forge` project folder.

This allows you to have a "showcase" or "library" page inside your `apex-dashboard` that displays all the components from `ComponentForge`. It's the perfect way to see all your UI pieces in one place.

## 3. Key Takeaways

*   **`ComponentForge` is your shared UI library.** It's where you will build all your generic, reusable Vue components (buttons, cards, icons, etc.).
*   **`apex-dashboard` is your application.** It consumes the components from `ComponentForge` to build its specific pages and features.
*   This separation is a best practice that promotes **reusability, consistency, and easier maintenance.**
*   For local development, you can use **linked packages** to make changes in your library and see them immediately in your application.

This approach might seem like overkill for a single project, but it's a fundamental concept in modern web development. By building your project this way, you're not just learning how to build a dashboard; you're learning how to build a scalable, maintainable system that can grow and adapt over time.
