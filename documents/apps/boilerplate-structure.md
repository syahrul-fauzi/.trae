# Rancangan Boilerplate Folder + File Struktur — Apps/*

Struktur baseline untuk setiap aplikasi dalam monorepo SBA-Agentic dengan pendekatan hibrid FSD + DDD untuk skalabilitas dan maintainability. Dokumentasi ini memandu reorganisasi proyek berdasarkan fitur dan domain, isolasi modul, serta komunikasi antar bounded context.

## `apps/api`
```
apps/api/
├─ src/
│  ├─ modules/
│  │  ├─ agent/
│  │  ├─ workflow/
│  │  ├─ integrations/
│  │  ├─ knowledge/
│  │  └─ billing/
│  ├─ middleware/
│  ├─ routes/
│  ├─ lib/
│  └─ index.ts
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/
├─ openapi/
│  └─ openapi.yaml (symlink ke documents/api/openapi.yaml)
└─ package.json
```

### Prasyarat, Instalasi, & Konfigurasi (API)
- Prasyarat: Node 20+, PNPM 9+, Postgres, Docker.
- Instalasi: `pnpm install` lalu `pnpm dev` untuk pengembangan.
- Konfigurasi env: `DATABASE_URL`, `BASEHUB_API_KEY`, `AUTH_PROVIDER_KEYS`, `STRIPE_SECRET_KEY`, `OPENAI_API_KEY`.
- Struktur direktori: lihat modul, middleware, routes, prisma, openapi.
- Kontribusi: gunakan PR dengan lint/test hijau, perbarui dokumentasi.
- Lisensi: MIT.

### Penerapan DDD (API)
- Bounded Context: `Agent`, `Workflow`, `Integrations`, `Knowledge`, `Billing`, `Identity`.
- Model Domain:
  - Entities: `AgentRun`, `WorkflowRun`, `IntegrationAccount`.
  - Value Objects: `ApprovalStatus`, `Scope`, `CostEstimate`.
  - Aggregates: `RunAggregate` mengelola konsistensi event & approval.
- Repository & Services:
  - Repository: `WorkflowRunRepository` (Prisma + RLS), `IntegrationRepository`.
  - Services: `AgentPlannerService`, `ApprovalService`, `EventStreamService`.

Contoh repository (sketsa):
```
class WorkflowRunRepository {
  constructor(private prisma) {}
  async create(tenantId, data) { /* ... RLS aware insert ... */ }
  async findById(tenantId, id) { /* ... guard ... */ }
}
```

Contoh service (sketsa):
```
class ApprovalService {
  async requestApproval(runId, step, payload) { /* emit awaiting_approval */ }
  async resolveApproval(runId, step, decision) { /* update aggregate, emit event */ }
}
```

## `apps/app`
```
apps/app/
├─ src/
│  ├─ pages/
│  ├─ widgets/
│  ├─ features/
│  ├─ entities/
│  ├─ shared/
│  └─ app.tsx
├─ public/
├─ vite.config.ts
└─ package.json
```

### Prasyarat, Instalasi, & Konfigurasi (App)
- Prasyarat: Node 20+, PNPM 9+, akses API.
- Instalasi: `pnpm install`, `pnpm dev`.
- Konfigurasi env: endpoint API, keys identitas (MFA/SSO), fitur i18n.
- Struktur direktori: FSD berlapis (features/entities/shared).
- Kontribusi: patuhi pedoman komponen & a11y.
- Lisensi: MIT.

### Penerapan FSD (App)
- Lapisan:
  - `features/` berisi unit fitur UI (mis. `approval`, `workflow-panel`, `chat`).
  - `entities/` tipe entitas UI (mis. `run`, `event`, `integration-account`).
  - `shared/` util & UI primitives (design system, hooks umum).
- Isolasi Modul: setiap fitur memiliki `model/`, `ui/`, `lib/`, `api/` sendiri.

Contoh struktur fitur `approval`:
```
features/approval/
├─ model/
│  ├─ state.ts
│  └─ selectors.ts
├─ ui/
│  ├─ ApprovalBanner.tsx
│  └─ ApprovalDialog.tsx
├─ api/
│  └─ approve.ts
└─ lib/
   └─ validators.ts
```

Contoh aksi approve (sketsa):
```
export async function approveStep({ runId, stepId, reason }) {
  return fetch('/agent/approve', { body: JSON.stringify({ runId, stepId, action: 'approve', reason }) })
}
```

