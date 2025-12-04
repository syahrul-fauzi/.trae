## Ikhtisar Kondisi Saat Ini
- Client HTTP/SSE ada di `packages/agui-client/src/client.ts` (POST ke `api/agui/chat`, SSE di `api/agui/stream`) – lihat `packages/agui-client/src/client.ts:25`, `packages/agui-client/src/client.ts:46`, `packages/agui-client/src/client.ts:79`.
- Layer event AG-UI di UI sudah menggunakan WebSocket dengan ping/pong, backoff, dan metrics – lihat `packages/ui/src/ag-ui/events/WebSocketProvider.tsx:54`, `packages/ui/src/ag-ui/events/WebSocketProvider.tsx:181`, `packages/ui/src/ag-ui/events/WebSocketProvider.tsx:271`, `packages/ui/src/ag-ui/events/WebSocketProvider.tsx:318`.
- Skema event kuat tersentralisasi di `packages/ui/src/ag-ui/schema/events.ts` (union Zod untuk seluruh event reasoning/stream/tool) – lihat `packages/ui/src/ag-ui/schema/events.ts:3`, `packages/ui/src/ag-ui/schema/events.ts:137`.
- Paket UI punya komponen dialog/monitoring/hooks/storybook dan test dengan Vitest.

## Tujuan
- Selaraskan client SBA dengan protokol AG-UI (event-driven) dan dukung transport WS & SSE.
- Tingkatkan UI/UX (agent dialog, monitoring, loading/error states, A11y, i18n) untuk pengalaman terbaik.
- Refactor agar konsisten tipe (Zod) lintas paket, kurangi duplikasi, dan perkuat error handling/reconnect.
- Lengkapi dokumentasi dan jalankan pengujian menyeluruh hingga lulus CI.

## Peningkatan AG‑UI Client
- Tambah abstraksi `AguiTransport` yang mendukung `WebSocket` dan `SSE`:
  - Negosiasi token query (`?token=`) selaras dengan UI WS provider.
  - Parser stream yang robust untuk SSE (baris `data:`) dan WS (payload JSON) dengan validasi Zod.
  - Metrics dasar (messageCount, errorCount, latency) untuk sinkronisasi ke UI Monitoring.
- Selaraskan tipe: gunakan union `EventSchema` dari UI sebagai sumber kebenaran tipe event; buat adaptor tipis di client agar `AguiResponseSchema` kompatibel dengan event AG-UI.
- Tambah API ergonomis:
  - `sendUserMessage({ id, content })` menggunakan `UserMessageSchema`.
  - `onEvent(type, handler)` berlangganan event terstruktur.
  - `runAgent(messages, options)` sebagai convenience untuk alur chat.
- Opsi integrasi Mastra (berdasarkan quickstart): jika tersedia, expose util `createMastraAgent` untuk CLI dan thread `main-conversation` sebagai contoh.

## Unifikasi Protokol Event
- Kontrak event: gunakan `packages/ui/src/ag-ui/schema/events.ts` sebagai satu-satunya definisi event; ekspor ulang tipe dari client agar konsisten lintas paket.
- Normalisasi payload: pastikan semua event memiliki `type`, `channel`, `payload`, `timestamp` dan optional `meta`.
- Heartbeat: pertahankan `ping/pong` pada WS (UI sudah mengirim `ping` dan menerima `pong`) dan fallback SSE tanpa heartbeat (deteksi disconnect via stream end).

## Refactor & Reorganize
- Pisahkan layer transport (`transports/ws.ts`, `transports/sse.ts`) dari API tinggi (`client.ts`).
- Ekstrak skema ke modul `schemas/` yang mengimpor atau menyelaraskan dengan UI.
- Kurangi duplikasi tipe antara `packages/agui-client/src/types.ts` dan UI schema; gunakan re-exports atau shared build output.

## Peningkatan UI/UX
- AGAgentDialog: tambahkan progressive streaming (delta text), skeleton states, dan error banner.
- MonitoringDashboard: tampilkan metrics real-time dari `WebSocketProvider.getMetrics()` (latency, reconnectAttempts, missedPongs, backoffMs).
- i18n: pastikan label/aria menggunakan `ag-ui/i18n`; tambah locale default dan fallback.
- A11y: role/aria yang benar untuk dialog, tombol, fokus trap; cek dengan Testing Library.
- Theme: konsisten spacing/typography dan states (hover/active/disabled) untuk komponen AG.

## Pengujian Menyeluruh
- Unit (Vitest):
  - Parser SSE (chunking, `data:` multiline, JSON error) untuk client.
  - WS transport (reconnect backoff, ping/pong timeout, publish/subscribe) dengan mock.
  - Hooks `useAGEvents`, `useWebSocketAdvanced`, `useConnectionStatus` edge cases.
- Integration:
  - Contract test antara client dan UI schema (safeParse `EventSchema`).
  - AGAgentDialog rendering dan streaming delta.
- Coverage target ≥ 85% untuk `packages/agui-client` dan modul AG‑UI.

## Dokumentasi
- Quickstart: cara memakai SBA AG‑UI Client (HTTP/SSE/WS), contoh CLI berbasis Mastra.
- API Reference: fungsi utama (`sendMessage`, `streamMessage`, `onEvent`, `runAgent`).
- Arsitektur: diagram alur event, transport, hooks, komponen.
- Use‑Case SBA: isi `/.trae/documents/Use-Case & Ide SaaS untuk Smart Business Assistant (SBA).md` dengan skenario utama (support, sales, ops) dan UI flow.

## Audit Bug & Ketahanan
- Validasi cleanup WS (pastikan `close()` dan `clearTimeout/Interval`) – dasar ada di `packages/ui/src/ag-ui/events/WebSocketProvider.tsx:231`.
- Tangani JSON parse failure pada stream (sudah ada peringatan; perlu retry/log terstruktur) – `packages/agui-client/src/client.ts:84`.
- Idempotensi subscribe/unsubscribe dan kebocoran listener.
- Konsistensi `channel:eventType` key dan dispatch `CustomEvent` – `packages/ui/src/ag-ui/events/WebSocketProvider.tsx:175`.

## CI & Kualitas
- Jalankan `pnpm -w type-check`, `pnpm -w lint`, `pnpm -w test`, `pnpm -w build`.
- Storybook: `packages/ui` `storybook` dan `build-storybook` bebas error.
- Tambah prepush hook opsional untuk type-check + test cepat.

## Kriteria Keberhasilan & Verifikasi
- Client mendukung WS & SSE dan tervalidasi oleh `EventSchema` tanpa error.
- UI menunjukkan streaming yang halus, indikator status koneksi akurat, dan monitoring realtime.
- Semua test lulus di CI (`pnpm -s test:ci`) dengan coverage target tercapai.
- Dokumentasi lengkap (Quickstart, API, Arsitektur, Use‑Case SBA) dan dapat diikuti end‑to‑end.

## Langkah Eksekusi (Setelah Disetujui)
1) Refactor `agui-client` (transport, schemas, API ergonomis).
2) Unifikasi tipe dengan UI schema dan re‑exports.
3) Peningkatan komponen UI/UX (dialog, monitoring, i18n, A11y).
4) Tambah dan jalankan test unit/integrasi; capai coverage.
5) Lengkapi dokumentasi dan contoh CLI.
6) Verifikasi lokal (Storybook, test:ci) dan serahkan hasil akhir.