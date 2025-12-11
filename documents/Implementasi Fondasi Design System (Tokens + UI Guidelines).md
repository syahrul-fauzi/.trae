## Tujuan & Ruang Lingkup
- Menetapkan satu sumber kebenaran (Single Source of Truth) untuk design tokens; menghasilkan CSS variables, TS typings, dan JSON artefak untuk konsumsi komponen dan Tailwind.
- Menyatukan sistem theming multi-tenant di UI library; memastikan kompatibilitas dengan app dan Storybook.
- Melengkapi sistem layout (grid, spacing, container widths) yang konsisten dan terdokumentasi.
- Menguatkan Storybook (Docs Mode + Chromatic) dan QA gates (a11y, coverage ≥90%, visual regression).
- Menyusun dokumentasi komprehensif di README dan workspace/03_Design-System.

## Kondisi Saat Ini (Ringkas)
- Tokens tersebar: `packages/ui/src/styles/tokens.ts`, `packages/ui/src/styles/tokens/variables.css`, `packages/ui/src/theme/tokens.ts` (duplikasi, belum jelas pipeline).
- ThemeProvider aktif di UI dan app; terdapat Provider alternatif AG-UI yang paralel.
- Storybook sudah terpasang (React-Vite, a11y, interactions) dan memuat tokens CSS, namun belum ada halaman Design System terpusat dan publikasi CI.
- Tests dan CI quality workflow sebagian ada; dokumentasi Design System belum lengkap.

## Rencana Implementasi

### 1) Konsolidasi Design Tokens (Single Source of Truth)
- Tambah berkas tokens mentah: `workspace/03_Design-System/Foundations/tokens-raw.json` berisi kategori: color, typography, spacing, radius, shadow, zIndex, breakpoints.
- Normalisasi ke berkas terstruktur: `workspace/03_Design-System/tokens/{color,typography,spacing,radius,shadow,zindex,breakpoints}.json`.
- Tambah validasi skema (JSON Schema/Zod): `workspace/03_Design-System/tokens/schema.json` dan unit test untuk guard regresi.
- Buat generator tokens (`tools/tokens/normalize.js` dan `tools/tokens/build.js`) yang menghasilkan:
  - `packages/ui/src/styles/tokens/variables.css` (CSS variables HSL/px, kompatibel Tailwind).
  - `packages/ui/src/theme/tokens.ts` + `tokens.d.ts` (typings dan object runtime).
  - `packages/ui/src/styles/tokens.json` (artefak JSON untuk konsumsi docs/Storybook).
- Satukan sumber: tandai `packages/ui/src/styles/tokens.ts` sebagai konsumsi hasil build atau migrasikan isinya ke pipeline; hilangkan duplikasi dengan `packages/ui/src/theme/tokens.ts`.
- Scripts di monorepo root dan UI package:
  - `tokens:normalize`, `tokens:build`, `tokens:test`, `tokens:sync` (opsional Figma pull dari `workspace/integrations/figma/map.json`).

### 2) Integrasi Tailwind & Theming Multi-Tenant
- Ekspor helper untuk Tailwind theme dari artefak tokens (mapping warna, spacing, radius, shadow, breakpoints).
- Konsolidasi ThemeProvider: gabungkan kemampuan `ThemeProvider` dan `AGThemeProvider` menjadi satu API yang mendukung multi-tenant dan preferensi sistem.
- Tambah SSR hydration yang aman (hindari FOUC), persist `localStorage` dengan fallback server default.
- Dokumentasikan kontrak `ThemeConfig` dan cara override per tenant; sediakan contoh di app dan Storybook.

### 3) Sistem Layout
- Definisikan grid system responsif (container widths, column/gutter, breakpoints) di `workspace/03_Design-System/Foundations/Layout.md`.
- Tetapkan skala spacing baseline 4px/8px (xs→xl) dan padankan dengan tokens.
- Sediakan contoh utilitas CSS (kelas layout) atau pola komposisi di komponen (Card, PageTemplate) dan dokumentasikan.

