## Tujuan & Cakupan
- Menuntaskan migrasi import UI di `apps/app`, membersihkan seluruh error/warning type‑checking.
- Mengaktifkan dan mengeksekusi suite E2E web (Playwright) dengan artefak lengkap (log, screenshot, video).
- Memverifikasi Grafana/Prometheus lokal dan mendokumentasikan metrik (latency p95/p99, throughput, error rate) beserta screenshot.
- Menyusun laporan lanjutan yang terstruktur dengan tautan ke semua artefak dan baseline metrik rilis.

## Migrasi UI & Type‑Checking
- Audit import: Cari semua `from '@sba/ui/*'` di `apps/app/src/**` dan cocokkan dengan ekspor resmi pada `packages/ui/package.json` (subpath `button`, `card`, `select`, dsb.).
- Normalisasi import:
  - Ganti import tidak konsisten ke subpath ekspor resmi atau re‑export internal (`src/shared/ui/index.ts`) untuk bundel komponen umum.
  - Pastikan `tsconfig.json` memakai `moduleResolution: 'bundler'` dan alias path mengarah ke `dist` types paket UI.
- Pengetikan handler eksplisit:
  - Gunakan tipe `React.ChangeEvent<HTMLInputElement>`, `React.MouseEvent<HTMLButtonElement>`, dan `string` pada `onValueChange` untuk select.
  - Tinjau form/dashboard (RunConfigForm, TaskForm, TaskList, dsb.) dan tambahkan tipe yang tepat.
- Kriteria selesai:
  - `pnpm type-check` di root monorepo lulus tanpa error/warning penting.

## Testing End‑to‑End (Playwright)
- Evaluasi cakupan: Identifikasi critical path web (login, health API, agui/chat, audit webhook, metrics sink) dan pastikan memiliki test.
- Penambahan test:
  - Buat/aktifkan specs Playwright untuk skenario kritis, set environment (JWT, tenant header) sesuai kebutuhan.
- Eksekusi:
  - Jalankan `pnpm -C apps/web test:e2e` (opsi reporter `html`/`list`/`json` bila dibutuhkan untuk artefak).
- Artefak:
  - Log eksekusi (stdout/stderr tersimpan ke file), screenshot per langkah penting, video rekaman setiap kasus.
  - Publish report HTML dan simpan di `apps/web/playwright-report/**`.
- Kriteria selesai:
  - Semua test berjalan dan lulus di lingkungan pengujian; artefak tersedia dan tervalidasi.

## Pemantauan Grafana & Prometheus
- Verifikasi datasource:
  - Prometheus scrape endpoint lokal: `/api/metrics/prometheus` dan `/api/health/metrics`.
- Screenshot dashboard:
  - Ambil gambar panel yang menampilkan: latency p95/p99 (health), throughput (agui_chat/k6), error rate (audit/k6).
- Validitas data:
  - Pastikan panel menampilkan nilai terkini sesuai eksekusi E2E/k6; catat timestamp.

## Dokumentasi
- Laporan lanjutan: `docs/Rencana Penyelesaian Migrasi UI, Type‑Checking, E2E, dan Grafana.md`
  - Ringkasan perubahan & migrasi import, hasil type‑checking (status), daftar masalah dan solusi.
  - Hasil pengujian (jumlah test, success rate), tautan report/screenshot/video.
  - Analisis metrik performa pra/pasca (p95/p99, throughput, error rate) dan baseline rilis.
  - Tautan artefak: `tools/loadtest/out/*`, `apps/web/playwright-report/*`, screenshot Grafana.

## Risiko & Mitigasi
- Banyak file UI terpengaruh: lakukan migrasi bertahap dengan codemod aman + review diff.
- Perubahan import memicu error runtime: jalankan `type-check` dan dev build lokal untuk verifikasi sebelum E2E.
- Data monitoring kosong: jalankan k6 atau E2E untuk menghasilkan metrik sebelum mengambil screenshot.

## Kriteria Penyelesaian
- Type‑checking root lulus tanpa error/warning kritis.
- E2E web lulus; artefak (log/screenshot/video/report) lengkap dan disimpan.
- Screenshot Grafana valid (p95/p99, throughput, error rate) dan dilampirkan di laporan.
- Laporan terbit dengan tautan artefak dan baseline metrik rilis.

Harap konfirmasi rencana ini. Setelah disetujui, saya akan mengeksekusi migrasi, menjalankan pengujian, mengambil screenshot Grafana, dan menyiapkan laporan akhir dengan artefak lengkap.