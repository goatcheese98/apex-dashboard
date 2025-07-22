Claude Development Guidelines
Welcome, Claude. When working on this project, you must adhere to the standards, conventions, and architectural patterns defined in the following files and workflows. These documents are the single source of truth for how we build this application.

Core Reference Files
VUE_RULEKIT.md: This file is your primary guide for all Vue.js development. It contains critical information on:

Project Structure: How to organize directories and files.

Component Patterns: The correct way to write Vue components using the Composition API, <script setup>, defineProps, defineEmits, and defineModel.

Coding Standards: Naming conventions, use of TypeScript, and general best practices.

Routing: File-based routing conventions with Vue Router.

State Management: Guidelines for using Pinia and Pinia Colada.

CSS_GUIDELINES.md: This file dictates our entire approach to styling and CSS architecture. Refer to it for:

CSS Framework: Strict use of Tailwind CSS as a utility-first framework.

Architecture: How to implement the Critical CSS strategy for optimal performance.

Design Tokens: The system for managing colors, spacing, and typography using CSS Custom Properties.

Custom CSS: When and how to write custom CSS, including the use of @apply and BEM naming conventions.

PROJECT_REQUIREMENTS.md: This is the master document for the application's features and goals. You must consult it for:

Project Vision: It outlines the specific requirements for the "Apex Legends Tournament Dashboard," our target application.

Core Features: It details the key functionalities to be built, including AI-powered analytics, dynamic race charts, and an interactive floating dock.

User Experience Goals: Defines the design philosophy, emphasizing a mobile-first, performance-focused, and intuitive user interface.

Development Roadmap: Provides a phased development plan that we must follow, starting with the foundational control system.

My Development Workflow: A Spec-Driven Approach
To ensure clarity and build my understanding, you will follow a structured, conversational workflow for all development tasks.

1. The Specification Phase (My Request → Your Plan)

Proactive Elaboration: When I provide a request, your first step is not to code, but to plan. You will analyze my query, expand on it with detailed suggestions, and outline a clear implementation plan.

Clarification and Confirmation: You will present this plan to me and ask for my confirmation. You may also ask follow-up questions to ensure you fully understand the requirements. Coding will only begin after I approve the plan.

2. The Implementation Phase (Building in Batches)

Once I approve the plan, you will implement the feature in logical, manageable batches. This allows for easier review and testing at each stage.

3. The Review Phase (Your Explanation)

After each implementation batch, you will provide a detailed write-up explaining:

What You Built: A clear summary of the code that was just added or changed.

The "Why": An explanation of the technical choices you made. This will directly reference the rules in our core reference files where applicable.

How It's Useful: A breakdown of how the new code contributes to the overall project and benefits me as the end-user.

Alternative Approaches: When relevant, you will briefly describe other methods that could have been used and explain why the chosen approach was better for our specific goals.

4. Code Iteration and Version Control

Safe Implementation Trials: When you need to try a new approach, you will completely comment out the previous implementation before writing the new code. This ensures the old code doesn't cause confusion or errors.

Code Cleanup: Once I confirm that I am satisfied with a new implementation, you will remind me to delete the old, commented-out code blocks to keep our codebase clean.

Saving Progress: After we successfully implement a significant feature or complete a major step, you will suggest that I push the changes to Git. This will help me save my progress regularly.

5. Handling Guideline Deviations

Acknowledge and Propose: If a specific feature from PROJECT_REQUIREMENTS.md cannot be built while strictly following a rule (e.g., in CSS_GUIDELINES.md), you must first state the conflict.

Update the Source of Truth: Before implementing the new approach, you must propose an update to the relevant guideline file. This ensures our documentation always reflects our actual implementation.

Implement After Approval: You will only proceed with the implementation after I have approved both the reason for the deviation and the proposed change to the guideline file.

This workflow ensures I am always in control and provides a continuous learning opportunity as we build the application together.
