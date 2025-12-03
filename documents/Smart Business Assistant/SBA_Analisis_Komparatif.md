# Analisis Komparatif SBA (Blueprint) vs Implementasi `sba-agentic`

## Ringkasan Eksekutif
- SBA menargetkan platform SaaS multi-tenant dengan AG-UI, BaseHub, Orchestrator, Tool Registry, RLS, observability, dan security kelas enterprise.
- Implementasi `sba-agentic` telah memiliki fondasi kuat: Next.js, SSE agent (rate-limited), Supabase (Postgres/Edge Functions), Upstash Redis, CSP/HSTS, dan klien multi-tenant. Fitur orchestrator (NestJS), Tool Registry, LLM adapter, RLS, billing, observability standar, dan integrasi BaseHub sebagai sumber konten utama belum hadir.
- Rekomendasi prioritas: bangun Orchestrator + Tool Registry, observability (OpenTelemetry/Prometheus), Postgres RLS, dan konsolidasikan penggunaan BaseHub untuk knowledge/templates.

## Metodologi Analisis
- Dokumen acuan: `/.trae/documents/Perencanaan Proyek — SBA (Smart Business Assistant).md`, `/.trae/documents/PLAN & RANCANGAN Monorepo — SBA (Smart Business Assistant).md`, `/.trae/documents/Use-Case & Ide SaaS untuk Smart Business Assistant (SBA).md`.
- Artefak kode: `apps/app`, `apps/api/supabase/functions`, `apps/docs`, `packages/kv`, `packages/supabase`.
- Kerangka SMART: specifik cakupan, metrik terukur (latency/throughput/SUS), realistis dicapai bertahap, relevan dengan target multi-tenant, terikat waktu melalui milestones.

## Pemetaan Fitur Utama
- Streaming Conversational Agent: blueprint via AG-UI + Orchestrator + LLM; implementasi saat ini SSE event `agent.started` dengan rate limit Upstash (apps/api/supabase/functions/ratelimited-agent/index.ts:5, 15–27).
- Knowledge Base: blueprint via BaseHub GraphQL + cache invalidation; implementasi memiliki `kb-ingest` ke Supabase (apps/api/supabase/functions/kb-ingest/index.ts:33–49).
- Multi-tenant: blueprint Postgres RLS dan tenant provisioning; implementasi header `Authorization` + `X-Tenant-ID` (apps/app/src/shared/api/tenant-client.ts:20–24) dengan banyak endpoint per-tenant (apps/app/src/shared/api/tenant-client.ts:35–182).
- Observability: blueprint OpenTelemetry/Prometheus/Grafana/Sentry; implementasi CSP/HSTS hardening (apps/docs/middleware.ts:7–17), belum ada OTel/Prometheus.
- Tool Registry (getDocument/render/createTask): belum ada.
- Billing/Stripe: kunci env tersedia, rute belum.

## Arsitektur Teknis: Persamaan dan Perbedaan
- Persamaan
  - Next.js frontend dengan fokus streaming dan real-time endpoints (env flags) (apps/app/src/shared/config/env.ts:34–37, 85–92).
  - Validasi input dengan `zod` (kb-ingest).
  - Redis event/pub-sub (packages/kv/src/index.ts:21–27).
- Perbedaan
  - Orchestrator: blueprint Node/Nest + Tool Registry; implementasi edge functions tanpa runtime orchestration dedikasi.
  - Data isolasi: blueprint Postgres RLS + audit; implementasi belum punya RLS.
  - CMS: blueprint menjadikan BaseHub sumber utama; implementasi lebih bertumpu pada Supabase untuk KB, BaseHub sekadar konten marketing.

## Diagram Komponen
- Lihat `SBA_Diagram_Arsitektur_Overview.svg` dan `SBA_Diagram_Arsitektur_Components.svg` dalam folder ini.

