# Airspace Safety Thresholds for Outdoor Laser Operations

## Source: FAA AC 70-1B, SAE Standards, ANSI Z136

---

## 1. Flight Zone Definitions

The FAA defines four distinct zones for laser airspace safety:

```
                    ┌─────────────────────────────────────┐
                    │         LASER-FREE ZONE (LFZ)       │
                    │         ≤ 50 nW/cm² (0.05 µW/cm²)   │
                    │    No visible laser illumination    │
                    │    that could cause distraction     │
                    └─────────────────────────────────────┘
                                       │
                    ┌─────────────────────────────────────┐
                    │      CRITICAL FLIGHT ZONE (CFZ)     │
                    │         ≤ 5 µW/cm²                  │
                    │     Glare protection threshold      │
                    │    (Takeoff, landing, low alt)      │
                    └─────────────────────────────────────┘
                                       │
                    ┌─────────────────────────────────────┐
                    │      SENSITIVE FLIGHT ZONE (SFZ)    │
                    │         ≤ 100 µW/cm² (0.1 mW/cm²)   │
                    │   Flashblindness protection zone    │
                    │   (Approach/departure paths)        │
                    └─────────────────────────────────────┘
                                       │
                    ┌─────────────────────────────────────┐
                    │        NORMAL OPERATIONS ZONE       │
                    │         ≤ MPE (2.6 mW/cm² visible)  │
                    │     Eye hazard protection (NOHD)    │
                    │     beyond SFZ/CFZ/LFZ              │
                    └─────────────────────────────────────┘
```

---

## 2. Exposure Threshold Summary

| Zone | Threshold | Primary Effect | Application |
|------|-----------|----------------|-------------|
| **Laser-Free Zone** | 50 nW/cm² | Distraction | All aircraft operations |
| **Critical Flight Zone** | 5 µW/cm² | Glare | Critical flight phases |
| **Sensitive Flight Zone** | 100 µW/cm² | Flashblindness/afterimage | Sensitive operations |
| **Normal Operations** | MPE (varies) | Eye injury | Beyond protected zones |

### Conversion Reference

```
50 nW/cm² = 0.05 µW/cm² = 0.00005 mW/cm²
5 µW/cm² = 5000 nW/cm² = 0.005 mW/cm²
100 µW/cm² = 100,000 nW/cm² = 0.1 mW/cm²
2.6 mW/cm² = 2,600,000 nW/cm² = 2,600 µW/cm²
```

---

## 3. Critical Flight Phases

### High-Risk Scenarios

| Phase | Risk Level | Primary Concern |
|-------|------------|-----------------|
| **Takeoff** | CRITICAL | Loss of control at low altitude |
| **Landing** | CRITICAL | Loss of control near ground |
| **Final Approach** | CRITICAL | Visual interference with runway |
| **Go-around** | HIGH | Sudden maneuvering required |
| **Search and Rescue** | HIGH | Mission failure, safety risk |
| **Emergency Operations** | CRITICAL | Compounded emergency |
| **Night Operations** | HIGH | Dark adaptation disruption |
| **Helicopter Operations** | HIGH | Low altitude, maneuvering |

---

## 4. Visual Effects by Exposure Level

### Effect Progression

```
50 nW/cm² ──► Distraction, attention disruption
     │
     ▼
5 µW/cm² ───► Glare, inability to see outside aircraft
     │         (like oncoming headlights)
     ▼
100 µW/cm² ─► Flashblindness, afterimage persistence
     │         (seconds to minutes)
     ▼
MPE Level ──► Potential eye injury
```

### Detailed Effects

#### Distraction (50 nW/cm² threshold)
- Attention diverted from instruments
- Attention diverted from outside scan
- Startle response
- Temporary loss of situational awareness

#### Glare (5 µW/cm² threshold)
- Inability to see through illuminated area
- Disruption of instrument reading
- Difficulty identifying terrain/features
- Disorientation

#### Flashblindness (100 µW/cm² threshold)
- Temporary vision loss in affected eye(s)
- Afterimage persisting 2 seconds to several minutes
- Loss of dark adaptation
- Potential spatial disorientation

#### Eye Injury (MPE level)
- Retinal burns (visible/IR)
- Corneal burns (UV/far-IR)
- Permanent vision damage possible

---

## 5. FAA Notification Thresholds

### Mandatory Reporting Levels

| Situation | Threshold | Form Required |
|-----------|-----------|---------------|
| Visible laser in navigable airspace | > 50 nW/cm² | FAA Form 7140-1 |
| Any laser in navigable airspace | > MPE | FAA Form 7140-1 |
| Laser illumination of aircraft | Any incident | AC 70-2 reporting |

### 50 nW/cm² Significance

