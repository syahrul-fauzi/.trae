## Perbaikan Halaman Dashboard (apps/app)
- Gunakan layout terautentikasi seragam (header `role="banner"`, satu `main` dengan `data-testid="main-content"`, skip link).
- Bungkus `Dashboard` di container yang mengekspose landmark/selector stabil, konsisten dengan `apps/web`.
- Tambahkan `PageHeader`/breadcrumb terstandar agar konsisten navigasi dan test.

## Metadata & Dinamika
- Koreksi penggunaan `headers()` vs `dynamic='force-static'`. Jika header/locale memengaruhi konten, ganti jadi `dynamic='force-dynamic'` atau hilangkan flag.
- Pastikan `generateMetadata` menyertakan canonical, alternates per bahasa, OpenGraph, Twitter, dan fallback aman `NEXT_PUBLIC_APP_URL`.
- Tambahkan JSON-LD sederhana (Organization/App) untuk SEO.

## A11y (WCAG 2.1 AA = 0)
- Tambah spesifikasi Axe pada halaman Dashboard: audit initial dan post-interaksi; target zero violations.
- Integrasikan artefak Axe diperkaya via util `appendAxeArtifact` (screenshotBase64 + contextHtml).

## E2E & Stabilitas
- Buat E2E untuk Dashboard: landmark cek, tidak ada console error, interaksi dasar, Axe audit.
- Gunakan selector `data-testid` yang deterministik; disable animasi di test-mode bila perlu.

## CI Integrasi
- Tambahkan job E2E khusus `apps/app` (chromium/firefox/webkit, 3× repeat, `STRICT_A11Y=true`).
- Upload artefak: HTML report, run-logs, `axe-violations.json`. Validasi dengan skrip serupa `apps/web`.

## Dokumentasi
- Tambah README di `apps/app` yang menjelaskan cara menjalankan E2E, kebijakan WCAG AA=100%, lokasi artefak Axe dan cara investigasi dengan `contextHtml` + screenshot.
