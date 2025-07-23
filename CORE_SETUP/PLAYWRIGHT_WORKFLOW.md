# Playwright Debugging Workflow

This document establishes the automated debugging and monitoring workflow using Playwright MCP for continuous development oversight.

## Core Principles

### **Always-On Monitoring**
- Development server runs consistently at `localhost:5173`
- Playwright automatically monitors application state
- Cross-platform approach - no IDE-specific dependencies
- Real-time issue detection and resolution

### **Proactive Debugging Protocol**
Claude will automatically detect and fix:
- Console errors and warnings
- Failed imports or missing dependencies
- Routing issues and navigation problems
- Component rendering failures
- Network request issues
- JavaScript runtime errors
- Vue compilation problems

## Standard Debugging Routine

### **When Changes Are Made:**
1. **Automatic Browser Check** - Navigate to relevant pages using Playwright
2. **Console Log Analysis** - Read and analyze all console messages
3. **Visual Inspection** - Take snapshots to verify functionality
4. **Issue Detection** - Identify problems through automated testing
5. **Immediate Resolution** - Fix detected issues without delay
6. **Verification Testing** - Confirm fixes work correctly

### **Continuous Monitoring Includes:**
- Page load performance
- Component functionality testing
- Route navigation verification
- Theme switching validation
- Interactive element testing
- Error boundary testing
- Mobile responsiveness checks

## Implementation Guidelines

### **Automatic Fixes (No Permission Needed):**
- Console warnings and errors
- Import path corrections
- Missing dependency installations
- Route configuration issues
- Component state problems
- CSS/styling inconsistencies

### **Ask Before Fixing:**
- Major architectural changes
- New feature implementations
- Performance optimizations that change behavior
- Database or API modifications

### **Testing Protocol:**
- Test main routes: `/`, `/library`, `/lab`, `/tailwind-test`, `/dock-iterations`
- Verify dev tools functionality
- Check theme switching
- Validate component interactions
- Monitor for accessibility issues

## Playwright Commands Reference

### **Navigation & Inspection:**
```javascript
// Navigate to page
await page.goto('http://localhost:5173/route');

// Take snapshot for analysis
await page.screenshot();

// Check console messages
console.log(await page.evaluate(() => console.messages));

// Test element interactions
await page.click('[data-testid="element"]');
```

### **Error Detection Patterns:**
- Vite build errors in console
- Vue compilation warnings
- Missing module errors
- Network request failures
- JavaScript runtime exceptions
- CSS/styling issues

## Reporting Protocol

### **Issue Detection Format:**
1. **What Was Found** - Clear description of the issue
2. **Where It Occurred** - Specific page/component location
3. **Error Details** - Console logs, stack traces, screenshots
4. **Fix Applied** - Explanation of the solution implemented
5. **Verification** - Confirmation that the fix resolved the issue

### **Status Updates:**
- ✅ **Clean** - No issues detected
- ⚠️ **Minor** - Non-critical warnings present
- 🚨 **Error** - Critical issues requiring immediate attention
- 🔧 **Fixed** - Issues resolved and verified

## Development Integration

### **Workflow Integration:**
- Works with any IDE (Zed, VS Code, Vim, etc.)
- No special setup or extensions required
- Automatic detection of file changes via Vite HMR
- Continuous background monitoring during development

### **Performance Considerations:**
- Minimal impact on development server
- Efficient browser automation
- Quick issue detection and resolution
- Real-time feedback without interruption

## Emergency Procedures

### **If Playwright Loses Connection:**
1. Verify dev server is running at localhost:5173
2. Check browser automation permissions
3. Restart Playwright browser instance
4. Resume monitoring workflow

### **If Critical Errors Occur:**
1. Immediately document the error state
2. Take screenshots for diagnosis
3. Check recent file changes
4. Implement hotfix if possible
5. Verify fix with comprehensive testing

---

This workflow ensures continuous, automated quality assurance throughout the development process, allowing developers to focus on building features while maintaining application stability and performance.