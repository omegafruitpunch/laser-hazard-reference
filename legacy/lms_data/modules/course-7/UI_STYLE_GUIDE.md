# Course 7: Event Safety - UI/UX Style Guide

## Design Philosophy

The Event Safety course design prioritizes **safety-first communication** with an **industrial production aesthetic**. Every element is optimized for on-site use by event safety professionals who need clear, immediate access to critical information.

---

## Core Design Principles

### 1. Safety-First Warning Colors
- **Critical/Danger**: `#DC2626` (Red) - Immediate action required
- **Warning**: `#F97316` (Amber/Orange) - Urgent attention needed  
- **Caution**: `#EAB308` (Yellow) - Be alert, prepare for action
- **Safe/Monitor**: `#16A34A` (Green) - Normal operations, continue monitoring

### 2. Mobile-First Design
All components designed for:
- Touch targets minimum **48px** (finger-friendly)
- Quick-access emergency buttons always visible
- Swipe gestures for rapid navigation
- Readable at arm's length in bright/dark conditions

### 3. Checklist-Focused Layout
- Collapsible checklist sections
- Visual progress indicators
- Priority highlighting (CRITICAL/HIGH/MEDIUM/LOW)
- One-tap completion with confirmation

### 4. Emergency-Ready Interface
- Persistent emergency FAB (Floating Action Button)
- Color-coded alert levels with animation
- Air horn signal references
- Radio communication protocols

---

## Color System

### Primary Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#FF6B00` | Brand accent, CTAs |
| Primary Dark | `#CC5500` | Hover states |
| Secondary | `#1A1A2E` | Dark backgrounds |
| Accent | `#FFD700` | Highlights, badges |

### Alert Palette
| Level | Hex | Usage |
|-------|-----|-------|
| Critical | `#991B1B` | Life-threatening situations |
| Danger | `#DC2626` | Immediate evacuation |
| Warning | `#F97316` | Severe conditions |
| Caution | `#EAB308` | Prepare for action |
| Success | `#16A34A` | All clear, compliant |
| Info | `#3B82F6` | Information only |

### Background Palette
| Surface | Hex | Usage |
|---------|-----|-------|
| Background | `#0F0F1A` | Main app background |
| Surface | `#1E1E2E` | Cards, panels |
| Elevated | `#2A2A3E` | Modals, popovers |

### Module-Specific Accents
| Module | Accent Color | Icon |
|--------|-------------|------|
| 7.1 Safety Planning | `#FF6B00` | 🛡️ |
| 7.2 Fire Safety | `#DC2626` | 🔥 |
| 7.3 Crowd Safety | `#22C55E` | 👥 |
| 7.4 Emergency Response | `#7C3AED` | 🚨 |
| 7.5 Weather Protocols | `#3B82F6` | ⛈️ |
| 7.6 Insurance/Liability | `#0891B2` | ⚖️ |

---

## Typography

### Font Stack
```css
--font-heading: 'Inter', system-ui, -apple-system, sans-serif;
--font-body: 'Inter', system-ui, -apple-system, sans-serif;
--font-emergency: 'Roboto Mono', monospace;
```

### Type Scale
| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| Hero | 2.5rem (40px) | 800 | Module titles |
| H1 | 2rem (32px) | 700 | Page headers |
| H2 | 1.5rem (24px) | 600 | Section headers |
| H3 | 1.25rem (20px) | 600 | Card titles |
| Body | 1rem (16px) | 400 | Paragraph text |
| Small | 0.875rem (14px) | 400 | Secondary text |
| Caption | 0.75rem (12px) | 500 | Labels, timestamps |
| Emergency | 1rem (16px) | 700 | Radio codes, alerts |

---

## Spacing System

### Touch Targets
| Element | Minimum Size | Spacing |
|---------|-------------|---------|
| Buttons | 48px height | 8px gap |
| Checkboxes | 44px | 12px gap |
| List items | 56px | 0px (border) |
| FAB | 56px | 16px from edge |
| Emergency button | 64px | 24px from edge |

### Layout Spacing
| Token | Value | Usage |
|-------|-------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Small gaps |
| md | 16px | Standard gaps |
| lg | 24px | Section padding |
| xl | 32px | Major sections |
| 2xl | 48px | Hero sections |

---

## Component Library

