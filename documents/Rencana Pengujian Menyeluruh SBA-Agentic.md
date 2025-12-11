## Tujuan & Cakupan
- Memverifikasi fungsionalitas utama, integrasi modul, alur kerja end-to-end, edge cases, performa, dan keamanan sesuai spesifikasi.
- Ruang lingkup: apps/app (Next 15), apps/web (Next 14), apps/api (Nest/tsc), packages (kv, supabase, ui), proxy Web→App untuk `knowledge/*`, middleware rate-limit & security headers, RBAC penuh pada production.

## Lingkungan & Persiapan
- Node 20.x, pnpm 8.
- Build monorepo: `pnpm build`.
- Jalankan server:
  - App: `pnpm -C apps/app dev` (PORT=3001), env production untuk RBAC ketat (dapat dimock di staging).
  - Web: `pnpm -C apps/web dev` (PORT=3000), set `KB_ORIGIN=http://localhost:3001` untuk proxy.
  - API: `pnpm -C apps/api dev` bila diperlukan.
- Variabel: `BASE_URL`, `KB_ORIGIN` untuk E2E Web.

## Matriks Pengujian
- Fungsional: Health, Knowledge Search/Cache, Alerts/Notifications/Workflows, Metrics (Prometheus), Worker Metrics UI.
- Integrasi: Proxy Web→App, cache in-memory + KV (dist), invalidasi prefix setelah mutasi, RBAC, rate-limit.
- E2E: Alur login (dev), penelusuran knowledge, pembuatan workflows/notifications, observability dashboard.
- Edge Cases: rate-limit 429, RBAC 403, payload invalid 400, cache TTL kadaluarsa, CORS preflight OPTIONS.
- Performa: latensi p95 endpoint utama, throughput sederhana, cache hit-rate.
- Keamanan: security headers, CSP, HSTS, X-Frame-Options, nosniff, RBAC denial by default.

## Rencana Pengujian Fungsional
1. Health
- `GET /health` (App) dan `/api/health` (Web) → 200, payload `{ ok: true }`.
2. Knowledge Search + Cache
- `GET /api/knowledge/search-cached?q=cacheme` dua kali:
  - Pertama: `X-Cache: miss`, kedua: `X-Cache: hit` (TTL 5 detik).
- Edge TTL: tunggu >5s, pastikan kembali `miss`.
3. Mutasi & Invalidasi
- `POST /api/knowledge/upsert` → sukses 200, invalidasi prefix `tenant:dev:knowledge:`; panggil search lagi → `miss` lalu `hit`.
- `POST /api/notifications` / `POST /api/workflows` → invalidasi prefix masing-masing.
4. Metrics Prometheus (App/Web)
- `GET /api/metrics/prometheus` → format text exposition valid; parse via helper; buckets/histograms/gauges muncul.
5. Worker Metrics UI (Web)
- Halaman `/admin/worker-metrics` menampilkan throughput/error ratio; parsing metrik workers (mock/snapshot) → grafik & tabel terbentuk.

## Pengujian Integrasi
- Proxy Web→App
  - Akses `/api/knowledge/*` di Web → diproxy ke App menggunakan `KB_ORIGIN`; pastikan header `X-Proxy: apps-web` dan `Cache-Control: no-store` ada.
- Cache + KV
  - Saat miss, payload disimpan in-memory dan KV (dist) → cek `@sba/kv` ekspor terpakai tanpa error.
- Middleware Rate-Limit
  - Kirim >100 request/menit ke jalur API → respon 429, header limit sesuai (`X-RateLimit-*`).
- RBAC
  - Tanpa session (prod-like), mutasi harus 403; dengan session role sesuai, 200.

## E2E Workflow
- Alur pengguna: login (dev), masuk knowledge → buat upsert → pencarian → verifikasi cache & invalidasi → lihat monitoring metrics.
- Observability: akses dashboard metrics & halaman worker metrics tanpa error.

## Edge Cases
- Payload invalid (schema zod) → 400 dengan detail issues.
- OPTIONS preflight pada API → 204 dengan CORS headers.
- RBAC: role `guest` ditolak untuk mutasi; role `admin` diizinkan.
- Rate-limit: verifikasi reset & remaining.

## Performa
- Latensi p95 endpoint: `/api/knowledge/search-cached`, `/api/metrics/prometheus`.
- Cache effectiveness: hit-rate sebelum/sesudah restart; TTL expiry; ukuran payload tipikal.
- Tools (opsional): k6 skenario ringan; logging internal latensi, gunakan helper.

## Keamanan
- Security headers pada semua response (middleware): CSP/HSTS/XFO/nosniff.
- RBAC production: cookie role diabaikan; hanya session.
- Audit: catat deny events (403) & rate-limit (429) untuk metrik.

## Cara Menjalankan Pengujian
- Functional/API manual: curl/httpie terhadap endpoint di atas.
- E2E Web (Playwright):
  - Set `BASE_URL=http://localhost:3000`, `KB_ORIGIN=http://localhost:3001` saat App & Web aktif.
  - Jalankan: `pnpm -C apps/web exec playwright test apps/web/e2e/metrics-smoke.spec.ts apps/web/e2e/cache-xcache.spec.ts`.
- Rate-limit test: script kecil kirim 120 request dalam 60 detik; verifikasi 429 & headers.

## Kriteria Penerimaan
- Semua endpoint fungsional tanpa error; RBAC & rate-limit berjalan.
- Performa: latensi p95 sesuai baseline (mis. <300ms untuk cached search di dev).
- UX: halaman utama, knowledge, worker metrics, observability tidak error; grafik & tabel tampil.
- Keamanan: header lengkap; CSP tidak memblokir aktifitas yang diizinkan.

## Artefak & Dokumentasi
- Laporan pengujian: `docs/ops/Validation-Report-YYYYMMDD.md` (hasil, bug & solusi, screenshot).
- Security policy: `docs/SECURITY_ENDPOINTS.md` (sudah diperbarui, tambahkan hasil audit ringkas).
- Catatan konfigurasi: `README.md` bagian proxy & observability.

## Rencana Rollback & Monitoring
- Middleware dapat dinonaktifkan cepat jika ada regresi; matcher API dapat dibatasi.
- Monitoring dampak performa: pantau latensi & rate-limit hits; sesuaikan LIMIT jika perlu.

Konfirmasi untuk menjalankan pengujian sesuai rencana ini. Setelah disetujui, saya akan mengeksekusi test, mencatat hasil, memperbaiki bug yang ditemukan, dan menyusun laporan lengkap.