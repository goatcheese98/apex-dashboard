# Apex Legends Tournament Dashboard - Project Requirements

## Project Overview

A robust dashboard and data visualization application that utilizes tournament data from https://apexlegendsstatus.com/ to visualize Apex Legends tournament data in a modern, interactive way.

## Target Audience

- **Primary Users:**
  - Tournament organizers
  - Players
  - Fans
  - Analysts

## Core Philosophy

- **Simple First Impression:** Visual information should be immediately understandable
- **Deep AI-Powered Insights:** Complex logic and detailed information available through AI integration
- **Performance-Focused:** Highly performant animations and interactions
- **Mobile-First:** Responsive design with mobile as a key consideration

## Key Features

### 1. AI-Powered Analytics Platform
- **Integrated AI Platform:** Advanced querying capabilities for analysts
- **Contextual Responses:** AI focuses on current view while having access to historical data
- **Specific Game Analysis:** Ask detailed questions about individual matches/tournaments
- **Historical Data Access:** AI can reference past tournaments for context
- **Current View Priority:** Responses prioritize currently displayed data/filters
- **Platform Agnostic:** No specific AI platform preference (OpenAI, Claude, etc.)

### 2. Core Visualizations

#### A. Race Chart Visualizations
- **Primary Visualization Type:** Dynamic race charts for game progression
- **Tournament Structure Support:**
  - Multi-day tournaments (e.g., EWC 2025 - 3 days)
  - Group-based competitions
  - Match series tracking (Game 1 to Game 10+)
- **Playback Controls:**
  - Play/Pause button for animation control
  - Scrub bar for manual timeline navigation
  - User-controlled progression through matches
- **Team Display:**
  - Show all 20 teams by default
  - Subtle cropping options: Top 15, Top 5 performers
  - Cropping controls integrated subtly to avoid UI clutter
- **Cumulative Progression:** Scores/points accumulate from previous matches

#### B. Damage Analysis Dashboard
- **Team Damage Tracking:** Damage given and taken per team per match
- **Player Damage Sub-groups:** Individual player damage breakdown within teams
- **Cumulative Stacking:** Damage accumulates progressively as games progress
- **Real-time Updates:** Synchronized with race chart timeline

#### C. Performance Scatter Plot
- **Axes:** Kills (X) vs Damage (Y) per team/player
- **Game Progression:** Shows performance changes across matches
- **Cumulative by Default:** Points accumulate from previous games
- **Interactive Exploration:** Click and explore individual data points

### 3. Floating Dock Control System

#### A. Dock Architecture
- **Floating Translucent Design:** Adaptive dock that expands/contracts based on current view
- **Context-Aware Expansion:** Size adjusts dynamically to available controls
- **Positioning:** Strategically placed to avoid obstruction of key data
- **Translucency:** Semi-transparent to maintain visibility of underlying visualizations

#### B. Primary Controls
- **Timeline Slider:** Interactive scrubber for match progression control
- **Play/Pause Animation:** Smooth animation controls with visual feedback
- **Universal Filter Sync:** All changes affect race charts, damage diffs, and scatter plots simultaneously

#### C. Visualization Switching
- **Default View:** Race charts displayed at the top by default
- **Card Stack Animation:** Visualizations animate like stacked cards being lifted and unveiled
- **Smooth Transitions:** Fluid animations between different visualization types
- **View Toggle Button:** Simple button to cycle through visualization modes

#### D. Pre-Selection Workflow
- **Tournament Selection:** Choose specific tournament (e.g., EWC 2025)
- **Series Selection:** Select day/series within tournament
- **Match Selection:** Pick specific matches to analyze
- **Dynamic Dock Appearance:** Dock appears after all selections are made

#### E. Filter Controls
- **Game Selection Filters:** Toggle specific games (e.g., "Game 3, 5, and 7")
- **Team-specific filters:** Focus on particular teams
- **Performance threshold filters:** Filter by ranking/performance metrics
- **Real-time Synchronization:** Instant updates across all visualization types

### 4. Performance Requirements
- **Highly Performant Animations:** 60fps card stack transitions and dock animations
- **Smooth Interactive Experience:** Responsive controls with minimal latency
- **Optimized Rendering:** Efficient visualization updates during real-time filtering
- **Mobile-Optimized Dock:** Adaptive sizing and touch-friendly controls for mobile devices
- **GPU-Accelerated Transitions:** Hardware acceleration for card stack animations

## Technical Requirements

### Data Source
- **Primary API:** https://apexlegendsstatus.com/
- **Tournament Data Focus:** Multi-day tournaments with match series
- **Team Structure:** ~20 teams per tournament standard
- **Data Points Required:**
  - Team rankings/points per game
  - Player-level damage given/taken
  - Team-level damage statistics  
  - Kill counts per player/team
  - Game progression timeline data
- **API Reliability:** Confirmed working well for data extraction

### Platform Requirements
- **Desktop Experience:** Recommended for analysts (primary workspace)
- **Mobile Responsive:** Critical for broader audience reach
- **Cross-browser Compatibility:** Modern browsers support

### Optional Features
- **Authentication:** Not critical but can be added later
- **Offline Capabilities:** Nice to have, but internet connection assumed
- **Data Caching:** Recommended for performance optimization

## User Experience Goals

### For Tournament Organizers
- Quick overview of tournament progress
- Easy identification of leading teams
- Performance metrics across multiple games

### For Players
- Track personal/team performance
- Compare against other competitors
- Historical performance analysis

### For Fans
- Engaging visual representation of matches
- Easy-to-understand team rankings
- Interactive exploration of tournament data

### For Analysts
- Deep-dive capabilities through AI querying
- Detailed statistical breakdowns
- Historical trend analysis
- Custom data exploration tools

## Technical Stack Alignment

Based on existing project guidelines:
- **Framework:** Vue 3 with TypeScript
- **Styling:** TailwindCSS v4
- **State Management:** Pinia + Pinia Colada
- **Build Tool:** Vite with Rolldown + OXC
- **Data Visualization:** Chart.js, D3.js, or similar high-performance library
- **Animation Library:** Framer Motion, GSAP, or native CSS transforms for card animations
- **Dock Components:** Custom Vue components with advanced CSS animations
- **AI Integration:** To be determined based on chosen AI platform

## Success Metrics

- **Performance:** Sub-second load times for visualizations
- **Engagement:** High interactivity without performance degradation
- **Accessibility:** Usable across devices and user types
- **Scalability:** Support for multiple concurrent tournaments
- **Intelligence:** AI responses provide valuable insights to analysts

## Core Data Flow Architecture

### Cumulative Data Processing
- All visualizations use cumulative data by default
- Race charts: Points/rankings accumulate across games
- Damage analysis: Damage values stack progressively  
- Scatter plots: Kills and damage accumulate over time

### Universal State Management
- Single source of truth for game filters
- Synchronized updates across all three visualization types
- Real-time filter application (games 3, 5, 7 example)
- Performance-optimized state updates

## Development Priorities

1. **Phase 1:** Universal control system and state management foundation
2. **Phase 2:** Core race chart visualization with playback controls
3. **Phase 3:** Damage analysis dashboard with team/player breakdowns
4. **Phase 4:** Performance scatter plot with interactive exploration
5. **Phase 5:** API integration with apexlegendsstatus.com
6. **Phase 6:** AI platform integration with contextual responses
7. **Phase 7:** Mobile optimization and subtle UI enhancements
8. **Phase 8:** Advanced filtering and optional features