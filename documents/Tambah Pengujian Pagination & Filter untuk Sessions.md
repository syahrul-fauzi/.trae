## Tujuan
- Menambahkan pengujian komprehensif untuk pagination dan filter detail pada fitur Sessions.
- Memverifikasi integrasi pagination ↔ filter.

## Observasi Kode Saat Ini
- Schema `ListSessionsQuery` tersedia (apps/api/src/orchestrator/schemas.ts:405–410, 466) termasuk `page`, `limit`, `sortBy`, `sortOrder`, dan `active`.
- `SessionService.listSessions` (apps/api/src/application/session/SessionService.ts:228–290) menerapkan paginasi via `slice` serta sorting `updatedAt desc`.
- Controller Sessions `listSessions` (apps/api/src/api/controllers/SessionsController.impl.ts:262–322) saat ini mengembalikan array tanpa metadata pagination dan tidak membaca query.

## Rencana Pengujian
- Buat berkas test baru `apps/api/src/__tests__/sessions.pagination.filter.supertest.spec.ts`.
- Data setup: buat 15+ sesi dengan variasi `metadata`, beberapa ditandai expired, beberapa aktif; simpan via endpoint `POST /api/v1/sessions`.

### Pengujian Pagination
1. Navigasi halaman
- Asersi page=1 limit=5 mengembalikan 5 item, page=2 item berikutnya, page terakhir memiliki sisa item.
- Verifikasi `first/prev/next/last` melalui kombinasi `page`/`limit`.
2. Perubahan jumlah item
- Uji `limit=3`, `limit=10` dan cek jumlah item per halaman akurat.
3. Penomoran halaman
- Hitung `pages = ceil(total/limit)`; verifikasi page boundaries dan invalid page (e.g. page terlalu besar → data kosong).
4. Data sesuai halaman
- Simulasikan urutan deterministik (mis. sort desc by createdAt/updatedAt) lalu assert konten index yang diharapkan.

### Pengujian Filter Detail
1. Kombinasi parameter
- `active=true`, `userId=...`, `tenantId=...`, dan kombinasi `active + userId`.
- Sort order `asc/desc` dan `sortBy` `createdAt/updatedAt` (bila tersedia di service).
2. Input tidak valid
- `page=0`, `limit=-1`, `sortOrder=invalid` → expect 400 dengan kode `VALIDATION_ERROR` atau fallback sesuai kebijakan.
3. Pengaruh filter terhadap pagination
- Terapkan filter yang memperkecil dataset, verifikasi `total`, `pages`, dan isi pada setiap halaman sesuai dataset terfilter.
4. Reset/Clear filter
- Hilangkan parameter filter, pastikan kembali ke dataset penuh dan metadata pagination diperbarui.

### Integrasi Pagination ↔ Filter
- Uji `active=true` dengan `limit=4` dan `page` beragam untuk memastikan paging berjalan di atas hasil terfilter.
- Uji `userId` filter dengan limit kecil dan navigasi halaman.

## Implementasi
- Tambah test supertest yang memanggil `GET /api/v1/sessions?page=...&limit=...&active=...&sortOrder=...&userId=...`.
- Karena controller list saat ini belum membaca query dan metadata pagination, sementara waktu validasi dilakukan terhadap jumlah item per halaman yang diharapkan (subset) dan urutan.
- Jika diperlukan, tambahkan adapter kecil di test untuk menghitung `total`, `pages` dari header/array panjang, namun tidak mengubah API produksi.

## Output Pengujian & Kriteria
- Deskripsi test jelas, data representatif, assertions terhadap jumlah item, urutan, dan respons error.
- Menutup kasus navigasi, perubahan limit, invalid input, kombinasi filter, dan reset filter.

## Setelah Konfirmasi
- Saya akan membuat berkas test baru, menjalankan suite, dan menyajikan ringkasan hasil serta lokasi kode relevan (`file_path:line`).