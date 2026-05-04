# PVAX v0.2 — Schema Specification

> Version: **0.2** (draft, citation audit applied 2026-05-03)
> Status: pre-publication
> File extension: `.pvax.json` (unsigned) | `.pvax` (signed envelope; planned v0.3)
> Encoding: UTF-8 JSON, RFC 8259
> See [CHANGELOG.md](./CHANGELOG.md) for v0.1 → v0.2 changes

---

## File envelope

A PVAX file is a single JSON object with these top-level fields:

```json
{
  "pvax_version": "0.1",
  "assessment_id": "01HKM5XEA3...",
  "generated_at": "2026-05-03T14:22:00-06:00",
  "generated_by": { ... },
  "facility": { ... },
  "threat_model": { ... },
  "findings": [ ... ],
  "controls": [ ... ],
  "quotes": [ ... ],
  "evidence": [ ... ],
  "tests": [ ... ],
  "outcomes": { ... },
  "attestations": [ ... ],
  "grant_attachments": [ ... ],
  "extensions": { ... }
}
```

Every section below specifies field names, types, requirement levels (MUST / SHOULD / MAY), and references to the source standard where applicable.

---

## 1. `pvax_version`  *(string, MUST)*

Semantic version of the schema this file conforms to. Currently `"0.1"`.

## 2. `assessment_id`  *(string, MUST)*

A globally unique identifier for this assessment. ULID (preferred) or UUIDv4. Stable across edits — a revised assessment produces a new `assessment_id` only if the facility scope changes.

## 3. `generated_at`  *(string, MUST)*

ISO 8601 timestamp with timezone offset.

## 4. `generated_by`  *(object, MUST)*

```json
{
  "assessor": {
    "name": "Matthew Visher",
    "credentials": ["Retired Sergeant, UPD (20 yrs)", "Multi-agency federal task force (USMS/DEA/ATF/FBI/DHS)"],
    "license_or_cert": "ASIS PSP (if applicable)",
    "organization": "Independent" | "Firm name",
    "contact": "email or phone"
  },
  "tool": {
    "name": "pvax-builder",
    "version": "0.1.0",
    "vendor": "Visher / independent",
    "source_url": "https://github.com/oneshot2001/pvax-builder"
  },
  "coi_disclosed": [
    { "vendor": "Axis Communications", "relationship": "Day-job employer (Alpha Vision); recommendations in this file MUST be method-driven, not vendor-driven", "applies_to": "all sections" }
  ]
}
```

`coi_disclosed` is **MUST** when the assessor has any commercial relationship with manufacturers whose products appear in `controls`.

## 5. `facility`  *(object, MUST — extends CISA SSAT site fields)*

```json
{
  "facility_id": "string",
  "name": "Lincoln Elementary School",
  "type": "k12_school" | "house_of_worship" | "nonprofit" | "healthcare" | "retail" | "multifamily" | "government" | "other",
  "occupancy_count": 420,
  "address": {
    "line1": "123 Main St",
    "city": "Salt Lake City",
    "state": "UT",
    "postal_code": "84101",
    "country": "US"
  },
  "geo": { "lat": 40.7608, "lon": -111.8910 },
  "construction": {
    "primary_use": "education",
    "year_built": 1978,
    "stories": 1,
    "exterior_construction": "masonry" | "wood_frame" | "concrete" | "mixed",
    "roof": "flat" | "pitched"
  },
  "ahj": { "name": "Salt Lake City Fire Marshal", "jurisdiction_code": "UT-SLC" },
  "ssat_export_uuid": "if-this-extends-a-CISA-SSAT-export"
}
```

The `ssat_export_uuid` field links to a CISA SSAT JSON export when one exists, allowing the PVAX to extend rather than replace.

## 6. `threat_model`  *(object, MUST)*

The threats this assessment evaluates. Vendor-neutral by construction.

