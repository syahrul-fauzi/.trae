## Persiapan Lingkungan
- Infrastruktur: staging terisolasi + database (Postgres/Supabase), Redis/Queue (BullMQ), storage, CDN.
- Tools & Software: Snyk/Trivy (SCA), OWASP ZAP (DAST), CycloneDX/SPDX (SBOM), k6 (load), Toxiproxy (chaos), OpenTelemetry/Prometheus/Grafana (observability).
- Environment Variables: `NEXT_PUBLIC_APP_URL`, `REVALIDATE_SECRET`, kredensial DB/Redis, secrets untuk ZAP/Snyk; gunakan secrets manager dan file `.env.staging`/`.env.prod` terpisah.
- Branch/Workspace: buat branch `phase-2-security-performance`; workspace laporan `reports/` dan bukti `evidence/` dipisah per sub‑fase.

## Perencanaan Teknis
- Spesifikasi Detail: dokumen fitur keamanan (SCA/DAST/SBOM), kinerja (k6/Toxiproxy), dan integrasi CI/CD.
- Timeline & Milestones: pendekatan incremental (Security → Performance → Integrasi → Stabilization) dengan gate acceptance di tiap milestone.
- Task Breakdown: epics → stories (SCA gate, DAST baseline, SBOM generation, k6 CRUD/SSE/Queue, chaos profiles, dashboard OTel/Prometheus, alerting) → tugas granular per repo.
- Acceptance Criteria: 
  - Security: 0 Critical/High (runtime deps), DAST baseline 0 High/Critical, SBOM lengkap dan valid.
  - Performance: CRUD p95 ≤ 2s, Streaming T90 < 2s, error rate ≤ 0.5%, throughput sesuai beban target.
  - Operasional: alerting aktif, dashboards lengkap, runbooks tersedia.
- Tracking: aktifkan sistem pelacakan bug/tugas (issue tracker) dan link ke `reports/` & `evidence/` per test.

## Persiapan Tim
- Peran: Security (SCA/DAST/SBOM), SRE (k6/Toxiproxy, observability), QA (test eksekusi & verifikasi), Dev (remediasi), PM (timeline & risiko).
- Onboarding: dokumentasi konfigurasi environment, cara menjalankan alat, konvensi repo, panduan artefak.
- Kickoff: review scope, risiko, SLA/SLO, dan rencana pelaporan; set komitmen lintas tim.

## Quality Assurance
- Test Plan: 
  - Security: SCA/DAST terintegrasi dalam CI, SBOM tiap build.
  - Performance: skenario k6 (CRUD/SSE/Queue), target p50/p95/p99, saturasi; chaos Toxiproxy (latency/loss/blackout).
  - Integrasi: verifikasi kontrak API, idempotensi & retry; data consistency jobs.
- Environment Testing: staging environment terpisah; gating di CI untuk merge.
- CI/CD: workflows untuk security/perf/reporting; publish artefak ke `reports/` dan `evidence/`.

## Monitoring
- Logging & Monitoring: OpenTelemetry tracing, Prometheus metrics; dashboards Grafana per service.
- Dashboard Progress: metrik Phase 2 (temuan SCA/DAST, baseline kinerja, error budget, coverage) dan status remediasi.
- Metrik Kesuksesan: 
  - Security: 0 Critical/High; mean‑time‑to‑remediate ≤ SLA.
  - Performance: p95/p99 dalam batas; error rate ≤ 0.5%; stabil di beban target.
  - Operasional: alert respon ≤ SLA; runbook dieksekusi tanpa blocking.

## Struktur Artefak & Pelaporan
- Directory: `reports/` (laporan formal: HTML/PDF, LCOV, ringkasan), `evidence/` (bukti: JSON/logs/screenshots/traces), subfolder per alat (sca/dast/sbom/perf/resilience).
- Metadata: timestamp (YYYYMMDD_HHMM), versi, penanggung jawab, status pass/fail.
- Siklus Pelaporan: mingguan untuk progres & risiko; per‑milestone untuk gating & persetujuan.

## Risiko & Mitigasi
- Risiko: temuan keamanan kritis, bottleneck kinerja, flakiness test, keterlambatan integrasi.
- Mitigasi: triage cepat, parallel remediation, feature flags/rollback, load test berulang, observability audit.

## Langkah Eksekusi Awal (Setelah Approval)
- Provisioning staging + secrets; aktifkan CI jobs Security & Performance.
- Jalankan baseline SCA/DAST/SBOM; jalankan k6/Toxiproxy baseline.
- Publikasikan artefak ke `reports/` & `evidence/`; review bersama dan tetapkan target per sprint.
