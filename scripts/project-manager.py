#!/usr/bin/env python3
"""
Apex Dashboard Project Manager - Consolidated script for all project operations
Handles browser management, session coordination, and project maintenance
"""

import os
import sys
import json
import time
import subprocess
import signal
import socket
import urllib.request
import requests
import websocket
import base64
from pathlib import Path
from datetime import datetime
import argparse

class ApexProjectManager:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.claude_dir = self.project_root / ".claude"
        self.scripts_dir = self.project_root / "scripts"
        self.claude_dir.mkdir(exist_ok=True)
        
    # ===== CHROME DEV PROFILE CONNECTION =====
    
    def check_port(self, port):
        """Check if a port is accessible"""
        try:
            with urllib.request.urlopen(f"http://localhost:{port}/json/version", timeout=2) as response:
                return json.loads(response.read().decode())
        except:
            return None
            
    def browser_status(self):
        """Check if Chrome dev profile is running on port 9222"""
        browser_info = self.check_port(9222)
        if browser_info:
            # Chrome is running with debugging enabled
            cdp_info = {
                "cdp_port": 9222,
                "ws_endpoint": browser_info.get("webSocketDebuggerUrl", "ws://localhost:9222/devtools/browser"),
                "status": "running"
            }
            return True, cdp_info
        else:
            return False, None
            
    def ensure_browser(self):
        """Ensure Chrome dev profile is running"""
        is_running, cdp_info = self.browser_status()
        
        if is_running:
            print(f"✅ Connected to Chrome dev profile on port {cdp_info['cdp_port']}")
            return cdp_info
        else:
            print("❌ Chrome dev profile not found on port 9222")
            print("")
            print("Please launch Chrome dev profile with:")
            print("  ./scripts/launch-dev-chrome.sh")
            print("")
            print("Or manually:")
            print('  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \\')
            print('    --remote-debugging-port=9222 \\')
            print("    --remote-allow-origins='*' \\")
            print('    --user-data-dir="$HOME/chrome-dev-profile"')
            return None
            
    # ===== SESSION HOOKS =====
    
    def session_startup(self):
        """Called when Claude session starts"""
        print("🚀 Apex Claude Session Starting...")
        
        # Check if Chrome dev profile is running
        is_running, cdp_info = self.browser_status()
        
        if is_running:
            print(f"✅ Chrome dev profile available on port {cdp_info['cdp_port']}")
            print("📸 Use: python3 scripts/project-manager.py --screenshot")
            print("🌐 Use: python3 scripts/project-manager.py --navigate <url>")
        else:
            print("⚠️  Chrome dev profile not detected")
            print("Launch with: ./scripts/launch-dev-chrome.sh")
            
        print("✅ Session initialized")
        
    def session_shutdown(self):
        """Called when Claude session stops"""
        print("👋 Claude session ending...")
        
        # Update project directory
        self.update_project_directory()
        
        print("✅ Session cleanup complete")
        
    def update_project_directory(self):
        """Update PROJECT_DIRECTORY.md with current tree"""
        print("📁 Updating project directory...")
        
        try:
            # Try using ls -la with better formatting
            tree_output = self.generate_directory_tree()
            
            # Write to PROJECT_DIRECTORY.md
            directory_file = self.project_root / "CORE_INITIATE" / "PROJECT_DIRECTORY.md"
            with open(directory_file, 'w') as f:
                f.write(f"# Project Directory Structure\n")
                f.write(f"*Auto-updated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*\n\n")
                f.write("```\n")
                f.write(tree_output)
                f.write("```\n")
                
            print("✅ Project directory updated")
        except Exception as e:
            print(f"❌ Error updating directory: {e}")
            
    def generate_directory_tree(self, path=None, prefix="", is_last=True):
        """Generate a tree-like directory structure"""
        if path is None:
            path = self.project_root
            result = f"{path.name}/\n"
        else:
            result = ""
            
        path = Path(path)
        
        # Skip certain directories
        skip_dirs = {'.git', 'node_modules', 'dist', '.nuxt', '.next', 'coverage', '.pytest_cache', '__pycache__'}
        
        # Get all items
        try:
            items = sorted(path.iterdir(), key=lambda x: (x.is_file(), x.name))
            items = [item for item in items if item.name not in skip_dirs]
        except PermissionError:
            return result
            
        for i, item in enumerate(items):
            is_last_item = i == len(items) - 1
            
            # Create the tree structure
            if prefix:
                result += prefix
            result += "└── " if is_last_item else "├── "
            result += item.name
            
            if item.is_dir():
                result += "/\n"
                # Recursively process subdirectories
                extension = "    " if is_last_item else "│   "
                result += self.generate_directory_tree(item, prefix + extension, is_last_item)
            else:
                result += "\n"
                
        return result
            
    # ===== BROWSER CLIENT OPERATIONS =====
    
    def get_tabs(self):
        """Get list of browser tabs"""
        is_running, cdp_info = self.browser_status()
        if not is_running:
            return []
            
        port = cdp_info['cdp_port']
        try:
            response = requests.get(f"http://localhost:{port}/json/list", timeout=5)
            return response.json()
        except requests.RequestException as e:
            print(f"❌ Failed to get tabs: {e}")
            return []
    
    def create_tab(self, url="http://localhost:5173"):
        """Create a new browser tab"""
        is_running, cdp_info = self.browser_status()
        if not is_running:
            print("❌ Browser not running")
            return None
            
        port = cdp_info['cdp_port']
        try:
            response = requests.put(f"http://localhost:{port}/json/new?{url}", timeout=5)
            return response.json()
        except requests.RequestException as e:
            print(f"❌ Failed to create tab: {e}")
            return None
    
    def get_or_create_tab(self, url="http://localhost:5173"):
        """Get existing tab or create new one"""
        tabs = self.get_tabs()
        
        # Look for existing tab with our URL
        for tab in tabs:
            if url in tab.get('url', ''):
                return tab
        
        # Create new tab if none found
        return self.create_tab(url)
    
    def send_cdp_command(self, tab_id, method, params=None):
        """Send CDP command to specific tab"""
        is_running, cdp_info = self.browser_status()
        if not is_running:
            raise Exception("Browser not running")
            
        port = cdp_info['cdp_port']
        ws_url = f"ws://localhost:{port}/devtools/page/{tab_id}"
        
        if params is None:
            params = {}
        
        try:
            ws = websocket.create_connection(ws_url, timeout=10)
            
            command = {
                "id": 1,
                "method": method,
                "params": params
            }
            
            ws.send(json.dumps(command))
            response = json.loads(ws.recv())
            ws.close()
            
            if 'error' in response:
                raise Exception(f"CDP Error: {response['error']}")
            
            return response.get('result', {})
            
        except Exception as e:
            raise Exception(f"CDP command failed: {e}")
    
    def browser_screenshot(self, filename=None):
        """Take a screenshot using CDP"""
        print("📸 Taking CDP browser screenshot...")
        
        try:
            # Get or create tab
            tab = self.get_or_create_tab()
            if not tab:
                print("❌ Failed to get browser tab")
                return None
                
            tab_id = tab['id']
            
            # Take screenshot
            result = self.send_cdp_command(tab_id, "Page.captureScreenshot", {
                "format": "png",
                "quality": 90
            })
            
            # Save screenshot
            if filename is None:
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                filename = f"screenshot_{timestamp}.png"
            
            screenshot_path = self.claude_dir / filename
            
            with open(screenshot_path, 'wb') as f:
                f.write(base64.b64decode(result['data']))
            
            print(f"✅ Screenshot saved: {screenshot_path}")
            return str(screenshot_path)
            
        except Exception as e:
            print(f"❌ Screenshot failed: {e}")
            return None
        
    def browser_navigate(self, url):
        """Navigate browser to URL"""
        print(f"🌐 Navigating to: {url}")
        
        try:
            # Get or create tab
            tab = self.get_or_create_tab()
            if not tab:
                print("❌ Failed to get browser tab")
                return False
                
            tab_id = tab['id']
            
            # Navigate
            self.send_cdp_command(tab_id, "Page.navigate", {"url": url})
            
            # Wait for load
            time.sleep(2)
            
            print("✅ Navigation complete")
            return True
            
        except Exception as e:
            print(f"❌ Navigation failed: {e}")
            return False
    
    def browser_verify(self):
        """Verify Chrome dev profile connection"""
        try:
            is_running, cdp_info = self.browser_status()
            if not is_running:
                print("❌ Chrome dev profile not running on port 9222")
                print("Please launch with: ./scripts/launch-dev-chrome.sh")
                return False
                
            tabs = self.get_tabs()
            
            print(f"✅ Connected to Chrome dev profile on port {cdp_info['cdp_port']}")
            print(f"🔗 WebSocket: {cdp_info['ws_endpoint']}")
            print(f"📑 Active tabs: {len(tabs)}")
            
            return True
            
        except Exception as e:
            print(f"❌ Connection verification failed: {e}")
            return False
    
    def browser_scroll(self, direction="down", pixels=None):
        """Scroll the browser page"""
        print(f"📜 Scrolling {direction}...")
        
        try:
            # Get or create tab
            tab = self.get_or_create_tab()
            if not tab:
                print("❌ Failed to get browser tab")
                return False
                
            tab_id = tab['id']
            
            # Enable runtime to execute JavaScript
            self.send_cdp_command(tab_id, "Runtime.enable")
            
            # Determine scroll parameters
            if pixels is None:
                pixels = 500 if direction in ["down", "up"] else 300
            
            if direction == "down":
                scroll_script = f"window.scrollBy(0, {pixels});"
            elif direction == "up":
                scroll_script = f"window.scrollBy(0, -{pixels});"
            elif direction == "left":
                scroll_script = f"window.scrollBy(-{pixels}, 0);"
            elif direction == "right":
                scroll_script = f"window.scrollBy({pixels}, 0);"
            elif direction == "top":
                scroll_script = "window.scrollTo(0, 0);"
            elif direction == "bottom":
                scroll_script = "window.scrollTo(0, document.body.scrollHeight);"
            else:
                print(f"❌ Invalid scroll direction: {direction}")
                return False
            
            # Execute scroll
            self.send_cdp_command(tab_id, "Runtime.evaluate", {
                "expression": scroll_script
            })
            
            # Wait for scroll to complete
            time.sleep(0.5)
            
            print(f"✅ Scrolled {direction}")
            return True
            
        except Exception as e:
            print(f"❌ Scroll failed: {e}")
            return False
    
    def browser_click(self, x, y):
        """Click at specific coordinates"""
        print(f"🖱️ Clicking at ({x}, {y})...")
        
        try:
            # Get or create tab
            tab = self.get_or_create_tab()
            if not tab:
                print("❌ Failed to get browser tab")
                return False
                
            tab_id = tab['id']
            
            # Enable Input domain
            self.send_cdp_command(tab_id, "Input.enable")
            
            # Send mouse click
            self.send_cdp_command(tab_id, "Input.dispatchMouseEvent", {
                "type": "mousePressed",
                "x": x,
                "y": y,
                "button": "left",
                "clickCount": 1
            })
            
            self.send_cdp_command(tab_id, "Input.dispatchMouseEvent", {
                "type": "mouseReleased",
                "x": x,
                "y": y,
                "button": "left",
                "clickCount": 1
            })
            
            print(f"✅ Clicked at ({x}, {y})")
            return True
            
        except Exception as e:
            print(f"❌ Click failed: {e}")
            return False
    
    def browser_type(self, text):
        """Type text into the currently focused element"""
        print(f"⌨️ Typing text: {text[:50]}...")
        
        try:
            # Get or create tab
            tab = self.get_or_create_tab()
            if not tab:
                print("❌ Failed to get browser tab")
                return False
                
            tab_id = tab['id']
            
            # Enable Input domain
            self.send_cdp_command(tab_id, "Input.enable")
            
            # Type each character
            for char in text:
                self.send_cdp_command(tab_id, "Input.dispatchKeyEvent", {
                    "type": "char",
                    "text": char
                })
                time.sleep(0.01)  # Small delay between characters
            
            print(f"✅ Typed text successfully")
            return True
            
        except Exception as e:
            print(f"❌ Typing failed: {e}")
            return False
    
    def browser_key(self, key):
        """Press a specific key"""
        print(f"🔑 Pressing key: {key}")
        
        try:
            # Get or create tab
            tab = self.get_or_create_tab()
            if not tab:
                print("❌ Failed to get browser tab")
                return False
                
            tab_id = tab['id']
            
            # Enable Input domain
            self.send_cdp_command(tab_id, "Input.enable")
            
            # Key code mapping
            key_codes = {
                "Enter": 13,
                "Escape": 27,
                "Space": 32,
                "ArrowUp": 38,
                "ArrowDown": 40,
                "ArrowLeft": 37,
                "ArrowRight": 39,
                "Tab": 9,
                "Backspace": 8,
                "Delete": 46
            }
            
            if key in key_codes:
                # Send key down and up events
                self.send_cdp_command(tab_id, "Input.dispatchKeyEvent", {
                    "type": "keyDown",
                    "windowsVirtualKeyCode": key_codes[key],
                    "key": key
                })
                
                self.send_cdp_command(tab_id, "Input.dispatchKeyEvent", {
                    "type": "keyUp",
                    "windowsVirtualKeyCode": key_codes[key],
                    "key": key
                })
            else:
                # For single character keys
                self.send_cdp_command(tab_id, "Input.dispatchKeyEvent", {
                    "type": "char",
                    "text": key
                })
            
            print(f"✅ Pressed key: {key}")
            return True
            
        except Exception as e:
            print(f"❌ Key press failed: {e}")
            return False
    
    def browser_reload(self):
        """Reload the current page"""
        print("🔄 Reloading page...")
        
        try:
            # Get or create tab
            tab = self.get_or_create_tab()
            if not tab:
                print("❌ Failed to get browser tab")
                return False
                
            tab_id = tab['id']
            
            # Reload page
            self.send_cdp_command(tab_id, "Page.reload")
            
            # Wait for reload
            time.sleep(2)
            
            print("✅ Page reloaded")
            return True
            
        except Exception as e:
            print(f"❌ Reload failed: {e}")
            return False
    
    def browser_evaluate(self, expression):
        """Evaluate JavaScript expression"""
        print(f"🔧 Evaluating: {expression[:100]}...")
        
        try:
            # Get or create tab
            tab = self.get_or_create_tab()
            if not tab:
                print("❌ Failed to get browser tab")
                return None
                
            tab_id = tab['id']
            
            # Enable Runtime
            self.send_cdp_command(tab_id, "Runtime.enable")
            
            # Evaluate expression
            result = self.send_cdp_command(tab_id, "Runtime.evaluate", {
                "expression": expression,
                "returnByValue": True
            })
            
            if result.get('exceptionDetails'):
                print(f"❌ JavaScript error: {result['exceptionDetails']}")
                return None
            
            value = result.get('result', {}).get('value')
            print(f"✅ Result: {value}")
            return value
            
        except Exception as e:
            print(f"❌ Evaluation failed: {e}")
            return None

