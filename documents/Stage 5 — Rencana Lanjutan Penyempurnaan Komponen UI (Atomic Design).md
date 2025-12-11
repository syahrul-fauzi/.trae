## Sasaran
- Menyelesaikan penyelarasan struktur dan kualitas komponen di semua level (atoms/molecules/organisms/patterns/layouts).
- Melengkapi dokumentasi Storybook dan pengujian interaksi/a11y dengan target coverage ≥80% untuk komponen yang belum lengkap.

## Backlog & Prioritas
- Atoms: lengkapi stories/tests untuk Input, Select, Tooltip, Dialog, Progress, Switch, Textarea, Icon, Badge (variasi states + a11y).
- Molecules: FormField, SearchBar, Breadcrumb, StatusCard (prop props ketat, kombinasi props kompleks, responsive).
- Organisms: DataTable (sort/filter/empty/error states), Sidebar (collapsed + keyboard nav), Header (menu toggle + searchbar a11y), PageHeader (breadcrumbs + actions).
- Patterns (AG‑UI): tambah `AGNotificationsPanel` dan `WebSocketMetricsPanel` (konsisten dengan `AGAnalyticsPanel` pola panel collapsible + a11y + stories + tests).
- Layouts/Templates: konsolidasi landmark & skip-link di `AuthLayout` dan `DashboardLayout`; dokumentasikan prop overlay/background + contoh responsif.

## Dokumentasi Storybook
- Tambah stories: dasar/advanced/states/responsive untuk semua komponen target.
- Aktifkan controls dan tabel props (berbasis JSDoc) per stories; catatan aksesibilitas tiap komponen.
- (Opsional) MDX docs singkat untuk pola AG‑UI.

## Pengujian
- Interaction tests per komponen dengan `@testing-library/react` + `user-event` (klik, fokus, keyboard nav, toggle states).
- A11y baseline dengan `jest-axe` untuk komponen form, dialog, navigasi.
- Tambahkan skenario edge (loading/error/disabled/empty) untuk organisms dan patterns.

## CI & Kualitas
- Pastikan build Storybook untuk `packages/ui` dan jalankan lint/type‑check/tests.
- Coverage report di paket UI dengan threshold ≥80% pada komponen baru; integrasi dengan pipeline yang ada.

## Dokumentasi Developer
- Perluas `docs/development/ui-components-guide.md` dengan contoh best‑practice (keyboard patterns, ARIA per komponen, micro‑interactions) dan checklist submit.
- (Opsional) Tambah script generator skeleton komponen untuk konsistensi struktur.

## Kriteria Penerimaan
- Komponen di semua level memiliki struktur folder standar, props ketat, stories komprehensif, pengujian interaksi/a11y hijau, coverage terpenuhi.
- Storybook build stabil; panduan developer diperbarui; pola AG‑UI ditambah dan terdokumentasi.

## Deliverables
- Komponen tersusun dan terdokumentasi (atoms→molecules→organisms→patterns→layouts).
- Stories dan tests menyeluruh; hasil CI hijau dengan coverage sesuai target.