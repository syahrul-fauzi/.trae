## Tujuan & Lingkup
- Memigrasi penyimpanan internal (agent_runs, agent_steps, tool_calls, audit_logs, usage_metrics, system_health) dari akses Supabase ke Prisma dengan transaksi kuat.
- Menyusun dokumentasi kebijakan rate-limit (HTTP & WS) beserta best practices dan cara penyesuaian parameter.
- Menyediakan panduan migrasi langkah-demi-langkah (persiapan, konversi, penanganan data, testing/validasi, troubleshooting, checklist).
- Menjaga kompatibilitas dengan sistem yang ada (Supabase tetap untuk entitas ber-RLS/knowledge; Prisma untuk tabel layanan internal).

## Migrasi Database
- Inventarisasi & pemetaan entitas
  - Entitas: `agent_runs`, `agent_steps`, `tool_calls`, `audit_logs`, `usage_metrics`, `system_health`.
  - Pemetaan tipe: gunakan `String(uuid)`, `Json`, `DateTime`, relasi `AgentRun`→`AgentStep` dan `ToolCall`.
- Skema Prisma
  - Lokasi: `apps/api/prisma/schema.prisma` (sudah dibuat awal). Lengkapi indeks unik, foreign key, dan kolom yang diperlukan untuk agregasi.
  - Tambahkan indeks untuk kolom yang sering difilter (`tenantId`, `createdAt`, `status`).
- Prisma Migrate
  - Inisialisasi migrasi: generate dan review diff terhadap Postgres Supabase.
  - Jalur eksekusi: dev → staging → prod dengan gate dan rollback plan.
  - Seed opsional: health baseline, metrics demo.
- Kompatibilitas
  - Pertahankan dual-layer: Supabase untuk RLS/user/session/knowledge, Prisma untuk internal metadata & agregasi.
  - Defense in depth: tetap filter eksplisit `tenantId` di Prisma meskipun app-side menerapkan guard.
  - Tenant context: gunakan app-level tenant guard dan field `tenantId` (opsional DB-side `SET app.tenant_id` + policy bila diaktifkan).

## Wiring Repository ke Prisma
- Buat repository Prisma untuk operasi internal
  - `AgentRunsPrismaRepository`: create/update/get/aggregate runs.
  - `AgentStepsPrismaRepository`: append/list steps dengan relasi ke run.
  - `ToolCallsPrismaRepository`: catat hasil alat, durasi, sukses/gagal.
  - `AuditLogPrismaRepository`, `UsageMetricsPrismaRepository`, `SystemHealthPrismaRepository`.
- Orkestrasi Application
  - Update service (agent orchestration, tools, monitoring) agar memakai repository Prisma untuk operasi internal.
  - Transaksi: gunakan `prisma.$transaction` untuk run+steps+toolcalls atomik.
  - Error handling: mapping ke error domain, logging, retry jika perlu.

## Dokumentasi Kebijakan Rate-Limit
- Konfigurasi
  - Kunci: `tenant|method|path|ip` (HTTP), `ws:tenant:user:ip:event` (WS).
  - Parameter: `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX`, `WS_BROADCAST_MAX`, `WS_BROADCAST_WINDOW_MS`, `REDIS_URL`.
- Threshold & periode
  - Default HTTP: window 60s, max 120 req/key; WS event: window 1s, max 200 broadcast/key.
- Penanganan jika limit tercapai
  - HTTP: respons 429 dengan payload `{ code: 'RATE_LIMITED' }`, sertakan header `Retry-After` jika applicable.
  - WS: emit error dengan metadata `retryAfterMs` dan tidak memproses event.
- Penyesuaian parameter
  - Lingkungan: set env sesuai beban per-tenant; gunakan konfigurasi berbeda untuk staging/production.
- Best Practices
  - Pisahkan rate-limit per-tenant, per-user untuk keadilan multi-tenant.
  - Log dan telemetri untuk 429/WS throttling; dashboard alert jika terjadi spike.
  - Canary perubahan parameter; uji beban sebelum dinaikkan secara global.

## Panduan Migrasi (Langkah-Demi-Langkah)
- Persiapan lingkungan
  - Pastikan `DATABASE_URL` menunjuk ke Supabase Postgres, Prisma CLI terpasang, dan backup tersedia.
- Konversi skema
  - Terjemahkan SQL existing ke model Prisma (tipe/relasi/indeks), review `schema.prisma` dan jalankan migrate generate.
- Penanganan data
  - Migrasikan data existing dengan menjaga konsistensi ID dan `tenantId`; verifikasi jumlah baris dan integritas FK.
- Testing & Validasi
  - Unit/integrasi/e2e: validasi create/run/step/toolcall, audit & metrics; uji 429 HTTP/WS, JWT WS handshake.
  - Performa: uji beban WS & query agregasi dengan indeks.
- Troubleshooting umum
  - Konflik migrasi: rebase migration, cek tipe kolom mismatch.
  - Nullability: sesuaikan default/optional di Prisma.
  - Indeks lambat: tambah indeks komposit, analisa query plan.
- Checklist migrasi
  - `schema.prisma` lengkap, migrasi sukses di staging, repository Prisma aktif, test lulus, rollback plan tersedia, dokumentasi diperbarui.

## Quality Assurance
- Tidak ada regresi
  - Jalankan seluruh test suite (unit/integrasi/e2e) untuk jalur run/steps/calls/audit/metrics.
- Performa
  - Verifikasi latensi WS (adapter Redis aktif), limiter dan throttling bekerja; query Prisma terindeks.
- Kompatibilitas
  - Validasi integrasi dengan Supabase functions (tetap berjalan untuk knowledge/auth/RLS).
- Verifikasi dokumentasi
  - Cocokkan dokumen rate-limit dan panduan migrasi dengan implementasi aktual; perbarui jika ada deviasi.

## Artefak & Lokasi File
- Prisma schema: `apps/api/prisma/schema.prisma` (lengkapi indeks/relasi).
- Repository Prisma baru: `apps/api/src/infrastructure/database/*Repository.ts` (runs/steps/toolcalls/audit/metrics/health).
- Dokumentasi rate-limit: `docs/development/rate-limit-policy.md`.
- Panduan migrasi Prisma: `docs/development/prisma-migration-guide.md`.

## Timeline & Deliverables (Singkat)
- Minggu 1–2: Finalisasi schema + migrasi staging, implementasi repository Prisma, uji integrasi.
- Minggu 3: Performa & beban, tuning indeks/parameter rate-limit, dokumentasi lengkap.
- Minggu 4: Go-Live checks, canary, rollback plan, dokumentasi QA.
