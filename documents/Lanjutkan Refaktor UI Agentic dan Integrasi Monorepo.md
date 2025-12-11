## Ringkasan Status
- Struktur atomic (`atoms/molecules/organisms/templates`) telah tersedia dan diekspor dari `packages/ui/src/index.ts`.
- `AuthLayout` sudah ada beserta stories dan tests: `packages/ui/src/templates/AuthLayout/*` dan diekspor di `packages/ui/src/templates/index.ts:3`.
- HeatmapTracker terduplikasi pada `src/analytics/HeatmapTracker.tsx` dan `src/ui/analytics/HeatmapTracker.tsx`; export map di `packages/ui/package.json` saat ini menunjuk ke jalur `ui/analytics`.
- Design tokens tersedia: `packages/ui/src/styles/tokens.ts` dan helper: `packages/ui/src/styles/design-tokens.ts`.

## Tujuan & Deliverables
- Konsolidasikan HeatmapTracker ke satu sumber (`src/ui/analytics/HeatmapTracker.tsx`) dan hapus duplikasi.
- Finalisasi `AuthLayout` agar konsisten dengan dokumen `apps/app/docs/auth-flows-user-guide.md`.
- Rapikan ekspor atomic dan subpath exports di `packages/ui/package.json` untuk templates/organisms.
- Perkuat theming multi-tenant: dokumentasi `ThemeProvider`, `getThemeClass`, `getCSSVariable` dan contoh penggunaan.
- Pastikan konsistensi API komponen (props, naming) dan hapus duplikasi file (mis. `atoms/Dialog.tsx` vs `atoms/Dialog/Dialog.tsx`).
- Verifikasi lint/type-check/tests/build di `@sba/ui`, integrasi di `apps/web` dan `workspace/header-sidebar-app`.

## Langkah Implementasi
1. **Konsolidasi HeatmapTracker**
   - Hapus `packages/ui/src/analytics/HeatmapTracker.tsx` dan pastikan semua impor memakai `src/ui/analytics/HeatmapTracker.tsx`.
   - Validasi ekspor di `packages/ui/src/index.ts:32` dan subpath export di `packages/ui/package.json:78-82` tetap menunjuk ke jalur `ui/analytics`.

2. **Finalisasi AuthLayout & Sinkronisasi Dokumen**
   - Audit API `AuthLayout` di `packages/ui/src/templates/AuthLayout/AuthLayout.tsx` untuk ARIA, ikon, dan variant.
   - Samakan terminologi, alur, dan opsi dengan `apps/app/docs/auth-flows-user-guide.md` (login, register, reset-password, verify-email).
   - Lengkapi tests di `packages/ui/src/templates/__tests__/AuthLayout.*` agar mencakup render kondisi wajib dan a11y (role/label).

3. **Ekspor Atomic & Subpath Exports**
   - Tinjau `packages/ui/src/index.ts` agar ekspor bernuansa atomic dan namespaced (atoms/molecules/organisms/templates).
   - Tambahkan subpath exports untuk `templates`/`organisms` di `packages/ui/package.json` bila diperlukan untuk impor parsial (mis. `@sba/ui/templates/AuthLayout`).

4. **Theming Multi‑Tenant**
   - Dokumentasikan pola penggunaan `designTokens`, `ThemeProvider`/helper (`getThemeClass`, `getCSSVariable`) di `packages/ui/docs/components.md`.
   - Tambah Storybook contoh per-tenant (enterprise/startup/academic) memanfaatkan CSS variables.

5. **Hapus Duplikasi & Standarisasi API**
   - Identifikasi duplikasi: `packages/ui/src/atoms/Dialog.tsx` vs `packages/ui/src/atoms/Dialog/Dialog.tsx`, `Separator.tsx` vs `atoms/Separator/Separator.tsx`.
   - Hapus yang legacy dan betulkan semua impor internal agar konsisten ke struktur folder resmi.

6. **Verifikasi Integrasi & Build**
   - `@sba/ui`: lint → type-check → unit/a11y tests → build.
   - `apps/web` dan `workspace/header-sidebar-app`: verifikasi penggunaan Sidebar/Header/AuthLayout, HeatmapTracker, dan theming.
   - Dokumentasikan hasil verifikasi (ringkas: lulus/tidak, cakupan, isu yang diperbaiki).

## Pemeriksaan Konsistensi
- Konvensi penamaan komponen/props seragam, tidak ada casing/alias ganda.
- Semua ekspor publik berasal dari barrel yang resmi; tidak ada jalur internal bocor.
- Token dan helper tidak menduplikasi nilai; semua berasal dari `styles/tokens.ts`.

## Persyaratan Kualitas
- Type-check hijau, unit/a11y tests hijau, build sukses ESM+CJS+DTS.
- Storybook berjalan dengan kisah per-tenant dan AuthFlow lengkap.
- Tidak ada duplikasi file di `src` yang diekspor publik.

## Update Status Berkala
- Setelah setiap langkah selesai, kirim ringkasan: perubahan, verifikasi, dan dampak.
- Penutupan pekerjaan dengan daftar deliverables terverifikasi (kode, tests, stories, docs).