# PVAX — Distribution and Pricing

> Internal go-to-market notes
> Audience: maintainers, early-stage decision-makers
> Status: draft

---

## Where the buyers are

The audience for PVAX is **not** on X. Grok-driven X searches across @IPVMinfo, @SIA_Online, @SchoolSafetygv, @COPSOffice, @FEMA_NPD, @axiscomms, @genetec, @verkada, @brivo (and similar) returned **zero substantive posts** about NSGP / SVPP / vulnerability assessments in any 14-day window we tested. The discourse on these topics happens in:

- **LinkedIn** — long-form posts and articles from district safety directors, ASIS members, ex-LE consultants, and integrator firm principals. This is where credibility is built and where 1:1 introductions get made.
- **ASIS chapter meetings** — local chapter monthly meetings are the room where district facilities directors, security consultants, and integrator estimators all stand together holding bad coffee. Speaking slot at a chapter meeting beats 30 cold emails.
- **IPVM forum** — opinionated, technical, integrator-heavy. Influence here happens by writing thoughtful posts, not by selling.
- **CISA and DHS partner mailing lists** — niche, slow, but the people who matter are on them.
- **Closed Slack and email groups** — school safety directors, cannabis compliance officers, cyber-physical security working groups. Accessible by referral only.
- **Conference presence**:
  - **ISC West (March/April, Las Vegas)** — the big annual show; 2026 added a "Digital Trust & Identity Zone" that signals where the industry is moving.
  - **GSX (September, varies by city)** — ASIS-run, more end-user-heavy than ISC West. Better for PVAX because end-users are the demand side.
  - **National Conference on School Discipline / state-level safety conferences** — direct access to district safety committees.

## Distribution sequence (first 90 days)

1. **Publish PVAX schema and methodology on GitHub** under `oneshot2001/pvax-spec`. Public domain (CC0). Include a clear "what this is, what it isn't" README. Schema-first establishes credibility and protects against vendor capture.
2. **Write 3 LinkedIn long-form posts**:
   - "Why most school security assessments don't survive FEMA review (and what mine does instead)"
   - "Vendor-neutral physical vulnerability assessment: an open standard"
   - "What 20 years on the streets taught me about hardening soft targets"
   - Each post links to GitHub. Each post is by-line + short bio (ex-UPD sergeant, multi-agency federal task force, current Director of LE Business Development at Alpha Vision — disclosed). Conflicts disclosed up front.
3. **Reach out to 5 district safety directors** in Utah and adjacent states, offering a free pilot assessment in exchange for use of the (anonymized) PVAX file as a public reference example.
4. **Post on IPVM forum** in the standards / policy section — same content as LinkedIn, less marketing, more technical.
5. **Submit a talk proposal** to next ASIS chapter meeting in Salt Lake City and to GSX 2026 / 2027 (lead time matters; GSX deadlines close ~6 months out).

## Pricing

### Free tier — independent assessor

| What | Cost |
|---|---|
| `pvax-builder` mobile + web app | $0 |
| Schema validator | $0 |
| Single-facility assessment, single-export | $0 |
| Community vocabulary updates | $0 |

The free tier exists to ensure the schema survives. It is fully usable for solo consultants, retired LE doing volunteer work, or volunteer safety committee members at houses of worship. Any "premium" gating that prevents a synagogue from completing an assessment for FEMA NSGP is a betrayal of the project.

### Integrator tier — $299/seat/month

For integrator firms producing assessments as part of their commercial offering.

| Feature | Notes |
|---|---|
| Branded PDF/JSON closeout export | Firm logo, cover page, customer-ready |
| Multi-project portfolio | View all active assessments |
| Customer-portal share-links | Customer reads online, no PDF email chain |
| Bulk attestation signing | Sign multiple PVAX files in one workflow |
| Cross-project vocabulary management | Shared finding/control templates within firm |
| Conflict-of-interest disclosure | Firm-level COI (e.g., "we resell Axis and Hanwha") auto-attached to every file |

Integrator tier is the most likely first revenue line.

### Owner tier (district / nonprofit / multi-site enterprise) — $999/org/month

