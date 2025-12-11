## Sasaran
- Menstabilkan Observability agar tidak mengganggu unit/E2E (khususnya BullMQ instrumentation). 
- Menghadirkan kompatibilitas Prisma di test (shim/mock `$transaction`/`$on`). 
- Memperbaiki redirect tests dengan server bootstrap terukur.
- Merapikan a11y lint errors agar gate CI hijau.
- Menguatkan CI/CD jobs, artefak, dan monitoring pass rate.

## Perbaikan Observability
- Guard instrumentation saat test: 
  - Deteksi `NODE_ENV === 'test'` di konfigurasi OTel; skip `new BullMQInstrumentation(...)` dan instrumentations yang tidak tersedia di test runner.
  - Tambahkan fallback no-op untuk `getMeter()`/`getTracer()` saat test agar modul lain tetap jalan.
- Logging lebih informatif: 
  - `OpenTelemetryConfig` menulis log level `info/warn` pada branch test-skip dengan alasan skip.
  - Tambah counter sederhana (`init_skipped_total`) agar terlihat di metrics (non-throwing).

## Kompatibilitas Prisma di Test
- Buat Prisma shim untuk unit/integration: 
  - Implementasikan minimal `$transaction(cb)`, `$on(event, handler)` no-op, dan metode yang dipakai repositori (`upload`, `uploadPart`, dll.) sehingga storage tests tidak gagal.
  - Injeksi shim via provider `PrismaService` saat `NODE_ENV === 'test'` atau melalui `TestingModule.overrideProvider(...)`.
- Alternatif/reduksi coupling: 
  - Di repository, gunakan optional chaining dan fallback memori jika Prisma tidak tersedia pada test (tanpa mengubah produksi).

## Redirect Tests Stabil
- Bootstrap server untuk test yang butuh HTTP: 
  - Buat `vitest.e2e.config.ts` menyiapkan `NestFactory.create(AppModule)` pada `beforeAll`, pakai `supertest(app.getHttpServer())` ketimbang `fetch(BASE_URL)` untuk menghindari ECONNREFUSED.
- Jika perlu uji legacy path `/api/tools` (redirect), tambah controller ringan di test-app yang meniru redirect 301/302/307 dan validasi header `location`.

## A11y Lint Fixes (Prioritas Tinggi)
- Form label asosiasi: tambahkan `htmlFor/id` di komponen yang dilaporkan (MetaEvents*, Chat*, WorkflowBuilder, MFAForm, Reasoning*).
- Non-interaktif dengan click handlers: 
  - Ganti ke `<button>` atau berikan `role`, `tabIndex`, dan key handlers (`Enter/Space`) sesuai pedoman.
- Hapus roles redundan (`ul/li`): bersihkan definisi role eksplisit yang tidak diperlukan.
- Heading harus punya konten: review `Alert`/heading kosong dan isi label/teks.
- Tambah unit a11y tests (jest-axe) pada komponen bermasalah; masukkan ke pipeline.

## Penguatan RBAC Guards
- Terapkan `@UseGuards(JwtAuthGuard, RolesGuard)` konsisten di endpoint sensitif (selain AuthController) dan tambahkan `@Roles(...)` eksplisit.
- Tambah error handling: balikan `403` dengan payload terstruktur (`{ error: 'forbidden', code: 'RBAC_DENIED' }`).

## CI/CD Hijau
- Jobs: 
  - `lint-a11y`: jalankan `next lint`, parse output, gagal bila ada error a11y.
  - `test:unit` dan `test:e2e` (Playwright repeat) tetap, tambahkan `test:api-e2e` untuk bootstrap Nest server dan jalankan `supertest` suite.
- Artefak & monitoring: 
  - Simpan laporan lint (`lint-report.json`), unit/e2e summary, flakiness, dan tambahkan kalkulasi success rate; gagal bila < 95%.

## Dokumentasi
- Tambahkan README bagian Observability (test-mode guard) dan cara menjalankan API tests.
- A11y Styleguide: daftar aturan utama WCAG 2.1 yang diadopsi + contoh implementasi.
- Catat perubahan pada `CHANGELOG` per paket (api/web) terkait auth strategies, guards, a11y fixes.

## Validasi
- Jalankan unit+integration dengan prisma shim; pastikan storage tests lulus.
- Jalankan API E2E dengan `supertest`; pastikan redirect dan health lulus.
- Jalankan web E2E repeat; target ≥95% pass rate.

## Deliverables
- Kode perbaikan: guard observability, prisma shim, redirect tests stabil, a11y fixes.
- Dokumen perubahan dan panduan eksekusi tests.
- Laporan pipeline hijau (lint, unit, e2e, flakiness).