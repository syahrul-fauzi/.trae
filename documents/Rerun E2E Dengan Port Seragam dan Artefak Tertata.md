## Tujuan
- Menyeragamkan port pengujian (3001) di seluruh komponen.
- Menjalankan ulang seluruh skenario E2E yang diperlukan.
- Menyimpan artefak lengkap (laporan, screenshot, video, log) ke `apps/app/test-results/*` dengan struktur terorganisir.

## Persiapan & Normalisasi Port
- Setel environment konsisten ke `http://localhost:3001`:
  - `PLAYWRIGHT_BASE_URL=http://localhost:3001`
  - `NEXT_PUBLIC_APP_URL=http://localhost:3001`
- Pastikan satu dev server aktif di 3001: `pnpm -C apps/app dev -p 3001` dan gunakan `reuseExistingServer: true` dari konfigurasi di `apps/app/playwright.config.ts:55–64`.
- Matikan proses pengujian paralel yang sedang berjalan untuk menghindari konflik port (terminal 4/7/8), lalu jalankan satu sesi pengujian terkontrol.

## Eksekusi Ulang E2E
- Gunakan konfigurasi Playwright saat ini: `apps/app/playwright.config.ts:31–53, 65–76` (reporter list/html/json/junit; artefak: trace/screenshots/video; outputDir: `test-results`).
- Jalankan seluruh skenario yang diperlukan (tanpa grep), proyek: chromium/firefox/webkit.
- Atur eksekusi stabil:
  - `PLAYWRIGHT_SKIP_WEBSERVER=false` jika dev server belum berjalan, atau `true` bila server sudah aktif.
  - `PLAYWRIGHT_WORKERS=1` untuk menghindari flakiness saat kompilasi berat.
  - Pastikan login/storageState bila tersedia (`e2e/fixtures/auth-state.json`).

## Struktur Artefak
- Laporan:
  - `apps/app/test-results/junit.xml` (JUnit)
  - `apps/app/test-results/results.json` (JSON)
  - `apps/app/test-results/html-report/` (HTML report)
- Media:
  - `apps/app/test-results/*/test-failed-*.png` (screenshots)
  - `apps/app/test-results/*/video*.webm` (video)
  - `apps/app/test-results/*/trace.zip` (trace)
- Log:
  - Output konsol test pada `list` reporter dan file JSON/JUnit untuk rincian.

## Verifikasi Artefak
- Periksa keberadaan file wajib di `apps/app/test-results/*`:
  - `junit.xml`, `results.json`, direktori `html-report`.
  - Minimal satu `test-failed-*.png` per kegagalan dan `video.webm`.
  - Trace pada retry pertama (`trace: on-first-retry`).
- Validasi canonical/OG dan landmark a11y untuk halaman `Integrations` dan `Monitoring`:
  - `apps/app/src/app/(authenticated)/integrations/head.tsx:11–16`
  - `apps/app/src/app/(authenticated)/monitoring/head.tsx:11–16`
  - `apps/app/src/shared/lib/metadata.ts:26–59` (konsistensi base)

## Pelaporan
- Ringkas hasil eksekusi (jumlah lulus/gagal, waktu, dan penyebab kegagalan umum).
- Tambahkan tautan artefak ke `apps/app/docs/FINAL_REPORT.md` jika perlu.

Konfirmasi rencana ini, lalu saya akan menghentikan proses pengujian yang konflik, menormalkan port ke 3001, mengeksekusi ulang seluruh E2E, dan memverifikasi/merapikan artefaknya di `apps/app/test-results/*`. 