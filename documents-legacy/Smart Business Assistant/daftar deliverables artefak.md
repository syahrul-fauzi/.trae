Daftar Deliverables Artefak — SBA

Diagram & Pemetaan
- Diagram Alur Data: `docs/diagrams/alur-data.mmd`
- Context Map (DDD): `docs/diagrams/context-map.mmd`
- Komponen Sistem: `docs/diagrams/components.mmd`
- Sequence Utama: `docs/diagrams/sequence/*.mmd`

Spesifikasi API & Kontrak
- OpenAPI: `docs/api-openapi.yaml` (Tools: Knowledge, Render, Task)
- Kontrak Zod: `packages/sdk/contracts/*.ts`
- Pact/contract tests: `packages/sdk/contracts/__tests__/*`

Panduan Pengembangan & Kontribusi
- Coding Conventions: `docs/coding-conventions.md`
- FSD Rules & Import Policy: `docs/fsd-boundaries.md`
- DDD Model Docs: `docs/ddd-models.md`
- Contribution Guide: `CONTRIBUTING.md`
- ADR Index: `ADR-INDEX.md`

Test Plan & Kriteria Penerimaan
- Test Plan: `docs/test-plan.md`
- Kriteria Penerimaan MVP:
  - E2E: user → agent → BaseHub streaming jawaban.
  - RLS: isolasi data tenant tervalidasi.
  - Observability: tracing & metrics tersedia.
  - Coverage paket inti ≥ 80%.

Kode Boilerplate
- Monorepo Skeleton: `apps/*`, `packages/*` (lihat dokumen PLAN).
- Template FSD Feature: `apps/web/src/features/<feature>/{model,ui,api}`.
- Generator SDK: `pnpm --filter packages/sdk gen`.

Konfigurasi TurboRepo (Optimal)
- Lihat `docs/turbo-config.md` dan file root `turbo.json`.
- Aktifkan remote cache untuk CI.

CI/CD & Dokumentasi Otomatis
- Workflows: lint, type-check, test, build, preview-deploy, release.
- Dokumentasi otomatis: Typedoc (packages), Storybook (UI), OpenAPI (API).
