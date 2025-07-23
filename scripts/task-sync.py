#!/usr/bin/env python3
"""
Task Synchronizer - Final synchronization between TASKLIST.md and MEMORYLOG.md
Part of the Claude Code hook automation system
"""

import sys
import json
import re
from datetime import datetime
from pathlib import Path

class TaskSynchronizer:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.tasklist_path = self.project_root / "CORE_INITIATE" / "TASKLIST.md"
        self.memorylog_path = self.project_root / "CORE_INITIATE" / "MEMORYLOG.md"

    def synchronize_tasks(self):
        """Synchronize completed tasks with MEMORYLOG.md"""
        try:
            completed_tasks = self.get_completed_tasks()
            significant_tasks = self.filter_significant_tasks(completed_tasks)
            
            if significant_tasks:
                self.update_memorylog(significant_tasks)
                self.archive_completed_tasks(significant_tasks)
                
            self.generate_session_summary()
            
        except Exception as e:
            self.log_error(f"Error synchronizing tasks: {e}")

    def get_completed_tasks(self):
        """Extract completed tasks from TASKLIST.md"""
        try:
            with open(self.tasklist_path, 'r') as f:
                content = f.read()
            
            completed_tasks = []
            lines = content.split('\n')
            
            for line in lines:
                # Match completed tasks: - [✓] content
                if re.match(r'^- \[✓\]', line.strip()):
                    task_content = re.sub(r'^- \[✓\]\s*', '', line.strip())
                    completed_tasks.append({
                        'content': task_content,
                        'completed_date': datetime.now().strftime("%Y-%m-%d"),
                        'full_line': line
                    })
            
            return completed_tasks
            
        except Exception as e:
            self.log_error(f"Error getting completed tasks: {e}")
            return []

    def filter_significant_tasks(self, tasks):
        """Filter tasks that are significant enough for MEMORYLOG.md"""
        significant_keywords = [
            'implement', 'create', 'build', 'design', 'architecture',
            'system', 'integration', 'feature', 'component', 'page',
            'api', 'database', 'authentication', 'testing', 'deployment'
        ]
        
        significant_tasks = []
        
        for task in tasks:
            task_lower = task['content'].lower()
            
            # Check for significant keywords
            if any(keyword in task_lower for keyword in significant_keywords):
                significant_tasks.append(task)
                continue
                
            # Check for substantial length (indicates detailed work)
            if len(task['content']) > 50:
                significant_tasks.append(task)
                continue
        
        return significant_tasks

    def update_memorylog(self, significant_tasks):
        """Update MEMORYLOG.md with significant achievements"""
        try:
            with open(self.memorylog_path, 'r') as f:
                content = f.read()
            
            # Find the "Working Features & Components" section
            lines = content.split('\n')
            insert_index = -1
            
            for i, line in enumerate(lines):
                if line.startswith('### Working Features & Components'):
                    # Find the end of this section
                    for j in range(i + 1, len(lines)):
                        if lines[j].startswith('###') or lines[j].startswith('##'):
                            insert_index = j
                            break
                    break
            
            if insert_index != -1:
                # Add new achievements
                new_lines = []
                for task in significant_tasks:
                    achievement_line = f"- ✅ {task['content']} ({task['completed_date']})"
                    new_lines.append(achievement_line)
                
                # Insert new achievements
                for i, line in enumerate(new_lines):
                    lines.insert(insert_index + i, line)
                
                # Update last modified date
                for i, line in enumerate(lines):
                    if line.startswith('*Last Updated:'):
                        lines[i] = f"*Last Updated: {datetime.now().strftime('%Y-%m-%d')}*"
                        break
                
                # Write updated content
                with open(self.memorylog_path, 'w') as f:
                    f.write('\n'.join(lines))
                
                self.log_info(f"Added {len(significant_tasks)} achievements to MEMORYLOG.md")
                
        except Exception as e:
            self.log_error(f"Error updating memorylog: {e}")

    def archive_completed_tasks(self, tasks):
        """Move completed tasks to archive section in TASKLIST.md"""
        try:
            with open(self.tasklist_path, 'r') as f:
                content = f.read()
            
            lines = content.split('\n')
            
            # Find and update archive section
            archive_index = -1
            for i, line in enumerate(lines):
                if line.startswith('## Completed Archive'):
                    archive_index = i
                    break
            
            if archive_index != -1:
                # Add today's date section if not exists
                today = datetime.now().strftime("%Y-%m-%d")
                date_section = f"### {today}"
                
                # Check if date section already exists
                date_exists = False
                for line in lines[archive_index:archive_index + 10]:
                    if date_section in line:
                        date_exists = True
                        break
                
                if not date_exists:
                    lines.insert(archive_index + 2, "")
                    lines.insert(archive_index + 2, date_section)
                    archive_index += 2
                
                # Add archived tasks
                for task in tasks:
                    archive_line = f"- [✓] {task['content']}"
                    lines.insert(archive_index + 3, archive_line)
                
                # Remove completed tasks from active sections
                self.remove_completed_from_active(lines, tasks)
                
                # Write updated content
                with open(self.tasklist_path, 'w') as f:
                    f.write('\n'.join(lines))
                
                self.log_info(f"Archived {len(tasks)} completed tasks")
                
        except Exception as e:
            self.log_error(f"Error archiving tasks: {e}")

    def remove_completed_from_active(self, lines, completed_tasks):
        """Remove completed tasks from active sections"""
        completed_contents = [task['content'] for task in completed_tasks]
        
        # Remove lines that match completed tasks
        i = 0
        while i < len(lines):
            line = lines[i]
            if re.match(r'^- \[✓\]', line.strip()):
                task_content = re.sub(r'^- \[✓\]\s*', '', line.strip())
                if task_content in completed_contents:
                    lines.pop(i)
                    continue
            i += 1

    def generate_session_summary(self):
        """Generate a summary of session progress"""
        try:
            with open(self.tasklist_path, 'r') as f:
                content = f.read()
            
            # Count tasks by status
            status_counts = {
                'pending': len(re.findall(r'- \[ \]', content)),
                'in_progress': len(re.findall(r'- \[🔄\]', content)),
                'completed': len(re.findall(r'- \[✓\]', content)),
                'blocked': len(re.findall(r'- \[❌\]', content))
            }
            
            total_tasks = sum(status_counts.values())
            
            if total_tasks > 0:
                completion_rate = (status_counts['completed'] / total_tasks) * 100
            else:
                completion_rate = 0
            
            summary = {
                'session_date': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'total_tasks': total_tasks,
                'status_counts': status_counts,
                'completion_rate': round(completion_rate, 1)
            }
            
            self.log_info(f"Session Summary: {summary}")
            
        except Exception as e:
            self.log_error(f"Error generating session summary: {e}")

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
    try:
        synchronizer = TaskSynchronizer()
        synchronizer.synchronize_tasks()
        
        print("Task synchronization completed")
        sys.exit(0)
        
    except Exception as e:
        print(f"Task synchronizer error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()