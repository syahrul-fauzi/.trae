## Tujuan
- Memindahkan semua `next/dynamic(..., { ssr: false })` dari Server Component `apps/app/src/app/page.tsx` ke Client Component wrapper, menjaga perilaku yang sama.

## Implementasi Teknis
- Buat Client Component baru `DashboardClient.tsx` dengan `'use client'` yang berisi seluruh dynamic imports dan rendering UI dashboard.
- Ubah `apps/app/src/app/page.tsx` (Server Component) agar hanya menangani metadata, SSR/redirect, dan merender `<DashboardClient />`.
- Pastikan tidak ada `ssr: false` tersisa di Server Component.

## Persiapan webServer
- Verifikasi server dapat start via Playwright `webServer` config (sinkron dengan `PLAYWRIGHT_BASE_URL`).
- Pastikan tidak ada regresi SSR (metadata tetap, redirect/logic server tetap).

## Testing
- Jalankan full suite E2E (meta & a11y) untuk semua modul.
- Pengujian manual navigasi dashboard, loading/hydration dynamic components.
- Observasi performa awal (time-to-ready) dan tidak ada flash/rehydration error.

## Deliverables
- `apps/app/src/app/page.tsx` yang sudah direfaktor + file `DashboardClient.tsx` baru.
- Laporan eksekusi E2E (HTML/JUnit/JSON) dan ringkasan hasil.
- Rekomendasi lanjutan (optimasi, gating, dan best practices).

## Kriteria Keberhasilan
- Semua E2E hijau.
- Tidak ada regresi fungsional.
- Maintainability meningkat (pemisahan Server vs Client yang jelas).
- webServer berjalan stabil tanpa error dynamic SSR.