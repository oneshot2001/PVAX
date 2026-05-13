import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI = resolve(__dirname, "../bin/pvax-validate.mjs");
const fixture = (name) => resolve(__dirname, "../fixtures", name);

function run(args) {
  return spawnSync(process.execPath, [CLI, ...args], { encoding: "utf8" });
}

test("CLI exits 0 with PASS on valid fixture", () => {
  const r = run([fixture("valid.pvax.json")]);
  assert.equal(r.status, 0, `stderr: ${r.stderr}`);
  assert.match(r.stdout, /^PASS  /);
  assert.equal(r.stderr, "");
});

test("CLI exits 1 with schema-prefixed errors on broken-schema", () => {
  const r = run([fixture("broken-schema.pvax.json")]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /^FAIL  /m);
  assert.match(r.stderr, /  schema   \/controls\/0/);
});

test("CLI exits 1 with xref-prefixed errors on broken-xref", () => {
  const r = run([fixture("broken-xref.pvax.json")]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /  xref     \/controls\/0\/addresses_findings\/0/);
  assert.match(r.stderr, /F-999/);
});

test("CLI exits 1 with vendor-prefixed errors on broken-vendor", () => {
  const r = run([fixture("broken-vendor.pvax.json")]);
  assert.equal(r.status, 1);
  assert.match(r.stderr, /  vendor   \/controls\/0\/recommended_vendor/);
  assert.match(r.stderr, /  vendor   \/quotes\/0\/line_items\/0\/referral_kickback_pct/);
});

test("CLI exits 2 on missing file (read error, no Node stack)", () => {
  const r = run(["/tmp/pvax-validate-does-not-exist.pvax.json"]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /^FAIL  /m);
  assert.match(r.stderr, /  read error: ENOENT/);
  assert.doesNotMatch(r.stderr, /at async/, "should not leak a Node stack trace");
});

test("CLI exits 2 on missing argument with usage line", () => {
  const r = run([]);
  assert.equal(r.status, 2);
  assert.match(r.stderr, /^usage: pvax-validate/);
});