def main():
    parser = argparse.ArgumentParser(description='Apex Dashboard Project Manager - Chrome Dev Profile Integration')
    
    # Session hooks
    parser.add_argument('--startup', action='store_true', help='Session startup hook')
    parser.add_argument('--shutdown', action='store_true', help='Session shutdown hook')
    
    # Browser client - navigation and info
    parser.add_argument('--screenshot', action='store_true', help='Take browser screenshot')
    parser.add_argument('--navigate', type=str, help='Navigate to URL')
    parser.add_argument('--verify', action='store_true', help='Verify CDP browser connection')
    parser.add_argument('--reload', action='store_true', help='Reload current page')
    
    # Browser client - interaction
    parser.add_argument('--scroll', type=str, choices=['up', 'down', 'left', 'right', 'top', 'bottom'], help='Scroll page in direction')
    parser.add_argument('--scroll-pixels', type=int, help='Number of pixels to scroll (default: 500 for up/down, 300 for left/right)')
    parser.add_argument('--click', type=str, help='Click at coordinates (format: "x,y")')
    parser.add_argument('--type', type=str, help='Type text into focused element')
    parser.add_argument('--key', type=str, help='Press specific key (Enter, Escape, Space, Arrow keys, etc.)')
    parser.add_argument('--evaluate', type=str, help='Evaluate JavaScript expression')
    
    # Project management
    parser.add_argument('--update-directory', action='store_true', help='Update PROJECT_DIRECTORY.md')
    
    args = parser.parse_args()
    manager = ApexProjectManager()
    
    # Execute commands
    if args.startup:
        manager.session_startup()
    elif args.shutdown:
        manager.session_shutdown()
    elif args.screenshot:
        manager.browser_screenshot()
    elif args.navigate:
        manager.browser_navigate(args.navigate)
    elif args.verify:
        manager.browser_verify()
    elif args.reload:
        manager.browser_reload()
    elif args.scroll:
        manager.browser_scroll(args.scroll, args.scroll_pixels)
    elif args.click:
        try:
            x, y = map(int, args.click.split(','))
            manager.browser_click(x, y)
        except ValueError:
            print("❌ Invalid click coordinates. Use format: 'x,y' (e.g., '100,200')")
    elif args.type:
        manager.browser_type(args.type)
    elif args.key:
        manager.browser_key(args.key)
    elif args.evaluate:
        manager.browser_evaluate(args.evaluate)
    elif args.update_directory:
        manager.update_project_directory()
    else:
        # Default: show status
        is_running, cdp_info = manager.browser_status()
        print("Apex Dashboard Project Manager - Chrome Dev Profile Integration")
        print("=" * 60)
        if is_running:
            print(f"✅ Chrome dev profile: Connected on port {cdp_info['cdp_port']}")
        else:
            print("❌ Chrome dev profile: Not running")
            print("\nLaunch with: ./scripts/launch-dev-chrome.sh")
        print("\nAvailable commands:")
        print("  --screenshot          Take a screenshot")
        print("  --navigate <url>      Navigate to URL")
        print("  --verify              Verify connection")
        print("  --reload              Reload current page")
        print("  --scroll <direction>  Scroll page")
        print("  --click x,y           Click at coordinates")
        print("  --type 'text'         Type text")
        print("  --key <key>           Press key")
        print("\nUse --help for all options")

if __name__ == '__main__':
    main()