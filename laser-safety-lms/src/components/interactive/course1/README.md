# Course 1: Laser Safety Fundamentals - Interactive Components

Production-ready React components for the Laser Safety LMS Course 1 modules.

## Component Inventory

### Module 1.1: Introduction to Laser Hazards

| Component | File | Description | Key Features |
|-----------|------|-------------|--------------|
| **WavelengthExplorer** | `WavelengthExplorer.tsx` | Interactive wavelength slider with eye diagram | 200-2000nm range, SVG eye anatomy, hazard region highlighting |
| **LaserPropertyComparison** | `LaserPropertyComparison.tsx` | Side-by-side laser vs conventional light | Coherence, monochromaticity, divergence comparisons |
| **ReflectionHazardDemo** | `ReflectionHazardDemo.tsx` | Surface type simulator | Mirror, disco ball, rough, beam dump simulations |

### Module 1.2: Laser Classification

| Component | File | Description | Key Features |
|-----------|------|-------------|--------------|
| **ClassificationPyramid** | `ClassificationPyramid.tsx` | Visual hazard hierarchy | All 7 laser classes, expandable details, color-coded |
| **ClassificationSorting** | `ClassificationSorting.tsx` | Drag-and-drop sorting game | 8 items, 7 zones, real-time feedback |
| **AELExplorer** | `AELExplorer.tsx` | Reference chart with calculator | Live classification, AEL reference table |

### Module 1.3: Beam Calculations

| Component | File | Description | Key Features |
|-----------|------|-------------|--------------|
| **NOHDCalculator** | `NOHDCalculator.tsx` | 5-step NOHD wizard | Progressive steps, beam visualization, MPE calculations |
| **BeamVisualizer** | `BeamVisualizer.tsx` | Real-time beam visualization | Divergence simulation, safety zones, metrics panel |

### Module 1.4: LSO Role

| Component | File | Description | Key Features |
|-----------|------|-------------|--------------|
| **LSOResponsibilityMatrix** | `LSOResponsibilityMatrix.tsx` | Interactive checklist | 5 categories, 30 items, progress tracking |

### Module 1.5: Controls

| Component | File | Description | Key Features |
|-----------|------|-------------|--------------|
| **ControlHierarchy** | `ControlHierarchy.tsx` | Drag-and-drop pyramid | 11 controls, 4 hierarchy levels |

## Accessibility Features

All components are fully accessible and meet WCAG 2.2 AA compliance standards:

### Keyboard Navigation
- **Full keyboard support** - All features work without a mouse
- **Logical tab order** - Navigation follows visual layout
- **Arrow keys** - Navigate lists, adjust sliders, switch sections
- **Enter/Space** - Activate buttons and controls
- **Escape** - Close modals, reset sections
- **Home/End** - Jump to min/max values
- **Ctrl/Cmd + Enter** - Submit forms

### Screen Reader Support
- **ARIA labels** - All interactive elements have descriptive labels
- **Live regions** - Dynamic content updates announced
- **Role attributes** - Proper semantic roles (button, tabpanel, region, etc.)
- **SVG descriptions** - All diagrams have `<title>` and `<desc>` elements
- **Form validation** - Errors announced immediately with `aria-live`

### Visual Accessibility
- **Color contrast** - All text meets 4.5:1 ratio (WCAG AA)
- **Focus indicators** - Visible focus rings on all focusable elements
- **Color independence** - Icons and patterns supplement color coding
- **Text resizing** - Supports up to 200% zoom

### Structure and Navigation
- **Skip links** - "Skip to main content" links available
- **Landmarks** - Proper use of region, complementary, navigation
- **Headings** - Logical heading hierarchy
- **Progress indicators** - All have proper ARIA attributes

## Installation

These components are already integrated into the laser-safety-lms project. Ensure you have the required dependencies:

```bash
npm install framer-motion lucide-react
```

## Usage Examples

### Basic Usage

```tsx
import { WavelengthExplorer } from "@/components/interactive/course1";

export default function ModulePage() {
  return (
    <div className="p-4">
      <WavelengthExplorer 
        initialWavelength={532}
        showEyeDiagram={true}
      />
    </div>
  );
}
```

### With Callbacks

```tsx
import { NOHDCalculator, NOHDResult } from "@/components/interactive/course1";

export default function CalculationPage() {
  const handleCalculate = (result: NOHDResult) => {
    console.log("NOHD:", result.nohd);
    console.log("MPE:", result.mpe);
  };

  return (
    <NOHDCalculator 
      onCalculate={handleCalculate}
      showVisualization={true}
    />
  );
}
```

### Tracking Completion

```tsx
import { ClassificationSorting, ControlHierarchy } from "@/components/interactive/course1";

export default function PracticePage() {
  const handleSortingComplete = (score: number, total: number) => {
    // Save to LMS progress tracking
    saveProgress({ score, total, moduleId: "c1-m2" });
  };

  return (
    <>
      <ClassificationSorting onComplete={handleSortingComplete} />
      <ControlHierarchy onComplete={handleSortingComplete} />
    </>
  );
}
```

### Compact Mode

```tsx
import { WavelengthExplorer, ClassificationPyramid } from "@/components/interactive/course1";

// For sidebars or constrained spaces
export default function Sidebar() {
  return (
    <>
      <WavelengthExplorer compact showEyeDiagram={false} />
      <ClassificationPyramid compact />
    </>
  );
}
```

