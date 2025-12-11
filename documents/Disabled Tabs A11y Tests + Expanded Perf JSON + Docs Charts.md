## Target
- Tingkatkan pengujian a11y untuk tabs (skenario disabled) dan perluas metrik performa dengan artefak JSON yang kaya.
- Visualisasikan metrik di dokumentasi menggunakan Recharts.

## 1) Disabled Tab Functionality (A11y)
- Implementasi UI:
  - Tambah dukungan `aria-disabled="true"` pada tabs di `apps/docs/app/[locale]/diagrams/umbrella/page.tsx`.
  - Keyboard: saat `ArrowLeft/Right`, skip tabs yang `aria-disabled` agar alur tetap logis.
  - Visual: gaya berbeda untuk disabled (kontras & non-interaktif), tetapi tetap fokusable jika diperlukan (opsional: `tabIndex=-1`).
- Pengujian Playwright:
  - Tambah `apps/docs/e2e/tests/umbrella-disabled-tabs.spec.ts`:
    - Buat state halaman dengan salah satu depth tab disabled (stub prop/state sementara).
    - Verifikasi `aria-disabled="true"` tampil dan tab tidak mengubah pilihan saat di-activate.
    - Navigasi keyboard mengabaikan tab disabled (wrap-around diuji kembali).
    - Visual: screenshot untuk memastikan disabled style konsisten.

## 2) Performance Measurement Enhancements
- Ekspansi JSON output (di `mermaid-performance.spec.ts`):
  - `build`: `{ sha, branch, date, node, playwright, nextBuildId, os }`.
  - `pages`: `[{ path, locale, depth, type, diagramCount, timings: { gotoMs, domContentLoadedMs, firstSvgMs, perDiagramMs: number[] } }]`.
  - `summary`: `{ p50RenderMs, p95RenderMs, samples, significance: { n, se, ci95 } }`.
- Pengukuran granular:
  - Tambah `page.waitForLoadState('domcontentloaded')` untuk `domContentLoadedMs`.
  - Catat waktu render per diagram: seleksi semua `mermaid-svg`, ukur hingga visible (loop) dan push ke `perDiagramMs`.
- CI Pipeline:
  - Update `.github/workflows/docs-e2e.yml` untuk mengunggah artefak JSON dengan pola `perf_mermaid_${{ github.sha }}_${{ steps.date.outputs.today }}.json`.
  - Tambah step membuat variabel tanggal (YYYY-MM-DD).
  - Retensi: gunakan default GitHub, dokumentasikan kebijakan.

## 3) Dokumentasi Visual Charts
- Halaman Docs Performance:
  - Buat page `apps/docs/app/[locale]/perf/diagrams/page.tsx` yang:
    - Membaca artefak JSON terbaru (dev: dari `apps/docs/public/perf/`; CI: opsi fetch dari storage bila tersedia).
    - Menampilkan bar chart per depth/type (Recharts), line chart tren p95 (riwayat), dan heatmap per komponen (grid intensitas perdiagramMs).
  - Komponen UI: `apps/docs/features/perf/ui/*` untuk Recharts (bar/line/heatmap sederhana).
- Metadata & Significance:
  - Tampilkan timestamp, env context (Node/Playwright), dan indikator statistik (n, se, ci95) di panel ringkasan.

## Verifikasi
- Jalankan Playwright E2E untuk a11y (tabs disabled) dan pastikan semua assertion lulus.
- Periksa file JSON berisi metrik granular dan step CI mengunggahnya.
- Buka halaman performance docs dan pastikan chart muncul (dev artefak lokal), link valid.

## Risiko & Mitigasi
- Artefak tersedia hanya di CI: gunakan fallback lokal di dev; dokumentasikan lokasi artefak.
- Heatmap implementasi: mulai dari grid sederhana (CSS + skala warna) dan tingkatkan bertahap.
- Disabled tabs state: gunakan konfigurasi lokal/stub agar aman; produksi tidak men-disable jika tidak diperlukan.

## Done Criteria
- Tabs mendukung disabled secara a11y dan teruji (visual + keyboard + ARIA).
- Perf JSON berisi depth/type/timings dan significance; CI mengunggah dengan penamaan baku.
- Halaman docs perf menampilkan bar/tren/heatmap dengan metadata lengkap.