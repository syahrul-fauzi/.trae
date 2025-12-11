## Tujuan
- Hilangkan hardcoded `http://localhost:3000` pada Dashboard; gunakan env override lalu fallback dari headers secara aman.
- Verifikasi via E2E bahwa canonical dan OG URL sesuai base yang dihitung.

## Perubahan Kode
- Di `apps/app/src/app/(authenticated)/dashboard/page.tsx`:
  - Ganti `base = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'` dengan logika:
    - `base = NEXT_PUBLIC_APP_URL` bila tersedia.
    - else bangun dari `x-forwarded-proto` + `x-forwarded-host` (atau `host`) dari `headers()`.
    - proto default: `https` ketika production, `http` saat dev; fallback ke `http://localhost:3000` jika host tidak tersedia.
  - Pertahankan `dynamic = 'force-dynamic'` karena bergantung pada `headers()`.

## Pengujian
- Tambah E2E `apps/app/e2e/dashboard-meta.spec.ts`:
  - Kunjungi `/(authenticated)/dashboard`
  - Assert `link[rel="canonical"]` dan `meta[property="og:url"]` sesuai base hasil logika (default dari `PLAYWRIGHT_BASE_URL`/env).
  - Assert Twitter image/OG image url mengacu ke base.

## Dokumentasi
- Tambahkan catatan di `apps/app/README.md` tentang derivasi base URL (env override, headers fallback) dan dampaknya pada metadata/SEO.

## CI
- Tidak perlu perubahan tambahan: job `e2e-app` sudah ada; gunakan env `PLAYWRIGHT_BASE_URL`/`NEXT_PUBLIC_APP_URL` untuk lingkungan CI agar konsisten dengan verifikasi canonical.