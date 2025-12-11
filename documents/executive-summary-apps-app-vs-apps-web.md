# Executive Summary: apps/app vs apps/web

- Objective
  - App: operasional agentic, kontrol eksekusi, observability, keamanan.
  - Web: UX modular terpadu untuk fitur bisnis dan agentic UI.
- KPI
  - p95/p99 latency, error rate %, throughput, health. Diekspor oleh App, ditampilkan oleh Web.
- Use Case Utama
  - Tumpang tindih: auth, dashboard, knowledge, integrations.
  - Perbedaan: kontrol runs/observability (App) vs chat/workflows/meta-events (Web).
- Functional Requirements
  - App: RBAC, rate limit, tenant header, metrics registry, agents/runs API.
  - Web: dashboard agregasi, chat runtime, workflows builder, telemetry/CSP.
- Integrasi
  - Web menarik metrik dari App via `NEXT_PUBLIC_APP_URL`; tenant header wajib.
- SWOT
  - App: kuat observability/keamanan; peluang perluas UI kontrol.
  - Web: kuat UX modular; peluang harmonisasi RBAC & kontrol eksekusi.
- Rekomendasi
  - Standarisasi observability, harmonisasi RBAC, konsolidasi kontrol eksekusi, target KPI seragam.
