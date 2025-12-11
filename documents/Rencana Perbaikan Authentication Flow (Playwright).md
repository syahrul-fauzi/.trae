## Identifikasi Masalah
- Gejala utama: banyak testcase E2E untuk Authentication Flow gagal di semua browser (Chromium/Firefox/WebKit) sesuai laporan Playwright.
- Bukti:
  - Spesifikasi yang gagal mencakup: sukses/gagal login, rate limiting, server error (500), network error, dan validasi email/password.
  - File spesifikasi: `apps/app/e2e/auth.spec.ts`, `apps/app/e2e/authlayout-keyboard.spec.ts`, `apps/app/e2e/authenticated-flow.spec.ts`, `apps/web/e2e/auth-navigation.spec.ts`.
- Komponen/modul terpengaruh:
  - Komponen UI: `apps/app/src/features/auth/ui/LoginForm.tsx` (form kredensial), `apps/app/src/app/(public)/login/page.tsx` (layout + OAuth), `apps/app/src/app/auth/login/page.tsx` (varian lain login), `apps/app/src/components/google-signin.tsx` (OAuth).
  - API route: `apps/app/src/app/api/auth/register/route.ts`, `apps/app/src/app/api/auth/forgot-password/route.ts`; TIDAK ada `POST /api/auth/login`.
  - Middleware: `apps/app/src/shared/lib/auth-middleware.ts`.
  - Playwright config: `apps/app/playwright.config.ts` (baseURL, webServer, storageState), setup/teardown global.
- Kondisi saat terjadi:
  - E2E berjalan dengan `baseURL` default `http://localhost:3001` (apps/app/playwright.config.ts:5-13, 55-64).
  - Spesifikasi `auth.spec.ts` melakukan `page.route('**/login')` untuk menyuntik halaman login fiksi lalu `page.goto('/login')` (`apps/app/e2e/auth.spec.ts:15-88`).

## Analisis Akar Penyebab
- Tidak tersedianya endpoint nyata `POST /api/auth/login` di server:
  - UI `LoginForm` memanggil `fetch('/api/auth/login')` untuk kredensial (`apps/app/src/features/auth/ui/LoginForm.tsx:43`). Tanpa route sebenarnya, respons nyata adalah redirect via middleware atau 404; testcase bergantung pada intercept sehingga rapuh.
- Middleware menandai seluruh `/api/**` sebagai protected kecuali callback:
  - `isProtectedRoute` mencakup semua `/api/` yang bukan `/api/auth/callback` (`apps/app/src/shared/lib/auth-middleware.ts:40-43`). Ini berpotensi mengubah POST `/api/auth/login` menjadi redirect 307 ke `/login` jika intercept tidak aktif.
- Duplikasi jalur login `/login` vs `/auth/login`:
  - Keyboard spec mengunjungi `/auth/login` (`apps/app/e2e/authlayout-keyboard.spec.ts:5`), sedangkan sebagian spesifikasi lain memakai `/login`. Dua varian halaman menyebabkan ketidakkonsistenan test-id/markup.
- Aksesibilitas kontainer alert tidak selalu ada:
  - `LoginForm` hanya merender `#alert` jika ada pesan (`apps/app/src/features/auth/ui/LoginForm.tsx:102-108`). Test aksesibilitas di `auth.spec.ts` mengasumsikan keberadaan `#alert` permanen (walau pada fixture hadir), sehingga saat fixture tidak terpakai test bisa gagal.
- Ketergantungan kuat pada `page.route`:
  - Banyak skenario (200/401/429/500/abort) dimodelkan melalui intercept. Jika pola tidak cocok atau tertimpa oleh handler lain, assertion akan salah.

## Dampak
- E2E gagal lintas browser → menghambat rilis, menurunkan kepercayaan pengujian.
- Potensi ketidaksesuaian perilaku produksi: form kredensial tidak memiliki backend nyata; fallback demo cookie `__test_auth` dipakai (`apps/app/src/app/api/test-login/route.ts:23-25`), tidak konsisten dengan guard server.

## Opsi Solusi
1. Menambahkan endpoint nyata `POST /api/auth/login` dengan kontrak status 200/401/429/500 sesuai skenario test; kecualikan dari proteksi middleware.
2. Menjaga sepenuhnya berbasis intercept di Playwright tanpa endpoint nyata, tetapi menstabilkan pola route dan menyamakan jalur login ke satu kanonik.
3. Migrasi kredensial ke Supabase sepenuhnya dan menyesuaikan test untuk OAuth-first; hapus skenario kredensial lokal.

