# Course 7: Event Safety - Interactive Planning Tool Specifications

## Module Builder Agent C7-A Completion Report

---

## Overview

This document provides detailed specifications for the interactive planning tools developed for Course 7: Event Safety. These tools enable hands-on learning through scenario-based interactions and practical safety planning exercises.

---

## Module 7.1: Event Safety Planning

### Tool 1: Safety Planning Timeline

**Purpose**: Guide learners through the complete event lifecycle with interactive checklists for each phase.

**Technical Specifications**:
- **Component Type**: Interactive Timeline with Progressive Disclosure
- **Input Methods**: Checkboxes, dropdown selections, text entries
- **Visual Design**: Horizontal timeline with expandable phase sections
- **Data Structure**: 
  ```typescript
  interface TimelinePhase {
    phaseId: string;
    name: string;
    timeline: string;
    checklistItems: ChecklistItem[];
    branchingScenario?: ScenarioNode;
  }
  ```

**Features**:
| Feature | Description | Implementation |
|---------|-------------|----------------|
| Phase Navigation | Click to expand/collapse phase details | Accordion component |
| Progress Tracking | Visual progress bar with completion percentage | Progress bar + percentage display |
| Item Priorities | Color-coded by CRITICAL/HIGH/MEDIUM | Red/Orange/Yellow badges |
| Branching Scenarios | Decision trees within timeline context | React state machine |
| Export | Generate planning checklist PDF | jsPDF integration |

**User Flow**:
1. User selects event phase (Concept → Pre-Production → Load-In → Show → Load-Out)
2. Each phase expands to reveal checklist items
3. User marks items complete with checkboxes
4. Critical items trigger confirmation dialogs
5. Branching scenarios present realistic dilemmas
6. Progress auto-saves to user profile

**Accessibility**:
- Full keyboard navigation (Tab, Space, Enter)
- ARIA labels for all interactive elements
- Screen reader announcements for phase changes
- High contrast mode support

---

### Tool 2: Hazard Assessment Walkthrough

**Purpose**: Virtual venue walkthrough to identify safety hazards before they become incidents.

**Technical Specifications**:
- **Component Type**: Interactive Hotspot Identification
- **Visual Base**: SVG venue floor plans with clickable areas
- **Interaction Model**: Click-to-identify with immediate feedback

**Features**:
| Feature | Description |
|---------|-------------|
| Multi-Zone Navigation | Entrance, Main Hall, Stage Front, Backstage areas |
| Hotspot Detection | Click hazard areas to identify issues |
| Severity Scoring | Critical/High/Medium/Low classification |
| Hint System | Progressive hints for difficult hazards |
| Reference Links | Direct links to code requirements |

**Scoring Algorithm**:
```
Score = (Hazards_Found × 10) + Completeness_Bonus(20) - Hints_Used(2 each)
Pass Threshold: 80 points
Critical Items: Must identify all to pass
```

---

## Module 7.2: Venue Assessment & Fire Safety

### Tool 3: Venue Assessment Tool

**Purpose**: Comprehensive venue safety assessment with standardized checklists and automated scoring.

**Technical Specifications**:
- **Component Type**: Multi-Category Assessment Form
- **Categories**: 5 assessment domains (Egress, Fire Protection, Electrical, Structural, Crowd)
- **Scoring System**: 4-tier classification (COMPLIANT/MINOR/MAJOR/CRITICAL)

**Assessment Categories**:
| Category | Color | Checklist Items | Weight |
|----------|-------|-----------------|--------|
| Means of Egress | Blue | 6 items | 25% |
| Fire Protection | Red | 5 items | 25% |
| Electrical Safety | Orange | 4 items | 20% |
| Structural Elements | Purple | 4 items | 20% |
| Crowd Infrastructure | Green | 3 items | 10% |

**Scoring Matrix**:
| Status | Points | Color | Action |
|--------|--------|-------|--------|
| COMPLIANT | 10 | #4CAF50 | Continue |
| MINOR_ISSUE | 5 | #FFC107 | Address soon |
| MAJOR_ISSUE | 2 | #FF9800 | Must correct |
| CRITICAL | 0 | #F44336 | Stop event |

**Report Generation**:
- Auto-generates assessment report
- Includes photo placeholders
- Provides corrective action recommendations
- Export formats: PDF, Excel, Shareable Link

---

### Tool 4: Fire Safety Inspector

**Purpose**: Virtual fire safety inspection simulation with realistic violation scenarios.

