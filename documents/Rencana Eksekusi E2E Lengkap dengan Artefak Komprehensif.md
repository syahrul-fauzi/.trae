## Prasyarat & Persiapan
- Pastikan tidak ada dev server lain yang berjalan pada port target (3001) untuk menghindari konflik.
- Gunakan base URL `http://localhost:3001` dan lewati webServer internal Playwright agar sinkron dengan Next dev.
- Variabel lingkungan: `PLAYWRIGHT_SKIP_WEBSERVER=true`, `PLAYWRIGHT_BASE_URL=http://localhost:3001`.

## Langkah 1: Mulai Server Pengembangan
- Perintah: `pnpm -C apps/app dev -p 3001`
- Verifikasi siap: akses `http://localhost:3001/api/health` sampai status `200`.

## Langkah 2: Eksekusi Suite Playwright dengan Artefak Lengkap
- Perintah:
  - `PLAYWRIGHT_SKIP_WEBSERVER=true PLAYWRIGHT_BASE_URL=http://localhost:3001 npx playwright test --reporter=list,html,junit,json --trace on --video on --screenshot on`
- Konfigurasi aktif (playwright.config.ts):
  - Global setup/teardown untuk login/logout otomatis
  - Reporter: list, html, json (output `test-results/results.json`), junit (output `test-results/junit.xml`)
  - Trace `on-first-retry` (dapat dipaksa `--trace on` via CLI), screenshot/video diaktifkan

## Langkah 3: Cakupan Skenario, Monitoring, Penanganan Error
- Cakupan: jalankan seluruh berkas `e2e/**/*.spec.ts` tanpa filter (kecuali env memerlukan subset awal, kemudian re-run full).
- Monitoring real-time: gunakan reporter `list` untuk progres di terminal; inspeksi tampilan HTML report setelah selesai.
- Penanganan error: aktifkan trace & video, tinjau `trace.zip` dan rekaman untuk setiap kegagalan; gunakan log di `playwright-report`.

## Langkah 4: Pengumpulan & Organisasi Artefak
- Laporan:
  - HTML: `apps/app/playwright-report/index.html`
  - JUnit XML: `apps/app/test-results/junit.xml`
  - JSON: `apps/app/test-results/results.json`
- Artefak media:
  - Screenshot: `apps/app/test-results/*/*.png`
  - Video: `apps/app/test-results/*/*.webm`
  - Trace: `apps/app/test-results/*/trace.zip`

## Langkah 5: Verifikasi Struktur Direktori
- Pastikan direktori berikut ada dan terisi:
  - `apps/app/playwright-report/`
  - `apps/app/test-results/` (berisi `junit.xml`, `results.json`, screenshot, video, trace)
- Dokumentasikan lokasi artefak di README untuk akses cepat.

## Mitigasi Risiko
- Konflik port: ubah ke port lain (mis. 3002) dan set `PLAYWRIGHT_BASE_URL` sesuai.
- Flakiness awal: re-run dengan `--workers=1` pada CI, pertahankan `retries=2` (sudah dikonfigurasikan untuk `CI`).
- Jika ada rute yang belum siap, jalankan subset stabil (`*-meta.spec.ts`, `*-a11y.spec.ts`) dulu, lalu jalankan full suite.

## Output & Pelaporan
- Setelah eksekusi:
  - Buka report HTML via `pnpm -C apps/app test:e2e:report`
  - Lampirkan `junit.xml` dan `results.json` untuk CI/analisis.
  - Arsipkan folder `test-results/` untuk debug (trace + media).
