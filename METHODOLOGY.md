# PVAX Methodology — Vendor-Neutral Physical Vulnerability Assessment

> Version **0.2** (citation audit applied 2026-05-03)
> Encoded into the [`controls.framework_basis`](./SPEC.md) field of every PVAX file
> Authored from 20+ years of operational law-enforcement experience and multi-agency federal task force work
> See [CHANGELOG.md](./CHANGELOG.md) for v0.1 → v0.2 changes

---

## Why methodology matters more than schema

A schema without a methodology is vendor-capture theater waiting to happen. Anyone can fill in JSON fields. The reason a PVAX assessment carries weight in front of a FEMA NSGP reviewer or a school board is that it follows a defensible, named, repeatable methodology — not because it's machine-readable.

This document is what every assessor working in PVAX is committing to apply.

## The four layers of an assessment

A PVAX assessment evaluates a facility through four nested lenses, in this order:

```
1. Site / environment    →  CPTED
2. Zones / layered defense →  Deter / Detect / Delay / Respond (4D)
3. Asset criticality     →  CARVER scoring
4. Threat scenarios      →  Active shooter timeline + insider + external + cyber-physical
```

A finding lives in at least one layer. A control addresses findings across one or more layers. The methodology produces the recommendation; the recommendation is recorded in `controls[].framework_basis` so any reviewer can audit the chain of reasoning.

---

## Layer 1 — CPTED (site / environment)

**Crime Prevention Through Environmental Design** is the foundation. It evaluates how the physical site itself either invites or discourages threat behavior.

The four CPTED principles, applied to every facility:

### Natural surveillance
Can legitimate users see what's happening on and around the site? Are sight lines from inside to entries clear? Is exterior lighting adequate? Are landscaping and signage placed so an attacker can't approach unseen?

**Common findings:** parked vehicles obstructing front-entry sight lines; arrival/dismissal staff inside an interior office with no exterior view; broken or sodium-vapor exterior lighting that fails facial recognition for video.

### Natural access control
Are the paths into the facility shaped to direct legitimate users to controlled entries and discourage unauthorized routes? Are perimeter barriers (fencing, bollards, landscaping) in the right places?

**Common findings:** secondary doors propped during arrival hours for staff convenience; rear loading-dock area that connects to interior corridors without intermediate access control; service paths that bypass primary entry.

### Territorial reinforcement
Does the facility's appearance signal that it is owned, monitored, and cared for? Are signage, paint, landscaping, and maintenance condition consistent with active management?

**Common findings:** missing or faded signage; graffiti visible from public street; unmaintained fencing; dumpster areas without territorial markers.

### Maintenance and Management
Is the facility maintained well enough that broken security elements (lights, locks, cameras, doors) are repaired promptly? Broken windows theory operates here. The full CPTED principle is "Maintenance and Management" per the U.S. CPTED Association and DCSE; PVAX abbreviates "Maintenance" in some references for brevity.

**Common findings:** door closer not adjusted (door fails to fully latch); failed exterior light not replaced for >30 days; camera lens covered with cobwebs.

