## Tujuan
- Menegakkan standar TypeScript/ESLint ketat (tanpa implicit any) dan otomatisasi perbaikan.
- Menormalkan import UI agar konsisten dengan ekspor paket `@sba/ui`.
- Meningkatkan cakupan pengujian (unit/integrasi/e2e), telemetry p95/p99, dan gate coverage bertahap.
- Menyediakan lingkungan lokal k6 + Prometheus + Grafana beserta baseline metrik dan dokumentasi.

## Lingkup & Deliverables
- TS/ESLint: konfigurasi strict, lint rules khusus handler, pre‑commit hook, dan gate CI.
- UI import: audit & migrasi semua `@sba/ui/*` sesuai `exports` + modul re‑export internal.
- Testing: jadwal e2e harian, laporan coverage per modul, threshold naik ≤5% per iterasi.
- Monitoring: skrip k6, Prometheus/Grafana lokal, dashboard API, baseline metrik & screenshot.
- Refactor apps/app: pengetikan handler form/dashboard, normalisasi import, e2e lengkap dengan artefak.

## Implementasi Teknis
### 1) ESLint/TypeScript Ketat
- Aktifkan `noImplicitAny: true` di `tsconfig` tiap workspace (apps/*, packages/*).
- Tambahkan aturan ESLint:
  - `@typescript-eslint/no-explicit-any: error` (dengan pengecualian terkontrol di tooling).
  - Custom rule/auto‑fixer untuk event handlers: mendeteksi pola `onChange={e => ...}` → anotasi tipe (`React.ChangeEvent<...>` / `MouseEvent<...>`).
- Integrasi Husky:
  - Pre‑commit: `eslint --fix` + `tsc --noEmit` pada file yang berubah.
  - CI jobs: type‑check, lint, dan gate coverage.

### 2) Normalisasi Import UI
- Audit repo untuk semua import `@sba/ui/*` (subpath).
- Cocokkan dengan `packages/ui/package.json` `exports`/`typesVersions`:
  - Gunakan ekspor resmi: `@sba/ui/button`, `@sba/ui/card`, `@sba/ui/select`, dst.
- Buat modul re‑export internal (opsional) di apps/app (`src/shared/ui/index.ts`) untuk bundel komponen umum.
- Codemod migrasi bertahap:
  - Skrip jscodeshift yang mengubah import mentah ke subpath resmi atau re‑export internal.
  - Validasi pascamigrasi dengan type‑check.

### 3) Peningkatan Testing
- Jadwal e2e harian (GitHub Actions cron) untuk apps/web (Playwright) dengan upload artefak: log, screenshot, video.
- Gate coverage bertahap:
  - Threshold awal 80%; tingkatkan maksimal 5% per iterasi dan hanya pada modul dengan kesiapan test.
  - Laporan coverage per modul (statements/branches/functions) → artefak & komentar PR.
- Instrumentasi p95/p99 latency:
  - Tambah histogram durasi di endpoint kunci (web API) dan panel Grafana p95/p99.

### 4) Monitoring Performa Lokal
- k6:
  - Skrip siap pakai (VUs, durasi, auth JWT) + summary JSON.
- Prometheus & Grafana:
  - Prometheus scrape `/api/metrics/prometheus` & `/api/health/metrics`.
  - Dashboard API: response time, throughput, error rate, ringkasan test; screenshot untuk dokumentasi.
- Baseline metrik rilis:
  - Simpan nilai dasar (avg/p95/p99, error rate, rps) dan tautkan pada laporan rilis.

### 5) Refactor apps/app & E2E Lengkap
- Pengetikan eksplisit untuk semua event handler di form/dashboard.
- Normalisasi import UI di apps/app sesuai ekspor resmi.
- Jalankan e2e lengkap (web), kumpulkan:
  - Log eksekusi terstruktur, screenshot hasil tes, dump Prometheus, dan gambar dashboard Grafana.

## Validasi & Gate
- Type‑check lintas monorepo: lulus tanpa implicit any.
- Lint: tidak ada pelanggaran rules kritis.
- Coverage: memenuhi threshold; jika turun, blokir deploy sesuai gate.
- Monitoring: panel Grafana menampilkan metrik utama dan baseline terlampir.

## Dokumentasi
- Panduan developer: aturan lint/TS, pola handler, standar impor UI.
- Runbook QA: cara menjalankan e2e, cara membaca laporan coverage.
- Monitoring: setup lokal, datasource, dashboard, dan cara mengambil screenshot.
- Laporan perubahan untuk review tim: daftar file dimigrasi, masalah & solusi, rekomendasi iterasi.

## Risiko & Mitigasi
- Migrasi import luas dapat memicu regresi type‑check → lakukan per modul + codemod reversible.
- Kenaikan coverage terlalu cepat → batasi ≤5% per iterasi dan fokus critical path.
- Performa dev server saat instrumentation → gunakan flag hanya di CI/staging.

## Persetujuan
- Setelah rencana ini disetujui, saya akan mulai menerapkan konfigurasi lint/TS, codemod import UI, refactor handler, penambahan telemetry p95/p99, setup cron e2e, dan penyusunan dokumentasi & artefak monitoring secara bertahap dengan verifikasi di setiap langkah.