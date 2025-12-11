## Tujuan
- Mendeploy aplikasi ke produksi dengan observability lengkap (baseline metrics, alert dashboard), API yang terverifikasi untuk skala dan keandalan, serta dokumentasi yang diperbarui.
- Memastikan semua checklist production‑ready terpenuhi: stabilitas, keamanan, monitoring, rollback, dan readiness probes.

## Prasyarat Lingkungan
- Menetapkan variabel lingkungan: `PROMETHEUS_ENABLE`, `ALERT_WEBHOOK_URL`, `ALERT_SEVERITY_THRESHOLDS`, `RATE_LIMIT_WINDOW`, `RATE_LIMIT_MAX`, kredensial DB/Supabase/Storage, dan `NODE_OPTIONS` untuk memori jika perlu.
- Konfigurasi scrape target Prometheus untuk `apps/api` dan `apps/web` (endpoint `/api/metrics/prometheus` dan `/api/health`/`/metrics` bila tersedia).
- Menyiapkan Grafana untuk dashboard dan rule alert; siapkan Slack/Email webhook untuk notifikasi.

## Baseline Metrics
- Implementasi: 
  - Instrumentasi CPU/memory (Node `process`, `os`), latency dan error rate per endpoint (middleware wrapper) di `apps/api` dan `apps/web`.
  - Ekspor Prometheus text format: gunakan endpoint yang sudah ada di `apps/web/src/app/api/metrics/prometheus/route.ts` dan perluas di sisi API (HealthService) agar mengeluarkan metrik sistem.
  - Pastikan histogram bucket, `_sum`, `_count` dan counter `_total` terisi; lanjutkan ingest (k6) via `/api/metrics/ingest` untuk uji beban.
- Akses monitoring:
  - Konfigurasikan Prometheus untuk scrape interval 15s dan retensi sesuai kebutuhan.
  - Buat Grafana dashboard dengan panel untuk CPU, memory, p95/p99 latency, error rate, RPS.
- Threshold normal:
  - CPU < 70%, Memory < 75%, p95 latency API < 300ms, p95 web < 500ms, error rate < 1%, RPS sesuai target.
  - Tersimpan sebagai konfigurasi (env/JSON) agar mudah diubah per lingkungan.
- Verifikasi:
  - Jalankan synthetic check (ping) dan E2E baseline; pastikan delta memenuhi ekspektasi dan baseline tersimpan sebagai artefak (branch‑aware).

## Alert Dashboard
- Dashboard monitoring:
  - Halaman dashboard yang menampilkan metrik kritis (CPU/memory, latency, error rate, baseline delta) dengan ringkas.
  - Integrasi widget baseline yang sudah ada (sparkline, status) dan kartu status sistem.
- Alert otomatis:
  - Rule alert berdasarkan threshold (warn/error) dengan debounce/rate‑limit agar tidak spam.
  - Notifikasi real‑time ke Slack/Email menggunakan webhook; sertakan metadata (severity, sumber, waktu, link tindakan).
- Validasi:
  - Uji dengan mensimulasikan kondisi abnormal (menaikkan latency/error rate) dan konfirmasi notifikasi terkirim.

## Endpoint API
- Verifikasi di staging:
  - Smoke test semua endpoint utama (auth, uploads, workflows, knowledge search, alerts, notifications, meta‑events, metrics/baseline, health).
  - Contract test: validasi skema request/response dan error codes.
- Stress testing/skalabilitas:
  - Jalankan k6/artillery untuk skenario RPS bertahap (mis. 50→200 RPS), amati p95/p99 latency dan error rate.
  - Verifikasi rate limiting (`RATE_LIMIT_WINDOW`, `RATE_LIMIT_MAX`) dan error handling konsisten.
- Observability korelasi:
  - Tambahkan trace/request ID pada log dan respons bila belum ada untuk memudahkan korelasi.

## Dokumentasi
- Update README.md:
  - Instruksi deploy lengkap (CI/CD, build & start command, env vars, secrets, migrate DB).
  - Konfigurasi lingkungan (staging→production), perbedaan dan guardrails (concurrency, artefak baseline branch‑aware).
  - Dependencies & requirements (Node, pnpm, Playwright/Grafana/Prometheus).
- Sempurnakan API docs:
  - Daftar endpoint, contoh request/response, status dan error codes, rate limiting, dan metrik (`/api/metrics/prometheus`, `/api/metrics/baseline`, `/api/health`).
  - Cantumkan skema dan batasan payload untuk upload, workflows, knowledge search, alerts/notifications.

## Checklist Production‑Ready
- Monitoring & alerting aktif, dashboard menampilkan data nyata.
- Health checks lulus (readiness/liveness).
- Error handling konsisten, rate limiting aktif.
- Secrets aman (tanpa hard‑code), variabel lingkungan tervalidasi.
- E2E dan beban lulus dalam batas threshold.
- Rollback & backup siap, log rotasi berjalan.

## Eksekusi Bertahap
1. Aktifkan ekspor metrik sistem di API & verifikasi eksposisi Prometheus.
2. Konfigurasi Prometheus/Grafana dan buat dashboard + rule alert.
3. Verifikasi endpoint di staging (smoke + contract) dan jalankan stress test.
4. Tuntaskan README dan API docs; perbarui panduan deploy.
5. Final review, freeze, dan deploy; aktifkan pemantauan pasca‑deploy.

## Kriteria Penerimaan
- Metrik (CPU/memory/latency/error rate) tampil di Grafana dan discrape stabil.
- Alert otomatis terkirim ke Slack/Email saat melampaui threshold.
- Semua endpoint lulus verifikasi dan uji beban dalam batas normal.
- README dan API docs lengkap serta akurat.

## Risiko & Mitigasi
- False positive alert → gunakan hysteresis/debounce dan threshold adaptif.
- Overhead observability → sampling/interval efisien dan caching aman.
- Variasi traffic produksi → autoscaling dan revisi threshold berdasarkan data nyata.
- Kebocoran secrets → audit env dan gunakan secret manager.

Mohon konfirmasi untuk mengeksekusi rencana ini. Setelah disetujui, saya akan langsung menerapkan, menguji, dan menyiapkan deploy final sesuai checklist di atas.