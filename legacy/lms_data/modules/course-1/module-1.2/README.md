# Module 1.2: Laser Classification System

## Overview

This interactive module teaches the IEC 60825-1 and FDA laser classification system. Learners master the 7 laser classes, their Accessible Emission Limits (AEL), and required control measures through interactive sorting challenges and classification scenarios.

**Duration:** 18 minutes  
**Course:** Laser Safety Fundamentals (Course 1)  
**Prerequisites:** Module 1.1 - Introduction to Laser Hazards  
**Next Module:** Module 2.1 - Biological Effects

## Learning Objectives

Upon completion, learners will be able to:

1. Identify all 7 laser classes (1, 1M, 2, 2M, 3R, 3B, 4) and their characteristics
2. Understand Accessible Emission Limits (AEL) for each class
3. Determine required control measures by laser class
4. Apply classification criteria to real-world laser products
5. Recognize when Class 1/2M conditions apply

## Module Structure (4-Phase Architecture)

### Phase 1: Warm-up (3 min)
**"The Classification Challenge"**

Quick classification quiz with common items:
- CD Player (0.5 mW) → Class 1
- Presentation Pointer (5 mW) → Class 3R
- Industrial Cutter (2000 W) → Class 4

Each item uses HTML `<details>` element for progressive disclosure of answers, encouraging active engagement.

### Phase 2: Core Concept (6 min)
**"Understanding the Classification System"**

Three interactive components:

1. **Classification Pyramid**
   - Visual pyramid showing hazard hierarchy
   - Tap to explore each of the 7 classes
   - Detailed characteristics and requirements for each
   - Color-coded by hazard level

2. **AEL Explorer**
   - Reference chart showing AELs for each class
   - Classification calculator with:
     - Wavelength slider (200-1500 nm)
     - Power input
     - Real-time classification display
   - Educational notes on classification complexity

3. **Control Measures Matrix**
   - Interactive class selector
   - Shows required controls for each class
   - Categories: Engineering, Administrative, PPE
   - Dynamic highlighting of applicable measures

### Phase 3: Practice (5 min)
**"Classification Sorting Challenge"**

Drag-and-drop sorting activity:
- 8 laser products to classify
- 7 classification zones
- Real-time feedback on placement
- Score tracking with retry option

**Items:**
- 5 mW Green Pointer → Class 3R
- CD Player → Class 1
- Fiber Test Source → Class 1M
- 0.5 mW Red Pointer → Class 2
- 10W Research Laser → Class 4
- Barcode Scanner → Class 2M
- 300 mW Medical Laser → Class 3B
- 2 mW Laser Level → Class 2

### Phase 4: Challenge (4 min)
**"Expert Classification Challenge"**

5 realistic classification scenarios with:
- Laser specifications (wavelength, power, divergence)
- Intended use context
- Progressive hint system (3 hints per scenario)
- Multiple choice classification
- Detailed explanations

**Scenarios include:**
1. CD Player Laser (Class 1 - enclosed)
2. 4.9 mW Red Pointer (Class 3R - exceeds Class 2)
3. Fiber Test Source with high divergence (Class 1M)
4. 2000W Industrial Laser (Class 4 - high power)
5. 0.8 mW Green Pointer (Class 2 - within limits)

## Technical Implementation

### Components

| Component | Purpose | Key Features |
|-----------|---------|--------------|
| `ClassificationPyramid` | Visual hierarchy of laser classes | Interactive pyramid, detailed class info |
| `AELExplorer` | Teach AEL concepts | Reference chart, classification calculator |
| `ControlMeasuresMatrix` | Show control requirements | Class selector, dynamic measure highlighting |
| `ClassificationSorting` | Practice classification | Drag-and-drop, real-time feedback |

### Data Structure

```typescript
// Content in data.ts
- moduleInfo: Module metadata
- laserClasses: All 7 classes with characteristics
- classificationScenarios: 5 real-world scenarios
- controlMeasures: Required controls by class
- quizQuestions: Knowledge check questions
- sortingItems: Classification practice items
- aelReference: AEL values and notes
```

### Classification Data

