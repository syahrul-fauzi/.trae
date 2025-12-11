## Sasaran
- Menyusun library UI reusable berbasis Atomic Design untuk SBA dashboard.
- Menstandarkan struktur berkas, dokumentasi Storybook, a11y, dan testing.
- Mengintegrasikan ke CI (build Storybook, a11y checks, coverage) tanpa mengganggu pola yang sudah ada.

## Audit Singkat Repo
- Storybook sudah tersedia (`packages/ui/.storybook/main.ts`, `preview.tsx`) dengan addons a11y & interactions.
- Struktur Atomic sebagian sudah ada: `atoms/`, `molecules/`, `organisms/`, `templates/` dan `ag-ui/`.
- Contoh yang relevan: `AuthLayout` (`packages/ui/src/templates/AuthLayout/AuthLayout.tsx`, prop `overlayColor` di baris 22), `DashboardLayout`, `StatusCard`, `FormField`, `Icon`, `Select`, dsb.

## Struktur Direktori Komponen
- Bentuk standar: `packages/ui/src/<level>/<ComponentName>/`
  - `index.ts` (ekspor utama)
  - `<ComponentName>.tsx` (implementasi)
  - `<ComponentName>.stories.tsx` (dokumentasi Storybook)
  - `<ComponentName>.spec.ts` (unit/interaction test)
- Rencana penataan:
  - Atoms: `Button`, `Input`, `Typography`, `Icon`, `Badge`, `Progress`, `Switch`, `Select`, `Textarea` → rapikan ke folder per-komponen.
  - Molecules: `FormField`, `SearchBar`, `Breadcrumb`, `StatusCard` → folder per-komponen.
  - Organisms: `DataTable`, `PageHeader`, `Sidebar`, `Header` → folder per-komponen.
  - Patterns (AG-UI): `AGDialog`, `AGAnalytics`, `AGButton`, `WebSocketMetrics` → dokumentasi pola dan use cases.
  - Layouts: `AuthLayout`, `DashboardLayout`, `AGDashboardTemplate` → konsolidasikan props & a11y.

## Standar Implementasi
- TypeScript strict: semua komponen memiliki `Props` interface eksplisit, default props, required props, dan JSDoc.
- Interaction states: hover/focus/active/disabled, error/loading; micro‑interactions (CSS transitions/ARIA live region jika relevan).
- Aksesibilitas: WCAG 2.1 AA, ARIA lengkap, focus ring konsisten, keyboard navigation (Tab/Shift+Tab/Space/Enter/Escape) diuji.
- Responsivitas: contoh penggunaan menampilkan perilaku di breakpoint (mobile/tablet/desktop).

## Dokumentasi Storybook
- Untuk setiap komponen:
  - Controls untuk semua props; tabel props (auto dari TS + JSDoc).
  - Stories: dasar, advanced, states (active/disabled/loading/error), a11y notes, responsive.
  - Patterns (AG‑UI): tambahkan stories yang mendemokan event agent, SSE/WebSocket metrics.

## Testing
- Unit + interaction: `@testing-library/react` + `user-event` untuk setiap komponen (minimal 1 interaction test).
- A11y: `jest-axe` untuk snapshot a11y dasar; gunakan `@storybook/addon-a11y` pada stories.
- Coverage: target ≥80% pada komponen baru; tambahkan ke laporan CI.

## Generator Komponen (Opsional)
- CLI sederhana (scripts/generator) untuk membuat skeleton: `index.ts`, `.tsx`, `.stories.tsx`, `.spec.ts` sesuai level.
- Enforce penamaan `PascalCase` untuk `ComponentName` dan kebijakan ekspor di `index.ts`.

## Integrasi CI
- Langkah build: `storybook build` untuk `packages/ui`.
- Validasi: lint (TS/ESLint), type‑check, unit tests, a11y jest‑axe.
- Publikasi: integrasi `chromatic` (opsional) menggunakan build Storybook yang sudah siap.

## Roadmap Implementasi
- Fase 1 (Atoms): standarisasi `Button`, `Input`, `Typography`, `Icon`, `Badge`, `Progress`, `Switch`, `Select`, `Textarea` (struktur, stories, tests, a11y).
- Fase 2 (Molecules): `FormField`, `SearchBar`, `Breadcrumb`, `StatusCard` (prop props ketat, states, stories, tests).
- Fase 3 (Organisms): `DataTable`, `PageHeader`, `Sidebar`, `Header` (kompleksitas interaksi & a11y fokus).
- Fase 4 (Patterns & Layouts): dokumentasi pola AG‑UI (events, analytics) dan penyatuan props `AuthLayout`/`DashboardLayout` dengan a11y.

## Kriteria Penerimaan
- Struktur direktori standar terpenuhi untuk komponen yang ditarget.
- Storybook memiliki dokumentasi lengkap, a11y check bersih.
- Test interaksi minimal per komponen; coverage ≥80% untuk komponen baru.
- CI menjalankan build Storybook, lint, type‑check, tests; hasil hijau.

## Deliverables
- Komponen tersusun per level Atomic dengan dokumen & tests.
- Storybook siap review (local build dan opsi Chromatic).
- Panduan pengembang: cara membuat komponen baru, konvensi props, a11y checklist, dan pola AG‑UI terstandar.