c# Apex Legends Tournament Dashboard - Project Requirements

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

### 3. Enhanced Floating Dock Control System

#### A. Dock Architecture
- **Enlarged Professional Design:** Dock size increased to 450-500px width × 80-90px height for better usability
- **Context-Aware Intelligence:** Dynamic controls that adapt based on currently displayed chart type
- **Enhanced Visual Styling:** Three distinct dock variations (Glassmorphic, Holographic, Morphing) with premium visual effects
- **Strategic Positioning:** Optimally placed to avoid obstruction while maintaining easy access
- **Advanced Translucency:** Enhanced glass effects with backdrop blur and dynamic lighting

#### B. Universal Core Features (All Charts)
- **Timeline Scrubbing (PRIMARY FEATURE):** 
  - Most prominent dock element with enhanced visual prominence
  - Scrubs from 0 (pregame) to maximum games (6-10+ range)
  - Universal control affecting all three chart types simultaneously
  - Large, interactive scrubber with clear visual feedback
- **Cumulative vs Individual Toggle:**
  - Controls data calculation method based on timeline position
  - **Cumulative Mode:** Aggregates data from game 1 to current timeline position
  - **Individual Mode:** Shows data only for the specific game at timeline position
  - Affects scatter plot and damage analysis calculations in real-time
- **Universal Game Filter System:**
  - Basic game filtering by clicking on game numbers
  - Filters data to show only selected game across all charts
  - Foundation for advanced filtering features (to be added later)
- **Play/Pause Controls:** Smooth animation controls with visual feedback

#### C. Chart-Specific Special Features

##### Race Chart Dock
- **Game Progression Controls:** Navigate through tournament games (1-10+)
- **View Switching:** Toggle between Points, Kills, and Damage display modes
- **Team Display Options:** Show all teams or apply performance-based cropping

##### Scatter Plot Dock (Kills vs Damage)
- **Triangulation Feature (CRITICAL):**
  - Toggle button to enable/disable triangulation mode
  - On hover over player point: draws connecting lines to teammates
  - Creates translucent triangle area showing team performance spread
  - Essential for understanding team cohesion and performance relationships

##### Damage Analysis Dock (Given vs Taken)
- **Player-wise Breakdown Toggle:**
  - Switches between team-aggregated and individual player damage display
  - **ON:** Stacked bars showing individual player contributions within team bars
  - **OFF:** Unified team damage bars (space-efficient approach)
  - Critical for detailed player performance analysis

#### D. Enhanced Visualization Switching
- **Carousel-Based Architecture:** Three slides (Race Chart, Scatter Plot, Damage Analysis)
- **Performance-Optimized:** Prevents DOM destruction through smart rendering
- **Smooth Transitions:** Fluid animations between different visualization types
- **Context Preservation:** Dock controls adapt automatically to active chart

#### E. Dock Visual Variations
- **Glassmorphic Style:** Enhanced glass effects with dynamic color blobs, advanced blur, and interactive lighting
- **Holographic Style:** Futuristic grid effects, animated corners, rotating borders, and dual ripple effects
- **Morphing Style:** Dynamic shape transformations with spring animations and gradient shifts

#### F. Advanced Interaction Model
- **Timeline-Centric Design:** Timeline scrubbing receives maximum visual priority and space
- **Smart Control Grouping:** Logical organization of play controls, timeline, toggles, and special features
- **Touch-Optimized:** Larger targets and improved spacing for mobile and tablet users
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
