## Ikhtisar
- Tujuan: menyelaraskan implementasi `apps/api` dengan dokumen rancangan, memperkuat validasi, error handling, logging/telemetry, performa, dan testing, serta memperbarui dokumentasi.
- Konteks kode kunci:
  - Orchestrator inti: `apps/api/src/orchestrator/Orchestrator.ts:6`, registry: `apps/api/src/orchestrator/ToolRegistry.ts:19`
  - Skema alat: `apps/api/src/orchestrator/schemas.ts:4`
  - Supabase client & tenant context: `apps/api/src/infrastructure/repositories/SupabaseClient.ts:10`, `:12`
  - Knowledge tool: `apps/api/src/tools/KnowledgeToolSupabase.ts:6`
  - Validasi env: `apps/api/src/config/env.ts:3`
  - Telemetry: `apps/api/src/telemetry/index.ts:7`
  - Observabilitas exporters: `apps/api/src/observability/exporters.ts:15`, `:27`

## Audit Arsitektur & Kode
- Analisis dependensi & coupling antar modul; identifikasi modul yang terlalu saling bergantung.
- Evaluasi pola desain (Orchestrator, ToolRegistry); daftar technical debt yang terlihat (validasi di tepi, error handling global, logger).
- Hasil audit dirangkum dalam matriks temuan + rekomendasi per file/komponen.

## Refactoring & Modularisasi
- Tambah lapisan transport `src/api/` (Nest controllers): `runs.controller.ts`, `tools.controller.ts`, `sessions.controller.ts`, `health.controller.ts`.
- Service Nest untuk menghubungkan controllers → Orchestrator (`Orchestrator.ts`) → Tools (`ToolRegistry.ts`).
- Terapkan SOLID: pisahkan strategi pemilihan alat di Orchestrator (Strategy/Command), idempotency diteruskan via params.

## Validasi & Error Handling
- Boundary validation dengan `zod` (reuse `schemas.ts`) di controllers (pipes custom).
- Perketat `EnvSchema` (wajib `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`) dan tingkatkan pesan error di `validateEnv()`.
- Global `ExceptionFilter`: normalisasi error ToolRegistry (mis. alat tidak terdaftar) menjadi HTTP response terstruktur (`code`, `message`, `requestId`, `tenantId`).
- Fallback: cache hasil knowledge (TTL), retry render/task dengan `idempotencyKey` dan backoff adaptasi `withRetry` dari exporters.

## Logging & Telemetry
- Implementasi logger JSON berlevel (`debug|info|warn|error`) dengan korelasi `requestId`/`tenantId`.
- Integrasi `telemetry.trace/metric/error` di controllers, services, dan filter.
- Standarisasi metrik (latensi endpoint, tingkat kegagalan tool, throughput); push ke Prometheus/Datadog via exporters.

## Pencarian Pengetahuan (FTS + Vector)
- Upgrade `KnowledgeToolSupabase` dari `.ilike` ke FTS (ranking) dan, bila `pgvector` tersedia, hybrid similarity.
- Pertahankan RLS via `setTenantContext()`; limit `topK`, panjang query, dan tambahkan cache LRU pendek per tenant.

## Performa & Benchmarking
- Tuning `bullmq` (prioritas, concurrency, DLQ) untuk workers.
- Profiling titik panas: durasi `renderDocument/getDocument/createTask` dan antrean.
- Benchmark SLA: jalankan k6 dan `scripts/loadtest.ts`; target 95p < 500ms, log metrik ke Prometheus.

## Testing (≥ 80% coverage kode baru)
- Unit: Orchestrator (cabang render/task/search), ToolRegistry error paths, Env validation, Supabase RPC.
- Integrasi: alur `POST /runs` end‑to‑end dengan isolasi tenant (RLS), verifikasi metrik & log.
- Perf: skenario beban moderat; threshold SLA dan alarm bila gagal.

## Dokumentasi & Traceability
- Sinkronkan `/.trae/documents/RANCANGAN — apps/api (SBA-Agentic Orchestrator).md` dan `/.trae/documents/Penguatan dan Implementasi apps_api (SBA‑Agentic Orchestrator).md`:
  - Tambah API surface (endpoint, parameter, response, status codes) dan contoh payload.
  - Diagram komponen & sequence (client → controllers → orchestrator → tools → Supabase/workers).
  - Kebijakan RLS & `set_tenant`.
  - Observabilitas: daftar metrik, label, contoh push.
  - Changelog detail + traceability matrix requirement ↔ implementasi.

## Analisis & Riset
- Benchmark solusi sejenis untuk: validation pipes zod, logger JSON terstruktur, hybrid search FTS+vector, metrik API.
- Dokumen riset berisi executive summary, matriks perbandingan fitur, analisis SWOT, rekomendasi & risk assessment.

## Prototype & Evaluasi
- Prototype hybrid search (FTS+vector) dengan precision@k vs ILIKE.
- Prototype pipeline logger+telemetry+ExceptionFilter (simulasi error ToolRegistry).
- Lingkungan uji terisolasi dengan data dummy; KPI teknis: latensi, error rate, accuracy@k.

## Deliverables & KPI (SMART)
- SLA API: 95% request < 500ms pada endpoint utama.
- Coverage: ≥ 80% untuk kode baru.
- Zero critical errors pada error handling global.
- Logger & metrik terstandardisasi, terlihat di Prometheus/Datadog.
- Dokumen rancangan + changelog + traceability matrix terbarui.

## Tahapan Eksekusi
1) Audit arsitektur & codebase → laporan temuan.
2) Tambah controllers & service Nest → sambungkan ke Orchestrator/Tools.
3) Pasang validation & ExceptionFilter → fallback & idempotency.
4) Implement logger JSON & telemetry → exporters Prometheus/Datadog.
5) Upgrade KnowledgeTool ke FTS+vector & cache.
6) Benchmark/perf profiling & perbaikan bottleneck.
7) Unit/integrasi/perf tests → capai KPI coverage & SLA.
8) Sinkronisasi dokumentasi, diagram, changelog, traceability.

Konfirmasi rencana ini, maka saya lanjut eksekusi tahap demi tahap dan menyelaraskan kode serta dokumentasi sesuai target KPI.