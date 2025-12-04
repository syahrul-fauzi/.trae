# PLAN & RANCANGAN Monorepo — SBA (Smart Business Assistant)

Dokumen ringkas tapi komprehensif ini menggabungkan **Project Plan** dan **Rancangan Monorepo** untuk SBA — tujuan: memberi tim engineering artefak siap pakai (struktur, pola, tooling, CI/CD, deployment, best practices) agar development cepat, terukur, dan sesuai prinsip clean-code / TypeScript-first.

---

# 1 — Ringkasan Rencana Proyek (High Level)

**Visi:** Bangun Smart Business Assistant (SBA) — platform SaaS multi-tenant yang menggabungkan AG-UI (agentic UI) + BaseHub (headless CMS), memberikan conversational agents, document generation, dan workflow automation.

**Tujuan 90 hari (MVP):**

1. Monorepo skeleton & CI infra.
2. BaseHub sandbox + seed content (20 FAQ, 10 SOP, 3 templates).
3. Agent Orchestrator minimal (Node/Nest) + KnowledgeTool (read BaseHub).
4. Next.js AG-UI client with streaming chat.
5. Observability minimal (traces, logs) + Postgres/Redis local stack.

**Tim contoh:** 1 PO, 1 Tech Lead, 2 Backend, 2 Frontend, 1 DevOps, 1 QA.

**Deliverables MVP:** deployed staging E2E: user asks → agent calls BaseHub → streams answer.

---

# 2 — Prinsip Desain Monorepo

* **Apps vs Packages**: `apps/*` untuk runtimes; `packages/*` untuk shared libs.
* **Types first**: Zod schemas + TypeScript `strict`.
* **Interface-driven**: dependency inversion (adapters, DI).
* **Small, single-responsibility packages**.
* **CI/CD preview per PR**; infra as code; secrets di Vault.
* **RLS** (Row Level Security) untuk isolasi tenant di DB.

---

# 3 — Struktur Monorepo (direkomendasikan)

```
/ (repo root)
├─ apps/
│  ├─ web/                    # Next.js (AG-UI client)
│  ├─ admin/                  # Admin dashboard (tenant mgmt)
│  ├─ api/                    # Agent Orchestrator (NestJS)
│  ├─ worker/                 # Workers (render, indexing, tasks)
│  └─ mock-basehub/           # Optional local mock for BaseHub
│
├─ packages/
│  ├─ ui/                     # Design system (shadcn + storybook)
│  ├─ agui-client/            # AG-UI helpers & event types
│  ├─ sdk/                    # Generated OpenAPI + zod SDK
│  ├─ tools/                  # Tool adapters (basehub, render, task, vector)
│  ├─ db/                     # Prisma schema + migrations + RLS wrapper
│  ├─ auth/                   # Auth middleware + token helpers
│  ├─ telemetry/              # OpenTelemetry + metrics helpers
│  ├─ infra/                  # Terraform modules + helm charts
│  ├─ devops/                 # CI scripts, docker helpers
│  └─ utils/                  # logger, retry, zod-helpers
│
├─ docs/                      # diagrams, runbooks, design docs
├─ scripts/                   # helper scripts (seed, provision)
├─ .github/                   # CI workflows
├─ terraform/                 # environment terraform
├─ turbo.json
├─ package.json
└─ pnpm-workspace.yaml
```

---

# 4 — Penjelasan tiap paket & apps (tanggung jawab)

**apps/web**

* Next.js + AG-UI client.
* Komponen: Chat UI, WorkspaceSwitcher, Document viewer, Tenant onboarding UI.
* Storybook untuk komponen UI.

**apps/api**

* Agent Orchestrator: session mgmt, tool registry, streaming endpoints, LLM adapter.
* Subfolders: `controllers/`, `services/`, `tools/`, `workers/`, `telemetry/`.

**apps/worker**

* Queue consumers (BullMQ) untuk render jobs, indexing, cache refresh.

**packages/ui**

* Shared UI primitives, tokens, tailwind config, storybook stories.

**packages/agui-client**

* AG-UI session wrappers, event serializers, shared-state helpers, type-safe tool call utilities.

**packages/sdk**

* Auto gen from OpenAPI + zod — strongly typed clients used by frontend & backend.

**packages/tools**

* `basehub-adapter`, `render-adapter`, `task-adapter`, `vector-adapter`.
* Each adapter implements `IToolAdapter` interface.

**packages/db**

* Prisma schema, migrations, DB connection wrapper that sets `app.current_tenant` (for RLS).

**packages/auth**

* JWT middleware, tenant extraction, role enforcement, SSO helpers.

**packages/telemetry**

* Init OTel tracing, metrics exposer, middleware to attach `tenantId` to traces.

**packages/infra**

* Reusable terraform modules (rds, redis, s3, k8s) and helm charts.

**packages/devops**

* `docker/` snippets, `turbo prune` docker configs, deployment helpers.

**packages/utils**

* `logger`, `retry`, `idempotency`, `zod` helpers, formatters.

