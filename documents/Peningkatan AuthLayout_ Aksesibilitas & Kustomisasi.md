## Tujuan
Meningkatkan aksesibilitas, konsistensi semantik ARIA, dan opsi kustomisasi visual pada `AuthLayout` tanpa mengubah perilaku default yang sudah digunakan komponen lain.

## Perubahan Utama
1. Aksesibilitas
- Tambah `aria-labelledby` pada kontainer `role="main"` untuk mereferensi judul.
- Tambah `aria-describedby` untuk mereferensi subtitle.
- Beri `id` stabil pada elemen judul dan subtitle hanya saat keduanya dirender.
- Pastikan tombol Social Provider tetap memiliki `aria-label`, `aria-disabled`, dan `disabled` yang konsisten (sudah ada, tetapkan dan uji).

2. Kustomisasi Overlay
- Tambah props baru: `overlayColor?: string` dan `overlayOpacity?: number` dengan default `'#000'` dan `0.5`.
- Terapkan ke elemen overlay (`absolute inset-0`) via `style` agar dapat dikontrol tanpa memodifikasi kelas Tailwind.

3. Stabilitas Selektor (opsional, non-breaking)
- Tambah `data-testid` opsional pada root (mis. `data-testid="auth-layout"`) dan tombol social provider (mis. `data-testid="auth-social-provider"`) untuk memudahkan testing, tanpa mempengaruhi a11y.

## Implementasi
- Edit `packages/ui/src/templates/AuthLayout/AuthLayout.tsx`:
  - Tambah `overlayColor`, `overlayOpacity` di `AuthLayoutProps`.
  - Buat `titleId`/`subtitleId` internal (menggunakan `useId` atau fallback) saat elemen tampil.
  - Set `aria-labelledby` dan `aria-describedby` pada wrapper utama (lihat konteks id di `AuthLayout.tsx:186–201` dan wrapper di `AuthLayout.tsx:206–223`).
  - Terapkan style overlay (lihat elemen overlay di `AuthLayout.tsx:230`).

## Testing
- Update `packages/ui/src/templates/__tests__/AuthLayout.spec.tsx`:
  - Assert elemen `role="main"` memiliki `aria-labelledby` dan `aria-describedby` ketika judul/subtitle tersedia.
  - Assert social login region (`role="region"`) dan tombol provider disabled tanpa `onClick`.
  - Tambah test untuk `overlayOpacity` dan `overlayColor` (memeriksa style inline pada overlay).

## Storybook
- Update `packages/ui/src/templates/AuthLayout/AuthLayout.stories.tsx`:
  - Tambah controls untuk `overlayColor` (color picker) dan `overlayOpacity` (range 0–1 step 0.05).
  - Tambah cerita demo yang menampilkan efek overlay di atas `backgroundImage`.

## Verifikasi
- Jalankan unit test paket UI dan pastikan lulus.
- Bangun paket UI untuk memastikan tidak ada tipe/eksport yang rusak.
- Review visual di Storybook untuk props baru.

Konfirmasi untuk lanjut mengimplementasikan perubahan di atas (non-breaking, fokus a11y + kustomisasi).