# Sumber Data Observability

## Endpoints
- `GET /api/metrics/prometheus` — teks metrik (p95/p99, error rate, throughput)
  - Sumber: `/home/inbox/smart-ai/sba-agentic/apps/app/src/app/api/metrics/prometheus/route.ts:46–55`
- `GET /api/metrics` — ringkasan text/JSON
  - Sumber: `/home/inbox/smart-ai/sba-agentic/docs/README.md:41,46–49`
- `GET /api/health` — readiness/liveness + quantiles
  - Sumber: `/home/inbox/smart-ai/sba-agentic/docs/README.md:50–55`

## Contoh Konsumsi
- Dev (cookie test RBAC):
  - `curl -H "Cookie: __test_auth=admin" "$NEXT_PUBLIC_APP_URL/api/metrics/prometheus"`
  - `curl -H "Cookie: __test_auth=admin" "$NEXT_PUBLIC_APP_URL/api/metrics"`
- Web Dashboard (client):
  - Fetch: `/home/inbox/smart-ai/sba-agentic/apps/web/src/features/dashboard/components/MetricsOverview.tsx:80–116`

## Label Tenant
- Wajib melalui `ensureTenantHeader` di App sebelum pembungkusan `withMetrics`.
  - Sumber: `/home/inbox/smart-ai/sba-agentic/apps/app/src/app/api/metrics/prometheus/route.ts:56–58`
