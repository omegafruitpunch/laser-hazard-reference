# Module 6.6: NOTAM Procedures & Emergency Protocols

## Overview

The Notice to Air Missions (NOTAM) system is the primary method for alerting pilots to potential hazards, including outdoor laser operations. This module covers the complete NOTAM process, from initial filing through emergency response, ensuring you can navigate both routine notifications and crisis situations with confidence.

---

## 1. Understanding the NOTAM System

### 1.1 What is a NOTAM?

A NOTAM (Notice to Air Missions) is a notice containing information concerning the establishment, condition, or change in any aeronautical facility, service, procedure, or hazard.

#### Types of NOTAMs

| Type | Purpose | Duration |
|------|---------|----------|
| **NOTAM (D)** | Domestic - most common for laser ops | Event-based |
| **FDC NOTAM** | Flight Data Center - regulatory changes | As specified |
| **International** | For international distribution | Event-based |
| **Military** | For military operations | Event-based |

### 1.2 NOTAM Format for Laser Operations

```
┌─────────────────────────────────────────────────────────────────┐
│                 LASER NOTAM EXAMPLE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  !DCA 01/123 LAS DCA 2401151700-2401152300                      │
│  LASER LIGHT SHOW WI AN AREA DEFINED AS 1NM RADIUS              │
│  OF 385200N0770210W (DCA016013.8)                               │
│  SFC-3500FT AGL. CTC JOHN SMITH 202-555-0123                   │
│  FOR INFO. 06MAR14:20-DHH                                       │
│                                                                 │
│  Breakdown:                                                     │
│  !DCA      = Issuing facility (Washington DC)                   │
│  01/123    = Month/sequential number                            │
│  LAS       = Keyword (laser activity)                           │
│  DCA       = Affected location                                  │
│  2401151700-2401152300 = Date/time (YYMMDDHHMM)                 │
│  SFC-3500FT AGL = Altitude limits                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. FAA Form 7140-1: The Foundation

### 2.1 When to Submit Form 7140-1

Form 7140-1 must be submitted for any outdoor laser operation where:
- Visible laser beams exceed 50 nW/cm² in navigable airspace
- Any laser beam (visible or invisible) exceeds MPE limits
- Operations occur within 10 NM of an airport
- Beams project above the horizon

### 2.2 Section-by-Section Guide

#### Section 1: General Information

| Field | Required Information | Tips |
|-------|---------------------|------|
| **1a. To** | Appropriate FAA Service Center | See Appendix E of AC 70-1B |
| **1b. From** | Proponent name and contact | Primary responsible party |
| **1c. Event Name** | Specific, descriptive name | "July 4th Celebration - City Name" |
| **1d. Date** | Date form prepared | Not the event date |
| **1e/1f** | Customer/Site if different | May differ from proponent |

#### Section 2: Dates and Times

```
2a. Testing and Alignment: 
    Example: 2026-07-04, 18:00-19:00 EDT
    
2b. Operation:
    Example: 2026-07-04, 21:00-23:30 EDT
```

**Best Practice**: Add 30-minute buffer before and after for contingencies

#### Section 4: On-Site Operation Information

Critical contacts for FAA coordination:
- Primary phone must be continuously monitored
- Secondary phone for backup
- Consider cell/satellite in remote locations

#### Section 6: Control Measures Description

Required documentation of safety systems:

```
CONTROL MEASURE OPTIONS:

1. Safety Observers
   - Number and positions
   - Training qualifications
   - Communication methods

2. Electronic Protection Systems
   - Radar description
   - Software/hardware details
   - SAE AS6029 compliance

3. Physical Barriers
   - Beam termination points
   - Building/fixed structures
   - Terrain features

4. Scan Failure Protection
   - Hardware interlocks
   - Software limits
   - Independent verification
```

### 2.3 Laser Configuration Worksheet (Page 2)

#### Section 11: Geographic Location

**Coordinate Entry**:
- Latitude: Degrees, minutes, seconds (e.g., 38° 52' 12" N)
- Longitude: Degrees, minutes, seconds (e.g., 77° 02' 10" W)
- Method: GPS preferred, topographic map acceptable

#### Section 12: Beam Characteristics

**For CW Lasers**:
- Power in watts (not milliwatts)
- Divergence in milliradians
- Wavelength in nanometers

**Visual Correction Factor Calculation Example**:
```
Given: RGB laser with 8W red (630nm), 4W green (520nm), 10W blue (445nm)

