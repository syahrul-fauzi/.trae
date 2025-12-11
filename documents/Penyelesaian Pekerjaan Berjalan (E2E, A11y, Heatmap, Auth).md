## Ringkasan Tujuan

* Menuntaskan verifikasi end-to-end (E2E) dan aksesibilitas (a11y) sesuai PRD heatmap dan auth.

* Menghilangkan kegagalan test akibat mismatch rute/konten dan memastikan baseline a11y terpenuhi.

* Menyediakan laporan penyelesaian akhir dengan bukti verifikasi.

## Identifikasi Pekerjaan Berjalan

* E2E gagal pada halaman autentikasi: `auth.spec.ts` (login/register/reset/headers/rate-limit) karena rute i18n dan konten tidak cocok.

* E2E gagal pada `authlayout-keyboard.spec.ts` (skip link terlihat/fokus) di halaman auth.

* E2E gagal pada `heatmap-overlay.spec.ts` (tombol toggle tidak ditemukan) di `/demo/analytics`.

* A11y: Axe mendeteksi `html-has-lang`, `landmark-one-main`, `page-has-heading-one` pada halaman auth (sebagian sudah diperbaiki di layout root, perlu konsistensi pada i18n layout/halaman auth).

## Prioritas

* Prioritas-1: Perbaiki a11y baseline yang memblokir Axe (lang, main landmark, heading satu) di semua layout auth + i18n.

* Prioritas-2: Selaraskan rute i18n (`/en/...`) dengan halaman `(public)` agar test menemukan halaman yang tepat.

* Prioritas-3: Pastikan halaman `/demo/analytics` hadir dan tombol toggle heatmap terlihat.

* Prioritas-4: Verifikasi headers keamanan dan rate-limit sesuai ekspektasi test.

## Alokasi Sumber Daya

* Implementasi kode: pembaruan layout i18n, alias halaman auth di folder `[locale]/(public)`, penyesuaian komponen `AuthLayout` untuk skip link dan heading.

* Testing: jalankan Playwright fokus (auth, a11y, heatmap), inspeksi laporan HTML.

* Dokumentasi: tambahkan catatan perubahan pada dokumen theming/a11y (`packages/ui/docs/components.md`) dan changelog lokal aplikasi jika ada.

## Rencana Eksekusi Teknis

1. A11y Baseline

* Pastikan `lang` pada layout i18n dan root (`apps/app/src/app/layout.tsx`, `apps/app/src/app/[locale]/layout.tsx`).

* Pastikan `role="main"` dan heading tingkat-1 ada pada halaman auth melalui `AuthLayout` (konfirmasikan `h1` selalu ter-render sesuai varian) di `packages/ui/src/templates/AuthLayout/AuthLayout.tsx`.

1. Rute I18n vs Halaman `(public)`

* Tambahkan alias halaman untuk i18n: ekspor ulang file `(public)` ke `[locale]/(public)` agar `/en/login`, `/en/register`, `/en/forgot-password`, `/en/verify-email` tersedia.

* Contoh: `apps/app/src/app/[locale]/(public)/login/page.tsx` mengekspor default dari `../../../(public)/login/page`.

* Lakukan hal sama untuk `register`, `reset-password` (atau `forgot-password` sesuai test), `verify-email` agar seluruh skenario E2E menemukan rute yang benar.

1. AuthLayout & Skip Link

* Pastikan skip link terlihat di halaman auth dan dapat difokuskan; jika perlu sesuaikan kelas utilitas agar dapat diakses keyboard.

* Pastikan variant titles sesuai ekspektasi test: "Create Account", "Reset Password", dsb di `AuthLayout`.

1. Heatmap Toggle & Halaman Demo

* Pastikan halaman `/demo/analytics` tersedia (buat stub jika belum) dan komponen `HeatmapTracker` di-render pada halaman tersebut.

* Pastikan properti `enabled` sesuai env dan tombol toggle berlabel "Show/Hide heatmap" (lihat `packages/ui/src/ui/analytics/HeatmapTracker.tsx:185–205`).

1. Headers Keamanan & Rate-Limit

* Verifikasi middleware `apps/app/middleware.ts` menghasilkan header sesuai test.

* Pastikan test rate-limit mengisi form (selector input) yang konsisten dengan halaman auth; sesuaikan halaman jika perlu.

1. Verifikasi & Kualitas

* Jalankan Playwright fokus (auth, a11y, heatmap), pastikan zero critical Axe, semua skenario auth/heatmap lulus.

* Jalankan laporan HTML Playwright untuk bukti.

1. Dokumentasi

* Tambahkan bagian "A11y baseline & i18n routes alignment" di `packages/ui/docs/components.md` (ringkas, tanpa credensial) yang menjelaskan pola skip link, landmark, heading, dan strategi i18n alias.

## Kriteria Selesai

* Semua test yang sebelumnya gagal (auth, authlayout keyboard, heatmap overlay) lulus di tiga browser.

* Axe: tidak ada pelanggaran critical/serious pada halaman auth dan dashboard.

* Rute i18n `/en/...` berfungsi untuk semua halaman auth.

* Laporan status akhir disertai link report E2E dan ringkasan perubahan.

## Pelaporan Status

* Setelah eksekusi, sampaikan: daftar pekerjaan yang diselesaikan, bukti (jumlah test lulus, nol pelanggaran Axe), perubahan file kunci dengan referensi jalur, dan daftar rute yang aktif.

