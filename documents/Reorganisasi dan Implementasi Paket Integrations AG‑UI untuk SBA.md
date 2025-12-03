## Tujuan & Ruang Lingkup
- Membuat paket `packages/integrations` yang menyatukan middleware dan server adapter AG‑UI untuk SBA.
- Memperkuat UI/UX di level integrasi (stabilitas stream, retry, backpressure, error handling) agar kompatibel dengan komponen AG‑UI di `@sba/ui`.
- Mengikuti prinsip FSD/DDD (hibrid) untuk struktur kode, kontrak tipe (Zod), dan boundary yang jelas.

## Keadaan Saat Ini
- Client internal sudah ada: `packages/agui-client/src/client.ts` menangani REST, SSE, WS (mis. stream SSE di `packages/agui-client/src/client.ts:95` dan WS di `packages/agui-client/src/client.ts:109`).
- Event schema diekspor dari UI: lihat `packages/ui/src/ag-ui/index.ts:1` dan impor schema di transport SSE/WS (`packages/agui-client/src/transports/sse.ts:1`, `packages/agui-client/src/transports/ws.ts:1`).
- Entry fitur AG‑UI di aplikasi: `apps/app/src/features/agui/ui/AGUIDashboard.tsx`, provider, chat, event stream.
- Direktori `packages/integrations` belum ada; integrasi saat ini tersebar (proxy/SSE di app). 

## Arsitektur Target (FSD/DDD Hibrid)
- `packages/integrations/agui-core` (domain & kontrak):
  - Domain: `agents`, `threads`, `runs`, `tools`, `tenants` (DDD entities + value objects).
  - Kontrak: Zod schema untuk event, input, tool calls (re‑use `@sba/ui/ag-ui/schema/events`).
  - Ports: `IAgent`, `IEventEmitter`, `IToolRegistry`.
- `packages/integrations/agui-middleware-openai` (middleware):
  - Kelas `OpenAIAgent` yang meng‑emit event AG‑UI (RUN_* / TEXT_MESSAGE_* / TOOL_CALL_*).
  - Menggunakan SDK OpenAI atau Vercel AI SDK (tanpa bergantung lib yang belum ada; akan ditambahkan eksplisit).
- `packages/integrations/agui-server-node` (server adapter):
  - HTTP endpoint yang menerima `RunAgentInput` dan mem‑stream AG‑UI events via SSE.
  - Encoder SSE kompatibel dengan klien internal (`packages/agui-client/src/transports/sse.ts`).
- `packages/integrations/agui-masstra` (opsional):
  - Adapter ke Mastra Agent agar berbicara AG‑UI.
- Struktur FSD:
  - `domain` (entities/types), `application` (use cases: runAgent, toolExecution), `infrastructure` (transports SSE/WS, adapters), `presentation` (tidak wajib).

## Rencana Implementasi
- Scaffold workspace:
  - Buat direktori `packages/integrations/{agui-core,agui-middleware-openai,agui-server-node}` dengan `package.json`, `tsconfig.json`, `src/`.
  - Tambah ke workspaces root (`package.json:6–9`).
- Kontrak & Tipe (agui-core):
  - Re‑export `EventSchema` agar konsisten tipe dengan UI.
  - Tambahkan Zod untuk `RunAgentInput`, `ToolCall`, `AgentConfig`.
- Middleware OpenAI:
  - Implement `OpenAIAgent.run(input)` yang meng‑emit urutan events sesuai spesifikasi.
  - Fitur: streaming delta, error normalization, cancellation, token budgeting.
- Server Node:
  - Endpoint `POST /agentic_chat` yang memvalidasi input (Zod), encode SSE (content‑type `text/event-stream`), dan meng‑bridge ke `OpenAIAgent`.
  - Fitur: heartbeat, retry headers, rate limit hints.
- Integrasi ke App:
  - Rute proxy konsolidasi ke package server adapter (menggantikan duplikasi di app bila ada): referensi `apps/app/src/app/api/runs/[runId]/events/route.ts` dan `apps/app/src/app/api/proxy/agui/[...path]/route.ts`.
- Reliability & UX (di integrasi):
  - WS: ping/pong, auto‑retry dengan jitter (melengkapi `packages/agui-client/src/transports/ws.ts:20–67`).
  - SSE: parser robust (melengkapi `packages/agui-client/src/transports/sse.ts:17–35`), fallback WS→SSE.
  - Backpressure dan batching kecil pada content events.
- Keamanan & Konfigurasi:
  - Env: `AGUI_API_URL`, `AGUI_API_KEY`, `AGUI_WEBHOOK_SECRET` (lihat `deploy-staging.sh:129–141`).
  - RBAC pada proxy; hindari logging secrets.

## Pengujian & Verifikasi
- Unit (Vitest):
  - Validasi event sequence dari `OpenAIAgent` (RUN_* → TEXT_* → RUN_FINISHED).
  - SSE encoder/decoder round‑trip.
  - WS subscribe/unsubscribe dan ping interval.
- Integration:
  - Test klien → server adapter via `AguiClient.streamEventsSSE` (`packages/agui-client/src/client.ts:95–107`).
- Type‑check & lint:
  - `pnpm -w type-check`, `pnpm -w test:ci` memastikan lint/type/test hijau.
- QA:
  - Health endpoint (apps/web), a11y di komponen UI sudah dilacak di `docs/QA_CHECKLIST.md`.

## Dokumentasi
- Tambah dokumen: `/home/inbox/smart-ai/sba-agentic/.trae/documents/Reorganisasi dan Implementasi Paket Integrations AG‑UI untuk SBA.md` berisi:
  - Arsitektur, diagram alur events, env, cara menjalankan, dan contoh konsumsi dari `AguiClient`.
  - Penjelasan FSD/DDD boundary dan dependency.

## Rollout
- Tambah paket ke workspaces dan scripts Turbo.
- Konfigurasi env staging: `deploy-staging.sh` variabel AG‑UI.
- Update rute app untuk menggunakan server adapter baru; pastikan kompatibel dengan komponen `@sba/ui`.

## Kriteria Penerimaan
- Semua paket baru ter‑build, type‑check lulus, dan tes hijau.
- Klien internal (`AguiClient`) dapat:
  - Mengirim pesan (`packages/agui-client/src/client.ts:29–48`).
  - Stream chunk (`packages/agui-client/src/client.ts:50–93`).
  - Stream events SSE (`packages/agui-client/src/client.ts:95–107`) dan WS (`packages/agui-client/src/client.ts:109–118`).
- Dokumentasi lengkap tersedia di path dokumen yang diminta.

## Catatan Implementasi
- Tidak menambah dependensi eksternal tanpa eksplisit di package baru.
- Menjaga kompatibilitas schema events dengan `@sba/ui` agar UI/UX tidak regress.
- Semua rahasia/keys dikelola via env, tidak pernah di‑commit.