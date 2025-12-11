## PR-1: E2E Observability (End-to-End)
- Ruang lingkup:
  - Verifikasi metrics Prometheus dan cache effectiveness dari ujung ke ujung
  - E2E untuk baseline metrics dan X-Cache miss→hit
- Perubahan yang diusulkan:
  - Tambah E2E:
    - `apps/web/e2e/metrics-baseline.spec.ts` (assert histogram `sba_request_duration_seconds`, counters `cache_hit_total`, `cache_miss_total`)
    - `apps/web/e2e/cache-xcache.spec.ts` (verifikasi `X-Cache: miss` lalu `hit`)
    - Helper: `apps/web/e2e/helpers/metrics-baseline.ts` (gunakan `BASE_URL`, cookie admin)
  - Pastikan endpoint observabilitas:
    - `apps/app/src/app/api/metrics/prometheus/route.ts` (ekspos teks Prometheus)
    - `apps/app/src/app/api/cache/metrics/route.ts` (JSON cache metrics)
  - Artefak & dashboard:
    - `ops/grafana/provisioning/contact-points.yml`, `ops/grafana/provisioning/alerting/rules.yml`
    - `ops/prometheus/alert.rules.yml`
- Testing & validasi:
  - Jalankan Playwright (chromium) dengan `BASE_URL=http://localhost:3001`
  - Pastikan kedua tes PASS dan mencatat waktu respon
- Checklist review:
  - Fungsionalitas: endpoint 200 OK, label metrics tepat, E2E PASS
  - Performa: overhead E2E minimal, waktu eksekusi wajar
  - Keamanan: penggunaan cookie admin hanya di dev/test, tidak membocorkan secrets
- Kriteria penerimaan:
  - Semua tes E2E PASS; observabilitas dapat diverifikasi dari UI/dashboard

## PR-2: Dokumentasi Laporan
- Ruang lingkup:
  - Template laporan, panduan penyusunan, contoh laporan lengkap
- Perubahan yang diusulkan:
  - Template & panduan:
    - `docs/ops/Validation-Report-TEMPLATE.md` (struktur standar)
    - `docs/ops/Monitoring-Validation-Guide.md` (langkah-langkah pencatatan, screenshot, artefak)
  - Contoh laporan:
    - `docs/ops/Validation-Report-2025-12-10.md` (terisi hasil, timestamp, analisis)
    - Screenshot: `docs/ops/assets/cache_effectiveness_20251210.png`
- Checklist review:
  - Kelengkapan: semua bagian (ringkasan, hasil, artefak, analisis)
  - Kejelasan: bahasa konsisten, langkah dapat diikuti kembali, gambar terbaca
  - Konsistensi: mengikuti template, penamaan file baku
- Kriteria penerimaan:
  - Reviewer dapat mereproduksi validasi hanya berbekal dokumen

## PR-3: Konfigurasi Pengembangan (Dev Config)
- Ruang lingkup:
  - Stabilitas dev server dan rute; kemudahan setup
- Perubahan yang diusulkan:
  - `apps/app/next.config.js`: `optimizeCss: process.env.NODE_ENV === 'production'`
  - Perbaikan rute login (hapus duplikasi): pertahankan `apps/app/src/app/(public)/login/page.tsx`
  - Catatan setup dev:
    - README tambahan (atau bagian di `docs/ops/Monitoring-Validation-Guide.md`) untuk env, cookie demo, port
- Checklist review:
  - Kemudahan setup: dev up dalam <2 menit, tanpa error critters/duplikasi rute
  - Kompatibilitas: tidak mengganggu production build
  - Dokumentasi: jelas untuk tim dev
- Kriteria penerimaan:
  - Dev server stabil, endpoint observabilitas & cache berjalan, lint/test hijau

## CI: Ekspor PDF Otomatis dengan Pandoc
- Ruang lingkup:
  - Menambahkan langkah konversi Markdown→PDF setelah build sukses
- Perubahan yang diusulkan:
  - Workflow baru atau memperluas yang ada:
    - `.github/workflows/docs-export.yml`
    - Langkah: install `pandoc` (apt-get atau action), konversi:
      - Sumber: `docs/ops/Cache_Effectiveness_Report_*.md` dan `docs/ops/Validation-Report-*.md`
      - Target: `docs/ops/Cache_Effectiveness_Report_YYYYMMDD.pdf`
  - Upload artifacts PDF dan fail jika konversi gagal
- Verifikasi kualitas:
  - Pastikan font/grafik terbaca; ukuran halaman A4; margin standar
  - Memeriksa kehadiran gambar dan timestamp
- Kriteria penerimaan:
  - CI menghasilkan PDF artefak konsisten; gagal bila konversi gagal

## Rencana Teknis PR
- Penamaan branch:
  - `feat/e2e-observability`
  - `docs/validation-reporting`
  - `chore/dev-config-stabilization`
  - `ci/docs-pdf-export`
- Penamaan PR:
  - `[E2E] Observability end-to-end + cache effectiveness`
  - `[Docs] Validation report templates & example`
  - `[Chore] Dev config stabilization (optimizeCss & login route)`
  - `[CI] Pandoc PDF export for ops reports`
- Proses:
  - Commit terpisah per area, lint & test, upload artifacts, minta review

## Dampak & Risiko
- E2E menambah waktu CI; mitigasi dengan worker tunggal & caching
- Pandoc dependency di CI; gunakan apt-get atau prebuilt action
- Dev config perubahan kecil, aman untuk production build

## Permintaan Persetujuan
- Setelah disetujui, saya akan membuat branch, menyusun perubahan sesuai di atas, menambahkan workflow CI PDF, menjalankan tes, dan menyiapkan tiga PR + satu PR CI untuk ditinjau.