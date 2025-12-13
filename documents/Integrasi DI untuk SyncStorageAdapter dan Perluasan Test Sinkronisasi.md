## Tujuan
- Integrasi SyncStorageAdapter melalui dependency injection (DI) di `RepositoryProvider` dengan konfigurasi pemilihan adapter.
- Perluas integration tests untuk skenario multi-record: delete dengan konflik versi dan re-pull setelah delete.
- Integrasikan adapter ke satu repository domain target untuk validasi end-to-end.
- Lakukan hardening dan verifikasi menyeluruh.

## Langkah 1: DI untuk SyncStorageAdapter
- Tambah opsi konfigurasi di `RepositoryProvider` (mis. `useSyncStorage?: boolean` atau baca `process.env.NODE_ENV`/flag seperti `VITE_USE_SYNC_STORAGE`).
- Buat pabrik adapter storage:
  - `LocalStorageAdapter` untuk default lokal.
  - `SyncStorageAdapter(local, httpClient)` bila flag aktif.
- Terapkan seleksi adapter per domain:
  - `theme` dan `navigation` tetap lokal.
  - Siapkan injeksi untuk repository target (mis. `SidebarLocalRepository` tetap lokal; repository baru untuk storage-sync atau extensi infra dapat memakai Sync).
- Pastikan tidak ada kebocoran implementasi (kontrak domain tidak berubah).

## Langkah 2: Test Case Multi-Record dan Delete
- Perluas `src/__tests__/sync.adapter.integration.test.ts`:
  - Tambah test "DELETE dengan konflik versi":
    - Buat item, update hingga versi N.
    - Kirim DELETE dengan versi N-1, verifikasi `409` dan laporkan `serverVersion`.
  - Tambah test "re-pull setelah DELETE":
    - Hapus dengan versi tepat; `204`.
    - `pull` pada key yang sama harus `null`.
  - Tambah test multi-record listing:
    - Buat dua item dalam bucket, panggil `syncBucket`, verifikasi terdapat keduanya.
- Gunakan client supertest yang sudah ada agar deterministik.

## Langkah 3: Integrasi ke Repository Domain Target
- Pilih repository domain target sederhana untuk validasi (mis. buat repositori `DocumentRepository` di infra yang memanfaatkan `IStorage` untuk bucket `docs`).
- Implementasikan operasi CRUD: `get`, `set`, `update`, `delete` dengan versi.
- Integrasikan ke `RepositoryProvider` saat flag sync aktif sehingga repositori menggunakan `SyncStorageAdapter`.
- Tambah integration test yang memanggil layanan domain terhadap repo baru.

## Langkah 4: Hardening & Verifikasi
- Edge cases:
  - Body response `409` dengan dua bentuk (`{serverVersion, serverValue}`) vs `{error: {...}}` (sudah ditangani).
  - Network failure → fallback local-only (log dan return `{ok:false}` tanpa crash).
  - Konsistensi versi setelah batch operations.
- Jalankan `npm run test:run`, `npm run lint`, `npm run check`.
- Review performa dan log minimal (hindari spam logging; hanya `debug` di adapter).

## Kriteria Sukses
- DI berjalan: adapter sync dipilih melalui konfigurasi tanpa merusak domain lain.
- Semua test baru dan lama lulus, termasuk konflik dan re-pull.
- Tidak ada regresi fungsional.
- Kode memenuhi standar kualitas (lint/typecheck bersih) dan maintainable.

## Output yang Akan Diubah
- `src/app/repository.context.tsx`: tambah konfigurasi dan injeksi adapter/repo.
- `src/infra/storage/SyncStorageAdapter.ts`: bila perlu penyesuaian minor.
- `src/__tests__/sync.adapter.integration.test.ts`: perluasan test delete dan multi-record.
- Tambah infra repo domain contoh untuk sync (opsional sesuai kebutuhan): `src/infra/repositories/DocumentSyncRepository.ts` beserta test.

Mohon konfirmasi untuk mengeksekusi rencana di atas. 