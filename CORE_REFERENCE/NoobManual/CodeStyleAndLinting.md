# Code Style & Linting Guide

Welcome to your guide on Code Styling and Linting! This document will explain what these tools are, why they are incredibly helpful, and how to get them working perfectly in your project with the Zed editor.

## 1. The Concepts: What are Linting and Formatting?

Think of them as two separate tools that work together to keep your code clean and consistent.

### Code Formatter: **Prettier**

*   **What it is:** Prettier is an "opinionated code formatter." Its only job is to take your code and reprint it in a consistent, standardized way.
*   **Why it's great:** It ends all arguments about style (e.g., tabs vs. spaces, single vs. double quotes). You just write code, hit save, and Prettier makes it look perfect every time. This is a huge time-saver and makes the code easier for everyone to read.
*   **Your project has it:** Your `package.json` already includes Prettier and a script (`pnpm format`) to run it.

### Code Linter: **ESLint**

*   **What it is:** A linter analyzes your code to find potential bugs, style errors, and bad patterns. It's like a grammar checker for your code.
*   **Why it's great:** ESLint can catch common mistakes, like unused variables or code that will cause a crash. It helps you write better, more correct code *before* you even run it.
*   **Your project has it:** Your `package.json` includes ESLint and a `lint` script (`pnpm lint`). It's already configured to work with Vue and TypeScript.

**The Golden Rule:** Prettier handles *how your code looks* (the formatting), and ESLint handles *the quality and correctness of your code* (the patterns).

## 2. How They Work Together

We want to run them in a specific order:

1.  **First, Prettier:** Formats the entire file.
2.  **Then, ESLint:** Takes the newly formatted code and fixes any remaining issues it can.

This prevents them from fighting with each other. We configure this process to happen automatically every time you save a file in your editor.

## 3. Setting Up Zed for Automatic Formatting & Linting

Zed makes this setup very straightforward. You'll create a project-specific settings file that tells Zed exactly how to handle your TypeScript and Vue files.

### Step 1: Create the Zed Settings File

Create a new folder named `.zed` in the root of your project, and inside that folder, create a file named `settings.json`.

Your project structure should look like this:

```
.zed/
└── settings.json  <-- Your new settings file
```

### Step 2: Add the Configuration

Copy and paste the following JSON into your new `.zed/settings.json` file:

```json
{
  "languages": {
    "TypeScript": {
      "format_on_save": "on",
      "formatter": {
        "external": {
          "command": "pnpm",
          "arguments": [
            "exec",
            "prettier",
            "--stdin-filepath",
            "{buffer_path}"
          ]
        }
      },
      "code_actions_on_format": {
        "source.fixAll.eslint": true
      }
    },
    "Vue": {
      "format_on_save": "on",
      "formatter": {
        "external": {
          "command": "pnpm",
          "arguments": [
            "exec",
            "prettier",
            "--stdin-filepath",
            "{buffer_path}"
          ]
        }
      },
      "code_actions_on_format": {
        "source.fixAll.eslint": true
      }
    }
  }
}
```

### What This Configuration Does:

*   **`"format_on_save": "on"`**: This tells Zed to automatically format your code every time you save.
*   **`"formatter": { ... }`**: This section configures Prettier as your external formatter. It uses `pnpm exec prettier` to ensure it's using the version of Prettier from your project's `node_modules`.
*   **`"code_actions_on_format": { ... }`**: This is the magic part. It tells Zed to run ESLint's "fix all" command *after* Prettier has finished formatting. This cleans up any remaining auto-fixable issues.
*   **`"TypeScript"` and `"Vue"`**: We apply these settings to both TypeScript and Vue files, so you get consistent behavior everywhere.

## 4. Recommended Zed Extensions

Zed's philosophy is to have most features built-in, so you don't need to install as many extensions as you would in other editors. As of now, **you don't need to install any specific extensions for ESLint or Prettier**. Zed's built-in Language Server Protocol (LSP) support and the `settings.json` file you just created are all you need for this setup to work.

Just make sure you have ESLint and Prettier installed in your project's `package.json` (which you already do), and Zed will automatically pick them up.

And that's it! With this setup, your code will be beautifully formatted and checked for errors every time you save. This lets you stay in the "vibe" of coding without worrying about the small stuff.
