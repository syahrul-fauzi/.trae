## Tujuan
Memindahkan komponen LoginForm dari apps/app ke apps/web dengan integrasi autentikasi yang konsisten, routing/proteksi yang tepat, UX dan keamanan terjaga, serta pengujian menyeluruh.

## Arsitektur & Lokasi
- Struktur komponen di apps/web:
  - `apps/web/src/features/auth/ui/LoginForm.tsx` (komponen utama)
  - `apps/web/src/features/auth/hooks/useAuth.ts` (opsional: abstraksi state & helper)
  - `apps/web/src/app/login/page.tsx` (halaman CSR yang merender LoginForm)
  - `apps/web/src/app/(authenticated)/layout.tsx` (opsional: guard authenticated untuk halaman privat)
- Reuse paket & util:
  - UI: `@sba/ui`
  - Supabase: `@sba/supabase/clients/client` & `@sba/supabase/clients/server` (untuk SSR jika diperlukan)

## Endpoint Autentikasi
- Preferensi: gunakan Supabase Auth (signInWithPassword) di web agar konsisten lintas platform.
  - Dependensi env web: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - Fallback dev/demo: kredensial `admin@example.com/demo123` akan disetel melalui cookie test (`__test_auth`) hanya di dev/test.
- Alternatif (jika harus lewat backend): panggil endpoint auth di Orchestrator/API (atau app) via base URL yang disepakati, dengan body JSON `{ email, password }`, dan tangani status `200/401/429/500` secara eksplisit.

## Routing & Proteksi
- Tambah rute `/login` di apps/web (CSR). 
- Proteksi halaman privat di apps/web:
  - Layout `(authenticated)`: cek session (Supabase atau cookie `__test_auth` di dev/test) dan render fallback jika belum masuk.
- Normalisasi URL salah (opsional): middleware mengalihkan `/(public)/login` → `/login` di web untuk UX.

## Integrasi & State
- `LoginForm` (web) langkah:
  - Validasi form (email/password), tampilkan alert.
  - Panggil `supabase.auth.signInWithPassword` (web client). 
  - On success: navigasi ke `/dashboard` (web) atau rute target, set state user (jika perlu) lewat hook/useAuth.
  - Fallback demo (dev/test): set cookie `__test_auth=admin` dan navigasi.
- Sign-out: gunakan `supabase.auth.signOut` dan bersihkan state/cookie.

## Keamanan
- Jangan menyimpan password di state global; hanya di state lokal sementara.
- Pastikan tidak ada secrets di client code; gunakan env publik Supabase saja.
- Tampilkan pesan error tanpa membocorkan detail server.
- Rate limit & audit: jika melewati backend, hormati header/limits yang ada.

## Penanganan Error & UX
- Pesan error terstandard (invalid credentials, too many attempts, server error, network error).
- Loading state & disable tombol saat proses.
- Responsivitas: gunakan komponen `@sba/ui` yang sudah responsif; uji viewport mobile.
- Halaman 404 web yang ramah dengan tautan navigasi.

## Pengujian
- Unit/komponen (React Testing Library):
  - Render LoginForm, validasi input, submit, tampilkan error.
- Integrasi (Supabase client mocked):
  - Skenario sukses, 401, 429, 500, network error.
- E2E (Playwright):
  - `GET /login` render, isi form, login sukses redirect `/dashboard`.
  - Cross-browser: Chromium/Firefox/WebKit.
  - Responsivitas: mobile viewport.

## Dokumentasi
- Tambah README di `apps/web/src/features/auth/README.md`:
  - Arsitektur, alur login, env yang dibutuhkan, cara testing.
- Update `.env.example` di apps/web: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Catat perbedaan dev vs production (fallback demo hanya dev/test).

## Langkah Implementasi
1. Buat komponen `LoginForm.tsx` di `apps/web/src/features/auth/ui/` dengan validasi, panggilan Supabase auth, dan UX/alert.
2. Tambah halaman `apps/web/src/app/login/page.tsx` yang merender LoginForm.
3. (Opsional) Tambah layout `(authenticated)` untuk guard halaman privat.
4. Sesuaikan middleware (opsional) untuk normalisasi rute salah.
5. Tambah pengujian unit/integrasi & E2E.
6. Tambah dokumentasi & update `.env.example` web.
7. Jalankan lint/type-check dan E2E lintas browser.

## Hasil yang Diharapkan
- Akses `/login` di apps/web berjalan tanpa 404.
- Login berfungsi lewat Supabase auth (atau endpoint backend yang dipilih), dengan penanganan error yang rapi dan UI responsif.
- Integrasi tidak mengganggu fungsionalitas eksisting; halaman privat terlindungi sesuai kebijakan saat ini.

Konfirmasi untuk lanjut implementasi sesuai rencana di atas.