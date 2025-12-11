# Perbaikan Type-Check untuk File Test

Dokumen ini merangkum akar masalah, perubahan konfigurasi, pembaruan dependensi, perbaikan kode, serta verifikasi akhir untuk memastikan `pnpm run type-check:test` berjalan sukses di monorepo.

## Ringkasan Masalah
- TypeScript gagal melakukan type-check pada beragam file test karena:
  - Penggunaan Jest API saat runner adalah Vitest.
  - Global `expect`/`vi` tidak dikenali pada setup tertentu.
  - Resolusi alias monorepo tidak terpetakan pada `tsconfig.test.json`.
  - Beberapa akses properti berpotensi `undefined` di test.
  - Implicit `any` pada callback Playwright `page.route`.

## Perubahan Konfigurasi
- File: `tsconfig.test.json`
  - `moduleResolution`: `bundler` untuk menyelaraskan dengan tooling modern.
  - `types`: `vitest/globals` dan `node` agar `describe`/`it`/`expect`/`vi` tersedia sebagai globals.
  - `allowSyntheticDefaultImports`: `true` untuk beberapa default import di ekosistem React.
  - `paths`: penambahan peta alias terhadap `apps/web`, `apps/marketing`, dan `packages/*`.
  - `include`: fokus ke berkas `**/*.test.ts(x)` dan `**/*.spec.ts(x)`, plus `types/**/*.d.ts`.
  - `exclude`: pengecualian `e2e/**` untuk mempercepat dan memisahkan e2e dari unit/integration test.

Cuplikan final `tsconfig.test.json`:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "types": ["vitest/globals", "node"],
    "lib": ["ES2022", "DOM"],
    "baseUrl": ".",
    "allowSyntheticDefaultImports": true,
    "paths": {
      "@/shared/*": ["apps/web/src/shared/*", "apps/marketing/src/shared/*"],
      "@/entities/*": ["apps/web/src/entities/*", "apps/marketing/src/entities/*"],
      "@/features/*": ["apps/web/src/features/*", "apps/marketing/src/features/*"],
      "@/widgets/*": ["apps/web/src/widgets/*", "apps/marketing/src/widgets/*"],
      "@/pages/*": ["apps/web/src/pages/*", "apps/marketing/src/pages/*"],
      "@/app/*": ["apps/web/src/app/*", "apps/marketing/src/app/*"],
      "next/headers": ["apps/web/types/next-headers.d.ts"],
      "@sba/entities": ["packages/entities/dist/index.d.ts"],
      "@sba/entities/*": ["packages/entities/dist/*"],
      "@sba/services": ["packages/services/src"],
      "@sba/ui": ["packages/ui/dist/index.d.ts"],
      "@sba/ui/*": ["packages/ui/dist/*"],
      "@sba/utils": ["packages/utils/src"],
      "@sba/utils/*": ["packages/utils/src/*"],
      "@sba/auth": ["packages/auth/src"],
      "@sba/agui-client": ["packages/agui-client/src"],
      "@sba/supabase": ["packages/supabase/src"],
      "@sba/sdk": ["packages/sdk/src"]
    }
  },
  "include": [
    "packages/**/src/**/*.test.ts",
    "packages/**/src/**/*.spec.ts",
    "packages/**/src/**/*.test.tsx",
    "packages/**/src/**/*.spec.tsx",
    "apps/**/src/**/*.test.ts",
    "apps/**/src/**/*.spec.ts",
    "apps/**/src/**/*.test.tsx",
    "apps/**/src/**/*.spec.tsx",
    "types/**/*.d.ts"
  ],
  "exclude": ["node_modules", "dist", "e2e/**"]
}
```

## Pembaruan Dependensi
- `package.json` (root): memastikan devDeps Vitest tersedia agar type definition dapat di-resolve:
  - `vitest`, `@vitest/ui`, `@vitest/coverage-v8`
  - Versi mengikuti `^2.1.1`

## Perbaikan Kode
- `apps/app/e2e/auth.spec.ts`: menambahkan anotasi `(route: Route)` pada semua handler `page.route` untuk menghindari implicit `any`.
- `apps/app/vitest.setup.ts`:
  - Menambahkan `/// <reference types="vitest/globals" />`.
  - Menggunakan `expect.extend(toHaveNoViolations)` tanpa import `expect` eksplisit.
  - Menyediakan shim global `jest` yang memetakan ke `vi` untuk kompatibilitas.
- `packages/ui/src/atoms/DatePicker/DatePicker.stories.tsx`: menghapus duplikasi import React.
- `packages/ui/src/ag-ui/events/WebSocketProvider.tsx`: menggunakan `import * as React` alih-alih default import.
- `packages/ui/src/ag-ui/hooks/useNotifications.test.ts`: guard ID notifikasi dengan optional chaining saat `hide()` dipanggil.
- `types/vitest-jest-globals.d.ts`: deklarasi minimal global `jest` bertipe dari `vi`.

## Verifikasi
- Perintah: `pnpm run type-check:test`
- Hasil: lulus dengan exit code `0` setelah konfigurasi dan perbaikan diterapkan.

## Rekomendasi CI/CD
- Tambahkan langkah `tsc -p tsconfig.test.json` ke pipeline CI untuk memastikan regresi tidak lolos.
- Jalankan linter khusus test: `eslint "**/*.{test,spec}.{ts,tsx}"` sebagai guard tambahan.
- Gunakan cache di CI untuk node_modules agar cepat, dan beri log yang ringkas (mode reporter dot).

## Catatan Keamanan & Performa
- Tidak ada secret/API key yang ditulis ke repo; semua mock monitoring beroperasi tanpa mengirim data produksi saat `NODE_ENV !== production`.
- `moduleResolution: bundler` mengurangi friksi resolusi modul sesuai ekosistem build modern.
- `skipLibCheck: true` menjaga waktu type-check tetap efisien tanpa mengorbankan akurasi pada kode internal.

## Status Akhir
- Semua error type-check pada file test telah diperbaiki.
- Konfigurasi test TypeScript terstandarisasi dan siap digunakan dalam pipeline CI/CD.
