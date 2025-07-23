#!/usr/bin/env python3
"""
Status Updater - Updates task status based on tool usage and file changes
Part of the Claude Code hook automation system
"""

import sys
import json
import re
import os
import argparse
from datetime import datetime
from pathlib import Path

class StatusUpdater:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.tasklist_path = self.project_root / "CORE_INITIATE" / "TASKLIST.md"
        self.memorylog_path = self.project_root / "CORE_INITIATE" / "MEMORYLOG.md"
        
        # Tool-to-status mapping
        self.tool_status_map = {
            'write': 'in_progress',
            'edit': 'in_progress',
            'multiedit': 'in_progress',
            'bash': 'in_progress',
            'read': None,  # Don't change status for read operations
            'glob': None,
            'grep': None
        }
        
        # Completion indicators
        self.completion_patterns = [
            r'test.*pass',
            r'build.*success',
            r'compilation.*success',
            r'all tests pass',
            r'✓.*complete',
            r'finished.*implement'
        ]
        
        # File patterns that indicate task progress
        self.progress_indicators = {
            'component': r'\.vue$',
            'style': r'\.(css|scss)$', 
            'script': r'\.(js|ts)$',
            'config': r'\.(json|yaml|yml)$',
            'test': r'\.(test|spec)\.(js|ts)$'
        }
        
        # Significant files that indicate architectural decisions
        self.architectural_files = {
            'main.ts': 'Application entry point configuration',
            'App.vue': 'Root application component structure',
            'router/index.ts': 'Routing architecture decisions', 
            'stores/': 'State management patterns',
            'composables/': 'Reusable logic patterns',
            'tailwind.config.js': 'Design system configuration',
            'vite.config.ts': 'Build tool configuration',
            'package.json': 'Dependency and script management',
            '.claude/settings.json': 'Development workflow configuration'
        }

    def process_tool_usage(self, tool_name, file_path=None, command=None):
        """Process tool usage and update relevant task status"""
        try:
            if tool_name.lower() not in self.tool_status_map:
                return
                
            target_status = self.tool_status_map[tool_name.lower()]
            if not target_status:
                return
            
            # Determine which tasks might be affected
            affected_tasks = self.find_related_tasks(file_path, command)
            
            if affected_tasks:
                self.update_task_status(affected_tasks, target_status)
                self.log_info(f"Updated {len(affected_tasks)} tasks to {target_status}")
            
            # Check for architectural significance and update memory
            if file_path:
                self.check_architectural_significance(file_path, tool_name)
            
        except Exception as e:
            self.log_error(f"Error processing tool usage: {e}")

    def find_related_tasks(self, file_path=None, command=None):
        """Find tasks related to the current operation"""
        try:
            with open(self.tasklist_path, 'r') as f:
                content = f.read()
            
            tasks = self.extract_tasks_from_content(content)
            related_tasks = []
            
            for task in tasks:
                if self.is_task_related(task, file_path, command):
                    related_tasks.append(task)
            
            return related_tasks
            
        except Exception as e:
            self.log_error(f"Error finding related tasks: {e}")
            return []

    def is_task_related(self, task, file_path=None, command=None):
        """Determine if a task is related to current operation"""
        task_content = task['content'].lower()
        
        # Check file path relevance
        if file_path:
            file_name = Path(file_path).name.lower()
            file_type = Path(file_path).suffix.lower()
            
            # Direct file name match
            if file_name in task_content:
                return True
                
            # File type relevance
            type_keywords = {
                '.vue': ['component', 'page', 'view'],
                '.css': ['style', 'css', 'design'],
                '.js': ['script', 'logic', 'function'],
                '.ts': ['typescript', 'type', 'interface'],
                '.md': ['document', 'readme', 'guide']
            }
            
            if file_type in type_keywords:
                if any(keyword in task_content for keyword in type_keywords[file_type]):
                    return True
        
        # Check command relevance
        if command:
            command_lower = command.lower()
            
            # Build/test commands
            if any(cmd in command_lower for cmd in ['npm run', 'pnpm', 'yarn']):
                if any(keyword in task_content for keyword in ['build', 'test', 'lint']):
                    return True
                    
            # Git commands
            if 'git' in command_lower:
                if any(keyword in task_content for keyword in ['commit', 'push', 'merge']):
                    return True
        
        return False

    def extract_tasks_from_content(self, content):
        """Extract task information from TASKLIST.md content"""
        tasks = []
        lines = content.split('\n')
        
        for i, line in enumerate(lines):
            # Match task lines: - [status] content
            task_match = re.match(r'^- \[([^\]]*)\] (.+)$', line.strip())
            if task_match:
                status_symbol = task_match.group(1)
                content = task_match.group(2)
                
                # Map status symbols to status names
                status_map = {
                    ' ': 'pending',
                    '🔄': 'in_progress', 
                    '✓': 'completed',
                    '❌': 'blocked',
                    '⏸️': 'paused',
                    '🔍': 'under_review',
                    '📋': 'planning'
                }
                
                status = status_map.get(status_symbol, 'pending')
                
                tasks.append({
                    'line_number': i,
                    'content': content,
                    'status': status,
                    'status_symbol': status_symbol,
                    'full_line': line
                })
        
        return tasks

    def update_task_status(self, tasks, new_status):
        """Update task status in TASKLIST.md"""
        try:
            with open(self.tasklist_path, 'r') as f:
                lines = f.readlines()
            
            # Status symbol mapping
            symbol_map = {
                'pending': '[ ]',
                'in_progress': '[🔄]',
                'completed': '[✓]',
                'blocked': '[❌]',
                'paused': '[⏸️]',
                'under_review': '[🔍]',
                'planning': '[📋]'
            }
            
            new_symbol = symbol_map.get(new_status, '[ ]')
            changes_made = 0
            
            for task in tasks:
                if task['status'] != new_status:
                    line_idx = task['line_number']
                    old_line = lines[line_idx]
                    
                    # Replace status symbol in the line
                    new_line = re.sub(
                        r'^(\s*- )\[[^\]]*\](.+)$',
                        f'\\1{new_symbol}\\2',
                        old_line
                    )
                    
                    lines[line_idx] = new_line
                    changes_made += 1
            
            if changes_made > 0:
                # Write updated content
                with open(self.tasklist_path, 'w') as f:
                    f.writelines(lines)
                    
                self.log_info(f"Updated {changes_made} task statuses to {new_status}")
                
        except Exception as e:
            self.log_error(f"Error updating task status: {e}")

    def check_architectural_significance(self, file_path, tool_name):
        """Check if file changes represent significant architectural decisions"""
        try:
            file_name = Path(file_path).name
            # Handle both absolute and relative paths
            if Path(file_path).is_absolute():
                try:
                    relative_path = str(Path(file_path).relative_to(self.project_root))
                except ValueError:
                    # File path is not under project root, use as-is
                    relative_path = file_path
            else:
                relative_path = file_path
            
            # Check if this is an architecturally significant file
            significant_change = None
            
            for pattern, description in self.architectural_files.items():
                if pattern.endswith('/'):
                    # Directory pattern
                    if pattern[:-1] in relative_path:
                        significant_change = f"Modified {description} in {relative_path}"
                        break
                else:
                    # File pattern
                    if file_name == pattern or relative_path.endswith(pattern):
                        significant_change = f"Updated {description}"
                        break
            
            # Also check for new component/page creation
            if file_name.endswith('.vue') and tool_name == 'write':
                # New Vue component created
                significant_change = f"Created new Vue component: {file_name}"
            elif file_name.endswith('.ts') and 'composables' in relative_path and tool_name == 'write':
                # New composable created
                significant_change = f"Created new composable: {file_name}"
            elif file_name.endswith('.ts') and 'stores' in relative_path and tool_name == 'write':
                # New store created
                significant_change = f"Created new Pinia store: {file_name}"
            
            if significant_change:
                self.update_memory_with_decision(significant_change, relative_path)
                
        except Exception as e:
            self.log_error(f"Error checking architectural significance: {e}")

    def update_memory_with_decision(self, decision, file_path):
        """Update memory log with significant architectural decision"""
        try:
            if not self.memorylog_path.exists():
                return
                
            with open(self.memorylog_path, 'r') as f:
                content = f.read()
            
            lines = content.split('\n')
            
            # Find the Technical Decisions section
            section_found = False
            insert_point = -1
            
            for i, line in enumerate(lines):
                if line.startswith('### Framework & Library Choices') or line.startswith('### Architecture Patterns'):
                    section_found = True
                    # Find the end of this section
                    for j in range(i + 1, len(lines)):
                        if lines[j].startswith('###') or lines[j].startswith('##'):
                            insert_point = j
                            break
                    if insert_point == -1:
                        insert_point = len(lines)
                    break
            
            if section_found:
                # Add the new decision
                timestamp = datetime.now().strftime('%Y-%m-%d')
                decision_entry = f"- **{decision}** ({timestamp}) - File: {file_path}"
                lines.insert(insert_point, decision_entry)
                
                # Update last modified date
                for i, line in enumerate(lines):
                    if line.startswith('*Last Updated:'):
                        lines[i] = f"*Last Updated: {timestamp}*"
                        break
                
                with open(self.memorylog_path, 'w') as f:
                    f.write('\n'.join(lines))
                    
                self.log_info(f"Updated memory with architectural decision: {decision}")
                
        except Exception as e:
            self.log_error(f"Error updating memory with decision: {e}")

    def check_completion_indicators(self, command=None):
        """Check if command output indicates task completion"""
        if not command:
            return False
            
        command_lower = command.lower()
        
        for pattern in self.completion_patterns:
            if re.search(pattern, command_lower):
                return True
                
        return False

    def log_info(self, message):
        """Log informational message"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] INFO: {message}", file=sys.stderr)

    def log_error(self, message):
        """Log error message"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] ERROR: {message}", file=sys.stderr)

def main():
    """Main entry point for hook execution"""
    parser = argparse.ArgumentParser(description='Update task status based on tool usage')
    parser.add_argument('--tool', required=True, help='Tool name that was used')
    parser.add_argument('--file', help='File path that was modified')
    parser.add_argument('--command', help='Command that was executed')
    
    args = parser.parse_args()
    
    try:
        updater = StatusUpdater()
        updater.process_tool_usage(args.tool, args.file, args.command)
        
        print(f"Status update completed for tool: {args.tool}")
        sys.exit(0)
        
    except Exception as e:
        print(f"Status updater error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()