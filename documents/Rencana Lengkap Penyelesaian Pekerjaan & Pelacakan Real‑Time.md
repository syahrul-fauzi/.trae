## Ringkasan Strategi
- Menyelesaikan pekerjaan aktif secara terstruktur: inventaris, prioritas, audit, rencana implementasi, pelacakan real‑time, quality control, dokumentasi, dan laporan akhir.
- Fokus teknis: konsistensi metadata (canonical/OG/Twitter), aksesibilitas (landmark/heading), stabilisasi Playwright E2E, penguatan unit tests, dan dashboard tracking tugas.
- Hasil terukur: seluruh meta/a11y lulus E2E, konsistensi metadata lintas halaman, dashboard pelacakan berbasis App Router, dan dokumentasi end‑to‑end.

## Inventaris Tugas Aktif
1) Konsistensi canonical/OG/Twitter metadata lintas halaman
- Deskripsi: Standarisasi metadata di semua halaman App Router (authenticated & publik) menggunakan `shared/lib/metadata.ts`, tambah `head.tsx` bila perlu, normalkan canonical (tanpa locale jika diperlukan oleh tes), OG/Twitter lengkap.
- Pemilik: Assistant
- Dokumen: `apps/app/src/shared/lib/metadata.ts`, `docs/TECHNICAL_SPEC.md`, `docs/TRACEABILITY_MATRIX.md`

2) Perbaikan aksesibilitas (landmark & heading hierarchy)
- Deskripsi: Audit dan koreksi landmark ARIA (banner, nav, main, contentinfo), kehadiran `h1`, label breadcrumb, kontras/label di halaman terotentikasi.
- Pemilik: Assistant
- Dokumen: `docs/TROUBLESHOOTING.md` (a11y catatan), halaman terkait di `apps/app/src/app/(authenticated)/**`

3) Stabilisasi Playwright E2E meta/a11y suite
- Deskripsi: Jalankan subset & penuh, pastikan reporters (list/html/json/junit), trace/screenshot/video, baseURL stabil, perbaiki kegagalan Workspaces/halaman lain.
- Pemilik: Assistant
- Dokumen: `apps/app/playwright.config.ts`, `apps/app/e2e/global.setup.ts`, `apps/app/e2e/utils/auth.ts`

4) Sinkronisasi login mock & global setup di semua suite
- Deskripsi: Verifikasi endpoint `POST /api/test-login` & `POST /api/test-logout`, pastikan global setup/teardown konsisten, cookies test dipakai, baseURL env.
- Pemilik: Assistant
- Dokumen: `apps/app/src/app/api/test-login/route.ts`, `apps/app/src/app/api/test-logout/route.ts`, `apps/app/e2e/utils/auth.ts`

5) Penguatan unit tests modul upload & coverage
- Deskripsi: Pastikan seluruh tes upload stabil, tambah kasus batas jika perlu, tetapkan ambang coverage realistis, perbaiki alias & setup.
- Pemilik: Assistant
- Dokumen: `apps/app/src/__tests__/features/upload/config.test.ts`, `apps/app/vitest.config.ts`, `apps/app/vitest.setup.ts`

6) Dashboard pelacakan real‑time tugas
- Deskripsi: Implement halaman `observability`/`tasks` untuk memonitor status, progress, blockers, deadline, dan alarm threshold; data sumber sederhana (JSON/route handler) lalu dapat diekspansi.
- Pemilik: Assistant
- Dokumen: `apps/app/src/app/observability/page.tsx`, rancangan baru `apps/app/src/features/tasks-tracking/**`

7) Prosedur quality control (QC) ketat
- Deskripsi: Susun checklist verifikasi, uji fungsionalitas (E2E/unit), review stakeholder, dan approval formal sebelum selesai.
- Pemilik: Assistant
- Dokumen: `docs/TECHNICAL_SPEC.md`, rencana penambahan `docs/QUALITY_CONTROL.md`

8) Dokumentasi lengkap proses
- Deskripsi: Catatan harian, perubahan, bukti penyelesaian (artefak test), lessons learned, integrasi ke dokumen.
- Pemilik: Assistant
- Dokumen: `docs/TROUBLESHOOTING.md`, rencana penambahan `docs/PROGRESS_LOG.md`

9) Laporan akhir
- Deskripsi: Ringkasan eksekutif, matriks pekerjaan, durasi, sumber daya, hambatan & solusi, rekomendasi perbaikan proses.
- Pemilik: Assistant
- Dokumen: rencana penambahan `docs/FINAL_REPORT.md`

