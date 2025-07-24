#!/bin/bash
# Launch Chrome with CDP debugging enabled for development

echo "🚀 Launching Chrome with CDP debugging..."

# Check if Chrome is already running on port 9222
if curl -s http://localhost:9222/json/version > /dev/null 2>&1; then
    echo "⚠️  Chrome is already running with debugging on port 9222"
    echo "📝 Claude can connect using: python3 scripts/project-manager.py"
    exit 0
fi

# Launch Chrome in background, independent of terminal
nohup "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port=9222 \
  --remote-allow-origins='*' \
  --user-data-dir="$HOME/chrome-dev-profile" \
  --no-first-run \
  --no-default-browser-check \
  > /dev/null 2>&1 &

# Save the PID
CHROME_PID=$!
echo $CHROME_PID > ~/.chrome-dev-pid

# Wait a moment for Chrome to start
sleep 2

# Verify Chrome started successfully
if curl -s http://localhost:9222/json/version > /dev/null 2>&1; then
    echo "✅ Chrome launched successfully (PID: $CHROME_PID)"
    echo "🔒 Chrome will continue running even if you close this terminal"
    echo "📝 Claude can now connect using: python3 scripts/project-manager.py"
    echo ""
    echo "To stop Chrome later: kill \$(cat ~/.chrome-dev-pid)"
else
    echo "❌ Failed to launch Chrome with debugging"
    exit 1
fi