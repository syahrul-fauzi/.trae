## Tujuan
- Memastikan alias stub AWS SDK aktif dan provider tests menggunakan stub secara akurat.
- Menuntaskan masalah hoisting mock worker dengan modul stub terpisah dan urutan impor yang benar.
- Menyelaraskan seluruh fixtures orchestrator dengan skema terbaru dan menambah validasi otomatis.
- Menjalankan verifikasi coverage menyeluruh dan mengaktifkan gate CI agar build diblokir bila threshold tidak terpenuhi.

## 1) Alias Stub AWS SDK
- Konfirmasi alias aktif:
  - Periksa alias di apps/api/vitest.config.ts: penautan '@aws-sdk/client-s3' dan '@aws-sdk/s3-request-presigner' ke stub.
  - Jalankan provider tests spesifik S3 untuk memastikan semua path menggunakan stub, bukan dependensi asli.
- Penyesuaian provider tests:
  - Ubah import di tests provider ke modul yang tetap, biarkan resolver Vitest mengalihkan ke stub.
  - Tambahkan kasus validasi input (Bucket/Key/UploadId/PartNumber) dan respon error dari stub bila parameter tidak valid.
- Akurasi perilaku stub:
  - Tiru format respons CreateMultipartUpload/UploadPart/Complete dengan properti inti (UploadId, ETag, MultipartUpload hasil) dan URL signed konsisten.
  - Tiru expiry/TTL secara deterministik hanya untuk tujuan test.

## 2) Perbaikan Hoisting Mock Worker
- Modul stub terpisah:
  - Pindahkan semua deklarasi stub worker (EnhancedToolRegistry, QueueService, LoggingService) ke file tersendiri di test/__mocks__/*.
  - Pastikan file diekspor sebelum digunakan oleh modul mock DI.
- Urutan impor:
  - Impor modul stub paling awal di worker.module.mock.ts dan tambahkan alias di vitest.config.ts bila perlu.
  - Audit semua test worker agar tidak ada import sirkular; gunakan vi.mock(...) sebelum import modul target.
- Verifikasi:
  - Jalankan hanya suite worker untuk memastikan tidak ada ReferenceError/hoisting issues.

## 3) Penyelarasan Fixtures Orchestrator
- Review fixtures:
  - Inventaris semua fixtures yang dipakai dalam tests orchestrator (timestamps, attachments, MIME, status).
  - Sesuaikan nilai (createdAt/updatedAt ISO, array attachments lengkap dengan tipe, schema event) mengikuti skema terbaru.
- Validasi skema otomatis:
  - Tambahkan util validasi (mis. zod/JSON Schema) di setup test untuk memverifikasi setiap fixture sebelum test dieksekusi.
  - Gagalkan test dengan pesan jelas bila fixture tidak sesuai skema.
- Tambahan test bisnis:
  - Tambahkan kasus edge (payload kosong, tipe salah, status tak dikenal) dan skenario penting (run completed/failed, tool call sukses/gagal).

## 4) Verifikasi Test Coverage & CI Gate
- Aktifkan coverage reporting di Vitest (text/html) dengan threshold:
  - statements ≥ 90%, branches ≥ 85%, functions ≥ 95%, lines ≥ 90%.
- Jalankan seluruh suite test dan simpan laporan coverage (lcov/html) sebagai artifact CI.
- Konfigurasikan pipeline CI:
  - Tambah langkah gate yang memblokir build jika coverage di bawah threshold.
  - Pastikan type-check, lint, test (unit/integrasi/e2e) dieksekusi sebelum release.
- Dokumentasi hasil coverage:
  - Tambahkan ringkasan coverage terbaru dan daftar area yang ditingkatkan ke CHANGELOG/README QA.

## Praktik Pengembangan
- Buat branch terpisah untuk perubahan (mis. chore/test-stubs-aws, fix/worker-hoisting, chore/orchestrator-fixtures, ci/coverage-gates).
- Sertakan test case relevan untuk setiap perubahan.
- Lakukan code review sebelum merge ke main.
- Jalankan regresi minimal (type-check + full test) sebelum merge.

## Kriteria Penerimaan
- Provider S3 dan presigner menggunakan stub, semua tests terkait lulus.
- Tidak ada lagi error hoisting pada mock worker.
- Fixtures orchestrator valid terhadap skema; tests untuk skenario bisnis utama dan edge cases lulus.
- Coverage memenuhi threshold; CI memblokir bila tidak terpenuhi.

Siap mengeksekusi langkah-langkah di atas pada branch terpisah, mengimplementasikan stub/fixtures/hoisting fix, dan mengonfigurasi gate coverage di CI hingga keseluruhan suite mencapai 100% passed dan memenuhi target coverage.