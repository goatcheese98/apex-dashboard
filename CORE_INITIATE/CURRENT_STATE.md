# Current Development State

## Project Overview
**Apex Legends Tournament Dashboard** - Interactive data visualization platform for tournament analytics

## Development Phase
**Phase 1/8: Enhanced Dock System Development** - Advanced floating dock with contextual intelligence

## Active Sprint
**Dock Iterations & Enhancement** - Focus on professional-grade dock system with enhanced visual effects

## Technology Stack
- Vue 3 + TypeScript (Composition API + `<script setup>`)
- TailwindCSS v4 + DaisyUI v5+
- Pinia + Pinia Colada for state management
- Vite with Rolldown + OXC
- Playwright MCP for automated monitoring

## Development Server
localhost:5173 (Playwright monitoring active)

## Key Conventions (Deviations from Standard)
- Named exports preferred over default exports
- Strict TypeScript with interface over type
- File-based routing convention
- Utility-first CSS with semantic component enhancement
- Spec-driven workflow: Plan → Implement → Review

## Current Implementation Status

### ✅ Completed Features
- **Enhanced Dock Variations System**: 3 premium dock styles (Glassmorphic, Holographic, Morphing)
- **Carousel Architecture**: Performance-optimized slide system preventing DOM destruction
- **Pure CSS Effects**: Advanced animations using only CSS and Vue reactivity (no external libraries)
- **Contextual Dock Controls**: Different controls based on active chart type
- **Tournament Data Visualization**: Realistic horizontal race charts, scatter plots, and damage analysis

### 🔄 Current Focus Areas
- **Dock Size Enhancement**: Increasing dock dimensions to 450-500px × 80-90px
- **Timeline Scrubbing Implementation**: Making timeline the most prominent dock feature
- **Contextual Intelligence**: Dynamic dock controls based on chart type
- **Advanced Special Features**: Triangulation for scatter plots, player breakdown for damage analysis

### 📋 Key Technical Decisions
- **No External Animation Libraries**: All effects created with pure CSS animations and Vue reactivity
- **Context-Aware Design**: Dock adapts controls based on Race Chart, Scatter Plot, or Damage Analysis
- **Timeline-Centric Architecture**: Timeline scrubbing as the primary and most prominent dock feature

## User Preferences
- Creative freedom encouraged for dock layout experimentation
- Timeline scrubbing must be the most visually prominent feature
- Cumulative vs Individual toggle affects all chart calculations
- Batch development with detailed explanations
- Comment out old code before implementing new approaches
- Regular Git commits after significant features