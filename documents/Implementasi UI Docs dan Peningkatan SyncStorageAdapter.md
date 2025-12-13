## Tujuan
- Mengaktifkan repositori dokumen berbasis SyncStorageAdapter dan menyediakan UI minimal "Docs" untuk CRUD dengan kontrol versi.
- Menambah Application Service Dokumen untuk validasi bisnis dan error handling.
- Meningkatkan SyncStorageAdapter dengan retry/backoff, timeout, dan logging kondisional.
- Menyusun spesifikasi teknis dan menambahkan pengujian unit/integrasi end-to-end.

## Arsitektur Sistem
- **Client (Vite + React)**: UI dan Application Services; DI repositori melalui `RepositoryProvider` (src/app/repository.context.tsx:18-24).
- **Infra Storage**: `LocalStorageAdapter` (src/infra/storage/Storage.ts) dan `SyncStorageAdapter` (src/infra/storage/SyncStorageAdapter.ts:35-73) untuk offline-first + server sync.
- **Domain Repos**: `DocumentSyncRepository` (src/infra/repositories/DocumentSyncRepository.ts) menggunakan bucket `docs`.
- **API Mock**: Express routes (api/routes/storage.ts:11-89) untuk CRUD & versioning; `api/app.ts` untuk routing.

## Diagram Alur Kerja (deskriptif)
- UI → Application Service → Repository Dokumen → SyncStorageAdapter → API / LocalStorage
- Pull/Push/Delete: adapter mencoba create/update/delete, menangani `201/200/204` dan `409` (konflik versi) lalu mengembalikan hasil ke Application Service untuk keputusan bisnis.

## Fitur Utama
- CRUD dokumen dengan versi (create, read, update, delete).
- Listing dokumen dalam bucket `docs`.
- Penanganan konflik versi (optimistic locking).
- Offline-first: operasi lokal tetap memungkinkan, sinkronisasi saat online.
- UI minimal untuk operasi "Docs" dengan loading dan error handling.

## Persyaratan Teknis
- Aktifkan sync: set env `VITE_USE_SYNC_STORAGE=true` di client.
- Kode mengikuti TypeScript strict, tanpa `any`.
- Pengujian menggunakan vitest; untuk integrasi adapter gunakan supertest terhadap `api/app`.

## Implementasi Bertahap
### 1) DI untuk Repo Dokumen
- Perluas `RepositoryProvider` untuk mendaftarkan `documents` saat `VITE_USE_SYNC_STORAGE=true` (src/app/repository.context.tsx:18-24).
- Pastikan pengecekan availability di UI: `if (repos.documents) ...`.

### 2) Application Service Dokumen
- Tambahkan `src/domain/document/Document.service.ts`:
  - Metode: `create`, `get`, `update`, `delete`, `list`.
  - Validasi sederhana: key wajib, version bilangan bulat ≥1.
  - Normalisasi error: konflik versi → mapping pesan UI.

### 3) UI Minimal "Docs"
- Tambahkan halaman `src/pages/Docs.tsx`:
  - Tabel listing: key, version.
  - Form create/update: value JSON (textarea atau JSON editor sederhana), key string.
  - Delete dengan versi terakhir (ambil dari repo sebelum delete).
  - States: loading, error; availability check dari `useRepositories().documents`.
- Routing: tambah rute `/docs` di `src/app/routes.generated.tsx` (atau mekanisme routing yang digunakan saat ini).

### 4) Peningkatan SyncStorageAdapter
- Retry dengan exponential backoff untuk kegagalan network (5xx/timeout):
  - Utility internal di adapter: `requestWithRetry(clientCall, { retries, baseDelayMs })`.
- Timeout handling: gunakan AbortController di fetch defaultClient; untuk supertest (test) abaikan timeout.
- Logging kondisional:
  - Aktifkan hanya saat `import.meta.env.MODE==='development'` atau flag `VITE_DEBUG_SYNC`.

### 5) Pengujian
- Unit test Application Service Dokumen: validasi dan mapping error.
- Integration test end-to-end untuk UI/Repo (tanpa mount UI penuh, gunakan service + repo):
  - Sudah ada integrasi untuk repos: `src/__tests__/document.repository.integration.test.ts`.
  - Tambah test untuk skenario error (timeout simulasi, retry terpicu) dengan client stub.
- Pastikan suite yang ada (sync.adapter.integration, storage.test, navigation/theme) tetap lulus.

## Hardening & Verifikasi
- Konsistensi data: verifikasi `version` naik pada update, null setelah delete.
- Error handling: konflik versi, network error, timeout.
- Performa: batasi log, retry dengan jitter; hindari pemblokiran UI.

## Manajemen Logging
- Ganti `console.debug` menjadi logger kondisional berbasis env (`VITE_DEBUG_SYNC`).
- Audit trail: catat operasi critical (create/update/delete) dengan metadata key dan versi di dev.

## Pengelolaan Versi
- Document nilai versi tersimpan pada server; client memegang versi terakhir untuk operasi update/delete.
- Di UI, selalu `pull` sebelum `delete` untuk mendapatkan `version` terbaru.

## Pemantauan Progres
- Tambahkan indikator progress pada operasi sync (loading spinner, toast result).
- Laporan test coverage untuk repos & service dokumentasi.

## Deliverables
- Application Service Dokumen, halaman UI "Docs", peningkatan adapter (retry/timeout/logging), pengujian lengkap, dan pembaruan DI.

Mohon konfirmasi untuk mengeksekusi implementasi di atas; setelah konfirmasi, saya akan melakukan perubahan kode, menambahkan halaman Docs, service dokumen, peningkatan adapter, dan menambahkan pengujian serta verifikasi lint/typecheck/test end-to-end. 