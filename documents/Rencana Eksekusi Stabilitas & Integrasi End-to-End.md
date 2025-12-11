## Tujuan
- Menjamin semua fitur berjalan stabil dan optimal, dengan konektivitas antarkomponen sesuai arsitektur.
- Melakukan pengujian menyeluruh (fungsionalitas, performa, keamanan) pada setiap tahap.
- Menjaga alur kerja terstruktur dengan dokumentasi lengkap atas setiap perubahan.

## Ruang Lingkup
- Frontend (Next.js), Backend (NestJS API), Workers/Queues, Observability, CI/CD, Dokumentasi.

## Integrasi Arsitektur
- Konsolidasikan kontrak API dan event lintas modul (auth, uploads, workflows, meta-events, notifications).
- Terapkan konektivitas yang konsisten: header `tenant`, `request-id`, dan trace ID di setiap hop (Web → API → Worker).
- Pastikan rate limiting dan cache bekerja seragam di API dan Web.

## Observability & Monitoring
- Prometheus scrape: API `:9464/metrics`, Web `/api/metrics/prometheus`.
- Perluas exporter Workers: `GET /metrics/workers` (admin) dengan label `queue_name` untuk:
  - Throughput, error rates (total/4xx/5xx/timeout), active jobs, queue depth.
- Grafana: gunakan dashboard JSON yang sudah disiapkan; tambah panel Workers (queue depth, fail rate, processing duration).
- Alerting: gunakan `alerts.yml` (error rate >1%, p95 latency >300ms, memory >75%).

## Pengujian Menyeluruh
- Unit/Integration: kontrak endpoint (schema, status, error codes).
- E2E Web: login → dashboard → metrics/baseline → alerts; stabilisasi waits dan retry.
- Beban (k6): smoke/stress/soak memakai ops/k6/* dengan thresholds p95<300ms, error rate<1%.
- Security: uji RBAC (admin/user), rate limit 429, input validation, CORS, secret handling.

## Performa & Skala
- Profiling p95/p99: histogram `http_request_duration_ms_bucket`, optimasi handler panas.
- Tuning DB/Redis: koneksi pool, indeks query, TTL cache.
- Workers: batching, backoff, visibility timeout, monitoring lag dan depth.

## Quality Gates (CI/CD)
- Lint, type-check, unit/integration, build, E2E, k6 smoke.
- Concurrency per branch, artefak baseline branch-aware.
- Publish laporan (Playwright HTML, k6 summary, coverage) sebagai artefak.

## Keamanan
- Audit penggunaan secrets/env; tidak ada hard-code kunci.
- Header keamanan dan sanitasi input (zod/DTO) konsisten.
- Rate limiting dan anti-abuse untuk endpoint publik.

## Dokumentasi
- Update README: deploy langkah-langkah, env, monitoring, thresholds, alerting.
- API Docs: daftar endpoint, contoh request/response, error codes, rate limiting.
- Ops Docs: Prometheus (`prometheus.yml`, `alerts.yml`), Grafana dashboard, k6 skenario dengan cara pakai dan penyesuaian parameter.

## Kriteria Penerimaan
- Semua endpoint stabil di staging; E2E lulus konsisten.
- Grafana menampilkan metrik kunci dan alert terkirim sesuai threshold.
- k6 stress mencapai target RPS dengan p95<300ms dan error rate<1%.
- Dokumentasi lengkap dan akurat; CI quality gates hijau.

Setujui rencana ini, lalu saya akan langsung mengeksekusi implementasi, pengujian, dan dokumentasi sesuai poin di atas.