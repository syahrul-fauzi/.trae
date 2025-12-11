## Ringkasan Temuan Awal
- A11y E2E sudah ada di `apps/web/e2e/ai-copilot-a11y.spec.ts` namun belum menangkap `console` sehingga variabel `errors` selalu kosong (lihat apps/web/e2e/ai-copilot-a11y.spec.ts:129–132). `SKIP_ERROR_PATTERNS` belum tersedia.
- Health & Metrics API tersedia di backend: `apps/api/src/api/controllers/HealthController.impl.ts` dan `MetricsController.impl.ts`; observability di `apps/api/src/infrastructure/observability/index.ts` dan `OpenTelemetryConfig.ts`.
- Monitoring stack ada: `monitoring/docker-compose.yml`, `monitoring/prometheus.yml` (scrape web `metrics_path: /api/health/metrics`).
- OpenAPI baseline: `apps/api/docs/openapi-baseline.yaml`.
- Supabase adapter: `apps/web/src/entities/conversation/supabase-adapter.ts`.
- SSE klien: `apps/app/src/shared/api/sse.ts`.
- RBAC pattern ada pada API routes web (mis. `apps/web/src/app/api/health/route.ts`, `.../health/metrics/route.ts`) via `withRBAC(...)`.

## Fase 1 — Fondasi & Guardrails
- Normalisasi import UI ke `@sba/ui` di web/app; perketat `tsconfig` (strict, noImplicitAny, exactOptionalPropertyTypes) dan typing API handler.
- Hardening Health/Metrics:
  - Tambah header `Server-Timing` untuk `GET /api/health` (web dan api) dan validasi `x-timestamp`+skew.
  - JSON error wrapper `jsonError` dan dev bypass aman (bendera `x-playwright-e2e`).
- Validasi konfigurasi:
  - Lengkapi `.env.example` untuk web/app/api (JWT secret, Redis, Supabase, OTel, Prom) dan script `config-check` yang memverifikasi env wajib.

## Fase 2 — Autentikasi & Proteksi
- Migrasi/penyatuan `LoginForm` di `apps/web` ke endpoint JSON `POST /api/auth/login`, set-cookie/session (JWT HS256) lalu redirect ke `/dashboard`.
- Middleware normalisasi path `/login`, not-found page konsisten.
- RBAC gating App Router (web dan app) untuk route protected; gunakan helpers `@sba/security` (verifikasi JWT/HMAC/timestamp) dan policies (role→resource→action).
- Audit webhook opsional untuk event akses ditolak.

## Fase 3 — Pengujian & Stabilitas
- Unit tests (Vitest) per paket/app: security (JWT/HMAC), observability helpers, api-client, UI atomik.
- E2E login lengkap (Playwright): form→API→cookie→redirect; timeouts/waits/retries; gunakan `data-testid`.
- Repeat-run gate: gunakan `apps/web/scripts/e2e-repeat.js` dan agregasi flakiness (≥95% pass, ≤5% flakey).
- A11y stabilisasi di `apps/web/e2e/ai-copilot-a11y.spec.ts`:
  - Tambah `page.on('console', ...)` untuk push error/warning ke `errors` dan terapkan `SKIP_ERROR_PATTERNS` (non-blocking yang dibenarkan seperti noise third-party, `color-contrast` hanya didokumentasi).
  - Catat pelanggaran Axe, gagal hanya pada `critical/serious` yang bukan pengecualian; pertahankan artefak screenshot.
  - Integrasi `jest-axe` untuk unit a11y komponen (apps/web/src/features/ai/components/__tests__/AICopilot.a11y.spec.tsx).
  - Kode acuan audit ada di apps/web/e2e/ai-copilot-a11y.spec.ts:74–101 (initial) dan 99–111 (post audit); penempatan `SKIP_ERROR_PATTERNS` di bagian atas file (sekitar 6–12).

## Fase 4 — Observability & Monitoring
- OTel: pastikan tracer/meter aktif di `OpenTelemetryConfig.ts`; aktifkan HTTP/Nest/Redis/BullMQ instrumentations.
- Prometheus: pastikan `http_requests_total` dan `http_request_duration_seconds` tersedia; jika memakai `telemetry.exportPrometheus()`, tambahkan counter+histogram registrasi default.
- Monitoring: jalankan Compose (`monitoring/docker-compose.yml`), sambungkan scrape target API (`/metrics`) dan web (`/api/health/metrics`), siapkan dashboard Grafana p95/p99, throughput, error rate; simpan artefak screenshot.

## Fase 5 — Performa & UX
- Optimasi render kritis (layout), prefetching, lazy-load, dynamic imports; guard bundlesize (size-limit atau plugin Next).
- Konsistensi komponen `@sba/ui` dan ikon unified `Icon`.

## Fase 6 — Dokumentasi
- Lengkapi blueprint: `/home/inbox/smart-ai/sba-agentic/.trae/documents/Implementasi End‑to‑End SBA‑Agentic.md` (Mermaid arsitektur, matriks dependensi, spesifikasi API internal, keamanan, rencana pengujian, CI/CD gates).
- Sinkronkan `docs/SPEC.md`, `docs/ARCHITECTURE.md`, `docs/WORKFLOWS.md`, `docs/FEATURES.md`; OpenAPI baseline tersinkron dengan controller nyata.

## Fase 7 — CI/CD & Otomatisasi
- Workflows: config‑check web/api, type-check, lint, coverage, bundlesize, lighthouse.
- Jadwalkan e2e repeat harian; auto‑rollback post‑deploy bila gate gagal.
- Artefak `ci-artifacts/summary.json` berisi ringkasan hasil (p95/p99, pass rate, coverage, bundlesize).

## Verifikasi & Acceptance
- Auth berfungsi: POST JSON→cookie/session→redirect `/dashboard`.
- Health: `GET /api/health` mengandung `Server‑Timing`; `GET /api/metrics` Prometheus text; dashboard Grafana aktif.
- RBAC: rute protected hanya untuk role valid; uji negatif ditolak dan tercatat.
- Observability: traces OTel terlihat; metrics di Prometheus; screenshot dashboard.
- E2E: repeat‑run ≥95% pass; a11y tidak ada `critical` (pengecualian terdokumentasi via `SKIP_ERROR_PATTERNS`).
- CI/CD: semua gates aktif; artefak summary dipublikasikan.

## Risiko & Mitigasi
- Flaky E2E: tingkatkan timeout, explicit waits (`toBeVisible`), retries; pakai repeat‑run gate.
- Missing deps: tambahkan devDeps aman (`prom-client`, `pino`) bila belum ada; guard runtime.
- Secrets: wajib env, tanpa commit; audit di CI.

## Langkah Setelah Persetujuan
1. Implementasi Fase 1–2 di repo (fondasi + auth/RBAC). 
2. Tambah a11y stabilisasi (console capture + `SKIP_ERROR_PATTERNS`) di `apps/web/e2e/ai-copilot-a11y.spec.ts` dan unit `jest-axe`.
3. Aktifkan metrics OTel/Prom, jalankan monitoring, buat dashboards dan artefak.
4. Lengkapi dokumentasi dan perluas CI gates hingga kriteria terpenuhi.

Siap mengeksekusi sesuai rencana di atas begitu Anda menyetujui.