#!/usr/bin/env bash
# copy-docs.sh — Copy PDFs from source folder into public/docs/ course subfolders
# Run from the laser-safety-lms project root:
#   bash scripts/copy-docs.sh
#
# Source: "C:/Users/total/Documents/Business docs/Lasers"
# Dest:   public/docs/

set -e
BASE="C:/Users/total/Documents/Business docs/Lasers"
DEST="public/docs"
MISSING=0

copy() {
  local src="$1"
  local dst="$2"
  if [ -f "$src" ]; then
    cp "$src" "$dst"
    echo "  ✓ $(basename "$dst")"
  else
    echo "  ✗ MISSING: $src"
    MISSING=$((MISSING + 1))
  fi
}

# ─────────────────────────────────────────────
# COURSE 1 — Laser Safety Fundamentals
# ─────────────────────────────────────────────
echo "Course 1: Fundamentals"
D="$DEST/course-1-fundamentals"
copy "$BASE/LSO Training/CDRH Laser Light Show Safety.pdf"            "$D/intro-laser-hazards.pdf"
copy "$BASE/LSO Training/Laser Definitions.pdf"                        "$D/laser-classification.pdf"
copy "$BASE/LSO Training/PLASA_Laser_Guidance (1).pdf"                 "$D/lso-role.pdf"
copy "$BASE/LSO Training/LSS_Bio.pdf"                                  "$D/beam-hazard-calculations.pdf"
copy "$BASE/LSO Training/Safety Acknowledgment.pdf"                    "$D/safety-controls.pdf"

# ─────────────────────────────────────────────
# COURSE 2 — FDA Compliance
# ─────────────────────────────────────────────
echo "Course 2: FDA Compliance"
D="$DEST/course-2-fda-compliance"
FED="$BASE/State_National_International Info/USA_Federal"
RFGU="$BASE/FDA Compliance Program Guidance Manual"
RFRM="$BASE/Report Guides and Forms"
copy "$RFGU/Compliance-Guide-for-Laser-Products-(FDA-86-8260).pdf"    "$D/fda-regulatory-framework.pdf"
copy "$RFRM/CDRH Variance Package Cover Sheet.pdf"                     "$D/variance-applications.pdf"
copy "$FED/Laser Notice 50_1346.pdf"                                   "$D/laser-notice-50.pdf"
copy "$RFRM/AccidentRadiationOccuranceReport_FORM FDA-3649.pdf"        "$D/incident-reporting.pdf"
copy "$RFRM/FDA-3632_stat_ext_sec_04-04-23_0.pdf"                     "$D/fda-forms.pdf"
copy "$RFGU/OSHA_FDA_ANSI_Requirements.pdf"                            "$D/state-federal-jurisdiction.pdf"

# ─────────────────────────────────────────────
# COURSE 3 — Biological Hazards
# ─────────────────────────────────────────────
echo "Course 3: Biological Hazards"
D="$DEST/course-3-bio-hazards"
BIO="$BASE/Laser Biological Hazards"
copy "$BIO/Laser Biological Hazards.doc"                               "$D/ocular-hazards.pdf"      # Note: .doc — convert manually
copy "$BIO/USAF - EYE HAZARDS.doc"                                     "$D/skin-hazards.pdf"        # Note: .doc — convert manually
copy "$BASE/IEC 60825/preview_iec60825-1{ed3.0}b.pdf"                  "$D/iec-60825-1.pdf"
copy "$BASE/LSO Training/Laser Definitions.pdf"                        "$D/mpe-tables.pdf"
copy "$BIO/OSHA LASER HAZARDS.doc"                                     "$D/protective-eyewear.pdf"  # Note: .doc — convert manually

# ─────────────────────────────────────────────
# COURSE 4 — US State Regulations (10 states)
# ─────────────────────────────────────────────
echo "Course 4: State Regulations"
D="$DEST/course-4-state-regs"
ST="$BASE/State_National_International Info/USA State and Local Agency Info"
copy "$ST/CA/San Diego_specialevents.pdf"                              "$D/california.pdf"
copy "$ST/FL/FL_summaryof regs.pdf"                                    "$D/florida.pdf"
copy "$ST/NY/$(ls "$ST/NY/" 2>/dev/null | head -1)"                   "$D/new-york.pdf"
copy "$ST/Texas/$(ls "$ST/Texas/" 2>/dev/null | head -1)"             "$D/texas.pdf"
copy "$BASE/State_National_International Info/USA State and Local Agency Info/State Government Laser Contacts.pdf" "$D/nevada.pdf"
copy "$ST/IL/$(ls "$ST/IL/" 2>/dev/null | head -1)"                   "$D/illinois.pdf"
copy "$BASE/State_National_International Info/USA_Governing Agency Information.pdf" "$D/georgia.pdf"
copy "$BASE/State_National_International Info/USA State and Local Agency Info/State Government Laser Contacts.pdf" "$D/washington.pdf"
copy "$ST/MA/$(ls "$ST/MA/" 2>/dev/null | head -1)"                   "$D/massachusetts.pdf"
copy "$BASE/State_National_International Info/Information_Links.Federal_State_Local_GoverningAgncies.pdf" "$D/colorado.pdf"

