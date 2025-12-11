## Ikhtisar
- Target: menstabilkan dan memperbaiki kegagalan pada "Authentication Flow" lintas browser di Playwright.
- Gejala: kegagalan pada kasus sukses/gagal login, rate limit (429), server error (500), network error, serta audit a11y; akar flakiness berasal dari sinkronisasi `networkidle` dan stub form yang kurang ketat.

## Identifikasi Masalah Spesifik
- Spesifikasi utama: `apps/app/e2e/auth.spec.ts`.
- Titik bermasalah (referensi baris terbaru):
  - Sinkronisasi awal & form: 101–105.
  - Sukses login: 151–156.
  - Login gagal (401): 173–176.
  - Rate limit (429): 230–233.
  - Server error (500): 248–251.
  - Network abort: 262–265.
  - A11y & Axe: 182–193.
  - Headers keamanan (fulfill + verifikasi): 94–100, 195–211.
  - Cleanup route mock: 107–110.

## Analisis Penyebab & Dampak
- `networkidle` tidak cocok untuk halaman stub tanpa navigasi penuh → timeout palsu & flakey.
- Form login minim atribut a11y dan visibilitas alert → pesan tidak terbaca konsisten.
- Mock route tidak dibersihkan antar test paralel → interaksi tak diinginkan.

## Solusi Teknis
1) Ganti sinkronisasi jaringan dengan berbasis UI:
   - Gunakan `page.waitForSelector('#alert[data-state="success|error"]')` di setiap skenario hasil.
2) Perketat stub form login:
   - Tambah `label`+`id`, `type="email"/"password"`, `autocomplete`, `novalidate`, `role="main"`.
   - Pastikan `#alert` ber-`role="alert"` dan `aria-live="assertive"` serta memiliki tinggi minimal.
3) Tambahkan headers keamanan saat `route.fulfill('/login')`:
   - `x-frame-options=DENY`, `x-content-type-options=nosniff`, `referrer-policy=strict-origin-when-cross-origin`.
4) Cleanup mock routes setelah setiap test:
   - `test.afterEach` → `page.unroute('**/api/auth/login')`, `page.unroute('**/login')`.
5) Sesuaikan stub register/reset agar validasi tidak saling menimpa:
   - `novalidate`, `label`+`id`, `type`, `autocomplete`; isi email sebelum uji panjang password.

## Rencana Implementasi Detail
- Edit `apps/app/e2e/auth.spec.ts`:
  - Sinkronisasi: 101–105, 151–156, 173–176, 230–233, 248–251, 262–265.
  - A11y dan stub: 26–36, 28, 29–33; regex email sederhana di 50–51.
  - Headers keamanan: 94–100.
  - Cleanup: 107–110.
- Konfigurasi eksekusi stabil (tanpa edit kode produksi):
  - Jalankan dengan `PLAYWRIGHT_SKIP_WEBSERVER=true` dan `TEST_GREP` untuk fokus.

## Pengujian & Verifikasi
- Jalankan: `TEST_GREP="Authentication Flow|Registration Flow|Password Reset Flow" PLAYWRIGHT_SKIP_WEBSERVER=true pnpm -w --filter @sba/app test:e2e`.
- Verifikasi:
  - Alert hasil sesuai: "Signed in successfully", "Invalid credentials", "Too many attempts", "Unexpected error", "Network error".
  - A11y Axe: `critical/serious = 0`, `minor/moderate ≤ 2`.
  - Headers keamanan terdeteksi pada uji "if present".
- Tinjau laporan: `pnpm -C apps/app test:e2e:report`; opsi tangkap snapshot via `apps/app/e2e/report-capture.spec.ts`.

## Dokumentasi
- Tambah bagian “Praktik E2E yang Stabil” di `apps/app/docs/auth-flows-user-guide.md` yang mencakup:
  - Sinkronisasi UI, standar a11y form (label-id, type, autocomplete, aria-live), dan headers keamanan pada stub.

## Risiko & Mitigasi
- Perubahan hanya pada spesifikasi E2E dan dokumentasi → risiko rendah.
- Jika masih flakey, iterasi pada selector UI dan atribut stub, serta pastikan cleanup route berjalan di semua kasus.

## Hasil Diharapkan
- Semua kasus di “Authentication Flow” stabil dan lulus lintas browser; laporan Playwright bebas kegagalan flakey, panduan tim QA/Dev diperbarui dengan praktik pengujian stabil.