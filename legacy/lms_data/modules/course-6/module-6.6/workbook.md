# Module 6.6 Workbook: NOTAM Procedures & Emergency Protocols

## Practical Exercises

### Exercise 1: FAA Form 7140-1 Practice

**Scenario**: Complete the following sections of FAA Form 7140-1 for a proposed laser show.

**Event Details**:
- Event: "Summer Music Festival Laser Show"
- Location: Central Park, New York City
- Coordinates: 40°46'51"N, 73°58'19"W
- Elevation: 150 ft MSL
- Dates: July 4-6, 2026
- Times: 21:00-23:00 EDT
- Equipment: 8 RGB projectors (detailed below)

**Equipment Specifications**:
| Projector | Red | Green | Blue | Total | Divergence |
|-----------|-----|-------|------|-------|------------|
| Units 1-4 | 5W | 3W | 8W | 16W | 1.5 mrad |
| Units 5-8 | 3W | 2W | 5W | 10W | 1.2 mrad |

---

#### Section 1: General Information
| Field | Entry |
|-------|-------|
| 1a. To (Service Center) | |
| 1b. From (Proponent) | |
| 1c. Event Name | |
| 1d. Date Prepared | |
| 1e. Customer | |
| 1f. Site Address | |

#### Section 2: Dates and Times
| Field | Entry |
|-------|-------|
| 2a. Testing/Alignment | |
| 2b. Operation | |

#### Section 6: Control Measures
Describe your control measures:
```




```

#### Section 11: Geographic Location
| Field | Entry |
|-------|-------|
| 11a. Site Elevation | |
| 11b. Laser Height Above Site | |
| 11c. Overall Laser Elevation | |
| 11d. Information Determined By | |
| 11e. Latitude | |
| 11f. Longitude | |

#### Section 12: Beam Characteristics (Configuration 1)
| Field | Entry |
|-------|-------|
| Laser Type | |
| Laser Hazard Class | |
| Power | |
| Beam Divergence | |
| Wavelength(s) | |
| MPE Value | |
| Pre-corrected Power | |
| Visual Correction Factor | |
| Visually Corrected Power | |

---

### Exercise 2: NOTAM Decoding

**Task**: Decode the following NOTAMs and explain what each component means.

**NOTAM 1**:
```
!DCA 07/042 LAS DCA 2407042100-2407042300
LASER LIGHT SHOW WI AN AREA DEFINED AS
1.5NM RADIUS OF 385200N0770210W
SFC-4000FT AGL. CTC JOHN DOE 202-555-0147
```

| Component | Meaning |
|-----------|---------|
| !DCA | |
| 07/042 | |
| LAS | |
| DCA | |
| 2407042100-2407042300 | |
| 1.5NM RADIUS | |
| 385200N0770210W | |
| SFC-4000FT AGL | |

**NOTAM 2**:
```
!FDC 7/1234 LAS DCA..BWI..DCA
LASER LIGHT SHOW DEMONSTRATION 240704
2100-2300 1NM RADIUS 390000N0763000W.
```

| Component | Meaning |
|-----------|---------|
| !FDC | |
| 7/1234 | |
| DCA..BWI..DCA | |
| 1NM RADIUS | |

---

### Exercise 3: Protection Distance Calculations

**Task**: Complete the protection distance calculations for Section 14 of Form 7140-1.

**Given** (most powerful configuration):
- Power: 16W visible
- Divergence: 1.5 mrad
- VCP: 16W (assuming VCF = 1.0 for simplicity)
- Elevation: 15° min, 45° max

**Calculations**:

**14a. NOHD**:
```
Slant Range NOHD = (32.8 / ___) × √(1273.2 × ___ / 2.6)
                 = _____ × √(_____)
                 = _____ × _____
                 = _____ feet

Horizontal Distance = NOHD × cos(15°)
                    = _____ × 0.9659
                    = _____ feet

Vertical Distance = NOHD × sin(45°)
                  = _____ × 0.7071
                  = _____ feet
```

**14b. SZED**:
```
Slant Range SZED = (32.8 / ___) × √(12732 × ___ / 0.0001 / 1000)
                 = _____ feet
```

**14c. CZED**:
```
Slant Range CZED = SZED × 4.47
                 = _____ feet
```

**14d. LFED**:
```
Slant Range LFED = SZED × 44.7
                 = _____ feet
```

---

### Exercise 4: Emergency Response Procedures

**Scenario A**: Emergency Shutdown Timing

