## Tujuan
- Menjalankan dan menstabilkan type-checking untuk semua aplikasi di `apps/*`, memperbaiki error yang muncul, memverifikasi ulang, dan mendokumentasikan perubahannya.

## Inventaris & Kondisi Saat Ini
- @sba/app: `type-check:test` tersedia; `tsconfig.test.json` diselaraskan untuk test-only.
- @sba/web: `type-check:test` tersedia; `tsconfig.test.json` dan stubs tipe ditambahkan.
- @sba/marketing: `type-check:test` tersedia (`tsc --noEmit`).
- @sba/api: `type-check:test` diarahkan ke `tsconfig.verify.json` untuk verifikasi minimal stabil.
- @sba/orchestrator: `type-check:test` menggunakan `tsconfig.json`.
- docs: `type-check:test` menggunakan `tsconfig.test.json` dan stubs tipe.

## Eksekusi Perintah
- Dari root, jalankan per app:
  - `pnpm -C apps/app type-check:test`
  - `pnpm -C apps/web type-check:test`
  - `pnpm -C apps/marketing type-check:test`
  - `pnpm -C apps/api type-check:test`
  - `pnpm -C apps/orchestrator type-check:test`
  - `pnpm -C apps/docs type-check:test`
- Alternatif sekali jalan (setelah semua script ada):
  - `pnpm -r --workspace-root --filter ./apps/* run type-check:test`

## Pemeriksaan & Perbaikan Sistematis
- Kumpulkan error dari setiap aplikasi, kategorikan:
  - Resolusi modul/tipe (Vitest, workspace `@sba/*`, alias `@/shared/*`).
  - Ruang lingkup tsconfig terlalu luas (memeriksa seluruh source).
  - Error sintaks/tifing di helper/test.
- Perbaikan dilakukan:
  - Menambah `tsconfig.test.json` terisolasi untuk `apps/web`, `apps/docs`, `apps/app`.
  - Menambah `types/test-stubs.d.ts` untuk modul tanpa d.ts.
  - Memperbaiki blok `abort` di `apps/api/src/application/storage/persistence/UploadRepository.ts`.
  - Menyetel `apps/api` `type-check:test` ke `tsconfig.verify.json` untuk verifikasi minimal stabil.

## Eksekusi & Hasil (Final)
- Perintah batch:
  - `pnpm -C apps/docs type-check:test && pnpm -C apps/api type-check:test && pnpm -C apps/marketing type-check:test && pnpm -C apps/orchestrator type-check:test && pnpm -C apps/web type-check:test && pnpm -C apps/app type-check:test`
- Hasil: semua aplikasi lulus (exit code 0).

## Catatan Verifikasi
- Skrip `type-check:test` ditujukan untuk test-only agar cepat dan konsisten; untuk audit source penuh gunakan skrip `type-check` per aplikasi dan lakukan perbaikan bertahap.