Pre-corrected Power = 8 + 4 + 10 = 22W

Green VCF (520nm): 0.7092
Red VCF (630nm): 0.2653  
Blue VCF (445nm): 0.0380

Visually Corrected Power:
= (8 × 0.2653) + (4 × 0.7092) + (10 × 0.0380)
= 2.1224 + 2.8368 + 0.38
= 5.3392W

Overall VCF = 5.3392 / 22 = 0.2427
```

#### Section 14: Protection Distances

**Calculation Example** (40W CW, 1.5 mrad, visible):

```
NOHD Slant Range:
= (32.8 / 1.5) × √(1273.2 × 40 / 2.6)
= 21.87 × √19588
= 21.87 × 139.96
= 3,062 feet

SZED Slant Range:
= (32.8 / 1.5) × √(12732 × (40 × 1.0) / 0.0001 × 1000)
= 21.87 × √5,092,800
= 21.87 × 2256
= 49,358 feet

CZED = SZED × 4.47 = 220,630 feet (≈ 37 NM)
LFED = SZED × 44.7 = 2,206,303 feet (≈ 369 NM)
```

---

## 3. NOTAM Filing Process

### 3.1 Timeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    NOTAM TIMELINE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  T-30 Days (Minimum)                                            │
│     └── Submit FAA Form 7140-1 to Service Center                │
│                                                                 │
│  T-21 Days                                                      │
│     └── FAA acknowledges receipt and begins review              │
│                                                                 │
│  T-14 Days                                                      │
│     └── Respond to any FAA questions                            │
│                                                                 │
│  T-7 Days                                                       │
│     └── Receive Letter of Determination (LOD)                   │
│         └── LOD may require specific NOTAM language             │
│                                                                 │
│  T-3 Days                                                       │
│     └── File NOTAM with Flight Service Station                  │
│                                                                 │
│  T-1 Day                                                        │
│     └── Verify NOTAM published and active                       │
│                                                                 │
│  T-0 (Event Day)                                                │
│     └── Verify NOTAM still active before operations             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Filing Methods

**Primary Methods**:
1. **Online**: 1800wxbrief.com (recommended)
2. **Phone**: 1-800-WX-BRIEF (1-800-992-7433)
3. **Direct**: Contact local FSS

**Required Information**:
- FAA LOD reference number
- Event location (lat/long or landmark)
- Date and time (Zulu or local with time zone)
- Altitude restrictions
- Contact information
- Any specific hazards

---

## 4. Emergency Response Protocols

### 4.1 Types of Laser Incidents

#### Type 1: Unauthorized Laser Illumination

When someone aims a laser at an aircraft (NOT your operation):

**Immediate Actions**:
1. Do NOT interfere with law enforcement
2. Document what you observe
3. Continue your safe operation
4. Be prepared to provide witness information

#### Type 2: Aircraft Encroachment on Your Operation

When an aircraft enters your protected airspace:

**Immediate Shutdown Sequence**:
```
┌──────────────────────────────────────────────────────────────┐
│           EMERGENCY SHUTDOWN PROCEDURE                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  0 SECONDS: Observer spots aircraft                          │
│             ↓ "Aircraft spotted, all stop!"                  │
│                                                              │
│  1 SECOND:  Operator activates emergency stop                │
│             All laser beams terminated                       │
│                                                              │
│  2 SECONDS: Observer confirms shutdown                       │
│             Tracks aircraft position                         │
│                                                              │
│  5 SECONDS: Operator confirms equipment status               │
│             No unintended beam emissions                     │
│                                                              │
│  10 SECONDS: Contact ATC if applicable                       │
│              "Laser show at [location] shut down             │
│               due to aircraft incursion"                     │
│                                                              │
│  AWAIT ALL-CLEAR: Do not resume until                        │
│                   aircraft clear and                         │
│                   observers confirm                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### 4.2 Coordination with ATC

**When to Contact ATC**:
- Before show (if required by LOD)
- Emergency shutdown
- Show completion
- Any deviation from approved plan

