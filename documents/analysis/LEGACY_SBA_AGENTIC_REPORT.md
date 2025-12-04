Laporan Komprehensif Analisis Legacy — SBA-Agentic

1. Struktur Direktori & Organisasi
- Root berisi puluhan dokumen perencanaan, arsitektur, UI/UX, QA/CI, dan roadmap yang relevan dengan SBA-Agentic.
- Folder kunci: `Smart Business Assistant/`
  - `docs/`: ADR (001–004), `api-openapi.yaml`, `ci-cd.md`, `ci-example.yml`, `coding-conventions.md`, `ddd-models.md`, `diagrams/` (Mermaid dan sequence), `test-plan.md`, `turbo-config.md`, `Verification_Summary.md`.
  - `apps/`, `core/`, `shared/`: README dan pedoman, mengacu pada struktur modul/komponen.
- Kategori dokumen utama:
  - PRD & Rancangan Produk: `Smart Business Assistant PRD.md`, `PRD-Enhanced-Apps-App-SBA-Agentic.md`, `PRD - SBA Apps Web Refactor (FSD + DDD + Atomic Design).md`.
  - Arsitektur & Spesifikasi Teknis: `ARCHITECTURE.md`, `Smart Business Assistant Technical Architecture.md`, `TECHNICAL-ARCHITECTURE-SBA-Agentic-Web.md`, `Technical Docs — Architecture & Modules.md`, `TECH_SPEC.md`, `technical-specification-api.md`.
  - UI/UX & Aksesibilitas: `UI_UX.md`, `UI-UX & Accessibility Guide.md`, `ACCESSIBILITY_UX.md`, `Pedoman_Komponen_UI_UX.md`, `Matriks_Kompatibilitas_Aksesibilitas.md`.
  - Keamanan/Compliance: `Apps_Web — CSP, Permissions-Policy, Trusted Types & Testing.md`.
  - Testing/QA/CI/CD: `QA_TEST_PLAN.md`, `test-plan.md`, `Testing-Verification-Checklist-Apps-App-SBA-Agentic.md`, `ci-cd.md`, `ci-example.yml`.
  - ADR: `ADR-001-shared-db-rls.md`, `ADR-002-ag-ui-runtime.md`, `ADR-003-model-adapter.md`, `ADR-004-error-model-tools-api.md`.
  - Diagram: `docs/diagrams/*.mmd` (alur data, komponen, context map, deployment, sequence/agl_flow.mmd), `SBA_Flow_*.drawio`, `SBA_Diagram_*.svg`.

2. Analisis Konten Dokumen Penting
- Workspace App (SBA-Agentic): `documents-legacy/RANCANGAN — apps/app (SBA-Agentic).md:3` menegaskan fungsi inti sebagai interface operasional multi-tenant untuk interaksi agent, workflow otomatis, dan manajemen konteks.
- PRD: menetapkan fitur-fitur inti (multi-tenant, agent chat + context, workflow builder, API orchestration, observabilitas, A11y AA) dan kriteria keberhasilan.
- Spesifikasi teknis: dokumen arsitektur memetakan komponen AG-UI Client, Orchestrator, Model Adapter, Tools API, Data Layer; pola FSD+DDD+Atomic; kontrak API dan error model.
- Aksesibilitas & Keamanan: pedoman WCAG AA, fokus manajemen, screen reader; header keamanan (CSP, Trusted Types, Permissions-Policy) untuk hardening front-end.
- Testing/QA/CI: rencana uji, checklist verifikasi, pipeline CI/CD contoh; menargetkan stabilitas build, gate kualitas, dan pelacakan artefak.
- ADR: keputusan desain untuk RLS (isolasi tenant), runtime AG-UI, adapter integrasi, dan konsistensi error model.

3. Dependensi & Integrasi
- Komponen inti: AG-UI Client ↔ Orchestrator ↔ AI Agent ↔ Tools API ↔ Data Sources.
- Penyimpanan & kebijakan: Postgres dengan RLS; RBAC untuk peran/izin.
- Integrasi eksternal: adapter API (rate limit, auth, kontrak versi), ingestion dokumen dan indexing.
- Observabilitas: logging terstruktur, metrics p95/p99, tracing jalur kritis.
- CI/CD: workflow build/test/deploy; secrets management; gate kualitas.

4. Versi & Riwayat Perubahan
- Mayoritas dokumen legacy berformat Markdown tanpa metadata versi eksplisit.
- Rekomendasi konsolidasi: gunakan semantic versioning (MAJOR.MINOR.PATCH), halaman `Revision History`, status (Draft/Review/Approved), dan arsip versi lama di `/_archive`.
- Penerapan pedoman penamaan: `YYYYMMDD_NamaDokumen_vX.Y` untuk konsistensi.

5. Rekomendasi Migrasi, Pemeliharaan, Pengembangan
- Migrasi: konsolidasikan ke `documents/` dengan struktur kategori (panduan-pengguna, spesifikasi-teknis, api-documentation, kebijakan-dan-prosedur, laporan-proyek) dan siapkan `legacy-import/` untuk salinan referensi.
- Pemeliharaan: tambahkan metadata header/footer standar, riwayat revisi, dan checklist review; perbarui tautan internal dari legacy ke lokasi baru.
- Pengembangan: implementasi fitur must-have (RLS/RBAC, chat+context+tools, builder node-based, adapter API, observabilitas, CI/CD, A11y AA); terapkan traceability REQ→FEATURE→TEST; quality gates dan DOR/DOD; risk register per fitur.
- Diagram: render `.mmd`/`.drawio` ke PNG untuk distribusi; pastikan alt-text dan kejelasan visual.
- Error model: standarisasi lintas API dan UI; dokumentasikan skema dan penanganan fallback.

Ringkasan
- Dokumen legacy SBA-Agentic sudah memadai untuk landasan arsitektur, UI/UX, keamanan, dan QA; perlu konsolidasi versioning, metadata, dan tautan.
- Fokus agentic: orkestrasi agent + tools, manajemen konteks, workflow builder, dan observabilitas menjadi prioritas implementasi.

