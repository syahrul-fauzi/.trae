# SBA-Agentic — Spesifikasi Teknis

Header
- Kode Dokumen: DOC-TS-SBA
- Versi: v1.0
- Tanggal: 2025-12-03

1. Arsitektur
- Komponen: AG-UI Client, Orchestrator, Model Adapter, Tools API, Data Layer
- Pola: FSD+DDD+Atomic, adapter untuk integrasi, event-driven untuk alat

2. Spesifikasi Detail
- Antarmuka: API REST sesuai `documents/legacy-import/Smart Business Assistant/docs/api-openapi.yaml`
- Kontrak: error model konsisten, versioning semver, pagination, filtering
- Integrasi: header keamanan CSP; Permissions-Policy; Trusted Types

3. Persyaratan Sistem
- Runtime: Node.js LTS; browser Evergreen
- Database: Postgres dengan RLS
- Infrastruktur: observability stack (logs, metrics, tracing)

4. Keamanan & Compliance
- AuthN/Z: JWT/OAuth; RBAC; RLS menyeluruh
- Data protection: PII masking; audit trail
- Header: CSP ketat, Trusted Types, Permissions-Policy

5. Observabilitas
- Logging terstruktur, metrics p95 latency, tracing untuk jalur kritis

6. Risiko & Mitigasi
- Kebocoran tenant: perkuat policy test
- Flaky tests: stabilisasi dan isolasi pipeline
- Kompleksitas builder: aksesibilitas dan autosave

Lampiran
- Diagram: `documents/spesifikasi-teknis/diagrams/bpmn/*.mmd`
- Matriks kebutuhan: `documents/requirements/REQUIREMENTS_MATRIX.csv`
- Analisis gap: `documents/gap-analysis/GAP_ANALYSIS.md`
