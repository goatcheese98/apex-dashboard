#!/usr/bin/env python3
"""
Task Parser - Extracts tasks from user prompts and updates TASKLIST.md
Part of the Claude Code hook automation system
"""

import sys
import json
import re
import os
from datetime import datetime
from pathlib import Path

class TaskParser:
    def __init__(self):
        self.project_root = Path(__file__).parent.parent
        self.tasklist_path = self.project_root / "CORE_INITIATE" / "TASKLIST.md"
        self.memorylog_path = self.project_root / "CORE_INITIATE" / "MEMORYLOG.md"
        
        # Task detection patterns
        self.task_keywords = {
            'create': ['implement', 'create', 'build', 'add', 'develop', 'design', 'make'],
            'modify': ['update', 'fix', 'refactor', 'improve', 'optimize', 'change', 'modify'],
            'test': ['test', 'verify', 'validate', 'check', 'debug', 'ensure'],
            'document': ['document', 'explain', 'write', 'describe', 'record']
        }
        
        self.priority_indicators = {
            'high': ['urgent', 'critical', 'must', 'required', 'essential', 'asap'],
            'medium': ['should', 'important', 'needed', 'significant', 'necessary'],
            'low': ['could', 'nice to have', 'optional', 'later', 'eventually', 'might']
        }
        
        # Memory update patterns - what's worth remembering
        self.memory_indicators = {
            'user_preferences': ['prefer', 'like', 'want', 'always', 'never', 'usually'],
            'technical_decisions': ['use', 'choose', 'architecture', 'framework', 'library', 'approach'],
            'project_changes': ['change', 'shift', 'pivot', 'new direction', 'update goal'],
            'workflow_preferences': ['workflow', 'process', 'method', 'pattern', 'convention']
        }
        
        self.status_indicators = {
            'pending': ['[ ]', 'todo', 'need to', 'plan to'],
            'in_progress': ['[🔄]', 'working on', 'currently', 'in progress'],
            'completed': ['[✓]', 'done', 'completed', 'finished'],
            'blocked': ['[❌]', 'blocked', 'stuck', 'issue', 'problem']
        }

    def parse_user_prompt(self, prompt_data):
        """Parse user prompt and extract potential tasks"""
        try:
            user_prompt = prompt_data.get('userPrompt', '')
            if not user_prompt:
                return []
                
            tasks = []
            
            # Split prompt into sentences for analysis
            sentences = re.split(r'[.!?]+', user_prompt)
            
            for sentence in sentences:
                sentence = sentence.strip()
                if not sentence:
                    continue
                    
                task = self.analyze_sentence_for_task(sentence)
                if task:
                    tasks.append(task)
            
            return tasks
            
        except Exception as e:
            self.log_error(f"Error parsing prompt: {e}")
            return []

    def analyze_sentence_for_task(self, sentence):
        """Analyze individual sentence for task indicators"""
        sentence_lower = sentence.lower()
        
        # Check for task keywords
        task_type = None
        for category, keywords in self.task_keywords.items():
            if any(keyword in sentence_lower for keyword in keywords):
                task_type = category
                break
        
        if not task_type:
            return None
            
        # Determine priority
        priority = 'medium'  # default
        for level, indicators in self.priority_indicators.items():
            if any(indicator in sentence_lower for indicator in indicators):
                priority = level
                break
        
        # Extract main task content (remove common prefixes)
        task_content = sentence
        prefixes = ['please', 'can you', 'could you', 'i want to', 'let\'s', 'we need to']
        for prefix in prefixes:
            if sentence_lower.startswith(prefix):
                task_content = sentence[len(prefix):].strip()
                break
        
        return {
            'content': task_content,
            'type': task_type,
            'priority': priority,
            'status': 'pending',
            'timestamp': datetime.now().isoformat()
        }

    def update_tasklist(self, tasks):
        """Update TASKLIST.md with new tasks"""
        if not tasks:
            return
            
        try:
            # Read current tasklist
            if self.tasklist_path.exists():
                with open(self.tasklist_path, 'r') as f:
                    content = f.read()
            else:
                content = ""
            
            # Find insertion point (after "## Current Sprint:" section)
            lines = content.split('\n')
            insert_index = -1
            
            for i, line in enumerate(lines):
                if line.startswith('## Current Sprint:'):
                    # Find next empty line after section header
                    for j in range(i + 1, len(lines)):
                        if lines[j].strip() == '':
                            insert_index = j
                            break
                    break
            
            if insert_index == -1:
                # If no current sprint section, append to end
                insert_index = len(lines)
                lines.append('\n## Current Sprint: New Tasks\n')
            
            # Add new tasks
            new_task_lines = []
            if not any('### New Tasks' in line for line in lines):
                new_task_lines.append('### New Tasks')
                new_task_lines.append('')
            
            for task in tasks:
                status_symbol = '[ ]'  # default pending
                task_line = f"- {status_symbol} {task['content']}"
                new_task_lines.append(task_line)
                
                # Add metadata comment
                metadata = f"<!-- Type: {task['type']}, Priority: {task['priority']}, Added: {task['timestamp']} -->"
                new_task_lines.append(metadata)
                new_task_lines.append('')
            
            # Insert new tasks
            for i, line in enumerate(new_task_lines):
                lines.insert(insert_index + i, line)
            
            # Write updated content
            with open(self.tasklist_path, 'w') as f:
                f.write('\n'.join(lines))
                
            self.log_info(f"Added {len(tasks)} new tasks to TASKLIST.md")
            
        except Exception as e:
            self.log_error(f"Error updating tasklist: {e}")

    def extract_memory_updates(self, user_prompt):
        """Extract information worth remembering from user prompt"""
        if not user_prompt:
            return {}
            
        prompt_lower = user_prompt.lower()
        memory_updates = {}
        
        # Check for user preferences
        for indicator in self.memory_indicators['user_preferences']:
            if indicator in prompt_lower:
                # Extract the preference context
                sentences = user_prompt.split('.')
                for sentence in sentences:
                    if indicator in sentence.lower():
                        memory_updates.setdefault('user_preferences', []).append({
                            'preference': sentence.strip(),
                            'timestamp': datetime.now().isoformat(),
                            'context': 'user_prompt'
                        })
        
        # Check for technical decisions
        for indicator in self.memory_indicators['technical_decisions']:
            if indicator in prompt_lower:
                sentences = user_prompt.split('.')
                for sentence in sentences:
                    if indicator in sentence.lower():
                        memory_updates.setdefault('technical_decisions', []).append({
                            'decision': sentence.strip(),
                            'timestamp': datetime.now().isoformat(),
                            'context': 'user_prompt'
                        })
        
        # Check for project changes
        for indicator in self.memory_indicators['project_changes']:
            if indicator in prompt_lower:
                sentences = user_prompt.split('.')
                for sentence in sentences:
                    if indicator in sentence.lower():
                        memory_updates.setdefault('project_changes', []).append({
                            'change': sentence.strip(),
                            'timestamp': datetime.now().isoformat(),
                            'context': 'user_prompt'
                        })
        
        return memory_updates

    def update_memory(self, memory_updates):
        """Update MEMORYLOG.md with new information"""
        try:
            if not self.memorylog_path.exists():
                self.log_info("MEMORYLOG.md not found, skipping memory update")
                return
                
            with open(self.memorylog_path, 'r') as f:
                content = f.read()
            
            lines = content.split('\n')
            changes_made = False
            
            # Update user preferences section
            if 'user_preferences' in memory_updates:
                changes_made |= self._update_memory_section(
                    lines, 
                    "### Coding Style Preferences",
                    memory_updates['user_preferences'],
                    "preference"
                )
            
            # Update technical decisions section  
            if 'technical_decisions' in memory_updates:
                changes_made |= self._update_memory_section(
                    lines,
                    "### Framework & Library Choices", 
                    memory_updates['technical_decisions'],
                    "decision"
                )
            
            # Update project changes in current state
            if 'project_changes' in memory_updates:
                changes_made |= self._update_memory_section(
                    lines,
                    "### Project Phase",
                    memory_updates['project_changes'], 
                    "change"
                )
            
            if changes_made:
                # Update last modified date
                for i, line in enumerate(lines):
                    if line.startswith('*Last Updated:'):
                        lines[i] = f"*Last Updated: {datetime.now().strftime('%Y-%m-%d')}*"
                        break
                
                with open(self.memorylog_path, 'w') as f:
                    f.write('\n'.join(lines))
                    
                self.log_info("Updated MEMORYLOG.md with new insights")
                
        except Exception as e:
            self.log_error(f"Error updating memory: {e}")

    def _update_memory_section(self, lines, section_header, updates, update_key):
        """Helper method to update specific sections in memory log"""
        try:
            section_start = -1
            section_end = -1
            
            # Find the section
            for i, line in enumerate(lines):
                if line.startswith(section_header):
                    section_start = i
                    # Find the end of this section (next ### or ##)
                    for j in range(i + 1, len(lines)):
                        if lines[j].startswith('###') or lines[j].startswith('##'):
                            section_end = j
                            break
                    if section_end == -1:
                        section_end = len(lines)
                    break
            
            if section_start != -1:
                # Add new entries to the section
                insert_point = section_end if section_end != -1 else len(lines)
                
                for update in updates:
                    entry_line = f"- {update[update_key]} ({update['timestamp'][:10]})"
                    lines.insert(insert_point, entry_line)
                    insert_point += 1
                
                return True
                
        except Exception as e:
            self.log_error(f"Error updating memory section {section_header}: {e}")
            
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
    try:
        # Read JSON input from stdin
        input_data = json.loads(sys.stdin.read())
        
        parser = TaskParser()
        tasks = parser.parse_user_prompt(input_data)
        
        if tasks:
            parser.update_tasklist(tasks)
            print(f"Parsed and added {len(tasks)} tasks")
            
            # Update memory with important context
            memory_updates = parser.extract_memory_updates(input_data.get('userPrompt', ''))
            if memory_updates:
                parser.update_memory(memory_updates)
        else:
            print("No tasks detected in user prompt")
            
            # Even without tasks, check for memory-worthy information
            memory_updates = parser.extract_memory_updates(input_data.get('userPrompt', ''))
            if memory_updates:
                parser.update_memory(memory_updates)
            
        sys.exit(0)
        
    except Exception as e:
        print(f"Task parser error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()