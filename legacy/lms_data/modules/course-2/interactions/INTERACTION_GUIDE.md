# FDA Compliance Course - Interaction Design Guide

## Overview

This document describes the interaction design implementations for Course 2: FDA Compliance modules. All components follow accessibility best practices, include smooth animations, and support responsive design.

## Quick Start

```tsx
import {
  // Module 2.1
  RegulatoryTimeline,
  Form3147Simulator,
  CDRHOrganizationalChart,
  ReportingDecisionWizard,
  
  // Module 2.2
  ClassificationPyramid,
  AELCalculator,
  ClassificationWizard,
  RequirementsMatrix,
  
  // Module 2.3
  HarmonizationTable,
  CertificationBuilder,
  ComplianceChecklist,
  HarmonizationTabs
} from './interactions';
```

## Module 2.1: FDA Regulatory Framework

### RegulatoryTimeline

**Features:**
- Sequential animation of timeline events on mount
- Hover effects with scale and shadow transitions
- Click to open detailed modal with additional information
- Alternating left/right layout for visual interest
- Color-coded timeline line with gradient

**Interactions:**
- Click event card → Opens detail modal
- Hover event card → Scale up, shadow increase, color highlight
- Modal close → Click outside or X button

**Accessibility:**
- All interactive elements have focus states
- Modal traps focus while open
- ESC key closes modal

### Form3147Simulator

**Features:**
- Real-time field validation
- Visual feedback for field states (default, focused, error, valid)
- Progress bar showing completion percentage
- Confirmation dialog before submission
- Loading state simulation
- Success animation on completion

**Field States:**
- Default: Gray border, white background
- Focused: Blue border, blue shadow ring
- Error: Red border, light red background, red shadow
- Valid: Green border

**Interactions:**
- Focus field → Border color change, shadow appears
- Type in field → Real-time validation, error clearing
- Submit → Validation check, confirmation dialog, loading simulation
- Confirm → Success state with animation

### CDRHOrganizationalChart

**Features:**
- Expandable/collapsible tree structure
- Click node to view details in side panel
- Animated expand/collapse transitions
- Color-coded organization levels

**Interactions:**
- Click node → Select node, show details, toggle children
- Hover node → Subtle scale increase
- Click chevron → Expand/collapse children

### ReportingDecisionWizard

**Features:**
- Step-by-step decision tree
- Progress indicator with completed steps
- Animated transitions between steps
- Result display with CFR references

**Interactions:**
- Click option → Advance to next step or show result
- Back button → Return to previous step
- Start Over → Reset to beginning

## Module 2.2: Laser Product Classification

### ClassificationPyramid

**Features:**
- Pyramid visualization with hazard level indicators
- Animated level entrance on mount
- Side panel with detailed class information
- Color-coded hazard levels

**Interactions:**
- Click level → Show details panel
- Hover level → Scale increase, shadow enhancement
- Details panel → Shows requirements, examples, warnings

### AELCalculator

**Features:**
- Real-time AEL calculations
- Wavelength color indicator
- Intermediate calculation display
- Results with classification recommendations

**Interactions:**
- Adjust wavelength slider → Updates color indicator
- Change inputs → Real-time calculation updates
- Click Calculate → Animated loading, results display
- Results animate in sequentially

### ClassificationWizard

**Features:**
- Multi-step classification questionnaire
- Progress tracking with step indicators
- Branching logic based on answers
- Final classification result with animation

**Interactions:**
- Select option → Advance or show result
- Progress dots animate as steps complete
- Result shows with spring animation

### RequirementsMatrix

**Features:**
- Side-by-side class comparison
- Toggle classes on/off
- Animated cell highlights on hover
- Status badges for requirements

**Interactions:**
- Click class button → Toggle visibility
- Hover table cell → Scale and shadow animation
- Cell colors indicate requirement status

## Module 2.3: Laser Notices & Harmonization

### HarmonizationTable

**Features:**
- Filter by status (All, Harmonized, FDA-Unique)
- Search functionality
- Sortable columns
- Detail modal for each section

**Interactions:**
- Click filter button → Animate table update
- Type in search → Real-time filtering
- Click row → Open detail modal
- Hover row → Background highlight

### CertificationBuilder