## `apps/docs`
```
apps/docs/
├─ content/
├─ openapi/
├─ src/
│  ├─ pages/
│  ├─ components/
│  └─ index.ts
└─ package.json
```

### Prasyarat, Instalasi, & Konfigurasi (Docs)
- Prasyarat: Node 20+, PNPM 9+.
- Instalasi: `pnpm install`, sinkronkan OpenAPI untuk referensi.
- Konfigurasi: domain/docs base path, akses BaseHub.
- Struktur direktori: content/openapi/src.
- Kontribusi: review lint docs, contoh berkualitas.
- Lisensi: MIT.

### FSD + Integrasi Konten
- `pages/` untuk halaman dokumentasi.
- `components/` untuk blok konten reusable (Try It, code block, alerts).
- `openapi/` sinkron dengan kontrak untuk referensi otomatis.

## `apps/web`
```
apps/web/
├─ src/
│  ├─ pages/
│  ├─ components/
│  ├─ shared/
│  └─ index.tsx
├─ public/
└─ package.json
```

### Prasyarat, Instalasi, & Konfigurasi (Web)
- Prasyarat: Node 20+, PNPM 9+.
- Instalasi: `pnpm install`, `pnpm dev`.
- Konfigurasi: SEO/a11y, CSP, analytics patuh privasi.
- Struktur direktori: pages/components/shared.
- Kontribusi: ikuti pedoman UI/UX dan CSP ketat.
- Lisensi: MIT.

### FSD Ringan
- `pages/` untuk surface utama (landing/status).
- `components/` untuk blok presentasi; `shared/` untuk util & tema.

## Standar Umum
- TypeScript strict; linting & formatting konsisten.
- CI/CD: build, test, lint, coverage guard; SBOM opsional.
- Security: secrets via env, CSP untuk UI, RLS untuk DB.
- Observability: tracing OTel, logs terstruktur, metrics p95/p99.

## Pendekatan Hibrid FSD + DDD
- Batasan: UI mengikuti FSD untuk skalabilitas komponen; server mengikuti DDD untuk konsistensi domain.
- Komunikasi antar modul/domain: gunakan event bus/timeline dengan envelope `eventId`, `runId`, `tenantId`, `ts`, `step`, `payload`.
- Mapping: `features` (UI) → `modules` (API) → `bounded contexts` (domain) untuk pelacakan end‑to‑end.

## Diagram Arsitektur Hubungan Komponen
```mermaid
flowchart LR
  subgraph UI (FSD)
    FEAT1[features/approval]
    FEAT2[features/workflow-panel]
    ENT[entities/run]
    SH[shared/]
  end
  FEAT1 -- HTTPS --> API_MOD_AGENT[modules/agent]
  FEAT2 -- HTTPS --> API_MOD_WORKFLOW[modules/workflow]
  API_MOD_AGENT -- Domain Events --> BC_AGENT[BC: Agent]
  API_MOD_WORKFLOW -- Domain Events --> BC_WORKFLOW[BC: Workflow]
  BC_AGENT --> DB[(RLS)]
  BC_WORKFLOW --> DB
  FEAT1 -- SSE --> API_MOD_WORKFLOW
```

## Contoh Implementasi Komunikasi Antar Modul
- UI mengirim approve:
```
POST /agent/approve
{
  "runId": "run_abc123",
  "stepId": "step_4",
  "action": "approve",
  "reason": "Data diverifikasi"
}
```
- Server memvalidasi (DDD services) dan memancarkan event:
```
Event: awaiting_approval_resolved
Payload: { runId, stepId, status: 'approved', actor, ts }
```

## Skala & Maintainability
- Modularisasi ketat, kontrak eksplisit (OpenAPI), pengujian berlapis (unit/integration/E2E).
- Observability dan audit untuk setiap step kritis.
- Policy per-tenant untuk model AI, rate-limit, dan akses integrasi.

## Pedoman FSD Lanjutan (UI)
- Reorganisasi berbasis fitur: setiap fitur memiliki API publik minimal dan tidak mengimpor fitur lain secara langsung, gunakan `entities/` atau `shared/` sebagai antarmuka.
- Lapisan jelas:
  - `features/` berisi logika spesifik fitur, hanya mengakses `entities/` dan `shared/`.
  - `entities/` menyimpan model data UI dan adaptor API yang reusable lintas fitur.
  - `shared/` berisi design system, hooks, utils umum.
