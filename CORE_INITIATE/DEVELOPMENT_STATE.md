# Development State & Context
*Last Updated: 2025-07-24*

## Current Development Phase
**Enhanced Dock System Implementation** - Building advanced dock controls for data visualizations

### Active Sprint
**Dock Enhancement Features** - Enlarging dock to 450-500px × 80-90px with timeline prominence

### Development Server
localhost:5173 (CDP browser running on port 57290)

## ✅ Browser Coordination - SOLVED!

### Solution Summary
The multi-Claude browser coordination issue has been permanently resolved using Chrome DevTools Protocol (CDP).

**Implementation:**
- Single Chrome instance launched outside Claude/Playwright MCP
- All Claude sessions connect via CDP WebSocket
- True browser state sharing - no isolation
- Zero conflicts between sessions

**How to Use:**
```bash
# Start any Claude session with:
./scripts/apex-claud
```

**Key Files:**
- `scripts/cdp-browser-lite.py` - Browser manager (no dependencies)
- `scripts/cdp-browser-client.py` - Browser interaction client
- `scripts/apex-claud` - Session launcher with auto-browser support
- `.claude/cdp-browser.json` - Browser connection info

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