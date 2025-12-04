# Dokumentasi Smart Business Assistant (SBA)

- Versi: 0.1.0
- Tanggal Pembaruan: 2025-12-03

## Struktur Folder
- `architecture` — Diagram C4 (Context, Container, Component, Code) + metadata
- `api` — Spesifikasi OpenAPI 3.1, Swagger UI preview, Spectral rules
- `guides` — Dokumentasi penggunaan, gaya PDF, template LaTeX
- `templates` — Boilerplate modul microservices: core/modules/config/docs/tests + konfigurasi
- `analysis` — Analisis menyeluruh, laporan agentic historis
- `features` — Daftar fitur, roadmap, acceptance criteria, traceability
- `gap-analysis` — Analisis kesenjangan terhadap target
- `kebijakan-dan-prosedur` — SOP dan kebijakan operasional
- `laporan-proyek` — Laporan progress, notulen rapat (meeting minutes)
- `migration` — Rencana dan catatan migrasi
- `panduan-pengguna` — Template panduan pengguna
- `requirements` — Matriks kebutuhan fungsional/non-fungsional
- `spesifikasi-teknis` — Spesifikasi teknis, BPMN, dan artefak teknik
- `assets` — Logo, media, screenshots
- `meetings` — Catatan rapat, agenda, dan tindak lanjut
- `decisions` — Keputusan arsitektur/proyek (ADR)
- `legal` — Dokumen legal dan kontrak
 - `dokumen-proyek` — Agregasi rencana, backlog, roadmap, traceability
 - `spesifikasi-teknis` — Agregasi arsitektur, API, BPMN, diagram
 - `laporan` — Laporan proyek, analisis, meeting minutes
 - `arsip` — Dokumen yang diarsipkan/superseded

## Referensi
- Atomic Design (Brad Frost) — metodologi komponen: Atoms, Molecules, Organisms, Templates, Pages
- C4 Model — konteks, container, komponen, kode (diagram arsitektur)
- OpenAPI 3.1 — spesifikasi API terbaru dengan JSON Schema
- Spectral — linting spesifikasi API
- Storybook — dokumentasi komponen UI dan visual testing
- TurboRepo — orkestrasi monorepo untuk build/test/lint
- Logo: `../assets/logo.png`
- Arsitektur dasar: `../README.md`

## Konvensi Penamaan File
- Gunakan snake_case dengan bahasa konsisten: `KATEGORI_NAMA_DOKUMEN.md`
- Sertakan versi bila relevan: `SPEC_SBA_AGENTIC_v0.1.0.md`
- Untuk gambar: `kategori-nama-gambar_vYYYYMMDD.png`
- Untuk diagram: `nama-diagram.drawio` atau `*.mmd` (Mermaid)

## Metadata Dokumen
- Simpan metadata pada header atau berkas pendamping JSON:
  - `title`, `version` (semver), `updated_at` (ISO-8601), `owner`, `status`
- Template: `DOCUMENT_METADATA_TEMPLATE.json`

## Prosedur Pembaruan Dokumen
- Lakukan perubahan dengan mencatat pada `CHANGELOG.md` dan/atau `REVISION_HISTORY_TEMPLATE.md`
- Perbarui `version` semver pada dokumen terkait
- Jalankan lint untuk API: `make oas-lint`
- Bangun PDF untuk panduan: `make pdf-build` atau `make pdf-build-all`
- Verifikasi tautan relatif: `make check-links` (opsional bila tersedia)
 - Validasi metadata: pastikan `title`, `version`, `updated_at`, `owner` terisi di setiap dokumen

## Version Control
- Gunakan semver untuk dokumen utama (`MAJOR.MINOR.PATCH`), contoh: `0.1.0`
- Catat keputusan arsitektur dalam ADR bila diperlukan
- Simpan perubahan besar di `CHANGELOG.md` dan revisi rinci di `REVISION_HISTORY_TEMPLATE.md`

## Keamanan & Compliance
- Jangan menyimpan secrets/API keys di dokumen (gunakan placeholders)
- Klasifikasi dokumen: `Public`, `Internal`, `Confidential` sesuai `SECURITY_COMPLIANCE.md`
- Redaksi informasi sensitif sebelum publikasi
- Sertakan lisensi dan hak akses bila diperlukan
 - Tambahkan metadata `owner`, `status` sesuai `DOCUMENT_METADATA_TEMPLATE.json`

## Navigasi Cepat
- Arsitektur: `architecture/README.md`
- API: `api/README.md` dan `api/openapi.yaml`
- PDF: `guides/USAGE_GUIDE.md`, `guides/pdf/sba-template.tex`
- Template modul: `templates/README_MODULE_TEMPLATE.md`
