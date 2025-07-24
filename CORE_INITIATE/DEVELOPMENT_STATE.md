# Development State & Context
*Last Updated: 2025-07-24*

## Current Development Phase
**Enhanced Dock System Implementation** - Building advanced dock controls for data visualizations

### Active Sprint
**Dock Enhancement Features** - Enlarging dock to 450-500px × 80-90px with timeline prominence

### Development Server
localhost:5173 (Chrome dev profile on port 9222)

## ✅ Browser Coordination - Chrome Dev Profile

### Solution Summary
Browser coordination uses Chrome DevTools Protocol (CDP) with your personal Chrome dev profile for direct visual feedback and multi-project support.

**Chrome Dev Profile Features:**
- Launch personal Chrome with debugging flags
- Direct visual feedback in your browser
- Works across multiple projects
- Full browser DevTools access
- Terminal-independent (survives terminal closure)

**How to Use:**
```bash
# Step 1: Launch your Chrome dev profile
./scripts/launch-dev-chrome.sh

# Step 2: Start Claude session
./scripts/apex-claude
# or just 'claude' from any directory
```

**Key Files:**
- `scripts/launch-dev-chrome.sh` - Chrome dev profile launcher
- `scripts/stop-dev-chrome.sh` - Stop Chrome dev profile
- `scripts/project-manager.py` - Browser interaction via CDP
- `scripts/apex-claude` - Session launcher with Chrome detection

## Implementation Progress

### ✅ Completed Features
- **CDP Browser Solution:** Complete multi-session browser sharing
- **Session Launcher:** apex-claud command handles everything
- **Documentation:** Clear usage instructions and architecture
- **Cleanup:** Removed all old browser coordination attempts

### 🔄 Current Focus Areas
- **Dock Size Enhancement:** Increase to 450-500px × 80-90px
- **Timeline Prominence:** Make scrubbing the primary visual element
- **Contextual Controls:** Chart-specific dock features
- **Special Features:** Triangulation (scatter) and player breakdown (damage)

## User Preferences & Workflow

### Immediate Priorities
1. **Enhance dock dimensions** to professional size
2. **Implement timeline scrubbing** as the dominant feature
3. **Add triangulation toggle** for scatter plot
4. **Add player breakdown toggle** for damage analysis

### Development Approach
- **Feature-First Development:** Focus on dock enhancements
- **Visual Excellence:** Premium glass/holographic effects
- **Performance Focus:** Smooth 60fps animations
- **Creative Freedom:** Experiment with dock layouts

## Technical Context

### CDP Browser Architecture
- **Browser Instance:** Chrome with CDP on port 57290
- **Connection Method:** WebSocket to CDP endpoint
- **State Persistence:** Browser survives Claude restarts
- **Zero Conflicts:** Unlimited Claude sessions supported

### Current Tech Stack
- **Framework:** Vue 3 + TypeScript
- **Styling:** TailwindCSS v4 with DaisyUI
- **Build:** Vite with Rolldown
- **State:** Pinia + Pinia Colada
- **Browser:** CDP-controlled Chrome

## Success Criteria

### ✅ **Browser Coordination Complete:**
- Multiple Claude sessions work without conflicts ✓
- Browser state shared across all sessions ✓
- No Playwright MCP isolation issues ✓
- Simple apex-claud command for all sessions ✓

### 📋 **Dock Enhancement Goals:**
- [ ] Dock enlarged to 450-500px × 80-90px
- [ ] Timeline scrubbing visually dominant
- [ ] Triangulation feature for scatter plot
- [ ] Player breakdown for damage analysis
- [ ] Smooth animations and transitions

---

*Browser coordination is fully resolved. Development focus is now on enhanced dock implementation.*