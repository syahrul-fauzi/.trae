# Daftar Deliverables Artefak — Monorepo Turbo SBA

## Diagram & Pemetaan
- Diagram Alur Data: `docs/diagrams/alur-data.mmd`
- Context Map (DDD): `docs/diagrams/context-map.mmd`
- Komponen Sistem: `docs/diagrams/components.mmd`
- Sequence Utama: `docs/diagrams/sequence/*.mmd`

## Spesifikasi Arsitektur & Aliran Data
- Diagram konteks sistem, arsitektur logis, dan deployment
- Peta dependensi modul dan boundary FSD/DDD
- Sequence fitur kritis (Chat, Event Stream, Auth)

## Spesifikasi API & Kontrak
- OpenAPI: `api-openapi.yaml` (Tools: Knowledge, Render, Task)
- Kontrak Zod: `packages/sdk/contracts/*.ts`
- Pact/contract tests: `packages/sdk/contracts/__tests__/*`
 - SDK usage examples: `Smart Business Assistant/docs/sdk-usage-examples.md`

## Panduan Pengembangan & Kontribusi
- Coding Conventions: `Smart Business Assistant/docs/coding-conventions.md`
- FSD Rules & Import Policy: `Smart Business Assistant/docs/fsd-boundaries.md`
- DDD Model Docs: `Smart Business Assistant/docs/ddd-models.md`
- Contribution Guide: `Smart Business Assistant/CONTRIBUTING.md`
- ADR Index: `Smart Business Assistant/ADR-INDEX.md`

## Rencana Tes & Kriteria Penerimaan (Lengkap)
- Rencana unit, a11y, e2e, performance
- Daftar test kasus utama dan hasil yang diharapkan
- Kriteria penerimaan per fitur (chat, event stream, onboarding)

## Test Plan & Kriteria Penerimaan
- Test Plan: `Smart Business Assistant/test-plan.md`
- Kriteria Penerimaan MVP:
  - E2E: user → agent → BaseHub streaming jawaban.
  - RLS: isolasi data tenant tervalidasi.
  - Observability: tracing & metrics tersedia.
  - Coverage paket inti ≥ 80%.

## Kode Boilerplate
- Monorepo Skeleton: `apps/*`, `packages/*` (lihat arsitektur di dokumen PLAN).
- Template FSD Feature: `apps/web/src/features/<feature>/{model,ui,api}`.
- Generator SDK: `pnpm --filter packages/sdk gen`.
 - Boilerplate ringkas: `Smart Business Assistant/docs/boilerplate.md`

## Konfigurasi TurboRepo (Optimal)
- Lihat cuplikan `turbo.json` dan `pnpm-workspace.yaml` di dokumen PLAN.
- Aktifkan remote cache untuk CI.

## CI/CD & Staging
- Workflow CI utama dan docs-ci
- Rencana staging, canary, dan rollback
- Checklist pre-release dan observability

## CI/CD & Dokumentasi Otomatis
- Workflows: lint, type-check, test, build, preview-deploy, release.
- Dokumentasi otomatis: Typedoc (packages), Storybook (UI), OpenAPI (API).
 - Contoh CI: lihat `Smart Business Assistant/docs/ci-cd.md`

## Dokumentasi Pengguna & Developer
- Panduan pengguna fitur chat dan dashboard
- Dokumentasi teknis arsitektur dan modul
- Referensi API dan contoh penggunaan

## Tautan Utama
- `.trae/documents/PLAN & RANCANGAN Monorepo Turbo untuk SBA (FSD + DDD + Atomic).md`
- `.trae/documents/Perencanaan Proyek — SBA (Smart Business Assistant).md`
- `.trae/documents/PLAN & RANCANGAN Monorepo — SBA (Smart Business Assistant).md`
- `.trae/documents/Use-Case & Ide SaaS untuk Smart Business Assistant (SBA).md`
- `.trae/documents/Rencana & Rancangan Lengkap — Monorepo Turbo untuk SBA (Smart Business Assistant).md`
 - `.trae/documents/Smart Business Assistant/daftar deliverables artefak.md`
