## Tujuan
- Menyelesaikan pengembangan sba-agentic secara end-to-end dengan standar kualitas tinggi, tanpa konfirmasi tambahan.
- Menghasilkan spesifikasi teknis, implementasi modular, pengujian menyeluruh, observability, keamanan, dan dokumentasi lengkap.

## Lingkup & Deliverables
- Dokumen spesifikasi teknis (arsitektur, alur kerja, fitur, persyaratan).
- Implementasi fitur inti dengan modul prioritas dan integrasi bertahap.
- Unit tests, E2E stabil (≥95% pass rate di Chromium/Firefox/WebKit), dan laporan kualitas.
- Observability: Prometheus/Grafana, OpenTelemetry, p95/p99 latency, throughput, error rate.
- Keamanan: standar auth (JWT/HMAC/timestamp), RBAC, audit logging, config validation.
- Otomatisasi CI/CD, progress reporting, dan dokumentasi teknis terpadu.

## Arsitektur Sistem
- Frontend: `apps/web` (Next.js 14, Tailwind, Playwright, Vitest), `apps/app` (Next.js 15).
- Backend/API: `apps/api` (NestJS, Prisma, BullMQ, Socket.IO) terintegrasi dengan `packages/*` (auth/security/services).
- Data/Platform: Supabase/PostgreSQL, Redis (queue/caching), objek storage (opsional).
- Observability: `ops/prometheus`, `ops/grafana`, OpenTelemetry, Datadog (opsional).
- Monorepo: Turborepo + pnpm workspaces; paket domain di `packages/*`.

## Diagram Alur Kerja (akan dihasilkan dengan Mermaid)
- Login & Auth: Client → `/api/auth` → verifikasi JWT/HMAC/timestamp → RBAC → session/cookie → navigasi → audit log.
- Health & Metrics: Client/CI → `/api/health` & `/api/health/metrics` → Prometheus scrape → Grafana dashboards.
- Agentic Flow: UI (AGUI) → Orchestrator → Services (SDK/Integrations) → Events/Telemetry → Feedback loop.

## Fitur Utama
- Auth & RBAC: login, session management, route guard, audit trail.
- Agentic Copilot: chat, insight filters, task orchestration, eventing.
- Observability: metrics/traces/logs, dashboards, alerts.
- A11y & UX: aksesibilitas teruji, not-found, error pages, konsistensi UI.
- DevOps: health checks, config validation, CI gates (coverage, bundlesize, lighthouse).

## Persyaratan Teknis
- TypeScript strict, React 18/Next.js App Router, Tailwind.
- Standar keamanan: JWT HS256, HMAC header, timestamp skew, RBAC.
- Pengukuran: Server-Timing, Prometheus histograms/counters.
- Testing: Vitest + Playwright, repeat-run stabilitas, artifacts (screenshot/trace/video).
- CI: GitHub Actions terstruktur, pnpm cache, turbo pipelines, reports.

## Rencana Pengembangan Bertahap (berbasis modul)
- Core Auth & RBAC:
  - Standarisasi endpoint `/api/auth/*`, validasi JWT/HMAC/timestamp, audit logging.
  - Guard layouts dan middleware normalisasi path; demo cookie hanya dev/test.
- Health & Observability:
  - `jsonError`, dev bypass, Server-Timing, Prometheus metrics; scrape & dashboards.
- Agentic Features:
  - Stabilisasi AGUI Chat/Insight; normalisasi imports UI; typing eksplisit handlers.
- Web UX & A11y:
  - LoginForm migrasi final, not-found/error UX, a11y test `ai-copilot-a11y.spec.ts`.
- Testing & Stabilitas:
  - Playwright timeouts/retries, robust selectors, repeat-run ≥95%; unit tests Vitest paket inti.
- Security & Config:
  - `.env.example` lengkap; config-check CI; semgrep/OWASP ZAP gating.
- Docs & Automation:
  - Spesifikasi teknis, arsitektur, API, env, panduan eksekusi; scripts reporting.

## Pengujian & Kualitas
- Unit: komponen UI, util, services dengan coverage target ≥80%.
- E2E: skenario login (sukses/invalid/validasi/kode HTTP), a11y, health; artifacts terunggah.
- Performa: lighthouse web vitals gate, bundlesize batasan.
- Laporan: summary JSON, coverage, grafik pass-rate, flake analisis.

## Observability & Monitoring
- Prometheus scrape `apps/web/apps/api` metrics; Grafana dashboards (latency p95/p99, RPS, 5xx).
- OpenTelemetry traces dari API; korelasi request-id.
- Alerts: threshold error rate dan SLA (konfigurasi di `ops/grafana`/`monitoring`).

## Keamanan & Kepatuhan
- Header HMAC + timestamp window; JWT HS256 dengan secret terkelola.
- RBAC di route sensitive; audit events (user, action, resource, result).
- Semgrep rules, ZAP baseline scan; dependencies audit.

## Otomatisasi & Pengelolaan Versi
- CI workflows: typecheck/build/test/e2e/observability/security.
- Turbo pipelines untuk cache & orkestrasi build.
- Scripts: repeat E2E, reports, diagrams.

## Dokumentasi
- Spesifikasi teknis: arsitektur, alur, fitur, persyaratan.
- API reference, env config, panduan deployment/monitoring.
- Testing playbook (unit/E2E), troubleshooting, SLA.

## Verifikasi & Kriteria Penerimaan
- E2E login pass-rate ≥95% di 3 browser, 5 kali berturut-turut.
- `/api/health` 200 di dev, validasi ketat di prod; metrics tersedia & ter-scrape.
- Grafana menunjukkan p95/p99, error rate < SLA; alerts aktif.
- Coverage unit ≥80%, lint & typecheck bersih; security gates lulus.
- Dokumentasi lengkap & dapat diikuti.

## Risiko & Mitigasi
- Flakiness cross-browser → tingkatkan timeouts, assert berbasis state, repeat-run.
- Secrets misconfig → config-check CI, .env.example, fail-fast.
- Observability deps hilang → tambahkan `prom-client`/logger sesuai modul, fallback dev bypass.

## Urutan Implementasi (logis, tanpa jadwal)
1) Buat dokumen spesifikasi teknis dan struktur docs.
2) Finalisasi Auth & RBAC + health/metrics standar.
3) Stabilkan E2E login + a11y; aktifkan repeat-run dan artifacts.
4) Deploy Prometheus/Grafana lokal; buat dashboards & screenshot.
5) Amankan konfigurasi dan tambahkan CI gates.
6) Lengkapi dokumentasi dan laporan hasil.
