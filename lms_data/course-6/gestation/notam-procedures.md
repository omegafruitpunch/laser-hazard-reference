# NOTAM Procedures for Outdoor Laser Operations

## Source: FAA Form 7140-1 & AC 70-1B

---

## 1. What is a NOTAM?

**Notice to Air Missions (NOTAM)** - A notice filed with aviation authorities to alert aircraft pilots of potential hazards along a flight route or at a location that could affect flight safety.

For laser operations, the FAA Form 7140-1 serves as the notification mechanism that may result in NOTAM issuance.

---

## 2. When NOTAM Filing is Required

### Mandatory Submission Scenarios

| Scenario | Action Required |
|----------|----------------|
| Visible laser > 50 nW/cm² in navigable airspace | Submit FAA Form 7140-1 |
| Any laser exceeding MPE in navigable airspace | Submit FAA Form 7140-1 |
| Multiple laser configurations | One form with multiple worksheets |
| Temporary laser shows/events | Submit at least 30 days in advance |
| Permanent installations | Submit for initial approval and updates |

---

## 3. Form 7140-1 Completion Guide

### Step-by-Step Instructions

#### Step 1: Identify the Correct FAA Service Center
- Determine geographic service area
- Contact center for guidance if uncertain
- See AC 70-1B Appendix E for contacts

#### Step 2: Gather Required Information

**Laser Specifications:**
- Laser type (CO₂, diode, Nd:YAG, etc.)
- Hazard class (Class 2, 3R, 3B, 4)
- Power (watts)
- Wavelength(s) (nanometers)
- Beam divergence (milliradians)
- Beam diameter (centimeters)

**Operational Details:**
- Dates and times of operation
- Geographic coordinates (lat/long)
- Site elevation
- Beam direction/elevation angles
- Control measures

#### Step 3: Complete All Form Sections

**Critical Fields:**
- **Section 11**: Geographic Location
  - Site elevation (feet MSL)
  - Laser height above site
  - Latitude/longitude (degrees, minutes, seconds)
  
- **Section 12**: Beam Characteristics
  - Select mode: Single pulse, CW, or Repetitively pulsed
  - Enter all laser parameters
  
- **Section 13**: Beam Direction
  - Minimum/maximum elevation angles
  - Azimuth range
  - True or magnetic north reference

#### Step 4: Calculate Protection Distances

**Required Distance Calculations:**

| Distance Type | Purpose | Threshold |
|--------------|---------|-----------|
| **NOHD** | Ocular hazard protection | MPE-based |
| **SZED** | Sensitive zone (flashblindness) | 100 µW/cm² |
| **CZED** | Critical zone (glare) | 5 µW/cm² |
| **LFED** | Laser-free zone (distraction) | 50 nW/cm² |

#### Step 5: Attach Supporting Documentation

**Required Attachments:**
- Site maps/diagrams
- Laser configuration worksheets (one per configuration)
- Calculation details or software printouts
- Control measure descriptions
- Electronic protection system certification (if applicable)

---

## 4. Calculation Methods for Form 7140-1

### Beam Modes of Operation

#### Single Pulse Lasers
- Pulse duration < 0.25 seconds
- MPE from Table 1 (AC 70-1B)

#### Continuous Wave (CW) Lasers
- Output > 0.25 seconds continuous
- MPE: 2.6 mW/cm² for visible wavelengths

#### Repetitively Pulsed Lasers
- PRF ≥ 1 Hz
- Special calculations required for PRF < 13 kHz (visible/IR)

### Visual Correction Factor (VCF)

For visible wavelengths (400-700 nm):

| Wavelength (nm) | VCF Value |
|-----------------|-----------|
| 400 | 0.0004 |
| 450 | 0.0380 |
| 500 | 0.3230 |
| 520 | 0.7092 |
| 555 (peak) | 1.0000 |
| 600 | 0.5030 |
| 630 | 0.2653 |
| 650 | 0.1070 |
| 700 | 0.0041 |

**Formula:**
```
Visually Corrected Power = Pre-corrected Power × VCF
```

### Slant Range Formulas

**NOHD for Single Pulse (Equation 70-1.1):**
```
NOHD_SR = 32.8/mrad × √(1.2732 × J / MPE)
```

**NOHD for CW/Repetitively Pulsed (Equation 70-1.2):**
```
NOHD_SR = 32.8/mrad × √(1273.2 × W / MPE)
```

**SZED (Equation 70-1.3):**
```
SZED_SR = (32.8/mrad) × √(12732 × W_VCP)
```

**CZED (Equation 70-1.4):**
```
CZED_SR = SZED_SR × 4.47
```

**LFED (Equation 70-1.5):**
```
LFED_SR = SZED_SR × 44.7
```

---

## 5. Multi-Configuration Procedures

### When Multiple Worksheets are Needed

Complete separate Laser Configuration Worksheets when:
- Lasers are widely separated geographically
- Lasers aimed in different/non-overlapping directions
- Different laser hazard classes used
- Significantly different beam characteristics

### Grouping Similar Lasers

**Can use one worksheet if:**
- Similar beam characteristics
- Aimed in same general direction
- All into same airspace area

**Strategy for multiple lasers:**
1. Identify laser with longest NOHD
2. Identify laser with longest LFED
3. If same laser → one worksheet
4. If different lasers → additional worksheet for LFED laser

---

## 6. Special Considerations

### Electronic Protection Systems

**Requirements:**
- Must meet SAE AS6029 performance criteria
- Provide certification documentation
- Describe system in Section 6
- Include additional technical documentation

### Airborne Laser Operations

- Submit to Service Center where aircraft primarily based
- Attach flight location and altitude information
- Provide additional operational details

### Moving Beams

**Azimuth Entry Convention:**
- East = 90°
- South = 180°
- West = 270°
- North = 360°

**Important:** Enter degrees from smallest to largest moving clockwise
- Example: 350° to 10° (for rotation near north)
- NOT: 10° to 350° (interpreted as 340° sweep the wrong way)

---

## 7. Common Errors to Avoid

| Error | Correction |
|-------|------------|
| Using scientific notation | Use decimal notation (0.7277, not 72.77×10⁻²) |
| Omitting time zone | Always include time zone for dates/times |
| Wrong coordinate format | Use degrees, minutes, seconds (not decimal) |
| Confusing true/magnetic north | Specify which and include declination if magnetic |
| Incomplete calculations | Round UP to next whole number for safety |
| Missing attachments | List all attachments in Section 7b |

---

## 8. Processing Timeline

| Phase | Estimated Time |
|-------|---------------|
| Form preparation | Varies by complexity |
| FAA initial review | Varies by workload |
| Follow-up questions | If needed |
| Aeronautical study | Varies by complexity |
| LOD issuance | Typically 30+ days for complex operations |

**Recommendation:** Submit at least 30 days before planned operation

---

## 9. Post-Submission Actions

### If FAA Contacts You
- Respond promptly to questions
- Provide additional information as requested
- Be prepared to modify proposal

### If Objection Received
- Review FAA concerns carefully
- Modify operation to address issues
- Resubmit modified Form 7140-1
- Consider requesting conference call with FAA

### If No Objection Received
- Keep LOD on file
- Operate within approved parameters
- Notify FAA of any significant changes

---

*Reference: FAA AC 70-1B, Appendix A - Instructions for Completing FAA Form 7140-1*
