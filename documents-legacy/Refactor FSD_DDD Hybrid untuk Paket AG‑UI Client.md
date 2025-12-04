## Tujuan
- Mereorganisasi `packages/agui-client` dengan pola FSD/DDD hibrid agar modular, teruji, dan mudah dikonsumsi.
- Menyamakan kontrak event dengan `EventSchema` dari UI, memperkuat transport SSE/WS (ketahanan, validasi, metrics), dan merapikan API publik.
- Melengkapi dokumentasi (instalasi, penggunaan, arsitektur) serta pengujian menyeluruh.

## Struktur FSD/DDD Hibrid
- `src/domain`:
  - Tipe inti: `Message`, `Conversation`, `Context`, `AGUIEvent` (re‑export dari UI), `Result` (success/error), `Errors` (typed).
  - Skema: `UserMessageSchema`, `EventSchema` (import dari UI) sebagai sumber kebenaran.
- `src/application`:
  - Orkestrator `AguiClient`: alur `sendMessage`, `streamEventsSSE`, `connectWS/onEvent`, normalisasi hasil, retry policy.
  - Service kecil: `EventDispatcher` (publish/subscribe), `Metrics` (latency, errorCount, messageCount).
- `src/infrastructure`:
  - `transports/sse.ts`: parser/reader SSE, validasi Zod, pengelolaan partial chunks.
  - `transports/ws.ts`: koneksi WS dengan heartbeat, backoff, dan subscribe.
  - `http.ts`: helper POST dengan headers/tokens, timeout.
- `src/adapters` (opsional):
  - Adapter ke integrasi (mis. `AguiClientAdapter` di `packages/integrations`).
- `src/presentation` (opsional):
  - Contoh CLI minimal (jika diperlukan untuk demo), tidak masuk build lib.
- `index.ts`: barrel exports terkurasi (API publik saja).

## Implementasi Teknis
- Domain
  - Pisahkan tipe yang spesifik lib dari re‑export tipe UI; seluruh event wajib tervalidasi dengan `EventSchema`.
  - Tambahkan `ClientError` dan kode kesalahan standar (network, parse, protocol).
- Transport SSE
  - Parser robust: gabungkan baris `data:` multiline, ignore invalid json, batching ringan.
  - Generator stream: validasi `EventSchema`, yield `AGUIEvent`, dukung pembatalan.
- Transport WS
  - `buildWSUrl(base, token?)`, heartbeat ping/pong, reconnect backoff (exponential dengan jitter), unsubscribe idempoten.
  - Validasi payload JSON → `EventSchema`; pengukuran latency dari `pong`.
- Orkestrasi Client
  - `sendMessage(message, context?)`: POST dengan timeout, hasil dalam bentuk `Result<T>`.
  - `streamEventsSSE(userMessage)`: alir event terstruktur, expose hooks untuk metrics & lifecycle.
  - `connectWS(token?)` dan `onEvent(cb)`: API ergonomis; `close()` menutup bersih.
- Public API & Exports
  - Ekspor hanya `AguiClient`, tipe domain, `EventSchema` & tipe AG‑UI; sembunyikan detail internal.
- Build & Distribusi
  - Pastikan `main`/`types` menunjuk `dist`; `tsconfig` menghasilkan d.ts; tetap `private` di monorepo.

## Dokumentasi
- `README.md` (paket):
  - Instalasi (workspaces), API utama, contoh SSE/WS, best practices.
- Dokumen arsitektur: `/home/inbox/smart-ai/sba-agentic/.trae/documents/Refactor FSD_DDD Hybrid untuk Paket AG‑UI Client.md`
  - Tujuan, struktur FSD/DDD, diagram alur event, kontrak tipe, ketahanan, pengujian, dan integrasi dengan paket `integrations`.

## Pengujian
- Unit (Vitest):
  - SSE parser (single/multi‑line, invalid JSON), WS transport (ping/pong, reconnect), HTTP error handling.
  - Orkestrasi client (send/stream/subscribe) dengan mock fetch/ws.
- Integrasi:
  - Kontrak event → `EventSchema.safeParse` (tanpa error di alur utama).
  - Adapter di `packages/integrations` mengalirkan urutan event minimal.
- Target coverage ≥ 85% untuk modul domain, transports, dan client.

## Verifikasi & Kriteria Keberhasilan
- Type‑check lulus di monorepo; build paket menghasilkan d.ts.
- SSE/WS berjalan stabil, validasi event konsisten, metrics tersedia.
- API publik jelas dan terdokumentasi; contoh penggunaan bekerja.
- Test suite hijau dengan coverage yang ditetapkan.

## Rencana Eksekusi
1) Refactor struktur folder sesuai FSD/DDD, memindahkan file ke domain/application/infrastructure.
2) Perkuat transports SSE/WS (parser, heartbeat, backoff, validasi, metrics).
3) Sederhanakan dan amankan API `AguiClient`; kurangi kebocoran detail internal.
4) Lengkapi dokumentasi paket dan dokumen arsitektur FSD/DDD.
5) Tambah dan jalankan pengujian unit/integrasi; capai coverage.
6) Verifikasi lint/type‑check/test di workspace.

## Risiko & Mitigasi
- Risiko path build/tsconfig lintas paket: gunakan `dist` sebagai target konsumsi antar paket.
- Risiko regresi event: kontrak tunggal `EventSchema` dan test kontrak menjaga konsistensi.
- Risiko flakiness WS/SSE: tambah timeout, retry policy, dan pembatalan generator.

Silakan konfirmasi untuk mulai mengeksekusi refactor dan penguatan sesuai rencana di atas.