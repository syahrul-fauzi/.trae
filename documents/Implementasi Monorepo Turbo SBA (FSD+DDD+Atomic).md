## Tujuan & Hasil

* Membangun monorepo Turbo untuk SBA yang terstruktur, scalable, dan mudah dikembangkan.

* Menerapkan FSD untuk pemisahan fitur, DDD untuk domain inti, dan Atomic Design untuk UI.

* Menyediakan artefak lengkap: arsitektur, API/kontrak, panduan kontribusi, test plan, contoh fitur, dan konfigurasi TurboRepo.

## Sumber & Konsolidasi Referensi

* Gabungkan konten dari: `Perencanaan Proyek — SBA.md`, `PLAN & RANCANGAN Monorepo — SBA.md`, `Use-Case & Ide SaaS untuk SBA.md`, `Rencana & Rancangan Lengkap — Monorepo Turbo untuk SBA.md`.

* Sinkronkan istilah, struktur, dan keputusan; hilangkan duplikasi; tandai perbedaan sebagai ADR (Architecture Decision Record).

* Tambahkan riset best practices terbaru TurboRepo, FSD, DDD, Atomic, CI/CD, dan dokumentasi.

## Analisis Repo Saat Ini (Ringkas)

* Monorepo menggunakan pnpm + Turbo; workspace `apps/*` dan `packages/*`.

* Apps: Next.js (web/marketing), Vite (docs), NestJS (api), orchestrator agentic.

* Packages: `ui` (komponen, pola Atomic), `utils`, `analytics`, `kv`.

* Kesenjangan: konsistensi package manager (bun vs pnpm), pipeline lint/type-check bergantung build, belum ada remote caching, standar skrip belum seragam, dokumentasi menyebut `packages/cms` namun tidak ada.

## Arsitektur Sistem

### FSD (Feature-Sliced Design)

* Lapisan: `app` (routing/entry), `processes` (alur lintas fitur), `pages`, `widgets`, `features`, `entities`, `shared`.

* Prinsip: public API per slice, dependensi satu arah (shared→entities→features→widgets→pages→app).

### DDD (Domain-Driven Design)

* Batas konteks: `Tenant`, `Workspace`, `User`, `Agent Run`, `Orchestration`.

* Layer: `domain` (entities, value objects, aggregates, domain services, events), `application` (use-cases, DTO, orchestrators), `infrastructure` (repos/adapters, DB, cache, message bus), `interfaces` (HTTP controllers, GraphQL resolvers).

### Hybrid FSD/DDD

* `entities` FSD berkorespondensi dengan `domain` DDD.

* `features` membungkus `application` use-cases.

* `shared` menyimpan utilitas, adapters generik, design tokens.

### Atomic Design (UI)

* Lapisan: `atoms`, `molecules`, `organisms`, `templates`, `pages`.

* Design tokens: warna, tipografi, spasi, elevasi, radius; basis CSS variables dan tema.

* Dokumentasikan pola interaksi (loading, error, empty, skeleton) dan aksesibilitas (ARIA, fokus, warna kontras).

## Struktur Folder

### Kode Monorepo

* `apps/`

  * `web` (Next.js, FSD + Atomic)

  * `marketing` (Next.js, FSD ringan)

  * `api` (NestJS, DDD)

  * `docs` (Vite/React, dokumentasi interaktif/Storybook-Ladle)

  * `orchestrator` (runtime/agentic, integrasi queue/cache)

* `packages/`

  * `ui` (`src/{atoms,molecules,organisms,templates}`)

  * `utils` (`src/{lib,validation,format}`)

  * `analytics` (`src`, exporters)

  * `kv` (abstraksi storage/redis/edge)

  * (opsional) `cms` (BaseHub)

* `tooling/` (konfigurasi lint, tsconfig, commitlint, changesets)

### Dokumentasi di `.trae/documents/Smart Business Assistant`

* `/core` — model domain, diagram konteks, ADR.

* `/features` — spesifikasi fitur (FSD) dan public API per slice.

* `/shared` — design tokens, komponen umum, utils, guideline aksesibilitas.

* `/apps` — arsitektur tiap app, konfigurasi, dependensi.

* `/docs` — panduan kontribusi, test plan, API spec, diagram alur data.

## Konvensi Kode & Dependency

* TypeScript 5.x, strict mode; `tsconfig.base.json` di root yang di-extend seluruh workspace.

