# Rencana Implementasi Fokus Pengembangan

## Tujuan Utama
- Standarisasi sumber metrik: App sebagai provider; Web konsumsi via SDK dengan header tenant otomatis, autentikasi terstandar, dan format data konsisten.
- Harmonisasi RBAC Guard: kontrol akses terpusat di Web tersinkron dengan model App; audit log untuk semua operasi kritis.
- UI konsisten Runs/Agents di Web dengan opsi deep-link ke App.
- KPI lintas platform: performa (latency p95/p99, error rate, throughput; Lighthouse ≥90) dan aksesibilitas (WCAG 2.1 AA) dengan pipeline otomatis.
- Roadmap kuartalan terukur.

## Observability SDK (Provider → Consumer)
- API SDK:
  - `getMetrics({ tenantId, format })` → string/JSON
  - `getHealth({ tenantId })` → JSON (status, quantiles)
- Header tenant otomatis: utility menyuntik `x-tenant-id` jika belum ada.
- Autentikasi terstandar: sesi/cookie dev (`__test_auth=admin`) atau token.
- Normalisasi data: `{ latencyP95Ms, latencyP99Ms, errorRatePercent, throughputRps }`.
- Integrasi Web: refactor `MetricsOverview` untuk memakai SDK; retry/caching ringan.

## Harmonisasi RBAC Guard (Web)
- Modul guard: `can(user, resource, action)` sinkron dengan policy App.
- Loader policy: tarik resource/action dari App; cache/refresh berkala.
- Audit log: catat operasi kritis (resource, action, outcome, actor, tenant/workspace) ke endpoint audit.

## UI Konsisten Runs/Agents (Web)
- Panel: daftar runs/agents, detail, aksi (start/stop/retry), status & metrik.
- Deep-link: tautan ke App untuk fitur lanjutan (event stream, history lengkap).
- Pola FSD/Atomic: Entities (Run/Agent), Features (RunActions/AgentActions), Widgets (RunsPanel/AgentsPanel).
- A11y: keyboard nav, ARIA, fokus states; skeleton & live region status.

## KPI Lintas Platform & Pipeline
- KPI: performa (p95/p99, error rate, throughput; Lighthouse ≥90), aksesibilitas (WCAG 2.1 AA), konsistensi fungsional.
- Pipeline: Playwright + Axe/Jest Axe untuk a11y; Lighthouse CI untuk performa; test kontrak & e2e untuk konsistensi.

## Roadmap Kuartalan
- Q1: Observability SDK
- Q2: Harmonisasi RBAC Guard
- Q3: UI Runs/Agents + deep-link
- Q4: Penguatan a11y & Lighthouse

## Lampiran
- Spesifikasi teknis: SDK & RBAC Guard
- Diagram arsitektur: provider↔consumer, RBAC sync, UI flows
- Matriks KPI lintas platform
- Timeline implementasi detail
