## Tujuan
- Melakukan commit seluruh perubahan dokumentasi E2E.
- Menambahkan screenshot halaman kunci dari laporan Playwright (≥1280×720) dan mereferensikannya dari dokumen.
- Menyediakan struktur direktori, konvensi penamaan, dan template commit yang konsisten.

## Target Screenshot (Halaman Kunci)
- Ringkasan Suite: halaman beranda laporan (overview total passed, duration).
- Per-Browser Summary: Chromium, Firefox, WebKit (tab ringkasan tiap browser).
- Detail Spesifikasi: halaman detail satu skenario representatif (mis. Authentication Flow).
- A11y Results: satu halaman hasil Axe (mis. Settings a11y).
- Observability/API Docs: satu halaman untuk konten dinamis yang distabilkan (API Docs/Observability).
- Performance: ringkasan pengujian performa.

## Direktori Penyimpanan Aset Gambar
- Path: `apps/app/docs/assets/e2e/2025-12-08/`
- Struktur:
  - `apps/app/docs/assets/e2e/2025-12-08/overview.png`
  - `apps/app/docs/assets/e2e/2025-12-08/browser-chromium.png`
  - `apps/app/docs/assets/e2e/2025-12-08/browser-firefox.png`
  - `apps/app/docs/assets/e2e/2025-12-08/browser-webkit.png`
  - `apps/app/docs/assets/e2e/2025-12-08/spec-auth-flow.png`
  - `apps/app/docs/assets/e2e/2025-12-08/a11y-settings.png`
  - `apps/app/docs/assets/e2e/2025-12-08/api-docs.png`
  - `apps/app/docs/assets/e2e/2025-12-08/observability.png`
  - `apps/app/docs/assets/e2e/2025-12-08/performance.png`

## Konvensi Penamaan File
- Format: `YYYY-MM-DD-<kategori>-<browser_opsional>-<res>.png`
- Contoh: `2025-12-08-overview-1280x720.png`, `2025-12-08-browser-chromium-1280x720.png`, `2025-12-08-spec-auth-flow-1280x720.png`.
- Nama deskriptif, huruf kecil, pemisah tanda hubung.

## Format & Resolusi
- Disarankan PNG untuk kejelasan UI; JPG bila ukuran perlu diperkecil.
- Resolusi minimal: 1280×720. Disarankan 1600×900 untuk detail tambahan.

## Sumber Laporan HTML
- Laporan dihasilkan di `apps/app/playwright-report/`.
- Buka `apps/app/playwright-report/index.html`, navigasi ke halaman target, ambil screenshot sesuai konvensi.

## Referensi di Dokumen
- Dokumen utama: `docs/testing/e2e-updates.md` (sudah dibuat).
- Tambahkan tautan relatif:
  - `![Playwright Overview](../apps/app/docs/assets/e2e/2025-12-08/overview.png)`
- Jika diperlukan, tambahkan ringkasan di `apps/app/docs/FINAL_REPORT.md` dengan daftar screenshot dan hasil.

## Verifikasi Akses Gambar
- Pastikan setiap tautan markdown menampilkan gambar di preview IDE/renderer.
- Periksa jalur relatif dari lokasi dokumen (mis. `docs/testing/e2e-updates.md` → gunakan `../apps/app/docs/assets/...`).

## Langkah Commit
1. Tambahkan semua gambar ke direktori tujuan.
2. Perbarui `docs/testing/e2e-updates.md` untuk menyertakan tautan ke gambar di bagian “Bukti Visual”.
3. Opsional: Perbarui `apps/app/docs/FINAL_REPORT.md` untuk ringkasan eksekutif.
4. Jalankan commit:
   - Ringkasan pesan commit berisi:
     - Ringkasan perubahan dokumentasi.
     - Daftar screenshot yang dilampirkan (nama file).
     - Direktori penyimpanan gambar.

## Template Pesan Commit
```
chore(docs): update E2E documentation and attach Playwright report screenshots

- Add screenshots (1280x720):
  - apps/app/docs/assets/e2e/2025-12-08/overview.png
  - apps/app/docs/assets/e2e/2025-12-08/browser-chromium.png
  - apps/app/docs/assets/e2e/2025-12-08/browser-firefox.png
  - apps/app/docs/assets/e2e/2025-12-08/browser-webkit.png
  - apps/app/docs/assets/e2e/2025-12-08/spec-auth-flow.png
  - apps/app/docs/assets/e2e/2025-12-08/a11y-settings.png
  - apps/app/docs/assets/e2e/2025-12-08/api-docs.png
  - apps/app/docs/assets/e2e/2025-12-08/observability.png
  - apps/app/docs/assets/e2e/2025-12-08/performance.png

- Update docs/testing/e2e-updates.md with visual proofs and links
- Image directory: apps/app/docs/assets/e2e/2025-12-08/
```

## Konfirmasi Diperlukan
- Apakah direktori target `apps/app/docs/assets/e2e/2025-12-08/` sesuai atau ingin diubah ke lokasi global `docs/assets/e2e/`?
- Resolusi final (1280×720 vs 1600×900) dan pilihan format (PNG/JPG) sesuai kebutuhan repositori?
- Apakah perlu menyertakan tambahan screenshot untuk halaman lain (mis. Workspaces detail, Metadata OG di beberapa halaman)?
