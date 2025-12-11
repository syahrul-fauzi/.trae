## Tujuan
- Menghasilkan laporan akhir dalam PDF dan HTML, serta mengekspor coverage (JSON/LCOV/Cobertura XML) pasca eksekusi tes di CI.
- Menyimpan output pada struktur `/reports/{pdf,html,coverage}` dengan penamaan bertimestamp `YYYYMMDD_HHMMSS`.

## Arsitektur Solusi
- Sumber data: Vitest reporters (junit, html, json), coverage v8 (`coverage-final.json`, `lcov.info`).
- Aggregator: Skrip Node (`tools/reporting/generate-report.ts`) menggabungkan hasil tes dan coverage menjadi HTML; lalu render ke PDF via Puppeteer.
- Converter: Konversi `lcov.info` → Cobertura XML menggunakan `lcov-to-cobertura-xml` untuk kompatibilitas CI.
- Penempatan: Semua artefak disalin ke `/reports/html`, `/reports/pdf`, `/reports/coverage`.

## Implementasi (Kode)
1) Tambah dependensi dev:
- `puppeteer`, `fs-extra`, `lcov-to-cobertura-xml`
2) Tambah skrip:
- `tools/reporting/generate-report.ts`:
  - Kumpulkan: `vitest` json output (test summary), HTML report path, junit XML (opsional), `coverage/coverage-final.json`, `coverage/lcov.info`.
  - Hitung statistik: lines/functions/branches; per-file breakdown.
  - Bangun HTML (inline CSS + tabel + grafik ringan) dengan bagian: ringkasan tes, statistik coverage, detail per file/modul, waktu generasi.
  - Simpan: `/reports/html/test-summary_<timestamp>.html`.
  - Render PDF: buka file HTML lokal dan cetak ke `/reports/pdf/test-summary_<timestamp>.pdf`.
  - Simpan coverage: salin `coverage-final.json` → `/reports/coverage/coverage_<timestamp>.json`; salin `lcov.info` → `/reports/coverage/lcov_<timestamp>.info`; hasil konversi → `/reports/coverage/cobertura_<timestamp>.xml`.
  - Verifikasi: pastikan semua file ada dan berukuran > 0; kembalikan kode exit non-0 bila gagal.
3) Tambah util timestamp:
- Fungsi format `YYYYMMDD_HHMMSS` (zero-padded) di `tools/reporting/utils.ts`.
4) Paket scripts (root `package.json`):
- `test:report:prepare`: jalankan vitest dengan reporters: `vitest --reporter=list --reporter=html --reporter=json --reporter=junit --output=test-report` (sesuaikan path output), `CI=true` untuk coverage.
- `report:generate`: `tsx tools/reporting/generate-report.ts`.
- `report:ci`: `pnpm test:report:prepare && pnpm report:generate`.

## Integrasi CI (Generic GitHub Actions)
- Job langkah pasca-tes:
  - `run: pnpm report:ci`
  - `if: failure()`: kirim notifikasi (Slack webhook atau GitHub PR comment) dengan ringkasan gagal.
  - Upload artefak: `actions/upload-artifact` untuk direktori `/reports`.
- Verifikasi:
  - Jalankan skrip validasi yang memeriksa keberadaan file: `/reports/html/*.html`, `/reports/pdf/*.pdf`, `/reports/coverage/*.(json|info|xml)`.
  - Gagal bila tidak ditemukan.

## Struktur & Penamaan Output
- `/reports/`
  - `html/test-summary_<YYYYMMDD_HHMMSS>.html`
  - `pdf/test-summary_<YYYYMMDD_HHMMSS>.pdf`
  - `coverage/coverage_<YYYYMMDD_HHMMSS>.json`
  - `coverage/lcov_<YYYYMMDD_HHMMSS>.info`
  - `coverage/cobertura_<YYYYMMDD_HHMMSS>.xml`

## Kualitas & Konsistensi
- HTML report: navigasi jelas, link ke per-file sections, grafik sederhana (opsional static bar chart CSS), semua link internal berfungsi.
- PDF: dihasilkan dari HTML yang sama agar konsisten; page header/footer berisi waktu generasi.
- Metadata coverage: sertakan versi runner, commit SHA (bisa dari env CI), waktu mulai/selesai.

## Langkah Verifikasi
- Local:
  - Jalankan `pnpm report:ci`; pastikan `/reports` terisi; buka HTML; periksa PDF dapat dibaca.
- CI:
  - Cek artefak `reports` terupload; junit/HTML reporter berhasil dibuat; coverage eksport tersedia (JSON/LCOV/XML).

## Notifikasi Gagal
- Jika langkah `report:generate` gagal: kirim notifikasi ke Slack (opsional; gunakan `SLACK_WEBHOOK_URL`) atau PR comment via `actions/github-script` dengan log ringkas.

## Catatan Integrasi dengan Konfigurasi Saat Ini
- Vitest coverage sudah diaktifkan dan reporter `html/json/lcov` telah diset di `apps/app/vitest.config.ts` sehingga generator bisa membaca `coverage` bawaan.
- E2E HTML reporter dapat disalin ke `/reports/html` jika diaktifkan; aggregator dapat menambah section E2E.

## Estimasi Implementasi
- Kode generator & converter: ~150-200 LOC.
- CI wiring: 1 job + 3-4 langkah.
- Verifikasi manual: <1 jam.

Konfirmasi rencana ini, maka saya akan menambahkan skrip generator, wiring CI, dan verifikasi otomatis sesuai spesifikasi Anda.