```json
{
  "scenarios": [
    {
      "id": "active_shooter_external",
      "name": "Active shooter, external entry",
      "frequency_class": "low",
      "consequence_class": "catastrophic",
      "design_basis_threat": "single armed assailant, lawful entry attempt at primary entrance, 4-minute response to first armed responder"
    },
    { "id": "insider_unauthorized_access" },
    { "id": "after_hours_burglary" },
    { "id": "vehicle_borne_threat" },
    { "id": "swatting_or_diversion" },
    { "id": "cyber_physical_compromise" }
  ],
  "framework_references": [
    { "name": "NIST SP 800-82 Rev. 3", "published": "2023-09", "section": "OT physical security convergence; physical access control systems and building automation systems are within scope", "url": "https://csrc.nist.gov/pubs/sp/800/82/r3/final" },
    { "name": "NIST CSF 2.0 Core", "url": "https://www.nist.gov/cyberframework" },
    { "name": "NIST SP 800-53 Rev. 5", "section": "Physical and Environmental Protection (PE) controls", "url": "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final" },
    { "name": "FBI CJIS Security Policy", "version": "v6.0", "published": "2024-12-27", "applicable_when": "Criminal Justice Information is processed, stored, or transmitted (RTCC, ALPR, BWC, CAD/RMS integrations)", "url": "https://le.fbi.gov/file-repository/cjis_security_policy_v6-0_20241227.pdf" },
    { "name": "ASIS Physical Asset Protection Standard 2026" },
    { "name": "FERPA video/photo guidance", "applicable_when": "K-12 / higher-ed video records directly related to a student", "url": "https://studentprivacy.ed.gov/faq/faqs-photos-and-videos-under-ferpa" },
    { "name": "ADA Title II / 28 CFR Part 35", "applicable_when": "facility is a public entity", "url": "https://www.ecfr.gov/current/title-28/chapter-I/part-35" }
  ]
}
```

Scenario IDs come from a controlled vocabulary published in `vocabulary/threat_scenarios.json` in this repo.

## 7. `findings`  *(array, MUST — at least one)*

Each finding is a vulnerability identified during the assessment.

```json
{
  "id": "F-001",
  "category": "perimeter" | "entry_control" | "interior_access" | "detection" | "delay" | "response_time" | "single_point_of_failure" | "cyber_physical" | "policy_or_training" | "environmental_design" | "other",
  "title": "Primary entrance has no visitor management; door held open during arrival hours",
  "description": "Free-text summary of what was observed.",
  "location_in_facility": "main entrance, west elevation",
  "observed_during": "weekday-morning-arrival",
  "applicable_threats": ["active_shooter_external", "insider_unauthorized_access"],
  "severity": {
    "scale": "carver" | "1_5" | "low_med_high",
    "score": { "criticality": 5, "accessibility": 5, "recoverability": 4, "vulnerability": 5, "effect": 5, "recognizability": 5 },
    "rationale": "Free entry during a 25-minute window, no supervisory staff visible, sight line obstructed by parked buses"
  },
  "evidence_refs": ["E-001", "E-002"],
  "cpted_principle": "natural_surveillance" | "natural_access_control" | "territorial_reinforcement" | "maintenance" | null,
  "layered_defense_zone": "perimeter" | "exterior_envelope" | "interior" | "asset" | null,
  "active_shooter_timeline_seconds": { "current": 240, "post_mitigation": 60 },
  "single_point_of_failure": false,
  "cyber_physical_dependency": null
}
```

Severity supports multiple scales because grant programs disagree on which to use; the assessor selects one and PVAX preserves it. CARVER scoring is preferred for federal applications.

## 8. `controls`  *(array, MUST when findings exist)*

Each control is a recommended mitigation. **Recommendations are method-driven** — they cite the framework that produces the recommendation, not a product.

```json
{
  "id": "C-001",
  "addresses_findings": ["F-001"],
  "control_type": "physical_barrier" | "access_control" | "detection" | "video" | "intrusion" | "communications" | "lighting" | "training" | "policy" | "procedural" | "environmental" | "redundancy",
  "title": "Vestibule-with-visitor-management at primary entrance",
  "description": "Add interior secondary door creating a controlled vestibule. Visitor identification verified before secondary unlock during arrival/dismissal hours. Existing door staff equipped with duress signal.",
  "framework_basis": [
    { "framework": "NIST CSF 2.0", "function": "PR.AC-1", "category": "Identity Management & Access Control" },
    { "framework": "CPTED", "principle": "natural_access_control" },
    { "framework": "Layered Defense", "zone": "exterior_envelope" }
  ],
  "expected_outcome": {
    "metric": "active_shooter_timeline_seconds",
    "current": 240,
    "post_install": 60,
    "rationale": "Vestibule adds delay element; verified visitor management closes free-entry window"
  },
  "alternatives": [
    { "approach": "Staffed entry without vestibule", "reason_not_selected": "Single-point-of-failure on staff presence" },
    { "approach": "Mantrap turnstile", "reason_not_selected": "Inconsistent with K-12 fire egress requirements" }
  ],
  "vendor_neutral_specification": "Door hardware: ANSI/BHMA Grade 1 cylindrical lockset, 5-pin minimum, restricted keyway. Electric strike: 12/24 VDC fail-secure, 1500lb static. Visitor management: any commercial visitor management system supporting credential issuance + ID scan logging + alarm-condition lockdown integration.",
  "estimated_cost_range_usd": { "low": 18000, "high": 32000 },
  "labor_hours_estimate": 24,
  "lead_time_weeks": 6
}
```

