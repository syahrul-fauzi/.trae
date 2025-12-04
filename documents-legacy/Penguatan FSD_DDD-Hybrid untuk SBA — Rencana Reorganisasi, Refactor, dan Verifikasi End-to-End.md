## Tujuan
- Melanjutkan penguatan SBA dengan FSD/DDD-hybrid yang konsisten, meningkatkan kualitas, keamanan, observability, dan otonomi sistem.
- Memverifikasi end-to-end bahwa semua komponen bekerja sesuai spesifikasi, bebas bug, dan siap operasi berkelanjutan.

## Ruang Lingkup
- Orchestrator (application layer + domain services)
- SDK (kontrak Zod per-tool)
- Security package (JWT, RBAC, rate-limiter, validator)
- Supabase Functions (SSE path, auth, kontrol input)
- Observability (health, metrics, traces, logs)
- CI/CD & QA (unit, contract, integration, E2E, load, security)

## Aksi per Komponen
### Orchestrator
- Lengkapi adapter nyata untuk `Knowledge/Render/Task/Vector` dan hubungkan ke provider (BaseHub/Blob/Task system/VectorDB).
- Enforce JWT & RBAC di application layer (integrasi `packages/security/jwt.ts` dan `packages/security/rbac.ts`).
- Terapkan per-tenant rate-limiter (integrasi `packages/security/rateLimiter.ts`) dan idempotensi yang persisten.
- Circuit breaker & backpressure: antrean internal untuk tool-call, penolakan terukur saat saturasi.
- Perkuat observability: tambah label `tenantId/sessionId/toolName` di metrics dan trace.
- Rujukan: server `apps/orchestrator/src/index.ts:76–151`, domain services `apps/orchestrator/src/domain.ts:21–56`.

### SDK
- Pemutakhiran kontrak Zod per alat (opsi locale/freshness, idempotencyKey) dan ekspor index.
- Tambahkan generator OpenAPI (stub) untuk sinkronisasi dokumentasi kontrak.

### Security
- Konsistenkan validator input di seluruh entrypoints (orchestrator + supabase functions).
- Tambahkan pemeriksaan JWT (issuer/audience/expiry) dan RBAC berbasis roles/permissions.
- Rate-limit berbasis tenant dengan burst & refill, ekspos metrik pelanggaran.

### Supabase Functions
- Validasi input SSE dan batasi payload; tambahkan audit minimal per event penting.
- Satukan auth gate (JWT atau session) sebelum streaming events.
- Siapkan rute kontrol untuk men-trigger mode aman (mis. menurunkan frekuensi events saat load tinggi).
- Rujukan: `apps/api/supabase/functions/agent-stream/index.ts:51–66, 127–167, 221–229`.

### Data & RLS
- Tambahkan fungsi `set_tenant(uuid)` dan kebijakan RLS `USING (tenant_id = current_setting('app.current_tenant')::uuid)` pada tabel tenant-scoped.
- Audit table append-only untuk side-effects (commit/creates).
- Pastikan semua tabel memiliki `tenant_id` dan indeks yang relevan.
- Rujukan KB: `apps/api/supabase/migrations/20251128_kb.sql:31–35`.

### Observability
- Health (`GET /health`) dan metrics (`GET /metrics`) diperkaya dengan labels dan status aplikasi.
- Integrasi exporters (Prometheus/Datadog) dengan retry; korelasi trace lebih baik.
- Rujukan exporters: `apps/api/src/observability/exporters.ts:15–25, 27–40`.

### CI/CD & QA
- CI: build, typecheck, unit, contract, integration, security scan (secrets/SAST), artifacts.
- PR preview environments untuk verifikasi cepat.
- QA: 
  - Unit: services domain, validator, rate-limiter.
  - Contract: agent ↔ tools (OpenAPI + Zod).
  - Integration: Orchestrator + Supabase SSE + BaseHub mock.
  - E2E: chat KB → render → createTask → audit log.
  - Load: k6 concurrent sessions; target p95 < 500 ms tool-call (cached), start streaming < 1 s.
  - Security: JWT expiry/issuer/audience; RLS isolation; rate-limit compliance.

## Rencana Implementasi Bertahap
- Fase A — Integrasi Security & Validasi
  - Enforce JWT/RBAC; rate-limit per tenant; validator konsisten.
- Fase B — Adapter Tool Nyata & Idempotensi Persisten
  - Sambungkan BaseHub/Blob/Task/Vector; idempotensi storage.
- Fase C — RLS Harden & Audit
  - `set_tenant`, kebijakan RLS, audit konsumsi.
- Fase D — Observability & Resiliensi
  - Metrics/health/traces; circuit breaker; backpressure.
- Fase E — QA & CI/CD Lengkap
  - Test suite lengkap; PR preview; security scanning.

## Kriteria Penerimaan
- Semua endpoint validasi input (Zod) dan menolak payload tidak sah.
- Setiap tool-call tercatat audit; idempotensi mencegah duplikasi.
- Rate-limit bekerja per tenant; metrik pelanggaran tersedia.
- RLS: query negatif memastikan isolasi antar tenant.
- E2E alur utama (KB → render → task) berjalan konsisten dan terukur.

## Risiko & Mitigasi
- Saturasi beban: backpressure + circuit breaker + rate-limit.
- Ketergantungan eksternal: retry, fallback cache, timeout terukur.
- Keamanan token: validasi JWT ketat dan rotasi kunci.

## Deliverables
- Implementasi security, adapter tools, RLS, observability, test suite dan CI/CD yang diperbarui.
- Dokumentasi kontrak (OpenAPI + Zod), runbooks observability, dan panduan operasi.

Silakan konfirmasi untuk eksekusi langkah-langkah ini; setelah disetujui, saya akan menerapkan perubahan sesuai fase di atas dan memverifikasi hasilnya end-to-end.