## Lingkup Pekerjaan Tertunda
- Buat dokumen panduan validasi monitoring.
- Provisioning contact points Grafana via YAML (Slack/Email) dan pemetaan alert Prometheus.
- Tambahkan skrip simulasi lonjakan cache miss dengan artefak keluaran.
- Jalankan dan dokumentasikan sequence validasi komprehensif end-to-end.

## Implementasi
- Dokumen Panduan Validasi
  - Lokasi: `docs/ops/Monitoring-Validation-Guide.md`.
  - Konten: pra-syarat secrets/env, cara start stack (`ops/monitoring/docker-compose.yml` atau `monitoring/docker-compose.yml`), verifikasi endpoint metrics (`apps/app/src/app/api/metrics/prometheus/route.ts`, `apps/web/src/app/api/health/metrics/route.ts`), prosedur simulasi spike, observasi yang diukur, cara ambil screenshot, cara paket artefak.
  - Referensi dashboard: `ops/grafana/dashboards/cache-effectiveness.json`, `ops/grafana/dashboards/sba-web-health.json`.

- Grafana Contact Points & Alerting
  - Lokasi provisioning: `ops/grafana/provisioning/contact-points.yml` dan `ops/grafana/provisioning/alerting/rules.yml`.
  - Pemetaan alert Prometheus `SBA_CacheMissRatioHigh` dari `ops/prometheus/alert.rules.yml` ke contact points (Slack webhook `SLACK_WEBHOOK_URL`, Email SMTP `SMTP_PASSWORD`).
  - Sinkronisasi dengan Alertmanager: `ops/monitoring/alertmanager.yml` untuk routing akhir.
  - Verifikasi: Grafana memuat contact points dan rules, alert firing dari query rasio miss (>0.6/10m) terlihat di Grafana & terkirim via Alertmanager.

- Skrip Simulasi Lonjakan Cache Miss
  - Lokasi: `scripts/ops/simulate_cache_miss_spike.sh`.
  - Fungsi: generate traffic GET ke endpoint yang di-cache tanpa hit cache, lakukan invalidasi berkala agar miss tetap tinggi; dukung parameter `--base-url`, `--tenant`, `--duration`, `--rps`.
  - Output: direktori `artifacts/ops/spike-<timestamp>/` berisi log, JSON ringkasan, dan daftar request gagal.

- Integrasi CI (opsional, non-blocking)
  - Tambahkan job ops-validate di `.github/workflows/perf-benchmark.yml` yang dapat memanggil skrip spike secara manual atau guarded.
  - Evaluasi hasil (miss ratio, error rate) tanpa menggagalkan build default; gunakan gates terpisah jika diperlukan.

## Verifikasi & QA
- Metrics & Instrumentasi
  - Pastikan counter tersedia: `apps/app/src/shared/metrics-registry.ts` (`cache_hit_total`, `cache_miss_total`, `sba_cache_invalidations_total`).
  - Pastikan instrumentasi dipanggil: `apps/app/src/app/api/_lib/cache.ts`, `apps/app/src/app/api/notifications/route.ts`, `apps/app/src/app/api/workflows/[id]/route.ts`.
  - Scrape configs: `ops/prometheus/prometheus.yml` mengarah ke endpoint metrics.

- Dashboard & Alerts
  - Panel rasio hit/miss, invalidations, per-tenant: `ops/grafana/dashboards/cache-effectiveness.json`.
  - Alert firing diverifikasi selama spike; resolves setelah beban turun; routing via Alertmanager sesuai `ops/monitoring/alertmanager.yml`.

- Tests & Stabilitas
  - Jalankan unit/integration: invalidation tests di `apps/app/src/app/api/notifications/__tests__/route.invalidation.test.ts` dan `apps/app/src/app/api/workflows/[id]/__tests__/route.invalidation.test.ts`.
  - Jalankan API test: `apps/api/src/__tests__/sessions.supertest.spec.ts`.
  - Pastikan k6 perf tests lolos ambang: `tests/perf/knowledge_search_vs_cached.k6.js`, `tests/perf/notifications_vs_workflows.k6.js` dan artefak di `artifacts/perf/`.

## Dokumentasi & Artefak
- Simpan screenshot sebelum/saat/sesudah spike ke `docs/ops/assets/`.
- Simpan ringkasan spike ke `artifacts/ops/spike-<timestamp>/`.
- Buat laporan singkat `docs/ops/Validation-Report-<date>.md` merangkum hasil, grafik, dan status alert.

## Kriteria Penerimaan
- Tiga tugas tertunda selesai dan terverifikasi.
- Dashboards menampilkan metrik yang benar; alert memicu saat spike dan kembali normal.
- Perf gates di CI tetap hijau untuk skenario cached dan domain notifications/workflows.
- Dokumentasi prosedur lengkap, dapat diulang oleh tim ops/dev.
