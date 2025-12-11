## Ringkasan Status Terkini
- Sessions: Validasi strict 400 untuk filter invalid, RBAC `tenantId/userId`, dan pembatasan `sortBy` selesai; seluruh test Sessions lulus. Dokumentasi API diperbarui.
- Observability: Counter default di `/metrics` tersedia; tracing OTel aktif pada Sessions.
- Backlog terbuka: konsolidasi Auth refresh flow, perluasan filter Sessions, hardening route Knowledge Search Cached, peningkatan observability & testing menyeluruh.

## Sasaran
- Menyelesaikan backlog pengembangan (Auth, Sessions, Observability, Knowledge Cache).
- Melakukan testing menyeluruh dan memperbaiki bug.
- Memastikan konsistensi standar coding dan mendokumentasikan perubahan.

## Item Pekerjaan
### 1) Sessions: perluasan filter & pengujian
- Tambah filter `status` (active/expired) dan `date range` (`fromDate/toDate`).
- Tambah pengujian deterministik untuk `sortOrder=asc|desc` dan `sortBy=updatedAt`.
- Pastikan strict validation (400 `VALIDATION_ERROR`) untuk kombinasi filter tak valid.
- Referensi: `apps/api/src/api/controllers/SessionsController.impl.ts:307-352, 380-384`, `apps/api/src/orchestrator/schemas.ts:405-410`.

### 2) Auth & Refresh konsolidasi
- Gunakan satu `AuthController` yang terintegrasi dengan `AuthService` dan Redis untuk refresh tokens.
- Pastikan penyimpanan refresh token konsisten (TTL, format key), status `401` pada invalid refresh.
- Tambah test untuk `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`, dan `GET /auth/me`.
- Konsistensi 401/403 di guards (`JwtAuthGuard`) dan role checks (`RolesGuard`).

### 3) Observability & Metrics
- Tambah counter per endpoint (`requestCounter`) dan label standar (`endpoint`, `tenant_id`, `status`).
- Pastikan `/metrics` mengandung metrik Sessions, Runs, Tools dan tidak kosong.
- Tambah pengujian untuk keberadaan metrik kunci.
- Referensi: telemetry config yang digunakan oleh Sessions (`apps/api/src/api/controllers/SessionsController.impl.ts:111-115, 390-394`).

### 4) Knowledge Search Cached API hardening
- Ganti Map lokal menjadi cache berbasis Redis/KV dengan key multi-tenant `tenant:<id>:knowledge:<hash>`.
- TTL dikonfigurasi via env (`KNOWLEDGE_CACHE_TTL_MS`).
- Tambah rate-limiting per tenant (mis. token bucket sederhana) dan error 429 jika terlampaui.
- RBAC: `withRBAC` juga aktif pada non-production untuk konsistensi; atau guard internal.
- Header & schema:
  - Wajib `X-Tenant-ID` (uuid), query `q` minimal 1 karakter.
  - Response menyertakan header `X-Cache: hit|miss`, dan opsional `X-TTL-Remaining`.
- Testing: unit + integration untuk cache hit/miss, TTL expire, rate-limit, dan RBAC.
- Referensi file: `apps/app/src/app/api/knowledge/search-cached/route.ts:11-41`.

### 5) Konsistensi Header & Decorator
- Pastikan konsistensi penggunaan `X-Tenant-ID` (case-insensitive) di seluruh stack.
- Perbaiki `CurrentTenant` agar melempar `BadRequestException` alih-alih `Error` saat tenant hilang.
- Referensi: `apps/api/src/common/tenant.guard.ts:7-10`, `apps/api/src/infrastructure/tenant/CurrentTenant.decorator.ts:21-29`.

### 6) Error Handling & Security Hardening
- Pastikan semua `HttpException` di catch block direthrow untuk menjaga 4xx.
- Hindari logging sensitif; gunakan level log terkontrol.
- Tambah validasi zod untuk route web (query/body), dan kembalikan `VALIDATION_ERROR` saat invalid.

### 7) Testing Menyeluruh
- Jalankan seluruh suite Vitest untuk API (auth, sessions, runs, tools, rbac).
- Tambah test untuk Knowledge route (cache hit/miss, TTL, rate-limit, RBAC, tenant required).
- Target coverage sesuai standar (lines ≥85%, functions ≥85%, branches ≥80%).

### 8) Dokumentasi
- Perbarui `docs/TECHNICAL_SPECIFICATION.md` untuk:
  - Sessions (filter tambahan, contoh error 400/403, pagination header).
  - Knowledge Search Cached (headers, query, TTL, rate-limit, RBAC, contoh response).
  - Auth refresh flow yang konsisten (diagram, TTL Redis, status code).

### 9) Code Review & Merge
- Lakukan code review dengan checklist:
  - Konsistensi gaya (ESLint, naming, typing), tanpa komentar berlebih.
  - Keamanan (RBAC, auth, tidak ada secrets di log).
  - Observability (span dan metrik sesuai).
  - Testing & dokumentasi lengkap.
- Siapkan PR tanpa commit otomatis; merge setelah review.

## Rencana Teknis Per File (ringkas)
- `apps/api/src/api/controllers/SessionsController.impl.ts`: tambah filter status & date range, rethrow exceptions, metrik.
- `apps/api/src/orchestrator/schemas.ts`: perluas `ListSessionsQuerySchema` untuk `status`, `fromDate`, `toDate`.
- `apps/api/src/auth/*`: konsolidasikan controller & service refresh.
- `apps/app/src/app/api/knowledge/search-cached/route.ts`: ubah ke Redis/KV, TTL env, rate-limit, aktifkan RBAC, tambahkan zod validate.
- `apps/api/src/infrastructure/tenant/CurrentTenant.decorator.ts`: gunakan `BadRequestException` saat tenant tak ada.
- `docs/TECHNICAL_SPECIFICATION.md`: tambahkan spesifikasi lengkap untuk Sessions & Knowledge.

## Pengujian
- Unit & integration untuk semua perubahan; verifikasi header pagination dan error mapping 400/403/401.
- Tambah test `sortOrder` asc/desc pada `sortBy=updatedAt` dengan dataset terkontrol.
- Knowledge route: test TTL, cache konsistensi per tenant, rate-limit, RBAC.

## Risiko & Mitigasi
- Perubahan guard berdampak pada status code: uji ulang semua endpoint terkait.
- Redis/KV tidak tersedia di test: gunakan in-memory mock dengan TTL.
- Potensi flakiness TTL: gunakan toleransi waktu di test.

## Deliverables
- Kode teruji (tanpa commit otomatis).
- Dokumentasi API diperbarui.
- Hasil uji dan laporan coverage.

## Permintaan Konfirmasi
Apakah Anda menyetujui rencana di atas? Setelah konfirmasi, saya akan mulai mengimplementasikan perubahan, menulis pengujian, menjalankan verifikasi, dan menyiapkan dokumentasi/PR sesuai checklist.