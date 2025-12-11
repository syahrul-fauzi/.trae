## Ringkasan Tujuan
- Menyelesaikan semua pekerjaan yang sedang berjalan di `packages/ui` (atomic design, theming multi‑tenant, analytics) sampai terverifikasi end‑to‑end.
- Menutup gap a11y (khususnya `anchor-valid`) pada stories/tests atau menerapkan override lint terarah.
- Memastikan build ESM/CJS/DTS, tree‑shaking, subpath exports, serta kompatibilitas antar apps.

## Baseline & Audit Awal
- Tinjau perubahan terakhir dan artefak utama:
  - Barrel utama `packages/ui/src/index.ts` dan subpath exports di `packages/ui/package.json`.
  - Konsolidasi `HeatmapTracker` di `packages/ui/src/ui/analytics/HeatmapTracker.tsx` dan `ui/analytics/index.ts`.
  - Template auth di `packages/ui/src/templates/AuthLayout/AuthLayout.tsx` dan ekspor `packages/ui/src/templates/index.ts`.
  - Re‑export atoms (`Dialog.tsx`, `Separator.tsx`) serta `packages/ui/src/atoms/index.ts`.
  - Dokumentasi theming di `packages/ui/docs/components.md`.
- Checklist verifikasi awal:
  - Semua layer atomic (atoms/molecules/organisms/templates) ter‑export konsisten.
  - Tema: `ThemeProvider`, `useTheme`, `getThemeClass`, `getCSSVariable`, `defaultDesignTokens` tersedia di `./theme` dan root.
  - Analytics: `HeatmapTracker` client‑only, overlay, toggle berfungsi.
  - Subpath exports `package.json` selaras dengan struktur `dist`.

## Dependency Mapping & Impact Analysis
- Petakan dependensi internal/eksternal: React/TS, Tailwind, Radix UI, Storybook, Vitest, ESLint, tsup.
- Dampak perubahan terhadap apps konsumennya (`apps/app`): impor subpath (`@sba/ui/theme`, `@sba/ui/ui`, `@sba/ui/templates`).
- Risiko kompatibilitas: perubahan nama/letak ekspor, CSS tokens per tenant, perilaku client‑only.

## Penyelesaian Item In‑Progress
- A11y pada stories/tests:
  - Opsi A: Perbaiki semua kasus `anchor-valid` (ganti `<a>` tanpa `href` → `<button>` atau `<a href="#">`).
  - Opsi B: Tambah override lint khusus stories/tests untuk `jsx-a11y/anchor-is-valid` di `.eslintrc` dengan batasan file.
- Lengkapi tests untuk theming:
  - Unit: `ThemeProvider`, `getThemeClass`, `getCSSVariable` (token lookup, switching tenant).
  - Integration: `AuthLayout` (navigasi keyboard, ARIA), `HeatmapTracker` (toggle overlay, posting event mock).
- Rapikan stories: pastikan semua komponen utama memiliki cerita dan tidak melanggar aturan a11y kritis.

## Konsistensi & Review Desain/Kode
- Review pola atomic: konsistensi props, penamaan, forwardRef, typing di semua layer.
- Review desain: penggunaan CSS variables/tokens, theming per tenant melalui `data-tenant` atau kelas tema.
- Review barrel dan ekspor: hindari ekspor duplikat, pastikan pohon impor tidak sirkular.

## Testing Menyeluruh
- Unit testing: komponen atoms/molecules kritis (Button, Input, DataTable, Sidebar, Header).
- Integration testing: interaksi antar modul (templates merangkai organisms/molecules; theme switching memengaruhi style).
- System testing: build dan konsumsi paket oleh `apps/app` (import subpath, jalankan halaman demo).
- UAT: validasi alur bisnis (AuthLayout: login/register/reset/verify) dan multi‑tenant switching.

## Quality Gates & Rilis
- Static code analysis: ESLint (termasuk jsx-a11y), TypeScript `tsc --noEmit`, formatters.
- Build verifikasi: `pnpm -C packages/ui build` menghasilkan ESM/CJS/DTS; cek ukuran bundel dan tree‑shaking.
- Smoke test distribusi: import dari `dist` via subpath exports dan jalankan contoh.

## Dokumentasi & Changelog
- Finalisasi dokumen:
  - Technical specification: arsitektur atomic, tema multi‑tenant, analytics.
  - API docs: `ThemeProvider`, hooks/helpers, `HeatmapTracker` props.
  - Deployment guide: integrasi tema multi‑tenant, konfigurasi tokens, konsumsi subpath exports.
  - Troubleshooting manual: a11y lint, konflik subpath, client‑only komponen.
- Changelog terperinci mengikuti SemVer: fitur baru, perubahan ekspor, perbaikan a11y.

## Pelaporan Status
- Update berkala: harian/mingguan dengan metrik (% completion, jumlah tests, lint errors→0).
- Kendala + RCA: catat isu parser/eslint di test files dan resolusi (fix/override).
- Action items + ownership: siapa mengerjakan tiap bagian, tenggat, dependensi.

## Prioritas (MoSCoW)
- Must: verifikasi exports/build, perbaikan/override a11y, tests inti, dokumentasi utama.
- Should: integrasi system testing di `apps/app`, optimisasi tree‑shaking.
- Could: peningkatan Storybook a11y addon dan visual regression.
- Won’t (siklus ini): refactor besar di luar `packages/ui` selain yang berdampak langsung.

## Risiko & Mitigasi
- Risiko kompatibilitas impor: siapkan alias/notes migrasi pada changelog.
- Risiko lint a11y ketat: gunakan override terbatas atau perbaiki kasus.
- Risiko client‑only SSR: jaga penempatan komponen `'use client'` hanya di UI.

## Acceptance Criteria
- Build sukses (ESM/CJS/DTS), lint dan typecheck tanpa error.
- Semua stories/tests bebas a11y blocker (atau override resmi terbatas diterapkan).
- Theming multi‑tenant terdokumentasi dan teruji (switch tenant memengaruhi CSS variables).
- Analytics `HeatmapTracker` berfungsi dan tidak memengaruhi SSR.
- Changelog dan dokumen (spec, API, deployment, troubleshooting) lengkap.
