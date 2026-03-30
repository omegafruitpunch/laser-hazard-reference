# Outdoor Laser Hazard Calculation Methods

## Source: FAA AC 70-1B Appendix A, B, C

---

## 1. Overview of Protection Distances

Four critical distances determine airspace safety for outdoor laser operations:

```
Laser Source
    │
    │ NOHD (Nominal Ocular Hazard Distance)
    │ → Eye injury protection
    │
    │ SZED (Sensitive Zone Exposure Distance)  
    │ → Flashblindness/afterimage protection
    │
    │ CZED (Critical Zone Exposure Distance)
    │ → Glare protection
    │
    │ LFED (Laser-Free Exposure Distance)
    │ → Distraction protection
    ▼
```

---

## 2. Maximum Permissible Exposure (MPE)

### Definition
The level of laser radiation to which a person may be exposed without hazardous effect or adverse biological changes in the eye.

### MPE Values by Laser Type

#### Continuous Wave (CW) Visible Lasers (400-700 nm)
```
MPE = 2.6 mW/cm²
```

#### Single Pulse Lasers

**Visible (400-700 nm):**
| Pulse Duration | MPE Formula |
|----------------|-------------|
| < 10 ns | Reference ANSI Z136.1 |
| 10 ns to 5 µs | 0.2 µJ/cm² |
| 5 µs to 0.25 s | 1.8 × t⁰·⁷⁵ × 10⁻² J/cm² |

**Infrared (700-1050 nm):**
| Wavelength | MPE Formula |
|------------|-------------|
| < 10 ns | Reference ANSI Z136.1 |
| 10 ns to 5 µs | 0.2 × Cₐ × 10⁻⁶ J/cm² |
| 5 µs to 0.25 s | 1.8 × Cₐ × t⁰·⁷⁵ × 10⁻² J/cm² |

Where:
```
Cₐ = 10^[0.002(λ - 700)]  (λ in nm)
```

#### Repetitively Pulsed Lasers

Treat as CW if:
- Visible/IR (400-1050 nm): PRF > 13 kHz
- IR (1050-1400 nm): PRF > 6.5 kHz

Otherwise use Table 1 (MPE per pulse).

---

## 3. Visual Effect Calculations

### Pre-corrected Power (PCP)

**Single Pulse:**
```
PCP = Pulse Energy (J) × 4
```
*Note: Averages pulse energy over 0.25s maximum duration*

**Continuous Wave:**
```
PCP = Total visible power (W)
```

**Repetitively Pulsed:**
```
PCP = Pulse Energy (J) × PRF (Hz)
```

### Visual Correction Factor (VCF)

The human eye perceives green light (≈555 nm) as brightest. VCF adjusts for perceived brightness.

**Single Wavelength:**
- Use Table 3 value from AC 70-1B

**Multiple Wavelengths - Conservative Method:**
```
VCF = Maximum VCF of all wavelengths present
```

**Multiple Wavelengths - Detailed Method:**
```
For each wavelength:
  1. List power at that wavelength
  2. Get VCF from Table 3
  3. Calculate: Visually Corrected Power = Power × VCF
  
Total VCP = Σ(Visually Corrected Powers)
Overall VCF = Total VCP / Total PCP
```

### Visual Effect Zone Thresholds

| Zone | Threshold | Effect Protected Against |
|------|-----------|-------------------------|
| **SZED** | 100 µW/cm² (0.0001 W/cm²) | Flashblindness, afterimage |
| **CZED** | 5 µW/cm² (0.000005 W/cm²) | Glare |
| **LFED** | 50 nW/cm² (0.00000005 W/cm²) | Distraction |

---

## 4. Slant Range Calculations

### NOHD Slant Range

**For Single Pulse / Low PRF (Equation 70-1.1):**
```
           32.8       ┌─────────────────┐
NOHD_SR = ───── × √ │ 1.2732 × J  │
           mrad    └─────────────────┘
                           MPE
```

**For CW / High PRF (Equation 70-1.2):**
```
           32.8       ┌──────────────────┐
NOHD_SR = ───── × √ │ 1273.2 × W   │
           mrad    └──────────────────┘
                           MPE
```

**Where:**
- 32.8 = conversion factor (0.0328 ft/cm)
- 1.2732 = 4/π
- 1273.2 = 4/π ÷ 0.001 (for mW conversion)
- mrad = beam divergence (milliradians)
- J = pulse energy (joules)
- W = average power (watts)
- MPE = maximum permissible exposure

### SZED Slant Range (Equation 70-1.3)

```
           32.8       ┌────────────────────┐
SZED_SR = ───── × √ │ 12732 × W_VCP  │
           mrad    └────────────────────┘
```

**Where:**
- 12732 = 4/π ÷ 0.0001 (SZED threshold)
- W_VCP = Visually Corrected Power (watts)

### CZED Slant Range (Equation 70-1.4)

```
CZED_SR = SZED_SR × 4.47
```

*Note: 4.47 = √(100/5) = ratio of SZED to CZED thresholds*

### LFED Slant Range (Equation 70-1.5)

```
LFED_SR = SZED_SR × 44.7
```