### Emergency Buttons

#### Critical Action Button
```
Style: Filled, pulsing shadow
Background: #DC2626
Text: #FFFFFF
Icon: Octagon X
Border-radius: 8px
Height: 56px
Padding: 16px 24px
Font: 700 weight, uppercase
Animation: Pulsing red shadow
Confirmation: Required
```

#### Warning Action Button
```
Style: Filled
Background: #F97316
Text: #FFFFFF
Icon: Alert triangle
Border-radius: 8px
Height: 48px
Padding: 12px 20px
Font: 600 weight
```

### Alert Cards

#### Critical Alert
```
Background: #991B1B20 (with transparency)
Border: 2px solid #DC2626
Border-radius: 8px
Shadow: 0 0 30px rgba(220, 38, 38, 0.6)
Icon: X-octagon, red
Animation: Subtle pulse
```

#### Warning Alert
```
Background: #F9731620
Border: 1px solid #F97316
Border-radius: 8px
Shadow: 0 0 20px rgba(249, 115, 22, 0.4)
Icon: Alert-octagon, orange
```

### Checklist Items

#### Critical Priority
```
Background: #991B1B15
Border-left: 4px solid #DC2626
Padding: 16px
Touch target: 56px
Checkbox: Red accent
Label: CRITICAL - [Task]
```

#### High Priority
```
Background: transparent
Border-left: 4px solid #F97316
Padding: 12px 16px
Touch target: 48px
Checkbox: Orange accent
Label: HIGH - [Task]
```

### Status Indicators

#### ICS Section Badges
```
Command: #DC2626 (Red) + Crown icon
Operations: #16A34A (Green) + Tools icon
Planning: #2563EB (Blue) + Clipboard icon
Logistics: #D97706 (Amber) + Truck icon
Finance: #7C3AED (Purple) + Dollar icon
```

#### Triage Tags
```
Immediate (Red): #DC2626 - Black text
Delayed (Yellow): #EAB308 - Black text
Minor (Green): #16A34A - White text
Deceased (Black): #374151 - White text
```

---

## Module-Specific Styling

### Module 7.1: Safety Planning
- **Focus**: Timeline visualization, phase checklists
- **Key Components**: 
  - Interactive planning timeline
  - Phase-based checklist system
  - Stakeholder coordination flowchart

### Module 7.2: Fire Safety
- **Focus**: Fire classification, extinguisher selection
- **Key Components**:
  - Fire class color-coded cards (A=Green, B=Red, C=Blue, D=Yellow, K=Black)
  - Venue hotspot diagram
  - PASS method visual guide

### Module 7.3: Crowd Safety
- **Focus**: Density visualization, heat maps
- **Key Components**:
  - Density calculator with color zones
  - Crowd heat map visualization
  - Warning sign recognition cards

### Module 7.4: Emergency Response
- **Focus**: ICS hierarchy, radio protocols
- **Key Components**:
  - Interactive ICS org chart
  - Radio code quick reference
  - Triage sorting exercise

### Module 7.5: Weather Protocols
- **Focus**: Weather thresholds, alert signals
- **Key Components**:
  - Weather decision matrix
  - Alert signal audio player
  - Live radar simulation

### Module 7.6: Insurance/Liability
- **Focus**: Risk assessment, contract review
- **Key Components**:
  - Risk calculator with gauge
  - Contract clause analyzer
  - Incident form trainer

---

## Mobile Optimizations

### Quick Access Bar
```
Position: Bottom fixed
Height: 64px
Background: #1E1E2E
Items: 3-4 icons
Icons: 24px, centered labels
Active state: Primary color
```

### Emergency FAB
```
Position: Bottom-right
Size: 64px
Icon: Alert triangle (32px)
Background: #DC2626
Shadow: Large, colored
Haptic: Heavy on press
```

### Swipe Gestures
- **Left**: Next lesson/module
- **Right**: Previous/checklist drawer
- **Up**: Expand content
- **Down**: Collapse/refresh
- **Triple tap top-right**: Emergency menu

### Responsive Breakpoints
```
Mobile: 0-767px (single column)
Tablet: 768-1023px (two columns)
Desktop: 1024-1439px (full layout)
Wide: 1440px+ (max-width container)
```

---

## Animation Guidelines

