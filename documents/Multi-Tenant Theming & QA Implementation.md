## Tujuan
- Mengaktifkan multi-tenant theming di aplikasi dan Storybook menggunakan ThemeProvider.
- Menetapkan QA gates (Chromatic, a11y lint, coverage ≥90%) di CI untuk setiap PR.
- Memverifikasi lokal konsistensi tokens, render atoms, dan responsivitas.

## Implementasi ThemeProvider (App & Storybook)
- Aplikasi:
  - Import `ThemeProvider` dari `@sba/ui/theme` dan bungkus root layout/provider.
  - Referensi API: `packages/ui/src/theme/ThemeProvider.tsx:39-47`.
  - Contoh:
    ```tsx
    import { ThemeProvider } from '@sba/ui/theme'
    export function Providers({ children }) {
      return <ThemeProvider defaultTheme={null}>{children}</ThemeProvider>
    }
    ```
- Storybook:
  - Tambahkan decorator ThemeProvider pada `packages/ui/.storybook/preview.ts` agar stories diuji dalam konteks tema.
  - Pastikan `../src/globals.css` dan `../src/styles/tokens/variables.css` sudah diimpor.
  - Contoh decorator:
    ```tsx
    import { ThemeProvider } from '../src/theme'
    export default {
      decorators: [(Story) => <ThemeProvider defaultTheme={null}><Story/></ThemeProvider>]
    }
    ```
- Verifikasi variabel CSS tenant:
  - Uji class tema (`sba-theme` atau hasil `getThemeClass`) dan style inline `getCSSVariable` pada wrapper.

## Pengujian Theming
- Unit/integration:
  - Buat tes render ThemeProvider yang memverifikasi kelas tema dan gaya CSS terpasang.
  - Uji `setTheme` untuk mengganti tenant runtime dan dampak ke komponen atoms (mis. Button warna semantik).
- Snapshot:
  - Ambil snapshot untuk varian utama atoms (Button, Input, Label, Avatar, Icon) pada 2 mode (default vs tema custom).

## CI: Visual Regression & Gates
- Chromatic:
  - Build Storybook: `pnpm ui:build-docs`.
  - Publish: `pnpm ui:chromatic` dengan `CHROMATIC_PROJECT_TOKEN` secret.
  - Threshold konservatif (mis. `--exit-once-uploaded` + gating pada PR; target diff <5%).
- A11y lint (wajib hijau):
  - Jalankan `pnpm ui:lint-a11y` sebagai langkah wajib sebelum merge.
- Coverage ≥90%:
  - Konfigurasi Vitest coverage di `packages/ui` (statements/branches/functions/lines ≥0.9).
  - Jalankan `pnpm ui:test`; gagal bila di bawah threshold.
- Orkestrasi urutan job (PR):
  1. `pnpm tokens:normalize` → `pnpm tokens:build`
  2. `pnpm ui:lint-a11y` (gate)
  3. `pnpm ui:test` (gate, coverage)
  4. `pnpm ui:build-docs` → `pnpm ui:chromatic` (gate visual)
  5. `pnpm doc:lint`

## Validasi Lokal
- Build Storybook: `pnpm ui:build-docs`.
- Buka preview dan cek:
  - Konsistensi tokens: warna semantik, typography, spacing dari `packages/ui/src/styles/tokens/variables.css`.
  - Render atoms: Button, Input, Icon, Label, Avatar dengan varian dan states.
  - Responsivitas: uji viewport di Storybook toolbar.
- Dokumentasi hasil: buat laporan singkat (tokens, render, responsivitas, a11y) sebelum deployment.

## Deliverables
- Decorator ThemeProvider di aplikasi dan Storybook.
- Tes theming (unit/integration/snapshot) pada atoms.
- CI jobs aktif: Chromatic, a11y lint gate, coverage gate.
- Laporan validasi lokal Storybook.

## Rollout & Risiko
- Mulai dari branch feature; aktifkan gating di PR.
- Risiko flakiness visual: stabilisasi dengan font preloading, matikan animasi pada snapshot.
- Ketidaksinkronan tokens: jalankan `pnpm tokens:normalize` → `pnpm tokens:build` sebelum build docs Chromatic.
