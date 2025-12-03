## Sasaran
- Menuntaskan konsolidasi FSD/DDD hybrid di seluruh API dan runtime.
- Menyeragamkan observabilitas per‑tenant (tenant header, histogram/counters, quantile p95/p99) dan keamanan.
- Melengkapi lifecycle connectors di runtime (audit/webhook/telemetri) untuk event operasional utama.
- Memastikan mutu end‑to‑end dengan test (unit/integrasi/E2E/perf/security) tanpa regresi.

## Konsolidasi Adapter & Tenant Header
- Audit seluruh endpoint ber‑metrics (knowledge/*, runs/*, runtime/runs, analytics/*, metrics/*, health) dan pastikan pola adapter konsisten: {validation → RBAC → metrics → service call}.
- Terapkan util `ensureTenantHeader(req)` untuk injeksi `x-tenant-id` seragam sebelum `withMetrics` di setiap adapter.
- Samakan RBAC resource/action: analytics:read (GET/read), analytics:manage (POST/write); run:read/update/create; agent:manage untuk kontrol/scheduler.

## Observabilitas & Prometheus
- Lengkapi perhitungan quantile p95/p99 dari histogram di registry dan ekspor sebagai gauge di Prometheus.
- Buat definisi panel per‑tenant (latency, error rate, throughput, usage) untuk dashboard observabilitas.
- Pastikan metrics endpoint (app/analytics/prometheus) mematuhi kebijakan RBAC (opsional `analytics:read`) sesuai lingkungan produksi.

## Runtime Lifecycle Connectors
- Tambahkan interface `RuntimeConnector` dan `registerConnector()` ke runtime.
- Implementasi konektor:
  - Webhook: kirim `run_completed`/`run_error` ke `ALERTS_WEBHOOK_URL`.
  - Audit: tulis ringkas ke Supabase (audit_logs/agent_runs).
  - Telemetri: push metrik ke Prometheus/Datadog dengan label `{tenantId, workspaceId, runId}`.
- Hubungkan event `onStart/onProgress/onComplete/onError/onCancel`.

## Konsolidasi FSD/DDD
- Migrasi interaksi Supabase langsung dari adapter Next ke service DDD di `apps/api` (knowledge/tools/runs) agar boundary bersih.
- Adapter rute hanya menangani validasi, RBAC, metrics, delegasi ke service.

## Verifikasi & Mutu
- Unit: jwt/validator/rate‑limit; RBAC bypass; registry quantile; runtime connectors.
- Integrasi: SSE/WS lifecycle (agent/runs); tenants CRUD (RBAC+metrics); knowledge search/vector (RBAC+metrics); control daemon (RBAC+metrics).
- E2E (apps/web):
  - Chat stream auto‑scroll dan toggle (lihat `apps/web/src/features/chat/components/__tests__/ChatWindow.test.tsx`).
  - Isolasi tenant; quotas; error banners.
- Perf: k6 streaming (latensi/throughput/backpressure/retry); uji beban untuk SSE/WS.
- Security: CSP/HSTS/headers; fuzz payload; canary deploy sebelum produksi.

## Deliverables
- Patch util tenant header dan penyeragaman adapter di seluruh endpoint.
- Implementasi lifecycle connectors pada runtime + konfigurasi.
- Migrasi service DDD untuk adapter (knowledge/tools/runs).
- Suite test lengkap (unit/integrasi/E2E/perf/security) dan laporan verifikasi tanpa regresi.

## Operasional
- RBAC untuk observabilitas diselaraskan kebijakan produksi.
- Tuning bucket/sampling jika overhead metrics tinggi; gunakan canary untuk perubahan signifikan.

Setelah Anda menyetujui rencana ini, saya akan menerapkan patch util `ensureTenantHeader`, menambahkan lifecycle connectors, memigrasikan akses langsung ke service DDD, serta menjalankan test menyeluruh untuk memverifikasi mutu end‑to‑end.