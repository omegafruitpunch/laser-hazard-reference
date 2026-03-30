# Course 3: Biological Hazards - Accessibility Implementation Guide

## Overview

This document describes the accessibility enhancements made to all Course 3 (Biological Hazards) modules to ensure compliance with WCAG 2.1 Level AA standards and optimal user experience for all learners, including those using assistive technologies.

---

## Modules Updated

### HTML Interactive Modules (Fully Accessible Versions)

| Module | Original File | Accessible Version | Key Features |
|--------|--------------|-------------------|--------------|
| 3.1 | `module-3.1/index.html` | `module-3.1/index-accessible.html` | Eye anatomy explorer, wavelength slider |
| 3.2 | `module-3.2/index.html` | `module-3.2/index-accessible.html` | Retinal hazard visualizer, spectrum bar |
| 3.3 | `module-3.3/index.html` | `module-3.3/index-accessible.html` | Fitzpatrick scale, burn classification |

### Markdown Modules (Enhanced Documentation)

| Module | File | Accessibility Enhancements |
|--------|------|---------------------------|
| 3.4 | `module-3.4/content.md` | Accessible tables, clear headings |
| 3.5 | `module-3.5/content.md` | Formula explanations, structured data |
| 3.6 | `module-3.6/content.md` | OD calculation steps, visual alternatives |

---

## Accessibility Features Implemented

### 1. Keyboard Navigation

All interactive elements are fully keyboard accessible:

- **Tab navigation**: Logical tab order through all interactive elements
- **Arrow key navigation**: Within groups (radios, structure selectors)
- **Enter/Space activation**: All clickable elements respond to keyboard
- **Escape**: Closes modals and resets focus appropriately
- **Skip links**: "Skip to main content" links at the top of each page

```html
<!-- Example: Progress dots with keyboard support -->
<div class="progress-bar" role="tablist" aria-label="Phase navigation">
    <button class="progress-dot active" data-phase="1" role="tab" 
            aria-selected="true" aria-label="Phase 1: Warm-Up Puzzle" tabindex="0">
    </button>
</div>
```

### 2. ARIA Attributes

Comprehensive ARIA implementation for screen reader compatibility:

#### Landmark Roles
- `role="banner"` - Module header
- `role="main"` - Primary content area
- `role="navigation"` - Progress and phase navigation
- `role="region"` - Sectioned content with labels

#### Widget Roles
- `role="tablist"` / `role="tab"` - Progress indicators
- `role="radiogroup"` / `role="radio"` - Multiple choice options
- `role="list"` / `role="listitem"` - Grouped content
- `role="img"` - SVG diagrams with alt text
- `role="status"` / `aria-live="polite"` - Dynamic updates

#### States and Properties
- `aria-selected` - Current selection state
- `aria-checked` - Radio/checkbox states
- `aria-expanded` - Collapsible sections
- `aria-hidden` - Visual-only content
- `aria-label` / `aria-labelledby` - Accessible names
- `aria-describedby` - Additional descriptions

### 3. Screen Reader Support

#### Live Regions
```html
<div id="announcements" class="sr-only" aria-live="polite" aria-atomic="true"></div>
```

Dynamic content changes are announced via JavaScript:
- Phase transitions
- Quiz answer feedback
- Calculator results
- Selection changes

#### Alternative Text

##### Anatomical Diagrams (Module 3.1)
```html
<svg role="img" aria-label="Cross-section diagram of human eye showing major structures">
    <path class="eye-structure" data-structure="cornea"
        aria-label="Cornea: The transparent outer layer at the front of the eye. 
                   Absorbs UV and far-infrared radiation, protecting deeper structures."
        tabindex="0" />
    <!-- Each structure has detailed descriptive label -->
</svg>
```

##### Wavelength Visualizations
```html
<div class="spectrum-bar" role="img" 
     aria-label="Spectrum bar showing wavelength regions with retinal hazard zone 
                 highlighted from 400 to 1400 nanometers">
```

### 4. Color and Visual Accessibility

#### Pattern Overlays for Colorblind Users

Each color-coded element includes pattern overlays:

```css
/* UV wavelengths - Purple with dots */
.pattern-uv {
    background-image: repeating-linear-gradient(45deg, 
        transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px);
}

/* Visible light - Multiple colors with stripes */
.pattern-visible {
    background-image: repeating-linear-gradient(90deg, 
        transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px);
}

/* Near-IR - Red with diagonal lines */
.pattern-nir {
    background-image: repeating-linear-gradient(-45deg, 
        transparent, transparent 10px, rgba(0,0,0,0.2) 10px, rgba(0,0,0,0.2) 20px);
}
```

#### High Contrast Support

```css
@media (prefers-contrast: high) {
    .eye-structure { stroke-width: 4; }
    
    .btn:focus,
    .puzzle-option:focus {
        outline: 4px solid #fff;
    }
}
```

#### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

### 5. Interactive Component Accessibility

#### Sliders (Wavelength, Power, Duration)

```html
<input type="range" class="wavelength-slider" id="wavelength-slider" 
       min="200" max="10600" value="550" step="10"
       aria-label="Wavelength selector. Current value: 550 nanometers."
       aria-valuemin="200" aria-valuemax="10600" aria-valuenow="550"
       aria-describedby="wavelength-current">
```

#### Tables (MPE Comparisons)

