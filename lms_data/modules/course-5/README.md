# Course 5: International Regulations - Part 2

## Modules Overview

This directory contains interactive educational modules for **Course 5: International Regulations** (Part 2), covering Australia & New Zealand standards, IEC 60825-1 harmonization, and international show documentation.

---

## Module 5.4: Australia & New Zealand Standards

**Location:** `module-5.4/`

### Learning Objectives
- Understand the AS/NZS 4173 standard structure and key requirements
- Navigate Australian state/territory radiation protection requirements
- Explain New Zealand's laser operator licensing system
- Apply ILDA country categories for international show planning

### Interactive Components

#### 1. CountryClassificationSystem.tsx
An interactive guide to ILDA country categories (A, B, F, G, X):

- **Category A (Minimal Regulation):** Mexico, Caribbean, parts of Middle East/Asia
  - No permits required
  - Follow IEC 60825-3 guidelines
  
- **Category B (Notification System):** Canada, Japan, South Korea, Switzerland
  - Advance notification required
  - Show documentation submission
  
- **Category F (Full Regulatory):** USA, Germany, UK, Australia, Netherlands
  - Formal permits required
  - LSO must be present
  - Equipment inspection may be required
  
- **Category G (Government Controlled):** China, Russia, Singapore, UAE
  - Extensive permit processes
  - Government agency oversight
  - Local partnerships necessary
  
- **Category X (Restricted/Prohibited):** Saudi Arabia (outdoor), India
  - Significant restrictions
  - Special waivers may be required

Features:
- Category selection with visual indicators
- Requirement breakdown (permits, notification, LSO)
- Australia state/territory detail table
- New Zealand specific requirements

#### 2. ASNZS4173Navigator.tsx
Interactive navigator for the Australia/New Zealand laser safety standard:

Sections covered:
1. Scope and Application
2. Laser Classification System
3. Maximum Permissible Exposure (MPE)
4. Nominal Ocular Hazard Distance (NOHD)
5. Engineering Controls
6. Administrative Controls
7. Personal Protective Equipment
8. Medical Examinations

Entertainment-specific guidance includes:
- Audience scanning requirements
- Outdoor show considerations
- Temporary installation requirements
- New Zealand operator licensing

---

## Module 5.5: IEC 60825-1 & ISO Harmonization

**Location:** `module-5.5/`

### Learning Objectives
- Compare key differences between IEC 60825-1 editions
- Understand the relationship between IEC and ISO standards
- Identify national deviations from international standards
- Apply edition-specific requirements for international trade

### Interactive Components

#### IECEditionComparator.tsx
Comprehensive comparison tool for IEC 60825-1 editions:

**Three Views:**
1. **Edition Comparison:** Side-by-side comparison of Edition 2 (2001) vs Edition 3 (2014)
   - Classification changes
   - AEL tables
   - Measurement conditions
   - Extended sources criteria
   - Time bases
   - MPE values
   - Biological basis updates
   - Fiber optics
   - LED provisions
   - Information requirements

2. **Evolution Timeline:** Historical view from 1984 to 2022
   - First Edition (1984)
   - Edition 2 (2001)
   - Edition 3 (2014)
   - Latest amendments (2022)

3. **ISO Standards & Harmonization:**
   - ISO 11553 series (laser processing machines)
   - ISO 17526 (ophthalmic instruments)
   - ISO 21254 (test methods)
   - ISO/TR 23115 (near-field effects)
   - Global harmonization status by region

Features:
- Impact filtering (Low, Medium, High, Critical)
- Detailed change descriptions
- Color-coded harmonization status

---

## Module 5.6: International Show Documentation

**Location:** `module-5.6/`

### Learning Objectives
- Prepare comprehensive documentation packages for international shows
- Navigate temporary equipment import procedures
- Calculate permit requirements by destination country
- Plan international show timelines with regulatory considerations

### Interactive Components

#### 1. OverseasShowPlanner.tsx
"I'm Taking My Show Overseas" interactive planner:

