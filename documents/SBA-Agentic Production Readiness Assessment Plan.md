## Scope
- Produce executive-level report, risk heatmap, Go/No-Go decision, pre-launch checklist, and 30/60/90 monitoring plan.
- Validate claims with repository evidence and staging observations where possible.

## Evidence Collection
- Architecture: Confirm component interactions and data/queue flows from `docs/architecture/diagram.mmd`.
- CI/CD: Review `.github/workflows/*`, `Jenkinsfile`, `sonar-project.properties`, `docker-compose.yml`.
- Security/Observability: Verify policies in `docs/technical/security.md`, runbooks and dashboards in `ops/*`, `OBSERVABILITY_RUNBOOK.md`.
- Business/Traceability: Consolidate `docs/TRACEABILITY_MATRIX.md`, `docs/use-cases/*`, `README.md`, `docs/README.md`, `workspace/_xref.md`.

## Technical Validation (Non-invasive)
- Static analysis plan: ESLint/type-check dry-run paths; Sonar config review.
- Test coverage plan: Gather CI coverage outputs and thresholds; identify critical gaps.
- Performance plan: Define k6 scenarios (CRUD, streaming, queue), target metrics (p50/p95/p99, error rate), and saturations to measure.
- Integration plan: Enumerate API endpoints from traceability; design Newman/Pact suites; verify idempotency and retry per ADRs.
- Security plan: Integrate Semgrep/Snyk and ZAP baseline into CI; secrets hygiene with `ci:guard`.

## Production Readiness & Operations
- Deployment: Validate canary and rollback steps against `docs/deployment/GO_LIVE_CHECKLIST.md`.
- SLAs/SLOs: Map performance targets to alerts; confirm dashboards and thresholds.
- DR: Define backup/restore validation, RTO/RPO targets, and failover exercises.

## Deliverables
- PDF report with executive summary, quantitative metrics, qualitative assessments, prioritized recommendations, and cost-benefit analysis.
- Risk matrix with heatmap.
- Go/No-Go decision with gating evidence.
- Pre-launch checklist with owner assignments.
- 30/60/90 monitoring plan.

## Immediate Actions After Approval
- Reconcile declared app/package paths with on-disk contents; update findings.
- Collect CI artifacts (coverage, E2E, Lighthouse) and generate consolidated reporting via `tools/reporting/generate-report.ts`.
- Produce risk heatmap and finalize Go/No-Go gates.
- Format and export the comprehensive PDF and companion artifacts.

## Success Criteria
- Documented evidence for each assessment area; clear Go/No-Go with risk mitigations.
- Actionable checklist and monitoring plan aligned to SLAs/SLOs and governance.