`vendor_neutral_specification` is **MUST**. Concrete brands and SKUs only appear in `quotes`, not in the control itself.

## 9. `quotes`  *(array, MAY — present when integrator pricing is gathered)*

```json
{
  "id": "Q-001",
  "control_id": "C-001",
  "integrator": { "name": "ABC Security Integration", "license": "UT-LV-12345", "contact": "..." },
  "quote_date": "2026-05-15",
  "valid_through": "2026-08-15",
  "currency": "USD",
  "line_items": [
    { "description": "Aluminum-frame interior door + glazing", "manufacturer": "Generic", "model": "GEN-DR-36", "qty": 1, "unit_cost": 4200, "extended": 4200 },
    { "description": "Electric strike, fail-secure", "manufacturer": "HES", "model": "9600-12/24D-630", "qty": 1, "unit_cost": 285, "extended": 285 },
    { "description": "Visitor management system, 1-year subscription", "manufacturer": "Generic VMS provider", "model": "starter", "qty": 1, "unit_cost": 1200, "extended": 1200 }
  ],
  "labor": { "hours": 24, "rate_per_hour": 95, "extended": 2280 },
  "subtotal": 7965,
  "tax": 0,
  "total": 7965,
  "compliance_attestations": {
    "section_889_compliant": true,
    "section_889_basis": [
      "Public Law 115-232 §889",
      "2 CFR §200.216",
      "FAR 52.204-24 / 52.204-25 / 52.204-26"
    ],
    "fcc_covered_list_clear": true,
    "fcc_covered_list_retrieved": "2026-05-03",
    "buy_american_act": "partial — verified for door hardware",
    "trade_agreements_act": "n/a"
  },
  "notes": "Quote excludes electrical work needed to bring power to electric strike; coordinated with electrician sub."
}
```

