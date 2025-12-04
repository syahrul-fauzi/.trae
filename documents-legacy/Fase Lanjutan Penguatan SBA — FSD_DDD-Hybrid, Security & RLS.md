## Tujuan
- Melanjutkan penguatan arsitektur FSD/DDD-hybrid dengan kontrol keamanan, adapter alat nyata, RLS hardening, dan verifikasi menyeluruh.

## Ruang Lingkup
- Orchestrator application layer dan domain services
- Security (JWT/RBAC/Rate-limit/Validator)
- Adapters alat (BaseHub/Blob/Task/Vector)
- Supabase Functions (SSE path & kontrol input)
- RLS & audit
- Observability (metrics/health/traces/logs)
- QA & CI/CD

## Rincian Perubahan
- Rate-limit per-tenant
  - Integrasi `packages/security/src/rateLimiter.ts` dengan Orchestrator (per tenant sliding window); emit `violations_total` metric.
- RBAC enforcement
  - Guard resource:action pada `POST /tool-call` menggunakan `packages/security/src/rbac.ts`; sinkronkan role/permission map.
- Adapters alat nyata
  - `packages/tools/basehub-adapter` (GraphQL search/blocks), `render-adapter` (artifact storage), `task-adapter` (create & status), `vector-adapter` (upsert/search). Domain services memanggil adapter dan melabeli observability (`tenantId/sessionId/toolName`).
- Supabase Functions SSE
  - Validasi input (schema), auth gate (JWT), batas payload, audit event penting.
- RLS hardening
  - Tambah `set_tenant(uuid)` dan kebijakan: `USING (tenant_id = current_setting('app.current_tenant')::uuid)` pada tabel tenant-scoped; siapkan migrasi SQL dan wrapper koneksi.
- Observability
  - Metrics berlabel (`tool_calls_by_tool{tool}` plus `tenant` jika aman), traces korelasi; exporter retry (rujukan `apps/api/src/observability/exporters.ts`).
- QA & CI/CD
  - Test suite: unit (services/validator/rate-limit), contract (OpenAPI + Zod), integration (Orchestrator + SSE + mock BaseHub), E2E (KB→render→task→audit), security (JWT/RLS/rate-limit), load (k6). Pipeline lint/typecheck/test/security scan & PR preview.

## Kriteria Penerimaan
- JWT & RBAC terpasang; request tidak sah ditolak (`401/403`).
- Rate-limit per-tenant berfungsi dengan metrik pelanggaran.
- Adapters alat beroperasi dan mengembalikan hasil sesuai kontrak Zod; observability lengkap.
- RLS mencegah kebocoran antar tenant; audit mencatat side-effects.
- Test suite lulus; metrics/health siap monitoring.

## Risiko & Mitigasi
- Saturasi beban: backpressure + circuit breaker + rate-limit.
- Ketergantungan eksternal: retry, timeout, fallback cache.
- Keamanan token: validasi ketat, rotasi kunci, log audit.

## Deliverables
- Integrasi security lengkap, adapters alat, migrasi RLS, observability yang diperkaya, test suite dan pipeline CI/CD diperbarui.

## Referensi Kode
- Orchestrator: `apps/orchestrator/src/index.ts` (auth/validation/idempotensi/rate-limit/audit/metrics/health)
- Domain: `apps/orchestrator/src/domain.ts` (services + Zod `@sba/sdk`)
- Security: `packages/security/src/jwt.ts`, `rateLimiter.ts`, `validator.ts`, `rbac.ts`
- SSE: `apps/api/supabase/functions/agent-stream/index.ts`
- Observability: `apps/api/src/observability/exporters.ts`
- RLS KB: `apps/api/supabase/migrations/20251128_kb.sql`

Siap dieksekusi secara otomatis fase demi fase dengan verifikasi end-to-end setelah Anda menyetujui rencana ini.