## Tujuan
Menyeragamkan pola `generateMetadata` pada semua halaman authenticated, memastikan penggunaan `headers()` sinkron, URL canonical/alternates yang akurat, serta konsistensi a11y dan verifikasi lewat unit/E2E test.

## Perubahan Utama
- Konsolidasi util dasar: ekstrak logika base URL (proto/host/env) dan locale dari `headers()` ke helper bersama agar tidak duplikasi.
- Samakan `generateMetadata` di halaman: `dashboard`, `analytics`, `hub`, `insights` memakai helper tersebut dan path `(authenticated)/{page}` yang konsisten.
- Pastikan `images` dan `openGraph` memakai base yang sama serta fallback produksi/dev.
- Review `dynamic` strategi: tetapkan sesuai kebutuhan data (dashboard menggunakan `force-dynamic` bila perlu, lainnya tetap default/`force-static` jika aman).

## Aksesibilitas & Struktur
- Pastikan wrapper konten tetap `role="region"` berlabel jelas di halaman dashboard (sudah ada), seragamkan untuk halaman lain bila perlu.
- Hindari duplikasi landmark `main` karena disediakan oleh `AuthenticatedLayout` via `PageContainer`.

## Testing
- Unit test untuk helper base URL/locale dan `generateMetadata` tiap halaman dengan mock `headers()`.
- E2E: verifikasi canonical `<link rel="canonical">` dan OG tags pada `/dashboard`, serta a11y landmark tetap utuh.
- Jalankan test terfokus agar stabil; integrasikan ke suite setelah lulus.

## Implementasi
1. Tambah helper (di shared lib yang sudah ada) untuk `getBaseURLAndLocale(headers)` tanpa menambah dependensi eksternal.
2. Refactor `generateMetadata` pada `dashboard`, `analytics`, `hub`, `insights` ke helper.
3. Tambah unit test untuk helper dan halaman (mock `headers`).
4. Tambah E2E sederhana untuk meta tags/canonical di `/dashboard`.

## Kriteria Penerimaan
- Semua halaman authenticated memakai pola metadata yang sama dan lulus unit test.
- `/dashboard` memiliki canonical dan OG yang benar; landmark a11y tetap konsisten.
- Tidak ada regressions terkait render/layout.

Konfirmasi untuk melanjutkan implementasi konsolidasi ini.