**Class 1** - Green (#10B981) - Inherently Safe  
**Class 1M** - Light Green (#34D399) - Safe Without Magnification  
**Class 2** - Amber (#F59E0B) - Blink Reflex Protection  
**Class 2M** - Light Amber (#FBBF24) - Blink Reflex + No Magnification  
**Class 3R** - Orange (#F97316) - Reduced Risk  
**Class 3B** - Red (#EF4444) - Direct Beam Hazard  
**Class 4** - Dark Red (#DC2626) - Maximum Hazard  

## Interactive Elements

### Classification Pyramid
- 4-level visual pyramid
- Hover animations
- Expandable detail panels
- Color-coded by hazard

### AEL Calculator
- Wavelength slider with spectrum gradient
- Power input with range validation
- Real-time classification updates
- Wavelength-appropriate color coding

### Control Measures Matrix
- Tabular view of all control measures
- Dynamic highlighting based on selected class
- Three categories with icons

### Sorting Challenge
- Drag-and-drop interface
- 8 items to classify
- 7 drop zones
- Score calculation
- Visual feedback (✓/✗)

### Scenario Challenge
- Multi-step progression
- Progressive hint system
- Detailed explanations
- Navigation between scenarios

## Pedagogical Approach

### Andragogy Principles Applied

1. **Self-Directed**: Learners choose their path through pyramid exploration
2. **Experience-Based**: Real-world classification scenarios
3. **Problem-Centered**: Sorting challenge presents authentic task
4. **Immediate Application**: Classification calculator for immediate practice

### Retention Strategies

- **Active Recall**: Quiz questions at end of core content
- **Spaced Practice**: Classification scenarios reinforce sorting activity
- **Concrete Examples**: Real laser products, not abstractions
- **Elaborative Interrogation**: "Why is this the correct classification?"

## Accessibility

- Keyboard navigation for all interactive elements
- Screen reader announcements for dynamic content
- High contrast mode support
- ARIA labels on interactive elements
- Focus management for modals/overlays

## Standards Alignment

- **ANSI Z136.1-2022**: Section 3.2 Classification
- **IEC 60825-1:2014**: Classification system
- **FDA 21 CFR 1040.10**: Laser classes and AELs

## Common Misconceptions Addressed

1. **"Class 1 lasers are always low power"**
   - Module shows Class 1 can contain Class 4 lasers
   - Emphasizes enclosure-based safety

2. **"Class 2 lasers are completely safe"**
   - Explains blink reflex limitation
   - Demonstrates deliberate staring hazard

3. **"3R means 'relatively safe'"**
   - Clarifies "Reduced Risk" means still potentially hazardous
   - Compares 3R AEL to MPE

4. **"Class 4 is only dangerous with direct exposure"**
   - Highlights diffuse reflection hazard
   - Shows fire hazard capability

## Integration

```tsx
import ClassificationModule from './lms_data/modules/course-1/module-1.2';

function App() {
  return <ClassificationModule />;
}
```

## Files

```
module-1.2/
├── index.tsx              # Main module component
├── types.ts               # TypeScript definitions
├── data.ts                # Content and quiz data
├── styles.module.css      # Component styles
├── README.md              # This file
└── components/
    ├── ClassificationPyramid.tsx
    ├── AELExplorer.tsx
    ├── ControlMeasuresMatrix.tsx
    └── ClassificationSorting.tsx
```

## Testing Checklist

- [ ] All 7 classes display correctly in pyramid
- [ ] AEL calculator gives correct classifications
- [ ] Sorting challenge accepts correct answers
- [ ] All 5 scenarios work with hints
- [ ] Mobile responsive at 320px width
- [ ] Keyboard navigation works throughout
- [ ] Screen reader announces state changes

## Future Enhancements

- [ ] Add Class 1M/2M optics demonstration
- [ ] Include pulsed laser classification
- [ ] Add AEL table lookup exercises
- [ ] Integrate with LSO workflow scenarios
- [ ] Add printable classification reference card

## Credits

Developed by Module Builder Agent C1-A  
Laser Safety LMS Swarm  
March 2026
