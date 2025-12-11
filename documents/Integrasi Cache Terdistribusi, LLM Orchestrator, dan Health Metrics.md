## Integrasi Cache Terdistribusi (Redis/Upstash)
- Koneksi aman: gunakan env `UPSTASH_REDIS_REST_URL` dan `UPSTASH_REDIS_REST_TOKEN`; tambahkan validasi startup dan masking log.
- Client adapter: REST-based untuk Upstash; fallback ke `ioredis` bila tersedia (local/dev).
- TTL: parameterizable per route (default 5–30 detik untuk search), header `X-Cache: hit/miss` tetap.
- Fallback: jika cache tidak tersedia, lanjutkan jalur tanpa cache dan set header `X-Cache: unavailable`.
- Titik integrasi awal:
  - `apps/app/src/app/api/knowledge/search-cached/route.ts` dan `apps/app/src/app/api/knowledge/search/route.ts`
  - `apps/app/src/shared/knowledge.ts` (opsional untuk shared cache util)

## Penyatuan Layer Cache dengan @sba/kv/cache
- Buat adapter baru: `packages/kv/src/adapters/upstash.ts` mengimplementasikan interface `@sba/kv/cache` (CRUD dasar `get/set/del`, batch `mget/mset`, pipeline simulasi transaksi).
- API: metode menerima `tenantKey` + `scope` untuk namespacing; semua key diserialisasi aman.
- Batch & transaksi: gunakan batching REST (Upstash mendukung per-batch) dan fallback pipeline di `ioredis`.
- Logging & metrics: instrumentasi `cache.requests`, `cache.errors`, `cache.ttl.ms` via OTel.

## Integrasi LLM Nyata di Orchestrator
- Abstraksi provider: `ILLMProvider` dengan implementasi `OpenAIProvider`, `AnthropicProvider` (konfigurasikan via env `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`).
- Switching model: layer factory berdasarkan `LLM_PROVIDER` + `model` per-request.
- Circuit breaker & retry:
  - Retry: jitter backoff (exponential) dengan batas percobaan dan timeout.
  - Circuit breaker: buka saat error rate melebihi threshold dalam window; fallback ke provider lain atau response degenerate.
- Titik integrasi:
  - Orchestrator stream/token generation mengganti placeholder menjadi panggilan provider.
  - Tool call "knowledge_lookup" tetap seperti sekarang, tapi gunakan cache unified untuk hasil lookup.
- File target (perkiraan): `apps/api/src/orchestrator/*` dan `packages/integrations/src/llm/*`.

## Health Metrics Antrean
- Lag processing: histogram `queue.lag.ms` (p50/p95/p99) dihitung dari `now - job.timestamp` saat mulai memproses.
- Error ratio: counter per status + gauge ratio per queue; classification berdasarkan error type/tags.
- Throughput & kapasitas: `jobs.processed/sec`, `jobs.enqueued/sec`, concurrency vs backlog; expose sebagai Prometheus metrics.
- Autoscaling signals: metric agregat untuk HPA/queue scaler (mis. backlog/lag thresholds).
- Titik integrasi:
  - `apps/api/src/workers/render.worker.ts` (record duration/lag)
  - `apps/api/src/workers/WorkerHealthService.ts` (agregasi per-queue)
  - `apps/api/src/infrastructure/observability/OpenTelemetryConfig.ts` (register meters)

## Keamanan & Compliance
- Secrets tidak pernah di-log; validasi env saat boot; deny-start jika missing di prod.
- Rate limiting tetap aktif di knowledge API; RBAC tetap melalui wrapper yang ada.
- CSP/headers tidak berubah; hanya menambah observability header jika relevan.

## Testing
- Unit tests:
  - Adapter Upstash (`get/set/del`, batch, TTL, fallback) dengan mock HTTP.
  - LLM providers: mock HTTP dan retry/circuit breaker paths.
  - Worker metrics: simulasi BullMQ job timestamps dan status.
- Integration tests:
  - Knowledge routes: cache hit/miss/unavailable, TTL, RBAC.
  - Orchestrator end-to-end streaming dengan provider mock.
- E2E (opsional): verifikasi UI admin menunjukkan `X-Cache` dan metrik dasar.

## Dokumentasi
- API docs: update endpoint knowledge (`search`, `search-cached`) untuk parameter `limit`, TTL, headers cache; contoh respons.
- Operasional: cara mengisi env Upstash/Redis; playbook fallback; observability metrics baru.
- Orchestrator: panduan konfigurasi provider/model; kebijakan retry/CB.

## Rollout
- Feature-flag provider LLM dan cache terdistribusi; canary di staging.
- Monitoring awal: error rate cache/LLM, lag antrean, throughput.
- Recovery: fallback otomatis bila cache/LLM down; dokumentasikan prosedur.

Konfirmasi rencana ini, maka saya akan implementasi adapter cache, mengaitkan knowledge API ke cache terdistribusi, menambahkan provider LLM dengan circuit breaker, serta memperkaya metrics antrean beserta tests dan dokumen terkait.