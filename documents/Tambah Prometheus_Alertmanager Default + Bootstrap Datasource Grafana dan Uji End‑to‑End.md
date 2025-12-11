## Tujuan
- Menyediakan konfigurasi default `prometheus.yml` dan `alertmanager.yml` untuk stack monitoring.
- Menambahkan skrip provisioning datasource Grafana agar otomatis terpasang saat container naik.
- Melakukan uji end‑to‑end di dalam container (health checks, query, dan verifikasi datasource).

## Berkas yang Ditambahkan
- `ops/monitoring/prometheus.yml` — konfigurasi global, scrape jobs, rule_files, dan alerting.
- `ops/monitoring/alertmanager.yml` — route/receiver default, grouping, dan health endpoint.
- `ops/monitoring/grafana/provisioning/datasources/datasource.yml` — datasource Grafana Prometheus.
- (Opsional) `ops/monitoring/grafana/provisioning/dashboards/*.json` — provisioning dashboard (dapat menunjuk ke `docs/grafana/dashboard-worker-latency.json`).

## Isi Prometheus (prometheus.yml)
- Konfigurasi global:
```yaml
global:
  scrape_interval: 10s
  evaluation_interval: 30s
  external_labels:
    monitor: 'sba-monitor'
rule_files:
  - /etc/prometheus/recording_rules.yml
alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']
```
- Scrape jobs:
```yaml
scrape_configs:
  - job_name: 'sba-api-exporter'
    static_configs:
      - targets: ['api.internal:9464']
  - job_name: 'sba-workers'
    metrics_path: /metrics/workers
    static_configs:
      - targets: ['api.internal:3003']
  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
```
- Catatan: `api.internal` dapat disesuaikan (lokal: `host.docker.internal` atau IP host).

## Isi Alertmanager (alertmanager.yml)
- Route & receiver default (no‑op webhook/email placeholder yang aman):
```yaml
global:
  resolve_timeout: 5m
route:
  receiver: 'default'
  group_by: ['alertname','instance']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
receivers:
  - name: 'default'
    webhook_configs:
      - url: 'http://localhost:9000/webhook' # placeholder; aman karena tidak aktif
        send_resolved: true
```
- (Opsional) inhibit_rules dapat ditambahkan nanti (mis. menahan alert low‑level jika alert high‑level aktif).

## Grafana Provisioning (datasource.yml)
- Struktur folder: `ops/monitoring/grafana/provisioning/datasources/datasource.yml`
```yaml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    editable: true
```
- (Opsional) Provisioning dashboard:
```yaml
apiVersion: 1
datasources: []
# Tambahkan file dashboards di ops/monitoring/grafana/provisioning/dashboards/ lalu mount ke /etc/grafana/provisioning/dashboards
```

## Integrasi Docker Compose
- Update `ops/monitoring/docker-compose-monitoring.yml`:
  - Prometheus: sudah mem‑mount `./prometheus.yml` dan `./recording_rules.yml`.
  - Alertmanager: sudah mem‑mount `./alertmanager.yml`.
  - Grafana: tambahkan mount provisioning:
    - `./grafana/provisioning:/etc/grafana/provisioning:ro`
- Environment Grafana untuk admin sudah diatur; datasource akan otomatis dibuat saat start.

## Uji End‑to‑End dalam Container
1. Jalankan stack:
   - `docker compose -f ops/monitoring/docker-compose-monitoring.yml up -d`
2. Health checks:
   - Prometheus: `curl http://localhost:9090/-/ready`
   - Alertmanager: `curl http://localhost:9093/-/ready`
   - Grafana: `curl http://localhost:3003/api/health`
   - Node Exporter: `curl http://localhost:9100/metrics | head -n 5`
3. Verifikasi rules:
   - Buka Prometheus → Status → Rules → pastikan grup `node-system` dan `worker-latency` ada.
4. Query cepat:
   - `node:cpu_usage_percent:5m`
   - `job:sba_worker_latency_p95_seconds:15m`
   - `histogram_quantile(0.95, sum by (le,queue_name) (rate(sba_worker_processing_duration_seconds_bucket[15m])))`
5. Verifikasi Grafana datasource:
   - `GET http://localhost:3003/api/datasources` → pastikan data source Prometheus terdaftar.
6. (Opsional) Import dashboard `docs/grafana/dashboard-worker-latency.json` via UI Grafana.

## Keamanan & Performa
- Jangan menaruh kredensial sensitif dalam berkas; gunakan env atau secret management bila perlu.
- Port publik dapat dibatasi via firewall jika diperlukan.
- `scrape_interval: 10s` memberikan granularitas tinggi; gunakan recording rules untuk mengurangi beban query historis.

## Deliverables
- `ops/monitoring/prometheus.yml`
- `ops/monitoring/alertmanager.yml`
- `ops/monitoring/grafana/provisioning/datasources/datasource.yml`
- Uji E2E sesuai langkah di atas, dengan catatan hasil health check dan query.

## Permintaan Konfirmasi
- Jika struktur folder (`ops/monitoring/*`) dan target host (`api.internal`) sesuai, saya akan menambahkan berkas‑berkas di atas, memperbarui mount Grafana untuk provisioning, lalu menjalankan uji end‑to‑end dan melaporkan hasilnya.