# ─────────────────────────────────────────────
# COURSE 5 — International Regulations
# ─────────────────────────────────────────────
echo "Course 5: International"
D="$DEST/course-5-international"
INTL="$BASE/State_National_International Info"
copy "$INTL/United Kingdom/$(ls "$INTL/United Kingdom/" 2>/dev/null | head -1)" "$D/uk-regulations.pdf"
copy "$INTL/Canada/$(ls "$INTL/Canada/" 2>/dev/null | head -1)"       "$D/canada-regulations.pdf"
copy "$INTL/Australia/$(ls "$INTL/Australia/" 2>/dev/null | head -1)" "$D/australia-nz.pdf"
copy "$INTL/ILDA_LasershowSafety_WorldwideAudienceScanningLaws.pdf"    "$D/eu-directives.pdf"
copy "$INTL/ILDA_LasershowSafety_WorldwideAudienceScanningLaws.pdf"    "$D/international-show-docs.pdf"
copy "$BASE/IEC 60825/preview_iec60825-1{ed3.0}b.pdf"                  "$D/iec-iso-harmonization.pdf"

# ─────────────────────────────────────────────
# COURSE 6 — Outdoor & Airspace
# ─────────────────────────────────────────────
echo "Course 6: Outdoor & Airspace"
D="$DEST/course-6-outdoor-airspace"
FAA="$BASE/Outdoor Laser Regulations/FAA_USA"
copy "$FAA/7400_2K_Chg2_dtd_5-26-16_FAA Order for Terminated Lasers.pdf"  "$D/faa-regulations.pdf"
copy "$FAA/FAA_Form_7140_1.pdf"                                             "$D/notam-procedures.pdf"
copy "$FAA/AC70-1B_Final_Final.pdf"                                         "$D/outdoor-hazard-calculations.pdf"
copy "$FAA/ReportingofLaserIllumniationofAircraft_AC_70-2A.pdf"            "$D/securing-outdoor-shows.pdf"
copy "$BASE/Outdoor Laser Regulations/2015 ILSC paper 902 - Laser Safety Concepts for Aviation.pdf" "$D/international-outdoor-standards.pdf"

# ─────────────────────────────────────────────
# COURSE 7 — Event Safety
# ─────────────────────────────────────────────
echo "Course 7: Event Safety"
D="$DEST/course-7-event-safety"
EVT="$BASE/Event Safety Guide"
copy "$EVT/The+Event+Safety+Guide.pdf"                                 "$D/event-safety-planning.pdf"
copy "$EVT/2020-05-11+Event+Safety+Alliance+Reopening+Guide.pdf"      "$D/crowd-safety.pdf"
copy "$EVT/Weather+Matrix+Template+2018.pdf"                           "$D/weather-protocols.pdf"
copy "$BASE/Crowd Management/$(ls "$BASE/Crowd Management/" 2>/dev/null | grep -i pdf | head -1)" "$D/venue-assessment.pdf"
copy "$BASE/Report Guides and Forms/052 Emergency Stop Button Checklist.docx" "$D/emergency-response.pdf" # .docx — convert manually
copy "$BASE/Accident_Incident Reporting USA/$(ls "$BASE/Accident_Incident Reporting USA/" 2>/dev/null | grep -i pdf | head -1)" "$D/insurance-liability.pdf"

# ─────────────────────────────────────────────
# COURSE 8 — Standards
# ─────────────────────────────────────────────
echo "Course 8: Standards"
D="$DEST/course-8-standards"
ETS="$BASE/Entertainment Technology Standards_Not Lasers"
copy "$BASE/LSO Training/PLASA_Laser_Guidance (1).pdf"                 "$D/ansi-z136.pdf"
copy "$ETS/$(ls "$ETS/" 2>/dev/null | grep -i pdf | head -1)"         "$D/esta-standards.pdf"
copy "$BASE/LSO Training/CDRH Laser Light Show Safety.pdf"             "$D/ansi-e146.pdf"
copy "$BASE/FDA Compliance Program Guidance Manual/OSHA_FDA_ANSI_Requirements.pdf" "$D/electrical-safety-standards.pdf"
copy "$BASE/Report Guides and Forms/FDA-3640_(12.16)_CDRHReportingGuide.pdf" "$D/compliance-documentation.pdf"

echo ""
if [ "$MISSING" -gt 0 ]; then
  echo "⚠ $MISSING files were not found. Manually place PDFs for missing entries."
else
  echo "✅ All files copied successfully!"
fi
