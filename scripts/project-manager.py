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
        """Check browser status"""
        try:
            with open(self.cdp_info_file, 'r') as f:
                cdp_info = json.load(f)
                
            if cdp_info.get('status') != 'running':
                return False, cdp_info
                
            pid = cdp_info.get('pid')
            if pid:
                try:
                    os.kill(pid, 0)  # Check if process exists
                    if self.check_port(cdp_info.get('cdp_port')):
                        return True, cdp_info
                except ProcessLookupError:
                    pass
                    
            return False, cdp_info
        except FileNotFoundError:
            return False, None
            
    def ensure_browser(self):
        """Ensure browser is running"""
        is_running, cdp_info = self.browser_status()
        
        if is_running:
            print(f"✅ Browser already running on port {cdp_info['cdp_port']}")
            return cdp_info
        else:
            print("🔄 Starting browser...")
            return self.start_browser()
            
    # ===== SESSION HOOKS =====
    
    def session_startup(self):
        """Called when Claude session starts"""
        print("🚀 Apex Claude Session Starting...")
        
        # Ensure browser is running
        self.ensure_browser()
        
        # Create browser signal file for Playwright detection
        signal_file = self.claude_dir / "browser-ready.signal"
        with open(signal_file, 'w') as f:
            f.write("localhost:5173\n")
            f.write(f"{datetime.now().isoformat()}\n")
            f.write("shared-session-permanent\n")
            f.write("shared\n")
            
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
    
    def browser_screenshot(self):
        """Take a screenshot using CDP"""
        is_running, cdp_info = self.browser_status()
        if not is_running:
            print("❌ Browser not running")
            return
            
        print("📸 Taking screenshot...")
        # Basic implementation - would need websocket for full CDP
        print(f"Screenshot available at: http://localhost:{cdp_info['cdp_port']}")
        
    def browser_navigate(self, url):
        """Navigate browser to URL"""
        is_running, cdp_info = self.browser_status()
        if not is_running:
            print("❌ Browser not running")
            return
            
        print(f"🌐 Navigating to: {url}")
        # Basic implementation - would need websocket for full CDP
        print(f"Use CDP at: http://localhost:{cdp_info['cdp_port']}")

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
    
    # Browser client
    parser.add_argument('--screenshot', action='store_true', help='Take browser screenshot')
    parser.add_argument('--navigate', type=str, help='Navigate to URL')
    
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

if __name__ == '__main__':
    main()