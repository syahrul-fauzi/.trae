## Tujuan
- Sempurnakan dukungan overlay pada AuthLayout (warna, opacity, visibilitas) agar fleksibel dan aman.
- Pastikan overlay tidak mengganggu aksesibilitas, interaksi, dan konsistensi dengan Header/Sidebar.
- Tambah pengujian lengkap (unit, a11y, e2e) untuk mencegah regresi.

## Peningkatan Teknis
- Validasi nilai `overlayOpacity` (clamp 0..1) dan dukung format warna umum (`#hex`, `rgb(a)`, `hsl(a)`).
- Tambahkan opsi `overlayBlendMode?: CSSProperties['mixBlendMode']` dan `overlayPointerEvents?: 'auto' | 'none'` (default `none`) agar tidak memblokir interaksi.
- Pastikan overlay diberi `aria-hidden` dan tidak memiliki fokus; terapkan `data-testid` untuk pengujian.
- Dokumentasikan perilaku default (overlay aktif bila ada `backgroundImage`, tetap dapat diubah via props).

## Aksesibilitas & UX
- Landmark `main` dan skip link tetap konsisten; overlay tidak mengubah hierarki ARIA.
- Verifikasi bahwa tombol dan form di AuthLayout tetap dapat difokuskan/dioperasikan.
- Pastikan kontras visual memadai saat overlay aktif (uji dengan tema light/dark).

## Pengujian
- Unit tests: render overlay on/off, validasi clamp opacity, perubahan warna, blend-mode, pointer-events.
- A11y tests (jest-axe): halaman AuthLayout dengan overlay aktif/nonaktif, memastikan tanpa pelanggaran.
- E2E (Playwright): interaksi form (focus/submit), keyboard nav, skip link, tema light/dark dengan overlay.

## Kompatibilitas & Integrasi
- Sinkronkan perilaku overlay dengan `DashboardLayout` (skip link target `#main-content`).
- Pastikan tidak ada benturan gaya dengan Tailwind dan theme tokens yang sudah ada.
- TypeScript strict: semua props opsional dengan default aman.

## Deliverables
- Implementasi props tambahan (blend-mode, pointer-events) dan validasi.
- Test suites diperbarui (unit + a11y + e2e) dan hasil build/type-check bersih.

Konfirmasi rencana ini untuk mulai eksekusi penyempurnaan dan pengujian end-to-end.