### Read-Only Mode

```tsx
import { LSOResponsibilityMatrix } from "@/components/interactive/course1";

// For displaying without interaction
export default function ReferencePage() {
  return (
    <LSOResponsibilityMatrix 
      readOnly 
      showProgress={false}
    />
  );
}
```

## Component Props Reference

### WavelengthExplorer

```typescript
interface WavelengthExplorerProps {
  className?: string;
  initialWavelength?: number;  // Default: 550
  onWavelengthChange?: (nm: number) => void;
  showEyeDiagram?: boolean;    // Default: true
  compact?: boolean;           // Default: false
}
```

### NOHDCalculator

```typescript
interface NOHDCalculatorProps {
  className?: string;
  onCalculate?: (result: NOHDResult) => void;
  showVisualization?: boolean; // Default: true
}

interface NOHDResult {
  nohd: number;        // meters
  mpe: number;         // W/m²
  beamArea: number;    // m²
  safetyFactor: number;
  wavelength: number;
  power: number;
  divergence: number;
}
```

### ClassificationPyramid

```typescript
interface ClassificationPyramidProps {
  className?: string;
  initialSelectedClass?: string;
  onClassSelect?: (laserClass: LaserClass) => void;
  compact?: boolean;
  interactive?: boolean;       // Default: true
}
```

### ClassificationSorting

```typescript
interface ClassificationSortingProps {
  className?: string;
  onComplete?: (score: number, total: number) => void;
}
```

### LSOResponsibilityMatrix

```typescript
interface LSOResponsibilityMatrixProps {
  className?: string;
  onComplete?: (checkedItems: string[]) => void;
  readOnly?: boolean;          // Default: false
  showProgress?: boolean;      // Default: true
}
```

### ControlHierarchy

```typescript
interface ControlHierarchyProps {
  className?: string;
  onComplete?: (score: number, total: number) => void;
}
```

### LaserPropertyComparison

```typescript
interface LaserPropertyComparisonProps {
  className?: string;
  initialProperty?: string;    // "coherence" | "monochromaticity" | "divergence"
}
```

### ReflectionHazardDemo

```typescript
interface ReflectionHazardDemoProps {
  className?: string;
}
```

### AELExplorer

```typescript
interface AELExplorerProps {
  className?: string;
}
```

### BeamVisualizer

```typescript
interface BeamVisualizerProps {
  className?: string;
  initialPower?: number;       // Watts, default: 5
  initialDivergence?: number;  // mrad, default: 1
  initialDistance?: number;    // meters, default: 50
}
```

## Data Exports

Access underlying data for custom implementations:

```tsx
import { 
  CLASSIFICATION_DATA,     // Laser class definitions
  CLASSIFICATION_ZONES,    // Drop zone definitions
  RESPONSIBILITY_CATEGORIES, // LSO responsibilities
  HIERARCHY_LEVELS,        // Control hierarchy levels
  WAVELENGTH_REGIONS,      // Wavelength hazard regions
  SURFACE_TYPES,           // Reflection surface types
  LASER_PROPERTIES         // Laser property comparisons
} from "@/components/interactive/course1";
```

## Responsive Design

Components are mobile-first and adapt to different screen sizes:

- **Mobile**: Stacked layouts, simplified visualizations
- **Tablet**: Grid layouts where appropriate
- **Desktop**: Full visualizations with side-by-side comparisons

## Technical Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4+
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **UI Base**: shadcn/ui components

## File Structure

```
laser-safety-lms/src/components/interactive/course1/
├── index.ts                          # Main exports
├── README.md                         # This file
├── WavelengthExplorer.tsx            # Module 1.1
├── LaserPropertyComparison.tsx       # Module 1.1
├── ReflectionHazardDemo.tsx          # Module 1.1
├── ClassificationPyramid.tsx         # Module 1.2
├── ClassificationSorting.tsx         # Module 1.2
├── AELExplorer.tsx                   # Module 1.2
├── NOHDCalculator.tsx                # Module 1.3
├── BeamVisualizer.tsx                # Module 1.3
├── LSOResponsibilityMatrix.tsx       # Module 1.4
└── ControlHierarchy.tsx              # Module 1.5
```

## Standards Compliance

Components align with:
- **ANSI Z136.1-2022**: Safe Use of Lasers
- **IEC 60825-1:2014**: Laser product safety
- **FDA 21 CFR 1040.10**: Performance standards
- **WCAG 2.2 AA**: Accessibility standards

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Accessibility Testing

To verify accessibility compliance:

1. **Automated Testing**
   ```bash
   npm run test:accessibility
   ```

2. **Manual Testing**
   - Navigate with keyboard only (Tab, Enter, Space, Arrow keys)
   - Test with screen reader (NVDA, JAWS, VoiceOver)
   - Verify at 200% zoom
   - Check high contrast mode

3. **Tools**
   - axe DevTools
   - WAVE
   - Lighthouse
   - NVDA/JAWS/VoiceOver

## Support

For issues or questions regarding these components, refer to:
- Module specifications: `lms_data/modules/course-1/`
- Design patterns: `lms_data/research_findings/interactive_design_patterns.md`
- Accessibility guide: See `ACCESSIBILITY_IMPROVEMENTS_SUMMARY.md`
