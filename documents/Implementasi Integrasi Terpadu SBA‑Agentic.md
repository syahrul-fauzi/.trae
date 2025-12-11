## Tujuan
- Mewujudkan sistem SBA‑Agentic yang berfungsi sebagai satu kesatuan kohesif: modul saling terhubung, alur data konsisten, observability menyeluruh, dan pengujian E2E/stress yang tervalidasi.

## Lingkup
- Aplikasi: `apps/web` (Next.js), `apps/app` (Next.js), `apps/api` (NestJS)
- Paket: `@sba/shared-utils`, `@sba/security`, `@sba/observability`, `@sba/services`, `@sba/api-client`, `@sba/api-types`, `@sba/sdk`, `@sba/supabase`, `@sba/ui`, `@sba/utils`
- Monitoring: Prometheus (scrape endpoint teks), Grafana (dashboard API)
- CI/CD: gate coverage, e2e harian (cron), PR review gate

## Arsitektur Terpadu (Terpusat namun Modular)
- **Lapisan Presentasi**: `apps/web`, `apps/app` memakai komponen UI konsisten dan shared utils untuk header/tenant/rate‑limit/error.
- **Lapisan Layanan**: `apps/api` dengan middleware validasi (timestamp/JWT/HMAC), RBAC guard, audit logging, dan handler bisnis.
- **Lapisan Shared**: 
  - `@sba/shared-utils`: `ensureTenantHeader`, `checkRateLimit` + `addRateLimitHeaders`, `jsonError`, `getHeader`
  - `@sba/security`: RBAC/audit/validator
  - `@sba/observability`: Prometheus exporter (server) + metrics web (counter/histogram)
- **Komunikasi**:
  - HTTP/REST antar app ↔ api via `@sba/api-client`
  - WebSocket untuk AG‑UI events
  - Webhook audit (HMAC) untuk pencatatan eksternal
- **Kontrak Data**: `@sba/api-types` sebagai DTO dan tipe shared; propagasi `tenantId`, `requestId`/`correlationId` pada header.

## Alur Data Konsisten
1) Request (UI/API) → 2) Validasi (timestamp/JWT/HMAC, tenant) → 3) RBAC guard → 4) Handler bisnis → 5) Audit logging → 6) Metrik (counter/histogram) → 7) Response (server‑timing + rate‑limit headers)

## Persyaratan Teknis
- Versi: Node ≥ 20, TypeScript ≥ 5.6, Next.js 14/15, NestJS kompatibel
- Type‑check & lint strict (`noImplicitAny: true`, aturan ESLint konsisten)
- Error handling seragam via `jsonError` + audit; tidak leak detail sensitif
- SemVer paket workspace dan lockfile pnpm untuk kompatibilitas

## Konfigurasi & ENV
- **Global**: `BASE_URL=${BASE_URL}`
- **Keamanan**: `JWT_SECRET=${JWT_SECRET}`, `AUDIT_WEBHOOK_SECRET=${AUDIT_WEBHOOK_SECRET}`
- **Tenant/DB (opsional)**: `NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}`, `NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}`
- **E2E**: `PLAYWRIGHT_USE_DEV=${PLAYWRIGHT_USE_DEV}` (true agar server dev aktif saat test)

## Observability & Monitoring
- Prometheus teks: `GET /api/metrics/prometheus`, `GET /api/health/metrics`
- Web observability: counter/histogram di endpoint (`web_health_requests`, `agui_chat_processing_ms`, dll.)
- Grafana: import `api-dashboard` (latency p95/p99, throughput, error rate)

## Pengujian Diperlukan
- **E2E**:
  - Health & Metrics: `/api/health`, `/api/health/metrics`, `/api/metrics/prometheus`
  - AGUI Chat: POST `/api/agui/chat` (rate‑limit headers, payload valid)
  - Audit Webhook: HMAC verifikasi (`accepted`, `unauthorized`, `invalid_signature`)
  - UI Navigation & Console cleanliness: home, dashboard, integrations, chat
- **Integrasi Antar Modul**:
  - Kontrak request/response antar `apps/web`/`apps/app` ↔ `apps/api`
  - RBAC & audit konsistensi di backend
- **Stress Test (k6)**:
  - AGUI chat/health; summary di‑ingest ke `/api/metrics/ingest`; verifikasi panel Grafana p95/p99 & throughput

## Kriteria Keberhasilan
- Fitur berinteraksi lancar; alur data konsisten (tenant/requestId dipropagasi)
- Performa stabil di bawah beban normal (p95/p99 dalam ambang, throughput sesuai baseline)
- Tidak ada kehilangan data antar modul (audit trail/delivery status akurat)

## Rencana Implementasi Bertahap
1) **Normalisasi UI & Shared Utils**
- Audit dan migrasi semua impor UI di `apps/app` ke ekspor resmi `@sba/ui`; gunakan re‑export internal bila perlu
- Pastikan seluruh route memakai: `ensureTenantHeader`, `checkRateLimit`+`addRateLimitHeaders`, `jsonError`, `getHeader`
2) **Validasi & Keamanan**
- Terapkan validasi timestamp (ISO8601, toleransi), JWT HS256 (`JWT_SECRET`), HMAC untuk audit; RBAC guard dan audit log pada akses sensitif
3) **Observability Menyeluruh**
- Tambah counter/histogram + `Server‑Timing` pada endpoint; Prometheus exporter server defensif (tidak crash saat dependency tidak ada)
- Konfigurasi Prometheus scrape dan Grafana dashboard
4) **Menjalankan Layanan**
- Start `apps/web`, `apps/app`, (opsional: `apps/api`) dengan ENV lengkap; jalankan Prometheus & Grafana (binary/container) dan hubungkan datasource
5) **Pengujian E2E & Integrasi**
- `PLAYWRIGHT_USE_DEV=true` agar server dev aktif; tambahkan waits (`networkidle`/`domcontentloaded`) dan locator stabil; kumpulkan artefak (log/screenshot/video/trace)
6) **Stress Test & Baseline**
- Jalankan k6, ingest summary; dokumentasikan baseline p95/p99, throughput, error rate
7) **Analisis & Perbaikan**
- Tinjau kegagalan (timeout/visibility/env), perbaiki dan ulangi sampai stabil; tingkatkan coverage (≤5% per iterasi)

## Deliverables
- **Dokumentasi Arsitektur Terintegrasi**: deskripsi modul, kontrak API/DTO, pipeline request, propagasi header, RBAC/audit, observability
- **Diagram Alur Sistem**: komponen, jalur data, komunikasi (HTTP/WebSocket/Webhook), monitoring, storage ops
- **Laporan Pengujian Integrasi**: ringkasan E2E (passed/failed/flaky, success rate), artefak (log/screenshot/video/trace), analisis metrik sebelum/sesudah, baseline p95/p99/throughput/error rate, rekomendasi actionable

## Risiko & Mitigasi
- **Flaky Tests**: tambah waits/locator stabil, naikkan timeout, set ENV lengkap
- **Monitoring Tidak Aktif**: gunakan container (Prometheus/Grafana) sebagai fallback dan dokumentasikan setup
- **Kompatibilitas Versi**: pakai lockfile, matrix semver, hindari perubahan mayor tanpa review

## Catatan Pelaksanaan
- Pertahankan placeholder seperti `${key_name}`
- Gunakan bahasa yang sama dengan input; istilah teknis/kode dipertahankan
- Output berfokus pada penyempurnaan instruksi dan rencana terperinci siap dieksekusi