## Tujuan & Ruang Lingkup
- Menyempurnakan apps/web agar memenuhi standar enterprise: arsitektur modular, kualitas terukur, UI/UX premium, dan CI/CD dengan quality gates.
- Beracuan pada dokumen Use Case & Rancangan Monorepo Turbo; menjaga kompatibilitas penuh dengan workspace `@sba/*`.

## Arsitektur (FSD + DDD + Atomic)
- FSD layering konsisten: `features/<name>/{model,lib,ui}`; pisahkan logic (model/lib) dari presentasi (ui).
- DDD boundary di web: tambah `src/entities/_adapters` untuk mapping DTO ke domain `@sba/entities`; centralize anti-corruption layer.
- Atomic Design: restruktur `src/shared/ui` menjadi `atoms`, `molecules`, `organisms`, `templates`, `pages`; migrasi komponen umum (Button, Card, Skeleton, Toast, ErrorBoundary, SafeIcon) sesuai tingkat.
- Komunikasi antar modul: gunakan `@tanstack/react-query` untuk data orchestration, eventing ringan via context (mediator) di `src/processes` bila perlu.
- Navigasi & shell: pertahankan `widgets/DashboardLayout.tsx`, tambahkan template-level patterns (landmarks ARIA, skip links) sebagai kontrak.

## Refactory & Reorganisasi
- Audit struktur `features`: rapikan `chat`, `dashboard`, `workflows`, `documents`, `integrations`, `ai` ke pola FSD; pindahkan helper ke `lib` dan state ke `model`.
- `src/entities`: buat adaptor untuk `conversation`, `document`, `tenant`, `user`, `workflow` agar konsumsi domain `@sba/entities` konsisten dan testable.
- `src/shared/lib/utils.ts`: kurasi util umum; hindari duplikasi di fitur; tambahkan guard untuk SSR/CSR.
- Tailwind: pastikan token (colors, spacing, radius) tersentral; verifikasi screens 3xl/4xl/5xl diterapkan pada layout utama.

## Kualitas & Pengujian
- Unit: target coverage ≥80% dengan `vitest --coverage`; enforce threshold di CI (statemen/branches/functions/lines).
- Integration: tambahkan test untuk interaksi modul (Chat stream + persistence, WorkflowBuilder drag/select, Integrations hub actions, AI Copilot command dispatch).
- E2E (Playwright):
  - Alur utama: `/dashboard`, `/chat`, `/ai-copilot`, `/integrations`, `/workflows` (smoke + aksi inti).
  - Aksesibilitas: keyboard nav, ARIA landmarks, reduced-motion, color contrast dasar.
  - Stabilitas: console cleanliness, responsivitas (mobile/desktop/ultra-wide).
- Guard rails: pertahankan `no-inline-style`, `invalid-nesting`, `no-dangerous-sinks`; tambahkan check CSP headers & rate-limit behavior.

## UI/UX Premium & Aksesibilitas
- Design system: konsolidasikan typography (Inter via `next/font`), warna semantic (bg/fg/primary/secondary), spacing scale, focus ring konsisten.
- Micro-interactions: animasi halus, patuh `prefers-reduced-motion`; skeleton & loading states seragam; menyertakan feedback (Toast) yang aksesibel.
- WCAG 2.1 AA: ARIA roles/labels, skip-to-content, tab order jelas, hit area yang memadai, contrast minimum.
- Konsistensi halaman baru: memastikan `/ai-copilot` dan `/integrations` memakai template & tokens yang sama.

## Performa & Keandalan
- Code-splitting: `dynamic import` untuk komponen berat (Chart, Workflow canvas, AI tools); prefetch rute kritis.
- Asset & font: `next/image` untuk media, `next/font` self-host; hindari external font hosts sesuai CSP.
- Observabilitas: health/metrics tetap; tambah Web Vitals logging (LCP/CLS/FID) ke endpoint telemetry (sampling terkendali).
- CSP: pertahankan `nonce` dan `strict-dynamic`; `style-src/font-src` ketat; verifikasi via E2E.

## CI/CD & Quality Gates
- Workflow CI (GitHub Actions/GitLab): jobs untuk `type-check`, `lint`, `unit+integration` (coverage gate), `e2e` (Playwright dengan `baseURL`), `build` (Next).
- Artifacts: simpan laporan coverage, test-results, dan build outputs; fail-fast bila gate tidak lolos.
- Matrix: browser (chromium/firefox/webkit), node versi LTS; caching `pnpm`.
- Rollback: publish artifacts + tag; dokumentasikan langkah rollback release di docs.

## Dokumentasi & Operasional
- ADR: tambahkan keputusan struktur Atomic/FSD boundaries, coverage gates, pipeline CI.
- Technical spec: komponen API (props), kontrak domain adaptor, flow data antar modul.
- API docs: catat `src/app/api/*` (telemetry, health, agui/chat) kontrak & contoh payload.
- Deployment guide: env vars (BASE_URL, CSP, OTEL), build, start, verifikasi CSP/E2E.
- Troubleshooting: daftar error umum (build cache, CSP violations, hydration mismatch) dan solusi.
- Changelog & migration: ringkas perubahan dan langkah migrasi untuk repos konsumen.

## Rencana Implementasi Bertahap
- Tahap 1: Refactory struktur FSD+Atomic untuk `chat` dan `dashboard`, buat `entities/_adapters` dasar; jaga kompatibilitas.
- Tahap 2: Integrasi test integration + perluasan E2E untuk alur utama; set coverage gates.
- Tahap 3: UI/UX harmonisasi (tokens, templates, a11y) di seluruh halaman termasuk `/ai-copilot` & `/integrations`.
- Tahap 4: Performance tuning (split, vitals) dan harden CSP; verifikasi E2E CSP.
- Tahap 5: Tambah pipeline CI/CD dan dokumentasi lengkap; siapkan rollback.

## Risiko & Mitigasi
- Risiko pemutusan referensi internal saat refactor → mitigasi dengan adaptor layer dan uji integrasi bertahap.
- Flaky E2E pada dev server → gunakan `webServer` dengan retry & timeouts; isolasi data mocks.
- CSP ketat menghambat fitur → audit origin via env; gunakan `next/font` & self-host assets.

## Deliverables
- Struktur kode yang dirapikan dengan FSD+DDD+Atomic.
- Suite pengujian lengkap (unit/integration/E2E) dengan coverage ≥80%.
- Design system konsisten & a11y audit lolos.
- Pipeline CI/CD dengan quality gates aktif.
- ADRs, technical spec, API docs, deployment guide, troubleshooting, changelog.