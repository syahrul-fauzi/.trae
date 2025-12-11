# SBA-Agentic — Issue & Task Plan Go‑Live (Arsitektur Bersih)

## 1) Summary Context & Problem Statement
- Supabase client dan tipe tersebar (API, packages/supabase, packages/db, klien lokal di apps) → sumber kebenaran ganda, konfigurasi env tidak konsisten.
- Server/API terkadang membaca `NEXT_PUBLIC_*` env untuk Supabase → risiko keamanan di produksi.
- WebSocket auth hanya decode payload JWT (tanpa verifikasi signature) dan belum ada rate limiting event → rawan penyalahgunaan.
- Rate limiting HTTP masih in‑memory (tidak terdistribusi), cache in‑memory sederhana (tanpa LRU/namespace, tidak lintas instans).
- Kualitas kode tidak seragam (dua konfigurasi ESLint, versi berbeda, coverage exclude path perlu perbaikan).
- Performa/skalabilitas: belum ada Socket.IO Redis adapter untuk multi‑node, belum ada circuit breaker RPC/fungsi edge, pencarian pengetahuan perlu pgvector + reranker.

## 2) Goals & Non‑Goals
- Goals:
  - Konsolidasi data layer: satu sumber klien Supabase; `packages/db` menjadi paket Prisma terpusat.
  - Keamanan siap produksi: WS JWT guard, rate limiting HTTP/WS, CORS ketat, env validation.
  - Skalabilitas & performa: Redis adapter WS, Redis/kv cache, pgvector + reranker, circuit breaker.
  - Kualitas & CI/CD: ESLint v9 tunggal, Prettier, CODEOWNERS, coverage 80%+, observabilitas OTel dan SLO.
- Non‑Goals:
  - Mengubah model bisnis atau UI besar‑besaran; fokus pada fondasi teknis untuk go‑live.

## 3) Architecture Strategy (Dual‑Layer Data)
- Supabase (UI & Server): auth, RLS, storage, knowledge (FTS/pgvector), edge functions.
- Prisma (Server): tabel layanan internal dan transaksi (agent_runs, agent_steps, tool_calls, audit_logs, usage_metrics, system_health).
- Boundary:
  - Supabase untuk data multi‑tenant user‑facing.
  - Prisma untuk operasi internal, agregasi, idempotensi, dan relasi kompleks.

## 4) Scope & Deliverables
- Konsolidasi Supabase: klien SSR/Browser/Node‑Admin di `packages/supabase`, tipe `Database` tunggal, migrasi impor di seluruh apps.
- Paket Prisma terpusat: `packages/db` mengekspor PrismaClient, repositories, dan tenant guard.
- Keamanan WS/HTTP: JWT verifikasi handshake, Redis adapter WS, limiter event dan HTTP terdistribusi.
- Cache & Query: Redis/kv cache, pgvector + reranker, indeks dan kolom minimal, circuit breaker RPC/edge.
- Observabilitas: tracing OTel end‑to‑end, dashboard SLO, alert.
- Kualitas Kode & CI/CD: ESLint v9 tunggal, Prettier, CODEOWNERS, coverage 80%+, pipeline CI konsisten.

## 5) Workstreams & Task Breakdown (Acceptance Criteria)
- A. Konsolidasi Supabase
  - Tugas: Migrasi semua impor ke `@sba/supabase/*` (`clients/client`, `clients/server`, `clients/node-admin`).
  - Tugas: Pindahkan tipe DB ke `packages/supabase/types`; hapus tipe duplikasi.
  - Tugas: Hapus klien lokal duplikat di `apps/app` dan `apps/docs`.
  - AC:
    - Tidak ada impor langsung `@supabase/supabase-js` di apps (kecuali di paket supabase).
    - Server tidak menggunakan `NEXT_PUBLIC_*` env.
    - Build & test lulus tanpa regresi.
- B. `packages/db` → Prisma paket terpusat
  - Tugas: Buat `packages/db/src/client.ts` (singleton `PrismaClient`).
  - Tugas: Buat `packages/db/src/repositories/*` untuk models Prisma (runs, steps, calls, audit, metrics, health).
  - Tugas: Implement `tenantGuard` (`SET app.tenant_id` atau filter `tenantId` konsisten).
  - AC:
    - API hanya mengakses tabel internal via `@sba/db` repositories.
    - Query Prisma selalu terlindungi oleh tenant guard.
- C. Keamanan & WebSocket
  - Tugas: Implement verifikasi JWT pada handshake WS (signature check, claims tenant/user).
  - Tugas: Pasang Socket.IO Redis adapter; health checks dan backpressure basic.
  - Tugas: Event limiter per user/tenant; error 429 atau drop.
  - AC:
    - Handshake menolak token invalid; logs/tracing terlihat.
    - Broadcast berjalan lintas instans; beban uji menunjukkan stabil.
