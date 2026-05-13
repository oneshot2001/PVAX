# pvax-validate

Reference CLI validator for [PVAX](https://github.com/oneshot2001/PVAX) (Physical Vulnerability Assessment Exchange) files.

MIT-licensed. Method-driven. Vendor-neutral. The same rules the open standard claims, enforced as code.

## What it checks

1. **JSON Schema 2020-12 conformance** against `schema/pvax.schema.json` via [ajv](https://ajv.js.org/) in strict mode. Reports violations with [JSON Pointer](https://datatracker.ietf.org/doc/html/rfc6901) paths.
2. **Cross-references resolve.** Every reference points at an existing entity, across six shapes:
   - `Control.addresses_findings[]` → `Finding.id`
   - `Quote.control_id` → `Control.id`
   - `Finding.evidence_refs[]` → `Evidence.id`
   - `Evidence.describes_findings[]` → `Finding.id`
   - `Evidence.describes_controls[]` → `Control.id`
   - `Evidence.describes_tests[]` → `Test.id`
3. **IDs are unique** within each collection (findings, controls, quotes, evidence, tests, attestations). Duplicates would silently corrupt cross-references.
4. **Vendor-neutrality at the structural level.** `controls[]` only allows method-driven fields; brand/SKU/kickback fields are rejected. They belong in `quotes[].line_items[]`, never in `controls[]`. Manifesto rule #3, enforced as code.

Exit codes: `0` = valid, `1` = invalid, `2` = bad usage / read error.

## Install

From the PVAX repo root:

```sh
cd tools/pvax-validate
npm install
```

Node 20+ required.

## Run

```sh
node bin/pvax-validate.mjs path/to/file.pvax.json
```

Or, after `npm link`:

```sh
pvax-validate path/to/file.pvax.json
```

## Test

```sh
npm test
```

Runs unit + CLI-contract tests. Fixtures live in `fixtures/`:

| Fixture | Expected |
|---|---|
| `valid.pvax.json` | exit `0`, `PASS` to stdout |
| `broken-schema.pvax.json` (missing required `control_type`) | exit `1`, `schema   /controls/0` |
| `broken-xref.pvax.json` (`addresses_findings: ["F-999"]`) | exit `1`, `xref     /controls/0/addresses_findings/0` |
| `broken-vendor.pvax.json` (`recommended_vendor: "Acme"` on a Control + `referral_kickback_pct` on a line item) | exit `1`, `vendor   /controls/0/recommended_vendor` and `vendor   /quotes/0/line_items/0/referral_kickback_pct` |
| Missing file argument | exit `2`, `FAIL  <file> / read error: ENOENT` |

CI additionally runs `npm run compile-schema` (strict-mode schema gate) and an `npm pack` smoke test that confirms `schema/pvax.schema.json` is bundled into the published tarball.

## Scope (v0.1)

Smallest-useful validator. No signature verification (waits on v0.4 C2PA envelope), no vocabulary checks (waits on `vocabulary/` split), no completeness scoring. The four checks above are the bar.

## License

MIT. See `LICENSE-MIT.txt` at the repo root.
