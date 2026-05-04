# PVAX Changelog

## v0.3 — 2026-05-04 (formal JSON Schema + state grant appendix)

First public release on GitHub at [oneshot2001/PVAX](https://github.com/oneshot2001/PVAX).

### Added

- **`schema/pvax.schema.json`** — formal JSON Schema 2020-12 definition. 11 `$defs` (GeneratedBy, Facility, ThreatModel, Finding, Control, Quote, Evidence, Test, Outcomes, Attestation, GrantAttachment). The example file validates cleanly against the schema (verified with the `jsonschema` Draft202012Validator).
- **`appendices/state-grants.md`** — 15-state school safety grant programs (TX, FL, CA, NY, PA, OH, MI, GA, NC, AZ, CO, TN, VA, IL, NJ) with primary-source URLs, exact quotes from agency documents, and verification confidence flags. Four states marked MEDIUM (NC, AZ, CO, IL) require independent re-verification against enacted budget bills or agency award ledgers before being used as definitive references. Maintenance cadence: every 90 days, or when a state agency publishes a new fiscal-year NOFO.
- **`LICENSE-CC0.txt`** — Creative Commons CC0 1.0 Universal Public Domain Dedication for schema, methodology, vocabulary, and appendix content.
- **`LICENSE-MIT.txt`** — MIT License for reference tools (pvax-validate, pvax-builder when released).
- **`CONTRIBUTING.md`** — source-hierarchy rules, methodology requirements, conflict-of-interest disclosure rules.
- **`.gitignore`** — local PDFs/DOCXs excluded from the repo (canonical source is markdown).

### Schema details

The formal schema enumerates:

- **14 facility types** (k12_school, higher_education, house_of_worship, nonprofit, healthcare, retail, cannabis_dispensary, multifamily, government, critical_infrastructure, open_public_space, outdoor_event_venue, self_storage, hospitality, industrial, marina_waterfront, equine, other)
- **10 threat scenarios** (active_shooter_external/internal, insider_unauthorized_access, after_hours_burglary, vehicle_borne_threat, swatting_or_diversion, cyber_physical_compromise, insider_threat_intelligence, medical_emergency_disguised_threat, civil_disturbance_spillover)
- **15 control types** (physical_barrier, access_control, detection, video, intrusion, communications, lighting, training, policy, procedural, environmental, redundancy, ballistic_protection, mass_notification, threat_assessment_team)
- **PVAX timeline variables** for active-shooter analysis (detection_latency, notification_latency, lockdown_latency, breach_delay, responder_travel_time, contact_intervention_time) — populated locally from dispatch data, drills, engineering analysis, vendor test reports, NOT from documentation defaults

### Items still deferred to v0.4+

- Controlled vocabulary files in `vocabulary/` (currently inlined as enums in the schema; will be split into separate JSON files for independent versioning)
- Underserved-vertical addenda (cannabis state regs, marina 33 CFR Part 105 + NFPA 303, equine NFPA 150, RTCC BJA guidance, BWC BJA NOFO)
- All-50-states grant coverage (currently 15 states)
- Tribal nation school safety programs
- Higher-education-specific safety funding appendix
- `pvax-validate` reference CLI tool (Node.js + ajv)
- `pvax-builder` mobile-first PWA reference implementation
- C2PA-signed envelope format for `.pvax` (currently `.pvax.json` only)

## v0.2 — 2026-05-03 (citation audit)

Comprehensive citation and methodology audit performed via OpenAI Deep Research, applied to all source documents. No breaking schema changes; all changes are clarifications, terminology corrections, and added citations.

### Methodology corrections

- **CPTED principles** — "Maintenance" relabeled to "Maintenance and Management" per CDSE Job Aid and U.S. CPTED Association naming. PVAX abbreviates to "Maintenance" in some references for brevity. Added v0.1 caveat that PVAX uses first-generation CPTED only; second-generation CPTED is roadmapped for v0.2+.
- **Layered Defense / 4D** — relabeled as "PVAX 4D adaptation" (not industry-canonical). Noted that the full CDSE security-in-depth taxonomy is **Deter, Detect, Delay, Document, Defend/Deny** (5 functions). PVAX simplifies to 4 functions for assessment purposes. Zone set explicitly labeled as PVAX-defined; additional zones (cyber/control room, parking, public lobby, restricted operations, critical utilities) allowed.
- **CARVER scoring** — removed unverified "score above 22 = high criticality" threshold. PVAX uses a 1-5 scoring scale per factor (24-point composite). Original FDA CARVER + Shock uses a 1-10 scale and ranks relatively. PVAX threshold is now explicitly labeled as a PVAX-defined working convention requiring local calibration. Removed unverified "federal grant reviewers are trained on it" claim.
- **CARVER factors** — added note that "Recoverability" (NIST-hosted sources) and "Recuperability" (FDA CARVER + Shock) are alternate terms by source.
- **Active-shooter timeline** — removed the fixed T+0 / T+15 / T+45 / T+60 / T+90 / T+240 / T+360 second values, which are not supported as a universal federal standard by FBI Active Shooter Reports. Replaced with **PVAX timeline variables** (`detection_latency`, `notification_latency`, `lockdown_latency`, `breach_delay`, `responder_travel_time`, `contact_intervention_time`) that must be populated locally from dispatch data, drills, engineering analysis, vendor test reports, or facility testing.
- **Active-shooter control examples** — vestibule "+30s," gunshot detection "T+5s," and strike-resistant doors "+4 minutes" claims removed. Replaced with measured/test-derived language; vendor performance claims must be backed by documentation.
- **Cyber-physical convergence** — corrected NIST SP 800-82 publication date from "2025" to **September 2023 (Rev. 3)**. Removed the claim that SP 800-82r3 "formally merged cyber and physical security in 2025"; the actual scope is OT guidance expansion that includes physical access control systems and building automation systems.
- **Vendor-neutrality** — strengthened with explicit rules forbidding manufacturer-ecosystem, cloud-only, on-prem-only, hybrid, proprietary, or open-platform preferences. Architecture choice must be justified by requirements, risk, staffing, lifecycle, privacy, procurement, and interoperability.
- **Conflict-of-interest** — `coi_disclosed` strengthened with 2 CFR Part 200 procurement-conflict-of-interest tie-in. Disclosure must identify relationship, affected control categories, mitigation steps, and whether equivalent alternative architectures were considered.
- **Common findings list** — vendor-neutral language replacements:
  - "old cameras (5+ years, often non-NDAA)" → "camera systems with documented coverage, resolution, cybersecurity, lifecycle-support, retention, interoperability, or federal-funding-compliance gaps"
  - "exterior lighting inadequate for facial recognition, sodium vapor instead of white LED" → "exterior lighting fails documented observation, recognition, or identification objectives under site-specific conditions"
  - "VMS or access control accessible from public network without VPN" → "remote administrative access lacks documented encryption, MFA, segmentation, least privilege, logging, monitoring, and approved secure-access architecture"

### Federal funding & compliance corrections

- **FEMA NSGP** — added FY2025 NOFO detail: $274.5M total, split equally NSGP-UA $137.25M / NSGP-S $137.25M. Added Assistance Listing 97.008 and opportunity number DHS-25-GPD-008-00-99. Clarified that State Administrative Agencies apply to FEMA; nonprofit organizations are subapplicants. Added explicit "no FY2026 allocation verified as of May 3, 2026" caveat.
- **DOJ COPS SVPP** — replaced "$73M annually" with "FY2025 NOFO up to $73M; FY2025 awards: 211 totaling $74,785,459." Added Assistance Listing 16.071 and opportunity O-COPS-2025-172379. Added max $500k federal share and 25% local cash match. Noted that SVPP does not fund SRO positions.
- **Section 889** — removed "grant equipment-replacement provisions" framing as legally imprecise. Replaced with "federal award and procurement restrictions on covered telecommunications and video-surveillance equipment, including Section 889, FAR 52.204-24/25/26, 2 CFR §200.216, and FCC Covered List requirements." Clarified that the FCC Secure and Trusted Communications Networks Reimbursement Program is a separate, narrow rip-and-replace program for eligible advanced communications providers — not a general school/nonprofit/public-safety equipment-replacement grant.
- **NDAA shorthand** — removed all use of "non-NDAA" as a compliance term. Replaced with "covered telecommunications or video-surveillance equipment under Section 889 / FAR / 2 CFR §200.216 / FCC Covered List restrictions." Compliance is dynamic and must reference the current FCC Covered List, not a static manufacturer list.

### Citation additions

Added authoritative-source citations for:

- FY2025 FEMA NSGP NOFO (FEMA/DHS)
- FY2025 COPS SVPP NOFO + Award List (DOJ/COPS Office)
- 2 CFR §200.216 — federal grant covered-equipment prohibition (eCFR)
- 2 CFR §200.313 — equipment management for federally funded equipment (eCFR)
- 2 CFR Part 200 procurement standards (eCFR)
- FAR 52.204-24, 52.204-25, 52.204-26 (Acquisition.gov)
- FCC Covered List + 2026 update (FCC)
- FCC Secure and Trusted Communications Networks Reimbursement Program FAQ (FCC)
- NIST CSF 2.0 (NIST)
- NIST SP 800-53 Rev. 5 — PE controls (NIST)
- NIST SP 800-171 Rev. 3 (NIST)
- NIST SP 800-82 Rev. 3 — corrected publication date 2023-09 (NIST)
- FBI CJIS Security Policy v6.0 (FBI/CJIS)
- FERPA photo/video guidance (U.S. Department of Education)
- ADA Title II / 28 CFR Part 35 (eCFR)
- FBI Active Shooter Incidents 2024 Report + 20-Year Review (FBI)
- FDA CARVER + Shock Primer (FDA)
- CDSE CPTED Job Aid (Center for Development of Security Excellence)

### Schema changes

- `threat_model.framework_references` — entries now carry explicit `published`, `version`, `section`, `applicable_when`, and `url` fields where relevant.
- `quotes[].compliance_attestations` — replaced `section_889_ndaa_compliant` with `section_889_compliant` plus `section_889_basis` array (Public Law 115-232 §889, 2 CFR §200.216, FAR 52.204-24-26). Added `fcc_covered_list_clear` boolean and `fcc_covered_list_retrieved` date — covered-list compliance is dynamic and must be verified at the date of procurement.

### Documents updated

- `README.md` — federal-funding section rewritten; new "Federal-funding compliance terminology" subsection added.
- `METHODOLOGY.md` — Layer 2 reframed as PVAX adaptation; CARVER section rewritten; active-shooter timeline replaced with variables; cyber-physical paragraph corrected; common findings list cleaned for vendor-neutrality; "What this methodology refuses to do" section strengthened.
- `SPEC.md` — `framework_references` and `compliance_attestations` schemas updated with corrected citations and terminology.
- `examples/elementary-school.pvax.json` — same corrections applied to the worked example.
- `CHANGELOG.md` — this file (new).

### Items deferred to v0.3

- **State school safety grant appendix** — Deep Research returned a verified table covering 15 states (TX, FL, CA, NY, PA, OH, MI, GA, NC, AZ, CO, TN, VA, IL, NJ). Will land as `appendix-state-grants.md` once the four medium-confidence states (NC, AZ, CO, IL) are independently re-verified against enacted budget bills or agency award ledgers.
- **Underserved-vertical addenda** — site-type-specific finding/control addenda for cannabis dispensaries (state regulation model: California DCC), marinas (33 CFR Part 105 + NFPA 303), equine facilities (NFPA 150), RTCC operations (BJA RTCC guidance), and body-worn camera environments (BJA BWC NOFO + IACP/PERF policy). Each becomes a focused appendix when sourced from primary documents.
- **Formal JSON Schema** — `pvax.schema.json` (JSON Schema 2020-12) ships in v0.2 alongside the prose spec.
- **Vocabulary files** — `vocabulary/threat_scenarios.json`, `finding_categories.json`, `control_types.json`, `cpted_principles.json`, `csf_control_mapping.json`, `iec_62676_6_test_types.json`.

## v0.1 — 2026-05-02 (initial draft)

- Initial PVAX schema spec (`SPEC.md`) extending CISA SSAT JSON
- Initial methodology document (`METHODOLOGY.md`) with CPTED + 4D + CARVER + active-shooter timeline + cyber-physical convergence
- README with vendor-neutrality manifesto + federal-funding rationale
- Distribution-and-pricing notes
- Worked example: elementary school assessment