- D. Rate Limiting & Cache
  - Tugas: HTTP limiter Redis/Upstash per tenant/IP/method.
  - Tugas: Redis/kv cache dengan TTL adaptif dan namespace per‑tenant, invalidasi versi.
  - AC:
    - 429 diberikan pada pola banjir; cache hit rate tercapai sesuai target.
- E. Knowledge & Query Optimizations
  - Tugas: Aktifkan pgvector + tambahkan reranker; FTS sebagai fallback.
  - Tugas: Audit indeks & pilih kolom minimal; tambahkan circuit breaker RPC/edge.
  - AC:
    - Latensi median pencarian turun; relevansi meningkat.
    - Error rate RPC terkendali dengan breaker.
- F. Observabilitas & Operasional
  - Tugas: Tracing OTel pada jalur tool execution, DB, queue; korelasi `tenantId`/`jobId`.
  - Tugas: Dashboard Grafana/Datadog SLO dan alert tersusun.
  - AC:
    - Traces lengkap end‑to‑end; alert bekerja pada threshold.
- G. Kualitas Kode & CI/CD
  - Tugas: ESLint v9 tunggal di root; sinkronisasi versi lint seluruh workspace; hapus config ganda.
  - Tugas: Prettier root; jalankan via turbo.
  - Tugas: `.github/CODEOWNERS` dan coverage 80%+ (exclude path benar).
  - AC:
    - CI lint/test/coverage lulus; kepemilikan kode berjalan.

## 6) Timeline & Milestones (Indicative)
- Minggu 1: Konsolidasi Supabase + repurpose `packages/db` → Prisma, hapus klien lokal duplikat.
- Minggu 2: WS JWT guard + Redis adapter, limiter HTTP/WS, cache Redis dasar.
- Minggu 3: pgvector + reranker, optimasi query, circuit breaker RPC/edge.
- Minggu 4: OTel tracing lengkap, dashboard SLO, ESLint v9 tunggal, CODEOWNERS; uji beban & canary.

## 7) Risks & Mitigation
- Salah konfigurasi tenant (leak data): enforce `set_tenant_context` di Supabase + filter `tenantId`/RLS di Prisma schema.
- WS bottleneck: Redis adapter, limiter, backpressure, batching.
- Duplikasi tipe/klien: lint rules melarang impor langsung; audit impor di CI.
- Env tidak konsisten: validasi runtime fail‑fast.

## 8) Dependencies & Assumptions
- Redis/Upstash tersedia untuk adapter WS, limiter, dan cache.
- Supabase Postgres mendukung pgvector; edge functions dilindungi dengan canary.
- CI memiliki runner dengan Node 18+ dan pnpm workspaces.

## 9) Rollout & Verification Plan
- Canary deploy untuk fungsi edge dan WS adapter.
- Uji beban HTTP/WS; target SLO tercapai (p95 latensi, error rate < 1%).
- Observasi tracing & logs; rollback plan siap.

## 10) Success Metrics
- Konsistensi impor: 100% akses Supabase/Prisma via packages.
- Keamanan: 0 kebocoran handshake, rate limit efektif, CORS ketat.
- Performa: p95 WS broadcast stabil; cache hit rate > 60% di jalur knowledge.
- Kualitas: coverage ≥ 80%, lint bersih, CI hijau.

## 11) Appendix — Referensi File
- Supabase admin client: `packages/supabase/src/clients/node-admin.ts`
- Konsumsi API: `apps/api/src/infrastructure/repositories/SupabaseClient.ts`
- Prisma schema: `apps/api/prisma/schema.prisma`
- Tenant guard HTTP: `apps/api/src/app.ts:61-76`
- Tools controller: `apps/api/src/api/tools.controller.ts`
 
## 12) Turunan Task — packages/supabase (Implementasi & Prinsip Terbaik)
- Struktur paket
  - `src/clients/client.ts`: `createBrowserClient<Database>(NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)`; `auth.persistSession: true`; hardening cookie untuk browser bila perlu.
  - `src/clients/server.ts`: `createServerClient<Database>(cookies)`; refresh token otomatis; cookie flags `HttpOnly`, `Secure`, `SameSite=strict`.
  - `src/clients/node-admin.ts`: `createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SERVICE_KEY)`; `persistSession: false`; header identitas layanan.
  - `src/types`: satu sumber tipe `Database`, `Tables`, helper typing; generate dari supabase schema bila tersedia.
  - `src/queries`, `src/mutations` (opsional): operasi data umum yang pure, tidak memuat logika bisnis.
