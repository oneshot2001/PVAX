<!-- Thanks for contributing to PVAX. Fill in the sections that apply. -->

## What this PR changes

<!-- One or two sentences. -->

## Type of change

<!-- Tick all that apply. -->

- [ ] Schema (`schema/pvax.schema.json`)
- [ ] Methodology (`METHODOLOGY.md`)
- [ ] Spec prose (`SPEC.md`)
- [ ] Worked example (`examples/`)
- [ ] State / federal appendix
- [ ] Reference tool (`pvax-validate`, `pvax-builder`)
- [ ] Documentation only
- [ ] CI / repo plumbing

## Motivation

<!-- Why is this change needed? Cite a real assessment, a grant program, a NIST publication, or a community discussion. -->

## Vendor-neutrality check

- [ ] This PR does not introduce or imply a specific vendor, product, or SKU
- [ ] If it does mention a vendor, the mention is method-driven (e.g., a worked example referencing a real device for clarity) and explained below

<!-- If you ticked the second box, explain. -->

## Source citations

<!-- For methodology / spec / appendix changes: list primary sources (NIST, FEMA, DOJ, NFPA, statute, peer-reviewed). Industry blogs and vendor whitepapers are not primary sources. -->

## Validation

- [ ] Schema validates with `ajv` (`npx ajv-cli validate -s schema/pvax.schema.json -d 'examples/*.pvax.json' --spec=draft2020`)
- [ ] No primary sources newer than the citations referenced
- [ ] CHANGELOG.md updated under the "Unreleased" section

## Backward compatibility

<!-- For schema changes: do existing v0.3.0 .pvax files still validate? Migration path? -->
