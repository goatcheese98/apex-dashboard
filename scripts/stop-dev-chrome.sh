#!/bin/bash
# Stop the Chrome dev profile

if [ -f ~/.chrome-dev-pid ]; then
    PID=$(cat ~/.chrome-dev-pid)
    if ps -p $PID > /dev/null 2>&1; then
        echo "🛑 Stopping Chrome dev profile (PID: $PID)..."
        kill $PID
        rm ~/.chrome-dev-pid
        echo "✅ Chrome dev profile stopped"
    else
        echo "⚠️  Chrome process not found (PID: $PID)"
        rm ~/.chrome-dev-pid
    fi
else
    echo "❌ No Chrome dev profile PID file found"
    echo "Checking if Chrome is running on port 9222..."
    
    # Try to find Chrome process by port
    CHROME_PID=$(lsof -ti :9222 2>/dev/null)
    if [ ! -z "$CHROME_PID" ]; then
        echo "Found Chrome on port 9222 (PID: $CHROME_PID)"
        echo "Stopping it..."
        kill $CHROME_PID
        echo "✅ Chrome stopped"
    else
        echo "❌ No Chrome process found on port 9222"
    fi
fi