**Standard Phraseology**:
```
Initial Contact:
"[ATC Facility], this is [Your Name/Company] at [Location], 
FAA Form 7140-1 approved laser operation, requesting 
coordination."

Emergency:
"[ATC Facility], laser show at [Location] SHUT DOWN due to 
aircraft incursion. All beams terminated at [time]."

All Clear:
"[ATC Facility], airspace clear, laser operation resumed 
at [time]."
```

### 4.3 Law Enforcement Coordination

**During an Incident**:
- Cooperate fully with investigators
- Provide documentation (LOD, NOTAM, logs)
- Do not admit fault or make statements without counsel
- Preserve all records and recordings

**Documentation to Maintain**:
- Observer logs
- Communication recordings
- Equipment status logs
- Weather records
- Personnel certifications

---

## 5. Emergency Response Simulator Scenarios

### 5.1 Scenario 1: Pilot Reports Laser

**Situation**: A pilot reports being illuminated by a laser. The source is traced to your show area, but your observers didn't spot the aircraft.

**Decision Points**:
- Was your laser the source, or was there another laser?
- Did observers miss the aircraft, or was the report erroneous?
- Should you shut down voluntarily?

**Recommended Actions**:
1. Immediately implement safety pause
2. Verify all equipment functioning normally
3. Review observer positions and procedures
4. Contact FAA for guidance
5. Document everything

### 5.2 Scenario 2: Equipment Malfunction During Show

**Situation**: Scan-failure protection triggers during the show, but some beams continue.

**Decision Points**:
- Is the emergency stop working?
- Are beams pointing in safe directions?
- Can you safely approach equipment?

**Recommended Actions**:
1. Activate backup kill switch
2. Evacuate beam paths
3. Secure the area
4. Do NOT restart until equipment inspected

### 5.3 Scenario 3: Medical Emergency on Site

**Situation**: A crew member suffers a medical emergency requiring evacuation.

**Decision Points**:
- Can show continue safely with reduced crew?
- Are emergency services available?
- Is evacuation route clear?

**Recommended Actions**:
1. Implement orderly shutdown if needed
2. Clear evacuation route
3. Contact emergency services
4. Assign crew member to assist responders
5. Resume only when situation resolved

---

## 6. Post-Incident Procedures

### 6.1 Immediate Documentation

Within 1 hour of any incident:
- Timestamp of event
- Personnel involved
- Actions taken
- Witness statements
- Equipment status

### 6.2 FAA Reporting

**Required Reports**:
- Any deviation from approved operation
- Aircraft illumination incidents
- Equipment failures affecting safety

**Timeline**: Within 24 hours for serious incidents

### 6.3 Continuous Improvement

After every operation:
- Debrief all personnel
- Identify lessons learned
- Update procedures
- Retrain as needed

---

## 7. Best Practices Summary

### Pre-Operation
✓ File Form 7140-1 at least 30 days in advance  
✓ Verify NOTAM is active 1 day before  
✓ Confirm all emergency contacts  
✓ Brief all personnel on emergency procedures  

### During Operation
✓ Maintain continuous observer vigilance  
✓ Monitor weather conditions  
✓ Keep communication channels clear  
✓ Be prepared to shutdown instantly  

### Post-Operation
✓ Verify NOTAM cancellation  
✓ Complete all documentation  
✓ Conduct thorough debrief  
✓ Update procedures as needed  

---

## Key Takeaways

✓ **Early filing prevents last-minute complications**  
✓ **NOTAMs are legal documents - accuracy is critical**  
✓ **Emergency stops must be instantaneous - practice the muscle memory**  
✓ **Documentation protects you legally and operationally**  
✓ **When in doubt, shut down - safety over show**

---

## Quick Reference: Emergency Numbers

| Situation | Contact | Number |
|-----------|---------|--------|
| **Aircraft Emergency** | ATC/FSS | 1-800-WX-BRIEF |
| **Unauthorized Laser** | Local Law Enforcement | 911 |
| **FAA Hotline** | FAA Operations Center | (202) 267-3333 |
| **Equipment Failure** | FAA Service Center | Per region |
| **Medical Emergency** | Emergency Services | 911 |
