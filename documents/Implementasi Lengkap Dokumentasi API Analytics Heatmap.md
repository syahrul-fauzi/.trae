## Target & Lokasi
- Buat mirror spesifikasi: `/.trae/documents/Spesifikasi API Fitur Analytics Heatmap.md`.
- OpenAPI YAML v1: `workspace/05_API/heatmap_api_openapi.yaml`.
- Postman Collection JSON: `workspace/05_API/heatmap_api_postman.json`.
- Referensi: tautan di `README.md` (API Documentation) dan `docs/README.md` (Technical References).

## Isi Dokumen Spesifikasi (.trae)
- Deskripsi fitur & tujuan; prinsip REST stateless, multitenant via `x-tenant-id`.
- Daftar endpoint:
  - `POST /api/analytics/heatmap/events`, `POST /bulk`, `GET /events`, `GET /stats`, `GET /export`, `DELETE /events/:id`.
- Parameter & header:
  - Header: `Authorization: Bearer <JWT>`/Supabase session; `x-tenant-id` wajib; opsional `Idempotency-Key`.
  - Query (GET): `page`, `type`, `from`, `to`, `sessionId`, `limit`, `cursor`.
- Contoh request/response untuk tiap endpoint.
- Error codes: 400/401/403/404/409/422/429/500 dengan format `{ code, message, details?, requestId }`.
- Rate limiting: publik 60 req/min/IP; auth writer 600 req/min/tenant; header `X-RateLimit-*`.
- Determinisme: idempotensi (duplikat → 200, insert pertama → 201).

## OpenAPI YAML (workspace/05_API/heatmap_api_openapi.yaml)
- `openapi: 3.0.3` + `info` (title, version, contact, license) + `servers` (staging/prod placeholders).
- `components`:
  - `schemas`: `HeatmapEvent`, `HeatmapEventBatch`, `StatsResponse`, `ErrorResponse` (jenis/tipedata sesuai JSON Schema), enum `type` (click/hover/scroll), timestamp ISO.
  - `securitySchemes`: `bearerAuth` (JWT bearer).
  - `headers`: `X-Tenant-Id`, `Idempotency-Key`, `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`.
- `paths` lengkap untuk 6 endpoint, dengan:
  - `parameters` (headers/query), `requestBody` (application/json), `responses` (201/200/409/429, dsb.), `examples` payload.
- `tags`: events, bulk, listing, stats, export, admin.

## Postman Collection (workspace/05_API/heatmap_api_postman.json)
- Variables: `baseUrl`, `jwt`, `tenantId`, `format`.
- Pre-request script: set `Authorization` header dari `jwt`, set `x-tenant-id`.
- Test scripts: verifikasi status code, validasi sebagian struktur JSON (field wajib), waktu respons.
- Requests siap pakai untuk setiap endpoint dengan contoh payload (events/bulk, filter untuk listing/stats, export dengan `format`, delete by id).

## Referensi Dokumen
- Tambahkan seksi:
  - `README.md` → "API Documentation": link ke `workspace/05_API/analytics-heatmap-api.md`, `workspace/05_API/heatmap_api_openapi.yaml`, `workspace/05_API/heatmap_api_postman.json`.
  - `docs/README.md` → "Technical References": link ke tiga artefak di atas.

## Validasi
- Validasi sintaks OpenAPI (linting/validator standar) dan struktur dapat diimpor Swagger UI.
- Import Postman Collection, jalankan contoh request terhadap `baseUrl` dev/staging.
- Cek tautan relatif pada `README.md` dan `docs/README.md` berfungsi.
- Konsistensi isi spesifikasi vs OpenAPI/Postman (endpoint, skema, error).

## Catatan Implementasi
- Menjaga praktik terbaik REST: antarmuka seragam, kopling longgar, URI berbasis sumber daya, tanpa memaparkan struktur DB internal.
- Multitenancy jelas melalui `x-tenant-id` dan RBAC per peran.

Setuju? Saya akan membuat mirror spesifikasi di `.trae/documents`, menghasilkan OpenAPI YAML dan Postman collection di `workspace/05_API/`, serta menambah link referensi di README dan docs, lalu memvalidasi semuanya.