## Tujuan
- Menyempurnakan aksesibilitas dan UX di AuthLayout, khususnya area social login.
- Memastikan konsistensi dengan Header/Sidebar, dark mode, dan skip link.
- Melengkapi pengujian unit, a11y, dan e2e untuk mencegah regresi.

## Fokus File
- `packages/ui/src/templates/AuthLayout/AuthLayout.tsx:100–134` (fungsi social login & header)
- `apps/web/src/widgets/DashboardLayout.tsx` (skip link & landmark)

## Peningkatan A11y & UX
- Audit ARIA di social login (`role="region"`, `aria-label`) dan tombol provider di `packages/ui/src/templates/AuthLayout/AuthLayout.tsx:104–132`.
- Urutan fokus & keyboard: pastikan `tabIndex` logis, Esc menutup elemen transient, Enter/Space mengaktivasi tombol.
- Landmark konsisten: `id="main-content"`, skip link menuju main di AuthLayout dan Dashboard.
- Ikon dekoratif: `aria-hidden="true"` tetap pada ikon non-informatif.

## Ketahanan & Tipe
- Hardening tipe `socialProviders`: validasi `icon/name/onClick` agar aman, dan fallback ikon bila tidak tersedia.
- Proteksi null/undefined untuk prop opsional sesuai strict TS.

## Sinkronisasi Integrasi
- Konsistensi gaya/tema dengan Header/Sidebar: pastikan dark mode persist dan aria-pressed benar.
- Verifikasi breadcrumb, user menu, dan mobile sidebar toggle tidak mengganggu AuthLayout.

## Pengujian
- Unit tests: varian login/register/reset/verify; landmark `main`; render social login.
- A11y tests (jest-axe): memastikan tidak ada pelanggaran di AuthLayout halaman dasar.
- E2E (Playwright): alur login/register, keyboard nav, skip link, tema.
- Snapshot visual untuk social login section.

## CI & Threshold
- Jalankan type-check & lint a11y; pastikan job CI A11y lulus tanpa menurunkan threshold.
- Tambahkan test ke pipeline bila belum terdaftar.

## Delivery
- Perubahan minimal dan sesuai konvensi yang ada.
- Verifikasi di dev server apps/web; review konsistensi antara AuthLayout dan Dashboard.

Konfirmasi rencana ini untuk mulai implementasi dan pengujian.