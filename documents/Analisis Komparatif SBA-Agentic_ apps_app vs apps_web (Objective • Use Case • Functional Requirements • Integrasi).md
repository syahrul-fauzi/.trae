## Ruang Lingkup & Tujuan
- Membandingkan implementasi Objective Requirements, Use Case, dan Functional Requirements antara `apps/app` (aplikasi utama App Router) dan `apps/web` (aplikasi web tambahan) dalam monorepo SBA‑Agentic.
- Menyelaraskan temuan dengan visi/misi proyek, KPI, arsitektur, integrasi, keamanan, performa, dan UX/a11y.

## Sumber Referensi Utama
- README proyek: `/home/inbox/smart-ai/sba-agentic/README.md` (mis. ikhtisar arsitektur, keamanan, observability, testing, go‑live; rujukan: 7–14, 79–99, 86–94, 126–159).
- Dokumentasi: `/home/inbox/smart-ai/sba-agentic/docs/README.md` (konfigurasi env, keamanan, observability, testing, playbook go‑live; rujukan: 22–31, 33–49, 67–80, 81–93).
- Cross‑reference: `/home/inbox/smart-ai/sba-agentic/workspace/_xref.md` (PRD ↔ Arsitektur ↔ Flows ↔ API; rujukan: 25–33, 41–66, 98–126, 268–287).
- Arsip dibandingkan: `.trae/documents/Analisis Komparatif SBA-Agentic_ apps_app vs apps_web*.md` (akan diisi sebagai deliverable setelah disetujui).

## Metodologi Analisis
- SWOT untuk tiap platform.
- Benchmark UX/UI terhadap praktik industri (navigasi, ARIA, aksesibilitas, responsivitas).
- Survey kode dengan alat baca (read‑only) untuk memetakan:
  - Arsitektur, middleware keamanan, observability, RBAC, rate‑limit (lihat referensi keamanan/observability di README dan docs).
  - Endpoints API (health/metrics/analytics), lapisan data (Supabase), pengukuran latensi (p95/p99) dan error rate.
- Wawancara stakeholder (disiapkan daftar pertanyaan; dijadikan lampiran bila tersedia input).
- Data kuantitatif dari analytics/metrics (p95, p99, error rate; target di README `p95 ≤ 500ms`, `error ≤ 0.5%`).

## Struktur Analisis yang Akan Disusun
### 1. Perbandingan Objective Requirements
- Tujuan bisnis dan teknis per platform (mobile vs web).
- Keselarasan terhadap visi/misi SBA‑Agentic dan peta jalan (lihat README: 168–176).
- KPI: latensi, error rate, adopsi fitur (heatmap/observability), cakupan test (≥80%).
- Konsistensi dan saling melengkapi/tumpang tindih.

### 2. Evaluasi Use Case Implementasi
- Mapping use case utama + aktor (end‑user, ops, admin; merujuk workspace `_xref.md`).
- Diagram Use Case (UML) untuk kedua platform: generative UI, interrupts, multimodal messages, analytics heatmap, RBAC guard.
- Analisis user flow: perbedaan antara App Router (apps/app) dan Web tambahan (apps/web).
- Klasifikasi: frekuensi vs nilai bisnis; identifikasi overlap/gap.

### 3. Analisis Functional Requirements
- Daftar fitur per platform (security headers, CSP nonce, rate‑limit, RBAC, metrics UI/API; rujukan README: 79–99, 86–94; docs: 33–49, 45–55).
- Perbandingan implementasi teknis: middleware, API routes, observability exporter, Supabase factories.
- Verifikasi kesesuaian terhadap dokumen requirements (README/docs).
- Gap dan ketidaksesuaian: konsistensi guard, format metrics, akses RBAC, a11y.

### 4. Integrasi Sistem
- Mekanisme komunikasi komponen: App Router API, UI tracker → API heatmap, Supabase, Upstash rate‑limit.
- Sinkronisasi data: tenant header, audit logs, metrik p95/p99.
- Pola integrasi eksternal (Prometheus/OTel, Sentry opsional).
- Bottleneck potensial: rate‑limit, RBAC, latensi p95 pada rute berat.

### 5. Dokumentasi
- Evaluasi kelengkapan dan kejelasan workspace `_xref.md` (RACI, validasi tautan, status artefak).
- Struktur dan kualitas dokumentasi per aplikasi; rekomendasi penyelarasan (frontmatter, penamaan, linting).

### 6. Deliverables
- Dua dokumen komparatif:
  - `Analisis Komparatif SBA‑Agentic_ apps_app vs apps_web.md`.
  - `Analisis Komparatif SBA‑Agentic_ apps_app vs apps_web (Objective • Use Case • Functional Requirements • Integrasi).md`.
- Matriks perbandingan fitur (kuantitatif/kualitatif) dengan skala terukur.
- Diagram (flowchart/sequence) untuk use case kunci.
- Executive summary dan rekomendasi strategis + roadmap.

### 7. Solusi Penguatan
- Strategi menghilangkan duplikasi fungsionalitas; konsolidasi guard/middleware (RBAC, rate‑limit, tenant header).
- Pendekatan memperkuat use case (generative UI, interrupts, analytics heatmap) lintas platform.
- Proposal peningkatan objektivitas KPI (latensi, error, coverage) dan keselarasan target bisnis.
- Roadmap penyelarasan: fase audit → refactor → standardisasi → observability/alerts → UAT → go‑live.

## Rencana Eksekusi Detail
1. Inventarisasi fitur dan endpoint di `apps/app` dan `apps/web` (read‑only scan).
2. Membangun matriks fitur vs platform (security, RBAC, metrics, audit, rate‑limit, Supabase integration).
3. Menggambar use case & sequence diagram (UML) untuk jalur utama.
4. Menyusun SWOT per platform: Strengths, Weaknesses, Opportunities, Threats.
5. Benchmark UX/UI: a11y, navigasi, responsivitas, konsistensi design tokens.
6. Kompilasi KPI: p95/p99, error rate, test coverage; bandingkan target vs realisasi.
7. Menulis dua dokumen komparatif + executive summary + rekomendasi roadmap.

## Asumsi & Risiko
- `apps/web` berisi API/komponen web tambahan; `apps/app` adalah aplikasi utama App Router (konfirmasi via scan).
- Data analytics/metrics tersedia melalui `/api/metrics` (RBAC diperlukan) → gunakan contoh/metrik dokumentasi bila data real‑time tidak tersedia.
- Wawancara stakeholder dilakukan jika akses tersedia; jika tidak, gunakan dokumen PRD/ADR sebagai pengganti.

## Output Setelah Persetujuan
- Dokumen lengkap terisi di `.trae/documents` dengan tabel, diagram, matriks, dan rekomendasi.
- Lampiran: referensi file/line untuk bukti teknis dan tautan workspace artefak.
- Checklist implementasi penyelarasan lintas platform.

## Permintaan Konfirmasi
- Apakah kami boleh melanjutkan penyusunan dokumen komparatif dan diagram sesuai rencana ini, lalu menempatkannya di `.trae/documents` dengan format standar perusahaan?