## Tujuan
- Membangun fondasi visual UI konsisten, berbasis tokens dan Tailwind, terintegrasi penuh dengan `packages/ui`, mendukung skala produk.

## Ruang Lingkup
- Foundations: color, typography, spacing, radius/border, shadow, breakpoints, grid.
- Components: atomic level (Button, Input, Card) dengan states/variants.
- Layout guidelines: container widths, grid responsive, spacing 4px/8px baseline.
- Dokumentasi: struktur `workspace/03_Design-System/Foundations/` dan `Components/`, panduan di README (root & docs).

## Implementasi Tokens
- Sumber: Figma (bila tersedia) → `tokens-raw.json` → normalisasi ke `workspace/03_Design-System/tokens/*.json`.
- Konversi: generator mengeluarkan CSS variables (`packages/ui/src/styles/tokens/variables.css`), typings (`tokens.d.ts`), dan modul TS (`tokens.ts`).
- Cakupan tokens:
  - Warna: brand + semantic (success/warning/error/info) dan text/background.
  - Tipografi: font families (base/mono), sizes, weights, line-heights.
  - Spacing: skala 4/8/12/16/24 px (baseline 4/8) + container gutters.
  - Radius: sm/md/lg + border definitions.
  - Shadow: sm/md/lg.
  - Breakpoints: sm/md/lg/xl/2xl.
  - Grid: kolom, gutters, container widths (mobile/tablet/desktop).
- Kompatibilitas Tailwind: pastikan kelas util memakai HSL CSS vars untuk theme; tokens CSS tersedia global.

## Sistem Layout
- Grid responsif: 12-col desktop, 8-col tablet, 4-col mobile; gutters konsisten.
- Container widths: contoh 640/768/1024/1280/1536 px, dengan max-width dan padding.
- Spacing baseline: 4/8 px → mapping util (gap/padding/margin) yang konsisten.

## Komponen Dasar AG-UI
- Button:
  - Variants: default/secondary/outline/ghost/destructive; states: hover/focus/active/disabled/loading.
  - Size: xs/sm/default/lg/icon; a11y ring & min touch target.
- Input:
  - States: normal/error/success/disabled; icon left/right; proper ARIA (aria-invalid, aria-errormessage).
- Card:
  - Sections: Header/Title/Description/Content/Footer; mode interactive (hover/focus-within ring) dan default.

## Dokumentasi
- Struktur:
  - `workspace/03_Design-System/Foundations/` (tokens-raw, tokens normalized, grid/breakpoints doc, typography guide).
  - `workspace/03_Design-System/Components/` (Button/Input/Card spec: props, states, variants, a11y, patterns).
- Update README (root & docs):
  - Alur Figma → Tokens → CSS variables → Komponen.
  - Cara pakai tokens dan komponen (imports, props, examples).

## Proses Kerja
1. Sinkronisasi tokens dari Figma → `tokens-raw.json` (FIGMA_TOKEN/FILE_ID).
2. Jalankan normalisasi → hasil JSON per domain (color/typography/spacing/radius/shadow/zindex).
3. Jalankan konversi ke CSS variables/typings/module TS.
4. Review a11y/visual; perbaiki mismatch; commit doc perubahan.
5. Siklus konsistensi berkala (lint doc, xref, visual audit).

## Standar Kualitas
- Konsistensi visual lintas komponen & varian; a11y WCAG AA.
- Responsif di breakpoints; min touch target; fokus ring.
- Dokumentasi jelas: style guide (warna, tipografi, ikon, layout), component specs.

## Validasi & QA
- Unit + snapshot untuk atoms (states/variants/props lengkap) → coverage ≥90% untuk `packages/ui` (CI gate minimal 80%).
- Integration tests (keyboard/mouse) untuk Select/Tabs/Toast; validasi ARIA roles dan perilaku.
- Storybook:
  - Addons essentials/a11y/interactions; decorator `ThemeProvider` + impor tokens CSS.
  - Stories untuk semua state/varian; gunakan Controls untuk props.
- Visual regression Chromatic pada PR; auto-accept minor changes; threshold konservatif.

## Deliverables
- Tokens normalized + CSS variables + typings + TS module.
- Layout & spacing/grid guidelines.
- Komponen dasar AG-UI (Button/Input/Card) siap pakai dengan docs.
- README (root & docs) diperbarui; struktur `Foundations/` dan `Components/` di workspace.

## Risiko & Mitigasi
- Ketidaksinkronan design ↔ tokens: enforce generator tunggal dan snapshot tokens.
- Perbedaan font/ikon antar platform: definisikan fallback & guidelines.
- Flakiness visual: stabilisasi fonts, matikan animasi di snapshot.

## Timeline (tugas)
- Minggu 1: Tokens (Figma→normalize→CSS vars) + Layout guidelines.
- Minggu 2: Button/Input/Card + docs & tests.
- Minggu 3: QA (a11y/coverage/Chromatic), README & publikasi.
