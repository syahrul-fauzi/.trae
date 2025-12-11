# Target & Keberhasilan
- Dokumentasi use case lengkap (deskripsi, diagram sequence/activity, persyaratan, acceptance).
- Performa: waktu respon −30%, throughput +50%, error rate <0.1% (baseline → sesudah).
- Arsitektur: modul berlapis (clean boundaries), mudah diekstensi, coverage tes >80%.
- Reliabilitas inti: uptime 99.9%, MTTR <15m, RPO/RTO sesuai SLA.
- Peningkatan use case: ≥90% approval end-user dan kenaikan metrik bisnis terkait.

# Lokasi Deliverables (Eksplisit)
- Dokumen utama: `/home/inbox/smart-ai/sba-agentic/.trae/documents/Rencana Eksekusi Mendalam_ Use Case + ReFactory Arsitektur SBA-Agentic.md`.
- Indeks workspace: `/home/inbox/smart-ai/sba-agentic/workspace/_xref.md`.
- README root & docs: `/home/inbox/smart-ai/sba-agentic/README.md`, `/home/inbox/smart-ai/sba-agentic/docs/README.md`.
- Use case detail: `docs/use-cases/*.md` (per aplikasi/fitur).
- Diagram UML: `docs/architecture/uml/*.puml` + versi Mermaid di `docs/architecture/mermaid/*.md`.
- Laporan performa: `docs/performance/before-after.md` + grafik (PNG/SVG) di `docs/performance/assets/`.
- Panduan refactory & ADR: `docs/architecture/adr/*.md`.

# Inventarisasi Use Case (Ruang Kode)
- Frontend (Next.js App Router): halaman authenticated, login, observability, workflows.
  - Contoh pola: `apps/app/src/app/(authenticated)/**`, `apps/app/src/app/login/page.tsx`, observability UI.
  - (Jika workspace memakai `apps/web/...` untuk web) → cakup halaman & API routes terkait: `apps/web/src/app/api/**`, `apps/web/src/features/**`.
- API Routes inti: auth/tenants/runs/agent/knowledge/analytics/metrics/alerts/tools/tasks/workflows/openapi/proxy/health/loadtest.
  - Contoh: `apps/app/src/app/api/auth/**`, `apps/app/src/app/api/runs/**`, `apps/app/src/app/api/metrics/**`, `apps/app/src/app/api/health/**`.
- Orchestrator (Agentic runtime): `apps/orchestrator/src/**` (engine, domain, idempotency, rateLimiter, selfHealing).
- Monitoring & ops: Prometheus/Grafana/Alertmanager (`monitoring/*.yml`, `monitoring/grafana/dashboards/*.json`, `ops/monitoring/docker-compose.yml`).

# Metode Analisis Use Case
- Template per use case:
  - Judul, aktor, tujuan (MOV), prasyarat, alur normal, alur alternatif/edge cases, postcondition, acceptance criteria, dependensi, risiko/mitigasi.
- Diagram:
  - Use Case (aktor ↔ sistem), Sequence (UI ↔ API ↔ domain ↔ infra), Activity (alur proses & keputusan).
- User Journey:
  - Intent → langkah → titik gesekan → metrik (conversion, dropout); kaitkan ke KPI bisnis.
- Validasi: kelayakan, biaya/manfaat/risiko, alternatif solusi, rekomendasi.

# Rencana ReFactory (Clean Architecture + SOLID)
- Layer:
  - `presentation` (pages/components, route handlers/controllers),
  - `application` (use cases/services/orchestrators),
  - `domain` (entities/value objects/policies/events),
  - `infrastructure` (adapters: HTTP/SSE/WS, DB/Cache, eksternal, logging/metrics).
- Contracts & DIP:
  - Interface-driven (repository/service ports), anti-corruption untuk integrasi eksternal, error taxonomy (typed).
