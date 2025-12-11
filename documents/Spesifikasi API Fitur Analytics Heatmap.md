## Ruang Lingkup & Konteks
- Fitur: Analytics Heatmap (pengumpulan event interaksi UI untuk visualisasi titik panas).
- Integrasi monorepo: merujuk arsitektur di README (RBAC, Upstash rate limit, `x-tenant-id`, `withMetrics`).
- Target dokumen: `workspace/05_API/analytics-heatmap-api.md` (plus mirror ke `.trae/documents/Spesifikasi API Fitur Analytics Heatmap.md` bila diperlukan).

## Mapping UI → API
- Komponen UI: `HeatmapTracker` mengirim event interaksi ke `POST /api/analytics/heatmap`.
- Payload ringkas: `eventId` (UUID), `type` (click/hover/scroll), `page` (path), `selector` (CSS/XPath), koordinat (`x`,`y`), viewport (`vw`,`vh`), `density`, `sessionId`, `userId?` (anon/pseudonym), `ts` (ISO), `tenantId` (header).
- Kebutuhan tambahan: idempotency untuk deduplikasi, lampiran konteks perangkat (UA, platform), dan optional `referrer`.

## Mapping PRD → Perilaku API
- Target bisnis: akurasi event, deterministik, aman, multitenant.
- Alur:
  1) Client mengirim event → server validasi Zod → RBAC & tenant guard → idempotency check → simpan → emit webhook/event bus.
  2) Client/ops menanyakan ringkasan (stats) → GET endpoints.
- Deterministik: input sama → output sama (gunakan `Idempotency-Key`/hash event untuk dedupe).

## Endpoint & Metode
- v1 prefix opsional; gunakan kata benda:
- `POST /api/analytics/heatmap/events`
  - Fungsional: kirim satu event.
  - Auth: JWT Bearer / Supabase session; peran minimal `writer`.
  - Headers: `x-tenant-id` [wajib], `Idempotency-Key` [disarankan].
  - Response: `201 Created` dengan `eventId`; `200 OK` jika duplikat; `409` jika idempotency collision.
- `POST /api/analytics/heatmap/bulk`
  - Kirim batch event (array); batas maksimal 500 item.
- `GET /api/analytics/heatmap/events`
  - Listing event dengan filter: `page`, `type`, `from`, `to`, `sessionId`, `limit`, `cursor`.
  - Auth: peran minimal `reader`.
- `GET /api/analytics/heatmap/stats`
  - Ringkasan agregat (per page, per selector, densitas, top N).
- `GET /api/analytics/heatmap/export`
  - Unduh CSV/NDJSON; paginasi streaming.
- `DELETE /api/analytics/heatmap/events/:id`
  - Hapus event (admin-only) dengan audit trail.

## Skema Request/Response (JSON Schema + Zod)
- JSON Schema: `HeatmapEvent`, `HeatmapEventBatch`, `ListQuery`, `StatsResponse`, `ErrorResponse`.
- Zod: definisi runtime mirror untuk validasi body/query dan pengetatan tipe.
- Field wajib/opsional ditegaskan dan enum untuk nilai terbatas (mis. `type: ['click','hover','scroll']`).

## Autentikasi & Otorisasi
- Mekanisme: JWT Bearer (Authorization), atau Supabase session cookie (SSR); header `x-tenant-id` wajib.
- RBAC: `reader` (GET), `writer` (POST), `admin` (DELETE/export penuh); hak akses per tenant (isolasi tenant).

## Rate Limiting
- Upstash-based:
  - Publik (unauth): 60 req/min per IP.
  - Auth (writer): 600 req/min per tenant.
- Header respons: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`.
- Kode saat limit terlampaui: `429 Too Many Requests`.

## Struktur Error
- Format standar: `{ code, message, details?, requestId }`.
- Kode umum: 400 (validation), 401/403 (auth/rbac), 404 (not found), 409 (idempotency), 422 (semantic), 429 (rate limit), 500 (server).

## Event/Webhook
- Event yang tersedia:
  - `analytics.heatmap.event.created`
  - `analytics.heatmap.bulk.accepted`
  - `analytics.heatmap.export.ready`
- Webhook payload: berisi `tenantId`, `eventId(s)`, ringkasan page/selector, `ts`.
- Keamanan webhook: HMAC signature (`X-Webhook-Signature`), retry exponential backoff (max 10x), `X-Event-Id`, `X-Event-Type`.

## Contoh Implementasi
- Curl:
  - POST single event dengan `Authorization: Bearer <JWT>` dan `x-tenant-id`.
  - GET stats dengan filter rentang waktu.
- Response samples (201/200/429/409) dengan body sesuai struktur.

## Kualitas & Determinisme
- Idempotensi: gunakan `Idempotency-Key` atau hash input; pengembalian sama untuk input sama.
- Tidak ada efek samping tak terduga: operasi atomik, stateless per permintaan, audit trail untuk delete.
- Tipe jelas: Zod & JSON Schema menyatakan tipe; enum untuk nilai terbatas.

## Referensi & Integrasi Monorepo
- RBAC & tenant: README (`withRBAC`, `ensureTenantHeader`).
- Rate limit Upstash: README bagian keamanan.
- Observability: `withMetrics` untuk latensi p95/p99; tag tenant di metrik.

## Rencana Implementasi Dokumen
- Buat file `workspace/05_API/analytics-heatmap-api.md` berisi:
  - Ringkasan, endpoints, skema JSON Schema, snippet Zod, auth/RBAC, rate limit, error, webhook, contoh curl & response, catatan determinisme.
- Jika diinginkan, mirror ke `.trae/documents/Spesifikasi API Fitur Analytics Heatmap.md` agar mudah diakses via IDE.

Mohon konfirmasi. Setelah disetujui, saya akan membuat dokumen lengkap sesuai format di atas, memasukkan contoh JSON Schema & Zod, curl dan response sample, dan mengaitkan referensi README/docs monorepo.