**Task**: Create a timeline for emergency shutdown when an aircraft is spotted.

| Time | Action | Responsible Party |
|------|--------|-------------------|
| T+0 sec | | |
| T+1 sec | | |
| T+2 sec | | |
| T+5 sec | | |
| T+10 sec | | |
| T+30 sec | | |
| All-clear received | | |

---

**Scenario B**: Multi-Agency Coordination

**Situation**: During your show, a pilot reports being illuminated. You believe it wasn't your laser, but authorities are investigating.

**Task**: Complete the coordination matrix:

| Agency | Your Role | Information to Provide | Information to Receive |
|--------|-----------|------------------------|------------------------|
| FAA | | | |
| Local Police | | | |
| FBI (if involved) | | | |
| Airport Authority | | | |
| Insurance | | | |

---

**Scenario C**: Equipment Failure During Show

**Situation**: At 21:30 during your show, the primary scan-failure protection system fails. The backup system activates, but you're unsure of its reliability.

**Decision Tree**:
```
Equipment Failure Detected
        │
        ▼
[Is show essential/can it be cancelled?]
        │
    ┌───┴───┐
    ▼       ▼
   Yes     No
    │       │
    ▼       ▼
[Action] [Action]
    │       │
    ▼       ▼
[Next step] [Next step]
```

Your complete decision process:
1. 
2. 
3. 
4. 

---

### Exercise 5: Post-Incident Documentation

**Scenario**: Your show had an emergency shutdown due to an aircraft incursion. The aircraft passed through at 21:15. The show was delayed 15 minutes and then resumed.

**Task**: Complete the incident documentation.

#### Incident Report Template

**1. Basic Information**
| Field | Entry |
|-------|-------|
| Date/Time of Incident | |
| Location | |
| Personnel On Duty | |
| Weather Conditions | |

**2. Incident Description**
```



```

**3. Actions Taken**
```



```

**4. Timeline**
| Time | Event |
|------|-------|
| 21:15:00 | |
| 21:15:30 | |
| 21:16:00 | |
| 21:30:00 | |

**5. Witness Statements**
```
Observer 1:


Observer 2:

```

**6. Follow-Up Actions**
```



```

---

### Exercise 6: Communication Scripts

**Task**: Write the scripts for the following communications.

**Script 1**: Initial Contact with ATC
```
You: "[ATC callsign], this is [your name/company] at [location],
      laser operation approved under [LOD reference]..."



```

**Script 2**: Emergency Shutdown Report
```
You: "[ATC callsign], laser show at [location], SHUTDOWN due to
      aircraft incursion. All beams terminated [time]."



```

**Script 3**: All-Clear and Resume
```
You: "[ATC callsign], laser operation at [location], all clear
      received, resuming operation at [time]."



```

**Script 4**: Daily Status Report to FAA
```
You: "[FAA Service Center], daily status report for [event name]...



```

---

## Knowledge Check Answers

Record your answers here for the module quiz:

| Question | Your Answer | Notes |
|----------|-------------|-------|
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |

---

## Self-Assessment

Rate your confidence level (1-5) for each competency:

| Competency | Rating (1-5) | Areas for Improvement |
|------------|--------------|----------------------|
| Form 7140-1 completion | | |
| NOTAM interpretation | | |
| Emergency shutdown procedures | | |
| Multi-agency coordination | | |
| Incident documentation | | |

**Overall Reflection**: What emergency scenarios do you feel least prepared for? How will you improve your readiness?

---

## Quick Reference Card

### Emergency Contacts (Fill in for your operation)

| Contact | Number | Notes |
|---------|--------|-------|
| Local ATC/FSS | | |
| FAA Service Center | | |
| Local Law Enforcement | | |
| Fire/EMS | | |
| On-Call Supervisor | | |
| Insurance 24-Hour | | |

### Kill Switch Locations

| Location | Type | Verified (Date) |
|----------|------|-----------------|
| Main Console | | |
| Backup Console | | |
| Observer Position 1 | | |
| Observer Position 2 | | |

### Equipment Status Check

| Item | Pre-Show | During Show | Post-Show |
|------|----------|-------------|-----------|
| Primary laser interlock | ☐ | ☐ | ☐ |
| Backup kill switch | ☐ | ☐ | ☐ |
| Radio communication | ☐ | ☐ | ☐ |
| Emergency lighting | ☐ | ☐ | ☐ |
| First aid kit | ☐ | N/A | ☐ |
