## Konteks & Temuan
- Monorepo berisi `apps/app` (Next.js App Router) dan paket reusable: `packages/ui`, `packages/supabase`, `packages/shared`.
- Keamanan: CSP & rate-limit di `apps/app/middleware.ts` dan rewrite locale di `apps/app/src/middleware.ts`.
- RBAC & Observability: util di `apps/app/src/shared` (RBAC, metrics), endpoint health & OpenAPI, error-report, dan SSR health.
- E2E: Playwright dengan baseURL konsisten, reporter lengkap, dan smoke specs untuk halaman kunci.
- Dokumentasi & workspace lengkap: README, `docs/*`, dan `workspace/*` (PRD, arsitektur, flows, API, XRef).

## Target Arsitektur
- Konsolidasikan util lintas-app ke modul shared yang jelas, mengikuti pola yang sudah ada.
- Pastikan pipeline Observability: `ensureTenantHeader` + `withMetrics` membungkus semua endpoint kritis.
- Pertahankan App Router groups `(authenticated)` vs `(public)` dengan guard SSR-aman.
- Terapkan desain modular berbasis domain: `features/*`, `shared/*`, `services/*`, `api/*`, `ui/*` tanpa mengubah framework.

## Reorganisasi Kode
- Shared & Security
  - Gabungkan dan selaraskan util keamanan/rate-limit/RBAC ke satu modul `apps/app/src/shared/security/*` dan `apps/app/src/shared/rbac/*` (alias ke `packages/shared` bila diperlukan) untuk mengurangi duplikasi.
  - Tegakkan penggunaan `applySecurityHeaders` di seluruh API App Router.
- Observability
  - Pastikan semua rute API penting dibungkus `withMetrics` dan melabeli tenant melalui `ensureTenantHeader`.
- Struktur API & Pages
  - Kelompokkan rute terkait knowledge di satu tempat (contoh: `apps/app/src/app/api/knowledge/*`) dan selaraskan kontraknya dengan dokumen workspace.
  - Standarisasi PageHeader/Breadcrumb, landmark ARIA, dan metadata (`generateBaseMetadata`) di halaman utama: `/observability`, `/api-docs`, `(authenticated)/monitoring`, `(authenticated)/settings`, `(authenticated)/knowledge`, `(authenticated)/integrations`, `(authenticated)/workspaces`.

## Refactoring Kode
- SSR & Runtime
  - Tambahkan `export const runtime = 'nodejs'` pada rute API yang memerlukan Node runtime untuk konsistensi.
  - Perketat guard SSR di `(authenticated)/layout.tsx` agar aman terhadap akses `document/window` dan tetap mendukung cookie test.
- Reliability & Performa
  - ObservabilityClient: perbaiki penanganan error, timeouts, dan polling; gunakan fetch yang robust dan typing yang kuat.
  - OpenAPI: cache ringan spesifikasi di memori proses dan validasi JSON (kontrak minimum) sebelum render.
  - Rate-limit: wrapper konsisten untuk public vs auth bucket; pastikan whitelist endpoint internal Next.
  - Provider context: pastikan wrapping di halaman bercontext (Monitoring) untuk mencegah runtime error.
- Playwright Stabilization
  - Gunakan `safeGoto` dengan `waitUntil: 'domcontentloaded'`, selector yang stabil (landmark/heading), dan satu runner disiplin.

## Peningkatan Fitur
- Smart Business Assistant — Knowledge & Orkestrasi
  - Endpoint agregasi knowledge: `POST /api/knowledge/search` dengan skema respons tersusun (hits, sources, plan) terinspirasi agentic retrieval.
  - UI Knowledge: halaman `(authenticated)/knowledge` dengan pencarian, hasil, dan panel rencana aksi.
- Monitoring & Observability
  - Tambah panel SSR Health & Error Events di halaman Observability; integrasikan `POST /api/error-report` untuk ringkasan insiden.
- Settings & Integrations & Workspaces
  - Konsolidasi komponen PageHeader, metadata, breadcrumb, dan aksesibilitas; perbaiki UX konsistensi.

## Pengujian
- Unit/Integrasi (Vitest)
  - RBAC: uji `withRBAC` untuk resource/action umum.
  - Security: uji header keamanan & rate-limit mock.
  - Metrics: uji `withMetrics` histogram & label tenant.
- E2E (Playwright)
  - Smoke halaman: `/api-docs`, `/observability`, `/monitoring`, `/settings`, `/knowledge`, `/integrations`, `/workspaces`.
  - API: `_health-ssr`, `health`, `openapi.json`, `error-report`, `knowledge/search`.
  - Reporters: list, html, json, junit; trace/video on-failure; baseURL stabil.

## Dokumentasi
- Perbarui README & `docs/*`: arsitektur, keamanan, observability, testing, deployment.
- Sinkronisasi `workspace/_xref.md` dengan entri baru (knowledge/search, monitoring panel, SSR health) dan status Review/Approved.
- Tambah panduan pengguna singkat untuk fitur Knowledge & Monitoring.

## Rencana Eksekusi & Verifikasi
- Buat branch peningkatan; implementasikan perubahan modul demi modul.
- Jalankan unit & integrasi; kemudian E2E satu-runner dengan reporter lengkap.
- Verifikasi pass rate ≥95% untuk smoke & API; ukur p95 latensi dan error rate.
- Dokumentasikan perubahan, hasil pengujian, dan rekomendasi di `docs/reports`.

## Referensi File Penting
- App Router & Pages: `apps/app/src/app/*`
- Middleware keamanan: `apps/app/middleware.ts`, rewrite: `apps/app/src/middleware.ts`
- RBAC util: `apps/app/src/shared/lib/rbac.ts`, config: `apps/app/src/shared/config/rbac.ts`
- Metrics & tenant: `apps/app/src/shared/metrics-registry.ts`
- API Health: `apps/app/src/app/api/health/route.ts`
- API OpenAPI: `apps/app/src/app/api/openapi.json/route.ts`
- API Error-report: `apps/app/src/app/api/error-report/route.ts`
- API SSR health: `apps/app/src/app/api/_health-ssr/route.ts`
- Authenticated layout: `apps/app/src/app/(authenticated)/layout.tsx`
- Observability: `apps/app/src/app/observability/page.tsx`, `apps/app/src/app/observability/ObservabilityClient.tsx`
- Monitoring: `apps/app/src/app/(authenticated)/monitoring/page.tsx`
- Playwright config & e2e: `apps/app/playwright.config.ts`, `apps/app/e2e/*`
- Dokumentasi & workspace: `README.md`, `docs/README.md`, `workspace/_xref.md`

## Catatan Agentic (Rujukan Konseptual)
- Desain fitur Knowledge mengikuti prinsip agentic: perencanaan kueri multi-subquery, eksekusi paralel, penggabungan hasil, dan rencana aksi (sesuai praktik pengambilan agentik). Ini menyokong UX copilot dan asisten bisnis yang adaptif.

Mohon konfirmasi rencana ini. Setelah disetujui, saya akan mulai mengimplementasikan perubahan, menjalankan pengujian, dan memperbarui dokumentasi sesuai target di atas.