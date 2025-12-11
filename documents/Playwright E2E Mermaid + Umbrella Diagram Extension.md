## Ruang Lingkup & Asumsi
- Fokus pada apps/docs (Next.js 15, port 3004) dengan konten RichText/CodeBlock.
- Mermaid saat ini dirender client-side via `MermaidRenderer` untuk blok `language: mermaid`.
- E2E akan memverifikasi kehadiran SVG Mermaid, kinerja (p95), dan regresi visual.
- Ekstensi diagram payung: tambah cakupan Generative UI & Multimodal dengan opsi interaktif, tetap kompatibel dengan sintaks Mermaid standar.

## Implementasi Playwright E2E
- Konfigurasi:
  - Tambah `apps/docs/playwright.config.ts` dengan `webServer` (build → `next start -p 3004` atau dev `next dev -p 3004`) dan `use.baseURL`.
  - Tambah devDependency `@playwright/test` dan skrip `e2e:test` di `apps/docs/package.json`.
- Kehadiran SVG Mermaid:
  - Tambah `data-testid="mermaid-svg"` pada container render di `MermaidRenderer` untuk selektor stabil.
  - Buat tes `apps/docs/e2e/tests/mermaid-svg-presence.spec.ts` yang:
    - Memuat daftar halaman docs (mis. `/en/docs/getting-started`, `api-reference`, `guides`).
    - Jika halaman berisi blok Mermaid, asersi `getByTestId('mermaid-svg')` ≥ 1; jika tidak, asersi tidak gagal (mermaid opsional).
- Kinerja p95 render:
  - Buat tes `apps/docs/e2e/tests/mermaid-performance.spec.ts`:
    - Untuk setiap halaman berisi Mermaid, ukur durasi dari `goto()` hingga node `mermaid-svg` terlihat.
    - Kumpulkan sample waktu; hitung p95 per run; tulis ke `playwright-mermaid-metrics.json` (artifact CI).
    - Target: p95 ≤ 2000ms.
- Regresi visual (screenshot):
  - Buat tes `apps/docs/e2e/tests/mermaid-visual.spec.ts`:
    - Ambil screenshot kontainer `mermaid-svg` per halaman; bandingkan via `toMatchSnapshot()`.
    - Simpan baseline snapshot di repo; perbedaan signifikan memicu kegagalan.
- CI/CD integrasi:
  - Tambah workflow `.github/workflows/docs-e2e.yml`:
    - Setup Node + pnpm; install; build; start server; jalankan `playwright test` untuk apps/docs.
    - Upload artifacts (`playwright-mermaid-metrics.json`, screenshot diffs) untuk review.

## Ekstensi Diagram Payung
- Generative UI:
  - Tambah file Mermaid baru atau perluas `umbrella-component.mmd`/`umbrella-sequence.mmd` dengan komponen renderer/a11y dan jalur interaksi UI → Agent Runtime → Observability.
  - Tampilkan port/antarmuka (props, events) pada komponen UI generatif.
- Multimodal:
  - Tambah entitas dan proses untuk teks/gambar/audio; tandai TTL/validation; perlihatkan hubungan lintas konteks (Security, Storage, Agent Runtime).
- Interaktivitas (toggle kedalaman):
  - Pola rekomendasi: simpan beberapa diagram per kedalaman (L0/L1/L2) dan gunakan UI toggle (tab/radio) untuk memilih diagram; tetap gunakan `MermaidRenderer`.
  - Alternatif: gunakan direktif `click` Mermaid untuk taut link ke halaman detail (non-JS, kompatibel SVG).
- Kompatibilitas mundur:
  - Tidak mengubah sintaks dasar; semua diagram tetap valid Mermaid.
  - Dokumentasi menyertakan contoh, sehingga perubahan tidak memaksa migrasi.

## Dokumentasi & Pedoman
- Perbarui `docs/architecture/README.md`:
  - Standar penamaan, kelas legenda, batas sistem, dan praktik multi-level (L0/L1/L2).
  - Pola interaktif (toggle UI, direktif `click`).
  - Pedoman membuat baseline snapshot untuk regresi visual.
- Tambahkan referensi dari PRD terkait (Generative UI, Multimodal) ke diagram payung.

## Artefak & Penyimpanan
- Metrics p95 disimpan sebagai artifact JSON di CI.
- Screenshot baseline disimpan dalam repo (snapshot Playwright); diffs di artifacts.
- SVG hasil CI dari `.mmd` tetap di artifacts (terpisah dari snapshot E2E).

## Keamanan & Aksesibilitas
- Renderer tetap memproduksi SVG; sanitasi `RichTextBlock` tetap aktif.
- Beri `aria-label` pada kontainer Mermaid; warna legend kontras; dukungan dark mode.

## Definisi Selesai
- Semua halaman docs dengan blok Mermaid lulus asersi SVG presence.
- p95 render tercatat dan diunggah sebagai artefak; p95 ≤ 2000ms.
- Snapshot visual stabil; perubahan terdeteksi lewat diffs.
- Diagram payung diperluas (Generative UI, Multimodal) dengan opsi toggle kedalaman; dokumentasi pedoman diperbarui.