- SOLID:
  - SRP pada service/use case, OCP melalui strategi/polimorfisme, LSP untuk substitusi interface, ISP untuk antarmuka sempit, DIP via container DI.
- Tooling & path alias:
  - Konsistensi `tsconfig.json`/workspace, alias layer (mis. `@app`, `@domain`, `@infra`).
- Incremental non-breaking:
  - Buat adapter bridge, ubah impor bertahap, jaga kompatibilitas API publik.

# ReOrganize Sistem
- Audit kohesi/coupling; kelompokkan modul per layer & bounded context.
- DI container ringan (factory/registry) per environment (dev/test/prod).
- Ports/adapters untuk komunikasi antar modul; domain events untuk loose coupling.
- Konsolidasi konfigurasi: schema env + validation; standar error mapping HTTP.

# Penguatan Fitur Inti
- Profiling:
  - Frontend: Lighthouse, Web Vitals (TTFB/LCP/CLS/INP), Server-Timing.
  - Backend: histogram Prometheus p95/p99, CPU/mem profiling; baseline & tracking.
- Caching:
  - HTTP (Cache-Control/ETag), aplikasi (memo/LRU), opsi Redis (jika tersedia) dengan fallback in-memory.
- Reliabilitas & error handling:
  - Retry (exponential+jitter), fallback fungsional, circuit breaker per integrasi, bulkhead untuk isolasi resource.
- Monitoring & Alerting:
  - Standarisasi metrics (text 0.0.4), dashboard Grafana (RPS, p95/p99), alert rules (latency/error rate/SLO breach), logging terstruktur + trace ID.
- Keamanan:
  - Validasi timestamp/JWT, rate limiting per tenant/endpoint, audit trail, RBAC.

# Peningkatan Use Case
- Backlog peningkatan dari feedback pengguna (hipotesis nilai → eksperimen).
- Feature toggle: env/konfigurasi (mis. `NEXT_PUBLIC_FEATURE_*`) untuk canary/rollout bertahap.
- A/B testing: instrumentation dampak (conversion, time-on-task), rollback cepat bila perlu.
- Workshop/UAT terarah untuk persetujuan.

# Testing & CI
- Unit: fokus domain & application; target coverage >80%.
- Integration: alur kritis (auth, runs, knowledge, metrics, observability).
- E2E: Playwright dengan artefak (trace/video/screenshot), stabilisasi selector & waits; jalankan dengan server reuse saat perlu.
- Validasi konfigurasi: schema env, contract tests (OpenAPI), security tests.
- Laporan: sebelum/sesudah performa beserta grafik.

# Tahapan Eksekusi (Tanpa Jadwal Waktu)
1. Baseline & Inventaris: petakan use case, dependency, metrik awal.
2. Dokumentasi: lengkapi template per use case + diagram.
3. Kerangka arsitektur: siapkan layer & DI, alias path.
4. Reorganisasi bertahap: pindah modul, perbaiki impor & tests.
5. Hardening reliabilitas: caching, retry/fallback, circuit/bulkhead, metrics & alerting.
6. Peningkatan use case: toggle + A/B + UAT.
7. Validasi akhir & laporan: performa, reliabilitas, dokumentasi.

# Risiko & Mitigasi
- Import putus saat reorganisasi → alias & adapter bridge, refactor bertahap.
- Flakiness E2E (server/selector) → server reuse, penyesuaian waits/timeout, pre-auth state.
- Ketergantungan eksternal (Redis/prom-client) → fallback in-memory, text metrics.

# Langkah Berikutnya Setelah Persetujuan
- Buat dokumen utama dan indeks `_xref.md` yang memetakan use case ↔ file/route/modul.
- Mulai analisis use case prioritas (auth, runs, knowledge, observability) dan gambar diagram.
- Siapkan kerangka Clean Architecture & DI tanpa mematahkan publik API.
- Jalankan baseline pengukuran performa & siapkan dashboard/alerts.
- Susun backlog peningkatan use case dan strategi rollout (toggle/A-B).