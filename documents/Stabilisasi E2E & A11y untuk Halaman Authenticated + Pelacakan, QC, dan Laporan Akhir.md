## Identifikasi Tugas Berjalan
- Tambahkan data-testid pada H1 di halaman authenticated untuk selector deterministik:
  - `apps/app/src/app/(authenticated)/settings/page.tsx` → H1 "Settings"
  - `apps/app/src/app/(authenticated)/knowledge/page.tsx` → H1 "Knowledge"
  - `apps/app/src/app/(authenticated)/integrations/page.tsx` → H1 "Integrations"
  - `apps/app/src/app/(authenticated)/workspaces/page.tsx` → H1 "Workspaces"
  - Opsional: `apps/app/src/app/workspaces/[workspace]/tasks/page.tsx` → H1 "Task Management"
- Sinkronkan E2E smoke pages agar menggunakan `getByTestId` untuk H1 di atas.
- Perkuat autentikasi E2E untuk rute authenticated (gunakan `POST /api/test-login` dan `storageState` cookie).
- Jalankan QC dengan multi-reporter (list, html, junit, json) dan trace on-first-retry.
- Dokumentasikan penyelesaian dan hasil pengujian; siapkan laporan akhir.

## Prioritas Penyelesaian
- Prioritas 1: Stabilkan E2E di halaman authenticated (blokir pipeline bila flakey).
- Prioritas 2: Autentikasi E2E yang konsisten (hindari redirect/missing heading).
- Prioritas 3: QC & artefak laporan untuk audit dan visibilitas.
- Prioritas 4: Dokumentasi dan rekomendasi tindak lanjut.

## Rencana Per-Pekerjaan
### 1) Tambah data-testid pada H1
- Edit H1 di masing-masing halaman untuk menambahkan `data-testid` yang deskriptif:
  - `settings-title`, `knowledge-title`, `integrations-title`, `workspaces-title` (opsional `tasks-title`).
- Pastikan tetap memenuhi a11y: heading hierarchy, `role`/`aria-label` bila relevan.

### 2) Update E2E smoke pages
- Ubah spesifikasi E2E untuk menggunakan `page.getByTestId('<route>-title')` dan `waitForLoadState('networkidle')`.
- Pertahankan fallback minimal pada robust spec bila diperlukan.

### 3) Perkuat autentikasi E2E
- Di global setup: panggil `POST /api/test-login` untuk set cookie `__test_auth=1`.
- Pastikan `playwright.config.ts` menggunakan `testIdAttribute: 'data-testid'`, `baseURL`, `storageState`.

### 4) QC dan verifikasi
- Jalankan lint, unit, dan E2E (Chromium/Firefox/WebKit) dengan reporters: list, html, junit, json; trace on-first-retry.
- Verifikasi:
  - H1 dengan `data-testid` terlihat pada tiap halaman authenticated.
  - Tidak ada redirect yang mematahkan test.
  - Artefak laporan terhasilkan dan dapat diakses.

### 5) Dokumentasi
- Catat perubahan file, alasan teknis (stabilisasi selector, a11y), dan dampak.
- Ringkas hasil pengujian dan status pass/fail per browser.

### 6) Laporan Akhir
- Daftar pekerjaan yang diselesaikan.
- Waktu penyelesaian aktual per pekerjaan.
- Hambatan dan solusi (mis. SSR boundary, server readiness, selector flakiness).
- Rekomendasi untuk pekerjaan sejenis (pattern testId, client/server boundary, Playwright config).

## Sumber Daya
- Perubahan di halaman Next.js dan spesifikasi E2E dalam `apps/app`.
- Konfigurasi Playwright sudah selaras; gunakan multi-reporter dan trace.

## Target Waktu
- Implementasi testId H1: 30–45 menit.
- Update dan verifikasi E2E smoke pages: 30–45 menit.
- Autentikasi E2E dan QC multi-browser: 40–60 menit.
- Dokumentasi & laporan: 20–30 menit.

## Pelacakan
- Setelah konfirmasi, dibuat daftar tugas terstruktur (tracking) dengan status: pending → in_progress → completed dan ringkasan ketika selesai.

## QC Standar Kualitas
- H1 deterministik dengan `data-testid` hadir dan terlihat.
- E2E pass di 3 browser dengan artefak laporan lengkap.
- Tidak ada a11y pelanggaran dasar terkait heading.
- Logging `POST /api/test-login` tetap berfungsi.

## Risiko & Mitigasi
- SSR/client boundary: gunakan "use client" hanya bila diperlukan.
- Server readiness: tunggu `networkidle` dan gunakan baseURL konsisten.
- Selector flakiness: gunakan `getByTestId` eksplisit pada heading.

Mohon konfirmasi rencana ini. Setelah disetujui, saya langsung implementasi, verifikasi, dan menyerahkan laporan lengkap sesuai poin 1–7.