```html
<table class="mpe-table" role="table" aria-label="Maximum Permissible Exposure values">
    <thead>
        <tr role="row">
            <th role="columnheader" scope="col">Wavelength</th>
            <th role="columnheader" scope="col">Eye MPE</th>
            <th role="columnheader" scope="col">Skin MPE</th>
        </tr>
    </thead>
    <tbody>
        <tr role="row" tabindex="0">
            <td role="cell">532 nm (Green)</td>
            <td role="cell">0.39 mW/cm²</td>
            <td role="cell">39 mW/cm²</td>
        </tr>
    </tbody>
</table>
```

#### Quiz Questions

```html
<div class="challenge-grid" role="radiogroup" aria-labelledby="warmup-heading">
    <div class="challenge-card" data-answer="yag" 
         role="radio" aria-checked="false" tabindex="0">
        <h4>1064 nm Nd:YAG</h4>
        <p>Invisible near-infrared</p>
    </div>
</div>
```

### 6. Scientific Content Accessibility

#### Formula Explanations (Module 3.5)

Each formula includes step-by-step explanation:

```markdown
**Formula**: OD = log₁₀(E_actual / MPE)

**Step-by-step calculation**:
1. Calculate actual irradiance: E = Power/Area
2. Look up MPE for wavelength and duration
3. Calculate ratio: R = E/MPE
4. Calculate OD: OD = log₁₀(R)
5. Round UP to standard OD level

**Example with numbers**:
- Power: 1000 mW
- Beam area: 0.0314 cm²
- E_actual = 31,847 mW/cm²
- MPE = 2.56 mW/cm²
- Ratio = 12,440
- OD = 4.09 → Round to OD 5
```

#### Hazard Warnings

Color-coded hazards include text descriptions and icons:

```html
<span class="wavelength-tag tag-nir" role="listitem">
    <span aria-hidden="true">🔴</span> Near-IR: 700-1400 nm
    <span class="sr-only">- DANGER: Invisible but focuses on retina</span>
</span>
```

---

## Testing Recommendations

### Screen Reader Testing
- NVDA (Windows) - Free
- JAWS (Windows) - Industry standard
- VoiceOver (macOS/iOS) - Built-in
- TalkBack (Android) - Built-in

### Keyboard Testing
- Tab through entire page
- Use arrow keys in groups
- Activate with Enter/Space
- Verify focus indicators visible

### Automated Testing Tools
- axe DevTools
- WAVE
- Lighthouse Accessibility Audit
- Pa11y

### Manual Checks
- Color contrast ratios (4.5:1 minimum)
- Focus order logic
- Heading hierarchy
- Alternative text quality
- Form label associations

---

## File Structure

```
lms_data/modules/course-3/
├── module-3.1/
│   ├── index.html                    # Original file
│   ├── index-accessible.html         # ✅ Accessible version
│   └── ...
├── module-3.2/
│   ├── index.html
│   ├── index-accessible.html         # ✅ Accessible version
│   └── ...
├── module-3.3/
│   ├── index.html
│   ├── index-accessible.html         # ✅ Accessible version
│   └── ...
├── module-3.4/
│   ├── content.md                    # Enhanced tables
│   └── module.json                   # ARIA metadata added
├── module-3.5/
│   ├── content.md                    # Formula explanations
│   └── module.json
├── module-3.6/
│   ├── content.md                    # OD calculation steps
│   └── module.json
└── ACCESSIBILITY_GUIDE.md            # This file
```

---

## Compliance Summary

### WCAG 2.1 Level AA Criteria Met

| Criterion | Status | Implementation |
|-----------|--------|----------------|
| 1.1.1 Non-text Content | ✅ | All images have alt text |
| 1.3.1 Info and Relationships | ✅ | ARIA roles, structured headings |
| 1.3.2 Meaningful Sequence | ✅ | Logical DOM order |
| 1.3.3 Sensory Characteristics | ✅ | Patterns + colors + text |
| 1.4.1 Use of Color | ✅ | Pattern overlays |
| 1.4.3 Contrast (Minimum) | ✅ | 4.5:1 ratio maintained |
| 1.4.4 Resize Text | ✅ | Relative units used |
| 1.4.10 Reflow | ✅ | Responsive design |
| 1.4.11 Non-text Contrast | ✅ | UI elements have 3:1 contrast |
| 1.4.12 Text Spacing | ✅ | Content adapts to spacing |
| 2.1.1 Keyboard | ✅ | All functionality keyboard accessible |
| 2.4.3 Focus Order | ✅ | Logical tab order |
| 2.4.4 Link Purpose | ✅ | Descriptive link text |
| 2.4.6 Headings and Labels | ✅ | Clear, descriptive |
| 2.4.7 Focus Visible | ✅ | Visible focus indicators |
| 3.3.1 Error Identification | ✅ | Clear error messages |
| 3.3.2 Labels or Instructions | ✅ | Input labels present |
| 4.1.2 Name, Role, Value | ✅ | ARIA attributes |

---

## Maintenance Notes

When updating accessible modules:

1. **Preserve ARIA attributes** when modifying HTML structure
2. **Test with screen readers** after any changes
3. **Maintain keyboard navigation** - test tab order
4. **Update live regions** if dynamic content changes
5. **Keep pattern overlays** for any new color-coded elements
6. **Document changes** in this guide

---

## Support and Feedback

For accessibility issues or improvement suggestions:
- File an issue in the project repository
- Contact the accessibility team
- Reference this guide when making modifications

---

*Last Updated: March 19, 2026*
*Accessibility Standard: WCAG 2.1 Level AA*
