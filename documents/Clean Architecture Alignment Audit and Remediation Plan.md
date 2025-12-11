## Tujuan
- Menutup gap antara ROADMAP_GO_LIVE.md dan implementasi aktual, dengan fokus pada keamanan, skalabilitas, kepatuhan Clean Architecture, dan kesiapan Go-Live.
- Menggunakan prinsip Priority Matrix untuk menyelesaikan blocker terlebih dahulu, lalu risiko tinggi, kemudian perbaikan lanjutan.

## Perubahan Prioritas (Blocker)
- Hardening env server (hilangkan `NEXT_PUBLIC_*` pada server):
  - Perbaiki fallback di `packages/supabase/src/clients/node-admin.ts:9` dan `apps/api/src/workers/agent-events-consumer.ts:53` agar hanya memakai `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SERVICE_KEY`.
  - Pastikan validasi env ketat via `apps/api/src/config/env.ts:23-31` dan audit referensi `NEXT_PUBLIC_*` di server routes.
- Rate limiting terdistribusi (HTTP & WS):
  - Ganti stub `apps/api/src/__stubs__/kv-ratelimit.ts` dengan implementasi Upstash/Redis yang nyata, dan integrasikan di `apps/api/src/common/rate-limit.interceptor.ts:32-39` serta panggilan limiter di `apps/api/src/api/gateway/AgentStreamGateway.ts:338-356,438-456,530-547,629-647`.
  - Tambahkan konfigurasi per-tenant/IP/method dengan kode status 429 dan header retry.
- Konsistensi data layer (Prisma vs Supabase):
  - Tambahkan `apps/api/prisma/schema.prisma` untuk tabel internal: `agent_runs`, `agent_steps`, `tool_calls`, `audit_logs`, `usage_metrics`, `system_health` sesuai roadmap, lalu wire repository internal ke Prisma untuk transaksi/agregasi.
  - Pertahankan Supabase untuk entitas ber-RLS/knowledge; tegaskan batas layanan (Supabase untuk user/session/knowledge, Prisma untuk operasi internal).
- Deprecate `packages/db` sepenuhnya:
  - Hapus alias `@sba/db` dari `tsconfig.json:50`, migrasikan fungsi yang diperlukan ke `@sba/supabase/*`, lalu tandai package untuk removal setelah migrasi aman.

## Perubahan Risiko Tinggi (Segera Setelah Blocker)
- Cache terdistribusi (Redis/kv):
  - Ganti Map in-memory di `apps/api/src/api/gateway/AgentStreamGateway.ts:107-110`, `apps/api/src/application/session/SessionService.ts:78`, `apps/api/src/application/tenant/TenantService.ts:100` dengan helper cache standar (TTL, namespace per-tenant, invalidasi versi).
- WS backpressure & broadcast hygiene:
  - Tambah mekanisme backpressure, throttling broadcast per-tenant/user, dan queue ringan untuk event ber-volume tinggi.
- ESLint konsolidasi & coverage:
  - Konsolidasikan ke satu flat config v9 di root (sinkronkan seluruh workspace), pastikan threshold coverage global tetap (`vitest.config.ts:5-16`) dan agregasi laporan CI konsisten.
- CODEOWNERS:
  - Tambah `.github/CODEOWNERS` untuk kepemilikan direktori (API, packages/supabase, integrations, ui, docs).

## Implementasi Teknis (Ringkas)
- Env & keamanan:
  - Perkuat JWT handshake (sudah ada verifikasi signature di `apps/api/src/api/gateway/AgentStreamGateway.ts:153-167`), tambahkan rotasi secret dan audit konfigurasi.
  - Perketat CORS allowlist (`apps/api/src/app.ts:29-41`) dengan sumber konfigurasi tenant.
- Prisma:
  - Definisikan model minimal untuk `agent_runs/steps/tool_calls/audit_logs/usage_metrics/system_health` dan buat migrasi awal; integrasikan di `apps/api/src/infrastructure/db/prismaClient.ts` dan repository aplikasi.
- Supabase:
  - Pastikan `set_tenant_context` dipanggil konsisten sebelum query multi-tenant (`packages/supabase/src/clients/node-admin.ts:21-27`, dipakai di repo seperti `apps/api/src/infrastructure/repositories/AgentRunsRepository.ts:4-9`).
- Rate limiting:
  - Terapkan key skema: `tenant|ip|method|path` untuk HTTP dan `ws:tenant:user:ip:event` untuk WS dengan Upstash/Redis; tambahkan header metadata limit, retryAfter.
- Cache:
  - Implementasi helper cache dengan namespace per-tenant, TTL adaptif, dan invalidasi.

## Pengujian & Verifikasi
- E2E: uji 429 HTTP & WS rate limit, JWT handshake WS (valid/invalid), cache hit/miss & invalidasi.
- Integrasi: verifikasi `set_tenant_context` pada Supabase, transaksi Prisma dan agregasi internal.
- Performa: uji beban WS + broadcast; ukur latensi dan throughput dengan Redis adapter aktif.
- Coverage: pastikan threshold global (80/75/70/80) tercapai dan laporan CI terpublikasi.

## Risiko & Mitigasi
- Migrasi skema Prisma: gunakan migrasi bertahap, feature flag untuk path penyimpanan internal, dan audit indeks.
- Perubahan caching: release bertahap dengan fallback in-memory, canary pada node terbatas.
- Env ketat: fail-fast pada startup bila variabel wajib tidak ada; tambahkan dokumentasi dan checklist.

## Artefak yang Dihasilkan
- `apps/api/prisma/schema.prisma` + migrasi.
- Pembaruan di klien Supabase & worker untuk env server-only.
- Implementasi rate limiter Redis dan helper cache standar.
- Konsolidasi `eslint.config.*` & `.github/CODEOWNERS`.

## Bukti Kesenjangan Saat Ini (Rujukan Singkat)
- Fallback `NEXT_PUBLIC_*` di server: `packages/supabase/src/clients/node-admin.ts:9`, `apps/api/src/workers/agent-events-consumer.ts:53`.
- Rate limit stub: `apps/api/src/__stubs__/kv-ratelimit.ts`, interceptor: `apps/api/src/common/rate-limit.interceptor.ts:32-39`.
- Prisma stub & tanpa schema: `apps/api/src/infrastructure/database/PrismaService.ts:1-116`, tidak ada `schema.prisma`.
- Cache in-memory: `AgentStreamGateway.ts:107-110`, `SessionService.ts:78`, `TenantService.ts:100`.
- pgvector ada (migrasi), JWT verify WS ada, Redis adapter WS ada, tracing/logging ada (parsial).

## Kriteria Selesai
- Tidak ada referensi `NEXT_PUBLIC_*` di code server.
- 429 rate limit aktif (HTTP/WS) dengan Redis; log & metrik tersedia.
- Prisma schema internal aktif atau keputusan arsitektur dikunci (dual-layer jalan atau Supabase-only revisi ADR).
- Cache terdistribusi menggantikan Map; WS backpressure aktif.
- ESLint konsolidasi & CODEOWNERS tersedia; coverage memenuhi ambang batas.
