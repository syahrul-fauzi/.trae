## Ringkasan Tujuan
Siapkan monorepo `sba-agentic` di `/home/inbox/smart-ai/sba-agentic` untuk produksi melalui audit menyeluruh, penyusunan pipeline deployment yang aman dan dapat di‑rollback, battery testing komprehensif, serta dokumentasi operasional lengkap. Semua checklist harus lulus review dan disetujui oleh ≥2 Senior Engineer sebelum live.

## Konteks Arsitektur Repo
- Monorepo: Turborepo + pnpm workspaces (`turbo.json`, `pnpm-workspace.yaml`, `package.json`).
- Apps: `apps/app` (Next.js 15), `apps/web` (Next.js 14), `apps/api` (NestJS + Prisma + BullMQ + Redis + Socket.IO + Supabase), plus marketing/docs/orchestrator.
- Packages: `packages/*` termasuk `supabase`, `logger`, `observability`, `telemetry`, `ui`, `utils`, dll.
- DB & migrasi: SQL migrasi Supabase di `apps/api/supabase/migrations/*.sql`, seed di `apps/api/supabase/seed.sql`, Prisma skrip `db:*` di `apps/api/package.json`.
- CI/CD: `.github/workflows/*.yml` termasuk deploy, canary, rollback, gates kualitas. Dokumen: `docs/DEPLOYMENT_PLAN.md`, `docs/SBA-Agentic_Pre_Launch_Checklist.md`.

## 1) Audit & Pengecekan Menyeluruh
### 1.1 Dependensi & Library
- Inventaris versi:
  - Ekstrak dependensi dari root dan semua `apps/*/package.json` serta `packages/*/package.json`; cocokkan resolusi pnpm dengan deklarasi.
  - Tinjau bundler/kompilasi (`tsup`, `tsc`) per package untuk konsistensi tujuan runtime (Node vs browser).
- Deprecation & kompatibilitas:
  - Jalankan audit deprecation dan kompatibilitas Node/Next/Nest.
  - Pastikan peer deps antar packages internal terpenuhi (mis. `react`, `next`, `typescript`, `ts-node`).
- Vulnerability scanning:
  - Rencanakan menjalankan kombinasi: `pnpm audit --prod`, Snyk (`pnpm dlx snyk test`), Semgrep (rules OWASP), Trivy untuk image (jika containerized).
- Acceptance criteria:
  - 0 high/critical CVE outstanding atau ada mitigasi/waiver terdokumentasi.
  - Tidak ada dependency deprecated tanpa pengganti; upgrade path ditentukan.

