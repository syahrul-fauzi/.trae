# Patch Komprehensif: Xref, Redis Limiter/Cache, dan Penyelarasan Test Suite

## 1) Pengisian `workspace/_xref.md`
- Tujuan:
  - Menjadi peta modul terstruktur dengan referensi file path lengkap untuk controller, service, registry, workers, adapters, dan docs.
  - Mempermudah onboarding, navigasi, dan code review lintas monorepo.
- Konten & Format:
  1. Ringkasan arsitektur (apps/*, packages/*) dan peran masing‑masing direktori.
  2. Peta modul:
     - API Controllers: masing‑masing nama + path (mis. `apps/api/src/api/tools.controller.ts:27-63`), dependensi utama.
     - Orchestrator/Registry/Adapters: path + deskripsi singkat + skema Zod.
     - Workers (BullMQ): nama worker + path + queue provider.
     - Data Layer: Supabase client admin + tenant RPC + Prisma ops internal (path + env).
     - Web UI: entry points, shared components, e2e tests.
     - Observabilitas: OTel setup, exporters, dashboards.
     - OpenAPI: lokasi spesifikasi + cara validasi.
  3. Diagram ASCII alur data.
  4. Daftar endpoint utama dan kontrak (link ke OpenAPI).
- Auto‑update via CI/CD:
  - Tambah job CI `docs:xref:generate` (script Node/TS) yang memindai direktori dan mengisi ulang tabel referensi (menggunakan glob + metadata komentar kode bila ada).
  - Trigger pada perubahan file di `apps/api/**` dan `packages/**`.
  - Lint dokumen (markdownlint) dan commit sebagai part of PR (no direct push to main).

## 2) Implementasi Limiter Terdistribusi & Cache Redis
- Tujuan:
  - Standarisasi limiter (HTTP/WS) dan cache untuk tools/knowledge agar konsisten lintas instans.
- Desain Teknis:
  - Konfigurasi Redis:
    - Env: `REDIS_URL`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` (fallback ke ioredis lokal bila Upstash tidak tersedia).
    - Wrapper util di paket bersama (mis. `packages/kv`) untuk `client` dan fungsi helper.
  - Limiter Terdistribusi:
    - Implementasi fixed/sliding window per tenant/IP/method/event (HTTP & WS), berbasis `@upstash/ratelimit` atau ioredis script.
    - Keying: `rl:http:{tenant}:{ip}:{method}:{route}` dan `rl:ws:{tenant}:{user}:{event}`.
    - Respons standar 429 + telemetry counter.
  - Cache Konsisten:
    - Interface: `get/set` dengan TTL, namespace per tenant: `cache:{tenant}:{resource}:{key}`.
    - Invalidasi berbasis versi (opsional) untuk knowledge render.
    - Integrasi di Knowledge tool (`apps/api/src/tools/KnowledgeToolSupabase.ts`) dan jalur tools berbiaya.
- Dokumentasi penggunaan & best practices:
  - File docs baru: `docs/REDIS-LIMITER-CACHE.md` mencakup env, contoh pemakaian, pola invalidasi, dan keamanan.

## 3) Penyelarasan Test Suite
- WS Lifecycle:
  - `beforeAll`: bootstrap Nest app + `await app.listen(0)`, ambil port via `app.getHttpServer().address().port`.
  - `afterAll`: clean shutdown `await app.close()`, pastikan socket disconnect dan adapter torn‑down; tangani `EADDRINUSE` fallback port.
  - Expectations: selaraskan pesan error/unauth sesuai gateway (atau gunakan matcher yang toleran terhadap engine.io message).
- Legacy Endpoint Bridge:
  - Tambah endpoint kompatibilitas (`POST /api/tools/execute` baca `toolName` dari body) dan test bridge yang mengarahkan ke jalur registry.
  - Sesuaikan test lama yang mengakses `/api/tools/*` agar memakai controller Nest atau redirect Express.
- OpenAPI Strict:
  - Pastikan test membaca `apps/api/docs/openapi.yaml` dengan path deterministik (`__dirname` based) dan regex toleran.
  - Perketat spesifikasi: parameter, response schema untuk tools/health, dan daftarkan semua endpoint utama.
- Target & Kualitas:
  - Hijau penuh; coverage ≥ 80% pada file yang dimodifikasi; edge cases (null/undefined/empty, boundary values) ditambahkan pada schema/WS/tools.

## 4) Branching & Proses Merge
- Branch:
  - Buat branch fitur: `feat/xref-redis-limiter-cache-tests-sync`.
- Dokumentasi Perubahan:
  - Update `.github/PULL_REQUEST_TEMPLATE.md` otomatis terisi: daftar perubahan, coverage sebelum/sesudah, catatan reviewer, checklist verifikasi.
  - Tambah `CHANGELOG.md` entry pada `Unreleased` untuk patch ini.
- Code Review:
  - CODEOWNERS: domain API/WS/Data layer/Docs me‑review PR.
  - CI gates: lint/type-check/test:coverage/build; analyzer bunlde (no secrets in client bundle).
- Kompatibilitas Env:
  - Dev: Redis lokal atau Upstash dev config.
  - Staging/Prod: Redis managed (HA) dengan limits yang lebih ketat; berbeda rate‑limit kuota per tier.

## 5) Risiko & Mitigasi
- Risiko: konflik test WS port.
  - Mitigasi: dynamic port + fallback, proper teardown.
- Risiko: rate limiting memblokir alur penting.
  - Mitigasi: whitelist endpoints admin/health; telemetri + penyesuaian kuota per tenant.
- Risiko: invalidasi cache salah.
  - Mitigasi: versi cache + TTL konservatif; audit invalidasi.

## 6) Acceptance Criteria
- `workspace/_xref.md` berisi peta modul lengkap dan CI job auto‑update aktif.
- Limiter dan cache Redis tersedia dan dipakai di tools/knowledge; dokumentasi best practices tersaji.
- Test suite hijau; coverage ≥ 80%; WS lifecycle clean; legacy bridge berfungsi; OpenAPI valid.

## 7) Timeline (Indicative)
- Minggu 1: Isi xref + CI job; modul Redis wrapper; integrasi limiter & cache pada jalur knowledge/tools (subset);
- Minggu 2: Penyelarasan test WS lifecycle, legacy bridge, OpenAPI strict; tambah edge cases; optimisasi kecil;
- Minggu 3: Review & koreksi; penguatan observabilitas limiter/cache; finalisasi dokumentasi & merge.

## 8) Output & Artefak
- Patch (branch terpisah) dengan:
  - `workspace/_xref.md` terisi, script generator di `scripts/xref-generate.ts`, CI job `.github/workflows/docs-xref.yml`.
  - Redis limiter/cache wrapper (packages/kv atau modul baru), integrasi di Knowledge/tool.
  - Test updates: WS lifecycle, legacy endpoint bridge, OpenAPI strict + edge cases.
  - Docs: `docs/REDIS-LIMITER-CACHE.md`, update PR template & changelog.

Silakan konfirmasi rencana ini; setelah itu saya mulai implementasi pada branch terpisah, menulis patch lengkap, menjalankan lint/type-check/test:coverage, dan menyiapkan PR untuk review.