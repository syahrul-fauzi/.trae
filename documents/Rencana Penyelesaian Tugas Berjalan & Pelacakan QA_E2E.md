## Tujuan & Ruang Lingkup
- Menyelesaikan seluruh pekerjaan berjalan terkait UI monorepo, a11y, E2E, routing, logging, dan dokumentasi.
- Menghasilkan laporan akhir terstruktur dengan artefak pengujian, metrik kinerja, dan rekomendasi.

## Daftar Tugas Berjalan
1. Finalisasi migrasi selector ke `getByTestId` di E2E & komponen terkait.
2. Normalisasi routing App Router dan verifikasi tidak ada konflik paralel.
3. Eksekusi penuh test suite (Unit, Integration, E2E) dengan reporter HTML/JUnit/JSON dan trace.
4. Peningkatan coverage ≥80% untuk modul utama (dashboard, analytics, shared libs, AGUI).
5. Penyempurnaan logging komprehensif untuk `POST /api/test-login` dan verifikasi.
6. Penyelesaian PRD & dokumen teknis (Heatmap Analytics, Auth Layout A11y) pada path yang ditentukan.
7. Verifikasi dan penyelarasan ekspor `@sba/ui` (barrel/subpath) sesuai atomic design.
8. QC a11y (axe), performa (timing), dan artefak E2E (screenshots/videos) sebelum sign-off.

## Prioritas Penyelesaian
- P1 (Terdekat/Urgen/Dampak Tinggi): 1, 2, 3, 5.
- P2 (Menengah): 8, 7.
- P3 (Kompleks/Perlu Waktu): 4, 6.

## Status & Progress Ringkas
- Selector migrasi: mayoritas halaman login/register/reset & heatmap selesai; perlu audit sisa komponen.
- Routing: konflik paralel dibersihkan; perlu verifikasi lintasan produksi dev.
- Test suite: sebagian dijalankan; perlu run menyeluruh dan konsolidasi laporan.
- Logging `test-login`: implementasi ada; perlu audit field dan durability.
- PRD/Dokumen: sebagian konten terdokumentasi; perlu melengkapi PRD/technical di path Trae.
- Ekspor UI: PageHeader sudah via barrel; perlu audit subpath lain.
- QC a11y/performa: baseline ada; perlu hasil terbaru pasca perubahan.

## Langkah Penyelesaian per Tugas
1) Migrasi selector `getByTestId`
- Audit semua file `apps/app/e2e/**/*.spec.*` dan komponen formulir terkait.
- Tambah `data-testid` pada komponen yang belum stabil (atoms/molecules/organisms) seperlunya.
- Jalankan E2E untuk validasi kestabilan selector lintas browser.

2) Normalisasi routing
- Grep path yang berpotensi duplikat antara root dan `(authenticated)`.
- Pastikan hanya satu sumber path aktif; hapus/nullify duplikat.
- Health-check endpoint utama (`/api/test-login`, halaman auth) untuk status 200.

3) Eksekusi test suite + laporan
- Unit/integration: jalankan dengan coverage; simpan laporan HTML/JUnit/JSON.
- E2E: jalankan dengan `--trace on`, kumpulkan artefak (screenshots/videos), dan hasil axe.
- Konsolidasikan semua laporan dalam satu direktori artefak.

4) Coverage ≥80%
- Identifikasi file bercoverage rendah; tambah unit test fokus pada pure functions dan kritikal path.
- Tandai secara eksplisit pengecualian non-kritikal bila diperlukan.

5) Logging `test-login`
- Verifikasi field audit (IP, UA, duration, error stack) dan cookie kontrol.
- Uji kegagalan terkontrol untuk validasi jalur error.
- Tambah guard rate-limit sementara bila diinginkan (opsional).

6) PRD & Dokumen teknis
- Lengkapi PRD Heatmap dan Auth A11y sesuai template: tujuan, asumsi, alur UI/API, acceptance criteria, risiko.
- Lengkapi dokumen teknis: arsitektur, komponen, kontrak API, skema data, a11y/performa, uji & observabilitas.

7) Ekspor `@sba/ui`
- Audit barrel exports (atoms→molecules→organisms→templates) dan subpath `exports` di package.json.
- Sinkronkan import di apps ke barrel/subpath yang benar; perbaiki bila ada mismatch.

8) QC A11y/Performa & Artefak
- Jalankan axe dan pastikan tidak ada pelanggaran critical/serious.
- Catat timing utama (route, render, aksi form) dari E2E; dokumentasikan regresi jika ada.
- Review manual artefak (screenshots/videos) dan tanda tangan QA.

## Alokasi Sumber Daya
- E2E & QC: 1 engineer + 1 jam run lintas browser.
- Coverage & unit tests: 1 engineer + 0.5–1 hari iterasi.
- Dokumen PRD/teknis: 1 engineer + 3–4 jam.
- Routing & ekspor UI audit: 1 engineer + 1–2 jam.

## Target Waktu
- P1: selesai dalam 1 hari kerja (selector, routing, test run & laporan, logging verifikasi).
- P2: selesai dalam 1 hari kerja berikutnya (QC a11y/performa, ekspor UI audit).
- P3: selesai dalam 2 hari kerja (coverage ≥80%, PRD/teknis lengkap).

## Sistem Pelacakan
- Gunakan daftar tugas terstruktur dengan status (pending/in_progress/completed) dan pembaruan waktu.
- Catat hasil run (IDs, durasi, reporter outputs, artefak) pada log build.
- Tautkan setiap tugas ke artefak pengujian dan commit range relevan (non-commit saat ini).

## Quality Control
- Kriteria penerimaan: semua tes hijau, tidak ada pelanggaran a11y serious+, coverage ≥80% atau dikecualikan secara eksplisit, routing tanpa konflik, logging valid.
- Review rekan terhadap perubahan penting dan dokumen.

## Dokumentasi
- Tulis ringkasan proses dan hasil per tugas: perubahan, alasan, bukti (artefak/laporan), dan risiko residual.
- Simpan dokumen di path yang telah ditentukan (PRD/teknis) dan direktori artefak pengujian.

## Laporan Akhir (Struktur)
- Daftar pekerjaan diselesaikan dengan waktu penyelesaian.
- Hambatan dan solusi.
- Ringkasan metrik: pass rate, coverage, a11y findings, performa.
- Rekomendasi untuk pekerjaan sejenis (stabilisasi selector, pola routing, strategi testing, observabilitas).

Mohon konfirmasi rencana ini. Setelah disetujui, saya akan langsung mengeksekusi sesuai prioritas di atas dan menyerahkan laporan akhir dengan artefak lengkap.