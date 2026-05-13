#!/usr/bin/env node
// Copies the canonical PVAX schema into the package before `npm pack` so the
// published tarball is self-contained. Monorepo dev keeps reading the same
// file at ../../schema/pvax.schema.json.
import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const src = resolve(__dirname, "../../../schema/pvax.schema.json");
const destDir = resolve(__dirname, "../schema");
const dest = resolve(destDir, "pvax.schema.json");

await mkdir(destDir, { recursive: true });
await copyFile(src, dest);
console.log(`copied ${src} -> ${dest}`);
