# Contributing to PVAX

PVAX is an open standard for physical vulnerability assessments. The schema, methodology, and vocabulary are CC0 (public domain). Reference tools are MIT.

## What we want

- **Citation corrections** — found a source URL that's wrong, outdated, or has a better primary equivalent? Open an issue or PR with the source.
- **Methodology corrections** — terminology errors, framework misapplication, missing canonical practice. Cite the authoritative source in the issue.
- **State grant verification** — re-verify any of the 15 entries in `appendices/state-grants.md` against current state agency primary sources, especially the four marked MEDIUM (NC, AZ, CO, IL).
- **Vertical addenda** — site-type-specific addenda (cannabis, marina, equine, healthcare, RTCC, body-worn camera, etc.) using primary sources only.
- **New threat scenarios, finding categories, control types** — additions to the controlled vocabulary, sourced to a recognized framework or primary document.
- **Schema improvements** — clarify field semantics, fix validation gaps, propose new optional fields.
- **Real assessment feedback** — what broke when you tried to use PVAX in a real walk? That's the most valuable input.

## What we don't want

- **Vendor placement** — a request to elevate a specific manufacturer, SKU, or vendor inside the schema or methodology.
- **Feature creep without grounding** — adding fields that don't map to a primary-source authority or a real assessment workflow.
- **Closing the schema** — anything that gates schema use behind a license, signup, or proprietary tooling.

## Source-hierarchy rules (required for any factual claim)

1. **Federal primary** — FEMA, DHS, Grants.gov, SAM.gov, DOJ, COPS, BJA, OJP, Congress.gov, GovInfo, eCFR, FAR, GSA, OMB, CISA, NIST, FCC, NTIA.
2. **State primary** — state education / emergency-management agencies, governor budget offices, state legislatures, state grant portals, state administrative codes.
3. **Recognized standards bodies and national associations** — NIST, NFPA, UL, ASTM, ASIS, IACP, PERF, CALEA, FBI CJIS, AWWA, SAE, etc.
4. **Secondary sources** — only when a primary source does not exist, and only with explicit labeling.

For every cited claim, include:
- Source title and publishing agency
- Direct URL (PDF URL with page number when applicable)
- Exact quote supporting the claim
- Publication date / effective date / retrieval date
- Verification label: `Verified` / `Partially correct` / `Unverifiable from primary sources`

## Versioning

PVAX uses semantic versioning. Breaking schema changes bump the minor version (0.x → 0.y) until v1.0; after v1.0 they bump the major. Methodology revisions that change recommended practice are called out in `CHANGELOG.md` and appendices.

## Conflict-of-interest disclosure

If you have a commercial relationship with any vendor whose products may appear in PVAX recommendations, disclose it on the PR or issue. PVAX is vendor-neutral by construction; transparency is the mechanism.

## License

By submitting a contribution, you agree that:
- Schema, methodology, vocabulary, and appendix content is released under [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) (public domain).
- Reference tool code is released under [MIT](./LICENSE-MIT.txt).

## Maintainer

PVAX is currently maintained by Matthew Visher. Conflicts of interest are disclosed in [`distribution-and-pricing.md`](./distribution-and-pricing.md).
