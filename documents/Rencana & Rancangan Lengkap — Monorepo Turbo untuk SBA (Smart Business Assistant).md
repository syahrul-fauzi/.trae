# Rencana & Rancangan Lengkap — **Monorepo Turbo** untuk SBA (Smart Business Assistant)

Dokumen ini adalah blueprint mendalam untuk membangun monorepo *production-grade* menggunakan **Turborepo** untuk SBA. Menggabungkan **FSD (Feature-Sliced Design)**, **DDD (Domain-Driven Design)**, dan **Atomic Design** untuk UI. Fokus: skalabilitas, maintainability, testability, dan kompatibilitas TypeScript/clean-code.

---

# 1. Tujuan & Prinsip Desain Singkat

* **Tujuan:** memberikan struktur monorepo yang jelas untuk tim cross-functional (frontend, backend, AI, infra, security) agar bisa deliver fitur SBA cepat dengan kualitas tinggi.
* **Prinsip:** interface-first, strong typing (TS strict), small packages, DI/abstraction, contract tests, observability sejak awal, design systems reuse.

---

# 2. Struktur Monorepo (direkomendasikan)

```
/ (root)
├─ apps/
│  ├─ web/                 # Next.js (AG-UI client) — uses FSD in src/
│  ├─ admin/               # admin/tenant management (Next.js)
│  ├─ api/                 # Agent Orchestrator (NestJS / Express)
│  ├─ worker/              # Workers: render, indexing, tasks (BullMQ)
│  └─ mock-basehub/        # dev mock for BaseHub (GraphQL)
│
├─ packages/
│  ├─ ui/                  # design-system (Atomic Design) + storybook
│  ├─ agui-client/         # AG-UI small wrappers & types
│  ├─ sdk/                 # generated OpenAPI + zod clients (tools)
│  ├─ features/            # shareable feature libs (FSD cross-app)
│  ├─ entities/            # DDD domain model libs (value objects, aggregates)
│  ├─ services/            # domain services + adapters (BaseHub, LLM)
│  ├─ tools/               # tool adapters for Orchestrator
│  ├─ db/                  # prisma schema, migrations, rls helpers
│  ├─ infra/               # terraform modules, helm charts
│  ├─ telemetry/           # otel init, metrics helpers
│  └─ utils/               # shared utils, logger, zod helpers
│
├─ docs/
├─ scripts/
├─ .github/
├─ turbo.json
├─ package.json
└─ pnpm-workspace.yaml
```

**Aturan:** `apps/*` boleh mengimport `packages/*` only. `packages/*` must be independent and small.

---

# 3. FSD (Feature-Sliced Design) di tingkat frontend (apps/web)

Di `apps/web/src` gunakan FSD foldering per app:

```
src/
├─ app/                # app-level routes + layout (Next.js App Router)
├─ pages/              # legacy pages if used
├─ processes/          # long business flows (onboarding, docgen)
├─ widgets/            # composite UI widgets used across features
├─ features/           # feature boundaries (chat, document, tasks)
│  ├─ feature-chat/
│  │  ├─ model/        # state, hooks
│  │  ├─ ui/           # presentational components
│  │  └─ api/          # feature-level API clients
├─ entities/           # domain entities (User, Tenant, Document)
└─ shared/             # shared libs (api, constants, types)
```

**Dependency rules (strict):**

* `app` → `processes` → `widgets` → `features` → `entities` → `shared`
* No upward imports (enforced via ESLint module boundaries / import-lint)
* `features/*` can import only `entities/*` and `shared/*`, not other features.

---

# 4. DDD (Domain-Driven Design) — pemodelan & bounded contexts

## 4.1 Bounded contexts (contoh untuk SBA)

* **Knowledge Context** — content, templates (BaseHub)
* **Conversation Context** — sessions, messages, agent reasoning
* **Document Context** — template rendering, artifact storage
* **Workflow/Task Context** — task lifecycle, approvals, external sync
* **Tenant & Billing Context** — provisioning, plan, quotas

Taruh domain model tiap context di `packages/entities/{context}` dan domain services di `packages/services/{context}`.

## 4.2 Aggregate Root & Value Objects (contoh)

