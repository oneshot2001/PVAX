# PVAX — Physical Vulnerability Assessment Exchange

**A signed, portable file format for physical security vulnerability assessments and the controls that close them.**

[![Latest release](https://img.shields.io/github/v/release/oneshot2001/PVAX?include_prereleases&label=release&color=0a3d62)](https://github.com/oneshot2001/PVAX/releases)
[![Schema](https://img.shields.io/badge/schema-JSON%20Schema%202020--12-0a3d62)](./schema/pvax.schema.json)
[![Validate](https://github.com/oneshot2001/PVAX/actions/workflows/validate.yml/badge.svg)](https://github.com/oneshot2001/PVAX/actions/workflows/validate.yml)
[![Schema license: CC0-1.0](https://img.shields.io/badge/schema-CC0--1.0-lightgrey)](./LICENSE-CC0.txt)
[![Tools license: MIT](https://img.shields.io/badge/tools-MIT-blue)](./LICENSE-MIT.txt)
[![NIST CSF 2.0](https://img.shields.io/badge/aligned-NIST%20CSF%202.0-2f6f4f)](https://www.nist.gov/cyberframework)
[![FEMA NSGP / DOJ SVPP](https://img.shields.io/badge/grants-FEMA%20NSGP%20%7C%20DOJ%20SVPP-7a2e2e)](#why-now)

> Version **0.3.0** — formal JSON Schema + 15-state grant appendix (2026-05-04).
> Schema and methodology under [CC0 1.0](./LICENSE-CC0.txt) (public domain). Reference tools under [MIT](./LICENSE-MIT.txt).
> See [CHANGELOG.md](./CHANGELOG.md) for full version history.

---

## Contents

- [What this is](#what-this-is)
- [Why now](#why-now)
- [Quick start](#quick-start) — validate a `.pvax` file in 30 seconds
- [Non-goals](#non-goals-read-this-first)
- [The vendor-neutrality manifesto](#the-vendor-neutrality-manifesto)
- [Who pays for what](#who-pays-for-what)
- [What this repository contains](#what-this-repository-contains)
- [Federal-funding compliance terminology](#federal-funding-compliance-terminology-read-this-if-you-cite-pvax-in-grant-work)
- [Status & roadmap](#status--roadmap)
- [Contributing](./CONTRIBUTING.md) · [Code of Conduct](./CODE_OF_CONDUCT.md) · [Security](./.github/SECURITY.md) · [Cite this work](./CITATION.cff)

---

## What this is

A `.pvax` file is one signed, portable bundle that captures a complete physical security hardening transaction:

```
vulnerability  →  selected control  →  quoted cost  →  installed proof  →  test result  →  attestation
```

It's the missing common object for the workflow that today produces a $10,000 consultant PDF, an Excel BOM, a folder of phone photos, a scattered set of installer notes, and a grant application that has to be rebuilt every cycle.

PVAX bundles all of that into one machine-readable, cryptographically signed file that:

- Districts, nonprofits, and houses of worship can attach to **FEMA NSGP** and **DOJ COPS SVPP** grant applications
- Insurers and brokers can ingest for **underwriting credits** and renewals
- Integrators can produce as a **closeout deliverable** alongside their work
- Auditors and AHJs can verify **without consulting the integrator who installed it**

## Why now

Three forcing functions converging in 2026:

1. **Federal money tied to documentation.**
   - **FEMA NSGP FY2025** — the [Fiscal Year 2025 Nonprofit Security Grant Program NOFO](https://files.simpler.grants.gov/opportunities/8d1e3e07-24bf-480b-a9ff-694fdf38f052/attachments/a4ae774b-c1ef-4f5e-bb98-7b4d3d7aca24/FY_2025_NSGP_NOFO_07-28-2025_508.pdf) lists expected total funding of **$274,500,000**, split equally between **NSGP-UA ($137.25M)** and **NSGP-S ($137.25M)**. Assistance Listing 97.008; opportunity DHS-25-GPD-008-00-99. State Administrative Agencies apply to FEMA; nonprofit organizations are subapplicants. *No FY2026 NSGP allocation was verified from federal primary sources as of May 3, 2026.*
   - **DOJ COPS SVPP FY2025** — the [FY2025 SVPP solicitation](https://cops.usdoj.gov/pdf/2025ProgramDocs/svpp/nofo.pdf) stated **up to $73,000,000** was available; the [FY2025 award list](https://cops.usdoj.gov/pdf/2025AwardDocs/svpp/award_list.pdf) reports **211 awards totaling $74,785,459**. Maximum federal share is $500,000 over 36 months with a 25% local cash match. Assistance Listing 16.071; opportunity O-COPS-2025-172379. SVPP does not fund SRO positions. *This is not a standing annual allocation — figures track a specific FY solicitation cycle.*

   Both programs require credible vulnerability assessments to justify hardening. Today's applications are written from scratch every cycle.

2. **CISA SSAT already emits JSON.** The federal government's own [K-12 School Security Assessment Tool](https://www.cisa.gov/resources-tools/programs/school-safety-and-security/k-12-school-security-assessment-tool-ssat) supports machine-readable export. PVAX extends an existing federally-recognized primitive — it does not invent one from scratch.

3. **NIST has converged cyber and physical guidance.** [NIST SP 800-82 Rev. 3](https://csrc.nist.gov/pubs/sp/800/82/r3/final), published **September 2023**, expands ICS guidance to operational technology — including systems that interact with the physical environment such as physical access control systems and building automation systems. PVAX uses [NIST CSF 2.0 Core](https://www.nist.gov/cyberframework) as its governance baseline and [NIST SP 800-53 Rev. 5](https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final) Physical and Environmental Protection (PE) controls as its physical-security control taxonomy. NIST SP 800-171 Rev. 3 applies when CUI or federal contract data is in scope. Federal alignment, day one.

## Quick start

Validate the worked example against the schema in 30 seconds — no clone required:

```bash
# Fetch the schema and the worked elementary-school example
curl -sLO https://raw.githubusercontent.com/oneshot2001/PVAX/main/schema/pvax.schema.json
curl -sLO https://raw.githubusercontent.com/oneshot2001/PVAX/main/examples/elementary-school.pvax.json

# Validate
npx -y ajv-cli@5 validate \
  --spec=draft2020 --strict=false \
  -c ajv-formats \
  -s pvax.schema.json \
  -d elementary-school.pvax.json
# → elementary-school.pvax.json valid
```

Or clone and run the full repo-local check:

```bash
git clone https://github.com/oneshot2001/PVAX.git
cd PVAX
npx -y ajv-cli@5 validate \
  --spec=draft2020 --strict=false \
  -c ajv-formats \
  -s schema/pvax.schema.json \
  -d 'examples/*.pvax.json'
```

Every push to `main` and every pull request runs the same two commands in CI — see the **Validate** badge above.

## Non-goals (read this first)

PVAX is **not**:

- A vendor catalog or product recommendation engine
- A front-end that funnels users to specific camera, access control, or alarm brands
- A replacement for licensed physical security consultants
- A scoring rubric designed to make grant writers feel productive
- A tool that monetizes referral fees or "preferred partner" placements

Every one of those failure modes turns this into vendor-capture theater. If PVAX becomes that, it's worthless and someone else will build the real thing.

## The vendor-neutrality manifesto

These rules are non-negotiable for any tool that calls itself a PVAX implementation:

1. **Schema is public domain.** Anyone can implement it. No license, no royalty, no signup.
2. **Reference tools are open source under MIT.** The code that produces and validates `.pvax` files is auditable.
3. **Recommendations are method-driven, not vendor-driven.** A control recommendation comes from the methodology (CPTED, layered defense, CARVER scoring, NIST CSF mapping), not a SKU catalog.
4. **No referral economics.** No vendor pays for placement. No "premium tier" that changes recommendations.
5. **Conflicts of interest are disclosed inside the file.** If the assessor sells products that show up in the recommended controls, the assessment is signed with a `coi_disclosed` flag and the conflict is named.
6. **Vendor data flows in from open sources or user-supplied input.** Manufacturer specs, prices, and compatibility data are looked up at the user's request. PVAX itself stores no marketing language.
7. **Outcomes are tracked, not adoption.** The product's success metric is grants won and incidents avoided, not assessments completed.

If you fork PVAX and break these rules, you are publishing a different format. Don't call it PVAX.

## Who pays for what

| User | Cost | What they get |
|---|---|---|
| Independent assessor (small consultant, retired LE, volunteer) | Free | Mobile site-walk app, schema validator, PDF/JSON exports |
| Integrator firm | $299/mo per seat | Branded closeout deliverable, multi-project portfolio, customer-portal share-links |
| District / nonprofit / multi-site enterprise | $999/mo per organization | Grant-portfolio tracker, renewal calendar, peer-benchmark anonymized analytics, audit binder export |
| Insurer / MGA / broker | Per-program licensing | Underwriting feed, premium-credit certification API, claims-defensibility evidence |

The free tier exists to make sure the schema survives. The paid tiers exist on top of it without contaminating it.

## What this repository contains

- [`schema/pvax.schema.json`](./schema/pvax.schema.json) — **the formal JSON Schema 2020-12 definition.** This is what `pvax-validate` checks against. Validates the example file cleanly.
- [`SPEC.md`](./SPEC.md) — the schema as human-readable prose. Field-by-field. Extends CISA SSAT JSON, references NIST CSF 2.0 Core controls, supports C2PA-signed media.
- [`METHODOLOGY.md`](./METHODOLOGY.md) — the assessment framework. CPTED + PVAX layered defense (4D) + CARVER + active-shooter timeline variables + cyber-physical convergence. Vendor-neutral by construction.
- [`appendices/state-grants.md`](./appendices/state-grants.md) — 15-state school safety grant programs with primary-source URLs and verification confidence flags.
- [`examples/elementary-school.pvax.json`](./examples/elementary-school.pvax.json) — a worked K-12 assessment that validates against the schema.
- [`tools/pvax-validate/`](./tools/pvax-validate/) — reference CLI validator (Node + ajv, MIT). Checks JSON Schema conformance + `addresses_findings` cross-references. Exit codes `0`/`1`. Three acceptance fixtures.
- [`distribution-and-pricing.md`](./distribution-and-pricing.md) — go-to-market notes (where the buyers actually are; not on X).
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — how to contribute, source-hierarchy rules, vendor-neutrality requirements.
- [`CHANGELOG.md`](./CHANGELOG.md) — full version history.

## Federal-funding compliance terminology (read this if you cite PVAX in grant work)

PVAX uses **precise** federal-funding compliance terminology rather than informal industry shorthand. Specifically:

- **"Section 889"** refers to Section 889 of the FY2019 NDAA (Public Law 115-232), which combined with implementing regulations creates federal-award and procurement restrictions on covered telecommunications and video-surveillance equipment. The controlling instruments are:
  - [2 CFR §200.216](https://www.ecfr.gov/current/title-2/subtitle-A/chapter-II/part-200/subpart-C/section-200.216) — federal grant prohibition on obligating or expending funds for covered equipment
  - [FAR 52.204-24](https://www.acquisition.gov/far/52.204-24), [52.204-25](https://www.acquisition.gov/far/52.204-25), [52.204-26](https://www.acquisition.gov/far/52.204-26) — federal-contractor representations and prohibitions
  - [FCC Covered List](https://docs.fcc.gov/public/attachments/DA-21-309A1.pdf) — authoritative list of covered equipment/services, [updated periodically](https://docs.fcc.gov/public/attachments/DA-26-278A1.pdf)
- **PVAX does NOT use "non-NDAA" as a compliance term** — it is informal shorthand. PVAX uses "covered telecommunications or video-surveillance equipment under Section 889 / FAR / 2 CFR §200.216 / FCC Covered List restrictions" instead.
- **The [FCC Secure and Trusted Communications Networks Reimbursement Program](https://docs.fcc.gov/public/attachments/DA-25-741A2.pdf)** ("rip-and-replace") is a **separate, narrow program** for eligible advanced communications providers with 10 million or fewer customers. It is not a general school, nonprofit, or public-safety equipment-replacement grant. Do not conflate the two.
- **2 CFR §200.313** governs equipment management, inventory, and disposition for federally funded equipment (cameras, access control, radios, panic-alert systems, servers).

## Status & roadmap

**Current:** `v0.3.0` — first public draft for community review. The schema validates the worked example cleanly, the methodology is citation-audited, and 15 state grant programs are mapped to primary sources.

**Pre-1.0 — schema, methodology, and manifesto remain subject to revision based on:**

- Real assessments performed against the spec (the only test that matters)
- FEMA NSGP / DOJ COPS SVPP application reviewer feedback
- ASIS Physical Asset Protection Standard (2026) alignment work
- ONVIF / C2PA media-provenance integration (waiting on stable interfaces)

**v0.4 candidates:** controlled vocabulary files in `vocabulary/` (today inlined as enums); vertical addenda for cannabis, marina, equine, RTCC, and BWC; all-50-states grant coverage; tribal nation school-safety programs; `pvax-validate` Node CLI; `pvax-builder` mobile-first PWA; C2PA-signed `.pvax` envelope.

**How to engage:**

- 📐 [Propose a schema change](https://github.com/oneshot2001/PVAX/issues/new?template=schema-proposal.yml) ·
  🧭 [Methodology feedback](https://github.com/oneshot2001/PVAX/issues/new?template=methodology-feedback.yml) ·
  ⚖️ [Vendor-neutrality concern](https://github.com/oneshot2001/PVAX/issues/new?template=vendor-neutrality-concern.yml) ·
  🐛 [Bug report](https://github.com/oneshot2001/PVAX/issues/new?template=bug-report.yml)
- 💬 [Discussions](https://github.com/oneshot2001/PVAX/discussions) for open-ended questions and "is this in scope?" debates
- 🔐 Security findings — see [SECURITY.md](./.github/SECURITY.md) (private email, not public issues)

## Maintainer note

PVAX is maintained as an independent open standard. The reference tools (`pvax-builder`, `pvax-validate`) are operated by Matthew Visher. Conflicts of interest related to other physical security products are disclosed in [`distribution-and-pricing.md`](./distribution-and-pricing.md). PVAX recommendations do not flow through any vendor channel partnership.
