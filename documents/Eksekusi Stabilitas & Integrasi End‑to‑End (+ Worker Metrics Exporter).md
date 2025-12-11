## Tujuan
- Menstabilkan seluruh fitur dan konektivitas antar komponen (Web ↔ API ↔ Worker) sesuai arsitektur.
- Melakukan pengujian menyeluruh untuk fungsionalitas, performa, dan keamanan.
- Mengaktifkan observability lengkap termasuk exporter Workers `/metrics/workers` berlabel `queue_name`.
- Menjaga alur kerja terstruktur dengan dokumentasi perubahan.

## Ruang Lingkup
- Frontend (Next.js), Backend (NestJS), Workers/Queues (BullMQ), Observability (Prometheus/Grafana), CI/CD, Dokumen.

## Integrasi & Konektivitas
- Propagasi header konsisten: `x-tenant-id`, `x-request-id` dan trace ID dari Web → API → Worker.
- Konsolidasi kontrak API (auth, uploads, workflows, meta-events, alerts, notifications) agar bebas coupling.
- Rate limiting dan cache: selaraskan batas dan TTL di Web/API agar pengalaman seragam.

## Observability
- API exporter: `:9464/metrics` aktif, metrics HTTP dan gauges proses.
- Web exporter: `/api/metrics/prometheus` untuk baseline/testing.
- Worker exporter: `GET /metrics/workers` (roles admin) mengekspor:
  - Throughput per `queue_name` (jobs/s)
  - Error rates: total/4xx/5xx/timeout
  - Active jobs dan queue depth
  - Processing duration (histogram) bila tersedia
- Prometheus scrape targets: API, Web, Workers; alert rules (error rate >1%, p95 latency >300ms, memory >75%, queue depth threshold).
- Grafana: tambah panel Workers (queue depth, fail rate, processing time) ke dashboard yang sudah dibuat.

## Pengujian Menyeluruh
- Unit/Integration: Health/Metrics controllers, Worker metrics service/controller, rate limit dan error handling.
- E2E Web: login → dashboard → metrics/baseline → alert; stabilisasi waits/retry.
- Beban (k6): smoke/stress/soak dengan thresholds p95<300ms dan error rate<1%.
- Keamanan: RBAC (admin/user) untuk `/metrics` dan `/metrics/workers`, validasi input, CORS, penanganan secrets.

## Performa & Skala
- Profiling p95/p99 via histogram bucket; optimasi handler panas.
- DB/Redis tuning (pool, indeks, TTL, backoff).
- Workers: batching, backoff, visibility timeout; pantau lag dan depth.

## CI/CD & Quality Gates
- Pipeline: lint, type-check, unit/integration, build, E2E, k6 smoke;
- Concurrency per branch; artefak baseline branch-aware; laporan Playwright/k6/coverage sebagai artefak.

## Dokumentasi
- Update README: alur deploy, env, monitoring, thresholds, worker exporter.
- Update API Docs: endpoint `/metrics`, `/metrics/workers`, contoh request/response dan error codes.
- Ops Docs: Prometheus (`prometheus.yml`, `alerts.yml`), Grafana dashboard, k6 skenario berparameter.

## Kriteria Penerimaan
- Endpoint stabil di staging; E2E lulus konsisten.
- Dashboard Grafana menampilkan metrik kunci dan Workers; alert terkirim sesuai threshold.
- k6 stress memenuhi target RPS dengan p95<300ms dan error rate<1%.
- Dokumentasi lengkap; CI quality gates hijau.

Jika disetujui, saya akan langsung mengimplementasikan exporter Workers, menstabilkan integrasi, menjalankan pengujian, serta memperbarui dokumentasi sesuai rencana.