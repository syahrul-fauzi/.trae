## Ruang Lingkup
- Buat tiga diagram payung lintas-fitur: Sequence, Component, Dataflow.
- Integrasi diagram ke sistem dokumentasi dengan render otomatis Mermaid atau pipeline verifikasi visual berbasis CI.
- Tetapkan persyaratan kualitas: akurasi teknis, legenda konsisten, versioning, aksesibilitas, pencarian, dan kemudahan update.

## Standar Diagram
- Penamaan berkas: `workspace/02_Architecture/diagrams/umbrella-sequence.mmd`, `umbrella-component.mmd`, `umbrella-dataflow.mmd`.
- Gaya konsisten: gunakan `autonumber` pada sequence, `subgraph` untuk bounded context pada component, dan klasifikasi entity/process/datastore pada dataflow.
- Sertakan blok legenda standar (ikon komponen, interface/port, datastore) pada semua diagram.
- Tunjukkan batas sistem (internal vs eksternal), titik integrasi (API, agent, datastore), dan alur kritis.

## Konten Diagram (Cakupan)
- Sequence: end-to-end arus interaksi antar konteks (Security Headers → RBAC → Rate Limiting → API → Observability → Storage → Admin UI), termasuk tenant header dan audit.
- Component: relasi arsitektural lintas-fitur (Security, Access Control, Observability, Analytics, Agent Runtime, Data Access, Generative UI, Multimodal) dengan interface/port utama.
- Dataflow: pergerakan data dari sumber (user/admin/agents) ke proses (collect/validate/authorize/limit/execute/aggregate) dan penyimpanan (Supabase, registry, cache), level 0–2 dengan anotasi alur bisnis.

## Integrasi Dokumentasi (Opsi A: Client-side Mermaid)
- Tambah komponen klien `MermaidRenderer` yang:
  - Menginisialisasi Mermaid pada mount, dan merender konten dari blok `CodeBlock` dengan `language === 'mermaid'`.
  - Mendukung responsif (fit to container, re-render on resize).
- Integrasi di halaman docs: deteksi blok `CodeBlock` Mermaid dan render via komponen.
  - Titik integrasi: `apps/docs/app/[locale]/docs/[...slug]/page.tsx:121-135` untuk blok kode.
- Keamanan: tetap gunakan `sanitizeHtml` untuk RichText; `MermaidRenderer` tidak mengeksekusi script eksternal, hanya SVG.

## Integrasi Dokumentasi (Opsi B: Pipeline remark/rehype)
- Alternatif: gunakan plugin `remark-mermaid`/`rehype-mermaid` di pipeline MDX/unified untuk render server-side.
- Catatan: konten saat ini berasal dari BaseHub `RichTextBlock` (HTML) dan `CodeBlock`. Opsi B lebih relevan untuk halaman MDX lokal; untuk blok BaseHub gunakan Opsi A.

## Pipeline CI Verifikasi Visual
- Tambah devDependencies: `@mermaid-js/mermaid-cli` untuk generate SVG dari `.mmd`.
- Skrip: `pnpm diagrams:build` untuk kompilasi `workspace/02_Architecture/diagrams/*.mmd` → `workspace/02_Architecture/dist/*.svg`.
- Tambah job CI:
  - Jalankan kompilasi diagram pada build.
  - Upload artefak SVG sebagai preview (mis. summary CI atau deploy preview).
  - Lakukan diff checking (mis. `jest-image-snapshot` atau `pixelmatch`) terhadap SVG/PNG hasil.
- Uji E2E Playwright (memanfaatkan yang sudah ada di `apps/docs/e2e`):
  - Navigasi ke halaman dokumentasi berisi diagram.
  - Verifikasi node SVG Mermaid hadir dan ukur waktu render untuk target p95.

## Kualitas & Aksesibilitas
- Akurasi & mutakhir: sinkronkan perubahan kode dengan update `.mmd`; PR review harus mencakup rekonsiliasi.
- Legenda & label: semua diagram wajib memiliki legenda dan label jelas untuk aktor, komponen, datastore, dan alur.
- Versioning: `.mmd` di-version bersama kode; SVG hasil build tidak perlu dikomit.
- Aksesibilitas: gunakan `aria-label`/deskripsi di figure; kontras sesuai tema gelap/terang.
- Performa: p95 render halaman docs ≤ 2000 ms; error rate render ≤ 0.5%.

## Pencarian & Cross-Referensi
- Tambah metadata diagram (judul, fitur terkait, slug) pada halaman docs agar dapat dicari.
- Hubungkan PRD di `workspace/01_PRD/*` ke diagram payung melalui tautan relatif.
- Gunakan Table of Contents untuk navigasi (komponen ada di `apps/docs/features/docs/ui/TableOfContents.tsx`).

## Rencana Implementasi Bertahap
1) Buat 3 berkas `.mmd` payung dengan legenda dan batas sistem.
2) Implementasikan `MermaidRenderer` dan integrasi di blok `CodeBlock` Mermaid pada halaman docs (`apps/docs/app/[locale]/docs/[...slug]/page.tsx`).
3) Konfigurasi CLI Mermaid dan skrip `pnpm diagrams:build`; hasil SVG sebagai artefak CI.
4) Tambahkan tes Playwright untuk verifikasi render dan waktu p95; tambahkan image snapshot diff untuk perubahan.
5) Dokumentasikan standar diagram dan panduan update di `docs/architecture/README.md` dan tautkan dari PRD.

## Risiko & Mitigasi
- SSR vs CSR: render Mermaid di klien untuk konten BaseHub; mitigasi dengan fallback tampilkan code block jika init gagal.
- Keamanan konten: sanitasi tetap aktif; Mermaid hanya menghasilkan SVG dari teks.
- Kerapuhan CI: jika CLI gagal pada sintaks, lint `mmd` sebelum build; beri contoh template.

## Definisi Selesai
- Ketiga diagram payung tersedia dan ditautkan dari dokumen arsitektur.
- Diagram Mermaid dirender otomatis di halaman docs dan tervalidasi oleh CI.
- Tes E2E dan snapshot diff lulus dengan target performa & aksesibilitas terpenuhi.
