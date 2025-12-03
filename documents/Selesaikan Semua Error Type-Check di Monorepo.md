## Tujuan
- Menghilangkan seluruh error TypeScript hingga `pnpm type-check` di root monorepo berstatus hijau.
- Menjaga kompatibilitas, tidak merusak fungsionalitas yang ada, dan mendokumentasikan perubahan.

## Strategi Penyelesaian Bertahap
- Menangani error per-kategori berdasarkan prioritas dan ketergantungan.
- Setelah setiap kelompok perbaikan, jalankan type-check untuk verifikasi progres.

## Daftar Perbaikan Terstruktur
### 1) UI Barrel Export & Monitoring
- Masalah: `packages/ui/src/index.ts` mengekspor `./monitoring` yang belum ada → error modul.
- Aksi: Tambahkan barrel `packages/ui/src/monitoring/index.ts` atau hapus ekspor jika tidak digunakan. Pastikan `HeatmapTracker` diekspor dari lokasi yang konsisten.

### 2) Supabase & Next Types (Missing Modules)
- Masalah: `@supabase/supabase-js` dan `next/server` tipe hilang pada beberapa file.
- Aksi:
  - Tambahkan dependency `@supabase/supabase-js` (prod) dan types bila perlu.
  - Guard import `next/server` dan `next/headers` dengan lazy/try-catch di paket yang dipakai lintas lingkungan (non-Next) atau pindahkan file ke scope Next-only.
  - Update tsconfig path/skip untuk middleware Next jika bukan bagian paket web.

### 3) AvatarProps `src` Tipe Strict
- Masalah: `AvatarProps.src` mengharuskan `string`, saat ini diteruskan `string | undefined`.
- Aksi: Berikan fallback kosong `''` atau URL default saat `undefined` agar sesuai tipe.

### 4) Documents: Engine & Repository
- Masalah: Import `Document` tidak diekspor; method `listByTenant` tidak ada; parameter implicit any; indeks status/type pakai enum salah; operasi numeric vs object.
- Aksi:
  - Perbaiki import ke tipe yang benar (mis. `DocumentAggregate`, `DocumentStatus`, `DocumentType`).
  - Tambah deklarasi method di repository atau ubah call ke method yang tersedia.
  - Tipekan parameter `docs`, `d`, `tag` dan mapping.
  - Gunakan union enum saat mengindeks `statusConfig`/`icons`/`labels` dengan type guard.
  - `update(selectedDocument, tenantId, { ... })` sesuaikan signature.
  - Gunakan `extractValue` dengan casting aman ke number saat aggregasi size.

### 5) Conversation Adapters
- Masalah: `Conversation` mengharuskan `messages`; `toolCalls` tak memiliki `type`; properti `args` hilang.
- Aksi:
  - Saat membentuk `Conversation`, tambahkan `messages: []` default.
  - Mapping `toolCalls` tambahkan `type: 'tool'` (atau tipe yang disyaratkan), dan tambahkan `args` dari sumber data bila ada, default `{}`.

### 6) Integrations Model Metadata
- Masalah: `metadata.tags` wajib tetapi dikirim `{}`.
- Aksi: Set `metadata: { tags: [] }` minimal, atau gunakan default schema saat instansiasi.

### 7) Error Handling `code` Strict
- Masalah: `AppError.code` bertipe `string` tetapi mapping bisa `undefined`.
- Aksi: Berikan default `'UNKNOWN'` jika tidak tersedia.

### 8) Auth Store Implicit Any
- Masalah: `set`, `get`, `state` implicit any di store (zustand/valtio dsb.).
- Aksi: Tambahkan tipe generik store (`StoreState`, `SetState`, `GetState`) dan anotasi fungsi pembuat store.

### 9) Supabase Middleware (Next-only)
- Masalah: `packages/supabase/src/middleware.ts` mengimpor `next/server`.
- Aksi: Pastikan file ini hanya di-include pada proyek Next (apps/app). Exclude dari `apps/web` tsconfig atau guard import dengan type-only dan runtime check.

### 10) Document Repository Status & ProcessingStatus
- Masalah: `status` membandingkan `'active'` yang tidak ada di union; `processingStatus.stage` tipe string vs union.
- Aksi:
  - Ganti `'active'` ke union valid (`'ready'` atau `'processing'` sesuai domain).
  - Map hasil status processing agar `stage` salah satu: `'queued'|'processing'|'completed'|'failed'`.

### 11) API Client Calls Argumen
- Masalah: `apiClient.documents.list('', extractValue(userId))` ekspektasi signature berbeda.
- Aksi: Sesuaikan signature ke satu argumen atau bentuk objek opsional sesuai definisi client.

### 12) UI Index Export Konsisten
- Masalah: Barrel `packages/ui/src/index.ts` harus konsisten ekspor modul tersedia.
- Aksi: Sinkronkan ekspor dengan modul yang ada, hapus ekspor orphan.

## Verifikasi & Iterasi
- Urutan pengerjaan:
  1. Barrel UI & monitoring
  2. Supabase & Next types/import guards
  3. AvatarProps fix
  4. Documents (Engine & Repo)
  5. Conversation adapters
  6. Integrations metadata
  7. Error handling `code`
  8. Auth store typing
  9. Supabase middleware scoping
  10. Document repository status/processing
  11. API client call signatures
  12. UI index export konsisten
- Setelah setiap langkah, jalankan `pnpm type-check` (atau filter per paket) untuk memastikan penurunan error.

## Dokumentasi
- Catat perubahan per kategori dalam `.trae/documents/TYPECHECK_FIXES.md`:
  - File dirubah, alasan, pendekatan, dampak.
  - Tautan ke kode (path:line) untuk referensi.

## Quality Control
- Pastikan tidak ada regressi:
  - Menjalankan unit/integrasi terkait modul yang diubah.
  - Cek manual area UI terdampak (Avatar, Documents page, Integrations, Chat).

## Konfirmasi
- Jika disetujui, saya akan mengeksekusi perbaikan sesuai urutan di atas, verifikasi berkala dengan `pnpm type-check`, dan menyelesaikan hingga hijau sepenuhnya, beserta dokumentasi perubahan ringkas.