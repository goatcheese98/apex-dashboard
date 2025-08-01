Claude Development Guidelines
Welcome, Claude. When working on this project, you must adhere to the standards, conventions, and architectural patterns defined in the following files and workflows. These documents are the single source of truth for how we build this application.

## Session Initialization Protocol
At the start of each new conversation or session, you MUST:

1. **Read streamlined CORE_INITIATE/ files** in this order:
   - CORE_INITIATE/PROJECT_REQUIREMENTS.md (complete project vision and core features)
   - CORE_INITIATE/DEVELOPMENT_STATE.md (current phase, progress, and user preferences)
   - CORE_INITIATE/TASKLIST.md (current progress and priorities)
   - CORE_INITIATE/PROJECT_DIRECTORY.md (latest directory tree)

2. **Check Chrome Dev Profile Connection**:
   - Note if Chrome dev profile is available on port 9222
   - Browser automation is available via `python3 scripts/project-manager.py` commands
   - No automatic navigation or screenshots needed - browser state is persistent

3. **Confirm your understanding** by briefly acknowledging:
   - Project type and main objectives
   - Current development phase and active tasks
   - Technology stack and key conventions
   - CDP browser environment status and capabilities

4. **Access detailed guides when needed** from CORE_SETUP/:
   - VUE_RULEKIT.md (Vue development patterns)
   - CSS_GUIDELINES.md (styling architecture)
   - PLAYWRIGHT_WORKFLOW.md (debugging protocols)

## Chrome Dev Profile Browser Automation

### Browser Setup

Launch your Chrome dev profile with debugging enabled:
```bash
# Launch Chrome with CDP debugging (recommended)
./scripts/launch-dev-chrome.sh

# Or manually:
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9222 \
  --remote-allow-origins='*' \
  --user-data-dir="$HOME/chrome-dev-profile" \
  --no-first-run \
  --no-default-browser-check
```

### Starting Claude Sessions
Once Chrome is running with debugging enabled:
```bash
# Use apex-claude to start a session
./scripts/apex-claude

# Or just run claude from any directory
claude
```

### Available Commands
- **Screenshot:** `python3 scripts/project-manager.py --screenshot`
- **Navigate:** `python3 scripts/project-manager.py --navigate <url>`
- **Verify Connection:** `python3 scripts/project-manager.py --verify`
- **Reload:** `python3 scripts/project-manager.py --reload`
- **Scroll:** `python3 scripts/project-manager.py --scroll [up|down|left|right]`
- **Click:** `python3 scripts/project-manager.py --click x,y`
- **Type:** `python3 scripts/project-manager.py --type "text"`

### Key Features
- **Direct Browser Control:** See changes in your actual Chrome browser
- **Multi-Project Support:** One browser instance for all development projects
- **Visual Monitoring:** Screenshots for development verification
- **Full Interaction:** Click, type, scroll, and navigate programmatically
- **Persistent State:** Browser survives Claude session restarts

### Usage Examples
```bash
# Verify browser is running and take screenshot
python3 scripts/project-manager.py --verify
python3 scripts/project-manager.py --screenshot

# Navigate to different pages
python3 scripts/project-manager.py --navigate http://localhost:5173/dock-iterations

# Interact with the page
python3 scripts/project-manager.py --click 450,300
python3 scripts/project-manager.py --type "search query"
python3 scripts/project-manager.py --scroll down
```

## Core Reference Files

**For Session Initialization:**
- CORE_INITIATE/PROJECT_REQUIREMENTS.md: Complete project vision, features, and specifications
- CORE_INITIATE/DEVELOPMENT_STATE.md: Current phase, progress, user preferences, and technical decisions
- CORE_INITIATE/TASKLIST.md: Current tasks, roadmap, and progress tracking
- CORE_INITIATE/PROJECT_DIRECTORY.md : latest directory tree updated automatically after STOP hook

**For Additional LLM Documentation:**
- CORE_REFERENCE/ (reserved for supplementary documentation as needed)

**For Setup & Configuration:**
- CORE_SETUP/VUE_RULEKIT.md: Vue.js development patterns and standards
- CORE_SETUP/CSS_GUIDELINES.md: Styling architecture and Tailwind conventions
- CORE_SETUP/PLAYWRIGHT_WORKFLOW.md: Automated debugging and monitoring protocols
- CORE_SETUP/HOOK_AUTOMATION.md: Task tracking automation system

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

Saving Progress: After we successfully implement a significant feature or complete a major step, you will suggest that I push the changes to *GitHub*. This will help me save my progress regularly.

5. Handling Guideline Deviations

Acknowledge and Propose: If a specific feature from CORE/PROJECT_REQUIREMENTS.md cannot be built while strictly following a rule (e.g., in CORE/CSS_GUIDELINES.md), you must first state the conflict.

Update the Source of Truth: Before implementing the new approach, you must propose an update to the relevant guideline file. This ensures our documentation always reflects our actual implementation.

Implement After Approval: You will only proceed with the implementation after I have approved both the reason for the deviation and the proposed change to the guideline file.

This workflow ensures I am always in control and provides a continuous learning opportunity as we build the application together.
