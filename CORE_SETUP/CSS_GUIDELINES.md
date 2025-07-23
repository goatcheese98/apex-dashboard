# Modern CSS Architecture: Guidelines for 2025+

This document provides flexible guidelines for establishing a high-performance, scalable, and maintainable CSS architecture for modern web applications. These are recommendations, not rigid rules - adapt them to your project's specific needs.

## 1. Core Philosophy

*   **Performance & Developer Experience:** Balance fast user experiences with productive development workflows
*   **Utility-First with Components:** Use TailwindCSS utilities as the foundation, enhanced with component libraries where beneficial
*   **Pragmatic Flexibility:** Choose the right tool for each situation rather than forcing one approach everywhere
*   **Modern CSS Features:** Embrace native CSS capabilities like custom properties, container queries, and advanced selectors

## 2. Technology Stack Options

### Core Foundation
*   **Build Tool:** **Vite** (latest version) - Fast development and optimized production builds
*   **CSS Framework:** **TailwindCSS v4** - Modern utility-first styling with improved performance
*   **CSS Processing:** Built into Vite - PostCSS, autoprefixing, and optimizations included

### Component Library Enhancement (Recommended)
*   **DaisyUI v5+** - Semantic component library that works seamlessly with TailwindCSS
*   **Benefits:** Pre-built components, theme system, accessibility, faster development
*   **When to use:** Most projects benefit from DaisyUI's component foundation
*   **When to skip:** Highly custom designs or very simple static sites

## 3. File Structure Options

Choose the structure that works best for your project:

### Option A: Simple Structure (Recommended for most projects)
```
src/assets/main.css  // Single entry point with @theme and imports
```

### Option B: Organized Structure (For larger projects)
```
src/styles/
├── main.css              // Entry point
├── base.css               // Global styles and resets  
├── components.css         // Custom component styles
└── utilities.css          // Custom utility classes
```

### Option C: Advanced Structure (For complex applications)
```
src/styles/
├── main.css               // Entry point
├── theme/
│   ├── tokens.css         // Design tokens (@theme)
│   └── themes.css         // Multiple theme definitions
├── components/
│   ├── buttons.css        // Component-specific styles
│   └── cards.css
└── pages/                 // Route-specific styles (optional)
    ├── home.css
    └── dashboard.css
```

## 4. TailwindCSS v4 Setup & Configuration

### Basic Setup
```css
/* src/assets/main.css */
@import "tailwindcss";

/* Optional: Add DaisyUI */
@plugin "daisyui";
```

### Design Tokens with @theme
TailwindCSS v4 introduces the `@theme` directive for defining design tokens:

```css
@theme {
  /* Custom colors */
  --color-brand-primary: #3b82f6;
  --color-brand-secondary: #8b5cf6;
  
  /* Custom fonts */
  --font-family-brand: "Inter", sans-serif;
  
  /* Custom spacing */
  --spacing-xs: 0.125rem;
  --spacing-xl: 3rem;
}
```

### Configuration File (Minimal)
```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  // Most configuration now happens in CSS with @theme
}
```

## 5. DaisyUI Integration (Recommended)

### Installation
```bash
npm install -D daisyui@latest
```

### Setup
```css
/* src/assets/main.css */
@import "tailwindcss";
@plugin "daisyui" {
  themes: [
    "light",
    "dark", 
    {
      mytheme: {
        "primary": "#a991f7",
        "secondary": "#f6d860",
        "accent": "#37cdbe",
        "neutral": "#3d4451",
        "base-100": "#ffffff",
      }
    }
  ];
  darkTheme: "dark";
  base: true;
  styled: true;
  utils: true;
}
```

### Benefits
- **Semantic classes:** `btn`, `card`, `modal` instead of long utility chains
- **Built-in themes:** Easy light/dark mode switching
- **Accessibility:** WCAG compliant components out of the box
- **Consistency:** Unified design language across your app

## 6. Styling Approaches (Choose What Fits)

### Approach 1: Utility-First (Recommended)
```vue
<!-- Clean, explicit, fast to write -->
<button class="btn btn-primary px-6 py-2 rounded-lg hover:bg-blue-600">
  Click me
</button>
```

### Approach 2: Component Classes (DaisyUI)
```vue
<!-- Semantic, accessible, consistent -->
<button class="btn btn-primary">Click me</button>
<div class="card bg-base-100 shadow-xl">
  <div class="card-body">Content</div>
</div>
```

### Approach 3: Custom Components (When needed)
```css
/* For highly reusable, complex components */
.btn-cta {
  @apply bg-gradient-to-r from-blue-600 to-purple-600;
  @apply text-white font-bold py-3 px-8 rounded-xl;
  @apply hover:scale-105 transition-transform duration-200;
  @apply shadow-lg hover:shadow-xl;
}
```

### Approach 4: CSS-in-JS/Vue (For dynamic styles)
```vue
<script setup>
const dynamicStyles = computed(() => ({
  backgroundColor: `hsl(${props.hue}, 70%, 50%)`,
  transform: `rotate(${rotation.value}deg)`
}))
</script>
```

## 7. Performance Optimization (Automatic in v4)

TailwindCSS v4 handles most optimizations automatically:

- **Tree-shaking:** Unused styles are automatically removed
- **Minimal config:** Less configuration needed compared to v3
- **Modern CSS:** Uses native CSS features for better performance
- **Smaller bundles:** Improved architecture reduces bundle size

### Optional Advanced Optimizations
- **Critical CSS:** Only for very performance-sensitive applications
- **Route splitting:** Use Vite's built-in CSS code-splitting
- **Lazy loading:** Load theme-specific CSS on demand

## 8. Modern CSS Best Practices

### Embrace Modern Features
```css
/* Container queries for component-based responsive design */
@container (min-width: 400px) {
  .card { display: grid; grid-template-columns: 1fr 1fr; }
}

/* CSS Grid for complex layouts */
.dashboard {
  display: grid;
  grid-template-areas: "header header" "sidebar main";
  grid-template-rows: auto 1fr;
}

/* CSS custom properties for dynamic theming */
.theme-toggle {
  background: var(--color-primary);
  color: var(--color-on-primary);
}
```

### Progressive Enhancement
- Start with semantic HTML
- Add DaisyUI components for common patterns
- Enhance with Tailwind utilities for customization
- Use custom CSS only when necessary

## 9. Migration & Adoption Strategy

### For Existing Projects
1. **Gradual adoption:** Start with new components
2. **DaisyUI first:** Use components for common patterns
3. **Utility migration:** Replace custom CSS with utilities over time
4. **Team training:** Ensure everyone understands the new approach

### For New Projects
1. **Start with DaisyUI + TailwindCSS v4**
2. **Establish design tokens early**
3. **Create component library documentation**
4. **Set up automated testing for visual regressions**

---

*These guidelines are living recommendations. Adapt them based on your team's needs, project requirements, and evolving web standards. The goal is productive, maintainable, and performant CSS architecture.*