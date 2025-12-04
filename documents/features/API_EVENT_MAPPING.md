Pemetaan API & Event terhadap Fitur — SBA-Agentic

FEAT-001 — Multi-tenant
- API: GET/POST/PUT/DELETE /tenants
- Events: tenant.created, tenant.updated, tenant.deleted

FEAT-002 — Agent Chat + Context + Tools
- API: POST /chat/sessions; POST /chat/messages; POST /tools/execute
- Events: chat.message.created; tools.executed; tools.failed

FEAT-003 — Workflow Builder
- API: POST /workflows; PUT /workflows/{id}; POST /workflows/{id}/deploy; POST /workflows/{id}/rollback
- Events: workflow.deployed; workflow.rolled_back; workflow.run.started; workflow.run.finished

FEAT-004 — API Orchestration
- API: POST /integrations/{provider}/invoke
- Events: integration.call.succeeded; integration.call.failed;

FEAT-005 — AuthN/Z
- API: POST /auth/login; GET /users/me; POST /roles/assign
- Events: auth.login; role.assigned; policy.changed

FEAT-006 — Observability
- API: GET /observability/metrics; GET /observability/logs
- Events: telemetry.logged; metric.threshold.exceeded

FEAT-007 — CI/CD
- API: POST /pipeline/run; GET /pipeline/status
- Events: pipeline.run.started; pipeline.run.failed; pipeline.run.succeeded

FEAT-008 — A11y & Security Headers
- Config: CSP, Trusted Types, Permissions-Policy
- Events: security.policy.violation (report-only)

FEAT-009 — Document Ingestion & Search
- API: POST /documents/ingest; GET /search?q=...
- Events: document.ingested; index.updated

FEAT-010 — Monitoring & Rollback
- API: GET /workflows/{id}/runs; POST /workflows/{id}/rollback
- Events: run.status.updated; rollback.completed

FEAT-011 — Error Model Konsisten
- API/Events: error.* skema seragam

FEAT-012 — Template Workflow
- API: GET /workflow-templates; POST /workflow-templates/instantiate
- Events: template.instantiated

FEAT-013 — Marketplace Integrasi
- API: GET /marketplace/integrations; POST /marketplace/install; DELETE /marketplace/uninstall
- Events: integration.installed; integration.uninstalled