### 4) Komponen Atomic (Batch Dasar)
- Audit Button, Input, Card agar seluruh style bersumber dari tokens; pastikan states (hover, focus, active, disabled) konsisten.
- Tambah stories varian lengkap (size, intent, state) dengan controls + docs.
- Tambah tests: unit + snapshot + integration (interaksi keyboard/mouse, ARIA) untuk menaikkan coverage ≥90% pada `packages/ui`.

### 5) Storybook & Chromatic
- Aktifkan Docs Mode dan buat halaman MDX:
  - `tokens.stories.mdx` (palet warna, tipografi, spacing, radius, shadow, zIndex, breakpoints) membaca `tokens.json`.
  - `theming.stories.mdx` (panduan multi-tenant dan contoh override).
  - `layout.stories.mdx` (grid/containers/responsive examples).
- Tambah publish pipeline: build static + Chromatic dengan threshold konservatif; a11y audit via axe-core pada `storybook-static`.

### 6) QA Gates & CI
- ESLint a11y ruleset wajib hijau; Vitest coverage gates (lines/functions/branches/statements ≥90%).
- Script utilitas CI:
  - `scripts/ci/coverage-threshold.js`, `scripts/ci/generate-ui-test-report.js`, `scripts/ci/a11y-axe-scan.js`.
- Workflow `.github/workflows/ui-quality.yml`:
  - `tokens:normalize && tokens:build`
  - lint a11y, run tests with coverage (lcov + html)
  - build Storybook, publish Chromatic, jalankan axe-core.
  - Catatan: build di Node LTS (mis. 18) untuk kompatibilitas dependensi native.

### 7) Dokumentasi
- Update `README.md` (root) dan `docs/README.md` dengan:
  - Ikhtisar Design System, arsitektur Atomic Design, dan alur tokens → komponen.
  - Cara menjalankan pipeline tokens & Storybook, dan quality gates.
- Tambah konten di `workspace/03_Design-System/`:
  - `Foundations/Color.md`, `Typography.md`, `Spacing.md`, `Layout.md`, `Effects.md`, `Breakpoints.md`.
  - `Components/Button.md`, `Input.md`, `Card.md` (props, states, a11y guidelines, contoh kode, tautan Storybook).
  - `Theming/MultiTenant.md` (kontrak, contoh, best practices).

## Artefak & Lokasi Berkas (Target)
- Tokens: `workspace/03_Design-System/Foundations/tokens-raw.json`, `workspace/03_Design-System/tokens/*.json`, `packages/ui/src/styles/tokens/variables.css`, `packages/ui/src/theme/tokens.{ts,d.ts}`, `packages/ui/src/styles/tokens.json`.
- Theme: `packages/ui/src/theme/{ThemeProvider.tsx,getCSSVariable.ts,getThemeClass.ts,types.ts}` (terkonsolidasi), hook `useTheme` terhubung.
- Storybook: `packages/ui/.storybook/{main.ts,preview.ts}`, halaman MDX di `packages/ui/src/stories/design-system/*.mdx`.
- QA & CI: `.github/workflows/ui-quality.yml`, `scripts/ci/*.js`, `packages/ui/coverage/*`.
- Docs: root `README.md`, `docs/README.md`, `workspace/03_Design-System/**`.

## Acceptance Criteria
- Satu pipeline menghasilkan CSS/TS/JSON tokens dari sumber tunggal dan tervalidasi skema.
- ThemeProvider tunggal mendukung multi-tenant dan terpakai di app & Storybook.
- Storybook menampilkan halaman Design System yang membaca artefak tokens; Chromatic berjalan di PR.
- QA gates: a11y lint hijau, axe-core 0 pelanggaran kritis, coverage `@sba/ui` ≥90%.
- Dokumentasi lengkap dan tersambung ke stories/komponen.

## Risiko & Mitigasi
- Konflik dua sumber tokens → migrasi bertahap, deprecation notice, tests guard.
- Build Storybook native deps → pakai Node LTS di CI.
- Perubahan tokens mempengaruhi komponen → snapshot + visual regression untuk deteksi dini.

## Eksekusi Setelah Persetujuan
- Implementasi bertahap dimulai dari pipeline tokens dan konsolidasi theme; lanjutkan ke Storybook MDX, QA gates, dan dokumentasi.
- Verifikasi dengan test run + artefak coverage/axe; hasil dipublikasikan melalui CI dan disertakan dalam laporan build.