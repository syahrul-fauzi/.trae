# Dokumen Perencanaan Terstruktur — Smart Business Assistant (SBA)

## Ringkasan Eksekutif (≤2 halaman)
- Visi: Platform SaaS multi-tenant dengan AG-UI + BaseHub, menghadirkan conversational agents, dokumentasi otomatis, dan workflow orchestration.
- Tujuan 90 hari: Orchestrator + Tool Registry, integrasi BaseHub read, observability dasar, RLS desain, SSE chat MVP, KB seed.
- Nilai bisnis: efisiensi operasi, self-service, monetisasi templates & automation, governance.

## Analisis Mendalam (15–20 halaman)
### C4 Model — Container & Component
- Lihat `SBA_Diagram_Arsitektur_Overview.svg` (Container) dan `SBA_Diagram_Arsitektur_Components.svg` (Component) untuk detail relasi klien, frontend, orchestrator, tools, CMS, storage, observability.

### Flow Sistem — BPMN 2.0
- Lihat `.drawio`: `SBA_Flow_Core_Workflow.drawio` (KB query & streaming), `SBA_Flow_Error_Handling.drawio`, `SBA_Flow_Integration_Sequence.drawio`.

### Gap Analysis Matrix
| Area | Blueprint | Implementasi | Gap | Prioritas |
|---|---|---|---|---|
| Orchestrator | Ada (NestJS) | Belum | Besar | P1 |
| Tool Registry | Ada | Belum | Besar | P1 |
| LLM Adapter | Ada | Belum | Besar | P1 |
| RLS | Ada | Belum | Besar | P1 |
| Observability | OTel/Prometheus | Belum | Sedang | P2 |
| BaseHub | Sumber konten | Minimal | Sedang | P2 |
| Workers | Render/Indexing | Belum | Sedang | P2 |
| Billing | Stripe | Placeholder | Sedang | P3 |

### Benchmark Industri
- Streaming start <1s, first token <2s; p95 tool latency <500ms.
- Throughput >1000 req/sec, HPA dan stateless endpoints.
- Security: OAuth2/OIDC, RLS, secrets manager, CSP/HSTS, audit trails.

## Timeline (5 Milestones) & Critical Path
- M1: Orchestrator skeleton + AG-UI wiring (2 sprints) — critical path.
- M2: Tool Registry + BaseHub read (2 sprints) — critical path.
- M3: Observability (OTel/Prometheus) + metrics (1 sprint).
- M4: RLS + Auth OIDC + tenant provisioning (2 sprints) — critical path.
- M5: Render pipeline + workers + cache invalidation (2 sprints).

## Alokasi Sumber Daya
- Komposisi tim: Tech Lead, Backend (2), Frontend (1), DevOps (1), QA (1).
- Infrastruktur cloud: API Orchestrator (K8s AWS/GCP), Redis (Elasticache/Upstash), Postgres managed, S3/R2, base image registry, Grafana/Prometheus, Sentry.
- Budget per kuartal (indicative): Infra (40%), Dev (40%), Ops/QA (20%).

## 10 KPI Terukur (baseline/target)
- p95 latency tool: baseline N/A → target <500ms.
- SSE first-event: baseline 200ms → target <100ms.
- Concurrency handled: baseline N/A → target 10k.
- Agent error rate: baseline N/A → target <1%.
- Cache hit ratio: baseline N/A → target >60%.
- Token usage per tenant: baseline N/A → target budgeted.
- SUS score: baseline N/A → target >80.
- Onboarding time: baseline N/A → target <5 menit.
- MTTR incident: baseline N/A → target <2 jam.
- Cost per request: baseline N/A → target < $0.002.

## Analisis Risiko (Probability–Impact + Mitigasi)
- Multi-tenant data leak (High–High): RLS + per-request tenant context; audit trails; pen-test berkala.
- Provider outage LLM (Med–Med): fallback model, cached responses, feature flag.
- Rate-limit saturation (Med–Med): adaptive limiter per tenant, backpressure SSE, queue buffering.
- Queue backlog (Med–Med): concurrency tuning workers, DLQ, retry with jitter.
- Schema drift CMS (Low–Med): versioning, webhook invalidation, contract tests.

## Rekomendasi Implementasi
- Prioritaskan M1–M2 untuk unlock nilai inti; lanjutkan M4 untuk tingkatkan keamanan; M5 untuk monetisasi dokumen.

