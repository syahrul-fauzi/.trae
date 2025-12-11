## Ringkasan Arsitektur & Pola
- Monorepo dengan frontends (`apps/app`, `apps/web`) dan backend (`apps/api`), paket bersama `@sba/*`.
- Pola komunikasi: HTTP + SSE/WS (streaming), Supabase (CRUD + Realtime).
- Referensi:
  - Ikhtisar: `README.md:5-13,20-25,55-63,68-76`.
  - Use‑case & arsitektur SaaS: `.trae/documents/Use-Case & Ide SaaS untuk Smart Business Assistant (SBA).md:280-309,321-343`.
  - OpenAPI: `apps/api/docs/openapi.yaml:1-233`.
  - SSE client: `apps/app/src/shared/api/sse.ts:64-156,356-434,497-571`.
  - HTTP client: `apps/app/src/shared/api/client.ts:20-27,116-154,228-234`.

## 1) Analisis & Diagram Dependensi
- Buat peta dependensi apps/* ↔ packages/* (Mermaid graph + matriks impor/ekspor).
- Identifikasi circular dependencies dan hotspot:
  - Konsumsi luas `@sba/ui` di frontends.
  - Potensi ketergantungan implisit `@sba/ui` → `@sba/shared` pada organisme (perlu verifikasi deklarasi deps).
- Deliverables:
  - `docs/architecture/dependencies.mmd` (graph)
  - `docs/architecture/dependencies.md` (analisis, rekomendasi mitigasi siklus)

## 2) Reorganisasi Folder `docs`
- Struktur baru (klasifikasi):
  - `docs/business/*` — visi/misi/value, use‑case, proses bisnis.
  - `docs/technical/*` — arsitektur, API refs, ADR, DB, security.
  - `docs/development/*` — setup, guidelines, testing strategy, CI/CD.
  - `docs/tests/*` — acceptance, perf, chaos.
  - `docs/references/*` — benchmark, best practices, RACI.
- Sistem versioning dokumentasi:
  - Header versi (SemVer), riwayat perubahan, penanggung jawab.
- Update `docs/README.md`:
  - Overview SBA‑Agentic (visi/misi/value proposition) — ringkas dari `.trae/documents/*`.
  - Arsitektur sistem + diagram komponen dan alur data.
  - Panduan setup end‑to‑end (dev→prod) termasuk env & tooling.
  - Fitur utama + use‑case diagram + business process flow.
  - Development guidelines: coding standards, testing strategy, branching & release.

## 3) Refactoring & Penguatan Dokumentasi
- Contoh kode ter‑kurasi:
  - Streaming: potongan SSE/WS dan penjelasan (rujuk `sse.ts`).
  - HTTP: retry/timeout/interceptors (rujuk `client.ts`).
  - Supabase: pola CRUD + Realtime (rujuk `apps/web/src/shared/api/client.ts`).
- API references (OpenAPI/Swagger):
  - Ekspos dan tautkan endpoint kritis (`/runs`, `/tools/*`, `/solo/builder/advance`).
- Diagram sequence (5 alur):
  - Chat streaming, Task/Project orchestration, Business Analytics, Workflow Automation, External Integrations.
- Changelog terstruktur: `docs/CHANGELOG.md` (SemVer, fitur/bug/security).
- Tambahan dokumen:
  - Troubleshooting guide (common issues: SSE disconnect, Redis latency, Supabase errors).
  - Performance benchmarking (target p50/p95/p99, throughput).
  - Security considerations (CSP, rate limit, RBAC, RLS, secrets handling).

## 4) Quality Assurance Dokumentasi
- Cross‑check dokumen vs implementasi (referensi `file_path:line_number`).
- Uji semua contoh kode (unit/integration/e2e) dan masukkan hasil ringkas.
- Peer review checklist.
- Validasi otomatis:
  - CI lint untuk Markdown/links; OpenAPI lint (`spectral`) dan diff (`openapi-diff`).
  - Test contoh kode dengan pipeline CI.
  - Version control ketat: PR template untuk dokumen (versi, perubahan, tautan bukti).

## 5) Deliverables & Integrasi
- `docs/business/overview.md`, `docs/business/use-cases/*.md`.
- `docs/technical/architecture.md`, `docs/technical/api/openapi.md`, `docs/technical/adr/*.md`, `docs/technical/security.md`, `docs/technical/db/*`.
- `docs/development/setup.md`, `docs/development/guidelines.md`, `docs/development/testing-strategy.md`, `docs/development/release.md`.
- `docs/tests/sla-nfr-acceptance.md` (sudah ada), tambah `docs/tests/e2e-plan.md`.
- `docs/references/benchmark-and-best-practices.md`, `docs/references/raci.md`.
- Update komprehensif `docs/README.md` + ToC & cross‑links.

## Riset & Best Practices (Singkat)
- Knowledge base & workflow berbasis mobile/OS: pentingkan efisiensi penyebaran informasi, metodologi pengumpulan data (studi pustaka, observasi), dan adaptasi terhadap perubahan lingkungan.
- Requirement analysis SDLC: identifikasi masalah, pengguna, kebutuhan fungsional/non‑fungsional; susun FRD; kaji ulang.
- Non‑fungsional: keamanan kredensial, keandalan, skalabilitas, observability; prioritisasi dampak.

## Langkah Implementasi Setelah Persetujuan
1. Hasilkan diagram dependensi dan analisis hot‑spots.
2. Restrukturisasi folder `docs` dan migrasikan konten sesuai klasifikasi.
3. Perbarui `docs/README.md` dan tambahkan ToC.
4. Tambahkan contoh kode, API refs, sequence diagrams, changelog, troubleshooting, perf, security.
5. Siapkan mekanisme QA dokumentasi dan integrasi CI lint/test/diff.

Silakan konfirmasi agar kami mulai melakukan perubahan struktur `docs`, menambahkan berkas baru, dan memperbarui konten sesuai rencana di atas.