CPTED findings carry `cpted_principle` in their `[`finding`](./SPEC.md#7-findings--array-must--at-least-one) record.

> Note: PVAX v0.1 uses first-generation CPTED (physical-design principles). Second-generation CPTED — community cohesion, social capital, connectivity — is on the v0.2+ roadmap as a separate social-resilience module when sourced from a recognized CPTED authority.

---

## Layer 2 — Layered Defense (PVAX 4D adaptation)

PVAX adapts security-in-depth into a four-function model. The full canonical security-in-depth taxonomy from the DoD Center for Development of Security Excellence (CDSE) lists **Deter, Detect, Delay, Document, Defend/Deny**. PVAX simplifies this for assessment purposes into the four functions below; this is a PVAX adaptation, not industry-canonical terminology:

| Function | Asks |
|---|---|
| **Deter** | Does the zone visibly discourage an attacker before they commit? |
| **Detect** | Will an attempted breach be detected, by whom, in what time? |
| **Delay** | How long does the breach take after detection, and is delay sufficient for response? |
| **Respond** | What is the response, by whom, and how does it integrate with detection? |

PVAX defines a working set of assessment zones; this is a PVAX adaptation, not industry-canonical terminology. The minimum zone set is:

```
Perimeter         → site boundary (fence, parking, exterior approach)
Exterior envelope → walls, doors, windows, roof
Interior          → corridors, rooms, common areas
Asset             → high-value targets (server rooms, vaults, classrooms with kids)
```

Additional zones may be defined per facility — examples include cyber/control room, parking/approach, public lobby, restricted operations, and critical utilities. For each zone, the assessor walks the four functions systematically. A finding may name the zone where the gap exists; a control names the zone it strengthens.

**The math that matters: response timeline.**

A control's value is the difference between the time-to-impact (how fast an attacker can reach the asset given current detection + delay) and the response time (how fast a meaningful response arrives). When time-to-impact < response time, the asset is undefended regardless of how many controls exist.

PVAX's `findings[].active_shooter_timeline_seconds.current` and `controls[].expected_outcome` make this math explicit and auditable. A control that doesn't change the math is a control that doesn't earn the line item.

---

## Layer 3 — CARVER (asset criticality)

CARVER is a six-factor scoring model originally from special-operations target analysis, adapted to physical security risk:

| Factor | Asks |
|---|---|
| **Criticality** | What's the impact if this asset is lost or compromised? |
| **Accessibility** | How easily can an attacker reach it? |
| **Recoverability / Recuperability** | How fast can the facility recover after an event? (FDA's CARVER + Shock Primer uses *Recuperability*; NIST-hosted facility-protection sources use *Recoverability* — terminology varies by source.) |
| **Vulnerability** | How easily is the asset compromised once accessed? |
| **Effect** | What ripple effect does compromising this asset have on operations? |
| **Recognizability** | How easily does an attacker identify this asset as a target? |

PVAX uses a 1–5 scoring scale per factor (24-point composite). Note: the original CARVER + Shock methodology published by FDA uses a 1–10 scale and ranks assets by relative score rather than fixed thresholds. **PVAX's high-criticality threshold is a PVAX-defined working convention** that must be calibrated per facility type, asset class, and documented risk tolerance — it is not a federal standard.

CARVER is a recognized structured vulnerability-prioritization method used in federal contexts (originally a DOD targeting tool, adapted by FDA for food-defense work, and referenced in DHS facility assessments). PVAX records CARVER scoring per finding in `findings[].severity.score` when the chosen scale is `carver`.

**Sources:** [FDA CARVER + Shock Primer](https://www.fda.gov/food/food-defense-initiatives/carver-shock-primer), DHS/OIG CARVER references on GovInfo, U.S. CPTED Association.

---

## Layer 4 — Threat Scenarios

A finding has no meaning without a threat. PVAX requires every finding to name at least one threat scenario it applies to (`findings[].applicable_threats`).

The reference threat scenarios for v0.1 (controlled vocabulary):

- **active_shooter_external** — armed assailant enters from outside, lawful or by force
- **active_shooter_internal** — armed individual already inside (student, staff, parent, employee)
- **insider_unauthorized_access** — credentialed individual accesses areas outside their authority
- **after_hours_burglary** — entry during unoccupied period for theft
- **vehicle_borne_threat** — vehicle ramming, vehicle-borne IED (rare but high-consequence)
- **swatting_or_diversion** — false report drawing response away from real threat
- **cyber_physical_compromise** — IT-side compromise leading to physical access (door unlock via VMS exploit, etc.)
- **insider_threat_intelligence** — staff member harvesting information for external coordination
- **medical_emergency_disguised_threat** — fire, gas, medical pretext for facility entry
- **civil_disturbance_spillover** — protest, riot, or civil unrest reaching the facility

Each scenario carries a frequency and consequence class to support risk prioritization.

### Active-shooter timeline analysis

PVAX documents how proposed controls affect the active-shooter response timeline using **site-measured variables**, not fixed published seconds. Some grant programs require or favor evidence-based safety assessments and security improvements; PVAX timeline analysis exists to make a control's operational effect concrete and auditable, not to recite a universal benchmark.

The PVAX timeline variables are:

| Variable | Definition |
|---|---|
| `detection_latency` | Time from threat-action onset to first reliable detection (audio, video, panic alert, witness report) |
| `notification_latency` | Time from detection to dispatch and to building-level alert/lockdown trigger |
| `lockdown_latency` | Time from lockdown trigger to substantial lockdown completion (corridors clear, doors locked, accountability check started) |
| `breach_delay` | Time the attacker is delayed by physical and procedural barriers between threat onset and contact with people/assets |
| `responder_travel_time` | Time from dispatch to first armed responder on scene (varies by jurisdiction; pull from local CAD/dispatch data) |
| `contact_intervention_time` | Time from first responder on scene to substantive intervention with the threat |

Each variable is **populated locally** from dispatch data, drill records, engineering analysis, vendor test reports, or facility testing. **Do not use illustrative values from PVAX documentation as design assumptions.** The FBI publishes Active Shooter Incidents annual reports and a 20-year review covering 2000–2019; those describe incident statistics, not universal second-by-second response times applicable to any specific facility.

Every control that targets an active-shooter scenario MUST identify which variable(s) it changes and the **measured or test-derived** evidence supporting the change. Examples of how to express this:

- "Adds a vestibule with verified visitor management" → reduces threat-onset-to-corridor entry by [X seconds] based on [door rating + drill measurement]
- "Adds gunshot detection" → reduces `detection_latency` from [current measurement] to [vendor-tested + integration-verified value], with documented false-positive/false-negative handling
- "Adds classroom strike-resistant doors meeting [ANSI/UL/ASTM rated assembly]" → extends `breach_delay` per rated assembly data and forced-entry test results

Vendor performance claims must be backed by documentation; PVAX outcomes (`outcomes`) ultimately track whether the control performed as designed in actual conditions.

**Sources:** [FBI Active Shooter Incidents 2024 Report](https://www.fbi.gov/news/press-releases/fbi-releases-2024-active-shooter-incidents-in-the-united-states-report); [FBI Active Shooter Incidents 20-Year Review 2000–2019](https://www.fbi.gov/file-repository/reports-and-publications/active-shooter-incidents-20-year-review-2000-2019-060121.pdf/view).

### Cyber-physical convergence

[NIST SP 800-82 Rev. 3](https://csrc.nist.gov/pubs/sp/800/82/r3/final), published **September 2023**, expands NIST's industrial control systems (ICS) guidance to operational technology (OT) more broadly, including systems that "interact with the physical environment" such as physical access control systems and building automation systems. NIST CSF 2.0 (the [Cybersecurity Framework](https://www.nist.gov/cyberframework)) provides the governance baseline for cyber risk; [SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) provides physical and environmental protection (PE) controls that map directly to PVAX assessments. SP 800-171 Rev. 3 applies when the assessment data includes Controlled Unclassified Information (CUI) or federal contract data.

PVAX requires assessors to consider — at minimum — these cyber-physical patterns (these are PVAX-defined examples, not enumerated specifically by NIST SP 800-82):

- VMS / access control admin compromise (cyber → physical)
- IoT camera exploitation (Mirai-class) (cyber → physical observation)
- Networked door hardware (Wiegand replay / OSDP misconfig) (cyber → physical entry)
- Insider digital exfiltration (physical access → cyber compromise)

For law-enforcement, RTCC, ALPR, body-worn camera, or CAD/RMS-integrated environments, the **[FBI CJIS Security Policy](https://le.fbi.gov/file-repository/cjis_security_policy_v6-0_20241227.pdf) (v6.0, December 2024)** is mandatory wherever Criminal Justice Information (CJI) is processed, stored, or transmitted.

A finding with cyber-physical implications carries `findings[].cyber_physical_dependency` populated.

---

## Common finding categories (operational checklist)

These are the patterns that appear in 80% of K-12, house of worship, and nonprofit assessments:

1. **Visitor management gap at primary entrance** — open during arrival hours, no vestibule, no ID verification
2. **Door hardware failures** — closers misadjusted, latches not throwing, electric strikes wired fail-safe instead of fail-secure (or vice versa)
3. **Sight-line obstruction** — landscaping, vehicles, signage blocking surveillance from staffed positions
4. **Single point of failure** — one person (greeter, receptionist, deacon) who is the entire detection layer
5. **Lighting after dark** — exterior lighting fails documented observation, recognition, or identification objectives under site-specific conditions; dark zones at side and rear
6. **Communication gaps** — staff have no panic-alert mechanism or it requires dialing a number that takes 30+ seconds
7. **Lockdown drill cadence** — no drills, drills only with advance notice, drills that don't include alternative-route scenarios
8. **Camera coverage gaps** — corners, side doors, exterior approach, interior choke points missing or covered by camera systems with documented coverage, resolution, cybersecurity, lifecycle-support, retention, interoperability, or federal-funding-compliance gaps
9. **Access control posture** — perimeter doors propped, interior doors that should restrict access during incidents are unlocked
10. **Cyber-physical** — remote administrative access to VMS or access control lacks documented encryption, MFA, segmentation, least privilege, logging, monitoring, and approved secure-access architecture; default credentials still in place

Each finding is named, located, evidenced (photo/video), and tied to a CPTED principle, a layered-defense zone, and a threat scenario. That four-way grounding is the difference between a defensible assessment and 40 pages of consultant fluff.

---

## What this methodology refuses to do

- **No SKU recommendations in controls.** `controls[]` shall state performance outcomes, risk reduction, interoperability, lifecycle, and compliance requirements. Concrete products live in `quotes[]` only. Equivalent alternatives must remain acceptable unless a justified sole-source determination applies. This aligns with [2 CFR Part 200 procurement standards](https://www.ecfr.gov/current/title-2/subtitle-A/chapter-II/part-200/subpart-D/subject-group-ECFR45ddd4419ad436d), which require federally funded procurement to use full and open competition with documented "rationale for the method of procurement."
- **No architecture preference.** PVAX does not prefer manufacturer ecosystem, cloud-only, on-prem-only, hybrid, proprietary, or open-platform architectures. Architecture selection must be justified by requirements, risk, staffing, lifecycle, privacy, procurement, and interoperability. Cloud, hybrid, and on-prem options shall be evaluated against the same control objectives: availability, latency, cybersecurity, retention, access logging, CJIS / FERPA / contract obligations, continuity, and total cost of ownership.
- **No composite score.** PVAX does not produce a single composite "security score" out of context. Composite scores invite gaming. The findings, controls, and timeline math speak for themselves.
- **No assumption that a quoted control will be installed.** Outcomes are tracked in `outcomes` separately. A great assessment paired with no implementation is still a failure.
- **No skipping cheap or politically inconvenient controls.** Door-closer adjustments, lockdown drill cadence, and staff training are first-class controls — not afterthoughts.
- **No hidden vendor stack.** If the assessor has a commercial relationship that would influence recommendations, the file is flagged via `coi_disclosed`. Per 2 CFR Part 200's "written standards of conduct covering conflicts of interest," `coi_disclosed` must identify the relationship, affected control categories, mitigation steps, and whether equivalent alternative architectures were considered.
- **No analytics without privacy and civil-rights review.** Analytics (object detection, behavioral analytics, face recognition, license-plate recognition, etc.) shall be recommended only when the operational need, legal authority, privacy impact, accessibility impact, retention rules, audit logs, and human-review workflow are documented. For schools, [FERPA](https://studentprivacy.ed.gov/faq/faqs-photos-and-videos-under-ferpa) applies when video is "directly related to a student" and "maintained by an educational agency." For public entities, [ADA Title II / 28 CFR Part 35](https://www.ecfr.gov/current/title-28/chapter-I/part-35) applies to "all services, programs, and activities." Where Criminal Justice Information is processed, [FBI CJIS Security Policy](https://le.fbi.gov/file-repository/cjis_security_policy_v6-0_20241227.pdf) is mandatory.

This is the methodology layer. It is what PVAX is. The schema is the format that carries it.
