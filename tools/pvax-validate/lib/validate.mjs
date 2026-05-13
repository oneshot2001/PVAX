import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = resolve(__dirname, "../../../schema/pvax.schema.json");

let cachedValidator = null;

async function getValidator() {
  if (cachedValidator) return cachedValidator;
  const schema = JSON.parse(await readFile(SCHEMA_PATH, "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats.default ? addFormats.default(ajv) : addFormats(ajv);
  cachedValidator = ajv.compile(schema);
  return cachedValidator;
}

function collectCrossRefIssues(doc) {
  const issues = [];
  const findingIds = new Set((doc.findings ?? []).map((f) => f.id));
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
  const crossRefErrors = schemaOk ? collectCrossRefIssues(doc) : [];
  return {
    valid: schemaOk && crossRefErrors.length === 0,
    schemaErrors,
    crossRefErrors,
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
    };
  }
  return validatePvax(doc);
}
