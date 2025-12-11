# SBA-Agentic — E2E Test Cases Prioritas

## 1) Login → Dashboard
- Tujuan: Verifikasi autentikasi sukses dan navigasi ke dashboard dengan komponen inti tampil.
- Data uji: `admin@example.com / demo123` (demo), kredensial salah `user@example.com / wrongpass`.
- Langkah & Ekspektasi:
  - Isi form login, submit, redirect ke `/dashboard`.
  - Komponen tampil: `dashboard-main`, `dashboard-header`, `dashboard-alerts`, `dashboard-metrics`, `dashboard-runs-panel`, `dashboard-grid`, `dashboard-insights`, `dashboard-activity`.
  - Negative: kredensial salah menampilkan error di `alert-text`.
- File: `apps/web/e2e/auth-dashboard-flow.spec.ts`.

## 2) Chat Stream & Tipe Konten
- Tujuan: Uji pengiriman pesan real-time, bubble chat, histori, dan konten multimodal (teks, gambar, file).
- Data uji: Pesan teks “Hello E2E”, skenario demo multimodal di halaman `demo/multimodal-integration`.
- Langkah & Ekspektasi:
  - Mulai percakapan di `/chat`, kirim pesan, bubble muncul (`data-testid^=chat-message-`).
  - Mock `POST /api/agui/chat` untuk respons deterministik.
  - Gambar dengan alt “Uploaded image” terlihat; file `quarterly-report.pdf` terlihat.
- File: `apps/web/e2e/chat-stream.spec.ts`, `apps/web/e2e/chat-content-types.spec.ts`.

## 3) Health Check & Metrics
- Tujuan: Verifikasi status health dan metrik Prometheus serta alerting UI.
- Data uji: Header `authorization`, `x-tenant-id`, `x-timestamp` untuk health; tanpa header untuk variasi status.
- Langkah & Ekspektasi:
  - `/api/health` mengembalikan status 200/400/401 dengan header `Server-Timing`.
  - `/api/metrics/prometheus` mengandung `# TYPE` dan metrik seperti `web_health_request_duration_seconds`.
  - Komponen alerting di dashboard (`dashboard-alerts`) terlihat.
- File: `apps/web/e2e/health-metrics-alerting.spec.ts`.

## Integrasi CI
- Workflow: `.github/workflows/ci.yml` menjalankan lint → type-check → unit tests → build → Playwright e2e (`apps/web`).
- Menjalankan lokal: `bash scripts/ci/verify.sh` atau `pnpm -C apps/web exec playwright test`.

## Catatan
- Semua test memiliki assertion eksplisit, mencakup positive & negative cases, dan menggunakan data uji representatif.