## Alur Kerja & Sequence
- Blueprint: User → AG-UI → Orchestrator → LLM intent → Tool Registry → BaseHub → stream hasil → audit log.
- Repo: User → Edge Function SSE (`agent.started`) → client menerima event; belum ada reasoning dan tool invocation.
- Flow BPMN disediakan sebagai `.drawio`: `SBA_Flow_Core_Workflow.drawio`, `SBA_Flow_Error_Handling.drawio`, `SBA_Flow_Integration_Sequence.drawio`.

## Integrasi & API Mapping
- AG-UI endpoints: `AGUI_SSE_ENDPOINT`, `AGUI_WS_ENDPOINT` (apps/app/src/shared/config/env.ts:35–37).
- Tenant API: `GET/PATCH /tenants/:id`, `.../users`, `.../workspaces`, `.../runs` (apps/app/src/shared/api/tenant-client.ts:35–182).
- SSE Agent: Upstash sliding window (20/m) (apps/api/supabase/functions/ratelimited-agent/index.ts:5) dengan key `agent:<ip>` (apps/api/supabase/functions/ratelimited-agent/index.ts:15–21).
- KB ingest: Supabase insert + embeddings opsional (apps/api/supabase/functions/kb-ingest/index.ts:37–48).

## Evaluasi Kinerja
- Target industri: response start <500ms (cached), first token <2s; throughput >1000 req/sec.
- Kondisi saat ini: SSE event sederhana dan ringan; belum ada metrik p95 tool latency.
- Peningkatan: tambah Prometheus metrics (agent_event_count, p95_latency), Redis batching, HPA pada API/worker.

## Evaluasi Skalabilitas
- Target: >10.000 concurrent SSE dengan backpressure dan reconnect.
- Kondisi: Edge Functions terukur; tidak ada queue/worker untuk render/indexing.
- Peningkatan: BullMQ workers, per-tenant concurrency limit, backoff/circuit breaker.

## Evaluasi Keamanan
- Ada: CSP/HSTS/hardening headers (apps/docs/middleware.ts:7–17), Zod input validation.
- Gap: OAuth2/OIDC, Postgres RLS, secrets manager, idempotency-key untuk tools.
- Peningkatan: implement OIDC, RLS (`app.current_tenant`), Vault/Secret Manager, AES-256 at-rest, TLS in-transit.

## Evaluasi UX/UI
- Target: SUS >80, onboarding <5 menit, reconnect/backoff stabil (apps/app/src/shared/config/env.ts:125–129).
- Kondisi: AG-UI flags & endpoints ada; belum ada telemetry UX.
- Peningkatan: onboarding wizard, seed templates, instrumentation ke Sentry/PostHog.

## 10 Temuan Utama (dengan Referensi Kode)
1. Upstash rate limit & SSE start — apps/api/supabase/functions/ratelimited-agent/index.ts:5, 15–27.
2. AG-UI endpoints & flags — apps/app/src/shared/config/env.ts:34–37, 85–92.
3. Multi-tenant headers — apps/app/src/shared/api/tenant-client.ts:20–24.
4. CSP/HSTS hardening — apps/docs/middleware.ts:7–17.
5. KB ingest (Zod) — apps/api/supabase/functions/kb-ingest/index.ts:33–49.
6. Redis publish util — packages/kv/src/index.ts:21–27.
7. Tidak ada Orchestrator Nest/Tool Registry di repo.
8. Tidak ada LLM adapter.
9. Observability (OTel/Prometheus) belum diimplementasi.
10. RLS dan audit trail belum tersedia.

## 5 Rekomendasi Implementasi + ROI Ringkas
- Orchestrator + Tool Registry: ROI tinggi; unlock core fitur; effort menengah.
- Observability (OTel/Prometheus): ROI tinggi; menurunkan MTTR; effort rendah-menengah.
- RLS + OIDC: ROI tinggi (enterprise); mitigasi risk; effort menengah.
- Render pipeline + Workers: ROI menengah; monetisasi dokumen; effort menengah.
- BaseHub webhook cache invalidation: ROI menengah; relevansi jawaban; effort rendah.

## Penutup
- `sba-agentic` siap menjadi basis SBA. Eksekusi rekomendasi menyelaraskan dengan blueprint dan standar industri.