- Aturan dependency: `shared` tidak bergantung pada `features`; `entities` tidak bergantung pada `features`.

Contoh struktur FSD konsisten:
```
src/
├─ features/
│  ├─ approval/
│  │  ├─ model/
│  │  │  ├─ state.ts
│  │  │  └─ selectors.ts
│  │  ├─ ui/
│  │  │  ├─ ApprovalBanner.tsx
│  │  │  └─ ApprovalDialog.tsx
│  │  ├─ api/
│  │  │  └─ approve.ts
│  │  └─ index.ts
│  └─ workflow-panel/
├─ entities/
│  ├─ run/
│  │  ├─ types.ts
│  │  ├─ api.ts
│  │  └─ index.ts
├─ shared/
│  ├─ ui/
│  ├─ utils/
│  └─ hooks/
```

## Pedoman DDD Lanjutan (Server/API)
- Identifikasi bounded context berdasarkan domain operasional: `Agent`, `Workflow`, `Integrations`, `Knowledge`, `Billing`, `Identity`.
- Model domain akurat:
```
type ApprovalStatus = 'awaiting' | 'approved' | 'denied'
type Scope = string
type CostEstimate = number
interface AgentRun { id: string; tenantId: string; status: string }
interface WorkflowRun { id: string; tenantId: string; status: string; createdAt: string }
```
- Aggregates menjaga konsistensi lintas event:
```
interface RunAggregate { runId: string; steps: string[]; approvalStatus: ApprovalStatus }
```
- Repository dan services:
```
interface WorkflowRunRepository {
  create(tenantId: string, data: Partial<WorkflowRun>): Promise<WorkflowRun>
  findById(tenantId: string, id: string): Promise<WorkflowRun | null>
}

class ApprovalService {
  requestApproval(runId: string, stepId: string, payload: unknown): Promise<void>
  resolveApproval(runId: string, stepId: string, status: ApprovalStatus, actor: string): Promise<void>
}
```

## Pendekatan Hibrid Detail
- Batasan pendekatan:
  - UI menggunakan FSD agar komponen dan fitur terskala.
  - Server menggunakan DDD agar konsistensi domain terjaga.
- Pemetaan:
  - `features/approval` ↔ `modules/agent` ↔ `BC: Agent`.
  - `features/workflow-panel` ↔ `modules/workflow` ↔ `BC: Workflow`.
- Mekanisme komunikasi:
  - Request/Response via API untuk aksi sinkron.
  - Event streaming SSE untuk timeline dan status.
  - Pub/Sub internal untuk propagasi event antar BC.

## Pengujian & Verifikasi
- UI: unit untuk komponen, integration untuk fitur, E2E untuk alur persetujuan dan run.
- Server: unit untuk services, integration untuk repository dan routes, kontrak API via OpenAPI tests, performance smoke untuk endpoint kritis.

## Diagram Tambahan & PNG
```mermaid
flowchart LR
  subgraph UI (FSD)
    FEAT_APPROVAL[features/approval]
    FEAT_WORKFLOW[features/workflow-panel]
    ENT_RUN[entities/run]
    SHARED[shared/]
  end
  subgraph API (DDD)
    MOD_AGENT[modules/agent]
    MOD_WORKFLOW[modules/workflow]
    BC_AGENT[BC: Agent]
    BC_WORKFLOW[BC: Workflow]
  end
  FEAT_APPROVAL -- HTTPS --> MOD_AGENT
  FEAT_WORKFLOW -- HTTPS --> MOD_WORKFLOW
  MOD_AGENT -- Domain Events --> BC_AGENT
  MOD_WORKFLOW -- Domain Events --> BC_WORKFLOW
  FEAT_APPROVAL -- SSE --> MOD_WORKFLOW
```

Instruksi PNG:
- Simpan render diagram ke `documents/apps/boilerplate-structure.png`.
- Tautkan di dokumen dengan `![FSD+DDD Hybrid](./boilerplate-structure.png)`.

## Contoh Implementasi Ringkas
- Aksi approve UI:
```
POST /agent/approve
{
  "runId": "run_abc123",
  "stepId": "step_4",
  "action": "approve",
  "reason": "Data diverifikasi"
}
```
- Event domain resolusi approval:
```
{
  "eventId": "evt_777",
  "runId": "run_abc123",
  "step": "approval_resolved",
  "payload": { "status": "approved", "actor": "user_789" }
}
```
