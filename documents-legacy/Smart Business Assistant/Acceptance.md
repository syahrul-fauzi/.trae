Acceptance Criteria — SBA (Chat, Document, Tenant)

Chat Flow (Web)
- Mengirim pesan menampilkan konten di UI dalam ≤1s (cached) dan mulai streaming ≤1s.
- Kontrol expand/collapse tool call dapat diakses keyboard (Enter/Space) dan menampilkan konten terperinci.
- Tombol aksi memiliki `aria-label` (copy, feedback up/down); indikator "typing" memakai `role="status"` + `aria-live`.
- List pesan memakai peran semantik yang sesuai (`feed`/`log`) dengan `aria-live` untuk update.
- Aksesibilitas: lint a11y lulus, e2e axe tidak ada pelanggaran kritis pada halaman chat.

Document Flow (Docs)
- Memilih template dan mengisi data menghasilkan artefak (PDF/HTML) yang dapat diunduh.
- Status job menampilkan progres; bila gagal, ada pesan error dan opsi retry.
- Tombol/aksi berlabel aksesibel; konten hasil memiliki struktur semantik yang benar.
- Aksesibilitas: lint a11y lulus, e2e axe tidak ada pelanggaran kritis pada halaman dokumen.

Tenant Flow (App)
- Tenant list dapat diambil; detail dan pembaruan tenant tersimpan (RBAC sesuai).
- UI Switcher menampilkan tenant aktif, perubahan tema/branding terapply.
- Isolasi data diverifikasi; operasi lintas-tenant meminta konfirmasi.
- Aksesibilitas: kontrol ikon-only memiliki `aria-label`, navigasi keyboard berfungsi.

Kinerja & Responsivitas
- Halaman inti responsif pada viewport 360/768/1024/1440.
- Target performa: LCP < 2.5s, interaksi utama respons < 200ms (cached/idle), UI tidak mengalami jank pada scroll.

Pengujian & Verifikasi
- Unit: komponen atoms/molecules (Button, Input, Select, Dialog, Progress, Tooltip, FormField, Icon, Avatar). Threshold coverage ≥ 80% untuk komponen kunci.
- Integration: interaksi halaman (Chat kata kunci, Document form fill, Tenant settings) menjalankan alur tanpa error.
- E2E: Playwright untuk alur Chat/Document/Tenant; axe (WCAG 2A/2AA) tidak ada pelanggaran kritis.

Dokumentasi & QA
- UI/UX handbook dan CONTRIBUTING mencakup pedoman aksesibilitas (lint, ARIA, keyboard nav).
- User manual menyediakan langkah menggunakan Chat, Generate Dokumen, dan Tenant Switcher.
- Laporan hasil pengujian (lint, unit, integration, e2e + axe) dilampirkan pada review akhir.
