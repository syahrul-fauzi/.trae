## Ruang Lingkup
- Memverifikasi fungsionalitas inti, integrasi antar modul (Web ↔ API ↔ Workers ↔ DB/Redis), alur kerja pengguna end‑to‑end, edge cases, performa, keamanan, dan UX.
- Mendokumentasikan hasil pengujian, bug, dan solusi; memastikan aplikasi memenuhi kriteria penerimaan.

## Uji Fungsionalitas Utama
- Identifikasi fitur inti: login/auth, dashboard metrics/alerts, uploads, workflows, knowledge search, notifications, admin worker metrics.
- Buat kasus uji per fitur: input valid, invalid, empty, over‑limit.
- Verifikasi respons dan UI sesuai spesifikasi (status, payload, rendering, aksesibilitas dasar).

## Uji Integrasi Antar Modul
- Alur Web → API → Workers → DB/Redis dengan trace ID dan headers konsisten.
- Validasi integrasi observability: `/metrics`, `/metrics/workers`, `/api/metrics/prometheus` terscrape dan terbaca di Grafana.
- Cek cache dan rate limiting seragam; periksa error handling lintas lapisan (HTTP 4xx/5xx, JSON error, timeout).

## UAT Alur Pengguna
- Skenario end‑to‑end: login → dashboard → upload → proses → alert tampil → baseline metrics verifikasi.
- Skenario admin: buka halaman admin worker metrics (`apps/web/src/app/admin/worker-metrics/page.tsx`), pantau queue depth/active jobs.
- Checklist acceptance per langkah (expected hasil, waktu muat, interaksi UI).

## Edge Cases
- Payload besar/invalid, timeouts, koneksi Redis/DB terputus sementara.
- Race conditions: penulisan baseline bersamaan, scrape saat deploy.
- RBAC: akses endpoint admin tanpa token, peran salah.

## Uji Performa
- k6 smoke/stress/soak (ops/k6/*) dengan thresholds p95<300ms, error rate<1%.
- Pantau p95/p99 via histogram `http_request_duration_ms_bucket`; identifikasi bottleneck.

## Verifikasi Keamanan
- RBAC: `/metrics` dan `/metrics/workers` hanya admin; web `/api/metrics/prometheus` dibatasi.
- Rate limiting: 429 untuk endpoint publik; input validation dan sanitasi.
- TLS dan reverse proxy untuk scrape dengan Authorization; secrets via env.
- Audit akses: log metadata (user, waktu, resource) pada endpoint admin.

## Observability & Alerting
- Prometheus: job scrape TLS (`ops/prometheus/prometheus.yml`) untuk API dan Workers.
- Alert rules: workers (queue depth, timeout) dan alerting health (Alertmanager down, delivery failures) di `ops/prometheus/alerts.yml`.
- Alertmanager: routing Slack/Email di `ops/alertmanager/alertmanager.yml` dengan templates.
- Grafana: dashboard observability dan alerting (`ops/grafana/dashboard-*.json`) menampilkan data aktual.

## Data Uji & Fixture
- Seed minimal untuk workflows/uploads; akun admin/user untuk RBAC.
- Token admin untuk reverse proxy scrape (`PROM_AUTH_TOKEN`).

## Otomasi CI/CD
- Staging verify (`.github/workflows/staging-deploy-verify.yml`):
  - promtool check config/rules, scrape TLS sample, simulasi alert, upload artefak.
- Alerting verify (`.github/workflows/alerting-verify.yml`):
  - amtool check Alertmanager config, promtool rules, simulasi verifikasi alert.
- Gate produksi (`.github/workflows/prod-deploy-gate.yml`):
  - Build→Test→Deploy staging→Approval environment production.

## Dokumentasi & Pelaporan
- Hasil pengujian: ringkasan, bukti (logs/artefak), bug dan solusi.
- Update dokumen: instalasi, konfigurasi, troubleshooting, backup/recovery.

## Kriteria Penerimaan
- Semua fungsi beroperasi tanpa error; UAT lulus.
- Performa memenuhi standar (p95<300ms, error rate<1%).
- UX sesuai desain; tidak ada blocking issues.
- Keamanan data terjamin: RBAC, rate limit, TLS/proxy, secrets aman.

## Risiko & Mitigasi
- Flakiness E2E → stabilisasi waits/retry, peningkatan timeout wajar.
- False positive alert → threshold/interval diatur; gunakan hysteresis.
- Variasi trafik → scaling dan penyesuaian thresholds berdasarkan data aktual.

Setujui rencana ini; setelah itu saya akan mengeksekusi pengujian, verifikasi observability/alerting, memperbaiki isu, dan menyajikan laporan lengkap sesuai kriteria di atas.