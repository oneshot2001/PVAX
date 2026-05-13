import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { validatePvax, validatePvaxFile } from "../lib/validate.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixture = (name) => resolve(__dirname, "../fixtures", name);

async function loadValid() {
  return JSON.parse(await readFile(fixture("valid.pvax.json"), "utf8"));
}

test("valid v0.3 example passes", async () => {
  const result = await validatePvaxFile(fixture("valid.pvax.json"));
  assert.equal(result.valid, true, JSON.stringify(result, null, 2));
  assert.equal(result.schemaErrors.length, 0);
  assert.equal(result.crossRefErrors.length, 0);
  assert.equal(result.vendorErrors.length, 0);
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

test("broken-vendor fixture rejects vendor-bias fields on Control + line_item", async () => {
  const result = await validatePvaxFile(fixture("broken-vendor.pvax.json"));
  assert.equal(result.valid, false);
  assert.equal(result.schemaErrors.length, 0, "vendor fixture should pass schema layer");
  assert.ok(result.vendorErrors.length >= 3, `expected >=3 vendor errors, got ${result.vendorErrors.length}`);

  const recommendedVendor = result.vendorErrors.find((e) => e.path === "/controls/0/recommended_vendor");
  assert.ok(recommendedVendor, "expected recommended_vendor flagged");
  assert.match(recommendedVendor.message, /vendor-bias/);

  const controlModel = result.vendorErrors.find((e) => e.path === "/controls/0/model");
  assert.ok(controlModel, "expected model on Control flagged");

  const lineItemKickback = result.vendorErrors.find(
    (e) => e.path === "/quotes/0/line_items/0/referral_kickback_pct",
  );
  assert.ok(lineItemKickback, "expected referral_kickback_pct on line_item flagged");
});

test("quote.control_id cross-ref is checked", async () => {
  const doc = await loadValid();
  doc.quotes[0].control_id = "C-999";
  const result = await validatePvax(doc);
  assert.equal(result.valid, false);
  const err = result.crossRefErrors.find((e) => e.path === "/quotes/0/control_id");
  assert.ok(err, `expected /quotes/0/control_id error, got: ${JSON.stringify(result.crossRefErrors)}`);
  assert.match(err.message, /C-999/);
});

test("finding.evidence_refs cross-ref is checked", async () => {
  const doc = await loadValid();
  doc.findings[0].evidence_refs = ["E-999"];
  const result = await validatePvax(doc);
  assert.equal(result.valid, false);
  const err = result.crossRefErrors.find((e) => e.path === "/findings/0/evidence_refs/0");
  assert.ok(err, JSON.stringify(result.crossRefErrors));
  assert.match(err.message, /E-999/);
});

test("evidence.describes_findings cross-ref is checked", async () => {
  const doc = await loadValid();
  doc.evidence[0].describes_findings = ["F-999"];
  const result = await validatePvax(doc);
  assert.equal(result.valid, false);
  const err = result.crossRefErrors.find((e) => e.path === "/evidence/0/describes_findings/0");
  assert.ok(err, JSON.stringify(result.crossRefErrors));
  assert.match(err.message, /F-999/);
});

test("evidence.describes_controls cross-ref is checked", async () => {
  const doc = await loadValid();
  doc.evidence[0].describes_controls = ["C-999"];
  const result = await validatePvax(doc);
  assert.equal(result.valid, false);
  const err = result.crossRefErrors.find((e) => e.path === "/evidence/0/describes_controls/0");
  assert.ok(err, JSON.stringify(result.crossRefErrors));
  assert.match(err.message, /C-999/);
});

test("evidence.describes_tests cross-ref is checked", async () => {
  const doc = await loadValid();
  doc.evidence[0].describes_tests = ["T-999"];
  const result = await validatePvax(doc);
  assert.equal(result.valid, false);
  const err = result.crossRefErrors.find((e) => e.path === "/evidence/0/describes_tests/0");
  assert.ok(err, JSON.stringify(result.crossRefErrors));
  assert.match(err.message, /T-999/);
});

test("duplicate finding id is flagged", async () => {
  const doc = await loadValid();
  // Clone F-001 with a different title — Set-based dedup would have hidden this.
  doc.findings.push({ ...doc.findings[0], title: "Duplicate F-001 (should fail)" });
  const result = await validatePvax(doc);
  assert.equal(result.valid, false);
  const dup = result.crossRefErrors.find((e) => e.message.startsWith("duplicate id"));
  assert.ok(dup, `expected duplicate id error, got: ${JSON.stringify(result.crossRefErrors)}`);
  assert.match(dup.message, /F-001/);
  assert.match(dup.path, /\/findings\/\d+\/id/);
});

test("duplicate control id is flagged", async () => {
  const doc = await loadValid();
  doc.controls.push({ ...doc.controls[0], title: "Duplicate C-001" });
  const result = await validatePvax(doc);
  assert.equal(result.valid, false);
  const dup = result.crossRefErrors.find(
    (e) => e.message.startsWith("duplicate id") && e.value === "C-001",
  );
  assert.ok(dup, JSON.stringify(result.crossRefErrors));
});
