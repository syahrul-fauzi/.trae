## Ringkasan Masalah
- Banyak kasus di "Authentication Flow" gagal/flakey lintas browser pada laporan Playwright.
- Sumber utama: sinkronisasi berbasis `networkidle` di spesifikasi, stub HTML login kurang ketat untuk a11y/visibilitas, serta route mock tidak dibersihkan.

## Identifikasi Berkas & Lokasi
- Spesifikasi inti: `apps/app/e2e/auth.spec.ts` — login/register/reset (lihat: 96–99, 127–166, 203–249, 262–315, 351–405).
- Konfigurasi Playwright: `apps/app/playwright.config.ts` — opsi `PLAYWRIGHT_SKIP_WEBSERVER` dan `TEST_GREP`.
- Panduan auth: `apps/app/docs/auth-flows-user-guide.md` — tempat dokumentasi praktik E2E.

## Analisis Penyebab & Dampak
- `networkidle` tidak andal pada halaman stub yang tidak melakukan navigasi penuh; menyebabkan timeout dan kegagalan palsu.
- Form stub tanpa `label`+`id`, `type` dan `autocomplete` mengganggu audit Axe dan deteksi visibilitas alert.
- Route mock `**/api/auth/login` tidak dibersihkan, berisiko tumpukan di eksekusi paralel.
- Dampak: kegagalan berulang pada kasus sukses/gagal/429/500/network abort dan laporan E2E tidak stabil.

## Solusi Teknis (Rencana Implementasi)
1. Edit `apps/app/e2e/auth.spec.ts` untuk stabilitas:
   - Ganti semua `waitForLoadState('networkidle')` dengan sinkronisasi berbasis UI: `page.waitForSelector('#alert[data-state="success|error"]')` sesuai skenario.
   - Perketat stub login:
     - Tambah `label`+`id` pada input, `type="email"/"password"`, `autocomplete` yang sesuai, `novalidate` pada form.
     - Tambah `role="main"` dan `#alert` dengan tinggi minimal agar terdeteksi.
     - Gunakan regex email sederhana namun valid (`/^.+@.+\..+$/`) agar tidak menimbulkan false-negative pada stub.
   - Tambah header keamanan saat `route.fulfill` untuk `/login`: `x-frame-options=DENY`, `x-content-type-options=nosniff`, `referrer-policy=strict-origin-when-cross-origin`.
   - Tambah `test.afterEach` untuk `page.unroute('**/api/auth/login')` dan `page.unroute('**/login')` guna mencegah tumpukan.
   - Perbaiki stub `register` dan `reset-password` dengan `label`+`id`, `type`, `autocomplete`, dan isi email sebelum uji panjang password agar pesan panjang tampil.

2. Eksekusi E2E terfokus dan stabil:
   - Jalankan dengan environment tanpa dev server: `PLAYWRIGHT_SKIP_WEBSERVER=true`.
   - Fokuskan suite: `TEST_GREP="Authentication Flow|Registration Flow|Password Reset Flow"`.
   - Validasi hasil lintas proyek browser (chromium/firefox/webkit).

3. Dokumentasi:
   - Tambah bagian “Praktik E2E yang Stabil” di `apps/app/docs/auth-flows-user-guide.md` yang menjelaskan sinkronisasi berbasis UI, standar a11y form, dan header keamanan untuk stub.

## Pengujian & Verifikasi
- Perintah contoh:
  - `TEST_GREP="Authentication Flow|Registration Flow|Password Reset Flow" PLAYWRIGHT_SKIP_WEBSERVER=true pnpm -w --filter @sba/app test:e2e`
  - `pnpm -C apps/app test:e2e:report` untuk melihat laporan.
- Harapan verifikasi:
  - Skenario sukses: alert `Signed in successfully` dengan `data-state=success`.
  - Gagal login (401): alert `Invalid credentials`.
  - Rate limit (429): alert `Too many attempts`.
  - Server error (500): alert `Unexpected error`.
  - Network abort: alert `Network error`.
  - A11y Axe: `critical/serious` = 0, `minor/moderate` ≤ 2.
  - Header keamanan hadir ketika tersedia.

## Risiko & Mitigasi
- Perubahan terbatas pada spesifikasi E2E dan dokumentasi, tidak menyentuh kode produksi → risiko rendah.
- Jika masih flakey, iterasi pada selector berbasis UI dan atribut stub hingga konsisten.

## Output yang Diharapkan
- Semua kasus di “Authentication Flow” stabil dan lulus lintas browser.
- Laporan Playwright bersih dari kegagalan flakey; dokumentasi memandu praktik pengujian stabil di masa depan.