**Technical Specifications**:
- **Component Type**: Point-and-Click Inspection Game
- **Venue Areas**: Main Hall, Backstage, Lobby
- **Violation Types**: Egress obstruction, extinguisher access, exit signs, electrical, door hardware

**Violation Library**:
| ID | Type | Severity | Code Reference |
|----|------|----------|----------------|
| v1 | Egress Obstruction | CRITICAL | NFPA 101 |
| v2 | Extinguisher Access | HIGH | NFPA 10 |
| v3 | Exit Sign | HIGH | Life Safety Code |
| v4 | Electrical | HIGH | NEC |
| v5 | Storage | MEDIUM | NFPA 1 |
| v6 | Door Hardware | CRITICAL | Panic Hardware Req |

**Game Mechanics**:
1. User enters inspection mode for each area
2. Click suspicious elements to inspect
3. Correct identification = +10 points
4. Correction suggestion = +5 bonus
5. Time bonus for quick completion
6. Final report with findings

---

### Tool 5: Fire Extinguisher Selector

**Purpose**: Interactive tool to select appropriate extinguisher types for various fire scenarios.

**Fire Class Reference**:
| Class | Symbol | Fuels | Correct Extinguishers |
|-------|--------|-------|----------------------|
| A | 🟢 Green Triangle | Paper, wood, fabrics | Water, foam, ABC |
| B | 🔴 Red Square | Flammable liquids | Dry chemical, CO2, foam |
| C | 🔵 Blue Circle | Energized electrical | CO2, dry chemical |
| D | 🟡 Yellow Star | Combustible metals | Dry powder only |
| K | ⚫ Black Hexagon | Cooking oils/fats | Wet chemical |

**Scenario Types**:
- Merchandise area (Class A)
- Generator area (Class B)
- Audio equipment (Class C)
- Kitchen/catering (Class K)
- Special effects (Multiple classes)

---

## Module 7.3: Crowd Safety & Management

### Tool 6: Crowd Density Calculator

**Purpose**: Real-time crowd density calculation with visual representation and safety alerts.

**Technical Specifications**:
- **Component Type**: Interactive Calculator with Visualization
- **Calculation Modes**: Basic, Advanced, Visual Estimation
- **Visual Output**: Heat map + person icons

**Density Thresholds**:
| Level | Density (sq ft) | Density (m²) | Color | Action |
|-------|-----------------|--------------|-------|--------|
| Comfortable | ≤ 10 | ≤ 1.1 | 🟢 Green | Normal monitoring |
| Dense | 7 | 1.5 | 🟡 Yellow | Increase monitoring |
| Critical | 5 | 2.1 | 🟠 Orange | STOP ENTRY |
| Crush | 3.5 | 3.0 | 🔴 Red | Emergency response |

**Calculator Modes**:

**Mode 1: Basic**
- Inputs: Area length, width, occupant count
- Outputs: Density, safety rating, recommended action

**Mode 2: Advanced**
- Multi-zone configuration
- Entry/exit flow rates
- Time-based density projection
- Bottleneck identification

**Mode 3: Visual Estimation**
- Photo comparison exercises
- Historical incident densities
- Practice estimating real conditions

**Visualization Features**:
- Adjustable area dimensions
- Population slider (real-time update)
- Heat map overlay
- Color-coded risk zones
- Historical comparison overlay

---

### Tool 7: Emergency Egress Planner

**Purpose**: Drag-and-drop venue designer with egress calculation and evacuation simulation.

**Technical Specifications**:
- **Component Type**: Canvas-based Design Tool
- **Grid System**: 1-meter squares
- **Layers**: Floor plan, Occupancy, Egress paths, Exits, Emergency features

**Available Elements**:
| Category | Elements |
|----------|----------|
| Structures | Stage, Seating, Standing area, Barriers, Walls |
| Egress | Exit doors, Stairs, Ramps, Corridors, Assembly areas |
| Safety | Extinguishers, First aid, Emergency lights, Command post |

**Calculation Engine**:
```
Exit Capacity = Number of exits × Width × Flow rate

Flow Rates (persons/minute per meter):
- Level exit: 60
- Stair (down): 53  
- Stair (up): 40

Evacuation Time = Occupant load / Exit capacity
```

**Validation Rules**:
| Rule | Severity | Auto-Check |
|------|----------|------------|
| Minimum 2 exits remote from each other | CRITICAL | Yes |
| Exit capacity ≥ Required flow | CRITICAL | Yes |
| Travel distance within maximums | CRITICAL | Yes |
| Accessible egress for disabilities | CRITICAL | Yes |
| Assembly areas at safe distance | HIGH | Yes |

