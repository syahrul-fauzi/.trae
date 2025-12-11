## Tujuan
- Membangun E2E webhook lengkap untuk modul notifikasi: server mock lokal, pengukuran retry/timeout, penyimpanan payload, simulasi status (200/400/500/timeout), suite Playwright, dan pelaporan coverage (line/branch/function/condition) ≥90%.

## Mock Server Lokal
- Buat server mock (Node) dengan rute `POST /webhook` dan opsi:
  - Konfigurasi respons via query/env: `?status=200|400|500|timeout`, `?delayMs=...` untuk simulasi timeout.
  - Penyimpanan payload setiap request (in-memory array) dengan struktur: `{ts, headers, body, statusSent, delayMs}`.
  - Penghitungan metrik: total hits, per-status counts, retry count (diukur dari header/idempotency token/Attempt-Id), timeout count (request yang tidak sempat dijawab sebelum batas waktu klien).
  - Rute observasi: `GET /metrics` dan `GET /events` untuk mengambil ringkasan dan log mentah selama test.
  - Jalankan di port tetap (mis. `localhost:4010`) agar stabil untuk Playwright.

## Orkestrasi E2E
- Test memanggil API scheduling (`/api/notifications/schedule`) dengan payload yang mengarah ke channel webhook, lalu menjalankan worker (Edge Function) secara tersimulasikan (mock call) atau memicu jalur pengiriman yang memakai URL mock server.
- Alternatif untuk E2E yang lebih langsung: panggil util pengirim (`sendAuditWithRetry`) atau endpoint alarm `/api/audit/alerts` dengan webhook URL mock server dan verifikasi perilaku retry/backoff.

## Skenario Test Playwright
- Sukses 200: mock server mengembalikan 200, verifikasi `delivery_logs` dan status `delivered`.
- Error 400/500: mock server mengembalikan 400/500, verifikasi retry backoff bertambah dan status tetap `pending` atau `failed` setelah max attempts.
- Timeout: mock server menunda jawaban melewati timeout klien, verifikasi pencatatan timeout dan retry.
- Retry mechanism: berikan urutan status (500 → 500 → 200) dan pastikan upaya ke-3 sukses, delay sesuai backoff.
- Rate limiting: uji endpoint `/api/audit/webhook` atau jalur lain yang memiliki rate limit; kirim >limit permintaan dan verifikasi 429 + header rate limit.
- Payload formats: kirim variasi payload (kecil/besar/JSON nested, headers khusus) dan verifikasi disimpan utuh oleh mock server.
- Setup/teardown: `beforeAll` menyalakan mock server, `afterAll` mematikannya dan melakukan cleanup.

## Coverage Terperinci
- Konfigurasi Vitest coverage (V8) untuk modul notifikasi:
  - Collect coverage dari: `apps/web/src/app/api/notifications/**/*`, `apps/web/src/app/api/_lib/*`, worker terkait bila terpisah.
  - Aktifkan metrics: lines, branches, functions, statements; threshold global ≥90%, dan threshold per-file untuk folder notifikasi.
- Condition coverage: tambahkan test untuk cabang kondisi (validasi payload, jadwal jam kerja, RBAC allow/deny, error DB) untuk menaikkan branch coverage.
- Playwright E2E tidak otomatis memberikan coverage aplikasi; kompensasi dengan unit/integration test yang menargetkan jalur kode yang sama.
- Simpan laporan ke `artifacts/coverage/` (HTML + JSON) untuk CI upload.

## Logging & Monitoring
- Penambahan log detail di worker/pengirim: attempt number, delay backoff, respons status, error message.
- Mock server mencatat timestamp masuk/keluar untuk menghitung latency dan timeout.
- Endpoint `GET /metrics` mengembalikan ringkasan metrik untuk assertion E2E.

## Error Handling
- Fail fast pada mis-konfigurasi env (URL/keys) dengan status 500 terstruktur.
- Pada retry habis (max attempts): set status `failed`, catat log terakhir.
- Validasi payload/headers pada channels/templates/preferences (sudah diuji di unit tests); tambahkan kasus edge (email kosong, webhook tanpa URL, headers tidak valid).

