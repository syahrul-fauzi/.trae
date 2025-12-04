## Ringkasan Temuan
- Dokumen rancangan menargetkan arsitektur Turborepo dengan `apps/*` dan `packages/*`, Agent Orchestrator (Node/Nest), RLS Postgres, Zod+OpenAPI, observability, dan CI/CD pratinjau.
- Implementasi saat ini berpusat pada Supabase Functions (Deno) dengan SSE streaming untuk agent, migrasi Postgres dan fungsi utilitas observability. Manajer paket: `bun`; Turborepo aktif.
- Ketidaksesuaian utama: belum ada modul Orchestrator Node/Nest, paket `sdk/tools/db/auth/telemetry` belum konsisten tersedia, RLS berbasis `auth.uid()` per dokumen KB, dan standar workspace (`pnpm-workspace.yaml`) berbeda dengan rekomendasi (menggunakan Bun + workspaces di `package.json`).

## Evaluasi Arsitektur & Kualitas Kode
- Agent Streaming (SSE) sudah ada dan rapi: `apps/api/supabase/functions/agent-stream/index.ts:51–66, 127–167, 221–229` mengalirkan events bertahap serta ping keep-alive.
- Observability helper sudah menerapkan retry dan integrasi Prometheus/Datadog: `apps/api/src/observability/exporters.ts:3–13, 15–25, 27–40`.
- Knowledge Base schema & FTS tersedia namun RLS policy mengikat ke `auth.uid()` alih-alih tenant claim: `apps/api/supabase/migrations/20251128_kb.sql:31–35`.
- Turborepo tasks sesuai kebutuhan (build/dev/lint/test/typecheck): `turbo.json:3–18`. Workspaces terdefinisi via Bun: `package.json:4–13`.
- `tsconfig.json` ketat (`strict: true`) dan sesuai web + bundler modern: `tsconfig.json:2–19`.

## Praktik Terbaik & Benchmark
- Konsistenkan kontrak tools berbasis Zod dan OpenAPI agar AG-UI/LLM memiliki determinisme input-output.
- Terapkan RLS berbasis `tenant_id` melalui `SET LOCAL app.current_tenant` dan policy `current_setting(...)` untuk isolasi data lintas tenant.
- Standardisasi pola adapter (Knowledge/Render/Task/Vector) dalam paket terpisah; dorong reuse dan testability.
- Selaraskan pipeline CI dengan pratinjau lingkungan per PR (staging ephemeral) serta metrik SLO.

## Peluang Peningkatan (Spesifik)
- Fitur baru
  - Agent Orchestrator terdedikasi (Node/Nest) untuk manajemen sesi, tool registry, dan backpressure; Supabase Functions tetap untuk edge SSO/SSE.
  - Document Generation & Commit ke BaseHub (Render worker + Blob + webhook invalidation).
  - Connector Hub (CRM/ERP/Payments/Messaging) dengan billing usage dan quotas per tenant.
- Refactoring kode
  - Ekstraksi kontrak Zod + OpenAPI ke `packages/sdk` dan tool adapters ke `packages/tools`.
  - Konsolidasi observability ke `packages/telemetry` dan gunakan middleware yang menyuntik `tenantId/sessionId/requestId`.
- Reorganisasi struktur
  - Tambahkan `apps/orchestrator` (Node/Nest), `apps/worker`, serta `packages/db/auth/utils/infra/devops` sesuai rancangan.
  - Gunakan `tooling/*` untuk shared configs (sudah ada) dan align lint/typecheck di seluruh apps.
- Penguatan implementasi
  - RLS per-tenant, idempotency-key untuk side-effect, outbound allowlist proxy, audit trail.
  - Cache BaseHub (Postgres+Redis) + optional Vector index; webhook-driven invalidation.

## Arsitektur Target (Mermaid)
```mermaid
flowchart LR
  subgraph Client
    Web[AG-UI Client (Next.js)]
  end
  subgraph Edge
    SupaFns[Supabase Functions (SSE/Auth)]
  end
  subgraph Core
    Orchestrator[Agent Orchestrator (Node/Nest)]
    Tools[Tool Registry (Adapters)]
    Session[Redis SessionStore]
    Model[LLM Adapter]
    Postgres[(Postgres + RLS)]
  end
  subgraph Content
    BaseHub[BaseHub]
    Blob[S3/R2]
    Vector[Vector DB (opt)]
  end
  Web -->|WS/HTTP| SupaFns
  SupaFns -->|events| Orchestrator
  Orchestrator -->|session| Session
  Orchestrator -->|tool call| Tools
  Tools -->|query| BaseHub
  Tools -->|store| Blob
  Tools -->|index/search| Vector
  Orchestrator -->|audit| Postgres
```

## Spesifikasi Teknis
- Packages
  - `packages/sdk`: OpenAPI + Zod schemas untuk tool params/results; generator script.
  - `packages/tools`: adapters `basehub-adapter`, `render-adapter`, `task-adapter`, `vector-adapter` dengan interface `IToolAdapter`.
  - `packages/db`: Prisma (atau SQL mig) + wrapper `set_tenant(tenant_uuid)`; helper koneksi.
  - `packages/auth`: JWT middleware (OIDC), extractor tenant, RBAC.
  - `packages/telemetry`: init OTel, Prom metrics, Sentry; middleware attach context.
