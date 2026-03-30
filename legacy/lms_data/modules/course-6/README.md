# Course 6: Outdoor & Airspace Safety - FAA Styled Modules

This directory contains six polished interactive educational modules for the Laser Safety LMS covering outdoor laser operations, FAA regulations, and airspace safety calculations.

## Design System: FAA Official Aesthetic

All modules feature **FAA Official Styling** with:

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| **FAA Blue** | `#002868` | Primary brand, headers, buttons |
| **Aviation White** | `#ffffff` | Backgrounds, text on dark |
| **Danger Red** | `#dc2626` | LFZ, emergencies, critical alerts |
| **Warning Amber** | `#f59e0b` | CFZ, caution states |
| **Caution Yellow** | `#eab308` | SFZ, advisories |
| **Success Green** | `#16a34a` | NFZ, safe states, go indicators |

### Flight Zone Colors (Standard Aviation)
- **LFZ (Laser Free)**: Red `#dc2626` - No laser radiation should reach
- **CFZ (Critical Flight)**: Orange `#f97316` - Glare prevention limit
- **SFZ (Sensitive Flight)**: Yellow `#eab308` - Flashblindness limit  
- **NFZ (Normal Flight)**: Green `#16a34a` - Standard MPE limits

## Module Structure

### Module 6.1: FAA Regulations for Laser Operations
**Location:** `module-6.1/`

**Interactive Components:**
- **NOTAM Filing Simulator** (`components/NOTAMFilingSimulator.tsx`)
  - FAA Form 7140-1 step-by-step walkthrough
  - Real-time validation with error highlighting
  - Section progress indicators with aviation icons
  - Zone reference quick-view

- **FAA Review Timeline** (`components/FAAReviewTimeline.tsx`)
  - Visual timeline with aviation-styled markers
  - Determination outcome explorer (No Objection/Conditional/Objection)
  - Color-coded status indicators
  - Pro tips for each stage

**FAA Styling Applied:**
- Blue header with aviation iconography
- Amber warning boxes for filing requirements
- Zone badge system (LFZ/CFZ/SFZ/NFZ)
- Progress timeline with checkmarks

---

### Module 6.2: Flight Zones & Safety Distances
**Location:** `module-6.2/`

**Interactive Components:**
- **Flight Zone Visualizer** (`components/FlightZoneVisualizer.tsx`)
  - Dark-themed airspace map with grid overlay
  - Concentric zone circles (LFZ/CFZ/SFZ/NFZ)
  - Aircraft indicators with positioning
  - Compass rose and scale indicators
  - Layer toggle controls

**FAA Styling Applied:**
- Radar/map aesthetic with dark background
- Color-coded zone boundaries
- Aircraft and navigation icons
- Real-time zone information panels
- Visual effect comparison cards

**Flight Zones Covered:**
| Zone | Acronym | Exposure Limit | Color | Icon |
|------|---------|----------------|-------|------|
| Laser Free Zone | LFZ | 50 nW/cm² | 🔴 Red | ⛔ |
| Critical Flight Zone | CFZ | 5 µW/cm² | 🟠 Orange | ⚠️ |
| Sensitive Flight Zone | SFZ | 100 µW/cm² | 🟡 Yellow | 👁️ |
| Normal Flight Zone | NFZ | MPE limits | 🟢 Green | ✓ |

---

### Module 6.3: Outdoor Hazard Calculations (SAE/ANSI)
**Location:** `module-6.3/`

**Interactive Components:**
- **Safety Distance Calculator** (`components/SafetyDistanceCalculator.tsx`)
  - NOHD, SZED, CZED, LFED calculations
  - Real-time parameter adjustment
  - Visual zone relationship diagram
  - Formula reference with FAA equation numbers

**FAA Styling Applied:**
- Color-coded result cards (Red/Yellow/Orange/Green)
- Dark-themed zone visualization
- Formula cards with aviation styling
- MPE and VCF display panels

