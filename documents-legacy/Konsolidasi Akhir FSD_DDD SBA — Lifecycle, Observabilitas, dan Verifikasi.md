## Sasaran
- Menyelesaikan konsolidasi FSD/DDD hybrid di seluruh endpoint dan runtime.
- Menyeragamkan observabilitas per‑tenant (tenant header, metrics quantile) dan keamanan.
- Melengkapi lifecycle connectors agar event operasional (start/progress/complete/error/cancel) tertelemetri.
- Memverifikasi mutu end‑to‑end dengan suite test (unit/integrasi/E2E/perf/security).

## Rencana Teknis
### 1) Standardisasi Adapter & Tenant Header
- Tambah util `ensureTenantHeader(req)` ke semua adapter yang memakai `withMetrics` (knowledge/*, runs/*, runtime/runs, analytics/*, metrics/*, health) agar injeksi `x-tenant-id` seragam.
- Audit endpoint yang belum memakai pola `{validation → RBAC → metrics → service}` dan sesuaikan (khususnya test/mock routes jika digunakan di staging).

### 2) Observabilitas
- Lengkapi perhitungan quantile p95/p99 dari histogram untuk Prometheus exporter di semua lingkungan.
- Buat dashboard per‑tenant (latency, error rate, throughput, usage) berbasis label `tenant` dari registry.

### 3) Lifecycle Connectors Runtime
- Definisikan interface `RuntimeConnector` (onStart/onProgress/onComplete/onError/onCancel) dan `registerConnector()` di runtime.
- Daftarkan konektor:
  - Webhook: kirim event ke `ALERTS_WEBHOOK_URL`.
  - Audit: insert ringkas ke Supabase (audit_logs atau agent_runs).
  - Telemetri: push ke Prometheus/Datadog dengan label `{tenantId, workspaceId, runId}`.

### 4) Konsolidasi FSD/DDD
- Migrasi interaksi Supabase langsung dari adapter ke service DDD di `apps/api` (knowledge/tools/runs) agar boundary bersih.
- Pastikan adapter hanya validasi, RBAC, metrics, dan delegasi ke service.

### 5) Verifikasi & Mutu
- Unit: jwt/validator/rate‑limit; RBAC bypass; quantile metrics; runtime connectors.
- Integrasi: SSE/WS lifecycle (agent/runs), tenants CRUD (RBAC+metrics), knowledge search/vector (RBAC+metrics), control daemon (RBAC+metrics).
- E2E: isolasi tenant; stream agent; quotas; error banners.
- Perf: k6 streaming (latensi/throughput/backpressure/retry). 
- Security: CSP/HSTS/headers; fuzz payload; canary deploy.

## Deliverables
- Patch util tenant header dan penyeragaman adapter di seluruh endpoint.
- Implementasi lifecycle connectors pada runtime + konfigurasi.
- Migrasi service DDD untuk adapter yang masih akses langsung Supabase.
- Suite test lengkap (unit/integrasi/E2E/perf/security) dan laporan verifikasi tanpa regresi.

## Catatan Operasi
- RBAC untuk endpoint observabilitas (metrics/prometheus) disesuaikan kebijakan produksi (opsional `analytics:read`).
- Sampling/tuning bucket bila overhead metrics tinggi; canary untuk perubahan signifikan.

Silakan konfirmasi untuk eksekusi patch sesuai rencana di atas; setelah itu saya akan menerapkan perubahan dan menjalankan verifikasi menyeluruh.