- RLS & Tenant
  - Function `set_tenant(uuid)` dan policy: `USING (tenant_id = current_setting('app.current_tenant')::uuid)` pada tabel tenant-scoped.
  - Atur `SET LOCAL app.current_tenant` per request/transaction.
- Tool Contracts
  - Zod-first, contoh `KnowledgeToolParams` dengan `tenantId`, `query`, `options.topK`.
  - OpenAPI 3.0 untuk endpoints `getDocument`, `renderDocument`, `createTask`.
- Observability
  - Trace keys: `tenantId`, `sessionId`, `requestId` di semua spans.
  - Metrics: `tool_calls_total{tool}`, `agent_sessions_active`, `llm_tokens_used`.
- Security
  - Secrets di Vault; outbound allowlist/proxy; idempotency; audit logs append-only.

## Rencana Migrasi Bertahap
- Fase 1 (Foundation)
  - Buat `packages/sdk/tools/auth/telemetry/db` skeleton; align lint/typecheck; siapkan OpenAPI + Zod.
  - Tambah `apps/orchestrator` minimal: session WS, tool dispatch, streaming pass-through dari Supabase Functions.
- Fase 2 (Knowledge & Cache)
  - Implement `basehub-adapter`, cache ringkas (Postgres+Redis), webhook invalidation.
  - Ubah Supabase Functions untuk forward ke Orchestrator sambil tetap SSE.
- Fase 3 (Document & Task)
  - Render worker (BullMQ), blob storage, commit ke BaseHub; Task service + integrations.
- Fase 4 (RLS Harden & Billing)
  - Terapkan `set_tenant`, migrasi policy; quotas/rate-limit; billing metering.
- Fase 5 (Scale & Integrations)
  - Vector search, connectors marketplace, SSO enterprise.

## Kriteria Pengujian
- Unit: tools adapters, session logic, RLS helper (valid/invalid tenant claims).
- Contract: agent ↔ tools (pact-style) terhadap OpenAPI + Zod.
- Integration: BaseHub sandbox + Orchestrator; Supabase Functions SSE path.
- E2E: AG-UI chat alur KB; render dokumen; createTask; multi-tenant isolation.
- Load: k6 untuk concurrent sessions; target p95 < 500ms tool call (cached) dan start streaming < 1s.
- Security: RLS validation, SAST/DAST, audit trail konsistensi.

## Estimasi Sumber Daya & Timeline
- Tim: Tech Lead, 2 Backend, 1 Frontend, 1 DevOps, 1 QA.
- Durasi:
  - Phase 1: 2 minggu
  - Phase 2: 4–6 minggu
  - Phase 3: 6–8 minggu
  - Phase 4: 6 minggu
  - Phase 5: berkelanjutan

## Daftar Tugas Teknis & Penanggung Jawab
- Backend
  - Implement `apps/orchestrator` (WS, sessions, tool registry).
  - Adapters `basehub/render/task/vector` + cache + webhook.
  - RLS function/policies dan koneksi wrapper.
- Frontend
  - Integrasi AG-UI client ke Orchestrator; komponen streaming; panels.
- DevOps
  - CI/CD pratinjau per PR; observability stack; Vault; infra IaC.
- QA
  - Suite unit/contract/integration/e2e; k6 load tests; security checks.

## Prioritas Implementasi
- High: Orchestrator minimal, SDK+Tools contracts, RLS hardening, BaseHub cache.
- Medium: Render pipeline, Task service, observability middleware.
- Low: Vector search, connectors marketplace.

## Panduan Validasi
- Uji E2E: "tanya SOP" → getDocument (BaseHub) → streaming jawaban → audit & logs tercatat.
- Multi-tenant: pastikan tenant A tidak dapat membaca data tenant B melalui tests RLS.
- Dokumentasi: OpenAPI publish; storybook untuk AG-UI; dashboards Grafana untuk latency dan errors.

## Lampiran (Referensi Kode)
- SSE agent stream: `apps/api/supabase/functions/agent-stream/index.ts:51–66, 127–167, 221–229`.
- Observability exporters: `apps/api/src/observability/exporters.ts:3–13, 15–25, 27–40`.
- KB schema & policies: `apps/api/supabase/migrations/20251128_kb.sql:1–12, 31–35`.
- Turborepo pipeline: `turbo.json:3–18`; Workspaces: `package.json:4–13`; TS config: `tsconfig.json:2–19`.

## Catatan Metodologis
- Analisis komparatif digunakan untuk mengidentifikasi kesenjangan antara rancangan dan implementasi, memvalidasi hipotesis perbaikan, dan memprioritaskan solusi dengan dampak bisnis terbesar.
- Dokumen rancangan mengikuti struktur requirement system (fungsi & non-fungsi), memastikan keselarasan pemangku kepentingan serta menjadi acuan pengujian dan verifikasi.