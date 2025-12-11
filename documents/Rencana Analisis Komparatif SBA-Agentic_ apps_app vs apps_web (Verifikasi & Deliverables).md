## Tujuan
- Melakukan analisis komprehensif Objective, Use Case, dan Functional Requirements antara `apps/app` dan `apps/web`, mencakup integrasi, KPI, SWOT, benchmarking UX/UI, dan rekomendasi strategi.

## Ruang Lingkup & Sumber
- Repositori: `/home/inbox/smart-ai/sba-agentic`
- Dokumen: `README.md`, `docs/README.md`, `workspace/_xref.md`
- Kode terkait KPI/Observability:
  - Ekspor metrik (Prometheus) di apps/app: `apps/app/src/app/api/metrics/prometheus/route.ts:46–55` (p95, p99, error rate, throughput), `apps/app/src/app/api/metrics/prometheus/route.ts:56–62` (tenant header + RBAC), `apps/app/src/app/api/metrics/prometheus/route.ts:65` (runtime `nodejs`).
  - Konsumsi metrik di apps/web: `apps/web/src/features/dashboard/components/MetricsOverview.tsx:80–118` (fetch metrics/prom, parsing p95 dan error rate).
- Dokumentasi operasional: `docs/README.md:41–55` (endpoints metrics/health, format, RBAC), `README.md:205` (alur `/api/metrics` → Client).
- XRef fitur agentic: `workspace/_xref.md:45–70,98–127,158–185,215–239`.

## Metodologi
- Analisis dokumen, audit kode (read-only), pemetaan use case/aktor, klasifikasi frekuensi & nilai bisnis.
- Analisis SWOT per platform.
- Benchmarking UX/UI: a11y baseline, LCP/INP rencana pengukuran.
- Data kuantitatif: rencana pengambilan sampel `GET /api/metrics` (json/prom) dan `GET /api/health` dengan header tenant.
- Wawancara: siapkan panduan untuk Admin/Operator, Pengguna Akhir, Developer/Integrator, Tenant Admin.

## Langkah Implementasi (Read-only & Penyusunan)
1. Inventaris Objective & KPI
   - Ekstrak tujuan bisnis dari `README.md`, `docs/README.md`, dan XRef; catat KPI dan target SLO yang eksplisit.
   - Verifikasi ekspor KPI di apps/app dan konsumsi di apps/web.
2. Pemetaan Use Case & Aktor
   - `apps/app`: auth/i18n, observability/metrics, kontrol runs/agents, knowledge, integrations, monitoring/insights, workspaces/tasks, API docs.
   - `apps/web`: chat & agentic runtime UI, workflows builder, knowledge hub, dashboard agregasi, AI copilot, documents, integrations, admin meta-events.
   - Identifikasi kesamaan dan perbedaan user flow; siapkan diagram sequence utama.
3. Functional Requirements & Perbandingan Teknis
   - Daftarkan fitur utama per platform dengan prioritas; bedah perbedaan teknis (observability, keamanan, data, arsitektur FSD/DDD/Atomic vs App Router).
   - Susun matriks perbandingan (skala 1–5 untuk prioritas/kematangan/konsistensi/risiko).
4. Analisis Integrasi
   - Mekanisme interaksi Web → App untuk `metrics/health`, RBAC, header tenant.
   - Titik sinkronisasi data (pull-based), konsistensi UX, keamanan & performa.
5. SWOT & Benchmarking
   - Susun SWOT apps/app dan apps/web.
   - Rencanakan benchmarking UX/a11y/performa (tanpa eksekusi tooling): a11y baseline dari test yang ada; rencana LCP/INP.
6. Rekomendasi Strategis & Roadmap
   - Standarisasi observability (provider App, consumer Web via SDK), harmonisasi RBAC, konsolidasi kontrol eksekusi, target KPI seragam.
7. Deliverables Penyusunan
   - Laporan komparatif lengkap.
   - Diagram UML untuk use case kunci (observability consumption; dapat dilengkapi dengan lifecycle agentic & knowledge ingestion bila diperlukan).
   - Matriks perbandingan fitur.
   - Rekomendasi strategis & roadmap.
   - Outline presentasi executive summary.

## Struktur Output (Penempatan)
- Dokumen laporan: `/.trae/documents/Analisis Komparatif SBA-Agentic_ apps_app vs apps_web.md`
- Diagram UML: `/.trae/documents/diagrams/UseCase_Observability_AppsWeb.mmd`
- Matriks fitur: `/.trae/documents/matrix-features-apps-app-vs-apps-web.md`
- Rekomendasi & roadmap: `/.trae/documents/strategic-recommendations-and-roadmap.md`
- Executive summary (slides outline): `/.trae/documents/executive-summary-slides.md`
- Artefak pendukung (opsional): sumber data observability, benchmarking UX/a11y/performa, panduan wawancara, inventaris XRef.

## Verifikasi Bukti
- Cantumkan referensi kode spesifik dengan pola `file_path:line_number` di laporan.
- Pastikan setiap temuan terkait KPI, RBAC, tenant header, dan konsumsi metrik memiliki rujukan valid dari kode/dokumen.

## Hasil yang Diharapkan
- Analisis komprehensif berimbang (teknis, bisnis, UX) untuk kedua platform.
- Rekomendasi actionable dan roadmap kuartalan yang dapat langsung diadopsi.

## Permintaan Persetujuan
- Konfirmasi untuk melanjutkan menyusun/melengkapi deliverables pada lokasi di atas dan menyiapkan outline wawancara serta rencana pengambilan data metrik (tanpa eksekusi).