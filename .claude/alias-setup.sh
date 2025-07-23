#!/bin/bash

# Add this to your ~/.zshrc or ~/.bashrc for easy access
echo "Adding Claude Code function to your shell configuration..."

# Using a function instead of alias so cd works in current shell
FUNCTION_DEFINITION="# Apex Claude function - changes directory and starts Claude Code
apex-claude() {
    echo \"📂 Changing to apex-dashboard directory...\"
    cd /Users/rohanjasani/Projects/apex-dashboard
    echo \"🚀 Starting Claude Code with project context...\"
    claude --dangerously-skip-permissions \"Please read all CORE_INITIATE/ documentation files and follow CLAUDE.md guidelines for this project.\"
}"

# Detect shell and add function
if [[ "$SHELL" == *"zsh"* ]]; then
    echo "$FUNCTION_DEFINITION" >> ~/.zshrc
    echo "✅ Added 'apex-claude' function to ~/.zshrc"
    echo "Run 'source ~/.zshrc' to activate, then use 'apex-claude' from anywhere"
elif [[ "$SHELL" == *"bash"* ]]; then
    echo "$FUNCTION_DEFINITION" >> ~/.bashrc
    echo "✅ Added 'apex-claude' function to ~/.bashrc" 
    echo "Run 'source ~/.bashrc' to activate, then use 'apex-claude' from anywhere"
else
    echo "Manual setup required:"
    echo "Add this to your shell config:"
    echo "$FUNCTION_DEFINITION"
fi