# ESTA Standards and ANSI E1.30-11 - Digested Content

**Source:** Entertainment Services and Technology Association (ESTA)  
**Standard:** ANSI E1.30-11 - 2019  
**Title:** EPI 33. ACN Root Layer Protocol Operation on TCP  
**Pages:** 10

---

## 1. ESTA Technical Standards Program Overview

### Mission and Purpose
The ESTA Technical Standards Program was created to:
- Serve ESTA membership and entertainment industry
- Address technical standards related matters
- Take leading role in entertainment technology
- Create recommended practices and standards
- Monitor standards issues worldwide
- Improve communications and safety within industry

### Accreditation
- **Accredited by ANSI** (American National Standards Institute)
- Standards developed through consensus process
- Open participation model

### Collaboration Partners
- USITT (United States Institute for Theatre Technology)
- VPLT (German entertainment technology association)
- ANSI (American National Standards Institute)
- UL (Underwriters Laboratories)
- NFPA (National Fire Protection Association)

---

## 2. Governance Structure

### Technical Standards Council (TSC)
- Oversees and coordinates Technical Standards Program
- Approves all projects
- Assigns projects to appropriate working groups
- Members are industry standards-making experts

### Technical Standards Manager
- Coordinates work of Council and working groups
- Maintains "Standards Watch" on behalf of members
- Current: Karl G. Ruling (ESTA, NYC)

### Working Groups
Current working groups include:
1. **Control Protocols** - EPI 33, ACN protocols
2. **Electrical Power**
3. **Event Safety**
4. **Floors**
5. **Fog and Smoke**
6. **Followspot Position**
7. **Photometrics**
8. **Rigging**
9. **Stage Machinery**

---

## 3. Participation in Standards Development

### Ways to Participate

#### 1. Working Group Membership
- Complete application from ESTA office
- Subject to working group approval
- Required: Active participation
- Respond to letter ballots
- Attend meetings
- **ESTA membership NOT required**

#### 2. Request New Standards
- Anyone can request TSC develop new standard
- Submit area of concern

### Membership Categories (Interest Codes)
| Code | Category |
|------|----------|
| CP | Custom-market producer |
| DE | Designer/engineer |
| DR | Dealer or rental company |
| G | General interest |
| MP | Mass-market producer |
| U | User |

---

## 4. ANSI E1.30-11 - ACN Protocol Standard

### Scope
- Interoperability profile for ACN Root Layer Protocol
- Specifies operation on TCP transport
- Part of E1.17 "Architecture for Control Networks"

### Key Technical Elements

#### Frame Preamble Format
```
+--------------------------------------+
|   ACN Packet Identifier (12 octets)  |
+--------------------------------------+
|        PDU Block Size  (4 octets)    |
+--------------------------------------+
```

#### Packet Identifier
- Text string: "ASC-E1.17\0\0\0"
- Hexadecimal: `41 53 43 2d 45 31 2e 31 37 00 00 00`

#### PDU Block Size
- Size of entire Root Layer PDU block
- Network byte order
- Maximum: 4 GBytes
- `0xffffffff` = indefinite length

### TCP-Specific Considerations

#### Stream-Oriented Nature
- TCP is stream-based, not packet-based
- ACN root layer divides stream into identifiable frames
- No guaranteed packet boundaries at application level

#### Synchronization
- TCP connection start clearly defined
- Reliable delivery eliminates need for rigorous sync
- Implementation should detect loss of sync quickly

#### Connection Management
- Each TCP stream uniquely identified by:
  - IP address and port at each end
  - All four values must match
- Supports multiple simultaneous connections
- Endpoint identity cannot change during connection

### Compliance Requirements

#### Transmission
- Send correct preamble before each PDU block
- No postamble
- No restriction on number of PDUs per block

#### Reception
- Verify ACN Packet Identifier on connection
- Close connection if identifier incorrect
- Compute PDU block size from preamble
- Process PDU block according to [Arch] specification
- Close connection if subsequent data doesn't match expected format

---

## 5. Standards Development Process

### ESTA Standards Philosophy
- **Consensus-based** - Broad industry agreement required
- **Open setting** - Transparent development process
- **ANSI-accredited** - Meets national standards criteria
- **Non-discriminatory** - Open to all interested parties

### Notice and Disclaimer
ESTA explicitly states:
- Does NOT approve, inspect, or certify installations
- Compliance is manufacturer's sole responsibility
- No guarantee of information accuracy
- Disclaims liability for injury or damage
- Does not render professional services

### Document Development
- Revision tracking (e.g., CP/2014-1002a)
- Copyright by ESTA
- Voting member approval required
- Multiple review cycles

---

## 6. Key Industry Standards Context

### ANSI E1 Series Standards
Entertainment technology standards include:
- **E1.17** - Architecture for Control Networks (ACN)
- **E1.30-11** - ACN Root Layer Protocol on TCP
- **E1.46** - Laser Safety in Entertainment (referenced in course)

### Relationship to Laser Safety
While E1.30-11 is a control protocol standard, ESTA's broader standards program includes:
- E1.46: Laser safety specific to entertainment
- Event Safety working group
- Coordination with ANSI Z136 series

### Industry Adoption
Standards developed through ESTA process are widely adopted by:
- Equipment manufacturers (ETC, Chauvet, Robe, etc.)
- Rental companies
- Venue operators
- Design consultants
- End users

---

## 7. Resources and Contacts

### ESTA Technical Standards
- **Address:** 630 Ninth Avenue, Suite 609, New York, NY 10036
- **Phone:** 1-212-244-1505
- **Email:** standards@esta.org
- **Website:** http://tsp.esta.org

### Technical Standards Council Co-Chairs
- Mike Garl (Mike Garl Consulting LLC)
- Mike Wood (Mike Wood Consulting LLC)

### Control Protocols Working Group Chairs
- Milton Davis (Doug Fleenor Design, Inc)
- Michael Lay (Signify)

---

## 8. Summary: ESTA's Role in Industry Standards

1. **Develops** consensus-based ANSI-accredited standards
2. **Coordinates** with international standards bodies
3. **Enables** interoperability between manufacturer equipment
4. **Supports** safety through Event Safety Working Group
5. **Provides** forum for industry technical development
6. **Maintains** open participation process
7. **Collaborates** with allied organizations (USITT, VPLT, etc.)

---

## Connection to Course 8 Learning Objectives

This standard demonstrates:
- How industry standards are developed (ESTA process)
- ANSI accreditation requirements
- Technical implementation details (control protocols)
- Industry collaboration model
- The broader context of E1.46 (laser safety) within ESTA's standards portfolio
