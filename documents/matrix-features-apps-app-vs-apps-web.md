# Matriks Perbandingan Fitur: apps/app vs apps/web

Skala penilaian 1–5 (1 = rendah, 5 = tinggi)

| Fitur                         | apps/app Prioritas | apps/app Kematangan | apps/web Prioritas | apps/web Kematangan | Konsistensi | Risiko |
|------------------------------|--------------------|---------------------|--------------------|---------------------|-------------|--------|
| RBAC                         | 5                  | 4                   | 3                  | 3                   | 4           | 2      |
| Rate Limiting (Upstash)      | 5                  | 4                   | 2                  | 2                   | 3           | 3      |
| Tenant Header                | 5                  | 5                   | 3                  | 3                   | 4           | 2      |
| Metrics Registry / Prom      | 5                  | 4                   | 4 (konsumsi)       | 4                   | 5           | 2      |
| Agents/Runs API              | 5                  | 4                   | 3 (UI konsumsi)    | 3                   | 3           | 3      |
| Observability UI             | 4                  | 3                   | 4                  | 4                   | 4           | 2      |
| Knowledge Hub/API            | 4                  | 3                   | 4                  | 4                   | 4           | 3      |
| Workflows Builder            | 3                  | 2                   | 5                  | 4                   | 3           | 3      |
| Chat Agentic Runtime         | 3                  | 2                   | 5                  | 4                   | 3           | 3      |
| Telemetry/CSP Report         | 4                  | 3                   | 4                  | 4                   | 4           | 2      |
| Aksesibilitas (WCAG baseline)| 4                  | 3                   | 4                  | 4                   | 4           | 2      |

Catatan:
- Konsistensi mengukur keselarasan fungsional dan antarmuka antar platform.
- Risiko mempertimbangkan ketergantungan eksternal (Supabase, RBAC, CSP) dan potensi flakiness.
