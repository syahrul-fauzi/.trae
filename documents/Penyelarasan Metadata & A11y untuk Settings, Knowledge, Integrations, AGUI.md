**Ruang Lingkup & Tujuan**
- Selaraskan semua halaman utama (Settings, Knowledge, Integrations, AGUI) dengan skema metadata seragam dan praktik aksesibilitas WCAG 2.1 AA.
- Terapkan util bersama `generateBaseMetadata` + `validateMetadataConsistency` untuk konsistensi `metadataBase`, `canonical`, `openGraph`, dan `twitter`.
- Pastikan landmark, ARIA, kontras, navigasi keyboard, dan alt text terpenuhi.
- Tambahkan E2E + artefak Axe, validasi ringkasan, dan perbarui dokumentasi.

**Standar Metadata (Seragam)**
- Skema: `metadataBase` dari header/env; `alternates.canonical` ke `base/locale/path`; `alternates.languages` untuk `en`/`fr`; `openGraph` (type/title/description/url/siteName/images/locale); `twitter` (card/title/description/images).
- Util: gunakan `apps/app/src/shared/lib/metadata.ts` di semua halaman: Settings (`/settings`), Knowledge (`/knowledge`), Integrations (`/integrations`), AGUI (`/agui`).
- Aksi:
  - Settings: ganti `export const metadata` dengan `generateMetadata()` memanggil `generateBaseMetadata({ path: '/settings' })`.
  - Knowledge: pastikan `path: '/knowledge'` dan `metadataBase` aktif.
  - Integrations: seragam ke `generateMetadata({ path: '/integrations' })`.
  - AGUI: migrasi ke util bersama, atau tambahkan `metadataBase` bila tetap custom; path ke `'/agui'`.

**Peningkatan A11y (Menyeluruh)**
- Landmark:
  - Satu `main` global dengan `id="main-content"` via `PageContainer`.
  - Header halaman memakai `PageHeader` (`role="banner"`).
  - Bungkus blok konten dalam `section` ber-`aria-label` deskriptif (Filters, Statistics, Recent Runs/Users, Workspaces, Integrations list, Settings panels, Knowledge hub sections).
- ARIA & Keyboard:
  - Tambah `aria-labelledby`/`aria-describedby` untuk form/filter dan kontrol.
  - Pastikan komponen interaktif memiliki fokus dan perintah keyboard (Escape untuk menutup overlay/menu; Arrow/Home/End untuk daftar/tab bila ada).
- Kontras & Alt:
  - Verifikasi kontras pada kartu/header/teks; gunakan kelas util kontras yang sudah ada (mis. white/bg-white/95, overlay gelap).
  - Pastikan semua `img` mempunyai `alt` bermakna.
- Heatmap/Overlay:
  - Pastikan overlay analitik (`packages/ui/src/ui/analytics/HeatmapTracker.tsx`) tidak mengganggu fokus; beri `aria-hidden` pada elemen overlay, tombol toggle dapat di-navigasi keyboard.

**Implementasi Per Halaman (apps/app)**
- Settings: `apps/app/src/app/(authenticated)/settings/page.tsx`
  - Adopsi `generateMetadata`, tambah sections berlabel, audit gambar/icon alt.
- Knowledge: `apps/app/src/app/(authenticated)/knowledge/page.tsx`
  - Konfirmasi metadata seragam, tambahkan landmark sections untuk panel hub dan filter.
- Integrations: `apps/app/src/app/(authenticated)/integrations/page.tsx`
  - Adopsi util metadata, landmark sections untuk daftar integrasi/aksi.
- AGUI: `apps/app/src/app/(authenticated)/agui/page.tsx`
  - Selaraskan metadata (util bersama atau tambahkan `metadataBase`), landmark sections pada dashboard/tab, keyboard nav untuk Select/Tabs.

**Pengujian & Validasi**
- E2E Metadata: buat spesifikasi per halaman (`settings-meta.spec.ts`, `knowledge-meta.spec.ts`, `integrations-meta.spec.ts`, `agui-meta.spec.ts`) yang memverifikasi `<link rel="canonical">` dan `<meta property="og:url">` berawalan base dan berakhiran path.
- E2E A11y: buat spesifikasi a11y per halaman dengan Axe (`wcag2a/wcag2aa`), menegakkan nol pelanggaran; tulis artefak dengan `appendAxeArtifact` (screenshot + `contextHtml`).
- Stabilitas: gunakan selektor `data-testid` dan `role` berlabel; hindari `waitForTimeout`, gunakan `expect(...).toBeVisible()`.
- Validator Ringkasan: sertakan halaman-halaman baru di `apps/app/scripts/validate-summary.js` dan aktifkan `STRICT_A11Y=true` di CI.

**Dokumentasi**
- Release notes: ringkas perubahan metadata/a11y per halaman dan dampak UX.
- Panduan implementasi: cara memakai `generateBaseMetadata`, pola landmark, ARIA, keyboard nav.
- Best practices a11y: daftar cek WCAG 2.1 AA yang diterapkan.
- Skema metadata terbaru: contoh JSON dan mapping UI → metadata.

**Milestone & Urutan**
1) Metadata: Settings → Integrations → Knowledge → AGUI.
2) A11y: landmark & ARIA pada semua halaman; audit kontras & alt.
3) E2E: metadata + a11y per halaman; update validator dan CI.
4) Dokumentasi: README/module docs + release notes.

**Risiko & Mitigasi**
- Konflik ekspor `metadata`: gunakan hanya `generateMetadata`, hindari ekspor ganda.
- Flakiness E2E: pastikan `webServer` aktif, selektor deterministik, dan overlay tidak memerangkap fokus.

Jika disetujui, saya akan mulai dari Settings dan Integrations, lalu Knowledge dan AGUI, menambahkan tes E2E dan memperbarui dokumentasi sesuai hasil validasi.