For any quote tied to federally funded work, attestation against **Section 889 / FAR / 2 CFR §200.216 / current FCC Covered List** is MUST. PVAX does not use the informal "non-NDAA" shorthand — covered-list compliance is dynamic and must be re-checked against the [current FCC Covered List](https://docs.fcc.gov/public/attachments/DA-21-309A1.pdf) at the date noted in `fcc_covered_list_retrieved`. The [FCC Secure and Trusted Communications Networks Reimbursement Program](https://docs.fcc.gov/public/attachments/DA-25-741A2.pdf) is a separate, narrow rip-and-replace program for eligible advanced communications providers — it is not a general school / nonprofit / public-safety equipment-replacement grant.

## 10. `evidence`  *(array, MAY — but every finding SHOULD have at least one)*

Photos, videos, and documents that substantiate findings, controls, installations, and tests. All media SHOULD be C2PA-signed.

```json
{
  "id": "E-001",
  "kind": "photo" | "video" | "document" | "drawing" | "log_export",
  "captured_at": "2026-05-03T08:14:00-06:00",
  "captured_by": "Matthew Visher",
  "stage": "pre_install" | "post_install" | "during_assessment" | "test",
  "location_in_facility": "main entrance, west elevation, exterior",
  "file": {
    "filename": "F-001-pre-install-main-entrance.jpg",
    "sha256": "a1b2c3...",
    "c2pa_manifest_present": true,
    "size_bytes": 2840192,
    "mime_type": "image/jpeg"
  },
  "describes_findings": ["F-001"],
  "describes_controls": [],
  "describes_tests": []
}
```

The actual media files travel as a separate folder alongside the `.pvax.json` (v0.1) and as a signed bundle inside the `.pvax` envelope (planned v0.2).

## 11. `tests`  *(array, MAY — present after install + commissioning)*

Operational tests that prove a control performs as designed.

```json
{
  "id": "T-001",
  "control_id": "C-001",
  "test_date": "2026-08-22",
  "test_type": "operational" | "performance" | "ai_analytics_accuracy" | "alarm_response_time" | "drill",
  "performed_by": "ABC Security Integration + facility staff",
  "method": "Three-iteration unannounced visitor entry simulation; measured time from approach to secondary door release.",
  "result": "pass" | "fail" | "partial",
  "metrics": {
    "active_shooter_timeline_seconds_measured": 58,
    "target": 60,
    "iterations": 3,
    "false_positive_rate": null
  },
  "evidence_refs": ["E-008", "E-009"],
  "framework_compliance": [
    { "standard": "IEC 62676-6:2026", "applicable": false, "reason": "No VCA in this control" }
  ],
  "notes": "Iteration 2 took 71s due to staff tablet sleep; mitigation: tablet wake interval reduced to 30s."
}
```

`IEC 62676-6:2026` test compliance is **MUST** when the control includes video content analysis (VCA).

## 12. `outcomes`  *(object, SHOULD — completed during the grant cycle that funded the work)*

The outcome of the entire transaction. **This is the field that distinguishes PVAX from compliance theater.**

```json
{
  "grant_outcome": {
    "program": "FEMA NSGP" | "DOJ COPS SVPP" | "state_school_safety" | "other",
    "fy": "FY2025",
    "applied_amount_usd": 250000,
    "awarded_amount_usd": 187500,
    "awarded_date": "2026-09-15",
    "reviewer_notes_provided": false
  },
  "implementation": {
    "controls_funded": ["C-001", "C-003", "C-005"],
    "controls_unfunded": ["C-002", "C-004"],
    "completed_by": "2027-03-01",
    "actual_cost_usd": 165200
  },
  "post_implementation": {
    "incident_count_pre": 14,
    "incident_count_post_12mo": 3,
    "incident_categories": ["unauthorized_entry", "lock_compromise", "non_compliance_visit"],
    "insurance_premium_delta_usd": -8400,
    "qualitative_notes": "..."
  }
}
```

The aggregated, anonymized version of this field across many PVAX files becomes the **outcomes corpus** — the data flywheel that makes PVAX irreplaceable.

## 13. `attestations`  *(array, MUST when file is final)*

Cryptographic signatures attesting to portions of the file. Multi-party — assessor, integrator, AHJ, insurer can each sign.

```json
{
  "id": "A-001",
  "role": "assessor" | "integrator" | "ahj" | "insurer" | "facility_owner" | "third_party_auditor",
  "name": "Matthew Visher",
  "signed_at": "2026-05-03T18:00:00-06:00",
  "covers_sections": ["facility", "findings", "controls", "evidence"],
  "signature": {
    "alg": "ed25519",
    "public_key": "...",
    "signature_b64": "..."
  },
  "statement": "I have personally observed the conditions described in this assessment on the date(s) listed in `evidence` and attest that the findings reflect the facility as it existed at that time."
}
```

Signature targets a deterministic canonicalization of the named sections (JCS / RFC 8785). Detached signatures only — no nested signature inside the signed payload.

## 14. `grant_attachments`  *(array, MAY — generated, not authored)*

Pre-formatted exports for specific federal/state grant programs. Generated from the canonical fields above; not stored as canonical data.

```json
{
  "program": "FEMA NSGP FY2026",
  "format": "investment_justification_v3" | "svpp_attachment_a" | "state_specific",
  "rendered_pdf_sha256": "...",
  "rendered_at": "2026-05-04T09:00:00-06:00",
  "fields_filled": {
    "vulnerability_summary_narrative": "...generated from `findings` and `threat_model`...",
    "proposed_investments_table": "...generated from `controls` and `quotes`...",
    "projected_milestones": "...generated from `controls.lead_time_weeks` and `tests` plan..."
  }
}
```

## 15. `extensions`  *(object, MAY)*

Implementation-specific extensions outside the canonical schema. Extensions MUST be namespaced (`vendor.field`) and MUST NOT change semantics of canonical fields.

```json
{
  "extensions": {
    "axisx.crossref_seed": { "competitor_devices_found": [...] },
    "pvax-builder.draft_state": { "completion_pct": 87 }
  }
}
```

---

## Vocabulary files (referenced in this spec)

These ship in the same repo under `vocabulary/`:

- `vocabulary/threat_scenarios.json` — controlled list of threat scenario IDs
- `vocabulary/finding_categories.json` — finding category enum
- `vocabulary/control_types.json` — control type enum
- `vocabulary/cpted_principles.json` — CPTED principle enum
- `vocabulary/csf_control_mapping.json` — NIST CSF 2.0 Core mapping (subset relevant to physical security)
- `vocabulary/iec_62676_6_test_types.json` — VCA test type enum (when published)

## Validation

Reference validator: `pvax-validate` (Node.js + JSON Schema 2020-12). Validates schema conformance, signature verification, and cross-reference integrity (e.g., every `addresses_findings` ID exists in `findings`).

```bash
pvax-validate ./elementary-school.pvax.json
# → PASS: schema 0.1, 12 findings, 12 controls, 8 attestations verified
```

## Open issues for v0.1 → v0.2

- C2PA manifest embedding: signed-envelope format vs. sidecar
- Multi-facility (district/portfolio) bundling
- Encrypted sections for sensitive operational details (insider threat, security staff schedules)
- Internationalization beyond US grant programs
- ASIS PAP Standard 2026 alignment review
- ONVIF Cloud Profile reference once published