* **Aggregate**: `Conversation` (root) — contains `Turns`, `ToolCalls` (entities).

  * Methods: `startTurn`, `appendToolResult`, `finalize`.
* **Value Objects**: `TenantId`, `UserId`, `DocumentId`, `Money`, `Locale`.
* **Repository interface**: `IConversationRepository` in `entities`, implemented in `packages/db`.

**Pattern:** repositories expose transaction boundaries; use Unit of Work in services.

## 4.3 Hybrid FSD-DDD

* For complex features (Document Generation), keep UI structure via FSD but implement core business logic & invariants as DDD aggregates in `packages/entities/document` and `packages/services/document`.

---

# 5. Atomic Design for UI (packages/ui)

```
packages/ui/
├─ tokens/             # design tokens (colors, spacing, typography)
├─ atoms/              # Buttons, Inputs, Icons, Text
├─ molecules/          # InputGroup, ModalHeader
├─ organisms/          # ChatWindow, DocumentEditor
├─ templates/          # Layouts using organisms
└─ pages/              # example pages assembling templates
```

* **Design tokens** exported as JS/JSON/CSS vars + Tailwind theme.
* **Accessibility:** components must follow WCAG; keyboard nav, ARIA, contrast, focus states.
* **Theming:** CSS variables + Tailwind + theme provider; allow tenant theming.

---

# 6. Implementasi Teknis — Toolchain & config

## 6.1 Build system

* Root: **Turborepo** for orchestrating tasks (`dev`, `build`, `test`).
* Frontend: **Next.js 14+** (App router) + optional Vite for packages that need dev server.
* Backend: **NestJS** (recommended) or Express with TypeScript.

**turbo.json (example):**

```json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
    "dev": { "cache": false },
    "lint": {},
    "test": {}
  }
}
```

## 6.2 Testing framework

* **Unit tests**: Jest + ts-jest, run per package.
* **Integration tests**: Playwright for API & frontend flows, contract tests via Pact or simple OpenAPI-based validations.
* **E2E tests**: Playwright/Cypress for critical flows (chat → tool call → render).
* **Performance**: k6 scripts for load testing LLM usage & orchestrator throughput.

## 6.3 Linting & Formatting

* ESLint with monorepo rules; `eslint-plugin-boundaries` or custom plugin to enforce FSD import rules.
* Prettier for formatting; husky pre-commit hooks.
* Commitlint for conventional commits.

## 6.4 CI/CD pipeline

* **CI (PR):** install, lint, test (unit + contract), build packages, generate preview artifacts.
* **Preview deployment:** ephemeral env per PR (Vercel for frontend; ephemeral k8s namespace for backend).
* **CD:** main → staging auto; manual promote to production. Use Canary/Blue-Green for orchestrator.

## 6.5 Shared dependencies configuration

* **State management:** prefer React Query / TanStack Query for server state; Recoil/Zustand for local UI state (keep minimal). Put shared hooks in `packages/features/state` or `packages/shared/state`.
* **API clients:** generated from OpenAPI in `packages/sdk`; shared `apiClient` wrapper with auth token injection.
* **Utilities:** `packages/utils` for logger, retry, idempotency, circuit-breaker.

---

# 7. Conventions, coding guidelines & enforcement

* **TypeScript:** `tsconfig` strict = true. No `any`. Prefer `unknown` + validation.
* **Zod-first:** define schema with zod for all external boundaries (API, tool params).
* **DI:** use a DI container (NestJS DI or tsyringe) in backend; keep constructors small.
* **Small functions:** single responsibility; prefer pure functions.
* **Tests:** TDD encouraged for domain logic.

Enforce via CI: lint, typecheck, test coverage thresholds (e.g. 80% for packages).

---

# 8. UI/UX Excellence

## 8.1 Accessibility & Responsiveness

* All components: keyboard reachable, ARIA labels, semantic markup.
* Mobile-first responsive design; grid & layout tokens.
* Automated axe checks in CI for critical pages.

## 8.2 Design Tokens & Theming

* tokens: `{ color, spacing, radius, fontSize, zIndex }` exported as:

  * CSS variables (`:root`), Tailwind config, JS object.
* Theming engine: CSS variables + ThemeProvider to switch tenant theme at runtime.

