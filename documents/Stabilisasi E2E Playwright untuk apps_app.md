## Ringkasan Perbaikan
- Standarkan sumber kebenaran URL (PLAYWRIGHT_BASE_URL ⇄ NEXT_PUBLIC_APP_URL) dan validasi `/api/health` sebelum tes.
- Hindari override reporter via CLI; gunakan konfigurasi reporter di `playwright.config.ts` agar output konsisten.
- Tetapkan konvensi tagging Smoke dan perbaiki struktur suite agar `--grep Smoke` stabil.
- Optimalkan workers (local >1, CI =1) dan serialisasi suite rapuh.

## Langkah Implementasi
### 1) Validasi & Sinkronisasi URL
- Pastikan `PLAYWRIGHT_BASE_URL` dan `NEXT_PUBLIC_APP_URL` identik (mis. `http://localhost:3001`).
- Tambahkan validasi eksplisit di `global-setup.ts` untuk menunggu `/api/health` hingga 30–60s (exponential backoff dan logging). 
- Jika `PLAYWRIGHT_SKIP_WEBSERVER=false`, biarkan Playwright menyalakan server Next dengan `reuseExistingServer: true`; jika `true`, jalankan server secara terpisah dan dokumentasikan.

### 2) Reporter & Artefak
- Hapus `--reporter=list,html,json,junit` dari CLI pada pipeline yang memakai `apps/app/playwright.config.ts` (31–36) agar tidak menimpa `outputFile` yang sudah di-set.
- Pastikan struktur artefak: `test-results/junit.xml`, `test-results/results.json`, dan `playwright-report/` konsisten.

### 3) Tagging Smoke
- Standardisasi: awali semua suite Smoke dengan `test.describe('Smoke', ...)` atau tambahkan "@Smoke" ke judul kasus.
- Tambahkan skrip `test:e2e:smoke` yang menjalankan `playwright test --grep '(?i)smoke'` agar case-insensitive.

### 4) Workers & Paralelisme
- Local dev: `PLAYWRIGHT_WORKERS=2–4` untuk throughput, CI: tetap `1` (apps/app/playwright.config.ts:30).
- Untuk suite rapuh (SSE/eventstream), gunakan `test.describe.configure({ mode: 'serial' })`.

### 5) Error Handling & Retry
- Gunakan helper `safeGoto` secara konsisten; tambahkan fallback `expect.poll` untuk elemen dinamis.
- Pertahankan `retries: 2` di CI (apps/app/playwright.config.ts:29); pertimbangkan `trace: 'retain-on-failure'` untuk analisis flakiness.

### 6) Stabilitas Metadata
- Pastikan `NEXT_PUBLIC_APP_URL` terpropagasi via `use.env` (apps/app/playwright.config.ts:49–52) dan konsisten dengan verifikasi canonical/OG (contoh `apps/app/e2e/dashboard-meta.spec.ts`).

### 7) Dokumentasi & Validasi
- Tambahkan langkah verifikasi manual: `curl ${BASE}/api/health`, dan cek halaman utama sebelum e2e.
- Kaitkan `test:e2e:validate` di pipeline agar laporan diverifikasi setelah run.

## Output yang Diharapkan
- Tes Smoke dapat difilter stabil menggunakan `--grep` tanpa kehilangan kasus.
- Artefak laporan konsisten lintas lingkungan.
- Flakiness berkurang melalui health wait, retry, dan serialisasi selektif.

Konfirmasi rencana ini agar saya lanjut menyiapkan patch konfigurasi, penataan suite Smoke, dan penyesuaian skrip yang diperlukan.