## CI/CD Integrasi
- Tambah job `e2e-notifications` menjalankan:
  - Start mock server
  - Jalankan suite Playwright notifikasi
  - Upload `artifacts/coverage` dan `artifacts/mock-events.json`.
- Gating: coverage modul notifikasi ≥90% dan semua skenario E2E lulus.

## Deliverables
- Mock server file (Node) + instruksi run.
- Suite Playwright notifikasi dengan skenario 200/400/500/timeout/retry/rate-limit/payload formats.
- Konfigurasi coverage Vitest dengan threshold.
- Dokumentasi setup & eksekusi, termasuk cara menjalankan di lokal/CI.

## Langkah Implementasi
1. Buat mock server (`tools/mock-webhook-server.js`): rute `/webhook`, `/metrics`, `/events`; dukung status/timeout/delay; penyimpanan in-memory + export log ke file saat diminta.
2. Tambah Playwright test file (`apps/web/tests/notifications.e2e.spec.ts`): setup server, jalankan skenario, assert metrik/log.
3. Tautkan pipeline pengirim ke mock server: gunakan channel webhook dengan `webhookUrl` mock.
4. Tambah konfigurasi coverage Vitest (threshold & collectCoverageFrom) untuk modul notifikasi; pastikan unit/integration menutupi cabang logika.
5. Dokumentasi di `.trae/documents/Implementasi E2E Webhook Notifikasi (Mock Server, Coverage, Playwright).md`: langkah setup, menjalankan mock server, menjalankan tests, membaca laporan.
6. Tambah job CI khusus untuk E2E notifikasi; upload coverage HTML & JSON.

## Edge Cases & Bisnis Kritis
- Payload besar (≥1MB), header kustom, percobaan paralel multi-tenant.
- Penjadwalan di luar jam kerja → pending lalu kirim saat jam kerja.
- Rate limit per-tenant/origin/IP → verifikasi header dan audit deny.

## Konfirmasi
- Setelah menyetujui rencana, saya akan membuat mock server, menulis suite Playwright, mengonfigurasi coverage, dan menambahkan dokumentasi serta job CI agar implementasi dapat dijalankan dan diverifikasi end-to-end.
\
## Status Implementasi
- Mock server tersedia: `tools/mock-webhook-server.js` dengan endpoint `POST /webhook`, `GET /metrics`, `GET /events`, `POST /reset`; mendukung `status`, `sequence`, dan `delayMs`; menyimpan payload dan header percobaan.
- Alerts API mendukung retry/backoff dan test override: `apps/app/src/app/api/alerts/route.ts` (header `X-Attempt-Id`, `Idempotency-Key`, rate limit 429 untuk uji).
- Playwright E2E siap: `apps/app/e2e/webhook-notifications.spec.ts` (skenario 200, 500→500→200, timeout→200, rate-limit dengan validasi header).
- Orkestrasi lokal: `tools/e2e/run-webhook-suite.js` dan script `pnpm -C apps/app e2e:webhook`.
- Coverage Vitest ≥90% di `apps/app/vitest.config.ts` untuk jalur notifikasi/alerts.
- CI Workflow: `.github/workflows/e2e-notifications.yml` menjalankan suite dan mengunggah artifacts.

## Setup & Eksekusi
- Satu perintah lokal: `pnpm -C apps/app e2e:webhook` (menyalakan app pada `http://localhost:3001`, menyalakan mock pada `http://localhost:4010`, menjalankan Playwright, ekspor events ke `artifacts/mock-events.json`).
- Manual alternatif:
  - App: `pnpm -C apps/app dev -p 3001`
  - Mock: `node tools/mock-webhook-server.js`
  - E2E: `PLAYWRIGHT_SKIP_WEBSERVER=true PLAYWRIGHT_BASE_URL=http://localhost:3001 pnpm -C apps/app test:e2e -- e2e/webhook-notifications.spec.ts --project=chromium`
- CI: Workflow `e2e-notifications` menjalankan `pnpm -C apps/app e2e:webhook` dan mengunggah `apps/app/playwright-report/**`, `apps/app/test-results/**`, serta `artifacts/mock-events.json`.

## Artifacts
- Playwright report: `apps/app/playwright-report/` dan `apps/app/test-results/`.
- Mock events: `artifacts/mock-events.json`.
- Coverage (V8): `apps/app/coverage/`.
