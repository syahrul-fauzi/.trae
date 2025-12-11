# Tujuan
- Menyelesaikan semua pekerjaan tersisa: CI/CD, penguatan pengujian metrik, dan verifikasi e2e tanpa flakiness.
- Menjaga standar: otomatisasi, konsistensi kode, a11y, observability, dan kualitas build.

# Item Tertunda (Temuan)
- CI GitHub Actions belum ada di root repo (`.github/workflows/*`).
- Assertion metrik masih lemah pada beberapa test (hanya cek teks `# HELP|# TYPE`).
- E2E upload sudah melakukan `/api/metrics/ingest` namun belum memverifikasi hasil di `/api/metrics/prometheus`.
- Playwright config tersedia; perlu standarisasi base URL dan server reuse lintas apps.

# Rencana Implementasi
- Tambah workflow CI di root `.github/workflows/ci.yml`:
  - Setup Node + pnpm cache; `pnpm install --frozen-lockfile`.
  - Jobs: lint, type-check, unit test, build, e2e (apps/web dan apps/app) dengan `npx playwright install --with-deps`.
  - Publikasi artefak: laporan HTML/JUnit, trace/screenshots.
  - Matrix OS/node jika diperlukan; minimal Ubuntu latest.
- Perkuat assertion metrik:
  - `apps/web/e2e/chat-upload.spec.ts`: setelah ingest, lakukan GET ke `/api/metrics/prometheus`; assert token `k6_http_req_duration_ms_bucket`, `..._sum`, `..._count`, dan `k6_http_reqs_total` meningkat.
  - `apps/web/src/app/api/health/metrics/__tests__/route.integration.test.ts`: assert nama metrik `web_health_request_duration_seconds` dengan `_bucket`, `_sum`, `_count`, dan label wajib (route, method).
  - `apps/app/src/__tests__/metrics-route.spec.ts`: tambah assert untuk `sba_latency_p95_seconds`, `sba_latency_p99_seconds`, `sba_error_rate_percent`, `sba_throughput_rps`, serta histogram dari registry.
- Standarisasi Playwright:
  - Pastikan `webServer` menggunakan build+start ketika non-dev, `reuseExistingServer: true`, base URL via env `BASE_URL`/`NEXT_PUBLIC_APP_URL` konsisten.
  - Reporter: `list`, `html`, `junit` untuk CI.
- Verifikasi session API test:
  - Audit `apps/api/src/__tests__/sessions.supertest.spec.ts` agar tidak bergantung env eksternal (Redis/DB); gunakan stub/in-memory jika belum.
  - Tambah cek tenant header dan expiry deterministik untuk mengurangi flakiness.
- Dokumentasi & a11y:
  - Lengkapi catatan pengujian metrik: alasan, cara kerja assertion, dan panduan debug ketika gagal.
  - Review halaman global `error/not-found/loading` dan landmark ARIA di halaman dashboard/chat.

# Langkah Validasi
- Jalankan lint, type-check, unit test, build secara lokal.
- Jalankan Playwright e2e lintas browser dengan server reuse; kumpulkan artefak.
- Inspect output `/api/metrics/prometheus` untuk memastikan `_bucket`, `_sum`, `_count` muncul sesuai ingest.

# Output & Kualitas
- Workflow CI fungsional, artefak tersedia.
- Test metrik dan e2e kokoh, assertion jelas dengan label konsisten.
- Build Next.js stabil dan Playwright terstandardisasi.

# Catatan Implementasi
- Tidak mengubah kontrak API; hanya menambah verifikasi dan otomatisasi.
- Menjaga konsistensi penamaan metrik (`*_bucket`, `*_sum`, `*_count`, `*_total`).
- Hindari dependensi rahasia; gunakan stub saat test.