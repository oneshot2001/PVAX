#!/usr/bin/env node
import { validatePvaxFile } from "../lib/validate.mjs";

const [, , file] = process.argv;
if (!file) {
  console.error("usage: pvax-validate <file.pvax.json>");
  process.exit(2);
}

let result;
try {
  result = await validatePvaxFile(file);
} catch (err) {
  console.error(`FAIL  ${file}`);
  console.error(`  read error: ${err.message}`);
  process.exit(2);
}

if (result.valid) {
  console.log(`PASS  ${file}`);
  process.exit(0);
}

console.error(`FAIL  ${file}`);
for (const err of result.schemaErrors) {
  console.error(`  schema   ${err.path}  ${err.message}`);
}
for (const err of result.crossRefErrors) {
  console.error(`  xref     ${err.path}  ${err.message}`);
}
for (const err of result.vendorErrors ?? []) {
  console.error(`  vendor   ${err.path}  ${err.message}`);
}
process.exit(1);
