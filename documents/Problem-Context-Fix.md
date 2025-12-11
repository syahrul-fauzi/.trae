# SBA-Agentic — Fokus Permasalahan & Konteks Perbaikan

## Ringkasan
- Tujuan: merangkum permasalahan inti yang menghambat go‑live, konteks teknisnya, dan rencana perbaikan yang jelas, modular, dan selaras dengan arsitektur bersih.

## Daftar Permasalahan Prioritas
- Duplikasi klien Supabase lintas lokasi (API, packages/supabase, packages/db, klien lokal di apps) → inkonsistensi env/tipe.
- Server menggunakan `NEXT_PUBLIC_*` env untuk Supabase (tidak aman) di API.
- WebSocket auth hanya decode payload JWT tanpa verifikasi signature.
- Tanpa Socket.IO Redis adapter → WS tidak siap scale‑out multi‑node.
- Rate limiting HTTP/WS tidak terdistribusi; mock limiter di apps.
- Cache in‑memory Map TTL per instans → tidak terdistribusi, tanpa LRU, berisiko inkonsistensi.
- ESLint konfigurasi ganda (flat vs legacy) dan versi tidak konsisten.
- Coverage exclude path salah; validasi env runtime belum fail‑fast.
- Boundary akses data belum disiplin; tipe Database tersebar.

## Detail Permasalahan & Perbaikan

### 1) Duplikasi Klien Supabase
- Lokasi: `apps/api/src/infrastructure/repositories/SupabaseClient.ts:7-9,40-50`, klien lokal di `apps/app/src/shared/lib/supabase.ts`, `apps/docs/shared/lib/supabase.ts`, paket `packages/supabase/*`, `packages/db/src/client.ts`.
- Dampak: perilaku/env/tipe tidak konsisten; risiko kebocoran konfigurasi.
- Akar Masalah: tidak ada sumber kebenaran tunggal untuk klien dan tipe.
- Perbaikan:
  - Konsolidasi klien di `packages/supabase` (`clients/client`, `clients/server`, `clients/node-admin`).
  - Satu sumber tipe `Database` di `packages/supabase/src/types`.
  - Hapus klien lokal di apps; migrasikan impor ke `@sba/supabase/*`.
- AC: 100% impor Supabase via paket; build analyzer bersih dari service key.

### 2) Server Membaca `NEXT_PUBLIC_*` Env
- Lokasi: `apps/api/src/infrastructure/repositories/SupabaseClient.ts:7-9`.
- Dampak: praktik tidak aman di server; potensi salah konfigurasi.
- Akar Masalah: fallback ke env publik untuk server.
- Perbaikan: hanya gunakan `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY|SUPABASE_SERVICE_KEY` pada server.
- AC: tidak ada referensi `NEXT_PUBLIC_*` di proses server.

### 3) WS Auth Tanpa Verifikasi Signature
- Lokasi: `apps/api/src/api/gateway/AgentStreamGateway.ts:115-118`.
- Dampak: token mudah dipalsukan; risiko akses tidak sah.
- Akar Masalah: hanya decode payload base64, tanpa verifikasi.
- Perbaikan: gunakan `JwtService`/middleware untuk handshake; verifikasi signature dan claims (tenantId/userId/exp).
- AC: handshake menolak token invalid; tracing menunjukkan verifikasi signature.

### 4) Tanpa Redis Adapter untuk Socket.IO
- Lokasi: modul WS API (gateway/module), tidak ada custom adapter.
- Dampak: WS hanya bekerja pada single node; tidak siap scale‑out.
- Akar Masalah: dependensi dan konfigurasi adapter belum diaktifkan.
- Perbaikan: pasang Socket.IO Redis adapter; tambahkan health/backpressure.
- AC: broadcast lintas instans terverifikasi via uji beban.

