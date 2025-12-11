## Scope
- Run and verify all apps in `apps/*`: `@sba/web`, `@sba/app`, `docs`, `@sba/marketing`, `@sba/api`, `@sba/orchestrator`.
- Ensure ports are unique, features work, health checks pass, and produce a consolidated report.

## Environment Preparation
- Confirm Node ≥ 18 and pnpm workspace availability.
- Ensure unique ports:
  - Web: 3000
  - App: 3001
  - Docs: 3004
  - Marketing: 3005
  - API/Orchestrator: default as configured
- Set `NEXT_PUBLIC_APP_URL` for `@sba/app` workflows.

## Start & Status Checks
- Start servers sequentially (non-conflicting ports) and wait for “Ready”.
- Verify base endpoints with curl:
  - `GET /` → 200
  - `GET /dashboard` → 200 (where applicable)
  - `GET /API` or service health endpoint → 200 (or valid JSON)
- Record status and startup times.

## Feature Verification Per App
- Web: render key pages, telemetry `POST /api/telemetry` returns 200.
- App:
  - `/api/health` JSON readiness (status, uptime, environment, quantiles)
  - `/api-docs` loads Swagger UI; `/api/openapi.json` returns OpenAPI 3.0.
- Docs: landing and a sample doc page load.
- Marketing: landing `/` returns 200 and main sections render.
- API: basic route/health (if available) responds; Orchestrator: minimal smoke verification of core endpoints/log messages.

## E2E & A11y Tests
- Run smoke E2E for `@sba/app` and `@sba/web` across Chromium/WebKit/Firefox.
- Axe-core audits on key pages; store artifacts; enforce 0 critical violations.
- Stabilize selectors/landmarks (use `data-testid`, avoid `sr-only` duplicates) where needed.

## Performance Baselines
- Collect Lighthouse for Web/App landing pages (local environment).
- Record TTI/LCP/CLS and simple API latency samples.

## Error Triage & Fixes
- Port conflicts: ensure marketing uses 3005; add alt scripts for web if 3000 busy.
- UI runtime errors (React import/JSX): add default import or configure JSX auto where missing.
- Build warnings (types/exports): standardize `exports` order and `typesVersions` for shared packages.
- Observability: avoid `import.meta` in CJS; use `process.env` for test checks.

## Cross‑Platform Considerations
- Validate on Linux; document macOS/Windows notes (ports, environment variables, pnpm quirks).

## Consolidated Reporting
- Produce a report with:
  - Apps tested & ports
  - Issues found → fixes applied
  - E2E/a11y results + artifacts locations
  - Performance baselines
  - Final health status per app

## Documentation Updates
- Update `apps-runbook.md` with start/stop procedures, verification steps, common issues & troubleshooting, contacts.
- Provide quick-start commands for QA.

## Acceptance Criteria
- All apps start on unique ports; base endpoints return 200.
- Critical features verified (telemetry, health, API Docs).
- 0 critical a11y violations; performance baselines captured.
- Final report delivered with artifacts and runbook updated.

## After Approval
- Implement any missing scripts (e.g., alternate web dev port), add CI health-check step, and run full E2E/a11y/perf suite to produce final artifacts and the consolidated report.