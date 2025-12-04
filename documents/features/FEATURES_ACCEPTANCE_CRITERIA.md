# Acceptance Criteria — Fitur Utama SBA-Agentic

## FEAT-001 — Multi-tenant Workspace Management
- Dapat membuat, mengubah, menghapus tenant dengan audit log
- Data antar tenant terisolasi (uji kebocoran negatif)
- Admin dapat menetapkan peran dan kebijakan per-tenant
- Permission diuji via RLS/RBAC policy test

## FEAT-002 — Agent Chat + Context Thread + Tools
- Pesan ditautkan ke thread konteks yang benar
- Tools dapat dipanggil dan mengembalikan hasil terstruktur
- Error tools ditangani dengan fallback/rehydration
- Aksesibilitas: input chat keyboard-friendly; log live polite

## FEAT-003 — Workflow Automation Builder (Node-based)
- Node dapat dibuat, dihubungkan, divalidasi, dan disimpan (autosave)
- Deploy menghasilkan versi yang dapat di-rollback
- Monitoring jalur eksekusi tersedia; tracing aktif
- Aksesibilitas: node fokus dan navigasi keyboard

## FEAT-004 — API Orchestration via Adapter
- Integrasi eksternal melalui adapter dengan kontrak versi
- Rate limit dan auth diterapkan untuk setiap panggilan
- Error model konsisten; retry/fallback sesuai kebijakan

## FEAT-005 — AuthN/Z dengan RLS dan RBAC
- Login dan token valid; peran menentukan hak akses
- Query dibatasi oleh RLS; verifikasi dengan kasus uji kebijakan
- Audit trail mencatat perubahan peran dan akses

## FEAT-006 — Observability
- Log terstruktur berisi korrelasi ID
- Metrics p95/p99 dilacak untuk jalur kritis
- Tracing menandai hop UI→Orchestrator→Agent→Tools→Data

## FEAT-007 — CI/CD Pipeline
- Build, test, lint, security scan berjalan otomatis
- Gate kualitas mencegah deploy jika test gagal
- Artefak versi dan changelog dihasilkan

## FEAT-008 — A11y WCAG AA + Security Headers
- Kontras, fokus, dan pembaca layar lolos pengujian AA
- Header CSP, Trusted Types, Permissions-Policy aktif tanpa pelanggaran

## FEAT-009 — Document Ingestion & Indexed Search
- Ingestion memasker PII; metadata disimpan
- Indexing mendukung pencarian dengan relevansi

## FEAT-010 — Workflow Monitoring & Rollback
- Status run ditampilkan real-time; histori eksekusi tersedia
- Rollback mengembalikan ke versi sebelumnya tanpa kehilangan data

## FEAT-011 — Konsistensi Error Model API & UI
- Skema error lintas lapisan konsisten dan terdokumentasi
- UI menampilkan error dengan konteks dan solusi

## FEAT-012 — Template Workflow Siap Pakai
- Template terdaftar dan dapat diinstansiasi
- Validasi template sebelum deploy

## FEAT-013 — Marketplace Integrasi
- Integrasi listable, dapat dipasang/dilepas
- Approval/billing mengikuti kebijakan dan audit
