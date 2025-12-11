## Ruang Lingkup
- Menjalankan ulang seluruh test relevan: unit, integration, dan end‑to‑end (E2E) untuk apps/api, apps/web, apps/app, serta packages terkait.
- Menghasilkan laporan terstruktur (pass/fail, artifacts, log) dan analisis regresi.

## Persiapan Lingkungan
- Install dependensi workspace: `pnpm install`.
- Typecheck menyeluruh: `pnpm -r run typecheck`.
- Konfigurasi env minimum untuk E2E web/app:
  - `BASE_URL=http://localhost:3000` (web)
  - `PLAYWRIGHT_SKIP_WEBSERVER=true` (gunakan dev server yang berjalan)
  - Disable telemetry pada web (sudah di config), siapkan token untuk `/metrics/workers` bila diperlukan.
- Jalankan dev server lokal:
  - `pnpm -C apps/web dev --port 3000`
  - (opsional) `PORT=3002 pnpm -C apps/app dev` jika dibutuhkan.

## Eksekusi Test
### API (apps/api)
- Unit/Integration: `pnpm -C apps/api exec vitest run --reporter=dot`.
- E2E (bila ada config): `pnpm -C apps/api exec vitest run -c vitest.e2e.config.ts --reporter=dot`.
- Artifacts: hasil reporter dot + coverage (opsional `--coverage`).

### Web (apps/web)
- E2E penuh: `PLAYWRIGHT_SKIP_WEBSERVER=true BASE_URL=http://localhost:3000 pnpm -C apps/web exec playwright test --project=chromium --reporter=list`.
- Suite prioritas (opsional untuk stabilitas): filter file: `pnpm -C apps/web exec playwright test e2e/metrics-smoke.spec.ts e2e/metrics-baseline.spec.ts e2e/health-perf.spec.ts e2e/dashboard-console.spec.ts --project=chromium --reporter=list`.
- Artifacts: `playwright-report/html`, `playwright-report/json/results.json`, video, trace.

### App (apps/app)
- E2E penuh/pilihan: `BASE_URL=http://localhost:3001 PLAYWRIGHT_SKIP_WEBSERVER=true pnpm -C apps/app exec playwright test --project=chromium --reporter=list`.
- Jika port 3001 terpakai, gunakan `PORT=3002` untuk dev server.

### Packages (opsional)
- Packages yang memiliki unit tests: `pnpm -C packages/<pkg> test`.

## Pengumpulan & Dokumentasi Hasil
- Kumpulkan artifacts:
  - Playwright: screenshots, video, traces, JSON, HTML report.
  - Vitest: output dot/coverage.
- Buat ringkasan eksekusi:
  - Total suites, pass/fail, flaky (jika ada), durasi.
  - Daftar test gagal + error singkat.
- Simpan log eksekusi lengkap (CLI output) di folder `ops/reports/<timestamp>/`.
- Lampirkan screenshot query monitoring (Prometheus/Grafana) bila stack aktif.

## Analisis Kegagalan & Regresi
- Identifikasi penyebab utama kegagalan (timeout navigasi, dependency backend, baseline metrics).
- Tandai area yang butuh seed/mocks dan rencana perbaikan cepat.
- Jalankan subset regresi untuk fitur yang sebelumnya hijau, pastikan tidak ada kemunduran.

## Penyesuaian & Optimasi
- BASE_URL disesuaikan dengan server aktif.
- Gunakan filter suite prioritas saat laporan stabil diperlukan.
- Tuning Playwright:
  - `--timeout` per test bila perlu, `page.waitForLoadState('domcontentloaded')` untuk stabilitas.
  - Reduced motion sudah disetel; pertahankan untuk mengurangi flakiness.

## Output yang Disediakan
- Laporan test (ringkasan, statistik, detail gagal, rekomendasi).
- Artifacts Playwright (HTML/JSON/screenshots/video/trace).
- Log eksekusi (API/Web/App test) dan, jika diminta, screenshot monitoring.
- Dokumentasi perubahan (seed/mocks yang ditambahkan, alasan teknis, dampak).

## Langkah Berikutnya
- Setelah disetujui, saya akan menjalankan semua perintah di atas, mengumpulkan artifacts, menyusun laporan, dan menyampaikan analisis regresi beserta rekomendasi perbaikan yang ditargetkan.