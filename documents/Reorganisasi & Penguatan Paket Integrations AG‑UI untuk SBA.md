# Reorganisasi & Penguatan Paket Integrations AG‑UI untuk SBA

## Tujuan
- Menata ulang dan memperkuat paket `packages/integrations` sesuai prinsip FSD/DDD hibrid agar stabil, skalabel, dan mudah dievolusi.
- Menyelaraskan protokol event AG‑UI (lifecycle & reasoning), transport SSE/JSON, dan adapters dengan kebutuhan SBA serta UI/UX yang baik.
- Menyediakan dokumentasi, pengujian menyeluruh, dan contoh integrasi end‑to‑end (route + UI chat).

## Ringkasan Perubahan
- Event lifecycle: menambah `RUN_STARTED` dan `RUN_ERROR`, mempertahankan `RUN_FINISHED`; mewajibkan `timestamp` untuk lifecycle dan reasoning content.
- `HttpAgent` (SSE/JSON): emit `RUN_STARTED` di awal, emit `RUN_ERROR` saat gagal, header SSE diperkuat (`Cache-Control: no-cache, no-transform`, `X-Accel-Buffering: no`).
- Barrel ekspor dibersihkan; adapters baru ditambahkan: `MastraAdapter`, `LangGraphAdapter`, `VercelAISDKAdapter`, `OpenAIStreamingAdapter`.
- Dokumentasi arsitektur dan README diperbarui; UI chat menangani `RUN_ERROR` untuk UX yang jelas.
- Pengujian: lifecycle/error di paket integrations, SSE/JSON di apps/app untuk route `agents/run`, serta adapter streaming OpenAI.

## Arsitektur (FSD/DDD Hibrid)
- Domain
  - `events`: kontrak event AG‑UI (Zod) untuk lifecycle (`RUN_STARTED`, `RUN_ERROR`, `RUN_FINISHED`) dan reasoning (`REASONING_MESSAGE_*`).
  - `run`: `RunAgentInput` + invariants (ID/timestamp policy).
- Application
  - `agents`: port `AbstractAgentAdapter` dengan `emit(...)` yang aman.
  - `usecases`: orkestrasi run, pemilihan SSE/JSON, penanganan error.
- Infrastructure
  - `encoders`: `EventEncoder` SSE/JSON.
  - `transports/http`: `HttpAgent` header SSE kuat, lifecycle & error.
  - `translators`: normalisasi aliran dari Mastra/LangGraph/Vercel.
- Adapters
  - `OpenAIAdapter` (contoh), `OpenAIStreamingAdapter` (client streaming), `MastraAdapter`, `LangGraphAdapter`, `VercelAISDKAdapter`, `AguiClientAdapter` (bridge SSE).
- Shared
  - Util umum (`ids`, `safeJSON`, `time`) dan logger ringan.

## Kontrak Event
- Lifecycle
  - `RUN_STARTED` — wajib `timestamp`; pembuka run.
  - `RUN_ERROR` — wajib `timestamp`; memiliki `error` opsional.
  - `RUN_FINISHED` — wajib `timestamp`; penutup run sukses.
- Reasoning
  - `REASONING_MESSAGE_START` — wajib `timestamp`.
  - `REASONING_MESSAGE_CONTENT` — wajib `delta` dan `timestamp`.
  - `REASONING_MESSAGE_END` — wajib `timestamp`.
- Validasi: seluruh event tervalidasi oleh Zod (lihat `packages/integrations/src/core/AbstractAgentAdapter.ts:13–18`).

## Transport
- SSE (`text/event-stream`)
  - Header: `Content-Type`, `Cache-Control: no-cache, no-transform`, `Connection: keep-alive`, `X-Accel-Buffering: no`.
  - Awal stream: `RUN_STARTED` → reasoning → `RUN_FINISHED` atau `RUN_ERROR`.
