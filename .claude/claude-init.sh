#!/bin/bash

# Claude Code Project Initialization Script
# Run this when starting a new Claude Code session

echo "🚀 Initializing Claude Code session for Apex Dashboard..."

# Navigate to project directory
cd /Users/rohanjasani/Projects/apex-dashboard

# Start Claude Code with full permissions and initialization prompt
claude --dangerously-skip-permissions < .claude/startup-prompt.md

echo "✅ Claude Code initialized with project context and full permissions!"