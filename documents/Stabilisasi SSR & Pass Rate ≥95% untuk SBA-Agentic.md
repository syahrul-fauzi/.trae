## Tujuan
- Mencapai dan mempertahankan pass rate ≥95% dengan menstabilkan SSR, mengurangi respons ≥400, dan memperkuat cakupan E2E.
- Menjaga konsistensi arsitektur, a11y, metadata, dan integrasi antar komponen sesuai standar codebase.

## Ruang Lingkup
- Rute App Router terautentikasi (`/(authenticated)/*`) dan halaman utama: `/monitoring`, `/settings`, `/knowledge`, `/integrations`, `/workspaces`, `/observability`, `/api-docs`.
- Endpoint kesehatan & pelaporan untuk diagnostik SSR.
- Konfigurasi Playwright: single-runner, baseURL konsisten, reporters (html/json/junit).

## Pekerjaan Utama
1) Identifikasi & Triage Error SSR
- Kumpulkan sampel respons ≥400 dari suite E2E (HTML report, junit, json). 
- Tinjau artefak Playwright (`apps/app/playwright-report`, `apps/app/test-results`).
- Korelasikan dengan rute: cek potensi referensi `window/document` di SSR, hook tanpa provider, atau guard auth yang agresif.

2) Patch Teknis (Implementasi Terarah)
- Provider Wrapping untuk halaman yang menggunakan hooks context (contoh `/monitoring`): pastikan `WebSocketProvider` dan `MonitoringProvider` membungkus dashboard.
- Guard SSR di `AuthenticatedLayout` agar aman saat SSR (hindari akses `document`/`window`; gunakan flag aman saat testing).
- Error Boundary Global (App Router) dengan pelaporan ke endpoint internal (`POST /api/error-report`).
- Endpoint SSR Health untuk diagnostik (`GET /api/_health-ssr`) guna memverifikasi env & konfigurasi.
- Robust error handling pada API routes: tangkap exception, kembalikan payload terstruktur, status yang tepat, tanpa membocorkan rahasia.

3) Pengujian & Verifikasi E2E
- Tambahkan/selaraskan test:
  - Smoke `/monitoring`: validasi `PageHeader` dan heading.
  - SSR Health: validasi `GET /api/_health-ssr` mengembalikan `ok: true`.
- Jalankan suite E2E tunggal dengan `PLAYWRIGHT_SKIP_WEBSERVER=true` dan baseURL konsisten (mis. `http://localhost:3001`).
- Reporter: `list, html, json, junit`; verifikasi artefak dan status keseluruhan.
- Analisis regresi: bandingkan sebelum/sesudah patch; fokus pada rute yang sebelumnya 4xx/5xx.

4) Konsistensi & Integrasi
- Pastikan setiap halaman memakai `generateBaseMetadata` (canonical, og:url) dan landmark a11y (header, main, breadcrumb).
- Selaraskan penggunaan `PageHeader` dan pola breadcrumbs agar idempotent di seluruh halaman.
- Jangan menambah dependensi eksternal; gunakan paket internal `@sba/ui` dan util yang ada.

5) Dokumentasi
- Perbarui `docs/tracking/tasks.json` dengan status, waktu, dampak.
- Tambah catatan teknis singkat: arsitektur, pola penanganan error, provider composition, pedoman SSR-safe.
- Ringkas hasil verifikasi (pass rate, error yang dihilangkan, sisa tindak lanjut bila ada).

## Risiko & Mitigasi
- Risiko: benturan server dev (EADDRINUSE) dan runner paralel.
  - Mitigasi: single-runner policy, gunakan satu baseURL; matikan runner lain sebelum eksekusi.
- Risiko: akses API rahasia/log membocorkan data.
  - Mitigasi: sanitasi payload error-report; hindari logging rahasia; status code yang tepat.

## Rencana Verifikasi
- Browser: Chromium, Firefox, WebKit.
- Laporan: buka `apps/app/playwright-report/index.html` dan artefak di `apps/app/test-results/`.
- Target: pass rate ≥95%; jika <95%, lakukan triage ulang pada test yang gagal dan tambahkan perbaikan spesifik.

## Permintaan Konfirmasi
- Apakah Anda menyetujui rencana ini? Jika ya, saya akan segera menerapkan patch (provider wrapping, guard SSR, error boundary, SSR health), menjalankan E2E tunggal, dan mengirimkan laporan serta pembaruan dokumentasi.