For school districts, nonprofit organizations, healthcare systems, multi-site retailers.

| Feature | Notes |
|---|---|
| Grant-portfolio tracker | All active applications by program (NSGP, SVPP, state) with deadlines |
| Renewal calendar | Insurance renewals, re-assessment cadences (typically 3-year) |
| Anonymized peer benchmarks | "Districts your size spent X% of grant on visitor management vs. cameras" |
| Audit binder export | One-click compliance packet for AHJ, board, insurer, accreditation review |
| Multi-facility roll-up | District-wide view across all schools |
| Outcomes tracking | Did the controls funded actually reduce incident counts? |

### Insurer / MGA / broker — per-program licensing

For commercial property / liability insurers, MGAs, and brokers that want to ingest PVAX files for underwriting.

| Feature | Pricing |
|---|---|
| Underwriting feed (API) | Tiered by volume of insured locations |
| Premium-credit certification API | Per-policy fee |
| Claims-defensibility evidence export | Per-claim fee |
| Anonymized loss-correlation analytics | Annual subscription (six figures) |

This tier is the highest-margin tail but takes 12–24 months of relationship-building to crack. Don't optimize for it on day one. Build it on top of established district + integrator usage so insurers ingest a populated dataset, not a vaporware pitch.

## Anti-patterns to avoid

1. **Don't charge the assessor** — the people producing the data are the most valuable users. Make them the most loyal.
2. **Don't gate the schema** — if the JSON requires a license, somebody else will publish a clone in a week.
3. **Don't sell to vendors** — "preferred manufacturer" deals destroy credibility instantly. The economic answer to "Axis offers $X to be the recommended camera in PVAX" is "no, in any amount."
4. **Don't bundle with hardware sales** — PVAX is software, methodology, and a community. Bundling with cameras is precisely the vendor-capture mode that justifies skepticism. Keep these separate even when the same person owns both.
5. **Don't replicate D-Tools / Jetbuilt** — those are estimation tools for integrators. PVAX is an assessment-and-outcome tool that crosses the integrator/owner/insurer/grantor boundary. Different product. Different sales motion.
6. **Don't skip outcomes tracking** — the temptation to declare success at "assessment delivered" is huge. Every revenue tier MUST report outcomes back into the file. The outcomes corpus is the moat.

## Conflicts of interest — disclosed

Matthew Visher is the maintainer of PVAX and the operator of the reference tooling (`pvax-builder`, `pvax-validate`).

He is also:
- **Director of Law Enforcement Business Development at Alpha Vision** — an Axis Communications technology partner. Alpha Vision is a vendor in the physical security space.
- **Independent developer** of multiple physical security tools (AxisX, Vigil, EdgeProof, PlateProof, others).

PVAX schema, methodology, vocabulary files, and recommendations **are explicitly insulated from these commercial relationships**:

- PVAX recommendations come from the methodology in `METHODOLOGY.md`, not from any vendor relationship.
- AxisX, NERVE, and SDD content do not appear in PVAX core schema or vocabulary.
- When a PVAX assessment results in a quote that includes products from Alpha Vision / Axis-related lines, the COI is auto-attached at the file level and made visible to every reader.
- PVAX revenue does not flow through any vendor channel partnership.

If you discover a violation of these commitments, file a public issue against the GitHub repo. The point of disclosure is accountability.

## Success metrics

The right metrics for PVAX-the-product are not "users" or "MRR" alone. The right metrics are:

| Metric | Why |
|---|---|
| Grant dollars won by PVAX users | Direct outcome attribution |
| Reduction in physical security incidents at facilities with PVAX-tracked implementations | The reason the work matters |
| Number of districts / nonprofits using `.pvax` files in actual federal grant applications | Schema adoption |
| Number of insurers ingesting PVAX files for underwriting | Tail-revenue progress |
| Number of independent assessors using the free tier | Schema durability |
| Reviewer comments from FEMA / DOJ on PVAX-attached applications | Methodology validation |

Internal MRR metrics matter for runway. External outcome metrics matter for legitimacy. Track both, optimize for the second.
