## Tujuan & Cakupan
- Menyempurnakan fitur Sessions (create, get, list) dengan RBAC ketat.
- Melengkapi pengujian unit/integrasi termasuk edge cases dan verifikasi lulus.
- Memperbaiki mock Redis untuk lingkungan pengujian.
- Memperbarui dokumentasi API dan membersihkan kode agar konsisten.

## Arsitektur & Lokasi Kode
- Controller RBAC utama: `apps/api/src/api/controllers/SessionsController.impl.ts` (RBAC via `JwtAuthGuard`, `RolesGuard`, `TenantGuard`) di 42–44, 147–151, 250–253.
- Rute: `POST /api/v1/sessions` (55–144), `GET /api/v1/sessions/:id` (159–247), `GET /api/v1/sessions` (262–322).
- Redis: `setex`, `get`, `sadd`, `expire`, `smembers` (93–100, 186, 212, 275, 280).
- Guard Tenant: `apps/api/src/common/tenant.guard.ts:5–10`.
- Tests aktif: `apps/api/src/__tests__/sessions.supertest.spec.ts` (setup/mocking 11, 23–43; suites: POST 78–175; GET :id 194–284; GET list 302–404).
- Catatan duplikasi: `apps/api/src/api/sessions.controller.ts` (tanpa RBAC penuh; siap dinonaktifkan jika perlu).

## Implementasi Pengujian
- POST /sessions:
  - Sukses membuat sesi (user/admin) dengan header `X-Tenant-ID` valid.
  - 401 tanpa Authorization; 403 untuk `roles=['guest']`.
  - 400 body invalid; 400 tanpa `X-Tenant-ID`.
  - Verifikasi TTL default pada `setex` (mis. 3600s).
- GET /sessions/:id:
  - 200 jika ada; 404 jika tidak; 400 untuk UUID tidak valid.
  - 403 untuk tenant berbeda; 401 tanpa Authorization.
  - Simulasi expired via TTL/flag dan verifikasi respons.
- GET /sessions:
  - Daftar berdasarkan `tenant:{tenantId}:sessions` (via `smembers`).
  - Kasus kosong, filter status/expired jika tersedia.
  - 401 tanpa Authorization; 403 untuk `guest`; 400 tanpa `X-Tenant-ID`.
- Pastikan seluruh skenario RBAC diverifikasi (user/admin allowed, guest denied).

## Perbaikan Mock Redis
- Menyelesaikan impor modul mock (`ioredis-mock` atau adaptor lokal) dan menyelaraskan API: `setex(key, ttl, value)`, `get(key)`, `sadd(key, member)`, `expire(key, ttl)`, `smembers(key)`.
- Injeksi melalui TestModule override provider agar controller/service memakai mock.
- Validasi kompatibilitas perilaku (nilai pengembalian, TTL, set semantics) dengan Redis asli.

## Dokumentasi
- Perbarui dokumen spesifikasi di:
  - `/.trae/documents/SBA-Agentic_ Spesifikasi Teknis & Rencana Implementasi End-to-End.md`
  - `/.trae/documents/SBA-Agentic_Spesifikasi_Teknis_Rencana_Implementasi_End-to-End.md`
- Tambahkan:
  - Definisi endpoint Sessions (request/response, contoh payload).
  - Matriks RBAC untuk `POST/GET/:id/GET` (roles vs akses).
  - Kunci Redis yang digunakan (`session:{id}`, `tenant:{tenantId}:sessions`) dan TTL.
  - Error codes dan kondisi (401/403/404/400) beserta penjelasan.

## Pembersihan & Konsistensi
- Konsolidasikan pada `SessionsController.impl.ts` sebagai sumber RBAC; tandai/deprikasikan `api/sessions.controller.ts` jika tidak digunakan.
- Pastikan dekorator dan guards konsisten: `@UseGuards(JwtAuthGuard, RolesGuard, TenantGuard)`, `@Roles('user','admin')`, `ApiHeader('X-Tenant-ID')`.
- Rapikan kode tak terpakai dan sesuaikan gaya sesuai standar repo (naming, DTO, error mapping).

## Verifikasi
- Jalankan seluruh test `apps/api/src/__tests__/sessions.supertest.spec.ts` dan suite terkait.
- Laporkan ringkasan hasil: jumlah tes, pass rate, dan bukti verifikasi status RBAC & edge cases.
- Pastikan tidak ada regresi pada health/metrics/tools tests yang sudah ada.

## Deliverables
- Pengujian Sessions lengkap (create/get/list) lulus dan terverifikasi.
- Mock Redis terselesaikan dan tervalidasi.
- Pembaruan dokumentasi API dan catatan teknis perubahan.
- Pembersihan kode terkait Sessions serta konsistensi dengan standar yang berlaku.

Silakan konfirmasi untuk mengeksekusi rencana ini. Setelah konfirmasi, saya akan melakukan perubahan, menjalankan pengujian, dan menyajikan ringkasan hasil serta daftar file yang diperbarui.