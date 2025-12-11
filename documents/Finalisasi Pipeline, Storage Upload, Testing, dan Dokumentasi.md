## Ringkasan Status
- Backend upload tersedia sebagai stub di `apps/api/src/api/controllers/StorageUploadController.ts` (init/part/complete/abort) dan `apps/api/src/application/storage/StorageUploadService.ts` namun belum presigned/multipart resmi; `complete/abort` masih stub.
- Frontend uploader `ChunkedUploader` ada tetapi belum mengirim daftar part ke `/complete` dan belum retry/ETag; integrasi di `apps/app/src/components/chat/message-input.tsx` masih hardcode provider/bucket.
- Laporan CI (HTML/PDF & coverage) sudah ada via `.github/workflows/reports.yml`; artefak diverifikasi dan dipublikasikan.
- Konfigurasi default upload tersedia di `apps/app/src/features/upload/config.ts`.

## Checklist Verifikasi Komponen
- Backend
  - Controller endpoint: `apps/api/src/api/controllers/StorageUploadController.ts:8`, `:13`, `:18`, `:23`
  - Service stub: `apps/api/src/application/storage/StorageUploadService.ts:11` (init), `:20` (part), `:25` (complete), `:29` (abort)
- Frontend
  - Uploader: `apps/app/src/features/upload/uploader.ts:3`
  - Integrasi: `apps/app/src/components/chat/message-input.tsx:62` (init) dan hardcode `provider/bucket/access` di `:66-69`
  - Config: `apps/app/src/features/upload/config.ts`
- Testing & Reports
  - Vitest config: `apps/app/vitest.config.ts`
  - Reports workflow: `.github/workflows/reports.yml:28-35`, publikasi Pages/GCS/S3/Azure
- Gap yang teridentifikasi: presigned URL resmi, `/complete` dengan ETag, auth/tenant, retry/error handling, standar `storage_url` di repositori, test E2E upload.

## Dependency Mapping
- Saat ini belum ada SDK provider di backend.
- Rencana penambahan aman:
  - S3: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`
  - GCS: `@google-cloud/storage`
  - Azure: `@azure/storage-blob`
- Frontend: tetap native `fetch`; tidak ada lib baru.
- CI Reports: `puppeteer`, `lcov2cobertura`, `xml2js`, `tsx` sudah diinstal di workflow.

## Rencana Penyelesaian Tugas (Prioritas)
1) Upload Storage (kritikal)
- Backend
  - Implementasi multipart resmi per provider: `init` → create session (S3 CreateMultipartUpload, GCS resumable, Azure BlockBlob)
  - `part` → presign PUT URL per part dengan durasi aman
  - `complete` → finalize (S3 CompleteMultipartUpload dengan daftar `{PartNumber, ETag}`, Azure CommitBlockList, GCS finalize)
  - `abort` → batalkan sesi multipart di provider
  - Validasi auth/tenant, batas ukuran dan MIME, logging minimal tanpa mengekspose secrets
- Frontend
  - Gunakan `DEFAULT_STORAGE_CONFIG` untuk `bucketName/accessPolicy` dan validasi `allowedFileTypes/maxFileSize`
  - Kumpulkan `ETag` dari respons part (mis. header `ETag` pada S3); kirim ke `/complete`
  - Tambah retry eksponensial per part, batas percobaan, dan error path yang jelas

2) Standarisasi `storage_url`
- Audit adapter/persistence yang memakai `metadata.url`; migrasikan ke `storage_url` untuk konsistensi baca/tulis; tambah test regresi.

3) Testing & Quality Gates
- Unit tests
  - Backend: controller & service untuk `init/part/complete/abort` (mock SDK provider)
  - Frontend: `ChunkedUploader` (pause/resume/abort, progress, retry, ETag)
- Integration/E2E
  - Alur upload dari UI → backend (mock server/provider) → penyimpanan `storage_url`
- Coverage ≥80% (HTML/PDF laporan via workflow yang ada)
- Performance
  - Uji throughput unggah (chunk size default 5MB), latensi per part, dan penggunaan memori
- Security
  - Validasi tipe/ukuran, TTL presigned, pembatasan akses, verifikasi auth/tenant
- UAT
  - Skenario: unggah gambar/pdf/docx/text, jeda/lanjut/batal, pesan terkirim dengan attachment.

## Code Review & Design Review
- Review konsistensi arsitektur (controller → service → provider SDK), penamaan, error handling, dan pemisahan concerns.
- Verifikasi requirement-by-requirement terhadap spesifikasi upload, laporan CI, dan integrasi UI.

## Dokumentasi yang Diselesaikan
- Technical Specification: arsitektur upload multipart per provider, sequence diagram, batasan, konfigurasi.
- API Documentation: kontrak `POST /api/storage/init`, `GET /api/storage/part`, `POST /api/storage/complete`, `POST /api/storage/abort`, payload & respons.
- User Manual: cara melampirkan file, batasan tipe/ukuran, kontrol pause/resume/abort.
- Ops Docs: publikasi laporan (Pages/S3/GCS/Azure), pengaturan env, keamanan (signed/SAS), rollback.

## Timeline & Prioritas
- Minggu ini (kritikal path): backend presigned multipart + frontend complete/ETag + unit/integration tests + coverage; standar `storage_url`.
- Berikutnya: performance & security hardening; UAT; dokumentasi lengkap.

## Risk Assessment & Mitigasi
- Presigned expiry terlalu pendek → set durasi aman dan retry; fallback refresh URL
- Ketidakcocokan ETag provider → normalisasi pengambilan ETag per provider
- Beban jaringan saat concurrency tinggi → batasi concurrency part di FE; rate-limit di BE
- Secret leakage → audit log, masking, tidak menulis secrets ke repo/log

## Update Status Berkala (Template)
- Progress: % completion, jumlah test lulus/gagal, coverage saat ini
- Kendala: deskripsi, root cause, mitigasi
- Next: tugas terjadwal, assignee, ETA

## Deliverables & Laporan Akhir
- Laporan test HTML/PDF + coverage JSON/LCOV/Cobertura
- Daftar tugas selesai & verifikasi
- Changelog terstruktur
- Instruksi operasi: deployment, rollback, monitoring checklist, troubleshooting guide

Konfirmasi rencana ini. Setelah disetujui, saya akan melaksanakan implementasi, menulis/menjalankan test, memverifikasi kualitas, dan menyiapkan laporan akhir sesuai poin di atas.