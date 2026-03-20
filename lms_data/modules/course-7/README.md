# Course 7: Event Safety - Interactive Modules

## Overview

This directory contains three interactive educational modules for Course 7: Event Safety. These modules provide scenario-based learning for emergency response, weather protocols, and insurance/liability management in live entertainment events.

## Module Structure

Each module follows a consistent structure:

```
module-7.x/
├── module.json          # Module metadata and configuration
├── types.ts             # TypeScript type definitions
├── data.ts              # Module content, scenarios, and data
└── components/          # (Reserved for future React/Vue components)
```

## Modules Built

### Module 7.4: Emergency Response Procedures
**Duration:** 25 minutes | **Difficulty:** Intermediate

**Interactive Components:**
- **Emergency Response Simulator**: Multi-branching scenarios (Stage Collapse, Crowd Crush) with time-critical decisions
- **NIMS/ICS Role Explorer**: Interactive organizational chart with 8 key ICS positions
- **START Triage Trainer**: Practice triage categorization
- **Incident Documentation Trainer**: Form completion practice

**Key Content:**
- NIMS principles and HSPD-5
- ICS Command, Operations, Planning, Logistics, Finance sections
- Incident Commander, Safety Officer, and other role responsibilities
- Emergency service coordination (Police, Fire, EMS)
- Communication protocols and radio procedures
- 8 quiz questions with scenario-based assessment

---

### Module 7.5: Weather Protocols & Evacuation
**Duration:** 25 minutes | **Difficulty:** Intermediate | **Prerequisites:** Module 7.4

**Interactive Components:**
- **Weather Decision Matrix**: Interactive grid showing actions by condition and production area
- **Weather Decision Simulator**: Progressive weather scenarios with real-time decision making
- **Evacuation Route Planner**: Capacity and timing analysis for 4 evacuation routes
- **Alert Signal Trainer**: Air horn and radio signal recognition

**Key Content:**
- Weather thresholds: Critical (50+ MPH/Tornado), Warning (40+ MPH), Caution (30 MPH/8mi lightning), Monitor (20 MPH/20mi)
- Production area responses: Stage, LED Screens, Audio, Lights, Festival/Show
- Alert signals: 2 blasts (evacuate), 1 blast (delay), Radio (monitor)
- Evacuation procedures and routes
- Weather monitoring tools
- 8 quiz questions with decision timing evaluation

---

### Module 7.6: Insurance & Liability
**Duration:** 25 minutes | **Difficulty:** Intermediate | **Prerequisites:** Module 7.5

**Interactive Components:**
- **Liability Assessment Tool**: 8-factor risk calculator with coverage recommendations
- **Contract Clause Analyzer**: Indemnification, Insurance, Force Majeure, Liability Limitation review
- **Incident Documentation Trainer**: Guided form completion with validation
- **Liability Scenario Analyzer**: Stage collapse, laser injury case studies
- **Insurance Coverage Explorer**: 8 insurance types with comparison features

**Key Content:**
- 8 insurance types: General Liability, Event Cancellation, Workers Comp, E&O, Commercial Auto, Equipment, Excess/Umbrella, Cyber
- Contract clauses and red flags
- Risk assessment framework with 6 major risk categories
- Documentation requirements and retention periods
- Mutual aid agreements and liability implications
- 8 quiz questions with contract analysis

## Integration Guide

### Loading Module Data

```typescript
// Example: Loading module data
import { moduleInfo, phases, emergencyScenarios } from './module-7.4/data';
import { moduleInfo as weatherModule } from './module-7.5/data';
```

### Using the Emergency Simulator

The emergency simulator provides branching scenarios with:
- Multiple decision points per scenario
- Timed decisions (realistic pressure)
- Consequence tracking
- Impact assessment (positive/neutral/negative/critical)

```typescript
const scenario = emergencyScenarios[0]; // Stage collapse
const phase = scenario.phases[0];
const decision = phase.decisions[0];
// Present decision.options to user
// Track user choices and provide consequence feedback
```

### Using the Weather Decision Matrix

The decision matrix provides a lookup table for weather responses:

```typescript
const matrix = weatherDecisionMatrix;
// Access cell by row (threshold) and column (production area)
const action = matrix.cells[rowIndex][columnIndex];
// action.action = specific instruction
// action.timing = when to execute
// action.evacuationRequired = boolean
```

### Using the Liability Assessment Tool

The assessment tool calculates risk scores:

```typescript
const tool = liabilityAssessmentTool;
// Score each of the 8 factors
// Calculate weighted total
// Map to scoringMatrix for recommendations
```

## Content Sources

Module content is derived from:
- `lms_data/course-7-event-safety/modules/module-emergency-response.json`
- `lms_data/course-7-event-safety/modules/module-weather-protocols.json`
- `lms_data/course-7-event-safety/modules/module-insurance-liability.json`
- `lms_data/course-7-event-safety/knowledge-graph/emergency-response-kg.json`
- Event Safety Guide v1.1 - Chapter 3
- ANSI ES1.9 standards
- FEMA NIMS/ICS training materials

## Assessment

Each module includes:
- **8 quiz questions** (multiple choice)
- **80% passing score required**
- **Scenario-based assessments** with practical decision-making
- **Knowledge checks** embedded throughout

## Technical Notes

### TypeScript Support
All modules include full TypeScript type definitions for:
- Type safety
- IDE autocomplete
- Compile-time error checking

### Data Structure
- `module.json`: Metadata for LMS integration
- `types.ts`: TypeScript interfaces
- `data.ts`: Complete content and configuration

### Future Enhancements
The `components/` directories are reserved for future:
- React components
- Vue components  
- Interactive visualization components
- Assessment widgets

## Build Information

- **Built by:** Module Builder Agent C7-B
- **Build Date:** 2026-03-19
- **Version:** 1.0
- **Total Module Duration:** 75 minutes
- **Total Interactive Components:** 13
- **Total Quiz Questions:** 24

## Files Summary

```
lms_data/modules/course-7/
├── index.json              # Course module index
├── README.md               # This file
├── module-7.4/
│   ├── module.json         # 3.9 KB
│   ├── types.ts            # 2.6 KB  
│   └── data.ts             # 33.6 KB
├── module-7.5/
│   ├── module.json         # 4.8 KB
│   ├── types.ts            # 3.4 KB
│   └── data.ts             # 30.8 KB
└── module-7.6/
    ├── module.json         # 5.2 KB
    ├── types.ts            # 3.5 KB
    └── data.ts             # 40.1 KB
```

## Compliance Notes

Content aligns with:
- National Incident Management System (NIMS)
- Incident Command System (ICS) standards
- FEMA emergency response guidelines
- ANSI entertainment safety standards
- Industry best practices for event safety
