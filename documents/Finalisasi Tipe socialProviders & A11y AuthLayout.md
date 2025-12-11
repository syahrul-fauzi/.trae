## Tujuan
- Menyempurnakan typing `socialProviders` (wajib `id`/`name`, opsional `icon`/`onClick` dengan fallback aman).
- Menjamin a11y yang kuat pada social login (ARIA, disabled state, fokus/keyboard).
- Melengkapi pengujian unit, a11y, dan e2e agar bebas regresi.

## Fokus File
- `packages/ui/src/templates/AuthLayout/AuthLayout.tsx:28–33` (typing `socialProviders`).
- `packages/ui/src/templates/AuthLayout/AuthLayout.tsx:104–132` (render social login & ARIA).
- `apps/web/src/app/__tests__/authlayout.a11y.spec.tsx` (uji aksesibilitas halaman auth).
- `packages/ui/src/templates/__tests__/AuthLayout.spec.tsx` (uji varian & landmark/region).

## Implementasi Typing & Fallback
- Pertahankan `id: string` dan `name: string` sebagai required.
- Jadikan `icon?: string` dan `onClick?: () => void` opsional.
- Pada render: gunakan label aman (`labelName = provider.name.trim() || 'Provider'`).
- Terapkan `disabled` + `aria-disabled` ketika `onClick` tidak ada; tambahkan styling non-interaktif.
- Sembunyikan ikon dekoratif dari screen reader (`aria-hidden="true"`).

## Aksesibilitas & Keyboard
- Pastikan `role="region"` + `aria-label="Social login options"` pada container social login.
- `type="button"` untuk tombol; `aria-label`/`title` berformat “Sign in with {name}”.
- Urutan fokus logis; Enter/Space mengaktifkan, Esc menutup elemen transient bila ada.
- Landmark konsisten: `id="main-content"` dan skip link menuju main.

## Pengujian
- Unit tests: varian login/register/reset/verify, landmark `main`, region social login, tombol disabled saat tidak ada handler.
- A11y tests (jest-axe): jalankan pada AuthLayout dengan provider (dengan & tanpa handler) untuk mendeteksi pelanggaran.
- E2E (Playwright): verifikasi keyboard nav & skip link; tema tidak mengganggu a11y.

## CI & Validasi
- Pastikan type-check untuk UI & Web bersih.
- Jalankan lint a11y dan test suites; review threshold a11y di workflow tanpa menurunkan standar.

## Delivery
- Perubahan minimal dan konsisten dengan gaya yang ada.
- Verifikasi di dev server; dokumentasikan hasil uji di PR/commit message (tanpa menambah file docs baru).

Konfirmasi rencana ini untuk mulai eksekusi dan pengujian end-to-end.