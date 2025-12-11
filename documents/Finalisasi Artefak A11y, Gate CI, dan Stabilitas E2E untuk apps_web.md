## Integrasi Artefak Axe yang Diperkaya
- Ganti penulisan JSON manual di `apps/web/e2e/ai-copilot-a11y.spec.ts` dengan util `appendAxeArtifact` dari `apps/web/e2e/utils/axe-artifact.ts` untuk menyertakan `screenshotBase64`, `pageTitle`, `url`, dan `contextHtml` (outerHTML + 3 parent) per node.
- Terapkan pola yang sama di `chat-a11y.spec.ts` dan `integrations-a11y.spec.ts` agar cakupan audit konsisten lintas halaman.

## Penegakan WCAG 2.1 AA (0 pelanggaran)
- Revisi validator di `apps/web/scripts/validate-summary.js` agar default ambang minor/moderate = `0` (AA 100%). Izinkan override via env jika diperlukan (`STRICT_A11Y=true`).
- Hapus whitelist `KNOWN_RULES` (mis. `select-name`) dari a11y spec setelah Select dinormalisasi; targetkan zero violations untuk kedua fase (initial + post-interaction).

## E2E Lintas Browser 3× + Agregasi
- Jalankan Playwright untuk `chromium`, `firefox`, `webkit` sebanyak 3×; gunakan reporter JSON.
- Gunakan `apps/web/scripts/e2e-repeat.js` atau jalankan 3× lalu agregasi dengan `apps/web/scripts/aggregate-from-results.js` agar `summary.json` memuat distribusi durasi dan flakiness.
- Pastikan `apps/web/playwright.config.ts` memakai `webServer: pnpm start` dan `BASE_URL` konsisten untuk menghindari dev overlay.

## Normalisasi Select (WCAG)
- Verifikasi `packages/ui/src/atoms/Select/Select.tsx` sudah memiliki: label asosiasi (`aria-labelledby`), `aria-controls`, `aria-expanded`, `role=listbox/option`, keyboard Arrow/Home/End/Enter/Space/Escape, dan fokus visual.
- Perbarui a11y spec di apps/web untuk tidak mengabaikan `select-name`; pastikan label tersedia pada semua penggunaan Select (contoh di AICopilot memakai `labelId="assistant-label"`).
- Pastikan unit-test `packages/ui/src/atoms/Select/__tests__/Select.a11y.spec.tsx` lulus dan berjalan di CI.

## Audit 'use client' & Window Guards
- Tinjau komponen di `/ai-copilot` dan chat agar menggunakan `'use client'` saat ada state/effect.
- Tambahkan guard akses `window` bersyarat dan optional chaining pada API browser.

## AuthLayout Overlay Kontras
- Audit `packages/ui/src/templates/AuthLayout/AuthLayout.tsx` untuk `overlayColor`: pastikan default memberi kontras teks yang memadai (AA) pada background gambar.
- Tambahkan test kontras minimal untuk kombinasi default (mis. skala warna Tailwind) di `packages/ui/src/templates/__tests__/AuthLayout.test.tsx`.

## CI Gates & Artefak
- Perbarui workflow CI: jalankan E2E 3× lintas browser, unggah `playwright-report` dan `run-logs/axe-violations.json` (versi diperkaya).
- Tambahkan langkah `node apps/web/scripts/validate-summary.js` dengan ambang performa/flakiness dan a11y ketat.

## Dokumentasi
- Tambahkan panduan di `apps/web/README.md` tentang: cara menjalankan E2E repeat, lokasi artefak Axe diperkaya, kebijakan WCAG 2.1 AA=100%, dan cara men-debug pelanggaran (menggunakan `contextHtml` + screenshot).