## 8.3 UX Patterns

* Stream-first chat UI: progressive rendering of tokens; show skeletons for pending tool calls.
* Human-in-loop flows: clear interrupts, confirm modals for side effects (createTask, commit).
* Undo & history: allow undo for destructive operations within short TTL.

---

# 9. Documentation — what to include & where

Put docs under `/docs` and per-package README.

**Core docs:**

* ADRs (Architecture Decision Records)
* System architecture diagrams (Mermaid + exported PNG)
* FSD rules & import policy
* DDD model docs (entities, aggregates, repositories)
* Onboarding guide (dev & infra)
* API docs (OpenAPI served by `packages/sdk`)
* Design system docs (Storybook)

**Automation:** generate SDK and docs in CI and publish to internal npm or docs site.

---

# 10. Quality Assurance & Observability

## 10.1 Testing matrix

* **Unit tests:** per package (Jest)
* **Integration:** API + DB (Postgres test containers)
* **Contract tests:** tools ↔ orchestrator (OpenAPI/pact)
* **E2E:** Playwright user journeys
* **Perf:** k6 scripts — LLM throughput and tool call latency
* **Security:** SAST, DAST, dependency scanning, RLS tests

## 10.2 Code review process

* PR templates enforce checklist: tests, types, docs, ADR reference.
* Mandatory 1-2 reviewers; CI must pass; `skipped` tests disallowed.

## 10.3 Monitoring & alerts

* **Tracing**: OpenTelemetry with distributed traces (frontend→orchestrator→tools→LLM).
* **Metrics**: Prometheus metrics: session_count, tool_calls_total{tool}, llm_tokens, errors.
* **Logging**: structured JSON logs with tenantId/sessionId; centralize in Loki/ELK.
* **Alerts**: error rate, tool latency p95, unusual token usage, RLS failures.

---

# 11. Roadmap Pengembangan (fase + acceptance criteria)

## Phase A — Foundation (2 weeks)

* Deliverables: monorepo scaffold, turbo config, packages skeleton, CI basic.
* Acceptance: `pnpm install && pnpm dev` boots local stack; CI runs lint + tests.

## Phase B — Core MVP (6–8 weeks)

* Deliverables: Agent Orchestrator skeleton + streaming WS, AG-UI chat UI, KnowledgeTool (BaseHub read), DB + RLS POC.
* Acceptance: E2E demo: user asks -> agent calls BaseHub -> streams answer; tests & tracing present.

## Phase C — Documenting & Workflow (6 weeks)

* Deliverables: render worker, document templates, task service, audit logs.
* Acceptance: generate PDF from template + stored artifact; createTask integrated with mock ext system.

## Phase D — Multi-Tenant Harden (6–8 weeks)

* Deliverables: full RLS enforcement, tenant provisioning UI, billing (Stripe) wiring, quotas.
* Acceptance: provision tenant + seed KB + enforce quotas; security checks passed.

## Phase E — Scale & Enterprise features (ongoing)

* Deliverables: Vector DB & RAG, per-tenant model tuning, SSO (SAML), connectors marketplace.
* Acceptance: enterprise tenant onboarded with dedicated workspace, SLO met.

**Metrics per phase:** latency, error rate, self-serve rate, MRR (later).

---

# 12. Contoh konfigurasi & snippet penting

## 12.1 Example `turbo.json`

(see earlier — include caching & outputs)

## 12.2 ESLint rule for boundary (example)

Use `eslint-plugin-boundaries` to enforce imports:

```json
"rules": {
  "boundaries/element-types": ["error", {
    "default": "disallow",
    "rules": [
      { "from": "apps/web", "allow": ["packages/*", "apps/web"] }
    ]
  }]
}
```

## 12.3 Zod schema example for tool params

(see earlier patterns — ensure all tool inputs validated).

---

# 13. Operational considerations & risks

**Risks:**

* Complexity from multi-tenant + agentic flows → mitigate via incremental delivery & strong contracts.
* LLM cost runaway → per-tenant budgets + throttling + caching.
* Data leakage → Postgres RLS + per-tenant token scoping + tests.

**Mitigations:**

* Contract tests, RLS enforcement, token billing visibility, observability & alerts.