### Alert Animations
```css
/* Critical pulse */
@keyframes criticalPulse {
  0%, 100% { box-shadow: 0 0 20px rgba(220, 38, 38, 0.6); }
  50% { box-shadow: 0 0 40px rgba(220, 38, 38, 0.9); }
}

/* Warning flash */
@keyframes warningFlash {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Duration: 1-2s, ease-in-out, infinite for alerts */
```

### Transitions
```css
/* Standard transition */
transition: all 0.2s ease-out;

/* Card hover */
transition: transform 0.2s, box-shadow 0.2s;

/* Page transitions */
transition: opacity 0.3s ease-out;
```

---

## Accessibility

### Color Contrast
- All text meets WCAG AA (4.5:1 ratio)
- Critical alerts meet AAA (7:1 ratio)
- Icons paired with text labels

### Screen Readers
- Semantic HTML structure
- ARIA labels on interactive elements
- Alert announcements for status changes

### Motor Accessibility
- Large touch targets (48px+)
- No gesture-only interactions
- Confirmation dialogs for destructive actions

### Visual Accessibility
- High contrast mode support
- Zoom support up to 200%
- Reduced motion option

---

## Weather Iconography

| Condition | Icon | Color |
|-----------|------|-------|
| Wind | 💨 | #3B82F6 |
| Lightning | ⚡ | #FACC15 |
| Rain | 🌧️ | #60A5FA |
| Tornado | 🌪️ | #7C3AED |
| Heat | 🌡️ | #F97316 |
| Cold | ❄️ | #06B6D4 |
| Clear | ☀️ | #FACC15 |
| Clouds | ☁️ | #9CA3AF |

---

## Checklist Best Practices

### Priority Levels
1. **CRITICAL** (Red) - Life safety, event cannot proceed
2. **HIGH** (Orange) - Significant risk, must be addressed
3. **MEDIUM** (Yellow) - Should be addressed
4. **LOW** (Green) - Recommended

### Completion Flow
1. Display unchecked item
2. Tap to check (48px touch target)
3. Show brief success animation
4. Auto-scroll to next item
5. Update progress indicator

### Progress Indicators
- Circular progress for overall completion
- Section progress bars
- Milestone badges at 25%, 50%, 75%, 100%

---

## Emergency Protocol References

### Air Horn Signals
| Signal | Pattern | Meaning |
|--------|---------|---------|
| Immediate Evacuation | 2 long blasts | 50+ MPH / Tornado |
| Show Delay | 1 long blast | 40+ MPH / Prepare shelter |
| All Clear | Radio only | Resume operations |

### Radio Codes
| Code | Meaning | Action |
|------|---------|--------|
| MAYDAY MAYDAY MAYDAY | Life threat | Clear frequency |
| Emergency Traffic | Urgent | Clear frequency |
| Standby | Wait | Maintain position |
| All Clear | Resolved | Resume normal |
| Evacuate [Area] | Evacuate | Leave immediately |

---

## Implementation Notes

### Performance
- Lazy load images below fold
- Preload critical assets
- Optimize animations for 60fps
- Use CSS transforms over layout properties

### Offline Support
- Cache checklist data
- Store progress locally
- Queue completed items
- Sync when connection restored

### Security
- No sensitive data in localStorage
- HTTPS only
- Sanitize all user inputs
- Role-based content access

---

## File Structure
```
lms_data/modules/course-7/
├── index.json                    # Course configuration
├── UI_STYLE_GUIDE.md            # This document
├── module-7.1/
│   ├── module.json              # Polished module config
│   ├── module_metadata.json     # Original metadata
│   └── lessons.json             # Lesson content
├── module-7.2/
│   ├── module.json
│   ├── module_metadata.json
│   └── lessons.json
├── module-7.3/
│   ├── module.json
│   ├── module_metadata.json
│   └── lessons.json
├── module-7.4/
│   ├── module.json
│   ├── data.ts
│   └── types.ts
├── module-7.5/
│   ├── module.json
│   ├── data.ts
│   └── types.ts
└── module-7.6/
    ├── module.json
    ├── data.ts
    └── types.ts
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-03-19 | Initial module content |
| 2.0 | 2026-03-19 | UI/UX polish - Event Safety Edition |

---

*This style guide ensures consistent, safety-focused design across all Course 7 modules.*
