## Sasaran
- Menjalankan type‑checking menyeluruh untuk semua aplikasi/paket dan menstabilkan hasil sehingga dapat diintegrasikan ke CI tanpa noise.
- Memastikan E2E tetap jalan dengan perintah yang benar, terpisah dari type‑check.

## Temuan Utama (Sumber Error)
- Hook chat menghasilkan `never[]` karena inferensi array (apps/web/src/features/chat/hooks/useChatOptimizations.ts:61–79).
- Typing ketat di Zustand persist (apps/web/src/processes/auth/model/auth.store.ts:65–66, 436–437).
- Adapter repository memakai tipe nilai vs type alias dan akses `apiClient.conversations|documents|messages` tanpa deklarasi saat tsc test (apps/web/src/shared/api/adapters/*.ts; contoh document.repository.supabase.ts:43, 501, 719).
- Alias UI belum lengkap saat type‑check (mis. CardDescription/CardFooter, label/select/dialog/input/icons/avatar) di berbagai fitur (contoh apps/app/src/features/analytics/ui/*.tsx, hub/insight/*).
- Domain/shared util belum dideklarasikan untuk test type‑check (`User`, SEO generators, `formatRelativeTime`, `SafeIcon`).

## Rencana Teknis (SOLO Coder)
1) Anotasi eksplisit di hook chat
- Tambah tipe pada `grouped` dan `currentGroup` untuk mencegah `never[]`:
  - File: apps/web/src/features/chat/hooks/useChatOptimizations.ts
  - `const grouped: Array<{ role: string | null; messages: any[]; timestamp: any }>`
  - `let currentGroup: any[] = []`

2) Lengkapi stub UI & alias internal untuk type‑check
- Perluas `types/stubs/test-env.d.ts` agar mencakup:
  - `@sba/ui/label`, `@sba/ui/select` (SelectTrigger/Content/Item/Value), `@sba/ui/input`, `@sba/ui/dialog`, `@sba/ui/icons`, `@sba/ui/avatar`
  - Tambahan export `CardDescription`, `CardFooter` pada `@sba/ui/card`
  - Domain: `@/domains/auth/types/auth.types` → export `User`
  - SEO: `@/domains/seo/use-cases/generateRouteMetadata|generateMetadata` → fungsi stub
  - Shared util: `@/shared/lib/utils` → `formatRelativeTime`
  - Shared UI: `@/shared/ui` → `SafeIcon`
  - Supabase server: `@/lib/supabase/server` → `createClient` stub

3) Konsistensi `ApiClient` untuk adapter repository
- Tambah deklarasi `ApiClient` dan `apiClient` di stub (sudah mulai ditambahkan) agar properti `conversations|documents|messages` dikenali saat test type‑check.
- Alias type untuk `DocumentAggregate` (sudah ditambahkan) guna menghindari bentrok nilai/type pada posisi tipe.

4) Penyesuaian tsconfig test per paket (bila diperlukan)
- Tambah `vitest-env.d.ts` di paket yang memiliki test (packages/sdk, packages/tools) dan referensikan `vitest/globals`.
- Jika paket tertentu masih memicu error non‑kritis, buat `tsconfig.test.json` per paket yang extend root namun mengecualikan direktori yang tidak relevan.

5) Verifikasi & iterasi
- Jalankan `pnpm type-check:test` dan catat residual error; lengkapi stub/anotasi sampai error tinggal yang valid.
- Jalankan subset E2E untuk memastikan tidak ada regresi: `PLAYWRIGHT_SKIP_WEBSERVER=true pnpm -C apps/app test:e2e -- --grep "Authentication Flow"`.

## Rencana Sistem (SOLO Builder)
- Arsitektur type‑check scalable:
  - Root `tsconfig.test.json` sebagai kontrol pusat (memuat vitest globals, include stub, exclude noisy dirs).
  - Stub konsolidasi di `types/stubs/*.d.ts` untuk alias lintas monorepo.
  - Opsi file env per paket bila dibutuhkan (meminimalkan ketergantungan silang).

- Otomatisasi CI/CD:
  - Steps: `pnpm install` → `pnpm type-check:test` → `PLAYWRIGHT_SKIP_WEBSERVER=true pnpm -C apps/app test:e2e -- --grep "Authentication Flow"`.
  - Simpan artefak output `tsc` (jumlah error per file) untuk monitoring baseline.

- Integrasi & Dokumentasi:
  - Perbarui `.trae/documents/Jalankan Type-Checking Test di Semua Aplikasi apps__.md` dengan perintah, struktur stub, dan kebijakan exclude.
  - Tambah skrip npm di root untuk memudahkan: `type-check:test` (sudah ada), opsional `type-check:packages` untuk paket tertentu.

## Rollback & Keamanan
- Semua perubahan bersifat non‑runtime (stub/konfigurasi type‑check). Jika ada dampak tak diinginkan, dapat di‑rollback dengan menghapus stub baru atau mengembalikan exclude.
- Tidak ada rahasia ditambahkan; stub tidak menyentuh produksi.

## Verifikasi
- Target: 0 error atau hanya error yang valid terkait kontrak produksi.
- Jalankan:
  - `pnpm type-check:test`
  - E2E subset: `PLAYWRIGHT_SKIP_WEBSERVER=true pnpm -C apps/app test:e2e -- --grep "Authentication Flow"`

## Deliverables
- Stub diperluas, anotasi hook chat, update paket yang perlu `vitest-env.d.ts`, dokumentasi prosedur.

## Next
- Setelah disetujui, saya akan melakukan edit stub/anotasi yang dijelaskan, menjalankan kembali type‑check dan melaporkan hasil lengkap hingga stabil.