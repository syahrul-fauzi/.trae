# Rekomendasi Strategis & Roadmap Penyelarasan

## Rekomendasi
- Standarisasi sumber metrik observability: `apps/app` sebagai provider; `apps/web` konsumsi via SDK dengan penyuntikan `x-tenant-id` otomatis.
- Harmonisasi guard RBAC di `apps/web` untuk operasi sensitif, adopsi pola `withRBAC`.
- Konsolidasi UI kontrol runs/agents: bangun panel operasional di `apps/web` atau tautkan ke halaman `apps/app` melalui deep-link.
- Target KPI lintas platform (p95 ≤ 500ms, error rate ≤ 0.5%) dan pipeline a11y/performa seragam.

## Roadmap Kuartalan
- Q1
  - SDK Observability untuk web: wrapper fetch metrics/health, header tenant otomatis.
  - Audit RBAC konsumsi: mapping resource/action dan fallback dev cookie.
  - Diagram arsitektur konsolidasi observability (component/dataflow) dan publikasi ke `docs/`.
- Q2
  - Panel kontrol runs/agents di `apps/web` minimal: start/stop, status, metrik run.
  - Integrasi Meta Events lintas platform dan agregasi feedback.
  - Benchmark LCP/INP, optimasi panel dashboard metrik.
- Q3
  - Generative UI lintas platform untuk task umum; unify UX approvals (interrupt/resume).
  - Penguatan keamanan: CSP trusted-types, rate limit strategi adaptif.
- Q4
  - Go-live penuh harmonisasi kontrol eksekusi; postmortem dan continuous improvement.

## Referensi
- Observability App: `/home/inbox/smart-ai/sba-agentic/apps/app/src/app/api/metrics/prometheus/route.ts:46–50,56–62`
- Konsumsi Web: `/home/inbox/smart-ai/sba-agentic/apps/web/src/features/dashboard/components/MetricsOverview.tsx:80–116`
