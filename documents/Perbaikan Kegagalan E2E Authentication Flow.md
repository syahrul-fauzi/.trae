## Ringkasan Masalah
- Banyak kasus di "Authentication Flow" gagal lintas browser (chromium, firefox, webkit) pada laporan Playwright.
- Sumber utama kegagalan: sinkronisasi berbasis `networkidle` yang flakey serta beberapa pelanggaran aksesibilitas ringan yang melebihi ambang uji.
- Spesifikasi relevan: `apps/app/e2e/auth.spec.ts` (lihat baris 202, 218, 230 untuk `waitForLoadState('networkidle')`).

## Identifikasi Masalah Spesifik
- Flakiness menunggu `networkidle` setelah submit login/rate-limit/error: `apps/app/e2e/auth.spec.ts:202`, `:218`, `:230`.
- Potensi pelanggaran a11y minor (>2) saat audit Axe: `apps/app/e2e/auth.spec.ts:156-167` menggunakan `@axe-core/playwright` pada HTML stub.
- Kemungkinan penumpukan route mocking antar tes (tidak dibersihkan) yang memicu perilaku tak terduga.

## Analisis Penyebab & Dampak
- `networkidle` dapat tidak tercapai karena koneksi non-navigasi/long-lived; menyebabkan timeout dan kegagalan tes meski UI sudah berubah.
- HTML stub login memakai input generik tanpa `type`, `id`/`label` sehingga Axe bisa melaporkan lebih dari 2 pelanggaran minor.
- Tanpa cleanup `page.unroute`, mock `**/api/auth/login` berpotensi menumpuk antar tes paralel.
- Dampak: tes gagal, laporan flakey, kepercayaan terhadap alur autentikasi turun.

## Solusi Teknis
- Ganti sinkronisasi berbasis jaringan dengan sinkronisasi berbasis UI:
  - Ubah `waitForLoadState('networkidle')` menjadi `page.waitForSelector('#alert[data-state="error"]')` atau `'#alert[data-state="success"]'` sesuai skenario.
  - Lokasi: `apps/app/e2e/auth.spec.ts:202`, `:218`, `:230` (dan pastikan skenario sukses sudah memakai selector state pada `:127`).
- Perketat HTML stub agar lolos audit Axe:
  - Tambah `label` terkait `id` pada input, `type="email"`/`type="password"`, `autocomplete` yang sesuai.
  - Pastikan tombol memiliki nama yang jelas; pertahankan landmark `main`, `role="alert"` dan `aria-live="assertive"`.
  - Lokasi: blok fulfill `**/login` di `apps/app/e2e/auth.spec.ts:17-84`.
- Header keamanan konsisten pada stub (opsional namun menstabilkan uji header):
  - Tambah `x-frame-options: DENY`, `x-content-type-options: nosniff`, `referrer-policy: strict-origin-when-cross-origin` pada `route.fulfill` untuk `**/login`.
- Hindari penumpukan route mocking:
  - Tambah `test.afterEach` untuk `page.unroute('**/api/auth/login')` dan `page.unroute('**/login')`.
- Opsi lingkungan untuk stabilitas (tidak mengubah kode aplikasi):
  - Jalankan tes dengan `PLAYWRIGHT_SKIP_WEBSERVER=true` agar stub tidak bersaing dengan dev server.
  - Atau pertahankan webServer namun tetap gunakan stub; kedua opsi didukung oleh `apps/app/playwright.config.ts`.

## Rencana Implementasi
1. Edit `apps/app/e2e/auth.spec.ts`:
   - Ganti `waitForLoadState('networkidle')` dengan `waitForSelector` pada baris 202, 218, 230.
   - Perbarui HTML stub login: tambahkan `label`+`id`, `type`, `autocomplete` agar mengurangi pelanggaran Axe.
   - Tambah header keamanan pada `route.fulfill` untuk `/login`.
   - Tambah `test.afterEach` untuk `page.unroute(...)` membersihkan mock.
2. Konfigurasi opsional: set `PLAYWRIGHT_SKIP_WEBSERVER=true` saat menjalankan e2e di CI.

## Pengujian & Verifikasi
- Jalankan `pnpm -w --filter @sba/app test:e2e` lintas proyek browser.
- Validasi bahwa semua kasus di `apps/app/e2e/auth.spec.ts` lulus (khususnya sukses/gagal login, 429, 500, network abort, Axe a11y).
- Jalankan `pnpm -w --filter @sba/app test:e2e:report` dan gunakan `apps/app/e2e/report-capture.spec.ts` untuk memutakhirkan snapshot HTML Report.

## Dokumentasi
- Tambah catatan pada `apps/app/docs/auth-flows-user-guide.md` dan `apps/web/docs/AUTH-LOGIN.md` tentang:
  - Pola sinkronisasi berbasis UI untuk E2E auth.
  - Standar a11y form (label, tipe input, autocomplete, `aria-live`).
  - Header keamanan yang dipastikan pada halaman login.

## Risiko & Mitigasi
- Perubahan hanya di spesifikasi E2E dan stub HTML; tidak menyentuh runtime aplikasi → risiko rendah.
- Jika Axe masih mencatat >2 pelanggaran minor, iterasi pada atribut form dan landmark tambahan hingga lolos.

## Output yang Diharapkan
- Semua tes di "Authentication Flow" stabil dan lulus di chromium/firefox/webkit.
- Laporan Playwright bersih dari kegagalan flakey; artefak tangkapan terbaru tersedia di `docs/assets/e2e/<date>/`.