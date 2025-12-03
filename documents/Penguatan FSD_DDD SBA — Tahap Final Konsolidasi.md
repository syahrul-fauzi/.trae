## Sasaran
- Menyelesaikan konsolidasi pola adapter FSD/DDD hybrid di semua endpoint (validasi → RBAC → observabilitas → service/use‑case).
- Memastikan observabilitas per‑tenant seragam (injeksi `x-tenant-id`, metrics histogram/counters, quantile p95/p99).
- Melengkapi lifecycle connectors di runtime untuk audit/alert/telemetri.
- Memverifikasi mutu end‑to‑end (unit/integrasi/E2E/perf/security) tanpa regresi.

## Lingkup Perubahan Endpoint
- Knowledge (ingest/upsert/vector‑search): tambahkan `withRBAC` (manage/read), injeksi `x-tenant-id`, bungkus `withMetrics`.
- Runs `[runId]` (GET/PUT) dan `runtime/runs` (GET/POST): injeksi `x-tenant-id`, bungkus `withMetrics` di dalam `withRBAC`.
- Health & Metrics (app/analytics/prometheus): injeksi `x-tenant-id`, bungkus `withMetrics`; RBAC `analytics:read` untuk metrik (opsional untuk health).
- Tenants `[id]`: gunakan `withRBAC` + `withMetrics` untuk GET/PUT/DELETE.

## Observabilitas
- Tambahkan util `ensureTenantHeader(req)` untuk injeksi header tenant seragam sebelum `withMetrics`.
- Implementasi quantile p95/p99 dari histogram di `metrics-registry` dan ekspor sebagai gauge pada Prometheus route.

## Runtime & Lifecycle
- Definisikan `RuntimeConnector` (onStart/onProgress/onComplete/onError/onCancel) dan `registerConnector()` pada runtime.
- Daftarkan konektor webhook (ALERTS_WEBHOOK_URL), audit (Supabase), dan telemetri (push Prometheus/Datadog) dengan label `{tenantId, workspaceId, runId}`.

## Konsistensi FSD/DDD Hybrid
- Route Next.js bertindak sebagai adapter: schema (Zod) → RBAC → Metrics → panggil service DDD (`apps/api`).
- Migrasikan interaksi Supabase langsung (knowledge/tools/runs) dari adapter ke service DDD bertahap.

## Pengujian & Verifikasi
- Unit: jwt/validator/rate‑limit; RBAC bypass; quantile metrics; runtime connectors.
- Integrasi: SSE/WS lifecycle (agent/runs), tenants CRUD (RBAC+metrics), knowledge search/vector (RBAC+metrics), control daemon (RBAC+metrics).
- E2E: isolasi tenant; stream agent; quotas; error banners.
- Perf: k6 streaming latensi/throughput/backpressure.
- Security: CSP/HSTS/headers; fuzz payload; canary deploy.

## Risiko & Mitigasi
- Ketidakseragaman injeksi tenant → util seragam wajib; audit patch lintas endpoint.
- Ketergantungan Supabase anon → alihkan ke service key/per‑user auth pada server di tahap berikut.
- Overhead metriks → sampling/bucket tuning bila diperlukan.

## Deliverables
- Patch konsolidasi RBAC/Metrics/injeksi tenant untuk endpoint tersisa.
- Util `ensureTenantHeader(req)` dan quantile p95/p99 di `metrics-registry`.
- Lifecycle connectors pada runtime; dokumentasi konfigurasi.
- Test suite (unit/integrasi/E2E/perf/security) diperbarui; laporan verifikasi tanpa regresi.

## Eksekusi
- Saya akan menyiapkan patch spesifik per file sesuai lingkup di atas, menambahkan util injeksi tenant & quantile metrics, dan mengaitkan lifecycle connectors; kemudian menjalankan test untuk memverifikasi fungsionalitas dan mutu end‑to‑end tanpa regresi.