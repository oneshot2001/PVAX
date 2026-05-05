# Security Policy

PVAX is an open standard for physical vulnerability assessments. This document covers security concerns specific to (a) the schema and methodology and (b) reference tools published from this repository.

## What counts as a security issue here

- A flaw in `schema/pvax.schema.json` that lets a malformed or misleading `.pvax` file pass validation in a way that could be used to misrepresent a hardening transaction (vulnerability → control → quote → installed evidence → test → attestation).
- A signature or attestation gap in the spec that would let a third party tamper with a `.pvax` file or its referenced media without detection.
- A reference-tool vulnerability (`pvax-validate`, `pvax-builder`, future official tooling) — for example, schema injection, supply-chain risk, or sandbox escape during validation of a hostile file.
- A privacy issue in worked examples or reference output (PII leakage, location data, photo metadata) that escapes redaction by default.

Out of scope:

- Disagreements about methodology or control selection (open an issue using the **Methodology feedback** template instead).
- Vendor-neutrality concerns (use the **Vendor-neutrality concern** template).
- Whether a *specific* assessment performed by a third party is correct — PVAX defines the format, not the work product.

## How to report

Email **mkvisher@gmail.com** with subject line **`[PVAX SECURITY]`** and a clear description of the issue, reproduction steps, and (if applicable) a sample malformed `.pvax` file.

Please do **not** open a public GitHub issue for security findings.

You will receive an acknowledgement within 5 business days. Once a fix or mitigation is identified, we will coordinate a disclosure timeline with you. Credit is given by name unless you prefer otherwise.

## Supported versions

Until v1.0.0, only the latest minor release receives security fixes. After v1.0.0, the latest two minor releases will be supported.

| Version | Supported |
|---------|-----------|
| 0.3.x   | ✅ |
| < 0.3   | ❌ |