**Planning Stages:**
1. **Initial Research & Assessment** (8-12 weeks before)
   - Identify ILDA category
   - Research local regulations
   - Contact regulatory authorities
   - Assess import procedures

2. **Permit Applications** (6-8 weeks before)
   - Laser show permits
   - Venue approvals
   - Import authorizations
   - Work permits/visas

3. **Documentation Package** (4-6 weeks before)
   - Document translation
   - Equipment certifications
   - Show descriptions
   - MPE compliance

4. **Equipment & Logistics** (3-4 weeks before)
   - ATA Carnet arrangements
   - Shipping coordination
   - Power compatibility
   - Venue access confirmation

5. **Final Preparations** (1-2 weeks before)
   - Permit confirmation
   - Crew briefing
   - Backup planning
   - Documentation review

Features:
- Interactive task checklist
- Progress tracking
- Equipment considerations guide
- Common issues and solutions
- Quick reference lead times

#### 2. DocumentationChecklistGenerator.tsx
Customizable checklist generator:

**Document Categories:**
- Regulatory Documentation (permits, licenses, insurance)
- Equipment Documentation (specs, certifications, Carnet)
- Safety Documentation (MPE calcs, NOHD, emergency plans)
- Personnel Documentation (qualifications, crew list, passports)
- Show Documentation (descriptions, scripts, layouts)

Features:
- Category-specific filtering
- Translation requirement indicators
- Required vs. optional document marking
- Print and export functionality
- Progress tracking

#### 3. PermitCalculator.tsx
Permit requirement and timeline calculator:

**Supported Countries:**
- United States (Category F)
- Germany (Category F)
- United Kingdom (Category F)
- Australia (Category F)
- Canada (Category B)
- Japan (Category B)
- UAE (Category G)
- China (Category G)
- Mexico (Category A)
- Singapore (Category G)

**Features:**
- Category filtering
- Show size selection (Small/Medium/Large)
- Permit details with lead times
- Cost estimates
- Required document lists
- Timeline guidelines by category
- Action item recommendations

---

## Quiz Bank

**Location:** `lms_data/quiz_banks/course-5/modules-4-5-6-quiz.json`

18 questions covering:
- Module 5.4: 5 questions (ILDA categories, Australian states, NZ requirements)
- Module 5.5: 5 questions (IEC editions, ISO standards, harmonization)
- Module 5.6: 8 questions (documentation, permits, planning, timelines)

---

## Integration Guide

### React Component Usage

```tsx
// Module 5.4 components
import { CountryClassificationSystem, ASNZS4173Navigator } from './module-5.4';

// Module 5.5 components
import { IECEditionComparator } from './module-5.5';

// Module 5.6 components
import { OverseasShowPlanner, DocumentationChecklistGenerator, PermitCalculator } from './module-5.6';
```

### Module Configuration

Each module exports a `moduleConfig` object with:
- `id`: Module identifier
- `title`: Display title
- `description`: Module description
- `learningObjectives`: Array of learning objectives
- `interactiveComponents`: Array of available components

---

## Files Summary

```
lms_data/modules/course-5/
├── README.md
├── module-5.4/
│   ├── module_metadata.json
│   ├── index.tsx
│   └── components/
│       ├── CountryClassificationSystem.tsx
│       └── ASNZS4173Navigator.tsx
├── module-5.5/
│   ├── module_metadata.json
│   ├── index.tsx
│   └── components/
│       └── IECEditionComparator.tsx
└── module-5.6/
    ├── module_metadata.json
    ├── index.tsx
    └── components/
        ├── OverseasShowPlanner.tsx
        ├── DocumentationChecklistGenerator.tsx
        └── PermitCalculator.tsx
```

---

## Technical Notes

- All components are React functional components with TypeScript
- State management uses React hooks (useState)
- Styling uses Tailwind CSS classes
- Icons from lucide-react library
- Print/export functionality for checklists
- Responsive design for mobile and desktop

---

## Build Requirements

- React 18+
- TypeScript 4.5+
- Tailwind CSS 3.0+
- lucide-react
- Next.js (for App Router compatibility)
