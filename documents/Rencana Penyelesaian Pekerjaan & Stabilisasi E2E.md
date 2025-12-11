## Identifikasi Tugas Aktif
- Stabilisasi E2E (meta & a11y) untuk Workspaces/Runs yang masih gagal akibat timeout & login.
- Orkestrasi server Playwright (webServer) dan environment alignment (`PLAYWRIGHT_BASE_URL`, `NEXT_PUBLIC_APP_URL`).
- Pelaporan & artefak: ringkasan eksekusi `summary.json` + validasi schema; konsolidasi Axe artifacts.
- Dokumentasi tambahan untuk API Orchestrator (apps/api) agar konsisten dengan modul apps/app.

## Prioritas
- P1: Stabilkan E2E Workspaces/Runs (deadline terdekat, berdampak pada gate CI).
- P2: Orkestrasi server otomatis di Playwright + cookie auth test; kurangi kompleksitas login.
- P3: Pelaporan eksekusi (summary generator) + validator Ajv sebagai gate.
- P4: Dokumentasi API & proses (technical spec, user manual, troubleshooting, changelog).

## Langkah Penyelesaian per Tugas
- E2E Workspaces/Runs:
  - Perbarui `playwright.config` untuk mengaktifkan `webServer` dengan port dari `PLAYWRIGHT_BASE_URL`.
  - Set `use.env` (`NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_PREVIEW_ALLOW_GUEST=true`) dan `storageState` cookie `__test_auth`.
  - Lunakkan `global.setup`: teruskan bila `test-login` gagal; pastikan `api/health` siap.
  - Perbaiki tes meta: tambahkan `await page.waitForSelector('link[rel="canonical"]')` sebelum assert.
- Orkestrasi server & env:
  - Paksa reuseExistingServer=false dan start dev `pnpm dev -p <port>` via Playwright.
  - Sinkronkan base URL untuk head tags & canonical melalui helper metadata.
- Pelaporan ringkasan:
  - Tambah skrip `scripts/build-summary.js` untuk mengagregasi `test-results/results.json` → `playwright-report/run-logs/summary.json`.
  - Jalankan validator `scripts/validate-summary.js` (thresholds performa/flakiness & a11y).
- Dokumentasi API Orchestrator:
  - Lengkapi README apps/api dengan endpoints kunci, auth, rate limit, dan contoh curl.
  - Sinkronkan dengan `apps/app/docs/final-deliverables.md` bagian API.

## Alokasi Sumber Daya & Target Waktu
- E2E Stabilisasi: 1 orang, 0.5 hari.
- Orkestrasi server & env: 1 orang, 0.25 hari.
- Pelaporan & validator: 1 orang, 0.25 hari.
- Dokumentasi API: 1 orang, 0.25 hari.

## Sistem Pelacakan
- Buat tracker markdown: `apps/app/docs/progress-tracker.md` dengan kolom: Task, Status, Owner, Deadline, Risiko, Catatan.
- Pemetaan ke Issues/GitHub Labels: `e2e-stabilization`, `metadata`, `a11y`, `docs`.

## Quality Control
- Jalankan `test:unit`, `test:integration`, `playwright` (meta & a11y) per browser, hasil harus hijau.
- Validasi `summary.json` via Ajv (strict mode) dan konfirmasi `axe-violations.json` ≤ threshold.
- Lighthouse pada halaman kritikal (Dashboard/Observability) untuk memastikan tidak ada regresi performa.

## Dokumentasi Penyelesaian
- Update `final-deliverables.md` dengan langkah eksekusi & hasil.
- Tambah perubahan pada `CHANGELOG.md` dan apps/api README.
- Simpan artefak laporan Playwright (HTML/JUnit/JSON) dan Axe.

## Laporan Akhir (Isi)
- Daftar pekerjaan diselesaikan: migrasi metadata & a11y, penambahan spesifikasi E2E, stabilisasi Workspaces/Runs, pelaporan ringkasan & validator, dokumentasi API.
- Waktu penyelesaian per tugas dan total.
- Hambatan (readiness server, login E2E) dan solusi (webServer, cookie auth, waitForSelector).
- Rekomendasi: gunakan storageState untuk test auth; pisah tes rute publik vs authenticated; jalankan server via Playwright untuk konsistensi CI.

## Kriteria Penyelesaian
- Semua tes unit/integration/E2E lulus; `summary.json` tervalidasi; Lighthouse tidak menandai regresi besar; dokumentasi lengkap dan konsisten dengan implementasi.