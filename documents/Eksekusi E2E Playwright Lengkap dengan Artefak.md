## Mulai Server Dev
- Jalankan: `pnpm -C apps/app dev -p 3001`
- Verifikasi siap: `curl http://localhost:3001/api/health` harus `200`.

## Jalankan Suite Playwright + Artefak
- Perintah (melalui script paket app):
  - `PLAYWRIGHT_SKIP_WEBSERVER=true PLAYWRIGHT_BASE_URL=http://localhost:3001 pnpm -C apps/app test:e2e -- --trace on`
- Konfigurasi aktif:
  - Reporter: `list`, `html`, `json` (ke `test-results/results.json`), `junit` (ke `test-results/junit.xml`).
  - Trace: `on-first-retry` (ditingkatkan `--trace on` via CLI)
  - Screenshot/Video: default `only-on-failure`/`retain-on-failure` (opsional ubah sementara di `playwright.config.ts` → `screenshot: 'on'`, `video: 'on'` untuk merekam seluruh alur).

## Cakupan & Monitoring
- Tanpa filter: `e2e/**/*.spec.ts` mencakup semua skenario (meta, a11y, tools-flow, runflow, settings, dashboard, dll.).
- Monitoring real-time: reporter `list` di terminal; gunakan `playwright show-report` untuk melihat progres hasil.
- Penanganan error: aktifkan trace; inspeksi `trace.zip`, video dan screenshot dari `test-results/` saat kegagalan.

## Pengumpulan & Struktur Artefak
- Laporan:
  - HTML: `apps/app/playwright-report/index.html`
  - JUnit: `apps/app/test-results/junit.xml`
  - JSON: `apps/app/test-results/results.json`
- Media & debugging:
  - Screenshot: `apps/app/test-results/**/test-*.png`
  - Video: `apps/app/test-results/**/test-*.webm`
  - Trace: `apps/app/test-results/**/trace.zip`
- Buka HTML report: `pnpm -C apps/app test:e2e:report`

## Mitigasi & Variasi
- Konflik port: gunakan `-p 3002` dan set `PLAYWRIGHT_BASE_URL=http://localhost:3002`.
- Flakiness CI: jalankan dengan `--workers=1` dan `retries=2` (sudah ada di config untuk `CI`).
- Subset awal: jika perlu, jalankan `e2e/*-meta.spec.ts e2e/*-a11y.spec.ts` lalu full suite.

## Output Akhir
- Pastikan direktori:
  - `apps/app/playwright-report/` terisi
  - `apps/app/test-results/` berisi `junit.xml`, `results.json`, screenshot, video, trace
- Siapkan ringkasan hasil dan lampirkan artefak untuk CI/analisis.