## Solusi Dipilih
- Pilih Opsi 1 untuk kestabilan E2E dan konsistensi produksi dengan dampak minimal: tambahkan route login sederhana + pengecualian middleware. Sekaligus konsolidasi jalur login dan perbaikan aksesibilitas `#alert`.

## Perubahan yang Diusulkan
- Tambah file `apps/app/src/app/api/auth/login/route.ts`:
  - Validasi body `email/password`, respon: 200 (sukses mock), 401 (invalid), 429 (rate limit simulasi via query/heuristik), 500 (try/catch).
  - Gunakan pola `runApi(...)` seperti register (`apps/app/src/app/api/auth/register/route.ts:6-33`).
- Update middleware untuk mengecualikan login API:
  - Tambah `/api/auth/login` ke `publicRoutes` dan kecualikan dari `isProtectedRoute` (`apps/app/src/shared/lib/auth-middleware.ts:6-15`, `40-43`).
- Konsolidasi jalur login:
  - Set jalur kanonik `/login`. Ubah `apps/app/e2e/authlayout-keyboard.spec.ts:5` menjadi `page.goto('/login')`. Alternatif: buat `/auth/login` merender komponen yang sama dengan `/login` (reuse) agar test-id konsisten.
- Perbaiki aksesibilitas alert:
  - Render kontainer `#alert` permanen dengan `role="alert" aria-live="assertive" data-state="idle"` saat tidak ada pesan (`apps/app/src/features/auth/ui/LoginForm.tsx:101-108`).
- Stabilkan intercept Playwright:
  - Gunakan `route.once` dalam setiap test skenario untuk mencegah benturan handler dan panggil `await page.unroute('**/api/auth/login')` di `afterEach`.
  - Pastikan semua test yang mengirim request ke `/api/auth/*` melakukan intercept sebelum aksi klik.
- Dokumentasi env Playwright:
  - Tetapkan satu sumber `PLAYWRIGHT_BASE_URL` dan pastikan port sama dengan `webServer` (`apps/app/playwright.config.ts:5-13, 55-64`).

## Rencana Rollback
- Jika endpoint baru menyebabkan konflik, hapus `apps/app/src/app/api/auth/login/route.ts` dan kembalikan middleware seperti semula; aktifkan sementara intercept penuh di test untuk semua skenario.

## Resource & Timeline
- Implementasi: ±0.5 hari (endpoint + middleware + UI alert + penyesuaian spec).
- Pengujian & stabilisasi: ±0.5 hari.

## Implementasi Bertahap
1. Buat route `POST /api/auth/login` sesuai kontrak.
2. Modifikasi middleware untuk pengecualian `/api/auth/login`.
3. Perbarui `LoginForm` agar `#alert` selalu hadir.
4. Samakan jalur login atau re-export komponen.
5. Sesuaikan spesifikasi Playwright (keyboard spec ke `/login`; tambahkan `route.once`).

## Pengujian Menyeluruh
- Unit: tambah test untuk `api/auth/login` (valid/invalid/429/500).
- Integrasi: verifikasi middleware tidak memblokir `/api/auth/login`.
- E2E: jalankan `playwright test` multi-browser; cek skenario:
  - Sukses login: `auth.spec.ts:111-132`.
  - Gagal login: `auth.spec.ts:134-150`.
  - Rate limiting: `auth.spec.ts:187-205`.
  - Server error 500: `auth.spec.ts:207-221`.
  - Network error abort: `auth.spec.ts:223-233`.
  - Keyboard order: `authlayout-keyboard.spec.ts:4-23` (jalur `/login`).
- A11y: Axe scan (`auth.spec.ts:156-167`) + atribut `#alert`.

## Dokumentasi & Komunikasi
- Update README testing dan docs E2E: jelaskan kontrak `/api/auth/login`, pengecualian middleware, dan env `PLAYWRIGHT_BASE_URL`.
- Lakukan code review internal sebelum merge.

## Monitoring & Contingency
- Aktifkan reporter Playwright `html|json|junit` (sudah ada `apps/app/playwright.config.ts:31-36`).
- Pantau regresi via CI; jika flakiness muncul, opsional tambahkan `await page.waitForSelector('#alert')` setelah submit untuk semua skenario.

Jika disetujui, saya akan menerapkan perubahan di atas dan menjalankan pengujian untuk memverifikasi perbaikan end-to-end.