* ESLint + Prettier tersentralisasi; aturan FSD (import boundaries) dan DDD (layering) dengan lint rules.

* Commitlint + conventional commits; Changesets untuk versioning/publish.

* Penamaan: kebab-case untuk folder, camelCase untuk variabel, PascalCase untuk komponen.

## Konfigurasi TurboRepo (Direkomendasikan)

* `pnpm-workspace.yaml`:

  * `packages: ["apps/*", "packages/*"]`

* `turbo.json`:

  * `globalDependencies: ["pnpm-lock.yaml"]`

  * `pipeline`:

    * `build`: `dependsOn: ["^build"]`, `outputs: ["dist/**", ".next/**"]`

    * `lint`: `cache: true`

    * `type-check`: `cache: true`, `outputs: ["tsc/**"]`

    * `test`: `dependsOn: ["^build"]`, `outputs: ["coverage/**"]`

    * `dev`: `cache: false`, `persistent: true`

* Script root `package.json`: `turbo run {build|dev|lint|test|type-check|clean}`.

* Remote caching: aktifkan Turbo remote cache/Cloud untuk CI.

## API & Kontrak Antar-Modul

* Standar HTTP/REST + OpenAPI (Swagger di `api`).

* Kontrak antar fitur via `domain events` (pub/sub) dan typed DTO; gunakan `zod` untuk runtime validation.

* Contract testing (Pact) antara `apps/web` dan `apps/api` pada use-case utama.

## UI/UX Requirements

* Konsistensi dengan design system dan tokens; tema light/dark.

* Prototipe interaktif via Storybook/Ladle + Playwright visual regression untuk komponen kritikal.

* Dokumentasi pola interaksi: form, tabel, pagination, skeleton, toast.

* Responsif untuk mobile/tablet/desktop; pikirkan aksesibilitas (keyboard, screen reader).

## CI/CD Pipeline

* GitHub Actions (atau setara):

  * Jobs: `lint`, `type-check`, `build`, `test`, `e2e`, `publish`.

  * Gunakan `turbo cache` dan artefak coverage.

  * Preview deployment untuk `apps/web/marketing/docs`.

* Konfigurasi env aman; batasi invalidasi cache pada perubahan env yang relevan.

## Dokumentasi Otomatis

* Typedoc untuk packages TS; Storybook/Ladle docs untuk UI.

* Swagger/OpenAPI generator untuk `api`; Redoc untuk konsumsi.

* ADR untuk keputusan arsitektur; changelog via Changesets.

## Test Plan & Kriteria Penerimaan

* Unit (vitest), integration (API + DB), e2e (Playwright/Cypress).

* KPI: performa build, TTI halaman utama, error rate orchestrator, coverage >80%.

* Kriteria: skenario utama berfungsi (login, workspace, run orchestration), bebas regresi, aksesibilitas dasar terpenuhi.

## Contoh Fitur Kunci (Referensi Implementasi)

* `Workspace & Tenant` (DDD: aggregates, repos; FSD: entities/features/widgets; UI: organisms/templates).

* `Agent Orchestration` (application use-cases, queue adapter, status UI dengan streaming updates).

* Sertakan contoh minimal: struktur folder, public API per slice, use-case, test.

## Rollout & Komunikasi (Best Practices)

* Komunikasikan rencana ke seluruh tim; sediakan dokumen relevan dan pelatihan.

* Jadwalkan implementasi bertahap, lakukan evaluasi berkala, sesuaikan strategi.

* Berdayakan tim melalui guideline dan tooling konsisten; gunakan KPI untuk pengukuran.

## Artefak Deliverables

* Tulis `daftar deliverables artefak.md` berisi:

  * Diagram alur data & dependensi modul.

  * Spesifikasi API & kontrak antar-modul.

  * Panduan pengembangan & kontribusi.

  * Test plan & kriteria penerimaan.

  * Link ke prototipe UI/Storybook.

## Langkah Implementasi

* Konsolidasi referensi, susun dokumen arsitektur final.

* Standarisasi tooling (pnpm, tsconfig, eslint, prettier, changesets).

* Terapkan konfigurasi Turbo yang diusulkan, aktifkan remote cache.

* Susun struktur FSD/DDD/Atomic di apps/packages; buat contoh fitur kunci.

* Bangun sistem dokumentasi otomatis dan CI/CD.

* Finalisasi `daftar deliverables artefak.md` dan audit keterlacakan artefak ke implementasi.

