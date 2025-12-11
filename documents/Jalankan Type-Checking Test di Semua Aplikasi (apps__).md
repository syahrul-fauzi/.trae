## Ruang Lingkup
- Aplikasi dalam `apps/`: `docs`, `api`, `marketing`, `orchestrator`, `web`, `app`
- Target: skrip `type-check:test` berjalan sukses (exit code 0) di seluruh aplikasi

## Langkah Eksekusi
- Jalankan di root: `pnpm -C apps/docs type-check:test && pnpm -C apps/api type-check:test && pnpm -C apps/marketing type-check:test && pnpm -C apps/orchestrator type-check:test && pnpm -C apps/web type-check:test && pnpm -C apps/app type-check:test`
- Kumpulkan log error per aplikasi dan kelompokkan berdasarkan kategori

## Kategori Error & Strategi Perbaikan
- Skrip tidak tersedia
  - Tambah `type-check:test` pada `package.json` aplikasi (mengacu ke `tsconfig.test.json` atau konfigurasi lokal setara)
- Resolusi modul/tipe (Vitest, workspace `@sba/*`, alias `@/shared/*`)
  - Buat `types/test-stubs.d.ts` per aplikasi (deklarasi minimal untuk test)
  - Set `moduleResolution: bundler`, `types: ["vitest", "vitest/globals", "node"]`
- Ruang lingkup yang terlalu luas (memeriksa seluruh source)
  - Buat `tsconfig.test.json` terisolasi: include `types/**/*.d.ts`; exclude `src/**`, `e2e/**` (khusus test-only)
- Error sintaks/tifing di file test atau helper
  - Perbaiki blok yang rusak, pengembalian nilai, parameter implisit `any`, dan opsi tipe opsional
- Dependensi eksternal tanpa d.ts
  - Tambah stub di `types/test-stubs.d.ts` untuk modul yang tidak memiliki definisi (mis. adapter/instrumentation)

## Verifikasi
- Ulangi perintah batch `pnpm -C apps/* type-check:test` hingga seluruh aplikasi lulus
- Catat exit code dan ringkas hasil per aplikasi (pass/fail)

## Dokumentasi
- Perbarui dokumen `/home/inbox/smart-ai/sba-agentic/.trae/documents/Jalankan Type-Checking Test di Semua Aplikasi apps__.md` dengan:
  - Ringkasan perubahan per aplikasi (skrip, tsconfig, stubs)
  - Log singkat error awal → solusi → hasil akhir
  - Perintah yang digunakan untuk verifikasi

## Kriteria Penerimaan
- Semua aplikasi di `apps/` menjalankan `type-check:test` tanpa error
- Dokumen proses terbarui dan merekam perubahan serta hasil verifikasi