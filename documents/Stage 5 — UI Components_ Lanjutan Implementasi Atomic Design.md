## Sasaran
- Menuntaskan standarisasi struktur komponen per level (atoms/molecules/organisms/patterns/layouts) dan melengkapi dokumentasi + pengujian.
- Memastikan setiap komponen memiliki props TypeScript ketat, states interaksi lengkap, a11y WCAG 2.1 AA, dan stories yang komprehensif.

## Target Komponen
- Atoms: Button, Input, Textarea, Select, Switch, Badge, Progress, Icon, Tooltip, Dialog, Label, Avatar.
- Molecules: FormField, SearchBar, Breadcrumb, StatusCard.
- Organisms: DataTable, PageHeader, Sidebar, Header.
- Patterns (AG‑UI): panel/pola integrasi events/analytics tambahan di samping `AGAnalyticsPanel`.
- Layouts/Templates: `AuthLayout` dan `DashboardLayout` penyatuan props & landmark a11y.

## Langkah Implementasi
- Penataan folder komponen: pindahkan file ke `packages/ui/src/<level>/<ComponentName>/` berisi `index.ts`, `.tsx`, `.stories.tsx`, `.spec.ts`.
- Props & JSDoc: tambahkan interface `Props` eksplisit, default/required props, JSDoc untuk autogen tabel props di Storybook.
- Interaction states: tambahkan state hover/focus/active/disabled serta loading/error; micro‑interactions ringan.
- Aksesibilitas: lengkapi ARIA (`aria-expanded/controls/invalid`, role yang tepat), focus ring, keyboard navigation.

## Dokumentasi Storybook
- Skenario untuk tiap komponen: dasar, advanced, state (active/disabled/loading/error), responsive.
- Controls aktif untuk semua props; catatan a11y per komponen.
- Build Storybook untuk review.

## Pengujian & CI
- Unit + interaction tests dengan `@testing-library/*` + `user-event` (≥1 interaksi per komponen).
- A11y baseline (jest‑axe) di komponen yang relevan.
- Coverage komponen baru ≥80% dan integrasi ke pipeline (lint, type‑check, tests, build Storybook).

## Konsolidasi Layouts
- `AuthLayout` (packages/ui/src/templates/AuthLayout/AuthLayout.tsx:22) validasi overlay/landmarks + a11y, states sosial login.
- `DashboardLayout`: pastikan landmark `main/nav/header` aksesibel dan props konsisten.

## Panduan & Generator
- Lengkapi `docs/development/ui-components-guide.md` dengan contoh pola umum dan checklist submit.
- (Opsional) Tambah script generator skeleton komponen agar konsisten.

## Kriteria Penerimaan
- Struktur per level standar, stories lengkap, tests hijau dengan coverage, a11y checks bersih.
- Build Storybook dan CI berjalan hijau.

## Deliverables
- Komponen tersusun (atoms→molecules→organisms→patterns→layouts) dengan dokumentasi & tests.
- Build Storybook stabil; panduan developer diperbarui.