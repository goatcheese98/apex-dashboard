#!/bin/bash

# Claude Code Session Initialization Script
# This script runs on the first user prompt of each session to ensure
# Claude has proper project context and understanding

SESSION_MARKER="/Users/rohanjasani/Projects/apex-dashboard/.claude/.session_initialized"

# Check if this session is already initialized
if [ -f "$SESSION_MARKER" ]; then
    # Session already initialized, skip
    exit 0
fi

# Create session marker
touch "$SESSION_MARKER"

# Set up a trap to clean up the marker when the terminal/session ends
trap 'rm -f "$SESSION_MARKER"' EXIT

# Create a context prompt for Claude to read all core documentation
cat << 'EOF' > /tmp/claude_session_init.txt
🚀 **SESSION INITIALIZATION** 🚀

Please read and understand the following project documentation files in order:

1. **CLAUDE.md** - Master development guidelines and workflow
2. **CORE_INITIATE/PROJECT_REQUIREMENTS.md** - Complete project vision, features, roadmap
3. **CORE_INITIATE/CURRENT_STATE.md** - Development phase, stack, and conventions
4. **CORE_INITIATE/MEMORYLOG.md** - Project context and user preferences
5. **CORE_INITIATE/TASKLIST.md** - Current progress and priorities

Setup references (access when needed):
- **CORE_SETUP/VUE_RULEKIT.md** - Vue.js development standards and patterns
- **CORE_SETUP/CSS_GUIDELINES.md** - Styling architecture and Tailwind usage
- **CORE_SETUP/PLAYWRIGHT_WORKFLOW.md** - Automated debugging and testing protocol

After reading these files, confirm your understanding of:
- Project structure and conventions
- Development workflow and standards  
- Testing and debugging procedures
- Architecture decisions and constraints

This ensures you have complete project context for this session.
EOF

# Log the initialization
echo "$(date): Claude session initialized" >> /Users/rohanjasani/Projects/apex-dashboard/.claude/session.log

exit 0