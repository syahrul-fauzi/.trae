# Ruang Lingkup
- Memperluas invalidasi cache ke semua endpoint mutasi domain alerts, notifications, dan workflows dengan prefix konsisten.
- Menambahkan instrumentasi cache hit/miss (per endpoint/method/domain/tenant) dan mengeksposnya via web metrics text exporter kompatibel Prometheus.
- Membuat dashboard Grafana khusus untuk memvisualisasikan rasio hit/miss, total served from cache vs DB, dan tren efektivitas cache; menambah alerting saat miss ratio melewati ambang.
- Menyusun unit tests invalidasi dan load testing untuk verifikasi peningkatan performa.

# Desain Invalidation
- Skema key cache tetap: `tenant:{tenantId}:{domain}:{hash}` dengan domain: `knowledge`, `analytics`, `alerts`, `notifications`, `workflows`.
- Redis helper: gunakan `scanDeleteByPrefix(prefix)` (SCAN + DEL, COUNT 100) dengan prefix:
  - Alerts: `tenant:{tid}:alerts:`
  - Notifications: `tenant:{tid}:notifications:`
  - Workflows: `tenant:{tid}:workflows:`
- Integrasi pada endpoint mutasi (POST/PUT/DELETE): panggil invalidasi setelah operasi sukses:
  - Alerts: `/api/alerts` (create/update/delete)
  - Notifications: `/api/notifications`, `/api/notifications/[id]`
  - Workflows: `/api/workflows`, `/api/workflows/[id]`
- Fallback: bila Redis tidak tersedia (InMemory), invalidasi bulk menjadi no‑op; kompatibilitas dijaga.

# Instrumentasi Prometheus
- Counters baru:
  - `cache_hit_total{endpoint,method,domain,tenant}`
  - `cache_miss_total{endpoint,method,domain,tenant}`
- Titik instrumentasi:
  - Wrapper `cacheJsonResponse` (GET JSON) — set label otomatis dari `pathname` (endpoint), method `GET`, dan domain (diturunkan dari path prefix: `/api/alerts`, `/api/notifications`, `/api/workflows`, dll.).
  - Utilitas `searchWithCache` — set domain sesuai (`knowledge`).
- Konsistensi label: endpoint tanpa query, method huruf kapital, domain salah satu set yang ditentukan, tenant default `dev` bila tidak ada.
- Fallback saat `prom-client` tidak tersedia: koleksi in‑memory counters dan ekspor manual di endpoint metrics text.

# Web Metrics Text Exporter
- Perluas endpoint metrics text (mis. `/api/health/metrics` atau `/api/metrics/prometheus`) untuk menyertakan:
  - `# HELP cache_hit_total` dan `# TYPE cache_hit_total counter`
  - Baris per kombinasi label: `cache_hit_total{endpoint="/api/alerts",method="GET",domain="alerts",tenant="dev"} <value>`
  - Demikian pula untuk `cache_miss_total`.
- Pastikan format mengikuti eksposisi Prometheus v0.0.4.

# Grafana
- Dashboard baru: `Cache Effectiveness` dengan panel:
  - Rasio hit/miss per endpoint: `sum(rate(cache_hit_total[5m])) / (sum(rate(cache_hit_total[5m])) + sum(rate(cache_miss_total[5m])))` oleh endpoint.
  - Total request served from cache vs database (per domain): hit vs miss stacked bar.
  - Tren efektifitas cache: time series `rate(cache_hit_total[5m])` dan `rate(cache_miss_total[5m])`.
- Alerting:
  - Trigger bila miss ratio > 0.6 selama 10m untuk endpoint/domain tertentu.

# Unit & Integration Tests
- Invalidation:
  - Mock Redis client dengan keys yang cocok prefix; uji `scanDeleteByPrefix` menghapus sesuai pola untuk alerts/notifications/workflows.
  - Test integrasi: jalankan mutasi, kemudian GET yang sama → harus `miss` karena cache invalidated.
- TTL:
  - Test menunggu > TTL lalu memverifikasi miss kembali.
- Hit/miss:
  - Verifikasi `X-Cache` dan, jika memungkinkan, counters bertambah (baca text exporter atau mock prom-client).
- Analytics/metrics:
  - Tambah test untuk skenario serupa heatmap/charts: schema preservasi dan header `X-Cache`.

# Load Testing
- K6/Artillery skenario tambahan untuk `/api/alerts`, `/api/notifications`, `/api/workflows` (GET intensif) dengan cache aktif.
- Durasi minimal 5 menit, skenario baseline (constant‑arrival) dan spike (ramping).
- Simpan ringkasan JSON dan generate grafik (response time avg/p95, throughput, miss ratio) ke `docs/performance/assets/`.

# Perubahan & Lokasi Kode (Rencana)
- Adapter Redis: perluas helper invalidasi; jangan ubah kontrak `CacheAdapter`.
- Wrapper cache: tambah label domain otomatis dari path; instrumentasi counters hit/miss.
- Endpoint mutasi: panggil invalidasi prefix setelah sukses (alerts/notifications/workflows).
- Web metrics exporter: tambahkan bagian counters cache dalam output.
- Grafana: tambah dashboard JSON `ops/grafana/dashboards/cache-effectiveness.json` dan alert rules.
- Tests: tambah file di `apps/app/src/app/api/<domain>/**/__tests__` untuk invalidasi, TTL, hit/miss.
- Docs: update guideline dan tambahkan referensi di `workspace/_xref.md`.

# Kompatibilitas & Risiko
- Schema respons tidak diubah; hanya header/metrics internal.
- Risiko over‑invalidation: mitigasi dengan prefix yang spesifik, dokumentasi, dan audit.
- Risiko cardinality label: batasi label ke endpoint path, method, domain, tenant.

# Output & Keberhasilan
- Invalidasi otomatis di mutasi alerts/notifications/workflows.
- Metrics cache hit/miss tersedia dan tervisualisasi di Grafana; alerting aktif.
- Tests lulus; load testing menunjukkan peningkatan latensi dan throughput pada rute cache‑heavy.