## Prioritas Penyelesaian
- Prioritas tinggi: (1) Konsistensi metadata, (2) Aksesibilitas, (3) E2E meta/a11y, (4) Sinkronisasi login mock.
- Prioritas sedang: (5) Unit tests & coverage, (6) Dashboard pelacakan.
- Prioritas rendah: (7) QC dokumentasi rinci, (8) Dokumentasi proses, (9) Laporan akhir.
- Rasional: Dampak langsung pada ketuntasan E2E dan kualitas produksi; dashboard melengkapi pelacakan dan dapat berjalan paralel.

## Audit Progress & Rencana per Tugas
1) Metadata canonical/OG/Twitter
- Status saat ini: Sudah diterapkan di Integrations/Monitoring; halaman lain sebagian belum; ketidaksesuaian canonical (locale) masih berpotensi.
- Kualitas sementara: Konsisten trailing slash di `metadataBase`; OG/Twitter standar; perlu pemerataan.
- Dependencies: Keputusan format canonical (tanpa/ dengan locale) mengikuti ekspektasi tes; akses ke baseURL env.
- Langkah teknis: (a) Audit semua halaman authenticated (dashboard, workspaces, runs, knowledge, agui, run-controls), (b) Tambah/rapikan `head.tsx` &/atau `generateMetadata`, (c) Standarisasi canonical tanpa locale bila tes mengharuskan, (d) Validasi dengan subset E2E.
- Sumber daya: 1 engineer; App Router APIs.
- Milestones: Audit → Implement → Validasi subset → Roll‑out semua halaman.
- Acceptance criteria: Semua halaman memiliki canonical/OG/Twitter sesuai standar; seluruh tes meta lulus.

2) Aksesibilitas
- Status saat ini: Landmarks & `h1` ditambahkan di Integrations/Monitoring; halaman lain perlu audit.
- Kualitas sementara: Axe violations berkurang; potensi label/kontras tersisa.
- Dependencies: Komponen UI yang digunakan (breadcrumb/header), style.
- Langkah teknis: Audit Axe untuk semua halaman; tambahkan landmark, `h1`, label; perbaiki kontras; validasi dengan E2E a11y.
- Sumber daya: 1 engineer; Axe via Playwright.
- Milestones: Audit → Fix → Validasi.
- Acceptance criteria: E2E a11y lulus tanpa pelanggaran kritis.

3) E2E meta/a11y
- Status saat ini: Reporter & artefak disiapkan; beberapa spesifikasi masih gagal/timeout.
- Kualitas sementara: Subset telah berjalan dan menghasilkan artefak.
- Dependencies: Dev server stabil, baseURL, login mock.
- Langkah teknis: Jalankan subset per halaman; perbaiki kegagalan; jalankan suite penuh; arsipkan artefak.
- Sumber daya: 1 engineer; Playwright.
- Milestones: Subset → Perbaikan → Full run.
- Acceptance criteria: Suite penuh lulus; artefak lengkap (HTML/JUnit/JSON, screenshot/video/trace).

4) Login mock & global setup
- Status saat ini: Endpoint & util telah dibuat; perlu verifikasi konsistensi.
- Kualitas sementara: Berfungsi di subset; butuh pemerataan di semua projek.
- Dependencies: Cookies/headers di lingkungan test.
- Langkah teknis: Review endpoint; pastikan global setup menggunakan baseURL; uji cepat auth flow.
- Sumber daya: 1 engineer.
- Milestones: Review → Test → Finalisasi.
- Acceptance criteria: Setup login otomatis selalu berhasil sebelum E2E.

5) Unit tests upload & coverage
- Status saat ini: Tes upload stabil; cakupan terbatas pada subset; alias/setup dibenahi.
- Kualitas sementara: Lulus; perlu ambang coverage dan tambahan kasus.
- Dependencies: Vitest config & setup.
- Langkah teknis: Tambah kasus batas; set threshold coverage; jalankan unit tests.
- Sumber daya: 1 engineer; Vitest.
- Milestones: Tambah tes → Konfigurasi coverage → Jalankan.
- Acceptance criteria: Coverage memenuhi ambang; semua tes lulus.

6) Dashboard pelacakan real‑time
- Status saat ini: Stub `observability` tersedia.
- Kualitas sementara: Belum ada data tugas & UI dashboard.
- Dependencies: Sumber data internal (JSON/route), komponen tabel/progress.
- Langkah teknis: Definisikan skema `Task`; buat store/route handler; bangun halaman dashboard (status, progress, blockers, deadline, alarm threshold); integrasi update periodik.
- Sumber daya: 1 engineer; Next.js App Router.
- Milestones: Skema & data → UI → Alarm → Integrasi.
- Acceptance criteria: Dashboard menampilkan semua tugas real‑time; alarm bekerja untuk deadline mendekat.

