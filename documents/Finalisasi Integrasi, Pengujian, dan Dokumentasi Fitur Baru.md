## Penyambungan Komponen
- Registrasikan controller Prometheus worker metrics di modul API (Nest) dan pastikan RBAC admin aktif.
- Kaitkan OrchestratorService dengan opsi provider LLM (env, model, threshold circuit breaker, retry params) yang dapat dikonfigurasi.
- Pastikan knowledge API memakai adapter `@sba/kv/cache` (Upstash) untuk semua jalur yang relevan (search, search-cached), dengan TTL sinkron mem-cache.

## Implementasi Fungsionalitas
- Orchestrator: gunakan provider OpenAI/Anthropic sesuai env; aktifkan circuit breaker + fallback; retry jitter exponential.
- WorkerMetricsService: hitung error ratio terperinci (4xx/5xx/timeout), throughput, queue depth; persist ke usage metrics.
- Endpoint Prometheus: tambah `GET /metrics/workers` berlabel `queue_name`, format teks Prometheus, dan cantumkan di OpenAPI/Swagger.

## Pengujian Menyeluruh
- Unit: adapter Upstash (TTL/batch/fallback), resiliency LLM (retry/CB/klasifikasi error), WorkerMetricsService (error class rates & throughput).
- Integrasi: knowledge routes (validasi/format/`X-Cache` hit/miss), Prometheus workers (RBAC + isi metrik/label), Orchestrator streaming.
- E2E (opsional): halaman admin konsumsi `/metrics/workers` dengan RBAC; verifikasi rendering + akses.

## Integrasi Frontend–Backend
- Tambah widget admin untuk menampilkan worker metrics (throughput, error rates, queue depth) dari endpoint baru, dengan fallback UI bila gagal.
- Pastikan semua panggilan API memakai header/auth yang sesuai dan error-handling konsisten.

## Dokumentasi & Arsitektur
- Perbarui README root: arsitektur terbaru, dependencies, setup & konfigurasi, endpoint Prometheus.
- Tambahkan/ sinkronkan diagram di `workspace/02_Architecture` (PNG/SVG, Git LFS) dengan keterangan komponen (Orchestrator↔LLM, Cache layer, Workers↔Prometheus).
- Buat Runbook operasional: troubleshooting, SLA/SLO, scaling/capacity planning.

## Kualitas & Kepatuhan
- Jalankan lint dan type-check di semua apps/packages; pastikan tidak ada secrets di log.
- Review kode internal sesuai standar (naming, typing, error handling, security headers).

Setelah Anda konfirmasi, saya akan mengimplementasikan penyambungan modul, melengkapi pengujian (unit/integrasi/E2E yang diperlukan), menambahkan widget frontend admin, serta memperbarui dokumentasi dan diagram arsitektur sesuai rencana di atas.