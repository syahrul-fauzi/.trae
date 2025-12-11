## Tujuan
- Menyediakan paket monitoring siap pakai (Prometheus, Grafana, Alertmanager, Node Exporter) dengan recording rules untuk metrik sistem dan metrik aplikasi (worker latency).
- Mendukung granularitas data 10 detik, p95/p99 berbasis PromQL, serta visualisasi historis.

## Struktur Berkas
- ops/monitoring/recording_rules.yml — recording rules Prometheus.
- ops/monitoring/docker-compose-monitoring.yml — stack monitoring.
- ops/monitoring/README.md — cara menjalankan, akses dashboard, verifikasi.
- (Menggunakan prometheus.yml yang sudah ada; jika belum: tambahkan minimal config dan mount ke container Prometheus.)

## Recording Rules (Isi Utama)
- Kelompok sistem (Node Exporter):
```yaml
# ops/monitoring/recording_rules.yml
groups:
  - name: node-system
    interval: 1m
    rules:
      # CPU usage total (%) — exclude idle mode, rata-rata 5m
      - record: node:cpu_usage_percent:5m
        expr: 100 * (1 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[5m])))
        # Mengukur persentase penggunaan CPU; gunakan rate 5m untuk smoothing.

      # Memory usage (%) — MemUsed/Total
      - record: node:memory_usage_percent:5m
        expr: 100 * (1 - (avg by (instance) (node_memory_MemAvailable_bytes)) / avg by (instance) (node_memory_MemTotal_bytes))
        # Persentase memori terpakai, dihitung dari MemAvailable/Total.

      # Network RX/TX bytes per second — per interface
      - record: node:network_receive_bytes_per_second:5m
        expr: sum by (instance, device) (rate(node_network_receive_bytes_total[5m]))
        # Throughput RX per detik per device.

      - record: node:network_transmit_bytes_per_second:5m
        expr: sum by (instance, device) (rate(node_network_transmit_bytes_total[5m]))
        # Throughput TX per detik per device.
```
- Kelompok aplikasi (Worker latency):
```yaml
  - name: worker-latency
    interval: 1m
    rules:
      # Bucket rate teragregasi 5m per antrean
      - record: job:sba_worker_processing_duration_seconds_bucket:rate5m
        expr: sum by (le, queue_name) (rate(sba_worker_processing_duration_seconds_bucket[5m]))
        # Dasar untuk histogram_quantile.

      # p95/p99 berbasis recording rules dari bucket 5m
      - record: job:sba_worker_latency_p95_seconds:15m
        expr: histogram_quantile(0.95, job:sba_worker_processing_duration_seconds_bucket:rate5m)
        # p95 per antrean (window efektif 5m; direkam tiap 1m). 

      - record: job:sba_worker_latency_p99_seconds:15m
        expr: histogram_quantile(0.99, job:sba_worker_processing_duration_seconds_bucket:rate5m)
        # p99 per antrean.

      # RPS per antrean sebagai referensi 
      - record: job:sba_worker_throughput_rps:5m
        expr: sum by (queue_name) (rate(sba_worker_processing_duration_seconds_count[5m]))
        # Banyak job selesai per detik, proxy throughput.
```

## Docker Compose (Isi Utama)
```yaml
# ops/monitoring/docker-compose-monitoring.yml
version: "3.9"
services:
  prometheus:
    image: prom/prometheus:latest
    container_name: prometheus
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.retention.time=15d
      - --web.enable-lifecycle
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - ./recording_rules.yml:/etc/prometheus/recording_rules.yml:ro
      - prometheus-data:/prometheus
    environment:
      - TZ=UTC
    ports:
      - "9090:9090"
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:9090/-/ready"]
      interval: 30s
      timeout: 5s
      retries: 3
    networks:
      - monitoring-net

  grafana:
    image: grafana/grafana:latest
    container_name: grafana
    environment:
      - GF_SECURITY_ADMIN_USER=admin
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_SERVER_ROOT_URL=http://localhost:3003
      - TZ=UTC
    volumes:
      - grafana-data:/var/lib/grafana
    ports:
      - "3003:3000"
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    depends_on:
      prometheus:
        condition: service_healthy
    networks:
      - monitoring-net

  alertmanager:
    image: prom/alertmanager:latest
    container_name: alertmanager
    command:
      - --config.file=/etc/alertmanager/alertmanager.yml
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro
      - alertmanager-data:/alertmanager
    ports:
      - "9093:9093"
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:9093/-/ready"]
      interval: 30s
      timeout: 5s
      retries: 3
    networks:
      - monitoring-net

  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    pid: host
    network_mode: host
    command:
      - --path.rootfs=/host
    volumes:
      - /:/host:ro,rslave
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:9100/metrics"]
      interval: 30s
      timeout: 5s
      retries: 3
    restart: unless-stopped

volumes:
  prometheus-data:
  grafana-data:
  alertmanager-data:

networks:
  monitoring-net:
    driver: bridge
```

## Prometheus Config (Integrasi Recording Rules)
- Pastikan `prometheus.yml` memuat `rule_files`:
```yaml
rule_files:
  - "/etc/prometheus/recording_rules.yml"
```
- Scrape jobs minimal (contoh):
```yaml
scrape_configs:
  - job_name: "sba-api-exporter"
    scrape_interval: 10s
    static_configs:
      - targets: ["api.internal:9464"]
  - job_name: "sba-workers"
    scrape_interval: 10s
    metrics_path: "/metrics/workers"
    static_configs:
      - targets: ["api.internal:3003"]
  - job_name: "node"
    scrape_interval: 10s
    static_configs:
      - targets: ["localhost:9100"]
```

## Dokumentasi (ops/monitoring/README.md)
- Isi yang disiapkan:
  - Cara menjalankan:
    - `docker compose -f ops/monitoring/docker-compose-monitoring.yml up -d`
    - Pastikan `prometheus.yml` berada di `ops/monitoring/prometheus.yml` dan sudah memuat `rule_files`.
  - Akses:
    - Prometheus: `http://localhost:9090`
    - Grafana: `http://localhost:3003` (admin/admin — ubah via env)
    - Alertmanager: `http://localhost:9093`
    - Node Exporter: `http://localhost:9100/metrics`
  - Verifikasi cepat:
    - Prometheus → “Status → Rules” menampilkan group `node-system` dan `worker-latency`.
    - Query: `node:cpu_usage_percent:5m`, `node:memory_usage_percent:5m`, `job:sba_worker_latency_p95_seconds:15m`.
    - Grafana → import dashboard contoh: `docs/grafana/dashboard-worker-latency.json`.
  - Catatan performa:
    - `scrape_interval: 10s` memberi granularitas lebih tinggi; gunakan recording rules untuk mengurangi biaya query historis.
    - Atur retensi TSDB sesuai kapasitas (contoh `--storage.tsdb.retention.time=15d`).

## Dampak dan Kompatibilitas
- Tidak mengubah format metrik yang sudah ada (HELP/TYPE/label konsisten).
- Mendukung p95/p99 historis berbasis PromQL dan bucket 10 detik.
- Memungkinkan query data lama melalui naming recording rules yang stabil.

## Permintaan Konfirmasi
- Konfirmasikan struktur folder dan nama berkas (ops/monitoring/*) sesuai preferensi Anda.
- Setelah konfirmasi, saya akan membuat berkas-berkas tersebut, menambahkan contoh `prometheus.yml` jika belum ada, dan menguji stack secara lokal (health checks & queries).