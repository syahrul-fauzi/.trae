# Arsitektur Sistem SBA Agentic (apps/app)

## App Router & Layout
- Root: `sba-agentic/apps/app/src/app/layout.tsx`
- Segmen: `(authenticated)`, `(public)`, `[locale]`
- Providers: `src/app/providers.tsx`

## Fitur Utama
- Dashboard: `src/features/dashboard/ui/Dashboard.tsx`
- Run Controls: `src/features/run-controls/ui/*`
- AG-UI: `src/features/agui/ui/*`
- Observability: `src/app/observability/page.tsx`

## Real‑time
- Klien SSE/WS: `src/shared/api/sse.ts`
- SSE per run: `src/app/api/runs/[runId]/events/route.ts`
- Proxy AGUI: `src/app/api/proxy/agui/[...path]/route.ts`

## Runtime Agentic
- Inti: `src/processes/agentic/runtime.ts`
- Kapasitas: `src/processes/agentic/capacity.ts`
- Optimizer/Anomaly/Reports: `src/processes/agentic/*`

## RBAC
- Konfigurasi: `src/shared/config/rbac.ts`
- Wrapper: `src/shared/lib/rbac.ts`

## Observability & Metrics
- Prometheus runtime: `src/app/api/metrics/route.ts`
- Registry + p95/p99: `src/app/api/metrics/prometheus/route.ts`, `src/shared/metrics-registry.ts`

## API OpenAPI
- Generator: `src/shared/lib/openapi.ts`
- Endpoint: `src/app/api/openapi/route.ts`

## Analytics & Heatmap
- Tracker: `src/shared/ui/analytics/HeatmapTracker.tsx`
- Endpoint: `src/app/api/analytics/heatmap/route.ts`