**Equations Implemented:**
- Equation 70-1.1: NOHD (single pulse)
- Equation 70-1.2: NOHD (CW/high PRF)
- Equation 70-1.3: SZED
- Equation 70-1.4: CZED (SZED × 4.47)
- Equation 70-1.5: LFED (SZED × 44.7)

---

### Module 6.4: Securing Outdoor Laser Shows
**Location:** `module-6.4/`

**Content Areas:**
- Pre-show security planning
- Weather protocols with decision trees
- Observer positioning strategies
- Emergency shutdown procedures

**Interactive Components:**
- Show Security Checklist
- Weather Protocol Decision Tree
- Observer Placement Simulator
- Showtime Emergency Scenario

**FAA Styling Applied:**
- Weather status indicators (Green/Amber/Red)
- Emergency action cards
- Checklist with aviation progress styling
- Timeline visualization for T-minus procedures

---

### Module 6.5: International Outdoor Standards
**Location:** `module-6.5/`

**Content Areas:**
- FAA (United States) - AC 70-1B
- EASA (European Union) - SIB 2014-16
- CAA UK - CAP 736, CAP 1265
- ICAO International Standards

**Interactive Components:**
- International Standards Comparison Table
- SAE Power Measurement Visualizer
- VCF Calculator
- Zone Calculator

**FAA Styling Applied:**
- Comparison tables with aviation headers
- Color-coded regulatory regions
- Measurement visualization with zone colors

---

### Module 6.6: NOTAM Procedures & Emergency Protocols
**Location:** `module-6.6/`

**Content Areas:**
- NOTAM filing process and timeline
- FAA Form 7140-1 detailed guide
- Emergency response protocols
- Multi-agency coordination

**Interactive Components:**
- FAA Form 7140-1 Interactive Walkthrough
- Emergency Response Simulator
- NOTAM Decoder Tool
- Multi-Agency Coordination Scenario

**FAA Styling Applied:**
- Timeline with aviation checkpoints
- Emergency procedure flowcharts
- ATC phraseology cards
- Contact information panels

---

## Technical Implementation

### Component Architecture
All components built with:
- **React + TypeScript** for type safety
- **Tailwind CSS** for styling
- **FAA Design Tokens** for consistency
- **Responsive design** for mobile/desktop
- **Accessibility features** (ARIA labels, keyboard navigation)

### Shared Styles
Located in `styles/FAAAviationStyles.ts`:
- `FAAColors` - Official color palette
- `ZoneConfig` - Flight zone styling
- `FAAIcons` - Aviation icon set
- `WeatherColors` - Weather status indicators

### Calculation Validation
- Real-time validation of inputs
- Reference values from FAA AC 70-1B
- Conservative calculation methods
- Unit conversion handling

## Regulatory References

All content based on:
- **FAA AC 70-1B** (February 14, 2022) - Outdoor Laser Operations
- **FAA AC 70-2A** - Reporting of Laser Illumination of Aircraft
- **18 USC 39A** - Aiming a laser pointer at an aircraft
- **49 U.S.C. § 40103** - Sovereignty and Use of Airspace
- **ANSI Z136.1** - Safe Use of Lasers
- **SAE ARP5293A** - Safety Considerations for Lasers in Navigable Airspace

## Usage Notes

1. **NOTAM Filing Simulator**: Training tool only - not for actual FAA submission
2. **Flight Zone Visualizer**: Demonstrates zone relationships - real operations require official FAA coordination
3. **Safety Distance Calculator**: Provides estimates based on simplified formulas - complex scenarios may require full ANSI Z136 analysis

## Version History

- **v2.0.0** (2026-03-19) - FAA Styling Polish
  - Applied FAA Blue (#002868) primary branding
  - Implemented aviation warning color system
  - Added weather/aviation icons throughout
  - Created map-based airspace visualizations
  - Applied zone diagram styling
  - Enhanced emergency/action-oriented UI

- **v1.0.0** (2026-03-19) - Initial module creation
  - Modules 6.1, 6.2, 6.3 with basic components

---

*Polished by UI/UX Agent for Course 6: Outdoor & Airspace - FAA Official Aesthetic*