- Env & Keamanan
  - Server hanya membaca `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SERVICE_KEY`; tidak pernah menggunakan `NEXT_PUBLIC_*` di server.
  - Client/SSR hanya menggunakan `NEXT_PUBLIC_*` vars; verifikasi build agar service key tidak ikut bundling.
  - Helper `setTenantContext(client, tenantId)` memanggil RPC sebelum query multi-tenant.
  - Validasi input/output di boundary API (Zod) dan hindari logic stateful di data layer.
- Testing & Kualitas
  - Unit test untuk client factory dan helpers (tenant context, error surfaces).
  - Integration test dengan supabase local test harness atau MSW untuk network ops.
  - Lint rule melarang impor langsung `@supabase/supabase-js` di apps selain melalui paket ini.
  - Coverage minimal 80% untuk modul kritis (clients/*, types, helpers).
- Acceptance Criteria
  - Semua apps mengimpor Supabase melalui `@sba/supabase/*` sesuai konteks (client/server/node-admin).
  - Tidak ada service key di bundle client; build analyzer menunjukkan bersih.
  - `setTenantContext` dipanggil konsisten di server sebelum operasi multi-tenant.

## 13) Turunan Task — packages/db (Prisma, Implementasi & Prinsip Terbaik)
- Struktur paket
  - `prisma/schema.prisma`: model layanan internal (agent_runs, agent_steps, tool_calls, audit_logs, usage_metrics, system_health); opsi schema `service` terpisah dari RLS tabel.
  - `src/client.ts`: singleton `PrismaClient` dengan pengaturan log (query warn-slow), retry sederhana pada koneksi.
  - `src/tenant.ts`: `setTenant(prisma, tenantId)` → `SET app.tenant_id = $1` saat memulai request; decorator untuk enforce guard di repository.
  - `src/repositories/*`: per model, expose metode bermakna (createRun, appendStep, logToolCall, writeAudit, upsertMetrics, listRunsByTenant, dsb.).
- Multi-tenant & Keamanan
  - Defense in depth: filter eksplisit `tenantId` di setiap query repository.
  - Opsional RLS untuk schema Prisma menggunakan `current_setting('app.tenant_id')` jika ingin proteksi DB-side; wajib `SET app.tenant_id` tiap request.
  - Idempotensi operasi kritis menggunakan `idempotencyKey` unik; unique index di DB.
- Transaksi & Performa
  - Gunakan `prisma.$transaction` untuk rangkaian write; batasi payload; pilih kolom minimal.
  - Indeks sesuai pola akses (tenantId, status, timestamps); audit `EXPLAIN ANALYZE` untuk query berat.
- Observabilitas
  - Integrasi OpenTelemetry spans di boundary repository; korelasi `tenantId`, `runId`, `jobId`.
 - Log slow query (p95) dan metrik throughput per metode repository.
- Testing & Kualitas
  - Unit test repository dengan prisma test db; seed minimal.
  - Contract test untuk idempotensi dan transaksi; simulasi konflik.
  - Coverage minimal 80% untuk repos critical (runs/steps/calls/audit/metrics).
- Acceptance Criteria
  - API mengakses tabel internal hanya via `@sba/db` repositories.
  - Guard tenant aktif (SET + filter) dan terverifikasi dalam test.
  - Operasi idempotent stabil dan unik secara schema.

## 14) Detail Task Breakdown — packages/supabase
- Implementasi
  - BU-PS-01: Konsolidasi ekspor klien (`client`, `server`, `node-admin`) dan `types` di `packages/supabase/src/index.ts`.
  - BU-PS-02: Tambah helper `setTenantContext(client, tenantId)` dan dokumentasi pemakaian.
  - BU-PS-03: Audit semua apps; migrasikan impor ke `@sba/supabase/*` sesuai konteks (SSR/Browser/Node-admin).
  - BU-PS-04: Hapus klien lokal duplikat di `apps/app` dan `apps/docs`; rujuk paket.
  - BU-PS-05: Lint rule untuk melarang impor langsung `@supabase/supabase-js` di apps.
  - BU-PS-06: Unit/integration tests untuk factories dan helpers; MSW untuk mock network.
  - BU-PS-07: Env validation: fail‑fast bila `SUPABASE_URL`/keys hilang (server) atau `NEXT_PUBLIC_*` (client).
- Prinsip Terbaik
  - Pemisahan tegas server vs client env; tidak ada service key di bundle client.
  - Data layer tipis, tanpa logika bisnis; validasi di boundary API menggunakan Zod.
  - Dokumentasi singkat penggunaan per konteks (SSR/Browser/Node-admin).
- Definition of Done
  - 100% impor Supabase via paket; build analyzer bersih dari service key.
  - Test coverage ≥ 80% pada modul kritis; lint rule aktif di CI.

### Contoh API
- `packages/supabase/src/clients/node-admin.ts`
  - `createAdminClient(url?: string, serviceKey?: string): SupabaseClient<Database>`
  - `setTenantContext(client: SupabaseClient<Database>, tenantId: string): Promise<any>`
- Penggunaan di server API:
  - `const supa = createAdminClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)`
  - `await setTenantContext(supa, tenantId)` sebelum query multi‑tenant.

## 15) Detail Task Breakdown — packages/db
- Implementasi
  - DB-PR-01: Buat `src/client.ts` (singleton `PrismaClient`) dengan konfigurasi log dan retry.
  - DB-PR-02: Buat `src/tenant.ts` (`setTenant(prisma, tenantId)`) dan dekorator repository.
  - DB-PR-03: Implement `src/repositories/*` untuk runs, steps, calls, audit, metrics, health.
  - DB-PR-04: Tambah idempotensi (`idempotencyKey`) & unique index pada operasi kritis.
  - DB-PR-05: Tambah tracing OpenTelemetry span di boundary repository.
  - DB-PR-06: Seed minimal dan testing (unit + transaksi + konflik/idempotensi).
  - DB-PR-07: Migrasi akses API ke `@sba/db` repositories; larang akses prisma langsung di controller.
- Prinsip Terbaik
  - Defense in depth: `SET app.tenant_id` + filter eksplisit `tenantId` pada semua query.
  - Transaksi untuk rangkaian write; pilih kolom minimal; indeks sesuai pola akses.
  - Observabilitas query; slow query log di atas p95.
- Definition of Done
  - Akses tabel internal hanya via repositories; guard tenant teruji.
  - Test coverage ≥ 80% untuk repos kritis; lint/test hijau di CI.

### Contoh API Repository
- `packages/db/src/repositories/agentRuns.ts`
  - `createRun(prisma, data: { tenantId; userId; prompt; options? }): Promise<AgentRun>`
  - `completeRun(prisma, runId: string, result: Json, durationMs: number): Promise<void>`
  - `listRunsByTenant(prisma, tenantId: string, filter?): Promise<AgentRun[]>`
- `packages/db/src/tenant.ts`
  - `setTenant(prisma, tenantId: string): Promise<void>` → `prisma.$executeRaw('SET app.tenant_id = $1', tenantId)`

## 16) CI/CD & Integrasi
- Lint/Test
  - Satu ESLint v9 flat config di root; semua workspace sinkron versi.
  - Vitest coverage threshold global; exclude path benar (`packages/**`).
  - Prettier via turbo; format sebelum commit.
- Gate & Rules
  - CI job melarang impor langsung `@supabase/supabase-js` di apps (regex rule).
  - CI job memastikan tidak ada `SUPABASE_SERVICE_*` terselip di bundle client (analyzer).
- Release
  - Canary deploy untuk edge functions/WS adapter; rollback plan.
  - Dashboard SLO aktif; alert pada error rate dan p95 latensi.

## 17) Migration Checklist
- Apps (web/app/docs)
  - Ganti semua impor ke `@sba/supabase/*` (client/server sesuai kebutuhan).
  - Hapus file klien lokal Supabase; sesuaikan env `NEXT_PUBLIC_*`.
  - Verifikasi tidak ada service key di bundle (analyzer).
- API
  - Pakai `@sba/supabase/clients/node-admin`; panggil `setTenantContext` per request/operasi multi‑tenant.
  - Pindahkan akses data internal ke `@sba/db` repositories.
  - Tambahkan WS JWT guard, Redis adapter, rate limit HTTP/WS.
- DB
  - Terapkan indeks sesuai pola akses; siapkan unique index untuk `idempotencyKey`.
  - Opsional: aktifkan kebijakan RLS DB‑side untuk schema Prisma + `SET app.tenant_id`.

## 18) Acceptance per Milestone
- M1 (Konsolidasi Data Layer)
  - Semua impor Supabase via paket; `packages/db` tersedia dan dipakai API.
- M2 (Keamanan & WS)
  - JWT handshake valid; Redis adapter aktif; limiter terdistribusi berjalan.
- M3 (Cache & Knowledge)
  - Redis cache aktif; pgvector + reranker meningkatkan relevansi; circuit breaker terpasang.
- M4 (Observabilitas & Quality)
  - Tracing OTel lengkap; SLO dashboard; ESLint v9 tunggal; CODEOWNERS; CI hijau.
