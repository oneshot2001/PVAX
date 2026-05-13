import { test } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { validatePvaxFile } from "../lib/validate.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = (name) => resolve(__dirname, "../fixtures", name);

test("valid v0.3 example passes", async () => {
  const result = await validatePvaxFile(fixture("valid.pvax.json"));
  assert.equal(result.valid, true, JSON.stringify(result, null, 2));
  assert.equal(result.schemaErrors.length, 0);
  assert.equal(result.crossRefErrors.length, 0);
});

test("broken-schema fixture fails with JSON Pointer path", async () => {
  const result = await validatePvaxFile(fixture("broken-schema.pvax.json"));
  assert.equal(result.valid, false);
  assert.ok(result.schemaErrors.length > 0, "expected schema errors");
  const ctrlErr = result.schemaErrors.find((e) => e.path.startsWith("/controls/0"));
  assert.ok(ctrlErr, `expected error pointing at /controls/0, got: ${JSON.stringify(result.schemaErrors)}`);
  assert.match(ctrlErr.message, /control_type/);
});

test("broken-xref fixture fails at addresses_findings element", async () => {
  const result = await validatePvaxFile(fixture("broken-xref.pvax.json"));
  assert.equal(result.valid, false);
  assert.equal(result.schemaErrors.length, 0, "schema should still pass");
  assert.equal(result.crossRefErrors.length, 1);
  assert.equal(result.crossRefErrors[0].path, "/controls/0/addresses_findings/0");
  assert.match(result.crossRefErrors[0].message, /F-999/);
});
