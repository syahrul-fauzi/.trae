# Rencana Implementasi Terperinci — RBAC Guard, Performa Runs/Agents, Pipeline Kualitas, Monitoring & Alerting

## 1. RBAC Guard
- Rute target:
  - `/csp-report` → hanya sistem monitoring (analytics:read)
  - `/agui/chat` → role-based user/admin (agent:run)
  - `/health/metrics` → terbatas DevOps (analytics:read)
- Implementasi:
  - Guard: `packages/security/src/rbac.ts` → `withRBAC(handler, { resource, action })`
  - Audit: `packages/security/src/audit.ts` → schema ketat (`ts, userId, resource, action, endpoint, status, tenant`), `validateAuditEntry`, `writeAudit`, webhook opsional (`ENABLE_AUDIT_WEBHOOK`, retry)
  - Tenant: injeksi `x-tenant-id` pada API sebelum RBAC
- Acceptance Criteria:
  - 100% rute target dilindungi RBAC; audit allow/deny tercatat; fallback aman untuk guest.
  - E2E cookie `__test_auth=admin` berfungsi di dev; tidak bocor ke bundle klien.
- Referensi:
  - `packages/security/src/rbac.ts`, `packages/security/src/audit.ts`
  - `apps/app/src/shared/config/rbac.ts`, `apps/app/src/app/api/runs/*`

## 2. Performa Runs/Agents
- Validasi waktu:
  - Format `YYYY-MM-DD`, `from ≤ to`, maksimum 30 hari, ISO 8601 timezone-aware.
- Windowing & lazy-load:
  - Virtualized list dengan batch 50 item; fixed item height; cleanup on unmount.
- State & fetching:
  - Context global (`RunsFilterContext`), React Query `placeholderData`.
- Acceptance Criteria:
  - 60fps selama scrolling pada dataset >10,000; bundle <150KB untuk panel.
  - p95 GET `/api/runs` ≤ 200ms (staging), p99 ≤ 500ms; rate limit POST sesuai.
- Referensi:
  - `apps/web/src/features/runs/state/RunsFilterContext.tsx`, `apps/web/src/features/runs/components/RunsPanel.tsx`
  - `apps/app/src/app/api/runs/*`, `apps/app/src/app/api/agent/*`

## 3. Pipeline Kualitas
- Testing:
  - Contract tests: `/runs/list`, `/runs/detail`, `/runs/status` (pagination, filtering, sorting, schema strict, state transitions)
  - Snapshot UI: komponen kritis (Dashboard, Runs/Agents)
- Tools:
  - Lighthouse CI (Performance/Accessibility ≥ 90), Axe a11y compliance, compliance report otomatis.
- Gates:
  - Blok deploy pada regression (skor < threshold, a11y critical), approval manual untuk isu kritis.
- Referensi:
  - `.github/workflows/*`, `docs/type-check-playbook.md`, `docs/type-check-dashboard.md`

## 4. Monitoring & Alerting
- Audit checks harian:
  - Integritas audit log; konsistensi permission snapshot.
- Alerts:
  - Error rate >1%, p95 >2x baseline ≥5m, RBAC_DENIED spike >3x baseline per tenant.
- Dashboards:
  - Grafana: tren API, latensi, error breakdown; SSE/WS koneksi.
- Referensi:
  - `monitoring/prometheus.yml`, `ops/grafana/sba-dashboard.json`, `monitoring/alertmanager.yml`

## Persyaratan & Dokumentasi
- Backward compatibility, security best practices, unit/integration tests lengkap.
- Dokumentasi lengkap:
  - Flow permission system, performance optimization guide, quality control procedures.

## Roadmap Lanjutan
1. Proteksi rute sensitif + audit logging
2. Virtualized list untuk large datasets
3. Validasi range waktu (timezone handling)
4. Integrasi penuh Lighthouse/Axe/contract gates di CI/CD
5. Peningkatan coverage monitoring (95% endpoints)
