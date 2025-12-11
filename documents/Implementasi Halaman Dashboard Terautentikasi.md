## Tujuan
Mengadopsi `PageHeader` pada halaman dashboard dan memastikan konsistensi landmark aksesibilitas sesuai Authenticated layout, serta menambahkan loading state terpadu.

## Perubahan Halaman Dashboard
- Edit `apps/app/src/app/(authenticated)/dashboard/page.tsx`:
  - Impor `PageHeader` via `apps/app/src/shared/ui` (re-export dari `@sba/ui`).
  - Render `PageHeader` dengan `title`, `subtitle`, optional `breadcrumb` dan `actions`.
  - Tambah konten utama: grid kartu ringkas (mis. `Card` dari `@sba/ui`) untuk statistik/quick links.
  - Pastikan kontainer konten memakai semantik yang konsisten: section dengan `aria-labelledby` mengacu ke heading lokal.
  - Tambahkan loading state bila ada data fetch: gunakan `LoadingSpinner` dari `apps/app/src/widgets/ui/LoadingSpinner` (memastikan konsistensi dengan layout authenticated).

## Konsistensi Landmarks (Authenticated Layout)
- Verifikasi bahwa landmark `main` disediakan oleh `(authenticated)/layout.tsx`.
- Pada page, gunakan `section`/`region` dengan heading dan `aria-labelledby` untuk blok konten.
- Hindari duplikasi landmark `main` di level page.

## Pengujian
- Buat/Update test di `apps/app/src/__tests__/dashboard-page.spec.tsx`:
  - "PageHeader adoption": assert `getByRole('heading', { name: /dashboard/i })` dan keberadaan subtitle/breadcrumb.
  - "AuthenticatedLayout landmarks": assert landmark `main` ada (disediakan oleh layout), dan section konten memiliki `role="region"` + `aria-labelledby`.
  - "LoadingSpinner": saat mock state loading, assert spinner terlihat.
- Jalankan test paket `apps/app` untuk memastikan semua lulus.

## Integrasi & Gaya
- Pakai komponen dari `@sba/ui` yang sudah digunakan aplikasi (Card, Button, Tabs) via re-export/alias yang ada.
- Ikuti kelas util Tailwind yang konsisten dengan halaman authenticated lain.

## Kriteria Penerimaan
- Halaman dashboard menampilkan `PageHeader` dengan judul/subtitle.
- Landmark `main` tetap dari layout; page memiliki region terlabel dengan heading.
- Loading state terpadu dengan `LoadingSpinner`.
- Test "PageHeader adoption" dan "AuthenticatedLayout landmarks" lulus di `apps/app`.

Siap lanjut mengimplementasikan perubahan di atas begitu Anda konfirmasi.