The 50 nW/cm² threshold is:
- The **Laser-Free Zone** exposure limit
- The **notification trigger** for visible lasers
- Approximately **1/2000th** of the visible CW MPE
- Designed to prevent **any distraction** to pilots

---

## 6. Wavelength Considerations

### Visible Spectrum (400-700 nm)

| Color | Wavelength Range | Visual Perception |
|-------|------------------|-------------------|
| Violet | 400-450 nm | Poor visibility |
| Blue | 450-495 nm | Low visibility |
| Green | 495-570 nm | **Peak visibility** |
| Yellow | 570-590 nm | High visibility |
| Orange | 590-620 nm | Moderate visibility |
| Red | 620-700 nm | Lower visibility |

### Peak Visibility
- **555 nm** = Maximum photopic (day) sensitivity
- **507 nm** = Maximum scotopic (night) sensitivity

### VCF Impact on Thresholds

The same **physical power** at different wavelengths produces different **visual effects**:

**Example: 10W Laser**

| Wavelength | VCF | Visually Corrected Power |
|------------|-----|-------------------------|
| 450 nm (blue) | 0.038 | 0.38 W |
| 520 nm (green) | 0.709 | 7.09 W |
| 630 nm (red) | 0.265 | 2.65 W |

*Green lasers appear ~19× brighter than blue lasers of same power*

---

## 7. SAE Aerospace Standards

### Key Standards for Airspace Safety

| Standard | Title | Application |
|----------|-------|-------------|
| **SAE AS6029B** | Performance Criteria for Laser Control Measures | Electronic protection systems |
| SAE ARP5535 | Observers for Laser Safety | Visual monitoring procedures |
| SAE AS4970 | Human Factors Considerations | Pilot effects analysis |
| SAE ARP5293A | Safety Considerations for Lasers in Navigable Airspace | General safety practices |

### AS6029 Requirements for Electronic Protection

Systems replacing human observers must:
- Detect aircraft entering protected airspace
- Provide reliable beam termination/interruption
- Meet specified false alarm rates
- Have fail-safe design
- Include system monitoring

---

## 8. ANSI Z136 Integration

### Standard Reference

| Standard | Scope |
|----------|-------|
| ANSI Z136.1 | Safe Use of Lasers - general guidance |
| ANSI Z136.6 | Safe Use of Lasers Outdoors - outdoor-specific |

### FAA AC 70-1B Derivation

All FAA calculation methods derived from ANSI Z136:
- MPE values from Z136.1
- NOHD equations from Z136.1/Z136.6
- Simplified conservative values for AC 70-1B

### When to Reference ANSI Directly

Use ANSI Z136 instead of AC 70-1B tables when:
- Wavelengths outside AC tables (e.g., 1050-1400 nm detailed)
- Beam diameters > 1 cm at aperture
- Exposure durations > 0.25 seconds
- Need less conservative values
- Complex optical configurations

---

## 9. Control Measure Performance Levels

### Hierarchy of Controls

```
┌─────────────────────────────────────────┐
│  ELIMINATION/TERMINATION                │
│  (Beam terminated on physical surface)  │
│  ── Safest option ──                    │
├─────────────────────────────────────────┤
│  ENGINEERING CONTROLS                   │
│  (Electronic detection/interruption)    │
│  Must meet SAE AS6029                   │
├─────────────────────────────────────────┤
│  ADMINISTRATIVE CONTROLS                │
│  (Safety observers, procedures)         │
│  Per SAE ARP5535                        │
├─────────────────────────────────────────┤
│  PPE                                    │
│  (Laser eye protection - limited use)   │
│  Not practical for pilots               │
└─────────────────────────────────────────┘
```

---

## 10. International Considerations

### ICAO Guidance
- International Civil Aviation Organization standards
- Harmonized with FAA approach
- National variations may apply

### Border Operations
- Coordinate with multiple authorities
- Consider both countries' regulations
- File notifications with all affected agencies

---

## 11. Measurement and Verification

### Power Measurement
- Use calibrated power meters
- Measure at maximum output
- Account for all wavelengths

### Divergence Measurement
- Far-field measurement preferred
- Use ANSI Z136 methods
- Document measurement conditions

### Validation
- Conservative assumptions acceptable
- Document all measurement techniques
- Keep calibration records

---

## 12. Emergency Procedures

### Laser Illumination Response

**If laser strikes aircraft:**
1. Maintain aircraft control (AVIATE)
2. Look away from beam if possible
3. Use automation if available
4. Report incident per AC 70-2
5. Seek medical evaluation if symptoms

**Ground Response:**
1. Terminate laser operation immediately
2. Notify authorities
3. Preserve evidence
4. Cooperate with investigation

---

*Reference: FAA AC 70-1B, SAE AS6029, SAE ARP5535, ANSI Z136 series*