### 1.2 Validasi Environment Production
- Env schema & konsistensi:
  - Rujuk validator env (contoh `apps/app/src/shared/config/env.ts` menggunakan `zod`), mapping ke `NEXT_PUBLIC_*` di `apps/app/next.config.js`.
  - Enumerasi variabel wajib per app: Supabase (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE`), Postgres (`DATABASE_URL` untuk Prisma), Redis (`REDIS_URL`), Sentry (`SENTRY_DSN`), JWT/secrets, rate-limit keys, API base URL, Socket.IO origin, dsb.
- Keamanan:
  - Pastikan tidak ada secrets diekspos sebagai `NEXT_PUBLIC_*` kecuali yang aman.
  - Terapkan rotasi kunci, minimal permission (service role hanya di server), RLS aktif di Supabase.
- Verifikasi koneksi eksternal:
  - Health checks ke Supabase, Redis, Sentry, email provider, storage (S3/MinIO jika ada), Webhook endpoints.
- Acceptance criteria:
  - Semua env tervalidasi, secrets tersimpan di store aman (CI secrets/vault), health checks hijau.

### 1.3 Audit Skema Database
- Migrasi SQL Supabase:
  - Review `apps/api/supabase/migrations/*.sql` untuk struktur tabel, indeks, RLS policies, `pgvector` jika dipakai.
  - Jalankan migrasi pending (di staging terlebih dahulu).
- Prisma (API):
  - `prisma migrate deploy` untuk memastikan skema sinkron dengan `schema.prisma` bila digunakan.
- Backup:
  - Snapshot pre-deploy; tentukan RPO/RTO; uji restore ke environment terpisah.
- Acceptance criteria:
  - Tidak ada migrasi pending di production setelah cutover; backup sukses diverifikasi; indeks kritikal terpasang; RLS diuji.

## 2) Pipeline Deployment yang Robust
### 2.1 CI/CD Otomatis
- Build artifacts:
  - Frontend: `next build` menghasilkan `.next` teroptimasi; aktifkan `SWC minify` dan image optimization.
  - Backend: `apps/api` build production (`tsc`/`tsup`) dengan sourcemaps.
  - Artifacts dipublikasi antar job (cache Turborepo).
- Deploy proses:
  - Staging canary → production (lihat `.github/workflows/staging-canary-prod.yml`).
  - Strategi: blue‑green atau rolling; simpan versi build (artifact ID) untuk rollback.
- Post-deploy verifikasi:
  - Health endpoint (API), halaman critical (app/web), SSE/WS handshake, job queue (BullMQ) berjalan, koneksi Redis/DB OK.

### 2.2 Rollback Otomatis (<5 menit)
- Deteksi kegagalan:
  - Gate pada smoke tests dan health checks; jika gagal → trigger rollback workflow.
- Mekanisme rollback:
  - Re‑deploy artifact versi sebelumnya (tersimpan di registry/artifact storage) ke semua target.
  - Database: hanya forward‑safe migrasi di main; migrasi berisiko disertai down‑migration dan guard.
- Notifikasi tim:
  - Integrasi ke Slack/Email dengan payload ringkas (versi, waktu, scope, metrik health).

### 2.3 Monitoring & Logging
- Monitoring:
  - Backend: ekspos metrics endpoint (Prometheus) dan dashboard Grafana (latency, error rate, queue depth, DB connections).
  - Frontend: RUM via Sentry/NR; track LCP/FID/CLS/INP.
- Alerting:
  - Threshold: API 5xx rate, p95 latency, job failures, DB replica lag, WS disconnect rate.
  - On‑call rota & eskalasi otomatis.
- Logging terpusat:
  - Gunakan `packages/logger` dengan format terstruktur (JSON), sink ke ELK/OpenSearch/Vector.
  - Retention policy: 30–90 hari; PII redaction & sampling.

## 3) Battery Testing Lengkap
### 3.1 Load & Performance
- Skenario alat: K6/Artillery dengan skenario:
  - 1000+ concurrent, ramp‑up 1→1000, steady 30 menit.
  - Spike: 1→2000 dalam <60 detik, ulang.
  - Endurance: 24+ jam dengan pattern realistis (SSE/WS, uploads, queries).
- Metrik: throughput, p95/p99 latency, error rate, resource usage, queue metrics.

### 3.2 Security Testing
- Penetration testing: scope API, web, WS/SSE.
- OWASP Top 10 scan: ZAP, Semgrep ruleset web/API.
- Audit akses/permission:
  - Supabase RLS & tenant isolation; roles minimum; secret management; CORS.

### 3.3 Integrasi Menyeluruh
- API endpoint tests: kontrak (OpenAPI jika ada), status & payload.
- Data flow lintas sistem: Supabase ↔ API ↔ apps; event/queue; webhooks.
- Validasi error handling: retry/backoff, idempotency, dead‑letter queues, user messaging.

## 4) Dokumentasi Operasional
- Manual operasional:
  - Diagram arsitektur (Mermaid): boundary, data flow, komponen.
  - Runbook: start/stop, scaling, key procedures, backup/restore.
  - SOP maintenance: patching, rotasi kunci, indeks DB, pembersihan logs.
- Troubleshooting guide:
  - Error codes & solusi; checklist diagnostik (health, logs, metrics); eskalasi.
- Emergency protocol:
  - Kontak 24/7; DR plan (RTO/RPO); business continuity; table‑top exercise.

## 5) Governance, Review & Go/No‑Go
- Checklist per domain (deps, env, DB, CI/CD, monitoring, testing, docs) dikompilasi.
- Review formal oleh ≥2 Senior Engineer; semua temuan diresolusikan atau diberi waiver.
- Go/No‑Go meeting: present metrik, risiko, readiness, rencana rollback.

## Deliverables & Implementasi Teknis (Siap Eksekusi)
- Laporan audit deps + hasil vuln scan & remediation plan.
- Matriks env per aplikasi + hasil health check.
- Status migrasi + bukti backup/restore uji.
- CI/CD workflows diperkeras: build, canary, health gates, rollback + notifikasi.
- Monitoring terpasang + dashboard + alerting + kebijakan logging.
- Battery testing: skrip, laporan hasil (graf p95/p99), rekomendasi tuning.
- Dokumentasi operasional lengkap di `docs/` dengan skema versi.

## Catatan Eksekusi
- Mulai dari staging yang menyerupai prod (resource, secrets, topology).
- Hindari perubahan state di prod sebelum semua acceptance criteria terpenuhi.
- Ikuti pola dan utilitas yang sudah ada (Next/Nest/Turborepo, `packages/logger/observability/supabase`).
