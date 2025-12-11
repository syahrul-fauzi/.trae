# Status Saat Ini
- Mock server siap: `tools/mock-webhook-server.js` (endpoint `/webhook`, `/metrics`, `/events`, `/reset`).
- Alerts API memiliki retry/backoff + test override: `apps/app/src/app/api/alerts/route.ts:35–71`.
- E2E Playwright: `apps/app/e2e/webhook-notifications.spec.ts` (skenario 200, 500→500→200, timeout, rate-limit).
- Coverage Vitest ≥90% untuk jalur notifikasi/alerts: `apps/app/vitest.config.ts:11–33`.
- Orkestrasi lokal: `pnpm -C apps/app e2e:webhook`. Workflow CI: `.github/workflows/e2e-notifications.yml`.
- Audit history (apps/web) tersedia dengan fallback in-memory: `apps/web/src/app/api/audit/history/route.ts:5–36`, store: `apps/web/src/app/api/_lib/audit-store.ts:22–35`.

# Kesenjangan dan Prasyarat
- Sinkronisasi skema metrik mock server dengan konsumen audit (apps/web) agar log dan filter seragam.
- Pastikan variabel lingkungan untuk Supabase diset di CI jika ingin sumber `db` pada audit.
- Hindari konflik port antara dev server dan webserver Playwright (gunakan `PLAYWRIGHT_SKIP_WEBSERVER=true`).

# Langkah Berikutnya
1. Tambah E2E untuk Audit History (apps/web)
- Buat Playwright spec yang memanggil `/api/audit/history` dengan kombinasi query: `tenant`, `status`, `sinceMs`, `untilMs`, `limit`.
- Verifikasi hasil dan sumber (`db` vs `memory`), termasuk batas `limit` dan urutan `ts`.

2. Integrasi pencatatan audit saat pengiriman webhook
- Saat memanggil `/api/alerts` pada E2E, tambahkan adapter pencatatan (in-memory) ke `audit-store` untuk mencatat endpoint, status, attempts.
- Pastikan format `AuditRecord` konsisten: `ts`, `tenant`, `endpoint`, `status`, `attempts`.

3. Perluas skenario notifikasi
- Payload besar (≥1MB), header khusus, dan multi-tenant paralel (memastikan isolasi tenant dan rate-limit per tenant).
- RBAC: skenario allow/deny untuk akses endpoint alerts.

4. Tingkatkan cakupan/coverage
- Unit test untuk cabang error DB di audit history (ketika Supabase error → fallback `queryAuditRecords`).
- Unit test untuk rate-limit headers di alerts.

# Pengujian
- Playwright: jalankan E2E untuk notifikasi dan audit; gunakan `PLAYWRIGHT_SKIP_WEBSERVER=true` untuk menghindari konflik port.
- Vitest: jalankan unit/integration untuk percabangan logika (alerts, audit-store).
- Validasi artifacts: `apps/app/playwright-report/**`, `apps/app/test-results/**`, `artifacts/mock-events.json`.

# Verifikasi
- Pastikan `X-Attempt-Id`/`Idempotency-Key` tercatat di events dan jumlah attempt sesuai backoff.
- Audit history mengembalikan record sesuai filter dan sumber (db/memory); urutan desc berdasarkan `ts` dan menghormati `limit`.
- Rate-limit di alerts mengembalikan `429` plus `X-RateLimit-*`.

# Dokumentasi
- Perbarui dokumen E2E untuk menambah bagian Audit History: cara uji, parameter query, dan contoh hasil.
- Tambahkan catatan env Supabase (opsional) untuk mode sumber `db`.

# Koordinasi
- Komunikasi ke tim backend soal format AuditRecord dan konsistensi header.
- Validasi pipeline CI apakah perlu menyalakan Supabase untuk sumber `db`; jika tidak, gunakan fallback `memory`.

# Risiko & Mitigasi
- Port konflik → pakai `PLAYWRIGHT_SKIP_WEBSERVER` dan skrip orkestrasi.
- Env Supabase tidak tersedia → fallback memory; tandai jelas di hasil `source`.
- Flaky timeout → gunakan delay terukur dan batas `AbortSignal.timeout` yang konsisten.

# Kriteria Penerimaan
- Semua skenario E2E (notifikasi + audit history) lulus.
- Coverage (lines/branches/functions/statements) ≥90% untuk module terkait.
- Artifacts tersedia (report Playwright, mock-events, coverage), dan dokumen diperbarui.