### 5) Rate Limiting Tidak Terdistribusi
- Lokasi: `apps/api/src/common/rate-limit.interceptor.ts`, `packages/kv/src/ratelimit.ts`, `apps/app/src/shared/lib/rate-limiter.ts`.
- Dampak: perlindungan banjir lemah; kebijakan tidak konsisten.
- Akar Masalah: in‑memory/mocks; tidak ada konsolidasi kebijakan.
- Perbaikan: limiter Redis/Upstash per tenant/IP/method pada HTTP; limiter event per user/tenant pada WS.
- AC: respon 429 konsisten; metrik limiter terlihat.

### 6) Cache In‑Memory Map TTL Lokal
- Lokasi: contoh TTL cache di apps; knowledge tool cache di API.
- Dampak: inkonsistensi lintas node; tanpa LRU/namespace; potensi memory bloat.
- Akar Masalah: implementasi sederhana per instans.
- Perbaikan: Redis/kv cache dengan TTL adaptif, namespace per‑tenant, invalidasi berbasis versi.
- AC: hit rate terukur; tidak ada bloat; cache konsisten lintas node.

### 7) ESLint Ganda & Versi Tidak Konsisten
- Lokasi: `eslint.config.js`, `eslint.config.cjs`, beberapa workspace memakai versi berbeda.
- Dampak: lint perilaku berbeda; developer friction.
- Akar Masalah: dua pendekatan (flat vs legacy) hidup bersamaan.
- Perbaikan: satu flat config v9 di root; sinkronisasi versi lint seluruh workspace; hapus config ganda.
- AC: lint konsisten; CI lint hijau.

### 8) Coverage Exclude Path Salah
- Lokasi: `vitest.config.ts:14-21` (telah diperbaiki ke `packages/**`).
- Dampak: laporan coverage menyesatkan.
- Akar Masalah: path salah tulis.
- Perbaikan: gunakan `packages/**`, `apps/app/src/shared/config/env.ts` untuk pengecualian.
- AC: coverage ≥ 80% relevan.

### 9) Boundary Akses Data Kurang Disiplin
- Lokasi: controllers dan layanan memanggil data langsung.
- Dampak: coupling tinggi; sulit diuji.
- Akar Masalah: belum ada pemisahan jelas use‑case vs repository.
- Perbaikan: controller tipis; use‑case orchestrasi; repository (Supabase/Prisma) sebagai akses tunggal.
- AC: akses data hanya via repository; unit test mudah.

### 10) Tipe Database Tersebar
- Lokasi: `packages/supabase/src/types`, `packages/db/src/types.ts`, dan lokal lainnya.
- Dampak: ketidakkonsistenan tipe; pemeliharaan sulit.
- Akar Masalah: tidak ada sumber tipe tunggal.
- Perbaikan: satu sumber tipe di `packages/supabase/src/types`; referensikan lintas apps.
- AC: seluruh konsumen memakai tipe tunggal.

## Rencana Tindakan Terkait (Ringkas)
- Konsolidasi Supabase (klien & tipe), migrasi impor, hapus klien lokal.
- Server env hygiene: hilangkan `NEXT_PUBLIC_*` dari server.
- WS: JWT guard + Redis adapter + limiter event.
- HTTP: limiter terdistribusi; standar 429.
- Cache: Redis/kv dengan TTL/namespace; invalidasi versi.
- Kualitas: ESLint v9 tunggal; coverage benar; CI gates untuk impor dan secrets.
- Boundary: repository pattern; use‑case modul; tipe tunggal.

## Verifikasi & Metrik Keberhasilan
- Keamanan: 0 kebocoran handshake; tidak ada service key di bundle client.
- Performa: p95 latency WS/HTTP sesuai target; cache hit rate ≥ 60% jalur knowledge.
- Kualitas: lint bersih; coverage ≥ 80%; CI hijau.
- Modularitas: seluruh akses data via repository; impor melalui packages.

## Referensi Kode
- `apps/api/src/infrastructure/repositories/SupabaseClient.ts:7-9,40-50`
- `apps/api/src/api/gateway/AgentStreamGateway.ts:115-118`
- `apps/api/src/app.ts:61-76`
- `vitest.config.ts:14-21`
- `packages/supabase/src/index.ts:1-5`
- `packages/supabase/src/clients/node-admin.ts`
