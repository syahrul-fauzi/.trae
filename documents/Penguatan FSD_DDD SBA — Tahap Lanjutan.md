## Sasaran & Cakupan
- Konsolidasikan FSD/DDD hybrid agar setiap route bertindak sebagai adapter tipis: validasi → RBAC → observabilitas → panggil service/use‑case.
- Standarkan security (RBAC/JWT/validator/rate‑limit) lintas endpoint, termasuk rute tenants dan runs (ws/events/history).
- Lengkapi observabilitas per‑tenant di seluruh endpoint, dan hitung p95/p99 dari histogram.
- Tambahkan lifecycle connectors pada runtime untuk audit/webhook/telemetri otomatis.
- Pastikan sistem tetap beroperasi mandiri 24/7 dengan watchdog/failsafe/self‑healing stabil.

## Perubahan yang Diimplementasikan
1) Security Terpusat
- Perluas `getServerSession(req)` untuk fallback JWT Bearer (role/tenant klaim).
- Modifikasi `withRBAC(handler, opts)(req)` guna membaca sesi/JWT dari req.
- Terapkan RBAC di endpoint yang belum: analytics, knowledge GET, tenants GET/POST, agent control GET/POST.
- Tambahkan CSP global di middleware `/api`.

2) Observabilitas Per‑Tenant
- Injeksi `x-tenant-id` sebelum `withMetrics` di semua adapter (agent/runs/analytics/knowledge/tenants).
- Tambahkan business counter saat stream dibuka di agent SSE.
- Siapkan fungsi quantile p95/p99 dari histogram untuk Prometheus exporter.

3) FSD/DDD Hybrid
- Route Next.js sebagai adapter: validasi (Zod), RBAC, metrics, lalu panggil service DDD (apps/api) untuk use‑case (knowledge/tools/runs).
- Pindahkan interaksi Supabase langsung dari adapter ke service/tool DDD bertahap.

4) Lifecycle Connectors
- Definisikan interface `RuntimeConnector` dan `registerConnector()` pada runtime (onStart/onProgress/onComplete/onError/onCancel).
- Daftarkan konektor webhook/audit/telemetri (Datadog/Prometheus push) menggunakan exporters.

## Rencana Implementasi Detail
### Keamanan
- Standarkan `@sba/security` pada rute: `runs/[runId]/(ws|events|history)`, `tenants/[id]`, `analytics/*`, `knowledge/*`, `agent/*`.
- Rate‑limit per tenant/IP via `slidingWindowLimiter` + `tenantKeyFn` di rute intensif.

### Observabilitas
- Buat util `ensureTenantHeader(req)` untuk injeksi label tenant seragam.
- Implementasi p95/p99 dari histogram di `metrics-registry` dan ekspor ke Prometheus route.

### FSD/DDD
- Konsolidasikan modul service DDD di apps/api untuk knowledge/tools/runs; adapter Next memanggil service via modul/HTTP internal.
- Penamaan konsisten: `{validation} → {rbac} → {metrics} → {service call}`.

### Runtime
- Hubungkan lifecycle dengan alerting/audit/telemetri (push Prometheus/Datadog) dan webhook (optional) per event.

## Pengujian & Verifikasi
- Unit: jwt/validator/rate‑limit; RBAC bypass; metrics quantile; runtime connectors.
- Integrasi: SSE/WS lifecycle (agent), health/metrics, tenants CRUD dengan RBAC, knowledge search dengan label tenant.
- E2E: isolasi tenant, stream render, quotas, error banners.
- Perf: k6 streaming latensi/throughput/backpressure.
- Security: CSP/HSTS/headers; fuzz payload; canary deploy.

## Risiko & Mitigasi
- Ketidakseragaman injeksi tenant → util seragam wajib.
- Ketergantungan Supabase langsung → migrasi bertahap ke service DDD.
- Overhead metrics → sampling jika diperlukan.

## Deliverables
- Patch konsolidasi security & observabilitas lintas endpoint.
- Util injeksi tenant dan quantile p95/p99 di metrics registry.
- Implementasi lifecycle connectors pada runtime.
- Test suite (unit/integrasi/E2E/perf/security) diperbarui.

Konfirmasi untuk melanjutkan eksekusi patch per file sesuai rencana di atas. 