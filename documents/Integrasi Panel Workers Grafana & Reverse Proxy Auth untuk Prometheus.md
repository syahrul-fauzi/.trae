## Konteks & Target
- Panel Workers perlu ditambahkan ke dashboard Grafana yang sudah ada agar memantau antrian BullMQ (throughput, error rate, active jobs, queue depth) dari endpoint `GET /metrics/workers`.
- Reverse proxy diperlukan untuk menambahkan header Authorization saat Prometheus melakukan scrape endpoint yang dilindungi (admin-only) dengan TLS dan pembatasan akses.

## Sumber Metrik
- Endpoint Workers: apps/api/src/api/controllers/PrometheusWorkerMetricsController.ts:7 mengekspor gauge per `queue_name`:
  - `sba_worker_throughput`, `sba_worker_error_rate`, `sba_worker_error4xx_rate`, `sba_worker_error5xx_rate`, `sba_worker_timeout_rate`, `sba_worker_queue_depth`, `sba_worker_active_jobs`
- Perhitungan metrik: apps/api/src/workers/WorkerMetricsService.ts:
  - Throughput berbasis jobs selesai (jobs/s), histogram durasi, p95/p99, depth dan active count.

## Panel Grafana (Rencana Penambahan)
- Datasource: Prometheus UID `prometheus`.
- Panel baru (ditambahkan ke `ops/grafana/dashboard-sba.json`):
  - Workers Throughput (timeseries): `sba_worker_throughput{job="sba-api"}` dengan legend `{{queue_name}}`.
  - Workers Error Rate (timeseries): `sba_worker_error_rate{job="sba-api"}` (dan 4xx/5xx/timeout sebagai seri terpisah).
  - Queue Depth (timeseries/gauge): `sba_worker_queue_depth{job="sba-api"}`.
  - Active Jobs (stat): `sba_worker_active_jobs{job="sba-api"}`.
- Opsi visual: timeseries untuk tren, gauge untuk kapasitas (depth), stat untuk nilai sekarang.
- Threshold warna: error rate >1% merah; depth di atas N per queue kuning/merah.

## Reverse Proxy Auth (Contoh Konfigurasi)
### Nginx
- Tujuan: menambahkan `Authorization: Bearer <ADMIN_TOKEN>` ke upstream API/Workers metrics.
- Contoh server TLS di port 9446:
```
map $PROM_AUTH_TOKEN $prom_auth { default ""; ~.+ "Bearer $PROM_AUTH_TOKEN"; }
server {
  listen 9446 ssl;
  server_name prometheus-api.local;
  ssl_certificate /etc/ssl/certs/fullchain.pem;
  ssl_certificate_key /etc/ssl/private/privkey.pem;
  # API Prometheus exporter
  location /metrics {
    proxy_pass http://api-internal:9464/metrics;
    proxy_set_header Authorization $prom_auth;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  # Workers exporter (admin)
  location /metrics/workers {
    proxy_pass http://api-internal:3002/metrics/workers;
    proxy_set_header Authorization $prom_auth;
    proxy_set_header Host $host;
  }
}
```
- Catatan parameter:
  - `PROM_AUTH_TOKEN`: diinjeksikan via environment (systemd `Environment=`); hindari hard-code.
  - `api-internal`: host internal API, gunakan jaringan privat.
  - Aktifkan access log/limit rate jika perlu.

### Apache (httpd)
```
PassEnv PROM_AUTH_TOKEN
<VirtualHost *:9446>
  ServerName prometheus-api.local
  SSLEngine on
  SSLCertificateFile /etc/ssl/certs/fullchain.pem
  SSLCertificateKeyFile /etc/ssl/private/privkey.pem
  ProxyRequests Off
  <Location /metrics>
    RequestHeader set Authorization "Bearer ${PROM_AUTH_TOKEN}"
    ProxyPass http://api-internal:9464/metrics
    ProxyPassReverse http://api-internal:9464/metrics
  </Location>
  <Location /metrics/workers>
    RequestHeader set Authorization "Bearer ${PROM_AUTH_TOKEN}"
    ProxyPass http://api-internal:3002/metrics/workers
    ProxyPassReverse http://api-internal:3002/metrics/workers
  </Location>
</VirtualHost>
```
- Pastikan modul `mod_proxy`, `mod_headers`, `mod_ssl` aktif.

### Firewall
- Batasi akses hanya dari IP Prometheus:
```
iptables -A INPUT -p tcp -s <PROMETHEUS_IP> --dport 9446 -j ACCEPT
iptables -A INPUT -p tcp --dport 9446 -j DROP
```
- Alternatif: Security Group/ACL di cloud, atau allowlist CIDR Prometheus.

## Keamanan & Kompatibilitas
- Keamanan: token admin disimpan sebagai env di reverse proxy (bukan file repo); gunakan TLS; batasi akses IP; logging minimal berisi metadata.
- Kompatibilitas: dashboard untuk Grafana 9/10, Prometheus 2.43+; metrik gauge tidak perlu `rate()` (gunakan langsung), histogram tetap via API HTTP metrics.

## Dokumentasi Implementasi & Troubleshooting
- Dokumentasi akan ditambahkan:
  - `ops/grafana/dashboard-sba.json`: panel Workers dengan deskripsi dan variabel.
  - `ops/proxy/nginx-prometheus-auth.conf` dan `ops/proxy/apache-prometheus-auth.conf` + `ops/proxy/README.md`.
- Troubleshooting:
  - 401/403: pastikan token valid dan role admin.
  - 5xx: cek upstream/API health dan firewall.
  - Panel kosong: verifikasi scrape job dan label `job`, `queue_name`.

## Langkah Setelah Disetujui
1. Tambahkan panel Workers ke dashboard JSON dan commit.
2. Tambahkan file contoh konfigurasi reverse proxy (Nginx/Apache) dan README.
3. Uji end-to-end: Prometheus → Reverse Proxy → API/Workers; Grafana memvisualisasi data.
4. Tambah alert untuk queue depth dan error rate Workers bila diperlukan.