**Simulation Mode**:
- Agent-based crowd simulation
- Bottleneck identification
- Queue formation visualization
- Evacuation time estimation
- Congestion heat maps

**Scenario Templates**:
1. General Admission Concert Venue (5000 capacity)
2. Outdoor Festival Ground (15000 capacity)
3. Historic Theater Conversion (800 capacity)

---

### Tool 8: Crowd Surge Response Training

**Purpose**: Branching scenario training for recognizing and responding to dangerous crowd conditions.

**Scenario Types**:
1. **Surge Detection**: Identifying early warning signs
2. **Barrier Emergency**: Responding to structural concerns
3. **Evacuation Decision**: Weather and emergency scenarios

**Warning Signs Catalog**:
- Crowd surge indicators (waves, compression, distress)
- Barrier failure indicators (flexing, gaps, noise)
- Crowd collapse indicators (falls, cries, chaos)

**Response Options**:
Each scenario presents 3 options with outcomes:
- CORRECT: Appropriate safety-first response
- PARTIAL: Acceptable but could be improved
- DANGEROUS: Puts people at risk

**Feedback System**:
- Immediate outcome explanation
- Industry lessons referenced
- Correct action guidance
- Retry option for learning

---

## Technical Implementation Notes

### Component Architecture
```
/components/course-7
├── SafetyPlanningTimeline/
│   ├── TimelinePhase.tsx
│   ├── ChecklistItem.tsx
│   └── BranchingScenario.tsx
├── VenueAssessment/
│   ├── AssessmentForm.tsx
│   ├── CategorySection.tsx
│   └── ReportGenerator.tsx
├── FireSafetyInspector/
│   ├── InspectionCanvas.tsx
│   ├── ViolationHotspot.tsx
│   └── ScoreTracker.tsx
├── CrowdDensity/
│   ├── DensityCalculator.tsx
│   ├── Visualizer.tsx
│   └── HeatMap.tsx
├── EgressPlanner/
│   ├── DesignCanvas.tsx
│   ├── ElementPalette.tsx
│   ├── SimulationEngine.tsx
│   └── ValidationPanel.tsx
└── shared/
    ├── InteractiveDiagram.tsx
    ├── ProgressTracker.tsx
    └── FeedbackPanel.tsx
```

### State Management
- React Context for module state
- LocalStorage for progress persistence
- Server sync for completion tracking

### Accessibility Requirements
- WCAG 2.2 AA compliance
- Keyboard navigation for all tools
- Screen reader support
- Color-blind friendly palettes
- Reduced motion support

### Performance Targets
- Initial load: < 3 seconds
- Tool interaction: < 100ms response
- Simulation: 30 FPS minimum
- Mobile responsive: All tools

---

## Quiz Integration

Each module includes knowledge checks integrated with the quiz bank:

| Module | Quiz Questions | Types |
|--------|---------------|-------|
| 7.1 | 10 questions | MC, MS, T/F, Scenario |
| 7.2 | 10 questions | MC, Matching, T/F |
| 7.3 | 10 questions | MC, Calculation, T/F |

---

## Completion Criteria Summary

| Module | Interactive Exercises | Min Time | Pass Score |
|--------|---------------------|----------|------------|
| 7.1 | Safety Planning Timeline, Hazard Assessment, Stakeholder Coordination | 20 min | 80% |
| 7.2 | Venue Assessment Tool, Fire Safety Inspector, Extinguisher Selector | 22 min | 80% |
| 7.3 | Crowd Density Calculator, Emergency Egress Planner, Crowd Surge Responder | 24 min | 80% |

---

## Files Created

```
lms_data/modules/course-7/
├── module-7.1/
│   ├── module_metadata.json
│   └── lessons.json
├── module-7.2/
│   ├── module_metadata.json
│   └── lessons.json
├── module-7.3/
│   ├── module_metadata.json
│   └── lessons.json
└── PLANNING_TOOL_SPECIFICATIONS.md
```

---

## Research Alignment

These modules implement the technical training methodologies and interactive design patterns from the research findings:

1. **Scenario-Based Learning** (DMAS Framework): Applied in branching scenarios and hazard walkthroughs
2. **Progressive Disclosure**: Used in timeline tools and assessment categories
3. **Interactive Diagrams**: Visual density calculators and egress planners
4. **Competency Gates**: Mastery requirements before progression
5. **Spaced Repetition**: Quiz questions reinforce key concepts

---

*Report generated by Module Builder Agent C7-A*
*Date: 2026-03-19*
