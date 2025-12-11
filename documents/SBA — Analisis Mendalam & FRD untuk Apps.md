## Ringkasan Temuan
- Sumber utama: `docs/README.md:66-143` berisi 4 use case inti SBA.
- Arsitektur monorepo: frontends `apps/app`, `apps/web`, backend `apps/api`, dan paket bersama `@sba/*` (lihat `docs/architecture/README.md:5-8,45-64` dan `docs/architecture/RELATIONS.md:3-35`).
- Alur komunikasi: REST/SSE/WS untuk agentic orchestration, CRUD + Realtime via Supabase.

## Use Case Terkumpul (dari README)
- `Manajemen Tugas & Proyek` (lihat `docs/README.md:68-79`).
- `Analisis Data Bisnis` (lihat `docs/README.md:80-89`).
- `Otomatisasi Proses Bisnis` (lihat `docs/README.md:91-101`).
- `Integrasi dengan Sistem Eksternal` (lihat `docs/README.md:102-112`).
- Referensi apps: `docs/use-cases/apps-app.md`, `docs/use-cases/apps-web.md`, `docs/use-cases/apps-api.md` (lihat `docs/README.md:32-35`).

## Pendalaman Use Case (yang akan ditulis)
Untuk tiap use case di atas, kami akan memproduksi dokumen pendalaman berisi:
- Deskripsi lengkap, aktor, pre/postcondition, alur utama & alternatif.
- Aturan bisnis (multi-tenant, SLA, idempotensi, audit, keamanan, rate limit).
- Persyaratan non-fungsional (kinerja, keandalan, keamanan, skalabilitas, observability). Rujukan best-practice dari SDLC/Requirement Analysis (REF 3) dan Non-Functional Analysis (REF 5).

## Rencana FRD per Aplikasi (Apps/*)
Kami akan membuat FRD untuk:
- `apps/app` (orchestrator UI, REST+SSE/WS): fitur start/continue/cancel run, stream visualisasi; spesifikasi interaksi event (lihat `docs/use-cases/apps-app.md:15-22,73-89`).
- `apps/web` (chat/dokumen, Supabase): CRUD conversations/messages/documents, realtime; integrasi endpoint AG-UI (lihat `docs/use-cases/apps-web.md:14-21,73-88`).
- `apps/api` (NestJS orchestrator): kontrak REST/WS, queue BullMQ, Prisma ke Supabase (lihat `docs/use-cases/apps-api.md:15-21,85-96`).
Setiap FRD mencakup latar belakang, fitur utama, spesifikasi fungsional, diagram use case (Mermaid), batasan sistem, acceptance criteria.

## Rencana Desain Database
- Analisis kebutuhan data untuk tenants, users, conversations, messages, documents, runs, run_events, workflows, workflow_steps, integrations, audit_logs.
- Skema ERD (Mermaid `erDiagram`) dan relasi kunci (FK, indeks). Mengacu arsitektur data (Supabase, Redis) dari `docs/architecture/README.md:67-70` dan `RELATIONS.md:19-24`.
- Spesifikasi query dasar (CRUD, listing, pagination, filter per-tenant) dan garis besar compliance (RLS, audit trail, idempotensi, retry-safe).

## Struktur Dokumen yang Akan Dibuat
- `docs/use-cases/` — pendalaman tiap use case inti dan per modul apps/*.
- `docs/frd/` — FRD untuk `apps/app`, `apps/web`, `apps/api` (versi, changelog, diagram).
- `docs/db/` — ERD, skema tabel, relasi, query dasar, kebijakan RLS.
- `docs/references/` — benchmark & best-practices (mengacu REF 1, 3, 5, dengan ringkasan yang relevan).

## Konsistensi & Versi
- Format konsisten: header versi (SemVer), riwayat perubahan, penanggung jawab dan kontak.
- Diagram menggunakan Mermaid; penautan silang ke file referensi dengan `file_path:line_number` bila relevan.

## Langkah Implementasi Setelah Persetujuan
1. Buat file pendalaman use case (4 dokumen inti + per modul apps/*). 
2. Buat FRD per aplikasi dengan diagram dan acceptance criteria.
3. Rancang ERD dan tulis spesifikasi tabel+query, termasuk kebijakan RLS.
4. Tambah `docs/references` untuk benchmark & best-practice.
5. Review konsistensi dan versi; tambahkan kontak penanggung jawab.

Silakan konfirmasi agar kami mulai membuat berkas-berkas di direktori `docs/*` sesuai struktur di atas.