## Identifikasi Host Alternatif
- Opsi utama:
  - host.docker.internal (Mac/Windows, sebagian Linux)
  - Gateway Docker bridge (umum Linux): 172.17.0.1
  - Nama service di jaringan compose (mis. api:3003) jika API berjalan sebagai container dalam jaringan yang sama
- Kebijakan pemilihan:
  - Default: host.docker.internal
  - Fallback Linux: 172.17.0.1
  - Jika API ikut dalam compose: gunakan DNS service (api)

## Perubahan Konfigurasi Prometheus
- Edit ops/monitoring/prometheus.yml pada scrape_configs:
  - sba-api-exporter:
    - targets: ['host.docker.internal:9464'] (atau fallback IP)
  - sba-workers:
    - metrics_path: /metrics/workers
    - targets: ['host.docker.internal:3003']
    - Tambah autentikasi jika perlu: bearer_token_file: /etc/prometheus/secrets/admin.token (mount dari host)
  - node:
    - targets: ['localhost:9100'] (tetap)
- Tambah opsi keamanan & performa:
  - scrape_interval: 10s (tetap), scrape_timeout: 8s
  - Integrasi Alertmanager tetap
- Siapkan folder secrets:
  - ops/monitoring/secrets/admin.token (isi JWT admin untuk /metrics/workers)
  - Mount ke Prometheus container: ./secrets:/etc/prometheus/secrets:ro

## Verifikasi Teknis
- Uji konektivitas dari host:
  - curl http://host.docker.internal:9464/metrics → pastikan teks Prometheus
  - curl http://host.docker.internal:3003/metrics/workers -H "Authorization: Bearer <token>"
- Verifikasi pada container Prometheus:
  - Prometheus UI → Status → Targets harus UP untuk jobs sba-api-exporter, sba-workers
  - Query:
    - sba_worker_latency_p95_seconds{queue_name="agent_supervisor"}
    - histogram_quantile(0.95, sum by (le,queue_name) (rate(sba_worker_processing_duration_seconds_bucket[15m])))
    - process_resident_memory_bytes (validasi exporter API)
- Validasi format data:
  - Content-Type: text/plain; version=0.0.4
  - HELP/TYPE baris ada, label queue_name konsisten

## E2E Testing di Container
- Scope:
  - Health checks untuk Prometheus/Grafana/Alertmanager/Node Exporter
  - Verifikasi targets dan rules
  - Query p95/p99 & histogram
- Hasil yang akan dikirim:
  - Log health check lengkap
  - Screenshot query dan response dari Prometheus/Grafana
  - Log scraping (targets status, last scrape duration/sample)
  - Metrik performa scraping (scrape_duration_seconds, scrape_samples_scraped)

## Kompatibilitas, Keamanan, Performa
- Kompatibel dengan stack yang ada (format metrik/labels tidak berubah)
- Keamanan:
  - Gunakan bearer_token_file untuk /metrics/workers, tokens via secrets (bukan hardcode)
  - Port dapat dibatasi via firewall
- Performa:
  - scrape_interval 10s, timeout 8s, recording rules untuk query historis hemat
  - Monitoring scrape_duration_seconds untuk evaluasi beban

## Implementasi
- Update ops/monitoring/prometheus.yml sesuai host yang dipilih
- Tambah mount secrets di docker-compose-monitoring.yml untuk Prometheus
- Buat ops/monitoring/secrets/admin.token jika autentikasi diperlukan
- Jalankan stack dan lakukan verifikasi sesuai langkah di atas
- Dokumentasikan host alternatif yang dipakai (README ops)

## Permintaan Konfirmasi
- Host target yang diinginkan: host.docker.internal, 172.17.0.1, atau DNS service (api)
- Apakah autentikasi ke /metrics/workers diperlukan? Jika ya, saya akan pakai bearer_token_file dari secrets.
- Setelah Anda konfirmasi, saya akan melakukan perubahan, menjalankan E2E testing, dan melampirkan hasilnya.