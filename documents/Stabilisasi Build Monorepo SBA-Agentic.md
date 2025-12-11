## Ringkasan Analisis
- Monorepo dengan Turborepo; aplikasi: `apps/app` (Next 15), `apps/web` (Next 14.2.7), `apps/docs` (Next 15), `apps/api` (Nest + tsc).
- Ketidakkonsistenan tooling versi lint/TS:
  - `apps/app` memakai `eslint@^8.57.1` sedangkan proyek lain `eslint@^9.x` → berisiko gagal lint pada Next 15.
  - Versi TypeScript berbeda: root `^5.3.0`, web/docs `~5.8.3`, app `^5.6.2` → berpotensi type-check error lintas workspace.
- Path alias TS banyak menunjuk ke `packages/*/dist/*.d.ts` → bisa gagal type-check/build jika paket belum dibangun dulu.
- `apps/app/next.config.js` mengaktifkan `experimental.optimizeCss: true` (pernah memicu error di dev). Build aman, dev rawan.
- `apps/api` TS menggunakan `moduleResolution: node`, sedangkan app/web/docs `bundler` → perlu konsisten lintas paket untuk kompatibilitas.

## Rencana Perbaikan
### 1) Klasifikasi Error Build Nyata
- Jalankan `pnpm build` (turbo) dan kumpulkan error per workspace (Next, Nest, packages).
- Kategorikan: compilation, dependency/version, type errors, import/export.

### 2) Sinkronisasi Tooling Versi
- TypeScript: selaraskan ke satu versi yang kompatibel dengan Next 15 (mis. `^5.6.x` atau versi terbaru stabil). Terapkan di root dan hapus versi TS duplikat per-app bila memungkinkan.
- ESLint: naikkan `apps/app` ke `eslint@^9.x` agar cocok dengan `eslint-config-next@^15.0.0`.
- @types/react dan @types/react-dom: selaraskan sesuai override root dan Next (gunakan satu versi 18.3.x konsisten).

### 3) Urutan Build Paket Internal
- Pastikan `packages/*` build dahulu sebelum app/web/docs agar file `dist/*.d.ts` tersedia.
- Tambah dependensi pipeline Turbo: target `build` app/web/docs bergantung pada `^build` packages.

### 4) Konsistensi Konfigurasi TS
- Samakan `moduleResolution` ke `bundler` untuk aplikasi Next, tetap `node` untuk `apps/api` (Nest) dan pastikan batasan antar-paket jelas.
- Revisi path alias agar punya fallback ke `src` selain `dist` untuk mencegah gagal ketika `dist` belum tersedia.

### 5) Perbaikan Kode Penyebab Error
- Perbaiki import/export yang melintasi boundary ESM/CJS (pastikan semua ESM di Next/Nest konsisten).
- Perbaiki type errors pada area yang menyangkut alias `@sba/*` sesuai definisi aktual paket.
- Jika ada masalah SWC/Next 15 terhadap API tertentu, sesuaikan sintaks (mis. penggunaan `next/headers`, route handler App Router) sesuai versi.

### 6) Verifikasi Ulang Build
- Jalankan ulang `pnpm build` dan verifikasi tidak ada error.
- Pastikan output `dist/**` untuk api dan `.next/**` untuk app/web/docs terbentuk sesuai Turbo.

### 7) Pencegahan Ke Depan
- Tambahkan job CI “type-check + build” untuk semua workspace.
- Tambahkan pre-commit hook minimal: type-check monorepo dan lint untuk mencegah regresi.
- Dokumentasikan matrix versi (Next, TS, ESLint, React) di `CONTRIBUTING.md` agar konsisten.

## Langkah Eksekusi Detail (setelah disetujui)
1. Jalankan `pnpm build` dan salin log error; buat daftar masalah spesifik per workspace.
2. Terapkan sinkronisasi versi TS/ESLint dan revisi pipeline Turbo bila diperlukan.
3. Perbaiki alias TS (`tsconfig.json` app/web/docs) agar fallback ke `src` ada.
4. Revisi impor/ekspor dan types di modul yang error.
5. Jalankan ulang build untuk validasi; bila lolos, tambahkan guard di CI dan pre-commit.

Konfirmasi untuk melanjutkan eksekusi rencana ini. Setelah Anda setuju, saya akan menjalankan build, melakukan perbaikan terarah, dan memverifikasi hingga bersih tanpa error di dev dan production.