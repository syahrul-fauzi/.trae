## Tujuan
- Melengkapi style guide dengan halaman Design Principles dan Accessibility Guidelines (WCAG) terintegrasi dengan Storybook.
- Menyelaraskan Tailwind (opsional) dengan tokens sebagai preset yang dapat digunakan lintas proyek.
- Memperkuat CI/CD: build Storybook di Node LTS, uji interaksi, Chromatic visual regression, notifikasi dan kriteria approval.

## 1) Halaman Dokumentasi MDX
### File & Struktur
- `packages/ui/src/stories/design-system/design-principles.stories.mdx`
- `packages/ui/src/stories/design-system/accessibility-guidelines.stories.mdx`

### Konten Design Principles
- Filosofi desain: konsistensi, sistem token, reusabilitas (Atomic Design), skalabilitas.
- Prinsip penggunaan komponen: pemilihan varian/size, states (hover/focus/active/disabled), komposisi molecules/organisms.
- Best practices implementasi: pemetaan tokens → style, hindari style ad-hoc, gunakan utilitas (cn, class-variance-authority), kontrol props.
- Tautan ke komponen terkait: Button, Input, Card, Select, Tabs, Toast (link ke stories yang sudah ada).

### Konten Accessibility Guidelines (WCAG)
- Standar A/AA: color contrast (≥4.5:1 teks normal, ≥3:1 teks besar), keyboard navigation, focus management, ARIA roles/labels.
- Panduan per komponen: Button (role/button, key Enter/Space), Input (label/aria-describedby), Select/Tabs (roving focus, ARIA roletype, disabled states), Toast/Tooltip (timing, dismiss, aria-live), Dialog (focus trap, escape to close).
- Referensi contoh kode dan do/don’t; checklist a11y untuk PR.
- Integrasi dengan tokens: variabel focus ring, min touch target/spacing.

### Integrasi Storybook
- Meta title di bawah: `Design System/Guidelines/*` dan `Design System/Foundations/*` (menjaga navigasi konsisten).
- Gunakan Docs Mode; tautkan stories komponen dengan `<Anchor story="..." />` atau link relatif.

## 2) Penyelerasan Tailwind (Opsional)
### Preset Tailwind
- Tambahkan: `packages/ui/tailwind/preset.ts` yang memetakan `tokens.json` ke konfigurasi `theme` Tailwind.
- Mapping:
  - `theme.colors` → semantic + brand dari tokens
  - `theme.spacing` → scale (px/rem konsisten)
  - `theme.fontFamily` → `typography.fontFamilies`
  - `theme.fontSize` → `typography.sizes`
  - `theme.borderRadius` → `radius`
  - `theme.boxShadow` → `shadow`
  - `theme.screens` → `breakpoints`
- Dokumentasi penggunaan preset di proyek lain: contoh `tailwind.config.ts` yang meng-extend preset.
- Verifikasi konsistensi: snapshot config vs `tokens.json` di test.

## 3) CI/CD Pipeline
### Workflow
- Perluas `.github/workflows/ui-quality.yml`:
  - Pastikan Node `18.x` untuk build Storybook stabil.
  - `tokens:normalize && tokens:build`
  - Lint a11y, unit + integration tests (Testing Library, jsdom) dengan coverage laporan `lcov` + `html`.
  - Build Storybook (`packages/ui/.storybook`) dan publish Chromatic.
  - Axe-core scan pada `storybook-static` (WCAG AA) dengan threshold 0 untuk pelanggaran kritis.

### Chromatic & Visual Regression
- Set threshold konservatif (mis. `--exit-zero-on-changes` + `--auto-accept-changes` untuk minor) dan label wajib review ketika delta >5%.
- Monitoring otomatis setiap PR; tambahkan komentar PR bila ada perubahan visual signifikan (Chromatic GitHub App).
- Kriteria approval: perubahan visual signifikan memerlukan persetujuan desainer (label `design-review` atau status cek khusus).

### Notifikasi
- GitHub PR status + komentar otomatis oleh Chromatic; (opsional) integrasi Slack/Webhook untuk tim desain.

## 4) Kriteria Keberhasilan
- Style guide lengkap: halaman Design Principles dan Accessibility Guidelines tampil di Storybook, tautan ke komponen berfungsi.
- Konsistensi tokens ↔ Tailwind preset (opsional) tervalidasi oleh tes snapshot konfigurasi.
- Build Storybook stabil di CI (Node 18); artefak `storybook-static` tersedia.
- Chromatic mendeteksi perubahan visual; perubahan di atas threshold memicu review dan notifikasi.
- Axe scan tanpa pelanggaran kritis; lint a11y hijau; coverage `@sba/ui` ≥90%.

## Risiko & Mitigasi
- Ketidaksesuaian tokens dengan Tailwind: gunakan preset dan tes snapshot untuk menjaga sinkronisasi.
- Native deps Storybook: jalankan di Node LTS (18) pada CI.
- False positive perubahan visual: set threshold konservatif dan gunakan daftar pengecualian (externals/stabilize stories).

## Implementasi Setelah Disetujui
- Tambah dua halaman MDX dengan konten dan tautan.
- Buat Tailwind preset dari `tokens.json` + dokumentasi penggunaan (opsional jika diperlukan lintas proyek).
- Perluas workflow CI untuk interaksi, Chromatic gating, dan axe scan.
- Tambahkan tes snapshot konfigurasi Tailwind (opsional) dan checklist a11y di PR template.
