## Tujuan
- Menambah cakupan diagram sequence tingkat endpoint untuk operasi GET agar dokumentasi eksekusi, cabang status, dan penanganan error lengkap.

## Berkas yang Akan Ditambahkan
- `docs/use-cases/sequence-api-runs-get.mmd`
- `docs/use-cases/sequence-api-runs-list.mmd`

## Konten Diagram
### sequence-api-runs-get.mmd
- Happy path: valid UUID, run ditemukan, tenant akses OK → kembalikan JSON run.
- alt branches:
  - Invalid UUID → 400 `INVALID_RUN_ID`.
  - Run tidak ditemukan/expired → 404 `RUN_NOT_FOUND`.
  - Tenant access denied → 403 `TENANT_ACCESS_DENIED`.
- opt: Internal failure → 500 `INTERNAL_ERROR`.
- Penautan kode: `apps/api/src/api/runs.controller.ts:163-268` (fungsi `getRun`).

### sequence-api-runs-list.mmd
- Happy path: ambil `tenant:${tenantId}:runs` → get setiap `run:${id}` → filter by user/status → sort (createdAt) → paginate (page/limit) → kembalikan array.
- alt branches:
  - Tenant tidak punya run (SMEMBERS kosong) → kembalikan `[]`.
  - Filter status tidak cocok → hasil kosong.
- opt: Internal failure → 500 `INTERNAL_ERROR`.
- Penautan kode: `apps/api/src/api/runs.controller.ts:589-711` (fungsi `listRuns`).

## Struktur & Fragmen
- Gunakan `sequenceDiagram` Mermaid.
- Pakai `alt` untuk cabang status dan validasi, `opt` untuk error, komentar `Note right of API` berisi referensi file:line.
- Penamaan konsisten: `sequence-api-runs-<action>.mmd`.

## Penautan di Kode
- Tambah komentar penanda diagram di:
  - `getRun`: `// Diagram: docs/use-cases/sequence-api-runs-get.mmd` di atas dekorator `@Get(":runId")`.
  - `listRuns`: `// Diagram: docs/use-cases/sequence-api-runs-list.mmd` di atas dekorator `@Get()`.

## Pembaruan Indeks
- Tambahkan tautan kedua berkas baru ke bagian “Endpoint-level diagrams” di `docs/README.md`.

## Validasi & Sinkronisasi
- Cocokkan pesan error, status HTTP, dan alur tepat dengan implementasi sekarang (referensi fungsi di berkas dan baris).
- Dokumentasikan di `docs/use-cases/SEQUENCE-MAINTENANCE.md` bahwa kedua diagram termasuk dalam siklus review rutin.

## Langkah Eksekusi
1. Buat dua `.mmd` sesuai spesifikasi.
2. Sisipkan komentar penanda di dua fungsi API.
3. Perbarui `docs/README.md` untuk menautkan berkas.
4. Review cepat kesesuaian status/error.

## Catatan
- Tidak ada keterlibatan SSE untuk endpoint GET ini; fokus pada REST, Redis, dan guard tenant.
- Jika pola filter/sort berubah, diagram akan diperbarui pada saat review rilis minor berikutnya.