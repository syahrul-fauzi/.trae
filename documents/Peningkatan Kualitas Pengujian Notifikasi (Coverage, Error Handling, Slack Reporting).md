## Target Coverage & Peningkatan Bertahap
- Naikkan threshold coverage di `apps/web/vitest.config.ts`:
  - Tahap-1: lines/functions/statements ≥ 85%, branches ≥ 80%
  - Tahap-2 (setelah stabil): lines/functions/statements ≥ 90%, branches ≥ 85%
- Tambahkan gating di CI untuk memblokir merge jika coverage < threshold (lanjutkan dari langkah gate 80% yang sudah ada).

## Test Deterministik Error Handling Worker
- Tambahkan unit tests untuk worker route di `apps/web/src/app/api/notifications/worker/run/__tests__/route.errors.test.ts`:
  - Simulasi respon beruntun non-200 (400/500) dan timeout (mock `fetch` + `computeBackoffMs` → 0ms).
  - Verifikasi:
    - Header `x-attempt-id` bertambah sequential sesuai attempt.
    - Update DB: status `pending` → `failed` saat mencapai `maxAttempts`; `delivered` saat akhirnya sukses.
    - Logging ke `delivery_logs` per attempt.
  - Gunakan `vi.useFakeTimers()` bila perlu untuk kontrol waktu (deterministik, paralel aman).
- Tambahkan test untuk retryFetch di `apps/web/src/app/api/_lib/__tests__/retryFetch.headers.test.ts` (yang sudah ada) diperluas:
  - Kasus 400/500, timeout (throw/catch), sequential header, fail di maxAttempts.

## Pelaporan Coverage di Slack
- Perluas workflow `.github/workflows/e2e-notifications.yml`:
  - Ekstrak coverage dari `apps/web/coverage/coverage-final.json` (jq): lines/functions/branches/statements.
  - Cari file/modul dengan coverage terendah: sort by `lines.pct` naik.
  - Hitung delta coverage vs build sebelumnya (fallback: tampilkan current bila tidak ada artifact perbandingan).
  - Kirim notifikasi Slack (rtCamp/action-slack-notify) berisi:
    - Persentase coverage terkini + delta
    - Ringkasan tests passed/failed
    - Link artefak: `notifications-coverage`, mock logs dan Playwright report.
    - Rekomendasi area peningkatan (top 3 file dengan coverage terendah).

## Otomatisasi & Alerts
- Tambahkan workflow terjadwal (cron) `e2e-notifications-weekly.yml`:
  - Menjalankan suite notifikasi secara reguler (harian/mingguan).
  - Coverage gate dan notifikasi Slack bila turun di bawah threshold.
- Pertahankan gating coverage di pipeline (fail jika di bawah threshold tahap aktif).

## Dokumentasi
- Perbarui `docs/notifications-worker.md` dan `apps/web/README.md`:
  - Prosedur menjalankan unit/integration/E2E notifikasi.
  - Prasyarat env (Supabase, mock server), konfigurasi CI secrets.
  - Matriks error handling (400/500/timeout), cara troubleshooting flakiness.
  - Format notifikasi Slack dan contoh payload; lokasi artefak coverage & report.

## Implementasi Teknis Ringkas
- Kode & paths:
  - Threshold: `apps/web/vitest.config.ts:29-39` (coverage.thresholds)
  - Tests baru: `apps/web/src/app/api/notifications/worker/run/__tests__/route.errors.test.ts`
  - Slack step: `.github/workflows/e2e-notifications.yml` (tambahkan step parse coverage + post Slack)
  - Cron workflow: `.github/workflows/e2e-notifications-weekly.yml`
  - Docs: `docs/notifications-worker.md`, `apps/web/README.md`

## Konfirmasi
- Setelah disetujui, saya akan menambah tests error deterministik, menaikkan threshold bertahap, memperluas Slack reporting, membuat workflow terjadwal, dan memperbarui dokumentasi. 