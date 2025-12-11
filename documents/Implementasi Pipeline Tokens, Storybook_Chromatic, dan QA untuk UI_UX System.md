## Ikhtisar
- Membangun sistem komponen UI konsisten berbasis Atomic Design (Atoms → Molecules → Organisms) dengan SSoT tokens.
- Memanfaatkan artefak yang sudah ada: `workspace/03_Design-System/Foundations/tokens-raw.json`, skrip normalisasi `tools/tokens/normalize.js`, Storybook di `packages/ui/.storybook`, dan konsumsi tokens di `packages/ui/src/styles/tokens.ts` serta `packages/ui/src/globals.css`.
- Menyatukan alur Figma → Tokens → Build → Komponen → Storybook/Chromatic → CI.

## Arsitektur & SSoT
- Sumber utama: `workspace/03_Design-System/Foundations/tokens-raw.json` (diupdate via Figma sync).
- Normalisasi ke `workspace/03_Design-System/tokens/*.json` (color, typography, spacing, radius, shadow, zIndex).
- Distribusi ke UI: generator menghasilkan CSS variables, theme config, dan typings di `packages/ui` agar konsisten dengan file yang sudah ada.

## Pipeline Tokens
- Tambah generator: `tools/tokens/build.ts` (read-only terhadap normalized JSON, generate output di UI).
- Output yang dihasilkan:
  - `packages/ui/src/styles/tokens/variables.css` (CSS vars `--color-primary`, `--spacing-sm`, dst.).
  - `packages/ui/src/theme/designTokens.ts` (diisi otomatis dari JSON; menjaga kompatibilitas existing import).
  - `packages/ui/src/theme/tokens.d.ts` (TypeScript typings untuk autocomplete).
- Skrip npm:
  - `tokens:normalize` → jalankan `node tools/tokens/normalize.js`.
  - `tokens:build` → jalankan `tsx tools/tokens/build.ts`.
- Validasi konsistensi: cek kesesuaian antara `globals.css` dan `variables.css` (warna, spacing, typography).

## Storybook & Chromatic
- Perkuat konfigurasi di `packages/ui/.storybook`:
  - `preview.ts`: impor `src/globals.css` dan `src/styles/tokens/variables.css`; pasang ThemeProvider.
  - Addons: `@storybook/addon-essentials`, `@storybook/addon-a11y`, `@storybook/addon-interactions`.
- Integrasi Chromatic:
  - Tambah skrip `ui:chromatic` dan env token.
  - Publikasi pada setiap PR, threshold visual diff diset konservatif.

## Komponen Atomic (Batch 1)
- Atoms:
  - `Button` (variants: primary, secondary, outline, ghost; states: hover, focus, disabled, loading; gunakan `class-variance-authority` dan tokens spacing/typography).
  - `Input` (text, password; states: focus/invalid/disabled; icon left/right opsional).
  - `Icon` (wrapper untuk `lucide-react`, ukuran dan warna via tokens).
  - `Label` (typography scale dari tokens).
  - `Avatar` (Radix UI Avatar; ukuran xs–xl; fallback inisial).
- Struktur:
  - `packages/ui/src/atoms/<Component>/index.tsx`
  - `packages/ui/src/atoms/<Component>/<Component>.stories.tsx`
  - `packages/ui/src/atoms/<Component>/<Component>.test.tsx`
- Molecules (setelah atoms stabil): `SearchBar`, `Card`, `Dropdown`, `Alert`.
- Organisms (fase berikut): `Navigation`, `Form`, `Modal`, `DataTable`.

## Quality Assurance
- Aksesibilitas:
  - Tambah `eslint-plugin-jsx-a11y`, aturan ketat di `packages/ui`.
  - Integrasi `@axe-core/react` pada Storybook preview untuk dev checks.
- Testing:
  - Unit/integration dengan Vitest + Testing Library.
  - Target coverage `>90%` untuk `packages/ui` (statements/branches/functions/lines).
- Visual Regression:
  - Chromatic pada setiap commit; gating pada PR bila diffs > threshold.

## CI/CD
- Skrip dan pipeline:
  - `design-tokens:sync` (Figma → raw) [manual/cron].
  - `tokens:normalize` → normalize JSON.
  - `tokens:build` → generate CSS/TS.
  - `ui:build-docs` → Storybook build.
  - `ui:chromatic` → publish visual tests.
  - `ui:test` → Vitest dengan coverage gates.
  - `ui:lint-a11y` → lint a11y.
  - `doc:lint` → lint markdown.
- Orkestrasi via Turborepo: dependensi antar tugas (normalize → build → ui → chromatic/test).

## Figma Sync
- Tambah `tools/figma/sync-tokens.ts`:
  - Ambil tokens dari Figma REST API, map ke `tokens-raw.json` (color, typography, spacing, radius, shadow, zIndex).
  - Error handling: retry, rate-limit backoff, cache snapshot.
  - Audit log: tulis `workspace/03_Design-System/Foundations/tokens-sync.log`.

## Dokumentasi
- RFC komponen di `docs/rfc/components/*` (Button, Input, Icon, Label, Avatar) meliputi API, varian, a11y, perf.
- `docs/library-map.md` diperbarui dengan dependency graph dan versi.
- Root `README.md` dan `docs/README.md` menambahkan:
  - Alur Figma → Tokens → UI.
  - Petunjuk setup, skrip, dan QA gates.

## Deliverables & Metrik
- Artefak baru: generator tokens, CSS variables, typings, komponen atoms + stories + tests, konfigurasi Storybook/Chromatic.
- Metrik keberhasilan:
  - Navigabilitas dokumentasi meningkat ≥30% (struktur & lint pass).
  - Coverage `packages/ui` ≥90%.
  - Build tokens deterministik, tanpa diff liar antar commit.

## Risiko & Mitigasi
- Ketidaksinkronan tokens TS vs CSS: gunakan generator tunggal dan verifikasi snapshot.
- Perubahan desain Figma drastis: versi tokens-raw dengan changelog, semver internal.
- Visual flakiness Chromatic: stabilisasi dengan `waitForFonts`, mock tanggal/animasi.

## Timeline (tingkat tugas)
- Minggu 1: Pipeline tokens + Storybook hardening.
- Minggu 2: Atoms Batch 1 + QA + Chromatic.
- Minggu 3: Molecules + dokumentasi + CI gates penuh.
