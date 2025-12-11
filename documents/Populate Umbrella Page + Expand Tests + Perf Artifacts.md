## Umbrella Page Population
- Komponen Loader:
  - Buat `MmdLoader` (client) untuk mem-fetch `.mmd` via endpoint `GET /api/diagrams?file=<name>` dan meneruskan konten ke `MermaidRenderer`.
  - Tambah endpoint server `apps/docs/app/api/diagrams/route.ts` membaca file dari `workspace/02_Architecture/diagrams` dan mengembalikan `text/plain` (HTTP 400/404 untuk validasi).
- Pemetaan Sumber:
  - Buat `apps/docs/app/[locale]/diagrams/umbrella/sources.ts` berisi daftar `{ id, title, file, depth: L0|L1|L2, type }`.
  - Tambahkan berkas L1/L2: `umbrella-sequence-l1/-l2.mmd`, `umbrella-component-l1/-l2.mmd`, `umbrella-dataflow-l1/-l2.mmd`.
- Halaman Umbrella:
  - Perbarui `apps/docs/app/[locale]/diagrams/umbrella/page.tsx` untuk:
    - Menyediakan tab aksesibel (`role=tablist/tab/tabpanel`) untuk L0/L1/L2, dengan `?depth=Lx` di query.
    - Memfilter `SOURCES` berdasarkan depth terpilih, render via `MmdLoader`.
    - Tambahkan tombol Refresh (opsional) untuk re-fetch saat dev.
- Hot-reload & Akurasi:
  - Dev server Next menangani HMR; loader melakukan fetch ulang saat navigasi.
  - Validasi tipe Mermaid umum (sequenceDiagram, flowchart, stateDiagram, classDiagram, erDiagram); fallback ke `<pre>` jika render gagal.

## Testing Expansion (Playwright)
- Route & Fungsional:
  - `umbrella-route.spec`: halaman `/[locale]/diagrams/umbrella` memuat, heading dan section terlihat.
- Interaksi Toggle Multi-depth:
  - `umbrella-toggle-depth.spec`: verifikasi state awal (L0), klik tab L1/L2, cek `aria-selected`, URL `?depth=`, dan panel konten.
  - Skenario nested: L0→L2→L1→kembali; state konsisten.
- Visual Regression:
  - Screenshot `mermaid-svg` per depth; gunakan baseline snapshot dan diffs.
- Aksesibilitas:
  - Tes keyboard: panah kiri/kanan navigasi tab; Enter/Space aktivasi; fokus terlihat; roles dan atribut a11y benar.

## Performance Artifact Export (Opsional)
- Skema JSON `perf_mermaid.json`:
  - `build`: `{ sha, branch, date, node, playwright, nextBuildId }`
  - `pages`: `[{ path, locale, depth, type, count, renderMs }]`
  - `summary`: `{ p50RenderMs, p95RenderMs, samples }`
- Integrasi CI:
  - Playwright menulis `perf_mermaid.json` ke report; workflow mengunggah dengan nama berisi SHA & tanggal.
  - Retensi mengikuti kebijakan artifacts; tambahkan metadata tagging untuk konteks build.
- Analisis:
  - `scripts/perf/analyze.js` mengagregasi beberapa file; output CSV/Markdown untuk tren (opsional charting kemudian).

## Risiko & Mitigasi
- Akses FS di CI: batasi path ke `workspace/02_Architecture/diagrams`; jika tidak ada, kembalikan 404 tanpa gagal keseluruhan.
- Kegagalan render Mermaid: try/catch dan fallback ke code block; jangan menghalangi halaman.
- Flaky visual tests: normalisasi ukuran kontainer, tema, dan dependensi font; gunakan `playwright install --with-deps`.

## Definisi Selesai
- Halaman umbrella menampilkan `.mmd` live dengan tab depth aksesibel dan hot-reload di dev.
- 100% halaman yang memiliki Mermaid lulus asersi SVG presence; a11y keyboard tests lulus.
- p95 render direkam dan diunggah sebagai artifact; snapshot visual stabil lintas build.