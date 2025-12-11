# Status & Konteks
- E2E webhook notifikasi sudah berjalan (mock server, retry/backoff, rate-limit uji, artifacts). Rujukan: `apps/app/src/app/api/alerts/route.ts:35–71`, mock server `tools/mock-webhook-server.js`.
- Audit History API (apps/web) memiliki fallback in-memory dan rute: `apps/web/src/app/api/audit/history/route.ts:5–36`; store: `apps/web/src/app/api/_lib/audit-store.ts:22–35`.
- Audit in-memory store untuk apps/app tersedia: `apps/app/src/app/api/_lib/audit-store.ts` dan sudah dipakai oleh alerts.

# 1) Perluasan Skenario E2E Notifikasi
## Payload Besar (≥1MB)
- Tambahkan skenario Playwright untuk mengirim payload 1–5MB ke `/api/alerts` dengan `webhookUrl` mock.
- Ukur:
  - Durasi end-to-end (waktu respons) dan jumlah retry.
  - Ukuran payload tercatat di mock (`events`), tambahkan field `bodySize` dan `latencyMs` pada mock.
- Validasi:
  - Respons `200`/retry sesuai backoff; tidak terjadi crash/memory leak.
  - Batas ukuran (jika ada) terdokumentasi; jika belum, tambahkan guard di alerts (mis. `Content-Length`/ukuran body set). 
- Implementasi: update `tools/mock-webhook-server.js` (menambah `bodySize`, `latencyMs`), tambah spec baru `apps/app/e2e/webhook-large-payload.spec.ts`.

## Header Khusus
- Uji kombinasi header kustom yang dikirim via alerts → forwarded ke mock.
- Validasi parsing dan penanganan: pastikan mock menangkap header (sudah menyimpan `req.headers`).
- Edge: header invalid/missing; pastikan sistem tidak gagal dan mencatat audit.
- Implementasi: tambahkan opsi test untuk `headersOverride` di body alerts (menambah forwarding), dan E2E assertions pada `events.headers`.

## Multi-Tenant Paralel
- Uji 10+ tenant bersamaan mengirim ke `/api/alerts`.
- Verifikasi isolasi: data dan konfigurasi per tenant; rate limit per tenant.
- Stress test: jalankan `Promise.all` 10+ request dengan `X-Tenant-ID` berbeda.
- Monitoring: catat jumlah permintaan per tenant dan status; pastikan tidak saling ganggu.
- Implementasi: ubah rate-limit di alerts dari global map ke per-tenant map (rujukan global saat ini `apps/app/src/app/api/alerts/route.ts:31–34`). Tambahkan E2E `apps/app/e2e/webhook-multitenant.spec.ts`.

# 2) Penambahan Unit Tests
## Audit History Fallback/Error (apps/web)
- Mock Supabase (`@supabase/supabase-js`) agar `select` gagal, verifikasi fallback `queryAuditRecords` dipakai.
- Uji jalur sukses `db` jika env tersedia; uji error handling dan recovery flow.
- Pastikan logging saat error (response `source: 'memory'` dan `error`).
- Implementasi: `apps/web/src/app/api/audit/history/__tests__/route.test.ts` dengan environment `node`.

## Rate-Limit Headers (apps/app)
- Unit test untuk `/api/alerts`:
  - Kirim >limit permintaan dengan `x-test-override: true` dan verifikasi `429` serta header `X-RateLimit-*`.
  - Uji variasi threshold dengan konfigurasi konstanta berbeda; siapkan injeksi konstanta via env atau parameter untuk test.
- Implementasi: `apps/app/src/app/api/alerts/__tests__/route.ratelimit.test.ts` (environment node), memanggil langsung fungsi `POST`.

# 3) Sinkronisasi Skema AuditRecord
## Audit Menyeluruh
- Inventarisasi skema audit di app/web: 
  - App: `apps/app/src/app/api/_lib/audit-store.ts` (ts, tenant?, origin?, ip?, endpoint, status, payload?, attempts?).
  - Web: `apps/web/src/app/api/_lib/audit-store.ts` (struktur setara).
- Dokumentasikan perbedaan (penamaan, tipe opsional, field tambahan).

## Migrasi & Shared Types
- Buat shared type `AuditRecord` di `packages/shared-audit/src/types.ts` agar dipakai kedua app.
- Migration script (opsional) untuk menormalisasi catatan lama (penyesuaian field/indeks di Supabase/Prisma).
- Constraints/validasi: wajib `ts`, `endpoint`, `status`; opsional `tenant`, `attempts`.
- Indexing: indeks komposit (`tenant`, `ts` desc), indeks `status`.
- Middleware validasi: sebelum write audit, validasi terhadap shared type.
- Integration tests: kirim log dari kedua app dan uji filter konsisten.

# Dependensi & Prasyarat
- Playwright dan vitest tersedia; jalankan app di `http://localhost:3001` dan mock `http://localhost:4010`.
- Pastikan tidak ada konflik port; gunakan `PLAYWRIGHT_SKIP_WEBSERVER=true` untuk E2E.
- Opsional Supabase env untuk audit history sumber `db`; jika tidak tersedia, fallback `memory` tetap diuji.

# Verifikasi & Kriteria Penerimaan
- E2E payload besar dan header khusus lulus; retry/backoff berfungsi; events menyimpan `bodySize` dan header.
- Multi-tenant: rate-limit per tenant berfungsi; isolasi data dan konfigurasi terverifikasi untuk ≥10 tenant.
- Unit tests: audit history fallback dan alerts rate-limit lulus.
- Shared `AuditRecord` digunakan lintas app; middleware validasi aktif; integration tests konsisten.
- Coverage tetap ≥90% untuk modul terkait; artifacts tersedia: Playwright report, `artifacts/mock-events.json`, dan coverage V8.

# Risiko & Mitigasi
- Memory spikes pada payload besar → batasi ukuran di alerts dan ukur `latencyMs`/`bodySize` di mock.
- Flaky timeouts → kontrol `delayMs` dan `AbortSignal.timeout`.
- Perbedaan skema lintas app → shared type dan middleware untuk konsistensi.

# Output yang Diharapkan
- Spec E2E tambahan (payload besar, header custom, multi-tenant), unit tests (audit history, rate-limit), shared type `AuditRecord`, middleware validasi, dokumentasi perbedaan skema dan strategi indeks, serta laporan verifikasi yang memenuhi kriteria penerimaan.