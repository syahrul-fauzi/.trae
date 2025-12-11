## Tujuan & Outcome
- Menyusun dokumen spesifikasi API komprehensif untuk fitur Knowledge: daftar endpoint, skema request/response, autentikasi/otorisasi, rate limiting, error model, dan event/webhook.
- Dokumen dibuat di `workspace/05_API/knowledge-api.md` dengan frontmatter YAML, konsisten dengan konvensi monorepo dan referensi arsitektur.

## Dasar Arsitektur & Referensi
- RBAC guard dan tenant labeling: gunakan pola `withRBAC` dan `ensureTenantHeader` seperti pada `apps/app/src/app/api/knowledge/route.ts:16-18,38-44`.
- Observability latensi: bungkus handler dengan `withMetrics` seperti `apps/app/src/app/api/knowledge/route.ts:39-40`.
- Rate limiting Upstash dan security headers: rujuk `README.md:74-81` dan `docs/README.md:33-38`.

## Ruang Lingkup Fitur
- Sumber daya: `KnowledgeItem` (dokumen, catatan, atau data yang dapat diindeks dan diverifikasi).
- Operasi: list/get, search, vector-search, upsert, ingest (batch), verify (validasi), serta event webhook pada perubahan.

## Daftar Endpoint
- `GET /api/knowledge` — daftar entri terbaru (paginasi dan filter opsional).
- `POST /api/knowledge` — upsert entri tunggal (idempotent by `externalId`).
- `GET /api/knowledge/search` — pencarian teks penuh (query string, tenant-scoped).
- `POST /api/knowledge/vector-search` — pencarian semantik berbasis embedding.
- `POST /api/knowledge/upsert` — upsert batch (maks 100 item per request).
- `POST /api/knowledge/ingest` — ingest dokumen mentah (file/url → ekstraksi + indeks).
- `POST /api/knowledge/verify` — verifikasi konten (checksum/anti-dup/PII lint) dan set `verified=true`.
- Metode, path, dan deskripsi setiap endpoint akan ditulis lengkap dengan parameter (query/path/header/body) serta response codes.

## Autentikasi & Otorisasi
- Mekanisme: Bearer JWT (Supabase session) atau cookie sesi; di test/dev diperkenankan `__test_auth` (lihat `README.md:76-77`).
- Tenant: wajib `x-tenant-id` header; validasi dan propagasi ke metrics (`docs/README.md:37-43`).
- Role-based permissions (RBAC):
  - `analytics:read` — akses `GET /api/knowledge`, `search`, `vector-search`.
  - `analytics:manage` — akses `POST /api/knowledge`, `upsert`, `ingest`, `verify`.
- Setiap endpoint akan menyertakan tabel peran yang diizinkan.

## Rate Limiting
- Skema batasan per IP+Tenant:
  - Public read: 60 req/menit (search/vector-search), burst 120.
  - Manage/write: 10 req/menit (upsert/ingest/verify), burst 20.
- Respons `429 Too Many Requests` dengan payload `{ code: "rate_limit_exceeded", retryAfter: <seconds> }`.

## Struktur Error
- Format baku: `{ code: string, message: string, details?: object, requestId: string }`.
- Kode standar: `invalid_request`, `unauthorized`, `forbidden`, `not_found`, `conflict`, `rate_limit_exceeded`, `internal_error`.
- Konsisten stateless, deterministik, dan tidak mengekspos impl detail.

## Event & Webhook
- Event: `knowledge.upserted`, `knowledge.ingested`, `knowledge.verified`.
- Payload webhook: `{ id, externalId?, tenantId, type, item, occurredAt }`.
- Keamanan: HMAC SHA256 signature header `x-webhook-signature` (secret per-tenant).
- Retry: exponential backoff (0s, 10s, 60s, 300s), maks 5 percobaan; dead-letter queue dicatat.

## Skema & Validasi
- JSON Schema: definisi `KnowledgeItem`, `SearchRequest`, `SearchResponse`, dsb., dengan tipe tegas dan enum untuk nilai terbatas.
- Zod: mirror runtime validation dari JSON Schema untuk semua payload; gunakan parser di handler.
- Tipe field jelas; gunakan `enum` untuk status (mis. `verified_status: ['unverified','verified']`).

## Contoh Implementasi
- Contoh `curl` untuk semua endpoint (auth Bearer JWT dan header tenant).
- Contoh response sukses dan error, termasuk `429` dan `403` RBAC.

## Mapping UI → API
- Halaman Knowledge (`apps/app/src/app/(authenticated)/knowledge/page.tsx`) → `GET /api/knowledge/search` untuk pencarian; `POST /api/knowledge/upsert|ingest|verify` melalui formulir/aksi.
- Komponen AGUI Dashboard (`apps/app/src/features/agui/ui/AGUIDashboard.tsx`) → `GET /api/knowledge/search?q=...` untuk quick search.
- Runtime Ops Dashboard (`apps/app/src/features/agentic/ui/RuntimeOpsDashboard.tsx`) → konsolidasi ringkasan via search untuk konteks.

## Mapping PRD → Perilaku API
- Terjemahkan kebutuhan: menyimpan, mencari, memverifikasi pengetahuan tenant-secure; audit trail pada write ops.
- Flow bisnis: upsert/ingest → verify → tersedia di search/vector-search; webhook men-trigger downstream indeks/QA.

## Konsistensi & Validasi Dokumen
- Ikuti konvensi penamaan dan frontmatter dari `README.md:47-49` dan `docs/README.md:95-101`.
- Cross-reference ke `workspace/_xref.md` (PRD ↔ Arsitektur ↔ Flows ↔ API) dan rujuk endpoint terkait OpenAPI (`apps/app/src/app/api/openapi.*`).

## Lokasi & Penamaan
- File: `workspace/05_API/knowledge-api.md` (frontmatter: title, created_at, author, status, related).
- Sertakan tautan ke `docs/architecture/README.md` dan bagian Keamanan/Observability.

## Langkah Eksekusi
1) Susun skeleton dokumen + frontmatter YAML.
2) Tulis daftar endpoint lengkap (method, path, deskripsi, parameter, status code).
3) Tambahkan JSON Schema + Zod untuk semua payload.
4) Lengkapi autentikasi/otorisasi, rate limiting, error model.
5) Definisikan event/webhook (payload, security, retry).
6) Tambahkan contoh `curl` + response sample.
7) Integrasikan referensi `README.md` dan `docs/README.md`; tambahkan code refs.
8) Jalankan validator docs (non-modifikasi disebutkan untuk nanti) dan serahkan untuk review.
