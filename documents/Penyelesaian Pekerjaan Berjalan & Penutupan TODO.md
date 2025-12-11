## Ringkasan Pekerjaan Berjalan
- Tugas yang teridentifikasi belum selesai: 
  - Pemuatan `messages` pada adapter percakapan (`apps/web/src/shared/api/adapters/conversation.ts:83`) masih bertuliskan TODO.
  - Mekanisme refleksi/insight di UI tercatat sebagai TODO di `docs/context/README.md`.
  - Penambahan screenshot E2E lanjutan untuk dokumentasi (siap dilakukan, menunggu daftar halaman tambahan).
  - Kebisingan teardown Playwright terkait `db:test:cleanup` yang tidak tersedia (perlu dinetralisir di teardown atau script stub).
  - Peninjauan kebijakan penyimpanan artefak pengujian terkait entri `.gitignore` untuk `test-results`.

## Tugas & Checklist Penyelesaian
### T1: Lengkapi pemuatan pesan di adapter percakapan
- Persyaratan fungsional:
  - Memuat `messages` dari repositori pesan berdasarkan `conversationId` yang sedang diadaptasi.
  - Memetakan ke bentuk konsisten: `{ id, role, content, createdAt, metadata? }`.
  - Menjaga urutan kronologis; dukung kosong ([]) saat belum ada pesan.
  - Penanganan error dan fallback (log terkontrol, tanpa melempar ke UI).
- Dokumen pendukung:
  - Tambah dokumentasi adapter di `docs/api/web/adapters/conversation.md` (deskripsi, contoh bentuk data).
  - Catat perubahan di `docs/CHANGELOG.md` (section Web API Adapters).
- Testing sebelum penyelesaian:
  - Unit test untuk mapping dan ordering.
  - Integration test memverifikasi pengambilan dari repositori mock.
  - E2E (halaman percakapan) memastikan pesan tampil dan konsisten.

### T2: Mekanisme refleksi/insight di UI sesuai konteks
- Persyaratan fungsional:
  - Komponen UI untuk "Insight & Tindakan" yang bisa mencatat catatan dan TODO.
  - Persistensi lokal (state/DB ringan) dan ekspor markdown.
  - Aksesibilitas: label, peran ARIA, navigasi keyboard.
- Dokumen pendukung:
  - Pembaruan `docs/context/README.md` dengan arsitektur kecil dan contoh.
  - Storybook dokumentasi komponen.
- Testing sebelum penyelesaian:
  - Unit test komponen (render, aksi tambah/hapus catatan).
  - Accessibility test (Playwright/axe) untuk fokus dan label.
  - Snapshot visual (Storybook).

### T3: Tambahan screenshot E2E & penguatan dokumentasi
- Persyaratan fungsional:
  - Tangkap halaman yang diminta (daftar akan ditentukan) menggunakan skrip capture berbasis file report.
  - Penamaan konsisten: `nama-halaman_YYYY-MM-DD_1280x720.png`.
  - Tautkan gambar di `docs/testing/e2e-updates.md` dan `apps/app/docs/FINAL_REPORT.md`.
- Dokumen pendukung:
  - Update daftar gambar dan hasil pengujian (tanggal, ringkasan pass rate).
  - Template commit yang mencantumkan halaman dan lokasi aset.
- Testing sebelum penyelesaian:
  - Verifikasi file fisik dan tautan markdown tidak broken.
  - Jalankan lint dokumen bila tersedia.

### T4: Netralisir kebisingan teardown Playwright
- Persyaratan fungsional:
  - Hilangkan error saat skrip `db:test:cleanup` tidak ada: gunakan guard, opsi config, atau sediakan stub.
  - Pastikan laporan e2e tidak tercemar error non-kritis.
- Dokumen pendukung:
  - Catatan di `docs/testing/e2e-updates.md` mengenai perubahan teardown.
  - Catatan di `README` pengujian tentang cara menambahkan skrip cleanup.
- Testing sebelum penyelesaian:
  - Jalankan suite penuh, pastikan teardown bersih (tanpa error merah).

### T5: Kebijakan artefak pengujian & `.gitignore`
- Persyaratan fungsional:
  - Pastikan artefak penting (Playwright HTML report, JUnit/XML) tidak di-ignore.
  - Sesuaikan `.gitignore` agar hanya mengabaikan artefak ephemeral yang tidak diarsipkan.
- Dokumen pendukung:
  - Tambah kebijakan di `docs/testing/artifacts.md` (apa yang disimpan vs diabaikan).
- Testing sebelum penyelesaian:
  - Jalankan tes; verifikasi artefak tersimpan di lokasi yang diharapkan dan tidak tersapu ignore.

## Prioritas Penyelesaian
- Urutan (asumsi deadline & dampak):
  1) T3 (Dokumentasi E2E & screenshot) — dekat dengan kebutuhan laporan, dampak tinggi pada stakeholder.
  2) T1 (Adapter percakapan) — dampak bisnis tinggi pada fitur inti.
  3) T4 (Teardown bersih) — kualitas pipeline dan signal-to-noise.
  4) T5 (Artefak & .gitignore) — menjaga keberlanjutan bukti pengujian.
  5) T2 (Refleksi UI) — bernilai, namun bukan blocker.

## Alokasi Sumber Daya
- FE Engineer: T1, T2, T5.
- QA Engineer: T3, T4, dukungan T1 (E2E percakapan).
- Tech Writer/Docs: T3, T5, ringkasan dan changelog.
- Owner/Reviewer: koordinasi, code review, merge readiness.

## Timeline & Milestones (Tanggal acuan 2025-12-08)
- Hari 0–1: Selesaikan T3; gambar tambahan ditangkap, tautan diperbarui, review.
- Hari 1–2: Implement T1; unit+integration test hijau; E2E percakapan lolos.
- Hari 2: T4; jalankan suite penuh, teardown bersih.
- Hari 2–3: T5; kebijakan artefak diterapkan, verifikasi.
- Hari 3–4: T2; komponen, a11y, storybook, dokumentasi.
- Milestones:
  - M1: Dok. E2E final (T3)
  - M2: Adapter percakapan komplet & teruji (T1)
  - M3: Teardown bersih (T4)
  - M4: Kebijakan artefak efektif (T5)
  - M5: UI refleksi rilis (T2)

## Sistem Pelacakan Progres Harian
- Buat file `docs/ops/progress/daily.md` dengan format:
  - Tanggal, status per tugas (Pending/In Progress/Blocked/Done)
  - Catatan risiko, keputusan, dan tautan PR/artefak.
- Update harian oleh pemilik tugas; ringkas ke stakeholder.

## Quality Assurance
- Acceptance criteria per tugas dipenuhi.
- Type-check & lint nol error; test unit/integrasi/E2E hijau.
- Review kode silang; verifikasi a11y untuk komponen UI.
- Laporan HTML/JUnit diarsipkan; tidak ada noise teardown.

## Dokumentasi Perubahan
- Perbarui: `docs/testing/e2e-updates.md`, `apps/app/docs/FINAL_REPORT.md`, `docs/CHANGELOG.md`, dan (bila perlu) `README` pengujian.
- Sertakan daftar file aset baru, ringkasan perubahan, dan dampak.
- Gunakan template commit yang mendeskripsikan halaman/gambar & dokumen yang diubah.

## Catatan Tambahan
- Asumsi: Tidak ada deadline eksternal spesifik; prioritas di-set berdasar dampak dan kesiapan.
- Jika Anda menyediakan daftar halaman untuk T3 dan preferensi branch/penamaan, kami akan menyesuaikan segera.