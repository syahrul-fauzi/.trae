# RANCANGAN LENGKAP & MENDALAM — `apps/api` (SBA-Agentic Orchestrator)

## Gambaran Umum
- Menyediakan lapisan API-first yang mengorkestrasi agentic runs, workflow, integrasi, dan akses pengetahuan.
- Menangani autentikasi, RBAC per-tenant, audit, observability, dan rate-limiting.

## Arsitektur
- Modul: Agent, Workflow, Integrations, Knowledge, Billing, Identity.
- Event: SSE stream `runId/tenantId`, audit timeline, retry policy.
- Storage: Postgres (Prisma) dengan RLS berbasis `tenantId`.
- Diagram:
```
Client → API → Orchestrator → Workers → Integrations
              ↘ BaseHub/Knowledge ↔ DB (RLS)
```

## API Surface (contoh)
- `POST /agent/plan` — rencana eksekusi.
- `POST /agent/execute` — jalankan langkah.
- `GET /workflow/runs/:id/events` — stream event.
- `POST /integrations/:provider/oauth/callback` — OAuth.

## Lifecycle Persetujuan (Approval)
### Deskripsi
Siklus persetujuan mengatur eksekusi langkah yang membutuhkan otorisasi pengguna. Agent mengirim event `awaiting_approval` yang berisi rincian aksi, perkiraan biaya, dan scope yang diminta. UI atau webhook internal menanggapi dengan `approved` atau `denied`.

### Tahapan
```
idle → planning → executing → awaiting_approval → approved|denied → completed|failed
```

### Payload Persetujuan (Request Body)
```json
{
  "runId": "run_abc123",
  "stepId": "step_4",
  "approval": {
    "status": "approved",
    "actor": "user_789",
    "reason": "Lanjutkan sinkronisasi CRM",
    "ts": "2025-12-03T12:00:00Z"
  }
}
```

### Event `awaiting_approval` (SSE)
```json
{
  "eventId": "evt_555",
  "runId": "run_abc123",
  "tenantId": "tnt_001",
  "ts": "2025-12-03T11:59:00Z",
  "step": "awaiting_approval",
  "level": "info",
  "payload": {
    "action": "crm.sync",
    "costEstimate": 124,
    "scope": ["contacts", "deals"],
    "requires": ["write:crm"]
  }
}
```

## Implementasi Server-Sent Events (SSE)
### Endpoint
- `GET /workflow/runs/{id}/events` dengan konten `text/event-stream`.

### Header & Format
- Response header: `Cache-Control: no-cache`, `Connection: keep-alive`, `Content-Type: text/event-stream`.
- Format event:
  - `id: <eventId>`
  - `event: <step>` (opsional)
  - `data: <json>`
  - `\n` sebagai pemisah event.

### Reconnection
- Klien harus melakukan auto-reconnect dengan backoff eksponensial.
- Gunakan `Last-Event-ID` untuk melanjutkan stream.

### Keamanan
- Header `Authorization: Bearer <token>`; validasi RBAC pada run/tenant.

## Instruksi Diagram Arsitektur (PNG)
- Simpan gambar di `documents/apps/api/architecture.png`.
- Tautkan di README:
  - `![Architecture](./architecture.png)`
- Untuk menghasilkan PNG dari Mermaid gunakan CLI:
  - Sumber Mermaid: `documents/apps/api/architecture.mmd`
  - Output PNG: `documents/apps/api/architecture.png`

## Konfigurasi & Env
- `DATABASE_URL`, `BASEHUB_API_KEY`, `AUTH_PROVIDER_KEYS`, `STRIPE_SECRET_KEY`, `OPENAI_API_KEY`.
- TLS wajib pada produksi; secrets dikelola oleh Secret Manager.

## Keamanan
- Validasi input (Zod), RBAC & scopes, rate-limit adaptif, audit untuk aksi sensitif.

## Observability
- OTel tracing end-to-end; korelasi `runId/tenantId`; logs terstruktur; metrics p95/p99.

## Pengujian
- Unit ≥80%, Integration alur utama (MSW/test DB), E2E untuk lifecycle tenant & run.

## Deployment
- Docker multi-stage; Kubernetes dengan HPA; canary/blue-green; rollback prosedural.

## SLO
- Latency p95 API ≤250ms; availability ≥99.9%.

## Roadmap
- Stabilkan orchestrator v1; perluas katalog tools; tambah integrasi Slack/Google/CRM.

## Gambar Arsitektur
- PNG arsitektur dapat ditambahkan untuk stakeholder presentasi. Simpan di `documents/apps/api/architecture.png` dan tautkan di README.
## Prasyarat Sistem
- Node.js 20+, PNPM 9+, Postgres 14+, Docker.
- Kunci akses: `DATABASE_URL`, `BASEHUB_API_KEY`, `AUTH_PROVIDER_KEYS`, `STRIPE_SECRET_KEY`, `OPENAI_API_KEY`.

## Instalasi & Konfigurasi
- Instal: `pnpm install`
- Jalankan dev: `pnpm dev`
- Konfigurasi env di `.env` dengan variabel di atas.
- Build: `pnpm build`; Docker: `docker build` multi-stage.

## Penggunaan Dasar
- Rencanakan agent: `POST /agent/plan`
- Eksekusi langkah: `POST /agent/execute`
- SSE events: `GET /workflow/runs/{id}/events`
- Persetujuan: `POST /agent/approve`

## Struktur Direktori
```
apps/api/
├─ src/modules/{agent,workflow,integrations,knowledge,billing}
├─ src/middleware
├─ src/routes
├─ prisma/{schema.prisma,migrations}
├─ openapi/openapi.yaml
└─ package.json
```

## Kontribusi
- PR dengan lint/test hijau, tambahkan dokumentasi perubahan, patuhi pedoman keamanan.

## Lisensi
- MIT