**Features:**
- Three certification options
- Generated statement display
- One-click copy to clipboard
- Usage guidance for each option

**Interactions:**
- Select option → Show statement, highlight selection
- Click Copy → Toast confirmation, button animation
- Statement updates with smooth transition

### ComplianceChecklist

**Features:**
- LocalStorage persistence
- Progress bar with percentage
- Category grouping
- Save confirmation toast

**Interactions:**
- Click checkbox → Toggle item, update progress
- Progress bar animates smoothly
- Save button → Toast confirmation
- Clear All → Reset all items

**State Persistence:**
- Items automatically save to localStorage
- Progress restored on page reload

### HarmonizationTabs

**Features:**
- Four tab sections
- Animated tab transitions
- Content specific to each tab
- Responsive tab layout

**Interactions:**
- Click tab → Content slides in, tab highlights
- Tab content animates with fade and slide
- Active tab has shadow and background change

## Animation Specifications

### Timing
- Default duration: 300ms
- Stagger delay: 50-100ms between items
- Spring animations: damping 25, stiffness 300

### Easing
- Default: cubic-bezier(0.25, 0.1, 0.25, 1)
- Bounce: spring physics
- Smooth: ease-out

### Transitions
- Colors: 200ms
- Transforms: 300ms
- Opacity: 200ms

## Mobile Responsiveness

### Touch Targets
- Minimum 44px × 44px for all interactive elements
- Increased padding on mobile
- Spacing between touch targets: minimum 8px

### Responsive Breakpoints
- Mobile: < 640px - Stack layouts, full-width buttons
- Tablet: 640px - 1024px - 2-column grids
- Desktop: > 1024px - Full layouts

### Mobile Optimizations
- Tables scroll horizontally
- Modals full-screen on small devices
- Reduced animation complexity on low-power devices

## Accessibility Features

### Keyboard Navigation
- All interactive elements focusable
- Tab order follows visual order
- Enter/Space activates buttons
- ESC closes modals

### Screen Readers
- ARIA labels on icon-only buttons
- Live regions for dynamic content
- Descriptive headings and labels

### Visual
- Focus indicators visible
- Color not sole indicator of state
- Sufficient contrast ratios (WCAG AA)

## State Management

### Local State
- useState for component-level state
- useEffect for side effects
- useCallback for event handlers

### Persistence
- localStorage for checklist progress
- No sensitive data stored
- Automatic save on change

## Performance

### Optimization
- React.memo for pure components
- useMemo for expensive calculations
- Lazy loading for heavy components

### Animation Performance
- Use transform and opacity only
- will-change on animated elements
- Respect prefers-reduced-motion

## Testing Checklist

### Interactions
- [ ] All buttons respond to clicks
- [ ] Form validation works correctly
- [ ] Modal open/close functions properly
- [ ] Tab switching works smoothly
- [ ] Progress saves and restores

### Animations
- [ ] Timeline items animate sequentially
- [ ] Form fields highlight on focus
- [ ] Progress bars fill smoothly
- [ ] Section transitions are smooth
- [ ] Table cells animate on hover

### Mobile
- [ ] Touch targets minimum 44px
- [ ] Horizontal scrolling for tables
- [ ] Full-width buttons on mobile
- [ ] No horizontal overflow

### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader labels present
- [ ] Focus indicators visible
- [ ] Color contrast sufficient

## Integration Notes

### With Module System
Components are designed to be dropped into module lesson content. Each component is self-contained and manages its own state.

### With Progress Tracking
The ComplianceChecklist component integrates with the LMS progress system via localStorage. Other components can emit completion events for integration with the broader progress tracking.

### Styling
Components use inline styles for maximum portability. Colors and spacing values are hardcoded but follow a consistent design system.

## Troubleshooting

### Common Issues

**Animations not working:**
- Check framer-motion is installed
- Verify no CSS animations conflicting

**localStorage errors:**
- Check browser storage permissions
- Verify no quota exceeded

**Mobile layout issues:**
- Check viewport meta tag present
- Verify flexbox/grid breakpoints

## Changelog

### Version 1.0.0
- Initial release with all 12 interactive components
- Full animation implementation
- Mobile responsiveness
- Accessibility features
- localStorage persistence for checklist
