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
        
        # Browser management
        self.cdp_info_file = self.claude_dir / "cdp-browser.json"
        self.chrome_user_data = self.claude_dir / "chrome-shared-profile"
        self.chrome_user_data.mkdir(exist_ok=True)
        
        # Chrome paths
        self.chrome_paths = [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",  # macOS
            "/usr/bin/google-chrome",  # Linux
            "/usr/bin/chromium-browser",  # Linux alternative
        ]
        
    # ===== BROWSER MANAGEMENT =====
    
    def find_chrome(self):
        """Find Chrome executable"""
        for path in self.chrome_paths:
            if Path(path).exists():
                return path
        raise FileNotFoundError("Chrome not found. Please install Google Chrome.")
        
    def find_free_port(self):
        """Find a free port for CDP"""
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.bind(('', 0))
            s.listen(1)
            port = s.getsockname()[1]
        return port
        
    def check_port(self, port):
        """Check if a port is accessible"""
        try:
            with urllib.request.urlopen(f"http://localhost:{port}/json/version", timeout=2) as response:
                return json.loads(response.read().decode())
        except:
            return None
            
    def start_browser(self):
        """Start shared Chrome browser with CDP"""
        chrome_path = self.find_chrome()
        cdp_port = self.find_free_port()
        
        chrome_args = [
            chrome_path,
            f"--remote-debugging-port={cdp_port}",
            f"--user-data-dir={self.chrome_user_data}",
            f"--remote-allow-origins=http://localhost:{cdp_port}",
            "--no-first-run",
            "--disable-default-apps",
            "--disable-popup-blocking",
            "--disable-translate",
            "http://localhost:5173"
        ]
        
        print(f"🚀 Starting shared Chrome browser on CDP port {cdp_port}...")
        
        chrome_process = subprocess.Popen(chrome_args, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        # Wait for Chrome to start
        for i in range(10):
            time.sleep(1)
            browser_info = self.check_port(cdp_port)
            if browser_info:
                break
        else:
            print("❌ Chrome failed to start")
            return None
            
        # Save CDP info
        cdp_info = {
            "cdp_port": cdp_port,
            "ws_endpoint": browser_info.get("webSocketDebuggerUrl", f"ws://localhost:{cdp_port}/devtools/browser"),
            "started_at": datetime.now().isoformat(),
            "pid": chrome_process.pid,
            "status": "running"
        }
        
        with open(self.cdp_info_file, 'w') as f:
            json.dump(cdp_info, f, indent=2)
            
        print(f"✅ Browser started on port {cdp_port}")
        return cdp_info
        
    def stop_browser(self):
        """Stop the shared browser"""
        try:
            with open(self.cdp_info_file, 'r') as f:
                cdp_info = json.load(f)
                
            pid = cdp_info.get('pid')
            if pid:
                try:
                    os.kill(pid, signal.SIGTERM)
                    print(f"✅ Stopped browser (PID: {pid})")
                except ProcessLookupError:
                    print(f"⚠️  Browser process {pid} not found")
                    
            cdp_info['status'] = 'stopped'
            with open(self.cdp_info_file, 'w') as f:
                json.dump(cdp_info, f, indent=2)
                
        except Exception as e:
            print(f"❌ Error stopping browser: {e}")
            
    def browser_status(self):
        """Check browser status - now connects to user's Chrome on port 9222"""
        try:
            # Check if user's Chrome is running with debugging on port 9222
            browser_info = self.check_port(9222)
            if browser_info:
                # Create/update CDP info for consistency
                cdp_info = {
                    "cdp_port": 9222,
                    "ws_endpoint": browser_info.get("webSocketDebuggerUrl", "ws://localhost:9222/devtools/browser"),
                    "status": "running",
                    "connection_type": "user_chrome",
                    "last_checked": datetime.now().isoformat()
                }
                
                # Save CDP info
                with open(self.cdp_info_file, 'w') as f:
                    json.dump(cdp_info, f, indent=2)
                    
                return True, cdp_info
            else:
                return False, None
        except Exception:
            return False, None
            
    def ensure_browser(self):
        """Ensure browser is running - now connects to user's Chrome"""
        is_running, cdp_info = self.browser_status()
        
        if is_running:
            print(f"✅ Connected to user's Chrome on port {cdp_info['cdp_port']}")
            return cdp_info
        else:
            print("❌ User's Chrome not found on port 9222")
            print("Please launch Chrome with: /Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222 --user-data-dir=~/dev-chrome")
            return None
            
    # ===== SESSION HOOKS =====
    
    def session_startup(self):
        """Called when Claude session starts"""
        print("🚀 Apex Claude Session Starting...")
        
        # Ensure browser is running
        cdp_info = self.ensure_browser()
        
        # CDP browser is ready for automation
        if cdp_info:
            print(f"🔗 CDP browser available on port {cdp_info['cdp_port']}")
        print("📸 Use: python3 scripts/project-manager.py --screenshot")
        print("🌐 Use: python3 scripts/project-manager.py --navigate <url>")
            
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
        # chrome-shared-profile: Chrome browser profile data (50MB+) used by CDP browser automation
        skip_dirs = {'.git', 'node_modules', 'dist', '.nuxt', '.next', 'coverage', '.pytest_cache', '__pycache__', 'chrome-shared-profile'}
        
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
        """Verify CDP browser connection and show details"""
        try:
            is_running, cdp_info = self.browser_status()
            if not is_running:
                print("❌ Browser not running")
                return False
                
            tabs = self.get_tabs()
            
            print(f"✅ Connected to shared browser on port {cdp_info['cdp_port']}")
            print(f"📋 Browser PID: {cdp_info['pid']}")
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
    parser = argparse.ArgumentParser(description='Apex Dashboard Project Manager')
    
    # Browser commands
    parser.add_argument('--browser-start', action='store_true', help='Start shared browser')
    parser.add_argument('--browser-stop', action='store_true', help='Stop shared browser')
    parser.add_argument('--browser-status', action='store_true', help='Check browser status')
    parser.add_argument('--browser-ensure', action='store_true', help='Ensure browser is running')
    
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
    if args.browser_start:
        manager.start_browser()
    elif args.browser_stop:
        manager.stop_browser()
    elif args.browser_status:
        is_running, cdp_info = manager.browser_status()
        if is_running:
            print(f"✅ Browser running on port {cdp_info['cdp_port']}")
        else:
            print("❌ Browser not running")
    elif args.browser_ensure:
        manager.ensure_browser()
    elif args.startup:
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
        print("Apex Dashboard Project Manager")
        print("=" * 40)
        if is_running:
            print(f"✅ Browser: Running on port {cdp_info['cdp_port']}")
        else:
            print("❌ Browser: Not running")
        print("\nUse --help for available commands")
        print("\nNew interaction commands:")
        print("  --scroll [up|down|left|right|top|bottom]")
        print("  --click x,y")
        print("  --type 'text to type'")
        print("  --key [Enter|Escape|Space|ArrowUp|ArrowDown|etc.]")
        print("  --evaluate 'JavaScript expression'")
        print("  --reload")

if __name__ == '__main__':
    main()