---

# 5 — File & Config contoh (root)

**package.json (root)**

```json
{
  "name": "sba-monorepo",
  "private": true,
  "workspaces": ["apps/*","packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test",
    "lint": "turbo run lint",
    "bootstrap": "pnpm install && pnpm -w build"
  }
}
```

**turbo.json (core pipelines)**

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

**tsconfig.base.json (root)**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@sba/*": ["packages/*/src"]
    }
  }
}
```

---

# 6 — Development flows & commands

* `pnpm install`
* `pnpm turbo run dev` — start dev servers in parallel
* `pnpm --filter apps/web dev` — start web only
* `pnpm --filter apps/api dev` — start orchestrator only
* `pnpm --filter packages/sdk gen` — generate SDK from OpenAPI

Local stack (docker-compose): Postgres, Redis, MinIO (S3), mock-basehub.

---

# 7 — CI/CD & Preview Environments

**Workflows (.github/workflows)**:

* `ci.yml` (on PR): install, lint, test, build, generate preview artifacts.
* `preview-deploy.yml`: create ephemeral staging (k8s namespace) and deploy apps for PR.
* `release.yml` (on merge): build docker images, push, terraform plan/app for infra changes.

**Deployment pattern**:

* Frontend: Vercel (preview & prod) or CDN + SSR on edge functions.
* Backend: containerized in K8s; use HPA; canary or blue-green deploy for orchestrator.
* Workers: separate k8s deployment with concurrency tuning.

---

# 8 — Database, Multi-Tenant & RLS Wiring

**DB:** Postgres managed (RDS/GCP Cloud SQL) with `tenant_id` column on tenant-scoped tables.

**RLS pattern (brief):**

* Create `set_tenant(tenant_uuid)` function that sets `app.current_tenant`.
* Per-request, application sets tenant at connection start: `SELECT set_tenant('...')`.
* Policy for `conversations`, `tool_calls`, etc:

```sql
CREATE POLICY tenant_isolation ON conversations
  USING (tenant_id = current_setting('app.current_tenant')::uuid);
```

**Connection pooler:** use PgBouncer with per-tenant session setting wrapper or implement middleware that sets tenant per transaction.

---

# 9 — Tool Contracts & Validation (Zod + OpenAPI)

* Define tool interfaces (KnowledgeTool, RenderTool, TaskTool) in `packages/sdk/contracts`.
* Use OpenAPI YAML + generate zod schemas → TS SDK.
* Validate all incoming tool params with Zod at edge (API controllers) to prevent malformed calls and to enable deterministic agent behavior.

**Example Zod (KnowledgeTool):**

```ts
export const KnowledgeToolParams = z.object({
  tenantId: z.string().uuid(),
  query: z.string().min(1),
  options: z.object({ topK: z.number().int().positive().optional() }).optional()
});
```

---

# 10 — Observability & Telemetry

* **Tracing:** OpenTelemetry (frontend & backend) with `tenantId`, `sessionId`, `requestId`.
* **Metrics (Prometheus):** `agent_sessions_active`, `tool_calls_total{tool}`, `llm_tokens_used`.
* **Logs:** structured JSON to Loki/ELK with `tenantId` tag.
* **Errors:** Sentry with sampling & tenant context.
* **Dashboards:** Grafana dashboards per environment (Agent overview, Tool latency, Billing usage).

---

# 11 — Security Patterns

* **Secrets:** Vault / cloud secret manager; no secrets in repo.
* **Outbound allowlist**: external connectors via proxy to reduce SSRF.
* **Least privilege**: service tokens minimal scope; per tenant BaseHub tokens if needed.
* **Input validation:** Zod for all tool inputs.
* **Idempotency:** idempotency-key for side-effect tools (render, commit, createTask).
* **Audit logs:** append-only audit table for content commits & approvals.

---

# 12 — Testing Strategy

* **Unit tests:** jest for packages & services.
* **Contract tests:** pact or lightweight contract checks for tool interfaces.
* **Integration tests:** CI job against BaseHub sandbox & dev infra.
* **E2E tests:** Playwright (chat flows, document generation).
* **Load tests:** k6 simulate concurrent sessions and token usage.

---

# 13 — Example Onboarding / Bootstrapping Steps (Dev)

1. Clone repo, `pnpm install`.
2. Copy `.env.example` → `.env.local`, fill required keys.
3. Start local infra: `docker-compose up -d`.
4. `pnpm --filter mock-basehub dev` (if using mock).
5. `pnpm turbo run dev` to start apps.
6. Run `scripts/seed-basehub.ts` to seed sample content.

---

# 14 — Best-practice Conventions

* **Strict typing**: `tsconfig strict = true`.
* **Zod-first**: design API schemas with zod, then types.
* **Small packages**: encourage reuse and testability.
* **Immutable events**: conversation events append-only.
* **Feature flags**: per-tenant via Unleash/Flagsmith.
* **Code reviews + PR preview**: required for all merges.

