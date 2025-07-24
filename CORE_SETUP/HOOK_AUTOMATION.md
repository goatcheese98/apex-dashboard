# Hook-Based Session Automation System
*Implementation guide for automatic session tracking via Claude Code hooks*

## System Architecture

### Current Hook Implementation

**Dual Hook System**: Startup and shutdown hooks provide complete session automation
- **UserPromptSubmit Hook**: Automatically starts development server and prepares browser access
- **Stop Hook**: Stops development server and updates all CORE_INITIATE documentation files
- Maintains project directory structure and session tracking
- Simple, reliable architecture with comprehensive error handling

### Core Component

#### Session Updater Script (`scripts/session-updater.py`)
**Consolidated session automation that handles:**

**Startup Operations (`--startup`):**
- **Development Server**: Starts `npm run dev` on localhost:5173
- **Process Management**: Tracks server PID for proper cleanup
- **Server Readiness**: Waits for server to be accessible
- **Browser Preparation**: Makes application immediately available to Claude's browser tools

**Shutdown Operations (`--shutdown`):**
- **Server Cleanup**: Properly stops development server processes
- **PROJECT_DIRECTORY.md**: Auto-generates current directory structure with file comments
- **DEVELOPMENT_STATE.md**: Updates last-modified dates and session completion logs
- **TASKLIST.md**: Maintains auto-updated timestamps for task tracking consistency

**Features:**
- **Error Handling**: Comprehensive logging with proper failure recovery
- **Process Safety**: Graceful shutdown with force-kill fallback
- **Performance**: Fast startup/shutdown with proper resource management

## Hook Configuration

### Project Settings (`.claude/settings.json`)

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "python3 scripts/session-updater.py --startup",
            "timeout": 15000
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": ".*",
        "hooks": [
          {
            "type": "command",
            "command": "python3 scripts/session-updater.py --shutdown",
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

## Automation Features

### Automatic Directory Structure Updates
- **Real-time Project Mapping**: Scans entire project structure on session end
- **Intelligent File Comments**: Provides contextual descriptions for each file/directory
- **Gitignore Awareness**: Excludes ignored files while including essential config directories
- **Placeholder Handling**: Efficiently handles large directories (node_modules, dist)

### Session Tracking
- **Session Completion Logging**: Timestamps each successful Claude session
- **Development Progress**: Maintains historical record of session activity
- **File Modification Awareness**: Tracks when documentation was last updated

### Error Recovery
- **Graceful Failure Handling**: Continues execution even if individual updates fail
- **Detailed Logging**: Comprehensive error and success messaging to stderr
- **File Safety**: Ensures file integrity during update operations

## File Update Logic

### PROJECT_DIRECTORY.md Updates
```python
# Generates comprehensive directory tree with comments
# Excludes: Hidden files (except .claude, .mcp, .serena)
# Includes: Placeholders for build directories
# Comments: Contextual descriptions for each file/directory
```

### DEVELOPMENT_STATE.md Updates
```python
# Updates "Last Updated" timestamp
# Adds session completion entries to Recent Completions section
# Maintains chronological session history
```

### TASKLIST.md Updates
```python
# Updates auto-update timestamp
# Preserves all task content and formatting
# Ensures consistency across documentation
```

## Architecture Benefits

### Simplified Design
- **Single Responsibility**: One script handles all session-end automation
- **Reduced Complexity**: No complex multi-hook coordination required
- **Easier Maintenance**: Single point of failure and single point of debugging

### Performance Optimized
- **Minimal Overhead**: Single script execution per session
- **Fast Execution**: Typically completes in under 2 seconds
- **Timeout Protection**: 8-second timeout prevents hanging sessions

### Reliability Focused
- **Comprehensive Error Handling**: Graceful failure modes for all operations
- **File Safety**: Atomic write operations prevent corruption
- **Logging**: Clear success/failure feedback for troubleshooting

## Development Workflow Integration

### Session Automation Flow

#### Startup Sequence
1. **Claude session starts** → UserPromptSubmit hook triggers automatically  
2. **Server startup** → `npm run dev` launched on localhost:5173
3. **Readiness check** → Waits for server to respond
4. **Browser preparation** → Application immediately available to Claude
5. **Logging** → Startup status reported

#### Shutdown Sequence  
1. **Claude session ends** → Stop hook triggers automatically
2. **Server cleanup** → Development server processes terminated
3. **Directory scan** → Current project structure captured
4. **File updates** → All CORE_INITIATE files updated atomically
5. **Logging** → Shutdown status reported

### Manual Override Capability
- **Direct File Editing**: All CORE_INITIATE files remain manually editable
- **Script Testing**: Run `python3 scripts/session-updater.py` manually anytime
- **Debugging**: Error logs provide clear troubleshooting information

## Future Enhancement Opportunities

### Potential Extensions
- **Task Status Integration**: Could analyze git changes to update task statuses
- **Development Metrics**: Could track session duration and activity patterns
- **Custom Templates**: Could support user-defined file update templates
- **External Integration**: Could sync with external project management tools

### Current Design Philosophy
**Keep It Simple**: Current implementation prioritizes reliability over features
**Maintain Manual Control**: Automation enhances rather than replaces manual control
**Focus on Documentation**: Ensures project documentation stays current automatically

---

## Testing and Verification

### Verify Hook Functionality
```bash
# Test script directly
python3 scripts/session-updater.py

# Check Claude settings
cat .claude/settings.json

# Verify file updates
ls -la CORE_INITIATE/
```

### Debug Mode
```bash
# Script provides comprehensive logging to stderr
# Check session logs for hook execution status
# All errors logged with timestamps and context
```

---

*This streamlined system provides essential session automation while maintaining simplicity, reliability, and manual control over project documentation.*