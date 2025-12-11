## A11y Dashboard (apps/app)
- Buat `apps/app/e2e/dashboard-a11y.spec.ts`: audit Axe initial + post-interaksi; target zero violations (critical/serious/moderate/minor = 0).
- Tambah util `apps/app/e2e/utils/axe-artifact.ts` (copy pola di apps/web) untuk menyimpan `apps/app/playwright-report/run-logs/axe-violations.json` dengan `screenshotBase64` dan `contextHtml`.

## E2E Stabilitas & Konfigurasi
- Tambah `apps/app/playwright.config.ts` serupa apps/web: `webServer: pnpm start`, reporter `[list,json,html]`, projects chromium/firefox/webkit, `testIdAttribute`.
- Tambah skrip `test:e2e`, `test:e2e:repeat`, dan `test:e2e:validate` di `apps/app/package.json`.
- Buat `apps/app/scripts/e2e-repeat.js` dan `apps/app/scripts/validate-summary.js` (strict a11y default, minorThreshold=0, dukung path artefak apps/app).

## Metadata & Dynamic
- Evaluasi penggunaan `headers()` di dashboard: ganti `export const dynamic = 'force-dynamic'` agar pembacaan header/locale sahih; atau hapus flag bila SSR default mencukupi.
- Pastikan `generateMetadata` tetap mencakup canonical, alternates, OpenGraph, Twitter, dan fallback `NEXT_PUBLIC_APP_URL`.

## CI Integrasi
- Perbarui `.github/workflows/ci.yml`: tambah job `e2e-app` yang menjalankan `pnpm -C apps/app run test:e2e:repeat`, validasi summary dengan `STRICT_A11Y=true`, dan upload artefak (`playwright-report/html`, `playwright-report/run-logs`).

## Dokumentasi
- Tambah `apps/app/README.md`: cara menjalankan E2E repeat, kebijakan WCAG 2.1 AA=100%, lokasi artefak Axe, dan cara investigasi (`contextHtml` + screenshot).

## Verifikasi
- Jalankan E2E lokal untuk memastikan reporter menghasilkan `summary.json` dan artefak Axe diperkaya; sesuaikan bila BASE_URL perlu.
- Pastikan selector stabil: gunakan `data-testid="dashboard-root"` dan `PageContainer` `data-testid="main-content"` untuk landmark cek.