import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const __dirname = dirname(fileURLToPath(import.meta.url));
// Bundled-in-package path used after `npm pack` / install from registry.
const BUNDLED_SCHEMA_PATH = resolve(__dirname, "../schema/pvax.schema.json");
// Monorepo dev path — canonical source of truth checked into the PVAX repo.
const MONOREPO_SCHEMA_PATH = resolve(__dirname, "../../../schema/pvax.schema.json");
const SCHEMA_PATH = existsSync(BUNDLED_SCHEMA_PATH) ? BUNDLED_SCHEMA_PATH : MONOREPO_SCHEMA_PATH;

let cachedValidator = null;

async function getValidator() {
  if (cachedValidator) return cachedValidator;
  const schema = JSON.parse(await readFile(SCHEMA_PATH, "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: true, allowUnionTypes: true });
  addFormats.default ? addFormats.default(ajv) : addFormats(ajv);
  cachedValidator = ajv.compile(schema);
  return cachedValidator;
}

// PVAX vendor-neutrality manifesto rule #3: recommendations are method-driven,
// not vendor-driven. Brands and SKUs belong in quotes[].line_items, never in
// controls[]. These allowlists enforce that at the structural level.
const CONTROL_ALLOWED_FIELDS = new Set([
  "id",
  "addresses_findings",
  "control_type",
  "title",
  "description",
  "framework_basis",
  "expected_outcome",
  "alternatives",
  "vendor_neutral_specification",
  "estimated_cost_range_usd",
  "labor_hours_estimate",
  "lead_time_weeks",
]);

const QUOTE_LINE_ITEM_ALLOWED_FIELDS = new Set([
  "description",
  "manufacturer",
  "model",
  "qty",
  "unit_cost",
  "extended",
]);

function collectDuplicateIdIssues(doc) {
  const issues = [];
  for (const arrayName of ["findings", "controls", "quotes", "evidence", "tests", "attestations"]) {
    const seen = new Map();
    for (const [i, item] of (doc[arrayName] ?? []).entries()) {
      const id = item?.id;
      if (typeof id !== "string") continue;
      if (seen.has(id)) {
        issues.push({
          path: `/${arrayName}/${i}/id`,
          message: `duplicate id "${id}" — first seen at /${arrayName}/${seen.get(id)}/id`,
          value: id,
        });
      } else {
        seen.set(id, i);
      }
    }
  }
  return issues;
}

function collectCrossRefIssues(doc) {
  const issues = [];
  const findingIds = new Set((doc.findings ?? []).map((f) => f.id));
  const controlIds = new Set((doc.controls ?? []).map((c) => c.id));
  const evidenceIds = new Set((doc.evidence ?? []).map((e) => e.id));

  for (const [i, control] of (doc.controls ?? []).entries()) {
    for (const [j, fid] of (control.addresses_findings ?? []).entries()) {
      if (!findingIds.has(fid)) {
        issues.push({
          path: `/controls/${i}/addresses_findings/${j}`,
          message: `references unknown finding "${fid}"`,
          value: fid,
        });
      }
    }
  }

  for (const [i, quote] of (doc.quotes ?? []).entries()) {
    if (quote?.control_id !== undefined && !controlIds.has(quote.control_id)) {
      issues.push({
        path: `/quotes/${i}/control_id`,
        message: `references unknown control "${quote.control_id}"`,
        value: quote.control_id,
      });
    }
  }

  for (const [i, finding] of (doc.findings ?? []).entries()) {
    for (const [j, eid] of (finding.evidence_refs ?? []).entries()) {
      if (!evidenceIds.has(eid)) {
        issues.push({
          path: `/findings/${i}/evidence_refs/${j}`,
          message: `references unknown evidence "${eid}"`,
          value: eid,
        });
      }
    }
  }

  const testIds = new Set((doc.tests ?? []).map((t) => t.id));
  for (const [i, evidence] of (doc.evidence ?? []).entries()) {
    for (const [j, fid] of (evidence.describes_findings ?? []).entries()) {
      if (!findingIds.has(fid)) {
        issues.push({
          path: `/evidence/${i}/describes_findings/${j}`,
          message: `references unknown finding "${fid}"`,
          value: fid,
        });
      }
    }
    for (const [j, cid] of (evidence.describes_controls ?? []).entries()) {
      if (!controlIds.has(cid)) {
        issues.push({
          path: `/evidence/${i}/describes_controls/${j}`,
          message: `references unknown control "${cid}"`,
          value: cid,
        });
      }
    }
    for (const [j, tid] of (evidence.describes_tests ?? []).entries()) {
      if (!testIds.has(tid)) {
        issues.push({
          path: `/evidence/${i}/describes_tests/${j}`,
          message: `references unknown test "${tid}"`,
          value: tid,
        });
      }
    }
  }

  return issues;
}

function collectVendorNeutralityIssues(doc) {
  const issues = [];
  for (const [i, control] of (doc.controls ?? []).entries()) {
    if (!control || typeof control !== "object") continue;
    for (const key of Object.keys(control)) {
      if (!CONTROL_ALLOWED_FIELDS.has(key)) {
        issues.push({
          path: `/controls/${i}/${key}`,
          message: `unknown field "${key}" on Control — vendor-bias fields must live in quotes[].line_items, not controls[]`,
          value: control[key],
        });
      }
    }
  }
  for (const [i, quote] of (doc.quotes ?? []).entries()) {
    if (!quote || typeof quote !== "object") continue;
    for (const [j, item] of (quote.line_items ?? []).entries()) {
      if (!item || typeof item !== "object") continue;
      for (const key of Object.keys(item)) {
        if (!QUOTE_LINE_ITEM_ALLOWED_FIELDS.has(key)) {
          issues.push({
            path: `/quotes/${i}/line_items/${j}/${key}`,
            message: `unknown field "${key}" on Quote line item`,
            value: item[key],
          });
        }
      }
    }
  }
  return issues;
}

export async function validatePvax(doc) {
  const validate = await getValidator();
  const schemaOk = validate(doc);
  const schemaErrors = schemaOk
    ? []
    : validate.errors.map((e) => ({
        path: e.instancePath || "/",
        message: `${e.message}${e.params ? ` (${JSON.stringify(e.params)})` : ""}`,
      }));
  const crossRefErrors = schemaOk
    ? [...collectDuplicateIdIssues(doc), ...collectCrossRefIssues(doc)]
    : [];
  const vendorErrors = schemaOk ? collectVendorNeutralityIssues(doc) : [];
  return {
    valid: schemaOk && crossRefErrors.length === 0 && vendorErrors.length === 0,
    schemaErrors,
    crossRefErrors,
    vendorErrors,
  };
}

export async function validatePvaxFile(path) {
  const text = await readFile(path, "utf8");
  let doc;
  try {
    doc = JSON.parse(text);
  } catch (err) {
    return {
      valid: false,
      schemaErrors: [{ path: "/", message: `invalid JSON: ${err.message}` }],
      crossRefErrors: [],
      vendorErrors: [],
    };
  }
  return validatePvax(doc);
}
