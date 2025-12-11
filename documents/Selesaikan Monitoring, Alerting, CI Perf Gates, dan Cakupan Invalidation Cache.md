# Selesaikan Monitoring, Alerting, CI Perf Gates, dan Cakupan Invalidation Cache

## 1) Environment Setup
- Export secrets sebelum menjalankan stack:
  - `export SMTP_PASSWORD='<smtp-password>'`
  - `export SLACK_WEBHOOK_URL='https://hooks.slack.com/services/XXX/YYY/ZZZ'`
- Jalankan aplikasi web agar Prometheus bisa scrape:
  - `pnpm -C apps/web dev &`
  - `npx wait-on http://localhost:3000`
- Jalankan monitoring stack:
  - `docker compose -f ops/monitoring/docker-compose.yml up -d`
- Verifikasi:
  - Services up: `docker compose -f ops/monitoring/docker-compose.yml ps`
  - Logs Alertmanager: `docker compose -f ops/monitoring/docker-compose.yml logs alertmanager | tail -n 50`
  - UI: Prometheus `http://localhost:9090`, Grafana `http://localhost:3003` (admin/admin), Alertmanager `http://localhost:9093`

## 2) Grafana Configuration
- Masuk ke Grafana → Alerting → Contact points
- Buat contact point untuk Email dan Slack (atau gunakan provisioning `ops/grafana/provisioning/alerting/contact-points.yml` bila tersedia)
- Pastikan datasource `prometheus` aktif dan dashboards terprovisi (`ops/grafana/provisioning/dashboards/dashboards.yml:1-10`)
- Kirim “Test notification” dari masing-masing contact point untuk uji routing

## 3) Alert Validation
- Pastikan metrik tersedia di endpoint: `/api/metrics/prometheus` (diekspos oleh apps/app)
- Simulasikan lonjakan cache miss (>0.6 selama ≥10m):
  - K6 cached search: `BASE_URL=http://localhost:3000 RATE=40 DURATION=12m QUERY=$(date +%s) TTL=5 k6 run tests/perf/knowledge_search_vs_cached.k6.js`
  - Alternatif skrip: `scripts/ops/simulate_cache_miss_spike.sh --base http://localhost:3000 --duration 12 --rate 40 --ttl 5`
- Amati pipeline:
  - Prometheus “Alerts” menampilkan `SBA_CacheMissRatioHigh` (`ops/prometheus/alert.rules.yml`)
  - Grafana Alerting menampilkan alert aktif; contact points mengirim notifikasi
  - Alertmanager UI menampilkan alert firing
- Pastikan notifikasi terkirim ke email dan Slack

## 4) Performance Testing (CI)
- Jalankan suite kinerja:
  - `BASE_URL=http://localhost:3000 RATE=20 DURATION=5m QUERY=performance TTL=5 k6 run tests/perf/knowledge_search_vs_cached.k6.js`
  - `BASE_URL=http://localhost:3000 USERS=100 DURATION=15m k6 run tests/perf/notifications_vs_workflows.k6.js`
- Hasil dan artefak:
  - Summary JSON: `artifacts/perf/*.summary.json`
  - Charts PNG: `docs/performance/assets/search-vs-cached-*.png`, `docs/performance/assets/notif-workflows-*.png`
- Gates CI (otomatis via `.github/workflows/perf-benchmark.yml`):
  - Cached search p95 < 500ms; error rate < 1%
  - Notifications/workflows p95 < 700ms; error rate < 1%
  - Build gagal jika melanggar ambang

## Referensi File
- Docker Compose: `ops/monitoring/docker-compose.yml`
- Prometheus scrape & rules: `ops/prometheus/prometheus.yml`, `ops/prometheus/alert.rules.yml`
- Alertmanager: `ops/alertmanager/config.yml`
- Grafana dashboards: `ops/grafana/dashboards/cache-effectiveness.json`, `ops/grafana/dashboards/sba-web-health.json`
- Metrics Registry: `apps/app/src/shared/metrics-registry.ts:185-212`
- Ops Runbook: `docs/ops/README.md`

## Catatan
- Pastikan secrets (`SMTP_PASSWORD`, `SLACK_WEBHOOK_URL`) sudah diekspor sebelum menjalankan stack.
- Jika alert tidak muncul, cek Prometheus targets (UP), validasi datasource Grafana, dan ulangi simulasi miss.
