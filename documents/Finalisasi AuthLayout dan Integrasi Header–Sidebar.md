## Tujuan
- Finalisasi aksesibilitas, responsivitas, dan UX pada `AuthLayout`.
- Pastikan integrasi konsisten dengan Header/Sidebar Redesign serta dark mode.
- Tambahkan pengujian (unit, a11y, e2e) dan verifikasi CI.

## Ruang Lingkup
- Audit dan penyempurnaan `packages/ui/src/templates/AuthLayout/AuthLayout.tsx` terutama area social login `AuthLayout.tsx:104`.
- Sinkronisasi props/varian dengan Header/Sidebar di apps/app.
- Pengujian menyeluruh dan perbaikan isu residual tanpa menambah proyek baru.

## Audit AuthLayout (baris 104)
- Tinjau `renderSocialLogin()` pada `packages/ui/src/templates/AuthLayout/AuthLayout.tsx:104` untuk struktur semantik.
- Pastikan `role="region"`, `aria-label="Social login options"`, urutan `tabIndex` logis, dan elemen interaktif dapat diakses.
- Pastikan tombol social login menggunakan `type="button"` dan ikon dekoratif memiliki `aria-hidden="true"`.

## Aksesibilitas & Keyboard
- Tambah/validasi ARIA untuk Back/Help (`aria-label`) dan landmark: `main`, `form`, `contentinfo`.
- Pastikan fokus awal/logical order, Esc menutup elemen transient (dropdown, dsb bila ada), dan navigasi keyboard pada social login.
- Verifikasi skip link menuju `#main-content` konsisten dengan Header/Sidebar.

## Varian & Props
- Validasi varian: `login`, `register`, `reset-password`, `verify-email` dengan prop opsional yang memiliki default aman (strict TS).
- Pastikan penanganan error/helper text konsisten di FormField/SearchBar.
- Sinkronisasi tema: dukung `light/dark` sesuai preferensi sistem dan persistensi.

## Integrasi dengan Header/Sidebar
- Pastikan AuthLayout kompatibel dengan layout global (breadcrumbs, theme toggle, user menu) tanpa konflik gaya.
- Konsolidasikan token gaya/komponen agar selaras: ikon di Sidebar (`React.ElementType`), ekspor tipe `SidebarNavItem`.
- Verifikasi rute aktif, mobile sidebar toggle, dan konsistensi a11y.

## Pengujian
- Unit: render AuthLayout tiap varian, cek ARIA dan perilaku tombol.
- A11y: gunakan `@testing-library` + `jest-axe` untuk landmark/kontras/label.
- E2E (Playwright): alur login/register, interaksi Header/Sidebar, tema.
- Snapshot visual untuk social login section.

## Performa & UX
- Hindari re-render berlebih: memoization komponen statis, lazy-load ikon/provider jika perlu.
- Transisi tema halus, loading state di social login, dan feedback jelas.

## CI & A11y Threshold
- Pastikan job a11y di `.github/workflows/ci.yml` lulus; sesuaikan selector/threshold bila diperlukan tanpa menurunkan standar.
- Jalankan type-check lint test pada `packages/ui` dan `apps/web` hingga 0 error.

## Delivery & Verifikasi
- Implementasi perubahan minimal dan konsisten gaya.
- Verifikasi di dev server apps/web; cek halaman Auth dan navigasi.
- Feature flag opsional `HEADER_SIDEBAR_V2` untuk rollback cepat.

Konfirmasi rencana ini untuk mulai menerapkan perubahan dan pengujian.