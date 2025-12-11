## Tujuan
Sinkronisasi kontrak API lintas aplikasi, konsolidasi facade realtime/HTTP ke paket bersama, verifikasi SLA/NFR melalui acceptance tests, dan penetapan RACI domain.

## Inventaris & Referensi
- Spesifikasi OpenAPI: `apps/api/docs/openapi.yaml` (kontrak REST runs dan lainnya).
- Realtime SSE/WS: `apps/app/src/shared/api/sse.ts:64-156,356-434,497-571`.
- HTTP client (apps/app): `apps/app/src/shared/api/client.ts:20-27,116-154,228-234`.
- Supabase repos (apps/web): `apps/web/src/shared/api/client.ts:1-156,160-337,340-353`.
- Arsitektur & relasi: `docs/architecture/README.md:45-70`, `docs/architecture/RELATIONS.md:3-24`.

## 1) Generate OpenAPI Clients & Shared Types
- TypeScript:
  - Generate types via `openapi-typescript` → paket baru `packages/api-types`.
  - Generate client via `orval` (hooks/clients) atau templat axios/fetch → paket `packages/api-client`.
- Validasi Kontrak CI/CD:
  - Lint dan rules via `spectral` terhadap `openapi.yaml`.
  - `openapi-diff` membandingkan dengan versi sebelumnya (fail on breaking change).
  - Contract tests menggunakan mock server (Prism) untuk skenario start/continue/cancel/list.
- Version Locking:
  - Client version = SemVer + commit hash spec (e.g., `1.0.0+spec.<sha>`).
  - API header `x-api-version`; gating deploy jika versi tidak kompatibel.

## 2) Ekstraksi Facade Realtime/HTTP ke Paket Bersama
- Identifikasi duplikasi:
  - SSE/WS & Realtime manager di `apps/app` digunakan lintas skenario.
  - Pola HTTP client (retry, timeout, interceptors) di `apps/app` dan pengelolaan response di `apps/web`.
- Paket Bersama:
  - `packages/realtime`: `SSEClient`, `WebSocketClient`, `RealtimeClientManager`, hooks (React), event typing terpusat.
  - `packages/api-client`: HTTP wrapper (fetch/axios) dengan retry, timeout, error mapping.
  - `packages/api-types`: DTO/types hasil generate OpenAPI (shared lintas apps).
- Adapter Pattern:
  - `RealtimeAdapter` interface; `SSEAdapter` dan `WSAdapter` implementasi.
  - Facade memilih adapter via feature flag atau runtime check.
- Dokumentasi:
  - README penggunaan, contoh integrasi di `apps/app` & `apps/web`, guideline error/metrics.

## 3) Acceptance Tests untuk SLA/NFR
- Metrik yang diukur:
  - Streaming: T90 latency event < 2s; reconnect < 10s; reliability 99% selama 10 menit.
  - CRUD: p50 response < 300ms; konsistensi data per-tenant; failure rate insert < 1%.
  - Enqueue: enqueue < 50ms; durability (job tidak hilang pada restart worker).
- Test Suite:
  - `apps/app`: vitest untuk SSE parser/heartbeat/reconnect; e2e stream mock.
  - `apps/web`: vitest CRUD repos; Playwright e2e untuk chat/dokumen multi-tenant.
  - `apps/api`: integration untuk Redis ops (ioredis-mock) dan controller; e2e runs lifecycle.
- Load & Chaos:
  - k6 skrip untuk jalur streaming dan CRUD; injeksi network jitter/latency.
  - Chaos via Toxiproxy (SSE disconnect, Redis slow) untuk memverifikasi fallback.
- Monitoring & Alerting:
  - OpenTelemetry counters/timers; dashboard p95/p99; alerts pada pelanggaran SLA.

## 4) RACI & Kontak
- Buat `docs/references/raci.md`:
  - API Domain: Owner, Developers, QA, On-call; proses eskalasi (P1/P2/P3).
  - Data Domain: Data Engineer, Analyst, Data Steward; kebijakan RLS & audit.
  - Web Domain: Frontend Dev, UX, Product Owner; a11y & e2e coverage.
- Penjadwalan review kuartalan; update matriks dan kontak.

## Implementasi Setelah Persetujuan
1. Tambah paket `packages/api-types`, `packages/api-client`, `packages/realtime` dan konfigurasi build/transpile.
2. Konfigurasi CI/CD: spectral lint, openapi-diff, contract tests dengan mock server.
3. Migrasi penggunaan SSE/WS & HTTP ke facade bersama di `apps/app` dan `apps/web`.
4. Tambah acceptance tests sesuai matriks SLA/NFR; siapkan skrip k6 & chaos stubs.
5. Buat dokumen RACI dan tautkan dari `docs/README.md`.

Silakan konfirmasi agar kami mulai membuat paket, skrip CI, test suites, dan dokumen RACI sesuai rencana di atas.