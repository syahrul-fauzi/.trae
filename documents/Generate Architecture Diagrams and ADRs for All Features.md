## Cakupan & Tujuan
- Buat paket dokumentasi arsitektur per fitur (12 fitur + umbrella): Sequence Diagram (UML), Component Diagram (bounded context, interface/port), Dataflow Diagram (DFD level 0–2) dalam format Mermaid.
- Tambahkan ADR berformat lengkap (Context, Decision, Alternatives, Consequences) untuk keputusan arsitektur utama per fitur.

## Fitur & Penamaan File
- Fitur (↔ PRD): analytics_heatmap, rbac_access_control, metrics_observability, security_headers_csp, rate_limiting_upstash, agent_interrupt_resume, generative_ui, multimodal_messages, meta_events_feedback, ensure_tenant_header, supabase_client_factories, ci_guard_secret_shield.
- Path diagram per fitur:
  - `workspace/02_Architecture/diagrams/<feature>-sequence.mmd`
  - `workspace/02_Architecture/diagrams/<feature>-component.mmd`
  - `workspace/02_Architecture/diagrams/<feature>-dataflow.mmd`
- ADR: `workspace/02_Architecture/ADR-xxx.md` (nomor berurutan) — 1 ADR per fitur + 1 ADR umbrella.

## Notasi & Konvensi Mermaid
- Sequence: `sequenceDiagram` (lifelines: actor/user, UI, komponen, API routes, DB/kv/external; gunakan `Note` untuk menjelaskan langkah penting).
- Component: `flowchart` + subgraph sebagai bounded context; node berlabel `<<component>>`/`<<interface>>`; port diwakili dengan label/prefix; arah dependensi dengan panah.
- Dataflow: `flowchart` DFD (level 0–2): Entities (sumber/tujuan), Processes, Data Stores; anotasi bisnis kritis via `Note`.
- Legend: blok `subgraph Legend` menjelaskan simbol dan konvensi.

## Bounded Context Utama
- Analytics (heatmap, meta events), Security (headers/CSP, rate-limiting), Access Control (RBAC), Observability (metrics/tenant), Agent Runtime (interrupt/resume), UI Generatif (renderer/tokens), Multimodal (uploads/TTL), Supabase Clients (factories/guard).

## Isi Diagram per Fitur (Ringkas)
- Heatmap (Sequence): User → Browser UI → HeatmapTracker → `/api/analytics/heatmap` → Supabase (store) → Admin UI (overlay); Notes: payload, tenant header, rate-limit client.
- Heatmap (Component): UI lib, App API, Shared metrics, RBAC, Supabase store (Analytics); BC: Analytics.
- Heatmap (DFD): Entity User → Process CollectClick → DataStore Analytics → Process AdminOverlay → Entity Admin.
- RBAC (Sequence): Actor → Request → `withRBAC(resource,action)` → allow/deny → Audit; Notes: sesi Supabase/cookie.
- Metrics (Sequence): Client → Route wrapped by `withMetrics` → Registry → `/api/metrics (prom text)` → Observability; Notes: tenant label.
- Security Headers (Component): Middleware (CSP nonce, HSTS, XFO, XCTO, RP, PP) → App/Web; BC: Security.
- Rate-limiting (Sequence): Request → Interceptor/Middleware → Upstash bucket check → 200/429 → Headers; Notes: fallback in-memory.
- Interrupt/Resume (Sequence): Runtime → Emit interrupt → API approval → Resume/Cancel → Audit/Metrics.
- Generative UI (Sequence): Agent → UI Description → Renderer → Components → User Interaction.
- Multimodal (DFD): Entity User → Process Upload/Validate → DataStore Attachments (TTL) → Agent Consume → Output.
- Meta events (DFD): Entity User → Process React → DataStore MetaEvents → Process Aggregate → Dashboard.
- Tenant Header (Sequence): Client → ensureTenantHeader → proceed/error → Metrics label.
- Supabase Factories (Component): Factories (SSR/Browser) → Consumers (apps/packages) → `ci:guard`.
- CI Guard (Component): Pipeline → Guard Scan → Pass/Fail → Whitelist; BC: Security/CI.

## ADR Topik (Contoh Mapping)
- ADR-001 Mermaid untuk UML/DFD; ADR-002 Bounded Context per domain; ADR-003 Tenant header wajib; ADR-004 Upstash rate-limit + fallback; ADR-005 RBAC guard pattern; ADR-006 Metrics registry & prom text; ADR-007 Interrupt/resume desain; ADR-008 Generative UI renderer & a11y; ADR-009 Multimodal uploads & TTL; ADR-010 Meta events agregasi; ADR-011 Supabase factories & ci:guard; ADR-012 Security headers & CSP nonce; ADR-013 Umbrella integrasi domain.

## Kualitas & Penjelasan
- Sequence Diagram: sertakan `Note` untuk setiap langkah penting.
- Component Diagram: tandai subgraph sebagai bounded context; sebut interface/ports.
- Dataflow Diagram: level 0 ringkas; level 1–2 untuk alur kritis (analytics, agent runtime, security/observability).

## Eksekusi
- Buat semua file `.mmd` di path yang ditentukan (12 fitur × 3 diagram = 36 file; plus ADR 13 file).
- Isi ADR dengan 4 bagian (Context, Decision, Alternatives, Consequences), merujuk ke `README.md` dan `docs/README.md`.

## Output
- Paket dokumentasi arsitektur lengkap per fitur (3 diagram + ADR) dan satu ADR umbrella. Setelah selesai, saya akan ringkas isi dan lokasi file untuk review.