*Note: 44.7 = √(100/0.05) = ratio of SZED to LFED thresholds*

---

## 5. Horizontal and Vertical Distance Calculations

### Using Elevation Angles

Given:
- Slant Range (SR)
- Minimum elevation angle (θ_min)
- Maximum elevation angle (θ_max)

**Horizontal Distance (Equation 70-1.6):**
```
Horizontal = SR × cos(θ_min)
```

**Vertical Distance (Equation 70-1.7):**
```
Vertical = SR × sin(θ_max)
```

### Important Note on Elevation Angles

For **horizontal distance**, use the **minimum elevation angle** (beam closest to horizontal = maximum horizontal reach).

For **vertical distance**, use the **maximum elevation angle** (beam highest point = maximum altitude).

---

## 6. Complete Calculation Example

### Given Parameters
- **Laser type**: CW diode laser
- **Power**: 40 watts (visible)
- **Wavelength**: 520 nm (green)
- **Beam divergence**: 1.5 mrad
- **Min elevation angle**: 5°
- **Max elevation angle**: 45°

### Step 1: Calculate NOHD

For visible CW laser:
- MPE = 2.6 mW/cm²
- W = 40 W

```
           32.8         ┌──────────────────────┐
NOHD_SR = ───── × √ │ 1273.2 × 40      │
           1.5      └──────────────────────┘
                        2.6

         = 21.87 × √19588
         = 21.87 × 140
         = 3,062 feet
```

### Step 2: Calculate Visual Effect Distances

**Pre-corrected Power:**
```
PCP = 40 W (all visible)
```

**Visual Correction Factor:**
```
VCF (520 nm) = 0.7092
```

**Visually Corrected Power:**
```
W_VCP = 40 × 0.7092 = 28.37 W
```

**SZED:**
```
           32.8         ┌────────────────────────┐
SZED_SR = ───── × √ │ 12732 × 28.37      │
           1.5      └────────────────────────┘

         = 21.87 × √361,406
         = 21.87 × 601.2
         = 13,148 feet
```

**CZED:**
```
CZED_SR = 13,148 × 4.47 = 58,772 feet
```

**LFED:**
```
LFED_SR = 13,148 × 44.7 = 587,716 feet (111 miles)
```

### Step 3: Calculate Horizontal/Vertical

**NOHD:**
```
Horizontal_NOHD = 3,062 × cos(5°) = 3,062 × 0.996 = 3,050 feet
Vertical_NOHD = 3,062 × sin(45°) = 3,062 × 0.707 = 2,165 feet
```

**SZED:**
```
Horizontal_SZED = 13,148 × cos(5°) = 13,098 feet
Vertical_SZED = 13,148 × sin(45°) = 9,296 feet
```

**CZED:**
```
Horizontal_CZED = 58,772 × cos(5°) = 58,548 feet
Vertical_CZED = 58,772 × sin(45°) = 41,560 feet
```

**LFED:**
```
Horizontal_LFED = 587,716 × cos(5°) = 585,480 feet
Vertical_LFED = 587,716 × sin(45°) = 415,550 feet
```

### Summary Table for Form 7140-1

| Distance | Slant Range | Horizontal | Vertical |
|----------|-------------|------------|----------|
| NOHD | 3,062 ft | 3,050 ft | 2,165 ft |
| SZED | 13,148 ft | 13,098 ft | 9,296 ft |
| CZED | 58,772 ft | 58,548 ft | 41,560 ft |
| LFED | 587,716 ft | 585,480 ft | 415,550 ft |

---

## 7. Special Cases

### Large Beam Diameter (> 1 cm at aperture)

For lasers with beam diameter > 1 cm at output:
- Use ANSI Z136.6 Appendix B equations
- Submit as separate attachment to Form 7140-1

### Multiple Wavelengths from Same Aperture

See Appendix C of AC 70-1B:
- Calculate MPE for each wavelength
- Determine which wavelength has longest NOHD
- Use that wavelength for calculations
- For visual effects, use combined VCP and appropriate VCF

### Scanning Beams

If beam is scanned:
- Scan-failure protection devices required
- Document methods and calculations
- Include scan-failure protection specifications

---

## 8. Safety Margin Considerations

### Conservative Assumptions
When in doubt, always:
- Round UP protection distances
- Use smaller beam diameter (more conservative)
- Use smaller divergence (more conservative)
- Assume maximum power output

### Borderline Cases
If data accuracy is crucial:
- Provide measurement techniques
- Document data sources
- Explain assumptions
- Consider professional measurement services

---

## 9. Quick Reference: Constants

| Constant | Value | Purpose |
|----------|-------|---------|
| 32.8 | 0.0328 ft/cm | Unit conversion |
| 1.2732 | 4/π | Beam geometry |
| 1273.2 | (4/π)/0.001 | CW MPE conversion |
| 12732 | (4/π)/0.0001 | SZED threshold |
| 4.47 | √(100/5) | CZED multiplier |
| 44.7 | √(100/0.05) | LFED multiplier |
| 2.6 | MPE value | Visible CW lasers |

---

*Reference: FAA AC 70-1B, Appendices A, B, C*
*Original equations derived from ANSI Z136 series standards*
