# 🎯 Chrome Dev Profile Browser Solution

## The Problem We Solved
Multiple Claude sessions couldn't share the same browser because Playwright MCP creates isolated browser contexts for each session. We needed a way to have direct visual feedback and browser control across sessions.

## The Solution: Chrome Dev Profile with CDP

### How It Works
1. **Your Chrome Instance**: Launch your personal Chrome with debugging flags
2. **Chrome DevTools Protocol**: Chrome exposes CDP on port 9222
3. **Direct Control**: See all changes in real-time in your browser
4. **Multi-Project**: One browser for all your development projects
5. **Multi-Session**: All Claude sessions connect to the same Chrome instance

### Key Benefits
- **Visual Development**: See changes as Claude makes them
- **DevTools Access**: Use Chrome DevTools alongside Claude
- **Multi-Project**: One browser for all your projects
- **Manual Override**: You can interact directly when needed
- **Terminal Independent**: Chrome survives terminal closure
- **No Process Management**: Chrome stays open between sessions

## Setup Instructions

### 1. Launch Chrome Dev Profile
```bash
# Recommended: Use the launcher script
./scripts/launch-dev-chrome.sh

# Or manually:
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9222 \
  --remote-allow-origins='*' \
  --user-data-dir="$HOME/chrome-dev-profile" \
  --no-first-run \
  --no-default-browser-check
```

This launches Chrome with:
- Remote debugging enabled on port 9222
- A separate profile at `~/chrome-dev-profile`
- WebSocket access from any origin
- Terminal-independent process (uses `nohup`)

### 2. Start Claude Session
```bash
# Use apex-claude (checks Chrome and navigates to localhost:5173)
./scripts/apex-claude

# Or just run claude from anywhere
claude
```

### 3. Stop Chrome When Done
```bash
# Use the stop script
./scripts/stop-dev-chrome.sh

# Or manually: kill $(cat ~/.chrome-dev-pid)
```

## Key Components

### launch-dev-chrome.sh
- Launches Chrome with debugging enabled
- Uses `nohup` for terminal independence
- Saves PID to `~/.chrome-dev-pid`
- Checks if Chrome already running
- Verifies successful launch

### project-manager.py
- Connects to Chrome on port 9222
- Provides CDP commands: navigate, screenshot, click, type, etc.
- Works with any project using the same Chrome instance
- No browser lifecycle management needed

### apex-claude
- Checks if Chrome dev profile is running
- Navigates to localhost:5173
- Takes initial screenshot
- Launches Claude with project context

## Usage Examples

### Basic Commands
```bash
# Verify connection
python3 scripts/project-manager.py --verify

# Take screenshot
python3 scripts/project-manager.py --screenshot

# Navigate to URL
python3 scripts/project-manager.py --navigate "http://localhost:3000"

# Interact with page
python3 scripts/project-manager.py --click 450,300
python3 scripts/project-manager.py --type "search query"
python3 scripts/project-manager.py --scroll down
```

### Multi-Project Workflow
```bash
# Terminal 1: Launch Chrome once
cd ~/Projects/any-project
~/Projects/apex-dashboard/scripts/launch-dev-chrome.sh

# Terminal 2: Work on React project
cd ~/Projects/react-app
claude  # Chrome at localhost:9222 is available

# Terminal 3: Work on Vue project  
cd ~/Projects/vue-app
claude  # Same Chrome instance!
```

## Troubleshooting

### "Chrome not found on port 9222"
```bash
# Check if Chrome is running
curl http://localhost:9222/json/version

# If not, launch it:
./scripts/launch-dev-chrome.sh
```

### Chrome won't start
```bash
# Check if port 9222 is in use
lsof -i :9222

# Kill any existing Chrome on 9222
kill $(lsof -ti :9222)

# Try again
./scripts/launch-dev-chrome.sh
```

### Multiple Chrome profiles running
Keep your personal Chrome separate from dev Chrome - they can run simultaneously without conflicts.

---

This solution provides a clean, reliable way to share a browser across Claude sessions while maintaining direct visual feedback and control.