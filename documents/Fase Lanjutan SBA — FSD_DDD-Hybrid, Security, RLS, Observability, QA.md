## Tujuan
- Menyempurnakan implementasi FSD/DDD-hybrid, memperkuat keamanan (JWT/RBAC/rate-limit), menyiapkan adapters alat nyata, hardening RLS, memperkaya observability, dan melengkapi QA/CI agar sistem beroperasi mandiri, stabil, dan sesuai spesifikasi.

## Ruang Lingkup Komponen
- Orchestrator (application layer + domain services)
- SDK (kontrak Zod + generator dokumentasi)
- Security package (JWT/RBAC/Rate-limit/Validator)
- Supabase Functions (SSE path)
- RLS & audit di DB
- Observability (metrics/health/traces/logs)
- QA & CI/CD (unit/contract/integration/E2E/security/load)

## Rencana Aksi Per Komponen
### Orchestrator
- Integrasi penuh rate-limit per-tenant dari security, logging pelanggaran dan label per-alat
  - Referensi: apps/orchestrator/src/index.ts:61, 89, 160
- RBAC guard resource:action pada `POST /tool-call` (roles/permissions map)
  - Referensi: apps/orchestrator/src/index.ts:123
- Circuit breaker & backpressure sederhana untuk mencegah saturasi
- Idempotensi persisten ditingkatkan (Redis/DB) menggantikan JSON store
  - Referensi: apps/orchestrator/src/idempotencyStore.ts:1
- Observability label: tambah `tenantId/sessionId/toolName` pada metrics dan trace
- Hardening validasi input (Zod) dan payload limit
  - Referensi: apps/orchestrator/src/index.ts:103

### Domain Services & SDK
- Finalisasi kontrak Zod per alat (opsi locale/freshness/idempotency) dan ekspor index
  - Referensi: packages/sdk/src/tool-schemas.ts:1, packages/sdk/src/index.ts:1
- Tambahkan generator OpenAPI (stub) sinkronisasi dokumentasi kontrak
- Gunakan kontrak SDK di domain services
  - Referensi: apps/orchestrator/src/domain.ts:21–56

### Security Package
- JWT: validasi `exp/iss/aud` selain signature
  - Referensi: packages/security/src/jwt.ts:22
- RBAC: mapping `resource:action` dan integrasi entrypoint
  - Referensi: packages/security/src/rbac.ts:3
- Rate-limit: sliding window limiter per tenant
  - Referensi: packages/security/src/rateLimiter.ts:3
- Validator: pembungkus handler berbasis Zod
  - Referensi: packages/security/src/validator.ts:3

### Supabase Functions (SSE)
- Validasi input schema + batas payload dan audit event penting
- Auth gate (JWT) sebelum streaming
  - Referensi: apps/api/supabase/functions/agent-stream/index.ts:51–66, 127–167, 221–229

### RLS & Audit DB
- Implementasi fungsi `set_tenant(uuid)` dan kebijakan `USING (tenant_id = current_setting('app.current_tenant')::uuid)` pada tabel tenant-scoped; wrapper koneksi untuk set session
- Audit table append-only untuk side-effects (commit/creates)
  - Referensi KB: apps/api/supabase/migrations/20251128_kb.sql:31–35

### Observability
- Perkaya metrics (`tool_calls_by_tool{tool}`, `violations_total`, label `tenant` bila aman)
- Tracing korelasi; exporters (Prometheus/Datadog) dengan retry
  - Referensi exporters: apps/api/src/observability/exporters.ts:15–25, 27–40

### QA & CI/CD
- Unit: services domain, validator, rate-limit, idempotensi
- Contract: agent ↔ tools (OpenAPI + Zod)
- Integration: Orchestrator + Supabase SSE + BaseHub mock
- E2E: KB → render → task → audit
- Security: JWT expiry/issuer/audience, RBAC, RLS isolation, rate-limit compliance
- Load: k6 concurrent sessions; target p95 < 500ms (tool-call cached), start streaming < 1s
- Pipeline: lint/typecheck/test/security scan, PR preview environments

## Milestone
1. Security & Validasi (JWT/RBAC/rate-limit/idempotensi) — verifikasi endpoint & metrics
2. Adapters Alat Nyata & Observability label — verifikasi kontrak Zod, traces
3. RLS Hardening & Audit — verifikasi isolasi multi-tenant
4. QA & CI/CD Lengkap — semua suite hijau + load target tercapai

## Kriteria Penerimaan
- Semua entrypoint menolak request tidak sah (401/403), non-skema (400), payload berlebih (413)
- Rate-limit per-tenant aktif, pelanggaran tercatat di metrics
- Adapters alat bekerja sesuai kontrak Zod; audit mencatat side-effects
- RLS mencegah kebocoran lintas tenant; uji negatif lulus
- Test suite (unit/contract/integration/E2E/security/load) lulus; metrics/health siap monitoring

## Risiko & Mitigasi
- Saturasi beban: backpressure + circuit breaker + rate-limit
- Ketergantungan eksternal: retry, timeout, fallback cache
- Keamanan token: validasi ketat, rotasi kunci, audit log

## Deliverables
- Integrasi security lengkap, adapters alat, migrasi RLS, observability yang diperkaya, test suite dan pipeline CI/CD diperbarui

Saya akan mengeksekusi fase di atas secara otomatis, memverifikasi hasil end‑to‑end setiap milestone.