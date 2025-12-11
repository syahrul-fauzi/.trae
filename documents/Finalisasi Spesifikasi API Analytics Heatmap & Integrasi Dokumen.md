## Target & Lokasi
- Buat/melengkapi dokumen utama: `workspace/05_API/analytics-heatmap-api.md` (sudah ada draft).
- Buat mirror dokumen: `/home/inbox/smart-ai/sba-agentic/.trae/documents/Spesifikasi API Fitur Analytics Heatmap.md` (konten identik untuk akses IDE).
- Tambah referensi silang dari `README.md` dan `docs/README.md` ke dokumen API.

## Isi Dokumen (Lengkap)
- Daftar endpoint: `POST /events`, `POST /bulk`, `GET /events`, `GET /stats`, `GET /export`, `DELETE /events/:id`.
- Skema Request/Response:
  - JSON Schema (HeatmapEvent, Batch, StatsResponse, ErrorResponse).
  - Zod runtime schema dengan enum yang jelas dan tipe deterministik.
- Autentikasi & Otorisasi:
  - JWT Bearer / Supabase session; `x-tenant-id` wajib.
  - RBAC per tenant: reader/writer/admin.
- Rate Limiting:
  - Publik 60 req/min/IP, Auth writer 600 req/min/tenant.
  - Header `X-RateLimit-*` dan `429` untuk limit.
- Error Handling:
  - Body `{ code, message, details?, requestId }`; kode 400/401/403/404/409/422/429/500.
- Event & Webhook:
  - Event: `analytics.heatmap.event.created`, `bulk.accepted`, `export.ready`.
  - Payload, HMAC signature, retry exponential backoff.
- Contoh Implementasi:
  - curl contoh (POST event, GET stats), response sample.
- Determinisme & Keamanan:
  - Idempotency-Key/hash untuk dedupe, operasi stateless.
  - Hindari memaparkan struktur internal DB; URI berbasis sumber daya.

## Penambahan Artefak
- OpenAPI YAML (v1) turunan dari spesifikasi untuk Swagger UI.
- Postman collection (JSON) untuk percobaan interaktif.
- Diagram alur autentikasi & workflow endpoint (mermaid) untuk pemahaman cepat.

## Mapping
- UI → API:
  - `HeatmapTracker` ⇒ `POST /api/analytics/heatmap/events`/`bulk`; payload: eventId/type/page/selector/coords/vw/vh/sessionId/ts.
- PRD → Perilaku API:
  - Akurasi event, multitenant, deterministik, audit trail delete.

## Integrasi Monorepo
- Kaitkan dengan middleware keamanan (CSP, Upstash rate limit), `withRBAC` dan `ensureTenantHeader`.
- Observability: bungkus handler dengan `withMetrics` untuk p95/p99 bertag tenant.

## Verifikasi & Kualitas
- Konsistensi tipe (enum), tidak ada ambiguitas.
- Contoh payload valid; respons sesuai kode HTTP.
- Standar REST industri, dokumentasi jelas dan terpakai.

## Eksekusi
- Buat/isi file `.trae/documents/Spesifikasi API Fitur Analytics Heatmap.md`.
- Tambah OpenAPI YAML & Postman collection ke `workspace/05_API/`.
- Tambah tautan referensi dari README/docs.

Konfirmasi agar saya langsung menulis/melengkapkan dokumen mirror `.trae`, menambahkan OpenAPI & Postman, serta menautkan referensi ke README/docs sesuai spesifikasi di atas.