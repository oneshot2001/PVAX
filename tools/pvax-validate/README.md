# pvax-validate

Reference CLI validator for [PVAX](https://github.com/oneshot2001/PVAX) (Physical Vulnerability Assessment Exchange) files.

MIT-licensed. Method-driven. Vendor-neutral. The same rules the open standard claims, enforced as code.

## What it checks

1. **JSON Schema 2020-12 conformance** against `schema/pvax.schema.json` via [ajv](https://ajv.js.org/). Reports violations with [JSON Pointer](https://datatracker.ietf.org/doc/html/rfc6901) paths.
2. **Cross-references resolve.** Every `Control.addresses_findings[]` entry must match an existing `Finding.id`. Additional reference checks (`Quote.control_id`, `Evidence.describes_*`, `Finding.evidence_refs`) are planned for v0.2.

Exit codes: `0` = valid, `1` = invalid, `2` = bad usage.

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

Runs three acceptance fixtures (see `fixtures/`):

| Fixture | Expected |
|---|---|
| `valid.pvax.json` (copy of `examples/elementary-school.pvax.json`) | exit `0` |
| `broken-schema.pvax.json` (missing required `control_type`) | exit `1`, error path `/controls/0` |
| `broken-xref.pvax.json` (`addresses_findings: ["F-999"]`) | exit `1`, error path `/controls/0/addresses_findings/0` |

## Scope (v0.1)

Smallest-useful validator. No signature verification (waits on v0.4 C2PA envelope), no vocabulary checks (waits on `vocabulary/` split), no completeness scoring. The three checks above are the bar.

## License

MIT. See `LICENSE-MIT.txt` at the repo root.
