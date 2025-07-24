# Hook Integration Setup Guide
*Complete guide for activating Claude Code session automation*

## Quick Start

### 1. Verify Current Setup
Your project already has the streamlined hook system configured. Check these components:

```
CORE_INITIATE/
├── DEVELOPMENT_STATE.md    # Current phase, progress, user preferences (auto-updated)
├── PROJECT_DIRECTORY.md    # Project structure (auto-generated)
├── PROJECT_REQUIREMENTS.md # Complete project specification
└── TASKLIST.md            # Current tasks & roadmap (auto-updated)

scripts/
└── session-updater.py     # Consolidated session automation

.claude/
└── settings.json          # Hook configuration
```

### 2. Test Current System
Verify the automation is working:

```bash
# Test the session updater directly
python3 scripts/session-updater.py

# Check hook configuration
cat .claude/settings.json

# Verify automated file updates
ls -la CORE_INITIATE/
```

### 3. How It Works Now
**Complete Session Automation**: Startup and shutdown hooks manage everything
- **Session Start**: Automatically starts development server on localhost:5173
- **Browser Ready**: Application immediately available to Claude's browser tools
- **Session End**: Stops server and updates all documentation files
- **Comprehensive error handling and logging throughout**

## Current Hook System

### Automatic Session Tracking
**No manual task creation needed** - the system focuses on documentation maintenance:

1. **Session Ends** → Stop hook triggers automatically
2. **Directory Scan** → Project structure captured
3. **File Updates** → Documentation files updated
4. **Logging** → Success/failure reported

### What Gets Updated Automatically

#### PROJECT_DIRECTORY.md
- **Complete directory tree** with file descriptions
- **Intelligent comments** for each file and directory
- **Current structure** reflecting latest changes
- **Excluded files** following gitignore patterns

#### DEVELOPMENT_STATE.md  
- **Last Updated dates** showing recent activity
- **Session completion logs** in Recent Completions section
- **Preserved content** while updating timestamps

#### TASKLIST.md
- **Auto-update timestamps** for consistency
- **Preserved task content** and formatting
- **Maintained task status** and priorities

## Configuration Reference

### Current Settings (.claude/settings.json)
```json
{
  "hooks": {
    "Stop": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command", 
            "command": "python3 scripts/session-updater.py",
            "timeout": 8000
          }
        ]
      }
    ]
  },
  "permissions": {
    "tools": {
      "Bash": "allow",
      "Edit": "allow", 
      "Write": "allow",
      "Read": "allow",
      "MultiEdit": "allow",
      "Glob": "allow",
      "Grep": "allow",
      "Task": "allow",
      "TodoWrite": "allow"
    }
  }
}
```

### Session Updater Script Features
The `scripts/session-updater.py` provides:

- **Consolidated Automation**: Single script handles all updates
- **Error Recovery**: Continues execution if individual updates fail  
- **File Safety**: Atomic write operations prevent corruption
- **Comprehensive Logging**: Clear success/failure feedback
- **Performance**: Fast execution (typically under 2 seconds)

## Troubleshooting

### Common Issues

#### Hook Not Executing
```bash
# Check script permissions
ls -la scripts/session-updater.py

# Test script directly
python3 scripts/session-updater.py

# Check Python installation
which python3
```

#### Files Not Updating
1. **Check write permissions** on CORE_INITIATE directory
2. **Verify script completion** in Claude session logs
3. **Test manual execution** of session-updater.py

#### Script Errors
```bash
# Run with error output visible
python3 scripts/session-updater.py 2>&1

# Check for common issues:
# - Missing CORE_INITIATE directory
# - File permission problems  
# - Python path issues
```

### Debug Information
The script provides detailed logging:
- **Success messages**: Show which files were updated
- **Error messages**: Indicate specific failure points
- **Timestamps**: Track when operations occurred
- **Context**: Clear indication of what failed and why

### Manual Override
You can always manually edit any CORE_INITIATE file:
- **Direct editing** works normally
- **Automation preserves** your manual changes where possible
- **Next session** will update timestamps but keep content

## Best Practices

### Working with the System
- **Let automation handle structure tracking** - focus on development
- **Manually update TASKLIST.md** for task management
- **Use DEVELOPMENT_STATE.md** for preferences and context
- **Rely on PROJECT_DIRECTORY.md** for current structure reference

### Maintaining Documentation
- **PROJECT_REQUIREMENTS.md**: Keep this updated with major changes
- **DEVELOPMENT_STATE.md**: Update phases, preferences, and decisions manually
- **TASKLIST.md**: Manage tasks manually, let automation handle timestamps

### Development Workflow
1. **Start development** → Files automatically tracked
2. **Work on features** → Documentation stays current
3. **End session** → All structure updates happen automatically
4. **Begin next session** → Always have current project state

## Advanced Usage

### Customizing File Comments
Edit the `get_file_comment()` method in `session-updater.py` to:
- **Add new file types** with appropriate descriptions
- **Modify directory descriptions** for your project structure
- **Update comments** as your project evolves

### Extending Automation
The current system can be extended to:
- **Git integration**: Track commits and branch changes
- **Task status updates**: Analyze file changes for task progress  
- **Development metrics**: Track session activity and progress
- **External tools**: Sync with project management platforms

### Architecture Benefits
- **Reliability**: Simple single-script approach reduces failure points
- **Performance**: Minimal overhead per session
- **Maintainability**: Easy to debug and modify
- **Flexibility**: Preserves manual control while providing automation

## System Architecture

```
Claude Session Workflow:
┌─────────────────┐
│ Development     │
│ Session Active  │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Session Ends    │
│ Stop Hook       │
│ Triggers        │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ session-updater │
│ .py Executes    │
└─────────┬───────┘
          │
          ▼
┌─────────────────┐
│ Files Updated:  │
│ • Directory     │
│ • Dev State     │  
│ • Task List     │
└─────────────────┘
```

---

## Migration from Complex Systems

If upgrading from multi-script hook systems:

### What Changed
- **Simplified to single script** instead of multiple task parsers
- **Focus on documentation** rather than complex task automation  
- **Improved reliability** with better error handling
- **Reduced complexity** for easier maintenance

### What Stayed the Same
- **Manual task management** in TASKLIST.md
- **Project documentation** structure and purpose
- **Development workflow** integration
- **File-based organization** approach

---

*This streamlined hook system provides essential automation while keeping complexity low and reliability high. Perfect for maintaining project documentation without interfering with your development workflow.*