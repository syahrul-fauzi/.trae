## Audit & Status Awal
- Tinjau commit terakhir, issue tracker, dan CHANGELOG untuk modul: `@sba/entities`, `@sba/web`, `@sba/api`.
- Verifikasi PR/branch aktif dan status CI (build/type-check/test/coverage).
- Buat checklist progres komponen: subpath entities, adapter API/Web, stubs/mocks (Redis, AWS S3, queues), orchestrator fixtures, coverage gates.

## Dependency Mapping
- Petakan dependensi lintas apps/packages: UI ↔ Entities ↔ Services ↔ API ↔ Workers ↔ Storage/Redis.
- Identifikasi dependensi kritis (Next headers, UI templates, ioredis, AWS SDK) dan pastikan alias/resolver ke stubs untuk mode test.

## Selesaikan Pekerjaan Tertunda
- Alias Stub AWS SDK: konfirmasi alias aktif dan sesuaikan semua provider tests ke stub; tambah validasi parameter & error path.
- Mock Worker (hoisting fix): konsolidasi services ke modul stub terpusat; impor paling awal; lengkapi Bull queue stubs (getWaitingCount/Active/Completed/Failed/pause/resume/clean/getJobs).
- Orchestrator Fixtures: selaraskan nilai (ISO timestamps, attachments/MIME, status), tambahkan validasi otomatis di setup.
- Middleware & Tools tests: gunakan base mock server untuk determinisme (legacy redirects, health, tenant header).

## Dokumentasi Teknis
- Lengkapi: Technical Specification (stubs/mocks, alias mapping), User Manual (adapter konsumsi DTO/events), API Documentation (contract `ErrorResponse`, endpoints health/storage/tools), Test Strategy (unit/integrasi/e2e, coverage thresholds).
- Perbarui CHANGELOG dengan ringkasan perubahan: subpath exports, DTO/events, VO shared, alias dist, stubs AWS/Redis/queues, orchestrator fixtures, CI gates.

## Code & Design Review
- Review konsistensi arsitektur: SSOT domain di `@sba/entities`, adapter boundary, validasi zod di tepi, pemisahan UI/infra.
- Verifikasi requirement-by-requirement terhadap PRD/kontrak API; telusuri traceability matrix untuk tiap fitur.

## Testing Menyeluruh
- Unit: coverage ≥ 80% di komponen kritis (tenant middleware, tools controller, storage provider, orchestrator schemas).
- Integrasi end-to-end: jalankan skenario utama (tools list/detail/execute, storage init/complete, health) di mock server.
- Performance: uji jalur kritis (tools execute pipeline) dengan input bervariasi; laporkan latensi & stabilitas.
- Security: validasi header/validasi payload, rate limit mock, audit logging.
- UAT: jalankan skenario end-user untuk chat/workflow dan verifikasi perilaku UI/Web/API.

## Timeline & Prioritas
- Prioritaskan: (1) hoisting fix & queue stubs, (2) orchestrator fixtures & schema validation, (3) provider tests AWS stub, (4) coverage gates & CI artifacts.
- Critical path: tests worker & orchestrator; tetapkan resource leveling untuk perbaikan cepat.
- Risk assessment: ketergantungan infra (Redis/S3) → mitigasi via stubs; kontrak API drift → sinkronisasi tests & docs.

## Status & Metrik
- Update berkala (harian/mingguan): % completion, test pass rate, coverage (statements/branches/functions/lines), velocity PR.
- Kendala: catat root cause (resolver path, hoisting DI, kontrak skema), mitigasi (alias/stubs/fixtures).
- Rencana tindak lanjut: timeline realistis per tugas dan penanggung jawab.

## Quality Gates & CI/CD
- Aktifkan coverage thresholds di Vitest config dan gate CI untuk build/release.
- Pastikan type-check, lint, test (unit/integrasi/e2e) lulus sebelum publish Changesets.
- Simpan artifacts: laporan test (junit/HTML), coverage (lcov/HTML), catatan perubahan.

## Deliverables & Handover
- Kode stub lengkap (AWS S3, Redis, queue services), modul stub worker terpusat dengan dokumentasi alias & struktur.
- Fixtures orchestrator terselaraskan dan tervalidasi otomatis.
- Laporan coverage memenuhi threshold; artifacts CI tersimpan.
- Dokumentasi akhir: deployment procedure, rollback plan, monitoring checklist, troubleshooting guide.

Saya akan mengeksekusi rencana di atas secara bertahap pada branch terpisah, menyelesaikan pekerjaan yang tertunda, menjalankan test menyeluruh hingga 100% passed pada komponen target, memastikan coverage memenuhi ambang batas, dan menyiapkan dokumentasi serta artifacts release untuk penyerahan.