7) QC ketat
- Status saat ini: Checklist belum terdokumentasi formal.
- Kualitas sementara: QC dilakukan ad‑hoc melalui tes.
- Dependencies: Stakeholder untuk review/approval.
- Langkah teknis: Susun checklist; tetapkan proses review & approval; kaitkan ke PR/CI.
- Sumber daya: 1 engineer + stakeholder.
- Milestones: Draft → Adopsi → Integrasi CI.
- Acceptance criteria: Setiap pekerjaan ditandai selesai hanya setelah checklist & approval terpenuhi.

8) Dokumentasi proses
- Status saat ini: Dokumen teknis banyak; log harian belum.
- Kualitas sementara: Cakupan baik untuk teknis, kurang pada progres.
- Dependencies: Artefak test & perubahan kode.
- Langkah teknis: Buat `PROGRESS_LOG.md`; dokumentasikan perubahan & bukti; susun lessons learned.
- Sumber daya: 1 engineer.
- Milestones: Buat log → Isikan → Review.
- Acceptance criteria: Dokumentasi lengkap dan rapi dengan bukti.

9) Laporan akhir
- Status saat ini: Belum tersedia.
- Kualitas sementara: N/A.
- Dependencies: Data matriks tugas, artefak, log.
- Langkah teknis: Susun `FINAL_REPORT.md` dengan ringkasan, matriks, analisis hambatan, rekomendasi.
- Sumber daya: 1 engineer.
- Milestones: Draft → Review → Final.
- Acceptance criteria: Laporan akhir komprehensif dan dapat di‑arsipkan.

## Desain Sistem Pelacakan Real‑Time
- Arsitektur: Halaman App Router (`/observability/tasks`) yang membaca/menulis data tugas via route handler; store klien untuk refresh; opsi ekspansi ke sumber data eksternal.
- Skema data `Task`: `id`, `nama`, `status`, `owner`, `prioritas`, `urgensi`, `deadline`, `kompleksitas`, `estimasi`, `progress`, `dependencies`, `blockers`, `dokumenPendukung[]`.
- Fitur dashboard: Tabel tugas + progress bar; filter/sort; detail task; indikator blockers; badge urgensi; countdown deadline.
- Update: Mekanisme refresh berkala (mis. interval), plus endpoint update; log harian otomatis ke dokumen.
- Alarm: Notifikasi visual bila `deadline - now < threshold`; dukung email/webhook pada tahap lanjut.
- Keamanan: Akses dibatasi untuk peran admin/test; tanpa data sensitif.

## Quality Control (QC)
- Checklist: Konsistensi metadata; canonical ada & benar; OG/Twitter valid; landmark & `h1` ada; a11y Axe nol pelanggaran kritis; semua tes E2E/unit lulus; artefak lengkap; dokumen diperbarui; approval stakeholder.
- Uji fungsionalitas: Playwright E2E (meta/a11y) full; Vitest unit upload & lainnya bila relevan.
- Review stakeholder: Sesi tinjauan ringkas pada perubahan halaman & dashboard.
- Approval formal: Tag selesai hanya setelah checklist & sign‑off tercatat.

## Dokumentasi
- Catatan harian: `docs/PROGRESS_LOG.md` berisi tanggal, aktivitas, hasil.
- Perubahan: Rincian PR/patch; referensi file.
- Bukti: Tautan artefak E2E (HTML/JUnit/JSON, screenshot/video/trace).
- Lessons learned: Masalah & solusi; rekomendasi.

## Laporan Akhir
- Ringkasan eksekutif: Capaian, kualitas, risiko tersisa.
- Matriks pekerjaan: Nama, waktu mulai/selesai, durasi, sumber daya.
- Analisis hambatan & solusi: Penyebab, mitigasi, dampak.
- Rekomendasi: Efisiensi, alat/template, kebutuhan pelatihan.

## Dampak & Risiko
- Dampak: Peningkatan kualitas UX/SEO/a11y; stabilitas test; visibilitas progres.
- Risiko: Ketergantungan konfigurasi baseURL/locale; mitigasi dengan standar canonical dan tes berulang.

## Permintaan Konfirmasi
- Mohon konfirmasi rencana di atas. Setelah disetujui, saya akan langsung mengeksekusi: mulai dari prioritas tinggi (metadata, a11y, E2E) lalu melanjutkan ke dashboard, QC, dokumentasi, dan laporan akhir.