# Ruang Lingkup
- Menambahkan invalidasi Redis berbasis prefix untuk semua endpoint mutasi relevan.
- Menginstrumentasi cache hit/miss ke Prometheus dengan label konsisten (endpoint, method, tenant).
- Menyempurnakan unit/integrasi tests: TTL, hit/miss, invalidasi Redis, serta cakupan analytics/metrics.
- Dokumentasi perubahan dan verifikasi performa sebelum/sesudah.

# Implementasi Teknis
## 1) Invalidasi Redis Spesifik
- Key schema (tetap): `tenant:{tenantId}:json:{sha1(path|search)}` dan `tenant:{tenantId}:knowledge:{sha1(query)}`.
- Tambah helper pada adapter Redis: `scanDeleteByPrefix(prefix: string)` yang:
  - Melakukan SCAN dengan pola `prefix*` dan kumpulkan keys.
  - Jalankan DEL batch pada keys ketemu.
  - Logging jumlah keys terhapus dan durasi.
- Integrasi invalidasi pada endpoint mutasi (POST/PUT/DELETE) yang mempengaruhi data:
  - Contoh: setelah sukses update analytics/runs, panggil `scanDeleteByPrefix('tenant:{tid}:json:/api/analytics')` untuk menyingkirkan cache terkait.
  - Untuk knowledge ingestions/update, gunakan prefix `tenant:{tid}:knowledge:`.
- Backward compatibility: invalidasi hanya dijalankan bila Redis tersedia; fallback no-op di in-memory.

## 2) Instrumentasi Prometheus
- Tambah counters:
  - `cache_hit_total{endpoint,method,tenant}`
  - `cache_miss_total{endpoint,method,tenant}`
- Titik instrumentasi: di wrapper `cacheJsonResponse` dan utilitas `searchWithCache`.
- Integrasi ke exporter Prometheus:
  - Jika `prom-client` tersedia, registrasi counters global.
  - Jika tidak, akumulasi sederhana (in-memory) dan ekspos di endpoint metrics text (mengikuti format v0.0.4) bersama histogram existing.
- Konsistensi label: gunakan path endpoint (tanpa query), method (`GET`/`POST`/...), dan tenant (`dev` default saat tidak tersedia).

## 3) Penyempurnaan Test Suite
- Analytics/metrics:
  - Tambah test cache untuk `/api/analytics/metrics` (miss→hit; schema sama; TTL 30s mengeluarkan hit sebelum kadaluarsa).
- TTL tests:
  - Tambah test yang menunggu > TTL lalu menguji re-fetch (miss kembali).
- Redis invalidation tests:
  - Mock Redis client dengan kumpulan keys; uji `scanDeleteByPrefix` menghapus sesuai pola.
  - Test integrasi: jalankan mutasi, kemudian GET yang sama harus `miss` karena cache invalidated.
- Hit/miss tests:
  - Verifikasi header `X-Cache` dan counters (jika prom-client tersedia, query nilai; jika tidak, baca text exporter satuan).

## 4) Dokumentasi
- Perbarui `docs/architecture/guidelines/Cache-Expansion-Plan.md`:
  - Tambahkan bagian invalidasi Redis (prefix, pola, endpoint mutasi terkait).
  - Tambahkan bagian metrik Prometheus (nama counter, label, contoh).
- Tambah ADR baru: `ADR-015-cache-invalidation-prometheus` menjelaskan alasan teknis, alternatif, dampak.
- Perluas `workspace/_xref.md` dengan:
  - Referensi ke helper invalidasi dan titik pemanggilan di endpoint mutasi.
  - Referensi ke instrumentation metrics dan endpoint metrics text.

## 5) Verifikasi Performa
- Baseline sebelum optimasi dan sesudah optimasi dengan k6 (yang sudah tersedia):
  - Jalankan skenario baseline untuk `/api/knowledge/search` dan `/api/knowledge/search-cached`.
  - Tambahkan pengukuran untuk `/api/analytics/metrics` (dicache vs tanpa cache jika diperlukan).
- Simpan ringkasan ke JSON dan buat grafik: response time (avg/p95), throughput, error rate.
- Tempatkan grafik ke `docs/performance/assets/` dan rekap ke `docs/performance/search_vs_cached_report.md` serta `docs/performance/maintainability_report.md`.

# Rencana File & Lokasi (tanpa eksekusi saat ini)
- Adapter Redis: tambahkan `scanDeleteByPrefix` (apps/orchestrator/src/adapters/cache/redis.ts).
- Wrapper caching: instrumentasi hit/miss (apps/app/src/app/api/_lib/cache.ts dan apps/orchestrator/src/services/knowledgeCache.ts).
- Endpoint mutasi: panggil invalidasi sesuai prefix setelah operasional sukses (apps/app/src/app/api/** mutasi relevan).
- Tests baru: ditempatkan di subfolder `__tests__` berdampingan dengan route yang diuji.
- Docs: update guideline, ADR-015, dan xref.

# Backward Compatibility
- Schema respons tidak berubah; hanya menambah header `X-Cache` dan metrik.
- Invalidasi hanya aktif di Redis; fallback in-memory tetap aman.

# Risiko & Mitigasi
- Potensi over-invalidation (hapus terlalu luas): mitigasi dengan prefix spesifik dan evaluasi pola.
- Overhead SCAN pada Redis: lakukan secara terkontrol dan gunakan pola prefix yang efektif; batasi batch.
- Metrik label cardinality tinggi: batasi label endpoint ke path (tanpa query) dan tenant yang terbatas.

# Output & Keberhasilan
- Invalidasi berjalan dan terlog (jumlah keys & durasi).
- Metrik hit/miss tersedia dan konsisten.
- Tests lulus untuk TTL, hit/miss, invalidasi Redis, serta analytics/metrics.
- Grafik performa “sebelum/sesudah” menunjukkan penurunan latensi dan peningkatan throughput pada endpoint cache-heavy.