- JSON (`application/json`)
  - Payload: `{ events: [...] }` dimulai dari `RUN_STARTED`, diikuti event adapter.

## Implementasi Kunci
- `HttpAgent`: `packages/integrations/src/server/http/HttpAgent.ts:17–39,42–44`.
- `AbstractAgentAdapter`: `packages/integrations/src/core/AbstractAgentAdapter.ts:13–18`.
- Adapters baru:
  - OpenAI streaming: `packages/integrations/src/middleware/OpenAIStreamingAdapter.ts:1`.
  - Mastra: `packages/integrations/src/middleware/MastraAdapter.ts:1`.
  - LangGraph: `packages/integrations/src/middleware/LangGraphAdapter.ts:1`.
  - Vercel AI SDK: `packages/integrations/src/middleware/VercelAISDKAdapter.ts:1`.
- Barrel ekspor: `packages/integrations/src/index.ts:1–8`.

## Integrasi App Route & UI
- Next.js route: `apps/app/src/app/api/agents/run/route.ts` menggunakan `HttpAgent` dan adapter.
- UI Chat: `apps/app/src/features/agui-chat/ui/AGUIChat.tsx`
  - SSE streaming: memproses `REASONING_MESSAGE_CONTENT` dan menutup pada `REASONING_MESSAGE_END/RUN_FINISHED`.
  - Error: menampilkan pesan sistem saat menerima `RUN_ERROR` pada SSE maupun JSON.

## Instalasi & Pemakaian
- Build & test paket integrations:
  - `pnpm -s -C packages/integrations build`
  - `pnpm -s -C packages/integrations test -- --run --reporter=dot`
- App route pengujian:
  - `pnpm -s -C apps/app test -- --run --reporter=dot`
- Penggunaan di route:
  `import { HttpAgent, OpenAIStreamingAdapter } from "@sba/integrations";`
  `export async function POST(req: Request) {`
  `  const adapter = new OpenAIStreamingAdapter(/* injeksi client */);`
  `  const agent = new HttpAgent(adapter);`
  `  return agent.handle(req);`
  `}`

## Pengujian
- Integrations:
  - Lifecycle & error: `packages/integrations/src/__tests__/LifecycleAndError.test.ts`.
  - OpenAI streaming: `packages/integrations/src/__tests__/OpenAIStreamingAdapter.test.ts`.
- Apps/app:
  - SSE: `apps/app/src/__tests__/agents-run-route-sse.spec.ts`.
  - SSE error: `apps/app/src/__tests__/agents-run-route-sse-error.spec.ts`.

## Keamanan
- Hindari log secrets; gunakan env hanya di server.
- Sanitasi input dan batasi ukuran body; error messages konsisten.
- Siapkan rate limiting ringan, retry/backoff, dan circuit breaker sesuai kebutuhan operasional.

## Observability
- Tambahkan tag `tenantId` pada event/metrik untuk multi‑tenant.
- Gunakan OpenTelemetry tracing dan metrik dasar (Prometheus) pada jalur integrasi jika diperlukan.

## Migrasi
- Skema minimal tetap kompatibel; konsumen yang hanya mengandalkan `REASONING_*` dan `RUN_FINISHED` tidak perlu perubahan.
- Lifecycle baru (`RUN_STARTED`, `RUN_ERROR`) bersifat additive dan meningkatkan visibilitas run.

## Catatan UI/UX
- SSE diawali `RUN_STARTED` sehingga UI dapat menandai status “running”.
- `RUN_ERROR` di‑surface di UI chat sebagai pesan sistem agar pengguna mendapatkan konteks kegagalan yang jelas.

## Roadmap
- Integrasi OpenAI SDK aktual (injeksi client aman) dan contoh konfigurasi.
- Penambahan ToolCallBridge untuk mengeksekusi fungsi (client/server) berformat event AG‑UI.
- Observabilitas lanjutan dan idempotency-key untuk operasi side‑effect.
